'use client'

import {Canvas, extend, MaterialNode, useFrame, useThree} from "@react-three/fiber"
import {Float, Html, shaderMaterial, OrbitControls, useTexture} from "@react-three/drei"
import { Caveat } from "next/font/google"
import fragment from './fragment.glsl'
import vertex from './vertex.glsl'
import * as THREE from 'three'
import {forwardRef, useImperativeHandle, useRef} from "react"
import CustomShaderMaterial from "three-custom-shader-material"

const caveat = Caveat({
    subsets: ['latin'],
    variable: '--font-caveat'
})

const TerrainShaderImp = shaderMaterial({
    uTime: 0,
    uTexture: new THREE.Texture(),
    uColor: new THREE.Color(0x2222ee),
    uCameraPos: new THREE.Vector3(),
    uResolution: typeof window !== 'undefined' ? new THREE.Vector2(window.innerWidth, window.innerHeight) : new THREE.Vector2(1, 1),
}, vertex, fragment)

extend({ TerrainShaderImp })

declare global {
    namespace JSX {
        interface IntrinsicElements {
            terrainShaderImp: MaterialNode<any, typeof THREE.MeshStandardMaterial>
        }
    }
}

type Props = {
    uTime?: number,
    uColor?: THREE.Color,
    uTexture?: THREE.Texture,
    uNoiseScale?: THREE.Vector4,
    uCameraPos?: THREE.Vector3,
    uResolution?: THREE.Vector2
} & JSX.IntrinsicElements['meshStandardMaterial']

const TerrainShader = forwardRef(({...props}: Props, ref) => {
    const localRef = useRef<Props>(null!)
    useImperativeHandle(ref, () => ({ shaderImp: localRef.current }))
    useFrame((state, delta) => {
        localRef.current.uTime! += delta
        localRef.current.uCameraPos = state.camera.position
    })
    return <terrainShaderImp key={TerrainShaderImp.key} ref={localRef} attach="material" {...props} />
})
TerrainShader.displayName = 'TerrainShader'

export default function Page() {
    return <Canvas style={{position: "absolute", top: "0", zIndex: "-1", backgroundColor: "#67b674"}}>
        <Scene />
        <Float>
            <Html position={[0, -1.5, 1]}
                center
                transform
                as="h1"
                className={caveat.className}
                scale={0.25}>
                <div style={{transform: 'scale(4)', color: "#52300e", textAlign: "center"}}>
                    Big Project.<br/>Long Hiatus.<br/>Picks up August 16th
                </div>
            </Html>
            <ambientLight intensity={1.5} />
        </Float>
        <OrbitControls />
    </Canvas>
}

function Scene() {
    const view = useThree((state) => state.viewport)
    const meshRef = useRef<THREE.Mesh>(null!)
    const shaderRef = useRef<MaterialNode<any, typeof THREE.MeshStandardMaterial>>(null!)

    return <mesh ref={meshRef} rotation={[-Math.PI * 0.45, 0, -Math.PI * 0.45]}>
        <planeGeometry args={[view.width * 0.5, view.width * 0.5, 500, 500]}/>
        <CustomShaderMaterial ref={shaderRef}
                              silent
                              metalness={0.0}
                              roughness={0.5}
                              fragmentShader={fragment}
                              uniforms={{ uColor: { value: new THREE.Color(0.25, 0.25, 0.75) } }}
                              vertexShader={vertex}
                              baseMaterial={THREE.MeshStandardMaterial} />
        {/*<TerrainShader ref={shaderRef}
                         uTime={0}
                         transparent
                         depthTest={false}
                         depthWrite={false}
                         uColor={new THREE.Color(0.75, 0.75, 0.75)} />*/}
    </mesh>
}
