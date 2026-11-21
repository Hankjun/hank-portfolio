import {modelDiagram} from './model-diagrams.mjs';
const models = [
  {
    id: 'canvas',
    zh: ['商业模式画布', '从九个相互关联的模块，梳理企业如何创造、交付和获取价值。', '成熟企业梳理整体商业架构', '九大模块', ['客户细分', '价值主张', '渠道通路', '客户关系', '收入来源', '核心资源', '关键业务', '重要伙伴', '成本结构']],
    en: ['Business Model Canvas', 'Map how a business creates, delivers and captures value across nine connected blocks.', 'Reviewing the overall business architecture of an established company', 'Nine building blocks', ['Customer segments', 'Value propositions', 'Channels', 'Customer relationships', 'Revenue streams', 'Key resources', 'Key activities', 'Key partnerships', 'Cost structure']]
  },
  {
    id: 'lean',
    zh: ['精益画布', '从客户痛点出发，找出风险最高的假设，用小规模实验逐轮验证。', '初创团队、新产品从 0 到 1 的试错', '九大模块', ['问题', '客户细分', '独特价值主张', '解决方案', '渠道', '收入来源', '成本结构', '关键指标', '难以复制的优势']],
    en: ['Lean Canvas', 'Start with a customer problem and test the riskiest assumptions in small experiments.', 'Startup teams and early product validation', 'Nine building blocks', ['Problem', 'Customer segments', 'Unique value proposition', 'Solution', 'Channels', 'Revenue streams', 'Cost structure', 'Key metrics', 'Unfair advantage']]
  },
  {
    id: 'weizhu',
    zh: ['魏朱六要素', '围绕利益相关者的交易结构，厘清谁投入资源、谁获得收益，以及现金如何流动。', '平台模式、多方资源整合与跨界合作', '六大要素', ['定位', '业务系统', '关键资源能力', '盈利模式', '自由现金流结构', '企业价值']],
    en: ['Wei–Zhu Six Elements', 'Examine stakeholder transactions to see who contributes resources, who earns returns and how cash flows.', 'Platforms, multi-party resource integration and cross-industry partnerships', 'Six elements', ['Positioning', 'Business system', 'Key resources and capabilities', 'Profit model', 'Free cash flow structure', 'Enterprise value']]
  },
  {
    id: 'flywheel',
    zh: ['飞轮模型', '找出相互强化的增长因子，检验最后一步能否反过来增强第一步。', '互联网平台、依靠规模效应和复利实现增长的业务', '增长闭环示例', ['更多买家', '吸引更多卖家', '商品选择更丰富', '购买体验改善', '吸引更多买家']],
    en: ['Flywheel Model', 'Identify reinforcing growth drivers and check how the final step strengthens the first.', 'Online platforms and businesses seeking scale effects and compounding growth', 'Example growth loop', ['More buyers', 'More sellers join', 'Wider selection', 'Better buying experience', 'More buyers join']]
  },
  {
    id: 'valuechain',
    zh: ['波特价值链', '沿着企业内部活动追踪成本与客户价值，找出形成竞争优势的环节。', '制造业、供应链优化与降本增效', '基本活动', ['内部物流', '生产运营', '外部物流', '市场营销与销售', '服务'], '辅助活动', ['企业基础设施', '人力资源管理', '技术开发', '采购']],
    en: ['Porter’s Value Chain', 'Trace costs and customer value through internal activities to locate sources of competitive advantage.', 'Manufacturing, supply chain optimization and cost reduction', 'Primary activities', ['Inbound logistics', 'Operations', 'Outbound logistics', 'Marketing and sales', 'Service'], 'Support activities', ['Firm infrastructure', 'Human resource management', 'Technology development', 'Procurement']]
  }
];

export function modelWorkbench(c, map) {
  const zh = c.lang === 'zh';
  const choices = [['map', c.t('hero.map')], ...models.map(m => [m.id, m[c.lang][0]])];
  const panels = models.map(m => {
    const [name, perspective, scenario] = m[c.lang];
    return `<article class="model-panel" data-model="${m.id}" id="panel-${m.id}"><h3>${name}</h3><p class="model-view">${perspective}</p>${modelDiagram(m.id,c.lang,m[c.lang])}<p class="model-scenario"><strong>${zh?'适用场景':'Best suited for'}</strong> ${scenario}</p></article>`;
  }).join('');
  return `<section class="hero-workbench" id="workbench" aria-labelledby="workbench-title" tabindex="-1"><div class="workbench-heading"><h2 id="workbench-title">${zh?'业务分析模型':'Business Analysis Models'}</h2></div>
    <fieldset class="model-picker"><legend class="sr-only">${zh?'切换模型':'Choose a model'}</legend>${choices.map(([id,title],i)=>`<label><input type="radio" name="business-model" value="${id}" aria-controls="panel-${id}"${i===0?' checked':''}><span>${title}</span></label>`).join('')}</fieldset>
    <div class="model-panel" data-model="map" id="panel-map"><h3>${c.t('hero.map')}</h3>${map}</div>${panels}</section>`;
}
