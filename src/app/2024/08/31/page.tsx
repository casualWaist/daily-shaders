'use client'

import { Caveat } from "next/font/google"

const caveat = Caveat({
    subsets: ['latin'],
    variable: '--font-caveat'
})

export default function Page() {
    return <div className="flex items-center justify-center pt-32">
        <div className="bg-black"
             style={{clipPath: "path('M 0 0 L 510 73.802001953125 L 185.0469970703125 421.1820068359375 L 190.5659942626953 376.3609924316406 Z')"}}>
            <div className="flex justify-center items-center bg-amber-300"
                 style={{clipPath: "path('M 10 10 L 500 83.802001953125 L 175.0469970703125 411.1820068359375 L 180.5659942626953 366.3609924316406 Z')"}}>

                <div className="flex flex-col gap-4">
                    <h1 className="text-4xl">The Floor is...</h1>
                    <p className="text-2xl">A 3D shader effect using Three.js and React Three Fiber</p>
                    <p className="text-2xl">Created by <a href="https://twitter.com/0xca0a"
                                                          className="text-blue-400">0xca0a</a></p>
                </div>
            </div>
        </div>
    </div>
}

