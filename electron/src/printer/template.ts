import moment from 'moment'
import { VEHICLE_TYPES_FORMAL } from '../../../src/model/vehicle.model'
import { PAGE_TYPES } from '../../../src/model/print.model'
import dotenv from 'dotenv-flow'
import { style } from './template.style'

dotenv.config()

const company = process.env.COMPANY_NAME || 'Furi Weighbridge Service'
const address =
	process.env.COMPANY_ADDRESS || 'Sebeta, Furi - Around Police Club'
const phone = process.env.PHONE_NUMBERS || '0118 83 8043 | 0968 34 3616 (SMS)'

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
		${type !== PAGE_TYPES.PENDING ?
			`<div class="left-content">
				<div class="row serial-row">
					<h3>
						Serial: 
						<b style="font-size: 18px; padding: 10px; letter-spacing: 3px;">${record.serial
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

				${type === PAGE_TYPES.ATTACHMENT ? `
					<div class="row">
						<h3>
							Type: ${VEHICLE_TYPES_FORMAL[record.vehicle.type]}
						</h3>
					</div>` : ''
			}

				${record.weights[1] ? `
					<div class="row">
						<h3>Vehicle Info</h3>
						<div class="row-field">
							<div>
								<b>Size</b>
							</div>
							<div>
								${VEHICLE_TYPES_FORMAL[record.vehicle.type]}
							</div>
						</div>
						<div class="row-field">
							<div>
							</div>
							<div>
							</div>
						</div>
					</div>`
				: type === PAGE_TYPES.ATTACHMENT ? `
					<div class="row">
						<h3>First Weight</h3>

						<div class="weight-date">
							${moment(+record.weights[0].createdAt).format('LLL')}
						</div>
						<div class="weight-measure highlight-weight">
							${record.weights[0].weight} KG
						</div>
					</div>` : '<div class="left-content"></div>'
			}
				${!compact && (record.seller || record.buyer) ? `
					<div class="row">
						<h3>Client Info</h3>

						${record.seller ? `
							<div class="row-field">
								<div>
									<b>Seller</b>
								</div>
								<div>
									${record.seller.name.display}
								</div>
							</div>` : ''
				}
						${record.buyer ? `
							<div class="row-field">
								<div>
									<b>Buyer</b>
								</div>
								<div>
									${record.buyer.name.display}
								</div>
							</div>` : ''
				}
					</div>` : ''
			}
				${!compact && (record.remarks) ? `
					<div class="row remarks-row">
						<h3>Remarks</h3>

						<b>${record.remarks.split('\n').join('</br><b>').split(':').join(':</b></br>')}
					</div>
				` : ''}
			</div>` : ''
		}
		<div class="${type !== PAGE_TYPES.PENDING ? 'right-content' : ''}">
			${record.weights[1] || type === PAGE_TYPES.PENDING
			?
			type === PAGE_TYPES.PENDING
				?
				`<div class="file-slip">
							<div class="file-slip-content">
								<div class="row">
									<div class="weight-measure">
										${record.weights[0].weight} KG
									</div>
									<div class="weight-date">
										${moment(+record.weights[0].createdAt).format('LLL')}
									</div>
								</div>
								<div class="row serial-row">
									<h3>
										Serial: 
										<b style="font-size: 18px; padding: 10px; letter-spacing: 3px;">${record.serial
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
								<div class="row">
									<h3>Price</h3>

									<div class="highlight-price">
										${getPrice(record.vehicle.type)} BIRR
									</div>
								</div>
							</div>
						</div>` :
				`<div class="row">
							<h3>First Weight</h3>
							<div class="weight-date">
								${moment(+record.weights[0].createdAt).format('LLLL')}
							</div>

							<div class=" weight-measure">
								${record.weights[0].weight} KG
							</div>
						</div>`
			: `<div class="sms-notice">
						የሚዛኑ ውጤት በ<b>SMS</b> እንዲደርሳቹ የአቅራቢ እና የተረካቢ ስልክ ይፃፉ
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
			
			${record.weights[1]
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
					<div class="weight-date ${moment(+record.weights[0].createdAt).isBefore(
				moment(+record.weights[1].createdAt).subtract(3, 'days')
			) ||
				moment(+record.weights[0].createdAt).isAfter(
					moment(+record.weights[1].createdAt).add(10, 'minutes')
				)
				? 'outdated-record'
				: ''
			}">
						${moment(+record.weights[1].createdAt).diff(+record.weights[0].createdAt, 'days') >= 3 ?
				`IN <b>${moment(+record.weights[1].createdAt).diff(+record.weights[0].createdAt, 'days')}</b> DAYS </br></br>

						<b>ማሳሰብያ:</b> በሁለቱ ክብደቶች መካከል ያለው የቀናት ቁጥር ሲጨምር የውጤቱ ልዩነት ሊሰፋ ይችላል።` :
				moment(+record.weights[1].createdAt).from(+record.weights[0].createdAt)
			}
					</div>

					${record.isMistake &&
			`<h2 class='mistake-remark'>ያልተረጋገጠ/የተሳሳተ ውጤት።</br>MISTAKE</h2>`
			}

					<div class="highlight-weight weight-measure">
						${record.netWeight} KG
					</div>
					${record.shortKey &&
			`<div class="online-result">
							<div>የሚዛኑን ውጤት ኦንላይን</div>
							<div class="online-result-url">
								mizan.me/${record.shortKey.split('-').join('.')}
							</div>
							<div>ላይ ያረጋግጡ።</div>

						</div>`
			}
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
			${stamp === PAGE_TYPES.PENDING
			? putStamp('FILE', 'top', 'compact')
			: putStamp(stamp)
		}
			${stamp === PAGE_TYPES.PENDING
			? putStamp('ATTACHMENT', 'bottom', 'compact')
			: ''
		}
			<div class="watermark"></div>
			${stamp !== PAGE_TYPES.PENDING ? header(company, address, phone) : ''}

			${stamp !== PAGE_TYPES.PENDING ? printTime(new Date().getTime()) : ''}
			
			${grid(record, stamp === PAGE_TYPES.PENDING, stamp)}
			${stamp === PAGE_TYPES.PENDING ? '<div class="cut-line"><span></span></div>' : ''}

			${stamp === PAGE_TYPES.PENDING
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
				${stamp === PAGE_TYPES.PENDING
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
        ${style}
      </style>
    </head>
    <body>
      ${receipt(record, stamp)}
    </body>
  </html>`
