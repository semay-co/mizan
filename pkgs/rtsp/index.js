const Stream = require('node-rtsp-stream')

const stream = new Stream({
	name: 'Cam 1',
	streamUrl: 'rtsp://stream:$implepass1@192.168.8.40:554/unicast/c4/s0/live',
	wsPort: 9999,
	ffmpegOptions: {
		'-stats': '',
		'-r': 24
	}
})

// const express = require('express');
// const app = express();

// const { proxy, scriptUrl } = require('rtsp-relay')(app);

// const url = 'rtsp://stream:$implepass1@192.168.8.40:554/unicast/c4/s0/live'

// const handler = proxy({
//   url,
//   verbose: false,
// });

// const port = 8888

// // the endpoint our RTSP uses
// app.ws('/stream', handler);

// // this is an example html page to view the stream
// app.get('/', (req, res) =>
//   res.send(`
//   <canvas id='canvas'></canvas>

//   <script src='${scriptUrl}'></script>
//   <script>
//     loadPlayer({
//       url: 'ws://192.168.8.101:${port}/stream',
//       canvas: document.getElementById('canvas')
//     });
//   </script>
// `),
// );

// app.listen(port);