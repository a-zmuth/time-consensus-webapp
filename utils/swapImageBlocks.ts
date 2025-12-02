const swapImageBlocks = async (
    imageADataUrl: string,
    imageBDataUrl: string,
    blockSize = 20,
    swapPercentage = 0.1 // Swap 10% of blocks
  ): Promise<[string, string]> => {
    return new Promise((resolve) => {
      let loadedImages = 0;
      const imgA = new Image();
      const imgB = new Image();

      const processImages = () => {
        const canvasA = document.createElement('canvas');
        const ctxA = canvasA.getContext('2d');
        const canvasB = document.createElement('canvas');
        const ctxB = canvasB.getContext('2d');

        if (!ctxA || !ctxB) {
          resolve([imageADataUrl, imageBDataUrl]); // Return original if context fails
          return;
        }

        const width = Math.min(imgA.width, imgB.width);
        const height = Math.min(imgA.height, imgB.height);

        canvasA.width = width;
        canvasA.height = height;
        canvasB.width = width;
        canvasB.height = height;

        ctxA.drawImage(imgA, 0, 0, width, height);
        ctxB.drawImage(imgB, 0, 0, width, height);

        const blocksA: ImageData[] = [];
        const blocksB: ImageData[] = [];
        const rows = Math.ceil(height / blockSize);
        const cols = Math.ceil(width / blockSize);

        // Extract blocks from both images
        for (let r = 0; r < rows; r++) {
          for (let c = 0; c < cols; c++) {
            const sx = c * blockSize;
            const sy = r * blockSize;
            const blockWidth = Math.min(blockSize, width - sx);
            const blockHeight = Math.min(blockSize, height - sy);

            if (blockWidth > 0 && blockHeight > 0) {
              blocksA.push(ctxA.getImageData(sx, sy, blockWidth, blockHeight));
              blocksB.push(ctxB.getImageData(sx, sy, blockWidth, blockHeight));
            }
          }
        }

        // Determine which blocks to swap
        const numBlocksToSwap = Math.floor(blocksA.length * swapPercentage);
        const indicesToSwap = new Set<number>();
        while (indicesToSwap.size < numBlocksToSwap) {
          const randomIndex = Math.floor(Math.random() * blocksA.length);
          indicesToSwap.add(randomIndex);
        }

        // Swap the blocks
        indicesToSwap.forEach(index => {
          [blocksA[index], blocksB[index]] = [blocksB[index], blocksA[index]];
        });

        // Reassemble both images
        let blockIndex = 0;
        for (let r = 0; r < rows; r++) {
          for (let c = 0; c < cols; c++) {
            const dx = c * blockSize;
            const dy = r * blockSize;
            if (blockIndex < blocksA.length) {
              ctxA.putImageData(blocksA[blockIndex], dx, dy);
              ctxB.putImageData(blocksB[blockIndex], dx, dy);
              blockIndex++;
            }
          }
        }

        resolve([canvasA.toDataURL(), canvasB.toDataURL()]);
      };

      const checkAllLoaded = () => {
        loadedImages++;
        if (loadedImages === 2) {
          processImages();
        }
      };

      imgA.onload = checkAllLoaded;
      imgB.onload = checkAllLoaded;
      imgA.src = imageADataUrl;
      imgB.src = imageBDataUrl;
    });
  };

  export { swapImageBlocks };
