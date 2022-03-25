/**
 * Import vendor modules
 */
const {Logger} = require('@neobeach/core');

/**
 * Log all incoming requests from express
 *
 * @param req
 * @param res
 * @param next
 */
module.exports = (req, res, next) => {
    Logger.info(`[EXPRESS][REQUEST](${req.method}): ${req.originalUrl}`);
    Logger.debug(`[EXPRESS][REQUEST][${req.originalUrl}][HEADERS](${req.method}): ${JSON.stringify(req.headers)}`);

    if (typeof req.cookies === "object") {
        Logger.debug(`[EXPRESS][REQUEST][${req.originalUrl}][COOKIES](${req.method}): ${JSON.stringify(req.cookies)}`);
    }

    if (req.method === "POST" && typeof req.body === "object") {
        Logger.debug(`[EXPRESS][REQUEST][${req.originalUrl}][DATA](${req.method}): ${JSON.stringify(req.body)}`);
    }

    next();
};
