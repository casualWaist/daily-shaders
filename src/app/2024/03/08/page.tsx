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

const PointerShaderImp = shaderMaterial({
    uTime: 0,
    uMouse: new THREE.Vector2(0, 0),
    uMoveVec: new THREE.Vector2(0, 0),
    uColor: new THREE.Color(0.5, 0.0, 0.025),
    uRayOrigin: new THREE.Vector3(0, 0, 0),
    uResolution: typeof window !== 'undefined' ? new THREE.Vector2(window.innerWidth, window.innerHeight) : new THREE.Vector2(1, 1),
}, vertex, fragment, (imp) => { if (imp) {
} })

extend({ PointerShaderImp })

declare global {
    namespace JSX {
        interface IntrinsicElements {
            pointerShaderImp: MaterialNode<any, typeof THREE.MeshStandardMaterial>
        }
    }
}

export type PointerShaderUniforms = {
    uTime: number
    uMouse?: THREE.Vector2
    uMoveVec?: THREE.Vector2
    uRayOrigin?: THREE.Vector3
    uResolution?: THREE.Vector2
    uColor?: THREE.Color
}

type Props = PointerShaderUniforms & MaterialProps

const PointerShader = forwardRef<PointerShaderUniforms, Props>(({...props}: Props, ref) => {
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
    return <pointerShaderImp key={PointerShaderImp.key} ref={localRef} attach="material" {...props} />
})
PointerShader.displayName = 'PointerShader'

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
                    Pointer Light
                </div>
            </Html>
        </Float>
        {/*<OrbitControls/>*/}
    </Canvas>
}

type GLTFResult = GLTF & {
    nodes: {
        Cube_1: THREE.Mesh
        Cube_2: THREE.Mesh
    }
    materials: {
        Material: THREE.MeshStandardMaterial
        ['Material.001']: THREE.MeshStandardMaterial
    }
}

function Pointer(props: JSX.IntrinsicElements['group']) {
    const { nodes, materials } = useGLTF('/pointer.glb') as GLTFResult
    return <group {...props} dispose={null} scale={0.1} rotation={[Math.PI * 0.45, 0, 0]}>

        <mesh geometry={nodes.Cube_1.geometry}>
            <PointerShader uTime={0} uColor={new THREE.Color(1, 1, 1)} />
        </mesh>

        {/* Outline */}
        <mesh geometry={nodes.Cube_2.geometry}>
            <PointerShader uTime={0} uColor={new THREE.Color(0, 0, 0)} />
        </mesh>

    </group>
}

useGLTF.preload('/pointer.glb')
