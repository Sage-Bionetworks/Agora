export interface News {
    data: string;
    entry: NewsEntry[];
}

export interface NewsEntry {
    header: string;
    body: string;
}
