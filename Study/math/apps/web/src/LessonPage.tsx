import { CountingHookArt, isCountingLab } from './CountingLabs';
import { SpaceVectorHookArt, isSpaceVectorLab } from './SpaceVectorLabs';
import { ConicHookArt, isConicLab } from './ConicLabs';
import { ComplexHookArt, isComplexLab } from './ComplexLabs';
import { DataModellingHookArt, isDataModellingLab } from './DataModellingLabs';
import { SequenceHookArt, isSequenceLab } from './SequenceLabs';
import { SolidHookArt, isSolidLab } from './SolidLabs';
import { ExponentialHookArt, isExponentialLab } from './ExponentialLabs';
import { VectorHookArt, isVectorLab } from './VectorLabs';
import { CircularHookArt, isCircularLab } from './CircularLabs';
import {
  FunctionConceptHookArt,
  isFunctionConceptLab,
} from './FunctionConceptLabs';
import { LogicHookArt, isLogicLab } from './LogicLabs';
import { IntegrationHookArt, isIntegrationLab } from './IntegrationLabs';
import { ProbabilityHookArt, isProbabilityLab } from './ProbabilityLabs';
import { useEffect, useState } from 'react';
import { Link, useParams, useSearchParams } from 'react-router-dom';
import { QuestionNavigator } from '@study/ui';
import { lessons, lessonById, unitChecks } from './content';
import { t, lessonOutcome, newSession, type Attempt } from './model';
import { Text, Markdown } from './ui';
import { HeroArt, Lab } from './Labs';
import { NumberHookArt, isNumberLab } from './NumberLabs';
import { DecimalHookArt, isDecimalLab } from './DecimalLabs';
import { FractionHookArt, isFractionLab } from './FractionLabs';
import { OperationHookArt, isOperationLab } from './OperationLabs';
import { AlgebraHookArt, isAlgebraLab } from './AlgebraLabs';
import { CircleHookArt, isCircleLab } from './CircleLabs';
import { ChanceHookArt, isChanceLab } from './ChanceLabs';
import { AppliedHookArt, isAppliedLab } from './AppliedLabs';
import { RationalHookArt, isRationalLab } from './RationalLabs';
import { PolynomialHookArt, isPolynomialLab } from './PolynomialLabs';
import { LinearHookArt, isLinearLab } from './LinearLabs';
import { PlaneHookArt, isPlaneLab } from './PlaneLabs';
import { CartesianHookArt, isCartesianLab } from './CartesianLabs';
import { SystemHookArt, isSystemLab } from './SystemLabs';
import { FunctionHookArt, isFunctionLab } from './FunctionLabs';
import { TrigHookArt, isTrigLab } from './TrigLabs';
import {
  CircleGeometryHookArt,
  isCircleGeometryLab,
} from './CircleGeometryLabs';
import { SimilarityHookArt, isSimilarityLab } from './SimilarityLabs';
import { ParabolaHookArt, isParabolaLab } from './ParabolaLabs';
import { QuadraticHookArt, isQuadraticLab } from './QuadraticLabs';
import { RadicalHookArt, isRadicalLab } from './RadicalLabs';
import { ResearchHookArt, isResearchLab } from './ResearchLabs';
import { PythagoreanHookArt, isPythagoreanLab } from './PythagoreanLabs';
import { CongruenceHookArt, isCongruenceLab } from './CongruenceLabs';
import { InequalityHookArt, isInequalityLab } from './InequalityLabs';
import { FactorHookArt, isFactorLab } from './FactorLabs';
import { IdentityHookArt, isIdentityLab } from './IdentityLabs';
import { InferenceHookArt, isInferenceLab } from './InferenceLabs';
import { CalculationHookArt, isCalculationLab } from './CalculationLabs';
import { MeasurementHookArt, isMeasurementLab } from './MeasurementLabs';
import { ProblemHookArt, isProblemLab } from './ProblemLabs';
import { IntegerHookArt, isIntegerLab } from './IntegerLabs';
import {
  FractionOperationHookArt,
  isFractionOperationLab,
} from './FractionOperationLabs';
import { EquationHookArt, isEquationLab } from './EquationLabs';
import { GeometryHookArt, isGeometryLab } from './GeometryLabs';
import { DataHookArt, isDataLab } from './DataLabs';
import { PercentHookArt, isPercentLab } from './PercentLabs';
import { RatioHookArt, isRatioLab } from './RatioLabs';
import { SignedHookArt, isSignedLab } from './SignedLabs';
import {
  FractionProductHookArt,
  isFractionProductLab,
} from './FractionProductLabs';
import { Question } from './Question';
import { Intro, words, statuses, stepLabels, type Props } from './pageSupport';
const markdown = import.meta.glob('../../../content/lessons/*.md', {
  query: '?raw',
  import: 'default',
  eager: true,
}) as Record<string, string>;
export function LessonPage(props: Props) {
  const { lessonId } = useParams();
  const l = lessonById(lessonId);
  return l ? (
    <LessonWorkspace key={l.id} lessonId={l.id} {...props} />
  ) : (
    <>
      <Intro
        mode={props.mode}
        kicker="COMING LATER"
        title={t('这节课还在准备中。', 'This lesson is being prepared.')}
        body={t(
          `先试试已开放的 ${lessons.length} 节课。`,
          `Try one of the ${lessons.length} available lessons.`,
        )}
      />
      <Link className="math-button" to="/math">
        <Text mode={props.mode} text={t('回到探索首页', 'Back to Discover')} />
      </Link>
    </>
  );
}
function LessonWorkspace({
  lessonId,
  mode,
  store,
}: Props & { lessonId: string }) {
  const l = lessonById(lessonId)!,
    s = store.progress.sessions[l.id] ?? newSession();
  const [params, setParams] = useSearchParams();
  const update = store.update;
  useEffect(() => {
    if (params.get('step') !== '1') return;
    update(l.id, (old) => ({ ...old, step: 1 }));
    const nextParams = new URLSearchParams(params);
    nextParams.delete('step');
    setParams(nextParams, { replace: true });
  }, [l.id, params, setParams, update]);
  const [index, setIndex] = useState(
    Math.min(s.practiceIndex ?? 0, l.questions.length - 1),
  );
  const setAnswer = (id: string, a: Attempt) =>
    update(l.id, (old) => ({ ...old, answers: { ...old.answers, [id]: a } }));
  const outcome = lessonOutcome(l, s);
  const next = lessons[lessons.indexOf(l) + 1];
  const finish = () =>
    update(l.id, (old) => ({
      ...old,
      completedAt: new Date().toISOString(),
      nextReview: new Date(Date.now() + 3 * 86400000).toISOString(),
    }));
  return (
    <>
      <Link className="math-back" to="/math">
        ← <Text mode={mode} text={t('回到探索首页', 'Back to Discover')} />
      </Link>
      <div className="math-lesson-heading">
        <div>
          <span className="math-eyebrow">
            {l.id} / {l.unit ?? l.id.split('-')[0]}
          </span>
          <h1>
            <Text mode={mode} text={l.title} />
          </h1>
          <p>
            <Text mode={mode} text={l.objective} />
          </p>
        </div>
        <span className="math-badge">
          <Text
            mode={mode}
            text={t(`约 ${l.minutes} 分钟`, `${l.minutes} MIN`)}
          />
        </span>
      </div>
      <div
        className="math-steps"
        role="group"
        aria-label={words(mode, '学习步骤', 'Lesson steps')}
      >
        {stepLabels.map((label, i) => (
          <button
            key={i}
            aria-pressed={s.step === i}
            onClick={() => update(l.id, (old) => ({ ...old, step: i }))}
          >
            <b>{String(i + 1).padStart(2, '0')}</b>
            <Text mode={mode} text={label} />
          </button>
        ))}
      </div>
      <div className="math-learning-grid">
        <div className="math-learning-main">
          {s.step === 0 && (
            <section className="math-panel math-hook">
              <span className="math-eyebrow">01 / WONDER</span>
              <h2>
                <Text
                  mode={mode}
                  text={t(
                    '先别急着算，猜一猜。',
                    'Before calculating, make a prediction.',
                  )}
                />
              </h2>
              <p>
                <Text mode={mode} text={l.hook} />
              </p>
              {isCountingLab(l.lab) ? (
                <CountingHookArt kind={l.lab} mode={mode} />
              ) : isSpaceVectorLab(l.lab) ? (
                <SpaceVectorHookArt kind={l.lab} mode={mode} />
              ) : isConicLab(l.lab) ? (
                <ConicHookArt kind={l.lab} mode={mode} />
              ) : isComplexLab(l.lab) ? (
                <ComplexHookArt kind={l.lab} mode={mode} />
              ) : isDataModellingLab(l.lab) ? (
                <DataModellingHookArt kind={l.lab} mode={mode} />
              ) : isSequenceLab(l.lab) ? (
                <SequenceHookArt kind={l.lab} mode={mode} />
              ) : isSolidLab(l.lab) ? (
                <SolidHookArt kind={l.lab} mode={mode} />
              ) : isVectorLab(l.lab) ? (
                <VectorHookArt kind={l.lab} mode={mode} />
              ) : isCircularLab(l.lab) ? (
                <CircularHookArt kind={l.lab} mode={mode} />
              ) : isExponentialLab(l.lab) ? (
                <ExponentialHookArt kind={l.lab} mode={mode} />
              ) : isFunctionConceptLab(l.lab) ? (
                <FunctionConceptHookArt kind={l.lab} mode={mode} />
              ) : isLogicLab(l.lab) ? (
                <LogicHookArt kind={l.lab} mode={mode} />
              ) : isIntegrationLab(l.lab) ? (
                <IntegrationHookArt kind={l.lab} mode={mode} />
              ) : isProbabilityLab(l.lab) ? (
                <ProbabilityHookArt kind={l.lab} mode={mode} />
              ) : isTrigLab(l.lab) ? (
                <TrigHookArt kind={l.lab} mode={mode} />
              ) : isCircleGeometryLab(l.lab) ? (
                <CircleGeometryHookArt kind={l.lab} mode={mode} />
              ) : isSimilarityLab(l.lab) ? (
                <SimilarityHookArt kind={l.lab} mode={mode} />
              ) : isParabolaLab(l.lab) ? (
                <ParabolaHookArt kind={l.lab} mode={mode} />
              ) : isQuadraticLab(l.lab) ? (
                <QuadraticHookArt kind={l.lab} mode={mode} />
              ) : isRadicalLab(l.lab) ? (
                <RadicalHookArt kind={l.lab} mode={mode} />
              ) : isResearchLab(l.lab) ? (
                <ResearchHookArt kind={l.lab} mode={mode} />
              ) : isPythagoreanLab(l.lab) ? (
                <PythagoreanHookArt kind={l.lab} mode={mode} />
              ) : isCongruenceLab(l.lab) ? (
                <CongruenceHookArt kind={l.lab} mode={mode} />
              ) : isFunctionLab(l.lab) ? (
                <FunctionHookArt kind={l.lab} mode={mode} />
              ) : isInequalityLab(l.lab) ? (
                <InequalityHookArt kind={l.lab} mode={mode} />
              ) : isSystemLab(l.lab) ? (
                <SystemHookArt kind={l.lab} mode={mode} />
              ) : isFactorLab(l.lab) ? (
                <FactorHookArt kind={l.lab} mode={mode} />
              ) : isIdentityLab(l.lab) ? (
                <IdentityHookArt kind={l.lab} mode={mode} />
              ) : isInferenceLab(l.lab) ? (
                <InferenceHookArt kind={l.lab} mode={mode} />
              ) : isCartesianLab(l.lab) ? (
                <CartesianHookArt kind={l.lab} mode={mode} />
              ) : isPlaneLab(l.lab) ? (
                <PlaneHookArt kind={l.lab} mode={mode} />
              ) : isLinearLab(l.lab) ? (
                <LinearHookArt kind={l.lab} mode={mode} />
              ) : isPolynomialLab(l.lab) ? (
                <PolynomialHookArt kind={l.lab} mode={mode} />
              ) : isRationalLab(l.lab) ? (
                <RationalHookArt kind={l.lab} mode={mode} />
              ) : isAppliedLab(l.lab) ? (
                <AppliedHookArt kind={l.lab} mode={mode} />
              ) : isChanceLab(l.lab) ? (
                <ChanceHookArt kind={l.lab} mode={mode} />
              ) : isCircleLab(l.lab) ? (
                <CircleHookArt kind={l.lab} mode={mode} />
              ) : isAlgebraLab(l.lab) ? (
                <AlgebraHookArt kind={l.lab} mode={mode} />
              ) : isSignedLab(l.lab) ? (
                <SignedHookArt kind={l.lab} mode={mode} />
              ) : isRatioLab(l.lab) ? (
                <RatioHookArt kind={l.lab} mode={mode} />
              ) : isPercentLab(l.lab) ? (
                <PercentHookArt kind={l.lab} mode={mode} />
              ) : isFractionProductLab(l.lab) ? (
                <FractionProductHookArt kind={l.lab} mode={mode} />
              ) : isDataLab(l.lab) ? (
                <DataHookArt kind={l.lab} mode={mode} />
              ) : isNumberLab(l.lab) ? (
                <NumberHookArt kind={l.lab} mode={mode} />
              ) : isDecimalLab(l.lab) ? (
                <DecimalHookArt kind={l.lab} mode={mode} />
              ) : isGeometryLab(l.lab) ? (
                <GeometryHookArt kind={l.lab} mode={mode} />
              ) : isEquationLab(l.lab) ? (
                <EquationHookArt kind={l.lab} mode={mode} />
              ) : isFractionOperationLab(l.lab) ? (
                <FractionOperationHookArt kind={l.lab} mode={mode} />
              ) : isFractionLab(l.lab) ? (
                <FractionHookArt kind={l.lab} mode={mode} />
              ) : isOperationLab(l.lab) ? (
                <OperationHookArt kind={l.lab} mode={mode} />
              ) : isCalculationLab(l.lab) ? (
                <CalculationHookArt kind={l.lab} mode={mode} />
              ) : isMeasurementLab(l.lab) ? (
                <MeasurementHookArt kind={l.lab} mode={mode} />
              ) : isProblemLab(l.lab) ? (
                <ProblemHookArt kind={l.lab} mode={mode} />
              ) : isIntegerLab(l.lab) ? (
                <IntegerHookArt kind={l.lab} mode={mode} />
              ) : (
                <HeroArt />
              )}
              <p className="math-muted">
                <Text
                  mode={mode}
                  text={t(
                    '可以说出来，写在纸上，或画一张图。接下来用模型验证。',
                    'Say it aloud, write on paper, or sketch a diagram. Next, test with a model.',
                  )}
                />
              </p>
            </section>
          )}
          {s.step === 1 && <Lab key={l.lab} kind={l.lab} mode={mode} />}
          {s.step === 2 && (
            <section className="math-panel">
              <Markdown
                mode={mode}
                source={markdown[`../../../content/lessons/${l.id}.md`] ?? ''}
              />
            </section>
          )}
          {s.step === 3 && (
            <section className="math-panel">
              <Question
                question={l.guided}
                mode={mode}
                attempt={s.answers[l.guided.id]}
                onChange={(a) => setAnswer(l.guided.id, a)}
              />
            </section>
          )}
          {s.step === 4 && (
            <section className="math-panel">
              <QuestionNavigator
                mode={mode}
                index={index}
                count={l.questions.length}
                onChange={(i) => {
                  setIndex(i);
                  update(l.id, (old) => ({ ...old, practiceIndex: i }));
                }}
              />
              <Question
                key={l.questions[index]!.id}
                question={l.questions[index]!}
                mode={mode}
                attempt={s.answers[l.questions[index]!.id]}
                onChange={(a) => setAnswer(l.questions[index]!.id, a)}
              />
              <div className="math-practice-summary">
                <Text
                  mode={mode}
                  text={t(
                    `${l.questions.filter((q) => s.answers[q.id]?.correct).length} / ${l.questions.length} 题已完成；可以来回切换，答案会保留。`,
                    `${l.questions.filter((q) => s.answers[q.id]?.correct).length} / ${l.questions.length} completed. Move between questions; answers stay saved.`,
                  )}
                />
              </div>
            </section>
          )}
          {s.step === 5 && (
            <section className="math-panel">
              <Question
                question={l.exit}
                mode={mode}
                attempt={s.answers[l.exit.id]}
                onChange={(a) => setAnswer(l.exit.id, a)}
                exit
              />
              <label className="math-answer">
                <span>
                  <Text mode={mode} text={l.exitReason} />
                </span>
                <textarea
                  rows={3}
                  aria-label={words(
                    mode,
                    '出口题解释',
                    'Exit-ticket reasoning',
                  )}
                  value={s.explanation}
                  onChange={(e) =>
                    update(l.id, (old) => ({
                      ...old,
                      explanation: e.target.value,
                      parentChecked: false,
                    }))
                  }
                />
              </label>
              <label className="math-checkbox">
                <input
                  type="checkbox"
                  checked={s.parentChecked}
                  disabled={!s.explanation.trim()}
                  onChange={(e) =>
                    update(l.id, (old) => ({
                      ...old,
                      parentChecked: e.target.checked,
                    }))
                  }
                />
                <Text
                  mode={mode}
                  text={t(
                    '家长确认：孩子能用自己的话或图说明原因。',
                    'Parent confirms: the learner can explain why in their own words or a diagram.',
                  )}
                />
              </label>
              <button
                className="math-button"
                disabled={
                  !s.explanation.trim() || !s.answers[l.exit.id]?.correct
                }
                onClick={finish}
              >
                <Text
                  mode={mode}
                  text={t('保存这次发现', 'Save this discovery')}
                />{' '}
                ✦
              </button>
              {s.completedAt && (
                <div className="math-completion" role="status">
                  <h3>
                    <Text mode={mode} text={statuses[outcome]} />
                  </h3>
                  <p>
                    <Text
                      mode={mode}
                      text={
                        outcome === 'ready_to_progress'
                          ? t(
                              '代表性题目与出口题已独立完成，解释已经家长核对。可以继续，也可以留在这里玩一会儿。',
                              'Representative practice and the exit ticket were completed independently, with reasoning reviewed. Continue or explore a little more.',
                            )
                          : t(
                              '学习记录已保存。再练习尚未独立完成的题，或让家长核对解释，理解会更稳。',
                              'Your learning record is saved. Revisit questions needing support or ask a parent to review your reasoning.',
                            )
                      }
                    />
                  </p>
                  {next && (
                    <Link
                      className="math-button secondary"
                      to={`/math/lesson/${next.id}`}
                    >
                      <Text
                        mode={mode}
                        text={t('探索下一课', 'Explore the next lesson')}
                      />{' '}
                      →
                    </Link>
                  )}
                  <Link className="math-button secondary" to="/math/parent">
                    <Text
                      mode={mode}
                      text={t('查看学习记录', 'View learning records')}
                    />
                  </Link>
                </div>
              )}
            </section>
          )}
          {s.step === 5 && l.familyChallenge && (
            <section className="math-family-challenge">
              <h4>
                <Text
                  mode={mode}
                  text={t('家庭数学挑战', 'Family maths challenge')}
                />
              </h4>
              <p>
                <Text mode={mode} text={l.familyChallenge} />
              </p>
              {l.unit && l.unit in unitChecks && (
                <Link to={`/math/unit/${l.unit}/check`}>
                  <Text
                    mode={mode}
                    text={t(
                      '准备好时，做一次单元小回顾',
                      'When ready, try the small unit review',
                    )}
                  />{' '}
                  ↗
                </Link>
              )}
            </section>
          )}
          <div className="math-step-footer">
            <button
              className="math-button secondary"
              disabled={s.step === 0}
              onClick={() =>
                update(l.id, (old) => ({ ...old, step: old.step - 1 }))
              }
            >
              ← <Text mode={mode} text={t('上一步', 'Previous')} />
            </button>
            {s.step < 5 && (
              <button
                className="math-button"
                onClick={() =>
                  update(l.id, (old) => ({ ...old, step: old.step + 1 }))
                }
              >
                <Text mode={mode} text={stepLabels[s.step + 1]!} /> →
              </button>
            )}
          </div>
        </div>
        <aside className="math-lesson-aside">
          <section className="math-aside-card">
            <span className="math-eyebrow">
              <Text
                mode={mode}
                text={t('这一课，真正要懂的', 'THE IDEA TO TAKE AWAY')}
              />
            </span>
            <p>
              <Text mode={mode} text={l.objective} />
            </p>
            <div className="math-keywords">
              {l.keywords.map((k) => (
                <span key={k.en}>
                  <Text mode={mode} text={k} />
                </span>
              ))}
            </div>
          </section>
          {l.prerequisites.length > 0 && (
            <section className="math-aside-card">
              <h4>
                <Text
                  mode={mode}
                  text={t('需要时，回头看看', 'A useful starting point')}
                />
              </h4>
              {l.prerequisites.map((id) => (
                <Link
                  key={id}
                  className="math-prerequisite"
                  to={`/math/lesson/${id}`}
                >
                  <Text mode={mode} text={lessonById(id)!.title} /> ↗
                </Link>
              ))}
            </section>
          )}
          <details className="math-aside-card">
            <summary>
              <Text
                mode={mode}
                text={t('家长陪学小卡', 'A small guide for parents')}
              />
            </summary>
            <h4>
              <Text mode={mode} text={t('真正要懂', 'The core idea')} />
            </h4>
            <p>
              <Text mode={mode} text={l.parent.goal} />
            </p>
            <h4>
              <Text
                mode={mode}
                text={t('容易误解', 'A common misconception')}
              />
            </h4>
            <p>
              <Text mode={mode} text={l.parent.misconception} />
            </p>
            <h4>
              <Text mode={mode} text={t('可以这样问', 'Try asking')} />
            </h4>
            {l.parent.prompts.map((p) => (
              <p key={p.en}>
                “<Text mode={mode} text={p} />”
              </p>
            ))}
            <Link
              className="math-prerequisite"
              to={`/math/lesson/${l.parent.bridge}`}
            >
              <Text mode={mode} text={t('不会时回到', 'If stuck, revisit')} />{' '}
              {l.parent.bridge} ↗
            </Link>
          </details>
          <label className="math-aside-card math-answer">
            <span>
              <Text mode={mode} text={t('我的发现便签', 'My discovery note')} />
            </span>
            <textarea
              aria-label={words(mode, '发现便签', 'Discovery note')}
              rows={4}
              value={s.note}
              onChange={(e) =>
                update(l.id, (old) => ({ ...old, note: e.target.value }))
              }
            />
          </label>
          <button
            className="math-button secondary"
            onClick={() => {
              update(l.id, () => newSession());
              store.setProgress((old) => ({
                ...old,
                reviews: { ...old.reviews, [l.id]: { input: '', tries: 0 } },
              }));
              setIndex(0);
            }}
          >
            <Text
              mode={mode}
              text={t(
                '重新探索本课（重置本课记录）',
                'Start this lesson again (reset its record)',
              )}
            />
          </button>
        </aside>
      </div>
    </>
  );
}
