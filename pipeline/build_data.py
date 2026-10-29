"""Build the Yoga Sutra corpus JSON from the two source files.

Layers and how each is established:
  sanskrit  - SOURCE: GRETIL plain text (P. A. Maas input, Agashe 1904 edition)
  english   - SOURCE: J. H. Woods 1914, sutra-only translation (OCR hand-corrected)
  groups    - SOURCE: Woods' own group headings
  deva      - DERIVED: transliterated from the IAST by rule (indic_transliteration)
  concepts  - DERIVED: a term is tagged when its stem pattern matches the Sanskrit
  links     - DERIVED: two concepts are linked when they occur in the same sutra
  glosses   - EDITORIAL: one-line glosses written for this edition
"""
import json, re, itertools, collections, pathlib
from indic_transliteration import sanscript as s

ROOT = pathlib.Path(__file__).parent
raw = (ROOT / "data/gretil_sanskrit.txt").read_text(encoding="utf-8")
pairs = re.findall(r"(.+?) \|\| ys_(\d)\.(\d+) \|\|", raw)
sanskrit = {f"{p}.{n}": t.strip() for t, p, n in pairs}

english = {}
for line in (ROOT / "data/woods_1914.tsv").read_text(encoding="utf-8").splitlines():
    if line.strip():
        k, v = line.split("\t", 1)
        english[k] = v.strip()

assert list(sanskrit) == list(english), set(sanskrit) ^ set(english)

johnston = {}
for line in (ROOT / "data/johnston_1912.tsv").read_text(encoding="utf-8").splitlines():
    if line.strip():
        k, v = line.split("\t", 1)
        johnston[k] = v.strip()
assert set(johnston) == set(sanskrit), set(sanskrit) ^ set(johnston)
vivek = {}
for line in (ROOT / "data/vivekananda_1896.tsv").read_text(encoding="utf-8").splitlines():
    if line.strip():
        k, v = line.split("\t", 1); vivek[k] = v.strip()
vv_extra = json.loads((ROOT / "data/vivekananda_extra.json").read_text(encoding="utf-8"))
vv_map = json.loads((ROOT / "data/vivekananda_mapping.json").read_text(encoding="utf-8"))["by_ours"]
assert set(sanskrit) - set(vivek) == {"4.16"} and not (set(vivek) - set(sanskrit)), set(sanskrit) ^ set(vivek)

# Johnston is kept exactly as Project Gutenberg prints it; suspected transcription errors are flagged, not changed.
JOHNSTON_NOTES = {
    "2.30": "Gutenberg prints “nom injury”; read “non-injury”.",
    "3.3": "Gutenberg prints “in this meditative”; a word, probably “state”, appears to be missing.",
    "4.4": "Gutenberg prints “the Boston of the feeling of selfhood”, which looks like a transcription error. Not yet checked against the 1912 printing.",
}

def deva(iast):
    # Close up a word ending in a consonant with the next word, as printed editions do
    # (sukham āsanam -> sukhamāsanam -> सुखमासनम्). Words ending in a vowel or visarga keep their space.
    joined = re.sub(r"([kgṅcjñṭḍṇtdnpbmyrlvśṣs]) (?=\S)", r"\1", iast)
    return s.transliterate(joined, s.IAST, s.DEVANAGARI)

PADAS = [
    {"n": 1, "name": "Samādhi-pāda", "deva": "समाधिपादः", "woods": "Concentration"},
    {"n": 2, "name": "Sādhana-pāda", "deva": "साधनपादः", "woods": "Means of attainment"},
    {"n": 3, "name": "Vibhūti-pāda", "deva": "विभूतिपादः", "woods": "Supernormal powers"},
    {"n": 4, "name": "Kaivalya-pāda", "deva": "कैवल्यपादः", "woods": "Isolation"},
]

