# itp itwin share create

Create a new iTwin Share.

## Options

- **`-i, --itwin-id`**  
  The ID of the iTwin to be shared.  
  **Type:** `string` **Required:** Yes

- **`--contract`**  
  The name of share contract. Defaults to 'Default' name if omitted.  
  **Type:** `string` **Required:** No

- **`--expiration`**  
  The expiration date for the share. Defaults to the maximum allowed period for the given share contract if omitted  
  **Type:** `string` **Required:** No

## Examples

```bash
itp itwin share create --itwin-id ad0ba809-9241-48ad-9eb0-c8038c1a1d51

itp itwin share create --itwin-id ad0ba809-9241-48ad-9eb0-c8038c1a1d51 --contract Default --expiration 2025-12-31T23:59:59Z
```

## API Reference

[Create iTwin Share](https://developer.bentley.com/apis/access-control-v2/operations/create-itwin-share/)