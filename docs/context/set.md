# itp context set

Set a new cached context.

## Options

- **`-m, --imodel-id`**  
  The ID of the iModel to create a context for.  
  **Type:** `string` **Required:** No

- **`-i, --itwin-id`**  
  The ID of the iTwin to create a context for.  
  **Type:** `string` **Required:** No

## Examples

```bash
# Example 1: Set a new cached context using an iTwin ID
itp context set --itwin-id 12345

# Example 2: Set a new cached context using an iModel ID
itp context set --imodel-id 67890

# Example 3: Error when neither --itwin-id nor --imodel-id is provided
itp context set
```