'use client'

import {Canvas, extend, MaterialNode, MaterialProps, useFrame} from "@react-three/fiber"
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

const EdgesShaderImp = shaderMaterial({
    uTime: 0,
    uColor: new THREE.Color(0.5, 0.0, 0.025),
    uResolution: typeof window !== 'undefined' ? new THREE.Vector2(window.innerWidth, window.innerHeight) : new THREE.Vector2(1, 1),
}, vertex, fragment, (imp) => { if (imp) {
    //imp.wireframe = true
    imp.side = THREE.DoubleSide
    imp.depthWrite = false
    imp.blending = THREE.AdditiveBlending
} })

extend({ EdgesShaderImp })

declare global {
    namespace JSX {
        interface IntrinsicElements {
            edgesShaderImp: MaterialNode<any, typeof THREE.MeshStandardMaterial>
        }
    }
}

export type EdgesShaderUniforms = {
    uTime: number
    uResolution?: THREE.Vector2
    uColor?: THREE.Color
}

type Props = EdgesShaderUniforms & MaterialProps

const EdgesShader = forwardRef<EdgesShaderUniforms, Props>(({...props}: Props, ref) => {
    const localRef = useRef<Props>(null!)
    useImperativeHandle(ref, () => localRef.current)
    useFrame((state, delta) => {
        localRef.current.uTime += delta
    })
    return <edgesShaderImp key={EdgesShaderImp.key} ref={localRef} attach="material" {...props} />
})
EdgesShader.displayName = 'EdgesShader'

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
                    My frien called Sel
                </div>
            </Html>
        </Float>
        <OrbitControls/>
    </Canvas>
}
function Scene() {
    const faceRef = useRef<THREE.Mesh>(null!)
    const faceShaderRef = useRef<EdgesShaderUniforms>(null!)

    return <mesh ref={faceRef}>
        <torusKnotGeometry args={[1.5, 0.5, 128]} />
        <EdgesShader ref={faceShaderRef} uTime={0} uColor={new THREE.Color(0.1, 0.4, 1)} transparent/>
    </mesh>
}
