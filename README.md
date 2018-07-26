
# myRetail RESTful service (case-study)


* A RESTful service that can preform the following actions: 

1. Respond to an HTTP GET request at /products/{id} and delivers product data as JSON (where {id} will be a number. 

2. Reads pricing information from a NoSQL data store and combines it with the product id and name from the HTTP request into a single response. 

3. Performs an HTTP GET to retrieve the product name from an external API. (redsky.target.com,)

- Example product IDs: 15117729, 16483589, 16696652, 16752456, 15643793) 

- Example response: {"id":13860428,"name":"The Big Lebowski (Blu-ray) (Widescreen)","current_price":{"value": 13.49,"currency_code":"USD"}}

- Example: http://redsky.target.com/v2/pdp/tcin/13860428?excludes=taxonomy,price,promotion,bulk_ship,rating_and_review_reviews,rating_and_review_statistics,question_answer_statistics

## BONUS:Accepts an HTTP PUT request at the same path (/products/{id}), containing a JSON request body similar to the GET response, and updates the product’s price in the data store. 

----------------------------------------------------------------------------------------------------------

### Instructions for installation

- ```npm install```

## Run application
In terminal type
- ```nodemon app.js ``` 

If nodemon isn't installed type

- ```node app.js```


### Dependencies
- ```body-parser```
- ```express```
- ```mongoose```
- ```request```

----------------------


![imgae disc](pic.png?raw=true "Title")

A mongo db will be provided similar to the one above in order to test and demonstrate completeness.  