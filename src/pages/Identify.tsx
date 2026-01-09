import { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { predictSnake, PredictionResult } from "@/services/api";
import { Upload, Camera, AlertTriangle, CheckCircle, Loader2 } from "lucide-react";

const Identify = () => {
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [predictions, setPredictions] = useState<PredictionResult[]>([]);
  const [loading, setLoading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const navigate = useNavigate();

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
        setPredictions([]);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleIdentify = async () => {
    if (!imagePreview) return;
    
    setLoading(true);
    try {
      const results = await predictSnake(imagePreview);
      setPredictions(results);
    } catch (error) {
      console.error('Prediction failed:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCameraCapture = () => {
    if (fileInputRef.current) {
      fileInputRef.current.setAttribute("capture", "environment");
      fileInputRef.current.click();
    }
  };

  const getVenomBadgeVariant = (venomous: string) => {
    if (venomous.includes("Highly")) return "destructive";
    if (venomous.includes("Mildly")) return "secondary";
    return "outline";
  };

  const getVenomIcon = (venomous: string) => {
    if (venomous.includes("Highly")) return <AlertTriangle className="h-3 w-3" />;
    return <CheckCircle className="h-3 w-3" />;
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="container mx-auto px-4 py-8 max-w-2xl"
    >
      <h2 className="text-2xl font-bold mb-6 text-foreground">Snake Identification</h2>
      
      <Card className="mb-6">
        <CardHeader>
          <CardTitle className="text-lg">Upload Image</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex gap-2">
            <Button
              variant="outline"
              onClick={() => fileInputRef.current?.click()}
              className="flex-1"
            >
              <Upload className="mr-2 h-4 w-4" />
              Upload Image
            </Button>
            <Button
              variant="outline"
              onClick={handleCameraCapture}
              className="flex-1"
            >
              <Camera className="mr-2 h-4 w-4" />
              Camera
            </Button>
          </div>
          
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handleFileChange}
            className="hidden"
          />
          
          <AnimatePresence>
            {imagePreview && (
              <motion.div 
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="space-y-4"
              >
                <img
                  src={imagePreview}
                  alt="Preview"
                  className="w-full max-h-64 object-contain rounded-md border border-border"
                />
                <Button
                  onClick={handleIdentify}
                  disabled={loading}
                  className="w-full"
                >
                  {loading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Analyzing...
                    </>
                  ) : (
                    "Identify Snake"
                  )}
                </Button>
              </motion.div>
            )}
          </AnimatePresence>
        </CardContent>
      </Card>
      
      <AnimatePresence>
        {predictions.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
          >
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Identification Results</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {predictions.map((pred, index) => (
                  <motion.div
                    key={pred.species_name}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="space-y-2 p-4 rounded-lg bg-muted/50 cursor-pointer hover:bg-muted transition-colors"
                    onClick={() => navigate('/glossary')}
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium text-foreground">{pred.species_name}</p>
                        <p className="text-sm text-muted-foreground italic">{pred.scientific_name}</p>
                      </div>
                      <Badge variant={getVenomBadgeVariant(pred.venomous)} className="flex items-center gap-1">
                        {getVenomIcon(pred.venomous)}
                        {pred.venomous}
                      </Badge>
                    </div>
                    <div className="flex items-center gap-2">
                      <Progress value={pred.confidence * 100} className="flex-1" />
                      <span className="text-sm font-medium text-muted-foreground w-14 text-right">
                        {(pred.confidence * 100).toFixed(1)}%
                      </span>
                    </div>
                  </motion.div>
                ))}
              </CardContent>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default Identify;
