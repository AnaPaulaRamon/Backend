import express from 'express';
import ProductManager from '../classes/productManager.js'
import {io} from '../app.js'

const router = express.Router();
const manager = new ProductManager();


// GETS
router.get('/', (req, res) => {
    // Check if there's a query
    if(req.query && req.query.limit) {
        let numberProducts = req.query.limit;

        manager.getProducts().then(result => {
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
        manager.getProducts().then(result => {
            if(result.status === 'success') {
                let products = result.message;
                res.send(products)
            } else {
                res.status(500).send('No products available')
            }
        })
    }
})

router.get('/:pid', (req, res) => {
    let id = req.params.pid;
    function containsOnlyNumbers(str) {
        return /^[0-9]+$/.test(str);
      }

    if(containsOnlyNumbers(id)) {
        id = parseInt(id);
    }

    manager.getProductById(id).then(result => {
        res.send(result);
    })
})


// POSTS
router.post('/', (req, res) => {
    let body = req.body;
    if(body) {
        manager.addProduct(body).then(result => {
            res.send(result)
            if(result.status==="success"){
                manager.getProducts().then(result=>{
                    console.log(result);
                    io.emit('addProduct',result);
                })
            }
        })
    } else {
        res.send('Product not specified')
    }
})


// PUTS
const fields = {price: 180, stock: 22}

router.put('/:pid', (req,res) => {
    let id = req.params.pid;
    if(id) {
        manager.updateProduct(id, 
        JSON.stringify(fields, null, 2))
            .then(result => {
                res.send(result.message)
            })
    } else {
        res.send('Product not found')
    }
})


// DELETES
router.delete('/:pid', (req, res) => {
    let id = req.params.pid;
    if(id) {
        manager.deleteProduct(id).then(result => {
            res.send(result.message)
        })
    } else {
        res.send('Product not found')
    }
})

export default router;