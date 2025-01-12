'use client'

import { Caveat } from "next/font/google"
import {useEffect, useRef, useState} from "react"

const caveat = Caveat({
    subsets: ['latin'],
    variable: '--font-caveat'
})

type color = 'red' | 'green' | 'blue' | 'purple' | 'yellow' | 'orange' | 'pink' | 'teal'

export default function Page() {

    const colors = {
        red: '#c33232',
        green: '#239c23',
        blue: '#2c2cb3',
        purple: '#b824b8',
        yellow: '#FFFF00',
        orange: '#FFA500',
        pink: '#FFC0CB',
        teal: '#008080',
    }

    const next = {
        red: 'green',
        green: 'blue',
        blue: 'purple',
        purple: 'red',
        yellow: 'orange',
        orange: 'pink',
        pink: 'teal',
        teal: 'yellow',
    } as {[key in color]: color}

    const [a, setA] = useState<color>('red')
    const [b, setB] = useState<color>('green')
    const [c, setC] = useState<color>('yellow')
    const [back, setBack] = useState<color>('purple')

    const newA = () => {
        if (['red', 'blue', 'green', 'purple'].includes(c)){
            console.log(next[a as color], a, 'aa')
            setA(next[a as color])
        } else {
            console.log(next[b as color], b, 'ab')
            setA(next[b as color])
        }
    }
    const newB = () => {
        if (['red', 'blue', 'green', 'purple'].includes(a)){
            console.log(next[b as color], b, 'bb')
            setB(next[b as color])
        } else {
            console.log(next[a as color], a, 'ba')
            setB(next[a as color])
        }
    }
    const newC = () => {
        if (['red', 'blue', 'green', 'purple'].includes(b)){
            console.log(next[c as color], c, 'cc')
            setC(next[c as color])
        } else {
            console.log(next[a as color], a, 'ca')
            setC(next[a as color])
        }
    }

    const count = useRef(0)
    const update = () => {
        if (count.current % 3 === 0){
            newA()
        } else if (count.current % 3 === 1){
            newB()
        } else {
            newC()
        }
        count.current++
    }

    useEffect(() => {
        const interval = setInterval(() => {
            update()
        }, 1000)

        return () => clearInterval(interval)
    }, [a, b, c])

    return <div className="flex items-center justify-center pt-32" style={{background: colors[back]}}>
        <div className="w-32 h-32" style={{backgroundColor: colors[a]}}>
            a
        </div>
        <div className="w-32 h-32" style={{backgroundColor: colors[b]}}>
            b
        </div>
        <div className="w-32 h-32" style={{backgroundColor: colors[c]}}>
            c
        </div>
    </div>
}

