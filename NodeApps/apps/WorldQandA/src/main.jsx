import { Bot, Compass, PenLine, Sparkles, Telescope } from 'lucide-react';
import QuestionWorkbench from '../../BeliefQandA/src/main.jsx';
import { worldQuestionApi } from './api.js';

const WORLD_QA_CONFIG = {
  route: 'world-qa',
  name: 'World Q&A',
  BrandIcon: Compass,
  bootMessage: '正在展开世界地图…',
  loadingAnswerMessage: '正在读取这道题的思考稿…',
  footer: '从问题出发，识别结构、激励与长期变化，慢慢建立自己的世界模型。',
  layers: [
    { id: 'personal', number: '01', label: '我的理解', description: '留下你自己的判断、观察和表达方式。', Icon: PenLine, tone: 'amber' },
    { id: 'brief', number: '02', label: 'AI 的简明回答', description: '先抓住核心结构，形成可复述的基本理解。', Icon: Bot, tone: 'violet' },
    { id: 'detailed', number: '03', label: 'AI 的系统回答', description: '补足机制、背景、案例与重要分歧。', Icon: Sparkles, tone: 'blue' },
    { id: 'explore', number: '04', label: '延伸探讨', description: '继续进入张力、反例和值得追问的地方。', Icon: Telescope, tone: 'rose' },
  ],
  briefLength: null,
};

export default function WorldQA() {
  return <QuestionWorkbench config={WORLD_QA_CONFIG} api={worldQuestionApi} />;
}
