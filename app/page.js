"use client";
import { useState } from "react";

const FEEDS = [
  {
    id: "lex_fridman",
    type: "podcast",
    name: "Lex Fridman Podcast",
    desc: "Long-form interviews with scientists, engineers & thinkers",
    url: "https://lexfridman.com/feed/podcast/",
  },
  {
    id: "huberman",
    type: "podcast",
    name: "Huberman Lab",
    desc: "Science-based tools for everyday life",
    url: "https://feeds.megaphone.fm/hubermanlab",
  },
  {
    id: "tldr",
    type: "newsletter",
    name: "TLDR Newsletter",
    desc: "Tech, science & programming in 5 minutes",
    url: "https://tldr.tech/api/rss/tech",
  },
  {
    id: "stratechery",
    type: "newsletter",
    name: "Stratechery",
    desc: "Deep analysis of tech strategy & business",
    url: "https://stratechery.com/feed/",
  },
  {
    id: "3b1b",
    type: "youtube",
    name: "3Blue1Brown",
    desc: "Beautiful visual math & science explainers",
    url: "https://www.youtube.com/feeds/videos.xml?channel_id=UCYO_jab_esuFRV4b17AJtAw",
  },
  {
    id: "veritasium",
    type: "youtube",
    name: "Veritasium",
    desc: "Science videos that challenge your thinking",
    url: "https://www.youtube.com/feeds/videos.xml?channel_id=UCHnyfMqiRRG1u-2MsSQLbXA",
  },
  {
    id: "darknet_diaries",
    type: "podcast",
    name: "Darknet Diaries",
    desc: "True stories from the dark side of the internet",
    url: "https://feeds.megaphone.fm/darknetdiaries",
  },
  {
    id: "morning_brew",
    type: "newsletter",
    name: "Morning Brew",
    desc: "Business news for modern professionals",
    url: "https://feeds.morningbrew.com/morning-brew-daily-newsletter",
  },
];

const TYPE_META = {
  podcast:    { icon: "🎙️", label: "Podcast",    color: "#FF6B6B" },
  newsletter: { icon: "📨", label: "Newsletter", color: "#4ECDC4" },
  youtube:    { icon: "▶️", label: "YouTube",    color: "#FFE66D" },
};

const FILTERS = ["all", "podcast", "newsletter", "youtube"];

export default function App() {
  const [selected, setSelected] = useState(new Set());
  const [email, setEmail] = useState("");
  const [filter, setFilter] = useState("all");
  const [step, setStep] = useState("browse"); // browse | confirm | done
  const [customFeed, setCustomFeed] = useState({ name: "", url: "", type: "podcast" });
  const [customFeeds, setCustomFeeds] = useState([]);
  const [showCustomForm, setShowCustomForm] = useState(false);

  const toggle = (id) => {
    setSelected(prev => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  };

  const allFeeds = [...FEEDS, ...customFeeds];
  const visible = filter === "all" ? allFeeds : allFeeds.filter(f => f.type === filter);

  const addCustomFeed = () => {
    if (!customFeed.name || !customFeed.url) return;
    const id = `custom_${Date.now()}`;
    setCustomFeeds(prev => [...prev, { ...customFeed, id }]);
    setSelected(prev => new Set([...prev, id]));
    setCustomFeed({ name: "", url: "", type: "podcast" });
    setShowCustomForm(false);
  };

  const handleSubscribe = () => {
    if (!email || selected.size === 0) return;
    setStep("confirm");
  };

const handleConfirm = async () => {
    await fetch('digest-bot-production.up.railway.app', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            email,
            feeds: selectedFeeds.map(f => ({ name: f.name, url: f.url, type: f.type }))
        })
    });
    setStep("done");
};
```

Replace `YOUR-APP.onrender.com` with your actual Render URL.

Click **Commit new file**

---

## Step 5 — Deploy on Vercel

1. Go to **vercel.com** → Sign up with GitHub
2. Click **Add New → Project**
3. Find `digest-frontend` → click **Import**
4. Leave everything as default → click **Deploy**
5. Wait ~1 minute → Vercel gives you a live URL like `https://digest-frontend.vercel.app`

---

## That's it!

