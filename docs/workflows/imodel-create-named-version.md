# Create an iModel named version

## Scenario

As a user, I want to create a named version of an iModel at a specific changeset. I will first create the iTwin and iModel, populate it with data multiple times, list the changesets, and then create a named version from one of the changesets.

## Steps

1. **Create an iTwin and iModel**: Start by creating a new iTwin and iModel.
2. **Populate the iModel multiple times**: Add design data to the iModel in several batches.
3. **List changesets**: View the changesets generated from the previous data uploads.
4. **Create a named version**: Create a named version from a specific changeset.

## Commands Used

- `itp itwin create`  
  Creates a new iTwin.

- `itp imodel create`  
  Creates a new iModel within an iTwin.

- `itp imodel populate`  
  Synchronizes design data into the iModel, generating changesets.

- `itp imodel changeset list`  
  Lists all changesets in the iModel.

- `itp imodel named-version create`  
  Creates a named version for a specific changeset.

## Example

**Step 1: Create an iTwin**
```bash
itp itwin create --class Thing --sub-class Asset --name "New Infrastructure Project" 
```

**Step 2: Create an iModel**
```bash
itp imodel create --itwin-id your-itwin-id --name "Building Design" --description "iModel for named versions"
```

**Step 3: Populate the iModel with design data**
```bash
itp imodel populate --imodel-id your-imodel-id --file file1.dgn --file file2.dgn
```

**Step 4: List the changesets**
```bash
itp imodel changeset list --imodel-id your-imodel-id
```

**Step 5: Create a named version from a specific changeset**
```bash
itp imodel named-version create --imodel-id your-imodel-id --changeset-id your-changeset-id --name "Version 1: Initial Design"
```

**Step 6: List the named versions**
```bash
itp imodel named-version list --imodel-id your-imodel-id
```

## Expected Outcome

By following these steps, you will have created an iTwin and an iModel, populated the iModel with multiple changes, listed the changesets, and created a named version for one of the changesets.

## Next Steps

- **Manage Versions**: Continue creating additional named versions as you work through various stages of the project.
