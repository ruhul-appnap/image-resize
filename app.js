const express = require("express");
const multer = require("multer");
const runWorker = require("./utils");

const app = express();
const upload = multer({ dest: "uploads/" });

app.post("/resize", upload.single("image"), async (req, res) => {
  try {
    const { width, height } = req.body;

    if (!req.file || !width || !height) {
      return res
        .status(400)
        .json({ error: "Image file, width, and height are required" });
    }

    const resizedImagePath = await runWorker({
      inputPath: req.file.path,
      outputPath: `uploads/resized-${Date.now()}.jpg`,
      width: parseInt(width, 10),
      height: parseInt(height, 10),
    });

    res.json({ success: true, resizedImagePath });
  } catch (error) {
    res.status(500).json({
      error: "Error resizing image",
      details: error.message || "something went wrong",
    });
  }
});

const PORT = 5000;
app.listen(PORT, () => {
  console.log(`Server running at ${PORT}`);
});
