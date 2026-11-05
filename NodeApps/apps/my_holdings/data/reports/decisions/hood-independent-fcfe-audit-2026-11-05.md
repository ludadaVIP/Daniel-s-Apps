# HOOD 最终FCFE模型独立复算与有限经济审查
结果：PASS_WITH_ECONOMIC_LIMITATIONS；独立JS数值比对1825项、布尔比对32项；最大绝对差1.4551915228366852e-11（金额单位百万美元）。
权威JSON SHA256：4b0e1baed825bbe46998a729a7ce2d7782dbc532d0de0ce7883b0ccd93721b4b。未运行或导入作者Python。

|情景|今日FCFE|2031 FCFE|今日盈利法|2031盈利法|2031留存现金（百万美元）|融资/可转条件|
|---|---:|---:|---:|---:|---:|---|
|bear|5.0082|10.0734|11.3095|22.7475|2619.7325|通过|
|base|24.2433|43.6872|54.9740|99.0649|6867.4497|通过|
|bull|63.4914|106.9868|127.7273|215.2280|10095.3893|通过|

覆盖：三主情景全部10年盈利/所需资本/FCFE/现金桥、终值及估值；25组Ke/g；6组资本系数；5个完整压力路径；三档价格及所需收益率；独立解析反推统一利润率增量和未来P/E；权证全部保留分母敏感性。

资本系数压力：
- c=1：29.2921，融资通过=true，未融资缺口=0.0000百万美元。
- c=1.3：26.2628，融资通过=true，未融资缺口=0.0000百万美元。
- c=1.5：24.2433，融资通过=true，未融资缺口=0.0000百万美元。
- c=1.7：22.2238，融资通过=true，未融资缺口=0.0000百万美元。
- c=2：19.1945，融资通过=false，未融资缺口=382.0290百万美元。
- c=2.2：17.1750，融资通过=false，未融资缺口=1994.9527百万美元。

经济限制与未覆盖：
- This is independent arithmetic reconstruction and limited economic consistency review, not validation of forecasts, security fair value, legal capital sufficiency, or investment suitability.
- Operating revenue/margins/capital ratios, normal tax, NCI shares, 3.5% lost asset yield, zero-yield retained cash, and research P/E multiples are accepted scenario inputs; the audit does not establish them as economic facts.
- No current/excess corporate cash or customer/platform assets are added, and already recorded debt principal is not subtracted again. This treatment is consistent only with the declared debt-financed-asset release assumption and does not prove parent liquidity in 2029.
- Net warrant reserve is a common current-quote treasury-stock-style approximation, not an independently priced option. Existing award/date overlap and new cash-compensation calibration remain disclosed approximations.
- At terminal transition, the capital floor itself grows at g; this is an explicit change of the preterminal fixed-floor policy and is conservative when the floor remains binding. It is arithmetically coherent under that declared rule.
- A failed funding or capped-call flag invalidates the unadjusted per-share diagnostic as an investable value. No full financing, market option-path or above-cap convertible-premium cash model is validated here.
- P/E and FCFE disagreement reflects different growth-duration and capital assumptions. Taking their minimum is a disclosed action heuristic, not independent corroboration of intrinsic value.
- D&A and capitalized software are not modeled as separate FCFE reinvestment. The use of required total economic capital must implicitly include maintenance/growth reinvestment in nonfinancial operating assets; otherwise NI-minus-capital-growth would overstate cash. Capital coefficients are not a full asset/liability or regulatory capital forecast.
- Retained cash at year 5 is valued at par once. The model implicitly assumes that cash can be valued/realized separately at that horizon; permanent trapped cash, taxes on extraction, and subsidiary distribution constraints are not independently reconstructed.
- Near-12-month research periods are approximations rather than exact quarterly cash dates. The audit accepts the normalized salary/old award allocation convention and does not independently price each existing grant.

原型RIM已弃用，不在本次最终FCFE算术认证中。正式报告应按主情景适用范围引用结果；不通过融资/可转条件的压力数字只可标为融资前诊断。
