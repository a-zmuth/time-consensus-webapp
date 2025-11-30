"use client";

import React, { useState, useEffect } from "react";
import Controls from "../components/Controls";
import SimulationVisualizer from "../components/SimulationVisualizer";
import EventLog from "../components/EventLog";
import { compareTwoStrings } from 'string-similarity';

// Define Agent interface and export it for use in other components
export interface Agent {
  agentId: number;
  memory: string;
  status: string; // e.g., "Scrambled", "Verifying", "Verified", "Communicating", "Consensus"
  similarityScore?: number; // Similarity to the external world
  timestamp?: string;
}

// Utility function to scramble text
const scrambleText = (text: string): string => {
  if (text.length < 5) return text.split('').sort(() => 0.5 - Math.random()).join(''); // Simple scramble for short texts

  let scrambled = text;
  // Introduce some errors: deletions, insertions, substitutions
  const errorCount = Math.floor(text.length * 0.1); // 10% errors

  for (let i = 0; i < errorCount; i++) {
    const type = Math.random();
    const index = Math.floor(Math.random() * scrambled.length);
    const char = String.fromCharCode(97 + Math.floor(Math.random() * 26)); // Random lowercase letter

    if (type < 0.33 && scrambled.length > 1) { // Deletion
      scrambled = scrambled.substring(0, index) + scrambled.substring(index + 1);
    } else if (type < 0.66) { // Insertion
      scrambled = scrambled.substring(0, index) + char + scrambled.substring(index);
    } else { // Substitution
      scrambled = scrambled.substring(0, index) + char + scrambled.substring(index + 1);
    }
  }
  return scrambled;
};

export default function Home() {
  const [numAgents, setNumAgents] = useState(3);
  const [externalWorld, setExternalWorld] = useState("The quick brown fox jumps over the lazy dog. This is a classic pangram used to display all letters of the alphabet.");
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
        const initialAgents: Agent[] = Array.from({ length: numAgents }, (_, i) => ({
          agentId: i + 1,
          memory: scrambleText(externalWorld),
          status: "Scrambled",
          timestamp: new Date().toLocaleTimeString(),
        }));
        setAgents(initialAgents);
        await new Promise(resolve => setTimeout(resolve, 500)); // REDUCED DELAY
        setSimulationStep(2);
      } else if (simulationStep === 2) { // Individual Verification
        setLogs(prev => [...prev, `[${new Date().toLocaleTimeString()}] Stage 2: Agents Performing Individual Verification...`]);
        const verifiedAgents = await Promise.all(agents.map(async (agent) => {
          await new Promise(resolve => setTimeout(resolve, 50)); // REDUCED DELAY
          const score = compareTwoStrings(agent.memory, externalWorld) * 100;
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
        setLogs(prev => [...prev, `[${new Date().toLocaleTimeString()}] Final Consensus Memory: "${bestAgent.memory.substring(0, 100)}..."`]);

        const finalConsensusScore = compareTwoStrings(bestAgent.memory, externalWorld) * 100;
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
  }, [simulationRunning, simulationStep, numAgents, externalWorld]); // Dependencies -- REMOVED 'agents'

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
    setExternalWorld("The quick brown fox jumps over the lazy dog. This is a classic pangram used to display all letters of the alphabet."); // Reset to default
    setNumAgents(3); // Reset to default
  };

  const handleGenerateExternalWorld = () => {
    const generatedText = "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.";
    setExternalWorld(generatedText);
    setLogs(prev => [...prev, `[${new Date().toLocaleTimeString()}] External World auto-generated.`]);
  };

  return (
    <div className="container-fluid py-4">
      <h1 className="text-center mb-4">Time Consensus Simulation</h1>
      <div className="row">
        <div className="col-lg-4">
          <Controls
            numAgents={numAgents}
            setNumAgents={setNumAgents}
            externalWorld={externalWorld}
            setExternalWorld={setExternalWorld}
            onStartSimulation={handleStartSimulation}
            onGenerateExternalWorld={handleGenerateExternalWorld}
            onResetSimulation={handleResetSimulation} // Pass reset handler
            simulationRunning={simulationRunning} // Pass simulation state to disable controls
          />
        </div>
        <div className="col-lg-8">
          <SimulationVisualizer externalWorld={externalWorld} agents={agents} />
          <EventLog logs={logs} />
        </div>
      </div>
    </div>
  );
}
