// utils/compareVideos.ts
import { compareTwoStrings } from 'string-similarity';

export async function compareVideos(video1: string, video2: string): Promise<number> {
  // Placeholder: In a real scenario, video comparison is complex.
  // This currently compares the base64 string representations.
  // For a more accurate comparison, one would need to analyze video content,
  // e.g., extract frames and compare them, or use perceptual hashing.
  return compareTwoStrings(video1, video2) * 100;
}
