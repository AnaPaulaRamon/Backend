import express from 'express';
import CartManager from '../classes/cartManager.js'

const router = express.Router();
const manager = new CartManager();


// GETS
router.get('/', (req, res) => {
    // Check if there's a query
    if(req.query && req.query.limit) {
        let numberCarts = req.query.limit;

        manager.getCarts().then(result => {
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
        manager.getCarts().then(result => {
            if(result.status === 'success') {
                let carts = result.message;
                res.send(carts)
            } else {
                res.status(500).send('No carts available')
            }
        })
    }
})


router.get('/:cid', (req, res) => {
    let id = req.params.cid;

    manager.getCartById(id).then(result => {
        res.send(result);
    })
})


// POST
router.post('/', (req, res) => {
    let body = req.body;
    if(body) {
        manager.addCart(body).then(result => {
            res.send(result)
        })
    } else {
        res.send('Cart not specified')
    }
})

router.post('/:cid/product/:pid', (req, res) => {
    let cartId = req.params.cid;
    let prodId = req.params.pid;

    if(cartId && prodId) {
        manager.addProductToCart(cartId, prodId).then(result => {
            res.send(result)
        })
    } else {
        res.send('Cart or product not specified')
    }
})

export default router;