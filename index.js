import puppeteer from "puppeteer";

const bookingCode = "83E5207";
const bookingCodeSelector = ".m-betslip-search input";
const loadCodeSelector = ".m-betslip-search button";
const loadedBetSelector = "#j_betslip .m-list";

var betSlip = [];

(async () => {
  const browser = await puppeteer.launch({ headless: false });
  const page = await browser.newPage();

  await loadSporty();

  async function loadSporty() {
    await page.goto("https://sportybet.com", {
      timeout: 0,
      waitUntil: "networkidle0",
    });

    await page
      .type(bookingCodeSelector, bookingCode)
      .then((e) => page.click(loadCodeSelector));

    await page.waitForSelector("#j_betslip .m-list", { visible: true });
    let betList = await page.$$eval("#j_betslip .m-list .m-item", (options) => {
      let betArray = {};
      options.forEach((option) => {
        let split = option.textContent.split("\n");
        betArray[split[1].trim()] = {
          option: split,
          type: option.innerHTML.split("--")[2].split('"')[0],
        };
      });

      return betArray;
    });

    console.log("betArray: ", betList);
  }

  //M-sport logic starts here
  /*
  await page.goto("https://msport.com", {
    timeout: 0,
    waitUntil: "networkidle2",
  });

  for (let bet in betArray) {
    await loadSelection(betArray[bet][1].trim());
    await page.waitForTimeout(1000);
  } //   await page.type(".search-bar .v-input--inner", betArray[bet][1]);
  await page.click(".get-code");
  await page.waitForSelector(".m-share-booking-code", { timeout: 0 });
  await page.evaluate(() =>
    console.log(
      document.querySelector(".m-share-booking-code .m-value").innerText
    )
  );
  // await loadSelection("Indiana Pacers v Detroit Pistons");

  // await page.waitForTimeout(1000);
  // await page.waitForNavigation({ waitUntil: "networkidle2", timeout: 0 });
  // await loadSelection("Orlando Magic v Boston Celtics");

  async function loadSelection(para) {
    await page.click(".nav-tool a.btn").then(console.log("done"));
    await page.type(".search-bar .v-input--inner", para);

    await page.waitForSelector(".nav-wrap", { timeout: 0, visible: true });
    let c = await page.$$(".snap-nav-item");

    for (let i = 0; i < c.length; i++) {
      let text = await c[i].$eval(
        ".item-label",
        (options) => options.innerText
      );
      if (text == "Basketball") {
        console.log("inter");
        c[i].click();
      }
    }
    let nav = await page.waitForNavigation({
      waitUntil: "networkidle0",
      timeout: 0,
    });
    await page.waitForTimeout(1000);
    let eventLink = await page.$(".event-link");
    try {
      // if (eventLink) {
      await eventLink.click();
      // }
    } catch (e) {
      console.log(e, "exception");
    }

    try {
      await page.waitForSelector(".m-market-specifier", {
        timeout: 0,
        visible: true,
      });
      // let dat = await page.$$(".m-market-item--content");
      // let dat = await page.$$(".m-market-specifier .m-market-single-line .m-market-row");
      let dat = await page.$$(".m-market-specifier .m-market-row");
      console.log("data: ", dat);
      for (let i = 2; i < dat.length; i++) {
        try {
          let option = await dat[i].$eval(
            ".m-outcome-desc",
            (options) => options.innerText
          );

          if (betArray[para][0].trim().includes(option)) {
            page.evaluate(
              (i, betArray, para) => {
                let odds = document.querySelectorAll(
                  ".m-market-specifier .m-market-row "
                );

                console.log(
                  "odds: ",
                  i,
                  odds[i].getElementsByClassName("odds")[0]
                );
                if (betArray[para][0].trim().includes("Over")) {
                  return odds[i].getElementsByClassName("odds")[0].click();
                }
                if (betArray[para][0].trim().includes("Under")) {
                  return odds[i].getElementsByClassName("odds")[1].click();
                }
              },
              i,
              betArray,
              para
            );
            // let tester = await dat[i].$$(".odds")[1];

            // console.log("True", dat[i].$(".odds"));
          }

          console.log(
            option,
            "test",
            betArray["Indiana Pacers v Detroit Pistons"][0].trim(),
            "includes: ",
            betArray["Indiana Pacers v Detroit Pistons"][0]
              .trim()
              .includes(option)
          );
        } catch (e) {
          console.log("no data : ");
        }
      }
    } catch (e) {
      console.log("exception2:", e);
    }
  }
*/
})();
