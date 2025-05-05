# itp access-control member group update

Update the role assignments for a group in an iTwin.

## Options

- **`-g, --group-id`**  
  The ID of the group whose roles will be updated.  
  **Type:** `string` **Required:** Yes

- **`-i, --itwin-id`**  
  The ID of the iTwin to which the groups will be added.  
  **Type:** `string` **Required:** Yes

- **`--role-id`**  
  A list of role IDs to assign to the group. Max amount of 50.  
  **Type:** `string` **Required:** Yes **Multiple:** Yes

## Examples

```bash
itp access-control member group update --itwin-id ad0ba809-9241-48ad-9eb0-c8038c1a1d51 --group-id group1-id --role-id role1-id --role-id role2-id
```

## API Reference

[Update iTwin Group Member](https://developer.bentley.com/apis/access-control-v2/operations/update-itwin-group-member/)