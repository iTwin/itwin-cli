# itp itwin repository delete

Delete a specified repository from an iTwin.

## Options

- **`--itwin-id`**  
  The ID of the iTwin that the repository belongs to.  
  **Type:** `string` **Required:** Yes

- **`--repository-id`**  
  The ID of the repository to delete.  
  **Type:** `string` **Required:** Yes

## Examples

```bash
itp itwin repository delete --itwin-id ad0ba809-9241-48ad-9eb0-c8038c1a1d51 --repository-id bf4d8b36-25d7-4b72-b38b-12c1f0325f42
```

## API Reference

[Delete Repository](https://developer.bentley.com/apis/iTwins/operations/delete-repository/)
