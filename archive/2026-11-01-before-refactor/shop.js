(async function(){
  'use strict';
  const icon=window.hankIcon;
  // Training uses confirmed per-person tuition. Legacy goods remain display-only concepts.
  const products=await (async()=>{
    try{
      const res=await fetch(new URL('shop-skus.json',document.baseURI),{cache:'no-cache'});
      if(!res.ok)throw new Error('SKU HTTP '+res.status);
      const data=await res.json();
      const categories={'资料包':'DAT','技能包':'KIT','工作流':'FLW','知识库':'KNB','付费专栏':'SER','智能体培训':'TRN','定制服务':'SVC','研究工具':'RES'};
      const themes=['ember','ink','ochre','sage','linen','wine','night','blue'];
      const fields=['id','sku','category','name','en','coverCN','desc','audience','format','scope','version','edition','status','delivery'];
      if(!Array.isArray(data)||!data.length||data.some(p=>!p||
        fields.some(k=>typeof p[k]!=='string'||!p[k].trim())||
        !categories[p.category]||!new RegExp('^HKS-'+categories[p.category]+'-[0-9]{3}$').test(p.sku)||
        !themes.includes(p.theme)||typeof p.listed!=='boolean'||
        (p.category==='定制服务'?p.price!==null:!Number.isFinite(p.price)||p.price<0)||!Array.isArray(p.contents)||!p.contents.length||
        (p.category==='智能体培训'&&(p.sessions!==4||p.sessionPrice!==299||p.price!==1200||p.contents.length!==4))||
        (p.category==='定制服务'&&(!['inputs','acceptance'].every(k=>Array.isArray(p[k])&&p[k].length&&p[k].every(x=>typeof x==='string'&&x.trim()))||!p.caseStudy||!['title','summary','status'].every(k=>typeof p.caseStudy[k]==='string'&&p.caseStudy[k].trim())))||
        (p.category==='研究工具'&&(p.price!==0||!/^downloads\/[a-z0-9-]+\.zip$/.test(p.downloadUrl)||!/^work16\/[a-z0-9-]+\.html$/.test(p.previewUrl)))||
        p.contents.some(x=>typeof x!=='string'||!x.trim())||p.paymentUrl!==null)||
        new Set(data.map(p=>p.id)).size!==data.length||new Set(data.map(p=>p.sku)).size!==data.length)
        throw new Error('Invalid SKU catalog');
      return data.filter(p=>p.listed);
    }catch(e){
      console.error('SKU catalog load error:',e);
      const el=document.querySelector('#shopGrid');
      if(el)el.innerHTML='<p class="shop-load-error" role="status">商品目录暂时未能载入，请联网后刷新页面。</p>';
      return [];
    }
  })();
    // Source of truth: shop-skus.json; payment is deliberately disabled.
  const $=(sel,root=document)=>root.querySelector(sel), $$=(sel,root=document)=>Array.from(root.querySelectorAll(sel));
  if(!products.length)return;
  $('[data-kind="全部"]').textContent='全部商品（'+products.length+'）';
  $$('.shop-filter:not([data-kind="全部"])').forEach(el=>{const count=products.filter(p=>p.category===el.dataset.kind).length;el.textContent=el.dataset.kind+'（'+count+'）';});
  $('.shop-after .shop-index').textContent='SHELF 01 / 2026 · '+products.length+' ITEMS / '+new Set(products.map(p=>p.category)).size+' CATEGORIES';
  let activeKind='定制服务';
  let months=1, group=false;
  const isTraining=p=>p.category==='智能体培训';
  const isService=p=>p.category==='定制服务';
  const isResource=p=>p.category==='研究工具';
  const isLegacy=p=>!isTraining(p)&&!isService(p)&&!isResource(p);
  const rates={1:1,2:0.9,3:0.8};
  let cart=[];
  try{const saved=JSON.parse(localStorage.getItem('hank-shop-interest-v1')||'[]');if(Array.isArray(saved))cart=saved.filter(id=>products.some(p=>p.id===id));}catch(_){}
  cart=[...new Set(cart)];
  try{const saved=JSON.parse(localStorage.getItem('hank-training-plan-v1')||'{}');if([1,2,3].includes(saved.months))months=saved.months;group=saved.group===true;}catch(_){}
  const grid=$('#shopGrid'),detail=$('#shopDetail'),cartDialog=$('#shopCart');
  if(!grid||!detail||!cartDialog)return;
  const money=n=>'¥ '+Number(n).toLocaleString('zh-CN');
  const find=id=>products.find(p=>p.id===id);
  const esc=str=>String(str).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;').replace(/'/g,'&#39;');
  const trainingNote='每人每课时 299 元；每月 4 课时按课程制计价 1,200 元，每周 1 次，配合社群与练习。单个课程板块 4 课时完成基础学习；每课时时长、授课方式和排期预约确认。工具账号与相关费用报名时说明。多人拼课单独报价。';
  function cover(p){return '<span class="shop-cover-face theme-'+p.theme+'">'+
     '<span class="shop-cover-top"><span>HANK / LITTLE SHOP</span><span>© 2026</span></span>'+
     '<span class="shop-cover-central"><span class="shop-cover-illustration" aria-hidden="true"></span>'+
     '<span class="shop-cover-title">'+esc(p.en.replace(' / ','<br>')).replace('&lt;br&gt;','<br>')+'</span>'+
     '<span class="shop-cover-cn">'+esc(p.coverCN)+'</span></span>'+
     '<span class="shop-cover-foot"><span>'+esc(p.edition)+'</span><span>H.</span></span></span>';
  }
  function deliveryLabel(p){return {'资料包':'文件 / 下载链接（计划）','技能包':'模板 / 使用说明（计划）','工作流':'流程文件 / 教程（计划）','知识库':'知识库资料包（计划）','付费专栏':'图文 / 阅读入口（计划）','智能体培训':'每周一课 · 社群练习','定制服务':'范围确认后组织交付','研究工具':'ZIP 下载 / 网页练习工具'}[p.category]||p.delivery;}
  function priceLabel(p){return isService(p)?'咨询报价':isResource(p)?'免费':money(p.price);}
  function priceUnit(p){return isService(p)?'按项目确认':isResource(p)?'公开试用版':isTraining(p)?'每人 / 月':'示意价';}
  function resourceLinks(p){return '<div class="shop-resource-links"><a class="resource-action" href="'+esc(p.downloadUrl)+'" download>下载完整练习包 .zip</a><a class="resource-action" href="'+esc(p.previewUrl)+'">打开练习工具 ↗</a></div>';}
  function card(p){
    const selected=cart.includes(p.id), training=isTraining(p),service=isService(p),resource=isResource(p);
    return '<article class="shop-item" data-category="'+esc(p.category)+'" data-product="'+esc(p.id)+'">'+
      '<button class="shop-item-cover" type="button" data-shop-detail="'+esc(p.id)+'" aria-label="查看 '+esc(p.name)+' 商品详情">'+cover(p)+'</button>'+
      '<div class="shop-item-meta"><div class="shop-item-type"><span>'+esc(p.category)+'</span><span>'+(service?'按范围报价':resource?'直接下载':training?'每人计价':'示例商品')+'</span></div>'+
      '<div class="shop-item-sku">'+esc(p.sku)+'</div><h3 class="shop-item-name">'+esc(p.name)+'</h3><p class="shop-item-desc">'+esc(p.desc)+'</p>'+
      '<dl class="shop-card-spec"><div><dt>'+(training?'课时':'版本')+'</dt><dd>'+esc(training?'4 课时 / 月':p.version.replace(/^\d{4} · /,''))+'</dd></div><div><dt>交付</dt><dd>'+esc(deliveryLabel(p))+'</dd></div><div><dt>状态</dt><dd>'+esc(p.status)+'</dd></div></dl>'+
      '<details class="shop-card-contents"><summary>'+icon('chevron')+(service?'查看交付范围':resource?'查看练习内容':training?'查看 4 课时安排':'拟含 '+p.contents.length+' 项内容')+'</summary><ul>'+p.contents.map(x=>'<li>'+esc(x)+'</li>').join('')+'</ul></details>'+
      (resource?resourceLinks(p):training?trainingPdf(p):'')+
      '<div class="shop-item-bottom"><div class="shop-item-price"><strong>'+priceLabel(p)+'</strong><small>'+priceUnit(p)+'</small></div>'+
      '<div class="shop-item-actions"><button type="button" data-shop-detail="'+esc(p.id)+'" aria-label="查看 '+esc(p.name)+' 详情">'+icon('arrow-ne')+'</button>'+
      '<button type="button" data-shop-add="'+esc(p.id)+'" aria-label="'+(selected?'从选购清单移除 ':'加入选购清单 ')+esc(p.name)+'" aria-pressed="'+selected+'">'+icon(selected?'check':'plus')+'</button></div></div></div></article>';
  }
  function render(){
    grid.dataset.kind=activeKind;
    grid.innerHTML=products.filter(p=>activeKind==='全部'||p.category===activeKind).map(card).join('');
    $('#shopCartCount').textContent=String(cart.length);
  }
  function save(){try{localStorage.setItem('hank-shop-interest-v1',JSON.stringify(cart));localStorage.setItem('hank-training-plan-v1',JSON.stringify({months,group}));}catch(_){}render();if(cartDialog.open)renderCart();}
  function toggle(id){if(!find(id))return;const adding=!cart.includes(id);cart=adding?cart.concat(id):cart.filter(x=>x!==id);if(adding&&isTraining(find(id)))months=Math.max(months,Math.min(3,cart.map(find).filter(isTraining).length));save();}
  function openDialog(dialog){if(typeof dialog.showModal==='function')dialog.showModal();else dialog.setAttribute('open','');}
  function closeDialog(dialog){if(typeof dialog.close==='function')dialog.close();else dialog.removeAttribute('open');}
  function listSection(title,items){return '<h3>'+esc(title)+'</h3><ul>'+items.map(x=>'<li>'+esc(x)+'</li>').join('')+'</ul>';}
  function trainingPdf(p){const u=typeof p.pdfUrl==='string'&&/^courses\/[a-z0-9-]+\.pdf$/.test(p.pdfUrl)?p.pdfUrl:null;return u?'<a class="resource-action" href="'+esc(u)+'" target="_blank" rel="noopener noreferrer">打开课程 PDF ↗</a>':'';}
  function caseSection(c){
    const safeURL=c.url==='#projects'||(typeof c.url==='string'&&c.url.startsWith('https://hankjun.github.io/'));
    return '<section class="shop-case" aria-label="项目案例"><h3>项目案例 / '+esc(c.title)+'</h3><p>'+esc(c.summary)+'</p><small>'+esc(c.status)+'</small>'+(safeURL?'<a class="resource-action" href="'+esc(c.url)+'"'+(c.url.startsWith('https:')?' target="_blank" rel="noopener noreferrer"':'')+'>'+esc(c.linkText||'查看项目')+' ↗</a>':'')+'</section>';
  }
  function showDetail(id){
    const p=find(id);if(!p)return;
    const training=isTraining(p),service=isService(p),resource=isResource(p);
    const specs=[['SKU',p.sku],['类别',p.category],['适用人群',p.audience],[training?'学习安排':'交付形式',p.format],['交付方式',p.delivery],...(training?[['课程层级','入门 / 中阶 / 高阶（按学习目标确认）']]:[]),['版本',p.version],['服务范围',p.scope],['当前状态',p.status]];
    $('#shopDetailContent').innerHTML='<div class="shop-detail-layout"><div><div class="shop-item-cover" aria-hidden="true">'+cover(p)+'</div></div><div class="shop-detail-copy">'+
      '<span class="shop-detail-kicker">'+esc(p.sku)+' / '+esc(p.category)+'</span><h2 class="serif" id="shopDetailTitle">'+esc(p.name)+'</h2><p>'+esc(p.desc)+'</p>'+
      '<dl class="shop-sku-spec">'+specs.map(([label,value])=>'<div><dt>'+esc(label)+'</dt><dd>'+esc(value)+'</dd></div>').join('')+'</dl>'+
      listSection(service?'基础交付范围':resource?'练习包里有什么':training?'4 课时基础学习安排':'拟包含的内容',p.contents)+
      (service?listSection('开始前需要你提供',p.inputs)+listSection('如何验收',p.acceptance)+caseSection(p.caseStudy):'')+
      '<div class="shop-detail-price">'+priceLabel(p)+' <small>'+priceUnit(p)+'</small></div>'+
      (training?'<p>连续学习：2 个月 / 8 课时 ¥ 2,160（九折）；3 个月 / 12 课时 ¥ 2,880（八折）。在咨询清单选择周期。</p>':'')+
      (resource?resourceLinks(p):training?trainingPdf(p):'')+
      '<button class="shop-add-button" type="button" data-shop-add="'+esc(p.id)+'">'+(cart.includes(p.id)?'移出选购清单':'加入我的选购清单')+' '+icon('arrow-ne')+'</button>'+
      (!isLegacy(p)?'<button class="wechat-trigger" type="button" data-wechat-open>'+ (service?'微信沟通这个项目':resource?'微信咨询使用方法':'微信咨询这门课程')+'</button>':'')+
      '<p class="shop-detail-disclaimer">'+(service?'根据需求确认交付物、时间、修改轮次、验收与报价后开始制作。可先复制咨询清单，通过“超级工作站”个人微信沟通。':resource?'公开试用版可以用于个人学习和团队内部讨论。练习数据保存在你的浏览器，可导出为 Markdown；需要定制辅导可微信咨询。':training?esc(trainingNote)+' 咨询清单不会自动提交，报名需另行联系确认。':'此商品为示例，实际文件、交付条件与正式售价待确认。当前未开售，无法付款。')+'</p></div></div>';
    openDialog(detail);
  }
  function quote(){
    const list=cart.map(find).filter(Boolean),training=list.filter(isTraining),goods=list.filter(isLegacy),services=list.filter(isService),resources=list.filter(isResource);
    const custom=group||training.length>months;
    return {list,training,goods,services,resources,custom,tuition:training.length&&!custom?Math.round(1200*months*rates[months]):null,goodsTotal:goods.reduce((sum,p)=>sum+p.price,0)};
  }
  function quoteLines(q){
    const lines=[];
    if(q.training.length)lines.push(group?'培训：多人拼课 · 单独报价':q.custom?'培训：方向超出所选月数 · 待确认方案':'培训：'+money(q.tuition)+' / 人');
    if(q.services.length)lines.push('定制服务：'+q.services.length+' 项 · 咨询报价');
    if(q.resources.length)lines.push('研究工具：'+q.resources.length+' 件 · 免费下载');
    if(q.goods.length)lines.push('示例商品：'+money(q.goodsTotal)+'（示意价，未开售）');
    return lines;
  }
  function planNote(q){
    if(group)return '已选 '+q.training.length+' 个课程方向；多人拼课按人数、课时与安排单独报价，不套用个人套餐。';
    if(q.custom)return '已选 '+q.training.length+' 个课程方向。每个基础板块需 4 课时，超出当前 '+months+' 个月的课时范围，请增加周期、减少方向，或另行沟通学习方案。暂不计算培训总价。';
    return '共 '+months+' 个月 / '+months*4+' 课时，已选 '+q.training.length+' 个课程方向。套餐总课时固定，不按方向数量重复收费；学习顺序及后续练习板块预约确认。'+(months>1?'原价 '+money(months*1200)+'，'+(months===2?'九折':'八折')+'后 '+money(q.tuition)+' / 人。':'');
  }
  function renderCart(){
    const q=quote();
    $('#shopCartItems').innerHTML=q.list.length?q.list.map(p=>'<div class="shop-cart-row">'+
      '<div class="shop-cart-mini" aria-hidden="true">H.</div><div class="shop-cart-row-text"><strong>'+esc(p.name)+'</strong><small>'+esc(p.sku)+' · '+(isTraining(p)?'培训方向 · 基础板块 4 课时':esc(p.category)+' · '+esc(p.status))+'</small></div>'+
      '<span class="shop-cart-row-price">'+(isTraining(p)?'纳入月度方案':isService(p)?'咨询报价':isResource(p)?'免费':money(p.price)+'（示意）')+'</span>'+
      '<button class="shop-cart-remove" type="button" data-shop-remove="'+esc(p.id)+'" aria-label="移除 '+esc(p.name)+'">移除</button></div>').join(''):
      '<p class="shop-cart-empty">先挑选感兴趣的课程或资料，再整理咨询清单。</p>';
    $('#trainingChoice').hidden=!q.training.length;
    $('#trainingMonths').value=String(months);$('#trainingGroup').checked=group;
    $('#trainingPlanNote').textContent=q.training.length?planNote(q):'';
    $('#shopCartTotal').textContent=quoteLines(q).join('\n')||'未选择';
    $('#shopCopyList').disabled=!q.list.length;$('#shopExportList').disabled=!q.list.length;
  }
  function cartText(){
    const q=quote();if(!q.list.length)return null;
    return ['HANK / 汉克小铺 · 咨询清单','（仅供沟通，非订单；不会自动发送）','────────────────────',
      ...q.list.map((p,i)=>(i+1)+'. '+p.sku+' / '+p.name+' / '+(isTraining(p)?'基础板块 4 课时，纳入月度方案':isService(p)?'咨询报价；'+p.scope:isResource(p)?'免费 / '+new URL(p.downloadUrl,document.baseURI).href:money(p.price)+'（示意价，未开售）')),
      ...(q.training.length?['','学习周期意向：'+months+' 个月 / '+months*4+' 课时','报名方式：'+(group?'多人拼课，单独报价':'个人，按人计价'),planNote(q),trainingNote]:[]),
      '────────────────────',...quoteLines(q),'','请添加“超级工作站”个人微信，发送本清单，确认排期、授课方式、每课时时长、工具费用与报名安排。定制服务另行确认范围与报价；研究工具可直接免费下载；原有示例商品仍未开售。'].join('\n');
  }
  function download(txt){
    const blob=new Blob(['\uFEFF'+txt],{type:'text/plain;charset=utf-8'});
    const url=URL.createObjectURL(blob), a=document.createElement('a');
    a.href=url;a.download='HANK-小铺选购意向清单.txt';document.body.appendChild(a);a.click();a.remove();
    setTimeout(()=>URL.revokeObjectURL(url),1500);
  }
  async function copy(txt){
    try{
      if(navigator.clipboard&&window.isSecureContext)await navigator.clipboard.writeText(txt);
      else{const el=document.createElement('textarea');el.value=txt;el.style.position='fixed';el.style.opacity='0';document.body.appendChild(el);el.select();if(!document.execCommand('copy'))throw Error('no clipboard');el.remove();}
      $('#shopCopyList').innerHTML='已复制 '+icon('check');setTimeout(()=>$('#shopCopyList').innerHTML='复制咨询清单 '+icon('copy'),2000);
    }catch(_){alert('复制受浏览器限制，请下载选购清单。');}
  }
  function setKind(kind){
    if(!$$('.shop-filter').some(btn=>btn.dataset.kind===kind))return;
    activeKind=kind;$('#trainingOverview').hidden=kind!=='智能体培训'&&kind!=='全部';$$('.shop-filter').forEach(btn=>{btn.classList.toggle('is-active',btn.dataset.kind===kind);btn.setAttribute('aria-pressed',String(btn.dataset.kind===kind));});render();
  }
  $$('.shop-filter').forEach(btn=>btn.addEventListener('click',()=>setKind(btn.dataset.kind)));
  $$('[data-shop-kind]').forEach(link=>link.addEventListener('click',()=>setKind(link.dataset.shopKind)));
  grid.addEventListener('click',e=>{
    const add=e.target.closest('[data-shop-add]');if(add){toggle(add.dataset.shopAdd);return;}
    const item=e.target.closest('[data-shop-detail]');if(item)showDetail(item.dataset.shopDetail);
  });
  detail.addEventListener('click',e=>{const b=e.target.closest('[data-shop-add]');if(b){toggle(b.dataset.shopAdd);showDetail(b.dataset.shopAdd);return;}if(e.target.closest('a[href="#projects"]'))closeDialog(detail);});
  cartDialog.addEventListener('click',e=>{const b=e.target.closest('[data-shop-remove]');if(b)toggle(b.dataset.shopRemove);});
  $('#shopCartOpen').addEventListener('click',()=>{renderCart();openDialog(cartDialog);});
  $$('[data-shop-close]').forEach(b=>b.addEventListener('click',()=>closeDialog($('#'+b.dataset.shopClose))));
  [detail,cartDialog].forEach(d=>d.addEventListener('click',e=>{if(e.target===d)closeDialog(d);}));
  $('#trainingMonths').addEventListener('change',e=>{const value=Number(e.target.value);if([1,2,3].includes(value)){months=value;save();}});
  $('#trainingGroup').addEventListener('change',e=>{group=e.target.checked;save();});
  $('#shopTalkLink').addEventListener('click',()=>{const txt=cartText();if(txt){const input=$('#problem');input.value=(input.value.trim()?input.value+'\n\n':'')+txt;}closeDialog(cartDialog);});
  $('#shopCopyList').addEventListener('click',()=>{const txt=cartText();if(txt)copy(txt);});
  $('#shopExportList').addEventListener('click',()=>{const txt=cartText();if(txt)download(txt);});
  render();
})();
