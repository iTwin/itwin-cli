# itp itwin repository create

Create a new repository URI for iTwin data.

## Options

- **`--class`**  
  The class of your iTwin repository.  
  **Type:** `string` **Required:** Yes  
  **Valid Values:** `"GeographicInformationSystem"`, `"Construction"`, `"Subsurface"`

- **`-i, --itwin-id`**  
  The ID of the iTwin to which the repository belongs.  
  **Type:** `string` **Required:** Yes

- **`--uri`**  
  The URI to the custom repository.  
  **Type:** `string` **Required:** Yes

- **`--sub-class`**  
  The subclass of your repository. 'WebMapService', 'WebMapTileService' and 'MapServer' subclasses are only applicable to 'GeographicInformationSystem' class. 'Performance' subclass is only applicable to 'Construction' class. 'EvoWorkspace' subclass is only applicable to 'Subsurface' class.  
  **Type:** `string` **Required:** No  
  **Valid Values:** `"WebMapService"`, `"WebMapTileService"`, `"MapServer"`, `"Performance"`, `"EvoWorkspace"`

## Examples

```bash
# Example 1: Creating a repository with Geographic Information System class
itp itwin repository create --itwin-id ad0ba809-9241-48ad-9eb0-c8038c1a1d51 --class GeographicInformationSystem --sub-class WebMapTileService --uri https://example.com/repository1

# Example 2: Creating a repository for Construction class with MapServer subclass
itp itwin repository create --itwin-id ad0ba809-9241-48ad-9eb0-c8038c1a1d51 --class Construction --sub-class Performance --uri https://example.com/repository2

# Example 3: Creating a repository for Subsurface class without specifying a subclass
itp itwin repository create --itwin-id ad0ba809-9241-48ad-9eb0-c8038c1a1d51 --class Subsurface --sub-class EvoWorkspace --uri https://example.com/repository3
```

## API Reference

[Create Repository](https://developer.bentley.com/apis/iTwins/operations/create-repository/)