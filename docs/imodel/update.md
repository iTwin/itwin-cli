# itp imodel update

Update metadata of an existing iModel.

## Options

- **`-m, --imodel-id`**  
  The ID of the iModel to update.  
  **Type:** `string` **Required:** Yes

- **`-n, --name`**  
  The new name of the iModel.  
  **Type:** `string` **Required:** No

- **`-d, --description`**  
  The new description for the iModel.  
  **Type:** `string` **Required:** No

- **`--extent`**  
  The new maximum rectangular area on Earth that encloses the iModel, defined by its southwest and northeast corners.  
  **Type:** `object` **Required:** No  
  - **`southWest`**  
    The southwest corner of the extent.  
    **Type:** `object`  
    - **`latitude`**: `number`  
    - **`longitude`**: `number`  
  - **`northEast`**  
    The northeast corner of the extent.  
    **Type:** `object`  
    - **`latitude`**: `number`  
    - **`longitude`**: `number`

## Examples

```bash
itp imodel update --imodel-id "5e19bee0-3aea-4355-a9f0-c6df9989ee7d" --name "Updated Sun City Renewable-energy Plant" --description "Updated overall model of wind and solar farms in Sun City" --extent '{
  "southWest": {
    "latitude": 46.13267702834806,
    "longitude": 7.672120009938448
  },
  "northEast": {
    "latitude": 46.302763954781234,
    "longitude": 7.835541640797823
  }
}'
```

## API Reference

[Update iModel](https://developer.bentley.com/apis/imodels-v2/operations/update-imodel/)
