# Populate an iModel with design data

## Scenario

As a user, I want to populate an iModel with design data.

## Steps

1. **Create an iTwin**: Start by creating a new iTwin.
2. **Create an iModel**: Create an iModel within the iTwin.
3. **Populate the iModel**: Synchronize design files into the iModel to start visualizing data.

## Commands Used

- `itp itwin create`  
  Creates a new iTwin.

- `itp imodel create`  
  Creates a new iModel within an iTwin.

- `itp imodel populate`  
  Synchronizes design files into the iModel for project management.

## Example

Step 1: Create an iTwin
```bash
itp itwin create --class Thing --sub-class Asset --name "New Infrastructure Project"
```

Step 2: Create an iModel
```bash
itp imodel create --itwin-id your-itwin-id --name "Building Design" --description "Design data for the new building"
```

Step 3: Populate the iModel with design data
```bash
itp imodel populate --imodel-id your-imodel-id --file "file1.dwg file2.dgn" --connector-type "DWG CIVIL"
```

## Expected Outcome

After following these steps, you will have created both an iTwin and an iModel, populated the iModel with design data, and be ready to manage the design files within the iTwin Platform.

## Next Steps

- **Synchronize Design Changes**: Continue updating the iModel using the populate command or by synchronizing design files through the platform.
