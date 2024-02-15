'use client'

import {Canvas, extend, MaterialNode, useFrame, useThree} from "@react-three/fiber"
import {Float, Html, shaderMaterial, OrbitControls} from "@react-three/drei"
import { Caveat } from "next/font/google"
import fragment from './fragment.glsl'
import vertex from './vertex.glsl'
import * as THREE from 'three'
import {forwardRef, useRef} from "react"

const caveat = Caveat({
    subsets: ['latin'],
    variable: '--font-caveat'
})

const BlobShaderImp = shaderMaterial({
    uTime: 0,
    uRayOrigin: new THREE.Vector3(0, 0, 0),
    uColor: new THREE.Color(0.5, 0.0, 0.025),
    uResolution: typeof window !== 'undefined' ? new THREE.Vector2(window.innerWidth, window.innerHeight) : new THREE.Vector2(1, 1),
}, vertex, fragment)

extend({ BlobShaderImp })

declare global {
    namespace JSX {
        interface IntrinsicElements {
            blobShaderImp: MaterialNode<any, typeof THREE.MeshStandardMaterial>
        }
    }
}

type Props = {
    uTime: number,
    uColor: THREE.Color,
    uRayOrigin?: THREE.Vector3,
    uResolution?: THREE.Vector2
} & JSX.IntrinsicElements['meshStandardMaterial']

const BlobShader = forwardRef(({...props}: Props, ref) => {
    const localRef = useRef<Props>(null!)
    useFrame((state, delta) => {
        localRef.current.uTime += delta
        localRef.current.uRayOrigin = state.camera.position
    })
    return <blobShaderImp key={BlobShaderImp.key} ref={localRef} attach="material" {...props} />
})
BlobShader.displayName = 'BlobShader'

export default function Page() {
    return <Canvas style={{position: "absolute", top: "0", zIndex: "-1"}}>
        <Scene />
        <Float>
            <Html position={[0, -1.5, 1]}
                center
                transform
                as="h1"
                className={caveat.className}
                scale={0.25}
            >
                <div style={{transform: 'scale(4)'}}>
                    Different up close
                </div>
            </Html>
        </Float>
        <OrbitControls />
    </Canvas>
}

function Scene() {
    const view = useThree((state) => state.viewport)
    return <mesh>
        <planeGeometry args={[view.width, view.height]}/>
        <BlobShader uTime={0} uColor={new THREE.Color(0.05, 0.4, 0.05)} />
    </mesh>
}
