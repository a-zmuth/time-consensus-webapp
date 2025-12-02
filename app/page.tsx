"use client";

import React, { useState, useEffect } from "react";
import Controls from "../components/Controls";
import SimulationVisualizer from "../components/SimulationVisualizer";
import EventLog from "../components/EventLog";
import { compareTwoStrings } from 'string-similarity';

// NEW IMPORTS
import { Agent } from "../types/agent";
import { scrambleText } from "../utils/scrambleText";
import { scrambleImage } from "../utils/scrambleImage"; // Import scrambleImage
import { compareImages } from "../utils/compareImages"; // Import compareImages

export default function Home() {
  const [numAgents, setNumAgents] = useState(3);
  const [externalWorld, setExternalWorld] = useState<string>("The quick brown fox jumps over the lazy dog. This is a classic pangram used to display all letters of the alphabet.");
  const [isExternalWorldImage, setIsExternalWorldImage] = useState<boolean>(false); // New state for image flag
  const [agents, setAgents] = useState<Agent[]>([]);
  const [logs, setLogs] = useState<string[]>([]);
  const [simulationRunning, setSimulationRunning] = useState(false);
  const [simulationStep, setSimulationStep] = useState(0); // 0: Idle, 1: Scramble, 2: Verify, 3: Consensus, 4: Complete

  useEffect(() => {
    // This effect will trigger when simulationStep changes to advance the simulation
    if (!simulationRunning || simulationStep === 0) return;

    const runSimulationStep = async () => {
      if (simulationStep === 1) { // Scramble Memories
        setLogs(prev => [...prev, `[${new Date().toLocaleTimeString()}] Stage 1: Scrambling Agent Memories...`]);
        const initialAgents: Agent[] = await Promise.all(
          Array.from({ length: numAgents }, async (_, i) => {
            const scrambledMemory = isExternalWorldImage
              ? await scrambleImage(externalWorld)
              : scrambleText(externalWorld);
            return {
              agentId: i + 1,
              memory: scrambledMemory,
              isImage: isExternalWorldImage, // Set isImage for the agent
              status: "Scrambled",
              timestamp: new Date().toLocaleTimeString(),
            };
          })
        );
        setAgents(initialAgents);
        await new Promise(resolve => setTimeout(resolve, 500)); // REDUCED DELAY
        setSimulationStep(2);
      } else if (simulationStep === 2) { // Individual Verification
        setLogs(prev => [...prev, `[${new Date().toLocaleTimeString()}] Stage 2: Agents Performing Individual Verification...`]);
        const verifiedAgents = await Promise.all(agents.map(async (agent) => {
          await new Promise(resolve => setTimeout(resolve, 50)); // REDUCED DELAY
          const score = agent.isImage
            ? await compareImages(agent.memory, externalWorld)
            : compareTwoStrings(agent.memory, externalWorld);
          setLogs(prev => [...prev, `[${new Date().toLocaleTimeString()}] Agent ${agent.agentId} verified its memory, similarity: ${score.toFixed(2)}%.`]);
          return {
            ...agent,
            similarityScore: score,
            status: "Verified",
            timestamp: new Date().toLocaleTimeString(),
          };
        }));
        setAgents(verifiedAgents);
        await new Promise(resolve => setTimeout(resolve, 500)); // REDUCED DELAY
        setSimulationStep(3);
      } else if (simulationStep === 3) { // Consensus (simplified for now)
        setLogs(prev => [...prev, `[${new Date().toLocaleTimeString()}] Stage 3: Agents Communicating for Consensus...`]);
        await new Promise(resolve => setTimeout(resolve, 1000)); // REDUCED DELAY

        // Simple consensus: agent with highest similarity "wins"
        const bestAgent = agents.reduce((prev, current) =>
          (prev.similarityScore || 0) > (current.similarityScore || 0) ? prev : current
        );

        setLogs(prev => [...prev, `[${new Date().toLocaleTimeString()}] Consensus Reached: Agent ${bestAgent.agentId} has the most accurate memory.`]);
        // Only log substring if it's text, otherwise it's a data URL
        setLogs(prev => [...prev, `[${new Date().toLocaleTimeString()}] Final Consensus Memory: "${bestAgent.isImage ? "Image Data" : bestAgent.memory.substring(0, 100)}..."`]);

        const finalConsensusScore = bestAgent.isImage
          ? await compareImages(bestAgent.memory, externalWorld)
          : compareTwoStrings(bestAgent.memory, externalWorld);
        setLogs(prev => [...prev, `[${new Date().toLocaleTimeString()}] Consensus Memory Similarity to External World: ${finalConsensusScore.toFixed(2)}%.`]);

        setAgents(agents.map(agent => ({
          ...agent,
          status: agent.agentId === bestAgent.agentId ? "Consensus Leader" : "Consensus",
          timestamp: new Date().toLocaleTimeString(),
        })));

        setSimulationRunning(false);
        setSimulationStep(4);
      } else if (simulationStep === 4) { // Simulation Complete
        setLogs(prev => [...prev, `[${new Date().toLocaleTimeString()}] Simulation Complete.`]);
      }
    };

    runSimulationStep();
  }, [simulationRunning, simulationStep, numAgents, externalWorld, isExternalWorldImage]); // Added isExternalWorldImage to dependencies

  const handleStartSimulation = () => {
    setLogs([]); // Clear logs on new simulation
    setAgents([]); // Clear agents on new simulation
    setSimulationRunning(true);
    setSimulationStep(1); // Start scrambling
  };

  const handleResetSimulation = () => {
    setLogs([]);
    setAgents([]);
    setSimulationRunning(false);
    setSimulationStep(0);
    setExternalWorld("The quick brown fox jumps over the lazy dog. This is a classic pangram used to display all letters of the alphabet."); // Reset to default text
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

