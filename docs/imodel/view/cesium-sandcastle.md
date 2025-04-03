# itp imodel view cesium-sandcastle

> 🔬 This command is currently in Technical Preview.

Setup iModel and get URL to view it in Cesium Sandcastle.

## Options

- **`--changeset-id`**  
  Changeset id to be viewed in Cesium Sandcastle.  
  **Type:** `string` **Required:** Yes

- **`-m, --imodel-id`**  
  iModel id to be viewed in Cesium Sandcastle.  
  **Type:** `string` **Required:** Yes

- **`--open`**  
  Open the URL in the browser.  
  **Type:** `boolean` **Required:** No

## Examples

```bash
# Example 1: Get a link to an iModel in Cesium Sandcastle
itp imodel view cesium-sandcastle --imodel-id 5e19bee0-3aea-4355-a9f0-c6df9989ee7d

# Example 2: Get a link to a specific changeset of an iModel in Cesium Sandcastle
itp imodel view cesium-sandcastle --imodel-id 5e19bee0-3aea-4355-a9f0-c6df9989ee7d --changeset-id 2f3b4a8c92d747d5c8a8b2f9cde6742e5d74b3b5

# Example 3: Get a link to a specific changeset of an iModel in Cesium Sandcastle and open the URL in the browser
itp imodel view cesium-sandcastle --imodel-id 5e19bee0-3aea-4355-a9f0-c6df9989ee7d --changeset-id 2f3b4a8c92d747d5c8a8b2f9cde6742e5d74b3b5 --open
```

## Workflow Reference

[Cesium Sandcastle](/command-workflows/cesium-sandcastle)
