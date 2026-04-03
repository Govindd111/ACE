"use client";
import { useState, useRef, useCallback } from "react";

// ─── CSS ─────────────────────────────────────────────────────────────────────
const CSS = `
  @import url('https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@400;500;600;700&family=JetBrains+Mono:wght@400;500&family=Playfair+Display:wght@600&display=swap');
  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
  :root {
    --bg:#08100c; --bg2:#0d1a12; --bg3:#111f16; --surface:#162b1d;
    --border:rgba(52,211,120,0.10); --border2:rgba(52,211,120,0.22); --border3:rgba(52,211,120,0.38);
    --ace:#34d378; --ace2:#5fe095; --ace3:rgba(52,211,120,0.07);
    --amber:#f59e0b; --red:#ef4444; --blue:#60a5fa; --purple:#a78bfa;
    --text:#e8f5ee; --text2:#7fb896; --text3:#3d6e50;
    --mono:'JetBrains Mono',monospace; --sans:'Space Grotesk',sans-serif;
    --r:10px; --r2:6px;
  }
  body{background:var(--bg);color:var(--text);font-family:var(--sans);font-size:14px;line-height:1.6;}
  ::-webkit-scrollbar{width:3px;} ::-webkit-scrollbar-thumb{background:var(--border2);border-radius:3px;}
  .app{display:flex;min-height:100vh;}
  .sidebar{width:230px;min-height:100vh;background:var(--bg2);border-right:1px solid var(--border);display:flex;flex-direction:column;position:fixed;top:0;left:0;z-index:100;overflow-y:auto;}
  .logo-wrap{padding:20px 18px 16px;border-bottom:1px solid var(--border);flex-shrink:0;}
  .logo-row{display:flex;align-items:center;gap:10px;}
  .logo-badge{width:36px;height:36px;background:var(--ace);border-radius:8px;display:flex;align-items:center;justify-content:center;font-weight:700;font-size:13px;color:#08100c;flex-shrink:0;}
  .logo-name{font-family:'Playfair Display',serif;font-size:17px;color:var(--text);}
  .logo-full{font-size:10px;color:var(--text3);margin-top:2px;letter-spacing:.03em;}
  .engine-status{margin:12px 18px 0;background:var(--ace3);border:1px solid var(--border);border-radius:var(--r2);padding:9px 11px;}
  .es-row{display:flex;justify-content:space-between;align-items:center;margin-bottom:4px;}
  .es-label{font-size:10px;color:var(--text3);text-transform:uppercase;letter-spacing:.07em;}
  .es-val{font-size:11px;font-weight:700;color:var(--ace);}
  .es-bar{height:3px;background:var(--bg3);border-radius:2px;overflow:hidden;}
  .es-fill{height:3px;background:var(--ace);border-radius:2px;}
  .es-caption{font-size:10px;color:var(--text3);margin-top:4px;}
  .nav{flex:1;padding:12px 10px;display:flex;flex-direction:column;gap:1px;}
  .nav-sect{font-size:9px;color:var(--text3);letter-spacing:.12em;text-transform:uppercase;padding:10px 8px 4px;}
  .nav-item{display:flex;align-items:center;gap:9px;padding:8px 10px;border-radius:var(--r2);cursor:pointer;color:var(--text2);font-size:13px;border:1px solid transparent;transition:all .12s;user-select:none;}
  .nav-item:hover{background:var(--bg3);color:var(--text);}
  .nav-item.active{background:var(--ace3);color:var(--ace2);border-color:var(--border);}
  .nav-icon{font-size:13px;width:16px;text-align:center;flex-shrink:0;}
  .nav-badge{margin-left:auto;font-size:9px;background:var(--ace);color:#08100c;padding:1px 6px;border-radius:8px;font-weight:700;}
  .nav-badge-red{margin-left:auto;font-size:9px;background:var(--red);color:#fff;padding:1px 6px;border-radius:8px;font-weight:700;}
  .sidebar-foot{padding:12px;border-top:1px solid var(--border);flex-shrink:0;}
  .company-chip{background:var(--bg3);border:1px solid var(--border);border-radius:var(--r2);padding:9px 12px;}
  .company-plan{font-size:9px;color:var(--ace);text-transform:uppercase;letter-spacing:.08em;font-weight:600;}
  .company-name{font-size:13px;color:var(--text);margin-top:2px;}
  .company-sector{font-size:11px;color:var(--text3);margin-top:1px;}
  .main{margin-left:230px;flex:1;display:flex;flex-direction:column;min-width:0;}
  .topbar{height:56px;background:var(--bg2);border-bottom:1px solid var(--border);padding:0 28px;display:flex;align-items:center;justify-content:space-between;position:sticky;top:0;z-index:50;flex-shrink:0;}
  .topbar-left{display:flex;align-items:center;gap:10px;min-width:0;}
  .page-title{font-size:15px;font-weight:600;color:var(--text);white-space:nowrap;}
  .topbar-crumb{font-size:11px;color:var(--text3);white-space:nowrap;}
  .topbar-right{display:flex;align-items:center;gap:8px;flex-shrink:0;}
  .content{padding:24px 28px;flex:1;}
  .btn{display:inline-flex;align-items:center;gap:6px;padding:7px 14px;border-radius:var(--r2);font-size:12px;font-weight:600;cursor:pointer;border:1px solid;transition:all .12s;font-family:var(--sans);letter-spacing:.01em;white-space:nowrap;}
  .btn-ace{background:var(--ace);color:#08100c;border-color:var(--ace);}
  .btn-ace:hover{background:var(--ace2);}
  .btn-out{background:transparent;color:var(--text2);border-color:var(--border2);}
  .btn-out:hover{color:var(--text);border-color:var(--ace);}
  .btn-ghost{background:transparent;color:var(--text3);border-color:transparent;}
  .btn-ghost:hover{color:var(--text2);background:var(--bg3);}
  .btn-sm{padding:5px 10px;font-size:11px;}
  .btn-danger{background:rgba(239,68,68,.1);color:var(--red);border-color:rgba(239,68,68,.2);}
  .btn-danger:hover{background:rgba(239,68,68,.2);}
  .btn:disabled{opacity:.45;cursor:default;pointer-events:none;}
  .card{background:var(--bg2);border:1px solid var(--border);border-radius:var(--r);padding:18px 22px;}
  .card-sm{padding:14px 16px;}
  .metrics{display:grid;grid-template-columns:repeat(4,minmax(0,1fr));gap:14px;margin-bottom:22px;}
  .mc{background:var(--bg2);border:1px solid var(--border);border-radius:var(--r);padding:18px 20px;position:relative;overflow:hidden;}
  .mc::after{content:'';position:absolute;top:0;left:0;right:0;height:2px;}
  .mc.g::after{background:linear-gradient(90deg,var(--ace),transparent);}
  .mc.a::after{background:linear-gradient(90deg,var(--amber),transparent);}
  .mc.r::after{background:linear-gradient(90deg,var(--red),transparent);}
  .mc.b::after{background:linear-gradient(90deg,var(--blue),transparent);}
  .mc-label{font-size:10px;color:var(--text3);text-transform:uppercase;letter-spacing:.08em;margin-bottom:8px;}
  .mc-val{font-size:26px;font-weight:700;color:var(--text);line-height:1;}
  .mc-sub{font-size:11px;color:var(--text3);margin-top:5px;}
  .mc-foot{font-size:10px;color:var(--text3);margin-top:6px;display:flex;align-items:center;gap:4px;}
  .ai-pill{font-size:9px;background:var(--ace3);color:var(--ace);border:1px solid var(--border);border-radius:4px;padding:1px 5px;font-weight:700;}
  .tbl-wrap{overflow-x:auto;}
  table{width:100%;border-collapse:collapse;}
  th{font-size:10px;color:var(--text3);text-transform:uppercase;letter-spacing:.08em;padding:9px 14px;text-align:left;border-bottom:1px solid var(--border);font-weight:600;white-space:nowrap;}
  td{padding:10px 14px;border-bottom:1px solid var(--border);font-size:13px;color:var(--text2);vertical-align:middle;}
  tr:last-child td{border-bottom:none;}
  tr:hover td{background:var(--bg3);color:var(--text);}
  .td-bold{color:var(--text);font-weight:600;}
  .td-mono{font-family:var(--mono);font-size:12px;color:var(--text);}
  .badge{display:inline-flex;align-items:center;gap:3px;font-size:10px;padding:2px 8px;border-radius:20px;font-weight:600;white-space:nowrap;}
  .bg{background:rgba(52,211,120,.13);color:#5fe095;}
  .ba{background:rgba(245,158,11,.13);color:var(--amber);}
  .br{background:rgba(239,68,68,.13);color:var(--red);}
  .bb{background:rgba(96,165,250,.13);color:var(--blue);}
  .bgr{background:var(--bg3);color:var(--text3);}
  .b-ai{background:var(--ace3);color:var(--ace);border:1px solid var(--border);}
  .sp{display:inline-block;font-size:10px;font-weight:700;padding:2px 7px;border-radius:4px;}
  .s1{background:rgba(239,68,68,.13);color:var(--red);}
  .s2{background:rgba(245,158,11,.13);color:var(--amber);}
  .s3{background:rgba(96,165,250,.13);color:var(--blue);}
  .ai-tag{display:inline-flex;align-items:center;font-size:9px;background:var(--ace3);color:var(--ace);border:1px solid var(--border);border-radius:3px;padding:1px 5px;font-weight:700;vertical-align:middle;margin-left:3px;}
  .h-tag{display:inline-flex;align-items:center;font-size:9px;background:rgba(96,165,250,.1);color:var(--blue);border:1px solid rgba(96,165,250,.2);border-radius:3px;padding:1px 5px;font-weight:700;vertical-align:middle;margin-left:3px;}
  .ring-wrap{position:relative;width:72px;height:72px;flex-shrink:0;}
  .ring-wrap svg{transform:rotate(-90deg);}
  .ring-txt{position:absolute;inset:0;display:flex;align-items:center;justify-content:center;font-size:16px;font-weight:700;}
  .bar-row{margin-bottom:10px;}
  .bar-hd{display:flex;justify-content:space-between;margin-bottom:4px;font-size:12px;}
  .bar-track{height:5px;background:var(--bg3);border-radius:3px;overflow:hidden;}
  .bar-fill{height:100%;border-radius:3px;transition:width .9s cubic-bezier(.4,0,.2,1);}
  .alert{padding:11px 14px;border-radius:var(--r2);font-size:12px;display:flex;gap:9px;align-items:flex-start;line-height:1.6;}
  .alert-a{background:rgba(245,158,11,.09);border:1px solid rgba(245,158,11,.22);color:var(--text2);}
  .alert-g{background:rgba(52,211,120,.09);border:1px solid rgba(52,211,120,.22);color:var(--text2);}
  .alert-r{background:rgba(239,68,68,.09);border:1px solid rgba(239,68,68,.22);color:var(--text2);}
  .alert-b{background:rgba(96,165,250,.09);border:1px solid rgba(96,165,250,.22);color:var(--text2);}
  .itabs{display:flex;border-bottom:1px solid var(--border);margin-bottom:22px;overflow-x:auto;}
  .itab{padding:9px 18px;font-size:12px;font-weight:500;cursor:pointer;color:var(--text3);border-bottom:2px solid transparent;margin-bottom:-1px;transition:all .12s;white-space:nowrap;display:flex;align-items:center;gap:6px;flex-shrink:0;}
  .itab.active{color:var(--ace);border-bottom-color:var(--ace);}
  .itab:hover:not(.active){color:var(--text2);}
  .tier-tag{font-size:9px;padding:1px 5px;border-radius:4px;font-weight:700;letter-spacing:.04em;}
  .t-free{background:rgba(52,211,120,.15);color:var(--ace);}
  .t-pro{background:rgba(96,165,250,.15);color:var(--blue);}
  .t-ent{background:rgba(245,158,11,.15);color:var(--amber);}
  .drop-zone{border:2px dashed var(--border2);border-radius:var(--r);padding:36px;text-align:center;cursor:pointer;transition:all .18s;}
  .drop-zone:hover,.drop-zone.over{border-color:var(--ace);background:var(--ace3);}
  .fg{margin-bottom:14px;}
  .fl{font-size:10px;color:var(--text3);text-transform:uppercase;letter-spacing:.07em;margin-bottom:5px;display:block;}
  .fi{width:100%;background:var(--bg3);border:1px solid var(--border);border-radius:var(--r2);padding:8px 11px;color:var(--text);font-size:13px;font-family:var(--sans);outline:none;transition:border-color .12s;}
  .fi:focus{border-color:var(--ace);}
  .fr{display:grid;grid-template-columns:1fr 1fr;gap:14px;}
  .chat-body{height:420px;overflow-y:auto;padding:16px;display:flex;flex-direction:column;gap:12px;}
  .msg{max-width:84%;}
  .msg-u{align-self:flex-end;}
  .msg-a{align-self:flex-start;}
  .msg-lbl{font-size:10px;color:var(--text3);margin-bottom:3px;}
  .msg-bub{padding:9px 13px;border-radius:var(--r);font-size:13px;line-height:1.65;}
  .msg-u .msg-bub{background:var(--ace);color:#08100c;border-radius:var(--r) var(--r) 2px var(--r);font-weight:500;}
  .msg-a .msg-bub{background:var(--surface);border:1px solid var(--border);color:var(--text);border-radius:var(--r) var(--r) var(--r) 2px;}
  .chat-foot{display:flex;gap:9px;padding:14px;border-top:1px solid var(--border);}
  .chat-in{flex:1;background:var(--bg3);border:1px solid var(--border);border-radius:var(--r2);padding:8px 11px;color:var(--text);font-size:13px;font-family:var(--sans);outline:none;resize:none;}
  .chat-in:focus{border-color:var(--ace);}
  .chat-suggestions{padding:0 14px 12px;display:flex;gap:7px;flex-wrap:wrap;}
  .dots{display:flex;gap:4px;padding:3px 0;}
  .dots span{width:5px;height:5px;background:var(--ace);border-radius:50%;animation:bop 1.2s infinite;}
  .dots span:nth-child(2){animation-delay:.2s;}
  .dots span:nth-child(3){animation-delay:.4s;}
  @keyframes bop{0%,60%,100%{transform:translateY(0)}30%{transform:translateY(-5px)}}
  @keyframes spin{to{transform:rotate(360deg)}}
  .spin{width:14px;height:14px;border:2px solid var(--border2);border-top-color:var(--ace);border-radius:50%;animation:spin .7s linear infinite;display:inline-block;}
  .sup-row{display:flex;align-items:center;gap:12px;padding:11px 14px;background:var(--bg3);border:1px solid var(--border);border-radius:var(--r2);margin-bottom:8px;transition:border-color .12s;}
  .sup-row:hover{border-color:var(--border2);}
  .sup-dot{width:8px;height:8px;border-radius:50%;flex-shrink:0;}
  .sd-green{background:var(--ace);}
  .sd-amber{background:var(--amber);}
  .sd-red{background:var(--red);}
  .sup-name{font-size:13px;font-weight:600;color:var(--text);flex:1;}
  .sup-cat{font-size:11px;color:var(--text3);}
  .req-row{display:flex;justify-content:space-between;align-items:center;padding:9px 0;border-bottom:1px solid var(--border);font-size:12px;}
  .req-row:last-child{border-bottom:none;}
  .req-label{color:var(--text2);flex:1;}
  .req-note{font-size:10px;color:var(--text3);margin-top:1px;}
  .g2{display:grid;grid-template-columns:minmax(0,1fr) minmax(0,1fr);gap:18px;}
  .g3{display:grid;grid-template-columns:minmax(0,1fr) minmax(0,1fr) minmax(0,1fr);gap:14px;}
  .mb14{margin-bottom:14px;}
  .mb22{margin-bottom:22px;}
  .shdr{display:flex;align-items:center;justify-content:space-between;margin-bottom:16px;gap:8px;}
  .stitle{font-size:14px;font-weight:600;color:var(--text);}
  .ssub{font-size:11px;color:var(--text3);margin-top:2px;}
  .prog{height:3px;background:var(--bg3);border-radius:2px;overflow:hidden;}
  .prog-fill{height:100%;background:var(--ace);border-radius:2px;transition:width .5s;}
  .action-tip{font-size:11px;color:var(--ace);cursor:pointer;}
  .action-tip:hover{color:var(--ace2);}
  @keyframes fadeIn{from{opacity:0;transform:translateY(6px)}to{opacity:1;transform:translateY(0)}}
  .fade{animation:fadeIn .25s ease;}
  .report-out{background:var(--bg3);border:1px solid var(--border);border-radius:var(--r);padding:20px;font-size:12.5px;line-height:1.85;color:var(--text2);font-family:var(--mono);white-space:pre-wrap;max-height:480px;overflow-y:auto;}
`;

