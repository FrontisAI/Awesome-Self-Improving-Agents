#!/usr/bin/env python3
"""Build the static paper catalog consumed by the survey companion site."""

from __future__ import annotations

import html
import json
import os
import re
import subprocess
from pathlib import Path


REPO_ROOT = Path(__file__).resolve().parents[2]
SITE_ROOT = REPO_ROOT
SOURCE_ROOT = Path(os.environ.get("AGENT_SURVEY_FRONTIS_ROOT", REPO_ROOT.parent / "Agent_survey_Frontis"))
MANUSCRIPT_ROOT = Path(os.environ.get("MANUSCRIPT_ROOT", SOURCE_ROOT / "RL4LRM_Survey_0907"))
AWESOME_README = Path(os.environ.get("AWESOME_README", REPO_ROOT / "README.md"))

CJK_RE = re.compile(r"[\u3400-\u9fff]")
HEADING_RE = re.compile(r"^\\(section|subsection|subsubsection|paragraph)\{(.+?)\}")
URL_RE = re.compile(r"\]\(([^)]+)\)")


def latex_headings() -> set[str]:
    headings: set[str] = set()
    for path in (MANUSCRIPT_ROOT / "sections").glob("*.tex"):
        for line in path.read_text(encoding="utf-8").splitlines():
            match = HEADING_RE.match(line.strip())
            if match:
                headings.add(match.group(2).strip())
    return headings


LATEX_HEADINGS = latex_headings()


def h(text: str) -> str:
    """Return an exact LaTeX heading, failing if it drifts from the manuscript."""
    if text not in LATEX_HEADINGS:
        raise ValueError(f"Heading is not present in LaTeX manuscript: {text}")
    return text


CH_FOUNDATIONS = h("Introduction")
CH_HARNESS = h("Harness as Experience Infrastructure")
CH_SKILLS = h("Skills: Experience Becomes Reusable Procedure")
CH_MEMORY = h("Memory: Experience Becomes Persistent State")
CH_ENVIRONMENT = h("Environment: The Boundary of What Agents Can Experience")
CH_AGENT_RL = h("RL and Continual Learning: Experience Becomes Parameter-side Consolidation")
CH_META = h("Meta-Evolving Agents: Who Controls What to Evolve")
CH_EVALUATION = h("Measuring Self-Improvement: What Current Benchmarks Still Miss")
CH_SAFETY = h("Safety: Self-Improvement as a Moving Attack Surface")

PH_FOUNDATIONS = CH_FOUNDATIONS

PH_HARNESS_RUNTIME = h("Runtime Adaptation Requires Experience Infrastructure")
PH_HARNESS_HISTORY = h("How Did We Get Here? From Task Loops to Runtime Systems")
PH_HARNESS_PATHS = h("From Experience Destinations to Improvement Paths")
PH_HARNESS_RELATED = h("Related Surveys")

PH_SKILL_DEFINITION = h("Skill Formal Definition")
PH_SKILL_LIFECYCLE = h("A Three-Stage Lifecycle for External Skills")
PH_SKILL_CREATION = h("Skill Creation: From External Sources to Organized Library")
PH_SKILL_USE = h("Skill Use: Retrieval, Composition, and Execution")
PH_SKILL_EVOLUTION = h("Skill Evolution: From Deployment Evidence to Library Updates")

PH_MEMORY_CONTEXT = h("Agent Memory as Context-Mediated Persistence")
PH_MEMORY_REPRESENTATION = h("Memory Representation: What Is Stored and How Is It Organized?")
PH_MEMORY_OPERATIONS = h("Memory Operations: How Is Memory Processed and Used?")
PH_MEMORY_EVOLUTION = h("Memory Self-Evolution and the Next Frontier")

PH_ENV_INFRA = h("Environment as Self-Improvement Infrastructure")
PH_ENV_EXEC = h("Turning Software into Executable Environments")
PH_ENV_PROTOCOL = h("Protocolizing and Standardizing the Boundary")
PH_ENV_LEARNABLE = h("Executable and Reusable Is Still Not Learnable")

PH_RL_WHY = h("Why the Parameter Path Matters")
PH_RL_VERTICAL = h("Pre-Deployment Training for Vertical Agent Capabilities")
PH_RL_HARNESS = h("Pre-Deployment Training for Harness Functional Units")
PH_RL_POST = h("Post-Deployment Training from Agent Traces")
PH_RL_TAKEAWAYS = h("Takeaways for Practitioners")

