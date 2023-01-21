const Article = require('../models/Article')
                    
//show specific article
async function showSpecificArticle(req, res) {
    try {
        const article = await Article.findById(req.params.id)
        res.status(200).json(article)   
    } catch (err) {
        res.status(400).send({err})
    }
}

// all articles show route
async function showAllArticles(req, res) {
    try {
        const article = await Article.getAllArticles()
        res.status(200).json(article)
    } catch (err) {
        res.status(400).send({err})
    }
}
//create new article
async function createNewArticle(req, res) {
    try {
        const article = await Article.createNewArticle(req.body)
        res.status(201).json(article)
    } catch (err) {
        res.status(400).send({err})
    }
}

//show city articles
async function showCityArticles(req, res) {
    try {
        const article = await Article.showCityArticles(req.params.city)
        res.status(200).json(article)
    } catch (err) {
        res.status(400).send({err})
    }
}

// show country articles
async function showCountryArticles(req, res) {
    try {
        const article = await Article.showCountryArticles(req.params.country)
        res.status(200).json(article)
    } catch (err) {
        res.status(400).send({err})
    }
}

// show continent articles
async function showContinentArticles(req, res) {
    try {
        const article = await Article.showContinentArticles(req.params.continent)
        res.status(200).json(article)
    } catch (err) {
        res.status(400).send({err})
    }
}
//show articles for a category
async function showCategoryArticles(req, res) {
    try {
        const article = await Article.showCategoryArticles(req.params.category)
        res.status(200).json(article)
    } catch (err) {
        res.status(400).send({err})
    }
}

//article search results
async function searchArticles(req, res) {
    try {
        const article = await Article.searchArticles(req.params.searchterm)
        res.status(200).json(article)
    } catch (err) {
        res.status(400).send({err})
    }
}
//show trending articles
async function showTrendingArticles(req, res) {
    try {
        const article = await article.showTrendingArticles()
        res.status(200).json(article)
    } catch (err) {
        res.status(400).send({err})
    }
}
//show suggested articles for a user
// async function showSuggestedArticles(req, res) {
//     try {
//         const article = await article.showSuggestedArticles(req.params.id)
//         res.status(200).json(article)
//     } catch (err) {
//         res.status(400).send({err})
//     }
// }

module.exports = {showSpecificArticle,showAllArticles,createNewArticle,showCityArticles,showCountryArticles,showContinentArticles,showCategoryArticles,searchArticles,
    showTrendingArticles
    // showSuggestedArticles
};