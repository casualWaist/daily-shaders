'use client'

import {Canvas, extend, MaterialNode, MaterialProps, useFrame, useThree} from "@react-three/fiber"
import {Float, Html, shaderMaterial, OrbitControls, useTexture} from "@react-three/drei"
import { Caveat } from "next/font/google"
import fragment from './fragment.glsl'
import vertex from './vertex.glsl'
import * as THREE from 'three'
import React, {forwardRef, useImperativeHandle, useRef} from "react"

const caveat = Caveat({
    subsets: ['latin'],
    variable: '--font-caveat'
})

const AcidTripShaderImp = shaderMaterial({
    uTime: 0,
    uMouse: new THREE.Vector2(0, 0),
    uSize: new THREE.Vector2(1, 1),
    uTexture: new THREE.Texture(),
    uNoise: new THREE.Texture(),
    uColor: new THREE.Color(0.125, 0.0, 0.5),
    uResolution: typeof window !== 'undefined' ? new THREE.Vector2(window.innerWidth, window.innerHeight) : new THREE.Vector2(1, 1),
}, vertex, fragment, (imp) => { if (imp) {
    //imp.wireframe = true
} })

extend({ AcidTripShaderImp })

declare global {
    namespace JSX {
        interface IntrinsicElements {
            acidTripShaderImp: MaterialNode<any, typeof THREE.MeshStandardMaterial>
        }
    }
}

export type AcidTripShaderUniforms = {
    uTime: number
    uMouse?: THREE.Vector2
    uSize?: THREE.Vector2
    uTexture?: THREE.Texture
    uNoise?: THREE.Texture
    uResolution?: THREE.Vector2
    uColor?: THREE.Color
}

type Props = AcidTripShaderUniforms & MaterialProps

const AcidTripShader = forwardRef<AcidTripShaderUniforms, Props>(({...props}: Props, ref) => {
    const localRef = useRef<Props>(null!)
    useImperativeHandle(ref, () => localRef.current)
    useFrame((state, delta) => {
        localRef.current.uTime += delta
        localRef.current.uMouse = state.pointer
    })
    return <acidTripShaderImp key={AcidTripShaderImp.key} ref={localRef} attach="material" {...props} />
})
AcidTripShader.displayName = 'AcidTripShader'

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
                    <div style={{transform: 'scale(4)', textAlign: 'center', pointerEvents: 'none', color: "white"}}>
                        Simple Acid
                    </div>
                </Html>
            </Float>
            <OrbitControls/>
        </Canvas>
    </>
}

function Scene() {
    const view = useThree((state) => state.viewport)
    const mesh = useRef<THREE.Mesh>(null!)
    const texture = useTexture('/bubbles.png')
    texture.wrapT = THREE.RepeatWrapping
    texture.wrapS = THREE.RepeatWrapping
    const noise = useTexture('/noise.png')
    noise.wrapT = THREE.RepeatWrapping
    noise.wrapS = THREE.RepeatWrapping

    return <>
        <mesh ref={mesh}>
            <planeGeometry args={[view.width, view.height, 9, 9]}/>
            <AcidTripShader
                uTime={0}
                uSize={new THREE.Vector2(view.width, view.height)}
                uTexture={texture}
                uNoise={noise}
            />
        </mesh>
    </>
}