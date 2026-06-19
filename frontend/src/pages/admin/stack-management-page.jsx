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
import { Loader2, Plus, Trash2, Edit2 } from 'lucide-react';
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
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from '@/components/ui/dialog';

export function AdminStackManagementPage() {
  const [stacks, setStacks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedStack, setSelectedStack] = useState(null);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const [newStackName, setNewStackName] = useState('');
  const [newStackDescription, setNewStackDescription] = useState('');
  const [editingStack, setEditingStack] = useState(null);

  useEffect(() => {
    fetchStacks();
  }, []);

  const fetchStacks = async () => {
    try {
      setLoading(true);
      const response = await api.get('/stacks');
      setStacks(response.data || []);
    } catch (error) {
      console.error('Failed to fetch stacks:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateStack = async () => {
    if (!newStackName.trim()) {
      alert('Stack name is required');
      return;
    }

    try {
      await api.post('/stacks', {
        name: newStackName,
        description: newStackDescription,
      });
      setNewStackName('');
      setNewStackDescription('');
      setShowCreateDialog(false);
      await fetchStacks();
    } catch (error) {
      console.error('Failed to create stack:', error);
      alert('Failed to create stack');
    }
  };

  const handleDeleteStack = async (stackId) => {
    try {
      await api.delete(`/stacks/${stackId}`);
      setShowDeleteDialog(false);
      setSelectedStack(null);
      await fetchStacks();
    } catch (error) {
      console.error('Failed to delete stack:', error);
      alert('Failed to delete stack');
    }
  };

  const handleUpdateStack = async (stackId) => {
    if (!editingStack.name.trim()) {
      alert('Stack name is required');
      return;
    }

    try {
      await api.patch(`/stacks/${stackId}`, {
        name: editingStack.name,
        description: editingStack.description,
      });
      setEditingStack(null);
      await fetchStacks();
    } catch (error) {
      console.error('Failed to update stack:', error);
      alert('Failed to update stack');
    }
  };

  return (
    <div className="flex flex-col gap-8">
      <div className="flex items-center justify-between">
        <PageHeader
          title="Tech Stack Management"
          description="Create, edit, and manage technology stack categories for mentors and students."
        />
        <Dialog open={showCreateDialog} onOpenChange={setShowCreateDialog}>
          <DialogTrigger asChild>
            <Button className="gap-2">
              <Plus className="h-4 w-4" />
              New Stack
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Create New Stack</DialogTitle>
              <DialogDescription>
                Add a new technology stack category to the platform.
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Stack Name</label>
                <input
                  type="text"
                  placeholder="e.g., React Engineering, Python Systems"
                  value={newStackName}
                  onChange={(e) => setNewStackName(e.target.value)}
                  className="w-full px-3 py-2 border rounded-md text-sm"
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Description</label>
                <textarea
                  placeholder="Brief description of this tech stack..."
                  value={newStackDescription}
                  onChange={(e) => setNewStackDescription(e.target.value)}
                  className="w-full px-3 py-2 border rounded-md text-sm"
                  rows="3"
                />
              </div>
            </div>
            <DialogFooter>
              <Button
                variant="outline"
                onClick={() => setShowCreateDialog(false)}
              >
                Cancel
              </Button>
              <Button onClick={handleCreateStack}>Create Stack</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      {loading ? (
        <Card>
          <CardContent className="flex items-center justify-center py-8 gap-2">
            <Loader2 className="h-4 w-4 animate-spin" />
            <span>Loading stacks...</span>
          </CardContent>
        </Card>
      ) : (
        <Card>
          <CardHeader>
            <CardTitle>Available Stacks</CardTitle>
            <CardDescription>
              {stacks.length} technology stack{stacks.length !== 1 ? 's' : ''}{' '}
              configured on the platform
            </CardDescription>
          </CardHeader>
          <CardContent>
            {stacks.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                <p>No stacks created yet.</p>
                <p className="text-sm mt-2">Create your first stack to get started.</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Name</TableHead>
                      <TableHead>Description</TableHead>
                      <TableHead>Mentors</TableHead>
                      <TableHead>Students</TableHead>
                      <TableHead>Created</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {stacks.map((stack) => (
                      <TableRow key={stack._id}>
                        <TableCell className="font-medium">
                          {stack.name}
                        </TableCell>
                        <TableCell className="text-sm">
                          {stack.description || '—'}
                        </TableCell>
                        <TableCell>
                          <Badge variant="outline">
                            {stack.mentors?.length || 0}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <Badge variant="outline">
                            {stack.students?.length || 0}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-xs text-gray-500">
                          {new Date(stack.createdAt).toLocaleDateString()}
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="flex gap-2 justify-end">
                            <Dialog>
                              <DialogTrigger asChild>
                                <Button
                                  size="sm"
                                  variant="outline"
                                  onClick={() =>
                                    setEditingStack({
                                      ...stack,
                                    })
                                  }
                                >
                                  <Edit2 className="h-4 w-4" />
                                </Button>
                              </DialogTrigger>
                              {editingStack?._id === stack._id && (
                                <DialogContent>
                                  <DialogHeader>
                                    <DialogTitle>Edit Stack</DialogTitle>
                                  </DialogHeader>
                                  <div className="space-y-4 py-4">
                                    <div className="space-y-2">
                                      <label className="text-sm font-medium">
                                        Stack Name
                                      </label>
                                      <input
                                        type="text"
                                        value={editingStack.name}
                                        onChange={(e) =>
                                          setEditingStack({
                                            ...editingStack,
                                            name: e.target.value,
                                          })
                                        }
                                        className="w-full px-3 py-2 border rounded-md text-sm"
                                      />
                                    </div>
                                    <div className="space-y-2">
                                      <label className="text-sm font-medium">
                                        Description
                                      </label>
                                      <textarea
                                        value={editingStack.description || ''}
                                        onChange={(e) =>
                                          setEditingStack({
                                            ...editingStack,
                                            description: e.target.value,
                                          })
                                        }
                                        className="w-full px-3 py-2 border rounded-md text-sm"
                                        rows="3"
                                      />
                                    </div>
                                  </div>
                                  <DialogFooter>
                                    <Button
                                      variant="outline"
                                      onClick={() => setEditingStack(null)}
                                    >
                                      Cancel
                                    </Button>
                                    <Button
                                      onClick={() =>
                                        handleUpdateStack(stack._id)
                                      }
                                    >
                                      Save Changes
                                    </Button>
                                  </DialogFooter>
                                </DialogContent>
                              )}
                            </Dialog>

                            <Button
                              size="sm"
                              variant="outline"
                              className="text-red-600"
                              onClick={() => {
                                setSelectedStack(stack);
                                setShowDeleteDialog(true);
                              }}
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            )}
          </CardContent>
        </Card>
      )}

      <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Stack?</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete "{selectedStack?.name}"? This
              action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <div className="flex gap-3">
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => handleDeleteStack(selectedStack._id)}
              className="bg-red-600"
            >
              Delete
            </AlertDialogAction>
          </div>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
