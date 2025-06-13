
import React, { useEffect, useRef } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Download, Printer } from 'lucide-react';
import QRCode from 'qrcode';
import { toast } from "sonner";

interface QRCodeDisplayProps {
  url: string;
  eventName: string;
  accessCode: string;
}

const QRCodeDisplay = ({ url, eventName, accessCode }: QRCodeDisplayProps) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if (canvasRef.current) {
      QRCode.toCanvas(canvasRef.current, url, {
        width: 200,
        margin: 2,
        color: {
          dark: '#1f2937',
          light: '#ffffff'
        }
      }, (error) => {
        if (error) {
          console.error('QR Code generation error:', error);
          toast.error("Failed to generate QR code");
        }
      });
    }
  }, [url]);

  const downloadQR = () => {
    if (canvasRef.current) {
      const link = document.createElement('a');
      link.download = `${eventName.replace(/[^a-zA-Z0-9]/g, '_')}_QR_Code.png`;
      link.href = canvasRef.current.toDataURL();
      link.click();
      toast.success("QR code downloaded");
    }
  };

  const printQR = () => {
    const printWindow = window.open('', '_blank');
    if (printWindow && canvasRef.current) {
      const qrDataUrl = canvasRef.current.toDataURL();
      printWindow.document.write(`
        <html>
          <head>
            <title>QR Code - ${eventName}</title>
            <style>
              body { 
                font-family: Arial, sans-serif; 
                text-align: center; 
                padding: 40px;
                margin: 0;
              }
              .qr-container {
                display: inline-block;
                padding: 30px;
                border: 2px solid #e5e7eb;
                border-radius: 12px;
                background: white;
              }
              h1 { 
                color: #1f2937; 
                margin-bottom: 10px;
                font-size: 24px;
              }
              .code { 
                font-family: monospace; 
                font-size: 18px; 
                color: #4b5563;
                margin: 10px 0;
                font-weight: bold;
              }
              .url {
                font-size: 12px;
                color: #6b7280;
                margin-top: 15px;
                word-break: break-all;
              }
              img {
                margin: 20px 0;
              }
            </style>
          </head>
          <body>
            <div class="qr-container">
              <h1>${eventName}</h1>
              <p>Scan to join the workshop</p>
              <img src="${qrDataUrl}" alt="QR Code" />
              <div class="code">Access Code: ${accessCode}</div>
              <div class="url">${url}</div>
            </div>
          </body>
        </html>
      `);
      printWindow.document.close();
      printWindow.print();
    }
  };

  return (
    <Card className="bg-white border-gray-200">
      <CardHeader className="text-center pb-2">
        <CardTitle className="text-sm">QR Code</CardTitle>
      </CardHeader>
      <CardContent className="text-center space-y-3">
        <canvas ref={canvasRef} className="mx-auto" />
        <p className="text-xs text-gray-600">
          Scan with phone to join: <span className="font-mono font-semibold">{accessCode}</span>
        </p>
        <div className="flex gap-2 justify-center">
          <Button size="sm" variant="outline" onClick={downloadQR}>
            <Download className="h-3 w-3 mr-1" />
            Download
          </Button>
          <Button size="sm" variant="outline" onClick={printQR}>
            <Printer className="h-3 w-3 mr-1" />
            Print
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default QRCodeDisplay;
