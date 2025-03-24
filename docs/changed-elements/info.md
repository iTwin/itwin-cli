# itp changed-elements info

Retrieve change tracking information for a specified iModel.

## Options

- **`-i, --itwin-id`**  
  The ID of the iTwin associated with the iModel.  
  **Type:** `string` **Required:** Yes

- **`-m, --imodel-id`**  
  The ID of the iModel to retrieve tracking information for.  
  **Type:** `string` **Required:** Yes

## Examples

```bash
itp changed-elements info --itwin-id "1a2b3c4d-5678-90ab-cdef-1234567890ab" --imodel-id "ad0ba809-9241-48ad-9eb0-c8038c1a1d51"
```

## API Reference

[Get Tracking Info](https://developer.bentley.com/apis/changed-elements/operations/get-tracking/)
