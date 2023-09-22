import './App.css'
import Sketch from './Sketch'
import {LazyMotion, domAnimation, m, useScroll, useTransform} from 'framer-motion'

export default function App() {
  const {scrollYProgress} = useScroll();
  const scale = useTransform(scrollYProgress, [0, 0.5], [1, 2])
  const opacity = useTransform(scrollYProgress, [0, 0.5], [1, 0])
  
  return (
    <LazyMotion features={domAnimation}>
      <main>
          <m.h6 style={{scale, opacity}}>BEM-VINDO À SUÍTE DE</m.h6>
          <m.h5 style={{scale, opacity}}>JOGOS DO</m.h5>
          <m.h4 style={{scale, opacity}}>NTM</m.h4>
          
          
        <div className="container">
          <Sketch />
          
        </div>
      </main>
    </LazyMotion>
  )
}