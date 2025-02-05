export type PriceHistoryItem = {
    curprice: number;
    orgprice:number;
  };
  
  export type User = {
    email: string;
  };
  
  export type Product = {
    _id?: string;
    url: string;
    currency: string;
    image: string;
    title: string;
    currentPrice: number;
    originalPrice: number;
    priceHistory: PriceHistoryItem[] | [];
    highestPrice: number;
    lowestPrice: number;
    averagePrice: number;
    discountRate: number;
    description: string;
    reviewsCount: number;
    isOutOfStock: Boolean;
    isTracked: Boolean;
    isLiked: Boolean;
    buyers: String;
    users: User[];
  };
  
  export type NotificationType =
    | "WELCOME"
    | "CHANGE_OF_STOCK"
    | "LOWEST_PRICE"
    | "THRESHOLD_MET";
  
  export type EmailContent = {
    subject: string;
    body: string;
  };
  
  export type EmailProductInfo = {
    title: string;
    url: string;
  };