# itp imodel connection list

List all storage connections of a specific iModel.

## Options

- **`--imodel-id`**  
  The ID of the iModel whose storage connections you want to list.  
  **Type:** `string` **Required:** Yes

## Examples

```bash
# Example 1: Listing all connections for an iModel
itp imodel connection list --imodel-id "ad0ba809-9241-48ad-9eb0-c8038c1a1d51"

# Example 2: Listing the first 5 connections for an iModel
itp imodel connection list --imodel-id "ad0ba809-9241-48ad-9eb0-c8038c1a1d51" --top 5
```

## API Reference

[Get Storage Connections](https://developer.bentley.com/apis/synchronization/operations/get-storage-connections/)
