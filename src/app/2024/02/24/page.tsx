'use client'

import {Canvas, extend, MaterialNode, MaterialProps, useFrame} from "@react-three/fiber"
import {Float, Html, shaderMaterial, OrbitControls, useTexture} from "@react-three/drei"
import { Caveat } from "next/font/google"
import fragment from './fragment.glsl'
import vertex from './vertex.glsl'
import * as THREE from 'three'
import {forwardRef, useImperativeHandle, useRef} from "react"
import {DoubleSide, Mesh} from "three"

const caveat = Caveat({
    subsets: ['latin'],
    variable: '--font-caveat'
})

const KinetoShaderImp = shaderMaterial({
    uTime: 0,
    uTexture: new THREE.Texture(),
    uColor: new THREE.Color(0.5, 0.0, 0.025),
    uResolution: typeof window !== 'undefined' ? new THREE.Vector2(window.innerWidth, window.innerHeight) : new THREE.Vector2(1, 1),
}, vertex, fragment, (imp) => { if (imp) {
    //imp.wireframe = true
    imp.side = DoubleSide
    imp.depthWrite = false
} })

extend({ KinetoShaderImp })

declare global {
    namespace JSX {
        interface IntrinsicElements {
            kinetoShaderImp: MaterialNode<any, typeof THREE.MeshStandardMaterial>
        }
    }
}

export type KinetoShaderUniforms = {
    uTime: number,
    uTexture: THREE.Texture,
    uResolution?: THREE.Vector2
    uColor?: THREE.Color
}

type Props = KinetoShaderUniforms & MaterialProps

const KinetoShader = forwardRef<KinetoShaderUniforms, Props>(({...props}: Props, ref) => {
    const localRef = useRef<Props>(null!)
    useImperativeHandle(ref, () => localRef.current)
    useFrame((state, delta) => {
        localRef.current.uTime += delta
    })
    return <kinetoShaderImp key={KinetoShaderImp.key} ref={localRef} attach="material" {...props} />
})
KinetoShader.displayName = 'KinetoShader'

export default function Page() {

    return <Canvas style={{position: "absolute", top: "0", zIndex: "-1"}}>
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
                    Kinetoscope
                </div>
            </Html>
        </Float>
        <OrbitControls/>
    </Canvas>
}
function Scene() {
    const faceTex = useTexture('/waves.png')
    faceTex.wrapT = THREE.RepeatWrapping
    faceTex.wrapS = THREE.RepeatWrapping
    const faceRef = useRef<Mesh>(null!)
    const faceShaderRef = useRef<KinetoShaderUniforms>(null!)

    return <mesh ref={faceRef}>
        <planeGeometry args={[2, 2]} />
        <KinetoShader ref={faceShaderRef} uTime={0} transparent uTexture={faceTex}/>
    </mesh>
}
