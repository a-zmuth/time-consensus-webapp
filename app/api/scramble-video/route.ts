// app/api/scramble-video/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { spawn } from 'child_process';
import path from 'path';
import { promises as fs } from 'fs';

// Helper to get the path to the ffmpeg executable
const getFfmpegPath = () => {
  if (process.env.NODE_ENV === 'production') {
    // In Vercel production, ffmpeg is expected to be bundled at the root
    return path.join(process.cwd(), 'bin', 'ffmpeg');
  } else {
    // For local development, assuming ffmpeg is in the system PATH
    // or specifically at ./bin/ffmpeg relative to CWD
    return path.join(process.cwd(), 'bin', 'ffmpeg');
  }
};

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const videoFile = formData.get('video') as Blob | null;

    if (!videoFile) {
      return NextResponse.json({ error: 'No video file provided' }, { status: 400 });
    }

    // Convert Blob to Buffer
    const videoBuffer = Buffer.from(await videoFile.arrayBuffer());

    // Create temporary input and output file paths
    const tempDir = path.join(process.cwd(), '.tmp');
    await fs.mkdir(tempDir, { recursive: true });

    const inputFilePath = path.join(tempDir, `input_${Date.now()}.mp4`);
    const outputFilePath = path.join(tempDir, `output_${Date.now()}.mp4`);

    await fs.writeFile(inputFilePath, videoBuffer);

    const ffmpegPath = getFfmpegPath();

    // Ensure ffmpeg executable has correct permissions in development (might be needed if not set globally)
    if (process.env.NODE_ENV !== 'production') {
      try {
        await fs.access(ffmpegPath, fs.constants.X_OK);
      } catch {
        console.warn(`FFmpeg at ${ffmpegPath} is not executable. Attempting to set permissions.`);
        await fs.chmod(ffmpegPath, 0o755);
      }
    }

    // FFmpeg command to scramble video:
    // This is a simple scramble using a video filter,
    // more complex scrambles (like block shuffling) would be more involved.
    // For demonstration, we'll pixelate the video and add some noise.
    const ffmpegArgs = [
      '-i', inputFilePath,
      '-vf', 'boxblur=20:10,noise=alls=20:allf=t+n', // Pixelate and add noise
      '-c:v', 'libx264', // Re-encode video
      '-preset', 'ultrafast', // Faster encoding for demonstration
      '-crf', '28', // Quality setting (higher value means lower quality/smaller file)
      '-c:a', 'copy', // Copy audio as is
      outputFilePath
    ];

    const ffmpegProcess = spawn(ffmpegPath, ffmpegArgs);

    let stderr = '';
    ffmpegProcess.stderr.on('data', (data) => {
      stderr += data.toString();
    });

    await new Promise((resolve, reject) => {
      ffmpegProcess.on('close', (code) => {
        if (code === 0) {
          resolve(null);
        } else {
          reject(new Error(`FFmpeg process exited with code ${code}: ${stderr}`));
        }
      });
      ffmpegProcess.on('error', (err) => {
        reject(err);
      });
    });

    const scrambledVideoBuffer = await fs.readFile(outputFilePath);

    // Clean up temporary files
    await fs.unlink(inputFilePath);
    await fs.unlink(outputFilePath);

    // Return the scrambled video as a base64 data URL
    const base64ScrambledVideo = `data:${videoFile.type};base64,${scrambledVideoBuffer.toString('base64')}`;

    return NextResponse.json({ scrambledVideo: base64ScrambledVideo });

  } catch (error: any) {
    console.error('Error scrambling video:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
