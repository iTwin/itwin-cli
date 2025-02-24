# itp access-control member group delete

Remove a group from an iTwin.

## Options

- **`--itwin-id`**  
  The ID of the iTwin where the group is a member.  
  **Type:** `string` **Required:** Yes

- **`--group-id`**  
  The ID of the group to remove from the iTwin.  
  **Type:** `string` **Required:** Yes

## Examples

```bash
itp access-control member group delete --itwin-id "ad0ba809-9241-48ad-9eb0-c8038c1a1d51" --group-id "group1-id"
```

## API Reference

[Remove iTwin Group Member](https://developer.bentley.com/apis/access-control-v2/operations/remove-itwin-group-member/)
