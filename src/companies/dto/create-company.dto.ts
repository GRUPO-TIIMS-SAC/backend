export class CreateCompanyDto{
    social_reason: string;
    phone: string;
    email: string;
    address: string;
    country: string;
    region: string;
    district: string;
    ruc: string;
    field: number;
    profile_photo?: string;
}