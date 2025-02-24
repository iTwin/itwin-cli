# View changes between iModel versions

## Scenario

As a user, I want to compare two versions of an iModel to understand the changes made between them. This helps me track updates and modifications made to the design over time.

## Steps

1. **Enable change tracking** Ensure that the iModel has change tracking enabled to capture differences between versions.
2. **List changesets** Retrieve the list of available changesets to identify the versions you want to compare.
3. **Compare changesets** Use the compare function to view the differences between two selected changesets.

## Commands Used

- `itp changed-elements enable`  
  Enable change tracking for an iModel.
- `itp changed-elements changesets`  
  Lists all changesets for the iModel, along with their processing statuses.
- `itp changed-elements comparison`  
  Compares two changesets and returns a list of changes between them.

## Example

Step 1: Enable change tracking for the iModel

```bash
itp changed-elements enable --itwin-id "your-itwin-id" --imodel-id "your-imodel-id"
```

Step 2: List available changesets to find versions for comparison
```bash
itp changed-elements changesets --itwin-id "your-itwin-id" --imodel-id "your-imodel-id"
```

Step 3: Compare two changesets (abc123 and def456)
```bash
itp changed-elements comparison --itwin-id "your-itwin-id" --imodel-id "your-imodel-id" --changeset-id1 "abc123" --changeset-id2 "def456"
```

## Expected Outcome

This process will provide you with a detailed list of all changes between two versions of an iModel. This includes modifications to design elements, additions, and deletions, helping you keep track of the evolution of your project.

## Next Steps

- **Visualize Changes**: Consider using visualization tools to render the differences visually for easier understanding of design updates.
- **Track Key Changes Over Time**: Set up a process to regularly compare new changesets as they are added to the iModel.
