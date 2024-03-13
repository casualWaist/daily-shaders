'use client'

import {Canvas, extend, MaterialNode, MaterialProps, useFrame, useThree} from "@react-three/fiber"
import {Float, Html, shaderMaterial, OrbitControls, useTexture, useGLTF} from "@react-three/drei"
import { Caveat } from "next/font/google"
import fragment from './fragment.glsl'
import vertex from './vertex.glsl'
import * as THREE from 'three'
import React, {forwardRef, useEffect, useImperativeHandle, useRef} from "react"
import {GLTF} from "three-stdlib"

const caveat = Caveat({
    subsets: ['latin'],
    variable: '--font-caveat'
})

const MarchEdgeShaderImp = shaderMaterial({
    uTime: 0,
    uMouse: new THREE.Vector2(0, 0),
    uMoveVec: new THREE.Vector2(0, 0),
    uColor: new THREE.Color(0.5, 0.0, 0.025),
    uRayOrigin: new THREE.Vector3(0, 0, 0),
    uResolution: typeof window !== 'undefined' ? new THREE.Vector2(window.innerWidth, window.innerHeight) : new THREE.Vector2(1, 1),
}, vertex, fragment, (imp) => { if (imp) {
} })

extend({ MarchEdgeShaderImp })

declare global {
    namespace JSX {
        interface IntrinsicElements {
            marchEdgeShaderImp: MaterialNode<any, typeof THREE.MeshStandardMaterial>
        }
    }
}

export type MarchEdgeShaderUniforms = {
    uTime: number
    uMouse?: THREE.Vector2
    uMoveVec?: THREE.Vector2
    uRayOrigin?: THREE.Vector3
    uResolution?: THREE.Vector2
    uColor?: THREE.Color
}

type Props = MarchEdgeShaderUniforms & MaterialProps

const MarchEdgeShader = forwardRef<MarchEdgeShaderUniforms, Props>(({...props}: Props, ref) => {
    const localRef = useRef<Props>(null!)
    const { viewport, camera } = useThree((state) => state)
    const lastPointer = useRef({ x: 0, y: 0, t: 0 })
    useImperativeHandle(ref, () => localRef.current)
    useEffect(() => {
        localRef.current.uResolution = new THREE.Vector2(viewport.width - viewport.width * 0.5, viewport.height - viewport.height * 0.5)
        localRef.current.uRayOrigin = camera.position
    }, [viewport, camera])
    useFrame((state, delta) => {
        localRef.current.uTime += delta
        localRef.current.uMouse = state.pointer
        if (lastPointer.current.t > 10) {
            const last = { x: lastPointer.current.x, y: lastPointer.current.y }
            const velocity = { x: state.pointer.x - last.x, y: state.pointer.y - last.y }
            localRef.current.uMoveVec = new THREE.Vector2(velocity.x, velocity.y)
        } else {
            lastPointer.current.t += 1
        }
    })
    return <marchEdgeShaderImp key={MarchEdgeShaderImp.key} ref={localRef} attach="material" {...props} />
})
MarchEdgeShader.displayName = 'MarchEdgeShader'

export default function Page() {

    return <Canvas style={{position: "absolute", top: "0", zIndex: "-1"}}>
        <Pointer />
        <Float>
            <Html position={[0, -2, 0]}
                  center
                  transform
                  as="h1"
                  className={caveat.className}
                  scale={0.25}
            >
                <div style={{transform: 'scale(4)', textAlign: 'center', pointerEvents: 'none'}}>
                    Windows 00
                </div>
            </Html>
        </Float>
        {/*<OrbitControls/>*/}
    </Canvas>
}

function Pointer(props: JSX.IntrinsicElements['group']) {
    return <mesh>
        <planeGeometry args={[1, 1]} />
        <MarchEdgeShader uTime={0} />
    </mesh>
}

useGLTF.preload('/pointer.glb')
