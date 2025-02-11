import { Student } from "./student.model";

export interface Stats {
    studentsOfMonth?: Student[];
    studentsOfMonthByRepublic?: Student[];
    developingStudents?: Student[];
}