/**
 * Import vendor modules
 */
const {Logger} = require('@neobeach/core');
const expressBrowserSupport = require('express-browsersupport');

/**
 * Middleware to redirect 'Old Browsers' to an alternative page
 *
 * @module @neobeach/middlewares-old-browser
 * @access public
 * @since 1.0.0
 * @author Glenn de Haan
 * @copyright MIT
 *
 * @param {array} supported_browsers - List of browsers and supported version numbers
 * @param {boolean} debug - Enables/disables debug logs
 * @return {function(*, *, *)}
 *
 * @example
 * const {Runtime, Server} = require('@neobeach/core');
 * const oldBrowser = require('@neobeach/middlewares-old-browser');
 *
 * const server = new Server();
 *
 * Runtime(() => {
 *    server.loadMiddlewares([oldBrowser(['Chrome >= 41', 'Firefox >= 13', 'Safari >= 10', 'IE >= 99', 'Edge == All'], false)]);
 *    server.run();
 * });
 */
module.exports = (supported_browsers = ['Chrome >= 41', 'Firefox >= 13', 'Safari >= 10', 'IE >= 99', 'Edge == All'], debug = false) => {
    /**
     * Check if supported browsers are correct
     */
    if (typeof supported_browsers === 'undefined' || !Array.isArray(supported_browsers)) {
        Logger.error("[OLD BROWSER] Option 'supported_browsers' must be an Array");
        process.exit(1);
        return;
    }

    /**
     * Check if debug is set correctly
     */
    if (typeof debug === 'undefined' || typeof debug !== "boolean") {
        Logger.error("[OLD BROWSER] Option 'debug' must be a Boolean");
        process.exit(1);
        return;
    }

    /**
     * Return the express middleware
     */
    return expressBrowserSupport({
        customResponse: require('./page'),
        debug: debug,
        supportedBrowsers: supported_browsers
    });
};
