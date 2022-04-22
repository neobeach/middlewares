# neobeach/middlewares

Mono repo containing middleware implementation based on @neabeach/core.

## What are middlewares
Middleware functions are functions that have access to the request object (req), the response object (res), and the next function in the application’s request-response cycle.
The middleware functions will be performed on every request made to the application. It is used to perform certain actions before the page is loaded.

## How to implement middlewares in neobeach
To implement middlewares you have to first require them in the `server.js` file. After this you have to load them in via `server.loadMiddlewares` functions inside `Runtime`.
Inside `Runtime` you can decide the order the middlewares are loaded in. You can also just collect them all inside an array and load them all in at once.

Example from the `server.js`file.
```javascript
const {Runtime, Server} = require('@neobeach/core');
const requestLogger = require('@neobeach/middlewares-request-logger');
const oldBrowser = require('@neobeach/middlewares-old-browser');
const pwa = require('@neobeach/middlewares-pwa');

const server = new Server();

/**
 * Define global middlewares
 */
const globalMiddleware = [
    requestLogger(),
    oldBrowser()
];


/**
 * Create a runtime/sandbox to start the server in
 */
Runtime(() => {
    server.includeDefaultBodyParsers();
    server.loadMiddlewares(globalMiddleware);
    server.loadRouters(routers);
    server.loadMiddlewares(pwa);
    server.run();
});

```


## Create middlewares yourself
If you have a middleware that you want to include look at the other middlewares as a template.
When you are done with them, and they are tested create a pull request in @neobeach/middlewares.

### Structure
The base structure of the middlewares is as follows.

```text
middleware/
    package.json            <- Package.json containing metadata + dependencies needed.
    index.js                <- Export of the function that is inside the middleware.
```
### JSDocs
Inside the middleware we follow the JSDocs documentation. Reason for this is that we write the documentation while we write our code.
The JSDocs need to contain types on function parameters and an example on how to implement the code.

## License
MIT
