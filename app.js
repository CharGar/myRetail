var express = require('express');
var mongoose = require('mongoose');
var path = require('path');
var bodyParser = require('body-parser');
var Products = require('./db');
var request = require("request");
var app = express();

var port = process.env.PORT||5441;

mongoose.connect('mongodb://localhost:27017/myretail');//connecting to mongoDB 

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
        console.log(products);
        if(err){
            console.log(err);
        }
        if(!products.length){
            //if it comes back as zero
            console.log('Item not listed');
            products.current_price = [];
        }
        else {
            products.current_price = products[0].current_price;
        }
        request("http://redsky.target.com/v2/pdp/tcin/" + productId + "?excludes=taxonomy,price,promotion,bulk_ship,rating_and_review_reviews,rating_and_review_statistics,question_answer_statistics", function(error, response, body) {
            var bodyObj = response.toJSON();
            var productObj = JSON.parse(bodyObj.body).product.item.product_description;
            //setting productObj  = parsed response 

            var sendObj = {
                id: productId,
                name: '',
                current_price: products.current_price
            };
            
            if(productObj == undefined){
                sendObj.name = []; //sends empty JSON showing no product 
            }
            else{
                sendObj.name = productObj.title;
            }
            res.send(sendObj);                 
        });
 
    });

});
app.put('/products/:id', function( req,res ){
    console.log( 'from PUT body', req.body );
    Products.update( {id:req.body.id}, { $set:{current_price: req.body.current_price}}, function (err){
        if( err ) {
            console.log( 'error updating:', err );
            res.sendStatus( 500 );
        }
        else{
            console.log( 'completed' );
            res.sendStatus( 200 );  
        }
    });
});

app.get('/*', function(req, res) {
    res.sendFile(path.join(__dirname, 'public/index.html'));
});