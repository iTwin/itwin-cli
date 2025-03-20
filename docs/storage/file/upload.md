# itp storage file upload

Upload a new file to a specified URL within iTwin storage.

## Options

- **`--upload-url`**  
  The URL where the file should be uploaded.  
  **Type:** `string` **Required:** Yes

- **`--file-path`**  
  The path to the file you want to upload.  
  **Type:** `string` **Required:** Yes

## Examples

```bash
# Example 1: Upload a PDF file to the storage
itp storage file upload --upload-url https://example.com/upload-url --file-path /path/to/your/file.pdf

# Example 2: Upload an image file to the storage
itp storage file upload --upload-url https://example.com/image-upload-url --file-path /path/to/your/image.jpg
```

## API Reference

[Upload File](https://developer.bentley.com/apis/storage/operations/upload-file/)
