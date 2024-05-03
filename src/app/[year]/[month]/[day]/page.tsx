'use client'

import { Float, Html } from "@react-three/drei"
import { Caveat } from "next/font/google"
import {Canvas} from "@react-three/fiber"

const caveat = Caveat({
    subsets: ['latin'],
    variable: '--font-caveat'
})

export default function Page({params}: {params: {year: string, day: string, month: string}}) {

    return <Canvas className="w-full h-full" style={{position: "fixed", top: "0", zIndex: "-1", pointerEvents: 'auto'}}>
        <Float>
            <Html center transform as="h1" className={caveat.className} scale={0.25}>
                <div style={{ transform: 'scale(4)', textAlign: 'center' }}>
                    I didn't make a shader on<br/>
                    {params.month + '-' + params.day + '-' + params.year}
                    <br/>
                    They start on the 24th of January, 2024.
                </div>
            </Html>
        </Float>
    </Canvas>
}
