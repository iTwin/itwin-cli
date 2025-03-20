# itp imodel list

Retrieve a list of iModels belonging to the specified iTwin.

## Options

- **`--itwin-id`**  
  The ID of the iTwin to list iModels for.  
  **Type:** `string` **Required:** Yes

- **`--skip`**  
  Skip a number of items in the result.  
  **Type:** `integer` **Required:** No

- **`--top`**  
  Limit the number of items returned.  
  **Type:** `integer` **Required:** No

- **`--order-by`**  
  Order the results by 'name' or 'createdDateTime'. Use 'asc' for ascending or 'desc' for descending order.  
  **Type:** `string` **Required:** No

- **`--search`**  
  Filter iModels by a string in their name or description.  
  **Type:** `string` **Required:** No

- **`--name`**  
  Filter iModels by their exact name.  
  **Type:** `string` **Required:** No

- **`--state`**  
  Filter iModels by their state.  
  **Type:** `string` **Required:** No  
  **Valid Values:** `"initialized"`, `"notInitialized"`

## Examples

```bash
# Example 1: List all iModels for a specific iTwin
itp imodel list --itwin-id ad0ba809-9241-48ad-9eb0-c8038c1a1d51

# Example 2: List the first 10 iModels, ordered by name in descending order
itp imodel list --itwin-id ad0ba809-9241-48ad-9eb0-c8038c1a1d51 --top 10 --order-by "name desc"

# Example 3: Search for iModels with "Sun City" in their name or description
itp imodel list --itwin-id ad0ba809-9241-48ad-9eb0-c8038c1a1d51 --search "Sun City"

# Example 4: List only initialized iModels
itp imodel list --itwin-id ad0ba809-9241-48ad-9eb0-c8038c1a1d51 --state initialized
```

## API Reference

[List iModels](https://developer.bentley.com/apis/imodels-v2/operations/get-itwin-imodels/)
