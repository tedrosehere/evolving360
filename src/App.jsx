import { useState, useEffect, useCallback, useRef } from "react";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  import.meta.env.VITE_SUPABASE_URL,
  import.meta.env.VITE_SUPABASE_ANON_KEY
);

const IS_ADMIN = new URLSearchParams(window.location.search).has("admin");

const SECTIONS = [
  {
    id: "inner", label: "I — Inner-Subjective",
    subsections: [
      { id: "self-awareness", label: "Self-Awareness", desc: "Capacity for Depth — can this leader see themselves clearly, including what is most comfortable to overlook?" },
      { id: "presence",       label: "Presence",       desc: "Do they remain grounded and available under pressure, or get pulled into reactivity when the stakes rise?" },
      { id: "complexity",     label: "Complexity",     desc: "Can they hold opposing truths without resolving the tension prematurely?" },
    ],
  },
  {
    id: "relational", label: "WE — Relational",
    subsections: [
      { id: "fostering-trust", label: "Fostering Trust",          desc: "Do people speak more honestly and take more risk — or hedge and wait to echo what the leader already thinks?" },
      { id: "collaboration",   label: "Engendering Collaboration", desc: "Does their engagement with technology enhance team connection and collective thinking, or stunt it?" },
      { id: "culture",         label: "Amplifying Culture",        desc: "Do they actively build the kind of team they say they want, or is there a gap between espoused values and lived behavior?" },
    ],
  },
  {
    id: "systemic", label: "IT — Systemic",
    subsections: [
      { id: "strategic-clarity", label: "Strategic Clarity",      desc: "Can they articulate a compelling future and a clear path from here to there in a way that empowers action?" },
      { id: "org-fitness",       label: "Organizational Fitness", desc: "How do they approach organizational development amidst technological change?" },
      { id: "adaptive-capacity", label: "Adaptive Capacity",      desc: "Can they recognize when organizational tensions are permanent polarities to navigate, not problems to finally solve?" },
    ],
  },
  {
    id: "open-ended", label: "Open-Ended Feedback",
    subsections: [
      { id: "open", label: "Open-Ended Questions", desc: "Narrative questions designed to surface qualitative insight beyond the scored dimensions." },
    ],
  },
];

const INSTRUCTION_TEXT = "For each sub-section, we are proposing two Likert-scale questions, which will be answered by entering a value between 1 (fixed) and 7 (evolving) and one subjective question which will produce open ended answers we will use for quotations.\n\nFeel free to vote for these, make comments, or suggest new questions for each sub-section.";

const COLORS = {
  bg: "#F7F6F3",
  surface: "#FFFFFF",
  border: "#E2E0DB",
  borderStrong: "#C8C5BE",
  text: "#1A1918",
  textSecondary: "#5C5955",
  textTertiary: "#9B978F",
  accent: "#1C3F2F",
  accentLight: "#EAF2ED",
  accentText: "#0F2A1E",
  danger: "#B91C1C",
  dangerLight: "#FEF2F2",
  upGreen: "#166534",
  upGreenBg: "#DCFCE7",
  downRed: "#991B1B",
  downRedBg: "#FEE2E2",
  likertPill: "#EDE8F5",
  likertText: "#3C3489",
  subjectivePill: "#E1F5EE",
  subjectiveText: "#085041",
};

function norm(name) { return name.trim().toLowerCase(); }

function diffWords(a, b) {
  const wa = a.trim().split(/\s+/);
  const wb = b.trim().split(/\s+/);
  let diff = Math.abs(wa.length - wb.length);
  const min = Math.min(wa.length, wb.length);
  for (let i = 0; i < min; i++) { if (wa[i] !== wb[i]) diff++; }
  return diff;
}