PH_META_REGIMES = h("Three Regimes of Post-Deployment Agent Evolution")
PH_META_TASKAGENT = h("TaskAgent Meta-Learning")
PH_META_LAYER = h("Meta-Evolving Agents")
PH_META_SELF = h("Improving the Meta-Layer Itself")

PH_EVAL_TARGETS = h("What Self-Improvement Evaluation Must Measure")
PH_EVAL_LANDSCAPE = h("The Current Benchmark Landscape")
PH_EVAL_TAXONOMY = h("Benchmark Taxonomy and Coverage")
PH_EVAL_SIP = h("SIP-Bench as a Protocol Layer")

PH_SAFETY_CALCULUS = h("Why Self-Improvement Changes the Safety Calculus")
PH_SAFETY_THREATS = h("Threat Models Across Mutable Harness Surfaces")
PH_SAFETY_SKILL = h("Skill Supply-Chain Attacks")
PH_SAFETY_MEMORY = h("Memory Poisoning and Memory Steering")
PH_SAFETY_WORKFLOW = h("Workflow, Tool, and Protocol Exploits")
PH_SAFETY_REWARD = h("Reward and Feedback Manipulation")
PH_SAFETY_CONTROL = h("Runtime Control for Self-Improving Agents")

CATEGORY_ORDER = [
    "Foundations and Surveys",
    "Harness Agents and Context Engineering",
    "Skills and Skill Libraries",
    "Memory and Experience",
    "Execution Environments and Benchmarks",
    "Agent RL and Continual Learning",
    "Meta-Agents and Evolution Orchestration",
    "Evaluation",
    "Safety and Governance",
]

CATEGORY_DEFAULTS = {
    "Foundations and Surveys": (CH_FOUNDATIONS, PH_FOUNDATIONS, "foundations"),
    "Harness Agents and Context Engineering": (CH_HARNESS, PH_HARNESS_RUNTIME, "harness"),
    "Skills and Skill Libraries": (CH_SKILLS, PH_SKILL_LIFECYCLE, "skills"),
    "Memory and Experience": (CH_MEMORY, PH_MEMORY_CONTEXT, "memory"),
    "Execution Environments and Benchmarks": (CH_ENVIRONMENT, PH_ENV_INFRA, "environment"),
    "Agent RL and Continual Learning": (CH_AGENT_RL, PH_RL_WHY, "agentrl"),
    "Meta-Agents and Evolution Orchestration": (CH_META, PH_META_REGIMES, "meta"),
    "Evaluation": (CH_EVALUATION, PH_EVAL_LANDSCAPE, "evaluation"),
    "Safety and Governance": (CH_SAFETY, PH_SAFETY_THREATS, "safety"),
}


def clean(value: object) -> str:
    if value is None:
        return ""
    text = html.unescape(str(value)).strip()
    text = text.replace("\\_", "_").replace("\\&", "&")
    return re.sub(r"\s+", " ", text)


def clean_table_cell(value: str) -> str:
    text = clean(value)
    if text.startswith("`") and text.endswith("`") and len(text) > 1:
        text = text[1:-1]
    return text.strip()


def normalize_title(title: str) -> str:
    return re.sub(r"[^a-z0-9]+", " ", title.lower()).strip()


def has_cjk(value: str) -> bool:
    return bool(CJK_RE.search(value))


def is_ascii(value: str) -> bool:
    try:
        value.encode("ascii")
        return True
    except UnicodeEncodeError:
        return False


def markdown_url(cell: str) -> str:
    match = URL_RE.search(cell)
    return clean(match.group(1)) if match else ""


def role(chapter: str, phase: str, key: str, order: int) -> dict[str, str | int]:
    return {
        "chapter": chapter,
        "phase": phase,
        "chapterKey": key,
        "chapterOrder": order,
    }


