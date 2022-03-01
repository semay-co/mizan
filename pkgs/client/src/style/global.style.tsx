import { createGlobalStyle } from 'styled-components'

import RobotoMono from './fonts/RobotoMono/RobotoMono-VariableFont_wght.ttf'
import RobotoMonoItalic from './fonts/RobotoMono/RobotoMono-Italic-VariableFont_wght.ttf'
import 'antd/dist/antd.css'

export default createGlobalStyle`
	@font-face {
		font-family: 'DotMatrix';
		src: url('/assets/fonts/DotMatrix/DotMatrix-01.ttf');
	}

	@font-face {
		font-family: 'DotMatrixTwo';
		src: url('/assets/fonts/DotMatrix/DotMatrix-02.ttf');
	}

	@font-face {
		font-family: 'DotMatrixTwo';
		font-weight: bold;
		src: url('/assets/fonts/DotMatrix/DotMatrix-02.ttf');
	}

	@font-face {
		font-family: 'AnyOCR';
		src: url('/assets/fonts/AnyOCR/AnyOCR.ttf');
	}

	@font-face {
		font-family: 'RobotoMono';
		src: url(${RobotoMono}) format('ttf');
	}

	@font-face {
		font-style: italic;
		font-family: 'RobotoMono';
		src: url(${RobotoMonoItalic}) format('ttf');
	}

	body {
		background: ${({ theme }: any) => theme.colors?.background};
		color: ${({ theme }: any) => theme.colors?.foreground};
		font-family: 'RobotoMono';
	}
`