# Woods' group headings: (pada, first, last, heading, summary)
GROUPS = [
 (1,1,4,"Goal of Concentration","Yoga is the concentration which restricts the fluctuations. Freed from them, the Self attains to self-expression."),
 (1,5,11,"Forms of the mind-stuff","The fluctuations are all exposed to attack from the hindrances and are five in number: sources-of-valid-ideas, misconceptions, predicate-relations, sleep, memory."),
 (1,12,16,"Methods of restricting fluctuations","An orientation of the whole life with reference to one idea; an emotional transformation corresponding to this focused state."),
 (1,17,18,"Kinds of concentration","Four kinds of conscious concentration, and the concentration of subliminal-impressions alone."),
 (1,19,23,"Degrees of approach to concentration","The worldly approach; the spiritual approach; the combinations of methods and intensities; and the devotion to the highest Self."),
 (1,24,28,"Analysis of the highest Self","Unique quality of the highest Self; proof of His existence; His temporal priority; His symbolical realization."),
 (1,29,34,"Obstacles to the calming of the mind-stuff","The inner sense is exposed to distractions which may be overcome by focusing the mind; by the cultivation of sentiments; one may also practise breathings."),
 (1,35,39,"Attainment of Stability","Suitable objects for fixed-attention and contemplation."),
 (1,40,47,"Mastery and concentration","Classification of concentration with reference to different single objects or absence of objects, or to the mental act, or to a fusion of object and knower."),
 (1,48,51,"Normative insight","After-effects of concentrated insight efface after-effects of concentration upon objects."),
 (2,1,11,"Devices for weakening hindrances","Aids serviceable to the beginner who is on the path to concentration."),
 (2,12,14,"Karma","Origin of karma in hindrances; result of karma in state-of-existence, length of life, and pleasure or pain."),
 (2,15,15,"All is pain","Present and future and past correlations with objects result unavoidably in pain."),
 (2,16,16,"There is an escape","Only yogins are sensitive to future pain. This may be avoided in that it has not expressed itself in actual suffering."),
 (2,17,24,"Cause of pain","The Seer-sight relation: stresses between the aspects, the power of the undefiled Seer, and their correlation until the Seer's purpose is complete."),
 (2,25,25,"The escape","Positive state of Isolation follows the ending of the correlation."),
 (2,26,27,"Means of escape","The act of discrimination leading up to the act of insight."),
 (2,28,29,"Eight aids to yoga","To purify the aspects and to intensify intuitive thinking there are five indirect aids and three direct aids."),
 (2,30,31,"First indirect aid: five abstentions","The elements and degrees of morality in the form of prohibitions."),
 (2,32,32,"Second indirect aid: five observances","Advances in morality in the form of voluntary action."),
 (2,33,45,"Results of the abstentions and observances","Persistent inhibitions of certain kinds reorganize an increase of activity of the opposite kind."),
 (2,46,48,"Third indirect aid: postures","Bodily conditions favourable to concentration."),
 (2,49,52,"Fourth indirect aid: restraint of the breath","Calming of affective states is favourable to concentration."),
 (2,53,55,"Fifth indirect aid: withdrawal of the senses","The span of attention is confined to an inner object."),
 (3,1,1,"First direct aid: fixed-attention","The knower focuses the process of knowing upon the object to be known."),
 (3,2,2,"Second direct aid: contemplation","A two-term relation between the process of knowing and the object to be known."),
 (3,3,3,"Third direct aid: concentration","A fusion of the knower and the process of knowing with the object to be known."),
 (3,4,10,"Transition to seedless concentration","The direct aids in combination result in insight and restricted subliminal-impressions and the calm flow of the mind-stuff."),
 (3,11,15,"Mutations of substances","In the focused state the concentration holds two time-forms within the span of attention. Mutations are in fixed orders of subliminal-impressions in the restricted state."),
 (3,16,52,"Constraint applied to different orders of mutation","Given a single mutation of external-aspect or time-form or intensity, the whole sequence comes under control of the concentrated insight."),
 (3,53,55,"Culmination of concentration","The particular which is indiscernible in class or term or point-in-space is intuitively discerned. This is the attainment of Isolation."),
 (4,1,13,"Substances and subconsciousness","Correspondence between imperceptible forms of substance and latent-impressions of concentrated states."),
 (4,14,23,"Polemic against Idealism","Knowledge of the stream of consciousness is impossible unless it be a permanent order as contrasted with a succession of transient appearances."),
 (4,24,34,"Complete Self-realization of the Self","All hindrances subside; all acts of the Self are spontaneous and free."),
]
# Woods' two longest headings are lightly shortened above; the full wording is in his p. xxxiv and p. xxxviii.

