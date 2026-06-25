const papers = Array.isArray(window.SURVEY_PAPERS) ? window.SURVEY_PAPERS : [];
const manuscript = window.MANUSCRIPT || { title: "", abstract: "", parts: [] };
const siteTitle = "Agents in the Era of Experience";

const els = {
  brandTitle: document.querySelector("#brand-title"),
  heroTitle: document.querySelector("#hero-title"),
  heroAbstract: document.querySelector("#hero-abstract"),
  statParts: document.querySelector("#stat-parts"),
  statSections: document.querySelector("#stat-sections"),
  structure: document.querySelector("#manuscript-structure"),
  body: document.querySelector("#paper-table-body"),
  search: document.querySelector("#paper-search"),
  chapter: document.querySelector("#chapter-filter"),
  phase: document.querySelector("#phase-filter"),
  reset: document.querySelector("#reset-filters"),
  visible: document.querySelector("#visible-count"),
  total: document.querySelector("#total-count"),
  statPapers: document.querySelector("#stat-papers"),
  pageSummary: document.querySelector("#page-summary"),
  pageSize: document.querySelector("#page-size"),
  pageIndicator: document.querySelector("#page-indicator"),
  prevPage: document.querySelector("#prev-page"),
  nextPage: document.querySelector("#next-page"),
};

let currentCatalogPage = 1;
let rowsPerPage = Number(els.pageSize?.value || 50);

function scrollToPageTarget(targetId, behavior = "smooth") {
  const destination = targetId ? document.getElementById(targetId) : null;
  if (!destination) return;

  const headerHeight = document.querySelector(".site-header")?.offsetHeight || 0;
  const top = destination.getBoundingClientRect().top + window.scrollY - headerHeight - 12;
  window.scrollTo({ top: Math.max(0, top), behavior });
}

