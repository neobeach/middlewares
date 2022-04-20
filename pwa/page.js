/**
 * Basic page to show we are offline
 */
module.exports = `
<html lang="en">
    <head>
    <title>Offline</title>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width,initial-scale=1">
    <style>
        html, body {
        font-family: -apple-system,BlinkMacSystemFont,Segoe UI,Roboto,Oxygen,Ubuntu,Cantarell,Fira Sans,Droid Sans,Helvetica Neue,sans-serif;
        letter-spacing: 0;
        font-style: normal;
        text-rendering: optimizeLegibility;
        -webkit-font-smoothing: antialiased;
        -moz-osx-font-smoothing: grayscale;
        color: rgba(0,0,0,.8);
        font-size: 18px;
        margin: 0;
        display: flex;
        justify-content: center;
        align-items: center;
        background: #f4f4f4;
        width: 100%;
        }
        .card {
        width: 400px;
        max-width: calc(100% - 96px);
        padding: 24px;
        border: 1px solid #f4f4f4;
        background: white;
        border-radius: 4px;
        border: 1px solid #e3e3e3;
        line-height: 1.6em;
        }
        .divider {
        border-bottom: 1px solid #e3e3e3;
        margin: 24px 0;
        }
        .link {
        word-break: break-word;
        }
        strong {
        font-weight: 500;
        }
    </style>
    </head>
    <body>
    <div class="card">
        <div>Oops, you're offline so the page couldn't be loaded! Please go online and try again.</div>
        <div class="divider"></div>
        <div>
            <strong>Requested url:</strong>
            <span class="link"></span>
        </div>
    </div>
    <script>
        document.querySelector('.link').textContent = window.location.href;
    </script>
    </body>
</html>`