const express = require('express'),
      request = require('request'),
      cors = require('cors');
      app = express();
      router = express.Router();
      serverless = require("serverless-http");
  
app.use(cors());
app.use(`/.netlify/functions/api`, router);

router.get('/', (req, res) => {
  res.send('CORS API running');
});

router.get('/api', function (req, res, next) {

    if (req.method === 'OPTIONS') {
        // CORS Preflight
        res.send();
    } else {
        var targetURL = req.header('Target-URL'); // Target-URL ie. https://example.com or http://example.com
        if (!targetURL) {
            res.send(500, { error: 'There is no Target-Endpoint header in the request' });
            return;
        }
        request({ url: targetURL + req.url, method: req.method, json: req.body, headers: {'Authorization': req.header('Authorization')} },
            function (error, response, body) {
                if (error) {
                    console.error('error: ' + response.statusCode)
                }
//                console.log(body);
            }).pipe(res);
    }
});

module.exports = app;
module.exports.handler = serverless(app);
