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

// 扩展名单与原始行业定义分离：每条记录仍会经 compactCompanies / enrichCompany
// 生成完整研究档案、监管披露入口、问题清单和跟踪轨迹，避免“只加名称不加研究内容”。
const usExpansionRecords = {
  semis: [
    ['INTC', 'Intel', 'CPU 与晶圆制造平台', '制程修复与代工转型', 'https://www.intel.com/', 'https://www.intc.com/', '覆盖 PC、服务器 CPU 和晶圆制造服务，正以工艺路线、先进封装和外部客户重建制造竞争力。', '制程执行、资本开支、PC 周期、代工客户导入与竞争对手份额。', '转型验证'],
    ['QCOM', 'Qualcomm', '无线与边缘计算芯片商', '端侧 AI 与授权', 'https://www.qualcomm.com/', 'https://investor.qualcomm.com/', '以手机 SoC、射频和专利授权为核心，并向汽车、PC 与边缘 AI 扩展。', '手机需求、客户自研、专利续约、地缘与汽车业务爬坡。', '现金回报'],
    ['ARM', 'Arm Holdings', '处理器 IP 平台', '架构授权与版税', 'https://www.arm.com/', 'https://investors.arm.com/', '向芯片设计商授权 CPU 架构与 IP，收入由授权、版税和高价值计算渗透共同驱动。', '客户自研、版税确认节奏、估值和数据中心采用速度。', 'IP 资产'],
    ['MRVL', 'Marvell Technology', '数据中心互连芯片商', '光互连与定制计算', 'https://www.marvell.com/', 'https://investor.marvell.com/', '提供交换、光互连、存储和定制计算芯片，受益于数据中心网络带宽升级。', '客户集中、定制项目兑现、库存和传统业务周期。', 'AI 网络'],
    ['AMAT', 'Applied Materials', '半导体制造设备商', '沉积与材料工程', 'https://www.appliedmaterials.com/', 'https://ir.appliedmaterials.com/', '提供沉积、刻蚀、检测和材料工程设备，服务逻辑、存储与先进封装扩产。', '晶圆厂资本开支、出口限制、订单节奏和服务收入质量。', '设备龙头'],
    ['LRCX', 'Lam Research', '刻蚀与薄膜设备商', '存储复苏与先进制程', 'https://www.lamresearch.com/', 'https://investor.lamresearch.com/', '聚焦刻蚀与薄膜沉积设备，在存储堆叠和先进逻辑制造中占据关键工艺位置。', '存储资本开支、客户集中、出口管制与工艺替代。', '周期成长'],
  ],
  cloud: [
    ['ADBE', 'Adobe', '创意与文档软件平台', '生成式 AI 变现', 'https://www.adobe.com/', 'https://www.adobe.com/investor-relations.html', '以 Creative Cloud、Document Cloud 和 Experience Cloud 服务创作、文档与营销工作流。', 'AI 功能定价、创意工具竞争、企业预算与订阅留存。', '订阅现金流'],
    ['SNOW', 'Snowflake', '云数据平台', '数据云与 AI 工作负载', 'https://www.snowflake.com/', 'https://investors.snowflake.com/', '通过跨云数据存储、计算和共享服务，连接企业数据分析与 AI 应用。', '消费型收入波动、云厂商竞争、产品迭代和销售效率。', '平台渗透'],
    ['PLTR', 'Palantir', '数据运营与 AI 软件商', 'AIP 商业化', 'https://www.palantir.com/', 'https://investors.palantir.com/', '向政府和企业提供数据整合、运营决策与 AI 应用平台，项目深度决定扩张空间。', '政府合同节奏、商业客户转化、估值与集中度。', 'AI 应用'],
    ['DDOG', 'Datadog', '云监控与安全平台', '可观测性平台化', 'https://www.datadoghq.com/', 'https://investors.datadoghq.com/', '提供基础设施、应用、日志、安全和用户体验监控，按使用量服务云原生团队。', '客户用量波动、云优化、竞争和多产品渗透。', '开发者工具'],
    ['MDB', 'MongoDB', '开发者数据库平台', 'Atlas 云服务', 'https://www.mongodb.com/', 'https://investors.mongodb.com/', '以文档数据库和 Atlas 托管云服务支持现代应用开发，收入依赖开发者采用与工作负载增长。', '数据库竞争、Atlas 消费增速、客户优化和执行。', '开发者生态'],
    ['SAP', 'SAP', '企业资源管理软件商', '云迁移与 S/4HANA', 'https://www.sap.com/', 'https://www.sap.com/investors/en.html', '提供 ERP、供应链、人力和业务流程软件，存量客户迁云是增长和利润率重估核心。', '迁移速度、实施复杂度、云利润率和竞争替代。', '全球龙头'],
  ],
  digital: [
    ['PINS', 'Pinterest', '视觉发现与广告平台', '商业化效率', 'https://www.pinterest.com/', 'https://investor.pinterestinc.com/', '以视觉发现和收藏意图连接用户、创作者与广告主，购物广告是主要变现方向。', '用户参与度、广告定价、平台竞争和国际 ARPU。', '广告弹性'],
    ['RDDT', 'Reddit', '社区内容与数据平台', '广告与数据授权', 'https://www.redditinc.com/', 'https://investor.redditinc.com/', '由主题社区、用户讨论和内容归档构成高意图流量，广告与数据授权共同探索变现。', '内容治理、搜索流量、广告产品成熟度和估值。', '社区网络'],
    ['MTCH', 'Match Group', '在线婚恋平台', '付费用户与产品创新', 'https://mtch.com/', 'https://ir.mtch.com/', '运营 Tinder、Hinge 等婚恋产品，依靠订阅、单次付费和品牌矩阵服务用户匹配需求。', '付费用户下降、获客成本、产品疲劳与竞争。', '修复观察'],
    ['RBLX', 'Roblox', '沉浸式内容平台', '创作者生态与广告', 'https://corp.roblox.com/', 'https://ir.roblox.com/', '连接用户、开发者和虚拟内容交易，平台规模取决于内容供给、参与度和安全治理。', '用户年龄结构、内容安全、基础设施成本和变现效率。', '平台成长'],
    ['WBD', 'Warner Bros. Discovery', '影视内容与流媒体集团', '内容整合与去杠杆', 'https://www.wbd.com/', 'https://ir.wbd.com/', '拥有电影、电视、体育与流媒体内容资产，研究重点是内容回报、订阅与债务压降。', '线性电视下滑、内容投入、整合执行和高杠杆。', '资产重组'],
    ['EA', 'Electronic Arts', '互动娱乐发行商', '体育 IP 与在线服务', 'https://www.ea.com/', 'https://ir.ea.com/', '以体育游戏、核心 IP 和在线服务形成经常性预订收入，产品更新与社区运营决定兑现。', '新品周期、开发成本、竞争和用户付费意愿。', 'IP 运营'],
  ],
  finance: [
    ['BAC', 'Bank of America', '全国性综合银行', '存款与财富管理', 'https://www.bankofamerica.com/', 'https://investor.bankofamerica.com/', '覆盖零售银行、财富管理、企业贷款和投行业务，资产负债表敏感度较高。', '利率路径、存款成本、信用损失、监管资本与商用地产。', '利率敏感'],
    ['GS', 'Goldman Sachs', '投行与资产管理商', '资本市场与另类资管', 'https://www.goldmansachs.com/', 'https://www.goldmansachs.com/investor-relations/', '以投行、交易、资产与财富管理服务机构和高净值客户，资本市场活跃度影响显著。', '交易波动、承销并购周期、另类资产退出与运营杠杆。', '市场周期'],
    ['MS', 'Morgan Stanley', '财富管理与投行平台', '经常性费用收入', 'https://www.morganstanley.com/', 'https://www.morganstanley.com/about-us-ir', '财富管理提供稳定费用基础，投行与交易业务提供周期弹性。', '市场回撤、净新增资产、投行业务恢复与薪酬成本。', '财富管理'],
    ['AXP', 'American Express', '闭环支付与消费金融网络', '高端消费与跨境', 'https://www.americanexpress.com/', 'https://ir.americanexpress.com/', '同时运营支付网络、发卡和客户服务，依赖高消费客群与商户覆盖提升交易价值。', '消费降温、信用损失、客户激励和竞争支付网络。', '品牌网络'],
    ['CME', 'CME Group', '衍生品交易所运营商', '利率与商品交易量', 'https://www.cmegroup.com/', 'https://investor.cmegroup.com/', '运营利率、股指、能源、金属和农产品衍生品交易与清算基础设施。', '交易量回落、监管、定价与新产品竞争。', '交易基础设施'],
    ['COIN', 'Coinbase', '数字资产交易平台', '交易份额与订阅服务', 'https://www.coinbase.com/', 'https://investor.coinbase.com/', '提供加密资产交易、托管、稳定币相关和机构服务，收入随市场活动与监管环境变化。', '资产价格波动、监管、费率压缩、安全与产品竞争。', '高波动'],
  ],
  consumer: [
    ['PM', 'Philip Morris International', '国际烟草与无烟产品商', '无烟产品转型', 'https://www.pmi.com/', 'https://philipmorrisinternationalinc.gcs-web.com/', '以国际卷烟和无烟尼古丁产品组合服务成熟消费市场，定价与产品替代共同影响利润。', '监管、税负、无烟产品采用、汇率和消费降级。', '高现金流'],
    ['CL', 'Colgate-Palmolive', '口腔护理与家庭消费品商', '品牌与新兴市场', 'https://www.colgatepalmolive.com/', 'https://investor.colgatepalmolive.com/', '以口腔护理、个人护理和宠物营养品牌覆盖全球日常消费场景。', '原材料、汇率、渠道议价和品牌投入回报。', '防御品牌'],
    ['MDLZ', 'Mondelez', '零食食品集团', '定价与品类扩张', 'https://www.mondelezinternational.com/', 'https://ir.mondelezinternational.com/', '经营饼干、巧克力和烘焙零食品牌，增长来自品类渗透、价格和国际市场。', '可可等原料价格、消费疲软、汇率与渠道竞争。', '全球零食'],
    ['KDP', 'Keurig Dr Pepper', '饮料与咖啡平台', '咖啡系统与分销', 'https://www.keurigdrpepper.com/', 'https://www.keurigdrpepper.com/investors/', '通过单杯咖啡系统、软饮品牌和分销网络实现设备、耗材与饮料协同。', '咖啡成本、渠道变化、整合和品牌竞争。', '组合消费'],
    ['KR', 'Kroger', '连锁超市运营商', '自有品牌与数字化', 'https://www.thekrogerco.com/', 'https://ir.kroger.com/', '以食品零售、药房、燃油和数字服务连接高频家庭消费，自有品牌与供应链效率是关键。', '食品通胀、劳动力、价格竞争与利润率压力。', '零售效率'],
    ['TGT', 'Target', '大众零售商', '商品组合与全渠道履约', 'https://corporate.target.com/', 'https://investors.target.com/', '以门店、线上履约和自有品牌覆盖家庭消费，库存纪律与客流决定经营杠杆。', '可选品疲弱、库存减记、价格竞争和货运成本。', '全渠道零售'],
  ],
  discretionary: [
    ['LOW', 'Lowe’s', '家居改善零售商', '专业客户与修复需求', 'https://www.lowes.com/', 'https://ir.lowes.com/', '销售建材、家居和维修产品，增长依赖住房存量、专业承包商和全渠道服务。', '住房交易低迷、DIY 需求、价格竞争和库存。', '存量住房'],
    ['CMG', 'Chipotle Mexican Grill', '快速休闲餐饮连锁', '门店扩张与餐厅效率', 'https://www.chipotle.com/', 'https://ir.chipotle.com/', '以标准化餐厅、数字点单和品牌定位经营墨西哥风味快餐。', '食品与人工成本、同店销售、门店执行和估值。', '高质量扩张'],
    ['MAR', 'Marriott International', '酒店管理与加盟平台', '轻资产客房增长', 'https://www.marriott.com/', 'https://marriott.gcs-web.com/', '以品牌、会员和管理加盟网络服务全球住宿需求，轻资产客房增长是价值核心。', '商务旅行、酒店供给、管理费率和宏观周期。', '会员网络'],
    ['MGM', 'MGM Resorts', '赌场与度假村运营商', '拉斯维加斯与数字博彩', 'https://www.mgmresorts.com/', 'https://investors.mgmresorts.com/', '运营度假村、赌场与数字博彩资产，收入受旅游、博彩量和资产运营效率驱动。', '消费周期、博彩监管、杠杆和区域竞争。', '体验消费'],
    ['YUM', 'Yum! Brands', '餐饮特许经营集团', '加盟扩张与国际化', 'https://www.yum.com/', 'https://investors.yum.com/', '通过肯德基、必胜客和 Taco Bell 的加盟网络收取品牌、供应链和特许收入。', '同店销售、加盟商健康、食品通胀和国际经营。', '轻资产加盟'],
    ['CCL', 'Carnival', '邮轮运营商', '收益管理与去杠杆', 'https://www.carnivalcorp.com/', 'https://www.carnivalcorp.com/investor-relations/', '以多品牌船队提供度假出行，客票、船上消费与运力管理决定现金修复速度。', '油价、消费回落、债务、运力扩张与地缘。', '高弹性'],
  ],
  health: [
    ['PFE', 'Pfizer', '创新药与疫苗公司', '产品组合重建', 'https://www.pfizer.com/', 'https://investors.pfizer.com/', '覆盖肿瘤、疫苗、免疫和罕见病药物，专利周期与新产品放量共同决定增长。', '专利到期、研发失败、并购整合与定价政策。', '修复观察'],
    ['BMY', 'Bristol Myers Squibb', '肿瘤与免疫药企', '管线接棒', 'https://www.bms.com/', 'https://investor.bms.com/', '以肿瘤、免疫和心血管药物为核心，正通过新产品和管线应对成熟品种压力。', '专利悬崖、临床数据、定价和并购债务。', '管线验证'],
    ['AMGN', 'Amgen', '生物制药公司', '生物类似药与新药', 'https://www.amgen.com/', 'https://investors.amgen.com/', '拥有成熟生物药、罕见病和炎症管线，生产能力与商业化网络支持产品组合扩展。', '临床进度、竞争品、定价和并购融资。', '现金流药企'],
    ['GILD', 'Gilead Sciences', '抗病毒与肿瘤药企', 'HIV 稳定与肿瘤放量', 'https://www.gilead.com/', 'https://investors.gilead.com/', '以 HIV 和抗病毒业务提供现金流，并推进肿瘤和细胞治疗产品扩张。', 'HIV 竞争、肿瘤商业化、专利与研发回报。', '组合升级'],
    ['REGN', 'Regeneron', '抗体药物研发商', '免疫与眼科管线', 'https://www.regeneron.com/', 'https://investor.regeneron.com/', '以抗体研发平台和关键合作产品服务眼科、免疫和肿瘤领域。', '核心产品竞争、临床结果、合作分成与定价。', '研发平台'],
    ['MCK', 'McKesson', '医药分销与服务商', '规模分销与肿瘤服务', 'https://www.mckesson.com/', 'https://investor.mckesson.com/', '向药房、医院和肿瘤诊所提供药品分销、技术与运营服务，周转效率是价值基础。', '药品价格、客户集中、监管与低利润率经营。', '供应链平台'],
  ],
  medtech: [
    ['MDT', 'Medtronic', '综合医疗器械公司', '创新管线与利润率', 'https://www.medtronic.com/', 'https://investorrelations.medtronic.com/', '覆盖心血管、神经调控、外科和糖尿病器械，装机基础与临床证据支撑经常性收入。', '产品迭代、医院预算、汇率和执行。', '成熟龙头'],
    ['EW', 'Edwards Lifesciences', '结构性心脏器械商', '经导管瓣膜渗透', 'https://www.edwards.com/', 'https://ir.edwards.com/', '专注经导管主动脉瓣和重症监护产品，临床数据与医生培训决定市场扩张。', '竞争产品、适应症扩展、医院容量和报销。', '临床壁垒'],
    ['DXCM', 'DexCom', '连续血糖监测公司', '糖尿病设备渗透', 'https://www.dexcom.com/', 'https://investors.dexcom.com/', '提供连续血糖监测系统及耗材，使用体验、报销与渠道覆盖推动患者渗透。', '竞争、报销、产品发布和定价压力。', '耗材模式'],
    ['IDXX', 'IDEXX Laboratories', '动物诊断公司', '宠物医疗渗透', 'https://www.idexx.com/', 'https://investor.idexx.com/', '为宠物医院提供诊断仪器、耗材、软件与实验室服务，客户工作流黏性较强。', '宠物医疗需求、诊所客流、设备更新和竞争。', '利基龙头'],
    ['WAT', 'Waters', '分析仪器与实验室工具商', '质谱与耗材服务', 'https://www.waters.com/', 'https://ir.waters.com/', '提供色谱、质谱和实验室信息工具，服务药物研发、质量控制与生命科学客户。', '实验室预算、订单周期、中国需求和产品迭代。', '工具复苏'],
    ['RMD', 'ResMed', '睡眠呼吸医疗设备商', '持续护理与软件', 'https://www.resmed.com/', 'https://investor.resmed.com/', '提供睡眠呼吸设备、面罩和医疗软件，耗材复购与临床渠道构成经常性收入。', '竞争、报销、供应链和患者依从性。', '设备耗材'],
  ],
  energy: [
    ['COP', 'ConocoPhillips', '上游油气生产商', '低成本资源与资本回报', 'https://www.conocophillips.com/', 'https://investor.conocophillips.com/', '聚焦全球油气勘探开发，资产组合、单位成本和资本分配决定穿越商品周期的能力。', '油气价格、储量替代、项目执行和监管。', '资源现金流'],
    ['OXY', 'Occidental Petroleum', '油气与碳管理公司', '二叠纪盆地与债务压降', 'https://www.oxy.com/', 'https://www.oxy.com/investors/', '经营油气、化学和碳管理资产，二叠纪产量与资产负债表修复是关键。', '油价、债务、收购整合、碳项目经济性。', '去杠杆'],
    ['KMI', 'Kinder Morgan', '天然气管道运营商', '输送量与合同续约', 'https://www.kindermorgan.com/', 'https://ir.kindermorgan.com/', '运营北美天然气、成品油和储运基础设施，长期合同与资产利用率支撑现金流。', '监管、项目回报、利率与天然气需求。', '管道现金流'],
    ['NEE', 'NextEra Energy', '可再生能源与公用事业集团', '电网投资与新能源储备', 'https://www.nexteraenergy.com/', 'https://www.investor.nexteraenergy.com/', '结合受监管公用事业和风光储项目，增长依赖负荷、电网投资与低成本融资。', '利率、项目回报、监管、设备成本和融资。', '能源转型'],
    ['DUK', 'Duke Energy', '受监管电力公用事业', '电网升级与负荷增长', 'https://www.duke-energy.com/', 'https://ir.duke-energy.com/', '在美国东南部运营电力与天然气公用事业，监管允许回报和资本计划是价值锚。', '监管结果、利率、极端天气和资本开支。', '防御公用'],
    ['FSLR', 'First Solar', '薄膜光伏组件制造商', '本土产能与订单', 'https://www.firstsolar.com/', 'https://investor.firstsolar.com/', '以薄膜组件技术和美国制造布局服务公用事业级光伏项目，订单与产能扩张决定增长。', '组件价格、政策、客户项目延期与扩产执行。', '制造成长'],
  ],
  industrial: [
    ['PH', 'Parker Hannifin', '运动控制与工程材料商', '航空航天与自动化', 'https://www.parker.com/', 'https://investors.parker.com/', '提供运动控制、过滤和工程材料产品，服务航空、工业和移动设备客户。', '工业周期、航空交付、并购整合和原材料。', '高质量工业'],
    ['ROK', 'Rockwell Automation', '工业自动化公司', '软件与智能制造', 'https://www.rockwellautomation.com/', 'https://ir.rockwellautomation.com/', '以控制系统、软件和服务帮助制造商实现自动化与数字化运营。', '制造业 CapEx、订单取消、软件渗透和竞争。', '自动化平台'],
    ['EMR', 'Emerson Electric', '过程自动化与软件商', '自动化组合重塑', 'https://www.emerson.com/', 'https://ir.emerson.com/', '提供过程控制、测试测量和工业软件，受益于能源、化工与制造自动化投资。', '终端周期、并购整合、订单与利润率。', '组合升级'],
    ['PCAR', 'Paccar', '重卡制造与金融服务商', '车队更新与服务', 'https://www.paccar.com/', 'https://investor.paccar.com/', '通过 Kenworth、Peterbilt 和 DAF 销售卡车、零件与金融服务，行业周期影响显著。', '货运景气、价格、供应链、金融信用和排放法规。', '周期龙头'],
    ['URI', 'United Rentals', '设备租赁平台', '租赁渗透与项目需求', 'https://www.unitedrentals.com/', 'https://ir.unitedrentals.com/', '向建筑、工业和市政客户出租设备与服务，车队利用率和定价带来规模效应。', '建设周期、利用率、设备残值和债务。', '资产效率'],
    ['PWR', 'Quanta Services', '电网与能源工程服务商', '电网升级与数据中心接入', 'https://www.quantaservices.com/', 'https://investors.quantaservices.com/', '提供输配电、可再生能源和通信基础设施工程服务，订单积压反映电网投资强度。', '项目执行、劳动力、客户集中和合同风险。', '基建成长'],
  ],
  cyber: [
    ['CHKP', 'Check Point Software', '网络安全平台商', '订阅转型与防火墙升级', 'https://www.checkpoint.com/', 'https://ir.checkpoint.com/', '提供网络、云和终端安全产品，庞大客户基础支撑维护、订阅和平台交叉销售。', '新一代安全竞争、产品更新和增长放缓。', '现金流防御'],
    ['S', 'SentinelOne', '终端安全平台', 'AI 驱动的 EDR', 'https://www.sentinelone.com/', 'https://investors.sentinelone.com/', '以自动化终端检测与响应服务企业客户，增长取决于产品广度和销售效率。', '竞争、客户流失、亏损改善和大客户集中。', '高弹性'],
    ['TENB', 'Tenable', '暴露管理软件商', '资产可见性与平台化', 'https://www.tenable.com/', 'https://investors.tenable.com/', '帮助企业识别、评估并修复 IT、云和运营技术资产暴露，订阅模式带来持续收入。', '预算收紧、平台竞争、销售执行和产品扩展。', '订阅成长'],
    ['GEN', 'Gen Digital', '个人网络安全公司', '消费者订阅与捆绑', 'https://www.gendigital.com/', 'https://investor.gendigital.com/', '通过 Norton、Avast 等品牌提供个人安全、身份保护和隐私订阅服务。', '消费者流失、获客成本、整合与竞争。', '消费者订阅'],
    ['VRNS', 'Varonis Systems', '数据安全平台', '数据访问治理与 SaaS 化', 'https://www.varonis.com/', 'https://ir.varonis.com/', '帮助企业发现敏感数据并治理访问权限，数据安全合规推动其订阅化迁移。', '迁云执行、销售周期、竞争和盈利转折。', '数据安全'],
    ['RBRK', 'Rubrik', '数据韧性与备份安全商', '网络恢复与订阅', 'https://www.rubrik.com/', 'https://ir.rubrik.com/', '提供数据备份、恢复和勒索软件防护服务，数据韧性成为安全预算的重要组成。', '竞争、订阅转型、客户集中和亏损。', '新上市观察'],
  ],
  defense: [
    ['BA', 'Boeing', '商用航空与国防制造商', '生产恢复与现金流', 'https://www.boeing.com/', 'https://investors.boeing.com/', '覆盖商用飞机、国防系统和服务，产能稳定、质量与交付决定资产负债表修复。', '质量事件、监管、供应链、交付与高负债。', '修复观察'],
    ['TDG', 'TransDigm Group', '航空航天零部件商', '售后市场与定价', 'https://www.transdigm.com/', 'https://investors.transdigm.com/', '提供高度专业化的航空零部件，原厂认证和售后市场带来较强的定价与现金流。', '航空周期、监管、杠杆和并购估值。', '高壁垒零部件'],
    ['HEI', 'HEICO', '航空电子与替换零部件商', '售后渗透与并购', 'https://www.heico.com/', 'https://ir.heico.com/', '提供航空电子、国防电子和经认证替换零部件，依靠工程能力和小型并购扩展。', '航空利用率、认证进度、并购整合和估值。', '复利并购'],
    ['RKLB', 'Rocket Lab', '航天发射与系统公司', '发射服务与卫星系统', 'https://www.rocketlabusa.com/', 'https://investors.rocketlabusa.com/', '提供小型火箭发射、卫星部件和空间系统，增长取决于订单、发射可靠性与产能。', '发射失败、合同兑现、资本需求与竞争。', '空间成长'],
    ['KTOS', 'Kratos Defense', '无人系统与国防技术商', '无人机与微波系统', 'https://www.kratosdefense.com/', 'https://ir.kratosdefense.com/', '面向国防客户提供无人系统、卫星通信和微波电子产品，项目转量产是关键。', '预算节奏、项目执行、客户集中与利润率。', '新型国防'],
    ['BWXT', 'BWX Technologies', '核技术与海军推进供应商', '核反应堆与服务', 'https://www.bwxt.com/', 'https://investors.bwxt.com/', '提供海军核推进部件、核材料与相关服务，长期合同和监管资质形成进入壁垒。', '政府预算、项目执行、供应链和核监管。', '稀缺能力'],
  ],
  realestate: [
    ['DLR', 'Digital Realty', '全球数据中心 REIT', '云互联与上架率', 'https://www.digitalrealty.com/', 'https://investor.digitalrealty.com/', '提供数据中心、互联和托管容量，云客户扩张、租赁签约和资本成本决定回报。', '利率、客户集中、开发 CapEx 和供给。', '数字地产'],
    ['PSA', 'Public Storage', '自助仓储 REIT', '租金与并购整合', 'https://www.publicstorage.com/', 'https://ir.publicstorage.com/', '运营自助仓储设施，收益来自本地供需、租金管理和收购开发。', '租金回落、竞争供给、利率和并购。', '防御地产'],
    ['AVB', 'AvalonBay Communities', '高端公寓 REIT', '核心城市租赁', 'https://www.avalonbay.com/', 'https://ir.avalonbay.com/', '在美国高收入都市圈持有和开发多户住宅，租金、供应和融资成本决定回报。', '新供给、就业、利率和建设成本。', '住宅资产'],
    ['INVH', 'Invitation Homes', '独栋住宅出租平台', '租金增长与运营规模', 'https://www.invitationhomes.com/', 'https://ir.invitationhomes.com/', '持有并运营独栋出租住宅，依靠区域组合、物业管理和租金管理提升资产效率。', '租金监管、房价、利率、维修成本和供给。', '规模运营'],
    ['EXR', 'Extra Space Storage', '自助仓储 REIT', '同店增长与整合', 'https://www.extraspace.com/', 'https://investors.extraspace.com/', '运营自助仓储网络，通过品牌、管理平台和并购扩大市场覆盖。', '入住率、定价、利率和整合执行。', '整合平台'],
    ['CCI', 'Crown Castle', '通信塔与光纤 REIT', '5G 租约与资本配置', 'https://www.crowncastle.com/', 'https://investor.crowncastle.com/', '提供通信塔和光纤基础设施，移动运营商租约与资产组合调整影响现金流。', '客户 CapEx、光纤回报、利率和治理。', '通信基础设施'],
  ],
  materials: [
    ['DOW', 'Dow', '基础化学与材料公司', '价差与产能纪律', 'https://www.dow.com/', 'https://investors.dow.com/', '生产包装、基础化学和高性能材料，盈利受原料、需求与全球供给共同影响。', '化工价差、需求、产能过剩和能源成本。', '周期防御'],
    ['DD', 'DuPont', '特种材料与电子材料商', '高附加值组合', 'https://www.dupont.com/', 'https://investors.dupont.com/', '服务电子、水处理、工业与医疗等领域，产品组合调整和技术壁垒是增长基础。', '终端需求、分拆执行、诉讼与成本。', '特种材料'],
    ['ALB', 'Albemarle', '锂资源与化学品公司', '锂价与扩产纪律', 'https://www.albemarle.com/', 'https://investors.albemarle.com/', '覆盖锂资源、加工和特种化学品，现金流对锂价、项目节奏与资本强度敏感。', '锂价、项目减值、资本开支和客户需求。', '高波动'],
    ['CF', 'CF Industries', '氮肥生产商', '天然气成本与农业需求', 'https://www.cfindustries.com/', 'https://investor.cfindustries.com/', '生产氨、尿素等氮肥，成本曲线受天然气与物流优势影响。', '农产品价格、天然气、全球供给和环保政策。', '资源现金流'],
    ['MOS', 'Mosaic', '磷肥与钾肥生产商', '养分价格与产量', 'https://www.mosaicco.com/', 'https://investors.mosaicco.com/', '生产磷肥和钾肥，农业种植收益与全球供应影响其实现价格和资本回报。', '商品价格、矿山运营、天气和地缘。', '农业周期'],
    ['SCCO', 'Southern Copper', '铜矿生产商', '低成本铜资源', 'https://southerncoppercorp.com/', 'https://southerncoppercorp.com/', '拥有美洲铜矿和冶炼资产，受益于电气化需求但高度依赖成本、品位与社会许可。', '铜价、政治风险、矿山品位和资本开支。', '资源龙头'],
  ],
  mobility: [
    ['UPS', 'United Parcel Service', '综合包裹物流商', '网络效率与价格', 'https://www.ups.com/', 'https://investors.ups.com/', '运营全球包裹、供应链和国际物流网络，件量、定价与网络密度决定利润。', '货运需求、劳动力成本、价格竞争与资本开支。', '网络现金流'],
    ['FDX', 'FedEx', '快递与货运网络', '网络重组与利润率', 'https://www.fedex.com/', 'https://investors.fedex.com/', '提供快递、地面和货运服务，组织整合与自动化旨在提升资产利用率。', '宏观货运、燃油、执行、劳资与竞争。', '效率修复'],
    ['JBHT', 'J.B. Hunt', '多式联运物流商', '铁路协同与运力', 'https://www.jbhunt.com/', 'https://investor.jbhunt.com/', '通过卡车、多式联运和专用运输服务连接货主与铁路网络。', '运价周期、司机供给、铁路服务和客户集中。', '多式联运'],
    ['XPO', 'XPO', '零担货运运营商', '密度与服务质量', 'https://www.xpo.com/', 'https://investors.xpo.com/', '聚焦北美零担货运，以网络密度、定价和服务水平改善单位经济。', '工业需求、运价、劳动力和网络扩张。', '货运修复'],
    ['UAL', 'United Airlines', '全球航空公司', '国际航线与高端客群', 'https://www.united.com/', 'https://ir.united.com/', '运营国内外客运和货运网络，枢纽、收益管理和运力配置决定周期回报。', '油价、劳动力、运力、经济周期和飞机交付。', '出行周期'],
    ['AAL', 'American Airlines', '大型网络航空公司', '运力与资产负债表', 'https://www.aa.com/', 'https://americanairlines.gcs-web.com/', '以枢纽网络服务商务与休闲出行，研究重点是收益管理、成本和去杠杆。', '燃油、劳资、运力、债务和竞争。', '高弹性'],
  ],
}

