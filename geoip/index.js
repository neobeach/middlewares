/**
 * Import modules
 */
const {Logger} = require('@neobeach/core');
const expressGeoIp = require('express-geoip');

/**
 * Checks if we should redirect based on GEO-IP
 *
 * @module @neobeach/middlewares-geoip
 * @access public
 * @since 1.0.0
 * @author Glenn de Haan
 * @copyright MIT
 *
 * @param {Object} routing - Object with blueprint of projects routing.
 * @param {String} defaultCountryCode - When req.ip is not found or recognized use this country code.
 * @param {Number} [statusCode] - The status code to use on the redirect.
 * @param {Boolean} [debug] - Boolean to have extra logging for debugging.
 * @return {function(*, *, *)}
 *
 * @example
 * const {Runtime, Server} = require('@neobeach/core');
 * const geoip = require('@neobeach/middlewares-geoip');
 *
 * const server = new Server();
 *
 * Runtime(() => {
 *      server.loadMiddlewares([geoip({'nl': 'nl-NL'}, 'nl', 301, false)]);
 *      server.run();
 * });
 */
module.exports = (routing, defaultCountryCode, statusCode = 307, debug = false) => {
    return (req, res, next) => {
        /**
         * Check if routing is correct
         */
        if(typeof routing === "undefined" || typeof routing !== "object") {
            Logger.error("[GEOIP] Routing object is not correct");
            process.exit(1);
            return;
        }

        /**
         * Check if defaultCountryCode is correct
         */
        if (typeof defaultCountryCode === "undefined" || typeof defaultCountryCode !== "string" || defaultCountryCode === "") {
            Logger.error("[GEOIP] defaultCountryCode is not correct");
            process.exit(1);
            return;
        }

        // Check if ip is in request and check if ip address is know otherwise use default country code
        const countryCode = req.ip ? expressGeoIp('unknown').getCountryCode(req.ip) === "unknown" ? defaultCountryCode : expressGeoIp('unknown').getCountryCode(req.ip) : defaultCountryCode;

        const urlWithoutParams = req.originalUrl.split("?")[0];

        if (urlWithoutParams === "/") {
            if (routing[countryCode.toLowerCase()]) {
                if (debug) {
                    Logger.info(`[REDIRECT] Based on GeoIP: ${countryCode} -> ${routing[countryCode.toLowerCase()]}`);
                }
                res.redirect(statusCode, routing[countryCode.toLowerCase()]);
                return;
            } else {
                res.redirect(statusCode, defaultCountryCode);
                return;
            }
        }

        next();
    }
};
