# itp itwin share revoke

Revokes a specified share for a specified iTwin. Any future requests made with the associated shareKey will no longer work.

## Options

- **`-i, --itwin-id`**  
  The ID of the iTwin to be shared.  
  **Type:** `string` **Required:** Yes

- **`--share-id`**  
  iTwin Share ID.  
  **Type:** `string` **Required:** Yes

## Examples

```bash
itp itwin share revoke --itwin-id ad0ba809-9241-48ad-9eb0-c8038c1a1d51 --share-id bf4d8b36-25d7-4b72-b38b-12c1f0325f42
```

## API Reference

[Revokes a specified share for a specified iTwin.](https://developer.bentley.com/apis/access-control-v2/operations/revoke-itwin-share/)