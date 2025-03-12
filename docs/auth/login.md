# itp auth login

Authenticate itp with Bentley. This command initiates the login process to obtain the necessary authentication tokens.

## Options

- **`--client-id`**  
  Provided client id that will be used for service or website login.  
  **Type:** `string` **Required:** No

- **`--client-secret`**  
  Provided client secret that will be user for service type authentication login.  
  **Type:** `string` **Required:** No

## Examples

```bash
itp auth login

itp auth login --client-id "native-a1254s86d4a5s4d" 

itp auth login --client-id "service-a1254s86d4a5s4d" --client-secret "a456a7s89da46s5f4a6f16a5sdf3as2d1f65a4sdf13"  
```
