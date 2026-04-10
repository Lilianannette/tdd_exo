export interface PromoCode {
    code: string;
    type: 'percentage' | 'fixe'; 
    value: number;
}

export interface PromoCodeRepository {
    findByCode(code: string): PromoCode | null;
}