// src/components/SimulationVisualizer.tsx
import React from 'react';
import AgentCard from './AgentCard';
import { Agent } from '../types/agent'; 

interface SimulationVisualizerProps {
  externalWorld: string;
  isExternalWorldImage: boolean; // New prop
  agents: Agent[];
}

const SimulationVisualizer: React.FC<SimulationVisualizerProps> = ({ externalWorld, isExternalWorldImage, agents }) => {
  return (
    <div className="simulation-visualizer">
      <h4 className="mb-3">External World:</h4>
      {isExternalWorldImage ? (
        // Render image if it's an image
        <div className="border p-3 mb-4 text-center">
          <img src={externalWorld} alt="External World" style={{ maxWidth: '100%', maxHeight: '200px', objectFit: 'contain' }} />
        </div>
      ) : (
        // Render text if it's text
        <p className="border p-3 mb-4">{externalWorld}</p>
      )}

      <h4 className="mb-3">Agents:</h4>
      <div className="row">
        {agents.map(agent => (
          <div key={agent.agentId} className="col-md-4 mb-3"> {/* Added mb-3 for spacing */}
            <AgentCard {...agent} />
          </div>
        ))}
      </div>
    </div>
  );
};

export default SimulationVisualizer;

