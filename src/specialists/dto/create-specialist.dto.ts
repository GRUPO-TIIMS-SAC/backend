export class CreateSpecialistDto{
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
    occupancy: string;
    searching_job?: boolean;
    drive_license?: boolean;
    work_mode?: number;
    cv?: string;
    certijoven?: string;
    profile_photo?: string;
    auth_strategy: string;
}