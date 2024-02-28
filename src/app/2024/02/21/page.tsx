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

const ButtonShaderImp = shaderMaterial({
    uTime: 0,
    uMouse: new THREE.Vector2(0.5, 0.5),
    uTexture: new THREE.Texture(),
    uColor: new THREE.Color(0.5, 0.0, 0.025),
    uResolution: typeof window !== 'undefined' ? new THREE.Vector2(window.innerWidth, window.innerHeight) : new THREE.Vector2(1, 1),
}, vertex, fragment)

extend({ ButtonShaderImp })

declare global {
    namespace JSX {
        interface IntrinsicElements {
            buttonShaderImp: MaterialNode<any, typeof THREE.MeshStandardMaterial>
        }
    }
}

type ButtonShaderUniforms = {
    uTime?: number,
    uMouse?: THREE.Vector2,
    uTexture: THREE.Texture,
    uResolution?: THREE.Vector2
    uColor?: THREE.Color
}

type ShaderProps = ButtonShaderUniforms & MaterialProps

const ButtonShader = forwardRef<ButtonShaderUniforms, ShaderProps>(({...props}: ShaderProps, ref) => {
    const localRef = useRef<ShaderProps>(null!)
    useImperativeHandle(ref, () => localRef.current)
    useFrame((state, delta) => {
        localRef.current.uMouse = state.pointer
        localRef.current.uTime! += delta
    })
    return <buttonShaderImp key={ButtonShaderImp.key} ref={localRef} attach="material" {...props} />
})

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
                    Space Sparkles
                </div>
            </Html>
        </Float>
        <OrbitControls/>
    </Canvas>
}
function Scene() {
    const imgTexture = useTexture('/colorSpaceAlt.webp')
    const imgRef = useRef<THREE.Mesh>(null!)

    useFrame((state) => {
        if (imgRef.current) {
            imgRef.current.rotation.y = state.pointer.x / state.viewport.width
            imgRef.current.rotation.x = -state.pointer.y / state.viewport.height
        }
    })

    return <mesh ref={imgRef} position={[0, 0, 0.7]} scale={1.05}>
        <planeGeometry args={[2.5, 2.5]}/>
        <ButtonShader uTexture={imgTexture} transparent/>
    </mesh>
}
