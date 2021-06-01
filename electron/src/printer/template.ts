import moment from 'moment'
import { VEHICLE_TYPES } from '../../../src/model/vehicle.model'
import { PAGE_TYPES } from '../../../src/model/print.model'

const company = 'Furi Truck Scale Service'
const address = 'Sebeta, Furi - Around Police Club'
const phone = '0118 83 8043 | 0968 34 3616 (SMS)'

const getPrice = (type: number) => {
  switch (type) {
    case 0:
      return 80
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

export const leftDetail = `<div class="left-detail">${Array(16)
  .fill(0)
  .map((_, i: number) => {
    return `<span class="
			${i % 5 === 0 && 'fifth'} 
			${i % 10 === 0 && 'tenth'}
			${(i === 0 || i === 15) && 'edge'}
		"></span>`
  })}</div>`

export const watermark = `<p class="watermark">
	${watermarkText}
	</p>`

export const putStamp = (
  stamp: string = 'Original',
  position: 'top' | 'bottom' | 'center' = 'center',
  style: 'compact' | 'large' = 'large'
) => `<div class="stamp ${position} ${style}"><span>${stamp}</span></div>`

export const styles = `
			body {
				transform: rotate(-90deg) scale(.80) translate(380px, 15px);
			}

			.container {
				margin: 80px;
				font-family: sans-serif;
				overflow: hidden;
				position: relative;
				height: 940px;
				z-index: 100;
				padding-left: 10px;
			}

			.left-detail {
				display: grid;
				position: absolute;
				height: 940px;
				align-content: space-between;
				margin-left: 8px;
				width: 20px;
				color: #ffffff00;
				padding-right: 10px;
				padding-left: 25px;
				border-right: 2px dotted #00000022;
				border-left: 2px dashed #00000044;
			}

			.left-detail span {
				width: 13px;
				height: 13px;
				border: 1px dotted #aaaaaaaa;
				border-radius: 20px;
			}

			.left-detail .fifth {
				border-radius: 0;
			}

			.left-detail .tenth {
				transform: rotate(45deg);
			}

			.left-detail .edge {
				background-color: #00000088;
			}

			.watermark {
				position: absolute;
				width: 200vw; 
				line-height: 25px; 
				color: #000; 
				text-wrap: no-wrap;
				font-size: 10px;
				transform: rotate(-45deg) scale(1.3) translate(-100px, -150px);
				opacity: .2;
				text-shadow: 1px 1px white, -1px 1px white, 1px -1px white, -1px -1px white;
			}

			.watermark .odd {
				position: relative;
				z-index: 100;
			}

			.watermark .even {
				position: relative;
				z-inxex: 0;
				text-shadow: none;
				// color: #d4d4d4;
				opacity: .8;
			}

			.stamp {
				position: absolute;
				bottom: 450px;
				font-size: 90px;
				font-weight: bold;
				letter-spacing: 20px;
				text-transform: uppercase;
				transform: rotate(-45deg);
				z-index: -10;
				color: #dddddd99;
				text-shadow: 5px 5px white, -5px 5px white, 5px -5px white, -5px -5px white;
				width: 100%;
				text-align: center;
				display: grid;
				justify-content: center;
			}

			.stamp.top {
				bottom: 750px;
			}

			.stamp.bottom {
				bottom: 300px;
			}

			.stamp.compact {
				font-size: 3.5rem;
				letter-spacing: auto;
			}

			.header {
				padding-bottom: 20px;
				border-bottom: 5px solid #88888866;
				margin-bottom: 10px;
			}

			.logo {
				font-size: 100px;
				margin-bottom: 20px;
			}

			.address {
				color: #555;
			}

			.date {
				font-family: monospace;
				text-transform: uppercase;
			}

			.logo h1 {
				font-size: 20px;
				text-transform: uppercase;
			}

			.grid {
				display: grid;
				grid-template-columns: auto 1fr;
				font-family: monospace;
				margin-top: 50px;
			}

			.grid.compact {
				margin-top: 10px;
			}

			.left-content,
			.right-content {
				padding: 20px;
			}

			.left-content {
				border-right: 12px dashed #cccccc44;
			}

			.license-plate {
				border: 1px solid #555;
				padding: 5px 10px;
				border-radius: 5px;
				display: grid;
				grid-auto-flow: column;
				justify-content: center;
				align-items: center;
				gap: 10px;
			}

			.license-plate-code {
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

			.license-plate-number {
				font-size: 20px;
				padding-top: 4px;
			}

			.license-plate-region {
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

			.serial-row h3 b {
				// border: 1px solid red;
				// background: red!important;
				// padding: 2px 4px;
				// color: #ffffff!important;
			}

			.right-content .row {
				border-bottom: 1px dashed #555;
				padding: 0 10px 20px;
				margin-bottom: 20px;
			}

			.right-content h3 {
				margin-bottom: 5px;
				text-spacing: 3px;
			}

			.weight-date {
				font-size: 12px;
				text-transform: uppercase;
				color: #555;
			}

			.outdated-record {
				font-size: 18px;
				border: 1px dashed #333;
				color: #333;
				padding: 3px 5px;
				box-shadow: 100px 100px #00000033 inset;
				font-weight: bold;
				border-radius: 5px;
			}

			.weight-measure {
				font-size: 18px;
				margin-top: 20px;
			}

			.highlight-weight,
			.highlight-price {
				box-shadow: 100px 100px #9999 inset;
				border-radius: 5px;
				// color: #fff;
				align-self: left;
				font-size: 24px;
				font-weight: bold;
				padding: 20px;
				// -webkit-text-stroke: 1px #fff;
				// -webkit-text-fill-color: #fff;
				text-align: right;
				text-shadow: 1px 1px #fff, 1px -1px #fff, -1px -1px #fff, -1px 1px #fff;
			}

			.price-row h3 {
				font-size: 20px;
				text-align: end;
				text-transform: uppercase;
			}

			.sms-notice {
				font-size: 16px;
				text-align: center;
			}

			.customer-form-grid {
				display: grid;
				gap: 10px;
			}

			.customer-form-grid .form-row {
				display: grid;
				grid-auto-flow: column;
				grid-template-columns: 50px auto;
				align-items: center;
			}

			.customer-form-grid .form-row .form-input {
				border: 1px dashed #000;	
				background: #ddd0;
				height: 30px;
				box-shadow: 100px 100px #fff8 inset;
				outline: 3px solid #fff;
				z-index: 100;
			}
			
			.customer-form-grid .form-title {
				grid-column: span 2;
				font-size: 20px;
				font-weight: bold;
			}

			.operator {
				display: grid;
				justify-content: end;
				margin-top: 60px;
				font-family: monospace;
			}

			.operator-name,
			.operator-signature {
				max-width: 300px;
				width: 300px;
				border-bottom: 1px dashed #555;
				padding-bottom: 30px;
				margin-bottom: 40px;
				text-transform: uppercase;
				text-align: end;
			}

			.footer {
				position: absolute;
				width: 100%;
				bottom: 0;
				margin-bottom: 10px;
			}

			.cut-line {
				padding: .5rem;
				background: #ffffff;
				border-top: 1px dashed #00000099;
				border-bottom: 1px dashed #00000099;
				z-index: 1000;
				position: relative;
			}

			.return-notice {
				text-align: center;
				font-size: 1.2rem;
				padding; 1rem;
				position: relative;
				text-shadow: 1px 1px white, -1px 1px white, 1px -1px white, -1px -1px white;
				z-index: 10;
			}

			.disclaimer {
				width: 100%;
				font-family: monospace;
				color: #00000088;
				font-size: 11px;
				text-transform: uppercase;
				text-align: center;
				letter-spacing: 2px;
				background: #ffffff;
			}
`

export const header = (company: string, address: string, phone: string) => {
  return `<div class="header">
    <div class="logo">
      <h1>${company}</h1>
    </div>
    <div class="address">
      <div>Address: ${address}</div>
      <div>Phone: ${phone}</div>
    </div>
  </div>`
}

const grid = (
  record: any,
  compact: boolean = false,
  type: string = PAGE_TYPES.ORIGINAL
) => {
  return `<div class="grid ${compact && 'compact'}">
		<div class="left-content">
			<div class="row serial-row">
				<h3>
					Serial: 
					<b style="font-size: 18px; padding: 10px; letter-spacing: 3px;">${
            record.serial
          }</b> 
				</h3>
			</div>
			<div class="row">
				<h3>License Plate No.</h3>
				<div class="license-plate">
					<div class="license-plate-code">
						${record.vehicle.licensePlate.code}
					</div>	

					<div class="license-plate-number">
						${record.vehicle.licensePlate.plate}
					</div>
					<div class="license-plate-region"> 
						${record.vehicle.licensePlate.region.code} 
					</div>	
				
				</div>	
			</div>

			${
        type === PAGE_TYPES.ATTACHMENT
          ? `<div class="row">

					<h3>
						Type: ${VEHICLE_TYPES[record.vehicle.type]}
					</h3>
					
				</div>`
          : ''
      }

			${
        record.weights[1]
          ? `<div class="row">
						<h3>Vehicle Type</h3>
						<div class="row-field">
							${VEHICLE_TYPES[record.vehicle.type]}
						</div>
					</div>`
          : type === PAGE_TYPES.ATTACHMENT
          ? `<div class="row">
				<h3>First Weight</h3>

				<div class="weight-date">
					${moment(+record.weights[0].createdAt).format('LLL')}
				</div>
				<div class="weight-measure highlight-weight">
					${record.weights[0].weight} KG
				</div>
			</div>
		`
          : ''
      }
					${
            !compact && record.seller
              ? `
				<div class="row">
					<h3>Seller</h3>
					<div class="row-field">
						<div>
						Name: 
						${record.seller.name.display}
						</div>
						<div>
						Phone: 
						${record.seller.phoneNumber.number}
						</div>
					</div>
				</div>
			`
              : ''
          }
			${
        !compact && record.buyer
          ? `

				<div class="row">

					<h3>Buyer</h3>
					<div class="row-field">
						<div>
						Name: 
						${record.buyer.name.display}
						</div>
						<div>
						Phone: 
						${record.buyer.phoneNumber.number}
						</div>
					</div>
				
				</div>
			`
          : ''
      }
		</div>
		<div class="right-content">
			${
        record.weights[1] || type === PAGE_TYPES.PENDING
          ? `<div class="row">
					<h3>First Weight</h3>
					<div class="weight-date">
						${moment(+record.weights[0].createdAt).format('LLLL')}
					</div>

					<div class=" weight-measure">
						${record.weights[0].weight} KG
					</div>
				</div>
				
				${
          type === PAGE_TYPES.PENDING
            ? `<div class="row">
					<h3>Price</h3>

					<div class="highlight-price weight-measure">
						${getPrice(record.vehicle.type)} BIRR
					</div>
				</div>`
            : ''
        }`
          : `<div class="sms-notice">
						ውጤቱ በ<b>SMS</b> እንዲደርሳቹ የአቅራቢ እና የተረካቢ ስልክ ይፃፉ
          </div>
					<div class="row">
					<div class="customer-form-grid">
						<div class="form-row">
							<h3 class="form-title">አቅራቢ</h3>
						</div>
						<div class="form-row">
							<h3>ስም:</h3>
							<div class="form-input"></div>
						</div>
						<div class="form-row">
							<h3>ስልክ:</h3>
							<div class="form-input"></div>
						</div>
					</div>
					<div class="input-box"></div>
				</div>
				<div class="row">
					<div class="customer-form-grid">
						<div class="form-row">
							<h3 class="form-title">ተረካቢ</h3>
						</div>
						<div class="form-row">
							<h3>ስም:</h3>
							<div class="form-input"></div>
						</div>
						<div class="form-row">
							<h3>ስልክ:</h3>
							<div class="form-input"></div>
						</div>
					</div>
					<div class="input-box"></div>
				</div>
				<div class="price-row">
					<h3>
						Price: ${getPrice(record.vehicle.type)} Birr
					</h3>
				</div>
				`
      }
			
			${
        record.weights[1]
          ? `<div class="row">
					<h3>Second Weight</h3>
					<div class="weight-date">
						${moment(+record.weights[1].createdAt).format('LLLL')}
					</div>

					<div class="weight-measure">
						${record.weights[1].weight} KG
					</div>
				</div>
				<div class="row">
					<h3>Net Weight</h3>
					<div class="weight-date ${
            moment(+record.weights[0].createdAt).isBefore(
              moment(+record.weights[1].createdAt).subtract(2, 'days')
            ) ||
            moment(+record.weights[0].createdAt).isAfter(
              moment(+record.weights[1].createdAt).add(10, 'minutes')
            )
              ? 'outdated-record'
              : ''
          }">
						${moment(+record.weights[1].createdAt).from(+record.weights[0].createdAt)}
					</div>

					<div class="highlight-weight weight-measure">
						${record.netWeight} KG
					</div>
				</div>`
          : ''
      }

		</div>
	</div>`
}

const printTime = (time: any) => `
		<div class="date">
			Printed: ${moment(time).format('LLLL')}
		</div>
	`

export const receipt = (record: any, stamp: string = PAGE_TYPES.ORIGINAL) => {
  return `
		${leftDetail}

		<div class="container">
			${watermark}
			${
        stamp === PAGE_TYPES.PENDING
          ? putStamp('FILE', 'top', 'compact')
          : putStamp(stamp)
      }
			${
        stamp === PAGE_TYPES.PENDING
          ? putStamp('ATTACHMENT', 'bottom', 'compact')
          : ''
      }
			<div class="watermark"></div>
			${stamp !== PAGE_TYPES.PENDING ? header(company, address, phone) : ''}

			${stamp !== PAGE_TYPES.PENDING ? printTime(new Date().getTime()) : ''}
			
			${grid(record, stamp === PAGE_TYPES.PENDING, stamp)}
			${stamp === PAGE_TYPES.PENDING ? '<div class="cut-line"></div>' : ''}

			${
        stamp === PAGE_TYPES.PENDING
          ? `${header(company, address, phone)} ${printTime(
              new Date().getTime()
            )} ${grid(record, true, PAGE_TYPES.ATTACHMENT)}`
          : `
				<div class="operator">
					<div class="operator-signature">
					</div>
				</div>`
      }

			<div class="footer">
				${
          stamp === PAGE_TYPES.PENDING
            ? '<div class="return-notice">ሲመለሱ ይህን ወረቀት ይዘው ይምጡ።</div>'
            : `<div class="disclaimer">
						Disclaimer: We can only guarantee the weight, not the material.
					</div>`
        }
			</div>
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
