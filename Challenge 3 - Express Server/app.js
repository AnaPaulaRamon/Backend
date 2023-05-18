// const ProductManager = require('./productManager');
// const express = require('express')

// const app = express();
// const PORT = 8080;

// const server = app.listen(PORT, () =>  {
//     console.log('Server listening in port ', PORT)
// })





// app.get('/products', (req, res) => {

// })




// const ProductManagerTest1 = new ProductManager();



const ProductManager = require('./productManager');

const ProductManagerTest1 = new ProductManager();

// ProductManagerTest1.getProducts()
//     .then(result => {
//         console.log(result.message)
//     })

ProductManagerTest1.addProduct(
    'grapefruits',
    'big grapefruits',
    750,
    'No image',
    'abc10',
    17
).then(result => {
    console.log(result.message)
})

// ProductManagerTest1.getProductById('moMdMPo')
//     .then(result => {
//         console.log(result.message)
//     })

// const fields = {thumbnail: "No image", code: "123456"}

// ProductManagerTest1.updateProduct('moMdMPo', 
// JSON.stringify(fields, null, 2))
//     .then(result => {
//         console.log(result.message)
//     })

// ProductManagerTest1.deleteProduct('HzkHhN8')
//     .then(result => {
//         console.log(result.message)
//     })