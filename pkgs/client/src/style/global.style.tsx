import { createGlobalStyle } from 'styled-components'

import RobotoMono from './fonts/RobotoMono/RobotoMono-VariableFont_wght.ttf'
import RobotoMonoItalic from './fonts/RobotoMono/RobotoMono-Italic-VariableFont_wght.ttf'
import DotMatrix from './fonts/DotMatrix/DotMatrix.ttf'

import 'antd/dist/antd.css'

export default createGlobalStyle`
	@font-face {
		font-family: 'DotMatrix';
		src: url(${DotMatrix});
	}

	@font-face {
		font-family: 'Roboto Mono';
		src: url(${RobotoMono});
	}

	@font-face {
		font-style: italic;
		font-family: 'Roboto Mono';
		src: url(${RobotoMonoItalic}) format('ttf');
	}

	body {
		background: ${({ theme }: any) => theme.colors?.background};
		color: ${({ theme }: any) => theme.colors?.foreground};
		font-family: 'Roboto Mono';
	}
`
