import { createGlobalStyle } from 'styled-components'

import RobotoMono from './fonts/RobotoMono/RobotoMono-VariableFont_wght.ttf'
import RobotoMonoItalic from './fonts/RobotoMono/RobotoMono-Italic-VariableFont_wght.ttf'
import DotMatrix from './fonts/DotMatrix/DotMatrix.ttf'

import defaultColors from './themes/default/default.colors'

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
		background: ${defaultColors.background};
		color: ${defaultColors.foreground};
		font-family: 'Roboto Mono';
	}

	*::-webkit-scrollbar {
		width: 1em;
	}

	*::-webkit-scrollbar-track {
		box-shadow: inset 0 0 6px rgba(0, 0, 0, 0.3);
	}

	*::-webkit-scrollbar-thumb {
		background-color: #ffffff44;
		outline: 1px solid #ffffff88;
	}
`