// ─── DATA ────────────────────────────────────────────────────────────────────
const EMISSIONS = [
  {id:1,cat:"Natural Gas (Heating)",scope:1,amount:"145.2 MWh",tco2e:26.7,factor:"0.184 kgCO₂e/kWh",src:"Manual",status:"verified",action:"Switch to heat pump — 68% reduction possible",ai:true},
  {id:2,cat:"Company Fleet (Diesel)",scope:1,amount:"8,420 litres",tco2e:22.3,factor:"2.651 kgCO₂e/litre",src:"CSV Upload",status:"verified",action:"Electrification assessment recommended",ai:true},
  {id:3,cat:"Electricity (Grid UK)",scope:2,amount:"312.5 MWh",tco2e:68.4,factor:"0.219 kgCO₂e/kWh",src:"CSV Upload",status:"verified",action:"Switch to renewable tariff to reduce market-based Scope 2",ai:true},
  {id:4,cat:"Business Air Travel",scope:3,amount:"24 flights",tco2e:14.8,factor:"0.255 kgCO₂e/km avg",src:"Manual",status:"pending",action:"Add passenger km for CSRD accuracy",ai:false},
  {id:5,cat:"Supply Chain (Purchased Goods)",scope:3,amount:null,tco2e:null,factor:"—",src:"—",status:"missing",action:"Execute automated supplier request",ai:true},
  {id:6,cat:"Employee Commuting",scope:3,amount:"85 employees",tco2e:8.2,factor:"0.096 kgCO₂e/km avg",src:"Estimate",status:"estimated",action:"Run commuting survey for precision",ai:false},
  {id:7,cat:"Waste to Landfill",scope:3,amount:"4.2 tonnes",tco2e:2.1,factor:"0.484 kgCO₂e/tonne",src:"Manual",status:"verified",action:"Zero waste to landfill target is feasible",ai:true},
];
const SUPPLIERS = [
  {name:"BuildMat UK Ltd",cat:"Construction materials",status:"sent",tco2e:null,last:"3 days ago"},
  {name:"FastFreight Logistics",cat:"Transport & delivery",status:"received",tco2e:124.5,last:"1 week ago"},
  {name:"SteelCore Manufacturing",cat:"Structural steel",status:"missing",tco2e:null,last:"Never"},
  {name:"GreenPack Solutions",cat:"Packaging",status:"pending",tco2e:null,last:"5 days ago"},
  {name:"TechParts EU GmbH",cat:"Electronic components",status:"missing",tco2e:null,last:"Never"},
];
const CREDITS = [
  {name:"Kariba REDD+ Forest Protection",type:"Avoided Deforestation",registry:"Verra VCS",loc:"Zimbabwe",price:"$14–18/tCO₂e",score:94,tags:["Biodiversity","Community","SDGs"]},
  {name:"Scottish Onshore Wind",type:"Renewable Energy",registry:"REGO + VCS",loc:"Scotland, UK",price:"£8–12/tCO₂e",score:82,tags:["UK-sourced","Additionality","SECR eligible"]},
  {name:"Kenya Cookstove Project",type:"Household Energy",registry:"Gold Standard",loc:"Kenya",price:"$18–24/tCO₂e",score:89,tags:["Gold Standard","Health","SDGs"]},
];
const NAV = [
  {section:"Monitor",items:[
    {id:"dashboard",icon:"◈",label:"Dashboard"},
    {id:"emissions",icon:"⊕",label:"Emissions Log"},
    {id:"secr",icon:"⚖",label:"SECR Filing",badge:"UK"},
  ]},
  {section:"Automate",items:[
    {id:"ingest",icon:"↑",label:"Data Ingestion"},
    {id:"suppliers",icon:"⬡",label:"Supplier Requests",badgeRed:"3"},
  ]},
  {section:"Comply",items:[
    {id:"compliance",icon:"✓",label:"Compliance"},
    {id:"reports",icon:"⊞",label:"Reports"},
    {id:"credits",icon:"◇",label:"Carbon Credits"},
  ]},
  {section:"Intelligence",items:[
    {id:"ai",icon:"✦",label:"ACE Assistant",badge:"AI"},
  ]},
];
const TITLES = {
  dashboard:"Dashboard",emissions:"Emissions Log",secr:"SECR Filing",
  ingest:"Data Ingestion",suppliers:"Supplier Requests",
  compliance:"Compliance Hub",reports:"Reports & Disclosures",
  credits:"Carbon Credits",ai:"ACE Assistant",
};

