import type { LanguageMode } from '@study/shared';
import { t, words } from './content';
import { Text } from './ui';

function Frame({
  mode,
  label,
  children,
}: {
  mode: LanguageMode;
  label: [string, string];
  children: React.ReactNode;
}) {
  return (
    <figure className="geo-diagram">
      <svg viewBox="0 0 900 520" role="img" aria-label={words(mode, ...label)}>
        <title>{words(mode, ...label)}</title>
        {children}
      </svg>
      <figcaption>
        <Text mode={mode} text={t(...label)} />
        <small>
          {words(
            mode,
            '原创建模图：用来比较关系，不是按比例地图、物种名录或天气预报。',
            'Original teaching model: compare relationships, not a to-scale map, species inventory, or weather forecast.',
          )}
        </small>
      </figcaption>
    </figure>
  );
}
const Label = ({ x, y, children }: { x: number; y: number; children: React.ReactNode }) => (
  <text x={x} y={y} textAnchor="middle" fontSize="23" fontWeight="700" fill="#173b3a">
    {children}
  </text>
);

export function LivingPlanetVisual({
  id,
  panel,
  mode,
}: {
  id: string;
  panel: number;
  mode: LanguageMode;
}) {
  if (id === 'GEO-041') {
    if (panel === 0)
      return (
        <Frame mode={mode} label={['雨林垂直层次：不同高度有不同光照、湿度和栖息位置', 'Rainforest layers: height changes light, moisture and places to live']}>
          <rect width="900" height="520" fill="#dff2df" />
          <rect x="75" y="72" width="750" height="85" rx="18" fill="#6fb96f" />
          <rect x="75" y="157" width="750" height="116" rx="18" fill="#369267" />
          <rect x="75" y="273" width="750" height="112" rx="18" fill="#16715d" />
          <rect x="75" y="385" width="750" height="83" rx="18" fill="#7d5c3c" />
          <path d="M450 465V55" stroke="#563c2b" strokeWidth="42" strokeLinecap="round" />
          <circle cx="447" cy="88" r="78" fill="#5cad5a" /><circle cx="360" cy="117" r="60" fill="#65b75f" /><circle cx="540" cy="124" r="65" fill="#65b75f" />
          <Label x={185} y={124}>emergent</Label><Label x={185} y={222}>canopy</Label><Label x={185} y={338}>understorey</Label><Label x={185} y={433}>forest floor</Label>
          <path d="M725 86l-35 64M725 86l18 70" stroke="#f8c548" strokeWidth="12" strokeLinecap="round" />
          <text x="682" y="60" fontSize="22" fill="#6a4b00">sunlight changes</text>
        </Frame>
      );
    if (panel === 1)
      return (
        <Frame mode={mode} label={['同样的温暖潮湿不等于每一处资源相同：层次和微环境创造不同机会', 'Warm, wet conditions do not make every resource identical: layers and micro-environments create different opportunities']}>
          <rect width="900" height="520" fill="#eef8e9" />
          {[['LIGHT', 170, '#f7d45b'], ['WATER', 450, '#68b9e8'], ['SHELTER', 730, '#74b574']].map(([a, x, c]) => <g key={a as string}><circle cx={Number(x)} cy="220" r="98" fill={c as string} opacity=".86" /><text x={Number(x)} y="230" textAnchor="middle" fontSize="28" fontWeight="700" fill="#153d43">{a}</text></g>)}
          <path d="M250 270C330 395 565 395 650 270" fill="none" stroke="#245d55" strokeWidth="8" strokeDasharray="14 13" />
          <Label x={450} y={440}>different combinations → different niches</Label>
        </Frame>
      );
    return (
      <Frame mode={mode} label={['雨林多样性是关系网：植物、动物、真菌和环境彼此影响', 'Rainforest diversity is a web: plants, animals, fungi and environment affect one another']}>
        <rect width="900" height="520" fill="#e6f4e5" />
        {[[450,90,'sun'],[220,220,'plants'],[450,255,'animals'],[680,220,'fungi'],[300,410,'soil'],[600,410,'water']].map(([x,y,a]) => <g key={a as string}><circle cx={x as number} cy={y as number} r="57" fill="#fffdf2" stroke="#34715b" strokeWidth="5"/><text x={x as number} y={(y as number)+7} textAnchor="middle" fontSize="21" fontWeight="700" fill="#173b3a">{a}</text></g>)}
        {[[450,147,450,198],[277,220,393,245],[507,245,623,220],[263,269,310,357],[637,269,590,357],[360,390,540,390]].map((p,i)=><path key={i} d={`M${p[0]} ${p[1]} L${p[2]} ${p[3]}`} stroke="#65845e" strokeWidth="7" markerEnd="url(#lp-arrow)" />)}
        <defs><marker id="lp-arrow" markerWidth="10" markerHeight="10" refX="8" refY="3" orient="auto"><path d="M0,0 L0,6 L9,3 z" fill="#65845e" /></marker></defs>
      </Frame>
    );
  }
  if (id === 'GEO-042') {
    if (panel === 0)
      return (
        <Frame mode={mode} label={['生物群系概念图：温度和水分常重要，但不是唯一条件', 'Biome concept graph: temperature and water often matter, but are not the only conditions']}>
          <rect width="900" height="520" fill="#f6f4e7" /><path d="M150 410H790M150 410V75" stroke="#234b4b" strokeWidth="7" />
          <text x="470" y="470" textAnchor="middle" fontSize="25" fill="#173b3a">more available water →</text><text x="70" y="250" textAnchor="middle" fontSize="25" transform="rotate(-90 70 250)" fill="#173b3a">warmer →</text>
          {[[640,145,'tropical\nforest','#30845c'],[600,330,'grassland','#c8b957'],[285,335,'tundra','#8eb0bd'],[260,410,'cold\ndesert','#c99c70']].map(([x,y,a,c])=><g key={a as string}><circle cx={x as number} cy={y as number} r="61" fill={c as string}/>{(a as string).split('\n').map((s,j)=><text key={s} x={x as number} y={(a as string).includes('\n') ? (y as number) + j * 24 - 9 : (y as number) + 7} textAnchor="middle" fontSize="19" fontWeight="700" fill="#173b3a">{s}</text>)}</g>)}
        </Frame>
      );
    if (panel === 1)
      return (
        <Frame mode={mode} label={['同一气候范围内仍有许多差异：土壤、火、食草动物、海拔和人类土地利用会改变植被', 'Within a climate range there are still differences: soil, fire, grazers, altitude and land use can change vegetation']}>
          <rect width="900" height="520" fill="#ebf4e8" />
          {[[175,'soil'],[330,'fire'],[485,'grazers'],[640,'altitude'],[795,'land use']].map(([x,a])=><g key={a as string}><rect x={(x as number)-62} y="170" width="124" height="160" rx="22" fill="#fffefa" stroke="#5b7e67" strokeWidth="5"/><text x={x as number} y="245" textAnchor="middle" fontSize="22" fontWeight="700" fill="#173b3a">{a}</text></g>)}
          <path d="M175 365C315 455 590 455 795 365" fill="none" stroke="#4c8469" strokeWidth="8"/><Label x={485} y={488}>same climate ≠ one guaranteed landscape</Label>
        </Frame>
      );
    return <Frame mode={mode} label={['从气候到植被是推测链，需要现场证据检查', 'From climate to vegetation is an inference chain that needs local evidence']}><rect width="900" height="520" fill="#f0f5ea" />{[['climate',150],['water + heat',360],['possible vegetation',590],['field evidence',790]].map(([a,x],i)=><g key={a as string}><rect x={(x as number)-82} y="200" width="164" height="105" rx="20" fill={i===3?'#d8e7d4':'#fffdf2'} stroke="#4c8469" strokeWidth="5"/><text x={x as number} y="260" textAnchor="middle" fontSize="20" fontWeight="700" fill="#173b3a">{a}</text>{i<3&&<path d={`M${(x as number)+85} 252h75`} stroke="#4c8469" strokeWidth="7" markerEnd="url(#lp-arrow)"/>}</g>)}</Frame>;
  }
  if (id === 'GEO-043') {
    if (panel === 0) return <Frame mode={mode} label={['极地与高山都可能寒冷，但高海拔还伴随稀薄空气和强辐射等条件', 'Polar and alpine places can both be cold, but high altitude also brings thinner air and strong radiation']}><rect width="900" height="520" fill="#e9f4fa"/><rect x="0" y="360" width="900" height="160" fill="#d4e8ef"/><path d="M410 390 L620 80 L825 390Z" fill="#9baab5"/><path d="M450 180L620 80 675 165" fill="#f9fcfc"/><circle cx="150" cy="155" r="58" fill="#f9fcfc" stroke="#6c92a3" strokeWidth="6"/><text x="150" y="162" textAnchor="middle" fontSize="24" fontWeight="700">polar</text><text x="620" y="435" textAnchor="middle" fontSize="24" fontWeight="700">alpine</text><Label x={470} y={485}>cold is shared; conditions are not identical</Label></Frame>;
    if (panel === 1) return <Frame mode={mode} label={['适应是特定生物在特定条件下的特征，不是所有极地或高山生命都有同一办法', 'An adaptation is a feature of a particular organism in particular conditions, not one method shared by all polar or alpine life']}><rect width="900" height="520" fill="#edf6f6"/>{[['insulation',200,'limits heat loss'],['compact shape',450,'less exposed area'],['seasonal timing',700,'uses short growing time']].map(([a,x,b])=><g key={a as string}><circle cx={x as number} cy="210" r="85" fill="#e7c976"/><text x={x as number} y="208" textAnchor="middle" fontSize="23" fontWeight="700">{a}</text><text x={x as number} y="245" textAnchor="middle" fontSize="16">{b}</text></g>)}<Label x={450} y={440}>a trait has benefits and limits in context</Label></Frame>;
    return <Frame mode={mode} label={['适应不是超级能力：同一特征可能有代价，环境改变时结果也会改变', 'Adaptation is not a superpower: a trait can have costs, and outcomes change when conditions change']}><rect width="900" height="520" fill="#f6f3e7"/>{[['condition',170],['trait',390],['benefit',610],['limit / trade-off',790]].map(([a,x],i)=><g key={a as string}><rect x={(x as number)-78} y="205" width="156" height="100" rx="18" fill={i===3?'#f3d6bc':'#fffdf2'} stroke="#88765a" strokeWidth="5"/><text x={x as number} y="260" textAnchor="middle" fontSize="19" fontWeight="700">{a}</text>{i<3&&<path d={`M${(x as number)+80} 255h58`} stroke="#88765a" strokeWidth="7" markerEnd="url(#lp-arrow)"/>}</g>)}</Frame>;
  }
  if (panel === 0) return <Frame mode={mode} label={['热带气旋概念能量链：温暖海面、湿空气上升和凝结释热可支持强风暴', 'Tropical-cyclone concept energy chain: warm ocean, rising moist air and condensation heat can support a strong storm']}><rect width="900" height="520" fill="#dff0f5"/><rect y="390" width="900" height="130" fill="#4d9ec3"/><circle cx="210" cy="320" r="68" fill="#f6c85f"/><text x="210" y="328" textAnchor="middle" fontSize="20" fontWeight="700">warm ocean</text><path d="M270 315C375 190 420 145 450 105" fill="none" stroke="#4f91a0" strokeWidth="14" markerEnd="url(#lp-arrow)"/><circle cx="500" cy="105" r="61" fill="#cfdce7"/><text x="500" y="112" textAnchor="middle" fontSize="18" fontWeight="700">rising moist air</text><path d="M560 115C650 185 685 225 720 290" fill="none" stroke="#4f91a0" strokeWidth="14" markerEnd="url(#lp-arrow)"/><circle cx="730" cy="330" r="66" fill="#9ab6d4"/><text x="730" y="337" textAnchor="middle" fontSize="18" fontWeight="700">cloud / rain</text><Label x={450} y={475}>conceptual feedback; not every warm sea creates a cyclone</Label></Frame>;
  if (panel === 1) return <Frame mode={mode} label={['风暴强度受多个条件共同影响，冷水、干空气、强风切变或陆地都可能削弱热带气旋', 'Storm intensity depends on several conditions; cool water, dry air, strong wind shear or land can weaken a tropical cyclone']}><rect width="900" height="520" fill="#eef5f1"/><circle cx="450" cy="260" r="115" fill="#7a9cc1"/><circle cx="450" cy="260" r="34" fill="#f7fafb"/><text x="450" y="267" textAnchor="middle" fontSize="20" fontWeight="700">eye</text>{[['warm water',170,150,'#f2c05d'],['moist air',730,150,'#83c3d8'],['low shear',170,375,'#88b878'],['away from land',730,375,'#d8b775']].map(([a,x,y,c])=><g key={a as string}><rect x={(x as number)-85} y={(y as number)-35} width="170" height="70" rx="18" fill={c as string}/><text x={x as number} y={(y as number)+7} textAnchor="middle" fontSize="20" fontWeight="700">{a}</text></g>)}</Frame>;
  return <Frame mode={mode} label={['灾害风险不只由风暴强度决定：危险性、暴露度和脆弱性共同作用', 'Disaster risk is not just storm strength: hazard, exposure and vulnerability act together']}><rect width="900" height="520" fill="#f7f1e9"/>{[['hazard',220,'storm wind / rain'],['exposure',450,'people / places'],['vulnerability',680,'ability to cope']].map(([a,x,b],i)=><g key={a as string}><circle cx={x as number} cy="235" r="94" fill={['#e9a165','#e6cc79','#b8cda0'][i]}/><text x={x as number} y="230" textAnchor="middle" fontSize="24" fontWeight="700">{a}</text><text x={x as number} y="262" textAnchor="middle" fontSize="16">{b}</text></g>)}<Label x={450} y={435}>risk changes when any part changes</Label></Frame>;
}
