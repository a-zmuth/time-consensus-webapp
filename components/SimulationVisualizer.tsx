// src/components/SimulationVisualizer.tsx
import React from 'react';
import AgentCard from './AgentCard';
import { Agent } from '../app/page'; // Assuming Agent interface is exported from page.tsx

interface SimulationVisualizerProps {
  externalWorld: string;
  agents: Agent[];
}

const SimulationVisualizer: React.FC<SimulationVisualizerProps> = ({ externalWorld, agents }) => {
  return (
    <div className="simulation-visualizer">
      <h4 className="mb-3">External World:</h4>
      <p className="border p-3 mb-4">{externalWorld}</p>

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
