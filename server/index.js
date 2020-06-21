const express = require('express');
const fs = require('fs');
const cors = require('cors')

const { getFiles } = require('./utils');

const app = express();
app.use(cors());

const port = 4000;

const trackDir = 'E:/music';

app.get('/api/tracks', async (req, res) => {
	const tracks = await getFiles(trackDir, []);
	res.status(200).json({
		tracks,
	});
});

app.get('/api/streaming', (req, res) => {
	const { path } = req.query;
	console.log('----->' , path)
	const stat = fs.statSync(path);
	const fileSize = stat.size;
	const { range } = req.headers;
	if (range) {
		const parts = range.replace(/bytes=/, '').split('-');
		const start = parseInt(parts[0], 10);
		const end = parts[1] ? parseInt(parts[1], 10) : fileSize - 1;

		if (start >= fileSize) {
			res.status(416).send(`Requested range not satisfiable\n${start} >= ${fileSize}`);
			return;
		}
		const chunksize = end - start + 1;
		const file = fs.createReadStream(path, { start, end });
		const head = {
			'Content-Range': `bytes ${start}-${end}/${fileSize}`,
			'Accept-Ranges': 'bytes',
			'Content-Length': chunksize,
			'Content-Type': 'audio/mp3',
		};
		res.writeHead(206, head);
		file.pipe(res);
	} else {
		const head = {
			'Content-Length': fileSize,
			'Content-Type': 'audio/mp3',
		};
		res.writeHead(200, head);
		fs.createReadStream(path).pipe(res);
	}
});

app.listen(port, () => console.log(`Server is Listening at http://localhost:${port}`));

module.exports = app;
