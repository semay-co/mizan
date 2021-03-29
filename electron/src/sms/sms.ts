import puppeteer from 'puppeteer'

const startBrowser = async () => {
  const browser = await puppeteer.launch({
    headless: false,
    executablePath: '/usr/bin/chromium-browser',
  })

  const page = await browser.newPage()

  return { browser, page }
}

const closeBrowser = async (browser: any) => {
  return browser.close()
}

const sendSms = async () => {
  const { browser, page } = await startBrowser()
  const baseUrl = 'http://192.168.8.1'

  await page.setViewport({ width: 1265, height: 613 })

  const goToLoginPage = async () =>
    Promise.all([
      await page.goto(`${baseUrl}/html/index.html`),
      await page.waitForNavigation({ waitUntil: 'load' }),
    ])

  const login = async () => {
    Promise.all([
      await goToLoginPage(),
      await page
        .type('#login_pwd_input', '$implepass')
        .catch((err) => console.log('writing password failed')),
      await page
        .click('#login_btn')
        .catch((err) => console.log('clicking failed')),
      await page.waitForNavigation({ waitUntil: 'load' }),
    ])
  }

  const goToSmsPage = async () =>
    Promise.all([
      await page.goto(`${baseUrl}/index.html#sms`),
      await page.click('#smslist-new-sms'),
    ])

  const sendSms = async () =>
    Promise.all([
      await goToSmsPage(),
      await page.click('#chosen-search-field-input'),
      await page.type('#chosen-search-field-input', '+251944108619;'),
      await page.type('#chat-input', 'Server started'),
      await page.click('#btn-send'),
    ])

  await page
    .$('a[href="#sms"]')
    .then((btn) => btn?.click)
    .then(async () => {
      await sendSms().catch((err) => console.log('couldnt write number', err))
    })
    .catch(async () => {
      await login()
      await sendSms()
    })
}

export const sms = () => {
  sendSms()
}
