import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Trash2, Image, Loader2 } from "lucide-react";
import { toast } from "@/hooks/use-toast";
import { snakeApi, observationApi, Snake, Observation } from "@/services/api";
import { motion } from "framer-motion";

const Encode = () => {
  const [observations, setObservations] = useState<Observation[]>([]);
  const [snakes, setSnakes] = useState<Snake[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    species: "",
    length: "",
    weight: "",
    location: "",
    dateObserved: "",
    notes: ""
  });
  const [picturePreview, setPicturePreview] = useState<string | null>(null);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);
    try {
      const [snakesData, obsData] = await Promise.all([
        snakeApi.getAll().catch(() => []),
        observationApi.getAll().catch(() => [])
      ]);
      setSnakes(snakesData);
      setObservations(obsData);
    } catch (err) {
      console.error("Failed to load data:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.species || !formData.length || !formData.location || !formData.dateObserved) {
      toast({ title: "Error", description: "Please fill in all required fields", variant: "destructive" });
      return;
    }

    setSubmitting(true);
    try {
      const newObs = await observationApi.create({
        species: formData.species,
        length: parseFloat(formData.length),
        weight: formData.weight ? parseFloat(formData.weight) : undefined,
        location: formData.location,
        dateObserved: formData.dateObserved,
        pictureUrl: picturePreview || undefined,
        notes: formData.notes || undefined
      });

      setObservations([newObs, ...observations]);
      setFormData({ species: "", length: "", weight: "", location: "", dateObserved: "", notes: "" });
      setPicturePreview(null);
      toast({ title: "Success", description: "Observation saved to database" });
    } catch (err) {
      toast({ title: "Error", description: "Failed to save observation", variant: "destructive" });
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await observationApi.delete(id);
      setObservations(observations.filter(obs => obs.id !== id));
      toast({ title: "Deleted", description: "Observation removed" });
    } catch (err) {
      toast({ title: "Error", description: "Failed to delete", variant: "destructive" });
    }
  };

  const handlePictureChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => setPicturePreview(reader.result as string);
      reader.readAsDataURL(file);
    }
  };

  return (
    <motion.div 
      className="container mx-auto px-4 py-8"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
    >
      <h2 className="text-2xl font-bold mb-6 text-foreground">Data Encoding</h2>
      
      <Card className="mb-8">
        <CardHeader>
          <CardTitle className="text-lg">New Observation</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="species">Species *</Label>
                <Select value={formData.species} onValueChange={(v) => setFormData({...formData, species: v})}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select species" />
                  </SelectTrigger>
                  <SelectContent>
                    {snakes.map(s => (
                      <SelectItem key={s.id} value={s.commonName}>{s.commonName}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="length">Length (cm) *</Label>
                <Input
                  id="length"
                  type="number"
                  value={formData.length}
                  onChange={(e) => setFormData({...formData, length: e.target.value})}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="weight">Weight (g)</Label>
                <Input
                  id="weight"
                  type="number"
                  value={formData.weight}
                  onChange={(e) => setFormData({...formData, weight: e.target.value})}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="location">Location *</Label>
                <Input
                  id="location"
                  value={formData.location}
                  onChange={(e) => setFormData({...formData, location: e.target.value})}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="date">Date Observed *</Label>
                <Input
                  id="date"
                  type="date"
                  value={formData.dateObserved}
                  onChange={(e) => setFormData({...formData, dateObserved: e.target.value})}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="picture">Picture</Label>
                <Input id="picture" type="file" accept="image/*" onChange={handlePictureChange} />
              </div>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="notes">Notes</Label>
              <Textarea
                id="notes"
                value={formData.notes}
                onChange={(e) => setFormData({...formData, notes: e.target.value})}
              />
            </div>
            
            <Button type="submit" disabled={submitting}>
              {submitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Save Observation
            </Button>
          </form>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Observations ({observations.length})</CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <p className="text-muted-foreground">Loading...</p>
          ) : observations.length === 0 ? (
            <p className="text-muted-foreground">No observations recorded yet.</p>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Species</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>Location</TableHead>
                  <TableHead>Picture</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {observations.map(obs => (
                  <TableRow key={obs.id}>
                    <TableCell>{obs.species}</TableCell>
                    <TableCell>{obs.dateObserved}</TableCell>
                    <TableCell>{obs.location}</TableCell>
                    <TableCell>
                      {obs.pictureUrl ? <Image className="h-4 w-4 text-primary" /> : "-"}
                    </TableCell>
                    <TableCell>
                      <Button variant="ghost" size="sm" onClick={() => handleDelete(obs.id)}>
                        <Trash2 className="h-4 w-4 text-destructive" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default Encode;
