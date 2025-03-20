# itp imodel changeset info

Retrieve details about a specific changeset of an iModel.

## Options

- **`--imodel-id`**  
  The ID of the iModel whose changeset you want to retrieve.  
  **Type:** `string` **Required:** Yes

- **`--changeset-id`**  
  The ID of the changeset.  
  **Type:** `string` **Required:** Yes

## Examples

```bash
itp imodel changeset info --imodel-id ad0ba809-9241-48ad-9eb0-c8038c1a1d51 --changeset-id 2f3b4a8c92d747d5c8a8b2f9cde6742e5d74b3b5
```

## API Reference

[Get Changeset Details](https://developer.bentley.com/apis/imodels-v2/operations/get-imodel-changeset-details/)
