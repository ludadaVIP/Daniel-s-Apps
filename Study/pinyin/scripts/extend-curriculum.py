"""Author-reviewed curriculum source for lessons 05–24. Never replaces lessons 01–04."""
import json
import random
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1] / 'curriculum'
def load(name): return json.loads((ROOT/name).read_text())
def save(name, value):
    dest = ROOT/name
    dest.parent.mkdir(parents=True, exist_ok=True)
    dest.write_text(json.dumps(value, ensure_ascii=False, indent=2)+'\n')

vocabulary = {w['id']: w for w in load('lexicon/vocabulary.json')}
audio = {w['id']: w for w in load('lexicon/audio-manifest.json')}
roadmap = load('roadmap.json')
skills = {s['id']: s for s in load('lexicon/skills.json')}

def skill(id, label, lesson, dimension='reading'):
    skills[id] = dict(id=id, label=label, dimension=dimension, introducedIn=lesson)

for row in [
('initial-gkh','g / k / h',5),('initial-jqx','j / q / x',5),('retroflex','平舌 / 翘舌',6),
('whole-first','zhi chi shi ri zi ci si',7),('yw-first','yi wu yu',7),
('compound-a','ai ei ao ou',9),('compound-b','ui iu ie üe er',10),
('nasal-front','an en in un ün',11),('nasal-back','ang eng ing ong',12),
('three-part','介音与三拼组合',13),('abbreviation','iou / uei / uen 省略',14),
('umlaut-rule','j q x 后省略 ü 两点',14),('yw-rule','y / w 的书写规则',15),
('boundary','隔音符号与音节边界',15),('whole-second','16 个整体认读音节',15),
('tone-placement','标调位置',16),('connected-speech','轻声与自然连读',16),
('reading-words','拼音词语解码',13),('reading-passage','拼音短文阅读',16),
('ime-words','词组输入',18,'typing'),('ime-context','按语境选择同音字',19,'typing'),
('ime-sentences','句子与中文标点',20,'typing'),('keyboard-repair','拼写与选词纠错',22,'typing'),
('expression','独立中文表达',23,'typing'),('independent','离开提示独立使用',24,'typing')]: skill(*row)
for id,number in [('map',1),('final-a',2),('final-iu',2),('tones',3),('initial-bp',4),('initial-dt',4),('initial-other',4),('blend',4),('keyboard',8),('umlaut',14),('ime',17)]: skills[id]['introducedIn']=number

# All marked spellings and keyboard strings are explicit; ü is not inferred by stripping marks.
def word(id, hanzi, marked, plain, lesson, speech=None, **extra):
    vocabulary[id] = dict(id=id, hanzi=hanzi, pinyinMarked=marked, pinyinPlain=plain, audio=id, introducedIn=lesson, **extra)
    audio[id] = dict(id=id, text=speech or hanzi, voice='Tingting', locale='zh-CN', source='macOS local speech synthesis', note='按词语语境合成；书面拼音保留规范标调。')
    return id

# Stage 2: initials and whole syllables, without untaught compound/nasal finals.
for id,h,p,k,lesson,speech in [
('ge','哥','gē','ge',5,None),('ke','可','kě','ke',5,'可以'),('he','喝','hē','he',5,'喝水'),('ji','鸡','jī','ji',5,None),('qu','去','qù','qu',5,None),('xi','洗','xǐ','xi',5,None),
('ga','嘎','gā','ga',5,'嘎嘎'),('ka','卡（卡片）','kǎ','ka',5,'卡片'),('ha','哈','hā','ha',5,'哈哈'),('qi','七','qī','qi',5,None),('xu','许','xǔ','xu',5,'允许'),
('zi1','资','zī','zi',6,'资料'),('zhi1','知','zhī','zhi',6,'知道'),('ci1','疵','cī','ci',6,'瑕疵'),('chi1','吃','chī','chi',6,None),('si1','丝','sī','si',6,None),('shi1','诗','shī','shi',6,None),('ri','日','rì','ri',6,None),
('zi4','字','zì','zi',7,None),('shi4','是','shì','shi',7,None),('wu3','五','wǔ','wu',7,None),('yu3','雨','yǔ','yu',7,None),('cha','茶','chá','cha',6,None),('sha','沙','shā','sha',6,None),('ci4','次','cì','ci',7,None),('zhi3','纸','zhǐ','zhi',7,None),
('chiba','吃吧','chī ba','chiba',8,None),('qishu','七叔','qī shū','qishu',8,'七叔'),('muyu','木鱼','mùyú','muyu',8,None),('mu','木','mù','mu',8,None),('shi2','十','shí','shi',8,None),
# Stage 3: compound and nasal finals.
('ai','爱','ài','ai',9,None),('mei','没（没有）','méi','mei',9,'没有'),('tou','头','tóu','tou',9,None),('lao','老','lǎo','lao',9,None),('hai','海','hǎi','hai',9,None),('fei','飞','fēi','fei',9,None),('mao','猫','māo','mao',9,None),('gou','狗','gǒu','gou',9,None),('bei','杯','bēi','bei',9,None),('pao','跑','pǎo','pao',9,None),('baobei','宝贝','bǎobèi','baobei',9,None),
('shui','水','shuǐ','shui',10,None),('niu','牛','niú','niu',10,None),('xie','写','xiě','xie',10,None),('yue','月','yuè','yue',10,None),('xue','雪','xuě','xue',10,None),('er','耳','ěr','er',10,None),('gui','归','guī','gui',10,'归来'),('liu','六','liù','liu',10,None),('tie','铁','tiě','tie',10,None),('lv4','略（略微）','lüè','lve',10,'略微'),('feiji','飞机','fēijī','feiji',10,None),
('lan','蓝','lán','lan',11,None),('men','门','mén','men',11,None),('xin','心','xīn','xin',11,None),('lun','轮','lún','lun',11,'车轮'),('yun','云','yún','yun',11,None),('shan','山','shān','shan',11,None),('ben','本','běn','ben',11,None),('jin','金','jīn','jin',11,None),('qun','群','qún','qun',11,None),('luntai','轮胎','lúntāi','luntai',11,None),('xinxin','信心','xìnxīn','xinxin',11,None),
('mang','忙','máng','mang',12,None),('feng','风','fēng','feng',12,None),('ting','听','tīng','ting',12,None),('hong','红','hóng','hong',12,None),('jing','京','jīng','jing',12,'北京'),('lin','林','lín','lin',12,'树林'),('ling','铃','líng','ling',12,'铃声'),('xing','星','xīng','xing',12,None),('dong','东','dōng','dong',12,None),('xingxing','星星','xīngxing','xingxing',12,None),('deng','灯','dēng','deng',12,None),
# Stage 4: explicitly taught glide combinations and orthographic rules.
('jia','家','jiā','jia',13,None),('qiao','桥','qiáo','qiao',13,None),('jian','肩','jiān','jian',13,None),('liang','两','liǎng','liang',13,None),('xiong','兄','xiōng','xiong',13,'兄弟'),('hua','花','huā','hua',13,None),('guo','国','guó','guo',13,'国家'),('kuai','快','kuài','kuai',13,None),('guan','关','guān','guan',13,None),('huang','黄','huáng','huang',13,None),('yuan','远','yuǎn','yuan',13,None),('xuan','选','xuǎn','xuan',13,None),('xiongmao','熊猫','xióngmāo','xiongmao',13,None),('qian','前','qián','qian',13,None),('guang','光','guāng','guang',13,None),('kuan','宽','kuān','kuan',13,None),('xia','下','xià','xia',13,None),('miao','秒','miǎo','miao',13,None),('chuang','窗','chuāng','chuang',13,None),
('jiu','九','jiǔ','jiu',14,None),('tui','推','tuī','tui',14,None),('dun','吨','dūn','dun',14,None),('ju','居','jū','ju',14,'居住'),('lvse','绿色','lǜsè','lvse',14,None),('nver','女儿',"nǚ'ér",'nver',14,None),('qu4','取','qǔ','qu',14,None),('xuexi','学习','xuéxí','xuexi',14,None),('nue','虐','nüè','nve',14,'虐待'),
('ye','夜','yè','ye',15,None),('yin','音','yīn','yin',15,None),('ying','英','yīng','ying',15,'英语'),('wo','我','wǒ','wo',15,None),('you','有','yǒu','you',15,None),('xian-city','西安',"Xī'ān","xi'an",15,None),('xian','先','xiān','xian',15,'先后'),('yong','用','yòng','yong',15,None),('wai','外','wài','wai',15,None),('wan','弯','wān','wan',15,None),('yang','羊','yáng','yang',15,None),
('liu2','流','liú','liu',16,'流水'),('pengyou','朋友','péngyou','pengyou',16,None),('yige','一个','yī gè','yige',16,None),('bushi','不是','bù shì','bushi',16,None),('liu3','柳','liǔ','liu',16,'柳树'),('shouji','手机','shǒujī','shouji',16,None),
# Later-stage meaningful words and sentences.
('zhongwen','中文','Zhōngwén','zhongwen',17,None),('shijian','时间','shíjiān','shijian',18,None),('dianying','电影','diànyǐng','dianying',18,None),('tushuguan','图书馆','túshūguǎn','tushuguan',18,None),('jiqiren','机器人','jīqìrén','jiqiren',18,None),('kexue','科学','kēxué','kexue',18,None),('tiankong','天空','tiānkōng','tiankong',18,None),('yundong','运动','yùndòng','yundong',18,None),('lanqiu','篮球','lánqiú','lanqiu',18,None),('diannao','电脑','diànnǎo','diannao',18,None),('youxi','游戏','yóuxì','youxi',18,None),('shiqing','事情','shìqing','shiqing',19,None),('zai4','在','zài','zai',19,None),('zai-again','再','zài','zai',19,None),('zaijian','再见','zàijiàn','zaijian',19,None),('shiyan','实验','shíyàn','shiyan',19,None),('shizai','实在','shízài','shizai',19,None),('shizai-context','是在','shì zài','shizai',19,'是在学校'),('lvseshiwu','绿色植物','lǜsè zhíwù','lvsezhiwu',22,None),
]:
    # Apostrophes in pinyin names use the standard ASCII separator.
    word(id,h,p,k,lesson,speech)

