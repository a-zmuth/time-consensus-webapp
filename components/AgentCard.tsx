// src/components/AgentCard.tsx
import React from 'react';

interface AgentCardProps {
  agentId: number;
  memory: string;
  status: string; // e.g., "Scrambled", "Verifying", "Consensus"
  similarityScore?: number;
  timestamp?: string;
}

const AgentCard: React.FC<AgentCardProps> = ({ agentId, memory, status, similarityScore, timestamp }) => {

  const getStatusColorClass = () => {
    switch(status) {
      case 'Scrambled':
        return 'bg-danger-subtle';
      case 'Verifying':
      case 'Verified':
        return 'bg-warning-subtle';
      case 'Consensus':
      case 'Consensus Leader':
        return 'bg-success-subtle';
      default:
        return '';
    }
  };

  return (
    <div className={`card mb-3 ${getStatusColorClass()}`}>
      <div className="card-body">
        <h6 className="card-subtitle mb-2 text-muted">Agent {agentId}</h6>
        <p className="card-text"><strong>Status:</strong> {status}</p>
        <p className="card-text"><strong>Memory:</strong> {memory.substring(0, 100)}...</p>
        {similarityScore !== undefined && <p className="card-text"><strong>Similarity:</strong> {similarityScore.toFixed(2)}%</p>}
        {timestamp && <p className="card-text"><small className="text-muted">{timestamp}</small></p>}
      </div>
    </div>
  );
};

export default AgentCard;
