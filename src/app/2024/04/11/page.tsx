'use client'

import {Canvas, extend, MaterialNode, MaterialProps, useFrame, useThree} from "@react-three/fiber"
import {Float, Html, shaderMaterial, OrbitControls} from "@react-three/drei"
import { Caveat } from "next/font/google"
import fragment from './fragment.glsl'
import vertex from './vertex.glsl'
import * as THREE from 'three'
import React, {forwardRef, useImperativeHandle, useRef} from "react"

const caveat = Caveat({
    subsets: ['latin'],
    variable: '--font-caveat'
})

const CheckRollShaderImp = shaderMaterial({
    uTime: 0,
    uMouse: new THREE.Vector2(0, 0),
    uSize: new THREE.Vector2(1, 1),
    uColor: new THREE.Color(0.83, 0.74, 0.55),
    uResolution: typeof window !== 'undefined' ? new THREE.Vector2(window.innerWidth, window.innerHeight) : new THREE.Vector2(1, 1),
}, vertex, fragment, (imp) => { if (imp) {
} })

extend({ CheckRollShaderImp })

declare global {
    namespace JSX {
        interface IntrinsicElements {
            checkRollShaderImp: MaterialNode<any, typeof THREE.MeshStandardMaterial>
        }
    }
}

export type CheckRollShaderUniforms = {
    uTime: number
    uMouse?: THREE.Vector2
    uSize?: THREE.Vector2
    uTexture?: THREE.Texture
    uResolution?: THREE.Vector2
    uColor?: THREE.Color
}

type Props = CheckRollShaderUniforms & MaterialProps

const CheckRollShader = forwardRef<CheckRollShaderUniforms, Props>(({...props}: Props, ref) => {
    const localRef = useRef<Props>(null!)
    useImperativeHandle(ref, () => localRef.current)
    useFrame((state, delta) => {
        localRef.current.uTime += delta
        localRef.current.uMouse = state.pointer
    })
    return <checkRollShaderImp key={CheckRollShaderImp.key} ref={localRef} attach="material" {...props} />
})
CheckRollShader.displayName = 'CheckRollShader'

export default function Page() {

    return <>
        <Canvas style={{position: "absolute", top: "0", zIndex: "-1", backgroundColor: '#2bafe8'}}>
            <Scene />
            <Float>
                <Html position={[0, -2.5, 0]}
                      center
                      transform
                      as="h1"
                      className={caveat.className}
                      scale={0.25}
                >
                    <div style={{transform: 'scale(4)', textAlign: 'center', pointerEvents: 'none'}}>
                        I'll Tell<br/>U Y, Y, Y
                    </div>
                </Html>
            </Float>
            <OrbitControls/>
        </Canvas>
    </>
}

function Scene({props}: {props?: JSX.IntrinsicElements['mesh']}) {
    const view = useThree((state) => state.viewport)
    const meshRef = useRef<THREE.Mesh>(null!)

    return <mesh ref={meshRef} position={[0, 0, 0]} {...props}>
        <torusKnotGeometry args={[2, 0.5, 128, 128]}/>
        <CheckRollShader
            uTime={0}
            uSize={new THREE.Vector2(view.width, view.height)}
            transparent
        />
    </mesh>
}
