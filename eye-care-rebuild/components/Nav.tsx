"use client";
import { useRef, useState } from "react";
import { Menu, X, Globe, ArrowUpRight } from "lucide-react";
import type { Lang } from "../lib/clinic";
export default function Nav({ lang }: { lang: Lang }) {
  const bn = lang === "bn",
    [open, setOpen] = useState(false),
    button = useRef<HTMLButtonElement>(null);
  const items = [
    ["about", "পরিচিতি", "About"],
    ["services", "সেবা ও খরচ", "Services & fees"],
    ["doctors", "চিকিৎসক", "Doctor"],
    ["faq", "প্রশ্নোত্তর", "FAQ"],
    ["contact", "যোগাযোগ", "Contact"],
  ];
  return (
    <header
      onKeyDown={(e) => {
        if (e.key === "Escape" && open) {
          setOpen(false);
          button.current?.focus();
        }
      }}
    >
      <div className="wrap nav">
        <a className="brand" href="#home">
          <img src="/logo.svg" alt="" width="48" height="44" />
          <span>{bn ? "ডা. জাহাঙ্গীর আই কেয়ার" : "Dr. Jahangir Eye Care"}</span>
        </a>
        <nav id="main-nav" className={open ? "open" : ""}>
          {items.map(([id, b, e]) => (
            <a key={id} href={"#" + id} onClick={() => setOpen(false)}>
              {bn ? b : e}
            </a>
          ))}
        </nav>
        <a
          className="lang" lang={bn ? "en" : "bn"} hrefLang={bn ? "en" : "bn"}
          href={bn ? "/en" : "/bn"}
          onClick={(e) => {
            e.preventDefault();
            window.location.assign((bn ? "/en" : "/bn") + window.location.hash);
          }}
        >
          <Globe size={16} />
          {bn ? "English" : "বাংলা"}
        </a>
        <a className="btn top" href="#appointment">
          {bn ? "অ্যাপয়েন্টমেন্ট নিন" : "Make an appointment"} <ArrowUpRight size={16} />
        </a>
        <button
          className="menu"
          ref={button}
          aria-controls="main-nav"
          aria-expanded={open}
          aria-label={bn ? "মেনু" : "Menu"}
          onClick={() => setOpen(!open)}
        >
          {open ? <X /> : <Menu />}
        </button>
      </div>
    </header>
  );
}
