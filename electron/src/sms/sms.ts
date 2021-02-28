import request from 'request-promise'
import puppeteer from 'puppeteer'

const url = 'http://192.168.0.1'

const startBrowser = async () => {
  const browser = await puppeteer.launch()
  const page = await browser.newPage()

  return { browser, page }
}

const closeBrowser = async (browser: any) => {
  return browser.close()
}

const playTest = async (url: string) => {
  const { browser, page } = await startBrowser()

  page.setViewport({ width: 1265, height: 613 })
}

export const sms = () => {
  // request(url).then(console.log)
}
