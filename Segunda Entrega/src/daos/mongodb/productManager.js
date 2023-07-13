import mongoose from "mongoose";
import { productsModel } from "./models/products.model.js";

class ProductManager {
    connection = mongoose.connect('mongodb+srv://apramong7:test1@cluster0.vzmho1l.mongodb.net/?retryWrites=true&w=majority')

    async addProduct(prod) {
        try {
            if(typeof(prod.thumbnails) === 'string') {
                let auxThumbnails = prod.thumbnails;
                auxThumbnails = auxThumbnails.replace(/\s+/g, '');
                let thumbailsArray = auxThumbnails.split(/[|,;,,]/);
                prod.thumbnails = thumbailsArray;
            }
            let result = await productsModel.create(prod)
            return {status: 'success', message: 'Product has been added successfully'};
        } catch(err) {
            console.log('this is error ', err)
            return err
        }
    }

    async getProducts(limit = 10, page = 1, sort = 0, filter = null, filterValue = null) {
        try {
            let whereOptions = {};
            if( filter != '' && filterValue != '') {
                whereOptions =  {[filter]: filterValue};
            }
            let result = await productsModel.paginate(whereOptions, {
                limit: limit, 
                page: page, 
                sort: { price: sort },
                lean: true
            });

            // Modify the result object to include prevLink
            if (result.hasPrevPage) {
                const prevPageNumber = result.prevPage;
                let prevLink = `http://localhost:8080/api/products/?page=${prevPageNumber}&limit=${limit}&sort=${sort}`;
                if( (filter != null && filterValue != null) &&
                    (filter != '' && filterValue != '')) {
                    prevLink = prevLink + `&filter=${filter}&filterValue=${filterValue}`;
                }
                result.prevLink = prevLink;
            }

            // Modify the result object to include nextLink
            if (result.hasNextPage) {
                const nextPageNumber = result.nextPage;
                let nextLink = `http://localhost:8080/api/products/?page=${nextPageNumber}&limit=${limit}&sort=${sort}`;
            
                if( (filter != null && filterValue != null) &&
                    (filter != '' && filterValue != '')) {
                    nextLink = nextLink + `&filter=${filter}&filterValue=${filterValue}`;
                }
                result.nextLink = nextLink;
            }

            let { docs, ...rest } = result;

            let structuredResult = {
                status: "success",
                payload: docs,
                ...rest
            }

            return structuredResult
        } catch (error) {
            return error
        }
    }

    async getProductById(productId) {
        try {
            let result = await productsModel.findOne({ _id: productId }).lean()
            return result        
        } catch (error) {
            return error
        }
    }

    async updateProduct(productId, updatedProduct) {
        try {
            let result = await productsModel.updateOne(
                {_id: productId},
                {$set: updatedProduct}
            );
            return {status: 'success', message: 'Product had been updated successfully'}
        } catch (error) {
            return error
        }
    }

    async deleteProduct(productId) {
        try {
            let result = await productsModel.deleteOne({_id: productId})
            return {status: 'success', message: 'Product has been deleted successfully'}
        } catch (error) {
            return error
        }
    }
}

export default ProductManager