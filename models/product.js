var Product = new mongoose.Schema({
    price_max : Number, 
    page_description : String, 
    page_title : String, 
    name : String, 
    price : Number, 
    id : String, 
    currency : String, 
    primary_category_id : String, 
    orderable : Boolean, 
    long_description : String
   });