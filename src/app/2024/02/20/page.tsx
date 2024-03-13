'use client'

import {Canvas, extend, MaterialNode, useFrame, useThree} from "@react-three/fiber"
import {Float, Html, shaderMaterial, OrbitControls} from "@react-three/drei"
import { Caveat } from "next/font/google"
import fragment from './fragment.glsl'
import vertex from './vertex.glsl'
import * as THREE from 'three'
import {forwardRef, useImperativeHandle, useRef} from "react"

const caveat = Caveat({
    subsets: ['latin'],
    variable: '--font-caveat'
})

const EightiesPortalImp = shaderMaterial({
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

extend({ EightiesPortalImp })

declare global {
    namespace JSX {
        interface IntrinsicElements {
            eightiesPortalImp: MaterialNode<any, typeof THREE.MeshStandardMaterial>
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

const EightiesPortal = forwardRef(({...props}: Props, ref) => {
    const localRef = useRef<Props>(null!)
    useImperativeHandle(ref, () => localRef.current)
    useFrame((_, delta) => {
        localRef.current.uTime! += delta
    })
    return <eightiesPortalImp key={EightiesPortalImp.key} ref={localRef} attach="material" {...props} />
})
EightiesPortal.displayName = 'EightiesPortal'

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
                <div style={{transform: 'scale(4)', textAlign: 'center'}}>
                    Reincarnating...<br/>[######..........] 40%
                </div>
            </Html>
        </Float>
        <OrbitControls/>
    </Canvas>
}

function Scene() {
    const view = useThree((state) => state.viewport)
    return <mesh>
        <sphereGeometry args={[view.width * 0.5, 512, 512]}/>
        <EightiesPortal uSmallWavesFrequency={0.2}
                 uSmallIterations={1}
                 uSmallWavesSpeed={0.25}
                 uBigWavesSpeed={2}
                 uSmallWavesElevation={0.05}
                 uBigWavesElevation={0.5}
                 uBigWavesFrequency={new THREE.Vector2(1, 20)}
                 transparent
                 depthTest
                 depthWrite={false}
                 uColorMultiplier={0.6}
                 uColorOffset={0.1}
                 uSurfaceColor={new THREE.Color(0.4, 1, 0.95)}
                 uDepthColor={new THREE.Color(0.45, 0.1, 0.75)} />
    </mesh>
}