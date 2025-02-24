# itp access-control member user delete

Remove a user from an iTwin.

## Options

- **`--itwin-id`**  
  The ID of the iTwin where the user is a member.  
  **Type:** `string` **Required:** Yes

- **`--member-id`**  
  The ID of the user to remove from the iTwin.  
  **Type:** `string` **Required:** Yes

## Examples

```bash
itp access-control member user delete --itwin-id "ad0ba809-9241-48ad-9eb0-c8038c1a1d51" --member-id "user1-id"
```

## API Reference

[Remove iTwin User Member](https://developer.bentley.com/apis/access-control-v2/operations/remove-itwin-user-member/)
