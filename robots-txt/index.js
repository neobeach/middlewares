/**
 * Import modules
 */
 const {Logger} = require('@neobeach/core');

/**
 * Set up a robots.txt
 *
 * @access public
 * @since 1.0.0
 * @author Glenn de Haan
 * @copyright MIT
 *
 * @param {Boolean} disallowAll - Boolean to allow or disallow all from indexing the site
 * @param {Array} extraDisallowRules - Array to add project based routes to disallow list
 * @returns {function(*, *, *)}
 *
 * @example
 * const globalMiddleware = [
 *    robotsTxt(true, [])
 * ]
*/
module.exports = (disallowAll = false, extraDisallowRules = []) => {
    /**
     * Check if disallowAll is correct
    */
    if(typeof disallowAll === "undefined" || typeof disallowAll !== "boolean") {
        Logger.error("[ROBOTS.TXT] disallowAll is not correct");
    }

    /**
     * Check if extraDisallowRules is correct
    */
    if(typeof extraDisallowRules === "undefined" || !Array.isArray(extraDisallowRules)){
        Logger.error("[ROBOTS.TXT] extraDisallowRules is not correct");
    }

    return (req, res, next) => {
        if (req.originalUrl.indexOf("robots.txt") !== -1) {
            const userAgent = "User-agent: *";
            const sitemap = `Sitemap: ${req.protocol}://${req.headers.host}/sitemap.xml`;

            const defaultDisallowRules = [
              ...(disallowAll ? ["Disallow: /"] : ["Disallow: /api/", "Disallow: /fonts/",])
            ];

            res.type("text/plain");
            res.send(`${userAgent}\n${[...defaultDisallowRules, ...extraDisallowRules].join('\n')}\n${sitemap}`);
        } else {
            next();
        }
    };
}
