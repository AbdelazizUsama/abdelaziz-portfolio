import React from 'react';
import { portfolioData } from '../data/portfolio_content';
import { Database, Users, DollarSign, PackageCheck, Zap } from 'lucide-react';

export default function MetricsOverview({ lang }) {
  const stats = portfolioData[lang].stats;
  const isAr = lang === 'ar';

  const icons = [
    <Database className="w-5 h-5 text-[#78A99B]" aria-hidden="true" />,
    <Users className="w-5 h-5 text-[#78A99B]" aria-hidden="true" />,
    <DollarSign className="w-5 h-5 text-[#78A99B]" aria-hidden="true" />,
    <PackageCheck className="w-5 h-5 text-[#78A99B]" aria-hidden="true" />
  ];

  return (
    <section id="metrics" aria-labelledby="metrics-heading" className="py-10 relative z-10 bg-[#111315]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Title */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#191C1F] border border-[#30363B] text-[#78A99B] text-xs font-semibold mb-2">
            <Zap className="w-3.5 h-3.5" aria-hidden="true" />
            <span>{isAr ? 'ملخص الأرقام والتأثير' : 'Impact Metrics'}</span>
          </div>
          <h2 id="metrics-heading" className="text-xl sm:text-2xl font-bold text-[#F1F3F4]">
            {isAr ? 'إحصائيات وقدرات معالجة البيانات' : 'Data Scale & Processing Capacity'}
          </h2>
        </div>

        {/* Stats Grid */}
        <ul className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {stats.map((stat, idx) => (
            <li
              key={idx}
              className="p-5 rounded-2xl bg-[#191C1F] border border-[#30363B] shadow-sm hover:bg-[#252A2D] hover:border-[#78A99B] transition-all"
            >
              <div className="flex items-center justify-between gap-2 mb-3">
                <span className="w-10 h-10 shrink-0 rounded-xl bg-[#202428] border border-[#30363B] flex items-center justify-center">
                  {icons[idx]}
                </span>
                <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-[#202428] text-[#A3ADB5] border border-[#30363B]">
                  {stat.suffix}
                </span>
              </div>

              <p className="text-2xl sm:text-3xl font-black text-[#F1F3F4] tracking-tight mb-1">
                {stat.value}
              </p>

              <p className="text-xs text-[#A3ADB5] font-medium">
                {stat.label}
              </p>
            </li>
          ))}
        </ul>

      </div>
    </section>
  );
}
