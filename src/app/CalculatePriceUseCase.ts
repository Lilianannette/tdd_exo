import { PromoCodeRepository } from "./PromoCodeRepository";

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
        let has1Buy1Free = false;

        for (const code of promoCodes) {
            const promo = this.promoCodeRepository.findByCode(code);
            if (promo && promo.type === '1buy1free') {
                has1Buy1Free = true;
            }
        }

        // Calcul du total
        for (const item of cart.items) {
            if (has1Buy1Free) {
                total += Math.ceil(item.quantity / 2) * item.price;
            } else {
                total += item.price * item.quantity;
            }
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

export default CalculatePriceUseCase;