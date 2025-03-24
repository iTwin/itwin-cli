# itp access-control member group update

Update the role assignments for a group in an iTwin.

## Options

- **`-i, --itwin-id`**  
  The ID of the iTwin where the group is a member.  
  **Type:** `string` **Required:** Yes

- **`-g, --group-id`**  
  The ID of the group whose roles will be updated.  
  **Type:** `string` **Required:** Yes

- **`--role-ids`**  
  A list of role IDs to assign to the group.  
  **Type:** `array` **Required:** Yes **Multiple:** Yes

## Examples

```bash
itp access-control member group update --itwin-id "ad0ba809-9241-48ad-9eb0-c8038c1a1d51" --group-id "group1-id" --role-ids "role1-id" --role-ids "role2-id"
```

## API Reference

[Update iTwin Group Member](https://developer.bentley.com/apis/access-control-v2/operations/update-itwin-group-member/)
