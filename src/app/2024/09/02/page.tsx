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

    const rules = {
        a: (x: color) => {
            if (a === x) return false
            if (b === next[x]) return false
            if (c === next[x]) return false
            return back !== x;
        },
        b: (x: color) => {
            if (b === x) return false
            if (a === next[x]) return false
            if (c === next[x]) return false
            return back !== x;
        },
        c: (x: color) => {
            if (c === x) return false
            if (b === next[x]) return false
            if (a === next[x]) return false
            return back !== x;
        },
    }

    /* we need to calculate the next state based on the rules
       the state of a, b, c, and back should be passed to some function
       that can do a wave function collapse on each piece of state such that all the rules are satisfied
       shorthand look up colors 0-7 a1b1c4back3
       imagining the state in a vector space
       the shape of the state should provide the shape of the vector space and the rules should provide the
       movement constraints
       try to find an equation that creates a phase transition. this equation would be used to determine
       ho one color changes depending on the state of the other colors. Would be characterized by independent
       values having no great effect individually up until a point where a critical point is reached and flips the value
    */

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

