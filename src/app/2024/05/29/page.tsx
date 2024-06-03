'use client'

import {Canvas, MaterialNode, MaterialProps, useThree} from "@react-three/fiber"
import * as THREE from 'three'
import { extend, useFrame } from '@react-three/fiber'
import {CameraShake, Float, Html, OrbitControls, shaderMaterial} from '@react-three/drei'
import vertex from './vertex.glsl'
import fragment from './fragment.glsl'
import React, {forwardRef, useImperativeHandle, useMemo, useRef} from 'react'
import {Caveat} from "next/font/google"
import {FontLoader, TextGeometry} from "three-stdlib"

const caveat = Caveat({
    subsets: ['latin'],
    variable: '--font-caveat'
})

const size = 512

const data = new Float32Array(size * size * 4)

for (let i = 0; i < size * size; i++) {
    for (let j = 0; j < 3; j++) {
        let index = (i + j * size) * 4
        let theta = Math.random() * Math.PI * 2
        let r = 0.5 + 0.5 * Math.random()
        data[index] = r * Math.cos(theta)
        data[index + 1] = r * Math.sin(theta)
        data[index + 2] = 1
        data[index + 3] = 1
    }
}

const tGeo = () => {
    const loader = new FontLoader()
    const font = loader.parse(require('three/examples/fonts/optimer_regular.typeface.json'))
    const geometry = new TextGeometry('\'24', {
        font,
        size: 2.75,
        height: 0.1,
        curveSegments: 12,
        bevelEnabled: true,
        bevelThickness: 0.03,
        bevelSize: 0.2,
        bevelOffset: 0,
    })
    geometry.setIndex(null)
    return geometry.attributes.position.array
}

// #particleTexture #dataParticles #particles
const texture = new THREE.DataTexture(tGeo(), 62, 62, THREE.RGBAFormat, THREE.FloatType)

const count = size ** 2
const geometry = new THREE.BufferGeometry()
let positions = new Float32Array(count * 3)
let uv = new Float32Array(count * 2)
for (let i = 0; i < size * size; i++) {
    for (let j = 0; j < 3; j++) {
        let index = (i + j * size)
        positions[index * 3] = Math.random()
        positions[index * 3 + 1] = Math.random()
        positions[index * 3 + 2] = 0
        uv[index * 2] = i / size
        uv[index * 2 + 1] = j / size
    }
}
geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3))
geometry.setAttribute('uv', new THREE.BufferAttribute(uv, 2))

const Explode24ShaderImp = shaderMaterial({
    uTime: 0,
    uPositions: texture,
    uMouse: new THREE.Vector2(0, 0),
    uPoints: [0.5, 0.5, 0.5],
    uCamera: new THREE.Vector3(0, 0, 5),
    uSize: new THREE.Vector2(1, 1),
    uTexture: new THREE.Texture(),
    uColor: new THREE.Color(0.83, 0.74, 0.55),
    uResolution: typeof window !== 'undefined' ? new THREE.Vector2(window.innerWidth, window.innerHeight) : new THREE.Vector2(1, 1),
}, vertex, fragment, (imp) => { if (imp) {
    //imp.wireframe = true
    //imp.side = THREE.DoubleSide
    //imp.depthWrite = false
    //imp.blending = THREE.AdditiveBlending
} })

extend({ Explode24ShaderImp })

declare global {
    namespace JSX {
        interface IntrinsicElements {
            explode24ShaderImp: MaterialNode<any, typeof THREE.MeshStandardMaterial>
        }
    }
}

export type Explode24ShaderUniforms = {
    uTime?: number
    uPositions?: THREE.DataTexture
    uMouse?: THREE.Vector2
    uPoints?: number[]
    uCamera?: THREE.Vector3
    uSize?: THREE.Vector2
    uTexture?: THREE.Texture
    uResolution?: THREE.Vector2
    uColor?: THREE.Color
}

type Props = Explode24ShaderUniforms & MaterialProps

const Explode24Shader = forwardRef(({ ...props }: Props, ref) => {
    const localRef = useRef<THREE.ShaderMaterial & {
        uTime: number, uMouse: THREE.Vector2, uColor:THREE.Color, uResolution?: THREE.Vector2}>(null!)

    useImperativeHandle(ref, () => localRef.current)

    useFrame((_, delta) => (localRef.current.uTime += delta))
    return <explode24ShaderImp key={Explode24ShaderImp.key} ref={localRef} {...props} attach='material' />
})
Explode24Shader.displayName = 'Explode24Shader'

export default function Page() {
    return <Canvas  style={{position: "absolute", top: "0", zIndex: "-1", backgroundColor: 'black'}}>
        {/*<points position={[0, 1, 0]} geometry={geometry}>
             @ts-ignore
            <Explode24Shader />
        </points>*/}
        <Scene />
        <OrbitControls />
        <CameraShake yawFrequency={1} maxYaw={0.05} pitchFrequency={1} maxPitch={0.05} rollFrequency={0.5} maxRoll={0.5} intensity={0.2} />
        <Float>
            <Html position={[0, -1.5, 1]}
                  center transform as="h1" className={caveat.className} scale={0.25}>
                <div style={{ transform: 'scale(4)', textAlign: 'center' }}>
                    Cyby Lights
                </div>
            </Html>
        </Float>
    </Canvas>
}


function Scene() {
    const camera = useThree((state) => state.camera)
    const camSeg = useRef(0)
    const count = useRef(0)
    const camPos = useRef([
        new THREE.Vector3(0, 0, 2),
        new THREE.Vector3(0, 1, 2),
        new THREE.Vector3(-1, 0, 1),
        new THREE.Vector3(1, 0, 1),
        new THREE.Vector3(0, 0, 5),
    ])
    const shader = useRef<Explode24ShaderUniforms>(null!)
    const tGeo = useMemo(() => {
        const loader = new FontLoader()
        const font = loader.parse(require('three/examples/fonts/optimer_regular.typeface.json'))
        const geometry = new TextGeometry('\'24', {
            font,
            size: 2.75,
            height: 0.5,
            curveSegments: 12,
            bevelEnabled: true,
            bevelThickness: 0.03,
            bevelSize: 0.2,
            bevelOffset: 0,
        })
        geometry.setIndex(null)
        return geometry
    }, [])

    useFrame(() => {
        shader.current.uCamera = camera.position
        if (camera.position.distanceTo(camPos.current[camSeg.current]) < 0.1) {
            if (camSeg.current + 1 < camPos.current.length) {
                camSeg.current++
            } else {
                camSeg.current = 0
                count.current = 0
            }
        } else {
            count.current += 0.01
            camera.position.lerp(camPos.current[camSeg.current], 0.01 * count.current)
        }
    })

    return <group position={[-3, -1, 0]}>
        <points>
            <bufferGeometry attach="geometry" {...tGeo} />
            <Explode24Shader ref={shader}
                             depthWrite={false}
                             depthTest={false}
                             transparent
                             blending={THREE.AdditiveBlending}
                             uColor={new THREE.Color(0.1, 0.4, 1)}/>
        </points>
        <lineSegments>
            <bufferGeometry attach="geometry" {...tGeo}/>
            <lineBasicMaterial color="hotpink" />
        </lineSegments>
    </group>
}
