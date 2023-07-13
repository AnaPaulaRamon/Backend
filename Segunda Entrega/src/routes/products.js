import express from 'express';
import ProductManager from '../daos/mongodb/productManager.js';
import {io} from '../app.js'

const router = express.Router();
const manager = new ProductManager();


// GETS
router.get('/', async (req, res) => {
    let reqQuery = req.query;
    if(reqQuery) {
        let limit = reqQuery.limit ? Number(reqQuery.limit) : 10;
        let page = reqQuery.page ? Number(reqQuery.page) : 1;
        let sort = reqQuery.sort ? Number(reqQuery.sort) : 1;
        let filter = reqQuery.filter ? reqQuery.filter : null;
        let filterValue = reqQuery.filterValue ? reqQuery.filterValue : null;
    
        let products = await manager.getProducts(limit, page, sort, filter, filterValue);
        res.send(products)
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
            manager.getProducts().then(result=>{
                io.emit('addProduct',result);
            })
            res.send(result)
        })
    } else {
        res.send('Product not specified')
    }
})


// PUTS
router.put('/:pid', (req,res) => {
    let id = req.params.pid;
    let body = req.body;
    if(id && body) {
        manager.updateProduct(id, body).then(result => {
            res.send(result);
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
            res.send(result)
        })
    } else {
        res.send('Product not found')
    }
})

export default router;