const PHONE_NUMBER_LENGTH = 10;

export function sanitizePhoneInput(value: string): string{
    return value.replace(/\D/g, '').slice(0, PHONE_NUMBER_LENGTH);
}

export function isValidPhoneNumber(value: string): boolean{
    return /^\d{10}$/.test(value);
}