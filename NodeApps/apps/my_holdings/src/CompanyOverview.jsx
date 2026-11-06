import { useEffect, useRef } from "react";
import { companyOverviewFor } from "./company-overview-data.js";

export function CompanyOverview({ watch }) {
  const overview = companyOverviewFor(watch);
  const container = useRef(null);
  useEffect(() => {
    const panel = container.current?.closest(".mh-rightbar");
    if (panel) panel.scrollTop = 0;
  }, [watch.id]);
  const phaseLabels = overview.isFund ? ["范围", "构成", "特点"] : ["起步", "扩展", "当前"];
  return (
    <article className="mh-company-brief" aria-labelledby="mh-company-brief-title" ref={container}>
      <header className="mh-company-brief__hero">
        <div className="mh-company-brief__eyebrow">
          <span>COMPANY FIELD GUIDE</span>
          <span>约 3 分钟</span>
        </div>
        <h2 id="mh-company-brief-title">{overview.name}</h2>
        <div className="mh-company-brief__identity">
          <strong>{overview.symbol}</strong>
          {overview.exchange && <span>{overview.exchange}</span>}
          <span>{overview.isFund ? "ETF 速览" : overview.industry}</span>
        </div>
        <p className="mh-company-brief__business">{overview.business}</p>
      </header>

      <section className="mh-company-brief__section">
        <div className="mh-company-brief__section-title">
          <span>01</span>
          <h3>{overview.isFund ? "基金持有什么" : "行业与增长空间"}</h3>
        </div>
        <p>{overview.guide.context}</p>
        <div className="mh-company-brief__potential">
          <span>{overview.isFund ? "产品定位" : "潜力从这里来"}</span>
          <p>{overview.guide.potential}</p>
        </div>
      </section>

      <section className="mh-company-brief__section">
        <div className="mh-company-brief__section-title">
          <span>02</span>
          <h3>{overview.isFund ? "基金结构" : "业务发展路径"}</h3>
        </div>
        <ol className="mh-company-brief__path">
          {overview.development.map((item, index) => (
            <li key={overview.symbol + "-" + index}>
              <span>{phaseLabels[index] || "阶段"}</span>
              <p>{item}</p>
            </li>
          ))}
        </ol>
      </section>

      <section className="mh-company-brief__section mh-company-brief__watch">
        <div className="mh-company-brief__section-title">
          <span>03</span>
          <h3>{overview.isFund ? "选择前看这三点" : "读这家公司，先看三件事"}</h3>
        </div>
        <ul>
          {overview.guide.checkpoints.map((item) => <li key={item}>{item}</li>)}
        </ul>
      </section>

      <p className="mh-company-brief__footnote">
        这是公司与行业的基础速览，不含估值或买卖结论。业务路径用于快速建立认识；财报和最新行情以公司公告与价格卡片为准。
      </p>
    </article>
  );
}
