const http = require('http');
const https = require('https');
let qs = require('querystring');

/**
 * getJSON:  RESTful GET request returning JSON object(s)
 * @param options: http options object
 * @param callback: callback to pass the results JSON object(s) back
 */

module.exports.getJSON = async (refreshToken) => {  //recreate a module that accepts a refreshtoken as a parameter

    return new Promise((resolve, reject) => { //create a promise as the return so we can wait for the reply of the server that will serve us a new token
        console.log('Start::PromiseHTTPS')

        let postData = qs.stringify({ //convert the data to a string, this is needed to authenticate our permission to retrieve a new token
            grant_type: 'refresh_token', //type of request we are making
            refresh_token: refreshToken, //the users current refresh token
            client_id: process.env.OAUTH_APP_ID, //our applications id
            client_secret: process.env.OAUTH_APP_PASSWORD, //our applications secrect/password
        })

        let options = { //data for the server we need to ask for a new token
            hostname: 'login.microsoftonline.com', //the main entry point/host
            method: 'POST', //type of request to the host
            path: '/common/oauth2/v2.0/token/', //the route to the api that will give us the new access token for the user
            headers: { //additional info for how we are encoding the data and the amount
                'Content-Type': 'application/x-www-form-urlencoded',
                'Content-Length': postData.length, //if this not included the https will try to stream the data but microsoft will not accept this type of entry of the data
            },
        }


        let post_req = https.request(options, (res) => { //create https request that contains the options data for where we are sending the data and a callback function to be executed
            let chunks = [] //for storing the response
    
            res.on("data", function (chunk) { //here we recieve the response and store it in chunks
                chunks.push(chunk)
            });
    
            res.on("end", async function (chunk) { //when the data stream ends the following is done

                let body = JSON.parse(Buffer.concat(chunks)) //we concatenate or join all the pieces stored in chunks and turn it into a json object
                resolve(body) //the json object will be returned as the successful response of the promise or in other word the resolve
            });
    
            res.on("error", function (error) {
                reject(error) //if an error occurs we send it to the reject response of the promise.
            });
        });

        post_req.write(postData) //we call the write method of the https request and past in the post data
        post_req.end() //we call the end method to close the requestS
    })
}








