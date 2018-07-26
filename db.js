var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var productSchema = new Schema({
    id: Number,
    name: String,
    current_price: {
        value: Number, 
        currency_code: String
    }
});

var Products = mongoose.model('products', productSchema);

module.exports = Products;