# Synchronization

Synchronization is the process of reading data from design files and writing into an iModel. This is accomplished by using connectors to facilitate data migration. The design files must first be uploaded to the iTwin Storage before running synchronization.

**Workflow steps:**

1. [Get root folder](https://developer.bentley.com/apis/storage/operations/get-top-level-folders-and-files-by-project/) of iTwin Storage.
2. [Create file](https://developer.bentley.com/apis/storage/operations/create-file/) metadata in root folder using folder ID. Capture file ID.
3. [Upload](https://developer.bentley.com/apis/storage/operations/update-file-content/) actual file data into the file.
4. [Complete upload](https://developer.bentley.com/apis/storage/operations/complete-file-creation/) of file. Confirmation step.
5. [Create a storage connection](https://developer.bentley.com/apis/synchronization/operations/create-storage-connection/). Add file (using file ID from step 2).
6. [Run storage connection](https://developer.bentley.com/apis/synchronization/operations/run-storage-connection/).
7. [Get storage connection](https://developer.bentley.com/apis/synchronization/operations/get-storage-connection-run/) run recursively until final status is obtained.
8. Print final synchronization status.

## Notes

1. For step 1 above . . . the root folder ID can be obtained by parsing the *folder* entry in the top-level *_links* entry of the response.

```json
{
    "items": [],
    "_links": {
        "self": {
            "href": "https://api.bentley.com/storage?iTwinId=c36c0051-0590-4282-be2f-ed3e8520ad01&$top=100&$skip=0"
        },
        "prev": {
            "href": "https://api.bentley.com/storage?iTwinId=c36c0051-0590-4282-be2f-ed3e8520ad01&$top=100&$skip=0"
        },
        "next": {
            "href": "https://api.bentley.com/storage?iTwinId=c36c0051-0590-4282-be2f-ed3e8520ad01&$top=100&$skip=100"
        },
        "folder": {
            "href": "https://api.bentley.com/storage/folders/UQBsw5AFgkK-L-0-hSCtAVEAbMOQBYJCvi_tPoUgrQE"
        }
    }
}
```

2. In step 5 . . . when creating a storage connection, the *connectorType* must be specified. If the *connectorType* is not specified by the user (assuming we make it an optional entry), it can be obtained from dictionary below.

```TypeScript
export const fileExtensionToConnectorType: { [key: string]: string[] } = {
  csv: ['SHELLEDWCSV'],
  dgn: ['CIVIL', 'MSTN', 'OBD', 'PROSTRUCTURES'],
  dwg: ['AUTOPLANT', 'AVEVAPID', 'CIVIL3D', 'DWG'],
  ifc: ['IFC'],
  shp: ['GEOSPATIAL'],
  xml: ['OPENTOWER'],
  rvt: ['REVIT'],
  zip: ['SPPID'],
  pid: ['SPPID'],
  vue: ['SPXREVIEW'],
  vsd: ['AVEVADIAGRAMS'],
  nwc: ['NWD'],
  nwd: ['NWD'],
  json: ['INTELLIPID'],
  xls: ['PSEXCEL'],
  xlsx: ['PSEXCEL'],
};

export function getConnectorTypeFromFileExtension(extension: string): string[] | undefined {
  return fileExtensionToConnectorType[extension.toLowerCase()];
}
```

For file types with multiple connector options, maybe we pick the most generic connectors? (MSTN and DWG).

## Code Sample

https://github.com/iTwin/course-synchronization-apis-storage-sample