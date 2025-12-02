// src/components/Controls.tsx
import React from 'react';
import { Form, Button } from 'react-bootstrap';

interface ControlsProps {
  numAgents: number;
  setNumAgents: (num: number) => void;
  externalWorld: string;
  setExternalWorld: (text: string) => void;
  onStartSimulation: () => void;
  onImageUpload: (event: React.ChangeEvent<HTMLInputElement>) => void;
  onResetSimulation: () => void;
  simulationRunning: boolean;
}

const Controls: React.FC<ControlsProps> = ({
  numAgents,
  setNumAgents,
  externalWorld,
  setExternalWorld,
  onStartSimulation,
  onImageUpload,
  onResetSimulation,
  simulationRunning,
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
              disabled={simulationRunning}
            />
          </Form.Group>

          <Form.Group className="mb-3" controlId="externalWorldText">
            <Form.Label>External World Text</Form.Label>
            <Form.Control
              as="textarea"
              rows={5}
              value={externalWorld}
              onChange={(e) => setExternalWorld(e.target.value)}
              placeholder="Describe your reality here..."
              disabled={simulationRunning}
            />
          </Form.Group>

          {/* New Form.Group for Image Upload */}
          <Form.Group className="mb-3" controlId="imageUpload">
            <Form.Label>Upload Image</Form.Label>
            <Form.Control
              type="file"
              accept="image/*"
              onChange={onImageUpload}
              disabled={simulationRunning}
            />
          </Form.Group>

          <div className="d-grid gap-2 mb-3">
            <Button variant="primary" onClick={onStartSimulation} disabled={simulationRunning}>
              Start Simulation
            </Button>
            <Button variant="warning" onClick={onResetSimulation} disabled={!simulationRunning}>
              Reset Simulation
            </Button>
          </div>
        </Form>
      </div>
    </div>
  );
};

export default Controls;


