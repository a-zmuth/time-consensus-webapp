// src/components/AgentCard.tsx
import React from 'react';
import { ProgressBar, Badge } from 'react-bootstrap'; // Import ProgressBar and Badge

interface AgentCardProps {
  agentId: number;
  memory: string;
  isImage: boolean; // New prop
  status: string; // e.g., "Scrambled", "Verifying", "Consensus"
  similarityScore?: number;
  timestamp?: string;
}

const AgentCard: React.FC<AgentCardProps> = ({ agentId, memory, isImage, status, similarityScore, timestamp }) => {

  const getStatusColorClass = () => {
    switch(status) {
      case 'Scrambled':
        return 'bg-danger-subtle';
      case 'Refining':
        return 'bg-info-subtle';
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

  const getStatusBadgeVariant = () => {
    switch(status) {
      case 'Scrambled':
        return 'danger';
      case 'Refining':
        return 'info';
      case 'Verifying':
      case 'Verified':
        return 'warning';
      case 'Consensus':
      case 'Consensus Leader':
        return 'success';
      default:
        return 'secondary';
    }
  };

  return (
    <div className={`card h-100 ${getStatusColorClass()}`}> {/* h-100 for consistent height */}
      <div className="card-body d-flex flex-column"> {/* Use flexbox for layout */}
        <h6 className="card-subtitle mb-2 text-muted d-flex justify-content-between align-items-center">
          Agent {agentId}
          <Badge bg={getStatusBadgeVariant()}>{status}</Badge>
        </h6>
        <div className="flex-grow-1"> {/* Allows memory content to take available space */}
          <strong>Memory:</strong>{" "}
          {isImage ? (
            <div className="text-center my-2"> {/* Center image and add margin */}
              <img src={memory} alt={`Agent ${agentId} memory`} style={{ maxWidth: '100%', maxHeight: '100px', objectFit: 'contain' }} className="img-fluid border rounded" />
            </div>
          ) : (
            <p className="card-text border p-2 rounded bg-light small text-break" style={{ maxHeight: '100px', overflowY: 'auto' }}>
              {memory.substring(0, 500)}... {/* Increased substring for better text display */}
            </p>
          )}
        </div>
        {similarityScore !== undefined && (
          <div className="mt-2">
            <strong>Similarity:</strong> {similarityScore.toFixed(2)}%
            <ProgressBar now={similarityScore} variant={getStatusBadgeVariant()} className="mt-1" />
          </div>
        )}
        {timestamp && <p className="card-text mt-2"><small className="text-muted">{timestamp}</small></p>}
      </div>
    </div>
  );
};

export default AgentCard;
