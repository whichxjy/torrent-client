const puppeteer = require('puppeteer')

const encode = async (input) => {
  const browser = await puppeteer.launch()
  const page = await browser.newPage()
  await page.goto('https://www.urlencoder.org/', { timeout: 0 })
  // set input
  await page.type('#input', input)
  await page.select('#option_text_charset', 'ISO-8859-1')
  await page.click('#submit_text')
  // wait for output
  await page.waitForFunction('document.getElementById("output").textContent.length !== 0')
  // get output
  const outputElement = await page.$('#output')
  const output = await page.evaluate(outputElement => outputElement.textContent, outputElement)
  // close browser
  await browser.close()
  return output
}

module.exports = { encode }
