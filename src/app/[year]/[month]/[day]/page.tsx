'use client'

import { Float, Html } from "@react-three/drei"
import { Caveat } from "next/font/google"
import {Canvas} from "@react-three/fiber"

const caveat = Caveat({
    subsets: ['latin'],
    variable: '--font-caveat'
})

export default function Page({params}: {params: {date: string}}) {

    return <Canvas className="w-full h-full">
        <Float>
            <Html center transform as="h1" className={caveat.className} scale={0.25}>
                <div style={{ transform: 'scale(4)' }}>I didn't make a shader on {params.date}</div>
            </Html>
        </Float>
    </Canvas>
}
