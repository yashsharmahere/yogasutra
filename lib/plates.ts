/* Diagrams ported from the prototype. Words come from the text; arrangement is editorial. */
/* eslint-disable */
// @ts-nocheck
const esc = (s) => String(s).replace(/[&<>"]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" })[c]);
const HREF = (id) => "/sutra/" + id.replace(".", "-");
function defs(k){ return `<defs><marker id="ah-${k}" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse"><path class="ah" d="M0,0 L10,5 L0,10 z"/></marker><marker id="ahk-${k}" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse"><path class="ah-key" d="M0,0 L10,5 L0,10 z"/></marker></defs>`; }
function box(x,y,w,h,{iast,en,en2,id,key}){
  const cx = x + w/2, lines = [iast&&["t1",iast], en&&["",en], en2&&["",en2], id&&["t3",id]].filter(Boolean);
  const step = 17, y0 = y + h/2 - (lines.length-1)*step/2 + 4;
  const tx = lines.map(([c,s],i) => `<text class="${c}" x="${cx}" y="${y0 + i*step}" text-anchor="middle">${esc(s)}</text>`).join("");
  const inner = `<rect class="${key?"bx-key":"bx"}" x="${x}" y="${y}" width="${w}" height="${h}" rx="3"/>${tx}`;
  return id ? `<a href="${HREF(id.split(/[–,\s]/)[0])}" aria-label="${esc((iast||"")+" "+(en||"")+", sūtra "+id)}">${inner}</a>` : inner;
}
const arrow = (k,x1,y1,x2,y2,label,key,lx,ly) => `<line class="${key?"ln-key":"ln"}" x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}" marker-end="url(#${key?"ahk":"ah"}-${k})"/>${label?`<text class="lab" x="${lx??(x1+x2)/2}" y="${ly??((y1+y2)/2-6)}" text-anchor="middle">${esc(label)}</text>`:""}`;
const bracket = (x1,x2,y,label,cls="ln") => `<path class="${cls}" d="M${x1},${y-8} L${x1},${y} L${x2},${y} L${x2},${y-8}"/><text class="lab" x="${(x1+x2)/2}" y="${y+18}" text-anchor="middle">${esc(label)}</text>`;
const svg = (k,w,h,label,body) => `<div class="dg-wrap"><svg class="dg" viewBox="0 0 ${w} ${h}" role="img" aria-label="${esc(label)}">${defs(k)}${body}</svg></div>`;

