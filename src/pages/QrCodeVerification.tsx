
import React, { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from "react-router-dom";
import { verifyQrCode } from "@/services/supabaseService";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Loader2, CheckCircle, XCircle, AlertTriangle } from "lucide-react";
import Navigation from "@/components/layout/Navigation";
import { toast } from 'sonner';

const QrCodeVerification = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const code = searchParams.get('code');
  
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [verificationData, setVerificationData] = useState<{
    first_name: string;
    surname: string;
    student_number: string;
    grade_level: string;
    scan_count: number;
    isValid: boolean;
  } | null>(null);

  useEffect(() => {
    const verifyCode = async () => {
      if (!code) {
        setError("No QR code provided");
        setIsLoading(false);
        return;
      }

      try {
        const { success, data, error: verifyError } = await verifyQrCode(code);
        
        if (!success || !data) {
          setError(verifyError?.message || "Invalid or expired QR code");
          toast.error("QR code verification failed");
        } else {
          setVerificationData(data);
        }
      } catch (err: any) {
        console.error("Error verifying QR code:", err);
        setError(err.message || "An unexpected error occurred");
        toast.error("QR code verification failed");
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
              <CardTitle>Verifying QR Code</CardTitle>
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
            {verificationData?.isValid ? (
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
                  ALREADY SCANNED ({verificationData?.scan_count || 0} times)
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
                <div className="text-sm">{verificationData?.student_number || 'N/A'}</div>
                
                <div className="text-sm font-medium">Grade:</div>
                <div className="text-sm">{verificationData?.grade_level || 'N/A'}</div>
              </div>
            </div>
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
