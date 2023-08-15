const puppeteer = require('puppeteer');
const fs = require('fs');
const fetch = async () => {
  try {
    const browser = await puppeteer.launch({ headless: false });
    const page = await browser.newPage();
    await page.setDefaultNavigationTimeout(0);

    await page.goto('https://www.biletix.com/search/TURKIYE/tr?category_sb=-1&date_sb=-1&city_sb=-1');
    // await page.$eval('#onetrust-accept-btn-handler', (el) => el.click());
    // await page.$eval('.dialog_close', (el) => el.click());
    //await page.$eval('.discoverbar__button', (el) => el.click());
    //await page.waitForNavigation({ waitUntil: 'load', timeout: 0 });

    // Verilerin yüklenmesini beklemek için uygun bir seçiciyi bekleyin
    await page.waitForTimeout(10000);
    const data = await page.evaluate(async () => {
      const events = document.querySelectorAll('.searchResultEventName');
      return Array.from(events).map((event) => {
        return { title: event.innerText };
      });
    });
    const place = await page.evaluate(async () => {
      const events = document.querySelectorAll('.searchResultPlace');
      return Array.from(events).map((event) => {
        return { place: event.innerText };
      });
    });
    const date = await page.evaluate(async () => {
      const events = document.querySelectorAll('.searchResultInfo3');
      return Array.from(events).map((event) => {
        return { date: event.innerText };
      });
    });
    const fullData = data.map((item, index) => {
      return { ...item, ...place[index], ...date[index] };
    });
    fs.writeFileSync('data.json', JSON.stringify(fullData), (err) => {
      if (err) {
        throw err;
      }
      console.log('JSON array is saved.');
    });
    console.log('Datalar başarıyla alındı.');
    await browser.close();
    await page.close();
  } catch (err) {
    console.log(err);
  }
};
fetch();