group_of = {}
groups = []
for i, (p, a, b, h, summ) in enumerate(GROUPS):
    ids = [f"{p}.{n}" for n in range(a, b + 1)]
    groups.append({"id": i, "pada": p, "range": f"{p}.{a}" + ("" if a == b else f"–{b}"), "heading": h, "summary": summ, "sutras": ids})
    for k in ids:
        group_of[k] = i
assert set(group_of) == set(sanskrit), set(sanskrit) - set(group_of)

# Concepts: id, IAST, common English, Woods' rendering, kind, pattern, editorial gloss
C = [
 ("citta","citta","mind","mind-stuff","mind",r"citt","The field of awareness that takes the shape of whatever it attends to; what yoga sets out to still."),
 ("vrtti","vṛtti","fluctuation","fluctuation","mind",r"(?<!pra)(?<!ni)vṛtt(i|ay|er)","A movement or modification of the mind. The text names five kinds."),
 ("nirodha","nirodha","stilling","restriction","practice",r"nirodh","The restraint or settling of the mind's fluctuations; the text's own definition of yoga (1.2)."),
 ("abhyasa","abhyāsa","practice","practice","practice",r"bhyās","Sustained, repeated effort toward steadiness; one of the two means paired in 1.12."),
 ("vairagya","vairāgya","non-attachment","passionlessness","practice",r"vairāgy","Freedom from craving for what is seen or heard of; the partner of practice."),
 ("isvara","īśvara","the Lord","Içvara","being",r"[īe]śvar","A special Self untouched by hindrance or karma; devotion to it is one path to concentration."),
 ("pranava","praṇava","Om","Mystic-syllable","being",r"praṇav","The sacred syllable that expresses Īśvara (1.27)."),
 ("klesa","kleśa","affliction","hindrance","affliction",r"kleś","The five root troubles of the mind, listed in 2.3."),
 ("avidya","avidyā","ignorance","undifferentiated-consciousness","affliction",r"avidy","Taking the impermanent, impure, painful and not-self for their opposites (2.5); the root of the other afflictions."),
 ("asmita","asmitā","I-am-ness","feeling-of-personality","affliction",r"smit","Mistaking the power of seeing for the instrument of seeing as one self (2.6)."),
 ("duhkha","duḥkha","suffering","pain","affliction",r"duḥkh","Pain and dissatisfaction. Future suffering is what yoga sets out to avoid (2.16)."),
 ("karma","karma","action","karma","cause",r"karm","Action and the residue it leaves, ripening as birth, lifespan and experience."),
 ("samskara","saṃskāra","impression","subliminal-impression","cause",r"saṃskār","A latent trace left in the mind by experience, which shapes later activity."),
 ("vasana","vāsanā","latent tendency","subconscious-impression","cause",r"vāsan","A stored tendency waiting for the conditions that will express it."),
 ("purusa","puruṣa","the Self","Self","being",r"puruṣ","Pure consciousness, the witness, distinct from everything it sees."),
 ("drastr","draṣṭṛ","the Seer","Seer","being",r"draṣṭ","The one who sees; another name for puruṣa."),
 ("drsya","dṛśya","the seen","object-of-sight","matter",r"dṛśy","Everything that can be an object of awareness, made of the three guṇas."),
 ("guna","guṇa","quality","aspect","matter",r"(?<!anu)guṇ","The three strands of nature: brightness, activity and inertia."),
 ("prakrti","prakṛti","nature","primary-matter","matter",r"prakṛt","Primary matter, the source from which the seen world evolves."),
 ("pratyaya","pratyaya","presented idea","presented-idea","mind",r"pratyay","The content held in the mind at a given moment."),
 ("smrti","smṛti","memory","memory","mind",r"smṛt","Memory, one of the five fluctuations; also mindfulness in 1.20."),
 ("vikalpa","vikalpa","conceptualizing","predicate-relation","mind",r"vikalp","Knowledge carried by words with no real object behind it (1.9)."),
 ("manas","manas","mind (organ)","central-organ","mind",r"(?<![ru])mana[sḥ]|manoj","The mind as the organ that coordinates the senses."),
 ("ekagrata","ekāgratā","one-pointedness","singleness-of-intent","practice",r"kāgr","The mind resting on a single object."),
 ("prajna","prajñā","insight","insight","attainment",r"prajñ","Direct wisdom arising from concentration."),
 ("viveka","viveka","discernment","discrimination","attainment",r"vivek","Discriminating the seer from the seen; the means of release (2.26)."),
 ("samapatti","samāpatti","absorption","balanced-state","attainment",r"samāpatt","The mind taking on the colour of its object, like a clear jewel (1.41)."),
 ("bija","bīja","seed","seed","attainment",r"bīj","Seed: concentration with a seed has an object; seedless concentration has none."),
 ("samadhi","samādhi","concentration","concentration","limb",r"samādh","Complete absorption in the object; the eighth limb and the subject of the first pāda."),
 ("siddhi","siddhi","attainment","perfection","attainment",r"siddh(?!ad)","Extraordinary powers, called obstacles to concentration in 3.37."),
 ("kaivalya","kaivalya","liberation","Isolation","attainment",r"kaivaly","Aloneness: the Self standing in its own nature, free of the seen."),
 ("parinama","pariṇāma","transformation","mutation","matter",r"pariṇām","Change of form, state or time in the mind and in things."),
 ("yama","yama","restraints","abstentions","limb",r"(^|\s)yam","The first limb: non-harming, truthfulness, non-stealing, continence, non-grasping."),
 ("niyama","niyama","observances","observances","limb",r"niyam","The second limb: cleanliness, contentment, discipline, study, devotion."),
 ("asana","āsana","posture","posture","limb",r"(?<![vś])āsan(?!n)","The third limb: a seat that is steady and easy (2.46)."),
 ("prana","prāṇāyāma","breath regulation","restraint of the breath","limb",r"prāṇ","The fourth limb: regulating the movement of breath."),
 ("pratyahara","pratyāhāra","withdrawal","withdrawal of the senses","limb",r"pratyāhār","The fifth limb: the senses turning from their objects."),
 ("dharana","dhāraṇā","focus","fixed-attention","limb",r"(?<!vi)(?<!sā)(?<!va)dhāraṇ","The sixth limb: binding the mind to one place."),
 ("dhyana","dhyāna","meditation","contemplation","limb",r"dhyān","The seventh limb: an unbroken flow of attention toward the object."),
 ("samyama","saṃyama","integration","constraint","practice",r"saṃyam","Focus, meditation and absorption practised together on one object."),
 ("ahimsa","ahiṃsā","non-harming","abstinence from injury","practice",r"hiṃs","The first restraint; enmity falls away in its presence (2.35)."),
 ("tapas","tapas","discipline","self-castigation","practice",r"tapa[ḥs]","Austerity or disciplined effort; part of kriyā-yoga and the observances."),
 ("svadhyaya","svādhyāya","self-study","study","practice",r"svādhyāy","Study and recitation; part of kriyā-yoga and the observances."),
 ("maitri","maitrī","friendliness","friendliness","practice",r"maitr","Friendliness toward the happy; one of four attitudes that clear the mind (1.33)."),
]
KIND_LABEL = {"mind":"The mind","practice":"Practice","being":"Self and Lord","affliction":"Afflictions","cause":"Karma and traces","matter":"Nature and change","attainment":"Attainments","limb":"Eight limbs"}

