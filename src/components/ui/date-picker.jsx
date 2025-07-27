import React from "react";
import { Button } from "./button";
import { Calendar } from "lucide-react";
import { Popover, PopoverContent, PopoverTrigger } from "./popover";
import { cn } from "../../lib/utils";
import { format } from "date-fns";

export function DatePickerWithRange({ date, setDate, className }) {
  return (
    <div className={cn("grid gap-2", className)}>
      <Popover>
        <PopoverTrigger asChild>
          <Button
            id="date"
            variant={"outline"}
            className={cn(
              "w-[260px] justify-start text-left font-normal",
              !date && "text-muted-foreground"
            )}
          >
            <Calendar className="mr-2 h-4 w-4" />
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
        <PopoverContent className="w-auto p-0" align="start">
          <div className="p-3">
            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="text-sm font-medium">From</label>
                <input
                  type="date"
                  value={date?.from ? format(date.from, "yyyy-MM-dd") : ""}
                  onChange={(e) => {
                    const newDate = e.target.value ? new Date(e.target.value) : null;
                    setDate(prev => ({ ...prev, from: newDate }));
                  }}
                  className="w-full mt-1 px-3 py-2 border border-gray-300 rounded-md"
                />
              </div>
              <div>
                <label className="text-sm font-medium">To</label>
                <input
                  type="date"
                  value={date?.to ? format(date.to, "yyyy-MM-dd") : ""}
                  onChange={(e) => {
                    const newDate = e.target.value ? new Date(e.target.value) : null;
                    setDate(prev => ({ ...prev, to: newDate }));
                  }}
                  className="w-full mt-1 px-3 py-2 border border-gray-300 rounded-md"
                />
              </div>
            </div>
          </div>
        </PopoverContent>
      </Popover>
    </div>
  );
}
