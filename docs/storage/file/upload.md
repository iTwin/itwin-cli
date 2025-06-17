# itp storage file upload

Upload a new or updated file to the specified URL within iTwin storage. This command is part of the following workflows:

'Upload File to iTwin storage' workflow:
1) Create an empty file with provided metadata using 'itp storage file create' command.
2) Upload the file using 'itp storage file upload' command.
3) Confirm file upload using 'itp storage file update-complete' command.

'Update iTwin storage file content' workflow:
1) Specify which file needs to have its content updated using 'itp storage file update-content' command.
2) Upload the updated file using 'itp storage file upload' command.
3) Confirm file content update using 'itp storage file update-complete' command.

## Options

- **`-f, --file-path`**  
  The path to the file you want to upload.  
  **Type:** `string` **Required:** Yes

- **`-u, --upload-url`**  
  The URL where the file should be uploaded.  
  **Type:** `string` **Required:** Yes

## Examples

```bash
# Example 1: Upload a PDF file to the storage
itp storage file upload --upload-url https://example.com/upload-url --file-path /path/to/your/file.pdf

# Example 2: Upload an image file to the storage
itp storage file upload --upload-url https://example.com/image-upload-url --file-path /path/to/your/image.jpg
```

## API Reference

[Create File](https://developer.bentley.com/apis/storage/operations/create-file/)

[Upload File to iTwin storage](/docs/workflows/itwin-upload-files-storage)