# Sojo Travels Backend
Welcome to the backend of Sojo Travels, the heart of our travel website! This backend server serves as the API responsible for retrieving travel articles from a PostgreSQL database and providing data to the frontend.

## Project Overview
Sojo Travels is a full-stack web application that offers a curated collection of travel articles focusing on destinations across Europe. The backend of the project is hosted on Railway and interacts with a PostgreSQL database to deliver travel content to the frontend.

## Features
**RESTful API:** The backend provides a RESTful API to retrieve travel articles based on user requests.

**Database Integration:** It connects to a PostgreSQL database to fetch travel articles, including article titles, content, countries, and categories.

## Database
Sojo Travels backend relies on a PostgreSQL database to store and manage travel articles.

## API Endpoints
The following API endpoints are available:

GET /articles: Retrieve a list of all travel articles.

GET /articles/article/:id: Retrieve a specific travel article by its unique ID.

GET /articles/category/:category: Retrieve travel articles by category.

GET /articles/country/:country: Retrieve travel articles by country.

GET /articles/continent/:continent: Retrieve travel articles by continent.

GET /articles/search/: Search for travel articles by keyword.

GET /articles/most-read/: Retreive the most-read travel articles.


## License
This project is licensed under the MIT License.


Thank you for being a part of the Sojo Travels project and helping travelers explore Europe one article at a time! 🌍📖