export default function App() {
  const [partner, setPartnerState] = useState("");
  const [nameInput, setNameInput] = useState("");
  const [activeSection, setActiveSection] = useState("inner");
  const [showArchived, setShowArchived] = useState(false);
  const [questions, setQuestions] = useState([]);
  const [votes, setVotes] = useState({});
  const [comments, setComments] = useState({});
  const [views, setViews] = useState({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [editText, setEditText] = useState("");
  const [commentDrafts, setCommentDrafts] = useState({});
  const [newQText, setNewQText] = useState({});
  const [newQType, setNewQType] = useState({});
  const [dragOver, setDragOver] = useState(null);
  const [confirmDelete, setConfirmDelete] = useState(null);
  const dragSrc = useRef(null);

  const loadAll = useCallback(async () => {
    setLoading(true);
    const [qRes, vRes, cRes, viewRes] = await Promise.all([
      supabase.from("questions").select("*").order("sort_order"),
      supabase.from("votes").select("*"),
      supabase.from("comments").select("*"),
      supabase.from("views").select("*"),
    ]);
    if (qRes.data) setQuestions(qRes.data);
    if (vRes.data) {
      const v = {};
      vRes.data.forEach(r => {
        if (!v[r.question_id]) v[r.question_id] = {};
        v[r.question_id][norm(r.partner_name)] = { vote: r.vote, displayName: r.partner_name };
      });
      setVotes(v);
    }
    if (cRes.data) {
      const c = {};
      cRes.data.forEach(r => {
        if (!c[r.question_id]) c[r.question_id] = {};
        c[r.question_id][norm(r.partner_name)] = { text: r.text, displayName: r.partner_name };
      });
      setComments(c);
    }
    if (viewRes.data) {
      const vi = {};
      viewRes.data.forEach(r => {
        if (!vi[r.question_id]) vi[r.question_id] = new Set();
        vi[r.question_id].add(norm(r.partner_name));
      });
      setViews(vi);
    }
    setLoading(false);
  }, []);

  useEffect(() => { loadAll(); }, [loadAll]);

  const recordView = useCallback(async (qId) => {
    if (!partner) return;
    const k = norm(partner);
    if (views[qId]?.has(k)) return;
    setViews(prev => {
      const next = { ...prev };
      if (!next[qId]) next[qId] = new Set();
      next[qId] = new Set([...next[qId], k]);
      return next;
    });
    await supabase.from("views").upsert({ question_id: qId, partner_name: partner }, { onConflict: "question_id,partner_name" });
  }, [partner, views]);

  const castVote = async (qId, vote) => {
    if (!partner) return;
    const k = norm(partner);
    setSaving(true);
    setVotes(prev => ({
      ...prev,
      [qId]: { ...(prev[qId] || {}), [k]: { vote, displayName: partner } },
    }));
    await supabase.from("votes").upsert(
      { question_id: qId, partner_name: partner, vote, updated_at: new Date().toISOString() },
      { onConflict: "question_id,partner_name" }
    );
    setSaving(false);
  };

  const saveComment = async (qId) => {
    if (!partner) return;
    const text = (commentDrafts[qId] ?? comments[qId]?.[norm(partner)]?.text ?? "").trim();
    const k = norm(partner);
    setSaving(true);
    setComments(prev => ({
      ...prev,
      [qId]: { ...(prev[qId] || {}), [k]: { text, displayName: partner } },
    }));
    await supabase.from("comments").upsert(
      { question_id: qId, partner_name: partner, text, updated_at: new Date().toISOString() },
      { onConflict: "question_id,partner_name" }
    );
    setCommentDrafts(prev => { const n = { ...prev }; delete n[qId]; return n; });
    setSaving(false);
  };

  const commitEdit = async (q) => {
    const newText = editText.trim();
    setEditingId(null);
    if (!newText || newText === q.text) return;
    setSaving(true);
    if (diffWords(q.text, newText) <= 3) {
      await supabase.from("questions").update({ text: newText }).eq("id", q.id);
      setQuestions(prev => prev.map(x => x.id === q.id ? { ...x, text: newText } : x));
    } else {
      const newId = q.subsection_id + "__" + Date.now();
      const maxOrder = Math.max(...questions.filter(x => x.subsection_id === q.subsection_id).map(x => x.sort_order), 0);
      const newQ = { id: newId, section_id: q.section_id, subsection_id: q.subsection_id, type: q.type, text: newText, archived: false, sort_order: maxOrder + 1 };
      await supabase.from("questions").insert([newQ]);
      setQuestions(prev => [...prev, newQ]);
    }
    setSaving(false);
  };

  const toggleArchive = async (q) => {
    setSaving(true);
    const updated = !q.archived;
    await supabase.from("questions").update({ archived: updated }).eq("id", q.id);
    setQuestions(prev => prev.map(x => x.id === q.id ? { ...x, archived: updated } : x));
    setSaving(false);
  };

  const deleteQuestion = async (qId) => {
    setSaving(true);
    await supabase.from("questions").delete().eq("id", qId);
    setQuestions(prev => prev.filter(x => x.id !== qId));
    setConfirmDelete(null);
    setSaving(false);
  };

  const addQuestion = async (sectionId, subsectionId) => {
    const subKey = subsectionId;
    const text = (newQText[subKey] || "").trim();
    const type = newQType[subKey] || "likert";
    if (!text) return;
    setSaving(true);
    const maxOrder = Math.max(...questions.filter(x => x.subsection_id === subsectionId).map(x => x.sort_order), -1);
    const newId = subsectionId + "__" + Date.now();
    const newQ = { id: newId, section_id: sectionId, subsection_id: subsectionId, type, text, archived: false, sort_order: maxOrder + 1 };
    await supabase.from("questions").insert([newQ]);
    setQuestions(prev => [...prev, newQ]);
    setNewQText(prev => { const n = { ...prev }; delete n[subKey]; return n; });
    setSaving(false);
  };

  const handleDrop = async (targetQ) => {
    const srcQ = dragSrc.current;
    if (!srcQ || srcQ.id === targetQ.id || srcQ.subsection_id !== targetQ.subsection_id) return;
    const srcOrder = srcQ.sort_order;
    const tgtOrder = targetQ.sort_order;
    setSaving(true);
    await Promise.all([
      supabase.from("questions").update({ sort_order: tgtOrder }).eq("id", srcQ.id),
      supabase.from("questions").update({ sort_order: srcOrder }).eq("id", targetQ.id),
    ]);
    setQuestions(prev => prev.map(x => {
      if (x.id === srcQ.id) return { ...x, sort_order: tgtOrder };
      if (x.id === targetQ.id) return { ...x, sort_order: srcOrder };
      return x;
    }));
    dragSrc.current = null;
    setDragOver(null);
    setSaving(false);
  };

  const confirmPartner = () => {
    const v = nameInput.trim();
    if (!v) return;
    setPartnerState(v);
  };

  const pendingCount = (sectionId) => {
    if (!partner) return 0;
    const sec = SECTIONS.find(s => s.id === sectionId);
    if (!sec) return 0;
    const subIds = sec.subsections.map(s => s.id);
    return questions.filter(q => subIds.includes(q.subsection_id) && !q.archived && !(votes[q.id]?.[norm(partner)])).length;
  };

  const sectionQs = (sectionId) => {
    const sec = SECTIONS.find(s => s.id === sectionId);
    if (!sec) return [];
    const subIds = sec.subsections.map(s => s.id);
    return questions
      .filter(q => subIds.includes(q.subsection_id) && (showArchived || !q.archived))
      .sort((a, b) => a.sort_order - b.sort_order);
  };

  if (loading) return (
    <div style={{ display: "flex", alignItems: "center", justifyContent: "center", minHeight: "100vh", flexDirection: "column", gap: 16, background: COLORS.bg }}>
      <div style={{ width: 36, height: 36, border: `3px solid ${COLORS.border}`, borderTopColor: COLORS.accent, borderRadius: "50%", animation: "spin 0.8s linear infinite" }} />
      <style>{`@keyframes spin{to{transform:rotate(360deg)}}`}</style>
      <span style={{ fontSize: 14, color: COLORS.textSecondary }}>Loading question bank…</span>
    </div>
  );

  const S = {
    page: { minHeight: "100vh", background: COLORS.bg, fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif", color: COLORS.text },
    inner: { maxWidth: 860, margin: "0 auto", padding: "2rem 1.5rem" },
    header: { marginBottom: "2rem", paddingBottom: "1.5rem", borderBottom: `1px solid ${COLORS.border}` },
    title: { fontSize: 22, fontWeight: 700, color: COLORS.text, margin: "0 0 4px" },
    subtitle: { fontSize: 14, color: COLORS.textSecondary, margin: 0 },
    topBar: { display: "flex", alignItems: "center", gap: 12, flexWrap: "wrap", marginTop: 16 },
    nameInput: { padding: "8px 12px", fontSize: 14, border: `1px solid ${COLORS.border}`, borderRadius: 8, background: COLORS.surface, color: COLORS.text, outline: "none", width: 200 },
    nameBtn: { padding: "8px 18px", fontSize: 14, fontWeight: 600, background: COLORS.accent, color: "#fff", border: "none", borderRadius: 8, cursor: "pointer" },
    namePill: { display: "flex", alignItems: "center", gap: 8, background: COLORS.accentLight, border: `1px solid ${COLORS.border}`, borderRadius: 20, padding: "6px 12px 6px 10px", fontSize: 14, fontWeight: 500, color: COLORS.accentText },
    savingBadge: { fontSize: 12, color: COLORS.textTertiary, marginLeft: "auto" },
    adminBadge: { fontSize: 12, fontWeight: 600, background: "#FEF3C7", color: "#92400E", border: "1px solid #FCD34D", borderRadius: 12, padding: "4px 10px" },
    tabs: { display: "flex", gap: 4, flexWrap: "wrap", marginBottom: "1.5rem", background: COLORS.surface, border: `1px solid ${COLORS.border}`, borderRadius: 12, padding: 6 },
    tab: (active) => ({
      padding: "9px 18px", borderRadius: 8, border: "none", fontSize: 13, fontWeight: 600, cursor: "pointer",
      background: active ? COLORS.accent : "transparent",
      color: active ? "#FFFFFF" : COLORS.textSecondary,
      transition: "all 0.15s",
    }),
    tabBadge: (active) => ({ display: "inline-block", marginLeft: 6, background: active ? "rgba(255,255,255,0.25)" : "rgba(0,0,0,0.08)", borderRadius: 10, padding: "1px 7px", fontSize: 11 }),
    instructionBanner: { background: COLORS.accentLight, border: `1px solid #B6D9C4`, borderRadius: 10, padding: "12px 16px", fontSize: 14, lineHeight: 1.6, color: COLORS.accentText, marginBottom: "1.75rem" },
    archivedToggle: { display: "flex", alignItems: "center", gap: 8, fontSize: 13, color: COLORS.textSecondary, cursor: "pointer", marginBottom: "1rem" },
    subsectionHeader: { margin: "2rem 0 1rem", paddingBottom: 10, borderBottom: `2px solid ${COLORS.border}` },
    subsectionLabel: { fontSize: 19, fontWeight: 700, color: COLORS.text, margin: "0 0 4px" },
    subsectionDesc: { fontSize: 13, color: COLORS.textTertiary, margin: 0, lineHeight: 1.5 },
    card: (archived, dragging) => ({
      background: COLORS.surface,
      border: `1px solid ${dragging ? COLORS.accent : COLORS.border}`,
      borderRadius: 12,
      padding: "1.25rem 1.5rem",
      marginBottom: "1rem",
      opacity: archived ? 0.5 : 1,
      borderStyle: archived ? "dashed" : "solid",
      boxShadow: archived ? "none" : "0 1px 3px rgba(0,0,0,0.04)",
      transition: "border-color 0.15s, box-shadow 0.15s",
    }),
    cardTop: { display: "flex", alignItems: "flex-start", gap: 12, marginBottom: "1rem" },
    dragHandle: { fontSize: 14, color: COLORS.textTertiary, minWidth: 28, paddingTop: 3, cursor: "grab", userSelect: "none" },
    pill: (type) => ({
      fontSize: 11, padding: "3px 9px", borderRadius: 12, fontWeight: 600, flexShrink: 0,
      background: type === "likert" ? COLORS.likertPill : COLORS.subjectivePill,
      color: type === "likert" ? COLORS.likertText : COLORS.subjectiveText,
    }),
    questionText: { fontSize: 15, lineHeight: 1.7, color: COLORS.text, margin: 0 },
    editArea: { width: "100%", fontSize: 15, lineHeight: 1.7, border: `1px solid ${COLORS.border}`, borderRadius: 8, padding: "8px 10px", background: COLORS.bg, color: COLORS.text, resize: "vertical", minHeight: 90, outline: "none" },
    cardActions: { display: "flex", gap: 2, flexShrink: 0 },
    iconBtn: (danger) => ({ background: "none", border: "none", cursor: "pointer", padding: "4px 6px", color: danger ? COLORS.danger : COLORS.textTertiary, borderRadius: 6, fontSize: 15, display: "flex", alignItems: "center" }),
    voteRow: { display: "flex", gap: 8, flexWrap: "wrap", marginBottom: 10 },
    voteBtn: (v, myVote) => ({
      display: "flex", alignItems: "center", gap: 5, padding: "7px 14px", borderRadius: 20,
      border: `1px solid ${myVote === v ? (v === "up" ? "#16A34A" : v === "down" ? "#DC2626" : COLORS.borderStrong) : COLORS.border}`,
      fontSize: 13, fontWeight: 500, cursor: "pointer",
      background: myVote === v ? (v === "up" ? COLORS.upGreenBg : v === "down" ? COLORS.downRedBg : COLORS.bg) : COLORS.surface,
      color: myVote === v ? (v === "up" ? COLORS.upGreen : v === "down" ? COLORS.downRed : COLORS.text) : COLORS.textSecondary,
      transition: "all 0.12s",
    }),
    lockBox: { display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: "1.25rem", borderRadius: 10, background: COLORS.bg, border: `1px dashed ${COLORS.border}`, fontSize: 14, color: COLORS.textSecondary, gap: 6 },
    tally: { display: "flex", alignItems: "center", gap: 10, fontSize: 13, color: COLORS.textSecondary, padding: "8px 0", borderTop: `1px solid ${COLORS.border}`, marginTop: 4, flexWrap: "wrap" },
    commentBubble: { background: COLORS.bg, borderRadius: 8, padding: "8px 12px", fontSize: 13, lineHeight: 1.6, border: `1px solid ${COLORS.border}` },
    commentArea: { width: "100%", fontSize: 13, border: `1px solid ${COLORS.border}`, borderRadius: 8, padding: "8px 10px", background: COLORS.bg, color: COLORS.text, resize: "vertical", minHeight: 56, outline: "none" },
    saveCommentBtn: { fontSize: 12, padding: "5px 14px", background: COLORS.accent, color: "#fff", border: "none", borderRadius: 6, cursor: "pointer", fontWeight: 500 },
    addQBox: { display: "flex", gap: 10, alignItems: "flex-end", margin: "0.5rem 0 2.5rem", background: COLORS.surface, border: `1px solid ${COLORS.border}`, borderRadius: 12, padding: "1rem" },
    addQArea: { flex: 1, fontSize: 14, border: `1px solid ${COLORS.border}`, borderRadius: 8, padding: "8px 10px", background: COLORS.bg, color: COLORS.text, resize: "vertical", minHeight: 64, outline: "none" },
    addQSelect: { fontSize: 13, padding: "7px 10px", borderRadius: 8, border: `1px solid ${COLORS.border}`, background: COLORS.bg, color: COLORS.text, cursor: "pointer" },
    addQBtn: { fontSize: 13, padding: "7px 16px", background: COLORS.accent, color: "#fff", border: "none", borderRadius: 8, cursor: "pointer", fontWeight: 600, whiteSpace: "nowrap" },
    confirmOverlay: { position: "fixed", inset: 0, background: "rgba(0,0,0,0.35)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 1000 },
    confirmBox: { background: COLORS.surface, borderRadius: 14, padding: "2rem", maxWidth: 380, width: "90%", boxShadow: "0 8px 32px rgba(0,0,0,0.18)" },
    confirmTitle: { fontSize: 17, fontWeight: 700, color: COLORS.text, margin: "0 0 8px" },
    confirmText: { fontSize: 14, color: COLORS.textSecondary, lineHeight: 1.6, margin: "0 0 1.5rem" },
    confirmBtns: { display: "flex", gap: 8, justifyContent: "flex-end" },
    cancelBtn: { fontSize: 13, padding: "8px 16px", background: COLORS.bg, color: COLORS.text, border: `1px solid ${COLORS.border}`, borderRadius: 8, cursor: "pointer" },
    deleteBtn: { fontSize: 13, padding: "8px 16px", background: COLORS.danger, color: "#fff", border: "none", borderRadius: 8, cursor: "pointer", fontWeight: 600 },
  };

  return (
    <div style={S.page}>
      <style>{`
        *{box-sizing:border-box}
        input:focus,textarea:focus,select:focus{border-color:${COLORS.accent}!important;box-shadow:0 0 0 3px ${COLORS.accentLight}}
        button:hover{opacity:0.88}
        @keyframes spin{to{transform:rotate(360deg)}}
      `}</style>

      {/* Delete confirmation modal */}
      {confirmDelete && (
        <div style={S.confirmOverlay} onClick={() => setConfirmDelete(null)}>
          <div style={S.confirmBox} onClick={e => e.stopPropagation()}>
            <p style={S.confirmTitle}>Delete this question?</p>
            <p style={S.confirmText}>This will permanently remove the question and all associated votes and comments. This cannot be undone.</p>
            <div style={S.confirmBtns}>
              <button style={S.cancelBtn} onClick={() => setConfirmDelete(null)}>Cancel</button>
              <button style={S.deleteBtn} onClick={() => deleteQuestion(confirmDelete)}>Delete permanently</button>
            </div>
          </div>
        </div>
      )}

      <div style={S.inner}>
        {/* Header */}
        <div style={S.header}>
          <h1 style={S.title}>Evolving 360 — Question Review</h1>
          <p style={S.subtitle}>Review and vote on candidate survey questions across all sections.</p>
          <div style={S.topBar}>
            {IS_ADMIN ? (
              <span style={S.adminBadge}>Admin Mode</span>
            ) : !partner ? (
              <>
                <input value={nameInput} onChange={e => setNameInput(e.target.value)} onKeyDown={e => e.key === "Enter" && confirmPartner()} placeholder="Enter your name to begin…" style={S.nameInput} />
                <button onClick={confirmPartner} style={S.nameBtn}>Confirm</button>
              </>
            ) : (
              <div style={S.namePill}>
                <span>Reviewing as <strong>{partner}</strong></span>
                <button onClick={() => { setPartnerState(""); setNameInput(""); }} style={{ background: "none", border: "none", cursor: "pointer", padding: 0, color: COLORS.accentText, fontSize: 14 }} aria-label="Change name">✕</button>
              </div>
            )}
            {saving && <span style={S.savingBadge}>Saving…</span>}
          </div>
        </div>

        {/* Section tabs */}
        <div style={S.tabs}>
          {SECTIONS.map(s => {
            const active = activeSection === s.id;
            const pending = !IS_ADMIN && partner ? pendingCount(s.id) : 0;
            return (
              <button key={s.id} onClick={() => setActiveSection(s.id)} style={S.tab(active)}>
                {s.label}
                {pending > 0 && <span style={S.tabBadge(active)}>{pending}</span>}
              </button>
            );
          })}
        </div>

        {/* Instruction banner */}
        <div style={S.instructionBanner}>
          {INSTRUCTION_TEXT}
        </div>

        {/* Show archived toggle (admin only) */}
        {IS_ADMIN && (
          <label style={S.archivedToggle}>
            <input type="checkbox" checked={showArchived} onChange={e => setShowArchived(e.target.checked)} />
            Show archived questions
          </label>
        )}

        {/* Section content */}
        {SECTIONS.find(s => s.id === activeSection)?.subsections.map(sub => {
          const subQs = sectionQs(activeSection).filter(q => q.subsection_id === sub.id);
          return (
            <div key={sub.id}>
              <div style={S.subsectionHeader}>
                <p style={S.subsectionLabel}>{sub.label}</p>
                <p style={S.subsectionDesc}>{sub.desc}</p>
              </div>

              {subQs.map((q, idx) => {
                const qVotes = votes[q.id] || {};
                const qViews = views[q.id] || new Set();
                const qComments = comments[q.id] || {};
                const myKey = partner ? norm(partner) : null;
                const myVote = myKey ? qVotes[myKey]?.vote : null;
                const hasEngaged = myVote !== null;
                const upCount = Object.values(qVotes).filter(v => v.vote === "up").length;
                const downCount = Object.values(qVotes).filter(v => v.vote === "down").length;
                const absCount = Object.values(qVotes).filter(v => v.vote === "abs").length;
                const commentEntries = Object.entries(qComments).filter(([, v]) => v.text);

                if (!IS_ADMIN && partner) recordView(q.id);

                return (
                  <div key={q.id}
                    draggable={IS_ADMIN && !q.archived}
                    onDragStart={() => { if (IS_ADMIN) dragSrc.current = q; }}
                    onDragOver={e => { e.preventDefault(); if (IS_ADMIN) setDragOver(q.id); }}
                    onDragLeave={() => setDragOver(null)}
                    onDrop={() => IS_ADMIN && handleDrop(q)}
                    style={S.card(q.archived, dragOver === q.id)}>

                    {/* Card header */}
                    <div style={S.cardTop}>
                      {IS_ADMIN && <span style={S.dragHandle}>⠿ {idx + 1}</span>}
                      {!IS_ADMIN && <span style={{ fontSize: 13, color: COLORS.textTertiary, minWidth: 24, paddingTop: 3 }}>{idx + 1}.</span>}
                      <span style={S.pill(q.type)}>{q.type === "likert" ? "Likert 1–7" : "Subjective"}</span>
                      <div style={{ flex: 1 }}>
                        {editingId === q.id ? (
                          <textarea value={editText} onChange={e => setEditText(e.target.value)}
                            onBlur={() => commitEdit(q)}
                            onKeyDown={e => { if (e.key === "Enter" && e.metaKey) commitEdit(q); }}
                            autoFocus style={S.editArea} />
                        ) : (
                          <p style={S.questionText}>{q.text}</p>
                        )}
                      </div>
                      {IS_ADMIN && (
                        <div style={S.cardActions}>
                          {!q.archived && (
                            <button onClick={() => { setEditingId(q.id); setEditText(q.text); }} style={S.iconBtn(false)} title="Edit question">✎</button>
                          )}
                          <button onClick={() => toggleArchive(q)} style={S.iconBtn(false)} title={q.archived ? "Restore" : "Archive"}>
                            {q.archived ? "↩" : "⊘"}
                          </button>
                          <button onClick={() => setConfirmDelete(q.id)} style={S.iconBtn(true)} title="Delete permanently">✕</button>
                        </div>
                      )}
                    </div>

                    {/* Voting / admin view */}
                    {IS_ADMIN ? (
                      <div style={{ ...S.tally, borderTop: `1px solid ${COLORS.border}`, paddingTop: 10 }}>
                        <span style={{ color: COLORS.upGreen, fontWeight: 600 }}>👍 {upCount}</span>
                        <span style={{ color: COLORS.textTertiary }}>·</span>
                        <span style={{ color: COLORS.downRed, fontWeight: 600 }}>👎 {downCount}</span>
                        <span style={{ color: COLORS.textTertiary }}>·</span>
                        <span>— {absCount}</span>
                        <span style={{ color: COLORS.textTertiary }}>·</span>
                        <span style={{ color: COLORS.textTertiary }}>👁 {qViews.size} viewed</span>
                        {commentEntries.length > 0 && (
                          <span style={{ color: COLORS.textTertiary }}>· 💬 {commentEntries.length}</span>
                        )}
                      </div>
                    ) : !partner ? (
                      <p style={{ fontSize: 13, color: COLORS.textTertiary, margin: 0 }}>Enter your name above to vote.</p>
                    ) : q.archived ? (
                      <p style={{ fontSize: 13, color: COLORS.textTertiary, fontStyle: "italic", margin: 0 }}>Archived — voting disabled.</p>
                    ) : (
                      <>
                        <div style={S.voteRow}>
                          {[["up", "👍 Useful"], ["down", "👎 Not useful"], ["abs", "Abstain"]].map(([v, label]) => (
                            <button key={v} onClick={() => castVote(q.id, v)} style={S.voteBtn(v, myVote)}>{label}</button>
                          ))}
                        </div>

                        {!hasEngaged ? (
                          <div style={S.lockBox}>
                            <span style={{ fontSize: 20 }}>🔒</span>
                            <span>Vote or abstain to see tally and comments</span>
                          </div>
                        ) : (
                          <>
                            <div style={S.tally}>
                              <span style={{ color: COLORS.upGreen, fontWeight: 600 }}>👍 {upCount}</span>
                              <span>·</span>
                              <span style={{ color: COLORS.downRed, fontWeight: 600 }}>👎 {downCount}</span>
                              <span>·</span>
                              <span>— {absCount}</span>
                              <span>·</span>
                              <span style={{ color: COLORS.textTertiary }}>👁 {qViews.size} viewed</span>
                            </div>

                            {commentEntries.length > 0 && (
                              <div style={{ display: "flex", flexDirection: "column", gap: 6, marginTop: 10 }}>
                                {commentEntries.map(([k, v]) => (
                                  <div key={k} style={S.commentBubble}>
                                    <span style={{ fontWeight: 600, marginRight: 6, color: COLORS.text }}>{v.displayName}:</span>
                                    <span style={{ color: COLORS.textSecondary }}>{v.text}</span>
                                  </div>
                                ))}
                              </div>
                            )}

                            <div style={{ marginTop: 10 }}>
                              <textarea
                                value={commentDrafts[q.id] ?? qComments[myKey]?.text ?? ""}
                                onChange={e => setCommentDrafts(prev => ({ ...prev, [q.id]: e.target.value }))}
                                placeholder="Add a comment (optional)…"
                                style={S.commentArea} />
                              <div style={{ display: "flex", justifyContent: "flex-end", marginTop: 6 }}>
                                <button onClick={() => saveComment(q.id)} style={S.saveCommentBtn}>Save comment</button>
                              </div>
                            </div>
                          </>
                        )}
                      </>
                    )}
                  </div>
                );
              })}

              {/* Add question */}
              <div style={S.addQBox}>
                <textarea
                  value={newQText[sub.id] || ""}
                  onChange={e => setNewQText(prev => ({ ...prev, [sub.id]: e.target.value }))}
                  placeholder="Propose a new question for this sub-section…"
                  style={S.addQArea} />
                <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                  <select
                    value={newQType[sub.id] || "likert"}
                    onChange={e => setNewQType(prev => ({ ...prev, [sub.id]: e.target.value }))}
                    style={S.addQSelect}>
                    <option value="likert">Likert</option>
                    <option value="subjective">Subjective</option>
                  </select>
                  <button onClick={() => addQuestion(activeSection, sub.id)} style={S.addQBtn}>+ Propose</button>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
