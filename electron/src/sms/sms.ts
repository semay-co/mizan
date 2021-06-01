import puppeteer from 'puppeteer'

const startBrowser = async () => {
  const browser = await puppeteer.launch({
    headless: true,
    executablePath: '/usr/bin/chromium',
  })

  const page = await browser.newPage()

  return { browser, page }
}

export const sendSms = async (numbers: string, text: string) => {
  const { browser, page } = await startBrowser()
  const baseUrl = 'http://192.168.8.1'

  await page.setViewport({ width: 1265, height: 613 })

  const goToLoginPage = async () =>
    Promise.all([
      await page.goto(`${baseUrl}/html/index.html`).catch((err) => {
        console.error('unable to go to url', err)
      }),
      await page.waitForSelector('#login_password'),
    ])

  const login = async () => {
    Promise.all([
      await goToLoginPage(),
      await page
        // TODO: make it an env var
        .type('#login_password', '$implepass')
        .then(() => console.log('yaaay!'))
        .catch((err) => console.log('writing password failed')),
      await page.waitForSelector('#login_btn'),
      await page
        .click('#login_btn')
        .catch((err) => console.log('clicking failed')),
    ])
  }

  const send = async () =>
    Promise.all([
      await login(),
      await page.waitForSelector('#header_sms_info'),
      await page.goto(`${baseUrl}/html/content.html#sms`),
      await page.waitForSelector('#sms_message_new'),
      await page.click('#sms_message_new'),
      await page.waitForSelector('#sms_send_user_input'),
      await page.waitForSelector('#sms_current_content'),
      await page.type('#sms_send_user_input', numbers),
      await page.type('#sms_current_content', text),
      // await page.evaluate(() => {
      //   const txta = document.getElementById('sms_current_content')

      //   if (txta?.innerHTML) {
      //     txta.innerHTML = text
      //   }
      // }),
      // await page.waitForSelector('.sms_send_normal'),
      // await page.click('.sms_send_normal'),
      await page.evaluate(() => {
        // @ts-ignore
        EMUI.smsSendAndSaveController.sendMessage()
      }),
      await setTimeout(() => {
        browser.close()
      }, 20000),
    ]) //.then(() => browser.close())

  await page
    .$('a[href="#sms"]')
    .then((btn) => btn?.click)
    .then(async () => {
      await send().catch((err) => console.log('could not send message', err))
    })
    .catch(async () => {
      await login()
      await send()
    })
}
