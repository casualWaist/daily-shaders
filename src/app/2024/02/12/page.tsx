'use client'

import {Canvas, extend, MaterialNode, useFrame, useThree} from "@react-three/fiber"
import {Float, Html, shaderMaterial, OrbitControls, useTexture} from "@react-three/drei"
import { Caveat } from "next/font/google"
import fragment from './fragment.glsl'
import vertex from './vertex.glsl'
import * as THREE from 'three'
import {forwardRef, useRef} from "react"

const caveat = Caveat({
    subsets: ['latin'],
    variable: '--font-caveat'
})

const StickWalkImp = shaderMaterial({
    uTime: 0,
    uTexture: new THREE.Texture(),
    uColor: new THREE.Color(0.5, 0.0, 0.025),
    uResolution: typeof window !== 'undefined' ? new THREE.Vector2(window.innerWidth, window.innerHeight) : new THREE.Vector2(1, 1),
}, vertex, fragment)

extend({ StickWalkImp })

declare global {
    namespace JSX {
        interface IntrinsicElements {
            stickWalkImp: MaterialNode<any, typeof THREE.MeshStandardMaterial>
        }
    }
}

type Props = {
    uTime: number,
    uColor: THREE.Color,
    uTexture: THREE.Texture,
    uResolution?: THREE.Vector2
} & JSX.IntrinsicElements['meshStandardMaterial']

const StickWalk = forwardRef(({...props}: Props, ref) => {
    const localRef = useRef<Props>(null!)
    let tot = 0
    let index = 0
    useFrame((state, delta) => {
        tot += delta
        if (tot > 1) {
            tot = 0.1
        }
        else index = Math.floor(tot * 10)
        localRef.current.uTime = index
    })
    return <stickWalkImp key={StickWalkImp.key} ref={localRef} attach="material" {...props} />
})
StickWalk.displayName = 'StickWalk'

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
                    Step: One
                </div>
            </Html>
        </Float>
        <OrbitControls />
    </Canvas>
}

function Scene() {
    const view = useThree((state) => state.viewport)
    const texture = useTexture('/SpriteTest.png')
    return <mesh>
        <planeGeometry args={[view.width * 0.25, view.height * 0.25]}/>
        <StickWalk uTime={0} uTexture={texture} uColor={new THREE.Color(1, 1, 1)} />
    </mesh>
}
