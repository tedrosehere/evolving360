import { useState, useEffect, useCallback, useRef } from "react";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  import.meta.env.VITE_SUPABASE_URL,
  import.meta.env.VITE_SUPABASE_ANON_KEY
);

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
      { id: "org-fitness",       label: "Organizational Fitness", desc: "Are they redesigning workflows and decision rights for what AI now makes possible — or adding new tools to old forms?" },
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
    <div style={{ display: "flex", alignItems: "center", justifyContent: "center", minHeight: "60vh", flexDirection: "column", gap: 12 }}>
      <div style={{ width: 32, height: 32, border: "2px solid var(--color-border-tertiary)", borderTopColor: "var(--color-text-primary)", borderRadius: "50%", animation: "spin 0.8s linear infinite" }} />
      <style>{`@keyframes spin{to{transform:rotate(360deg)}}`}</style>
      <span style={{ fontSize: 13, color: "var(--color-text-secondary)" }}>Loading question bank…</span>
    </div>
  );

  return (
    <div style={{ maxWidth: 800, margin: "0 auto", padding: "1.5rem 1rem", fontFamily: "var(--font-sans)" }}>

      {/* Top bar */}
      <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: "1.5rem", paddingBottom: "1rem", borderBottom: "0.5px solid var(--color-border-tertiary)", flexWrap: "wrap" }}>
        <span style={{ fontSize: 13, color: "var(--color-text-secondary)" }}>Reviewing as:</span>
        {!partner ? (
          <>
            <input value={nameInput} onChange={e => setNameInput(e.target.value)} onKeyDown={e => e.key === "Enter" && confirmPartner()} placeholder="Enter your name…" style={{ width: 180, fontSize: 13 }} />
            <button onClick={confirmPartner} style={{ fontSize: 12, padding: "5px 14px" }}>Confirm</button>
          </>
        ) : (
          <div style={{ display: "flex", alignItems: "center", gap: 8, background: "var(--color-background-secondary)", border: "0.5px solid var(--color-border-secondary)", borderRadius: 20, padding: "4px 10px 4px 8px", fontSize: 13, fontWeight: 500 }}>
            <span>{partner}</span>
            <button onClick={() => { setPartnerState(""); setNameInput(""); }} style={{ background: "none", border: "none", cursor: "pointer", padding: 0, color: "var(--color-text-secondary)", fontSize: 13, display: "flex" }} aria-label="Change name">✕</button>
          </div>
        )}
        {saving && <span style={{ fontSize: 11, color: "var(--color-text-tertiary)", marginLeft: "auto" }}>Saving…</span>}
      </div>

      {/* Section tabs */}
      <div style={{ display: "flex", gap: 6, flexWrap: "wrap", marginBottom: "1.5rem" }}>
        {SECTIONS.map(s => {
          const pending = pendingCount(s.id);
          return (
            <button key={s.id} onClick={() => setActiveSection(s.id)}
              style={{ padding: "6px 14px", borderRadius: 20, border: "0.5px solid var(--color-border-secondary)", fontSize: 12, fontWeight: 500, cursor: "pointer", background: activeSection === s.id ? "var(--color-text-primary)" : "var(--color-background-primary)", color: activeSection === s.id ? "var(--color-background-primary)" : "var(--color-text-secondary)", transition: "all 0.15s" }}>
              {s.label}
              {partner && pending > 0 && <span style={{ display: "inline-block", marginLeft: 5, background: "rgba(128,128,128,0.2)", borderRadius: 10, padding: "1px 6px", fontSize: 10 }}>{pending}</span>}
            </button>
          );
        })}
      </div>

      {/* Show archived toggle */}
      <label style={{ display: "flex", alignItems: "center", gap: 8, fontSize: 12, color: "var(--color-text-secondary)", cursor: "pointer", marginBottom: "0.75rem" }}>
        <input type="checkbox" checked={showArchived} onChange={e => setShowArchived(e.target.checked)} />
        Show archived questions
      </label>

      {/* Section content */}
      {SECTIONS.find(s => s.id === activeSection)?.subsections.map(sub => {
        const subQs = sectionQs(activeSection).filter(q => q.subsection_id === sub.id);
        return (
          <div key={sub.id}>
            <div style={{ fontSize: 13, fontWeight: 500, color: "var(--color-text-secondary)", margin: "1.25rem 0 0.4rem", paddingBottom: 4, borderBottom: "0.5px solid var(--color-border-tertiary)" }}>
              {sub.label}
              <span style={{ fontSize: 11, color: "var(--color-text-tertiary)", fontWeight: 400, marginLeft: 8 }}>{sub.desc}</span>
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

              if (partner) recordView(q.id);

              return (
                <div key={q.id}
                  draggable={!q.archived}
                  onDragStart={() => { dragSrc.current = q; }}
                  onDragOver={e => { e.preventDefault(); setDragOver(q.id); }}
                  onDragLeave={() => setDragOver(null)}
                  onDrop={() => handleDrop(q)}
                  style={{ background: "var(--color-background-primary)", border: `0.5px solid ${dragOver === q.id ? "var(--color-border-primary)" : "var(--color-border-tertiary)"}`, borderRadius: "var(--border-radius-lg)", padding: "1rem 1.25rem", marginBottom: "0.75rem", opacity: q.archived ? 0.45 : 1, borderStyle: q.archived ? "dashed" : "solid", transition: "border-color 0.15s" }}>

                  {/* Card header */}
                  <div style={{ display: "flex", alignItems: "flex-start", gap: 10, marginBottom: "0.75rem" }}>
                    <span style={{ fontSize: 11, color: "var(--color-text-tertiary)", minWidth: 24, paddingTop: 2, cursor: "grab" }}>⠿ {idx + 1}</span>
                    <span style={{ fontSize: 10, padding: "2px 7px", borderRadius: 10, fontWeight: 500, background: q.type === "likert" ? "#EDE8F5" : "#E1F5EE", color: q.type === "likert" ? "#3C3489" : "#085041", flexShrink: 0 }}>
                      {q.type === "likert" ? "Likert 1–7" : "Subjective"}
                    </span>
                    <div style={{ flex: 1 }}>
                      {editingId === q.id ? (
                        <textarea value={editText} onChange={e => setEditText(e.target.value)}
                          onBlur={() => commitEdit(q)}
                          onKeyDown={e => { if (e.key === "Enter" && e.metaKey) commitEdit(q); }}
                          autoFocus
                          style={{ width: "100%", fontSize: 14, lineHeight: 1.6, border: "0.5px solid var(--color-border-secondary)", borderRadius: "var(--border-radius-md)", padding: "6px 8px", background: "var(--color-background-secondary)", color: "var(--color-text-primary)", resize: "vertical", minHeight: 80 }} />
                      ) : (
                        <p style={{ fontSize: 14, lineHeight: 1.6, color: "var(--color-text-primary)", margin: 0 }}>{q.text}</p>
                      )}
                    </div>
                    <div style={{ display: "flex", gap: 4, flexShrink: 0 }}>
                      {!q.archived && (
                        <button onClick={() => { setEditingId(q.id); setEditText(q.text); }}
                          style={{ background: "none", border: "none", cursor: "pointer", padding: 4, color: "var(--color-text-tertiary)", borderRadius: 4, fontSize: 14 }}
                          title="Edit question" aria-label="Edit question">✎</button>
                      )}
                      <button onClick={() => toggleArchive(q)}
                        style={{ background: "none", border: "none", cursor: "pointer", padding: 4, color: "var(--color-text-tertiary)", borderRadius: 4, fontSize: 14 }}
                        title={q.archived ? "Restore question" : "Archive question"}
                        aria-label={q.archived ? "Restore" : "Archive"}>
                        {q.archived ? "👁" : "🚫"}
                      </button>
                    </div>
                  </div>

                  {/* Voting area */}
                  {!partner ? (
                    <p style={{ fontSize: 12, color: "var(--color-text-tertiary)", margin: 0 }}>Enter your name above to vote.</p>
                  ) : q.archived ? (
                    <p style={{ fontSize: 12, color: "var(--color-text-tertiary)", fontStyle: "italic", margin: 0 }}>Archived — voting disabled.</p>
                  ) : (
                    <>
                      <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                        {[["up", "👍 Useful"], ["down", "👎 Not useful"], ["abs", "— Abstain"]].map(([v, label]) => (
                          <button key={v} onClick={() => castVote(q.id, v)}
                            style={{ display: "flex", alignItems: "center", gap: 5, padding: "5px 12px", borderRadius: 20, border: `0.5px solid ${myVote === v ? (v === "up" ? "#1D9E75" : v === "down" ? "#E24B4A" : "var(--color-border-primary)") : "var(--color-border-secondary)"}`, fontSize: 12, fontWeight: 500, cursor: "pointer", background: myVote === v ? (v === "up" ? "#E1F5EE" : v === "down" ? "#FCEBEB" : "var(--color-background-secondary)") : "var(--color-background-primary)", color: myVote === v ? (v === "up" ? "#085041" : v === "down" ? "#501313" : "var(--color-text-primary)") : "var(--color-text-secondary)" }}>
                            {label}
                          </button>
                        ))}
                      </div>

                      {!hasEngaged ? (
                        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: "1rem", borderRadius: "var(--border-radius-md)", background: "var(--color-background-secondary)", border: "0.5px dashed var(--color-border-secondary)", fontSize: 13, color: "var(--color-text-secondary)", gap: 4, marginTop: 8 }}>
                          <span style={{ fontSize: 18 }}>🔒</span>
                          <span>Vote or abstain to see tally and comments</span>
                        </div>
                      ) : (
                        <>
                          <div style={{ display: "flex", alignItems: "center", gap: 10, fontSize: 12, color: "var(--color-text-secondary)", padding: "6px 0", borderTop: "0.5px solid var(--color-border-tertiary)", marginTop: 8, flexWrap: "wrap" }}>
                            <span style={{ color: "#085041", fontWeight: 500 }}>👍 {upCount}</span>
                            <span>·</span>
                            <span style={{ color: "#A32D2D", fontWeight: 500 }}>👎 {downCount}</span>
                            <span>·</span>
                            <span>— {absCount}</span>
                            <span>·</span>
                            <span title="Unique partners who have seen this question">👁 {qViews.size} viewed</span>
                          </div>

                          {commentEntries.length > 0 && (
                            <div style={{ display: "flex", flexDirection: "column", gap: 6, marginTop: 8 }}>
                              {commentEntries.map(([k, v]) => (
                                <div key={k} style={{ background: "var(--color-background-secondary)", borderRadius: "var(--border-radius-md)", padding: "6px 10px", fontSize: 12, lineHeight: 1.5 }}>
                                  <span style={{ fontWeight: 500, marginRight: 6 }}>{v.displayName}:</span>{v.text}
                                </div>
                              ))}
                            </div>
                          )}

                          <div style={{ marginTop: 8 }}>
                            <textarea
                              value={commentDrafts[q.id] ?? qComments[myKey]?.text ?? ""}
                              onChange={e => setCommentDrafts(prev => ({ ...prev, [q.id]: e.target.value }))}
                              placeholder="Add a comment (optional)…"
                              style={{ width: "100%", fontSize: 12, border: "0.5px solid var(--color-border-tertiary)", borderRadius: "var(--border-radius-md)", padding: "6px 8px", background: "var(--color-background-secondary)", color: "var(--color-text-primary)", resize: "vertical", minHeight: 50 }} />
                            <div style={{ display: "flex", justifyContent: "flex-end", marginTop: 4 }}>
                              <button onClick={() => saveComment(q.id)} style={{ fontSize: 11, padding: "3px 10px" }}>Save comment</button>
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
            <div style={{ display: "flex", gap: 8, alignItems: "flex-end", margin: "0.75rem 0 1.5rem" }}>
              <textarea
                value={newQText[sub.id] || ""}
                onChange={e => setNewQText(prev => ({ ...prev, [sub.id]: e.target.value }))}
                placeholder="Propose a new question for this sub-section…"
                style={{ flex: 1, fontSize: 13, border: "0.5px solid var(--color-border-secondary)", borderRadius: "var(--border-radius-md)", padding: 8, background: "var(--color-background-secondary)", color: "var(--color-text-primary)", resize: "vertical", minHeight: 60 }} />
              <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                <select
                  value={newQType[sub.id] || "likert"}
                  onChange={e => setNewQType(prev => ({ ...prev, [sub.id]: e.target.value }))}
                  style={{ fontSize: 12, padding: "6px 8px", borderRadius: "var(--border-radius-md)", border: "0.5px solid var(--color-border-secondary)", background: "var(--color-background-secondary)", color: "var(--color-text-primary)" }}>
                  <option value="likert">Likert</option>
                  <option value="subjective">Subjective</option>
                </select>
                <button onClick={() => addQuestion(activeSection, sub.id)} style={{ fontSize: 12, padding: "5px 12px" }}>+ Add</button>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
