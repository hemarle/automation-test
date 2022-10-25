import puppeteer from "puppeteer";
import { converter } from "./helper.js";

const bookingCode = "C71ACAD3";
const bookingCodeSelector = ".m-betslip-search input";
const loadCodeSelector = ".m-betslip-search button";
const loadedBetSelector = "#j_betslip .m-list";

var betSlip = [];

(async () => {
  const browser = await puppeteer.launch({ headless: false });
  const page = await browser.newPage();

  let sportList = await loadSporty();

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

    return betList;
  }
  // console.log("betArray: ", sportList);

  let bookingCodes = await bookMsport(sportList);

  async function bookMsport(betOptions) {
    //M-sport logic starts here

    try {
      await page.goto("https://msport.com", {
        timeout: 0,
        waitUntil: "networkidle2",
      });
    } catch {
      console.log("Network Err");
    }

    for (let bet in betOptions) {
      await loadSelection(betOptions[bet]);

      await page.waitForTimeout(1000);
    }

    try {
      await page.click(".get-code");
      await page.waitForSelector(".m-share-booking-code", { timeout: 0 });
      let msportBookingCode = await page.evaluate(
        () => document.querySelector(".m-share-booking-code .m-value").innerText
      );
      return msportBookingCode;
    } catch {
      console.log("Could not load code");
    }

    await console.log("booking code: ", msportBookingCode);

    async function loadSelection(para) {
      await page.waitForSelector(".nav-tool a.btn", { timeout: 0 });

      await page.click(".nav-tool a.btn").then(console.log("done"));
      await page.type(".search-bar .v-input--inner", para.option[1].trim());

      await page.waitForSelector(".nav-wrap", { timeout: 0, visible: true });
      let c = await page.$$(".snap-nav-item");

      //Select sport category(e.g Football, Basketball)
      for (let i = 0; i < c.length; i++) {
        let msport_category = await c[i].$eval(
          ".item-label",
          (options) => options.innerText
        );

        if (msport_category.toLowerCase() == para.type.toLowerCase()) {
          c[i].click();
        }
      }

      let nav = await page.waitForNavigation({
        waitUntil: "networkidle0",
        timeout: 0,
      });
      await page.waitForTimeout(1000);
      let eventLink = await page.$(".event-link");

      for (let i = 0; i < 4; i++) {
        try {
          // if (eventLink) {
          await eventLink.click();
          break;
          // }
        } catch (e) {
          console.log(e, "exception");

          await page.waitForTimeout(1000);
        }
      }

      try {
        await page.waitForSelector(".m-market-specifier", {
          timeout: 0,
          visible: true,
        });
        // let dat = await page.$$(".m-market-item--content");
        // let dat = await page.$$(".m-market-specifier .m-market-single-line .m-market-row");
        // let dat = await page.$$(".m-market-specifier .m-market-row");
        // console.log("data: ", dat);

        //select bet option - new

        await page.evaluate(
          (para, converter) => {
            let lists = document.querySelectorAll(
              ".m-detail-markets .m-market-list .m-market-item"
            );
            for (let i = 0; i < lists.length; i++) {
              let headers = lists[i].getElementsByClassName(
                "m-market-item--header"
              )[0].innerText;

              //For basket ball
              let sportyConverted;
              if (para.type.toLowerCase() == "basketball") {
                sportyConverted =
                  converter.basket[para.option[2].trim().split("   ")[0]]
                    .msport;
              }

              console.log("kai", headers, sportyConverted);
              if (headers.trim() == sportyConverted.trim()) {
                let options = lists[i].getElementsByClassName("odds");

                options[0].click();
                console.log(
                  "helpless"
                  // home.length
                  // para.option[2],
                  // converter.basket[para.option[2].trim().split("   ")[0]].msport
                );
              }
            }
          },
          para,
          converter
        );

        //Select bet option -old
        /*
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

              // console.log(
              //   option,
              //   "test",
              //   betArray["Indiana Pacers v Detroit Pistons"][0].trim(),
              //   "includes: ",
              //   betArray["Indiana Pacers v Detroit Pistons"][0]
              //     .trim()
              //     .includes(option)
              // );
            } catch (e) {
              console.log("no data : ");
            }
          }*/
      } catch (e) {
        console.log("exception2:", e);
      }
    }
  }
})();
