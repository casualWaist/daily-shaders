'use client'

import {Canvas, extend, MaterialNode, MaterialProps, useFrame, useThree} from "@react-three/fiber"
import {Html, shaderMaterial, OrbitControls, useTexture, useGLTF} from "@react-three/drei"
import fragment from './fragment.glsl'
import vertex from './vertex.glsl'
import * as THREE from 'three'
import {Climate_Crisis} from "next/font/google"
import React, {forwardRef, useEffect, useImperativeHandle, useRef} from "react"
import {twMerge} from "tailwind-merge"
import {GLTF} from "three-stdlib"

const climateCrisis = Climate_Crisis({ weight: "variable", subsets: ['latin'] })

const SparkleShaderImp = shaderMaterial({
    uTime: 0,
    uProgress: 0,
    uSize: 50,
    uTexture: new THREE.Texture(),
    uRayOrigin: new THREE.Vector3(0, 0, 0),
    uColor: new THREE.Color(0.5, 0.0, 0.025),
    uResolution: typeof window !== 'undefined' ? new THREE.Vector2(window.innerWidth, window.innerHeight) : new THREE.Vector2(1, 1),
}, vertex, fragment)

extend({ SparkleShaderImp })

declare global {
    namespace JSX {
        interface IntrinsicElements {
            sparkleShaderImp: MaterialNode<any, typeof THREE.PointsMaterial>
        }
    }
}

export type SparkleShaderUniforms = {
    uTime: number,
    uProgress: number,
    uSize: number,
    uTexture: THREE.Texture,
    uRayOrigin?: THREE.Vector3,
    uResolution?: THREE.Vector2
    uColor?: THREE.Color
}

type Props = SparkleShaderUniforms & MaterialProps

const SparkleShader = forwardRef<SparkleShaderUniforms, Props>(
    ({...props}: Props, ref) => {
    const localRef = useRef<Props>(null!)
    const size = useThree((state) => state.size)
    useImperativeHandle(ref, () => localRef.current)

    useEffect(() => {
        localRef.current.uResolution = new THREE.Vector2(size.width, size.height)
    }, [size])

    useFrame((state, delta) => {
        localRef.current.uTime += delta
        localRef.current.uRayOrigin = state.camera.position
        if (localRef.current && localRef.current.uProgress < 1) localRef.current.uProgress += delta
    })

    return <sparkleShaderImp key={SparkleShaderImp.key} ref={localRef} attach="material" {...props} />
})
SparkleShader.displayName = 'SparkleShader'

export default function Page() {

    return <Canvas style={{position: "absolute", top: "0", zIndex: "-1"}} className="bg-gradient-to-b from-purple-600 to-blue-600">
        <Scene />
        <Html position={[0, -1, 0]}
              center
              transform
              as="h1"
              className={twMerge("text-4xl text-white", climateCrisis.className)}
              scale={0.25}
        >
            <div style={{transform: 'scale(4, -4)', textAlign: 'center', textShadow: `0px -30px 0.1em ${'#A855F755'}`}}
                 className="absolute top-[15%] text-transparent">
                WEBSITE
            </div>
            <div style={{transform: 'scale(4)', textAlign: 'center', backgroundImage: `radial-gradient(circle at 60px -160px, ${'#93C5FD'} 34%, ${'#A855F7'} 84%)`}}
                 className="absolute top-[15%] text-transparent bg-clip-text">
                WEBSITE
            </div>
        </Html>
        <Pointer position={[0, 1, 0]} />
        <OrbitControls/>
    </Canvas>
}

function Scene() {
    const faceTex = useTexture('/4.png')
    faceTex.flipY = false
    const faceRef = useRef<THREE.Points>(null!)
    const faceShaderRef = useRef<SparkleShaderUniforms>(null!)
    const count = 1000
    const positions = new Float32Array(count * 3)
    const sizes = new Float32Array(count)
    const times = new Float32Array(count)
    for (let i = 0; i < count; i++) {

        const i3 = i * 3

        const spherical = new THREE.Spherical(
            1.75 + Math.random() * 0.25, Math.random() * Math.PI, 2 * Math.PI * Math.random()
        )
        const position = new THREE.Vector3()
        position.setFromSpherical(spherical)
        positions[i3] = position.x
        positions[i3 + 1] = position.y
        positions[i3 + 2] = position.z

        sizes[i] = Math.random()
        times[i] = 1 + Math.random()
    }

    useEffect(() => {
        window.addEventListener('click', () => {
            if (faceShaderRef.current) faceShaderRef.current.uProgress = 0
        })
    }, [])

    return <>
        <points ref={faceRef} scale={[4, 1, 1]}>
            <bufferGeometry>
                <bufferAttribute attach="attributes-position" count={count} array={positions} itemSize={3}/>
                <bufferAttribute attach="attributes-aSize" count={count} array={sizes} itemSize={1}/>
                <bufferAttribute attach="attributes-aTime" count={count} array={times} itemSize={1}/>
            </bufferGeometry>
            <SparkleShader
                ref={faceShaderRef}
                uSize={0.5}
                uTime={0}
                uProgress={0}
                uColor={new THREE.Color(0.3, 0.7, 1)}
                transparent
                depthTest={false}
                side={THREE.DoubleSide}
                uTexture={faceTex}
            />
        </points>
        <points ref={faceRef} scale={[-4, 3, 1]}>
            <bufferGeometry>
                <bufferAttribute attach="attributes-position" count={count} array={positions} itemSize={3}/>
                <bufferAttribute attach="attributes-aSize" count={count} array={sizes} itemSize={1}/>
                <bufferAttribute attach="attributes-aTime" count={count} array={times} itemSize={1}/>
            </bufferGeometry>
            <SparkleShader
                ref={faceShaderRef}
                uSize={0.5}
                uTime={0}
                uProgress={0}
                uColor={new THREE.Color(0.3, 0.7, 1)}
                transparent
                depthTest={false}
                uTexture={faceTex}
            />
        </points>
    </>
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
    const { nodes } = useGLTF('/pointer.glb') as GLTFResult
    return <group {...props} dispose={null} scale={0.1} rotation={[Math.PI * 0.25, 0, 0]}>

        <mesh geometry={nodes.Cube_1.geometry}>
            <meshBasicMaterial color="#fff" />
        </mesh>

        {/* Outline */}
        <mesh geometry={nodes.Cube_2.geometry}>
            <meshBasicMaterial color="#000" />
        </mesh>

    </group>
}

useGLTF.preload('/pointer.glb')
