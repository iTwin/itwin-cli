# itp imodel named-version create

Create a new named version for iModel.

## Options

- **`--imodel-id`**  
  The ID of the iModel where the named version will be created.  
  **Type:** `string` **Required:** Yes

- **`--name`**  
  The name of the new named version.  
  **Type:** `string` **Required:** Yes

- **`--changeset-id`**  
  The ID of the changeset for the named version. Defaults to the latest changeset if not specified.  
  **Type:** `string` **Required:** No

- **`--description`**  
  A description for the named version.  
  **Type:** `string` **Required:** No

## Examples

```bash
# Example 1: Creating a named version with a description
itp imodel named-version create --imodel-id ad0ba809-9241-48ad-9eb0-c8038c1a1d51 --changeset-id 2f3b4a8c92d747d5c8a8b2f9cde6742e5d74b3b5 --name "Version 1.0" --description "Initial release"

# Example 2: Creating a named version without specifying changesetId (uses the latest changeset)
itp imodel named-version create --imodel-id ad0ba809-9241-48ad-9eb0-c8038c1a1d51 --name "Version 2.0"

# Example 3: Creating a named version without a description
itp imodel named-version create --imodel-id ad0ba809-9241-48ad-9eb0-c8038c1a1d51 --changeset-id 4b8a5d9e8d534a71b02894f2a2b4e91d --name "Version 3.0"
```

## API Reference

[Create Named Version](https://developer.bentley.com/apis/imodels-v2/operations/create-imodel-named-version/)
