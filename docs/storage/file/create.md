# itp storage file create

Create an empty file with provided metadata in a specified folder in iTwin storage. This command is part of the 'Upload File to iTwin storage' workflow:
1) Create an empty file with provided metadata using 'itp storage file create' command.
2) Upload the file using 'itp storage file upload' command.
3) Confirm file upload using 'itp storage file update-complete' command.

## Options

- **`-f, --folder-id`**  
  The ID of the folder where the file will be created.  
  **Type:** `string` **Required:** Yes

- **`-n, --name`**  
  The display name of the file.  
  **Type:** `string` **Required:** Yes

- **`-d, --description`**  
  A description for the file.  
  **Type:** `string` **Required:** No

## Examples

```bash
# Example 1: Creating a file with display name only
itp storage file create --folder-id TYJsPN0xtkWId0yUrXkS5pN5AQzuullIkxz5aDnDJSI --name design.dwg

# Example 2: Creating a file with display name and description
itp storage file create --folder-id TYJsPN0xtkWId0yUrXkS5pN5AQzuullIkxz5aDnDJSI --name model.ifc --description "Model file for the building design"
```

## API Reference

[Create File](https://developer.bentley.com/apis/storage/operations/create-file/)

[Upload File to iTwin storage](/docs/workflows/itwin-upload-files-storage)