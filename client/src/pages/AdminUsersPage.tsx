import {
  MenuItem,
  Select,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
  type SelectChangeEvent,
} from '@mui/material'
import { getErrorMessage } from '../api/client'
import type { Role } from '../api/types'
import CenteredSpinner from '../components/common/CenteredSpinner'
import ErrorAlert from '../components/common/ErrorAlert'
import { useAuth } from '../auth/useAuth'
import { useUpdateUserRole, useUsers } from '../hooks/useUsers'

const roles: Role[] = ['user', 'creator', 'administrator']

export default function AdminUsersPage() {
  const usersQuery = useUsers()
  const updateRoleMutation = useUpdateUserRole()
  const { user: currentUser } = useAuth()

  if (usersQuery.isLoading) {
    return <CenteredSpinner />
  }

  if (usersQuery.isError) {
    return <ErrorAlert message={getErrorMessage(usersQuery.error, 'Could not load users.')} />
  }

  const users = usersQuery.data ?? []

  function handleRoleChange(userId: number, event: SelectChangeEvent<Role>) {
    updateRoleMutation.mutate({ userId, role: event.target.value as Role })
  }

  return (
    <Stack spacing={3}>
      <Typography variant="h4" component="h1" sx={{ fontWeight: 700 }}>
        Manage users
      </Typography>
      <ErrorAlert message={updateRoleMutation.isError ? getErrorMessage(updateRoleMutation.error, 'Could not update that user\'s role.') : null} />
      <TableContainer>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Username</TableCell>
              <TableCell>Email</TableCell>
              <TableCell>Role</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {users.map((user) => (
              <TableRow key={user.id}>
                <TableCell>{user.username}</TableCell>
                <TableCell>{user.email}</TableCell>
                <TableCell>
                  <Select
                    size="small"
                    value={user.role}
                    disabled={user.id === currentUser?.id}
                    onChange={(event) => handleRoleChange(user.id, event)}
                  >
                    {roles.map((role) => (
                      <MenuItem key={role} value={role}>
                        {role}
                      </MenuItem>
                    ))}
                  </Select>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Stack>
  )
}
