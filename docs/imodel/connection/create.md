# itp imodel connection create

Create a storage connection that describes files from storage to synchronize with an iModel.

## Options

- **`-m, --imodel-id`**  
  The ID of the iModel.  
  **Type:** `string` **Required:** Yes

- **`-f, --file-id`**  
  The ID of the storage file to synchronize.  
  **Type:** `array` **Required:** Yes **Multiple:** Yes

- **`--connector-type`**
  The connector type of your file. Each connector will be used for the corresponding file in the files list (first connector for the first file, second connector for the second file, and so on).  
  **Type:** `array` **Required:** Yes **Multiple:** Yes  
  **Valid Values:** `"AUTOPLANT", "CIVIL", "CIVIL3D", "DWG", "GEOSPATIAL", "IFC", "MSTN", "NWD", "OBD", "OPENTOWER", "REVIT", "SPPID", "SPXREVIEW"`

- **`-n, --name`**  
  The display name of the storage connection.  
  **Type:** `string` **Required:** No

- **`--authentication-type`**  
  The authorization workflow type.  
  **Type:** `string` **Required:** No  
  **Valid Values:** `"User"`, `"Service"`

## Examples

```bash
# Example 1: Minimal example with only required options
itp imodel connection create --imodel-id ad0ba809-9241-48ad-9eb0-c8038c1a1d51 --file-id t5bDFuN4qUa9ojVw1E5FGtldp8BgSbNCiJ2XMdiT-cA --connector-type MSTN

# Example 2: Creating a connection with Service authentication
itp imodel connection create --imodel-id ad0ba809-9241-48ad-9eb0-c8038c1a1d51 --name "Engineering Files" --authentication-type Service --file-id t5bDFuN4qUa9ojVw1E5FGtldp8BgSbNCiJ2XMdiT-cA --connector-type MSTN --file-id g4ec1dc8c4f6173004f9f881914a57c5511a336d --connector-type DWG
```

## API Reference

[Create Storage Connection](https://developer.bentley.com/apis/synchronization/operations/create-storage-connection/)
