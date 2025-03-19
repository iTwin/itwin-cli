# itp imodel populate

Synchronize design files into an iModel.

## Options

- **`--imodel-id`**  
  The ID of the iModel to populate.  
  **Type:** `string` **Required:** Yes

- **`--file`**  
  A list of source files to synchronize into the iModel.
  **Type:** `string`  **Required:** Yes **Multiple:** Yes

- **`--connector-type`**  
  Specify connectors to prioritize for synchronization. This flag can be provided multiple times. If only one connector is specified, it will be used for all files. If multiple connectors are specified, each connector will be used for the corresponding file in the files list (first connector for the first file, second connector for the second file, and so on). 
  **Type:** `string` **Required:** No  **Multiple:** Yes
  **Valid Values:** `"SHELLEDWCSV"`, `"CIVIL"`, `"MSTN"`, `"OBD"`, `"PROSTRUCTURES"`, `"AUTOPLANT"`, `"AVEVAPID"`, `"CIVIL3D"`, `"DWG"`, `"IFC"`, `"GEOSPATIAL"`, `"OPENTOWER"`, `"REVIT"`, `"SPPID"`, `"SPXREVIEW"`, `"AVEVADIAGRAMS"`, `"NWD"`, `"INTELLIPID"`, `"PSEXCEL"`

## Examples

```bash
# Example 1: Synchronizing DWG Files
itp imodel populate --imodel-id "b1a2c3d4-5678-90ab-cdef-1234567890ab" --file "file1.dwg" --connector-type "DWG" --file "file2.dwg" --connector-type "DWG"

# Example 2: Synchronizing DGN Files
itp imodel populate --imodel-id "c2d3e4f5-6789-01ab-cdef-2345678901bc" --file "site1.dgn" --connector-type "CIVIL" --file "structure2.dgn" --connector-type "CIVIL"

# Example 3: Synchronizing CSV and IFC Files
itp imodel populate --imodel-id "d3e4f5g6-7890-12ab-cdef-3456789012cd" --file "data1.csv" --file "data2.csv" --file "model.ifc"

# Example: Synchronizing Revit and DGN Files
itp imodel populate --imodel-id "i9j0k1l2-3456-78ab-cdef-9012345678ij" --file "model.rvt" --file "design.dgn"
```

## Workflow Reference

- [Synchronization](/combined-commands/synchronization)
