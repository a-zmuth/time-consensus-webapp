export interface Agent {
    agentId: number;
    memory: string; // Can be text or a data URL for an image
    isImage: boolean; // Indicates if the memory is an image
    status: string;
    similarityScore?: number;
    timestamp?: string;
  }
  