# Sentence forms keep citation tones (一/不) except in explicit listening examples.
for row in [
('we-read','我们看书。','Wǒmen kàn shū.','womenkanshu',16),
('you-reading','你在看书吗？','Nǐ zài kàn shū ma?','nizaikanshuma',16),
('good-friend','你好，朋友！','Nǐ hǎo, péngyou!','nihaopengyou',16),
('at-school','我在学校。','Wǒ zài xuéxiào.','wozaixuexiao',19),
('see-tomorrow','明天再见。','Míngtiān zàijiàn.','mingtianzaijian',19),
('have-time','我有时间。','Wǒ yǒu shíjiān.','woyoushijian',19),
('lab-small','我们做实验。','Wǒmen zuò shíyàn.','womenzuoshiyan',19),
('book-question','你今天想看什么书？','Nǐ jīntiān xiǎng kàn shénme shū?','nijintianxiangkanshenmeshu',20),
('science-fun','科学很有趣。','Kēxué hěn yǒuqù.','kexuehenyouqu',20),
('play-ball','我和朋友打篮球。','Wǒ hé péngyou dǎ lánqiú.','wohepengyoudalanqiu',20),
('robot-move','机器人向前走。','Jīqìrén xiàng qián zǒu.','jiqirenxiangqianzou',20),
('clouds','今天有风，也有云。','Jīntiān yǒu fēng, yě yǒu yún.','jintianyoufengyeyouyun',20),
('water-msg','请给植物浇一点水。','Qǐng gěi zhíwù jiāo yī diǎn shuǐ.','qinggeizhiwujiaoyidianshui',20),
('rewrite-zai','明天再来。','Míngtiān zài lái.','mingtianzailai',22),
('where-school','学校在哪里？','Xuéxiào zài nǎlǐ?','xuexiaozainali',22),
('green-leaf','这片叶子是绿色的。','Zhè piàn yèzi shì lǜsè de.','zhepianyezishilvsede',22),
('introduce','我想介绍一种发明。','Wǒ xiǎng jièshào yī zhǒng fāmíng.','woxiangjieshaoyizhongfaming',23),
('outside-msg','请把我的发现记下来。','Qǐng bǎ wǒ de fāxiàn jì xiàlái.','qingbawodefaxianjixialai',24),
]: word(*row)

# Original short stories, manually aligned Chinese/pinyin/keyboard text.
word('story-w4','晚上，我看见窗外有一颗星。小猫走到窗前，安静地看着天空。我把这个发现记在本子上。','Wǎnshang, wǒ kànjiàn chuāngwài yǒu yī kē xīng. Xiǎomāo zǒu dào chuāng qián, ānjìng de kànzhe tiānkōng. Wǒ bǎ zhège fāxiàn jì zài běnzi shàng.','wanshangwokanjianchuangwaiyouyikexingxiaomaozoudaochuangqiananjingdekanzhetiankongwobazhegefaxianjizaibenzishang',16)
word('story-robot','机器人停在门前。它听见铃声，却没有开门。我检查电脑上的指令，发现方向写错了。改好以后，它向右转，再走两步，终于找到了入口。','Jīqìrén tíng zài mén qián. Tā tīngjiàn língshēng, què méiyǒu kāi mén. Wǒ jiǎnchá diànnǎo shàng de zhǐlìng, fāxiàn fāngxiàng xiě cuò le. Gǎi hǎo yǐhòu, tā xiàng yòu zhuǎn, zài zǒu liǎng bù, zhōngyú zhǎodào le rùkǒu.','jiqirentingzaimenqiantatingjianlingshengquemeiyoukaimenwojianchadiannaoshangdezhilingfaxianfangxiangxiecuolegaihaoyihoutaxiangyouzhuanzaizouliangbuzhongyuzhaodaolerukou',21)
word('story-stars','夜里，天空很清楚。我和朋友走到窗前，看到几颗明亮的星。我们没有急着猜名字，先画下它们的位置，再查星图。原来，仔细观察也能解开一个小谜题。','Yèlǐ, tiānkōng hěn qīngchu. Wǒ hé péngyou zǒu dào chuāng qián, kàndào jǐ kē míngliàng de xīng. Wǒmen méiyǒu jí zhe cāi míngzi, xiān huà xià tāmen de wèizhi, zài chá xīngtú. Yuánlái, zǐxì guānchá yě néng jiěkāi yī gè xiǎo mítí.','yelitiankonghenqingchuwohepengyouzoudaochuangqiankandaojikemingliangdexingwomenmeiyoujizhecaimingzixianhuaxiatamendeweizhizaichaxingtuyuanlaizixiguanchayenengjiekaiyigexiaomiti',21)
word('message-week5','今天我和朋友在学校看了一本关于机器人的书。我们想做一个小实验，先写下步骤，再用电脑记录结果，明天一起讨论。','Jīntiān wǒ hé péngyou zài xuéxiào kàn le yī běn guānyú jīqìrén de shū. Wǒmen xiǎng zuò yī gè xiǎo shíyàn, xiān xiě xià bùzhòu, zài yòng diànnǎo jìlù jiéguǒ, míngtiān yīqǐ tǎolùn.','jintianwohepengyouzaixuexiaokanleyibenguanyujiqirendeshuwomenxiangzuoyigexiaoshiyanxianxiexiabuzhouzaiyongdiannaojilujieguomingtianyiqitaolun',20)
word('message-invention','我最感兴趣的发明是机器人。它可以帮助人们搬东西，也可以在危险的地方工作。我想设计一个给植物浇水的机器人，先检查土壤是否干燥，再决定要不要加水。这样既方便，也能节约用水。','Wǒ zuì gǎn xìngqù de fāmíng shì jīqìrén. Tā kěyǐ bāngzhù rénmen bān dōngxi, yě kěyǐ zài wēixiǎn de dìfang gōngzuò. Wǒ xiǎng shèjì yī gè gěi zhíwù jiāo shuǐ de jīqìrén, xiān jiǎnchá tǔrǎng shìfǒu gānzào, zài juédìng yào bu yào jiā shuǐ. Zhèyàng jì fāngbiàn, yě néng jiéyuē yòng shuǐ.','wozuiganxingqudefamingshijiqirentakeyibangzhurenmenbandongxiyekeyizaiweixiandedifanggongzuowoxiangshejiyigegeizhiwujiaoshuidejiqirenxianjianchaturangshifouganzaozaijuedingyaobuyaojiashuizheyangjifangbianyenengjieyueyongshui',23)
word('message-final','今天我用电脑记录了一个有趣的发现。窗边的植物总是向着光生长，我想知道换一个位置会怎样。明天我会把花盆转一下，拍照并写下变化。一周以后，再比较照片，看看我的猜想对不对。','Jīntiān wǒ yòng diànnǎo jìlù le yī gè yǒuqù de fāxiàn. Chuāng biān de zhíwù zǒngshì xiàngzhe guāng shēngzhǎng, wǒ xiǎng zhīdào huàn yī gè wèizhi huì zěnyàng. Míngtiān wǒ huì bǎ huāpén zhuǎn yī xià, pāizhào bìng xiě xià biànhuà. Yī zhōu yǐhòu, zài bǐjiào zhàopiàn, kànkan wǒ de cāixiǎng duì bu duì.','jintianwoyongdiannaojiluleyigeyouqudefaxianchuangbiandezhiwuzongshixiangzheguangshengzhangwoxiangzhidaohuanyigeweizhihuizenyangmingtianwohuibahuapenzhuanyixiapaizhaobingxiexiabianhuayizhouyihouzaibijiaozhaopiankankanwodecaixiangduibudui'.replace(' ','').lower(),24)
# The final reading uses an unseen context made exclusively from covered rules.
word('story-final','周末，我和朋友在公园里看见一只小鸟。它停在树枝上，轻轻地叫。我们没有走近，而是站在远处，用本子记下它的颜色和声音。','Zhōumò, wǒ hé péngyou zài gōngyuán lǐ kànjiàn yī zhī xiǎoniǎo. Tā tíng zài shùzhī shàng, qīngqīng de jiào. Wǒmen méiyǒu zǒu jìn, ér shì zhàn zài yuǎn chù, yòng běnzi jì xià tā de yánsè hé shēngyīn.','zhoumowohepengyouzaigongyuanlikanjianyizhixiaoniaotatingzaishuzhishangqingqingdejiaowomenmeiyouzoujinershizhanzaiyuanchuyongbenzijixiatadeyanseheshengyin',24)

