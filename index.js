const puppeteer = require('puppeteer');
const fs= require('fs');

(async()=>{
    const browser = await puppeteer.launch({headless: false});
    const page =await browser.newPage();

    const url="https://www.iplt20.com/stats/"
    await page.goto(url);

    async function scrapeCategory(category){
        await page.goto(`${url}${category}`);
        await page.waitForSelector("./stats-table");
        
        const data = await page.evaluate(() => {
            const rows = document.querySelectorAll(".stats-table tbody tr");
            return Array.from(rows).map(row =>{
                const columns =row.querySelectorAll("td");
                return{
                    player:columns[0].innerText,
                    stat:columns[1].innerText,
                };
            });
        });
        return data;
    }

    const stats ={
        orangeCap: await scrapeCategory('most-runs'),
        mostFours: await scrapeCategory('most-fours'),
        mostSixes: await scrapeCategory('most-sixes'),
        mostCenturies: await scrapeCategory('most-centuries'),
        mostFifties: await scrapeCategory('most-fifties'),
    };
    const filePath = path.join(__dirname, 'public', 'ipl-stats.json');
    console.log(filePath)
     fs.writeFileSync(filePath, JSON.stringify(stats, null, 2));

  await browser.close();
})()
console.log(__dirname)



