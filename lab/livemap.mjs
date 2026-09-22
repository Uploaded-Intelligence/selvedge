// Shared body-map classifier. Per 4×4 block: 1 = living tissue (written this interval AND dominated by CODE of one
// class), else 0. Data (class 0) never counts as coherence — the E19 fix, now in one place for every assay.
export const CLS = [0, 1, 1, 1, 1, 1, 1, 1, 1, 2, 2, 3, 3, 4, 4];
export function liveMap(X, minWrites = 4, minDom = 10) {
  const w = X.w, bw = w >> 2, bh = X.h >> 2, m = new Uint8Array(bw * bh);
  for (let by = 0; by < bh; by++) for (let bx = 0; bx < bw; bx++) {
    let wr = 0; const h = [0, 0, 0, 0, 0];
    for (let y = 0; y < 4; y++) for (let x = 0; x < 4; x++) { const i = (by * 4 + y) * w + bx * 4 + x; wr += X.activity[i]; h[CLS[X.table[X.cells[i]]]]++; }
    m[by * bw + bx] = wr >= minWrites && Math.max(h[1], h[2], h[3], h[4]) >= minDom ? 1 : 0;
  }
  X.clearActivity(); return m;
}
export const jaccard = (a, b) => { let i = 0, u = 0; for (let k = 0; k < a.length; k++) { if (a[k] && b[k]) i++; if (a[k] || b[k]) u++; } return u ? i / u : 1; };