lesson_id = ''
question_list = []
def start(number, subtitle, word_ids, skill_ids, minutes=18):
    global lesson_id, question_list
    lesson_id=f'L{number:02}'
    question_list=[]
    roadmap[number-1].update(subtitle=subtitle,wordIds=word_ids,skills=skill_ids,available=True,minutes=minutes)
def add(type, prompt, answers, word_id=None, options=None, skill_ids=None, tag='spelling_rule', **extra):
    n=len(question_list)+1
    q=dict(id=f'{lesson_id}-Q{n:02}',lessonId=lesson_id,type=type,phase='review' if n<=4 else 'guided' if n<=8 else 'challenge',prompt=prompt,acceptedAnswers=[answers] if isinstance(answers,str) else answers,skillIds=skill_ids or roadmap[int(lesson_id[1:])-1]['skills'][:1],errorTag=tag,feedback=extra.pop('feedback',''))
    if word_id:q['wordId']=word_id
    if options:
        q['options']=[dict(label=o,value=o) if isinstance(o,str) else o for o in options]
        random.Random(q['id']).shuffle(q['options'])
        if type=='pinyin_to_audio':
            for i,o in enumerate(q['options']):o['label']=f'声音 {i+1}'
    q.update(extra)
    assert q['feedback'],q['id']
    question_list.append(q)
    return q

def read(id, skill_ids=None, transfer=False, prompt='先独立读拼音，再揭示汉字核对。', **extra):
    w=vocabulary[id]
    tags = set(skill_ids or [])
    tag = 'tone_error' if tags & {'tones','tone-placement','connected-speech'} else 'initial_confusion' if tags & {'initial-gkh','initial-jqx','retroflex','initial-bp','initial-dt'} else 'front_back_nasal' if tags & {'nasal-front','nasal-back'} else 'final_confusion' if tags & {'compound-a','compound-b','three-part'} else 'reading_decode'
    return add('read_aloud',prompt,'self',id,skill_ids=skill_ids,tag=tag,transfer=transfer,feedback=f'「{w["hanzi"]}」写作 {w["pinyinMarked"]}。先按已学规则拆音节，再连起来读；遇到轻声要轻而短。',**extra)
def hear(id, options, skill_ids=None, tag='initial_confusion', feedback=None, prompt=None):
    w=vocabulary[id]
    return add('audio_to_pinyin',prompt or ('听词语的第二个音节，选出对应拼音。' if id in ['jing','ci1','xu','lin'] else '听中文声音，选出第一个音节的拼音。'),w['pinyinMarked'],id,options,skill_ids,tag,feedback=feedback or f'「{w["hanzi"]}」的拼音是 {w["pinyinMarked"]}。比较选项不同的字母或调号，再听一遍。')
def choose(prompt, answer, options, feedback, skill_ids=None, tag='spelling_rule', **extra):
    return add('contrast_pairs',prompt,answer,options=options,skill_ids=skill_ids,tag=tag,feedback=feedback,**extra)
def keyboard(id, skill_ids=None, transfer=False, **extra):
    w=vocabulary[id]
    return add('type_pinyin','切到英文键盘，用无调全拼写出目标词。',w['pinyinPlain'],id,skill_ids=skill_ids or ['keyboard'],tag='typo',feedback=f'阅读拼音：{w["pinyinMarked"]}；全拼键入：{w["pinyinPlain"]}。逐音节检查字母，ü 的常见按键是 v。',transfer=transfer,**extra)
def ime(id, skill_ids=None, feedback=None, **extra):
    w=vocabulary[id]
    return add('type_hanzi_ime',extra.pop('prompt','用系统中文拼音输入法，输入目标文字。'),w['hanzi'],id,skill_ids=skill_ids or ['ime'],tag='ime_candidate',feedback=feedback or f'可键入 {w["pinyinPlain"]}，根据意思选择「{w["hanzi"]}」。检查最终汉字和标点，不要求候选词排在固定位置。',**extra)
def assemble(id, initial, final, tone, other_initial, other_final, **extra):
    return add('assemble_syllable','拆开目标音节，找出正确的声母、书写韵母与声调。',f'{initial}|{final}|{tone}',id,skill_ids=extra.pop('skill_ids',['blend']),parts=dict(initial=other_initial,final=other_final,tone=['1','2','3','4']),feedback=f'{initial} + {final} + {tone} 声 → {vocabulary[id]["pinyinMarked"]}。这里按经过核对的完整音节判定。',**extra)
def finish():
    assert len(question_list)==16,(lesson_id,len(question_list))
    save(f'exercises/lesson-{int(lesson_id[1:]):02}.json',question_list)

# L05: two initial families, plus independent transfers using already covered single finals.
start(5,'g k h j q x，听出开头，别念英文字母名称',['ge','ke','he','ji','qu','xi'],['initial-gkh','initial-jqx'])
for id in ['ba1','pa4','da4','ni']:read(id,['blend'])
hear('ge',['gē','kē','hē'],['initial-gkh'],feedback='gē 的开头是 g；k 的送气更明显，h 有摩擦声。')
hear('ke',['gě','kě','hě'],['initial-gkh'],feedback='kě 的 k 要送气。先听「可以」，再注意开头的气流。')
hear('ji',['jī','qī','xī'],['initial-jqx'],feedback='jī 不是英语字母 J 的名字。j 是短开头，和 i 连成「鸡」。')
hear('qu',['qù','qǔ','xù'],['initial-jqx'],feedback='去 qù 是四声；q 后的 u 表示 ü 音，不读普通 u。省略两点的完整规则在第 14 课。')
hear('he',['hē','gē','kē'],['initial-gkh'])
hear('xi',['xǐ','qǐ','jǐ'],['initial-jqx'],feedback='xǐ 读「洗」，留意 x 的摩擦声。不要读成英语 X。')
choose('j q x 后的 u，在 qù 中表示什么声音？','ü 音',['ü 音','普通 u 音','英语 U 的字母名'],'qù 里的 u 是 ü 去掉两点的写法。先会读这个真实音节，后面再总结规则。',['initial-jqx'])
assemble('ge','g','e','1',['g','k','h'],['a','e','i'],skill_ids=['initial-gkh','blend'])
for id in ['ga','ha']:read(id,['initial-gkh'],transfer=True)
for id in ['qi','xu']:read(id,['initial-jqx'],transfer=True)
finish()

