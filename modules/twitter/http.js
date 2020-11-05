"use strict";

// Libraries
const zlib = require("zlib");
const https = require("https");

module.exports.get = function(host, endpoint, authToken, csrfToken) {
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
                "X-CSRF-Token": csrfToken,
                "Authorization": "Bearer " + "AAAAAAAAAAAAAAAAAAAAANRILgAAAAAAnNwIzUejRCOuH5E6I8xnZz4puTs%3D1Zv7ttfk8LF81IUq16cHjhLTvJu4FA33AGWWjCpTnA",
                "Cookie": "auth_token=" + authToken + "; ct0=" + csrfToken,
                "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:73.0) Gecko/20100101 Firefox/73.0"
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

module.exports.post = function(host, endpoint, postData, authToken, csrfToken) {
    return new Promise((resolve, reject) => {
        const req = https.request({
            method: "POST",
            timeout: 1000 * 5,
            hostname: host,
            path: endpoint,
            headers: {
                "Accept": "*/*",
                "Accept-Language": "en-US",
                "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:73.0) Gecko/20100101 Firefox/73.0",
                "Content-Type": "application/x-www-form-urlencoded",
                "Referer": "https://twitter.com/settings/screen_name",
                "X-CSRF-Token": csrfToken,
                "Authorization": "Bearer " + "AAAAAAAAAAAAAAAAAAAAANRILgAAAAAAnNwIzUejRCOuH5E6I8xnZz4puTs%3D1Zv7ttfk8LF81IUq16cHjhLTvJu4FA33AGWWjCpTnA",
                "Cookie": "auth_token=" + authToken + "; ct0=" + csrfToken,
                "Content-length": postData.length
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