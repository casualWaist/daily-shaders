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

const ShadSeaImp = shaderMaterial({
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

extend({ ShadSeaImp })

declare global {
    namespace JSX {
        interface IntrinsicElements {
            shadSeaImp: MaterialNode<any, typeof THREE.MeshStandardMaterial>
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

const ShadSea = forwardRef(({...props}: Props) => {
    const localRef = useRef<Props>(null!)
    useFrame((_, delta) => {
        localRef.current.uTime! += delta
    })
    return <shadSeaImp key={ShadSeaImp.key} ref={localRef} attach="material" {...props} />
})
ShadSea.displayName = 'ShadSea'

export default function Page() {
    return <Canvas style={{position: "absolute", top: "0", zIndex: "-1"}}>
        <Scene/>
        <Float>
            <Html position={[0, -1.5, 1]}
                  center
                  transform
                  as="h1"
                  className={caveat.className}
                  scale={0.25}
            >
                <div style={{transform: 'scale(4)', color: '#ffffff'}}>
                    Electro-Cardio
                </div>
            </Html>
        </Float>
        <color attach="background" args={['#41005b']}/>
        <OrbitControls/>
    </Canvas>
}

function Scene() {
    const view = useThree((state) => state.viewport)
    return <mesh rotation={[-Math.PI * 0.375, 0, 0]}>
        <sphereGeometry args={[view.width * 0.25, 512, 512]}/>
        <ShadSea uSmallWavesFrequency={0.75}
                 uSmallIterations={18}
                 uSmallWavesSpeed={0.05}
                 uBigWavesFrequency={new THREE.Vector2(0.1, 1.9)}
                 uBigWavesSpeed={4}
                 uSmallWavesElevation={0.45}
                 uBigWavesElevation={0.15}
                 uColorMultiplier={10}
                 uColorOffset={0.1}
                 uSurfaceColor={new THREE.Color(0.4, 1, 0.95)}
                 uDepthColor={new THREE.Color(0.45, 0.1, 0.75)} />
    </mesh>
}
