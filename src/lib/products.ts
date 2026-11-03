/*
  Catalogue for the approval build.

  The six Sachika Spices products and their pack shots come from the client's
  product renders. Every price, rating, review count and size other than the
  100 g printed on the packs is a PLACEHOLDER. The three gift boxes are
  proposed bundles of real products, not existing SKUs — confirm with the
  client before launch.
*/

export const INK = "#2b160c";
export const TURMERIC = "#d47e30";
export const CREAM = "#f5f5dc";
export const PAPER = "#fbfbef";
export const GOLD = "#e2b35e";
export const COFFEE = "#6f4e37";
export const CINNAMON = "#6d3b07";
export const CHILLI = "#b8261b";

export type CategorySlug = "spices" | "grains" | "boxes";

export type Category = {
  slug: CategorySlug;
  name: string;
  odia: string;
  blurb: string;
  bg: string;
  fg: string;
};

export const categories: Category[] = [
  {
    slug: "spices",
    name: "Ground Spices",
    odia: "ମସଲା ଗୁଣ୍ଡ",
    blurb: "Haladi, lanka, dhania and jira — whole crops cleaned by hand, slow-ground in small batches and sealed while the aroma is still in the air.",
    bg: CINNAMON,
    fg: CREAM,
  },
  {
    slug: "grains",
    name: "Maize & Millets",
    odia: "ମକା ଓ ମାଣ୍ଡିଆ",
    blurb: "Stone-ground maize and mandia (ragi) flours for rotis, pitha and jau. The hardy grains Odisha grew long before refined flour.",
    bg: GOLD,
    fg: INK,
  },
  {
    slug: "boxes",
    name: "Gift Boxes",
    odia: "ଉପହାର",
    blurb: "Curated spice boxes for Nuakhai, Diwali and griha prabesa. A full masala dabba, beautifully packed.",
    bg: INK,
    fg: GOLD,
  },
];

export type Size = { label: string; price: number; mrp: number };

export type IngredientKind = "turmeric" | "chilli" | "coriander" | "cumin" | "maize" | "millet" | "staranise" | "pepper" | "leaf" | "sparkle";

export type Product = {
  slug: string;
  name: string;
  odia: string;
  category: CategorySlug;
  tagline: string;
  description: string;
  details: string[];
  howTo: string;
  origin: string;
  sizes: Size[];
  fromLabel?: boolean;
  rating: number;
  reviews: number;
  badge?: "Bestseller" | "Limited stock" | "New batch" | "In stock" | "Festival" | "Proposed";
  stage: string;
  images: string[];
  ingredientsArt: IngredientKind[];
  instagram?: string;
  includes?: string[];
};

const img = (slug: string, n: number) => Array.from({ length: n }, (_, i) => `/products/${slug}/${i + 1}.webp`);

