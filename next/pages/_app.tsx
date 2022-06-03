import type { AppProps } from 'next/app'
import GlobalStyle from '../themes/global.style'
import { ThemeProvider } from 'styled-components'
import dark from '../themes/dark'

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <ThemeProvider theme={dark}>
      <GlobalStyle />
      <Component {...pageProps} />
    </ThemeProvider>
  )
}

export default MyApp
