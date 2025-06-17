# itp imodel connection sourcefile add

Add a source file to an existing storage connection of an iModel.

## Options

- **`-c, --connection-id`**  
  The ID of the storage connection to which the source file will be added.  
  **Type:** `string` **Required:** Yes

- **`--connector-type`**  
  The connector type for synchronization.  
  **Type:** `string` **Required:** Yes  
  **Valid Values:** `"AUTOPLANT"`, `"CIVIL"`, `"CIVIL3D"`, `"DWG"`, `"GEOSPATIAL"`, `"IFC"`, `"MSTN"`, `"NWD"`, `"OBD"`, `"OPENTOWER"`, `"PROSTRUCTURES"`, `"REVIT"`, `"SPPID"`, `"SPXREVIEW"`

- **`--storage-file-id`**  
  The storage file ID.  
  **Type:** `string` **Required:** Yes

## Examples

```bash
# Example 1: Add a source file to a storage connection
itp imodel connection sourcefile add --connection-id MWplZe9Uf0iR1IDMqyOMLqBN0_wHEVBGg_CzJmXdmE4 --storage-file-id t5bDFuN4qUa9ojVw1E5FGtldp8BgSbNCiJ2XMdiT-cA --connector-type MSTN
```

## API Reference

[Add Storage Connection SourceFile](https://developer.bentley.com/apis/synchronization/operations/add-storage-connection-sourcefile/)