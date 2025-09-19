import React from 'react';
import FirebaseConfig from '@/components/FirebaseConfig';
import { Button } from '@/components/ui/button';
import { simulateESP32Data } from '@/lib/esp32-integration';
import { toast } from '@/components/ui/use-toast';

const Setup = () => {
  const handleSimulateData = async () => {
    try {
      await simulateESP32Data();
      toast({
        title: "Success",
        description: "Simulated sensor data sent to Firebase",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to send simulated data",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="min-h-screen bg-background text-foreground">
      <header className="border-b border-border bg-card">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="h-8 w-8 bg-primary rounded-lg flex items-center justify-center">
                <span className="text-primary-foreground font-bold text-sm">FV</span>
              </div>
              <h1 className="text-xl font-bold">FreshView Setup</h1>
            </div>
            <div className="flex items-center space-x-4">
              <Button onClick={handleSimulateData} variant="outline">
                Test with Simulated Data
              </Button>
              <a href="/" className="text-blue-500 underline">
                Back to Dashboard
              </a>
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-6 py-6">
        <FirebaseConfig />
      </main>
    </div>
  );
};

export default Setup;