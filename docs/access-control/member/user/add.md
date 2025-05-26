# itp access-control member user add

Add and/or invite one or more user members to an iTwin. When using interactive login, specified users are directly added to the iTwin if they are in the same organization and sent invitation emails otherwise. When using a service client, specified users are sent invitation emails.

Users and their roles can be provided to this command in multiple ways:
1) Utilizing the `--members` flag, where the necessary data in provided in form of serialized JSON.
2) Utilizing `--email` and `--role-ids` flags.

## Options

- **`-i, --itwin-id`**  
  The ID of the iTwin to which the users will be added.  
  **Type:** `string` **Required:** Yes

- **`--members`**  
  A list of members to add, each with an email and a list of role IDs. A maximum of 50 role assignments can be performed.  
  **Type:** `string` **Required:** Yes

## Examples

```bash
# Example 1: Add multiple users to an iTwin with role IDs
itp access-control member user add --itwin-id ad0ba809-9241-48ad-9eb0-c8038c1a1d51 --members '[{"email": "user1@example.com", "roleIds": ["5abbfcef-0eab-472a-b5f5-5c5a43df34b1", "83ee0d80-dea3-495a-b6c0-7bb102ebbcc3"]}, {"email": "user2@example.com", "roleIds": ["5abbfcef-0eab-472a-b5f5-5c5a43df34b1"]}]'
```

## API Reference

[Add iTwin User Members](https://developer.bentley.com/apis/access-control-v2/operations/add-itwin-user-members/)