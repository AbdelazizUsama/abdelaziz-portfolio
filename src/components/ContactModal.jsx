import React, { useState } from 'react';
import { X, Mail, MapPin, Copy, Check, Send, Phone, Linkedin, Github } from 'lucide-react';
import { portfolioData } from '../data/portfolio_content';
import useDialog from '../utils/useDialog';

/* CONTACT FORM
   '' (default): "Open Email Draft" builds a prefilled mailto: draft and opens the visitor's email app.
                 The dialog says plainly that NOTHING has been sent until they press Send there.
   or paste a form-backend endpoint, e.g. Formspree: 'https://formspree.io/f/xxxxxxxx'.
   The form then POSTs JSON {name, email, message} and shows success ONLY if the server answers OK. */
const FORM_ENDPOINT = '';

const T = {
  en: {
    title: 'Contact Abdelaziz Usama', sub: 'Open for full-time roles, BI consulting & project inquiries',
    close: 'Close dialog', copy: 'Copy email address', copied: 'Email address copied', copyFail: 'Could not copy. Please select the address and copy it manually.',
    name: 'Name / Company', namePh: 'e.g. Acme Inc', email: 'Your email', emailPh: 'you@example.com',
    message: 'Message', messagePh: 'Write message...',
    send: 'Send Message', draft: 'Open Email Draft', sending: 'Sending…',
    note: 'This form opens a draft in your email app. It does not send anything by itself.',
    sent: 'Thank you. Your message was submitted successfully.',
    draftMsg: (e) => `Your email app should now open with a draft addressed to ${e}. Nothing has been sent yet: please review the draft and press Send in your email app. If nothing opened, email me directly at ${e}.`,
    error: (e) => `Sorry, your message could not be sent. Please try again, or email me directly at ${e}.`,
    labels: { phone: 'Phone', linkedin: 'LinkedIn', github: 'GitHub' }, tab: 'opens in a new tab',
  },
  ar: {
    title: 'تواصل مع عبدالعزيز اسامه', sub: 'يسعدني مناقشة فرص العمل، الاستشارات، ومشاريع تحليل البيانات',
    close: 'إغلاق النافذة', copy: 'نسخ البريد الإلكتروني', copied: 'تم نسخ البريد الإلكتروني', copyFail: 'تعذّر النسخ. يرجى تحديد العنوان ونسخه يدوياً.',
    name: 'الاسم / الشركة', namePh: 'مثال: أثر للاستشارات', email: 'بريدك الإلكتروني', emailPh: 'you@example.com',
    message: 'تفاصيل الرسالة', messagePh: 'اكتب الرسالة هنا...',
    send: 'إرسال الرسالة', draft: 'فتح مسودة البريد', sending: 'جارٍ الإرسال…',
    note: 'يفتح هذا النموذج مسودة رسالة في تطبيق البريد لديك، ولا يرسل أي شيء من تلقاء نفسه.',
    sent: 'شكراً لك. تم إرسال رسالتك بنجاح.',
    draftMsg: (e) => `من المفترض أن يفتح تطبيق البريد لديك الآن بمسودة موجّهة إلى ${e}. لم يتم إرسال أي شيء بعد: يرجى مراجعة المسودة ثم الضغط على «إرسال» في تطبيق البريد. إذا لم يُفتح شيء، راسلني مباشرة على ${e}.`,
    error: (e) => `عذراً، تعذّر إرسال رسالتك. يرجى المحاولة مرة أخرى، أو مراسلتي مباشرة على ${e}.`,
    labels: { phone: 'الهاتف', linkedin: 'لينكدإن', github: 'جيت هاب' }, tab: 'يفتح في علامة تبويب جديدة',
  },
};

const field = 'w-full px-3 py-2.5 rounded-lg bg-[#202428] border border-[#30363B] text-xs text-[#F1F3F4] placeholder-[#A3ADB5] focus:border-[#78A99B]';
const row = 'flex items-center gap-2 p-2.5 rounded-xl bg-[#202428] border border-[#30363B] text-xs font-semibold text-[#F1F3F4]';

