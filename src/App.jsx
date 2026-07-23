import React, { useState, useEffect, useRef } from "react";
import {
  Scale, Landmark, Gavel, Briefcase, BookOpen, Feather, Timer, Copy, Check,
  CheckCircle2, Circle, ChevronDown, Sparkles, Target, Info, Play, Pause, RotateCcw,
  Volume2, VolumeX, Wind, Gift, Trophy, Flame, Brain, PenLine, Heart, Star, Maximize2, Shuffle
} from "lucide-react";

/* ================= palette & type (baby pink · minimal) ================= */
const C = {
  bg: "#FFFCFD", card: "#FFFFFF", tint: "#FDF3F7", tint2: "#FBEAF1",
  pink: "#F7CBDD", pinkStrong: "#E890B0", rose: "#C76B92", roseDeep: "#A94E77",
  plum: "#40222F", mut: "#9E8893", line: "#F3E1E9", white: "#FFFFFF", sage: "#7FA98F",
};
const FD = '"Instrument Serif", Georgia, serif';
const FB = '"Inter", "Segoe UI", system-ui, sans-serif';
const FM = '"Spline Sans Mono", ui-monospace, monospace';

/* ================= persistence ================= */
const store = {
  async load(k, f) { try { const r = await window.storage.get(k); return r ? JSON.parse(r.value) : f; } catch { return f; } },
  async save(k, v) { try { await window.storage.set(k, JSON.stringify(v)); } catch {} },
};

/* ================= dates ================= */
const z = n => String(n).padStart(2, "0");
const ymd = d => `${d.getFullYear()}-${z(d.getMonth() + 1)}-${z(d.getDate())}`;
const addDays = (d, n) => new Date(d.getFullYear(), d.getMonth(), d.getDate() + n);

/* ================= content ================= */
const AREAS = [
  { id: "p", name: "Privado", icon: Scale, temas: [
    "Obligaciones y vicios del consentimiento", "Contratos y buena fe (art. 1603 CC)",
    "Resolución por incumplimiento (art. 1546 / 870)", "Excepción de contrato no cumplido (art. 1609)",
    "Responsabilidad civil (daño, nexo, imputación)", "Bienes, posesión y prescripción",
    "Familia, unión marital y sucesiones", "Sociedades, SAS y títulos valores",
    "Insolvencia (Ley 1116) y proceso civil (CGP)" ] },
  { id: "u", name: "Público", icon: Landmark, temas: [
    "Supremacía y bloque de constitucionalidad (art. 93)", "Estructura del Estado y territorio",
    "Derechos fundamentales y proporcionalidad", "Tutela y acciones (populares, cumplimiento)",
    "Control de constitucionalidad y tipos de sentencia", "Acto administrativo y silencio",
    "CPACA y medios de control", "Contratación estatal (Ley 80 / 1150)",
    "Responsabilidad del Estado (art. 90) · DIP y convencionalidad" ] },
  { id: "pe", name: "Penal", icon: Gavel, temas: [
    "Teoría del delito: tipicidad, dolo y culpa", "Antijuridicidad y causales de justificación",
    "Culpabilidad e inimputabilidad", "Autoría, participación y tentativa",
    "Concurso y dosimetría de la pena", "Parte especial (vida, patrimonio, adm. pública)",
    "Sistema acusatorio (Ley 906) y etapas", "Prueba, cadena de custodia y estándares",
    "SRPA y nociones de justicia transicional" ] },
  { id: "l", name: "Laboral", icon: Briefcase, temas: [
    "Contrato de trabajo y primacía de la realidad", "Jornada de 42 h y nocturno (Ley 2466/2025)",
    "Salario, recargos y prestaciones sociales", "Terminación, justas causas e indemnización",
    "Estabilidad laboral reforzada", "Derecho colectivo: sindicato, fuero y huelga",
    "Seguridad social y pensiones (Ley 100/1993)", "Reforma pensional (Ley 2381/2024, suspendida)",
    "Proceso laboral (CPTSS)" ] },
  { id: "f", name: "Fundamentos", icon: BookOpen, temas: [
    "Concepto de derecho: iusnaturalismo, positivismo, realismo", "Fuentes y jerarquía normativa",
    "Precedente judicial y su fuerza vinculante", "Interpretación, antinomias y lagunas",
    "Argumentación: subsunción y ponderación", "Historia constitucional (1886 / 1991)",
    "Ética profesional (Ley 1123/2007)", "Uso ético y responsable de la IA" ] },
];
const PRACTICE = {
  p: [
    "María vende su apartamento a Pedro; Pedro paga puntualmente las diez primeras cuotas. En la cuota once se retrasa ocho días y luego se pone al día. María recibe ese pago sin objetar nada y, dos años después, demanda la resolución del contrato por aquel incumplimiento. Formula el problema jurídico central y resuélvelo.",
    "El representante legal de una SAS celebra, a nombre de la sociedad, la compraventa de un inmueble con otra sociedad de la que él mismo es dueño, sin informar ni obtener autorización de la asamblea. La SAS pretende que se anule el negocio. Identifica el problema jurídico y resuélvelo.",
    "Ana deja su vehículo en un taller. Un empleado lo toma sin permiso para un encargo personal y causa un accidente que lesiona a un peatón. El peatón demanda al taller. Formula el problema jurídico de responsabilidad y resuélvelo, precisando el régimen aplicable.",
  ],
  u: [
    "Una autoridad ambiental niega una licencia mediante un acto que no expresa las razones de la negativa y, ante el recurso de reposición, guarda silencio. El interesado quiere impugnar. Formula el problema jurídico e indica la vía y el medio de control procedentes.",
    "Durante la ejecución de un contrato estatal sobreviene un hecho imprevisible y ajeno a las partes que encarece gravemente las obligaciones del contratista. El contratista reclama. Identifica el problema jurídico y la figura aplicable, con sus efectos.",
    "Un ciudadano interpone acción de tutela alegando que una entidad lo sancionó sin permitirle controvertir las pruebas en su contra. Formula el problema jurídico y resuélvelo aplicando el análisis que corresponde al derecho invocado.",
  ],
  pe: [
    "Juan, para asustar a quienes lo perseguían, dispara al piso; el proyectil rebota y causa la muerte de un transeúnte. Analiza la tipicidad subjetiva y califica la conducta, distinguiendo entre dolo eventual, culpa con representación y preterintención.",
    "Un funcionario encargado de custodiar bienes decomisados se apropia de varios de ellos para sí. Formula el problema jurídico y determina el tipo penal aplicable, distinguiéndolo de figuras afines.",
    "En un allanamiento realizado sin orden judicial ni consentimiento se halla el arma que incrimina al procesado. La defensa solicita su exclusión. Formula el problema jurídico probatorio y resuélvelo.",
  ],
  l: [
    "Una empresa vincula a Laura mediante un contrato de 'prestación de servicios' durante dos años, con horario fijo de 8 a. m. a 6 p. m., órdenes diarias de un jefe y un pago mensual igual. Al terminar, Laura reclama prestaciones sociales. Formula el problema jurídico y resuélvelo.",
    "Se despide sin justa causa a una trabajadora que había informado su estado de embarazo, sin autorización del inspector de trabajo. Identifica el problema jurídico y determina las consecuencias jurídicas del despido.",
    "Un trabajador presta servicios a partir de las 8 p. m. y también los domingos; el empleador no reconoce recargo alguno. Analiza el problema jurídico a la luz de la jornada y los recargos vigentes.",
  ],
  f: [
    "Dos disposiciones legales del mismo rango, expedidas en fechas distintas, regulan de forma contradictoria un mismo supuesto de hecho. Formula el problema jurídico y expón los criterios para resolver la antinomia.",
    "Un juez de instancia se aparta del precedente de la Corte que resolvía un caso análogo, sin ofrecer justificación alguna. Formula el problema jurídico desde la fuerza vinculante del precedente y la carga argumentativa exigible.",
    "Frente a un caso que la ley no previó de manera expresa, el operador jurídico debe decidir. Formula el problema jurídico de la laguna normativa y explica cómo se integra el ordenamiento para resolverlo.",
  ],
};
const RUBRIC = ["Identificación del problema jurídico", "Figura / norma correcta", "Análisis y subsunción",
  "Conclusión clara y derivada", "Claridad y redacción", "Disciplina de forma (≤500, sin citas, a tiempo)"];

const PRESETS = [
  { id: "pomo", label: "Pomodoro", focus: 25, brk: 5, long: 20, note: "25 de foco · 5 de pausa. Descanso largo cada 4.", pts: 10 },
  { id: "flow", label: "Enfoque", focus: 50, brk: 10, long: 20, note: "50 · 10. Para tareas que piden más profundidad.", pts: 22 },
  { id: "deep", label: "Profundo", focus: 90, brk: 20, long: 20, note: "90 · 20. Ciclo ultradiano de máxima concentración.", pts: 40 },
];
const SOUNDS = [
  { id: "off", label: "Silencio", icon: VolumeX },
  { id: "olas", label: "Olas del mar", icon: Wind, file: "/sounds/olas.mp3" },
  { id: "fogata", label: "Fogata", icon: Wind, file: "/sounds/fogata.mp3" },
  { id: "bosque", label: "Bosque", icon: Wind, file: "/sounds/bosque.mp3" },
  { id: "viento", label: "Viento suave", icon: Wind, file: "/sounds/viento.mp3" },
];
const RITUAL = [
  "Deja el teléfono en OTRA habitación (no basta silenciarlo)",
  "Cierra pestañas y apps que no uses; activa tu Modo Estudio en el Mac",
  "Agua a la mano y una meta clara para esta sesión",
];
const METHODS = [
  { t: "Recuperación activa", h: "Recordar de memoria, no releer.", e: "De las técnicas más eficaces (Dunlosky et al., 2013)." },
  { t: "Repaso espaciado", h: "Vuelve a cada tema en intervalos crecientes.", e: "Vence al olvido mejor que estudiar de un tirón." },
  { t: "Intercalado", h: "Mezcla áreas en una misma sesión.", e: "Ayuda a distinguir qué figura aplica a cada caso." },
  { t: "Elaboración", h: "Explica el porqué y conéctalo con lo que ya sabes.", e: "Utilidad moderada–alta." },
  { t: "Pomodoro y micro-descansos", h: "Bloques con pausas fijas por reloj.", e: "Reducen fatiga y sostienen la atención (revisiones 2025)." },
  { t: "Teléfono en otra habitación", h: "No basta silenciarlo: aléjalo.", e: "Su sola presencia baja tu capacidad mental (Ward et al., 2017)." },
  { t: "Premios que se ganan", h: "Empareja estudiar con algo que amas.", e: "«Temptation bundling»: sube la constancia (Milkman, 2014)." },
  { t: "Tests de práctica", h: "Simula el examen bajo reloj.", e: "Además bajan la ansiedad ante el examen (meta-análisis, 2023)." },
];
const REWARDS = [
  { tier: "Caprichos", name: "Hairclip nuevo", cost: 300 },
  { tier: "Caprichos", name: "Helado de proteína de Orso", cost: 350 },
  { tier: "Caprichos", name: "Açaí", cost: 400 },
  { tier: "Antojos", name: "Domicilio de poke de salmón", cost: 650 },
  { tier: "Antojos", name: "Bronceador de DLUCHIS", cost: 750 },
  { tier: "Antojos", name: "Salida a comer ñoquis", cost: 900 },
  { tier: "Grandes metas", name: "Ropa sin afán + tu prenda favorita", cost: 1600 },
  { tier: "Grandes metas", name: "Visita de tu novio", cost: 2000 },
];
const RANKS = [
  { xp: 0, name: "Novata" }, { xp: 300, name: "Estudiante aplicada" }, { xp: 800, name: "Pasante" },
  { xp: 1600, name: "Litigante junior" }, { xp: 3000, name: "Abogada" }, { xp: 5000, name: "Magistrada Pulga" },
];
const INTERVALS = [1, 3, 7, 16, 35];

/* ================= Web Audio noise ================= */
function makeBuffer(ctx, type) {
  const len = 2 * ctx.sampleRate, buf = ctx.createBuffer(1, len, ctx.sampleRate), d = buf.getChannelData(0);
  if (type === "white") { for (let i = 0; i < len; i++) d[i] = (Math.random() * 2 - 1) * 0.5; }
  else if (type === "brown") { let last = 0; for (let i = 0; i < len; i++) { const w = Math.random() * 2 - 1; last = (last + 0.02 * w) / 1.02; d[i] = last * 3.2; } }
  else { let a = 0; const k = 0.06; for (let i = 0; i < len; i++) { const w = (Math.random() * 2 - 1) * 0.5; a = a + k * (w - a); d[i] = a * 2.4; } } // soft (low-pass)
  return buf;
}

