
export enum Category {
  SIGHTSEEING = 'SIGHTSEEING',
  DINING = 'DINING',
  TRANSPORT = 'TRANSPORT',
  ACCOMMODATION = 'ACCOMMODATION'
}

export enum ShoppingType {
  PERSONAL = 'PERSONAL',
  PROXY = 'PROXY'
}

export interface WeatherInfo {
  temp: string;
  condition: string;
  icon: string;
}

export interface ItineraryItem {
  id: string;
  time?: string;
  category: Category;
  title: string;
  description?: string;
  price?: string;
}

export interface DailyItinerary {
  day: number;
  date: string;
  weekday: string;
  location: string;
  weather: WeatherInfo;
  items: ItineraryItem[];
  hotel: {
    name: string;
    address: string;
    phone: string;
  };
}

export interface Expense {
  id: string;
  title: string;
  amount: number;
  category: string;
  date: string;
  payer: string;
  participants: string[];
}

export interface ShoppingItem {
  id: string;
  title: string;
  price?: string;
  quantity: number;
  type: ShoppingType;
  owner?: string; // 對於代購清單很有用
  note?: string;
  isPurchased: boolean;
}
