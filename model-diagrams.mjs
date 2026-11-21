// The eight-domain map and the six-element model share a hub-and-spoke layout.
const positions = [[1,1],[2,1],[3,1],[3,2],[3,3],[2,3],[1,3],[1,2]];
function hub(nodes, slots, center, label) {
  const spokes = slots.map(i => {
    const [x,y] = positions[i];
    return `<line x1="3" y1="3" x2="${2*x-1}" y2="${2*y-1}"/>`;
  }).join('');
  const cells = slots.map((slot,i) => {
    const [x,y] = positions[slot];
    return `<div class="hub-cell" style="grid-area:${y}/${x}">${nodes[i]}</div>`;
  }).join('');
  return `<div class="model-drawing hub-drawing" role="group" aria-label="${label}">
    <svg class="hub-wires" viewBox="0 0 6 6" preserveAspectRatio="none" aria-hidden="true">${spokes}</svg>
    <strong class="hub-center">${center}</strong>${cells}</div>`;
}

export function domainDiagram(c, domains) {
  const nodes = domains.map((id,i) => `<label class="domain-choice"><input type="radio" name="hero-scenario" value="${id}" aria-controls="detail-${id}" ${i===0?'checked':''}><span><b>${c.t('hero.'+id+'.tab')}</b><small>${c.t('hero.'+id+'.tags')}</small></span></label>`);
  return `<fieldset class="diagram-field"><legend>${c.t('hero.choose')}</legend>${hub(nodes,[0,1,2,3,4,5,6,7],c.lang==='zh'?'业务系统':'Business system',c.t('hero.map'))}</fieldset>`;
}

const canvasLayouts = {
  canvas: {
    order: [7,6,1,3,0,5,2,8,4],
    zh: ['谁与我们合作？','必须做好哪些事？','客户为什么选择我们？','如何维系客户？','为谁创造价值？','需要哪些资源？','如何触达客户？','主要成本来自哪里？','客户为什么付费？'],
    en: ['Who are our partners?','What must we do well?','Why do customers choose us?','How do we retain customers?','Whom do we serve?','What assets do we need?','How do we reach customers?','What drives our costs?','What do customers pay for?']
  },
  lean: {
    order: [0,3,2,8,1,7,4,6,5],
    zh: ['要解决什么痛点？','先验证哪个方案？','为什么值得尝试？','什么优势难被复制？','谁最早会采用？','用什么衡量进展？','从哪里找到用户？','验证和交付要花多少？','用户如何付费？'],
    en: ['What hurts today?','What do we test first?','Why try this offering?','What is hard to copy?','Who adopts first?','How do we track progress?','Where can we reach users?','What will testing and delivery cost?','How will users pay?']
  }
};
function canvas(id,lang,items) {
  const layout = canvasLayouts[id];
  const areas = ['left','upper','center','rightTop','right','lower','rightBottom','cost','revenue'];
  return `<div class="canvas-scroll" tabindex="0" role="group" aria-label="${lang==='zh'?'九模块画布':'Nine-block canvas'}"><div class="model-drawing canvas-drawing">${layout.order.map((item,i)=>`<div class="canvas-cell" style="grid-area:${areas[i]}"><b>${items[item]}</b><small>${layout[lang][i]}</small></div>`).join('')}</div></div>`;
}

function flywheel(items,zh) {
  const paths = ['M50 12 A39 38 0 0 1 77.58 23.13','M89 50 A39 38 0 0 1 77.58 76.87','M50 88 A39 38 0 0 1 22.42 76.87','M11 50 A39 38 0 0 1 22.42 23.13'];
  return `<div class="model-drawing wheel-drawing" role="group" aria-label="${zh?'平台增长闭环示例':'Platform growth loop example'}">
    <svg viewBox="0 0 100 100" preserveAspectRatio="none" aria-hidden="true"><defs><marker id="wheel-arrow" viewBox="0 0 8 8" refX="6" refY="4" markerWidth="4" markerHeight="4" orient="auto"><path d="M0 0L8 4L0 8Z"/></marker></defs><ellipse cx="50" cy="50" rx="39" ry="38"/>${paths.map(d=>`<path class="wheel-direction" d="${d}" marker-end="url(#wheel-arrow)"/>`).join('')}</svg>
    <strong class="wheel-core">${zh?'增长闭环':'Growth loop'}</strong>${items.slice(0,4).map((item,i)=>`<b class="wheel-node wheel-${i}">${item}</b>`).join('')}</div>`;
}

function valueChain(row,zh) {
  const [, , ,primary,activities,support,enablers] = row;
  return `<div class="model-drawing chain-drawing"><div class="chain-body"><h4>${support}</h4><div class="chain-support">${enablers.map(x=>`<span>${x}</span>`).join('')}</div><h4>${primary}</h4><ol class="chain-flow">${activities.map(x=>`<li>${x}</li>`).join('')}</ol></div><strong class="chain-margin">${zh?'利润':'Margin'}</strong></div>`;
}

export function modelDiagram(id,lang,row) {
  const zh = lang==='zh';
  if (id in canvasLayouts) return canvas(id,lang,row[4]);
  if (id==='weizhu') return hub(row[4].map(x=>`<b class="element-node">${x}</b>`),[1,2,4,5,6,0],zh?'利益相关者交易结构':'Stakeholder transactions',row[0]);
  if (id==='flywheel') return flywheel(row[4],zh);
  return valueChain(row,zh);
}
