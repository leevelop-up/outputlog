import type { ShopItem } from '@/types'

/* ── 배경 ── */
function Background({ k }: { k?: string }) {
  if (k === 'bg_matrix') return (
    <>
      <rect width="200" height="220" rx="20" fill="#0d1117"/>
      {[20,45,70,95,120,145,170].map((x,i)=>(
        <text key={i} x={x} y={20+i*18} fontSize="10" fill="#00ff41" opacity="0.35" fontFamily="monospace">
          {['01','10','11','00','1','0','01'][i]}
        </text>
      ))}
      <rect width="200" height="220" rx="20" fill="url(#matrixFade)"/>
      <defs><radialGradient id="matrixFade" cx="50%" cy="50%" r="50%">
        <stop offset="0%" stopColor="transparent"/>
        <stop offset="100%" stopColor="#0d1117" stopOpacity="0.6"/>
      </radialGradient></defs>
    </>
  )
  if (k === 'bg_space') return (
    <>
      <defs>
        <radialGradient id="spaceGrad" cx="50%" cy="30%" r="70%">
          <stop offset="0%" stopColor="#1a1a4e"/>
          <stop offset="100%" stopColor="#050510"/>
        </radialGradient>
      </defs>
      <rect width="200" height="220" rx="20" fill="url(#spaceGrad)"/>
      {[[15,20],[40,8],[80,30],[130,12],[165,25],[30,60],[170,55],[90,70],[155,80],[20,90]].map(([x,y],i)=>(
        <circle key={i} cx={x} cy={y} r={i%3===0?2:1} fill="white" opacity={0.4+i*0.05}>
          <animate attributeName="opacity" values={`${0.4+i*0.05};0.1;${0.4+i*0.05}`} dur={`${2+i*0.4}s`} repeatCount="indefinite"/>
        </circle>
      ))}
      <ellipse cx="100" cy="50" rx="30" ry="12" fill="#6c63ff" opacity="0.12"/>
    </>
  )
  if (k === 'bg_forest') return (
    <>
      <defs>
        <linearGradient id="skyGrad" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#87ceeb"/>
          <stop offset="100%" stopColor="#c8e6c9"/>
        </linearGradient>
      </defs>
      <rect width="200" height="220" rx="20" fill="url(#skyGrad)"/>
      <rect y="160" width="200" height="60" rx="0" fill="#4caf50"/>
      <rect y="155" width="200" height="15" rx="8" fill="#66bb6a"/>
      {[[-10,160,30],[20,140,40],[55,150,35],[90,135,45],[125,148,38],[155,142,42],[175,155,32]].map(([x,y,w],i)=>(
        <ellipse key={i} cx={x+w/2} cy={y} rx={w/2} ry={w*0.6} fill={['#2e7d32','#388e3c','#43a047','#2e7d32','#1b5e20','#388e3c','#43a047'][i]}/>
      ))}
      <circle cx="160" cy="30" r="18" fill="#fff9c4" opacity="0.9"/>
    </>
  )
  if (k === 'bg_city') return (
    <>
      <defs>
        <linearGradient id="nightGrad" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#0a0a2e"/>
          <stop offset="100%" stopColor="#1a1a4a"/>
        </linearGradient>
      </defs>
      <rect width="200" height="220" rx="20" fill="url(#nightGrad)"/>
      {[[5,80,25],[35,60,20],[60,75,22],[90,50,28],[125,65,24],[152,55,26],[178,70,20]].map(([x,h,w],i)=>(
        <g key={i}>
          <rect x={x} y={200-h} width={w} height={h} fill={['#1a1a4e','#12124a','#0f0f3a','#16164a','#1e1e52','#14144e','#101040'][i]}/>
          {Array.from({length:Math.floor(h/14)}).map((_,j)=>
            Array.from({length:Math.floor(w/10)}).map((_,k)=>(
              <rect key={`${j}-${k}`} x={x+k*9+2} y={200-h+j*13+4} width="5" height="6"
                fill={Math.random()>0.4?'#ffd700':'#334466'} opacity={Math.random()>0.4?0.9:0.3}/>
            ))
          )}
        </g>
      ))}
      {[[15,18],[50,10],[100,6],[140,14],[180,20]].map(([x,y],i)=>(
        <circle key={i} cx={x} cy={y} r="1.2" fill="white" opacity="0.6"/>
      ))}
    </>
  )
  if (k === 'bg_sunset') return (
    <>
      <defs>
        <linearGradient id="sunsetG" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#ff6b6b"/>
          <stop offset="40%" stopColor="#ffa07a"/>
          <stop offset="75%" stopColor="#ffd700"/>
          <stop offset="100%" stopColor="#ff8c00"/>
        </linearGradient>
      </defs>
      <rect width="200" height="220" rx="20" fill="url(#sunsetG)"/>
      <circle cx="100" cy="130" r="45" fill="#ffd700" opacity="0.95"/>
      <rect y="160" width="200" height="60" rx="0" fill="#1a0a00" opacity="0.7"/>
      {[0,1,2,3].map(i=>(
        <ellipse key={i} cx={20+i*55} cy="165" rx="28" ry="12" fill="#0d0500" opacity="0.8"/>
      ))}
    </>
  )
  // 기본
  return (
    <>
      <defs>
        <linearGradient id="defaultBg" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#1e1e2e"/>
          <stop offset="100%" stopColor="#2a2a3e"/>
        </linearGradient>
      </defs>
      <rect width="200" height="220" rx="20" fill="url(#defaultBg)"/>
      {[20,60,100,140,180].map((x,i)=>(
        <circle key={i} cx={x} cy={30+i*10} r="1" fill="#6c63ff" opacity="0.3"/>
      ))}
    </>
  )
}

