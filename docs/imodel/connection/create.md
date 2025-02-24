# itp imodel connection create

Create a storage connection that describes files from storage to synchronize with an iModel.

## Options

- **`--imodel-id`**  
  The ID of the iModel.  
  **Type:** `string` **Required:** Yes

- **`--source-files`**  
  A list of source files to synchronize.  
  **Type:** `array` **Required:** Yes

- **`--display-name`**  
  The display name of the storage connection.  
  **Type:** `string` **Required:** No

- **`--authentication-type`**  
  The authorization workflow type.  
  **Type:** `string` **Required:** No  
  **Valid Values:** `"User"`, `"Service"`

## Examples

```bash
# Example 1: Minimal example with only required options
itp imodel connection create --imodel-id "ad0ba809-9241-48ad-9eb0-c8038c1a1d51" --source-files "file1.dwg file2.dgn"

# Example 2: Creating a connection with Service authentication
itp imodel connection create --imodel-id "ad0ba809-9241-48ad-9eb0-c8038c1a1d51" --display-name "Engineering Files" --authentication-type "Service" --source-files "blueprints.pdf model.ifc"
```

## API Reference

[Create Storage Connection](https://developer.bentley.com/apis/synchronization/operations/create-storage-connection/)
