import React from 'react';
import { X, ShoppingBag, Truck, MapPin, ShoppingCart, Lock } from 'lucide-react';
import misuoData from '../data/misuo_data.json';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement
} from 'chart.js';
import { Bar, Doughnut } from 'react-chartjs-2';
import ChartTable from './ChartTable';
import CaseStudyPanel from './CaseStudyPanel';
import useDialog from '../utils/useDialog';
import { asset, fmt, fmtDate, GOVERNORATE_EN, DELIVERY_EN, PLATFORM_EN } from '../utils/helpers';
import { portfolioData } from '../data/portfolio_content';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend, ArcElement);

export default function ProjectMisuoModal({ lang, onClose }) {
  const isAr = lang === 'ar';
  const { dialogRef, closeRef } = useDialog(onClose);
  const s = misuoData.summary;
  const project = portfolioData[lang].projects.find((p) => p.id === 'misuo-ecommerce');
  const email = portfolioData[lang].personal.email;
  const period = `${fmtDate(s.order_date_start, isAr)} – ${fmtDate(s.order_date_end, isAr)}`;

  const deliveryLabels = misuoData.delivery_breakdown.map((d) => `${isAr ? d.status : DELIVERY_EN[d.status] || d.status} (${d.percentage}%)`);
  const deliveryValues = misuoData.delivery_breakdown.map((d) => d.percentage);
  const areaLabels = misuoData.orders_by_area.map((a) => (isAr ? a.city : GOVERNORATE_EN[a.city] || a.city));
  const areaValues = misuoData.orders_by_area.map((a) => a.orders);
  const platformLabels = misuoData.sales_by_platform.map((p) => (isAr ? p.platform : PLATFORM_EN[p.platform] || p.platform));
  const platformValues = misuoData.sales_by_platform.map((p) => p.units);

  const titles = {
    delivery: isAr ? 'حالة التوصيل (% من أسطر الطلبات)' : 'Delivery Status (% of order lines)',
    area: isAr ? 'أسطر الطلبات حسب المحافظة' : 'Order Lines by Governorate',
    platform: isAr ? 'عدد القطع المباعة حسب منصة البيع' : 'Items Sold by Sales Platform',
  };

  const barOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: { legend: { display: false }, tooltip: { rtl: isAr } },
    scales: {
      x: { ticks: { color: '#A3ADB5' }, grid: { color: '#30363B' } },
      y: { ticks: { color: '#A3ADB5' }, grid: { color: '#30363B' } },
    },
  };
  const barData = (labels, values, label) => ({
    labels,
    datasets: [{ label, data: values, backgroundColor: '#78A99B', borderColor: '#8DBBAC', borderWidth: 1, borderRadius: 6 }],
  });
  const deliveryData = { labels: deliveryLabels, datasets: [{ data: deliveryValues, backgroundColor: ['#81C784', '#FFB74D', '#E57373'], borderWidth: 0 }] };

  const kpis = [
    { label: isAr ? 'إجمالي المبيعات' : 'Total Sales', value: fmt(s.total_sales_egp), color: 'text-[#81C784]', sub: 'EGP' },
    { label: isAr ? 'أسطر الطلبات' : 'Order lines', value: fmt(s.order_lines), color: 'text-[#F1F3F4]', sub: period },
    { label: isAr ? 'قطع مباعة' : 'Items sold', value: fmt(s.items_sold), color: 'text-[#F1F3F4]', sub: isAr ? 'قطعة' : 'Items' },
    { label: isAr ? 'متوسط سعر البيع لكل سطر' : 'Avg selling price per line', value: fmt(s.avg_selling_price_egp), color: 'text-[#78A99B]', sub: 'EGP' },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md overflow-y-auto"
         onMouseDown={(e) => { if (e.target === e.currentTarget) onClose(); }}>
      <div
        ref={dialogRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby="misuo-modal-title"
        dir={isAr ? 'rtl' : 'ltr'}
        className="relative w-full max-w-6xl bg-[#191C1F] border border-[#30363B] rounded-2xl shadow-2xl overflow-hidden my-8 max-h-[90vh] flex flex-col text-[#F1F3F4]"
      >

        {/* Modal Header */}
        <div className="p-5 bg-[#202428] border-b border-[#30363B] flex items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 shrink-0 rounded-xl bg-[#191C1F] border border-[#30363B] flex items-center justify-center">
              <ShoppingBag className="w-5 h-5 text-[#78A99B]" aria-hidden="true" />
            </div>
            <div>
              <h2 id="misuo-modal-title" className="text-lg font-bold text-[#F1F3F4]">
                {isAr ? 'لوحة تحليل مبيعات وحالة توصيل شركة مسيو (MISUO)' : 'MISUO E-Commerce Sales & Delivery Status BI'}
              </h2>
              <p className="text-xs text-[#A3ADB5]">
                {isAr ? `طلبات بتاريخ ${period}` : `Orders dated ${period}`}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3 shrink-0">
            {/* The workbook contains customers' names and addresses, so it is not offered for download */}
            <a
              href={`mailto:${email}?subject=${encodeURIComponent(project.title)}`}
              className="hidden sm:flex items-center gap-1.5 px-3 py-2 rounded-lg bg-[#202428] border border-dashed border-[#30363B] text-[#78A99B] text-xs font-bold"
            >
              <Lock className="w-3.5 h-3.5" aria-hidden="true" />
              <span>{isAr ? 'ملف البيانات متاح عند الطلب' : 'Dataset available on request'}</span>
            </a>

            <button
              ref={closeRef}
              type="button"
              onClick={onClose}
              aria-label={isAr ? 'إغلاق النافذة' : 'Close dialog'}
              className="w-10 h-10 rounded-lg bg-[#191C1F] border border-[#30363B] text-[#A3ADB5] hover:text-[#F1F3F4] flex items-center justify-center"
            >
              <X className="w-4 h-4" aria-hidden="true" />
            </button>
          </div>
        </div>

        {/* Modal Body */}
        <div className="p-6 space-y-6 overflow-y-auto custom-scrollbar flex-1 bg-[#111315]">

          {/* Snapshot */}
          <div className="relative rounded-xl overflow-hidden border border-[#30363B] bg-[#191C1F]">
            <img
              src={asset('assets/dashboard_misuo.jpg')}
              alt={project.imageAlt}
              className="w-full h-64 object-cover object-top opacity-95"
            />
            <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-[#111315] via-[#111315]/80 to-transparent p-4">
              <span className="text-xs font-semibold px-3 py-1 rounded bg-[#202428] text-[#78A99B] border border-[#30363B]">
                {isAr ? 'تحليل المبيعات والتسليمات | شركة مسيو' : 'MISUO Sales & Logistics BI'}
              </span>
            </div>
          </div>

          {/* Key Metrics */}
          <ul className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {kpis.map((k) => (
              <li key={k.label} className="p-3.5 rounded-xl bg-[#191C1F] border border-[#30363B] text-center">
                <p className="text-xs text-[#A3ADB5] mb-1">{k.label}</p>
                <p className={`text-2xl sm:text-3xl font-black ${k.color}`}>{k.value}</p>
                <p className="text-[11px] text-[#A3ADB5] mt-0.5">{k.sub}</p>
              </li>
            ))}
          </ul>

          {/* Charts Row 1 */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            <div className="lg:col-span-4 p-4 rounded-xl bg-[#191C1F] border border-[#30363B] flex flex-col justify-between">
              <h3 className="text-xs font-bold text-[#F1F3F4] mb-3 flex items-center gap-2">
                <Truck className="w-4 h-4 text-[#81C784]" aria-hidden="true" />
                <span>{titles.delivery}</span>
              </h3>
              <div className="h-52 flex items-center justify-center">
                <Doughnut
                  data={deliveryData}
                  role="img"
                  aria-label={`${titles.delivery}. ${deliveryLabels.join('; ')}`}
                  options={{ responsive: true, maintainAspectRatio: false, plugins: { legend: { position: 'bottom', rtl: isAr, labels: { color: '#A3ADB5' } } } }}
                />
              </div>
              <ChartTable title={titles.delivery} labels={deliveryLabels} values={deliveryValues} suffix="%" />
            </div>

            <div className="lg:col-span-8 p-4 rounded-xl bg-[#191C1F] border border-[#30363B]">
              <h3 className="text-xs font-bold text-[#F1F3F4] mb-3 flex items-center gap-2">
                <MapPin className="w-4 h-4 text-[#78A99B]" aria-hidden="true" />
                <span>{titles.area}</span>
              </h3>
              <div className="h-60">
                <Bar data={barData(areaLabels, areaValues, isAr ? 'أسطر الطلبات' : 'Order lines')} options={barOptions}
                     role="img" aria-label={`${titles.area}. ${areaLabels.map((l, i) => `${l}: ${areaValues[i]}`).join('; ')}`} />
              </div>
              <ChartTable title={titles.area} labels={areaLabels} values={areaValues} />
            </div>
          </div>

          {/* Platform Sales */}
          <div className="p-4 rounded-xl bg-[#191C1F] border border-[#30363B]">
            <h3 className="text-xs font-bold text-[#F1F3F4] mb-3 flex items-center gap-2">
              <ShoppingCart className="w-4 h-4 text-[#78A99B]" aria-hidden="true" />
              <span>{titles.platform}</span>
            </h3>
            <div className="h-56">
              <Bar data={barData(platformLabels, platformValues, isAr ? 'قطع مباعة' : 'Items sold')} options={barOptions}
                   role="img" aria-label={`${titles.platform}. ${platformLabels.map((l, i) => `${l}: ${platformValues[i]}`).join('; ')}`} />
            </div>
            <ChartTable title={titles.platform} labels={platformLabels} values={platformValues} />
          </div>

          <CaseStudyPanel projectId="misuo-ecommerce" lang={lang} />

        </div>

      </div>
    </div>
  );
}
