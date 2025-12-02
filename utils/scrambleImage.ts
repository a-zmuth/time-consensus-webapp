const scrambleImage = async (imageDataUrl: string, blockSize = 20): Promise<string> => {
    return new Promise((resolve) => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');

        if (!ctx) {
          resolve(imageDataUrl); // Return original if canvas context not available
          return;
        }

        canvas.width = img.width;
        canvas.height = img.height;
        ctx.drawImage(img, 0, 0);

        const originalImageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
        const scrambledImageData = new ImageData(canvas.width, canvas.height);

        const blocks: ImageData[] = [];
        const rows = Math.ceil(canvas.height / blockSize);
        const cols = Math.ceil(canvas.width / blockSize);

        // Extract blocks
        for (let r = 0; r < rows; r++) {
          for (let c = 0; c < cols; c++) {
            const sx = c * blockSize;
            const sy = r * blockSize;
            const blockWidth = Math.min(blockSize, canvas.width - sx);
            const blockHeight = Math.min(blockSize, canvas.height - sy);

            if (blockWidth > 0 && blockHeight > 0) {
              const block = ctx.getImageData(sx, sy, blockWidth, blockHeight);
              blocks.push(block);
            }
          }
        }

        // Shuffle blocks
        for (let i = blocks.length - 1; i > 0; i--) {
          const j = Math.floor(Math.random() * (i + 1));
          [blocks[i], blocks[j]] = [blocks[j], blocks[i]];
        }

        // Reassemble scrambled image
        let blockIndex = 0;
        for (let r = 0; r < rows; r++) {
          for (let c = 0; c < cols; c++) {
            const dx = c * blockSize;
            const dy = r * blockSize;

            if (blockIndex < blocks.length) {
              const block = blocks[blockIndex];
              ctx.putImageData(block, dx, dy);
              blockIndex++;
            }
          }
        }

        resolve(canvas.toDataURL());
      };
      img.src = imageDataUrl;
    });
  };

  export { scrambleImage };
