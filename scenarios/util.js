export async function clickStackBlitzPrompt(page) {
  const runPrompt = await page.$('#promptToRun');
  if (runPrompt) {
    await page.click('#promptToRun button');
  }
}