/* ── 셔츠/옷 ── */
function Shirt({ k }: { k?: string }) {
  if (k === 'shirt_hoodie') return (
    <g>
      {/* 몸통 */}
      <rect x="68" y="138" width="64" height="52" rx="10" fill="#5c6bc0"/>
      {/* 소매 */}
      <rect x="44" y="140" width="28" height="38" rx="10" fill="#5c6bc0"/>
      <rect x="128" y="140" width="28" height="38" rx="10" fill="#5c6bc0"/>
      {/* 포켓 */}
      <rect x="82" y="155" width="36" height="18" rx="6" fill="#4a5ab5"/>
      {/* 줄무늬 */}
      <line x1="100" y1="138" x2="100" y2="160" stroke="#4a5ab5" strokeWidth="3"/>
    </g>
  )
  if (k === 'shirt_suit') return (
    <g>
      <rect x="68" y="138" width="64" height="52" rx="8" fill="#1e293b"/>
      <rect x="44" y="140" width="28" height="38" rx="8" fill="#1e293b"/>
      <rect x="128" y="140" width="28" height="38" rx="8" fill="#1e293b"/>
      {/* 라펠 */}
      <polygon points="100,138 88,150 100,155" fill="#263548"/>
      <polygon points="100,138 112,150 100,155" fill="#263548"/>
      {/* 타이 */}
      <polygon points="96,138 104,138 102,175 98,175" fill="#e53935"/>
      <polygon points="97,138 103,138 102,148 98,148" fill="#c62828"/>
      {/* 단추 */}
      <circle cx="100" cy="160" r="2" fill="#37474f"/>
      <circle cx="100" cy="168" r="2" fill="#37474f"/>
    </g>
  )
  if (k === 'shirt_space') return (
    <g>
      <rect x="66" y="136" width="68" height="54" rx="12" fill="#90a4ae"/>
      <rect x="42" y="138" width="28" height="40" rx="10" fill="#90a4ae"/>
      <rect x="130" y="138" width="28" height="40" rx="10" fill="#90a4ae"/>
      {/* 헬멧 링 */}
      <ellipse cx="100" cy="138" rx="22" ry="6" fill="#78909c"/>
      {/* 패널 */}
      <rect x="78" y="148" width="44" height="28" rx="6" fill="#78909c"/>
      <rect x="82" y="152" width="16" height="10" rx="3" fill="#29b6f6" opacity="0.8"/>
      <rect x="102" y="152" width="16" height="10" rx="3" fill="#ef5350" opacity="0.8"/>
      {/* 마크 */}
      <circle cx="100" cy="168" r="5" fill="#fff" opacity="0.3"/>
    </g>
  )
  if (k === 'shirt_ninja') return (
    <g>
      <rect x="66" y="136" width="68" height="54" rx="4" fill="#1a1a1a"/>
      <rect x="42" y="138" width="28" height="40" rx="4" fill="#1a1a1a"/>
      <rect x="130" y="138" width="28" height="40" rx="4" fill="#1a1a1a"/>
      {/* X 패턴 */}
      <line x1="70" y1="140" x2="130" y2="185" stroke="#333" strokeWidth="3"/>
      <line x1="130" y1="140" x2="70" y2="185" stroke="#333" strokeWidth="3"/>
      {/* 붉은 띠 */}
      <rect x="68" y="155" width="64" height="6" fill="#b71c1c" opacity="0.8"/>
    </g>
  )
  if (k === 'shirt_hawaii') return (
    <g>
      <rect x="68" y="138" width="64" height="52" rx="8" fill="#e53935"/>
      <rect x="44" y="140" width="28" height="38" rx="8" fill="#e53935"/>
      <rect x="128" y="140" width="28" height="38" rx="8" fill="#e53935"/>
      {/* 꽃 패턴 */}
      {[[80,150],[110,158],[88,168],[105,145],[95,170]].map(([x,y],i)=>(
        <g key={i}>
          <circle cx={x} cy={y} r="6" fill={['#fdd835','#4caf50','#29b6f6','#ff7043','#ce93d8'][i]} opacity="0.9"/>
          <circle cx={x} cy={y} r="2.5" fill="white" opacity="0.7"/>
        </g>
      ))}
    </g>
  )
  // 기본
  return (
    <g>
      <rect x="68" y="138" width="64" height="52" rx="10" fill="#26a69a"/>
      <rect x="44" y="140" width="28" height="38" rx="10" fill="#26a69a"/>
      <rect x="128" y="140" width="28" height="38" rx="10" fill="#26a69a"/>
    </g>
  )
}

