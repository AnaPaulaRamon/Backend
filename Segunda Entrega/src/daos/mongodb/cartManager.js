import mongoose from "mongoose"
import { cartModel } from './models/carts.model.js'
import ProductManager from "./productManager.js";

const productManager = new ProductManager();

class CartManager {
    connection = mongoose.connect('mongodb+srv://apramong7:test1@cluster0.vzmho1l.mongodb.net/?retryWrites=true&w=majority')


    async getCarts(){
        try {
            const result = await cartModel.find({})
            return result
        } catch (error) {
            return {status: 'error', message: error}
        }
    }

    async getCartById(cartId) {
        try {
            const result = await cartModel.findOne({_id: cartId}).populate('products.product')
            return result
        } catch (error) {
            return {status: 'error', message: err}
        }
    }


    async addCart() {
        try {
            const result = await cartModel.create({products: []});
            return {status: 'success', message: 'Cart has been created successfully', result}
        } catch (error) {
            return {status: 'error', message: err}
        }
    }

    async addProductToCart(cid, pid) {
        try {
            const product = await productManager.getProductById(pid);
            const cart = await this.getCartById(cid);
            let quantity = 1;

            const prodExists = cart.products.find(el => el.product._id.toString() === pid);

            if(prodExists != undefined) {
                cart.products = cart.products.map(el => {
                    if(el.product._id.toString() === pid) {
                        el.quantity = el.quantity + 1;
                    }
                    return el
                })
                await cart.save();
                return {status: 'success', message: 'Product has been added to the cart successfully'}
            } 

            cart.products.push({product: product, quantity: quantity});
            await cart.save();
            return {status: 'success', message: 'Product has been added to the cart successfully'}
            
        } catch (error) {
            return {status: 'error', message: error}
        }
    }

    async addArrayOfProducts(cid, arr){
        try {
            const cleanString = arr.replace(/'/g, '"');
            const array = JSON.parse(cleanString);

            array.forEach(element => {
                this.addProductToCart(cid, element)
            });

            return {status: 'success', message: 'Cart has been updated'}
        } catch (error) {
            return {status: 'error', message: error}
        }
    }

    async updateProductQuantity(cid,pid,qty) {
        try {
            const cart = await this.getCartById(cid);
            const prodExists = cart.products.find(el => el.product._id.toString() === pid);

            if(prodExists != undefined) {
                cart.products = cart.products.map(el => {
                    if(el.product._id.toString() === pid) {
                        el.quantity = qty;
                    }
                    return el
                })
                await cart.save();
                return {status: 'success', message: 'Number of products has been updated successfully'}
            } 

            return {status: 'error', message: 'Cart does not contain product'}

        } catch (error) {
            return {status: 'error', message: error}
        }
    }


    async deleteProductFromCart(cid, pid) {
        try {
            const cart = await this.getCartById(cid);
            cart.products.pull(pid)
            await cart.save();
            return {status: 'success', message: 'Product had been deleted from the cart successfully'}
        } catch (error) {
            return {status: 'error', message: err}
        }
    }

    async deleteAllProductsFromCart(cid){
        try {
            const cart =  await this.getCartById(cid);
            cart.products = [] // this would be a full array in update
            await cart.save();
            return {status: 'success', message: 'All products have been deleted from the cart'}
        } catch (error) {
            return {status: 'error', message: err}
        }
    }
}

export default CartManager