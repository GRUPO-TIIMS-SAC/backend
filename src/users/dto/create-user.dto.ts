export class CreateUserDto{
    nickname: string;
    name: string;
    phone: string;
    email: string;
    address: string;
    country: string;
    region: string;
    district: string;
    identity_document: number;
    number_document: string;
    profile_photo?: string;
    auth_strategy?: string;
}