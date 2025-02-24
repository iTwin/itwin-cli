# itp changed-elements changesets

Get the processing status of changesets in an iModel to see which are ready for comparison.

## Options

- **`--itwin-id`**  
  The ID of the iTwin.  
  **Type:** `string` **Required:** Yes

- **`--imodel-id`**  
  The ID of the iModel.  
  **Type:** `string` **Required:** Yes

- **`--top`**  
  Limit the number of changesets returned.  
  **Type:** `integer` **Required:** No

- **`--skip`**  
  Skip a number of changesets in the result.  
  **Type:** `integer` **Required:** No

## Examples

```bash
# Example 1: Retrieve the processing status of the first 10 changesets for a specific iModel
itp changed-elements changesets --itwin-id "1a2b3c4d-5678-90ab-cdef-1234567890ab" --imodel-id "ad0ba809-9241-48ad-9eb0-c8038c1a1d51" --top 10

# Example 2: Skip the first 5 changesets and return the next set
itp changed-elements changesets --itwin-id "1a2b3c4d-5678-90ab-cdef-1234567890ab" --imodel-id "ad0ba809-9241-48ad-9eb0-c8038c1a1d51" --skip 5 --top 10

# Example 3: Retrieve all changesets for a specific iModel
itp changed-elements changesets --itwin-id "1a2b3c4d-5678-90ab-cdef-1234567890ab" --imodel-id "ad0ba809-9241-48ad-9eb0-c8038c1a1d51"
```

## API Reference

[Get Changeset Status](https://developer.bentley.com/apis/changed-elements/operations/get-changesets/)
