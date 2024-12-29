const sharp = require("sharp");
const { parentPort, workerData } = require("worker_threads");
const fs = require("fs");

(async () => {
  try {
    const { inputPath, outputPath, width, height } = workerData;

    // Perform image resizing using Sharp
    await sharp(inputPath)
      .resize(width, height)
      .toFormat("jpeg")
      .toFile(outputPath);

    // Delete the original uploaded file to save space
    fs.unlinkSync(inputPath);

    // Send the output path back to the main thread
    parentPort.postMessage(outputPath);
  } catch (err) {
    parentPort.postMessage({ error: err.message });
  }
})();
