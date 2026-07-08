export interface Pillar {
  name: string;
  icon: string;
  desc: string;
  lineage: string;
  philosophy: string;
  scripture: string;
}

// The Four Pillars — brand-defining wellness framework. Christian Lens
// (off by default, opt-in) surfaces `scripture` in Today's Focus and
// PillarDetail only when enabled. Never suggest enabling it.
export const PILLARS: Pillar[] = [
  { name: "Thrownness", icon: "◎", desc: "What you were handed — and what you do with it.", lineage: "Heidegger's Geworfenheit, by way of Existentialism", philosophy: "You didn't choose your starting conditions — your body, your family, the decade you were born into. Heidegger called this 'thrownness': we find ourselves already in a situation we didn't pick. Pick It Up takes this seriously rather than glossing over it. Naming what you were handed isn't an excuse — it's the honest starting line every plan has to work from.", scripture: "\"For I know the plans I have for you,\" declares the Lord, \"plans to prosper you and not to harm you, plans to give you hope and a future.\" — Jeremiah 29:11" },
  { name: "Radical Responsibility", icon: "↑", desc: "You are not your circumstances. You are your response.", lineage: "Stoicism (Epictetus) and Frankl's Logotherapy", philosophy: "Epictetus drew a hard line between what's in your control and what isn't — and insisted that line is where freedom actually lives. Frankl, writing from inside a concentration camp, found the same thing: circumstances can be taken from you, but the choice of how to respond cannot. This pillar isn't about blame. It's about the one lever that's always, unconditionally, yours.", scripture: "\"I can do all things through him who strengthens me.\" — Philippians 4:13" },
  { name: "The Trickle", icon: "∿", desc: "Small, consistent action compounds into identity.", lineage: "Aristotelian virtue ethics and habit psychology", philosophy: "Aristotle argued we don't become courageous by feeling brave once — we become courageous by repeatedly acting courageously until it's who we are. Identity isn't declared, it's built rep by rep, day by ordinary day. The Trickle is the conviction that nobody changes in one dramatic moment; they change in the unglamorous accumulation nobody's watching.", scripture: "\"Do not despise these small beginnings, for the Lord rejoices to see the work begin.\" — Zechariah 4:10" },
  { name: "Projection", icon: "◈", desc: "The future self already exists. Walk toward it.", lineage: "Sartre's existential 'project' and possibility-oriented psychology", philosophy: "Sartre argued that humans are defined less by what they are than by what they're projecting themselves toward — existence as a constant reaching forward. You're not trying to invent a new person from nothing. You're closing the distance to someone you've already glimpsed and decided is worth becoming.", scripture: "\"Forgetting what lies behind and straining forward to what lies ahead, I press on toward the goal.\" — Philippians 3:13-14" },
];

export interface ExternalQuote {
  author: string;
  school: string;
  text: string;
}

export const EXTERNAL_QUOTES: ExternalQuote[] = [
  { author: "Marcus Aurelius", school: "Stoicism", text: "You have power over your mind, not outside events. Realize this, and you will find strength." },
  { author: "Epictetus", school: "Stoicism", text: "It's not what happens to you, but how you react to it that matters." },
  { author: "Seneca", school: "Stoicism", text: "We suffer more in imagination than in reality." },
  { author: "Viktor Frankl", school: "Logotherapy", text: "Between stimulus and response there is a space. In that space is our power to choose our response." },
  { author: "Carl Jung", school: "Depth Psychology", text: "I am not what happened to me. I am what I choose to become." },
  { author: "Søren Kierkegaard", school: "Existentialism", text: "Life can only be understood backwards, but it must be lived forwards." },
  { author: "Albert Camus", school: "Existentialism", text: "In the depth of winter, I finally learned that within me there lay an invincible summer." },
  { author: "Jean-Paul Sartre", school: "Existentialism", text: "Freedom is what you do with what's been done to you." },
  { author: "Friedrich Nietzsche", school: "Existentialism", text: "He who has a why to live can bear almost any how." },
  { author: "William James", school: "Psychology", text: "The greatest discovery of any generation is that a human can alter their life by altering their attitude." },
  { author: "Lao Tzu", school: "Eastern Philosophy", text: "A journey of a thousand miles begins with a single step." },
  { author: "Marcus Aurelius", school: "Stoicism", text: "Waste no more time arguing what a good man should be. Be one." },
  { author: "Carl Rogers", school: "Humanistic Psychology", text: "The curious paradox is that when I accept myself just as I am, then I can change." },
  { author: "Viktor Frankl", school: "Logotherapy", text: "When we are no longer able to change a situation, we are challenged to change ourselves." },
  { author: "Epictetus", school: "Stoicism", text: "First say to yourself what you would be, and then do what you have to do." },
];

export interface RegulationPractice {
  id: string;
  name: string;
  category: "breath" | "somatic";
  durationMin: number;
  intensity: string;
  mechanism: string;
  steps: string[];
  bestFor: string;
  contraindications: string;
}