start(6,'z c s 和 zh ch sh r，用嘴巴和耳朵找到差别',['zi1','zhi1','ci1','chi1','si1','shi1','ri'],['retroflex'])
for id in ['ge','ke','ji','qu']:read(id,['initial-gkh' if id in ['ge','ke'] else 'initial-jqx'])
for id,opts in [('zi1',['zī','zhī','sī']),('zhi1',['zhī','zī','jī']),('si1',['sī','shī','xī']),('shi1',['shī','sī','chī'])]:hear(id,opts,['retroflex'],feedback='z/c/s 的舌尖靠前；zh/ch/sh 的舌尖稍抬起。h 是组合的一部分，不能漏掉。')
hear('chi1',['cī','chī','qī'],['retroflex'])
hear('ri',['rì','shì','sì'],['retroflex'])
choose('zh、ch、sh 各是怎样的开头？','各是一个声母，写两个字母',['各是一个声母，写两个字母','两个声母要分开读','只读 z、c、s 就够了'],'zh/ch/sh 各表示一个声母。字母有两个，声音开头只有一组。',['retroflex'])
choose('shī 的开头写哪两个字母？','sh',['s','sh','ch'],'shī 的声母是 sh，不能省掉 h。',['retroflex'])
for id in ['zhi1','chi1','cha','sha']:read(id,['retroflex'],transfer=id in ['cha','sha'])
finish()

start(7,'把 zhi chi shi ri zi ci si 当成完整的声音单位',['zhi1','chi1','shi1','ri','zi4','yi','wu3','yu'],['whole-first','yw-first'])
for id in ['si1','shi1','zi1','zhi1']:read(id,['retroflex'])
hear('zhi1',['zhī','zī','jī'],['whole-first'])
hear('ri',['rì','shì','sì'],['whole-first'])
choose('shī 中的 i，能直接照「衣」的韵母读吗？','不能，先整体认读 shi',['不能，先整体认读 shi','能，把 sh 和衣随意相加'],'zhi/chi/shi/ri 与 zi/ci/si 中的 i 不等同于 yī 的 i 音，先按真实完整音节认读。',['whole-first'],tag='final_confusion')
choose('yú 表示哪个基本韵母的声音？','ü',['i','u','ü'],'yu 是 ü 开头音节的对应写法，不能按 y + 普通 u 拼读。',['yw-first'],tag='final_confusion')
for id in ['zi4','shi4','ci4','zhi3']:read(id,['whole-first'],transfer=True)
for id in ['yi','wu3','yu','yu3']:read(id,['yw-first'],transfer=id=='yu3')
finish()

start(8,'认读有调号，键入敲全拼，开始让两条线一起工作',['ni','ma1','shi4','qu','nihao','chiba'],['keyboard','retroflex','whole-first'])
for id in ['zhi3','ci4','wu3','yu3']:read(id,['whole-first' if id in ['zhi3','ci4'] else 'yw-first'])
for id in ['ni','ma1','shi4','qu']:keyboard(id)
for id in ['shu','chi1','zi4','ri']:keyboard(id)
read('muyu',['blend','whole-first'],transfer=True)
read('qishu',['initial-jqx','retroflex'],transfer=True)
keyboard('nihao',transfer=True)
keyboard('chiba',transfer=True)
finish()

start(9,'ai ei ao ou，声音滑过去，不念两个英文字母',['ai','mei','hao','tou','lao'],['compound-a'])
for id in ['shi4','qu','muyu']:read(id,['whole-first'])
keyboard('ni',['keyboard'])
for id,opts in [('ai',['ài','ǎi','èi']),('mei',['méi','mái','móu']),('hao',['hǎo','hào','hǒu']),('tou',['tóu','táo','tǒu'])]:hear(id,opts,['compound-a'],tag='final_confusion',feedback='ai/ei/ao/ou 各是一个复韵母。声音从前一个元音自然滑向后一个，中间不要断开。')
choose('hǎo 的韵母是哪一组？','ao',['ao','ou','ai'],'好 hǎo 的韵母是 ao；o 在这里不是单独再念一次。',['compound-a'],tag='final_confusion')
choose('「头」tóu 与「桃」táo，不同在哪里？','韵母 ou / ao',['韵母 ou / ao','声母完全不同','声调不同'],'tóu 与 táo 声母和声调相同，韵母分别是 ou、ao。',['compound-a'],tag='final_confusion')
for id in ['hai','fei','mao','gou']:read(id,['compound-a'],transfer=True)
read('baobei',['compound-a'],transfer=True)
read('lao',['compound-a'])
finish()

start(10,'ui iu ie üe er，把两组缩写先放进真实词里认识',['shui','niu','xie','yue','xue','er'],['compound-b'])
for id in ['hai','fei','mao','gou']:read(id,['compound-a'])
hear('shui',['shuǐ','shǔ','suǐ'],['compound-b'],tag='final_confusion',feedback='水 shuǐ 的书写韵母是 ui。注意 sh 开头和 ui 结尾；ui 的来源在第 14 课讲。')
hear('niu',['niú','ní','nǚ'],['compound-b'],tag='final_confusion')
hear('xie',['xiě','xǐ','xuě'],['compound-b'],tag='final_confusion')
hear('xue',['xuě','xiě','xǔ'],['compound-b'],tag='final_confusion',feedback='雪 xuě 中的 ue 对应 üe 音，x 后 ü 的两点省略；不是普通 u + e。')
choose('月 yuè 和雪 xuě，后面对应哪个韵母？','üe',['ie','ui','üe'],'yuè/xuě 中省略 ü 上的两点，读 üe；n/l 后的 ü 保留两点。',['compound-b'],tag='spelling_rule')
read('er',['compound-b'])
for id in ['gui','liu','tie','lv4']:read(id,['compound-b'],transfer=True)
read('feiji',['compound-a','initial-jqx'],transfer=True)
choose('niú 和 shuǐ 的标调位置有什么不同？','niu 标 u，shui 标 i',['niu 标 u，shui 标 i','都标第一个元音','都没有声调'],'先记熟这些词：iu/ui 同时出现时，调号标在后一个元音。第 16 课系统练标调。',['compound-b'],tag='tone_error')
finish()

start(11,'an en in un ün，读到鼻音 n，嘴里保留收尾',['lan','men','xin','lun','yun'],['nasal-front'])
for id in ['shui','niu','xie','xue']:read(id,['compound-b'])
for id,opts in [('lan',['lán','lái','láo']),('men',['mén','méi','móu']),('xin',['xīn','xī','xǐ']),('lun',['lún','lǔ','lùn'])]:hear(id,opts,['nasal-front'],tag='final_confusion',feedback='前鼻韵母结尾是 n；舌尖接近上齿龈收尾。不要丢掉最后的鼻音。')
choose('云 yún 的韵母对应哪组声音？','ün',['un','ün','in'],'yún 对应 ün，写法里 ü 的两点省略。它不是普通 u 的 un 音。',['nasal-front'],tag='spelling_rule')
for id in ['shan','ben','jin','qun']:read(id,['nasal-front'],transfer=True)
read('luntai',['nasal-front','compound-a'],transfer=True)
read('xinxin',['nasal-front'],transfer=True)
read('yun',['nasal-front'])
finish()

start(12,'n 与 ng，一个字母的差别，也是一条发音线索',['mang','feng','ting','hong','jin','jing','lin','ling'],['nasal-back','nasal-front'])
for id in ['lan','men','xin','yun']:read(id,['nasal-front'])
for id,opts in [('mang',['máng','mán','mǎng']),('feng',['fēng','fēn','fěng']),('ting',['tīng','tíng','tǐng']),('hong',['hóng','hǒng','hòng'])]:hear(id,opts,['nasal-back'],tag='front_back_nasal',feedback='后鼻韵母用 ng 收尾；舌根抬起，舌尖不去顶上齿龈。ng 是一个鼻音韵尾，不再单独念 g。')
hear('jing',['jīn','jīng','jǐng'],['nasal-back','nasal-front'],tag='front_back_nasal',feedback='金 jīn 用 n 收尾，北京的京 jīng 用 ng 收尾。拼写多一个 g，发音位置也不同。')
hear('ling',['lín','líng','lǐng'],['nasal-back','nasal-front'],tag='front_back_nasal',feedback='树林的林 lín 是 in；铃声的铃 líng 是 ing。对着两组音慢慢比较。')
for id in ['xing','dong','deng']:read(id,['nasal-back'],transfer=True)
read('xingxing',['nasal-back'],transfer=True)
choose('ing 结尾的 ng 应该怎样读？','一个鼻音韵尾，不另读 g',['一个鼻音韵尾，不另读 g','先读 n，再念英语 G'],'ng 合起来表示舌根鼻音，不能拆成 n + 英文字母 G。',['nasal-back'],tag='front_back_nasal')
choose('hong 的韵母是哪组？','ong',['eng','ong','un'],'hóng 的韵母是 ong；ang、eng、ing、ong 都以 ng 收尾。',['nasal-back'],tag='front_back_nasal')
finish()

