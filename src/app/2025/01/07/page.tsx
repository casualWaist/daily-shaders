'use client'

import {Canvas, MaterialNode, MaterialProps, useThree} from "@react-three/fiber"
import * as THREE from 'three'
import {extend, useFrame} from '@react-three/fiber'
import {Float, Html, shaderMaterial, useTexture} from '@react-three/drei'
import vertex from './vertex.glsl'
import fragment from './fragment.glsl'
import React, {forwardRef, useEffect, useImperativeHandle, useRef} from 'react'
import {Caveat, Raleway} from "next/font/google"
import {useRive} from "rive-react"

const caveat = Caveat({
    subsets: ['latin'],
    variable: '--font-caveat'
})

const railway = Raleway({
    subsets: ['latin'],
    variable: '--font-railway'
})

const NewYearShaderImp = shaderMaterial({
    uTime: 0,
    uScroll: 0.00001,
    uMouse: new THREE.Vector2(0, 0),
    uSize: new THREE.Vector2(1, 1),
    uTexture: new THREE.Texture(),
    uRayOrigin: new THREE.Vector3(0, 0, 0),
    uColor: new THREE.Color(0.4431, 0.6549, 0.6725),
    uAspect: 1.0,
    uResolution: typeof window !== 'undefined' ? new THREE.Vector2(window.innerWidth, window.innerHeight) : new THREE.Vector2(1, 1),
}, vertex, fragment, (imp) => {
    if (imp) {
        //imp.wireframe = true
    }
})

extend({NewYearShaderImp})

declare global {
    namespace JSX {
        interface IntrinsicElements {
            newYearShaderImp: MaterialNode<any, typeof THREE.MeshStandardMaterial>
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
    uAspect?: number
}

type Props = Crap4DShaderUniforms & MaterialProps

const NYShader = forwardRef<Crap4DShaderUniforms, Props>(({...props}: Props, ref) => {
    const localRef = useRef<Props>(null!)
    const canvas = useThree((state) => state.gl.domElement)
    const lastTouch = useRef<Touch | null>(null)
    useImperativeHandle(ref, () => localRef.current)
    const texture = useTexture('/Headshot.webp')
    const moveTo = useRef(new THREE.Vector2(0, 0))

    useEffect(() => {
        localRef.current.uTexture = texture
        const handleScroll = (e: WheelEvent) => {
            if (e.deltaY === -0 || e.deltaY === 0 || (e.deltaY < 0.01 && e.deltaY > -0.01)) return
            if (e.deltaY > 0) {
                localRef.current.uScroll! -= 0.1
            } else {
                localRef.current.uScroll! += 0.1
            }
        }
        canvas.addEventListener('wheel', handleScroll)

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
        localRef.current.uMouse = moveTo.current.lerp(state.pointer, 0.01)
        localRef.current.uRayOrigin = state.camera.position
        localRef.current.uAspect = state.size.width / state.size.height
    })
    return <newYearShaderImp key={NewYearShaderImp.key} ref={localRef} attach="material" {...props} />
})
NYShader.displayName = 'Crap4DShader'

export default function Page() {
    const {rive, RiveComponent, canvas} = useRive({
        src: '/me-landing.riv',
        stateMachines: 'State Machine 1',
        autoplay: true,
    })

    return <>
        <Canvas style={{position: "fixed", top: "0", zIndex: "-1", pointerEvents: 'auto'}}>
            <Scene/>
        </Canvas>
        <div className="absolute top-0 w-full h-full">
            <div className="absolute bottom-0 right-0 p-24 text-7xl text-neutral-600 font-thin" style={railway.style}>
                Matthew Haar
                <div className="text-xl text-right pr-2">
                    Creative Developer
                </div>
            </div>
            <div className="w-full h-full"><RiveComponent/></div>
        </div>
    </>
}


function Scene({props}: { props?: JSX.IntrinsicElements['mesh'] }) {
    const {width, height} = useThree((state) => state.viewport)
    const shaderRef = useRef<THREE.ShaderMaterial>(null!)
    const meshRef = useRef<THREE.Mesh>(null!)

    useFrame(() => {
        if (meshRef.current && shaderRef.current) {
            meshRef.current.position.y = -shaderRef.current.uniforms.uScroll!.value * 0.01
        }
    })

    return <>
        <mesh position={[0, 0, 0]} {...props}>
            <planeGeometry args={[width, height]}/>
            {/* @ts-ignore */}
            <NYShader ref={shaderRef}/>
        </mesh>
    </>
}
