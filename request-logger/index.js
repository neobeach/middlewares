/**
 * Import vendor modules
 */
const {Logger} = require('@neobeach/core');

/**
 * Log all incoming requests from Express
 *
 * @module @neobeach/middlewares-request-logger
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
    Logger.info(`[REQUEST LOGGER] Enabled!`);

    return (req, res, next) => {
        Logger.info(`[REQUEST LOGGER](${req.method}): ${req.originalUrl}`);
        Logger.debug(`[REQUEST LOGGER][${req.originalUrl}][HEADERS](${req.method}): ${JSON.stringify(req.headers)}`);

        if (typeof req.cookies === "object") {
            Logger.debug(`[REQUEST LOGGER][${req.originalUrl}][COOKIES](${req.method}): ${JSON.stringify(req.cookies)}`);
        }

        if (req.method === "POST" && typeof req.body === "object") {
            Logger.debug(`[REQUEST LOGGER][${req.originalUrl}][DATA](${req.method}): ${JSON.stringify(req.body)}`);
        }

        next();
    };
};
