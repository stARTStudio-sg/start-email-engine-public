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

const STORAGE_KEY = "start-studio-content-library-v2";
const statuses: Status[] = ["Draft", "Edited", "Ready", "Scheduled", "Posted"];
const platforms: Platform[] = ["Email", "Facebook", "Instagram", "LinkedIn", "TikTok", "YouTube", "Other"];
const assetTypes: AssetType[] = ["Email", "Social caption", "Visual prompt", "Image asset", "Video script"];

const starterItems: LibraryItem[] = [
  {
    id: "starter-email",
    title: "The small stories children tell",
    type: "Email",
    platform: "Email",
    status: "Edited",
    content: "A warm parenting reflection about listening when children share their ordinary stories.",
    createdAt: "2026-07-28T09:00:00.000Z",
    notes: "Add a personal story before scheduling.",
  },
  {
    id: "starter-facebook",
    title: "Children remember whether we listened",
    type: "Social caption",
    platform: "Facebook",
    status: "Ready",
    content: "Children do not remember how tired we were. They remember whether we listened.",
    createdAt: "2026-07-28T09:10:00.000Z",
  },
  {
    id: "starter-instagram",
    title: "Connection before correction",
    type: "Image asset",
    platform: "Instagram",
    status: "Scheduled",
    content: "Square brushstroke visual paired with a concise parenting reflection.",
    createdAt: "2026-07-28T09:20:00.000Z",
    scheduledAt: "2026-08-03T11:00",
  },
];

function loadItems() {
  try {
    const saved = window.localStorage.getItem(STORAGE_KEY);
    return saved ? (JSON.parse(saved) as LibraryItem[]) : starterItems;
  } catch {
    return starterItems;
  }
}

