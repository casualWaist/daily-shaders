'use client'

import {Canvas, MaterialNode, MaterialProps, useThree, createPortal} from "@react-three/fiber"
import * as THREE from 'three'
import { extend, useFrame } from '@react-three/fiber'
import {Float, Html, Line, OrbitControls, shaderMaterial, Svg, useFBO, useGLTF, useTexture} from '@react-three/drei'
import vertex from './vertex.glsl'
import fragment from './fragment.glsl'
import React, {forwardRef, useEffect, useImperativeHandle, useMemo, useRef, useState} from 'react'
import {Caveat} from "next/font/google"
import {DataTexture, ShaderMaterial, TypedArray, Vector3} from "three"
import {GLTF, Line2} from "three-stdlib"

const caveat = Caveat({
    subsets: ['latin'],
    variable: '--font-caveat'
})

const SimCitiesShaderImp = shaderMaterial({
    uPositions: new THREE.DataTexture(),
    uTexture: new THREE.Texture(),
    uTime: 0,
},`
    varying vec2 vUv;
    void main() {
        vUv = uv;
        gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
    }`, `
    uniform sampler2D uPositions;
    uniform sampler2D uTexture;
    uniform float uTime;
    varying vec2 vUv;
      
    void main() {
        float t = uTime * 0.5;
        vec3 pos = texture(uPositions, vUv).rgb;
        vec3 move = texture(uTexture, vUv + t).rgb;
        gl_FragColor = vec4(mix(pos, move, 0.1), 1.0);
    }`
)

extend({ SimCitiesShaderImp })

declare global {
    namespace JSX {
        interface IntrinsicElements {
            simCitiesShaderImp: MaterialNode<any, typeof THREE.MeshStandardMaterial>
        }
    }
}

export type SimCitiesShaderUniforms = {
    uTime?: number
    uPositions?: THREE.DataTexture
    uTexture?: THREE.Texture
}

type SimProps = SimCitiesShaderUniforms & MaterialProps

const SimCitiesShader = forwardRef(({ ...props }: SimProps, ref) => {
    const localRef = useRef<THREE.ShaderMaterial & {
        uTime: number, uPositions: THREE.DataTexture, uTexture: THREE.Texture}>(null!)
    const texture = useTexture('/noise.png')
    texture.wrapS = texture.wrapT = THREE.RepeatWrapping

    useImperativeHandle(ref, () => localRef.current)

    useEffect(() => {
        localRef.current.uTexture = texture
        localRef.current.uTexture.needsUpdate = true
    }, [])

    useFrame((_, delta) => {
        localRef.current.uTime += delta
    })
    return <simCitiesShaderImp key={SimCitiesShaderImp.key} ref={localRef} {...props} attach='material' />
})
SimCitiesShader.displayName = 'SimCitiesShader'

