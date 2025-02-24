# itp access-control member group add

Add one or more groups as members to an iTwin.

## Options

- **`--itwin-id`**  
  The ID of the iTwin to which the groups will be added.  
  **Type:** `string` **Required:** Yes

- **`--groups`**  
  A list of groups to add, each with a groupId and roleIds.  
  **Type:** `array` **Required:** Yes

## Examples

```bash
itp access-control member group add --itwin-id "ad0ba809-9241-48ad-9eb0-c8038c1a1d51" --groups '[
  {"groupId": "group1-id", "roleIds": ["5abbfcef-0eab-472a-b5f5-5c5a43df34b1", "83ee0d80-dea3-495a-b6c0-7bb102ebbcc3"]},
  {"groupId": "group2-id", "roleIds": ["5abbfcef-0eab-472a-b5f5-5c5a43df34b1"]}
]'
```

## API Reference

[Add iTwin Group Members](https://developer.bentley.com/apis/access-control-v2/operations/add-itwin-group-members/)
