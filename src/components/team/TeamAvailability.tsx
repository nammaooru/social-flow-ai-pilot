
import React, { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Calendar } from '@/components/ui/calendar';
import { Button } from '@/components/ui/button';
import { Calendar as CalendarIcon, Clock, Users } from 'lucide-react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';

// Mock team members data with availability status
const teamMembers = [
  {
    id: '1',
    name: 'Alex Johnson',
    avatarUrl: 'https://i.pravatar.cc/150?img=1',
    status: 'available',
    todayHours: '9:00 AM - 5:00 PM',
    nextWeekAvailability: [
      { day: 'Monday', hours: '9:00 AM - 5:00 PM', status: 'available' },
      { day: 'Tuesday', hours: '9:00 AM - 5:00 PM', status: 'available' },
      { day: 'Wednesday', hours: '9:00 AM - 3:00 PM', status: 'limited' },
      { day: 'Thursday', hours: '9:00 AM - 5:00 PM', status: 'available' },
      { day: 'Friday', hours: '9:00 AM - 5:00 PM', status: 'available' },
    ]
  },
  {
    id: '2',
    name: 'Sam Smith',
    avatarUrl: 'https://i.pravatar.cc/150?img=2',
    status: 'available',
    todayHours: '9:00 AM - 5:00 PM',
    nextWeekAvailability: [
      { day: 'Monday', hours: '9:00 AM - 5:00 PM', status: 'available' },
      { day: 'Tuesday', hours: '9:00 AM - 5:00 PM', status: 'available' },
      { day: 'Wednesday', hours: '9:00 AM - 5:00 PM', status: 'available' },
      { day: 'Thursday', hours: '12:00 PM - 5:00 PM', status: 'limited' },
      { day: 'Friday', hours: '9:00 AM - 5:00 PM', status: 'available' },
    ]
  },
  {
    id: '3',
    name: 'Taylor Wong',
    avatarUrl: 'https://i.pravatar.cc/150?img=3',
    status: 'busy',
    todayHours: 'In meetings until 3:00 PM',
    nextWeekAvailability: [
      { day: 'Monday', hours: '9:00 AM - 5:00 PM', status: 'available' },
      { day: 'Tuesday', hours: 'Out of office', status: 'unavailable' },
      { day: 'Wednesday', hours: 'Out of office', status: 'unavailable' },
      { day: 'Thursday', hours: '9:00 AM - 5:00 PM', status: 'available' },
      { day: 'Friday', hours: '9:00 AM - 5:00 PM', status: 'available' },
    ]
  },
  {
    id: '4',
    name: 'Jordan Lee',
    avatarUrl: 'https://i.pravatar.cc/150?img=4',
    status: 'away',
    todayHours: 'Back at 2:00 PM',
    nextWeekAvailability: [
      { day: 'Monday', hours: '9:00 AM - 5:00 PM', status: 'available' },
      { day: 'Tuesday', hours: '9:00 AM - 5:00 PM', status: 'available' },
      { day: 'Wednesday', hours: '9:00 AM - 5:00 PM', status: 'available' },
      { day: 'Thursday', hours: '9:00 AM - 5:00 PM', status: 'available' },
      { day: 'Friday', hours: 'Working remotely', status: 'remote' },
    ]
  },
  {
    id: '5',
    name: 'Casey Davis',
    avatarUrl: 'https://i.pravatar.cc/150?img=5',
    status: 'offline',
    todayHours: 'Out of office',
    nextWeekAvailability: [
      { day: 'Monday', hours: '9:00 AM - 5:00 PM', status: 'available' },
      { day: 'Tuesday', hours: '9:00 AM - 5:00 PM', status: 'available' },
      { day: 'Wednesday', hours: '9:00 AM - 5:00 PM', status: 'available' },
      { day: 'Thursday', hours: '9:00 AM - 5:00 PM', status: 'available' },
      { day: 'Friday', hours: '9:00 AM - 5:00 PM', status: 'available' },
    ]
  }
];

