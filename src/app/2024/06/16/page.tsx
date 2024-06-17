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

const OfFluidShaderImp = shaderMaterial({
    uTime: 0,
    uMouse: new THREE.Vector2(0, 0),
    uSize: new THREE.Vector2(1, 1),
    uColor: new THREE.Color(0.125, 0.0, 0.5),
    uResolution: typeof window !== 'undefined' ? new THREE.Vector2(window.innerWidth, window.innerHeight) : new THREE.Vector2(1, 1),
}, vertex, fragment, (imp) => { if (imp) {
} })

extend({ OfFluidShaderImp })

declare global {
    namespace JSX {
        interface IntrinsicElements {
            ofFluidShaderImp: MaterialNode<any, typeof THREE.MeshStandardMaterial>
        }
    }
}

export type OfFluidShaderUniforms = {
    uTime: number
    uMouse?: THREE.Vector2
    uSize?: THREE.Vector2
    uTexture?: THREE.Texture
    uResolution?: THREE.Vector2
    uColor?: THREE.Color
}

type Props = OfFluidShaderUniforms & MaterialProps

const OfFluidShader = forwardRef<OfFluidShaderUniforms, Props>(({...props}: Props, ref) => {
    const localRef = useRef<Props>(null!)
    useImperativeHandle(ref, () => localRef.current)
    useFrame((state, delta) => {
        localRef.current.uTime += delta
        localRef.current.uMouse = state.pointer
    })
    return <ofFluidShaderImp key={OfFluidShaderImp.key} ref={localRef} attach="material" {...props} />
})
OfFluidShader.displayName = 'OfFluidShader'

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
                        Planet Glass
                    </div>
                </Html>
            </Float>
            <OrbitControls/>
        </Canvas>
    </>
}

function Scene({props}: {props?: JSX.IntrinsicElements['mesh']}) {
    const view = useThree((state) => state.viewport)
    const pointsRef = useRef<THREE.BufferAttribute>(null!)
    const count = 100
    let points = new Float32Array(count * 2)

    function randomize(array: Float32Array) {
        for (let i = 0; i < count; i++) {
            array[i * 2] = (Math.random() - 0.5) * view.width
            array[i * 2 + 1] = (Math.random() - 0.5) * view.height
        }
        return array
    }
    points = randomize(points)

    let frame = 18
    let check = 0
    useFrame(() => {
        if (frame === check){
            const nextPoints = randomize(new Float32Array(count * 2))
            check = 0
            frame = Math.floor(Math.random() * 10) + 10
            pointsRef.current.array = nextPoints
            pointsRef.current.needsUpdate = true
        } else {
            check++
        }
    })
    return <mesh position={[0, 0, 0]} {...props}>
        <planeGeometry args={[view.width, view.height, 9, 9]}>
            <bufferAttribute ref={pointsRef} attach="attributes-points" count={count} array={points} itemSize={2} />
        </planeGeometry>
        <OfFluidShader
            uTime={0}
            uSize={new THREE.Vector2(view.width, view.height)}
            transparent
        />
    </mesh>
}
