const shelves = [
  [
    "西方（英语 / 德语世界）",
    "Western · English & German",
    [
      [
        "《倦怠社会》",
        "韩炳哲",
        "篇幅短，讲现代人为什么总是累、总在内卷。推荐第一本读。"
      ],
      [
        "《公正》",
        "迈克尔·桑德尔",
        "哈佛公开课同名，讨论怎样做才是对的。"
      ],
      [
        "《哲学的慰藉》",
        "阿兰·德波顿",
        "生活化，讲哲学如何应对焦虑和失落。"
      ]
    ]
  ],
  [
    "中文世界",
    "Chinese",
    [
      [
        "《把自己作为方法》",
        "项飙",
        "对话体，帮普通人理解自己的处境，最易入门。"
      ],
      [
        "《何为良好生活》",
        "陈嘉映",
        "偏学术，思考扎实。"
      ]
    ]
  ],
  [
    "日文世界",
    "Japanese",
    [
      [
        "《人类世的资本论》",
        "斋藤幸平",
        "日本畅销书，讨论增长与消费。"
      ],
      [
        "《动物化的后现代》",
        "东浩纪",
        "研究网络与亚文化，很有当代感。"
      ]
    ]
  ],
  [
    "阿拉伯语世界",
    "Arabic",
    [
      [
        "伦理与现代性相关著作",
        "塔哈·阿卜杜拉赫曼",
        "摩洛哥哲学家，中文译本少，可读英文版或相关介绍。"
      ]
    ]
  ],
  [
    "西班牙语世界",
    "Spanish",
    [
      [
        "《伦理学与生活》(Ética para Amador)",
        "费尔南多·萨瓦特尔（西班牙）",
        "写给儿子的伦理学，亲切好读。西语区首选。"
      ],
      [
        "《恐穷症》(Aporofobia)",
        "阿德拉·科尔蒂纳（西班牙）",
        "讨论人们为什么排斥穷人。"
      ],
      [
        "解放哲学相关著作",
        "恩里克·杜塞尔（拉美/墨西哥）",
        "从拉美视角反思西方中心主义。"
      ],
      [
        "《孤独的迷宫》",
        "奥克塔维奥·帕斯（墨西哥）",
        "年代稍早，讲墨西哥民族心理。"
      ]
    ]
  ],
  [
    "经典补充（可选）",
    "Optional classics",
    [
      [
        "《苏菲的世界》",
        "",
        "小说形式串起西方哲学史"
      ],
      [
        "《沉思录》",
        "",
        "古罗马皇帝的自省笔记"
      ],
      [
        "《论语》",
        "",
        "选白话注释版"
      ],
      [
        "《庄子》",
        "",
        "选白话注释版"
      ]
    ]
  ]
];

export function renderJournal(c, escapeHTML) {
  const {t}=c;
  let number=0;
  const poster=(book)=>{
    const [title,author,description]=book.map(escapeHTML);
    const id='journal-book-'+(++number);
    const issue=String(number).padStart(2,'0');
    return `<li><button type="button" class="journal-poster" popovertarget="${id}" aria-label="${t('journal.open')} ${title}">
      <span class="journal-poster-top"><span>HANK / READING</span><span>${issue}</span></span>
      <span class="journal-art" aria-hidden="true"></span>
      <strong lang="zh-CN">${title}</strong>${author?`<span class="journal-author" lang="zh-CN">${author}</span>`:''}
      <span class="journal-poster-bottom">${t('journal.open')} ↗</span>
    </button><article class="journal-entry" id="${id}" popover aria-labelledby="${id}-title">
      <div class="journal-entry-top"><span>HANK / READING / ${issue}</span><button type="button" class="button light small" popovertarget="${id}" popovertargetaction="hide">${t('nav.close')}</button></div>
      <h3 id="${id}-title" lang="zh-CN">${title}</h3>${author?`<p lang="zh-CN">${author}</p>`:''}
      <h4>${t('journal.synopsis')}</h4><p lang="zh-CN">${description}</p>
      <div class="journal-prompt"><h4>${t('journal.promptTitle')}</h4><p>${t('journal.prompt')}</p></div>
    </article></li>`;
  };
  return `<main id="main" class="journal-page"><div class="wrap">
    <section class="journal-intro"><div><p class="eyebrow">HANK / READING JOURNAL</p><h1>${t('nav.about')}</h1><p>${t('journal.intro')}</p><a class="button" href="#journal-shelf-1">${t('journal.browse')} ↓</a></div>
    <aside class="journal-note"><span class="meta">${t('journal.route')}</span><ol lang="zh-CN"><li>韩炳哲《倦怠社会》</li><li>项飙《把自己作为方法》</li><li>萨瓦特尔《伦理学与生活》</li></ol><p>${t('journal.routine')}</p></aside></section>
    ${shelves.map(([zh,en,books],i)=>`<section class="journal-shelf" id="journal-shelf-${i+1}" aria-labelledby="journal-shelf-title-${i+1}">
      <div class="journal-shelf-heading"><span class="meta">0${i+1} /</span><h2 id="journal-shelf-title-${i+1}">${escapeHTML(c.lang==='zh'?zh:en)}</h2><span class="meta">${books.length} ${t('journal.count')}</span></div>
      <ul class="journal-rail" aria-labelledby="journal-shelf-title-${i+1}">${books.map(poster).join('')}</ul>
    </section>`).join('')}
  </div></main>`;
}
