import {PromoCodeRepository} from "./PromoCodeRepository";

export interface CartItem {
    name: string;
    price: number;
    quantity: number;
}

export interface Cart {
    items: CartItem[];
}

export class CalculatePriceUseCase {
    constructor(private promoCodeRepository: PromoCodeRepository) {
    }
    execute(cart: Cart, promoCodes: string[]): number {
        let total = 0;
        for (const item of cart.items) {
            total += item.price * item.quantity;
        }

        for (const code of promoCodes) {
            const promo = this.promoCodeRepository.findByCode(code);
            if (promo && promo.type === 'percentage') {
                total = total - (total * promo.value / 100);
            }
        }

        return total;
    }
}

export default CalculatePriceUseCase