# itp imodel visualize

Launch a browser to visualize an iModel.

## Options

- **`-i, --itwin-id`**
  The ID of the iTwin associated with the iModel.  
  **Type:** `string`  
  **Required:** Yes

- **`-m, --imodel-id`**
  The ID of the iModel to visualize.  
  **Type:** `string`  
  **Required:** Yes

- **`--changeset-id`**
  (Optional) The ID of a specific changeset to visualize.  
  **Type:** `string`  
  **Required:** No

## Examples

```bash
# Visualize the latest version of an iModel
itp imodel visualize --itwin-id f5a0d9b2-3e59-4c2f-8fdd-7986c1b2f12c --imodel-id a3b89d45-e6a4-4d59-aabd-12c3415e1234

# Visualize a specific changeset of an iModel
itp imodel visualize --itwin-id f5a0d9b2-3e59-4c2f-8fdd-7986c1b2f12c --imodel-id a3b89d45-e6a4-4d59-aabd-12c3415e1234 --changeset-id 6a3c21d0-234d-49fc-92ef-7e2d29f1b0f7
```
