import { useState } from "react";
import { C } from "../theme";
import { PILLARS } from "../data/content";
import { RotatingQuote } from "../components/RotatingQuote";
import { PillarBadge } from "../components/Shared";
import type { AppState, CommunityPost, SetState } from "../types";

export function Community({ state, setState }: { state: AppState; setState: SetState }) {
  const [layer, setLayer] = useState(1);
  const [sharing, setSharing] = useState(false);
  const [sd, setSd] = useState({ text: "", pillar: "The Trickle" });
  const [bd, setBd] = useState("");
  const { communityPosts, userName, day, buddy } = state;

  const GUIDE = ["No unsolicited advice — witness, don't fix", "No performance or comparison", "No promotion or external links", "Be honest about where you actually are", "This is not a crisis service — call 000 or Lifeline 13 11 14 if needed"];

  const see = (id: number) => {
    setState((s) => ({
      ...s,
      communityPosts: s.communityPosts.map((p) => {
        if (p.id !== id) return p;
        const nextSeen = p.seen.indexOf("me") === -1 ? p.seen.concat(["me"]) : p.seen;
        return { ...p, seen: nextSeen };
      }),
    }));
  };

  const flag = (id: number) => {
    setState((s) => ({
      ...s,
      communityPosts: s.communityPosts.map((p) => (p.id === id ? { ...p, flagged: true } : p)),
    }));
  };

  const share = () => {
    if (!sd.text.trim()) return;
    const newPost: CommunityPost = { id: Date.now(), user: (userName || "You").charAt(0) + ".", day, pillar: sd.pillar, text: sd.text, seen: [], flagged: false };
    setState((s) => ({ ...s, communityPosts: [newPost].concat(s.communityPosts) }));
    setSd({ text: "", pillar: "The Trickle" });
    setSharing(false);
  };

  return (
    <div style={{ paddingBottom: 90 }}>
      <div style={{ background: C.cr, padding: "40px 24px 22px", borderLeft: "4px solid " + C.gd }}>
        <div style={{ fontFamily: "'Georgia',serif", fontSize: 24, color: C.gd, marginBottom: 5 }}>Witness, don't fix.</div>
        <div style={{ fontFamily: "Inter,sans-serif", fontSize: 12, color: C.mu }}>Three layers. Different depths.</div>
      </div>
      {communityPosts.filter((p) => p.user === (userName || "You").charAt(0) + ".").length === 0 ? (
        <div style={{ margin: "16px 24px 0", padding: "12px 14px", borderRadius: 10, background: "rgba(26,74,46,0.04)", border: "1px solid " + C.sl }}>
          <div style={{ fontFamily: "Inter,sans-serif", fontSize: 12, color: C.mu, lineHeight: 1.5 }}>You haven't shared anything yet — these are other people's moments below. No pressure to post. Read first, share when it feels right.</div>
        </div>
      ) : null}
      <RotatingQuote cycle={state.quoteCycle} offset={4} margin="16px 24px 0" />
      <div style={{ padding: "16px 24px 0" }}>
        <div style={{ display: "flex", gap: 6, marginBottom: 16 }}>
          {[
            { id: 1, l: "Shared" },
            { id: 2, l: "Cohort" },
            { id: 3, l: "Guided" },
            { id: 4, l: "Buddy" },
          ].map((x) => {
            const active = layer === x.id;
            return (
              <button key={x.id} onClick={() => setLayer(x.id)} style={{ flex: 1, padding: "8px 0", borderRadius: 8, background: active ? C.gd : "transparent", border: "1px solid " + (active ? C.gd : C.sl), color: active ? C.cr : C.mu, fontSize: 11, fontFamily: "Inter,sans-serif", cursor: "pointer", fontWeight: active ? 600 : 400 }}>
                L{x.id}: {x.l}
              </button>
            );
          })}
        </div>

        {layer === 1 ? (
          <div>
            <div style={{ background: "rgba(26,74,46,0.04)", borderRadius: 10, padding: "10px 12px", marginBottom: 12, border: "1px solid " + C.sl }}>
              {GUIDE.map((g, i) => (
                <div key={i} style={{ fontFamily: "Inter,sans-serif", fontSize: 11, color: C.mu, marginBottom: 2 }}>
                  · {g}
                </div>
              ))}
            </div>
            {sharing ? (
              <div style={{ background: C.cr, borderRadius: 12, padding: "16px", marginBottom: 14, border: "1px solid " + C.sl }}>
                <textarea value={sd.text} onChange={(e) => setSd((x) => ({ ...x, text: e.target.value }))} placeholder="What's real for you today?" rows={3} style={{ width: "100%", padding: "10px", borderRadius: 8, border: "1px solid " + C.sl, fontFamily: "'Georgia',serif", fontSize: 14, resize: "none", boxSizing: "border-box", outline: "none", fontStyle: "italic", marginBottom: 10 }} />
                <div style={{ fontFamily: "Inter,sans-serif", fontSize: 11, color: C.mu, marginBottom: 6 }}>Which pillar?</div>
                <div style={{ display: "flex", flexWrap: "wrap", gap: 5, marginBottom: 12 }}>
                  {PILLARS.map((pl) => {
                    const active = sd.pillar === pl.name;
                    return (
                      <button key={pl.name} onClick={() => setSd((x) => ({ ...x, pillar: pl.name }))} style={{ padding: "4px 10px", borderRadius: 16, border: "1px solid " + (active ? C.go : C.sl), background: active ? "rgba(200,169,106,0.15)" : "transparent", color: active ? C.go : C.mu, fontFamily: "Inter,sans-serif", fontSize: 11, cursor: "pointer" }}>
                        {pl.icon} {pl.name}
                      </button>
                    );
                  })}
                </div>
                <div style={{ fontFamily: "Inter,sans-serif", fontSize: 10, color: C.mu, marginBottom: 10 }}>By posting you agree to the community guidelines above.</div>
                <div style={{ display: "flex", gap: 8 }}>
                  <button onClick={share} style={{ flex: 2, padding: "10px", borderRadius: 8, background: C.gd, color: C.cr, border: "none", fontFamily: "Inter,sans-serif", fontSize: 13, fontWeight: 600, cursor: "pointer" }}>
                    Share
                  </button>
                  <button onClick={() => setSharing(false)} style={{ flex: 1, padding: "10px", borderRadius: 8, background: "transparent", color: C.mu, border: "1px solid " + C.sl, fontFamily: "Inter,sans-serif", fontSize: 12, cursor: "pointer" }}>
                    Cancel
                  </button>
                </div>
              </div>
            ) : (
              <button onClick={() => setSharing(true)} style={{ width: "100%", padding: "12px", borderRadius: 12, background: C.gd, color: C.cr, border: "none", fontFamily: "Inter,sans-serif", fontSize: 14, fontWeight: 600, cursor: "pointer", marginBottom: 12 }}>
                Share a Moment
              </button>
            )}
            {communityPosts
              .filter((p) => !p.flagged)
              .map((post) => {
                const isSeen = post.seen.indexOf("me") !== -1;
                return (
                  <div key={post.id} style={{ border: "1px solid " + C.sl, borderRadius: 12, padding: "14px", marginBottom: 10, background: C.ow }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 8 }}>
                      <div style={{ width: 32, height: 32, borderRadius: "50%", background: C.sl, display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "Inter,sans-serif", fontSize: 13, fontWeight: 700, color: C.gd, flexShrink: 0 }}>{post.user}</div>
                      <div>
                        <div style={{ fontFamily: "Inter,sans-serif", fontSize: 12, fontWeight: 600, color: C.ch }}>Day {post.day}</div>
                        <PillarBadge name={post.pillar} />
                      </div>
                    </div>
                    <div style={{ fontFamily: "'Georgia',serif", fontSize: 14, color: C.ch, fontStyle: "italic", lineHeight: 1.6 }}>"{post.text}"</div>
                    <div style={{ display: "flex", alignItems: "center", gap: 8, marginTop: 10 }}>
                      <button onClick={() => see(post.id)} style={{ padding: "4px 12px", borderRadius: 16, border: "1px solid " + (isSeen ? C.gd : C.sl), background: isSeen ? "rgba(26,74,46,0.08)" : "transparent", fontFamily: "Inter,sans-serif", fontSize: 11, color: isSeen ? C.gd : C.sg, cursor: "pointer" }}>
                        {isSeen ? "Seen ◎" : "I see you ◎"}
                      </button>
                      {post.seen.length > 0 ? <span style={{ fontFamily: "Inter,sans-serif", fontSize: 11, color: C.mu }}>{post.seen.length} seen</span> : null}
                      <button onClick={() => flag(post.id)} style={{ marginLeft: "auto", padding: "3px 8px", borderRadius: 12, border: "1px solid " + C.sl, background: "transparent", fontFamily: "Inter,sans-serif", fontSize: 10, color: C.mu, cursor: "pointer" }}>
                        Flag
                      </button>
                    </div>
                  </div>
                );
              })}
          </div>
        ) : null}

        {layer === 2 ? (
          <div style={{ textAlign: "center", padding: "36px 0" }}>
            <div style={{ fontSize: 36, marginBottom: 12 }}>◎</div>
            <div style={{ fontFamily: "'Georgia',serif", fontSize: 20, color: C.gd, marginBottom: 10 }}>Your Cohort</div>
            <div style={{ fontFamily: "Inter,sans-serif", fontSize: 13, color: C.mu, lineHeight: 1.7 }}>
              6–10 people matched by life context, not performance.
              <br />
              Structured check-ins. Accountability pairs.
              <br />
              No comparison. No leaderboards.
              <br />
              <br />
              <strong style={{ color: day >= 21 ? C.gd : C.mu }}>{day >= 21 ? "Access unlocked." : "Unlocks Day 21 — " + (21 - day) + " days to go."}</strong>
            </div>
          </div>
        ) : null}

        {layer === 3 ? (
          <div style={{ padding: "16px 0" }}>
            <div style={{ fontFamily: "'Georgia',serif", fontSize: 20, color: C.gd, marginBottom: 10 }}>Guided Processing</div>
            <div style={{ fontFamily: "Inter,sans-serif", fontSize: 13, color: C.mu, lineHeight: 1.7, marginBottom: 16 }}>These are coaching sessions — not counselling or psychotherapy. If what you're carrying is heavier than coaching can hold, Josh will tell you, and help you find the right support.</div>
            <div style={{ background: C.cr, borderRadius: 10, padding: "14px", marginBottom: 16, border: "1px solid " + C.sl }}>
              <div style={{ fontFamily: "Inter,sans-serif", fontSize: 12, fontWeight: 600, color: C.ch, marginBottom: 4 }}>Action Potential Counselling</div>
              <div style={{ fontFamily: "Inter,sans-serif", fontSize: 12, color: C.mu, lineHeight: 1.5 }}>Integrative. ACT-informed. Focused on men's wellbeing (15–50).</div>
            </div>
            <button style={{ width: "100%", padding: "13px 24px", background: C.gd, color: C.cr, border: "none", borderRadius: 10, fontFamily: "Inter,sans-serif", fontSize: 14, fontWeight: 700, cursor: "pointer" }}>Book a session with Josh →</button>
            <div style={{ fontFamily: "Inter,sans-serif", fontSize: 11, color: C.mu, textAlign: "center", marginTop: 8, lineHeight: 1.5 }}>You don't have to be in crisis to use it.</div>
          </div>
        ) : null}

        {layer === 4 ? (
          <div>
            <div style={{ fontFamily: "'Georgia',serif", fontSize: 20, color: C.gd, marginBottom: 8 }}>Accountability Buddy</div>
            <div style={{ fontFamily: "Inter,sans-serif", fontSize: 13, color: C.mu, lineHeight: 1.6, marginBottom: 16 }}>Pair with a friend. See each other's streaks. No scores — just presence.</div>
            {buddy ? (
              <div style={{ background: C.cr, borderRadius: 12, padding: "16px", border: "1px solid " + C.sl }}>
                <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 14 }}>
                  <div style={{ width: 40, height: 40, borderRadius: "50%", background: C.gd, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 18, color: C.go, fontWeight: 700, fontFamily: "Inter,sans-serif" }}>{buddy.charAt(0).toUpperCase()}</div>
                  <div>
                    <div style={{ fontFamily: "Inter,sans-serif", fontSize: 14, fontWeight: 600, color: C.ch }}>{buddy}</div>
                    <div style={{ fontFamily: "Inter,sans-serif", fontSize: 12, color: C.sg }}>Your accountability buddy</div>
                  </div>
                </div>
                <div style={{ fontFamily: "Inter,sans-serif", fontSize: 11, color: C.mu, marginBottom: 12 }}>Live buddy data syncs in the full app via mutual opt-in pairing.</div>
                <button onClick={() => setState((s) => ({ ...s, buddy: null }))} style={{ width: "100%", padding: "9px", borderRadius: 8, background: "transparent", color: C.mu, border: "1px solid " + C.sl, fontFamily: "Inter,sans-serif", fontSize: 12, cursor: "pointer" }}>
                  Remove buddy
                </button>
              </div>
            ) : (
              <div style={{ background: C.cr, borderRadius: 12, padding: "16px", border: "1px solid " + C.sl }}>
                <div style={{ fontFamily: "Inter,sans-serif", fontSize: 13, fontWeight: 600, color: C.ch, marginBottom: 10 }}>Add a buddy</div>
                <input value={bd} onChange={(e) => setBd(e.target.value)} placeholder="Name or username" style={{ width: "100%", padding: "10px", borderRadius: 8, border: "1px solid " + C.sl, fontFamily: "Inter,sans-serif", fontSize: 13, boxSizing: "border-box", outline: "none", marginBottom: 10 }} />
                <button
                  onClick={() => {
                    if (bd.trim()) {
                      setState((s) => ({ ...s, buddy: bd }));
                      setBd("");
                    }
                  }}
                  style={{ width: "100%", padding: "13px 24px", background: C.gd, color: C.cr, border: "none", borderRadius: 10, fontFamily: "Inter,sans-serif", fontSize: 14, fontWeight: 700, cursor: "pointer" }}
                >
                  Send pairing request
                </button>
              </div>
            )}
          </div>
        ) : null}
      </div>
    </div>
  );
}
