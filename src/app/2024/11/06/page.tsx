'use client'

import {Canvas, extend, MaterialNode, MaterialProps, useFrame} from "@react-three/fiber"
import {
    Float,
    Html,
    OrbitControls,
    useGLTF,
    Outlines, Instances, Instance, shaderMaterial, Line
} from "@react-three/drei"
import { Caveat } from "next/font/google"
import * as THREE from 'three'
import {GLTF, Line2} from "three-stdlib"
import React, {forwardRef, useEffect, useImperativeHandle, useMemo, useRef} from "react"
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
        <Scene />
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
                    Might be A Connection
                </div>
            </Html>
        </Float>
        <OrbitControls/>
    </Canvas>
}

function Scene() {
    const cities = [
        {name: 'New York', position: [-2.5, 1.2, 0.5], intensity: Math.random()},
        {name: 'Los Angeles', position: [2.3, -1.8, 1.1], intensity: Math.random()},
        {name: 'Chicago', position: [-1.4, 2.1, -0.9], intensity: Math.random()},
        {name: 'Houston', position: [0.7, -2.3, 2.0], intensity: Math.random()},
        {name: 'Phoenix', position: [1.5, 0.4, -2.1], intensity: Math.random()},
        {name: 'Philadelphia', position: [-0.6, 2.5, -1.3], intensity: Math.random()},
        {name: 'San Antonio', position: [2.0, -0.7, 1.8], intensity: Math.random()},
        {name: 'San Diego', position: [-1.9, 1.0, -2.4], intensity: Math.random()},
        {name: 'Dallas', position: [0.3, -1.5, 2.2], intensity: Math.random()},
        {name: 'San Jose', position: [1.8, 2.2, -0.5], intensity: Math.random()},
        {name: 'Austin', position: [-2.1, 0.6, 1.4], intensity: Math.random()},
        {name: 'Jacksonville', position: [2.4, -0.9, -1.7], intensity: Math.random()},
        {name: 'Fort Worth', position: [-1.2, 1.9, 0.8], intensity: Math.random()},
        {name: 'Columbus', position: [0.5, -2.0, 2.3], intensity: Math.random()},
        {name: 'Charlotte', position: [1.1, 2.3, -0.6], intensity: Math.random()},
        {name: 'Indianapolis', position: [-2.4, 0.7, 1.5], intensity: Math.random()},
        {name: 'San Francisco', position: [2.1, -1.0, -1.8], intensity: Math.random()},
        {name: 'Seattle', position: [-0.8, 2.4, 0.9], intensity: Math.random()},
        {name: 'Denver', position: [0.6, -2.1, 2.4], intensity: Math.random()},
        {name: 'Washington', position: [1.2, 2.5, -0.7], intensity: Math.random()},
        {name: 'Boston', position: [-2.3, 0.8, 1.6], intensity: Math.random()},
        {name: 'El Paso', position: [2.2, -1.1, -1.9], intensity: Math.random()},
        {name: 'Nashville', position: [-0.9, 2.0, 1.0], intensity: Math.random()},
        {name: 'Las Vegas', position: [0.7, -2.2, 2.5], intensity: Math.random()},
        {name: 'Detroit', position: [1.3, 2.1, -0.8], intensity: Math.random()},
        {name: 'Oklahoma City', position: [-2.2, 0.9, 1.7], intensity: Math.random()},
        {name: 'Portland', position: [2.0, -1.2, -2.0], intensity: Math.random()},
        {name: 'Memphis', position: [-1.0, 2.2, 1.1], intensity: Math.random()},
        {name: 'Louisville', position: [0.8, -2.3, 2.0], intensity: Math.random()},
        {name: 'Milwaukee', position: [1.4, 2.0, -0.9], intensity: Math.random()},
        {name: 'Baltimore', position: [-2.1, 1.0, 1.8], intensity: Math.random()},
        {name: 'Albuquerque', position: [2.3, -1.3, -2.1], intensity: Math.random()},
        {name: 'Tucson', position: [-1.1, 2.1, 1.2], intensity: Math.random()},
        {name: 'Fresno', position: [0.9, -2.4, 2.1], intensity: Math.random()},
        {name: 'Mesa', position: [1.5, 2.2, -1.0], intensity: Math.random()},
        {name: 'Sacramento', position: [-2.0, 1.1, 1.9], intensity: Math.random()},
        {name: 'Atlanta', position: [2.4, -1.4, -2.2], intensity: Math.random()},
        {name: 'Kansas City', position: [-1.2, 2.3, 1.3], intensity: Math.random()},
        {name: 'Colorado Springs', position: [0.7, -2.5, 2.2], intensity: Math.random()},
        {name: 'Miami', position: [1.6, 2.0, -1.1], intensity: Math.random()},
        {name: 'Raleigh', position: [-2.5, 1.2, 1.4], intensity: Math.random()},
        {name: 'Omaha', position: [2.1, -1.5, -2.3], intensity: Math.random()},
        {name: 'Long Beach', position: [-1.3, 2.4, 1.5], intensity: Math.random()},
        {name: 'Virginia Beach', position: [0.8, -2.0, 2.3], intensity: Math.random()},
        {name: 'Oakland', position: [1.7, 2.1, -1.2], intensity: Math.random()},
        {name: 'Minneapolis', position: [-2.4, 1.3, 1.6], intensity: Math.random()},
        {name: 'Tulsa', position: [2.0, -1.6, -2.4], intensity: Math.random()},
        {name: 'Tampa', position: [-1.4, 2.2, 1.7], intensity: Math.random()},
        {name: 'Arlington', position: [0.9, -2.1, 2.4], intensity: Math.random()},
        {name: 'New Orleans', position: [1.8, 2.3, -1.3], intensity: Math.random()},
    ] as {name: string, position: [number, number, number], intensity: number}[]

    return <>
        {cities.map((city, i) => (
            cities.map((city2, j) => (
                <TranLine key={i+j} start={city.position} end={city2.position} />
            ))
        ))}
        {cities.map((city, i) => (
            <Outbreak key={i} intensity={city.intensity} position={city.position} />
        ))}
    </>
}

