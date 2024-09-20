export interface TripayRequest {
    method         : string,
    merchant_ref   : string,
    amount         : number,
    customer_name  : string,
    customer_email : string,
    customer_phone : string,
    order_items    : OrderItem[],
    return_url     : string,
    expired_time?   : number, // 24 jam
    signature      : string
}

export interface OrderItem {
    sku:         string;
    name:        string;
    price:       number;
    quantity:    number;
    subtotal:    number;
    product_url: string;
    image_url:   string;
}