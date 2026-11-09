import {
  ArrowRight,
  CircleCheck, Award, MessageCircle,
  CalendarDays,
  Clock,
  MapPin,
  Phone,
  Eye,
  ScanEye,
  ChevronDown,
  Mail,
  Stethoscope,
  Play,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import {
  clinic,
  doctors,
  tests,
  surgery,
  faq,
  type Lang,
} from "../../lib/clinic";
import Script from "next/script";
import { visitCards } from "../../lib/visit";
import { services } from "../../lib/services";
import Nav from "../../components/Nav";
import Form from "../../components/Form";
import Image from "next/image";
type Params = { params: Promise<{ lang: Lang }> };
export async function generateMetadata({ params }: Params) {
  const { lang } = await params,
    bn = lang === "bn",
    base = process.env.SITE_URL;
  const title = bn
    ? "ডা. জাহাঙ্গীর আই কেয়ার | সিরাজগঞ্জ"
    : "Dr-Jahangir Eye Care | Eye clinic in Sirajganj";
  const description = bn
    ? "চিকিৎসক পরিচিতি, চোখের পরীক্ষার আনুমানিক খরচ ও চেম্বারের সময়সূচি দেখুন।"
    : "Find eye examination fees, chamber hours and appointment information for Dr. Jahangir Alam in Sirajganj.";
  return {
    title,
    description,
    robots: { index: !!base, follow: !!base },
    ...(base
      ? {
          metadataBase: new URL(base),
          alternates: {
            canonical: "/" + lang,
            languages: { bn: "/bn", en: "/en", "x-default": "/bn" },
          },
        }
      : {}),
    openGraph: {
      title,
      description,
      locale: bn ? "bn_BD" : "en_US",
      type: "website",
    },
    twitter: { card: "summary" as const, title, description },
  };
}
export default async function Page({ params }: Params) {
  const { lang } = await params,
    i = lang === "bn" ? 0 : 1,
    t = (b: string, e: string) => [b, e][i],
    d = doctors[0],
    digits = new Intl.NumberFormat(lang === "bn" ? "bn-BD" : "en-BD");
  const mapUrl = process.env.CLINIC_MAP_URL || "https://www.google.com/maps/search/?api=1&query="+encodeURIComponent(clinic.address[1]+", Bangladesh");
  const book = t("অ্যাপয়েন্টমেন্ট নিন", "Make an appointment"),
    loc = t("সিরাজগঞ্জ, বাংলাদেশ", "Sirajganj, Bangladesh");
  const data = {
    "@context": "https://schema.org",
    "@type": "MedicalClinic",
    name: clinic.name,
    telephone: clinic.phone,
    openingHours: "Mo-Th,Sa-Su 14:00-20:00",
    employee: { "@type": "Physician", name: d.name[i], jobTitle: d.specialty[i] },
    address: {
      "@type": "PostalAddress",
      streetAddress: clinic.address[1],
      addressLocality: "Sirajganj",
      addressCountry: "BD",
    },
    ...(process.env.SITE_URL
      ? { url: process.env.SITE_URL, logo: process.env.SITE_URL + "/logo.svg" }
      : {}),
  };
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(data).replace(/</g, "\\u003c"),
        }}
      />
      <a className="skip" href="#main">
        {t("মূল অংশে যান", "Skip to content")}
      </a>
      <Nav lang={lang} />
      <Script src="/appointment-draft.js" strategy="afterInteractive" />
      <main id="main">
        <section className="hero" id="home">
          <div className="wrap heroGrid">
            <div className="heroCopy">
              <h1>{t("আপনার চোখ","Your Eyes,")}<br/>{t("আমাদের যত্ন।","Our Care")}</h1>
              <p>
                {t(
                  "ডা. জাহাঙ্গীর আলমের চেম্বারে চোখের পরীক্ষা ও ছানি চিকিৎসার পরামর্শ নিন। আসার আগে সেবার খরচ ও সময়সূচি জেনে নিন।",
                  "Eye examinations and cataract consultations with Dr. Jahangir Alam, eye specialist and phaco surgeon in Sirajganj.",
                )}
              </p>
              <div className="actions">
                <a className="btn" href="#appointment">
                  {book}
                </a>
                <a className="btn light" href="#contact">
                  {t("যোগাযোগ করুন", "Contact us")}
                </a>
              </div>
            </div>
            <div className="portrait">
              <svg className="heroWave" viewBox="0 0 620 160" aria-hidden="true"><circle cx="8" cy="102" r="7" fill="currentColor"/><circle cx="608" cy="102" r="7" fill="currentColor"/><path d="M8 102h94l14-25 18 45 24-102 24 128 20-56 18 10h128l20-30 17 49 24-91 22 82 15-10H608" fill="none" stroke="currentColor" strokeWidth="8" strokeLinecap="round" strokeLinejoin="round"/></svg>
              <Image
                src={d.photo}
                width={825}
                height={1100}
                preload
                alt={d.name[i]}
              />
              <span className="heroBadge experience"><CircleCheck size={18}/>{t("১০ বছরের অভিজ্ঞতা","10 years of experience")}</span>
              <span className="heroBadge specialty"><Award size={18}/>{t("ফ্যাকো সার্জন","Phaco surgeon")}</span>
              <a className="nameplate" href="#appointment">
                <img src="/portrait-alt.jpg" alt="" width="46" height="46"/>
                <span><strong>{d.name[i]}</strong><small>{d.specialty[i]}</small></span>
                <span className="miniBook">{book}<ArrowRight size={17}/></span>
              </a>
            </div>
          </div>
        </section>
        <aside className="wrap quick">
          {[
            [
              MapPin,
              t("চেম্বারের ঠিকানা", "Chamber address"),
              clinic.address[i],
            ],
            [Clock, t("রোগী দেখার সময়", "Chamber hours"), clinic.hours[i]],
            [Phone, t("যোগাযোগ", "Call the chamber"), clinic.displayPhone],
          ].map(([Icon, label, value], j) => {
            const I = Icon as typeof Phone;
            return (
              <div key={j}>
                <I />
                <span>
                  <small>{String(label)}</small>
                  {j === 2 ? (
                    <a href={"tel:" + clinic.phone}>{String(value)}</a>
                  ) : (
                    <b>{String(value)}</b>
                  )}
                </span>
              </div>
            );
          })}
        </aside>
        <section className="wrap section aboutFeature" id="about">
          <div className="aboutLead"><h2>{t("আমাদের সম্পর্কে","About us")}</h2>
          <p>{t("সিরাজগঞ্জে চোখের পরীক্ষা থেকে ছানি চিকিৎসা পর্যন্ত, আপনার যত্নের প্রতিটি ধাপ বুঝতে পাশে আছি।","From an eye examination to a cataract consultation, we want you to understand each step of your care.")}</p></div>
          <div className="aboutColumns"><figure className="aboutPhoto aboutCarousel" data-about-carousel data-current="0" data-orientation="portrait" aria-roledescription="carousel" aria-label={t("আমাদের সম্পর্কে ছবি","About us photo gallery")}>
            <div className="aboutCarouselStage">
              {[
                { src: "/doctor.png", width: 825, height: 1100, orientation: "portrait", alt: t("ডা. জাহাঙ্গীর আলম","Dr. Jahangir Alam") },
                { src: "/appointment.jpg", width: 1000, height: 667, orientation: "landscape", alt: t("চেম্বারে রোগীর সঙ্গে চিকিৎসক","A doctor speaking with a patient at the clinic") },
                { src: "/portrait-alt.jpg", width: 520, height: 520, orientation: "square", alt: t("ডা. জাহাঙ্গীর আলমের প্রতিকৃতি","Portrait of Dr. Jahangir Alam") },
              ].map((slide, index) => (
                <div className={`aboutSlide${index === 0 ? " is-active" : ""}`} data-about-slide={index} data-orientation={slide.orientation} aria-hidden={index !== 0} key={slide.src}>
                  <Image src={slide.src} width={slide.width} height={slide.height} alt={slide.alt} sizes="(max-width: 720px) 76vw, 330px" />
                </div>
              ))}
            </div>
            <div className="aboutCarouselControls">
              <button type="button" data-about-step="-1" aria-label={t("আগের ছবি","Previous image")}><ChevronLeft size={19}/></button>
              <div className="aboutCarouselIndicators" role="group" aria-label={t("ছবি নির্বাচন","Choose an image")}>
                {[0, 1, 2].map((index) => <button type="button" data-about-index={index} aria-label={t(`ছবি ${index + 1}`, `Image ${index + 1}`)} aria-pressed={index === 0} className={index === 0 ? "is-active" : ""} key={index}><span/></button>)}
              </div>
              <button type="button" data-about-step="1" aria-label={t("পরের ছবি","Next image")}><ChevronRight size={19}/></button>
            </div>
          </figure>
          <div className="aboutText"><h3>{t("আমাদের লক্ষ্য","Our vision")}</h3><p>{t("সিরাজগঞ্জের মানুষ যেন কাছাকাছি বিশেষজ্ঞের পরামর্শ নিয়ে নিজের চোখের যত্নের সিদ্ধান্ত নিতে পারেন।","For people in Sirajganj to make informed decisions about their eyesight with specialist care close to home.")}</p>
          <h3>{t("আমাদের অঙ্গীকার","Our mission")}</h3><ul>{[
            t("রোগীর কথা শুনে চোখের সমস্যা বুঝতে সময় দেওয়া।","Take time to listen to each patient’s concerns."),
            t("পরীক্ষা ও চিকিৎসার বিকল্প সহজ ভাষায় বোঝানো।","Explain examination and treatment options in plain language."),
            t("ভিজিটের আগে খরচ ও চেম্বারের সময় জানতে সাহায্য করা।","Help patients review fees and visiting hours before they arrive.")
          ].map(line=><li key={line}>{line}</li>)}</ul><a className="textlink" href="#doctors">{t("চিকিৎসক পরিচিতি","Meet the specialist")} <ArrowRight size={17}/></a></div></div>
        </section>
        <section className="tinted" id="services">
          <div className="wrap section">
            <span className="eyebrow">
              {t("সেবা ও খরচ", "Services & fees")}
            </span>
            <h2>
              {t("চোখের পরীক্ষা ও অস্ত্রোপচার", "Examinations and surgery")}
            </h2>
            <p>
              {t(
                "খরচগুলো আনুমানিক। রোগীর অবস্থা অনুযায়ী খরচ বদলাতে পারে। সেবার প্রাপ্যতা ও সঠিক মূল্য ফোনে নিশ্চিত করুন।",
                "These are estimates. Costs depend on your individual needs. Please call to confirm availability and the final fee.",
              )}
            </p>
            <div className="cards">
              {[tests, surgery].map((rows, j) => (
                <article key={j} className="price" id={j?"surgery-fees":"exam-fees"}>
                  <div className="priceHead">
                    {j ? <ScanEye /> : <Eye />}
                    <span>
                      {j
                        ? t("অস্ত্রোপচারের খরচ", "Surgery estimates")
                        : t("পরীক্ষার খরচ", "Examination fees")}
                    </span>
                    <span className="priceStatus">{t("সবসময় খোলা", "Always open")}</span>
                  </div>
                  <dl>
                    {rows.map((row) => (
                      <div className="priceRow" key={row[1]}>
                        <dt>{row[i]}</dt>
                        <dd>
                          ৳{digits.format(row[2])}
                          {row.length === 4 ? "–" + digits.format(row[3]) : ""}
                        </dd>
                      </div>
                    ))}
                  </dl>
                  <a href="#appointment">{book} →</a>
                </article>
              ))}
            </div>
          </div>
        </section>
        <section id="patient-stories" className="storyBand videoBand"><div className="wrap section videoLayout">
          <div><span className="eyebrow">{t("রোগীর গল্প","Patient stories")}</span>
          <h2>{t("চেম্বারে একটি ভিজিট","A visit to the chamber")}</h2>
          <p>{t("রোগীর অনুমতি নিয়ে ভাগ করা ছোট ভিডিও গল্প দেখুন। গল্প বদলাতে নিচের নিয়ন্ত্রণ ব্যবহার করুন।","Watch short patient-story previews shared with permission. Use the controls to switch stories.")}</p>
          <div className="storySwitcher" role="tablist" aria-label={t("রোগীর গল্প বাছাই","Choose a patient story")}>
            <button type="button" id="story-tab-0" className="is-active" data-video-story="0" role="tab" aria-controls="story-panel" aria-selected="true" tabIndex={0}>{t("চেম্বারে আসা","Arriving at the chamber")}</button>
            <button type="button" id="story-tab-1" data-video-story="1" role="tab" aria-controls="story-panel" aria-selected="false" tabIndex={-1}>{t("পরামর্শের পর","After a consultation")}</button>
          </div></div>
          <div className="videoFrame" id="story-panel" data-story-panel role="tabpanel" aria-labelledby="story-tab-0" tabIndex={0}>
            <img className="videoSource" data-video-frame="0" src="/appointment.jpg" alt="" aria-hidden="true" />
            <img className="videoSource" data-video-frame="1" src="/portrait-alt.jpg" alt="" aria-hidden="true" />
            <video className="testimonialVideo is-active" data-story-video="0" controls playsInline preload="metadata" poster="/appointment.jpg" />
            <video className="testimonialVideo" data-story-video="1" controls playsInline preload="metadata" poster="/portrait-alt.jpg" />
            <span className="videoPlay" aria-hidden="true"><Play size={18} fill="currentColor"/></span>
          </div>
        </div></section>
        <section id="testimonials" className="storyBand storyBandSecondary"><div className="wrap section storyLayout">
          <div><span className="eyebrow">{t("রোগীর মতামত","Patient feedback")}</span>
          <h2>{t("আপনার অভিজ্ঞতা","Your experience")}</h2><p>{t("চেম্বারে আসার অভিজ্ঞতা আমাদের জানাতে পারেন। রোগীর অনুমতি নিয়েই তাঁর গল্প প্রকাশ করা হবে।","Tell us about your visit. We publish patient stories only with the patient’s permission.")}</p></div>
          <div className="storyNote"><Mail size={28}/><h3>{t("চেম্বারে মতামত পাঠান","Write to the chamber")}</h3><p>{t("কী ভালো লেগেছে বা কীভাবে ভিজিট আরও সহজ হতে পারে, তা জানিয়ে লিখুন।","What went well during your visit? What could we make easier next time?")}</p><a className="textlink" href={"mailto:"+clinic.email}>{t("মতামত জানান","Share feedback")} <ArrowRight size={17}/></a></div></div></section>
        <section className="wrap section" id="doctors">
          <div className="doctorHeading"><span className="eyebrow">{t("আমাদের চিকিৎসক","Our doctors")}</span><h2>{t("আপনার চক্ষু বিশেষজ্ঞ","Meet your eye specialist")}</h2></div>
          <div className="doctorViewport"><div className="doctorDeck">{doctors.map((doc,index)=><article className={"specialistCard tone-"+(index%4)} key={doc.id}>
            <div className="specialistPhoto"><Image src={doc.photo} width={320} height={420} alt={doc.name[i]}/></div>
            <h3>{doc.name[i]}</h3><p>{doc.specialty[i]}</p>
            <div className="doctorProfile"><p>{doc.role[i]}<br/>{doc.hospital[i]}</p><p className="credentials"><strong>🎓 {t("যোগ্যতা","Qualifications")}:</strong> {doc.credentials.join(", ")}</p><ul className="doctorFacts"><li><strong>⏳ {t("অভিজ্ঞতা","Experience")}:</strong> {doc.experience[i]}</li><li><strong>৳ {t("পরামর্শ ফি","Consultation fee")}:</strong> {doc.consultationFee[i]}</li><li><strong>🕒 {t("চেম্বারের সময়","Chamber hours")}:</strong> {doc.hours[i]}</li></ul></div>
            <a className="btn" data-book-doctor={doc.id} href="#appointment">{book}</a>
          </article>)}</div></div>
          <div className="deckControls"><button type="button" data-slide="-1" aria-label={t("আগের চিকিৎসক","Previous doctor")}><ChevronLeft size={18}/></button><button type="button" data-slide="1" aria-label={t("পরের চিকিৎসক","Next doctor")}><ChevronRight size={18}/></button></div>
          <button className="seeAllDoctors" type="button" data-see-all>{t("সব চিকিৎসক দেখুন","See all doctors")} <ArrowRight size={17}/></button>
          <dl className="clinical-figures">
            {[
              ["১০ বছর", "10 years", "চক্ষু চিকিৎসায় অভিজ্ঞতা", "In ophthalmology"],
              ["১০,০০০+", "10,000+", "ছানি অপারেশন", "Cataract operations"],
              ["৪,০০০+", "4,000+", "এর মধ্যে ফ্যাকো সার্জারি", "Of those, phaco surgeries"],
            ].map(([b, e, bl, el]) => (
              <div key={e}><dt>{t(bl, el)}</dt><dd>{t(b, e)}</dd></div>
            ))}
          </dl>
        </section>
        <section className="wrap section ourServices" id="our-services">
          <div className="serviceHeading"><span className="eyebrow">{t("আমাদের সেবা","Our services")}</span><h2>{t("এক ছাদের নিচে সম্পূর্ণ চক্ষুসেবা","Complete eye care under one roof")}</h2></div>
          <div className="serviceGrid">
            {services.map((service) => (
              <article className="serviceCard" key={service.id}>
                <img className="serviceArtwork" src={service.image} alt={service.imageAlt[i]} width="1280" height="720" loading="lazy" />
                <div className="serviceBody">
                  <h3>{service.title[i]}</h3>
                  <h4>{service.subtitle[i]}</h4>
                  <p>{service.introduction[i]}</p>
                  <details className="serviceDetails">
                    <summary>{t("বিস্তারিত দেখুন","See full details")}</summary>
                    <div className="serviceDetailContent">
                      {service.paragraphs.map((paragraph, index) => <p key={index}>{paragraph[i]}</p>)}
                      <h5>{service.reasonsTitle[i]}</h5>
                      <ul>{service.reasons.map((reason) => <li key={reason[1]}>{reason[i]}</li>)}</ul>
                      {service.closing[i] && <p>{service.closing[i]}</p>}
                      {service.tagline && <p className="serviceTagline">{service.tagline[i]}</p>}
                    </div>
                  </details>
                </div>
              </article>
            ))}
          </div>
        </section>
        <section id="why" className="wrap section">
          <div className="doctorHeading"><span className="eyebrow">{t("রোগীদের জন্য","For patients")}</span><h2>{t("ভিজিটের আগে","Before your visit")}</h2></div>
          <div className="infoCards">{visitCards.map(card=>{const Icon=card.icon==="eye"?Eye:card.icon==="doctor"?Stethoscope:CalendarDays;
            return <a className="infoCard" href={"#"+card.target} key={card.target}><span className="infoIcon"><Icon/></span><h3>{card.title[i]}</h3><p>{card.text[i]}</p><span className="textlink">{card.link[i]} <ArrowRight size={16}/></span></a>})}</div>
        </section>
        <section className="wrap section split" id="faq">
          <div>
            <span className="eyebrow">FAQ</span>
            <h2>{t("সাধারণ প্রশ্ন", "Common questions")}</h2>
          </div>
          <div>
            {faq.map(([q, a]) => (
              <details className="question" key={q[1]}>
                <summary>{q[i]}</summary>
                <p>{a[i]}</p>
              </details>
            ))}
          </div>
        </section>
        <section className="tinted" id="appointment">
          <div className="wrap section split">
            <div>
              <span className="eyebrow">
                {t("অ্যাপয়েন্টমেন্ট", "Appointments")}
              </span>
              <h2>{book}</h2>
              <p>
                {t(
                  "কেন আসতে চান তা সংক্ষেপে লিখুন এবং যে নম্বরে আপনাকে পাওয়া যাবে সেটি দিন। চেম্বার থেকে ফোন করে আপনার সময় নিশ্চিত করা হবে।",
                  "Tell us briefly why you’d like to visit and enter a number where we can reach you. The chamber will call to confirm your appointment.",
                )}
              </p>
              <img className="reception" src="/appointment.jpg" alt={t("রিসেপশনে অ্যাপয়েন্টমেন্ট নিচ্ছেন একজন রোগী","Illustration of a patient arranging a visit at reception")} width="1000" height="667"/>
            </div>
            <Form
              lang={lang}
              enabled={
                !!(
                  process.env.RESEND_API_KEY &&
                  process.env.EMAIL_FROM &&
                  process.env.CLINIC_NOTIFICATION_EMAIL
                )
              }
            />
          </div>
        </section>
        <section className="wrap section contactBanner" id="contact">
          <span className="contactBubble" aria-hidden="true">•••</span>
          <span className="eyebrow">{t("যোগাযোগ","Get in touch")}</span><h2>{t("চেম্বারে যোগাযোগ করুন","Contact the chamber")}</h2>
          <p>{clinic.address[i]}</p><a className="btn mapButton" href={mapUrl}><MapPin size={18}/>{t("গুগল ম্যাপে দেখুন","View on Google Maps")}</a>
          <div className="contactInfo"><div><strong>{clinic.hours[i]}</strong><small>{t("শুক্রবার বন্ধ। ছুটির দিনে সারাদিন রোগী দেখা হয়। সঠিক সময় ফোনে জেনে নিন।","Closed Friday. On holidays, the doctor is available throughout the day. Call to confirm the hours.")}</small></div>
          <div><a href={"tel:"+clinic.phone}><Phone size={16}/>{clinic.displayPhone}</a><a href={"mailto:"+clinic.email}><Mail size={16}/>{clinic.email}</a></div></div>
        </section>
      </main>
      <aside className="floatContacts" aria-label={t("দ্রুত যোগাযোগ","Quick contact")}>
        <a href={"tel:"+clinic.phone} aria-label={t("চেম্বারে ফোন করুন","Call the clinic")} title={t("ফোন করুন","Call the clinic")}><Phone size={21}/></a>
        <a href={"https://wa.me/"+clinic.whatsapp} aria-label={t("হোয়াটসঅ্যাপে যোগাযোগ","Chat on WhatsApp")} title="WhatsApp"><MessageCircle size={23}/></a>
      </aside>
      <footer><div className="wrap"><div className="footColumns">
        <div className="footBrand"><a className="brand" href="#home"><img src="/logo.svg" alt="" width="48" height="40"/>{t("ডা. জাহাঙ্গীর আই কেয়ার","Dr. Jahangir Eye Care")}</a><p>{t("সিরাজগঞ্জে বিশেষজ্ঞ চক্ষু চিকিৎসা ও ছানি অস্ত্রোপচারের পরামর্শ","Specialist eye care and cataract consultations in Sirajganj")}</p></div>
        {[
          [t("চেম্বার","Visit us"),[[clinic.address[i],mapUrl],[t("চেম্বারের সময়","Chamber hours"),"#contact"],[t("গুগল ম্যাপ","Google Maps"),mapUrl]]],
          [t("চক্ষুসেবা","Eye care"),[[t("পরীক্ষার খরচ","Examination fees"),"#exam-fees"],[t("অস্ত্রোপচারের খরচ","Surgery estimates"),"#surgery-fees"],[t("চিকিৎসক","Our doctors"),"#doctors"]]],
          [t("অ্যাপয়েন্টমেন্ট","Appointments"),[[book,"#appointment"],[clinic.displayPhone,"tel:"+clinic.phone],["WhatsApp","https://wa.me/"+clinic.whatsapp]]],
          [t("তথ্য","Information"),[[t("পরিচিতি","About us"),"#about"],[t("সাধারণ প্রশ্ন","FAQs"),"#faq"],[t("রোগীর মতামত","Patient feedback"),"#testimonials"]]]
        ].map(([title,links])=><div key={String(title)}><h3>{String(title)}</h3>{(links as string[][]).map(([label,href])=><a key={label} href={href}>{label}</a>)}</div>)}</div>
          <details id="privacy">
            <summary>{t("গোপনীয়তা", "Privacy notice")}</summary>
            <p>
              {t(
                "অ্যাপয়েন্টমেন্টের তথ্য ইমেইলে চেম্বারে পাঠানো হয়। চেম্বার আপনার অনুরোধ পর্যালোচনা ও যোগাযোগের জন্য এই তথ্য ব্যবহার করে। বিস্তারিত রোগের ইতিহাস লিখবেন না।",
                "Appointment details are emailed to the clinic for review and follow-up. Please share only a brief concern. For privacy questions, contact the chamber.",
              )}
            </p>
          </details>
          <small>
            © {new Date().getFullYear()} {clinic.name} · Designed &amp;
            Developed by zzapsites
          </small>
        </div>
      </footer>
    </>
  );
}
