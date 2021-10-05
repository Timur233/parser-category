//npm i cheerio
//npm i axios

const { data } = require('cheerio/lib/api/attributes');

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

        const cheerio = require('cheerio');
        const html = await this.getHTML();

        let getData = html => {
            let data = [];
            const $ = cheerio.load(html);
            
            (function parseTable() {
                $('table.confluenceTable>tbody>tr:not(:first-child)').each((i, tr) => {
                    
                    let firstLevel = $(tr).find('td:first-child').text();
                    let secondLevel = $(tr).find('td:nth-child(2)').text();
                    let thirdLevel = $(tr).find('td:nth-child(3)').text();
                    let precent = $(tr).find('td:last-child').text();

                    data.push({firstLevel, secondLevel, thirdLevel, precent});
                    
                })
            })()
            
            return data;
        }

        return getData(html.data);

    }

}

async function startParser() {
    var parser = new CategoryParser('https://kaspi.kz/merchantcabinet/support/pages/viewpage.action?pageId=8912971');
    console.log(await parser.getTable());
    return await parser.getTable();
}

startParser();