export const PLATES = {
  limbs: {title:"The eight limbs", cites:"2.29, 3.4, 3.7, 3.8", covers:["2.28","2.55","3.1","3.8"],
    claim:"The eight aids of 2.29: five outer ones, then three inner ones that together are saṃyama, and even those three stand outside seedless concentration.",
    draw(){
      const L=[["yama","restraints","2.30"],["niyama","observances","2.32"],["āsana","posture","2.46"],["prāṇāyāma","breath","2.49"],["pratyāhāra","withdrawal","2.54"],["dhāraṇā","focus","3.1"],["dhyāna","meditation","3.2"],["samādhi","absorption","3.3"]];
      let b = `<text class="lab-s" x="12" y="28">2.29 · THE EIGHT AIDS TO YOGA, IN ORDER</text>`;
      L.forEach(([i,e,id],n) => { const x = 12+n*117; b += box(x,44,105,84,{iast:i,en:e,id,key:n>=5}); if(n<7) b += arrow("limbs",x+105,86,x+117,86,"",n>=5); });
      b += bracket(12,12+4*117+105,150,"outer aids (bahiraṅga) · 3.7");
      b += bracket(12+5*117,12+7*117+105,150,"inner aids, together called saṃyama · 3.4, 3.7","ln-key");
      b += arrow("limbs",12+6*117+52,176,12+6*117+52,228,"still outer to this · 3.8",true,12+6*117+52-90,206);
      b += box(12+6*117+52-140,232,280,62,{iast:"nirbīja samādhi",en:"seedless concentration",id:"1.51"});
      return svg("limbs",960,310,this.claim,b);
    }},
  klesa: {title:"The five afflictions", cites:"2.3–2.11", covers:["2.3","2.12"],
    claim:"Ignorance is the field in which the other four afflictions grow, and each of them can be dormant, attenuated, intercepted or active.",
    draw(){
      let b = `<rect class="field" x="12" y="16" width="706" height="262" rx="3"/>`;
      b += `<a href="${HREF("2.4")}" aria-label="avidyā, the field of the others, sūtra 2.4"><text class="t1" x="32" y="46">avidyā · ignorance</text><text x="32" y="66">the field in which the others grow</text><text class="t3" x="32" y="84">2.4</text></a>`;
      b += `<text x="32" y="106" class="lab">mistaking the impermanent, impure, painful and not-self for their opposites · 2.5</text>`;
      [["asmitā","I-am-ness","seer and seeing","as one","2.6"],["rāga","attachment","dwells on","pleasure","2.7"],["dveṣa","aversion","dwells on","pain","2.8"],["abhiniveśa","clinging to life","present even","in the wise","2.9"]]
        .forEach(([i,e,e2,e3,id],n) => { b += box(32+n*170,128,158,128,{iast:i,en:e,en2:e2+" "+e3,id}); });
      b += `<text class="lab-s" x="742" y="34">EACH CAN BE · 2.4</text>`;
      [["prasupta","dormant"],["tanu","attenuated"],["vicchinna","intercepted"],["udāra","active"]].forEach(([i,e],n) => {
        const y = 48+n*58; b += `<rect class="bx" x="742" y="${y}" width="206" height="46" rx="3"/><text class="t1" x="756" y="${y+20}">${i}</text><text x="756" y="${y+37}">${e}</text>`;
        if(n<3) b += `<line class="ln" x1="845" y1="${y+46}" x2="845" y2="${y+58}"/>`; });
      return svg("klesa",960,292,this.claim,b);
    }},
  pain: {title:"How suffering arises, and how it ends", cites:"2.16–2.26", covers:["2.15","2.27"],
    claim:"Ignorance binds the seer to the seen, and that binding causes the suffering still to come. Discernment ends ignorance, the binding falls away, and the seer stands alone.",
    draw(){
      let b = `<text class="lab-s" x="12" y="26">HOW IT ARISES</text>`;
      b += box(12,40,270,76,{iast:"avidyā",en:"ignorance",id:"2.24"});
      b += box(345,40,270,76,{iast:"saṃyoga",en:"the seer bound to the seen",id:"2.17"});
      b += box(678,40,270,76,{iast:"heyaṃ duḥkham anāgatam",en:"suffering yet to come",id:"2.16"});
      b += arrow("pain",282,78,345,78,"causes") + arrow("pain",615,78,678,78,"causes");
      b += `<text class="lab-s" x="12" y="166">HOW IT ENDS</text>`;
      b += box(12,180,270,76,{iast:"vivekakhyāti",en:"unwavering discernment",id:"2.26",key:true});
      b += box(345,180,270,76,{iast:"saṃyogābhāva",en:"ignorance gone, no binding",id:"2.25",key:true});
      b += box(678,180,270,76,{iast:"kaivalya",en:"the seer alone",id:"2.25",key:true});
      b += arrow("pain",282,218,345,218,"ends",true) + arrow("pain",615,218,678,218,"leaves",true);
      return svg("pain",960,272,this.claim,b);
    }},
  vrtti: {title:"The five fluctuations", cites:"1.5–1.11", covers:["1.5","1.11"],
    claim:"The mind's fluctuations are of five kinds, afflicted or not; valid knowledge itself has three sources.",
    draw(){
      let b = box(330,14,300,72,{iast:"vṛtti",en:"fluctuations: five kinds, afflicted or not",id:"1.5"});
      const K=[["pramāṇa","valid knowledge","perception · inference · word","1.7"],["viparyaya","misconception","not based on its form","1.8"],["vikalpa","conceptualizing","words with no object","1.9"],["nidrā","sleep","awareness of absence","1.10"],["smṛti","memory","holding what was known","1.11"]];
      K.forEach(([i,e,e2,id],n) => { const x = 12+n*189; b += `<path class="ln" d="M480,86 L480,104 L${x+88},104 L${x+88},126"/>`; b += box(x,126,177,100,{iast:i,en:e,en2:e2,id}); });
      b += `<text class="lab" x="490" y="100">listed in 1.6</text>`;
      return svg("vrtti",960,240,this.claim,b);
    }},
  ladder: {title:"The ladder of concentration", cites:"1.41–1.51", covers:["1.41","1.51"],
    claim:"Absorption moves from coarse objects to subtle ones, then to inner clarity and truth-bearing insight, whose trace stills every other trace until concentration has no seed at all.",
    draw(){
      const St=[["savitarka","coarse, with words","1.42"],["nirvitarka","coarse, words gone","1.43"],["savicāra · nirvicāra","subtle objects","1.44"],["adhyātma-prasāda","inner clarity","1.47"],["ṛtambharā prajñā","truth-bearing insight","1.48"],["nirbīja samādhi","seedless","1.51"]];
      let b = "";
      St.forEach(([i,e,id],n) => { const x = 12+n*158, y = 230-n*38; b += box(x,y,146,70,{iast:i,en:e,id,key:n===5}); if(n<5) b += arrow("ladder",x+146,y+35,x+158,y-3,"",n===4); });
      b += bracket(12,12+2*158+146,322,"seeded concentration (sabīja) · 1.46");
      b += `<text class="lab" x="${12+4*158+73}" y="64" text-anchor="middle">its trace stills all others · 1.50</text>`;
      return svg("ladder",960,350,this.claim,b);
    }},
};
const inRange = (id, a, b) => { const v = (s) => { const [p, n] = s.split(".").map(Number); return p * 100 + n; }; return v(id) >= v(a) && v(id) <= v(b); };
export const platesFor = (id) => Object.keys(PLATES).filter((k) => { const c = PLATES[k].covers; for (let i = 0; i < c.length; i += 2) if (inRange(id, c[i], c[i + 1])) return true; return false; });
export const PLATE_ORDER = ["limbs", "vrtti", "klesa", "pain", "ladder"];
