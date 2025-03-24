# Create and refine an iModel

## Scenario

As a user, I want to create an iModel inside a new iTwin, set its geographic extents, and later expand those extents as the model scope evolves. This allows me to adjust the iModel boundaries without needing to recreate it.

*Note: Setting the extents is optional when creating an iModel. In this user story, we demonstrate how to adjust extents after the initial creation.*

## Steps

1. **Create an iModel with initial extents**: Start by creating the iModel with basic details, including an initial geographic extent.
2. **Refine the iModel by expanding the extents**: As the model scope becomes clearer, update the iModel’s extents to fully capture the project area.

## Commands Used

- `itp imodel create`  
  Initializes a new iModel with basic properties and initial extents.

- `itp imodel update`  
  Updates the iModel’s extents to reflect new boundaries as the project evolves.

## Example

**Step 1: Create an iModel with initial extents**
```bash
itp imodel create --itwin-id your-itwin-id --name "New Infrastructure Project" --extent '{
  "southWest": {
    "latitude": 34.052235,
    "longitude": -118.243683
  },
  "northEast": {
    "latitude": 34.152235,
    "longitude": -118.343683
  }
}'
```

**Step 2: Refine the iModel by expanding the extents**
```bash
itp imodel update --imodel-id your-imodel-id --extent '{
  "southWest": {
    "latitude": 34.052235,
    "longitude": -118.243683
  },
  "northEast": {
    "latitude": 34.252235,
    "longitude": -118.443683
  }
}'
```

## Expected Outcome

By following these steps, you will have created an iModel with geographic extents and later expanded them to match the evolving project area.

## Next Steps

- **Continue refining the iModel**: As the project develops, you can further adjust the iModel properties, such as adding a description or adjusting the extents again as needed.
