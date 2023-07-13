import express from 'express';
import CartManager from '../daos/mongodb/cartManager.js';
import {io} from '../app.js'

const router = express.Router();
const manager = new CartManager();


// GETS
router.get('/', async (req, res) => {
    let carts = await manager.getCarts()

    if(!carts) {
        res.send('Not carts available');
        return
    }

    res.send(carts)
})


router.get('/:cid', (req, res) => {
    let id = req.params.cid;

    manager.getCartById(id).then(result => {
        res.send(result);
    })
})


// POSTS
router.post('/', (req, res) => {
    manager.addCart().then(result => {
        // io.emit('createCart',result);
        res.send(result)
    })

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

// PUTS
router.put('/:cid', (req,res) => {
    let cartId = req.params.cid;
    let body = req.body;

    // console.log('this is body', body)

    if(cartId && body) {
        manager.addArrayOfProducts(cartId, body).then(result => {
            res.send(result)
        })
    } else {
        res.send('Cart or products not found')
    }
})

router.put('/:cid/products/:pid', (req,res) => {
    let cartId = req.params.cid;
    let prodId = req.params.pid;
    let body = req.body;

    console.log('this is body', body)

    if(cartId && body && body) {
        manager.updateProductQuantity(cartId, prodId, body).then(result => {
            res.send(result)
        })
    } else {
        res.send('Parameters not found')
    }
})

// DELETES
router.delete('/:cid/products/:pid', (req, res) => {
    let cartId = req.params.cid;
    let prodId = req.params.pid;

    if(cartId && prodId) {
        manager.deleteProductFromCart(cartId, prodId).then(result => {
            res.send(result)
        })
    } else {
        res.send('Cart or product not found')
    }
})

router.delete('/:cid', (req, res) => {
    let cartId = req.params.cid;

    if(cartId) {
        manager.deleteAllProductsFromCart(cartId).then(result => {
            res.send(result)
        })
    } else {
        res.send('Cart not found')
    }
})

export default router;