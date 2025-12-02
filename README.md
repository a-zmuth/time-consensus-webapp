# Time Consensus Simulation

This project is an interactive web-based simulation of a thought experiment concerning the nature of time, memory, and consensus. It was inspired by a thought experiment I had last year... to explore how individual agents with flawed "memories" might collaborate to reconstruct a shared "reality."

## The Concept

Humans perceive time by organising events chronologically. This mental model is our map of reality. What if this map was scrambled?

This simulation explores that question by creating "agents" with scrambled text-based or image-based memories of an original "external world." It visualises their process of:

1.  **Individual Verification:** Each agent compares its own scrambled memory to the true external world to gauge its own accuracy.
2.  **Collaborative Refinement:** Agents communicate with each other over several rounds. In each round, an agent compares its accuracy with another random agent. If the other agent is more accurate, the first agent will "learn" from it by either adopting its memory (for text) or swapping a random portion of its memory blocks (for images).
3.  **Reaching Consensus:** After the collaborative rounds, a final "Consensus Leader" is chosen. This is the agent with the most accurate memory after the process of communication and refinement.

The simulation allows users to configure the number of agents and the "external world" itself, providing a sandbox to explore how consensus can emerge from chaos.

## Getting Started

This is a [Next.js](https://nextjs.org) project. To get started, you'll need to have [Node.js](https://nodejs.org/) and `npm` installed.

### 1. Installation

First, navigate to the project directory and install the necessary dependencies:

```bash
npm install
```

### 2. Running the Development Server

Once the dependencies are installed, you can run the development server:

```bash
npm run dev
```

This will start the application, typically on port 3000.

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## How to Use the Simulation

The application interface is divided into two main sections: the **Control Panel** on the left and the **Visualisation Area** on the right.

### Control Panel

This is where you configure the simulation:

*   **Number of Agents:** Use the slider to select how many agents (from 1 to 10) will participate in the simulation.
*   **External World Text:** This is the "ground truth" that agents will compare their memories against. You can type or paste your own text into the text area.
*   **Upload Image:** You can upload an image file (PNG, JPG, GIF, etc.) to set the external world as an image. This image will be used as the "ground truth" that agents will try to reconstruct.
*   **Start Simulation:** Begins the simulation process. The controls will be disabled while a simulation is running.
*   **Reset Simulation:** Stops the current simulation and resets all parameters and visuals to their default state.

### Visualisation Area

This area shows the simulation as it unfolds in real-time.

*   **External World:** The ground truth (text or image) is displayed at the top for reference.
*   **Agents:** Each agent is represented by a card. The card's colour and content will change as it moves through the simulation stages:
    *   **Red Tint (Scrambled):** The agent's initial, scrambled memory (text or image).
    *   **Orange Tint (Refining):** The agent is in a collaborative round, learning from other agents.
    *   **Yellow Tint (Verified):** The agent has compared its memory to the external world and calculated a similarity score.
    *   **Green Tint (Consensus):** The simulation has ended, and this agent is part of the final consensus group. The "Consensus Leader" is the agent whose memory was chosen as the most accurate.
*   **Event Log:** At the bottom, a detailed, timestamped log narrates the entire process, from scrambling memories, through collaborative refinement rounds, to the final consensus decision.

Simply configure your desired parameters and click "Start Simulation" to watch the agents attempt to find order in the chaos.
