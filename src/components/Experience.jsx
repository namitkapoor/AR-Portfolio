import { Html, Text,Environment, ContactShadows } from '@react-three/drei'
import { Suspense, useRef } from 'react'
import Model from './Model.jsx'
import { useControls } from 'leva'

export default function Experience()
{
    const htmlRef = useRef() // Create a reference for the Html element
    const htmlPosition = useControls('htmlRef', {position:[0.014000000000000208,1.1349999999999865,-0.4220000000000003]})
    const htmlRotation = useControls('htmlRef', {rotation:[-0.5410000000000004,-0.046999999999999986,0]})
    const wandaTextRotation = useControls('wandaText', {rotation: [0, 0, 0]})
    const wandaTextPosition = useControls('wandaText', {position: [0, 0, 0]})
    const shadowRotation = useControls('shadow', {rotation: [0, 0, 0]}) 

    return <>

        {/* <Perf position="top-left" /> */}
        
        {/* <Links/> */}   
        <Environment preset="city" />
        <color args={['#1a1a1a']} attach = "background"/>
        {/* <OrbitControls makeDefault /> */}
        <Model/>       
        <ContactShadows scale={10} className='shadow' rotation-z={Math.PI / 2} position-z={-2} position-y={-10} blur={5}/>
    </>
}