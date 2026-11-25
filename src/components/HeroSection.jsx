import React from 'react';
import { portfolioData } from '../data/portfolio_content';
import { asset } from '../utils/helpers';
import { TrendingUp, Database, FileSpreadsheet, Award, ChevronRight, Mail, MapPin, Download, Linkedin, Github } from 'lucide-react';

export default function HeroSection({ lang, onExploreProjects, onOpenContact }) {
  const content = portfolioData[lang].personal;
  const isAr = lang === 'ar';

  const pill = 'px-3 py-1.5 rounded-lg bg-[#191C1F] border border-[#30363B] text-xs font-semibold text-[#F1F3F4] flex items-center gap-1.5';
  const social = 'px-4 py-2.5 rounded-xl bg-[#191C1F] hover:bg-[#252A2D] border border-[#30363B] text-[#F1F3F4] font-semibold text-xs sm:text-sm flex items-center gap-2 transition-all';

  return (
    <section id="about" aria-labelledby="hero-heading" className="relative pt-8 pb-16 overflow-hidden bg-[#111315]">

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">

          {/* Text Column */}
          <div className="lg:col-span-8 text-start">

            {/* Status Badge */}
            <p className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#191C1F] border border-[#30363B] text-[#78A99B] text-xs font-semibold mb-4">
              <span className="w-2 h-2 rounded-full bg-[#78A99B]" aria-hidden="true" />
              <span>{isAr ? 'متاح لوظائف محلل بيانات مبتدئ والمحاسبة' : 'Open to Junior Data Analyst & Accounting Roles'}</span>
            </p>

            {/* Main Name */}
            <h1 id="hero-heading" className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight mb-3 text-[#F1F3F4] leading-tight">
              {content.name}
            </h1>

            {/* Role Title */}
            <p className="text-lg sm:text-2xl font-bold text-[#78A99B] mb-4 leading-snug">
              {content.title}
            </p>

            {/* Description */}
            <p className="text-[#A3ADB5] text-sm sm:text-base leading-relaxed mb-6 max-w-3xl font-normal">
              {content.bio}
            </p>

            {/* Skill Pills */}
            <ul className="flex flex-wrap gap-2 mb-8">
              <li className={pill}>
                <FileSpreadsheet className="w-3.5 h-3.5 text-[#78A99B]" aria-hidden="true" />
                Excel Dashboards & Visual Reports
              </li>
              <li className={pill}>
                <TrendingUp className="w-3.5 h-3.5 text-[#78A99B]" aria-hidden="true" />
                Power BI & DAX
              </li>
              <li className={pill}>
                <Database className="w-3.5 h-3.5 text-[#78A99B]" aria-hidden="true" />
                Python & SQL Analytics
              </li>
              <li className={pill}>
                <Award className="w-3.5 h-3.5 text-[#78A99B]" aria-hidden="true" />
                Cost Variance Analysis
              </li>
            </ul>

            {/* Action CTAs */}
            <div className="flex flex-wrap items-center gap-3">

              <button
                type="button"
                onClick={onExploreProjects}
                className="px-5 py-3 rounded-xl bg-[#78A99B] hover:bg-[#8DBBAC] text-[#111315] font-bold text-xs sm:text-sm flex items-center gap-2 transition-all cursor-pointer shadow-sm"
              >
                <span>{isAr ? 'استكشف دراسات الحالة' : 'Explore Case Studies'}</span>
                <ChevronRight className={`w-4 h-4 ${isAr ? 'rotate-180' : ''}`} aria-hidden="true" />
              </button>

              <a
                href={asset('assets/Abdelaziz_Resume.pdf')}
                download="Abdelaziz Usama Mahmoud Abdelaziz Resume.pdf"
                className="px-5 py-3 rounded-xl bg-[#202428] hover:bg-[#252A2D] text-[#F1F3F4] border border-[#30363B] font-bold text-xs sm:text-sm flex items-center gap-2 transition-all cursor-pointer"
              >
                <Download className="w-4 h-4 text-[#78A99B]" aria-hidden="true" />
                <span>{isAr ? 'تحميل السيرة الذاتية (CV PDF)' : 'Download Resume (PDF)'}</span>
              </a>

              <button
                type="button"
                onClick={onOpenContact}
                aria-haspopup="dialog"
                className="px-5 py-3 rounded-xl bg-[#191C1F] hover:bg-[#252A2D] text-[#A3ADB5] hover:text-[#F1F3F4] font-semibold text-xs sm:text-sm border border-[#30363B] flex items-center gap-2 transition-all cursor-pointer"
              >
                <Mail className="w-4 h-4 text-[#78A99B]" aria-hidden="true" />
                <span>{isAr ? 'تواصل معي مباشرة' : 'Get In Touch'}</span>
              </button>
            </div>

            {/* LinkedIn / GitHub / Email together, with visible text */}
            <ul aria-label={isAr ? 'روابط التواصل' : 'Contact links'} className="flex flex-wrap items-center gap-3 mt-4">
              <li>
                <a href={content.linkedin} target="_blank" rel="noopener noreferrer" className={social}>
                  <Linkedin className="w-4 h-4 text-[#78A99B]" aria-hidden="true" />
                  <span>{isAr ? 'لينكدإن' : 'LinkedIn'}<span className="sr-only"> ({isAr ? 'يفتح في علامة تبويب جديدة' : 'opens in a new tab'})</span></span>
                </a>
              </li>
              <li>
                <a href={content.github} target="_blank" rel="noopener noreferrer" className={social}>
                  <Github className="w-4 h-4 text-[#78A99B]" aria-hidden="true" />
                  <span>{isAr ? 'جيت هاب' : 'GitHub'}<span className="sr-only"> ({isAr ? 'يفتح في علامة تبويب جديدة' : 'opens in a new tab'})</span></span>
                </a>
              </li>
              <li>
                <a href={`mailto:${content.email}`} className={social}>
                  <Mail className="w-4 h-4 text-[#78A99B]" aria-hidden="true" />
                  <span>{isAr ? 'البريد الإلكتروني' : 'Email'}</span>
                </a>
              </li>
            </ul>

            {/* Location */}
            <p className="mt-6 flex flex-wrap items-center gap-2 text-xs font-medium text-[#A3ADB5]">
              <MapPin className="w-3.5 h-3.5 text-[#78A99B]" aria-hidden="true" />
              <span>{content.location}</span>
              <span aria-hidden="true">•</span>
              <span>{isAr ? 'تحليلات التصنيع والألعاب والتجارة الإلكترونية والمبيعات' : 'Manufacturing, Gaming, E-Commerce & Sales Analytics'}</span>
            </p>

          </div>

          {/* Profile Image - Refined & Minimal */}
          <div className="lg:col-span-4 flex justify-center">
            <div className="relative group w-52 sm:w-60 lg:w-64">

              <div className="rounded-2xl bg-[#191C1F] p-2 border border-[#30363B] shadow-lg overflow-hidden">
                <img
                  src={asset('assets/profile.jpg')}
                  alt={isAr ? `صورة شخصية لـ ${content.name}` : `Portrait of ${content.name}`}
                  className="w-full h-[260px] sm:h-[300px] object-cover rounded-xl transition-transform duration-500 group-hover:scale-105"
                />

                <div className="mt-2 p-2.5 rounded-lg bg-[#202428] text-center border border-[#30363B]">
                  <p className="text-[11px] text-[#78A99B] font-bold uppercase tracking-wider">
                    {isAr ? 'التخصص الرئيسي' : 'Specialization'}
                  </p>
                  <p className="text-xs font-bold text-[#F1F3F4]">
                    {isAr ? 'تحليل التكاليف والذكاء التجاري' : 'Cost & BI Analytics'}
                  </p>
                </div>
              </div>

            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
