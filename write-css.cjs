const fs = require('fs')
const p = 'c:/Projects/choir-app/client/src/index.css'

const css = `@import "tailwindcss";

@layer base {
  body {
    min-height: 100vh;
    background: linear-gradient(135deg, #1a0005 0%, #3d0012 45%, #1f0808 100%);
    background-attachment: fixed;
    color: #f8e8ea;
    font-family: 'Inter', system-ui, sans-serif;
  }
}

@layer components {

  .glass {
    background: linear-gradient(160deg, rgba(255,255,255,0.10) 0%, rgba(220,30,60,0.06) 50%, rgba(255,255,255,0.04) 100%);
    backdrop-filter: blur(20px);
    -webkit-backdrop-filter: blur(20px);
    border: 1px solid rgba(255,100,120,0.18);
    border-radius: 1.25rem;
    box-shadow: 0 8px 32px rgba(180,0,30,0.3), 0 2px 8px rgba(0,0,0,0.4), inset 0 1px 0 rgba(255,180,180,0.25), inset 0 -1px 0 rgba(0,0,0,0.25);
  }

  .glass-light {
    background: linear-gradient(160deg, rgba(255,255,255,0.14) 0%, rgba(220,30,60,0.08) 100%);
    backdrop-filter: blur(24px);
    -webkit-backdrop-filter: blur(24px);
    border: 1px solid rgba(255,120,140,0.22);
    border-radius: 1.25rem;
    box-shadow: 0 4px 24px rgba(180,0,30,0.2), inset 0 1px 0 rgba(255,200,200,0.3);
  }

  .btn-glass {
    background: linear-gradient(160deg, #e8203a 0%, #c0152c 60%, #9a0f22 100%);
    border: 1px solid rgba(255,150,160,0.35);
    color: white;
    font-weight: 700;
    padding: 0.625rem 1.5rem;
    border-radius: 0.875rem;
    cursor: pointer;
    transition: all 0.2s;
    box-shadow: 0 4px 18px rgba(220,20,50,0.55), 0 1px 4px rgba(0,0,0,0.4), inset 0 1px 0 rgba(255,180,180,0.35), inset 0 -2px 0 rgba(0,0,0,0.25);
    text-shadow: 0 1px 3px rgba(0,0,0,0.4);
  }
  .btn-glass:hover {
    background: linear-gradient(160deg, #f0304a 0%, #d01830 60%, #aa1225 100%);
    box-shadow: 0 6px 28px rgba(220,20,50,0.75), inset 0 1px 0 rgba(255,200,200,0.4);
    transform: translateY(-1px);
  }
  .btn-glass:active { transform: translateY(0); }
  .btn-glass:disabled { opacity: 0.45; cursor: not-allowed; transform: none; }

  .btn-glass-red {
    background: linear-gradient(160deg, #ff3355 0%, #cc1133 60%, #990022 100%);
    border: 1px solid rgba(255,150,170,0.3);
    color: white; font-weight: 700; padding: 0.625rem 1.5rem; border-radius: 0.875rem; cursor: pointer; transition: all 0.2s;
    box-shadow: 0 4px 18px rgba(220,10,40,0.5), inset 0 1px 0 rgba(255,180,190,0.3), inset 0 -2px 0 rgba(0,0,0,0.2);
    text-shadow: 0 1px 2px rgba(0,0,0,0.35);
  }
  .btn-glass-red:hover { background: linear-gradient(160deg,#ff4466,#dd2244,#aa1133); box-shadow: 0 6px 24px rgba(220,10,40,0.7); transform: translateY(-1px); }
  .btn-glass-red:disabled { opacity: 0.45; cursor: not-allowed; transform: none; }

  .btn-glass-green {
    background: linear-gradient(160deg, #22c55e 0%, #16a34a 60%, #0f7a38 100%);
    border: 1px solid rgba(134,239,172,0.3);
    color: white; font-weight: 700; padding: 0.625rem 1.5rem; border-radius: 0.875rem; cursor: pointer; transition: all 0.2s;
    box-shadow: 0 4px 18px rgba(22,163,74,0.45), inset 0 1px 0 rgba(180,255,200,0.3), inset 0 -2px 0 rgba(0,0,0,0.2);
    text-shadow: 0 1px 2px rgba(0,0,0,0.3);
  }
  .btn-glass-green:hover { background: linear-gradient(160deg,#30d670,#20b458,#149040); box-shadow: 0 6px 24px rgba(22,163,74,0.65); transform: translateY(-1px); }
  .btn-glass-green:disabled { opacity: 0.45; cursor: not-allowed; transform: none; }

  .btn-glass-outline {
    background: rgba(255,60,80,0.08);
    border: 1px solid rgba(255,100,120,0.25);
    color: rgba(255,220,220,0.85); font-weight: 600; padding: 0.625rem 1.5rem; border-radius: 0.875rem; cursor: pointer; transition: all 0.2s;
    box-shadow: inset 0 1px 0 rgba(255,180,180,0.1);
  }
  .btn-glass-outline:hover { background: rgba(255,60,80,0.15); border-color: rgba(255,120,140,0.45); }
  .btn-glass-outline:disabled { opacity: 0.4; cursor: not-allowed; }

  .input-glass {
    background: rgba(180,0,20,0.12);
    border: 1px solid rgba(255,100,120,0.2);
    border-radius: 0.875rem;
    color: #ffe8ea; padding: 0.625rem 1rem; width: 100%; transition: all 0.2s;
    box-shadow: inset 0 2px 6px rgba(0,0,0,0.3);
    font-size: 0.875rem;
  }
  .input-glass::placeholder { color: rgba(255,180,180,0.35); }
  .input-glass:focus {
    outline: none;
    border-color: rgba(220,40,60,0.7);
    box-shadow: 0 0 0 3px rgba(220,20,50,0.2), inset 0 2px 6px rgba(0,0,0,0.25);
    background: rgba(200,0,20,0.18);
  }
  .input-glass::-webkit-calendar-picker-indicator { filter: invert(1) opacity(0.5); }

  .text-glow { text-shadow: 0 0 24px rgba(255,80,100,0.65); }

  .chip-pending  { background: rgba(234,179,8,0.18);  border: 1px solid rgba(234,179,8,0.35);  color: #fde047; border-radius: 9999px; padding: 0.2rem 0.75rem; font-size: 0.75rem; font-weight: 600; }
  .chip-approved { background: rgba(34,197,94,0.18);  border: 1px solid rgba(34,197,94,0.35);  color: #86efac; border-radius: 9999px; padding: 0.2rem 0.75rem; font-size: 0.75rem; font-weight: 600; }
  .chip-revision { background: rgba(239,68,68,0.22);  border: 1px solid rgba(239,68,68,0.45);  color: #fca5a5; border-radius: 9999px; padding: 0.2rem 0.75rem; font-size: 0.75rem; font-weight: 600; }

  .glass-divider { border: none; border-top: 1px solid rgba(255,80,100,0.1); margin: 0.5rem 0; }

  ::-webkit-scrollbar { width: 6px; }
  ::-webkit-scrollbar-track { background: rgba(180,0,20,0.1); }
  ::-webkit-scrollbar-thumb { background: rgba(220,40,60,0.5); border-radius: 3px; }
  ::-webkit-scrollbar-thumb:hover { background: rgba(220,40,60,0.75); }
}
`

fs.writeFileSync(p, css, 'utf8')
console.log('index.css written:', css.split('\n').length, 'lines')
