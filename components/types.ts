export interface MenuItem {
  id: number
  name: string
  description: string
  price: string
  image: string
  category: string
  customizable: Array<{
    title: string
    required: boolean
    options: Array<{
      name: string
      price: number
    }>
  }>
}
export interface MenuImage {
  url: string;
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