/* ── 모자 ── */
function Hat({ k }: { k?: string }) {
  if (k === 'hat_baseball') return (
    <g>
      <ellipse cx="100" cy="78" rx="36" ry="14" fill="#ef5350"/>
      <rect x="64" y="64" width="72" height="18" rx="9" fill="#ef5350"/>
      <rect x="125" y="73" width="26" height="8" rx="4" fill="#c62828"/>
      <rect x="84" y="64" width="32" height="5" rx="2" fill="#c62828"/>
    </g>
  )
  if (k === 'hat_crown') return (
    <g>
      <rect x="68" y="68" width="64" height="20" rx="3" fill="#ffd600"/>
      <polygon points="68,68 80,45 92,68" fill="#ffd600"/>
      <polygon points="94,68 100,40 106,68" fill="#ffd600"/>
      <polygon points="108,68 120,45 132,68" fill="#ffd600"/>
      {/* 보석 */}
      <circle cx="80" cy="56" r="4" fill="#e53935"/>
      <circle cx="100" cy="48" r="5" fill="#1e88e5"/>
      <circle cx="120" cy="56" r="4" fill="#43a047"/>
      {/* 테두리 */}
      <rect x="68" y="85" width="64" height="5" rx="2" fill="#f9a825"/>
    </g>
  )
  if (k === 'hat_headset') return (
    <g>
      <path d="M62,88 Q62,52 100,52 Q138,52 138,88" fill="none" stroke="#37474f" strokeWidth="7" strokeLinecap="round"/>
      <rect x="55" y="84" width="16" height="22" rx="6" fill="#455a64"/>
      <rect x="129" y="84" width="16" height="22" rx="6" fill="#455a64"/>
      {/* 마이크 암 */}
      <path d="M145,94 Q158,94 158,106 Q158,112 150,112" fill="none" stroke="#e53935" strokeWidth="4" strokeLinecap="round"/>
      <circle cx="148" cy="113" r="5" fill="#e53935"/>
      {/* LED */}
      <circle cx="63" cy="88" r="3" fill="#00e676"/>
    </g>
  )
  if (k === 'hat_wizard') return (
    <g>
      <polygon points="100,18 72,78 128,78" fill="#7b1fa2"/>
      <ellipse cx="100" cy="78" rx="32" ry="10" fill="#6a1b9a"/>
      {/* 별 */}
      <circle cx="100" cy="45" r="5" fill="#ffd600"/>
      <circle cx="85" cy="60" r="3" fill="#ffd600" opacity="0.7"/>
      <circle cx="114" cy="55" r="3.5" fill="#ffd600" opacity="0.8"/>
      {/* 띠 */}
      <ellipse cx="100" cy="78" rx="32" ry="4" fill="#4a148c" opacity="0.6"/>
    </g>
  )
  if (k === 'hat_beanie') return (
    <g>
      <rect x="64" y="56" width="72" height="30" rx="14" fill="#e53935"/>
      <rect x="60" y="80" width="80" height="10" rx="4" fill="#c62828"/>
      {/* 줄무늬 */}
      <rect x="64" y="65" width="72" height="5" rx="2" fill="#c62828" opacity="0.5"/>
      {/* 폼폼 */}
      <circle cx="100" cy="52" r="10" fill="#ffcdd2"/>
      <circle cx="100" cy="52" r="7" fill="#ef9a9a"/>
    </g>
  )
  return null
}

