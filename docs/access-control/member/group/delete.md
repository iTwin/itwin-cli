# itp access-control member group delete

Remove a group from an iTwin.

## Options

- **`-g, --group-id`**  
  The ID of the group to remove from the iTwin.  
  **Type:** `string` **Required:** Yes

- **`-i, --itwin-id`**  
  The ID of the iTwin where the group is a member.  
  **Type:** `string` **Required:** Yes

## Examples

```bash
itp access-control member group delete --itwin-id ad0ba809-9241-48ad-9eb0-c8038c1a1d51 --group-id 10f1209f-ecc2-4457-9cb0-39c99d7c4414
```

## API Reference

[Remove iTwin Group Member](https://developer.bentley.com/apis/access-control-v2/operations/remove-itwin-group-member/)