Your repo should look like this:
```
digest-frontend/
├── app/
│   └── page.js      ← your full frontend code
└── package.json

  const selectedFeeds = allFeeds.filter(f => selected.has(f.id));

  if (step === "done") {
    return (
      <div style={styles.page}>
        <div style={styles.doneCard}>
          <div style={styles.doneIcon}>✦</div>
          <h2 style={styles.doneTitle}>You're subscribed.</h2>
          <p style={styles.doneText}>
            Your first digest will arrive within 28 hours at<br />
            <strong>{email}</strong>
          </p>
          <div style={styles.doneFeeds}>
            {selectedFeeds.map(f => (
              <span key={f.id} style={styles.donePill}>
                {TYPE_META[f.type].icon} {f.name}
              </span>
            ))}
          </div>
          <button style={styles.backBtn} onClick={() => { setStep("browse"); setSelected(new Set()); setEmail(""); }}>
            ← Manage subscriptions
          </button>
        </div>
      </div>
    );
  }

  if (step === "confirm") {
    return (
      <div style={styles.page}>
        <div style={styles.confirmCard}>
          <h2 style={styles.confirmTitle}>Confirm your digest</h2>
          <p style={styles.confirmSub}>Summaries will be sent to <strong>{email}</strong> every 28 hours when there's something new.</p>
          <div style={styles.confirmList}>
            {selectedFeeds.map(f => {
              const meta = TYPE_META[f.type];
              return (
                <div key={f.id} style={styles.confirmItem}>
                  <span style={{ ...styles.confirmDot, background: meta.color }} />
                  <div>
                    <div style={styles.confirmName}>{f.name}</div>
                    <div style={styles.confirmType}>{meta.icon} {meta.label}</div>
                  </div>
                </div>
              );
            })}
          </div>
          <div style={styles.confirmActions}>
            <button style={styles.backBtn} onClick={() => setStep("browse")}>← Back</button>
            <button style={styles.confirmBtn} onClick={handleConfirm}>Confirm & Subscribe ✦</button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div style={styles.page}>
      {/* Header */}
      <header style={styles.header}>
        <div style={styles.logo}>✦ digest</div>
        <p style={styles.tagline}>
          Your favourite podcasts, newsletters & channels —<br />
          summarised and delivered every 28 hours.
        </p>
      </header>

      {/* Filter tabs */}
      <div style={styles.filters}>
        {FILTERS.map(f => (
          <button
            key={f}
            style={{ ...styles.filterBtn, ...(filter === f ? styles.filterActive : {}) }}
            onClick={() => setFilter(f)}
          >
            {f === "all" ? "All" : TYPE_META[f].icon + " " + TYPE_META[f].label + "s"}
          </button>
        ))}
      </div>

      {/* Feed grid */}
      <div style={styles.grid}>
        {visible.map(feed => {
          const meta = TYPE_META[feed.type];
          const isSelected = selected.has(feed.id);
          return (
            <div
              key={feed.id}
              style={{ ...styles.card, ...(isSelected ? styles.cardSelected : {}) }}
              onClick={() => toggle(feed.id)}
            >
              <div style={styles.cardTop}>
                <span style={{ ...styles.typeBadge, background: meta.color + "22", color: meta.color }}>
                  {meta.icon} {meta.label}
                </span>
                <div style={{ ...styles.checkbox, ...(isSelected ? styles.checkboxOn : {}) }}>
                  {isSelected && <span style={styles.checkmark}>✓</span>}
                </div>
              </div>
              <div style={styles.cardName}>{feed.name}</div>
              <div style={styles.cardDesc}>{feed.desc}</div>
            </div>
          );
        })}

        {/* Add custom feed card */}
        <div style={styles.addCard} onClick={() => setShowCustomForm(true)}>
          <div style={styles.addIcon}>+</div>
          <div style={styles.addLabel}>Add your own feed</div>
          <div style={styles.addSub}>Paste any RSS or YouTube channel</div>
        </div>
      </div>

      {/* Custom feed form */}
      {showCustomForm && (
        <div style={styles.overlay} onClick={() => setShowCustomForm(false)}>
          <div style={styles.modal} onClick={e => e.stopPropagation()}>
            <h3 style={styles.modalTitle}>Add a custom feed</h3>
            <input
              style={styles.input}
              placeholder="Feed name (e.g. My Favourite Podcast)"
              value={customFeed.name}
              onChange={e => setCustomFeed(p => ({ ...p, name: e.target.value }))}
            />
            <input
              style={styles.input}
              placeholder="RSS or YouTube feed URL"
              value={customFeed.url}
              onChange={e => setCustomFeed(p => ({ ...p, url: e.target.value }))}
            />
            <div style={styles.typeRow}>
              {["podcast", "newsletter", "youtube"].map(t => (
                <button
                  key={t}
                  style={{ ...styles.typeBtn, ...(customFeed.type === t ? styles.typeBtnActive : {}) }}
                  onClick={() => setCustomFeed(p => ({ ...p, type: t }))}
                >
                  {TYPE_META[t].icon} {TYPE_META[t].label}
                </button>
              ))}
            </div>
            <div style={styles.modalActions}>
              <button style={styles.backBtn} onClick={() => setShowCustomForm(false)}>Cancel</button>
              <button style={styles.confirmBtn} onClick={addCustomFeed}>Add Feed</button>
            </div>
          </div>
        </div>
      )}

      {/* Sticky subscribe bar */}
      <div style={styles.stickyBar}>
        <div style={styles.stickyInner}>
          <div style={styles.stickyCount}>
            {selected.size > 0
              ? <><strong>{selected.size}</strong> feed{selected.size !== 1 ? "s" : ""} selected</>
              : <span style={{ color: "#888" }}>Select feeds above ↑</span>}
          </div>
          <input
            style={styles.emailInput}
            type="email"
            placeholder="your@email.com"
            value={email}
            onChange={e => setEmail(e.target.value)}
          />
          <button
            style={{
              ...styles.subscribeBtn,
              opacity: (email && selected.size > 0) ? 1 : 0.4,
              cursor: (email && selected.size > 0) ? "pointer" : "not-allowed",
            }}
            onClick={handleSubscribe}
            disabled={!email || selected.size === 0}
          >
            Subscribe ✦
          </button>
        </div>
      </div>
    </div>
  );
}

const styles = {
  page: {
    minHeight: "100vh",
    background: "#0D0D0D",
    color: "#F0EDE8",
    fontFamily: "'Georgia', serif",
    paddingBottom: "120px",
  },
  header: {
    textAlign: "center",
    padding: "64px 24px 40px",
    borderBottom: "1px solid #222",
  },
  logo: {
    fontSize: "13px",
    letterSpacing: "0.3em",
    textTransform: "uppercase",
    color: "#FFE66D",
    marginBottom: "20px",
    fontFamily: "monospace",
  },
  tagline: {
    fontSize: "28px",
    fontWeight: "400",
    lineHeight: "1.5",
    color: "#F0EDE8",
    maxWidth: "500px",
    margin: "0 auto",
  },
  filters: {
    display: "flex",
    gap: "8px",
    justifyContent: "center",
    padding: "32px 24px 24px",
    flexWrap: "wrap",
  },
  filterBtn: {
    padding: "8px 20px",
    borderRadius: "100px",
    border: "1px solid #333",
    background: "transparent",
    color: "#888",
    cursor: "pointer",
    fontSize: "13px",
    fontFamily: "monospace",
    letterSpacing: "0.05em",
    transition: "all 0.15s",
  },
  filterActive: {
    background: "#F0EDE8",
    color: "#0D0D0D",
    border: "1px solid #F0EDE8",
  },
  grid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fill, minmax(240px, 1fr))",
    gap: "16px",
    maxWidth: "900px",
    margin: "0 auto",
    padding: "0 24px",
  },
  card: {
    background: "#161616",
    border: "1px solid #222",
    borderRadius: "12px",
    padding: "20px",
    cursor: "pointer",
    transition: "all 0.15s",
    userSelect: "none",
  },
  cardSelected: {
    border: "1px solid #FFE66D",
    background: "#1A1900",
  },
  cardTop: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: "14px",
  },
  typeBadge: {
    fontSize: "11px",
    padding: "3px 10px",
    borderRadius: "100px",
    fontFamily: "monospace",
    letterSpacing: "0.05em",
  },
  checkbox: {
    width: "20px",
    height: "20px",
    borderRadius: "50%",
    border: "1.5px solid #444",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    transition: "all 0.15s",
  },
  checkboxOn: {
    background: "#FFE66D",
    border: "1.5px solid #FFE66D",
  },
  checkmark: {
    fontSize: "11px",
    color: "#0D0D0D",
    fontWeight: "bold",
  },
  cardName: {
    fontSize: "15px",
    fontWeight: "600",
    marginBottom: "6px",
    color: "#F0EDE8",
  },
  cardDesc: {
    fontSize: "12px",
    color: "#666",
    lineHeight: "1.5",
  },
  addCard: {
    background: "transparent",
    border: "1px dashed #333",
    borderRadius: "12px",
    padding: "20px",
    cursor: "pointer",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    minHeight: "120px",
    gap: "6px",
    transition: "all 0.15s",
  },
  addIcon: {
    fontSize: "24px",
    color: "#444",
  },
  addLabel: {
    fontSize: "13px",
    color: "#555",
  },
  addSub: {
    fontSize: "11px",
    color: "#444",
  },
  overlay: {
    position: "fixed",
    inset: 0,
    background: "rgba(0,0,0,0.8)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    zIndex: 100,
    padding: "24px",
  },
  modal: {
    background: "#161616",
    border: "1px solid #333",
    borderRadius: "16px",
    padding: "32px",
    width: "100%",
    maxWidth: "420px",
    display: "flex",
    flexDirection: "column",
    gap: "12px",
  },
  modalTitle: {
    margin: "0 0 8px",
    fontSize: "18px",
    color: "#F0EDE8",
  },
  input: {
    background: "#0D0D0D",
    border: "1px solid #333",
    borderRadius: "8px",
    padding: "12px 14px",
    color: "#F0EDE8",
    fontSize: "14px",
    fontFamily: "monospace",
    outline: "none",
    width: "100%",
    boxSizing: "border-box",
  },
  typeRow: {
    display: "flex",
    gap: "8px",
  },
  typeBtn: {
    flex: 1,
    padding: "8px",
    borderRadius: "8px",
    border: "1px solid #333",
    background: "transparent",
    color: "#666",
    cursor: "pointer",
    fontSize: "12px",
    fontFamily: "monospace",
  },
  typeBtnActive: {
    border: "1px solid #FFE66D",
    color: "#FFE66D",
    background: "#1A1900",
  },
  modalActions: {
    display: "flex",
    gap: "8px",
    marginTop: "8px",
  },
  stickyBar: {
    position: "fixed",
    bottom: 0,
    left: 0,
    right: 0,
    background: "#111",
    borderTop: "1px solid #222",
    padding: "16px 24px",
    zIndex: 50,
  },
  stickyInner: {
    maxWidth: "900px",
    margin: "0 auto",
    display: "flex",
    gap: "12px",
    alignItems: "center",
    flexWrap: "wrap",
  },
  stickyCount: {
    fontSize: "13px",
    color: "#888",
    minWidth: "120px",
    fontFamily: "monospace",
  },
  emailInput: {
    flex: 1,
    background: "#0D0D0D",
    border: "1px solid #333",
    borderRadius: "8px",
    padding: "10px 14px",
    color: "#F0EDE8",
    fontSize: "14px",
    fontFamily: "monospace",
    outline: "none",
    minWidth: "200px",
  },
  subscribeBtn: {
    background: "#FFE66D",
    color: "#0D0D0D",
    border: "none",
    borderRadius: "8px",
    padding: "10px 24px",
    fontSize: "14px",
    fontWeight: "700",
    fontFamily: "monospace",
    letterSpacing: "0.05em",
    whiteSpace: "nowrap",
    transition: "opacity 0.15s",
  },
  // Confirm & Done screens
  confirmCard: {
    maxWidth: "520px",
    margin: "80px auto",
    background: "#161616",
    border: "1px solid #222",
    borderRadius: "16px",
    padding: "40px",
  },
  confirmTitle: {
    margin: "0 0 8px",
    fontSize: "22px",
  },
  confirmSub: {
    color: "#888",
    fontSize: "14px",
    marginBottom: "24px",
    lineHeight: "1.6",
  },
  confirmList: {
    display: "flex",
    flexDirection: "column",
    gap: "12px",
    marginBottom: "28px",
  },
  confirmItem: {
    display: "flex",
    alignItems: "center",
    gap: "14px",
  },
  confirmDot: {
    width: "8px",
    height: "8px",
    borderRadius: "50%",
    flexShrink: 0,
  },
  confirmName: {
    fontSize: "14px",
    color: "#F0EDE8",
  },
  confirmType: {
    fontSize: "11px",
    color: "#555",
    fontFamily: "monospace",
  },
  confirmActions: {
    display: "flex",
    gap: "12px",
  },
  confirmBtn: {
    background: "#FFE66D",
    color: "#0D0D0D",
    border: "none",
    borderRadius: "8px",
    padding: "10px 24px",
    fontSize: "14px",
    fontWeight: "700",
    fontFamily: "monospace",
    cursor: "pointer",
  },
  backBtn: {
    background: "transparent",
    color: "#888",
    border: "1px solid #333",
    borderRadius: "8px",
    padding: "10px 20px",
    fontSize: "14px",
    fontFamily: "monospace",
    cursor: "pointer",
  },
  doneCard: {
    maxWidth: "480px",
    margin: "100px auto",
    textAlign: "center",
    padding: "40px",
  },
  doneIcon: {
    fontSize: "48px",
    color: "#FFE66D",
    marginBottom: "20px",
  },
  doneTitle: {
    fontSize: "28px",
    margin: "0 0 12px",
  },
  doneText: {
    color: "#888",
    lineHeight: "1.7",
    marginBottom: "24px",
  },
  doneFeeds: {
    display: "flex",
    flexWrap: "wrap",
    gap: "8px",
    justifyContent: "center",
    marginBottom: "32px",
  },
  donePill: {
    background: "#1A1900",
    border: "1px solid #FFE66D33",
    color: "#FFE66D",
    padding: "4px 12px",
    borderRadius: "100px",
    fontSize: "12px",
    fontFamily: "monospace",
  },
};

