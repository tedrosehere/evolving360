-- Evolving 360 Question Review Tool
-- Run this in Supabase SQL Editor: https://supabase.com/dashboard > SQL Editor > New Query

-- ── Tables ──────────────────────────────────────────────────────────────

create table if not exists questions (
  id           text primary key,
  section_id   text not null,
  subsection_id text not null,
  type         text not null check (type in ('likert','subjective')),
  text         text not null,
  archived     boolean not null default false,
  sort_order   integer not null default 0,
  created_at   timestamptz not null default now()
);

create table if not exists votes (
  id           bigserial primary key,
  question_id  text not null references questions(id) on delete cascade,
  partner_name text not null,
  vote         text not null check (vote in ('up','down','abs')),
  created_at   timestamptz not null default now(),
  updated_at   timestamptz not null default now(),
  unique(question_id, partner_name)
);

create table if not exists comments (
  id           bigserial primary key,
  question_id  text not null references questions(id) on delete cascade,
  partner_name text not null,
  text         text not null default '',
  created_at   timestamptz not null default now(),
  updated_at   timestamptz not null default now(),
  unique(question_id, partner_name)
);

create table if not exists views (
  id           bigserial primary key,
  question_id  text not null references questions(id) on delete cascade,
  partner_name text not null,
  created_at   timestamptz not null default now(),
  unique(question_id, partner_name)
);

-- ── Enable Row Level Security (public read/write via anon key) ───────────

alter table questions enable row level security;
alter table votes     enable row level security;
alter table comments  enable row level security;
alter table views     enable row level security;

create policy "public read questions"  on questions for select using (true);
create policy "public insert questions" on questions for insert with check (true);
create policy "public update questions" on questions for update using (true);

create policy "public read votes"    on votes    for select using (true);
create policy "public insert votes"  on votes    for insert with check (true);
create policy "public update votes"  on votes    for update using (true);

create policy "public read comments"   on comments   for select using (true);
create policy "public insert comments" on comments   for insert with check (true);
create policy "public update comments" on comments   for update using (true);

create policy "public read views"    on views    for select using (true);
create policy "public insert views"  on views    for insert with check (true);

-- ── Seed Questions ───────────────────────────────────────────────────────

insert into questions (id, section_id, subsection_id, type, text, sort_order) values

-- I — INNER-SUBJECTIVE / Self-Awareness
('inner-self-awareness-l1','inner','self-awareness','likert',
 'This leader demonstrates a clear and honest understanding of their own strengths and developmental edges. [1 = Fixed: rarely self-reflective; 7 = Evolving: consistently names strengths and shadows with specificity]',0),
('inner-self-awareness-l2','inner','self-awareness','likert',
 'When this leader receives difficult feedback, they engage with it openly rather than becoming defensive or dismissive. [1 = Fixed: typically defensive; 7 = Evolving: visibly curious and receptive]',1),
('inner-self-awareness-l3','inner','self-awareness','likert',
 'This leader is aware of how their moods, stress states, and reactions affect the people around them. [1 = Fixed: unaware; 7 = Evolving: actively monitors and names their own state in real time]',2),
('inner-self-awareness-s1','inner','self-awareness','subjective',
 'Describe a moment when you saw this leader respond to feedback or a mistake in a way that revealed something about their self-awareness. What did you notice?',3),
('inner-self-awareness-s2','inner','self-awareness','subjective',
 'In what situations does this leader seem to have the clearest — or most limited — view of themselves? What makes the difference?',4),
('inner-self-awareness-s3','inner','self-awareness','subjective',
 'Is there a pattern in how this leader shows up that you believe they may not fully see? Describe it as specifically as you can.',5),

-- I — INNER-SUBJECTIVE / Presence
('inner-presence-l1','inner','presence','likert',
 'This leader remains fully present and attentive in high-pressure conversations — they don''t visibly withdraw, rush, or become distracted. [1 = Fixed: presence collapses under pressure; 7 = Evolving: consistently available regardless of conditions]',0),
