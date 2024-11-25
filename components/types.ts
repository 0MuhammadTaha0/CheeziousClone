export interface CustomizationOption {
    name: string;
    price?: number;
  }
  
  export interface CustomizationCategory {
    title: string;
    required: boolean;
    options: CustomizationOption[];
  }
  
  export interface MenuItem {
    id: number;
    name: string;
    customizable?: CustomizationCategory[];
    description: string;
    price: string;
    image: string;
    category: string;
  }
  
  export interface CartItem extends MenuItem {
    quantity: number;
    selectedOptions: { [key: string]: string };
    finalPrice: number;
  }
  
  export interface CartState {
    items: CartItem[];
    total: number;
  }