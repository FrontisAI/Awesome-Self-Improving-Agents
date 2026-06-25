import fs from "node:fs";
import path from "node:path";

const repoRoot = path.resolve(".");
const surveyRoot = "/Users/mac_jc/大学2/ZBW/Agent_survey_Frontis";
const latexRoot = path.join(surveyRoot, "RL4LRM_Survey_0907");
const latexBibPath = path.join(latexRoot, "survey.bib");

const categories = [
  ["foundations", "Foundations and Surveys"],
  ["harness", "Harness and Runtime Architecture"],
  ["skills", "Skills and Skill Libraries"],
  ["memory", "Memory and Context Management"],
  ["environment", "Environments, Tools, and Runtime Feedback"],
  ["agentrl", "Agent RL and Continual Learning"],
  ["meta", "Meta-Agents and Evolution Orchestration"],
  ["evaluation", "Evaluation and Benchmarks"],
  ["safety", "Safety and Governance"],
];

const categoryNames = new Map(categories.map(([id, name]) => [id, name]));

function readText(file) {
  return fs.readFileSync(file, "utf8");
}

function listFiles(dir, predicate) {
  const out = [];
  for (const name of fs.readdirSync(dir)) {
    const full = path.join(dir, name);
    const stat = fs.statSync(full);
    if (stat.isDirectory()) out.push(...listFiles(full, predicate));
    else if (predicate(full)) out.push(full);
  }
  return out;
}

function cleanLatex(value) {
  if (!value) return "";
  return value
    .replace(/\r/g, "")
    .replace(/\n\s*/g, " ")
    .replace(/\\&/g, "&")
    .replace(/\\_/g, "_")
    .replace(/\\%/g, "%")
    .replace(/\\\$/g, "$")
    .replace(/\$\\tau\$/g, "tau")
    .replace(/\$\\\^\\star\$/g, "*")
    .replace(/\$\\\^\\{?\\star\\}?\$/g, "*")
    .replace(/\$([^$]+)\$/g, "$1")
    .replace(/\\[a-zA-Z]+\*?(?:\[[^\]]*\])?(?:\{([^{}]*)\})?/g, (_, inner) => inner || "")
    .replace(/[{}]/g, "")
    .replace(/---/g, "--")
    .replace(/``|''/g, '"')
    .replace(/\s+/g, " ")
    .trim();
}

function normalizeTitle(title) {
  return cleanLatex(title)
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, " ")
    .trim();
}

function monthNumber(raw) {
  const cleaned = cleanLatex(raw).toLowerCase();
  const numeric = cleaned.match(/\b(0?[1-9]|1[0-2])\b/);
  if (numeric) return numeric[1].padStart(2, "0");
  const month = cleaned.slice(0, 3);
  const map = {
    jan: "01",
    feb: "02",
    mar: "03",
    apr: "04",
    may: "05",
    jun: "06",
    jul: "07",
    aug: "08",
    sep: "09",
    oct: "10",
    nov: "11",
    dec: "12",
  };
  return map[month] || "";
}

const openReviewYearMonth = new Map([
  ["WrgtPmUNtn", "2026-03"],
  ["eC4ygDs02R", "2026-01"],
  ["xf2JC4531b", "2025-09"],
  ["wtLyksjIdl", "2025-09"],
  ["6QUNblHtto", "2025-09"],
  ["TPXVdBjrvU", "2025-09"],
  ["0pFcKF2li1", "2025-09"],
  ["vnEuxLVFmN", "2025-09"],
  ["S1cIE9pe3k", "2025-09"],
  ["MSXbrNExax", "2026-03"],
  ["fugnQxbvMm", "2026-01"],
  ["hwwn9hAAo5", "2025-09"],
  ["5298fKGmv3", "2025-03"],
  ["pEGnJbmSUy", "2025-09"],
  ["1UFcZrQp5w", "2025-09"],
  ["WSkU78RTGC", "2025-09"],
  ["U7n8gZGyAu", "2025-09"],
  ["AEgyitdRWf", "2025-09"],
  ["mfIbSouoaZ", "2026-01"],
  ["F8a6dAw3Yg", "2025-09"],
  ["cf7qpBwttr", "2026-01"],
  ["IljH2Bt6jO", "2025-09"],
  ["ueh4YWLX4n", "2025-09"],
  ["HSWE9aceZb", "2025-09"],
  ["7JT8yIPELM", "2025-09"],
  ["GQugc1J2kW", "2025-09"],
  ["ZdGB7MNQDT", "2026-01"],
  ["1YcMHVY9cl", "2025-09"],
  ["9gw03JpKK4", "2026-01"],
  ["dCBF23RZYJ", "2026-03"],
  ["wQ4OykcxaV", "2026-01"],
  ["qRGKHBE5RY", "2025-09"],
  ["IyIaAOihmZ", "2026-01"],
  ["plIRiWr6lO", "2025-09"],
  ["QVX6hcJ2um", "2025-09"],
]);

