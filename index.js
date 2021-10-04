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

        var fs = require('fs');

        fs.open('testFile.txt', 'w', (err) => {
            if(err) throw err;
            console.log('File created');
        });

        const table = await this.getHTML();
        const xpath = require('xpath');
        const dom = require('xmldom').DOMParser;
 
        var xml = table.data;
        var doc = new dom().parseFromString(xml, 'text/xml');
        var nodes = xpath.select("//table[@class='wrapped relative-table confluenceTable']/tbody/*[preceding-sibling::tr[1]]", doc);
        //console.log(nodes[0].toString());
        //console.log(nodes);
        // let tds = xpath.select("//td", nodes[56]);
        // console.log(tds[0].toString());
        nodes.forEach(tr => {
            var row = new dom().parseFromString(tr.toString(), 'text/xml');
            let tds = xpath.select("//td", row);
            console.log('elem123ent', tds[1].lastChild.lastChild.data);
            fs.appendFile('testFile.txt', tds[1].lastChild.lastChild.data + '\n', (err) => {
                if(err) throw err;
                console.log('Data has been added!');
            });
        })
        //return nodes[0].localName + ": " + nodes[0].firstChild.data;

    }

}

async function startParser() {
    var parser = new CategoryParser('https://kaspi.kz/merchantcabinet/support/pages/viewpage.action?pageId=8912971');
    console.log(await parser.getTable());
}

startParser()