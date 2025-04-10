# Environment

To reduce repetition and simplify usage, the CLI provides flexible ways to define your commonly used `iTwin` and `iModel` IDs. Once set, you can run commands without manually passing these IDs every time.

The CLI supports two mechanisms for this:

1. **Environment variables** — set manually in your terminal or CI environment
2. **Local context** — managed via the `itp context` command

Either approach can help streamline your workflow.

---

### Setting environment variables

You can define your default IDs directly in the terminal environment:

```bash
// For macOS, Linux, WSL, Git Bash
export ITP_ITWIN_ID=b1a2c3d4-5678-90ab-cdef-1234567890ab
export ITP_IMODEL_ID=ad0ba809-9241-48ad-9eb0-c8038c1a1d51
```

```powershell
// For PowerShell (Windows)
$env:ITP_ITWIN_ID = "b1a2c3d4-5678-90ab-cdef-1234567890ab"
$env:ITP_IMODEL_ID = "ad0ba809-9241-48ad-9eb0-c8038c1a1d51"
```

These values will be automatically picked up in commands unless overridden by context or flags.

---

### Using the `context` system

The `itp context` command allows you to **save default iTwin and iModel IDs locally**. Once set, these values will persist across CLI sessions and be automatically used in commands.

- Set context:

  ```bash
  itp context set --itwin-id <iTwinId> --imodel-id <iModelId>
  ```

- View current context:

  ```bash
  itp context info
  ```

- Clear context:

  ```bash
  itp context clear
  ```

> ℹ️ Context values take precedence over environment variables.

---

### Using the `--save` flag

You can also update the context automatically during iTwin or iModel creation by using the `--save` flag. This stores the newly created ID into the local context, making it available for subsequent commands.

- Save iTwin to context:

  ```bash
  itp itwin create --class Thing --sub-class Asset --name "Example iTwin" --save
  ```

- Save iModel to context:

  ```bash
  itp imodel create --name "Example iModel" --save
  ```

---

### Resolution Order

When determining which `iTwin ID` or `iModel ID` to use, the CLI resolves values in the following order:

1. **Explicit flags passed in the command**
2. **Values saved in `itp context`**
3. **Environment variables (`ITP_ITWIN_ID`, `ITP_IMODEL_ID`)**
4. **If none are provided → error**

---

### Examples

**Without environment or context**

```bash
itp itwin info --itwin-id b1a2c3d4-5678-90ab-cdef-1234567890ab

itp imodel populate   --imodel-id b1a2c3d4-5678-90ab-cdef-1234567890ab   --file file.dwg --connector-type DWG

itp imodel named-version create   --imodel-id ad0ba809-9241-48ad-9eb0-c8038c1a1d51   --changeset-id 2f3b4a8c92d747d5c8a8b2f9cde6742e5d74b3b5   --name "Version 1.0" --description "Initial release"
```

**With environment variables or context**

```bash
# Assuming context or env variables are already set
itp itwin info

itp imodel populate --file file.dwg --connector-type DWG

itp imodel named-version create   --changeset-id 2f3b4a8c92d747d5c8a8b2f9cde6742e5d74b3b5   --name "Version 1.0" --description "Initial design"
```

---

### Summary

- Passing `--itwin-id` or `--imodel-id` directly in a command will always override other sources.
- Values set via `itp context` are stored locally and persist across sessions.
- Environment variables (`ITP_ITWIN_ID`, `ITP_IMODEL_ID`) are ideal for scripting and temporary sessions.
- If no IDs are received from any method, the CLI will return a **missing option** error.
