import moment from 'moment'

const company = 'Furi Truck Scale Service'
const address = 'Sebeta, Furi - Around Police Club'
const phone = '+251 118 83 8043'

const getPrice = (size: number) => {
  switch (size) {
    case 0:
      return 75
    case 1:
      return 100
    case 2:
      return 150
    case 3:
      return 200
    case 4:
      return 250
    default:
      return 0
  }
}

export const watermarkText = Array(600)
  .fill(0)
  .map((_, i: number) => {
    const tag = i % 2 === 0 ? 'even' : 'odd'
    return `
			<span class="tag-wrap">
				<span class="${tag}">
					${company.toUpperCase()}
				</span>
			<span class="tag-wrap">
			`
  })
  .join(' . ')

export const leftDetail = `<div id="left-detail">${Array(16)
  .fill(0)
  .map((_, i: number) => {
    return `<span class="${i % 5 === 0 && 'fifth'} ${
      i % 10 === 0 && 'tenth'
    }"></span>`
  })}</div>`

export const watermark = `<p id="watermark">
	${watermarkText}
	</p>`

export const putStamp = (stamp: string = 'Original') =>
  `<div id="stamp"><span>${stamp}</span></div>`

export const styles = `
			body {
				transform: rotate(-90deg) scale(.80) translate(380px, 15px);
			}

			#container {
				margin: 80px;
				font-family: sans-serif;
				overflow: hidden;
				position: relative;
				height: 940px;
				z-index: 100;
				padding-left: 10px;
			}

			#left-detail {
				display: grid;
				position: absolute;
				height: 940px;
				align-content: space-between;
				margin-left: 10px;
				width: 20px;
				color: #ffffff00;
				padding-right: 10px;
				padding-left: 25px;
				border-right: 2px dotted #0000001b;
				border-left: 2px dashed #00000044;
			}

			#left-detail span {
				width: 12px;
				height: 12px;
				border: 1px dotted #aaaaaaaa;
				border-radius: 20px;
			}

			#left-detail .fifth {
				border-radius: 0;
			}

			#watermark {
				position: absolute;
				width: 200vw; 
				line-height: 25px; 
				color: #f8f8f8aa; 
				text-wrap: no-wrap;
				font-size: 10px;
				transform: rotate(-45deg) scale(1.3) translate(-100px, -150px);
				opacity: .4;
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
				color: #f4f4f488;
				opacity: .8;
			}

			#stamp {
				position: absolute;
				bottom: 450px;
				font-size: 90px;
				font-weight: bold;
				letter-spacing: 20px;
				text-transform: uppercase;
				transform: rotate(-45deg);
				z-index: -10;
				color: #dddddd55;
				text-shadow: 5px 5px white, -5px 5px white, 5px -5px white, -5px -5px white;
				width: 100%;
				text-align: center;
				display: grid;
				justify-content: center;
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
				border-right: 12px dashed #cccccc44;
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
				align-content: center;
				display: grid;
				padding-top: 2px;
				box-sizing: border-box;
			}

			#license-plate-number {
				font-size: 20px;
				padding-top: 4px;
			}

			#license-plate-region {
				writing-mode: vertical-rl;
				text-orientation: upright;
				margin: 5px 10px;
				font-size: 15px;
				padding-top: 4px;
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
`

export const header = (company: string, address: string, phone: string) => {
  return `<div id="header">
    <div id="logo">
      <h1>${company}</h1>
    </div>
    <div id="address">
      <div>Address: ${address}</div>
      <div>Phone: ${phone}</div>
    </div>
  </div>`
}

export const receipt = (record: any, stamp: string = 'Original') => {
  return `
		${leftDetail}
			<div id="container">
				${watermark}
				${putStamp(stamp)}
				<div id="watermark"></div>
				${header(company, address, phone)}
				<div id="date">
					Printed: ${moment().format('LLLL')}
				</div>
				<div id="grid">
					<div id="left-content">
						<div class="row">
							<h3>License Plate No.</h3>
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
								${record.vehicle.sizeName}
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
								${record.weights[0].weight.toLocaleString()} KG
							</div>
						</div>
						
						${
              record.weights[1]
                ? `<div class="row">
								<h3>Second Weight</h3>
								<div class="weight-date">
									${moment(record.weights[1].createdAt).format('LLLL')}
								</div>

								<div class="weight-measure">
									${record.weights[1].weight.toLocaleString()} KG
								</div>
							</div>
				
							<div class="row">
								<h3>Net Weight</h3>

								<div class="net-weight weight-measure">
									${record.netWeight.toLocaleString()} KG
								</div>
							</div>`
                : `<div class="row">
								<h3>Price</h3>

								<div class="weight-measure">
									${getPrice(record.vehicle.size)} ETB
								</div>
							</div>`
            }

					</div>
				</div>

				<div id="footer">
					<div id="operator">
						<div id="operator-signature">
							Operator Signature:
						</div>
					</div>
				<div>
			</div>`
}

export const template = (record: any, stamp: string) =>
  `<html>
    <head>
      <style>
        ${styles}
      </style>
    </head>
    <body>
      ${receipt(record, stamp)}
    </body>
  </html>`
