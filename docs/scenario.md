# Setup scenario

As a first step, we need to define a `Scenario`. The scenario defines a set of actions that
resembles a particular userflow.
`Scenario`s can be defined as `.js` files and executed with the `memlab run` command, passing the `--scenario path/to/scenario.js` argument.

```bash
memlab run --scenario path/to/scenario.js
```

Memlab executes the scenario and captures a memory heap snapshot after each step.

# Basic Scenario

The following scenario will do the following steps:

```js

const scenario = {
  url: () => 'https://www.npmjs.com/',
  action: async (page) => {
    await page.click('a[href="/link"]');
  },
  back: async (page) => {
    await page.click('a[href="/back"]');
  },
};

module.exports = scenario;

```

# Scenario API

A [`Scenario`](https://facebook.github.io/memlab/docs/api/interfaces/core_src.IScenario) consists of the following properties:

## `url`

**Type**: `() => void`

The `url` marks the starting point of the user flow. When running a scenario, memlab will open this URL first and create a heap snapshot of the current
state.

## `action`

The `action` callback defines interactions which simulate a user navigating around the application.

**Type**: `(page: Page) => Promise<void>` ([`InteractionsCallback`](https://facebook.github.io/memlab/docs/api/modules/core_src#interactionscallback))

**Parameters**:

* page: Page | the puppeteer [Page](https://pptr.dev/api/puppeteer.page) object, which provides APIs to interact with the web browser

**Example**:

```js

action: async (page) => {
  await page.click('a[href="/link"]');
},

```

## `back`

The `back` callback defines interactions which should revert any change made in the `action` callback.

**Type**: `(page: Page) => Promise<void>` ([`InteractionsCallback`](https://facebook.github.io/memlab/docs/api/modules/core_src#interactionscallback))

**Parameters**:

* page: Page | the puppeteer [Page](https://pptr.dev/api/puppeteer.page) object, which provides APIs to interact with the web browser

**Example**:

```js

back: async (page) => {
  await page.click('a[href="/back"]');
},

```

## `isPageLoaded` (Optional)

Optional callback function that checks if the web page is loaded for the initial page load and subsequent browser interactions.
This is very useful to wait for certain network requests being processed or DOM to be accessible before creating a heap snapshot.

If this callback is not provided, memlab by default considers a navigation to be finished when there are no network connections for at least 500ms.

**Type**: `(page: Page) => Promise<boolean>` ([`CheckPageLoadCallback`](https://facebook.github.io/memlab/docs/api/modules/core_src/#checkpageloadcallback))

**Parameters**:

* page: Page | the puppeteer [Page](https://pptr.dev/api/puppeteer.page) object, which provides APIs to interact with the web browser

**Example**:

```js

isPageLoaded: async (page) => {
  // consider page to be loaded when task-list__rows are rendered
  await page.waitForSelector('[data-test="task-list__rows"]');
},

```

## `setup` (Optional)

The `setup` callback will be called once after the initial page load.
This callback can be used to perform authentication if you have to. Using cookies is recommended, though.
You can also use it to prepare data before the action call.


**Type**: `(page: Page) => Promise<boolean>` ([`CheckPageLoadCallback`](https://facebook.github.io/memlab/docs/api/modules/core_src/#checkpageloadcallback))

**Parameters**:

* page: Page | the puppeteer [Page](https://pptr.dev/api/puppeteer.page) object, which provides APIs to interact with the web browser

**Example**:

```js

setup: async (page) => {
    const loggedId = !url.includes('login');
    if (!loggedId) {
        await page.evaluate((t) => {
            window.localStorage.setItem('token', t);
        }, token);
        await page.goto(`${startUrl}`);            
    }
},

```
 
## `cookies` (Optional)

If the application requires authentication or specific cookie(s) to be set, you can pass them here.

**Type**: `() => Cookies` ([`Cookies`](https://facebook.github.io/memlab/docs/api/modules/core_src/#cookies))

**Example**:

```js

cookies: () => [
    {name:'cm_j', value: 'none', domain: '.facebook.com'},
    {name:'datr', value: 'yJvIY...', domain: '.facebook.com'},
    {name:'c_user', value: '8917...', domain: '.facebook.com'},
    {name:'xs', value: '95:9WQ...', domain: '.facebook.com'},
    // ...
],

```

## `repeat` (Optional)

Optional function determining the amount of repetitions to perform the defined scenario.

**Type**: `() => number`

**Example**:

```js
// browser interaction: two additional [ action -> back ]
// init-load -> action -> back -> action -> back -> action -> back
repeat: () => 2

```
