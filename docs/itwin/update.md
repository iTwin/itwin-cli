# itp itwin update

Update the specified iTwin. Only include properties you want to update.

## Options

- **`--id`**  
  The ID of the iTwin to be updated.  
  **Type:** `string` **Required:** Yes

- **`--display-name`**  
  The iTwin's display name.  
  **Type:** `string **Required:** No

- **`--type`**  
  Open ended property to define your iTwin's type.
  **Type:** `string` **Required:** No

- **`--number`**  
  Unique identifier for the iTwin.  
  **Type:** `string` **Required:** No

- **`--geographic-location`**  
  Optional location, typically an address or city.  
  **Type:** `string` **Required:** No

- **`--iana-time-zone`**  
  Optional IANA time zone ID.  
  **Type:** `string` **Required:** No

- **`--status`**  
  Status of the iTwin. Defaults to Active.  
  **Type:** `iTwinStatus` **Required:** No  
  **Valid Values:** `"Active"`, `"Inactive"`, `"Trial"`

## Examples

```bash
# Example 1: Updating iTwin's display name
itp itwin update --id "b1a2c3d4-5678-90ab-cdef-1234567890ab" --display-name "Updated Portfolio"

# Example 2: Changing geographic location and time zone
itp itwin update --id "b1a2c3d4-5678-90ab-cdef-1234567890ab" --geographic-location "New York, NY" --iana-time-zone "America/New_York"

# Example 3: Setting the iTwin's status to 'Inactive'
itp itwin update --id "b1a2c3d4-5678-90ab-cdef-1234567890ab" --status "Inactive"
```

## API Reference

[Update iTwin](https://developer.bentley.com/apis/itwins/operations/update-itwin/)
