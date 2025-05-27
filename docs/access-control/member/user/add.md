# itp access-control member user add

Add and/or invite one or more user members to an iTwin. When using interactive login, specified users are directly added to the iTwin if they are in the same organization and sent invitation emails otherwise. When using a service client, specified users are sent invitation emails.

Users and their roles can be provided to this command in multiple ways:
1) Utilizing the `--members` flag, where the necessary data in provided in form of serialized JSON.
2) Utilizing `--email` and `--role-ids` flags.

Users and their roles can be provided to this command in multiple ways:
1) Utilizing the `--members` flag, where the necessary data in provided in form of serialized JSON.
2) Utilizing `--email` and `--role-ids` flags.

## Options

- **`-i, --itwin-id`**  
  The ID of the iTwin to which the users will be added.  
  **Type:** `string` **Required:** Yes

- **`--email`**  
  Specify emails of the user to add roles to. This flag can be provided multiple times.  
  **Type:** `string` **Required:** No **Multiple:** Yes

- **`--members`**  
  A list of members to add, each with an email and a list of role IDs. A maximum of 50 role assignments can be performed. Provided in serialized JSON format.  
  **Type:** `string` **Required:** No

- **`--role-ids`**  
  Specify IDs of roles to be assigned to a user in CSV format without any whitespaces. This flag can be provided multiple times. If the flag is provided only once, the contained list of role IDs will be assigned to all provided group-ids list. If flag is provided multiple times, each role-ids will be used for the corresponding group-id (fist role-ids list for the first group-id, second role-ids list for the second group-id and so on).  
  **Type:** `string` **Required:** No **Multiple:** Yes

## Examples

```bash
# Example 1: Add multiple users to an iTwin with role IDs using `--members` flag.
itp access-control member user add --itwin-id ad0ba809-9241-48ad-9eb0-c8038c1a1d51 --members '[{"email": "user1@example.com", "roleIds": ["5abbfcef-0eab-472a-b5f5-5c5a43df34b1", "83ee0d80-dea3-495a-b6c0-7bb102ebbcc3"]}, {"email": "user2@example.com", "roleIds": ["5abbfcef-0eab-472a-b5f5-5c5a43df34b1"]}]'

# Example 2: Add multiple users to an iTwin with role IDs using `--email` and `--role-ids` flags.
itp access-control member user add --itwin-id ad0ba809-9241-48ad-9eb0-c8038c1a1d51 --email user1@example.com --email user2@example.com --role-ids 5abbfcef-0eab-472a-b5f5-5c5a43df34b1,83ee0d80-dea3-495a-b6c0-7bb102ebbcc3 --role-ids 5abbfcef-0eab-472a-b5f5-5c5a43df34b1

# Example 3: Add multiple users to an iTwin with role IDs using `--email` and `--role-ids` flags. Assign the same list of roles to all users.
itp access-control member user add --itwin-id ad0ba809-9241-48ad-9eb0-c8038c1a1d51 --email user1@example.com --email user2@example.com --role-ids 5abbfcef-0eab-472a-b5f5-5c5a43df34b1,83ee0d80-dea3-495a-b6c0-7bb102ebbcc3
```

## API Reference

[Add iTwin User Members](https://developer.bentley.com/apis/access-control-v2/operations/add-itwin-user-members/)