# Provide a groups of users iTwin access

## Scenario

As a user, I want to create a group of users, assign roles and permissions, and provide them access to an iTwin for effective collaboration.

## Steps

1. **Create a group**: First, create a new group for the users.
2. **Update group (add members)**: Add users to the newly created group.
3. **Create a role**: Define a role that will grant specific permissions to the users.
4. **Update role (add permissions)**: Assign permissions to the created role.
5. **Add group and role to iTwin**: Finally, add the group and role as members of the iTwin.

## Commands Used

- `itp access-control group create`  
  Creates a new group in the iTwin.

- `itp access-control group update`  
  Updates a group by adding members.

- `itp access-control role create`  
  Creates a role for permission management.

- `itp access-control role update`  
  Updates the role by adding the required permissions.

- `itp access-control member group add`  
  Adds the group and role to the iTwin as a member.

## Example

Step 1: Create a group
```bash
itp access-control group create --itwin-id your-itwin-id --name "Project Team" --description "Primary team"
```

Step 2: Add members to the group
```bash
itp access-control group update --itwin-id your-itwin-id --group-id your-group-id --member user1@example.com --member user2@example.com
```

Step 3: Create a role
```bash
itp access-control role create --itwin-id your-itwin-id --name "Project Manager" --description "Role for project managers"
```

Step 4: Add permissions to the role
```bash
itp access-control role update --itwin-id your-itwin-id --role-id your-role-id --permission itwins_modify --permission imodels_manage --permission realitydata_manage
```

Step 5: Add the group and role to the iTwin as members
```bash
itp access-control member group add --itwin-id your-itwin-id --groups '[{"groupId": "your-group-id", "roleIds": ["your-role-id"]}]'
```

## Expected Outcome

By following these steps, you will have created a group of users, assigned a role with specific permissions, and provided them access to the iTwin, allowing them to collaborate on the project.

## Next Steps

- **Manage Access**: Update the group and role over time as more members join or permissions need adjustment.
