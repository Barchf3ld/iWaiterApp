import path from 'node:path';
import { Router } from 'express';
import multer from 'multer';

import { createCategories } from './app/useCases/categories/createCategory';
import { listCategories } from './app/useCases/categories/listCategories';
import { createProduct } from './app/useCases/products/createProduct';
import { listProducts } from './app/useCases/products/listProducts';
import { listProductsByCategories } from './app/useCases/categories/listProductsByCategories';
import { listOrders } from './app/useCases/orders/listOrders';
import { createOrder } from './app/useCases/orders/createOrder';
import { createOrderStatus } from './app/useCases/orders/createOrderStatus';
import { cancelOrder } from './app/useCases/orders/cancelOrder';
import { deleteProducts } from './app/useCases/products/deleteProducts';
import { deleteCategories } from './app/useCases/categories/deleteCategories';


export const router = Router();

const upload = multer({
    storage: multer.diskStorage({
        destination(req, file, callback) {
            callback(null, path.resolve(__dirname, '..', 'uploads'));
        },
        filename(req, file, callback){
            callback(null,`${Date.now()}-${file.originalname}`);
        },
    })
});

// List categories
router.get('/categories', listCategories);

// Create category
router.post('/categories', createCategories);

// Delete category
router.delete('/categories/:categoryId', deleteCategories);

// List products
router.get('/products', listProducts);

// Create product
router.post('/products', upload.single('image'), createProduct);

//Delete Products
router.delete('/products/:productId', deleteProducts);

// Get products by category
router.get('/categories/:categoryId/products', listProductsByCategories);

// List orders
router.get('/orders', listOrders);

// Create order
router.post('/orders', createOrder);

// Change order status
router.patch('/orders/:orderId', createOrderStatus);

// Delete/cancel order
router.delete('/orders/:orderId', cancelOrder);
