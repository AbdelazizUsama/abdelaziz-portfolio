export const portfolioData = {
  en: {
    personal: {
      name: "Abdelaziz Usama Mahmoud",
      title: "Accountant & Junior Data Analyst",
      subtitle: "Cost Accountant | Operations & Sales Analytics",
      tagline: "Transforming complex operational and financial data into clear dashboards and practical business decisions.",
      bio: "Accountant with 3+ years of experience in cost accounting, general accounting, and inventory control, developing as a junior data analyst. I turn production, sales, and market data into Excel dashboards using PivotTables, slicers, and Power Query, including quantity variance, delivery status, and Steam market analysis.",
      location: "Alexandria, Egypt",
      email: "Abdelazizusama0@gmail.com",
      phone: "+20 127 584 7057",
      linkedin: "https://www.linkedin.com/in/abdelaziz-usama-42867a163",
      // Confirm this GitHub profile before displaying it; the HTML source marks it as unverified.
      github: ""
    },
    stats: [
      { label: "Data Records Analyzed", value: "22,521", suffix: "Titles" },
      { label: "Steam Concurrent Players", value: "5.7M+", suffix: "CCU" },
      { label: "Sales Analyzed (2026 ERP Export)", value: "12.5M", suffix: "Total incl. tax" },
      { label: "Units Produced (Aug 2026)", value: "465K+", suffix: "Units" }
    ],
    skills: [
      { category: "Business Intelligence & Data Analytics", items: ["Power BI & DAX Modeling", "Power Query & ETL Pipelines", "Data Architecture", "Python (Pandas, NumPy)", "SQL Database Querying", "Dashboard Design"] },
      { category: "Financial & Cost Accounting", items: ["Quantity Variance Analysis", "Product Cost Allocation", "Financial Modeling & Pricing", "Budgeting & Forecasting", "Managerial Reporting", "Excel Visual Reports & VBA"] },
      { category: "Operations & E-Commerce Logistics", items: ["On-Time Delivery (SLA)", "Sales Channel Distribution", "Inventory & Storage Analytics", "Regional Demand Mapping", "Order Cancellation Analysis", "Supply Chain Optimization"] },
      { category: "Accounting Operations, ERP & Compliance", items: ["Oracle ERP, QuickBooks, Peachtree, Daftra", "General Ledger & Journal Entries", "Bank Reconciliations", "WIP & Finished Goods Inventory Control", "Tax Reporting & E-Invoicing", "Advanced Excel"] }
    ],
    experience: [
      { role: "Cost Accountant", org: "Leven pharma", dates: "2026 – Present", location: "Alexandria, Egypt", bullets: ["Manage cost accounting and product costing to support pricing decisions.", "Oversee work-in-progress and finished goods inventory controls.", "Analyze production variances and prepare operational reports for management.", "Reconcile manufacturing data for financial and production reporting."] },
      { role: "General Accountant", org: "R&E Petroleum Services", dates: "2025", location: "Alexandria, Egypt", bullets: ["Managed e-invoicing and tax compliance processes.", "Reviewed vendor invoices, aging reports, and daily bank reconciliations.", "Coordinated import/export and supply-chain documentation."] },
      { role: "General Accountant", org: "Oliver outlet for perfumes", dates: "2024 – 2025", location: "Alexandria, Egypt", bullets: ["Processed retail and B2B payments and maintained ledger records.", "Completed bank reconciliations and reviewed accounts-receivable aging.", "Processed an average of 400+ payment transactions monthly, as stated in the source HTML."] },
      { role: "General Accountant", org: "3alrakia for Food & Beverage Company", dates: "2024 – 2025", location: "Alexandria, Egypt", bullets: ["Monitored cash flows and company bank accounts.", "Reviewed invoices and reconciled vendor payments.", "Processed 150+ supplier and vendor invoices monthly."] },
      { role: "Cost Accountant", org: "leeloudi patisserie company", dates: "2023 – 2024", location: "Alexandria, Egypt", bullets: ["Calculated costs for 80+ menu items and seasonal products.", "Managed work-in-progress and finished-goods inventory across three storage areas.", "Prepared weekly operating reports; the source HTML reports a 12% reduction in variance and 4% savings in raw-material costs."] },
      { role: "General Accountant Trainee", org: "Alexandria water company", dates: "2020", location: "Alexandria, Egypt", bullets: ["Processed 100+ billing records daily.", "Gained experience in accounting operations and documentation."] }
    ],
    education: [
      { degree: "Bachelor of Commerce (English Section), Accounting Major", institution: "Alexandria University", dates: "2017 – 2021", details: "Alexandria, Egypt" }
    ],
    certifications: [
      { name: "English, Level 12", issuer: "MODLI Alex", details: "IELTS preparation in progress." },
      { name: "ICDL", issuer: "Alexandria University" },
      { name: "HSBC Banking Online Internship", issuer: "HSBC", details: "Training in loans, customer service, and banking processes." },
      { name: "Digital Marketing", issuer: "Google" },
      { name: "Integrated Logistics", issuer: "Mr. Logistics co." }
    ],
    projects: [
      {
        id: "steam-analytics",
        title: "Steam Gaming Market Intelligence & Player Engagement Analysis",
        category: "Big Data & Market Analytics",
        badge: "Excel Dashboard",
        image: `${import.meta.env.BASE_URL}assets/dashboard_steam.jpg`,
        excelFile: "Database.xlsx",
        excelPath: `${import.meta.env.BASE_URL}assets/Database.xlsx`,
        description: "Analysis of 22,521 Steam titles covering concurrent players, review sentiment, operating-system support, and free versus paid titles.",
        highlights: [
          "Tracked 5,705,135 concurrent players across the dataset.",
          "The workbook reports 86.0% positive and 14.0% negative reviews; three blank or summary rows were excluded.",
          "Compared Windows, Mac, and Linux support across the titles.",
          "Identified leading titles by concurrent players, including Counter-Strike: Global Offensive, PUBG: BATTLEGROUNDS, ELDEN RING NIGHTREIGN, and Rust."
        ]
      },
      {
        id: "cost-variance",
        title: "Manufacturing Production Output & Quantity Variance Analysis",
        category: "Cost Accounting & Operations",
        badge: "Production Order Visual Report",
        image: `${import.meta.env.BASE_URL}assets/dashboard_cost.jpg`,
        excelFile: "Production Order Visual Report.xlsx",
        excelPath: `${import.meta.env.BASE_URL}assets/Production_Order_Visual_Report.xlsx`,
        description: "Excel cost-accounting dashboard for August 2026 production, covering 465,165 units produced and a 3,657-unit quantity variance across cosmetics and personal-care products.",
        highlights: [
          "Compared units produced with units required across production-order lines.",
          "Ranked the products contributing most to the quantity shortfall.",
          "Identified top-produced products and summarized orders by company.",
          "Quantity variance is units required minus units produced; production quantities are units, not revenue."
        ]
      },
      {
        id: "misuo-ecommerce",
        title: "MISUO E-Commerce Sales & Delivery Status Analytics",
        category: "E-Commerce & Supply Chain BI",
        badge: "MISUO Dashboard",
        image: `${import.meta.env.BASE_URL}assets/dashboard_misuo.jpg`,
        excelFile: "Dataset available on request",
        excelPath: "",
        description: "Sales and delivery dashboard based on 126 order lines (152 items) between July and December 2024, totaling EGP 1,292,886. The source workbook is withheld to protect customers' personal data.",
        highlights: [
          "Analyzed EGP 1,292,886 in sales across 126 order lines and 152 items.",
          "Cairo led regional demand, followed by Giza and Qalyubia.",
          "HomeMart was the leading sales platform by items sold.",
          "Delivery status by order line: 81% delivered, 18% rejected, and 1% returned."
        ]
      }
    ]
  },
  ar: {
    personal: {
      name: "عبدالعزيز أسامة محمود",
      title: "محاسب ومحلل بيانات مبتدئ",
      subtitle: "محاسب تكاليف | تحليلات العمليات والمبيعات",
      tagline: "تحويل بيانات العمليات والبيانات المالية إلى لوحات واضحة وقرارات عملية للأعمال.",
      bio: "محاسب بخبرة تزيد على 3 سنوات في محاسبة التكاليف والمحاسبة العامة والرقابة على المخزون، ويتطور في مجال تحليل البيانات. أحوّل بيانات الإنتاج والمبيعات والسوق إلى لوحات Excel باستخدام الجداول المحورية والفلاتر التفاعلية وPower Query، بما يشمل تحليل انحراف الكميات وحالة التوصيل وسوق ألعاب Steam.",
      location: "الإسكندرية، مصر",
      email: "Abdelazizusama0@gmail.com",
      phone: "+20 127 584 7057",
      linkedin: "https://www.linkedin.com/in/abdelaziz-usama-42867a163",
      // يُرجى تأكيد رابط GitHub قبل عرضه؛ ملف HTML يذكر أنه غير مؤكد.
      github: ""
    },
    stats: [
      { label: "سجلات البيانات التي تم تحليلها", value: "22,521", suffix: "لعبة" },
      { label: "اللاعبون المتزامنون على Steam", value: "5.7M+", suffix: "CCU" },
      { label: "مبيعات تحليل ERP لعام 2026", value: "12.5M", suffix: "الإجمالي شامل الضريبة" },
      { label: "الوحدات المنتجة في أغسطس 2026", value: "465K+", suffix: "وحدة" }
    ],
    skills: [
      { category: "ذكاء الأعمال وتحليل البيانات", items: ["Power BI وDAX", "Power Query وETL", "هندسة البيانات", "Python (Pandas, NumPy)", "استعلامات قواعد بيانات SQL", "تصميم لوحات المعلومات"] },
      { category: "المحاسبة المالية ومحاسبة التكاليف", items: ["تحليل انحراف الكميات", "تخصيص تكاليف المنتجات", "النمذجة المالية والتسعير", "إعداد الموازنات والتنبؤ", "التقارير الإدارية", "تقارير Excel المرئية وVBA"] },
      { category: "العمليات ولوجستيات التجارة الإلكترونية", items: ["التسليم في الموعد ومؤشرات SLA", "توزيع قنوات البيع", "تحليلات المخزون والتخزين", "تحليل الطلب حسب المنطقة", "تحليل إلغاء الطلبات", "تحسين سلاسل الإمداد"] },
      { category: "العمليات المحاسبية وأنظمة ERP والامتثال", items: ["Oracle ERP وQuickBooks وPeachtree وDaftra", "دفتر الأستاذ وقيود اليومية", "التسويات البنكية", "الرقابة على مخزون الإنتاج تحت التشغيل والمنتج التام", "الإقرارات الضريبية والفاتورة الإلكترونية", "Excel متقدم"] }
    ],
    experience: [
      { role: "محاسب تكاليف", org: "Leven pharma", dates: "2026 – الآن", location: "الإسكندرية، مصر", bullets: ["إدارة محاسبة التكاليف وتكلفة المنتجات لدعم قرارات التسعير.", "متابعة ضوابط مخزون الإنتاج تحت التشغيل والمنتج التام.", "تحليل انحرافات الإنتاج وإعداد التقارير التشغيلية للإدارة.", "مطابقة بيانات التصنيع للتقارير المالية والإنتاجية."] },
      { role: "محاسب عام", org: "R&E Petroleum Services", dates: "2025", location: "الإسكندرية، مصر", bullets: ["إدارة الفاتورة الإلكترونية وإجراءات الامتثال الضريبي.", "مراجعة فواتير الموردين وتقارير أعمار الديون والتسويات البنكية اليومية.", "تنسيق مستندات الاستيراد والتصدير وسلاسل الإمداد."] },
      { role: "محاسب عام", org: "Oliver outlet for perfumes", dates: "2024 – 2025", location: "الإسكندرية، مصر", bullets: ["معالجة مدفوعات التجزئة والشركات والحفاظ على سجلات الأستاذ.", "تنفيذ التسويات البنكية ومراجعة أعمار الذمم المدينة.", "معالجة متوسط يزيد على 400 معاملة دفع شهرياً، وفقاً لما ورد في ملف HTML."] },
      { role: "محاسب عام", org: "3alrakia for Food & Beverage Company", dates: "2024 – 2025", location: "الإسكندرية، مصر", bullets: ["متابعة التدفقات النقدية والحسابات البنكية للشركة.", "مراجعة الفواتير ومطابقة مدفوعات الموردين.", "معالجة أكثر من 150 فاتورة مورد شهرياً."] },
      { role: "محاسب تكاليف", org: "leeloudi patisserie company", dates: "2023 – 2024", location: "الإسكندرية، مصر", bullets: ["حساب تكلفة أكثر من 80 صنفاً من قائمة الطعام والمنتجات الموسمية.", "إدارة مخزون الإنتاج تحت التشغيل والمنتج التام في ثلاث مناطق تخزين.", "إعداد تقارير تشغيلية أسبوعية؛ ويذكر ملف HTML خفض الانحراف 12% وتوفير 4% من تكاليف المواد الخام."] },
      { role: "محاسب عام متدرب", org: "Alexandria water company", dates: "2020", location: "الإسكندرية، مصر", bullets: ["معالجة أكثر من 100 سجل فوترة يومياً.", "اكتساب خبرة في العمليات المحاسبية والتوثيق."] }
    ],
    education: [
      { degree: "بكالوريوس التجارة، القسم الإنجليزي، تخصص المحاسبة", institution: "جامعة الإسكندرية", dates: "2017 – 2021", details: "الإسكندرية، مصر" }
    ],
    certifications: [
      { name: "اللغة الإنجليزية، المستوى 12", issuer: "MODLI Alex", details: "الاستعداد لاختبار IELTS قيد التنفيذ." },
      { name: "ICDL", issuer: "جامعة الإسكندرية" },
      { name: "تدريب مصرفي عبر الإنترنت", issuer: "HSBC", details: "تدريب في القروض وخدمة العملاء والعمليات المصرفية." },
      { name: "التسويق الرقمي", issuer: "Google" },
      { name: "الخدمات اللوجستية المتكاملة", issuer: "Mr. Logistics co." }
    ],
    projects: [
      {
        id: "steam-analytics",
        title: "تحليل سوق ألعاب Steam وتفاعل اللاعبين",
        category: "البيانات الضخمة وتحليل السوق",
        badge: "لوحة Excel",
        image: `${import.meta.env.BASE_URL}assets/dashboard_steam.jpg`,
        excelFile: "Database.xlsx",
        excelPath: `${import.meta.env.BASE_URL}assets/Database.xlsx`,
        description: "تحليل 22,521 لعبة على Steam، يشمل اللاعبين المتزامنين وانطباعات التقييمات ودعم أنظمة التشغيل والألعاب المجانية والمدفوعة.",
        highlights: [
          "تتبع 5,705,135 لاعباً متزامناً عبر قاعدة البيانات.",
          "يعرض ملف البيانات 86.0% تقييمات إيجابية و14.0% سلبية بعد استبعاد ثلاثة صفوف فارغة أو ملخصة.",
          "مقارنة دعم أنظمة Windows وMac وLinux بين الألعاب.",
          "تحديد الألعاب الأعلى من حيث اللاعبين المتزامنين، ومنها Counter-Strike: Global Offensive وPUBG: BATTLEGROUNDS وELDEN RING NIGHTREIGN وRust."
        ]
      },
      {
        id: "cost-variance",
        title: "تحليل إنتاج التصنيع وانحراف الكميات",
        category: "محاسبة التكاليف والعمليات",
        badge: "تقرير أوامر الإنتاج",
        image: `${import.meta.env.BASE_URL}assets/dashboard_cost.jpg`,
        excelFile: "Production Order Visual Report.xlsx",
        excelPath: `${import.meta.env.BASE_URL}assets/Production_Order_Visual_Report.xlsx`,
        description: "لوحة Excel لمحاسبة تكاليف إنتاج أغسطس 2026، تشمل 465,165 وحدة منتجة وانحراف كميات قدره 3,657 وحدة عبر منتجات التجميل والعناية الشخصية.",
        highlights: [
          "مقارنة الوحدات المنتجة بالمطلوب عبر أسطر أوامر الإنتاج.",
          "ترتيب المنتجات الأكثر مساهمة في عجز الكميات.",
          "تحديد المنتجات الأعلى إنتاجاً وتلخيص أوامر الإنتاج حسب الشركة.",
          "انحراف الكمية هو المطلوب ناقص المنتج؛ كميات الإنتاج وحدات وليست إيرادات."
        ]
      },
      {
        id: "misuo-ecommerce",
        title: "تحليلات مبيعات وحالة توصيل MISUO",
        category: "التجارة الإلكترونية وسلاسل الإمداد",
        badge: "لوحة MISUO",
        image: `${import.meta.env.BASE_URL}assets/dashboard_misuo.jpg`,
        excelFile: "ملف البيانات متاح عند الطلب",
        excelPath: "",
        description: "لوحة مبيعات وتوصيل مبنية على 126 سطر طلب (152 قطعة) بين يوليو وديسمبر 2024، بإجمالي مبيعات 1,292,886 جنيهاً. ملف البيانات غير منشور لحماية المعلومات الشخصية للعملاء.",
        highlights: [
          "تحليل مبيعات بقيمة 1,292,886 جنيهاً عبر 126 سطر طلب و152 قطعة.",
          "تصدرت القاهرة الطلب، تلتها الجيزة ثم القليوبية.",
          "كانت HomeMart قناة البيع الأعلى من حيث عدد القطع.",
          "حالة التوصيل حسب أسطر الطلبات: 81% تم تسليمها، و18% مرفوضة، و1% مرتجعة."
        ]
      }
    ]
  }
};