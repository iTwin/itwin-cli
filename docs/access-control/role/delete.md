# itp access-control role delete

Delete an existing role from an iTwin.

## Options

- **`-i, --itwin-id`**  
  The ID of the iTwin where the role exists.  
  **Type:** `string` **Required:** Yes

- **`--role-id`**  
  The ID of the role to be deleted.  
  **Type:** `string` **Required:** Yes

## Examples

```bash
itp access-control role delete --itwin-id ad0ba809-9241-48ad-9eb0-c8038c1a1d51 --role-id 752b5a3d-b9f2-4845-824a-99dd310b4898
```

## API Reference

[Delete iTwin Role](https://developer.bentley.com/apis/access-control-v2/operations/delete-itwin-role/)