const printer = require('@thiagoelg/node-printer')

console.log(printer.getPrinters())

printer.printDirect({
	data: "hello mizan!",
	type: 'TEXT',
	success: (job) => { console.log('job id:', job)} 
})
