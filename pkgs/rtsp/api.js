const app = require('express')()
const sh = require('shelljs')
const Ffmpeg = require('ffmpeg')

app.post('/capture', (req, res) => {
	const home = process.env.HOME
	const capturesDir = '.mizan/captures'

	const src = `'${req.query.src}'`
	const dir = `'${home}/${capturesDir}/${req.query.dir}'`
	const file = `'${req.query.file}'`

	sh.exec(`./capture.sh ${src} ${dir} ${file}`)

	// try {
	// 	new Ffmpeg("rtsp://stream:$implepass1@192.168.8.40:554/uniview/c1/s1/live", (err, vid) => {
	// 		if (!err) {
	// 			console.log('video is ready')

	// 			vid.fnExtractFrameToJPG('~/.mizan/captures', {}).then(() => {console.log('captured')}).catch(console.error)
	// 		} else {
	// 			console.error('Error:', err)
	// 		}
	// 	})
	// } catch (e) {
	// 	console.log(e)
	// }

	res.status(200)
	return res.send('captured')	
})

app.listen(9999, () => {
	console.log('started')
})