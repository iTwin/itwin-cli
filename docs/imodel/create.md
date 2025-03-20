# itp imodel create

Create an empty iModel within a specified iTwin.

## Options

- **`-i, --itwin-id`**  
  The ID of the iTwin where the iModel should be created.  
  **Type:** `string` **Required:** Yes

- **`-n, --name`**  
  The name of the iModel.  
  **Type:** `string` **Required:** Yes

- **`-d, --description`**  
  A description for the iModel.  
  **Type:** `string` **Required:** No

- **`--extent`**  
  The maximum rectangular area on Earth that encloses the iModel, defined by its southwest and northeast corners.  
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
# Example 1: Creating an iModel with minimal options
itp imodel create --itwin-id "ad0ba809-9241-48ad-9eb0-c8038c1a1d51" --name "Basic iModel"

# Example 2: Creating an iModel with all options, including extent and description
itp imodel create --itwin-id "ad0ba809-9241-48ad-9eb0-c8038c1a1d51" --name "Sun City Renewable-energy Plant" --description "Overall model of wind and solar farms in Sun City" --extent '{
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

[Create iModel](https://developer.bentley.com/apis/imodels-v2/operations/create-imodel/)