const VirusCitiesShaderImp = shaderMaterial({
    uTime: 0,
    uPositions: new THREE.DataTexture(),
    uMouse: new THREE.Vector2(0, 0),
    uPoints: [0.5, 0.5, 0.5],
    uCamera: new THREE.Vector3(0, 0, 5),
    uFocus: 5.0,
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

extend({ VirusCitiesShaderImp })

declare global {
    namespace JSX {
        interface IntrinsicElements {
            virusCitiesShaderImp: MaterialNode<any, typeof THREE.MeshStandardMaterial>
        }
    }
}

export type VirusCitiesShaderUniforms = {
    uTime?: number
    uPositions?: THREE.DataTexture
    uMouse?: THREE.Vector2
    uPoints?: number[]
    uCamera?: THREE.Vector3
    uFocus?: number
    uSize?: THREE.Vector2
    uTexture?: THREE.Texture
    uResolution?: THREE.Vector2
    uColor?: THREE.Color
}

type Props = VirusCitiesShaderUniforms & MaterialProps

const VirusCitiesShader = forwardRef(({ ...props }: Props, ref) => {
    const localRef = useRef<THREE.ShaderMaterial & {
        uTime: number, uMouse: THREE.Vector2, uColor:THREE.Color, uResolution?: THREE.Vector2}>(null!)

    useImperativeHandle(ref, () => localRef.current)

    useFrame((_, delta) => {
        localRef.current.uTime += delta
    })
    return <virusCitiesShaderImp key={VirusCitiesShaderImp.key} ref={localRef} {...props} attach='material' />
})
VirusCitiesShader.displayName = 'VirusCitiesShader'

export default function Page() {
    return <Canvas  style={{position: "absolute", top: "0", zIndex: "-1", backgroundColor: '#51ebff'}}>
        <Scene />
        <OrbitControls />
        <Float>
            <Html position={[0, -2, 1]}
                  center transform as="h1" className={caveat.className} scale={0.25}>
                <div style={{ transform: 'scale(4)', textAlign: 'center', color: '#af8c63' }}>
                    Terrible Travel Plans
                </div>
            </Html>
        </Float>
    </Canvas>
}

type GLTFResult = GLTF & {
    nodes: {
        [key: string]: THREE.Mesh
    }
    materials: {}
}

function Scene() {
    const camera = useThree((state) => state.camera)
    const view = useThree((state) => state.viewport)
    const [simCamera] = useState(() => new THREE.OrthographicCamera(-1, 1, 1, -1, 1 / Math.pow(2, 53), 1))
    const [simScene] = useState(() => new THREE.Scene())
    const shader = useRef<VirusCitiesShaderUniforms & ShaderMaterial>(null!)
    const simShader = useRef<SimCitiesShaderUniforms & ShaderMaterial>(null!)
    const points = useRef<THREE.Points>(null!)

    const tGeo = useGLTF('/cityVirusPoints.glb') as GLTFResult

    const { positions, scales } = useMemo(() => {
        const positions = {} as {[key: string]: [number,number,number]}
        const scales = {} as {[key: string]: number}
        Object.keys(tGeo.nodes).forEach((key) => {
            positions[key] = [tGeo.nodes[key].position.x, tGeo.nodes[key].position.y, tGeo.nodes[key].position.z]
            scales[key] = tGeo.nodes[key].scale.x
        })
        return { positions, scales }
    }, [])

    /*const { size, texture } = useMemo(() => {

        const tMesh = tGeo.scene.children[0] as THREE.Mesh
        const size = Math.ceil(Math.sqrt(tMesh.geometry.attributes.position.array.length / 3))
        const data = new Float32Array(size * size * 4)
        for (let i = 0; i < size * size; i++) {
            const d = i * 4
            const t = i * 3
            data[d] = tMesh.geometry.attributes.position.array[t]
            data[d + 1] = tMesh.geometry.attributes.position.array[t + 1]
            data[d + 2] = tMesh.geometry.attributes.position.array[t + 2]
            data[d + 3] = 1
            if (isNaN(data[d])) {
                data[d] = 0
                data[d + 1] = 0
                data[d + 2] = 0
            }

            const u = i * 2
            tMesh.geometry.attributes.uv.array[u] = (i % size) / size
            tMesh.geometry.attributes.uv.array[u + 1] = Math.floor(i / size) / size
        }

        return {
            size: size,
            texture: new THREE.DataTexture(data, size, size, THREE.RGBAFormat, THREE.FloatType)
        }
    }, [tGeo])*/

    /*const target = useFBO(size, size, {
        minFilter: THREE.NearestFilter,
        magFilter: THREE.NearestFilter,
        format: THREE.RGBAFormat,
        type: THREE.FloatType
    })*/

    useEffect(() => {
        /*simShader.current.uPositions = texture
        simShader.current.uPositions.needsUpdate = true*/
    }, []);

    /*useFrame((state) => {
        state.gl.setRenderTarget(target)
        state.gl.clear()
        state.gl.render(simScene, simCamera)
        state.gl.setRenderTarget(null)
        shader.current.uPositions = target.texture as DataTexture
        shader.current.uCamera = camera.position
    })*/

    return <>
        {createPortal(
            <mesh>
                <planeGeometry args={[2, 2]}/>
                <SimCitiesShader ref={simShader} />
            </mesh>,
            simScene
        )}

        <group rotation={[Math.PI * 0.5, 0, 0]} scale={4.9 * (view.width / 11.0)} position={[-0.05, -0.35, 0]}>
            {Object.keys(positions).map((key, i) => (
                Object.keys(scales).map((toKey, j) => (
                    <TranLine
                        key={key + toKey + i + j}
                        start={
                            positions[key]
                        }
                        end={
                            positions[toKey]
                        }
                        intensity={new Vector3(
                            positions[key][0],
                            positions[key][1],
                            positions[key][2]
                        ).distanceTo(new Vector3(
                            positions[toKey][0],
                            positions[toKey][1],
                            positions[toKey][2]
                        ))}
                        off={i * 0.1 + j * 0.1 * Math.random()}
                    />
                ))
            ))}
        </group>

        <Svg src={'/US States.svg'}
             scale={0.013 * (view.width / 11.0)}
             position={[-3.1 * (view.width / 11.0), 2.8 * (view.width / 11.0), 0]}/>

        {/*<group position={[0, -0.5 * (view.width / 11.0), 0]} rotation={[Math.PI * 0.5, 0, 0]}>
            <points ref={points} scale={ 5 * (view.width / 11.0) }>
                <bufferGeometry attach="geometry" {...tGeo.nodes.Cities001.geometry} />
                <VirusCitiesShader ref={shader}
                               uPositions={texture}
                               depthWrite={false}
                               transparent
                               blending={THREE.NormalBlending}
                               uColor={new THREE.Color(0.96, 0.5333, 0.204)}/>
            </points>
        </group>*/}
    </>
}

useGLTF.preload('/cityVirusPoints.glb')

function TranLine({start, end, intensity, off}: {
    start: [number,number,number],
    end: [number,number,number],
    intensity: number,
    off: number
}) {
    const lineRef = useRef<Line2>(null!)

    useEffect(() => {
        lineRef.current.material.transparent = true
        lineRef.current.material.opacity = 0.5
        lineRef.current.material.blending = THREE.NormalBlending
        console.log(intensity)
    }, [])

    useFrame(() => {
        if (lineRef.current && lineRef.current.material) {
            lineRef.current.material.uniforms.dashOffset.value += 0.0003
            if (lineRef.current.material.uniforms.dashOffset.value > 1) {
                lineRef.current.material.uniforms.dashOffset.value = 0
            }
        }
    })

    return <Line
        points={[start, end]}
        ref={lineRef}
        lineWidth={(1 - intensity) * 3}
        dashed
        dashOffset={0.2 * off}
        gapSize={0.05 * intensity}
        dashSize={0.005 * intensity}
        color={'#685a13'}
    />
}
