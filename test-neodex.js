// lancé par le test « local » de NeoDex : une image pixel art toute prête, un coup joué, le plateau qui suit la taille de la fenêtre
// (avec NEO_SHOTS : garde les sept images toutes prêtes)
module.exports = async ({ pj, sleep }) => {
  const S = js => pj(`(() => { const T = document.getElementById('tqBoard').__tq; ${js} })()`);
  await pj(`window.__e = []; addEventListener('error', e => __e.push(e.message)); 0`);
  await sleep(800);
  if (process.env.NEO_SHOTS) for (let i = 0; i < 7; i++) { const d = await S(`return T.art(${i});`); require('fs').writeFileSync(require('path').join(process.env.NEO_SHOTS, 'taquin-art-' + i + '.png'), Buffer.from(d.split(',')[1], 'base64')); }
  await pj(`(() => { const s = document.getElementById('tqSrc'); s.value = 'px4'; s.dispatchEvent(new Event('change')); return 0; })()`); await sleep(500);
  const r = await S(`const t = T.st(), n = t.n, hole = t.tiles.indexOf(n * n - 1), p = hole % n ? hole - 1 : hole + 1, m0 = t.moves; T.move(p);
    return [!!t.img && t.img.startsWith('data:image/png'), t.moves - m0, document.querySelectorAll('.tqTile').length === n * n].join(',');`);
  if (r !== 'true,1,true') throw new Error('image toute prête, un coup : ' + r);
  await sleep(400);
  const L = await pj(`(() => { const r = document.querySelector('.tqBoardBox').getBoundingClientRect(); let s = 0; for (let e = document.querySelector('.tqBoardBox').parentElement; e; e = e.parentElement) s += e.scrollTop; return { bottom: Math.round(r.bottom + s), h: Math.round(r.height), wh: innerHeight, ww: innerWidth, sw: document.documentElement.scrollWidth }; })()`);
  if (L.bottom > L.wh + 1 || L.sw > L.ww + 1 || L.h < 300) throw new Error('le plateau dépasse la fenêtre ou reste petit : ' + JSON.stringify(L));
  const errs = await pj(`window.__e.join(' | ')`); if (errs) throw new Error('erreur : ' + errs);
  return 'image pixel art, un coup · plateau de ' + L.h + ' px dans ' + L.ww + '×' + L.wh;
};
