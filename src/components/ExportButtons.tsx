
import React from 'react';
import { Button } from "@/components/ui/button";
import { Download } from 'lucide-react';
import { toast } from "sonner";

interface Message {
  id: string;
  content: string;
  author_name: string;
  author_email: string;
  status: 'pending' | 'approved' | 'rejected';
  created_at: string;
  event_id: string;
}

interface ExportButtonsProps {
  messages: Message[];
  eventSlug?: string;
}

const ExportButtons = ({ messages, eventSlug }: ExportButtonsProps) => {
  const downloadCSV = () => {
    if (messages.length === 0) {
      toast.error("No approved messages to download");
      return;
    }

    const csvHeader = 'Name,Email,Message,Date\n';
    const csvData = messages.map(message => {
      const escapedContent = `"${message.content.replace(/"/g, '""')}"`;
      const escapedName = `"${message.author_name.replace(/"/g, '""')}"`;
      const date = new Date(message.created_at).toLocaleDateString();
      return `${escapedName},${message.author_email},${escapedContent},${date}`;
    }).join('\n');

    const csvContent = csvHeader + csvData;
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', `approved_messages_${eventSlug}_${new Date().toISOString().split('T')[0]}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    toast.success("CSV file downloaded successfully!");
  };

  return (
    <div className="flex gap-2">
      <Button
        size="sm"
        onClick={downloadCSV}
        className="bg-blue-600 hover:bg-blue-700"
      >
        <Download className="h-4 w-4 mr-2" />
        CSV
      </Button>
    </div>
  );
};

export default ExportButtons;
