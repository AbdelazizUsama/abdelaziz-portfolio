export function asset(path) {
  const base = import.meta.env.BASE_URL || '/';
  const normalizedBase = base.endsWith('/') ? base : `${base}/`;
  const normalizedPath = String(path ?? '').replace(/^\/+/, '');
  return `${normalizedBase}${normalizedPath}`;
}

export function fmt(value) {
  if (value === null || value === undefined || value === '') return '';
  const number = Number(value);
  return Number.isFinite(number) ? number.toLocaleString('en-US') : String(value);
}

export function fmtDate(isoDate, isArabic = false) {
  if (!isoDate) return '';
  const date = new Date(`${isoDate}T00:00:00Z`);
  if (Number.isNaN(date.getTime())) return String(isoDate);
  return date.toLocaleDateString(
    isArabic ? 'ar-EG-u-nu-latn' : 'en-GB',
    { day: 'numeric', month: 'short', year: 'numeric', timeZone: 'UTC' }
  );
}

export function stripPlaceholders(value) {
  if (typeof value !== 'string') return '';
  return value
    .replace(/\[[^\]]*(?:add|أضف|اضف|file\s+to\s+be\s+added)[^\]]*\]/gi, '')
    .replace(/\s+([,.;:!?])/g, '$1')
    .replace(/\s{2,}/g, ' ')
    .trim()
    .replace(/^[,.;:!?\s]+|[,.;:!?\s]+$/g, '');
}

export const GOVERNORATE_EN = {
  'القاهرة': 'Cairo',
  'الجيزة': 'Giza',
  'القليوبية': 'Qalyubia',
  'السويس': 'Suez',
  'الإسكندرية': 'Alexandria',
  'البحر الأحمر': 'Red Sea',
  'مطروح': 'Matrouh',
  'أسيوط': 'Asyut'
};

export const DELIVERY_EN = {
  'تم التسليم': 'Delivered',
  'مرتجع': 'Returned',
  'مرفوض': 'Rejected',
  'ملغي': 'Cancelled',
  'ملغى': 'Cancelled'
};

export const PLATFORM_EN = {
  'هومزمارت': 'HomeMart',
  'اوسكار ريتن': 'Oscar Rattan',
  'شيك هومز': 'Chic Homes',
  'تاكى': 'Taki',
  'السويس': 'Suez',
  'فيسبوك': 'Facebook',
  'منزلى': 'Manzely',
  'كيمت': 'Kemet'
};

export const PRODUCT_EN = {
  'هير واكس أسود , 100 جم(Honey wax&Vitamin E) ,سنيور': 'Senor Black Hair Wax 100g (Honey wax & Vitamin E)',
  'سنيور كريم زبدة شيا 225 جم': 'Senor Shea Butter Cream 225g',
  'جل شفاف سنيور 250 جم (Senor mega hard styling gel)': 'Senor Clear Gel 250g',
  'سنيور كريم لتصفيف الشعر بزيت الجرجير , 200 مل': 'Senor Hair Styling Cream, Arugula Oil 200ml',
  'سنيور كريم جل225 جم': 'Senor Cream Gel 225g',
  'جل أسود سنيور 250 جم (Senor mega hard styling gel)': 'Senor Black Gel 250g',
  'سنيور هارد هير واكس(أحمر) , 100 جم (Rock Wax)': 'Senor Hard Hair Wax (Red) 100g (Rock Wax)',
  'سنيور كريم للشعر بزيت الأرجان وجوز الهند وزبدة الشيا 250 جم ( كريم بامب)': 'Senor Hair Cream, Argan, Coconut & Shea Butter 250g (Bomb Cream)',
  'سنيور كريم لتصفيف الشعر بعسل النحل الطبيعي, 200 مل': 'Senor Hair Styling Cream, Natural Bee Honey 200ml',
  'هيرلايف جل 275 مل * 24 قطعة': 'Hairlife Gel 275ml x 24 pcs'
};
