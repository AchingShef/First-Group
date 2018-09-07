const express = require("express"),
    os = require("os"),
    app = express(),
    url = require("url"),
    ip = require("ip"),
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
    let url_parts = url.parse(req.url, true),
        addr = req.headers["x-forwarded-for"] || req.connection.remoteAddress;
    
        if (addr.includes("127.0.0.1")) {
            addr = ip.address();
        }

        return addr;
}

app.use(express.static("dist"));
app.get("/api/getTips", (req, res) => {
    let adr = getAddr(req),
        text = req.query.text;
    
    getTips(text).then((tips) => {
        res.send(tips);
    });   
});

app.listen(8080, () => console.log("Listening on port 8080"));