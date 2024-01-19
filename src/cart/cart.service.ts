
import { HttpException, HttpStatus, Injectable, InternalServerErrorException } from '@nestjs/common';
import { AddToCartInput } from './input/cart.input';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { AddToCart } from './schema/addtocart.schema';
import { User } from 'src/user/schema/user.schema';
import { Product } from 'src/product/schema/product.schema';
import { returnString } from 'src/common/return/return.input';



@Injectable()
export class CartService {
  constructor(
    @InjectModel(Product.name)
    private productModel: Model<Product>,
    @InjectModel(AddToCart.name)
    private addToCartModel: Model<AddToCart>,
  ) {}

  async addToCart(addToCartInput: AddToCartInput, user: User): Promise<returnString> {
    const {items} = addToCartInput

    try {
      // Validate input
      if (!user) {
        throw new HttpException('Invalid input.', HttpStatus.BAD_REQUEST);
      }

      let cart: { productid: string; quantity: number }[] = []

      for (const item of items) {
        const products = await this.productModel.findOne({ _id: item.productid });
  
        if (!products) {
          throw new HttpException(`Product with ID ${item.productid} not found`, HttpStatus.NOT_FOUND)
        }
  
        cart.push({
          productid: products._id.toString(),
          quantity: item.quantity || 1,
        });
      };
      
      if (!cart || cart.length === 0) {
       throw new HttpException('select product', HttpStatus.UNPROCESSABLE_ENTITY)
      }
      
      const createCart = await this.addToCartModel.create({
        items: cart
      })

      console.log(createCart);

      return {
        Response: 'Successfully added to caet'
      };

    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }
      throw new InternalServerErrorException('Server error');
    }
  }
  
}
