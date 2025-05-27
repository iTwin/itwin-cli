# itp imodel connection create

Create a storage connection that describes files from storage to synchronize with an iModel.

## Options

- **`--connector-type`**  
  Specify connectors to use for synchronization. This option can be provided multiple times. If a single connector-type option is provided, it will be matched to all file-id options. If multiple connectors are provided, each of them will be matched to a file by position: the first connector will be used for the first file, the second connector for the second file, and so on.  
  **Type:** `string` **Required:** Yes **Multiple:** Yes 
  **Valid Values:** `"AUTOPLANT"`, `"AVEVAPID"`, `"CIVIL"`, `"CIVIL3D"`, `"DWG"`, `"GEOSPATIAL"`, `"IFC"`, `"MSTN"`, `"NWD"`, `"OBD"`, `"OPENTOWER"`, `"PROSTRUCTURES"`, `"REVIT"`, `"SPPID"`, `"SPXREVIEW"`

- **`-f, --file-id`**  
  The ID of the storage file to synchronize  
  **Type:** `string` **Required:** Yes **Multiple:** Yes

- **`-m, --imodel-id`**  
  The ID of the iModel.  
  **Type:** `string` **Required:** Yes

- **`--authentication-type`**  
  The authorization workflow type. Default value depends on currently used authentication type as follows: Interactive login -> 'User', Service Client login -> 'Service'  
  **Type:** `string` **Required:** No  
  **Valid Values:** `"User"`, `"Service"`

- **`-n, --name`**  
  The display name of the storage connection.  
  **Type:** `string` **Required:** No

## Examples

```bash
# Example 1: Minimal example with only required options
itp imodel connection create --imodel-id ad0ba809-9241-48ad-9eb0-c8038c1a1d51 --file-id t5bDFuN4qUa9ojVw1E5FGtldp8BgSbNCiJ2XMdiT-cA --connector-type MSTN

# Example 2: Creating a connection with Service authentication
itp imodel connection create --imodel-id ad0ba809-9241-48ad-9eb0-c8038c1a1d51 --name "Engineering Files" --authentication-type Service --file-id t5bDFuN4qUa9ojVw1E5FGtldp8BgSbNCiJ2XMdiT-cA --connector-type MSTN --file-id g4ec1dc8c4f6173004f9f881914a57c5511a336d --connector-type DWG
```

## API Reference

[Create Storage Connection](https://developer.bentley.com/apis/synchronization/operations/create-storage-connection/)