def infer_phase(category: str, title: str, name: str) -> str:
    text = f"{title} {name}".lower()

    if category == "Harness Agents and Context Engineering":
        if "survey" in text or "sok" in text:
            return PH_HARNESS_RELATED
        if "workflow" in text or "runtime graph" in text:
            return PH_HARNESS_PATHS
        if "react" in text or "webarena" in text or "tool" in text:
            return PH_HARNESS_HISTORY
        return PH_HARNESS_RUNTIME

    if category == "Skills and Skill Libraries":
        if "create" in text or "creation" in text or "foundry" in text or "forge" in text or "mining" in text:
            return PH_SKILL_CREATION
        if "retriev" in text or "router" in text or "compose" in text or "use" in text or "toolformer" in text:
            return PH_SKILL_USE
        if "evol" in text or "continual" in text or "lifelong" in text or "reinforcement" in text or "rl" in text:
            return PH_SKILL_EVOLUTION
        if "architecture" in text or "definition" in text:
            return PH_SKILL_DEFINITION
        return PH_SKILL_LIFECYCLE

    if category == "Memory and Experience":
        if "graph" in text or "organization" in text or "organizing" in text or "representation" in text:
            return PH_MEMORY_REPRESENTATION
        if "retriev" in text or "compress" in text or "admission" in text or "write" in text or "manage" in text:
            return PH_MEMORY_OPERATIONS
        if "evol" in text or "online" in text or "continual" in text or "rl" in text or "consolidation" in text:
            return PH_MEMORY_EVOLUTION
        return PH_MEMORY_CONTEXT

    if category == "Execution Environments and Benchmarks":
        if "protocol" in text or "mcp" in text or "a2a" in text or "ag-ui" in text:
            return PH_ENV_PROTOCOL
        if "bench" in text or "gym" in text or "arena" in text or "environment" in text:
            return PH_ENV_EXEC
        if "learn" in text or "world model" in text or "world-model" in text:
            return PH_ENV_LEARNABLE
        return PH_ENV_INFRA

    if category == "Agent RL and Continual Learning":
        if "post" in text or "deployment" in text or "online" in text or "production" in text or "trace" in text:
            return PH_RL_POST
        if "tool" in text or "skill" in text or "memory" in text or "harness" in text:
            return PH_RL_HARNESS
        if "takeaway" in text or "practitioner" in text:
            return PH_RL_TAKEAWAYS
        if "training" in text or "rl" in text or "reinforcement" in text or "sft" in text:
            return PH_RL_VERTICAL
        return PH_RL_WHY

    if category == "Meta-Agents and Evolution Orchestration":
        if "taskagent" in text or "task agent" in text:
            return PH_META_TASKAGENT
        if "meta" in text or "orchestrat" in text or "evolver" in text:
            return PH_META_LAYER
        if "self" in text and "improv" in text:
            return PH_META_SELF
        return PH_META_REGIMES

    if category == "Evaluation":
        if "sip" in text:
            return PH_EVAL_SIP
        if "target" in text or "measure" in text or "metric" in text:
            return PH_EVAL_TARGETS
        if "taxonom" in text or "coverage" in text:
            return PH_EVAL_TAXONOMY
        return PH_EVAL_LANDSCAPE

    if category == "Safety and Governance":
        if "skill" in text or "supply" in text:
            return PH_SAFETY_SKILL
        if "memory" in text or "poison" in text or "steering" in text:
            return PH_SAFETY_MEMORY
        if "workflow" in text or "tool" in text or "protocol" in text or "injection" in text:
            return PH_SAFETY_WORKFLOW
        if "reward" in text or "feedback" in text:
            return PH_SAFETY_REWARD
        if "govern" in text or "control" in text or "alignment" in text or "assurance" in text:
            return PH_SAFETY_CONTROL
        if "risk" in text or "safety" in text:
            return PH_SAFETY_CALCULUS
        return PH_SAFETY_THREATS

    return CATEGORY_DEFAULTS[category][1]


def split_row(line: str) -> tuple[str, str, str, str, str] | None:
    cells = [cell.strip() for cell in line.strip().strip("|").split("|")]
    if len(cells) < 5:
        return None
    if len(cells) > 5:
        date = cells[0]
        name = cells[1]
        title = " | ".join(cells[2:-2])
        paper = cells[-2]
        github = cells[-1]
        return date, name, title, paper, github
    return cells[0], cells[1], cells[2], cells[3], cells[4]