/* ================= atoms ================= */
function Ring({ pct, size = 132, stroke = 11, color = C.rose, track = "#F1DEE8" }) {
  const r = (size - stroke) / 2, circ = 2 * Math.PI * r, off = circ * (1 - Math.max(0, Math.min(100, pct)) / 100);
  return (
    <svg width={size} height={size} style={{ display: "block" }}>
      <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke={track} strokeWidth={stroke} />
      <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke={color} strokeWidth={stroke}
        strokeDasharray={circ} strokeDashoffset={off} strokeLinecap="round"
        transform={`rotate(-90 ${size / 2} ${size / 2})`} style={{ transition: "stroke-dashoffset .7s cubic-bezier(.4,0,.2,1)" }} />
    </svg>
  );
}
const Card = ({ children, style, pad = 20 }) =>
  <div style={{ background: C.card, border: `1px solid ${C.line}`, borderRadius: 18, padding: pad, ...style }}>{children}</div>;
const Eyebrow = ({ children }) =>
  <div style={{ fontFamily: FM, fontSize: 10.5, letterSpacing: "0.2em", textTransform: "uppercase", color: C.rose, marginBottom: 8 }}>{children}</div>;

/* ================= app ================= */
export default function App() {
  const [loaded, setLoaded] = useState(false);
  const [tab, setTab] = useState("inicio");
  const [profile, setProfile] = useState({ name: "Mariana", nick: "Pulga", examDate: "" });
  const [checks, setChecks] = useState(() => Object.fromEntries(AREAS.map(a => [a.id, a.temas.map(() => false)])));
  const [reviews, setReviews] = useState({});
  const [dojo, setDojo] = useState({ count: 0, best: 0, last: 0 });
  const [focus, setFocus] = useState({ sessions: 0, minutes: 0 });
  const [game, setGame] = useState({ pts: 0, xp: 0, streakLast: "", streakDays: 0, claimed: [] });

  useEffect(() => {
    const l = document.createElement("link"); l.rel = "stylesheet";
    l.href = "https://fonts.googleapis.com/css2?family=Instrument+Serif:ital@0;1&family=Inter:wght@400;500;600&family=Spline+Sans+Mono:wght@400;500;600&display=swap";
    document.head.appendChild(l);
  }, []);

  useEffect(() => {
    (async () => {
      const s = await store.load("prep:v2", null);
      if (s) {
        if (s.profile) setProfile(p => ({ ...p, ...s.profile }));
        if (s.checks) setChecks(prev => { const m = { ...prev }; AREAS.forEach(a => { if (Array.isArray(s.checks[a.id])) m[a.id] = a.temas.map((_, i) => !!s.checks[a.id][i]); }); return m; });
        if (s.reviews) setReviews(s.reviews);
        if (s.dojo) setDojo(s.dojo);
        if (s.focus) setFocus(s.focus);
        if (s.game) setGame(g => ({ ...g, ...s.game }));
      }
      setLoaded(true);
    })();
  }, []);

  useEffect(() => { if (loaded) store.save("prep:v2", { profile, checks, reviews, dojo, focus, game }); }, [loaded, profile, checks, reviews, dojo, focus, game]);

  const award = (n) => setGame(g => {
    const today = ymd(new Date());
    let days = g.streakDays, last = g.streakLast, bonus = 0;
    if (last !== today) {
      const yest = ymd(addDays(new Date(), -1));
      days = (last === yest ? g.streakDays : 0) + 1; last = today;
      bonus = 5 + (days === 3 ? 20 : 0) + (days === 7 ? 40 : 0) + (days === 14 ? 80 : 0) + (days === 30 ? 150 : 0);
    }
    const gain = n + bonus;
    return { ...g, pts: g.pts + gain, xp: g.xp + gain, streakDays: days, streakLast: last };
  });
  const redeem = (rw) => setGame(g => g.pts >= rw.cost ? { ...g, pts: g.pts - rw.cost, claimed: [{ name: rw.name, cost: rw.cost, date: ymd(new Date()) }, ...g.claimed] } : g);

  const toggleCheck = (aid, i) => {
    const key = `${aid}:${i}`, turningOn = !checks[aid][i];
    setChecks(prev => ({ ...prev, [aid]: prev[aid].map((v, idx) => idx === i ? !v : v) }));
    setReviews(prev => { const n = { ...prev }; if (turningOn) { n[key] = { idx: 0, next: ymd(addDays(new Date(), INTERVALS[0])) }; } else { delete n[key]; } return n; });
    if (turningOn) award(12);
  };
  const reviewTema = (key, remembered) => {
    setReviews(prev => {
      const cur = prev[key]; if (!cur) return prev;
      const idx = remembered ? Math.min(cur.idx + 1, INTERVALS.length - 1) : 0;
      return { ...prev, [key]: { idx, next: ymd(addDays(new Date(), INTERVALS[idx])) } };
    });
    if (remembered) award(8);
  };

  const areaPct = (aid) => { const a = checks[aid]; return a.length ? Math.round(a.filter(Boolean).length / a.length * 100) : 0; };
  const overall = Math.round(AREAS.reduce((s, a) => s + areaPct(a.id), 0) / AREAS.length);
  const todayStr = ymd(new Date());
  const dueReviews = Object.entries(reviews).filter(([, v]) => v.next <= todayStr)
    .map(([k]) => { const [aid, i] = k.split(":"); return { key: k, aid, tema: AREAS.find(a => a.id === aid).temas[Number(i)] }; });
  const rank = [...RANKS].reverse().find(r => game.xp >= r.xp) || RANKS[0];
  const nextRank = RANKS.find(r => r.xp > game.xp);

  const TABS = [
    { id: "inicio", label: "Inicio" }, { id: "sala", label: "Sala de estudio" }, { id: "areas", label: "Mis 5 áreas" },
    { id: "dojo", label: "Dojo 500" }, { id: "simulacro", label: "Simulacro" }, { id: "grupo", label: "Grupo" },
    { id: "premios", label: "Premios" }, { id: "metodos", label: "Métodos" },
  ];

  if (!loaded) return <div style={{ minHeight: 520, background: C.bg, display: "grid", placeItems: "center", fontFamily: FM, color: C.mut, fontSize: 12, letterSpacing: "0.2em", textTransform: "uppercase" }}>Preparando tu espacio…</div>;

  return (
    <div style={{ background: C.bg, color: C.plum, fontFamily: FB, minHeight: 640, padding: "18px 16px 40px" }}>
      <div style={{ maxWidth: 940, margin: "0 auto" }}>
        {/* masthead */}
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: 12, marginBottom: 14 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <div style={{ width: 40, height: 40, borderRadius: 12, background: C.pink, display: "grid", placeItems: "center", flexShrink: 0 }}><Heart size={19} color={C.roseDeep} fill={C.roseDeep} /></div>
            <div>
              <div style={{ fontFamily: FM, fontSize: 10, letterSpacing: "0.22em", textTransform: "uppercase", color: C.rose }}>Preparatorio Único · Rosario</div>
              <div style={{ fontFamily: FD, fontSize: 23, lineHeight: 1 }}>El estudio de {profile.nick || "Pulga"}</div>
            </div>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
            <div style={{ textAlign: "right" }}>
              <div style={{ fontSize: 10.5, color: C.mut, display: "flex", alignItems: "center", gap: 4, justifyContent: "flex-end" }}><Flame size={12} color={C.rose} /> racha {game.streakDays}d</div>
              <div style={{ fontFamily: FM, fontSize: 17, fontWeight: 600, color: C.rose }}>{game.pts} pts</div>
            </div>
            <div style={{ position: "relative", width: 44, height: 44 }}>
              <Ring pct={overall} size={44} stroke={5} color={C.pinkStrong} />
              <div style={{ position: "absolute", inset: 0, display: "grid", placeItems: "center", fontFamily: FM, fontSize: 10.5, color: C.rose }}>{overall}%</div>
            </div>
          </div>
        </div>

        {/* tabs */}
        <div style={{ display: "flex", gap: 6, overflowX: "auto", paddingBottom: 4, marginBottom: 18 }}>
          {TABS.map(t => {
            const on = tab === t.id;
            return <button key={t.id} onClick={() => setTab(t.id)} style={{ fontFamily: FB, fontSize: 13.5, fontWeight: on ? 600 : 500, whiteSpace: "nowrap", padding: "8px 15px", borderRadius: 999, cursor: "pointer", border: `1px solid ${on ? C.pinkStrong : C.line}`, background: on ? C.pinkStrong : "transparent", color: on ? C.white : C.mut, transition: "all .15s" }}>{t.label}</button>;
          })}
        </div>

        <div key={tab} style={{ animation: "fade .35s ease" }}>
          {tab === "inicio" && <Inicio profile={profile} setProfile={setProfile} overall={overall} areaPct={areaPct} rank={rank} nextRank={nextRank} game={game} dueReviews={dueReviews} reviewTema={reviewTema} focus={focus} go={setTab} />}
          {tab === "sala" && <Sala award={award} setFocus={setFocus} />}
          {tab === "areas" && <Areas checks={checks} toggle={toggleCheck} areaPct={areaPct} />}
          {tab === "dojo" && <Dojo award={award} dojo={dojo} setDojo={setDojo} />}
          {tab === "simulacro" && <Simulacro award={award} />}
          {tab === "grupo" && <Flashcards award={award} />}
          {tab === "premios" && <Premios game={game} redeem={redeem} rank={rank} nextRank={nextRank} />}
          {tab === "metodos" && <Metodos />}
        </div>

        <div style={{ marginTop: 26, paddingTop: 14, borderTop: `1px solid ${C.line}`, fontSize: 11, color: C.mut, textAlign: "center", lineHeight: 1.5 }}>
          Tú marcas el ritmo, Pulga. Este panel te acompaña; el reglamento vigente (Acuerdo 02 de 2024) manda.
        </div>
      </div>
      <style>{`@keyframes fade{from{opacity:0;transform:translateY(6px)}to{opacity:1;transform:none}}
        @keyframes breathe{0%,100%{transform:scale(1)}50%{transform:scale(1.035)}}
        @keyframes slide{0%{transform:translateX(-120%)}100%{transform:translateX(320%)}}
        input[type=range]{accent-color:${C.pinkStrong}}
        button:focus-visible{outline:2px solid ${C.pinkStrong};outline-offset:2px}
        @media (prefers-reduced-motion: reduce){*{animation:none!important;transition:none!important}}`}</style>
    </div>
  );
}

