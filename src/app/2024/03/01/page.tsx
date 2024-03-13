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

const LitShaderImp = shaderMaterial({
    uTime: 0,
    uProgress: 0,
    uSize: 50,
    uRayOrigin: new THREE.Vector3(0, 0, 0),
    uColor: new THREE.Color(0.5, 0.0, 0.025),
    uResolution: typeof window !== 'undefined' ? new THREE.Vector2(window.innerWidth, window.innerHeight) : new THREE.Vector2(1, 1),
}, vertex, fragment)

extend({ LitShaderImp })

declare global {
    namespace JSX {
        interface IntrinsicElements {
            litShaderImp: MaterialNode<any, typeof THREE.PointsMaterial>
        }
    }
}

export type LitShaderUniforms = {
    uTime: number,
    uProgress: number,
    uSize: number,
    uRayOrigin?: THREE.Vector3,
    uResolution?: THREE.Vector2
    uColor?: THREE.Color
}

type Props = LitShaderUniforms & MaterialProps

const LitShader = forwardRef<LitShaderUniforms, Props>(
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

    return <litShaderImp key={LitShaderImp.key} ref={localRef} attach="material" {...props} />
})
LitShader.displayName = 'LitShader'

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
                    Da Ba Dee<br/>Da Ba Die
                </div>
            </Html>
        </Float>
        <OrbitControls/>
    </Canvas>
}
function Scene() {
    const faceRef = useRef<THREE.Mesh>(null!)
    const faceShaderRef = useRef<LitShaderUniforms>(null!)

    return <mesh ref={faceRef}>
        <torusKnotGeometry args={[1, 0.4, 100, 16]} />
        <LitShader
            ref={faceShaderRef}
            uSize={0.5}
            uTime={0}
            uProgress={0}
            uColor={new THREE.Color(0.3, 0.7, 1)}
        />
    </mesh>
}
