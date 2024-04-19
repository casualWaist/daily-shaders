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

const ShagShaderImp = shaderMaterial({
    uTime: 0,
    uMouse: new THREE.Vector2(0, 0),
    uPoint: new THREE.Vector2(0, 0),
    uSize: new THREE.Vector2(1, 1),
    uColor: new THREE.Color(0.83, 0.74, 0.55),
    uResolution: typeof window !== 'undefined' ? new THREE.Vector2(window.innerWidth, window.innerHeight) : new THREE.Vector2(1, 1),
}, vertex, fragment, (imp) => { if (imp) {
} })

extend({ ShagShaderImp })

declare global {
    namespace JSX {
        interface IntrinsicElements {
            shagShaderImp: MaterialNode<any, typeof THREE.MeshStandardMaterial>
        }
    }
}

export type ShagShaderUniforms = {
    uTime: number
    uMouse?: THREE.Vector2
    uPoint?: THREE.Vector2
    uSize?: THREE.Vector2
    uTexture?: THREE.Texture
    uResolution?: THREE.Vector2
    uColor?: THREE.Color | string
}

type Props = ShagShaderUniforms & MaterialProps

const ShagShader = forwardRef<ShagShaderUniforms, Props>(({...props}: Props, ref) => {
    const localRef = useRef<Props>(null!)
    useImperativeHandle(ref, () => localRef.current)
    useFrame((state, delta) => {
        localRef.current.uTime += delta
        localRef.current.uMouse = state.pointer
    })
    return <shagShaderImp key={ShagShaderImp.key} ref={localRef} attach="material" {...props} />
})
ShagShader.displayName = 'ShagShader'

export default function Page() {

    return <>
        <Canvas style={{position: "absolute", top: "0", zIndex: "-1", backgroundColor: '#69032b'}}>
            <Scene />
            <Float>
                <Html position={[0, -2.5, 0]}
                      center
                      transform
                      as="h1"
                      className={caveat.className}
                      scale={0.25}
                >
                    <div style={{transform: 'scale(4)', textAlign: 'center', pointerEvents: 'none', color: '#d7aa7d'}}>
                        Okay.<br/>Vacation Over
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
    const shaderRef = useRef<ShagShaderUniforms>(null!)

    useFrame((state) => {
        const rays = state.raycaster.intersectObject(meshRef.current)
        if (rays.length > 0){
            shaderRef.current.uPoint = rays[0].uv
        }
    })

    return <mesh ref={meshRef} position={[0, 0, 0]} {...props}>
        <torusKnotGeometry args={[2, 0.5, 128, 128]}/>
        <ShagShader
            ref={shaderRef}
            uTime={0}
            uColor={'#d7aa7d'}
            uSize={new THREE.Vector2(view.width, view.height)}
        />
    </mesh>
}
