import { GLTFLoader } from 'three/examples/jsm/Addons.js'
import { useLoader, useFrame } from '@react-three/fiber'
import { PresentationControls, Float, Html, Text3D } from '@react-three/drei'
import { useControls } from 'leva'
import { useRef, useState, useEffect } from 'react'
import * as THREE from 'three'

// Import shaders
import vertexShader from '../shaders/holographic/vertex.glsl'
import fragmentShader from '../shaders/holographic/fragment.glsl'
import { Button } from 'antd'

export default function Model() {
    const model = useLoader(GLTFLoader, './3d models/self.glb')
    const modelPosition = useControls('model', {position: [0.02, -0.51, -1.5]})
    const modelScale = useControls('model', {scale: [3,3,3]})
    const modelRotation = useControls('model', {rotation: [-0.42, 1.47, 0.69]})

    const materialRef = useRef()
    const modelRef = useRef()
    const planeRef = useRef()
    const [isHovered, setIsHovered] = useState(false)
    
    // Add refs for scroll tracking
    const scrollRef = useRef(0)
    const lastScrollY = useRef(0)
    
    const planeGeometry = new THREE.PlaneGeometry(1, 0.5)

    // Create shader material
    useEffect(() => {
        const material = new THREE.ShaderMaterial({
            vertexShader,
            fragmentShader,
            uniforms: {
                uTime: { value: 0 },
                uColor: { value: new THREE.Color(0.1, 0.6, 0.9) }
            },
            transparent: true,
            side: THREE.DoubleSide,
            depthWrite: false,
            blending: THREE.AdditiveBlending
        })

        // Apply material to all meshes in the model
        model.scene.traverse((child) => {
            if (child.isMesh && child.material.name === 'Glasses_lenses_blue.001') {
                child.material = material
                materialRef.current = material               
            }
        })
    }, [model])

    useEffect(() => {
        // Set initial position and rotation
        if (planeRef.current) {
            planeRef.current.position.set(1, 0, 0) // Starting position
            planeRef.current.lookAt(0, 0, 0)
            planeRef.current.rotateY(Math.PI) // Make text face outward
        }

        const handleScroll = (e) => {
            if (planeRef.current) {
                const currentScrollY = window.scrollY
                const scrollDelta = currentScrollY - lastScrollY.current
                
                // Update scroll position
                scrollRef.current += scrollDelta * 0.005 // Adjust multiplier to control sensitivity
                
                // Calculate new position based on scroll
                const radius = 25 // Increased radius for better visibility
                planeRef.current.position.x = Math.cos(scrollRef.current) * radius
                planeRef.current.position.z = Math.sin(scrollRef.current) * radius
                
                // Make plane face center
                planeRef.current.lookAt(0, 0, 0)
                planeRef.current.rotateY(Math.PI) // Keep text facing outward
                
                lastScrollY.current = currentScrollY
            }
        }

        window.addEventListener('scroll', handleScroll)
        return () => window.removeEventListener('scroll', handleScroll)
    }, [])

    // Update shader uniforms only
    useFrame((state, delta) => {
        if (materialRef.current) {
            materialRef.current.uniforms.uTime.value += delta
        }
    })

    const modelBehavior = () => {
        setIsHovered(true)
    }

    const modelReset = () => {
        setIsHovered(false)
    }

    return (
        <>
            <PresentationControls
                global
                rotation={[0.13, 0.1, 0]}
                polar={[-0.4, 0.2]}
                azimuth={[-1, 0.75]}
                config={{ mass: 2, tension: 400 }}
                snap={{ mass: 4, tension: 400 }}
            >
                <Float rotationIntensity={0.4}>
                    <primitive 
                        object={model.scene}
                        position={modelPosition.position}
                        scale={modelScale.scale}
                        rotation={modelRotation.rotation}
                        ref={modelRef}
                        onPointerOver={modelBehavior}
                        onPointerOut={modelReset}
                    />
                </Float>
            </PresentationControls>
            <mesh 
                ref={planeRef}
                geometry={planeGeometry}
                material={materialRef.current}
            >
                <Html
                    transform
                    wrapperClass='htmlContent'
                    occlude={[modelRef]}
                    position={[0, 0, 0.1]}
                    style={{
                        fontSize: '0.12em',
                        color: 'white',
                        background: 'rgba(0,0,0,0.5)',
                        padding: '10px',
                        borderRadius: '2px',
                        pointerEvents: 'none'
                    }}
                >
                    <div className='case-study-card'>
                        <img
                            src='./images/Project Cover Photos/Home Page.svg' 
                            alt='Spatial Notes - Interactive 3D Note-taking Application' 
                            className='case-study-image'
                        />
                        <p>Spatial Notes</p>
                        <Button zIndex={100}>View Case Study</Button>
                    </div>
                </Html>
            </mesh>
        </>
    )
}