/* ── 액세서리 ── */
function Accessory({ k }: { k?: string }) {
  if (k === 'acc_glasses') return (
    <g>
      <rect x="72" y="108" width="20" height="13" rx="5" fill="none" stroke="#37474f" strokeWidth="2.5"/>
      <rect x="108" y="108" width="20" height="13" rx="5" fill="none" stroke="#37474f" strokeWidth="2.5"/>
      <line x1="92" y1="114" x2="108" y2="114" stroke="#37474f" strokeWidth="2.5"/>
      <line x1="68" y1="112" x2="72" y2="114" stroke="#37474f" strokeWidth="2.5"/>
      <line x1="132" y1="112" x2="128" y2="114" stroke="#37474f" strokeWidth="2.5"/>
    </g>
  )
  if (k === 'acc_sunglasses') return (
    <g>
      <rect x="70" y="108" width="24" height="13" rx="6" fill="#111"/>
      <rect x="106" y="108" width="24" height="13" rx="6" fill="#111"/>
      <rect x="70" y="108" width="24" height="13" rx="6" fill="#1565c0" opacity="0.4"/>
      <rect x="106" y="108" width="24" height="13" rx="6" fill="#1565c0" opacity="0.4"/>
      <line x1="94" y1="114" x2="106" y2="114" stroke="#333" strokeWidth="2.5"/>
      <line x1="65" y1="110" x2="70" y2="113" stroke="#333" strokeWidth="2.5"/>
      <line x1="135" y1="110" x2="130" y2="113" stroke="#333" strokeWidth="2.5"/>
      {/* 반짝임 */}
      <rect x="73" y="110" width="5" height="3" rx="1" fill="white" opacity="0.3"/>
      <rect x="109" y="110" width="5" height="3" rx="1" fill="white" opacity="0.3"/>
    </g>
  )
  if (k === 'acc_coffee') return (
    <g transform="translate(128,140)">
      <rect x="0" y="0" width="22" height="26" rx="4" fill="#fafafa"/>
      <rect x="2" y="2" width="18" height="16" rx="3" fill="#6d4c41"/>
      <path d="M22,7 Q30,7 30,14 Q30,20 22,20" fill="none" stroke="#e0e0e0" strokeWidth="2.5"/>
      {/* 김 */}
      <path d="M7,0 Q9,-5 7,-9" fill="none" stroke="#bbb" strokeWidth="1.5" strokeLinecap="round" opacity="0.7">
        <animate attributeName="opacity" values="0.7;0.2;0.7" dur="2s" repeatCount="indefinite"/>
      </path>
      <path d="M13,0 Q15,-5 13,-9" fill="none" stroke="#bbb" strokeWidth="1.5" strokeLinecap="round" opacity="0.5">
        <animate attributeName="opacity" values="0.5;0.1;0.5" dur="2.4s" repeatCount="indefinite"/>
      </path>
    </g>
  )
  if (k === 'acc_laptop') return (
    <g transform="translate(115,130)">
      <rect x="0" y="0" width="48" height="32" rx="4" fill="#263238"/>
      <rect x="2" y="2" width="44" height="26" rx="3" fill="#1565c0"/>
      {/* 터미널 */}
      <text x="6" y="14" fontSize="7" fill="#00e676" fontFamily="monospace">&gt;_ ls</text>
      <text x="6" y="22" fontSize="6" fill="#69f0ae" fontFamily="monospace" opacity="0.7">src/</text>
      <rect x="0" y="32" width="48" height="5" rx="2" fill="#1c313a"/>
    </g>
  )
  if (k === 'acc_sword') return (
    <g transform="translate(136,80)">
      <rect x="4" y="0" width="5" height="60" rx="2" fill="#e0e0e0"/>
      <polygon points="4,0 9,0 6.5,-18" fill="#bdbdbd"/>
      <rect x="-4" y="20" width="22" height="6" rx="3" fill="#ffd600"/>
      <rect x="3" y="56" width="7" height="14" rx="3" fill="#8d6e63"/>
      {/* 빛 효과 */}
      <rect x="5" y="2" width="2" height="30" rx="1" fill="white" opacity="0.4"/>
    </g>
  )
  if (k === 'acc_mic') return (
    <g transform="translate(132,100)">
      <rect x="5" y="0" width="16" height="26" rx="8" fill="#e53935"/>
      <rect x="7" y="2" width="12" height="22" rx="6" fill="#ef5350"/>
      {/* 그릴 */}
      {[6,10,14,18,22].map((y,i)=>(
        <line key={i} x1="7" y1={y} x2="19" y2={y} stroke="#c62828" strokeWidth="1"/>
      ))}
      <rect x="11" y="26" width="4" height="16" rx="2" fill="#9e9e9e"/>
      <rect x="6" y="42" width="14" height="4" rx="2" fill="#9e9e9e"/>
    </g>
  )
  return null
}

