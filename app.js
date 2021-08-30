const express = require('express')
const url ='mongodb://localhost:27017'
const app = express()
const {ObjectId,MongoClient}= require('mongodb')
app.use(express.urlencoded({extended:true}))
app.set('view engine', 'hbs')

app.post('/update',async (req,res)=>{
    const id = req.body.id;
    const nameInput = req.body.txtName;
    const priceInput = req.body.txtPrice;
    const pictureInput= req.body.txtPicture;
    const client = await MongoClient.connect(url);
    const dbo= client.db("ATN");
    const updateProduct= await dbo.collection("products").updateOne({_id:ObjectId(id)},{$set:{name:nameInput,price:priceInput,picture:pictureInput}})
    res.redirect('/');
})
app.get('/edit',async (req,res)=>{
    const idInput = req.query.id;
    const client = await MongoClient.connect(url);
    const dbo= client.db("ATN");
    const search_Product = await dbo.collection("products").findOne({_id:ObjectId(idInput)});    
    res.render('edit',{product: search_Product});
})
app.post('/search',async (req,res)=>{
    const searchInput = req.body.txtSearch;
    const client = await MongoClient.connect(url);
    const dbo= client.db("ATN");
    const allProducts = await dbo.collection("products").find({ name: searchInput }).toArray();
    res.render('index',{data:allProducts})
})
app.post('/insert',async (req,res)=>{
    const nameInput = req.body.txtName;
    const priceInput = req.body.txtPrice;
    const pictureInput = req.body.txtPicture;
    const newProduct = {name:nameInput,price: priceInput, picture:pictureInput};
    const client = await MongoClient.connect(url);
    const dbo= client.db("ATN");
    const newP= await dbo.collection("products").insertOne(newProduct)
    //chuyen huong den file Index
    res.redirect('/');
})

app.get('/delete',async (req,res)=>{
    const idInput = req.query.id;
    const client = await MongoClient.connect(url);
    const dbo= client.db("ATN");
    await dbo.collection("products").deleteOne({_id:ObjectId(idInput)})
    res.redirect('/');
})
app.get('/', async (req,res)=>{
    const client = await MongoClient.connect(url);
    const dbo= client.db("ATN");
    const allProducts= await dbo.collection("products").find({}).toArray()

    res.render('index',{data:allProducts})


}) 

const PORT = process.env.PORT || 5000
app.listen(PORT)