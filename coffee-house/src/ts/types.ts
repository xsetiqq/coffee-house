
export type Category = "coffee" | "tea" | "dessert";


export interface Product {
  id: number;
  name: string;
  description: string;
  price: string; 
  discountPrice: string | null; 
  category: Category;
}


export interface ListResponse<T> {
  data: T[];
  message?: string;
  error?: string;
}


export type FavoritesResponse = ListResponse<Product>;
export type ProductsResponse = ListResponse<Product>;


export interface SliderItem {
  title: string;
  desc: string;
  price: string;
  img: string;
}
export interface ProductSize {
  size: string;
  price: string;
  discountPrice?: string | null;
}

export interface ProductAdditive {
  name: string;
  price: string;
  discountPrice?: string | null;
}

export interface Product {
  id: number;
  name: string;
  description: string;
  price: string;
  discountPrice: string | null;
  category: Category;
  sizes: Record<string, ProductSize>;
  additives: ProductAdditive[];
}

export type ProductResponse = { data: Product };
export interface ProductSizeEntry {
  size: string; 
  price: string; 
  discountPrice?: string | null;
}
export type ProductSizesMap = Record<string, ProductSizeEntry>; 

export interface ProductAdditiveEntry {
  name: string; 
  price: string; 
  discountPrice?: string | null;
}

export interface ProductDetails {
  id: number;
  name: string;
  description: string;
  price: string;
  discountPrice: string | null;
  category: Category;
  sizes: ProductSizesMap;
  additives: ProductAdditiveEntry[];
}

export interface ProductByIdResponse {
  data: ProductDetails;
}





export interface LoginRequest {
  login: string;
  password: string;
}

export interface LoginUser {
  id: number;
  login: string;
  city: string;
  street: string;
  houseNumber: number;
  paymentMethod: "cash" | "card";
  createdAt: string;
}

export interface LoginResponse {
  data: {
    access_token: string;
    user: LoginUser;
  };
  message?: string;
  error?: string;
}

export type CartItem = {
  productId: number;
  name: string;
  category: string;
  img: string;

  sizeKey: string; 
  sizeLabel: string;
  additives: string[]; 

  unitBaseCents: number; 
  unitFinalCents: number; 
  count: number;
};

export interface RegisterRequest {
  login: string;
  password: string;
  confirmPassword: string;
  city: string;
  street: string;
  houseNumber: number;
  paymentMethod: "cash" | "card";
}

export interface RegisterResponse {
  data: {
    access_token: string;
    user: LoginUser;
  };
  message: string;
}


export type SizeKey = "s" | "m" | "l" | "xl" | "xxl";

export interface OrderItem {
  productId: number;
  size: SizeKey; 
  additives: string[];
  quantity: number;
}

export interface ConfirmOrderRequest {
  items: OrderItem[];
  totalPrice: number; 
}


export interface ConfirmOrderResponse {
  data?: {
    orderId?: number;
    message?: string;
  };
  message?: string;
}