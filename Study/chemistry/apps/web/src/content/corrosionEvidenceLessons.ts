import type { Lesson } from './lessons';

export const corrosionEvidenceLessons = [
  {
    "id": "rust-controls-and-observation-window",
    "levelId": "metals",
    "order": 117,
    "nextLessonId": "sacrificial-protection-needs-paths",
    "title": {
      "zh": "没看到锈，就能证明以后不会生锈吗？",
      "en": "No visible rust—does that prove it will never rust?"
    },
    "eyebrow": {
      "zh": "金属衔接 1/2 · 公平对照与观察窗口",
      "en": "Metals bridge 1/2 · Controlled comparisons and observation windows"
    },
    "hook": {
      "zh": "记录 A 与 B 在第 1 天都没有可见锈迹。到了第 5 天，A 出现明显锈迹，B 仍未见。第 1 天能不能就宣布氧气没有影响？",
      "en": "Records A and B show no visible rust on day one. By day five, A has clear rust while B still has none visible. Could day one establish that oxygen had no effect?"
    },
    "hookHint": {
      "zh": "先检查两份记录改变了哪些条件，再把当日观察与对未来的断言分开。",
      "en": "Check which conditions differ, then separate a daily observation from a claim about the future."
    },
    "bigIdea": {
      "zh": "公平对照只隔离目标因素；当日未见差异不证明永无影响，锈迹等级也不能当作精确速率或质量。",
      "en": "A controlled comparison isolates the target factor; no visible difference yet does not prove no effect forever, and rust grades are not precise rates or masses."
    },
    "estimatedMinutes": 18,
    "everydayExamples": [
      {
        "icon": "🕒",
        "title": {
          "zh": "同一天看不出差异",
          "en": "No difference visible on one day"
        },
        "body": {
          "zh": "A/B 第 1 天都为 0，不代表条件没有作用。换到第 5 天再检查，观察结果可能不同。",
          "en": "A and B both have grade zero on day one; that does not erase the treatment. Their day-five records can show a difference."
        }
      },
      {
        "icon": "🧂",
        "title": {
          "zh": "加盐与没有加盐",
          "en": "With and without added salt"
        },
        "body": {
          "zh": "A 与 D 只改变本题的加盐处理，才可用来比较这个因素。A 本身后来也有锈，说明本题并不把加盐当作生锈必需条件。",
          "en": "Only the salt treatment differs between A and D. A later rusts too, so added salt is not a necessary condition in these records."
        }
      },
      {
        "icon": "🔎",
        "title": {
          "zh": "相同结果，不同条件",
          "en": "Same outcome, different conditions"
        },
        "body": {
          "zh": "D 与 F 的锈迹等级相同，但加盐、温度和表面积不同。相同等级不证明两组由同一个因素造成，也不能用来隔离加盐效应。",
          "en": "D and F have the same grades but differ in salt, temperature and area. Equal outcomes neither establish one common cause nor isolate salt."
        }
      }
    ],
    "steps": [
      {
        "title": {
          "zh": "先读完整条件",
          "en": "Read all conditions first"
        },
        "body": {
          "zh": "六份教学记录列出水、可用氧气、加盐、涂层、温度与铁表面积。未加 NaCl 不等于没有任何离子；水中也可溶解 O₂。题设无氧记录指已排除可用氧并隔绝补入，不能只凭水面上没有气泡这样判断。",
          "en": "Six teaching records specify water, available oxygen, added salt, coating, temperature and iron area. No added NaCl does not mean no ions. Water can contain dissolved O₂; the oxygen-excluded record is stipulated to prevent resupply, not inferred from an absence of bubbles."
        }
      },
      {
        "title": {
          "zh": "一次只隔离所问因素",
          "en": "Isolate the factor being asked about"
        },
        "body": {
          "zh": "比较氧气用 A/B，比较水用 A/C，比较加盐用 A/D，比较完整涂层用 A/E；其余列出条件相同。A/F 同时改变温度和表面积，不能把结果差异归给其中一个，更不能归给根本没改变的加盐。",
          "en": "Compare A/B for oxygen, A/C for water, A/D for salt and A/E for coating, holding the other listed conditions equal. A/F changes both temperature and area, so it isolates neither and says nothing about a salt treatment that did not change."
        }
      },
      {
        "title": {
          "zh": "公平比较不保证当天已看见差异",
          "en": "A controlled comparison need not show a difference yet"
        },
        "body": {
          "zh": "A/B 在第 1 天同为 0，但在第 5 天等级不同。前一条是当天未见可见差异，后一条在给定条件和观察窗口内支持处理影响；不能把某一次观察扩大为永远不会发生的保证。",
          "en": "A/B both show zero on day one but differ on day five. The first records no visible difference yet; the latter supports a treatment effect within the specified conditions and window, not an unlimited guarantee."
        }
      },
      {
        "title": {
          "zh": "把等级与测量单位分开",
          "en": "Keep grades separate from measurement units"
        },
        "body": {
          "zh": "0–3 只是可见锈迹的有序等级。3 不表示等级 1 的三倍质量或三倍速率。多天观察同一组材料不是多次独立实验；真实研究还需重复、测量与控制，本题记录不冒充这些证据。",
          "en": "Grades zero to three rank visible rust. Three is not three times grade one's mass or rate. Several days from one setup are not independent replicates; real studies need replication, measurement and controls that these authored records do not replace."
        }
      }
    ],
    "misconception": {
      "zh": "没有可见锈迹不等于没有任何氧化；不同等级不自动证明目标因素造成了差异；相同等级也不证明条件或原因相同。",
      "en": "No visible rust does not mean zero oxidation. Different grades do not automatically establish the target cause, and equal grades do not establish equal conditions or causes."
    },
    "mission": {
      "zh": "在模型中先选氧气与 A/B，第 1 天独立判断，再换第 5 天解释哪些条件没变、哪些观察变了。换到 A/F 找出混杂因素；用 A/D 说明为什么加盐不是本题生锈的必需条件。只分析给定记录。",
      "en": "Use oxygen and A/B: judge day one, then day five, explaining unchanged conditions and changed observations. Find the confounders in A/F, then use A/D to explain why salt is not necessary here. Analyse supplied records only."
    },
    "vocabulary": [
      {
        "en": "controlled comparison",
        "zh": "公平对照"
      },
      {
        "en": "confounding factor",
        "zh": "混杂因素"
      },
      {
        "en": "observation window",
        "zh": "观察窗口"
      },
      {
        "en": "ordinal grade",
        "zh": "有序等级"
      },
      {
        "en": "visible rust",
        "zh": "可见锈迹"
      }
    ],
    "interactive": "rust-comparison-evidence-lab",
    "resources": [
      {
        "title": {
          "zh": "拓展：生锈条件",
          "en": "Read more: conditions for rusting"
        },
        "url": "https://edu.rsc.org/experiments/what-causes-iron-to-rust/434.article"
      }
    ],
    "learning": {
      "prerequisites": [
        "why-metals-rust",
        "fair-comparisons-and-variables",
        "clues-before-reaction-verdict"
      ],
      "objectives": [
        {
          "zh": "找出两份记录中实际改变的因素。",
          "en": "Identify the factors that actually differ."
        },
        {
          "zh": "区分公平对照与当天是否出现可见差异。",
          "en": "Separate control quality from a daily visible difference."
        },
        {
          "zh": "限制对零等级、等级大小与观察时间的解释。",
          "en": "Keep zero grades, grade magnitudes and observation time within their evidence limits."
        }
      ],
      "workedExample": {
        "prompt": {
          "zh": "要比较氧气，A/B 第 1 天都为 0，第 5 天分别为 2 与 0。怎样解释？",
          "en": "For oxygen, A/B are both zero on day one and two/zero on day five. How should this be interpreted?"
        },
        "steps": [
          {
            "zh": "两份只改变可用氧气，符合本题目标对照。",
            "en": "Only available oxygen differs, isolating the specified target."
          },
          {
            "zh": "第 1 天未见可见差异，不等于氧气永远无影响。",
            "en": "No visible difference on day one does not prove oxygen has no effect forever."
          },
          {
            "zh": "第 5 天出现差异，可在题设与观察窗口内支持氧气处理的影响。",
            "en": "Day five shows a difference supporting the oxygen treatment within the exercise conditions and window."
          }
        ],
        "answer": {
          "zh": "对照一直公平，观察结果随记录日期不同而不同；不能用某一天替代所有时间。",
          "en": "The comparison remains controlled while recorded observations differ by day. One day does not stand in for all time."
        }
      },
      "quickChecks": [
        {
          "id": "rust-evidence-check-1",
          "prompt": {
            "zh": "A/B 第 1 天都为 0，能断言氧气没有影响吗？",
            "en": "Can zero/zero on day one establish no oxygen effect?"
          },
          "options": [
            {
              "zh": "能，因为 0 就是永远没有",
              "en": "Yes, zero means never"
            },
            {
              "zh": "能，两个数一样就证明条件相同",
              "en": "Yes, equal outcomes prove equal conditions"
            },
            {
              "zh": "不能，只说明当天未见差异",
              "en": "No, it only records no visible difference that day"
            }
          ],
          "answer": 2,
          "explanation": {
            "zh": "观察窗口与无限结论不同。",
            "en": "A finite window does not support an unlimited conclusion."
          },
          "conceptIds": [
            "finite-observation-window"
          ],
          "kind": "reasoning"
        },
        {
          "id": "rust-evidence-check-2",
          "prompt": {
            "zh": "要隔离加盐因素，哪组符合本题？",
            "en": "Which pair isolates salt in these records?"
          },
          "options": [
            {
              "zh": "A/D，其余列出条件相同",
              "en": "A/D, with other listed conditions held equal"
            },
            {
              "zh": "A/F，温度与面积同时变",
              "en": "A/F, changing temperature and area"
            },
            {
              "zh": "D/F，因为等级相同",
              "en": "D/F, because grades match"
            }
          ],
          "answer": 0,
          "explanation": {
            "zh": "先看改变条件，不只看结果。",
            "en": "Check conditions before looking only at outcomes."
          },
          "conceptIds": [
            "rust-control-target"
          ],
          "kind": "reasoning"
        },
        {
          "id": "rust-evidence-check-3",
          "prompt": {
            "zh": "等级 3 与等级 1 能直接读成三倍质量吗？",
            "en": "Does grade three mean three times grade one's mass?"
          },
          "options": [
            {
              "zh": "能，任何数字都能当质量",
              "en": "Yes, any number is a mass"
            },
            {
              "zh": "不能，这是有序等级",
              "en": "No, these are ordinal grades"
            },
            {
              "zh": "能，因为观察了三天",
              "en": "Yes, because three days were observed"
            }
          ],
          "answer": 1,
          "explanation": {
            "zh": "等级没有给定等距质量单位。",
            "en": "No equal-step mass unit was assigned."
          },
          "conceptIds": [
            "ordinal-not-rate"
          ],
          "kind": "reasoning"
        }
      ],
      "anotherWay": {
        "zh": "像在同一规则下比较两份记录：先检查条件，再看当天发生了什么，最后问证据允许说到多远。结果相同不能倒推出条件相同，结果不同也不能跳过控制。",
        "en": "Compare records in three stages: conditions, the day's observation, then the limits of inference. Equal outcomes do not prove equal conditions, and different outcomes do not remove the need for control."
      },
      "explainPrompt": {
        "zh": "不看选项，解释一组公平但当天没差异的对照，再解释一组有差异却不能归因给目标因素的记录。",
        "en": "Without options, explain one controlled pair with no visible difference yet, then one different-outcome pair that cannot isolate the target cause."
      }
    },
    "questions": [
      {
        "id": "rust-evidence-q1",
        "prompt": {
          "zh": "A/B 只改变氧气，第 1 天都为 0。哪条合理？",
          "en": "A/B differ only in oxygen and are zero/zero on day one. Which claim fits?"
        },
        "options": [
          {
            "zh": "氧气对任何时候都无影响",
            "en": "Oxygen never has an effect"
          },
          {
            "zh": "对照公平，但当天尚未见差异",
            "en": "Controlled, but no visible difference yet"
          },
          {
            "zh": "两个等级相同，所以不是公平对照",
            "en": "Equal grades make the comparison uncontrolled"
          }
        ],
        "answer": 1,
        "explanation": {
          "zh": "是否公平由条件决定，不由结果是否不同决定。",
          "en": "Conditions determine control quality, not whether outcomes differ."
        },
        "conceptIds": [
          "control-versus-outcome"
        ],
        "kind": "application"
      },
      {
        "id": "rust-evidence-q2",
        "prompt": {
          "zh": "要比较氧气处理，哪组最符合本题？",
          "en": "Which pair isolates the specified oxygen treatment?"
        },
        "options": [
          {
            "zh": "A/D，只改变加盐",
            "en": "A/D, changing salt"
          },
          {
            "zh": "B/C，同时改变水和氧气",
            "en": "B/C, changing water and oxygen"
          },
          {
            "zh": "A/B，只改变可用氧气",
            "en": "A/B, changing available oxygen"
          }
        ],
        "answer": 2,
        "explanation": {
          "zh": "所改变的唯一因素必须是正在研究的目标。",
          "en": "The sole changed factor must be the target being studied."
        },
        "conceptIds": [
          "rust-control-target"
        ],
        "kind": "application"
      },
      {
        "id": "rust-evidence-q3",
        "prompt": {
          "zh": "A 未加 NaCl，第 5 天仍有锈，能支持什么？",
          "en": "A has no added NaCl but has rust by day five. What follows?"
        },
        "options": [
          {
            "zh": "本题加盐不是生锈必需条件",
            "en": "Added salt is not necessary for rusting here"
          },
          {
            "zh": "所有盐对生锈都无影响",
            "en": "All salts have no effect"
          },
          {
            "zh": "未加 NaCl 就没有任何离子",
            "en": "No added NaCl means no ions"
          }
        ],
        "answer": 0,
        "explanation": {
          "zh": "促进因素与必需条件不能互相替代。",
          "en": "An accelerating factor differs from a necessary condition."
        },
        "conceptIds": [
          "salt-not-necessary"
        ],
        "kind": "application"
      },
      {
        "id": "rust-evidence-q4",
        "prompt": {
          "zh": "A/F 同时改变温度和铁表面积。能把差异单独归给温度吗？",
          "en": "A/F change both temperature and iron area. Can the difference be attributed to temperature alone?"
        },
        "options": [
          {
            "zh": "能，只要等级不同",
            "en": "Yes, if grades differ"
          },
          {
            "zh": "能，因为面积不是条件",
            "en": "Yes, area is not a condition"
          },
          {
            "zh": "不能，至少两个因素混杂",
            "en": "No, at least two factors are confounded"
          }
        ],
        "answer": 2,
        "explanation": {
          "zh": "需要匹配面积等其他条件后再比较目标因素。",
          "en": "Match area and other conditions before isolating temperature."
        },
        "conceptIds": [
          "rust-confounded-comparison"
        ],
        "kind": "application"
      },
      {
        "id": "rust-evidence-q5",
        "prompt": {
          "zh": "可见锈等级从 1 变 3，哪句话恰当？",
          "en": "Visible-rust grade changes from one to three. Which claim fits?"
        },
        "options": [
          {
            "zh": "精确速率增加三倍",
            "en": "Rate exactly triples"
          },
          {
            "zh": "等级更高，但不能由此报三倍质量或速率",
            "en": "A higher grade, without a threefold mass or rate claim"
          },
          {
            "zh": "等级差 2，因此可以报告固定的质量增量",
            "en": "A two-grade difference gives a fixed mass increase"
          }
        ],
        "answer": 1,
        "explanation": {
          "zh": "有序类别不提供质量或速率比例。",
          "en": "Ordinal categories do not supply mass or rate ratios."
        },
        "conceptIds": [
          "ordinal-not-rate"
        ],
        "kind": "reasoning"
      },
      {
        "id": "rust-evidence-q6",
        "prompt": {
          "zh": "为什么“水面上没有气泡”不足以证明没有氧气？",
          "en": "Why do no surface bubbles fail to prove the absence of oxygen?"
        },
        "options": [
          {
            "zh": "水中可以溶解 O₂，需相应除氧与隔绝补入条件",
            "en": "Water can contain dissolved O₂; appropriate exclusion and prevention of resupply are needed"
          },
          {
            "zh": "H₂O 中的 O 就等于所有溶解 O₂",
            "en": "O in H₂O is all the dissolved O₂"
          },
          {
            "zh": "氧气一定是橙色的",
            "en": "Oxygen must be orange"
          }
        ],
        "answer": 0,
        "explanation": {
          "zh": "溶解 O₂ 与水分子中的氧是不同物种。",
          "en": "Dissolved O₂ differs from oxygen bound within H₂O."
        },
        "conceptIds": [
          "dissolved-oxygen"
        ],
        "kind": "reasoning"
      }
    ]
  },
  {
    "id": "sacrificial-protection-needs-paths",
    "levelId": "metals",
    "order": 118,
    "title": {
      "zh": "旁边放一块锌，就能保护铁吗？",
      "en": "Does putting zinc nearby automatically protect iron?"
    },
    "eyebrow": {
      "zh": "金属衔接 2/2 · 两条通路与净电子方向",
      "en": "Metals bridge 2/2 · Two paths and net electron direction"
    },
    "hook": {
      "zh": "铁旁边有一块锌，两处都有含氧电解质，但金属导电连接断开。这就已经有牺牲保护了吗？换成铜又会怎样？",
      "en": "Zinc sits beside iron, both exposed to oxygenated electrolyte, but the metal connection is open. Is sacrificial protection established? What changes with copper?"
    },
    "hookHint": {
      "zh": "先找金属中的电子通路和电解质中的离子通路，再按给定氧化倾向判断净电子提供者。",
      "en": "Locate the electronic path through metal and the ionic path through electrolyte before applying the supplied oxidation tendencies."
    },
    "bigIdea": {
      "zh": "牺牲保护需要适当金属与完整耦合条件；金属通路和离子通路缺一，不能只凭位置靠近保证保护。",
      "en": "Sacrificial protection needs an appropriate metal and complete coupling conditions; proximity alone cannot replace either conduction path."
    },
    "estimatedMinutes": 19,
    "everydayExamples": [
      {
        "icon": "🔗",
        "title": {
          "zh": "靠近不是连通",
          "en": "Nearby is not connected"
        },
        "body": {
          "zh": "锌与铁虽相邻，断开的金属或电解质通路仍不能形成本图的可持续耦合供给。",
          "en": "Nearby zinc and iron do not form this sustained coupling supply if either the metal or electrolyte path is open."
        }
      },
      {
        "icon": "🧭",
        "title": {
          "zh": "换金属会换方向",
          "en": "Changing the metal changes direction"
        },
        "body": {
          "zh": "题设 Zn 比 Fe 易氧化、Fe 比 Cu 易氧化。两条通路都连通时，Zn/Fe 是锌供电子；Fe/Cu 则是铁供电子。",
          "en": "The exercise specifies Zn oxidises more readily than Fe and Fe more than Cu. With both paths connected, Zn supplies electrons in Zn/Fe, but Fe supplies them in Fe/Cu."
        }
      },
      {
        "icon": "🛡️",
        "title": {
          "zh": "屏障与牺牲是不同机制",
          "en": "Barrier and sacrifice differ"
        },
        "body": {
          "zh": "完整涂层可阻挡水和氧接触铁；牺牲保护则依赖耦合中的电子供给。不能因为一种机制失效，就把另一种当作自动成立。",
          "en": "An intact coating can block water and oxygen, while sacrificial protection relies on coupled electron supply. Failure of one mechanism does not automatically establish another."
        }
      }
    ],
    "steps": [
      {
        "title": {
          "zh": "把本题条件先说清",
          "en": "State the exercise conditions first"
        },
        "body": {
          "zh": "本图规定两金属表面可反应、金属足量，并暴露于给定中性含氧电解质；只比较 Fe/Zn 与 Fe/Cu。氧化倾向按题设 Zn、Fe、Cu 的顺序使用，不推成所有环境的万能排序。",
          "en": "This diagram specifies reactive surfaces, available metal and a given neutral oxygenated electrolyte, comparing only Fe/Zn and Fe/Cu. Use the supplied Zn–Fe–Cu oxidation order without treating it as a universal order for every environment."
        }
      },
      {
        "title": {
          "zh": "找两条不同载流通路",
          "en": "Locate two different charge-carrier paths"
        },
        "body": {
          "zh": "金属通路通过电子导电；电解质通路由离子移动传荷。两处都湿也不保证两块水膜连通。任一路断开，都不能维持本图的跨金属耦合电流；这不是说任何电子瞬时运动都不可能。",
          "en": "Metal conducts through electrons; electrolyte transfers charge through moving ions. Two wet sites need not have connected water films. An open path prevents this sustained cross-metal current, without ruling out every transient electron movement."
        }
      },
      {
        "title": {
          "zh": "通路相同，换金属后重判提供者",
          "en": "With the same paths, reassess the donor when metal changes"
        },
        "body": {
          "zh": "Zn/Fe 连通时，锌被氧化，净电子经金属通路到达铁表面的氧还原部位，降低铁的氧化倾向。换成 Cu，铁向铜表面氧还原部位供电子，铁的腐蚀风险增加。铜不是牺牲来保护铁。",
          "en": "In connected Zn/Fe, zinc oxidises and supplies net electrons toward oxygen reduction at the iron surface, suppressing iron oxidation. With Cu, iron supplies electrons toward oxygen reduction at copper and its corrosion risk increases. Copper is not sacrificially protecting iron."
        }
      },
      {
        "title": {
          "zh": "别把未耦合当作永不腐蚀",
          "en": "Uncoupled does not mean corrosion-proof"
        },
        "body": {
          "zh": "图中断开一条跨金属通路，不代表铁自身的局部腐蚀也被阻断。牺牲锌会消耗，真实效果还受表面、环境与维护影响；本图不计算电流、速率或寿命，也不把 Fe²⁺ 中间产物当作完整铁锈。",
          "en": "Opening one cross-metal path does not stop every local corrosion process on iron. Sacrificial zinc is consumed, and real performance depends on surfaces, environment and maintenance. This diagram gives no current, rate or lifetime and does not equate an Fe²⁺ intermediate with all rust."
        }
      }
    ],
    "misconception": {
      "zh": "锌不是隔空保护铁，电解质也不是电子导线。正确判断一条耦合路径断开，不能推出整个铁样永不生锈；铁获得耦合电子供给也不是把电子永远存住。",
      "en": "Zinc does not protect iron at a distance without coupling, and electrolyte is not an electron wire. An open coupling path does not prove rust-proof iron, nor does coupled electron supply mean indefinite electron storage."
    },
    "mission": {
      "zh": "先判断默认断开金属连接的 Zn/Fe 图，再连通两条通路，预测提供者并核对。保持通路不变换成 Cu，解释箭头为什么改变。最后分别断开两条通路，说明图没有证明什么。",
      "en": "Judge the default Zn/Fe diagram with an open metal link, then connect both paths and predict the donor. Keep paths fixed and change to Cu, explaining the reversed arrow. Open each path in turn and state what the diagram does not prove."
    },
    "vocabulary": [
      {
        "en": "sacrificial protection",
        "zh": "牺牲保护"
      },
      {
        "en": "electronic path",
        "zh": "电子导电通路"
      },
      {
        "en": "ionic path",
        "zh": "离子传荷通路"
      },
      {
        "en": "galvanic coupling",
        "zh": "电偶耦合"
      },
      {
        "en": "oxygen reduction",
        "zh": "氧还原"
      }
    ],
    "interactive": "galvanic-protection-path-lab",
    "resources": [
      {
        "title": {
          "zh": "拓展：腐蚀与阴极保护",
          "en": "Read more: corrosion and cathodic protection"
        },
        "url": "https://openstax.org/books/chemistry-2e/pages/17-6-corrosion"
      },
      {
        "title": {
          "zh": "拓展：接触金属与防锈",
          "en": "Read more: contacting metals and rust protection"
        },
        "url": "https://edu.rsc.org/experiments/preventing-rust/1763.article"
      }
    ],
    "learning": {
      "prerequisites": [
        "rust-controls-and-observation-window",
        "galvanising-sacrificial-protection",
        "metal-displacement-electron-story"
      ],
      "objectives": [
        {
          "zh": "分别指出金属电子通路与电解质离子通路。",
          "en": "Identify the metal electron path and electrolyte ion path separately."
        },
        {
          "zh": "按给定金属与完整通路预测净电子提供者。",
          "en": "Predict the net donor from the supplied metals and complete paths."
        },
        {
          "zh": "区分牺牲保护、屏障作用与未耦合。",
          "en": "Distinguish sacrifice, barrier action and an uncoupled state."
        }
      ],
      "workedExample": {
        "prompt": {
          "zh": "Zn/Fe 的金属通路断开、离子通路连通。能否仅因旁边有锌就宣布铁受牺牲保护？连上后再换 Cu 呢？",
          "en": "Zn/Fe has an open metal path and a connected ion path. Does nearby zinc establish sacrificial protection? What follows after connecting it and then substituting Cu?"
        },
        "steps": [
          {
            "zh": "先检查两条通路：金属断开时没有本图的可持续耦合供给。",
            "en": "Check both paths: an open metal route prevents this sustained coupling supply."
          },
          {
            "zh": "两条都连通后，按题设 Zn 易氧化，净电子由 Zn 传向 Fe 表面的氧还原部位。",
            "en": "With both connected, the supplied oxidation tendency makes Zn the donor toward oxygen reduction at Fe."
          },
          {
            "zh": "保持通路换成 Cu，提供者变为 Fe，不能把铜当作保护铁的牺牲金属。",
            "en": "With the same paths and Cu substituted, Fe becomes the donor; copper is not sacrificially protecting it."
          }
        ],
        "answer": {
          "zh": "保护取决于金属与通路条件，不只取决于旁边放了什么。未耦合也不排除铁自身局部腐蚀。",
          "en": "Protection depends on metal and pathway conditions, not proximity alone. Lack of coupling does not exclude local iron corrosion."
        }
      },
      "quickChecks": [
        {
          "id": "corrosion-path-check-1",
          "prompt": {
            "zh": "本图可持续耦合需要什么？",
            "en": "What does sustained coupling in this diagram require?"
          },
          "options": [
            {
              "zh": "只需两块金属靠近",
              "en": "Only nearby metals"
            },
            {
              "zh": "金属电子通路与电解质离子通路都连通",
              "en": "Both the metal electron path and electrolyte ion path"
            },
            {
              "zh": "只需同样颜色",
              "en": "Only matching colours"
            }
          ],
          "answer": 1,
          "explanation": {
            "zh": "两类载流通路不能互相替代。",
            "en": "The two carrier paths cannot replace one another."
          },
          "conceptIds": [
            "two-corrosion-paths"
          ],
          "kind": "reasoning"
        },
        {
          "id": "corrosion-path-check-2",
          "prompt": {
            "zh": "Fe/Cu 两条通路连通，题设净电子由谁提供？",
            "en": "For connected Fe/Cu, who supplies net electrons under the given conditions?"
          },
          "options": [
            {
              "zh": "Cu",
              "en": "Cu"
            },
            {
              "zh": "没有提供者",
              "en": "No donor"
            },
            {
              "zh": "Fe",
              "en": "Fe"
            }
          ],
          "answer": 2,
          "explanation": {
            "zh": "本题 Fe 比 Cu 易氧化，不是所有第二金属都保护铁。",
            "en": "Fe oxidises more readily than Cu here; not every companion protects iron."
          },
          "conceptIds": [
            "corrosion-donor-direction"
          ],
          "kind": "reasoning"
        },
        {
          "id": "corrosion-path-check-3",
          "prompt": {
            "zh": "跨金属通路断开，能证明铁永不生锈吗？",
            "en": "Does an open cross-metal path prove iron never rusts?"
          },
          "options": [
            {
              "zh": "不能，铁自身局部腐蚀仍可能发生",
              "en": "No, local iron corrosion can still occur"
            },
            {
              "zh": "能，所有氧化都停了",
              "en": "Yes, all oxidation stopped"
            },
            {
              "zh": "能，水也消失了",
              "en": "Yes, water vanished"
            }
          ],
          "answer": 0,
          "explanation": {
            "zh": "这张图只判断指定耦合路径。",
            "en": "The diagram audits only the specified coupling path."
          },
          "conceptIds": [
            "uncoupled-not-rustproof"
          ],
          "kind": "reasoning"
        }
      ],
      "anotherWay": {
        "zh": "把两条通路当成一个完整传荷圈：金属段由电子导电，水溶液段由离子传荷。只有圈连通还不够，谁更愿失电子也要按本题金属判断；这个类比不表示同一个电子绕水路跑一圈。",
        "en": "Think of a complete charge-transfer loop: electrons carry the metal section, ions carry the aqueous section. A closed loop still needs the supplied metal tendencies to identify the donor. This does not depict one electron travelling through water around the loop."
      },
      "explainPrompt": {
        "zh": "不看选项，用 Zn/Fe 与 Fe/Cu 各画一张简图，分别标出两条通路、净电子提供者，以及图没有预测的实际腐蚀信息。",
        "en": "Without options, sketch Zn/Fe and Fe/Cu, labelling both paths, the net donor and real corrosion information not predicted by the diagram."
      }
    },
    "questions": [
      {
        "id": "corrosion-path-q1",
        "prompt": {
          "zh": "锌靠近铁，离子通路连通但金属通路断开。哪项恰当？",
          "en": "Zinc is near iron; the ion path is connected but the metal path is open. Which claim fits?"
        },
        "options": [
          {
            "zh": "离子通路连通就够了，金属通路可以省略",
            "en": "An ion path alone is enough; the metal path is optional"
          },
          {
            "zh": "只要锌在附近，就能排除铁自身的局部腐蚀",
            "en": "Nearby zinc rules out local corrosion on iron"
          },
          {
            "zh": "没有本图可持续耦合供给，不能据此保证牺牲保护",
            "en": "This sustained coupling supply is absent; sacrificial protection is not established"
          }
        ],
        "answer": 2,
        "explanation": {
          "zh": "位置不能代替电子导电连接。",
          "en": "Proximity cannot replace electronic connection."
        },
        "conceptIds": [
          "two-corrosion-paths"
        ],
        "kind": "application"
      },
      {
        "id": "corrosion-path-q2",
        "prompt": {
          "zh": "Zn/Fe 两条通路都连通，题设净电子由谁提供？",
          "en": "With both Zn/Fe paths connected, who is the specified net donor?"
        },
        "options": [
          {
            "zh": "Zn",
            "en": "Zn"
          },
          {
            "zh": "Fe",
            "en": "Fe"
          },
          {
            "zh": "O₂ 沿金属线提供电子",
            "en": "O₂ supplies electrons along the metal wire"
          }
        ],
        "answer": 0,
        "explanation": {
          "zh": "锌在给定条件下优先氧化。",
          "en": "Zinc preferentially oxidises under the specified conditions."
        },
        "conceptIds": [
          "corrosion-donor-direction"
        ],
        "kind": "application"
      },
      {
        "id": "corrosion-path-q3",
        "prompt": {
          "zh": "把 Zn 换成 Cu，保持两条通路连通，铁会怎样？",
          "en": "Replace Zn with Cu while keeping both paths connected. What follows for iron?"
        },
        "options": [
          {
            "zh": "Cu 自动牺牲保护 Fe",
            "en": "Cu automatically sacrifices itself for Fe"
          },
          {
            "zh": "Fe 供电子，其腐蚀风险增加",
            "en": "Fe supplies electrons and its corrosion risk increases"
          },
          {
            "zh": "通路相同，所以提供者仍一定是第二块金属",
            "en": "The paths match, so the companion must still be the donor"
          }
        ],
        "answer": 1,
        "explanation": {
          "zh": "按给定氧化倾向，Fe/Cu 的提供者是 Fe。",
          "en": "The supplied tendency makes Fe the donor in Fe/Cu."
        },
        "conceptIds": [
          "companion-metal-matters"
        ],
        "kind": "application"
      },
      {
        "id": "corrosion-path-q4",
        "prompt": {
          "zh": "金属通路已连通，但两处电解质之间不连通。缺什么？",
          "en": "The metal path is connected but the electrolyte regions are disconnected. What is missing?"
        },
        "options": [
          {
            "zh": "没有缺少，两处分别湿润就表示离子通路连通",
            "en": "Nothing: two separate wet regions establish an ion path"
          },
          {
            "zh": "需要电子沿水路返回",
            "en": "Electrons must return through water"
          },
          {
            "zh": "离子传荷通路，不能用电子导线的想法代替",
            "en": "The ionic charge-transfer path, not an aqueous electron wire"
          }
        ],
        "answer": 2,
        "explanation": {
          "zh": "两段传荷使用不同载流粒子。",
          "en": "Different particles carry charge in the two sections."
        },
        "conceptIds": [
          "two-corrosion-paths"
        ],
        "kind": "application"
      },
      {
        "id": "corrosion-path-q5",
        "prompt": {
          "zh": "Zn 向 Fe 表面供给耦合电子后，怎样理解更准确？",
          "en": "What is the more accurate account of coupled electrons supplied from Zn toward Fe?"
        },
        "options": [
          {
            "zh": "Fe 永久储存所有电子",
            "en": "Fe stores all electrons forever"
          },
          {
            "zh": "电子供给表面氧还原消耗，不是 Zn 变 Fe",
            "en": "Electrons are consumed in surface oxygen reduction; Zn does not become Fe"
          },
          {
            "zh": "同一批电子经水溶液返回锌，完成整个圈",
            "en": "The same electrons return through the solution to zinc"
          }
        ],
        "answer": 1,
        "explanation": {
          "zh": "金属表面承载还原反应，不是无限存电子的仓库。",
          "en": "The surface supports reduction, not unlimited electron storage."
        },
        "conceptIds": [
          "cathodic-oxygen-reduction"
        ],
        "kind": "reasoning"
      },
      {
        "id": "corrosion-path-q6",
        "prompt": {
          "zh": "为什么牺牲保护不等于永久保证？",
          "en": "Why is sacrificial protection not a permanent guarantee?"
        },
        "options": [
          {
            "zh": "牺牲金属会消耗，连接、表面和环境仍需检查",
            "en": "Sacrificial metal is consumed; connections, surfaces and environment still need checking"
          },
          {
            "zh": "只要最初连通，之后锌是否耗尽都没有关系",
            "en": "Once connected initially, exhausting the zinc makes no difference"
          },
          {
            "zh": "锌与铁的大小之比能直接给出任何环境中的保护年数",
            "en": "Their size ratio directly gives a lifetime for any environment"
          }
        ],
        "answer": 0,
        "explanation": {
          "zh": "本图给机制与条件，不给工程寿命。",
          "en": "The diagram supplies a mechanism and conditions, not an engineering lifetime."
        },
        "conceptIds": [
          "protection-model-limits"
        ],
        "kind": "reasoning"
      }
    ]
  }
] satisfies Lesson[];

