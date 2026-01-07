export interface Agent {
    agentId: number;
    memory: string; // Can be text or a data URL for an image or video
    isImage: boolean; // Indicates if the memory is an image
    isVideo?: boolean; // Indicates if the memory is a video
    status: string;
    similarityScore?: number;
    timestamp?: string;
  }
  