/* ================= INICIO ================= */
function Inicio({ profile, setProfile, overall, areaPct, rank, nextRank, game, dueReviews, reviewTema, focus, go }) {
  const days = profile.examDate ? Math.round((new Date(profile.examDate + "T00:00:00") - (() => { const t = new Date(); t.setHours(0, 0, 0, 0); return t; })()) / 86400000) : null;
  const msg = days === null ? "Fija tu fecha y el examen deja de ser una nube y pasa a ser un plan."
    : days < 0 ? "La fecha ya pasó. Si es otra convocatoria, actualízala."
    : days === 0 ? "Es hoy. Respira: ya construiste lo que hoy vas a mostrar."
    : days <= 7 ? "Recta final. Repasa liviano, duerme bien y confía en lo hecho."
    : days <= 20 ? "Afinamiento: simulacros cronometrados y tus áreas más flojas."
    : days <= 60 ? "El bloque fuerte. Una redacción de 500 por semana marca la diferencia."
    : "Tiempo de sobra si empiezas hoy. Constancia pequeña, todos los días.";
  const toNext = nextRank ? Math.round(((game.xp - rank.xp) / (nextRank.xp - rank.xp)) * 100) : 100;

  return (
    <div style={{ display: "grid", gap: 16 }}>
      <Card pad={0} style={{ overflow: "hidden" }}>
        <div style={{ padding: "22px 22px 6px" }}>
          <Eyebrow>Cuenta regresiva</Eyebrow>
          <div style={{ fontFamily: FD, fontSize: 27, lineHeight: 1.08 }}>Hola, {profile.nick || "Pulga"}. Vas a estar lista.</div>
        </div>
        <div style={{ display: "flex", alignItems: "flex-end", gap: 18, flexWrap: "wrap", padding: "4px 22px 22px" }}>
          <div>
            <div style={{ fontFamily: FM, fontWeight: 600, color: C.rose, lineHeight: 0.85, fontSize: 74 }}>{days === null ? "—" : Math.max(0, days)}</div>
            <div style={{ fontFamily: FM, fontSize: 11.5, letterSpacing: "0.14em", textTransform: "uppercase", color: C.mut, marginTop: 2 }}>{days === null ? "días" : "días para el escrito"}</div>
          </div>
          <div style={{ flex: 1, minWidth: 240, fontSize: 15, lineHeight: 1.5, paddingBottom: 6 }}>{msg}</div>
        </div>
      </Card>

      <Card style={{ background: C.tint, borderColor: C.pink }}>
        <div style={{ display: "flex", gap: 12 }}>
          <Sparkles size={20} color={C.rose} style={{ flexShrink: 0, marginTop: 2 }} />
          <div style={{ fontSize: 14.5, lineHeight: 1.55 }}>
            <b>Lo que calma el miedo:</b> el escrito no se juega en una sola área. Recibes 5 problemas —uno por área— y todos suman a <b>una sola nota /100 (apruebas con 60)</b>. Ninguna área decide sola: una fortaleza compensa un punto flojo. Lo único que se te asigna es el <b>sujeto</b>. Tu trabajo: que ninguna área quede débil.
          </div>
        </div>
      </Card>

      {/* rank + focus + entra a la sala */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))", gap: 16 }}>
        <Card>
          <Eyebrow>Tu nivel</Eyebrow>
          <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 10 }}>
            <Trophy size={20} color={C.rose} />
            <div style={{ fontFamily: FD, fontSize: 21 }}>{rank.name}</div>
          </div>
          <div style={{ height: 8, background: "#F1DEE8", borderRadius: 99, overflow: "hidden" }}>
            <div style={{ width: `${toNext}%`, height: "100%", background: C.pinkStrong, transition: "width .5s" }} />
          </div>
          <div style={{ fontSize: 12, color: C.mut, marginTop: 6 }}>{nextRank ? `${game.xp} / ${nextRank.xp} XP · sigue: ${nextRank.name}` : "¡Nivel máximo, Magistrada!"}</div>
        </Card>
        <Card style={{ display: "flex", flexDirection: "column", justifyContent: "space-between" }}>
          <div>
            <Eyebrow>Sala de estudio</Eyebrow>
            <div style={{ fontSize: 14, color: C.mut, lineHeight: 1.5 }}>Modo foco con reloj y sonido para desconectarte de todo. Llevas <b style={{ fontFamily: FM, color: C.rose }}>{focus.sessions}</b> sesiones · <b style={{ fontFamily: FM, color: C.rose }}>{Math.round(focus.minutes)}</b> min.</div>
          </div>
          <button onClick={() => go("sala")} style={{ ...btnPrimary, marginTop: 12, justifyContent: "center" }}><Brain size={16} /> Entrar en foco</button>
        </Card>
      </div>

      {dueReviews.length > 0 && (
        <Card>
          <Eyebrow>Repaso de hoy · {dueReviews.length}</Eyebrow>
          <div style={{ fontSize: 12.5, color: C.mut, marginBottom: 10 }}>Repaso espaciado: recordar justo antes de olvidar es lo que fija el conocimiento.</div>
          <div style={{ display: "grid", gap: 8 }}>
            {dueReviews.slice(0, 6).map(r => (
              <div key={r.key} style={{ display: "flex", alignItems: "center", gap: 8, flexWrap: "wrap" }}>
                <span style={{ flex: 1, minWidth: 160, fontSize: 13.5 }}>{r.tema}</span>
                <button onClick={() => reviewTema(r.key, true)} style={btnMini}>Lo recuerdo ✓</button>
                <button onClick={() => reviewTema(r.key, false)} style={btnMiniGhost}>Repasar pronto</button>
              </div>
            ))}
          </div>
        </Card>
      )}

      <Card>
        <Eyebrow>Tu mapa de un vistazo</Eyebrow>
        <div style={{ display: "grid", gap: 10 }}>
          {AREAS.map(a => { const pct = areaPct(a.id); const A = a.icon; return (
            <div key={a.id} style={{ display: "flex", alignItems: "center", gap: 10 }}>
              <A size={15} color={C.rose} style={{ flexShrink: 0 }} />
              <div style={{ width: 92, fontSize: 13.5, fontWeight: 500 }}>{a.name}</div>
              <div style={{ flex: 1, height: 8, background: "#F1DEE8", borderRadius: 99, overflow: "hidden" }}><div style={{ width: `${pct}%`, height: "100%", background: pct === 100 ? C.sage : C.pinkStrong, transition: "width .5s" }} /></div>
              <div style={{ fontFamily: FM, fontSize: 12, width: 34, textAlign: "right", color: C.mut }}>{pct}%</div>
            </div>
          ); })}
        </div>
        <button onClick={() => go("areas")} style={{ ...btnGhost, marginTop: 14 }}>Ir a mis áreas →</button>
      </Card>

      <Card>
        <Eyebrow>Personaliza</Eyebrow>
        <div style={{ display: "grid", gap: 12, gridTemplateColumns: "repeat(auto-fit, minmax(160px, 1fr))" }}>
          <label style={{ fontSize: 12.5, color: C.mut }}>Nombre<input value={profile.name} onChange={e => setProfile(p => ({ ...p, name: e.target.value }))} style={inp} /></label>
          <label style={{ fontSize: 12.5, color: C.mut }}>Apodo<input value={profile.nick} onChange={e => setProfile(p => ({ ...p, nick: e.target.value }))} style={inp} /></label>
          <label style={{ fontSize: 12.5, color: C.mut }}>Fecha del escrito<input type="date" value={profile.examDate} onChange={e => setProfile(p => ({ ...p, examDate: e.target.value }))} style={inp} /></label>
        </div>
      </Card>
    </div>
  );
}

/* ================= SALA DE ESTUDIO ================= */
function Sala({ award, setFocus }) {
  const [ritual, setRitual] = useState(RITUAL.map(() => false));
  const [intention, setIntention] = useState("");
  const [presetId, setPresetId] = useState("pomo");
  const [sound, setSound] = useState("off");
  const [vol, setVol] = useState(0.4);
  const [inFocus, setInFocus] = useState(false);
  const [phase, setPhase] = useState("focus");
  const [secs, setSecs] = useState(25 * 60);
  const [running, setRunning] = useState(false);
  const [cycle, setCycle] = useState(0);
  const ctxRef = useRef(null), srcRef = useRef(null), gainRef = useRef(null), rootRef = useRef(null);
  const bufferCacheRef = useRef({});
  const preset = PRESETS.find(p => p.id === presetId);
  const ritualDone = ritual.filter(Boolean).length;

  useEffect(() => { if (!running) return; const id = setInterval(() => setSecs(s => (s <= 0 ? 0 : s - 1)), 1000); return () => clearInterval(id); }, [running]);
  useEffect(() => {
    if (secs !== 0 || !inFocus) return;
    setRunning(false);
    if (phase === "focus") {
      award(preset.pts);
      setFocus(f => ({ sessions: f.sessions + 1, minutes: f.minutes + preset.focus }));
      const nc = cycle + 1; setCycle(nc);
      const long = nc % 4 === 0; setPhase(long ? "long" : "break");
      setSecs((long ? preset.long : preset.brk) * 60);
    } else { award(5); setPhase("focus"); setSecs(preset.focus * 60); }
  }, [secs]); // eslint-disable-line

  // sound engine
  const stopSound = () => { try { srcRef.current && srcRef.current.stop(); } catch {} srcRef.current = null; };
  const bufferCacheRef = useRef({});
const startSound = async (type) => {
  if (type === "off") { stopSound(); return; }
  try {
    if (!ctxRef.current) { const AC = window.AudioContext || window.webkitAudioContext; ctxRef.current = new AC(); gainRef.current = ctxRef.current.createGain(); gainRef.current.connect(ctxRef.current.destination); }
    ctxRef.current.resume && ctxRef.current.resume();
    gainRef.current.gain.value = vol;
    stopSound();
    const sound = SOUNDS.find(s => s.id === type);
    let buffer = bufferCacheRef.current[type];
    if (!buffer) {
      const res = await fetch(sound.file);
      const arr = await res.arrayBuffer();
      buffer = await ctxRef.current.decodeAudioData(arr);
      bufferCacheRef.current[type] = buffer;
    }
    const src = ctxRef.current.createBufferSource();
    src.buffer = buffer; src.loop = true; src.connect(gainRef.current); src.start();
    srcRef.current = src;
  } catch (e) {
    console.error("No se pudo cargar el sonido:", e);
  }
};
  useEffect(() => () => stopSound(), []);
  useEffect(() => { if (gainRef.current) gainRef.current.gain.value = vol; }, [vol]);
  const chooseSound = (id) => { setSound(id); startSound(id); };

  const enter = () => {
    setPhase("focus"); setSecs(preset.focus * 60); setCycle(0); setInFocus(true); setRunning(true);
    if (sound !== "off") startSound(sound);
    try { rootRef.current && rootRef.current.requestFullscreen && rootRef.current.requestFullscreen(); } catch {}
  };
  const leave = () => { setRunning(false); setInFocus(false); stopSound(); try { document.fullscreenElement && document.exitFullscreen(); } catch {} };

  const mm = String(Math.floor(secs / 60)).padStart(2, "0"), ss = String(secs % 60).padStart(2, "0");
  const phaseLabel = phase === "focus" ? "Foco" : phase === "long" ? "Descanso largo" : "Descanso";
  const total = (phase === "focus" ? preset.focus : phase === "long" ? preset.long : preset.brk) * 60;
  const pct = total ? ((total - secs) / total) * 100 : 0;

  if (inFocus) return (
    <div ref={rootRef} style={{ background: phase === "focus" ? C.tint : C.tint2, borderRadius: 22, padding: "40px 20px", minHeight: 460, display: "grid", placeItems: "center", textAlign: "center" }}>
      <div>
        <div style={{ fontFamily: FM, fontSize: 11, letterSpacing: "0.24em", textTransform: "uppercase", color: C.rose, marginBottom: 18 }}>{phaseLabel} · {preset.label}{phase === "focus" ? ` · pomodoro ${cycle + 1}` : ""}</div>
        <div style={{ position: "relative", width: 240, height: 240, margin: "0 auto", animation: running && phase === "focus" ? "breathe 6s ease-in-out infinite" : "none" }}>
          <Ring pct={pct} size={240} stroke={8} color={phase === "focus" ? C.pinkStrong : C.sage} track="#F6E4EC" />
          <div style={{ position: "absolute", inset: 0, display: "grid", placeItems: "center" }}>
            <div style={{ fontFamily: FM, fontSize: 52, fontWeight: 600, color: C.plum }}>{mm}:{ss}</div>
          </div>
        </div>
        {intention && <div style={{ marginTop: 20, fontFamily: FD, fontSize: 18, color: C.plum, maxWidth: 420 }}>“{intention}”</div>}
        <div style={{ display: "flex", gap: 10, justifyContent: "center", marginTop: 22, flexWrap: "wrap" }}>
          <button onClick={() => setRunning(r => !r)} style={btnPrimary}>{running ? <><Pause size={15} /> Pausar</> : <><Play size={15} /> Reanudar</>}</button>
          <button onClick={() => { setSecs(total); }} style={btnGhost}><RotateCcw size={14} /> Reiniciar</button>
          <button onClick={() => chooseSound(sound === "off" ? "brown" : "off")} style={btnGhost}>{sound === "off" ? <VolumeX size={15} /> : <Volume2 size={15} />} {sound === "off" ? "Sonido" : "Silenciar"}</button>
          <button onClick={leave} style={btnGhost}>Salir</button>
        </div>
      </div>
    </div>
  );

  return (
    <div style={{ display: "grid", gap: 16 }}>
      <Card>
        <Eyebrow>Sala de estudio</Eyebrow>
        <div style={{ fontFamily: FD, fontSize: 20, marginBottom: 3 }}>Cierra el mundo. Aquí solo estás tú y tu examen.</div>
        <div style={{ fontSize: 13.5, color: C.mut, lineHeight: 1.5 }}>Un espacio de foco con reloj y sonido ambiente, diseñado para que te desconectes de las redes y entres en concentración profunda.</div>
      </Card>

      <Card>
        <Eyebrow>1 · Antes de empezar</Eyebrow>
        <div style={{ display: "grid", gap: 6, marginBottom: 8 }}>
          {RITUAL.map((r, i) => { const on = ritual[i]; return (
            <button key={i} onClick={() => setRitual(p => p.map((v, idx) => idx === i ? !v : v))} style={{ display: "flex", alignItems: "flex-start", gap: 10, padding: "9px 8px", borderRadius: 10, background: on ? C.tint : "transparent", border: "none", cursor: "pointer", textAlign: "left", width: "100%" }}>
              {on ? <CheckCircle2 size={18} color={C.sage} style={{ flexShrink: 0, marginTop: 1 }} /> : <Circle size={18} color="#DCC7D2" style={{ flexShrink: 0, marginTop: 1 }} />}
              <span style={{ fontSize: 13.8, lineHeight: 1.4, color: on ? C.plum : C.mut }}>{r}</span>
            </button>
          ); })}
        </div>
        <label style={{ fontSize: 12.5, color: C.mut }}>Mi meta para esta sesión
          <input value={intention} onChange={e => setIntention(e.target.value)} placeholder="Ej.: resolver 2 problemas de Público" style={inp} />
        </label>
      </Card>

      <Card>
        <Eyebrow>2 · Elige tu ritmo</Eyebrow>
        <div style={{ display: "grid", gap: 8 }}>
          {PRESETS.map(p => { const on = presetId === p.id; return (
            <button key={p.id} onClick={() => setPresetId(p.id)} style={{ display: "flex", alignItems: "center", gap: 12, padding: "12px 14px", borderRadius: 12, cursor: "pointer", textAlign: "left", width: "100%", border: `1px solid ${on ? C.pinkStrong : C.line}`, background: on ? C.tint : "transparent" }}>
              <Timer size={17} color={on ? C.rose : C.mut} style={{ flexShrink: 0 }} />
              <div style={{ flex: 1 }}>
                <div style={{ fontWeight: 600, fontSize: 14.5 }}>{p.label} <span style={{ fontFamily: FM, fontSize: 12, color: C.rose }}>+{p.pts} pts</span></div>
                <div style={{ fontSize: 12.3, color: C.mut }}>{p.note}</div>
              </div>
              {on && <Check size={16} color={C.rose} />}
            </button>
          ); })}
        </div>
      </Card>

      <Card>
        <Eyebrow>3 · Sonido para concentrarte</Eyebrow>
        <div style={{ fontSize: 12.3, color: C.mut, marginBottom: 10 }}>El ruido constante enmascara distracciones y ayuda a muchas personas a enfocarse. Prueba cuál te sienta mejor.</div>
        <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginBottom: 12 }}>
          {SOUNDS.map(s => { const on = sound === s.id; const I = s.icon; return (
            <button key={s.id} onClick={() => chooseSound(s.id)} style={{ display: "inline-flex", alignItems: "center", gap: 6, fontFamily: FB, fontSize: 12.5, padding: "7px 12px", borderRadius: 99, cursor: "pointer", border: `1px solid ${on ? C.pinkStrong : C.line}`, background: on ? C.pinkStrong : "transparent", color: on ? C.white : C.mut }}>
              <I size={13} /> {s.label}
            </button>
          ); })}
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <Volume2 size={15} color={C.mut} />
          <input type="range" min={0} max={1} step={0.05} value={vol} onChange={e => setVol(Number(e.target.value))} style={{ flex: 1 }} />
        </div>
      </Card>

      <button onClick={enter} disabled={ritualDone < RITUAL.length} style={{ ...btnPrimary, justifyContent: "center", padding: "14px 18px", fontSize: 15, opacity: ritualDone < RITUAL.length ? 0.5 : 1, cursor: ritualDone < RITUAL.length ? "not-allowed" : "pointer" }}>
        <Maximize2 size={16} /> {ritualDone < RITUAL.length ? "Completa el ritual para entrar" : "Entrar en foco"}
      </button>
    </div>
  );
}

