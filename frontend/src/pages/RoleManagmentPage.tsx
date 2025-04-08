import React, { useState, useEffect } from 'react';
import {
  addRole,
  assignRoleToUser,
  fetchRoles,
  fetchUsersInRole,
} from '../api/MoviesAPI';
import { MoviesUser } from '../types/MoviesUser';

const RoleManagementPage: React.FC = () => {
  const [roleName, setRoleName] = useState('');
  const [userEmail, setUserEmail] = useState('');
  const [roleAssignmentMessage, setRoleAssignmentMessage] = useState('');
  const [roleCreationMessage, setRoleCreationMessage] = useState('');
  const [roles, setRoles] = useState<string[]>([]); // List of roles
  const [usersInRole, setUsersInRole] = useState<MoviesUser[]>([]); // Users in selected role
  const [selectedRole, setSelectedRole] = useState<string>('');

  // Fetch roles when the component is mounted
  useEffect(() => {
    const fetchRolesList = async () => {
      try {
        const response = await fetchRoles();
        setRoles(response); // Assuming it returns a list of role names
      } catch (error) {
        console.error('Error fetching roles: ', error);
      }
    };

    fetchRolesList();
  }, []);

  // Fetch users in a role when a role is selected
  useEffect(() => {
    if (selectedRole) {
      const fetchUsers = async () => {
        try {
          const response = await fetchUsersInRole(selectedRole);
          setUsersInRole(response); // Assuming it returns an array of users
        } catch (error) {
          console.error('Error fetching users in role: ', error);
        }
      };

      fetchUsers();
    }
  }, [selectedRole]);

  const handleAddRole = async () => {
    try {
      const message = await addRole(roleName);
      setRoleCreationMessage(message);
    } catch (error: unknown) {
      if (error instanceof Error) {
        setRoleCreationMessage('Error adding role: ' + error.message);
      } else {
        setRoleCreationMessage('Unknown error occurred while adding role.');
      }
    }
  };

  const handleAssignRoleToUser = async () => {
    try {
      const message = await assignRoleToUser(userEmail, roleName);
      setRoleAssignmentMessage(message);
    } catch (error: unknown) {
      if (error instanceof Error) {
        // If error contains a message, display it
        setRoleAssignmentMessage('Error assigning role: ' + error.message);
      } else {
        // Fallback message for unknown error types
        setRoleAssignmentMessage(
          'Unknown error occurred while assigning role.'
        );
      }
    }
  };

  return (
    <div className="container">
      <h2>Role Management</h2>

      {/* Role creation form */}
      <div className="mb-3">
        <label htmlFor="roleName" className="form-label">
          Role Name
        </label>
        <input
          type="text"
          className="form-control"
          id="roleName"
          value={roleName}
          onChange={(e) => setRoleName(e.target.value)}
        />
      </div>
      <button onClick={handleAddRole} className="btn btn-primary">
        Add Role
      </button>

      {/* Role assignment to user */}
      <div className="mt-3">
        <h4>Assign Role to User</h4>
        <div className="mb-3">
          <label htmlFor="userEmail" className="form-label">
            User Email
          </label>
          <input
            type="email"
            className="form-control"
            id="userEmail"
            value={userEmail}
            onChange={(e) => setUserEmail(e.target.value)}
          />
        </div>
        <button onClick={handleAssignRoleToUser} className="btn btn-success">
          Assign Role
        </button>
      </div>

      {/* Role Selection Dropdown */}
      <div className="mt-3">
        <h4>Select a Role to View Users</h4>
        <select
          className="form-select"
          value={selectedRole}
          onChange={(e) => setSelectedRole(e.target.value)}
        >
          <option value="">-- Select Role --</option>
          {roles.map((role, index) => (
            <option key={index} value={role}>
              {role}
            </option>
          ))}
        </select>

        {/* Display users assigned to the selected role */}
        {selectedRole && (
          <div className="mt-3">
            <h5>Users in Role "{selectedRole}"</h5>
            <ul>
              {usersInRole.length > 0 ? (
                usersInRole.map((user, index) => (
                  <li key={index}>{user.email}</li> // Assuming `email` is a property of the user
                ))
              ) : (
                <p>No users assigned to this role.</p>
              )}
            </ul>
          </div>
        )}
      </div>

      {/* Messages */}
      {roleCreationMessage && (
        <div className="alert alert-info mt-3">{roleCreationMessage}</div>
      )}
      {roleAssignmentMessage && (
        <div className="alert alert-info mt-3">{roleAssignmentMessage}</div>
      )}
    </div>
  );
};

export default RoleManagementPage;
