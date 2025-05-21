# itp access-control member group add

Add one or more groups as members to an iTwin.

Groups and their roles can be provided to this command in multiple ways:
1) Utilizing the `--groups` flag, where the necessary data in provided in form of serialized JSON.
2) Utilizing `--group-id` and `--role-ids` flags.

## Options

- **`-i, --itwin-id`**  
  The ID of the iTwin to which the groups will be added.  
  **Type:** `string` **Required:** Yes

- **`--group-id`**  
  Specify id of the group to add roles to. This flag can be provided multiple times.  
  **Type:** `string` **Required:** No **Multiple:** Yes

- **`--groups`**  
  A list of groups to add, each with a groupId and roleIds. A maximum of 50 role assignments can be performed. Provided in serialized JSON format.  
  **Type:** `object` **Required:** No

- **`--role-ids`**  
  Specify IDs of roles to be assigned to a group in CSV format without any whitespaces. This flag can be provided multiple times. If the flag is provided only once, the contained list of role IDs will be assigned to all provided group-ids list. If flag is provided multiple times, each role-ids will be used for the corresponding group-id (fist role-ids list for the first group-id, second role-ids list for the second group-id and so on).  
  **Type:** `string` **Required:** No **Multiple:** Yes

## Examples

```bash
# Example 1: Add one or more groups as members to an iTwin using `--groups` flag.
itp access-control member group add --itwin-id ad0ba809-9241-48ad-9eb0-c8038c1a1d51 --groups '[{"groupId": "group1-id", "roleIds": ["5abbfcef-0eab-472a-b5f5-5c5a43df34b1", "83ee0d80-dea3-495a-b6c0-7bb102ebbcc3"]}, {"groupId": "group2-id", "roleIds": ["5abbfcef-0eab-472a-b5f5-5c5a43df34b1"]}]'

# Example 2: Add one or more groups as members to an iTwin using `--group-id` and `--role-ids` flags.
itp access-control member group add --itwin-id ad0ba809-9241-48ad-9eb0-c8038c1a1d51 --group-id group1-id --group-id group2-id --role-ids 5abbfcef-0eab-472a-b5f5-5c5a43df34b1,83ee0d80-dea3-495a-b6c0-7bb102ebbcc3 --role-ids 5abbfcef-0eab-472a-b5f5-5c5a43df34b1

# Example 3: Add one or more groups as members to an iTwin using `--group-id` and `--role-ids` flags. Assign the same list of roles to all groups.
itp access-control member group add --itwin-id ad0ba809-9241-48ad-9eb0-c8038c1a1d51 --group-id group1-id --group-id group2-id --role-ids 5abbfcef-0eab-472a-b5f5-5c5a43df34b1,83ee0d80-dea3-495a-b6c0-7bb102ebbcc3
```

## API Reference

[Add iTwin Group Members](https://developer.bentley.com/apis/access-control-v2/operations/add-itwin-group-members/)