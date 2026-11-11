import { t } from './schema';
export const regulationUnits = [
  {
    id: 'U15',
    stage: 'S03',
    title: t('大脑、神经与感官', 'Brain, nerves and senses'),
    question: t(
      '身体怎样把刺激变成有方向、有选择的响应？',
      'How does the body turn stimuli into directed, selective responses?',
    ),
    lessonIds: ['L057', 'L058', 'L059', 'L060'],
    missionTitle: t(
      '画出两种信息路线，并用对照验证。',
      'Build and compare two information routes.',
    ),
    missionPrompt: t(
      '先在L059搭好五站缩手路线，记录一次错误卡及修正理由；加入通向脑的信息支路。再在L060保留信使A，比较A受体与B受体细胞。画或写神经路线和内分泌路线：各标信号来源、运输方式、接收处与效应器/靶细胞。引用两次模型操作的具体记录，说明“到达”和“响应”为何不同；加一句英文与一个模型局限。可以完全在屏幕内完成，不测试热物、疼痛、强光或噪声。',
      'Build the five-station withdrawal route in L059 and record one rejected card with its correction, including the information branch to the brain. In L060, keep messenger A and compare A versus B receptors. Draw or describe neural and endocrine routes, labelling source, transport, receiver and effector/target. Cite specific records from both activities to distinguish arrival from response, then add an English sentence and one limitation. Entirely on-screen; no heat, pain, bright-light or noise tests.',
    ),
    claimLabel: t(
      '① 我的两条路线：信息从哪来、经过哪、谁响应？',
      '① My two routes: source, transport, receiver and response?',
    ),
  },
  {
    id: 'U16',
    stage: 'S03',
    title: t('保持身体稳定', 'Keeping internal conditions stable'),
    question: t(
      '偏高和偏低，怎样都能用负反馈解释？',
      'How can negative feedback explain both high and low deviations?',
    ),
    lessonIds: ['L061', 'L062', 'L063', 'L064'],
    missionTitle: t(
      '把两条稳态回路画成证据图。',
      'Build evidence maps for two homeostatic loops.',
    ),
    missionPrompt: t(
      '在L061分别记录向上/向下扰动的第2、3、6点，比较离50的偏差，明确这是任意模型单位。再从体温、血糖、水分中选一条回路，标“偏离→检测/整合→信号→效应器→抵消偏离”，用箭头区分信息和物质/热量。记录一个改变条件的对照，例如空气较湿如何影响蒸发，或ADH路线如何改变重吸收与尿量。写一句英文解释为何是负反馈、一条尚缺证据及模型边界。不测个人体温/血糖/尿液，不改变饮水或运动。',
      'Record L061 snapshots 2, 3 and 6 after upward/downward disturbances and compare deviations from 50, explicitly in arbitrary model units. Choose one thermal, glucose or water loop and label deviation → detection/integration → signal → effector → opposing deviation. Distinguish information from matter/heat arrows. Cite a changed-condition comparison, such as humidity affecting evaporation or ADH affecting reabsorption and urine volume. Add an English explanation of negative feedback, missing evidence and model limits. No personal temperature/glucose/urine tests, changed drinking or exercise.',
    ),
    claimLabel: t(
      '① 我的反馈图：哪个偏离、哪种响应、怎样抵消？',
      '① My feedback map: which deviation, response and opposition?',
    ),
  },
];