/* ── 기본 몸통 ── */
function Body() {
  return (
    <g>
      {/* 다리 */}
      <rect x="76" y="182" width="20" height="28" rx="8" fill="#37474f"/>
      <rect x="104" y="182" width="20" height="28" rx="8" fill="#37474f"/>
      {/* 신발 */}
      <ellipse cx="86" cy="208" rx="14" ry="8" fill="#212121"/>
      <ellipse cx="114" cy="208" rx="14" ry="8" fill="#212121"/>
      <ellipse cx="84" cy="206" rx="6" ry="3" fill="#424242"/>
      <ellipse cx="112" cy="206" rx="6" ry="3" fill="#424242"/>

      {/* 얼굴 */}
      <ellipse cx="100" cy="105" rx="42" ry="44" fill="#ffcc80"/>
      {/* 얼굴 그림자 (하단) */}
      <ellipse cx="100" cy="140" rx="36" ry="12" fill="#ffb74d" opacity="0.4"/>
      {/* 볼터치 */}
      <ellipse cx="72" cy="115" rx="10" ry="7" fill="#ffab91" opacity="0.6"/>
      <ellipse cx="128" cy="115" rx="10" ry="7" fill="#ffab91" opacity="0.6"/>

      {/* 눈 흰자 */}
      <ellipse cx="87" cy="105" rx="9" ry="10" fill="white"/>
      <ellipse cx="113" cy="105" rx="9" ry="10" fill="white"/>
      {/* 홍채 */}
      <circle cx="88" cy="107" r="6" fill="#1a237e"/>
      <circle cx="114" cy="107" r="6" fill="#1a237e"/>
      {/* 동공 */}
      <circle cx="89" cy="108" r="3.5" fill="#000"/>
      <circle cx="115" cy="108" r="3.5" fill="#000"/>
      {/* 하이라이트 */}
      <circle cx="91" cy="105" r="2" fill="white"/>
      <circle cx="117" cy="105" r="2" fill="white"/>
      {/* 속눈썹 */}
      <path d="M79,98 Q87,93 95,98" fill="none" stroke="#5d4037" strokeWidth="2" strokeLinecap="round"/>
      <path d="M105,98 Q113,93 121,98" fill="none" stroke="#5d4037" strokeWidth="2" strokeLinecap="round"/>

      {/* 코 */}
      <ellipse cx="100" cy="118" rx="4" ry="3" fill="#ffb74d"/>
      {/* 입 */}
      <path d="M88,126 Q100,136 112,126" fill="none" stroke="#e64a19" strokeWidth="2.5" strokeLinecap="round"/>
      {/* 치아 */}
      <path d="M93,128 Q100,133 107,128" fill="white" stroke="none" opacity="0.9"/>

      {/* 귀 */}
      <ellipse cx="58" cy="106" rx="10" ry="12" fill="#ffcc80"/>
      <ellipse cx="58" cy="106" rx="6" ry="8" fill="#ffb74d"/>
      <ellipse cx="142" cy="106" rx="10" ry="12" fill="#ffcc80"/>
      <ellipse cx="142" cy="106" rx="6" ry="8" fill="#ffb74d"/>

      {/* 목 */}
      <rect x="90" y="145" width="20" height="12" rx="4" fill="#ffb74d"/>
    </g>
  )
}

interface CharacterProps {
  equippedItems?: ShopItem[]
  size?: number
  className?: string
}

export default function Character({ equippedItems = [], size = 200, className }: CharacterProps) {
  const get = (type: string) => equippedItems.find(i => i.type === type)?.itemKey
  return (
    <svg
      width={size}
      height={size * 1.1}
      viewBox="0 0 200 220"
      className={className}
    >
      <Background k={get('BACKGROUND')} />
      <Shirt k={get('SHIRT')} />
      <Body />
      <Hat k={get('HAT')} />
      <Accessory k={get('ACCESSORY')} />
    </svg>
  )
}
