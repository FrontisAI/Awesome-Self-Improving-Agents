# Website Dev Log

## 2026-06-23

- Created the first static companion-site scaffold for the deployed harness-agent survey.
- Used a generated harness-runtime image as the cover background.
- Rendered manuscript figures into `assets/` for the site: harness, chapter overview, parameter path, evaluation, and timeline figures.
- Copied the current manuscript PDF into `assets/survey-draft.pdf` so the draft link works after static publishing.
- Added `scripts/build_papers.py` to rebuild `data/papers.json` from the sibling `Agent_survey_Frontis` mindmap catalogs.
- Implemented first-page information architecture: hero, definition, timeline, taxonomy, manuscript-figure strip, paper explorer, and maintenance notes.
- Initially generated `data/papers.json` and `data/papers.js` with 111 deduplicated recent papers from the meta-evolution, evaluation, and environment mindmap catalogs; this source was later superseded by the 514-row Awesome paper list import.
- Verified local rendering through Chrome headless desktop and mobile screenshots against `http://127.0.0.1:5173/`; fixed mobile overflow by using a conservative mobile content column.

## 2026-06-23 Follow-up

- Added `scripts/render_latex_figures.sh` and re-rendered site figures from LaTeX-referenced manuscript PDFs: `harness.pdf`, `chapters.pdf`, `rl.pdf`, `sip.pdf`, and `timeline.pdf`.
- Temporarily removed the custom SVG favicon and generated hero background during the manuscript-derived visual pass.
- Reworked the Runtime Object section around draft Figure 2 (`harness.pdf`) with a four-point reading guide rather than a separate hand-built diagram.
- Added the draft timeline figure rendered from `timeline.pdf`.
- Updated the paper explorer so the Phase dropdown is scoped by the currently selected Chapter.

## 2026-06-23 Paper Explorer Taxonomy Fix

- Replaced raw mindmap `phase` values with manuscript-structure phases derived from current LaTeX section and paragraph organization.
- Added per-paper `roles` so a paper can map to multiple manuscript locations without displaying composite chapters such as `Evaluation | Environment`.
- Updated frontend filtering so Chapter and Phase operate over those manuscript roles.
- Added an ASCII-only `signal` field and changed the Signal column to use it, preventing Chinese notes or Chinese punctuation from appearing in the website table.

## 2026-06-23 LaTeX Source-of-Truth Pass

- Added `scripts/build_manuscript_structure.py` and generated `data/manuscript.json` / `data/manuscript.js` directly from `survey.tex` and `sections/*.tex`.
- Reworked the visible manuscript outline so Parts, Sections, and Subsections are rendered from exact LaTeX titles with no local renaming.
- Kept the paper explorer Chapter and Phase dropdowns restricted to exact LaTeX headings through `scripts/build_papers.py` validation.
- Temporarily replaced the hero image with `chapters-figure.png` rendered from `figure/chapters.pdf`; the generated cover background was later restored by request.
- Pointed the browser favicon at the same `chapters-figure.png` asset instead of introducing a separate icon file.
- Expanded the parameter-path figure caption to the exact LaTeX caption text.

## 2026-06-23 Awesome Paper Organization Pass

- Restored the generated harness-runtime hero background per design preference; non-cover visual figures remain rendered from LaTeX-referenced PDFs.
- Rebuilt `scripts/build_papers.py` around `/Users/mac_jc/大学2/ZBW/Awesome-Self-Improving-Agents/README.md`, producing 514 paper rows.
- Mapped the Awesome paper list's nine categories to exact LaTeX section headings for website Chapter labels: Introduction, Harness, Skills, Memory, Environment, RL/CL, Meta-Evolving Agents, Evaluation, and Safety.
- Changed the hero manuscript stat from four manuscript Parts to nine paper chapters so Chapter no longer means `\surveyparthdr`.
- Changed the manuscript outline view to show LaTeX section cards with their parent Part labels, rather than only four Part cards.

## 2026-06-24 Site Naming

- Set the browser title and header brand to `Agents in the Era of Experience` while keeping the hero title bound to the exact LaTeX manuscript title.

## 2026-06-24 GitHub Pages Packaging

- Copied the static website runtime files into `/Users/mac_jc/大学2/ZBW/Awesome-Self-Improving-Agents/docs/` for GitHub Pages publishing from the repository's `main` branch `/docs` folder.
- Added `docs/.nojekyll` and a Website badge in the Awesome repository README pointing to `https://tsinghuac3i.github.io/Awesome-Self-Improving-Agents/`; this deployment was later superseded by the FrontisAI root Pages deployment.

## 2026-06-24 Repository Migration

- Moved the GitHub Pages website runtime into `docs/` and the rebuild scripts into `scripts/site/` in this repository.
- Future website maintenance should happen from `/Users/mac_jc/大学2/ZBW/Awesome-Self-Improving-Agents`.

## 2026-06-24 FrontisAI Deployment

- Updated the header logo to use the Frontis logo rendered from `RL4LRM_Survey_0907/assets/frontis-logo-horizontal-light.pdf`.
- Changed the hero `Draft PDF` button to `FrontisAI Website` and kept it linked to `https://frontis.ai` until the arXiv button is added.
- Prepared the repository for deployment as `FrontisAI/frontisai.github.io`, which serves the site at `https://frontisai.github.io/`; this root deployment was later superseded by the project Pages deployment below.

## 2026-06-24 FrontisAI Project Pages Deployment

- Repointed the canonical website deployment to `FrontisAI/Awesome-Self-Improving-Agents`.
- The public website URL is `https://frontisai.github.io/Awesome-Self-Improving-Agents/`, published from the `main` branch `/docs` folder.
- The temporary root Pages repository `FrontisAI/frontisai.github.io` remains non-canonical; GitHub returned `422` when attempting to deactivate Pages for the organization Pages repository.

## 2026-06-24 Figure Asset Refresh

- Refreshed `figs/chapters.png` and `figs/harness.png` for the repository README figure presentation.
