# itp imodel connection run info

Retrieve details about a specific run of a storage connection.

## Options

- **`-c, --connection-id`**  
  The ID of the storage connection associated with the run.  
  **Type:** `string` **Required:** Yes

- **`--connection-run-id`**  
  The ID of the storage connection run.  
  **Type:** `string` **Required:** Yes

## Examples

```bash
itp imodel connection run info --connection-id MWplZe9Uf0iR1IDMqyOMLqBN0_wHEVBGg_CzJmXdmE4 --connection-run-id a1ecbdc8c4f6173004f9f881914a57c5511a362b
```

## API Reference

[Get Storage Connection Run](https://developer.bentley.com/apis/synchronization/operations/get-storage-connection-run/)