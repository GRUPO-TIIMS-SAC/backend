export class SingUpDto{
    auth_method_id: number;
    email: string;
    fullname: string;
    password?: string;
    validated_code?: string;
    refer_code?: string;
}