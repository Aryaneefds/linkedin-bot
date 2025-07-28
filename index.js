#!/usr/bin/env node
import puppeteer from 'puppeteer-extra';
import StealthPlugin from 'puppeteer-extra-plugin-stealth';
puppeteer.use(StealthPlugin());


const LINKEDIN_URL = 'https://www.linkedin.com';
const EMAIL = '';
const PASSWORD = '';
const MUTUAL_THRESHOLD = 50;

(async () => {
  const browser = await puppeteer.launch({ headless: false,sloMo: 50 ,userDataDir: './linkedin-session'});
  const page = await browser.newPage();
  await page.setViewport({
  width: 1366,
  height: 768,
  });

  // 1. Go to LinkedIn Login
  try{
    await page.goto(`${LINKEDIN_URL}/login`);
    await page.type('input[name="session_key"]', EMAIL,{ delay: 100 });
   // await page.waitForTimeout(3500 + Math.random() * 1000);
    await page.type('input[name="session_password"]', PASSWORD,{ delay: 100 });
   // await page.waitForTimeout(4500 + Math.random() * 1000);
    await Promise.all([
      page.waitForNavigation(),
      page.click('button[type="submit"]'),
    ]);
    


    //2nd step going to invitations

    await page.goto(`${LINKEDIN_URL}/mynetwork/invitation-manager/received/`, { waitUntil: 'networkidle2',timeout: 60000 });
      try {
      await page.waitForSelector('[componentkey="invitationManagerPage_InvitationsList"]', { timeout: 8000 });
    } catch (e) {
      console.log(e);
    }
    // 3 Loop through connection requests
    const connectionRequests = await page.$$('[componentkey="invitationManagerPage_InvitationsList"]');
    
    let processed = 0;
    for (let card of connectionRequests) {
      try {

        const isNewsletter = await card.$('.newsletter-entry-point') !== null;
        if (isNewsletter) continue;

        // Extract mutual connections text
        const mutualText = await card.$eval('p.f36911c9._51c354ee', el => el.textContent);

        const mutualMatch = mutualText.match(/(\d+)\s+other mutual connections/);
        const mutualCount = mutualMatch ? parseInt(mutualMatch[1]) : 0;

        if (mutualCount > MUTUAL_THRESHOLD) {
          // Click Accept Button
          const acceptBtn = await card.$('button.artdeco-button--secondary');
          if (acceptBtn) {
              await acceptBtn.evaluate(btn => btn.click());
          }
          
          //limit
          processed++;
          if(processed>9)break;

        } else {
          
        }

        await page.waitForTimeout(1500 + Math.random() * 1000); // wait to mimic human behavior
    } catch (e) {
      console.log("error")
    }
  }
  } 
  catch(error){
    console.log(error);
  }
  await page.waitForTimeout(1000 * 60 * 2);

  await browser.close();
})();
