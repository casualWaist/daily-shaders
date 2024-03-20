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

const DepthShaderImp = shaderMaterial({
    uTime: 0,
    uMouse: new THREE.Vector2(0, 0),
    uSize: new THREE.Vector2(1, 1),
    uRayOrigin: new THREE.Vector3(0, 0, 0),
    uColor: new THREE.Color(0.125, 0.0, 0.5),
    uResolution: typeof window !== 'undefined' ? new THREE.Vector2(window.innerWidth, window.innerHeight) : new THREE.Vector2(1, 1),
}, vertex, fragment, (imp) => { if (imp) {
    //imp.wireframe = true
} })

extend({ DepthShaderImp })

declare global {
    namespace JSX {
        interface IntrinsicElements {
            depthShaderImp: MaterialNode<any, typeof THREE.MeshStandardMaterial>
        }
    }
}

export type DepthShaderUniforms = {
    uTime: number
    uMouse?: THREE.Vector2
    uSize?: THREE.Vector2
    uRayOrigin?: THREE.Vector3
    uResolution?: THREE.Vector2
    uColor?: THREE.Color
}

type Props = DepthShaderUniforms & MaterialProps

const DepthShader = forwardRef<DepthShaderUniforms, Props>(({...props}: Props, ref) => {
    const localRef = useRef<Props>(null!)
    useImperativeHandle(ref, () => localRef.current)
    useFrame((state, delta) => {
        localRef.current.uTime += delta
        localRef.current.uMouse = state.pointer
        localRef.current.uRayOrigin = state.camera.position
    })
    return <depthShaderImp key={DepthShaderImp.key} ref={localRef} attach="material" {...props} />
})
DepthShader.displayName = 'DepthShader'

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
                        The Gates
                    </div>
                </Html>
            </Float>
            <OrbitControls/>
        </Canvas>
    </>
}

function Scene({props}: {props?: JSX.IntrinsicElements['mesh']}) {
    const view = useThree((state) => state.viewport)

    return <>
        <mesh {...props}>
            <planeGeometry args={[view.width, view.height, 9, 9]}/>
            <DepthShader
                uTime={0}
                uSize={new THREE.Vector2(view.width, view.height)}
            />
        </mesh>
    </>
}
