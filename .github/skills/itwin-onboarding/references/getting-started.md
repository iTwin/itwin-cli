# Getting Started with iTwin

Interactive guide for setting up a new iTwin project — from authentication to 3D visualization.

## Check Status Quo

Before starting, check if the iTwin CLI is installed and inspect the user's current state:

```bash
itp --version
itp auth info --json
itp context info --json
```

Check for:
- **CLI installed**: Does `itp --version` succeed? If not, the CLI needs to be installed first (see Step 0).
- **Auth status**: Is the user already logged in? Is the token expired? See "Interpreting auth info output" below.
- **Existing context**: Is there already a saved iTwin ID or iModel ID? See "Interpreting context info output" below.
- **Existing files**: Does the user have design files ready (.dgn, .dwg, .rvt, .ifc, etc.)?

If already authenticated and context is set, skip ahead to the relevant step.

### Interpreting `itp auth info --json` output

**Authenticated** — response includes `authorizationType`, `clientId`, and `expirationDate`:
```json
{
  "apiUrl": "https://api.bentley.com",
  "authorizationType": "Interactive",
  "clientId": "native-abc123",
  "expirationDate": "2026-02-24T12:00:00.000Z",
  "issuerUrl": "https://ims.bentley.com/"
}
```

**Not authenticated** — response has only `apiUrl` and `issuerUrl`, with no `authorizationType`:
```json
{
  "apiUrl": "https://api.bentley.com",
  "issuerUrl": "https://ims.bentley.com/"
}
```

**Rule**: If the response lacks `authorizationType`, the user is not logged in. Also check `expirationDate` — if it's in the past, the token is expired and the user needs to re-authenticate.

### Interpreting `itp context info --json` output

**Context set** — response includes saved IDs:
```json
{
  "iModelId": "809f56a3-...",
  "iTwinId": "db3633bc-..."
}
```

**No context** — empty output (blank/no JSON) or `{}`. This means no iTwin or iModel IDs are saved. The user will need to provide `--itwin-id` and `--imodel-id` explicitly, or use `--save` on create commands.

## Setup Flow

### 0. Install the iTwin CLI

Check if the CLI is available and up to date:

```bash
itp --version
```

**If the command fails** (`command not found`), the CLI must be installed.

**If the version is older than `1.0.0`** (e.g., `0.0.0`), many commands used in this workflow won't exist. The user needs to update to the latest version.

In either case, install or upgrade automatically using the scripts below. These download the latest release from GitHub and install it. **Ask the user for confirmation before running install commands**, as they require elevated permissions.

#### macOS (automated)

Detects arm64 vs x64 automatically. Requires `sudo` for the `.pkg` installer.

```bash
ARCH=$(uname -m)
if [ "$ARCH" = "arm64" ]; then ASSET_ARCH="arm64"; else ASSET_ARCH="x64"; fi
PKG_URL=$(curl -s https://api.github.com/repos/iTwin/itwin-cli/releases/latest \
  | grep "browser_download_url.*${ASSET_ARCH}-macos.pkg" \
  | head -1 | cut -d '"' -f 4)
curl -fSL -o /tmp/itp.pkg "$PKG_URL"
sudo installer -pkg /tmp/itp.pkg -target /
rm /tmp/itp.pkg
```

#### Linux (automated — Debian/Ubuntu)

Detects amd64 vs arm64 automatically. Requires `sudo` for `dpkg`.

```bash
ARCH=$(uname -m)
if [ "$ARCH" = "aarch64" ]; then ASSET_ARCH="arm64"; else ASSET_ARCH="amd64"; fi
DEB_URL=$(curl -s https://api.github.com/repos/iTwin/itwin-cli/releases/latest \
  | grep "browser_download_url.*${ASSET_ARCH}-deb.deb" \
  | head -1 | cut -d '"' -f 4)
curl -fSL -o /tmp/itp.deb "$DEB_URL"
sudo dpkg -i /tmp/itp.deb
rm /tmp/itp.deb
```

#### Windows (automated — PowerShell)

Detects x64 vs arm64 vs x86 automatically.

```powershell
$arch = if ([Environment]::Is64BitOperatingSystem) {
  if ($env:PROCESSOR_ARCHITECTURE -eq 'ARM64') { 'arm64' } else { 'x64' }
} else { 'x86' }
$release = Invoke-RestMethod https://api.github.com/repos/iTwin/itwin-cli/releases/latest
$asset = $release.assets | Where-Object { $_.name -match "$arch-win\.exe$" } | Select-Object -First 1
$installer = Join-Path $env:TEMP 'itp-installer.exe'
Invoke-WebRequest -Uri $asset.browser_download_url -OutFile $installer
Start-Process -FilePath $installer -Wait
Remove-Item $installer
```