def parse_awesome_readme() -> list[dict]:
    records: list[dict] = []
    current_category = ""
    seen_categories: set[str] = set()

    for line in read_awesome_readme().splitlines():
        if line.startswith("### "):
            current_category = clean(line.removeprefix("### "))
            continue
        if current_category not in CATEGORY_DEFAULTS:
            continue
        if not line.startswith("|") or line.startswith("|:-") or line.startswith("| Date"):
            continue

        row = split_row(line)
        if row is None:
            continue

        date_raw, name_raw, title_raw, paper_raw, github_raw = row
        title = clean_table_cell(title_raw)
        if not title or title == "-":
            continue

        seen_categories.add(current_category)
        date = clean_table_cell(date_raw)
        if date == "-":
            date = ""
        name = clean_table_cell(name_raw)
        paper_url = markdown_url(paper_raw)
        github_url = markdown_url(github_raw)
        url = paper_url or github_url

        chapter, default_phase, key = CATEGORY_DEFAULTS[current_category]
        order = CATEGORY_ORDER.index(current_category) + 1
        phase = infer_phase(current_category, title, name) or default_phase
        item_role = role(chapter, phase, key, order)
        item_id = name or normalize_title(title)
        signal = f"{current_category} entry"

        records.append({
            "id": item_id,
            "title": title,
            "authors": "",
            "date": date,
            "phase": phase,
            "category": current_category,
            "family": "",
            "idea": "",
            "result": "",
            "benchmark": "",
            "signal": signal,
            "url": url,
            "paperUrl": paper_url,
            "githubUrl": github_url,
            "anchor": "",
            "collection": "Awesome-Self-Improving-Agents",
            "chapter": chapter,
            "chapterKey": key,
            "roles": [item_role],
            "sourcePhase": current_category,
        })

    missing = [category for category in CATEGORY_ORDER if category not in seen_categories]
    if missing:
        raise ValueError(f"Missing Awesome paper categories: {', '.join(missing)}")

    return sorted(
        records,
        key=lambda row: (row.get("date", ""), -int(row["roles"][0]["chapterOrder"]), row.get("title", "")),
        reverse=True,
    )


def validate_records(records: list[dict]) -> None:
    if not records:
        raise ValueError("No paper records parsed")

    chapter_count = len({role["chapter"] for record in records for role in record["roles"]})
    if chapter_count != len(CATEGORY_ORDER):
        raise ValueError(f"Expected {len(CATEGORY_ORDER)} paper chapters, found {chapter_count}")

    for record in records:
        signal = record.get("signal", "")
        if has_cjk(signal) or not is_ascii(signal):
            raise ValueError(f"Signal must be ASCII-only for {record.get('title')}: {signal}")

        roles = record.get("roles") or []
        if not roles:
            raise ValueError(f"Missing manuscript role for {record.get('title')}")

        for item_role in roles:
            chapter = item_role.get("chapter", "")
            phase = item_role.get("phase", "")
            if chapter not in LATEX_HEADINGS:
                raise ValueError(f"Chapter is not an exact LaTeX heading for {record.get('title')}: {chapter}")
            if phase not in LATEX_HEADINGS:
                raise ValueError(f"Phase is not an exact LaTeX heading for {record.get('title')}: {phase}")


def read_awesome_readme() -> str:
    if AWESOME_README.exists():
        return AWESOME_README.read_text(encoding="utf-8")

    try:
        result = subprocess.run(
            ["git", "-C", str(REPO_ROOT), "show", "main:README.md"],
            check=True,
            capture_output=True,
            text=True,
        )
    except subprocess.CalledProcessError as exc:
        raise FileNotFoundError(
            f"Missing Awesome README at {AWESOME_README} and could not read main:README.md"
        ) from exc

    return result.stdout


def main() -> None:
    records = parse_awesome_readme()
    validate_records(records)
    data_dir = SITE_ROOT / "data"
    data_dir.mkdir(parents=True, exist_ok=True)

    json_out = data_dir / "papers.json"
    js_out = data_dir / "papers.js"
    payload = json.dumps(records, indent=2, ensure_ascii=False)

    json_out.write_text(payload + "\n", encoding="utf-8")
    js_out.write_text(f"window.SURVEY_PAPERS = {payload};\n", encoding="utf-8")
    print(f"Wrote {len(records)} papers to {json_out} and {js_out}")


if __name__ == "__main__":
    main()
