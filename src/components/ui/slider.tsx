"use client"

import * as React from "react"
import * as SliderPrimitive from "@radix-ui/react-slider"

import { cn } from "@/lib/utils"
import {useImperativeHandle} from "react"

type ReturnRef = {
    root: HTMLSpanElement
    track: HTMLSpanElement
}

const Slider = React.forwardRef<
    ReturnRef,
    React.ComponentProps<typeof SliderPrimitive.Root>
>(({ className, ...props }, ref) => {
    const trackRef = React.useRef<HTMLSpanElement>(null!)
    const localRef = React.useRef<HTMLSpanElement>(null!)

    useImperativeHandle(ref, () => ({
        root: localRef.current,
        track: trackRef.current
    }))

    return <SliderPrimitive.Root
        ref={localRef}
        className={cn(
            "relative flex w-full touch-none select-none items-center",
            className
        )}
        {...props}
    >
        <SliderPrimitive.Track ref={trackRef} className="relative h-2 w-full grow overflow-hidden rounded-full bg-secondary">
          <SliderPrimitive.Range className="absolute h-full bg-primary"/>
        </SliderPrimitive.Track>
        <SliderPrimitive.Thumb
            className="block h-5 w-5 rounded-full border-2 border-primary bg-background ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50"/>
    </SliderPrimitive.Root>
})

Slider.displayName = SliderPrimitive.Root.displayName

export { Slider }