start(13,'让 ia/ua/üan 等组合覆盖真实词，不再只靠背表',['jia','qiao','jian','liang','xiong','hua','guo','kuai','guan','huang','yuan','xuan'],['three-part','reading-words'],20)
for id in ['xing','jing','lin','shui']:read(id,['nasal-back' if id in ['xing','jing'] else 'nasal-front' if id=='lin' else 'compound-b'])
assemble('jia','j','ia','1',['j','q','x'],['ia','iao','ian'],skill_ids=['three-part'])
assemble('guo','g','uo','2',['g','k','h'],['ua','uo','uan'],skill_ids=['three-part'])
choose('xiōng 的书写韵母是哪一组？','iong',['ong','iong','ing'],'xiōng 的书写韵母是 iong，整组连读，不遗漏开头 i。',['three-part'],tag='final_confusion')
choose('yuǎn 的韵母声音对应哪一组？','üan',['uan','an','üan'],'yuǎn 对应 üan；ü 开头没有普通声母时用 yuan 的写法，不按 y + 普通 u 拼。',['three-part'])
for id in ['qian','guang','kuan','xia','miao','chuang']:read(id,['three-part'],transfer=True)
read('xiongmao',['reading-words','three-part'],transfer=True)
choose('看到 liǎng，最有用的拆读方式是什么？','l + iang，再连成 liǎng',['l + iang，再连成 liǎng','分别念五个英语字母','把 ng 分成两个声音'],'liǎng 里有 iang 的完整组合。介音连接得快，末尾 ng 是一个鼻音韵尾。',['three-part'])
finish()

start(14,'缩写有规律；阅读写 ü，键盘常用 v',['niu','gui','lun','ju','qu','xu','nv','lv'],['abbreviation','umlaut-rule','umlaut'],20)
for id in ['jia','guo','xiong','yuan']:read(id,['three-part'])
choose('iou 接声母后，常写成哪组？','iu',['iu','ui','ou'],'iou 接声母后缩写为 iu，例如 niú；缩写后不要漏敲 u。',['abbreviation'])
choose('uei 接声母后，常写成哪组？','ui',['iu','ui','ei'],'uei 接声母后缩写为 ui，例如 guī、shuǐ。',['abbreviation'])
choose('uen 接声母后，常写成哪组？','un',['un','en','uan'],'uen 接声母后缩写为 un，例如 lún。这里的 u 是普通 u 音。',['abbreviation'])
choose('j q x 后的 ü 两点什么时候省略？','拼写中省略，但仍读 ü 音',['拼写中省略，但仍读 ü 音','省略后改读普通 u 音','任何声母后都省略'],'jū/qù/xǔ 的 u 表示 ü 音；nǚ/lǜ 后 ü 两点要保留。',['umlaut-rule'])
for id in ['jiu','tui','dun']:read(id,['abbreviation'],transfer=True)
for id in ['nv','lv']:keyboard(id,['umlaut'])
keyboard('lvse',['umlaut'],transfer=True)
read('nver',['umlaut-rule'],transfer=True)
read('qu4',['umlaut-rule'],transfer=True)
finish()

start(15,'把 y/w、16 个整体音节和隔音符号连成一张地图',['yi','wu3','yu','ye','yue','yuan','yin','yun','ying','wo','you','xian-city'],['yw-rule','boundary','whole-second'],20)
for id in ['jiu','tui','nv','qu']:read(id,['abbreviation' if id in ['jiu','tui'] else 'umlaut-rule'])
choose('没有普通声母时，üan 对应哪个写法？','yuan',['yuan','uan','yan'],'üan 开头的音节写 yuan；ü 的两点省略。',['yw-rule'])
choose('没有普通声母时，u 开头的 uo 常写成？','wo',['wo','yo','uo'],'u 单独成音节写 wu；uo/ua/uai/uan/uang 前面的 u 常改为 w，得到 wo/wa/wai/wan/wang。',['yw-rule'])
choose('yǒu 的完整韵母来源是哪组？','iou',['iu','iou','ü'],'无声母的 iou 写 you；接声母缩写为 iu。两种写法要结合开头情况。',['yw-rule'])
choose('西安 Xī\'ān 为什么需要隔音符号？','分开 xi 和 an，避免当成 xian',['分开 xi 和 an，避免当成 xian','表示英语所有格','表示声调'],'a/o/e 开头音节接在其他音节后，必要时用隔音符号标清边界；Xī\'ān 是 xi + an。',['boundary'],tag='syllable_boundary')
for id in ['ye','yin','ying']:read(id,['whole-second'],transfer=True)
read('xian-city',['boundary'],transfer=True)
keyboard('xian-city',['boundary','keyboard'],transfer=True)
for id in ['yong','wai','wan']:read(id,['yw-rule'],transfer=True)
finish()

start(16,'读调号、认轻声，也听懂自然说话里的变化',['hao','liu2','gui','pengyou','nihao','yige','bushi','you-reading'],['tone-placement','connected-speech','reading-passage'],20)
for id in ['yuan','ying','xian-city','lv']:read(id,['whole-second' if id in ['yuan','ying'] else 'boundary' if id=='xian-city' else 'umlaut-rule'])
choose('hǎo 的调号为什么标在 a？','有 a，先标 a',['有 a，先标 a','总标第一个字母','因为 o 不会带调号'],'标调先找 a；没有 a 再找 o/e；iu/ui 并列时标后一个。',['tone-placement'],tag='tone_error')
choose('liú 和 guī 的标调位置是哪组？','liú / guī',['liú / guī','líu / gūi','liu / gui'],'iu 标 u，ui 标 i：有 a 不放过，无 a 找 o/e，iu/ui 标后一个。',['tone-placement'],tag='tone_error')
choose('朋友 péngyou 的第二个音节怎么写？','you，不标调号',['you，不标调号','yōu，一律用一声','yǒu，必须都带调'],'这里的朋友通常读轻声 péngyou；轻声不标调号，读轻而短。',['connected-speech'],tag='tone_error')
choose('「你好」连读时，书面拼音通常保留什么？','nǐ hǎo',['nǐ hǎo','必须写 ní hǎo','必须去掉所有调号'],'两个三声相连，第一个常读得像二声；规范书面拼音一般保留原调 nǐ hǎo。',['connected-speech'],tag='tone_error')
read('liu3',['tone-placement'],transfer=True)
read('shouji',['tone-placement','reading-words'],transfer=True)
read('we-read',['reading-passage'],transfer=True)
read('you-reading',['reading-passage','connected-speech'],transfer=True)
choose('「不是」自然连读时，「不」常听起来是哪种调？','二声，因后面是四声',['二声，因后面是四声','始终只能是四声','轻声，不发完整音'],'不在四声前常读二声，如口语 bú shì；常规书面注音可保留 bù shì。不要混淆发音与字面标调。',['connected-speech'],tag='tone_error')
choose('「一个」口语里，一常听起来是哪种调？','二声，后面个是四声',['二声，后面个是四声','只会是原来的一声','没有发音'],'一在四声前常读二声，如口语 yí gè；在一、二、三声前常读四声。常规书写可保留 yī。',['connected-speech'],tag='tone_error')
read('good-friend',['reading-passage','connected-speech'],transfer=True)
read('story-w4',['reading-passage'],transfer=True,readingTotal=sum('\u4e00'<=c<='\u9fff' for c in vocabulary['story-w4']['hanzi']))
finish()


