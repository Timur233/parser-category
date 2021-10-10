import fetch from 'node-fetch';
import cheerio from 'cheerio';
import axios from 'axios';
class CategoryParser {

    constructor(getTariffsLink, getCategoriesLink, authToken) {
        this.tariffsLink = getTariffsLink,
        this.catsLink = getCategoriesLink,
        this.authToken = authToken
    }

    async getHTML() {
        const html = axios.get(this.tariffsLink)
        
        .then(function (response) {
            return response;
        })
        
        .catch(function (error) {
            console.log('getHtml request', error);
        })

        return html;

    }

    async getTable() {

        const html = await this.getHTML();
        const categories = await this.getKaspiCategories();

        let getData = html => {
            let data = [];
            const $ = cheerio.load(html);
            
            (function parseTable() {
                $('table.confluenceTable>tbody>tr:not(:first-child)').each((i, tr) => {
                    
                    let firstLevel = $(tr).find('td:first-child').text();
                    let secondLevel = $(tr).find('td:nth-child(2)').text();
                    let thirdLevel = $(tr).find('td:nth-child(3)').text();
                    let categoryCode = categories[thirdLevel.replace(/\s+/g, '').toLowerCase()];
                    let precent = $(tr).find('td:last-child').text();

                    data.push({firstLevel, secondLevel, thirdLevel, categoryCode, precent});
                    updateCategoryInSvb(firstLevel, secondLevel, thirdLevel, categoryCode, precent);
                    
                })
            })()
            
            return data;
        }

        return getData(html.data);

    }

    async getKaspiCategories() {
        
        var categoryCodes = {};
        const categories = await fetch(this.catsLink, {
            method: 'get',
            headers: {
                'X-Auth-Token': this.authToken,
                'Accept': 'application/json',
                'Host': 'kaspi.kz'
            }
        })

        const categoriesJspn = await categories.json();
        categoriesJspn.forEach(category => {
            categoryCodes[category.title.replace(/\s+/g, '').toLowerCase()] = category.code;
        });

        return categoryCodes;

    }

    async updateCategoryInSvb(firstLevel, secondLevel, thirdLevel, categoryCode, precent) {
        
        const getCategoryUuid = (categoryTitle, parentUuid = '') => {
            // Reuest where cat-title = categoryTitle and where parent-uuid = parentUuid
            // Return UUID
        }
        var parent = '';

        parent = getCategoryUuid(firstLevel);
        parent = getCategoryUuid(secondLevel, parent);


    }

}

(async function () {

    const getTariffsLink = 'https://kaspi.kz/merchantcabinet/support/pages/viewpage.action?pageId=8912971';
    const getCategoriesLink = 'https://kaspi.kz/shop/api/products/classification/categories';
    const authToken = 'KdVO8SkcbqwKkCU70J1N/qYNKxQBR2YBsppaeoarnpQ=';

    var parser = new CategoryParser(getTariffsLink, getCategoriesLink, authToken);
    console.log(await parser.getTable());

    return await parser.getTable();

})()