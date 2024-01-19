import { Field, InputType } from "@nestjs/graphql";
import { IsNotEmpty } from "class-validator";

@InputType()
export class ProductQuantityInput {
    @Field(()=> [String])
    @IsNotEmpty()
    productid: string[];
  
    @Field()
    @IsNotEmpty()
    quantity: number;
  }