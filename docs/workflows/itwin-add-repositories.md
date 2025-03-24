# Add new repositories to an iTwin

## Scenario

As a user, I want to create multiple types of repositories (GIS, Subsurface, Construction) within an iTwin and then list all the repositories associated with that iTwin.

## Steps

1. **Create an iTwin**: Start by creating a new iTwin.
2. **Create a GIS repository**: Add a GIS repository to the iTwin.
3. **Create a Subsurface repository**: Add a Subsurface repository to the iTwin.
4. **Create a Construction repository**: Add a Construction repository to the iTwin.
5. **List all repositories**: Display a list of all repositories added to the iTwin.

## Commands Used

- `itp itwin create`  
  Creates a new iTwin.

- `itp itwin repository create`  
  Creates a new repository (e.g., GIS, Subsurface, Construction) in the iTwin.

- `itp itwin repository list`  
  Lists all repositories associated with the iTwin.

## Example

Step 1: Create an iTwin
```bash
itp itwin create --class Thing --sub-class Asset --display-name "New Infrastructure Project"
```

Step 2: Create a GIS repository
```bash
itp itwin repository create --itwin-id your-itwin-id --class GeographicInformationSystem --sub-class WebMapService --uri https://example.com/gis-repo
```

Step 3: Create a Subsurface repository
```bash
itp itwin repository create --itwin-id your-itwin-id --class Subsurface --sub-class EvoWorkspace --uri https://example.com/subsurface-repo
```

Step 4: Create a Construction repository
```bash
itp itwin repository create --itwin-id your-itwin-id --class Construction --sub-class Performance --uri https://example.com/construction-repo
```

Step 5: List all repositories associated with the iTwin
```bash
itp itwin repository list --itwin-id your-itwin-id
```

## Expected Outcome

After following these steps, you will have created an iTwin, added multiple repositories (GIS, Subsurface, Construction), and listed all the repositories associated with the iTwin.

## Next Steps

- **Manage Repositories**: Continue adding, updating, or removing repositories as the project evolves.
