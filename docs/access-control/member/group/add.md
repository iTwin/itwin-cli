# itp access-control member group add

Add one or more groups as members to an iTwin.

Groups and their roles can be provided to this command in multiple ways:
1) Utilizing the `--groups` option, where the necessary data in provided in form of serialized JSON.
2) Utilizing `--group-id` and `--role-ids` options, in which case all of `--role-id` roles will be applied to each `--group-id` group.

## Options

- **`-i, --itwin-id`**  
  The ID of the iTwin to which the groups will be added.  
  **Type:** `string` **Required:** Yes

- **`-g, --group-id`**  
  Specify id of the group to add roles to. This flag can be provided multiple times.  
  **Type:** `string` **Required:** No **Multiple:** Yes

- **`--groups`**  
  A list of groups to add, each with a groupId and roleIds. A maximum of 50 role assignments can be performed. Provided in serialized JSON format.  
  **Type:** `string` **Required:** No

- **`--role-ids`**  
  Specify a list of role IDs to be assigned to all of 'group-id' groups. Provided in CSV format without whitespaces.  
  **Type:** `string` **Required:** No

## Examples

```bash
# Example 1: Add multiple groups as members to an iTwin using `--groups` option. Each specified group can be assigned different lists of roles.
itp access-control member group add --itwin-id ad0ba809-9241-48ad-9eb0-c8038c1a1d51 --groups '[{"groupId": "605e6f1e-b774-40f4-87cb-94ca7392c182", "roleIds": ["5abbfcef-0eab-472a-b5f5-5c5a43df34b1", "83ee0d80-dea3-495a-b6c0-7bb102ebbcc3"]}, {"groupId": "fb23fed5-182a-4ed1-b378-3b214fd3f043", "roleIds": ["5abbfcef-0eab-472a-b5f5-5c5a43df34b1"]}]'

# Example 2: Add multiple groups as members to an iTwin using `--group-id` and `--role-ids` options. Each specified group is assigned the same list of roles.
itp access-control member group add --itwin-id ad0ba809-9241-48ad-9eb0-c8038c1a1d51 --group-id 605e6f1e-b774-40f4-87cb-94ca7392c182 --group-id fb23fed5-182a-4ed1-b378-3b214fd3f043 --role-ids 5abbfcef-0eab-472a-b5f5-5c5a43df34b1,83ee0d80-dea3-495a-b6c0-7bb102ebbcc3
```

## API Reference

[Add iTwin Group Members](https://developer.bentley.com/apis/access-control-v2/operations/add-itwin-group-members/)