/* ================= ÁREAS ================= */
function Areas({ checks, toggle, areaPct }) {
  const [open, setOpen] = useState("p");
  return (
    <div style={{ display: "grid", gap: 12 }}>
      <div style={{ fontSize: 13.5, color: C.mut, lineHeight: 1.5 }}>Marca lo que ya dominas (ganas <b style={{ color: C.rose }}>+12 pts</b> por tema y entra a tu repaso espaciado). Al 100%, el área queda sellada. Empieza por tus dos más flojas.</div>
      {AREAS.map(a => {
        const pct = areaPct(a.id), isOpen = open === a.id, A = a.icon, sealed = pct === 100;
        return (
          <Card key={a.id} pad={0} style={{ overflow: "hidden" }}>
            <button onClick={() => setOpen(isOpen ? "" : a.id)} style={{ width: "100%", display: "flex", alignItems: "center", gap: 13, padding: "15px 17px", background: "transparent", border: "none", cursor: "pointer", textAlign: "left" }}>
              <div style={{ position: "relative", width: 42, height: 42, flexShrink: 0 }}>
                <Ring pct={pct} size={42} stroke={5} color={sealed ? C.sage : C.pinkStrong} />
                <div style={{ position: "absolute", inset: 0, display: "grid", placeItems: "center" }}>{sealed ? <Check size={16} color={C.sage} /> : <A size={16} color={C.rose} />}</div>
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ fontFamily: FD, fontSize: 18 }}>{a.name}</div>
                <div style={{ fontSize: 12, color: C.mut }}>{a.temas.filter((_, i) => checks[a.id][i]).length} de {a.temas.length} temas{sealed ? " · sellada ✦" : ""}</div>
              </div>
              <div style={{ fontFamily: FM, fontSize: 14, color: sealed ? C.sage : C.rose, fontWeight: 600 }}>{pct}%</div>
              <ChevronDown size={18} color={C.mut} style={{ transform: isOpen ? "rotate(180deg)" : "none", transition: "transform .2s", flexShrink: 0 }} />
            </button>
            {isOpen && <div style={{ padding: "2px 17px 16px", display: "grid", gap: 4 }}>
              {a.temas.map((t, i) => { const on = checks[a.id][i]; return (
                <button key={i} onClick={() => toggle(a.id, i)} style={{ display: "flex", alignItems: "flex-start", gap: 10, padding: "8px 8px", borderRadius: 9, background: on ? C.tint : "transparent", border: "none", cursor: "pointer", textAlign: "left", width: "100%" }}>
                  {on ? <CheckCircle2 size={18} color={C.sage} style={{ flexShrink: 0, marginTop: 1 }} /> : <Circle size={18} color="#DCC7D2" style={{ flexShrink: 0, marginTop: 1 }} />}
                  <span style={{ fontSize: 13.8, lineHeight: 1.4, color: on ? C.plum : C.mut }}>{t}</span>
                </button>
              ); })}
            </div>}
          </Card>
        );
      })}
    </div>
  );
}

/* ================= evaluador (IA) ================= */
const EXAMINER_SYS = `Eres un evaluador experto del Preparatorio Único Integrado de la Facultad de Jurisprudencia de la Universidad del Rosario. Tienes formación de magíster y dominio profundo de las cinco áreas del derecho colombiano (Privado, Público, Penal, Laboral y Fundamentos). En esta evaluación actúas como especialista del área que se te indique.

Tu tarea: calificar la respuesta de una estudiante a un problema jurídico con el rigor de la prueba real, pero con propósito formativo. Ella se está entrenando; tu feedback debe enseñarle por qué gana o pierde puntos y cómo mejorar.

Califica con esta rúbrica, cada criterio de 0 a 3 (total sobre 18). Descriptores:
1) Identificación del problema jurídico — 0: no lo identifica o es errado; 1: difuso; 2: correcto pero incompleto; 3: lo formula con precisión.
2) Figura o norma correcta — 0: equivocada; 1: parcial o imprecisa; 2: correcta con vacíos; 3: identifica con exactitud la figura y su fundamento en el derecho colombiano.
3) Análisis y subsunción — 0: afirmaciones sin razonamiento; 1: débil; 2: aplica la regla a los hechos con lógica; 3: subsunción sólida, con matices y descarte de alternativas.
4) Conclusión — 0: ausente o incoherente; 1: débil; 2: clara; 3: clara, precisa y derivada del análisis.
5) Claridad y redacción — 0: confusa; 1: irregular; 2: aceptable; 3: estructurada, directa, sin relleno.
6) Disciplina de forma — 0: excede 500 palabras, incluye citas o queda incompleta; 1: al límite o con fallas; 2: bien con leves excesos; 3: dentro de 500, sin citas, estructura clara. Se te informa el número de palabras.

Reglas de calificación:
- Sé exigente y honesto: no infles la nota. Un 3 exige razonamiento correcto y sólido. Si la respuesta está vacía o es muy pobre, dilo con respeto y califica bajo.
- Umbral de aprobación: 11/18 (60%). Meta de excelencia: 14 o más.

Integridad (muy importante):
- Razona desde la doctrina y la normativa colombiana consolidada. NO inventes jurisprudencia, números de artículo ni citas. Si no estás seguro de una norma específica, no la afirmes como cierta.
- La prueba real prohíbe citar fuentes, así que NO penalices la ausencia de citas: evalúa la solidez del razonamiento y la correcta identificación de las figuras.
- Evalúa solo la respuesta frente al problema; no traigas hechos que no están.

Devuelve ÚNICAMENTE un objeto JSON válido, sin markdown y sin texto antes o después, con esta forma exacta:
{
 "problema_correcto": "1 a 3 frases: cuál era el problema jurídico central y la figura o norma clave que debía identificar",
 "criterios": [
   {"puntaje": 0, "comentario": "una frase fundamentada"},
   {"puntaje": 0, "comentario": "..."},
   {"puntaje": 0, "comentario": "..."},
   {"puntaje": 0, "comentario": "..."},
   {"puntaje": 0, "comentario": "..."},
   {"puntaje": 0, "comentario": "..."}
 ],
 "veredicto": "aprobado o no aprobado",
 "fortalezas": ["1 a 3 puntos concretos"],
 "errores": ["1 a 4 errores u omisiones concretos y por qué restan"],
 "para_subir": ["1 a 3 acciones concretas para mejorar"],
 "esqueleto_modelo": ["3 a 6 puntos que una respuesta sobresaliente cubriría"]
}
Los seis criterios van SIEMPRE en el orden de la rúbrica. Sé conciso para no exceder el espacio. Responde en español, con tono riguroso pero cálido y constructivo.`;

const MODELO_SYS = `Eres un evaluador experto del Preparatorio Único de la Facultad de Jurisprudencia (Universidad del Rosario), con formación de magíster en el área indicada. Redacta una RESPUESTA MODELO sobresaliente al problema jurídico dado. Requisitos: máximo 500 palabras; estructura IRAC (problema, regla, análisis y subsunción, conclusión); derecho colombiano; redacción directa, sin citas ni bibliografía. No inventes jurisprudencia ni números de artículo de los que no estés seguro. Devuelve solo la respuesta modelo, en español, sin encabezados.`;

const PROBLEMA_SYS = `Eres el diseñador de casos del Preparatorio Único (Universidad del Rosario). Redacta UN (1) problema jurídico tipo examen para el área que se te indique: 3 a 6 líneas de hechos verosímiles y una consigna final clara que pida identificar y resolver el problema jurídico. No incluyas la solución, pistas ni la respuesta. Devuelve solo el enunciado, en español.`;

async function callClaude({ system, user }) {
  const res = await fetch("/api/claude", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ system, user }),
  });
  if (!res.ok) throw new Error("proxy " + res.status);
  const data = await res.json();
  return (data.text || "").trim();
}
function parseJSONLoose(s) {
  const clean = s.replace(/```json/gi, "").replace(/```/g, "").trim();
  try { return JSON.parse(clean); } catch {}
  const m = clean.match(/\{[\s\S]*\}/);
  if (m) { try { return JSON.parse(m[0]); } catch {} }
  return null;
}

const DIFFS = [
  { id: "basico", label: "Básico", d: "un único problema jurídico claro, con hechos sencillos" },
  { id: "intermedio", label: "Intermedio", d: "uno o dos problemas entrelazados, con algún matiz" },
  { id: "avanzado", label: "Avanzado", d: "un problema sutil o embebido, con figuras en tensión y posibles distractores que exigen discriminar" },
];

const SIM_SYS = `Eres el diseñador de casos del Preparatorio Único Integrado (Universidad del Rosario). Crea un simulacro fiel al examen real: un caso hipotético con un sujeto/rol asignado y CINCO problemas jurídicos, uno por cada área (Privado, Público, Penal, Laboral y Fundamentos), todos derivados del mismo caso. Hechos verosímiles y concisos, con dificultad de examen.
Devuelve ÚNICAMENTE un objeto JSON válido, sin markdown ni texto extra, con esta forma:
{
 "sujeto": "el rol desde el que la estudiante resolverá (p. ej. apoderada de X)",
 "hechos": "los hechos del caso en 4 a 7 líneas",
 "problemas": [
   {"area": "Privado", "enunciado": "consigna clara del problema de esa área, ligada a los hechos"},
   {"area": "Público", "enunciado": "..."},
   {"area": "Penal", "enunciado": "..."},
   {"area": "Laboral", "enunciado": "..."},
   {"area": "Fundamentos", "enunciado": "..."}
 ]
}
Los cinco problemas van en ese orden de áreas. Sé conciso para no exceder el espacio. No incluyas soluciones. Español.`;

const SIM_FALLBACK = {
  sujeto: "Apoderada de Comercializadora Andina S.A.S.",
  hechos: "Comercializadora Andina S.A.S. contrató con el Distrito el suministro de equipos. Su representante legal, sin autorización de la asamblea, firmó además un contrato con una empresa de su propiedad. Durante la ejecución del contrato estatal sobrevino un alza imprevisible de precios que encareció gravemente las obligaciones de la empresa. Un almacenista se apropió de mercancía decomisada que estaba bajo su custodia. La empresa vinculó a una trabajadora como 'prestadora de servicios' pese a que cumplía horario y órdenes diarias, y la despidió al enterarse de su embarazo. En el litigio, un juez se apartó del precedente aplicable sin justificarlo.",
  problemas: [
    { area: "Privado", enunciado: "Analiza la validez del contrato que el representante legal celebró con su propia empresa sin autorización de la asamblea y las acciones que tiene la sociedad." },
    { area: "Público", enunciado: "Frente al alza imprevisible durante la ejecución del contrato estatal, formula el problema jurídico y la figura aplicable, con sus efectos." },
    { area: "Penal", enunciado: "Califica la conducta del almacenista que se apropió de la mercancía decomisada bajo su custodia y distínguela de figuras afines." },
    { area: "Laboral", enunciado: "Determina la verdadera naturaleza del vínculo de la trabajadora y las consecuencias jurídicas del despido tras conocerse su embarazo." },
    { area: "Fundamentos", enunciado: "Formula el problema jurídico que plantea el juez que se aparta del precedente sin justificación y la carga argumentativa exigible." },
  ],
};

const FLASH_SYS = `Eres tutora de derecho colombiano para el Preparatorio Único (Universidad del Rosario), con nivel de magíster. Genera tarjetas de estudio (flashcards) rigurosas y correctas sobre el área o tema indicado, útiles para el examen. Cada tarjeta: una pregunta breve y una respuesta de 1 a 3 frases, precisa. No inventes jurisprudencia ni números de artículo de los que no estés seguro.
Devuelve ÚNICAMENTE un objeto JSON válido, sin markdown ni texto extra, con esta forma:
{ "tarjetas": [ {"q": "pregunta", "a": "respuesta de 1 a 3 frases"} ] }
Genera entre 6 y 8 tarjetas. Español.`;

