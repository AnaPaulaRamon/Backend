const express = require('express')
const Manager = require('./productManager');

const app = express();
const PORT = 8080;

const server = app.listen(PORT, () =>  {
    console.log('Server listening in port ', PORT)
})

const ProductManager = new Manager();

app.get('/products', (req, res) => {
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

app.get('/products/:pid', (req, res) => {
    let id = req.params.pid;
    id = parseInt(id);
    ProductManager.getProductById(id).then(result => {
        res.send(result);
    })
})