// ─── MOCK AI SYSTEM ───────────────────────────────────────────────────────────
// Expert pre-written responses tuned to demo data — never fail, zero API cost
const MOCK_CHAT_RESPONSES = {
  secr_score:
`Your SECR score is 87% because two specific requirements remain open under SI 2018/1030:

1. Energy intensity ratio (s.4(1)(e)) — You need a revenue denominator from your finance team. For construction, turnover per MWh is standard. As soon as you provide your FY2024 revenue figure, ACE calculates and formats this automatically.

2. Prior year comparison — You're filing SECR for the first time, which is expected and defensible. Include this exact wording: "This is the company's first year of SECR reporting. FY2024 has been established as the base year. Year-on-year comparisons will be provided from FY2025 onwards." Your auditor will accept this without question.

Action: Ask your CFO for the FY2024 revenue figure today. That single data point takes your SECR score from 87% to 94%.`,

  scope3:
`Your most urgent Scope 3 gaps, ranked by compliance and financial risk:

Priority 1 — Category 1 (Purchased Goods & Services): Your single biggest risk. Three suppliers have returned no data: BuildMat UK Ltd, SteelCore Manufacturing, TechParts EU GmbH. In construction, supply chain typically represents 55–70% of total Scope 3 emissions. CSRD ESRS E1 makes this mandatory from FY2025. ACE has the supplier request templates ready — send them today.

Priority 2 — Category 4 (Upstream Transport): FastFreight Logistics returned 124.5 tCO₂e. Confirm this covers all freight movements, not only primary deliveries.

Priority 3 — Air travel accuracy: 24 flights logged but passenger kilometres not captured. CSRD requires distance-based calculation. Ask your travel booker to export booking data with routes.

For SECR (your immediate legal obligation), Scope 3 is recommended not mandatory. But if you're presenting to any investor or Tier 1 contractor, these gaps will be challenged.`,

  market_scope2:
`Market-based Scope 2 lets you report the electricity you've actually contracted — not just what the grid delivers.

Your current position:
• Location-based Scope 2: 68.4 tCO₂e (312.5 MWh × 0.219 kgCO₂e/kWh, DESNZ 2023)
• Market-based Scope 2: Currently identical — no green tariff contract in place

How to reduce your market-based figure to zero:
1. Switch to a REGO-backed green electricity tariff (Octopus Energy for Business, E.ON Next, Npower Business all offer verified REGO products)
2. Alternative: purchase REGOs separately for 312.5 MWh. Current REGO price: ~£0.40/MWh = approximately £125 total

Under GHG Protocol Scope 2 Guidance, you must disclose both methods. CSRD ESRS E1 requires market-based as the primary disclosure metric.

This is your single easiest and cheapest compliance win: under £200 removes 68.4 tCO₂e from your CSRD primary figure. Do this before your next board report.`,

  auditor:
`Exact language to use with your auditor on missing supply chain data:

"Scope 3 Category 1 (Purchased Goods and Services) data collection is in progress for FY2024. Automated data requests were issued to five key suppliers, representing approximately 85% of procurement spend by value. Data receipt and verification is expected within 60 days of year-end close. As an interim measure, a spend-based estimate using EXIOBASE 3.8 input-output coefficients for the UK construction sector has been prepared: approximately 180–240 tCO₂e (AI-estimated, ±35% uncertainty, clearly flagged per EU AI Act Article 52). This estimate will be superseded by primary supplier data upon receipt."

Why this satisfies auditors:
• GHG Protocol allows estimates with disclosed methodology — you're complying, not concealing
• CSRD ESRS E1 paragraph 46 recognises data quality tiers — estimated data is valid if clearly flagged
• The interim estimate demonstrates material effort and proportionality
• ACE labels all estimated values automatically, giving you a complete audit trail`,

  csrd_sdr:
`Key differences between CSRD ESRS E1 and UK SDR/TCFD — what matters for your planning:

CSRD ESRS E1 (EU Framework):
• Who: EU operations, subsidiaries of EU groups, or companies with significant EU revenues
• Scope: All three GHG scopes + biodiversity, water, workers, governance (full ESG)
• Timeline: Large EU companies from FY2024; UK subsidiaries of EU groups follow parent; SMEs from FY2026
• Assurance: Limited assurance mandatory from day one; reasonable assurance from 2028
• Teeth: Up to 5% of turnover in fines in some EU member states

UK SDR / TCFD (UK Framework):
• Who: Premium LSE listed companies, large asset managers, large UK companies
• Scope: Climate only — four TCFD pillars: Governance, Strategy, Risk Management, Metrics & Targets
• Unique: Requires scenario analysis against 1.5°C and 4°C pathways (CSRD doesn't require this identically)
• Assurance: Voluntary currently; FCA enforcement for listed entities

For you: SECR is your legal floor and most urgent — do this first. Then GHG Protocol to build the inventory properly. UK SDR adds scenario analysis valuable for investors. CSRD matters if you have EU customers requesting supplier carbon data or an EU-incorporated entity.`,

  sbt:
`Science-Based Targets for Acme Corp — the honest picture:

Your FY2024 baseline: 142.5 tCO₂e total (partial year). Annualised estimate: ~195 tCO₂e.

SBTi requirements:
• Near-term: 50% absolute Scope 1+2 reduction by 2030
• Long-term / Net Zero: 90%+ reduction across all scopes by 2050
• Only the remaining ~10% can be offset with carbon credits

Your practical path to net zero Scope 1+2 (95.1 tCO₂e):
1. Green electricity tariff (2024): Removes 68.4 tCO₂e market-based. Cost: ~£125. Impact: immediate.
2. Fleet electrification (2025–2027): Removes 22.3 tCO₂e Scope 1. Cost: EV lease premium ~£2,400/vehicle/year.
3. Heat pump for gas heating (2027–2030): Removes 26.7 tCO₂e Scope 1. Cost: £8,000–12,000 capital.

SBTi submission cost: £9,500 for companies under 500 employees. Free pathway may apply if you qualify as 'small company'.

Recommendation: Set an internal SBTi-aligned target now, disclose it in your SECR report this year, and submit formally once you have two years of verified data (FY2025). Your FY2024 data becomes the base year. This positions you ahead of CSRD and ahead of most competitors.`,

  credits:
`Carbon credit matching for your 142 tCO₂e residual — ACE's assessment:

Important framing: Credits are for residual emissions only — after maximum feasible reduction. Using credits before reducing is challenged by CSRD auditors and the Science Based Targets initiative.

The three credits ACE matched:

Kariba REDD+ Forest Protection (Score: 94/100):
• Type: Avoided deforestation — Zimbabwe • Registry: Verra VCS (gold standard registry)
• Price: $14–18/tCO₂e → cost for 142 tCO₂e: ~$2,000–2,550
• Strong co-benefits: Biodiversity, community livelihoods, 9 UN SDGs
• Note: Verify specific project VCU serial numbers; REDD+ has faced methodology scrutiny

Scottish Onshore Wind (Score: 82/100):
• Registry: REGO + VCS dual certified. Price: £8–12/tCO₂e → ~£1,136–1,704
• Best for: UK provenance, SECR-eligible, supports domestic energy transition

Kenya Cookstove Project (Score: 89/100):
• Registry: Gold Standard — most credible for social co-benefit claims
• Price: $18–24/tCO₂e. Best for: ESG narrative, investor presentations

ACE recommendation: Start with Scottish Onshore Wind for SECR narrative. Use Kariba or Kenya Cookstove for CSRD quality scoring. But first: implement the green electricity tariff — that removes 68 tCO₂e for under £200.`,

  brsr:
`BRSR (Business Responsibility and Sustainability Reporting) — India:

BRSR is India's ESG disclosure framework, mandated by SEBI for the top 1,000 listed companies by market cap from FY2022–23 onwards.

Key differences from SECR/CSRD:
• Regulator: SEBI (Securities and Exchange Board of India)
• Structure: 3 sections — General Disclosures, Management & Process, Principle-wise Performance (9 NVGs)
• GHG: Scope 1 and 2 mandatory; Scope 3 voluntary but SEBI has signalled it will become mandatory
• Intensity: Energy and emissions intensity ratios required per rupee of turnover AND per unit of product
• BRSR Core: 49 high-value KPIs with limited third-party assurance from FY2023–24

Product opportunity: If you're targeting Indian companies, BRSR compliance requires the same underlying data as SECR but with different disclosure templates. ACE can map Scope 1+2+3 data to BRSR fields — a significant differentiator because most tools are built for EU/UK frameworks only. The Indian market has 1,000+ mandated companies, most still using Excel, with no dominant SaaS player for BRSR. Worth building natively for.`,

  intensity:
`Energy intensity ratio for SECR — exactly what you need:

SI 2018/1030 requires at least one intensity metric relevant to your business. For construction, the most accepted options are:

1. tCO₂e per £1 million revenue — most common for UK construction, comparable across peers
2. Energy (MWh) per £1 million revenue — useful for energy efficiency narrative
3. tCO₂e per square metre of floor space — relevant if property-heavy

Your current data:
• Total energy: 457.7 MWh
• Total Scope 1+2: 117.4 tCO₂e
• Revenue: Pending from finance (this is the only missing input)

Once you provide revenue, ACE calculates automatically:
• If FY2024 revenue = £8M → intensity = 14.7 tCO₂e per £1M turnover
• If FY2024 revenue = £15M → intensity = 7.8 tCO₂e per £1M turnover
• If FY2024 revenue = £25M → intensity = 4.7 tCO₂e per £1M turnover

The intensity ratio is what allows year-on-year comparison even as your business grows — decoupling emissions from growth is what investors and large clients want to see.

Action: One email to your CFO. This single data point takes your SECR score from 87% to 94%.`,

  default:
`Good question — and the answer depends on specifics I can work through with your data.

Based on what I can see right now, your three highest-value actions are:

1. Revenue figure from your CFO → unlocks the SECR intensity ratio (87% → 94% score)
   Time to complete: 10 minutes. One email.

2. Send supplier data requests → closes your largest CSRD gap (Category 1 supply chain)
   Time to complete: ACE has the templates ready on the Supplier Requests page.

3. Green electricity tariff → removes 68.4 tCO₂e from market-based Scope 2 for under £200
   Time to complete: One call to your current energy supplier.

These three actions would take you from 87% SECR compliance to 94%, close your biggest CSRD gap, and deliver the cheapest emission reduction available.

Want me to draft the CFO data request email, prepare supplier outreach copy, or walk through the green tariff comparison? Pick one and I'll go deep on it.`
};