const TeamAvailability = () => {
  const [date, setDate] = useState<Date | undefined>(new Date());

  // Get status badge color
  const getStatusBadge = (status: string) => {
    switch(status) {
      case 'available':
        return <Badge variant="outline" className="bg-green-100">Available</Badge>;
      case 'busy':
        return <Badge variant="outline" className="bg-red-100">Busy</Badge>;
      case 'away':
        return <Badge variant="outline" className="bg-yellow-100">Away</Badge>;
      case 'offline':
        return <Badge variant="outline" className="bg-gray-100">Offline</Badge>;
      case 'limited':
        return <Badge variant="outline" className="bg-yellow-100">Limited</Badge>;
      case 'unavailable':
        return <Badge variant="outline" className="bg-red-100">Unavailable</Badge>;
      case 'remote':
        return <Badge variant="outline" className="bg-blue-100">Remote</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  return (
    <Card>
      <CardContent className="p-4">
        <div className="flex flex-col md:flex-row gap-6">
          <div className="md:w-1/3">
            <h2 className="text-lg font-semibold mb-4">Team Schedule</h2>
            <div className="border rounded-md p-4">
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant={"outline"}
                    className="w-full justify-start text-left font-normal mb-4"
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {date ? date.toDateString() : "Pick a date"}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <Calendar
                    mode="single"
                    selected={date}
                    onSelect={setDate}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
              
              <div className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <div className="flex items-center">
                    <div className="w-3 h-3 rounded-full bg-green-500 mr-2"></div>
                    <span>Available</span>
                  </div>
                  <span className="text-muted-foreground">4 members</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <div className="flex items-center">
                    <div className="w-3 h-3 rounded-full bg-red-500 mr-2"></div>
                    <span>Busy/Unavailable</span>
                  </div>
                  <span className="text-muted-foreground">1 member</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <div className="flex items-center">
                    <div className="w-3 h-3 rounded-full bg-yellow-500 mr-2"></div>
                    <span>Limited Availability</span>
                  </div>
                  <span className="text-muted-foreground">2 members</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <div className="flex items-center">
                    <div className="w-3 h-3 rounded-full bg-gray-400 mr-2"></div>
                    <span>Away/Offline</span>
                  </div>
                  <span className="text-muted-foreground">2 members</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <div className="flex items-center">
                    <div className="w-3 h-3 rounded-full bg-blue-500 mr-2"></div>
                    <span>Working Remotely</span>
                  </div>
                  <span className="text-muted-foreground">1 member</span>
                </div>
              </div>

              <div className="mt-4 pt-4 border-t">
                <h3 className="font-medium text-sm mb-2">Common Free Time Slots</h3>
                <div className="space-y-2 text-sm">
                  <div className="flex items-center">
                    <Clock className="h-4 w-4 mr-2 text-muted-foreground" />
                    <span>9:00 AM - 11:00 AM</span>
                    <Badge className="ml-2 bg-green-100" variant="outline">
                      <Users className="h-3 w-3 mr-1" /> 5
                    </Badge>
                  </div>
                  <div className="flex items-center">
                    <Clock className="h-4 w-4 mr-2 text-muted-foreground" />
                    <span>2:00 PM - 4:00 PM</span>
                    <Badge className="ml-2 bg-green-100" variant="outline">
                      <Users className="h-3 w-3 mr-1" /> 4
                    </Badge>
                  </div>
                  <div className="flex items-center">
                    <Clock className="h-4 w-4 mr-2 text-muted-foreground" />
                    <span>4:00 PM - 5:00 PM</span>
                    <Badge className="ml-2 bg-green-100" variant="outline">
                      <Users className="h-3 w-3 mr-1" /> 5
                    </Badge>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="md:w-2/3">
            <h2 className="text-lg font-semibold mb-4">Current Status</h2>
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Team Member</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Today's Hours</TableHead>
                    <TableHead>Week Ahead</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {teamMembers.map((member) => (
                    <TableRow key={member.id}>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <div className="relative">
                            <img 
                              src={member.avatarUrl} 
                              alt={member.name} 
                              className="w-8 h-8 rounded-full"
                            />
                            <div className={`absolute bottom-0 right-0 w-3 h-3 rounded-full border-2 border-white ${
                              member.status === 'available' ? 'bg-green-500' :
                              member.status === 'busy' ? 'bg-red-500' :
                              member.status === 'away' ? 'bg-yellow-500' :
                              'bg-gray-400'
                            }`}></div>
                          </div>
                          <span>{member.name}</span>
                        </div>
                      </TableCell>
                      <TableCell>{getStatusBadge(member.status)}</TableCell>
                      <TableCell>{member.todayHours}</TableCell>
                      <TableCell>
                        <Popover>
                          <PopoverTrigger asChild>
                            <Button variant="outline" size="sm">View Schedule</Button>
                          </PopoverTrigger>
                          <PopoverContent className="w-80">
                            <div className="space-y-2">
                              <h4 className="font-semibold">{member.name}'s Schedule</h4>
                              <div className="space-y-1">
                                {member.nextWeekAvailability.map((day, index) => (
                                  <div key={index} className="flex items-center justify-between text-sm">
                                    <span className="font-medium">{day.day}:</span>
                                    <div className="flex items-center gap-2">
                                      <span>{day.hours}</span>
                                      {getStatusBadge(day.status)}
                                    </div>
                                  </div>
                                ))}
                              </div>
                            </div>
                          </PopoverContent>
                        </Popover>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default TeamAvailability;
