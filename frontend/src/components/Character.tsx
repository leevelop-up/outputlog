import type { ShopItem } from '@/types'

// ── 배경 레이어 ─────────────────────────────────────────
function Background({ itemKey }: { itemKey?: string }) {
  const size = 160
  if (itemKey === 'bg_matrix') return (
    <rect width={size} height={size} fill="#0d1117" rx="12">
      <animate attributeName="opacity" values="1;0.85;1" dur="3s" repeatCount="indefinite" />
    </rect>
  )
  if (itemKey === 'bg_space') return (
    <>
      <rect width={size} height={size} fill="#050a1f" rx="12" />
      {[[20,15],[60,25],[100,10],[130,40],[40,50],[90,45],[15,70],[145,60],[70,80],[120,75]].map(([x,y],i)=>(
        <circle key={i} cx={x} cy={y} r="1.5" fill="white" opacity="0.8">
          <animate attributeName="opacity" values="0.8;0.2;0.8" dur={`${1.5+i*0.3}s`} repeatCount="indefinite"/>
        </circle>
      ))}
    </>
  )
  if (itemKey === 'bg_forest') return (
    <>
      <rect width={size} height={size} fill="#1a3a1a" rx="12" />
      <rect y="110" width={size} height="50" fill="#2d5a1b" rx="0" />
      {[10,35,60,85,110,135].map((x,i)=>(
        <polygon key={i} points={`${x},100 ${x+12},70 ${x+24},100`} fill={i%2===0?"#2a6b1a":"#1e5014"} />
      ))}
    </>
  )
  if (itemKey === 'bg_city') return (
    <>
      <rect width={size} height={size} fill="#0a0a2e" rx="12" />
      {[[10,60,20,100],[35,40,18,120],[58,50,22,110],[85,30,16,130],[106,45,20,115],[130,55,18,105]].map(([x,h,w,y],i)=>(
        <g key={i}>
          <rect x={x} y={y-h} width={w} height={h} fill={i%2===0?"#1a1a4e":"#0f0f3a"} />
          {[[2,4],[2,10],[10,4],[10,10]].map(([dx,dy],j)=>(
            <rect key={j} x={x+dx} y={y-h+dy} width="3" height="3" fill={Math.random()>0.5?"#ffd700":"#334"} />
          ))}
        </g>
      ))}
    </>
  )
  if (itemKey === 'bg_sunset') return (
    <>
      <defs>
        <linearGradient id="sunsetGrad" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#ff6b35" />
          <stop offset="60%" stopColor="#f7931e" />
          <stop offset="100%" stopColor="#ffd700" />
        </linearGradient>
      </defs>
      <rect width={size} height={size} fill="url(#sunsetGrad)" rx="12" />
      <circle cx="80" cy="90" r="25" fill="#ffd700" opacity="0.9" />
      <rect y="130" width={size} height="30" fill="#1a0a00" opacity="0.5" rx="0" />
    </>
  )
  return <rect width={size} height={size} fill="#1e1e2e" rx="12" />
}

// ── 셔츠 레이어 ──────────────────────────────────────────
function Shirt({ itemKey }: { itemKey?: string }) {
  if (itemKey === 'shirt_hoodie') return (
    <>
      <rect x="52" y="100" width="56" height="45" rx="6" fill="#6c5ce7" />
      <rect x="30" y="102" width="26" height="35" rx="6" fill="#6c5ce7" />
      <rect x="104" y="102" width="26" height="35" rx="6" fill="#6c5ce7" />
      <rect x="65" y="100" width="30" height="12" rx="4" fill="#5a4bd1" />
    </>
  )
  if (itemKey === 'shirt_suit') return (
    <>
      <rect x="52" y="100" width="56" height="45" rx="4" fill="#2c3e50" />
      <rect x="30" y="102" width="26" height="35" rx="4" fill="#2c3e50" />
      <rect x="104" y="102" width="26" height="35" rx="4" fill="#2c3e50" />
      <rect x="72" y="100" width="16" height="45" fill="#ecf0f1" />
      <rect x="74" y="108" width="12" height="8" rx="2" fill="#e74c3c" />
      <rect x="76" y="118" width="8" height="20" rx="1" fill="#e74c3c" />
    </>
  )
  if (itemKey === 'shirt_space') return (
    <>
      <rect x="50" y="98" width="60" height="47" rx="8" fill="#bdc3c7" />
      <rect x="28" y="100" width="28" height="36" rx="8" fill="#bdc3c7" />
      <rect x="104" y="100" width="28" height="36" rx="8" fill="#bdc3c7" />
      <rect x="55" y="103" width="50" height="30" rx="4" fill="#7f8c8d" />
      <circle cx="80" cy="118" r="8" fill="#3498db" opacity="0.6" />
    </>
  )
  if (itemKey === 'shirt_ninja') return (
    <>
      <rect x="52" y="100" width="56" height="45" rx="2" fill="#1a1a1a" />
      <rect x="30" y="102" width="26" height="35" rx="2" fill="#1a1a1a" />
      <rect x="104" y="102" width="26" height="35" rx="2" fill="#1a1a1a" />
      <line x1="52" y1="100" x2="108" y2="145" stroke="#333" strokeWidth="2" />
      <line x1="108" y1="100" x2="52" y2="145" stroke="#333" strokeWidth="2" />
    </>
  )
  if (itemKey === 'shirt_hawaii') return (
    <>
      <rect x="52" y="100" width="56" height="45" rx="4" fill="#e74c3c" />
      <rect x="30" y="102" width="26" height="35" rx="4" fill="#e74c3c" />
      <rect x="104" y="102" width="26" height="35" rx="4" fill="#e74c3c" />
      {[[60,108],[75,120],[90,112],[70,130],[85,125]].map(([x,y],i)=>(
        <circle key={i} cx={x} cy={y} r="4" fill={['#f1c40f','#2ecc71','#3498db','#f39c12','#9b59b6'][i]} />
      ))}
    </>
  )
  // 기본 티셔츠
  return (
    <>
      <rect x="52" y="100" width="56" height="45" rx="4" fill="#00b894" />
      <rect x="30" y="102" width="26" height="35" rx="4" fill="#00b894" />
      <rect x="104" y="102" width="26" height="35" rx="4" fill="#00b894" />
    </>
  )
}

