const rows = (sector, companies) => companies.map((company, index) => enrichCompany({ ...company, sector }, index))

const secSearch = (ticker, form) => {
  const terms = form ? `${ticker} ${form}` : ticker
  return `https://www.sec.gov/edgar/search/#/q=${encodeURIComponent(terms)}`
}

const slug = (value) => value.toLowerCase().replaceAll('.', '-').replaceAll(' ', '-')

function curveFor(ticker, offset) {
  const seed = [...ticker].reduce((total, char) => total + char.charCodeAt(0), 0) + offset * 17
  return Array.from({ length: 12 }, (_, index) => {
    const trend = index * (2.25 + (seed % 5) * 0.38)
    const wave = Math.sin((index + seed) * 0.86) * (3 + (seed % 4))
    return Math.round(72 + (seed % 19) + trend + wave)
  })
}

function buildChinaLinks(company) {
  const companySearch = encodeURIComponent(`${company.name} 年报 公告`)
  const investorSearch = encodeURIComponent(`${company.name} 投资者关系`)
  const wiki = encodeURIComponent(`${company.name} 公司`)
  const quote = encodeURIComponent(company.financeSymbol || company.ticker)

  return [
    { group: '一手资料', label: '公司官网', note: '产品、业务与新闻中心', href: company.website },
    { group: '一手资料', label: '投资者关系', note: '年报、业绩材料与公告', href: company.ir || `https://www.google.com/search?q=${investorSearch}` },
    { group: '监管披露', label: '公司公告检索', note: '按公司名寻找原始披露', href: `https://www.baidu.com/s?wd=${companySearch}` },
    { group: '监管披露', label: '港交所披露', note: '港股公告与财务报告', href: 'https://www1.hkexnews.hk/search/titlesearch.xhtml?lang=zh' },
    { group: '监管披露', label: '上交所公告', note: '沪市上市公司披露', href: 'https://www.sse.com.cn/disclosure/listedinfo/announcement/' },
    { group: '监管披露', label: '深交所公告', note: '深市上市公司披露', href: 'https://www.szse.cn/disclosure/listed/notice/index.html' },
    { group: '监管披露', label: '巨潮资讯', note: '法定信息披露检索', href: 'https://www.cninfo.com.cn/' },
    { group: '背景资料', label: 'Wikipedia', note: '公司沿革与业务全景', href: `https://zh.wikipedia.org/w/index.php?search=${wiki}` },
    { group: '市场数据', label: 'Google Finance', note: '报价、估值与同业对照', href: `https://www.google.com/finance/quote/${quote}` },
    { group: '市场数据', label: '东方财富', note: '行情、公告与财务摘要', href: `https://so.eastmoney.com/web/s?keyword=${encodeURIComponent(company.name)}` },
    { group: '市场数据', label: 'TradingView', note: '价格、图形与财报事件', href: `https://www.tradingview.com/symbols/${encodeURIComponent(company.ticker)}/` },
    { group: '深读入口', label: '年报与业绩会材料', note: '从原始披露建立判断', href: company.ir || `https://www.baidu.com/s?wd=${companySearch}` },
  ]
}

function buildLinks(company) {
  if (company.market === 'cn') return buildChinaLinks(company)
  const ticker = company.secTicker || company.ticker
  const financeSymbol = company.financeSymbol || `${company.exchange || 'NASDAQ'}:${company.ticker}`
  const yahooSymbol = company.yahooSymbol || company.ticker
  const wiki = encodeURIComponent(`${company.name} company`)
  const searchTerm = encodeURIComponent(`${company.name} investor relations`)

  return [
    { group: '一手资料', label: '公司官网', note: '产品、业务与新闻中心', href: company.website },
    { group: '一手资料', label: '投资者关系', note: '财报、演示材料、业绩会', href: company.ir || `https://www.google.com/search?q=${searchTerm}` },
    { group: '监管披露', label: 'SEC 全部披露', note: '公司所有公开文件', href: secSearch(ticker) },
    { group: '监管披露', label: '最近 10-K', note: '年度报告与风险因素', href: secSearch(ticker, '10-K') },
    { group: '监管披露', label: '最近 10-Q', note: '季度变化与管理层讨论', href: secSearch(ticker, '10-Q') },
    { group: '监管披露', label: '8-K 重大事项', note: '交易、指引、突发披露', href: secSearch(ticker, '8-K') },
    { group: '背景资料', label: 'Wikipedia', note: '公司沿革与业务全景', href: `https://en.wikipedia.org/wiki/Special:Search?search=${wiki}` },
    { group: '市场数据', label: 'Google Finance', note: '报价、估值与同业对照', href: `https://www.google.com/finance/quote/${encodeURIComponent(financeSymbol)}` },
    { group: '市场数据', label: 'Yahoo Finance', note: '财务历史与业绩日历', href: `https://finance.yahoo.com/quote/${encodeURIComponent(yahooSymbol)}` },
    { group: '市场数据', label: 'TradingView', note: '价格、技术图形与财报事件', href: `https://www.tradingview.com/symbols/${encodeURIComponent(company.ticker)}/` },
    { group: '市场数据', label: 'Nasdaq 档案', note: '市场活动与公司概览', href: `https://www.nasdaq.com/market-activity/stocks/${slug(company.ticker)}` },
    { group: '深读入口', label: '业绩会与演示材料', note: '从管理层原话建立判断', href: company.ir || `https://www.google.com/search?q=${searchTerm}` },
  ]
}

function enrichCompany(company, position) {
  const sector = company.sector
  const researchType = company.researchType || (position < 3 ? 'leader' : 'potential')
  const researchLabel = researchType === 'leader' ? '行业锚点' : '潜力观察'
  const competitorText = company.competitors || sector.competitors
  const allocationText = company.capital || sector.capital
  const metricText = company.metric || sector.metric
  const reading = [
    { label: '业务结构', title: '公司如何赚钱', text: company.business },
    { label: '竞争优势', title: '为什么不易替代', text: company.moat },
    { label: '增长来源', title: '下一段增量从哪里来', text: company.growth },
    { label: '竞争格局', title: '和谁争什么', text: competitorText },
    { label: '资本与治理', title: '管理层如何配置资源', text: allocationText },
    { label: '验证指标', title: '季度里先看什么', text: metricText },
    { label: '风险反证', title: '什么会让判断失效', text: company.risk },
    { label: '估值框架', title: '不要只问贵不贵', text: `估值必须与“${company.growth}”的持续时间、资本强度和自由现金流转换一起读。把公司与${competitorText}对照时，优先比较增量回报和风险调整后的现金流，而不是孤立的市盈率。` },
    { label: '管理层验证', title: '话术如何落到行动', text: `检查管理层是否把资源投向“${company.focus}”，以及资本配置是否符合“${allocationText}”。业绩会承诺应被后续订单、利润率、现金流和回购/并购行为逐项验证。` },
    { label: '研究动作', title: '下一步应读什么', text: company.market === 'cn'
      ? `先读最近三年年报中的业务、风险因素与管理层讨论；再用定期报告、交易所公告和业绩会材料交叉验证“${company.growth}”是否已体现在订单、价格、成本或现金流中。`
      : `先读 10-K 的业务、风险因素与 MD&A；再用最近两份 10-Q 和 8-K 交叉验证“${company.growth}”是否已体现在订单、价格、成本或现金流中。` },
  ]

  return {
    ...company,
    ordinal: position + 1,
    researchType,
    researchLabel,
    curve: curveFor(company.ticker, position),
    links: buildLinks(company),
    reading,
    thesis: researchType === 'leader'
      ? `作为行业锚点，${company.business}。投资结论不应只取决于一个季度的价格波动，而要验证其护城河是否仍能将行业景气转化为可持续现金流。`
      : `作为潜力观察对象，${company.business}。核心不在于它是否已是行业最大，而在于“${company.growth}”能否在未来几个财报周期中被订单、利润率和自由现金流证实。`,
    questions: [
      `“${company.growth}”的真实瓶颈是什么：需求、供给、执行，还是监管？`,
      `相对于${competitorText}，公司是否仍在扩大单位价值、客户粘性或资产回报？`,
      `若下一份财报与预期背离，优先用“${metricText}”判断是暂时波动还是竞争地位变化。`,
    ],
    researchTrail: [
      { year: '2025', title: '最新年度材料', detail: `用年报、业绩会与资本开支说明验证：${company.growth}` },
      { year: '2024', title: '竞争位置复核', detail: `回看产品、价格和市场份额是否支持：${company.moat}` },
      { year: '2023', title: '周期起点与管理层承诺', detail: `对照当时经营环境与现在的兑现度：${company.business}` },
    ],
    tags: [researchLabel, sector.short, company.focus, company.style || '长期跟踪'],
    snapshot: [
      { label: '价值链位置', value: company.role },
      { label: '首要跟踪', value: metricText },
      { label: '研究风险', value: company.risk },
    ],
  }
}

function compactCompanies(sector, records) {
  const growthTheme = sector.growth || `${sector.name} 的结构性增长取决于需求恢复、竞争份额和盈利质量是否同步改善`
  return records.map(([ticker, name, role, focus, website, ir, business, risk, style], index) => ({
    ticker,
    name,
    role,
    focus,
    website,
    ir,
    style,
    business,
    moat: `${sector.edge} 对 ${name} 而言，具体体现为其在“${role}”位置上的客户关系、专业能力和规模优势。`,
    growth: `${growthTheme}。对 ${name} 的判断要落到“${focus}”是否能持续扩大收入、利润或现金流质量。`,
    risk: risk || sector.risk,
    metric: sector.metric,
    competitors: sector.competitors,
    capital: sector.capital,
    ordinal: index + 1,
  }))
}

