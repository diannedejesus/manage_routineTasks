const http = require('http');
const https = require('https');
var qs = require('querystring');
const User = require('../models/User')

/**
 * getJSON:  RESTful GET request returning JSON object(s)
 * @param options: http options object
 * @param callback: callback to pass the results JSON object(s) back
 */

module.exports.getJSON = async (accessToken) => {
    const userInfo = await User.findOne( { accessToken: accessToken })

    return new Promise((resolve, reject) => {
        console.log('Start::PromiseHTTPS')

        let postData = qs.stringify({
            grant_type: 'refresh_token',
            refresh_token: userInfo.refreshToken,
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
    
                await User.findOneAndUpdate( { microsoftId: userInfo.microsoftId, accessToken: body.access_token, refreshToken: body.refresh_token })
                //console.log(body)
                resolve(res.access_token)
            });
    
            res.on("error", function (error) {
                reject(error)
            });
        });

        post_req.write(postData)
        post_req.end()
    })
    // console.log('rest::getJSON');
    // //const port = options.port == 3000 ? https : http;
    // const userInfo = await User.findOne( { accessToken: accessToken })

    // var postData = qs.stringify({
    //     grant_type: 'refresh_token',
    //     refresh_token: userInfo.refreshToken,
    //     client_id: process.env.OAUTH_APP_ID,
    //     client_secret: process.env.OAUTH_APP_PASSWORD,
    // });

    // var options = {
    //     hostname: 'login.microsoftonline.com',
    //     method: 'POST',
    //     path: '/common/oauth2/v2.0/token/',
    //     headers: {
    //         'Content-Type': 'application/x-www-form-urlencoded',
    //         'Content-Length': postData.length,
    //     },
    // };

    // const req = https.request(options, (res) => {
    //     let chunks = []

    //     res.on("data", function (chunk) {
    //         chunks.push(chunk)
    //     });

    //     res.on("end", async function (chunk) {
    //         let body = JSON.parse(Buffer.concat(chunks))

    //         await User.findOneAndUpdate( { microsoftId: userInfo.microsoftId, accessToken: body.access_token, refreshToken: body.refresh_token })
    //         console.log(body)
    //         return res.access_token
    //     });

    //     res.on("error", function (error) {
    //         console.error(error)
    //     });
    // });

    // req.write(postData)
    // req.end()
}








