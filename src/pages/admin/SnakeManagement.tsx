import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/contexts/AuthContext';
import { Plus, Pencil, Trash2, Search } from 'lucide-react';

interface Snake {
  id: number;
  common_name: string;
  species_name: string;
  venomous: 'Non-venomous' | 'Mildly venomous' | 'Highly venomous';
  status: string;
  distribution: string;
  habitat: string;
  description: string;
  ecological_role: string;
  image_url?: string;
}

const PHP_API_URL = import.meta.env.VITE_PHP_API_URL || 'http://localhost/snake_vision_hub/api';

const emptySnake: Omit<Snake, 'id'> = {
  common_name: '',
  species_name: '',
  venomous: 'Non-venomous',
  status: 'Least concern',
  distribution: '',
  habitat: '',
  description: '',
  ecological_role: '',
  image_url: '',
};

const SnakeManagement = () => {
  const [snakes, setSnakes] = useState<Snake[]>([]);
  const [filteredSnakes, setFilteredSnakes] = useState<Snake[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingSnake, setEditingSnake] = useState<Snake | null>(null);
  const [formData, setFormData] = useState<Omit<Snake, 'id'>>(emptySnake);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const { token } = useAuth();
  const { toast } = useToast();

  const fetchSnakes = async () => {
    try {
      const response = await fetch(`${PHP_API_URL}/snakes/read.php`);
      const data = await response.json();
      if (data.success) {
        setSnakes(data.data);
        setFilteredSnakes(data.data);
      }
    } catch (error) {
      console.error('Error fetching snakes:', error);
      toast({
        title: 'Error',
        description: 'Failed to load snakes',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchSnakes();
  }, []);

  useEffect(() => {
    const filtered = snakes.filter(
      (snake) =>
        snake.common_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        snake.species_name.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredSnakes(filtered);
  }, [searchTerm, snakes]);

  const handleOpenDialog = (snake?: Snake) => {
    if (snake) {
      setEditingSnake(snake);
      setFormData({
        common_name: snake.common_name,
        species_name: snake.species_name,
        venomous: snake.venomous,
        status: snake.status,
        distribution: snake.distribution,
        habitat: snake.habitat,
        description: snake.description,
        ecological_role: snake.ecological_role,
        image_url: snake.image_url || '',
      });
    } else {
      setEditingSnake(null);
      setFormData(emptySnake);
    }
    setIsDialogOpen(true);
  };

  const handleSubmit = async () => {
    if (!formData.common_name || !formData.species_name) {
      toast({
        title: 'Validation Error',
        description: 'Common name and species name are required',
        variant: 'destructive',
      });
      return;
    }

    setIsSubmitting(true);

    try {
      const url = editingSnake
        ? `${PHP_API_URL}/snakes/update.php`
        : `${PHP_API_URL}/snakes/create.php`;
      
      const body = editingSnake
        ? { id: editingSnake.id, ...formData }
        : formData;

      const response = await fetch(url, {
        method: editingSnake ? 'PUT' : 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(body),
      });

      const data = await response.json();

      if (data.success) {
        toast({
          title: 'Success',
          description: editingSnake ? 'Snake updated successfully' : 'Snake created successfully',
        });
        setIsDialogOpen(false);
        fetchSnakes();
      } else {
        toast({
          title: 'Error',
          description: data.message || 'Operation failed',
          variant: 'destructive',
        });
      }
    } catch (error) {
      console.error('Error saving snake:', error);
      toast({
        title: 'Error',
        description: 'Failed to save snake',
        variant: 'destructive',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (snake: Snake) => {
    try {
      const response = await fetch(`${PHP_API_URL}/snakes/delete.php?id=${snake.id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      const data = await response.json();

      if (data.success) {
        toast({
          title: 'Success',
          description: 'Snake deleted successfully',
        });
        fetchSnakes();
      } else {
        toast({
          title: 'Error',
          description: data.message || 'Failed to delete snake',
          variant: 'destructive',
        });
      }
    } catch (error) {
      console.error('Error deleting snake:', error);
      toast({
        title: 'Error',
        description: 'Failed to delete snake',
        variant: 'destructive',
      });
    }
  };

  const getVenomBadgeVariant = (venomous: string) => {
    switch (venomous) {
      case 'Highly venomous':
        return 'destructive';
      case 'Mildly venomous':
        return 'secondary';
      default:
        return 'outline';
    }
  };

  if (isLoading) {
    return (
      <div className="flex min-h-[calc(100vh-3.5rem)] items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
      </div>
    );
  }

  return (
    <div className="container mx-auto max-w-7xl px-4 py-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        <Card>
          <CardHeader>
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <CardTitle className="text-2xl">Snake Management</CardTitle>
                <CardDescription>
                  Manage the snake species database. Add, edit, or remove species.
                </CardDescription>
              </div>
              <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                <DialogTrigger asChild>
                  <Button onClick={() => handleOpenDialog()}>
                    <Plus className="mr-2 h-4 w-4" />
                    Add Snake
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-2xl">
                  <DialogHeader>
                    <DialogTitle>{editingSnake ? 'Edit Snake' : 'Add New Snake'}</DialogTitle>
                    <DialogDescription>
                      {editingSnake ? 'Update the snake details below.' : 'Fill in the details for the new snake species.'}
                    </DialogDescription>
                  </DialogHeader>
                  <div className="grid gap-4 py-4">
                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                      <div className="space-y-2">
                        <Label htmlFor="common_name">Common Name *</Label>
                        <Input
                          id="common_name"
                          value={formData.common_name}
                          onChange={(e) => setFormData({ ...formData, common_name: e.target.value })}
                          placeholder="e.g., Philippine Cobra"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="species_name">Species Name *</Label>
                        <Input
                          id="species_name"
                          value={formData.species_name}
                          onChange={(e) => setFormData({ ...formData, species_name: e.target.value })}
                          placeholder="e.g., Naja philippinensis"
                        />
                      </div>
                    </div>
                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                      <div className="space-y-2">
                        <Label htmlFor="venomous">Venom Level *</Label>
                        <Select
                          value={formData.venomous}
                          onValueChange={(value: 'Non-venomous' | 'Mildly venomous' | 'Highly venomous') => 
                            setFormData({ ...formData, venomous: value })
                          }
                        >
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="Non-venomous">Non-venomous</SelectItem>
                            <SelectItem value="Mildly venomous">Mildly venomous</SelectItem>
                            <SelectItem value="Highly venomous">Highly venomous</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="status">Conservation Status</Label>
                        <Input
                          id="status"
                          value={formData.status}
                          onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                          placeholder="e.g., Least concern"
                        />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="distribution">Distribution</Label>
                      <Textarea
                        id="distribution"
                        value={formData.distribution}
                        onChange={(e) => setFormData({ ...formData, distribution: e.target.value })}
                        placeholder="Geographic distribution..."
                        rows={2}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="habitat">Habitat</Label>
                      <Textarea
                        id="habitat"
                        value={formData.habitat}
                        onChange={(e) => setFormData({ ...formData, habitat: e.target.value })}
                        placeholder="Natural habitat..."
                        rows={2}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="description">Description</Label>
                      <Textarea
                        id="description"
                        value={formData.description}
                        onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                        placeholder="Physical description and characteristics..."
                        rows={3}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="ecological_role">Ecological Role</Label>
                      <Textarea
                        id="ecological_role"
                        value={formData.ecological_role}
                        onChange={(e) => setFormData({ ...formData, ecological_role: e.target.value })}
                        placeholder="Role in the ecosystem..."
                        rows={2}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="image_url">Image URL</Label>
                      <Input
                        id="image_url"
                        value={formData.image_url}
                        onChange={(e) => setFormData({ ...formData, image_url: e.target.value })}
                        placeholder="https://example.com/image.jpg"
                      />
                    </div>
                  </div>
                  <DialogFooter>
                    <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
                      Cancel
                    </Button>
                    <Button onClick={handleSubmit} disabled={isSubmitting}>
                      {isSubmitting ? 'Saving...' : editingSnake ? 'Update' : 'Create'}
                    </Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            </div>
          </CardHeader>
          <CardContent>
            <div className="mb-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  placeholder="Search snakes..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Common Name</TableHead>
                    <TableHead className="hidden sm:table-cell">Species Name</TableHead>
                    <TableHead>Venom</TableHead>
                    <TableHead className="hidden md:table-cell">Status</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredSnakes.map((snake) => (
                    <TableRow key={snake.id}>
                      <TableCell className="font-medium">{snake.common_name}</TableCell>
                      <TableCell className="hidden italic text-muted-foreground sm:table-cell">
                        {snake.species_name}
                      </TableCell>
                      <TableCell>
                        <Badge variant={getVenomBadgeVariant(snake.venomous)}>
                          {snake.venomous}
                        </Badge>
                      </TableCell>
                      <TableCell className="hidden md:table-cell">{snake.status}</TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleOpenDialog(snake)}
                          >
                            <Pencil className="h-4 w-4" />
                          </Button>
                          <AlertDialog>
                            <AlertDialogTrigger asChild>
                              <Button variant="ghost" size="icon">
                                <Trash2 className="h-4 w-4 text-destructive" />
                              </Button>
                            </AlertDialogTrigger>
                            <AlertDialogContent>
                              <AlertDialogHeader>
                                <AlertDialogTitle>Delete Snake</AlertDialogTitle>
                                <AlertDialogDescription>
                                  Are you sure you want to delete "{snake.common_name}"? This action cannot be undone.
                                </AlertDialogDescription>
                              </AlertDialogHeader>
                              <AlertDialogFooter>
                                <AlertDialogCancel>Cancel</AlertDialogCancel>
                                <AlertDialogAction
                                  onClick={() => handleDelete(snake)}
                                  className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                                >
                                  Delete
                                </AlertDialogAction>
                              </AlertDialogFooter>
                            </AlertDialogContent>
                          </AlertDialog>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                  {filteredSnakes.length === 0 && (
                    <TableRow>
                      <TableCell colSpan={5} className="text-center text-muted-foreground">
                        No snakes found
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
};

export default SnakeManagement;
