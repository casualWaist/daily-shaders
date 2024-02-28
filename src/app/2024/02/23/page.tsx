'use client'

import {Canvas, extend, MaterialNode, MaterialProps, useFrame} from "@react-three/fiber"
import {Float, Html, shaderMaterial, OrbitControls, useTexture} from "@react-three/drei"
import { Caveat } from "next/font/google"
import fragment from './fragment.glsl'
import vertex from './vertex.glsl'
import * as THREE from 'three'
import {forwardRef, useImperativeHandle, useRef} from "react"

const caveat = Caveat({
    subsets: ['latin'],
    variable: '--font-caveat'
})

const FaceShaderImp = shaderMaterial({
    uTime: 0,
    uIndexX: 0.5,
    uIndexY: 0.5,
    uTexture: new THREE.Texture(),
    uColor: new THREE.Color(0.5, 0.0, 0.025),
    uResolution: typeof window !== 'undefined' ? new THREE.Vector2(window.innerWidth, window.innerHeight) : new THREE.Vector2(1, 1),
}, vertex, fragment)

extend({ FaceShaderImp })

declare global {
    namespace JSX {
        interface IntrinsicElements {
            faceShaderImp: MaterialNode<any, typeof THREE.MeshStandardMaterial>
        }
    }
}

export type FaceShaderUniforms = {
    uTime: number,
    uIndexX: 0 | 0.5,
    uIndexY: 0 | 0.5,
    uTexture: THREE.Texture,
    uResolution?: THREE.Vector2
    uColor?: THREE.Color
}

type Props = FaceShaderUniforms & MaterialProps

const FaceShader = forwardRef<FaceShaderUniforms, Props>(({...props}: Props, ref) => {
    const localRef = useRef<Props>(null!)
    useImperativeHandle(ref, () => localRef.current)
    useFrame((state, delta) => {
        localRef.current.uTime += delta
        localRef.current.uIndexX = state.pointer.x > 0.5 ? 0.5 : 0
        localRef.current.uIndexY = state.pointer.y > 0.5 ? 0.5 : 0
    })
    return <faceShaderImp key={FaceShaderImp.key} ref={localRef} attach="material" {...props} />
})
FaceShader.displayName = 'FaceShader'

export default function Page() {

    return <Canvas style={{position: "absolute", top: "0", zIndex: "-1"}}>
        <Scene />
        <Float>
            <Html position={[0, -2, 1]}
                  center
                  transform
                  as="h1"
                  className={caveat.className}
                  scale={0.25}
            >
                <div style={{transform: 'scale(4)', textAlign: 'center'}}>
                    Face it
                </div>
            </Html>
        </Float>
        <OrbitControls/>
    </Canvas>
}
function Scene() {
    const faceTex = useTexture('/FaceSprite.webp')
    const faceRef = useRef<THREE.Mesh>(null!)
    const faceShaderRef = useRef<FaceShaderUniforms>(null!)

    return <mesh ref={faceRef} scale={[1, -1, 1]}>
        <planeGeometry args={[1, 1]} />
        <FaceShader ref={faceShaderRef} uIndexX={0.5} uIndexY={0} uTime={0} uTexture={faceTex}/>
    </mesh>
}
