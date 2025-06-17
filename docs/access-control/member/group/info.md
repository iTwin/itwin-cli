# itp access-control member group info

Retrieve details about a specific group member in an iTwin.

## Options

- **`-g, --group-id`**  
  The ID of the group to retrieve information about.  
  **Type:** `string` **Required:** Yes

- **`-i, --itwin-id`**  
  The ID of the iTwin where the group is a member.  
  **Type:** `string` **Required:** Yes

## Examples

```bash
itp access-control member group info --itwin-id ad0ba809-9241-48ad-9eb0-c8038c1a1d51 --group-id 10f1209f-ecc2-4457-9cb0-39c99d7c4414
```

## API Reference

[Get iTwin Group Member](https://developer.bentley.com/apis/access-control-v2/operations/get-itwin-group-member/)