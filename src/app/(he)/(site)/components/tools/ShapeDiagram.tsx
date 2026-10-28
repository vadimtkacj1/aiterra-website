import type { ReactNode } from 'react'
import type { ShapeId } from '@/lib/area-volume'
import styles from './AreaVolumeCalculator.module.css'

const Label = ({ x, y, children }: { x: number; y: number; children: ReactNode }) => (
  <text x={x} y={y} className={styles.svgLabel} textAnchor="middle" dominantBaseline="middle">
    {children}
  </text>
)

const Dash = ({ x1, y1, x2, y2 }: { x1: number; y1: number; x2: number; y2: number }) => (
  <line x1={x1} y1={y1} x2={x2} y2={y2} className={styles.svgDash} />
)

const drawings: Record<ShapeId, ReactNode> = {
  square: (
    <>
      <rect x="60" y="20" width="100" height="100" className={styles.svgShape} />
      <Label x={110} y={134}>a</Label>
    </>
  ),
  rectangle: (
    <>
      <rect x="30" y="35" width="160" height="80" className={styles.svgShape} />
      <Label x={110} y={130}>a</Label>
      <Label x={202} y={75}>b</Label>
    </>
  ),
  triangle: (
    <>
      <polygon points="30,120 190,120 130,25" className={styles.svgShape} />
      <Dash x1={130} y1={25} x2={130} y2={120} />
      <Label x={110} y={134}>b</Label>
      <Label x={142} y={78}>h</Label>
    </>
  ),
  circle: (
    <>
      <circle cx="110" cy="72" r="55" className={styles.svgShape} />
      <Dash x1={110} y1={72} x2={165} y2={72} />
      <Label x={138} y={62}>r</Label>
    </>
  ),
  trapezoid: (
    <>
      <polygon points="25,120 195,120 150,30 70,30" className={styles.svgShape} />
      <Dash x1={70} y1={30} x2={70} y2={120} />
      <Label x={110} y={20}>a</Label>
      <Label x={110} y={134}>b</Label>
      <Label x={60} y={78}>h</Label>
    </>
  ),
  parallelogram: (
    <>
      <polygon points="20,120 160,120 200,30 60,30" className={styles.svgShape} />
      <Dash x1={60} y1={30} x2={60} y2={120} />
      <Label x={90} y={134}>b</Label>
      <Label x={50} y={78}>h</Label>
    </>
  ),
  rhombus: (
    <>
      <polygon points="110,15 185,72 110,129 35,72" className={styles.svgShape} />
      <Dash x1={35} y1={72} x2={185} y2={72} />
      <Dash x1={110} y1={15} x2={110} y2={129} />
      <Label x={150} y={62}>d1</Label>
      <Label x={122} y={100}>d2</Label>
    </>
  ),
  hexagon: (
    <>
      <polygon points="80,20 140,20 170,72 140,124 80,124 50,72" className={styles.svgShape} />
      <Label x={110} y={10}>a</Label>
    </>
  ),
  cube: (
    <>
      <polygon points="50,50 140,50 140,130 50,130" className={styles.svgShape} />
      <polygon points="50,50 80,20 170,20 140,50" className={styles.svgShape} />
      <polygon points="140,50 170,20 170,100 140,130" className={styles.svgShape} />
      <Label x={95} y={142}>a</Label>
    </>
  ),
  box: (
    <>
      <polygon points="25,60 155,60 155,125 25,125" className={styles.svgShape} />
      <polygon points="25,60 60,25 190,25 155,60" className={styles.svgShape} />
      <polygon points="155,60 190,25 190,90 155,125" className={styles.svgShape} />
      <Label x={90} y={138}>a</Label>
      <Label x={182} y={115}>b</Label>
      <Label x={14} y={92}>c</Label>
    </>
  ),
  cylinder: (
    <>
      <path d="M55 30 V115 A55 15 0 0 0 165 115 V30" className={styles.svgShape} />
      <ellipse cx="110" cy="30" rx="55" ry="15" className={styles.svgShape} />
      <Dash x1={110} y1={30} x2={165} y2={30} />
      <Label x={138} y={22}>r</Label>
      <Label x={178} y={72}>h</Label>
    </>
  ),
  cone: (
    <>
      <path d="M110 15 L55 115 A55 15 0 0 0 165 115 Z" className={styles.svgShape} />
      <Dash x1={110} y1={15} x2={110} y2={115} />
      <Dash x1={110} y1={115} x2={165} y2={115} />
      <Label x={138} y={106}>r</Label>
      <Label x={100} y={68}>h</Label>
    </>
  ),
  sphere: (
    <>
      <circle cx="110" cy="72" r="58" className={styles.svgShape} />
      <ellipse cx="110" cy="72" rx="58" ry="16" className={styles.svgThin} />
      <Dash x1={110} y1={72} x2={168} y2={72} />
      <Label x={140} y={62}>r</Label>
    </>
  ),
  pyramid: (
    <>
      <polygon points="30,115 150,115 190,85 70,85" className={styles.svgShape} />
      <polygon points="110,15 30,115 150,115" className={styles.svgShape} />
      <polygon points="110,15 150,115 190,85" className={styles.svgShape} />
      <Dash x1={110} y1={15} x2={110} y2={100} />
      <Label x={90} y={130}>a</Label>
      <Label x={180} y={108}>b</Label>
      <Label x={100} y={60}>h</Label>
    </>
  ),
  prism: (
    <>
      <polygon points="25,120 85,120 55,50" className={styles.svgShape} />
      <polygon points="55,50 165,25 195,95 85,120" className={styles.svgShape} />
      <polygon points="85,120 195,95 135,95" className={styles.svgThin} />
      <Dash x1={55} y1={50} x2={55} y2={120} />
      <Label x={55} y={134}>b</Label>
      <Label x={45} y={88}>h</Label>
      <Label x={150} y={120}>L</Label>
    </>
  ),
}

export default function ShapeDiagram({ shape, name }: { shape: ShapeId; name: string }) {
  return (
    <svg viewBox="0 0 220 150" className={styles.diagram} role="img" aria-label={`שרטוט: ${name}`} direction="ltr">
      {drawings[shape]}
    </svg>
  )
}
