const db = require ('../dbConfig/init')

class article {
    constructor(data){
        this.id = data.id
        this.title = data.title
        this.body = data.body
        this.views = data.views
        this.city = data.city
        this.country = data.country
        this.continent = data.continent
        this.trip_categories = data.trip_categories
    }
    //gets all the articles
    static get all() {
        return new Promise (async (resolve, reject) => {
            try {
                const articlesData = await db.query(`SELECT * FROM articles;`)
                const articles = articlesData.rows.map(d => new article(d))
                resolve(articles);
            } catch (err) {
                reject("Error retrieving articles")
            }
        })
    }
    //creates a new article
    static async createNewArticle({title, body, views, city, country, continent, trip_categories}){
        return new Promise (async (resolve, reject) => {
            try {
                let newArticle = await db.query(`INSERT INTO articles (title, body, views, city, country, continent, trip_categories) VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *;`, [ title, body, views, city, country, continent, trip_categories])
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
                let articlesData = await db.query(`SELECT * FROM articles WHERE city ILIKE $1;`, [ city ]); 
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
                let articlesData = await db.query(`SELECT * FROM articles WHERE country ILIKE $1;`, [ country ]); 
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
                let articlesData = await db.query(`SELECT * FROM articles WHERE continent ILIKE $1;`, [ continent ]); 
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
                let articlesData = await db.query(`SELECT * FROM articles WHERE trip_categories ILIKE '%${category}%';`); 
                const articles = articlesData.rows.map(d => new article(d))
                resolve(articles);
            } catch (err) {
                reject('Could not retrieve articles for that category');
            }
        });
    }
    //shows articles that include the search term
    static searchArticles(searchTerm) {
        return new Promise (async (resolve, reject) => {
            try {
                let articleIds = []
                let articlesSearchResults = []
                let searchAreas = ['title', 'city', 'country',   'continent', 'trip_categories', 'body']
                const searchDbForTerm = async (searchArea) => {
                   let articlesData = await db.query(`SELECT * FROM articles WHERE ${searchArea} ILIKE '%${searchTerm}%'`); 
                    for(let i = 0; i < articlesData.rows.length; i++){
                        if(!articleIds.includes(articlesData.rows[i].id)){
                            articlesSearchResults.push(articlesData.rows[i])
                            articleIds.push(articlesData.rows[i].id) 
                        }
                    }
                }
                for(let i = 0; i < searchAreas.length; i++){
                    await searchDbForTerm(searchAreas[i])
                }
                resolve(articlesSearchResults);
            } catch (err) {
                reject('Could not retrieve articles for that search term');
            }
        });
    }
    //not done - add in code to search for articles with highest views in last 24 hours
    // static showTrendingArticles(id) {
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
                resolve (foundArticle);
            } catch (err) {
                reject('Article not found');
            }
        });
    }
}

module.exports = article;