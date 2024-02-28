'use client'

import {Canvas, extend, MaterialNode, MaterialProps, useFrame} from "@react-three/fiber"
import {Float, Html, shaderMaterial, OrbitControls} from "@react-three/drei"
import { Caveat } from "next/font/google"
import fragment from './fragment.glsl'
import vertex from './vertex.glsl'
import * as THREE from 'three'
import {forwardRef, useImperativeHandle, useRef} from "react"
import {Color} from "three"

const caveat = Caveat({
    subsets: ['latin'],
    variable: '--font-caveat'
})

const PlanetShaderImp = shaderMaterial({
    uTime: 0,
    uColor: new THREE.Color(0.5, 0.0, 0.025),
    uResolution: typeof window !== 'undefined' ? new THREE.Vector2(window.innerWidth, window.innerHeight) : new THREE.Vector2(1, 1),
}, vertex, fragment)

extend({ PlanetShaderImp })

declare global {
    namespace JSX {
        interface IntrinsicElements {
            planetShaderImp: MaterialNode<any, typeof THREE.MeshStandardMaterial>
        }
    }
}

export type PlanetShaderUniforms = {
    uTime: number,
    uResolution?: THREE.Vector2
    uColor?: THREE.Color
}

type Props = PlanetShaderUniforms & MaterialProps

const PlanetShader = forwardRef<PlanetShaderUniforms, Props>(({...props}: Props, ref) => {
    const localRef = useRef<Props>(null!)
    useImperativeHandle(ref, () => localRef.current)
    useFrame((_, delta) => {
        localRef.current.uTime = 0.5055 + delta * 0.017
    })
    return <planetShaderImp key={PlanetShaderImp.key} ref={localRef} attach="material" {...props} />
})
PlanetShader.displayName = 'PlanetShader'

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
                    Go Planet!
                </div>
            </Html>
        </Float>
        <OrbitControls/>
    </Canvas>
}
function Scene() {

    return <mesh>
        <icosahedronGeometry args={[2, 32]}/>
        <PlanetShader uTime={0} uColor={new Color(1, 0, 0.5)}/>
    </mesh>
}
