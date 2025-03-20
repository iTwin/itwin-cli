# itp imodel connection run list

List all runs for a specific storage connection.

## Options

- **`-c, --connection-id`**  
  The ID of the storage connection.  
  **Type:** `string` **Required:** Yes

- **`--top`**  
  Limit the number of runs returned.  
  **Type:** `integer` **Required:** No

- **`--skip`**  
  Skip a number of runs in the result.  
  **Type:** `integer` **Required:** No

## Examples

```bash
# Example 1: List all runs for a specific connection
itp imodel connection run list --connection-id "bf4d8b36-25d7-4b72-b38b-12c1f0325f42"

# Example 2: Limit the results to 10 runs
itp imodel connection run list --connection-id "bf4d8b36-25d7-4b72-b38b-12c1f0325f42" --top 10

# Example 3: Skip the first 5 runs and return the next set
itp imodel connection run list --connection-id "bf4d8b36-25d7-4b72-b38b-12c1f0325f42" --skip 5
```

## API Reference

[Get Storage Connection Runs](https://developer.bentley.com/apis/synchronization/operations/get-storage-connection-runs/)
