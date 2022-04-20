/**
 * Import vendor modules
 */
const {Logger} = require('@neobeach/core');

/**
 * Middleware to serve Manifest and Service Worker.
 *
 * @access public
 * @since 1.0.0
 * @author Glenn de Haan
 * @copyright MIT
 *
 * @param {String} name - Completed full name of the application. (maximum of 45 characters)
 * @param {String} shortName - Name to display when name is too long. (maximum of 12 characters recommended)
 * @param {String} themeColor - Hex of the color that will be used as theme.
 * @param {String} backgroundColor - Hex of the color that will be used as background color.
 * @param {String} version - Version to give back in service worker.
 * @param {Function|Boolean} customServiceWorker - Function to implement your own custom service worker.
 * @returns {function('*', '*', '*')}
 *
 * @example
 * const {Runtime, Server} = require('@neobeach/core');
 * const pwa = require('@neobeach/middlewares-pwa');
 * const Api = require('./routers/Api');
 *
 * const server = new Server();
 *
 * Runtime(() => {
 *      server.loadMiddlewares([pwa('DPDK Project', 'Project', '#000000', '#000000', '1.0.0')]);
 *      server.run();
 * })
 *
 */
module.exports = (name, shortName, themeColor, backgroundColor, version, customServiceWorker = false) => {
    return (req, res, next) => {
        /**
         * Check if name is correct
         */
        if(typeof name === "undefined" || typeof name !== "string" || name === "") {
            Logger.error("[PWA] name is not correct");
            process.exit(1);
            return;
        }

        /**
         * Check if shortName is correct
         */
        if(typeof shortName === "undefined" || typeof shortName !== "string" || shortName === "") {
            Logger.error("[PWA] shortName is not correct");
            process.exit(1);
            return;
        }

        /**
         * Check if themeColor is correct
         */
        if(typeof themeColor === "undefined" || typeof themeColor !== "string" || themeColor === "") {
            Logger.error("[PWA] themeColor is not correct");
            process.exit(1);
            return;
        }

        /**
         * Check if backgroundColor is correct
         */
        if(typeof backgroundColor === "undefined" || typeof backgroundColor !== "string" || backgroundColor === "") {
            Logger.error("[PWA] backgroundColor is not correct");
            process.exit(1);
            return;
        }

        /**
         * Check if version is correct
         */
        if(typeof version === "undefined" || typeof version !== "string" || version === "") {
            Logger.error("[PWA] version is not correct");
            process.exit(1);
            return;
        }

        if (req.originalUrl.indexOf("manifest.json") !== -1) {
            const manifest = {
                short_name: shortName,
                name: name,
                icons: [
                    {
                        src: "/images/icons-192.png",
                        type: "image/png",
                        sizes: "192x192"
                    },
                    {
                        src: "/images/icons-512.png",
                        type: "image/png",
                        sizes: "512x512"
                    }
                ],
                start_url: "/?source=pwa",
                background_color: backgroundColor,
                display: "standalone",
                scope: "/",
                theme_color: themeColor
            };
            res.json(manifest);
            return;
        }

        if (req.originalUrl.indexOf("sw.js") !== -1) {
            if(typeof customServiceWorker === "function") {
                res.type("application/javascript");
                res.send(customServiceWorker);

                return;
            }

            const offlinePage = require('./page');

            res.type("application/javascript");
            res.send(`
                const PRECACHE = 'precache-${version}';
                const RUNTIME = 'runtime';
                const PRECACHE_URLS = [];

                self.addEventListener('install', event => {
                    event.waitUntil(
                        caches.open(PRECACHE)
                        .then(cache => cache.addAll(PRECACHE_URLS))
                        .then(self.skipWaiting())
                    );
                });

                self.addEventListener('activate', event => {
                    const currentCaches = [PRECACHE];
                    event.waitUntil(
                        caches.keys().then(cacheNames => {
                        return cacheNames.filter(cacheName => !currentCaches.includes(cacheName));
                    }).then(cachesToDelete => {
                        return Promise.all(cachesToDelete.map(cacheToDelete => {
                            return caches.delete(cacheToDelete);
                        }));
                    }).then(() => self.clients.claim()));
                });

                self.addEventListener('fetch', event => {
                    if (event.request.url.startsWith(self.location.origin)) {
                        event.respondWith(
                        caches.match(event.request).then(cachedResponse => {
                            if (cachedResponse) return cachedResponse;
                            return fetch(event.request).then(response => {
                                return response;
                            }).catch(() => new Response(\`${offlinePage}\`, {
                                headers: {'Content-Type': 'text/html'}
                            }));
                        }));
                    }
                });`
            );
        }

        next();
    }
}
