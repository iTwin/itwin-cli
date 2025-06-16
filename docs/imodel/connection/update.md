# itp imodel connection update

Update an existing storage connection of an iModel.

## Options

- **`-c, --connection-id`**  
  The ID of the storage connection to update.  
  **Type:** `string` **Required:** Yes

- **`--authentication-type`**  
  The authorization workflow type.  
  **Type:** `string` **Required:** No  
  **Valid Values:** `"User"`, `"Service"`

- **`-n, --name`**  
  The new display name for the storage connection.  
  **Type:** `string` **Required:** No

## Examples

```bash
# Example 1: Updating a connection with a new display name
itp imodel connection update --connection-id MWplZe9Uf0iR1IDMqyOMLuL24kbZK4VNvgn4ev3etXI --name "Updated Project Files"

# Example 2: Changing authentication type for a connection
itp imodel connection update --connection-id MWplZe9Uf0iR1IDMqyOMLuL24kbZK4VNvgn4ev3etXI --authentication-type Service
```

## API Reference

[Update Storage Connection](https://developer.bentley.com/apis/synchronization/operations/update-storage-connection/)