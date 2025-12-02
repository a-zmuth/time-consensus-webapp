const compareImages = async (imageADataUrl: string, imageBDataUrl: string): Promise<number> => {
    return new Promise((resolve) => {
      let loadedImages = 0;
      const imgA = new Image();
      const imgB = new Image();

      const checkAllLoaded = () => {
        loadedImages++;
        if (loadedImages === 2) {
          // Both images loaded, proceed with comparison
          const canvasA = document.createElement('canvas');
          const ctxA = canvasA.getContext('2d');
          const canvasB = document.createElement('canvas');
          const ctxB = canvasB.getContext('2d');

          if (!ctxA || !ctxB) {
            resolve(0); // Cannot compare without canvas context
            return;
          }

          // Determine the common dimensions (smallest of both)
          const width = Math.min(imgA.width, imgB.width);
          const height = Math.min(imgA.height, imgB.height);

          canvasA.width = width;
          canvasA.height = height;
          canvasB.width = width;
          canvasB.height = height;

          ctxA.drawImage(imgA, 0, 0, width, height);
          ctxB.drawImage(imgB, 0, 0, width, height);

          const imageDataA = ctxA.getImageData(0, 0, width, height).data;
          const imageDataB = ctxB.getImageData(0, 0, width, height).data;

          let diffPixels = 0;
          const totalPixels = width * height;

          for (let i = 0; i < imageDataA.length; i += 4) {
            // Compare R, G, B channels
            if (
              imageDataA[i] !== imageDataB[i] ||     // R
              imageDataA[i + 1] !== imageDataB[i + 1] || // G
              imageDataA[i + 2] !== imageDataB[i + 2]    // B
            ) {
              diffPixels++;
            }
          }

          // Calculate similarity score (0-100)
          // The more different pixels, the lower the score.
          const similarity = ((totalPixels - diffPixels) / totalPixels) * 100;
          resolve(similarity);
        }
      };

      imgA.onload = checkAllLoaded;
      imgB.onload = checkAllLoaded;

      imgA.src = imageADataUrl;
      imgB.src = imageBDataUrl;
    });
  };

  export { compareImages };