// 8 evidence-grounded regulation practices. Every detail view carries the
// "not trauma therapy" boundary line (see PracticeDetail component).
export const REGULATION_PRACTICES: RegulationPractice[] = [
  { id: "physiological_sigh", name: "Physiological Sigh", category: "breath", durationMin: 2, intensity: "fastest", mechanism: "Two inhales through the nose (the second short, on top of the first) followed by one long exhale through the mouth. The double-inhale re-opens collapsed alveoli; the long exhale is what does the actual work — it's the most efficient single tool for rapidly lowering heart rate and arousal, because exhale-dominant breathing directly increases vagal (parasympathetic) tone.", steps: ["Inhale through the nose until your lungs feel full", "Without exhaling, take a second short sharp inhale on top of it", "Exhale slowly and fully through your mouth — make the exhale longer than the two inhales combined", "Repeat for 1-3 rounds"], bestFor: "Acute spikes — right before a hard conversation, mid-panic, or when you need to come down fast.", contraindications: "Generally very safe. If you feel lightheaded, stop and breathe normally." },
  { id: "box_breathing", name: "Box Breathing", category: "breath", durationMin: 4, intensity: "steady", mechanism: "Equal-count inhale, hold, exhale, hold (e.g. 4-4-4-4). The holds give you something concrete to focus attention on, which interrupts rumination, while the even rhythm itself is mildly parasympathetic-dominant. Used widely in operational/high-stress training contexts because it's simple to execute even when stressed.", steps: ["Inhale through the nose for a count of 4", "Hold gently for a count of 4", "Exhale through the nose for a count of 4", "Hold empty for a count of 4", "Repeat for 4-8 rounds"], bestFor: "Steadying yourself before something — a session, a hard task, a moment you know is coming.", contraindications: "Avoid long breath-holds if you have uncontrolled high blood pressure or a history of fainting. Shorten the holds if it feels straining, not calming." },
  { id: "extended_exhale", name: "Extended Exhale", category: "breath", durationMin: 3, intensity: "gentle", mechanism: "Simply making the exhale roughly twice as long as the inhale (e.g. inhale 4, exhale 8). No holds, no complexity — just a longer out-breath. This is the single clearest lever on the autonomic nervous system available through breath alone, because exhalation itself stimulates the vagus nerve.", steps: ["Inhale gently through the nose for a count of 4", "Exhale slowly through the nose or mouth for a count of 8", "Don't force it — if 8 feels like a stretch, try 6", "Continue for 2-4 minutes"], bestFor: "Background regulation — winding down, settling before sleep, or general high-stress days.", contraindications: "Safe for almost everyone. Very gentle." },
  { id: "body_scan", name: "Body Scan", category: "somatic", durationMin: 6, intensity: "gentle", mechanism: "Slowly moving attention through each part of the body in sequence, noticing sensation without trying to change it. This builds interoception — the ability to actually feel what's happening in your body — which is the foundation other regulation skills rely on. You can't regulate a signal you can't notice.", steps: ["Sit or lie down somewhere you won't be interrupted", "Start at your feet — just notice what's there, no need to relax anything on purpose", "Slowly move attention upward: legs, torso, hands, arms, shoulders, face", "If your mind wanders, just come back to wherever you left off", "Finish by noticing your body as a whole for a few breaths"], bestFor: "Reconnecting when you feel disconnected from your body, or as a wind-down practice.", contraindications: "If a specific body area brings up strong distress, it's okay to skip past it — this isn't trauma processing, and you're never obligated to stay with something that feels like too much. If that happens often, that's worth raising with a counsellor directly, not working through alone." },
  { id: "grounding_54321", name: "5-4-3-2-1 Grounding", category: "somatic", durationMin: 3, intensity: "gentle", mechanism: "Naming 5 things you see, 4 you can touch, 3 you can hear, 2 you can smell, 1 you can taste. This works by deliberately engaging sensory processing and present-moment attention, which competes with the kind of abstract, future/past-focused thinking that anxiety spirals run on.", steps: ["Name 5 things you can see right now", "Name 4 things you can physically feel (the chair, your clothes, the floor)", "Name 3 things you can hear", "Name 2 things you can smell", "Name 1 thing you can taste"], bestFor: "Anxiety spirals, racing thoughts, or feeling overwhelmed and needing to come back to the present.", contraindications: "Very safe, no real contraindications. Works best done out loud or written, not just in your head." },
  { id: "progressive_release", name: "Progressive Muscle Release", category: "somatic", durationMin: 8, intensity: "steady", mechanism: "Deliberately tensing a muscle group for a few seconds, then fully releasing it. The contrast makes the relaxed state more noticeable than just trying to relax directly, and it works through real physiological tension you may not have noticed you were holding — most people carry chronic low-grade tension in the jaw, shoulders, and hands without realising.", steps: ["Start at your feet — tense the muscles hard for 5 seconds", "Release completely and notice the difference for 10 seconds", "Move upward: calves, thighs, glutes, stomach, hands, arms, shoulders, face", "Finish with your whole body tensed for 5 seconds, then released"], bestFor: "Physical tension that's built up over a day, or trouble winding down before sleep.", contraindications: "Skip or go gently on any muscle group with a current injury. Not recommended for uncontrolled hypertension without medical clearance, since brief tensing raises blood pressure momentarily." },
  { id: "shaking_release", name: "Shake It Out", category: "somatic", durationMin: 3, intensity: "active", mechanism: "Loose, full-body shaking — arms, legs, torso. This isn't just a saying; many mammals visibly shake after a stress response to discharge residual physiological activation, and there's real interest in voluntary shaking as a way to help the nervous system complete a stress cycle rather than staying keyed up. It's a fast way to burn off adrenaline-type energy that breathing alone doesn't always touch.", steps: ["Stand with space around you", "Start shaking your hands, then let it move up through your arms", "Let your legs and torso join in — loose, not choreographed", "Keep going for 60-90 seconds, then stand still and notice the difference"], bestFor: "After something activating — a stressful interaction, a hard workout, a wired-but-can't-settle feeling.", contraindications: "Skip if you have a current injury that this would aggravate, or any condition where vigorous movement is contraindicated. Not appropriate as a stand-in for medical treatment of seizure-related conditions." },
  { id: "orienting", name: "Orienting", category: "somatic", durationMin: 2, intensity: "gentle", mechanism: "Slowly turning your head and eyes to look around the room, letting your gaze land on things that feel neutral or pleasant. This is a core nervous-system signal — when you orient to your actual surroundings and confirm there's no threat, it's one of the most direct ways to tell your nervous system the alert can stand down.", steps: ["Sit or stand comfortably", "Slowly turn your head to look around the room, without rushing", "Let your gaze rest on a few things that feel neutral or pleasant", "Notice you're actually here, in this room, right now", "Take one slow breath before continuing your day"], bestFor: "Quick resets between tasks, or after checking your phone/news has spiked your stress.", contraindications: "Very safe, takes seconds, no real downside." },
];

