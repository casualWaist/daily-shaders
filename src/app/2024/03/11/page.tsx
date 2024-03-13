'use client'

import {Canvas, extend, MaterialNode, MaterialProps, useFrame, useThree} from "@react-three/fiber"
import {Float, Html, shaderMaterial, OrbitControls, useTexture} from "@react-three/drei"
import { Caveat } from "next/font/google"
import fragment from './fragment.glsl'
import vertex from './vertex.glsl'
import * as THREE from 'three'
import {forwardRef, useEffect, useImperativeHandle, useRef} from "react"

const caveat = Caveat({
    subsets: ['latin'],
    variable: '--font-caveat'
})

const PrismShaderImp = shaderMaterial({
    uTime: 0,
    uMouse: new THREE.Vector2(0, 0),
    uTexture: new THREE.Texture(),
    uRayOrigin: new THREE.Vector3(0, 0, 0),
    uColor: new THREE.Color(0.5, 0.0, 0.025),
    uResolution: typeof window !== 'undefined' ? new THREE.Vector2(window.innerWidth, window.innerHeight) : new THREE.Vector2(1, 1),
}, vertex, fragment)

extend({ PrismShaderImp })

declare global {
    namespace JSX {
        interface IntrinsicElements {
            prismShaderImp: MaterialNode<any, typeof THREE.PointsMaterial>
        }
    }
}

export type PrismShaderUniforms = {
    uTime: number,
    uMouse?: THREE.Vector2,
    uTexture: THREE.Texture,
    uRayOrigin?: THREE.Vector3,
    uResolution?: THREE.Vector2
    uColor?: THREE.Color
}

type Props = PrismShaderUniforms & MaterialProps

const PrismShader = forwardRef<PrismShaderUniforms, Props>(
    ({...props}: Props, ref) => {
    const localRef = useRef<Props>(null!)
    useImperativeHandle(ref, () => localRef.current)

    useFrame((state, delta) => {
        localRef.current.uTime += delta
        localRef.current.uMouse = state.pointer
    })

    return <prismShaderImp key={PrismShaderImp.key} ref={localRef} attach="material" {...props} />
})
PrismShader.displayName = 'PrismShader'

export default function Page() {

    return <Canvas style={{position: "absolute", top: "0", zIndex: "-1"}} className="bg-slate-950">
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
                    Night Lights
                </div>
            </Html>
        </Float>
        <OrbitControls/>
    </Canvas>
}
function Scene() {
    const faceTex = useTexture('/4.png')
    faceTex.flipY = false
    const faceRef = useRef<THREE.Mesh>(null!)
    const faceShaderRef = useRef<PrismShaderUniforms>(null!)
    const view = useThree((state) => state.viewport)

    return <mesh ref={faceRef}>
        <planeGeometry args={[view.width, view.height]} />
        <PrismShader
            ref={faceShaderRef}
            uTime={0}
            uColor={new THREE.Color(0.3, 0.7, 1)}
            uTexture={faceTex}
        />
    </mesh>
}
