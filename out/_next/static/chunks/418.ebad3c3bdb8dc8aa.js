(self.webpackChunk_N_E=self.webpackChunk_N_E||[]).push([[418],{33946:function(a,b,c){"use strict";c.r(b),c.d(b,{getED25519Key:function(){return h}});var d=c(50108),e=c.n(d),f=c(48764).Buffer;let g=e().lowlevel;function h(a){let b;b="string"==typeof a?f.from(a,"hex"):a;let c=new Uint8Array(64),d=[g.gf(),g.gf(),g.gf(),g.gf()],e=new Uint8Array([...new Uint8Array(b),...new Uint8Array(32)]),h=new Uint8Array(32);g.crypto_hash(c,e,32),c[0]&=248,c[31]&=127,c[31]|=64,g.scalarbase(d,c),g.pack(h,d);for(let i=0;i<32;i+=1)e[i+32]=h[i];return{sk:f.from(e),pk:f.from(h)}}},78848:function(){}}])