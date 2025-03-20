# itp imodel connection update

Update an existing storage connection of an iModel.

## Options

- **`--connection-id`**  
  The ID of the storage connection to update.  
  **Type:** `string` **Required:** Yes

- **`--display-name`**  
  The new display name for the storage connection.  
  **Type:** `string` **Required:** No

- **`--authentication-type`**  
  The authorization workflow type.  
  **Type:** `string` **Required:** No  
  **Valid Values:** `"User"`, `"Service"`

## Examples

```bash
# Example 1: Updating a connection with a new display name
itp imodel connection update --connection-id bf4d8b36-25d7-4b72-b38b-12c1f0325f42 --display-name "Updated Project Files"

# Example 2: Changing authentication type for a connection
itp imodel connection update --connection-id bf4d8b36-25d7-4b72-b38b-12c1f0325f42 --authentication-type Service
```

## API Reference

[Update Storage Connection](https://developer.bentley.com/apis/synchronization/operations/update-storage-connection/)
