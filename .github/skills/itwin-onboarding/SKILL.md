---
name: itwin-onboarding
description: >
  Guide users through iTwin Platform onboarding using the iTwin CLI (itp).
  Create digital twins, set up iModels, upload design files (.dgn, .dwg, .rvt, .ifc, .shp, and more),
  synchronize data, and view infrastructure models in 3D.
  Use when users want to: get started with iTwin, create a digital twin, create an iTwin or iModel,
  upload or synchronize design data, populate an iModel, view an iModel in 3D,
  set up a new infrastructure project, set up a new project, upload my design,
  view my model in 3D, get started with digital twins, or automate iTwin Platform workflows.
  Requires the iTwin CLI (itp) to be installed.
metadata:
  author: iTwin
  version: 1.0.0
  tags: [onboarding, digital-twin, imodel, itwin-platform]
compatibility: Requires the iTwin CLI (itp) version 1.0.0 or later. Works on macOS, Linux, and Windows.
---

# iTwin Platform Onboarding

Guide users from zero to viewing a digital twin in 3D using the iTwin CLI (`itp`).

## Golden Path

0. **Install CLI** — Auto-install from GitHub Releases (see Getting Started Step 0), verify with `itp --version`
1. **Authenticate** — `itp auth login`
2. **Create iTwin + iModel** — `itp itwin create ... --save` then `itp imodel create ... --save`
3. **Upload design data** — `itp imodel populate --file <path> ...`
4. **View in 3D** — `itp imodel view cesium-sandcastle --open`

All commands support `--json` for machine-parseable output. The `--save` flag persists IDs to local context so they carry forward automatically.

## Rules

- **Always confirm before uploading.** Never run `itp imodel populate` without first showing the user which files will be uploaded and getting explicit confirmation.
- **Always ask where files are.** Even if design files are visible in the current directory or workspace, always ask the user where their files are — never auto-select.

## Onboarding Workflow

Follow the interactive setup guide to walk users through the full flow. Handles auth detection, combined project naming, file/folder upload, and resume from partial completion.

See [Getting Started](./references/getting-started.md)

## Authentication

Covers browser-based interactive login, headless service credentials for CI/AI agents, and pre-authenticated session detection.

See [Auth Guide](./references/auth-guide.md)

## Command Reference

Flags for all onboarding commands, connector type auto-mapping table, global flags, and the context system.

See [Command Reference](./references/command-reference.md)

## Advanced Workflows

Patterns beyond onboarding: re-syncing updated files, named versions, multi-file mixed connectors, access control, and sharing.

See [Advanced Workflows](./references/workflows.md)

Covers re-syncing files, named versions, access control, sharing, and automation.

## Key Concepts

- **iTwin**: A digital twin container — organizes models, repositories, and data sources for a project.
- **iModel**: A versioned repository of design data within an iTwin. Tracks changes over time.
- **Populate**: Upload design files to iTwin Storage, run a connector to synchronize them into the iModel.
- **Connector**: Translates design file formats (DGN, DWG, RVT, IFC, etc.) into the iModel schema. Auto-selected from file extension.
- **Context**: Local cache of iTwin/iModel IDs. Set via `--save` or `itp context set`. Avoids repeating IDs between commands.

## Sample Data

If the user has no design files, sample datasets can be downloaded from the CLI's GitHub repository:
- [ExtonCampus.dgn](https://raw.githubusercontent.com/iTwin/itwin-cli/main/examples/datasets/ExtonCampus.dgn)
- [HouseModel.dgn](https://raw.githubusercontent.com/iTwin/itwin-cli/main/examples/datasets/HouseModel.dgn)

These are **not** bundled with the installed CLI — they must be downloaded separately.
