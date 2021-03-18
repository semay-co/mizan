import { template } from './template'

const printer = require('@thiagoelg/node-printer')
const html_to_pdf = require('html-pdf-node')

const options = { format: 'A4' }

export const print = async (record: any, stamp: string = 'Original') => {
  const file = {
    content: await template(record, stamp),
  }

  return html_to_pdf
    .generatePdf(file, options)
    .then((pdfBuffer: any) => {
      console.log(printer.getPrinters())

      return printer.printDirect({
        name: 'psst',
        data: pdfBuffer,
        type: 'PDF',
        success: (job: any) => {
          console.log('job id:', job)
          return JSON.stringify(job)
        },
        error: (error: any) => {
          console.error(error)
          return JSON.stringify(error)
        },
      })
    })
    .catch((err: any) => {
      console.error(err)
      return 'error:' + JSON.stringify(err)
    })
}
