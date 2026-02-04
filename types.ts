
export enum Category {
  SIGHTSEEING = 'SIGHTSEEING',
  DINING = 'DINING',
  TRANSPORT = 'TRANSPORT',
  ACCOMMODATION = 'ACCOMMODATION'
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
  payer: string; // 支付者姓名
  participants: string[]; // 參與分帳的人員名單
}
