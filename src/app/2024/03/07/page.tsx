'use client'

import {Canvas, extend, MaterialNode, MaterialProps, useFrame} from "@react-three/fiber"
import {Float, Html, shaderMaterial, OrbitControls, useTexture} from "@react-three/drei"
import { Caveat } from "next/font/google"
import fragment from './fragment.glsl'
import vertex from './vertex.glsl'
import * as THREE from 'three'
import {forwardRef, useImperativeHandle, useRef} from "react"

const caveat = Caveat({
    subsets: ['latin'],
    variable: '--font-caveat'
})

const HatchShaderImp = shaderMaterial({
    uTime: 0,
    uColor: new THREE.Color(0.5, 0.0, 0.025),
    uResolution: typeof window !== 'undefined' ? new THREE.Vector2(window.innerWidth, window.innerHeight) : new THREE.Vector2(1, 1),
}, vertex, fragment, (imp) => { if (imp) {
} })

extend({ HatchShaderImp })

declare global {
    namespace JSX {
        interface IntrinsicElements {
            hatchShaderImp: MaterialNode<any, typeof THREE.MeshStandardMaterial>
        }
    }
}

export type HatchShaderUniforms = {
    uTime: number
    uResolution?: THREE.Vector2
    uColor?: THREE.Color
}

type Props = HatchShaderUniforms & MaterialProps

const HatchShader = forwardRef<HatchShaderUniforms, Props>(({...props}: Props, ref) => {
    const localRef = useRef<Props>(null!)
    useImperativeHandle(ref, () => localRef.current)
    useFrame((state, delta) => {
        localRef.current.uTime += delta
    })
    return <hatchShaderImp key={HatchShaderImp.key} ref={localRef} attach="material" {...props} />
})
HatchShader.displayName = 'HatchShader'

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
                    Half Tone Alyx
                </div>
            </Html>
        </Float>
        <OrbitControls/>
    </Canvas>
}
function Scene() {
    const faceRef = useRef<THREE.Mesh>(null!)
    const faceShaderRef = useRef<HatchShaderUniforms>(null!)

    return <mesh ref={faceRef}>
        <torusKnotGeometry args={[1.5, 0.5, 128]} />
        <HatchShader ref={faceShaderRef} uTime={0} uColor={new THREE.Color(0.15, 0.2, 0.7)}/>
    </mesh>
}
