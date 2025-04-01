# itp access-control group update

Update the details of an existing group in an iTwin.

## Options

- **`-i, --itwin-id`**  
  The ID of the iTwin where the group exists.  
  **Type:** `string` **Required:** Yes

- **`-g, --group-id`**  
  The ID of the group to be updated.  
  **Type:** `string` **Required:** Yes

- **`-n, --name`**  
  The updated name of the group.  
  **Type:** `string` **Required:** No

- **`-d, --description`**  
  The updated description of the group.  
  **Type:** `string` **Required:** No

- **`--member`**  
  A list of members (emails) to be assigned to the group.  
  **Type:** `array of strings` **Required:** No **Multiple:** Yes

- **`--ims-group`**  
  A list of IMS Groups to be linked to the group.  
  **Type:** `array of strings` **Required:** No **Multiple:** Yes

## Examples

```bash
# Example 1: Update group name and description
itp access-control group update --itwin-id ad0ba809-9241-48ad-9eb0-c8038c1a1d51 --group-id bf4d8b36-25d7-4b72-b38b-12c1f0325f42 --name "Updated Engineering Team" --description "Updated description"

# Example 2: Update group members and IMS groups
itp access-control group update --itwin-id ad0ba809-9241-48ad-9eb0-c8038c1a1d51 --group-id bf4d8b36-25d7-4b72-b38b-12c1f0325f42 --member john.doe@example.com --member jane.doe@example.com --ims-groups "Sample IMS Group" --ims-group "Sample IMS Group"
```

## API Reference

[Update iTwin Group](https://developer.bentley.com/apis/access-control-v2/operations/update-itwin-group/)
