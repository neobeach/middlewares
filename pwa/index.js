/**
 * Middleware to serve Manifest and Service Worker.
 * 
 * @returns {Function}
 */
module.exports = () => {
    return (req, res, next) => {
        if (req.originalUrl.indexOf("manifest.json") !== -1) {
            const manifest = {
                short_name: config.pwa.shortName,
                name: config.pwa.name,
                icons: [
                    {
                        src: "/images/icons-192.png",
                        type: "image/png",
                        sizes: "192x192"
                    },
                    {
                        src: "/images/icons-512.png",
                        type: "image/png",
                        sizes: "512x512"
                    }
                ],
                start_url: "/?source=pwa",
                background_color: config.pwa.backgroundColor,
                display: "standalone",
                scope: "/",
                theme_color: config.pwa.themeColor
            };
            res.json(manifest);
            return; 
        }


        next();
    }
}