const catalog = window.CATALOG || { papers: [], chapters: [], meta: {} };
const papers = catalog.papers;
const chapters = catalog.chapters;
const meta = catalog.meta;
const chapterByKey = new Map(chapters.map((chapter, index) => [chapter.key, { ...chapter, index }]));
const snapshot = new Date(`${meta.generated_at}T00:00:00Z`);

const els = {
  progress: document.querySelector("#scroll-progress"),
  heroPapers: document.querySelector("#hero-paper-count"),
  heroRecent: document.querySelector("#hero-recent-count"),
  heroChapters: document.querySelector("#hero-chapter-count"),
  recentDays: document.querySelector("#recent-days"),
  snapshot: document.querySelector("#snapshot-date"),
  recentList: document.querySelector("#recent-list"),
  recentLink: document.querySelector("#recent-filter-link"),
  chapterList: document.querySelector("#chapter-list"),
  matched: document.querySelector("#matched-count"),
  total: document.querySelector("#total-count"),
  search: document.querySelector("#search"),
  chapter: document.querySelector("#chapter-filter"),
  window: document.querySelector("#window-filter"),
  source: document.querySelector("#source-filter"),
  sort: document.querySelector("#sort-filter"),
  code: document.querySelector("#code-filter"),
  filters: document.querySelector("#filters"),
  rows: document.querySelector("#paper-rows"),
  pageSize: document.querySelector("#page-size"),
  pageSummary: document.querySelector("#page-summary"),
  pageIndicator: document.querySelector("#page-indicator"),
  previous: document.querySelector("#previous-page"),
  next: document.querySelector("#next-page"),
};

let currentPage = 1;

function parseDate(value) {
  if (!value) return new Date(0);
  return new Date(`${value.length === 7 ? `${value}-01` : value}T00:00:00Z`);
}

function withinDays(value, days) {
  if (!value || days === "all") return days === "all";
  const earliest = new Date(snapshot);
  earliest.setUTCDate(earliest.getUTCDate() - Number(days) + 1);
  const candidate = parseDate(value);
  return candidate >= earliest && candidate <= snapshot;
}

function chapterFor(paper) {
  return chapterByKey.get(paper.chapter) || { title: "Unassigned", index: 999 };
}

function makeLink(text, href) {
  const link = document.createElement("a");
  link.textContent = text;
  link.href = href;
  link.target = "_blank";
  link.rel = "noreferrer";
  return link;
}

function recentPapers() {
  return papers
    .filter((paper) => withinDays(paper.added_at, String(meta.recent_days)))
    .sort((a, b) => b.added_at.localeCompare(a.added_at) || a.title.localeCompare(b.title));
}

function renderRecent() {
  const recent = recentPapers();
  els.recentList.replaceChildren();
  if (!recent.length) {
    const empty = document.createElement("p");
    empty.className = "empty-state";
    empty.textContent = `No papers were added during this ${meta.recent_days}-day window.`;
    els.recentList.appendChild(empty);
    return;
  }
  recent.slice(0, 20).forEach((paper) => {
    const item = document.createElement("article");
    item.className = "recent-item";
    const added = document.createElement("time");
    added.dateTime = paper.added_at;
    added.textContent = paper.added_at;
    const title = document.createElement("h3");
    title.appendChild(makeLink(paper.title, paper.paper_url || paper.code_url));
    const chapter = document.createElement("span");
    chapter.className = "chapter-name";
    chapter.textContent = chapterFor(paper).title;
    item.append(added, title, chapter);
    els.recentList.appendChild(item);
  });
}

function renderChapters() {
  const counts = new Map(chapters.map((chapter) => [chapter.key, 0]));
  papers.forEach((paper) => counts.set(paper.chapter, (counts.get(paper.chapter) || 0) + 1));
  els.chapterList.replaceChildren();
  chapters.forEach((chapter, index) => {
    const button = document.createElement("button");
    button.className = "chapter-item";
    button.type = "button";
    button.dataset.chapter = chapter.key;
    button.innerHTML = `<span class="chapter-number">${String(index + 1).padStart(2, "0")}</span><span><h3></h3><p></p></span><span class="chapter-count">${counts.get(chapter.key)}</span>`;
    button.querySelector("h3").textContent = chapter.title;
    button.querySelector("p").textContent = chapter.description;
    button.addEventListener("click", () => {
      els.chapter.value = chapter.key;
      currentPage = 1;
      updateCatalog();
      document.querySelector("#papers").scrollIntoView({ behavior: "smooth" });
    });
    els.chapterList.appendChild(button);
  });
}

function stateFromUrl() {
  const params = new URLSearchParams(window.location.search);
  const choices = { chapter: els.chapter, window: els.window, source: els.source, sort: els.sort };
  Object.entries(choices).forEach(([key, select]) => {
    const value = params.get(key);
    if (value && [...select.options].some((option) => option.value === value)) select.value = value;
  });
  els.search.value = params.get("q") || "";
  els.code.checked = params.get("code") === "1";
}

function syncUrl() {
  const params = new URLSearchParams();
  if (els.search.value.trim()) params.set("q", els.search.value.trim());
  if (els.chapter.value !== "all") params.set("chapter", els.chapter.value);
  if (els.window.value !== "all") params.set("window", els.window.value);
  if (els.source.value !== "all") params.set("source", els.source.value);
  if (els.sort.value !== "added") params.set("sort", els.sort.value);
  if (els.code.checked) params.set("code", "1");
  const query = params.toString();
  history.replaceState(null, "", `${window.location.pathname}${query ? `?${query}` : ""}${window.location.hash}`);
}