function normalizeYearMonth(raw) {
  const value = cleanLatex(raw);
  if (!value || value === "-") return "";

  const numeric = value.match(/\b(19|20)\d{2}[-/.](0?[1-9]|1[0-2])\b/);
  if (numeric) {
    const [year, month] = numeric[0].split(/[-/.]/);
    return `${year}-${month.padStart(2, "0")}`;
  }

  const yearMonthName = value.match(/\b(19|20)\d{2}\s+([A-Za-z]{3,9})\b/);
  if (yearMonthName) {
    const month = monthNumber(yearMonthName[2]);
    if (month) return `${yearMonthName[0].slice(0, 4)}-${month}`;
  }

  const monthNameYear = value.match(/\b([A-Za-z]{3,9})\s+(19|20)\d{2}\b/);
  if (monthNameYear) {
    const month = monthNumber(monthNameYear[1]);
    const year = monthNameYear[0].match(/\d{4}/)?.[0] || "";
    if (year && month) return `${year}-${month}`;
  }

  const monthDayYear = value.match(/\b([A-Za-z]{3,9})\s+\d{1,2},?\s+((?:19|20)\d{2})\b/);
  if (monthDayYear) {
    const month = monthNumber(monthDayYear[1]);
    if (month) return `${monthDayYear[2]}-${month}`;
  }

  return "";
}

function arxivYearMonth(raw) {
  const value = cleanLatex(raw);
  const modern = value.match(/(?:arxiv\.org\/(?:abs|pdf)\/|arXiv:)?(\d{2})(0[1-9]|1[0-2])\.\d{4,5}/i);
  if (!modern) return "";
  const yearPrefix = Number(modern[1]) >= 90 ? "19" : "20";
  return `${yearPrefix}${modern[1]}-${modern[2]}`;
}

function urlYearMonth(raw) {
  const value = cleanLatex(raw);
  if (!value) return "";

  const explicit = normalizeYearMonth(value);
  if (explicit) return explicit;

  const compact = value.match(/\b(20\d{2})(0[1-9]|1[0-2])\b/);
  if (compact) return `${compact[1]}-${compact[2]}`;

  return "";
}