const FLASH_FALLBACK = {
  p: [
    { q: "¿Qué exige el art. 1546 del C.C. para la resolución por incumplimiento?", a: "Un contrato bilateral, el incumplimiento de una parte y el cumplimiento o allanamiento a cumplir de la otra; la parte cumplida puede pedir resolución o cumplimiento, con indemnización." },
    { q: "¿Qué significa que 'la mora purga la mora' (art. 1609 C.C.)?", a: "En los contratos bilaterales ninguno está en mora mientras el otro no cumpla o se allane a cumplir; por eso quien tampoco ha cumplido no puede exigir la resolución." },
    { q: "¿En qué consiste la doctrina de los actos propios?", a: "Nadie puede ir válidamente contra sus propios actos anteriores, jurídicamente relevantes y eficaces, que generaron una confianza legítima en la otra parte." },
  ],
  u: [
    { q: "¿Cuáles son los títulos de imputación de la responsabilidad del Estado (art. 90 C.N.)?", a: "Falla del servicio, daño especial y riesgo excepcional; en todos debe existir un daño antijurídico imputable a la acción u omisión de una autoridad." },
    { q: "¿Qué medio de control procede contra un acto administrativo particular que causa un daño?", a: "La nulidad y restablecimiento del derecho, cuando se busca anular el acto y reparar el perjuicio derivado de su ilegalidad." },
    { q: "¿Qué es el silencio administrativo negativo?", a: "El transcurso del término sin respuesta a una petición o recurso se entiende como negativa, lo que habilita al interesado para acudir a la jurisdicción." },
  ],
  pe: [
    { q: "¿Diferencia entre dolo eventual y culpa con representación?", a: "En ambos el autor se representa el resultado; en el dolo eventual lo acepta o le es indiferente, mientras que en la culpa con representación confía en poder evitarlo." },
    { q: "¿Qué protege el tipo de peculado por apropiación?", a: "La administración pública; sanciona al servidor que se apropia de bienes cuya administración o custodia se le confió por razón de sus funciones." },
    { q: "¿Cuándo procede la exclusión de una prueba?", a: "Cuando se obtiene con violación de garantías fundamentales (prueba ilícita) o desconociendo las reglas de su producción (prueba ilegal), conforme a la cláusula de exclusión." },
  ],
  l: [
    { q: "¿Cuáles son los elementos del contrato de trabajo?", a: "Prestación personal del servicio, subordinación y remuneración; reunidos, se presume el contrato de trabajo por la primacía de la realidad." },
    { q: "¿Qué es la estabilidad laboral reforzada por embarazo?", a: "Prohíbe despedir a la trabajadora en embarazo o lactancia sin autorización del inspector; el despido sin ella se presume discriminatorio y es ineficaz, con reintegro e indemnización." },
    { q: "¿Cuál es la jornada máxima vigente y desde cuándo cuenta el recargo nocturno?", a: "La jornada ordinaria se redujo gradualmente a 42 horas y el trabajo nocturno se cuenta desde las 7:00 p. m., conforme a la reforma laboral (Ley 2466 de 2025)." },
  ],
  f: [
    { q: "¿Qué criterios resuelven una antinomia entre normas del mismo rango?", a: "Los criterios cronológico (ley posterior), de especialidad (ley especial) y, cuando aplica, jerárquico; se prefiere el que preserve la coherencia del ordenamiento." },
    { q: "¿Cuándo puede un juez apartarse del precedente?", a: "Solo con una carga argumentativa cualificada: identificando el precedente y exponiendo razones suficientes y transparentes para separarse, respetando la igualdad." },
    { q: "¿Cómo se integra una laguna normativa?", a: "Mediante la analogía, los principios generales del derecho y demás criterios de integración, para resolver el caso no previsto expresamente por la ley." },
  ],
};

