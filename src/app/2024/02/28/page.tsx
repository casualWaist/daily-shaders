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

const HologramShaderImp = shaderMaterial({
    uTime: 0,
    uTexture: new THREE.Texture(),
    uColor: new THREE.Color(0.5, 0.0, 0.025),
    uResolution: typeof window !== 'undefined' ? new THREE.Vector2(window.innerWidth, window.innerHeight) : new THREE.Vector2(1, 1),
}, vertex, fragment, (imp) => { if (imp) {
    //imp.wireframe = true
    imp.side = THREE.DoubleSide
    imp.depthWrite = false
    imp.blending = THREE.AdditiveBlending
} })

extend({ HologramShaderImp })

declare global {
    namespace JSX {
        interface IntrinsicElements {
            hologramShaderImp: MaterialNode<any, typeof THREE.MeshStandardMaterial>
        }
    }
}

export type HologramShaderUniforms = {
    uTime: number,
    uTexture: THREE.Texture,
    uResolution?: THREE.Vector2
    uColor?: THREE.Color
}

type Props = HologramShaderUniforms & MaterialProps

const HologramShader = forwardRef<HologramShaderUniforms, Props>(({...props}: Props, ref) => {
    const localRef = useRef<Props>(null!)
    useImperativeHandle(ref, () => localRef.current)
    useFrame((state, delta) => {
        localRef.current.uTime += delta
    })
    return <hologramShaderImp key={HologramShaderImp.key} ref={localRef} attach="material" {...props} />
})
HologramShader.displayName = 'HologramShader'

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
                <div style={{transform: 'scale(4)', textAlign: 'center'}}>
                    Steamy
                </div>
            </Html>
        </Float>
        <OrbitControls/>
    </Canvas>
}
function Scene() {
    const faceTex = useTexture('/noise.png')
    faceTex.wrapT = THREE.RepeatWrapping
    faceTex.wrapS = THREE.RepeatWrapping
    const faceRef = useRef<THREE.Mesh>(null!)
    const faceShaderRef = useRef<HologramShaderUniforms>(null!)

    return <mesh ref={faceRef}>
        <torusKnotGeometry args={[1.5, 0.5, 128]} />
        <HologramShader ref={faceShaderRef} uTime={0} uColor={new THREE.Color(0.1, 0.4, 1)} transparent uTexture={faceTex}/>
    </mesh>
}
