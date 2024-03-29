'use client'

import {Canvas, extend, MaterialNode, useFrame, useThree} from "@react-three/fiber"
import {Float, Html, shaderMaterial, OrbitControls} from "@react-three/drei"
import { Caveat } from "next/font/google"
import fragment from './fragment.glsl'
import vertex from './vertex.glsl'
import * as THREE from 'three'
import {forwardRef, useImperativeHandle, useRef} from "react"

const caveat = Caveat({
    subsets: ['latin'],
    variable: '--font-caveat'
})

const CapeShaderImp = shaderMaterial({
    uTime: 0,
    uCameraPos: new THREE.Vector3(),
    uBigWavesElevation: 0.75,
    uBigWavesFrequency: new THREE.Vector2(2.25, 4.2),
    uBigWavesSpeed: 1.25,
    uSmallWavesElevation: 0.05,
    uSmallWavesFrequency: 0.45,
    uSmallWavesSpeed: 0.2,
    uSmallIterations: 6,
    uDepthColor: new THREE.Color(0.125, 0.3, 0.8),
    uSurfaceColor: new THREE.Color(0.3, 0.5, 1.0),
    uColorOffset: 0.08,
    uColorMultiplier: 8.0,
    uResolution: typeof window !== 'undefined' ? new THREE.Vector2(window.innerWidth, window.innerHeight) : new THREE.Vector2(1, 1),
}, vertex, fragment)

extend({ CapeShaderImp })

declare global {
    namespace JSX {
        interface IntrinsicElements {
            capeShaderImp: MaterialNode<any, typeof THREE.MeshStandardMaterial>
        }
    }
}

type Props = {
    uTime?: number,
    uCameraPos?: THREE.Vector3,
    uBigWavesElevation?: number,
    uBigWavesFrequency?: THREE.Vector2,
    uBigWavesSpeed?: number,
    uSmallWavesElevation?: number,
    uSmallWavesFrequency?: number,
    uSmallWavesSpeed?: number,
    uSmallIterations?: number,
    uDepthColor?: THREE.Color,
    uSurfaceColor?: THREE.Color,
    uColorOffset?: number,
    uColorMultiplier?: number,
    uResolution?: THREE.Vector2
} & JSX.IntrinsicElements['meshStandardMaterial']

const CapeShader = forwardRef(({...props}: Props, ref) => {
    const localRef = useRef<Props>(null!)
    useImperativeHandle(ref, () => localRef.current)

    useFrame((state, delta) => {
        localRef.current.uTime! += delta
        localRef.current.uCameraPos = state.camera.position
    })
    return <capeShaderImp key={CapeShaderImp.key} ref={localRef} attach="material" {...props} />
})
CapeShader.displayName = 'CapeShader'

export default function Page() {
    return <Canvas style={{position: "absolute", top: "0", zIndex: "-1"}}>
        <Scene/>
        <Float>
            <Html position={[0, -1.5, 1]}
                  center
                  transform
                  as="h1"
                  className={caveat.className}
                  scale={0.25}
            >
                <div style={{transform: 'scale(4)'}}>
                    No Capes.
                </div>
            </Html>
        </Float>
        <color attach="background" args={['#ffe600']}/>
        <OrbitControls/>
    </Canvas>
}

function Scene() {
    const view = useThree((state) => state.viewport)
    return <mesh rotation={[-Math.PI * 0.125, -Math.PI * 0.25, 0]}>
        <planeGeometry args={[view.width * 0.5, view.width * 0.25, 100, 100]}/>
        <CapeShader side={THREE.DoubleSide}/>
    </mesh>
}
