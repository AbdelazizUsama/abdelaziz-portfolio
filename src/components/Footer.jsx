import React from 'react';
import { BarChart3 } from 'lucide-react';
import { portfolioData } from '../data/portfolio_content';

export default function Footer({ lang }) {
  const isAr = lang === 'ar';
  const info = portfolioData[lang].personal;
  const link = 'text-[#78A99B] hover:text-[#8DBBAC] underline underline-offset-4 py-2 inline-block';
  const tab = isAr ? 'يفتح في علامة تبويب جديدة' : 'opens in a new tab';

  return (
    <footer className="bg-[#111315] border-t border-[#30363B] py-6 text-center text-xs text-[#A3ADB5]">
      <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-3">

        <div className="flex items-center gap-2">
          <BarChart3 className="w-4 h-4 text-[#78A99B]" aria-hidden="true" />
          <span className="font-bold text-[#F1F3F4]">{info.name}</span>
          <span>© {new Date().getFullYear()}</span>
        </div>

        <ul aria-label={isAr ? 'روابط التواصل' : 'Contact links'} className="flex flex-wrap justify-center gap-x-5 font-semibold">
          <li><a className={link} href={info.linkedin} target="_blank" rel="noopener noreferrer">{isAr ? 'لينكدإن' : 'LinkedIn'}<span className="sr-only"> ({tab})</span></a></li>
          <li><a className={link} href={info.github} target="_blank" rel="noopener noreferrer">{isAr ? 'جيت هاب' : 'GitHub'}<span className="sr-only"> ({tab})</span></a></li>
          <li><a className={link} href={`mailto:${info.email}`}>{isAr ? 'البريد الإلكتروني' : 'Email'}</a></li>
        </ul>

        <p className="text-[#A3ADB5]">
          {isAr ? 'معرض أعمال تحليل البيانات ومحاسبة التكاليف' : 'Data Analytics & Cost BI Portfolio'}
        </p>

      </div>
    </footer>
  );
}
