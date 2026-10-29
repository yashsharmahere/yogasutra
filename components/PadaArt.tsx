import art from "@/lib/padaArt.json";

// Chapter emblems: a seated figure (concentration), a figure climbing steps (practice), a radiant figure (powers), a dove (freedom).
// From game-icons.net by Lorc and Delapouite, CC BY 3.0 (https://creativecommons.org/licenses/by/3.0/).
export default function PadaArt({ n, size = 56 }: { n: number; size?: number }) {
  const a = (art as Record<string, { name: string; author: string; body: string }>)[String(n)];
  return <svg className="pada-art" width={size} height={size} viewBox="0 0 512 512" aria-hidden="true" focusable="false" dangerouslySetInnerHTML={{ __html: a.body }} />;
}
