'use client'

import {Canvas, extend, MaterialNode, MaterialProps, useFrame, useThree} from "@react-three/fiber"
import {Float, Html, shaderMaterial, OrbitControls, useGLTF} from "@react-three/drei"
import { Caveat } from "next/font/google"
import fragment from './fragment.glsl'
import vertex from './vertex.glsl'
import * as THREE from 'three'
import React, {forwardRef, useEffect, useImperativeHandle, useRef} from "react"

const caveat = Caveat({
    subsets: ['latin'],
    variable: '--font-caveat'
})

const BooleanMinusShaderImp = shaderMaterial({
    uTime: 0,
    uMouse: new THREE.Vector2(0, 0),
    uBox: new THREE.Vector3(3, 2, 0.5),
    uBoxPos: new THREE.Vector3(0, 0, 0),
    uSpherePos: new THREE.Vector3(1, 1, 0),
    uSphereRadius: 1,
    uColor: new THREE.Color(0.5, 0.0, 0.025),
    uRayOrigin: new THREE.Vector3(0, 0, 0),
    uResolution: typeof window !== 'undefined' ? new THREE.Vector2(window.innerWidth, window.innerHeight) : new THREE.Vector2(1, 1),
}, vertex, fragment, (imp) => { if (imp) {
} })

extend({ BooleanMinusShaderImp })

declare global {
    namespace JSX {
        interface IntrinsicElements {
            booleanMinusShaderImp: MaterialNode<any, typeof THREE.MeshStandardMaterial>
        }
    }
}

export type BooleanMinusShaderUniforms = {
    uTime: number
    uMouse?: THREE.Vector2
    uBox?: THREE.Vector3
    uBoxPos?: THREE.Vector3
    uSpherePos?: THREE.Vector3
    uSphereRadius?: number
    uRayOrigin?: THREE.Vector3
    uResolution?: THREE.Vector2
    uColor?: THREE.Color
}

type Props = BooleanMinusShaderUniforms & MaterialProps

const BooleanMinusShader = forwardRef<BooleanMinusShaderUniforms, Props>(({...props}: Props, ref) => {
    const localRef = useRef<Props>(null!)
    const { viewport, camera } = useThree((state) => state)
    useImperativeHandle(ref, () => localRef.current)

    useEffect(() => {
        localRef.current.uResolution = new THREE.Vector2(viewport.width - viewport.width * 0.5, viewport.height - viewport.height * 0.5)
        localRef.current.uRayOrigin = camera.position
    }, [viewport, camera])

    useFrame((state, delta) => {
        localRef.current.uTime += delta
        localRef.current.uMouse = state.pointer
    })
    return <booleanMinusShaderImp key={BooleanMinusShaderImp.key} ref={localRef} attach="material" {...props} />
})
BooleanMinusShader.displayName = 'BooleanMinusShader'

export default function Page() {

    return <Canvas style={{position: "absolute", top: "0", zIndex: "-1"}}>
        <Scene />
        <Float>
            <Html position={[0, -2, 0]}
                  center
                  transform
                  as="h1"
                  className={caveat.className}
                  scale={0.25}
            >
                <div style={{transform: 'scale(4)', textAlign: 'center', pointerEvents: 'none'}}>
                    Box - Sphere =<br/>
                    Holy Box
                </div>
            </Html>
        </Float>
        <OrbitControls/>
    </Canvas>
}

function Scene(props: JSX.IntrinsicElements['mesh']) {
    const view = useThree((state) => state.viewport)
    const shader = useRef<BooleanMinusShaderUniforms>(null!)

    useEffect(() => {
        shader.current.uResolution = new THREE.Vector2(window.innerWidth, window.innerHeight)
    }, [view])

    return <mesh {...props}>
        <planeGeometry args={[view.width, view.height]} />
        <BooleanMinusShader ref={shader} uTime={0} />
    </mesh>
}

useGLTF.preload('/pointer.glb')
