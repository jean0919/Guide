
import { DailyItinerary, Category } from './types';

export const TRIP_DATA: DailyItinerary[] = [
  {
    day: 1,
    date: '2026.02.26',
    weekday: 'Thu',
    location: '仁川',
    weather: { temp: '-2°C / 4°C', condition: '多雲時晴', icon: 'cloud-sun' },
    items: [
      { id: '1-1', category: Category.TRANSPORT, title: '台中國際機場 ➔ 仁川國際機場', description: '真航空 LJ736 (11:00 - 14:35)' },
      { id: '1-2', category: Category.SIGHTSEEING, title: '海鷗船（餵食海鷗）', description: '近距離欣賞海景，體驗餵食成群翱翔的海鷗。' },
      { id: '1-3', category: Category.SIGHTSEEING, title: '月尾島國際街', description: '仁川月尾島人氣景點。' },
      { id: '1-4', category: Category.DINING, title: '晚餐：韓式燒肉鍋', description: '₩15,000 / 人' }
    ],
    hotel: {
      name: '仁川索普拉青羅飯店 Sopra Incheon Cheongna',
      address: '21, Seogot-ro 301beon-gil, Seo-gu, Incheon',
      phone: '82-032-568-8700'
    }
  },
  {
    day: 2,
    date: '2026.02.27',
    weekday: 'Fri',
    location: '江原道',
    weather: { temp: '-8°C / -1°C', condition: '陣雪', icon: 'snow' },
    items: [
      { id: '2-1', category: Category.SIGHTSEEING, title: '小金山大峽谷 (SKY TOWER + 步步驚心吊橋)', description: '全長404公尺，原州熱門打卡景點。' },
      { id: '2-2', category: Category.SIGHTSEEING, title: 'High 1 歡樂滑雪體驗', description: '含雪橇、雪鞋、雪杖。不含雪衣褲。' },
      { id: '2-3', category: Category.DINING, title: '午餐：韓方綠豆雞腿養生鍋', description: '₩13,000 / 人' },
      { id: '2-4', category: Category.DINING, title: '晚餐：豬肉壽喜鍋', description: '₩13,000 / 人' }
    ],
    hotel: {
      name: 'High 1 滑雪渡假村',
      address: '424, Sabuk-ri, Sabuk-eup, Jeongseon-gun, Gangwon-do',
      phone: '82-15887789'
    }
  },
  {
    day: 3,
    date: '2026.02.28',
    weekday: 'Sat',
    location: '原州 / 仁川',
    weather: { temp: '-5°C / 2°C', condition: '晴時多雲', icon: 'sun' },
    items: [
      { id: '3-1', category: Category.SIGHTSEEING, title: 'High 1 景觀纜車 (Sky 1340)', description: '飽覽群山四季絕美景致。' },
      { id: '3-2', category: Category.SIGHTSEEING, title: '香水體驗館 DIY (25ml)', description: '親手調製個人專屬香水。' },
      { id: '3-3', category: Category.SIGHTSEEING, title: '冰壁咖啡 (飲品自理)', description: '欣賞天然壯觀冰瀑景觀。' },
      { id: '3-4', category: Category.DINING, title: '午餐：馬鈴薯燉豬骨', description: '₩12,000 / 人' },
      { id: '3-5', category: Category.DINING, title: '晚餐：韓式烤肉', description: '₩17,900 / 人' }
    ],
    hotel: {
      name: '仁川索普拉青羅飯店 Sopra Incheon Cheongna',
      address: '21, Seogot-ro 301beon-gil, Seo-gu, Incheon',
      phone: '82-032-568-8700'
    }
  },
  {
    day: 4,
    date: '2026.03.01',
    weekday: 'Sun',
    location: '首爾 / 仁川',
    weather: { temp: '-1°C / 6°C', condition: '晴', icon: 'sun' },
    items: [
      { id: '4-1', category: Category.SIGHTSEEING, title: '恩平韓屋村', description: '享受寧靜的韓屋聚落氛圍。' },
      { id: '4-2', category: Category.SIGHTSEEING, title: '韓流時尚彩妝店', description: '最新韓式美妝資訊。' },
      { id: '4-3', category: Category.SIGHTSEEING, title: '海苔博物館', description: '紫菜飯捲 DIY + 韓服體驗。' },
      { id: '4-4', category: Category.SIGHTSEEING, title: '明洞商圈', description: '自由逛街購物、美食天堂。' },
      { id: '4-5', category: Category.DINING, title: '午餐：泰一家海鮮鍋', description: '₩18,000 / 人' },
      { id: '4-6', category: Category.DINING, title: '晚餐：方便逛街敬請自理' }
    ],
    hotel: {
      name: '仁川索普拉青羅飯店 Sopra Incheon Cheongna',
      address: '21, Seogot-ro 301beon-gil, Seo-gu, Incheon',
      phone: '82-032-568-8700'
    }
  },
  {
    day: 5,
    date: '2026.03.02',
    weekday: 'Mon',
    location: '仁川 / 台中',
    weather: { temp: '0°C / 8°C', condition: '多雲', icon: 'cloud' },
    items: [
      { id: '5-1', category: Category.SIGHTSEEING, title: 'K-RAMAN 體驗館', description: '自助拉麵機、手做飯糰、辣炒年糕。' },
      { id: '5-2', category: Category.TRANSPORT, title: '仁川國際機場 ➔ 台中國際機場', description: '真航空 LJ737 (15:20 - 17:30)' },
      { id: '5-3', category: Category.DINING, title: '午餐：特別贈送拉麵自助套餐', description: '拉麵 + 年糕 + 飯糰' }
    ],
    hotel: {
      name: '溫暖的家',
      address: 'Taiwan',
      phone: '-'
    }
  }
];