function scrollToCurrentHash() {
  const targetId = decodeURIComponent(window.location.hash.replace(/^#/, ""));
  if (targetId) scrollToPageTarget(targetId, "auto");
}

function restoreHashScrollAfterLayout() {
  if (!window.location.hash) return;
  requestAnimationFrame(scrollToCurrentHash);
  window.addEventListener("load", () => {
    scrollToCurrentHash();
    window.setTimeout(scrollToCurrentHash, 250);
    window.setTimeout(scrollToCurrentHash, 900);
  }, { once: true });
}

function uniqueSorted(values) {
  return [...new Set(values.filter(Boolean))].sort((a, b) => a.localeCompare(b));
}

function option(value, label) {
  const opt = document.createElement("option");
  opt.value = value;
  opt.textContent = label;
  return opt;
}

function splitChapters(paper) {
  return rolesFor(paper).map((role) => role.chapter);
}

function rolesFor(paper) {
  if (Array.isArray(paper.roles) && paper.roles.length) {
    return paper.roles;
  }
  return [{
    chapter: paper.chapter || "Unassigned",
    phase: paper.phase || "Unassigned",
    chapterKey: paper.chapterKey || "",
  }];
}

function populateFilters() {
  chapterOptions().forEach((chapter) => {
    els.chapter.appendChild(option(chapter, chapter));
  });

  populatePhaseFilter();
}

function chapterOptions() {
  const chapters = new Map();
  papers.flatMap(rolesFor).forEach((role) => {
    const order = Number(role.chapterOrder || 999);
    if (!chapters.has(role.chapter) || order < chapters.get(role.chapter)) {
      chapters.set(role.chapter, order);
    }
  });
  return [...chapters.entries()]
    .sort((a, b) => a[1] - b[1] || a[0].localeCompare(b[0]))
    .map(([chapter]) => chapter);
}

function countSections() {
  return manuscript.parts.reduce((total, part) => total + part.sections.length, 0);
}

function paperChapterCount() {
  return chapterOptions().length || countSections();
}

function manuscriptSections() {
  return manuscript.parts.flatMap((part) => (
    part.sections.map((section) => ({ ...section, partTitle: part.title }))
  ));
}

function renderManuscriptStructure() {
  if (!els.structure || !Array.isArray(manuscript.parts)) return;
  els.structure.replaceChildren();

  manuscriptSections().forEach((section) => {
    const sectionCard = document.createElement("article");
    sectionCard.className = "part-card manuscript-section-card";

    const partLabel = document.createElement("span");
    partLabel.className = "part-label";
    partLabel.textContent = section.partTitle;
    sectionCard.appendChild(partLabel);

    const title = document.createElement("h3");
    title.textContent = section.title;
    sectionCard.appendChild(title);

    const list = document.createElement("div");
    list.className = "section-list";

    if (Array.isArray(section.subsections) && section.subsections.length) {
      const subList = document.createElement("ul");
      section.subsections.forEach((subsection) => {
        const item = document.createElement("li");
        item.textContent = subsection.title;
        subList.appendChild(item);
      });
      list.appendChild(subList);
    }

    sectionCard.appendChild(list);
    els.structure.appendChild(sectionCard);
  });
}

function populateManuscriptText() {
  document.title = siteTitle;
  if (els.brandTitle) els.brandTitle.textContent = siteTitle;
  if (manuscript.title) {
    if (els.heroTitle) els.heroTitle.textContent = manuscript.title;
  }
  if (manuscript.abstract && els.heroAbstract) {
    els.heroAbstract.textContent = manuscript.abstract;
  }
  if (els.statParts) els.statParts.textContent = String(paperChapterCount());
  if (els.statSections) els.statSections.textContent = String(countSections());
  renderManuscriptStructure();
}

function phasesForSelectedChapter() {
  const chapter = els.chapter.value;
  const roles = papers.flatMap((paper) => rolesFor(paper));
  const scoped = chapter === "all"
    ? roles
    : roles.filter((role) => role.chapter === chapter);
  return uniqueSorted(scoped.map((role) => role.phase));
}

function populatePhaseFilter() {
  const current = els.phase.value;
  const phases = phasesForSelectedChapter();
  els.phase.replaceChildren(option("all", "All phases"));

  phases.forEach((phase) => {
    els.phase.appendChild(option(phase, phase));
  });

  els.phase.value = phases.includes(current) ? current : "all";
}

function textForSearch(paper) {
  return [
    paper.title,
    paper.authors,
    paper.chapter,
    paper.phase,
    rolesFor(paper).map((role) => `${role.chapter} ${role.phase}`).join(" "),
    paper.category,
    paper.family,
    paper.signal,
    paper.benchmark,
  ]
    .join(" ")
    .toLowerCase();
}

function filteredPapers() {
  const query = els.search.value.trim().toLowerCase();
  const chapter = els.chapter.value;
  const phase = els.phase.value;

  return papers.filter((paper) => {
    const matchesQuery = !query || textForSearch(paper).includes(query);
    const matchesRole = rolesFor(paper).some((role) => {
      const matchesChapter = chapter === "all" || role.chapter === chapter;
      const matchesPhase = phase === "all" || role.phase === phase;
      return matchesChapter && matchesPhase;
    });
    return matchesQuery && matchesRole;
  });
}

function paperSignal(paper) {
  return paper.signal || paper.benchmark || paper.category || paper.family || "Catalog entry";
}

function roleForDisplay(paper) {
  const chapter = els.chapter.value;
  const phase = els.phase.value;
  const roles = rolesFor(paper);

  return roles.find((role) => (
    (chapter === "all" || role.chapter === chapter)
    && (phase === "all" || role.phase === phase)
  )) || roles[0];
}

function setCellLabel(cell, label) {
  cell.dataset.label = label;
  return cell;
}

function pageCountFor(total) {
  return Math.max(1, Math.ceil(total / rowsPerPage));
}

function paginatedRows(rows) {
  const pageCount = pageCountFor(rows.length);
  currentCatalogPage = Math.min(Math.max(1, currentCatalogPage), pageCount);
  const start = (currentCatalogPage - 1) * rowsPerPage;
  return rows.slice(start, start + rowsPerPage);
}

function updatePagination(total) {
  const pageCount = pageCountFor(total);
  const start = total ? (currentCatalogPage - 1) * rowsPerPage + 1 : 0;
  const end = total ? Math.min(total, currentCatalogPage * rowsPerPage) : 0;

  if (els.pageSummary) {
    els.pageSummary.textContent = `Showing ${start}-${end} of ${total} papers`;
  }
  if (els.pageIndicator) {
    els.pageIndicator.textContent = `Page ${currentCatalogPage} of ${pageCount}`;
  }
  if (els.prevPage) {
    els.prevPage.disabled = currentCatalogPage <= 1;
  }
  if (els.nextPage) {
    els.nextPage.disabled = currentCatalogPage >= pageCount;
  }
}

function renderRows(rows) {
  els.body.replaceChildren();

  if (!rows.length) {
    const tr = document.createElement("tr");
    const td = document.createElement("td");
    td.colSpan = 5;
    td.className = "empty-state";
    td.textContent = "No papers match the current filters.";
    tr.appendChild(td);
    els.body.appendChild(tr);
    return;
  }

  rows.forEach((paper) => {
    const tr = document.createElement("tr");
    const displayRole = roleForDisplay(paper);

    const date = document.createElement("td");
    date.className = "paper-date";
    setCellLabel(date, "Date");
    date.textContent = paper.date || "n.d.";

    const chapter = document.createElement("td");
    setCellLabel(chapter, "Chapter");
    const chapterPill = document.createElement("span");
    chapterPill.className = "chapter-pill";
    chapterPill.textContent = displayRole.chapter;
    chapter.appendChild(chapterPill);

    const title = document.createElement("td");
    setCellLabel(title, "Paper");
    const titleWrap = document.createElement("div");
    titleWrap.className = "paper-title-wrap";
    const titleLink = document.createElement(paper.url ? "a" : "span");
    titleLink.textContent = paper.title;
    if (paper.url) {
      titleLink.href = paper.url;
      titleLink.target = "_blank";
      titleLink.rel = "noreferrer";
    }
    const meta = document.createElement("span");
    meta.textContent = [paper.authors, paper.collection].filter(Boolean).join(" · ");
    titleWrap.append(titleLink, meta);
    title.appendChild(titleWrap);

    const phase = document.createElement("td");
    setCellLabel(phase, "Phase");
    phase.textContent = displayRole.phase || "Unassigned";

    const signal = document.createElement("td");
    setCellLabel(signal, "Signal");
    signal.textContent = paperSignal(paper);

    tr.append(date, chapter, title, phase, signal);
    els.body.appendChild(tr);
  });
}

function update() {
  const rows = filteredPapers();
  const pageRows = paginatedRows(rows);
  renderRows(pageRows);
  updatePagination(rows.length);
  els.visible.textContent = String(rows.length);
}

function init() {
  populateManuscriptText();
  els.total.textContent = String(papers.length);
  els.statPapers.textContent = String(papers.length);
  populateFilters();
  update();

  restoreHashScrollAfterLayout();
  window.addEventListener("hashchange", () => {
    requestAnimationFrame(scrollToCurrentHash);
    window.setTimeout(scrollToCurrentHash, 250);
  });

  els.search.addEventListener("input", () => {
    currentCatalogPage = 1;
    update();
  });
  els.phase.addEventListener("change", () => {
    currentCatalogPage = 1;
    update();
  });
  els.chapter.addEventListener("change", () => {
    currentCatalogPage = 1;
    populatePhaseFilter();
    update();
  });

  els.pageSize.addEventListener("change", () => {
    rowsPerPage = Number(els.pageSize.value || 50);
    currentCatalogPage = 1;
    update();
  });

  els.prevPage.addEventListener("click", () => {
    currentCatalogPage -= 1;
    update();
    scrollToPageTarget("papers");
  });

  els.nextPage.addEventListener("click", () => {
    currentCatalogPage += 1;
    update();
    scrollToPageTarget("papers");
  });

  els.reset.addEventListener("click", () => {
    els.search.value = "";
    els.chapter.value = "all";
    currentCatalogPage = 1;
    populatePhaseFilter();
    update();
  });
}

init();
