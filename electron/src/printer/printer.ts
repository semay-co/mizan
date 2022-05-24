import { template } from './template'

const printer = require('@thiagoelg/node-printer')
const html_to_pdf = require('html-pdf-node')

const options = { 
  format: 'A5', 
  pageRanges: '1',
}

export const print = (record: any, stamp: string = 'Original') => {
  console.time('print')

  const file = {
    content: template(record, stamp),
  }

  console.log(file)

  const res = html_to_pdf
    .generatePdf(file, options)
    .then((pdfBuffer: any) => {
      console.timeLog('print', 'print pdfBuffer generated')
      // console.log(printer.getPrinters())

      return printer.printDirect({
        name: 'psst',
        docname: 'Mizan Document Print',
        data: pdfBuffer,
        type: 'PDF',
        success: (job: any) => {
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

  console.timeEnd('print')
  return res
}
