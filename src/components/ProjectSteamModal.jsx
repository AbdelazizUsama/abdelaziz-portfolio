import React, { useState } from 'react';
import { X, Search, Gamepad2, ThumbsUp, Download, FileSpreadsheet } from 'lucide-react';
import steamData from '../data/steam_data.json';
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
import { asset, fmt } from '../utils/helpers';
import { portfolioData } from '../data/portfolio_content';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend, ArcElement);

const XLSX = 'assets/Database.xlsx'; // was /assets/Database_Steam_Games.xlsx, which does not exist
const compact = (v) => new Intl.NumberFormat('en', { notation: 'compact', maximumFractionDigits: 1 }).format(v);

export default function ProjectSteamModal({ lang, onClose }) {
  const isAr = lang === 'ar';
  const { dialogRef, closeRef } = useDialog(onClose);
  const [searchTerm, setSearchTerm] = useState('');
  const [freeFilter, setFreeFilter] = useState('all');
  const project = portfolioData[lang].projects.find((p) => p.id === 'steam-analytics');

  const posPct = steamData.pos_ratio.toFixed(1);
  const negPct = steamData.neg_ratio.toFixed(1);

  const ccuLabels = steamData.top_ccu.map((g) => g.name);
  const ccuValues = steamData.top_ccu.map((g) => g.ccu);
  const ccuTitle = isAr ? 'أعلى 10 ألعاب جذباً للاعبين المتزامنين (CCU)' : 'Top 10 Games by Concurrent Players (CCU)';

  const sentimentLabels = [
    isAr ? `تقييمات إيجابية (${posPct}%)` : `Positive Reviews (${posPct}%)`,
    isAr ? `تقييمات سلبية (${negPct}%)` : `Negative Reviews (${negPct}%)`,
  ];
  const sentimentValues = [steamData.total_positive, steamData.total_negative];
  const sentimentTitle = isAr ? 'نسبة انطباعات التقييمات' : 'Review Sentiment Ratio';

  const topCcuData = {
    labels: ccuLabels,
    datasets: [{
      label: isAr ? 'عدد اللاعبين المتزامنين (CCU)' : 'Concurrent Players (CCU)',
      data: ccuValues,
      backgroundColor: '#78A99B',
      borderColor: '#8DBBAC',
      borderWidth: 1,
      borderRadius: 6
    }]
  };
  const sentimentData = { labels: sentimentLabels, datasets: [{ data: sentimentValues, backgroundColor: ['#81C784', '#E57373'], borderWidth: 0 }] };

  const filteredGames = steamData.sample_games.filter((g) => {
    const matchesSearch = g.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          g.developer.toLowerCase().includes(searchTerm.toLowerCase());
    if (freeFilter === 'free') return matchesSearch && g.is_free;
    if (freeFilter === 'paid') return matchesSearch && !g.is_free;
    return matchesSearch;
  });

  const kpis = [
    { label: isAr ? 'إجمالي الألعاب' : 'Total Games', value: fmt(steamData.total_games), color: 'text-[#F1F3F4]' },
    { label: isAr ? 'لاعبين متزامنين (CCU)' : 'Total CCU', value: fmt(steamData.total_ccu), color: 'text-[#78A99B]' },
    { label: isAr ? 'التقييمات الإيجابية' : 'Positive Ratio', value: `${posPct}%`, color: 'text-[#81C784]' },
    // Mean age RATING of the titles that have one (869 of 22,521). Not the players' age.
    {
      label: isAr ? 'متوسط التصنيف العمري (للألعاب المصنفة)' : 'Avg. age rating (rated titles)',
      value: steamData.avg_required_age_rated.toFixed(1),
      color: 'text-[#F1F3F4]',
      sub: isAr ? `${fmt(steamData.rated_titles)} لعبة مصنفة` : `${fmt(steamData.rated_titles)} rated titles`,
    },
  ];

  const downloadBtn = (cls, icon) => (
    <a href={asset(XLSX)} download="Database.xlsx" className={cls}>
      {icon === 'sheet' ? <FileSpreadsheet className="w-4 h-4" aria-hidden="true" /> : <Download className="w-3.5 h-3.5" aria-hidden="true" />}
      <span>{icon === 'sheet' ? (isAr ? 'تحميل ملف Database.xlsx' : 'Download Database.xlsx') : (isAr ? 'تحميل ملف Excel المصدر' : 'Download Excel')}</span>
    </a>
  );

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md overflow-y-auto"
         onMouseDown={(e) => { if (e.target === e.currentTarget) onClose(); }}>
      <div
        ref={dialogRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby="steam-modal-title"
        dir={isAr ? 'rtl' : 'ltr'}
        className="relative w-full max-w-6xl bg-[#191C1F] border border-[#30363B] rounded-2xl shadow-2xl overflow-hidden my-8 max-h-[90vh] flex flex-col text-[#F1F3F4]"
      >

        {/* Modal Header */}
        <div className="p-5 bg-[#202428] border-b border-[#30363B] flex items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 shrink-0 rounded-xl bg-[#191C1F] border border-[#30363B] flex items-center justify-center">
              <Gamepad2 className="w-5 h-5 text-[#78A99B]" aria-hidden="true" />
            </div>
            <div>
              <h2 id="steam-modal-title" className="text-lg font-bold text-[#F1F3F4]">
                {isAr ? 'تحليل سوق الألعاب العالمي على منصة Steam' : 'Steam Games Global Market Analytics'}
              </h2>
              <p className="text-xs text-[#A3ADB5]">
                {isAr
                  ? `دراسة وإحصائيات ${fmt(steamData.total_games)} لعبة و ${fmt(steamData.total_ccu)} لاعب متزامن`
                  : `Study of ${fmt(steamData.total_games)} titles & ${fmt(steamData.total_ccu)} concurrent players`}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3 shrink-0">
            {downloadBtn('hidden sm:flex items-center gap-1.5 px-3 py-2 rounded-lg bg-[#78A99B] hover:bg-[#8DBBAC] text-[#111315] text-xs font-bold transition-all', 'sheet')}

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

        {/* Modal Content */}
        <div className="p-6 space-y-6 overflow-y-auto custom-scrollbar flex-1 bg-[#111315]">

          {/* Snapshot */}
          <div className="relative rounded-xl overflow-hidden border border-[#30363B] bg-[#191C1F]">
            <img
              src={asset('assets/dashboard_steam.jpg')}
              alt={project.imageAlt}
              className="w-full h-64 object-cover object-top opacity-95"
            />
            <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-[#111315] via-[#111315]/80 to-transparent p-4 flex justify-between items-center gap-2">
              <span className="text-xs font-semibold px-3 py-1 rounded bg-[#202428] text-[#78A99B] border border-[#30363B]">
                {isAr ? 'صورة لوحة إكسيل الأصلية' : 'Original Excel Dashboard Snapshot'}
              </span>
              {downloadBtn('flex items-center gap-1.5 px-3 py-2 rounded-lg bg-[#78A99B] hover:bg-[#8DBBAC] text-[#111315] text-xs font-bold shadow-sm', 'down')}
            </div>
          </div>

          {/* Key Metrics */}
          <ul className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {kpis.map((k) => (
              <li key={k.label} className="p-3.5 rounded-xl bg-[#191C1F] border border-[#30363B] text-center">
                <p className="text-xs text-[#A3ADB5] mb-1">{k.label}</p>
                <p className={`text-2xl font-black ${k.color}`}>{k.value}</p>
                {k.sub ? <p className="text-[11px] text-[#A3ADB5] mt-0.5">{k.sub}</p> : null}
              </li>
            ))}
          </ul>

          {/* Charts */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            <div className="lg:col-span-8 p-4 rounded-xl bg-[#191C1F] border border-[#30363B]">
              <h3 className="text-xs font-bold text-[#F1F3F4] mb-3 flex items-center gap-2">
                <Gamepad2 className="w-4 h-4 text-[#78A99B]" aria-hidden="true" />
                <span>{ccuTitle}</span>
              </h3>
              <div className="h-72">
                <Bar
                  data={topCcuData}
                  role="img"
                  aria-label={`${ccuTitle}. ${ccuLabels.map((l, i) => `${l}: ${fmt(ccuValues[i])}`).join('; ')}`}
                  options={{
                    indexAxis: 'y',
                    responsive: true,
                    maintainAspectRatio: false,
                    plugins: { legend: { display: false }, tooltip: { rtl: isAr } },
                    scales: {
                      x: { ticks: { color: '#A3ADB5', callback: compact }, grid: { color: '#30363B' } },
                      y: { ticks: { color: '#A3ADB5', font: { size: 11 }, callback: function (v) { const l = this.getLabelForValue(v); return l.length > 26 ? `${l.slice(0, 24)}…` : l; } }, grid: { color: '#30363B' } }
                    }
                  }}
                />
              </div>
              <ChartTable title={ccuTitle} labels={ccuLabels} values={ccuValues} />
            </div>

            <div className="lg:col-span-4 p-4 rounded-xl bg-[#191C1F] border border-[#30363B] flex flex-col justify-between">
              <h3 className="text-xs font-bold text-[#F1F3F4] mb-3 flex items-center gap-2">
                <ThumbsUp className="w-4 h-4 text-[#81C784]" aria-hidden="true" />
                <span>{sentimentTitle}</span>
              </h3>
              <div className="h-52 flex items-center justify-center">
                <Doughnut
                  data={sentimentData}
                  role="img"
                  aria-label={`${sentimentTitle}. ${sentimentLabels.join('; ')}`}
                  options={{ responsive: true, maintainAspectRatio: false, plugins: { legend: { position: 'bottom', rtl: isAr, labels: { color: '#A3ADB5' } } } }}
                />
              </div>
              <ChartTable title={sentimentTitle} labels={sentimentLabels} values={sentimentValues} />
            </div>
          </div>

          {/* Table */}
          <div className="p-4 rounded-xl bg-[#191C1F] border border-[#30363B]">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-3">
              <div>
                <h3 className="text-xs font-bold text-[#F1F3F4] flex items-center gap-2">
                  <Search className="w-4 h-4 text-[#78A99B]" aria-hidden="true" />
                  <span>{isAr ? 'مستكشف بيانات الألعاب (عيّنة من 50 لعبة)' : 'Games Explorer (sample of 50 titles)'}</span>
                </h3>
              </div>

              <div className="flex items-center gap-2">
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  aria-label={isAr ? 'ابحث باسم اللعبة أو المطور' : 'Search by title or developer'}
                  placeholder={isAr ? 'ابحث باسم اللعبة...' : 'Search title...'}
                  className="px-3 py-2 rounded-lg bg-[#202428] border border-[#30363B] text-xs text-[#F1F3F4] placeholder-[#A3ADB5] focus:border-[#78A99B]"
                />

                <select
                  value={freeFilter}
                  onChange={(e) => setFreeFilter(e.target.value)}
                  aria-label={isAr ? 'تصفية حسب السعر' : 'Filter by price'}
                  className="px-3 py-2 rounded-lg bg-[#202428] border border-[#30363B] text-xs text-[#F1F3F4] focus:border-[#78A99B]"
                >
                  <option value="all">{isAr ? 'الكل' : 'All'}</option>
                  <option value="free">{isAr ? 'مجاني' : 'Free'}</option>
                  <option value="paid">{isAr ? 'مدفوع' : 'Paid'}</option>
                </select>
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-start text-xs text-[#A3ADB5]">
                <caption className="sr-only">{isAr ? 'عيّنة من الألعاب مع المطور واللاعبين المتزامنين والسعر' : 'Sample of games with developer, concurrent players and price'}</caption>
                <thead className="bg-[#202428] text-[#F1F3F4] text-[11px]">
                  <tr>
                    <th scope="col" className="px-3 py-2 text-start">{isAr ? 'اسم اللعبة' : 'Title'}</th>
                    <th scope="col" className="px-3 py-2 text-start">{isAr ? 'المطور' : 'Developer'}</th>
                    <th scope="col" className="px-3 py-2 text-start">{isAr ? 'اللاعبين (CCU)' : 'CCU'}</th>
                    <th scope="col" className="px-3 py-2 text-start">{isAr ? 'السعر' : 'Price'}</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#30363B]">
                  {filteredGames.slice(0, 10).map((game, i) => (
                    <tr key={i} className="hover:bg-[#252A2D] transition-colors">
                      <td className="px-3 py-2 font-bold text-[#F1F3F4]">{game.name}</td>
                      <td className="px-3 py-2 text-[#A3ADB5]">{game.developer}</td>
                      <td className="px-3 py-2 font-semibold text-[#78A99B]">{game.ccu.toLocaleString()}</td>
                      <td className="px-3 py-2">
                        {game.is_free ? (
                          <span className="px-2 py-0.5 rounded bg-[#202428] text-[#81C784] font-bold border border-[#30363B]">{isAr ? 'مجاني' : 'FREE'}</span>
                        ) : (
                          <span className="font-mono font-bold text-[#F1F3F4]">${(game.price / 100).toFixed(2)}</span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

          </div>

          <CaseStudyPanel projectId="steam-analytics" lang={lang} />

        </div>

      </div>
    </div>
  );
}
