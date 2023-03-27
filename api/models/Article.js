const db = require ('../dbConfig/init')
const { removeStopwords } = require('stopword')


class article {
    constructor(data){
        this.id = data.id
        this.title = data.title
        this.body = data.body
        this.city = data.city
        this.country = data.country
        this.continent = data.continent
        this.article_categories = data.article_categories
        this.keywords = data.keywords
        this.published_date = data.published_date
        this.hour_24_views = data.hour_24_views
        this.all_time_views = data.all_time_views
        this.feature_img_html = data.feature_img_html
        this.feature_img_url = data.feature_img_url
    }
    //gets all the articles
    static async getAllArticles(){
        return new Promise (async (resolve, reject) => {
            try {
                const articlesData = await db.query(`SELECT * FROM articles ORDER BY RANDOM ();`)
                const articles = articlesData.rows.map(d => new article(d))
                resolve(articles);
            } catch (err) {
                reject("Error retrieving articles")
            }
        })
    }
    //creates a new article
    static async createNewArticle({title, body, city, country, continent, article_categories, keywords, feature_img_html, feature_img_url}){
        return new Promise (async (resolve, reject) => {
            try {
                let newArticle = await db.query(`INSERT INTO articles (title, body, city, country, continent, article_categories, keywords, hour_24_views, all_time_views, feature_img_html, feature_img_url) VALUES ($1, $2, $3, $4, $5, $6, $7, 0, 0, $8, $9) RETURNING *;`, [ title, body, city, country, continent, article_categories, keywords, feature_img_html, feature_img_url])
                console.log(newArticle.rows[0])
                resolve(newArticle.rows[0])
            }catch(err){
                reject("Error creating new article");
            }
        })
    }
    //shows articles in a certain city
    static showCityArticles(city) {
        return new Promise (async (resolve, reject) => {
            try {
                let articlesData = await db.query(`SELECT * FROM articles WHERE city ILIKE '%${city}%';`); 
                const articles = articlesData.rows.map(d => new article(d))
                resolve(articles);
            } catch (err) {
                reject('Could not retrieve articles for that city');
            }
        });
    }
    //shows articles in a certain country
    static showCountryArticles(country) {
        return new Promise (async (resolve, reject) => {
            try {
                let articlesData = await db.query(`SELECT * FROM articles WHERE country ILIKE '%${country}%';`); 
                const articles = articlesData.rows.map(d => new article(d))
                resolve(articles);
            } catch (err) {
                reject('Could not retrieve articles for that country');
            }
        });
    }
    //shows articles in a certain continent
    static showContinentArticles(continent) {
        return new Promise (async (resolve, reject) => {
            try {
                let articlesData = await db.query(`SELECT * FROM articles WHERE continent ILIKE '%${continent}%';`); 
                const articles = articlesData.rows.map(d => new article(d))
                resolve(articles);
            } catch (err) {
                reject('Could not retrieve articles for that continent');
            }
        });
    }
    //shows articles in a certain category
    static showCategoryArticles(category) {
        return new Promise (async (resolve, reject) => {
            try {
                let articlesData = await db.query(`SELECT * FROM articles WHERE article_categories ILIKE '%${category}%' OR keywords ILIKE '%${category}%';`); 
                const articles = articlesData.rows.map(d => new article(d))
                resolve(articles);
            } catch (err) {
                reject('Could not retrieve articles for that category');
            }
        });
    }
    //shows articles that meet query request
    static showQueryArticles(query) {
        return new Promise (async (resolve, reject) => {
            try {
                console.log(query)
                let searchAreas = []
                if(query.country.length > 0){
                    searchAreas.push('country')
                }
                if(query.city.length > 0){
                    searchAreas.push('city')
                }
                if(query.continent.length > 0){
                    searchAreas.push('continent')
                }
                if(query.category.length > 0){
                    searchAreas.push('category')
                }
                let articleIds = []
                let articlesSearchResults = []
                
                let searchQuery = ''
                
                for(let i = 0; i < searchAreas.length; i++){
                    searchQuery += ` ${searchAreas[i]} ILIKE '%${query[searchAreas[i]]}%'`
                    if(searchAreas.length > 1 && i < searchAreas.length -1){
                        searchQuery += ' AND'
                    }
                }

                let articlesData = await db.query(`SELECT * FROM articles WHERE${searchQuery.replace("category", "article_categories")}`); 

                for(let i = 0; i < articlesData.rows.length; i++){
                    if(!articleIds.includes(articlesData.rows[i].id)){
                        articlesSearchResults.push(articlesData.rows[i])
                        articleIds.push(articlesData.rows[i].id) 
                    }
                }

                resolve(articlesSearchResults);
            } catch (err) {
                reject('Could not retrieve articles for that search term');
            }
        });
    }
    //shows articles that include the search term
    static searchArticles(searchTerm) {
        return new Promise (async (resolve, reject) => {
            try {
                let articlesSearchResults = []
                    let splitSearchQuery = searchTerm.replace(/"/g, "").split(' ')
                    let searchArrayWithoutStopWords = removeStopwords(splitSearchQuery)
                    const generateSQLQuery = (searchArray) => {
                        let sqlQueryArray = []
                        for(let i = 0; i < searchArray.length; i++){
                            sqlQueryArray.push(`body ILIKE '%${searchArray[i]}%'`)
                            if(i !== searchArray.length - 1){
                                sqlQueryArray.push('OR')
                            }
                        }
                        return sqlQueryArray.join(" ")
                    }
                    let sqlQuery = generateSQLQuery(searchArrayWithoutStopWords)
                    let articlesData = await db.query(`SELECT * FROM articles WHERE ${sqlQuery}`);
                    for(let i = 0; i < articlesData.rows.length; i++){
                        let numberOfWordsBodyContains = 0
                        for(let j = 0; j < searchArrayWithoutStopWords.length; j++){
                            if(articlesData.rows[i].body.toLowerCase().includes(searchArrayWithoutStopWords[j].toLowerCase())){
                                numberOfWordsBodyContains += 1
                            }
                        }
                        articlesData.rows[i].numberOfWordsBodyContains = numberOfWordsBodyContains
                        articlesSearchResults.push(articlesData.rows[i])
                    }
                articlesSearchResults.sort((a,b) => b.numberOfWordsBodyContains - a.numberOfWordsBodyContains);
                resolve(articlesSearchResults);
            } catch (err) {
                reject('Could not retrieve articles for that search term');
            }
        });
    }
    //search for articles with highest views in last 24 hours
    static showTrendingArticles() {
        return new Promise (async (resolve, reject) => {
            try {
                let articleData = await db.query(`SELECT * FROM articles ORDER BY hour_24_views DESC;`); 
                let articles = articleData.rows.map(x => new article(x));
                resolve (articles);
            } catch (err) {
                reject('Trending articles not found');
            }
        });
    }
    //not done - add in code that finds similar posts to a users views, but if no views show random posts in top 100 viewed today
    // static showSuggestedArticles(id) {
    //     return new Promise (async (resolve, reject) => {
    //         try {
    //             let articleData = await db.query(`SELECT * FROM articles WHERE id = $1;`, [ id ]); 
    //             let articles = new article(articleData.rows[0]);
    //             resolve (articles);
    //         } catch (err) {
    //             reject('article not found');
    //         }
    //     });
    // }
    //finds post with specific id
    static findById(id) {
        return new Promise (async (resolve, reject) => {
            try {
                let articleData = await db.query(`SELECT * FROM articles WHERE id = $1;`, [ parseInt(id) ]); 
                let foundArticle = new article(articleData.rows[0]);
                await db.query(`UPDATE articles SET hour_24_views = ${foundArticle.hour_24_views + 1}, all_time_views = ${foundArticle.all_time_views + 1} WHERE id = ${id};`)
                console.log(foundArticle)
                resolve (foundArticle);
            } catch (err) {
                reject('Article not found');
            }
        });
    }
}

module.exports = article;