function TranLine({start, end}: {start: [number,number,number], end: [number,number,number]}) {
    const lineRef = useRef<Line2>(null!)

    useEffect(() => {
        lineRef.current.material.transparent = true
        lineRef.current.material.opacity = 0.5
        lineRef.current.material.blending = THREE.NormalBlending
    }, [])

    useFrame(() => {
        if (lineRef.current && lineRef.current.material) {
            lineRef.current.material.uniforms.dashOffset.value += 0.003
            if (lineRef.current.material.uniforms.dashOffset.value > 1) {
                lineRef.current.material.uniforms.dashOffset.value = 0
            }
        }
    })

    return <>
        <Line points={[start, end]}
              ref={lineRef}
              lineWidth={2}
              dashed
              dashOffset={0.2}
              gapSize={0.1}
              dashSize={0.01}
              color={'#7474ae'} />
    </>

}

function Outbreak({intensity, position}: {intensity: number, position: [number, number, number]}) {
    const points = useMemo(() => {
        const positions = new Float32Array(100 * 3)
        for (let i = 0; i < 100; i++) {
            positions[i * 3] = (Math.random() - 0.5) * intensity // x position
            positions[i * 3 + 1] = (Math.random() - 0.5) * intensity // y position
            positions[i * 3 + 2] = 0 // z position
        }
        return positions
    }, [])
    const pointsRef = useRef<THREE.Points>(null!)
    const extraRef = useRef<THREE.Points>(null!)

    useFrame(() => {
        if (pointsRef.current) {
            pointsRef.current.rotation.z += 0.01
        }
        if (extraRef.current) {
            extraRef.current.rotation.z += 0.015
        }
    })

    if (intensity > 0.5) {
        return <>
            <points ref={pointsRef} position={position}>
                <bufferGeometry>
                    <bufferAttribute
                        attach="attributes-position"
                        array={points}
                        count={points.length / 3}
                        itemSize={3}
                    />
                </bufferGeometry>
                <pointsMaterial
                    size={0.01}
                    color="red"
                    transparent
                    opacity={0.75}
                    blending={THREE.AdditiveBlending}/>
            </points>
            <points ref={extraRef} position={position} rotation={[0, 0, 1]} scale={1.1}>
                <bufferGeometry>
                    <bufferAttribute
                        attach="attributes-position"
                        array={points}
                        count={points.length / 3}
                        itemSize={3}
                    />
                </bufferGeometry>
                <pointsMaterial
                    size={0.01}
                    color="red"
                    transparent
                    opacity={0.75}
                    blending={THREE.AdditiveBlending}/>
            </points>
        </>
    }

    return <>
        <points ref={pointsRef} position={position}>
            <bufferGeometry>
                <bufferAttribute
                    attach="attributes-position"
                    array={points}
                    count={points.length / 3}
                    itemSize={3}
                />
            </bufferGeometry>
            <pointsMaterial
                size={0.01}
                color="red"
                transparent
                opacity={0.75}
                blending={THREE.AdditiveBlending}/>
        </points>
    </>
}
