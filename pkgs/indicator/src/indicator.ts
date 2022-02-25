import SerialPort from 'serialport'
import { Gpio } from 'onoff'

const relay = Gpio.accessible ? new Gpio(23, 'out') : null

process.on('SIGINT', _ => {
  relay?.unexport()
})

let trail: any[] = []

const indicator = (onResult: (reading: any, display: any) => any) => {

	const port = new SerialPort('/dev/ttyUSB0', {
		baudRate: 9600
	})

	port.on('open', () => {
		// console.log('open')
		// port.on('data', console.log)
	})

	port.on('error', (console.error))

	let last = Math.PI
	let lastTime = new Date().getTime()

	port.on('data', (data: any) => {
		const snap = data.toString()
		const now = new Date()

		let sign = '+'

		if (snap === '0' || snap === '-') {
			sign = snap === '0' ? '+' : '-'
			console.log(snap)
		} else {
			const reading = snap
				? snap.split('=').join('').split('').reverse().join('')
				: ''.slice(0, 6)
			const parsed = parseInt(`${sign}${reading}`, 10)
			const signed = isNaN(parsed) ? -10 : parsed

			trail = trail.length < 10 ? trail : trail.slice(1)

			trail.push(signed)

			const stable = trail.reduce((c, a) => a + c) / 10 
			if (+signed === 0) {
				relay?.writeSync(0)
			} else {
                if (+signed < 0) {
					const mil = now.getMilliseconds()
					console.log(+signed)

					mil < 200 || (mil >= 400 && mil < 600) || mil >= 800 ? relay?.writeSync(1) : relay?.writeSync(0)
				} else if (+signed <= 500) {
					const mil = now.getMilliseconds()

					mil < 250 || (mil >=500 && mil < 750) ? relay?.writeSync(1) : relay?.writeSync(0)
				} else {
					(now.getSeconds()) % 2 === 0 ? relay?.writeSync(1) : relay?.writeSync(0)
				}
			}

			if (
				+signed < 100000 && 
				(last !== signed || lastTime < now.getTime() - 1000)  && 
				!isNaN(+signed) && 
				lastTime < now.getTime() - 250
			) {
				const change = Math.abs(+last - +signed)
				if (
					!(
						change !== 0 && 
						change < 20 && 
						lastTime > now.getTime() - 3000
					)
				) {
					onResult(signed, signed)
					last = signed
					lastTime = now.getTime()
				}
			}
		}
	}).on('error', (console.error))
}

export default indicator
