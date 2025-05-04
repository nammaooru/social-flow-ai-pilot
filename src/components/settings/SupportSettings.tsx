import React, { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { CommonSettingsProps } from "./SettingsComponentTypes";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { HelpCircle, MessageSquare, FileText, ExternalLink } from "lucide-react";

interface SupportSettingsProps extends CommonSettingsProps {
  role: string;
}

// Mock FAQ data
const faqItems = [
  {
    id: "faq-1",
    question: "How do I connect my social media accounts?",
    answer: "To connect your social media accounts, go to Settings > Social Accounts and click on 'Add Account'. Follow the authorization steps for each platform you want to connect."
  },
  {
    id: "faq-2",
    question: "Can I schedule posts to multiple platforms at once?",
    answer: "Yes, you can schedule posts to multiple platforms simultaneously. When creating a new post, simply select all the platforms you want to publish to before scheduling."
  },
  {
    id: "faq-3",
    question: "How do I create a content calendar?",
    answer: "To create a content calendar, navigate to the Schedule section and use the calendar view. You can drag and drop posts, create new content directly on specific dates, and visualize your publishing schedule."
  },
  {
    id: "faq-4",
    question: "What analytics are available?",
    answer: "Our platform provides comprehensive analytics including engagement metrics, audience growth, content performance, best times to post, and competitor analysis. Visit the Analytics section to explore all available reports."
  },
  {
    id: "faq-5",
    question: "How can I manage team permissions?",
    answer: "Team permissions can be managed in Settings > Users. As an Admin, you can add team members, assign roles, and control what actions they can perform on the platform."
  },
];

// Mock support tickets
const supportTickets = [
  {
    id: "TICKET-1001",
    subject: "Cannot connect Instagram account",
    status: "Open",
    created: "2023-05-01",
    lastUpdated: "2023-05-02"
  },
  {
    id: "TICKET-1002",
    subject: "Scheduling feature not working",
    status: "In Progress",
    created: "2023-04-28",
    lastUpdated: "2023-05-02"
  },
  {
    id: "TICKET-1003",
    subject: "Question about billing",
    status: "Closed",
    created: "2023-04-15",
    lastUpdated: "2023-04-18"
  },
];

// Mock documentation links
const documentationLinks = [
  {
    title: "Getting Started Guide",
    description: "Learn the basics of using the platform",
    url: "#getting-started"
  },
  {
    title: "Content Scheduling Tutorial",
    description: "Master the scheduling features",
    url: "#scheduling"
  },
  {
    title: "Analytics Deep Dive",
    description: "Understand all analytics features",
    url: "#analytics"
  },
  {
    title: "Team Collaboration Guide",
    description: "Work effectively with your team",
    url: "#team"
  },
  {
    title: "API Documentation",
    description: "Technical documentation for developers",
    url: "#api"
  },
];

export function SupportSettings({ role, onSettingChange }: SupportSettingsProps) {
  const { toast } = useToast();
  const [ticketSubject, setTicketSubject] = useState("");
  const [ticketMessage, setTicketMessage] = useState("");
  const [ticketPriority, setTicketPriority] = useState("medium");
  
  const handleSubmitTicket = () => {
    if (!ticketSubject || !ticketMessage) {
      toast({
        title: "Missing information",
        description: "Please fill out all required fields.",
        variant: "destructive"
      });
      return;
    }
    
    // In a real app, this would submit the ticket to an API
    toast({
      title: "Support ticket submitted",
      description: "We'll get back to you as soon as possible.",
    });
    
    setTicketSubject("");
    setTicketMessage("");
    setTicketPriority("medium");
  };

  const isAdmin = role === "Super Admin" || role === "White Label" || role === "Admin";

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-medium">Support & Help</h3>
        <p className="text-sm text-muted-foreground">
          Get help, find answers, and manage support requests.
        </p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="md:col-span-2">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <MessageSquare className="h-5 w-5" /> Contact Support
            </CardTitle>
            <CardDescription>
              Submit a support ticket to get help from our team.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="ticket-subject">Subject</Label>
              <Input 
                id="ticket-subject" 
                placeholder="Brief description of your issue"
                value={ticketSubject}
                onChange={(e) => setTicketSubject(e.target.value)}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="ticket-priority">Priority</Label>
              <Select 
                value={ticketPriority}
                onValueChange={setTicketPriority}
              >
                <SelectTrigger id="ticket-priority">
                  <SelectValue placeholder="Select priority" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="low">Low</SelectItem>
                  <SelectItem value="medium">Medium</SelectItem>
                  <SelectItem value="high">High</SelectItem>
                  {(role === "Super Admin" || role === "White Label") && (
                    <SelectItem value="urgent">Urgent</SelectItem>
                  )}
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="ticket-message">Message</Label>
              <Textarea 
                id="ticket-message" 
                rows={5}
                placeholder="Describe your issue in detail"
                value={ticketMessage}
                onChange={(e) => setTicketMessage(e.target.value)}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="ticket-attachment">Attachments (Optional)</Label>
              <Input
                id="ticket-attachment"
                type="file"
              />
            </div>
          </CardContent>
          <CardFooter>
            <Button onClick={handleSubmitTicket}>Submit Ticket</Button>
          </CardFooter>
        </Card>
        
        {/* Display support tickets if user is an admin or has previous tickets */}
        <Card className={isAdmin ? "md:col-span-2" : ""}>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileText className="h-5 w-5" /> Support Tickets
            </CardTitle>
            <CardDescription>
              View and manage your support requests.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Ticket ID</TableHead>
                  <TableHead>Subject</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Created</TableHead>
                  <TableHead>Last Updated</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {supportTickets.map((ticket) => (
                  <TableRow key={ticket.id} className="cursor-pointer hover:bg-muted/50">
                    <TableCell className="font-mono text-sm">{ticket.id}</TableCell>
                    <TableCell className="font-medium">{ticket.subject}</TableCell>
                    <TableCell>
                      <Badge
                        variant="outline"
                        className={
                          ticket.status === "Open"
                            ? "bg-blue-100 text-blue-800 hover:bg-blue-100"
                            : ticket.status === "In Progress"
                            ? "bg-yellow-100 text-yellow-800 hover:bg-yellow-100"
                            : "bg-green-100 text-green-800 hover:bg-green-100"
                        }
                      >
                        {ticket.status}
                      </Badge>
                    </TableCell>
                    <TableCell>{ticket.created}</TableCell>
                    <TableCell>{ticket.lastUpdated}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
        
        <Card className="md:col-span-2">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <HelpCircle className="h-5 w-5" /> Frequently Asked Questions
            </CardTitle>
            <CardDescription>
              Quick answers to common questions.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Accordion type="single" collapsible className="w-full">
              {faqItems.map((item) => (
                <AccordionItem key={item.id} value={item.id}>
                  <AccordionTrigger className="text-left">
                    {item.question}
                  </AccordionTrigger>
                  <AccordionContent>
                    <p className="text-muted-foreground">{item.answer}</p>
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </CardContent>
        </Card>
        
        <Card className="md:col-span-2">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileText className="h-5 w-5" /> Documentation
            </CardTitle>
            <CardDescription>
              Explore our guides and documentation.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {documentationLinks.map((doc, index) => (
                <a
                  key={index}
                  href={doc.url}
                  className="flex flex-col p-4 border rounded-md space-y-2 hover:bg-muted/50 transition-colors"
                >
                  <div className="font-medium flex items-center gap-2">
                    {doc.title}
                    <ExternalLink className="h-3 w-3" />
                  </div>
                  <p className="text-sm text-muted-foreground">
                    {doc.description}
                  </p>
                </a>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