for row in [
('next-see','下次再见。','Xià cì zàijiàn.','xiacizaijian',19),
('he-reading','他在看书。','Tā zài kàn shū.','tazaikanshu',19),
('try-lab','我想试着做实验。','Wǒ xiǎng shìzhe zuò shíyàn.','woxiangshizhezuoshiyan',20),
('find-question','你今天发现了什么？','Nǐ jīntiān fāxiàn le shénme?','nijintianfaxianleshenme',20),
('robot-new','我给机器人写了新指令。','Wǒ gěi jīqìrén xiě le xīn zhǐlìng.','wogeijiqirenxielexinzhiling',23),
('check-report','请先检查记录，再告诉我结果。','Qǐng xiān jiǎnchá jìlù, zài gàosu wǒ jiéguǒ.','qingxianjianchajiluzaigaosuw ojieguo'.replace(' ',''),23),
('xinwen','新闻','xīnwén','xinwen',21),
('weixin','卫星','wèixīng','weixing',21),
('chengxu','程序','chéngxù','chengxu',21),
('tansuo','探索','tànsuǒ','tansuo',21),
]: word(*row)
# Keep the week-5 message within the specified 30–50-character envelope.
vocabulary['message-week5'].update(hanzi='今天我和朋友在学校看了一本机器人的书。我们想做一个实验，先写下步骤，再用电脑记录结果。',pinyinMarked='Jīntiān wǒ hé péngyou zài xuéxiào kàn le yī běn jīqìrén de shū. Wǒmen xiǎng zuò yī gè shíyàn, xiān xiě xià bùzhòu, zài yòng diànnǎo jìlù jiéguǒ.',pinyinPlain='jintianwohepengyouzaixuexiaokanleyibenjiqirendeshuwomenxiangzuoyigeshiyanxianxiexiabuzhouzaiyongdiannaojilujieguo')
audio['message-week5']['text']=vocabulary['message-week5']['hanzi']

start(17,'真正切换输入法，让字母经过候选词变成汉字',['nihao','school','ni','shu'],['ime'],18)
for id in ['ni','shu','ma1','shi4']:keyboard(id,['keyboard'])
for id in ['ni','shu','nihao','school']:ime(id)
for id in ['yu','wu3','chi1','qu','school','nihao']:ime(id)
for id in ['zhongwen','pengyou']:ime(id,transfer=True)
finish()

start(18,'把一个词连续敲完，再检查候选词',['school','pengyou','dianying','tushuguan','jiqiren','kexue'],['ime-words'],18)
for id in ['nihao','school','zhongwen','pengyou']:ime(id,['ime'])
for id in ['school','pengyou','dianying','tushuguan']:ime(id,['ime-words'])
for id in ['jiqiren','kexue','tiankong','yundong','lanqiu','diannao','youxi','shijian']:ime(id,['ime-words'],transfer=id in ['lanqiu','shijian'])
finish()

start(19,'同一串拼音不保证同一个字，用意思选候选',['shi4','shijian','shiqing','zai4','zai-again','at-school','see-tomorrow'],['ime-context'],18)
for id in ['dianying','tushuguan','jiqiren','kexue']:ime(id,['ime-words'])
choose('表示“我处在学校这个地点”，在/再应选哪个？','在',['在','再'],'在说明位置或状态；再表示又一次、之后。它们同读 zài，要按意思选字。',['ime-context'],tag='ime_candidate')
choose('表示“明天又见面”，在/再应选哪个？','再',['再','在'],'再见里的再表示又一次。读音相同，不能仅凭听音决定是哪一个汉字。',['ime-context'],tag='ime_candidate')
ime('at-school',['ime-context'])
ime('see-tomorrow',['ime-context'])
for id in ['have-time','lab-small','shijian','shiqing']:ime(id,['ime-context'])
for id in ['next-see','he-reading']:ime(id,['ime-context'],transfer=True)
choose('shi 能对应“是、时、事”，输入句子时最可靠的方法是？','结合上下文检查候选词',['结合上下文检查候选词','永远只选第一个候选','用同音字也总能表达同样意思'],'词库和候选顺序因输入法、使用习惯而不同，最终汉字必须符合句子的意思。',['ime-context'],tag='ime_candidate')
choose('“实验”和“时间”都打不对，首先比较什么？','shiyan / shijian 的字母差异',['shiyan / shijian 的字母差异','只能换一个输入法','把所有候选都点一遍'],'实验 shíyàn 是 shiyan，时间 shíjiān 是 shijian；先分清拼写错误，再查选词。',['ime-context','keyboard'],tag='typo')
finish()

start(20,'用词组写句子，把中文标点也一起照顾好',['science','book-question','science-fun','play-ball','robot-move','clouds'],['ime-sentences'],20)
for id in ['at-school','see-tomorrow','have-time','lab-small']:ime(id,['ime-context'])
for id in ['science','book-question','play-ball','robot-move']:ime(id,['ime-sentences'])
for id in ['clouds','water-msg','try-lab','find-question']:ime(id,['ime-sentences'],transfer=id in ['try-lab','find-question'])
choose('已经打出“我再学校。”，想表达地点，应怎样改？','把再改成在，保留其他正确文字',['把再改成在，保留其他正确文字','读音一样，不需要改','只能把整段全部删除'],'候选词选择错误可以局部删除、重新选字。改错是一种能力，不是失败。',['ime-sentences','ime-context'],tag='ime_candidate')
choose('“你今天想看什么书”是问句，句末更合适的标点是？','？',['？','，','！'],'问句用问号；一般陈述句用句号。中文标点帮助读者理解语气。',['ime-sentences'],tag='typo')
ime('science-fun',['ime-sentences'],initialText='科学很有趣',prompt='这句话还缺句末标点。编辑后提交正确文字。')
ime('message-week5',['ime-sentences'],prompt='用真实输入法完成这条 30–50 字消息，检查并改好候选字。')
finish()

start(21,'先读拼音密信，再用汉字核对自己的解码',['weixin','chengxu','tansuo','xinwen'],['reading-words','reading-passage'],20)
for id in ['xiongmao','shouji','tushuguan','you-reading']:read(id,['reading-words' if id!='you-reading' else 'reading-passage'])
for id in ['weixin','chengxu','tansuo','xinwen']:read(id,['reading-words'])
for id in ['jiqiren','tiankong','lanqiu']:read(id,['reading-words'])
read('story-robot',['reading-passage'],transfer=True,readingTotal=sum('\u4e00'<=c<='\u9fff' for c in vocabulary['story-robot']['hanzi']),prompt='只看拼音，读这段机器人的线索。核对后记录读对的音节数。')
choose('刚才机器人没有开门，故事里找到的原因是什么？','电脑指令里的方向写错了',['电脑指令里的方向写错了','机器人没有电了','门上没有铃'],'拼音不只用于单个字：连成故事后，你也能理解并核对信息。',['reading-passage'])
read('story-stars',['reading-passage'],transfer=True,readingTotal=sum('\u4e00'<=c<='\u9fff' for c in vocabulary['story-stars']['hanzi']))
choose('读拼音故事时，哪个方法更能帮助自己解码？','先拆不会的音节，再连接词语和句子',['先拆不会的音节，再连接词语和句子','不看字母，只凭故事主题猜答案','每个字母只念英语名称'],'猜故事大意不能代替看拼音解码；遇到陌生组合先用学过的规则。',['reading-passage'])
read('robot-move',['reading-passage'])
finish()

start(22,'分清三类错误：声母韵母、键盘漏字、候选字选错',['shu','jing','lv','shijian','at-school','green-leaf'],['keyboard-repair','umlaut','ime-context'],18)
for id in ['shu','ting','lv','xian-city']:keyboard(id,['keyboard'])
choose('想输入“书”，却把 shu 敲成 su，问题发生在哪一步？','拼音声母漏了 h',['拼音声母漏了 h','候选词顺序改变','汉字笔画太多'],'sh 和 s 是不同声母；字母串本身错了，应先补 h，再选候选词。',['keyboard-repair','retroflex'],tag='initial_confusion')
choose('想输入“京”，却敲 jin，应该补哪一个字母？','g',['g','h','v'],'jīng 末尾是 ng，按键 jing；jīn 是另一个音节。',['keyboard-repair','nasal-back'],tag='front_back_nasal')
choose('输入 zai 后选出“再”，但句子需要“我在学校”，错误属于？','同音候选字选择错误',['同音候选字选择错误','zai 的字母必然拼错','声调一定输错'],'在/再的全拼都是 zai；应按语境重新选在，不必乱改正确拼音。',['keyboard-repair','ime-context'],tag='ime_candidate')
ime('at-school',['keyboard-repair'],initialText='我再学校。',prompt='编辑错误的候选字，表达“我处在学校”。')
for id in ['lvseshiwu','xing','shu']:keyboard(id,['keyboard-repair','umlaut'] if id=='lvseshiwu' else ['keyboard-repair'],transfer=id=='lvseshiwu')
ime('at-school',['keyboard-repair'],initialText='我再学校。',prompt='只更正这句话里的同音错字。')
ime('rewrite-zai',['keyboard-repair'],initialText='明天在来。',prompt='表达明天又来，检查在/再并更正。',transfer=True)
ime('green-leaf',['keyboard-repair','umlaut'],initialText='这片叶子是录色的。',prompt='把“录色”改成正确的颜色词，再检查整句。')
ime('where-school',['keyboard-repair'],initialText='学校在那李？',prompt='把地点问句中的候选错字改正确。',transfer=True)
choose('遇到一直输入不对的词，最有效的检查顺序是？','先检查拼音字母，再检查最终候选字',['先检查拼音字母，再检查最终候选字','反复按空格，不看结果','把全部词都改成同音字'],'正确的拼音串和正确的汉字是两次检查；分清错误来源才能修好。',['keyboard-repair'])
finish()

