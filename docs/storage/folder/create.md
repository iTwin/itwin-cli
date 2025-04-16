# itp storage folder create

Create a new folder in a specified parent folder in iTwin's storage.

## Options

- **`-n, --name`**  
  The display name of the folder to be created.  
  **Type:** `string` **Required:** Yes

- **`--parent-folder-id`**  
  The ID of the parent folder where the new folder will be created.  
  **Type:** `string` **Required:** Yes

- **`-d, --description`**  
  A description of the folder.  
  **Type:** `string` **Required:** No

## Examples

```bash
# Example 1: Create a folder inside the root folder with a description
#Note: You can retrieve the root folder ID using the 'itp storage root-folder' command.
itp storage folder create --parent-folder-id ROOT_FOLDER_ID_HERE --name "Project Documents" --description "Folder for all project-related documents"

# Example 2: Create a subfolder inside an existing folder
itp storage folder create --parent-folder-id b2c3d4e5-6789-01ab-cdef-2345678901bc --name "Design Files"
```

## API Reference

[Create Folder](https://developer.bentley.com/apis/storage/operations/create-folder/)