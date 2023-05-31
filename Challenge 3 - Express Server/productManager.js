const fs = require('fs');
const makeId = require('./utils')

class ProductManager {
    constructor() {
        this.path = './files/products.txt'
    }

    async readProducts() {
        try {
            const products = await fs.promises.readFile(this.path, 'utf-8');
            if(products === '') {
                return {status: 'success', message: '[]'}
            } else {
                const productsObj = JSON.parse(products);
                if(productsObj.length === 0) {
                    return {status: 'success', message: JSON.stringify([productsObj], null, 2)}
                }
                return {status: 'success', message: JSON.stringify(productsObj, null, 2)}
            }
        } catch (error) {
            return {status: 'error', message: null}
        }
    }

    async simpleWrite(product) {
        try {
            await fs.promises.writeFile(this.path, product)
            return {status: 'Success', message: 'this is simple write'}
        } catch (err) {
            return {status: 'Error', message: 'An error occurred ' + err}
        }
    }

    async writeProduct(product) {
        let productsObj = (await this.readProducts()).message;
        if(productsObj === null) {
            await this.simpleWrite(JSON.stringify([product], null, 2))
        } 
        else {
            productsObj = JSON.parse(productsObj);
            if(productsObj.length === 0) {
                await this.simpleWrite(JSON.stringify(product, null, 2))
             } else {
                 productsObj.push(product)
                 await this.simpleWrite(JSON.stringify(productsObj, null, 2))
             }
        }
    }

    async getProducts() {
        try {
            let productsObj = (await this.readProducts()).message
            return {status: 'success', message: productsObj}
        } catch(err) {
            try {
                await fs.promises.writeFile(this.path, '[]')
                let productsObj = (await this.readProducts()).message
                return {status: 'success', message: JSON.stringify(productsObj, null, 2)}
            } catch(err) {
                return {status: 'error', message: 'An error was found ' + err}
            }
        }
    }

    async addProduct(title, description, price, thumbnail, code, stock) {
        try {
            const product = {
                id: makeId(7),
                title: title,
                description: description,
                price: price,
                thumbnail: thumbnail,
                code: code,
                stock: stock
            }

            await this.writeProduct(product)
            return {status: 'success', message: 'The product has been added successfullly'}
            
        } catch(error) {
                return {status: 'error', message: 'An error was found ' + error}
        }
    }

    async getProductById(productId) {
        try {
            const products = (await this.readProducts()).message;
            const productsObj = JSON.parse(products);
            if(!productsObj.some(el => el.id === productId)){
                return {status: 'error', message: 'Error: Product not found'}
            } 
            let prodObj = productsObj.find(el => el.id === productId);
            return JSON.stringify(prodObj, null, 2)
        } catch(err) {
            return {status: 'Error', message: 'Product not found '+ err}
        }
    }

    async updateProduct(productId, productField) {
        try {
            const products = (await this.readProducts()).message;
            const productsObj = JSON.parse(products);
            if(!productsObj.some(el => el.id === productId)){
                return {status: 'error', message: 'Error: Product not found'}
            } 

            let prodIndex = productsObj.findIndex((obj => obj.id === productId));
            let prodObj = productsObj[prodIndex];
            let prodFieldObj = JSON.parse(productField)


            for (const property in prodObj) {
                if(prodFieldObj.hasOwnProperty(property) && property !== 'id') {
                    prodObj[property] = prodFieldObj[property]
                }
            }

            productsObj[prodIndex] = prodObj

            await this.simpleWrite(JSON.stringify(productsObj, null, 2))
            return {status: 'success', message: 'The product has been updated successfully.'}
                    
        } catch(err) {
            return {status: 'Error', message: 'File not found '+ err}
        }
    }

    async deleteProduct(productId) {
        try {
            const products = (await this.readProducts()).message;
            const productsObj = JSON.parse(products);
            if(!productsObj.some(el => el.id === productId)){
                return {status: 'error', message: 'Error: Product not found'}
            } 

            let prodIndex = productsObj.findIndex((obj => obj.id === productId));
            productsObj.splice(prodIndex,1)

            if(JSON.stringify(productsObj) === '[]') {
                await this.simpleWrite('')   
                return {status: 'Success', message: 'Product was deleted successfully'} 
            }

            await this.simpleWrite(JSON.stringify(productsObj, null, 2))   
            return {status: 'Success', message: 'Product was deleted successfully'} 

        } catch(err) {
            return {status: 'Error', message: 'File not found '+ err}
        }
    }
}

module.exports = ProductManager