concepts = []
tags = collections.defaultdict(list)
for cid, iast, en, woods, kind, pat, gloss in C:
    rx = re.compile(pat)
    hits = [k for k, t in sanskrit.items() if rx.search(t)]
    for k in hits:
        tags[k].append(cid)
    concepts.append({"id": cid, "iast": iast, "deva": deva(iast), "en": en, "woods": woods, "kind": kind,
                     "pattern": pat, "gloss": gloss, "sutras": hits})

pair_count = collections.Counter()
pair_where = collections.defaultdict(list)
for k, cs in tags.items():
    for a, b in itertools.combinations(sorted(cs), 2):
        pair_count[(a, b)] += 1
        pair_where[(a, b)].append(k)
links = [{"a": a, "b": b, "n": n, "sutras": pair_where[(a, b)]} for (a, b), n in pair_count.most_common()]

sutras = []
for k in sanskrit:
    p, n = k.split(".")
    sutras.append({"id": k, "pada": int(p), "n": int(n), "group": group_of[k], "iast": sanskrit[k],
                   "deva": deva(sanskrit[k]), "en": english[k], "jn": johnston[k],
                   **({"vv": vivek[k]} if k in vivek else {}), **({"vvmap": {"ref": vv_map[k]["vv"], "how": vv_map[k]["how"]}} if k in vv_map else {}), **({"vvnote": vv_extra["notes"][k]} if k in vv_extra["notes"] else {}),
                   **({"jnote": JOHNSTON_NOTES[k]} if k in JOHNSTON_NOTES else {}), "concepts": tags.get(k, [])})

