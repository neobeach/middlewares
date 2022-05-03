/**
 * Import vendor modules
 */
const {Logger} = require('@neobeach/core');

/**
 * Simple redirect middleware
 *
 * @module @neobeach/middlewares-redirect
 * @access public
 * @since 1.0.0
 * @author Glenn de Haan
 * @copyright MIT
 *
 * @param {Object} redirects - An object containing all static and regex redirects
 * @param {Object} redirects.static - An object containing all static redirects
 * @param {Object} redirects.regex - An object containing all regex redirects
 * @param {Number} [status] - The HTTP status code used for the redirect
 * @return {function(*, *, *)}
 *
 * @example
 * const {Runtime, Server} = require('@neobeach/core');
 * const redirect = require('@neobeach/middlewares-redirect');
 *
 * const server = new Server();
 *
 * Runtime(() => {
 *    server.loadMiddlewares([redirect({static: {'/test': '/test1'}, regex: {'^/test123/.*': '/new'}})]);
 *    server.run();
 * });
 */
module.exports = (redirects = {}, status = 307) => {
    Logger.info(`[REDIRECT] Enabled! Redirect Status Code: ${status}`);

    /**
     * Define statics
     */
    const valid_status_options = [301, 302, 307, 308];

    /**
     * Check if the provided redirects are correct
     */
    if (typeof redirects === 'undefined' || typeof redirects !== 'object') {
        Logger.error("[REDIRECT] Option 'redirects' must be an Object");
        process.exit(1);
        return;
    }
    if (typeof redirects.static === 'undefined' || typeof redirects.static !== 'object') {
        Logger.error("[REDIRECT] Option 'redirects.static' must be an Object");
        process.exit(1);
        return;
    }
    if (typeof redirects.regex === 'undefined' || typeof redirects.regex !== 'object') {
        Logger.error("[REDIRECT] Option 'redirects.regex' must be an Object");
        process.exit(1);
        return;
    }

    /**
     * Check if the provided status is correct
     */
    if (valid_status_options.indexOf(status) === -1) {
        Logger.warn(`[REDIRECT] Invalid option 'status' supplied. Options: ${valid_status_options}`);
        process.exit(1);
        return;
    }

    /**
     * Return the express middleware
     */
    return (req, res, next) => {
        const reqUrl = req.originalUrl.replace(/\/$/, '');
        const nonStrippedReqUrl = req.originalUrl;

        // Check for static redirects
        if (redirects.static[reqUrl]) {
            Logger.info(`[EXPRESS][REDIRECT] Static redirect found: ${reqUrl} -> ${redirects.static[reqUrl]}`);
            res.redirect(status, redirects.static[reqUrl]);
            return;
        }

        // Check for regex redirects
        const regexKeys = Object.keys(redirects.regex);
        for (let item = 0; item < regexKeys.length; item++) {
            const reqRegex = regexKeys[item];
            const matcher = new RegExp(reqRegex);

            // Check if the provided regex matches the current url
            if (matcher.test(reqUrl) || matcher.test(nonStrippedReqUrl)) {
                const resUrl = redirects.regex[reqRegex];
                Logger.info(`[EXPRESS][REDIRECT] Regex redirect found: ${reqRegex} -> ${resUrl}`);

                // Check if the redirect url needs parts from the current url
                if (/\$[0-9]/.test(resUrl)) {
                    Logger.debug(`[EXPRESS][REDIRECT] Redirect url need parts from Current url`);

                    const match = reqUrl.match(matcher);
                    const nonStrippedMatch = nonStrippedReqUrl.match(matcher);

                    if (nonStrippedMatch !== null && nonStrippedMatch[1] !== 'undefined') {
                        Logger.debug(`[EXPRESS][REDIRECT] Redirect url parts found!`);
                        return res.redirect(status, resUrl.replace(/\$[0-9]/, `${nonStrippedMatch[1]}`));
                    }

                    // Check if we have a match available for replacement
                    if (match !== null && typeof match[1] !== 'undefined') {
                        Logger.debug(`[EXPRESS][REDIRECT] Redirect url parts found!`);
                        return res.redirect(status, resUrl.replace(/\$[0-9]/, `${match[1]}`));
                    } else {
                        Logger.debug(`[EXPRESS][REDIRECT] Redirect url parts not found!`);
                        return res.redirect(status, resUrl.replace('$1', ''));
                    }
                } else {
                    Logger.debug(`[EXPRESS][REDIRECT] Redirect url doesn't need parts from Current url`);
                    return res.redirect(status, resUrl);
                }
            }
        }

        next();
    };
};
