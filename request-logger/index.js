/**
 * Import vendor modules
 */
const {Logger} = require('@neobeach/core');

/**
 * Log all incoming requests from Express
 *
 * @access public
 * @since 1.0.0
 * @author Glenn de Haan
 * @copyright MIT
 *
 * @return {function(*, *, *)}
 *
 * @example
 * const {Runtime, Server} = require('@neobeach/core');
 * const requestLogger = require('@neobeach/middlewares-request-logger');
 *
 * const server = new Server();
 *
 * Runtime(() => {
 *    server.loadMiddlewares([requestLogger()]);
 *    server.run();
 * });
 */
module.exports = () => {
    return (req, res, next) => {
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
};
