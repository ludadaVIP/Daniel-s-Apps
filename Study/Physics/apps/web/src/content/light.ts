import { t, q, type Lesson } from './schema';
export const lightLessons: Lesson[] = [
  {
    id: 'light-rays-and-shadows',
    stage: 2,
    unit: 'light',
    kind: 'light-shadow',
    minutes: 18,
    title: t('手没变大，影子为什么变大？', 'Same hand. Why a bigger shadow?'),
    subtitle: t(
      '用两条边界光线，预测屏幕上的影子。',
      'Predict a shadow using two boundary rays.',
    ),
    hook: t(
      '晚上用手电筒和手掌在墙上演小动物。手掌靠近灯时，墙上的兔子变大了。是墙把它放大，还是有些光被挡住了？',
      'Make shadow animals with a torch and your hand. Move your hand nearer the lamp and the rabbit grows. Does the wall enlarge it, or are different light paths blocked?',
    ),
    prediction: t(
      '点光源和屏幕固定，把同一物体从离灯3 m移到2 m，影子怎样变？',
      'Keep a point source and screen fixed. Move the same object from 3 m to 2 m from the source. What happens?',
    ),
    predictions: [
      t('影子变大', 'Larger shadow'),
      t('影子变小', 'Smaller shadow'),
      t('大小一定不变', 'Always unchanged'),
    ],
    explore: t(
      '完整追踪三组：物高1 m距灯2 m、物高1 m距灯3 m、物高2 m距灯3 m。屏幕一直距灯6 m。边界线经过物体边缘；屏幕上的暗段是光被挡住的区域。',
      'Trace all three cases: 1 m height at 2 m, 1 m at 3 m, and 2 m at 3 m. The screen stays 6 m from the source. Boundary rays graze the object edges; the dark screen segment is blocked light.',
    ),
    concept: t(
      '在均匀透明介质中，几何光学把光的传播方向画成带箭头的直线。光线是模型，不是看得见的细绳。光源向很多方向发光，物体挡住一部分；屏幕接收其他方向的光，于是留下影子。我们看见普通物体，是来自光源的光经物体反射或散射后进入眼睛，不是眼睛发出探测光。',
      'In a uniform transparent medium, ray optics represents propagation by straight lines with arrows. Rays are a model, not visible strings. A source sends light in many directions; an opaque object blocks some. The screen receives the rest, leaving a shadow. We see ordinary objects when reflected or scattered light enters our eyes, not by emitting sight rays.',
    ),
    formula: t(
      '点光源：影高/物高 = 灯到屏幕距离/灯到物体距离。',
      'Point source: shadow height / object height = source–screen distance / source–object distance.',
    ),
    example: t(
      '三组影高分别为1×6/2=3 m、1×6/3=2 m、2×6/3=4 m。同一物体靠近灯会变大；物体变大也会使影子变大。这是两种不同改变。',
      'The three shadow heights are 1×6/2=3 m, 1×6/3=2 m, and 2×6/3=4 m. Moving the same object nearer the source enlarges its shadow; enlarging the object also does so. These are different changes.',
    ),
    misconception: t(
      '影子不是物体投出的黑色东西。真实灯泡有大小，会形成较模糊的半影；本模型用一个点光源、平行物体和屏幕，忽略衍射。动画只是慢速追踪，不能测光速。',
      'A shadow is not black material emitted by an object. Real extended lamps can make blurred penumbrae. This model uses a point source with parallel object and screen, ignoring diffraction. Slow tracing cannot measure light speed.',
    ),
    realWorld: t(
      '舞台上的手影、路灯下的影子和日食都涉及光被遮挡。太阳有大小，日食的本影与半影需要更完整的几何图。光也能在真空传播，和机械声波不同。',
      'Shadow theatre, streetlamp shadows and eclipses involve blocked light. The extended Sun requires fuller eclipse geometry with umbra and penumbra. Light also travels through vacuum, unlike mechanical sound.',
    ),
    summary: t(
      '沿边界光线找影子；控制距离，才能公平比较。',
      'Use boundary rays to find a shadow; control distances for fair comparisons.',
    ),
    homeExperiment: t(
      '用普通手电筒照一张竖着的纸片，墙的位置固定。标记两处灯到纸片距离，预测并量影高。纸片与墙保持平行。不要照眼睛；记录边缘模糊时量到哪一段。',
      'Use an ordinary torch and upright card with the wall fixed. Mark two source–card distances; predict and measure shadow heights. Keep card parallel to the wall. Aim away from eyes and record how you chose blurred edges.',
    ),
    vocabulary: [
      t('光线', 'ray'),
      t('点光源', 'point source'),
      t('影子', 'shadow'),
      t('散射', 'scattering'),
    ],
    questions: [
      q(
        '1 m高物体距灯2 m，屏幕距灯6 m，影高？',
        '1 m object at 2 m; screen at 6 m. Shadow height?',
        [
          ['3 m', '3 m'],
          ['1 m', '1 m'],
        ],
        0,
        '比例是6/2=3。',
        'The scale is 6/2=3.',
      ),
      q(
        '看到一本不发光的书，光的方向？',
        'To see a nonluminous book, which light path?',
        [
          ['眼睛→书', 'Eye → book'],
          ['灯→书→眼睛', 'Lamp → book → eye'],
        ],
        1,
        '书把一部分照来的光散射到眼睛。',
        'The book scatters some incident light into the eye.',
      ),
      q(
        '只研究距离影响，应保持哪项不变？',
        'To study distance alone, what stays fixed?',
        [
          ['物体高度和屏幕位置', 'Object height and screen position'],
          ['每次换不同大小的物体', 'Change object size each time'],
        ],
        0,
        '一次只改变灯到物体的距离。',
        'Change only the source–object distance.',
      ),
    ],
    exit: q(
      '同一小玩偶靠近小灯，墙上的影子变大。该用哪条证据解释？',
      'A toy nearer a small lamp casts a larger wall shadow. Which evidence explains it?',
      [
        ['墙把玩偶拉长了', 'The wall stretched the toy'],
        [
          '经过玩偶边缘的光线在墙上分得更开',
          'Boundary rays are farther apart at the wall',
        ],
      ],
      1,
      '沿直线边界推到墙上，可以预测变大。',
      'Extending the straight boundary rays predicts the larger shadow.',
    ),
  },
  {
    id: 'light-reflection-from-normal',
    stage: 2,
    unit: 'light',
    kind: 'light-reflection',
    minutes: 17,
    title: t(
      '把光“转弯”，该瞄准哪里？',
      'Where do you aim to turn a light ray?',
    ),
    subtitle: t(
      '先画法线，再让两侧的角度说话。',
      'Draw a normal, then compare the angles.',
    ),
    hook: t(
      '想用一面小镜子把台灯的光送到另一边，随便转镜子常常照不到。反射有一条可预测的规则，潜望镜就靠它绕过挡板。',
      'Turning a small mirror at random rarely sends lamp light where you want. Reflection has a predictable rule; a periscope uses it to look past an obstacle.',
    ),
    prediction: t(
      '入射光与法线成20°，反射光与法线成多少？',
      'The incoming ray makes 20° with the normal. What angle does the reflected ray make?',
    ),
    predictions: [t('20°', '20°'), t('70°', '70°'), t('40°', '40°')],
    explore: t(
      '完整追踪20°、45°与60°。镜面和入射点保持相同，灰色虚线是垂直镜面的法线。角度弧从法线开始，不从镜面开始。可以自由改变角度，但规定的三组要各观察一次。',
      'Trace 20°, 45° and 60° with the same mirror and hit point. The dashed normal is perpendicular to the mirror. Angle arcs start at the normal, not the surface. Explore other angles, but observe all three prescribed cases.',
    ),
    concept: t(
      '反射是光回到原介质。平滑镜面中，入射角等于反射角，两角都从入射点的法线量起；入射光线、法线与反射光线在同一平面。镜面方向变了，法线也跟着变，所以反射方向会变。',
      'Reflection sends light back into the original medium. At a smooth mirror, incidence equals reflection, both measured from the normal at the hit point. Incident ray, normal and reflected ray share a plane. Turn the mirror and its normal turns, changing the outgoing direction.',
    ),
    formula: t(
      '反射定律：i=r；法线⊥镜面。',
      'Reflection law: i=r; normal ⟂ mirror.',
    ),
    example: t(
      '20°入射对应20°反射，光线与镜面的夹角是70°。60°入射对应60°反射，与镜面成30°。不要把同一张图里的互余角读成反射定律失效。',
      '20° incidence gives 20° reflection and 70° to the surface. 60° incidence gives 60° reflection and 30° to the surface. Complementary angles in one diagram do not contradict the law.',
    ),
    misconception: t(
      '纸也能反射光。粗糙表面上许多小面朝向不同，各自仍按局部法线反射，却把光送向很多方向；平滑镜面把同方向光有组织地反射。模型画两条路径，不预测亮度。',
      'Paper reflects too. Rough surfaces have differently oriented tiny facets; each follows its local normal but sends light in many directions. A smooth mirror gives organised reflection. Two model paths do not predict brightness.',
    ),
    realWorld: t(
      '镜子把物体来的光送进眼睛。两面合适朝向的镜子可以让光经过两次反射，绕过纸板；你可以在潜望镜工作台亲自调查。',
      'A mirror redirects object light into your eye. Two suitably oriented mirrors can produce two reflections around a cardboard barrier; investigate this in your periscope workshop.',
    ),
    summary: t(
      '看法线，两角相等；表面粗糙也不等于不反光。',
      'Measure from the normal: equal angles. Rough does not mean nonreflecting.',
    ),
    homeExperiment: t(
      '把一面不易碎的小镜子平放在纸上，画镜面方向与垂直法线。用普通手电筒照镜子附近，预测反射往哪边，改变照射方向再观察。光束未必清晰，可看另一张白纸上的亮处。不要用激光或太阳光。',
      'Place a shatter-resistant small mirror on paper and draw its direction and perpendicular normal. With an ordinary torch, predict the reflected direction and look for a bright patch on another card. Change the incoming direction. Use no laser or sunlight.',
    ),
    vocabulary: [
      t('反射', 'reflection'),
      t('法线', 'normal'),
      t('入射角', 'angle of incidence'),
      t('反射角', 'angle of reflection'),
    ],
    questions: [
      q(
        '法线与平镜面成几度？',
        'What angle does the normal make with a plane mirror?',
        [
          ['90°', '90°'],
          ['0°', '0°'],
        ],
        0,
        '法线垂直于局部表面。',
        'A normal is perpendicular to the local surface.',
      ),
      q(
        '光与镜面成30°，入射角是多少？',
        'Ray at 30° to the surface: incidence angle?',
        [
          ['30°', '30°'],
          ['60°', '60°'],
        ],
        1,
        '从法线量：90−30=60°。',
        'Measure from the normal: 90−30=60°.',
      ),
      q(
        '白纸为什么通常没有清晰镜像？',
        'Why does white paper usually lack a clear mirror image?',
        [
          [
            '不同小面向许多方向反射',
            'Different facets reflect in many directions',
          ],
          ['白纸完全不反射', 'Paper reflects no light'],
        ],
        0,
        '粗糙表面使方向分散。',
        'Roughness spreads the reflected directions.',
      ),
    ],
    exit: q(
      '同学量到光与镜面成70°，却说入射角是70°。怎样改？',
      'A friend calls 70° to the surface a 70° incidence angle. What correction?',
      [
        ['先画法线，入射角是20°', 'Draw the normal: incidence is 20°'],
        ['反射定律只适用45°', 'The law only works at 45°'],
      ],
      0,
      '角度的基准决定你在量什么。',
      'The reference line determines which angle you measure.',
    ),
  },
  {
    id: 'light-plane-mirror-image',
    stage: 2,
    unit: 'light',
    kind: 'light-mirror',
    minutes: 18,
    title: t(
      '镜子后面，真的有另一个你？',
      'Is there really another you behind the mirror?',
    ),
    subtitle: t(
      '追踪反射，再把方向向后延长。',
      'Follow reflection, then extend directions backward.',
    ),
    hook: t(
      '镜子贴在墙上，你却觉得墙后还有一个房间。光没有穿进那间房，为什么看起来像从那里来？',
      'A mirror on a wall seems to open another room. Light has not entered that room. Why does it look as if it came from there?',
    ),
    prediction: t(
      '你离平面镜0.4 m，像在镜后多远？',
      'You stand 0.4 m before a plane mirror. How far behind is the image?',
    ),
    predictions: [
      t('0.4 m', '0.4 m'),
      t('0.8 m', '0.8 m'),
      t('就在镜面', 'On the surface'),
    ],
    explore: t(
      '比较物距0.4、0.6、0.8 m。实线是物体发来并反射的光；镜后虚线只是向后延长，用来找光“看起来来自”的位置。比较物距、像距以及物和像的总间距。',
      'Compare object distances 0.4, 0.6 and 0.8 m. Solid lines are incoming and reflected light. Dashed lines behind the mirror are backward constructions locating the apparent source. Compare object distance, image distance and total separation.',
    ),
    concept: t(
      '平面镜的反射光进入眼睛。把这些方向向镜后延长，会交到一个对应像点；那里没有这些光真正汇聚，所以叫虚像。平面镜的像与物体等大、正立，分别在镜面两边等距。镜子改变前后方向；所谓“左右互换”还涉及你如何转身比较。',
      'Reflected light enters the eye. Its backward directions meet at a corresponding image point, without actual light converging there: a virtual image. A plane-mirror image is equal size, upright and equally far on the other side. The mirror reverses the perpendicular front–back direction; familiar left–right descriptions also depend on how you turn to compare.',
    ),
    formula: t(
      '平面镜：像距=物距；物与像间距=2×物距。',
      'Plane mirror: image distance = object distance; object–image separation = 2×object distance.',
    ),
    example: t(
      '0.4 m物距给0.4 m像距，总间距0.8 m。退到0.8 m后，像也在镜后0.8 m，总间距1.6 m。不是像贴在玻璃上跟着你滑。',
      'At 0.4 m the image is 0.4 m behind, giving 0.8 m separation. At 0.8 m it is 0.8 m behind, giving 1.6 m. The image is not attached to the glass.',
    ),
    misconception: t(
      '镜后虚线不是穿过镜子的真实光。把一张白纸放在虚像位置，不能接到这个清晰虚像；但相机能接收反射光，再用自己的透镜把它成像。',
      'Dashed lines are not light passing through the mirror. A card at the virtual-image position cannot collect that sharp image, while a camera can receive reflected light and use its own lens to form an image.',
    ),
    realWorld: t(
      '舞蹈练习、衣帽镜和汽车平面后视镜都让人沿反射方向判断位置。弯曲镜面另有成像规律，不能直接用平面镜的等距规则。',
      'Dance studios, dressing mirrors and plane vehicle mirrors use reflected directions to judge position. Curved mirrors have other image rules; equal distance is not universal.',
    ),
    summary: t(
      '虚像是反射光的表观起点，平面镜两侧等距等大。',
      'A virtual image is an apparent source; a plane mirror gives equal size and distances.',
    ),
    homeExperiment: t(
      '把小玩具放在平面镜前，尺子沿垂直镜面方向量两种物距。预测像距，并画两条反射路径及镜后延长线。只记录你能观察到的，不声称尺子真的伸进镜像房间。',
      'Place a toy before a plane mirror and measure two perpendicular object distances. Predict image distances and sketch two reflected paths with backward extensions. Separate observations from constructions; the ruler cannot reach an imaginary room.',
    ),
    vocabulary: [
      t('虚像', 'virtual image'),
      t('像距', 'image distance'),
      t('物距', 'object distance'),
      t('延长线', 'extension'),
    ],
    questions: [
      q(
        '物距0.6 m，像距？',
        'Object distance 0.6 m. Image distance?',
        [
          ['0.6 m', '0.6 m'],
          ['1.2 m', '1.2 m'],
        ],
        0,
        '等距分别从镜面量。',
        'Both distances are measured from the mirror.',
      ),
      q(
        '图上镜后虚线代表？',
        'What do dashed lines behind the mirror represent?',
        [
          ['光真的穿进镜后', 'Real light behind the mirror'],
          ['反射方向向后延长', 'Backward reflected directions'],
        ],
        1,
        '构图线定位表观来源。',
        'Construction lines locate an apparent source.',
      ),
      q(
        '从0.4 m退到0.8 m，物与像间距？',
        'Move from 0.4 to 0.8 m: object–image separation?',
        [
          ['0.8→1.6 m', '0.8→1.6 m'],
          ['0.4→0.8 m', '0.4→0.8 m'],
        ],
        0,
        '总间距是物距的两倍。',
        'Total separation is twice the object distance.',
      ),
    ],
    exit: q(
      '有人说“镜后延长线交到一起，所以光真的在那里汇聚”。你如何用图纠正？',
      'Someone says intersecting extensions mean light really converges behind the mirror. How does the diagram correct this?',
      [
        [
          '虚线是构图；实线光仍在镜前反射',
          'Dashed lines construct; real light reflects in front',
        ],
        ['镜后的实物只是透明了', 'A real object behind is invisible'],
      ],
      0,
      '虚像位置可预测，不等于真实光的汇聚点。',
      'A predictable virtual-image location is not a real convergence point.',
    ),
  },
  {
    id: 'light-water-refraction',
    stage: 2,
    unit: 'light',
    kind: 'light-refraction',
    minutes: 20,
    title: t(
      '水里的吸管，在哪里“折断”了？',
      'Where did the straw in water “break”?',
    ),
    subtitle: t(
      '改变介质，看光的方向如何改变。',
      'Change the medium and follow the direction.',
    ),
    hook: t(
      '吸管伸进水杯，看起来在水面错开了，拿出来却完好。鱼也可能看起来比实际浅。改变的是物体，还是进入眼睛的光路？',
      'A straw seems displaced at the water surface, yet is intact when removed. A fish can look shallower than it is. Did the object change, or the light reaching your eye?',
    ),
    prediction: t(
      '光以45°从空气进入水，折射光更靠近还是远离法线？',
      'Light at 45° enters water from air. Does the transmitted ray move toward or away from the normal?',
    ),
    predictions: [
      t('靠近法线', 'Toward the normal'),
      t('远离法线', 'Away from the normal'),
      t('必定原方向不变', 'Always unchanged'),
    ],
    explore: t(
      '观察空气→水0°、空气→水45°、水→空气30°。每次从法线量角，检查进入另一介质的实线。拖动角度可继续探索；水→空气超过临界角时没有传播到空气里的折射光。',
      'Observe air→water at 0°, air→water at 45°, and water→air at 30°. Measure from the normal and follow transmission. Explore other angles; above the water–air critical angle no transmitted ray propagates into air.',
    ),
    concept: t(
      '光在不同透明介质里的传播速度不同，斜着跨界时方向通常改变，叫折射。空气进入水，方向靠近法线；水进入空气，方向远离法线。垂直跨界时速度改变，但方向不变。眼睛沿收到的方向反推，所以水中物体可能看起来错位。',
      'Light travels at different speeds in transparent media, so an oblique crossing usually changes direction: refraction. Air→water bends toward the normal; water→air bends away. At normal incidence speed changes without a direction change. Tracing received directions backward makes submerged objects appear displaced.',
    ),
    formula: t(
      '进阶看一眼：n₁ sin i = n₂ sin r；先会读图，不需背三角函数。',
      'Optional extension: n₁ sin i = n₂ sin r. Learn to read the paths before memorising trigonometry.',
    ),
    example: t(
      '模型空气n=1、水n=1.333。45°空气入水约折成32.04°；30°水入空气约41.80°。0°入射仍0°。水入空气约48.61°以上出现全反射；这不是折射角随意画到90°以上。',
      'With air n=1 and water n=1.333, 45° air incidence gives about 32.04°, and 30° water incidence about 41.80°. Zero remains zero. Water→air above about 48.61° gives total internal reflection, not an arbitrary transmitted angle above 90°.',
    ),
    misconception: t(
      '折射不等于所有光都穿过去；通常同时有一部分反射，图用淡线提醒，但不计算亮度。图把两种介质放在上、下半区，水→空气时上半区代表水，是方向对照，不是水杯重力布局。',
      'Refraction does not transmit all light; some is usually reflected. A faint line reminds you without predicting intensity. For water→air the upper region represents water: this is a direction comparison, not a cup under gravity.',
    ),
    realWorld: t(
      '泳池看起来浅、杯中的吸管错位以及眼镜透镜，都需要光跨越介质的路径。复杂杯壁有多个界面；本图只算一个平界面。',
      'Apparent pool depth, displaced straws and spectacle lenses depend on paths between media. A curved cup wall has several interfaces; this diagram computes one flat boundary.',
    ),
    summary: t(
      '从法线量角；斜跨介质会折射，垂直跨界方向可不变。',
      'Measure from the normal; oblique crossings refract, while normal crossings can keep direction.',
    ),
    homeExperiment: t(
      '用透明杯、水和一根吸管。从侧面看水面附近，再换到不同方向拍照或画图；拿出吸管检查。记录“看起来的位置”和“物体实际完整”，不要把单界面模型直接当成曲杯的精确计算。',
      'Use a clear cup, water and straw. View near the surface from different directions and sketch or photograph it, then remove the straw. Record apparent position and physical intactness. A one-boundary model is not an exact curved-cup calculation.',
    ),
    vocabulary: [
      t('折射', 'refraction'),
      t('折射率', 'refractive index'),
      t('临界角', 'critical angle'),
      t('全反射', 'total internal reflection'),
    ],
    questions: [
      q(
        '0°空气入水，方向怎样？',
        'At 0° air→water, what happens to direction?',
        [
          ['仍沿法线', 'Still along the normal'],
          ['必须向旁边弯', 'Must bend sideways'],
        ],
        0,
        '速度变化不要求每次方向变化。',
        'A speed change need not change direction.',
      ),
      q(
        '水入空气30°，折射角比30°？',
        'Water→air at 30°: transmitted angle compared with 30°?',
        [
          ['更小', 'Smaller'],
          ['更大', 'Larger'],
        ],
        1,
        '离法线更远，约41.80°。',
        'It is farther from the normal, about 41.80°.',
      ),
      q(
        '吸管拿出水后完整，支持哪种解释？',
        'The removed straw is intact. Which explanation fits?',
        [
          ['光路跨介质改变', 'Its light path changed between media'],
          ['水把吸管永久折断', 'Water permanently broke it'],
        ],
        0,
        '表观错位与物体断裂不同。',
        'Apparent displacement differs from physical breakage.',
      ),
    ],
    exit: q(
      '朋友说“折射就是任何时候都转弯”。哪组证据能纠正？',
      'A friend says refraction means turning at every crossing. Which evidence corrects this?',
      [
        [
          '垂直入水，方向不变而速度改变',
          'Normal entry keeps direction while speed changes',
        ],
        ['水中吸管看起来错位', 'The straw looks displaced'],
      ],
      0,
      '0°对照揭示规则的条件。',
      'The zero-angle case reveals the condition.',
    ),
  },
  {
    id: 'light-lens-real-and-virtual',
    stage: 2,
    unit: 'light',
    kind: 'light-lens',
    minutes: 20,
    title: t(
      '放大镜，为什么有时放大、有时倒过来？',
      'Why does a magnifier sometimes enlarge and sometimes invert?',
    ),
    subtitle: t(
      '沿两条主光线，分清能接到屏幕的像。',
      'Use two principal rays to find images a screen can collect.',
    ),
    hook: t(
      '放大镜贴近字能看大字，远些却可能把窗外景物倒着投到白纸上。同一块透镜，为什么出现两种结果？',
      'A magnifier near print enlarges it, yet can project an inverted distant scene onto card. Why can one lens give both results?',
    ),
    prediction: t(
      '物体在凸透镜焦点以内，能在镜另一侧用白纸接到清晰的放大像吗？',
      'With an object inside a converging lens focal distance, can a card on the other side collect its sharp enlarged image?',
    ),
    predictions: [
      t('不能，那是正立虚像', 'No: it is an upright virtual image'),
      t('一定能接到', 'Always'),
      t('完全没有光穿过', 'No light passes through'),
    ],
    explore: t(
      '焦距固定1个模型长度单位，完整比较物距3、2、0.75。第一条光线平行主轴，出镜后经过远焦点；第二条穿薄透镜中心，近似直行。实线真正交会可形成实像；虚线向后交会是虚像。',
      'Keep focal length 1 model unit and compare object distances 3, 2 and 0.75. A parallel ray leaves through the far focus; a centre ray continues approximately straight through the thin lens. Solid-ray intersections give real images; backward dashed intersections give virtual images.',
    ),
    concept: t(
      '凸透镜能让平行于主轴的近轴光会聚，焦点到透镜的距离是焦距。物距大于焦距时，这两条代表光能在另一侧交会，成倒立实像，可接到合适位置的屏幕。物距小于焦距时，出镜光仍发散，向后延长形成正立放大的虚像，可从透镜另一侧观看。',
      'A converging lens focuses near-axis parallel rays; focus distance is focal length. With an object beyond the focus, representative rays can meet on the other side, making an inverted real image collectable at the right screen position. Inside the focus, emerging rays diverge; backward extensions give an upright enlarged virtual image viewed through the other side.',
    ),
    formula: t(
      '进阶：1/f=1/dₒ+1/dᵢ；负像距表示虚像在物体侧。',
      'Extension: 1/f=1/dₒ+1/dᵢ; a negative image distance places a virtual image on the object side.',
    ),
    example: t(
      '焦距1：物距3→像距1.5、大小0.5倍倒立；物距2→像距2、1倍倒立；物距0.75→像距−3、4倍正立。图共用坐标，数值是教学长度单位，不是放大镜实测参数。',
      'At f=1: dₒ=3 gives dᵢ=1.5 and half-size inverted; dₒ=2 gives dᵢ=2 and equal-size inverted; dₒ=0.75 gives dᵢ=−3 and fourfold upright. Coordinates share one scale; these are teaching units, not a measured magnifier.',
    ),
    misconception: t(
      '“凸透镜只会放大”忽略物距。图用薄透镜、近轴、单色近似，不画每一束光，也不计算像差；中心直行规则只在这些近似下适用。光线箭头不是眼睛发出的光。',
      '“A converging lens always enlarges” ignores object distance. This thin-lens, paraxial, monochromatic approximation omits most rays and aberrations; its centre-ray rule has those limits. Arrows are not light emitted by the eye.',
    ),
    realWorld: t(
      '放大镜、相机和投影机都调整物体、透镜或屏幕之间的关系。相机把光真正汇聚到感光面；看虚像则由眼睛继续处理收到的光。',
      'Magnifiers, cameras and projectors adjust object, lens or screen relationships. A camera focuses light on its sensor; viewing a virtual image relies on your eye processing received light.',
    ),
    summary: t(
      '焦点外可成倒立实像；焦点内可看正立放大虚像。',
      'Beyond focus: inverted real image. Inside focus: upright enlarged virtual image.',
    ),
    homeExperiment: t(
      '用放大镜靠近书页看字，再尝试把窗外普通明亮景物的像投到白纸上，慢慢调透镜到白纸的距离。记录哪一种能接到白纸。始终避开太阳，不能用透镜看太阳或聚光点火。',
      'View print with a magnifier close to it. Then try projecting an ordinary bright outdoor scene onto card, adjusting lens–card distance. Record which image is collectable. Keep the Sun out of the view and never focus sunlight or start a fire.',
    ),
    vocabulary: [
      t('凸透镜', 'converging lens'),
      t('焦距', 'focal length'),
      t('实像', 'real image'),
      t('主轴', 'principal axis'),
    ],
    questions: [
      q(
        '物距3、焦距1，模型像距？',
        'Object distance 3, focal length 1. Image distance?',
        [
          ['1.5', '1.5'],
          ['3', '3'],
        ],
        0,
        '1/dᵢ=1−1/3=2/3。',
        '1/dᵢ=1−1/3=2/3.',
      ),
      q(
        '0.75物距的4倍正立像是哪种？',
        'The fourfold upright image at dₒ=0.75 is which?',
        [
          ['屏幕上的实像', 'Real image on a screen'],
          ['物体侧的虚像', 'Virtual image on the object side'],
        ],
        1,
        '真实出镜光不在该处交会。',
        'Actual emerging rays do not meet there.',
      ),
      q(
        '哪个图能表示白纸接到的清晰像？',
        'Which diagram represents a sharp image on card?',
        [
          ['真实光线在屏幕位置交会', 'Real rays meet at the screen'],
          ['只有向后虚线交会', 'Only backward dashed lines meet'],
        ],
        0,
        '屏幕接收实际到达的光。',
        'A screen receives actually arriving light.',
      ),
    ],
    exit: q(
      '同一凸透镜把远处景物缩小倒立，却把近处字放大正立，矛盾吗？',
      'One lens makes a distant scene small and inverted but nearby print large and upright. Contradiction?',
      [
        ['是，透镜应总是放大', 'Yes: a lens must always enlarge'],
        [
          '不，两种物距分别在焦点外和内',
          'No: the object distances lie outside and inside focus',
        ],
      ],
      1,
      '物距改变会改变像的位置、大小和实虚。',
      'Object distance changes image location, size and real/virtual character.',
    ),
  },
  {
    id: 'light-colour-white-and-rainbow',
    stage: 2,
    unit: 'light',
    kind: 'light-colour',
    minutes: 20,
    title: t(
      '彩虹的颜色，原本藏在哪里？',
      'Where were the rainbow colours hiding?',
    ),
    subtitle: t(
      '用棱镜分开已有的光，再试一个滤光片。',
      'Separate existing light with a prism, then try a filter.',
    ),
    hook: t(
      '阳光看起来白，雨后却铺开一条彩虹。棱镜是制造了颜色，还是把已有成分送向不同方向？只有红光进去会不会也出来七色？',
      'Sunlight looks white, yet rain can reveal a rainbow. Does a prism create colours or send existing components in different directions? Would red light alone make seven colours?',
    ),
    prediction: t(
      '只有红色光进入理想透明棱镜，会出来完整白光谱吗？',
      'Only red light enters an ideal transparent prism. Does a full white-light spectrum emerge?',
    ),
    predictions: [
      t('不会，只偏转已有红光', 'No: it redirects the existing red'),
      t('会，棱镜制造其余颜色', 'Yes: it creates the other colours'),
      t('光一定消失', 'Light always disappears'),
    ],
    explore: t(
      '完整追踪白光代表组、仅红组、红+绿组。图用三个色带代表：白光实际含广泛可见波长，不只是三条线。蓝色在规定棱镜里偏转稍大，红色稍小；再换滤光片，看它只通过原来就有的色带。',
      'Trace the white-light representative, red-only, and red+green cases. Three bands stand in for a broad visible spectrum, not three literal white-light wavelengths. Blue deviates more than red in this prism. Then change the filter: it only transmits bands already present.',
    ),
    concept: t(
      '可见光包含不同波长，人眼把不同组合感受成颜色。白光含多种可见成分；普通棱镜的折射率随波长变化，把不同成分偏转到不同方向，叫色散。雨滴的折射、内部反射和色散使适当方向的不同颜色进入眼睛。太阳在你背后、雨滴在前方时才有合适几何关系，不是雨滴涂出一条实物彩带。',
      'Visible light has different wavelengths; our eyes perceive combinations as colours. White light has many visible components. Wavelength-dependent refractive index in an ordinary prism redirects components differently: dispersion. Refraction, internal reflection and dispersion in raindrops send different colours toward your eye at suitable angles. A Sun behind you and rain ahead can give that geometry; drops do not paint a physical coloured ribbon.',
    ),
    example: t(
      '模型60°棱镜，入射45°，红/绿/蓝折射率规定1.51/1.52/1.53。三条光路从同一点进入，按两次折射计算。仅红组只保留红线；红+绿组无蓝线。红和绿光在同一处相加可呈黄色，混颜料则不能照搬。',
      'The 60° prism uses 45° incidence and prescribed red/green/blue indices 1.51/1.52/1.53. Paths enter at one point and follow two refractions. Red-only keeps one line; red+green has no blue. Overlapping red and green light can look yellow; paint mixing follows different rules.',
    ),
    misconception: t(
      '滤光片不会补上缺少的颜色：仅红光过理想蓝滤片，本三色带模型没有透射光。屏幕色块只是近似显示，不能代替真实光谱；RGB混出的黄与单色黄可看起来相似，成分却不同。图不是完整雨滴光路。',
      'A filter cannot supply missing colours: red-only through an ideal blue filter transmits none in this three-band model. Screen swatches are approximate, not spectra. RGB yellow and monochromatic yellow can look similar but have different composition. The diagram is not a full raindrop path.',
    ),
    realWorld: t(
      '显示屏把红绿蓝光组合成许多颜色；印刷和颜料则选择吸收哪些照来的光。红色物体主要把照明中某些红色成分送到眼睛，换灯后外观可能改变。',
      'Screens combine red, green and blue light. Ink and paint selectively absorb incident light. A red object returns certain red components of its illumination, so changing the lamp can change its appearance.',
    ),
    summary: t(
      '棱镜分开已有成分；滤片选择通过；混光与混颜料不同。',
      'A prism separates existing components; a filter selects; mixing light differs from mixing paint.',
    ),
    homeExperiment: t(
      '在家找一个已有彩虹边缘的透明装饰物，或观察喷淋后的自然彩虹，画太阳、眼睛和水滴的大致方向。也可看屏幕白、红、黄三块图，写黄块可能由红绿光组成。不要直视太阳，也不要求购买器材。',
      'Look for colour fringes in an existing clear decoration, or observe a natural rainbow. Sketch Sun, eye and drop directions. Alternatively compare white, red and yellow screen patches and note how yellow may combine red and green light. Do not look at the Sun; no equipment purchase is needed.',
    ),
    vocabulary: [
      t('色散', 'dispersion'),
      t('白光', 'white light'),
      t('滤光片', 'filter'),
      t('波长', 'wavelength'),
    ],
    questions: [
      q(
        '仅红光通过棱镜会出现蓝光吗？',
        'Can red-only input yield blue in this prism?',
        [
          ['不会', 'No'],
          ['一定会', 'Always'],
        ],
        0,
        '理想透明棱镜只改变已有成分方向。',
        'This ideal transparent prism redirects existing components.',
      ),
      q(
        '本模型红光过蓝滤片，有透射色带吗？',
        'Red-only through this blue filter: any transmitted band?',
        [
          ['有蓝光', 'Blue'],
          ['没有', 'None'],
        ],
        1,
        '过滤不能制造蓝成分。',
        'Filtering cannot create a blue component.',
      ),
      q(
        '红和绿光在同一屏幕处相加可显什么？',
        'Overlapping red and green light can appear which colour?',
        [
          ['黄', 'Yellow'],
          ['必然和颜料混合一样', 'Always like mixed paint'],
        ],
        0,
        '这是光的相加，不是颜料相减。',
        'This is additive light, not subtractive pigment mixing.',
      ),
    ],
    exit: q(
      '红灯照棱镜没有完整彩带，同学说棱镜坏了。你的解释？',
      'A red lamp yields no full spectrum through a prism. Is it broken?',
      [
        [
          '输入缺少其他成分，棱镜没有制造它们',
          'Other components were absent; the prism did not create them',
        ],
        ['所有棱镜必须输出同样七色', 'Every prism must output seven colours'],
      ],
      0,
      '先查光源成分，再解释输出。',
      'Inspect the source composition before interpreting the output.',
    ),
  },
  {
    id: 'light-eye-focus-on-retina',
    stage: 2,
    unit: 'light',
    kind: 'light-eye',
    minutes: 19,
    title: t(
      '从远处看回书本，眼睛调了哪里？',
      'Look from far away back to a book. What adjusts?',
    ),
    subtitle: t(
      '视网膜不搬家，改变会聚能力来对焦。',
      'Keep the retina fixed and change focusing strength.',
    ),
    hook: t(
      '先看窗外树叶，再看手里的字，两边都能清楚。相机能移动透镜，眼球里的屏幕却不能随意前后走。光该在哪里交会？',
      'Look at distant leaves and then nearby print: both can become sharp. A camera may move its lens, but your eye cannot freely move its inner screen. Where should the light meet?',
    ),
    prediction: t(
      '近物体使原模型焦点落到视网膜后方，应增强还是减弱会聚能力？',
      'A nearer object shifts the model focus behind the retina. Should convergence become stronger or weaker?',
    ),
    predictions: [
      t('增强，让焦距变短', 'Stronger, shorter focal length'),
      t('减弱，焦距更长', 'Weaker, longer focal length'),
      t('把视网膜搬走', 'Move the retina'),
    ],
    explore: t(
      '完整比较远处已对焦、近处未调整、近处已调整。视网膜一直在模型1.5处。物距3→2而焦距仍1时，两条光在视网膜不同位置；焦距改6/7后再次交在视网膜。',
      'Compare far focused, near unadjusted, and near adjusted. The retina stays at model distance 1.5. Changing object distance 3→2 at f=1 makes the rays hit different retinal positions. Setting f=6/7 brings them together again.',
    ),
    concept: t(
      '角膜和晶状体共同折射光，视网膜上的感光细胞把信号传给大脑。看近处时，正常眼睛通过晶状体形状改变增强会聚，称调节；不是眼睛向物体发光。视网膜上的光学像倒立，但我们看到的世界由大脑处理，不是把一张小照片机械翻转。',
      'Cornea and crystalline lens refract light together. Retinal photoreceptors send signals to the brain. For near viewing, a typical healthy eye changes lens shape to strengthen convergence: accommodation. It does not emit sight rays. The retinal optical image is inverted; perceived orientation involves brain processing, not mechanically flipping a little photograph.',
    ),
    example: t(
      '用单薄透镜代替整个眼的模型：物距3、焦距1，像距1.5正好对焦；物距2、焦距1，像距2落在视网膜后；物距2、焦距6/7，像距回到1.5。数字只说明关系，不是人眼尺寸或视力检查。',
      'A single thin lens stands in for the whole eye. dₒ=3, f=1 gives dᵢ=1.5 on the retina. dₒ=2, f=1 gives dᵢ=2 behind it. dₒ=2, f=6/7 restores dᵢ=1.5. These numbers illustrate a relation, not eye dimensions or a vision test.',
    ),
    misconception: t(
      '两条光线表示同一物点来的光，不是整幅图；它们在视网膜的间距仅是本模型的对焦线索，不是实际模糊直径。瞳孔主要控制进入的光量，不是通过把视网膜移来移去对焦。',
      'The two rays come from one object point, not a complete picture. Their retinal separation is a model focusing cue, not an actual blur diameter. The pupil mainly regulates incoming light amount; it does not focus by moving the retina.',
    ),
    realWorld: t(
      '眼镜和相机都围绕“光是否到达正确成像面”工作。不同的屈光问题需要不同校正；本课帮你理解对焦，不能用屏幕图诊断视力或选眼镜。',
      'Spectacles and cameras concern whether light reaches the right image plane. Different refractive conditions need different correction. This lesson explains focusing; its screen diagram cannot diagnose vision or select spectacles.',
    ),
    summary: t(
      '光进眼睛；调节会聚能力，让像落在固定视网膜上。',
      'Light enters the eye; adjust convergence to focus on the fixed retina.',
    ),
    homeExperiment: t(
      '舒适地先看房间远处文字，再看正常阅读距离的书页，给眼睛一点调整时间。记录看向哪里，不做长时间凝视、不比较谁“视力更好”。画角膜/晶状体→视网膜→大脑的信息路径。',
      'Comfortably look at distant room lettering, then a book at normal reading distance, allowing adjustment time. Record where you looked without prolonged staring or ranking eyesight. Sketch cornea/lens → retina → brain.',
    ),
    vocabulary: [
      t('视网膜', 'retina'),
      t('调节', 'accommodation'),
      t('晶状体', 'crystalline lens'),
      t('对焦', 'focusing'),
    ],
    questions: [
      q(
        '本眼模型中哪项一直固定？',
        'What stays fixed in the eye model?',
        [
          ['视网膜位置', 'Retinal position'],
          ['物体距离', 'Object distance'],
        ],
        0,
        '三组视网膜一直在1.5处。',
        'The retina stays at 1.5 in all three cases.',
      ),
      q(
        '近物未调整时像距2，视网膜1.5，光在哪里会聚？',
        'Unadjusted near image at 2, retina at 1.5: where is convergence?',
        [
          ['视网膜前', 'Before the retina'],
          ['视网膜后', 'Behind the retina'],
        ],
        1,
        '像距大于视网膜距离。',
        'The image distance exceeds the retinal distance.',
      ),
      q(
        '看近物的模型怎样恢复对焦？',
        'How does the near-object model recover focus?',
        [
          ['焦距1→6/7，会聚增强', 'f: 1→6/7, stronger convergence'],
          ['焦距1→2，会聚减弱', 'f: 1→2, weaker convergence'],
        ],
        0,
        '更短焦距让交会回到1.5。',
        'A shorter focal length restores intersection at 1.5.',
      ),
    ],
    exit: q(
      '朋友说“看近处清楚，是视网膜跑到后面接住像”。模型中怎样验证？',
      'A friend says near focusing moves the retina backward. What does the model show?',
      [
        [
          '视网膜固定，焦距改变后光重新交在它上面',
          'Fixed retina; changed focal length restores convergence there',
        ],
        ['眼睛发光照到文字', 'The eye emits light at the print'],
      ],
      0,
      '改变会聚能力可以移动成像位置，无需移动视网膜。',
      'Changing convergence moves the image position without moving the retina.',
    ),
  },
];
