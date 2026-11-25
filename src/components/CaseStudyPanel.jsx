import React from 'react';
import { portfolioData } from '../data/portfolio_content';
import { stripPlaceholders } from '../utils/helpers';

const T = {
  en: {
    title: 'Case study', findings: 'Key findings',
    rows: { problem: 'Business question', dataSource: 'Data source', period: 'Time period', tools: 'Tools used', methods: 'Methods', outcome: 'Outcome / recommendation' },
    onRequest: 'Dataset available on request:', requestLink: 'email me',
  },
  ar: {
    title: 'دراسة الحالة', findings: 'أبرز النتائج',
    rows: { problem: 'السؤال التجاري أو المشكلة', dataSource: 'مصدر البيانات', period: 'الفترة الزمنية', tools: 'الأدوات المستخدمة', methods: 'المنهجية', outcome: 'النتيجة / التوصية' },
    onRequest: 'ملف البيانات متاح عند الطلب:', requestLink: 'راسلني',
  },
};

// Case study rows from portfolio_content.js. "[Add ...]" placeholders are hidden, and rows with nothing real are left out.
export default function CaseStudyPanel({ projectId, lang }) {
  const t = T[lang];
  const project = portfolioData[lang].projects.find((p) => p.id === projectId);
  if (!project) return null;
  const email = portfolioData[lang].personal.email;
  const rows = ['problem', 'dataSource', 'period', 'tools', 'methods', 'outcome']
    .map((key) => ({ key, text: stripPlaceholders(project.caseStudy && project.caseStudy[key]) }))
    .filter((r) => r.text);
  const wide = ['problem', 'outcome'];

  return (
    <section aria-labelledby={`cs-${projectId}`} className="space-y-3">
      <h3 id={`cs-${projectId}`} className="text-sm font-extrabold text-[#F1F3F4]">{t.title}</h3>
      <dl className="grid grid-cols-1 md:grid-cols-2 gap-3">
        {rows.map((r) => (
          <div key={r.key} className={`p-4 rounded-xl bg-[#191C1F] border border-[#30363B] space-y-1.5 ${wide.includes(r.key) ? 'md:col-span-2' : ''}`}>
            <dt className="text-xs font-extrabold text-[#78A99B]">{t.rows[r.key]}</dt>
            <dd className="text-sm leading-relaxed text-[#F1F3F4]">{r.text}</dd>
          </div>
        ))}
        <div className="p-4 rounded-xl bg-[#191C1F] border border-[#30363B] space-y-1.5 md:col-span-2">
          <dt className="text-xs font-extrabold text-[#78A99B]">{t.findings}</dt>
          <dd>
            <ul className="space-y-1.5 text-sm text-[#F1F3F4]">
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
      {project.datasetOnRequest && (
        <p className="text-xs text-[#A3ADB5]">
          {t.onRequest}{' '}
          <a className="text-[#78A99B] underline underline-offset-4" href={`mailto:${email}?subject=${encodeURIComponent(project.title)}`}>{t.requestLink}</a>
        </p>
      )}
    </section>
  );
}
