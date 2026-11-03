import { CHILLI, CREAM, GOLD, INK, type IngredientKind } from "@/lib/products";

const S = 2.5;

// Natural colours for the raw ingredients, kept to the warm side of the brand palette.
const SKIN = "#c98a4b"; // turmeric skin
const FLESH = "#e8932a"; // turmeric inside
const STEM = "#5f7a2e";
const LEAF = "#6b7d34";
const SEED = "#c8a465";
const CUMIN = "#8a6a3e";
const KERNEL = "#f2c14e";
const HUSK = "#b9b366";
const MILLET = "#d4bd72";
const ANISE = "#7a3f1c";

// Kernel grid for the maize cob: circles inside an elongated ellipse.
const KERNELS: [number, number][] = [];
for (let y = 20; y <= 82; y += 7) {
  const half = 14 * Math.sqrt(Math.max(0, 1 - ((y - 50) / 40) ** 2));
  for (let x = 50 - half + 3; x <= 50 + half - 3; x += 6.5) KERNELS.push([x, y]);
}

// Grain texture for the millet spike.
const GRAINS: [number, number][] = [];
for (let y = 14; y <= 60; y += 5.5) for (let x = 43; x <= 57; x += 5) GRAINS.push([x + (Math.round(y) % 2 ? 2.5 : 0), y]);