function formatDate(value?: string) {
  if (!value) return "Not scheduled";
  return new Intl.DateTimeFormat("en-SG", {
    day: "numeric",
    month: "short",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit",
  }).format(new Date(value));
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

export default function ContentWorkspace({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<LibraryItem[]>(loadItems);
  const [view, setView] = useState<"engine" | "library" | "queue">("engine");
  const [showSave, setShowSave] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<Status | "All">("All");
  const [platformFilter, setPlatformFilter] = useState<Platform | "All">("All");
  const [form, setForm] = useState({
    title: "",
    type: "Email" as AssetType,
    platform: "Email" as Platform,
    status: "Draft" as Status,
    content: "",
    assetUrl: "",
    scheduledAt: "",
    notes: "",
  });

  useEffect(() => {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
  }, [items]);

  const filteredItems = useMemo(() => {
    const query = search.trim().toLowerCase();
    return items.filter((item) => {
      const matchesSearch = !query || `${item.title} ${item.content} ${item.notes ?? ""}`.toLowerCase().includes(query);
      const matchesStatus = statusFilter === "All" || item.status === statusFilter;
      const matchesPlatform = platformFilter === "All" || item.platform === platformFilter;
      return matchesSearch && matchesStatus && matchesPlatform;
    });
  }, [items, platformFilter, search, statusFilter]);

  const scheduledItems = useMemo(
    () => items.filter((item) => item.scheduledAt).sort((a, b) => new Date(a.scheduledAt!).getTime() - new Date(b.scheduledAt!).getTime()),
    [items],
  );

  const unscheduledReady = useMemo(
    () => items.filter((item) => !item.scheduledAt && ["Ready", "Edited", "Draft"].includes(item.status)),
    [items],
  );

  function resetForm() {
    setEditingId(null);
    setForm({ title: "", type: "Email", platform: "Email", status: "Draft", content: "", assetUrl: "", scheduledAt: "", notes: "" });
  }

  function openSave() {
    resetForm();
    setShowSave(true);
  }

  function saveItem() {
    if (!form.title.trim()) return;
    const nextStatus = form.scheduledAt && form.status !== "Posted" ? "Scheduled" : form.status;
    if (editingId) {
      setItems((current) => current.map((item) => item.id === editingId ? { ...item, ...form, status: nextStatus, title: form.title.trim() } : item));
    } else {
      setItems((current) => [{
        id: crypto.randomUUID(),
        ...form,
        title: form.title.trim(),
        status: nextStatus,
        createdAt: new Date().toISOString(),
      }, ...current]);
    }
    setShowSave(false);
    resetForm();
  }

  function editItem(item: LibraryItem) {
    setEditingId(item.id);
    setForm({
      title: item.title,
      type: item.type,
      platform: item.platform,
      status: item.status,
      content: item.content,
      assetUrl: item.assetUrl ?? "",
      scheduledAt: item.scheduledAt ?? "",
      notes: item.notes ?? "",
    });
    setShowSave(true);
  }

  function updateStatus(id: string, status: Status) {
    setItems((current) => current.map((item) => item.id === id ? { ...item, status, scheduledAt: status === "Scheduled" ? item.scheduledAt : status === "Posted" ? item.scheduledAt : item.scheduledAt } : item));
  }

  function removeItem(id: string) {
    setItems((current) => current.filter((item) => item.id !== id));
  }

  return (
    <div className="min-h-screen bg-[#f8f4ed]">
      <div className="sticky top-0 z-40 border-b border-[#ddcdbb] bg-[#fffaf4]/95 px-4 py-3 backdrop-blur">
        <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-3">
          <div className="flex flex-wrap gap-2">
            <button onClick={() => setView("engine")} className={`rounded-lg px-4 py-2 text-sm font-semibold ${view === "engine" ? "bg-[#9b4d2c] text-white" : "border border-[#ddcdbb] bg-white text-[#5b4939]"}`}>Email Engine</button>
            <button onClick={() => setView("library")} className={`rounded-lg px-4 py-2 text-sm font-semibold ${view === "library" ? "bg-[#9b4d2c] text-white" : "border border-[#ddcdbb] bg-white text-[#5b4939]"}`}>Content Library <span className="ml-1 opacity-70">{items.length}</span></button>
            <button onClick={() => setView("queue")} className={`rounded-lg px-4 py-2 text-sm font-semibold ${view === "queue" ? "bg-[#9b4d2c] text-white" : "border border-[#ddcdbb] bg-white text-[#5b4939]"}`}>Publishing Queue <span className="ml-1 opacity-70">{scheduledItems.length}</span></button>
          </div>
          <button onClick={openSave} className="rounded-lg bg-[#173f43] px-4 py-2 text-sm font-bold text-white shadow-sm hover:bg-[#245c61]">＋ Save to Content Library</button>
        </div>
      </div>

      {view === "engine" && children}

      {view === "library" && (
        <main className="mx-auto max-w-7xl px-4 py-7 sm:px-6 lg:px-8">
          <div className="mb-6 flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.2em] text-[#9b4d2c]">Content Library</p>
              <h1 className="mt-2 text-3xl font-semibold text-[#261b13]">Everything you have created, parked in one place</h1>
              <p className="mt-2 max-w-3xl text-sm leading-6 text-[#6d5b4a]">Save emails, captions, prompts and assets. Edit their details, move them through the workflow and schedule them when they are ready.</p>
            </div>
            <button onClick={openSave} className="rounded-lg bg-[#9b4d2c] px-5 py-3 text-sm font-bold text-white">Add content</button>
          </div>

          <section className="mb-5 grid gap-3 rounded-xl border border-[#ddcdbb] bg-white p-4 md:grid-cols-3">
            <input value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Search title, content or notes" className="rounded-lg border border-[#ddcdbb] px-3 py-2 text-sm" />
            <select value={statusFilter} onChange={(event) => setStatusFilter(event.target.value as Status | "All")} className="rounded-lg border border-[#ddcdbb] px-3 py-2 text-sm"><option>All</option>{statuses.map((status) => <option key={status}>{status}</option>)}</select>
            <select value={platformFilter} onChange={(event) => setPlatformFilter(event.target.value as Platform | "All")} className="rounded-lg border border-[#ddcdbb] px-3 py-2 text-sm"><option>All</option>{platforms.map((platform) => <option key={platform}>{platform}</option>)}</select>
          </section>

          <div className="grid gap-4 lg:grid-cols-2">
            {filteredItems.map((item) => (
              <article key={item.id} className="rounded-xl border border-[#ddcdbb] bg-white p-5 shadow-sm">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <div className="flex flex-wrap gap-2"><span className="rounded-full bg-[#f3e8dc] px-3 py-1 text-xs font-bold text-[#9b4d2c]">{item.type}</span><span className="rounded-full bg-[#e9f1f1] px-3 py-1 text-xs font-bold text-[#173f43]">{item.platform}</span><span className={`rounded-full px-3 py-1 text-xs font-bold ${statusTone(item.status)}`}>{item.status}</span></div>
                    <h2 className="mt-3 text-xl font-semibold text-[#261b13]">{item.title}</h2>
                  </div>
                  <button onClick={() => editItem(item)} className="rounded-lg border border-[#ddcdbb] px-3 py-2 text-xs font-bold text-[#5b4939]">Edit</button>
                </div>
                <p className="mt-3 line-clamp-4 whitespace-pre-wrap text-sm leading-6 text-[#6d5b4a]">{item.content || "No copy added yet."}</p>
                {item.assetUrl && <a href={item.assetUrl} target="_blank" rel="noreferrer" className="mt-3 inline-block text-sm font-bold text-[#9b4d2c] underline">Open asset</a>}
                <div className="mt-4 flex flex-wrap items-center justify-between gap-3 border-t border-[#eee1d4] pt-4">
                  <span className="text-xs text-[#806e5d]">{item.scheduledAt ? `Scheduled ${formatDate(item.scheduledAt)}` : `Saved ${formatDate(item.createdAt)}`}</span>
                  <select value={item.status} onChange={(event) => updateStatus(item.id, event.target.value as Status)} className="rounded-lg border border-[#ddcdbb] px-3 py-2 text-xs font-bold">{statuses.map((status) => <option key={status}>{status}</option>)}</select>
                </div>
              </article>
            ))}
          </div>
          {filteredItems.length === 0 && <div className="rounded-xl border border-dashed border-[#cdb9a4] bg-white/70 p-10 text-center text-[#6d5b4a]">No content matches these filters.</div>}
        </main>
      )}

      {view === "queue" && (
        <main className="mx-auto max-w-7xl px-4 py-7 sm:px-6 lg:px-8">
          <div className="mb-6">
            <p className="text-xs font-bold uppercase tracking-[0.2em] text-[#9b4d2c]">Publishing Calendar / Queue</p>
            <h1 className="mt-2 text-3xl font-semibold text-[#261b13]">Plan what goes out next</h1>
            <p className="mt-2 max-w-3xl text-sm leading-6 text-[#6d5b4a]">Schedule content across platforms, see the upcoming order and mark posts as published.</p>
          </div>

          <div className="grid gap-6 lg:grid-cols-[1.25fr_0.75fr]">
            <section className="rounded-xl border border-[#ddcdbb] bg-white p-5">
              <div className="mb-4 flex items-center justify-between"><h2 className="text-xl font-semibold">Upcoming publishing queue</h2><span className="rounded-full bg-[#e9f1f1] px-3 py-1 text-xs font-bold text-[#173f43]">{scheduledItems.length} scheduled</span></div>
              <div className="space-y-3">
                {scheduledItems.map((item, index) => (
                  <article key={item.id} className="grid gap-3 rounded-xl border border-[#eee1d4] p-4 sm:grid-cols-[60px_1fr_auto] sm:items-center">
                    <div className="flex h-12 w-12 items-center justify-center rounded-full bg-[#f3e8dc] text-sm font-bold text-[#9b4d2c]">{index + 1}</div>
                    <div><div className="flex flex-wrap gap-2"><span className="text-xs font-bold uppercase tracking-wide text-[#9b4d2c]">{item.platform}</span><span className={`rounded-full px-2 py-0.5 text-xs font-bold ${statusTone(item.status)}`}>{item.status}</span></div><h3 className="mt-1 font-semibold">{item.title}</h3><p className="mt-1 text-sm text-[#6d5b4a]">{formatDate(item.scheduledAt)}</p></div>
                    <div className="flex gap-2"><button onClick={() => editItem(item)} className="rounded-lg border border-[#ddcdbb] px-3 py-2 text-xs font-bold">Reschedule</button><button onClick={() => updateStatus(item.id, "Posted")} className="rounded-lg bg-[#173f43] px-3 py-2 text-xs font-bold text-white">Mark posted</button></div>
                  </article>
                ))}
                {scheduledItems.length === 0 && <div className="rounded-xl border border-dashed border-[#cdb9a4] p-8 text-center text-sm text-[#6d5b4a]">Nothing is scheduled yet. Choose an item from the library and add a date and time.</div>}
              </div>
            </section>

            <aside className="space-y-5">
              <section className="rounded-xl border border-[#ddcdbb] bg-white p-5"><h2 className="text-lg font-semibold">Ready to schedule</h2><div className="mt-4 space-y-3">{unscheduledReady.slice(0, 8).map((item) => <button key={item.id} onClick={() => editItem(item)} className="block w-full rounded-lg border border-[#eee1d4] p-3 text-left hover:border-[#b36b44]"><span className="text-xs font-bold text-[#9b4d2c]">{item.platform} · {item.status}</span><strong className="mt-1 block text-sm">{item.title}</strong></button>)}{unscheduledReady.length === 0 && <p className="text-sm text-[#6d5b4a]">No unscheduled drafts or ready items.</p>}</div></section>
              <section className="rounded-xl bg-[#173f43] p-5 text-white"><p className="text-xs font-bold uppercase tracking-wider text-[#cfe1df]">Workflow</p><div className="mt-3 flex flex-wrap gap-2">{statuses.map((status, index) => <span key={status} className="rounded-full bg-white/10 px-3 py-1 text-xs font-bold">{index + 1}. {status}</span>)}</div></section>
            </aside>
          </div>
        </main>
      )}

      {showSave && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#261b13]/55 p-4" onMouseDown={() => setShowSave(false)}>
          <div className="max-h-[92vh] w-full max-w-3xl overflow-y-auto rounded-2xl bg-[#fffaf4] p-5 shadow-2xl sm:p-7" onMouseDown={(event) => event.stopPropagation()}>
            <div className="flex items-start justify-between gap-4"><div><p className="text-xs font-bold uppercase tracking-[0.18em] text-[#9b4d2c]">{editingId ? "Edit library item" : "Save to Content Library"}</p><h2 className="mt-2 text-2xl font-semibold">Park this content for later</h2></div><button onClick={() => setShowSave(false)} className="rounded-lg border border-[#ddcdbb] px-3 py-2 text-sm font-bold">Close</button></div>
            <div className="mt-5 grid gap-4 sm:grid-cols-2">
              <label className="sm:col-span-2"><span className="mb-1 block text-sm font-bold">Title</span><input value={form.title} onChange={(event) => setForm({ ...form, title: event.target.value })} placeholder="Name this content" className="w-full rounded-lg border border-[#ddcdbb] px-3 py-2" /></label>
              <label><span className="mb-1 block text-sm font-bold">Content type</span><select value={form.type} onChange={(event) => setForm({ ...form, type: event.target.value as AssetType })} className="w-full rounded-lg border border-[#ddcdbb] px-3 py-2">{assetTypes.map((type) => <option key={type}>{type}</option>)}</select></label>
              <label><span className="mb-1 block text-sm font-bold">Platform</span><select value={form.platform} onChange={(event) => setForm({ ...form, platform: event.target.value as Platform })} className="w-full rounded-lg border border-[#ddcdbb] px-3 py-2">{platforms.map((platform) => <option key={platform}>{platform}</option>)}</select></label>
              <label><span className="mb-1 block text-sm font-bold">Status</span><select value={form.status} onChange={(event) => setForm({ ...form, status: event.target.value as Status })} className="w-full rounded-lg border border-[#ddcdbb] px-3 py-2">{statuses.map((status) => <option key={status}>{status}</option>)}</select></label>
              <label><span className="mb-1 block text-sm font-bold">Schedule date and time</span><input type="datetime-local" value={form.scheduledAt} onChange={(event) => setForm({ ...form, scheduledAt: event.target.value })} className="w-full rounded-lg border border-[#ddcdbb] px-3 py-2" /></label>
              <label className="sm:col-span-2"><span className="mb-1 block text-sm font-bold">Email, caption, prompt or script</span><textarea value={form.content} onChange={(event) => setForm({ ...form, content: event.target.value })} rows={8} placeholder="Paste the finished or working content here" className="w-full rounded-lg border border-[#ddcdbb] px-3 py-2" /></label>
              <label className="sm:col-span-2"><span className="mb-1 block text-sm font-bold">Image / asset link</span><input value={form.assetUrl} onChange={(event) => setForm({ ...form, assetUrl: event.target.value })} placeholder="Paste a link to an image or stored asset" className="w-full rounded-lg border border-[#ddcdbb] px-3 py-2" /></label>
              <label className="sm:col-span-2"><span className="mb-1 block text-sm font-bold">Notes</span><textarea value={form.notes} onChange={(event) => setForm({ ...form, notes: event.target.value })} rows={3} placeholder="Personal story to add, edits needed, campaign notes…" className="w-full rounded-lg border border-[#ddcdbb] px-3 py-2" /></label>
            </div>
            <div className="mt-6 flex flex-wrap justify-between gap-3">{editingId ? <button onClick={() => { removeItem(editingId); setShowSave(false); }} className="rounded-lg border border-red-200 px-4 py-2 text-sm font-bold text-red-700">Delete item</button> : <span />}<button onClick={saveItem} disabled={!form.title.trim()} className="rounded-lg bg-[#9b4d2c] px-5 py-3 text-sm font-bold text-white disabled:opacity-40">{editingId ? "Save changes" : "Save to library"}</button></div>
          </div>
        </div>
      )}
    </div>
  );
}