export default function ContactModal({ lang, onClose }) {
  const isAr = lang === 'ar';
  const t = T[lang];
  const info = portfolioData[lang].personal;
  const { dialogRef, closeRef } = useDialog(onClose);

  const [copy, setCopy] = useState('idle'); // idle | ok | fail
  const [form, setForm] = useState({ name: '', email: '', message: '', website: '' });
  const [status, setStatus] = useState('idle'); // idle | sending | draft | sent | error
  const setField = (k) => (e) => setForm((f) => ({ ...f, [k]: e.target.value }));

  const handleCopyEmail = async () => {
    try {
      await navigator.clipboard.writeText(info.email);
      setCopy('ok');
    } catch (err) {
      setCopy('fail');
    }
    setTimeout(() => setCopy('idle'), 2500);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (form.website) return; // honeypot: real visitors never see or fill it
    const { name, email, message } = form;

    if (FORM_ENDPOINT) {
      setStatus('sending');
      try {
        const res = await fetch(FORM_ENDPOINT, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
          body: JSON.stringify({ name, email, message }),
        });
        if (res.ok) { setStatus('sent'); setForm({ name: '', email: '', message: '', website: '' }); }
        else setStatus('error');
      } catch (err) {
        setStatus('error');
      }
      return;
    }

    // No endpoint: open a prefilled draft. We cannot know whether it is ever sent, so we never say it was.
    const subject = `Portfolio inquiry from ${name}`;
    const body = `${message}\n\n--\n${name}${email ? `\n${email}` : ''}`;
    window.location.href = `mailto:${info.email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
    setStatus('draft');
  };

  const statusText = status === 'sent' ? t.sent : status === 'draft' ? t.draftMsg(info.email) : status === 'error' ? t.error(info.email) : status === 'sending' ? t.sending : '';
  const phoneDigits = (info.phone || '').replace(/\s+/g, '');

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md overflow-y-auto"
         onMouseDown={(e) => { if (e.target === e.currentTarget) onClose(); }}>
      <div
        ref={dialogRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby="contact-title"
        dir={isAr ? 'rtl' : 'ltr'}
        className="relative w-full max-w-md bg-[#191C1F] border border-[#30363B] rounded-2xl p-5 space-y-3 shadow-2xl text-[#F1F3F4] my-8"
      >

        <button
          ref={closeRef}
          type="button"
          onClick={onClose}
          aria-label={t.close}
          className="absolute top-4 end-4 w-9 h-9 rounded-lg bg-[#202428] border border-[#30363B] text-[#A3ADB5] hover:text-[#F1F3F4] flex items-center justify-center"
        >
          <X className="w-4 h-4" aria-hidden="true" />
        </button>

        {/* Modal Header */}
        <div className="text-center mb-4">
          <div className="w-10 h-10 rounded-xl bg-[#202428] border border-[#30363B] mx-auto flex items-center justify-center mb-2">
            <Mail className="w-5 h-5 text-[#78A99B]" aria-hidden="true" />
          </div>
          <h2 id="contact-title" className="text-base font-bold text-[#F1F3F4]">{t.title}</h2>
          <p className="text-xs text-[#A3ADB5] mt-1">{t.sub}</p>
        </div>

        {/* Contact Info */}
        <ul className="space-y-2 mb-4">
          <li className="flex items-center justify-between gap-2 p-2.5 rounded-xl bg-[#202428] border border-[#30363B]">
            <a href={`mailto:${info.email}`} className="flex items-center gap-2 min-w-0 text-xs font-semibold text-[#F1F3F4] hover:text-[#78A99B]">
              <Mail className="w-4 h-4 text-[#78A99B] shrink-0" aria-hidden="true" />
              <bdi className="truncate">{info.email}</bdi>
            </a>
            <button
              type="button"
              onClick={handleCopyEmail}
              aria-label={t.copy}
              className="p-2 rounded bg-[#191C1F] text-[#A3ADB5] hover:text-[#F1F3F4] border border-[#30363B]"
            >
              {copy === 'ok' ? <Check className="w-3.5 h-3.5 text-[#81C784]" aria-hidden="true" /> : <Copy className="w-3.5 h-3.5" aria-hidden="true" />}
            </button>
          </li>
          {info.phone ? (
            <li>
              <a href={`tel:${phoneDigits}`} className={`${row} hover:text-[#78A99B]`}>
                <Phone className="w-4 h-4 text-[#78A99B]" aria-hidden="true" />
                <span className="sr-only">{t.labels.phone}: </span><bdi>{info.phone}</bdi>
              </a>
            </li>
          ) : null}
          <li>
            <a href={info.linkedin} target="_blank" rel="noopener noreferrer" className={`${row} hover:text-[#78A99B]`}>
              <Linkedin className="w-4 h-4 text-[#78A99B]" aria-hidden="true" />
              <span>{t.labels.linkedin}<span className="sr-only"> ({t.tab})</span></span>
            </a>
          </li>
          <li>
            <a href={info.github} target="_blank" rel="noopener noreferrer" className={`${row} hover:text-[#78A99B]`}>
              <Github className="w-4 h-4 text-[#78A99B]" aria-hidden="true" />
              <span>{t.labels.github}<span className="sr-only"> ({t.tab})</span></span>
            </a>
          </li>
          <li className={row}>
            <MapPin className="w-4 h-4 text-[#78A99B]" aria-hidden="true" />
            <span>{info.location}</span>
          </li>
        </ul>
        <p className="text-xs text-[#A3ADB5] min-h-[1rem]" role="status" aria-live="polite">
          {copy === 'ok' ? t.copied : copy === 'fail' ? t.copyFail : ''}
        </p>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-3">
          <div>
            <label htmlFor="cm-name" className="block text-xs font-semibold text-[#A3ADB5] mb-1">{t.name}</label>
            <input id="cm-name" name="name" required type="text" autoComplete="name" dir="auto"
              value={form.name} onChange={setField('name')} placeholder={t.namePh} className={field} />
          </div>

          <div>
            <label htmlFor="cm-email" className="block text-xs font-semibold text-[#A3ADB5] mb-1">{t.email}</label>
            <input id="cm-email" name="email" required={Boolean(FORM_ENDPOINT)} type="email" autoComplete="email" dir="ltr"
              value={form.email} onChange={setField('email')} placeholder={t.emailPh} className={field} />
          </div>

          <div>
            <label htmlFor="cm-message" className="block text-xs font-semibold text-[#A3ADB5] mb-1">{t.message}</label>
            <textarea id="cm-message" name="message" required rows={3} dir="auto"
              value={form.message} onChange={setField('message')} placeholder={t.messagePh} className={field} />
          </div>

          {/* Honeypot (spam trap): hidden from people and assistive tech */}
          <div aria-hidden="true" style={{ position: 'absolute', left: '-9999px', width: '1px', height: '1px', overflow: 'hidden' }}>
            <label>Website<input type="text" name="website" tabIndex={-1} autoComplete="off" value={form.website} onChange={setField('website')} /></label>
          </div>

          {!FORM_ENDPOINT && <p className="text-xs text-[#A3ADB5]">{t.note}</p>}

          <button
            type="submit"
            disabled={status === 'sending'}
            aria-busy={status === 'sending'}
            className="w-full py-3 rounded-xl bg-[#78A99B] hover:bg-[#8DBBAC] text-[#111315] font-bold text-xs flex items-center justify-center gap-2 transition-all shadow-sm disabled:opacity-70"
          >
            <Send className="w-3.5 h-3.5" aria-hidden="true" />
            <span>{status === 'sending' ? t.sending : (FORM_ENDPOINT ? t.send : t.draft)}</span>
          </button>

          {/* Accurate, announced result message */}
          <div role="status" aria-live="polite" id="contact-status" data-status={status}
               className={`text-xs leading-relaxed ${status === 'error' ? 'text-[#E57373] font-semibold' : 'text-[#F1F3F4]'} ${statusText ? 'p-3 rounded-xl bg-[#202428] border border-[#30363B]' : ''}`}>
            {statusText}
          </div>
        </form>

      </div>
    </div>
  );
}
