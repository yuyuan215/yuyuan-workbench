/* ============================================================
 * 每日内容素材库 content.js
 * 内置离线素材 + 按日期种子每日自动轮换
 * 联网时可叠加在线抓取（见 modules/invest.js 的 remote 逻辑）
 * ============================================================ */
window.CONTENT = {

  /* ---------- 财经资讯 / 市场速览 ---------- */
  news: [
    { t: '全球央行政策分化，关注利率路径对权益资产的定价影响', s: '宏观观察', tag: '宏观', d: '当主要经济体货币政策节奏出现分化，汇率与跨境资金流动会先于基本面反应。对个人投资者而言，关键不是预测加降息，而是评估自己的组合在利率上行与下行两种情形下的抗压能力。' },
    { t: 'A股结构性行情延续，红利资产与成长赛道的跷跷板效应', s: '市场综述', tag: 'A股', d: '存量资金环境下，板块轮动速度加快。红利低波类资产提供现金流确定性，成长板块提供弹性，二者按 6:4 或 7:3 配置，往往比全仓押注单一风格更稳。' },
    { t: '美债收益率波动加大，全球资产定价锚重新调整', s: '海外市场', tag: '海外', d: '10 年期美债收益率被视为全球资产定价之锚。收益率快速上行阶段，高估值成长股承压；回落阶段，黄金与长久期资产受益。观察方向比绝对水平更重要。' },
    { t: '人民币汇率双向波动常态化，跨境资产配置需考虑汇兑成本', s: '外汇', tag: '外汇', d: '汇率不再单边运行意味着择时收益下降。配置海外资产时，应把汇兑损益纳入总回报测算，并优先考虑长期持有而非短期套利。' },
    { t: '公募基金费率改革推进，长期投资者的成本优势凸显', s: '基金动态', tag: '基金', d: '管理费与交易佣金下降，直接提升长期持有的净收益。以 20 年维度计算，年化 0.5% 的费率差异会带来超过 10% 的终值差距。' },
    { t: '黄金的配置逻辑：从抗通胀到抗不确定性', s: '大类资产', tag: '商品', d: '黄金短期看实际利率与美元，长期看货币信用与地缘风险。作为组合的“保险单”，5%~10% 的比例足以显著平滑净值波动，超配则会拖累长期收益。' },
    { t: '存款利率下行周期，稳健型资金的再配置路径', s: '固收', tag: '固收', d: '低利率环境下，纯存款难以跑赢通胀。可考虑“短债基金 + 同业存单指数 + 国债逆回购”组合替代活期，兼顾流动性与收益。' },
    { t: '指数化投资渗透率提升，ETF 成为普通人的主力工具', s: '产品趋势', tag: 'ETF', d: 'ETF 的透明度、低费率与交易便利性，使其成为构建核心组合的首选。宽基打底、行业做卫星，是最容易执行的框架。' },
    { t: '企业盈利周期与股价的时间差：为什么好消息出来时股价已在高位', s: '投研方法', tag: '方法', d: '市场交易的是预期变化而非当前事实。当业绩公告确认高增长时，价格往往已完成大部分反应。学会读预期差，比读财报数字更重要。' },
    { t: 'REITs 市场扩容，普通投资者参与不动产的新通道', s: '另类资产', tag: '另类', d: '公募 REITs 提供了不动产现金流分红的参与方式，但底层资产质量差异大。重点看运营方能力、出租率与分派率的可持续性。' },
    { t: '消费复苏结构分化，必需消费与可选消费的估值逻辑不同', s: '行业', tag: '行业', d: '必需消费以稳定现金流与股息取胜，可选消费依赖经济景气度。经济弱复苏期，前者防守，后者需等待右侧信号。' },
    { t: 'AI 产业链投资：算力、模型与应用的三段式节奏', s: '科技', tag: '科技', d: '产业早期算力先行，中期模型能力竞争，后期应用变现。判断自己买的是哪一段，决定了合理的持有周期与预期收益。' },
    { t: '新能源行业进入产能出清阶段，龙头集中度提升', s: '行业', tag: '行业', d: '价格战之后是格局重塑。周期底部的关键指标是产能利用率与库存周期，而非短期价格反弹。' },
    { t: '养老第三支柱建设加速，个人养老金账户的税优价值', s: '政策', tag: '政策', d: '个人养老金账户的核心价值是税收递延与强制长期持有。对高税率人群，节税本身就是一笔确定性收益。' },
    { t: '资产配置的四象限：现金、固收、权益、另类', s: '配置', tag: '配置', d: '任何时点都不应有 100% 的仓位在单一象限。四象限比例可随年龄与风险承受力调整，但结构不应缺失。' },
    { t: '信用债违约常态化，普通投资者应回避“高收益诱惑”', s: '固收', tag: '固收', d: '固收类产品收益率显著高于同期国债 2 个百分点以上时，必须追问超额收益来自哪里。多数情况是信用下沉或杠杆放大。' },
    { t: '港股估值处于历史低分位，但需区分“便宜”与“价值陷阱”', s: '海外', tag: '港股', d: '低估值不是买入理由，盈利拐点才是。观察南向资金流向与企业回购力度，比单看 PB 更有参考价值。' },
    { t: '定投的本质是纪律，不是择时的替代品', s: '方法', tag: '方法', d: '定投能摊低成本，但无法拯救错误标的。选择长期向上的宽基指数，并在低估区间加大投入，才能放大定投效果。' },
    { t: '家庭财务体检：先补保障缺口，再谈投资收益', s: '理财', tag: '理财', d: '重疾、医疗、意外三类保障未配齐时，投资组合的第一大风险不是波动，而是一次意外带来的强制赎回。' },
    { t: '现金流管理：三笔钱模型的实际落地方法', s: '理财', tag: '理财', d: '短期要用的钱（6 个月开销）放货币基金，中期（1~3 年）放短债与存单，长期（5 年以上）放权益。分层之后，波动就不再可怕。' },
    { t: '通胀数据解读：核心 CPI 比整体 CPI 更能反映趋势', s: '宏观', tag: '宏观', d: '剔除食品与能源后的核心通胀，才是央行政策的主要参考。个人投资者关注核心指标，可减少被短期噪音误导。' },
    { t: 'PMI 荣枯线的实战含义：领先指标如何影响仓位', s: '宏观', tag: '宏观', d: 'PMI 连续三个月站上 50 通常对应经济扩张预期，周期股与顺周期资产更占优；连续低于 50 则应提高防御资产比例。' },
    { t: '社融与 M1-M2 剪刀差：钱去哪儿了', s: '宏观', tag: '宏观', d: 'M1 增速回升往往意味着企业活期资金增多、投资意愿改善，是权益市场的中期友好信号。' },
    { t: '巴菲特指标与股债性价比：判断市场冷热的两把尺子', s: '估值', tag: '估值', d: '股权风险溢价 = 指数盈利收益率 - 十年期国债收益率。该值处于历史高位区间时，权益资产的中长期胜率显著提升。' },
    { t: '基金经理变更是否需要赎回：三个判断标准', s: '基金', tag: '基金', d: '看策略是否依赖个人、看新任是否延续框架、看规模是否已超策略容量。三者都恶化时才考虑退出。' },
    { t: '规模是业绩的敌人：小基金与大基金的收益差异根源', s: '基金', tag: '基金', d: '规模膨胀会限制调仓灵活性与小市值参与度。选主动基金时，规模适中且策略稳定的产品更值得长期持有。' },
    { t: '可转债的进可攻退可守：条款理解比价格判断更重要', s: '固收+', tag: '固收+', d: '下修条款、赎回条款与回售条款共同决定了转债的收益结构。溢价率过高时，债性保护会失效。' },
    { t: '打新与套利收益率下降，小资金应回归主线策略', s: '策略', tag: '策略', d: '当无风险套利空间被挤压，把精力放在核心资产的长期持有上，比在低胜率的边角机会中消耗更划算。' },
    { t: '再平衡的力量：为什么每年一次调仓能提高长期收益', s: '配置', tag: '配置', d: '再平衡强制“卖高买低”，在波动市场中提供额外收益。频率不必高，年度或偏离阈值 5% 时执行即可。' },
    { t: '税收与费用：长期收益中最被低估的两个变量', s: '成本', tag: '成本', d: '收益率的不确定性很高，但费用与税负是确定的。降低确定的成本，等于提高确定的收益。' },
    { t: '行为金融学视角：亏损厌恶如何摧毁你的投资计划', s: '心理', tag: '心理', d: '同等金额下，亏损带来的痛苦约为盈利快乐的 2 倍。这解释了为什么多数人拿不住上涨的资产，却死扛下跌的资产。' },
    { t: '锚定效应：买入成本不应影响卖出决策', s: '心理', tag: '心理', d: '市场不知道你的成本价。决策依据应是“现在这笔钱放在这里是否最优”，而非“我要回本才卖”。' },
    { t: '信息过载时代，减少看盘频率反而提升收益', s: '心理', tag: '心理', d: '研究显示，查看账户频率越高，交易越频繁，长期收益越低。把看盘从每天改为每周，是一次免费的收益升级。' },
    { t: '家庭资产负债表：净资产增长才是真实的财富进度条', s: '理财', tag: '理财', d: '每季度记录一次资产与负债，用净资产曲线代替短期收益率，可以极大缓解市场波动带来的焦虑。' },
    { t: '房产在家庭资产中的占比过高时，流动性风险被严重低估', s: '理财', tag: '理财', d: '单一不动产占净资产 70% 以上时，家庭财务弹性很弱。逐步提高金融资产比例，是长期结构优化的方向。' },
    { t: '子女教育金规划：时间确定、金额确定的刚性支出', s: '规划', tag: '规划', d: '刚性支出对应的资金不适合高波动配置。用时间倒推：距离使用 5 年以上可含权益，3 年内应转为稳健资产。' },
    { t: '企业主的个人与公司财务隔离：风险防火墙的重要性', s: '规划', tag: '规划', d: '经营性风险不应传导到家庭资产。用独立账户、保险与合规架构建立隔离，是高净值家庭的基础功课。' },
    { t: '被动收入的三种来源：股息、租金、版税', s: '现金流', tag: '现金流', d: '被动收入的价值在于稳定性而非绝对额。先建立可持续的小额现金流，再逐步扩大规模。' },
    { t: '股息投资的陷阱：高股息率可能来自股价下跌', s: '策略', tag: '策略', d: '关注分红的可持续性：自由现金流覆盖率、分红率历史稳定性、行业景气度，三者缺一不可。' },
    { t: '投资纪律清单：每次买入前必须回答的五个问题', s: '方法', tag: '方法', d: '买它的理由是什么？多久验证？错在哪算错？最大能亏多少？这笔钱是否 3 年内要用？答不上来就不买。' }
  ],

  /* ---------- 市场观点 / 大师视角 ---------- */
  views: [
    { who: '价值投资视角', t: '价格是你付出的，价值是你得到的', d: '把股票当成企业的一部分所有权，而不是屏幕上跳动的代码。当你能说出企业未来 3 年靠什么赚钱时，波动就变成了机会而不是威胁。' },
    { who: '资产配置视角', t: '90% 的长期收益差异来自资产配置，而非选股', d: '与其花 90% 时间选个股，不如花 90% 时间决定股债比例、地域分散与再平衡规则。' },
    { who: '风险管理视角', t: '先想着不亏钱，再想着赚钱', d: '亏损 50% 需要上涨 100% 才能回本。控制回撤的价值在数学上远大于追求高收益。' },
    { who: '周期视角', t: '我们不知道要去哪里，但应该知道身在何处', d: '判断周期位置的三个信号：估值分位、投资者情绪、信贷宽松度。位置感决定了进攻还是防守。' },
    { who: '复利视角', t: '时间是优质资产的朋友，是平庸资产的敌人', d: '长期持有只有在标的持续创造价值时才成立。定期审视基本面，是复利成立的前提。' },
    { who: '常识视角', t: '不要买你无法向孩子解释清楚的东西', d: '复杂结构化产品的复杂性，通常服务于销售方而非投资者。看不懂就是最大的风险信号。' },
    { who: '逆向视角', t: '别人贪婪时恐惧，别人恐惧时贪婪', d: '逆向不是为了标新立异，而是因为极端情绪会造成定价错误。逆向的前提是基本面判断成立。' },
    { who: '概率视角', t: '投资是概率游戏，不追求每次正确', d: '一个胜率 55%、盈亏比 1.5 的系统，长期执行足以带来可观回报。关键是重复足够多次。' },
    { who: '仓位视角', t: '仓位管理比方向判断更能决定生死', d: '方向对但仓位过重，一次回撤就会被迫离场。永远保留可以加仓的子弹与可以睡觉的仓位。' },
    { who: '认知视角', t: '你只能赚到认知范围内的钱', d: '超出能力圈的盈利多半是运气，运气带来的钱最终会以实力不足的方式还回去。' },
    { who: '现金流视角', t: '自由现金流是企业价值的唯一来源', d: '利润可以调节，现金流很难长期造假。看懂现金流量表，比看利润表更接近真相。' },
    { who: '心理视角', t: '投资最大的敌人是镜子里的自己', d: '写投资日志，记录每次决策的理由与情绪，半年后回看，你会发现规律远比市场更容易预测。' },
    { who: '长期主义', t: '短期是投票机，长期是称重机', d: '一年维度上情绪主导价格，十年维度上盈利决定价格。选择你的时间尺度，也就选择了你的对手盘。' },
    { who: '分散视角', t: '分散是唯一免费的午餐', d: '相关性低的资产组合，可以在不降低预期收益的前提下降低波动。分散不是买很多只同类基金。' },
    { who: '成本视角', t: '在投资中，你得到的是你没有付出的', d: '与主动管理不同，指数化投资把成本压到最低，让市场平均收益完整落入投资者口袋。' },
    { who: '耐心视角', t: '钱从没有耐心的人流向有耐心的人', d: '市场提供的超额回报，很大一部分是对持有痛苦期的补偿。缩短持有期，等于放弃这部分补偿。' },
    { who: '安全边际', t: '用四毛钱买一块钱的东西', d: '安全边际不是精确估值，而是承认自己会犯错，用足够的折价来容纳判断误差。' },
    { who: '简单视角', t: '简单策略长期执行，胜过复杂策略反复摇摆', d: '策略的有效性 = 逻辑正确性 × 执行持续性。多数人败在第二项。' },
    { who: '止损视角', t: '止损止的是逻辑，不是价格', d: '当初买入的逻辑被证伪就该离开，即使还在盈利；逻辑未变则下跌是机会。' },
    { who: '结构视角', t: '收入结构决定财富上限，支出结构决定财富下限', d: '投资只是财富公式中的一项。提升主动收入与优化支出结构，往往比多两个点收益更有效。' }
  ],

  /* ---------- 投资理财干货 ---------- */
  tips: [
    { t: '三笔钱模型', d: '把家庭资金分为“要花的钱 / 保命的钱 / 生钱的钱”。要花的钱放货币工具覆盖 6 个月开支；保命的钱用保险与稳健资产；生钱的钱投入 5 年以上不用的长期组合。' },
    { t: '4% 法则的中国式修正', d: '退休后每年提取组合的 4%，理论上可维持 30 年。国内利率与波动环境下，建议下调至 3%~3.5%，并保留 2 年现金缓冲以避免熊市卖出。' },
    { t: '72 法则', d: '本金翻倍所需年数 ≈ 72 ÷ 年化收益率。年化 6% 约 12 年翻倍，年化 12% 约 6 年。用它快速判断收益承诺是否离谱。' },
    { t: '定投的三个进阶技巧', d: '一是估值定投（低估多投高估少投）；二是止盈规则（目标收益率或估值分位触发）；三是长周期不中断，熊市才是真正积累份额的阶段。' },
    { t: '资产再平衡执行清单', d: '设定目标比例（如股 60 债 40），每年固定日期或偏离超过 5 个百分点时调整；调整只在原有品种间进行，不引入新逻辑。' },
    { t: '基金三费与真实成本', d: '管理费、托管费、销售服务费之外，还有申赎费与交易佣金。C 类适合 1 年内，A 类适合长期持有；持有期是选份额的第一依据。' },
    { t: '如何看懂基金季报', d: '重点看四项：前十大持仓集中度、换手率、基金经理观点是否前后一致、规模变化。观点与持仓矛盾的产品要警惕。' },
    { t: '止盈的三种方法', d: '目标止盈（达到年化目标即卖）、估值止盈（PE 分位超过 80% 分批卖）、移动止盈（回撤 10% 触发）。选一种并写进规则，不临时改。' },
    { t: '构建核心-卫星组合', d: '核心 70%：宽基指数 + 稳健债基，长期持有不折腾；卫星 30%：行业主题或个股，用于表达观点，单个不超过 10%。' },
    { t: '家庭保险配置顺序', d: '先大人后小孩，先保障后理财：百万医疗 → 重疾 → 定期寿险（家庭经济支柱）→ 意外险。保额优先于产品花哨程度。' },
    { t: '记账不是为了省钱', d: '记账的价值是发现支出结构问题。按“固定 / 弹性 / 冲动”三类归集，冲动支出占比超过 15% 就值得干预。' },
    { t: '应急基金怎么放', d: '6 个月家庭开支，拆成两部分：2 个月放货币基金随时可取，4 个月放国债逆回购或短债基金，兼顾流动性与收益。' },
    { t: '如何评估一只行业 ETF', d: '看四点：指数编制规则（是否有偏）、成分股集中度、规模与流动性（日均成交 5000 万以上更安全）、跟踪误差。' },
    { t: '避免踩雷的四个红线', d: '承诺保本高收益、要求拉人头、资金不进入受监管账户、看不懂底层资产。触碰任意一条立即远离。' },
    { t: '现金管理工具对比', d: '货币基金（T+1，低波动）、同业存单指数基金（收益略高，波动小）、国债逆回购（月末季末收益跳升）、短债基金（1 年以上更稳）。' },
    { t: '投资日志模板', d: '每笔操作记录：日期、标的、金额、买入逻辑、预期持有期、验证指标、当时情绪。每季度复盘一次，胜率提升立竿见影。' },
    { t: '如何设定合理收益预期', d: '长期权益类年化 8%~10% 已属优秀，固收类 3%~4%，组合整体 5%~7% 是可持续目标。预期越低，动作越不变形。' },
    { t: '大额资金入场的节奏', d: '一次性投入面临择时风险，可采用 6~12 个月分批建仓，或按估值分位阶梯式加码，把择时错误的成本平摊。' },
    { t: '读财报的最短路径', d: '三张表看三件事：利润表看增长质量（毛利率与费用率）、资产负债表看安全性（有息负债与现金）、现金流量表看真实性（经营现金流／净利润）。' },
    { t: '警惕“幸存者偏差”的收益率', d: '排行榜上的高收益产品往往是特定风格阶段性占优。看 3~5 年完整周期的表现与最大回撤，比看近一年排名更可靠。' },
    { t: '负债管理的优先级', d: '先还高息（信用卡、消费贷 > 15%），再考虑投资；房贷等低息长期负债不必急于提前还清，可与投资收益率比较后决策。' },
    { t: '资产配置随年龄调整', d: '经典公式：权益比例 ≈ 100 - 年龄。40 岁约 60% 权益。可根据收入稳定性与风险偏好上下浮动 10~15 个百分点。' },
    { t: '如何应对市场大跌', d: '第一步不看账户看计划：资金是否 3 年内要用？逻辑是否变化？仓位是否超限？三问之后再决定是否操作，避免情绪化卖出。' },
    { t: '把投资流程写成清单', d: '买入清单、持有检查清单、卖出清单各一页。清单化是把偶然的正确变成可复制的正确，也是抵御情绪的最好工具。' }
  ],

  /* ---------- 投资书籍核心摘要 ---------- */
  bookNotes: [
    { book: '《聪明的投资者》', author: '本杰明·格雷厄姆', core: '投资是经过深入分析、保证本金安全并获得满意回报的操作，不符合这些条件的是投机。', points: ['区分投资与投机，明确自己在做哪一件事', '市场先生每天报价，但你没有义务响应', '安全边际是抵御未知的唯一可靠工具', '防御型投资者应以指数化与固定比例配置为主'], action: '为组合设定股债比例区间，并写下再平衡触发条件。' },
    { book: '《漫步华尔街》', author: '伯顿·马尔基尔', core: '市场大体有效，长期战胜市场极难，指数化投资是普通人最优解。', points: ['技术分析与短期择时的长期胜率极低', '成本是可控变量，收益不是', '生命周期投资：年龄决定风险资产比例', '定期再平衡带来纪律性收益'], action: '把核心仓位换成低费率宽基指数，减少交易频率。' },
    { book: '《投资最重要的事》', author: '霍华德·马克斯', core: '第二层思维：不是判断好公司，而是判断价格是否已充分反映共识。', points: ['理解周期位置比预测未来更现实', '风险不等于波动，而是永久性损失的可能', '逆向投资需要基本面支撑与心理承受力', '耐心等待机会，是主动的策略而非被动'], action: '每季度记录一次市场情绪与估值分位，作为仓位调整依据。' },
    { book: '《穷查理宝典》', author: '查理·芒格', core: '用多学科思维模型看问题，避免手里只有锤子看什么都是钉子。', points: ['反过来想，总是反过来想', '避免愚蠢比追求聪明更有效', '激励机制决定行为，分析问题先看利益结构', '能力圈的边界比大小更重要'], action: '列出三条你的能力圈边界，超出即不投。' },
    { book: '《原则》', author: '瑞·达利欧', core: '把现实、痛苦与反思转化为可复用的原则，形成决策系统。', points: ['痛苦 + 反思 = 进步', '极度求真与极度透明', '用可信度加权的方式做决策', '平衡型组合（全天候思路）应对不同经济环境'], action: '为投资与工作各写下 5 条个人原则，季度更新。' },
    { book: '《随机漫步的傻瓜》', author: '纳西姆·塔勒布', core: '我们系统性地低估随机性在结果中的作用，把运气误认为能力。', points: ['关注决策质量而非单次结果', '警惕幸存者偏差与叙事谬误', '罕见事件的影响远大于其概率', '保护自己免受极端损失比优化平均收益更重要'], action: '为组合设置极端情形压力测试：下跌 30% 是否仍能持有。' },
    { book: '《非理性繁荣》', author: '罗伯特·席勒', core: '资产泡沫由社会心理与反馈循环驱动，不是纯理性定价的结果。', points: ['媒体与叙事会放大价格趋势', 'CAPE 估值对长期回报有预测力', '群体情绪具有传染性', '制度设计可以缓解个体非理性'], action: '在情绪高涨时主动降低仓位，而非追加投入。' },
    { book: '《巴菲特致股东的信》', author: '沃伦·巴菲特', core: '把股票视为企业所有权，长期持有具备护城河的优质生意。', points: ['护城河来自品牌、成本、网络与转换成本', '留存收益的再投资回报率是核心指标', '价格合理的伟大公司优于价格便宜的平庸公司', '现金是期权，保持弹药'], action: '为持仓写一段“如果停牌三年我是否安心”的说明。' },
    { book: '《怎样选择成长股》', author: '菲利普·费雪', core: '闲聊法调研 + 十五要点清单，寻找长期成长的卓越企业。', points: ['管理层诚信与研发能力是长期变量', '销售能力常被低估', '利润率趋势比绝对值重要', '过度分散会稀释研究深度'], action: '用十五要点简化版为一只持仓打分。' },
    { book: '《彼得·林奇的成功投资》', author: '彼得·林奇', core: '从日常生活中发现投资机会，做自己能理解的功课。', points: ['六类公司分类法决定不同预期', '本益成长比（PEG）辅助估值判断', '业余投资者具有灵活性优势', '不做功课的直觉投资等同赌博'], action: '记录本月你重复消费三次以上的产品，作为研究起点。' },
    { book: '《共同基金常识》', author: '约翰·博格', core: '成本决定长期胜负，简单指数化是多数人的最优方案。', points: ['均值回归适用于基金业绩', '费用侵蚀复利，长期差异惊人', '换手率越高，隐性成本越高', '坚持才是最难的部分'], action: '统计你所有持仓的加权费率，尝试降低 0.3 个百分点。' },
    { book: '《金融炼金术》', author: '乔治·索罗斯', core: '反身性：认知与现实相互影响，价格可以改变基本面。', points: ['市场偏见会自我强化直至不可持续', '识别趋势拐点比跟随趋势更关键', '承认错误是生存前提', '风险来自确定感而非不确定感'], action: '为每笔投资写下“什么情况证明我错了”。' },
    { book: '《行为投资学》', author: '詹姆斯·蒙蒂尔', core: '投资失败大多源于行为偏差而非知识缺乏。', points: ['过度自信导致过度交易', '损失厌恶导致拿不住盈利', '锚定与确认偏差扭曲判断', '流程化与清单是解药'], action: '本月强制减少一半交易次数并记录结果。' },
    { book: '《富爸爸穷爸爸》', author: '罗伯特·清崎', core: '区分资产与负债：资产把钱放进口袋，负债把钱拿走。', points: ['财务自由 = 被动收入 > 生活支出', '先支付自己（储蓄与投资优先）', '提高财商比提高收入更持久', '现金流思维优于账面财富思维'], action: '列出你的资产与负债清单，计算被动收入覆盖率。' },
    { book: '《小狗钱钱》', author: '博多·舍费尔', core: '用简单可执行的习惯建立财务纪律，从小额开始。', points: ['成功日记积累自信', '梦想储蓄罐让目标具象化', '72 小时法则：想到就在三天内启动', '每月固定比例强制储蓄'], action: '设定工资到账当日自动转出 20% 至投资账户。' },
    { book: '《money 钱的心理学》', author: '摩根·豪泽尔', core: '理财是行为学科而非数学学科，性格比智商更影响结果。', points: ['活得久比赚得快更重要', '尾部事件贡献大部分收益', '财富是看不见的那部分', '为“不确定”留出冗余'], action: '把组合中留 10% 现金作为“心理安全垫”。' },
    { book: '《证券分析》', author: '格雷厄姆 / 多德', core: '以企业内在价值为锚，用严谨分析替代市场情绪。', points: ['净流动资产估值法提供极端安全边际', '区分周期性与稳定性盈利', '负债结构决定企业生存能力', '分析师应保持怀疑态度'], action: '为一家熟悉的公司计算简易内在价值区间。' },
    { book: '《股市稳赚》', author: '乔尔·格林布拉特', core: '神奇公式：高资本回报率 + 低估值的组合化机械执行。', points: ['策略有效的前提是长期不间断执行', '策略会经历难熬的落后期', '机械化减少情绪干扰', '组合化分散单一失败风险'], action: '把自选股按 ROIC 与 EV/EBIT 两列排序，观察重合区。' },
    { book: '《周期》', author: '霍华德·马克斯', core: '经济、信贷与情绪周期叠加，决定资产价格的钟摆位置。', points: ['信贷周期是波动的放大器', '钟摆很少停在中点', '在极端处采取行动，在中间保持谦逊', '定位比预测更有价值'], action: '用一句话描述当前市场处于周期哪个阶段及理由。' },
    { book: '《有效资产管理》', author: '威廉·伯恩斯坦', core: '资产配置理论的实用化：相关性、再平衡与长期纪律。', points: ['低相关资产组合提升风险调整收益', '再平衡是收益来源之一', '历史数据只能提供参考不能保证未来', '简单四资产组合已能满足多数人'], action: '检查你的持仓相关性，剔除高度重叠的品种。' }
  ],

  /* ---------- 英语学习（每日 10 分钟） ---------- */
  english: [
    {
      theme: 'Business Meeting 商务会议',
      words: [{ w: 'agenda', ph: '/əˈdʒendə/', cn: '议程' }, { w: 'follow up', ph: '/ˈfɒləʊ ʌp/', cn: '跟进' }, { w: 'deadline', ph: '/ˈdedlaɪn/', cn: '截止时间' }, { w: 'align', ph: '/əˈlaɪn/', cn: '达成一致' }, { w: 'stakeholder', ph: '/ˈsteɪkhəʊldə/', cn: '利益相关方' }, { w: 'wrap up', ph: '/ræp ʌp/', cn: '结束、总结' }],
      sentences: [{ en: 'Let me walk you through the agenda.', cn: '我来带大家过一遍议程。' }, { en: 'Could you follow up with the client by Friday?', cn: '你能在周五前跟进一下客户吗？' }, { en: 'We need to align on priorities before moving forward.', cn: '推进之前我们需要在优先级上达成一致。' }, { en: 'Let us wrap up and circle back next week.', cn: '我们先收尾，下周再讨论。' }],
      oral: [{ q: 'How do you usually prepare for a meeting?', a: 'I review the agenda, list two key questions, and prepare a one-page summary in advance.' }, { q: 'What makes a meeting effective?', a: 'A clear goal, a short agenda, and written action items with owners and deadlines.' }],
      task: '用英文写下今天会议的三条行动项（含负责人与截止时间）。'
    },
    {
      theme: 'Email Writing 商务邮件',
      words: [{ w: 'attached', ph: '/əˈtætʃt/', cn: '附件中的' }, { w: 'regarding', ph: '/rɪˈɡɑːdɪŋ/', cn: '关于' }, { w: 'confirm', ph: '/kənˈfɜːm/', cn: '确认' }, { w: 'at your earliest convenience', ph: '', cn: '您方便时尽早' }, { w: 'clarify', ph: '/ˈklærɪfaɪ/', cn: '澄清' }, { w: 'proceed', ph: '/prəˈsiːd/', cn: '推进' }],
      sentences: [{ en: 'Please find the report attached for your review.', cn: '随附报告，请您审阅。' }, { en: 'I am writing regarding the schedule change.', cn: '我写信是关于日程变更的事。' }, { en: 'Could you confirm receipt at your earliest convenience?', cn: '方便时请确认收到。' }, { en: 'Just to clarify, we will proceed with option B.', cn: '澄清一下，我们将推进方案 B。' }],
      oral: [{ q: 'How do you keep emails short?', a: 'One topic per email, the request in the first line, and bullet points for details.' }, { q: 'How do you politely chase a reply?', a: 'I say: Just checking in on this, do you need anything from my side to move forward?' }],
      task: '用 5 句话写一封英文跟进邮件，要求首句即为请求。'
    },
    {
      theme: 'Small Talk 寒暄破冰',
      words: [{ w: 'catch up', ph: '/kætʃ ʌp/', cn: '叙旧、了解近况' }, { w: 'appreciate', ph: '/əˈpriːʃieɪt/', cn: '感激' }, { w: 'coincidence', ph: '/kəʊˈɪnsɪdəns/', cn: '巧合' }, { w: 'by the way', ph: '', cn: '顺便说' }, { w: 'keep in touch', ph: '', cn: '保持联系' }, { w: 'It has been a while', ph: '', cn: '好久不见' }],
      sentences: [{ en: 'It has been a while — how have you been?', cn: '好久不见，最近怎么样？' }, { en: 'I really appreciate you making the time.', cn: '非常感谢你抽出时间。' }, { en: 'By the way, how is the new project going?', cn: '顺便问一下，新项目进展如何？' }, { en: 'Let us keep in touch and grab coffee sometime.', cn: '保持联系，改天一起喝咖啡。' }],
      oral: [{ q: 'Tell me about your weekend.', a: 'I kept it simple — a long walk on Saturday and some reading on Sunday.' }, { q: 'How do you end a conversation politely?', a: 'I say: It was great catching up, I will let you get back to it.' }],
      task: '准备三句可复用的英文寒暄开场白并朗读五遍。'
    },
    {
      theme: 'Negotiation 商务谈判',
      words: [{ w: 'leverage', ph: '/ˈliːvərɪdʒ/', cn: '筹码、影响力' }, { w: 'compromise', ph: '/ˈkɒmprəmaɪz/', cn: '折中' }, { w: 'terms', ph: '/tɜːmz/', cn: '条款' }, { w: 'flexible', ph: '/ˈfleksəbl/', cn: '灵活的' }, { w: 'bottom line', ph: '', cn: '底线' }, { w: 'win-win', ph: '', cn: '双赢' }],
      sentences: [{ en: 'We are flexible on timing but firm on price.', cn: '时间上我们可以灵活，价格上不能让步。' }, { en: 'What would it take to make this work for you?', cn: '怎样才能让这个方案对你可行？' }, { en: 'Let us find a win-win structure here.', cn: '我们来找一个双赢的结构。' }, { en: 'That is slightly below our bottom line.', cn: '这略低于我们的底线。' }],
      oral: [{ q: 'How do you handle a price objection?', a: 'I ask what value matters most to them, then restructure the package instead of cutting price directly.' }, { q: 'How do you say no politely?', a: 'I say: I understand where you are coming from, but that is not something we can commit to right now.' }],
      task: '用英文写下你的谈判底线与两个可让步项。'
    },
    {
      theme: 'Travel & Hotel 出差旅行',
      words: [{ w: 'itinerary', ph: '/aɪˈtɪnərəri/', cn: '行程' }, { w: 'check-in', ph: '', cn: '登记入住' }, { w: 'reservation', ph: '/ˌrezəˈveɪʃn/', cn: '预订' }, { w: 'boarding pass', ph: '', cn: '登机牌' }, { w: 'layover', ph: '/ˈleɪəʊvə/', cn: '中转停留' }, { w: 'receipt', ph: '/rɪˈsiːt/', cn: '收据' }],
      sentences: [{ en: 'I have a reservation under the name Chen.', cn: '我有一个以陈为名的预订。' }, { en: 'Could I get a late check-out, please?', cn: '可以延迟退房吗？' }, { en: 'How long is the layover in Singapore?', cn: '在新加坡中转停留多久？' }, { en: 'May I have a receipt for the expense report?', cn: '可以给我一张收据用于报销吗？' }],
      oral: [{ q: 'Describe your ideal business trip.', a: 'Direct flights, a hotel close to the office, and one free evening to walk around the city.' }, { q: 'What do you always pack?', a: 'A power bank, a spare shirt, and noise-cancelling earphones.' }],
      task: '用英文口述一次三天出差的完整行程。'
    },
    {
      theme: 'Reporting to Boss 汇报工作',
      words: [{ w: 'update', ph: '/ˈʌpdeɪt/', cn: '进展更新' }, { w: 'on track', ph: '', cn: '按计划进行' }, { w: 'blocker', ph: '/ˈblɒkə/', cn: '阻碍项' }, { w: 'escalate', ph: '/ˈeskəleɪt/', cn: '上报升级' }, { w: 'takeaway', ph: '/ˈteɪkəweɪ/', cn: '要点结论' }, { w: 'next steps', ph: '', cn: '下一步' }],
      sentences: [{ en: 'Quick update: the project is on track for Friday.', cn: '简要汇报：项目按计划周五完成。' }, { en: 'There is one blocker I need your decision on.', cn: '有一个阻碍项需要您决策。' }, { en: 'The key takeaway is that costs are 8% under budget.', cn: '核心结论是成本低于预算 8%。' }, { en: 'Next steps are listed at the end of the deck.', cn: '下一步计划列在文档最后。' }],
      oral: [{ q: 'How do you structure a status update?', a: 'Status, risks, decisions needed, next steps — in that order, under two minutes.' }, { q: 'How do you report bad news?', a: 'State the fact, the impact, the cause, and the fix I propose — no excuses first.' }],
      task: '用英文准备一段 60 秒的项目汇报，包含结论先行结构。'
    },
    {
      theme: 'Finance & Investment 金融投资',
      words: [{ w: 'portfolio', ph: '/pɔːtˈfəʊliəʊ/', cn: '投资组合' }, { w: 'volatility', ph: '/ˌvɒləˈtɪləti/', cn: '波动率' }, { w: 'dividend', ph: '/ˈdɪvɪdend/', cn: '股息' }, { w: 'allocation', ph: '/ˌæləˈkeɪʃn/', cn: '配置' }, { w: 'hedge', ph: '/hedʒ/', cn: '对冲' }, { w: 'yield', ph: '/jiːld/', cn: '收益率' }],
      sentences: [{ en: 'We keep a diversified portfolio to reduce volatility.', cn: '我们保持分散配置以降低波动。' }, { en: 'The dividend yield is around three percent.', cn: '股息率约为百分之三。' }, { en: 'Our allocation is sixty percent equity, forty percent bonds.', cn: '我们的配置是六成权益、四成债券。' }, { en: 'Gold works as a hedge against uncertainty.', cn: '黄金可作为对冲不确定性的工具。' }],
      oral: [{ q: 'What is your investment philosophy?', a: 'Long-term, low-cost, diversified, and rebalanced once a year.' }, { q: 'How do you handle market drops?', a: 'I check whether my time horizon changed. If not, I do nothing or add gradually.' }],
      task: '用英文向他人解释你的资产配置比例与理由。'
    },
    {
      theme: 'Time Management 时间管理',
      words: [{ w: 'prioritize', ph: '/praɪˈɒrətaɪz/', cn: '排优先级' }, { w: 'delegate', ph: '/ˈdelɪɡeɪt/', cn: '授权分派' }, { w: 'bandwidth', ph: '/ˈbændwɪdθ/', cn: '精力容量' }, { w: 'urgent', ph: '/ˈɜːdʒənt/', cn: '紧急的' }, { w: 'block time', ph: '', cn: '整块时间' }, { w: 'buffer', ph: '/ˈbʌfə/', cn: '缓冲' }],
      sentences: [{ en: 'I block two hours every morning for deep work.', cn: '我每天上午留出两小时做深度工作。' }, { en: 'I do not have the bandwidth this week.', cn: '这周我精力上顾不过来。' }, { en: 'Let us prioritize the top three and drop the rest.', cn: '我们先做前三项，其余先放下。' }, { en: 'Always leave a buffer between meetings.', cn: '会议之间一定要留缓冲。' }],
      oral: [{ q: 'How do you plan your day?', a: 'Three must-dos at night for the next morning, then protect the first two hours.' }, { q: 'How do you say no to extra work?', a: 'I say: I can take it on next week, or I can drop X to fit it in — which do you prefer?' }],
      task: '用英文写出明天的三件必做事项及时间块安排。'
    },
    {
      theme: 'Presentation 演讲表达',
      words: [{ w: 'audience', ph: '/ˈɔːdiəns/', cn: '听众' }, { w: 'highlight', ph: '/ˈhaɪlaɪt/', cn: '重点强调' }, { w: 'transition', ph: '/trænˈzɪʃn/', cn: '过渡' }, { w: 'takeaway', ph: '', cn: '收获要点' }, { w: 'engage', ph: '/ɪnˈɡeɪdʒ/', cn: '吸引参与' }, { w: 'summarize', ph: '/ˈsʌməraɪz/', cn: '总结' }],
      sentences: [{ en: 'Today I will cover three points.', cn: '今天我讲三点。' }, { en: 'Let me highlight the most important finding.', cn: '我强调一下最重要的发现。' }, { en: 'Moving on to the second part…', cn: '进入第二部分……' }, { en: 'To summarize, we recommend option A.', cn: '总结来说，我们建议方案 A。' }],
      oral: [{ q: 'How do you open a presentation?', a: 'With a number or a question that matters to the audience, not with my own introduction.' }, { q: 'How do you handle tough questions?', a: 'Repeat the question, answer in one sentence, then give one supporting reason.' }],
      task: '用英文准备 3 分钟主题演讲的开场与结尾。'
    },
    {
      theme: 'Daily Office 日常办公',
      words: [{ w: 'schedule', ph: '/ˈʃedjuːl/', cn: '安排日程' }, { w: 'reschedule', ph: '', cn: '改期' }, { w: 'available', ph: '/əˈveɪləbl/', cn: '有空的' }, { w: 'brief', ph: '/briːf/', cn: '简要说明' }, { w: 'sign off', ph: '', cn: '批准签字' }, { w: 'loop in', ph: '', cn: '把某人加进来' }],
      sentences: [{ en: 'Are you available at three this afternoon?', cn: '今天下午三点你有空吗？' }, { en: 'Can we reschedule to tomorrow morning?', cn: '能改到明天上午吗？' }, { en: 'I will loop in the finance team.', cn: '我会把财务团队拉进来。' }, { en: 'We still need the director to sign off.', cn: '还需要总监签字批准。' }],
      oral: [{ q: 'Describe a typical work day.', a: 'Emails first thirty minutes, deep work until noon, meetings in the afternoon, review at six.' }, { q: 'What tool do you rely on most?', a: 'A simple task list with three priorities per day — anything more complex I stop using.' }],
      task: '用英文安排一次跨部门会议邀请（含时间、议题、参与人）。'
    },
    {
      theme: 'Problem Solving 解决问题',
      words: [{ w: 'root cause', ph: '', cn: '根本原因' }, { w: 'workaround', ph: '/ˈwɜːkəraʊnd/', cn: '变通方案' }, { w: 'trade-off', ph: '', cn: '取舍' }, { w: 'mitigate', ph: '/ˈmɪtɪɡeɪt/', cn: '缓解' }, { w: 'contingency', ph: '/kənˈtɪndʒənsi/', cn: '应急预案' }, { w: 'iterate', ph: '/ˈɪtəreɪt/', cn: '迭代' }],
      sentences: [{ en: 'Let us find the root cause before fixing symptoms.', cn: '先找根因，再解决表象。' }, { en: 'There is a trade-off between speed and quality.', cn: '速度与质量之间存在取舍。' }, { en: 'We have a contingency plan if suppliers delay.', cn: '若供应商延误我们有应急方案。' }, { en: 'We will iterate based on user feedback.', cn: '我们会根据反馈迭代。' }],
      oral: [{ q: 'Describe a problem you solved recently.', a: 'A delivery delay — I found the bottleneck in approvals and cut two steps, saving three days.' }, { q: 'How do you decide under uncertainty?', a: 'I pick the reversible option first and set a checkpoint to review in one week.' }],
      task: '用英文描述一个你解决过的问题（情境-行动-结果结构）。'
    },
    {
      theme: 'Health & Lifestyle 健康生活',
      words: [{ w: 'routine', ph: '/ruːˈtiːn/', cn: '日常习惯' }, { w: 'stretch', ph: '/stretʃ/', cn: '拉伸' }, { w: 'endurance', ph: '/ɪnˈdjʊərəns/', cn: '耐力' }, { w: 'recovery', ph: '/rɪˈkʌvəri/', cn: '恢复' }, { w: 'nutrition', ph: '/njuˈtrɪʃn/', cn: '营养' }, { w: 'consistency', ph: '/kənˈsɪstənsi/', cn: '持续性' }],
      sentences: [{ en: 'Consistency matters more than intensity.', cn: '持续性比强度更重要。' }, { en: 'I stretch for ten minutes before bed.', cn: '我睡前拉伸十分钟。' }, { en: 'Recovery is part of the training.', cn: '恢复也是训练的一部分。' }, { en: 'I try to walk ten thousand steps a day.', cn: '我尽量每天走一万步。' }],
      oral: [{ q: 'What is your fitness routine?', a: 'Thirty minutes a day: strength twice a week, walking or cycling on other days.' }, { q: 'How do you stay consistent?', a: 'I keep the bar low — never skip two days in a row.' }],
      task: '用英文写下你本周的运动计划与恢复安排。'
    },
    {
      theme: 'Networking 人脉沟通',
      words: [{ w: 'introduce', ph: '/ˌɪntrəˈdjuːs/', cn: '介绍' }, { w: 'connection', ph: '/kəˈnekʃn/', cn: '人脉联系' }, { w: 'referral', ph: '/rɪˈfɜːrəl/', cn: '推荐引荐' }, { w: 'reach out', ph: '', cn: '主动联系' }, { w: 'mutual', ph: '/ˈmjuːtʃuəl/', cn: '共同的' }, { w: 'value', ph: '/ˈvæljuː/', cn: '价值' }],
      sentences: [{ en: 'We have a mutual connection at that company.', cn: '我们在那家公司有共同的联系人。' }, { en: 'I would love an introduction if you are comfortable.', cn: '如果方便的话，希望能引荐一下。' }, { en: 'I reached out to him last week.', cn: '我上周主动联系了他。' }, { en: 'What value can I bring to you first?', cn: '我能先为你提供什么价值？' }],
      oral: [{ q: 'How do you build professional relationships?', a: 'I give first — share a useful article or introduction before asking for anything.' }, { q: 'How do you introduce yourself in 20 seconds?', a: 'Name, what I help people with, and one concrete example.' }],
      task: '用英文写一段 30 秒的自我介绍（含一句成果举例）。'
    },
    {
      theme: 'Data & Numbers 数据表达',
      words: [{ w: 'increase by', ph: '', cn: '增长了' }, { w: 'decline', ph: '/dɪˈklaɪn/', cn: '下降' }, { w: 'roughly', ph: '/ˈrʌfli/', cn: '大约' }, { w: 'compared to', ph: '', cn: '与……相比' }, { w: 'peak', ph: '/piːk/', cn: '峰值' }, { w: 'trend', ph: '/trend/', cn: '趋势' }],
      sentences: [{ en: 'Revenue increased by twelve percent year over year.', cn: '收入同比增长百分之十二。' }, { en: 'Costs declined slightly compared to last quarter.', cn: '成本较上季度小幅下降。' }, { en: 'The number peaked in March and then flattened.', cn: '数字在三月见顶随后走平。' }, { en: 'Roughly one third of users are active weekly.', cn: '约三分之一用户每周活跃。' }],
      oral: [{ q: 'Describe a chart you saw recently.', a: 'A steady upward trend with a dip in the middle, ending about twenty percent higher.' }, { q: 'How do you make numbers memorable?', a: 'I convert them into one comparison people already understand.' }],
      task: '用英文口述一组业务数据的同比与环比变化。'
    },
    {
      theme: 'Feedback 反馈与评价',
      words: [{ w: 'constructive', ph: '/kənˈstrʌktɪv/', cn: '建设性的' }, { w: 'acknowledge', ph: '/əkˈnɒlɪdʒ/', cn: '认可' }, { w: 'improve', ph: '/ɪmˈpruːv/', cn: '改进' }, { w: 'specific', ph: '/spəˈsɪfɪk/', cn: '具体的' }, { w: 'perspective', ph: '/pəˈspektɪv/', cn: '视角' }, { w: 'appreciate', ph: '', cn: '感谢认可' }],
      sentences: [{ en: 'Can I share some constructive feedback?', cn: '我可以提一些建设性反馈吗？' }, { en: 'I appreciate how you handled the client call.', cn: '我很认可你处理客户电话的方式。' }, { en: 'One thing to improve is the level of detail.', cn: '一个可改进点是细节颗粒度。' }, { en: 'Let me offer a different perspective.', cn: '我提供一个不同视角。' }],
      oral: [{ q: 'How do you give critical feedback?', a: 'Situation, behavior, impact — then ask for their view before proposing a change.' }, { q: 'How do you receive feedback?', a: 'I thank them, ask for one specific example, and confirm what I will change.' }],
      task: '用英文写一段 SBI 结构（情境-行为-影响）的反馈。'
    },
    {
      theme: 'Decision Making 决策沟通',
      words: [{ w: 'criteria', ph: '/kraɪˈtɪəriə/', cn: '标准' }, { w: 'assumption', ph: '/əˈsʌmpʃn/', cn: '假设' }, { w: 'downside', ph: '/ˈdaʊnsaɪd/', cn: '不利面' }, { w: 'reversible', ph: '/rɪˈvɜːsəbl/', cn: '可逆的' }, { w: 'commit', ph: '/kəˈmɪt/', cn: '承诺投入' }, { w: 'validate', ph: '/ˈvælɪdeɪt/', cn: '验证' }],
      sentences: [{ en: 'What criteria are we using to decide?', cn: '我们用什么标准来决策？' }, { en: 'The downside is limited and reversible.', cn: '不利面有限且可逆。' }, { en: 'Let us validate the assumption with data first.', cn: '先用数据验证假设。' }, { en: 'I am ready to commit once we see the numbers.', cn: '看到数据后我就可以拍板。' }],
      oral: [{ q: 'How do you make hard decisions?', a: 'I write the criteria first, score the options, and check the worst case I can accept.' }, { q: 'What if you are wrong?', a: 'I choose reversible options and set an early checkpoint to correct course.' }],
      task: '用英文列出一个决策的三条标准与最坏情况。'
    },
    {
      theme: 'Client Service 客户服务',
      words: [{ w: 'expectation', ph: '/ˌekspekˈteɪʃn/', cn: '预期' }, { w: 'resolve', ph: '/rɪˈzɒlv/', cn: '解决' }, { w: 'apologize', ph: '/əˈpɒlədʒaɪz/', cn: '致歉' }, { w: 'priority', ph: '/praɪˈɒrəti/', cn: '优先事项' }, { w: 'update', ph: '', cn: '进展通报' }, { w: 'satisfaction', ph: '/ˌsætɪsˈfækʃn/', cn: '满意度' }],
      sentences: [{ en: 'I apologize for the delay — here is what we are doing.', cn: '为延误致歉，以下是我们的应对。' }, { en: 'Let me set clear expectations on timing.', cn: '我来明确一下时间预期。' }, { en: 'I will send you an update by end of day.', cn: '我会在今天下班前给您更新。' }, { en: 'Your request is our top priority today.', cn: '您的需求是我们今天的最高优先级。' }],
      oral: [{ q: 'How do you handle an angry client?', a: 'Listen fully, acknowledge the impact, state one concrete action and a time.' }, { q: 'How do you exceed expectations?', a: 'I under-promise on timing and deliver one extra useful detail.' }],
      task: '用英文写一封延期致歉并给出补救方案的邮件。'
    },
    {
      theme: 'Reading News 读英文财经新闻',
      words: [{ w: 'inflation', ph: '/ɪnˈfleɪʃn/', cn: '通货膨胀' }, { w: 'recession', ph: '/rɪˈseʃn/', cn: '经济衰退' }, { w: 'earnings', ph: '/ˈɜːnɪŋz/', cn: '盈利' }, { w: 'forecast', ph: '/ˈfɔːkɑːst/', cn: '预测' }, { w: 'benchmark', ph: '/ˈbentʃmɑːk/', cn: '基准' }, { w: 'sentiment', ph: '/ˈsentɪmənt/', cn: '市场情绪' }],
      sentences: [{ en: 'Inflation cooled more than expected last month.', cn: '上月通胀降温超预期。' }, { en: 'Earnings beat forecasts across the sector.', cn: '该板块盈利普遍超预期。' }, { en: 'Market sentiment remains cautious.', cn: '市场情绪仍偏谨慎。' }, { en: 'The index outperformed its benchmark.', cn: '该指数跑赢基准。' }],
      oral: [{ q: 'Summarize a financial headline in one sentence.', a: 'Prices rose slower than expected, which supports the case for lower rates later this year.' }, { q: 'Why read English financial news?', a: 'It gives earlier access to primary sources and reduces translation bias.' }],
      task: '找一条英文财经新闻，用三句英文概括核心事实与影响。'
    },
    {
      theme: 'Interview 面试与招聘',
      words: [{ w: 'strength', ph: '/streŋθ/', cn: '优势' }, { w: 'achievement', ph: '/əˈtʃiːvmənt/', cn: '成就' }, { w: 'responsibility', ph: '/rɪˌspɒnsəˈbɪləti/', cn: '职责' }, { w: 'motivation', ph: '/ˌməʊtɪˈveɪʃn/', cn: '动机' }, { w: 'fit', ph: '/fɪt/', cn: '匹配度' }, { w: 'growth', ph: '/ɡrəʊθ/', cn: '成长' }],
      sentences: [{ en: 'My biggest achievement was cutting costs by fifteen percent.', cn: '我最大的成就是把成本降低了 15%。' }, { en: 'I am motivated by solving complex problems.', cn: '解决复杂问题让我有动力。' }, { en: 'I was responsible for a team of eight.', cn: '我负责一个八人团队。' }, { en: 'I am looking for a role with more growth.', cn: '我希望有更大成长空间的岗位。' }],
      oral: [{ q: 'Tell me about yourself.', a: 'Three parts: what I do now, one measurable result, and why this role fits next.' }, { q: 'What is your weakness?', a: 'I over-prepare. I now set a time limit and ship the draft earlier.' }],
      task: '用英文准备 STAR 结构的一段经历陈述。'
    },
    {
      theme: 'Culture & Etiquette 跨文化礼仪',
      words: [{ w: 'punctual', ph: '/ˈpʌŋktʃuəl/', cn: '守时的' }, { w: 'courtesy', ph: '/ˈkɜːtəsi/', cn: '礼貌' }, { w: 'formal', ph: '/ˈfɔːml/', cn: '正式的' }, { w: 'custom', ph: '/ˈkʌstəm/', cn: '风俗' }, { w: 'respect', ph: '/rɪˈspekt/', cn: '尊重' }, { w: 'hospitality', ph: '/ˌhɒspɪˈtæləti/', cn: '款待' }],
      sentences: [{ en: 'Being punctual is a sign of respect.', cn: '守时是尊重的体现。' }, { en: 'Thank you for your warm hospitality.', cn: '感谢您的热情款待。' }, { en: 'Is this meeting formal or casual?', cn: '这次会议是正式的还是轻松的？' }, { en: 'I would like to learn more about local customs.', cn: '我想多了解当地风俗。' }],
      oral: [{ q: 'What surprised you about another culture?', a: 'How directly feedback is given — it felt harsh at first but saves a lot of time.' }, { q: 'How do you show respect in business?', a: 'Prepare, be on time, use their name correctly, and follow up in writing.' }],
      task: '用英文写下三条跨文化商务礼仪注意事项。'
    }
  ],

  /* ---------- 中文优质文章素材 ---------- */
  chinese: [
    { title: '把复杂的事情做简单，是一种能力', author: '管理随笔', source: '效率思维', text: '真正的高手，不是把简单的事情做复杂，而是把复杂的事情做简单。复杂来自两处：一是问题本身的结构复杂，二是我们对问题的理解不清晰。前者需要拆解，后者需要提炼。\n\n拆解的方法是找主干：任何一件事，去掉所有修饰之后，剩下的那个动作是什么？提炼的方法是问结论：如果只能说一句话，你要说什么？\n\n把这两个动作变成习惯，你会发现大部分所谓的复杂，只是没有想清楚。', insight: '简化不是省略，而是找到承重结构。', quote: '如果你不能简单地说明白，说明你还没有真正理解。' },
    { title: '做时间的朋友，先做习惯的朋友', author: '成长笔记', source: '自我管理', text: '人们喜欢谈复利，却常常忽略复利的前提——持续。持续依赖的不是意志力，而是系统。意志力会耗尽，系统不会。\n\n建立系统的三个要点：降低启动成本（把书放在枕边）、固定触发条件（喝完早咖啡就写作）、保留最低标准（今天最少做五分钟）。\n\n当一件事不再需要你决定做不做，它才真正成为你的一部分。', insight: '不要依赖动力，要依赖设计。', quote: '习惯是把未来的自己，交给今天的系统去照顾。' },
    { title: '沟通的本质，是降低对方的理解成本', author: '职场观察', source: '沟通之道', text: '很多人误以为沟通是把自己想说的说完，其实沟通是让对方用最小的努力理解你的意图。\n\n三个可立即执行的技巧：结论先行，先说要什么再说为什么；用对方的语言，把专业术语换成他熟悉的比喻；给出选项，而不是抛出问题。\n\n汇报时，一句话能让老板做决定，就不要写三页纸让他自己找答案。', insight: '好的沟通是替对方做减法。', quote: '你说了什么不重要，对方听懂了什么才重要。' },
    { title: '独处的能力，是稀缺的竞争力', author: '生活哲思', source: '心性修养', text: '信息越密集，独处越昂贵。独处不是孤僻，而是给思考留出不被打断的空间。\n\n每天保留 30 分钟不带手机的时间：散步、写字、发呆都可以。你会发现真正重要的判断，往往不是在会议里产生的，而是在安静的间隙里浮现的。\n\n能安静下来的人，判断力都不会差。', insight: '思考需要留白，决策需要安静。', quote: '一个人安静的深度，决定了他判断的清晰度。' },
    { title: '延迟满足，不是压抑欲望', author: '心理笔记', source: '行为心理', text: '延迟满足常被误解为忍耐，其实它的核心是把注意力从“现在的快乐”转移到“更值得的快乐”。\n\n斯坦福棉花糖实验里，成功等待的孩子并不是更能忍，而是更会转移注意力——他们唱歌、遮眼睛、想别的事。\n\n所以提升自控力的方式，不是硬扛，而是改变环境与注意力路径：把手机放另一个房间，比一百次告诫自己有效。', insight: '自控是环境设计问题，不是道德问题。', quote: '真正的自律，是让正确的选择变得更容易。' },
    { title: '认真的人，往往赢在细节的稳定性', author: '匠人笔记', source: '职业素养', text: '一次做好一件事不难，难的是每次都做好。稳定性来自可复用的流程，而不是临场的发挥。\n\n把做过一次的事沉淀成清单，把犯过的错写成规则，把偶然的成功变成方法。三个月后，你的产出会明显和别人拉开距离。\n\n专业与业余的分界线，不在最高水平，而在最低水平。', insight: '衡量专业度，看下限而非上限。', quote: '偶尔的出色是天赋，持续的稳定是专业。' },
    { title: '会休息的人，才走得远', author: '健康随笔', source: '身心平衡', text: '很多人把休息理解为不工作，其实真正的休息是切换。体力劳动后需要静，脑力劳动后需要动。\n\n工作四小时后，散步二十分钟带来的恢复效果，往往超过刷两小时手机。因为屏幕带来的是刺激，不是恢复。\n\n把休息安排进日程，而不是等到累了才休息。预防性的休息，成本最低。', insight: '休息是生产力的一部分，不是它的对立面。', quote: '持续输出的前提，是有节奏的回收。' },
    { title: '读书的三种读法', author: '阅读方法', source: '学习方法', text: '第一种是消遣式阅读，读完开心即可；第二种是学习式阅读，读完能复述框架；第三种是应用式阅读，读完能改变行为。\n\n判断标准很简单：合上书，你能不能说出这本书解决了什么问题、给了什么方法、你打算改哪一件事。\n\n三个问题答不上来，读得再多也只是信息经过。', insight: '阅读的产出不是页数，而是行为改变。', quote: '书读完不是终点，做完才是。' },
    { title: '把目标写下来，它才开始存在', author: '目标管理', source: '自我管理', text: '大脑擅长处理眼前的信息，不擅长保管长期意图。写下来的目标之所以更容易实现，是因为它从记忆负担变成了外部提示。\n\n有效的目标有三个特征：可量化、有期限、有下一步动作。“今年多读书”不是目标，“每月读完两本并写 300 字笔记”才是。\n\n不要写你想成为什么样的人，写你明天早上要做什么。', insight: '目标要能被行动直接接住。', quote: '模糊的愿望不会成真，具体的下一步才会。' },
    { title: '情绪不是敌人，是信息', author: '心理笔记', source: '情绪管理', text: '愤怒往往提示边界被侵犯，焦虑提示准备不足，低落提示能量透支。压抑情绪等于关掉仪表盘。\n\n更好的方式是命名：把“我烦死了”换成“我因为进度失控而焦虑”。命名会让杏仁核的激活下降，前额叶重新上线。\n\n给情绪一个准确的名字，你就重新拿回了主动权。', insight: '情绪需要被读懂，而不是被消灭。', quote: '看得见的情绪，才是可以管理的情绪。' },
    { title: '决策的质量，取决于你问了什么问题', author: '思维方法', source: '决策思维', text: '同一个处境，问“我该怎么办”会陷入焦虑，问“如果这是别人的问题我会怎么建议”会立刻清晰。\n\n三个高质量提问：这个决定五年后还重要吗？最坏结果我能承受吗？如果反过来做会怎样？\n\n提问的角度决定了思考的范围，思考的范围决定了选项的质量。', insight: '换个问法，就是换个思维路径。', quote: '答案的上限，取决于问题的质量。' },
    { title: '把注意力当作资产来管理', author: '效率思维', source: '注意力管理', text: '时间是公平的，注意力不是。同样一小时，专注状态下的产出可能是分心状态的五倍。\n\n注意力有三个杀手：切换成本、待办残留、通知打断。对应的解法是批处理、写下未完成事项、物理隔离手机。\n\n保护注意力，是这个时代最高回报的投资。', insight: '管理时间不如管理注意力。', quote: '你把注意力放在哪里，人生就长在哪里。' },
    { title: '对上沟通的三个原则', author: '职场观察', source: '向上管理', text: '第一，给结论不给过程，需要时再展开；第二，给选项不给难题，附带你的建议；第三，给进度不给意外，坏消息要第一时间说。\n\n上级最稀缺的是判断带宽，谁能减少他的判断成本，谁就获得更多授权。\n\n汇报的最高境界，是让对方只需要说“同意”或“按 B 方案”。', insight: '向上管理的本质是降低对方决策成本。', quote: '让老板做选择题，而不是问答题。' },
    { title: '慢就是快：复利在人身上的体现', author: '成长笔记', source: '长期主义', text: '大多数能力的成长曲线不是线性的，而是长时间平缓后突然抬升。平缓期最容易放弃，因为看不到反馈。\n\n穿越平缓期的办法是设置过程指标：不看结果看动作。写作看字数，健身看次数，语言看时长。\n\n当你不再依赖结果反馈，你就获得了长期坚持的能力。', insight: '结果不可控，动作可控。', quote: '把评价标准从结果换成动作，你就赢了一半。' },
    { title: '真正的自信来自证据', author: '心理笔记', source: '自我认知', text: '自信不是自我催眠，而是过往证据的累积。每一次说到做到，都会在心里存下一份信任。\n\n所以建立自信最有效的路径，是从极小的承诺开始并完成：今天读五页、今天写三百字、今天走三千步。\n\n不要一开始就许下宏大的诺言，那只会制造新的自我怀疑。', insight: '自信是兑现承诺累积出来的。', quote: '你对自己的信用，是一笔笔攒出来的。' },
    { title: '会提问的人，学得最快', author: '学习方法', source: '学习方法', text: '低质量提问是“这个怎么做”，高质量提问是“我试过 A 和 B，卡在 C，你会怎么判断”。\n\n后者包含了三层信息：已做的努力、具体的卡点、期望的帮助类型。这让回答者可以直接给到有效信息。\n\n提问的质量，本质是你对问题的加工程度。', insight: '好问题本身就是半个答案。' , quote: '不会提问的人，得到的永远是通用答案。' },
    { title: '把每天的第一件事留给最重要的事', author: '效率思维', source: '时间管理', text: '意志力像电池，早上电量最满。把最重要、最需要思考的事放在一天开始，是最划算的安排。\n\n很多人却把早晨用来处理邮件和消息，等到有整块时间时，已经只剩疲惫的大脑。\n\n每天守住前 90 分钟，一年就多出 500 小时的高质量产出。', insight: '重要的事需要好状态，而不是剩余时间。', quote: '不要用最好的时间做最容易的事。' },
    { title: '与其管理孩子，不如管理环境', author: '育儿笔记', source: '家庭教育', text: '孩子的行为很大程度上由环境触发。书桌上有手机，就很难专注；家里有阅读的场景，孩子就更容易读书。\n\n与其反复提醒和监督，不如改变触发条件：固定的学习角落、可见的书籍、成人以身作则的时间段。\n\n教育的高级形式，是让好行为自然发生。', insight: '改变行为先改变环境。', quote: '你不用说教，环境会替你说话。' },
    { title: '接受不完美，是成年人的必修课', author: '生活哲思', source: '心性修养', text: '完美主义看似高标准，实则是一种拖延机制：因为达不到理想状态，所以迟迟不开始。\n\n更有效的策略是先完成再完美：粗糙的初稿好过完美的构想，因为初稿可以被修改，构想不能。\n\n允许 80 分的存在，你才有机会走到 95 分。', insight: '完成是通往优秀的唯一路径。', quote: '完美是完成的敌人。' },
    { title: '钱的第一个功能，是买回选择权', author: '财富观', source: '财富认知', text: '很多人把钱等同于消费能力，其实它更重要的功能是选择权：可以拒绝不合适的工作，可以等待更好的机会，可以承受一次失败。\n\n所以储蓄率的意义不只是数字，而是自由度。存下六个月开支，你在谈判桌上的底气就完全不同。\n\n真正的富有，是不必被迫做任何事。', insight: '存钱买的是选择权，不是安全感。', quote: '财务自由的第一步，是拥有说不的能力。' }
  ],

  /* ---------- 每日运动计划（30 分钟） ---------- */
  workouts: [
    { name: '全身唤醒循环', focus: '全身 · 低冲击', level: '入门', warmup: ['原地踏步 3 分钟', '肩关节绕环 前后各 20 次', '髋部绕环 左右各 15 次'], main: ['深蹲 15 次 × 3 组', '跪姿俯卧撑 10 次 × 3 组', '臀桥 20 次 × 3 组', '站姿提膝 30 秒 × 3 组'], cooldown: ['股四头肌拉伸 每侧 30 秒', '体前屈 60 秒', '深呼吸 10 次'], tips: '组间休息 45 秒，全程保持能说话的强度。' },
    { name: '办公族颈肩放松', focus: '颈肩背 · 康复向', level: '入门', warmup: ['耸肩放松 20 次', '颈部左右侧屈 每侧 5 次'], main: ['靠墙天使 12 次 × 3 组', 'YTW 抬举 各 10 次 × 3 组', '弹力带划船 15 次 × 3 组', '猫牛式 15 次 × 3 组'], cooldown: ['胸肌门框拉伸 每侧 30 秒', '上斜方肌拉伸 每侧 30 秒'], tips: '动作全程慢速，感受肩胛骨向下收紧。' },
    { name: '核心稳定训练', focus: '核心 · 稳定性', level: '进阶', warmup: ['死虫式 10 次', '鸟狗式 每侧 8 次'], main: ['平板支撑 45 秒 × 4 组', '侧平板 每侧 30 秒 × 3 组', '仰卧抬腿 12 次 × 3 组', '俄罗斯转体 20 次 × 3 组'], cooldown: ['婴儿式 60 秒', '眼镜蛇式 30 秒 × 2'], tips: '腰部不适立即停止，核心收紧优先于时长。' },
    { name: '燃脂间歇（HIIT）', focus: '心肺 · 高强度', level: '进阶', warmup: ['开合跳 60 秒', '高抬腿 30 秒', '动态弓步 每侧 8 次'], main: ['波比跳 30 秒 / 休息 30 秒 × 6', '登山跑 30 秒 / 休息 30 秒 × 6', '深蹲跳 20 秒 / 休息 40 秒 × 4'], cooldown: ['慢走 3 分钟', '全身静态拉伸 5 分钟'], tips: '心率控制在最大心率 80% 左右，不适即降档。' },
    { name: '下肢力量日', focus: '腿臀 · 力量', level: '进阶', warmup: ['自重深蹲 15 次', '侧向跨步 每侧 10 次'], main: ['保加利亚分腿蹲 每侧 10 次 × 3 组', '罗马尼亚硬拉 12 次 × 3 组', '臀桥单腿 每侧 12 次 × 3 组', '提踵 20 次 × 3 组'], cooldown: ['腘绳肌拉伸 每侧 40 秒', '髂腰肌拉伸 每侧 40 秒'], tips: '膝盖方向与脚尖一致，下蹲不超过舒适范围。' },
    { name: '快走 + 阶梯有氧', focus: '心肺 · 低冲击', level: '入门', warmup: ['慢走 5 分钟'], main: ['快走 5 分钟 × 3 段（中间慢走 1 分钟）', '楼梯上行 5 层 × 3 次（下行乘电梯或慢走）'], cooldown: ['慢走 3 分钟', '小腿拉伸 每侧 40 秒'], tips: '快走时保持每分钟约 110 步，可轻微出汗。' },
    { name: '上肢推拉训练', focus: '胸背肩 · 力量', level: '进阶', warmup: ['手臂绕环 30 秒', '俯卧撑 5 次热身'], main: ['标准俯卧撑 10~15 次 × 4 组', '哑铃/水瓶划船 每侧 12 次 × 3 组', '肩上推举 12 次 × 3 组', '反向撑体 12 次 × 3 组'], cooldown: ['胸部拉伸 40 秒', '肱三头肌拉伸 每侧 30 秒'], tips: '推拉动作交替，避免单一肌群疲劳。' },
    { name: '晨间轻瑜伽', focus: '柔韧 · 呼吸', level: '入门', warmup: ['腹式呼吸 2 分钟'], main: ['拜日式 A 5 轮', '战士一式 每侧 40 秒 × 2', '三角式 每侧 40 秒 × 2', '树式平衡 每侧 30 秒 × 2'], cooldown: ['坐姿前屈 60 秒', '仰卧扭转 每侧 40 秒', '摊尸式 3 分钟'], tips: '动作配合呼吸，不追求幅度只求稳定。' },
    { name: '久坐恢复流程', focus: '髋背 · 康复向', level: '入门', warmup: ['原地行走 3 分钟'], main: ['髋屈肌拉伸 每侧 60 秒 × 2', '梨状肌拉伸 每侧 60 秒 × 2', '胸椎旋转 每侧 10 次 × 3', '臀桥 15 次 × 3 组'], cooldown: ['靠墙静蹲 40 秒 × 2', '深呼吸 10 次'], tips: '每工作 90 分钟做一组，可拆分完成。' },
    { name: '循环耐力训练', focus: '全身 · 耐力', level: '进阶', warmup: ['开合跳 60 秒', '动态热身 2 分钟'], main: ['循环 ×4：深蹲 15 次 → 俯卧撑 10 次 → 弓步 每侧 10 次 → 平板 40 秒 → 休息 60 秒'], cooldown: ['慢走 2 分钟', '全身拉伸 5 分钟'], tips: '全程记录完成时间，下次尝试缩短 30 秒。' },
    { name: '弹力带全身塑形', focus: '全身 · 器械辅助', level: '入门', warmup: ['弹力带绕肩 15 次', '侧向走 每侧 10 步'], main: ['弹力带深蹲 15 次 × 3', '弹力带划船 15 次 × 3', '弹力带肩推 12 次 × 3', '弹力带侧抬腿 每侧 15 次 × 3'], cooldown: ['大腿后侧拉伸 40 秒', '肩部拉伸 30 秒'], tips: '控制回程速度，离心阶段 3 秒。' },
    { name: '午间 30 分钟燃脂走', focus: '心肺 · 户外', level: '入门', warmup: ['慢走 4 分钟'], main: ['快走 20 分钟（可分 4 段，每段中间加 30 秒加速）'], cooldown: ['慢走 4 分钟', '小腿与髋部拉伸 2 分钟'], tips: '饭后 30 分钟再开始，避免正午强晒。' },
    { name: '平衡与协调', focus: '稳定 · 抗跌倒', level: '入门', warmup: ['踝关节绕环 每侧 20 次'], main: ['单腿站立 每侧 45 秒 × 3', '脚跟对脚尖直线走 20 步 × 3', '单腿硬拉（自重）每侧 10 次 × 3', '侧向跨步蹲 每侧 12 次 × 3'], cooldown: ['小腿拉伸 40 秒', '髋外展拉伸 40 秒'], tips: '可扶墙进行，逐步减少支撑。' },
    { name: '背部强化日', focus: '背部 · 体态', level: '进阶', warmup: ['肩胛后缩 20 次', '猫牛式 10 次'], main: ['俯身划船 12 次 × 4', '超人式 15 次 × 3', '面拉（弹力带）15 次 × 3', '死虫式 每侧 10 次 × 3'], cooldown: ['背部滚压 60 秒', '侧腰拉伸 每侧 30 秒'], tips: '每组结束时肩胛主动下沉，避免耸肩代偿。' },
    { name: '低强度恢复日', focus: '恢复 · 主动休息', level: '入门', warmup: ['深呼吸 2 分钟'], main: ['慢走 15 分钟', '全身泡沫轴放松 10 分钟（大腿前后侧、臀部、背部各 2 分钟）'], cooldown: ['静态拉伸 5 分钟'], tips: '训练日之间安排一次，帮助超量恢复。' },
    { name: '爆发力入门', focus: '爆发 · 神经激活', level: '进阶', warmup: ['开合跳 60 秒', '原地小跳 30 秒'], main: ['原地纵跳 8 次 × 4 组', '深蹲跳 8 次 × 4 组', '跨步跳 每侧 8 次 × 3 组', '快速踏板 20 秒 × 4'], cooldown: ['慢走 3 分钟', '腿部拉伸 4 分钟'], tips: '关注落地缓冲，膝盖微屈不锁死。' },
    { name: '腹部塑形循环', focus: '腹部 · 塑形', level: '进阶', warmup: ['卷腹准备动作 10 次'], main: ['卷腹 20 次 × 3', '反向卷腹 15 次 × 3', '自行车卷腹 每侧 15 次 × 3', '平板支撑 60 秒 × 3'], cooldown: ['眼镜蛇式 30 秒 × 2', '侧腰拉伸 每侧 30 秒'], tips: '呼气发力，避免颈部用力拉扯。' },
    { name: '居家无器械全身', focus: '全身 · 零器械', level: '入门', warmup: ['原地踏步 3 分钟', '手臂绕环 30 秒'], main: ['深蹲 20 次 × 3', '俯卧撑（可跪姿）12 次 × 3', '弓步 每侧 12 次 × 3', '平板支撑 40 秒 × 3', '臀桥 20 次 × 3'], cooldown: ['全身拉伸 5 分钟'], tips: '适合出差酒店，无需任何器材。' },
    { name: '心肺阶梯挑战', focus: '心肺 · 递增', level: '进阶', warmup: ['慢跑或快走 5 分钟'], main: ['1 分钟中速 + 1 分钟快速 × 8 轮（跑步机 / 单车 / 椭圆机均可）'], cooldown: ['慢速 4 分钟', '腿部拉伸 3 分钟'], tips: '快速段应达到说话困难的程度。' },
    { name: '柔韧性专项', focus: '柔韧 · 关节活动度', level: '入门', warmup: ['关节绕环全套 3 分钟'], main: ['前后分腿拉伸 每侧 60 秒 × 2', '髋外旋拉伸 每侧 60 秒 × 2', '胸椎伸展 60 秒 × 3', '肩部环转拉伸 每侧 45 秒 × 2'], cooldown: ['放松呼吸 3 分钟'], tips: '拉伸至轻微紧绷即可，不追求疼痛感。' },
    { name: '睡前放松流程', focus: '放松 · 助眠', level: '入门', warmup: ['腹式呼吸 3 分钟'], main: ['仰卧束角式 2 分钟', '仰卧脊柱扭转 每侧 90 秒', '靠墙倒箭式 5 分钟', '婴儿式 2 分钟'], cooldown: ['4-7-8 呼吸法 8 轮'], tips: '睡前 1 小时进行，全程调暗灯光不看手机。' }
  ],

  /* ---------- 自媒体选题库（三大赛道） ---------- */
  topics: {
    psychology: [  // 赛道标签：职场成长
      { t: '汇报工作的黄金结构：结论、依据、下一步', dir: '给出 60 秒汇报模板与常见错误对照', aud: '职场新人与中层', form: '短视频 60 秒' },
      { t: '如何优雅拒绝同事的临时请求', dir: '三句式拒绝法：肯定 + 现状 + 替代方案', aud: '全职场人群', form: '短视频 · 情景演绎' },
      { t: '试用期如何快速建立专业形象', dir: '前 30 天四件事：搞清标准、找对信息源、交付小成果、主动同步', aud: '应届生与跳槽者', form: '图文清单' },
      { t: '被领导批评后的高情商三步回应', dir: '接住情绪、确认标准、给出改进承诺', aud: '职场新人', form: '短视频 45 秒' },
      { t: '35 岁危机的真相：能力结构而非年龄', dir: '从执行力到判断力到组织力的跃迁路径', aud: '30+ 职场人', form: '深度图文' },
      { t: '写周报的三种段位，你在第几层', dir: '流水账 / 有结果 / 有洞察，各给示例', aud: '全职场人群', form: '图文对比帖' },
      { t: '跨部门协作推不动？先解决三个前提', dir: '共同目标、明确接口人、可见的收益分配', aud: '中层管理者', form: '短视频 60 秒' },
      { t: '面试中最容易失分的五个回答', dir: '逐个给出错误版本与优化版本', aud: '求职人群', form: '短视频 90 秒' },
      { t: '如何在会议上有效发言', dir: '一句结论 + 一个依据 + 一个建议的三段式', aud: '职场新人', form: '短视频 45 秒' },
      { t: '简历中最该被优化的一行：成果量化', dir: '用动作 + 指标 + 结果重写三条经历', aud: '求职人群', form: '图文示例帖' },
      { t: '向上管理不是拍马屁，是信息同步', dir: '三种同步节奏：日常、里程碑、风险预警', aud: '中层与骨干', form: '深度图文' },
      { t: '职场中如何建立个人品牌', dir: '专业标签 + 可见成果 + 稳定输出三步法', aud: '3-10 年职场人', form: '图文干货' },
      { t: '要不要跳槽？用这四个维度打分', dir: '成长性、稳定性、报酬、健康度，附评分表', aud: '纠结跳槽人群', form: '互动型图文' },
      { t: '如何提离职最体面', dir: '时机、话术、交接三要素与雷区提醒', aud: '离职人群', form: '短视频 60 秒' },
      { t: '带团队的第一课：把标准说清楚', dir: '交付物、时间点、质量标准三件套', aud: '新任管理者', form: '短视频 60 秒' },
      { t: '职场沟通中的“翻译能力”', dir: '把技术语言翻译成业务价值，附对照示例', aud: '技术与专业岗位', form: '图文干货' },
      { t: '如何处理办公室里的负能量同事', dir: '边界设置、话题转移、必要时的距离管理', aud: '全职场人群', form: '短视频 45 秒' },
      { t: '副业选择的三个筛子', dir: '可复用技能、时间弹性、合规风险', aud: '想做副业的上班族', form: '深度图文' },
      { t: '涨薪谈判前必须准备的三份材料', dir: '成果清单、市场薪酬数据、未来贡献计划', aud: '有加薪需求人群', form: '图文清单' },
      { t: '职场新人最贵的错误：闷头做事不同步', dir: '用三次同步点降低返工率，附节奏建议', aud: '应届生', form: '短视频 60 秒' },
      { t: '如何写一封让人愿意回复的邮件', dir: '主题写结论、首句写请求、正文三条要点', aud: '全职场人群', form: '图文模板' },
      { t: '被安排“不属于我的活”，怎么办', dir: '判断成长性与机会成本，给出三种应对策略', aud: '职场骨干', form: '深度图文' },
      { t: '把复盘变成能力：四问复盘法', dir: '目标是什么、结果如何、差异原因、下次怎么做', aud: '全职场人群', form: '短视频 60 秒' },
      { t: '远程办公如何保持存在感', dir: '主动同步、结果可视化、定期一对一', aud: '远程与混合办公人群', form: '图文干货' }
    ],
    parenting: [  // 赛道标签：副业变现
      { t: '普通人副业第一课：先算清你的时间单价', dir: '用主业时薪对比副业收益，区分卖时间与卖产品', aud: '想搞副业的上班族', form: '短视频 60 秒' },
      { t: '副业选择的三个筛子：技能、时间、合规', dir: '可复用技能、时间弹性、不踩红线，三过才值得做', aud: '纠结副业方向的人', form: '深度图文' },
      { t: '没特长没资源，副业从信息差开始', dir: '用你已知、别人未知的信息做撮合与整理', aud: '零基础新手', form: '短视频 60 秒' },
      { t: '短视频副业冷启动：前 30 条别想涨粉', dir: '把冷启动当成免费训练营，先练表达与选题', aud: '想做自媒体的人', form: '短视频 90 秒' },
      { t: '小红书副业怎么起步：选赛道比努力重要', dir: '从人群痛点切入，而非从自己兴趣盲选', aud: '女性副业创作者', form: '图文干货' },
      { t: '闲鱼无货源还能做吗：实操复盘', dir: '讲清选品、定价、售后的真实链路与风险', aud: '想做电商副业的人', form: '深度图文' },
      { t: '把主业技能卖出去：咨询、陪跑、代运营三选一', dir: '用既有专业能力做轻交付，降低启动门槛', aud: '有职场技能的人', form: '短视频 60 秒' },
      { t: '副业引流不靠投流：内容即流量', dir: '用持续垂直内容吸引精准用户，省下广告费', aud: '副业初期没预算的人', form: '图文干货' },
      { t: '私域变现的底层逻辑：信任先于交易', dir: '先提供价值建立专业感，再轻量推荐', aud: '做社群与朋友圈的人', form: '短视频 60 秒' },
      { t: '知识付费怎么做不烂尾：最小闭环验证', dir: '从 9.9 短训跑通交付，再迭代大课', aud: '想做课的人', form: '深度图文' },
      { t: '副业定价的三个坑：太低、太高、不定价', dir: '按解决的问题定价，先报区间再谈', aud: '怕报价的人', form: '短视频 45 秒' },
      { t: '如何从 0 做一门小课：选题到上线七步', dir: '选题、大纲、录制、封装、上架、发售、交付', aud: '知识创作者', form: '图文清单' },
      { t: '副业停更了？用习惯堆叠接回来', dir: '把副业动作绑定既有习惯，降低重启成本', aud: '断更过的人', form: '短视频 45 秒' },
      { t: '朋友圈也能变现：别只当广告位', dir: '用真实故事与专业洞察建立信任再转化', aud: '有私域的人', form: '图文短帖' },
      { t: '代运营副业怎么报价不被白嫖', dir: '用里程碑付款与范围清单保护自己的时间', aud: '接单自由职业者', form: '短视频 60 秒' },
      { t: '副业收入过万前，先搞懂四种变现模型', dir: '广告、带货、知识、服务，各自适合谁', aud: '选模型迷茫的人', form: '深度图文' },
      { t: '自媒体副业的 1000 个铁粉理论怎么落地', dir: '深耕垂直人群，用深度替代广度的涨粉', aud: '内容创作者', form: '短视频 60 秒' },
      { t: '副业踩坑实录：那些交过的智商税', dir: '盘点常见割韭菜套路，附识别方法', aud: '副业新手', form: '短视频 90 秒' },
      { t: '宝妈副业怎么选：碎片化时间三方向', dir: '从带娃场景延伸出可远程交付的小生意', aud: '宝妈群体', form: '图文清单' },
      { t: '副业要不要注册公司或个体户：合规避雷', dir: '讲清税务与资质的边界，避免被罚', aud: '准备规模化的人', form: '深度图文' },
      { t: '用 AI 提效副业：三个真实省时场景', dir: '选题、文案、剪辑中的 AI 辅助实操', aud: '想省力的人', form: '短视频 60 秒' },
      { t: '副业复盘模板：每周 10 分钟看真实数据', dir: '看转化率而非虚荣指标，指导下一步', aud: '做了没起色的人', form: '图文 + 模板' },
      { t: '从副业到第二曲线：什么时候该 All in', dir: '用收入占比与可复制性判断加码时机', aud: '副业有起色的人', form: '深度图文' },
      { t: '副业赚到的第一笔钱该怎么再投入', dir: '把利润滚回内容、工具与学习，而非全消费', aud: '刚有收入的人', form: '短视频 45 秒' }
    ],
    career: [  // 赛道标签：个人提升
      { t: '为什么越焦虑越拖延？大脑的自我保护机制', dir: '用杏仁核与前额叶的博弈解释拖延，给出 5 分钟启动法', aud: '被拖延困扰的职场人与学生', form: '短视频 60 秒 / 图文长文' },
      { t: '情绪内耗的三种典型模式，你是哪一种', dir: '反刍思维 / 过度共情 / 完美主义，各配一个生活场景与破解句式', aud: '25-40 岁高敏感人群', form: '短视频 · 场景演绎' },
      { t: '你不是懒，是能量分配出了问题', dir: '重新定义懒惰，从睡眠、血糖、心理负债三个维度分析', aud: '长期疲惫的上班族', form: '图文干货帖' },
      { t: '如何用微习惯撬动大改变：从 2 分钟开始', dir: '把目标缩到小到不可能失败，先建立坚持的惯性再慢慢加量', aud: '总是三分钟热度的人', form: '短视频 60 秒' },
      { t: '为什么道理都懂，就是做不到', dir: '知识与行为之间的三道墙：情绪、环境、身份认同', aud: '自我提升爱好者', form: '短视频 90 秒' },
      { t: '讨好型人格的自救指南', dir: '从边界感、拒绝话术、内在信念三层展开，附可直接用的话术', aud: '不敢拒绝别人的人群', form: '图文清单' },
      { t: '三分钟自测：你的压力已经到达哪个等级', dir: '设计轻量自测题，给出对应的干预建议', aud: '泛用户 · 高传播', form: '互动型短视频' },
      { t: '为什么童年经历会影响成年后的决策', dir: '用具体行为例子讲内在小孩与自动化反应', aud: '关注原生家庭话题的人群', form: '深度图文' },
      { t: '睡前反复回想尴尬瞬间，怎么停下来', dir: '解释反刍思维，给出“命名-延迟-替代”三步法', aud: '年轻高敏人群', form: '短视频 45 秒' },
      { t: '真正的高情商，不是会说话而是会停顿', dir: '拆解 3 个停顿使用场景，附真实对话示例', aud: '职场沟通提升人群', form: '短视频 · 情景剧' },
      { t: '心理学看“报复性熬夜”：被剥夺感的补偿', dir: '解释自主感缺失，给出白天补偿方案', aud: '熬夜党年轻人', form: '图文 + 短视频双发' },
      { t: '如何用“课题分离”减少人际内耗', dir: '阿德勒心理学的落地版本，三个判断句式', aud: '人际关系困扰者', form: '短视频 60 秒' },
      { t: '被否定后如何快速修复自信', dir: '证据法：列出三条客观事实对抗自动化负面评价', aud: '职场新人', form: '图文短帖' },
      { t: '为什么你总在深夜做出错误决定', dir: '决策疲劳与自控资源耗竭，给出重要决策时间表', aud: '管理者与创业者', form: '短视频 60 秒' },
      { t: '同理心过载：助人者的心理耗竭', dir: '识别信号与三条自我保护边界', aud: '教师、医护、HR、咨询师', form: '深度图文' },
      { t: '安慰人时最不该说的五句话', dir: '逐句解释为什么无效，并给出替代表达', aud: '泛人群 · 高转发', form: '短视频 · 对比演绎' },
      { t: '习惯养成的 21 天说法是错的', dir: '引用真实研究区间，给出行为设计四要素', aud: '自律爱好者', form: '图文干货' },
      { t: '如何识别情绪操控（PUA）的早期信号', dir: '列出 6 个信号与应对话术，强调求助渠道', aud: '年轻女性与职场新人', form: '短视频 90 秒' },
      { t: '越自省越痛苦？区分反思与反刍', dir: '给出两者的判断标准与转换提问方式', aud: '自我成长人群', form: '图文长文' },
      { t: '心理学中的“峰终定律”如何用在生活里', dir: '结尾体验决定整体记忆，应用于旅行、会议、育儿', aud: '泛职场人群', form: '短视频 60 秒' },
      { t: '为什么你总在舒适区打转：成长型思维落地法', dir: '用“暂时不行”替代“我不行”，附三个日常转化句式', aud: '想突破瓶颈的人', form: '短视频 60 秒' },
      { t: '孤独感的三种类型与对应解法', dir: '情感孤独 / 社交孤独 / 存在孤独，各给一个行动', aud: '独居青年', form: '深度图文' },
      { t: '如何在冲突中保持理性：暂停 20 分钟法则', dir: '生理唤醒需要时间平复，给出撤离话术', aud: '伴侣与团队管理者', form: '短视频 45 秒' },
      { t: '把焦虑写下来，为什么真的有效', dir: '表达性写作研究，给出 10 分钟模板', aud: '焦虑人群', form: '图文 + 模板下载' }
    ]
  },

  /* ---------- 抖音热点荐书（按日轮换，可联网刷新实时热点） ---------- */
  /* 每个热点话题关联 2 本契合主题的书籍，带推荐理由，支持一键加入书库 */
  douyinHot: [
    { t: '35岁职场危机怎么破', tag: '职场', heat: '986.2万', desc: '中年转型、技能重塑与再定位成为全民焦虑焦点',
      books: [
        { book: '逆熵', author: '何圣君', why: '从熵增视角拆解个人成长，给“被时代甩下”的焦虑一个行动框架' },
        { book: '你的生命有什么可能', author: '古典', why: '帮你重新定义职业与人生选项，走出“只能一条路”的困局' }
      ] },
    { t: '普通人的副业刚需怎么搞钱', tag: '副业', heat: '874.5万', desc: '工资之外找第二曲线，低风险试错成热门议题',
      books: [
        { book: '纳瓦尔宝典', author: '埃里克·乔根森', why: '讲透“杠杆+专长”的致富逻辑，副业从卖时间转向卖产品' },
        { book: '小狗钱钱', author: '博多·舍费尔', why: '用童话讲清复利与现金流，副业起步的理财启蒙第一本' }
      ] },
    { t: '情绪内耗自救指南', tag: '心理', heat: '1120.8万', desc: '内卷时代，情绪价值与自我和解刷屏',
      books: [
        { book: '被讨厌的勇气', author: '岸见一郎 / 古贺史健', why: '课题分离与自我接纳，直接拆解“在意别人眼光”的内耗' },
        { book: '蛤蟆先生去看心理医生', author: '罗伯特·戴博德', why: '用故事讲清童年模式如何影响成年情绪，温和又戳心' }
      ] },
    { t: '多巴胺穿搭与生活美学', tag: '生活方式', heat: '653.1万', desc: '从“悦己”到“断舍离”，审美成为表达',
      books: [
        { book: '断舍离', author: '山下英子', why: '整理物品也是整理人生，和多巴胺消费的冲动正相反' },
        { book: '怦然心动的人生整理魔法', author: '近藤麻理惠', why: '“只留下让你心动的”，建立属于自己的审美秩序' }
      ] },
    { t: 'City Walk 与慢生活回归', tag: '生活', heat: '541.7万', desc: '拒绝特种兵式旅游，城市漫步治愈年轻人',
      books: [
        { book: '瓦尔登湖', author: '亨利·戴维·梭罗', why: '极简与自然主义的源头，慢生活的精神底色' },
        { book: '人间值得', author: '中村恒子', why: '90岁心理医生的生活哲学，治愈“必须奔跑”的焦虑' }
      ] },
    { t: '考研考公备考上岸', tag: '成长', heat: '798.3万', desc: '卷学历还是卷编制，备考方法论持续爆火',
      books: [
        { book: '认知觉醒', author: '周岭', why: '从脑科学讲清专注与习惯，备考人最该先读的一本' },
        { book: '高效能人士的七个习惯', author: '史蒂芬·柯维', why: '以终为始与时间管理，长期战线的底层方法论' }
      ] },
    { t: '亲子教育不再内卷', tag: '育儿', heat: '912.4万', desc: '拒绝鸡娃，科学育儿与亲子关系受追捧',
      books: [
        { book: '正面管教', author: '简·尼尔森', why: '不惩罚不娇纵，给焦虑父母一套可落地的沟通工具' },
        { book: '好妈妈胜过好老师', author: '尹建莉', why: '用真实案例拆解“爱与规矩”的边界，戳破育儿误区' }
      ] },
    { t: 'AI 工具真的能提效吗', tag: '科技', heat: '1342.6万', desc: '人人都在聊大模型，如何用 AI 解放生产力',
      books: [
        { book: 'AI 未来进行式', author: '李开复 / 陈楸帆', why: '20个场景推演 AI 对工作的冲击，提前看清趋势' },
        { book: '这就是 ChatGPT', author: '斯蒂芬·沃尔弗拉姆', why: '通俗讲清大模型原理，避免被“神化或妖魔化”带偏' }
      ] },
    { t: '消费降级也要好好存钱', tag: '理财', heat: '1023.9万', desc: '攒钱、搞钱、反消费主义成理财新共识',
      books: [
        { book: '富爸爸穷爸爸', author: '罗伯特·清崎', why: '资产与负债的启蒙，存钱之前先搞懂钱的逻辑' },
        { book: '好好花钱', author: '郝魅力', why: '把“省钱”变成“花得值”，理性消费实操手册' }
      ] },
    { t: '露营户外热与逃离城市', tag: '生活', heat: '487.2万', desc: '周末露营、徒步成新社交，户外内容爆发',
      books: [
        { book: '山中最后一季', author: '埃里克·布雷姆', why: '一位山野巡护员的故事，唤醒对自然的渴望' },
        { book: '走！去野营', author: '石丸元章', why: '从装备到营地选择，新手友好的实用露营百科' }
      ] },
    { t: '国潮文化自信崛起', tag: '人文', heat: '612.5万', desc: '中式美学、非遗与历史成年轻人新宠',
      books: [
        { book: '美的历程', author: '李泽厚', why: '一眼看尽中国数千年审美流变，国潮的内容底稿' },
        { book: '中国历代政治得失', author: '钱穆', why: '读懂制度与文化脉络，理解“何以中国”' }
      ] },
    { t: '自律与早起真的有用吗', tag: '成长', heat: '729.8万', desc: '习惯养成、精力管理类内容长盛不衰',
      books: [
        { book: '微习惯', author: '斯蒂芬·盖斯', why: '用“小到不可能失败”的动作对抗拖延，自律入门首选' },
        { book: '四点起床', author: '中岛孝志', why: '时间块管理思路，给想抢回清晨的人一个理由' }
      ] },
    { t: '社恐与人际关系的边界', tag: '心理', heat: '854.0万', desc: '非暴力沟通、拒绝内耗成社交刚需',
      books: [
        { book: '非暴力沟通', author: '马歇尔·卢森堡', why: '观察-感受-需要-请求，四步化解关系冲突' },
        { book: '人性的弱点', author: '戴尔·卡耐基', why: '经典人际读本，社恐也能学会舒服地表达' }
      ] },
    { t: '年轻人开始朋克养生', tag: '健康', heat: '698.7万', desc: '熬夜泡脚、轻断食、早睡打卡成风',
      books: [
        { book: '你是你吃出来的', author: '夏萌', why: '从饮食结构讲慢病预防，养生别只靠补品' },
        { book: '睡眠革命', author: '尼克·利特尔黑尔斯', why: 'R90 睡眠法，比“早睡早起”更科学的精力管理' }
      ] },
    { t: '读书博主带火的经典', tag: '阅读', heat: '576.3万', desc: '短视频讲书让经典文学重新翻红',
      books: [
        { book: '活着', author: '余华', why: '苦难与坚韧的极致书写，几乎每个书单都绕不开' },
        { book: '百年孤独', author: '加西亚·马尔克斯', why: '魔幻现实主义的巅峰，读一遍够吹一年' }
      ] },
    { t: '高情商沟通表达', tag: '职场', heat: '943.1万', desc: '汇报、谈判、拒绝的艺术被反复刷屏',
      books: [
        { book: '关键对话', author: '科里·帕特森', why: '高风险对话不翻车，职场表达的核心能力' },
        { book: '沟通的艺术', author: '罗纳德·阿德勒', why: '看入人里、看出人外，沟通的系统教科书' }
      ] },
    { t: '女性独立与自我成长', tag: '成长', heat: '881.6万', desc: '女性力量、经济与精神独立成强话题',
      books: [
        { book: '向前一步', author: '谢丽尔·桑德伯格', why: '鼓励女性坐到桌前，职场与家庭的真实博弈' },
        { book: '第二性', author: '西蒙娜·德·波伏瓦', why: '“女人不是天生的，而是被塑造的”，独立的思想基石' }
      ] },
    { t: '极简生活做减法', tag: '生活', heat: '432.9万', desc: '少买、少烦、专注重要的事成新潮流',
      books: [
        { book: '极简主义', author: '乔舒亚·菲尔茨·米尔本', why: '用“少”换回时间与自由，极简的生活宣言' },
        { book: '少即是多', author: '本田直之', why: '从物质转向体验，幸福的新杠杆' }
      ] }
  ]
};
