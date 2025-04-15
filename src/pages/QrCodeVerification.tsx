
import React, { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from "react-router-dom";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Loader2, CheckCircle, XCircle, AlertTriangle, DollarSign } from "lucide-react";
import Navigation from "@/components/layout/Navigation";
import { toast } from 'sonner';
import { supabase } from "@/integrations/supabase/client";
import { QrCodeVerification as QrCodeVerificationType } from "@/types/supabase";

const QrCodeVerification = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const code = searchParams.get('code');
  
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [verificationData, setVerificationData] = useState<QrCodeVerificationType | null>(null);

  useEffect(() => {
    const verifyCode = async () => {
      if (!code) {
        setError("No QR code provided");
        setIsLoading(false);
        return;
      }

      try {
        // Call the verifyTicket function to check payment and attendance
        const { data, error: verifyError } = await supabase
          .rpc('verify_ticket', { code });
        
        if (verifyError || !data || data.length === 0) {
          console.error("Error verifying QR code:", verifyError);
          setError(verifyError?.message || "Invalid or expired QR code");
          toast.error("Ticket verification failed");
        } else {
          const ticketData = data[0] as QrCodeVerificationType;
          setVerificationData(ticketData);
          
          // Show success or warning toast based on verification result
          if (ticketData.is_valid) {
            toast.success("Ticket verified successfully");
          } else {
            toast.warning(ticketData.message);
          }
        }
      } catch (err: any) {
        console.error("Error verifying QR code:", err);
        setError(err.message || "An unexpected error occurred");
        toast.error("Ticket verification failed");
      } finally {
        setIsLoading(false);
      }
    };

    verifyCode();
  }, [code]);

  const handleBackToHome = () => {
    navigate('/');
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navigation />
        <div className="container mx-auto px-6 py-24">
          <Card className="max-w-md mx-auto">
            <CardHeader className="text-center">
              <CardTitle>Verifying Ticket</CardTitle>
              <CardDescription>Please wait while we verify your ticket</CardDescription>
            </CardHeader>
            <CardContent className="flex justify-center py-8">
              <Loader2 className="h-16 w-16 animate-spin text-primary" />
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navigation />
        <div className="container mx-auto px-6 py-24">
          <Card className="max-w-md mx-auto border-red-200">
            <CardHeader className="text-center">
              <XCircle className="h-12 w-12 text-red-500 mx-auto mb-2" />
              <CardTitle className="text-red-700">Verification Failed</CardTitle>
              <CardDescription>{error}</CardDescription>
            </CardHeader>
            <CardFooter className="flex justify-center">
              <Button onClick={handleBackToHome}>Back to Home</Button>
            </CardFooter>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />
      <div className="container mx-auto px-6 py-24">
        <Card className="max-w-md mx-auto border-2">
          <CardHeader className="text-center">
            {verificationData?.is_valid ? (
              <>
                <CheckCircle className="h-12 w-12 text-green-500 mx-auto mb-2" />
                <CardTitle className="text-green-700">Ticket Verified</CardTitle>
                <Badge className="mx-auto mt-2 bg-green-100 text-green-800 hover:bg-green-100">
                  VALID TICKET
                </Badge>
              </>
            ) : (
              <>
                <AlertTriangle className="h-12 w-12 text-amber-500 mx-auto mb-2" />
                <CardTitle className="text-amber-700">Invalid Ticket</CardTitle>
                <Badge variant="destructive" className="mx-auto mt-2">
                  {verificationData?.payment_status === 'pending' ? 'PAYMENT PENDING' : 
                   verificationData?.attendance_status === 'checked in' ? 'ALREADY CHECKED IN' : 'INVALID TICKET'}
                </Badge>
              </>
            )}
          </CardHeader>
          
          <CardContent className="space-y-4">
            <div className="rounded-md border p-4">
              <div className="grid grid-cols-2 gap-2">
                <div className="text-sm font-medium">Name:</div>
                <div className="text-sm">{verificationData?.first_name} {verificationData?.surname}</div>
                
                <div className="text-sm font-medium">Student #:</div>
                <div className="text-sm">{verificationData?.student_number}</div>
                
                <div className="text-sm font-medium">Grade:</div>
                <div className="text-sm">{verificationData?.grade_level}</div>
                
                <div className="text-sm font-medium">Payment Status:</div>
                <div className="text-sm flex items-center">
                  {verificationData?.payment_status === 'completed' ? (
                    <span className="flex items-center text-green-600">
                      <CheckCircle className="h-3 w-3 mr-1" /> Paid
                    </span>
                  ) : (
                    <span className="flex items-center text-amber-600">
                      <DollarSign className="h-3 w-3 mr-1" /> Pending
                    </span>
                  )}
                </div>
                
                <div className="text-sm font-medium">Attendance:</div>
                <div className="text-sm">
                  {verificationData?.attendance_status === 'checked in' ? 'Checked In' : 'Not Checked In'}
                </div>
              </div>
            </div>
            
            {!verificationData?.is_valid && (
              <div className="bg-amber-50 border border-amber-200 rounded-md p-3 text-amber-800">
                <p className="text-sm">{verificationData?.message}</p>
              </div>
            )}
          </CardContent>
          
          <CardFooter className="flex justify-between">
            <Button onClick={handleBackToHome} variant="outline">Back to Home</Button>
            <Button
              onClick={() => window.print()}
              variant="secondary"
            >
              Print
            </Button>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
};

export default QrCodeVerification;
