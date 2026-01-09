import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { predictionApi, PredictionResult } from "@/services/api";
import { Upload, Camera, Loader2, AlertTriangle, CheckCircle } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "@/hooks/use-toast";

const Identify = () => {
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [predictions, setPredictions] = useState<PredictionResult[]>([]);
  const [loading, setLoading] = useState(false);
  const [cameraActive, setCameraActive] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const streamRef = useRef<MediaStream | null>(null);

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
      const results = await predictionApi.predictFromBase64(imagePreview);
      setPredictions(results);
    } catch (err) {
      toast({
        title: "Prediction Failed",
        description: "Could not connect to Python backend. Using demo mode.",
        variant: "destructive"
      });
      // Demo fallback
      setPredictions([
        { species: "King Cobra", confidence: 0.85 },
        { species: "Samar Cobra", confidence: 0.10 },
        { species: "Reticulated Python", confidence: 0.03 }
      ]);
    } finally {
      setLoading(false);
    }
  };

  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ 
        video: { facingMode: "environment" } 
      });
      streamRef.current = stream;
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }
      setCameraActive(true);
    } catch (err) {
      toast({
        title: "Camera Error",
        description: "Could not access camera. Please check permissions.",
        variant: "destructive"
      });
    }
  };

  const captureFromCamera = () => {
    if (videoRef.current) {
      const canvas = document.createElement("canvas");
      canvas.width = videoRef.current.videoWidth;
      canvas.height = videoRef.current.videoHeight;
      const ctx = canvas.getContext("2d");
      ctx?.drawImage(videoRef.current, 0, 0);
      setImagePreview(canvas.toDataURL("image/jpeg"));
      stopCamera();
      setPredictions([]);
    }
  };

  const stopCamera = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
      streamRef.current = null;
    }
    setCameraActive(false);
  };

  return (
    <motion.div 
      className="container mx-auto px-4 py-8 max-w-2xl"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
    >
      <h2 className="text-2xl font-bold mb-2 text-foreground">Snake Identification</h2>
      <p className="text-muted-foreground mb-6">Upload or capture an image to identify the snake species</p>
      
      <Card className="mb-6">
        <CardHeader>
          <CardTitle className="text-lg">Image Input</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {!cameraActive && (
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
                onClick={startCamera}
                className="flex-1"
              >
                <Camera className="mr-2 h-4 w-4" />
                Use Camera
              </Button>
            </div>
          )}
          
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handleFileChange}
            className="hidden"
          />

          <AnimatePresence mode="wait">
            {cameraActive && (
              <motion.div 
                className="space-y-4"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
              >
                <video
                  ref={videoRef}
                  autoPlay
                  playsInline
                  className="w-full rounded-md border border-border"
                />
                <div className="flex gap-2">
                  <Button onClick={captureFromCamera} className="flex-1">
                    Capture
                  </Button>
                  <Button variant="outline" onClick={stopCamera}>
                    Cancel
                  </Button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
          
          {imagePreview && !cameraActive && (
            <motion.div 
              className="space-y-4"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
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
        </CardContent>
      </Card>
      
      <AnimatePresence>
        {predictions.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
          >
            <Card>
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <CheckCircle className="h-5 w-5 text-primary" />
                  Identification Results
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {predictions.map((pred, index) => (
                  <motion.div 
                    key={pred.species}
                    className="space-y-2"
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                  >
                    <div className="flex justify-between items-center">
                      <span className={`font-medium ${index === 0 ? 'text-foreground text-lg' : 'text-muted-foreground'}`}>
                        {index === 0 && "🏆 "}
                        {pred.species}
                      </span>
                      <Badge variant={index === 0 ? "default" : "secondary"}>
                        {(pred.confidence * 100).toFixed(1)}%
                      </Badge>
                    </div>
                    <Progress value={pred.confidence * 100} className="h-2" />
                  </motion.div>
                ))}
                
                {predictions[0]?.confidence > 0.7 && (
                  <div className="mt-4 p-3 bg-destructive/10 border border-destructive/20 rounded-lg flex items-start gap-2">
                    <AlertTriangle className="h-5 w-5 text-destructive mt-0.5" />
                    <div>
                      <p className="font-medium text-destructive">Safety Warning</p>
                      <p className="text-sm text-muted-foreground">
                        If venomous, maintain safe distance. Do not attempt to handle.
                      </p>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default Identify;
