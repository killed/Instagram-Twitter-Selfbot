"use strict";

// Libraries
const https = require("https");
const zlib = require("zlib");

module.exports.get = function(endpoint, sessionId) {
    return new Promise((resolve, reject) => {
        https.request({
            method: "GET",
            timeout: 1000 * 10,
            hostname: "www.instagram.com",
            path: endpoint,
            headers: {
                "Accept": "*/*",
                "Accept-Language": "en-US",
                "Accept-Encoding": "gzip, deflate",
                "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/85.0.4183.121 Safari/537.36 OPR/71.0.3770.310",
                "x-csrftoken": randomString(32),
                "Cookie": `sessionid=${sessionId}`
            },
        }, res => {
            var buffer = [];
            var handler = res;

            if (res.headers["content-encoding"]) {
                var gunzip = zlib.createGunzip();
                res.pipe(gunzip);
                handler = gunzip;
            }

            handler.on("data", data => {
                buffer += data;
            }).on("end", () => {
                resolve(buffer);
            });
        }).on("error", error => reject(error)).end();
    });
}

module.exports.post = function(endpoint, postData, sessionId) {
    return new Promise((resolve, reject) => {
        const req = https.request({
            method: "POST",
            timeout: 3000,
            hostname: "www.instagram.com",
            path: endpoint,
            headers: {
                "Accept": "*/*",
                "Accept-Language": "en-US",
                "Accept-Encoding": "gzip, deflate",
                "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/85.0.4183.121 Safari/537.36 OPR/71.0.3770.310",
                "Content-Type": "application/x-www-form-urlencoded",
                "x-csrftoken": randomString(32),
                "Cookie": `sessionid=${sessionId}`
            },
        }, res => {
            var buffer = [];
            var handler = res;

            if (res.headers["content-encoding"]) {
                var gunzip = zlib.createGunzip();
                res.pipe(gunzip);
                handler = gunzip;
            }

            handler.on("data", data => {
                buffer += data;
            }).on("end", () => {
                resolve(buffer);
            });
        }).on("error", error => reject(error)).end();
    });
}

function randomString(length) {
    var result = "";
    var characters = "abcdefghijklmnopqrstuvwxyz0123456789";

    for (var i = 0; i < length; i++)
        result += characters.charAt(Math.floor(Math.random() * characters.length));

    return result;
}