('inner-presence-l2','inner','presence','likert',
 'When conflict or tension arises, this leader stays grounded and engaged rather than becoming reactive or shutting down. [1 = Fixed: consistently reactive; 7 = Evolving: steadying presence in difficult moments]',1),
('inner-presence-l3','inner','presence','likert',
 'In meetings and interactions, this leader gives people their genuine attention — not divided attention. [1 = Fixed: frequently distracted; 7 = Evolving: quality of attention is consistently felt]',2),
('inner-presence-s1','inner','presence','subjective',
 'Think of a moment when this leader was — or was not — fully present. What did you notice in how they showed up, and what effect did it have on the room?',3),
('inner-presence-s2','inner','presence','subjective',
 'Under what kinds of pressure does this leader seem to become less available or less grounded? What does that look like?',4),
('inner-presence-s3','inner','presence','subjective',
 'How does this leader''s quality of presence in one-on-one settings compare to their presence in larger group or high-stakes settings?',5),

-- I — INNER-SUBJECTIVE / Complexity
('inner-complexity-l1','inner','complexity','likert',
 'This leader can acknowledge uncertainty and hold open questions without forcing premature resolution or false clarity. [1 = Fixed: resolves tension quickly regardless of readiness; 7 = Evolving: stays with the question until it''s ready]',0),
('inner-complexity-l2','inner','complexity','likert',
 'This leader can hold multiple — sometimes contradictory — perspectives simultaneously, without collapsing into one. [1 = Fixed: binary thinker; 7 = Evolving: visibly integrates competing truths]',1),
('inner-complexity-l3','inner','complexity','likert',
 'This leader communicates with appropriate confidence while openly naming what they don''t yet know. [1 = Fixed: either overconfident or uncertain; 7 = Evolving: models both/and leadership fluently]',2),
('inner-complexity-s1','inner','complexity','subjective',
 'Describe a situation where this leader faced a genuinely complex or ambiguous challenge. How did they handle the uncertainty?',3),
('inner-complexity-s2','inner','complexity','subjective',
 'Where do you see this leader most able to hold complexity and nuance — and where do they reach for certainty too quickly?',4),
('inner-complexity-s3','inner','complexity','subjective',
 'What is the most "both/and" thing about this leader — a tension or paradox they navigate particularly well?',5),

-- WE — RELATIONAL / Fostering Trust
('relational-trust-l1','relational','fostering-trust','likert',
 'People feel safe telling this leader things that are difficult to hear — including disagreement, bad news, or pushback on their decisions. [1 = Fixed: people self-censor consistently; 7 = Evolving: team members regularly voice dissent directly]',0),
('relational-trust-l2','relational','fostering-trust','likert',
 'This leader listens to understand, not just to respond — they ask questions that open conversations rather than closing them. [1 = Fixed: primarily tells and directs; 7 = Evolving: regularly inquiry-led, genuinely curious]',1),
('relational-trust-l3','relational','fostering-trust','likert',
 'After interactions with this leader, people feel more capable, more confident, and more willing to take initiative. [1 = Fixed: interactions leave people cautious; 7 = Evolving: people consistently report feeling expanded]',2),
('relational-trust-s1','relational','fostering-trust','subjective',
 'Think of a time you — or someone on the team — brought a hard truth to this leader. What happened? What made it possible or difficult?',3),
('relational-trust-s2','relational','fostering-trust','subjective',
 'When you are around this leader, do you tend to speak more freely or more carefully than with other leaders? What causes that?',4),
('relational-trust-s3','relational','fostering-trust','subjective',
 'What is the one thing about this leader''s relational style that most determines whether people bring their full thinking — or hold back?',5),

-- WE — RELATIONAL / Collaboration
('relational-collab-l1','relational','collaboration','likert',
 'This leader actively creates conditions where diverse perspectives are heard and genuinely considered before decisions are made. [1 = Fixed: decisions made with narrow input; 7 = Evolving: consistently broad, inclusive decision process]',0),
