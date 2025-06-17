# itp storage file update-content

Specify which file in iTwin storage needs to have its content updated. This command is part of the 'Update iTwin storage file content' workflow:
1) Specify which file needs to have its content updated using 'itp storage file update-content' command.
2) Upload the updated file using 'itp storage file upload' command.
3) Confirm file content update using 'itp storage file update-complete' command.

## Options

- **`-f, --file-id`**  
  The ID of the file to update the content for.  
  **Type:** `string` **Required:** Yes

## Examples

```bash
# Example 1: Get URL to update file content
itp storage file update-content --file-id TYJsPN0xtkWId0yUrXkS5pN5AQzuullIkxz5aDnDJSI
```

## API Reference

[Update File Content](https://developer.bentley.com/apis/storage/operations/update-file-content/)