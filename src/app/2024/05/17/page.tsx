'use client'

import {Canvas, MaterialNode, MaterialProps, useThree} from "@react-three/fiber"
import * as THREE from 'three'
import { extend, useFrame } from '@react-three/fiber'
import {Float, Html, shaderMaterial} from '@react-three/drei'
import vertex from './vertex.glsl'
import fragment from './fragment.glsl'
import React, {forwardRef, useEffect, useImperativeHandle, useRef} from 'react'
import {Caveat} from "next/font/google"

const caveat = Caveat({
    subsets: ['latin'],
    variable: '--font-caveat'
})

const Crap4DShaderImp = shaderMaterial({
    uTime: 0,
    uScroll: 0.00001,
    uMouse: new THREE.Vector2(0, 0),
    uSize: new THREE.Vector2(1, 1),
    uTexture: new THREE.Texture(),
    uRayOrigin: new THREE.Vector3(0, 0, 0),
    uColor: new THREE.Color(0.4431,0.6549,  0.6725),
    uResolution: typeof window !== 'undefined' ? new THREE.Vector2(window.innerWidth, window.innerHeight) : new THREE.Vector2(1, 1),
}, vertex, fragment, (imp) => { if (imp) {
    //imp.wireframe = true
} })

extend({ Crap4DShaderImp })

declare global {
    namespace JSX {
        interface IntrinsicElements {
            crap4DShaderImp: MaterialNode<any, typeof THREE.MeshStandardMaterial>
        }
    }
}

export type Crap4DShaderUniforms = {
    uTime?: number
    uScroll?: number
    uMouse?: THREE.Vector2
    uSize?: THREE.Vector2
    uTexture?: THREE.Texture
    uRayOrigin?: THREE.Vector3
    uResolution?: THREE.Vector2
    uColor?: THREE.Color
}

type Props = Crap4DShaderUniforms & MaterialProps

const Crap4DShader = forwardRef<Crap4DShaderUniforms, Props>(({...props}: Props, ref) => {
    const localRef = useRef<Props>(null!)
    const canvas = useThree((state) => state.gl.domElement)
    useImperativeHandle(ref, () => localRef.current)

    useEffect(() => {
        canvas.addEventListener('wheel', (e) => {
            if (e.deltaY === -0 || e.deltaY === 0 || (e.deltaY < 0.01 && e.deltaY > -0.01)) return
            if (e.deltaY > 0) {
                localRef.current.uScroll! -= 0.1
            } else {
                localRef.current.uScroll! += 0.1
            }
        })
    }, [])

    useFrame((state, delta) => {
        localRef.current.uTime! += delta
        localRef.current.uMouse = state.pointer
        localRef.current.uRayOrigin = state.camera.position
    })
    return <crap4DShaderImp key={Crap4DShaderImp.key} ref={localRef} attach="material" {...props} />
})
Crap4DShader.displayName = 'Crap4DShader'

export default function Page() {
    return <Canvas style={{position: "fixed", top: "0", zIndex: "-1", pointerEvents: 'auto'}}>
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
                    Eh, Merry Sometimes<br/>Don't go Round
                </div>
            </Html>
        </Float>
    </Canvas>
}


function Scene({props}: {props?: JSX.IntrinsicElements['mesh']}) {
    const shaderRef = useRef<THREE.ShaderMaterial>(null!)
    const meshRef = useRef<THREE.Mesh>(null!)

    useFrame(() => {
        if (meshRef.current && shaderRef.current) {
            meshRef.current.position.y = -shaderRef.current.uniforms.uScroll!.value * 0.01
        }
    })

    return <>
        <mesh position={[0, 0, 0]} {...props}>
            <planeGeometry args={[4, 4]}/>
            {/* @ts-ignore */}
            <Crap4DShader ref={shaderRef}/>
        </mesh>
        <mesh ref={meshRef} position={[2, 0, 0]}>
            <sphereGeometry args={[0.1, 32, 32]}/>
            <meshBasicMaterial color="orange"/>
        </mesh>
    </>
}
