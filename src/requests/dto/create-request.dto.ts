export class CreateRequestDto {
    service_id: number;
    amount: number;
    date_service: Date;
    address: string;
    district: string;
    longitude: number;
    latitude: number;
    reference?: string;
    place_name?: string;
}