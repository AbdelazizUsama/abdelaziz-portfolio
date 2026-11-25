import React from 'react';
import { BarChart3, Globe, Mail, Download, Sparkles } from 'lucide-react';
import { portfolioData } from '../data/portfolio_content';
import { asset } from '../utils/helpers';

const LINKS = [
  { id: 'about', en: 'About', ar: 'نبذة عني' },
  { id: 'metrics', en: 'Metrics', ar: 'الأرقام والإنجازات' },
  { id: 'skills', en: 'Skills', ar: 'المهارات' },
  { id: 'experience', en: 'Experience', ar: 'الخبرات' },
  { id: 'education', en: 'Education', ar: 'التعليم' },
  { id: 'certifications', en: 'Certifications', ar: 'الشهادات' },
  { id: 'projects', en: 'Case Studies', ar: 'المشاريع والتحليلات' },
];

export default function Navbar({ lang, setLang, onOpenContact }) {
  const isAr = lang === 'ar';
  // "Abdelaziz Usama" / "عبدالعزيز اسامه" (first two words of the full name)
  const shortName = portfolioData[lang].personal.name.split(' ').slice(0, 2).join(' ');

  return (
    <header className="sticky top-0 z-50 bg-[#111315]/95 backdrop-blur-md border-b border-[#30363B] transition-colors duration-300">
      <nav aria-label={isAr ? 'التنقل الرئيسي' : 'Main navigation'}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16 sm:h-20 gap-3">

            {/* Logo / Name */}
            <a href="#about" className="flex items-center gap-3 min-w-0">
              <span className="w-10 h-10 shrink-0 rounded-xl bg-[#202428] border border-[#30363B] flex items-center justify-center">
                <BarChart3 className="w-5 h-5 text-[#78A99B]" aria-hidden="true" />
              </span>
              <span className="min-w-0">
                <span className="text-lg font-bold tracking-wide block text-[#F1F3F4] truncate">{shortName}</span>
                <span className="text-xs text-[#78A99B] font-semibold flex items-center gap-1">
                  <Sparkles className="w-3 h-3 inline shrink-0" aria-hidden="true" />
                  <span className="truncate">{isAr ? 'محاسب ومحلل بيانات مبتدئ' : 'Accountant & Junior Data Analyst'}</span>
                </span>
              </span>
            </a>

            {/* Navigation Links (large screens) */}
            <ul className="hidden lg:flex items-center gap-6 text-sm font-medium text-[#A3ADB5]">
              {LINKS.map((l) => (
                <li key={l.id}>
                  <a href={`#${l.id}`} className="hover:text-[#78A99B] transition-colors py-2 inline-block">
                    {isAr ? l.ar : l.en}
                  </a>
                </li>
              ))}
            </ul>

            {/* Actions: Lang switch, Download CV & Contact */}
            <div className="flex items-center gap-2 sm:gap-3 shrink-0">

              <button
                type="button"
                onClick={() => setLang(isAr ? 'en' : 'ar')}
                aria-label={isAr ? 'التبديل إلى اللغة الإنجليزية' : 'Switch language to Arabic'}
                className="flex items-center gap-1.5 px-3 py-2.5 rounded-xl bg-[#191C1F] hover:bg-[#252A2D] text-[#F1F3F4] border border-[#30363B] text-xs font-semibold transition-all"
              >
                <Globe className="w-3.5 h-3.5 text-[#78A99B]" aria-hidden="true" />
                <span lang={isAr ? 'en' : 'ar'}>{isAr ? 'English' : 'العربية'}</span>
              </button>

              <a
                href={asset('assets/Abdelaziz_Resume.pdf')}
                download="Abdelaziz Usama Mahmoud Abdelaziz Resume.pdf"
                className="hidden xl:flex items-center gap-1.5 px-3 py-2.5 rounded-xl bg-[#202428] hover:bg-[#252A2D] text-[#78A99B] border border-[#30363B] text-xs font-bold transition-all cursor-pointer"
              >
                <Download className="w-3.5 h-3.5" aria-hidden="true" />
                <span>{isAr ? 'تحميل الـ CV' : 'Download CV'}</span>
              </a>

              <button
                type="button"
                onClick={onOpenContact}
                aria-haspopup="dialog"
                className="flex items-center gap-1.5 px-3.5 py-2.5 rounded-xl bg-[#78A99B] hover:bg-[#8DBBAC] text-[#111315] text-xs font-bold shadow-sm transition-all"
              >
                <Mail className="w-3.5 h-3.5" aria-hidden="true" />
                <span>{isAr ? 'تواصل' : 'Contact'}</span>
              </button>

            </div>
          </div>
        </div>

        {/* Section links for small screens (scrolls sideways instead of hiding) */}
        <ul className="lg:hidden flex gap-5 overflow-x-auto px-4 sm:px-6 py-1 border-t border-[#30363B] text-sm font-semibold text-[#A3ADB5] whitespace-nowrap">
          {LINKS.map((l) => (
            <li key={l.id}>
              <a href={`#${l.id}`} className="hover:text-[#78A99B] py-2.5 inline-block">{isAr ? l.ar : l.en}</a>
            </li>
          ))}
        </ul>
      </nav>
    </header>
  );
}
