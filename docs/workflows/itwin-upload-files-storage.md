# Uploading PDFs to iTwin storage

## Scenario

As a user, I want to upload construction-related PDFs, like floor plans, to iTwin storage by accessing the root folder, setting up a dedicated "floor plans" folder, uploading the PDF in multiple steps, and then confirming that it’s successfully stored by checking the folder contents.

## Steps

1. **Create an iTwin**: Start by creating a new iTwin.
2. **Get the root folder**: Retrieve the root folder of the iTwin storage where you will create the new folder.
3. **Create a folder called “floor plans”**: Add a new folder specifically for storing floor plan PDFs.
4. **Create the file record**: Set up a record for the new file in the "floor plans" folder in iTwin storage.
5. **Upload the floorplan.pdf**: Upload the actual PDF data into the file record.
6. **Complete the upload**: Confirm that the upload process has completed successfully.
7. **Confirm the upload**: View the folder contents to ensure the PDF was uploaded successfully.

## Commands Used

- `itp itwin create`  
  Creates a new iTwin.

- `itp storage root-folder`  
  Retrieves the root folder for the iTwin’s storage.

- `itp storage folder create`  
  Creates a new folder in the iTwin’s storage.

- `itp storage file create`  
  Creates a file record in the specified folder.

- `itp storage file upload`  
  Uploads file data to the specified upload URL.

- `itp storage file update-complete`  
  Marks the file upload as complete in iTwin storage.

- `itp storage file list`  
  Lists the contents of a folder to confirm that the upload was successful.

## Example

**Step 1: Create an iTwin**
```bash
itp itwin create --class "Thing" --sub-class "Asset" --display-name "New Infrastructure Project" 
```

**Step 2: Get the root folder**
```bash
itp storage root-folder --itwin-id "your-itwin-id"
```

**Step 3: Create a folder called "floor plans"**
```bash
itp storage folder create --parent-folder-id "root-folder-id" --display-name "Floor Plans"
```

**Step 4: Create the file record**
```bash
itp storage file create --folder-id "your-folder-id" --display-name "floorplan.pdf"
```

**Step 5: Upload the floorplan.pdf**
```bash
itp storage file upload --upload-url "https://example.com/upload-url" --file-path "/path/to/floorplan.pdf"
```

**Step 6: Complete the upload**
```bash
itp storage file update-complete --file-id "your-file-id"
```

**Step 7: Confirm the upload by viewing the folder contents**
```bash
itp storage file list --folder-id "your-folder-id"
```

## Expected Outcome

By following these steps, you will have created an iTwin, organized a "floor plans" folder in the iTwin’s storage, created a file record for the PDF, uploaded the PDF in multiple steps, and confirmed the upload by viewing the folder's contents.

## Next Steps

- **Manage Project Documents**: Continue uploading, organizing, and managing additional project documents as needed.
