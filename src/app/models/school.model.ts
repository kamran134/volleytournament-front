import { District } from "./district.model";

export interface SchoolData {
    data: School[];
    totalCount: number;
}

export interface School {
    _id: string;
    name: string;
    address: string;
    code: number;
    districtCode: number;
    district: District;
    score?: number;
    averageScore?: number;
}