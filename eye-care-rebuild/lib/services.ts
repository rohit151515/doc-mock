import type { Copy } from "./clinic";

export const services: {
  id: string;
  title: Copy;
  subtitle: Copy;
  image: string;
  imageAlt: Copy;
  introduction: Copy;
  paragraphs: Copy[];
  reasonsTitle: Copy;
  reasons: Copy[];
  closing: Copy;
  tagline?: Copy;
}[] = [
  {
    id: "phaco-operation",
    title: ["ফ্যাকো অপারেশন", "Phaco Operation"],
    subtitle: ["আধুনিক ফ্যাকো ছানি অস্ত্রোপচার", "Advanced Phaco Cataract Surgery"],
    image: "/services/phaco-surgery.jpg",
    imageAlt: ["ফ্যাকো অস্ত্রোপচারের ছবি", "Photo of phaco cataract surgery"],
    introduction: [
      "ফ্যাকোইমালসিফিকেশন হলো ছোট ছিদ্রের মাধ্যমে ছানি অপসারণের আধুনিক পদ্ধতি। ঘোলা প্রাকৃতিক লেন্সটি আলতোভাবে সরিয়ে উপযুক্ত কৃত্রিম লেন্স (IOL) বসানো হয়।",
      "Phacoemulsification is a modern technique for removing cataracts through a tiny incision. The cloudy natural lens is gently removed and replaced with a suitable Intraocular Lens (IOL).",
    ],
    paragraphs: [
      [
        "আমাদের হাসপাতালে Johnson & Johnson-এর Abbott Whitestar Signature PRO Phaco System ব্যবহার করা হয়—যা নির্ভুল ও নিয়ন্ত্রিত ছানি অস্ত্রোপচারের জন্য তৈরি একটি উন্নত প্ল্যাটফর্ম।",
        "At our hospital, we use the Abbott Whitestar Signature PRO Phaco System by Johnson & Johnson, an advanced platform designed for precise and controlled cataract surgery.",
      ],
      [
        "উন্নত প্রযুক্তি ও অভিজ্ঞ অস্ত্রোপচার সেবার মাধ্যমে আমরা ছানি অস্ত্রোপচারকে নির্ভুল, আরামদায়ক ও নির্ভরযোগ্য করার লক্ষ্য রাখি।",
        "With advanced technology and experienced surgical care, we aim to make cataract surgery precise, comfortable, and reliable.",
      ],
    ],
    reasonsTitle: ["ফ্যাকো অস্ত্রোপচার কেন বেছে নেবেন?", "Why Choose Phaco Surgery?"],
    reasons: [
      ["খুব ছোট ছিদ্র", "Very small incision"],
      ["সাধারণত সেলাই লাগে না", "Usually no stitches required"],
      ["টিস্যুতে কম আঘাত", "Minimal tissue trauma"],
      ["দৃষ্টিশক্তি তুলনামূলক দ্রুত ফিরতে পারে", "Potentially faster visual recovery"],
      ["বিভিন্ন ধরনের IOL থেকে বেছে নেওয়ার সুযোগ", "Wide range of IOL options"],
    ],
    closing: ["", ""],
    tagline: ["আধুনিক প্রযুক্তি। বিশ্বস্ত যত্ন। আরও পরিষ্কার দৃষ্টি।", "Modern Technology. Trusted Care. Clearer Vision."],
  },
  {
    id: "cataract-surgery",
    title: ["ছানি অস্ত্রোপচার", "Cataract Surgery"],
    subtitle: ["আধুনিক ছানি চিকিৎসা", "Modern Cataract Treatment"],
    image: "/services/cataract-surgery.jpg",
    imageAlt: ["ছানি অস্ত্রোপচারের ছবি", "Photo of cataract surgery"],
    introduction: [
      "দৃষ্টি পরিষ্কার করতে সাহায্যের জন্য আমরা আধুনিক পদ্ধতি ও সরঞ্জাম ব্যবহার করে ছানি অস্ত্রোপচার করি। নির্ভুল চিকিৎসা, রোগীর আরাম এবং মানসম্মত অস্ত্রোপচার সেবাই আমাদের লক্ষ্য।",
      "We provide modern cataract surgery using advanced techniques and equipment to help restore clearer vision. Our focus is on precise treatment, patient comfort, and quality surgical care.",
    ],
    paragraphs: [],
    reasonsTitle: ["আমাদের ছানি অস্ত্রোপচার কেন বেছে নেবেন?", "Why Choose Our Cataract Surgery?"],
    reasons: [
      ["আধুনিক অস্ত্রোপচার পদ্ধতি", "Modern surgical techniques"],
      ["উপযুক্ত IOL বেছে নেওয়ার সুযোগ", "Suitable IOL options"],
      ["ব্যক্তিভিত্তিক চিকিৎসা পরিকল্পনা", "Personalized treatment planning"],
      ["অভিজ্ঞ অস্ত্রোপচার সেবা", "Experienced surgical care"],
      ["রোগীর জন্য নিবেদিত সহায়তা", "Dedicated patient support"],
    ],
    closing: [
      "আধুনিক প্রযুক্তি ও যত্নশীল সেবার মাধ্যমে রোগীদের দৃষ্টি আরও পরিষ্কার করতে সাহায্য করাই আমাদের লক্ষ্য।",
      "Our goal is to help patients achieve clearer vision through modern technology and attentive care.",
    ],
  },
  {
    id: "tear-duct-surgery",
    title: ["DCT ও DCR অস্ত্রোপচার", "DCT & DCR Surgery"],
    subtitle: ["উন্নত অশ্রুনালী অস্ত্রোপচার", "Advanced Tear Duct Surgery"],
    image: "/services/dct-dcr-surgery.png",
    imageAlt: ["অশ্রুনালী অস্ত্রোপচারের চিত্র", "Diagram of tear duct surgery"],
    introduction: [
      "অশ্রুনালী বন্ধ থাকলে অতিরিক্ত পানি পড়া, অস্বস্তি এবং বারবার চোখে সংক্রমণ হতে পারে। DCT ও DCR অস্ত্রোপচারের মাধ্যমে এসব সমস্যার চিকিৎসা করে অশ্রু নিষ্কাশন স্বাভাবিক করতে সাহায্য করা হয়।",
      "Blocked tear ducts can cause excessive watering, discomfort, and recurrent eye infections. DCT and DCR are surgical procedures used to treat these conditions and restore proper tear drainage.",
    ],
    paragraphs: [
      [
        "আমাদের হাসপাতালে অভিজ্ঞ চক্ষু শল্যচিকিৎসকের তত্ত্বাবধানে আধুনিক অশ্রুনালী অস্ত্রোপচার করা হয়। নির্ভুল চিকিৎসা ও দীর্ঘস্থায়ী উপশমের দিকে আমরা মনোযোগ দিই।",
        "Our hospital provides modern tear duct surgery under the care of an experienced ophthalmic surgeon, with a focus on precise treatment and lasting relief.",
      ],
    ],
    reasonsTitle: ["আমাদের DCT ও DCR অস্ত্রোপচার কেন বেছে নেবেন?", "Why Choose Our DCT & DCR Surgery?"],
    reasons: [
      ["অভিজ্ঞ অস্ত্রোপচার সেবা", "Experienced surgical care"],
      ["আধুনিক অস্ত্রোপচার পদ্ধতি", "Modern surgical techniques"],
      ["আপনার অবস্থার উপযোগী চিকিৎসা", "Treatment tailored to your condition"],
      ["অশ্রু নিষ্কাশন স্বাভাবিক করার লক্ষ্য", "Focus on restoring proper tear drainage"],
      ["অস্ত্রোপচারের পর নিবেদিত যত্ন", "Dedicated post-operative care"],
    ],
    closing: [
      "অশ্রুনালীর দীর্ঘস্থায়ী সমস্যায় উপশম পেতে কার্যকর চিকিৎসা দেওয়াই আমাদের লক্ষ্য।",
      "We aim to provide effective treatment and help patients find relief from persistent tear duct problems.",
    ],
  },
  {
    id: "pterygium-surgery",
    title: ["টেরিজিয়াম অস্ত্রোপচার", "Pterygium Surgery"],
    subtitle: ["টেরিজিয়ামের নির্ভুল চিকিৎসা", "Precise Treatment for Pterygium"],
    image: "/services/pterygium-surgery.jpg",
    imageAlt: ["চোখে টেরিজিয়াম বৃদ্ধির ছবি", "Photo of pterygium in the eye"],
    introduction: [
      "টেরিজিয়াম হলো চোখের সাদা অংশ থেকে কর্নিয়ার ওপর ছড়িয়ে পড়া মাংসল বৃদ্ধি। এতে চোখ লাল হওয়া, জ্বালা, পানি পড়া এবং ঝাপসা দৃষ্টি হতে পারে।",
      "Pterygium is a fleshy growth that extends from the white part of the eye onto the cornea. It may cause redness, irritation, watering, and blurred vision.",
    ],
    paragraphs: [
      [
        "উত্তর বাংলাদেশের অভিজ্ঞ টেরিজিয়াম শল্যচিকিৎসকদের একজন ডা. আশরাফুল ইসলাম (আশরাফুল স্যার) আমাদের অস্ত্রোপচারগুলো করেন। আমরা অস্ত্রোপচারের নির্ভুলতা, রোগীর নিরাপত্তা এবং স্বাভাবিক দেখায় এমন ফলাফলে গুরুত্ব দিই।",
        "Our pterygium surgeries are performed by Dr. Ashraful Islam (Ashraful Sir), one of the experienced pterygium surgeons in Northern Bangladesh. We focus on surgical precision, patient safety, and natural-looking cosmetic results.",
      ],
    ],
    reasonsTitle: ["আমাদের টেরিজিয়াম অস্ত্রোপচার কেন বেছে নেবেন?", "Why Choose Our Pterygium Surgery?"],
    reasons: [
      ["অভিজ্ঞ টেরিজিয়াম শল্যচিকিৎসক", "Experienced pterygium surgeon"],
      ["সতর্ক ও নিখুঁত অস্ত্রোপচার পদ্ধতি", "Meticulous surgical techniques"],
      ["স্বাভাবিক দেখায় এমন ফলাফলে গুরুত্ব", "Focus on natural-looking results"],
      ["ব্যক্তিভিত্তিক চিকিৎসা পদ্ধতি", "Individualized treatment approach"],
      ["অস্ত্রোপচারের পর নিবেদিত ফলোআপ", "Dedicated patient follow-up"],
    ],
    closing: [
      "চোখের স্বাভাবিক চেহারা ও স্বাস্থ্য বজায় রেখে সতর্ক অস্ত্রোপচার করাই আমাদের অগ্রাধিকার।",
      "Our priority is to provide careful surgical treatment while maintaining the natural appearance and health of the eye.",
    ],
  },
];
