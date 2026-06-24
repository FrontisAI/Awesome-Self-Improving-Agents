#!/usr/bin/env python3
"""Extract title, abstract, parts, sections, and figures from the LaTeX manuscript."""

from __future__ import annotations

import json
import os
import re
from pathlib import Path


REPO_ROOT = Path(__file__).resolve().parents[2]
SITE_ROOT = REPO_ROOT
MANUSCRIPT_ROOT = Path(os.environ.get("MANUSCRIPT_ROOT", REPO_ROOT.parent / "Agent_survey_Frontis/RL4LRM_Survey_0907"))
SURVEY_TEX = MANUSCRIPT_ROOT / "survey.tex"

INPUT_RE = re.compile(r"\\input\{sections/([^}]+)\}")
PART_RE = re.compile(r"\\surveyparthdr\{([^}]+)\}")
TITLE_RE = re.compile(r"\\title\{(.+?)\}\s*$")
ABSTRACT_RE = re.compile(r"\\gdef\\theabstract\{(.+?)\}", re.S)
HEADING_RE = re.compile(r"^\\(section|subsection|subsubsection|paragraph)\{(.+?)\}")
FIGURE_RE = re.compile(r"\\includegraphics(?:\[[^\]]+\])?\{([^}]+)\}")


def clean_latex(text: str) -> str:
    return " ".join(text.replace("\n", " ").split())


def extract_title(survey_text: str) -> str:
    for line in survey_text.splitlines():
        match = TITLE_RE.search(line.strip())
        if match:
            return clean_latex(match.group(1))
    raise ValueError("Could not find manuscript title in survey.tex")


def extract_abstract(survey_text: str) -> str:
    match = ABSTRACT_RE.search(survey_text)
    if not match:
        raise ValueError("Could not find \\gdef\\theabstract in survey.tex")
    return clean_latex(match.group(1))


def parse_section_file(path: Path) -> dict:
    section: dict | None = None
    current_subsection: dict | None = None
    figures: list[dict[str, str]] = []

    lines = path.read_text(encoding="utf-8").splitlines()
    for idx, line in enumerate(lines):
        stripped = line.strip()
        heading = HEADING_RE.match(stripped)
        if heading:
            kind, title = heading.groups()
            title = clean_latex(title)
            if kind == "section":
                section = {
                    "title": title,
                    "file": str(path.relative_to(MANUSCRIPT_ROOT)),
                    "subsections": [],
                    "figures": figures,
                }
                current_subsection = None
            elif kind == "subsection":
                current_subsection = {"title": title, "children": []}
                if section is not None:
                    section["subsections"].append(current_subsection)
            elif kind in {"subsubsection", "paragraph"} and current_subsection is not None:
                current_subsection["children"].append({"kind": kind, "title": title})

        figure = FIGURE_RE.search(stripped)
        if figure:
            caption = ""
            for lookahead in lines[idx + 1 : idx + 12]:
                cap = re.search(r"\\caption(?:of\{figure\})?\{(.+)", lookahead.strip())
                if cap:
                    caption = clean_latex(cap.group(1).rstrip("}"))
                    break
            figures.append({"source": figure.group(1), "caption": caption})

    if section is None:
        return {
            "title": path.stem,
            "file": str(path.relative_to(MANUSCRIPT_ROOT)),
            "subsections": [],
            "figures": figures,
        }
    return section


def parse_parts(survey_text: str) -> list[dict]:
    parts: list[dict] = []
    current_part: dict | None = None

    for line in survey_text.splitlines():
        if r"\section*{Author Contributions}" in line:
            break

        part = PART_RE.search(line)
        if part:
            current_part = {"title": clean_latex(part.group(1)), "sections": []}
            parts.append(current_part)
            continue

        input_match = INPUT_RE.search(line)
        if input_match and current_part is not None:
            section_path = MANUSCRIPT_ROOT / "sections" / f"{input_match.group(1)}.tex"
            current_part["sections"].append(parse_section_file(section_path))

    return parts


def main() -> None:
    survey_text = SURVEY_TEX.read_text(encoding="utf-8")
    manuscript = {
        "title": extract_title(survey_text),
        "abstract": extract_abstract(survey_text),
        "parts": parse_parts(survey_text),
    }

    out_dir = SITE_ROOT / "data"
    out_dir.mkdir(parents=True, exist_ok=True)
    payload = json.dumps(manuscript, indent=2, ensure_ascii=False)
    (out_dir / "manuscript.json").write_text(payload + "\n", encoding="utf-8")
    (out_dir / "manuscript.js").write_text(f"window.MANUSCRIPT = {payload};\n", encoding="utf-8")
    print(f"Wrote manuscript structure with {len(manuscript['parts'])} parts")


if __name__ == "__main__":
    main()
