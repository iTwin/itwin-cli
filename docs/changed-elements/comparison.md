# itp changed-elements comparison

Compare changes between two changesets in an iModel.

## Options

- **`--itwin-id`**  
  The ID of the iTwin associated with the iModel.  
  **Type:** `string` **Required:** Yes

- **`--imodel-id`**  
  The ID of the iModel to compare changesets for.  
  **Type:** `string` **Required:** Yes

- **`--changeset-id1`**  
  The ID of the first changeset to compare.  
  **Type:** `string` **Required:** Yes

- **`--changeset-id2`**  
  The ID of the second changeset to compare.  
  **Type:** `string` **Required:** Yes

## Examples

```bash
# Example 1: Compare two changesets in an iModel
itp changed-elements comparison --itwin-id 89337c07-ab59-4080-81cc-5e237be55369 --imodel-id ad0ba809-9241-48ad-9eb0-c8038c1a1d51 --changeset-id1 2f3b4a8c92d747d5c8a8b2f9cde6742e5d74b3b5 --changeset-id2 4b8a5d9e8d534a71b02894f2a2b4e91d

# Example 2: Comparing another set of changesets in the same iModel
itp changed-elements comparison --itwin-id 89337c07-ab59-4080-81cc-5e237be55369 --imodel-id ad0ba809-9241-48ad-9eb0-c8038c1a1d51 --changeset-id1 5d9e8b2f6744a71b02894f1a2b4e91d7 --changeset-id2 6b8e4f7a7348a81b93754c2d5d8f7e12
```

## API Reference

[Get Comparison](https://developer.bentley.com/apis/changed-elements/operations/get-comparison/)
