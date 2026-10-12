import type { Lesson } from './schema';
import { makeWaveLesson } from './waveLessonFactory';
const make = (d: Parameters<typeof makeWaveLesson>[0]) =>
  makeWaveLesson(d, 'optics');
export const imagingLessons: Lesson[] = [
  make({
    kind: 'imaging-convex',
    id: 'imaging-one-lens-two-kinds-of-image',
    minutes: 24,
    title: [
      '放大镜能放大，为什么也能把像投到纸上？',
      'How can a magnifier also project an image onto paper?',
    ],
    subtitle: [
      '先移动物体，再决定是实像还是虚像。',
      'Move the object before deciding whether the image is real or virtual.',
    ],
    hook: [
      '把放大镜贴近书上的字，字变大；把台灯的图案通过透镜投到纸上，像又可能倒过来。同一片玻璃没有换功能，是物体相对焦点的位置改变了。',
      'A magnifier close to print makes letters larger. Project a lamp pattern through it and the image may be inverted. The same glass behaves differently because the object moves relative to the focus.',
    ],
    prediction: [
      '物体进入凸透镜焦点以内，后方纸屏能接到清晰放大的像吗？',
      'If an object is inside a converging lens’s focus, can a screen behind catch a sharp enlarged image?',
    ],
    predictions: [
      [
        '可以，所有放大像都能投影',
        'Yes; every enlarged image can be projected',
      ],
      [
        '不能，出射线发散，像是虚像',
        'No; outgoing rays diverge and the image is virtual',
      ],
      ['只有把屏幕翻面才可以', 'Only if the screen is turned over'],
    ],
    explore: [
      '比较物距30、20、8 cm，焦距固定10 cm。从同一物点画出的光线，有时在右侧实线交会，有时只在向后的虚线处交会。再把物距调到10 cm：观察出射线平行，像距不再给有限数字。',
      'Compare objects at 30, 20 and 8 cm with f=10 cm. Rays from one point sometimes meet on the right; sometimes only backward extensions meet. Set u=10 cm: output becomes parallel and image distance has no finite value.',
    ],
    concept: [
      '在空气中，普通玻璃凸透镜可使近轴平行光会聚。有限物体在焦点外时，出射光线真实相交，纸屏放在交会平面能接像；焦点内时出射发散，眼睛向后追踪方向，看见正立虚像。薄透镜把两次折射等效为一次斜率改变；不是光被吸到中心。',
      'An ordinary glass converging lens in air brings paraxial parallel rays together. For an object outside focus, real rays meet and a screen at that plane can receive an image. Inside focus, rays diverge and backward directions locate an upright virtual image. A thin lens replaces two refractions with one slope change; light is not pulled toward the centre.',
    ],
    example: [
      'f=10 cm：u=30给v=15 cm、M=−0.5；u=20给v=20 cm、M=−1；u=8给v=−40 cm、M=5。负像距指向物侧，不是负的路程。在u=f时没有有限像，不能把读数写成0 cm。',
      'For f=10 cm: u=30 gives v=15 cm and M=−0.5; u=20 gives v=20 cm and M=−1; u=8 gives v=−40 cm and M=5. Negative image distance denotes the object side, not negative travel. At u=f there is no finite image, rather than an image at zero.',
    ],
    misconception: [
      '“凸透镜总会给缩小倒像”把相机的一种工作条件当成了全部情况。正立与倒立、放大与缩小、实像与虚像要分别根据光路判断。',
      'A camera’s smaller inverted image is one condition, not every converging-lens result. Judge orientation, size and real or virtual character separately from the rays.',
    ],
    realWorld: [
      '投影仪要把实像落到屏幕；看细字的放大镜让眼睛接收发散光，看到虚像。两者都能放大，接收方式却不同。',
      'A projector places a real image on a screen. A reading magnifier sends diverging light to the eye for a virtual image. Both can enlarge, with different receiving arrangements.',
    ],
    summary: [
      '先找焦点，再看真实光线在哪里交会。',
      'Locate focus first, then see where actual rays meet.',
    ],
    homeExperiment: [
      '用放大镜和白纸寻找室内灯具或窗外建筑的投影；只用普通室内光，不对太阳。记下哪些位置能在纸上接像，再近看书中字，比较两种观看方式。',
      'Use a magnifier and paper to find an image of an indoor lamp or outdoor building, avoiding the Sun. Record where paper receives an image, then view nearby print and compare the two arrangements.',
    ],
    vocabulary: [
      ['凸透镜', 'converging lens'],
      ['焦距', 'focal length'],
      ['实像', 'real image'],
      ['虚像', 'virtual image'],
    ],
    formula: [
      '焦点外可得实像；焦点内得虚像；u=f无有限像',
      'Outside focus: real; inside: virtual; u=f: no finite image',
    ],
    questions: [
      [
        'u=8 cm、f=10 cm，像在哪里？',
        'With u=8 cm and f=10 cm, where is the image?',
        [
          ['透镜右侧实线交点', 'Right-side real crossing'],
          ['物侧延长线交点', 'Object-side extension crossing'],
          ['透镜中心', 'Lens centre'],
        ],
        1,
        '它是物侧正立虚像。',
        'It is an upright virtual image on the object side.',
      ],
      [
        '纸屏接到清晰像，说明什么？',
        'What does a sharp image received on paper show?',
        [
          ['真实光线在该平面汇合', 'Actual rays meet at that plane'],
          ['光只能沿两条线传播', 'Only two rays exist'],
          ['人眼制造了实像', 'The eye created the real image'],
        ],
        0,
        '屏幕接收真实到达的光。',
        'The screen receives light arriving there.',
      ],
      [
        '物体正好在焦点，像距该怎样表示？',
        'How is image distance represented at focus?',
        [
          ['0 cm', '0 cm'],
          ['固定20 cm', 'A fixed 20 cm'],
          ['无有限值，出射平行', 'No finite value; parallel output'],
        ],
        2,
        '不要把无穷远替换成零。',
        'Do not replace infinity with zero.',
      ],
    ],
    exit: [
      '想把透镜当投影器，先检查什么？',
      'To use a lens as a projector, what should you check first?',
      [
        [
          '物体是否在焦点外，并找真实交会面',
          'Whether object is outside focus and where rays meet',
        ],
        ['只看玻璃是否透明', 'Only whether glass is transparent'],
        ['所有像都放到同一纸屏位置', 'Put every image at one screen position'],
      ],
      0,
      '先判断像的性质与位置。',
      'Determine image type and position first.',
    ],
  }),
  make({
    kind: 'imaging-concave',
    id: 'imaging-diverging-light-a-visible-image',
    minutes: 24,
    title: [
      '光线越走越散，为什么凹透镜里仍能看见像？',
      'Why can you see an image through a lens whose rays spread apart?',
    ],
    subtitle: [
      '追踪真实方向，再定位正立缩小的虚像。',
      'Trace real directions to locate a smaller upright virtual image.',
    ],
    hook: [
      '透过一片凹透镜看一支铅笔，它似乎变小了。光没有在玻璃后汇成一个小铅笔：眼睛接收发散光，再根据方向把物点定位在透镜前。',
      'A pencil viewed through a diverging lens looks smaller. Light does not gather into a small pencil behind the glass: the eye receives diverging rays and infers a point in front.',
    ],
    prediction: [
      '出射光发散，是否说明“没有像，所以眼睛什么也看不见”？',
      'Does diverging output mean there is no image and nothing can be seen?',
    ],
    predictions: [
      ['是，眼睛只能看实像', 'Yes; eyes see only real images'],
      ['纸屏总能接虚像', 'A screen can always catch a virtual image'],
      [
        '否，出射方向可以给出虚像',
        'No; outgoing directions can locate a virtual image',
      ],
    ],
    explore: [
      '比较真实物体在30、20、8 cm，焦距为−10 cm。读负像距与正倍率；真实光线始终向右离开，紫虚线往左回看。自由改变物距，检验虚像是否总在物体与透镜之间。',
      'Compare real objects at 30, 20 and 8 cm with f=−10 cm. Read negative image distance and positive M. Real rays leave to the right; purple extensions look left. Change u and test whether the image remains between object and lens.',
    ],
    concept: [
      '凹透镜在空气中把近轴平行光发散，出射线的反向延长通过入射侧虚焦点，所以f取负。对真实物体，本模型给正立、缩小、物侧虚像。虚像表示光路方向的定位，并不要求真实光线先跑到虚像处再转回来。',
      'A diverging lens in air spreads paraxial parallel rays; their backward extensions pass through an incident-side virtual focus, so f is negative. A real object gives an upright smaller virtual image. A virtual location describes outgoing directions; real light does not visit it and return.',
    ],
    example: [
      'u=30、f=−10 cm，v=−7.5 cm、M=0.25；u=20时v≈−6.667 cm、M≈0.333；u=8时v≈−4.444 cm、M≈0.556。靠近透镜，像仍缩小，但缩小程度改变。',
      'At u=30 and f=−10 cm, v=−7.5 cm and M=0.25. For u=20, v≈−6.667 cm and M≈0.333; for u=8, v≈−4.444 cm and M≈0.556. The image remains smaller as the object approaches, but its scale changes.',
    ],
    misconception: [
      '“焦距为负就是坏透镜”混淆了符号与质量。这里负号表示发散类型；“虚像等于看不见”也忽略了镜子和眼睛接收方向信息的方式。',
      'Negative focal length is a sign convention for divergence, not poor quality. A virtual image can be visible, just as a mirror image is, because eyes receive directional light.',
    ],
    realWorld: [
      '眼镜和复合光学系统会使用发散元件。实际矫正还涉及眼球与其他光学面，不能仅凭这一个模型决定某人的眼镜度数。',
      'Spectacles and compound optics use diverging elements. Actual correction also involves the eye and other surfaces; this single model does not determine a person’s prescription.',
    ],
    summary: [
      '发散光也能给出可见虚像，虚线不是额外光路。',
      'Diverging rays can locate a visible virtual image; extensions are not extra travel.',
    ],
    homeExperiment: [
      '在纸上画物距30 cm、焦距−10 cm的比例图。从同一物点画过中心线和先平行后发散线，向后延长定位像；再写出纸屏为什么接不到它。',
      'Draw a scaled u=30 cm, f=−10 cm construction. From one point trace the central ray and a parallel ray that diverges, extend backward and locate the image. Explain why a screen cannot receive it there.',
    ],
    vocabulary: [
      ['凹透镜', 'diverging lens'],
      ['虚焦点', 'virtual focus'],
      ['发散', 'divergence'],
      ['正立', 'upright'],
    ],
    formula: [
      '真实物体配f<0：v<0，0<M<1',
      'Real object with f<0: v<0 and 0<M<1',
    ],
    questions: [
      [
        '负焦距在这里表示什么？',
        'What does negative f mean here?',
        [
          ['玻璃吸光', 'Absorbing glass'],
          ['透镜发散', 'A diverging lens'],
          ['光向过去走', 'Light travels into the past'],
        ],
        1,
        '符号编码焦点所在侧与发散类型。',
        'The sign encodes focus side and divergence.',
      ],
      [
        '凹透镜真实物体的像能直接投到纸屏吗？',
        'Can this diverging-lens image be directly projected?',
        [
          ['能，放在虚像处就行', 'Yes, at its virtual position'],
          ['能，任意位置都行', 'Yes, at any position'],
          ['不能，那里只有方向延长线', 'No; only extensions meet there'],
        ],
        2,
        '出射实际光线没有在那里汇合。',
        'Actual outgoing rays do not meet there.',
      ],
      [
        'M=0.25说明什么？',
        'What does M=0.25 indicate?',
        [
          ['正立，像高是物高四分之一', 'Upright, one-quarter object height'],
          ['倒立，能量变负', 'Inverted, negative energy'],
          ['光速变成四分之一', 'One-quarter light speed'],
        ],
        0,
        '倍率是有方向的高度比例。',
        'M is a signed height ratio.',
      ],
    ],
    exit: [
      '看见缩小正立像，怎样判断是否是虚像？',
      'How would you investigate a smaller upright image?',
      [
        ['断言所有正立像都一样', 'Assume every upright image is identical'],
        [
          '追踪出射线，区分实线与延长线交会',
          'Trace output and distinguish rays from extensions',
        ],
        ['忽略物体位置', 'Ignore object position'],
      ],
      1,
      '用光路判断，比靠口诀更可靠。',
      'Use the ray mechanism rather than a slogan.',
    ],
  }),
  make({
    kind: 'imaging-rays',
    id: 'imaging-many-rays-one-object-point',
    minutes: 24,
    title: [
      '只画两条光线，怎么能代表整幅图像？',
      'How can two drawn rays describe a whole image?',
    ],
    subtitle: [
      '先定位一个物点，再把同样方法用于其他点。',
      'Locate one object point, then repeat for other points.',
    ],
    hook: [
      '从书上一个墨点出发的光，会经过透镜上许多位置。教材常只画两条，它们不是唯二允许通行的路线，而是容易构造、足够定位像点的取样。',
      'Light from one ink dot reaches many lens positions. Two textbook rays are convenient samples sufficient to locate one image point, not the only permitted routes.',
    ],
    prediction: [
      '同一物点的一条一般光线，不走中心也不平行，会去另一个像点吗？',
      'Will a general ray from the same point reach a different image point?',
    ],
    predictions: [
      ['会，每条线各有一个像点', 'Yes, every ray has its own image'],
      ['不会，理想模型中它们共用像点', 'No, they share the ideal image point'],
      ['一般光线不能经过透镜', 'General rays cannot pass the lens'],
    ],
    explore: [
      '物距30 cm、f=10 cm保持，依次选透镜交点H=0.5、0、−0.5 cm。第三条紫线是当前检查线，两条参考线仍在。自由移动H，右图追踪不同线的高度，检查它们是否都经过x=15 cm、y=−0.25 cm。',
      'Hold u=30 cm and f=10 cm. Select hit heights H=0.5, 0 and −0.5 cm. Purple is the inspected ray with two references. Move H freely and check all height lines passing through x=15 cm, y=−0.25 cm.',
    ],
    concept: [
      '近轴薄透镜满足θ_out≈θ_in−H/f；传播距离x后高度为H+xθ_out。把θ_in=(H−h)/u代入，在满足透镜公式的像面上，H项抵消，所以不同入射位置都给同一像高。平行线与过中心线只是这条一般规律的方便特例。',
      'A paraxial thin lens changes slope by −H/f. After distance x, height is H+xθ_out. Substitute θ_in=(H−h)/u: at the thin-lens image plane, the H terms cancel, so different hit positions give the same image height. Parallel and central rays are convenient special cases.',
    ],
    example: [
      'u=30、h=0.5、f=10 cm。H=0.5的入射斜率0，出射−0.05；H=0的斜率前后都是−1/60；H=−0.5的入射−1/30，出射1/60。到x=15 cm时三者高度均为−0.25 cm。一般线不必经过焦点。',
      'With u=30, h=0.5 and f=10 cm: H=0.5 has incoming slope 0 and outgoing −0.05; H=0 remains −1/60; H=−0.5 changes from −1/30 to +1/60. At x=15 cm all give y=−0.25 cm. A general ray need not pass the focus.',
    ],
    misconception: [
      '“所有光线都过焦点”只对轴向平行入射光成立。同一幅图像里的不同物点对应不同像点；把来自不同物点的线硬凑在一起，找不出正确像。',
      'Only rays entering parallel to the axis meet its focus. Different object points map to different image points. Mixing rays from different source points produces a false construction.',
    ],
    realWorld: [
      '相机的每个像素接收某个小区域的光。可靠成像需要一束来自同一点的光在对应区域交会，不能只把一个漂亮的交叉图当成整幅照片。',
      'Each camera pixel receives a small image region. Imaging needs a bundle from one source point to meet its corresponding region, not merely a decorative crossing diagram.',
    ],
    summary: [
      '两条便利线定位，一般光线检验；每个物点单独对应。',
      'Convenient rays locate; general rays verify; each object point maps separately.',
    ],
    homeExperiment: [
      '用尺画三条来自同一点的光线，标H与斜率。在15 cm像面上算各自高度，再把物点高度改成1 cm重做；像高也应按同一倍率变化。',
      'Draw three rays from one point and label hit heights and slopes. Calculate heights at x=15 cm, then repeat for object height 1 cm; image height should scale by the same M.',
    ],
    vocabulary: [
      ['光路图', 'ray diagram'],
      ['近轴', 'paraxial'],
      ['光轴', 'optical axis'],
      ['像点', 'image point'],
    ],
    formula: [
      'θ_out≈θ_in−H/f；像面上H项抵消',
      'θ_out≈θ_in−H/f; hit-height terms cancel at the image plane',
    ],
    questions: [
      [
        '画来定位同一像点的光线，应从哪里发出？',
        'Where should rays locating one image point originate?',
        [
          ['任意不同物点', 'Arbitrary different points'],
          ['任意焦点', 'Any focus'],
          ['同一物点', 'One object point'],
        ],
        2,
        '同一点的不同方向需要会聚到对应像点。',
        'Different directions from one point meet its corresponding image.',
      ],
      [
        '过薄透镜中心线有什么特点？',
        'What happens to a central ray in this model?',
        [
          ['斜率不改变', 'Its slope stays unchanged'],
          ['一定平行出射', 'Always leaves parallel'],
          ['被中心吸收', 'Absorbed by the centre'],
        ],
        0,
        'H=0使透镜斜率改变量为0。',
        'H=0 gives zero slope change.',
      ],
      [
        '只画两条线是否意味着实际只有两条光路？',
        'Do two drawn rays mean only two actual routes exist?',
        [
          ['是，第三条被禁止', 'Yes, a third is forbidden'],
          ['否，它们是方便取样', 'No, they are convenient samples'],
          ['是，人眼只接两束光', 'Yes, eyes accept two rays'],
        ],
        1,
        '一般光线也遵循同一成像规律。',
        'General rays follow the same imaging rule.',
      ],
    ],
    exit: [
      '两条线交叉了却像不清，首先检查图里什么？',
      'If a crossing diagram predicts a blurred image, what should you check first?',
      [
        ['线条颜色够不够亮', 'Whether colours are bright'],
        [
          '来自同一物点、条件与接收位置是否一致',
          'Common source point, model and receiving plane',
        ],
        ['把全部线都画过焦点', 'Draw every ray through focus'],
      ],
      1,
      '图要对应实际模型和物点。',
      'The construction must match source point and conditions.',
    ],
  }),
  make({
    kind: 'imaging-equation',
    id: 'imaging-reciprocals-locate-the-image',
    minutes: 24,
    title: [
      '像距忽然很远，公式真的“坏了”吗？',
      'Does the lens equation fail when the image suddenly moves far away?',
    ],
    subtitle: [
      '用带单位的倒数理解焦点边界。',
      'Use unit-bearing reciprocals to understand the focal boundary.',
    ],
    hook: [
      '把物体慢慢移向焦点，清晰像的纸屏位置却越退越远。不是公式失灵，而是两项倒数越来越接近相消；一张倒数图能把这段变化变成直线。',
      'As an object approaches focus, the screen needed for a sharp image retreats. Reciprocals approach cancellation. A reciprocal plot turns this change into a straight line.',
    ],
    prediction: [
      'u越来越接近f且仍在焦点外，v是趋近0还是越来越大？',
      'When u approaches f from outside, does v approach zero or grow larger?',
    ],
    predictions: [
      ['v趋近0', 'v approaches zero'],
      ['v保持f', 'v stays equal to f'],
      ['v越来越大', 'v grows larger'],
    ],
    explore: [
      '比较u=30、20、8 cm；看像距符号，同时把1/u、1/v相加与1/f比较。右图横纵都用cm⁻¹。自由调到u=10 cm，1/v为0，但v没有有限值；图上的0不能直接读成像在透镜中心。',
      'Compare u=30, 20 and 8 cm, noting signed v and adding 1/u to 1/v. Both graph axes are cm⁻¹. At u=10 cm, 1/v is zero while v has no finite value; a reciprocal zero is not an image at the lens.',
    ],
    concept: [
      '本符号约定：真实物体u>0；透镜后实像v>0，物侧虚像v<0；会聚f>0、发散f<0。1/f=1/u+1/v是近轴薄透镜规律。统一单位后再求倒数；v=fu/(u−f)，u=f是有限解的边界。它不适用于任意厚透镜和大角光线。',
      'Here real objects have u>0, real images v>0 and object-side virtual images v<0; converging f>0 and diverging f<0. Use 1/f=1/u+1/v for paraxial thin lenses after matching units. v=fu/(u−f) has no finite solution at u=f and is not a universal thick-lens rule.',
    ],
    example: [
      'f=10 cm、u=30 cm：1/v=0.1−0.03333=0.06667 cm⁻¹，v=15 cm。u=8 cm：1/v=0.1−0.125=−0.025 cm⁻¹，v=−40 cm。u=11 cm给v=110 cm，像在图窗外仍保留读数，不把它挤回边缘冒充位置。',
      'For f=10 and u=30 cm, 1/v=0.1−0.03333=0.06667 cm⁻¹, so v=15 cm. At u=8, 1/v=−0.025 cm⁻¹ gives v=−40 cm. At u=11, v=110 cm is outside the view; numerical position remains rather than being moved onto its edge.',
    ],
    misconception: [
      '“1/u+1/v就是1/(u+v)”是倒数相加错误。先分别求倒数再加；符号和单位都不能在计算途中丢掉。',
      'Adding reciprocals is not taking the reciprocal of a sum. Calculate each term separately, retaining its sign and unit.',
    ],
    realWorld: [
      '预测纸屏位置能减少盲目试移。若实验与理想值不符，要检查距透镜哪个位置量、图像判清标准和薄透镜近似，而不是随手改公式。',
      'A predicted screen position guides a real search. Disagreement prompts checks of measurement reference, sharpness criterion and lens approximation, not an arbitrary equation change.',
    ],
    summary: [
      '倒数为零与距离为零不同；先看单位和符号。',
      'Zero reciprocal differs from zero distance; retain units and signs.',
    ],
    homeExperiment: [
      '把f=10 cm的u=30、20、15、11 cm算成表，分别记录v与1/v。画1/v对1/u图，再写一句为什么图像是直线而v对u不是。',
      'Tabulate v and 1/v for f=10 cm and u=30, 20, 15 and 11 cm. Plot 1/v against 1/u and explain why it is straight while v against u is not.',
    ],
    vocabulary: [
      ['薄透镜公式', 'thin-lens equation'],
      ['倒数', 'reciprocal'],
      ['符号约定', 'sign convention'],
      ['无穷远', 'infinity'],
    ],
    formula: ['1/f=1/u+1/v；v=fu/(u−f)', '1/f=1/u+1/v; v=fu/(u−f)'],
    questions: [
      [
        '1/v=−0.025 cm⁻¹，v是多少？',
        'If 1/v=−0.025 cm⁻¹, what is v?',
        [
          ['−40 cm', '−40 cm'],
          ['−0.025 cm', '−0.025 cm'],
          ['40 cm，负号删掉', '40 cm, deleting the sign'],
        ],
        0,
        '倒数转回距离，要保留负号。',
        'Invert to distance and preserve the sign.',
      ],
      [
        '公式中cm与m如何处理？',
        'How should cm and m be handled?',
        [
          ['随便混用', 'Mix freely'],
          ['先统一单位', 'Match units first'],
          ['只给答案加单位', 'Add a unit only at the end'],
        ],
        1,
        '倒数也带单位，不能直接混加。',
        'Reciprocals also carry units.',
      ],
      [
        'u=f时，1/v=0表示什么？',
        'At u=f, what does 1/v=0 mean?',
        [
          ['像在0 cm', 'Image at 0 cm'],
          ['像在物点', 'Image at the object'],
          ['没有有限像距', 'No finite image distance'],
        ],
        2,
        '平行出射对应无穷远边界。',
        'Parallel output corresponds to the infinity boundary.',
      ],
    ],
    exit: [
      '算出v=110 cm，图窗到60 cm，应怎么报告？',
      'Computed v=110 cm exceeds a 60 cm window. What should be reported?',
      [
        ['把v改成60 cm', 'Change v to 60 cm'],
        ['声称光不再成像', 'Claim imaging stopped'],
        ['报告110 cm，并说明图窗外', 'Report 110 cm, outside the view'],
      ],
      2,
      '显示限制不改变物理结果。',
      'Display limits do not change the model result.',
    ],
  }),
  make({
    kind: 'imaging-magnification',
    id: 'imaging-size-and-orientation-have-separate-clues',
    minutes: 24,
    title: [
      '倍率有负号，是不是像“变少了”？',
      'Does a negative magnification mean less image?',
    ],
    subtitle: [
      '用高度比例看大小，用符号看倒正。',
      'Use the ratio for size and its sign for orientation.',
    ],
    hook: [
      '相机拍下的光学像常倒立，但照片能显示正方向。物理倍率的负号先说明相对物体的上下翻转，电子翻转照片是另一件事，不能把两者混着读。',
      'A camera’s optical image is often inverted while the displayed photo looks upright. A negative optical M indicates orientation relative to the object; electronic display rotation is a separate operation.',
    ],
    prediction: [
      'M=−0.5时，像高的大小与方向是什么？',
      'With M=−0.5, what are image size and orientation?',
    ],
    predictions: [
      ['像高一半、倒立', 'Half the height, inverted'],
      ['像高一半、正立', 'Half the height, upright'],
      ['像能量为负', 'Negative image energy'],
    ],
    explore: [
      '比较缩小实像、等大实像、放大虚像。自由改变物高h，保持该比较的u与f；看h′随h变化，M却保持。光路纵向放大展示，真实高度请读cm，不拿屏幕像素推倍率。',
      'Compare smaller real, same-size real and larger virtual images. Change h with u and f held: h′ changes while M stays fixed. Vertical display enlargement means dimensions should be read in cm, not inferred from screen pixels.',
    ],
    concept: [
      '线放大率M=h′/h=−v/u。|M|给高度大小比，正负给正立或倒立。它不是光功率比例，也不是看起来的视角比例；观看距离和眼睛还会影响视角。对虚像，v负，于是M正；不需偷偷去掉公式里的负号。',
      'Linear M=h′/h=−v/u. Magnitude gives height ratio; sign gives upright or inverted orientation. It is neither optical power fraction nor angular size, which also depends on viewing distance. For virtual v<0, M is positive without deleting the equation’s minus sign.',
    ],
    example: [
      '物高0.5 cm：u=30、v=15给h′=−0.25 cm；u=20、v=20给h′=−0.5 cm；u=8、v=−40给h′=2.5 cm。最后一项物高改到1 cm，像高5 cm，M仍为5。',
      'At h=0.5 cm: u=30, v=15 gives h′=−0.25 cm; u=v=20 gives −0.5 cm; u=8, v=−40 gives 2.5 cm. Change the last object height to 1 cm: image height becomes 5 cm while M remains 5.',
    ],
    misconception: [
      '“放大五倍，必定亮五倍、细节多五倍”把尺寸、能量与分辨率混在一起。负高度也不是负光能量，它只是在选定轴的另一侧。',
      'Fivefold image height does not imply fivefold brightness or detail. Size, energy and resolving ability are different. Negative height denotes the opposite side of an axis, not negative light energy.',
    ],
    realWorld: [
      '放大照片可能只得到更大的像素块。透镜的几何放大同样需要与接收面积、采样和分辨率区分，单看倍率不能保证看清。',
      'Enlarging a photo may only enlarge pixel blocks. Geometric optical M also differs from receiving area, sampling and resolution; magnification alone does not guarantee detail.',
    ],
    summary: [
      '|M|看大小，符号看倒正，别拿倍率代替能量或细节。',
      'Magnitude gives size, sign gives orientation; neither measures energy or detail.',
    ],
    homeExperiment: [
      '画0.5 cm与1 cm两根物箭头，在同一u、f下算对应像高。用上方为正的坐标画正负箭头，最后把“大小”和“倒正”分开写。',
      'Draw objects 0.5 and 1 cm high and compute image heights at fixed u and f. Use upward-positive signed arrows, then describe size and orientation separately.',
    ],
    vocabulary: [
      ['线放大率', 'linear magnification'],
      ['像高', 'image height'],
      ['倒立', 'inverted'],
      ['角大小', 'angular size'],
    ],
    formula: [
      'M=h′/h=−v/u；|M|是高度大小比',
      'M=h′/h=−v/u; |M| is height magnitude ratio',
    ],
    questions: [
      [
        'M=−1表示什么？',
        'What does M=−1 mean?',
        [
          ['缩小且正立', 'Smaller and upright'],
          ['等大且倒立', 'Same size and inverted'],
          ['没有像', 'No image'],
        ],
        1,
        '大小为1，负号表示倒立。',
        'Magnitude one, negative orientation.',
      ],
      [
        'u、f保持，物高变两倍，M怎样变？',
        'At fixed u and f, doubling h does what to M?',
        [
          ['变两倍', 'Doubles it'],
          ['变为负数', 'Makes it negative'],
          ['保持，像高也变两倍', 'It stays; image height doubles'],
        ],
        2,
        '物与像高度一起按同一比例改变。',
        'Both heights scale together.',
      ],
      [
        '倍率5能直接说明亮度五倍吗？',
        'Does M=5 imply fivefold brightness?',
        [
          ['不能，倍率不是能量比例', 'No; M is not an energy fraction'],
          ['能，大小就是能量', 'Yes; size is energy'],
          ['能，虚像自动更亮', 'Yes; virtual images are brighter'],
        ],
        0,
        '分开问尺寸、能量和细节。',
        'Ask about size, energy and detail separately.',
      ],
    ],
    exit: [
      '比较两种成像的大小，该记录哪些量？',
      'What should be recorded to compare image scale?',
      [
        ['只记录显示屏大小', 'Only display size'],
        ['只记录正负号', 'Only the sign'],
        ['物高、像高与成像条件', 'Object height, image height and conditions'],
      ],
      2,
      '可比的高度比例需要对应物体和条件。',
      'A comparable height ratio needs matched source and conditions.',
    ],
  }),
  make({
    kind: 'imaging-eye',
    id: 'imaging-fixed-retina-changing-power',
    minutes: 24,
    title: [
      '看远处再看书，眼睛为什么不用移动视网膜？',
      'How can eyes refocus without moving the retina?',
    ],
    subtitle: [
      '固定接收面，用等效屈光力改变交会位置。',
      'Hold the receiving plane and change equivalent optical power.',
    ],
    hook: [
      '先看墙上挂钟，再看近处的字，你通常不需拿手调眼球的位置。近处物体的入射光更发散，需要改变眼睛的光学作用，才能仍在同一个视网膜上交会。',
      'Looking from a wall clock to nearby print changes focus without manually moving the eye’s receiving surface. More divergent near-object light needs a changed optical power to meet the same retina.',
    ],
    prediction: [
      '物体移近但保持原来的光学作用，像一定仍在固定视网膜上吗？',
      'If the object moves closer but optical power stays fixed, must the image remain on the retina?',
    ],
    predictions: [
      ['不一定，会出现离焦', 'No; it may be defocused'],
      ['一定，视网膜会自动跟着像跑', 'Yes; the retina follows the image'],
      ['光不再进入眼睛', 'Light stops entering the eye'],
    ],
    explore: [
      '比较100 cm远物合焦、25 cm近物沿用旧屈光力、近物调节后。视网膜距始终1.7 cm。自由调P，看理想像距与接收面距分开；第三图是同一物点的三条光线落点，不是三个不同字母。',
      'Compare a focused 100 cm object, a 25 cm object with old power, and accommodation for the near object. Retina remains 1.7 cm. Adjust P and distinguish ideal v from receiving z. Three landing dots sample one point, not three different letters.',
    ],
    concept: [
      '用一个等效薄透镜代替角膜与晶状体共同作用，P=1/f(m)，单位D。固定视网膜距R时，P=100(1/u+1/R)，这里长度用cm。近物u变小，需要更大P、更短等效f。本台只示意调节与几何离焦，不模拟生理细节或开眼镜处方。',
      'An equivalent thin lens represents cornea and crystalline lens together. P=1/f in metres, measured in D. With fixed retinal distance R and lengths in cm, P=100(1/u+1/R). A nearer object needs greater P and shorter equivalent f. This illustrates accommodation and geometric defocus, not biological detail or prescription.',
    ],
    example: [
      'R=1.7 cm：u=100 cm需P≈59.8235 D；u=25 cm需P≈62.8235 D。近物沿用旧P，理想像在视网膜后方，三条光线落点宽约0.0612 mm；调节后几何散布为0。真实眼睛仍有衍射和其他限制，0不是无限清晰。',
      'For R=1.7 cm, u=100 needs P≈59.8235 D and u=25 needs P≈62.8235 D. Keeping old power puts the ideal near image behind the retina, with a sampled spread about 0.0612 mm. After accommodation the geometric spread is zero, without removing real diffraction or other limits.',
    ],
    misconception: [
      '“视网膜图像倒立，所以世界看倒了”把光学方向和视觉处理混为一谈。“几何散布0意味着任何细节都可分辨”也忽略了波动与生理限制。',
      'An inverted retinal optical image is distinct from how vision interprets the world. Zero geometric spread does not remove wave and biological limits on detail.',
    ],
    realWorld: [
      '眼睛把移动接收面的工作交给了改变光学作用。先理解这条机制，再区分不同眼睛的真实结构；模型数字属于简化眼，不是某个孩子的测量。',
      'The eye changes optical power rather than sliding a sensor. This mechanism should be understood before considering individual anatomy; these numbers describe a reduced model, not a child’s measured eye.',
    ],
    summary: [
      '视网膜位置保持；调节使近物光线重新在它上面交会。',
      'The retina stays; accommodation returns near-object focus to it.',
    ],
    homeExperiment: [
      '先看房间里较远的物体，再看手中的字，记录哪一处更清楚，不用强撑模糊观看。画固定视网膜和两种焦距图，说明为何近物需要更强会聚。',
      'Look comfortably between a farther room object and nearby print, noting which is sharp. Draw a fixed retina and two focal lengths, explaining why near objects need stronger convergence.',
    ],
    vocabulary: [
      ['调节', 'accommodation'],
      ['视网膜', 'retina'],
      ['屈光力', 'optical power'],
      ['离焦', 'defocus'],
    ],
    formula: [
      'P=1/f(m)；固定R时P=100(1/u+1/R)，u、R用cm',
      'P=1/f(m); fixed R gives P=100(1/u+1/R), with u and R in cm',
    ],
    questions: [
      [
        '近物要合焦在同一视网膜，P怎样改变？',
        'To focus nearer objects on the same retina, how does P change?',
        [
          ['减小', 'Decrease'],
          ['不必改变', 'No change needed'],
          ['增大', 'Increase'],
        ],
        2,
        '近物需要更强会聚。',
        'Near objects require stronger convergence.',
      ],
      [
        '第三图的三个落点代表什么？',
        'What do the three landing dots represent?',
        [
          ['同一物点的不同取样光线', 'Sampled rays from one point'],
          ['三个不同眼睛', 'Three eyes'],
          ['三个不同物体的整体像', 'Whole images of three objects'],
        ],
        0,
        '离焦让同一点的光分散在接收面。',
        'Defocus spreads one point’s rays on the receiving plane.',
      ],
      [
        '散布为0能说明真实眼睛无限分辨吗？',
        'Does zero spread imply unlimited real-eye resolution?',
        [
          ['能，所有限制消失', 'Yes, all limits vanish'],
          ['不能，模型只记几何离焦', 'No; only geometric defocus is modeled'],
          ['能，像素无限小', 'Yes, pixels are infinitely small'],
        ],
        1,
        '衍射、像差和视觉系统未包含。',
        'Diffraction, aberrations and visual processing are omitted.',
      ],
    ],
    exit: [
      '解释远近对焦，哪些位置要分别记录？',
      'What should be tracked separately to explain refocusing?',
      [
        ['把理想像距当视网膜自动移动', 'Assume retina moves with ideal v'],
        ['把屈光力当光功率瓦数', 'Treat optical power as watts'],
        [
          '固定接收面、理想像位置和屈光力',
          'Fixed receiving plane, ideal focus and optical power',
        ],
      ],
      2,
      '光学屈光力D不同于能量功率W。',
      'Dioptric power differs from energy power in watts.',
    ],
  }),
  make({
    kind: 'imaging-camera',
    id: 'imaging-a-sensor-needs-the-right-plane',
    minutes: 24,
    title: [
      '像已经形成，为什么照片还是模糊？',
      'If a lens forms an image, why can a photo still be blurred?',
    ],
    subtitle: [
      '让感光面到交会位置，再区分孔径与对焦。',
      'Place the sensor at focus, then distinguish aperture from focusing.',
    ],
    hook: [
      '拍近处的玩具时，远景设置可能让细线变成一块模糊。透镜仍按规律形成像，但光线交会处与感光面没有重合。换一张更大的感光面也不会自动解决位置问题。',
      'A nearby toy may blur with distant-scene settings. The lens still forms an image, but its meeting plane differs from the sensor. A larger sensor alone does not correct its position.',
    ],
    prediction: [
      '缩小入瞳后离焦散布更窄，是否说明理想像面也移动了？',
      'Does narrowing defocus with a smaller pupil mean the ideal image plane moved?',
    ],
    predictions: [
      ['是，焦距随孔径必然改变', 'Yes; aperture necessarily changes f'],
      [
        '否，固定u、f时理想像面不变',
        'No; at fixed u and f the ideal plane stays',
      ],
      ['是，缩小就能完全对焦', 'Yes; narrowing always creates exact focus'],
    ],
    explore: [
      '比较100 cm物体在5.2632 cm感光面上合焦、25 cm近物沿用旧感光面、近物将感光面移到6.25 cm。自由移动z，再勾选入瞳从6 mm缩到1.5 mm；比较同一物点的散布变窄与理想像距保持。',
      'Compare a 100 cm object focused at z=5.2632 cm, a 25 cm object with that old sensor position, and refocusing at z=6.25 cm. Move z freely, then reduce pupil diameter from 6 to 1.5 mm; spread narrows while ideal v stays fixed.',
    ],
    concept: [
      '相机感光面接收真实像。固定f时，物体靠近，所需v增大，因此镜头与感光面的距离需要调整。本模型三条取样线来自同一物点；接收面的几何散布直径为2a|1+z/u−z/f|，a为入瞳半径。缩小a可减小离焦，却不改变v；真实极小孔径还会增强衍射，本台不模拟。',
      'A camera sensor receives a real image. At fixed f, nearer objects require larger v, so lens-to-sensor separation changes. Three sampled rays from one point give geometric spread diameter 2a|1+z/u−z/f|. Reducing entrance-pupil radius a reduces defocus without changing v. Very small real apertures increase diffraction, outside this model.',
    ],
    example: [
      'f=5 cm：u=100需v≈5.2632 cm；u=25需v=6.25 cm。近物沿用旧位置，6 mm入瞳给散布约0.9474 mm；缩为1.5 mm后约0.2368 mm，减少到四分之一，但还没有合焦。移z到6.25 cm才使理想几何散布归零。',
      'For f=5 cm, u=100 needs v≈5.2632 cm and u=25 needs v=6.25 cm. A near object with old z and 6 mm pupil gives spread ≈0.9474 mm; a 1.5 mm pupil gives ≈0.2368 mm, one-quarter but still defocused. Moving z to 6.25 cm eliminates ideal geometric defocus.',
    ],
    misconception: [
      '“缩光圈就是重新对焦”和“数码放大能修复离焦”都把不同操作混在一起。这里的开口数字是模型入瞳直径，不是任意真实镜头叶片直径。',
      'Stopping down differs from refocusing; digital enlargement does not restore defocused detail. The quoted opening is the model entrance pupil, not necessarily a real lens’s physical blade diameter.',
    ],
    realWorld: [
      '手机常用移动镜片组改变等效焦点；本台通过移动接收面把机制清楚展示。两种实现都要让像面与感光面匹配，不能把本台距离当作手机拆机尺寸。',
      'Phones often move lens groups; this bench moves the receiving plane to expose the mechanism. Both must match focus to sensor, without treating these distances as phone construction dimensions.',
    ],
    summary: [
      '先对准像面；缩小孔径可减少离焦散布，却不是同一操作。',
      'Match the image plane first; smaller aperture reduces defocus through a different operation.',
    ],
    homeExperiment: [
      '在台内保持近物和旧z，分别记录大、小入瞳散布，再记录重新对焦结果。用一句话区分“减少模糊”和“改变理想像面”；无需拆开相机。',
      'Keep the near object and old z in the bench. Record both pupil spreads and the refocused result, then distinguish reducing blur from changing ideal focus. No camera disassembly is needed.',
    ],
    vocabulary: [
      ['感光面', 'sensor plane'],
      ['入瞳', 'entrance pupil'],
      ['孔径', 'aperture'],
      ['点像散布', 'point spread'],
    ],
    formula: [
      '点像直径=2a|1+z/u−z/f|；合焦z=v',
      'Point spread=2a|1+z/u−z/f|; focus when z=v',
    ],
    questions: [
      [
        '固定f，物体靠近且仍在焦点外，清晰像面怎么变？',
        'At fixed f, an outside-focus object comes nearer. What happens to image distance?',
        [
          ['更远离透镜', 'Farther from the lens'],
          ['更靠近透镜', 'Closer to the lens'],
          ['必定不变', 'Always unchanged'],
        ],
        0,
        '薄透镜关系给出更大的v。',
        'The lens relation gives larger v.',
      ],
      [
        '只把入瞳缩为四分之一，理想v怎样变？',
        'Reduce pupil diameter to one-quarter. What happens to ideal v?',
        [
          ['变四分之一', 'One-quarter'],
          ['保持', 'Unchanged'],
          ['变为虚像', 'Becomes virtual'],
        ],
        1,
        'u与f不变，所以v不变。',
        'Fixed u and f leave v unchanged.',
      ],
      [
        '几何散布模型包括哪一种模糊？',
        'Which blur is included in this spread model?',
        [
          ['所有真实像差', 'All real aberrations'],
          ['所有衍射', 'All diffraction'],
          ['接收面位置不匹配的离焦', 'Defocus from receiving-plane mismatch'],
        ],
        2,
        '其余限制有意留待更完整模型。',
        'Other limitations need more complete models.',
      ],
    ],
    exit: [
      '近物照片模糊，应怎样分清对焦与缩孔径？',
      'How should focus and aperture changes be distinguished?',
      [
        ['只用更大数字缩放', 'Only digitally enlarge'],
        ['分别记录理想v、接收z和散布', 'Track ideal v, receiving z and spread'],
        ['把缩孔径当成改变f', 'Treat smaller aperture as changed f'],
      ],
      1,
      '记录不同量才能分清操作机制。',
      'Separate quantities reveal separate mechanisms.',
    ],
  }),
  make({
    kind: 'imaging-instruments',
    id: 'imaging-two-lenses-an-intermediate-image',
    minutes: 24,
    title: [
      '望远镜和显微镜，两片透镜怎么接力？',
      'How do two lenses work together in telescopes and microscopes?',
    ],
    subtitle: [
      '先看中间像，再看目镜改变的视角。',
      'Find the intermediate image, then follow the eyepiece’s angular effect.',
    ],
    hook: [
      '远处的月球与近处的小标本，需要不同的第一步。望远镜把远方近似平行光收成中间像；显微镜先把近物做成放大的中间像。目镜再把这份图像送成眼睛能接收的方向。',
      'The distant Moon and a nearby specimen need different first steps. A telescope forms an intermediate image from nearly parallel distant rays. A microscope first enlarges a nearby object. Its eyepiece then changes directions received by the eye.',
    ],
    prediction: [
      '两镜系统的“放大倍数”，能否直接把两片透镜焦距相加得到？',
      'Can two-lens magnification be found by adding their focal lengths?',
    ],
    predictions: [
      ['能，相加就是倍率', 'Yes; the sum is M'],
      ['能，两个凸透镜总是两倍', 'Yes; two converging lenses mean twofold'],
      [
        '不能，要先求中间像再分析目镜',
        'No; find the intermediate image and eyepiece action',
      ],
    ],
    explore: [
      '比较20/5与40/5 cm望远镜，再看1/2.5 cm显微镜。目镜在中间像后一个fₑ，使最终出射平行。自由改变fₑ，镜间距同时按这个条件调整；不同仪器用声明的放大显示，不能比较图上像素长度。',
      'Compare 20/5 and 40/5 cm telescopes, then a 1/2.5 cm microscope. Eyepiece sits one fₑ after the intermediate image for parallel output. Changing fₑ also adjusts separation to preserve that condition. Instrument views have stated scales, not comparable pixel lengths.',
    ],
    concept: [
      '放松眼睛的理想两凸透镜望远镜，镜距fₒ+fₑ，角倍率约−fₒ/fₑ。显微镜先用物镜公式求中间像和线倍率mₒ，再用目镜作角放大；最终像在无穷远时，本台相对25 cm裸眼参考的总角倍率为mₒ·25/fₑ。负号表示方向翻转；这个参考不是人人的真实近点。',
      'An ideal relaxed-eye two-converging-lens telescope has separation fₒ+fₑ and angular M≈−fₒ/fₑ. A microscope first determines the objective’s intermediate image and linear mₒ, then applies eyepiece angular magnification. For final infinity focus this bench uses M=mₒ·25/fₑ relative to a 25 cm unaided reference, not everyone’s actual near point. A negative M denotes inversion.',
    ],
    example: [
      '20/5 cm望远镜M=−4、镜距25 cm；40/5给M=−8、镜距45 cm。显微镜物镜fₒ=1 cm、物距1.2 cm，先得vₒ=6 cm、mₒ=−5；目镜2.5 cm放在8.5 cm处，总角倍率−50。不能把这个−50当成最终像的厘米长度。',
      'A 20/5 cm telescope has M=−4 and separation 25 cm; 40/5 gives M=−8 and 45 cm. For microscope fₒ=1 cm and uₒ=1.2 cm, vₒ=6 cm and mₒ=−5. A 2.5 cm eyepiece at 8.5 cm gives angular M=−50, not a final image length in centimetres.',
    ],
    misconception: [
      '“倍数越大一定越清楚”忽略了孔径、衍射、像差和接收采样。两种仪器都成了中间实像，但望远镜的角倍率与显微镜物镜线倍率不能混用。',
      'Higher M alone does not guarantee clearer detail: aperture, diffraction, aberrations and sampling matter. Both instruments have a real intermediate image, but telescope angular M and microscope objective linear M are distinct.',
    ],
    realWorld: [
      '天文和生物观察都依赖先收集来自对象的方向信息，再让眼睛或探测器接收。真实天文镜常使用反射镜、更多透镜及复杂对焦，本台是用来理解两步成像的理想样例。',
      'Astronomical and biological observation collect object directions for an eye or detector. Real telescopes may use mirrors, additional elements and different focusing systems; these are ideal two-stage examples.',
    ],
    summary: [
      '物镜与目镜不是简单相加；逐步成像，分清线倍率与角倍率。',
      'Analyze objective and eyepiece in sequence, distinguishing linear from angular M.',
    ],
    homeExperiment: [
      '在纸上标20 cm物镜、5 cm目镜和25 cm镜距，追踪不同入射位置的同方向光。再画显微镜的6 cm中间像与8.5 cm目镜，写出每一步用的是哪种倍率；不要把望远镜指向太阳。',
      'Draw a 20 cm objective, 5 cm eyepiece and 25 cm separation, tracing parallel input rays at different heights. Draw the microscope’s 6 cm intermediate image and 8.5 cm eyepiece, labeling each magnification type. Never point a telescope at the Sun.',
    ],
    vocabulary: [
      ['物镜', 'objective'],
      ['目镜', 'eyepiece'],
      ['中间像', 'intermediate image'],
      ['角放大率', 'angular magnification'],
    ],
    formula: [
      '望远镜M≈−fₒ/fₑ；本显微镜M=mₒ·25/fₑ',
      'Telescope M≈−fₒ/fₑ; this microscope M=mₒ·25/fₑ',
    ],
    questions: [
      [
        '中间像在目镜前一个焦距，最终出射怎样？',
        'With the intermediate image one focal length before the eyepiece, how do rays leave?',
        [
          ['在目镜中心汇合', 'Meet at eyepiece centre'],
          ['平行；最终没有有限像距', 'Parallel; no finite final image'],
          ['全部被吸收', 'All absorbed'],
        ],
        1,
        '目镜把焦点物发成同方向光。',
        'The eyepiece collimates a focal-plane object.',
      ],
      [
        '20/5 cm望远镜角倍率是多少？',
        'What is angular M for a 20/5 cm telescope?',
        [
          ['−4', '−4'],
          ['25 cm', '25 cm'],
          ['−0.25', '−0.25'],
        ],
        0,
        '焦距比给角倍率，不是焦距和。',
        'The focal-length ratio gives angular M.',
      ],
      [
        '显微镜物镜倍率−5、目镜角倍率10，总体是多少？',
        'Objective linear M=−5 and eyepiece angular M=10 give what total?',
        [
          ['5', '5'],
          ['15', '15'],
          ['−50', '−50'],
        ],
        2,
        '在同一参考条件下按两步作用相乘。',
        'Multiply the two stages under the stated reference conditions.',
      ],
    ],
    exit: [
      '新仪器宣传“更高倍数”，还应该怎样判断？',
      'How should a claimed higher magnification be evaluated?',
      [
        ['只挑最大的数字', 'Choose the largest number'],
        ['把倍率当像素数量', 'Treat M as pixel count'],
        [
          '分清角与线倍率，并检查能分辨的细节',
          'Distinguish M types and check resolvable detail',
        ],
      ],
      2,
      '几何放大不是分辨率保证。',
      'Geometric magnification is not a resolution guarantee.',
    ],
  }),
];
