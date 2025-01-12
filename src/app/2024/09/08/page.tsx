'use client'

import {Canvas, extend, MaterialNode, MaterialProps, useFrame} from "@react-three/fiber"
import {
    Float,
    Html,
    OrbitControls,
    useGLTF,
    Outlines, Instances, Instance, shaderMaterial
} from "@react-three/drei"
import { Caveat } from "next/font/google"
import * as THREE from 'three'
import {GLTF} from "three-stdlib"
import React, {forwardRef, useImperativeHandle, useRef} from "react"
import vertex from "@/app/2024/09/08/vertex.glsl"
import fragment from "@/app/2024/09/08/fragment.glsl"

const caveat = Caveat({
    subsets: ['latin'],
    variable: '--font-caveat'
})

const RotateCoinShaderImp = shaderMaterial({
    uTime: 0,
    uMouse: new THREE.Vector2(0, 0),
    uSize: new THREE.Vector2(1, 1),
    uRayOrigin: new THREE.Vector3(0, 0, 0),
    uColor: new THREE.Color(0.125, 0.0, 0.5),
    uResolution: typeof window !== 'undefined' ? new THREE.Vector2(window.innerWidth, window.innerHeight) : new THREE.Vector2(1, 1),
}, vertex, fragment, (imp) => { if (imp) {
    //imp.wireframe = true
} })

extend({ RotateCoinShaderImp })

declare global {
    namespace JSX {
        interface IntrinsicElements {
            rotateCoinShaderImp: MaterialNode<any, typeof THREE.MeshStandardMaterial>
        }
    }
}

export type RotateCoinShaderUniforms = {
    uTime?: number
    uMouse?: THREE.Vector2
    uSize?: THREE.Vector2
    uRayOrigin?: THREE.Vector3
    uResolution?: THREE.Vector2
    uColor?: THREE.Color
}

type Props = RotateCoinShaderUniforms & MaterialProps

const RotateCoinShader = forwardRef<RotateCoinShaderUniforms, Props>(({...props}: Props, ref) => {
    const localRef = useRef<Props>(null!)
    useImperativeHandle(ref, () => localRef.current)
    useFrame((state, delta) => {
        localRef.current.uTime! += delta
        localRef.current.uMouse = state.pointer
        localRef.current.uRayOrigin = state.camera.position
    })
    return <rotateCoinShaderImp key={RotateCoinShaderImp.key} ref={localRef} attach="material" {...props} />
})
RotateCoinShader.displayName = 'RotateCoinShader'

export default function Page() {

    return <Canvas style={{position: "absolute", top: "0", zIndex: "-1"}}>
        <Coin/>
        <directionalLight intensity={15.5} position={[1, 10, 1]} />
        <directionalLight intensity={4.5} position={[3, -5, -4]} color={'#bd9962'} />
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
        <OrbitControls/>
    </Canvas>
}

type GLTFResult = GLTF & {
    nodes: {
        Cylinder: THREE.Mesh
    }
    materials: {}
}

function Coin() {
    const { nodes } = useGLTF('/coin.glb') as GLTFResult
    return <Instances geometry={nodes.Cylinder.geometry} dispose={null}>
        {/*<RotateCoinShader vertexColors/>*/}
        <meshToonMaterial color={'#bd9962'} vertexColors/>
        {/*<Outlines color={"#887000"} thickness={0.01} angle={1.75}/>*/}
        {Array.from({length: 100}, (_, i) => (
            <Instance key={i} position={[(i % 10) * 2, 0, -Math.floor(i / 10) * 2]}/>
        ))}
    </Instances>

}

useGLTF.preload('/coin.glb')
