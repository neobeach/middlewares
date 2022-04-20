/**
 * Import modules
 */
const {Logger} = require('@neobeach/core');
const expressGeoIp = require('express-geoip');

/**
* Checks if we should redirect based on GEO-IP
*
* @param {Object} routing
* @param {String} defaultCountryCode
* @param {Number} statusCode
* @param {Boolean} debug
* @return {Function}
*
* @example
* const globalMiddleware = [
*    geoip({'nl': 'nl-NL'}, 'nl', 307, false)
* ]
*
*/
module.exports = (routing, defaultCountryCode, statusCode , debug = false) => {
    return (req, res, next) => {
        // Check if ip is in request and check if ip address is know otherwise use default country code
        const countryCode = req.ip ? expressGeoIp('unknown').getCountryCode(req.ip) === "unknown" ? defaultCountryCode : expressGeoIp('unknown').getCountryCode(req.ip) : defaultCountryCode;

        const urlWithoutParams = req.originalUrl.split("?")[0];
        console.log(countryCode);
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
