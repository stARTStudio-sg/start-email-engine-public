import { ReactNode, useEffect, useMemo, useState } from "react";

type Status = "Draft" | "Edited" | "Ready" | "Scheduled" | "Posted";
type Platform = "Email" | "Facebook" | "Instagram" | "LinkedIn" | "TikTok" | "YouTube" | "Other";
type AssetType = "Email" | "Social caption" | "Visual prompt" | "Image asset" | "Video script";

type LibraryItem = {
  id: string;
  title: string;
  type: AssetType;
  platform: Platform;
  status: Status;
  content: string;
  assetUrl?: string;
  createdAt: string;
  scheduledAt?: string;
  notes?: string;
};

type FormState = Omit<LibraryItem, "id" | "createdAt">;

const STORAGE_KEY = "start-studio-content-library-v2";
const statuses: Status[] = ["Draft", "Edited", "Ready", "Scheduled", "Posted"];
const platforms: Platform[] = ["Email", "Facebook", "Instagram", "LinkedIn", "TikTok", "YouTube", "Other"];
const assetTypes: AssetType[] = ["Email", "Social caption", "Visual prompt", "Image asset", "Video script"];
const emptyForm: FormState = { title: "", type: "Email", platform: "Email", status: "Draft", content: "", assetUrl: "", scheduledAt: "", notes: "" };

function loadItems(): LibraryItem[] {
  try {
    const saved = window.localStorage.getItem(STORAGE_KEY);
    return saved ? JSON.parse(saved) : [];
  } catch {
    return [];
  }
}

function formatDate(value?: string) {
  if (!value) return "Not scheduled";
  return new Intl.DateTimeFormat("en-SG", { day: "numeric", month: "short", year: "numeric", hour: "numeric", minute: "2-digit" }).format(new Date(value));
}

function statusTone(status: Status) {
  return {
    Draft: "bg-stone-100 text-stone-700",
    Edited: "bg-amber-100 text-amber-800",
    Ready: "bg-teal-100 text-teal-800",
    Scheduled: "bg-blue-100 text-blue-800",
    Posted: "bg-emerald-100 text-emerald-800",
  }[status];
}

function inferSaveDetails(textarea: HTMLTextAreaElement) {
  const page = textarea.closest(".page-shell");
  const text = page?.textContent ?? "";
  const card = textarea.closest("article, section, label");
  const cardText = card?.textContent ?? "";
  let platform: Platform = "Other";
  let type: AssetType = "Social caption";
  let fallback = "Saved content";

  if (text.includes("Page 4")) { platform = "Email"; type = "Email"; fallback = "Main email"; }
  else if (text.includes("Page 5")) { platform = "Email"; type = "Visual prompt"; fallback = cardText.includes("Animated GIF") ? "Email animated GIF prompt" : "Email visual prompt"; }
  else if (text.includes("Page 6")) { platform = "Facebook"; fallback = "Facebook Company post"; }
  else if (text.includes("Page 7")) { platform = "Facebook"; type = "Visual prompt"; fallback = cardText.match(/Asset \d · [^\n]+/)?.[0] ?? "Facebook visual prompt"; }
  else if (text.includes("Page 8")) { platform = "Facebook"; fallback = "Facebook Personal post"; }
  else if (text.includes("Page 9")) { platform = "Instagram"; fallback = "Instagram post"; }
  else if (text.includes("Page 10")) { platform = "LinkedIn"; fallback = "LinkedIn post"; }
  else if (text.includes("Page 11")) { platform = "TikTok"; type = "Video script"; fallback = "TikTok script"; }
  else if (text.includes("Page 12")) { platform = "YouTube"; type = "Video script"; fallback = "YouTube script"; }
  else return null;

  const firstLine = textarea.value.split("\n").map((line) => line.trim()).find(Boolean);
  const title = firstLine && firstLine.length <= 90 ? firstLine.replace(/^Subject:\s*/i, "") : fallback;
  return { title, platform, type, content: textarea.value };
}