// ─── PRE-WRITTEN REPORTS ──────────────────────────────────────────────────────
const PRE_WRITTEN_REPORTS = {
  "SECR Directors' Report Section":
`ENERGY AND CARBON REPORT — DIRECTORS' REPORT
Financial Year: January–December 2024
Prepared under: SI 2018/1030 (The Companies (Directors' Report) and Limited Liability
Partnerships (Energy and Carbon Report) Regulations 2018)

────────────────────────────────────────────────────────────────

ENERGY CONSUMPTION

During the financial year ended 31 December 2024, Acme Corp Ltd consumed the
following energy from UK activities for which the company is responsible:

  Purchased electricity (UK grid):    312.5 MWh
  Natural gas (space heating):        145.2 MWh
  ──────────────────────────────────────────────
  TOTAL ENERGY CONSUMPTION:           457.7 MWh

────────────────────────────────────────────────────────────────

GREENHOUSE GAS EMISSIONS

  SCOPE 1 — Direct emissions
    Natural gas combustion:             26.7 tCO₂e
    Company vehicle fleet (diesel):     22.3 tCO₂e
    ──────────────────────────────────────────────
    Total Scope 1:                      49.0 tCO₂e

  SCOPE 2 — Energy indirect emissions
    Purchased electricity (location-based): 68.4 tCO₂e
    ──────────────────────────────────────────────
    Total Scope 2:                      68.4 tCO₂e

  TOTAL SCOPE 1 AND SCOPE 2:         117.4 tCO₂e

  SCOPE 3 — Value chain (recommended disclosure)
    Business air travel:                14.8 tCO₂e
    Employee commuting (estimated):      8.2 tCO₂e
    Waste to landfill:                   2.1 tCO₂e
    Purchased goods & services:     In progress *
    ──────────────────────────────────────────────
    Total Scope 3 (partial):            25.1 tCO₂e

  * Automated supplier data requests issued to five key suppliers representing
    ~85% of procurement spend. Data expected within 60 days of year-end.

────────────────────────────────────────────────────────────────

ENERGY INTENSITY RATIO

The Directors have identified turnover (£ million) as the appropriate intensity
denominator for a company of this size and sector. The FY2024 revenue figure is
pending confirmation from the finance function and will be included in the signed
accounts. The intensity ratio will be calculated as total tCO₂e per £1 million
of turnover and disclosed in the final signed Directors' Report.

────────────────────────────────────────────────────────────────

PRIOR YEAR COMPARISON

This is the company's first year of reporting under SI 2018/1030. FY2024 has been
established as the base year in accordance with the GHG Protocol Corporate Standard.
Year-on-year comparisons will be provided from FY2025 onwards.

────────────────────────────────────────────────────────────────

METHODOLOGY

Emission factors: UK Government GHG Conversion Factors for Company Reporting
(DESNZ, 2023 edition). Scope 2 electricity reported on a location-based basis
using the UK grid emission factor of 0.219 kgCO₂e/kWh. Global Warming Potentials
applied on a GWP100 basis per IPCC Sixth Assessment Report (AR6, 2021).
Organisational boundary: Operational control approach, GHG Protocol Corporate
Standard (Revised Edition). Scope 3 Category 1 data collection in progress;
interim spend-based estimate available on request as supplementary disclosure.

────────────────────────────────────────────────────────────────

ENERGY EFFICIENCY MEASURES UNDERTAKEN

The following energy efficiency measures were undertaken or initiated during FY2024:

  1. Fleet electrification assessment completed. Phased replacement of diesel
     vehicles with battery electric equivalents recommended for FY2025–2026,
     targeting a 40% reduction in fleet Scope 1 emissions (~9 tCO₂e saving).

  2. LED lighting upgrade completed at London HQ facility. Estimated annual
     saving: 18 MWh, equivalent to approximately 3.9 tCO₂e at current UK grid
     intensity.

  3. Renewable electricity tariff procurement underway. Transition to a REGO-backed
     supply contract is targeted for Q1 2025, which will reduce market-based
     Scope 2 emissions to zero tCO₂e.

────────────────────────────────────────────────────────────────

DIRECTORS' STATEMENT

The Directors confirm that this energy and carbon information has been prepared
in accordance with the requirements of SI 2018/1030 and the GHG Protocol Corporate
Standard. All AI-assisted calculations are clearly labelled in supporting workings
per EU AI Act Article 52 transparency requirements. This report will be reviewed
by the company's external sustainability advisors prior to filing.

Signed on behalf of the Board of Directors
Acme Corp Ltd — Registered in England and Wales
[Director signature and date]`,

  "CSRD ESRS E1 Disclosure":
`CLIMATE CHANGE DISCLOSURE — ESRS E1
EU Corporate Sustainability Reporting Directive (CSRD)
Reporting period: Financial Year 2024
Entity: Acme Corp Ltd | Sector: Construction | Jurisdiction: UK / EU operations

────────────────────────────────────────────────────────────────

E1-1 — TRANSITION PLAN FOR CLIMATE CHANGE MITIGATION

Acme Corp Ltd has initiated development of a climate transition plan consistent
with a 1.5°C pathway under the Paris Agreement. Interim commitments established:

  • Net zero Scope 1 and Scope 2 by 2040
  • 50% absolute reduction in Scope 1+2 by 2030 (base year: FY2024)
  • Full supply chain (Scope 3 Category 1) data collection operational by FY2025
  • Internal shadow carbon price of £50–80/tCO₂e to be applied to capital
    expenditure appraisals from FY2025

The full transition plan including CapEx alignment and scenario analysis is under
development and will be disclosed in the FY2025 sustainability report.

────────────────────────────────────────────────────────────────

E1-4 — TARGETS FOR CLIMATE CHANGE MITIGATION

Near-term target (FY2024–2030):
  50% absolute reduction in Scope 1+2 GHG emissions against FY2024 base year.

Milestones:
  • FY2025 Q1: Market-based Scope 2 to zero (renewable electricity procurement)
  • FY2026:    40% fleet electrification (4 vehicles BEV conversion)
  • FY2030:    90% reduction in Scope 1+2 versus base year

Long-term target:
  Net zero across all scopes by 2050. Residual emissions (≤10%) offset via
  high-integrity credits (Verra VCS or Gold Standard registries only).

────────────────────────────────────────────────────────────────

E1-6 — GROSS GHG EMISSIONS

                                  FY2024          Prior Year
  Scope 1                         49.0 tCO₂e      Base year
  Scope 2 (location-based)        68.4 tCO₂e      Base year
  Scope 2 (market-based)          68.4 tCO₂e      Base year *
  ──────────────────────────────────────────────
  Scope 1 + 2 total              117.4 tCO₂e

  * No renewable energy contract in place FY2024. Market-based = location-based.
    Renewable tariff procurement underway; market-based expected to reach 0 in FY2025.

  Scope 3 disclosed categories:
    Cat. 1 — Purchased goods & services    In progress (est. 180–240 tCO₂e) †
    Cat. 4 — Upstream transport            124.5 tCO₂e (FastFreight — received)
    Cat. 6 — Business travel (air)          14.8 tCO₂e
    Cat. 7 — Employee commuting             8.2 tCO₂e (survey estimate ±25%)
    Cat. 5 — Waste to landfill              2.1 tCO₂e
  ──────────────────────────────────────────────
  Scope 3 subtotal (disclosed):           149.6–209.6 tCO₂e

  † Spend-based estimate using EXIOBASE 3.8 (UK construction). Primary supplier
    data in collection; estimate to be replaced upon receipt.

  TOTAL GROSS GHG EMISSIONS:             267.0–327.0 tCO₂e (pending Cat. 1)

  GHG factors: UK DESNZ 2023. GWP: IPCC AR6 GWP100.
  Assurance: Limited assurance targeted for FY2025 accounts.

────────────────────────────────────────────────────────────────

E1-7 — GHG REMOVALS AND MITIGATION PROJECTS

No removals or mitigation projects currently active. Carbon credit procurement
for 142 tCO₂e residual under evaluation. Only Verra VCS and Gold Standard credits
are under consideration, consistent with VCMI Claims Code of Practice (2023).

────────────────────────────────────────────────────────────────

E1-8 — INTERNAL CARBON PRICING

Internal carbon pricing not currently implemented. Shadow carbon price of
£50–80/tCO₂e proposed for FY2025 investment appraisal (in line with UK
Government Green Book supplementary guidance).

────────────────────────────────────────────────────────────────

DATA QUALITY AND AI TRANSPARENCY (EU AI Act Art. 52)

All AI-assisted calculations are labelled ✦ ACE in supporting workings.
Scope 3 Category 1 interim figures are spend-based estimates, clearly flagged.
Data quality tier assessment per CSRD ESRS E1 Appendix A:
  Scope 1+2: Tier 1 — verified primary data
  Scope 3 Cat. 6 & 5: Tier 2 — activity data with published factors
  Scope 3 Cat. 1: Tier 3 — spend-based modelled estimate (in collection)

Prepared: ACE — Automated Carbon Engine
Reviewed by: [Sustainability Lead / Board sponsor]
Next full assurance review: FY2025 Annual Report`,

  "UK SDR / TCFD Report":
`UK SUSTAINABILITY DISCLOSURE REQUIREMENTS — TCFD-ALIGNED REPORT
Prepared under: FCA UK SDR / TCFD Recommendations (2021)
Reporting period: Financial Year 2024
Entity: Acme Corp Ltd | Sector: Construction | ~200 employees

────────────────────────────────────────────────────────────────

PILLAR 1 — GOVERNANCE

Board oversight:
The Board of Directors maintains oversight of climate-related risks and
opportunities at each quarterly Board meeting. A designated Board member holds
responsibility for sustainability and ESG matters. Climate risk has been formally
incorporated into the company's enterprise risk register from FY2024.

Management role:
Day-to-day climate management is delegated to the Head of Operations, supported
by the ACE (Automated Carbon Engine) platform for real-time emissions monitoring,
compliance tracking and regulatory reporting. Material climate-related decisions
are escalated to Board level.

────────────────────────────────────────────────────────────────

PILLAR 2 — STRATEGY

Climate-related risks and opportunities identified (FY2024 assessment):

PHYSICAL RISKS:
  Acute: Increased frequency of extreme weather events affecting UK construction
  site operations. Assessed as medium likelihood, medium financial impact by 2030.
  Relevant sites: all outdoor construction operations.

  Chronic: Rising summer temperatures affecting outdoor worker productivity and
  concrete curing conditions. Low-medium likelihood over 10-year horizon.

TRANSITION RISKS:
  Policy (HIGH): Tightening of UK building regulations (Future Homes Standard,
  PAS 2035) requiring lower-carbon construction methods. Material capex implications
  for supply chain by 2026–2027.

  Market (MEDIUM): Growing client demand for embodied carbon reporting (LETI Carbon
  Targets, RIBA 2030 Climate Challenge). Revenue risk if supply chain carbon data
  unavailable for Tier 1 contractor bids.

  Technology (MEDIUM): Electrification of construction equipment fleet. Capital
  investment required 2025–2030. Risk of stranded diesel assets post-2030.

OPPORTUNITIES:
  • Early SECR and CSRD compliance creates competitive advantage in public sector
    procurement (PPN 06/21 mandates carbon reduction plans for suppliers >£5M spend)
  • Green Skills & low-carbon construction specification as differentiator for
    higher-margin public and institutional contracts

Scenario analysis (qualitative — FY2024):
  1.5°C scenario: Accelerated transition costs (fleet, supply chain) partially
  offset by compliance advantage and green contract pipeline growth.
  4°C scenario: Physical risk materialises post-2035; supply chain disruption from
  climate-exposed material suppliers increases; insurance cost uplift likely.

────────────────────────────────────────────────────────────────

PILLAR 3 — RISK MANAGEMENT

Identification: Annual enterprise risk review incorporating climate physical and
transition risk assessment. ACE platform flags compliance gaps and emission
anomalies continuously.

Assessment: Risks assessed against likelihood and financial materiality across
1, 5 and 10-year horizons. High-rated risks reviewed at each Board meeting.

Integration: Climate risk fully integrated into procurement, capital expenditure,
and operational decisions from FY2025. Green procurement criteria added to
supplier qualification process.

────────────────────────────────────────────────────────────────

PILLAR 4 — METRICS AND TARGETS

GHG Emissions (FY2024):
  Scope 1:                   49.0 tCO₂e
  Scope 2 (location-based):  68.4 tCO₂e
  Scope 2 (market-based):    68.4 tCO₂e
  Scope 3 (partial):         25.1 tCO₂e
  Total energy consumed:    457.7 MWh

Intensity: tCO₂e per £1M revenue (denominator pending finance confirmation)

Targets:
  Near-term: 50% absolute Scope 1+2 reduction by 2030 (vs FY2024 base year)
  Long-term: Net zero by 2040 (Scope 1+2); net zero by 2050 (all scopes)
  Alignment: Consistent with SBTi 1.5°C pathway. Formal SBTi submission
  planned for FY2025 following second year of verified data.

────────────────────────────────────────────────────────────────

AI transparency: All calculated values labelled per EU AI Act Art. 52
Review status: Draft — subject to Board approval and external assurance
Prepared: ACE — Automated Carbon Engine | FY2024`,

  "GHG Protocol Inventory":
`GHG PROTOCOL CORPORATE STANDARD — EMISSIONS INVENTORY
Organisation: Acme Corp Ltd
Reporting Period: January–December 2024
Standard: GHG Protocol Corporate Accounting and Reporting Standard (Revised Ed.)
Boundary approach: Operational control

────────────────────────────────────────────────────────────────

SECTION 1 — ORGANISATIONAL BOUNDARY

Operational control approach applied. All operations over which Acme Corp Ltd
exercises financial and operational control are included. Joint ventures where
the company does not hold operational control are excluded. No significant changes
to organisational boundary occurred in FY2024.

────────────────────────────────────────────────────────────────

SECTION 2 — SCOPE 1: DIRECT EMISSIONS

Source                        Amount            Factor                tCO₂e
──────────────────────────────────────────────────────────────────────────────
Natural gas (space heating)   145.2 MWh         0.184 kgCO₂e/kWh     26.7
Fleet — diesel vehicles       8,420 litres       2.651 kgCO₂e/litre   22.3
──────────────────────────────────────────────────────────────────────────────
TOTAL SCOPE 1                                                         49.0

Factor source: UK DESNZ Conversion Factors 2023 edition.
GHGs included: CO₂, CH₄, N₂O (reported as CO₂e, IPCC AR6 GWP100).
Verification: Verified against utility invoices and fleet mileage logs.

────────────────────────────────────────────────────────────────

SECTION 3 — SCOPE 2: ENERGY INDIRECT EMISSIONS

Source             Method           Amount        Factor               tCO₂e
──────────────────────────────────────────────────────────────────────────────
Grid electricity   Location-based   312.5 MWh     0.219 kgCO₂e/kWh   68.4
Grid electricity   Market-based     312.5 MWh     0.219 kgCO₂e/kWh   68.4
──────────────────────────────────────────────────────────────────────────────
TOTAL SCOPE 2 (LOCATION)                                              68.4
TOTAL SCOPE 2 (MARKET)                                                68.4

Note: No renewable electricity contract in place FY2024; location equals market.
GHG Protocol Scope 2 Guidance (2015) requires dual reporting — both provided.
Action: Renewable tariff procurement will reduce market-based to 0 tCO₂e in FY2025.

────────────────────────────────────────────────────────────────

SECTION 4 — SCOPE 3: VALUE CHAIN EMISSIONS

Category    Description                     tCO₂e       Status
──────────────────────────────────────────────────────────────────────────────
Cat. 1      Purchased goods & services      In progress  Primary data requested
Cat. 4      Upstream transport              124.5        Received (FastFreight)
Cat. 6      Business travel (air)           14.8         Verified (24 flights)
Cat. 7      Employee commuting               8.2         Estimated (85 employees)
Cat. 5      Waste to landfill                2.1         Verified (4.2 tonnes)
──────────────────────────────────────────────────────────────────────────────
TOTAL SCOPE 3 (DISCLOSED CATEGORIES)       149.6        Partial

Materiality screening: Category 1 assessed material (construction supply chain
typically >40% of Scope 3). Full data collection in active progress.

────────────────────────────────────────────────────────────────

SECTION 5 — INVENTORY SUMMARY

                          tCO₂e       % of reported total
  Scope 1                  49.0       34.4%
  Scope 2 (location)       68.4       48.0%
  Scope 3 (partial)        25.1       17.6%
  ──────────────────────────────────────────
  TOTAL REPORTED           142.5      100.0%

  Note: Excludes Scope 3 Category 1 (supply chain data in collection).
  Full inventory expected to exceed 290 tCO₂e once Category 1 is complete.

────────────────────────────────────────────────────────────────

SECTION 6 — METHODOLOGY AND DATA QUALITY

Emission factors used:
  Stationary combustion:    UK DESNZ 2023 (kgCO₂e/kWh)
  Transport fuels:          UK DESNZ 2023 (kgCO₂e/litre)
  Grid electricity:         UK DESNZ 2023 (0.219 kgCO₂e/kWh, location-based)
  Air travel:               UK DESNZ / BEIS 2023 average per passenger per km
  Waste:                    UK DESNZ 2023 waste disposal factors

GWP values applied (IPCC AR6, GWP100):
  CO₂: 1.0   |   CH₄: 29.8   |   N₂O: 273.0

Data quality assessment:
  Scope 1:             HIGH — verified from primary utility invoices, meter reads
  Scope 2:             HIGH — verified from electricity bills
  Scope 3 Cat. 6 air:  MEDIUM — flight count verified; km-based calc recommended
  Scope 3 Cat. 7:      MEDIUM — travel survey estimate, ±25% uncertainty
  Scope 3 Cat. 1:      NOT YET AVAILABLE — spend-based estimate available interim

────────────────────────────────────────────────────────────────

SECTION 7 — BASE YEAR AND RECALCULATION POLICY

Base year: FY2024 (first year of reporting)

Recalculation policy: Base year recalculation triggered by:
  (a) Acquisitions or divestments representing >5% of reported emissions
  (b) Material changes to calculation methodology or emission factors
  (c) Discovery of significant errors (>5% of base year total)
  (d) Changes to the operational control boundary

────────────────────────────────────────────────────────────────

Prepared by: ACE — Automated Carbon Engine
AI calculation transparency: All factor applications labelled per EU AI Act Art. 52
Next review: FY2025 Annual GHG Inventory (Q1 2026)
Assurance: Self-assessed FY2024. Third-party limited assurance recommended FY2025.`
};

