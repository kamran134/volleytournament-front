export interface TableColumn {
    key: string;
    title: string;
    valueFormatter?: (row: any) => string;
}