/* ================= DOJO ================= */
function Dojo({ award, dojo, setDojo }) {
  const [area, setArea] = useState("p");
  const [pIdx, setPIdx] = useState(0);
  const [inter, setInter] = useState(false);
  const [diff, setDiff] = useState("intermedio");
  const [problem, setProblem] = useState(PRACTICE.p[0]);
  const [text, setText] = useState("");
  const [secs, setSecs] = useState(28 * 60);
  const [running, setRunning] = useState(false);
  const [phase, setPhase] = useState("write"); // write | evaluating | result
  const [result, setResult] = useState(null);
  const [err, setErr] = useState("");
  const [modelo, setModelo] = useState("");
  const [modeloLoading, setModeloLoading] = useState(false);
  const [genLoading, setGenLoading] = useState(false);
  const [manual, setManual] = useState(false);
  const [scores, setScores] = useState(RUBRIC.map(() => 0));
  const [copied, setCopied] = useState(false);
  const [showCopy, setShowCopy] = useState(false);

  useEffect(() => { if (!running) return; const id = setInterval(() => setSecs(s => (s <= 0 ? 0 : s - 1)), 1000); return () => clearInterval(id); }, [running]);
  useEffect(() => { if (secs === 0) setRunning(false); }, [secs]);

  const areaName = AREAS.find(a => a.id === area).name;
  const words = text.trim() ? text.trim().split(/\s+/).length : 0;
  const over = words > 500, wColor = over ? C.roseDeep : words > 450 ? C.rose : C.sage;
  const mm = String(Math.floor(secs / 60)).padStart(2, "0"), ss = String(secs % 60).padStart(2, "0");

  const softReset = () => { setText(""); setSecs(28 * 60); setRunning(false); setPhase("write"); setResult(null); setErr(""); setModelo(""); setManual(false); setScores(RUBRIC.map(() => 0)); setShowCopy(false); setCopied(false); };
  const pickBank = (aid, idx) => { setArea(aid); setPIdx(idx); setInter(false); setProblem(PRACTICE[aid][idx]); softReset(); };
  const nextSame = () => { const idx = (pIdx + 1) % PRACTICE[area].length; pickBank(area, idx); };
  const interleaved = () => { const ids = AREAS.map(a => a.id); const ra = ids[Math.floor(Math.random() * ids.length)]; const idx = Math.floor(Math.random() * PRACTICE[ra].length); setArea(ra); setPIdx(idx); setInter(true); setProblem(PRACTICE[ra][idx]); softReset(); };
  const genProblem = async () => {
    setGenLoading(true); setErr("");
    try { const out = await callClaude({ system: PROBLEMA_SYS, user: "ÁREA: " + areaName + "\nNIVEL: " + (DIFFS.find(d => d.id === diff) || DIFFS[1]).label + " — " + (DIFFS.find(d => d.id === diff) || DIFFS[1]).d + "\nGenera el problema con esa dificultad." }); if (out) { setProblem(out.trim()); softReset(); } }
    catch { setErr("No pude generar un problema nuevo ahora. Sigue con uno del banco."); }
    setGenLoading(false);
  };

  const payload = () => "ÁREA: " + areaName + "\nNIVEL DEL PROBLEMA: " + (DIFFS.find(d => d.id === diff) || DIFFS[1]).label + "\n\nPROBLEMA JURÍDICO:\n" + problem + "\n\nRESPUESTA DE LA ESTUDIANTE (" + words + " palabras):\n" + text;
  const evaluate = async () => {
    if (text.trim().length < 40) { setErr("Escribe tu respuesta (al menos unas líneas) antes de someterla a evaluación."); return; }
    setRunning(false); setErr(""); setModelo(""); setPhase("evaluating");
    try {
      const out = await callClaude({ system: EXAMINER_SYS, user: payload() });
      const parsed = parseJSONLoose(out);
      if (!parsed || !Array.isArray(parsed.criterios)) throw new Error("bad");
      const total = parsed.criterios.reduce((s, c) => s + (Number(c.puntaje) || 0), 0);
      setResult({ ...parsed, total }); setPhase("result");
    } catch { setErr("No pude conectar con la evaluadora en este momento. Puedes reintentar, calificarte con la rúbrica o copiar tu respuesta para pedir feedback en un chat."); setPhase("write"); }
  };
  const genModelo = async () => {
    setModeloLoading(true);
    try { const out = await callClaude({ system: MODELO_SYS, user: "ÁREA: " + areaName + "\n\nPROBLEMA:\n" + problem }); setModelo(out.trim()); }
    catch { setErr("No pude generar la respuesta modelo ahora."); }
    setModeloLoading(false);
  };

  const ptsFor = (t) => 10 + Math.round(t / 18 * 35);
  const saveAndNext = (t) => { award(ptsFor(t)); setDojo(d => ({ count: d.count + 1, last: t, best: Math.max(d.best, t) })); nextSame(); };
  const manualTotal = scores.reduce((a, b) => a + b, 0);
  const saveManual = () => { const p = 10 + Math.round(manualTotal / 18 * 20); award(p); setDojo(d => ({ count: d.count + 1, last: manualTotal, best: Math.max(d.best, manualTotal) })); nextSame(); };

  const claudePrompt = "Actúa como mi tutora de derecho para el Preparatorio Único de la Universidad del Rosario. Evalúa mi respuesta con esta rúbrica (0 a 3 por criterio): identificación del problema, figura/norma, análisis y subsunción, conclusión, claridad y disciplina de forma (máx. 500 palabras, sin citas). Dame nota por criterio, errores concretos y una respuesta modelo de máximo 500 palabras.\n\nPROBLEMA: " + problem + "\n\nMI RESPUESTA (" + words + " palabras):\n" + (text || "(vacío)");
  const doCopy = async () => { try { await navigator.clipboard.writeText(claudePrompt); setCopied(true); setTimeout(() => setCopied(false), 2500); } catch { setShowCopy(true); } };

  const chip = (s) => ({ fontFamily: FM, fontSize: 12.5, fontWeight: 600, minWidth: 34, textAlign: "center", padding: "2px 7px", borderRadius: 7, color: C.white, background: s >= 3 ? C.sage : s === 2 ? C.rose : C.roseDeep });

  return (
    <div style={{ display: "grid", gap: 16 }}>
      <Card>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", flexWrap: "wrap", gap: 8 }}>
          <div>
            <Eyebrow>Sala de evaluación · Dojo 500</Eyebrow>
            <div style={{ fontFamily: FD, fontSize: 20 }}>Aquí te pones a prueba de verdad</div>
            <div style={{ fontSize: 12.5, color: C.mut, marginTop: 3, display: "flex", alignItems: "center", gap: 5 }}><Sparkles size={13} color={C.rose} /> Evaluación rigurosa con criterio del examen real y feedback fundamentado.</div>
          </div>
          <div style={{ display: "flex", gap: 6, flexWrap: "wrap", justifyContent: "flex-end" }}>
            {AREAS.map(a => { const on = area === a.id && !inter; return <button key={a.id} onClick={() => pickBank(a.id, 0)} style={{ fontFamily: FB, fontSize: 12.5, padding: "5px 10px", borderRadius: 99, cursor: "pointer", border: "1px solid " + (on ? C.pinkStrong : C.line), background: on ? C.pinkStrong : "transparent", color: on ? C.white : C.mut }}>{a.name}</button>; })}
            <button onClick={interleaved} style={{ fontFamily: FB, fontSize: 12.5, padding: "5px 10px", borderRadius: 99, cursor: "pointer", border: "1px solid " + (inter ? C.pinkStrong : C.line), background: inter ? C.pinkStrong : "transparent", color: inter ? C.white : C.rose, display: "inline-flex", alignItems: "center", gap: 4 }}><Shuffle size={12} /> Intercalado</button>
          </div>
        </div>
        <div style={{ marginTop: 14, background: C.tint, border: "1px dashed " + C.pinkStrong, borderRadius: 12, padding: "13px 15px" }}>
          <div style={{ display: "flex", gap: 6, flexWrap: "wrap", marginBottom: 10, alignItems: "center" }}>
            <span style={{ fontFamily: FM, fontSize: 10, letterSpacing: "0.12em", textTransform: "uppercase", color: C.mut, marginRight: 2 }}>Nivel</span>
            {DIFFS.map(d => { const on = diff === d.id; return <button key={d.id} onClick={() => setDiff(d.id)} title={d.d} style={{ fontFamily: FB, fontSize: 11.5, padding: "4px 11px", borderRadius: 99, cursor: "pointer", border: "1px solid " + (on ? C.pinkStrong : C.line), background: on ? C.pinkStrong : "transparent", color: on ? C.white : C.mut }}>{d.label}</button>; })}
            <span style={{ fontSize: 10.5, color: C.mut }}>· aplica al generar con IA</span>
          </div>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: 8, marginBottom: 5, flexWrap: "wrap" }}>
            <div style={{ fontFamily: FM, fontSize: 10, letterSpacing: "0.16em", textTransform: "uppercase", color: C.rose }}>Problema jurídico · {inter ? "intercalado" : areaName}</div>
            <button onClick={genProblem} disabled={genLoading} style={{ fontFamily: FB, fontSize: 11.5, padding: "4px 10px", borderRadius: 99, cursor: genLoading ? "wait" : "pointer", border: "1px solid " + C.pink, background: C.white, color: C.rose, display: "inline-flex", alignItems: "center", gap: 4 }}><Sparkles size={11} /> {genLoading ? "Generando…" : "Problema nuevo con IA"}</button>
          </div>
          <div style={{ fontSize: 14.5, lineHeight: 1.5 }}>{problem}</div>
        </div>
      </Card>

      {phase === "write" && (
        <Card>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 10, flexWrap: "wrap", gap: 10 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <Timer size={18} color={C.rose} />
              <span style={{ fontFamily: FM, fontSize: 24, fontWeight: 600, color: secs < 120 ? C.roseDeep : C.plum }}>{mm}:{ss}</span>
              <button onClick={() => setRunning(r => !r)} style={iconBtn}>{running ? <Pause size={15} color={C.plum} /> : <Play size={15} color={C.plum} />}</button>
              <button onClick={() => { setSecs(28 * 60); setRunning(false); }} style={iconBtn}><RotateCcw size={14} color={C.plum} /></button>
            </div>
            <div style={{ textAlign: "right" }}>
              <span style={{ fontFamily: FM, fontSize: 22, fontWeight: 600, color: wColor }}>{words}</span><span style={{ fontFamily: FM, fontSize: 13, color: C.mut }}> / 500</span>
              <div style={{ fontSize: 11, color: over ? C.roseDeep : C.mut }}>{over ? "te pasaste — lo que exceda no se evalúa" : "palabras"}</div>
            </div>
          </div>
          <textarea value={text} onChange={e => setText(e.target.value)} placeholder="IRAC: Problema → Regla → Análisis (subsunción) → Conclusión. Frases directas, sin citas." style={{ width: "100%", minHeight: 240, resize: "vertical", padding: 14, borderRadius: 12, border: "1px solid " + C.line, background: C.white, fontFamily: FB, fontSize: 14.5, lineHeight: 1.6, color: C.plum, boxSizing: "border-box" }} />

          {err && <div style={{ marginTop: 12, padding: "10px 13px", borderRadius: 10, background: C.tint2, border: "1px solid " + C.pink, fontSize: 13, color: C.roseDeep, lineHeight: 1.45 }}>{err}</div>}

          <div style={{ display: "flex", gap: 10, marginTop: 12, flexWrap: "wrap" }}>
            <button onClick={evaluate} style={btnPrimary}><Sparkles size={15} /> Someter a evaluación</button>
            <button onClick={nextSame} style={btnGhost}>Otro problema</button>
          </div>
          <div style={{ display: "flex", gap: 16, marginTop: 12, flexWrap: "wrap" }}>
            <button onClick={() => setManual(m => !m)} style={linkBtn}>{manual ? "Ocultar rúbrica manual" : "Calificación manual (sin conexión)"}</button>
            <button onClick={doCopy} style={linkBtn}>{copied ? "¡Copiado!" : "Copiar para pedir feedback en un chat"}</button>
          </div>
          {showCopy && <div style={{ marginTop: 10 }}><textarea readOnly value={claudePrompt} onFocus={e => e.target.select()} style={{ width: "100%", minHeight: 110, padding: 12, borderRadius: 10, border: "1px solid " + C.line, background: C.tint, fontFamily: FM, fontSize: 12, color: C.plum, boxSizing: "border-box" }} /></div>}

          {manual && (
            <div style={{ marginTop: 16, paddingTop: 14, borderTop: "1px solid " + C.line }}>
              <Eyebrow>Rúbrica manual · 0 a 3</Eyebrow>
              <div style={{ display: "grid", gap: 12, marginTop: 6 }}>
                {RUBRIC.map((r, i) => (
                  <div key={i}>
                    <div style={{ display: "flex", justifyContent: "space-between", fontSize: 13.5, marginBottom: 3 }}><span>{r}</span><span style={{ fontFamily: FM, color: C.rose, fontWeight: 600 }}>{scores[i]}</span></div>
                    <input type="range" min={0} max={3} step={1} value={scores[i]} onChange={e => setScores(s => s.map((v, idx) => idx === i ? Number(e.target.value) : v))} style={{ width: "100%" }} />
                  </div>
                ))}
              </div>
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginTop: 12, flexWrap: "wrap", gap: 8 }}>
                <div style={{ fontFamily: FM, fontSize: 15, color: manualTotal >= 14 ? C.sage : manualTotal >= 11 ? C.rose : C.roseDeep }}>{manualTotal}/18 <span style={{ fontSize: 12, color: C.rose }}>· +{10 + Math.round(manualTotal / 18 * 20)} pts</span></div>
                <button onClick={saveManual} style={btnPrimary}>Guardar y seguir</button>
              </div>
            </div>
          )}
        </Card>
      )}

      {phase === "evaluating" && (
        <Card style={{ textAlign: "center", padding: "34px 20px" }}>
          <Sparkles size={26} color={C.rose} style={{ animation: "breathe 2.2s ease-in-out infinite" }} />
          <div style={{ fontFamily: FD, fontSize: 19, marginTop: 12 }}>La evaluadora está leyendo tu respuesta…</div>
          <div style={{ fontSize: 13, color: C.mut, marginTop: 4 }}>Aplicando la rúbrica del examen, criterio por criterio.</div>
          <div style={{ height: 4, background: "#F1DEE8", borderRadius: 99, overflow: "hidden", maxWidth: 240, margin: "16px auto 0" }}><div style={{ height: "100%", width: "40%", background: C.pinkStrong, animation: "slide 1.4s ease-in-out infinite" }} /></div>
        </Card>
      )}

      {phase === "result" && result && (
        <>
          <Card>
            <div style={{ display: "flex", alignItems: "center", gap: 16, flexWrap: "wrap" }}>
              <div style={{ position: "relative", width: 104, height: 104, flexShrink: 0 }}>
                <Ring pct={Math.round(result.total / 18 * 100)} size={104} stroke={9} color={result.total >= 14 ? C.sage : result.total >= 11 ? C.rose : C.roseDeep} track="#F6E1EA" />
                <div style={{ position: "absolute", inset: 0, display: "grid", placeItems: "center", textAlign: "center" }}><div><div style={{ fontFamily: FM, fontSize: 24, fontWeight: 600, color: C.plum }}>{result.total}</div><div style={{ fontSize: 10, color: C.mut }}>de 18</div></div></div>
              </div>
              <div style={{ flex: 1, minWidth: 200 }}>
                <div style={{ display: "inline-block", fontFamily: FB, fontSize: 12, fontWeight: 600, padding: "3px 11px", borderRadius: 99, color: C.white, background: result.total >= 11 ? C.sage : C.roseDeep }}>{result.total >= 11 ? "Aprobado" : "Aún no aprueba"}</div>
                <div style={{ fontSize: 13.5, color: C.plum, marginTop: 8, lineHeight: 1.5 }}><b>El problema evaluado:</b> {result.problema_correcto}</div>
                <div style={{ fontFamily: FM, fontSize: 12, color: C.rose, marginTop: 6 }}>ganarás +{ptsFor(result.total)} pts</div>
              </div>
            </div>
          </Card>

          <Card>
            <Eyebrow>Calificación por criterio</Eyebrow>
            <div style={{ display: "grid", gap: 11 }}>
              {RUBRIC.map((r, i) => { const c = (result.criterios && result.criterios[i]) || { puntaje: 0, comentario: "" }; return (
                <div key={i} style={{ display: "flex", gap: 11, alignItems: "flex-start" }}>
                  <span style={chip(Number(c.puntaje) || 0)}>{Number(c.puntaje) || 0}</span>
                  <div><div style={{ fontSize: 13.7, fontWeight: 600 }}>{r}</div><div style={{ fontSize: 13, color: C.mut, lineHeight: 1.45 }}>{c.comentario}</div></div>
                </div>
              ); })}
            </div>
          </Card>

          <div style={{ display: "grid", gap: 12, gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))" }}>
            {Array.isArray(result.fortalezas) && result.fortalezas.length > 0 && (
              <Card pad={16}><Eyebrow>Lo que hiciste bien</Eyebrow><div style={{ display: "grid", gap: 7 }}>{result.fortalezas.map((f, i) => <div key={i} style={{ display: "flex", gap: 8, fontSize: 13.3, lineHeight: 1.45 }}><CheckCircle2 size={16} color={C.sage} style={{ flexShrink: 0, marginTop: 1 }} /><span>{f}</span></div>)}</div></Card>
            )}
            {Array.isArray(result.errores) && result.errores.length > 0 && (
              <Card pad={16}><Eyebrow>Errores y omisiones</Eyebrow><div style={{ display: "grid", gap: 7 }}>{result.errores.map((f, i) => <div key={i} style={{ display: "flex", gap: 8, fontSize: 13.3, lineHeight: 1.45 }}><Info size={16} color={C.roseDeep} style={{ flexShrink: 0, marginTop: 1 }} /><span>{f}</span></div>)}</div></Card>
            )}
          </div>

          {Array.isArray(result.para_subir) && result.para_subir.length > 0 && (
            <Card style={{ background: C.tint, borderColor: C.pink }}><Eyebrow>Cómo subir de nivel</Eyebrow><div style={{ display: "grid", gap: 7 }}>{result.para_subir.map((f, i) => <div key={i} style={{ display: "flex", gap: 8, fontSize: 13.7, lineHeight: 1.45 }}><Target size={16} color={C.rose} style={{ flexShrink: 0, marginTop: 1 }} /><span>{f}</span></div>)}</div></Card>
          )}

          <Card>
            <Eyebrow>Respuesta modelo</Eyebrow>
            {Array.isArray(result.esqueleto_modelo) && result.esqueleto_modelo.length > 0 && (
              <div style={{ display: "grid", gap: 6, marginBottom: 12 }}>{result.esqueleto_modelo.map((f, i) => <div key={i} style={{ display: "flex", gap: 8, fontSize: 13.3, lineHeight: 1.45, color: C.plum }}><span style={{ fontFamily: FM, color: C.rose, fontSize: 12 }}>{String(i + 1).padStart(2, "0")}</span><span>{f}</span></div>)}</div>
            )}
            {!modelo && <button onClick={genModelo} disabled={modeloLoading} style={btnGhost}>{modeloLoading ? "Redactando…" : "Ver respuesta modelo redactada (≤500)"}</button>}
            {modelo && <div style={{ whiteSpace: "pre-wrap", fontSize: 13.7, lineHeight: 1.6, color: C.plum, background: C.tint, border: "1px solid " + C.line, borderRadius: 12, padding: 14 }}>{modelo}</div>}
          </Card>

          <div style={{ fontSize: 11.5, color: C.mut, textAlign: "center", lineHeight: 1.5 }}>Evaluación orientadora para entrenarte; la nota oficial la pone el tribunal.</div>

          <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
            <button onClick={() => saveAndNext(result.total)} style={btnPrimary}>Guardar y siguiente</button>
            <button onClick={() => { setText(""); setSecs(28 * 60); setRunning(false); setPhase("write"); setResult(null); setModelo(""); setErr(""); }} style={btnGhost}>Reintentar este problema</button>
            <button onClick={nextSame} style={btnGhost}>Nuevo problema</button>
          </div>
        </>
      )}
    </div>
  );
}

