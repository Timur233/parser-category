class CategoryParser {

    constructor(url) {
        this.url = url
    }

    async getHTML() {

        const axios = require('axios');
        const html = axios.get(this.url)
        .then(function (response) {
            return response;
        })
        .catch(function (error) {
            console.log(error);
        })

        return html;

    }

    async getTable() {

        const table = await getHTML();
        const xpath = require('xpath');
        const dom = require('xmldom').DOMParser;
 
        var xml = table;
        var doc = new dom().parseFromString(xml);
        var nodes = xpath.select("//title", doc);

        return nodes[0].localName + ": " + nodes[0].firstChild.data;

    }

}

async function startParser() {
    var parser = new CategoryParser('https://kaspi.kz/merchantcabinet/support/pages/viewpage.action?pageId=8912971');
    console.log(await parser.getTable());
}

startParser()