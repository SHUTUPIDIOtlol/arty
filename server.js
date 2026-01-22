const express = require("express");
const ytDlp = require("yt-dlp-exec");
const fetch = require("node-fetch");
const cors = require("cors");
const path = require("path");

const app = express();
app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, "public")));

const API_KEY = process.env.YT_API_KEY; // <-- set this on Render

const PORT = process.env.PORT || 3000;

// Search endpoint
app.get("/search", async (req, res) => {
  const q = req.query.q;
  if (!q) return res.status(400).json({ error: "Missing query" });

  try {
    const r = await fetch(
      `https://www.googleapis.com/youtube/v3/search?part=snippet&type=video&maxResults=10&q=${encodeURIComponent(q)}&key=${API_KEY}`
    );
    const data = await r.json();
    const videos = data.items.map(v => ({
      id: v.id.videoId,
      title: v.snippet.title,
      thumbnail: v.snippet.thumbnails.high.url
    }));
    res.json(videos);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Search failed" });
  }
});

// Download endpoint
app.get("/download", async (req, res) => {
  const id = req.query.id;
  if (!id) return res.status(400).json({ error: "Missing video ID" });

  const url = `https://www.youtube.com/watch?v=${id}`;

  try {
    const info = await ytDlp(url, { dumpSingleJson: true, skipDownload: true });
    const format = info.formats
      .filter(f => f.ext === "mp4" && f.filesize)
      .sort((a, b) => b.height - a.height)[0];

    if (!format) return res.status(404).json({ error: "No downloadable format" });

    res.json({ downloadUrl: format.url, title: info.title });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to get download link" });
  }
});

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
