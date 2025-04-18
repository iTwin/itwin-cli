# itp storage root-folder

Retrieve the top-level folders and files in an iTwin's storage.

## Options

- **`-i, --itwin-id`**  
  The ID of the iTwin whose top-level folders and files you want to retrieve.  
  **Type:** `string` **Required:** Yes

- **`--skip`**  
  The skip query option requests the number of items in the queried collection that are to be skipped and not included in the result.  
  **Type:** `integer` **Required:** No

- **`--top`**  
  The top system query option requests the number of items in the queried collection to be included in the result.  
  **Type:** `integer` **Required:** No

## Examples

```bash
itp storage root-folder --itwin-id ad0ba809-9241-48ad-9eb0-c8038c1a1d51
```

## API Reference

[Get Top-Level Folders and Files](https://developer.bentley.com/apis/storage/operations/get-top-level-folders-and-files-by-project/)