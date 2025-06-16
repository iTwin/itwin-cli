# itp imodel connection sourcefile update

Update an existing source file in a storage connection of an iModel.

## Options

- **`-c, --connection-id`**  
  The ID of the storage connection.  
  **Type:** `string` **Required:** Yes

- **`--connector-type`**  
  The connector type for synchronization.  
  **Type:** `string` **Required:** Yes  
  **Valid Values:** `"AUTOPLANT"`, `"CIVIL"`, `"CIVIL3D"`, `"DWG"`, `"GEOSPATIAL"`, `"IFC"`, `"MSTN"`, `"NWD"`, `"OBD"`, `"OPENTOWER"`, `"PROSTRUCTURES"`, `"REVIT"`, `"SPPID"`, `"SPXREVIEW"`

- **`--source-file-id`**  
  The source file ID to update.  
  **Type:** `string` **Required:** Yes

- **`--storage-file-id`**  
  The storage file ID to update to.  
  **Type:** `string` **Required:** Yes

## Examples

```bash
itp imodel connection sourcefile update --connection-id MWplZe9Uf0iR1IDMqyOMLqBN0_wHEVBGg_CzJmXdmE4 --source-file-id 297c8ab9-53a3-4fe5-adf8-79b4c1a95cbb --connector-type DWG --storage-file-id u9E_00ckVU6sdWnH_vnk-bPJEu3c_VVItnIkNDWlTy0
```

## API Reference

[Update Storage Connection SourceFile](https://developer.bentley.com/apis/synchronization/operations/update-storage-connection-sourcefile/)