# itp storage file list

List files in a folder of an iTwin's storage. Optionally, include subfolders in the result.

## Options

- **`-f, --folder-id`**  
  The ID of the folder whose files you want to list.  
  **Type:** `string` **Required:** Yes

- **`--include-folders`**  
  Whether to include subfolders in the result.  
  **Type:** `flag` **Required:** No

## Examples

```bash
# Example 1: List files in a specific folder
itp storage file list --folder-id TYJsPN0xtkWId0yUrXkS5pN5AQzuullIkxz5aDnDJSI

# Example 2: List files and include subfolders in the result
itp storage file list --folder-id TYJsPN0xtkWId0yUrXkS5pN5AQzuullIkxz5aDnDJSI --include-folders
```

## API Reference

[List Files in Folder](https://developer.bentley.com/apis/storage/operations/get-files-in-folder/)

[List Files and Folders in Folder](https://developer.bentley.com/apis/storage/operations/get-folders-and-files-in-folder/)