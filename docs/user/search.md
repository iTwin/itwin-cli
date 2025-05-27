# itp user search

Search for users based on filter criteria.
NOTE: Only users in the same organization are returned by this command. Because of this, no results will be returned when this command is called by a service client. This is because service clients are not a part of service client owner's organization.

## Options

- **`--search`**  
  A string to search for users by name, email, or other attributes.  
  **Type:** `string` **Required:** Yes

## Examples

```bash
# Example 1: Search for users by a name string
itp user search --search "John Doe"

# Example 2: Search for users by email
itp user search --search john.doe@example.com
```

## API Reference

[Search Users](https://developer.bentley.com/apis/users/operations/get-users/)