import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Camera, BookOpen, ClipboardList, Shield, Users, Leaf } from 'lucide-react';

const Index = () => {
  const features = [
    {
      icon: Camera,
      title: 'AI Identification',
      description: 'Upload a photo or use your camera to identify Philippine snake species using our trained AI model.',
    },
    {
      icon: BookOpen,
      title: 'Species Glossary',
      description: 'Browse our comprehensive database of 28 Philippine snake species with detailed information.',
    },
    {
      icon: ClipboardList,
      title: 'Record Observations',
      description: 'Contribute to snake conservation by recording and sharing your field observations.',
    },
  ];

  const stats = [
    { label: 'Species in Database', value: '28' },
    { label: 'AI-Powered', value: 'MobileNetV3' },
    { label: 'Conservation Focus', value: 'Philippine' },
  ];

  return (
    <div className="min-h-[calc(100vh-3.5rem)] bg-background">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-b from-primary/5 to-background px-4 py-20">
        <div className="container mx-auto max-w-6xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-center"
          >
            <div className="mb-6 flex justify-center">
              <div className="rounded-full bg-primary/10 p-4">
                <Shield className="h-12 w-12 text-primary" />
              </div>
            </div>
            <h1 className="mb-4 text-4xl font-bold tracking-tight text-foreground sm:text-5xl md:text-6xl">
              Snake Vision Hub
            </h1>
            <p className="mx-auto mb-8 max-w-2xl text-lg text-muted-foreground sm:text-xl">
              Philippine Snake Identification & Conservation Platform. 
              Powered by AI to help identify, learn about, and protect Philippine snake species.
            </p>
            <div className="flex flex-col items-center justify-center gap-4 sm:flex-row">
              <Button asChild size="lg" className="min-w-[160px]">
                <Link to="/login">Get Started</Link>
              </Button>
              <Button asChild variant="outline" size="lg" className="min-w-[160px]">
                <Link to="/glossary">Explore Glossary</Link>
              </Button>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="border-y border-border bg-card px-4 py-12">
        <div className="container mx-auto max-w-4xl">
          <div className="grid grid-cols-1 gap-8 sm:grid-cols-3">
            {stats.map((stat, index) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="text-center"
              >
                <p className="text-3xl font-bold text-primary">{stat.value}</p>
                <p className="text-sm text-muted-foreground">{stat.label}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="px-4 py-20">
        <div className="container mx-auto max-w-6xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="mb-12 text-center"
          >
            <h2 className="mb-4 text-3xl font-bold text-foreground">Key Features</h2>
            <p className="mx-auto max-w-2xl text-muted-foreground">
              Everything you need to identify, learn about, and contribute to Philippine snake conservation.
            </p>
          </motion.div>
          
          <div className="grid gap-6 md:grid-cols-3">
            {features.map((feature, index) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.2 + index * 0.1 }}
              >
                <Card className="h-full transition-shadow hover:shadow-md">
                  <CardHeader>
                    <div className="mb-2 flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
                      <feature.icon className="h-6 w-6 text-primary" />
                    </div>
                    <CardTitle className="text-xl">{feature.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <CardDescription className="text-sm">
                      {feature.description}
                    </CardDescription>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* About Section */}
      <section className="bg-muted/50 px-4 py-20">
        <div className="container mx-auto max-w-4xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-center"
          >
            <div className="mb-6 flex justify-center gap-4">
              <div className="rounded-full bg-primary/10 p-3">
                <Users className="h-6 w-6 text-primary" />
              </div>
              <div className="rounded-full bg-primary/10 p-3">
                <Leaf className="h-6 w-6 text-primary" />
              </div>
            </div>
            <h2 className="mb-4 text-3xl font-bold text-foreground">Conservation Through Technology</h2>
            <p className="mx-auto mb-8 max-w-2xl text-muted-foreground">
              Snake Vision Hub combines artificial intelligence with community-driven data collection 
              to support snake conservation efforts in the Philippines. By helping people identify snakes 
              accurately, we aim to reduce human-snake conflicts and promote coexistence.
            </p>
            <Button asChild variant="secondary">
              <Link to="/glossary">Learn About Philippine Snakes</Link>
            </Button>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border bg-card px-4 py-8">
        <div className="container mx-auto max-w-6xl">
          <div className="flex flex-col items-center justify-between gap-4 sm:flex-row">
            <p className="text-sm text-muted-foreground">
              © {new Date().getFullYear()} Snake Vision Hub. For educational purposes.
            </p>
            <div className="flex gap-4">
              <Link to="/glossary" className="text-sm text-muted-foreground hover:text-foreground">
                Glossary
              </Link>
              <Link to="/identify" className="text-sm text-muted-foreground hover:text-foreground">
                Identify
              </Link>
              <Link to="/encode" className="text-sm text-muted-foreground hover:text-foreground">
                Encode
              </Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;