export const products: Product[] = [
  {
    slug: "turmeric-powder",
    name: "Turmeric Powder",
    odia: "ହଳଦୀ ଗୁଣ୍ଡ",
    category: "spices",
    tagline: "Golden, earthy and deeply coloured. The everyday haladi, done properly.",
    description:
      "Whole turmeric fingers, boiled, sun-dried and polished before they're slow-ground into a fine, bright powder. Nothing added for colour — the gold is all turmeric. Warm and earthy in dalma, and the base of every tarkari.",
    details: ["Haladi", "Single-ingredient, nothing added", "No artificial colour", "100 g sealed pouch"],
    howTo: "Add a pinch to hot oil before the onions, or stir into dal as it simmers. A teaspoon in warm milk with black pepper before bed.",
    origin: "Odisha's farms",
    sizes: [
      { label: "100 g", price: 55, mrp: 60 },
      { label: "500 g", price: 245, mrp: 280 },
    ],
    rating: 4.9,
    reviews: 128,
    badge: "Bestseller",
    stage: TURMERIC,
    images: img("turmeric-powder", 4),
    ingredientsArt: ["turmeric", "leaf", "pepper"],
  },
  {
    slug: "chilli-powder",
    name: "Chilli Powder",
    odia: "ଲଙ୍କା ଗୁଣ୍ଡ",
    category: "spices",
    tagline: "Bold red, honest heat. Sun-dried chillies, ground with the seeds in.",
    description:
      "Long red chillies, dried in the sun until they rattle, then ground with their seeds for a full, rounded heat. The colour comes from the chilli alone — no dyes, no oil coating. Bright in a tadka, deep in a mutton kasa.",
    details: ["Lanka", "Medium-hot", "No added colour or oil", "100 g sealed pouch"],
    howTo: "Bloom in hot oil for a few seconds for colour without bitterness. Sprinkle over dahi, eggs and aloo bhaja for a finish.",
    origin: "Indian farms",
    sizes: [
      { label: "100 g", price: 65, mrp: 70 },
      { label: "500 g", price: 295, mrp: 330 },
    ],
    rating: 4.8,
    reviews: 104,
    badge: "Bestseller",
    stage: CHILLI,
    images: img("chilli-powder", 4),
    ingredientsArt: ["chilli", "chilli", "sparkle"],
  },
  {
    slug: "coriander-powder",
    name: "Coriander Powder",
    odia: "ଧନିଆ ଗୁଣ୍ଡ",
    category: "spices",
    tagline: "Citrusy, nutty and gently warm. The quiet backbone of every masala.",
    description:
      "Plump coriander seeds, lightly roasted and ground to a soft, fragrant powder with a citrus lift. It thickens gravies, balances heat and rounds out every spice blend in the kitchen.",
    details: ["Dhania", "Lightly roasted seeds", "No fillers", "100 g sealed pouch"],
    howTo: "Add with the tomatoes so it cooks into the masala. Mix with jira and lanka gunda for a quick everyday spice rub.",
    origin: "Indian farms",
    sizes: [
      { label: "100 g", price: 45, mrp: 50 },
      { label: "500 g", price: 199, mrp: 225 },
    ],
    rating: 4.8,
    reviews: 76,
    badge: "In stock",
    stage: COFFEE,
    images: img("coriander-powder", 4),
    ingredientsArt: ["coriander", "leaf", "sparkle"],
  },
  {
    slug: "cumin-powder",
    name: "Cumin Powder",
    odia: "ଜିରା ଗୁଣ୍ଡ",
    category: "spices",
    tagline: "Smoky, warm and unmistakable. Jira ground the day it's packed.",
    description:
      "Whole cumin seeds, cleaned and dry-roasted before grinding, for a smoky depth that perfumes the whole kitchen. Stir it into dahi, pakhala and chaat, or finish a dalma with it.",
    details: ["Jira", "Dry-roasted", "Single-ingredient", "100 g sealed pouch"],
    howTo: "Sprinkle over pakhala, dahi and chaat. Add to curries in the last few minutes to keep the aroma bright.",
    origin: "Indian farms",
    sizes: [
      { label: "100 g", price: 85, mrp: 95 },
      { label: "500 g", price: 389, mrp: 440 },
    ],
    rating: 4.9,
    reviews: 69,
    badge: "New batch",
    stage: GOLD,
    images: img("cumin-powder", 3),
    ingredientsArt: ["cumin", "staranise", "sparkle"],
  },
  {
    slug: "maize-powder",
    name: "Maize Powder",
    odia: "ମକା ଅଟା",
    category: "grains",
    tagline: "Sunny, sweet and stone-ground. For rotis, pitha and more.",
    description:
      "Golden maize, stone-ground into a fine, naturally sweet flour. Gluten-free and full of flavour — for rotis with saga, crisp pakudi, porridge and corn pitha.",
    details: ["Maka atta", "Stone-ground", "Naturally gluten-free", "100 g sealed pouch"],
    howTo: "Knead with warm water and a pinch of salt; pat out by hand and cook on a hot tawa with ghee.",
    origin: "Odisha's farms",
    sizes: [
      { label: "100 g", price: 35, mrp: 40 },
      { label: "1 kg", price: 299, mrp: 340 },
    ],
    rating: 4.7,
    reviews: 41,
    badge: "In stock",
    stage: GOLD,
    images: img("maize-powder", 2),
    ingredientsArt: ["maize", "leaf", "sparkle"],
  },
  {
    slug: "maize-millet-blend",
    name: "Maize & Millet Blend",
    odia: "ମକା-ମାଣ୍ଡିଆ ଅଟା",
    category: "grains",
    tagline: "Maize with mandia and other millets. More fibre, more flavour, every day.",
    description:
      "A blend of stone-ground maize and millets led by mandia (ragi) — the hardy grain of Odisha's hills. Earthy and slightly nutty, rich in fibre, and easy to swap in for everyday atta in rotis, chakuli and mandia jau.",
    details: ["Maka + mandia", "Stone-ground", "High fibre", "Limited stock"],
    howTo: "Use on its own for rotis and chakuli pitha, or mix 1 : 1 with wheat atta for softer chapatis.",
    origin: "Odisha's farms",
    sizes: [
      { label: "100 g", price: 45, mrp: 50 },
      { label: "1 kg", price: 349, mrp: 399 },
    ],
    rating: 4.8,
    reviews: 27,
    badge: "Limited stock",
    stage: TURMERIC,
    images: img("maize-millet-blend", 2),
    ingredientsArt: ["millet", "maize", "sparkle"],
  },
  {
    slug: "nuakhai-box",
    name: "Nuakhai Harvest Box",
    odia: "ନୂଆଖାଇ ଉପହାର",
    category: "boxes",
    tagline: "Maize, mandia blend & turmeric for the new harvest.",
    description:
      "For Nuakhai, when Odisha eats the first grain of the new harvest: stone-ground maize, our maize and mandia blend, and a pouch of golden turmeric. Everything for rotis, khiri and a pot of something warm.",
    details: ["Maize Powder · 100 g", "Maize & Millet Blend · 100 g", "Turmeric Powder · 100 g", "Gift box + recipe card"],
    howTo: "Open on Nuakhai morning, after the nabanna offering. Then cook for the whole family.",
    origin: "the Sachika spice room",
    sizes: [
      { label: "Classic", price: 135, mrp: 150 },
      { label: "Grand (2×)", price: 259, mrp: 300 },
    ],
    rating: 4.9,
    reviews: 11,
    badge: "Proposed",
    stage: GOLD,
    images: [],
    includes: ["maize-powder", "maize-millet-blend", "turmeric-powder"],
    ingredientsArt: ["sparkle", "maize", "millet"],
  },
  {
    slug: "diwali-box",
    name: "Diwali Masala Box",
    odia: "ଦୀପାବଳି ଉପହାର",
    category: "boxes",
    tagline: "Turmeric, chilli & coriander in a keepsake gift box.",
    description:
      "The three spices every festive kitchen reaches for first — turmeric, chilli and coriander — packed in a gold-foiled gift box with a hand-written card. A gift that gets used, every single day.",
    details: ["Turmeric Powder · 100 g", "Chilli Powder · 100 g", "Coriander Powder · 100 g", "Gift box + card"],
    howTo: "Order a week before Diwali. Gift to everyone who's ever fed you.",
    origin: "the Sachika spice room",
    sizes: [
      { label: "Classic", price: 179, mrp: 199 },
      { label: "Grand (2×)", price: 339, mrp: 398 },
    ],
    rating: 5.0,
    reviews: 18,
    badge: "Proposed",
    stage: CHILLI,
    images: [],
    includes: ["turmeric-powder", "chilli-powder", "coriander-powder"],
    ingredientsArt: ["sparkle", "chilli", "turmeric"],
  },
  {
    slug: "griha-prabesa-box",
    name: "Griha Prabesa Box",
    odia: "ଗୃହପ୍ରବେଶ ଉପହାର",
    category: "boxes",
    tagline: "Turmeric, cumin & coriander to bless a new kitchen.",
    description:
      "Haladi for luck, jira and dhania for the first meal. A housewarming box that fills a new masala dabba with the essentials, packed in a keepsake box.",
    details: ["Turmeric Powder · 100 g", "Cumin Powder · 100 g", "Coriander Powder · 100 g", "Gift box + card"],
    howTo: "Bring it along to the puja. The first tadka in the new house is on you.",
    origin: "the Sachika spice room",
    sizes: [
      { label: "Classic", price: 169, mrp: 190 },
      { label: "Grand (2×)", price: 319, mrp: 380 },
    ],
    rating: 4.9,
    reviews: 9,
    badge: "Proposed",
    stage: COFFEE,
    images: [],
    includes: ["turmeric-powder", "cumin-powder", "coriander-powder"],
    ingredientsArt: ["sparkle", "turmeric", "cumin"],
  },
];