// ─── AI ENGINE ────────────────────────────────────────────────────────────────
const sleep = ms => new Promise(r => setTimeout(r, ms));

function matchChatResponse(text) {
  const t = text.toLowerCase();
  if (/87|secr.*score|score.*low|score.*87|why.*score|score.*missing/.test(t))
    return MOCK_CHAT_RESPONSES.secr_score;
  if (/scope.?3|supply chain|category.?1|what.*urgent|urgently.*need|missing.*data|data.*need/.test(t))
    return MOCK_CHAT_RESPONSES.scope3;
  if (/market.based|market based|scope.?2.*market|renewable|rego|green.*tar|green.*elec/.test(t))
    return MOCK_CHAT_RESPONSES.market_scope2;
  if (/auditor|audit|what.*tell|explain.*miss|missing.*supplier|how.*explain/.test(t))
    return MOCK_CHAT_RESPONSES.auditor;
  if (/csrd.*sdr|sdr.*csrd|csrd.*tcfd|tcfd.*csrd|difference|compare.*framework|esrs.*tcfd|sdr.*esrs/.test(t))
    return MOCK_CHAT_RESPONSES.csrd_sdr;
  if (/science.based|sbt|sbti|net.?zero|target|reduction.*target|how.*reduce/.test(t))
    return MOCK_CHAT_RESPONSES.sbt;
  if (/credit|offset|purchase.*carbon|buy.*carbon|kariba|cookstove|139|142/.test(t))
    return MOCK_CHAT_RESPONSES.credits;
  if (/brsr|india|sebi|indian/.test(t))
    return MOCK_CHAT_RESPONSES.brsr;
  if (/intensity|ratio|revenue|denominator|per.*million/.test(t))
    return MOCK_CHAT_RESPONSES.intensity;
  return MOCK_CHAT_RESPONSES.default;
}

async function getAIResponse(messages, _systemPrompt, reportType = null) {
  if (reportType) {
    // Pre-written reports — simulate generation with realistic delay
    await sleep(1800 + Math.random() * 900);
    return PRE_WRITTEN_REPORTS[reportType] || "Report content unavailable. Please try again.";
  }
  // Chat — keyword match with human-feel delay
  const lastMsg = messages[messages.length - 1]?.content || "";
  const response = matchChatResponse(lastMsg);
  await sleep(900 + Math.random() * 1100);
  return response;
}

// ─── SMALL COMPONENTS ────────────────────────────────────────────────────────
function Ring({pct, color}) {
  const r=30, c=2*Math.PI*r, fill=(pct/100)*c;
  return (
    <div className="ring-wrap">
      <svg width="72" height="72" viewBox="0 0 72 72">
        <circle cx="36" cy="36" r={r} fill="none" stroke="var(--bg3)" strokeWidth="6"/>
        <circle cx="36" cy="36" r={r} fill="none" stroke={color} strokeWidth="6"
          strokeDasharray={`${fill} ${c}`} strokeLinecap="round"/>
      </svg>
      <div className="ring-txt" style={{color}}>{pct}%</div>
    </div>
  );
}
function AiTag() { return <span className="ai-tag">✦ ACE</span>; }
function HTag()  { return <span className="h-tag">👤 Manual</span>; }
function StatusBadge({s}) {
  const m={verified:["bg","✓ Verified"],pending:["ba","⏳ Pending"],missing:["br","✗ Missing"],estimated:["bgr","~ Estimate"],received:["bg","✓ Received"],sent:["bb","→ Sent"]};
  const [cls,lbl]=m[s]||["bgr",s];
  return <span className={`badge ${cls}`}>{lbl}</span>;
}

