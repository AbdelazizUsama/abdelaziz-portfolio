import React from 'react';
import { portfolioData } from '../data/portfolio_content';
import { Cpu, Calculator, Truck, Landmark, CheckCircle2 } from 'lucide-react';

export default function SkillsSection({ lang }) {
  const skillGroups = portfolioData[lang].skills;
  const isAr = lang === 'ar';

  const groupIcons = [Cpu, Calculator, Truck, Landmark];

  return (
    <section id="skills" aria-labelledby="skills-heading" className="py-14 relative z-10 bg-[#111315] border-y border-[#30363B]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-10">
          <span className="px-3.5 py-1 rounded-full bg-[#191C1F] border border-[#30363B] text-[#78A99B] text-xs font-semibold mb-2 inline-block">
            {isAr ? 'الخبرات الفنية والمحاسبية' : 'Core Capabilities'}
          </span>
          <h2 id="skills-heading" className="text-2xl font-extrabold text-[#F1F3F4] mb-2">
            {isAr ? 'المهارات التقنية والتحليلية والمحاسبية' : 'Technical, Financial & Analytical Skills'}
          </h2>
          <p className="text-[#A3ADB5] text-xs sm:text-sm">
            {isAr
              ? 'مزيج يجمع بين الدقة المحاسبية لتكاليف الإنتاج وأدوات تحليل البيانات.'
              : 'A mix of manufacturing cost accounting precision and data analytics tools.'}
          </p>
        </div>

        {/* Skill Category Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {skillGroups.map((group, idx) => {
            const Icon = groupIcons[idx] || Cpu;
            return (
              <div
                key={idx}
                className="p-5 rounded-2xl bg-[#191C1F] border border-[#30363B] shadow-sm hover:border-[#78A99B] transition-all"
              >
                <div className="flex items-center gap-3 mb-4 pb-3 border-b border-[#30363B]">
                  <div className="w-9 h-9 shrink-0 rounded-xl bg-[#202428] border border-[#30363B] flex items-center justify-center">
                    <Icon className="w-5 h-5 text-[#78A99B]" aria-hidden="true" />
                  </div>
                  <h3 className="text-sm font-bold text-[#F1F3F4]">
                    {group.category}
                  </h3>
                </div>

                {/* Items List (no self-assigned "Expert" level: levels are for the reader to judge) */}
                <ul className="space-y-2.5">
                  {group.items.map((item, i) => (
                    <li key={i} className="flex items-center gap-2 p-2.5 rounded-xl bg-[#202428] border border-[#30363B]">
                      <CheckCircle2 className="w-3.5 h-3.5 text-[#78A99B] flex-shrink-0" aria-hidden="true" />
                      <span className="text-xs font-semibold text-[#F1F3F4]">{item}</span>
                    </li>
                  ))}
                </ul>

              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
}
