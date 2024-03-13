'use client'

import {Canvas, extend, MaterialNode, MaterialProps, useFrame, useThree} from "@react-three/fiber"
import {Float, Html, shaderMaterial, OrbitControls, useTexture} from "@react-three/drei"
import { Caveat } from "next/font/google"
import fragment from './fragment.glsl'
import vertex from './vertex.glsl'
import * as THREE from 'three'
import {forwardRef, useEffect, useImperativeHandle, useRef} from "react"

const caveat = Caveat({
    subsets: ['latin'],
    variable: '--font-caveat'
})

const LitSeaShaderImp = shaderMaterial({
    uTime: 0,
    uProgress: 0,
    uSize: 50,
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
    uRayOrigin: new THREE.Vector3(0, 0, 0),
    uColor: new THREE.Color(0.5, 0.0, 0.025),
    uResolution: typeof window !== 'undefined' ? new THREE.Vector2(window.innerWidth, window.innerHeight) : new THREE.Vector2(1, 1),
}, vertex, fragment)

extend({ LitSeaShaderImp })

declare global {
    namespace JSX {
        interface IntrinsicElements {
            litSeaShaderImp: MaterialNode<any, typeof THREE.PointsMaterial>
        }
    }
}

export type LitSeaShaderUniforms = {
    uTime: number
    uProgress: number
    uSize: number
    uBigWavesElevation?: number
    uBigWavesFrequency?: THREE.Vector2
    uBigWavesSpeed?: number
    uSmallWavesElevation?: number
    uSmallWavesFrequency?: number
    uSmallWavesSpeed?: number
    uSmallIterations?: number
    uDepthColor?: THREE.Color
    uSurfaceColor?: THREE.Color
    uColorOffset?: number
    uColorMultiplier?: number
    uRayOrigin?: THREE.Vector3
    uResolution?: THREE.Vector2
    uColor?: THREE.Color
}

type Props = LitSeaShaderUniforms & MaterialProps

const LitSeaShader = forwardRef<LitSeaShaderUniforms, Props>(
    ({...props}: Props, ref) => {
    const localRef = useRef<Props>(null!)
    const size = useThree((state) => state.size)
    useImperativeHandle(ref, () => localRef.current)

    useEffect(() => {
        localRef.current.uResolution = new THREE.Vector2(size.width, size.height)
    }, [size])

    useFrame((state, delta) => {
        localRef.current.uTime += delta
        localRef.current.uRayOrigin = state.camera.position
        if (localRef.current && localRef.current.uProgress < 1) localRef.current.uProgress += delta
    })

    return <litSeaShaderImp key={LitSeaShaderImp.key} ref={localRef} attach="material" {...props} />
})
LitSeaShader.displayName = 'LitSeaShader'

export default function Page() {

    return <Canvas style={{position: "absolute", top: "0", zIndex: "-1"}} className="bg-slate-950">
        <Scene />
        <Float>
            <Html position={[0, -2, 0]}
                  center
                  transform
                  as="h1"
                  className={caveat.className}
                  scale={0.25}
            >
                <div style={{transform: 'scale(4)', textAlign: 'center', color: "white"}}>
                    String Theory
                </div>
            </Html>
        </Float>
        <OrbitControls/>
    </Canvas>
}
function Scene() {
    const faceRef = useRef<THREE.Mesh>(null!)
    const faceShaderRef = useRef<LitSeaShaderUniforms>(null!)

    return <mesh ref={faceRef} rotation={[-Math.PI * 0.125, 0, -Math.PI * 0.125]}>
        <planeGeometry args={[3, 3, 50, 50]}/>
        <LitSeaShader
            ref={faceShaderRef}
            uSize={0.5}
            uTime={0}
            uProgress={0}
            uSmallWavesFrequency={1.7}
            uSmallWavesSpeed={0.25}
            uBigWavesFrequency={new THREE.Vector2(2.8, 0.4)}
            uBigWavesSpeed={64}
            uSmallWavesElevation={0.25}
            uBigWavesElevation={0.15}
            uSurfaceColor={new THREE.Color(1, 0.6, 0.95)}
            uDepthColor={new THREE.Color(0.85, 0.1, 0.75)}
            uColorMultiplier={2}
            uColorOffset={5}
            uColor={new THREE.Color(0.3, 0.7, 1)}
        />
    </mesh>
}
