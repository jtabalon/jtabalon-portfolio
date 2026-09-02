# Domain documentation

This repository has one product context: Joseph Tabalon Jr.'s public professional portfolio.

## Read before exploring

- `CONTEXT.md` defines the shared product and editorial vocabulary.
- `docs/site-direction.md` records the confirmed audience, content boundaries, and current direction.
- `docs/adr/` records architectural decisions that should not be changed accidentally.

If a needed concept is missing, use plain language or add a definition instead of inventing competing terminology.

## File structure

```text
/
├── CONTEXT.md
├── docs/
│   ├── adr/
│   ├── agents/
│   └── site-direction.md
└── src/
```

Use terms from `CONTEXT.md` in issue titles, implementation plans, tests, and documentation. Flag any conflict with an ADR explicitly.
