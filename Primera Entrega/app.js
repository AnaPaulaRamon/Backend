const express = require('express')
const Manager = require('./productManager');
const cManager = require('./cartManager');

const app = express();
const PORT = 8080;

const server = app.listen(PORT, () =>  {
    console.log('Server listening in port ', PORT)
})

app.use(express.json())
app.use(express.urlencoded({extended: true}));


const ProductManager = new Manager();
const CartManager = new cManager();


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
    function containsOnlyNumbers(str) {
        return /^[0-9]+$/.test(str);
      }

    if(containsOnlyNumbers(id)) {
        id = parseInt(id);
    }

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
        res.send('Cart not specified')
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

app.get('/api/carts', (req, res) => {
    // Check if there's a query
    if(req.query && req.query.limit) {
        let numberCarts = req.query.limit;

        CartManager.getCarts().then(result => {
            if(result.status === 'success') {
                let carts = result.message;
                carts = JSON.parse(carts)
                carts = carts.slice(0,numberCarts)
                res.send(carts)
            } else {
                res.status(500).send('No carts available')
            }
        })
    } else {
        // If no query, then return all objects
        CartManager.getCarts().then(result => {
            if(result.status === 'success') {
                let carts = result.message;
                res.send(carts)
            } else {
                res.status(500).send('No carts available')
            }
        })
    }
})


app.get('/api/carts/:cid', (req, res) => {
    let id = req.params.cid;

    CartManager.getCartById(id).then(result => {
        res.send(result);
    })
})

app.post('/api/carts', (req, res) => {
    let body = req.body;
    if(body) {
        CartManager.addCart(body).then(result => {
            res.send(result)
        })
    } else {
        res.send('Cart not specified')
    }
})

app.post('/api/carts/:cid/product/:pid', (req, res) => {
    let cartId = req.params.cid;
    let prodId = req.params.pid;

    if(cartId && prodId) {
        CartManager.addProductToCart(cartId, prodId).then(result => {
            res.send(result)
        })
    } else {
        res.send('Cart or product not specified')
    }
})