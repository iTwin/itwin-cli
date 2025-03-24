# itp imodel connection sourcefile list

List all source files in a specific storage connection.

## Options

- **`-c, --connection-id`**  
  The ID of the storage connection.  
  **Type:** `string` **Required:** Yes

- **`--top`**  
  Limit the number of source files returned.  
  **Type:** `integer` **Required:** No

- **`--skip`**  
  Skip a number of source files in the result.  
  **Type:** `integer` **Required:** No

## Examples

```bash
# Example 1: List all source files in a specific storage connection
itp imodel connection sourcefile list --connection-id bf4d8b36-25d7-4b72-b38b-12c1f0325f42

# Example 2: Limit the results to 10 source files
itp imodel connection sourcefile list --connection-id bf4d8b36-25d7-4b72-b38b-12c1f0325f42 --top 10

# Example 3: Skip the first 5 source files and return the next set
itp imodel connection sourcefile list --connection-id bf4d8b36-25d7-4b72-b38b-12c1f0325f42 --skip 5
```

## API Reference

[Get Storage Connection SourceFiles](https://developer.bentley.com/apis/synchronization/operations/get-storage-connection-sourcefiles/)
