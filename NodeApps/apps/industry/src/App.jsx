import { useEffect, useMemo, useState } from 'react'
import {
  Area,
  AreaChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts'
import {
  ArrowUpRight,
  BookOpen,
  Bookmark,
  Check,
  ChevronRight,
  CircleAlert,
  Compass,
  Database,
  Flame,
  Globe2,
  Landmark,
  Search,
  Sparkles,
  TrendingUp,
} from 'lucide-react'
import { marketOptions, markets, priceLabels } from './researchData'

function getInitialFavorites() {
  try {
    return new Set(JSON.parse(localStorage.getItem('atlas-favorites') || '[]'))
  } catch {
    return new Set()
  }
}

function getInitialMarket() {
  if (typeof window === 'undefined') return 'us'
  const market = new URLSearchParams(window.location.search).get('market')
  return market && markets[market] ? market : 'us'
}

function PriceTooltip({ active, payload, label }) {
  if (!active || !payload?.length) return null
  return (
    <div className="price-tooltip">
      <span>{label}</span>
      <strong>{payload[0].value.toFixed(0)}.0</strong>
      <em>标准化价格指数</em>
    </div>
  )
}

function App() {
  const [marketId, setMarketId] = useState(getInitialMarket)
  const [industryId, setIndustryId] = useState('semis')
  const [selectedTicker, setSelectedTicker] = useState('NVDA')
  const [query, setQuery] = useState('')
  const [favorites, setFavorites] = useState(getInitialFavorites)
  const [showFavorites, setShowFavorites] = useState(false)
  const [researchTrack, setResearchTrack] = useState('all')

  const currentMarket = markets[marketId]
  const industries = currentMarket.industries
  const currentIndustry = industries.find((industry) => industry.id === industryId) ?? industries[0]
  const selectedCompany = currentIndustry.companies.find((company) => company.ticker === selectedTicker)
    ?? currentIndustry.companies[0]
  const favoriteKey = (ticker) => `${marketId}:${ticker}`

  const visibleCompanies = useMemo(() => {
    const keyword = query.trim().toLowerCase()
    return currentIndustry.companies.filter((company) => {
      const matchesQuery = !keyword || `${company.name} ${company.ticker} ${company.role} ${company.focus}`.toLowerCase().includes(keyword)
      const matchesTrack = researchTrack === 'all' || company.researchType === researchTrack
      return matchesQuery && matchesTrack && (!showFavorites || favorites.has(favoriteKey(company.ticker)))
    })
  }, [currentIndustry, favorites, query, researchTrack, showFavorites])

  const priceData = selectedCompany.curve.map((value, index) => ({ month: priceLabels[index], value }))
  const startPrice = selectedCompany.curve[0]
  const endPrice = selectedCompany.curve.at(-1)
  const impliedChange = Math.round(((endPrice - startPrice) / startPrice) * 100)

  useEffect(() => {
    localStorage.setItem('atlas-favorites', JSON.stringify([...favorites]))
  }, [favorites])

  function selectIndustry(id) {
    const nextIndustry = industries.find((industry) => industry.id === id)
    setIndustryId(id)
    const nextCompany = researchTrack === 'all'
      ? nextIndustry.companies[0]
      : nextIndustry.companies.find((company) => company.researchType === researchTrack) ?? nextIndustry.companies[0]
    setSelectedTicker(nextCompany.ticker)
    setQuery('')
  }

  function selectMarket(id) {
    const nextMarket = markets[id]
    if (!nextMarket) return
    const nextIndustry = nextMarket.industries[0]
    const nextCompany = researchTrack === 'all'
      ? nextIndustry.companies[0]
      : nextIndustry.companies.find((company) => company.researchType === researchTrack) ?? nextIndustry.companies[0]
    setMarketId(id)
    window.history.replaceState({}, '', id === 'us' ? window.location.pathname : `${window.location.pathname}?market=${id}`)
    setIndustryId(nextIndustry.id)
    setSelectedTicker(nextCompany.ticker)
    setQuery('')
  }

  function selectResearchTrack(track) {
    setResearchTrack(track)
    const nextCompany = track === 'all'
      ? currentIndustry.companies[0]
      : currentIndustry.companies.find((company) => company.researchType === track)
    if (nextCompany) setSelectedTicker(nextCompany.ticker)
  }

  function toggleFavorite(ticker) {
    const key = favoriteKey(ticker)
    setFavorites((previous) => {
      const next = new Set(previous)
      next.has(key) ? next.delete(key) : next.add(key)
      return next
    })
  }

  return (
    <main className={`atlas-shell market-${marketId}`}>
      <aside className="side-rail" aria-label="研究导航">
        <div className="brand-lockup">
          <div className="brand-mark" aria-hidden="true"><Compass size={22} /></div>
          <div>
            <p className="brand-name">Industry Atlas</p>
            <p className="brand-subtitle">投资研究工作台</p>
          </div>
        </div>

        <div className="market-switcher">
          <p className="rail-label">研究市场</p>
          <div className="region-list">
            {marketOptions.map((region) => (
              <button
                className={`region-button ${region.id === marketId ? 'is-active' : ''}`}
                key={region.id}
                type="button"
                disabled={!region.enabled}
                onClick={() => selectMarket(region.id)}
              >
                <Globe2 size={15} />
                <span>{region.label}</span>
                {!region.enabled && <small>筹备中</small>}
              </button>
            ))}
          </div>
        </div>

        <nav className="industry-nav" aria-label="行业">
          <div className="rail-heading">
            <p className="rail-label">{currentMarket.label}行业地图</p>
            <span>{industries.length} 类</span>
          </div>
          {industries.map((industry) => (
            <button
              key={industry.id}
              className={`industry-nav-item ${industry.id === industryId ? 'is-active' : ''}`}
              type="button"
              aria-pressed={industry.id === industryId}
              onClick={() => selectIndustry(industry.id)}
            >
              <span className="industry-code">{industry.code}</span>
              <span className="industry-label">
                <strong>{industry.name}</strong>
                <small>{industry.companies.length} 家研究标的</small>
              </span>
              <ChevronRight size={15} />
            </button>
          ))}
        </nav>

        <div className="source-card">
          <div className="source-card-icon"><Database size={16} /></div>
          <div>
            <strong>数据接入位</strong>
            <p>{marketId === 'cn' ? '交易所 · 巨潮 · 公司 IR' : 'SEC · IR · 合规行情源'}</p>
          </div>
          <span>v0.4</span>
        </div>
      </aside>

      <section className="research-canvas">
        <header className="top-bar">
          <div className="crumbs">
            <Landmark size={16} />
            <span>{currentMarket.libraryLabel}</span>
            <i />
            <strong>{currentIndustry.name}</strong>
          </div>
          <div className="top-actions">
            <button className="watchlist-button" type="button" onClick={() => setShowFavorites(!showFavorites)} aria-pressed={showFavorites}>
              <Bookmark size={16} fill={showFavorites ? 'currentColor' : 'none'} />
              关注清单 <span>{favorites.size}</span>
            </button>
            <div className="analyst-pill"><span /> 研究模式</div>
          </div>
        </header>

        <section className="industry-intro">
          <div className="industry-title-block">
            <p className="eyebrow">{currentIndustry.eyebrow}</p>
            <h1>{currentIndustry.name}<span>产业研究，而非股票清单。</span></h1>
            <p className="industry-description">{currentIndustry.description}</p>
          </div>
          <div className="industry-lens">
            <div className="lens-orbit" aria-hidden="true">
              <i /><i /><i />
              <span><Sparkles size={19} /></span>
            </div>
            <div>
              <p className="eyebrow">本行业的阅读镜头</p>
              <p>{currentIndustry.lens}</p>
              <span className="cycle-chip"><Flame size={13} /> {currentIndustry.cycle}</span>
            </div>
          </div>
        </section>

        <section className="company-strip" aria-label="公司选择器">
          <div className="strip-heading">
            <div>
              <p className="eyebrow">龙头公司图谱</p>
              <h2>从价值链的核心节点开始</h2>
            </div>
            <div className="company-strip-actions">
              <div className="research-track" aria-label="研究范围">
                <button type="button" className={researchTrack === 'all' ? 'is-active' : ''} onClick={() => selectResearchTrack('all')}>全部 6</button>
                <button type="button" className={researchTrack === 'leader' ? 'is-active' : ''} onClick={() => selectResearchTrack('leader')}>行业锚点</button>
                <button type="button" className={researchTrack === 'potential' ? 'is-active' : ''} onClick={() => selectResearchTrack('potential')}>潜力观察</button>
              </div>
              <label className="search-field">
                <Search size={16} />
                <span className="sr-only">搜索当前行业</span>
                <input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="搜索公司、代码或角色" />
              </label>
            </div>
          </div>
          <div className="company-cards">
            {visibleCompanies.map((company, index) => (
              <button
                key={company.ticker}
                className={`company-card ${company.ticker === selectedCompany.ticker ? 'is-selected' : ''}`}
                type="button"
                onClick={() => setSelectedTicker(company.ticker)}
                aria-pressed={company.ticker === selectedCompany.ticker}
              >
                <span className="company-card-top">
                  <span className="company-number">{String(index + 1).padStart(2, '0')}</span>
                  <span className="company-card-meta">
                    <span className="ticker">{company.ticker}</span>
                    <span className={`company-stage ${company.researchType}`}>{company.researchLabel}</span>
                  </span>
                </span>
                <strong>{company.name}</strong>
                <small>{company.role}</small>
                <span className="select-line" />
              </button>
            ))}
            {visibleCompanies.length === 0 && (
              <div className="empty-company-search">当前筛选没有匹配公司。清空搜索或关闭关注清单。</div>
            )}
          </div>
        </section>

        <section className="company-dossier" aria-labelledby="dossier-title">
          <div className="dossier-heading">
            <div>
              <div className="title-row">
                <p className="ticker">{selectedCompany.ticker}</p>
                <span className="company-focus">{selectedCompany.focus}</span>
                <span className={`dossier-stage ${selectedCompany.researchType}`}>{selectedCompany.researchLabel}</span>
              </div>
              <h2 id="dossier-title">{selectedCompany.name}</h2>
              <p>{selectedCompany.business}</p>
            </div>
            <button
              className={`save-company ${favorites.has(favoriteKey(selectedCompany.ticker)) ? 'is-saved' : ''}`}
              type="button"
              onClick={() => toggleFavorite(selectedCompany.ticker)}
              aria-pressed={favorites.has(favoriteKey(selectedCompany.ticker))}
            >
              {favorites.has(favoriteKey(selectedCompany.ticker)) ? <Check size={17} /> : <Bookmark size={17} />}
              {favorites.has(favoriteKey(selectedCompany.ticker)) ? '已加入关注' : '加入关注'}
            </button>
          </div>

          <div className="dossier-body">
            <div className="reading-grid">
              {selectedCompany.reading.map((item, index) => (
                <article className="reading-card" key={item.label}>
                  <span className="thesis-index">{String(index + 1).padStart(2, '0')}</span>
                  <div>
                    <p className="eyebrow">{item.label}</p>
                    <h3>{item.title}</h3>
                    <p>{item.text}</p>
                  </div>
                </article>
              ))}
            </div>

            <aside className="research-aside">
              <div className="thesis-statement">
                <p className="eyebrow">投资判断的起点</p>
                <p>{selectedCompany.thesis}</p>
              </div>
              <div className="research-questions">
                <p className="eyebrow">应当反复问的问题</p>
                <ol>
                  {selectedCompany.questions.map((question) => <li key={question}>{question}</li>)}
                </ol>
              </div>
              <article className="price-panel">
              <div className="price-panel-header">
                <div>
                  <p className="eyebrow">价格轨迹</p>
                  <h3>12M 相对价格 <span>· 示意</span></h3>
                </div>
                <div className={`change-readout ${impliedChange >= 0 ? 'positive' : 'negative'}`}>
                  <TrendingUp size={16} />
                  <strong>{impliedChange >= 0 ? '+' : ''}{impliedChange}%</strong>
                  <small>相对起点</small>
                </div>
              </div>
              <div className="chart-wrap">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={priceData} margin={{ top: 8, right: 6, left: -26, bottom: 0 }}>
                    <defs>
                      <linearGradient id="signal-fill" x1="0" x2="0" y1="0" y2="1">
                        <stop offset="0%" stopColor="#e07552" stopOpacity={0.34} />
                        <stop offset="100%" stopColor="#e07552" stopOpacity={0} />
                      </linearGradient>
                    </defs>
                    <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ fill: '#7b889e', fontSize: 11 }} interval={1} />
                    <YAxis domain={['dataMin - 8', 'dataMax + 8']} axisLine={false} tickLine={false} tick={{ fill: '#7b889e', fontSize: 11 }} width={36} />
                    <Tooltip content={<PriceTooltip />} cursor={{ stroke: '#c7d2df', strokeWidth: 1 }} />
                    <Area type="monotone" dataKey="value" stroke="#d75a39" strokeWidth={2.4} fill="url(#signal-fill)" activeDot={{ r: 4, fill: '#d75a39', stroke: '#fff9f2', strokeWidth: 2 }} />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
              <p className="chart-note"><CircleAlert size={13} /> 演示序列仅用于视觉与交互。接入行情源后须显示复权规则、延迟和更新时点。</p>
              </article>
            </aside>
          </div>

          <div className="tags-row" aria-label="投资特征">
            <span className="tags-label">投资特征</span>
            {selectedCompany.tags.map((tag) => <span className="research-tag" key={tag}>{tag}</span>)}
          </div>
        </section>

        <section className="evidence-section">
          <div className="evidence-heading">
            <div>
              <p className="eyebrow">过去三年的深读路径</p>
              <h2>用披露验证，而不是用叙事代替证据</h2>
            </div>
            <a href={selectedCompany.links[2].href} target="_blank" rel="noreferrer" className="filing-link">
              打开 {currentMarket.disclosureLabel} <ArrowUpRight size={15} />
            </a>
          </div>
          <ol className="event-timeline">
            {selectedCompany.researchTrail.map((event, index) => {
              return (
                <li key={event.year}>
                  <span className="event-dot">{String(index + 1).padStart(2, '0')}</span>
                  <div>
                    <time>{event.year} · {event.title}</time>
                    <p>{event.detail}</p>
                  </div>
                </li>
              )
            })}
          </ol>
        </section>

        <section className="source-library" aria-labelledby="source-title">
          <div className="source-heading">
            <div>
              <p className="eyebrow">研究链接库 · {selectedCompany.links.length} 个入口</p>
              <h2 id="source-title">先读原始材料，再听市场观点</h2>
            </div>
            <p>{marketId === 'cn' ? '官网、IR 与交易所公告用来理解经营；年报、定期报告与巨潮资讯用来验证；市场数据链接只用作交叉核对。' : '官网和 IR 用来理解经营；10-K、10-Q、8-K 用来验证；市场数据链接只用作交叉核对。'}</p>
          </div>
          <div className="source-link-grid">
            {selectedCompany.links.map((link) => (
              <a className="source-link" key={link.label} href={link.href} target="_blank" rel="noreferrer">
                <span className="source-link-group">{link.group}</span>
                <strong>{link.label}<ArrowUpRight size={14} /></strong>
                <small>{link.note}</small>
              </a>
            ))}
          </div>
        </section>

        <footer className="research-footer">
          <BookOpen size={16} />
          <p>研究顺序：行业结构 → 竞争位置 → 财务验证 → 估值 → 风险反证。<strong>本工具是研究起点，不是投资建议。</strong></p>
        </footer>
      </section>
    </main>
  )
}

export default App
