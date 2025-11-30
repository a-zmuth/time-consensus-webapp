// src/components/Controls.tsx
import React from 'react';
import { Form, Button } from 'react-bootstrap';

interface ControlsProps {
  numAgents: number;
  setNumAgents: (num: number) => void;
  externalWorld: string;
  setExternalWorld: (text: string) => void;
  onStartSimulation: () => void;
  onGenerateExternalWorld: () => void;
  onResetSimulation: () => void; // New prop
  simulationRunning: boolean; // New prop
}

const Controls: React.FC<ControlsProps> = ({
  numAgents,
  setNumAgents,
  externalWorld,
  setExternalWorld,
  onStartSimulation,
  onGenerateExternalWorld,
  onResetSimulation, // Destructure new prop
  simulationRunning, // Destructure new prop
}) => {
  return (
    <div className="card mb-3">
      <div className="card-body">
        <h5 className="card-title">Simulation Controls</h5>
        <Form>
          <Form.Group className="mb-3" controlId="numAgents">
            <Form.Label>Number of Agents: {numAgents}</Form.Label>
            <Form.Range
              min={1}
              max={10}
              value={numAgents}
              onChange={(e) => setNumAgents(parseInt(e.target.value))}
              disabled={simulationRunning} // Disable when simulation is running
            />
          </Form.Group>

          <Form.Group className="mb-3" controlId="externalWorldText">
            <Form.Label>External World Text</Form.Label>
            <Form.Control
              as="textarea"
              rows={5}
              value={externalWorld}
              onChange={(e) => setExternalWorld(e.target.value)}
              placeholder="Enter the external world text here, or auto-generate."
              disabled={simulationRunning} // Disable when simulation is running
            />
          </Form.Group>

          <div className="d-grid gap-2 mb-3">
            <Button variant="secondary" onClick={onGenerateExternalWorld} disabled={simulationRunning}>
              Auto-Generate External World
            </Button>
            <Button variant="primary" onClick={onStartSimulation} disabled={simulationRunning}>
              Start Simulation
            </Button>
            <Button variant="warning" onClick={onResetSimulation} disabled={!simulationRunning}> {/* Enable only when simulation is running */}
              Reset Simulation
            </Button>
          </div>
        </Form>
      </div>
    </div>
  );
};

export default Controls;

