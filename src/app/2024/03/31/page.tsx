'use client'

import {Canvas, extend, MaterialNode, useFrame, useThree} from "@react-three/fiber"
import {Float, Html, shaderMaterial, OrbitControls} from "@react-three/drei"
import { Caveat } from "next/font/google"
import fragment from './fragment.glsl'
import vertex from './vertex.glsl'
import * as THREE from 'three'
import {forwardRef, useImperativeHandle, useMemo, useRef} from "react"

const caveat = Caveat({
    subsets: ['latin'],
    variable: '--font-caveat'
})

const RainbowStepsShaderImp = shaderMaterial({
    uTime: 0,
    uCameraPos: new THREE.Vector3(),
    uResolution: typeof window !== 'undefined' ? new THREE.Vector2(window.innerWidth, window.innerHeight) : new THREE.Vector2(1, 1),
}, vertex, fragment)

extend({ RainbowStepsShaderImp })

declare global {
    namespace JSX {
        interface IntrinsicElements {
            rainbowStepsShaderImp: MaterialNode<any, typeof THREE.MeshStandardMaterial>
        }
    }
}

type Props = {
    uTime?: number,
    uCameraPos?: THREE.Vector3,
    uResolution?: THREE.Vector2
} & JSX.IntrinsicElements['meshStandardMaterial']

const RainbowStepsShader = forwardRef(({...props}: Props, ref) => {
    const localRef = useRef<Props>(null!)
    useImperativeHandle(ref, () => localRef.current)

    useFrame((state, delta) => {
        localRef.current.uTime! += delta
        localRef.current.uCameraPos = state.camera.position
    })
    return <rainbowStepsShaderImp key={RainbowStepsShaderImp.key} ref={localRef} attach="material" {...props} />
})
RainbowStepsShader.displayName = 'RainbowStepsShader'

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
                    Multiple Steps
                </div>
            </Html>
        </Float>
        <color attach="background" args={['#ffe600']}/>
        <OrbitControls/>
    </Canvas>
}

function Scene() {
    const view = useThree((state) => state.viewport)
    const meshRef = useRef<THREE.Mesh>(null!)
    const points = useMemo(() => {
        const count = 225
        const points = new Float32Array(count * 2)
        for (let i = 0; i < count; i++) {
            const i2 = i * 2
            points[i2] = (i % 20) / 20
            points[i2 + 1] = Math.floor(i / 10) / 20
        }
        return points
    }, [])

    let spot = 0
    useFrame(() => {
        if (meshRef.current) {
            if (spot > points.length) spot = 0
            else spot++
            meshRef.current.geometry.attributes.aParticles.array[spot] = meshRef.current.geometry.attributes.aParticles.array[spot] + 0.1
            meshRef.current.geometry.attributes.aParticles.needsUpdate = true
        }
    })

    return <mesh ref={meshRef}>
        <planeGeometry args={[view.height, view.height, 14, 14]}>
            <bufferAttribute attach="attributes-aParticles" count={points.length * 0.5} array={points} itemSize={2}/>
        </planeGeometry>
        <RainbowStepsShader/>
    </mesh>
}
