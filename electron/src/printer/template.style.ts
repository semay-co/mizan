const css = (..._: any[]) => _[0].map((s: string, i: number) => s ? s + _[i+1] : '').join('')

const pageHeight = 960
const pageWidth = 600

export const style = css`
	body {
		/* transform: rotate(-90deg) scale(.8) translate(380px, 15px); */
		transform: scale(.75) translate(-80px, -100px); 
	}

	.container {
		font-family: sans-serif;
		overflow: hidden;
		position: relative;
		height: ${pageHeight}px;
		width: ${pageWidth}px;
		z-index: 100;
		margin-left: 80px;
		padding-left: 10px;
	}

	.left-detail {
		display: grid;
		position: absolute;
		height: ${pageHeight}px;
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
		font-size: 10px;
		transform: rotate(-45deg) scale(1.4) translate(${pageWidth/2}px, 0);
		opacity: .2;
		text-shadow: 1px 1px white, -1px 1px white, 1px -1px white, -1px -1px white;
	}

	.watermark .odd {
		position: relative;
		z-index: 100;
	}

	.watermark .even {
		position: relative;
		z-index: 0;
		text-shadow: none;
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
		border-bottom: 1px dotted #555;
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
		letter-spacing: 3px;
	}

	.weight-date {
		font-size: 12px;
		text-transform: uppercase;
		color: #555;
	}

	.outdated-record {
		font-size: 20px;
		border: 1px dashed #333;
		color: #333;
		padding: 5px 8px;
		box-shadow: 100px 100px #00000033 inset;
		border-radius: 5px;
	}

	.outdated-record p {
		font-size: 20px;
	}

	.weight-measure {
		font-size: 18px;
		margin-top: 20px;
	}

	.file-slip {
		transform: translate(160px, 150px) rotate(90deg);
		overflow: visible;
		height: 250px;
		width: ${pageWidth - 30}px;
	}

	.file-slip .file-slip-content {
		width: 230px;
		height: ${pageWidth - 30}px;
	}

	.file-slip .weight-measure {
		font-size: 2.5rem;
		font-weight: bold;
	}

	.highlight-weight,
	.highlight-price {
		box-shadow: 100px 100px #9999 inset;
		border-radius: 5px;
		align-self: left;
		font-size: 24px;
		font-weight: bold;
		padding: 20px;
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
		background: #ffffff;
		border-top: 2px dashed #000000;
		border-bottom: 1px dashed #00000099;
		z-index: 1000;
		position: relative;
		height: 2rem;
		overflow: visible;
	}

	.cut-line span {
		font-weight: bold;
		position: relative;
		font-size: 20px;
		width: ${pageWidth}px;
	}

	.cut-line span::before,
	.cut-line span::after {
		position: absolute;
	}

	.cut-line span::before {
		content: '◣';
		margin-top: -1.4rem;
	}

	.cut-line span::after {
		content: '■';
		font-size: 30px;
		/* margin-left: ${pageWidth - 50}px; */
		right: 0;
		left: ${pageWidth - 20}px;
		margin-top: 1.4rem;
	}

	.return-notice {
		text-align: center;
		font-size: 1.2rem;
		padding: 1rem;
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
	
	.online-result {
		margin-top: 1rem;
		font-size: 1.2rem;
		text-align: end;
	}

	.online-result .online-result-url {
		font-weight: bold;
		letter-spacing: 3px;
	}
`