export const getProduct = (slug: string) => products.find((p) => p.slug === slug);
export const getCategory = (slug: string) => categories.find((c) => c.slug === slug);
export const byCategory = (slug: CategorySlug) => products.filter((p) => p.category === slug);
export const singles = products.filter((p) => p.category !== "boxes");

/* Photos for a product; boxes borrow the photos of what's inside. */
export function photosOf(p: Product): string[] {
  if (p.images.length) return p.images;
  return (p.includes ?? []).map((s) => getProduct(s)?.images[0]).filter((x): x is string => !!x);
}
export const coverOf = (p: Product) => photosOf(p)[0];

/*
  Cut-out studio packshots (transparent background) in public/products/packs,
  named by slug. Boxes return the packs of what's inside.
*/
export function packsOf(p: Product): string[] {
  if (p.category !== "boxes") return [`/products/packs/${p.slug}.webp`];
  return (p.includes ?? []).map((s) => `/products/packs/${s}.webp`);
}

export function related(p: Product, n = 4) {
  const same = products.filter((x) => x.category === p.category && x.slug !== p.slug);
  const rest = products.filter((x) => x.category !== p.category && x.slug !== p.slug);
  return [...same, ...rest].slice(0, n);
}

export const inr = (n: number) => "₹" + n.toLocaleString("en-IN", { maximumFractionDigits: 0 });