start(23,'组织一个有内容的段落，让拼音服务自己的表达',['introduce','robot-new','check-report'],['expression','ime-sentences'],20)
for id in ['at-school','see-tomorrow','science-fun','play-ball']:ime(id,['ime-sentences'])
for id in ['introduce','robot-move','water-msg','science-fun']:ime(id,['ime-sentences'])
ime('robot-new',['expression'],transfer=True)
ime('check-report',['expression'],transfer=True)
choose('写介绍一种发明的段落，怎样先组织内容？','先说它是什么、能做什么、自己的一个想法',['先说它是什么、能做什么、自己的一个想法','先随便敲字凑够字数','只写一长串拼音字母'],'你已经会中文，可以先口头组织意思；拼音输入是把意思写出来的工具。',['expression'])
choose('选好候选字以后，最后一遍检查应该关注什么？','意思、错别字和句子标点',['意思、错别字和句子标点','只看字数','只看有没有第一个候选词'],'一段话不仅要有汉字数量，还要有清楚意思、正确用字和合理标点。',['expression'],tag='ime_candidate')
ime('message-invention',['expression'],prompt='先照着输入这段 60–100 字介绍，自己更正错字与标点。')
add('type_hanzi_ime','独立介绍一种你感兴趣的发明：它是什么、能做什么、你想改进什么。','self',skill_ids=['expression'],tag='ime_candidate',freeWriting=dict(minChars=60,maxChars=100,topic='介绍一种发明'),feedback='这道题由学生或家长检查内容：60–100 个汉字、有明确的发明与用途、有自己的想法，改好错别字和标点。App 只检查文字范围；不把凑字数当成自动理解了你的文章。')
ime('outside-msg',['expression'],prompt='给家人留一句有实际用途的消息。')
read('story-stars',['reading-passage'],readingTotal=sum('\u4e00'<=c<='\u9fff' for c in vocabulary['story-stars']['hanzi']))
finish()

start(24,'综合认读 + 真实输入，记录能独立完成的任务',['outside-msg','zhongwen'],['independent','reading-words','ime-sentences'],20)
for id in ['jing','yuan','nv','ying']:read(id,['nasal-back' if id=='jing' else 'umlaut-rule' if id=='nv' else 'whole-second'])
choose('综合测评中的 30 个音节，建议至少读对多少个？','26 个',['26 个','只读对 10 个就够','必须每秒读一个'],'目标是30个中至少26个，允许自我纠正，不以速度施压。',['reading-words'])
choose('真实输入任务关注的是？','最终汉字正确、能自己选词和更正',['最终汉字正确、能自己选词和更正','候选词永远排第一','每分钟必须达到固定字数'],'实际使用拼音的能力比输入速度更重要，候选排名因系统而异。',['independent'])
read('xiongmao',['reading-words'])
ime('outside-msg',['ime-sentences'])
for id in ['you-reading','jiqiren','tushuguan']:read(id,['reading-passage' if id=='you-reading' else 'reading-words'])
ime('book-question',['ime-sentences'])
keyboard('nver',['keyboard','umlaut'],transfer=True)
ime('check-report',['independent'],transfer=True)
choose('课后怎样保持拼音的使用能力？','每周两次：一次读短文，一次用全拼写真实消息',['每周两次：一次读短文，一次用全拼写真实消息','只反复点熟悉的四选一','以后不用读，也不用打字'],'每次5–10分钟，把拼音自然用在中文读写表达里。',['independent'])
choose('遇到不会读的规范音节，已经学会的策略是？','找声韵母、调号和特殊写法，再连读',['找声韵母、调号和特殊写法，再连读','只按英文字母名称念','任何词都凭汉字猜'],'先解码再核对，把规则带到新的音节和真实场景。',['reading-words'])
finish()

# Metadata for checkpoints, including introductory diagnosis and week challenges.
assessments=[]
def checkpoint(id,title,description,minutes,after=None):
    global lesson_id, question_list
    lesson_id=id
    question_list=[]
    record=dict(id=id,title=title,description=description,minutes=minutes,afterLesson=after,groups=[])
    assessments.append(record)
    return record

def grouped(ids,skill_ids,label):
    return add('read_aloud',label,'self',wordIds=ids,skill_ids=skill_ids,phase='challenge',tag='reading_decode',feedback='先读整组，再逐条核对。按刚才独立读的情况记录每条：读对或需要再练；不要把核对后的跟读当成第一次就会。')
def passage(id,skill_ids):
    return read(id,skill_ids,phase='challenge',readingTotal=sum('\u4e00'<=c<='\u9fff' for c in vocabulary[id]['hanzi']),prompt='先只看拼音读短文，核对后记录独立读对的音节数。')
def end_checkpoint(meta):
    meta['questionIds']=[q['id'] for q in question_list]
    for q in question_list:q['phase']='challenge'
    save(f'assessments/{meta["id"]}.json',question_list)

def group(meta,id,label,qs,min_correct=None,min_accuracy=None):
    meta['groups'].append(dict(id=id,label=label,questionIds=[q['id'] for q in qs],**({'minCorrect':min_correct} if min_correct is not None else {}),**({'minAccuracy':min_accuracy} if min_accuracy is not None else {})))

meta=checkpoint('A00','开始前的小侦查','认识哪些声音、字母和键盘？记录现状，不贴“中文初学者”标签，也不锁课程。',7)
# Six known hanzi, six marked syllables, four initial choices and one keyboard task.
for id in ['ni','hao','shu','ma1','yi','yu']:
    choose(f'看到「{vocabulary[id]["hanzi"]}」，你认识它对应的拼音吗？',vocabulary[id]['pinyinMarked'],[vocabulary[id]['pinyinMarked'],'还不认识'],f'这是课前观察，答案是 {vocabulary[id]["pinyinMarked"]}。不会可以从第一课开始。',['map'])
grouped(['ni','ma1','shu','xue','hao','yu'],['map'],'先试着读六张拼音名片；不会的也如实记录。')
for prompt,ans,options in [('书的开头是哪组？','sh',['sh','s','还不认识']),('八的开头是哪组？','b',['b','p','还不认识']),('鸡的开头是哪组？','j',['j','q','还不认识']),('字的开头是哪组？','z',['z','zh','还不认识'])]:choose(prompt,ans,options,'本题只记录你已经认识哪些声母；还不会的内容会按课程逐步学习。',['map'])
keyboard('zhongwen',['keyboard'])
group(meta,'observe','现有基础',question_list,min_accuracy=0)
end_checkpoint(meta)

meta=checkpoint('A01','第一周声音地图挑战','读 12 个已学音节，再给 6 个熟悉汉字找到拼音。',8,4)
for ids in [['ni','ma1','ba1','pa4'],['da4','ta1','yi','wu'],['yu','ba4','pa1','mi3']]:grouped(ids,['blend'],'只看拼音，独立读四个音节。')
group(meta,'syllables','12 个已学音节',question_list[:],min_accuracy=.85)
begin=len(question_list)
for id in ['ni','ba1','ma1','da4','yi','yu']:choose(f'给「{vocabulary[id]["hanzi"]}」找到拼音。',vocabulary[id]['pinyinMarked'],[vocabulary[id]['pinyinMarked'],'pà','shū'] if id!='ni' else ['nǐ','hǎo','shū'],f'正确名片是 {vocabulary[id]["pinyinMarked"]}。看清字母和声调。',['map'])
group(meta,'matching','6 组汉字与拼音',question_list[begin:],min_accuracy=.85)
end_checkpoint(meta)

