/**
 * Import modules
 */
const {Logger} = require('@neobeach/core');
const expressGeoIp = require('express-geoip');

/**
* Checks if we should redirect based on GEO-IP
*
* @param {Object} routing
* @param {Number} statusCode
* @param {String} defaultCountryCode
* @param {Boolean} debug
* @return {Function}
* 
* @example
* const globalMiddleware = [
*    geoip({'nl': routingNLObject, 'en': routingENObject }, 301, 'nl', false)
* ]
* 
*/
module.exports = (routing, statusCode, defaultCountryCode, debug = false) => (req, res, next) => {
    // Check if ip is in request and check if ip adress is know otherwise use default country code
    const countryCode = req.ip ? expressGeoIp('unkown').getCountryCode(req.ip) == "unkown" ? defaultCountryCode : expressGeoIp('unkown').getCountryCode(req.ip) : defaultCountryCode;

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
};