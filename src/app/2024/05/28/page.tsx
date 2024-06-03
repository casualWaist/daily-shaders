'use client'

import { Canvas, extend, MaterialNode, MaterialProps, useFrame } from "@react-three/fiber"
import { Float, Html, shaderMaterial, OrbitControls } from "@react-three/drei"
import { Caveat } from "next/font/google"
import fragment from './fragment.glsl'
import vertex from './vertex.glsl'
import * as THREE from 'three'
import React, {forwardRef, useImperativeHandle, useMemo, useRef} from "react"

const caveat = Caveat({
    subsets: ['latin'],
    variable: '--font-caveat'
})

const ImmerseConShaderImp = shaderMaterial({
    uTime: 0,
    uMouse: new THREE.Vector2(0, 0),
    uSize: new THREE.Vector2(1, 1),
    uTexture: new THREE.Texture(),
    uColor: new THREE.Color(0.83, 0.74, 0.55),
    uResolution: typeof window !== 'undefined' ? new THREE.Vector2(window.innerWidth, window.innerHeight) : new THREE.Vector2(1, 1),
}, vertex, fragment, (imp) => { if (imp) {
    //imp.wireframe = true
    imp.side = THREE.DoubleSide
    imp.depthWrite = false
    imp.blending = THREE.AdditiveBlending
} })

extend({ ImmerseConShaderImp })

declare global {
    namespace JSX {
        interface IntrinsicElements {
            immerseConShaderImp: MaterialNode<any, typeof THREE.MeshStandardMaterial>
        }
    }
}

export type ImmerseConShaderUniforms = {
    uTime?: number
    uMouse?: THREE.Vector2
    uSize?: THREE.Vector2
    uTexture?: THREE.Texture
    uResolution?: THREE.Vector2
    uColor?: THREE.Color
}

type Props = ImmerseConShaderUniforms & MaterialProps

const ImmerseConShader = forwardRef<ImmerseConShaderUniforms, Props>(({...props}: Props, ref) => {
    const localRef = useRef<Props>(null!)
    useImperativeHandle(ref, () => localRef.current)
    useFrame((state, delta) => {
        localRef.current.uTime! += delta
        localRef.current.uMouse = state.pointer
    })
    return <immerseConShaderImp key={ImmerseConShaderImp.key} ref={localRef} attach="material" {...props} />
})
ImmerseConShader.displayName = 'ImmerseConShader'

export default function Page() {

    return <>
        <Canvas style={{position: "absolute", top: "0", zIndex: "-1", backgroundColor: 'black'}}>
            <Scene />
            <Float>
                <Html position={[0, -2.5, 0]}
                      center
                      transform
                      as="h1"
                      className={caveat.className}
                      scale={0.25}
                >
                    <div style={{transform: 'scale(4)', textAlign: 'center', pointerEvents: 'none', color: 'white'}}>
                        Bad Orbits
                    </div>
                </Html>
            </Float>
            <OrbitControls/>
        </Canvas>
    </>
}

function Scene() {
    const points = useMemo(() => new THREE.EllipseCurve(0, 0, 3, 1.75, 0, 2 * Math.PI, false, 0).getPoints(100), [])
    const lineA = useRef<THREE.Group>(null!)
    const lineB = useRef<THREE.Group>(null!)
    const lineC = useRef<THREE.Group>(null!)
    const light = useRef<THREE.DirectionalLight>(null!)

    useFrame(() => {
        const r = (Date.now() / 1000) % Math.PI

        lineA.current.rotation.x = Math.PI * 0.5 + r
        lineA.current.rotation.y = r
        lineA.current.rotation.z = r

        lineB.current.rotation.x = -r
        lineB.current.rotation.y = r
        lineB.current.rotation.z = Math.PI * 0.5 + r

        lineC.current.rotation.x = r
        lineC.current.rotation.y = -Math.PI * 0.5 + r
        lineC.current.rotation.z = -r

        light.current.position.x = -Math.sin(Date.now() / 2000) * 3
        light.current.position.y = Math.sin(Date.now() / 2000) * 4
        light.current.position.z = Math.cos(Date.now() / 2000) * 7
    })

    return <>
        <group ref={lineA}>
            <line>
                <bufferGeometry>
                    <bufferAttribute
                        attach="attributes-position"
                        count={points.length}
                        array={new Float32Array(points.flatMap(p => [p.x, p.y, 0]))}
                        itemSize={3}
                    />
                </bufferGeometry>
                <ImmerseConShader/>
            </line>

            <mesh position={[3, 0, 0]}>
                <sphereGeometry args={[0.125, 16, 16]}/>
                <meshToonMaterial color={'#1fb2f5'}/>
            </mesh>
        </group>
        <group ref={lineB}>
            <line>
                <bufferGeometry>
                    <bufferAttribute
                        attach="attributes-position"
                        count={points.length}
                        array={new Float32Array(points.flatMap(p => [p.x, p.y, 0]))}
                        itemSize={3}
                    />
                </bufferGeometry>
                <ImmerseConShader/>
            </line>

            <mesh position={[3, 0, 0]}>
                <sphereGeometry args={[0.125, 16, 16]}/>
                <meshToonMaterial color={'#1fb2f5'}/>
            </mesh>
        </group>
        <group ref={lineC}>
            <line>
                <bufferGeometry>
                    <bufferAttribute
                        attach="attributes-position"
                        count={points.length}
                        array={new Float32Array(points.flatMap(p => [p.x, p.y, 0]))}
                        itemSize={3}
                    />
                </bufferGeometry>
                <ImmerseConShader/>
            </line>

            <mesh position={[3, 0, 0]}>
                <sphereGeometry args={[0.125, 16, 16]}/>
                <meshToonMaterial color={'#1fb2f5'}/>
            </mesh>
        </group>
        <mesh>
            <sphereGeometry args={[0.5, 16, 16]}/>
            <meshToonMaterial color={'#1fb2f5'}/>
        </mesh>
        <directionalLight position={[-4, 2, 4]} intensity={5}/>
        <directionalLight ref={light} position={[4, 2, -8]} intensity={5}/>
    </>
}
