# itp storage folder list

List folders in a parent folder of an iTwin's storage. Optionally, include files in the result.

## Options

- **`--folder-id`**  
  The ID of the parent folder whose contents you want to list.  
  **Type:** `string` **Required:** Yes

- **`--include-files`**  
  Whether to include files in the result.  
  **Type:** `boolean` **Required:** No

## Examples

```bash
# Example 1: List all folders in a parent folder
itp storage folder list --folder-id a1b2c3d4-5678-90ab-cdef-1234567890ab

# Example 2: List all folders and files in a parent folder
itp storage folder list --folder-id a1b2c3d4-5678-90ab-cdef-1234567890ab --include-files true
```

## API Reference

[List Folders in Folder](https://developer.bentley.com/apis/storage/operations/get-folders-in-folder/)  
[List Folders and Files in Folder](https://developer.bentley.com/apis/storage/operations/get-folders-and-files-in-folder/)
