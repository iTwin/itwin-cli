# global options

These options are available across all CLI commands:

- **`-t, --table`** – Output response in a human-readable table.  
- **`-j, --json`** – Pretty-print JSON output, suppress all logging.  
- **`-h, --help`** – Show help for the command, including usage and available options.  

## Examples

```bash
# Output as a table
itp itwin list --sub-class Project --table

# Output as pretty JSON
itp itwin list --sub-class Project --json

# Show help for a specific command
itp itwin list --help

# Show help and subcommands for a base command
itp --help
itp itwin --help
```
