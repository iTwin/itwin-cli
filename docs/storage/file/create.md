# itp storage file create

Create a new file in a specified folder in iTwin's storage.

## Options

- **`-f, --folder-id`**  
  The ID of the folder where the file will be created.  
  **Type:** `string` **Required:** Yes

- **`-n, --display-name`**  
  The display name of the file.  
  **Type:** `string` **Required:** Yes

- **`-d, --description`**  
  A description for the file.  
  **Type:** `string` **Required:** No

## Examples

```bash
# Example 1: Creating a file with display name only
itp storage file create --folder-id abc12345-6789-4321-abcd-9876543210ef --display-name design.dwg

# Example 2: Creating a file with display name and description
itp storage file create --folder-id abc12345-6789-4321-abcd-9876543210ef --display-name model.ifc --description "Model file for the building design"
```

## API Reference

[Create File](https://developer.bentley.com/apis/storage/operations/create-file/)
