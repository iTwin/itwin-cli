# itp access-control role update

Update the details of an existing role in an iTwin.

## Options

- **`-i, --itwin-id`**  
  The ID of the iTwin where the role exists.  
  **Type:** `string` **Required:** Yes

- **`--role-id`**  
  The ID of the role to be updated.  
  **Type:** `string` **Required:** Yes

- **`-d, --description`**  
  The updated description of the role.  
  **Type:** `string` **Required:** No

- **`-n, --name`**  
  The updated name of the role.  
  **Type:** `string` **Required:** No

- **`--permission`**  
  A list of permissions to assign to the role.  
  **Type:** `string` **Required:** No **Multiple:** Yes

## Examples

```bash
# Example 1: Update role name and description
itp access-control role update --itwin-id ad0ba809-9241-48ad-9eb0-c8038c1a1d51 --role-id role1-id --name "Lead Engineer" --description "Oversees engineering tasks"

# Example 2: Update role permissions along with the name
itp access-control role update --itwin-id ad0ba809-9241-48ad-9eb0-c8038c1a1d51 --role-id role1-id --name "Admin Role" --permission Permission1 --permission Permission2 --permission Permission3
```

## API Reference

[Update iTwin Role](https://developer.bentley.com/apis/access-control-v2/operations/update-itwin-role/)