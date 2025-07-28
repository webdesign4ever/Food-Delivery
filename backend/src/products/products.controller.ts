import { Body, Controller, Delete, Get, HttpException, HttpStatus, NotFoundException, Param, ParseIntPipe, Post, Put, Query } from '@nestjs/common';
import { ProductsService } from './products.service';
import { InsertProduct } from 'src/db/schema';

@Controller('products')
export class ProductsController {
    constructor(private productsService: ProductsService) { }

    @Get()
    async getProducts(@Query('category') category?: string, @Query('available') available?: string) {
        try {
            let products;

            if (available === "true") {
                products = await this.productsService.getAvailableProducts();
            } else if (category) {
                products = await this.productsService.getProductsByCategory(category as string);
            } else {
                products = await this.productsService.getProducts();
            }
            return products;

        } catch {
            throw new HttpException({ message: 'Failed to fetch products' }, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @Post()
    async createProduct(@Body() body: InsertProduct) {
        try {
            return await this.productsService.createProduct(body);
        } catch {
            throw new HttpException({ message: 'Invalid product data' }, HttpStatus.BAD_REQUEST);
        }
    }

    @Put(':id')
    async updateProduct(@Param('id', ParseIntPipe) id: number, @Body() updates: Partial<InsertProduct>) {
        try {
            const updatedProduct = await this.productsService.updateProduct(id, updates);

            if (!updatedProduct) {
                throw new NotFoundException({ message: `Product with id ${id} not found` });
            }

            return updatedProduct;
        } catch (err) {
            if (err instanceof NotFoundException) throw err;
            throw new HttpException({ message: 'Failed to update product' }, HttpStatus.BAD_REQUEST);
        }
    }

    @Delete(':id')
    async deleteProduct(@Param('id', ParseIntPipe) id: number) {
        try {
            const deleted = await this.productsService.deleteProduct(id);
            if (!deleted) {
                throw new NotFoundException({ message: 'Product not found' });
            }
            return { message: 'Product deleted successfully' };
        } catch (err) {
            console.log(err)
            if (err instanceof NotFoundException) throw err;
            throw new HttpException({ message: 'Failed to delete product' }, HttpStatus.BAD_REQUEST);
        }
    }

}
