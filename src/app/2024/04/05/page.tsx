'use client'

import {Canvas, useFrame, useThree} from "@react-three/fiber"
import {Environment, Float, Html, OrbitControls} from "@react-three/drei"
import CustomShaderMaterial from "three-custom-shader-material"
import { Caveat } from "next/font/google"
import fragment from './fragment.glsl'
import vertex from './vertex.glsl'
import * as THREE from 'three'
import {useMemo, useRef} from "react"
import {mergeVertices} from "three-stdlib"

const caveat = Caveat({
    subsets: ['latin'],
    variable: '--font-caveat'
})

export default function Page() {

    return <Canvas style={{position: "absolute", top: "0", zIndex: "-1"}} shadows="basic">
        <Scene/>
        <directionalLight position={[0.5, 2, 2]} castShadow shadow-mapSize-width={1024} shadow-mapSize-height={1024}/>
        <Environment preset="city" />
        <Float>
            <Html position={[0, -1.5, 1]}
                  center
                  transform
                  as="h1"
                  className={caveat.className}
                  scale={0.25}
            >
                <div style={{transform: 'scale(4)', textAlign: "center", color: "#252406"}}>
                    Detour →
                </div>
            </Html>
        </Float>
        <color attach="background" args={['#b8ff50']}/>
        <OrbitControls/>
    </Canvas>
}

function Scene() {
    const view = useThree(({viewport}) => viewport)
    const meshRef = useRef<THREE.Mesh>(null!)
    const shaderRef = useRef<THREE.ShaderMaterial>(null!)
    const depthRef = useRef<THREE.ShaderMaterial>(null!)
    const meshDRef = useRef<THREE.Mesh>(null!)
    const shaderDRef = useRef<THREE.ShaderMaterial>(null!)
    const depthDRef = useRef<THREE.ShaderMaterial>(null!)
    const geo = useMemo(() => {
        const geo = new THREE.PlaneGeometry(view.width, view.height, 128, 128)
        const merged = mergeVertices(geo)
        merged.computeTangents()
        return merged
    }, [])

    useFrame((_, delta) => {
        shaderRef.current.uniforms.uTime.value += delta
        depthRef.current.uniforms.uTime.value += delta
        shaderDRef.current.uniforms.uTime.value += delta
        depthDRef.current.uniforms.uTime.value += delta
    })

    return <>
        <mesh ref={meshRef} castShadow geometry={geo}>
            <CustomShaderMaterial
                attach="customDepthMaterial"
                ref={depthRef}
                fragmentShader={fragment}
                vertexShader={vertex}
                uniforms={{
                    uXorY: {value: 0},
                    uTime: {value: 0},
                }}
                baseMaterial={THREE.MeshDepthMaterial}
                silent={true}
                depthPacking={THREE.RGBADepthPacking}/>
            <CustomShaderMaterial
                ref={shaderRef}
                baseMaterial={THREE.MeshPhysicalMaterial}
                fragmentShader={fragment}
                vertexShader={vertex}
                uniforms={{
                    uXorY: {value: 0},
                    uTime: {value: 0},
                }}
                side={THREE.DoubleSide}
                metalness={0}
                roughness={1}
                color={"#ffc400"}
                transmission={0}
                ior={1.4}
                thickness={0.5}
                wireframe={false}
                silent
            />
        </mesh>
        <mesh ref={meshDRef} position={[0, 0, -0.05]} receiveShadow geometry={geo}>
            <CustomShaderMaterial
                attach="customDepthMaterial"
                ref={depthDRef}
                fragmentShader={fragment}
                vertexShader={vertex}
                uniforms={{
                    uXorY: {value: 1},
                    uTime: {value: 0},
                }}
                baseMaterial={THREE.MeshDepthMaterial}
                silent={true}
                depthPacking={THREE.RGBADepthPacking}/>
            <CustomShaderMaterial
                ref={shaderDRef}
                baseMaterial={THREE.MeshPhysicalMaterial}
                fragmentShader={fragment}
                vertexShader={vertex}
                uniforms={{
                    uXorY: {value: 1},
                    uTime: {value: 0},
                }}
                side={THREE.DoubleSide}
                metalness={0}
                roughness={1}
                color={"#ffc400"}
                transmission={0}
                ior={1.4}
                thickness={0.5}
                wireframe={false}
                silent
            />
        </mesh>
    </>
}
