# itp storage file update

Update the metadata of a file in an iTwin's storage, such as display name or description.

## Options

- **`-f, --file-id`**  
  The ID of the file to be updated.  
  **Type:** `string` **Required:** Yes

- **`-d, --description`**  
  A description for the file.  
  **Type:** `string` **Required:** No

- **`-n, --name`**  
  The new display name for the file.  
  **Type:** `string` **Required:** No

## Examples

```bash
# Example 1: Update file display name
itp storage file update --file-id TYJsPN0xtkWId0yUrXkS5pN5AQzuullIkxz5aDnDJSI --name "Updated Design File"

# Example 2: Update file description and display name
itp storage file update --file-id TYJsPN0xtkWId0yUrXkS5pN5AQzuullIkxz5aDnDJSI --name "New Model File" --description "Updated model with new specifications"
```

## API Reference

[Update File](https://developer.bentley.com/apis/storage/operations/update-file/)