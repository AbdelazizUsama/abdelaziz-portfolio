import React, { useEffect, useRef } from 'react';
import { Line, Bar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Tooltip,
  Legend,
} from 'chart.js';
import { X } from 'lucide-react';
import { portfolioData } from '../data/portfolio_content';
import salesData from '../data/sales_data.json';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, BarElement, Tooltip, Legend);

const fmt = (n) => Number(n).toLocaleString('en-US');

const MONTHS = {
  en: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
  ar: ['يناير', 'فبراير', 'مارس', 'أبريل', 'مايو', 'يونيو', 'يوليو', 'أغسطس', 'سبتمبر', 'أكتوبر', 'نوفمبر', 'ديسمبر'],
};

// English labels for the Arabic customer categories in the export
const GROUP_EN = {
  'عملاء اللوجيستي': 'Logistics customers',
  'عملاء التصنيع الخارجي': 'External manufacturing customers',
  'عملاء فرع القطيف': 'Qatif branch customers',
  'عملاء فرع عنك': 'Anak branch customers',
  'عملاء التصنيع': 'Manufacturing customers',
  'تجاري': 'Commercial',
  'عملاء فرع الدوحه': 'Doha branch customers',
};

const T = {
  en: {
    eyebrow: 'Sales Analytics',
    title: 'Overall Sales Analysis 2026',
    close: 'Close dialog',
    kpis: ['Total sales (incl. tax)', 'Invoices', 'Customers', 'Top customer share'],
    monthly: 'Total Sales by Month, 2026',
    groups: 'Sales by Customer Category',
    series: 'Total sales',
    caseStudy: 'Case study',
    rows: { problem: 'Business question', dataSource: 'Data source', period: 'Time period', tools: 'Tools used', methods: 'Methods', outcome: 'Outcome / recommendation' },
    findings: 'Key findings',
    dataset: 'Dataset available on request (it contains customer-level invoice data).',
  },
  ar: {
    eyebrow: 'تحليلات المبيعات',
    title: 'تحليل المبيعات الإجمالي 2026',
    close: 'إغلاق النافذة',
    kpis: ['إجمالي المبيعات (شاملاً الضريبة)', 'الفواتير', 'العملاء', 'حصة أكبر عميل'],
    monthly: 'إجمالي المبيعات الشهرية 2026',
    groups: 'المبيعات حسب فئة العملاء',
    series: 'إجمالي المبيعات',
    caseStudy: 'دراسة الحالة',
    rows: { problem: 'السؤال التجاري أو المشكلة', dataSource: 'مصدر البيانات', period: 'الفترة الزمنية', tools: 'الأدوات المستخدمة', methods: 'المنهجية', outcome: 'النتيجة / التوصية' },
    findings: 'أبرز النتائج',
    dataset: 'ملف البيانات متاح عند الطلب (يحتوي على فواتير بمستوى العميل).',
  },
};

// Hide "[Add ...]" placeholders on the public page; a row with nothing real left is left out.
const clean = (s) => String(s || '').replace(/\s*\[[^\]]*\]/g, '').trim();

const ACCENT = '#78A99B';