export interface PillarQuote {
  pillar: string;
  text: string;
}

export const QUOTES: PillarQuote[] = [
  { pillar: "Thrownness", text: "You didn't choose where you started. But every choice you make becomes the ground someone else starts on." },
  { pillar: "Thrownness", text: "The hand you were dealt isn't the game. What you do with it is." },
  { pillar: "Radical Responsibility", text: "The gap between who you are and who you're becoming is closed one choice at a time." },
  { pillar: "Radical Responsibility", text: "Nobody is coming to do this for you. That's not a punishment — it's the whole point." },
  { pillar: "The Trickle", text: "Small, consistent action compounds into identity. Today doesn't have to be impressive. It has to happen." },
  { pillar: "The Trickle", text: "You don't rise to your best day. You fall to your standard on your worst one." },
  { pillar: "The Trickle", text: "Showing up tired is worth more than showing up perfect. Perfect doesn't show up most days." },
  { pillar: "Projection", text: "The future self already exists. Every rep today is a step toward meeting them." },
  { pillar: "Projection", text: "You're not trying to become someone new. You're becoming who you already decided to be." },
];

export const CONSISTENCY_LINES: string[] = [
  "Mood is weather. Identity is climate. You're building climate.",
  "The version of you that shows up on a bad day is the one that actually changes things.",
  "Effort is not the metric. Presence is.",
  "Low energy isn't a reason to skip. It's a different instruction, not a cancelled one.",
  "You don't need motivation. You need a system that works without it.",
];

export interface TutorialCard {
  title: string;
  body: string;
}

export const TUTORIAL_CARDS: TutorialCard[] = [
  { title: "Your daily check-in", body: "Rate how you're actually doing. It shapes everything else — your movement, your reflection, your tone today." },
  { title: "Your session adapts", body: "Low readiness gets a gentler session. Strong readiness gets more. The plan moves with you, not against you." },
  { title: "The wheel tracks the whole week", body: "Workouts, nourishment, sleep — not just one number. Consistency across all of it is the real win." },
  { title: "You're never locked out", body: "Miss a day, log late, change your mind — none of it resets your progress. Just pick it back up." },
];

// Canonical injury keys (data/injuries.ts) — extended from 6 to 10 per
// docs/trainer-review-findings.md §2: contra data already referenced elbow,
// groin, hamstring, and achilles, but no flag existed that could ever fire
// them (guarding high-consequence movements like Nordic Curl/hamstring and
// pull-ups/elbow). Render INJURY_LABELS[key] for display, never the raw key.
export { INJURY_KEYS as INJURY_OPTIONS } from "./injuries";
