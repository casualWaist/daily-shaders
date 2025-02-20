'use client'

import {Canvas, MaterialNode, MaterialProps, useThree, createPortal} from "@react-three/fiber"
import * as THREE from 'three'
import { extend, useFrame } from '@react-three/fiber'
import { Float, Html, OrbitControls, shaderMaterial, useFBO, useGLTF, useTexture} from '@react-three/drei'
import vertex from './vertex.glsl'
import fragment from './fragment.glsl'
import React, {forwardRef, useEffect, useImperativeHandle, useMemo, useRef, useState} from 'react'
import {Caveat} from "next/font/google"
import {DataTexture, ShaderMaterial} from "three"
import {GLTF} from "three-stdlib"

const caveat = Caveat({
    subsets: ['latin'],
    variable: '--font-caveat'
})

const SimulacraShaderImp = shaderMaterial({
    uPositions: new THREE.DataTexture(),
    uTexture: new THREE.Texture(),
    uTime: 0,
    uCurlFreq: 0.25,
},`
    varying vec2 vUv;
    void main() {
        vUv = uv;
        gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
    }`, `
    uniform sampler2D uPositions;
    uniform sampler2D uTexture;
    uniform float uTime;
    uniform float uCurlFreq;
    varying vec2 vUv;
      
    vec3 mod289(vec3 x) {
      return x - floor(x * (1.0 / 289.0)) * 289.0;
    }
    
    vec4 mod289(vec4 x) {
      return x - floor(x * (1.0 / 289.0)) * 289.0;
    }
    
    vec4 permute(vec4 x) {
      return mod289(((x*34.0)+1.0)*x);
    }
    
    vec4 taylorInvSqrt(vec4 r) {
      return 1.79284291400159 - 0.85373472095314 * r;
    }
    
    vec3 fade(vec3 t) {
      return t*t*t*(t*(t*6.0-15.0)+10.0);
    }
    
    // Classic Perlin noise
    float noise(vec3 P) {
      vec3 Pi0 = floor(P); // Integer part for indexing
      vec3 Pi1 = Pi0 + vec3(1.0); // Integer part + 1
      Pi0 = mod289(Pi0);
      Pi1 = mod289(Pi1);
      vec3 Pf0 = fract(P); // Fractional part for interpolation
      vec3 Pf1 = Pf0 - vec3(1.0); // Fractional part - 1.0
      vec4 ix = vec4(Pi0.x, Pi1.x, Pi0.x, Pi1.x);
      vec4 iy = vec4(Pi0.yy, Pi1.yy);
      vec4 iz0 = Pi0.zzzz;
      vec4 iz1 = Pi1.zzzz;
    
      vec4 ixy = permute(permute(ix) + iy);
      vec4 ixy0 = permute(ixy + iz0);
      vec4 ixy1 = permute(ixy + iz1);
    
      vec4 gx0 = ixy0 * (1.0 / 7.0);
      vec4 gy0 = fract(floor(gx0) * (1.0 / 7.0)) - 0.5;
      gx0 = fract(gx0);
      vec4 gz0 = vec4(0.5) - abs(gx0) - abs(gy0);
      vec4 sz0 = step(gz0, vec4(0.0));
      gx0 -= sz0 * (step(0.0, gx0) - 0.5);
      gy0 -= sz0 * (step(0.0, gy0) - 0.5);
    
      vec4 gx1 = ixy1 * (1.0 / 7.0);
      vec4 gy1 = fract(floor(gx1) * (1.0 / 7.0)) - 0.5;
      gx1 = fract(gx1);
      vec4 gz1 = vec4(0.5) - abs(gx1) - abs(gy1);
      vec4 sz1 = step(gz1, vec4(0.0));
      gx1 -= sz1 * (step(0.0, gx1) - 0.5);
      gy1 -= sz1 * (step(0.0, gy1) - 0.5);
    
      vec3 g000 = vec3(gx0.x,gy0.x,gz0.x);
      vec3 g100 = vec3(gx0.y,gy0.y,gz0.y);
      vec3 g010 = vec3(gx0.z,gy0.z,gz0.z);
      vec3 g110 = vec3(gx0.w,gy0.w,gz0.w);
      vec3 g001 = vec3(gx1.x,gy1.x,gz1.x);
      vec3 g101 = vec3(gx1.y,gy1.y,gz1.y);
      vec3 g011 = vec3(gx1.z,gy1.z,gz1.z);
      vec3 g111 = vec3(gx1.w,gy1.w,gz1.w);
    
      vec4 norm0 = taylorInvSqrt(vec4(dot(g000, g000), dot(g010, g010), dot(g100, g100), dot(g110, g110)));
      g000 *= norm0.x;
      g010 *= norm0.y;
      g100 *= norm0.z;
      g110 *= norm0.w;
      vec4 norm1 = taylorInvSqrt(vec4(dot(g001, g001), dot(g011, g011), dot(g101, g101), dot(g111, g111)));
      g001 *= norm1.x;
      g011 *= norm1.y;
      g101 *= norm1.z;
      g111 *= norm1.w;
    
      float n000 = dot(g000, Pf0);
      float n100 = dot(g100, vec3(Pf1.x, Pf0.yz));
      float n010 = dot(g010, vec3(Pf0.x, Pf1.y, Pf0.z));
      float n110 = dot(g110, vec3(Pf1.xy, Pf0.z));
      float n001 = dot(g001, vec3(Pf0.xy, Pf1.z));
      float n101 = dot(g101, vec3(Pf1.x, Pf0.y, Pf1.z));
      float n011 = dot(g011, vec3(Pf0.x, Pf1.yz));
      float n111 = dot(g111, Pf1);
    
      vec3 fade_xyz = fade(Pf0);
      vec4 n_z = mix(vec4(n000, n100, n010, n110), vec4(n001, n101, n011, n111), fade_xyz.z);
      vec2 n_yz = mix(n_z.xy, n_z.zw, fade_xyz.y);
      float n_xyz = mix(n_yz.x, n_yz.y, fade_xyz.x);
      return 2.2 * n_xyz;
    }
    
    float snoise(vec3 v){
        const vec2  C = vec2(1.0/6.0, 1.0/3.0) ;
        const vec4  D = vec4(0.0, 0.5, 1.0, 2.0);
        
        // First corner
        vec3 i  = floor(v + dot(v, C.yyy) );
        vec3 x0 =   v - i + dot(i, C.xxx) ;
        
        // Other corners
        vec3 g = step(x0.yzx, x0.xyz);
        vec3 l = 1.0 - g;
        vec3 i1 = min( g.xyz, l.zxy );
        vec3 i2 = max( g.xyz, l.zxy );
        
        //   x0 = x0 - 0.0 + 0.0 * C.xxx;
        //   x1 = x0 - i1  + 1.0 * C.xxx;
        //   x2 = x0 - i2  + 2.0 * C.xxx;
        //   x3 = x0 - 1.0 + 3.0 * C.xxx;
        vec3 x1 = x0 - i1 + C.xxx;
        vec3 x2 = x0 - i2 + C.yyy; // 2.0*C.x = 1/3 = C.y
        vec3 x3 = x0 - D.yyy;      // -1.0+3.0*C.x = -0.5 = -D.y
        
        // Permutations
        i = mod289(i);
        vec4 p = permute( permute( permute(
                 i.z + vec4(0.0, i1.z, i2.z, 1.0 ))
               + i.y + vec4(0.0, i1.y, i2.y, 1.0 ))
               + i.x + vec4(0.0, i1.x, i2.x, 1.0 ));
        
        // Gradients: 7x7 points over a square, mapped onto an octahedron.
        // The ring size 17*17 = 289 is close to a multiple of 49 (49*6 = 294)
        float n_ = 0.142857142857; // 1.0/7.0
        vec3  ns = n_ * D.wyz - D.xzx;
        
        vec4 j = p - 49.0 * floor(p * ns.z * ns.z);  //  mod(p,7*7)
        
        vec4 x_ = floor(j * ns.z);
        vec4 y_ = floor(j - 7.0 * x_ );    // mod(j,N)
        
        vec4 x = x_ *ns.x + ns.yyyy;
        vec4 y = y_ *ns.x + ns.yyyy;
        vec4 h = 1.0 - abs(x) - abs(y);
        
        vec4 b0 = vec4( x.xy, y.xy );
        vec4 b1 = vec4( x.zw, y.zw );
        
        //vec4 s0 = vec4(lessThan(b0,0.0))*2.0 - 1.0;
        //vec4 s1 = vec4(lessThan(b1,0.0))*2.0 - 1.0;
        vec4 s0 = floor(b0)*2.0 + 1.0;
        vec4 s1 = floor(b1)*2.0 + 1.0;
        vec4 sh = -step(h, vec4(0.0));
        
        vec4 a0 = b0.xzyw + s0.xzyw*sh.xxyy ;
        vec4 a1 = b1.xzyw + s1.xzyw*sh.zzww ;
        
        vec3 p0 = vec3(a0.xy,h.x);
        vec3 p1 = vec3(a0.zw,h.y);
        vec3 p2 = vec3(a1.xy,h.z);
        vec3 p3 = vec3(a1.zw,h.w);
        
        //Normalise gradients
        vec4 norm = taylorInvSqrt(vec4(dot(p0,p0), dot(p1,p1), dot(p2, p2), dot(p3,p3)));
        p0 *= norm.x;
        p1 *= norm.y;
        p2 *= norm.z;
        p3 *= norm.w;
        
        // Mix final noise value
        vec4 m = max(0.6 - vec4(dot(x0,x0), dot(x1,x1), dot(x2,x2), dot(x3,x3)), 0.0);
        m = m * m;
        return 42.0 * dot( m*m, vec4( dot(p0,x0), dot(p1,x1),
                                    dot(p2,x2), dot(p3,x3) ) );
    }
    
    vec3 snoiseVec3( vec3 x ){
      float s  = snoise(vec3( x ));
      float s1 = snoise(vec3( x.y - 19.1 , x.z + 33.4 , x.x + 47.2 ));
      float s2 = snoise(vec3( x.z + 74.2 , x.x - 124.5 , x.y + 99.4 ));
      vec3 c = vec3( s , s1 , s2 );
      return c;
    }
    
    vec3 curl( vec3 p ){
        const float e = .1;
        vec3 dx = vec3( e   , 0.0 , 0.0 );
        vec3 dy = vec3( 0.0 , e   , 0.0 );
        vec3 dz = vec3( 0.0 , 0.0 , e   );
        
        vec3 p_x0 = snoiseVec3( p - dx );
        vec3 p_x1 = snoiseVec3( p + dx );
        vec3 p_y0 = snoiseVec3( p - dy );
        vec3 p_y1 = snoiseVec3( p + dy );
        vec3 p_z0 = snoiseVec3( p - dz );
        vec3 p_z1 = snoiseVec3( p + dz );
        
        float x = p_y1.z - p_y0.z - p_z1.y + p_z0.y;
        float y = p_z1.x - p_z0.x - p_x1.z + p_x0.z;
        float z = p_x1.y - p_x0.y - p_y1.x + p_y0.x;
        
        const float divisor = 1.0 / ( 2.0 * e );
        return normalize( vec3( x , y , z ) * divisor );
    }
      
    void main() {
        float t = uTime * 0.15;
        vec3 pos = texture(uPositions, vUv).rgb;
        vec3 curlPos = texture(uTexture, vec2(vUv.x, vUv.y + uTime * 0.05)).rgb;
        curlPos.z = mix(pos.z, curlPos.z, uTime * 0.1);
        //pos = pos - curl(pos + t) * 0.01;
        //curlPos = curl(curlPos * uCurlFreq + t);
        gl_FragColor = vec4(vec3(pos.x * 0.5, pos.yz * curlPos.yz), 1.0);
    }`
)

