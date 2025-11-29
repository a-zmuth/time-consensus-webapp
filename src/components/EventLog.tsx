// src/components/EventLog.tsx
import React from 'react';

interface EventLogProps {
  logs: string[];
}

const EventLog: React.FC<EventLogProps> = ({ logs }) => {
  return (
    <div className="card mt-4">
      <div className="card-body">
        <h5 className="card-title">Event Log</h5>
        <div className="log-container" style={{ maxHeight: '300px', overflowY: 'auto', backgroundColor: '#f8f9fa', padding: '10px', borderRadius: '5px' }}>
          {logs.map((log, index) => (
            <p key={index} className="mb-1 text-monospace"><small>{log}</small></p>
          ))}
        </div>
      </div>
    </div>
  );
};

export default EventLog;
