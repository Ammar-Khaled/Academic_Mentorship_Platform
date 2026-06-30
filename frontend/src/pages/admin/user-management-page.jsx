import { useState, useEffect } from 'react';
import { PageHeader } from '@/components/layout/page-header';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  AlertCircle,
  CheckCircle,
  XCircle,
  Loader2,
} from 'lucide-react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '@/lib/api';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';

const statusColors = {
  pending: 'bg-yellow-100 text-yellow-800',
  approved: 'bg-green-100 text-green-800',
  blocked: 'bg-red-100 text-red-800',
  rejected: 'bg-gray-100 text-gray-800',
};

const statusIcons = {
  pending: AlertCircle,
  approved: CheckCircle,
  blocked: XCircle,
  rejected: XCircle,
};

export function AdminUserManagementPage() {
  const [users, setUsers] = useState([]);
  const [pendingUsers, setPendingUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedUser, setSelectedUser] = useState(null);
  const [actionType, setActionType] = useState(null);
  const [actionNotes, setActionNotes] = useState('');

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const [allUsersRes, pendingRes] = await Promise.all([
        api.get('/admin/users'),
        api.get('/admin/users/pending'),
      ]);

      const mapUser = (approval) => {
        if (!approval || !approval.user) return null;
        return {
          _id: approval.user._id,
          email: approval.user.email,
          role: approval.user.role,
          status: approval.status,
          createdAt: approval.user.createdAt || approval.createdAt,
          approvalId: approval._id,
        };
      };

      setUsers((allUsersRes.data || []).map(mapUser).filter(Boolean));
      setPendingUsers((pendingRes.data || []).map(mapUser).filter(Boolean));
    } catch (error) {
      console.error('Failed to fetch users:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async (userId) => {
    try {
      await api.post(`/admin/users/${userId}/approve`, {
        approvalNotes: actionNotes,
      });
      setActionType(null);
      setSelectedUser(null);
      setActionNotes('');
      await fetchUsers();
    } catch (error) {
      console.error('Failed to approve user:', error);
    }
  };

  const handleBlock = async (userId) => {
    try {
      await api.post(`/admin/users/${userId}/block`, {
        blockReason: actionNotes,
      });
      setActionType(null);
      setSelectedUser(null);
      setActionNotes('');
      await fetchUsers();
    } catch (error) {
      console.error('Failed to block user:', error);
    }
  };

  const handleUnblock = async (userId) => {
    try {
      await api.post(`/admin/users/${userId}/unblock`);
      setActionType(null);
      setSelectedUser(null);
      setActionNotes('');
      await fetchUsers();
    } catch (error) {
      console.error('Failed to unblock user:', error);
    }
  };

  const UserRow = ({ user, isPending = false }) => {
    const StatusIcon = statusIcons[user.status] || AlertCircle;
    return (
      <TableRow key={user._id}>
        <TableCell>
          <div className="flex flex-col gap-1">
            <span className="font-medium">{user.email}</span>
            <span className="text-xs text-gray-500">{user._id}</span>
          </div>
        </TableCell>
        <TableCell className="capitalize">{user.role}</TableCell>
        <TableCell>
          <Badge className={statusColors[user.status]}>
            <StatusIcon className="mr-1 h-3 w-3" />
            {user.status}
          </Badge>
        </TableCell>
        <TableCell className="text-sm text-gray-500">
          {new Date(user.createdAt).toLocaleDateString()}
        </TableCell>
        <TableCell className="text-right">
          {isPending && (
            <div className="flex gap-2 justify-end">
              <Button
                size="sm"
                variant="outline"
                onClick={() => {
                  setSelectedUser(user);
                  setActionType('approve');
                }}
              >
                Approve
              </Button>
              <Button
                size="sm"
                variant="destructive"
                onClick={() => {
                  setSelectedUser(user);
                  setActionType('block');
                }}
              >
                Block
              </Button>
            </div>
          )}
          {user.status === 'approved' && (
            <Button
              size="sm"
              variant="outline"
              onClick={() => {
                setSelectedUser(user);
                setActionType('block');
              }}
            >
              Block User
            </Button>
          )}
          {user.status === 'blocked' && (
            <Button
              size="sm"
              variant="outline"
              onClick={() => {
                setSelectedUser(user);
                setActionType('unblock');
              }}
            >
              Unblock
            </Button>
          )}
        </TableCell>
      </TableRow>
    );
  };

  return (
    <div className="flex flex-col gap-8">
      <PageHeader
        title="User Management"
        description="Approve mentor applications, block problematic users, and manage user status."
      />

      {loading ? (
        <Card>
          <CardContent className="flex items-center justify-center py-8 gap-2">
            <Loader2 className="h-4 w-4 animate-spin" />
            <span>Loading user data...</span>
          </CardContent>
        </Card>
      ) : (
        <Tabs defaultValue="pending">
          <TabsList>
            <TabsTrigger value="pending">
              Pending ({pendingUsers.length})
            </TabsTrigger>
            <TabsTrigger value="all">All Users ({users.length})</TabsTrigger>
            <TabsTrigger value="approved">
              Approved ({users.filter((u) => u.status === 'approved').length})
            </TabsTrigger>
            <TabsTrigger value="blocked">
              Blocked ({users.filter((u) => u.status === 'blocked').length})
            </TabsTrigger>
          </TabsList>

          <TabsContent value="pending">
            <Card>
              <CardHeader>
                <CardTitle>Pending User Approvals</CardTitle>
                <CardDescription>
                  Review and approve new mentor applications or user registrations.
                </CardDescription>
              </CardHeader>
              <CardContent>
                {pendingUsers.length === 0 ? (
                  <div className="text-center py-8 text-gray-500">
                    No pending approvals at this time.
                  </div>
                ) : (
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Email</TableHead>
                        <TableHead>Role</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Applied Date</TableHead>
                        <TableHead className="text-right">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {pendingUsers.map((user) => (
                        <UserRow key={user._id} user={user} isPending={true} />
                      ))}
                    </TableBody>
                  </Table>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="all">
            <Card>
              <CardHeader>
                <CardTitle>All Users</CardTitle>
                <CardDescription>
                  View all registered users on the platform.
                </CardDescription>
              </CardHeader>
              <CardContent>
                {users.length === 0 ? (
                  <div className="text-center py-8 text-gray-500">
                    No users found.
                  </div>
                ) : (
                  <div className="overflow-x-auto">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Email</TableHead>
                          <TableHead>Role</TableHead>
                          <TableHead>Status</TableHead>
                          <TableHead>Registered</TableHead>
                          <TableHead className="text-right">Actions</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {users.map((user) => (
                          <UserRow key={user._id} user={user} />
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="approved">
            <Card>
              <CardHeader>
                <CardTitle>Approved Users</CardTitle>
              </CardHeader>
              <CardContent>
                {users.filter((u) => u.status === 'approved').length === 0 ? (
                  <div className="text-center py-8 text-gray-500">
                    No approved users.
                  </div>
                ) : (
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Email</TableHead>
                        <TableHead>Role</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Approved Date</TableHead>
                        <TableHead className="text-right">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {users
                        .filter((u) => u.status === 'approved')
                        .map((user) => (
                          <UserRow key={user._id} user={user} />
                        ))}
                    </TableBody>
                  </Table>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="blocked">
            <Card>
              <CardHeader>
                <CardTitle>Blocked Users</CardTitle>
              </CardHeader>
              <CardContent>
                {users.filter((u) => u.status === 'blocked').length === 0 ? (
                  <div className="text-center py-8 text-gray-500">
                    No blocked users.
                  </div>
                ) : (
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Email</TableHead>
                        <TableHead>Role</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Blocked Date</TableHead>
                        <TableHead className="text-right">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {users
                        .filter((u) => u.status === 'blocked')
                        .map((user) => (
                          <UserRow key={user._id} user={user} />
                        ))}
                    </TableBody>
                  </Table>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      )}

      <AlertDialog open={!!actionType}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>
              {actionType === 'approve' && 'Approve User'}
              {actionType === 'block' && 'Block User'}
              {actionType === 'unblock' && 'Unblock User'}
            </AlertDialogTitle>
            <AlertDialogDescription>
              {actionType === 'approve' &&
                'Are you sure you want to approve this user? They will gain access to the platform.'}
              {actionType === 'block' &&
                'This user will be blocked from accessing the platform.'}
              {actionType === 'unblock' &&
                'This user will be unblocked and regain access.'}
            </AlertDialogDescription>
          </AlertDialogHeader>
          {(actionType === 'approve' || actionType === 'block') && (
            <div className="space-y-4">
              <textarea
                placeholder="Add optional notes..."
                value={actionNotes}
                onChange={(e) => setActionNotes(e.target.value)}
                className="w-full p-2 border rounded text-sm"
                rows="3"
              />
            </div>
          )}
          <div className="flex gap-3">
            <AlertDialogCancel onClick={() => setActionType(null)}>
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={async () => {
                if (actionType === 'approve') {
                  await handleApprove(selectedUser._id);
                } else if (actionType === 'block') {
                  await handleBlock(selectedUser._id);
                } else if (actionType === 'unblock') {
                  await handleUnblock(selectedUser._id);
                }
              }}
              className={actionType === 'block' ? 'bg-red-600' : ''}
            >
              {actionType === 'approve' && 'Approve'}
              {actionType === 'block' && 'Block'}
              {actionType === 'unblock' && 'Unblock'}
            </AlertDialogAction>
          </div>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
