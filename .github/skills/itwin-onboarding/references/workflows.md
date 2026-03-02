# Advanced Workflows

Patterns beyond initial onboarding. These assume an authenticated session with iTwin and iModel IDs already in context.

## Update iModel with New or Changed Files

Re-run populate with the updated file(s). The CLI handles re-upload and re-sync automatically — it updates existing files in storage rather than duplicating them.

```bash
itp imodel populate --file /path/to/updated-design.dgn
```

For multiple updated files:
```bash
itp imodel populate --file file1.dgn --file file2.dwg
```

## Create a Named Version

Bookmark the current state of the iModel after a sync completes. Useful for milestones, releases, or before making major changes.

```bash
itp imodel named-version create --name "Milestone 1" --json
```

List existing versions:
```bash
itp imodel named-version list --json
```

## Multi-File with Mixed Connector Types

> **Beyond Onboarding** — The workflows below cover day-2 operations: multi-connector uploads, changeset history, access control, sharing, repository management, storage, changed elements tracking, and automation patterns.

When uploading files that need different connectors (e.g., a .dgn with CIVIL connector and a .rvt), specify connector types explicitly:

```bash
itp imodel populate \
  --file site.dgn --connector-type CIVIL \
  --file building.rvt --connector-type REVIT \
  --json
```

Rules for `--connector-type`:
- **Omitted**: all files auto-mapped from extension
- **One connector**: applied to all files
- **Multiple connectors**: must match the number of files (1:1 mapping)

## View Changeset History

After multiple syncs, inspect the changeset timeline:

```bash
itp imodel changeset list --json
```

View a specific changeset:
```bash
itp imodel changeset info --changeset-id <id> --json
```

## Access Control — Add Team Members

Add users to the iTwin with specific roles:

```bash
# List available roles
itp access-control role list --json

# Add a user as a member
itp access-control member user add --email user@company.com --role-id <role-id> --json
```

For bulk additions, create a group and add members to it:

```bash
itp access-control group create --name "Design Team" --json
itp access-control member group add --group-id <group-id> --role-id <role-id> --json
```

## Add Multiple Owners

```bash
itp access-control member owner add --email owner@company.com --json
```

## Share an iTwin

Share the iTwin with external users who don't need full member access:

```bash
itp itwin share create --email collaborator@external.com --json
```

List current shares:
```bash
itp itwin share list --json
```

## iTwin Repository Management

Link external repositories to an iTwin:

```bash
itp itwin repository list --json
itp itwin repository create --class "GeographicInformationSystem" --uri "https://example.com/repo" --json
```

## Storage Management

Manage files in iTwin Storage directly:

```bash
# List files in root folder
itp storage root-folder --json

# Upload a file
itp storage file upload --folder-id <folder-id> --file /path/to/file --json

# List folder contents
itp storage folder list --folder-id <folder-id> --json
```

## Changed Elements Tracking

Enable change tracking to see what elements changed between iModel versions:

```bash
# Enable tracking
itp changed-elements enable --json

# Compare two changesets
itp changed-elements comparison --start-changeset-id <id1> --end-changeset-id <id2> --json
```

## Automation Pattern — Scripted Full Workflow

A complete scripted workflow for CI/CD or batch processing:

```bash
export ITP_SERVICE_CLIENT_ID="service-xxxxx"
export ITP_SERVICE_CLIENT_SECRET="your-secret"

itp auth login --json

itp itwin create --class Endeavor --sub-class Project --name "Automated Project" --save --json
itp imodel create --name "Automated Project" --save --json

itp imodel populate --file /data/model.dgn --json

itp imodel named-version create --name "Initial Import" --json
```

For ongoing updates, keep the context set and re-run populate as files change:

```bash
itp imodel populate --file /data/model-updated.dgn --json
itp imodel named-version create --name "Update $(date +%Y-%m-%d)" --json
```