function filteredPapers() {
  const query = els.search.value.trim().toLocaleLowerCase();
  const rows = papers.filter((paper) => {
    const chapter = chapterFor(paper);
    const haystack = [paper.title, paper.name, chapter.title, chapter.description].join(" ").toLocaleLowerCase();
    return (!query || haystack.includes(query))
      && (els.chapter.value === "all" || paper.chapter === els.chapter.value)
      && (els.window.value === "all" || withinDays(paper.added_at, els.window.value))
      && (els.source.value === "all" || paper.sources.includes(els.source.value))
      && (!els.code.checked || Boolean(paper.code_url));
  });
  const sorters = {
    added: (a, b) => b.added_at.localeCompare(a.added_at) || (b.published_at || "").localeCompare(a.published_at || ""),
    published: (a, b) => (b.published_at || "").localeCompare(a.published_at || "") || a.title.localeCompare(b.title),
    title: (a, b) => a.title.localeCompare(b.title),
  };
  return rows.sort(sorters[els.sort.value]);
}

function setCellLabel(cell, label) {
  cell.dataset.label = label;
  return cell;
}

function renderRows(rows) {
  els.rows.replaceChildren();
  if (!rows.length) {
    const row = document.createElement("tr");
    const cell = document.createElement("td");
    cell.colSpan = 5;
    cell.className = "empty-state";
    cell.textContent = "No papers match these filters.";
    row.appendChild(cell);
    els.rows.appendChild(row);
    return;
  }
  rows.forEach((paper) => {
    const row = document.createElement("tr");
    const published = setCellLabel(document.createElement("td"), "Published");
    published.textContent = paper.published_at || "n.d.";
    const chapter = setCellLabel(document.createElement("td"), "Survey chapter");
    const chapterLabel = document.createElement("span");
    chapterLabel.className = "chapter-label";
    chapterLabel.textContent = chapterFor(paper).title;
    chapter.appendChild(chapterLabel);
    const title = setCellLabel(document.createElement("td"), "Paper");
    title.className = "paper-title";
    title.appendChild(makeLink(paper.title, paper.paper_url || paper.code_url));
    if (paper.name && paper.name !== paper.title) {
      const project = document.createElement("span");
      project.className = "paper-meta";
      project.textContent = paper.name;
      title.appendChild(project);
    }
    const added = setCellLabel(document.createElement("td"), "Added");
    added.textContent = paper.added_at;
    const links = setCellLabel(document.createElement("td"), "Links");
    links.className = "paper-links";
    if (paper.paper_url) links.appendChild(makeLink("Paper", paper.paper_url));
    if (paper.code_url && paper.code_url !== paper.paper_url) links.appendChild(makeLink("Code", paper.code_url));
    row.append(published, chapter, title, added, links);
    els.rows.appendChild(row);
  });
}

function updateCatalog() {
  const rows = filteredPapers();
  const pageSize = Number(els.pageSize.value);
  const pageCount = Math.max(1, Math.ceil(rows.length / pageSize));
  currentPage = Math.min(Math.max(1, currentPage), pageCount);
  const start = (currentPage - 1) * pageSize;
  renderRows(rows.slice(start, start + pageSize));
  els.matched.textContent = String(rows.length);
  els.pageSummary.textContent = rows.length ? `Showing ${start + 1}–${Math.min(start + pageSize, rows.length)} of ${rows.length} papers` : "Showing 0 papers";
  els.pageIndicator.textContent = `Page ${currentPage} of ${pageCount}`;
  els.previous.disabled = currentPage === 1;
  els.next.disabled = currentPage === pageCount;
  syncUrl();
}

function restoreHashPosition() {
  const target = window.location.hash && document.querySelector(window.location.hash);
  if (target) target.scrollIntoView();
}

function init() {
  chapters.forEach((chapter) => {
    const option = document.createElement("option");
    option.value = chapter.key;
    option.textContent = chapter.title;
    els.chapter.appendChild(option);
  });
  stateFromUrl();
  const recent = recentPapers();
  els.heroPapers.textContent = String(papers.length);
  els.heroRecent.textContent = String(recent.length);
  els.heroChapters.textContent = String(chapters.length);
  els.recentDays.textContent = String(meta.recent_days);
  els.snapshot.textContent = meta.generated_at;
  els.total.textContent = String(papers.length);
  els.recentLink.href = `?window=${meta.recent_days}#papers`;
  renderRecent();
  renderChapters();
  updateCatalog();
  requestAnimationFrame(restoreHashPosition);
  window.addEventListener("load", restoreHashPosition, { once: true });
  window.addEventListener("hashchange", () => requestAnimationFrame(restoreHashPosition));

  [els.search, els.chapter, els.window, els.source, els.sort, els.code, els.pageSize].forEach((control) => {
    control.addEventListener(control === els.search ? "input" : "change", () => {
      currentPage = 1;
      updateCatalog();
    });
  });
  els.filters.addEventListener("reset", () => requestAnimationFrame(() => { currentPage = 1; updateCatalog(); }));
  els.previous.addEventListener("click", () => { currentPage -= 1; updateCatalog(); document.querySelector("#papers").scrollIntoView(); });
  els.next.addEventListener("click", () => { currentPage += 1; updateCatalog(); document.querySelector("#papers").scrollIntoView(); });
  window.addEventListener("scroll", () => {
    const max = document.documentElement.scrollHeight - window.innerHeight;
    els.progress.style.transform = `scaleX(${max > 0 ? window.scrollY / max : 0})`;
  }, { passive: true });
}

init();
