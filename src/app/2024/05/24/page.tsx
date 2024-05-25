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

const Color24ShaderImp = shaderMaterial({
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

extend({ Color24ShaderImp })

declare global {
    namespace JSX {
        interface IntrinsicElements {
            color24ShaderImp: MaterialNode<any, typeof THREE.MeshStandardMaterial>
        }
    }
}

export type Color24ShaderUniforms = {
    uTime?: number
    uScroll?: number
    uMouse?: THREE.Vector2
    uSize?: THREE.Vector2
    uTexture?: THREE.Texture
    uRayOrigin?: THREE.Vector3
    uResolution?: THREE.Vector2
    uColor?: THREE.Color
}

type Props = Color24ShaderUniforms & MaterialProps

const Color24Shader = forwardRef<Color24ShaderUniforms, Props>(({...props}: Props, ref) => {
    const localRef = useRef<Props>(null!)
    const canvas = useThree((state) => state.gl.domElement)
    const lastTouch = useRef<Touch | null>(null)
    useImperativeHandle(ref, () => localRef.current)

    useEffect(() => {
        const handleScroll = (e: WheelEvent) => {
            if (e.deltaY === -0 || e.deltaY === 0 || (e.deltaY < 0.01 && e.deltaY > -0.01)) return
            if (e.deltaY > 0) {
                localRef.current.uScroll! -= 0.1
            } else {
                localRef.current.uScroll! += 0.1
            }
        }
        canvas.addEventListener('wheel', handleScroll )

        const handleTouch = (e: TouchEvent) => {
            if (e.touches.length >= 1 && e.changedTouches.length >= 1) {
                const touch = e.changedTouches[0]
                if (lastTouch.current) {
                    if (touch.clientY > lastTouch.current?.clientY) {
                        localRef.current.uScroll! -= 0.1
                    } else {
                        localRef.current.uScroll! += 0.1
                    }
                    lastTouch.current = touch
                } else {
                    lastTouch.current = touch
                }
            }
        }
        canvas.addEventListener('touchmove', handleTouch)
        return () => {
            canvas.removeEventListener('wheel', handleScroll)
            canvas.removeEventListener('touchmove', handleTouch)
        }
    }, [])

    useFrame((state, delta) => {
        localRef.current.uTime! += delta
        localRef.current.uMouse = state.pointer
        localRef.current.uRayOrigin = state.camera.position
    })
    return <color24ShaderImp key={Color24ShaderImp.key} ref={localRef} attach="material" {...props} />
})
Color24Shader.displayName = 'Color24Shader'

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
                    3D Colorizer
                </div>
            </Html>
        </Float>
    </Canvas>
}


function Scene({props}: {props?: JSX.IntrinsicElements['mesh']}) {
    const shaderRef = useRef<THREE.ShaderMaterial>(null!)
    const meshRef = useRef<THREE.Mesh>(null!)
    const { viewport } = useThree()

    useEffect(() => {
        if (shaderRef.current){
            shaderRef.current.uniforms.uSize!.value = new THREE.Vector2(viewport.width, viewport.height)
        }
    }, [viewport])

    useFrame(() => {
        if (meshRef.current && shaderRef.current) {
            meshRef.current.position.y = -shaderRef.current.uniforms.uScroll!.value * 0.01
        }
    })

    return <>
        <mesh position={[0, 0, 0]} {...props}>
            <planeGeometry args={[viewport.width, viewport.height]}/>
            {/* @ts-ignore */}
            <Color24Shader ref={shaderRef}/>
        </mesh>
        <mesh ref={meshRef} position={[viewport.width * 0.45, 0, 0]}>
            <sphereGeometry args={[0.1, 32, 32]}/>
            <meshBasicMaterial color="orange"/>
        </mesh>
    </>
}
