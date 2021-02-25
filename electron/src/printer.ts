import moment from 'moment'

const printer = require('@thiagoelg/node-printer')
const html_to_pdf = require('html-pdf-node')

const options = { format: 'A4' }
const companyName = 'Furi Truck Weighing Service'

export const print = (record: any) => {
  const watermarkText = Array(600)
    .fill(0)
    .map((_, i: number) => {
      const tag = i % 2 === 0 ? 'even' : 'odd'
      return `
			<span class="tag-wrap">
				<span class="${tag}">
					${companyName.toUpperCase()}
				</span>
			<span class="tag-wrap">
			`
    })
    .join(' . ')

  const watermark = `<p id="watermark">
	${watermarkText}
	</p>`

  const file = {
    content: `<html>
	<head>
		<style>
			#container {
				margin: 80px;
				font-family: sans-serif;
				overflow: hidden;	
				position: relative;
				height: 940px;
				z-index: 1;
			}

			#watermark {
				position: absolute;
				width: 200vw; 
				line-height: 25px; 
				color: #fdfdfd; 
				text-wrap: no-wrap;
				font-size: 10px;
				transform: rotate(-45deg) scale(1.3) translate(-100px, -150px);
				opacity: .3;
				text-shadow: 1px 1px white, -1px 1px white, 1px -1px white, -1px -1px white;
			}

			#watermark .odd {
				position: relative;
				z-index: 100;
			}

			#watermark .even {
				position: relative;
				z-inxex: 0;
				text-shadow: none;
				color: #f8f8f8;
				opacity: .5;
			}

			#header {
				padding-bottom: 20px;
				border-bottom: 2px solid #888;
				margin-bottom: 50px;
			}

			#logo {
				font-size: 100px;
				margin-bottom: 20px;
			}

			#address {
				color: #555;
			}

			#date {
				font-family: monospace;
				text-transform: uppercase;
			}

			#logo h1 {
				font-size: 20px;
				text-transform: uppercase;
			}

			#grid {
				display: grid;
				grid-template-columns: auto 1fr;
				font-family: monospace;
				margin-top: 50px;
			}

			#left-content,
			#right-content {
				padding: 20px;
			}

			#left-content {
				border-right: 12px dashed #f3f3f3;
			}

			#license-plate {
				border: 1px solid #555;
				padding: 5px 10px;
				border-radius: 5px;
				display: grid;
				grid-auto-flow: column;
				justify-content: center;
				align-items: center;
				gap: 10px;
			}

			#license-plate-code {
				width: 20px;
				height: 20px;
				border-radius: 20px;
				border: 1px solid #555;
				margin: 10px;
				justify-content: center;
				align-items: center;
				display: grid;
			}

			#license-plate-number {
				font-size: 20px;
			}

			#license-plate-region {
				writing-mode: vertical-rl;
				text-orientation: upright;
				margin: 5px 10px;
				font-size: 15px;
			}

			.row {
				margin-bottom: 25px;
			}

			.row h3 {
				margin-top: 0;
				text-transform: uppercase;	
				font-weight: normal;
			}

			.row .row-field {
				border-bottom: 1px dashed #555;
				padding: 10px;;
				text-transform: uppercase;
				text-align: end;
			}

			#right-content .row {
				border-bottom: 1px dashed #555;
				padding: 0 10px 20px;
				margin-bottom: 20px;
			}

			#right-content h3 {
				margin-bottom: 5px;
				text-spacing: 3px;
			}

			.weight-date {
				font-size: 12px;
				text-transform: uppercase;
				color: #555;
			}

			.weight-measure {
				font-size: 18px;
				margin-top: 20px;
			}

			.net-weight {
				font-size: 25px;
			}

			#operator {
				display: grid;
				justify-content: end;
				margin-top: 60px;
				font-family: monospace;
			}

			#operator-name,
			#operator-signature {
				max-width: 300px;
				width: 300px;
				border-bottom: 1px dashed #555;
				padding-bottom: 30px;
				margin-bottom: 40px;
				text-transform: uppercase;
				text-align: end;
			}

		</style>
	</head>
		<body>
			<div id="container">
				${watermark}
				<div id="watermark"></div>
				<div id="header">
					<div id="logo">
						<h1>${companyName}</h1>
					</div>
					<div id="address">
						<div>Address: Furi Road, Next to ABC</div>
						<div>Phone: +251 118 83 843</div>
					</div>
				</div>
				<div id="date">
					Printed at: ${moment().format('LLLL')}
				</div>
				<div id="grid">
					<div id="left-content">
						<div class="row">
							<h3>License Plate</h3>
							<div id="license-plate">
								<div id="license-plate-code">
									${record.vehicle.licensePlate.code}
								</div>	
								<div id="license-plate-number">
									${record.vehicle.licensePlate.plate}
								</div>	
								<div id="license-plate-region">
									${record.vehicle.licensePlate.region}
								</div>	
							</div>	
						</div>
						<div class="row">
							<h3>Vehicle Size</h3>
							<div class="row-field">
								${record.vehicle.size}
							</div>
						</div>
					</div>
					<div id="right-content">

						<div class="row">
							<h3>First Weight</h3>
							<div class="weight-date">
								${moment(record.weights[0].createdAt).format('LLLL')}
							</div>

							<div class="weight-measure">
								${record.weights[0].weight} KG
							</div>
						</div>
						
						<div class="row">
							<h3>Second Weight</h3>
							<div class="weight-date">
								${moment(record.weights[1].createdAt).format('LLLL')}
							</div>

							<div class="weight-measure">
								${record.weights[1].weight} KG
							</div>
						</div>
				
						<div class="row">
							<h3>Net Weight</h3>

							<div class="net-weight weight-measure">
								${record.netWeight} KG
							</div>
						</div>

					</div>
				</div>

				<div id="footer">
					<div id="operator">
						<div id="operator-signature">
							Operator Signature:
						</div>
					</div>
				<div>
			</div>
		</body>
	</html>`,
  }

  return html_to_pdf
    .generatePdf(file, options)
    .then((pdfBuffer: any) => {
      console.log(printer.getPrinters())

      return printer.printDirect({
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
