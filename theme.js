/* Apply before paint and share the preference across all pages. */
(()=>{
 const root=document.documentElement;
 const system=matchMedia('(prefers-color-scheme: light)');
 let preference=null;
 try{preference=localStorage.getItem('hank-theme');}catch{}
 function apply(theme){
  root.dataset.theme=theme;
  document.querySelector('meta[name="theme-color"]')?.setAttribute('content',theme==='light'?'#f4f6ef':'#08090c');
  const button=document.querySelector('#themeSwitch');
  if(button){const zh=root.lang.startsWith('zh');button.textContent=theme==='light'?(zh?'深色主题':'Dark theme'):(zh?'浅色主题':'Light theme');button.setAttribute('aria-label',zh?'切换至'+button.textContent:'Switch to '+button.textContent);}
 }
 apply(preference==='light'||preference==='dark'?preference:system.matches?'light':'dark');
 system.addEventListener('change',()=>{if(!preference)apply(system.matches?'light':'dark');});
 addEventListener('storage',e=>{if(e.key==='hank-theme'){preference=e.newValue;apply(preference|| (system.matches?'light':'dark'));}});
 addEventListener('DOMContentLoaded',()=>{
  const button=document.createElement('button');button.id='themeSwitch';button.type='button';button.className='theme-switch';
  button.addEventListener('click',()=>{preference=root.dataset.theme==='light'?'dark':'light';try{localStorage.setItem('hank-theme',preference);}catch{}apply(preference);});
  document.body.append(button);apply(root.dataset.theme);
  new MutationObserver(()=>apply(root.dataset.theme)).observe(root,{attributes:true,attributeFilter:['lang']});
 });
})();
