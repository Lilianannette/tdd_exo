import { describe, it, expect} from "vitest";
import { CalculatePriseUseCase } from '../app/CalculatePriceUseCase';

describe('CalculatePriceUseCase', () => {
    describe('carts without discount', () => {
        it('Should return the cart total when no discount is applied')

        const cart = {
            items: [
                {name: 'T-shirt', price: 10, quantity: 3},
                {name: 'glasse', price: 35, quantity: 1},
            ],
        };

        const promoCodes: string[] = [];

        const useCase = new CalculatePriseUseCase();

        const finalPrice = useCase.execute(cart, promoCodes);

        expect(finalPrice).toBe(65); // 10*3 + 35*1 = 65€
    })
})