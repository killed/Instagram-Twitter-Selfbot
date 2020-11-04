"use strict";

// Libraries
const crypto = require("crypto");
const https = require("./http");

// Variables
var config = require("../../data/config");

module.exports.getAccountInformation = function() {
    return new Promise((resolve, reject) => {
        https.get("www.instagram.com", "/accounts/edit/?__a=1", config.instagram.sessionId, config.instagram.userAgents.browser).then(body => {
            if (body.includes("username") && body.includes("email")) {
                resolve(JSON.parse(body).form_data);
            } else
                reject(true);
        });
    });
}

module.exports.randomString = function(length) {
    var result = "";
    var characters = "abcdefghijklmnopqrstuvwxyz0123456789";

    for (var i = 0; i < length; i++)
        result += characters.charAt(Math.floor(Math.random() * characters.length));

    return result;
}

module.exports.genenerateSignature = function(data) {
    return crypto.createHmac("sha256", config.instagram.signature.key).update(data).digest("hex");
}

module.exports.signPostData = function(data) {
    return `signed_body=${this.genenerateSignature(JSON.stringify(data))}.${JSON.stringify(data)}&ig_sig_key_version=${config.instagram.signature.keyVersion}`;
}