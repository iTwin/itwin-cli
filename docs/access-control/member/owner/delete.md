# itp access-control member owner delete

Remove an owner from an iTwin by their member ID.

## Options

- **`-i, --itwin-id`**  
  The ID of the iTwin from which the owner will be removed.  
  **Type:** `string` **Required:** Yes

- **`--member-id`**  
  The ID of the owner to be removed.  
  **Type:** `string` **Required:** Yes

## Examples

```bash
itp access-control member owner delete --itwin-id ad0ba809-9241-48ad-9eb0-c8038c1a1d51 --member-id 69e0284a-1331-4462-9c83-9cdbe2bdaa7f
```

## API Reference

[Remove iTwin Owner](https://developer.bentley.com/apis/access-control-v2/operations/remove-itwin-owner-member/)