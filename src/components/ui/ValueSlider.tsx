import {ChangeEvent, forwardRef, useImperativeHandle, useRef} from "react"
import {Input} from "@/components/ui/input"
import {Slider} from "@/components/ui/slider"
import {cn} from "@/lib/utils"

type Props = {
    containerClass?: string
    inputClass?: string
    sliderClass?: string
    value?: number
    minValue?: number
    maxValue?: number
    step?: number
    onChange?: (value: number) => void
}

type ReturnRef = {
    container: HTMLDivElement
    input: HTMLInputElement
    slider: {root: HTMLSpanElement, track: HTMLSpanElement}
}

const ValueSlider = forwardRef<ReturnRef, Props>(
    ({

         containerClass,
         inputClass,
         sliderClass,
         value = 0,
         minValue = -1,
         maxValue = 1,
         step = 0.1,
         onChange = (value: number) => {}

    }: Props, ref) => {
    const containerRef = useRef<HTMLDivElement>(null!)
    const inputRef = useRef<HTMLInputElement>(null!)
    const sliderRef = useRef<{root: HTMLSpanElement, track: HTMLSpanElement}>(null!)

    useImperativeHandle(ref, () => ({
        container: containerRef.current,
        input: inputRef.current,
        slider: sliderRef.current
    }))

    const slide = (value: number[]) => {
        inputRef.current.value = value[0].toString()
        onChange(value[0])
    }

    const change = (e: ChangeEvent<HTMLInputElement>) => {
        onChange(parseFloat(e.target.value))
    }

    return <div ref={containerRef} className={cn('flex flex-col justify-between', containerClass)}>

        <Input
            ref={inputRef}
            max={maxValue}
            min={minValue}
            value={value}
            step={step}
            type="number"
            onChange={change}
            className={cn('w-20', inputClass)}
        />

        <Slider
            ref={sliderRef}
            max={maxValue}
            min={minValue}
            value={[value]}
            step={step}
            onValueChange={slide}
            className={cn('w-20 p-2', sliderClass)}
        />

    </div>
})

export default ValueSlider