export const FLIGHT_INFO = [
  { no: 'LJ736', from: 'TPE (11:00)', to: 'ICN (14:35)', date: '02/26 (四)' },
  { no: 'LJ737', from: 'ICN (15:20)', to: 'TPE (17:30)', date: '03/02 (一)' }
];

export const EMERGENCY_CONTACTS = [
  { name: '劉宜柔 (Tina)', role: '領隊', phone: '0932-574390' },
  { name: '吳婉瑜', role: '公司聯絡人', phone: '0970967990' },
  { name: '急難救助專線', role: '外交部', phone: '800-0885-0885' }
];

export const TRAVEL_NOTES_CATEGORIES = [
  {
    id: 'prep',
    label: '行前準備',
    items: [
      { title: '證件', content: '護照正本（有效期需6個月以上）、身分證影本、手機截圖保存 Q-code/K-ETA (若需)。' },
      { title: '電壓/插頭', content: '220v，圓型孔插座。多數飯店提供外借，建議自備轉接頭。' },
      { title: '貨幣', content: '建議在台換少量韓元。當地明洞換錢所匯率較佳。主要地點可刷卡 (海外回饋高者優)。' },
      { title: '網路', content: '建議下載 Papago 翻譯、Naver Map（Google Map 在韓不準確）。' }
    ]
  },
  {
    id: 'weather',
    label: '氣候穿著',
    items: [
      { title: '洋蔥式穿法', content: '內層排汗/發熱衣、中層毛衣、外層防風厚羽絨。室內有暖氣非常熱，需方便脫穿。' },
      { title: '保濕與防曬', content: '韓國冬季氣候乾燥，需備乳液、護唇膏。雪地反光強烈，建議備墨鏡與防曬。' },
      { title: '配件', content: '毛帽（遮耳）、圍巾、手套為必備，能有效降低體感溫度。' }
    ]
  },
  {
    id: 'ski',
    label: '滑雪與冰壁須知',
    items: [
      { title: '租借細節', content: '團費內含雪板、雪鞋、雪杖。雪衣褲需另行現場支付租借費（約 ₩20,000-30,000）。' },
      { title: '安全第一', content: '聽從教練指導，初學者切勿前往高級滑道。跌倒時請側摔，勿用手撐地。' },
      { title: '個人裝備', content: '強烈建議自備厚長襪（以免雪鞋摩擦）及備用乾衣物。' }
    ]
  },
  {
    id: 'customs',
    label: '在地習俗',
    items: [
      { title: '飲食文化', content: '韓國多數小菜可續，冰水為四季標配。多數湯品口味偏辣，怕辣者請告知領隊。' },
      { title: '垃圾分類', content: '韓國垃圾分類極嚴格，尤其廚餘需分開處理，請配合飯店規定。' },
      { title: '環保政策', content: '多數飯店不提供一次性牙刷牙膏，請務必自備。塑膠袋需付費購買。' }
    ]
  },
  {
    id: 'return',
    label: '回程提醒',
    items: [
      { title: '海關禁令', content: '嚴禁攜帶動植物產品回台！尤其是【各類肉製品】(含肉乾、含肉鬆泡麵、香腸)，罰鍰 20 萬起跳。' },
      { title: '退稅流程', content: '在貼有 Tax Free 標誌店面消費滿 ₩30,000 可申請退稅。請保留收據，機場辦理。' }
    ]
  }
];

