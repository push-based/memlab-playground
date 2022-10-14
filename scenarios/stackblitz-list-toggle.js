const { clickStackBlitzPrompt } = require('./util');

const url = () => 'https://js-pgj8he.stackblitz.io';

const setup = async page => {
    await clickStackBlitzPrompt(page);
};

const action = async page => {
    await page.click('#toggle-list');
};

const back = async page => {
    await page.click('#toggle-list');
};

module.exports = {
    url, action, back, setup
};
