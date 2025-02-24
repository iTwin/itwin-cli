# itp access-control member owner add

Add a new owner to an iTwin by email.

## Options

- **`--itwin-id`**  
  The ID of the iTwin to which the owner will be added.  
  **Type:** `string` **Required:** Yes

- **`--email`**  
  The email address of the new owner.  
  **Type:** `string` **Required:** Yes

## Examples

```bash
itp access-control member owner add --itwin-id "ad0ba809-9241-48ad-9eb0-c8038c1a1d51" --email "john.owner@example.com"
```

## API Reference

[Add iTwin Owner](https://developer.bentley.com/apis/access-control-v2/operations/add-itwin-owner-member/)
