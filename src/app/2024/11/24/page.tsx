'use client'

import {Canvas, MaterialNode, MaterialProps, extend, useFrame} from "@react-three/fiber"
import * as THREE from 'three'
import {
    Float,
    Html,
    OrbitControls,
    shaderMaterial,
    Lightformer,
    Text,
    ContactShadows,
    Environment,
    MeshTransmissionMaterial,
    Outlines, useTexture,
} from '@react-three/drei'
import vertex from './vertex.glsl'
import fragment from './fragment.glsl'
import React, {forwardRef, useEffect, useImperativeHandle, useMemo, useRef} from 'react'
import {Caveat} from "next/font/google"
import { Bloom, EffectComposer, N8AO, TiltShift2 } from "@react-three/postprocessing"
import { easing } from "maath"
import {GLTF} from "three-stdlib"

const caveat = Caveat({
    subsets: ['latin'],
    variable: '--font-caveat'
})

function Rig() {
    useFrame((state, delta) => {
        easing.damp3(
            state.camera.position,
            [Math.sin(-state.pointer.x) * 5, state.pointer.y * 3.5, 15 + Math.cos(state.pointer.x) * 10],
            0.2,
            delta,
        )
        state.camera.lookAt(0, 0, 0)
    })
    return null
}

const Knot = (props: JSX.IntrinsicElements['mesh']) => {

const matCap = useTexture('/glass.png')
    return <mesh receiveShadow castShadow {...props}>
        <torusKnotGeometry args={[3, 1, 256, 32]} />
        <MeshTransmissionMaterial backside backsideThickness={5} thickness={2} alphaMap={matCap} />
    </mesh>
}

function Status(props: JSX.IntrinsicElements['mesh'] & { loc?: string }) {
    const text = props.loc === "/" ? "/knot" : props.loc
    return (
        <mesh {...props}>
            <tetrahedronGeometry args={[6, 4]} />
            <meshStandardMaterial color="hotpink" />
            <Outlines color={'#65ac2a'} thickness={0.3} />
        </mesh>
    )
}

const CustomMatcapImp = shaderMaterial({
    uTime: 0,
    uPositions: new THREE.DataTexture(),
    uMouse: new THREE.Vector2(0, 0),
    uPoints: [0.5, 0.5, 0.5],
    uCamera: new THREE.Vector3(0, 0, 5),
    uFocus: 5.0,
    uSize: new THREE.Vector2(1, 1),
    matcap: new THREE.Texture(),
    uColor: new THREE.Color(0.83, 0.74, 0.55),
    uResolution: typeof window !== 'undefined' ? new THREE.Vector2(window.innerWidth, window.innerHeight) : new THREE.Vector2(1, 1),
}, vertex, fragment, (imp) => { if (imp) {
    //imp.wireframe = true
    //imp.side = THREE.DoubleSide
    //imp.depthWrite = false
    //imp.blending = THREE.AdditiveBlending
} })

extend({ CustomMatcapImp })

declare global {
    namespace JSX {
        interface IntrinsicElements {
            customMatcapImp: MaterialNode<any, typeof THREE.MeshStandardMaterial>
        }
    }
}

export type CustomMatcapUniforms = {
    uTime?: number
    uPositions?: THREE.DataTexture
    uMouse?: THREE.Vector2
    uPoints?: number[]
    uCamera?: THREE.Vector3
    uFocus?: number
    uSize?: THREE.Vector2
    matcap?: THREE.Texture
    uResolution?: THREE.Vector2
    uColor?: THREE.Color
}

type Props = CustomMatcapUniforms & MaterialProps

const CustomMatcap = forwardRef(({ ...props }: Props, ref) => {
    const localRef = useRef<THREE.ShaderMaterial & {
        uTime: number, uMouse: THREE.Vector2, uColor:THREE.Color, uResolution?: THREE.Vector2}>(null!)

    useImperativeHandle(ref, () => localRef.current)

    useFrame((_, delta) => {
        localRef.current.uTime += delta
    })
    return <customMatcapImp key={CustomMatcapImp.key} ref={localRef} {...props} attach='material' />
})
CustomMatcap.displayName = 'CustomMatcap'

export default function Page() {
    return <Canvas  style={{position: "absolute", top: "0", zIndex: "-1", backgroundColor: '#fff'}}>
        <Scene />
        <OrbitControls />
        <Float>
            <Html position={[0, -2, 1]}
                  center transform as="h1" className={caveat.className} scale={0.25}>
                <div style={{ transform: 'scale(4)', textAlign: 'center', color: 'white' }}>
                    I Dot the Line
                </div>
            </Html>
        </Float>
    </Canvas>
}

type GLTFResult = GLTF & {
    nodes: {
        Text: THREE.Mesh
    }
    materials: {}
}

function Scene() {
    const rRGeometry = useMemo(() => {
        const width = 10
        const height = 10
        const radius = 1
        const segments = 32
        const shape = new THREE.Shape();
        shape.moveTo(-width / 2 + radius, -height / 2);
        shape.lineTo(width / 2 - radius, -height / 2);
        shape.quadraticCurveTo(width / 2, -height / 2, width / 2, -height / 2 + radius);
        shape.lineTo(width / 2, height / 2 - radius);
        shape.quadraticCurveTo(width / 2, height / 2, width / 2 - radius, height / 2);
        shape.lineTo(-width / 2 + radius, height / 2);
        shape.quadraticCurveTo(-width / 2, height / 2, -width / 2, height / 2 - radius);
        shape.lineTo(-width / 2, -height / 2 + radius);
        shape.quadraticCurveTo(-width / 2, -height / 2, -width / 2 + radius, -height / 2);

        return new THREE.ShapeGeometry(shape, segments);
    }, [])
    const matCap = useTexture('/glass.png')

    return <>
        <color attach="background" args={["#e0e0e0"]}/>
        <spotLight position={[20, 20, 10]} penumbra={1} castShadow angle={0.2}/>
        <Status position={[0, 0, -10]}/>
        <Float floatIntensity={2}>
            <Knot/>
        </Float>
        <mesh geometry={rRGeometry} position={[0, 0, 10]}>
            <CustomMatcap matcap={matCap} transparent/>
        </mesh>
        <ContactShadows scale={100} position={[0, -7.5, 0]} blur={1} far={100} opacity={0.85}/>
        <Environment preset="city">
            <Lightformer intensity={8} position={[10, 5, 0]} scale={[10, 50, 1]}
                         onUpdate={(self) => self.lookAt(0, 0, 0)}/>
        </Environment>
        {/*<EffectComposer>
            <N8AO aoRadius={1} intensity={2}/>
            <Bloom mipmapBlur luminanceThreshold={0.8} intensity={2} levels={8}/>
            <TiltShift2 blur={0.2}/>
        </EffectComposer>*/}
        <Rig/>
    </>
}
