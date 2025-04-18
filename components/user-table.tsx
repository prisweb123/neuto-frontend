import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { UserActionButtons } from "@/components/user-action-buttons"

interface User {
  id: number;
  name: string;
  email: string;
  role: string;
  active: boolean;
  created_at: string;
  updated_at: string;
}

interface UserTableProps {
  users: User[];
  onEdit: (user: User) => void;
  onDelete: (userId: number) => void;
}

export function UserTable({ users, onEdit, onDelete }: UserTableProps) {
  const handleEdit = (user: User) => {
    onEdit(user);
  };

  const handleDelete = (userId: number) => {
    onDelete(userId);
  };

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Name</TableHead>
          <TableHead>Email</TableHead>
          <TableHead>Role</TableHead>
          <TableHead>Status</TableHead>
          <TableHead>Actions</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {users.map((user) => (
          <TableRow key={user.id}>
            <TableCell>{user.name}</TableCell>
            <TableCell>{user.email}</TableCell>
            <TableCell>{user.role}</TableCell>
            <TableCell>
              <Badge variant={user.active ? "default" : "secondary"}>
                {user.active ? "Active" : "Inactive"}
              </Badge>
            </TableCell>
            <TableCell>
              <UserActionButtons user={user} onEdit={handleEdit} onDelete={handleDelete} />
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
} 