export class CreateServiceDto {
    subspeciality_id: number;
    unit_id: number;
    amount: number;
    experience?: number;
    address?: string;
    district?: string;
    longitude?: number;
    latitude?: number;
    reference?: string;
    place_name?: string;
}