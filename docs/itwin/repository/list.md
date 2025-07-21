# itp itwin repository list

Retrieve a list of repositories for a specified iTwin.

## Options

- **`-i, --itwin-id`**  
  The ID of the iTwin whose repositories should be retrieved.  
  **Type:** `string` **Required:** Yes

- **`--class`**  
  Specify a particular class of repositories to retrieve.  
  **Type:** `string` **Required:** No  
  **Valid Values:** `"iModels"`, `"RealityData"`, `"Storage"`, `"Forms"`, `"Issues"`, `"SensorData"`, `"GeographicInformationSystem"`, `"Construction"`, `"Subsurface"`

- **`--sub-class`**  
  Specify a subClass of repositories. Only applicable for **`GeographicInformationSystem`** class.   
  **Type:** `string` **Required:** No  
  **Valid Values:** `"WebMapService"`, `"WebMapTileService"`, `"MapServer"`, `"Performance"`, `"EvoWorkspace"`

## Examples

```bash
# Example 1: Listing all repositories for an iTwin
itp itwin repository list --itwin-id ad0ba809-9241-48ad-9eb0-c8038c1a1d51

# Example 2: Filtering repositories by class
itp itwin repository list --itwin-id ad0ba809-9241-48ad-9eb0-c8038c1a1d51 --class iModels

# Example 3: Filtering repositories by class and subClass
itp itwin repository list --itwin-id ad0ba809-9241-48ad-9eb0-c8038c1a1d51 --class GeographicInformationSystem --sub-class WebMapTileService
```

## API Reference

[List Repositories](https://developer.bentley.com/apis/itwins/operations/get-repositories-by-itwin-id/)