function inferYearMonthFromText(...parts) {
  for (const part of parts) {
    const normalized = normalizeYearMonth(part);
    if (normalized) return normalized;
  }
  for (const part of parts) {
    const openReviewId = cleanLatex(part).match(/openreview\.net\/forum\?id=([^&#\s)]+)/i)?.[1];
    if (openReviewId && openReviewYearMonth.has(openReviewId)) return openReviewYearMonth.get(openReviewId);
  }
  for (const part of parts) {
    const arxiv = arxivYearMonth(part);
    if (arxiv) return arxiv;
  }
  for (const part of parts) {
    const urlDate = urlYearMonth(part);
    if (urlDate) return urlDate;
  }
  return "";
}

function formatDate(fields) {
  const explicit = inferYearMonthFromText(fields.date || "", fields.month || "");
  if (explicit) return explicit;

  const year = cleanLatex(fields.year || "");
  const month = monthNumber(fields.month || "");
  if (year && month) return `${year}-${month}`;

  const inferred = inferYearMonthFromText(
    fields.eprint || "",
    fields.url || "",
    fields.doi || "",
    fields.note || "",
    fields.howpublished || ""
  );
  if (inferred) return inferred;

  return year ? `${year}-01` : "-";
}

function badge(label, color, url, logo = "") {
  const logoPart = logo ? `&logo=${logo}&logoColor=white` : "";
  return `[![${label}](https://img.shields.io/badge/${encodeURIComponent(label)}-${color}?style=for-the-badge${logoPart})](${url})`;
}

function paperBadge(url) {
  if (!url) return "-";
  const lower = url.toLowerCase();
  if (lower.includes("github.com")) return badge("Repo", "000000", url, "github");
  if (lower.includes("openreview.net")) return badge("OpenReview", "8A2BE2", url);
  if (lower.includes("anthropic.com") || lower.includes("openai.com") || lower.includes("deepmind.google") || lower.includes("martinfowler.com") || lower.includes("blog")) {
    return badge("Blog", "1F4E79", url);
  }
  return badge("Paper", "A42C25", url, "arxiv");
}

function githubBadge(url) {
  if (!url) return "-";
  const match = url.match(/^https?:\/\/github\.com\/([^/\s]+\/[^/#?\s]+)/i);
  if (!match) return "-";
  const repo = match[1].replace(/\.git$/, "");
  return `[![GitHub Stars](https://img.shields.io/github/stars/${repo}?style=for-the-badge&logo=github&label=GitHub&color=black)](${url})`;
}

function readBalanced(text, start) {
  const opener = text[start];
  if (opener === "{") {
    let depth = 0;
    for (let i = start; i < text.length; i++) {
      const char = text[i];
      if (char === "{" && text[i - 1] !== "\\") depth++;
      if (char === "}" && text[i - 1] !== "\\") depth--;
      if (depth === 0) return [text.slice(start + 1, i), i + 1];
    }
  }
  if (opener === '"') {
    for (let i = start + 1; i < text.length; i++) {
      if (text[i] === '"' && text[i - 1] !== "\\") return [text.slice(start + 1, i), i + 1];
    }
  }
  let end = start;
  while (end < text.length && text[end] !== ",") end++;
  return [text.slice(start, end).trim(), end];
}

function parseBib(text) {
  const entries = [];
  let cursor = 0;
  while (true) {
    const at = text.indexOf("@", cursor);
    if (at === -1) break;
    const head = text.slice(at).match(/^@([A-Za-z]+)\s*\{\s*([^,\s]+)\s*,/);
    if (!head) {
      cursor = at + 1;
      continue;
    }
    const type = head[1].toLowerCase();
    const key = head[2].trim();
    const bodyStart = at + head[0].length;
    let depth = 1;
    let end = bodyStart;
    for (; end < text.length; end++) {
      if (text[end] === "{" && text[end - 1] !== "\\") depth++;
      if (text[end] === "}" && text[end - 1] !== "\\") depth--;
      if (depth === 0) break;
    }
    const body = text.slice(bodyStart, end);
    const fields = {};
    let i = 0;
    while (i < body.length) {
      while (i < body.length && /[\s,]/.test(body[i])) i++;
      const nameMatch = body.slice(i).match(/^([A-Za-z][A-Za-z0-9_-]*)\s*=/);
      if (!nameMatch) {
        i++;
        continue;
      }
      const name = nameMatch[1].toLowerCase();
      i += nameMatch[0].length;
      while (i < body.length && /\s/.test(body[i])) i++;
      const [rawValue, next] = readBalanced(body, i);
      fields[name] = rawValue.trim();
      i = next;
    }
    entries.push({ type, key, fields });
    cursor = end + 1;
  }
  return entries;
}

function mergeBibEntries(primaryEntries, fallbackEntries) {
  const byKey = new Map();
  for (const entry of fallbackEntries) {
    byKey.set(entry.key, { ...entry, bibSource: "survey.bib" });
  }
  for (const entry of primaryEntries) {
    byKey.set(entry.key, { ...entry, bibSource: "papers.bib" });
  }
  return [...byKey.values()];
}

function citedKeys() {
  const keys = new Set();
  const texFiles = listFiles(latexRoot, (file) => file.endsWith(".tex"));
  const citePattern = /\\(?:no)?cite[a-zA-Z]*\s*(?:\[[^\]]*\]\s*){0,2}\{([^}]+)\}/g;
  for (const file of texFiles) {
    const text = readText(file);
    for (const match of text.matchAll(citePattern)) {
      for (const key of match[1].split(",")) {
        const trimmed = key.trim();
        if (trimmed) keys.add(trimmed);
      }
    }
  }
  return keys;
}

function inferName(title, fallbackKey = "") {
  const clean = cleanLatex(title);
  const colon = clean.match(/^([A-Za-z0-9][A-Za-z0-9+_.\- /]{1,34}):/);
  if (colon) return colon[1].trim();
  const braceLike = clean.match(/^([A-Z][A-Za-z0-9_.\-]{1,24})\b/);
  if (braceLike && /^[A-Z0-9_.-]+$/.test(braceLike[1])) return braceLike[1];
  return fallbackKey || clean.split(/\s+/).slice(0, 3).join(" ");
}

function linkForEntry(entry) {
  const fields = entry.fields;
  const url = cleanLatex(fields.url || "");
  const doi = cleanLatex(fields.doi || "");
  const eprint = cleanLatex(fields.eprint || "");
  if (url) return url;
  if (eprint) return `https://arxiv.org/abs/${eprint}`;
  if (doi) return `https://doi.org/${doi}`;
  const fieldText = Object.values(fields).map(cleanLatex).join(" ");
  const arxiv = fieldText.match(/\barXiv(?::\s*|\s+preprint\s+arXiv:?\s*)(\d{4}\.\d{4,5}(?:v\d+)?)/i);
  if (arxiv) return `https://arxiv.org/abs/${arxiv[1]}`;
  return "";
}

function githubForEntry(entry) {
  const fields = entry.fields;
  for (const field of ["github", "code", "repository"]) {
    const value = cleanLatex(fields[field] || "");
    if (value.includes("github.com")) return value;
  }
  const note = cleanLatex(fields.note || "");
  const noteUrl = note.match(/https?:\/\/github\.com\/[^\s,)]+/i);
  if (noteUrl) return noteUrl[0];
  const url = cleanLatex(fields.url || "");
  if (url.includes("github.com")) return url;
  return "";
}

function hasAny(text, needles) {
  return needles.some((needle) => text.includes(needle));
}

function inferCategory(entry) {
  const title = cleanLatex(entry.fields.title || "");
  const hay = `${entry.key} ${title} ${cleanLatex(entry.fields.keywords || "")} ${cleanLatex(entry.fields.note || "")} ${cleanLatex(entry.fields.url || "")}`.toLowerCase();

  const manualCategory = [
    ["welcome to the era of experience", "foundations"],
    ["large language model based autonomous agents", "foundations"],
    ["the rise and potential of large language model based agents", "foundations"],
    ["ai agent systems: architectures", "foundations"],
    ["a comprehensive survey of self-evolving ai agents", "foundations"],
    ["a survey of self-evolving agents", "foundations"],
    ["a survey on self-evolution of large language models", "foundations"],
    ["from standalone llms to integrated intelligence", "foundations"],
    ["cursor2026composer2", "harness"],
    ["introducing codex", "harness"],
    ["agentless: demystifying", "harness"],
    ["retroagent", "meta"],
    ["swe-smith", "agentrl"],
    ["federated learning", "agentrl"],
    ["federated optimization", "agentrl"],
    ["communication-efficient learning", "agentrl"],
    ["mm-react", "environment"],
    ["the dream within huang long cave", "environment"],
    ["deepseek-vl", "environment"],
    ["vision-language-action models for robotic", "environment"],
  ];
  const override = manualCategory.find(([needle]) => hay.includes(needle));
  if (override) return override[1];

  const strongSafety = [
    "safety", "security", "secure", "attack", "jailbreak", "red-team", "red team",
    "prompt injection", "poison", "privacy", "governance", "guardrail", "risk",
    "alignment", "defense", "defence", "vulnerab", "least-privilege", "permission",
    "trustworthy", "misalignment", "integrity verification", "supply-chain",
  ];
  const strongMeta = [
    "meta-evo-agent", "meta-agent", "meta agent", "metaevo", "meta-layer",
    "agentfactory", "agent factory", "hyperagents", "autogenesis",
    "agentic evolution", "agents design agents", "automated design of agent",
    "multi-agent architecture search", "agentic supernet", "agent generation",
    "workflow generation", "flowreasoner", "aflow", "graphplanner",
    "evolving orchestration", "manager agent", "agents to optimize agents",
    "agent0", "alphaevolve", "automated multi-agent pipeline",
    "open-ended embodied agent", "self-evolving agent protocol",
  ];
  const skillTerms = [
    "skill-lifecycle", "skill library", "skill bank", "skill graph", "skill retrieval",
    "skillrae", "skillret", "skillrl", "skillnet", "skillrouter", "skillsbench",
    "procedural memory", "agentic skills", "skill.md", "module repositor",
    "toolformer",
  ];
  const memoryTerms = [
    "memory", "memgpt", "long-term", "episodic", "retrieval", "context compression",
    "working memory", "memory-augmented", "memory extraction", "memory steering",
    "forgetting", "rag", "persistent state", "context management", "long context",
  ];
  const agentRlTerms = [
    "agent-rl", "continual-learning", "continual learning", "reinforcement learning",
    "policy optimization", "parameter-path", "parameter path", "post-training",
    "fine-tun", "distillation", "self-play", "verifiable reward", "model parameters",
    "rlhf", "trajectory training", "agent training", " real-time rl", "realtimerl",
    "-rl", " r1", "reinforcing", "reward", "policy", "on-policy", "off-policy",
    "agentless training", "rl from", "skill prior", "train any agent",
  ];
  const environmentTerms = [
    "ch08", "execution-harness", "execution-environment", "environment", "webarena",
    "visualwebarena", "workarena", "browsergym", "osworld", "appworld", "alfworld",
    "alfred", "swe-gym", "terminal-bench", "mle-dojo", "sandmle", "cli-anything",
    "computer use", "gui", "browser", "web agent", "web agents", "sandbox",
    "simulat", "world model", "mcp", "a2a", "api", "protocol", "tool registry",
    "tool use", "tool-use", "tool-using", "tools", "tool learning", "openclaw",
    "workspace cli", "cradle", "software agent-native", "command line",
  ];
  const evaluationTerms = [
    "ch06", "evaluation", "evaluating", "benchmark", "bench", "leaderboard", "assess",
    "metric", "diagnostic", "reliability", "contamination", "evidence",
    "minimal requirement", "longitudinal", "score interpretation", "competition",
    "dashboard", "registry", "testable property", "agentified agent assessment",
  ];
  const harnessTerms = [
    "ch01", "agent-definition", "harness", "runtime", "context engineering",
    "workflow", "compound ai", "agent system", "agent systems", "architecture",
    "framework", "aios", "managed agents", "agent scope", "agentic ai framework",
    "orchestration framework", "era of experience",
  ];

  if (hasAny(hay, strongSafety)) return "safety";
  if (hasAny(hay, strongMeta)) return "meta";

  // Chapter tags from the manuscript are the strongest signal once safety/meta
  // overrides have been handled. They keep the Awesome list aligned with the
  // survey's object-of-improvement structure.
  if (hasAny(hay, ["ch02", "skill-lifecycle"])) return "skills";
  if (hasAny(hay, ["ch04"])) return "memory";
  if (hasAny(hay, ["ch03"])) return "agentrl";
  if (hasAny(hay, ["ch08"])) return "environment";
  if (hasAny(hay, ["ch06"])) return "evaluation";
  if (hasAny(hay, ["ch07"])) return "safety";

  if (hasAny(hay, memoryTerms)) return "memory";
  if (hasAny(hay, agentRlTerms)) return "agentrl";
  if (hasAny(hay, skillTerms)) return "skills";
  if (hasAny(hay, environmentTerms)) return "environment";
  if (hasAny(hay, evaluationTerms)) return "evaluation";
  if (hasAny(hay, harnessTerms)) return "harness";

  if (hasAny(hay, ["survey", "foundation", "paradigm", "autonomous agents", "large language model based agents"])) return "foundations";
  return "foundations";
}

function sortDateValue(date) {
  if (!date || date === "-") return "0000-00";
  if (/^\d{4}$/.test(date)) return `${date}-00`;
  if (/^\d{4}-\d{2}$/.test(date)) return date;
  return "0000-00";
}

function makeRow(item) {
  const name = item.name ? `\`${item.name.replace(/`/g, "")}\`` : "-";
  const paper = item.paperUrl ? paperBadge(item.paperUrl) : "-";
  const github = item.githubUrl ? githubBadge(item.githubUrl) : "-";
  const title = item.title.replace(/\|/g, "\\|");
  return `| ${item.date || "-"} | ${name} | ${title} | ${paper} | ${github} |`;
}

function buildItems() {
  const bibPath = path.join(repoRoot, "papers.bib");
  const primaryEntries = parseBib(readText(bibPath));
  const fallbackEntries = fs.existsSync(latexBibPath) ? parseBib(readText(latexBibPath)) : [];
  const entries = mergeBibEntries(primaryEntries, fallbackEntries);
  const citations = citedKeys();
  const seen = { title: new Set(), url: new Set() };
  const items = [];
  const bibKeys = new Set(entries.map((entry) => entry.key));
  const missingCitations = [...citations].filter((key) => !bibKeys.has(key)).sort();
  let skippedNoSource = 0;
  let skippedUncited = 0;
  let duplicateCited = 0;

  for (const entry of entries) {
    if (!citations.has(entry.key)) {
      skippedUncited++;
      continue;
    }
    const title = cleanLatex(entry.fields.title || entry.key);
    const titleKey = normalizeTitle(title);
    const paperUrl = linkForEntry(entry);
    const githubUrl = githubForEntry(entry);
    if (!paperUrl && !githubUrl) {
      skippedNoSource++;
      continue;
    }
    const urlKey = paperUrl.toLowerCase();
    const duplicate = seen.title.has(titleKey) || (urlKey && seen.url.has(urlKey));
    if (duplicate) {
      duplicateCited++;
      continue;
    }
    seen.title.add(titleKey);
    if (urlKey) seen.url.add(urlKey);
    items.push({
      category: inferCategory(entry),
      date: formatDate(entry.fields),
      name: inferName(title, entry.key),
      title,
      paperUrl,
      githubUrl,
      source: entry.bibSource,
      key: entry.key,
    });
  }

  return {
    items,
    bibCount: primaryEntries.length,
    latexBibCount: fallbackEntries.length,
    citedCount: citations.size,
    citedBibCount: entries.length - skippedUncited,
    duplicateCited,
    missingCitations,
    skippedNoSource,
  };
}

function renderPaperList() {
  const { items, bibCount, latexBibCount, citedCount, citedBibCount, duplicateCited, missingCitations, skippedNoSource } = buildItems();
  const grouped = new Map(categories.map(([id]) => [id, []]));
  for (const item of items) grouped.get(item.category)?.push(item);

  for (const group of grouped.values()) {
    group.sort((a, b) => {
      const dateDiff = sortDateValue(b.date).localeCompare(sortDateValue(a.date));
      if (dateDiff) return dateDiff;
      return a.title.localeCompare(b.title);
    });
  }

  const lines = [];
  lines.push("## Paper List");
  lines.push("");
  lines.push(`This section is generated from cited BibTeX entries, using \`papers.bib\` first and the LaTeX manuscript's \`survey.bib\` to fill citation-key gaps. It currently includes **${items.length} unique cited entries** from ${citedCount} unique manuscript citation keys and ${citedBibCount} cited BibTeX records.`);
  lines.push("");
  lines.push(`Every row includes a date, display name, title, and at least one public source badge. Cited entries whose public source URL still needs verification are kept in the BibTeX sources but omitted from this table until complete metadata is available (${skippedNoSource} currently omitted; ${duplicateCited} duplicate cited records collapsed; ${missingCitations.length} cited keys not found after merging ${bibCount} README records with ${latexBibCount} LaTeX records).`);
  lines.push("");

  for (const [id, name] of categories) {
    const group = grouped.get(id) || [];
    lines.push(`### ${name}`);
    lines.push("");
    lines.push("| Date | Name | Title | Paper | Github |");
    lines.push("|:-:|:-:|:-|:-:|:-:|");
    for (const item of group) lines.push(makeRow(item));
    if (!group.length) lines.push("| - | - | - | - | - |");
    lines.push("");
  }

  return lines.join("\n").trimEnd() + "\n";
}

function updateReadme() {
  const readmePath = path.join(repoRoot, "README.md");
  const readme = readText(readmePath);
  const start = readme.indexOf("## Paper List");
  const endCandidates = ["## Figures", "## Acknowledgment"]
    .map((heading) => readme.indexOf(heading))
    .filter((index) => index !== -1 && index > start)
    .sort((a, b) => a - b);
  const end = endCandidates[0] ?? -1;
  if (start === -1 || end === -1 || end <= start) {
    throw new Error("Could not locate README Paper List section boundaries.");
  }
  const next = `${readme.slice(0, start)}${renderPaperList()}\n${readme.slice(end)}`;
  fs.writeFileSync(readmePath, next);
}

updateReadme();
