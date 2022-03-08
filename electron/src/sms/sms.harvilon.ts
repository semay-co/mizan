import puppeteer from 'puppeteer'
import env from 'dotenv-flow'

env.config()

const startBrowser = async () => {
  const browser = await puppeteer.launch({
    headless: false,
    executablePath: process.env.CHROMIUM_PATH || undefined,
  })

  const page = await browser.newPage()

  return { browser, page }
}

export const sendSms = async (numbers: string, text: string) => {
  if (numbers) {
    const { browser, page } = await startBrowser()
    const baseUrl = 'http://192.168.0.1'

    await page.setViewport({ width: 1265, height: 613 })

    const goToLoginPage = async () =>
      Promise.all([
        await page.goto(`${baseUrl}/index.html#login`) || true,
        await page.waitForSelector('#mainContainer'),
      ])

    const login = async () => {
        // await page.waitForNavigation({
        //   waitUntil: 'networkidle2'
        // })

        page.close()

        return Promise.all([
          await goToLoginPage(),
          await page.waitForSelector('#txtUser'),
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
      Promise.all([
        await login(),
        await page.goto(`${baseUrl}/index.html#sms`),
        await page.waitForSelector('#mainContainer'),
        await page.waitForSelector('.type_items'),
        await page.goto(`${baseUrl}/index.html#sms`),
        await page.waitForSelector('#smslist-new-sms'),
        await page.click('#smslist-new-sms'),
        await page.waitForSelector('#chat-input'),
        await page.waitForSelector('#chosen-search-field-input'),
        await page.type('#chosen-search-field-input', '   '),
        await page.type('#chosen-search-field-input', numbers),
        await page.keyboard.press("Tab"),
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
        await setTimeout(() => {
          browser.close()
        }, 20000),
      ]) //.then(() => browser.close())
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
