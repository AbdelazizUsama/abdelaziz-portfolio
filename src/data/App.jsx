import React, { useEffect, useState } from 'react';
import Navbar from './components/Navbar';
import HeroSection from './components/HeroSection';
import MetricsOverview from './components/MetricsOverview';
import SkillsSection from './components/SkillsSection';
import CaseStudyCard from './components/CaseStudyCard';
import ProjectSteamModal from './components/ProjectSteamModal';
import ProjectCostModal from './components/ProjectCostModal';
import ProjectMisuoModal from './components/ProjectMisuoModal';
import ProjectSalesModal from './components/ProjectSalesModal';
import ContactModal from './components/ContactModal';
import Footer from './components/Footer';
import { portfolioData } from './data/portfolio_content';
import { Sparkles } from 'lucide-react';

// Browser tab title per language (kept in sync with the standalone HTML build)
const PAGE_TITLES = {
  en: 'Abdelaziz Usama Mahmoud | Accountant & Junior Data Analyst',
  ar: 'عبدالعزيز اسامه محمود | محاسب ومحلل بيانات مبتدئ',
};

const FILTERS = [
  { key: 'all', en: 'All Projects', ar: 'جميع المشاريع' },
  { key: 'gaming', en: 'Gaming Analytics', ar: 'تحليل الألعاب (Steam)' },
  { key: 'cost', en: 'Cost Variance', ar: 'محاسبة التكاليف' },
  { key: 'ecommerce', en: 'E-Commerce BI', ar: 'التجارة الإلكترونية (MISUO)' },
  { key: 'sales', en: 'Sales Analytics', ar: 'تحليلات المبيعات' },
];

// project id -> filter key
const FILTER_BY_ID = {
  'steam-analytics': 'gaming',
  'cost-variance': 'cost',
  'misuo-ecommerce': 'ecommerce',
  'sales-analysis': 'sales',
};

export default function App() {
  const [lang, setLang] = useState('en');
  const [activeModal, setActiveModal] = useState(null);
  const [filterCategory, setFilterCategory] = useState('all');

  const isAr = lang === 'ar';
  const projects = portfolioData[lang].projects;

  // Keep <html lang>, <html dir> and the page title in sync with the selected language
  useEffect(() => {
    document.documentElement.lang = lang;
    document.documentElement.dir = isAr ? 'rtl' : 'ltr';
    document.title = PAGE_TITLES[lang];
  }, [lang, isAr]);

  const filteredProjects = projects.filter(
    (p) => filterCategory === 'all' || FILTER_BY_ID[p.id] === filterCategory
  );

  const scrollToProjects = () => {
    const elem = document.getElementById('projects');
    if (!elem) return;
    const reduce = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    elem.scrollIntoView({ behavior: reduce ? 'auto' : 'smooth' });
  };

  return (
    <div className={`min-h-screen bg-[#111315] text-[#F1F3F4] ${isAr ? 'font-cairo' : 'font-sans'}`} dir={isAr ? 'rtl' : 'ltr'}>

      {/* Keyboard users can jump straight past the navigation */}
      <a href="#main-content" className="skip-link">
        {isAr ? 'تخطَّ إلى المحتوى الرئيسي' : 'Skip to main content'}
      </a>

      {/* Top Navbar */}
      <Navbar
        lang={lang}
        setLang={setLang}
        onOpenContact={() => setActiveModal('contact')}
      />

      {/* Main Content */}
      <main id="main-content" tabIndex={-1}>

        {/* Hero Section */}
        <HeroSection
          lang={lang}
          onExploreProjects={scrollToProjects}
          onOpenContact={() => setActiveModal('contact')}
        />

        {/* Impact Numbers */}
        <MetricsOverview lang={lang} />

        {/* Skills & Tools */}
        <SkillsSection lang={lang} />

        {/* Case Studies / Projects Section */}
        <section id="projects" aria-labelledby="projects-heading" className="py-16 relative z-10 bg-[#111315]">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-10">
              <div>
                <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-[#191C1F] border border-[#30363B] text-[#78A99B] text-xs font-semibold mb-2">
                  <Sparkles className="w-3.5 h-3.5" aria-hidden="true" />
                  <span>{isAr ? 'المشاريع والدراسات التحليلية' : 'Featured Case Studies'}</span>
                </div>
                <h2 id="projects-heading" className="text-2xl font-extrabold text-[#F1F3F4]">
                  {isAr ? 'معرض لوحات القيادة ودراسات الحالة' : 'Dashboards & Case Studies'}
                </h2>
                <p className="text-[#A3ADB5] text-xs sm:text-sm mt-1 max-w-xl">
                  {isAr
                    ? 'اضغط على أي مشروع لعرض دراسة الحالة والرسوم البيانية.'
                    : 'Click any project to open its case study and charts.'}
                </p>
              </div>

              {/* Filter Tabs */}
              <div
                role="group"
                aria-label={isAr ? 'تصفية المشاريع حسب الفئة' : 'Filter projects by category'}
                className="flex flex-wrap gap-1.5 p-1.5 rounded-xl bg-[#191C1F] border border-[#30363B]"
              >
                {FILTERS.map((f) => (
                  <button
                    key={f.key}
                    type="button"
                    onClick={() => setFilterCategory(f.key)}
                    aria-pressed={filterCategory === f.key}
                    className={`px-3 py-2 min-h-[40px] rounded-lg text-xs font-bold transition-all ${
                      filterCategory === f.key
                        ? 'bg-[#78A99B] text-[#111315] shadow-sm'
                        : 'text-[#A3ADB5] hover:text-[#F1F3F4]'
                    }`}
                  >
                    {isAr ? f.ar : f.en}
                  </button>
                ))}
              </div>

            </div>

            {/* Announce filter results to screen readers */}
            <p className="sr-only" role="status" aria-live="polite">
              {isAr
                ? `يتم عرض ${filteredProjects.length} من ${projects.length} مشاريع`
                : `Showing ${filteredProjects.length} of ${projects.length} projects`}
            </p>

            {/* Projects Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4 gap-6">
              {filteredProjects.map((project) => (
                <CaseStudyCard
                  key={project.id}
                  project={project}
                  lang={lang}
                  onOpenModal={(id) => setActiveModal(id)}
                />
              ))}
            </div>

          </div>
        </section>

      </main>

      {/* Footer */}
      <Footer lang={lang} />

      {/* Modals */}
      {activeModal === 'steam-analytics' && (
        <ProjectSteamModal lang={lang} onClose={() => setActiveModal(null)} />
      )}

      {activeModal === 'cost-variance' && (
        <ProjectCostModal lang={lang} onClose={() => setActiveModal(null)} />
      )}

      {activeModal === 'misuo-ecommerce' && (
        <ProjectMisuoModal lang={lang} onClose={() => setActiveModal(null)} />
      )}

      {activeModal === 'sales-analysis' && (
        <ProjectSalesModal lang={lang} onClose={() => setActiveModal(null)} />
      )}

      {activeModal === 'contact' && (
        <ContactModal lang={lang} onClose={() => setActiveModal(null)} />
      )}

    </div>
  );
}
