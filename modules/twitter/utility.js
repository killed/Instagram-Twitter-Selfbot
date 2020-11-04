"use strict";

// Libraries
const crypto = require("crypto");

module.exports.randomCsrf = function() {
    return crypto.createHash("md5").update(Date.now().toString()).digest("hex");
}