const chinaExpansionRecords = {
  semis: [
    ['002185', '华天科技', '集成电路封测服务商', '先进封装与客户导入', 'https://www.ht-tech.com/', 'https://www.ht-tech.com/', '提供集成电路封装测试服务，受益于本土供应链建设和先进封装需求。', '下游周期、价格竞争、客户集中与资本开支。', '封测扩张'],
    ['002156', '通富微电', '芯片封装测试企业', '高端封测与海外客户', 'https://www.tfme.com/', 'https://www.tfme.com/', '覆盖先进封装测试与多类芯片客户，产能利用率和产品结构影响盈利。', '周期、客户集中、技术投入与汇率。', '先进封装'],
    ['300223', '北京君正', '嵌入式计算芯片设计商', '汽车与存储芯片', 'https://www.ingenic.com.cn/', 'https://www.ingenic.com.cn/', '设计嵌入式 CPU、视频和存储芯片，业务与汽车电子、安防和消费终端相关。', '需求波动、库存、产品迭代与竞争。', '设计成长'],
    ['688099', '晶晨股份', '智能终端 SoC 设计商', '智能终端与边缘 AI', 'https://www.amlogic.com/', 'https://www.amlogic.com/', '提供智能电视、机顶盒和智能终端 SoC，产品升级与海外客户决定成长。', '消费电子周期、客户集中、价格和库存。', '端侧 AI'],
    ['688012', '中微公司', '半导体设备公司', '刻蚀与薄膜设备', 'https://www.amec-inc.com/', 'https://www.amec-inc.com/', '研发并销售刻蚀、薄膜沉积等半导体设备，是国产设备链关键参与者。', '验证进度、客户导入、研发投入与行业资本开支。', '设备国产化'],
    ['688126', '沪硅产业', '半导体硅片制造商', '大尺寸硅片认证', 'https://www.nsig.com/', 'https://www.nsig.com/', '生产半导体硅片，客户认证、良率和产能爬坡决定国产替代的兑现质量。', '价格、良率、折旧、客户认证与资本开支。', '材料国产化'],
  ],
  cloud: [
    ['688111', '金山办公', '办公软件与协同平台', '订阅化与 AI 助手', 'https://www.wps.com/', 'https://ir.wps.cn/', '提供 WPS 办公、协同和文档服务，个人订阅、机构授权与 AI 功能驱动商业化。', '订阅增速、AI 变现、政企采购和竞争。', '国产软件'],
    ['600588', '用友网络', '企业管理软件商', 'YonBIP 云转型', 'https://www.yonyou.com/', 'https://www.yonyou.com/', '提供 ERP、财务、供应链和企业云服务，客户迁云与项目交付是转型核心。', '云化亏损、回款、实施周期和竞争。', '转型观察'],
    ['002410', '广联达', '建筑数字化软件商', 'SaaS 渗透与成本管理', 'https://www.glodon.com/', 'https://www.glodon.com/', '为建筑行业提供造价、施工和数字化管理软件，客户付费与行业投资相关。', '地产基建周期、订阅转型、回款和竞争。', '垂直 SaaS'],
    ['688158', '优刻得', '云计算服务商', '公有云与国产算力', 'https://www.ucloud.cn/', 'https://ir.ucloud.cn/', '提供公有云、私有云和数据服务，研究重点是客户结构、算力投入和盈利改善。', '价格竞争、CapEx、客户集中和现金流。', '云服务'],
    ['688083', '中望软件', '工业设计软件商', '国产 CAD 渗透', 'https://www.zwsoft.com/', 'https://www.zwsoft.com/', '提供 CAD/CAM 等工业设计软件，产品能力和生态建设决定国产替代空间。', '研发投入、产品竞争、客户教育和收入确认。', '工业软件'],
    ['0909', '明源云', '地产产业数字化服务商', 'SaaS 续费与行业修复', 'https://www.myun.com/', 'https://www.myun.com/', '为地产产业链提供销售、采购和运营数字化软件，需求与行业投资、客户续费相关。', '地产下行、回款、客户流失和转型。', '行业修复'],
  ],
  digital: [
    ['9888', '百度集团', '搜索、云与 AI 平台', 'AI 搜索与智能云', 'https://www.baidu.com/', 'https://ir.baidu.com/', '以搜索广告为现金流基础，并发展智能云、自动驾驶和 AI 应用。', '搜索竞争、AI 成本、广告需求和新业务投入。', 'AI 平台'],
    ['0772', '阅文集团', '数字阅读与 IP 运营商', 'IP 改编与内容生态', 'https://www.yuewen.com/', 'https://ir.yuewen.com/', '运营网络文学、数字阅读和 IP 改编业务，内容供给、付费转化与影视动画变现共同驱动。', '内容监管、IP 成功率、版权成本和用户付费。', '内容资产'],
    ['0240', '心动公司', '游戏社区与研发商', 'TapTap 与自研游戏', 'https://www.xd.com/', 'https://ir.xd.com/', '结合 TapTap 游戏社区、发行和自研内容，社区流量与产品周期决定商业化。', '新品表现、版号、营销成本和用户留存。', '社区游戏'],
    ['2013', '微盟集团', '商家数字化服务商', 'SaaS 订阅与商家生态', 'https://www.weimob.com/', 'https://www.weimob.com/', '为商家提供私域运营、营销和交易 SaaS 工具，客户留存和付费深度是核心。', '商家预算、竞争、销售费用与产品稳定性。', '商家 SaaS'],
    ['9899', '云音乐', '在线音乐平台', '订阅与内容成本', 'https://music.163.com/', 'https://ir.music.163.com/', '提供音乐社区、会员和广告服务，内容版权、用户黏性和付费渗透决定盈利。', '版权成本、竞争、用户增长和监管。', '订阅媒体'],
    ['1797', '东方甄选', '内容电商与直播平台', '自营产品与流量转化', 'https://www.eastbuy.com/', 'https://www.eastbuy.com/', '通过直播内容、自营产品和供应链服务连接消费者与品牌，流量转化与复购是关键。', '主播依赖、流量波动、供应链与竞争。', '内容电商'],
  ],
  finance: [
    ['601288', '农业银行', '大型国有商业银行', '县域存款与信贷质量', 'https://www.abchina.com/', 'https://www.abchina.com/', '覆盖公司、零售和县域金融服务，负债成本、息差与资产质量决定盈利。', '息差收窄、不良生成、地产和地方融资平台敞口。', '高股息'],
    ['601939', '建设银行', '大型国有商业银行', '基建金融与零售', 'https://www.ccb.com/', 'https://www.ccb.com/', '提供公司、零售、住房金融和资产管理服务，规模与客户基础构成长期优势。', '息差、房地产、信用成本与资本约束。', '稳健金融'],
    ['601328', '交通银行', '全国性商业银行', '财富管理与综合金融', 'https://www.bankcomm.com/', 'https://www.bankcomm.com/', '经营商业银行、财富管理和跨境金融业务，研究重点是负债成本与资产质量。', '息差、信用成本、同业竞争与资本补充。', '利率敏感'],
    ['600030', '中信证券', '综合券商与投行平台', '投行业务与机构服务', 'https://www.citics.com/', 'https://www.citics.com/', '覆盖经纪、投行、资管、研究和自营业务，市场活跃度和风控影响盈利。', '市场波动、监管、资本消耗与投行业务周期。', '资本市场'],
    ['601688', '华泰证券', '财富管理与机构券商', '数字化财富管理', 'https://www.htsc.com.cn/', 'https://www.htsc.com.cn/', '提供经纪、投行、资管和机构服务，平台能力与客户资产增长决定竞争力。', '市场交易量、监管、信用业务和费用率。', '财富管理'],
    ['601336', '新华保险', '寿险公司', '新业务价值与投资收益', 'https://www.newchinalife.com/', 'https://www.newchinalife.com/', '提供寿险、健康险和财富管理服务，代理人效率、产品结构和投资回报共同决定价值。', '利率、权益市场、代理人队伍与退保。', '保险修复'],
  ],
  staples: [
    ['000568', '泸州老窖', '高端白酒企业', '品牌升级与渠道管理', 'https://www.lzlj.com/', 'https://www.lzlj.com/', '以国窖等品牌经营白酒业务，渠道库存、价格体系和高端消费决定增长质量。', '消费疲软、渠道库存、价格竞争和政策。', '高端消费'],
    ['000596', '古井贡酒', '区域白酒龙头', '全国化与产品结构', 'https://www.gujing.com/', 'https://www.gujing.com/', '经营白酒品牌并推进全国化，产品升级和经销商管理是经营杠杆。', '区域竞争、消费环境、库存和费用率。', '区域扩张'],
    ['603369', '今世缘', '中高端白酒企业', '省外拓展与渠道质量', 'https://www.jinshiyuan.com.cn/', 'https://www.jinshiyuan.com.cn/', '以中高端白酒为核心，增长取决于基地市场深耕与省外渠道建设。', '需求、渠道库存、竞争和营销投入。', '成长白酒'],
    ['600809', '山西汾酒', '清香型白酒龙头', '品牌全国化与复兴', 'https://www.fenjiu.com.cn/', 'https://www.fenjiu.com.cn/', '依托清香型品牌与产品矩阵拓展全国市场，价格体系与渠道效率决定兑现。', '高端消费、竞争、库存和费用投放。', '品牌扩张'],
    ['600600', '青岛啤酒', '啤酒品牌运营商', '高端化与渠道效率', 'https://www.tsingtao.com.cn/', 'https://www.tsingtao.com.cn/', '经营啤酒品牌和销售网络，结构升级、餐饮场景和原料成本影响盈利。', '原料价格、消费场景、竞争和渠道库存。', '高端化'],
    ['000895', '双汇发展', '肉制品与生鲜食品商', '产品结构与成本控制', 'https://www.shuanghui.net/', 'https://www.shuanghui.net/', '覆盖生猪屠宰、肉制品和冷链销售，猪价、产能利用率和产品升级是关键。', '猪价周期、食品安全、需求和原料成本。', '食品龙头'],
  ],
  consumer: [
    ['000651', '格力电器', '空调与家电制造商', '渠道变革与多元化', 'https://www.gree.com/', 'https://www.gree.com/', '以空调为核心并拓展生活电器和工业产品，渠道效率与产品结构影响盈利。', '地产需求、价格竞争、渠道库存和多元化执行。', '家电龙头'],
    ['603605', '珀莱雅', '美妆品牌运营商', '多品牌与线上运营', 'https://www.proya-group.com/', 'https://www.proya-group.com/', '经营护肤和美妆品牌，产品创新、内容营销和线上渠道决定增长。', '营销费用、流量成本、竞争和新品成功率。', '国货美妆'],
    ['300979', '华利集团', '运动鞋制造商', '全球客户与产能布局', 'https://www.huali-group.com/', 'https://www.huali-group.com/', '为国际运动品牌提供鞋类制造服务，客户订单、产能效率和海外布局影响回报。', '客户集中、订单波动、人工成本和贸易政策。', '全球制造'],
    ['600258', '首旅酒店', '酒店运营集团', 'RevPAR 修复与轻资产管理', 'https://www.bthhotels.com/', 'https://www.bthhotels.com/', '经营中高端及经济型酒店品牌，客房增长、加盟管理与入住率决定利润弹性。', '出行需求、竞争、加盟商质量和人工成本。', '出行修复'],
    ['002032', '苏泊尔', '炊具与小家电企业', '产品升级与渠道效率', 'https://www.supor.com.cn/', 'https://www.supor.com.cn/', '提供炊具和小家电产品，品牌、研发和零售渠道影响持续增长。', '需求、原材料、渠道变化和竞争。', '耐用消费'],
    ['603833', '欧派家居', '定制家居公司', '整家定制与渠道优化', 'https://www.oppein.com/', 'https://www.oppein.com/', '经营橱柜、衣柜和整家定制，订单、经销商和交付能力受地产后周期影响。', '地产、经销商、价格和回款。', '地产后周期'],
  ],
  health: [
    ['300347', '泰格医药', '临床 CRO 服务商', '临床项目与海外布局', 'https://www.tigermedgrp.com/', 'https://www.tigermedgrp.com/', '提供临床研究、注册和数据服务，订单质量和客户研发投入决定收入。', '融资环境、项目取消、回款和海外业务。', '研发服务'],
    ['300142', '沃森生物', '疫苗研发与生产商', '产品放量与管线', 'https://www.walvax.com/', 'https://www.walvax.com/', '开发和销售人用疫苗，批签发、渠道和新产品商业化决定增长。', '竞争、产品价格、研发进度和政策。', '疫苗成长'],
    ['600196', '复星医药', '综合医药健康集团', '创新药与国际化', 'https://www.fosunpharma.com/', 'https://www.fosunpharma.com/', '覆盖创新药、仿制药、器械和医疗服务，产品管线与资本配置共同影响价值。', '研发回报、债务、并购整合和政策。', '组合医药'],
    ['688180', '君实生物', '创新生物药公司', 'PD-1 与管线商业化', 'https://www.junshipharma.com/', 'https://www.junshipharma.com/', '聚焦肿瘤和自身免疫创新药，产品放量、临床数据和费用控制是关键。', '临床失败、竞争、医保谈判和亏损。', '高弹性'],
    ['600085', '同仁堂', '中药品牌企业', '品牌传承与渠道升级', 'https://www.tongrentang.com/', 'https://www.tongrentang.com/', '经营中成药和健康产品，品牌信任、产品质量和渠道管理构成核心资产。', '监管、原料、渠道与产品竞争。', '品牌中药'],
    ['002821', '凯莱英', 'CDMO 服务商', '临床与商业化项目', 'https://www.asymchem.com.cn/', 'https://www.asymchem.com.cn/', '向药企提供工艺研发和生产服务，订单可见度、产能利用率和客户结构决定增长。', '客户项目波动、产能利用率、价格和回款。', '制造服务'],
  ],
  medtech: [
    ['688271', '联影医疗', '高端医学影像设备商', '装机与海外拓展', 'https://www.united-imaging.com/', 'https://www.united-imaging.com/', '提供 CT、MR、PET/CT 等医学影像设备，技术迭代、医院采购和服务收入是关键。', '集采、医院 CapEx、海外准入和应收。', '国产高端器械'],
    ['002223', '鱼跃医疗', '家用医疗器械商', '慢病管理与渠道', 'https://www.yuwell.com/', 'https://www.yuwell.com/', '提供呼吸、血糖、康复和家用医疗设备，产品结构与线上线下渠道决定盈利。', '需求波动、竞争、渠道库存和产品合规。', '家用器械'],
    ['300832', '新产业', '体外诊断设备与试剂商', '海外装机与试剂放量', 'https://www.snibe.com/', 'https://www.snibe.com/', '提供化学发光等 IVD 仪器与试剂，装机、试剂消耗和海外渠道是主要变量。', '集采、医院采购、海外拓展和回款。', '试剂耗材'],
    ['603882', '金域医学', '第三方医学检验服务商', '检验网络与回款', 'https://www.kingmed.com.cn/', 'https://www.kingmed.com.cn/', '通过实验室网络提供临床检验与病理服务，样本量、项目结构和回款影响现金流。', '检测需求、应收、竞争和合规。', '服务网络'],
    ['688139', '海尔生物', '生命科学与医疗低温设备商', '物联网与场景扩张', 'https://www.haiermedical.com/', 'https://www.haiermedical.com/', '提供低温存储、生物安全和智慧实验室解决方案，海外渠道与产品组合驱动成长。', '需求波动、竞争、海外经营和整合。', '生命科学设备'],
    ['688016', '心脉医疗', '主动脉介入器械商', '产品创新与医院覆盖', 'https://www.endovastec.com/', 'https://www.endovastec.com/', '专注主动脉及外周血管介入器械，临床数据、医生教育和产品迭代形成壁垒。', '集采、产品安全、竞争和合规。', '高值耗材'],
  ],
  energy: [
    ['601088', '中国神华', '煤炭与电力一体化集团', '成本优势与现金回报', 'https://www.shenhuachina.com/', 'https://www.shenhuachina.com/', '覆盖煤炭、铁路、港口、电力和煤化工，一体化能力平滑部分周期波动。', '煤价、政策、产量、安全环保和资本开支。', '高股息'],
    ['601225', '陕西煤业', '煤炭资源企业', '成本曲线与产量', 'https://www.shxcoal.com/', 'https://www.shxcoal.com/', '以煤炭开采销售为核心，资源禀赋、成本和资本回报决定周期内价值。', '煤价、产量、安全、政策和投资收益。', '资源现金流'],
    ['601985', '中国核电', '核电运营商', '核准机组与利用率', 'https://www.cnnp.com.cn/', 'https://www.cnnp.com.cn/', '运营核电及新能源资产，利用小时、上网电价、核准项目和融资成本影响增长。', '核准节奏、建设成本、电价和负债。', '清洁基荷'],
    ['600886', '国投电力', '综合发电运营商', '水电与新能源布局', 'https://www.sdicpower.com/', 'https://www.sdicpower.com/', '拥有水电、火电和新能源资产，来水、利用率及项目投资决定现金流。', '来水、电价、燃料、负债和项目执行。', '公用事业'],
    ['600025', '华能水电', '流域水电运营商', '来水与梯级调度', 'https://www.hnl.com.cn/', 'https://www.hnl.com.cn/', '运营流域水电资产，来水、调度效率和电价共同影响发电量和现金流。', '水文波动、电价、负债和项目建设。', '水电资产'],
    ['600011', '华能国际', '火电与新能源运营商', '煤电盈利与新能源转型', 'https://www.hpi.com.cn/', 'https://www.hpi.com.cn/', '运营火电、燃气和新能源机组，燃料成本、电价和装机结构决定周期利润。', '煤价、电价、利用小时、负债和 CapEx。', '转型公用'],
  ],
  industrials: [
    ['601100', '恒立液压', '高端液压件制造商', '挖机复苏与多元化', 'https://www.henglihydraulics.com/', 'https://www.henglihydraulics.com/', '生产液压油缸、泵阀等核心零部件，工程机械景气和新品拓展影响增长。', '下游周期、价格、客户集中和产能扩张。', '核心零部件'],
    ['002050', '三花智控', '热管理系统供应商', '汽车热管理与全球客户', 'https://www.sanhua.com/', 'https://www.sanhua.com/', '提供制冷和新能源汽车热管理部件，技术、客户认证和全球制造构成竞争力。', '汽车需求、价格、客户集中和海外运营。', '全球供应链'],
    ['601800', '中国交建', '交通基建与工程承包商', '海外项目与回款', 'https://www.ccccltd.cn/', 'https://www.ccccltd.cn/', '覆盖港口、公路、桥梁和海外工程，订单、项目执行与现金回款决定质量。', '地方财政、海外风险、应收和毛利率。', '基建龙头'],
    ['600970', '中材国际', '水泥工程与装备服务商', '海外工程与运维', 'https://www.sinoma.com.cn/', 'https://www.sinoma.com.cn/', '提供水泥工程、装备和运维服务，海外订单和项目交付是增长主要来源。', '海外项目、回款、汇率和行业 CapEx。', '出海工程'],
    ['600875', '东方电气', '能源装备制造商', '电站设备与新能源装备', 'https://www.dongfang.com/', 'https://www.dongfang.com/', '制造发电设备、风电和核电装备，订单结构、交付和成本控制影响盈利。', '订单周期、原材料、项目执行和应收。', '能源装备'],
    ['601390', '中国中铁', '铁路基建与工程集团', '订单与现金回款', 'https://www.crec.cn/', 'https://www.crec.cn/', '覆盖铁路、城市轨道和基础设施建设，订单储备与回款质量比规模更重要。', '地方财政、应收、项目毛利和负债。', '订单驱动'],
  ],
  cyber: [
    ['300188', '国投智能', '电子数据取证与安全服务商', '政企数据安全需求', 'https://www.meiya.com/', 'https://www.meiya.com/', '提供电子数据取证、网络空间安全与大数据服务，政企项目和回款决定经营节奏。', '项目验收、回款、预算和竞争。', '政企安全'],
    ['300768', '迪普科技', '网络安全产品商', '云化安全与渠道', 'https://www.dptech.com/', 'https://www.dptech.com/', '提供防火墙、应用交付和安全产品，关注产品化、渠道效率和客户需求。', '价格竞争、政企预算、回款和库存。', '产品安全'],
    ['688201', '信安世纪', '身份安全与数据安全商', '密码与零信任', 'https://www.infosec.com.cn/', 'https://www.infosec.com.cn/', '提供身份认证、电子签名和数据安全产品，合规需求与客户项目驱动收入。', '项目周期、竞争、费用和回款。', '身份安全'],
    ['603232', '格尔软件', '密码与身份认证商', 'PKI 与信创安全', 'https://www.gemalto.com.cn/', 'https://www.gemalto.com.cn/', '聚焦公钥基础设施、身份认证和安全服务，政企数字化需求带来订单机会。', '订单确认、客户集中、竞争和回款。', '密码安全'],
    ['688027', '国盾量子', '量子通信与安全公司', '量子安全应用', 'https://www.quantum-info.com/', 'https://www.quantum-info.com/', '提供量子通信相关产品和服务，产业化进度、项目落地与研发投入是主要变量。', '商业化不及预期、项目依赖、研发和估值。', '前沿技术'],
    ['002268', '电科网安', '商用密码与网络安全商', '密码国产化与数据安全', 'https://www.cetc30.com/', 'https://www.cetc30.com/', '提供商用密码、网络安全和数据安全产品，资质与政企客户关系构成门槛。', '预算、项目回款、竞争和费用率。', '安全资质'],
  ],
  defense: [
    ['600879', '航天电子', '航天电子系统供应商', '型号配套与交付', 'https://www.casc-elec.com/', 'https://www.casc-elec.com/', '提供航天测控、电子和机电产品，型号配套、订单与交付节奏影响业绩。', '型号进度、应收、关联交易和项目交付。', '核心配套'],
    ['600967', '内蒙一机', '陆军装备制造商', '主战装备与产能', 'https://www.yituo.com.cn/', 'https://www.yituo.com.cn/', '参与装甲车辆等陆军装备制造，订单、产能利用和供应链协同决定盈利。', '订单节奏、交付、供应链与应收。', '装备平台'],
    ['002985', '北摩高科', '航空制动系统供应商', '高端零部件与维修', 'https://www.bmks.com.cn/', 'https://www.bmks.com.cn/', '提供航空制动和相关高端部件，型号认证与维修市场形成一定门槛。', '型号需求、客户集中、产品质量和应收。', '专精部件'],
    ['300699', '光威复材', '高性能碳纤维企业', '航空航天材料认证', 'https://www.guangweitansu.com/', 'https://www.guangweitansu.com/', '生产碳纤维及复合材料，航空航天认证、产能和下游渗透决定成长。', '订单、技术迭代、价格和扩产。', '关键材料'],
    ['002414', '高德红外', '红外热成像设备商', '军用订单与民用拓展', 'https://www.guideir.com/', 'https://www.guideir.com/', '提供红外热成像与光电系统，技术路线、订单和民用市场拓展是主要变量。', '订单波动、竞争、研发和回款。', '光电装备'],
    ['600372', '中航机载', '航空机载系统平台', '系统集成与资产整合', 'https://www.avionics.com.cn/', 'https://www.avionics.com.cn/', '提供航空机载设备和系统，型号配套、整合协同和交付能力影响价值。', '交付、整合、应收和供应链。', '系统平台'],
  ],
  property: [
    ['600048', '保利发展', '大型住宅开发商', '核心城市销售与交付', 'https://www.poly.com.cn/', 'https://www.poly.com.cn/', '聚焦住宅开发与城市服务，销售回款、土储质量和融资能力决定穿越周期能力。', '销售下行、融资、减值、交付和政策。', '央企开发'],
    ['001979', '招商蛇口', '综合园区与地产运营商', '园区资产与现金流', 'https://www.cmsk1979.com/', 'https://www.cmsk1979.com/', '经营产业园区、住宅和商业资产，资源禀赋与资产运营能力影响长期回报。', '销售、融资、项目去化和减值。', '综合运营'],
    ['001914', '招商积余', '物业服务与资产管理商', '第三方拓展与回款', 'https://www.cmpm.com.cn/', 'https://www.cmpm.com.cn/', '提供物业管理、设施服务和资产运营，第三方项目扩张与现金回收是关键。', '回款、关联方、竞争和人工成本。', '服务现金流'],
    ['2669', '中海物业', '物业管理服务商', '在管面积与利润率', 'https://www.cop.com.hk/', 'https://www.cop.com.hk/', '提供住宅和商业物业管理服务，品牌、在管面积和增值服务共同驱动收入。', '关联方项目、人工成本、回款和竞争。', '物业龙头'],
    ['1209', '华润万象生活', '商业与物业运营商', '商业资产运营与服务', 'https://www.crmixclifestyle.com.cn/', 'https://www.crmixclifestyle.com.cn/', '覆盖购物中心运营与物业服务，商业客流、租户结构和服务扩张是核心。', '消费疲软、关联方、人工成本和回款。', '商业运营'],
    ['002244', '滨江集团', '区域住宅开发商', '核心城市布局与财务纪律', 'https://www.binjiang.com.cn/', 'https://www.binjiang.com.cn/', '聚焦核心城市住宅开发，销售回款、拿地纪律和融资能力决定相对韧性。', '销售、融资、土地成本和行业政策。', '区域优选'],
  ],
  materials: [
    ['000792', '盐湖股份', '钾肥与锂盐资源商', '资源禀赋与产品价格', 'https://www.qhyhgf.com/', 'https://www.qhyhgf.com/', '拥有盐湖钾肥和锂盐资源，产量、成本与商品价格决定现金流。', '钾肥和锂价、项目进度、环保与资本开支。', '资源资产'],
    ['600111', '北方稀土', '稀土资源与冶炼企业', '配额与下游需求', 'https://www.reht.com/', 'https://www.reht.com/', '从事稀土开采、冶炼分离和功能材料业务，配额、价格和新能源需求影响盈利。', '稀土价格、政策、需求和库存。', '战略资源'],
    ['002738', '中矿资源', '锂铯资源与加工企业', '海外资源与锂盐产能', 'https://www.sinomine.com/', 'https://www.sinomine.com/', '覆盖海外锂铯资源开发与锂盐加工，资源项目、产量和价格共同决定回报。', '锂价、海外政策、项目执行和资本开支。', '资源成长'],
    ['600549', '厦门钨业', '钨钼与新能源材料商', '资源与材料一体化', 'https://www.cxtc.com/', 'https://www.cxtc.com/', '经营钨钼、稀土和新能源材料，资源保障与产品升级共同影响盈利。', '商品价格、需求、产能和环保。', '多金属'],
    ['601600', '中国铝业', '铝土矿氧化铝与电解铝集团', '成本与供给纪律', 'https://www.chinalco.com.cn/', 'https://www.chinalco.com.cn/', '覆盖铝土矿、氧化铝、电解铝和加工业务，能源成本与铝价是主要变量。', '铝价、电力成本、政策和资本开支。', '周期资源'],
    ['600188', '兖矿能源', '煤炭资源与化工企业', '产量与海外资源', 'https://www.yanzhoucoal.com.cn/', 'https://www.yanzhoucoal.com.cn/', '经营煤炭开采、贸易和煤化工，产量、成本和资本配置决定周期内现金流。', '煤价、安全、海外运营和负债。', '高股息'],
  ],
  mobility: [
    ['002594', '比亚迪', '新能源汽车与电池制造商', '车型迭代与海外扩张', 'https://www.byd.com/', 'https://www.bydglobal.com/en/InvestorRelations.html', '覆盖新能源汽车、电池和电子业务，垂直整合、成本和产品节奏支撑竞争力。', '价格战、海外政策、需求、产能和车型更新。', '全球电动化'],
    ['601006', '大秦铁路', '煤运铁路运营商', '运量与运价稳定', 'https://www.daqintielu.com/', 'https://www.daqintielu.com/', '运营煤炭运输干线，运量、运价和资本开支决定其稳定现金流属性。', '煤炭需求、运量、运价和资产维护。', '运输现金流'],
    ['601816', '京沪高铁', '高速铁路运营商', '客流恢复与运力效率', 'https://www.cr-jh.com/', 'https://www.cr-jh.com/', '运营京沪高铁相关资产，客流、票价、运输能力和成本控制影响盈利。', '客流、票价政策、竞争和折旧。', '核心线路'],
    ['600115', '中国东航', '大型航空公司', '国际航线与收益管理', 'https://www.ceair.com/', 'https://www.ceair.com/', '经营国内外客货运，航线结构、收益管理、油价和汇率决定周期利润。', '油价、汇率、运力、竞争和负债。', '出行修复'],
    ['601021', '春秋航空', '低成本航空公司', '低成本网络与机队效率', 'https://www.ch.com/', 'https://www.ch.com/', '以低成本模式运营国内外航线，单位成本、客座率和航线投放决定竞争优势。', '油价、航权、运力、汇率和竞争。', '效率航空'],
    ['002120', '韵达股份', '快递网络运营商', '单票成本与服务质量', 'https://www.yundaex.com/', 'https://www.yundaex.com/', '经营全国快递网络，件量、单票价格、分拨效率和直营网点质量影响盈利。', '价格战、单票成本、加盟商和需求。', '网络运营'],
  ],
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
  companies: chinaCompanies(sector, [
    ...sector.chinaRecords,
    ...(chinaExpansionRecords[sector.id] || []),
  ]),
}))

export const markets = {
  us: {
    id: 'us', label: '美国', libraryLabel: '美国研究库', disclosureLabel: 'SEC 检索',
    industries: definitions.map((sector) => ({
      ...sector,
      companies: rows(sector, [
        ...sector.companies,
        ...compactCompanies(sector, usExpansionRecords[sector.id] || []),
      ]),
    })),
  },
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
