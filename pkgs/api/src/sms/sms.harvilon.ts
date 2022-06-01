import puppeteer from 'puppeteer'
import env from 'dotenv-flow'

env.config()

const startBrowser = async () => {
  const browser = await puppeteer.launch({
    headless: false,
    executablePath: process.env.CHROMIUM_PATH || undefined,
  })

  const context = await browser.createIncognitoBrowserContext()
  const page = await context.newPage()

  return { browser, page }
}

export const sendSms = async (numbers: string, text: string) => {
  console.log('sending sms...')
  console.log('numbers:', numbers)

  if (numbers) {
    const { browser, page } = await startBrowser()
    const baseUrl = 'http://192.168.0.1'

    await page.setViewport({ width: 1265, height: 613 })

    const goToLoginPage = async () =>
      Promise.all([
        console.log('going to login page...'),
        (await page.goto(`${baseUrl}/index.html#login`)) || true,
        await page.waitForTimeout(500),
        await page.waitForSelector('#mainContainer'),
        console.log('found selector #mainContainer'),
      ])

    const login = async () => {
      console.log('envoked login')
      // await page.waitForNavigation({
      //   waitUntil: 'networkidle2'
      // })

      // page.close()

      // await page.waitForNavigation({
      //   waitUntil: 'domcontentloaded'

      const loggedIn = await page.evaluate(() =>
        document.querySelector('#txtUser') ? false : true
      )

      console.log('loggedIn', loggedIn)

      return loggedIn
        ? Promise.all([await console.log('already logged in')])
        : Promise.all([
            await page
              .type('#txtUser', 'admin')
              .catch(() => 'writing username failed'),
            await page
              // TODO: make it an env var
              .type('#txtPwd', 'Mizz20221')
              .catch((err) => console.log('writing password failed')),
            await page.waitForSelector('#btnLogin'),
            await page
              .click('#btnLogin')
              .catch((err) => console.log('clicking failed')),
          ])
    }

    const send = async () => {
      console.log('envoked send')

      Promise.all([
        await goToLoginPage(),
        await login(),
        await console.log('going to sms page...'),
        await page.goto(`${baseUrl}/index.html#sms`),
        await console.log('sms page'),
        await page.waitForTimeout(100),
        await page.waitForSelector('#smslist-new-sms'),
        await console.log('found #smslist-new-sms'),
        await page.click('#smslist-new-sms'),
        await page.waitForSelector('#chat-input'),
        await page.waitForSelector('#chosen-search-field-input'),
        await console.log('found number and msg inputs'),
        await page.focus('#chosen-search-field-input'),
        await page.waitForTimeout(100),
        console.log('typing numbers...'),
        await page.type('#chosen-search-field-input', numbers + ';'),
        await page.waitForTimeout(1000),
        await page.type('#chat-input', text),
        await page.click('#btn-send'),
        // await page.evaluate(() => {
        //   const txta = document.getElementById('sms_current_content')

        //   if (txta?.innerHTML) {
        //     txta.innerHTML = text
        //   }
        // }),
        // await page.waitForSelector('.sms_send_normal'),
        // await page.click('.sms_send_normal'),
        // await page.evaluate(() => {
        //   // @ts-ignore
        //   EMUI.smsSendAndSaveController.sendMessage()
        // }),
        await page.waitForTimeout(2000),
        browser.close(),
      ])
    }

    await page
      .$('a[href="#sms"]')
      .then((btn) => btn?.click)
      .then(async () => {
        await send().catch((err) => console.log('could not send message', err))
      })
      .catch(async () => {
        await send()
      })
  }
}
