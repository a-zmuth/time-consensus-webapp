"use client";

import React, { useState, useEffect } from "react";
import Controls from "../components/Controls";
import SimulationVisualizer from "../components/SimulationVisualizer";
import EventLog from "../components/EventLog";
import { compareTwoStrings } from 'string-similarity';

// NEW IMPORTS
import { Agent } from "../types/agent";
import { scrambleText } from "../utils/scrambleText";
import { scrambleImage } from "../utils/scrambleImage";
import { compareImages } from "../utils/compareImages";
import { swapImageBlocks } from "../utils/swapImageBlocks";

// Simulation Steps:
// 0: Idle
// 1: Scramble
// 2: Verify
// 3: Collaborative Refinement
// 4: Final Consensus
// 5: Complete
const COMMUNICATION_ROUNDS = 5;

export default function Home() {
  const [numAgents, setNumAgents] = useState(3);
  const [externalWorld, setExternalWorld] = useState<string>("");
  const [isExternalWorldImage, setIsExternalWorldImage] = useState<boolean>(false);
  const [agents, setAgents] = useState<Agent[]>([]);
  const [logs, setLogs] = useState<string[]>([]);
  const [simulationRunning, setSimulationRunning] = useState(false);
  const [simulationStep, setSimulationStep] = useState(0);
  const [currentRound, setCurrentRound] = useState(0); // For communication rounds

  useEffect(() => {
    if (!simulationRunning || simulationStep === 0) return;

    const runSimulationStep = async () => {
      if (simulationStep === 1) { // Scramble Memories
        setLogs(prev => [...prev, `[${new Date().toLocaleTimeString()}] Stage 1: Scrambling Agent Memories...`]);
        setCurrentRound(0);
        const initialAgents: Agent[] = await Promise.all(
          Array.from({ length: numAgents }, async (_, i) => {
            const scrambledMemory = isExternalWorldImage
              ? await scrambleImage(externalWorld)
              : scrambleText(externalWorld);
            return {
              agentId: i + 1,
              memory: scrambledMemory,
              isImage: isExternalWorldImage,
              status: "Scrambled",
              timestamp: new Date().toLocaleTimeString(),
            };
          })
        );
        setAgents(initialAgents);
        await new Promise(resolve => setTimeout(resolve, 500));
        setSimulationStep(2);
      } else if (simulationStep === 2) { // Verification
        setLogs(prev => {
          const verificationType = currentRound === 0 ? "Initial" : `Post-Round ${currentRound}`;
          return [...prev, `[${new Date().toLocaleTimeString()}] Stage 2: Agents Performing ${verificationType} Verification...`];
        });
        
        setAgents(prevAgents => {
          const verifyPromises = prevAgents.map(async (agent) => {
            const score = agent.isImage
              ? await compareImages(agent.memory, externalWorld)
              : compareTwoStrings(agent.memory, externalWorld) * 100;
            setLogs(prev => [...prev, `[${new Date().toLocaleTimeString()}] Agent ${agent.agentId} verified, similarity: ${score.toFixed(2)}%.`]);
            return { ...agent, similarityScore: score, status: "Verified" };
          });
          Promise.all(verifyPromises).then(verifiedAgents => {
            setAgents(verifiedAgents);
            if (currentRound < COMMUNICATION_ROUNDS) {
              setSimulationStep(3);
            } else {
              setSimulationStep(4);
            }
          });
          return prevAgents; // No immediate change to agents state here
        });
      } else if (simulationStep === 3) { // Collaborative Refinement
        setCurrentRound(prevRound => {
          const round = prevRound + 1;
          setLogs(prev => [...prev, `[${new Date().toLocaleTimeString()}] Stage 3: Collaborative Refinement Round ${round}/${COMMUNICATION_ROUNDS}...`]);
          
          setAgents(prevAgents => {
            let updatedAgents = [...prevAgents];
            const swapPromises = [];

            for (let i = 0; i < updatedAgents.length; i++) {
              const agentA = updatedAgents[i];
              const agentB = updatedAgents[Math.floor(Math.random() * updatedAgents.length)];

              if (agentA.agentId !== agentB.agentId && (agentB.similarityScore || 0) > (agentA.similarityScore || 0)) {
                setLogs(prev => [...prev, `[${new Date().toLocaleTimeString()}] Agent ${agentA.agentId} is learning from Agent ${agentB.agentId}.`]);
                if (agentA.isImage) {
                  const promise = swapImageBlocks(agentA.memory, agentB.memory).then(([newMemoryA, newMemoryB]) => {
                    const indexA = updatedAgents.findIndex(a => a.agentId === agentA.agentId);
                    const indexB = updatedAgents.findIndex(a => a.agentId === agentB.agentId);
                    if (indexA !== -1) updatedAgents[indexA] = { ...updatedAgents[indexA], memory: newMemoryA, status: "Refining" };
                    if (indexB !== -1) updatedAgents[indexB] = { ...updatedAgents[indexB], memory: newMemoryB };
                  });
                  swapPromises.push(promise);
                } else {
                  const indexA = updatedAgents.findIndex(a => a.agentId === agentA.agentId);
                  if (indexA !== -1) updatedAgents[indexA] = { ...updatedAgents[indexA], memory: agentB.memory, status: "Refining" };
                }
              }
            }
            Promise.all(swapPromises).then(() => {
              setAgents(updatedAgents);
              setSimulationStep(2);
            });
            return prevAgents;
          });
          return round;
        });
      } else if (simulationStep === 4) { // Final Consensus
        setLogs(prev => [...prev, `[${new Date().toLocaleTimeString()}] Stage 4: Reaching Final Consensus...`]);
        const bestAgent = agents.reduce((prev, current) => (prev.similarityScore || 0) > (current.similarityScore || 0) ? prev : current);
        
        setLogs(prev => [...prev, `[${new Date().toLocaleTimeString()}] Consensus Reached: Agent ${bestAgent.agentId} has the most accurate memory.`]);
        setLogs(prev => [...prev, `[${new Date().toLocaleTimeString()}] Final Consensus Memory: ${bestAgent.isImage ? "Image Data" : `"${bestAgent.memory.substring(0, 100)}..."`}`]);
        const finalConsensusScore = bestAgent.similarityScore || 0;
        setLogs(prev => [...prev, `[${new Date().toLocaleTimeString()}] Consensus Memory Similarity to External World: ${finalConsensusScore.toFixed(2)}%.`]);

        setAgents(prevAgents => prevAgents.map(agent => ({ ...agent, status: agent.agentId === bestAgent.agentId ? "Consensus Leader" : "Consensus" })));
        setSimulationRunning(false);
        setSimulationStep(5);
      } else if (simulationStep === 5) { // Complete
        setLogs(prev => [...prev, `[${new Date().toLocaleTimeString()}] Simulation Complete.`]);
      }
    };

    runSimulationStep();
  }, [simulationRunning, simulationStep, numAgents, externalWorld, isExternalWorldImage]); // Removed agents and currentRound


  const handleStartSimulation = () => {
    setLogs([]);
    setAgents([]);
    setSimulationRunning(true);
    setSimulationStep(1); // Start scrambling
  };

  const handleResetSimulation = () => {
    setLogs([]);
    setAgents([]);
    setSimulationRunning(false);
    setSimulationStep(0);
    setExternalWorld(""); // Reset to empty string
    setIsExternalWorldImage(false); // Reset image flag
    setNumAgents(3); // Reset to default
  };

  const handleSetExternalWorld = (text: string) => {
    setExternalWorld(text);
    setIsExternalWorldImage(false); // It's text, so set image flag to false
  };

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onloadend = () => {
      setExternalWorld(reader.result as string); // Set externalWorld to the data URL
      setIsExternalWorldImage(true); // Set image flag to true
      setLogs(prev => [...prev, `[${new Date().toLocaleTimeString()}] Image uploaded and set as External World.`]);
    };
    reader.readAsDataURL(file);
  };

  return (
    <div className="container-fluid py-4">
      <h1 className="text-center mb-4">Time Consensus Simulation</h1>
      <div className="row">
        <div className="col-lg-4 mb-4">
          <Controls
            numAgents={numAgents}
            setNumAgents={setNumAgents}
            externalWorld={externalWorld}
            setExternalWorld={handleSetExternalWorld} // Use wrapper function
            onStartSimulation={handleStartSimulation}
            onImageUpload={handleImageUpload}
            onResetSimulation={handleResetSimulation}
            simulationRunning={simulationRunning}
          />
        </div>
        <div className="col-lg-8 mb-4">
          <SimulationVisualizer
            externalWorld={externalWorld}
            isExternalWorldImage={isExternalWorldImage} // Pass image flag
            agents={agents}
          />
          <EventLog logs={logs} />
        </div>
      </div>
    </div>
  );
}