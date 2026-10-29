import Link from "next/link";
import { GRADE, slug } from "@/lib/corpus";

export const Grade = ({ g }: { g: string }) => <span className={`grade ${GRADE[g][0]}`}>{GRADE[g][1]}</span>;

// Woods' own square-bracket additions are set apart.
export function Woods({ t }: { t: string }) {
  return <>{t.split(/(\[[^\]]*\])/).map((p, i) => (p.startsWith("[") ? <span key={i} className="br">{p}</span> : p))}</>;
}
export const SLink = ({ id, children }: { id: string; children?: React.ReactNode }) => <Link href={`/sutra/${slug(id)}`}>{children ?? id}</Link>;
