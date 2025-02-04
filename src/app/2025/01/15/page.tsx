'use client'

import * as THREE from 'three'
import {extend, useFrame} from '@react-three/fiber'
import React, {forwardRef, useEffect, useImperativeHandle, useRef} from 'react'
import {Caveat, Raleway} from "next/font/google"
import {useRive} from "rive-react"

const caveat = Caveat({
    subsets: ['latin'],
    variable: '--font-caveat'
})

const railway = Raleway({
    subsets: ['latin'],
    variable: '--font-railway'
})

export default function Page() {
    const {rive, RiveComponent} = useRive({
        src: '/anu/hurdlr_hero.riv',
        stateMachines: 'StateMachine',
        autoplay: true,
    })

    return <>
        <div className="absolute top-0 w-full h-full pointer-events-none justify-center items-center flex">
            <div className="w-[1000px] h-[1000px] z-10 pointer-events-auto">
                <RiveComponent/>
            </div>
        </div>
    </>
}
