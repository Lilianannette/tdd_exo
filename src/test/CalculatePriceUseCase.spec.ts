import { describe, it, expect } from "vitest";
import CalculatePriceUseCase from '../app/CalculatePriceUseCase';
import { PromoCodeRepository, PromoCode } from '../app/PromoCodeRepository';

class StubPromoCodeRepository implements PromoCodeRepository {
    private promos: Map<string, PromoCode> = new Map();

    withPromo(promo: PromoCode): this {
        this.promos.set(promo.code, promo);
        return this;
    }

    findByCode(code: string): PromoCode | null {
        return this.promos.get(code) ?? null;
    }
}

describe('CalculatePriceUseCase', () => {
    describe('carts without discount', () => {
        it('Should return the cart total when no discount is applied', () => {
            const cart = {
                items: [
                    { name: 'T-shirt', price: 10, quantity: 3 },
                    { name: 'glass', price: 35, quantity: 1 },
                ],
            };

            const promoCodes: string[] = [];
            const stubRepo = new StubPromoCodeRepository();
            const useCase = new CalculatePriceUseCase(stubRepo);
            const finalPrice = useCase.execute(cart, promoCodes);

            expect(finalPrice).toBe(65); // 10*3 + 35*1 = 65€
        });
    });

    describe('code promo %', () => {
        it('Should apply a discount of 10% with code PROMO10', () => {
            const cart = {
                items: [
                    { name: 'T-shirt', price: 10, quantity: 3 },
                ],
            };

            const promoCode = ['PROMO10'];
            const stubRepo = new StubPromoCodeRepository()
                .withPromo({ code: 'PROMO10', type: 'percentage', value: 10 });

            const useCase = new CalculatePriceUseCase(stubRepo);
            const finalPrice = useCase.execute(cart, promoCode);

            expect(finalPrice).toBe(27); // 10*3 - 10% = 27€
        });
    });

    describe('code promo fixed', () => {
        it('Should apply a fixed discount of 30€ with code PROMO30', () => {
            const cart = {
                items: [
                    { name: 'T-shirt', price: 50, quantity: 2 },
                ],
            };

            const promoCode = ['PROMO30'];
            const stubRepo = new StubPromoCodeRepository()
                .withPromo({ code: 'PROMO30', type: 'fixe', value: 30 });

            const useCase = new CalculatePriceUseCase(stubRepo);
            const finalPrice = useCase.execute(cart, promoCode);

            expect(finalPrice).toBe(70); // 100 - 30 = 70€
        });

        it('Should return a minimum of 1€ if discount exceeds total', () => {
            const cart = {
                items: [
                    { name: 'T-shirt', price: 10, quantity: 1 },
                ],
            };

            const promoCode = ['PROMO30'];
            const stubRepo = new StubPromoCodeRepository()
                .withPromo({ code: 'PROMO30', type: 'fixe', value: 30 });

            const useCase = new CalculatePriceUseCase(stubRepo);
            const finalPrice = useCase.execute(cart, promoCode);

            expect(finalPrice).toBe(1); // 10 - 30 = -20 → minimum 1€
        });
    });


});