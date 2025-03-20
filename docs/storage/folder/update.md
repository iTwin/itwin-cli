# itp storage folder update

Update the metadata of a folder in an iTwin's storage, such as its display name or description.

## Options

- **`--folder-id`**  
  The ID of the folder to be updated.  
  **Type:** `string` **Required:** Yes

- **`--display-name`**  
  The new display name for the folder.  
  **Type:** `string` **Required:** No

- **`--description`**  
  A description for the folder.  
  **Type:** `string` **Required:** No

## Examples

```bash
# Example 1: Update folder display name
itp storage folder update --folder-id a1b2c3d4-5678-90ab-cdef-1234567890ab --display-name "Updated Project Documents"

# Example 2: Update folder display name and description
itp storage folder update --folder-id b2c3d4e5-6789-01ab-cdef-2345678901bc --display-name "Updated Design Files" --description "Folder containing updated design documents"
```

## API Reference

[Update Folder](https://developer.bentley.com/apis/storage/operations/update-folder/)
