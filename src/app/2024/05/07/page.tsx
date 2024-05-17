'use client'

import {Canvas, extend, MaterialNode, MaterialProps, useFrame} from "@react-three/fiber"
import {Float, Html, shaderMaterial, OrbitControls, useTexture} from "@react-three/drei"
import { Caveat } from "next/font/google"
import fragment from './fragment.glsl'
import vertex from './vertex.glsl'
import * as THREE from 'three'
import {forwardRef, useImperativeHandle, useRef} from "react"
import {DoubleSide, Mesh} from "three"

const caveat = Caveat({
    subsets: ['latin'],
    variable: '--font-caveat'
})

const EdgeGlowShaderImp = shaderMaterial({
    uTime: 0,
    uProgress: 0,
    uTexture: new THREE.Texture(),
    uColor: new THREE.Color(0.5, 0.0, 0.025),
    uResolution: typeof window !== 'undefined' ? new THREE.Vector2(window.innerWidth, window.innerHeight) : new THREE.Vector2(1, 1),
}, vertex, fragment, (imp) => { if (imp) {
    //imp.wireframe = true
    imp.side = DoubleSide
    imp.depthWrite = false
} })

extend({ EdgeGlowShaderImp })

declare global {
    namespace JSX {
        interface IntrinsicElements {
            edgeGlowShaderImp: MaterialNode<any, typeof THREE.MeshStandardMaterial>
        }
    }
}

export type EdgeGlowShaderUniforms = {
    uTime: number,
    uProgress?: number,
    uTexture: THREE.Texture,
    uResolution?: THREE.Vector2
    uColor?: THREE.Color
}

type Props = EdgeGlowShaderUniforms & MaterialProps

const EdgeGlowShader = forwardRef<EdgeGlowShaderUniforms, Props>(({...props}: Props, ref) => {
    const localRef = useRef<Props>(null!)
    useImperativeHandle(ref, () => localRef.current)
    useFrame((state, delta) => {
        localRef.current.uTime += delta
    })
    return <edgeGlowShaderImp key={EdgeGlowShaderImp.key} ref={localRef} attach="material" {...props} />
})
EdgeGlowShader.displayName = 'EdgeGlowShader'

export default function Page() {

    return <Canvas style={{position: "absolute", top: "0", zIndex: "-1"}}>
        <Scene />
        <Float>
            <Html position={[0, -2, 0]}
                  center
                  transform
                  as="h1"
                  className={caveat.className}
                  scale={0.25}
            >
                <div style={{transform: 'scale(4)', textAlign: 'center'}}>
                    shhhhhwwing
                </div>
            </Html>
        </Float>
        <OrbitControls/>
    </Canvas>
}
function Scene() {
    const faceTex = useTexture('/noise.png')
    faceTex.wrapT = THREE.RepeatWrapping
    faceTex.wrapS = THREE.RepeatWrapping
    const faceRef = useRef<Mesh>(null!)
    const faceShaderRef = useRef<EdgeGlowShaderUniforms>(null!)

    useFrame(() => {
        if (faceShaderRef.current) {
            if (faceShaderRef.current.uProgress! < 1){
                faceShaderRef.current.uProgress! += 0.01
            } else {
                faceShaderRef.current.uProgress = 0
            }
        }
    })

    return <mesh ref={faceRef}>
        <planeGeometry args={[4, 4, 50, 400]} />
        <EdgeGlowShader ref={faceShaderRef} uTime={0} uColor={new THREE.Color(1.0, 0.2431, 0.0)} transparent uTexture={faceTex}/>
    </mesh>
}
