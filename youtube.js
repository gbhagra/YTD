let Puppeteer = require("puppeteer");
let fs = require("fs");
let credentialsFile = process.argv[2];
(async function () {
    let name = await require(credentialsFile);
    let browser = await Puppeteer.launch({
        executablePath : "C:\\Users\\gagan\\AppData\\Local\\Google\\Chrome\\Application\\chrome.exe",
        headless: false,
        defaultViewport: null,
        args: ["--start-maximized"]
    })
    let numberofPages = await browser.pages();
    let tab = numberofPages[0];
    let arr = [];
    for (let i = 0; i < name.length; i++) {
        let newtab = await browser.newPage();
        let tempPromise = downloader(newtab, name[i]);
        arr.push(tempPromise);
    }
    await Promise.all(arr);
})();

async function downloader(newtab, name) {
    await newtab.goto("https://www.youtube.com/", {waitUntil : "networkidle2"});
    let sbox = await newtab.waitForSelector("#search-input #search");
    await sbox.type(name["title"] + " " + name["artist"]);

    await newtab.waitFor(5000);
    await newtab.keyboard.press("Enter");
    // await newtab.waitForSelector("button[id='search-icon-legacy']");
    // await newtab.click("button[id='search-icon-legacy']");
    await newtab.waitForSelector("#contents .style-scope.ytd-video-renderer a[id='thumbnail']");
    let searchResults = await newtab.$$("#contents .style-scope.ytd-video-renderer a[id='thumbnail']", { waitUntil: "networkidle2" });
    let videoLink = await newtab.evaluate(function (q) {
        return q.getAttribute("href");
    }, searchResults[0]);
    console.log(videoLink);
    await newtab.goto(`https://ssyoutube.com${videoLink}`, {waitUntil : "networkidle2"});
    await newtab.waitForSelector(".def-btn-box");
    await newtab.click(".def-btn-box");
}
