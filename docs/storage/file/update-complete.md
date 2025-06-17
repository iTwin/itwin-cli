# itp storage file update-complete

Complete the file creation or content update process by marking the operation as done. This command is part of the following workflows:

'Upload File to iTwin storage' workflow:
1) Create an empty file with provided metadata using 'itp storage file create' command.
2) Upload the file using 'itp storage file upload' command.
3) Confirm file upload using 'itp storage file update-complete' command.

'Update iTwin storage file content' workflow:
1) Specify which file needs to have its content updated using 'itp storage file update-content' command.
2) Upload the updated file using 'itp storage file upload' command.
3) Confirm file content update using 'itp storage file update-complete' command.

## Options

- **`-f, --file-id`**  
  The ID of the file for which the creation or update is being completed.    
  **Type:** `string` **Required:** Yes

## Examples

```bash
# Example 1: Complete the file creation or update process
itp storage file update-complete --file-id TYJsPN0xtkWId0yUrXkS5pN5AQzuullIkxz5aDnDJSI
```

## API Reference

[Complete File Creation](https://developer.bentley.com/apis/storage/operations/complete-file-creation/)

[Upload File to iTwin storage](/docs/workflows/itwin-upload-files-storage)