export const KOREAN_PHRASES = [
  {
    category: '基本禮貌',
    items: [
      { kr: '안녕하세요', rom: 'An-nyeong-ha-se-yo', ja: 'アンニョンハセヨ', zh: '你好' },
      { kr: '감사합니다', rom: 'Gam-sa-ham-ni-da', ja: 'カムサハムニダ', zh: '謝謝' },
      { kr: '죄송합니다', rom: 'Joe-song-ham-ni-da', ja: 'チェソンハムニダ', zh: '對不起' },
      { kr: '네 / 아니요', rom: 'Ne / A-ni-yo', ja: 'ネ / アニヨ', zh: '是 / 不是' }
    ]
  },
  {
    category: '用餐與購物',
    items: [
      { kr: '이거 주세요', rom: 'I-geo ju-se-yo', ja: 'イゴ ジュセヨ', zh: '請給我這個' },
      { kr: '얼마예요?', rom: 'Eol-ma-ye-yo?', ja: 'オルマエヨ？', zh: '多少錢？' },
      { kr: '맵지 않게 해주세요', rom: 'Maep-ji an-ge hae-ju-se-yo', ja: 'メプチ アンゲ ヘジュセヨ', zh: '請不要做太辣' },
      { kr: '물 좀 주세요', rom: 'Mul jom ju-se-yo', ja: 'ムル チョム ジュセヨ', zh: '請給我水' }
    ]
  },
  {
    category: '交通與方向',
    items: [
      { kr: '화장실 어디예요?', rom: 'Hwa-jang-sil eo-di-ye-yo?', ja: 'ファジャンシル オディエヨ？', zh: '廁所在哪裡？' },
      { kr: '這裡 가주세요', rom: 'Yeo-gi ga-ju-se-yo', ja: 'ヨギ カジュセヨ', zh: '請帶我去這裡 (計程車)' },
      { kr: '역이 어디예요?', rom: 'Yeok-i eo-di-ye-yo?', ja: 'ヨギ オディエヨ？', zh: '地鐵站在哪裡？' }
    ]
  },
  {
    category: '緊急求助',
    items: [
      { kr: '도와주세요', rom: 'Do-wa-ju-se-yo', ja: 'トワジュセヨ', zh: '請救救我 / 請幫幫我' },
      { kr: '병원에 가고 싶어요', rom: 'Byeong-won-e ga-go si-po-yo', ja: 'ピョンウォネ カゴ シポヨ', zh: '我想去醫院' }
    ]
  }
];
