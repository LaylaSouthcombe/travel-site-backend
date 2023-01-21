DROP TABLE IF EXISTS articles;

CREATE TABLE articles (
    id serial PRIMARY KEY,
    title varchar NOT NULL,
    body varchar NOT NULL,
    city varchar NOT NULL,
    country varchar NOT NULL,
    continent varchar NOT NULL,
    trip_categories varchar NOT NULL,
    keywords varchar NOT NULL,
    hour_24_views int NOT NULL,
    all_time_views int NOT NULL
);