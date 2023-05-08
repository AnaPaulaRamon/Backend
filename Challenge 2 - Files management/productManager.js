const fs = require('fs');
const makeId = require('./utils')

class ProductManager {
    constructor() {
        this.path = './files/products.txt'
    }

    async getProducts() {
        try {
            const products = await fs.promises.readFile(this.path, 'utf-8');
            const productsObj = JSON.parse(products);
            if(productsObj.length === 0) {
                return {status: 'success', message: JSON.stringify([productsObj], null, 2)}
            }
            return {status: 'success', message: JSON.stringify(productsObj, null, 2)}
        } catch(err) {
            try {
                await fs.promises.writeFile(this.path, '[]')
                const products = await fs.promises.readFile(this.path, 'utf-8');
                const productsObj = JSON.parse(products);
                if(productsObj.length === 0) {
                    return {status: 'success', message: JSON.stringify(productsObj, null, 2)}
                }
            } catch(err) {
                return {status: 'error', message: 'An error was found ' + err}
            }
        }
    }

    async addProduct(title, description, price, thumbnail, code, stock) {
        try {
            const products = await fs.promises.readFile(this.path, 'utf-8');
            const productsObj = JSON.parse(products);

            const product = {
                id: makeId(7),
                title: title,
                description: description,
                price: price,
                thumbnail: thumbnail,
                code: code,
                stock: stock
            }

            if(productsObj.length === 0) {
               try {
                    await fs.promises.writeFile(this.path, JSON.stringify([product], null, 2))
                    return {status: 'success', message: 'The product has been added successfullly'}
               } catch(err) {
                    return {status: 'error', message: 'The product could not be added ' + err}
               }
            } else {
                productsObj.push(product)
                try {
                    await fs.promises.writeFile(this.path, JSON.stringify(productsObj, null, 2))
                    return {status: 'success', message: 'The product has been added successfullly'}
                } catch (error) {
                    return {status: 'error', message: 'The product could not be added ' + err}
                }
            }
        } catch {
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
                await fs.promises.writeFile(this.path, JSON.stringify([product], null, 2))
                return {status: 'success', message: 'The product has been added successfullly'}
            } catch (error) {
                return {status: 'error', message: 'An error was found ' + error}
            }
        }
    }

    async getProductById(productId) {
        try {
            const products = await fs.promises.readFile(this.path, 'utf-8');
            const productsObj = JSON.parse(products);
            if(!productsObj.some(el => el.id === productId)){
                return {status: 'error', message: 'Error: Product not found'}
            } 
            let prodObj = productsObj.find(el => el.id === productId);
            return {status: 'success', message: JSON.stringify(prodObj, null, 2)}
        } catch(err) {
            return {status: 'Error', message: 'File not found '+ err}
        }
    }

    async updateProduct(productId, productField) {
        try {
            const products = await fs.promises.readFile(this.path, 'utf-8');
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

            try {
                await fs.promises.writeFile(this.path, JSON.stringify(productsObj, null, 2))
                return {status: 'Success', message: 'Product was updated successfully'}
            } catch(err) {
                return {status: 'Error', message: 'File could not be updated ' + err}
            }
                    
        } catch(err) {
            return {status: 'Error', message: 'File not found '+ err}
        }
    }

    async deleteProduct(productId) {
        try {
            const products = await fs.promises.readFile(this.path, 'utf-8');
            const productsObj = JSON.parse(products);
            if(!productsObj.some(el => el.id === productId)){
                return {status: 'error', message: 'Error: Product not found'}
            } 

            let prodIndex = productsObj.findIndex((obj => obj.id === productId));
            productsObj.splice(prodIndex,1)

           // return {message: JSON.stringify(productsObj, null, 2)}
            try {
                await fs.promises.writeFile(this.path, JSON.stringify(productsObj, null, 2))
                return {status: 'Success', message: 'Product was deleted successfully'}
            } catch (err) {
                return {status: 'Error', message: 'Product could not be deleted ' + err}
            }

        } catch(err) {
            return {status: 'Error', message: 'File not found '+ err}
        }
    }
}

module.exports = ProductManager