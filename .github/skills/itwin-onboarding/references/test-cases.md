# Test Cases

Trigger tests, functional tests, and success criteria for the `itwin-onboarding` skill.

## Trigger Tests

### Should Trigger

| Prompt | Why |
|--------|-----|
| "Help me set up an iTwin" | Direct onboarding request |
| "Create a new project" | Natural language for iTwin + iModel creation |
| "Upload a DGN file" | File upload / populate intent |
| "View my iModel in 3D" | Visualization step |
| "Get started with iTwin" | Explicit onboarding intent |
| "I want to create a digital twin" | Core concept match |
| "Populate my iModel" | Direct command intent |
| "How do I use the iTwin CLI?" | CLI onboarding question |
| "Set up a new infrastructure project" | Trigger phrase in description |
| "Upload my design" | Natural phrasing for populate flow |

### Should NOT Trigger

| Prompt | Why |
|--------|-----|
| "Help me write TypeScript" | General coding — no iTwin relevance |
| "Debug my React app" | Frontend debugging — no iTwin relevance |
| "What's the weather?" | Completely unrelated |
| "Create a spreadsheet" | No iTwin context |

## Functional Tests

### 1. Golden Path — Fresh Start to 3D View

**Setup**: No CLI installed, no auth, no context.

**Steps**:
1. User says "Help me get started with iTwin"
2. Skill detects CLI not installed → offers install script → user confirms → CLI installed
3. Skill runs `itp auth login` → user authenticates
4. Skill asks for project name → creates iTwin + iModel with `--save`
5. Skill asks where design files are → user provides a file path → confirmation shown → populate runs
6. Skill offers 3D view → runs `itp imodel view cesium-sandcastle --open`

**Success criteria**:
- All 5 golden path steps complete
- ≤10 CLI commands total
- 0 failed commands
- `itp imodel populate` never runs without the user seeing the file list and confirming

### 2. Resume from Partial Completion

**Setup**: CLI installed, auth valid, iTwin created and saved in context, no iModel yet.

**Steps**:
1. User says "Continue my iTwin setup"
2. Skill checks version → OK, checks auth → OK, checks context → iTwin ID present, no iModel ID
3. Skill skips to creating iModel → asks for name (or reuses iTwin name)
4. Continues through Steps 3–4

**Success criteria**:
- Correctly detects partial state and resumes at the right step
- Does not re-create the iTwin

### 3. No Design Files Fallback

**Setup**: CLI installed, auth valid, iTwin + iModel created.

**Steps**:
1. Skill asks "Where are your design files?"
2. User says "I don't have any design files"
3. Skill offers sample datasets (ExtonCampus.dgn, HouseModel.dgn) with download commands
4. User picks one → skill downloads and populates

**Success criteria**:
- Samples are only offered after user says they don't have files
- Samples are NOT presented alongside the initial "where are your files?" prompt

### 4. Folder with Mixed File Types

**Setup**: CLI installed, auth valid, iTwin + iModel created. User has a folder with: `model.dgn`, `plan.dwg`, `readme.txt`, `notes.pdf`.

**Steps**:
1. User provides a folder path
2. Skill lists contents, identifies `model.dgn` and `plan.dwg` as supported
3. Skill shows the user the file list and the constructed `itp imodel populate` command
4. Skill asks for confirmation before executing
5. User confirms → command runs

**Success criteria**:
- `readme.txt` and `notes.pdf` are excluded (unsupported extensions)
- User sees the exact file list and command before execution
- Command does NOT run without explicit confirmation

## Success Criteria

| Metric | Target |
|--------|--------|
| Golden path completes in | ≤10 CLI commands |
| Failed commands per workflow | 0 |
| User figures out next step themselves | Never — skill always guides |
| `itp imodel populate` runs without confirmation | Never |
| Sample datasets offered before asking for user files | Never |
