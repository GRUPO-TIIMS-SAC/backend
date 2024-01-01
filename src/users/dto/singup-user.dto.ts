export class SingUpDto{
    auth_method_id: number;
    email: string;
    password?: string;
    validated_code?: string;
    created_at?: Date;
}