extend({ SimulacraShaderImp })

declare global {
    namespace JSX {
        interface IntrinsicElements {
            simulacraShaderImp: MaterialNode<any, typeof THREE.MeshStandardMaterial>
        }
    }
}

export type SimulacraShaderUniforms = {
    uTime?: number
    uPositions?: THREE.DataTexture
    uTexture?: THREE.Texture
    uCurlFreq?: number
}

type SimProps = SimulacraShaderUniforms & MaterialProps

const SimulacraShader = forwardRef(({ ...props }: SimProps, ref) => {
    const localRef = useRef<THREE.ShaderMaterial & {
        uTime: number, uPositions: THREE.DataTexture, uTexture: THREE.Texture, uCurlFreq: number}>(null!)
    const texture = useTexture('/noise.png')
    texture.wrapS = texture.wrapT = THREE.RepeatWrapping

    useImperativeHandle(ref, () => localRef.current)

    useEffect(() => {
        localRef.current.uTexture = texture
        localRef.current.uTexture.needsUpdate = true
    }, [])

    useFrame((_, delta) => {
        localRef.current.uTime += delta
        localRef.current.uCurlFreq = THREE.MathUtils.lerp(localRef.current.uCurlFreq, 0.25, 0.1)
    })
    return <simulacraShaderImp key={SimulacraShaderImp.key} ref={localRef} {...props} attach='material' />
})
SimulacraShader.displayName = 'SimulacraShader'

