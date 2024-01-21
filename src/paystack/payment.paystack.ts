import axios from 'axios';
import * as dotenv from "dotenv";
dotenv.config()

export interface IinitializeTransaction{
    amount: number;
    email: string;
    reference?: string;
    callBack_url?: string;
    metadata?: Record<string, any>
};

export class PayStack{
    API_URL= 'https://api.paystack.co';
    API_KEY= process.env.PAYMENT_SECRET;

    async initializeTransaction(data: any){
        const myResponse = await axios.post(`${this.API_URL}/transaction/initialize`, data, {
            headers:{
                Authorization: `Bearer  ${this.API_KEY}`,
                'Content-Type': 'application/json'
            }
        });
        console.log('my response data', myResponse.data)
        myResponse.data;
    }
}