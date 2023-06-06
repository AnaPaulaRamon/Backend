const fs = require('fs');
const makeId = require('./utils')

class CartManager {
    constructor() {
        this.path = './files/carts.json'
    }

    async readCarts() {
        try {
            const carts = await fs.promises.readFile(this.path, 'utf-8');
            if((carts === '') || (carts === null)) {
                return {status: 'success', message: '[]'}
            } else {
                const cartsObj = JSON.parse(carts);
                if(cartsObj.length === 0) {
                    return {status: 'success', message: JSON.stringify([cartsObj], null, 2)}
                }
                return {status: 'success', message: JSON.stringify(cartsObj, null, 2)}
            }
        } catch (error) {
            return {status: 'error', message: '[]'}
        }
    }

    async simpleWrite(cart) {
        try {
            await fs.promises.writeFile(this.path, cart)
            return {status: 'Success', message: 'A new cart has been added'}
        } catch (err) {
            return {status: 'Error', message: 'An error occurred ' + err}
        }
    }

    async writeCart(cart) {
        let cartsObj = (await this.readCarts()).message;
        if(cartsObj === null) {
            await this.simpleWrite(JSON.stringify([cart], null, 2))
        } 
        else {
            cartsObj = JSON.parse(cartsObj);
            
            if(cartsObj.length === 0) {
                await this.simpleWrite(JSON.stringify([cart], null, 2))
             } else {
                 cartsObj.push(cart)
                 await this.simpleWrite(JSON.stringify(cartsObj, null, 2))
             }
        }
    }

    async getCarts() {
        try {
            let cartsObj = (await this.readCarts()).message
            return {status: 'success', message: cartsObj}
        } catch(err) {
            try {
                await fs.promises.writeFile(this.path, '[]')
                let cartsObj = (await this.readCarts()).message
                return {status: 'success', message: JSON.stringify(cartsObj, null, 2)}
            } catch(err) {
                return {status: 'error', message: 'An error was found ' + err}
            }
        }
    }

    async addCart(cart) {
        if(cart) {
            try {
                const cartObj = {
                    id: makeId(7),
                    products: cart.products 
                    ?  cart.products.map(element => {return {product: element, quantity: 0}})
                    : []
                }
    
                await this.writeCart(cartObj)
                return {status: 'success', message: 'The cart has been added successfullly'}
                
            } catch(error) {
                    return {status: 'error', message: 'An error was found ' + error}
            }
        } else {
            return {status: 'error', message: 'Not enough attributes'}
        }
    }

    async addProductToCart(cid, pid) {
        try {
            let cartsObj = (await this.readCarts()).message
            cartsObj = JSON.parse(cartsObj);
            if(!cartsObj.some(el => el.id === cid)){
                return {status: 'error', message: 'Error: Cart not found'}
            } 
            let cartIndex = cartsObj.findIndex((obj => obj.id === cid));

            if(!cartsObj[cartIndex].products.some(el => el.product === pid)){
                cartsObj[cartIndex].products.push({product: pid, quantity: 1})
                await this.simpleWrite(JSON.stringify(cartsObj, null, 2))
                return {status: 'success', message: 'Product added to the cart successfully'}
            } 

            let prodIndex = cartsObj[cartIndex].products.findIndex((obj => obj.product === pid));
            cartsObj[cartIndex].products[prodIndex].quantity = cartsObj[cartIndex].products[prodIndex].quantity + 1;
            await this.simpleWrite(JSON.stringify(cartsObj, null, 2))
            return {status: 'success', message: 'Product added to the cart successfully'}
        } catch (error) {
            return {status: 'Error', message: 'An error has occurred '+ error}
        }
    }

    async getCartById(cartId) {
        try {
            const carts = (await this.readCarts()).message;
            const cartsObj = JSON.parse(carts);

            if(!cartsObj.some(el => el.id === cartId)){
                return {status: 'error', message: 'Error: Cart not found'}
            } 

            let prodObj = cartsObj.find(el => el.id === cartId);
            return JSON.stringify(prodObj, null, 2)
        } catch(err) {
            return {status: 'Error', message: 'Cart not found '+ err}
        }
    }
}

module.exports = CartManager