// ─── DASHBOARD ───────────────────────────────────────────────────────────────
function Dashboard({setPage}) {
  const total=EMISSIONS.reduce((s,e)=>s+(e.tco2e||0),0);
  const s1=EMISSIONS.filter(e=>e.scope===1).reduce((s,e)=>s+(e.tco2e||0),0);
  const s2=EMISSIONS.filter(e=>e.scope===2).reduce((s,e)=>s+(e.tco2e||0),0);
  const s3=EMISSIONS.filter(e=>e.scope===3).reduce((s,e)=>s+(e.tco2e||0),0);
  return (
    <div className="fade">
      <div className="card mb22" style={{padding:"11px 18px",display:"flex",alignItems:"center",gap:20,flexWrap:"wrap",marginBottom:22}}>
        <div style={{display:"flex",alignItems:"center",gap:8}}>
          <span style={{color:"var(--ace)",fontSize:15}}>✦</span>
          <span style={{fontSize:12,fontWeight:700,color:"var(--text)"}}>ACE Engine Active</span>
          <span className="badge b-ai" style={{fontSize:9}}>EU AI Act compliant</span>
        </div>
        {[["Calculations automated","99.2%","var(--ace)"],["Data points processed","14,847","var(--text)"],["Gaps detected","4","var(--red)"],["Supplier requests","3 pending","var(--amber)"]].map(([l,v,c])=>(
          <div key={l}>
            <div style={{fontSize:9,color:"var(--text3)",textTransform:"uppercase",letterSpacing:".06em"}}>{l}</div>
            <div style={{fontSize:14,fontWeight:700,color:c,marginTop:1}}>{v}</div>
          </div>
        ))}
        <div style={{marginLeft:"auto",fontSize:10,color:"var(--text3)"}}>AI values labelled <AiTag/> throughout</div>
      </div>
      <div className="metrics">
        {[
          {l:"Total Emissions YTD",v:total.toFixed(1),sub:"tCO₂e · Jan 2024",cls:"g",ai:true},
          {l:"SECR Compliance",v:"87%",sub:"UK legal obligation",cls:"b",ai:false},
          {l:"CSRD Readiness",v:"68%",sub:"4 gaps to close",cls:"a",ai:true},
          {l:"Credits Needed",v:"142",sub:"tCO₂e residual offset",cls:"r",ai:true},
        ].map(m=>(
          <div key={m.l} className={`mc ${m.cls}`}>
            <div className="mc-label">{m.l}</div>
            <div className="mc-val">{m.v}</div>
            <div className="mc-sub">{m.sub}</div>
            <div className="mc-foot">{m.ai?<><span className="ai-pill">✦ ACE</span>AI-calculated</>:<><span style={{fontSize:9,color:"var(--blue)"}}>👤</span>Deterministic</>}</div>
          </div>
        ))}
      </div>
      <div className="g2 mb22" style={{marginBottom:22}}>
        <div className="card">
          <div className="shdr"><div><div className="stitle">Scope Breakdown</div><div className="ssub">GHG Protocol · Jan 2024</div></div></div>
          {[{l:"Scope 1 — Direct",v:s1,c:"var(--red)"},{l:"Scope 2 — Electricity",v:s2,c:"var(--amber)"},{l:"Scope 3 — Value chain",v:s3,c:"var(--blue)"}].map(b=>(
            <div className="bar-row" key={b.l}>
              <div className="bar-hd"><span style={{color:"var(--text2)"}}>{b.l}</span><span style={{fontWeight:600,color:"var(--text)"}}>{b.v.toFixed(1)} tCO₂e</span></div>
              <div className="bar-track"><div className="bar-fill" style={{width:`${(b.v/total)*100}%`,background:b.c}}/></div>
            </div>
          ))}
          <button className="btn btn-ghost btn-sm" style={{marginTop:12}} onClick={()=>setPage("emissions")}>View full log →</button>
        </div>
        <div className="card">
          <div className="shdr">
            <div><div className="stitle">Compliance Overview</div><div className="ssub">All frameworks · live</div></div>
            <button className="btn btn-out btn-sm" onClick={()=>setPage("compliance")}>Details</button>
          </div>
          <div style={{display:"grid",gridTemplateColumns:"repeat(4,1fr)",gap:8,textAlign:"center"}}>
            {[{n:"SECR",pct:87,c:"var(--ace)"},{n:"CSRD",pct:68,c:"var(--amber)"},{n:"UK SDR",pct:72,c:"var(--amber)"},{n:"GHG Pro",pct:81,c:"var(--ace)"}].map(f=>(
              <div key={f.n}><Ring pct={f.pct} color={f.c}/><div style={{fontSize:10,color:"var(--text2)",marginTop:4}}>{f.n}</div></div>
            ))}
          </div>
        </div>
      </div>
      <div className="card mb22" style={{marginBottom:22}}>
        <div className="shdr">
          <div><div className="stitle">Emissions Log</div><div className="ssub">ACE optimization actions included</div></div>
          <button className="btn btn-ace btn-sm" onClick={()=>setPage("ingest")}>+ Add Data</button>
        </div>
        <div className="tbl-wrap">
          <table>
            <thead><tr>
              <th>Category</th><th>Scope</th><th>tCO₂e</th><th>Status</th><th>ACE Action <AiTag/></th>
            </tr></thead>
            <tbody>
              {EMISSIONS.map(e=>(
                <tr key={e.id}>
                  <td className="td-bold">{e.cat}</td>
                  <td><span className={`sp s${e.scope}`}>Scope {e.scope}</span></td>
                  <td className="td-mono">{e.tco2e?.toFixed(1)||<span style={{color:"var(--red)"}}>Missing</span>}</td>
                  <td><StatusBadge s={e.status}/></td>
                  <td>{e.status==="missing"
                    ?<button className="btn btn-danger btn-sm" onClick={()=>setPage("suppliers")}>⬡ Send Supplier Request</button>
                    :<div className="action-tip">{e.ai&&"✦ "}{e.action}</div>}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      <div className="alert alert-r">
        <span style={{fontSize:14,flexShrink:0}}>✗</span>
        <div><strong style={{color:"var(--red)"}}>Critical: Scope 3 supply chain data missing.</strong> Required by CSRD ESRS E1 and recommended by SECR.{" "}
          <button className="btn btn-out btn-sm" style={{marginLeft:6}} onClick={()=>setPage("suppliers")}>Send automated requests →</button>
        </div>
      </div>
    </div>
  );
}

// ─── EMISSIONS LOG ───────────────────────────────────────────────────────────
function EmissionsPage() {
  const [filter, setFilter] = useState("All");
  const total=EMISSIONS.reduce((s,e)=>s+(e.tco2e||0),0);
  const rows = filter==="All" ? EMISSIONS : EMISSIONS.filter(e=>`Scope ${e.scope}`===filter);
  return (
    <div className="fade card">
      <div className="shdr">
        <div><div className="stitle">Full Emissions Log</div><div className="ssub">GHG Protocol · All scopes · Jan 2024</div></div>
        <div style={{display:"flex",gap:8}}>
          <select className="fi" style={{width:"auto",padding:"5px 10px",fontSize:11}} value={filter} onChange={e=>setFilter(e.target.value)}>
            <option>All</option><option>Scope 1</option><option>Scope 2</option><option>Scope 3</option>
          </select>
          <button className="btn btn-out btn-sm">Export CSV</button>
        </div>
      </div>
      <div className="tbl-wrap">
        <table>
          <thead><tr>
            <th>Category</th><th>Scope</th><th>Amount</th>
            <th>Factor <AiTag/></th><th>tCO₂e <AiTag/></th>
            <th>Source <HTag/></th><th>Status</th><th>ACE Action</th>
          </tr></thead>
          <tbody>
            {rows.map(e=>(
              <tr key={e.id}>
                <td className="td-bold">{e.cat}</td>
                <td><span className={`sp s${e.scope}`}>Scope {e.scope}</span></td>
                <td>{e.amount||<span style={{color:"var(--red)"}}>Missing</span>}</td>
                <td style={{fontFamily:"var(--mono)",fontSize:11,color:"var(--text3)"}}>{e.factor}</td>
                <td className="td-mono">{e.tco2e?.toFixed(2)||<span className="badge br">✗</span>}</td>
                <td>{e.src}</td>
                <td><StatusBadge s={e.status}/></td>
                <td><div className="action-tip" style={{fontSize:11}}>{e.ai&&<span>✦ </span>}{e.action}</div></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div style={{borderTop:"1px solid var(--border)",marginTop:12,paddingTop:12,display:"flex",justifyContent:"space-between",fontSize:12}}>
        <span style={{color:"var(--text3)"}}>Factors: UK DESNZ 2023 · IPCC AR6 · GHG Protocol</span>
        <span style={{fontWeight:700,color:"var(--text)"}}>Total: {total.toFixed(2)} tCO₂e</span>
      </div>
    </div>
  );
}

// ─── SECR PAGE ───────────────────────────────────────────────────────────────
function SECRPage({setPage}) {
  const [generating, setGenerating] = useState(false);
  const [report, setReport] = useState("");

  const generate = async () => {
    setGenerating(true);
    const r = await getAIResponse(
      [{role:"user",content:"Generate SECR Directors Report"}],
      "",
      "SECR Directors' Report Section"
    );
    setReport(r);
    setGenerating(false);
  };

  return (
    <div className="fade">
      <div className="alert alert-b mb22" style={{marginBottom:22}}>
        <span style={{fontSize:14,flexShrink:0}}>⚖</span>
        <div><strong style={{color:"var(--blue)"}}>SECR is your most immediate UK legal obligation.</strong> SI 2018/1030 requires large UK companies (250+ employees OR £36M+ turnover OR £18M+ balance sheet) to include energy and carbon data in their Directors' Report.</div>
      </div>
      <div className="g2 mb22" style={{marginBottom:22}}>
        <div className="card">
          <div className="shdr">
            <div><div className="stitle">SECR Readiness</div><div className="ssub">SI 2018/1030 · Companies Act 2006</div></div>
            <Ring pct={87} color="var(--ace)"/>
          </div>
          {[
            {req:"Scope 1 — Gas & fuel combustion",s:"verified",note:"26.7 tCO₂e · DESNZ 2023"},
            {req:"Scope 2 — Purchased electricity",s:"verified",note:"68.4 tCO₂e · location-based · 312.5 MWh"},
            {req:"Scope 3 — Material categories",s:"estimated",note:"Partial — supply chain missing"},
            {req:"Energy intensity ratio",s:"pending",note:"Revenue denominator needed from finance"},
            {req:"Prior year comparison",s:"missing",note:"First year — base year to be set"},
            {req:"Energy efficiency measures",s:"verified",note:"3 actions documented"},
            {req:"Methodology statement",s:"verified",note:"GHG Protocol + DESNZ 2023"},
          ].map(r=>(
            <div className="req-row" key={r.req}>
              <div className="req-label">
                <div>{r.req}</div>
                <div className="req-note">{r.note}</div>
              </div>
              <StatusBadge s={r.s==="verified"?"verified":r.s==="missing"?"missing":"estimated"}/>
            </div>
          ))}
        </div>
        <div>
          <div className="card mb14" style={{marginBottom:14}}>
            <div className="stitle" style={{marginBottom:12}}>Framework comparison</div>
            <div className="tbl-wrap">
              <table style={{fontSize:11}}>
                <thead><tr><th>Framework</th><th>Who</th><th>Scope</th><th>When</th></tr></thead>
                <tbody>
                  {[
                    ["SECR","250+ staff OR £36M+ turnover","Scope 1+2 req, 3 rec","Directors' Report"],
                    ["TCFD","Premium LSE listed firms","All scopes + risk","Annual report"],
                    ["UK SDR","TCFD + asset managers","All + scenarios","2024–26 rollout"],
                    ["CSRD","EU ops / EU parent subs","Full ESG all scopes","2025–28 phased"],
                  ].map(([f,w,s,d])=>(
                    <tr key={f}><td className="td-bold">{f}</td><td>{w}</td><td>{s}</td><td>{d}</td></tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
          <div className="card">
            <div className="stitle" style={{marginBottom:8}}>SECR filing summary <AiTag/></div>
            <div style={{fontSize:13,color:"var(--text2)",lineHeight:1.7,marginBottom:14}}>
              Total energy: <strong style={{color:"var(--text)"}}>457.7 MWh</strong> (312.5 MWh electricity + 145.2 MWh gas).
              Total Scope 1+2: <strong style={{color:"var(--text)"}}>95.1 tCO₂e</strong>.
              Add your revenue figure and ACE generates the complete Directors' Report section instantly.
            </div>
            {!report && !generating && (
              <button className="btn btn-ace btn-sm" onClick={generate}>✦ Generate Directors' Report section</button>
            )}
            {generating && (
              <div style={{display:"flex",alignItems:"center",gap:8,fontSize:12,color:"var(--text2)"}}>
                <div className="spin"/>Drafting your SECR narrative...
              </div>
            )}
            {report && (
              <div>
                <div className="report-out" style={{marginBottom:12}}>{report}</div>
                <div style={{display:"flex",gap:8}}>
                  <button className="btn btn-ace btn-sm">Download .docx</button>
                  <button className="btn btn-ghost btn-sm" onClick={()=>setReport("")}>Regenerate</button>
                </div>
                <div className="alert alert-a" style={{marginTop:12}}>
                  <span style={{flexShrink:0}}>⚠</span>
                  <div>AI-generated draft (EU AI Act Art. 52). Have a qualified accountant review before filing with Companies House.</div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── INGEST PAGE ─────────────────────────────────────────────────────────────
function IngestPage() {
  const [tab, setTab] = useState("csv");
  const [over, setOver] = useState(false);
  const [proc, setProc] = useState(false);
  const [done, setDone] = useState(false);
  const [manualScope, setManualScope] = useState("1");
  const [saved, setSaved] = useState(false);
  const CATEGORIES = {
    "1":["Natural Gas","Diesel (fleet)","Petrol (fleet)","LPG","Process emissions"],
    "2":["Grid electricity (UK)","Grid electricity (EU)","District heating","Steam/cooling"],
    "3":["Business air travel","Employee commuting","Purchased goods & services","Waste","Business travel (rail)","Upstream transport"],
  };
  const doUpload = () => { setDone(false); setProc(true); setTimeout(()=>{setProc(false);setDone(true);},2000); };
  return (
    <div className="fade">
      <div className="itabs">
        {[
          {id:"csv",icon:"📄",label:"CSV / Excel",tier:"free",tl:"Free"},
          {id:"manual",icon:"✏️",label:"Manual Entry",tier:"free",tl:"Free"},
          {id:"api",icon:"⚡",label:"API Connect",tier:"pro",tl:"Pro — £299/mo"},
          {id:"erp",icon:"🔗",label:"ERP Integration",tier:"ent",tl:"Enterprise"},
        ].map(t=>(
          <div key={t.id} className={`itab ${tab===t.id?"active":""}`} onClick={()=>{setTab(t.id);setDone(false);setProc(false);}}>
            {t.icon} {t.label} <span className={`tier-tag t-${t.tier}`}>{t.tl}</span>
          </div>
        ))}
      </div>
      {tab==="csv" && (
        <div className="fade g2">
          <div>
            {!proc && !done && (
              <div className={`drop-zone ${over?"over":""}`}
                onDragOver={e=>{e.preventDefault();setOver(true);}}
                onDragLeave={()=>setOver(false)}
                onDrop={e=>{e.preventDefault();setOver(false);doUpload();}}
                onClick={doUpload}>
                <div style={{fontSize:32,marginBottom:12}}>📂</div>
                <div style={{fontSize:14,fontWeight:600,color:"var(--text)",marginBottom:5}}>Drop file here or click to upload</div>
                <div style={{fontSize:12,color:"var(--text3)",marginBottom:14}}>CSV, XLSX, XLS · Max 50MB · Any column format</div>
                <div style={{display:"flex",gap:6,justifyContent:"center",flexWrap:"wrap"}}>
                  {["energy bills","fleet logs","utility invoices","travel records","waste reports"].map(t=>(
                    <span key={t} className="badge bgr">{t}</span>
                  ))}
                </div>
              </div>
            )}
            {proc && (
              <div className="card" style={{textAlign:"center",padding:40}}>
                <div style={{marginBottom:16}}><div className="spin" style={{width:32,height:32,margin:"0 auto"}}/></div>
                <div style={{fontSize:14,fontWeight:600,color:"var(--text)",marginBottom:8}}>ACE processing your file...</div>
                <div style={{fontSize:12,color:"var(--text3)"}}>Detecting columns → Mapping to GHG categories → Applying DESNZ factors</div>
                <div className="prog" style={{marginTop:16}}><div className="prog-fill" style={{width:"70%"}}/></div>
              </div>
            )}
            {done && (
              <div className="fade">
                <div className="alert alert-g mb14" style={{marginBottom:14}}>
                  <span>✓</span><div><strong>Processed successfully.</strong> 24 rows imported · 2 flagged for review · all factors applied <AiTag/></div>
                </div>
                <div className="card">
                  <div className="stitle" style={{marginBottom:10}}>Column mapping results <AiTag/></div>
                  <div className="tbl-wrap">
                    <table style={{fontSize:12}}>
                      <thead><tr><th>Column detected</th><th>Mapped to</th><th>Factor applied</th><th>Confidence</th></tr></thead>
                      <tbody>
                        {[
                          ["kWh","Electricity Scope 2","DESNZ 0.219","99%"],
                          ["Diesel (L)","Fleet fuel Scope 1","DESNZ 2.651","97%"],
                          ["Gas (m³)","Natural gas Scope 1","DESNZ 2.048","94%"],
                          ["Flights","Air travel Scope 3","BEIS 0.255","88%"],
                          ["Date","Reporting period","—","100%"],
                        ].map(([a,b,c,d])=>(
                          <tr key={a}>
                            <td style={{fontFamily:"var(--mono)",fontSize:11}}>{a}</td>
                            <td className="td-bold">{b}</td>
                            <td style={{fontFamily:"var(--mono)",fontSize:11,color:"var(--text3)"}}>{c}</td>
                            <td><span className="badge bg">{d}</span></td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                  <div style={{marginTop:14,display:"flex",gap:8}}>
                    <button className="btn btn-ace btn-sm">Confirm import</button>
                    <button className="btn btn-ghost btn-sm" onClick={()=>setDone(false)}>Re-upload</button>
                  </div>
                </div>
              </div>
            )}
          </div>
          <div>
            <div className="card card-sm mb14" style={{marginBottom:14}}>
              <div style={{fontSize:13,fontWeight:600,color:"var(--text)",marginBottom:10}}>Auto-applied factors <AiTag/></div>
              {[["UK DESNZ 2023","Grid electricity, gas, fuel"],["IPCC AR6","GWP100 for all GHGs"],["GHG Protocol","Scope boundary rules"],["EFRAG ESRS E1","CSRD field mapping"],["SECR SI 2018/1030","UK statutory factors"]].map(([a,b])=>(
                <div key={a} style={{display:"flex",justifyContent:"space-between",padding:"6px 0",borderBottom:"1px solid var(--border)",fontSize:12}}>
                  <span style={{fontWeight:600,color:"var(--text)"}}>{a}</span>
                  <span style={{color:"var(--text3)",textAlign:"right",fontSize:11}}>{b}</span>
                </div>
              ))}
            </div>
            <div className="card card-sm">
              <div style={{fontSize:12,color:"var(--text3)",lineHeight:1.7}}>ACE reads any column names — no reformatting needed. All AI mappings are labelled and fully auditable per EU AI Act Art. 52.</div>
              <button className="btn btn-ghost btn-sm" style={{marginTop:10}}>↓ Download template CSV</button>
            </div>
          </div>
        </div>
      )}
      {tab==="manual" && (
        <div className="fade g2">
          <div className="card">
            <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:16}}>
              <div className="stitle">Add emission record</div>
              <HTag/>
            </div>
            <div className="fg">
              <label className="fl">Emission scope</label>
              <select className="fi" value={manualScope} onChange={e=>setManualScope(e.target.value)}>
                <option value="1">Scope 1 — Direct (fuel, gas, owned vehicles)</option>
                <option value="2">Scope 2 — Purchased electricity & heat</option>
                <option value="3">Scope 3 — Value chain (travel, supply chain, waste)</option>
              </select>
            </div>
            <div className="fg">
              <label className="fl">Category</label>
              <select className="fi">{(CATEGORIES[manualScope]||[]).map(c=><option key={c}>{c}</option>)}</select>
            </div>
            <div className="fr">
              <div className="fg">
                <label className="fl">Amount</label>
                <input className="fi" type="number" placeholder="0.00" min="0"/>
              </div>
              <div className="fg">
                <label className="fl">Unit</label>
                <select className="fi">
                  <option>kWh</option><option>MWh</option><option>litres</option>
                  <option>m³</option><option>kg</option><option>tonnes</option><option>km</option>
                </select>
              </div>
            </div>
            <div className="fr">
              <div className="fg">
                <label className="fl">Period</label>
                <input className="fi" type="month" defaultValue="2024-01"/>
              </div>
              <div className="fg">
                <label className="fl">Site / Facility</label>
                <input className="fi" type="text" placeholder="HQ London"/>
              </div>
            </div>
            <div className="fg">
              <label className="fl">Evidence reference</label>
              <input className="fi" type="text" placeholder="Invoice #12345, meter reading, contractor report..."/>
            </div>
            {saved && <div className="alert alert-g mb14" style={{marginBottom:14}}>✓ Record saved · tCO₂e calculated · SECR and CSRD fields updated</div>}
            <button className="btn btn-ace" onClick={()=>{setSaved(true);setTimeout(()=>setSaved(false),3000);}}>Calculate & Save</button>
          </div>
          <div>
            <div className="card card-sm mb14" style={{marginBottom:14}}>
              <div style={{fontSize:13,fontWeight:600,color:"var(--text)",marginBottom:8}}>Why manual entry?</div>
              <div style={{fontSize:12,color:"var(--text3)",lineHeight:1.7}}>Manual entries are fully auditable. Each record tagged as human-entered per EU AI Act Art. 52. Emission factors still applied automatically by ACE.</div>
            </div>
            <div className="card card-sm">
              <div style={{fontSize:13,fontWeight:600,color:"var(--text)",marginBottom:8}}>Factor auto-selected <AiTag/></div>
              {[["UK DESNZ 2023","Gas, fuel, electricity"],["IPCC AR6","GWP100 values"],["GHG Protocol","Scope boundaries"],["SECR SI 2018/1030","UK statutory"]].map(([a,b])=>(
                <div key={a} style={{display:"flex",justifyContent:"space-between",padding:"5px 0",borderBottom:"1px solid var(--border)",fontSize:12}}>
                  <span style={{fontWeight:600,color:"var(--text)"}}>{a}</span>
                  <span style={{color:"var(--text3)"}}>{b}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
      {tab==="api" && (
        <div className="fade">
          <div className="alert alert-b mb22" style={{marginBottom:22}}>
            <span>⚡</span>
            <div><strong style={{color:"var(--blue)"}}>Pro Plan — £299/month.</strong> Connect live data sources. Auto-sync on schedule. No manual uploads needed.</div>
          </div>
          <div className="g2 mb22" style={{marginBottom:22}}>
            {[
              {n:"Energy Management System",i:"⚡",d:"Pull meter readings automatically",connected:false},
              {n:"Fleet Management (Samsara)",i:"🚗",d:"Live fuel consumption & mileage",connected:true},
              {n:"Travel booking (Concur / SAP)",i:"✈️",d:"Auto-import flight & rail emissions",connected:false},
              {n:"Waste contractor portal",i:"♻️",d:"Monthly tonnage sync",connected:false},
            ].map(s=>(
              <div key={s.n} className="card card-sm" style={{display:"flex",alignItems:"center",gap:12}}>
                <span style={{fontSize:22}}>{s.i}</span>
                <div style={{flex:1}}>
                  <div style={{fontSize:13,fontWeight:600,color:"var(--text)"}}>{s.n}</div>
                  <div style={{fontSize:11,color:"var(--text3)"}}>{s.d}</div>
                </div>
                <span className={`badge ${s.connected?"bg":"bgr"}`}>{s.connected?"✓ Connected":"Connect"}</span>
              </div>
            ))}
          </div>
          <div className="card">
            <div style={{fontSize:13,fontWeight:600,color:"var(--text)",marginBottom:8}}>Your API key</div>
            <div style={{display:"flex",gap:8}}>
              <input className="fi" style={{fontFamily:"var(--mono)",fontSize:12}} readOnly value="ack_live_••••••••••••••••••••••••"/>
              <button className="btn btn-out btn-sm">Reveal</button>
              <button className="btn btn-out btn-sm">Rotate</button>
            </div>
            <div style={{fontSize:12,color:"var(--text3)",marginTop:8}}>
              POST to <code style={{color:"var(--ace)",fontFamily:"var(--mono)"}}>https://api.projectace.io/v1/ingest</code>
            </div>
          </div>
        </div>
      )}
      {tab==="erp" && (
        <div className="fade card" style={{textAlign:"center",padding:44}}>
          <div style={{fontSize:30,marginBottom:14}}>🔗</div>
          <div style={{fontSize:15,fontWeight:600,color:"var(--text)",marginBottom:8}}>Enterprise ERP Integration</div>
          <div style={{fontSize:12,color:"var(--text3)",maxWidth:400,margin:"0 auto 22px",lineHeight:1.7}}>
            Native GL-code-to-emission-category mapping. Zero manual data entry. Auto-sync daily or monthly.
          </div>
          <div style={{display:"flex",gap:8,justifyContent:"center",flexWrap:"wrap",marginBottom:24}}>
            {["SAP S/4HANA","Oracle ERP","MS Dynamics 365","Workday","NetSuite"].map(e=>(
              <span key={e} className="badge bgr">{e}</span>
            ))}
          </div>
          <button className="btn btn-ace">Contact sales for Enterprise pricing</button>
        </div>
      )}
    </div>
  );
}

// ─── SUPPLIERS PAGE ───────────────────────────────────────────────────────────
function SuppliersPage() {
  const [sentList, setSentList] = useState([]);
  const [sending, setSending] = useState(null);
  const [sendAll, setSendAll] = useState(false);
  const doSend = (name) => {
    setSending(name);
    setTimeout(()=>{setSentList(p=>[...p,name]);setSending(null);},1500);
  };
  const doSendAll = () => {
    setSendAll(true);
    const missing = SUPPLIERS.filter(s=>s.status==="missing"&&!sentList.includes(s.name));
    missing.forEach((s,i)=>setTimeout(()=>setSentList(p=>[...p,s.name]),i*600+400));
  };
  const getStatus = (s) => sentList.includes(s.name) ? "sent" : s.status;
  return (
    <div className="fade">
      <div className="alert alert-a mb22" style={{marginBottom:22}}>
        <span style={{flexShrink:0}}>⬡</span>
        <div><strong style={{color:"var(--amber)"}}>Automated Supplier Requests</strong> — ACE identifies your Scope 3 Category 1 gaps and sends data request emails automatically. Suppliers receive a pre-filled GHG Protocol template. <AiTag/></div>
      </div>
      <div className="g2">
        <div>
          <div className="shdr">
            <div><div className="stitle">Supplier Data Status</div><div className="ssub">Scope 3 Category 1 — Purchased goods & services</div></div>
            <button className="btn btn-ace btn-sm" onClick={doSendAll} disabled={sendAll}>{sendAll?"Sent all ✓":"⬡ Send all missing"}</button>
          </div>
          {SUPPLIERS.map(s=>{
            const st = getStatus(s);
            const isSending = sending===s.name;
            return (
              <div className="sup-row" key={s.name}>
                <div className={`sup-dot ${st==="received"||st==="sent"?"sd-green":st==="pending"?"sd-amber":"sd-red"}`}/>
                <div style={{flex:1}}>
                  <div className="sup-name">{s.name}</div>
                  <div className="sup-cat">{s.cat} · Last request: {s.last}</div>
                </div>
                {s.tco2e && <div style={{fontSize:12,fontWeight:700,color:"var(--ace)",marginRight:8}}>{s.tco2e} tCO₂e</div>}
                <StatusBadge s={st}/>
                {(s.status==="missing"||s.status==="pending") && !sentList.includes(s.name) && (
                  <button className="btn btn-ace btn-sm" style={{marginLeft:8}} onClick={()=>doSend(s.name)} disabled={!!isSending}>
                    {isSending?<><div className="spin"/>Sending...</>:"Send"}
                  </button>
                )}
              </div>
            );
          })}
        </div>
        <div>
          <div className="card mb14" style={{marginBottom:14}}>
            <div style={{fontSize:13,fontWeight:600,color:"var(--text)",marginBottom:10}}>What suppliers receive <AiTag/></div>
            {["Pre-filled GHG Protocol data template (Excel)","Your CSRD Category 1 data requirements","Emission factor guide (DESNZ / IPCC AR6)","Submission portal link with deadline","Auto-reminders at 7, 14 and 30 days"].map(item=>(
              <div key={item} style={{display:"flex",gap:8,fontSize:12,color:"var(--text2)",padding:"5px 0",borderBottom:"1px solid var(--border)"}}>
                <span style={{color:"var(--ace)"}}>✓</span>{item}
              </div>
            ))}
          </div>
          <div className="card">
            <div style={{fontSize:13,fontWeight:600,color:"var(--text)",marginBottom:10}}>Coverage progress</div>
            <div className="bar-row">
              <div className="bar-hd"><span style={{fontSize:12,color:"var(--text2)"}}>Suppliers responded</span><span style={{fontSize:12,fontWeight:700,color:"var(--text)"}}>{1+sentList.length} / 5</span></div>
              <div className="bar-track"><div className="bar-fill" style={{width:`${Math.min(100,(1+sentList.length)/5*100)}%`}}/></div>
            </div>
            <div style={{fontSize:12,color:"var(--text3)",marginTop:6}}>CSRD requires ≥80% supply chain coverage for Scope 3 Cat. 1 disclosure.</div>
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── COMPLIANCE PAGE ──────────────────────────────────────────────────────────
function CompliancePage() {
  const FRAMEWORKS = [
    {name:"SECR",full:"Streamlined Energy and Carbon Reporting",color:"var(--ace)",score:87,reqs:[
      {l:"Scope 1 — direct combustion",s:"verified"},{l:"Scope 2 — purchased electricity",s:"verified"},
      {l:"Energy intensity ratio",s:"pending"},{l:"Prior year comparison",s:"missing"},
      {l:"Methodology statement",s:"verified"},{l:"Energy efficiency actions",s:"verified"},
    ]},
    {name:"CSRD / ESRS E1",full:"EU Corporate Sustainability Reporting Directive",color:"var(--amber)",score:68,reqs:[
      {l:"GHG emissions — Scope 1+2",s:"verified"},{l:"GHG emissions — Scope 3",s:"pending"},
      {l:"Supply chain (Category 1)",s:"missing"},{l:"Climate transition plan",s:"pending"},
      {l:"Physical climate risk",s:"missing"},{l:"Energy consumption & mix",s:"verified"},
    ]},
    {name:"UK SDR / TCFD",full:"UK Sustainability Disclosure Requirements",color:"var(--amber)",score:72,reqs:[
      {l:"Governance disclosures",s:"verified"},{l:"Strategy & scenario analysis",s:"pending"},
      {l:"Risk management process",s:"verified"},{l:"Scope 1+2 metrics & targets",s:"verified"},
      {l:"Scope 3 targets",s:"missing"},{l:"Net zero commitment",s:"pending"},
    ]},
    {name:"GHG Protocol",full:"Greenhouse Gas Protocol Corporate Standard",color:"var(--ace)",score:81,reqs:[
      {l:"Organisational boundary defined",s:"verified"},{l:"Scope 1 — all sources",s:"verified"},
      {l:"Scope 2 — location-based",s:"verified"},{l:"Scope 2 — market-based",s:"pending"},
      {l:"Scope 3 material categories",s:"pending"},{l:"Base year recalculation policy",s:"verified"},
    ]},
  ];
  return (
    <div className="fade">
      <div className="alert alert-b mb22" style={{marginBottom:22}}>
        <span style={{flexShrink:0}}>⚖</span>
        <div><strong style={{color:"var(--blue)"}}>Priority order: SECR first</strong> (legal obligation now) → GHG Protocol → UK SDR → CSRD. Don't try to fix everything at once.</div>
      </div>
      <div className="g2">
        {FRAMEWORKS.map(f=>(
          <div key={f.name} className="card">
            <div style={{display:"flex",gap:14,alignItems:"flex-start",marginBottom:16}}>
              <Ring pct={f.score} color={f.color}/>
              <div>
                <div style={{fontSize:14,fontWeight:700,color:"var(--text)"}}>{f.name}</div>
                <div style={{fontSize:11,color:"var(--text3)",marginTop:2}}>{f.full}</div>
                <div style={{fontSize:11,color:"var(--text3)",marginTop:4}}>
                  {f.reqs.filter(r=>r.s==="missing").length} gaps · {f.score}% compliant
                </div>
              </div>
            </div>
            {f.reqs.map(r=>(
              <div className="req-row" key={r.l}>
                <div className="req-label">{r.l}</div>
                <StatusBadge s={r.s==="verified"?"verified":r.s==="missing"?"missing":"estimated"}/>
              </div>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── REPORTS PAGE ─────────────────────────────────────────────────────────────
function ReportsPage() {
  const [gen, setGen] = useState(false);
  const [done, setDone] = useState(false);
  const [content, setContent] = useState("");
  const [activeReport, setActiveReport] = useState("");
  const REPORTS = [
    {name:"SECR Directors' Report Section",std:"SECR UK",ready:87,desc:"UK legal requirement — energy & carbon narrative for Directors' Report"},
    {name:"CSRD ESRS E1 Disclosure",std:"CSRD EU",ready:68,desc:"EU climate disclosure per ESRS E1 standard"},
    {name:"UK SDR / TCFD Report",std:"UK SDR",ready:72,desc:"UK Sustainability Disclosure Requirements aligned"},
    {name:"GHG Protocol Inventory",std:"GHG Pro",ready:81,desc:"Full Scope 1, 2 & 3 emissions inventory with methodology"},
  ];
  const generate = async (name) => {
    setActiveReport(name); setGen(true); setDone(false); setContent("");
    const r = await getAIResponse([{role:"user",content:name}], "", name);
    setContent(r); setGen(false); setDone(true);
  };
  return (
    <div className="fade">
      {!done && !gen && (
        <div className="g2 mb22" style={{marginBottom:22}}>
          {REPORTS.map(r=>(
            <div key={r.name} className="card" style={{display:"flex",flexDirection:"column"}}>
              <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",marginBottom:10}}>
                <div><div style={{fontSize:14,fontWeight:600,color:"var(--text)",marginBottom:3}}>{r.name}</div><div style={{fontSize:11,color:"var(--text3)"}}>{r.desc}</div></div>
                <span className="badge bgr" style={{flexShrink:0,marginLeft:8}}>{r.std}</span>
              </div>
              <div style={{fontSize:11,color:"var(--text3)",marginBottom:5}}>Data readiness</div>
              <div className="prog mb14" style={{marginBottom:14}}><div className="prog-fill" style={{width:`${r.ready}%`}}/></div>
              <button className="btn btn-ace btn-sm" style={{marginTop:"auto"}} onClick={()=>generate(r.name)}>✦ Generate with ACE</button>
            </div>
          ))}
        </div>
      )}
      {gen && (
        <div className="card" style={{textAlign:"center",padding:44}}>
          <div style={{marginBottom:18}}><div className="spin" style={{width:36,height:36,margin:"0 auto"}}/></div>
          <div style={{fontSize:14,fontWeight:600,color:"var(--text)",marginBottom:8}}>ACE drafting: {activeReport}</div>
          <div style={{fontSize:12,color:"var(--text3)"}}>Applying framework requirements · Mapping emission data · Generating regulatory language</div>
        </div>
      )}
      {done && content && (
        <div className="fade">
          <div className="card" style={{marginBottom:16}}>
            <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:16,flexWrap:"wrap",gap:8}}>
              <div>
                <div style={{fontSize:14,fontWeight:600,color:"var(--text)"}}>{activeReport} <AiTag/></div>
                <div style={{fontSize:11,color:"var(--text3)",marginTop:2}}>Generated {new Date().toLocaleDateString("en-GB")} · Review before filing</div>
              </div>
              <div style={{display:"flex",gap:8}}>
                <span className="badge ba">Draft — review required</span>
                <button className="btn btn-out btn-sm">Export PDF</button>
                <button className="btn btn-ace btn-sm">Download .docx</button>
              </div>
            </div>
            <div className="report-out">{content}</div>
            <div className="alert alert-a" style={{marginTop:14}}>
              <span style={{flexShrink:0}}>⚠</span>
              <div>AI-generated draft per EU AI Act Art. 52. Have a qualified sustainability consultant review before official submission. All figures sourced from your verified emission records.</div>
            </div>
          </div>
          <button className="btn btn-ghost btn-sm" onClick={()=>{setDone(false);setContent("");setGen(false);}}>← Generate another report</button>
        </div>
      )}
    </div>
  );
}

// ─── CREDITS PAGE ─────────────────────────────────────────────────────────────
function CreditsPage() {
  return (
    <div className="fade">
      <div className="alert alert-a mb22" style={{marginBottom:22}}>
        <span style={{flexShrink:0}}>◇</span>
        <div><strong style={{color:"var(--amber)"}}>142 tCO₂e residual after reduction targets.</strong> ACE matched 3 verified credits — only Verra VCS and Gold Standard. No greenwashing risk. <AiTag/></div>
      </div>
      <div className="g3 mb22" style={{marginBottom:22}}>
        {CREDITS.map(c=>(
          <div key={c.name} className="card">
            <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",marginBottom:10}}>
              <div style={{fontSize:26,fontWeight:700,color:"var(--ace)",lineHeight:1}}>{c.score}</div>
              <span className="badge b-ai">✦ ACE match</span>
            </div>
            <div style={{fontSize:14,fontWeight:600,color:"var(--text)",marginBottom:3}}>{c.name}</div>
            <div style={{fontSize:11,color:"var(--text3)"}}>{c.type} · {c.loc}</div>
            <div style={{fontSize:12,color:"var(--text3)",marginTop:6}}>Registry: <span style={{color:"var(--text2)"}}>{c.registry}</span></div>
            <div style={{fontSize:13,color:"var(--amber)",fontWeight:700,marginTop:6}}>{c.price}</div>
            <div style={{display:"flex",gap:5,flexWrap:"wrap",marginTop:10}}>
              {c.tags.map(t=><span key={t} className="badge bgr">{t}</span>)}
            </div>
            <div style={{marginTop:14,display:"flex",gap:8}}>
              <button className="btn btn-ace btn-sm">Get quote</button>
              <button className="btn btn-ghost btn-sm">Details</button>
            </div>
          </div>
        ))}
      </div>
      <div className="card">
        <div style={{fontSize:14,fontWeight:600,color:"var(--text)",marginBottom:8}}>How ACE scores credits <AiTag/></div>
        <div style={{display:"flex",gap:16,flexWrap:"wrap"}}>
          {[["Additionality","Would not happen without credit funding"],["Permanence","Long-term carbon storage verified"],["Co-benefits","UN SDG alignment score"],["Registry integrity","Only Verra VCS + Gold Standard"],["UK/EU acceptance","SECR and CSRD eligible"]].map(([a,b])=>(
            <div key={a} style={{flex:"1 1 160px"}}>
              <div style={{fontSize:12,fontWeight:600,color:"var(--ace)",marginBottom:2}}>{a}</div>
              <div style={{fontSize:11,color:"var(--text3)"}}>{b}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ─── AI PAGE ──────────────────────────────────────────────────────────────────
function AIPage() {
  const [msgs, setMsgs] = useState([{
    role:"ai",
    content:"I'm ACE — your Automated Carbon Engine assistant. I have full context of your emissions data, compliance scores across SECR, CSRD, UK SDR and GHG Protocol, and your supplier gaps.\n\nAsk me anything: explain a compliance gap, interpret a regulation, suggest reduction strategies, or prepare for an auditor's question. Type your question or pick one below."
  }]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const endRef = useRef(null);

  const scrollBottom = () => setTimeout(()=>endRef.current?.scrollIntoView({behavior:"smooth"}),50);

  const send = useCallback(async(text) => {
    const q = (text||input).trim();
    if (!q || loading) return;
    setInput("");
    const newMsgs = [...msgs, {role:"user",content:q}];
    setMsgs(newMsgs);
    setLoading(true);
    scrollBottom();
    const history = newMsgs.map(m=>({role:m.role==="ai"?"assistant":"user",content:m.content}));
    const reply = await getAIResponse(history, "");
    setMsgs(m=>[...m,{role:"ai",content:reply}]);
    setLoading(false);
    scrollBottom();
  }, [input, loading, msgs]);

  const SUGGESTIONS = [
    "Why is my SECR score only 87%?",
    "What Scope 3 data do I urgently need?",
    "How do I calculate market-based Scope 2?",
    "What should I tell my auditor about missing supply chain data?",
    "Explain CSRD ESRS E1 vs UK SDR differences",
    "How do I set a science-based emissions target?",
  ];

  return (
    <div className="fade">
      <div className="card" style={{pa:0,overflow:"hidden"}}>
        <div style={{padding:"12px 18px",borderBottom:"1px solid var(--border)",display:"flex",alignItems:"center",gap:10}}>
          <span style={{color:"var(--ace)",fontSize:15}}>✦</span>
          <span style={{fontSize:14,fontWeight:700,color:"var(--text)"}}>ACE Assistant</span>
          <span className="badge bg" style={{marginLeft:"auto"}}>Carbon & Compliance Expert</span>
          <span className="badge bgr" style={{fontSize:9}}>EU AI Act Art. 52</span>
        </div>
        <div className="chat-body">
          {msgs.map((m,i)=>(
            <div key={i} className={`msg ${m.role==="ai"?"msg-a":"msg-u"}`}>
              <div className="msg-lbl">{m.role==="ai"?"✦ ACE":"You"}</div>
              <div className="msg-bub" style={{whiteSpace:"pre-wrap"}}>{m.content}</div>
            </div>
          ))}
          {loading && (
            <div className="msg msg-a">
              <div className="msg-lbl">✦ ACE</div>
              <div className="msg-bub"><div className="dots"><span/><span/><span/></div></div>
            </div>
          )}
          <div ref={endRef}/>
        </div>
        {msgs.length <= 2 && (
          <div className="chat-suggestions">
            {SUGGESTIONS.map(s=>(
              <button key={s} className="btn btn-ghost btn-sm" style={{fontSize:11}} onClick={()=>send(s)}>{s}</button>
            ))}
          </div>
        )}
        <div className="chat-foot">
          <textarea
            className="chat-in" rows={2}
            placeholder="Ask ACE about your emissions, compliance gaps, SECR, CSRD, reduction strategies..."
            value={input}
            onChange={e=>setInput(e.target.value)}
            onKeyDown={e=>{ if(e.key==="Enter"&&!e.shiftKey){e.preventDefault();send();}}}
          />
          <button className="btn btn-ace" onClick={()=>send()} disabled={loading||!input.trim()}>
            {loading?<div className="spin"/>:"Send"}
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── APP SHELL ────────────────────────────────────────────────────────────────
export default function App() {
  const [page, setPage] = useState("dashboard");
  return (
    <>
      <style>{CSS}</style>
      <div className="app">
        <aside className="sidebar">
          <div className="logo-wrap">
            <div className="logo-row">
              <div className="logo-badge">ACE</div>
              <div>
                <div className="logo-name">Project ACE</div>
                <div className="logo-full">Automated Carbon Engine</div>
              </div>
            </div>
            <div className="engine-status">
              <div className="es-row">
                <span className="es-label">Engine status</span>
                <span className="es-val">● Active</span>
              </div>
              <div className="es-bar"><div className="es-fill" style={{width:"99%"}}/></div>
              <div className="es-caption">99.2% automated · 14,847 pts processed</div>
            </div>
          </div>
          <nav className="nav">
            {NAV.map(section=>(
              <div key={section.section}>
                <div className="nav-sect">{section.section}</div>
                {section.items.map(item=>(
                  <div key={item.id} className={`nav-item ${page===item.id?"active":""}`} onClick={()=>setPage(item.id)}>
                    <span className="nav-icon">{item.icon}</span>
                    <span style={{flex:1}}>{item.label}</span>
                    {item.badge && <span className="nav-badge">{item.badge}</span>}
                    {item.badgeRed && <span className="nav-badge-red">{item.badgeRed}</span>}
                  </div>
                ))}
              </div>
            ))}
          </nav>
          <div className="sidebar-foot">
            <div className="company-chip">
              <div className="company-plan">Pro Plan · EU AI Act Compliant</div>
              <div className="company-name">Acme Corp Ltd</div>
              <div className="company-sector">Construction · UK · SECR obligated</div>
            </div>
          </div>
        </aside>
        <main className="main">
          <div className="topbar">
            <div className="topbar-left">
              <div className="page-title">{TITLES[page]}</div>
              <span className="topbar-crumb">Project ACE · 2024</span>
            </div>
            <div className="topbar-right">
              <span className="badge b-ai" style={{fontSize:10}}>✦ EU AI Act Art. 52</span>
              <button className="btn btn-out btn-sm">Settings</button>
              <button className="btn btn-ace btn-sm" onClick={()=>setPage("ingest")}>+ Add Data</button>
            </div>
          </div>
          <div className="content">
            {page==="dashboard"  && <Dashboard setPage={setPage}/>}
            {page==="emissions"  && <EmissionsPage/>}
            {page==="secr"       && <SECRPage setPage={setPage}/>}
            {page==="ingest"     && <IngestPage/>}
            {page==="suppliers"  && <SuppliersPage/>}
            {page==="compliance" && <CompliancePage/>}
            {page==="reports"    && <ReportsPage/>}
            {page==="credits"    && <CreditsPage/>}
            {page==="ai"         && <AIPage/>}
          </div>
        </main>
      </div>
    </>
  );
}
export default function Home() {
  const [page, setPage] = useState("dashboard");

  return (
    <>
      <style>{CSS}</style>

      <div className="app">
        {page === "dashboard" && <Dashboard setPage={setPage} />}
        {page === "emissions" && <EmissionsPage />}
        {page === "secr" && <SECRPage setPage={setPage} />}
      </div>
    </>
  );
}
