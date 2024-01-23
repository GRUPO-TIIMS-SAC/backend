export class CreateRequestDto {
    user_id: number;
    service_id: number;
    status_request_id: number;
    payment_id: number;
    unit_id: number;
    amount: number;
    code_service: string;
    date_service: Date;
    created_at: Date;
    updated_at: Date;
}