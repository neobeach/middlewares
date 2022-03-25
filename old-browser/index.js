/**
 * Import vendor modules
 */
const {Logger} = require('@neobeach/core');
const expressBrowserSupport = require('express-browsersupport');

/**
 * Exports the Old Browser Middleware
 *
 * @param supported_browsers
 * @param debug
 * @return {function(*, *, *) | undefined}
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
