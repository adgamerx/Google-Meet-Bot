const puppeteer = require("puppeteer-extra");
const StealthPlugin = require("puppeteer-extra-plugin-stealth");
const schedule = require("node-schedule");
const figlet = require("figlet");
require("dotenv").config();

figlet('Made By ADGAMERX', function(err, data) {
  if (err) {
      console.log('Something went wrong...');
      console.dir(err);
      return;
  }
  console.log(data)
});

const start = schedule.scheduleJob(process.env.START, function () {
  
  console.log("Class Time");

  //loading var
  var email = process.env.EMAIL;
  var password = process.env.PASSWORD;
  var meetCode = process.env.MEETCODE;

  puppeteer.use(StealthPlugin());

  (async () => {
    const browser = await puppeteer.launch({
      headless: false,
      args: [
        "--no-sandbox",
        "--disable-setuid-sandbox",
        "--use-fake-ui-for-media-stream",
        "--disable-audio-output",
      ],
    });

    //closing the default tab

    const pages = await browser.pages();
    pages[0].close();

    //sigin

    const page = await browser.newPage();
    const navigationPromise = page.waitForNavigation();
    await page.goto(
      "https://accounts.google.com/signin/v2/identifier?flowName=GlifWebSignIn&flowEntry=ServiceLogin"
    );

    //typing email

    await page.waitForSelector('input[type="email"]');
    await page.click('input[type="email"]');
    await navigationPromise;
    await page.keyboard.type(email, { delay: 400 });
    await page.waitForTimeout(2000);

    //clicking next button

    await page.waitForSelector("#identifierNext");
    await page.click("#identifierNext");
    console.log("-->email entered");

    //typing password

    await page.waitForTimeout(3500);
    await page.keyboard.type(password, { delay: 300 });
    console.log("-->password entered");
    await page.waitForTimeout(800);
    await page.keyboard.press("Enter");
    await navigationPromise;
    console.log("-->Logged In");

    //navigating to google meet

    await page.waitForTimeout(2500);
    await page.goto("https://meet.google.com/");
    await page.waitForSelector('input[type="text"]');
    await page.click('input[type="text"]');
    await page.waitForTimeout(1000);
    await page.keyboard.type(meetCode, { delay: 200 });
    await page.waitForTimeout(900);
    await page.keyboard.press("Enter");
    await navigationPromise;
    console.log("-->On Meet Page");

    //disabling audio video

    await page.waitForTimeout(8000);
    await page.keyboard.down("ControlLeft");
    await page.keyboard.press("KeyD");
    await page.keyboard.up("ControlLeft");
    await page.waitForTimeout(3000);
    await page.keyboard.down("ControlLeft");
    await page.keyboard.press("KeyE");
    await page.keyboard.up("ControlLeft");
    await page.waitForTimeout(3000);
    console.log("-->audio video disabled");

    //Joining
    await page.waitForTimeout(5000);

    await page.click("span.NPEfkd.RveJvd.snByac");
    console.log("-->Requested To Join The Meeting/Joined The Meeting");

    const end = schedule.scheduleJob(process.env.END, function () {
      console.log("Class Time");

      //Ending Class -- Not Working
      page.click("div.NHaLPe.kEoTPd");
      console.log("-->Meeting Left");
    });
  })();
});
