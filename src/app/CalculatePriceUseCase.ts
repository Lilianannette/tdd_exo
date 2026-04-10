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
            if (promo) {
                if (promo.type === 'percentage') {
                    total = total - (total * promo.value / 100);
                } else if (promo.type === 'fixe') {
                    total = total - promo.value;
                }
            }
        }
        return Math.max(total, 1);
    }
}

export default CalculatePriceUseCase