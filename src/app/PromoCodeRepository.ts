export interface PromoCode {
    code: string;
    type: 'percentage' | 'fixe' | '1buy1free';
    value: number;
}

export interface PromoCodeRepository {
    findByCode(code: string): PromoCode | null;
}