('relational-collab-l2','relational','collaboration','likert',
 'This leader uses technology and shared tools in ways that enhance — not replace — genuine connection and collective thinking on the team. [1 = Fixed: technology is isolating or one-directional; 7 = Evolving: tech fluency multiplies team capability]',1),
('relational-collab-l3','relational','collaboration','likert',
 'Collaborative work with this leader produces better outcomes than working independently — team thinking is elevated, not just coordinated. [1 = Fixed: collaboration feels performative; 7 = Evolving: collaboration is noticeably generative]',2),
('relational-collab-s1','relational','collaboration','subjective',
 'Describe a recent collaboration with this leader — a decision, project, or problem-solving session. What was the quality of thinking and engagement?',3),
('relational-collab-s2','relational','collaboration','subjective',
 'How does this leader''s approach to meetings change when the stakes are high or time is short? What do you notice?',4),
('relational-collab-s3','relational','collaboration','subjective',
 'If you could change one thing about how this leader shows up in collaborative settings, what would it be and why?',5),

-- WE — RELATIONAL / Culture
('relational-culture-l1','relational','culture','likert',
 'This leader''s day-to-day behavior — in meetings, under pressure, in small moments — is consistent with the values they articulate. [1 = Fixed: significant gap between what is said and done; 7 = Evolving: values are lived, not just stated]',0),
('relational-culture-l2','relational','culture','likert',
 'This leader actively and visibly develops the people around them — not just as a stated priority, but as something they make time for. [1 = Fixed: development rarely prioritized in practice; 7 = Evolving: known as someone who makes people better]',1),
('relational-culture-l3','relational','culture','likert',
 'When the team falls short of its cultural standards, this leader names it directly — neither ignoring it nor over-reacting. [1 = Fixed: gap goes unaddressed; 7 = Evolving: culture called clearly and without blame]',2),
('relational-culture-s1','relational','culture','subjective',
 'What is one value or cultural norm this leader models especially well — and what does that look like in practice?',3),
('relational-culture-s2','relational','culture','subjective',
 'Where do you see the clearest gap between what this leader says matters and how things actually operate on the team?',4),
('relational-culture-s3','relational','culture','subjective',
 'How does this leader respond when the team is not operating at its best? What does that tell you about the culture they are creating?',5),

-- IT — SYSTEMIC / Strategic Clarity
('systemic-strategy-l1','systemic','strategic-clarity','likert',
 'This leader articulates a clear and compelling direction — people understand where they are going and why. [1 = Fixed: direction is unclear or frequently shifting; 7 = Evolving: vision is clear, consistent, and genuinely inspiring]',0),
('systemic-strategy-l2','systemic','strategic-clarity','likert',
 'This leader translates high-level strategy into concrete implications for how people should spend their time and make decisions. [1 = Fixed: vision exists but daily work feels disconnected; 7 = Evolving: strategic clarity reaches daily work]',1),
('systemic-strategy-l3','systemic','strategic-clarity','likert',
 'When priorities conflict, this leader makes decisions that reflect a coherent, well-reasoned point of view. [1 = Fixed: decisions feel arbitrary or reactive; 7 = Evolving: decision-making is strategically coherent]',2),
('systemic-strategy-s1','systemic','strategic-clarity','subjective',
 'When this leader explains the strategy or vision, what lands most clearly — and what leaves you with unanswered questions?',3),
('systemic-strategy-s2','systemic','strategic-clarity','subjective',
 'Describe a moment when this leader''s strategic clarity — or lack of it — directly affected your work or the team''s ability to move forward.',4),
('systemic-strategy-s3','systemic','strategic-clarity','subjective',
 'How well does this leader connect day-to-day decisions and trade-offs back to the larger strategic direction? Give a specific example if you can.',5),

-- IT — SYSTEMIC / Organizational Fitness
('systemic-orgfit-l1','systemic','org-fitness','likert',
 'This leader actively redesigns how work gets done — roles, workflows, decision rights — rather than layering new tools onto existing processes. [1 = Fixed: structure unchanged despite changing context; 7 = Evolving: structures deliberately redesigned as strategy evolves]',0),
