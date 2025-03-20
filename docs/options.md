# global options

These options are available across all commands in the CLI.

- **`--table`**  
  Output the command response in a human-readable table format.  
  **Type:** `flag` **Required:** No

- **`--json`**  
  Pretty format the JSON command response and supress all logging.
  **Type:** `flag` **Required:** No

## Examples

```bash
# Example 1: Using the --table option
itp itwin list --sub-class Project --table

# Example 2: Using the --json option
itp itwin list --sub-class Project --json
```