/* ================= PREMIOS ================= */
function Premios({ game, redeem, rank, nextRank }) {
  const tiers = ["Caprichos", "Antojos", "Grandes metas"];
  const toNext = nextRank ? Math.round(((game.xp - rank.xp) / (nextRank.xp - rank.xp)) * 100) : 100;
  return (
    <div style={{ display: "grid", gap: 16 }}>
      <Card style={{ background: C.tint, borderColor: C.pink, display: "flex", alignItems: "center", gap: 16, flexWrap: "wrap" }}>
        <div style={{ position: "relative", width: 96, height: 96, flexShrink: 0 }}>
          <Ring pct={toNext} size={96} stroke={9} color={C.pinkStrong} track="#F6E1EA" />
          <div style={{ position: "absolute", inset: 0, display: "grid", placeItems: "center", textAlign: "center" }}><div><div style={{ fontFamily: FM, fontSize: 20, fontWeight: 600, color: C.rose }}>{game.pts}</div><div style={{ fontSize: 9.5, color: C.mut }}>pts</div></div></div>
        </div>
        <div style={{ flex: 1, minWidth: 200 }}>
          <div style={{ fontFamily: FD, fontSize: 22 }}>{rank.name}</div>
          <div style={{ fontSize: 13, color: C.mut, marginTop: 2 }}>{nextRank ? `${game.xp} XP · te faltan ${nextRank.xp - game.xp} para ${nextRank.name}` : "Nivel máximo alcanzado ✦"}</div>
          <div style={{ fontSize: 12.5, color: C.plum, marginTop: 8, lineHeight: 1.5 }}>Los puntos se ganan estudiando y se gastan aquí. Emparejar el estudio con algo que amas es una estrategia probada (<i>temptation bundling</i>) para sostener la constancia.</div>
        </div>
      </Card>

      {tiers.map(tier => (
        <div key={tier}>
          <Eyebrow>{tier}</Eyebrow>
          <div style={{ display: "grid", gap: 10 }}>
            {REWARDS.filter(r => r.tier === tier).map(r => {
              const can = game.pts >= r.cost, pct = Math.min(100, Math.round(game.pts / r.cost * 100));
              return (
                <Card key={r.name} pad={15} style={{ display: "flex", alignItems: "center", gap: 14, flexWrap: "wrap" }}>
                  <Gift size={20} color={can ? C.rose : "#D9C3CE"} style={{ flexShrink: 0 }} />
                  <div style={{ flex: 1, minWidth: 170 }}>
                    <div style={{ fontSize: 14.5, fontWeight: 600 }}>{r.name}</div>
                    <div style={{ height: 6, background: "#F1DEE8", borderRadius: 99, overflow: "hidden", marginTop: 6 }}><div style={{ width: `${pct}%`, height: "100%", background: can ? C.sage : C.pinkStrong, transition: "width .4s" }} /></div>
                  </div>
                  <div style={{ textAlign: "right", minWidth: 74 }}>
                    <div style={{ fontFamily: FM, fontSize: 13.5, color: C.rose, fontWeight: 600 }}>{r.cost}</div>
                    <button onClick={() => redeem(r)} disabled={!can} style={{ marginTop: 4, fontFamily: FB, fontSize: 12.5, fontWeight: 600, padding: "6px 12px", borderRadius: 8, border: "none", cursor: can ? "pointer" : "not-allowed", background: can ? C.pinkStrong : "#EBD8E1", color: can ? C.white : C.mut }}>Canjear</button>
                  </div>
                </Card>
              );
            })}
          </div>
        </div>
      ))}

      {game.claimed.length > 0 && (
        <Card>
          <Eyebrow>Premios ganados · {game.claimed.length}</Eyebrow>
          <div style={{ display: "grid", gap: 6 }}>
            {game.claimed.slice(0, 8).map((c, i) => (
              <div key={i} style={{ display: "flex", alignItems: "center", gap: 8, fontSize: 13.5 }}>
                <Star size={14} color={C.rose} fill={C.pink} style={{ flexShrink: 0 }} />
                <span style={{ flex: 1 }}>{c.name}</span>
                <span style={{ fontFamily: FM, fontSize: 11.5, color: C.mut }}>{c.date}</span>
              </div>
            ))}
          </div>
        </Card>
      )}
    </div>
  );
}

/* ================= MÉTODOS ================= */
function Metodos() {
  return (
    <div style={{ display: "grid", gap: 12 }}>
      <Card><Eyebrow>Cómo estudiar (con evidencia)</Eyebrow><div style={{ fontFamily: FD, fontSize: 19, marginBottom: 3 }}>No estudies más horas. Estudia como funciona el cerebro.</div><div style={{ fontSize: 13.5, color: C.mut, lineHeight: 1.5 }}>Cada herramienta de esta app se apoya en uno de estos métodos. Aquí el porqué, en corto.</div></Card>
      <div style={{ display: "grid", gap: 10, gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))" }}>
        {METHODS.map((m, i) => (
          <Card key={i} pad={16}>
            <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 6 }}><Brain size={16} color={C.rose} /><div style={{ fontFamily: FD, fontSize: 16.5 }}>{m.t}</div></div>
            <div style={{ fontSize: 13.5, lineHeight: 1.45, marginBottom: 6 }}>{m.h}</div>
            <div style={{ fontSize: 12, color: C.rose, lineHeight: 1.4 }}>{m.e}</div>
          </Card>
        ))}
      </div>
      <Card style={{ background: C.tint, borderColor: C.pink }}>
        <div style={{ display: "flex", gap: 12 }}><Info size={18} color={C.rose} style={{ flexShrink: 0, marginTop: 2 }} /><div style={{ fontSize: 13.5, lineHeight: 1.55 }}>Tu MacBook puede volverse tu aliado: crea un <b>Modo Concentración “Estudio”</b>, limita Instagram y TikTok con <b>Tiempo de Uso</b>, y automatiza todo con un atajo de <b>Atajos</b> que active el foco y abra tus materiales de un clic. (Tu novio te dejó los pasos en el chat.)</div></div>
      </Card>
    </div>
  );
}

/* ================= SIMULACRO ================= */
function Simulacro({ award }) {
  const [stage, setStage] = useState("intro"); // intro | case | write | evaluating | done
  const [loading, setLoading] = useState(false);
  const [sim, setSim] = useState(null);
  const [idx, setIdx] = useState(0);
  const [answers, setAnswers] = useState([]); // {result}
  const [text, setText] = useState("");
  const [secs, setSecs] = useState(25 * 60);
  const [running, setRunning] = useState(false);
  const [err, setErr] = useState("");

  useEffect(() => { if (!running) return; const id = setInterval(() => setSecs(s => (s <= 0 ? 0 : s - 1)), 1000); return () => clearInterval(id); }, [running]);
  useEffect(() => { if (secs === 0) setRunning(false); }, [secs]);

  const words = text.trim() ? text.trim().split(/\s+/).length : 0;
  const over = words > 500, wColor = over ? C.roseDeep : words > 450 ? C.rose : C.sage;
  const mm = String(Math.floor(secs / 60)).padStart(2, "0"), ss = String(secs % 60).padStart(2, "0");
  const ptsFor = (t) => 10 + Math.round(t / 18 * 35);

  const generate = async () => {
    setLoading(true); setErr("");
    let data = null;
    try { const out = await callClaude({ system: SIM_SYS, user: "Genera el simulacro." }); const p = parseJSONLoose(out); if (p && Array.isArray(p.problemas) && p.problemas.length === 5) data = p; } catch {}
    if (!data) { data = SIM_FALLBACK; setErr("Generé un caso de reserva (sin conexión con el diseñador de casos)."); }
    setSim(data); setAnswers([]); setIdx(0); setStage("case"); setLoading(false);
  };
  const begin = () => { setText(""); setSecs(25 * 60); setRunning(true); setStage("write"); };
  const submit = async () => {
    if (text.trim().length < 40) { setErr("Escribe tu respuesta antes de continuar."); return; }
    setErr(""); setRunning(false); setStage("evaluating");
    const prob = sim.problemas[idx];
    let result = null;
    try {
      const out = await callClaude({ system: EXAMINER_SYS, user: "ÁREA: " + prob.area + "\n\nPROBLEMA JURÍDICO:\n" + prob.enunciado + "\n\nRESPUESTA DE LA ESTUDIANTE (" + words + " palabras):\n" + text });
      const parsed = parseJSONLoose(out);
      if (parsed && Array.isArray(parsed.criterios)) { const total = parsed.criterios.reduce((s, c) => s + (Number(c.puntaje) || 0), 0); result = { ...parsed, total, area: prob.area }; }
    } catch {}
    if (!result) result = { total: 0, area: prob.area, sinEvaluar: true };
    award(ptsFor(result.total));
    const na = [...answers, result];
    setAnswers(na);
    if (idx < 4) { setIdx(idx + 1); setText(""); setSecs(25 * 60); setRunning(true); setStage("write"); }
    else { award(50); setStage("done"); }
  };

  if (stage === "intro") return (
    <div style={{ display: "grid", gap: 16 }}>
      <Card>
        <Eyebrow>Simulacro · nivel examen</Eyebrow>
        <div style={{ fontFamily: FD, fontSize: 21, marginBottom: 4 }}>El ensayo general del Preparatorio</div>
        <div style={{ fontSize: 14, color: C.mut, lineHeight: 1.55 }}>Recibes un caso con un <b>sujeto</b> asignado y <b>5 problemas</b>, uno por cada área, todos del mismo caso. Los resuelves bajo reloj, máximo 500 palabras cada uno, y cada respuesta se somete a evaluación rigurosa. Al final ves tu desempeño global, como en la prueba real.</div>
        <div style={{ display: "flex", gap: 8, marginTop: 14, flexWrap: "wrap" }}>
          {AREAS.map(a => { const A = a.icon; return <span key={a.id} style={{ display: "inline-flex", alignItems: "center", gap: 5, fontSize: 12.5, color: C.rose, background: C.tint, border: "1px solid " + C.line, borderRadius: 99, padding: "5px 11px" }}><A size={13} /> {a.name}</span>; })}
        </div>
        <button onClick={generate} disabled={loading} style={{ ...btnPrimary, marginTop: 16, justifyContent: "center", width: "100%", padding: "13px", cursor: loading ? "wait" : "pointer" }}>{loading ? "Preparando el caso…" : "Generar simulacro"}</button>
        <div style={{ fontSize: 11.5, color: C.mut, textAlign: "center", marginTop: 10 }}>Tiempo por problema: 25 min (versión de práctica). Ganas puntos por cada problema y un bono al terminar.</div>
      </Card>
    </div>
  );

  if (stage === "case" && sim) return (
    <div style={{ display: "grid", gap: 16 }}>
      <Card>
        <Eyebrow>Tu caso</Eyebrow>
        <div style={{ background: C.tint, border: "1px solid " + C.pink, borderRadius: 12, padding: "12px 14px", marginBottom: 12 }}>
          <div style={{ fontFamily: FM, fontSize: 10.5, letterSpacing: "0.14em", textTransform: "uppercase", color: C.rose, marginBottom: 4 }}>Sujeto asignado</div>
          <div style={{ fontSize: 15, fontWeight: 600 }}>{sim.sujeto}</div>
        </div>
        <div style={{ fontSize: 14.5, lineHeight: 1.6 }}>{sim.hechos}</div>
      </Card>
      <Card>
        <Eyebrow>Los 5 problemas de tu sujeto</Eyebrow>
        <div style={{ display: "grid", gap: 8 }}>
          {sim.problemas.map((p, i) => (
            <div key={i} style={{ display: "flex", gap: 10, alignItems: "flex-start" }}>
              <span style={{ fontFamily: FM, fontSize: 12, color: C.rose, marginTop: 2 }}>{String(i + 1).padStart(2, "0")}</span>
              <div><span style={{ fontSize: 12, fontWeight: 600, color: C.rose }}>{p.area}. </span><span style={{ fontSize: 13.7, lineHeight: 1.45 }}>{p.enunciado}</span></div>
            </div>
          ))}
        </div>
      </Card>
      {err && <div style={{ fontSize: 12.5, color: C.mut, textAlign: "center" }}>{err}</div>}
      <button onClick={begin} style={{ ...btnPrimary, justifyContent: "center", padding: "13px" }}>Comenzar · Problema 1 de 5</button>
    </div>
  );

  if (stage === "write" && sim) { const prob = sim.problemas[idx]; return (
    <div style={{ display: "grid", gap: 16 }}>
      <Card>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 8 }}>
          <div><Eyebrow>Simulacro · problema {idx + 1} de 5</Eyebrow><div style={{ fontFamily: FD, fontSize: 18 }}>{prob.area}</div></div>
          <div style={{ display: "flex", gap: 5 }}>{sim.problemas.map((_, i) => <div key={i} style={{ width: 22, height: 5, borderRadius: 99, background: i < idx ? C.sage : i === idx ? C.pinkStrong : "#F1DEE8" }} />)}</div>
        </div>
        <div style={{ marginTop: 12, background: C.tint, border: "1px dashed " + C.pinkStrong, borderRadius: 12, padding: "12px 14px", fontSize: 14.5, lineHeight: 1.5 }}>{prob.enunciado}</div>
      </Card>
      <Card>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 10, flexWrap: "wrap", gap: 10 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <Timer size={18} color={C.rose} />
            <span style={{ fontFamily: FM, fontSize: 24, fontWeight: 600, color: secs < 120 ? C.roseDeep : C.plum }}>{mm}:{ss}</span>
            <button onClick={() => setRunning(r => !r)} style={iconBtn}>{running ? <Pause size={15} color={C.plum} /> : <Play size={15} color={C.plum} />}</button>
          </div>
          <div style={{ textAlign: "right" }}><span style={{ fontFamily: FM, fontSize: 22, fontWeight: 600, color: wColor }}>{words}</span><span style={{ fontFamily: FM, fontSize: 13, color: C.mut }}> / 500</span></div>
        </div>
        <textarea value={text} onChange={e => setText(e.target.value)} placeholder="IRAC: Problema → Regla → Análisis → Conclusión. Sin citas." style={{ width: "100%", minHeight: 220, resize: "vertical", padding: 14, borderRadius: 12, border: "1px solid " + C.line, background: C.white, fontFamily: FB, fontSize: 14.5, lineHeight: 1.6, color: C.plum, boxSizing: "border-box" }} />
        {err && <div style={{ marginTop: 10, fontSize: 13, color: C.roseDeep }}>{err}</div>}
        <button onClick={submit} style={{ ...btnPrimary, marginTop: 12 }}>{idx < 4 ? "Someter y pasar al siguiente" : "Someter y ver resultado"}</button>
      </Card>
    </div>
  ); }

  if (stage === "evaluating") return (
    <Card style={{ textAlign: "center", padding: "34px 20px" }}>
      <Sparkles size={26} color={C.rose} style={{ animation: "breathe 2.2s ease-in-out infinite" }} />
      <div style={{ fontFamily: FD, fontSize: 19, marginTop: 12 }}>Evaluando tu problema {idx + 1}…</div>
      <div style={{ height: 4, background: "#F1DEE8", borderRadius: 99, overflow: "hidden", maxWidth: 240, margin: "16px auto 0" }}><div style={{ height: "100%", width: "40%", background: C.pinkStrong, animation: "slide 1.4s ease-in-out infinite" }} /></div>
    </Card>
  );

  // done
  const total = answers.reduce((s, a) => s + (a.total || 0), 0);
  const max = answers.length * 18;
  const pct = max ? Math.round(total / max * 100) : 0;
  const passed = pct >= 60;
  return (
    <div style={{ display: "grid", gap: 16 }}>
      <Card style={{ display: "flex", alignItems: "center", gap: 18, flexWrap: "wrap" }}>
        <div style={{ position: "relative", width: 116, height: 116, flexShrink: 0 }}>
          <Ring pct={pct} size={116} stroke={10} color={passed ? C.sage : C.roseDeep} track="#F6E1EA" />
          <div style={{ position: "absolute", inset: 0, display: "grid", placeItems: "center", textAlign: "center" }}><div><div style={{ fontFamily: FM, fontSize: 26, fontWeight: 600, color: C.plum }}>{pct}%</div><div style={{ fontSize: 10, color: C.mut }}>{total}/{max}</div></div></div>
        </div>
        <div style={{ flex: 1, minWidth: 200 }}>
          <Eyebrow>Simulacro completo</Eyebrow>
          <div style={{ display: "inline-block", fontFamily: FB, fontSize: 12.5, fontWeight: 600, padding: "3px 12px", borderRadius: 99, color: C.white, background: passed ? C.sage : C.roseDeep }}>{passed ? "Aprobarías el escrito" : "Aún por debajo del 60%"}</div>
          <div style={{ fontSize: 13.5, color: C.plum, marginTop: 8, lineHeight: 1.5 }}>Recuerda: en el examen real las 5 áreas suman a una sola nota. Tu piso más bajo es lo que primero hay que subir.</div>
        </div>
      </Card>
      <Card>
        <Eyebrow>Desempeño por área</Eyebrow>
        <div style={{ display: "grid", gap: 9 }}>
          {answers.map((a, i) => (
            <div key={i} style={{ display: "flex", alignItems: "center", gap: 10 }}>
              <div style={{ width: 92, fontSize: 13.5, fontWeight: 500 }}>{a.area}</div>
              <div style={{ flex: 1, height: 8, background: "#F1DEE8", borderRadius: 99, overflow: "hidden" }}><div style={{ width: `${Math.round((a.total || 0) / 18 * 100)}%`, height: "100%", background: (a.total || 0) >= 11 ? C.sage : C.pinkStrong }} /></div>
              <div style={{ fontFamily: FM, fontSize: 12.5, width: 44, textAlign: "right", color: (a.total || 0) >= 11 ? C.sage : C.rose, fontWeight: 600 }}>{a.total || 0}/18</div>
            </div>
          ))}
        </div>
        <div style={{ fontSize: 11.5, color: C.mut, marginTop: 12, textAlign: "center" }}>Evaluación orientadora para entrenarte; la nota oficial la pone el tribunal.</div>
      </Card>
      <button onClick={() => { setStage("intro"); setSim(null); setAnswers([]); setIdx(0); }} style={{ ...btnPrimary, justifyContent: "center" }}>Nuevo simulacro</button>
    </div>
  );
}

