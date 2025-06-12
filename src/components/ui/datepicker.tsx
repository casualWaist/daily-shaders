"use client"

import * as React from "react"
import { format } from "date-fns"
import { Calendar as CalendarIcon } from "lucide-react"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover"
import {usePathname, useRouter} from "next/navigation"

export default function DatePicker() {
    const path = usePathname()
    const [year, month, day] = path.split("/").slice(1)
    const yearInt = parseInt(year, 10)
    const monthInt = parseInt(month, 10)
    const dayInt = parseInt(day, 10)
    let goodDay = false
    if (yearInt && monthInt && dayInt) {
        goodDay = true
    }
    const [date, setDate] = React.useState<Date>(
        goodDay ? new Date(yearInt, monthInt - 1, dayInt) : new Date()
    )
    const [monthy, setMonthy] = React.useState<Date>(date)
    const router = useRouter()

    React.useEffect(() => {
        if (date) {
            router.push(`/${format(date, "yyyy/MM/dd")}`, {scroll: false})
        }
    }, [date])

    return (
        <Popover>
            <PopoverTrigger asChild>
                <Button
                    variant={"outline"}
                    className={cn(
                        "w-[280px] justify-start text-left font-normal pointer-events-auto",
                        !date && "text-muted-foreground"
                    )}
                >
                    <CalendarIcon className="mr-2 h-4 w-4 pointer-events-auto" />
                    {date ? format(date, "PPP") : <span>Pick a date</span>}
                </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0 pointer-events-auto">
                {/* @ts-ignore */}
                <Calendar mode="single" selected={date} month={monthy} onSelect={setDate} onMonthChange={setMonthy} initialFocus/>
            </PopoverContent>
        </Popover>
    )
}