const Mist24ShaderImp = shaderMaterial({
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

extend({ Mist24ShaderImp })

declare global {
    namespace JSX {
        interface IntrinsicElements {
            mist24ShaderImp: MaterialNode<any, typeof THREE.MeshStandardMaterial>
        }
    }
}

export type Mist24ShaderUniforms = {
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

type Props = Mist24ShaderUniforms & MaterialProps

const Mist24Shader = forwardRef(({ ...props }: Props, ref) => {
    const localRef = useRef<THREE.ShaderMaterial & {
        uTime: number, uMouse: THREE.Vector2, uColor:THREE.Color, uResolution?: THREE.Vector2}>(null!)

    useImperativeHandle(ref, () => localRef.current)

    useFrame((_, delta) => {
        localRef.current.uTime += delta
    })
    return <mist24ShaderImp key={Mist24ShaderImp.key} ref={localRef} {...props} attach='material' />
})
Mist24Shader.displayName = 'Mist24Shader'

export default function Page() {
    return <Canvas  style={{position: "absolute", top: "0", zIndex: "-1", backgroundColor: '#0a374b'}}>
        <Scene />
        <OrbitControls />
        <Float>
            <Html position={[0, -2, 1]}
                  center transform as="h1" className={caveat.className} scale={0.25}>
                <div style={{ transform: 'scale(4)', textAlign: 'center', color: 'white' }}>
                    DeBUBBLES!DeBUBBLES!
                </div>
                <div style={{ transform: 'scale(2)', textAlign: 'center', color: 'white', paddingTop: '0.5em' }}>
                    DeBUBBLES!DeBUBBLES!
                </div>
                <div style={{ textAlign: 'center', color: 'white', paddingTop: '0.5em' }}>
                    DeBUBBLES!DeBUBBLES!
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
    const camera = useThree((state) => state.camera)
    const view = useThree((state) => state.viewport)
    const [simCamera] = useState(() => new THREE.OrthographicCamera(-1, 1, 1, -1, 1 / Math.pow(2, 53), 1))
    const [simScene] = useState(() => new THREE.Scene())
    const shader = useRef<Mist24ShaderUniforms & ShaderMaterial>(null!)
    const simShader = useRef<SimulacraShaderUniforms & ShaderMaterial>(null!)
    const points = useRef<THREE.Points>(null!)

    const tGeo = useGLTF('/24.glb') as GLTFResult

    const { size, texture } = useMemo(() => {

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
    }, [tGeo])

    const target = useFBO(size, size, {
        minFilter: THREE.NearestFilter,
        magFilter: THREE.NearestFilter,
        format: THREE.RGBAFormat,
        type: THREE.FloatType
    })

    useEffect(() => {
        simShader.current.uPositions = texture
        simShader.current.uPositions.needsUpdate = true
    }, []);

    useFrame((state) => {
        state.gl.setRenderTarget(target)
        state.gl.clear()
        state.gl.render(simScene, simCamera)
        state.gl.setRenderTarget(null)
        shader.current.uPositions = target.texture as DataTexture
        shader.current.uCamera = camera.position
        points.current.rotation.z = state.clock.elapsedTime * 0.25
    })

    return <>
        {createPortal(
            <mesh>
                <planeGeometry args={[2, 2]}/>
                <SimulacraShader ref={simShader} />
            </mesh>,
            simScene
        )}
        <group position={[0, -1.5 * (view.width / 11.0), 0]} rotation={[Math.PI * 0.5, 0, 0]}>
            <points ref={points} scale={ 5 * (view.width / 11.0) }>
                <bufferGeometry attach="geometry" {...tGeo.nodes.Text.geometry} />
                <Mist24Shader ref={shader}
                               uPositions={texture}
                               depthWrite={false}
                               transparent
                               blending={THREE.NormalBlending}
                               uColor={new THREE.Color(0.96, 0.5333, 0.204)}/>
            </points>
        </group>
    </>
}
