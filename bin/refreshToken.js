const http = require('http');
const https = require('https');
let qs = require('querystring');

/**
 * getJSON:  RESTful GET request returning JSON object(s)
 * @param options: http options object
 * @param callback: callback to pass the results JSON object(s) back
 */

module.exports.getJSON = async (refreshToken) => {

    return new Promise((resolve, reject) => {
        console.log('Start::PromiseHTTPS')

        let postData = qs.stringify({
            grant_type: 'refresh_token',
            refresh_token: refreshToken,
            client_id: process.env.OAUTH_APP_ID,
            client_secret: process.env.OAUTH_APP_PASSWORD,
        })

        let options = {
            hostname: 'login.microsoftonline.com',
            method: 'POST',
            path: '/common/oauth2/v2.0/token/',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
                'Content-Length': postData.length,
            },
        }


        let post_req = https.request(options, (res) => {
            let chunks = []
    
            res.on("data", function (chunk) {
                chunks.push(chunk)
            });
    
            res.on("end", async function (chunk) {

                let body = JSON.parse(Buffer.concat(chunks))
                resolve(body)
            });
    
            res.on("error", function (error) {
                reject(error)
            });
        });

        post_req.write(postData)
        post_req.end()
    })
}








