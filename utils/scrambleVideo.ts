// utils/scrambleVideo.ts
export async function scrambleVideo(videoDataURL: string): Promise<string> {
  // Convert data URL to Blob for FormData
  const byteString = atob(videoDataURL.split(',')[1]);
  const mimeString = videoDataURL.split(',')[0].split(':')[1].split(';')[0];
  const ab = new ArrayBuffer(byteString.length);
  const ia = new Uint8Array(ab);
  for (let i = 0; i < byteString.length; i++) {
      ia[i] = byteString.charCodeAt(i);
  }
  const videoBlob = new Blob([ab], { type: mimeString });

  const formData = new FormData();
  formData.append('video', videoBlob, 'input.mp4'); // Filename can be generic

  const response = await fetch('/api/scramble-video', {
    method: 'POST',
    body: formData,
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(`Video scrambling failed: ${errorData.error}`);
  }

  const data = await response.json();
  return data.scrambledVideo;
}
