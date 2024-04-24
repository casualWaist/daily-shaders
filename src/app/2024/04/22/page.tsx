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
                        Too many Canvi<br/>Part Too
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
    const svgCloudRef = useRef<SVGSVGElement>(null!)
    const svgPathRef = useRef<SVGPathElement>(null!)
    const cTexture = useRef<THREE.CanvasTexture>(null!)
    const ctx = useRef<CanvasRenderingContext2D>(null!)
    const transPlane = useRef<THREE.Mesh>(null!)
    const lastMouse = useRef(new THREE.Vector2(0.5, 0.5))
    const geometry = useRef<THREE.PlaneGeometry>(null!)
    const particles = useRef(new Float32Array(150))
    const meshRef = useRef<THREE.Mesh>(null!)

    const disImage = useRef(new Image())
    disImage.current.src = '/1.png'

    useEffect(() => {

        if (canvas.current) {
            console.log('canvas')
            ctx.current = canvas.current.getContext('2d')!
            ctx.current.fillRect(0, 0, 128, 128)
            cTexture.current = new THREE.CanvasTexture(canvas.current)
            shader.current.uCanvas = cTexture.current
            if (svgCloudRef.current) {
                const svgData = (new XMLSerializer()).serializeToString(svgCloudRef.current)
                const img = document.createElement("img")
                img.setAttribute("src", "data:image/svg+xml;base64," + window.btoa(decodeURIComponent(encodeURIComponent(svgData))) )
                img.onload = function() {
                    ctx.current.drawImage(img, 0, 0)
                }
            }
        } else {
            setTimeout(() => {
                ctx.current = canvas.current.getContext('2d')!
                ctx.current.fillRect(0, 0, 128, 128)
                cTexture.current = new THREE.CanvasTexture(canvas.current)
                shader.current.uCanvas = cTexture.current
                if (svgCloudRef.current) {
                    const svgData = (new XMLSerializer()).serializeToString(svgCloudRef.current)
                    const img = document.createElement("img")
                    img.setAttribute("src", "data:image/svg+xml;base64," + window.btoa(decodeURIComponent(encodeURIComponent(svgData))) )
                    img.onload = function() {
                        ctx.current.drawImage(img, 0, 0)
                    }
                }
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
    /*let pos = 0*/
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
            ctx.current.globalAlpha = 0.005
            ctx.current.fillRect(0, 0, 128, 128)
            cTexture.current.needsUpdate = true
        }
        /*if (particles.current) {
            particles.current[pos] = state.pointer.x * view.width + (Math.random() - 0.5) * 0.5
            particles.current[pos + 1] = state.pointer.y * view.height + (Math.random() - 0.5) * 0.5
            particles.current[pos + 2] = 0
            pos += 3
            if (pos > 100) {
                pos = 0
            }
            geometry.current.attributes.position.needsUpdate = true
        }*/
        if (svgCloudRef.current && ctx.current) {
            svgPathRef.current.style.transform = `rotate(${state.clock.elapsedTime * 10}deg)`
            const svgData = (new XMLSerializer()).serializeToString(svgCloudRef.current)
            const img = document.createElement("img")
            img.setAttribute("src", "data:image/svg+xml;base64," + window.btoa(decodeURIComponent(encodeURIComponent(svgData))) )
            img.onload = function() {
                ctx.current.globalCompositeOperation = 'lighten'
                ctx.current.globalAlpha = 1.0
                ctx.current.drawImage(img, 0, 0)
            }
        }
    })

    return <>
        <mesh ref={meshRef}>
            <planeGeometry ref={geometry} args={[view.width, view.height, 5, 5]}/>
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
        <Html position={[view.width * 0.5 - 1, view.height * 0.5 - 1, 0.5]}>
            <canvas ref={canvas} width={128} height={128} className="fixed top-0 right-0 border"/>
        </Html>
        <Html position={[-view.width * 0.25, -view.height * 0.25, 0.5]}>
            <svg ref={svgCloudRef} xmlns="http://www.w3.org/2000/svg" width={128} height={128} viewBox="0 0 16 16" className="fixed top-0 right-0 bg-black">
                <path ref={svgPathRef} fill={"#fff"} fillRule="evenodd"
                      d="M4.5 6.25a3.25 3.25 0 0 1 6.051-1.65a4.497 4.497 0 0 0-2.35 1.34A.75.75 0 0 0 9.3 6.96a2.99 2.99 0 0 1 2.3-.958A3 3 0 0 1 11.5 12H3.75a2.25 2.25 0 0 1-.002-4.5h.03a.75.75 0 0 0 .747-.843A3.289 3.289 0 0 1 4.5 6.25M7.75 1.5a4.75 4.75 0 0 0-4.747 4.574A3.751 3.751 0 0 0 3.75 13.5h7.75a4.5 4.5 0 0 0 .687-8.948A4.751 4.751 0 0 0 7.75 1.5"
                      clipRule="evenodd"/>
            </svg>
        </Html>
    </>
}