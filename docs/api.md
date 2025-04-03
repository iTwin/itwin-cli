# itp api

Make direct HTTP requests to any iTwin Platform API endpoint. Useful for custom operations or accessing APIs without dedicated commands.

## Options

- **`--body`**  
  The body to include in the request. It must be serialized JSON.  
  **Type:** `string` **Required:** No

- **`--empty-response`**  
  Indicates the request will not return a response body.  
  **Type:** `flag` **Required:** No

- **`--header`**  
  Headers to include in the request. Use the format 'HeaderName: value'.  
  **Type:** `string` **Required:** No **Multiple:** Yes

- **`--method`**  
  HTTP method for the request.  
  **Type:** `string` **Required:** Yes  
  **Valid Values:** `"GET"`, `"POST"`, `"PUT"`, `"DELETE"`, `"PATCH"`

- **`--path`**  
  API endpoint path to send the request to.  
  **Type:** `string` **Required:** Yes

- **`--query`**  
  URL query parameters for the request. Use format 'QueryKey:value'.  
  **Type:** `string` **Required:** No **Multiple:** Yes

- **`--version-header`**  
  API version header for versioned endpoints.  
  **Type:** `string` **Required:** No

## Examples

```bash
# Example 1: Sending a GET request
itp api --method GET --path users/me

# Example 2: Sending a request with headers and query parameters
itp api --method GET --path itwins/favorite --query subClass:Account --query "$top:10" --header "Prefer: return=minimal"

# Example 3: Sending a delete request without response body
itp api --method DELETE --path itwins/favorites/dc914a84-e0c9-40e2-9d14-faf5ed84147f --empty-response

# Example 4: Sending a post request
itp api --method POST --path itwins/exports --body '{"outputFormat": "JsonGZip"}'

```

## APIs Docs Reference

[ITwin Platform APIs docs](https://developer.bentley.com/apis/)
