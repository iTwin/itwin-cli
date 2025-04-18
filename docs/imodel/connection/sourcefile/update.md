# itp imodel connection sourcefile update

Update an existing source file in a storage connection of an iModel.

## Options

- **`-c, --connection-id`**  
  The ID of the storage connection.  
  **Type:** `string` **Required:** Yes

- **`--connector-type`**  
  The connector type for synchronization.  
  **Type:** `string` **Required:** Yes  
  **Valid Values:** `"AUTOPLANT"`, `"CIVIL"`, `"CIVIL3D"`, `"DWG"`, `"IFC"`, `"MSTN"`, `"REVIT"`

- **`--source-file-id`**  
  The source file ID to update.  
  **Type:** `string` **Required:** Yes

## Examples

```bash
itp imodel connection sourcefile update --connection-id bf4d8b36-25d7-4b72-b38b-12c1f0325f42 --source-file-id 297c8ab9-53a3-4fe5-adf8-79b4c1a95cbb --connector-type DWG
```

## API Reference

[Update Storage Connection SourceFile](https://developer.bentley.com/apis/synchronization/operations/update-storage-connection-sourcefile/)