 'use client'

import {Canvas, extend, MaterialNode, MaterialProps, useFrame, useThree} from "@react-three/fiber"
import {Float, Html, shaderMaterial, OrbitControls} from "@react-three/drei"
import { Caveat } from "next/font/google"
import fragment from './fragment.glsl'
import vertex from './vertex.glsl'
import * as THREE from 'three'
import React, {forwardRef, useEffect, useImperativeHandle, useRef} from "react"

const caveat = Caveat({
    subsets: ['latin'],
    variable: '--font-caveat'
})

const CursorSandShaderImp = shaderMaterial({
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

extend({ CursorSandShaderImp })

declare global {
    namespace JSX {
        interface IntrinsicElements {
            cursorSandShaderImp: MaterialNode<any, typeof THREE.MeshStandardMaterial>
        }
    }
}

export type CursorSandShaderUniforms = {
    uTime: number
    uMouse?: THREE.Vector2
    uSize?: THREE.Vector2
    uCanvas: THREE.CanvasTexture
    uRayOrigin?: THREE.Vector3
    uResolution?: THREE.Vector2
    uColor?: THREE.Color
}

type Props = CursorSandShaderUniforms & MaterialProps

const CursorSandShader = forwardRef<CursorSandShaderUniforms, Props>(({...props}: Props, ref) => {
    const localRef = useRef<Props>(null!)
    useImperativeHandle(ref, () => localRef.current)
    useFrame((state, delta) => {
        localRef.current.uTime += delta
        localRef.current.uMouse = state.pointer
        localRef.current.uRayOrigin = state.camera.position
    })
    return <cursorSandShaderImp key={CursorSandShaderImp.key} ref={localRef} attach="material" {...props} />
})
CursorSandShader.displayName = 'CursorSandShader'

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
                    <div style={{transform: 'scale(4)', textAlign: 'center', pointerEvents: 'none'}}>
                        Clingy
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
    const canvas = useRef<HTMLCanvasElement>(null!)
    const cTexture = useRef<THREE.CanvasTexture>(null!)
    const ctx = useRef<CanvasRenderingContext2D>(null!)
    const transPlane = useRef<THREE.Mesh>(null!)
    const lastMouse = useRef(new THREE.Vector2(0.5, 0.5))
    const geometry = useRef<THREE.BufferGeometry>(null!)
    const particles = useRef(new Float32Array(150))
    const pointsRef = useRef<THREE.Points>(null!)

    const disImage = useRef(new Image())
    disImage.current.src = '/1.png'

    useEffect(() => {

        if (canvas.current) {
            ctx.current = canvas.current.getContext('2d')!
            ctx.current.fillRect(0, 0, 128, 128)
            cTexture.current = new THREE.CanvasTexture(canvas.current)
            shader.current.uCanvas = cTexture.current
        } else {
            setTimeout(() => {
                ctx.current = canvas.current.getContext('2d')!
                ctx.current.fillRect(0, 0, 128, 128)
                cTexture.current = new THREE.CanvasTexture(canvas.current)
                shader.current.uCanvas = cTexture.current
            }, 100)
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

    let update = false
    let pos = 0
    useFrame((state) => {
        if (disImage.current){
            state.raycaster.intersectObject(transPlane.current).forEach((inter) => {
                if (lastMouse.current.x !== inter.uv!.x || lastMouse.current.y !== inter.uv!.y) {
                    update = true
                    lastMouse.current.x = inter.uv!.x * 128 - 28
                    lastMouse.current.y = (1.0 - inter.uv!.y) * 128 - 28
                    if (geometry.current) {

                    }
                }
            })
            if (update && ctx.current) {
                ctx.current.globalCompositeOperation = 'lighten'
                ctx.current.globalAlpha = 1.0
                ctx.current.drawImage(disImage.current, lastMouse.current.x, lastMouse.current.y, 56,56)
                update = false
            }
        }
        if (ctx.current) {
            ctx.current.globalCompositeOperation = 'source-over'
            ctx.current.globalAlpha = 0.05
            ctx.current.fillRect(0, 0, 128, 128)
            cTexture.current.needsUpdate = true
        }
        if (particles.current) {
            particles.current[pos] = Math.random() * state.pointer.x
            particles.current[pos + 1] = Math.random() * state.pointer.y
            particles.current[pos + 2] = 0
            pos += 3
            if (pos > 100) {
                pos = 0
            }
            geometry.current.attributes.position.needsUpdate = true
        }
    })

    return <>
        <points ref={pointsRef}>
            <bufferGeometry ref={geometry}>
                <bufferAttribute attach="attributes-position" count={50} array={particles.current} itemSize={3}/>
            </bufferGeometry>
            <CursorSandShader
                ref={shader}
                uTime={0}
                uCanvas={cTexture.current}
            />
        </points>
        <mesh ref={transPlane}>
            <planeGeometry args={[view.width, view.height]}/>
            <meshBasicMaterial color={'#000'} transparent opacity={0}/>
        </mesh>
        <Html position={[view.width, view.height * 0.5 - 1, 0.5]}>
            <canvas ref={canvas} width={128} height={128} className="fixed top-0 right-0 border"/>
        </Html>
    </>
}