('systemic-orgfit-l2','systemic','org-fitness','likert',
 'This leader''s approach to AI and new technology enhances how the team works together — it doesn''t just automate old routines. [1 = Fixed: tools added to old workflows; 7 = Evolving: AI redesigns how decisions and work flow]',1),
('systemic-orgfit-l3','systemic','org-fitness','likert',
 'The way decisions get made on this team has evolved in response to what is possible today — not just how it''s always been done. [1 = Fixed: decision-making structures are legacy; 7 = Evolving: decision rights redesigned for current reality]',2),
('systemic-orgfit-s1','systemic','org-fitness','subjective',
 'Where do you see this leader actively redesigning how the team works — rather than just improving how old processes run?',3),
('systemic-orgfit-s2','systemic','org-fitness','subjective',
 'What is one structural thing this leader should redesign but hasn''t? What is getting in the way?',4),
('systemic-orgfit-s3','systemic','org-fitness','subjective',
 'How has this leader''s approach to AI and technology shaped how the team collaborates and makes decisions?',5),

-- IT — SYSTEMIC / Adaptive Capacity
('systemic-adaptive-l1','systemic','adaptive-capacity','likert',
 'This leader distinguishes between tensions that should be resolved and tensions that are permanent features of the work — and treats them differently. [1 = Fixed: all tensions treated as problems to fix; 7 = Evolving: comfortable naming and holding polarities over time]',0),
('systemic-adaptive-l2','systemic','adaptive-capacity','likert',
 'When significant change is required, this leader communicates it in a way that stretches people without pushing them into overwhelm or disconnection. [1 = Fixed: change communication is reactive; 7 = Evolving: change is paced, named clearly, and felt as shared]',1),
('systemic-adaptive-l3','systemic','adaptive-capacity','likert',
 'This leader stays adaptive and curious as the environment changes — updating their thinking rather than defending past decisions. [1 = Fixed: defends prior commitments even when context has shifted; 7 = Evolving: visibly and openly updates their thinking]',2),
('systemic-adaptive-s1','systemic','adaptive-capacity','subjective',
 'Describe how this leader has navigated a significant change or period of uncertainty. What did they do well, and where did you wish they had led differently?',3),
('systemic-adaptive-s2','systemic','adaptive-capacity','subjective',
 'What is a tension in this organization that this leader has been treating as a problem to solve — but might be better held as a permanent polarity?',4),
('systemic-adaptive-s3','systemic','adaptive-capacity','subjective',
 'When things don''t go as planned or the strategy needs to shift, how does this leader respond? What does their adaptability look like to those around them?',5),

-- OPEN-ENDED FEEDBACK
('open-oe1','open-ended','open','subjective',
 'What do you most value about this person''s leadership impact? Be as specific as possible — name what they do, what it produces, and why it matters.',0),
('open-oe2','open-ended','open','subjective',
 'Where do you see the greatest opportunity for this person''s growth or development? Describe the pattern you observe and the impact it has when it shows up.',1),
('open-oe3','open-ended','open','subjective',
 'What are one or two simple, specific things this person could do — starting now — that would meaningfully shift their leadership impact?',2),
('open-oe4','open-ended','open','subjective',
 'Looking ahead to the next six months, what outcomes or areas of focus would you most like to see this person prioritize? Why those, and why now?',3),
('open-oe5','open-ended','open','subjective',
 'When this leader is at their best, what does their leadership make possible — for you, for the team, for the organization? What becomes easier?',4),
('open-oe6','open-ended','open','subjective',
 'What does this leader unintentionally make harder? Describe the pattern and the downstream cost as specifically as you can.',5),
('open-oe7','open-ended','open','subjective',
 'If this leader could hear one thing from you that they almost certainly won''t hear any other way, what would it be?',6),
('open-oe8','open-ended','open','subjective',
 'Is there anything else you''d like to share about this leader''s impact — positive or developmental — that wasn''t captured above?',7)

on conflict (id) do nothing;
