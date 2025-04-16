# itp access-control group create

Create a new group for an iTwin.

## Options

- **`-d, --description`**  
  A description of the group.  
  **Type:** `string` **Required:** Yes

- **`-i, --itwin-id`**  
  The ID of the iTwin where the group is being created.  
  **Type:** `string` **Required:** Yes

- **`-n, --name`**  
  The name of the group to be created.  
  **Type:** `string` **Required:** Yes

## Examples

```bash
itp access-control group create --itwin-id ad0ba809-9241-48ad-9eb0-c8038c1a1d51 --name "Engineering Team" --description "Group handling engineering tasks"
```

## API Reference

[Create iTwin Group](https://developer.bentley.com/apis/access-control-v2/operations/create-itwin-group/)