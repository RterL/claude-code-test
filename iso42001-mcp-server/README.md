# iso42001-mcp-server

An MCP server for working an AI management system (AIMS) through ISO/IEC 42001:2023. It lets an MCP client (Claude Desktop, Claude Code, etc.) walk a CISO through the standard conversationally: browse its clause and Annex A control structure, generate the input fields needed to assess any control, record status/owner/evidence, get implementation guidance, and produce a gap report.

## What this is (and isn't)

- **Is**: a compliance *copilot* -- it tracks state, generates structured questions, and surfaces guidance grounded in the standard.
- **Isn't**: an enforcement system. It doesn't block deployments, verify evidence, or certify compliance. It also isn't a substitute for a licensed copy of ISO/IEC 42001, legal advice, or an accredited certification body's judgment.

### A note on the standard's copyright

ISO/IEC 42001 is a copyrighted, paywalled standard. The clause and Annex A control text in `src/data/` is an **original paraphrase** of the standard's structure and intent, written from a licensed reading of the document -- it is not a reproduction of ISO's normative text. If your organization has a licensed copy, treat this server's guidance as a starting point and verify wording-sensitive decisions (e.g. audit responses, SoA justifications) against the actual standard.

## Tools

| Tool | Purpose |
|---|---|
| `iso42001_list_clauses` | Browse the AIMS management-system requirements (clauses 4-10). |
| `iso42001_list_controls` | Browse the 38 Annex A reference controls (themes A.2-A.10). |
| `iso42001_get_assessment_form` | Get the input fields for assessing one control, plus its current recorded state. |
| `iso42001_submit_assessment` | Record/update a control's status, owner, evidence, dates, and notes. |
| `iso42001_get_gap_report` | Aggregate all assessments into a completion/gap report by theme, with overdue and unassessed lists. |
| `iso42001_get_guidance` | Get implementation guidance for a specific clause or control. |

Plus a `iso42001_gap_assessment_interview` prompt that drives a guided, control-by-control interview, and three read-only resources (`iso42001://clauses`, `iso42001://annex-a`, `iso42001://assessments`) for clients that prefer direct data access over tool calls.

## Setup

```bash
npm install
npm run build
```

### Run locally (stdio)

```bash
npm start
```

### Register with Claude Code / Claude Desktop

Add to your MCP client config (e.g. `claude_desktop_config.json` or via `claude mcp add`):

```json
{
  "mcpServers": {
    "iso42001": {
      "command": "node",
      "args": ["/absolute/path/to/iso42001-mcp-server/dist/index.js"]
    }
  }
}
```

## Data storage

Assessments persist to a local JSON file (`data/assessments.json` by default -- gitignored, since it will hold your organization's actual compliance posture). Override the location with the `ISO42001_DATA_PATH` environment variable, e.g. to point it at a shared or backed-up location:

```json
{
  "mcpServers": {
    "iso42001": {
      "command": "node",
      "args": ["/absolute/path/to/iso42001-mcp-server/dist/index.js"],
      "env": { "ISO42001_DATA_PATH": "/secure/path/iso42001-assessments.json" }
    }
  }
}
```

## Current scope / known limitations (v1)

- **Single user/org, local stdio only.** No remote transport, auth, or multi-tenant storage yet -- by design, per the initial scope decision. See `src/index.ts` to add a Streamable HTTP transport if you need remote access later.
- **No licensed-text ingestion yet.** The guidance is paraphrased, general best practice. If you have a licensed copy of the standard, a natural v2 extension is a private, gitignored data file the server can index for more precise guidance (not committed to source control).
- **No Confluence/Jira export.** Assessments are local-only; exporting to an existing GRC/ISMS system (discussed separately) is a follow-on tool, not built here.
- **Advisory, not verifying.** The server takes the CISO's word for control status; it doesn't check evidence links resolve or validate claims.
