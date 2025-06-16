# itp user info

Retrieve information about specific users based on their user IDs.

## Options

- **`--user-id`**  
  User IDs to retrieve information for. Max amount of 1000.  
  **Type:** `string` **Required:** Yes **Multiple:** Yes

## Examples

```bash
# Example 1: Retrieve information about specific users by their user IDs
itp user info --user-id 0fb913af-1264-497a-8353-63ce4a4f0460 --user-id 66dffaa5-d524-418e-b92c-3e7d85050638 --user-id f7bfef9f-2402-46f7-8f5a-785605a077db
```

## API Reference

[Get Users by ID List](https://developer.bentley.com/apis/users/operations/get-users-by-id-list/)