src_meta = json.loads((ROOT / "data/johnston_source.json").read_text())

# Bhagavad Gita connections: candidates are DERIVED (find_gita_links.py); kept links and notes are EDITORIAL (reviewed by reading)
gl = json.loads((ROOT / "data/gita_links.json").read_text())
gv = {v["ref"]: v for v in json.loads((ROOT / "data/gita_verses.json").read_text())}
ncand = len(json.loads((ROOT / "data/gita_candidates.json").read_text()))
for l in gl["links"]:
    assert l["ys"] in sanskrit and l["bg"] in gv, l
gita = {"links": gl["links"], "kinds": gl["kinds"], "rejected": gl["rejected_examples"], "candidates": ncand,
        "reviewedTop": gl["reviewed_top"], "verseCount": len(gv),
        "verses": {r: {"deva": gv[r]["deva"], "iast": gv[r]["iast"]} for r in sorted({l["bg"] for l in gl["links"]})}}
tests = json.loads((ROOT / "data/ask_tests.json").read_text())
for t in tests:
    for g in t.get("gold", []): assert g in sanskrit, (t["id"], g)
out = {"vvExtra": {"extra": vv_extra["extra"], "gap": vv_extra["gap"]}, "johnstonSha": src_meta["sha256"], "gita": gita, "tests": tests, "padas": PADAS, "groups": groups, "sutras": sutras, "concepts": concepts, "links": links, "kinds": KIND_LABEL}
(ROOT / "data/corpus.json").write_text(json.dumps(out, ensure_ascii=False, separators=(",", ":")), encoding="utf-8")

# Report for review
print("sutras", len(sutras), {p["n"]: sum(1 for x in sutras if x["pada"] == p["n"]) for p in PADAS})
print("concepts", len(concepts), "links", len(links), "untagged", sum(1 for x in sutras if not x["concepts"]))
for c in concepts:
    print(f'{c["iast"]:<12} {len(c["sutras"]):>3}  {" ".join(c["sutras"])}')
