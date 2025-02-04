 'use client'

import {Canvas, extend, MaterialNode, MaterialProps, useFrame, useThree} from "@react-three/fiber"
import {Float, Html, shaderMaterial, OrbitControls} from "@react-three/drei"
import { Caveat } from "next/font/google"
import fragment from './fragment.glsl'
import vertex from './vertex.glsl'
import * as THREE from 'three'
import React, {forwardRef, useEffect, useImperativeHandle, useRef} from "react"
 import {useRive} from "rive-react"

const caveat = Caveat({
    subsets: ['latin'],
    variable: '--font-caveat'
})

const SVGCanvasAgainShaderImp = shaderMaterial({
    uTime: 0,
    uMouse: new THREE.Vector2(0, 0),
    uSize: new THREE.Vector2(1, 1),
    uCanvas: null,
    uRayOrigin: new THREE.Vector3(0, 0, 0),
    uColor: new THREE.Color(0.125, 0.0, 0.5),
    uResolution: typeof window !== 'undefined' ? new THREE.Vector2(window.innerWidth, window.innerHeight) : new THREE.Vector2(1, 1),
}, vertex, fragment, (imp) => { if (imp) {
    //imp.wireframe = true
} })

extend({ SVGCanvasAgainShaderImp })

declare global {
    namespace JSX {
        interface IntrinsicElements {
            sVGCanvasAgainShaderImp: MaterialNode<any, typeof THREE.MeshStandardMaterial>
        }
    }
}

export type SVGCanvasAgainShaderUniforms = {
    uTime: number
    uMouse?: THREE.Vector2
    uSize?: THREE.Vector2
    uCanvas: THREE.CanvasTexture
    uRayOrigin?: THREE.Vector3
    uResolution?: THREE.Vector2
    uColor?: THREE.Color
}

type Props = SVGCanvasAgainShaderUniforms & MaterialProps

const SVGCanvasAgainShader = forwardRef<SVGCanvasAgainShaderUniforms, Props>(({...props}: Props, ref) => {
    const localRef = useRef<Props>(null!)
    useImperativeHandle(ref, () => localRef.current)
    useFrame((state, delta) => {
        localRef.current.uTime += delta
        localRef.current.uMouse = state.pointer
        localRef.current.uRayOrigin = state.camera.position
    })
    return <sVGCanvasAgainShaderImp key={SVGCanvasAgainShaderImp.key} ref={localRef} attach="material" {...props} />
})
SVGCanvasAgainShader.displayName = 'SVGCanvasAgainShader'

export default function Page() {

    return <>
        <Canvas style={{position: "absolute", top: "0", zIndex: "-1"}}>
            <Scene />
            <Float>
                <Html position={[0, -2.5, 0]}
                      center
                      transform
                      as="h1"
                      className={caveat.className}
                      scale={0.25}
                >
                    <div style={{transform: 'scale(4)', textAlign: 'center', pointerEvents: 'none', color: 'white'}}>
                        Welcome back.
                    </div>
                </Html>
            </Float>
            <OrbitControls/>
        </Canvas>
    </>
}

function Scene() {
    const view = useThree((state) => state.viewport)
    const shader = useRef<Props>(null!)

    const {rive, RiveComponent, canvas} = useRive({
        src: '/caption.riv',
        stateMachines: 'State Machine 1',
        autoplay: true,
    })
    const cTexture = useRef<THREE.CanvasTexture>(null!)
    const ctx = useRef<CanvasRenderingContext2D>(null!)
    const transPlane = useRef<THREE.Mesh>(null!)
    const geometry = useRef<THREE.PlaneGeometry>(null!)
    const particles = useRef(new Float32Array(150))
    const meshRef = useRef<THREE.Mesh>(null!)

    const disImage = useRef(new Image())
    disImage.current.src = '/1.png'
    console.log(rive)

    useEffect(() => {

        if (canvas) {
            console.log('canvas')
            ctx.current = canvas.getContext('2d')!
            ctx.current.fillRect(0, 0, 128, 128)
            cTexture.current = new THREE.CanvasTexture(canvas)
            shader.current.uCanvas = cTexture.current

        } else {
        }
        if (particles.current) {
            for (let i = 0; i < 150; i++) {
                particles.current[i] = 999
            }
        }

    }, [])

    useEffect(() => {
        shader.current.uResolution = new THREE.Vector2(window.innerWidth, window.innerHeight)
        transPlane.current.geometry = new THREE.PlaneGeometry(view.width, view.height)
    }, [view])

    return <>
        <mesh ref={meshRef}>
            <planeGeometry ref={geometry} args={[view.width * 0.5, view.width * 0.5, 5, 5]}/>
            <SVGCanvasAgainShader
                ref={shader}
                uTime={0}
                uCanvas={cTexture.current}
            />
        </mesh>
        <mesh ref={transPlane}>
            <planeGeometry args={[view.width, view.height]}/>
            <meshBasicMaterial color={'#000'} transparent opacity={0}/>
        </mesh>
        <Html position={[0, 2, 0.5]} transform scale={0.5}>
            <div className="w-[500px] h-[500px]"><RiveComponent/></div>
        </Html>
    </>
}
