# itp access-control member owner add

Add or invite a new owner to an iTwin by email. When using interactive login, specified user is directly added to the iTwin as an owner if they are in the same organization and sent an invitation email otherwise. When using a service client, specified user is sent an invitation email.

## Options

- **`--email`**  
  The email address of the new owner.  
  **Type:** `string` **Required:** Yes

- **`-i, --itwin-id`**  
  The ID of the iTwin to which the owner will be added.  
  **Type:** `string` **Required:** Yes

## Examples

```bash
itp access-control member owner add --itwin-id ad0ba809-9241-48ad-9eb0-c8038c1a1d51 --email john.owner@example.com
```

## API Reference

[Add iTwin Owner](https://developer.bentley.com/apis/access-control-v2/operations/add-itwin-owner-member/)