const db = require ('../dbConfig/init')
const { removeStopwords } = require('stopword')

class article {
    constructor(data){
        this.id = data.id
        this.title = data.title
        this.body = data.body
        this.article_genre = data.article_genre
        this.city = data.city
        this.country = data.country
        this.continent = data.continent
        this.article_category = data.article_category
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
                if(articlesData.rows.length > 0){
                    let articles = articlesData.rows.map(d => new article(d))
                    resolve (articles)
                } else {
                    resolve(undefined)
                }
            } catch (err) {
                reject("Error retrieving articles")
            }
        })
    }
    //creates a new article
    static async createNewArticle({title, body, article_genre, city, country, continent, article_category, keywords, feature_img_html, feature_img_url}){
        return new Promise (async (resolve, reject) => {
            try {
                let newArticle = await db.query(`INSERT INTO articles (title, body, article_genre, city, country, continent, article_category, keywords, hour_24_views, all_time_views, feature_img_html, feature_img_url) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, 0, 0, $9, $10) RETURNING *;`, [ title, body, article_genre, city, country, continent, article_category, keywords, feature_img_html, feature_img_url])
                resolve(newArticle.rows[0])
            }catch(err){
                reject("Error creating new article")
            }
        })
    }
    //shows articles in a certain city
    static async showCityArticles(city) {
        return new Promise (async (resolve, reject) => {
            try {
                let articlesData = await db.query(`SELECT * FROM articles WHERE city ILIKE '%${city}%' ORDER BY RANDOM ();`)
                if(articlesData.rows.length > 0){
                    let articles = articlesData.rows.map(d => new article(d))
                    resolve (articles)
                } else {
                    resolve(undefined)
                }
            } catch (err) {
                reject('Could not retrieve articles for that city')
            }
        })
    }
    //shows articles in a certain country
    static async showCountryArticles(country) {
        return new Promise (async (resolve, reject) => {
            try {
                if(country.includes('-')){
                    country = country.replace(/-/g, ' ')
                }
                let articlesData = await db.query(`SELECT * FROM articles WHERE country ILIKE '%${country}%' ORDER BY RANDOM ();`)
                if(articlesData.rows.length > 0){
                    let articles = articlesData.rows.map(d => new article(d))
                    resolve (articles)
                } else {
                    resolve(undefined)
                }
            } catch (err) {
                reject('Could not retrieve articles for that country')
            }
        })
    }
    //shows articles in a certain continent
    static async showContinentArticles(continent) {
        return new Promise (async (resolve, reject) => {
            try {
                let articlesData = await db.query(`SELECT * FROM articles WHERE continent ILIKE '%${continent}%' ORDER BY RANDOM ();`)
                if(articlesData.rows.length > 0){
                    let articles = articlesData.rows.map(d => new article(d))
                    resolve (articles)
                } else {
                    resolve(undefined)
                }
            } catch (err) {
                reject('Could not retrieve articles for that continent')
            }
        })
    }
    //shows articles in a certain category
    static async showCategoryArticles(category) {
        return new Promise (async (resolve, reject) => {
            try {
                let articlesData = await db.query(`SELECT * FROM articles WHERE article_category ILIKE '%${category}%'  ORDER BY RANDOM ();`)
                if(articlesData.rows.length > 0){
                    let articles = articlesData.rows.map(d => new article(d))
                    resolve (articles)
                } else {
                    resolve(undefined)
                }
            } catch (err) {
                reject('Could not retrieve articles for that category')
            }
        })
    }
    //shows trip planning articles
    static async showTripPlanningArticles() {
        return new Promise (async (resolve, reject) => {
            try {
                let articlesData = await db.query(`SELECT * FROM articles WHERE article_category ILIKE '%planning%' ORDER BY hour_24_views DESC;`)
                if(articlesData.rows.length > 0){
                    let articles = articlesData.rows.map(d => new article(d))
                    resolve (articles)
                } else {
                    resolve(undefined)
                }
            } catch (err) {
                reject('Could not retrieve trip planning articles')
            }
        })
    }
    //shows top articles in each category
    static async showTopCategorysArticles() {
        return new Promise (async (resolve, reject) => {
            try {
                let articlesObject = {
                    "Relaxation": [],
                    "Luxury": [],
                    "Nature": [],
                    "Food": [],
                    "City Break": [],
                    "Budget Friendly": [],
                    "Art & Culture": [],
                    "Adventure": [],
                    "Trip Planning": []
                }
                const getDbArticles = async (category) => {
                    let returnedArticles = await db.query(`SELECT * FROM articles WHERE article_category ILIKE '%${category}%' ORDER BY hour_24_views DESC LIMIT 5;`)
                    articlesObject[category] = returnedArticles.rows.map(d => new article(d))
                }
                for (const category of Object.keys(articlesObject)) {
                    await getDbArticles(category)
                }
                resolve(articlesObject)
            } catch (err) {
                reject('Could not retrieve articles for that category')
            }
        })
    }
    //shows articles that meet query request
    static async showQueryArticles(query) {
        return new Promise (async (resolve, reject) => {
            try {
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

                let articlesData = await db.query(`SELECT * FROM articles WHERE${searchQuery.replace("category", "article_category")}`)

                for(let i = 0; i < articlesData.rows.length; i++){
                    if(!articleIds.includes(articlesData.rows[i].id)){
                        articlesSearchResults.push(articlesData.rows[i])
                        articleIds.push(articlesData.rows[i].id) 
                    }
                }
                resolve(articlesSearchResults)
            } catch (err) {
                reject('Could not retrieve articles for that search term')
            }
        })
    }
    //shows articles that include the search term
    static async searchArticles(searchTerm) {
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
                    let articlesData = await db.query(`SELECT * FROM articles WHERE ${sqlQuery}`)
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
                articlesSearchResults.sort((a,b) => b.numberOfWordsBodyContains - a.numberOfWordsBodyContains)
                resolve(articlesSearchResults)
            } catch (err) {
                reject('Could not retrieve articles for that search term')
            }
        })
    }
    //search for articles with highest views in last 24 hours
    static async showTrendingArticles() {
        return new Promise (async (resolve, reject) => {
            try {
                let articleData = await db.query(`SELECT * FROM articles ORDER BY hour_24_views DESC LIMIT 5;`)
                if(articleData.rows.length > 0){
                    let articles = articleData.rows.map(x => new article(x))
                    resolve (articles)
                } else {
                    resolve(undefined)
                }
            } catch (err) {
                reject('Trending articles not found')
            }
        })
    }
    //search for articles with highest views in last 24 hours
    static async showMostReadArticles() {
        return new Promise (async (resolve, reject) => {
            try {
                let articleData = await db.query(`SELECT * FROM articles ORDER BY all_time_views DESC LIMIT 5;`)
                if(articleData.rows.length > 0){
                    let articles = articleData.rows.map(x => new article(x))
                    resolve (articles)
                } else {
                    resolve(undefined)
                }
            } catch (err) {
                reject('Trending articles not found')
            }
        })
    }
    //not done - add in code that finds similar posts to a users views, but if no views show random posts in top 100 viewed today
    // static showSuggestedArticles(id) {
    //     return new Promise (async (resolve, reject) => {
    //         try {
    //             let articleData = await db.query(`SELECT * FROM articles WHERE id = $1 LIMIT 4;`, [ id ]); 
    //             let articles = new article(articleData.rows[0]);
    //             resolve (articles);
    //         } catch (err) {
    //             reject('article not found');
    //         }
    //     });
    // }

    //finds post with specific id
    static async findById(id) {
        return new Promise (async (resolve, reject) => {
            try {
                let articleData = await db.query(`SELECT * FROM articles WHERE id = $1;`, [ parseInt(id)])
                if(articleData.rows.length){
                    let foundArticle = new article(articleData.rows[0])
                    await db.query(`UPDATE articles SET hour_24_views = ${foundArticle.hour_24_views + 1}, all_time_views = ${foundArticle.all_time_views + 1} WHERE id = ${id};`)
                    resolve(foundArticle)
                } else {
                    resolve(undefined)
                }
            } catch (err) {
                reject(err)
            }
        })
    }
}

module.exports = article