export default function ContentWorkspace({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<LibraryItem[]>(loadItems);
  const [view, setView] = useState<"engine" | "library" | "queue">("engine");
  const [showSave, setShowSave] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<Status | "All">("All");
  const [platformFilter, setPlatformFilter] = useState<Platform | "All">("All");
  const [form, setForm] = useState<FormState>(emptyForm);

  useEffect(() => window.localStorage.setItem(STORAGE_KEY, JSON.stringify(items)), [items]);

  useEffect(() => {
    if (view !== "engine") return;
    const addButtons = () => {
      document.querySelectorAll<HTMLTextAreaElement>(".dashboard-page textarea").forEach((textarea) => {
        if (textarea.dataset.libraryButton || !inferSaveDetails(textarea)) return;
        textarea.dataset.libraryButton = "true";
        const button = document.createElement("button");
        button.type = "button";
        button.textContent = "＋ Save to Content Library";
        button.className = "mt-3 rounded-lg border border-[#173f43] bg-white px-4 py-2 text-sm font-bold text-[#173f43] hover:bg-[#e9f1f1]";
        button.onclick = () => {
          const details = inferSaveDetails(textarea);
          if (!details) return;
          setEditingId(null);
          setForm({ ...emptyForm, ...details, status: "Edited" });
          setShowSave(true);
        };
        textarea.insertAdjacentElement("afterend", button);
      });
    };
    addButtons();
    const observer = new MutationObserver(addButtons);
    observer.observe(document.body, { childList: true, subtree: true });
    return () => observer.disconnect();
  }, [view]);

  const filteredItems = useMemo(() => {
    const query = search.trim().toLowerCase();
    return items.filter((item) => (!query || `${item.title} ${item.content} ${item.notes ?? ""}`.toLowerCase().includes(query)) && (statusFilter === "All" || item.status === statusFilter) && (platformFilter === "All" || item.platform === platformFilter));
  }, [items, platformFilter, search, statusFilter]);

  const scheduledItems = useMemo(() => items.filter((item) => item.scheduledAt).sort((a, b) => new Date(a.scheduledAt!).getTime() - new Date(b.scheduledAt!).getTime()), [items]);
  const unscheduledReady = useMemo(() => items.filter((item) => !item.scheduledAt && ["Ready", "Edited", "Draft"].includes(item.status)), [items]);

  function openSave() { setEditingId(null); setForm(emptyForm); setShowSave(true); }
  function saveItem() {
    if (!form.title.trim()) return;
    const status: Status = form.scheduledAt && form.status !== "Posted" ? "Scheduled" : form.status;
    if (editingId) setItems((current) => current.map((item) => item.id === editingId ? { ...item, ...form, status, title: form.title.trim() } : item));
    else setItems((current) => [{ id: crypto.randomUUID(), ...form, status, title: form.title.trim(), createdAt: new Date().toISOString() }, ...current]);
    setShowSave(false);
  }
  function editItem(item: LibraryItem) {
    setEditingId(item.id);
    setForm({ title: item.title, type: item.type, platform: item.platform, status: item.status, content: item.content, assetUrl: item.assetUrl ?? "", scheduledAt: item.scheduledAt ?? "", notes: item.notes ?? "" });
    setShowSave(true);
  }
  function updateStatus(id: string, status: Status) { setItems((current) => current.map((item) => item.id === id ? { ...item, status } : item)); }

  return (
    <div className="min-h-screen bg-[#f8f4ed]">
      <div className="sticky top-0 z-40 border-b border-[#ddcdbb] bg-[#fffaf4]/95 px-4 py-3 backdrop-blur">
        <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-3">
          <div className="flex flex-wrap gap-2">
            <button onClick={() => setView("engine")} className={`rounded-lg px-4 py-2 text-sm font-semibold ${view === "engine" ? "bg-[#9b4d2c] text-white" : "border border-[#ddcdbb] bg-white text-[#5b4939]"}`}>Pages 1–12 · Email Engine</button>
            <button onClick={() => setView("library")} className={`rounded-lg px-4 py-2 text-sm font-semibold ${view === "library" ? "bg-[#9b4d2c] text-white" : "border border-[#ddcdbb] bg-white text-[#5b4939]"}`}>Page 13 · Content Library <span className="ml-1 opacity-70">{items.length}</span></button>
            <button onClick={() => setView("queue")} className={`rounded-lg px-4 py-2 text-sm font-semibold ${view === "queue" ? "bg-[#9b4d2c] text-white" : "border border-[#ddcdbb] bg-white text-[#5b4939]"}`}>Page 14 · Publishing Queue <span className="ml-1 opacity-70">{scheduledItems.length}</span></button>
          </div>
          <button onClick={openSave} className="rounded-lg bg-[#173f43] px-4 py-2 text-sm font-bold text-white">＋ Save to Content Library</button>
        </div>
      </div>

      {view === "engine" && children}

      {view === "library" && <main className="mx-auto max-w-7xl px-4 py-7 sm:px-6 lg:px-8">
        <div className="mb-6 flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between"><div><p className="text-xs font-bold uppercase tracking-[0.2em] text-[#9b4d2c]">Page 13 · Content Library</p><h1 className="mt-2 text-3xl font-semibold">Everything you have created, parked in one place</h1><p className="mt-2 text-sm text-[#6d5b4a]">Save emails, captions, prompts and scripts. Edit, track and schedule them when ready.</p></div><button onClick={openSave} className="rounded-lg bg-[#9b4d2c] px-5 py-3 text-sm font-bold text-white">Add content</button></div>
        <section className="mb-5 grid gap-3 rounded-xl border border-[#ddcdbb] bg-white p-4 md:grid-cols-3"><input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search title, content or notes" className="rounded-lg border border-[#ddcdbb] px-3 py-2 text-sm"/><select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value as Status | "All")} className="rounded-lg border border-[#ddcdbb] px-3 py-2 text-sm"><option>All</option>{statuses.map((x) => <option key={x}>{x}</option>)}</select><select value={platformFilter} onChange={(e) => setPlatformFilter(e.target.value as Platform | "All")} className="rounded-lg border border-[#ddcdbb] px-3 py-2 text-sm"><option>All</option>{platforms.map((x) => <option key={x}>{x}</option>)}</select></section>
        <div className="grid gap-4 lg:grid-cols-2">{filteredItems.map((item) => <article key={item.id} className="rounded-xl border border-[#ddcdbb] bg-white p-5 shadow-sm"><div className="flex items-start justify-between gap-3"><div><div className="flex flex-wrap gap-2"><span className="rounded-full bg-[#f3e8dc] px-3 py-1 text-xs font-bold text-[#9b4d2c]">{item.type}</span><span className="rounded-full bg-[#e9f1f1] px-3 py-1 text-xs font-bold text-[#173f43]">{item.platform}</span><span className={`rounded-full px-3 py-1 text-xs font-bold ${statusTone(item.status)}`}>{item.status}</span></div><h2 className="mt-3 text-xl font-semibold">{item.title}</h2></div><button onClick={() => editItem(item)} className="rounded-lg border border-[#ddcdbb] px-3 py-2 text-xs font-bold">Edit</button></div><p className="mt-3 line-clamp-4 whitespace-pre-wrap text-sm leading-6 text-[#6d5b4a]">{item.content || "No copy added yet."}</p><div className="mt-4 flex flex-wrap items-center justify-between gap-3 border-t border-[#eee1d4] pt-4"><span className="text-xs text-[#806e5d]">{item.scheduledAt ? `Scheduled ${formatDate(item.scheduledAt)}` : `Saved ${formatDate(item.createdAt)}`}</span><select value={item.status} onChange={(e) => updateStatus(item.id, e.target.value as Status)} className="rounded-lg border border-[#ddcdbb] px-3 py-2 text-xs font-bold">{statuses.map((x) => <option key={x}>{x}</option>)}</select></div></article>)}</div>
        {!filteredItems.length && <div className="rounded-xl border border-dashed border-[#cdb9a4] bg-white/70 p-10 text-center text-[#6d5b4a]">No content matches these filters.</div>}
      </main>}

      {view === "queue" && <main className="mx-auto max-w-7xl px-4 py-7 sm:px-6 lg:px-8"><div className="mb-6"><p className="text-xs font-bold uppercase tracking-[0.2em] text-[#9b4d2c]">Page 14 · Publishing Calendar / Queue</p><h1 className="mt-2 text-3xl font-semibold">Plan what goes out next</h1><p className="mt-2 text-sm text-[#6d5b4a]">Schedule content across platforms, see the upcoming order and mark posts as published.</p></div><div className="grid gap-6 lg:grid-cols-[1.25fr_0.75fr]"><section className="rounded-xl border border-[#ddcdbb] bg-white p-5"><h2 className="mb-4 text-xl font-semibold">Upcoming publishing queue</h2><div className="space-y-3">{scheduledItems.map((item, index) => <article key={item.id} className="grid gap-3 rounded-xl border border-[#eee1d4] p-4 sm:grid-cols-[60px_1fr_auto] sm:items-center"><div className="flex h-12 w-12 items-center justify-center rounded-full bg-[#f3e8dc] font-bold text-[#9b4d2c]">{index + 1}</div><div><span className="text-xs font-bold uppercase text-[#9b4d2c]">{item.platform}</span><h3 className="font-semibold">{item.title}</h3><p className="text-sm text-[#6d5b4a]">{formatDate(item.scheduledAt)}</p></div><div className="flex gap-2"><button onClick={() => editItem(item)} className="rounded-lg border border-[#ddcdbb] px-3 py-2 text-xs font-bold">Reschedule</button><button onClick={() => updateStatus(item.id, "Posted")} className="rounded-lg bg-[#173f43] px-3 py-2 text-xs font-bold text-white">Mark posted</button></div></article>)}{!scheduledItems.length && <div className="rounded-xl border border-dashed border-[#cdb9a4] p-8 text-center text-sm text-[#6d5b4a]">Nothing is scheduled yet.</div>}</div></section><aside className="rounded-xl border border-[#ddcdbb] bg-white p-5"><h2 className="text-lg font-semibold">Ready to schedule</h2><div className="mt-4 space-y-3">{unscheduledReady.slice(0, 10).map((item) => <button key={item.id} onClick={() => editItem(item)} className="block w-full rounded-lg border border-[#eee1d4] p-3 text-left"><span className="text-xs font-bold text-[#9b4d2c]">{item.platform} · {item.status}</span><strong className="mt-1 block text-sm">{item.title}</strong></button>)}</div></aside></div></main>}

      {showSave && <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#261b13]/55 p-4" onMouseDown={() => setShowSave(false)}><div className="max-h-[92vh] w-full max-w-3xl overflow-y-auto rounded-2xl bg-[#fffaf4] p-5 shadow-2xl sm:p-7" onMouseDown={(e) => e.stopPropagation()}><div className="flex items-start justify-between gap-4"><div><p className="text-xs font-bold uppercase tracking-[0.18em] text-[#9b4d2c]">{editingId ? "Edit library item" : "Save to Content Library"}</p><h2 className="mt-2 text-2xl font-semibold">Park this content for later</h2></div><button onClick={() => setShowSave(false)} className="rounded-lg border border-[#ddcdbb] px-3 py-2 text-sm font-bold">Close</button></div><div className="mt-5 grid gap-4 sm:grid-cols-2"><label className="sm:col-span-2"><span className="mb-1 block text-sm font-bold">Title</span><input value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} className="w-full rounded-lg border border-[#ddcdbb] px-3 py-2"/></label><label><span className="mb-1 block text-sm font-bold">Content type</span><select value={form.type} onChange={(e) => setForm({ ...form, type: e.target.value as AssetType })} className="w-full rounded-lg border border-[#ddcdbb] px-3 py-2">{assetTypes.map((x) => <option key={x}>{x}</option>)}</select></label><label><span className="mb-1 block text-sm font-bold">Platform</span><select value={form.platform} onChange={(e) => setForm({ ...form, platform: e.target.value as Platform })} className="w-full rounded-lg border border-[#ddcdbb] px-3 py-2">{platforms.map((x) => <option key={x}>{x}</option>)}</select></label><label><span className="mb-1 block text-sm font-bold">Status</span><select value={form.status} onChange={(e) => setForm({ ...form, status: e.target.value as Status })} className="w-full rounded-lg border border-[#ddcdbb] px-3 py-2">{statuses.map((x) => <option key={x}>{x}</option>)}</select></label><label><span className="mb-1 block text-sm font-bold">Schedule date and time</span><input type="datetime-local" value={form.scheduledAt} onChange={(e) => setForm({ ...form, scheduledAt: e.target.value })} className="w-full rounded-lg border border-[#ddcdbb] px-3 py-2"/></label><label className="sm:col-span-2"><span className="mb-1 block text-sm font-bold">Email, caption, prompt or script</span><textarea value={form.content} onChange={(e) => setForm({ ...form, content: e.target.value })} rows={8} className="w-full rounded-lg border border-[#ddcdbb] px-3 py-2"/></label><label className="sm:col-span-2"><span className="mb-1 block text-sm font-bold">Notes</span><textarea value={form.notes} onChange={(e) => setForm({ ...form, notes: e.target.value })} rows={3} className="w-full rounded-lg border border-[#ddcdbb] px-3 py-2"/></label></div><div className="mt-6 flex justify-end"><button onClick={saveItem} disabled={!form.title.trim()} className="rounded-lg bg-[#9b4d2c] px-5 py-3 text-sm font-bold text-white disabled:opacity-40">{editingId ? "Save changes" : "Save to library"}</button></div></div></div>}
    </div>
  );
}
