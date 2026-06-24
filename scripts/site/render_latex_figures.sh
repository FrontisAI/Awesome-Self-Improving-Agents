#!/usr/bin/env bash
set -euo pipefail

REPO_ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/../.." && pwd)"
DOCS_ROOT="${REPO_ROOT}/docs"
SOURCE_ROOT="${REPO_ROOT}/../Agent_survey_Frontis/RL4LRM_Survey_0907"
PDFTOPPM="${PDFTOPPM:-/Users/mac_jc/.cache/codex-runtimes/codex-primary-runtime/dependencies/bin/pdftoppm}"

if [[ ! -x "${PDFTOPPM}" ]]; then
  echo "pdftoppm not found at ${PDFTOPPM}" >&2
  exit 1
fi

render_one() {
  local source_pdf="$1"
  local output_png="$2"
  local tmp_prefix
  tmp_prefix="$(mktemp "${DOCS_ROOT}/assets/render.XXXXXX")"
  "${PDFTOPPM}" -png -singlefile -r 220 "${SOURCE_ROOT}/${source_pdf}" "${tmp_prefix}"
  mv "${tmp_prefix}.png" "${DOCS_ROOT}/${output_png}"
  rm -f "${tmp_prefix}"
}

render_one "figure/harness.pdf" "assets/harness-figure.png"
render_one "figure/chapters.pdf" "assets/chapters-figure.png"
render_one "figure/rl.pdf" "assets/parameter-path-figure.png"
render_one "figure/sip.pdf" "assets/evaluation-figure.png"
render_one "figure/timeline.pdf" "assets/timeline-figure.png"
