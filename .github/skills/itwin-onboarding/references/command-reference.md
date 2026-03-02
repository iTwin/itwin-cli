# Command Reference

Concise flag reference for the onboarding commands.

## Global Flags

Available on every command:

| Flag | Short | Description |
|------|-------|-------------|
| `--json` | `-j` | Output result as JSON |
| `--table` | `-t` | Output result as table |
| `--silent` | `-s` | Suppress all log output |

## `itp auth login`

| Flag | Type | Required | Description |
|------|------|----------|-------------|
| `--client-id` | string | no | Custom client ID (native or service) |
| `--client-secret` | string | no | Client secret (triggers service/M2M flow) |

## `itp auth info`

No flags (aside from global `--json`/`--table`).

**Output shape** — use to determine auth state:
- **Authenticated**: response includes `authorizationType` (`"Interactive"` or `"Service"`), `clientId`, and `expirationDate`.
- **Not authenticated**: response has only `apiUrl` and `issuerUrl`. No `authorizationType` field.
- **Expired token**: `authorizationType` present but `expirationDate` is in the past.

## `itp auth logout`

No flags (aside from global `--json`/`--table`). Clears cached token.

## `itp itwin create`

| Flag | Type | Required | Description |
|------|------|----------|-------------|
| `--class` | string | **yes** | `Account`, `Thing`, `Endeavor` |
| `--sub-class` | string | **yes** | `Account`, `Portfolio`, `Asset`, `Program`, `Project`, `WorkPackage` |
| `--name` / `-n` | string | **yes** | Display name |
| `--save` | boolean | no | Save created iTwin ID to local context |
| `--data-center-location` | string | no | Region: `East US`, `North Europe`, `West Europe`, `Southeast Asia`, `Australia East`, `UK South`, `Canada Central`, `Central India`, `Japan East` |
| `--geographic-location` | string | no | Address or city text |
| `--iana-time-zone` | string | no | IANA timezone ID |
| `--number` | string | no | Unique identifier/number |
| `--parent-id` | UUID | no | Parent iTwin ID |
| `--status` | string | no | `Active`, `Inactive`, `Trial` |
| `--type` | string | no | Custom type label |

**Default for onboarding:** Always use `--class Endeavor --sub-class Project`.

## `itp imodel create`

| Flag | Type | Required | Description |
|------|------|----------|-------------|
| `--itwin-id` / `-i` | UUID | **yes** (or from context) | Parent iTwin ID |
| `--name` / `-n` | string | **yes** | iModel name |
| `--save` | boolean | no | Save iModel ID + iTwin ID to context |
| `--description` / `-d` | string | no | Description text |
| `--extent` | JSON | no | Bounding box: `{"southWest":{"latitude":N,"longitude":N},"northEast":{"latitude":N,"longitude":N}}` |
| `--sw-latitude` | float | no | Extent SW latitude (alternative to `--extent`) |
| `--sw-longitude` | float | no | Extent SW longitude |
| `--ne-latitude` | float | no | Extent NE latitude |
| `--ne-longitude` | float | no | Extent NE longitude |

## `itp imodel populate`

| Flag | Type | Required | Description |
|------|------|----------|-------------|
| `--imodel-id` / `-m` | UUID | **yes** (or from context) | Target iModel ID |
| `--file` / `-f` | file path | **yes** (multiple) | Source design file(s) — repeat for each file |
| `--connector-type` / `-c` | string | no (multiple) | Override connector — repeat to match files |
| `--no-wait` | boolean | no | Return immediately without waiting for sync completion |

**Connector type options:** `AUTOPLANT`, `CIVIL`, `CIVIL3D`, `DWG`, `GEOSPATIAL`, `IFC`, `MSTN`, `NWD`, `OBD`, `OPENTOWER`, `PROSTRUCTURES`, `REVIT`, `SPPID`, `SPXREVIEW`

### File Extension → Connector Auto-Mapping

| Extension(s) | Default Connector | Notes |
|--------------|-------------------|-------|
| `.dgn`, `.i.dgn` | MSTN | Also supports CIVIL, OBD, PROSTRUCTURES |
| `.dwg` | DWG | Also supports AUTOPLANT, CIVIL3D, MSTN |
| `.dxf` | DWG | |
| `.rvt` | REVIT | |
| `.ifc` | IFC | |
| `.nwd`, `.nwc` | NWD | |
| `.shp`, `.geojson`, `.kml`, `.geodb` | GEOSPATIAL | |
| `.obj`, `.fbx`, `.stl`, `.skp`, `.3dm`, `.3ds` | MSTN | 3D mesh/CAD formats |
| `.dae`, `.igs`, `.jt`, `.sat`, `.stp`, `.hln` | MSTN | Exchange formats |
| `.land.xml` | MSTN | |
| `.x_t` | MSTN | Parasolid |
| `.vue` | SPXREVIEW | |
| `.otxml` | OPENTOWER | |
| `.zip` | SPPID | |

When `--connector-type` is omitted, the first matching connector is used. For `.dgn` and `.dwg` files that support multiple connectors, the default is MSTN and DWG respectively — override with `--connector-type` if you need CIVIL, CIVIL3D, etc.

**Note on `.csv`**: CSV files appear in some CLI examples but are **not** in the auto-mapping table. If a user provides `.csv` files, they must explicitly specify `--connector-type`.

## `itp imodel view cesium-sandcastle`

| Flag | Type | Required | Description |
|------|------|----------|-------------|
| `--imodel-id` / `-m` | UUID | **yes** (or from context) | iModel to view |
| `--changeset-id` | string | no | Specific changeset (default: latest) |
| `--open` | boolean | no | Open URL in browser automatically |
| `--terrain` | string | no | `cesiumWorldTerrain` for terrain overlay |

**Note**: The `--json` output contains a large encoded URL blob meant for programmatic use. For human users, prefer `--open` (without `--json`) to open the viewer directly in the browser.

## Context System

The context system persists iTwin and iModel IDs locally so you don't repeat them.

**Setting context:**
- `--save` flag on `itwin create` and `imodel create` — saves automatically
- `itp context set --itwin-id <id> --imodel-id <id>` — manual set

**Reading context:**
- `itp context info` — show current saved IDs

**Clearing context:**
- `itp context clear`

**Resolution order** (highest priority first):
1. Explicit flags (`--itwin-id`, `--imodel-id`)
2. Context (saved via `--save` or `itp context set`)
3. Environment variables (`ITP_ITWIN_ID`, `ITP_IMODEL_ID`)
