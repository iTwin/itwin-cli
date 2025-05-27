# itp imodel update

Update metadata of an existing iModel.

iModel extent can be provided to this command in multiple ways:
1) Utilizing the `--extent` flag, where coordinates are provided in form of serialized JSON.
2) By providing all of the following flags: `--sw-latitude`, `--sw-longitude`, `--ne-latitude`, `--ne-longitude`

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

- **`--sw-latitude`**
  Southwest latitude of the extent.
  **Type** `float` **Required:** No

- **`--sw-longitude`**
Southwest longitude of the extent.
**Type** `float` **Required:** No

- **`--ne-latitude`**
Northeast latitude of the extent.
**Type** `float` **Required:** No

- **`--ne-longitude`**
Northeast longitude of the extent.
**Type** `float` **Required:** No

## Examples

```bash
# Example 1: Updating an iModel name, description and extent (JSON format)
itp imodel update --imodel-id 5e19bee0-3aea-4355-a9f0-c6df9989ee7d --name "Updated Sun City Renewable-energy Plant" --description "Updated overall model of wind and solar farms in Sun City" --extent '{
  "southWest": {
    "latitude": 46.13267702834806,
    "longitude": 7.672120009938448
  },
  "northEast": {
    "latitude": 46.302763954781234,
    "longitude": 7.835541640797823
  }
}'

# Example 2: Updating an iModel name, description and extent (separate flags format)
itp imodel update --imodel-id 5e19bee0-3aea-4355-a9f0-c6df9989ee7d --name "Updated Sun City Renewable-energy Plant" --description "Updated overall model of wind and solar farms in Sun City" --sw-latitude 46.13267702834806 --sw-longitude 7.672120009938448 --ne-latitude 46.302763954781234 --ne-longitude 7.835541640797823
```

## API Reference

[Update iModel](https://developer.bentley.com/apis/imodels-v2/operations/update-imodel/)
