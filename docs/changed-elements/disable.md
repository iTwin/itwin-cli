# itp changed-elements disable

Disable change tracking for a specified iModel.

## Options

- **`-i, --itwin-id`**  
  The ID of the iTwin associated with the iModel.  
  **Type:** `string` **Required:** Yes

- **`-m, --imodel-id`**  
  The ID of the iModel where change tracking should be disabled.  
  **Type:** `string` **Required:** Yes

## Examples

```bash
itp changed-elements disable --itwin-id "1a2b3c4d-5678-90ab-cdef-1234567890ab" --imodel-id "ad0ba809-9241-48ad-9eb0-c8038c1a1d51"
```

## API Reference

[Disable Change Tracking](https://developer.bentley.com/apis/changed-elements/operations/enable-change-tracking/)
