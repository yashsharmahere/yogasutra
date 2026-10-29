import Link from "next/link";
import ThreadServer from "@/components/ThreadServer";
import { Grade } from "@/components/Bits";
import { PADAS, S } from "@/lib/corpus";

export const metadata = { title: "Patañjali", description: "What the tradition says about Patañjali, and what scholars can say with confidence." };

export default function Patanjali() {
  return (
    <>
      <div className="pat-hero weave-bg">
        <div className="pat-copy">
          <p className="eyebrow">Patañjali</p>
          <h1 className="pat-h">The name belongs to the text more than to a biography.</h1>
          <p className="col muted" style={{ fontSize: "var(--s-4)", marginTop: "var(--s-4)" }}>
            Almost nothing about the author of the Yoga Sūtra can be shown from the text itself. This page keeps apart what the tradition tells, what scholars can say, and what remains open.
          </p>
          <p style={{ marginTop: "var(--s-4)", display: "flex", gap: "1rem", alignItems: "center", flexWrap: "wrap" }}>
            <Link className="btn" href="/sutra/1-1">Begin at 1.1</Link><Grade g="editorial" />
          </p>
        </div>
        <figure className="pat-figure">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img className="pat-img" src="/patanjali.webp" width={994} height={1070} alt="Patañjali shown in the traditional form: seated with hands in prayer, a crown of seven cobra hoods behind him, his lower body coiled as a serpent." />
          <figcaption className="cite">An AI-generated image after the Patañjali statue at the Isha Yoga Center, Coimbatore. No portrait of Patañjali survives, so this is an imagining and not a likeness.</figcaption>
        </figure>
      </div>

      <section className="two pat-sec">
        <div>
          <p className="eyebrow">What the tradition says</p>
          <h2>A sage with a serpent&apos;s body</h2>
        </div>
        <div className="prose">
          <p>Patañjali is traditionally regarded as an incarnation of Ādi Śeṣa, the lord of serpents. That is why his statues show a figure that is half human and half snake, often with a crown of cobra hoods. In some descriptions he holds a conch, a wheel and a sword, said to stand for alertness, the destruction of ignorance and the cutting of ego.</p>
          <p>A well-known invocation praises one Patañjali for purifying the mind through yoga, speech through grammar and the body through medicine. It opens King Bhoja&apos;s eleventh-century commentary on the Yoga Sūtra. No Sanskrit text before the tenth century is known to say that the grammarian, the yoga author and the physician were one person.</p>
        </div>
      </section>

      <section className="two pat-sec">
        <div>
          <p className="eyebrow">What scholars can say</p>
          <h2>One name, perhaps several authors</h2>
        </div>
        <div className="prose">
          <p>&ldquo;Patañjali&rdquo; is attached to more than one work: the Yoga Sūtra, a grammar commentary called the Mahābhāṣya, and later medical texts. The Mahābhāṣya is usually dated to the middle of the second century BCE. It differs greatly from the Yoga Sūtra in subject, language and vocabulary, and the view that they have different authors is generally accepted, though some scholars treat them as one.</p>
          <p>The Yoga Sūtra itself has been dated anywhere from the second century BCE to the fifth century CE. Many place it in the second to fourth centuries CE, and Philipp Maas has argued for about 400 CE. The sūtras come with an early commentary, the Bhāṣya, which tradition ascribes to Vyāsa. Maas holds that the same Patañjali wrote both.</p>
          <p className="muted">Because these dates are disputed, this edition does not date the text on its own authority.</p>
        </div>
      </section>

      <section className="pat-sec">
        <p className="eyebrow">What he left</p>
        <h2 style={{ marginBottom: "var(--s-4)" }}>The text, on the thread</h2>
        <p className="col muted" style={{ marginBottom: "var(--s-5)" }}>This edition has {S.length} sūtras in four chapters. Some editions count 196. Every knot below opens its sūtra.</p>
        <ThreadServer />
        <div className="rows" style={{ marginTop: "var(--s-5)" }}>
          {PADAS.map((p) => (
            <Link key={p.n} className="row" href={`/read/${p.n}`}>
              <span className="num">{p.n}</span>
              <span><span className="r-deva" style={{ display: "block" }}>{p.deva}</span><span className="r-iast" style={{ display: "block" }}>{p.name}</span>
                <span className="r-en muted" style={{ display: "block" }}>{p.woods} · {S.filter((s) => s.pada === p.n).length} sūtras</span></span>
            </Link>
          ))}
        </div>
      </section>

      <section className="pat-sec">
        <p className="eyebrow">Sources</p>
        <ul className="prose" style={{ paddingLeft: "1.2rem" }}>
          <li><a href="https://en.wikipedia.org/wiki/Patanjali">Patanjali, Wikipedia</a>: the name, the grammarian question, the proposed dates, the invocation, and Maas&apos;s view.</li>
          <li><a href="https://elinepa.org/introduction-to-the-invocation-to-patanjali/">Introduction to the Invocation to Patañjali, ELINEPA</a>: the Ādi Śeṣa tradition and the iconography.</li>
        </ul>
        <p className="prov" style={{ marginTop: "var(--s-4)" }}>Written for this edition from the sources above, so graded Editorial. Scholarly claims are summaries and should be checked against the works of Maas, Renou and Bryant before being quoted.</p>
      </section>
    </>
  );
}
