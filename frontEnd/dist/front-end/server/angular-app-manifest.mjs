
export default {
  bootstrap: () => import('./main.server.mjs').then(m => m.default),
  inlineCriticalCss: true,
  baseHref: '/',
  locale: undefined,
  routes: undefined,
  entryPointToBrowserMapping: {},
  assets: {
    'index.csr.html': {size: 29509, hash: '2842f89683bae9a1e080209233306c8c548ba722f8878b33bbc74b6573070a31', text: () => import('./assets-chunks/index_csr_html.mjs').then(m => m.default)},
    'index.server.html': {size: 17204, hash: 'f5d4ef3411d4d06ac3ecccb563283c2d0809a0239fb0fa3fae8bb03a35d33a0c', text: () => import('./assets-chunks/index_server_html.mjs').then(m => m.default)},
    'styles-4ZVC2CIC.css': {size: 545927, hash: 'APQb5e+bdnc', text: () => import('./assets-chunks/styles-4ZVC2CIC_css.mjs').then(m => m.default)}
  },
};
