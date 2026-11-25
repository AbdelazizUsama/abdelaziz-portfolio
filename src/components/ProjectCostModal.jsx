import React from 'react';
import { X, Calculator, AlertTriangle, TrendingUp, Building2, Download, FileSpreadsheet } from 'lucide-react';
import costData from '../data/cost_data.json';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
} from 'chart.js';
import { Bar } from 'react-chartjs-2';
import ChartTable from './ChartTable';
import CaseStudyPanel from './CaseStudyPanel';
import useDialog from '../utils/useDialog';
import { asset, fmt, fmtDate, PRODUCT_EN } from '../utils/helpers';
import { portfolioData } from '../data/portfolio_content';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const XLSX = 'assets/Production_Order_Visual_Report.xlsx';
const compact = (v) => new Intl.NumberFormat('en', { notation: 'compact', maximumFractionDigits: 1 }).format(v);
const shorten = function (value) { const l = this.getLabelForValue(value); return l.length > 32 ? `${l.slice(0, 30)}…` : l; };

export default function ProjectCostModal({ lang, onClose }) {
  const isAr = lang === 'ar';
  const { dialogRef, closeRef } = useDialog(onClose);
  const s = costData.summary;
  const project = portfolioData[lang].projects.find((p) => p.id === 'cost-variance');
  const period = `${fmtDate(s.period_start, isAr)} – ${fmtDate(s.period_end, isAr)}`;

  // NOTE: "Quantity Produced" is UNITS, not revenue. (cost_data.json keeps the old key name `sales` for compatibility.)
  const produced = costData.top_produced_products;
  const producedLabels = produced.map((p) => (isAr ? p.name : PRODUCT_EN[p.name] || p.name));
  const producedValues = produced.map((p) => p.produced);
  const varianceLabels = costData.top_variance_products.map((p) => p.name);
  const varianceValues = costData.top_variance_products.map((p) => p.variance);
  const companyLabels = costData.company_orders.map((c) => c.company);
  const companyValues = costData.company_orders.map((c) => c.orders);

  const titles = {
    variance: isAr ? 'أكثر 10 منتجات بها انحراف في الكمية' : 'Top 10 Products by Quantity Variance',
    produced: isAr ? 'أكثر 10 منتجات من حيث الكمية المنتجة (وحدة)' : 'Top 10 Products by Quantity Produced (units)',
    companies: isAr ? `أسطر أوامر الإنتاج حسب الشركة (${s.companies_count} شركة)` : `Production-Order Lines by Company (${s.companies_count} companies)`,
  };

  const bar = (labels, values, label, color, border, horizontal) => ({
    data: { labels, datasets: [{ label, data: values, backgroundColor: color, borderColor: border, borderWidth: 1, borderRadius: 6 }] },
    options: {
      indexAxis: horizontal ? 'y' : 'x',
      responsive: true,
      maintainAspectRatio: false,
      plugins: { legend: { display: false }, tooltip: { rtl: isAr } },
      scales: horizontal
        ? { x: { ticks: { color: '#A3ADB5', callback: compact }, grid: { color: '#30363B' } }, y: { ticks: { color: '#A3ADB5', font: { size: 11 }, callback: shorten }, grid: { color: '#30363B' } } }
        : { x: { ticks: { color: '#A3ADB5' }, grid: { color: '#30363B' } }, y: { ticks: { color: '#A3ADB5', callback: compact }, grid: { color: '#30363B' } } },
    },
  });
  const varianceChart = bar(varianceLabels, varianceValues, isAr ? 'انحراف الكمية (وحدة)' : 'Quantity variance (units)', '#E57373', '#EF5350', true);
  const producedChart = bar(producedLabels, producedValues, isAr ? 'الكمية المنتجة (وحدة)' : 'Quantity produced (units)', '#81C784', '#66BB6A', true);
  const companyChart = bar(companyLabels, companyValues, isAr ? 'أسطر أوامر الإنتاج' : 'Production-order lines', '#78A99B', '#8DBBAC', false);

  const kpis = [
    { label: isAr ? 'وحدات منتجة' : 'Units produced', value: fmt(s.units_produced), color: 'text-[#78A99B]', sub: isAr ? 'وحدة' : 'Units' },
    { label: isAr ? 'انحراف الكمية الإجمالي' : 'Total quantity variance', value: fmt(s.variance_quantity), color: 'text-[#E57373]', sub: isAr ? 'وحدة (المطلوب − المنتج)' : 'Units (required − produced)' },
    { label: isAr ? 'أسطر أوامر الإنتاج' : 'Production-order lines', value: fmt(s.order_lines), color: 'text-[#F1F3F4]', sub: period },
    { label: isAr ? 'الشركات' : 'Companies', value: String(s.companies_count), color: 'text-[#F1F3F4]', sub: isAr ? 'شركة' : 'Companies' },
  ];

  const download = (cls, withIcon) => (
    <a
      href={asset(XLSX)}
      download="Production Order Visual Report.xlsx"
      className={cls}
    >
      {withIcon === 'sheet' ? <FileSpreadsheet className="w-4 h-4" aria-hidden="true" /> : <Download className="w-3.5 h-3.5" aria-hidden="true" />}
      <span>{isAr ? 'تحميل ملف Production Order Visual Report.xlsx' : 'Download Excel File'}</span>
    </a>
  );

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md overflow-y-auto"
         onMouseDown={(e) => { if (e.target === e.currentTarget) onClose(); }}>
      <div
        ref={dialogRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby="cost-modal-title"
        dir={isAr ? 'rtl' : 'ltr'}
        className="relative w-full max-w-6xl bg-[#191C1F] border border-[#30363B] rounded-2xl shadow-2xl overflow-hidden my-8 max-h-[90vh] flex flex-col text-[#F1F3F4]"
      >

        {/* Modal Header */}
        <div className="p-5 bg-[#202428] border-b border-[#30363B] flex items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 shrink-0 rounded-xl bg-[#191C1F] border border-[#30363B] flex items-center justify-center">
              <Calculator className="w-5 h-5 text-[#78A99B]" aria-hidden="true" />
            </div>
            <div>
              <h2 id="cost-modal-title" className="text-lg font-bold text-[#F1F3F4]">
                {isAr ? 'لوحة تحليل مخرجات الإنتاج وانحراف الكميات' : 'Production Output & Quantity Variance Analytics'}
              </h2>
              <p className="text-xs text-[#A3ADB5]">
                Production Order Visual Report · {period}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3 shrink-0">
            {download('hidden sm:flex items-center gap-1.5 px-3 py-2 rounded-lg bg-[#78A99B] hover:bg-[#8DBBAC] text-[#111315] text-xs font-bold transition-all', 'sheet')}

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
              src={asset('assets/dashboard_cost.jpg')}
              alt={project.imageAlt}
              className="w-full h-64 object-cover object-top opacity-95"
            />
            <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-[#111315] via-[#111315]/80 to-transparent p-4 flex justify-between items-center gap-2">
              <span className="text-xs font-semibold px-3 py-1 rounded bg-[#202428] text-[#78A99B] border border-[#30363B]">
                {isAr ? 'محاسبة التكاليف الصناعية والانحرافات' : 'Industrial Cost Accounting & Variance'}
              </span>
              {download('flex items-center gap-1.5 px-3 py-2 rounded-lg bg-[#78A99B] hover:bg-[#8DBBAC] text-[#111315] text-xs font-bold shadow-sm', 'down')}
            </div>
          </div>

          {/* Key Metrics */}
          <ul className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {kpis.map((k) => (
              <li key={k.label} className="p-3.5 rounded-xl bg-[#191C1F] border border-[#30363B] text-center">
                <p className="text-xs text-[#A3ADB5] mb-1">{k.label}</p>
                <p className={`text-2xl sm:text-3xl font-black ${k.color}`}>{k.value}</p>
                <p className="text-[11px] text-[#A3ADB5] mt-0.5">{k.sub}</p>
              </li>
            ))}
          </ul>

          {/* Charts Row 1 */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="p-4 rounded-xl bg-[#191C1F] border border-[#30363B]">
              <h3 className="text-xs font-bold text-[#F1F3F4] mb-3 flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 text-[#E57373]" aria-hidden="true" />
                <span>{titles.variance}</span>
              </h3>
              <div className="h-72">
                <Bar {...varianceChart} role="img" aria-label={`${titles.variance}. ${varianceLabels.map((l, i) => `${l}: ${fmt(varianceValues[i])}`).join('; ')}`} />
              </div>
              <ChartTable title={titles.variance} labels={varianceLabels} values={varianceValues} />
            </div>

            <div className="p-4 rounded-xl bg-[#191C1F] border border-[#30363B]">
              <h3 className="text-xs font-bold text-[#F1F3F4] mb-3 flex items-center gap-2">
                <TrendingUp className="w-4 h-4 text-[#81C784]" aria-hidden="true" />
                <span>{titles.produced}</span>
              </h3>
              <div className="h-72">
                <Bar {...producedChart} role="img" aria-label={`${titles.produced}. ${producedLabels.map((l, i) => `${l}: ${fmt(producedValues[i])}`).join('; ')}`} />
              </div>
              <ChartTable title={titles.produced} labels={producedLabels} values={producedValues} />
            </div>
          </div>

          {/* Chart Row 2 */}
          <div className="p-4 rounded-xl bg-[#191C1F] border border-[#30363B]">
            <h3 className="text-xs font-bold text-[#F1F3F4] mb-3 flex items-center gap-2">
              <Building2 className="w-4 h-4 text-[#78A99B]" aria-hidden="true" />
              <span>{titles.companies}</span>
            </h3>
            <div className="h-60">
              <Bar {...companyChart} role="img" aria-label={`${titles.companies}. ${companyLabels.map((l, i) => `${l}: ${companyValues[i]}`).join('; ')}`} />
            </div>
            <ChartTable title={titles.companies} labels={companyLabels} values={companyValues} />
          </div>

          <CaseStudyPanel projectId="cost-variance" lang={lang} />

        </div>

      </div>
    </div>
  );
}
