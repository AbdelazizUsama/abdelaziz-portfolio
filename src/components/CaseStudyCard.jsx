import React from 'react';
import { CheckCircle2, BarChart2, FileSpreadsheet, Lock } from 'lucide-react';
import { asset } from '../utils/helpers';

export default function CaseStudyCard({ project, lang, onOpenModal }) {
  const isAr = lang === 'ar';
  // Dataset: a real download only when the project has a file path. Workbooks with customers' personal /
  // confidential data have excelPath "" + datasetOnRequest, so visitors are sent to the contact form instead.
  const hasDownload = Boolean(project.excelPath);

  return (
    <article className="rounded-2xl bg-[#191C1F] border border-[#30363B] overflow-hidden flex flex-col group hover:bg-[#252A2D] hover:border-[#78A99B] transition-all duration-300 shadow-md">

      {/* Image Container */}
      <div className="relative h-56 overflow-hidden bg-[#111315]">
        <img
          src={asset(project.image)}
          alt={project.imageAlt || project.title}
          loading="lazy"
          className="w-full h-full object-cover object-top transition-transform duration-500 group-hover:scale-105 opacity-90 group-hover:opacity-100"
        />

        {/* Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#191C1F] via-[#191C1F]/20 to-transparent" aria-hidden="true" />

        {/* Badge */}
        <div className="absolute top-3 end-3 flex items-center gap-1.5">
          <span className="px-2.5 py-1 rounded-lg bg-[#202428]/95 text-[#78A99B] border border-[#30363B] text-xs font-semibold">
            {project.badge}
          </span>
        </div>

        {/* Title Overlay */}
        <div className="absolute bottom-3 start-3 end-3">
          <span className="text-[11px] font-semibold text-[#A3ADB5] uppercase tracking-wider block mb-0.5">
            {project.category}
          </span>
          <h3 className="text-base font-bold text-[#F1F3F4] leading-snug">
            {project.title}
          </h3>
        </div>
      </div>

      {/* Card Body */}
      <div className="p-5 flex-1 flex flex-col justify-between space-y-4">

        <p className="text-[#A3ADB5] text-xs leading-relaxed font-normal">
          {project.description}
        </p>

        {/* Highlights (first two; the full list is in the case study) */}
        <ul className="space-y-1.5">
          {project.highlights.slice(0, 2).map((item, i) => (
            <li key={i} className="flex items-start gap-2 text-xs text-[#A3ADB5]">
              <CheckCircle2 className="w-3.5 h-3.5 text-[#78A99B] flex-shrink-0 mt-0.5" aria-hidden="true" />
              <span>{item}</span>
            </li>
          ))}
        </ul>

        {/* Action Buttons */}
        <div className="pt-3 border-t border-[#30363B] flex items-center gap-2">

          <button
            type="button"
            onClick={() => onOpenModal(project.id)}
            aria-haspopup="dialog"
            className="flex-1 py-2.5 px-3 rounded-xl bg-[#78A99B] hover:bg-[#8DBBAC] text-[#111315] font-bold text-xs flex items-center justify-center gap-1.5 transition-all shadow-sm cursor-pointer"
          >
            <BarChart2 className="w-4 h-4 text-[#111315]" aria-hidden="true" />
            <span>
              {isAr ? 'دراسة الحالة والرسوم' : 'Case Study & Charts'}
              <span className="sr-only">: {project.title}</span>
            </span>
          </button>

          {hasDownload ? (
            <a
              href={asset(project.excelPath)}
              download={project.excelFile}
              title={isAr ? `تحميل ملف ${project.excelFile}` : `Download ${project.excelFile}`}
              className="py-2.5 px-3 rounded-xl bg-[#202428] hover:bg-[#252A2D] text-[#78A99B] border border-[#30363B] font-bold text-xs flex items-center justify-center gap-1 transition-all cursor-pointer"
            >
              <FileSpreadsheet className="w-4 h-4" aria-hidden="true" />
              <span>Excel<span className="sr-only">: {project.excelFile}</span></span>
            </a>
          ) : project.datasetOnRequest ? (
            <button
              type="button"
              onClick={() => onOpenModal('contact')}
              aria-haspopup="dialog"
              title={isAr ? 'ملف البيانات متاح عند الطلب' : 'Dataset available on request'}
              className="py-2.5 px-3 rounded-xl bg-[#202428] hover:bg-[#252A2D] text-[#78A99B] border border-dashed border-[#30363B] font-bold text-xs flex items-center justify-center gap-1 transition-all cursor-pointer"
            >
              <Lock className="w-3.5 h-3.5" aria-hidden="true" />
              <span>{isAr ? 'البيانات عند الطلب' : 'Data on request'}</span>
            </button>
          ) : null}

        </div>

      </div>

    </article>
  );
}
