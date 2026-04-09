export interface CartItem {
    name: string;
    price: number;
    quantity: number;
}

export interface Cart {
    items: CartItem[];
}

export class CalculatePriceUseCase {
    execute(cart: Cart, promoCodes: String[]): number {
        let total = 0;
        for (const item of cart.items) {
            total += item.price * item.quantity;
        }
        return total;
    }
}