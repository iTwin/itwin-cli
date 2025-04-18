# itp imodel connection list

List all storage connections of a specific iModel.

## Options

- **`-m, --imodel-id`**  
  The ID of the iModel whose storage connections you want to list.  
  **Type:** `string` **Required:** Yes

- **`--skip`**  
  The number of changesets to skip.  
  **Type:** `integer` **Required:** No

- **`--top`**  
  The maximum number of changesets to return.  
  **Type:** `integer` **Required:** No

## Examples

```bash
# Example 1: Listing all connections for an iModel
itp imodel connection list --imodel-id ad0ba809-9241-48ad-9eb0-c8038c1a1d51

# Example 2: Listing the first 5 connections for an iModel
itp imodel connection list --imodel-id ad0ba809-9241-48ad-9eb0-c8038c1a1d51 --top 5

# Example 3: Listing the 5 connections after the first 15 connections are skipped for an iModel
itp imodel connection list --imodel-id ad0ba809-9241-48ad-9eb0-c8038c1a1d51 --top 5 --skip 15
```

## API Reference

[Get Storage Connections](https://developer.bentley.com/apis/synchronization/operations/get-storage-connections/)