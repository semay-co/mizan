import { createGlobalStyle } from 'styled-components'
import { ThemeColorTypes } from './themes.lib'


export const themeColor = (key: ThemeColorTypes) => {
	return ({theme}: any) => theme.colors[key]
}

export const GlobalStyle = createGlobalStyle`
	* {
		padding: 0;
		margin: 0;
	}

	body {
		background: ${themeColor('background')};
		color: ${themeColor('foreground')};
		font-family: Arial, Helvetica, sans-serif;
		font-size: 16px;
	}
`

export default GlobalStyle