const express = require("express"),
    app = express(),
    request = require("request"),
    xml2js = require("xml2js");

function s4() {
    return Math.floor((1 + Math.random()) * 0x10000).toString(16).substring(1);
}

function guid() {
    return s4() + s4() + '-' + s4() + '-' + s4() + '-' + s4() + '-' + s4() + s4() + s4();
}

function parseXml(xml) {
    const promise = new Promise((resolve, reject) => {
        xml2js.parseString(xml, (err, result) => {
            if (err) {
                reject(err);
            }

            resolve(result);
        });
    });

    return promise;
}

function prepareJSON(result) {
    const tips = {
        tips: []
    };

    result.toplevel.CompleteSuggestion.forEach((value) => {
        tips.tips.push({
            id: guid(),
            value: value.suggestion[0].$.data
        });
    });

    return tips;
}

function getTips(text) {
    const promise = new Promise((resolve, reject) => {
        request.get({
            url: "http://suggestqueries.google.com/complete/search",
            qs: {
                "client": "toolbar",
                "q": text
            }
        }, (err, response, body) => {
            parseXml(body).then((result) => {
                const tips = prepareJSON(result);

                resolve(tips);
            });
        });
    });
    
    return promise;
}

function getAddr(req) {
    const promise = new Promise((resolve, reject) => {
        const addr = req.headers["x-forwarded-for"] || req.connection.remoteAddress;

        if (addr !== "127.0.0.1") {
            resolve(addr);
        }

        request.get({
            url: "https://api.ipify.org",
            qs: {
                "format": "json"
            }
        }, (err, response, body) => {
            resolve(JSON.parse(body));
        });
    });

    return promise;
}

function getGeoData(ip) {
    const promise = new Promise((resolve, reject) => {
        request.get({
            url: `http://api.ipstack.com/${ip}`,
            qs: {
                "access_key": "9d2264448f073a96db2283c3f3b6a1b2",
                "format": 1
            }
        }, (err, response, body) => {
            resolve(JSON.parse(body));
        });
    });

    return promise;
}

function writeInDB(geoData, text) {
    debugger;
}

app.use(express.static("dist"));

app.get("/api/getTips", (req, res) => {
    const p1 = getAddr(req),
        p2 = getTips(req.query.text);
    let tips;
    
    Promise.all([p1, p2])
        .then(values => {
            tips = values[1].tips;

            return getGeoData(values[0].ip);
        })
        .then (geoData => {
            writeInDB(geoData, req.query.text);
            res.send(tips);
        });
});

app.listen(8080,  "0.0.0.0");