const express = require('express')
const Manager = require('./productManager');

const app = express();
const PORT = 8080;

const server = app.listen(PORT, () =>  {
    console.log('Server listening in port ', PORT)
})

app.use(express.json())
app.use(express.urlencoded({extended: true}));


const ProductManager = new Manager();


// ********PRODUCTS*********

app.get('/api/products', (req, res) => {
    // Check if there's a query
    if(req.query && req.query.limit) {
        let numberProducts = req.query.limit;

        ProductManager.getProducts().then(result => {
            if(result.status === 'success') {
                let products = result.message;
                products = JSON.parse(products)
                products = products.slice(0,numberProducts)
                res.send(products)
            } else {
                res.status(500).send('No products available')
            }
        })
    } else {
        // If no query, then return all objects
        ProductManager.getProducts().then(result => {
            if(result.status === 'success') {
                let products = result.message;
                res.send(products)
            } else {
                res.status(500).send('No products available')
            }
        })
    }
})

app.get('/api/products/:pid', (req, res) => {
    let id = req.params.pid;
    id = parseInt(id);
    ProductManager.getProductById(id).then(result => {
        res.send(result);
    })
})

app.post('/api/products', (req, res) => {
    let body = req.body;
    if(body) {
        ProductManager.addProduct(body).then(result => {
            res.send(result)
        })
    } else {
        res.send('No product specified')
    }
})

const fields = {price: 180, stock: 22}

app.put('/api/products/:pid', (req,res) => {
    let id = req.params.pid;
    if(id) {
        ProductManager.updateProduct(id, 
        JSON.stringify(fields, null, 2))
            .then(result => {
                res.send(result.message)
            })
    } else {
        res.send('Product not found')
    }
})

app.delete('/api/products/:pid', (req, res) => {
    let id = req.params.pid;
    if(id) {
        ProductManager.deleteProduct(id).then(result => {
            res.send(result.message)
        })
    } else {
        res.send('Product not found')
    }
})



// ********CARTS*********
