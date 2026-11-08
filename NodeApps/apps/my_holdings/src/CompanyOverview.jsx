import { useEffect, useRef, useState } from "react";
import { companyOverviewFor } from "./company-overview-data.js";
import { request } from "./api.js";
import { money, holdingQuoteLabel } from "./model.js";

export function CompanyOverview({ watch }) {
  const [evidence, setEvidence] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const overview = companyOverviewFor(watch, evidence);
  const container = useRef(null);
  useEffect(() => {
    const panel = container.current?.closest('.mh-rightbar');
    if (panel) panel.scrollTop = 0;
    let active = true;
    setEvidence(null); setLoading(true); setError('');
    request('/api/company-briefs/' + encodeURIComponent(watch.symbol))
      .then(result => { if (active) setEvidence(result.evidence); })
      .catch(() => { if (active) setError('估值档案暂未读到，以下先显示已保存的公司研究。'); })
      .finally(() => { if (active) setLoading(false); });
    return () => { active = false; };
  }, [watch.id, watch.symbol, watch.researchedAt]);
  const currency = watch.priceCurrency || watch.research?.identity?.currency || 'USD';
  return <article className="mh-company-brief" aria-labelledby="mh-company-brief-title" ref={container}>
    <header className="mh-company-brief__hero">
      <div className="mh-company-brief__eyebrow"><span>公司 · 财务 · 投资判断</span><span>约 3 分钟</span></div>
      <h2 id="mh-company-brief-title">{overview.name}</h2>
      <div className="mh-company-brief__identity"><strong>{overview.symbol}</strong><span>{overview.exchange}</span><span>{overview.industry}</span></div>
      <p className="mh-company-brief__asof">研究截至 {overview.researchDate || '日期未记录'} · {overview.financialPeriod || '财务期间见下文'}</p>
    </header>
    <section className="mh-company-brief__section"><div className="mh-company-brief__section-title"><span>01</span><h3>{overview.isFund ? '买入后持有什么' : '公司做什么，靠什么赚钱'}</h3></div><p>{overview.business}</p></section>
    <section className="mh-company-brief__section"><div className="mh-company-brief__section-title"><span>02</span><h3>{overview.isFund ? '基金成本、价格与风险' : '财务底子、价值与价格'}</h3></div>
      <dl className="mh-company-brief__metrics"><div><dt>保存价格 · {currency}</dt><dd>{watch.price > 0 ? money(watch.price, currency) : '未核实'}</dd></div><div><dt>{overview.isFund ? '估值口径' : '过去12个月市盈率'}</dt><dd>{overview.isFund ? '看成分估值与费率' : watch.pe?.status === 'available' ? Number(watch.pe.value).toFixed(2) + ' 倍' : watch.pe?.status === 'unavailable' ? 'N/M · 无有效盈利倍数' : '尚未核实'}</dd></div></dl>
      <p className="mh-company-brief__asof">{holdingQuoteLabel({ ...watch, priceSource: watch.priceSource || '未记录来源' })}{!overview.isFund && watch.pe?.asOf ? `；P/E 日期 ${watch.pe.asOf}` : ''}</p>
      {overview.financial.length ? overview.financial.map((p, i) => <p key={i}>{p}</p>) : <p>{overview.isFund ? '基金不使用公司收入和净利润评价；目前保存研究未提供足够的费率、成分盈利及集中度数字，待补充。' : '已保存资料没有可提取的财务数字，需要补充收入、盈利、现金及债务；此处保留未知。'}</p>}
      {!overview.isFund && <p className="mh-company-brief__asof">GAAP＝会计口径；CFO＝经营现金流；CapEx＝资本开支；ARR＝年度经常性收入；M＝百万，B＝十亿。调整后利润不等于股东实际现金收益。</p>}
      {overview.value ? <div className="mh-company-brief__potential"><span>归档模型的今日价值 · {overview.value.date}</span><p>{money(overview.value.low, overview.value.currency)}–{money(overview.value.high, overview.value.currency)} / 股</p><small>这是该研究日的条件估计，取决于收入、利润、资本投入与折现假设；不是五年后目标价。价格变化不会自动更新模型。</small></div> : <p className="mh-company-brief__asof">尚无可靠的每股价值区间。市盈率低或股价下跌，本身不能证明便宜。</p>}
    </section>
    <section className="mh-company-brief__section"><div className="mh-company-brief__section-title"><span>03</span><h3>{overview.isFund ? '是否适合配置，为什么' : '是否值得投资，为什么'}</h3></div>
      {loading && <p role="status">正在读取该公司的估值研究…</p>}{error && <p role="status">{error}</p>}
      <div className="mh-company-brief__potential"><span>{overview.stance}</span><p>{overview.thesis}</p></div>
      {overview.judgment && <><h4>归档研究的判断 · {overview.researchDate}</h4><p>{overview.judgment}</p></>}
      {overview.risks.length > 0 && <><h4>最可能让判断出错的事</h4><ul>{overview.risks.map((r, i) => <li key={i}>{r}</li>)}</ul></>}
      {overview.triggers.length > 0 && <><h4>接下来用什么验证</h4><ul>{overview.triggers.map((r, i) => <li key={i}>{r}</li>)}</ul></>}
    </section>
    <section className="mh-company-brief__section"><h3>资料依据</h3><ul className="mh-company-brief__sources">{overview.sources.map((s,i) => <li key={i}><a href={s.url} target="_blank" rel="noopener noreferrer">{s.label}</a></li>)}</ul></section>
    <p className="mh-company-brief__footnote">财务和估值来自带日期的已保存研究，未自动联网刷新。经营事实、模型价值和保存报价可能不在同一天；没有价值模型的公司仅给出研究判断。</p>
  </article>;
}