// ── 모자 레이어 ──────────────────────────────────────────
function Hat({ itemKey }: { itemKey?: string }) {
  if (itemKey === 'hat_baseball') return (
    <>
      <ellipse cx="80" cy="56" rx="28" ry="12" fill="#e17055" />
      <rect x="52" y="44" width="56" height="14" rx="7" fill="#e17055" />
      <rect x="95" y="52" width="20" height="5" rx="2" fill="#d63031" />
    </>
  )
  if (itemKey === 'hat_crown') return (
    <>
      <rect x="56" y="42" width="48" height="18" rx="2" fill="#f39c12" />
      <polygon points="56,42 64,28 72,42" fill="#f39c12" />
      <polygon points="76,42 80,26 84,42" fill="#f39c12" />
      <polygon points="96,42 104,28 112,42" fill="#f39c12" />
      <circle cx="64" cy="34" r="3" fill="#e74c3c" />
      <circle cx="80" cy="30" r="3" fill="#3498db" />
      <circle cx="96" cy="34" r="3" fill="#2ecc71" />
    </>
  )
  if (itemKey === 'hat_headset') return (
    <>
      <path d="M55,62 Q55,35 80,35 Q105,35 105,62" fill="none" stroke="#2c3e50" strokeWidth="5" />
      <rect x="50" y="58" width="12" height="16" rx="4" fill="#34495e" />
      <rect x="98" y="58" width="12" height="16" rx="4" fill="#34495e" />
      <rect x="98" y="66" width="16" height="6" rx="3" fill="#e74c3c" />
    </>
  )
  if (itemKey === 'hat_wizard') return (
    <>
      <polygon points="80,10 58,52 102,52" fill="#8e44ad" />
      <ellipse cx="80" cy="52" rx="24" ry="6" fill="#6c3483" />
      <circle cx="80" cy="30" r="4" fill="#f1c40f" />
      <circle cx="68" cy="42" r="2" fill="#f1c40f" />
      <circle cx="90" cy="38" r="2" fill="#f1c40f" />
    </>
  )
  if (itemKey === 'hat_beanie') return (
    <>
      <rect x="54" y="38" width="52" height="22" rx="10" fill="#e74c3c" />
      <rect x="54" y="55" width="52" height="7" rx="2" fill="#c0392b" />
      <circle cx="80" cy="36" r="6" fill="#ecf0f1" />
      {[0,1,2,3,4].map(i=>(
        <rect key={i} x={54+i*11} y="55" width="10" height="7" fill={i%2===0?"#c0392b":"#e74c3c"} />
      ))}
    </>
  )
  return null
}