meta=checkpoint('A02','声母侦探挑战','听辨容易混的开头，读 10 个已学音节，再准确敲 zh/ch/sh。',8,8)
for ids in [['ge','ke','ji','qu','xi'],['zhi1','chi1','shi1','ri','zi4']]:grouped(ids,['retroflex','initial-gkh','initial-jqx'],'不看汉字，读出五个音节。')
group(meta,'syllables','10 个音节',question_list[:],min_accuracy=.85)
begin=len(question_list)
for id,opts in [('si1',['sī','shī']),('zhi1',['zī','zhī']),('ji',['jī','qī']),('ke',['gě','kě'])]:hear(id,opts,['retroflex','initial-jqx','initial-gkh'])
group(meta,'contrast','4 组声母辨音',question_list[begin:],min_accuracy=.85)
begin=len(question_list)
for id in ['shu','chi1','zhi1']:keyboard(id,['keyboard','retroflex'])
group(meta,'typing','双字母声母键入',question_list[begin:],min_accuracy=1)
end_checkpoint(meta)

for row in [('heimao','黑猫','hēimāo','heimao',12),('menling','门铃','ménlíng','menling',12),('haifeng','海风','hǎifēng','haifeng',12),('hongxing','红星','hóngxīng','hongxing',12),('maobi','毛笔','máobǐ','maobi',12),('dengxin','灯芯','dēngxīn','dengxin',12)]:word(row[0].replace(' ',''),*row[1:])
meta=checkpoint('A03','拼音密码挑战','把复韵母和鼻韵母放进六个真实词语；先读，后看汉字验证。',6,12)
for ids in [['heimao','menling','haifeng'],['hongxing','maobi','dengxin']]:grouped(ids,['compound-a','nasal-front','nasal-back'],'解码三张词语密码，不先看汉字。')
group(meta,'words','6 个拼音词语',question_list[:],min_accuracy=.85)
end_checkpoint(meta)

# At least six syllables here have never appeared in lesson examples or course exercises.
for row in [
('duan','端','duān','duan',16),('qiang','抢','qiǎng','qiang',16),('jiong','炯（炯炯）','jiǒng','jiong',16),('shua','刷','shuā','shua',16),('cui','脆','cuì','cui',16),('jun','俊','jùn','jun',16),('ruan','软','ruǎn','ruan',16),('chang','昌（昌盛）','chāng','chang',16),('peng','砰','pēng','peng',16),('wen','稳','wěn','wen',16),
('longmao','龙猫','lóngmāo','longmao',16),('heliu','河流','héliú','heliu',16),('xueren','雪人','xuěrén','xueren',16),('diqiu','地球','dìqiú','diqiu',16),('xingguang','星光','xīngguāng','xingguang',16),('diandeng','电灯','diàndēng','diandeng',16),('shuye','树叶','shùyè','shuye',16),('yinyue','音乐','yīnyuè','yinyue',16),('caihong','彩虹','cǎihóng','caihong',16),
]:word(*row,speech=row[1].replace('（炯炯）','').replace('（昌盛）',''))
word('story-check4','清晨，我听见门外有铃声。朋友带来一本新书，我们坐在窗边，先读目录，再找一段关于星空的故事。','Qīngchén, wǒ tīngjiàn mén wài yǒu língshēng. Péngyou dài lái yī běn xīn shū, wǒmen zuò zài chuāng biān, xiān dú mùlù, zài zhǎo yī duàn guānyú xīngkōng de gùshi.','qingchenwotingjianmenwaiyoulingshengpengyoudailaiyibenxinshuwomenzuozaichuangbianxiandumuluzaizhaoyiduanguanyuxingkongdegushi',16)
meta=checkpoint('A04','第四周认读检查','20 个混合音节、10 个词、2–3 句短文。没达标的音组继续复习，也能体验真实输入法。',15,16)
syllables=['duan','qiang','jiong','shua','cui','jun','ruan','chang','peng','wen','nv','xue','yuan','jing','gui','niu','zhi3','you','hua','er']
for i in range(0,20,5):grouped(syllables[i:i+5],['three-part','abbreviation','umlaut-rule','nasal-back'],'用已学规则读五个音节；这组包含新的合法组合。')
group(meta,'syllables','20 个带调音节',question_list[:],min_accuracy=.85)
begin=len(question_list)
for ids in [['longmao','heliu','xueren','diqiu','haifeng'],['xingguang','diandeng','shuye','yinyue','caihong']]:grouped(ids,['reading-words'],'只看拼音，读五个词。')
group(meta,'words','10 个两音节词',question_list[begin:],min_accuracy=.85)
begin=len(question_list)
passage('story-check4',['reading-passage'])
group(meta,'passage','拼音短文',question_list[begin:],min_accuracy=.85)
end_checkpoint(meta)

meta=checkpoint('A05','给朋友的一条消息','使用系统中文拼音输入法完成 30–50 字消息，自己检查候选词和标点。',8,20)
ime('message-week5',['ime-sentences'],phase='challenge',minAccuracy=.9)
group(meta,'message','真实中文消息',question_list[:],min_accuracy=.9)
end_checkpoint(meta)

# Graduation is evaluated by independent dimensions, not an average hiding a weak area.
meta=checkpoint('A06','我的拼音使用挑战','30 个音节、12 个词、40–60 字短文，加 60–100 字真实中文输入和四项基本操作。可中途保存。',20,24)
final_syllables=['duan','jiu','nv','zhi3','miao','ling','yuan','wo','liu2','qun','cha','shui','xuan','deng','ying','guo','cui','lun','ye','qiang','pa1','yun','he','liang','xue','you','ting','ji','huang','er']
for i in range(0,30,5):grouped(final_syllables[i:i+5],['reading-words'],'综合认读：只看拼音，独立读五个音节。')
group(meta,'syllables','30 个音节',question_list[:],min_correct=26)
begin=len(question_list)
for ids in [['xiongmao','shouji','weixin'],['tushuguan','dianying','pengyou'],['longmao','xingguang','yinyue'],['diannao','chengxu','haifeng']]:grouped(ids,['reading-words'],'综合认读：只看拼音，读三个真实词。')
group(meta,'words','12 个词语',question_list[begin:],min_accuracy=.85)
begin=len(question_list)
passage('story-final',['reading-passage'])
group(meta,'passage','40–60 字对应的拼音短文',question_list[begin:],min_accuracy=.85)
begin=len(question_list)
ime('ni',['ime'],prompt='操作 1：切换到系统中文拼音输入模式，敲 ni 并选出「你」。')
ime('school',['ime-words'],prompt='操作 2：连续敲一个完整词的全拼，选出「学校」。')
ime('at-school',['keyboard-repair'],prompt='操作 3：编辑错误候选字，表达“我处在学校”。',initialText='我再学校。')
ime('book-question',['ime-sentences'],prompt='操作 4：输入完整问句，并自己加上中文问号。')
group(meta,'operations','4 项独立输入操作',question_list[begin:],min_accuracy=1)
begin=len(question_list)
ime('message-final',['independent','ime-sentences'],prompt='真实输入：用系统 IME 完成这段 60–100 字文字，再自己改错。',minAccuracy=.9)
group(meta,'input','60–100 字真实中文输入',question_list[begin:],min_accuracy=.9)
end_checkpoint(meta)

# Skill-first review tags and explicit prerequisite metadata make content auditable.
known_intro={'ni':1,'hao':1,'shu':1,'ma1':1,'a':2,'bo':2,'e':2,'yi':2,'wu':2,'yu':2,'ma2':3,'ma3':3,'ma4':3,'ma0':3,'ba1':4,'pa4':4,'fa1':4,'da4':4,'ta1':4,'le4':4,'ba4':4,'pa1':4,'mi3':4,'nv':14,'lv':14,'nihao':8,'school':17,'science':20}
for id,intro in known_intro.items():vocabulary[id]['introducedIn']=intro
for l in roadmap:
    if l['number']>=5:
        l['prerequisites']=[f'L{l["number"]-1:02}']
        if l['number'] in [8,12,16,20,24]:l['assessmentId']=f'A{l["number"]//4:02}'
roadmap[3]['assessmentId']='A01'
# Keep weekly references exact: L08→A02, L12→A03, L16→A04, L20→A05, L24→A06.
for m in assessments:
    m['questionCount']=len(m['questionIds'])
# Existing card progress and original lesson question IDs are left intact.
save('lexicon/vocabulary.json',list(vocabulary.values()))
save('lexicon/audio-manifest.json',list(audio.values()))
save('lexicon/skills.json',list(skills.values()))
save('roadmap.json',roadmap)
save('assessments/catalog.json',assessments)
print(f'Published {sum(l["available"] for l in roadmap)} lessons; {len(vocabulary)} vocabulary/audio entries; {len(assessments)} checkpoints.')
