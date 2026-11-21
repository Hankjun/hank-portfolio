const columns = [
  {
    id: 'philosophy', path: 'journal/#philosophy',
    zh: ['汉克读哲学','从《倦怠社会》到《把自己作为方法》，带着日常生活里的疑问，沿书架读进哲学。','浏览哲学书架'],
    en: ['Hank Reads Philosophy','Explore questions from everyday life through books including The Burnout Society and Self as Method.','Browse the bookshelves']
  },
  {
    id: 'assistant-os', path: 'journal/assistant-os/',
    zh: ['超级助理 OS','一份会议记录，怎样变成可执行的任务？从资料归档、共享记忆到智能体接力，拆解个人工作流。','阅读工作流笔记'],
    en: ['Super Assistant OS','Follow a meeting note through filing, shared memory and agent handoffs into a task you can act on.','Read the workflow notes'],
    notes: {
      zh: [
        ['把会议记录变成任务单','会后先把客户原话、已做决定和待确认项分开。让助理按“谁负责、交付什么、何时验收”整理行动项，缺少负责人或日期的条目留给人确认。'],
        ['让下一次对话接得上','为项目留一页共享记忆，记下当前目标、最近决定和原始资料链接。下次启动任务，先读取这一页，再核对原文中的报价、日期和交付范围。'],
        ['给智能体一个明确的交接点','整理资料的助理交出原文索引，写作助理据此起草方案。交接时附上引用出处和待核实问题，由负责人核对后定稿，再把决定写回项目记录。']
      ],
      en: [
        ['Turn meeting notes into tasks','Separate the client’s words, decisions and open questions. Ask the assistant to list an owner, deliverable and review date for each action. Flag missing details for human confirmation.'],
        ['Carry context into the next session','Keep a shared project note with the current objective, recent decisions and links to originals. Start the next task there, then verify prices, dates and scope against the source.'],
        ['Define the handoff','The research assistant delivers an index of sources. The writing assistant uses it to draft the proposal and flags unresolved questions. The owner verifies the draft and records the final decisions.']
      ]
    }
  },
  {
    id: 'ai-native-organization', path: 'journal/ai-native-organization/',
    zh: ['AI 原生组织','当团队里既有同事也有智能体，谁定目标、谁执行、谁验收？从一个项目看人机分工。','阅读组织笔记'],
    en: ['AI-Native Organizations','Who sets the goal, does the work and signs off when people and agents share a project?','Read the organization notes'],
    notes: {
      zh: [
        ['让目标和权限同时落到人','以客户周报为例，项目负责人决定读者是谁、哪些指标值得解释、什么时候发送。智能体可以读取获准使用的项目记录并起草，负责人保留对外发布的决定权。'],
        ['按交付物划分角色','资料助理汇总本周变化并标出来源，分析助理解释偏差，编辑助理整理成稿。每次交接都带上输入、输出和未解决的问题，让下一位接手者知道该查哪里。'],
        ['用验收结果改进协作','负责人逐项核对数字、出处与客户承诺。遇到反复出现的错误，把检查项写回下一期周报模板，并明确由哪个角色在交接前完成。']
      ],
      en: [
        ['Assign ownership and permissions','For a client update, the project lead chooses the audience, metrics and delivery date. Agents can read approved records and draft the update. The lead decides when it goes out.'],
        ['Define roles by what they deliver','A research agent collects changes and sources, an analyst explains deviations, and an editor assembles the draft. Each handoff includes inputs, outputs and unresolved questions.'],
        ['Feed review findings back into the process','The owner checks figures, sources and commitments. When an error repeats, add a check to the next reporting template and assign it to a role before handoff.']
      ]
    }
  }
];

export function columnSection(c) {
  const cards=columns.map(column=>{
    const [title,description,action]=column[c.lang];
    return `<a class="column-card" href="${c.url(column.path)}"><h3>${title}</h3><p>${description}</p><span>${action} <i aria-hidden="true">↗</i></span></a>`;
  }).join('');
  return `<section class="section" id="about"><div class="wrap"><div class="section-heading"><h2>${c.t('nav.about')}</h2></div><div class="column-grid">${cards}</div><div class="inline-links">${c.link('work16/',c.t('nav.research'))}</div></div></section>`;
}

export function columnTitle(id,lang) {
  return columns.find(column=>column.id===id)[lang][0];
}

export function columnArticle(c,id) {
  const column=columns.find(item=>item.id===id);
  const [name,intro]=column[c.lang];
  return `<main class="section" id="main"><article class="wrap column-article"><a class="text-link" href="${c.url('#about')}">${c.lang==='zh'?'返回个人专栏':'Back to Personal Column'}</a><h1>${name}</h1><p class="column-intro">${intro}</p>${column.notes[c.lang].map(([title,body])=>`<section><h2>${title}</h2><p>${body}</p></section>`).join('')}</article></main>`;
}