// ── 액세서리 레이어 ──────────────────────────────────────
function Accessory({ itemKey }: { itemKey?: string }) {
  if (itemKey === 'acc_glasses') return (
    <>
      <rect x="59" y="76" width="16" height="10" rx="3" fill="none" stroke="#2c3e50" strokeWidth="2" />
      <rect x="85" y="76" width="16" height="10" rx="3" fill="none" stroke="#2c3e50" strokeWidth="2" />
      <line x1="75" y1="81" x2="85" y2="81" stroke="#2c3e50" strokeWidth="2" />
      <line x1="55" y1="81" x2="59" y2="81" stroke="#2c3e50" strokeWidth="2" />
      <line x1="101" y1="81" x2="105" y2="81" stroke="#2c3e50" strokeWidth="2" />
    </>
  )
  if (itemKey === 'acc_sunglasses') return (
    <>
      <rect x="57" y="76" width="20" height="11" rx="5" fill="#1a1a1a" />
      <rect x="83" y="76" width="20" height="11" rx="5" fill="#1a1a1a" />
      <line x1="77" y1="81" x2="83" y2="81" stroke="#1a1a1a" strokeWidth="2" />
      <line x1="53" y1="79" x2="57" y2="81" stroke="#1a1a1a" strokeWidth="2" />
      <line x1="103" y1="79" x2="107" y2="81" stroke="#1a1a1a" strokeWidth="2" />
      <rect x="57" y="76" width="20" height="11" rx="5" fill="#1a1a1a" opacity="0.7" />
      <rect x="83" y="76" width="20" height="11" rx="5" fill="#1a1a1a" opacity="0.7" />
    </>
  )
  if (itemKey === 'acc_coffee') return (
    <>
      <rect x="108" y="118" width="18" height="22" rx="3" fill="#ecf0f1" />
      <rect x="110" y="120" width="14" height="14" rx="2" fill="#6f4e37" />
      <path d="M126,124 Q134,124 134,130 Q134,136 126,136" fill="none" stroke="#ecf0f1" strokeWidth="2" />
      <path d="M112,118 Q114,110 116,118" fill="none" stroke="#aaa" strokeWidth="1.5" opacity="0.7" />
    </>
  )
  if (itemKey === 'acc_laptop') return (
    <>
      <rect x="96" y="120" width="36" height="24" rx="3" fill="#2c3e50" />
      <rect x="98" y="122" width="32" height="18" rx="2" fill="#3498db" opacity="0.8" />
      <rect x="92" y="144" width="44" height="4" rx="2" fill="#34495e" />
      <text x="114" y="134" fontSize="7" fill="white" textAnchor="middle">&gt;_</text>
    </>
  )
  if (itemKey === 'acc_sword') return (
    <>
      <rect x="110" y="90" width="4" height="50" rx="1" fill="#bdc3c7" />
      <rect x="104" y="112" width="16" height="4" rx="1" fill="#f39c12" />
      <rect x="110" y="88" width="4" height="8" rx="1" fill="#f1c40f" />
      <polygon points="112,88 110,78 114,78" fill="#bdc3c7" />
    </>
  )
  if (itemKey === 'acc_mic') return (
    <>
      <rect x="108" y="95" width="14" height="22" rx="7" fill="#e74c3c" />
      <rect x="113" y="117" width="4" height="14" rx="1" fill="#bdc3c7" />
      <rect x="106" y="130" width="18" height="3" rx="1" fill="#bdc3c7" />
    </>
  )
  return null
}

// ── 기본 몸체 ────────────────────────────────────────────
function BaseBody() {
  return (
    <>
      {/* 다리 */}
      <rect x="62" y="142" width="18" height="14" rx="4" fill="#2d3436" />
      <rect x="82" y="142" width="18" height="14" rx="4" fill="#2d3436" />
      {/* 신발 */}
      <rect x="59" y="152" width="22" height="8" rx="4" fill="#1a1a1a" />
      <rect x="79" y="152" width="22" height="8" rx="4" fill="#1a1a1a" />
      {/* 얼굴 */}
      <circle cx="80" cy="74" r="24" fill="#ffeaa7" />
      {/* 눈 */}
      <circle cx="72" cy="70" r="4" fill="white" />
      <circle cx="88" cy="70" r="4" fill="white" />
      <circle cx="73" cy="71" r="2.5" fill="#2d3436" />
      <circle cx="89" cy="71" r="2.5" fill="#2d3436" />
      <circle cx="74" cy="70" r="1" fill="white" />
      <circle cx="90" cy="70" r="1" fill="white" />
      {/* 입 */}
      <path d="M73,82 Q80,88 87,82" fill="none" stroke="#e17055" strokeWidth="2" strokeLinecap="round" />
      {/* 볼 */}
      <circle cx="65" cy="78" r="5" fill="#fab1a0" opacity="0.6" />
      <circle cx="95" cy="78" r="5" fill="#fab1a0" opacity="0.6" />
      {/* 귀 */}
      <circle cx="56" cy="74" r="6" fill="#ffeaa7" />
      <circle cx="104" cy="74" r="6" fill="#ffeaa7" />
    </>
  )
}

interface CharacterProps {
  equippedItems?: ShopItem[]
  size?: number
  className?: string
}

export default function Character({ equippedItems = [], size = 160, className }: CharacterProps) {
  const get = (type: string) => equippedItems.find(i => i.type === type)?.itemKey

  const scale = size / 160
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 160 160"
      className={className}
      style={{ imageRendering: 'pixelated' }}
    >
      <Background itemKey={get('BACKGROUND')} />
      <Shirt itemKey={get('SHIRT')} />
      <BaseBody />
      <Hat itemKey={get('HAT')} />
      <Accessory itemKey={get('ACCESSORY')} />
    </svg>
  )
}