#### Manual download

If automated install is not possible, direct the user to: **[GitHub Releases](https://github.com/iTwin/itwin-cli/releases/latest)**

After installation, verify by running `itp --version` again. Confirm the version is `1.0.0` or later. If the command is still not found, the user may need to restart their terminal or add the install location to their `PATH`.

### 1. Authenticate

Check auth first:

```bash
itp auth info --json
```

If the response lacks `authorizationType`, the user is not logged in. Determine the right auth path:

- **Interactive (user at a desktop)**: Run `itp auth login`. Browser opens, user signs in at Bentley IMS, returns. This is the default.
- **Headless (CI/AI agent/automation)**: Set `ITP_SERVICE_CLIENT_ID` and `ITP_SERVICE_CLIENT_SECRET` env vars, then run `itp auth login --json`. No browser needed.
- **Already logged in** (response has `authorizationType` and `expirationDate` in the future): move on.

For detailed auth guidance, see `auth-guide.md`.

### 2. Create Project (iTwin + iModel)

Ask for a single project name. Use it for both the iTwin and iModel unless the user explicitly provides separate names. Most users think of their work as one "project" — the iTwin/iModel distinction is infrastructure they don't need to care about yet.

> **"What would you like to name your project?"**

Then create both:

```bash
itp itwin create --class Endeavor --sub-class Project --name "<project name>" --save --json
itp imodel create --name "<project name>" --save --json
```

The `--save` flag stores the created IDs in local context. The second command automatically uses the saved iTwin ID — no need to pass it explicitly.

Always use `--class Endeavor --sub-class Project`.

After each creation, show the user a link to their resource on the developer portal:
- **After iTwin creation**: `https://developer.bentley.com/my-itwins/{iTwinId}/home/`
- **After iModel creation**: `https://developer.bentley.com/my-itwins/{iTwinId}/{iModelId}/home/`

Extract the IDs from the `--json` output of the create commands.

- For advanced users who specify separate names: use their preferred iTwin name and iModel name independently.

### 3. Upload Design Data

Ask where the design files are. Even if design files are visible in the current directory or workspace, always ask — never auto-select.

> **"Where are your design files? You can provide a file path, multiple files, or a folder."**

Three scenarios:

**Single file:**
```bash
itp imodel populate --file /path/to/design.dgn
```

**Multiple files:**
```bash
itp imodel populate --file /path/to/file1.dgn --file /path/to/file2.dwg
```

**Folder:** The CLI's `--file` flag expects individual files, not directories. If the user points to a folder:
1. List the directory contents.
2. Identify files with supported extensions: `.dgn`, `.dwg`, `.dxf`, `.rvt`, `.ifc`, `.nwd`, `.nwc`, `.shp`, `.geojson`, `.kml`, `.geodb`, `.skp`, `.obj`, `.fbx`, `.stl`, `.3dm`, `.3ds`, `.dae`, `.stp`, `.sat`, `.igs`, `.jt`, `.hln`, `.vue`, `.zip`, `.otxml`, `.land.xml`, `.x_t`. Note: `.csv` files are not auto-mapped to a connector — if the user has CSV data, they must specify `--connector-type` explicitly.
3. Construct the populate command with individual `--file` flags for each supported file found.
4. **Show the user the list of files found and the full command that will be run. Ask for explicit confirmation before executing.** Never run the populate command without user approval.
5. If no supported files are found, inform the user and suggest sample datasets (see below).

**If the user says they don't have design files**, offer sample datasets from the iTwin CLI repository:
- [ExtonCampus.dgn](https://raw.githubusercontent.com/iTwin/itwin-cli/main/examples/datasets/ExtonCampus.dgn)
- [HouseModel.dgn](https://raw.githubusercontent.com/iTwin/itwin-cli/main/examples/datasets/HouseModel.dgn)

```bash
curl -fSL -o ExtonCampus.dgn https://raw.githubusercontent.com/iTwin/itwin-cli/main/examples/datasets/ExtonCampus.dgn
itp imodel populate --file ExtonCampus.dgn
```

These files are hosted in the CLI's GitHub repo and are not bundled with the installed CLI.

Connector types are auto-detected from file extensions (e.g., `.dgn` → MSTN, `.dwg` → DWG, `.rvt` → REVIT). See `command-reference.md` for the full mapping. Override with `--connector-type` only when needed.

The populate command uploads to iTwin Storage, creates a sync connection, runs the synchronization, and polls until complete.

**Important: Do NOT use `--json` with populate.** The `--json` flag suppresses all progress logging, leaving the user with no feedback during a potentially long operation. Run populate without `--json` so the user sees status updates.

**Before running populate**, check the file size and tell the user what to expect:
```bash
ls -lh /path/to/design.dgn
```
Tell the user: "Uploading {filename} ({size}). Synchronization typically takes 1–5 minutes depending on file size. You'll see status updates every ~10 seconds."

**Progress behavior**: During synchronization, the CLI logs status updates approximately every 10 seconds:
```
Waiting for synchronization to complete for run ID: <id> with state: <state>
```

**Alternative: `--no-wait` with manual polling.** If the default wait behavior hangs or the user prefers not to block, use `--no-wait` and poll manually:
```bash
itp imodel populate --file /path/to/design.dgn --no-wait
```
This returns immediately with a connection ID and run ID. Then poll for status:
```bash
itp imodel connection run info --connection-id <connection-id> --connection-run-id <run-id> --json
```
Check the `state` field in the response. Terminal states are `Completed`. While syncing you'll see `Executing`, `Finalizing`, `Queued`, etc. Update the user between polls.

### 4. View in 3D

After synchronization completes, offer to visualize:

> **"Your data is synced. Would you like to view it in Cesium Sandcastle?"**

If the user agrees, run the command directly — don't show them the command or ask them to run it:

```bash
itp imodel view cesium-sandcastle --open
```

This exports the iModel as 3D tiles and opens a Cesium Sandcastle viewer in the browser. The user can orbit, zoom, and explore their design data in a geospatial context.

After running, confirm to the user that the viewer should have opened in their browser.

**Note on `--json` output**: The JSON output of this command contains a large encoded URL blob intended for programmatic use. Do not use `--json` here — use `--open` to open the viewer directly in the browser.

Optional: add `--terrain cesiumWorldTerrain` for terrain overlay.

### 5. Summary and Next Steps

After completing the flow, summarize what was created:

> **Here's what we set up:**
> - **iTwin**: {name} (ID: {id}) — [View on portal](https://developer.bentley.com/my-itwins/{iTwinId}/home/)
> - **iModel**: {name} (ID: {id}) — [View on portal](https://developer.bentley.com/my-itwins/{iTwinId}/{iModelId}/home/)
> - **Data**: {file(s)} synced via {connector} connector
> - **Viewer**: Cesium Sandcastle (link)
>
> **What you can do next:**
> - Update the iModel with newer design files: `itp imodel populate --file <new-file>`
> - Create a named version to bookmark this state: `itp imodel named-version create --name "v1.0"`
> - Add team members: see `itp access-control` commands

For advanced workflow patterns, see `workflows.md`.

## Resume Support

If the user returns mid-setup or says "continue my iTwin setup":

1. Run `itp --version` — check if CLI is installed and version is `1.0.0` or later.
2. Run `itp auth info --json` — check if still authenticated.
3. Run `itp context info --json` — check what IDs are saved.
4. Based on the state:
   - **CLI not installed or outdated**: start from Step 0.
   - **No auth**: start from Step 1.
   - **Auth OK, no iTwin**: start from Step 2.
   - **Auth OK, iTwin saved, no iModel**: create the iModel (Step 2, second command only).
   - **Auth OK, both saved**: ask if they want to upload data (Step 3) or view existing data (Step 4).
5. If an iModel already has data, offer to view it or upload additional files.

## Error Handling

Common issues and how to handle them:

- **"command not found: itp"**: CLI is not installed. Direct the user to install from [GitHub Releases](https://github.com/iTwin/itwin-cli/releases/latest).
- **"Command X not found"** (e.g., `auth:info not found`): The installed CLI version is too old. Run `itp --version` to confirm, and update from [GitHub Releases](https://github.com/iTwin/itwin-cli/releases/latest). Version `1.0.0` or later is required.
- **"User is not logged in"**: Run `itp auth login` (or headless equivalent).
- **"Please run itp auth login to re-authenticate"**: Interactive token expired. Re-run `itp auth login`.
- **File not found**: Verify the path. Check for typos, relative vs absolute paths.
- **"Unable to get extension from file name"**: The file has no recognized extension. Specify `--connector-type` manually.
- **Synchronization timeout**: Large files can take time. The command polls automatically, but for very large files, suggest `--no-wait` and checking back later.
- **"Unable to get root folder"**: The iTwin may not have storage initialized. Verify the iTwin ID in context is correct.