export const festivals = [
  {
    slug: "nuakhai",
    name: "Nuakhai",
    odia: "ନୂଆଖାଇ",
    when: "August – September",
    story: "Odisha's harvest festival — the first new grain offered to Maa Samaleswari, then shared with the whole family. A box of maize, mandia and turmeric for the new season.",
    box: "nuakhai-box",
    bg: GOLD,
  },
  {
    slug: "diwali",
    name: "Diwali",
    odia: "ଦୀପାବଳି",
    when: "October – November",
    story: "Diyas on every ledge, sweets on every plate, and a kitchen that cooks for whoever walks in. Gift the spices behind the feast.",
    box: "diwali-box",
    bg: CHILLI,
  },
  {
    slug: "griha-prabesa",
    name: "Griha Prabesa",
    odia: "ଗୃହପ୍ରବେଶ",
    when: "Any auspicious day",
    story: "A new home deserves a full masala dabba. Haladi for luck, jira and dhania for the very first meal.",
    box: "griha-prabesa-box",
    bg: CINNAMON,
  },
];

// Placeholder testimonials for the approval build.
export const testimonials = [
  { quote: "The haladi is so bright my dalma looks different. You can smell it the moment you open the pouch.", name: "Smita M.", city: "Bhubaneswar" },
  { quote: "Finally a lanka gunda that's red from the chilli, not from a dye. Proper heat, lovely colour.", name: "Abhisek P.", city: "Bengaluru" },
  { quote: "Roasted jira powder over pakhala — exactly how my maa makes it. Smoky in the best way.", name: "Itishree B.", city: "Hyderabad" },
  { quote: "The maize and mandia blend makes the softest chakuli. My kids don't even notice it's millet.", name: "Sangram N.", city: "Cuttack" },
  { quote: "Gave the Diwali box to my whole team in Pune. Three people have already reordered on their own.", name: "Pragyan D.", city: "Pune" },
];

// PLACEHOLDER contact details — replace with the client's real phone, email, address and socials.
export const CONTACT = {
  phones: ["+91 98765 43210", "+91 98765 43210"],
  whatsapp: "919876543210",
  email: "hello@sachikaspices.com",
  outlet: "Sachika Spices",
  address: "Manufacturing unit & office — address to be confirmed, Odisha, India",
  hours: "Mon – Sat · 10 am – 7 pm",
  maps: "https://www.google.com/maps/search/Sachika+Spices+Odisha",
  instagram: "https://www.instagram.com/",
  instagramHandle: "@sachikaspices",
  facebook: "https://www.facebook.com/",
};