export default function ProjectSalesModal({ lang = 'en', onClose }) {
  const isAr = lang === 'ar';
  const t = T[lang];
  const project = portfolioData[lang].projects.find((p) => p.id === 'sales-analysis');
  const s = salesData.summary;
  const dialogRef = useRef(null);
  const closeRef = useRef(null);
  const onCloseRef = useRef(onClose);
  onCloseRef.current = onClose;

  // Keyboard access: focus the dialog, trap Tab, close on Escape, restore focus afterwards
  useEffect(() => {
    const previous = document.activeElement;
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    if (closeRef.current) closeRef.current.focus();

    const onKey = (e) => {
      if (e.key === 'Escape') { e.preventDefault(); onCloseRef.current(); return; }
      if (e.key !== 'Tab' || !dialogRef.current) return;
      const focusable = dialogRef.current.querySelectorAll('a[href], button:not([disabled]), [tabindex]:not([tabindex="-1"])');
      if (!focusable.length) return;
      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
      else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
    };
    document.addEventListener('keydown', onKey);
    return () => {
      document.removeEventListener('keydown', onKey);
      document.body.style.overflow = prevOverflow;
      if (previous && previous.focus) previous.focus();
    };
  }, []);

  const kpiValues = [fmt(Math.round(s.total)), fmt(s.invoices), fmt(s.customers), `${s.top_customer_share}%`];

  const monthLabels = salesData.by_month.map((_, i) => MONTHS[lang][i]);
  const monthValues = salesData.by_month.map((v) => Math.round(v));
  const groupLabels = salesData.by_customer_group.map((g) => (isAr ? g.name : GROUP_EN[g.name] || g.name));
  const groupValues = salesData.by_customer_group.map((g) => Math.round(g.total));

  const axis = { ticks: { color: '#A3ADB5', font: { size: 11 } }, grid: { color: '#30363B' } };
  const compact = (v) => new Intl.NumberFormat('en', { notation: 'compact', maximumFractionDigits: 1 }).format(v);
  const common = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: { legend: { display: false }, tooltip: { rtl: isAr } },
  };
  const lineData = {
    labels: monthLabels,
    datasets: [{ label: t.series, data: monthValues, borderColor: ACCENT, backgroundColor: ACCENT, tension: 0.3, pointRadius: 3, fill: false }],
  };
  const barData = {
    labels: groupLabels,
    datasets: [{ label: t.series, data: groupValues, backgroundColor: ACCENT, borderRadius: 6 }],
  };

  const cs = project.caseStudy;
  const rows = ['problem', 'dataSource', 'period', 'tools', 'methods', 'outcome']
    .map((key) => ({ key, text: clean(cs[key]) }))
    .filter((r) => r.text);

  const ChartTable = ({ title, labels, values }) => (
    <table className="sr-only">
      <caption>{title}</caption>
      <tbody>
        {labels.map((l, i) => (
          <tr key={l}><th scope="row">{l}</th><td>{fmt(values[i])}</td></tr>
        ))}
      </tbody>
    </table>
  );

  return (
    <div
      className="fixed inset-0 z-50 flex items-start justify-center p-4 bg-black/70 backdrop-blur-md overflow-y-auto"
      onMouseDown={(e) => { if (e.target === e.currentTarget) onClose(); }}
    >
      <div
        ref={dialogRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby="sales-modal-title"
        dir={isAr ? 'rtl' : 'ltr'}
        className="relative w-full max-w-4xl bg-[#191C1F] border border-[#30363B] rounded-3xl p-5 sm:p-6 space-y-6 shadow-2xl my-8 text-[#F1F3F4]"
      >
        {/* Header */}
        <div className="flex justify-between items-start gap-4 border-b border-[#30363B] pb-4">
          <div>
            <p className="text-xs font-bold text-[#78A99B]">{t.eyebrow}</p>
            <h2 id="sales-modal-title" className="text-lg sm:text-xl font-extrabold">{t.title}</h2>
          </div>
          <button
            ref={closeRef}
            type="button"
            onClick={onClose}
            aria-label={t.close}
            className="shrink-0 w-10 h-10 rounded-full bg-[#111315] border border-[#30363B] text-[#A3ADB5] hover:text-[#F1F3F4] flex items-center justify-center"
          >
            <X className="w-4 h-4" aria-hidden="true" />
          </button>
        </div>

        {/* KPIs */}
        <ul className="grid grid-cols-2 lg:grid-cols-4 gap-3">
          {kpiValues.map((value, i) => (
            <li key={i} className="p-3 rounded-2xl bg-[#111315] border border-[#30363B] text-center">
              <span className="block text-xl font-black text-[#78A99B]">{value}</span>
              <span className="block text-xs text-[#A3ADB5]">{t.kpis[i]}</span>
            </li>
          ))}
        </ul>

        {/* Charts */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="p-4 rounded-2xl bg-[#111315] border border-[#30363B] space-y-2">
            <h3 className="text-sm font-bold text-[#78A99B]">{t.monthly}</h3>
            <div className="relative h-64">
              <Line
                data={lineData}
                aria-label={`${t.monthly}. ${monthLabels.map((l, i) => `${l}: ${fmt(monthValues[i])}`).join('; ')}`}
                role="img"
                options={{ ...common, scales: { x: axis, y: { ...axis, ticks: { ...axis.ticks, callback: compact } } } }}
              />
            </div>
            <ChartTable title={t.monthly} labels={monthLabels} values={monthValues} />
          </div>

          <div className="p-4 rounded-2xl bg-[#111315] border border-[#30363B] space-y-2">
            <h3 className="text-sm font-bold text-[#78A99B]">{t.groups}</h3>
            <div className="relative h-64">
              <Bar
                data={barData}
                aria-label={`${t.groups}. ${groupLabels.map((l, i) => `${l}: ${fmt(groupValues[i])}`).join('; ')}`}
                role="img"
                options={{
                  ...common,
                  indexAxis: 'y',
                  scales: {
                    x: { ...axis, ticks: { ...axis.ticks, callback: compact } },
                    y: { ...axis, ticks: { ...axis.ticks, callback: function (v) { const l = this.getLabelForValue(v); return l.length > 28 ? l.slice(0, 26) + '…' : l; } } },
                  },
                }}
              />
            </div>
            <ChartTable title={t.groups} labels={groupLabels} values={groupValues} />
          </div>
        </div>

        {/* Case study */}
        <section aria-labelledby="sales-cs-title" className="space-y-3">
          <h3 id="sales-cs-title" className="text-base font-extrabold">{t.caseStudy}</h3>
          <dl className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {rows.map((r) => (
              <div key={r.key} className={`p-4 rounded-2xl bg-[#111315] border border-[#30363B] space-y-1.5 ${['problem', 'outcome'].includes(r.key) ? 'md:col-span-2' : ''}`}>
                <dt className="text-xs font-extrabold text-[#78A99B]">{t.rows[r.key]}</dt>
                <dd className="text-sm leading-relaxed">{r.text}</dd>
              </div>
            ))}
            <div className="p-4 rounded-2xl bg-[#111315] border border-[#30363B] space-y-1.5 md:col-span-2">
              <dt className="text-xs font-extrabold text-[#78A99B]">{t.findings}</dt>
              <dd>
                <ul className="space-y-1.5 text-sm">
                  {project.highlights.map((h, i) => (
                    <li key={i} className="flex items-start gap-2">
                      <span aria-hidden="true" className="text-[#78A99B] font-bold">✓</span>
                      <span>{h}</span>
                    </li>
                  ))}
                </ul>
              </dd>
            </div>
          </dl>
        </section>

        <p className="text-xs text-[#A3ADB5]">{t.dataset}</p>
      </div>
    </div>
  );
}
