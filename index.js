const express = require('express');
const { spawn } = require('child_process');
const ffmpegPath = require('ffmpeg-static');

const app = express();

app.get('/stream.m3u8', (req, res) => {
  const videoUrl = req.query.v;
  if (!videoUrl) return res.status(400).send('Falta el parámetro ?v=');

  res.setHeader('Content-Type', 'application/vnd.apple.mpegurl');

  const ffmpeg = spawn(ffmpegPath, [
    '-i', videoUrl,
    '-c:v', 'libx264',
    '-c:a', 'aac',
    '-f', 'hls',
    '-hls_time', '4',
    '-hls_list_size', '6',
    '-hls_flags', 'delete_segments+omit_endlist',
    '-'
  ]);

  ffmpeg.stdout.pipe(res);

  ffmpeg.stderr.on('data', (data) => console.error(data.toString()));
  ffmpeg.on('close', () => console.log('Transcodificación finalizada'));
});

const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Servidor corriendo en puerto ${port}`);
});