const definitions = [
  {
    id: 'semis', code: '01', name: 'AI 与半导体', short: '算力链', eyebrow: 'Compute stack', cycle: '高景气 · 高预期',
    description: '从先进制程、加速计算到存储与网络。必须拆开看“需求很热”与“谁能获得超额回报”。',
    lens: '追踪云厂商 CapEx、GPU 利用率、HBM 供给、先进制程良率与价格。',
    competitors: '同一价值链中要同时观察平台型设计商、代工厂、设备商与自研芯片路线的议价权变化。',
    capital: '高研发和高资本投入并存。读管理层指引时，把路线图、产能承诺、回购和并购放在同一个现金流框架中。',
    edge: '软件生态、制造良率、IP 与客户认证共同形成壁垒，单一芯片的领先并不足够。', metric: '数据中心收入、订单可见度、毛利率、库存天数、先进封装/制程产能。',
    companies: [
      { ticker: 'NVDA', name: 'NVIDIA', role: '加速计算平台', focus: 'AI 基建', website: 'https://www.nvidia.com/en-us/', ir: 'https://investor.nvidia.com/', business: '以数据中心 GPU、网络、系统与 CUDA 软件生态，将训练和推理的算力需求产品化。', moat: 'CUDA 开发者生态、软硬件协同与系统级产品节奏带来极高迁移成本。', growth: '推理规模化、企业 AI 与主权 AI 把需求从训练延展到更多工作负载。', risk: '云厂商自研芯片、CapEx 回落与供应链集中会放大预期波动。', metric: '数据中心收入、网络/系统附加率、供给交付与客户 CapEx。', competitors: 'AMD、定制 ASIC、云厂商自研芯片与其他加速计算路线。', capital: '重点核验研发投入是否延续平台优势，以及供应承诺能否转为高质量现金流。' },
      { ticker: 'AVGO', name: 'Broadcom', role: '定制芯片与基础软件', focus: '网络 / ASIC', website: 'https://www.broadcom.com/', ir: 'https://investors.broadcom.com/', business: '通过高速网络、定制 AI 芯片和企业基础软件覆盖数据中心的关键节点。', moat: '头部客户共同设计、交换芯片 IP 与深度嵌入的企业软件安装基础。', growth: '超大规模客户使用 ASIC 分担 AI 工作负载，软件整合提升现金流。', risk: '客户集中、定制项目节奏和大型软件整合可能改变盈利质量。', metric: 'AI 半导体收入、积压订单、软件续费与自由现金流转换。', competitors: 'NVIDIA、Marvell、定制芯片团队与基础软件同业。', capital: '并购后的去杠杆、研发优先级与股东回报是长期估值关键。' },
      { ticker: 'AMD', name: 'AMD', role: 'CPU / GPU 挑战者', focus: '份额争夺', website: 'https://www.amd.com/', ir: 'https://ir.amd.com/', business: '以服务器 CPU、数据中心 GPU 与嵌入式业务挑战既有计算格局。', moat: 'x86 设计能力、先进制程伙伴关系与服务器 OEM 生态提供扩张基础。', growth: '服务器 CPU 份额提升与 AI GPU 客户认证带来经营杠杆。', risk: 'AI 产品竞争强度高，市场对收入兑现与毛利率极其敏感。', metric: '服务器份额、AI GPU 客户部署、数据中心毛利率。', competitors: 'NVIDIA、Intel、Arm 服务器和云厂商自研路线。', capital: '关注产品研发周期和并购资产能否提升而非稀释回报率。' },
      { ticker: 'TSM', name: 'TSMC', role: '先进制程代工', focus: '制造瓶颈', website: 'https://www.tsmc.com/english', ir: 'https://investor.tsmc.com/english', business: '全球领先的专注代工厂，为高性能计算、手机和 AI 芯片客户制造先进逻辑芯片。', moat: '制程良率、规模、客户信任和资本投入形成难以复制的复合壁垒。', growth: '先进节点、先进封装与海外产能布局提高每片晶圆价值。', risk: '地缘风险、周期波动和巨额资本开支必须独立计价。', metric: '先进节点占比、晶圆价格、利用率、CoWoS 供给与海外厂爬坡。', competitors: 'Samsung Foundry、Intel Foundry 与成熟制程厂商。', capital: '重点读资本开支、海外厂补贴和折旧对自由现金流的影响。' },
      { ticker: 'ASML', name: 'ASML', role: '关键光刻设备', focus: 'EUV', website: 'https://www.asml.com/en', ir: 'https://www.asml.com/en/investors', business: '提供先进芯片制造所需的关键光刻系统，是设备链的独特节点。', moat: 'EUV 的长期工程积累、精密供应链和客户协同研发构成极高进入门槛。', growth: '先进制程扩产和 High-NA EUV 导入拉长技术升级周期。', risk: '出口限制、订单确认节奏和客户 CapEx 延后会令季度数据摆动。', metric: '订单、积压订单、EUV/High-NA 交付、服务收入和出口限制。', competitors: '在核心 EUV 环节缺乏同级直接替代，仍需看客户自制和政策约束。', capital: '关注研发与供应链投资如何保持技术领先，以及订单取消/延后的现金影响。' },
      { ticker: 'MU', name: 'Micron', role: '存储芯片', focus: 'HBM 周期', website: 'https://www.micron.com/', ir: 'https://investors.micron.com/', business: '生产 DRAM、NAND 与高带宽内存，利润高度受供需纪律和技术代际驱动。', moat: '工艺、规模与客户认证构成门槛，但行业本质仍强周期。', growth: 'HBM 供给紧张和 AI 服务器内存含量提升可改善产品组合。', risk: '库存反转、价格竞争和资本开支失控会快速侵蚀利润。', metric: 'DRAM/NAND 价格、库存、HBM 良率、CapEx 和自由现金流。', competitors: 'Samsung、SK hynix 和中国存储扩张。', capital: '必须将管理层的 CapEx 纪律与行业供给公告交叉验证。' },
    ],
  },
  {
    id: 'cloud', code: '02', name: '云与企业软件', short: '企业软件', eyebrow: 'Digital operating system', cycle: '结构成长 · 分化',
    description: '企业技术预算的核心战场。区分“功能”与“系统级工作流”，才能判断真正的定价权。', lens: '观察云增长、留存、AI 附加收入、销售效率和自由现金流，而不只看发布会。', competitors: '重点比较平台深度、开发者/合作伙伴生态、客户迁移成本和预算替代关系。', capital: '软件公司看研发、销售效率、并购纪律和回购之间的取舍。', edge: '嵌入工作流、掌握数据/身份层且可扩展模块的产品更有定价权。', metric: '订阅增长、RPO/积压订单、净留存、云利润率、自由现金流。',
    companies: [
      { ticker: 'MSFT', name: 'Microsoft', role: '企业软件与云', focus: 'Azure / Copilot', website: 'https://www.microsoft.com/', ir: 'https://www.microsoft.com/en-us/Investor/', business: '通过 Office、Windows、Azure、Dynamics 和安全产品占据企业 IT 工作流中心。', moat: '企业合同、身份体系、分发渠道和生态让新能力可嵌入既有工作流。', growth: 'Azure 与 Copilot 的商业化可以扩展每位企业用户的价值。', risk: 'AI 基础设施投入回收、云竞争和监管压力需与资本回报并看。', metric: 'Azure 增速、商业剩余履约义务、Copilot 采用和 CapEx。', competitors: 'AWS、Google Cloud、Oracle 及专业 SaaS 供应商。', capital: '重点核验 AI CapEx 转化为收入和毛利的速度，而不只看总投入。' },
      { ticker: 'GOOGL', name: 'Alphabet', role: '搜索、视频与云', focus: 'AI 搜索', website: 'https://abc.xyz/', ir: 'https://abc.xyz/investor/', business: '广告业务提供现金流，Search、YouTube、Cloud 和 AI 平台构成多引擎结构。', moat: '用户意图数据、默认分发、YouTube 生态和全球基础设施相互强化。', growth: '云利润率提升和 AI 产品增强搜索、视频广告效率。', risk: '搜索行为变化、反垄断案件与模型推理成本会改变单位经济。', metric: 'Search/YouTube 增长、Cloud 利润率、TAC、CapEx 和查询单位经济。', competitors: 'Meta、Amazon、Microsoft、TikTok 与新型搜索入口。', capital: '净现金、回购和 AI 基建投入的平衡决定每股价值增长。' },
      { ticker: 'AMZN', name: 'Amazon', role: '电商与云基础设施', focus: 'AWS / 履约', website: 'https://www.amazon.com/', ir: 'https://ir.aboutamazon.com/', business: '将电商履约网络、Prime、广告与 AWS 组合为消费和基础设施平台。', moat: '物流密度、会员习惯、商家网络与 AWS 开发者粘性相互增强。', growth: '零售效率、广告渗透与 AWS AI 服务可共同提升经营杠杆。', risk: '消费需求、物流成本和云竞争令各业务段节奏并不一致。', metric: 'AWS 增长、北美零售利润率、广告收入、履约成本和 CapEx。', competitors: 'Microsoft、Google、Walmart、Shopify 与区域电商平台。', capital: '观察重资产履约与数据中心投资是否以更高的资产周转回报。' },
      { ticker: 'ORCL', name: 'Oracle', role: '数据库与企业云', focus: '云数据库', website: 'https://www.oracle.com/', ir: 'https://investor.oracle.com/', business: '从关键数据库和企业应用出发，扩展至高性能云基础设施。', moat: '核心数据库迁移成本、长期客户合同和任务关键工作负载带来稳定续费。', growth: '数据库上云和 AI 基础设施合同可能提升增长中枢。', risk: '基础设施投入加速后，交付能力与现金流平衡需要重点核验。', metric: '云收入、RPO、数据中心建设、客户迁移和 FCF。', competitors: 'AWS、Azure、Google Cloud、Snowflake 与开源数据库。', capital: '关注数据中心投资承诺、债务和租赁安排对回报率的影响。' },
      { ticker: 'CRM', name: 'Salesforce', role: '客户关系平台', focus: '工作流 AI', website: 'https://www.salesforce.com/', ir: 'https://investor.salesforce.com/', business: '提供销售、服务、营销和数据平台，是企业客户运营的重要软件层。', moat: '客户数据、深度定制、合作伙伴生态与流程嵌入带来高切换成本。', growth: '数据云和 AI 功能若进入实际销售流程，可提高客单价和留存。', risk: '增长放缓、并购整合和销售费用效率决定估值弹性。', metric: '订阅增长、RPO、营业利润率、净留存和 FCF。', competitors: 'Microsoft、Oracle、HubSpot、Adobe 与垂直 SaaS。', capital: '重点看并购资产整合后是否提升利润率与每股自由现金流。' },
      { ticker: 'NOW', name: 'ServiceNow', role: '企业工作流平台', focus: '流程自动化', website: 'https://www.servicenow.com/', ir: 'https://investor.servicenow.com/', business: '把 IT、员工、客户和业务流程连接为统一企业工作流平台。', moat: '跨部门流程嵌入、合作伙伴生态和高续费率使替换成本显著。', growth: 'AI Agent 与流程自动化扩大可服务市场并提高平台粘性。', risk: '大型企业 IT 预算收紧，以及高估值对合同增长非常敏感。', metric: '订阅收入、RPO、大单数量、续费率和销售效率。', competitors: 'Salesforce、Microsoft、SAP、UiPath 与垂直工作流工具。', capital: '关注研发和销售扩张是否持续换来高质量合同和自由现金流。' },
    ],
  },
  {
    id: 'digital', code: '03', name: '互联网平台与媒体', short: '注意力平台', eyebrow: 'Attention economy', cycle: '网络效应 · 高运营杠杆',
    description: '广告、内容、市场平台和订阅模式争夺用户注意力与交易入口。真正重要的是获客成本、留存和变现深度。', lens: '追踪用户时间、广告加载率、ARPU、内容投入回报、供给质量和监管。', competitors: '比较流量来源、创作者/商家供给、广告工具和用户数据，不要只看 DAU。', capital: '内容投入、数据中心、回购与并购会显著改变每股现金流。', edge: '双边网络、算法分发、品牌和高频使用习惯是最常见的防线。', metric: '用户增长、参与度、广告价格/加载、ARPU、内容现金回收。',
    companies: [
      { ticker: 'META', name: 'Meta Platforms', role: '社交广告平台', focus: '广告效率', website: 'https://about.meta.com/', ir: 'https://investor.atmeta.com/', business: '依靠社交图谱、广告工具和全球应用组合，把注意力变现为高利润广告收入。', moat: '规模化社交网络、广告主数据和分发算法持续改善投放回报。', growth: 'AI 推荐、消息业务和新广告位提高用户时间与广告变现。', risk: '监管、年轻用户迁移、内容生态变化和 Reality Labs 投入。', metric: '展示量、广告单价、参与度、AI CapEx 和 Reality Labs 亏损。', competitors: 'TikTok、YouTube、Snap、Amazon 广告和新社交产品。', capital: '分拆看核心广告 FCF 与长期押注的资本消耗，避免混为单一叙事。' },
      { ticker: 'NFLX', name: 'Netflix', role: '流媒体平台', focus: '内容与广告', website: 'https://www.netflix.com/', ir: 'https://ir.netflix.net/', business: '以全球订阅、内容版权和广告套餐构建规模化视频娱乐服务。', moat: '品牌、全球分发、用户数据与内容采购规模共同降低单位内容成本。', growth: '广告层、账号共享治理和国际市场提升每用户变现。', risk: '内容成本、竞争、用户流失和价格敏感度。', metric: '会员净增、ARPU、广告收入、内容现金支出和营业利润率。', competitors: 'Disney、YouTube、Amazon、Max 与区域平台。', capital: '关注内容现金支出是否产生长期观看时长和价格权。' },
      { ticker: 'UBER', name: 'Uber', role: '出行与配送平台', focus: '双边网络', website: 'https://www.uber.com/', ir: 'https://investor.uber.com/', business: '连接司机、乘客、商家和配送员，以平台抽佣和广告服务变现。', moat: '本地流动性、品牌、调度算法和多业务交叉使用形成网络效应。', growth: '配送、广告、会员和国际渗透提高每笔交易的变现深度。', risk: '监管、司机供给、补贴竞争和自动驾驶长期改变成本结构。', metric: 'Trips、Gross Bookings、Take Rate、司机激励和 Adjusted EBITDA。', competitors: 'Lyft、DoorDash、Grab、区域出行平台和自动驾驶运营商。', capital: '优先看增长是否越来越依赖低补贴和可持续 FCF。' },
      { ticker: 'ABNB', name: 'Airbnb', role: '住宿平台', focus: '供给网络', website: 'https://www.airbnb.com/', ir: 'https://investors.airbnb.com/', business: '连接旅行者和房东，以轻资产市场平台服务短中期住宿需求。', moat: '全球品牌、房东供给、信任体系和直接流量降低获客成本。', growth: '国际、长期住宿、新城市和服务层可以扩大需求池。', risk: '城市监管、酒店竞争、旅行周期和供给质量。', metric: 'Nights & Experiences、ADR、活跃房源、直访流量和 FCF。', competitors: 'Booking、Expedia、酒店集团和地区短租平台。', capital: '观察回购与产品/信任投入是否提升每股平台价值。' },
      { ticker: 'SPOT', name: 'Spotify', role: '音频流媒体', focus: '订阅与广告', website: 'https://www.spotify.com/', ir: 'https://investors.spotify.com/', business: '通过音乐、播客和有声书，结合订阅与广告服务全球音频用户。', moat: '用户习惯、推荐数据、品牌与音频内容生态。', growth: '定价、广告、播客和有声书改善收入组合与毛利。', risk: '版权成本、平台依赖、内容投入和竞争加剧。', metric: 'MAU、Premium 用户、ARPU、毛利率、内容成本和 FCF。', competitors: 'Apple Music、YouTube Music、Amazon Music 和播客平台。', capital: '看管理层能否将用户规模稳定转化为利润率而不是纯补贴增长。' },
      { ticker: 'TTWO', name: 'Take-Two', role: '互动娱乐内容商', focus: '内容管线', website: 'https://www.take2games.com/', ir: 'https://investors.take2games.com/', business: '通过核心游戏 IP、线上服务和移动内容运营全球互动娱乐组合。', moat: '强 IP、开发能力、社区和高生命周期内容运营。', growth: '大型作品发布、线上化和移动业务扩展可能拉长内容变现周期。', risk: '延期、开发成本、用户口味变化和并购整合。', metric: 'Bookings、递延收入、活跃用户、内容开发支出和发布日程。', competitors: 'Electronic Arts、Activision、Epic、移动游戏公司。', capital: '重点核验内容投资回报、项目延期成本和并购协同兑现。' },
    ],
  },
  {
    id: 'finance', code: '04', name: '金融、支付与资产管理', short: '金融网络', eyebrow: 'Capital allocation engine', cycle: '利率 · 信用 · 市场周期',
    description: '研究金融公司不能只看 PE：必须把负债端、信用风险、手续费收入和资本回报拆开。', lens: '看净利息收入、存款/资金成本、信用损失、AUM、流量和资本充足率。', competitors: '比较低成本资金、分销网络、产品广度、监管资本和风险控制。', capital: '金融业的“再投资”体现为贷款、做市、收购、回购和分红，资本配置更直接。', edge: '低成本负债、牌照、品牌信任、支付/交易网络和客户关系是核心壁垒。', metric: 'NII、存款、信用损失、AUM/流入、ROE、资本比率。',
    companies: [
      { ticker: 'JPM', name: 'JPMorgan Chase', role: '综合银行', focus: '低成本资金', website: 'https://www.jpmorganchase.com/', ir: 'https://www.jpmorganchase.com/ir', business: '涵盖消费者银行、企业投行、支付、资产管理和财富管理。', moat: '规模、技术、低成本存款、风险管理和跨业务客户关系。', growth: '支付、财富、投行恢复和客户份额提升可补充利差收入。', risk: '信贷损失、利率路径、监管资本和商用地产暴露。', metric: '净利息收入、存款 Beta、信用成本、资本比率和 ROTCE。', competitors: 'Bank of America、Citigroup、Goldman Sachs、非银金融科技。', capital: '重点看回购/分红在监管资本约束后的可持续性。' },
      { ticker: 'V', name: 'Visa', role: '全球支付网络', focus: '交易量', website: 'https://www.visa.com/', ir: 'https://investor.visa.com/', business: '运营全球支付网络，从消费、跨境和数字支付活动中按交易规模收取网络费用。', moat: '双边网络效应、发卡机构关系、受理网络和风险管理能力。', growth: '电子支付渗透、跨境旅行和增值服务提升单位交易价值。', risk: '费率监管、替代支付、宏观消费和跨境交易波动。', metric: '支付量、跨境量、处理笔数、增值服务和客户激励。', competitors: 'Mastercard、American Express、实时支付与数字钱包。', capital: '轻资产高 FCF 模式下，回购节奏和并购纪律值得持续跟踪。' },
      { ticker: 'MA', name: 'Mastercard', role: '全球支付网络', focus: '跨境 / 服务', website: 'https://www.mastercard.com/', ir: 'https://investor.mastercard.com/', business: '依托全球卡网络，并通过数据、风控和服务提高单笔交易的价值。', moat: '商户与发卡网络、品牌信任和跨境清算能力形成双边平台优势。', growth: '跨境交易、账户覆盖和增值服务使增长不只依赖费率。', risk: '监管、直接账户到账户支付与可支配收入下滑。', metric: 'Gross Dollar Volume、跨境量、Switching、服务收入和激励。', competitors: 'Visa、Amex、银行自有网络、数字钱包。', capital: '留意高回购率是否仍建立在健康的长期支付网络扩张之上。' },
      { ticker: 'BLK', name: 'BlackRock', role: '资产管理平台', focus: 'AUM 与 Aladdin', website: 'https://www.blackrock.com/', ir: 'https://ir.blackrock.com/', business: '管理主动、指数、ETF 与另类资产，并通过 Aladdin 提供投资运营基础设施。', moat: 'iShares 分销、机构客户关系、规模费率和技术平台。', growth: 'ETF 流入、另类资产和 Aladdin 可扩大高质量经常性收入。', risk: '市场下跌、费率竞争、基金流出与整合执行。', metric: '净流入、AUM、基点费率、Aladdin 收入和经营利润率。', competitors: 'Vanguard、State Street、Fidelity、另类资产管理人。', capital: '通过收购和产品扩张追求规模时，需核验协同与费率质量。' },
      { ticker: 'KKR', name: 'KKR', role: '另类资产管理', focus: '管理费复利', website: 'https://www.kkr.com/', ir: 'https://ir.kkr.com/', business: '通过私募股权、信贷、基础设施和保险资产管理获得管理费、业绩报酬与投资收益。', moat: '品牌、募资网络、交易能力、长期资本和保险资金来源。', growth: '私募信贷、基础设施、保险和永久资本扩展收费 AUM。', risk: '资产估值、退出窗口、信贷损失、业绩费波动和监管。', metric: 'Fee-Related Earnings、收费 AUM、净流入、已投资/待投资资本。', competitors: 'Blackstone、Apollo、Ares、Carlyle 与银行私募信贷。', capital: '区分可重复管理费与周期性业绩费，重点看股东资本配置。' },
      { ticker: 'SCHW', name: 'Charles Schwab', role: '券商与财富平台', focus: '客户资产', website: 'https://www.schwab.com/', ir: 'https://www.aboutschwab.com/ir', business: '通过经纪、银行存款、财富咨询和交易平台服务个人与顾问客户。', moat: '低成本交易、品牌、RIA 渠道、客户资产黏性与规模运营。', growth: '客户资产增长、顾问渠道和利率正常化可支持盈利恢复。', risk: '存款外流、利率下行、货币基金替代和监管资本。', metric: '客户资产、净新资产、存款、净利差、客户现金比例。', competitors: 'Fidelity、Morgan Stanley、Robinhood、银行财富平台。', capital: '读资产负债表期限错配、证券组合和回购空间，而不仅是交易量。' },
    ],
  },
  {
    id: 'consumer', code: '05', name: '必选消费与零售', short: '消费防御', eyebrow: 'Household cashflow', cycle: '复购 · 定价 · 份额',
    description: '真正的消费护城河来自习惯、供应链、渠道和价值感，而不是单一品牌故事。', lens: '关注客流、同店、会员/复购、单位经济、库存和价格与销量的关系。', edge: '规模采购、会员/分销网络、品牌信任与高频需求带来稳定性。', growth: '会员、私牌、数字渠道和广告/第三方服务正提高传统零售的利润密度。', risk: '消费降级、价格弹性、成本通胀、私牌竞争和库存错配。', metric: '同店销售、客流、会员续费、库存、毛利率、线上/广告渗透。', competitors: '全渠道零售、私牌、品牌商与区域渠道之间的份额再分配。', capital: '门店、物流、库存、营销和回购都可能改变资本回报。',
    companies: compactCompanies({
      short: '消费防御', edge: '品牌、渠道、采购规模和消费者习惯共同形成防线', growth: '价格/组合、国际扩张和供应链效率决定增量', risk: '需求疲软与成本通胀会压缩量价和利润率', metric: '同店、客流、价格/销量、库存和自由现金流', competitors: '品牌商、零售商、私牌和线上渠道', capital: '衡量新店、供应链和回购的回报率',
    }, [
      ['COST', 'Costco', '会员制零售', '会员续费', 'https://www.costco.com/', 'https://investor.costco.com/', '以低毛利商品和会员费构建高频家庭采购目的地；应把会员模式与商品销售的经济性分开阅读。', '高估值常把极高续费率前置定价；工资、国际扩张和客流变化仍值得拆分。'],
      ['WMT', 'Walmart', '全渠道零售', '低价与广告', 'https://corporate.walmart.com/', 'https://stock.walmart.com/', '依靠全球门店、供应链和数字渠道服务大众消费，同时发展广告、会员与第三方平台。', '低价定位带来份额，但劳动力、食品通胀和电商履约成本会侵蚀利润。'],
      ['KO', 'Coca-Cola', '全球饮料品牌', '品牌与分销', 'https://www.coca-colacompany.com/', 'https://investors.coca-colacompany.com/', '以浓缩液、装瓶伙伴和全球品牌组合服务非酒精饮料消费，资本密度相对较低。', '糖税、健康偏好、汇率和原材料成本会挑战价格与销量的平衡。'],
      ['PEP', 'PepsiCo', '饮料与零食平台', '渠道广度', 'https://www.pepsico.com/', 'https://investors.pepsico.com/', '通过饮料、零食和直送门店体系形成多品类货架位置与全球分销能力。', '健康化趋势、原料通胀与量价失衡会影响品牌组合的增长质量。'],
      ['PG', 'Procter & Gamble', '家庭与个人护理', '品牌组合', 'https://us.pg.com/', 'https://www.pginvestor.com/', '经营家庭、织物、个人护理和美容品牌，依赖重复购买、创新和渠道执行。', '私牌竞争、成本通胀和价格弹性需要用市场份额与销量而非收入单看。'],
      ['MCD', 'McDonald’s', '全球餐饮加盟网络', '加盟现金流', 'https://corporate.mcdonalds.com/', 'https://corporate.mcdonalds.com/corpmcd/investors.html', '通过加盟、直营门店、地产和数字化体系经营全球快餐网络，加盟商经济是核心。', '客流、特许经营关系、食品/工资成本与门店改造会影响现金流质量。'],
    ]),
  },
  {
    id: 'discretionary', code: '06', name: '可选消费与旅行', short: '可选消费', eyebrow: 'Experience economy', cycle: '收入弹性 · 品牌 · 周期',
    description: '可选消费是检验品牌、体验与周期敏感度的最好课堂：增长很快时，也要算清获客与库存。', lens: '追踪客流、客单、库存周转、单位门店经济、预订量和定价。', edge: '体验、品牌、位置、会员数据和供应链反应速度决定胜负。', growth: '优质品牌通过国际、数字化、服务附加和单位门店效率拉长增长期。', risk: '宏观、库存、折扣、获客成本与消费者偏好转移。', metric: '同店、客流、库存、预订量、单位门店回报、营销效率。', competitors: '品牌商、平台、线下连锁和新兴直销渠道之间争夺消费者预算。', capital: '开店、库存、内容/营销投入与回购会显著影响周期回报。',
    companies: compactCompanies({
      short: '可选消费', edge: '品牌、体验、位置与会员数据构成竞争优势', growth: '国际、数字化与单位经济改善是常见增量', risk: '需求回落、库存和折扣会快速放大经营杠杆', metric: '客流、客单、库存、预订、同店和自由现金流', competitors: '全球品牌、平台、区域连锁和新兴 DTC 品牌', capital: '通过新店、库存和回购的回报衡量资本纪律',
    }, [
      ['HD', 'Home Depot', '家居改善零售', '专业客户', 'https://corporate.homedepot.com/', 'https://ir.homedepot.com/', '以门店、专业客户服务和供应链覆盖 DIY 与承包商家居改善需求。', '住房交易疲软、大额项目延后和库存/专业客户需求的波动。'],
      ['BKNG', 'Booking Holdings', '在线旅游平台', '全球住宿供给', 'https://www.bookingholdings.com/', 'https://ir.bookingholdings.com/', '经营全球住宿平台，通过供给、流量和支付基础设施连接旅客与合作伙伴。', '旅行周期、搜索分发成本、短租竞争和监管将影响营销效率。'],
      ['SBUX', 'Starbucks', '咖啡连锁', '门店与会员', 'https://www.starbucks.com/', 'https://investor.starbucks.com/', '通过全球门店、授权和会员体系，把咖啡体验与数字化复购标准化。', '客流、劳动力、竞争和中国市场波动会影响门店经济。'],
      ['NKE', 'Nike', '运动品牌', '品牌重建', 'https://about.nike.com/', 'https://investors.nike.com/', '通过运动鞋服、品牌营销和全球批发/直销网络服务运动消费。', '库存、折扣、渠道冲突、竞争和中国需求决定品牌修复斜率。'],
      ['LULU', 'Lululemon', '高端运动服饰', '社群品牌', 'https://corporate.lululemon.com/', 'https://corporate.lululemon.com/investors', '以高端运动服饰、直营门店和社群连接建立全球化品牌。', '时尚变化、竞争、库存和北美成熟度需要通过全价销售验证。'],
      ['RCL', 'Royal Caribbean', '邮轮运营商', '高端旅行', 'https://www.royalcaribbeangroup.com/', 'https://www.royalcaribbeangroup.com/investor-relations', '经营邮轮品牌，通过票价、船上消费和目的地体验变现。', '宏观旅行、燃料、债务、地缘和公共卫生事件使其经营杠杆很高。'],
    ]),
  },
  {
    id: 'health', code: '07', name: '制药、医保与诊断', short: '健康经济', eyebrow: 'Health economy', cycle: '专利 · 报销 · 证据',
    description: '医疗资产要把专利、报销、临床证据、服务网络和政策风险放在同一张图里。', lens: '看管线、支付方压力、医疗量、监管、专利悬崖和制造供给。', edge: '临床证据、专利、医生网络、报销关系和复杂运营流程构成壁垒。', growth: '新适应症、管线兑现、老龄化和医疗服务需求带来增长。', risk: '药价、专利到期、临床失败、利用率波动和监管审查。', metric: '核心产品增长、处方/量、报销覆盖、医疗利用率、管线里程碑。', competitors: '创新药、仿制药、支付方、器械和服务网络之间存在复杂博弈。', capital: '并购、临床投入、制造扩产和回购必须与专利周期一起评估。',
    companies: compactCompanies({
      short: '健康经济', edge: '临床证据、专利、报销和服务网络形成高门槛', growth: '扩大适应症、提高供给和推进管线决定增量', risk: '政策、专利、临床和医疗利用率变化可能重估资产', metric: '产品/处方、报销、管线、医疗量和现金流', competitors: '创新药、器械、支付方和医疗服务网络', capital: '以研发、并购、制造扩张和回购的组合衡量资本配置',
    }, [
      ['LLY', 'Eli Lilly', '创新制药', '代谢疾病平台', 'https://www.lilly.com/', 'https://investor.lilly.com/', '围绕糖尿病、肥胖、免疫与神经科学布局重磅产品与临床管线。', '供给、报销、竞争药物和药价政策可能改变利润路径。'],
      ['NVO', 'Novo Nordisk', '代谢疾病制药', 'GLP-1', 'https://www.novonordisk.com/', 'https://www.novonordisk.com/investors.html', '以糖尿病和肥胖治疗为核心，重点看全球产能、临床数据与支付覆盖。', '竞争加剧、产能、价格与患者持续用药率会影响增长持续性。'],
      ['UNH', 'UnitedHealth', '医保与医疗服务', '支付方 / 服务整合', 'https://www.unitedhealthgroup.com/', 'https://www.unitedhealthgroup.com/investors.html', '结合保险、药房服务、数据和医疗服务网络，是美国支付体系的重要节点。', '医疗利用率、监管审查和费率压力会显著影响短期利润。'],
      ['JNJ', 'Johnson & Johnson', '医药与医疗器械', '多元化医疗', 'https://www.jnj.com/', 'https://www.investor.jnj.com/', '依托创新药和医疗器械的组合，提供相对均衡的医疗健康现金流。', '专利到期、诉讼、产品组合调整和药价政策。'],
      ['ABBV', 'AbbVie', '生物制药', '免疫与肿瘤', 'https://www.abbvie.com/', 'https://investors.abbvie.com/', '通过免疫、肿瘤、神经科学与美学业务组合管理专利周期后的增长。', '核心产品专利到期、新产品爬坡和并购整合会决定增长质量。'],
      ['MRK', 'Merck', '创新制药', '肿瘤平台', 'https://www.merck.com/', 'https://investors.merck.com/', '以肿瘤、疫苗和动物保健构建业务组合，重点关注产品集中度和管线。', '重磅产品的专利与替代风险、管线兑现和并购执行。'],
    ]),
  },
  {
    id: 'medtech', code: '08', name: '医疗器械与生命科学工具', short: '生命科学', eyebrow: 'Science infrastructure', cycle: '耗材 · 装机 · 科研周期',
    description: '工具公司要看装机、耗材、服务和客户预算；器械公司要看临床证据、医生网络和手术量。', lens: '追踪装机、耗材、订单、实验室/医院预算、服务收入和手术量。', edge: '认证、临床数据、安装基础、耗材闭环和全球服务网络形成壁垒。', growth: '手术量、科研复苏、生物工艺与诊断升级扩展经常性收入。', risk: '医院资本预算、科研去库存、产品审批、客户集中和并购整合。', metric: '装机、耗材/服务、订单、手术量、生物工艺订单、利润率。', competitors: '全球器械、科研工具、诊断和外包生产平台相互竞争。', capital: '通过研发、服务网络和并购整合来判断长期 ROIC。',
    companies: compactCompanies({
      short: '生命科学', edge: '安装基础、临床/质量认证与耗材服务闭环形成护城河', growth: '手术量、科研复苏和高价值耗材可带来增量', risk: '医院/科研预算与去库存会影响订单质量', metric: '装机、耗材、服务、订单、手术量和利润率', competitors: '大型器械、实验室工具和专业创新公司', capital: '评估并购、研发和服务网络能否强化经常性收入',
    }, [
      ['ISRG', 'Intuitive Surgical', '手术机器人', '装机与耗材', 'https://www.intuitive.com/', 'https://isrg.gcs-web.com/', '通过达芬奇系统、耗材和培训服务微创外科医生与医院。', '医院资本预算、竞争平台、审批和手术量节奏。'],
      ['TMO', 'Thermo Fisher', '科研工具平台', '实验室基础设施', 'https://www.thermofisher.com/', 'https://ir.thermofisher.com/', '为制药、诊断和科研客户提供仪器、耗材、服务与生产解决方案。', '客户去库存、政府科研预算和并购整合影响短期需求。'],
      ['DHR', 'Danaher', '生命科学平台', '诊断 / 生物工艺', 'https://www.danaher.com/', 'https://investors.danaher.com/', '通过生命科学、诊断和生物工艺平台服务药物发现、临床与生产。', '生物工艺订单、客户资本预算与组合调整。'],
      ['ABT', 'Abbott Laboratories', '诊断与医疗器械', '多元产品组合', 'https://www.abbott.com/', 'https://www.abbottinvestor.com/', '经营诊断、糖尿病护理、心血管和营养产品，组合多元化明显。', '产品质量、报销、竞争和不同业务周期错位。'],
      ['BSX', 'Boston Scientific', '介入医疗器械', '临床渗透', 'https://www.bostonscientific.com/', 'https://investors.bostonscientific.com/', '聚焦心血管、内窥和介入器械，依靠临床创新与医生采用扩大市场。', '审批、竞争技术、医院预算和产品组合执行。'],
      ['SYK', 'Stryker', '骨科与外科器械', '医院流程', 'https://www.stryker.com/', 'https://investor.stryker.com/', '提供骨科、手术、神经和医院解决方案，服务网络和产品广度是关键。', '手术量、医院采购、整合和产品责任风险。'],
    ]),
  },
  {
    id: 'energy', code: '09', name: '能源、电力与公用事业', short: '能源电力', eyebrow: 'Physical supply', cycle: '商品 · 许可 · 资本开支',
    description: '能源转型不等于传统供给消失。资源、稳定电力、输配网络和服务能力都是稀缺瓶颈。', lens: '关注商品价格、产量、储量、合同、发电量、项目许可、CapEx 与股东回报。', edge: '低成本资源、长期合同、稀缺资产、运营许可和项目执行构成核心优势。', growth: '电力缺口、LNG、低成本资源、核电与能源服务投资带来新的增量。', risk: '商品价格、政策、地缘、项目延误、资本开支失控和安全事故。', metric: '产量、单位成本、储量替代、实现价格、合同量、发电量、CapEx/FCF。', competitors: '综合能源、独立生产商、LNG、电力与可再生能源公司争夺资本。', capital: '优先看是否在高价周期保持资本纪律，并把回购/分红与去杠杆一起读。',
    companies: compactCompanies({
      short: '能源电力', edge: '资源成本、长期合同、运营许可和项目执行能力形成门槛', growth: '电力缺口、低成本资源、LNG 与能源服务带来增量', risk: '商品、政策、地缘、项目和资本开支造成高波动', metric: '产量、单位成本、合同、发电量、CapEx 与 FCF', competitors: '能源生产商、电力公司、LNG 和服务供应商', capital: '在周期顶点的 CapEx 与股东回报最能检验纪律',
    }, [
      ['XOM', 'Exxon Mobil', '综合能源', '低成本资源', 'https://corporate.exxonmobil.com/', 'https://corporate.exxonmobil.com/investors', '覆盖上游油气、炼化、化工与低碳项目，以大型资源和项目组合驱动现金流。', '油气价格、政策、项目执行和大型整合后的协同兑现。'],
      ['CVX', 'Chevron', '综合能源', '上游组合', 'https://www.chevron.com/', 'https://investors.chevron.com/', '以油气上游、LNG、炼化和化工构成综合能源资产组合。', '油价、资源交易不确定性、资产减值和项目延期。'],
      ['SLB', 'SLB', '油服技术平台', '国际油服', 'https://www.slb.com/', 'https://investors.slb.com/', '为能源客户提供钻完井、地球物理、生产和数字化技术服务。', '上游 CapEx 周期、客户集中、地缘和服务定价。'],
      ['EOG', 'EOG Resources', '独立油气生产商', '低成本页岩', 'https://www.eogresources.com/', 'https://investors.eogresources.com/', '依靠美国低成本资源与运营效率，在页岩生产中追求高回报而非单纯产量。', '油气价格、储量质量、服务成本和资本纪律。'],
      ['LNG', 'Cheniere Energy', 'LNG 出口商', '长期合同', 'https://www.cheniere.com/', 'https://ir.cheniere.com/', '经营 LNG 液化与出口基础设施，结合长期合同和全球天然气套利。', '全球气价、合同结构、项目执行、监管许可和债务。'],
      ['CEG', 'Constellation Energy', '核电与零碳电力', '稳定电力', 'https://www.constellationenergy.com/', 'https://investors.constellationenergy.com/', '经营大型核电资产和零碳发电组合，为高负荷客户提供稳定电力。', '电价、核电运营、政策许可和长期合同结构。'],
    ]),
  },
  {
    id: 'industrial', code: '10', name: '工业、电网与基础设施', short: '工业资本品', eyebrow: 'Rebuild the physical world', cycle: '订单积压 · 设备周期',
    description: '电网、设备、自动化、建设和维护能力常是宏观叙事中被低估的瓶颈。', lens: '看订单积压、价格/成本传导、项目延期、售后收入、资本回报与监管许可。', edge: '认证、经销服务网络、安装基础、项目执行和长期维护合同创造高门槛。', growth: '电网、数据中心、再工业化、自动化和公共投资支撑多年的设备需求。', risk: '订单取消、项目延期、库存、价格回落、供应链和周期下行。', metric: '订单、积压、Book-to-bill、价格/成本、服务收入、ROIC、FCF。', competitors: '全球设备商、区域工程商、专业零部件商和公用事业供应链。', capital: '用增量 ROIC、产能投资和并购整合检验是否真正创造价值。',
    companies: compactCompanies({
      short: '工业资本品', edge: '认证、服务网络、安装基础和项目执行提供稀缺能力', growth: '电网、数据中心、自动化和再工业化拉动订单', risk: '周期、项目延期、库存和供应链可快速改变利润率', metric: '订单、积压、价格/成本、服务、ROIC 和 FCF', competitors: '全球 OEM、工程承包商和专业设备供应商', capital: '判断产能、收购和回购是否在高景气中保持回报纪律',
    }, [
      ['CAT', 'Caterpillar', '工程与采矿设备', '设备与售后', 'https://www.caterpillar.com/', 'https://investors.caterpillar.com/', '销售工程、采矿与能源设备，并以零件、服务和经销网络获得持续收入。', '建筑与资源周期、经销商库存、终端融资环境。'],
      ['ETN', 'Eaton', '电气化设备', '电网瓶颈', 'https://www.eaton.com/', 'https://investor.eaton.com/', '提供配电、控制、保护与电气化方案，是数据中心和电网升级的重要供应商。', '项目延期、价格回落、供给瓶颈与高估值。'],
      ['GEV', 'GE Vernova', '发电与电网设备', '电力供给', 'https://www.gevernova.com/', 'https://investor.gevernova.com/', '聚焦燃气发电、风电和电网技术，服务不断增长的全球电力需求。', '项目执行、风电波动、供应链和独立运营验证。'],
      ['HON', 'Honeywell', '自动化与航空工业', '组合重塑', 'https://www.honeywell.com/', 'https://investor.honeywell.com/', '经营自动化、航空航天、能源转型和工业软件等关键技术业务。', '业务拆分、周期差异和并购/组合调整的执行。'],
      ['DE', 'Deere', '农业与工程设备', '精准农业', 'https://www.deere.com/', 'https://investor.deere.com/', '提供农业、建筑设备与数字化精准农业解决方案，客户收入周期影响显著。', '农产品价格、农户收入、经销商库存和信贷。'],
      ['WM', 'Waste Management', '环境服务基础设施', '路线密度', 'https://www.wm.com/', 'https://investors.wm.com/', '通过收运、填埋、回收和可再生天然气资产服务城市与商业客户。', '价格监管、劳动力、处置容量、收购整合和项目执行。'],
    ]),
  },
  {
    id: 'cyber', code: '11', name: '网络安全', short: '安全软件', eyebrow: 'Resilience layer', cycle: '安全预算 · 平台整合',
    description: '安全不是单一产品，而是企业不愿削减的韧性预算。平台化、可信度和数据规模决定赢家。', lens: '看平台采用、模块扩张、续费、账单、威胁响应、客户集中和销售效率。', edge: '威胁遥测数据、产品集成、客户信任、渠道和高切换成本是主要壁垒。', growth: '云安全、身份安全、AI 安全运营和工具整合扩大每客户钱包份额。', risk: '服务稳定性、竞争、平台替代、预算延后和高估值。', metric: 'ARR、RPO、净留存、模块采用、账单、FCF、销售效率。', competitors: '平台供应商、云厂商、身份管理、端点和开源安全工具。', capital: '重点读研发、销售投入和收购是否真正提高平台黏性。',
    companies: compactCompanies({
      short: '安全软件', edge: '安全遥测、客户信任、平台集成和渠道构成复合壁垒', growth: '身份、云安全、AI 安全运营和平台替代带来增量', risk: '事件、竞争、预算收紧和估值都会迅速改变叙事', metric: 'ARR、RPO、留存、模块、账单、FCF 和销售效率', competitors: '端点、网络、云、身份和平台型安全供应商', capital: '核验研发/销售投入是否形成可持续净留存和 FCF',
    }, [
      ['PANW', 'Palo Alto Networks', '安全平台', '平台化整合', 'https://www.paloaltonetworks.com/', 'https://investors.paloaltonetworks.com/', '覆盖网络、云和安全运营，是企业安全预算向平台整合的重要受益者。', '账单节奏、竞争和产品捆绑会影响短期增长口径。'],
      ['CRWD', 'CrowdStrike', '终端与云安全', '安全数据云', 'https://www.crowdstrike.com/', 'https://ir.crowdstrike.com/', '以云原生平台保护终端、身份和云工作负载，依赖订阅与模块扩张。', '服务稳定性、信任事件、竞争和高估值。'],
      ['FTNT', 'Fortinet', '网络安全设备与订阅', '安全网络', 'https://www.fortinet.com/', 'https://investor.fortinet.com/', '通过防火墙、专用芯片和订阅服务服务网络安全需求。', '硬件周期、渠道库存、订阅转化和平台竞争。'],
      ['ZS', 'Zscaler', '零信任安全', '云代理', 'https://www.zscaler.com/', 'https://ir.zscaler.com/', '提供云交付的零信任网络与数据保护服务，受益于网络架构云化。', '大客户销售周期、平台竞争、账单波动和估值。'],
      ['NET', 'Cloudflare', '边缘网络与安全', '边缘平台', 'https://www.cloudflare.com/', 'https://cloudflare.net/', '将 CDN、网络安全、开发者平台和边缘计算融合为全球网络服务。', '企业大单转化、竞争、基础设施投入和产品线复杂度。'],
      ['OKTA', 'Okta', '身份安全', '身份层', 'https://www.okta.com/', 'https://investor.okta.com/', '提供员工和客户身份管理，是企业访问控制的重要层。', '服务可靠性、竞争、销售执行与大客户续费。'],
    ]),
  },
  {
    id: 'defense', code: '12', name: '航空航天与国防', short: '国防航空', eyebrow: 'Strategic systems', cycle: '预算 · 积压订单 · 执行',
    description: '国防资产的核心不是季度增速，而是项目资质、积压订单、预算周期和长期执行能力。', lens: '看订单积压、项目利润、固定价格合同、供应链、交付里程碑和现金回收。', edge: '安全许可、复杂工程、长期客户关系和认证周期构成高门槛。', growth: '战略现代化、太空、导弹防御、商用航空售后和盟国采购是主要驱动。', risk: '项目成本超支、预算政治、供应链、质量问题和出口限制。', metric: 'Backlog、Book-to-bill、项目利润率、现金流、交付和准备金。', competitors: '少数主承包商、发动机/航电供应商和新型太空公司争夺预算。', capital: '检验收购、研发和回购是否不牺牲项目执行和资产负债表。',
    companies: compactCompanies({
      short: '国防航空', edge: '项目资质、安全许可、工程与长期合同关系构成护城河', growth: '战略、太空、防空、盟国需求和售后支持订单', risk: '成本超支、预算、供应链与质量风险决定短期现金流', metric: '积压、订单、项目利润、交付和自由现金流', competitors: '主承包商、发动机、航电和新太空供应商', capital: '以项目投入、并购与回购是否保障执行来判断资本质量',
    }, [
      ['LMT', 'Lockheed Martin', '高端国防主承包商', '航空与导弹', 'https://www.lockheedmartin.com/', 'https://investors.lockheedmartin.com/', '为美国及盟友提供航空、导弹、太空和国防系统，是高端项目的重要主承包商。', '项目执行、固定价格合同、预算政治与供应链。'],
      ['RTX', 'RTX', '航空航天与国防', '发动机 / 防空', 'https://www.rtx.com/', 'https://investors.rtx.com/', '覆盖商用航空发动机、航空电子和导弹防御，兼具民航与国防周期。', '发动机质量、供应链、固定价格项目和现金流修复。'],
      ['NOC', 'Northrop Grumman', '战略国防与太空', '高门槛项目', 'https://www.northropgrumman.com/', 'https://investor.northropgrumman.com/', '在战略威慑、太空、无人系统和先进航空领域承担多项高门槛项目。', '项目成本、预算优先级与供应链。'],
      ['GD', 'General Dynamics', '国防与公务航空', '潜艇 / 航空', 'https://www.gd.com/', 'https://investorrelations.gd.com/', '经营潜艇、地面系统、航空航天和 IT 服务，拥有多条长期国防收入线。', '潜艇产能、项目执行、公务航空周期与劳动力。'],
      ['LHX', 'L3Harris', '国防电子', '传感与通信', 'https://www.l3harris.com/', 'https://investor.l3harris.com/', '提供通信、传感、电子战和太空任务系统，产品嵌入战略平台。', '项目执行、并购协同、预算和供应链。'],
      ['HII', 'Huntington Ingalls', '军舰建造', '造船产能', 'https://hii.com/', 'https://ir.hii.com/', '聚焦美国海军舰艇与核动力航母建造，产能和人才是关键稀缺资源。', '劳动力、供应链、固定价格合同和长期项目进度。'],
    ]),
  },
  {
    id: 'realestate', code: '13', name: '房地产、住房与数据中心', short: '实物资产', eyebrow: 'Land · rent · connectivity', cycle: '利率 · 租金 · 供给',
    description: '房地产要把资产质量、租约、融资结构、开发管线和利率敏感度拆开，而不是只看股息率。', lens: '观察 NOI、入住率、租金续约、供给、债务期限、利息覆盖与开发回报。', edge: '优质位置、网络效应、长期租约、许可和规模化运营形成差异。', growth: '数据中心、物流、住房短缺和数字基础设施是主要结构性驱动。', risk: '利率、再融资、供给过剩、租户集中和地产周期。', metric: 'NOI、入住率、租金增长、FFO、债务期限、利息覆盖、开发回报。', competitors: 'REIT、私募地产、开发商和基础设施基金争夺优质资产。', capital: '融资、出售、开发、分红和回购的顺序决定每股净资产增长。',
    companies: compactCompanies({
      short: '实物资产', edge: '位置、租约、网络密度、许可和融资能力形成护城河', growth: '数字基础设施、物流和住房短缺支持租金与开发', risk: '利率、供给、再融资和资产估值波动', metric: 'NOI、入住率、租金、FFO、债务与利息覆盖', competitors: 'REIT、私募地产、开发商和基础设施基金', capital: '以开发回报、融资与资产处置的纪律衡量资本配置',
    }, [
      ['PLD', 'Prologis', '物流地产 REIT', '仓储网络', 'https://www.prologis.com/', 'https://ir.prologis.com/', '拥有全球物流仓储网络，受益于电商、供应链重构和土地稀缺。', '利率、供给、租户需求、开发成本和地产估值。'],
      ['EQIX', 'Equinix', '数据中心 REIT', '互联生态', 'https://www.equinix.com/', 'https://investor.equinix.com/', '经营中立数据中心与互联生态，客户网络密度使资产价值不只来自机柜。', 'CapEx、用电、项目交付、竞争和融资成本。'],
      ['AMT', 'American Tower', '通信塔 REIT', '无线基础设施', 'https://www.americantower.com/', 'https://www.americantower.com/us/investors', '通过通信塔与长期租约服务移动网络运营商，租金增长和共址是关键。', '利率、客户集中、国际汇率和运营商 CapEx。'],
      ['DHI', 'D.R. Horton', '住宅开发商', '入门级住房', 'https://www.drhorton.com/', 'https://investor.drhorton.com/', '以全国化土地、建设和金融服务能力提供多层次住房产品。', '按揭利率、土地成本、库存和住房需求周期。'],
      ['LEN', 'Lennar', '住宅开发商', '土地与现金流', 'https://www.lennar.com/', 'https://investors.lennar.com/', '经营住宅开发、金融与土地策略，在住房供给不足中拥有规模优势。', '利率、土地存货、建设成本和促销压力。'],
      ['CBRE', 'CBRE Group', '商业地产服务', '交易与管理', 'https://www.cbre.com/', 'https://ir.cbre.com/', '提供商业地产交易、租赁、项目管理和投资管理服务，较轻资产。', '交易周期、商业地产融资、招聘与整合执行。'],
    ]),
  },
  {
    id: 'materials', code: '14', name: '材料、化工与资源', short: '资源材料', eyebrow: 'Molecules and minerals', cycle: '价格 · 产能 · 资源品',
    description: '材料公司既有强周期性，也有少数技术、配方、客户认证和资源禀赋带来的超额回报。', lens: '看实现价格、成本曲线、产能、库存、合同、资源储量、ROIC 和 FCF。', edge: '低成本资源、专利配方、认证、特种材料技术和全球供应链构成壁垒。', growth: '电气化、数据中心、国防、建筑翻新和资源品周期提供增长机会。', risk: '商品价格、产能过剩、能源成本、政策、矿山/项目执行和环境责任。', metric: '实现价格、单位成本、产能利用率、库存、产量、ROIC、FCF。', competitors: '全球资源、化工、涂料和特种材料巨头之间的成本与技术竞争。', capital: '周期高点时的扩产、收购与回购最值得反证。',
    companies: compactCompanies({
      short: '资源材料', edge: '资源成本、配方技术、认证和全球供应链构成长期门槛', growth: '电气化、基建、数据中心和特种材料升级增加需求', risk: '商品、产能、能源、政策和项目风险引发高波动', metric: '价格、成本、利用率、产量、库存、ROIC 与 FCF', competitors: '资源、化工、涂料和特种材料全球竞争者', capital: '核验周期高位扩产、并购和回购是否毁损回报',
    }, [
      ['LIN', 'Linde', '工业气体', '现场供气合同', 'https://www.linde.com/', 'https://investors.linde.com/', '提供工业气体、工程和现场供气服务，长期合同和客户嵌入是核心。', '能源成本、项目执行、客户工业产能和估值。'],
      ['FCX', 'Freeport-McMoRan', '铜矿生产商', '铜资源', 'https://www.fcx.com/', 'https://investors.fcx.com/', '经营大型铜矿，铜价和资源品位决定现金流弹性。', '铜价、矿山运营、地缘、成本和资本开支。'],
      ['NEM', 'Newmont', '黄金矿业', '金矿资源', 'https://www.newmont.com/', 'https://investors.newmont.com/', '经营全球金矿资产，价值来自储量、产量、成本和金价的组合。', '金价、矿山执行、整合、成本通胀和地缘。'],
      ['SHW', 'Sherwin-Williams', '涂料与涂层', '配方与渠道', 'https://www.sherwin-williams.com/', 'https://investors.sherwin-williams.com/', '通过专业涂料、零售渠道和配方技术服务建筑与工业客户。', '住宅周期、原料成本、渠道竞争与收购整合。'],
      ['ECL', 'Ecolab', '水、卫生与服务', '服务密度', 'https://www.ecolab.com/', 'https://investor.ecolab.com/', '为酒店、食品、医疗和工业客户提供水、卫生和流程优化服务。', '客户量、成本通胀、服务执行和国际经济活动。'],
      ['APD', 'Air Products', '工业气体与氢能', '大型项目', 'https://www.airproducts.com/', 'https://investors.airproducts.com/', '依托大型现场供气项目与工业气体网络，同时布局低碳氢能。', '大型项目资本开支、氢能需求、执行和融资。'],
    ]),
  },
  {
    id: 'mobility', code: '15', name: '交通、汽车与物流', short: '移动网络', eyebrow: 'Move people and goods', cycle: '运量 · 定价 · 资本强度',
    description: '运输和汽车资产最能展示规模、网络密度、运营纪律与周期的相互作用。', lens: '关注运量、收益率、单位成本、产能、库存、资本开支、燃料和负债。', edge: '网络密度、基础设施位置、品牌、供应链和监管许可决定长期优势。', growth: '电动化、自动化、供应链重构、替换周期和高价值货运支持增量。', risk: '经济周期、燃料、劳动力、价格战、库存、资本强度和监管。', metric: '运量、收益率、单位成本、库存、交付、CapEx、FCF、杠杆。', competitors: '航空、铁路、卡车、汽车和物流平台持续争夺运量与定价权。', capital: '重资产行业必须优先看维护 CapEx 后的真实 FCF 与资产负债表。',
    companies: compactCompanies({
      short: '移动网络', edge: '网络密度、基础设施、品牌和运营体系带来难以复制的效率', growth: '电动化、自动化、替换需求和供应链重构提供增量', risk: '周期、燃料、劳动力、库存、价格战和高资本强度', metric: '运量、收益率、成本、库存、交付、CapEx、FCF 与杠杆', competitors: '汽车、铁路、航空、卡车和物流网络', capital: '以维护 CapEx 后 FCF 和杠杆管理判断资本质量',
    }, [
      ['TSLA', 'Tesla', '电动车与能源平台', '规模与软件', 'https://www.tesla.com/', 'https://ir.tesla.com/', '生产电动车、储能和充电基础设施，同时探索软件与自动驾驶价值。', '需求、价格、产品周期、竞争、监管和高估值。'],
      ['F', 'Ford', '汽车制造商', '皮卡与商用车', 'https://corporate.ford.com/', 'https://shareholder.ford.com/', '经营燃油车、电动车、商用车和金融服务，商用车盈利是重要支柱。', '价格战、质量、劳动力、EV 投入和周期性库存。'],
      ['GM', 'General Motors', '汽车与金融服务', '北美盈利', 'https://www.gm.com/', 'https://investor.gm.com/', '通过北美皮卡/SUV、国际业务和金融服务构成汽车现金流组合。', '需求、价格、劳资、EV 执行、Cruise 与资本回报。'],
      ['UNP', 'Union Pacific', '北美铁路', '网络效率', 'https://www.up.com/', 'https://investor.unionpacific.com/', '经营美国西部货运铁路网络，资产位置和运营效率决定长期回报。', '运量、服务、劳动力、监管和资本开支。'],
      ['ODFL', 'Old Dominion Freight Line', '零担货运', '服务质量', 'https://www.odfl.com/', 'https://ir.odfl.com/', '以高服务质量和区域网络运营零担货运，重视密度与定价纪律。', '工业货运周期、竞争、产能投资和收益率。'],
      ['DAL', 'Delta Air Lines', '航空公司', '网络与高端客群', 'https://www.delta.com/', 'https://ir.delta.com/', '通过枢纽网络、品牌、忠诚度计划和合作伙伴服务全球航空需求。', '经济周期、燃料、劳动力、运力、地缘和资产负债表。'],
    ]),
  },
]

