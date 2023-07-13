import { Router } from "express";
import ProductManager from "../daos/mongodb/productManager.js";
import CartManager from "../daos/mongodb/cartManager.js";


const prodContainer = new ProductManager();
const cartContainer = new CartManager();
const router = Router();

router.get('/', async (req, res) => {
    prodContainer.getProducts().then(result=>{
        let info = result.payload;
        let preparedObject ={
            products : info
        }
        res.render('home',preparedObject)
    })
})

router.get('/realtimeproducts', (req, res) => {
    res.render('realTimeProducts')
})

// router.get('/products', async (req, res) => {
//     prodContainer.getProducts().then(result=>{
//         // console.log('this is result ', result)

//     const { totalDocs, limit, totalPages, page, pageCounter, hasPrevPage,
//             prevPage, nextPage, nextLink, hasNextPage } = result


//         let products = result.payload;
//         // let preparedObject ={
//         //     products : info
//         // }
//         res.render('products', {
//             products,
//             hasNextPage,
//             hasPrevPage,
//             nextPage,
//             prevPage,
//             totalPages,
//             limit,
//             nextLink,
//             currentPage: page,
//           });
//     })
// })

router.get("/products", async (req, res) => {
    let limit = Number(req.query.limit);
    let page = Number(req.query.page);
    let sort = Number(req.query.sort);
    if (isNaN(limit)) {
        limit = 10;
    }
    if (isNaN(page)) {
        page = 1;
    }
    if (isNaN(sort)) {
        sort = 0;
    }
    let filter = req.query.filter;
    let filterVal = req.query.filterVal;
    // console.log(limit, page, sort)
    let products = await prodContainer.getProducts(limit, page, sort, filter, filterVal);
    products.prevLink = products.hasPrevPage?`http://localhost:8080/products?page=${products.prevPage}`:'';
    products.nextLink = products.hasNextPage?`http://localhost:8080/products?page=${products.nextPage}`:'';
    products.isValid= !(page<=0||page>products.totalPages)
    if (page<=0 || page>products.totalPages){
        res.status(404).send({ status: "error", message: "Page not found" });
    }

    let preparedObject ={
        products : products
    }

    res.render('products', preparedObject)
});

router.get('/carts/:cid', async (req, res) => {
    const cartId = req.params.cid;
    cartContainer.getCartById(cartId).then(result => {
        let products = result.products;
        let preparedObject ={
            products : products
        }

        res.render('cart',preparedObject)
    })
})

export default router;