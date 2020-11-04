"use strict";

// Libraries
const https = require("https");
const zlib = require("zlib");

// Variables
var utility = require("./utility");

module.exports.get = function(host, endpoint, sessionId, userAgent) {
    return new Promise((resolve, reject) => {
        https.request({
            method: "GET",
            timeout: 1000 * 5,
            hostname: host,
            path: endpoint,
            headers: {
                "Accept": "*/*",
                "Accept-Language": "en-US",
                "Accept-Encoding": "gzip, deflate",
                "User-Agent": userAgent,
                "x-csrftoken": utility.randomString(32),
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

module.exports.post = function(host, endpoint, postData, sessionId, userAgent) {
    return new Promise((resolve, reject) => {
        const req = https.request({
            method: "POST",
            timeout: 1000 * 5,
            hostname: host,
            path: endpoint,
            headers: {
                "Accept": "*/*",
                "Accept-Language": "en-US",
                "Accept-Encoding": "gzip, deflate",
                "User-Agent": userAgent,
                "Content-Type": "application/x-www-form-urlencoded",
                "x-csrftoken": utility.randomString(32),
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

module.exports.postData = function(host, endpoint, postData, sessionId, userAgent) {
    return new Promise((resolve, reject) => {
        const req = https.request({
            method: "POST",
            timeout: 1000 * 5,
            hostname: host,
            path: endpoint,
            headers: {
                "Accept": "*/*",
                "Accept-Language": "en-US",
                "Accept-Encoding": "gzip, deflate",
                "User-Agent": userAgent,
                "Content-Type": "application/x-www-form-urlencoded",
                "Content-Length": postData.length,
                "x-csrftoken": utility.randomString(32),
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
        }).on("error", error => reject(error));

        req.write(postData);
        req.end();
    });
}