function chinaCompanies(sector, records) {
  return rows(sector, compactCompanies(sector, records).map((company) => ({
    ...company,
    market: 'cn',
    financeSymbol: company.ticker,
  })))
}

const chinaDefinitions = [
  {
    id: 'semis', code: '01', name: 'AI 与半导体', short: '算力链', eyebrow: 'Compute & localization', cycle: '国产替代 · 高投入',
    description: '从晶圆制造、设备与设计到算力基础设施。研究要把政策催化、客户验证与真实盈利能力拆开看。',
    lens: '追踪先进制程能力、设备验证、国产供应链渗透、服务器出货与资本开支兑现。', competitors: '同时比较海外技术边界、国内客户认证速度、产品迭代与供应链稳定性。', capital: '研发、扩产与补贴会显著影响现金流；必须辨别战略投入与可持续回报。', edge: '工艺积累、客户导入、供应链协同和工程人才形成复合壁垒。', metric: '产能利用率、设备验收、客户认证、毛利率、研发强度与经营现金流。',
    companies: [],
    chinaRecords: [
      ['688981', '中芯国际', '晶圆代工平台', '成熟制程与先进节点爬坡', 'https://www.smics.com/', 'https://www.smics.com/en/site/company_financialSummary', '经营晶圆代工，为通信、消费电子、工业与部分高性能计算客户提供制造能力。', '供需周期、技术追赶、资本开支、地缘与客户结构。', '制造能力'],
      ['002371', '北方华创', '半导体设备商', '设备平台化与验证', 'https://www.naura.com/', 'https://www.naura.com/', '提供刻蚀、薄膜沉积、清洗等关键设备，受益于本土晶圆厂扩产和设备替代。', '客户扩产节奏、验收确认、技术迭代与应收账款。', '设备验证'],
      ['688041', '海光信息', '服务器芯片设计商', 'CPU / 加速器导入', 'https://www.hygon.cn/', 'https://www.hygon.cn/', '设计面向数据中心的处理器和加速计算产品，依赖生态兼容与重点客户导入。', '产品竞争、生态、供应链与客户集中。', '算力国产化'],
      ['688256', '寒武纪', 'AI 芯片设计商', '训练与推理生态', 'https://www.cambricon.com/', 'https://www.cambricon.com/', '开发云端智能芯片与软件平台，投资逻辑高度取决于真实部署和软件适配。', '商业化兑现、研发投入、竞争与估值波动。', '高弹性'],
      ['603986', '兆易创新', '存储与 MCU 设计商', '产品组合升级', 'https://www.gigadevice.com/', 'https://investor.gigadevice.com/', '提供 NOR Flash、MCU 与传感器等产品，受益于嵌入式需求与产品升级。', '库存周期、价格竞争、下游需求与供应链。', '周期复苏'],
      ['603501', '韦尔股份', '图像传感器平台', '高端 CIS 渗透', 'https://www.willsemi.com/', 'https://www.willsemi.com/', '通过图像传感器与半导体分销业务服务手机、汽车和安防等应用。', '手机周期、客户集中、价格与技术路线变化。', '汽车电子'],
    ],
  },
  {
    id: 'cloud', code: '02', name: '云与企业软件', short: '数字化', eyebrow: 'Enterprise digitization', cycle: '云化 · AI 重构',
    description: '中国企业软件仍在从项目制走向订阅、云服务和智能化工作流，关键是客户付费意愿与交付效率。',
    lens: '观察云收入、订阅留存、政企预算、AI 产品付费与销售费用效率。', competitors: '比较客户关系、行业 know-how、平台生态、私有化部署和交付能力。', capital: '研发投入与销售扩张需要被经营现金流和回款质量约束。', edge: '行业场景积累、数据连接能力、服务网络和高切换成本决定护城河。', metric: '云订阅占比、合同负债、续费率、回款、毛利率与经营现金流。',
    companies: [],
    chinaRecords: [
      ['9988', '阿里巴巴', '云与综合平台', '阿里云与 AI 服务', 'https://www.alibabagroup.com/', 'https://www.alibabagroup.com/en-US/ir-home', '以电商、云计算、本地生活与国际商业构成平台组合，云是企业数字化的重要入口。', '消费竞争、云价格、组织执行、监管与资本配置。', '平台转型'],
      ['0700', '腾讯控股', '企业服务与互联网平台', '企业微信与云生态', 'https://www.tencent.com/', 'https://www.tencent.com/en-us/investors.html', '依托微信生态、游戏、广告和金融科技，向企业服务、云和 AI 工具延展。', '监管、内容周期、广告竞争与新业务变现。', '现金流核心'],
      ['3888', '金山软件', '办公与云软件', 'WPS AI 与云服务', 'https://www.kingsoft.com/', 'https://www.kingsoft.com/en/ir/', '通过 WPS 办公软件、云服务与游戏业务服务个人和企业用户。', '订阅转化、云投入、游戏波动与竞争。', '订阅升级'],
      ['0268', '金蝶国际', '企业管理软件', 'SaaS 转型', 'https://www.kingdee.com/', 'https://investor.kingdee.com/', '提供 ERP、财务与企业管理云服务，核心命题是从传统项目向高质量订阅转型。', '回款、亏损收窄、销售效率与客户预算。', '经营杠杆'],
      ['002230', '科大讯飞', '智能语音与 AI 平台', '行业模型商业化', 'https://www.iflytek.com/', 'https://www.iflytek.com/', '通过语音、教育、办公和行业解决方案推进人工智能在具体场景的落地。', '产品付费、竞争、投入强度与应收账款。', 'AI 应用'],
      ['300454', '深信服', '云计算与安全软件', '安全云与 SASE', 'https://www.sangfor.com/', 'https://www.sangfor.com/', '提供网络安全、云计算和基础架构软件，客户以政企和中大型组织为主。', '政企预算、回款、竞争和项目交付。', '政企 IT'],
    ],
  },
  {
    id: 'digital', code: '03', name: '互联网平台与媒体', short: '流量平台', eyebrow: 'Traffic & transactions', cycle: '网络效应 · 监管常态化',
    description: '电商、即时零售、内容与线上娱乐共同争夺用户时间和交易入口；要研究变现深度而非只看 GMV。',
    lens: '跟踪用户、商家供给、履约效率、广告加载率、客单价、补贴与监管变化。', competitors: '比较流量成本、算法分发、供给质量、履约网络和用户心智。', capital: '补贴、内容投入、回购和海外扩张改变每股价值的速度。', edge: '网络效应、支付/物流基础设施和商家生态形成长期优势。', metric: '活跃用户、订单频次、take rate、广告收入、履约利润与自由现金流。',
    companies: [],
    chinaRecords: [
      ['3690', '美团', '本地生活平台', '即时零售与到店供给', 'https://about.meituan.com/', 'https://about.meituan.com/en/investor-relations', '以外卖、到店酒旅、即时零售和团购连接本地商户与消费者。', '竞争补贴、配送成本、监管与新业务亏损。', '高频入口'],
      ['9618', '京东集团', '供应链电商平台', '零售利润与物流协同', 'https://corporate.jd.com/', 'https://ir.jd.com/', '以自营零售、开放平台与物流网络服务品牌商和消费者，强调履约体验。', '消费需求、价格竞争、物流成本和业务结构。', '供应链能力'],
      ['PDD', '拼多多', '性价比电商平台', '商家效率与海外扩张', 'https://www.pddholdings.com/', 'https://investor.pddholdings.com/', '以低价供给和平台流量匹配驱动电商交易，并通过海外业务扩大边界。', '竞争、商家生态、海外监管与高基数增长。', '高增长'],
      ['9999', '网易', '游戏与内容公司', '长线产品与 IP', 'https://www.netease.com/', 'https://ir.netease.com/', '核心是游戏研发与运营，同时经营音乐、教育相关与创新业务。', '产品周期、版号、竞争、海外发行与内容投入。', '内容现金流'],
      ['1024', '快手', '短视频与直播平台', '广告与电商变现', 'https://www.kuaishou.com/', 'https://ir.kuaishou.com/', '通过短视频、直播、电商和广告连接创作者、商家与用户。', '流量竞争、内容治理、变现效率与获客成本。', '注意力变现'],
      ['9626', '哔哩哔哩', '年轻内容社区', '广告、游戏与会员', 'https://www.bilibili.com/', 'https://ir.bilibili.com/', '以社区内容、游戏、广告和增值服务覆盖年轻用户与创作者生态。', '用户增长、内容成本、商业化进度与竞争。', '社区生态'],
    ],
  },
  {
    id: 'finance', code: '04', name: '金融与资本市场', short: '金融资产', eyebrow: 'Balance sheet & flows', cycle: '利率 · 信用 · 资本回报',
    description: '银行、保险、券商与交易所的价值来自不同的资产负债表与客户信任，不能用单一估值框架。',
    lens: '读净息差、资产质量、保费结构、成交活跃度、资本充足率与分红能力。', competitors: '比较负债成本、财富管理能力、风控文化、牌照与渠道。', capital: '资本充足率、拨备、分红与再投资是金融股的核心语言。', edge: '低成本负债、品牌信任、牌照、数据和客户关系构成防线。', metric: '净息差、不良率、拨备覆盖、ROE、AUM、成交额与资本充足率。',
    companies: [],
    chinaRecords: [
      ['601398', '工商银行', '大型商业银行', '低成本负债与对公客户', 'https://www.icbc.com.cn/', 'https://www.icbc.com.cn/ICBC/Investor%20Relations/', '经营公司与零售银行、金融市场和海外业务，是观察中国信贷周期的核心样本。', '净息差、资产质量、房地产敞口与资本约束。', '高股息'],
      ['600036', '招商银行', '零售银行', '财富管理与零售客户', 'https://www.cmbchina.com/', 'https://ir.cmbchina.com/', '以零售金融、财富管理和优质客户基础建立差异化银行模式。', '息差、财富管理波动、零售风险与资产质量。', '零售优势'],
      ['601318', '中国平安', '综合金融与保险', '寿险价值与医疗生态', 'https://group.pingan.com/', 'https://group.pingan.com/ir/', '经营寿险、财险、银行与资产管理，内含价值和新业务价值是主要观察轴。', '权益市场、利率、代理人转型、投资收益与地产风险。', '价值修复'],
      ['300059', '东方财富', '互联网券商平台', '流量转化与基金代销', 'https://www.eastmoney.com/', 'https://corp.eastmoney.com/', '通过财经流量、证券经纪、两融和基金代销参与资本市场活跃度。', '市场成交、监管、佣金率与产品竞争。', '交易弹性'],
      ['0388', '香港交易所', '交易所与结算平台', '互联互通与上市生态', 'https://www.hkexgroup.com/', 'https://www.hkexgroup.com/Investor-Relations', '经营股票、衍生品、清算与市场数据服务，是连接中国与国际资本的关键基础设施。', '成交额、IPO 周期、政策、竞争与市场波动。', '基础设施'],
      ['601995', '中金公司', '投行与财富管理', '机构客户与跨境业务', 'https://www.cicc.com/', 'https://www.cicc.com/', '提供投行、经纪、资产管理和财富管理服务，受资本市场周期影响较大。', '市场景气、监管、佣金压力与资本占用。', '周期修复'],
    ],
  },
  {
    id: 'staples', code: '05', name: '必选消费与食品饮料', short: '品牌消费', eyebrow: 'Brands & repeat purchase', cycle: '现金流 · 渠道重构',
    description: '高频消费的关键是品牌、渠道和定价权；宏观偏弱时尤其要验证真实动销与库存。',
    lens: '观察量价、渠道库存、经销商质量、产品结构、现金回款与分红。', competitors: '比较品牌心智、渠道控制、供应链成本和新品成功率。', capital: '高现金流行业要看分红、回购、库存与跨品类投资是否增厚每股回报。', edge: '强品牌、稳定质量、经销体系和规模采购构成护城河。', metric: '销量、价格、渠道库存、毛利率、经营现金流、ROE 与分红率。',
    companies: [],
    chinaRecords: [
      ['600519', '贵州茅台', '高端白酒龙头', '品牌与直销结构', 'https://www.moutaichina.com/', 'https://www.moutaichina.com/', '以高端白酒和稀缺品牌定位形成极强的现金流与定价能力。', '需求变化、渠道价格、政策与高基数。', '品牌定价权'],
      ['000858', '五粮液', '浓香型白酒龙头', '产品升级与渠道改革', 'https://www.wuliangye.com.cn/', 'https://www.wuliangye.com.cn/', '围绕核心白酒品牌与系列酒经营，重点在于渠道效率和品牌势能。', '商务需求、渠道库存、价格体系与竞争。', '价值修复'],
      ['600887', '伊利股份', '乳制品平台', '常温奶与新品类', 'https://www.yili.com/', 'https://www.yili.com/', '覆盖液态奶、奶粉、冷饮等品类，规模供应链与渠道覆盖是核心资产。', '原奶价格、需求、促销和新品类竞争。', '防御成长'],
      ['603288', '海天味业', '调味品龙头', '餐饮复苏与渠道下沉', 'https://www.haitian-food.com/', 'https://www.haitian-food.com/', '提供酱油、蚝油及复合调味品，长期逻辑是品类渗透和渠道效率。', '餐饮需求、竞争、原料成本与渠道库存。', '渠道修复'],
      ['6862', '海底捞', '连锁餐饮平台', '门店效率与服务体验', 'https://www.haidilao.com/', 'https://www.haidilao.com/en/investor-relations.html', '以火锅连锁、供应链和服务能力形成全国化餐饮网络。', '同店销售、人力成本、扩店纪律与竞争。', '运营复苏'],
      ['9633', '农夫山泉', '包装水与饮料品牌', '品类扩张与渠道覆盖', 'https://www.nongfuspring.com/', 'https://www.nongfuspring.com/', '经营包装水、茶饮、果汁等饮料品牌，依赖渠道广度和产品组合。', '舆情、品类竞争、促销与原料成本。', '高频消费'],
    ],
  },
  {
    id: 'consumer', code: '06', name: '可选消费与服务', short: '消费升级', eyebrow: 'Aspirational demand', cycle: '需求弹性 · 品牌分化',
    description: '耐用品、旅游、服饰与新消费同时受收入预期和产品创新影响，胜负取决于品牌与运营效率。',
    lens: '研究同店、订单、渠道库存、产品周期、客单价与海外扩张。', competitors: '比较品牌位置、供应链速度、零售效率、用户运营与价格带。', capital: '门店扩张、库存、营销与研发投入必须由单位经济和现金回报证明。', edge: '品牌、产品定义、渠道密度和供应链效率是关键壁垒。', metric: '同店销售、订单、库存周转、毛利率、门店效率与经营现金流。',
    companies: [],
    chinaRecords: [
      ['000333', '美的集团', '家电与工业技术平台', '海外与 B 端升级', 'https://www.midea.com/', 'https://www.midea.com/cn/investors/', '从家电延展至暖通、机器人和工业技术，规模制造与全球渠道是基础。', '海外需求、价格竞争、原材料与并购整合。', '全球化'],
      ['600690', '海尔智家', '全球家电品牌', '高端化与场景生态', 'https://www.haier.com/', 'https://www.haier.com/cn/investor_relations/', '通过多品牌家电、海外渠道和智慧家庭方案服务全球家庭用户。', '海外经营、汇率、需求与渠道库存。', '品牌升级'],
      ['2020', '安踏体育', '运动服饰集团', '多品牌运营', 'https://www.anta.com/', 'https://ir.anta.com/', '经营安踏、FILA 等多品牌运动服饰，核心是品牌矩阵和零售运营。', '消费需求、库存、渠道折扣与品牌竞争。', '品牌矩阵'],
      ['601888', '中国中免', '旅游零售运营商', '离岛免税与市内店', 'https://www.ctgdutyfree.com.cn/', 'https://www.ctgdutyfree.com.cn/', '经营免税零售网络，业绩受客流、政策、价格与供应商谈判影响。', '出入境客流、竞争、折扣与政策变化。', '旅游复苏'],
      ['9992', '泡泡玛特', '潮玩与 IP 运营商', 'IP 生命周期与海外', 'https://www.popmart.com/', 'https://prod-out-res.popmart.com/investor-relations', '以潮玩零售、IP 孵化和全球渠道将收藏消费转化为高毛利品牌生意。', 'IP 热度、库存、授权与海外执行。', '新消费'],
      ['9868', '小鹏汽车', '智能电动车公司', '智能驾驶与产品周期', 'https://www.xiaopeng.com/', 'https://ir.xiaopeng.com/', '开发智能电动车与软件能力，核心是产品竞争力和规模化后的成本改善。', '价格战、销量、毛利率、供应链与融资。', '高弹性'],
    ],
  },
  {
    id: 'health', code: '07', name: '医药与医疗服务', short: '创新药', eyebrow: 'Science & access', cycle: '研发兑现 · 支付方约束',
    description: '创新药需要同时读临床价值、支付可及性、商业化与管线资本效率，不能只看单个数据点。',
    lens: '追踪关键临床读出、审评、医保、销售放量、海外授权和研发费用率。', competitors: '比较靶点差异化、临床证据、商业团队、全球权益和现金储备。', capital: '研发管线、BD、授权收入和融资稀释共同决定每股价值。', edge: '临床数据、注册能力、医生认知、商业化网络和 IP 构成壁垒。', metric: '患者数、销售额、临床进度、研发费用、现金跑道和授权里程碑。',
    companies: [],
    chinaRecords: [
      ['600276', '恒瑞医药', '创新药与仿制药平台', '管线升级与国际化', 'https://www.hengrui.com/', 'https://www.hengrui.com/', '以肿瘤、麻醉、造影等产品和创新药管线构建综合制药平台。', '集采、研发效率、商业化与海外兑现。', '创新转型'],
      ['688235', '百济神州', '全球肿瘤创新药公司', '核心产品全球商业化', 'https://www.beigene.com/', 'https://ir.beigene.com/', '围绕肿瘤药物研发与全球销售建立跨区域生物医药平台。', '竞争、费用率、临床、定价与现金消耗。', '全球化管线'],
      ['1093', '石药集团', '综合制药公司', '创新药与仿制药组合', 'https://www.cspc.com.hk/', 'https://www.cspc.com.hk/', '经营成药、原料药与创新药业务，利润与管线转型需要同步判断。', '集采、产品竞争、研发回报与政策。', '现金流转型'],
      ['1801', '信达生物', '创新生物药公司', '肿瘤与慢病放量', 'https://www.innoventbio.com/', 'https://www.innoventbio.com/', '开发并商业化肿瘤和慢病生物药，依赖产品组合扩大和研发效率。', '临床风险、竞品、医保谈判与持续投入。', '商业化加速'],
      ['3692', '翰森制药', '创新制药集团', '自研与商业化组合', 'https://www.hspharm.com/', 'https://www.hspharm.com/', '覆盖肿瘤、中枢神经、抗感染等领域，推动从仿制向创新药升级。', '集采、管线进度、销售效率与定价。', '稳健创新'],
      ['9688', '再鼎医药', '创新药商业化平台', '授权产品与本土商业化', 'https://www.zailaboratory.com/', 'https://ir.zailaboratory.com/', '引进与自研创新疗法，在中国及部分区域推进商业化和注册。', '亏损、授权成本、产品放量和融资。', '高弹性'],
    ],
  },
  {
    id: 'medtech', code: '08', name: '医疗器械与生命科学', short: '医疗工具', eyebrow: 'Tools & diagnostics', cycle: '国产替代 · 需求复苏',
    description: '器械、诊断与研发服务的长期价值来自装机基础、耗材复购、质量体系和客户信任。',
    lens: '观察医院招标、装机、耗材渗透、订单、海外收入与回款。', competitors: '比较产品性能、临床/监管认证、渠道覆盖和服务响应。', capital: '研发与产能投资必须转化为产品升级、毛利率和现金流。', edge: '装机后的耗材复购、质量体系、临床数据和售后网络形成壁垒。', metric: '订单、装机、耗材占比、海外收入、毛利率、应收账款与现金流。',
    companies: [],
    chinaRecords: [
      ['300760', '迈瑞医疗', '医疗设备平台', '高端设备与海外市场', 'https://www.mindray.com/', 'https://www.mindray.com/en/investor-relations/', '提供监护、影像、体外诊断等设备，装机基础与全球渠道是核心资产。', '医院招标、海外需求、竞争与回款。', '器械龙头'],
      ['603259', '药明康德', '医药研发生产服务', '全球客户与一体化服务', 'https://www.wuxiapptec.com/', 'https://www.wuxiapptec.com/', '为药企提供发现、开发和生产服务，收入与全球研发支出及客户项目进展相关。', '地缘、客户需求、产能利用率与合规。', '服务平台'],
      ['2269', '药明生物', '生物药 CDMO', '大分子项目与产能', 'https://www.wuxibiologics.com/', 'https://www.wuxibiologics.com/', '向生物药客户提供开发和生产服务，关键在项目漏斗与产能利用率。', '地缘、项目取消、价格与扩产。', '平台修复'],
      ['300759', '康龙化成', '临床前 CRO 平台', '客户项目与海外能力', 'https://www.pharmaron.com/', 'https://www.pharmaron.com/', '提供实验室、临床前和部分生产服务，受全球创新药研发周期影响。', '订单、产能、回款与海外经营。', '研发服务'],
      ['300015', '爱尔眼科', '眼科医疗服务网络', '门店效率与医疗质量', 'https://www.aierchina.com/', 'https://www.aierchina.com/', '通过连锁医院和专业医生网络提供眼科诊疗，强调标准化与区域扩张。', '客流、医保、医疗质量、扩张与竞争。', '服务网络'],
      ['688114', '华大智造', '生命科学仪器公司', '测序设备与海外导入', 'https://www.mgi-tech.com/', 'https://www.mgi-tech.com/', '开发基因测序等生命科学仪器，增长依赖装机、试剂复购和海外渗透。', '需求、竞争、专利、费用与现金流。', '技术渗透'],
    ],
  },
  {
    id: 'energy', code: '09', name: '能源、电力与新能源', short: '能源转型', eyebrow: 'Power & transition', cycle: '商品周期 · 装机周期',
    description: '传统能源、公共事业与新能源的回报模型截然不同；必须分辨价格驱动与资产回报驱动。',
    lens: '跟踪电价、利用小时、油气价格、装机、产业链价格、资本开支和负债。', competitors: '比较资源禀赋、项目储备、成本位置、技术效率与融资能力。', capital: '电站、矿产与制造产能都高度资本密集，现金回报是共同约束。', edge: '资源、牌照、并网能力、项目开发和低成本融资形成壁垒。', metric: '发电量、利用率、度电成本、油气产量、价格、CapEx 与自由现金流。',
    companies: [],
    chinaRecords: [
      ['300750', '宁德时代', '动力电池龙头', '技术迭代与全球客户', 'https://www.catl.com/', 'https://www.catl.com/en/investor-relations/', '提供动力和储能电池，依靠研发、规模制造和客户认证参与全球电动化。', '价格战、客户集中、原材料、海外与技术路线。', '全球制造'],
      ['600900', '长江电力', '大型水电运营商', '来水与资产注入', 'https://www.cypc.com.cn/', 'https://www.cypc.com.cn/', '运营大型水电资产，收益受来水、利用率、电价和资本运作影响。', '来水波动、电价、负债与外延项目。', '现金流资产'],
      ['300274', '阳光电源', '光伏逆变器与储能商', '海外储能与渠道', 'https://www.sungrowpower.com/', 'https://www.sungrowpower.com/', '提供光伏逆变器、储能系统和相关服务，海外市场与产品组合影响盈利。', '价格、海外政策、竞争、应收和项目风险。', '出海成长'],
      ['601012', '隆基绿能', '光伏组件与硅片企业', '技术路线与产能纪律', 'https://www.longi.com/', 'https://investor.longi.com/', '覆盖硅片、电池和组件，处在供给过剩与技术升级并行的光伏产业链中。', '价格下跌、产能、技术迭代与现金流。', '周期反转'],
      ['600938', '中国海油', '上游油气公司', '成本与产量增长', 'https://www.cnoocltd.com/', 'https://www.cnoocltd.com/', '聚焦海上油气勘探开发，现金流主要由产量、成本与油价共同决定。', '油价、储量替代、资本开支与政策。', '资源现金流'],
      ['601857', '中国石油', '综合油气公司', '炼化与天然气结构', 'https://www.petrochina.com.cn/', 'https://www.petrochina.com.cn/', '覆盖上游、炼化、销售和天然气，规模巨大且受宏观和政策影响显著。', '油价、炼化周期、资本开支与政策任务。', '高股息'],
    ],
  },
  {
    id: 'industrials', code: '10', name: '工业、装备与基建', short: '制造升级', eyebrow: 'Industrial capability', cycle: '投资周期 · 出口弹性',
    description: '自动化、工程机械、轨交和基建反映制造升级与投资周期，订单质量比收入增速更重要。',
    lens: '看订单、出口、产能利用率、回款、零部件成本和售后服务。', competitors: '比较技术、可靠性、经销网络、客户结构、全球服务和成本控制。', capital: '产能、研发和应收账款会决定增长是否真正创造现金流。', edge: '工程经验、渠道服务、规模供应链和客户认证构成工业壁垒。', metric: '新签订单、出口、产能利用率、毛利率、应收账款、现金回款。',
    companies: [],
    chinaRecords: [
      ['300124', '汇川技术', '工业自动化平台', '伺服、变频与新能源车', 'https://www.inovance.com/', 'https://www.inovance.com/', '提供变频器、伺服、PLC 和新能源汽车部件，受益于自动化渗透。', '制造业需求、价格竞争、客户集中与库存。', '自动化龙头'],
      ['600031', '三一重工', '工程机械公司', '海外与设备更新', 'https://www.sanyglobal.com/', 'https://www.sanyglobal.com/', '经营挖掘机、混凝土机械等装备，业绩受投资周期和海外拓展驱动。', '基建周期、价格、海外经营与应收。', '周期复苏'],
      ['601766', '中国中车', '轨道交通装备商', '国内订单与海外项目', 'https://www.crrcgc.cc/', 'https://www.crrcgc.cc/en/', '提供铁路车辆、城轨装备和相关系统，具备规模与全产业链优势。', '订单节奏、项目回款、海外执行与利润率。', '订单驱动'],
      ['000425', '徐工机械', '工程装备平台', '产品升级与海外', 'https://www.xcmg.com/', 'https://www.xcmg.com/', '经营工程起重、土方和道路机械，核心是产品结构、渠道和海外市场。', '需求、价格、回款、出口与资产负债表。', '海外扩张'],
      ['601668', '中国建筑', '建筑与基建承包商', '订单与现金回款', 'https://www.cscec.com/', 'https://www.cscec.com/', '覆盖房建、基建、地产和设计，订单规模大但现金流与回款更关键。', '地产、地方财政、应收与利润率。', '高股息'],
      ['600150', '中国船舶', '造船与海工集团', '手持订单与产品结构', 'https://www.cssc.net.cn/', 'https://www.cssc.net.cn/', '参与民船和海工装备制造，受造船价格、交付周期和产能利用率影响。', '订单周期、钢价、交付、整合与地缘。', '订单景气'],
    ],
  },
  {
    id: 'cyber', code: '11', name: '网络安全与数据基础设施', short: '安全底座', eyebrow: 'Trust infrastructure', cycle: '合规驱动 · 项目制转型',
    description: '安全需求由合规、攻击面扩大和云化推动；投资判断必须回到产品化率、回款和持续订阅。',
    lens: '观察政企预算、项目验收、云订阅、回款、毛利与研发效率。', competitors: '比较产品能力、客户信任、服务响应、生态伙伴和渠道覆盖。', capital: '高研发和高销售投入要被回款、续费和现金流证明。', edge: '安全能力、威胁数据、客户信任、资质和本地服务构成壁垒。', metric: '合同额、订阅收入、回款、应收、毛利率、研发费用和经营现金流。',
    companies: [],
    chinaRecords: [
      ['688561', '奇安信', '政企网络安全平台', '产品化与大客户服务', 'https://www.qianxin.com/', 'https://www.qianxin.com/', '提供终端、边界、数据和云安全产品，服务政企与关键基础设施客户。', '预算、回款、竞争、项目交付与亏损。', '安全平台'],
      ['002439', '启明星辰', '安全产品与服务商', '运营商协同与政企客户', 'https://www.venustech.com.cn/', 'https://www.venustech.com.cn/', '覆盖安全网关、检测、数据安全及服务，客户需求与合规投入相关。', '项目周期、回款、竞争与整合。', '经营修复'],
      ['300369', '绿盟科技', '网络安全服务商', '攻防与运营服务', 'https://www.nsfocus.com.cn/', 'https://www.nsfocus.com.cn/', '以安全产品、攻防能力和运营服务帮助客户应对复杂网络风险。', '预算、产品竞争、人才成本与回款。', '服务能力'],
      ['601360', '三六零', '数字安全与互联网公司', '安全大模型与政企服务', 'https://www.360.cn/', 'https://www.360.cn/', '拥有广泛互联网安全用户基础，并探索安全服务和 AI 相关商业化。', '广告波动、新业务投入、变现与竞争。', '转型观察'],
      ['688023', '安恒信息', '数据安全公司', '数据治理与云安全', 'https://www.dbappsecurity.com.cn/', 'https://www.dbappsecurity.com.cn/', '提供数据安全、云安全和网络安全产品，受数据合规要求推动。', '回款、竞争、费用率与项目验收。', '高弹性'],
      ['002212', '天融信', '网络安全产品商', '基础安全与渠道下沉', 'https://www.topsec.com.cn/', 'https://www.topsec.com.cn/', '提供防火墙、云安全、数据安全等基础产品，关注产品结构和渠道效率。', '价格竞争、政企预算、回款与库存。', '防御性'],
    ],
  },
  {
    id: 'defense', code: '12', name: '航空航天与国防', short: '高端装备', eyebrow: 'Aerospace & defense', cycle: '订单能见度 · 交付节奏',
    description: '国防产业的研究重心是型号进度、供应链位置、订单能见度和资产整合，而非短期情绪。',
    lens: '跟踪订单、产能、交付、关联交易、应收和资产注入线索。', competitors: '比较平台稀缺性、核心部件技术、资质壁垒和集团资源。', capital: '产能建设与集团整合会影响利润率、现金流和治理质量。', edge: '资质、型号认证、长期客户关系和高端制造经验是核心防线。', metric: '订单、交付、产能、毛利率、应收账款、经营现金流与关联交易。',
    companies: [],
    chinaRecords: [
      ['600760', '中航沈飞', '军机总装平台', '型号交付与产能', 'https://www.avicsac.com/', 'https://www.avicsac.com/', '聚焦航空装备总装与交付，价值取决于型号需求、生产节奏和供应链协同。', '交付节奏、订单、供应链与估值。', '稀缺平台'],
      ['600893', '航发动力', '航空发动机公司', '型号升级与维修保障', 'https://www.aecc.cn/', 'https://www.aecc.cn/', '参与航空发动机研制、生产和维修，技术门槛高、研发周期长。', '交付、研发投入、供应链、应收与治理。', '核心部件'],
      ['000768', '中航西飞', '大中型飞机制造商', '机体制造与总装', 'https://www.avic-xac.com/', 'https://www.avic-xac.com/', '承担军民用飞机机体制造等任务，订单和产能利用率是主要观察点。', '项目进度、成本、交付和应收。', '订单能见度'],
      ['002179', '中航光电', '连接器与互连系统商', '高可靠连接产品', 'https://www.jonhon.cn/', 'https://www.jonhon.cn/', '提供高可靠电连接、光连接与线束系统，覆盖航空航天与新能源等市场。', '下游订单、技术迭代、价格与扩产。', '军民两用'],
      ['600118', '中国卫星', '卫星制造与应用商', '卫星应用与系统集成', 'https://www.cast.cn/', 'https://www.cast.cn/', '从事小卫星研制和卫星应用相关业务，受项目进展与政策支持影响。', '项目确认、研发、订单与现金流。', '空间经济'],
      ['600685', '中船防务', '海军装备与造船企业', '军民船订单与交付', 'https://comec.cssc.net.cn/', 'https://comec.cssc.net.cn/', '经营军民船舶及海工相关业务，核心看订单质量、交付和成本控制。', '造船周期、订单、钢价、交付与整合。', '装备周期'],
    ],
  },
  {
    id: 'property', code: '13', name: '地产、数据中心与城市服务', short: '空间资产', eyebrow: 'Property & digital infrastructure', cycle: '去杠杆 · 结构分化',
    description: '地产开发、物业、住房服务和数据中心都与空间和资产负债表相关，但现金流质量差异极大。',
    lens: '看销售、土地、融资、交付、出租率、上架量、利用率和自由现金流。', competitors: '比较负债结构、品牌、城市布局、服务网络与资产运营能力。', capital: '杠杆、再融资、土地/机柜投资和回款决定生存与价值。', edge: '低成本资金、优质城市资源、客户信任和运营网络构成壁垒。', metric: '销售回款、净负债、融资成本、出租率、机柜利用率与经营现金流。',
    companies: [],
    chinaRecords: [
      ['BEKE', '贝壳', '住房交易与服务平台', '经纪网络与家装服务', 'https://www.ke.com/', 'https://ir.ke.com/', '连接房产交易、新房、租赁和家装服务，平台效率取决于真实交易和经纪人网络。', '地产交易量、佣金率、竞争与新业务投入。', '轻资产平台'],
      ['000002', '万科 A', '住宅开发与物业生态', '交付、融资与资产处置', 'https://www.vanke.com/', 'https://www.vanke.com/', '经营房地产开发、物业和相关业务，当前研究重心是流动性、交付与资产负债表。', '融资、销售、项目减值和行业调整。', '风险跟踪'],
      ['1109', '华润置地', '综合地产运营商', '商业地产与开发平衡', 'https://www.crland.com.hk/', 'https://www.crland.com.hk/', '兼具开发、商业运营和物业服务，优质资产与融资能力决定穿越周期的能力。', '销售、融资、商业客流与政策。', '资产质量'],
      ['0688', '中国海外发展', '大型房地产开发商', '核心城市土储与财务纪律', 'https://www.coli.com.hk/', 'https://www.coli.com.hk/', '聚焦核心城市开发，研究重点在于拿地纪律、销售回款和资产负债表。', '销售、政策、土地成本与融资。', '财务稳健'],
      ['GDS', '万国数据', '数据中心运营商', '机柜上架与海外扩张', 'https://www.gds-services.com/', 'https://ir.gds-services.com/', '提供高性能数据中心服务，受云客户需求、上架率和融资成本驱动。', '高杠杆、客户集中、CapEx与利用率。', '数字基建'],
      ['6098', '碧桂园服务', '物业服务公司', '第三方拓展与回款', 'https://www.bgyfw.com/', 'https://www.bgyfw.com/', '提供住宅和商业物业管理服务，现金回收、关联方敞口和第三方拓展是核心。', '关联方、回款、并购整合与行业风险。', '服务现金流'],
    ],
  },
  {
    id: 'materials', code: '14', name: '材料、资源与化工', short: '上游资源', eyebrow: 'Resources & process', cycle: '供需缺口 · 成本曲线',
    description: '资源与材料行业首先看成本曲线、供给纪律和资产负债表；题材与价格不是同一回事。',
    lens: '追踪商品价格、产销量、现金成本、资本开支、储量和库存。', competitors: '比较资源质量、成本位置、冶炼能力、环保约束和全球销售网络。', capital: '矿山、化工装置和材料产线需长期投资，必须用周期中现金流评估。', edge: '低成本资源、技术工艺、牌照、客户认证和规模物流构成壁垒。', metric: '产量、单位成本、实现价格、库存、CapEx、净负债与自由现金流。',
    companies: [],
    chinaRecords: [
      ['601899', '紫金矿业', '金铜资源集团', '低成本扩产与全球资源', 'https://www.zijinmining.com/', 'https://www.zijinmining.com/', '经营金、铜等资源开发，价值来自储量、成本、并购整合和产量增长。', '商品价格、海外运营、并购与安全环保。', '资源成长'],
      ['603993', '洛阳钼业', '铜钴与多金属矿企', '海外矿山与产量', 'https://www.cmoc.com/', 'https://www.cmoc.com/', '拥有铜钴等资源资产，受产量爬坡、商品价格和海外运营影响。', '价格、海外政策、产量、资本开支与汇率。', '周期弹性'],
      ['002466', '天齐锂业', '锂资源与化合物企业', '资源权益与价格周期', 'https://www.tianqilithium.com/', 'https://www.tianqilithium.com/', '参与锂精矿和锂化合物业务，盈利对锂价、库存和资源权益敏感。', '锂价、供给、债务、减值与客户需求。', '高波动'],
      ['002460', '赣锋锂业', '锂资源与电池材料商', '一体化与项目投产', 'https://www.ganfenglithium.com/', 'https://www.ganfenglithium.com/', '覆盖锂资源、化合物和回收等环节，需验证一体化在下行周期的现金回报。', '锂价、项目、资本开支、减值与融资。', '产能周期'],
      ['600309', '万华化学', '聚氨酯与化工平台', '成本优势与新材料', 'https://www.whchem.com/', 'https://www.whchem.com/', '以 MDI 等化工产品为基础，延展石化和新材料，成本与技术是关键。', '化工价差、原料、扩产、需求与安全环保。', '成本优势'],
      ['600019', '宝钢股份', '钢铁材料企业', '高端板材与行业整合', 'https://www.baosteel.com/', 'https://www.baosteel.com/', '生产汽车、家电和能源等领域钢材，受价差、需求和产能政策影响。', '钢价、原料、需求、环保与资本开支。', '周期防御'],
    ],
  },
  {
    id: 'mobility', code: '15', name: '交通、物流与出行', short: '移动网络', eyebrow: 'Mobility & logistics', cycle: '运价 · 资产效率',
    description: '快递、航运、航空和汽车零部件都依赖网络密度与资产效率；增长必须穿过价格战与资本开支检验。',
    lens: '看单量、运价、装载率、油价、车队/机队利用率、CapEx 和自由现金流。', competitors: '比较网络密度、服务质量、成本控制、客户结构和调度能力。', capital: '重资产扩张、租赁和负债会放大周期，必须读资产负债表。', edge: '网络密度、规模调度、品牌服务和枢纽位置是常见壁垒。', metric: '件量、单票收入、单票成本、运价、客座率、利用率与自由现金流。',
    companies: [],
    chinaRecords: [
      ['002352', '顺丰控股', '综合物流服务商', '高端快递与供应链', 'https://www.sf-express.com/', 'https://www.sf-express.com/', '覆盖快递、快运、冷运和供应链服务，网络质量与客户结构支撑定价。', '价格竞争、资本开支、油价、需求与整合。', '网络密度'],
      ['2618', '京东物流', '一体化供应链物流商', '外部客户与仓配效率', 'https://www.jdl.com/', 'https://ir.jdl.com/', '提供仓储、配送和供应链解决方案，核心命题是外部化增长与资产效率。', '客户集中、成本、价格与资本开支。', '供应链服务'],
      ['601919', '中远海控', '集装箱航运公司', '运价与船队效率', 'https://www.coscoshipping.com/', 'https://www.coscoshipping.com/', '经营集运和码头业务，利润高度受全球贸易、运价和运力供给影响。', '运价、供给、燃料、地缘与资本配置。', '周期现金流'],
      ['601111', '中国国航', '全服务航空公司', '国际航线与收益管理', 'https://www.airchina.com.cn/', 'https://www.airchina.com.cn/', '依托枢纽和航线网络提供客货运服务，收益受需求、运力、油价和汇率影响。', '客流、油价、汇率、竞争、负债与运力。', '出行修复'],
      ['600029', '中国南方航空', '大型航空公司', '运力效率与客流恢复', 'https://www.csair.com/', 'https://www.csair.com/', '经营国内外航空客运与货运，规模大但对周期和成本高度敏感。', '油价、汇率、竞争、运力和资产负债表。', '高弹性'],
      ['600660', '福耀玻璃', '汽车玻璃制造商', '全球配套与高附加值', 'https://www.fuyaogroup.com/', 'https://www.fuyaogroup.com/', '为汽车厂提供玻璃及相关产品，受益于全球产能和高附加值产品渗透。', '汽车需求、原材料、海外工厂和客户集中。', '全球制造'],
    ],
  },
].map((sector) => ({
  ...sector,
  companies: chinaCompanies(sector, sector.chinaRecords),
}))

export const markets = {
  us: { id: 'us', label: '美国', libraryLabel: '美国研究库', disclosureLabel: 'SEC 检索', industries: definitions.map((sector) => ({ ...sector, companies: rows(sector, sector.companies) })) },
  cn: { id: 'cn', label: '中国', libraryLabel: '中国研究库', disclosureLabel: '公告检索', industries: chinaDefinitions },
}

export const marketOptions = [
  { id: 'us', label: '美国', enabled: true },
  { id: 'cn', label: '中国', enabled: true },
  { id: 'eu', label: '欧洲', enabled: false },
  { id: 'asia', label: '亚洲', enabled: false },
]

export const industries = markets.us.industries
export const priceLabels = ['Sep', 'Oct', 'Nov', 'Dec', 'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug']
