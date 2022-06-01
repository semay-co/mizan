import { createGlobalStyle } from 'styled-components'

import defaultColors from './themes/default/default.colors'

export default createGlobalStyle`
	@font-face {
		font-family: 'DotMatrix';
		src: url('/fonts/DotMatrix/DotMatrix.ttf');
		font-display: swap;
	}

	@font-face {
		font-family: 'RobotoMono';
		src: url('/fonts/RobotoMono/RobotoMono-VariableFont_wght.ttf');
		font-display: swap;
	}

	@font-face {
		font-style: italic;
		font-family: 'RobotoMono';
		src: url('/fonts/RobotoMono/RobotoMono-Italic-VariableFont_wght.ttf');
		font-display: swap;
	}

	body {
		background: ${defaultColors.background};
		color: ${defaultColors.foreground};
		font-family: 'RobotoMono';
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
