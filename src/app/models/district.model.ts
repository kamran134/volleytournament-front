export interface DistrictData {
    data: District[];
    totalCount: number;
}

export interface District {
    _id: string;
    name: string;
    code: number;
    region: string;
}