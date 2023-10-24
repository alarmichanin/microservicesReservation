import {Injectable} from '@nestjs/common';
import Stripe from 'stripe'
import {ConfigService} from "@nestjs/config";
import {CreateChargeDto} from "./dto";

@Injectable()
export class PaymentsService {
    private readonly stripe = new Stripe(
        this.configService.get('STRIPE_SECRET_KEY'),
        {
            apiVersion: "2023-10-16"
        }
    )

    constructor(private readonly configService: ConfigService) {
    }

    async createCharge({card, amount}:CreateChargeDto) {
        const paymentMethod = await this.stripe.paymentMethods.create({
            type: 'card',
            card,
        })
        const paymentIntent = await this.stripe.paymentIntents.create({
            payment_method: paymentMethod.id,
            amount: amount * 100,
            confirm: true,
            payment_method_types: ['card'],
            currency: 'usd'
        })

        return paymentIntent
    }
}
