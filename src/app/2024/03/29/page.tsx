'use client'

import {Canvas, extend, MaterialNode, useFrame, useThree} from "@react-three/fiber"
import {Float, Html, shaderMaterial, OrbitControls, Grid, Line, Text} from "@react-three/drei"
import { Caveat } from "next/font/google"
import fragment from './fragment.glsl'
import vertex from './vertex.glsl'
import * as THREE from 'three'
import {forwardRef, Suspense, useEffect, useImperativeHandle, useRef} from "react"

const caveat = Caveat({
    subsets: ['latin'],
    variable: '--font-caveat'
})

const TextCoverShaderImp = shaderMaterial({
    uTime: 0,
    uResolution: typeof window !== 'undefined' ? new THREE.Vector2(window.innerWidth, window.innerHeight) : new THREE.Vector2(1, 1),
}, vertex, fragment)

extend({ TextCoverShaderImp })

declare global {
    namespace JSX {
        interface IntrinsicElements {
            textCoverShaderImp: MaterialNode<any, typeof THREE.MeshStandardMaterial>
        }
    }
}

type Props = {
    uTime?: number,
    uResolution?: THREE.Vector2
} & JSX.IntrinsicElements['meshStandardMaterial']

const TextCoverShader = forwardRef(({...props}: Props, ref) => {
    const localRef = useRef<Props>(null!)
    useImperativeHandle(ref, () => localRef.current)

    useFrame((_, delta) => {
        localRef.current.uTime! += delta
    })
    return <textCoverShaderImp key={TextCoverShaderImp.key} ref={localRef} attach="material" {...props} />
})
TextCoverShader.displayName = 'TextCoverShader'

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
                <div style={{transform: 'scale(4)', backgroundColor: '#fff', borderRadius: '100%'}}>
                    Text Bubble
                </div>
            </Html>
            <Grid args={[10, 10]} position={[0, 0, 0]} scale={[2, 2, 2]}/>
            <Line points={[[0, -1, 0], [0, 1, 0]]} color={'#000001'} lineWidth={2}/>
        </Float>
        <color attach="background" args={['#ffe600']}/>
        <OrbitControls/>
    </Canvas>
}

function Scene() {
    const view = useThree((state) => state.viewport)
    const textRef = useRef<THREE.Mesh>(null!)
    useEffect(() => {
        console.log(textRef.current)
    }, [])
    return <>
        <Suspense fallback={null}>
            <Text
                ref={textRef}
                fontSize={1}
                maxWidth={view.width}
                lineHeight={0.5}
                letterSpacing={0.02}
                textAlign={'left'}
                anchorX="center"
                anchorY="middle"
            >
                <TextCoverShader/>
                2100mm
            </Text>
        </Suspense>
    </>
}

/*
    Uniforms
    uTroikaBlurRadius: float
    uTroikaClipRect: vec4
    uTroikaCurveRadius:float
    uTroikaDistanceOffset: float
    uTroikaFillOpacity: float
    uTroikaOrient: mat3
    uTroikaOutlineOpacity: float
    uTroikaPositionOffset: vec2
    uTroikaSDFDebug: boolean
    uTroikaSDFExponent: float
    uTroikaSDFGlyphSize: float
    uTroikaSDFTexture: THREE.Texture
    uTroikaSDFTextureSize:vec2
    uTroikaStrokeColor: vec3
    uTroikaStrokeOpacity: float
    uTroikaStrokeWidth: float
    uTroikaTotalBounds:vec4
    uTroikaUseGlyphColors: boolean

    Attributes
    aTroikaGlyphBounds: vec4
    aTroikaGlyphIndex: float
*/
