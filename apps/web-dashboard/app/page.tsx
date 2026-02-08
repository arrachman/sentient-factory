"use client";

import { useState } from "react";
import {
  Toolbar,
  ToolbarActions,
  ToolbarDescription,
  ToolbarHeading,
  ToolbarPageTitle,
} from "@/components/layouts/layout-1/components/toolbar";
import { addDays, format } from "date-fns";
import { CalendarDays } from "lucide-react";
import { DateRange } from "react-day-picker";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Skeleton } from "@/components/ui/skeleton";
import { logout } from "@/app/actions/auth";
import { LogOut } from "lucide-react";

export default function HomePage() {
  const [isOpen, setIsOpen] = useState(false);
  const [date, setDate] = useState<DateRange | undefined>({
    from: new Date(2025, 0, 20),
    to: addDays(new Date(2025, 0, 20), 20),
  });
  const [tempDateRange, setTempDateRange] = useState<DateRange | undefined>(
    date,
  );

  const handleDateRangeApply = () => {
    setDate(tempDateRange);
    setIsOpen(false);
  };

  const handleDateRangeReset = () => {
    setTempDateRange(undefined);
  };

  const defaultStartDate = new Date();

  return (
    <div className="container">
      <Toolbar>
        <ToolbarHeading>
          <ToolbarPageTitle>Dashboard</ToolbarPageTitle>
          <ToolbarDescription>
            Central Hub for Personal Customization
          </ToolbarDescription>
        </ToolbarHeading>
        <ToolbarActions>
          <Popover open={isOpen} onOpenChange={setIsOpen}>
            <PopoverTrigger asChild>
              <Button id="date" variant="outline">
                <CalendarDays size={16} className="me-0.5" />
                {date?.from ? (
                  date.to ? (
                    <>
                      {format(date.from, "LLL dd, y")} -{" "}
                      {format(date.to, "LLL dd, y")}
                    </>
                  ) : (
                    format(date.from, "LLL dd, y")
                  )
                ) : (
                  <span>Pick a date range</span>
                )}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="end">
              <Calendar
                initialFocus
                mode="range"
                defaultMonth={tempDateRange?.from || defaultStartDate}
                selected={tempDateRange}
                onSelect={setTempDateRange}
                numberOfMonths={2}
              />
              <div className="flex items-center justify-end gap-1.5 border-t border-border p-3">
                <Button variant="outline" onClick={handleDateRangeReset}>
                  Reset
                </Button>
                <Button onClick={handleDateRangeApply}>Apply</Button>
              </div>
            </PopoverContent>
          </Popover>

          <Button variant="outline" size="icon" onClick={() => logout()}>
            <LogOut size={16} />
            <span className="sr-only">Logout</span>
          </Button>
        </ToolbarActions>
      </Toolbar>

      <Skeleton className="rounded-lg grow h-screen"></Skeleton>
    </div>
  );
}
