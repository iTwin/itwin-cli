# itp storage folder update

Update the metadata of a folder in an iTwin's storage, such as its display name or description.

## Options

- **`-f, --folder-id`**  
  The ID of the folder to be updated.  
  **Type:** `string` **Required:** Yes

- **`-d, --description`**  
  A description for the folder.  
  **Type:** `string` **Required:** No

- **`-n, --name`**  
  The new display name for the folder.  
  **Type:** `string` **Required:** No

## Examples

```bash
# Example 1: Update folder display name
itp storage folder update --folder-id TYJsPN0xtkWId0yUrXkS5pN5AQzuullIkxz5aDnDJSI --name "Updated Project Documents"

# Example 2: Update folder display name and description
itp storage folder update --folder-id TYJsPN0xtkWId0yUrXkS5pN5AQzuullIkxz5aDnDJSI --name "Updated Design Files" --description "Folder containing updated design documents"
```

## API Reference

[Update Folder](https://developer.bentley.com/apis/storage/operations/update-folder/)