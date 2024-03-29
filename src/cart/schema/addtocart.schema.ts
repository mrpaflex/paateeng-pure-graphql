import { Field, ObjectType } from "@nestjs/graphql";
import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import mongoose, { Document } from "mongoose";

export interface CartItem {
    productid: string;
    quantity: number;
  }

@ObjectType()
@Schema({timestamps:true})
export class AddToCart extends Document{

    @Field(()=>String)
    _id?: mongoose.Types.ObjectId;

    @Field(()=>[String])
    @Prop()
    items: CartItem[]

    @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'User'})
    userid: mongoose.Types.ObjectId;

}

export const AddToCartSchema = SchemaFactory.createForClass(AddToCart)