export interface CategoryRequest {
    name: string;
    imgUrl: string;
}
export interface CategoryUpdateRequest {
    category_id: number;
    name: string;
    imgUrl: string;
}

export interface CategoryDetailRequest {
    description: string;
}
export interface CategoryDetailUpdateRequest {
    category_detail_id: number;
    description: string;
}