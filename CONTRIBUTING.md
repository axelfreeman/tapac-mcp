# Contributing to TAPAC

## Commit style — Conventional Commits

Every commit follows [Conventional Commits](https://www.conventionalcommits.org/):

```
feat: add SMTP validation to contact lookup
fix: resolve timeout in the telegram scraper
docs: update README install steps
refactor: split the scraper into per-source modules
chore: bump dependencies
test: cover the email validator
```

- `feat:` — new capability
- `fix:` — bug fix
- `docs:` — documentation only
- `refactor:` — code change with no behavior change
- `chore:` — build, deps, tooling
- `test:` — tests

One commit = one logical change. Present tense, imperative ("add", not "added").

## Auto-formatting (pre-commit)

Install once:

```bash
pip install pre-commit
pre-commit install
```

After that, every `git commit` runs `ruff` (lint + format) and basic hygiene
checks automatically. Code is auto-fixed or the commit is blocked if something
can't be fixed.

## Layout

```
src/tapac_mcp/        # the MCP server
scripts/              # standalone demos
sdk/python/           # Python SDK (tapac-sdk on PyPI)
sdk/js/               # JS SDK
test_local.py         # stdio smoke test (no API key)
test_e2e_uvx.py       # end-to-end: uvx install + full MCP handshake
```

## CI

`.github/workflows/lint.yml` runs `ruff check` + `ruff format --check` on every
push and pull request. A green check means the code passes lint.
