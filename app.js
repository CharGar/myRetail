var express = require('express');
var mongoose = require('mongoose');
var path = require('path');
var bodyParser = require('body-parser');
var Products = require('./db');
//requires db.js schema

var request = require("request");
var app = express();

var port = process.env.PORT||5441;
//setting port to 5441 

mongoose.connect('mongodb://localhost:27017/myretail');
//connecting to mongoDB myRetail

app.use( bodyParser.urlencoded({extended:true}));
app.use( express.static( 'public' ) );
app.use( bodyParser.json() );

app.listen(port, function() {
    console.log('API on Port ' + port);
});



app.get('/products/:id', function(req, res) {
    var productId = req.params.id;
    // console.log('product ID entered: ' + productId);
    Products.find({id:productId}, function(err, products){
        //query the database
        if(err){
            console.log(err);
        }
        if(!products.length){
            //if it comes back as zero
            console.log('Item not listed');
            products.current_price = [];
            //set products.current_price to empty brackets
        }
        else {
            products.current_price = products[0].current_price;
            //otherwise set current_price equal to first index 
        }
        request("http://redsky.target.com/v2/pdp/tcin/" + productId + "?excludes=taxonomy,price,promotion,bulk_ship,rating_and_review_reviews,rating_and_review_statistics,question_answer_statistics", function(error, response, body) {
            var bodyObj = response.toJSON();
            //setting bodyObj equal to response in JSON format
            var productObj = JSON.parse(bodyObj.body).product.item.product_description;
            //setting productObj equal parsed response 

            //targeting product_description which is also the "name" of the product

            var sendObj = {
                id: productId,
                name: '',
                current_price: products.current_price
            };
            
            if(productObj == undefined){
                sendObj.name = []; 
                //if productObj comes back undefined, send back empty
            }
            else{
                sendObj.name = productObj.title;
                //sends product name or title of product
            }
            res.send(sendObj);                 
        });
 
    });

});
app.put('/products/:id', function( req,res ){
    Products.update( {id:req.body.id}, { $set:{current_price: req.body.current_price}}, function (err){
        //update DB targeting current_price
        if( err ) {
            console.log( 'error updating:', err );
            res.sendStatus( 500 );
            //if there's an error send server error 
        }
        else{
            console.log( 'New Price Set: ', req.body);
            res.sendStatus( 200 );  
            //otherwise send "OK"
        }
    });
});

app.get('/*', function(req, res) {
    res.sendFile(path.join(__dirname, 'public/index.html'));
});