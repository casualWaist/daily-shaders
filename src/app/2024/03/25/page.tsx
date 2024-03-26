 'use client'

import {Canvas, extend, MaterialNode, MaterialProps, useFrame, useThree} from "@react-three/fiber"
import {Float, Html, shaderMaterial, OrbitControls, useTexture} from "@react-three/drei"
import { Caveat } from "next/font/google"
import fragment from './fragment.glsl'
import vertex from './vertex.glsl'
import * as THREE from 'three'
import React, {forwardRef, useEffect, useImperativeHandle, useRef} from "react"

const caveat = Caveat({
    subsets: ['latin'],
    variable: '--font-caveat'
})

const DotImagePlusShaderImp = shaderMaterial({
    uTime: 0,
    uMouse: new THREE.Vector2(0, 0),
    uSize: new THREE.Vector2(1, 1),
    uTexture: new THREE.Texture(),
    uCanvas: null,
    uRayOrigin: new THREE.Vector3(0, 0, 0),
    uColor: new THREE.Color(0.125, 0.0, 0.5),
    uResolution: typeof window !== 'undefined' ? new THREE.Vector2(window.innerWidth, window.innerHeight) : new THREE.Vector2(1, 1),
}, vertex, fragment, (imp) => { if (imp) {
    //imp.wireframe = true
} })

extend({ DotImagePlusShaderImp })

declare global {
    namespace JSX {
        interface IntrinsicElements {
            dotImagePlusShaderImp: MaterialNode<any, typeof THREE.MeshStandardMaterial>
        }
    }
}

export type DotImagePlusShaderUniforms = {
    uTime: number
    uMouse?: THREE.Vector2
    uSize?: THREE.Vector2
    uTexture?: THREE.Texture
    uCanvas: THREE.CanvasTexture
    uRayOrigin?: THREE.Vector3
    uResolution?: THREE.Vector2
    uColor?: THREE.Color
}

type Props = DotImagePlusShaderUniforms & MaterialProps

const DotImagePlusShader = forwardRef<DotImagePlusShaderUniforms, Props>(({...props}: Props, ref) => {
    const localRef = useRef<Props>(null!)
    useImperativeHandle(ref, () => localRef.current)
    useFrame((state, delta) => {
        localRef.current.uTime += delta
        localRef.current.uMouse = state.pointer
        localRef.current.uRayOrigin = state.camera.position
    })
    return <dotImagePlusShaderImp key={DotImagePlusShaderImp.key} ref={localRef} attach="material" {...props} />
})
DotImagePlusShader.displayName = 'DotImagePlusShader'

export default function Page() {

    return <>
        <Canvas style={{position: "absolute", top: "0", zIndex: "-1"}}>
            <Scene/>
            <Float>
                <Html position={[0, -2.5, 0]}
                      center
                      transform
                      as="h1"
                      className={caveat.className}
                      scale={0.25}
                >
                    <div style={{transform: 'scale(4)', textAlign: 'center', pointerEvents: 'none'}}>
                        A Me Brush
                    </div>
                </Html>
            </Float>
            <OrbitControls/>
        </Canvas>
    </>
}

function Scene({props}: { props?: JSX.IntrinsicElements['points'] }) {
    const view = useThree((state) => state.viewport)
    const shader = useRef<DotImagePlusShaderUniforms>(null!)
    const image = useTexture('/Headshot.webp')
    const canvas = useRef<HTMLCanvasElement>(null!)
    const cTexture = useRef<THREE.CanvasTexture>(null!)
    const ctx = useRef<CanvasRenderingContext2D>(null!)
    const transPlane = useRef<THREE.Mesh>(null!)
    const lastMouse = useRef(new THREE.Vector2(0.5, 0.5))

    const disImage = useRef(new Image())
    disImage.current.src = '/1.png'

    useEffect(() => {

        if (canvas.current) {
            ctx.current = canvas.current.getContext('2d')!
            ctx.current.fillRect(0, 0, 128, 128)
            cTexture.current = new THREE.CanvasTexture(canvas.current)
            shader.current.uCanvas = cTexture.current
        }

    }, [])

    useEffect(() => {
        shader.current.uResolution = new THREE.Vector2(window.innerWidth, window.innerHeight)
        transPlane.current.geometry = new THREE.PlaneGeometry(view.width, view.height)
    }, [view])

    let update = false
    useFrame((state) => {
        if (disImage.current){
            state.raycaster.intersectObject(transPlane.current).forEach((inter) => {
                if (lastMouse.current.x !== inter.uv!.x || lastMouse.current.y !== inter.uv!.y) {
                    update = true
                    lastMouse.current.x = inter.uv!.x * 128 - 28
                    lastMouse.current.y = (1.0 - inter.uv!.y) * 128 - 28
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
            /*ctx.current.globalCompositeOperation = 'source-over'
            ctx.current.globalAlpha = 0.05
            ctx.current.fillRect(0, 0, 128, 128)*/
            cTexture.current.needsUpdate = true
        }
    })

    return <>
        <points {...props}>
            <planeGeometry args={[view.height, view.height, 120, 120]}/>
            <DotImagePlusShader
                ref={shader}
                uTime={0}
                uTexture={image}
                uCanvas={cTexture.current}
            />
        </points>
        <mesh ref={transPlane}>
            <planeGeometry args={[view.width, view.height]}/>
            <meshBasicMaterial color={'#000'} transparent opacity={0}/>
        </mesh>
        <Html position={[view.width * 0.5 - 1, view.height * 0.5 - 1, 0.5]}>
            <canvas ref={canvas} width={128} height={128} className="fixed top-0 right-0 border"/>
        </Html>
    </>
}
