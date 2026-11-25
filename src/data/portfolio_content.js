// Portfolio content (English + Arabic) for the React/Vite app.
// Kept in the SAME schema as before (personal / stats / skills / projects[...]) so existing components keep working,
// plus new fields: personal.subtitle/phones, experience, education, certifications, and per-project
// filterKey / imageAlt / caseStudy / datasetOnRequest.
// Numbers here match the workbooks in src/data/*.json (and the standalone HTML build).
//
// datasetOnRequest: true  -> the workbook contains customers' personal/confidential data, so there is NO download
//                            (excelPath is ""). Components should show "Dataset available on request" instead of a link.
// caseStudy: strings in [square brackets] are placeholders for details only you can provide.
export const portfolioData = {
  en: {
    personal: {
      name: "Abdelaziz Usama Mahmoud",
      title: "Accountant & Junior Data Analyst",
      subtitle: "Cost Accountant | Operations & Sales Analytics",
      tagline: "Transforming complex operational & financial data into executive strategic dashboards and profitable business decisions.",
      bio: "Accountant with 3+ years of experience in cost accounting, general accounting and inventory control, now growing as a junior data analyst. I turn production, sales and market data into Excel dashboards (PivotTables, slicers, Power Query), including quantity variance analysis, delivery-status analysis and a Steam game-market study.",
      location: "Alexandria, Egypt",
      email: "Abdelazizusama0@gmail.com",
      phone: "+20 127 584 7057",
      phones: ["+20 127 584 7057"],
      linkedin: "https://www.linkedin.com/in/abdelaziz-usama-42867a163",
      github: "https://github.com/abdelaziz-data"
    },
    stats: [
      {
        label: "Data Records Analyzed",
        value: "22,521",
        suffix: "Titles"
      },
      {
        label: "Steam Concurrent Players",
        value: "5.7M+",
        suffix: "CCU"
      },
      {
        label: "Sales Analyzed (2026 ERP export)",
        value: "12.5M",
        suffix: "Total incl. tax"
      },
      {
        label: "Units Produced (Aug 2026)",
        value: "465K+",
        suffix: "Units"
      }
    ],
    skills: [
      {
        category: "Business Intelligence & Data Analytics",
        items: [
          "Power BI & DAX Modeling",
          "Power Query & ETL Pipelines",
          "Data Architecture",
          "Python (Pandas, NumPy)",
          "SQL Database Querying",
          "Dashboard Design"
        ]
      },
      {
        category: "Financial & Cost Accounting",
        items: [
          "Quantity Variance Analysis",
          "Product Cost Allocation",
          "Financial Modeling & Pricing",
          "Budgeting & Forecasting",
          "Managerial Reporting",
          "Excel Visual Reports & VBA"
        ]
      },
      {
        category: "Operations & E-Commerce Logistics BI",
        items: [
          "On-Time Delivery (SLA)",
          "Sales Channel Distribution",
          "Inventory & Storage Analytics",
          "Regional Demand Mapping",
          "Order Cancellation Analysis",
          "Supply Chain Optimization"
        ]
      },
      {
        category: "Accounting Operations, ERP & Compliance",
        items: [
          "Oracle ERP, QuickBooks, Peachtree, Daftra",
          "General Ledger & Journal Entries",
          "Bank Reconciliations",
          "Inventory Control (WIP & Finished Goods)",
          "Tax Reporting & E-Invoicing",
          "Advanced Excel"
        ]
      }
    ],
    experience: [
      {
        role: "Cost Accountant",
        org: "Leven pharma",
        dates: "2026 – Present",
        location: "Alexandria, Egypt",
        bullets: [
          "Direct end-to-end cost accounting processes, ensuring accurate product costing and supporting strategic pricing models.",
          "Manage comprehensive WIP and finished goods inventory, implementing controls to ensure stock valuation accuracy.",
          "Analyze production variances and spearhead operational reporting, delivering actionable insights to management.",
          "Consistently optimize cost-tracking mechanisms, resulting in improved visibility of manufacturing efficiency.",
          "Reconcile and validate complex manufacturing data to ensure 100% accuracy in financial reporting and production metrics."
        ]
      },
      {
        role: "General Accountant",
        org: "R&E Petroleum Services",
        dates: "2025",
        location: "Alexandria, Egypt",
        bullets: [
          "Ensured 100% tax compliance by managing e-invoicing systems and collaborating with legal teams on regulatory requirements.",
          "Streamlined financial operations by managing aging reports, reviewing vendor invoices, and executing daily bank reconciliations.",
          "Orchestrated end-to-end supply chain documentation, including import/export processes, carrier selection, and customs clearance coordination."
        ]
      },
      {
        role: "General Accountant",
        org: "Oliver outlet for perfumes",
        dates: "2024 – 2025",
        location: "Alexandria, Egypt",
        bullets: [
          "Streamlined high-volume customer payment processing, maintaining meticulous ledger records to ensure continuous audit readiness.",
          "Executed recurring bank reconciliations and analyzed accounts receivable aging reports to optimize working capital and cash flow.",
          "Successfully processed and reconciled an average of 400+ retail and B2B payment transactions monthly with 100% data accuracy."
        ]
      },
      {
        role: "General Accountant",
        org: "3alrakia for Food & Beverage Company",
        dates: "2024 – 2025",
        location: "Alexandria, Egypt",
        bullets: [
          "Monitored daily cash flows and maintained strict financial oversight across multiple corporate bank accounts to safeguard company liquidity.",
          "Executed complex invoice reviews and reconciled vendor payment records to ensure absolute financial integrity and eliminate overpayments.",
          "Audited and processed over 150+ supplier and vendor invoices monthly, ensuring accurate cost allocation across multiple branches."
        ]
      },
      {
        role: "Cost Accountant",
        org: "leeloudi patisserie company",
        dates: "2023 – 2024",
        location: "Alexandria, Egypt",
        bullets: [
          "Calculated precise product costs for over 80+ menu items and seasonal pastries, providing data-driven insights to support profitable pricing strategies.",
          "Managed comprehensive WIP and finished goods inventory across 3 storage areas, reducing variance discrepancies by 12% through tighter stock controls.",
          "Delivered weekly operational reports to management, identifying waste issues and recommending solutions that saved 4% in raw material costs."
        ]
      },
      {
        role: "General Accountant Trainee",
        org: "Alexandria water company",
        dates: "2020",
        location: "Alexandria, Egypt",
        bullets: [
          "Processed 100+ billing records daily with a focus on data accuracy and deadline management.",
          "Gained hands-on experience in accounting operations and documentation."
        ]
      }
    ],
    education: [
      {
        degree: "Bachelor of Commerce (English Section), Accounting Major",
        institution: "Alexandria University",
        dates: "2017 – 2021",
        details: "Alexandria, Egypt"
      }
    ],
    certifications: [
      {
        name: "English, Level 12",
        issuer: "MODLI Alex",
        date: "",
        details: "IELTS preparation in progress.",
        credentialUrl: ""
      },
      {
        name: "ICDL",
        issuer: "Alexandria University",
        date: "",
        details: "",
        credentialUrl: ""
      },
      {
        name: "HSBC Banking, online internship",
        issuer: "HSBC",
        date: "",
        details: "Gained knowledge in loans, customer service, and banking processes.",
        credentialUrl: ""
      },
      {
        name: "Digital Marketing",
        issuer: "Google",
        date: "",
        details: "",
        credentialUrl: ""
      },
      {
        name: "Integrated Logistics",
        issuer: "Mr. Logistics co.",
        date: "",
        details: "",
        credentialUrl: ""
      }
    ],
    projects: [
      {
        id: "steam-analytics",
        filterKey: "gaming",
        title: "Steam Gaming Industry Market Intelligence & Player Engagement Analysis",
        category: "Big Data & Market Analytics",
        badge: "Excel Dashboard",
        image: "/assets/dashboard_steam.jpg",
        imageAlt: "Excel dashboard screenshot for the Steam analysis: positive and negative review ratio, platform support pie charts, free games share, and top 10 games by concurrent players, positive feedback and negative feedback.",
        excelFile: "Database.xlsx",
        excelPath: "/assets/Database.xlsx",
        datasetOnRequest: false,
        description: "Comprehensive analytical study of 22,521 game titles on Steam, tracking 5.7M+ concurrent users (CCU), sentiment breakdown, platform OS distribution (Windows, Mac, Linux), and free vs paid monetization models.",
        highlights: [
          "Monitored 5,705,135 concurrent players (CCU) across 22,521 Steam titles, about 253 per title on average.",
          "86.0% positive vs 14.0% negative review sentiment across the dataset.",
          "Platform support by share of titles: Windows ≈100% (22,515), Mac 27% (6,057), Linux 18% (4,083).",
          "Free vs paid: 2,947 free titles (13%) vs 19,574 paid (87%).",
          "Top titles by concurrent players: Counter-Strike: Global Offensive (1,013,936), PUBG: BATTLEGROUNDS (314,682), ELDEN RING NIGHTREIGN (163,599), Rust (143,870)."
        ],
        caseStudy: {
          problem: "[Add the business question or problem this analysis answered]",
          dataSource: "Steam games dataset (Database.xlsx, sheet “extended_steam_games”): 22,521 titles with reviews, concurrent players (CCU), price, release date, age rating, genres and platform support.",
          period: "Titles released 30 Jun 1997 to 5 Aug 2026. [Add the snapshot date of the CCU and review counts]",
          tools: "Excel dashboard built with PivotTables, slicers and charts, using Power Query. [Add any other tools used]",
          methods: "Positive review ratio = positive ÷ (positive + negative) reviews. 22,521 titles counted; the 3 blank/summary rows at the bottom of the sheet are excluded. [Add data-cleaning steps and other methods]",
          outcome: "[Add the measurable outcome or recommendation]"
        }
      },
      {
        id: "cost-variance",
        filterKey: "cost",
        title: "Manufacturing Production Output & Quantity Variance Analysis",
        category: "Cost Accounting & Operations",
        badge: "Production Order Visual Report",
        image: "/assets/dashboard_cost.jpg",
        imageAlt: "Excel dashboard screenshot for the production analysis: quantity produced by day, total quantity variance, top 10 products by quantity variance, production orders by company, and top 10 products by quantity produced.",
        excelFile: "Production Order Visual Report.xlsx",
        excelPath: "/assets/Production_Order_Visual_Report.xlsx",
        datasetOnRequest: false,
        description: "Cost accounting dashboard for August 2026 production: 465,165 units produced across cosmetics & personal care brands, with quantity variance analysis (3,657 units) and the top-producing products.",
        highlights: [
          "Tracked 465,165 units produced against 468,822 required (99.2%) across 418 production-order lines in August 2026.",
          "Isolated a 3,657-unit quantity shortfall (required minus produced) and ranked the top 10 products driving it, led by two Senor 250g gels (804 and 798 units).",
          "Ranked the top 10 products by quantity produced, led by Senor Black Hair Wax 100g (86,384 units).",
          "Mapped production orders across 19 companies (Senor leading with 141 order lines, Leven with 98)."
        ],
        caseStudy: {
          problem: "[Add the business question or problem this dashboard addressed]",
          dataSource: "Production order sheet “Aug” (Production_Order_Visual_Report.xlsx): 418 order lines with company, date, order code, product, quantity required, quantity produced and variance.",
          period: "1 Aug 2026 to 31 Aug 2026.",
          tools: "Excel dashboard built with PivotTables, slicers (date and company) and charts. [Add any other tools used]",
          methods: "Variance quantity = quantity required − quantity produced (3,657 units, 0.8% of the 468,822 units required). [Add data-cleaning steps and other methods]",
          outcome: "[Add the measurable outcome or recommendation]"
        }
      },
      {
        id: "misuo-ecommerce",
        filterKey: "ecommerce",
        title: "MISUO E-Commerce Sales & Delivery Status BI",
        category: "E-Commerce & Supply Chain BI",
        badge: "MISUO Dashboard",
        image: "/assets/dashboard_misuo.jpg",
        imageAlt: "Excel dashboard screenshot for MISUO: total sales, total orders, average selling price, sales by platform, best seller, delivery status breakdown and orders by governorate.",
        excelFile: "MISUO - Abdelaziz Usama Mahmoud.xlsx",
        excelPath: "",
        datasetOnRequest: true,
        description: "Sales and delivery dashboard built from 126 order lines (152 items, 1,292,886 EGP) between July and December 2024. Evaluates regional governorate demand, sales channels, best sellers and delivery status outcomes.",
        highlights: [
          "Analyzed 1,292,886 EGP in sales across 126 order lines (152 items), with an average selling price of 10,261 EGP per order line.",
          "Cairo governorate led regional demand with 60 order lines, followed by Giza (24) and Qalyubia (11).",
          "Sales channel breakdown: HomeMart platform led with 94 items sold.",
          "Delivery status across order lines: 81% delivered, 18% rejected, 1% returned."
        ],
        caseStudy: {
          problem: "Identify the highest- and lowest-selling products (the goal set out in the workbook's instructions sheet).",
          dataSource: "MISUO order file (MISUO_Abdelaziz_Usama_Mahmoud.xlsx, sheet “البيانات”): 126 order lines with customer type, governorate, sales platform, product, quantity, price and delivery status.",
          period: "Orders dated 27 Jul 2024 to 14 Dec 2024.",
          tools: "Excel dashboard built with PivotTables, slicers and charts, using Power Query. [Add any other tools used]",
          methods: "Delivery status share = order lines per status ÷ all 126 lines. Average selling price = mean selling price per order line. [Add data-cleaning steps and other methods]",
          outcome: "[Add the measurable outcome or recommendation]"
        }
      },
      {
        id: "sales-analysis",
        filterKey: "sales",
        title: "Overall Sales Analysis 2026: Revenue Mix, Customer Concentration & Monthly Trend",
        category: "Sales Analytics & Revenue Mix",
        badge: "Excel Dashboard",
        image: "/assets/dashboard_logistics.png",
        imageAlt: "Excel dashboard screenshot of the 2026 sales analysis: best selling product, total sales, best revenue category, top 10 products and customers, sales by area and total sales by month.",
        excelFile: "Overall Dashboard Sales Analysis 2026.xlsx",
        excelPath: "",
        datasetOnRequest: true,
        description: "Sales analysis dashboard built on a 2026 ERP invoice export: 12.5M in total sales across 1,634 invoices and 781 customers, broken down by customer category, revenue account, region and month.",
        highlights: [
          "Analyzed 12,509,078 in total sales (including 15% tax) across 1,634 invoices and 781 customers, 1 Jan 2026 to 31 Oct 2026.",
          "Customer concentration: the top customer alone represents 96.5% of sales (top 3: 97.5%), all from the logistics revenue account.",
          "Monthly sales peaked in February (2,508,189) and were lowest in October (530,689).",
          "Sales by region: Central Region 12,071,025, Dammam - Khobar 433,500, Western Region 4,553."
        ],
        caseStudy: {
          problem: "[Add the business question or problem this analysis answered]",
          dataSource: "ERP sales-invoice export (Overall_Dashboard_Sales_Analysis_2026.xlsx, sheet “Query Report”): 2,129 invoice lines with item, customer group, region, revenue account, amount, tax and total. Currency is not stated in the file. [Add currency]",
          period: "1 Jan 2026 to 31 Oct 2026.",
          tools: "Excel dashboard built with PivotTables, slicers and charts. [Add any other tools used]",
          methods: "Total sales = invoice total including 15% tax (net 10,877,459 + tax 1,631,619). [Add data-cleaning steps and other methods]",
          outcome: "[Add the measurable outcome or recommendation]"
        }
      }
    ]
  },
  ar: {
    personal: {
      name: "عبدالعزيز اسامه محمود",
      title: "محاسب ومحلل بيانات مبتدئ (Junior Data Analyst)",
      subtitle: "محاسب تكاليف | تحليلات العمليات والمبيعات",
      tagline: "تحويل البيانات المبعثرة والمعقدة إلى قرارات استراتيجية مربحة ولوحات قيادة تفاعلية مذهلة.",
      bio: "محاسب بخبرة تزيد على 3 سنوات في محاسبة التكاليف والمحاسبة العامة والرقابة على المخزون، ومحلل بيانات مبتدئ. أحوّل بيانات الإنتاج والمبيعات والسوق إلى لوحات إكسيل (جداول محورية وفلاتر تفاعلية وPower Query)، تشمل تحليل انحراف الكميات وتحليل حالة التوصيل ودراسة لسوق ألعاب Steam.",
      location: "الإسكندرية، مصر",
      email: "Abdelazizusama0@gmail.com",
      phone: "+20 127 584 7057",
      phones: ["+20 127 584 7057"],
      linkedin: "https://www.linkedin.com/in/abdelaziz-usama-42867a163",
      github: "https://github.com/abdelaziz-data"
    },
    stats: [
      {
        label: "سجلات تم تحليلها",
        value: "22,521",
        suffix: "لعبة"
      },
      {
        label: "لاعبين متزامنين (Steam CCU)",
        value: "5.7M+",
        suffix: "لاعب"
      },
      {
        label: "مبيعات تم تحليلها (تصدير ERP لعام 2026)",
        value: "12.5M",
        suffix: "الإجمالي شاملاً الضريبة"
      },
      {
        label: "وحدات منتجة (أغسطس 2026)",
        value: "465K+",
        suffix: "وحدة"
      }
    ],
    skills: [
      {
        category: "أدوات تحليل البيانات والذكاء التجاري",
        items: [
          "Power BI & DAX Modeling",
          "Power Query & ETL",
          "نمذجة البيانات (Data Modeling)",
          "Python (Pandas, NumPy)",
          "SQL Databases",
          "تصميم لوحات القيادة (Dashboards)"
        ]
      },
      {
        category: "المحاسبة المالية والتكاليف الصناعية",
        items: [
          "تحليل انحراف الكميات (Variance Analysis)",
          "توزيع وتخصيص التكاليف",
          "النمذجة المالية والتسعير",
          "إعداد الموازنات والتنبؤ",
          "التقارير الإدارية التنفيذية",
          "تقارير إكسيل البصرية و VBA"
        ]
      },
      {
        category: "إدارة العمليات والتجارة الإلكترونية",
        items: [
          "مؤشرات أداء التوصيل (On-Time Delivery)",
          "تحليل قنوات البيع",
          "إدارة المخزون والتخزين",
          "التوزيع الجغرافي للمبيعات",
          "تحليل معدلات الإلغاء والمرتجعات",
          "تحسين سلاسل التوريد"
        ]
      },
      {
        category: "العمليات المحاسبية وأنظمة ERP والامتثال",
        items: [
          "Oracle ERP و QuickBooks و Peachtree و Daftra",
          "دفتر الأستاذ وقيود اليومية",
          "التسويات البنكية",
          "الرقابة على المخزون (الإنتاج تحت التشغيل والتام)",
          "الإقرارات الضريبية والفاتورة الإلكترونية",
          "إكسيل المتقدم (Advanced Excel)"
        ]
      }
    ],
    experience: [
      {
        role: "محاسب تكاليف",
        org: "Leven pharma",
        dates: "2026 – الآن",
        location: "الإسكندرية، مصر",
        bullets: [
          "إدارة عمليات محاسبة التكاليف من البداية إلى النهاية لضمان دقة تكلفة المنتجات ودعم نماذج التسعير الاستراتيجية.",
          "إدارة مخزون الإنتاج تحت التشغيل (WIP) والمنتج التام بالكامل، مع تطبيق ضوابط تضمن دقة تقييم المخزون.",
          "تحليل انحرافات الإنتاج وقيادة التقارير التشغيلية، وتقديم رؤى قابلة للتنفيذ للإدارة.",
          "تحسين آليات تتبع التكاليف باستمرار، مما أدى إلى وضوح أفضل لكفاءة التصنيع.",
          "مطابقة بيانات التصنيع المعقدة والتحقق منها لضمان دقة 100% في التقارير المالية ومؤشرات الإنتاج."
        ]
      },
      {
        role: "محاسب عام",
        org: "R&E Petroleum Services",
        dates: "2025",
        location: "الإسكندرية، مصر",
        bullets: [
          "ضمان الامتثال الضريبي بنسبة 100% عبر إدارة أنظمة الفاتورة الإلكترونية والتعاون مع الفريق القانوني في المتطلبات التنظيمية.",
          "تبسيط العمليات المالية عبر إدارة تقارير أعمار الديون ومراجعة فواتير الموردين وتنفيذ التسويات البنكية اليومية.",
          "تنظيم مستندات سلسلة التوريد من البداية إلى النهاية، بما في ذلك عمليات الاستيراد والتصدير واختيار شركات الشحن وتنسيق التخليص الجمركي."
        ]
      },
      {
        role: "محاسب عام",
        org: "Oliver outlet for perfumes",
        dates: "2024 – 2025",
        location: "الإسكندرية، مصر",
        bullets: [
          "تبسيط معالجة مدفوعات العملاء ذات الحجم الكبير مع الحفاظ على سجلات دقيقة لضمان الجاهزية المستمرة للمراجعة.",
          "تنفيذ تسويات بنكية دورية وتحليل تقارير أعمار الذمم المدينة لتحسين رأس المال العامل والتدفق النقدي.",
          "معالجة ومطابقة ما متوسطه أكثر من 400 معاملة دفع شهرياً (تجزئة وشركات) بدقة بيانات 100%."
        ]
      },
      {
        role: "محاسب عام",
        org: "3alrakia for Food & Beverage Company",
        dates: "2024 – 2025",
        location: "الإسكندرية، مصر",
        bullets: [
          "متابعة التدفقات النقدية اليومية والإشراف المالي الصارم على عدة حسابات بنكية للشركة لحماية السيولة.",
          "تنفيذ مراجعات معقدة للفواتير ومطابقة سجلات مدفوعات الموردين لضمان النزاهة المالية ومنع الدفع الزائد.",
          "مراجعة ومعالجة أكثر من 150 فاتورة موردين شهرياً لضمان التوزيع الدقيق للتكاليف عبر عدة فروع."
        ]
      },
      {
        role: "محاسب تكاليف",
        org: "leeloudi patisserie company",
        dates: "2023 – 2024",
        location: "الإسكندرية، مصر",
        bullets: [
          "حساب التكلفة الدقيقة لأكثر من 80 صنفاً من قائمة الطعام والحلويات الموسمية، وتقديم رؤى مبنية على البيانات لدعم استراتيجيات التسعير المربحة.",
          "إدارة مخزون الإنتاج تحت التشغيل والمنتج التام عبر 3 مناطق تخزين، وخفض فروقات الانحراف بنسبة 12% من خلال ضوابط أدق للمخزون.",
          "إعداد تقارير تشغيلية أسبوعية للإدارة لرصد مشكلات الهدر واقتراح حلول وفّرت 4% من تكاليف المواد الخام."
        ]
      },
      {
        role: "محاسب عام متدرب",
        org: "Alexandria water company",
        dates: "2020",
        location: "الإسكندرية، مصر",
        bullets: [
          "معالجة أكثر من 100 سجل فوترة يومياً مع التركيز على دقة البيانات والالتزام بالمواعيد النهائية.",
          "اكتساب خبرة عملية في العمليات المحاسبية والتوثيق."
        ]
      }
    ],
    education: [
      {
        degree: "بكالوريوس التجارة (القسم الإنجليزي)، تخصص المحاسبة",
        institution: "جامعة الإسكندرية",
        dates: "2017 – 2021",
        details: "الإسكندرية، مصر"
      }
    ],
    certifications: [
      {
        name: "اللغة الإنجليزية، المستوى 12",
        issuer: "MODLI Alex",
        date: "",
        details: "الاستعداد لاختبار IELTS قيد التنفيذ.",
        credentialUrl: ""
      },
      {
        name: "ICDL",
        issuer: "جامعة الإسكندرية",
        date: "",
        details: "",
        credentialUrl: ""
      },
      {
        name: "تدريب HSBC المصرفي عن بُعد",
        issuer: "HSBC",
        date: "",
        details: "اكتساب معرفة بالقروض وخدمة العملاء والعمليات المصرفية.",
        credentialUrl: ""
      },
      {
        name: "التسويق الرقمي",
        issuer: "Google",
        date: "",
        details: "",
        credentialUrl: ""
      },
      {
        name: "الخدمات اللوجستية المتكاملة",
        issuer: "Mr. Logistics co.",
        date: "",
        details: "",
        credentialUrl: ""
      }
    ],
    projects: [
      {
        id: "steam-analytics",
        filterKey: "gaming",
        title: "دراسة وتصنيف سوق الألعاب العالمي (Steam Market Intelligence)",
        category: "تحليل البيانات الضخمة والألعاب",
        badge: "لوحة إكسيل",
        image: "/assets/dashboard_steam.jpg",
        imageAlt: "لقطة شاشة للوحة إكسيل لتحليل Steam: نسبة التقييمات الإيجابية والسلبية، ودعم أنظمة التشغيل، ونسبة الألعاب المجانية، وأعلى 10 ألعاب من حيث اللاعبين المتزامنين والتقييمات الإيجابية والسلبية.",
        excelFile: "Database.xlsx",
        excelPath: "/assets/Database.xlsx",
        datasetOnRequest: false,
        description: "مشروع تحليل شامل لأكثر من 22,500 لعبة على منصة Steam، بتتبع أكثر من 5.7 مليون لاعب متزامن (CCU)، وتحليل نسب التقييمات الإيجابية والسلبية، وتوافق أنظمة التشغيل (Windows, Mac, Linux)، والنموذج المجاني مقابل المدفوع.",
        highlights: [
          "تتبع 5,705,135 لاعب متزامن (CCU) عبر 22,521 لعبة على Steam، بمتوسط نحو 253 لاعب لكل لعبة.",
          "نسبة التقييم الإيجابي 86.0% مقابل 14.0% تقييمات سلبية في قاعدة البيانات.",
          "دعم أنظمة التشغيل حسب نسبة الألعاب: Windows ≈100% (22,515)، وMac 27% (6,057)، وLinux 18% (4,083).",
          "المجاني مقابل المدفوع: 2,947 لعبة مجانية (13%) مقابل 19,574 مدفوعة (87%).",
          "أعلى الألعاب من حيث اللاعبين المتزامنين: Counter-Strike: Global Offensive (1,013,936)، PUBG: BATTLEGROUNDS (314,682)، ELDEN RING NIGHTREIGN (163,599)، Rust (143,870)."
        ],
        caseStudy: {
          problem: "[أضف السؤال التجاري أو المشكلة التي أجاب عنها هذا التحليل]",
          dataSource: "قاعدة بيانات ألعاب Steam (Database.xlsx، ورقة “extended_steam_games”): 22,521 لعبة تتضمن التقييمات واللاعبين المتزامنين (CCU) والسعر وتاريخ الإصدار والتصنيف العمري والأنواع ودعم أنظمة التشغيل.",
          period: "ألعاب صدرت من 30 يونيو 1997 إلى 5 أغسطس 2026. [أضف تاريخ لقطة بيانات اللاعبين المتزامنين والتقييمات]",
          tools: "لوحة إكسيل مبنية بالجداول المحورية (PivotTables) والفلاتر التفاعلية (Slicers) والرسوم البيانية، مع Power Query. [أضف أي أدوات أخرى مستخدمة]",
          methods: "نسبة التقييم الإيجابي = التقييمات الإيجابية ÷ (الإيجابية + السلبية). تم احتساب 22,521 لعبة، مع استبعاد 3 صفوف فارغة أو ملخصة في أسفل الورقة. [أضف خطوات تنظيف البيانات وأي منهجيات أخرى]",
          outcome: "[أضف النتيجة القابلة للقياس أو التوصية]"
        }
      },
      {
        id: "cost-variance",
        filterKey: "cost",
        title: "لوحة تحليل مخرجات الإنتاج وانحراف الكميات (Manufacturing Cost Variance)",
        category: "محاسبة التكاليف والإنتاج",
        badge: "Production Order Visual Report",
        image: "/assets/dashboard_cost.jpg",
        imageAlt: "لقطة شاشة للوحة إكسيل لتحليل الإنتاج: الكمية المنتجة يومياً، وإجمالي انحراف الكميات، وأعلى 10 منتجات انحرافاً، وأوامر الإنتاج حسب الشركة، وأعلى 10 منتجات من حيث الكمية المنتجة.",
        excelFile: "Production Order Visual Report.xlsx",
        excelPath: "/assets/Production_Order_Visual_Report.xlsx",
        datasetOnRequest: false,
        description: "داشبورد لمحاسبة التكاليف الصناعية لإنتاج شهر أغسطس 2026: 465,165 وحدة منتجة لمجموعة منتجات التجميل والعناية الشخصية، مع تحليل انحراف الكميات (3,657 وحدة) وأعلى المنتجات إنتاجاً.",
        highlights: [
          "تتبع إنتاج 465,165 وحدة مقابل 468,822 وحدة مطلوبة (99.2%) عبر 418 سطر أمر إنتاج في أغسطس 2026.",
          "كشف عجز في الكميات بلغ 3,657 وحدة (المطلوب ناقص المنتج) وترتيب أعلى 10 منتجات مسببة له، بقيادة جلين من Senor وزن 250 جم (804 و798 وحدة).",
          "ترتيب أعلى 10 منتجات من حيث الكمية المنتجة، بقيادة هير واكس أسود Senor وزن 100 جم (86,384 وحدة).",
          "رصد أوامر الإنتاج عبر 19 شركة (Senor بقيادة 141 سطراً، يليها Leven بـ 98 سطراً)."
        ],
        caseStudy: {
          problem: "[أضف السؤال التجاري أو المشكلة التي عالجتها هذه اللوحة]",
          dataSource: "ورقة أوامر الإنتاج “Aug” (Production_Order_Visual_Report.xlsx): 418 سطر يتضمن الشركة والتاريخ ورقم أمر الإنتاج والمنتج والكمية المطلوبة والكمية المنتجة والانحراف.",
          period: "من 1 أغسطس 2026 إلى 31 أغسطس 2026.",
          tools: "لوحة إكسيل مبنية بالجداول المحورية (PivotTables) والفلاتر التفاعلية (Slicers: التاريخ والشركة) والرسوم البيانية. [أضف أي أدوات أخرى مستخدمة]",
          methods: "انحراف الكمية = الكمية المطلوبة − الكمية المنتجة (3,657 وحدة، أي 0.8% من 468,822 وحدة مطلوبة). [أضف خطوات تنظيف البيانات وأي منهجيات أخرى]",
          outcome: "[أضف النتيجة القابلة للقياس أو التوصية]"
        }
      },
      {
        id: "misuo-ecommerce",
        filterKey: "ecommerce",
        title: "داشبورد تحليلات مبيعات وحالة توصيل شركة MISUO للتجارة الإلكترونية",
        category: "تحليلات التجارة الإلكترونية وسلاسل الإمداد",
        badge: "MISUO Dashboard",
        image: "/assets/dashboard_misuo.jpg",
        imageAlt: "لقطة شاشة للوحة إكسيل لشركة MISUO: إجمالي المبيعات، وعدد الطلبات، ومتوسط سعر البيع، والمبيعات حسب المنصة، والمنتج الأكثر مبيعاً، وحالة التوصيل، والطلبات حسب المحافظة.",
        excelFile: "MISUO - Abdelaziz Usama Mahmoud.xlsx",
        excelPath: "",
        datasetOnRequest: true,
        description: "داشبورد للمبيعات والتوصيل مبني على 126 سطر طلب (152 قطعة، بإجمالي 1,292,886 جنيه) بين يوليو وديسمبر 2024، مع تتبع التوزيع الجغرافي للمحافظات وقنوات البيع والمنتجات الأعلى مبيعاً وحالة التوصيل.",
        highlights: [
          "تحليل مبيعات بلغت 1,292,886 جنيه عبر 126 سطر طلب (152 قطعة)، بمتوسط سعر بيع 10,261 جنيه لكل سطر.",
          "تصدر محافظة القاهرة للطلب بـ 60 سطراً، تليها الجيزة بـ 24 ثم القليوبية بـ 11.",
          "تفوق منصة HomeMart كأعلى قناة بيع بـ 94 قطعة مباعة.",
          "حالة التوصيل عبر أسطر الطلبات: 81% تم تسليمها، و18% مرفوضة، و1% مرتجعة."
        ],
        caseStudy: {
          problem: "تحديد المنتجات الأعلى والأقل مبيعاً (الهدف المذكور في ورقة التعليمات داخل الملف).",
          dataSource: "ملف طلبات MISUO (MISUO_Abdelaziz_Usama_Mahmoud.xlsx، ورقة “البيانات”): 126 سطر طلب يتضمن نوع العميل والمحافظة ومنصة البيع والمنتج والكمية والسعر وحالة التوصيل.",
          period: "طلبات بتاريخ من 27 يوليو 2024 إلى 14 ديسمبر 2024.",
          tools: "لوحة إكسيل مبنية بالجداول المحورية (PivotTables) والفلاتر التفاعلية (Slicers) والرسوم البيانية، مع Power Query. [أضف أي أدوات أخرى مستخدمة]",
          methods: "نسبة حالة التوصيل = عدد أسطر كل حالة ÷ إجمالي 126 سطر. متوسط سعر البيع = متوسط سعر البيع لكل سطر طلب. [أضف خطوات تنظيف البيانات وأي منهجيات أخرى]",
          outcome: "[أضف النتيجة القابلة للقياس أو التوصية]"
        }
      },
      {
        id: "sales-analysis",
        filterKey: "sales",
        title: "تحليل المبيعات الإجمالي 2026: هيكل الإيرادات وتركّز العملاء والاتجاه الشهري",
        category: "تحليلات المبيعات وهيكل الإيرادات",
        badge: "لوحة إكسيل",
        image: "/assets/dashboard_logistics.png",
        imageAlt: "لقطة شاشة للوحة إكسيل لتحليل المبيعات 2026: المنتج الأكثر مبيعاً، وإجمالي المبيعات، وأفضل فئة إيرادات، وأعلى 10 منتجات وعملاء، والمبيعات حسب المنطقة وحسب الشهر.",
        excelFile: "Overall Dashboard Sales Analysis 2026.xlsx",
        excelPath: "",
        datasetOnRequest: true,
        description: "داشبورد لتحليل المبيعات مبني على تصدير فواتير من نظام ERP لعام 2026: 12.5 مليون إجمالي مبيعات عبر 1,634 فاتورة و781 عميل، موزعة حسب فئة العملاء وحساب الإيرادات والمنطقة والشهر.",
        highlights: [
          "تحليل إجمالي مبيعات بلغ 12,509,078 (شاملاً ضريبة 15%) عبر 1,634 فاتورة و781 عميل، من 1 يناير 2026 إلى 31 أكتوبر 2026.",
          "تركّز العملاء: أكبر عميل يمثل وحده 96.5% من المبيعات (أكبر 3 عملاء: 97.5%)، وجميعها من حساب إيرادات اللوجستيات.",
          "بلغت المبيعات الشهرية ذروتها في فبراير (2,508,189) وكانت الأدنى في أكتوبر (530,689).",
          "المبيعات حسب المنطقة: المنطقة الوسطي 12,071,025، الدمام - الخبر 433,500، المنطقة الغربية 4,553."
        ],
        caseStudy: {
          problem: "[أضف السؤال التجاري أو المشكلة التي أجاب عنها هذا التحليل]",
          dataSource: "تصدير فواتير مبيعات من نظام ERP (Overall_Dashboard_Sales_Analysis_2026.xlsx، ورقة “Query Report”): 2,129 سطر فاتورة يتضمن الصنف ومجموعة العملاء والإقليم وحساب الإيرادات والمبلغ والضريبة والإجمالي. العملة غير مذكورة في الملف. [أضف العملة]",
          period: "من 1 يناير 2026 إلى 31 أكتوبر 2026.",
          tools: "لوحة إكسيل مبنية بالجداول المحورية (PivotTables) والفلاتر التفاعلية (Slicers) والرسوم البيانية. [أضف أي أدوات أخرى مستخدمة]",
          methods: "إجمالي المبيعات = إجمالي الفاتورة شاملاً ضريبة 15% (الصافي 10,877,459 + الضريبة 1,631,619). [أضف خطوات تنظيف البيانات وأي منهجيات أخرى]",
          outcome: "[أضف النتيجة القابلة للقياس أو التوصية]"
        }
      }
    ]
  }
};