/* ================= GRUPO · FLASHCARDS ================= */
function Flashcards({ award }) {
  const [mode, setMode] = useState("setup"); // setup | study
  const [area, setArea] = useState("p");
  const [loading, setLoading] = useState(false);
  const [deck, setDeck] = useState([]);
  const [i, setI] = useState(0);
  const [flipped, setFlipped] = useState(false);
  const [correct, setCorrect] = useState(0);
  const [done, setDone] = useState(false);
  const [err, setErr] = useState("");
  const [copied, setCopied] = useState(false);
  const [showShare, setShowShare] = useState(false);
  const [studySecs, setStudySecs] = useState(0);
  const [milestones, setMilestones] = useState({ m10: false, m20: false, m30: false });

  useEffect(() => {
    if (mode !== "study") return;
    const id = setInterval(() => setStudySecs(s => s + 1), 1000);
    return () => clearInterval(id);
  }, [mode]);
  useEffect(() => {
    if (studySecs >= 600 && !milestones.m10) { award(15); setMilestones(m => ({ ...m, m10: true })); }
    if (studySecs >= 1200 && !milestones.m20) { award(15); setMilestones(m => ({ ...m, m20: true })); }
    if (studySecs >= 1800 && !milestones.m30) { award(20); setMilestones(m => ({ ...m, m30: true })); }
  }, [studySecs]); // eslint-disable-line

  const areaName = AREAS.find(a => a.id === area).name;
  const generate = async () => {
    setLoading(true); setErr("");
    let cards = null;
    try { const out = await callClaude({ system: FLASH_SYS, user: "ÁREA/TEMA: " + areaName }); const p = parseJSONLoose(out); if (p && Array.isArray(p.tarjetas) && p.tarjetas.length) cards = p.tarjetas; } catch {}
    if (!cards) { cards = FLASH_FALLBACK[area]; setErr("Usé un mazo base (sin conexión con la IA)."); }
    setDeck(cards); setI(0); setFlipped(false); setCorrect(0); setDone(false); setMode("study"); setLoading(false);
  };
  const rate = (knew) => {
    if (knew) { setCorrect(c => c + 1); award(4); }
    if (i < deck.length - 1) { setI(i + 1); setFlipped(false); } else { setDone(true); }
  };
  const shareText = "Reto de estudio — " + areaName + " (Preparatorio):\n\n" + deck.map((c, n) => (n + 1) + ". " + c.q).join("\n") + "\n\n¡A ver cuántas sabes! 💪";
  const doShare = async () => { try { await navigator.clipboard.writeText(shareText); setCopied(true); setTimeout(() => setCopied(false), 2500); } catch { setShowShare(true); } };

  if (mode === "setup") return (
    <div style={{ display: "grid", gap: 16 }}>
      <Card>
        <Eyebrow>Estudio en grupo · Flashcards</Eyebrow>
        <div style={{ fontFamily: FD, fontSize: 20, marginBottom: 4 }}>Estudiar acompañada pesa menos</div>
        <div style={{ fontSize: 14, color: C.mut, lineHeight: 1.55 }}>Genera un mazo de tarjetas con IA sobre el área que quieras, ponte a prueba, y comparte el reto con tus amigas para que se pregunten entre todas.</div>
        <div style={{ marginTop: 14 }}>
          <div style={{ fontSize: 12.5, color: C.mut, marginBottom: 7 }}>Elige el área</div>
          <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>{AREAS.map(a => { const on = area === a.id; return <button key={a.id} onClick={() => setArea(a.id)} style={{ fontFamily: FB, fontSize: 12.5, padding: "6px 12px", borderRadius: 99, cursor: "pointer", border: "1px solid " + (on ? C.pinkStrong : C.line), background: on ? C.pinkStrong : "transparent", color: on ? C.white : C.mut }}>{a.name}</button>; })}</div>
        </div>
        <button onClick={generate} disabled={loading} style={{ ...btnPrimary, marginTop: 16, justifyContent: "center", width: "100%", padding: "12px", cursor: loading ? "wait" : "pointer" }}><Sparkles size={15} /> {loading ? "Generando mazo…" : "Generar mazo con IA"}</button>
      </Card>
      <Card style={{ background: C.tint, borderColor: C.pink }}>
        <div style={{ display: "flex", gap: 12 }}><Info size={18} color={C.rose} style={{ flexShrink: 0, marginTop: 2 }} /><div style={{ fontSize: 13, lineHeight: 1.55 }}><b>Sala en vivo con amigas:</b> las salas compartidas en tiempo real (invitar y jugar juntas al mismo tiempo) llegan con la versión instalada de la app. Por ahora puedes generar un mazo y <b>compartir el reto</b> por WhatsApp para que todas se pregunten con las mismas tarjetas.</div></div>
      </Card>
    </div>
  );

  const card = deck[i];
  if (done) return (
    <div style={{ display: "grid", gap: 16 }}>
      <Card style={{ textAlign: "center" }}>
        <Eyebrow>Mazo terminado</Eyebrow>
        <div style={{ fontFamily: FM, fontSize: 40, fontWeight: 600, color: C.rose }}>{correct}<span style={{ fontSize: 20, color: C.mut }}>/{deck.length}</span></div>
        <div style={{ fontSize: 13.5, color: C.mut, marginTop: 2 }}>{correct === deck.length ? "¡Perfecto! Dominas este mazo." : correct >= deck.length * 0.6 ? "Vas bien. Repite las que fallaste." : "Buen intento. Repasa y vuelve a intentarlo."} · +{correct * 4} pts</div>
      </Card>
      <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
        <button onClick={generate} style={btnPrimary}>Otro mazo</button>
        <button onClick={() => { setI(0); setFlipped(false); setCorrect(0); setDone(false); }} style={btnGhost}>Repetir este</button>
        <button onClick={doShare} style={btnGhost}>{copied ? "¡Copiado!" : "Compartir reto"} {copied ? <Check size={14} /> : <Copy size={14} />}</button>
        <button onClick={() => setMode("setup")} style={btnGhost}>Cambiar área</button>
      </div>
      {showShare && <Card><div style={{ fontSize: 12, color: C.mut, marginBottom: 6 }}>Selecciona y copia para enviar por WhatsApp:</div><textarea readOnly value={shareText} onFocus={e => e.target.select()} style={{ width: "100%", minHeight: 130, padding: 12, borderRadius: 10, border: "1px solid " + C.line, background: C.tint, fontFamily: FM, fontSize: 12, color: C.plum, boxSizing: "border-box" }} /></Card>}
    </div>
  );

  return (
    <div style={{ display: "grid", gap: 16 }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <div style={{ fontSize: 12.5, color: C.mut, fontFamily: FM }}>{areaName} · {i + 1}/{deck.length}</div>
        <button onClick={doShare} style={linkBtn}>{copied ? "¡Copiado!" : "Compartir reto"}</button>
      </div>
      <div onClick={() => setFlipped(f => !f)} style={{ cursor: "pointer", minHeight: 210, background: flipped ? C.tint : C.card, border: "1px solid " + (flipped ? C.pink : C.line), borderRadius: 18, padding: 24, display: "grid", placeItems: "center", textAlign: "center", transition: "background .2s" }}>
        <div>
          <div style={{ fontFamily: FM, fontSize: 10, letterSpacing: "0.16em", textTransform: "uppercase", color: C.rose, marginBottom: 12 }}>{flipped ? "Respuesta" : "Pregunta"}</div>
          <div style={{ fontFamily: flipped ? FB : FD, fontSize: flipped ? 15 : 19, lineHeight: 1.5, color: C.plum }}>{flipped ? card.a : card.q}</div>
          {!flipped && <div style={{ fontSize: 12, color: C.mut, marginTop: 14 }}>toca para ver la respuesta</div>}
        </div>
      </div>
      {!flipped ? (
        <button onClick={() => setFlipped(true)} style={{ ...btnPrimary, justifyContent: "center" }}>Mostrar respuesta</button>
      ) : (
        <div style={{ display: "flex", gap: 10 }}>
          <button onClick={() => rate(false)} style={{ ...btnGhost, flex: 1, justifyContent: "center" }}>No la sabía</button>
          <button onClick={() => rate(true)} style={{ ...btnPrimary, flex: 1, justifyContent: "center" }}>La sabía ✓</button>
        </div>
      )}
      {err && <div style={{ fontSize: 12, color: C.mut, textAlign: "center" }}>{err}</div>}
    </div>
  );
}

/* ================= style tokens ================= */
const inp = { width: "100%", marginTop: 5, padding: "10px 12px", borderRadius: 10, border: `1px solid ${C.line}`, background: C.white, fontFamily: FB, fontSize: 14.5, color: C.plum, boxSizing: "border-box" };
const btnPrimary = { display: "inline-flex", alignItems: "center", gap: 7, fontFamily: FB, fontSize: 14, fontWeight: 600, padding: "10px 16px", borderRadius: 10, border: "none", cursor: "pointer", background: C.pinkStrong, color: C.white };
const btnGhost = { display: "inline-flex", alignItems: "center", gap: 7, fontFamily: FB, fontSize: 14, fontWeight: 500, padding: "10px 15px", borderRadius: 10, cursor: "pointer", background: "transparent", border: `1px solid ${C.line}`, color: C.plum };
const btnMini = { fontFamily: FB, fontSize: 12.5, fontWeight: 600, padding: "6px 12px", borderRadius: 8, border: "none", cursor: "pointer", background: C.pinkStrong, color: C.white };
const btnMiniGhost = { fontFamily: FB, fontSize: 12.5, padding: "6px 12px", borderRadius: 8, cursor: "pointer", background: "transparent", border: `1px solid ${C.line}`, color: C.mut };
const linkBtn = { fontFamily: FB, fontSize: 12.5, fontWeight: 500, cursor: "pointer", background: "transparent", border: "none", color: C.rose, textDecoration: "underline", textUnderlineOffset: "3px", padding: 0 };
const iconBtn = { display: "inline-grid", placeItems: "center", width: 30, height: 30, borderRadius: 8, cursor: "pointer", background: C.tint, border: `1px solid ${C.line}` };
