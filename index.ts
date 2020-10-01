import * as puppeteer from "puppeteer";

let browser: puppeteer.Browser;

const main = async () => {
  browser = await puppeteer.launch({
    headless: false,
    defaultViewport: {
      height: 1020,
      width: 1080,
    },
  });

  const links = await gatherLinks();
  const page = await browser.newPage();
  const titles = [];

  for (const link of links) {
    await page.goto(link);

    const title = await page.evaluate(() => {
      const titleSel = document.querySelector(
        "div.product-details-tile__title-wrapper > h1"
      );
      return titleSel?.textContent;
    });
    titles.push(title);
  }

  console.log("titles", titles);
};

main();

const gatherLinks = async () => {
  const page = await browser.newPage();

  await page.goto("https://www.tesco.com/groceries/en-GB/shop/fresh-food/all");

  const links = await page.evaluate(() => {
    const $ = document.querySelectorAll.bind(document);

    const sel = $(
      "#product-list > div.product-list-view.has-trolley > div.product-list-container > div.product-lists > div > div > div > ul > li .tile-content > a:nth-child(1)"
    );

    const mapped = Array.from(sel).map((item: HTMLAnchorElement) => item.href);

    return mapped;
  });

  await page.close();
  return links;
};
