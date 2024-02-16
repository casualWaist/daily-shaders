'use client'

import {Canvas, extend, MaterialNode, useFrame, useThree} from "@react-three/fiber"
import {Float, Html, shaderMaterial, OrbitControls} from "@react-three/drei"
import { Caveat } from "next/font/google"
import fragment from './fragment.glsl'
import vertex from './vertex.glsl'
import * as THREE from 'three'
import {forwardRef, useRef} from "react"

const caveat = Caveat({
    subsets: ['latin'],
    variable: '--font-caveat'
})

const SeaShadImp = shaderMaterial({
    uTime: 0,
    uBigWavesElevation: 0.125,
    uBigWavesFrequency: new THREE.Vector2(0.2, 0.4),
    uBigWavesSpeed: 0.75,
    uSmallWavesElevation: 0.35,
    uSmallWavesFrequency: 0.45,
    uSmallWavesSpeed: 0.2,
    uSmallIterations: 6,
    uDepthColor: new THREE.Color(0.125, 0.3, 0.8),
    uSurfaceColor: new THREE.Color(0.3, 0.5, 1.0),
    uColorOffset: 0.08,
    uColorMultiplier: 8.0,
    uResolution: typeof window !== 'undefined' ? new THREE.Vector2(window.innerWidth, window.innerHeight) : new THREE.Vector2(1, 1),
}, vertex, fragment)

extend({ SeaShadImp })

declare global {
    namespace JSX {
        interface IntrinsicElements {
            seaShadImp: MaterialNode<any, typeof THREE.MeshStandardMaterial>
        }
    }
}

type Props = {
    uTime?: number,
    uBigWavesElevation?: number,
    uBigWavesFrequency?: THREE.Vector2,
    uBigWavesSpeed?: number,
    uSmallWavesElevation?: number,
    uSmallWavesFrequency?: number,
    uSmallWavesSpeed?: number,
    uSmallIterations?: number,
    uDepthColor?: THREE.Color,
    uSurfaceColor?: THREE.Color,
    uColorOffset?: number,
    uColorMultiplier?: number,
    uResolution?: THREE.Vector2
} & JSX.IntrinsicElements['meshStandardMaterial']

const SeaShad = forwardRef(({...props}: Props) => {
    const localRef = useRef<Props>(null!)
    useFrame((_, delta) => {
        localRef.current.uTime! += delta
    })
    return <seaShadImp key={SeaShadImp.key} ref={localRef} attach="material" {...props} />
})
SeaShad.displayName = 'SeaShad'

export default function Page() {
    return <Canvas style={{position: "absolute", top: "0", zIndex: "-1"}}>
        <Scene />
        <Float>
            <Html position={[0, -1.5, 1]}
                center
                transform
                as="h1"
                className={caveat.className}
                scale={0.25}
            >
                <div style={{transform: 'scale(4)', color: '#f0ff24'}}>
                    Let my people go
                </div>
            </Html>
        </Float>
        <OrbitControls />
    </Canvas>
}

function Scene() {
    const view = useThree((state) => state.viewport)
    return <mesh rotation={[-Math.PI * 0.375, 0, 0]}>
        <planeGeometry args={[view.width * 1.75,view.height * 1.25, 512, 512]}/>
        <SeaShad uSmallWavesFrequency={1.7}
                 uSmallWavesSpeed={0.25}
                 uBigWavesFrequency={new THREE.Vector2(0.8, 0.1)}
                 uBigWavesSpeed={0.35}
                 uSmallWavesElevation={0.25}
                 uBigWavesElevation={0.35}
                 uSurfaceColor={new THREE.Color(1, 0.6, 0.95)}
                 uDepthColor={new THREE.Color(0.85, 0.1, 0.75)} />
    </mesh>
}
