
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { QrCode, Download, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";

interface QrCodeDisplayProps {
  formId: string;
  submissionId: string;
}

const QrCodeDisplay: React.FC<QrCodeDisplayProps> = ({ formId, submissionId }) => {
  const [qrCode, setQrCode] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  useEffect(() => {
    const fetchQrCode = async () => {
      if (!formId || !submissionId) {
        setError("Missing form ID or submission ID");
        setIsLoading(false);
        return;
      }
      
      try {
        console.log(`Fetching QR code for submission ID: ${submissionId}`);
        
        const { data, error: fetchError } = await supabase
          .from('form_submissions')
          .select('qr_code, payment_status')
          .eq('id', submissionId)
          .eq('form id', formId)
          .maybeSingle();
        
        if (fetchError || !data) {
          console.error("Error fetching QR code:", fetchError);
          setError(fetchError?.message || "Failed to load QR code");
          toast.error("Could not load QR code");
        } else {
          console.log("QR code retrieved:", data.qr_code);
          setQrCode(data.qr_code);
          
          if (data.payment_status === 'pending') {
            toast.warning("Payment is pending. Ticket will not be valid until payment is completed.");
          } else if (data.payment_status === 'completed') {
            toast.success("Payment completed. Ticket is ready for check-in.");
          }
        }
      } catch (err: any) {
        console.error("Error fetching QR code:", err);
        setError(err.message || "An unexpected error occurred");
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchQrCode();
  }, [formId, submissionId]);
  
  const downloadQrCode = () => {
    if (!qrCode) return;
    
    // Create a temporary link element
    const a = document.createElement('a');
    a.href = qrCode;
    a.download = `ticket-qr-code.png`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    
    toast.success("QR code image downloaded");
  };
  
  if (isLoading) {
    return (
      <Card className="mt-6">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <QrCode className="h-5 w-5" />
            Ticket QR Code
          </CardTitle>
        </CardHeader>
        <CardContent className="flex justify-center py-8">
          <Loader2 className="h-12 w-12 animate-spin text-primary" />
        </CardContent>
      </Card>
    );
  }
  
  if (error || !qrCode) {
    return (
      <Card className="mt-6">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <QrCode className="h-5 w-5" />
            Ticket QR Code
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-red-500">{error || "Unable to generate QR code"}</p>
        </CardContent>
      </Card>
    );
  }
  
  return (
    <Card className="mt-6">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <QrCode className="h-5 w-5" />
          Ticket QR Code
        </CardTitle>
        <CardDescription>
          Show this QR code at the event entrance
        </CardDescription>
      </CardHeader>
      <CardContent className="flex flex-col items-center">
        <div className="border p-4 rounded-md bg-white mb-4">
          <img 
            src={qrCode} 
            alt="Ticket QR Code" 
            className="mx-auto"
            width={250}
            height={250}
          />
        </div>
        <Button 
          onClick={downloadQrCode}
          className="flex items-center gap-2"
        >
          <Download className="h-4 w-4" />
          Download QR Code
        </Button>
      </CardContent>
    </Card>
  );
};

export default QrCodeDisplay;
