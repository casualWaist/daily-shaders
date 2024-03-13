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

const SplitFaceShaderImp = shaderMaterial({
    uTime: 0,
    uProgress: 0,
    uSize: 50,
    uIndexX: 0.5,
    uIndexY: 0.5,
    uRayOrigin: new THREE.Vector3(0, 0, 0),
    uTexture: new THREE.Texture(),
    uColor: new THREE.Color(0.5, 0.0, 0.025),
    uResolution: typeof window !== 'undefined' ? new THREE.Vector2(window.innerWidth, window.innerHeight) : new THREE.Vector2(1, 1),
}, vertex, fragment)

extend({ SplitFaceShaderImp })

declare global {
    namespace JSX {
        interface IntrinsicElements {
            splitFaceShaderImp: MaterialNode<any, typeof THREE.MeshStandardMaterial>
        }
    }
}

export type SplitFaceShaderUniforms = {
    uTime: number,
    uProgress: number,
    uSize: number,
    uIndexX?: 0 | 0.5,
    uIndexY?: 0 | 0.5,
    uRayOrigin?: THREE.Vector3,
    uTexture: THREE.Texture,
    uResolution?: THREE.Vector2
    uColor?: THREE.Color
}

type Props = SplitFaceShaderUniforms & MaterialProps

const SplitFaceShader = forwardRef<SplitFaceShaderUniforms, Props>(({...props}: Props, ref) => {
    const localRef = useRef<Props>(null!)
    useImperativeHandle(ref, () => localRef.current)
    useFrame((state, delta) => {
        localRef.current.uTime += delta
        localRef.current.uRayOrigin = state.camera.position
        localRef.current.uIndexX = state.pointer.x > 0 ? 0.5 : 0
        localRef.current.uIndexY = state.pointer.y > 0 ? 0.5 : 0
    })
    return <splitFaceShaderImp key={SplitFaceShaderImp.key} ref={localRef} attach="material" {...props} />
})
SplitFaceShader.displayName = 'SplitFaceShader'

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
                    Multi-Face
                </div>
            </Html>
        </Float>
        <OrbitControls/>
    </Canvas>
}
function Scene() {
    const faceTex = useTexture('/FaceSprite.webp')
    faceTex.flipY = false
    const pointsRef = useRef<THREE.Points>(null!)
    const faceShaderRef = useRef<SplitFaceShaderUniforms>(null!)
    const count = 500
    const cubeN = 1
    const positions = new Float32Array(count * 3)
    const sizes = new Float32Array(count)
    const times = new Float32Array(count)
    for (let i = 0; i < count; i++) {

        const i3 = i * 3
        const dir = ['x', 'y', 'z'][i % 3]

        const randX = Math.random() * cubeN * 2 - cubeN
        const randY = Math.random() * cubeN * 2 - cubeN
        const randZ = Math.random() * cubeN * 2 - cubeN
        switch (dir) {
            case 'x':
                positions[i3] = i > count * 0.5 ? cubeN : -cubeN
                positions[i3 + 1] = randY
                positions[i3 + 2] = randZ
                break
            case 'y':
                positions[i3] = randX
                positions[i3 + 1] = i > count * 0.5 ? cubeN : -cubeN
                positions[i3 + 2] = randZ
                break
            case 'z':
                positions[i3] = randX
                positions[i3 + 1] = randY
                positions[i3 + 2] = i > count * 0.5 ? cubeN : -cubeN
                break
        }

        sizes[i] = Math.random() * 0.25 + 0.25
        times[i] = 1 + Math.random()
    }

    return <points ref={pointsRef}>
        <bufferGeometry>
            <bufferAttribute attach="attributes-position" count={count} array={positions} itemSize={3}/>
            <bufferAttribute attach="attributes-aSize" count={count} array={sizes} itemSize={1}/>
            <bufferAttribute attach="attributes-aTime" count={count} array={times} itemSize={1}/>
        </bufferGeometry>
        <SplitFaceShader
            ref={faceShaderRef}
            uSize={0.5}
            uTime={0}
            uProgress={0}
            uColor={new THREE.Color(0.3, 0.7, 1)}
            transparent
            depthTest={false}
            blending={THREE.AdditiveBlending}
            uTexture={faceTex}
        />
    </points>
}
