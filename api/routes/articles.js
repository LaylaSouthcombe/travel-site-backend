const express = require('express');
const router = express.Router();

const articlesController = require('../controllers/articles')

router.get('/:id', articlesController.showSpecificArticle);
router.get('/', articlesController.showAllArticles);
router.post('/', articlesController.createNewArticle);

router.get('/city/:city', articlesController.showCityArticles);
router.get('/country/:country', articlesController.showCountryArticles);
router.get('/continent/:continent', articlesController.showContinentArticles);
router.get('/category/:category', articlesController.showCategoryArticles);
router.get('/search/:searchterm', articlesController.searchArticles);
router.get('/trending', articlesController.showTrendingArticles);
// router.get('/suggested', articlesController.showSuggestedArticles);

module.exports = router;