const shapes: Record<IngredientKind, React.ReactNode> = {
  // a knobbly turmeric rhizome with a cut slice showing the gold inside
  turmeric: (
    <>
      <path d="M42 50 C38 40 41 30 49 25 C55 22 60 27 57 33 C54 38 54 43 56 47" fill={SKIN} stroke={INK} strokeWidth={S} strokeLinejoin="round" />
      <path d="M66 60 C66 69 70 77 76 79 C82 81 86 75 82 70 C79 66 77 63 77 60" fill={SKIN} stroke={INK} strokeWidth={S} strokeLinejoin="round" />
      <path d="M12 62 C10 52 21 46 33 48 C44 49 52 46 62 44 C73 42 86 44 88 52 C90 60 81 64 71 63 C62 62 56 64 50 66 C39 70 16 74 12 62 Z" fill={SKIN} stroke={INK} strokeWidth={S} strokeLinejoin="round" />
      <path d="M25 50 C23 56 24 62 27 68 M44 48 C43 54 44 60 46 66 M63 45 C62 51 63 57 65 62 M78 45 C77 50 78 56 80 61" fill="none" stroke={INK} strokeOpacity={0.3} strokeWidth={1.6} strokeLinecap="round" />
      <circle cx={24} cy={27} r={13} fill={SKIN} stroke={INK} strokeWidth={S} />
      <circle cx={24} cy={27} r={9.5} fill={FLESH} />
      <circle cx={24} cy={27} r={5} fill={GOLD} opacity={0.7} />
    </>
  ),
  // a long red chilli with a green stem
  chilli: (
    <>
      <path d="M22 30 C40 26 70 40 84 76 C88 86 82 90 76 82 C60 58 40 46 24 44 C16 42 14 32 22 30 Z" fill={CHILLI} stroke={INK} strokeWidth={S} strokeLinejoin="round" />
      <path d="M18 30 C20 26 26 26 28 31 C25 34 20 34 18 30 Z" fill={STEM} stroke={INK} strokeWidth={2} strokeLinejoin="round" />
      <path d="M22 29 C17 23 15 16 20 10" fill="none" stroke={STEM} strokeWidth={4.5} strokeLinecap="round" />
      <path d="M34 36 C48 38 60 48 68 60" fill="none" stroke="#fff" strokeOpacity={0.4} strokeWidth={3} strokeLinecap="round" />
    </>
  ),
  // round, ribbed coriander seeds
  coriander: (
    <>
      {[[30, 32, 10], [54, 24, 9], [74, 44, 10], [42, 54, 11], [66, 70, 9], [28, 76, 9], [84, 72, 8]].map(([x, y, r], i) => (
        <g key={i}>
          <circle cx={x} cy={y} r={r} fill={i % 3 ? SEED : "#b8945a"} stroke={INK} strokeWidth={2} />
          <path d={`M${x - r * 0.35} ${y - r + 2} C${x - r * 0.6} ${y} ${x - r * 0.6} ${y} ${x - r * 0.35} ${y + r - 2} M${x + r * 0.3} ${y - r + 2} C${x + r * 0.55} ${y} ${x + r * 0.55} ${y} ${x + r * 0.3} ${y + r - 2}`} fill="none" stroke={INK} strokeOpacity={0.3} strokeWidth={1.3} />
          <circle cx={x} cy={y - r + 1.5} r={1.4} fill={INK} opacity={0.5} />
        </g>
      ))}
    </>
  ),
  // slim, ridged cumin seeds
  cumin: (
    <>
      {[[30, 28, 30], [58, 22, -20], [76, 42, 60], [40, 50, -40], [62, 62, 20], [26, 74, 70], [52, 82, -10], [82, 74, 40]].map(([x, y, r], i) => (
        <g key={i} transform={`rotate(${r} ${x} ${y})`}>
          <ellipse cx={x} cy={y} rx={12} ry={4.2} fill={i % 2 ? CUMIN : "#a08050"} stroke={INK} strokeWidth={1.8} />
          <path d={`M${x - 9} ${y} H${x + 9}`} stroke={INK} strokeOpacity={0.35} strokeWidth={1.2} />
          <path d={`M${x + 12} ${y} l4 -1`} stroke={INK} strokeWidth={1.4} strokeLinecap="round" />
        </g>
      ))}
    </>
  ),
  // a maize cob in its husk
  maize: (
    <g transform="rotate(-24 50 50)">
      <path d="M50 94 C30 82 25 52 35 20 C39 46 44 72 50 94 Z" fill={HUSK} stroke={INK} strokeWidth={S} strokeLinejoin="round" />
      <path d="M50 10 C62 10 65 30 65 50 C65 72 60 88 50 90 C40 88 35 72 35 50 C35 30 38 10 50 10 Z" fill={KERNEL} stroke={INK} strokeWidth={S} strokeLinejoin="round" />
      {KERNELS.map(([x, y], i) => (
        <circle key={i} cx={x} cy={y} r={2.7} fill="#f7d77a" stroke="#c48a22" strokeWidth={0.9} />
      ))}
      <path d="M50 94 C70 82 76 56 68 26 C62 50 58 72 50 94 Z" fill={HUSK} stroke={INK} strokeWidth={S} strokeLinejoin="round" />
      <path d="M58 86 C64 70 67 54 66 38" fill="none" stroke={INK} strokeOpacity={0.25} strokeWidth={1.4} strokeLinecap="round" />
    </g>
  ),
  // a pearl-millet spike on its stalk
  millet: (
    <g transform="rotate(16 50 50)">
      <path d="M50 96 C50 84 50 74 50 64" fill="none" stroke={STEM} strokeWidth={4} strokeLinecap="round" />
      <path d="M50 84 C38 80 28 70 24 58 C36 62 46 72 50 84 Z" fill={LEAF} stroke={INK} strokeWidth={2} strokeLinejoin="round" />
      <rect x={39} y={6} width={22} height={62} rx={11} fill={MILLET} stroke={INK} strokeWidth={S} />
      {GRAINS.map(([x, y], i) => (
        <circle key={i} cx={x} cy={y} r={2.2} fill="#ead79a" stroke="#9c8443" strokeWidth={0.8} />
      ))}
    </g>
  ),
  // eight-pointed star anise
  staranise: (
    <>
      {[0, 45, 90, 135, 180, 225, 270, 315].map((a) => (
        <g key={a} transform={`rotate(${a} 50 50)`}>
          <path d="M50 50 C43 42 43 22 50 10 C57 22 57 42 50 50 Z" fill={ANISE} stroke={INK} strokeWidth={2} strokeLinejoin="round" />
          <ellipse cx={50} cy={30} rx={2.6} ry={4.6} fill={SKIN} />
        </g>
      ))}
      <circle cx={50} cy={50} r={6} fill="#5a2c12" stroke={INK} strokeWidth={2} />
    </>
  ),
  // black peppercorns
  pepper: (
    <>
      {[[30, 34, 9], [52, 26, 8], [70, 42, 10], [40, 56, 10], [62, 66, 8], [28, 74, 7], [82, 70, 7]].map(([x, y, r], i) => (
        <g key={i}>
          <circle cx={x} cy={y} r={r} fill={i % 2 ? "#4a3020" : INK} stroke={INK} strokeWidth={2} />
          <path d={`M${x - r / 2} ${y - 1} q${r / 4} ${r / 3} ${r / 2} 0 q${r / 4} -${r / 3} ${r / 2} 0`} fill="none" stroke="#fff" strokeOpacity={0.25} strokeWidth={1.2} />
          <circle cx={x - r / 3} cy={y - r / 3} r={r / 4} fill="#fff" opacity={0.3} />
        </g>
      ))}
    </>
  ),
  // a curry / bay leaf
  leaf: (
    <>
      <path d="M12 82 C14 40 44 14 88 12 C86 54 58 84 12 82 Z" fill={LEAF} stroke={INK} strokeWidth={S} strokeLinejoin="round" />
      <path d="M14 80 C40 58 60 38 84 16 M34 62 L32 44 M48 48 L46 30 M50 46 L68 48 M36 60 L54 62" fill="none" stroke={CREAM} strokeOpacity={0.55} strokeWidth={2} strokeLinecap="round" />
    </>
  ),
  sparkle: (
    <path d="M50 6 C54 38 62 46 94 50 C62 54 54 62 50 94 C46 62 38 54 6 50 C38 46 46 38 50 6 Z" fill={GOLD} stroke={INK} strokeWidth={S} strokeLinejoin="round" />
  ),
};

export default function Ingredient({ kind, className }: { kind: IngredientKind; className?: string }) {
  return (
    <svg viewBox="0 0 100 100" className={className} aria-hidden>
      {shapes[kind]}
    </svg>
  );
}
