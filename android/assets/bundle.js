(()=>{var Jf=Object.create;var Ir=Object.defineProperty;var Zf=Object.getOwnPropertyDescriptor;var jf=Object.getOwnPropertyNames;var Kf=Object.getPrototypeOf,Qf=Object.prototype.hasOwnProperty;var ep=i=>{throw TypeError(i)};var tp=(i,e,t)=>e in i?Ir(i,e,{enumerable:!0,configurable:!0,writable:!0,value:t}):i[e]=t;var np=(i,e)=>()=>(e||i((e={exports:{}}).exports,e),e.exports),Lr=(i,e)=>{for(var t in e)Ir(i,t,{get:e[t],enumerable:!0})},ip=(i,e,t,n)=>{if(e&&typeof e=="object"||typeof e=="function")for(let s of jf(e))!Qf.call(i,s)&&s!==t&&Ir(i,s,{get:()=>e[s],enumerable:!(n=Zf(e,s))||n.enumerable});return i};var Mu=(i,e,t)=>(t=i!=null?Jf(Kf(i)):{},ip(e||!i||!i.__esModule?Ir(t,"default",{value:i,enumerable:!0}):t,i));var bu=(i,e,t)=>tp(i,typeof e!="symbol"?e+"":e,t);var Is=(i,e,t)=>e.has(i)?ep("Cannot add the same private member more than once"):e instanceof WeakSet?e.add(i):e.set(i,t);var Xh=np((Qv,Wh)=>{"use strict";var re={};re.generateIdentifier=function(){return Math.random().toString(36).substring(2,12)};re.localCName=re.generateIdentifier();re.splitLines=function(i){return i.trim().split(`
`).map(e=>e.trim())};re.splitSections=function(i){return i.split(`
m=`).map((t,n)=>(n>0?"m="+t:t).trim()+`\r
`)};re.getDescription=function(i){let e=re.splitSections(i);return e&&e[0]};re.getMediaSections=function(i){let e=re.splitSections(i);return e.shift(),e};re.matchPrefix=function(i,e){return re.splitLines(i).filter(t=>t.indexOf(e)===0)};re.parseCandidate=function(i){let e;i.indexOf("a=candidate:")===0?e=i.substring(12).split(" "):e=i.substring(10).split(" ");let t={foundation:e[0],component:{1:"rtp",2:"rtcp"}[e[1]]||e[1],protocol:e[2].toLowerCase(),priority:parseInt(e[3],10),ip:e[4],address:e[4],port:parseInt(e[5],10),type:e[7]};for(let n=8;n<e.length;n+=2)switch(e[n]){case"raddr":t.relatedAddress=e[n+1];break;case"rport":t.relatedPort=parseInt(e[n+1],10);break;case"tcptype":t.tcpType=e[n+1];break;case"ufrag":t.ufrag=e[n+1],t.usernameFragment=e[n+1];break;default:t[e[n]]===void 0&&(t[e[n]]=e[n+1]);break}return t};re.writeCandidate=function(i){let e=[];e.push(i.foundation);let t=i.component;t==="rtp"?e.push(1):t==="rtcp"?e.push(2):e.push(t),e.push(i.protocol.toUpperCase()),e.push(i.priority),e.push(i.address||i.ip),e.push(i.port);let n=i.type;return e.push("typ"),e.push(n),n!=="host"&&i.relatedAddress&&i.relatedPort!==void 0&&(e.push("raddr"),e.push(i.relatedAddress),e.push("rport"),e.push(i.relatedPort)),i.tcpType&&i.protocol.toLowerCase()==="tcp"&&(e.push("tcptype"),e.push(i.tcpType)),(i.usernameFragment||i.ufrag)&&(e.push("ufrag"),e.push(i.usernameFragment||i.ufrag)),"candidate:"+e.join(" ")};re.parseIceOptions=function(i){return i.substring(14).split(" ")};re.parseRtpMap=function(i){let e=i.substring(9).split(" "),t={payloadType:parseInt(e.shift(),10)};return e=e[0].split("/"),t.name=e[0],t.clockRate=parseInt(e[1],10),t.channels=e.length===3?parseInt(e[2],10):1,t.numChannels=t.channels,t};re.writeRtpMap=function(i){let e=i.payloadType;i.preferredPayloadType!==void 0&&(e=i.preferredPayloadType);let t=i.channels||i.numChannels||1;return"a=rtpmap:"+e+" "+i.name+"/"+i.clockRate+(t!==1?"/"+t:"")+`\r
`};re.parseExtmap=function(i){let e=i.substring(9).split(" ");return{id:parseInt(e[0],10),direction:e[0].indexOf("/")>0?e[0].split("/")[1]:"sendrecv",uri:e[1],attributes:e.slice(2).join(" ")}};re.writeExtmap=function(i){return"a=extmap:"+(i.id||i.preferredId)+(i.direction&&i.direction!=="sendrecv"?"/"+i.direction:"")+" "+i.uri+(i.attributes?" "+i.attributes:"")+`\r
`};re.parseFmtp=function(i){let e={},t,n=i.substring(i.indexOf(" ")+1).split(";");for(let s=0;s<n.length;s++)t=n[s].trim().split("="),e[t[0].trim()]=t[1];return e};re.writeFmtp=function(i){let e="",t=i.payloadType;if(i.preferredPayloadType!==void 0&&(t=i.preferredPayloadType),i.parameters&&Object.keys(i.parameters).length){let n=[];Object.keys(i.parameters).forEach(s=>{i.parameters[s]!==void 0?n.push(s+"="+i.parameters[s]):n.push(s)}),e+="a=fmtp:"+t+" "+n.join(";")+`\r
`}return e};re.parseRtcpFb=function(i){let e=i.substring(i.indexOf(" ")+1).split(" ");return{type:e.shift(),parameter:e.join(" ")}};re.writeRtcpFb=function(i){let e="",t=i.payloadType;return i.preferredPayloadType!==void 0&&(t=i.preferredPayloadType),i.rtcpFeedback&&i.rtcpFeedback.length&&i.rtcpFeedback.forEach(n=>{e+="a=rtcp-fb:"+t+" "+n.type+(n.parameter&&n.parameter.length?" "+n.parameter:"")+`\r
`}),e};re.parseSsrcMedia=function(i){let e=i.indexOf(" "),t={ssrc:parseInt(i.substring(7,e),10)},n=i.indexOf(":",e);return n>-1?(t.attribute=i.substring(e+1,n),t.value=i.substring(n+1)):t.attribute=i.substring(e+1),t};re.parseSsrcGroup=function(i){let e=i.substring(13).split(" ");return{semantics:e.shift(),ssrcs:e.map(t=>parseInt(t,10))}};re.getMid=function(i){let e=re.matchPrefix(i,"a=mid:")[0];if(e)return e.substring(6)};re.parseFingerprint=function(i){let e=i.substring(14).split(" ");return{algorithm:e[0].toLowerCase(),value:e[1].toUpperCase()}};re.getDtlsParameters=function(i,e){return{role:"auto",fingerprints:re.matchPrefix(i+e,"a=fingerprint:").map(re.parseFingerprint)}};re.writeDtlsParameters=function(i,e){let t="a=setup:"+e+`\r
`;return i.fingerprints.forEach(n=>{t+="a=fingerprint:"+n.algorithm+" "+n.value+`\r
`}),t};re.parseCryptoLine=function(i){let e=i.substring(9).split(" ");return{tag:parseInt(e[0],10),cryptoSuite:e[1],keyParams:e[2],sessionParams:e.slice(3)}};re.writeCryptoLine=function(i){return"a=crypto:"+i.tag+" "+i.cryptoSuite+" "+(typeof i.keyParams=="object"?re.writeCryptoKeyParams(i.keyParams):i.keyParams)+(i.sessionParams?" "+i.sessionParams.join(" "):"")+`\r
`};re.parseCryptoKeyParams=function(i){if(i.indexOf("inline:")!==0)return null;let e=i.substring(7).split("|");return{keyMethod:"inline",keySalt:e[0],lifeTime:e[1],mkiValue:e[2]?e[2].split(":")[0]:void 0,mkiLength:e[2]?e[2].split(":")[1]:void 0}};re.writeCryptoKeyParams=function(i){return i.keyMethod+":"+i.keySalt+(i.lifeTime?"|"+i.lifeTime:"")+(i.mkiValue&&i.mkiLength?"|"+i.mkiValue+":"+i.mkiLength:"")};re.getCryptoParameters=function(i,e){return re.matchPrefix(i+e,"a=crypto:").map(re.parseCryptoLine)};re.getIceParameters=function(i,e){let t=re.matchPrefix(i+e,"a=ice-ufrag:")[0],n=re.matchPrefix(i+e,"a=ice-pwd:")[0];return t&&n?{usernameFragment:t.substring(12),password:n.substring(10)}:null};re.writeIceParameters=function(i){let e="a=ice-ufrag:"+i.usernameFragment+`\r
a=ice-pwd:`+i.password+`\r
`;return i.iceLite&&(e+=`a=ice-lite\r
`),e};re.parseRtpParameters=function(i){let e={codecs:[],headerExtensions:[],fecMechanisms:[],rtcp:[]},n=re.splitLines(i)[0].split(" ");e.profile=n[2];for(let r=3;r<n.length;r++){let o=n[r],a=re.matchPrefix(i,"a=rtpmap:"+o+" ")[0];if(a){let c=re.parseRtpMap(a),l=re.matchPrefix(i,"a=fmtp:"+o+" ");switch(c.parameters=l.length?re.parseFmtp(l[0]):{},c.rtcpFeedback=re.matchPrefix(i,"a=rtcp-fb:"+o+" ").map(re.parseRtcpFb),e.codecs.push(c),c.name.toUpperCase()){case"RED":case"ULPFEC":e.fecMechanisms.push(c.name.toUpperCase());break;default:break}}}re.matchPrefix(i,"a=extmap:").forEach(r=>{e.headerExtensions.push(re.parseExtmap(r))});let s=re.matchPrefix(i,"a=rtcp-fb:* ").map(re.parseRtcpFb);return e.codecs.forEach(r=>{s.forEach(o=>{r.rtcpFeedback.find(c=>c.type===o.type&&c.parameter===o.parameter)||r.rtcpFeedback.push(o)})}),e};re.writeRtpDescription=function(i,e){let t="";t+="m="+i+" ",t+=e.codecs.length>0?"9":"0",t+=" "+(e.profile||"UDP/TLS/RTP/SAVPF")+" ",t+=e.codecs.map(s=>s.preferredPayloadType!==void 0?s.preferredPayloadType:s.payloadType).join(" ")+`\r
`,t+=`c=IN IP4 0.0.0.0\r
`,t+=`a=rtcp:9 IN IP4 0.0.0.0\r
`,e.codecs.forEach(s=>{t+=re.writeRtpMap(s),t+=re.writeFmtp(s),t+=re.writeRtcpFb(s)});let n=0;return e.codecs.forEach(s=>{s.maxptime>n&&(n=s.maxptime)}),n>0&&(t+="a=maxptime:"+n+`\r
`),e.headerExtensions&&e.headerExtensions.forEach(s=>{t+=re.writeExtmap(s)}),t};re.parseRtpEncodingParameters=function(i){let e=[],t=re.parseRtpParameters(i),n=t.fecMechanisms.indexOf("RED")!==-1,s=t.fecMechanisms.indexOf("ULPFEC")!==-1,r=re.matchPrefix(i,"a=ssrc:").map(h=>re.parseSsrcMedia(h)).filter(h=>h.attribute==="cname"),o=r.length>0&&r[0].ssrc,a,c=re.matchPrefix(i,"a=ssrc-group:FID").map(h=>h.substring(17).split(" ").map(d=>parseInt(d,10)));c.length>0&&c[0].length>1&&c[0][0]===o&&(a=c[0][1]),t.codecs.forEach(h=>{if(h.name.toUpperCase()==="RTX"&&h.parameters.apt){let u={ssrc:o,codecPayloadType:parseInt(h.parameters.apt,10)};o&&a&&(u.rtx={ssrc:a}),e.push(u),n&&(u=JSON.parse(JSON.stringify(u)),u.fec={ssrc:o,mechanism:s?"red+ulpfec":"red"},e.push(u))}}),e.length===0&&o&&e.push({ssrc:o});let l=re.matchPrefix(i,"b=");return l.length&&(l[0].indexOf("b=TIAS:")===0?l=parseInt(l[0].substring(7),10):l[0].indexOf("b=AS:")===0?l=parseInt(l[0].substring(5),10)*1e3*.95-50*40*8:l=void 0,e.forEach(h=>{h.maxBitrate=l})),e};re.parseRtcpParameters=function(i){let e={},t=re.matchPrefix(i,"a=ssrc:").map(r=>re.parseSsrcMedia(r)).filter(r=>r.attribute==="cname")[0];t&&(e.cname=t.value,e.ssrc=t.ssrc);let n=re.matchPrefix(i,"a=rtcp-rsize");e.reducedSize=n.length>0,e.compound=n.length===0;let s=re.matchPrefix(i,"a=rtcp-mux");return e.mux=s.length>0,e};re.writeRtcpParameters=function(i){let e="";return i.reducedSize&&(e+=`a=rtcp-rsize\r
`),i.mux&&(e+=`a=rtcp-mux\r
`),i.ssrc!==void 0&&i.cname&&(e+="a=ssrc:"+i.ssrc+" cname:"+i.cname+`\r
`),e};re.parseMsid=function(i){let e,t=re.matchPrefix(i,"a=msid:");if(t.length===1)return e=t[0].substring(7).split(" "),{stream:e[0],track:e[1]};let n=re.matchPrefix(i,"a=ssrc:").map(s=>re.parseSsrcMedia(s)).filter(s=>s.attribute==="msid");if(n.length>0)return e=n[0].value.split(" "),{stream:e[0],track:e[1]}};re.parseSctpDescription=function(i){let e=re.parseMLine(i),t=re.matchPrefix(i,"a=max-message-size:"),n;t.length>0&&(n=parseInt(t[0].substring(19),10)),isNaN(n)&&(n=65536);let s=re.matchPrefix(i,"a=sctp-port:");if(s.length>0)return{port:parseInt(s[0].substring(12),10),protocol:e.fmt,maxMessageSize:n};let r=re.matchPrefix(i,"a=sctpmap:");if(r.length>0){let o=r[0].substring(10).split(" ");return{port:parseInt(o[0],10),protocol:o[1],maxMessageSize:n}}};re.writeSctpDescription=function(i,e){let t=[];return i.protocol!=="DTLS/SCTP"?t=["m="+i.kind+" 9 "+i.protocol+" "+e.protocol+`\r
`,`c=IN IP4 0.0.0.0\r
`,"a=sctp-port:"+e.port+`\r
`]:t=["m="+i.kind+" 9 "+i.protocol+" "+e.port+`\r
`,`c=IN IP4 0.0.0.0\r
`,"a=sctpmap:"+e.port+" "+e.protocol+` 65535\r
`],e.maxMessageSize!==void 0&&t.push("a=max-message-size:"+e.maxMessageSize+`\r
`),t.join("")};re.generateSessionId=function(){return Math.random().toString().substr(2,22)};re.writeSessionBoilerplate=function(i,e,t){let n,s=e!==void 0?e:2;return i?n=i:n=re.generateSessionId(),`v=0\r
o=`+(t||"thisisadapterortc")+" "+n+" "+s+` IN IP4 127.0.0.1\r
s=-\r
t=0 0\r
`};re.getDirection=function(i,e){let t=re.splitLines(i);for(let n=0;n<t.length;n++)switch(t[n]){case"a=sendrecv":case"a=sendonly":case"a=recvonly":case"a=inactive":return t[n].substring(2);default:}return e?re.getDirection(e):"sendrecv"};re.getKind=function(i){return re.splitLines(i)[0].split(" ")[0].substring(2)};re.isRejected=function(i){return i.split(" ",2)[1]==="0"};re.parseMLine=function(i){let t=re.splitLines(i)[0].substring(2).split(" ");return{kind:t[0],port:parseInt(t[1],10),protocol:t[2],fmt:t.slice(3).join(" ")}};re.parseOLine=function(i){let t=re.matchPrefix(i,"o=")[0].substring(2).split(" ");return{username:t[0],sessionId:t[1],sessionVersion:parseInt(t[2],10),netType:t[3],addressType:t[4],address:t[5]}};re.isValidSDP=function(i){if(typeof i!="string"||i.length===0)return!1;let e=re.splitLines(i);for(let t=0;t<e.length;t++)if(e[t].length<2||e[t].charAt(1)!=="=")return!1;return!0};typeof Wh=="object"&&(Wh.exports=re)});var Gl="169";var sp=0,Su=1,rp=2;var Id=1,Wl=2,On=3,wn=0,Ht=1,Bn=2,ni=0,is=1,Eu=2,Tu=3,wu=4,op=5,yi=100,ap=101,cp=102,lp=103,hp=104,up=200,dp=201,fp=202,pp=203,_c=204,yc=205,mp=206,gp=207,_p=208,yp=209,xp=210,vp=211,Mp=212,bp=213,Sp=214,xc=0,vc=1,Mc=2,as=3,bc=4,Sc=5,Ec=6,Tc=7,Ld=0,Ep=1,Tp=2,ii=0,wp=1,Cp=2,Ap=3,Xl=4,Rp=5,Pp=6,Ip=7;var Dd=300,cs=301,ls=302,wc=303,Cc=304,Zo=306,Js=1e3,vi=1001,Ac=1002,ln=1003,Lp=1004;var Dr=1005;var yn=1006,Na=1007;var Mi=1008;var Vn=1009,Ud=1010,Nd=1011,Zs=1012,ql=1013,bi=1014,zn=1015,hr=1016,Yl=1017,$l=1018,hs=1020,kd=35902,Od=1021,Fd=1022,vn=1023,Bd=1024,zd=1025,ss=1026,us=1027,Hd=1028,Jl=1029,Vd=1030,Zl=1031;var jl=1033,lo=33776,ho=33777,uo=33778,fo=33779,Rc=35840,Pc=35841,Ic=35842,Lc=35843,Dc=36196,Uc=37492,Nc=37496,kc=37808,Oc=37809,Fc=37810,Bc=37811,zc=37812,Hc=37813,Vc=37814,Gc=37815,Wc=37816,Xc=37817,qc=37818,Yc=37819,$c=37820,Jc=37821,po=36492,Zc=36494,jc=36495,Gd=36283,Kc=36284,Qc=36285,el=36286;var go=2300,tl=2301,ka=2302,Cu=2400,Au=2401,Ru=2402;var Dp=3200,Up=3201;var Wd=0,Np=1,ei="",Xt="srgb",oi="srgb-linear",Kl="display-p3",jo="display-p3-linear",_o="linear",gt="srgb",yo="rec709",xo="p3";var Oi=7680;var Pu=519,kp=512,Op=513,Fp=514,Xd=515,Bp=516,zp=517,Hp=518,Vp=519,nl=35044;var Iu="300 es",Hn=2e3,vo=2001,si=class{addEventListener(e,t){this._listeners===void 0&&(this._listeners={});let n=this._listeners;n[e]===void 0&&(n[e]=[]),n[e].indexOf(t)===-1&&n[e].push(t)}hasEventListener(e,t){if(this._listeners===void 0)return!1;let n=this._listeners;return n[e]!==void 0&&n[e].indexOf(t)!==-1}removeEventListener(e,t){if(this._listeners===void 0)return;let s=this._listeners[e];if(s!==void 0){let r=s.indexOf(t);r!==-1&&s.splice(r,1)}}dispatchEvent(e){if(this._listeners===void 0)return;let n=this._listeners[e.type];if(n!==void 0){e.target=this;let s=n.slice(0);for(let r=0,o=s.length;r<o;r++)s[r].call(this,e);e.target=null}}},Bt=["00","01","02","03","04","05","06","07","08","09","0a","0b","0c","0d","0e","0f","10","11","12","13","14","15","16","17","18","19","1a","1b","1c","1d","1e","1f","20","21","22","23","24","25","26","27","28","29","2a","2b","2c","2d","2e","2f","30","31","32","33","34","35","36","37","38","39","3a","3b","3c","3d","3e","3f","40","41","42","43","44","45","46","47","48","49","4a","4b","4c","4d","4e","4f","50","51","52","53","54","55","56","57","58","59","5a","5b","5c","5d","5e","5f","60","61","62","63","64","65","66","67","68","69","6a","6b","6c","6d","6e","6f","70","71","72","73","74","75","76","77","78","79","7a","7b","7c","7d","7e","7f","80","81","82","83","84","85","86","87","88","89","8a","8b","8c","8d","8e","8f","90","91","92","93","94","95","96","97","98","99","9a","9b","9c","9d","9e","9f","a0","a1","a2","a3","a4","a5","a6","a7","a8","a9","aa","ab","ac","ad","ae","af","b0","b1","b2","b3","b4","b5","b6","b7","b8","b9","ba","bb","bc","bd","be","bf","c0","c1","c2","c3","c4","c5","c6","c7","c8","c9","ca","cb","cc","cd","ce","cf","d0","d1","d2","d3","d4","d5","d6","d7","d8","d9","da","db","dc","dd","de","df","e0","e1","e2","e3","e4","e5","e6","e7","e8","e9","ea","eb","ec","ed","ee","ef","f0","f1","f2","f3","f4","f5","f6","f7","f8","f9","fa","fb","fc","fd","fe","ff"],Lu=1234567,Gs=Math.PI/180,js=180/Math.PI;function Tn(){let i=Math.random()*4294967295|0,e=Math.random()*4294967295|0,t=Math.random()*4294967295|0,n=Math.random()*4294967295|0;return(Bt[i&255]+Bt[i>>8&255]+Bt[i>>16&255]+Bt[i>>24&255]+"-"+Bt[e&255]+Bt[e>>8&255]+"-"+Bt[e>>16&15|64]+Bt[e>>24&255]+"-"+Bt[t&63|128]+Bt[t>>8&255]+"-"+Bt[t>>16&255]+Bt[t>>24&255]+Bt[n&255]+Bt[n>>8&255]+Bt[n>>16&255]+Bt[n>>24&255]).toLowerCase()}function Lt(i,e,t){return Math.max(e,Math.min(t,i))}function Ql(i,e){return(i%e+e)%e}function Gp(i,e,t,n,s){return n+(i-e)*(s-n)/(t-e)}function Wp(i,e,t){return i!==e?(t-i)/(e-i):0}function Ws(i,e,t){return(1-t)*i+t*e}function Xp(i,e,t,n){return Ws(i,e,1-Math.exp(-t*n))}function qp(i,e=1){return e-Math.abs(Ql(i,e*2)-e)}function Yp(i,e,t){return i<=e?0:i>=t?1:(i=(i-e)/(t-e),i*i*(3-2*i))}function $p(i,e,t){return i<=e?0:i>=t?1:(i=(i-e)/(t-e),i*i*i*(i*(i*6-15)+10))}function Jp(i,e){return i+Math.floor(Math.random()*(e-i+1))}function Zp(i,e){return i+Math.random()*(e-i)}function jp(i){return i*(.5-Math.random())}function Kp(i){i!==void 0&&(Lu=i);let e=Lu+=1831565813;return e=Math.imul(e^e>>>15,e|1),e^=e+Math.imul(e^e>>>7,e|61),((e^e>>>14)>>>0)/4294967296}function Qp(i){return i*Gs}function em(i){return i*js}function tm(i){return(i&i-1)===0&&i!==0}function nm(i){return Math.pow(2,Math.ceil(Math.log(i)/Math.LN2))}function im(i){return Math.pow(2,Math.floor(Math.log(i)/Math.LN2))}function sm(i,e,t,n,s){let r=Math.cos,o=Math.sin,a=r(t/2),c=o(t/2),l=r((e+n)/2),h=o((e+n)/2),u=r((e-n)/2),d=o((e-n)/2),f=r((n-e)/2),g=o((n-e)/2);switch(s){case"XYX":i.set(a*h,c*u,c*d,a*l);break;case"YZY":i.set(c*d,a*h,c*u,a*l);break;case"ZXZ":i.set(c*u,c*d,a*h,a*l);break;case"XZX":i.set(a*h,c*g,c*f,a*l);break;case"YXY":i.set(c*f,a*h,c*g,a*l);break;case"ZYZ":i.set(c*g,c*f,a*h,a*l);break;default:console.warn("THREE.MathUtils: .setQuaternionFromProperEuler() encountered an unknown order: "+s)}}function xn(i,e){switch(e.constructor){case Float32Array:return i;case Uint32Array:return i/4294967295;case Uint16Array:return i/65535;case Uint8Array:return i/255;case Int32Array:return Math.max(i/2147483647,-1);case Int16Array:return Math.max(i/32767,-1);case Int8Array:return Math.max(i/127,-1);default:throw new Error("Invalid component type.")}}function ut(i,e){switch(e.constructor){case Float32Array:return i;case Uint32Array:return Math.round(i*4294967295);case Uint16Array:return Math.round(i*65535);case Uint8Array:return Math.round(i*255);case Int32Array:return Math.round(i*2147483647);case Int16Array:return Math.round(i*32767);case Int8Array:return Math.round(i*127);default:throw new Error("Invalid component type.")}}var eh={DEG2RAD:Gs,RAD2DEG:js,generateUUID:Tn,clamp:Lt,euclideanModulo:Ql,mapLinear:Gp,inverseLerp:Wp,lerp:Ws,damp:Xp,pingpong:qp,smoothstep:Yp,smootherstep:$p,randInt:Jp,randFloat:Zp,randFloatSpread:jp,seededRandom:Kp,degToRad:Qp,radToDeg:em,isPowerOfTwo:tm,ceilPowerOfTwo:nm,floorPowerOfTwo:im,setQuaternionFromProperEuler:sm,normalize:ut,denormalize:xn},le=class i{constructor(e=0,t=0){i.prototype.isVector2=!0,this.x=e,this.y=t}get width(){return this.x}set width(e){this.x=e}get height(){return this.y}set height(e){this.y=e}set(e,t){return this.x=e,this.y=t,this}setScalar(e){return this.x=e,this.y=e,this}setX(e){return this.x=e,this}setY(e){return this.y=e,this}setComponent(e,t){switch(e){case 0:this.x=t;break;case 1:this.y=t;break;default:throw new Error("index is out of range: "+e)}return this}getComponent(e){switch(e){case 0:return this.x;case 1:return this.y;default:throw new Error("index is out of range: "+e)}}clone(){return new this.constructor(this.x,this.y)}copy(e){return this.x=e.x,this.y=e.y,this}add(e){return this.x+=e.x,this.y+=e.y,this}addScalar(e){return this.x+=e,this.y+=e,this}addVectors(e,t){return this.x=e.x+t.x,this.y=e.y+t.y,this}addScaledVector(e,t){return this.x+=e.x*t,this.y+=e.y*t,this}sub(e){return this.x-=e.x,this.y-=e.y,this}subScalar(e){return this.x-=e,this.y-=e,this}subVectors(e,t){return this.x=e.x-t.x,this.y=e.y-t.y,this}multiply(e){return this.x*=e.x,this.y*=e.y,this}multiplyScalar(e){return this.x*=e,this.y*=e,this}divide(e){return this.x/=e.x,this.y/=e.y,this}divideScalar(e){return this.multiplyScalar(1/e)}applyMatrix3(e){let t=this.x,n=this.y,s=e.elements;return this.x=s[0]*t+s[3]*n+s[6],this.y=s[1]*t+s[4]*n+s[7],this}min(e){return this.x=Math.min(this.x,e.x),this.y=Math.min(this.y,e.y),this}max(e){return this.x=Math.max(this.x,e.x),this.y=Math.max(this.y,e.y),this}clamp(e,t){return this.x=Math.max(e.x,Math.min(t.x,this.x)),this.y=Math.max(e.y,Math.min(t.y,this.y)),this}clampScalar(e,t){return this.x=Math.max(e,Math.min(t,this.x)),this.y=Math.max(e,Math.min(t,this.y)),this}clampLength(e,t){let n=this.length();return this.divideScalar(n||1).multiplyScalar(Math.max(e,Math.min(t,n)))}floor(){return this.x=Math.floor(this.x),this.y=Math.floor(this.y),this}ceil(){return this.x=Math.ceil(this.x),this.y=Math.ceil(this.y),this}round(){return this.x=Math.round(this.x),this.y=Math.round(this.y),this}roundToZero(){return this.x=Math.trunc(this.x),this.y=Math.trunc(this.y),this}negate(){return this.x=-this.x,this.y=-this.y,this}dot(e){return this.x*e.x+this.y*e.y}cross(e){return this.x*e.y-this.y*e.x}lengthSq(){return this.x*this.x+this.y*this.y}length(){return Math.sqrt(this.x*this.x+this.y*this.y)}manhattanLength(){return Math.abs(this.x)+Math.abs(this.y)}normalize(){return this.divideScalar(this.length()||1)}angle(){return Math.atan2(-this.y,-this.x)+Math.PI}angleTo(e){let t=Math.sqrt(this.lengthSq()*e.lengthSq());if(t===0)return Math.PI/2;let n=this.dot(e)/t;return Math.acos(Lt(n,-1,1))}distanceTo(e){return Math.sqrt(this.distanceToSquared(e))}distanceToSquared(e){let t=this.x-e.x,n=this.y-e.y;return t*t+n*n}manhattanDistanceTo(e){return Math.abs(this.x-e.x)+Math.abs(this.y-e.y)}setLength(e){return this.normalize().multiplyScalar(e)}lerp(e,t){return this.x+=(e.x-this.x)*t,this.y+=(e.y-this.y)*t,this}lerpVectors(e,t,n){return this.x=e.x+(t.x-e.x)*n,this.y=e.y+(t.y-e.y)*n,this}equals(e){return e.x===this.x&&e.y===this.y}fromArray(e,t=0){return this.x=e[t],this.y=e[t+1],this}toArray(e=[],t=0){return e[t]=this.x,e[t+1]=this.y,e}fromBufferAttribute(e,t){return this.x=e.getX(t),this.y=e.getY(t),this}rotateAround(e,t){let n=Math.cos(t),s=Math.sin(t),r=this.x-e.x,o=this.y-e.y;return this.x=r*n-o*s+e.x,this.y=r*s+o*n+e.y,this}random(){return this.x=Math.random(),this.y=Math.random(),this}*[Symbol.iterator](){yield this.x,yield this.y}},je=class i{constructor(e,t,n,s,r,o,a,c,l){i.prototype.isMatrix3=!0,this.elements=[1,0,0,0,1,0,0,0,1],e!==void 0&&this.set(e,t,n,s,r,o,a,c,l)}set(e,t,n,s,r,o,a,c,l){let h=this.elements;return h[0]=e,h[1]=s,h[2]=a,h[3]=t,h[4]=r,h[5]=c,h[6]=n,h[7]=o,h[8]=l,this}identity(){return this.set(1,0,0,0,1,0,0,0,1),this}copy(e){let t=this.elements,n=e.elements;return t[0]=n[0],t[1]=n[1],t[2]=n[2],t[3]=n[3],t[4]=n[4],t[5]=n[5],t[6]=n[6],t[7]=n[7],t[8]=n[8],this}extractBasis(e,t,n){return e.setFromMatrix3Column(this,0),t.setFromMatrix3Column(this,1),n.setFromMatrix3Column(this,2),this}setFromMatrix4(e){let t=e.elements;return this.set(t[0],t[4],t[8],t[1],t[5],t[9],t[2],t[6],t[10]),this}multiply(e){return this.multiplyMatrices(this,e)}premultiply(e){return this.multiplyMatrices(e,this)}multiplyMatrices(e,t){let n=e.elements,s=t.elements,r=this.elements,o=n[0],a=n[3],c=n[6],l=n[1],h=n[4],u=n[7],d=n[2],f=n[5],g=n[8],y=s[0],m=s[3],p=s[6],b=s[1],x=s[4],M=s[7],D=s[2],w=s[5],R=s[8];return r[0]=o*y+a*b+c*D,r[3]=o*m+a*x+c*w,r[6]=o*p+a*M+c*R,r[1]=l*y+h*b+u*D,r[4]=l*m+h*x+u*w,r[7]=l*p+h*M+u*R,r[2]=d*y+f*b+g*D,r[5]=d*m+f*x+g*w,r[8]=d*p+f*M+g*R,this}multiplyScalar(e){let t=this.elements;return t[0]*=e,t[3]*=e,t[6]*=e,t[1]*=e,t[4]*=e,t[7]*=e,t[2]*=e,t[5]*=e,t[8]*=e,this}determinant(){let e=this.elements,t=e[0],n=e[1],s=e[2],r=e[3],o=e[4],a=e[5],c=e[6],l=e[7],h=e[8];return t*o*h-t*a*l-n*r*h+n*a*c+s*r*l-s*o*c}invert(){let e=this.elements,t=e[0],n=e[1],s=e[2],r=e[3],o=e[4],a=e[5],c=e[6],l=e[7],h=e[8],u=h*o-a*l,d=a*c-h*r,f=l*r-o*c,g=t*u+n*d+s*f;if(g===0)return this.set(0,0,0,0,0,0,0,0,0);let y=1/g;return e[0]=u*y,e[1]=(s*l-h*n)*y,e[2]=(a*n-s*o)*y,e[3]=d*y,e[4]=(h*t-s*c)*y,e[5]=(s*r-a*t)*y,e[6]=f*y,e[7]=(n*c-l*t)*y,e[8]=(o*t-n*r)*y,this}transpose(){let e,t=this.elements;return e=t[1],t[1]=t[3],t[3]=e,e=t[2],t[2]=t[6],t[6]=e,e=t[5],t[5]=t[7],t[7]=e,this}getNormalMatrix(e){return this.setFromMatrix4(e).invert().transpose()}transposeIntoArray(e){let t=this.elements;return e[0]=t[0],e[1]=t[3],e[2]=t[6],e[3]=t[1],e[4]=t[4],e[5]=t[7],e[6]=t[2],e[7]=t[5],e[8]=t[8],this}setUvTransform(e,t,n,s,r,o,a){let c=Math.cos(r),l=Math.sin(r);return this.set(n*c,n*l,-n*(c*o+l*a)+o+e,-s*l,s*c,-s*(-l*o+c*a)+a+t,0,0,1),this}scale(e,t){return this.premultiply(Oa.makeScale(e,t)),this}rotate(e){return this.premultiply(Oa.makeRotation(-e)),this}translate(e,t){return this.premultiply(Oa.makeTranslation(e,t)),this}makeTranslation(e,t){return e.isVector2?this.set(1,0,e.x,0,1,e.y,0,0,1):this.set(1,0,e,0,1,t,0,0,1),this}makeRotation(e){let t=Math.cos(e),n=Math.sin(e);return this.set(t,-n,0,n,t,0,0,0,1),this}makeScale(e,t){return this.set(e,0,0,0,t,0,0,0,1),this}equals(e){let t=this.elements,n=e.elements;for(let s=0;s<9;s++)if(t[s]!==n[s])return!1;return!0}fromArray(e,t=0){for(let n=0;n<9;n++)this.elements[n]=e[n+t];return this}toArray(e=[],t=0){let n=this.elements;return e[t]=n[0],e[t+1]=n[1],e[t+2]=n[2],e[t+3]=n[3],e[t+4]=n[4],e[t+5]=n[5],e[t+6]=n[6],e[t+7]=n[7],e[t+8]=n[8],e}clone(){return new this.constructor().fromArray(this.elements)}},Oa=new je;function qd(i){for(let e=i.length-1;e>=0;--e)if(i[e]>=65535)return!0;return!1}function Mo(i){return document.createElementNS("http://www.w3.org/1999/xhtml",i)}function rm(){let i=Mo("canvas");return i.style.display="block",i}var Du={};function mo(i){i in Du||(Du[i]=!0,console.warn(i))}function om(i,e,t){return new Promise(function(n,s){function r(){switch(i.clientWaitSync(e,i.SYNC_FLUSH_COMMANDS_BIT,0)){case i.WAIT_FAILED:s();break;case i.TIMEOUT_EXPIRED:setTimeout(r,t);break;default:n()}}setTimeout(r,t)})}function am(i){let e=i.elements;e[2]=.5*e[2]+.5*e[3],e[6]=.5*e[6]+.5*e[7],e[10]=.5*e[10]+.5*e[11],e[14]=.5*e[14]+.5*e[15]}function cm(i){let e=i.elements;e[11]===-1?(e[10]=-e[10]-1,e[14]=-e[14]):(e[10]=-e[10],e[14]=-e[14]+1)}var Uu=new je().set(.8224621,.177538,0,.0331941,.9668058,0,.0170827,.0723974,.9105199),Nu=new je().set(1.2249401,-.2249404,0,-.0420569,1.0420571,0,-.0196376,-.0786361,1.0982735),Ls={[oi]:{transfer:_o,primaries:yo,luminanceCoefficients:[.2126,.7152,.0722],toReference:i=>i,fromReference:i=>i},[Xt]:{transfer:gt,primaries:yo,luminanceCoefficients:[.2126,.7152,.0722],toReference:i=>i.convertSRGBToLinear(),fromReference:i=>i.convertLinearToSRGB()},[jo]:{transfer:_o,primaries:xo,luminanceCoefficients:[.2289,.6917,.0793],toReference:i=>i.applyMatrix3(Nu),fromReference:i=>i.applyMatrix3(Uu)},[Kl]:{transfer:gt,primaries:xo,luminanceCoefficients:[.2289,.6917,.0793],toReference:i=>i.convertSRGBToLinear().applyMatrix3(Nu),fromReference:i=>i.applyMatrix3(Uu).convertLinearToSRGB()}},lm=new Set([oi,jo]),ct={enabled:!0,_workingColorSpace:oi,get workingColorSpace(){return this._workingColorSpace},set workingColorSpace(i){if(!lm.has(i))throw new Error(`Unsupported working color space, "${i}".`);this._workingColorSpace=i},convert:function(i,e,t){if(this.enabled===!1||e===t||!e||!t)return i;let n=Ls[e].toReference,s=Ls[t].fromReference;return s(n(i))},fromWorkingColorSpace:function(i,e){return this.convert(i,this._workingColorSpace,e)},toWorkingColorSpace:function(i,e){return this.convert(i,e,this._workingColorSpace)},getPrimaries:function(i){return Ls[i].primaries},getTransfer:function(i){return i===ei?_o:Ls[i].transfer},getLuminanceCoefficients:function(i,e=this._workingColorSpace){return i.fromArray(Ls[e].luminanceCoefficients)}};function rs(i){return i<.04045?i*.0773993808:Math.pow(i*.9478672986+.0521327014,2.4)}function Fa(i){return i<.0031308?i*12.92:1.055*Math.pow(i,.41666)-.055}var Fi,il=class{static getDataURL(e){if(/^data:/i.test(e.src)||typeof HTMLCanvasElement=="undefined")return e.src;let t;if(e instanceof HTMLCanvasElement)t=e;else{Fi===void 0&&(Fi=Mo("canvas")),Fi.width=e.width,Fi.height=e.height;let n=Fi.getContext("2d");e instanceof ImageData?n.putImageData(e,0,0):n.drawImage(e,0,0,e.width,e.height),t=Fi}return t.width>2048||t.height>2048?(console.warn("THREE.ImageUtils.getDataURL: Image converted to jpg for performance reasons",e),t.toDataURL("image/jpeg",.6)):t.toDataURL("image/png")}static sRGBToLinear(e){if(typeof HTMLImageElement!="undefined"&&e instanceof HTMLImageElement||typeof HTMLCanvasElement!="undefined"&&e instanceof HTMLCanvasElement||typeof ImageBitmap!="undefined"&&e instanceof ImageBitmap){let t=Mo("canvas");t.width=e.width,t.height=e.height;let n=t.getContext("2d");n.drawImage(e,0,0,e.width,e.height);let s=n.getImageData(0,0,e.width,e.height),r=s.data;for(let o=0;o<r.length;o++)r[o]=rs(r[o]/255)*255;return n.putImageData(s,0,0),t}else if(e.data){let t=e.data.slice(0);for(let n=0;n<t.length;n++)t instanceof Uint8Array||t instanceof Uint8ClampedArray?t[n]=Math.floor(rs(t[n]/255)*255):t[n]=rs(t[n]);return{data:t,width:e.width,height:e.height}}else return console.warn("THREE.ImageUtils.sRGBToLinear(): Unsupported image type. No color space conversion applied."),e}},hm=0,bo=class{constructor(e=null){this.isSource=!0,Object.defineProperty(this,"id",{value:hm++}),this.uuid=Tn(),this.data=e,this.dataReady=!0,this.version=0}set needsUpdate(e){e===!0&&this.version++}toJSON(e){let t=e===void 0||typeof e=="string";if(!t&&e.images[this.uuid]!==void 0)return e.images[this.uuid];let n={uuid:this.uuid,url:""},s=this.data;if(s!==null){let r;if(Array.isArray(s)){r=[];for(let o=0,a=s.length;o<a;o++)s[o].isDataTexture?r.push(Ba(s[o].image)):r.push(Ba(s[o]))}else r=Ba(s);n.url=r}return t||(e.images[this.uuid]=n),n}};function Ba(i){return typeof HTMLImageElement!="undefined"&&i instanceof HTMLImageElement||typeof HTMLCanvasElement!="undefined"&&i instanceof HTMLCanvasElement||typeof ImageBitmap!="undefined"&&i instanceof ImageBitmap?il.getDataURL(i):i.data?{data:Array.from(i.data),width:i.width,height:i.height,type:i.data.constructor.name}:(console.warn("THREE.Texture: Unable to serialize Texture."),{})}var um=0,nn=class i extends si{constructor(e=i.DEFAULT_IMAGE,t=i.DEFAULT_MAPPING,n=vi,s=vi,r=yn,o=Mi,a=vn,c=Vn,l=i.DEFAULT_ANISOTROPY,h=ei){super(),this.isTexture=!0,Object.defineProperty(this,"id",{value:um++}),this.uuid=Tn(),this.name="",this.source=new bo(e),this.mipmaps=[],this.mapping=t,this.channel=0,this.wrapS=n,this.wrapT=s,this.magFilter=r,this.minFilter=o,this.anisotropy=l,this.format=a,this.internalFormat=null,this.type=c,this.offset=new le(0,0),this.repeat=new le(1,1),this.center=new le(0,0),this.rotation=0,this.matrixAutoUpdate=!0,this.matrix=new je,this.generateMipmaps=!0,this.premultiplyAlpha=!1,this.flipY=!0,this.unpackAlignment=4,this.colorSpace=h,this.userData={},this.version=0,this.onUpdate=null,this.isRenderTargetTexture=!1,this.pmremVersion=0}get image(){return this.source.data}set image(e=null){this.source.data=e}updateMatrix(){this.matrix.setUvTransform(this.offset.x,this.offset.y,this.repeat.x,this.repeat.y,this.rotation,this.center.x,this.center.y)}clone(){return new this.constructor().copy(this)}copy(e){return this.name=e.name,this.source=e.source,this.mipmaps=e.mipmaps.slice(0),this.mapping=e.mapping,this.channel=e.channel,this.wrapS=e.wrapS,this.wrapT=e.wrapT,this.magFilter=e.magFilter,this.minFilter=e.minFilter,this.anisotropy=e.anisotropy,this.format=e.format,this.internalFormat=e.internalFormat,this.type=e.type,this.offset.copy(e.offset),this.repeat.copy(e.repeat),this.center.copy(e.center),this.rotation=e.rotation,this.matrixAutoUpdate=e.matrixAutoUpdate,this.matrix.copy(e.matrix),this.generateMipmaps=e.generateMipmaps,this.premultiplyAlpha=e.premultiplyAlpha,this.flipY=e.flipY,this.unpackAlignment=e.unpackAlignment,this.colorSpace=e.colorSpace,this.userData=JSON.parse(JSON.stringify(e.userData)),this.needsUpdate=!0,this}toJSON(e){let t=e===void 0||typeof e=="string";if(!t&&e.textures[this.uuid]!==void 0)return e.textures[this.uuid];let n={metadata:{version:4.6,type:"Texture",generator:"Texture.toJSON"},uuid:this.uuid,name:this.name,image:this.source.toJSON(e).uuid,mapping:this.mapping,channel:this.channel,repeat:[this.repeat.x,this.repeat.y],offset:[this.offset.x,this.offset.y],center:[this.center.x,this.center.y],rotation:this.rotation,wrap:[this.wrapS,this.wrapT],format:this.format,internalFormat:this.internalFormat,type:this.type,colorSpace:this.colorSpace,minFilter:this.minFilter,magFilter:this.magFilter,anisotropy:this.anisotropy,flipY:this.flipY,generateMipmaps:this.generateMipmaps,premultiplyAlpha:this.premultiplyAlpha,unpackAlignment:this.unpackAlignment};return Object.keys(this.userData).length>0&&(n.userData=this.userData),t||(e.textures[this.uuid]=n),n}dispose(){this.dispatchEvent({type:"dispose"})}transformUv(e){if(this.mapping!==Dd)return e;if(e.applyMatrix3(this.matrix),e.x<0||e.x>1)switch(this.wrapS){case Js:e.x=e.x-Math.floor(e.x);break;case vi:e.x=e.x<0?0:1;break;case Ac:Math.abs(Math.floor(e.x)%2)===1?e.x=Math.ceil(e.x)-e.x:e.x=e.x-Math.floor(e.x);break}if(e.y<0||e.y>1)switch(this.wrapT){case Js:e.y=e.y-Math.floor(e.y);break;case vi:e.y=e.y<0?0:1;break;case Ac:Math.abs(Math.floor(e.y)%2)===1?e.y=Math.ceil(e.y)-e.y:e.y=e.y-Math.floor(e.y);break}return this.flipY&&(e.y=1-e.y),e}set needsUpdate(e){e===!0&&(this.version++,this.source.needsUpdate=!0)}set needsPMREMUpdate(e){e===!0&&this.pmremVersion++}};nn.DEFAULT_IMAGE=null;nn.DEFAULT_MAPPING=Dd;nn.DEFAULT_ANISOTROPY=1;var ft=class i{constructor(e=0,t=0,n=0,s=1){i.prototype.isVector4=!0,this.x=e,this.y=t,this.z=n,this.w=s}get width(){return this.z}set width(e){this.z=e}get height(){return this.w}set height(e){this.w=e}set(e,t,n,s){return this.x=e,this.y=t,this.z=n,this.w=s,this}setScalar(e){return this.x=e,this.y=e,this.z=e,this.w=e,this}setX(e){return this.x=e,this}setY(e){return this.y=e,this}setZ(e){return this.z=e,this}setW(e){return this.w=e,this}setComponent(e,t){switch(e){case 0:this.x=t;break;case 1:this.y=t;break;case 2:this.z=t;break;case 3:this.w=t;break;default:throw new Error("index is out of range: "+e)}return this}getComponent(e){switch(e){case 0:return this.x;case 1:return this.y;case 2:return this.z;case 3:return this.w;default:throw new Error("index is out of range: "+e)}}clone(){return new this.constructor(this.x,this.y,this.z,this.w)}copy(e){return this.x=e.x,this.y=e.y,this.z=e.z,this.w=e.w!==void 0?e.w:1,this}add(e){return this.x+=e.x,this.y+=e.y,this.z+=e.z,this.w+=e.w,this}addScalar(e){return this.x+=e,this.y+=e,this.z+=e,this.w+=e,this}addVectors(e,t){return this.x=e.x+t.x,this.y=e.y+t.y,this.z=e.z+t.z,this.w=e.w+t.w,this}addScaledVector(e,t){return this.x+=e.x*t,this.y+=e.y*t,this.z+=e.z*t,this.w+=e.w*t,this}sub(e){return this.x-=e.x,this.y-=e.y,this.z-=e.z,this.w-=e.w,this}subScalar(e){return this.x-=e,this.y-=e,this.z-=e,this.w-=e,this}subVectors(e,t){return this.x=e.x-t.x,this.y=e.y-t.y,this.z=e.z-t.z,this.w=e.w-t.w,this}multiply(e){return this.x*=e.x,this.y*=e.y,this.z*=e.z,this.w*=e.w,this}multiplyScalar(e){return this.x*=e,this.y*=e,this.z*=e,this.w*=e,this}applyMatrix4(e){let t=this.x,n=this.y,s=this.z,r=this.w,o=e.elements;return this.x=o[0]*t+o[4]*n+o[8]*s+o[12]*r,this.y=o[1]*t+o[5]*n+o[9]*s+o[13]*r,this.z=o[2]*t+o[6]*n+o[10]*s+o[14]*r,this.w=o[3]*t+o[7]*n+o[11]*s+o[15]*r,this}divideScalar(e){return this.multiplyScalar(1/e)}setAxisAngleFromQuaternion(e){this.w=2*Math.acos(e.w);let t=Math.sqrt(1-e.w*e.w);return t<1e-4?(this.x=1,this.y=0,this.z=0):(this.x=e.x/t,this.y=e.y/t,this.z=e.z/t),this}setAxisAngleFromRotationMatrix(e){let t,n,s,r,c=e.elements,l=c[0],h=c[4],u=c[8],d=c[1],f=c[5],g=c[9],y=c[2],m=c[6],p=c[10];if(Math.abs(h-d)<.01&&Math.abs(u-y)<.01&&Math.abs(g-m)<.01){if(Math.abs(h+d)<.1&&Math.abs(u+y)<.1&&Math.abs(g+m)<.1&&Math.abs(l+f+p-3)<.1)return this.set(1,0,0,0),this;t=Math.PI;let x=(l+1)/2,M=(f+1)/2,D=(p+1)/2,w=(h+d)/4,R=(u+y)/4,P=(g+m)/4;return x>M&&x>D?x<.01?(n=0,s=.707106781,r=.707106781):(n=Math.sqrt(x),s=w/n,r=R/n):M>D?M<.01?(n=.707106781,s=0,r=.707106781):(s=Math.sqrt(M),n=w/s,r=P/s):D<.01?(n=.707106781,s=.707106781,r=0):(r=Math.sqrt(D),n=R/r,s=P/r),this.set(n,s,r,t),this}let b=Math.sqrt((m-g)*(m-g)+(u-y)*(u-y)+(d-h)*(d-h));return Math.abs(b)<.001&&(b=1),this.x=(m-g)/b,this.y=(u-y)/b,this.z=(d-h)/b,this.w=Math.acos((l+f+p-1)/2),this}setFromMatrixPosition(e){let t=e.elements;return this.x=t[12],this.y=t[13],this.z=t[14],this.w=t[15],this}min(e){return this.x=Math.min(this.x,e.x),this.y=Math.min(this.y,e.y),this.z=Math.min(this.z,e.z),this.w=Math.min(this.w,e.w),this}max(e){return this.x=Math.max(this.x,e.x),this.y=Math.max(this.y,e.y),this.z=Math.max(this.z,e.z),this.w=Math.max(this.w,e.w),this}clamp(e,t){return this.x=Math.max(e.x,Math.min(t.x,this.x)),this.y=Math.max(e.y,Math.min(t.y,this.y)),this.z=Math.max(e.z,Math.min(t.z,this.z)),this.w=Math.max(e.w,Math.min(t.w,this.w)),this}clampScalar(e,t){return this.x=Math.max(e,Math.min(t,this.x)),this.y=Math.max(e,Math.min(t,this.y)),this.z=Math.max(e,Math.min(t,this.z)),this.w=Math.max(e,Math.min(t,this.w)),this}clampLength(e,t){let n=this.length();return this.divideScalar(n||1).multiplyScalar(Math.max(e,Math.min(t,n)))}floor(){return this.x=Math.floor(this.x),this.y=Math.floor(this.y),this.z=Math.floor(this.z),this.w=Math.floor(this.w),this}ceil(){return this.x=Math.ceil(this.x),this.y=Math.ceil(this.y),this.z=Math.ceil(this.z),this.w=Math.ceil(this.w),this}round(){return this.x=Math.round(this.x),this.y=Math.round(this.y),this.z=Math.round(this.z),this.w=Math.round(this.w),this}roundToZero(){return this.x=Math.trunc(this.x),this.y=Math.trunc(this.y),this.z=Math.trunc(this.z),this.w=Math.trunc(this.w),this}negate(){return this.x=-this.x,this.y=-this.y,this.z=-this.z,this.w=-this.w,this}dot(e){return this.x*e.x+this.y*e.y+this.z*e.z+this.w*e.w}lengthSq(){return this.x*this.x+this.y*this.y+this.z*this.z+this.w*this.w}length(){return Math.sqrt(this.x*this.x+this.y*this.y+this.z*this.z+this.w*this.w)}manhattanLength(){return Math.abs(this.x)+Math.abs(this.y)+Math.abs(this.z)+Math.abs(this.w)}normalize(){return this.divideScalar(this.length()||1)}setLength(e){return this.normalize().multiplyScalar(e)}lerp(e,t){return this.x+=(e.x-this.x)*t,this.y+=(e.y-this.y)*t,this.z+=(e.z-this.z)*t,this.w+=(e.w-this.w)*t,this}lerpVectors(e,t,n){return this.x=e.x+(t.x-e.x)*n,this.y=e.y+(t.y-e.y)*n,this.z=e.z+(t.z-e.z)*n,this.w=e.w+(t.w-e.w)*n,this}equals(e){return e.x===this.x&&e.y===this.y&&e.z===this.z&&e.w===this.w}fromArray(e,t=0){return this.x=e[t],this.y=e[t+1],this.z=e[t+2],this.w=e[t+3],this}toArray(e=[],t=0){return e[t]=this.x,e[t+1]=this.y,e[t+2]=this.z,e[t+3]=this.w,e}fromBufferAttribute(e,t){return this.x=e.getX(t),this.y=e.getY(t),this.z=e.getZ(t),this.w=e.getW(t),this}random(){return this.x=Math.random(),this.y=Math.random(),this.z=Math.random(),this.w=Math.random(),this}*[Symbol.iterator](){yield this.x,yield this.y,yield this.z,yield this.w}},sl=class extends si{constructor(e=1,t=1,n={}){super(),this.isRenderTarget=!0,this.width=e,this.height=t,this.depth=1,this.scissor=new ft(0,0,e,t),this.scissorTest=!1,this.viewport=new ft(0,0,e,t);let s={width:e,height:t,depth:1};n=Object.assign({generateMipmaps:!1,internalFormat:null,minFilter:yn,depthBuffer:!0,stencilBuffer:!1,resolveDepthBuffer:!0,resolveStencilBuffer:!0,depthTexture:null,samples:0,count:1},n);let r=new nn(s,n.mapping,n.wrapS,n.wrapT,n.magFilter,n.minFilter,n.format,n.type,n.anisotropy,n.colorSpace);r.flipY=!1,r.generateMipmaps=n.generateMipmaps,r.internalFormat=n.internalFormat,this.textures=[];let o=n.count;for(let a=0;a<o;a++)this.textures[a]=r.clone(),this.textures[a].isRenderTargetTexture=!0;this.depthBuffer=n.depthBuffer,this.stencilBuffer=n.stencilBuffer,this.resolveDepthBuffer=n.resolveDepthBuffer,this.resolveStencilBuffer=n.resolveStencilBuffer,this.depthTexture=n.depthTexture,this.samples=n.samples}get texture(){return this.textures[0]}set texture(e){this.textures[0]=e}setSize(e,t,n=1){if(this.width!==e||this.height!==t||this.depth!==n){this.width=e,this.height=t,this.depth=n;for(let s=0,r=this.textures.length;s<r;s++)this.textures[s].image.width=e,this.textures[s].image.height=t,this.textures[s].image.depth=n;this.dispose()}this.viewport.set(0,0,e,t),this.scissor.set(0,0,e,t)}clone(){return new this.constructor().copy(this)}copy(e){this.width=e.width,this.height=e.height,this.depth=e.depth,this.scissor.copy(e.scissor),this.scissorTest=e.scissorTest,this.viewport.copy(e.viewport),this.textures.length=0;for(let n=0,s=e.textures.length;n<s;n++)this.textures[n]=e.textures[n].clone(),this.textures[n].isRenderTargetTexture=!0;let t=Object.assign({},e.texture.image);return this.texture.source=new bo(t),this.depthBuffer=e.depthBuffer,this.stencilBuffer=e.stencilBuffer,this.resolveDepthBuffer=e.resolveDepthBuffer,this.resolveStencilBuffer=e.resolveStencilBuffer,e.depthTexture!==null&&(this.depthTexture=e.depthTexture.clone()),this.samples=e.samples,this}dispose(){this.dispatchEvent({type:"dispose"})}},Gn=class extends sl{constructor(e=1,t=1,n={}){super(e,t,n),this.isWebGLRenderTarget=!0}},So=class extends nn{constructor(e=null,t=1,n=1,s=1){super(null),this.isDataArrayTexture=!0,this.image={data:e,width:t,height:n,depth:s},this.magFilter=ln,this.minFilter=ln,this.wrapR=vi,this.generateMipmaps=!1,this.flipY=!1,this.unpackAlignment=1,this.layerUpdates=new Set}addLayerUpdate(e){this.layerUpdates.add(e)}clearLayerUpdates(){this.layerUpdates.clear()}};var rl=class extends nn{constructor(e=null,t=1,n=1,s=1){super(null),this.isData3DTexture=!0,this.image={data:e,width:t,height:n,depth:s},this.magFilter=ln,this.minFilter=ln,this.wrapR=vi,this.generateMipmaps=!1,this.flipY=!1,this.unpackAlignment=1}};var ri=class{constructor(e=0,t=0,n=0,s=1){this.isQuaternion=!0,this._x=e,this._y=t,this._z=n,this._w=s}static slerpFlat(e,t,n,s,r,o,a){let c=n[s+0],l=n[s+1],h=n[s+2],u=n[s+3],d=r[o+0],f=r[o+1],g=r[o+2],y=r[o+3];if(a===0){e[t+0]=c,e[t+1]=l,e[t+2]=h,e[t+3]=u;return}if(a===1){e[t+0]=d,e[t+1]=f,e[t+2]=g,e[t+3]=y;return}if(u!==y||c!==d||l!==f||h!==g){let m=1-a,p=c*d+l*f+h*g+u*y,b=p>=0?1:-1,x=1-p*p;if(x>Number.EPSILON){let D=Math.sqrt(x),w=Math.atan2(D,p*b);m=Math.sin(m*w)/D,a=Math.sin(a*w)/D}let M=a*b;if(c=c*m+d*M,l=l*m+f*M,h=h*m+g*M,u=u*m+y*M,m===1-a){let D=1/Math.sqrt(c*c+l*l+h*h+u*u);c*=D,l*=D,h*=D,u*=D}}e[t]=c,e[t+1]=l,e[t+2]=h,e[t+3]=u}static multiplyQuaternionsFlat(e,t,n,s,r,o){let a=n[s],c=n[s+1],l=n[s+2],h=n[s+3],u=r[o],d=r[o+1],f=r[o+2],g=r[o+3];return e[t]=a*g+h*u+c*f-l*d,e[t+1]=c*g+h*d+l*u-a*f,e[t+2]=l*g+h*f+a*d-c*u,e[t+3]=h*g-a*u-c*d-l*f,e}get x(){return this._x}set x(e){this._x=e,this._onChangeCallback()}get y(){return this._y}set y(e){this._y=e,this._onChangeCallback()}get z(){return this._z}set z(e){this._z=e,this._onChangeCallback()}get w(){return this._w}set w(e){this._w=e,this._onChangeCallback()}set(e,t,n,s){return this._x=e,this._y=t,this._z=n,this._w=s,this._onChangeCallback(),this}clone(){return new this.constructor(this._x,this._y,this._z,this._w)}copy(e){return this._x=e.x,this._y=e.y,this._z=e.z,this._w=e.w,this._onChangeCallback(),this}setFromEuler(e,t=!0){let n=e._x,s=e._y,r=e._z,o=e._order,a=Math.cos,c=Math.sin,l=a(n/2),h=a(s/2),u=a(r/2),d=c(n/2),f=c(s/2),g=c(r/2);switch(o){case"XYZ":this._x=d*h*u+l*f*g,this._y=l*f*u-d*h*g,this._z=l*h*g+d*f*u,this._w=l*h*u-d*f*g;break;case"YXZ":this._x=d*h*u+l*f*g,this._y=l*f*u-d*h*g,this._z=l*h*g-d*f*u,this._w=l*h*u+d*f*g;break;case"ZXY":this._x=d*h*u-l*f*g,this._y=l*f*u+d*h*g,this._z=l*h*g+d*f*u,this._w=l*h*u-d*f*g;break;case"ZYX":this._x=d*h*u-l*f*g,this._y=l*f*u+d*h*g,this._z=l*h*g-d*f*u,this._w=l*h*u+d*f*g;break;case"YZX":this._x=d*h*u+l*f*g,this._y=l*f*u+d*h*g,this._z=l*h*g-d*f*u,this._w=l*h*u-d*f*g;break;case"XZY":this._x=d*h*u-l*f*g,this._y=l*f*u-d*h*g,this._z=l*h*g+d*f*u,this._w=l*h*u+d*f*g;break;default:console.warn("THREE.Quaternion: .setFromEuler() encountered an unknown order: "+o)}return t===!0&&this._onChangeCallback(),this}setFromAxisAngle(e,t){let n=t/2,s=Math.sin(n);return this._x=e.x*s,this._y=e.y*s,this._z=e.z*s,this._w=Math.cos(n),this._onChangeCallback(),this}setFromRotationMatrix(e){let t=e.elements,n=t[0],s=t[4],r=t[8],o=t[1],a=t[5],c=t[9],l=t[2],h=t[6],u=t[10],d=n+a+u;if(d>0){let f=.5/Math.sqrt(d+1);this._w=.25/f,this._x=(h-c)*f,this._y=(r-l)*f,this._z=(o-s)*f}else if(n>a&&n>u){let f=2*Math.sqrt(1+n-a-u);this._w=(h-c)/f,this._x=.25*f,this._y=(s+o)/f,this._z=(r+l)/f}else if(a>u){let f=2*Math.sqrt(1+a-n-u);this._w=(r-l)/f,this._x=(s+o)/f,this._y=.25*f,this._z=(c+h)/f}else{let f=2*Math.sqrt(1+u-n-a);this._w=(o-s)/f,this._x=(r+l)/f,this._y=(c+h)/f,this._z=.25*f}return this._onChangeCallback(),this}setFromUnitVectors(e,t){let n=e.dot(t)+1;return n<Number.EPSILON?(n=0,Math.abs(e.x)>Math.abs(e.z)?(this._x=-e.y,this._y=e.x,this._z=0,this._w=n):(this._x=0,this._y=-e.z,this._z=e.y,this._w=n)):(this._x=e.y*t.z-e.z*t.y,this._y=e.z*t.x-e.x*t.z,this._z=e.x*t.y-e.y*t.x,this._w=n),this.normalize()}angleTo(e){return 2*Math.acos(Math.abs(Lt(this.dot(e),-1,1)))}rotateTowards(e,t){let n=this.angleTo(e);if(n===0)return this;let s=Math.min(1,t/n);return this.slerp(e,s),this}identity(){return this.set(0,0,0,1)}invert(){return this.conjugate()}conjugate(){return this._x*=-1,this._y*=-1,this._z*=-1,this._onChangeCallback(),this}dot(e){return this._x*e._x+this._y*e._y+this._z*e._z+this._w*e._w}lengthSq(){return this._x*this._x+this._y*this._y+this._z*this._z+this._w*this._w}length(){return Math.sqrt(this._x*this._x+this._y*this._y+this._z*this._z+this._w*this._w)}normalize(){let e=this.length();return e===0?(this._x=0,this._y=0,this._z=0,this._w=1):(e=1/e,this._x=this._x*e,this._y=this._y*e,this._z=this._z*e,this._w=this._w*e),this._onChangeCallback(),this}multiply(e){return this.multiplyQuaternions(this,e)}premultiply(e){return this.multiplyQuaternions(e,this)}multiplyQuaternions(e,t){let n=e._x,s=e._y,r=e._z,o=e._w,a=t._x,c=t._y,l=t._z,h=t._w;return this._x=n*h+o*a+s*l-r*c,this._y=s*h+o*c+r*a-n*l,this._z=r*h+o*l+n*c-s*a,this._w=o*h-n*a-s*c-r*l,this._onChangeCallback(),this}slerp(e,t){if(t===0)return this;if(t===1)return this.copy(e);let n=this._x,s=this._y,r=this._z,o=this._w,a=o*e._w+n*e._x+s*e._y+r*e._z;if(a<0?(this._w=-e._w,this._x=-e._x,this._y=-e._y,this._z=-e._z,a=-a):this.copy(e),a>=1)return this._w=o,this._x=n,this._y=s,this._z=r,this;let c=1-a*a;if(c<=Number.EPSILON){let f=1-t;return this._w=f*o+t*this._w,this._x=f*n+t*this._x,this._y=f*s+t*this._y,this._z=f*r+t*this._z,this.normalize(),this}let l=Math.sqrt(c),h=Math.atan2(l,a),u=Math.sin((1-t)*h)/l,d=Math.sin(t*h)/l;return this._w=o*u+this._w*d,this._x=n*u+this._x*d,this._y=s*u+this._y*d,this._z=r*u+this._z*d,this._onChangeCallback(),this}slerpQuaternions(e,t,n){return this.copy(e).slerp(t,n)}random(){let e=2*Math.PI*Math.random(),t=2*Math.PI*Math.random(),n=Math.random(),s=Math.sqrt(1-n),r=Math.sqrt(n);return this.set(s*Math.sin(e),s*Math.cos(e),r*Math.sin(t),r*Math.cos(t))}equals(e){return e._x===this._x&&e._y===this._y&&e._z===this._z&&e._w===this._w}fromArray(e,t=0){return this._x=e[t],this._y=e[t+1],this._z=e[t+2],this._w=e[t+3],this._onChangeCallback(),this}toArray(e=[],t=0){return e[t]=this._x,e[t+1]=this._y,e[t+2]=this._z,e[t+3]=this._w,e}fromBufferAttribute(e,t){return this._x=e.getX(t),this._y=e.getY(t),this._z=e.getZ(t),this._w=e.getW(t),this._onChangeCallback(),this}toJSON(){return this.toArray()}_onChange(e){return this._onChangeCallback=e,this}_onChangeCallback(){}*[Symbol.iterator](){yield this._x,yield this._y,yield this._z,yield this._w}},A=class i{constructor(e=0,t=0,n=0){i.prototype.isVector3=!0,this.x=e,this.y=t,this.z=n}set(e,t,n){return n===void 0&&(n=this.z),this.x=e,this.y=t,this.z=n,this}setScalar(e){return this.x=e,this.y=e,this.z=e,this}setX(e){return this.x=e,this}setY(e){return this.y=e,this}setZ(e){return this.z=e,this}setComponent(e,t){switch(e){case 0:this.x=t;break;case 1:this.y=t;break;case 2:this.z=t;break;default:throw new Error("index is out of range: "+e)}return this}getComponent(e){switch(e){case 0:return this.x;case 1:return this.y;case 2:return this.z;default:throw new Error("index is out of range: "+e)}}clone(){return new this.constructor(this.x,this.y,this.z)}copy(e){return this.x=e.x,this.y=e.y,this.z=e.z,this}add(e){return this.x+=e.x,this.y+=e.y,this.z+=e.z,this}addScalar(e){return this.x+=e,this.y+=e,this.z+=e,this}addVectors(e,t){return this.x=e.x+t.x,this.y=e.y+t.y,this.z=e.z+t.z,this}addScaledVector(e,t){return this.x+=e.x*t,this.y+=e.y*t,this.z+=e.z*t,this}sub(e){return this.x-=e.x,this.y-=e.y,this.z-=e.z,this}subScalar(e){return this.x-=e,this.y-=e,this.z-=e,this}subVectors(e,t){return this.x=e.x-t.x,this.y=e.y-t.y,this.z=e.z-t.z,this}multiply(e){return this.x*=e.x,this.y*=e.y,this.z*=e.z,this}multiplyScalar(e){return this.x*=e,this.y*=e,this.z*=e,this}multiplyVectors(e,t){return this.x=e.x*t.x,this.y=e.y*t.y,this.z=e.z*t.z,this}applyEuler(e){return this.applyQuaternion(ku.setFromEuler(e))}applyAxisAngle(e,t){return this.applyQuaternion(ku.setFromAxisAngle(e,t))}applyMatrix3(e){let t=this.x,n=this.y,s=this.z,r=e.elements;return this.x=r[0]*t+r[3]*n+r[6]*s,this.y=r[1]*t+r[4]*n+r[7]*s,this.z=r[2]*t+r[5]*n+r[8]*s,this}applyNormalMatrix(e){return this.applyMatrix3(e).normalize()}applyMatrix4(e){let t=this.x,n=this.y,s=this.z,r=e.elements,o=1/(r[3]*t+r[7]*n+r[11]*s+r[15]);return this.x=(r[0]*t+r[4]*n+r[8]*s+r[12])*o,this.y=(r[1]*t+r[5]*n+r[9]*s+r[13])*o,this.z=(r[2]*t+r[6]*n+r[10]*s+r[14])*o,this}applyQuaternion(e){let t=this.x,n=this.y,s=this.z,r=e.x,o=e.y,a=e.z,c=e.w,l=2*(o*s-a*n),h=2*(a*t-r*s),u=2*(r*n-o*t);return this.x=t+c*l+o*u-a*h,this.y=n+c*h+a*l-r*u,this.z=s+c*u+r*h-o*l,this}project(e){return this.applyMatrix4(e.matrixWorldInverse).applyMatrix4(e.projectionMatrix)}unproject(e){return this.applyMatrix4(e.projectionMatrixInverse).applyMatrix4(e.matrixWorld)}transformDirection(e){let t=this.x,n=this.y,s=this.z,r=e.elements;return this.x=r[0]*t+r[4]*n+r[8]*s,this.y=r[1]*t+r[5]*n+r[9]*s,this.z=r[2]*t+r[6]*n+r[10]*s,this.normalize()}divide(e){return this.x/=e.x,this.y/=e.y,this.z/=e.z,this}divideScalar(e){return this.multiplyScalar(1/e)}min(e){return this.x=Math.min(this.x,e.x),this.y=Math.min(this.y,e.y),this.z=Math.min(this.z,e.z),this}max(e){return this.x=Math.max(this.x,e.x),this.y=Math.max(this.y,e.y),this.z=Math.max(this.z,e.z),this}clamp(e,t){return this.x=Math.max(e.x,Math.min(t.x,this.x)),this.y=Math.max(e.y,Math.min(t.y,this.y)),this.z=Math.max(e.z,Math.min(t.z,this.z)),this}clampScalar(e,t){return this.x=Math.max(e,Math.min(t,this.x)),this.y=Math.max(e,Math.min(t,this.y)),this.z=Math.max(e,Math.min(t,this.z)),this}clampLength(e,t){let n=this.length();return this.divideScalar(n||1).multiplyScalar(Math.max(e,Math.min(t,n)))}floor(){return this.x=Math.floor(this.x),this.y=Math.floor(this.y),this.z=Math.floor(this.z),this}ceil(){return this.x=Math.ceil(this.x),this.y=Math.ceil(this.y),this.z=Math.ceil(this.z),this}round(){return this.x=Math.round(this.x),this.y=Math.round(this.y),this.z=Math.round(this.z),this}roundToZero(){return this.x=Math.trunc(this.x),this.y=Math.trunc(this.y),this.z=Math.trunc(this.z),this}negate(){return this.x=-this.x,this.y=-this.y,this.z=-this.z,this}dot(e){return this.x*e.x+this.y*e.y+this.z*e.z}lengthSq(){return this.x*this.x+this.y*this.y+this.z*this.z}length(){return Math.sqrt(this.x*this.x+this.y*this.y+this.z*this.z)}manhattanLength(){return Math.abs(this.x)+Math.abs(this.y)+Math.abs(this.z)}normalize(){return this.divideScalar(this.length()||1)}setLength(e){return this.normalize().multiplyScalar(e)}lerp(e,t){return this.x+=(e.x-this.x)*t,this.y+=(e.y-this.y)*t,this.z+=(e.z-this.z)*t,this}lerpVectors(e,t,n){return this.x=e.x+(t.x-e.x)*n,this.y=e.y+(t.y-e.y)*n,this.z=e.z+(t.z-e.z)*n,this}cross(e){return this.crossVectors(this,e)}crossVectors(e,t){let n=e.x,s=e.y,r=e.z,o=t.x,a=t.y,c=t.z;return this.x=s*c-r*a,this.y=r*o-n*c,this.z=n*a-s*o,this}projectOnVector(e){let t=e.lengthSq();if(t===0)return this.set(0,0,0);let n=e.dot(this)/t;return this.copy(e).multiplyScalar(n)}projectOnPlane(e){return za.copy(this).projectOnVector(e),this.sub(za)}reflect(e){return this.sub(za.copy(e).multiplyScalar(2*this.dot(e)))}angleTo(e){let t=Math.sqrt(this.lengthSq()*e.lengthSq());if(t===0)return Math.PI/2;let n=this.dot(e)/t;return Math.acos(Lt(n,-1,1))}distanceTo(e){return Math.sqrt(this.distanceToSquared(e))}distanceToSquared(e){let t=this.x-e.x,n=this.y-e.y,s=this.z-e.z;return t*t+n*n+s*s}manhattanDistanceTo(e){return Math.abs(this.x-e.x)+Math.abs(this.y-e.y)+Math.abs(this.z-e.z)}setFromSpherical(e){return this.setFromSphericalCoords(e.radius,e.phi,e.theta)}setFromSphericalCoords(e,t,n){let s=Math.sin(t)*e;return this.x=s*Math.sin(n),this.y=Math.cos(t)*e,this.z=s*Math.cos(n),this}setFromCylindrical(e){return this.setFromCylindricalCoords(e.radius,e.theta,e.y)}setFromCylindricalCoords(e,t,n){return this.x=e*Math.sin(t),this.y=n,this.z=e*Math.cos(t),this}setFromMatrixPosition(e){let t=e.elements;return this.x=t[12],this.y=t[13],this.z=t[14],this}setFromMatrixScale(e){let t=this.setFromMatrixColumn(e,0).length(),n=this.setFromMatrixColumn(e,1).length(),s=this.setFromMatrixColumn(e,2).length();return this.x=t,this.y=n,this.z=s,this}setFromMatrixColumn(e,t){return this.fromArray(e.elements,t*4)}setFromMatrix3Column(e,t){return this.fromArray(e.elements,t*3)}setFromEuler(e){return this.x=e._x,this.y=e._y,this.z=e._z,this}setFromColor(e){return this.x=e.r,this.y=e.g,this.z=e.b,this}equals(e){return e.x===this.x&&e.y===this.y&&e.z===this.z}fromArray(e,t=0){return this.x=e[t],this.y=e[t+1],this.z=e[t+2],this}toArray(e=[],t=0){return e[t]=this.x,e[t+1]=this.y,e[t+2]=this.z,e}fromBufferAttribute(e,t){return this.x=e.getX(t),this.y=e.getY(t),this.z=e.getZ(t),this}random(){return this.x=Math.random(),this.y=Math.random(),this.z=Math.random(),this}randomDirection(){let e=Math.random()*Math.PI*2,t=Math.random()*2-1,n=Math.sqrt(1-t*t);return this.x=n*Math.cos(e),this.y=t,this.z=n*Math.sin(e),this}*[Symbol.iterator](){yield this.x,yield this.y,yield this.z}},za=new A,ku=new ri,Mn=class{constructor(e=new A(1/0,1/0,1/0),t=new A(-1/0,-1/0,-1/0)){this.isBox3=!0,this.min=e,this.max=t}set(e,t){return this.min.copy(e),this.max.copy(t),this}setFromArray(e){this.makeEmpty();for(let t=0,n=e.length;t<n;t+=3)this.expandByPoint(mn.fromArray(e,t));return this}setFromBufferAttribute(e){this.makeEmpty();for(let t=0,n=e.count;t<n;t++)this.expandByPoint(mn.fromBufferAttribute(e,t));return this}setFromPoints(e){this.makeEmpty();for(let t=0,n=e.length;t<n;t++)this.expandByPoint(e[t]);return this}setFromCenterAndSize(e,t){let n=mn.copy(t).multiplyScalar(.5);return this.min.copy(e).sub(n),this.max.copy(e).add(n),this}setFromObject(e,t=!1){return this.makeEmpty(),this.expandByObject(e,t)}clone(){return new this.constructor().copy(this)}copy(e){return this.min.copy(e.min),this.max.copy(e.max),this}makeEmpty(){return this.min.x=this.min.y=this.min.z=1/0,this.max.x=this.max.y=this.max.z=-1/0,this}isEmpty(){return this.max.x<this.min.x||this.max.y<this.min.y||this.max.z<this.min.z}getCenter(e){return this.isEmpty()?e.set(0,0,0):e.addVectors(this.min,this.max).multiplyScalar(.5)}getSize(e){return this.isEmpty()?e.set(0,0,0):e.subVectors(this.max,this.min)}expandByPoint(e){return this.min.min(e),this.max.max(e),this}expandByVector(e){return this.min.sub(e),this.max.add(e),this}expandByScalar(e){return this.min.addScalar(-e),this.max.addScalar(e),this}expandByObject(e,t=!1){e.updateWorldMatrix(!1,!1);let n=e.geometry;if(n!==void 0){let r=n.getAttribute("position");if(t===!0&&r!==void 0&&e.isInstancedMesh!==!0)for(let o=0,a=r.count;o<a;o++)e.isMesh===!0?e.getVertexPosition(o,mn):mn.fromBufferAttribute(r,o),mn.applyMatrix4(e.matrixWorld),this.expandByPoint(mn);else e.boundingBox!==void 0?(e.boundingBox===null&&e.computeBoundingBox(),Ur.copy(e.boundingBox)):(n.boundingBox===null&&n.computeBoundingBox(),Ur.copy(n.boundingBox)),Ur.applyMatrix4(e.matrixWorld),this.union(Ur)}let s=e.children;for(let r=0,o=s.length;r<o;r++)this.expandByObject(s[r],t);return this}containsPoint(e){return e.x>=this.min.x&&e.x<=this.max.x&&e.y>=this.min.y&&e.y<=this.max.y&&e.z>=this.min.z&&e.z<=this.max.z}containsBox(e){return this.min.x<=e.min.x&&e.max.x<=this.max.x&&this.min.y<=e.min.y&&e.max.y<=this.max.y&&this.min.z<=e.min.z&&e.max.z<=this.max.z}getParameter(e,t){return t.set((e.x-this.min.x)/(this.max.x-this.min.x),(e.y-this.min.y)/(this.max.y-this.min.y),(e.z-this.min.z)/(this.max.z-this.min.z))}intersectsBox(e){return e.max.x>=this.min.x&&e.min.x<=this.max.x&&e.max.y>=this.min.y&&e.min.y<=this.max.y&&e.max.z>=this.min.z&&e.min.z<=this.max.z}intersectsSphere(e){return this.clampPoint(e.center,mn),mn.distanceToSquared(e.center)<=e.radius*e.radius}intersectsPlane(e){let t,n;return e.normal.x>0?(t=e.normal.x*this.min.x,n=e.normal.x*this.max.x):(t=e.normal.x*this.max.x,n=e.normal.x*this.min.x),e.normal.y>0?(t+=e.normal.y*this.min.y,n+=e.normal.y*this.max.y):(t+=e.normal.y*this.max.y,n+=e.normal.y*this.min.y),e.normal.z>0?(t+=e.normal.z*this.min.z,n+=e.normal.z*this.max.z):(t+=e.normal.z*this.max.z,n+=e.normal.z*this.min.z),t<=-e.constant&&n>=-e.constant}intersectsTriangle(e){if(this.isEmpty())return!1;this.getCenter(Ds),Nr.subVectors(this.max,Ds),Bi.subVectors(e.a,Ds),zi.subVectors(e.b,Ds),Hi.subVectors(e.c,Ds),$n.subVectors(zi,Bi),Jn.subVectors(Hi,zi),ui.subVectors(Bi,Hi);let t=[0,-$n.z,$n.y,0,-Jn.z,Jn.y,0,-ui.z,ui.y,$n.z,0,-$n.x,Jn.z,0,-Jn.x,ui.z,0,-ui.x,-$n.y,$n.x,0,-Jn.y,Jn.x,0,-ui.y,ui.x,0];return!Ha(t,Bi,zi,Hi,Nr)||(t=[1,0,0,0,1,0,0,0,1],!Ha(t,Bi,zi,Hi,Nr))?!1:(kr.crossVectors($n,Jn),t=[kr.x,kr.y,kr.z],Ha(t,Bi,zi,Hi,Nr))}clampPoint(e,t){return t.copy(e).clamp(this.min,this.max)}distanceToPoint(e){return this.clampPoint(e,mn).distanceTo(e)}getBoundingSphere(e){return this.isEmpty()?e.makeEmpty():(this.getCenter(e.center),e.radius=this.getSize(mn).length()*.5),e}intersect(e){return this.min.max(e.min),this.max.min(e.max),this.isEmpty()&&this.makeEmpty(),this}union(e){return this.min.min(e.min),this.max.max(e.max),this}applyMatrix4(e){return this.isEmpty()?this:(Ln[0].set(this.min.x,this.min.y,this.min.z).applyMatrix4(e),Ln[1].set(this.min.x,this.min.y,this.max.z).applyMatrix4(e),Ln[2].set(this.min.x,this.max.y,this.min.z).applyMatrix4(e),Ln[3].set(this.min.x,this.max.y,this.max.z).applyMatrix4(e),Ln[4].set(this.max.x,this.min.y,this.min.z).applyMatrix4(e),Ln[5].set(this.max.x,this.min.y,this.max.z).applyMatrix4(e),Ln[6].set(this.max.x,this.max.y,this.min.z).applyMatrix4(e),Ln[7].set(this.max.x,this.max.y,this.max.z).applyMatrix4(e),this.setFromPoints(Ln),this)}translate(e){return this.min.add(e),this.max.add(e),this}equals(e){return e.min.equals(this.min)&&e.max.equals(this.max)}},Ln=[new A,new A,new A,new A,new A,new A,new A,new A],mn=new A,Ur=new Mn,Bi=new A,zi=new A,Hi=new A,$n=new A,Jn=new A,ui=new A,Ds=new A,Nr=new A,kr=new A,di=new A;function Ha(i,e,t,n,s){for(let r=0,o=i.length-3;r<=o;r+=3){di.fromArray(i,r);let a=s.x*Math.abs(di.x)+s.y*Math.abs(di.y)+s.z*Math.abs(di.z),c=e.dot(di),l=t.dot(di),h=n.dot(di);if(Math.max(-Math.max(c,l,h),Math.min(c,l,h))>a)return!1}return!0}var dm=new Mn,Us=new A,Va=new A,ds=class{constructor(e=new A,t=-1){this.isSphere=!0,this.center=e,this.radius=t}set(e,t){return this.center.copy(e),this.radius=t,this}setFromPoints(e,t){let n=this.center;t!==void 0?n.copy(t):dm.setFromPoints(e).getCenter(n);let s=0;for(let r=0,o=e.length;r<o;r++)s=Math.max(s,n.distanceToSquared(e[r]));return this.radius=Math.sqrt(s),this}copy(e){return this.center.copy(e.center),this.radius=e.radius,this}isEmpty(){return this.radius<0}makeEmpty(){return this.center.set(0,0,0),this.radius=-1,this}containsPoint(e){return e.distanceToSquared(this.center)<=this.radius*this.radius}distanceToPoint(e){return e.distanceTo(this.center)-this.radius}intersectsSphere(e){let t=this.radius+e.radius;return e.center.distanceToSquared(this.center)<=t*t}intersectsBox(e){return e.intersectsSphere(this)}intersectsPlane(e){return Math.abs(e.distanceToPoint(this.center))<=this.radius}clampPoint(e,t){let n=this.center.distanceToSquared(e);return t.copy(e),n>this.radius*this.radius&&(t.sub(this.center).normalize(),t.multiplyScalar(this.radius).add(this.center)),t}getBoundingBox(e){return this.isEmpty()?(e.makeEmpty(),e):(e.set(this.center,this.center),e.expandByScalar(this.radius),e)}applyMatrix4(e){return this.center.applyMatrix4(e),this.radius=this.radius*e.getMaxScaleOnAxis(),this}translate(e){return this.center.add(e),this}expandByPoint(e){if(this.isEmpty())return this.center.copy(e),this.radius=0,this;Us.subVectors(e,this.center);let t=Us.lengthSq();if(t>this.radius*this.radius){let n=Math.sqrt(t),s=(n-this.radius)*.5;this.center.addScaledVector(Us,s/n),this.radius+=s}return this}union(e){return e.isEmpty()?this:this.isEmpty()?(this.copy(e),this):(this.center.equals(e.center)===!0?this.radius=Math.max(this.radius,e.radius):(Va.subVectors(e.center,this.center).setLength(e.radius),this.expandByPoint(Us.copy(e.center).add(Va)),this.expandByPoint(Us.copy(e.center).sub(Va))),this)}equals(e){return e.center.equals(this.center)&&e.radius===this.radius}clone(){return new this.constructor().copy(this)}},Dn=new A,Ga=new A,Or=new A,Zn=new A,Wa=new A,Fr=new A,Xa=new A,Eo=class{constructor(e=new A,t=new A(0,0,-1)){this.origin=e,this.direction=t}set(e,t){return this.origin.copy(e),this.direction.copy(t),this}copy(e){return this.origin.copy(e.origin),this.direction.copy(e.direction),this}at(e,t){return t.copy(this.origin).addScaledVector(this.direction,e)}lookAt(e){return this.direction.copy(e).sub(this.origin).normalize(),this}recast(e){return this.origin.copy(this.at(e,Dn)),this}closestPointToPoint(e,t){t.subVectors(e,this.origin);let n=t.dot(this.direction);return n<0?t.copy(this.origin):t.copy(this.origin).addScaledVector(this.direction,n)}distanceToPoint(e){return Math.sqrt(this.distanceSqToPoint(e))}distanceSqToPoint(e){let t=Dn.subVectors(e,this.origin).dot(this.direction);return t<0?this.origin.distanceToSquared(e):(Dn.copy(this.origin).addScaledVector(this.direction,t),Dn.distanceToSquared(e))}distanceSqToSegment(e,t,n,s){Ga.copy(e).add(t).multiplyScalar(.5),Or.copy(t).sub(e).normalize(),Zn.copy(this.origin).sub(Ga);let r=e.distanceTo(t)*.5,o=-this.direction.dot(Or),a=Zn.dot(this.direction),c=-Zn.dot(Or),l=Zn.lengthSq(),h=Math.abs(1-o*o),u,d,f,g;if(h>0)if(u=o*c-a,d=o*a-c,g=r*h,u>=0)if(d>=-g)if(d<=g){let y=1/h;u*=y,d*=y,f=u*(u+o*d+2*a)+d*(o*u+d+2*c)+l}else d=r,u=Math.max(0,-(o*d+a)),f=-u*u+d*(d+2*c)+l;else d=-r,u=Math.max(0,-(o*d+a)),f=-u*u+d*(d+2*c)+l;else d<=-g?(u=Math.max(0,-(-o*r+a)),d=u>0?-r:Math.min(Math.max(-r,-c),r),f=-u*u+d*(d+2*c)+l):d<=g?(u=0,d=Math.min(Math.max(-r,-c),r),f=d*(d+2*c)+l):(u=Math.max(0,-(o*r+a)),d=u>0?r:Math.min(Math.max(-r,-c),r),f=-u*u+d*(d+2*c)+l);else d=o>0?-r:r,u=Math.max(0,-(o*d+a)),f=-u*u+d*(d+2*c)+l;return n&&n.copy(this.origin).addScaledVector(this.direction,u),s&&s.copy(Ga).addScaledVector(Or,d),f}intersectSphere(e,t){Dn.subVectors(e.center,this.origin);let n=Dn.dot(this.direction),s=Dn.dot(Dn)-n*n,r=e.radius*e.radius;if(s>r)return null;let o=Math.sqrt(r-s),a=n-o,c=n+o;return c<0?null:a<0?this.at(c,t):this.at(a,t)}intersectsSphere(e){return this.distanceSqToPoint(e.center)<=e.radius*e.radius}distanceToPlane(e){let t=e.normal.dot(this.direction);if(t===0)return e.distanceToPoint(this.origin)===0?0:null;let n=-(this.origin.dot(e.normal)+e.constant)/t;return n>=0?n:null}intersectPlane(e,t){let n=this.distanceToPlane(e);return n===null?null:this.at(n,t)}intersectsPlane(e){let t=e.distanceToPoint(this.origin);return t===0||e.normal.dot(this.direction)*t<0}intersectBox(e,t){let n,s,r,o,a,c,l=1/this.direction.x,h=1/this.direction.y,u=1/this.direction.z,d=this.origin;return l>=0?(n=(e.min.x-d.x)*l,s=(e.max.x-d.x)*l):(n=(e.max.x-d.x)*l,s=(e.min.x-d.x)*l),h>=0?(r=(e.min.y-d.y)*h,o=(e.max.y-d.y)*h):(r=(e.max.y-d.y)*h,o=(e.min.y-d.y)*h),n>o||r>s||((r>n||isNaN(n))&&(n=r),(o<s||isNaN(s))&&(s=o),u>=0?(a=(e.min.z-d.z)*u,c=(e.max.z-d.z)*u):(a=(e.max.z-d.z)*u,c=(e.min.z-d.z)*u),n>c||a>s)||((a>n||n!==n)&&(n=a),(c<s||s!==s)&&(s=c),s<0)?null:this.at(n>=0?n:s,t)}intersectsBox(e){return this.intersectBox(e,Dn)!==null}intersectTriangle(e,t,n,s,r){Wa.subVectors(t,e),Fr.subVectors(n,e),Xa.crossVectors(Wa,Fr);let o=this.direction.dot(Xa),a;if(o>0){if(s)return null;a=1}else if(o<0)a=-1,o=-o;else return null;Zn.subVectors(this.origin,e);let c=a*this.direction.dot(Fr.crossVectors(Zn,Fr));if(c<0)return null;let l=a*this.direction.dot(Wa.cross(Zn));if(l<0||c+l>o)return null;let h=-a*Zn.dot(Xa);return h<0?null:this.at(h/o,r)}applyMatrix4(e){return this.origin.applyMatrix4(e),this.direction.transformDirection(e),this}equals(e){return e.origin.equals(this.origin)&&e.direction.equals(this.direction)}clone(){return new this.constructor().copy(this)}},_t=class i{constructor(e,t,n,s,r,o,a,c,l,h,u,d,f,g,y,m){i.prototype.isMatrix4=!0,this.elements=[1,0,0,0,0,1,0,0,0,0,1,0,0,0,0,1],e!==void 0&&this.set(e,t,n,s,r,o,a,c,l,h,u,d,f,g,y,m)}set(e,t,n,s,r,o,a,c,l,h,u,d,f,g,y,m){let p=this.elements;return p[0]=e,p[4]=t,p[8]=n,p[12]=s,p[1]=r,p[5]=o,p[9]=a,p[13]=c,p[2]=l,p[6]=h,p[10]=u,p[14]=d,p[3]=f,p[7]=g,p[11]=y,p[15]=m,this}identity(){return this.set(1,0,0,0,0,1,0,0,0,0,1,0,0,0,0,1),this}clone(){return new i().fromArray(this.elements)}copy(e){let t=this.elements,n=e.elements;return t[0]=n[0],t[1]=n[1],t[2]=n[2],t[3]=n[3],t[4]=n[4],t[5]=n[5],t[6]=n[6],t[7]=n[7],t[8]=n[8],t[9]=n[9],t[10]=n[10],t[11]=n[11],t[12]=n[12],t[13]=n[13],t[14]=n[14],t[15]=n[15],this}copyPosition(e){let t=this.elements,n=e.elements;return t[12]=n[12],t[13]=n[13],t[14]=n[14],this}setFromMatrix3(e){let t=e.elements;return this.set(t[0],t[3],t[6],0,t[1],t[4],t[7],0,t[2],t[5],t[8],0,0,0,0,1),this}extractBasis(e,t,n){return e.setFromMatrixColumn(this,0),t.setFromMatrixColumn(this,1),n.setFromMatrixColumn(this,2),this}makeBasis(e,t,n){return this.set(e.x,t.x,n.x,0,e.y,t.y,n.y,0,e.z,t.z,n.z,0,0,0,0,1),this}extractRotation(e){let t=this.elements,n=e.elements,s=1/Vi.setFromMatrixColumn(e,0).length(),r=1/Vi.setFromMatrixColumn(e,1).length(),o=1/Vi.setFromMatrixColumn(e,2).length();return t[0]=n[0]*s,t[1]=n[1]*s,t[2]=n[2]*s,t[3]=0,t[4]=n[4]*r,t[5]=n[5]*r,t[6]=n[6]*r,t[7]=0,t[8]=n[8]*o,t[9]=n[9]*o,t[10]=n[10]*o,t[11]=0,t[12]=0,t[13]=0,t[14]=0,t[15]=1,this}makeRotationFromEuler(e){let t=this.elements,n=e.x,s=e.y,r=e.z,o=Math.cos(n),a=Math.sin(n),c=Math.cos(s),l=Math.sin(s),h=Math.cos(r),u=Math.sin(r);if(e.order==="XYZ"){let d=o*h,f=o*u,g=a*h,y=a*u;t[0]=c*h,t[4]=-c*u,t[8]=l,t[1]=f+g*l,t[5]=d-y*l,t[9]=-a*c,t[2]=y-d*l,t[6]=g+f*l,t[10]=o*c}else if(e.order==="YXZ"){let d=c*h,f=c*u,g=l*h,y=l*u;t[0]=d+y*a,t[4]=g*a-f,t[8]=o*l,t[1]=o*u,t[5]=o*h,t[9]=-a,t[2]=f*a-g,t[6]=y+d*a,t[10]=o*c}else if(e.order==="ZXY"){let d=c*h,f=c*u,g=l*h,y=l*u;t[0]=d-y*a,t[4]=-o*u,t[8]=g+f*a,t[1]=f+g*a,t[5]=o*h,t[9]=y-d*a,t[2]=-o*l,t[6]=a,t[10]=o*c}else if(e.order==="ZYX"){let d=o*h,f=o*u,g=a*h,y=a*u;t[0]=c*h,t[4]=g*l-f,t[8]=d*l+y,t[1]=c*u,t[5]=y*l+d,t[9]=f*l-g,t[2]=-l,t[6]=a*c,t[10]=o*c}else if(e.order==="YZX"){let d=o*c,f=o*l,g=a*c,y=a*l;t[0]=c*h,t[4]=y-d*u,t[8]=g*u+f,t[1]=u,t[5]=o*h,t[9]=-a*h,t[2]=-l*h,t[6]=f*u+g,t[10]=d-y*u}else if(e.order==="XZY"){let d=o*c,f=o*l,g=a*c,y=a*l;t[0]=c*h,t[4]=-u,t[8]=l*h,t[1]=d*u+y,t[5]=o*h,t[9]=f*u-g,t[2]=g*u-f,t[6]=a*h,t[10]=y*u+d}return t[3]=0,t[7]=0,t[11]=0,t[12]=0,t[13]=0,t[14]=0,t[15]=1,this}makeRotationFromQuaternion(e){return this.compose(fm,e,pm)}lookAt(e,t,n){let s=this.elements;return Qt.subVectors(e,t),Qt.lengthSq()===0&&(Qt.z=1),Qt.normalize(),jn.crossVectors(n,Qt),jn.lengthSq()===0&&(Math.abs(n.z)===1?Qt.x+=1e-4:Qt.z+=1e-4,Qt.normalize(),jn.crossVectors(n,Qt)),jn.normalize(),Br.crossVectors(Qt,jn),s[0]=jn.x,s[4]=Br.x,s[8]=Qt.x,s[1]=jn.y,s[5]=Br.y,s[9]=Qt.y,s[2]=jn.z,s[6]=Br.z,s[10]=Qt.z,this}multiply(e){return this.multiplyMatrices(this,e)}premultiply(e){return this.multiplyMatrices(e,this)}multiplyMatrices(e,t){let n=e.elements,s=t.elements,r=this.elements,o=n[0],a=n[4],c=n[8],l=n[12],h=n[1],u=n[5],d=n[9],f=n[13],g=n[2],y=n[6],m=n[10],p=n[14],b=n[3],x=n[7],M=n[11],D=n[15],w=s[0],R=s[4],P=s[8],H=s[12],_=s[1],S=s[5],z=s[9],I=s[13],k=s[2],K=s[6],G=s[10],ce=s[14],X=s[3],ve=s[7],Me=s[11],Se=s[15];return r[0]=o*w+a*_+c*k+l*X,r[4]=o*R+a*S+c*K+l*ve,r[8]=o*P+a*z+c*G+l*Me,r[12]=o*H+a*I+c*ce+l*Se,r[1]=h*w+u*_+d*k+f*X,r[5]=h*R+u*S+d*K+f*ve,r[9]=h*P+u*z+d*G+f*Me,r[13]=h*H+u*I+d*ce+f*Se,r[2]=g*w+y*_+m*k+p*X,r[6]=g*R+y*S+m*K+p*ve,r[10]=g*P+y*z+m*G+p*Me,r[14]=g*H+y*I+m*ce+p*Se,r[3]=b*w+x*_+M*k+D*X,r[7]=b*R+x*S+M*K+D*ve,r[11]=b*P+x*z+M*G+D*Me,r[15]=b*H+x*I+M*ce+D*Se,this}multiplyScalar(e){let t=this.elements;return t[0]*=e,t[4]*=e,t[8]*=e,t[12]*=e,t[1]*=e,t[5]*=e,t[9]*=e,t[13]*=e,t[2]*=e,t[6]*=e,t[10]*=e,t[14]*=e,t[3]*=e,t[7]*=e,t[11]*=e,t[15]*=e,this}determinant(){let e=this.elements,t=e[0],n=e[4],s=e[8],r=e[12],o=e[1],a=e[5],c=e[9],l=e[13],h=e[2],u=e[6],d=e[10],f=e[14],g=e[3],y=e[7],m=e[11],p=e[15];return g*(+r*c*u-s*l*u-r*a*d+n*l*d+s*a*f-n*c*f)+y*(+t*c*f-t*l*d+r*o*d-s*o*f+s*l*h-r*c*h)+m*(+t*l*u-t*a*f-r*o*u+n*o*f+r*a*h-n*l*h)+p*(-s*a*h-t*c*u+t*a*d+s*o*u-n*o*d+n*c*h)}transpose(){let e=this.elements,t;return t=e[1],e[1]=e[4],e[4]=t,t=e[2],e[2]=e[8],e[8]=t,t=e[6],e[6]=e[9],e[9]=t,t=e[3],e[3]=e[12],e[12]=t,t=e[7],e[7]=e[13],e[13]=t,t=e[11],e[11]=e[14],e[14]=t,this}setPosition(e,t,n){let s=this.elements;return e.isVector3?(s[12]=e.x,s[13]=e.y,s[14]=e.z):(s[12]=e,s[13]=t,s[14]=n),this}invert(){let e=this.elements,t=e[0],n=e[1],s=e[2],r=e[3],o=e[4],a=e[5],c=e[6],l=e[7],h=e[8],u=e[9],d=e[10],f=e[11],g=e[12],y=e[13],m=e[14],p=e[15],b=u*m*l-y*d*l+y*c*f-a*m*f-u*c*p+a*d*p,x=g*d*l-h*m*l-g*c*f+o*m*f+h*c*p-o*d*p,M=h*y*l-g*u*l+g*a*f-o*y*f-h*a*p+o*u*p,D=g*u*c-h*y*c-g*a*d+o*y*d+h*a*m-o*u*m,w=t*b+n*x+s*M+r*D;if(w===0)return this.set(0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0);let R=1/w;return e[0]=b*R,e[1]=(y*d*r-u*m*r-y*s*f+n*m*f+u*s*p-n*d*p)*R,e[2]=(a*m*r-y*c*r+y*s*l-n*m*l-a*s*p+n*c*p)*R,e[3]=(u*c*r-a*d*r-u*s*l+n*d*l+a*s*f-n*c*f)*R,e[4]=x*R,e[5]=(h*m*r-g*d*r+g*s*f-t*m*f-h*s*p+t*d*p)*R,e[6]=(g*c*r-o*m*r-g*s*l+t*m*l+o*s*p-t*c*p)*R,e[7]=(o*d*r-h*c*r+h*s*l-t*d*l-o*s*f+t*c*f)*R,e[8]=M*R,e[9]=(g*u*r-h*y*r-g*n*f+t*y*f+h*n*p-t*u*p)*R,e[10]=(o*y*r-g*a*r+g*n*l-t*y*l-o*n*p+t*a*p)*R,e[11]=(h*a*r-o*u*r-h*n*l+t*u*l+o*n*f-t*a*f)*R,e[12]=D*R,e[13]=(h*y*s-g*u*s+g*n*d-t*y*d-h*n*m+t*u*m)*R,e[14]=(g*a*s-o*y*s-g*n*c+t*y*c+o*n*m-t*a*m)*R,e[15]=(o*u*s-h*a*s+h*n*c-t*u*c-o*n*d+t*a*d)*R,this}scale(e){let t=this.elements,n=e.x,s=e.y,r=e.z;return t[0]*=n,t[4]*=s,t[8]*=r,t[1]*=n,t[5]*=s,t[9]*=r,t[2]*=n,t[6]*=s,t[10]*=r,t[3]*=n,t[7]*=s,t[11]*=r,this}getMaxScaleOnAxis(){let e=this.elements,t=e[0]*e[0]+e[1]*e[1]+e[2]*e[2],n=e[4]*e[4]+e[5]*e[5]+e[6]*e[6],s=e[8]*e[8]+e[9]*e[9]+e[10]*e[10];return Math.sqrt(Math.max(t,n,s))}makeTranslation(e,t,n){return e.isVector3?this.set(1,0,0,e.x,0,1,0,e.y,0,0,1,e.z,0,0,0,1):this.set(1,0,0,e,0,1,0,t,0,0,1,n,0,0,0,1),this}makeRotationX(e){let t=Math.cos(e),n=Math.sin(e);return this.set(1,0,0,0,0,t,-n,0,0,n,t,0,0,0,0,1),this}makeRotationY(e){let t=Math.cos(e),n=Math.sin(e);return this.set(t,0,n,0,0,1,0,0,-n,0,t,0,0,0,0,1),this}makeRotationZ(e){let t=Math.cos(e),n=Math.sin(e);return this.set(t,-n,0,0,n,t,0,0,0,0,1,0,0,0,0,1),this}makeRotationAxis(e,t){let n=Math.cos(t),s=Math.sin(t),r=1-n,o=e.x,a=e.y,c=e.z,l=r*o,h=r*a;return this.set(l*o+n,l*a-s*c,l*c+s*a,0,l*a+s*c,h*a+n,h*c-s*o,0,l*c-s*a,h*c+s*o,r*c*c+n,0,0,0,0,1),this}makeScale(e,t,n){return this.set(e,0,0,0,0,t,0,0,0,0,n,0,0,0,0,1),this}makeShear(e,t,n,s,r,o){return this.set(1,n,r,0,e,1,o,0,t,s,1,0,0,0,0,1),this}compose(e,t,n){let s=this.elements,r=t._x,o=t._y,a=t._z,c=t._w,l=r+r,h=o+o,u=a+a,d=r*l,f=r*h,g=r*u,y=o*h,m=o*u,p=a*u,b=c*l,x=c*h,M=c*u,D=n.x,w=n.y,R=n.z;return s[0]=(1-(y+p))*D,s[1]=(f+M)*D,s[2]=(g-x)*D,s[3]=0,s[4]=(f-M)*w,s[5]=(1-(d+p))*w,s[6]=(m+b)*w,s[7]=0,s[8]=(g+x)*R,s[9]=(m-b)*R,s[10]=(1-(d+y))*R,s[11]=0,s[12]=e.x,s[13]=e.y,s[14]=e.z,s[15]=1,this}decompose(e,t,n){let s=this.elements,r=Vi.set(s[0],s[1],s[2]).length(),o=Vi.set(s[4],s[5],s[6]).length(),a=Vi.set(s[8],s[9],s[10]).length();this.determinant()<0&&(r=-r),e.x=s[12],e.y=s[13],e.z=s[14],gn.copy(this);let l=1/r,h=1/o,u=1/a;return gn.elements[0]*=l,gn.elements[1]*=l,gn.elements[2]*=l,gn.elements[4]*=h,gn.elements[5]*=h,gn.elements[6]*=h,gn.elements[8]*=u,gn.elements[9]*=u,gn.elements[10]*=u,t.setFromRotationMatrix(gn),n.x=r,n.y=o,n.z=a,this}makePerspective(e,t,n,s,r,o,a=Hn){let c=this.elements,l=2*r/(t-e),h=2*r/(n-s),u=(t+e)/(t-e),d=(n+s)/(n-s),f,g;if(a===Hn)f=-(o+r)/(o-r),g=-2*o*r/(o-r);else if(a===vo)f=-o/(o-r),g=-o*r/(o-r);else throw new Error("THREE.Matrix4.makePerspective(): Invalid coordinate system: "+a);return c[0]=l,c[4]=0,c[8]=u,c[12]=0,c[1]=0,c[5]=h,c[9]=d,c[13]=0,c[2]=0,c[6]=0,c[10]=f,c[14]=g,c[3]=0,c[7]=0,c[11]=-1,c[15]=0,this}makeOrthographic(e,t,n,s,r,o,a=Hn){let c=this.elements,l=1/(t-e),h=1/(n-s),u=1/(o-r),d=(t+e)*l,f=(n+s)*h,g,y;if(a===Hn)g=(o+r)*u,y=-2*u;else if(a===vo)g=r*u,y=-1*u;else throw new Error("THREE.Matrix4.makeOrthographic(): Invalid coordinate system: "+a);return c[0]=2*l,c[4]=0,c[8]=0,c[12]=-d,c[1]=0,c[5]=2*h,c[9]=0,c[13]=-f,c[2]=0,c[6]=0,c[10]=y,c[14]=-g,c[3]=0,c[7]=0,c[11]=0,c[15]=1,this}equals(e){let t=this.elements,n=e.elements;for(let s=0;s<16;s++)if(t[s]!==n[s])return!1;return!0}fromArray(e,t=0){for(let n=0;n<16;n++)this.elements[n]=e[n+t];return this}toArray(e=[],t=0){let n=this.elements;return e[t]=n[0],e[t+1]=n[1],e[t+2]=n[2],e[t+3]=n[3],e[t+4]=n[4],e[t+5]=n[5],e[t+6]=n[6],e[t+7]=n[7],e[t+8]=n[8],e[t+9]=n[9],e[t+10]=n[10],e[t+11]=n[11],e[t+12]=n[12],e[t+13]=n[13],e[t+14]=n[14],e[t+15]=n[15],e}},Vi=new A,gn=new _t,fm=new A(0,0,0),pm=new A(1,1,1),jn=new A,Br=new A,Qt=new A,Ou=new _t,Fu=new ri,Cn=class i{constructor(e=0,t=0,n=0,s=i.DEFAULT_ORDER){this.isEuler=!0,this._x=e,this._y=t,this._z=n,this._order=s}get x(){return this._x}set x(e){this._x=e,this._onChangeCallback()}get y(){return this._y}set y(e){this._y=e,this._onChangeCallback()}get z(){return this._z}set z(e){this._z=e,this._onChangeCallback()}get order(){return this._order}set order(e){this._order=e,this._onChangeCallback()}set(e,t,n,s=this._order){return this._x=e,this._y=t,this._z=n,this._order=s,this._onChangeCallback(),this}clone(){return new this.constructor(this._x,this._y,this._z,this._order)}copy(e){return this._x=e._x,this._y=e._y,this._z=e._z,this._order=e._order,this._onChangeCallback(),this}setFromRotationMatrix(e,t=this._order,n=!0){let s=e.elements,r=s[0],o=s[4],a=s[8],c=s[1],l=s[5],h=s[9],u=s[2],d=s[6],f=s[10];switch(t){case"XYZ":this._y=Math.asin(Lt(a,-1,1)),Math.abs(a)<.9999999?(this._x=Math.atan2(-h,f),this._z=Math.atan2(-o,r)):(this._x=Math.atan2(d,l),this._z=0);break;case"YXZ":this._x=Math.asin(-Lt(h,-1,1)),Math.abs(h)<.9999999?(this._y=Math.atan2(a,f),this._z=Math.atan2(c,l)):(this._y=Math.atan2(-u,r),this._z=0);break;case"ZXY":this._x=Math.asin(Lt(d,-1,1)),Math.abs(d)<.9999999?(this._y=Math.atan2(-u,f),this._z=Math.atan2(-o,l)):(this._y=0,this._z=Math.atan2(c,r));break;case"ZYX":this._y=Math.asin(-Lt(u,-1,1)),Math.abs(u)<.9999999?(this._x=Math.atan2(d,f),this._z=Math.atan2(c,r)):(this._x=0,this._z=Math.atan2(-o,l));break;case"YZX":this._z=Math.asin(Lt(c,-1,1)),Math.abs(c)<.9999999?(this._x=Math.atan2(-h,l),this._y=Math.atan2(-u,r)):(this._x=0,this._y=Math.atan2(a,f));break;case"XZY":this._z=Math.asin(-Lt(o,-1,1)),Math.abs(o)<.9999999?(this._x=Math.atan2(d,l),this._y=Math.atan2(a,r)):(this._x=Math.atan2(-h,f),this._y=0);break;default:console.warn("THREE.Euler: .setFromRotationMatrix() encountered an unknown order: "+t)}return this._order=t,n===!0&&this._onChangeCallback(),this}setFromQuaternion(e,t,n){return Ou.makeRotationFromQuaternion(e),this.setFromRotationMatrix(Ou,t,n)}setFromVector3(e,t=this._order){return this.set(e.x,e.y,e.z,t)}reorder(e){return Fu.setFromEuler(this),this.setFromQuaternion(Fu,e)}equals(e){return e._x===this._x&&e._y===this._y&&e._z===this._z&&e._order===this._order}fromArray(e){return this._x=e[0],this._y=e[1],this._z=e[2],e[3]!==void 0&&(this._order=e[3]),this._onChangeCallback(),this}toArray(e=[],t=0){return e[t]=this._x,e[t+1]=this._y,e[t+2]=this._z,e[t+3]=this._order,e}_onChange(e){return this._onChangeCallback=e,this}_onChangeCallback(){}*[Symbol.iterator](){yield this._x,yield this._y,yield this._z,yield this._order}};Cn.DEFAULT_ORDER="XYZ";var To=class{constructor(){this.mask=1}set(e){this.mask=(1<<e|0)>>>0}enable(e){this.mask|=1<<e|0}enableAll(){this.mask=-1}toggle(e){this.mask^=1<<e|0}disable(e){this.mask&=~(1<<e|0)}disableAll(){this.mask=0}test(e){return(this.mask&e.mask)!==0}isEnabled(e){return(this.mask&(1<<e|0))!==0}},mm=0,Bu=new A,Gi=new ri,Un=new _t,zr=new A,Ns=new A,gm=new A,_m=new ri,zu=new A(1,0,0),Hu=new A(0,1,0),Vu=new A(0,0,1),Gu={type:"added"},ym={type:"removed"},Wi={type:"childadded",child:null},qa={type:"childremoved",child:null},Ft=class i extends si{constructor(){super(),this.isObject3D=!0,Object.defineProperty(this,"id",{value:mm++}),this.uuid=Tn(),this.name="",this.type="Object3D",this.parent=null,this.children=[],this.up=i.DEFAULT_UP.clone();let e=new A,t=new Cn,n=new ri,s=new A(1,1,1);function r(){n.setFromEuler(t,!1)}function o(){t.setFromQuaternion(n,void 0,!1)}t._onChange(r),n._onChange(o),Object.defineProperties(this,{position:{configurable:!0,enumerable:!0,value:e},rotation:{configurable:!0,enumerable:!0,value:t},quaternion:{configurable:!0,enumerable:!0,value:n},scale:{configurable:!0,enumerable:!0,value:s},modelViewMatrix:{value:new _t},normalMatrix:{value:new je}}),this.matrix=new _t,this.matrixWorld=new _t,this.matrixAutoUpdate=i.DEFAULT_MATRIX_AUTO_UPDATE,this.matrixWorldAutoUpdate=i.DEFAULT_MATRIX_WORLD_AUTO_UPDATE,this.matrixWorldNeedsUpdate=!1,this.layers=new To,this.visible=!0,this.castShadow=!1,this.receiveShadow=!1,this.frustumCulled=!0,this.renderOrder=0,this.animations=[],this.userData={}}onBeforeShadow(){}onAfterShadow(){}onBeforeRender(){}onAfterRender(){}applyMatrix4(e){this.matrixAutoUpdate&&this.updateMatrix(),this.matrix.premultiply(e),this.matrix.decompose(this.position,this.quaternion,this.scale)}applyQuaternion(e){return this.quaternion.premultiply(e),this}setRotationFromAxisAngle(e,t){this.quaternion.setFromAxisAngle(e,t)}setRotationFromEuler(e){this.quaternion.setFromEuler(e,!0)}setRotationFromMatrix(e){this.quaternion.setFromRotationMatrix(e)}setRotationFromQuaternion(e){this.quaternion.copy(e)}rotateOnAxis(e,t){return Gi.setFromAxisAngle(e,t),this.quaternion.multiply(Gi),this}rotateOnWorldAxis(e,t){return Gi.setFromAxisAngle(e,t),this.quaternion.premultiply(Gi),this}rotateX(e){return this.rotateOnAxis(zu,e)}rotateY(e){return this.rotateOnAxis(Hu,e)}rotateZ(e){return this.rotateOnAxis(Vu,e)}translateOnAxis(e,t){return Bu.copy(e).applyQuaternion(this.quaternion),this.position.add(Bu.multiplyScalar(t)),this}translateX(e){return this.translateOnAxis(zu,e)}translateY(e){return this.translateOnAxis(Hu,e)}translateZ(e){return this.translateOnAxis(Vu,e)}localToWorld(e){return this.updateWorldMatrix(!0,!1),e.applyMatrix4(this.matrixWorld)}worldToLocal(e){return this.updateWorldMatrix(!0,!1),e.applyMatrix4(Un.copy(this.matrixWorld).invert())}lookAt(e,t,n){e.isVector3?zr.copy(e):zr.set(e,t,n);let s=this.parent;this.updateWorldMatrix(!0,!1),Ns.setFromMatrixPosition(this.matrixWorld),this.isCamera||this.isLight?Un.lookAt(Ns,zr,this.up):Un.lookAt(zr,Ns,this.up),this.quaternion.setFromRotationMatrix(Un),s&&(Un.extractRotation(s.matrixWorld),Gi.setFromRotationMatrix(Un),this.quaternion.premultiply(Gi.invert()))}add(e){if(arguments.length>1){for(let t=0;t<arguments.length;t++)this.add(arguments[t]);return this}return e===this?(console.error("THREE.Object3D.add: object can't be added as a child of itself.",e),this):(e&&e.isObject3D?(e.removeFromParent(),e.parent=this,this.children.push(e),e.dispatchEvent(Gu),Wi.child=e,this.dispatchEvent(Wi),Wi.child=null):console.error("THREE.Object3D.add: object not an instance of THREE.Object3D.",e),this)}remove(e){if(arguments.length>1){for(let n=0;n<arguments.length;n++)this.remove(arguments[n]);return this}let t=this.children.indexOf(e);return t!==-1&&(e.parent=null,this.children.splice(t,1),e.dispatchEvent(ym),qa.child=e,this.dispatchEvent(qa),qa.child=null),this}removeFromParent(){let e=this.parent;return e!==null&&e.remove(this),this}clear(){return this.remove(...this.children)}attach(e){return this.updateWorldMatrix(!0,!1),Un.copy(this.matrixWorld).invert(),e.parent!==null&&(e.parent.updateWorldMatrix(!0,!1),Un.multiply(e.parent.matrixWorld)),e.applyMatrix4(Un),e.removeFromParent(),e.parent=this,this.children.push(e),e.updateWorldMatrix(!1,!0),e.dispatchEvent(Gu),Wi.child=e,this.dispatchEvent(Wi),Wi.child=null,this}getObjectById(e){return this.getObjectByProperty("id",e)}getObjectByName(e){return this.getObjectByProperty("name",e)}getObjectByProperty(e,t){if(this[e]===t)return this;for(let n=0,s=this.children.length;n<s;n++){let o=this.children[n].getObjectByProperty(e,t);if(o!==void 0)return o}}getObjectsByProperty(e,t,n=[]){this[e]===t&&n.push(this);let s=this.children;for(let r=0,o=s.length;r<o;r++)s[r].getObjectsByProperty(e,t,n);return n}getWorldPosition(e){return this.updateWorldMatrix(!0,!1),e.setFromMatrixPosition(this.matrixWorld)}getWorldQuaternion(e){return this.updateWorldMatrix(!0,!1),this.matrixWorld.decompose(Ns,e,gm),e}getWorldScale(e){return this.updateWorldMatrix(!0,!1),this.matrixWorld.decompose(Ns,_m,e),e}getWorldDirection(e){this.updateWorldMatrix(!0,!1);let t=this.matrixWorld.elements;return e.set(t[8],t[9],t[10]).normalize()}raycast(){}traverse(e){e(this);let t=this.children;for(let n=0,s=t.length;n<s;n++)t[n].traverse(e)}traverseVisible(e){if(this.visible===!1)return;e(this);let t=this.children;for(let n=0,s=t.length;n<s;n++)t[n].traverseVisible(e)}traverseAncestors(e){let t=this.parent;t!==null&&(e(t),t.traverseAncestors(e))}updateMatrix(){this.matrix.compose(this.position,this.quaternion,this.scale),this.matrixWorldNeedsUpdate=!0}updateMatrixWorld(e){this.matrixAutoUpdate&&this.updateMatrix(),(this.matrixWorldNeedsUpdate||e)&&(this.matrixWorldAutoUpdate===!0&&(this.parent===null?this.matrixWorld.copy(this.matrix):this.matrixWorld.multiplyMatrices(this.parent.matrixWorld,this.matrix)),this.matrixWorldNeedsUpdate=!1,e=!0);let t=this.children;for(let n=0,s=t.length;n<s;n++)t[n].updateMatrixWorld(e)}updateWorldMatrix(e,t){let n=this.parent;if(e===!0&&n!==null&&n.updateWorldMatrix(!0,!1),this.matrixAutoUpdate&&this.updateMatrix(),this.matrixWorldAutoUpdate===!0&&(this.parent===null?this.matrixWorld.copy(this.matrix):this.matrixWorld.multiplyMatrices(this.parent.matrixWorld,this.matrix)),t===!0){let s=this.children;for(let r=0,o=s.length;r<o;r++)s[r].updateWorldMatrix(!1,!0)}}toJSON(e){let t=e===void 0||typeof e=="string",n={};t&&(e={geometries:{},materials:{},textures:{},images:{},shapes:{},skeletons:{},animations:{},nodes:{}},n.metadata={version:4.6,type:"Object",generator:"Object3D.toJSON"});let s={};s.uuid=this.uuid,s.type=this.type,this.name!==""&&(s.name=this.name),this.castShadow===!0&&(s.castShadow=!0),this.receiveShadow===!0&&(s.receiveShadow=!0),this.visible===!1&&(s.visible=!1),this.frustumCulled===!1&&(s.frustumCulled=!1),this.renderOrder!==0&&(s.renderOrder=this.renderOrder),Object.keys(this.userData).length>0&&(s.userData=this.userData),s.layers=this.layers.mask,s.matrix=this.matrix.toArray(),s.up=this.up.toArray(),this.matrixAutoUpdate===!1&&(s.matrixAutoUpdate=!1),this.isInstancedMesh&&(s.type="InstancedMesh",s.count=this.count,s.instanceMatrix=this.instanceMatrix.toJSON(),this.instanceColor!==null&&(s.instanceColor=this.instanceColor.toJSON())),this.isBatchedMesh&&(s.type="BatchedMesh",s.perObjectFrustumCulled=this.perObjectFrustumCulled,s.sortObjects=this.sortObjects,s.drawRanges=this._drawRanges,s.reservedRanges=this._reservedRanges,s.visibility=this._visibility,s.active=this._active,s.bounds=this._bounds.map(a=>({boxInitialized:a.boxInitialized,boxMin:a.box.min.toArray(),boxMax:a.box.max.toArray(),sphereInitialized:a.sphereInitialized,sphereRadius:a.sphere.radius,sphereCenter:a.sphere.center.toArray()})),s.maxInstanceCount=this._maxInstanceCount,s.maxVertexCount=this._maxVertexCount,s.maxIndexCount=this._maxIndexCount,s.geometryInitialized=this._geometryInitialized,s.geometryCount=this._geometryCount,s.matricesTexture=this._matricesTexture.toJSON(e),this._colorsTexture!==null&&(s.colorsTexture=this._colorsTexture.toJSON(e)),this.boundingSphere!==null&&(s.boundingSphere={center:s.boundingSphere.center.toArray(),radius:s.boundingSphere.radius}),this.boundingBox!==null&&(s.boundingBox={min:s.boundingBox.min.toArray(),max:s.boundingBox.max.toArray()}));function r(a,c){return a[c.uuid]===void 0&&(a[c.uuid]=c.toJSON(e)),c.uuid}if(this.isScene)this.background&&(this.background.isColor?s.background=this.background.toJSON():this.background.isTexture&&(s.background=this.background.toJSON(e).uuid)),this.environment&&this.environment.isTexture&&this.environment.isRenderTargetTexture!==!0&&(s.environment=this.environment.toJSON(e).uuid);else if(this.isMesh||this.isLine||this.isPoints){s.geometry=r(e.geometries,this.geometry);let a=this.geometry.parameters;if(a!==void 0&&a.shapes!==void 0){let c=a.shapes;if(Array.isArray(c))for(let l=0,h=c.length;l<h;l++){let u=c[l];r(e.shapes,u)}else r(e.shapes,c)}}if(this.isSkinnedMesh&&(s.bindMode=this.bindMode,s.bindMatrix=this.bindMatrix.toArray(),this.skeleton!==void 0&&(r(e.skeletons,this.skeleton),s.skeleton=this.skeleton.uuid)),this.material!==void 0)if(Array.isArray(this.material)){let a=[];for(let c=0,l=this.material.length;c<l;c++)a.push(r(e.materials,this.material[c]));s.material=a}else s.material=r(e.materials,this.material);if(this.children.length>0){s.children=[];for(let a=0;a<this.children.length;a++)s.children.push(this.children[a].toJSON(e).object)}if(this.animations.length>0){s.animations=[];for(let a=0;a<this.animations.length;a++){let c=this.animations[a];s.animations.push(r(e.animations,c))}}if(t){let a=o(e.geometries),c=o(e.materials),l=o(e.textures),h=o(e.images),u=o(e.shapes),d=o(e.skeletons),f=o(e.animations),g=o(e.nodes);a.length>0&&(n.geometries=a),c.length>0&&(n.materials=c),l.length>0&&(n.textures=l),h.length>0&&(n.images=h),u.length>0&&(n.shapes=u),d.length>0&&(n.skeletons=d),f.length>0&&(n.animations=f),g.length>0&&(n.nodes=g)}return n.object=s,n;function o(a){let c=[];for(let l in a){let h=a[l];delete h.metadata,c.push(h)}return c}}clone(e){return new this.constructor().copy(this,e)}copy(e,t=!0){if(this.name=e.name,this.up.copy(e.up),this.position.copy(e.position),this.rotation.order=e.rotation.order,this.quaternion.copy(e.quaternion),this.scale.copy(e.scale),this.matrix.copy(e.matrix),this.matrixWorld.copy(e.matrixWorld),this.matrixAutoUpdate=e.matrixAutoUpdate,this.matrixWorldAutoUpdate=e.matrixWorldAutoUpdate,this.matrixWorldNeedsUpdate=e.matrixWorldNeedsUpdate,this.layers.mask=e.layers.mask,this.visible=e.visible,this.castShadow=e.castShadow,this.receiveShadow=e.receiveShadow,this.frustumCulled=e.frustumCulled,this.renderOrder=e.renderOrder,this.animations=e.animations.slice(),this.userData=JSON.parse(JSON.stringify(e.userData)),t===!0)for(let n=0;n<e.children.length;n++){let s=e.children[n];this.add(s.clone())}return this}};Ft.DEFAULT_UP=new A(0,1,0);Ft.DEFAULT_MATRIX_AUTO_UPDATE=!0;Ft.DEFAULT_MATRIX_WORLD_AUTO_UPDATE=!0;var _n=new A,Nn=new A,Ya=new A,kn=new A,Xi=new A,qi=new A,Wu=new A,$a=new A,Ja=new A,Za=new A,ja=new ft,Ka=new ft,Qa=new ft,ti=class i{constructor(e=new A,t=new A,n=new A){this.a=e,this.b=t,this.c=n}static getNormal(e,t,n,s){s.subVectors(n,t),_n.subVectors(e,t),s.cross(_n);let r=s.lengthSq();return r>0?s.multiplyScalar(1/Math.sqrt(r)):s.set(0,0,0)}static getBarycoord(e,t,n,s,r){_n.subVectors(s,t),Nn.subVectors(n,t),Ya.subVectors(e,t);let o=_n.dot(_n),a=_n.dot(Nn),c=_n.dot(Ya),l=Nn.dot(Nn),h=Nn.dot(Ya),u=o*l-a*a;if(u===0)return r.set(0,0,0),null;let d=1/u,f=(l*c-a*h)*d,g=(o*h-a*c)*d;return r.set(1-f-g,g,f)}static containsPoint(e,t,n,s){return this.getBarycoord(e,t,n,s,kn)===null?!1:kn.x>=0&&kn.y>=0&&kn.x+kn.y<=1}static getInterpolation(e,t,n,s,r,o,a,c){return this.getBarycoord(e,t,n,s,kn)===null?(c.x=0,c.y=0,"z"in c&&(c.z=0),"w"in c&&(c.w=0),null):(c.setScalar(0),c.addScaledVector(r,kn.x),c.addScaledVector(o,kn.y),c.addScaledVector(a,kn.z),c)}static getInterpolatedAttribute(e,t,n,s,r,o){return ja.setScalar(0),Ka.setScalar(0),Qa.setScalar(0),ja.fromBufferAttribute(e,t),Ka.fromBufferAttribute(e,n),Qa.fromBufferAttribute(e,s),o.setScalar(0),o.addScaledVector(ja,r.x),o.addScaledVector(Ka,r.y),o.addScaledVector(Qa,r.z),o}static isFrontFacing(e,t,n,s){return _n.subVectors(n,t),Nn.subVectors(e,t),_n.cross(Nn).dot(s)<0}set(e,t,n){return this.a.copy(e),this.b.copy(t),this.c.copy(n),this}setFromPointsAndIndices(e,t,n,s){return this.a.copy(e[t]),this.b.copy(e[n]),this.c.copy(e[s]),this}setFromAttributeAndIndices(e,t,n,s){return this.a.fromBufferAttribute(e,t),this.b.fromBufferAttribute(e,n),this.c.fromBufferAttribute(e,s),this}clone(){return new this.constructor().copy(this)}copy(e){return this.a.copy(e.a),this.b.copy(e.b),this.c.copy(e.c),this}getArea(){return _n.subVectors(this.c,this.b),Nn.subVectors(this.a,this.b),_n.cross(Nn).length()*.5}getMidpoint(e){return e.addVectors(this.a,this.b).add(this.c).multiplyScalar(1/3)}getNormal(e){return i.getNormal(this.a,this.b,this.c,e)}getPlane(e){return e.setFromCoplanarPoints(this.a,this.b,this.c)}getBarycoord(e,t){return i.getBarycoord(e,this.a,this.b,this.c,t)}getInterpolation(e,t,n,s,r){return i.getInterpolation(e,this.a,this.b,this.c,t,n,s,r)}containsPoint(e){return i.containsPoint(e,this.a,this.b,this.c)}isFrontFacing(e){return i.isFrontFacing(this.a,this.b,this.c,e)}intersectsBox(e){return e.intersectsTriangle(this)}closestPointToPoint(e,t){let n=this.a,s=this.b,r=this.c,o,a;Xi.subVectors(s,n),qi.subVectors(r,n),$a.subVectors(e,n);let c=Xi.dot($a),l=qi.dot($a);if(c<=0&&l<=0)return t.copy(n);Ja.subVectors(e,s);let h=Xi.dot(Ja),u=qi.dot(Ja);if(h>=0&&u<=h)return t.copy(s);let d=c*u-h*l;if(d<=0&&c>=0&&h<=0)return o=c/(c-h),t.copy(n).addScaledVector(Xi,o);Za.subVectors(e,r);let f=Xi.dot(Za),g=qi.dot(Za);if(g>=0&&f<=g)return t.copy(r);let y=f*l-c*g;if(y<=0&&l>=0&&g<=0)return a=l/(l-g),t.copy(n).addScaledVector(qi,a);let m=h*g-f*u;if(m<=0&&u-h>=0&&f-g>=0)return Wu.subVectors(r,s),a=(u-h)/(u-h+(f-g)),t.copy(s).addScaledVector(Wu,a);let p=1/(m+y+d);return o=y*p,a=d*p,t.copy(n).addScaledVector(Xi,o).addScaledVector(qi,a)}equals(e){return e.a.equals(this.a)&&e.b.equals(this.b)&&e.c.equals(this.c)}},Yd={aliceblue:15792383,antiquewhite:16444375,aqua:65535,aquamarine:8388564,azure:15794175,beige:16119260,bisque:16770244,black:0,blanchedalmond:16772045,blue:255,blueviolet:9055202,brown:10824234,burlywood:14596231,cadetblue:6266528,chartreuse:8388352,chocolate:13789470,coral:16744272,cornflowerblue:6591981,cornsilk:16775388,crimson:14423100,cyan:65535,darkblue:139,darkcyan:35723,darkgoldenrod:12092939,darkgray:11119017,darkgreen:25600,darkgrey:11119017,darkkhaki:12433259,darkmagenta:9109643,darkolivegreen:5597999,darkorange:16747520,darkorchid:10040012,darkred:9109504,darksalmon:15308410,darkseagreen:9419919,darkslateblue:4734347,darkslategray:3100495,darkslategrey:3100495,darkturquoise:52945,darkviolet:9699539,deeppink:16716947,deepskyblue:49151,dimgray:6908265,dimgrey:6908265,dodgerblue:2003199,firebrick:11674146,floralwhite:16775920,forestgreen:2263842,fuchsia:16711935,gainsboro:14474460,ghostwhite:16316671,gold:16766720,goldenrod:14329120,gray:8421504,green:32768,greenyellow:11403055,grey:8421504,honeydew:15794160,hotpink:16738740,indianred:13458524,indigo:4915330,ivory:16777200,khaki:15787660,lavender:15132410,lavenderblush:16773365,lawngreen:8190976,lemonchiffon:16775885,lightblue:11393254,lightcoral:15761536,lightcyan:14745599,lightgoldenrodyellow:16448210,lightgray:13882323,lightgreen:9498256,lightgrey:13882323,lightpink:16758465,lightsalmon:16752762,lightseagreen:2142890,lightskyblue:8900346,lightslategray:7833753,lightslategrey:7833753,lightsteelblue:11584734,lightyellow:16777184,lime:65280,limegreen:3329330,linen:16445670,magenta:16711935,maroon:8388608,mediumaquamarine:6737322,mediumblue:205,mediumorchid:12211667,mediumpurple:9662683,mediumseagreen:3978097,mediumslateblue:8087790,mediumspringgreen:64154,mediumturquoise:4772300,mediumvioletred:13047173,midnightblue:1644912,mintcream:16121850,mistyrose:16770273,moccasin:16770229,navajowhite:16768685,navy:128,oldlace:16643558,olive:8421376,olivedrab:7048739,orange:16753920,orangered:16729344,orchid:14315734,palegoldenrod:15657130,palegreen:10025880,paleturquoise:11529966,palevioletred:14381203,papayawhip:16773077,peachpuff:16767673,peru:13468991,pink:16761035,plum:14524637,powderblue:11591910,purple:8388736,rebeccapurple:6697881,red:16711680,rosybrown:12357519,royalblue:4286945,saddlebrown:9127187,salmon:16416882,sandybrown:16032864,seagreen:3050327,seashell:16774638,sienna:10506797,silver:12632256,skyblue:8900331,slateblue:6970061,slategray:7372944,slategrey:7372944,snow:16775930,springgreen:65407,steelblue:4620980,tan:13808780,teal:32896,thistle:14204888,tomato:16737095,turquoise:4251856,violet:15631086,wheat:16113331,white:16777215,whitesmoke:16119285,yellow:16776960,yellowgreen:10145074},Kn={h:0,s:0,l:0},Hr={h:0,s:0,l:0};function ec(i,e,t){return t<0&&(t+=1),t>1&&(t-=1),t<1/6?i+(e-i)*6*t:t<1/2?e:t<2/3?i+(e-i)*6*(2/3-t):i}var Qe=class{constructor(e,t,n){return this.isColor=!0,this.r=1,this.g=1,this.b=1,this.set(e,t,n)}set(e,t,n){if(t===void 0&&n===void 0){let s=e;s&&s.isColor?this.copy(s):typeof s=="number"?this.setHex(s):typeof s=="string"&&this.setStyle(s)}else this.setRGB(e,t,n);return this}setScalar(e){return this.r=e,this.g=e,this.b=e,this}setHex(e,t=Xt){return e=Math.floor(e),this.r=(e>>16&255)/255,this.g=(e>>8&255)/255,this.b=(e&255)/255,ct.toWorkingColorSpace(this,t),this}setRGB(e,t,n,s=ct.workingColorSpace){return this.r=e,this.g=t,this.b=n,ct.toWorkingColorSpace(this,s),this}setHSL(e,t,n,s=ct.workingColorSpace){if(e=Ql(e,1),t=Lt(t,0,1),n=Lt(n,0,1),t===0)this.r=this.g=this.b=n;else{let r=n<=.5?n*(1+t):n+t-n*t,o=2*n-r;this.r=ec(o,r,e+1/3),this.g=ec(o,r,e),this.b=ec(o,r,e-1/3)}return ct.toWorkingColorSpace(this,s),this}setStyle(e,t=Xt){function n(r){r!==void 0&&parseFloat(r)<1&&console.warn("THREE.Color: Alpha component of "+e+" will be ignored.")}let s;if(s=/^(\w+)\(([^\)]*)\)/.exec(e)){let r,o=s[1],a=s[2];switch(o){case"rgb":case"rgba":if(r=/^\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)\s*(?:,\s*(\d*\.?\d+)\s*)?$/.exec(a))return n(r[4]),this.setRGB(Math.min(255,parseInt(r[1],10))/255,Math.min(255,parseInt(r[2],10))/255,Math.min(255,parseInt(r[3],10))/255,t);if(r=/^\s*(\d+)\%\s*,\s*(\d+)\%\s*,\s*(\d+)\%\s*(?:,\s*(\d*\.?\d+)\s*)?$/.exec(a))return n(r[4]),this.setRGB(Math.min(100,parseInt(r[1],10))/100,Math.min(100,parseInt(r[2],10))/100,Math.min(100,parseInt(r[3],10))/100,t);break;case"hsl":case"hsla":if(r=/^\s*(\d*\.?\d+)\s*,\s*(\d*\.?\d+)\%\s*,\s*(\d*\.?\d+)\%\s*(?:,\s*(\d*\.?\d+)\s*)?$/.exec(a))return n(r[4]),this.setHSL(parseFloat(r[1])/360,parseFloat(r[2])/100,parseFloat(r[3])/100,t);break;default:console.warn("THREE.Color: Unknown color model "+e)}}else if(s=/^\#([A-Fa-f\d]+)$/.exec(e)){let r=s[1],o=r.length;if(o===3)return this.setRGB(parseInt(r.charAt(0),16)/15,parseInt(r.charAt(1),16)/15,parseInt(r.charAt(2),16)/15,t);if(o===6)return this.setHex(parseInt(r,16),t);console.warn("THREE.Color: Invalid hex color "+e)}else if(e&&e.length>0)return this.setColorName(e,t);return this}setColorName(e,t=Xt){let n=Yd[e.toLowerCase()];return n!==void 0?this.setHex(n,t):console.warn("THREE.Color: Unknown color "+e),this}clone(){return new this.constructor(this.r,this.g,this.b)}copy(e){return this.r=e.r,this.g=e.g,this.b=e.b,this}copySRGBToLinear(e){return this.r=rs(e.r),this.g=rs(e.g),this.b=rs(e.b),this}copyLinearToSRGB(e){return this.r=Fa(e.r),this.g=Fa(e.g),this.b=Fa(e.b),this}convertSRGBToLinear(){return this.copySRGBToLinear(this),this}convertLinearToSRGB(){return this.copyLinearToSRGB(this),this}getHex(e=Xt){return ct.fromWorkingColorSpace(zt.copy(this),e),Math.round(Lt(zt.r*255,0,255))*65536+Math.round(Lt(zt.g*255,0,255))*256+Math.round(Lt(zt.b*255,0,255))}getHexString(e=Xt){return("000000"+this.getHex(e).toString(16)).slice(-6)}getHSL(e,t=ct.workingColorSpace){ct.fromWorkingColorSpace(zt.copy(this),t);let n=zt.r,s=zt.g,r=zt.b,o=Math.max(n,s,r),a=Math.min(n,s,r),c,l,h=(a+o)/2;if(a===o)c=0,l=0;else{let u=o-a;switch(l=h<=.5?u/(o+a):u/(2-o-a),o){case n:c=(s-r)/u+(s<r?6:0);break;case s:c=(r-n)/u+2;break;case r:c=(n-s)/u+4;break}c/=6}return e.h=c,e.s=l,e.l=h,e}getRGB(e,t=ct.workingColorSpace){return ct.fromWorkingColorSpace(zt.copy(this),t),e.r=zt.r,e.g=zt.g,e.b=zt.b,e}getStyle(e=Xt){ct.fromWorkingColorSpace(zt.copy(this),e);let t=zt.r,n=zt.g,s=zt.b;return e!==Xt?`color(${e} ${t.toFixed(3)} ${n.toFixed(3)} ${s.toFixed(3)})`:`rgb(${Math.round(t*255)},${Math.round(n*255)},${Math.round(s*255)})`}offsetHSL(e,t,n){return this.getHSL(Kn),this.setHSL(Kn.h+e,Kn.s+t,Kn.l+n)}add(e){return this.r+=e.r,this.g+=e.g,this.b+=e.b,this}addColors(e,t){return this.r=e.r+t.r,this.g=e.g+t.g,this.b=e.b+t.b,this}addScalar(e){return this.r+=e,this.g+=e,this.b+=e,this}sub(e){return this.r=Math.max(0,this.r-e.r),this.g=Math.max(0,this.g-e.g),this.b=Math.max(0,this.b-e.b),this}multiply(e){return this.r*=e.r,this.g*=e.g,this.b*=e.b,this}multiplyScalar(e){return this.r*=e,this.g*=e,this.b*=e,this}lerp(e,t){return this.r+=(e.r-this.r)*t,this.g+=(e.g-this.g)*t,this.b+=(e.b-this.b)*t,this}lerpColors(e,t,n){return this.r=e.r+(t.r-e.r)*n,this.g=e.g+(t.g-e.g)*n,this.b=e.b+(t.b-e.b)*n,this}lerpHSL(e,t){this.getHSL(Kn),e.getHSL(Hr);let n=Ws(Kn.h,Hr.h,t),s=Ws(Kn.s,Hr.s,t),r=Ws(Kn.l,Hr.l,t);return this.setHSL(n,s,r),this}setFromVector3(e){return this.r=e.x,this.g=e.y,this.b=e.z,this}applyMatrix3(e){let t=this.r,n=this.g,s=this.b,r=e.elements;return this.r=r[0]*t+r[3]*n+r[6]*s,this.g=r[1]*t+r[4]*n+r[7]*s,this.b=r[2]*t+r[5]*n+r[8]*s,this}equals(e){return e.r===this.r&&e.g===this.g&&e.b===this.b}fromArray(e,t=0){return this.r=e[t],this.g=e[t+1],this.b=e[t+2],this}toArray(e=[],t=0){return e[t]=this.r,e[t+1]=this.g,e[t+2]=this.b,e}fromBufferAttribute(e,t){return this.r=e.getX(t),this.g=e.getY(t),this.b=e.getZ(t),this}toJSON(){return this.getHex()}*[Symbol.iterator](){yield this.r,yield this.g,yield this.b}},zt=new Qe;Qe.NAMES=Yd;var xm=0,Wn=class extends si{constructor(){super(),this.isMaterial=!0,Object.defineProperty(this,"id",{value:xm++}),this.uuid=Tn(),this.name="",this.type="Material",this.blending=is,this.side=wn,this.vertexColors=!1,this.opacity=1,this.transparent=!1,this.alphaHash=!1,this.blendSrc=_c,this.blendDst=yc,this.blendEquation=yi,this.blendSrcAlpha=null,this.blendDstAlpha=null,this.blendEquationAlpha=null,this.blendColor=new Qe(0,0,0),this.blendAlpha=0,this.depthFunc=as,this.depthTest=!0,this.depthWrite=!0,this.stencilWriteMask=255,this.stencilFunc=Pu,this.stencilRef=0,this.stencilFuncMask=255,this.stencilFail=Oi,this.stencilZFail=Oi,this.stencilZPass=Oi,this.stencilWrite=!1,this.clippingPlanes=null,this.clipIntersection=!1,this.clipShadows=!1,this.shadowSide=null,this.colorWrite=!0,this.precision=null,this.polygonOffset=!1,this.polygonOffsetFactor=0,this.polygonOffsetUnits=0,this.dithering=!1,this.alphaToCoverage=!1,this.premultipliedAlpha=!1,this.forceSinglePass=!1,this.visible=!0,this.toneMapped=!0,this.userData={},this.version=0,this._alphaTest=0}get alphaTest(){return this._alphaTest}set alphaTest(e){this._alphaTest>0!=e>0&&this.version++,this._alphaTest=e}onBeforeRender(){}onBeforeCompile(){}customProgramCacheKey(){return this.onBeforeCompile.toString()}setValues(e){if(e!==void 0)for(let t in e){let n=e[t];if(n===void 0){console.warn(`THREE.Material: parameter '${t}' has value of undefined.`);continue}let s=this[t];if(s===void 0){console.warn(`THREE.Material: '${t}' is not a property of THREE.${this.type}.`);continue}s&&s.isColor?s.set(n):s&&s.isVector3&&n&&n.isVector3?s.copy(n):this[t]=n}}toJSON(e){let t=e===void 0||typeof e=="string";t&&(e={textures:{},images:{}});let n={metadata:{version:4.6,type:"Material",generator:"Material.toJSON"}};n.uuid=this.uuid,n.type=this.type,this.name!==""&&(n.name=this.name),this.color&&this.color.isColor&&(n.color=this.color.getHex()),this.roughness!==void 0&&(n.roughness=this.roughness),this.metalness!==void 0&&(n.metalness=this.metalness),this.sheen!==void 0&&(n.sheen=this.sheen),this.sheenColor&&this.sheenColor.isColor&&(n.sheenColor=this.sheenColor.getHex()),this.sheenRoughness!==void 0&&(n.sheenRoughness=this.sheenRoughness),this.emissive&&this.emissive.isColor&&(n.emissive=this.emissive.getHex()),this.emissiveIntensity!==void 0&&this.emissiveIntensity!==1&&(n.emissiveIntensity=this.emissiveIntensity),this.specular&&this.specular.isColor&&(n.specular=this.specular.getHex()),this.specularIntensity!==void 0&&(n.specularIntensity=this.specularIntensity),this.specularColor&&this.specularColor.isColor&&(n.specularColor=this.specularColor.getHex()),this.shininess!==void 0&&(n.shininess=this.shininess),this.clearcoat!==void 0&&(n.clearcoat=this.clearcoat),this.clearcoatRoughness!==void 0&&(n.clearcoatRoughness=this.clearcoatRoughness),this.clearcoatMap&&this.clearcoatMap.isTexture&&(n.clearcoatMap=this.clearcoatMap.toJSON(e).uuid),this.clearcoatRoughnessMap&&this.clearcoatRoughnessMap.isTexture&&(n.clearcoatRoughnessMap=this.clearcoatRoughnessMap.toJSON(e).uuid),this.clearcoatNormalMap&&this.clearcoatNormalMap.isTexture&&(n.clearcoatNormalMap=this.clearcoatNormalMap.toJSON(e).uuid,n.clearcoatNormalScale=this.clearcoatNormalScale.toArray()),this.dispersion!==void 0&&(n.dispersion=this.dispersion),this.iridescence!==void 0&&(n.iridescence=this.iridescence),this.iridescenceIOR!==void 0&&(n.iridescenceIOR=this.iridescenceIOR),this.iridescenceThicknessRange!==void 0&&(n.iridescenceThicknessRange=this.iridescenceThicknessRange),this.iridescenceMap&&this.iridescenceMap.isTexture&&(n.iridescenceMap=this.iridescenceMap.toJSON(e).uuid),this.iridescenceThicknessMap&&this.iridescenceThicknessMap.isTexture&&(n.iridescenceThicknessMap=this.iridescenceThicknessMap.toJSON(e).uuid),this.anisotropy!==void 0&&(n.anisotropy=this.anisotropy),this.anisotropyRotation!==void 0&&(n.anisotropyRotation=this.anisotropyRotation),this.anisotropyMap&&this.anisotropyMap.isTexture&&(n.anisotropyMap=this.anisotropyMap.toJSON(e).uuid),this.map&&this.map.isTexture&&(n.map=this.map.toJSON(e).uuid),this.matcap&&this.matcap.isTexture&&(n.matcap=this.matcap.toJSON(e).uuid),this.alphaMap&&this.alphaMap.isTexture&&(n.alphaMap=this.alphaMap.toJSON(e).uuid),this.lightMap&&this.lightMap.isTexture&&(n.lightMap=this.lightMap.toJSON(e).uuid,n.lightMapIntensity=this.lightMapIntensity),this.aoMap&&this.aoMap.isTexture&&(n.aoMap=this.aoMap.toJSON(e).uuid,n.aoMapIntensity=this.aoMapIntensity),this.bumpMap&&this.bumpMap.isTexture&&(n.bumpMap=this.bumpMap.toJSON(e).uuid,n.bumpScale=this.bumpScale),this.normalMap&&this.normalMap.isTexture&&(n.normalMap=this.normalMap.toJSON(e).uuid,n.normalMapType=this.normalMapType,n.normalScale=this.normalScale.toArray()),this.displacementMap&&this.displacementMap.isTexture&&(n.displacementMap=this.displacementMap.toJSON(e).uuid,n.displacementScale=this.displacementScale,n.displacementBias=this.displacementBias),this.roughnessMap&&this.roughnessMap.isTexture&&(n.roughnessMap=this.roughnessMap.toJSON(e).uuid),this.metalnessMap&&this.metalnessMap.isTexture&&(n.metalnessMap=this.metalnessMap.toJSON(e).uuid),this.emissiveMap&&this.emissiveMap.isTexture&&(n.emissiveMap=this.emissiveMap.toJSON(e).uuid),this.specularMap&&this.specularMap.isTexture&&(n.specularMap=this.specularMap.toJSON(e).uuid),this.specularIntensityMap&&this.specularIntensityMap.isTexture&&(n.specularIntensityMap=this.specularIntensityMap.toJSON(e).uuid),this.specularColorMap&&this.specularColorMap.isTexture&&(n.specularColorMap=this.specularColorMap.toJSON(e).uuid),this.envMap&&this.envMap.isTexture&&(n.envMap=this.envMap.toJSON(e).uuid,this.combine!==void 0&&(n.combine=this.combine)),this.envMapRotation!==void 0&&(n.envMapRotation=this.envMapRotation.toArray()),this.envMapIntensity!==void 0&&(n.envMapIntensity=this.envMapIntensity),this.reflectivity!==void 0&&(n.reflectivity=this.reflectivity),this.refractionRatio!==void 0&&(n.refractionRatio=this.refractionRatio),this.gradientMap&&this.gradientMap.isTexture&&(n.gradientMap=this.gradientMap.toJSON(e).uuid),this.transmission!==void 0&&(n.transmission=this.transmission),this.transmissionMap&&this.transmissionMap.isTexture&&(n.transmissionMap=this.transmissionMap.toJSON(e).uuid),this.thickness!==void 0&&(n.thickness=this.thickness),this.thicknessMap&&this.thicknessMap.isTexture&&(n.thicknessMap=this.thicknessMap.toJSON(e).uuid),this.attenuationDistance!==void 0&&this.attenuationDistance!==1/0&&(n.attenuationDistance=this.attenuationDistance),this.attenuationColor!==void 0&&(n.attenuationColor=this.attenuationColor.getHex()),this.size!==void 0&&(n.size=this.size),this.shadowSide!==null&&(n.shadowSide=this.shadowSide),this.sizeAttenuation!==void 0&&(n.sizeAttenuation=this.sizeAttenuation),this.blending!==is&&(n.blending=this.blending),this.side!==wn&&(n.side=this.side),this.vertexColors===!0&&(n.vertexColors=!0),this.opacity<1&&(n.opacity=this.opacity),this.transparent===!0&&(n.transparent=!0),this.blendSrc!==_c&&(n.blendSrc=this.blendSrc),this.blendDst!==yc&&(n.blendDst=this.blendDst),this.blendEquation!==yi&&(n.blendEquation=this.blendEquation),this.blendSrcAlpha!==null&&(n.blendSrcAlpha=this.blendSrcAlpha),this.blendDstAlpha!==null&&(n.blendDstAlpha=this.blendDstAlpha),this.blendEquationAlpha!==null&&(n.blendEquationAlpha=this.blendEquationAlpha),this.blendColor&&this.blendColor.isColor&&(n.blendColor=this.blendColor.getHex()),this.blendAlpha!==0&&(n.blendAlpha=this.blendAlpha),this.depthFunc!==as&&(n.depthFunc=this.depthFunc),this.depthTest===!1&&(n.depthTest=this.depthTest),this.depthWrite===!1&&(n.depthWrite=this.depthWrite),this.colorWrite===!1&&(n.colorWrite=this.colorWrite),this.stencilWriteMask!==255&&(n.stencilWriteMask=this.stencilWriteMask),this.stencilFunc!==Pu&&(n.stencilFunc=this.stencilFunc),this.stencilRef!==0&&(n.stencilRef=this.stencilRef),this.stencilFuncMask!==255&&(n.stencilFuncMask=this.stencilFuncMask),this.stencilFail!==Oi&&(n.stencilFail=this.stencilFail),this.stencilZFail!==Oi&&(n.stencilZFail=this.stencilZFail),this.stencilZPass!==Oi&&(n.stencilZPass=this.stencilZPass),this.stencilWrite===!0&&(n.stencilWrite=this.stencilWrite),this.rotation!==void 0&&this.rotation!==0&&(n.rotation=this.rotation),this.polygonOffset===!0&&(n.polygonOffset=!0),this.polygonOffsetFactor!==0&&(n.polygonOffsetFactor=this.polygonOffsetFactor),this.polygonOffsetUnits!==0&&(n.polygonOffsetUnits=this.polygonOffsetUnits),this.linewidth!==void 0&&this.linewidth!==1&&(n.linewidth=this.linewidth),this.dashSize!==void 0&&(n.dashSize=this.dashSize),this.gapSize!==void 0&&(n.gapSize=this.gapSize),this.scale!==void 0&&(n.scale=this.scale),this.dithering===!0&&(n.dithering=!0),this.alphaTest>0&&(n.alphaTest=this.alphaTest),this.alphaHash===!0&&(n.alphaHash=!0),this.alphaToCoverage===!0&&(n.alphaToCoverage=!0),this.premultipliedAlpha===!0&&(n.premultipliedAlpha=!0),this.forceSinglePass===!0&&(n.forceSinglePass=!0),this.wireframe===!0&&(n.wireframe=!0),this.wireframeLinewidth>1&&(n.wireframeLinewidth=this.wireframeLinewidth),this.wireframeLinecap!=="round"&&(n.wireframeLinecap=this.wireframeLinecap),this.wireframeLinejoin!=="round"&&(n.wireframeLinejoin=this.wireframeLinejoin),this.flatShading===!0&&(n.flatShading=!0),this.visible===!1&&(n.visible=!1),this.toneMapped===!1&&(n.toneMapped=!1),this.fog===!1&&(n.fog=!1),Object.keys(this.userData).length>0&&(n.userData=this.userData);function s(r){let o=[];for(let a in r){let c=r[a];delete c.metadata,o.push(c)}return o}if(t){let r=s(e.textures),o=s(e.images);r.length>0&&(n.textures=r),o.length>0&&(n.images=o)}return n}clone(){return new this.constructor().copy(this)}copy(e){this.name=e.name,this.blending=e.blending,this.side=e.side,this.vertexColors=e.vertexColors,this.opacity=e.opacity,this.transparent=e.transparent,this.blendSrc=e.blendSrc,this.blendDst=e.blendDst,this.blendEquation=e.blendEquation,this.blendSrcAlpha=e.blendSrcAlpha,this.blendDstAlpha=e.blendDstAlpha,this.blendEquationAlpha=e.blendEquationAlpha,this.blendColor.copy(e.blendColor),this.blendAlpha=e.blendAlpha,this.depthFunc=e.depthFunc,this.depthTest=e.depthTest,this.depthWrite=e.depthWrite,this.stencilWriteMask=e.stencilWriteMask,this.stencilFunc=e.stencilFunc,this.stencilRef=e.stencilRef,this.stencilFuncMask=e.stencilFuncMask,this.stencilFail=e.stencilFail,this.stencilZFail=e.stencilZFail,this.stencilZPass=e.stencilZPass,this.stencilWrite=e.stencilWrite;let t=e.clippingPlanes,n=null;if(t!==null){let s=t.length;n=new Array(s);for(let r=0;r!==s;++r)n[r]=t[r].clone()}return this.clippingPlanes=n,this.clipIntersection=e.clipIntersection,this.clipShadows=e.clipShadows,this.shadowSide=e.shadowSide,this.colorWrite=e.colorWrite,this.precision=e.precision,this.polygonOffset=e.polygonOffset,this.polygonOffsetFactor=e.polygonOffsetFactor,this.polygonOffsetUnits=e.polygonOffsetUnits,this.dithering=e.dithering,this.alphaTest=e.alphaTest,this.alphaHash=e.alphaHash,this.alphaToCoverage=e.alphaToCoverage,this.premultipliedAlpha=e.premultipliedAlpha,this.forceSinglePass=e.forceSinglePass,this.visible=e.visible,this.toneMapped=e.toneMapped,this.userData=JSON.parse(JSON.stringify(e.userData)),this}dispose(){this.dispatchEvent({type:"dispose"})}set needsUpdate(e){e===!0&&this.version++}onBuild(){console.warn("Material: onBuild() has been removed.")}},Xn=class extends Wn{constructor(e){super(),this.isMeshBasicMaterial=!0,this.type="MeshBasicMaterial",this.color=new Qe(16777215),this.map=null,this.lightMap=null,this.lightMapIntensity=1,this.aoMap=null,this.aoMapIntensity=1,this.specularMap=null,this.alphaMap=null,this.envMap=null,this.envMapRotation=new Cn,this.combine=Ld,this.reflectivity=1,this.refractionRatio=.98,this.wireframe=!1,this.wireframeLinewidth=1,this.wireframeLinecap="round",this.wireframeLinejoin="round",this.fog=!0,this.setValues(e)}copy(e){return super.copy(e),this.color.copy(e.color),this.map=e.map,this.lightMap=e.lightMap,this.lightMapIntensity=e.lightMapIntensity,this.aoMap=e.aoMap,this.aoMapIntensity=e.aoMapIntensity,this.specularMap=e.specularMap,this.alphaMap=e.alphaMap,this.envMap=e.envMap,this.envMapRotation.copy(e.envMapRotation),this.combine=e.combine,this.reflectivity=e.reflectivity,this.refractionRatio=e.refractionRatio,this.wireframe=e.wireframe,this.wireframeLinewidth=e.wireframeLinewidth,this.wireframeLinecap=e.wireframeLinecap,this.wireframeLinejoin=e.wireframeLinejoin,this.fog=e.fog,this}};var wt=new A,Vr=new le,tn=class{constructor(e,t,n=!1){if(Array.isArray(e))throw new TypeError("THREE.BufferAttribute: array should be a Typed Array.");this.isBufferAttribute=!0,this.name="",this.array=e,this.itemSize=t,this.count=e!==void 0?e.length/t:0,this.normalized=n,this.usage=nl,this.updateRanges=[],this.gpuType=zn,this.version=0}onUploadCallback(){}set needsUpdate(e){e===!0&&this.version++}setUsage(e){return this.usage=e,this}addUpdateRange(e,t){this.updateRanges.push({start:e,count:t})}clearUpdateRanges(){this.updateRanges.length=0}copy(e){return this.name=e.name,this.array=new e.array.constructor(e.array),this.itemSize=e.itemSize,this.count=e.count,this.normalized=e.normalized,this.usage=e.usage,this.gpuType=e.gpuType,this}copyAt(e,t,n){e*=this.itemSize,n*=t.itemSize;for(let s=0,r=this.itemSize;s<r;s++)this.array[e+s]=t.array[n+s];return this}copyArray(e){return this.array.set(e),this}applyMatrix3(e){if(this.itemSize===2)for(let t=0,n=this.count;t<n;t++)Vr.fromBufferAttribute(this,t),Vr.applyMatrix3(e),this.setXY(t,Vr.x,Vr.y);else if(this.itemSize===3)for(let t=0,n=this.count;t<n;t++)wt.fromBufferAttribute(this,t),wt.applyMatrix3(e),this.setXYZ(t,wt.x,wt.y,wt.z);return this}applyMatrix4(e){for(let t=0,n=this.count;t<n;t++)wt.fromBufferAttribute(this,t),wt.applyMatrix4(e),this.setXYZ(t,wt.x,wt.y,wt.z);return this}applyNormalMatrix(e){for(let t=0,n=this.count;t<n;t++)wt.fromBufferAttribute(this,t),wt.applyNormalMatrix(e),this.setXYZ(t,wt.x,wt.y,wt.z);return this}transformDirection(e){for(let t=0,n=this.count;t<n;t++)wt.fromBufferAttribute(this,t),wt.transformDirection(e),this.setXYZ(t,wt.x,wt.y,wt.z);return this}set(e,t=0){return this.array.set(e,t),this}getComponent(e,t){let n=this.array[e*this.itemSize+t];return this.normalized&&(n=xn(n,this.array)),n}setComponent(e,t,n){return this.normalized&&(n=ut(n,this.array)),this.array[e*this.itemSize+t]=n,this}getX(e){let t=this.array[e*this.itemSize];return this.normalized&&(t=xn(t,this.array)),t}setX(e,t){return this.normalized&&(t=ut(t,this.array)),this.array[e*this.itemSize]=t,this}getY(e){let t=this.array[e*this.itemSize+1];return this.normalized&&(t=xn(t,this.array)),t}setY(e,t){return this.normalized&&(t=ut(t,this.array)),this.array[e*this.itemSize+1]=t,this}getZ(e){let t=this.array[e*this.itemSize+2];return this.normalized&&(t=xn(t,this.array)),t}setZ(e,t){return this.normalized&&(t=ut(t,this.array)),this.array[e*this.itemSize+2]=t,this}getW(e){let t=this.array[e*this.itemSize+3];return this.normalized&&(t=xn(t,this.array)),t}setW(e,t){return this.normalized&&(t=ut(t,this.array)),this.array[e*this.itemSize+3]=t,this}setXY(e,t,n){return e*=this.itemSize,this.normalized&&(t=ut(t,this.array),n=ut(n,this.array)),this.array[e+0]=t,this.array[e+1]=n,this}setXYZ(e,t,n,s){return e*=this.itemSize,this.normalized&&(t=ut(t,this.array),n=ut(n,this.array),s=ut(s,this.array)),this.array[e+0]=t,this.array[e+1]=n,this.array[e+2]=s,this}setXYZW(e,t,n,s,r){return e*=this.itemSize,this.normalized&&(t=ut(t,this.array),n=ut(n,this.array),s=ut(s,this.array),r=ut(r,this.array)),this.array[e+0]=t,this.array[e+1]=n,this.array[e+2]=s,this.array[e+3]=r,this}onUpload(e){return this.onUploadCallback=e,this}clone(){return new this.constructor(this.array,this.itemSize).copy(this)}toJSON(){let e={itemSize:this.itemSize,type:this.array.constructor.name,array:Array.from(this.array),normalized:this.normalized};return this.name!==""&&(e.name=this.name),this.usage!==nl&&(e.usage=this.usage),e}};var wo=class extends tn{constructor(e,t,n){super(new Uint16Array(e),t,n)}};var Co=class extends tn{constructor(e,t,n){super(new Uint32Array(e),t,n)}};var lt=class extends tn{constructor(e,t,n){super(new Float32Array(e),t,n)}},vm=0,cn=new _t,tc=new Ft,Yi=new A,en=new Mn,ks=new Mn,It=new A,Dt=class i extends si{constructor(){super(),this.isBufferGeometry=!0,Object.defineProperty(this,"id",{value:vm++}),this.uuid=Tn(),this.name="",this.type="BufferGeometry",this.index=null,this.attributes={},this.morphAttributes={},this.morphTargetsRelative=!1,this.groups=[],this.boundingBox=null,this.boundingSphere=null,this.drawRange={start:0,count:1/0},this.userData={}}getIndex(){return this.index}setIndex(e){return Array.isArray(e)?this.index=new(qd(e)?Co:wo)(e,1):this.index=e,this}getAttribute(e){return this.attributes[e]}setAttribute(e,t){return this.attributes[e]=t,this}deleteAttribute(e){return delete this.attributes[e],this}hasAttribute(e){return this.attributes[e]!==void 0}addGroup(e,t,n=0){this.groups.push({start:e,count:t,materialIndex:n})}clearGroups(){this.groups=[]}setDrawRange(e,t){this.drawRange.start=e,this.drawRange.count=t}applyMatrix4(e){let t=this.attributes.position;t!==void 0&&(t.applyMatrix4(e),t.needsUpdate=!0);let n=this.attributes.normal;if(n!==void 0){let r=new je().getNormalMatrix(e);n.applyNormalMatrix(r),n.needsUpdate=!0}let s=this.attributes.tangent;return s!==void 0&&(s.transformDirection(e),s.needsUpdate=!0),this.boundingBox!==null&&this.computeBoundingBox(),this.boundingSphere!==null&&this.computeBoundingSphere(),this}applyQuaternion(e){return cn.makeRotationFromQuaternion(e),this.applyMatrix4(cn),this}rotateX(e){return cn.makeRotationX(e),this.applyMatrix4(cn),this}rotateY(e){return cn.makeRotationY(e),this.applyMatrix4(cn),this}rotateZ(e){return cn.makeRotationZ(e),this.applyMatrix4(cn),this}translate(e,t,n){return cn.makeTranslation(e,t,n),this.applyMatrix4(cn),this}scale(e,t,n){return cn.makeScale(e,t,n),this.applyMatrix4(cn),this}lookAt(e){return tc.lookAt(e),tc.updateMatrix(),this.applyMatrix4(tc.matrix),this}center(){return this.computeBoundingBox(),this.boundingBox.getCenter(Yi).negate(),this.translate(Yi.x,Yi.y,Yi.z),this}setFromPoints(e){let t=[];for(let n=0,s=e.length;n<s;n++){let r=e[n];t.push(r.x,r.y,r.z||0)}return this.setAttribute("position",new lt(t,3)),this}computeBoundingBox(){this.boundingBox===null&&(this.boundingBox=new Mn);let e=this.attributes.position,t=this.morphAttributes.position;if(e&&e.isGLBufferAttribute){console.error("THREE.BufferGeometry.computeBoundingBox(): GLBufferAttribute requires a manual bounding box.",this),this.boundingBox.set(new A(-1/0,-1/0,-1/0),new A(1/0,1/0,1/0));return}if(e!==void 0){if(this.boundingBox.setFromBufferAttribute(e),t)for(let n=0,s=t.length;n<s;n++){let r=t[n];en.setFromBufferAttribute(r),this.morphTargetsRelative?(It.addVectors(this.boundingBox.min,en.min),this.boundingBox.expandByPoint(It),It.addVectors(this.boundingBox.max,en.max),this.boundingBox.expandByPoint(It)):(this.boundingBox.expandByPoint(en.min),this.boundingBox.expandByPoint(en.max))}}else this.boundingBox.makeEmpty();(isNaN(this.boundingBox.min.x)||isNaN(this.boundingBox.min.y)||isNaN(this.boundingBox.min.z))&&console.error('THREE.BufferGeometry.computeBoundingBox(): Computed min/max have NaN values. The "position" attribute is likely to have NaN values.',this)}computeBoundingSphere(){this.boundingSphere===null&&(this.boundingSphere=new ds);let e=this.attributes.position,t=this.morphAttributes.position;if(e&&e.isGLBufferAttribute){console.error("THREE.BufferGeometry.computeBoundingSphere(): GLBufferAttribute requires a manual bounding sphere.",this),this.boundingSphere.set(new A,1/0);return}if(e){let n=this.boundingSphere.center;if(en.setFromBufferAttribute(e),t)for(let r=0,o=t.length;r<o;r++){let a=t[r];ks.setFromBufferAttribute(a),this.morphTargetsRelative?(It.addVectors(en.min,ks.min),en.expandByPoint(It),It.addVectors(en.max,ks.max),en.expandByPoint(It)):(en.expandByPoint(ks.min),en.expandByPoint(ks.max))}en.getCenter(n);let s=0;for(let r=0,o=e.count;r<o;r++)It.fromBufferAttribute(e,r),s=Math.max(s,n.distanceToSquared(It));if(t)for(let r=0,o=t.length;r<o;r++){let a=t[r],c=this.morphTargetsRelative;for(let l=0,h=a.count;l<h;l++)It.fromBufferAttribute(a,l),c&&(Yi.fromBufferAttribute(e,l),It.add(Yi)),s=Math.max(s,n.distanceToSquared(It))}this.boundingSphere.radius=Math.sqrt(s),isNaN(this.boundingSphere.radius)&&console.error('THREE.BufferGeometry.computeBoundingSphere(): Computed radius is NaN. The "position" attribute is likely to have NaN values.',this)}}computeTangents(){let e=this.index,t=this.attributes;if(e===null||t.position===void 0||t.normal===void 0||t.uv===void 0){console.error("THREE.BufferGeometry: .computeTangents() failed. Missing required attributes (index, position, normal or uv)");return}let n=t.position,s=t.normal,r=t.uv;this.hasAttribute("tangent")===!1&&this.setAttribute("tangent",new tn(new Float32Array(4*n.count),4));let o=this.getAttribute("tangent"),a=[],c=[];for(let P=0;P<n.count;P++)a[P]=new A,c[P]=new A;let l=new A,h=new A,u=new A,d=new le,f=new le,g=new le,y=new A,m=new A;function p(P,H,_){l.fromBufferAttribute(n,P),h.fromBufferAttribute(n,H),u.fromBufferAttribute(n,_),d.fromBufferAttribute(r,P),f.fromBufferAttribute(r,H),g.fromBufferAttribute(r,_),h.sub(l),u.sub(l),f.sub(d),g.sub(d);let S=1/(f.x*g.y-g.x*f.y);isFinite(S)&&(y.copy(h).multiplyScalar(g.y).addScaledVector(u,-f.y).multiplyScalar(S),m.copy(u).multiplyScalar(f.x).addScaledVector(h,-g.x).multiplyScalar(S),a[P].add(y),a[H].add(y),a[_].add(y),c[P].add(m),c[H].add(m),c[_].add(m))}let b=this.groups;b.length===0&&(b=[{start:0,count:e.count}]);for(let P=0,H=b.length;P<H;++P){let _=b[P],S=_.start,z=_.count;for(let I=S,k=S+z;I<k;I+=3)p(e.getX(I+0),e.getX(I+1),e.getX(I+2))}let x=new A,M=new A,D=new A,w=new A;function R(P){D.fromBufferAttribute(s,P),w.copy(D);let H=a[P];x.copy(H),x.sub(D.multiplyScalar(D.dot(H))).normalize(),M.crossVectors(w,H);let S=M.dot(c[P])<0?-1:1;o.setXYZW(P,x.x,x.y,x.z,S)}for(let P=0,H=b.length;P<H;++P){let _=b[P],S=_.start,z=_.count;for(let I=S,k=S+z;I<k;I+=3)R(e.getX(I+0)),R(e.getX(I+1)),R(e.getX(I+2))}}computeVertexNormals(){let e=this.index,t=this.getAttribute("position");if(t!==void 0){let n=this.getAttribute("normal");if(n===void 0)n=new tn(new Float32Array(t.count*3),3),this.setAttribute("normal",n);else for(let d=0,f=n.count;d<f;d++)n.setXYZ(d,0,0,0);let s=new A,r=new A,o=new A,a=new A,c=new A,l=new A,h=new A,u=new A;if(e)for(let d=0,f=e.count;d<f;d+=3){let g=e.getX(d+0),y=e.getX(d+1),m=e.getX(d+2);s.fromBufferAttribute(t,g),r.fromBufferAttribute(t,y),o.fromBufferAttribute(t,m),h.subVectors(o,r),u.subVectors(s,r),h.cross(u),a.fromBufferAttribute(n,g),c.fromBufferAttribute(n,y),l.fromBufferAttribute(n,m),a.add(h),c.add(h),l.add(h),n.setXYZ(g,a.x,a.y,a.z),n.setXYZ(y,c.x,c.y,c.z),n.setXYZ(m,l.x,l.y,l.z)}else for(let d=0,f=t.count;d<f;d+=3)s.fromBufferAttribute(t,d+0),r.fromBufferAttribute(t,d+1),o.fromBufferAttribute(t,d+2),h.subVectors(o,r),u.subVectors(s,r),h.cross(u),n.setXYZ(d+0,h.x,h.y,h.z),n.setXYZ(d+1,h.x,h.y,h.z),n.setXYZ(d+2,h.x,h.y,h.z);this.normalizeNormals(),n.needsUpdate=!0}}normalizeNormals(){let e=this.attributes.normal;for(let t=0,n=e.count;t<n;t++)It.fromBufferAttribute(e,t),It.normalize(),e.setXYZ(t,It.x,It.y,It.z)}toNonIndexed(){function e(a,c){let l=a.array,h=a.itemSize,u=a.normalized,d=new l.constructor(c.length*h),f=0,g=0;for(let y=0,m=c.length;y<m;y++){a.isInterleavedBufferAttribute?f=c[y]*a.data.stride+a.offset:f=c[y]*h;for(let p=0;p<h;p++)d[g++]=l[f++]}return new tn(d,h,u)}if(this.index===null)return console.warn("THREE.BufferGeometry.toNonIndexed(): BufferGeometry is already non-indexed."),this;let t=new i,n=this.index.array,s=this.attributes;for(let a in s){let c=s[a],l=e(c,n);t.setAttribute(a,l)}let r=this.morphAttributes;for(let a in r){let c=[],l=r[a];for(let h=0,u=l.length;h<u;h++){let d=l[h],f=e(d,n);c.push(f)}t.morphAttributes[a]=c}t.morphTargetsRelative=this.morphTargetsRelative;let o=this.groups;for(let a=0,c=o.length;a<c;a++){let l=o[a];t.addGroup(l.start,l.count,l.materialIndex)}return t}toJSON(){let e={metadata:{version:4.6,type:"BufferGeometry",generator:"BufferGeometry.toJSON"}};if(e.uuid=this.uuid,e.type=this.type,this.name!==""&&(e.name=this.name),Object.keys(this.userData).length>0&&(e.userData=this.userData),this.parameters!==void 0){let c=this.parameters;for(let l in c)c[l]!==void 0&&(e[l]=c[l]);return e}e.data={attributes:{}};let t=this.index;t!==null&&(e.data.index={type:t.array.constructor.name,array:Array.prototype.slice.call(t.array)});let n=this.attributes;for(let c in n){let l=n[c];e.data.attributes[c]=l.toJSON(e.data)}let s={},r=!1;for(let c in this.morphAttributes){let l=this.morphAttributes[c],h=[];for(let u=0,d=l.length;u<d;u++){let f=l[u];h.push(f.toJSON(e.data))}h.length>0&&(s[c]=h,r=!0)}r&&(e.data.morphAttributes=s,e.data.morphTargetsRelative=this.morphTargetsRelative);let o=this.groups;o.length>0&&(e.data.groups=JSON.parse(JSON.stringify(o)));let a=this.boundingSphere;return a!==null&&(e.data.boundingSphere={center:a.center.toArray(),radius:a.radius}),e}clone(){return new this.constructor().copy(this)}copy(e){this.index=null,this.attributes={},this.morphAttributes={},this.groups=[],this.boundingBox=null,this.boundingSphere=null;let t={};this.name=e.name;let n=e.index;n!==null&&this.setIndex(n.clone(t));let s=e.attributes;for(let l in s){let h=s[l];this.setAttribute(l,h.clone(t))}let r=e.morphAttributes;for(let l in r){let h=[],u=r[l];for(let d=0,f=u.length;d<f;d++)h.push(u[d].clone(t));this.morphAttributes[l]=h}this.morphTargetsRelative=e.morphTargetsRelative;let o=e.groups;for(let l=0,h=o.length;l<h;l++){let u=o[l];this.addGroup(u.start,u.count,u.materialIndex)}let a=e.boundingBox;a!==null&&(this.boundingBox=a.clone());let c=e.boundingSphere;return c!==null&&(this.boundingSphere=c.clone()),this.drawRange.start=e.drawRange.start,this.drawRange.count=e.drawRange.count,this.userData=e.userData,this}dispose(){this.dispatchEvent({type:"dispose"})}},Xu=new _t,fi=new Eo,Gr=new ds,qu=new A,Wr=new A,Xr=new A,qr=new A,nc=new A,Yr=new A,Yu=new A,$r=new A,tt=class extends Ft{constructor(e=new Dt,t=new Xn){super(),this.isMesh=!0,this.type="Mesh",this.geometry=e,this.material=t,this.updateMorphTargets()}copy(e,t){return super.copy(e,t),e.morphTargetInfluences!==void 0&&(this.morphTargetInfluences=e.morphTargetInfluences.slice()),e.morphTargetDictionary!==void 0&&(this.morphTargetDictionary=Object.assign({},e.morphTargetDictionary)),this.material=Array.isArray(e.material)?e.material.slice():e.material,this.geometry=e.geometry,this}updateMorphTargets(){let t=this.geometry.morphAttributes,n=Object.keys(t);if(n.length>0){let s=t[n[0]];if(s!==void 0){this.morphTargetInfluences=[],this.morphTargetDictionary={};for(let r=0,o=s.length;r<o;r++){let a=s[r].name||String(r);this.morphTargetInfluences.push(0),this.morphTargetDictionary[a]=r}}}}getVertexPosition(e,t){let n=this.geometry,s=n.attributes.position,r=n.morphAttributes.position,o=n.morphTargetsRelative;t.fromBufferAttribute(s,e);let a=this.morphTargetInfluences;if(r&&a){Yr.set(0,0,0);for(let c=0,l=r.length;c<l;c++){let h=a[c],u=r[c];h!==0&&(nc.fromBufferAttribute(u,e),o?Yr.addScaledVector(nc,h):Yr.addScaledVector(nc.sub(t),h))}t.add(Yr)}return t}raycast(e,t){let n=this.geometry,s=this.material,r=this.matrixWorld;s!==void 0&&(n.boundingSphere===null&&n.computeBoundingSphere(),Gr.copy(n.boundingSphere),Gr.applyMatrix4(r),fi.copy(e.ray).recast(e.near),!(Gr.containsPoint(fi.origin)===!1&&(fi.intersectSphere(Gr,qu)===null||fi.origin.distanceToSquared(qu)>(e.far-e.near)**2))&&(Xu.copy(r).invert(),fi.copy(e.ray).applyMatrix4(Xu),!(n.boundingBox!==null&&fi.intersectsBox(n.boundingBox)===!1)&&this._computeIntersections(e,t,fi)))}_computeIntersections(e,t,n){let s,r=this.geometry,o=this.material,a=r.index,c=r.attributes.position,l=r.attributes.uv,h=r.attributes.uv1,u=r.attributes.normal,d=r.groups,f=r.drawRange;if(a!==null)if(Array.isArray(o))for(let g=0,y=d.length;g<y;g++){let m=d[g],p=o[m.materialIndex],b=Math.max(m.start,f.start),x=Math.min(a.count,Math.min(m.start+m.count,f.start+f.count));for(let M=b,D=x;M<D;M+=3){let w=a.getX(M),R=a.getX(M+1),P=a.getX(M+2);s=Jr(this,p,e,n,l,h,u,w,R,P),s&&(s.faceIndex=Math.floor(M/3),s.face.materialIndex=m.materialIndex,t.push(s))}}else{let g=Math.max(0,f.start),y=Math.min(a.count,f.start+f.count);for(let m=g,p=y;m<p;m+=3){let b=a.getX(m),x=a.getX(m+1),M=a.getX(m+2);s=Jr(this,o,e,n,l,h,u,b,x,M),s&&(s.faceIndex=Math.floor(m/3),t.push(s))}}else if(c!==void 0)if(Array.isArray(o))for(let g=0,y=d.length;g<y;g++){let m=d[g],p=o[m.materialIndex],b=Math.max(m.start,f.start),x=Math.min(c.count,Math.min(m.start+m.count,f.start+f.count));for(let M=b,D=x;M<D;M+=3){let w=M,R=M+1,P=M+2;s=Jr(this,p,e,n,l,h,u,w,R,P),s&&(s.faceIndex=Math.floor(M/3),s.face.materialIndex=m.materialIndex,t.push(s))}}else{let g=Math.max(0,f.start),y=Math.min(c.count,f.start+f.count);for(let m=g,p=y;m<p;m+=3){let b=m,x=m+1,M=m+2;s=Jr(this,o,e,n,l,h,u,b,x,M),s&&(s.faceIndex=Math.floor(m/3),t.push(s))}}}};function Mm(i,e,t,n,s,r,o,a){let c;if(e.side===Ht?c=n.intersectTriangle(o,r,s,!0,a):c=n.intersectTriangle(s,r,o,e.side===wn,a),c===null)return null;$r.copy(a),$r.applyMatrix4(i.matrixWorld);let l=t.ray.origin.distanceTo($r);return l<t.near||l>t.far?null:{distance:l,point:$r.clone(),object:i}}function Jr(i,e,t,n,s,r,o,a,c,l){i.getVertexPosition(a,Wr),i.getVertexPosition(c,Xr),i.getVertexPosition(l,qr);let h=Mm(i,e,t,n,Wr,Xr,qr,Yu);if(h){let u=new A;ti.getBarycoord(Yu,Wr,Xr,qr,u),s&&(h.uv=ti.getInterpolatedAttribute(s,a,c,l,u,new le)),r&&(h.uv1=ti.getInterpolatedAttribute(r,a,c,l,u,new le)),o&&(h.normal=ti.getInterpolatedAttribute(o,a,c,l,u,new A),h.normal.dot(n.direction)>0&&h.normal.multiplyScalar(-1));let d={a,b:c,c:l,normal:new A,materialIndex:0};ti.getNormal(Wr,Xr,qr,d.normal),h.face=d,h.barycoord=u}return h}var pe=class i extends Dt{constructor(e=1,t=1,n=1,s=1,r=1,o=1){super(),this.type="BoxGeometry",this.parameters={width:e,height:t,depth:n,widthSegments:s,heightSegments:r,depthSegments:o};let a=this;s=Math.floor(s),r=Math.floor(r),o=Math.floor(o);let c=[],l=[],h=[],u=[],d=0,f=0;g("z","y","x",-1,-1,n,t,e,o,r,0),g("z","y","x",1,-1,n,t,-e,o,r,1),g("x","z","y",1,1,e,n,t,s,o,2),g("x","z","y",1,-1,e,n,-t,s,o,3),g("x","y","z",1,-1,e,t,n,s,r,4),g("x","y","z",-1,-1,e,t,-n,s,r,5),this.setIndex(c),this.setAttribute("position",new lt(l,3)),this.setAttribute("normal",new lt(h,3)),this.setAttribute("uv",new lt(u,2));function g(y,m,p,b,x,M,D,w,R,P,H){let _=M/R,S=D/P,z=M/2,I=D/2,k=w/2,K=R+1,G=P+1,ce=0,X=0,ve=new A;for(let Me=0;Me<G;Me++){let Se=Me*S-I;for(let Ke=0;Ke<K;Ke++){let nt=Ke*_-z;ve[y]=nt*b,ve[m]=Se*x,ve[p]=k,l.push(ve.x,ve.y,ve.z),ve[y]=0,ve[m]=0,ve[p]=w>0?1:-1,h.push(ve.x,ve.y,ve.z),u.push(Ke/R),u.push(1-Me/P),ce+=1}}for(let Me=0;Me<P;Me++)for(let Se=0;Se<R;Se++){let Ke=d+Se+K*Me,nt=d+Se+K*(Me+1),J=d+(Se+1)+K*(Me+1),oe=d+(Se+1)+K*Me;c.push(Ke,nt,oe),c.push(nt,J,oe),X+=6}a.addGroup(f,X,H),f+=X,d+=ce}}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}static fromJSON(e){return new i(e.width,e.height,e.depth,e.widthSegments,e.heightSegments,e.depthSegments)}};function fs(i){let e={};for(let t in i){e[t]={};for(let n in i[t]){let s=i[t][n];s&&(s.isColor||s.isMatrix3||s.isMatrix4||s.isVector2||s.isVector3||s.isVector4||s.isTexture||s.isQuaternion)?s.isRenderTargetTexture?(console.warn("UniformsUtils: Textures of render targets cannot be cloned via cloneUniforms() or mergeUniforms()."),e[t][n]=null):e[t][n]=s.clone():Array.isArray(s)?e[t][n]=s.slice():e[t][n]=s}}return e}function Wt(i){let e={};for(let t=0;t<i.length;t++){let n=fs(i[t]);for(let s in n)e[s]=n[s]}return e}function bm(i){let e=[];for(let t=0;t<i.length;t++)e.push(i[t].clone());return e}function $d(i){let e=i.getRenderTarget();return e===null?i.outputColorSpace:e.isXRRenderTarget===!0?e.texture.colorSpace:ct.workingColorSpace}var th={clone:fs,merge:Wt},Sm=`void main() {
	gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );
}`,Em=`void main() {
	gl_FragColor = vec4( 1.0, 0.0, 0.0, 1.0 );
}`,hn=class extends Wn{constructor(e){super(),this.isShaderMaterial=!0,this.type="ShaderMaterial",this.defines={},this.uniforms={},this.uniformsGroups=[],this.vertexShader=Sm,this.fragmentShader=Em,this.linewidth=1,this.wireframe=!1,this.wireframeLinewidth=1,this.fog=!1,this.lights=!1,this.clipping=!1,this.forceSinglePass=!0,this.extensions={clipCullDistance:!1,multiDraw:!1},this.defaultAttributeValues={color:[1,1,1],uv:[0,0],uv1:[0,0]},this.index0AttributeName=void 0,this.uniformsNeedUpdate=!1,this.glslVersion=null,e!==void 0&&this.setValues(e)}copy(e){return super.copy(e),this.fragmentShader=e.fragmentShader,this.vertexShader=e.vertexShader,this.uniforms=fs(e.uniforms),this.uniformsGroups=bm(e.uniformsGroups),this.defines=Object.assign({},e.defines),this.wireframe=e.wireframe,this.wireframeLinewidth=e.wireframeLinewidth,this.fog=e.fog,this.lights=e.lights,this.clipping=e.clipping,this.extensions=Object.assign({},e.extensions),this.glslVersion=e.glslVersion,this}toJSON(e){let t=super.toJSON(e);t.glslVersion=this.glslVersion,t.uniforms={};for(let s in this.uniforms){let o=this.uniforms[s].value;o&&o.isTexture?t.uniforms[s]={type:"t",value:o.toJSON(e).uuid}:o&&o.isColor?t.uniforms[s]={type:"c",value:o.getHex()}:o&&o.isVector2?t.uniforms[s]={type:"v2",value:o.toArray()}:o&&o.isVector3?t.uniforms[s]={type:"v3",value:o.toArray()}:o&&o.isVector4?t.uniforms[s]={type:"v4",value:o.toArray()}:o&&o.isMatrix3?t.uniforms[s]={type:"m3",value:o.toArray()}:o&&o.isMatrix4?t.uniforms[s]={type:"m4",value:o.toArray()}:t.uniforms[s]={value:o}}Object.keys(this.defines).length>0&&(t.defines=this.defines),t.vertexShader=this.vertexShader,t.fragmentShader=this.fragmentShader,t.lights=this.lights,t.clipping=this.clipping;let n={};for(let s in this.extensions)this.extensions[s]===!0&&(n[s]=!0);return Object.keys(n).length>0&&(t.extensions=n),t}},Ao=class extends Ft{constructor(){super(),this.isCamera=!0,this.type="Camera",this.matrixWorldInverse=new _t,this.projectionMatrix=new _t,this.projectionMatrixInverse=new _t,this.coordinateSystem=Hn}copy(e,t){return super.copy(e,t),this.matrixWorldInverse.copy(e.matrixWorldInverse),this.projectionMatrix.copy(e.projectionMatrix),this.projectionMatrixInverse.copy(e.projectionMatrixInverse),this.coordinateSystem=e.coordinateSystem,this}getWorldDirection(e){return super.getWorldDirection(e).negate()}updateMatrixWorld(e){super.updateMatrixWorld(e),this.matrixWorldInverse.copy(this.matrixWorld).invert()}updateWorldMatrix(e,t){super.updateWorldMatrix(e,t),this.matrixWorldInverse.copy(this.matrixWorld).invert()}clone(){return new this.constructor().copy(this)}},Qn=new A,$u=new le,Ju=new le,Ot=class extends Ao{constructor(e=50,t=1,n=.1,s=2e3){super(),this.isPerspectiveCamera=!0,this.type="PerspectiveCamera",this.fov=e,this.zoom=1,this.near=n,this.far=s,this.focus=10,this.aspect=t,this.view=null,this.filmGauge=35,this.filmOffset=0,this.updateProjectionMatrix()}copy(e,t){return super.copy(e,t),this.fov=e.fov,this.zoom=e.zoom,this.near=e.near,this.far=e.far,this.focus=e.focus,this.aspect=e.aspect,this.view=e.view===null?null:Object.assign({},e.view),this.filmGauge=e.filmGauge,this.filmOffset=e.filmOffset,this}setFocalLength(e){let t=.5*this.getFilmHeight()/e;this.fov=js*2*Math.atan(t),this.updateProjectionMatrix()}getFocalLength(){let e=Math.tan(Gs*.5*this.fov);return .5*this.getFilmHeight()/e}getEffectiveFOV(){return js*2*Math.atan(Math.tan(Gs*.5*this.fov)/this.zoom)}getFilmWidth(){return this.filmGauge*Math.min(this.aspect,1)}getFilmHeight(){return this.filmGauge/Math.max(this.aspect,1)}getViewBounds(e,t,n){Qn.set(-1,-1,.5).applyMatrix4(this.projectionMatrixInverse),t.set(Qn.x,Qn.y).multiplyScalar(-e/Qn.z),Qn.set(1,1,.5).applyMatrix4(this.projectionMatrixInverse),n.set(Qn.x,Qn.y).multiplyScalar(-e/Qn.z)}getViewSize(e,t){return this.getViewBounds(e,$u,Ju),t.subVectors(Ju,$u)}setViewOffset(e,t,n,s,r,o){this.aspect=e/t,this.view===null&&(this.view={enabled:!0,fullWidth:1,fullHeight:1,offsetX:0,offsetY:0,width:1,height:1}),this.view.enabled=!0,this.view.fullWidth=e,this.view.fullHeight=t,this.view.offsetX=n,this.view.offsetY=s,this.view.width=r,this.view.height=o,this.updateProjectionMatrix()}clearViewOffset(){this.view!==null&&(this.view.enabled=!1),this.updateProjectionMatrix()}updateProjectionMatrix(){let e=this.near,t=e*Math.tan(Gs*.5*this.fov)/this.zoom,n=2*t,s=this.aspect*n,r=-.5*s,o=this.view;if(this.view!==null&&this.view.enabled){let c=o.fullWidth,l=o.fullHeight;r+=o.offsetX*s/c,t-=o.offsetY*n/l,s*=o.width/c,n*=o.height/l}let a=this.filmOffset;a!==0&&(r+=e*a/this.getFilmWidth()),this.projectionMatrix.makePerspective(r,r+s,t,t-n,e,this.far,this.coordinateSystem),this.projectionMatrixInverse.copy(this.projectionMatrix).invert()}toJSON(e){let t=super.toJSON(e);return t.object.fov=this.fov,t.object.zoom=this.zoom,t.object.near=this.near,t.object.far=this.far,t.object.focus=this.focus,t.object.aspect=this.aspect,this.view!==null&&(t.object.view=Object.assign({},this.view)),t.object.filmGauge=this.filmGauge,t.object.filmOffset=this.filmOffset,t}},$i=-90,Ji=1,ol=class extends Ft{constructor(e,t,n){super(),this.type="CubeCamera",this.renderTarget=n,this.coordinateSystem=null,this.activeMipmapLevel=0;let s=new Ot($i,Ji,e,t);s.layers=this.layers,this.add(s);let r=new Ot($i,Ji,e,t);r.layers=this.layers,this.add(r);let o=new Ot($i,Ji,e,t);o.layers=this.layers,this.add(o);let a=new Ot($i,Ji,e,t);a.layers=this.layers,this.add(a);let c=new Ot($i,Ji,e,t);c.layers=this.layers,this.add(c);let l=new Ot($i,Ji,e,t);l.layers=this.layers,this.add(l)}updateCoordinateSystem(){let e=this.coordinateSystem,t=this.children.concat(),[n,s,r,o,a,c]=t;for(let l of t)this.remove(l);if(e===Hn)n.up.set(0,1,0),n.lookAt(1,0,0),s.up.set(0,1,0),s.lookAt(-1,0,0),r.up.set(0,0,-1),r.lookAt(0,1,0),o.up.set(0,0,1),o.lookAt(0,-1,0),a.up.set(0,1,0),a.lookAt(0,0,1),c.up.set(0,1,0),c.lookAt(0,0,-1);else if(e===vo)n.up.set(0,-1,0),n.lookAt(-1,0,0),s.up.set(0,-1,0),s.lookAt(1,0,0),r.up.set(0,0,1),r.lookAt(0,1,0),o.up.set(0,0,-1),o.lookAt(0,-1,0),a.up.set(0,-1,0),a.lookAt(0,0,1),c.up.set(0,-1,0),c.lookAt(0,0,-1);else throw new Error("THREE.CubeCamera.updateCoordinateSystem(): Invalid coordinate system: "+e);for(let l of t)this.add(l),l.updateMatrixWorld()}update(e,t){this.parent===null&&this.updateMatrixWorld();let{renderTarget:n,activeMipmapLevel:s}=this;this.coordinateSystem!==e.coordinateSystem&&(this.coordinateSystem=e.coordinateSystem,this.updateCoordinateSystem());let[r,o,a,c,l,h]=this.children,u=e.getRenderTarget(),d=e.getActiveCubeFace(),f=e.getActiveMipmapLevel(),g=e.xr.enabled;e.xr.enabled=!1;let y=n.texture.generateMipmaps;n.texture.generateMipmaps=!1,e.setRenderTarget(n,0,s),e.render(t,r),e.setRenderTarget(n,1,s),e.render(t,o),e.setRenderTarget(n,2,s),e.render(t,a),e.setRenderTarget(n,3,s),e.render(t,c),e.setRenderTarget(n,4,s),e.render(t,l),n.texture.generateMipmaps=y,e.setRenderTarget(n,5,s),e.render(t,h),e.setRenderTarget(u,d,f),e.xr.enabled=g,n.texture.needsPMREMUpdate=!0}},Ro=class extends nn{constructor(e,t,n,s,r,o,a,c,l,h){e=e!==void 0?e:[],t=t!==void 0?t:cs,super(e,t,n,s,r,o,a,c,l,h),this.isCubeTexture=!0,this.flipY=!1}get images(){return this.image}set images(e){this.image=e}},al=class extends Gn{constructor(e=1,t={}){super(e,e,t),this.isWebGLCubeRenderTarget=!0;let n={width:e,height:e,depth:1},s=[n,n,n,n,n,n];this.texture=new Ro(s,t.mapping,t.wrapS,t.wrapT,t.magFilter,t.minFilter,t.format,t.type,t.anisotropy,t.colorSpace),this.texture.isRenderTargetTexture=!0,this.texture.generateMipmaps=t.generateMipmaps!==void 0?t.generateMipmaps:!1,this.texture.minFilter=t.minFilter!==void 0?t.minFilter:yn}fromEquirectangularTexture(e,t){this.texture.type=t.type,this.texture.colorSpace=t.colorSpace,this.texture.generateMipmaps=t.generateMipmaps,this.texture.minFilter=t.minFilter,this.texture.magFilter=t.magFilter;let n={uniforms:{tEquirect:{value:null}},vertexShader:`

				varying vec3 vWorldDirection;

				vec3 transformDirection( in vec3 dir, in mat4 matrix ) {

					return normalize( ( matrix * vec4( dir, 0.0 ) ).xyz );

				}

				void main() {

					vWorldDirection = transformDirection( position, modelMatrix );

					#include <begin_vertex>
					#include <project_vertex>

				}
			`,fragmentShader:`

				uniform sampler2D tEquirect;

				varying vec3 vWorldDirection;

				#include <common>

				void main() {

					vec3 direction = normalize( vWorldDirection );

					vec2 sampleUV = equirectUv( direction );

					gl_FragColor = texture2D( tEquirect, sampleUV );

				}
			`},s=new pe(5,5,5),r=new hn({name:"CubemapFromEquirect",uniforms:fs(n.uniforms),vertexShader:n.vertexShader,fragmentShader:n.fragmentShader,side:Ht,blending:ni});r.uniforms.tEquirect.value=t;let o=new tt(s,r),a=t.minFilter;return t.minFilter===Mi&&(t.minFilter=yn),new ol(1,10,this).update(e,o),t.minFilter=a,o.geometry.dispose(),o.material.dispose(),this}clear(e,t,n,s){let r=e.getRenderTarget();for(let o=0;o<6;o++)e.setRenderTarget(this,o),e.clear(t,n,s);e.setRenderTarget(r)}},ic=new A,Tm=new A,wm=new je,Fn=class{constructor(e=new A(1,0,0),t=0){this.isPlane=!0,this.normal=e,this.constant=t}set(e,t){return this.normal.copy(e),this.constant=t,this}setComponents(e,t,n,s){return this.normal.set(e,t,n),this.constant=s,this}setFromNormalAndCoplanarPoint(e,t){return this.normal.copy(e),this.constant=-t.dot(this.normal),this}setFromCoplanarPoints(e,t,n){let s=ic.subVectors(n,t).cross(Tm.subVectors(e,t)).normalize();return this.setFromNormalAndCoplanarPoint(s,e),this}copy(e){return this.normal.copy(e.normal),this.constant=e.constant,this}normalize(){let e=1/this.normal.length();return this.normal.multiplyScalar(e),this.constant*=e,this}negate(){return this.constant*=-1,this.normal.negate(),this}distanceToPoint(e){return this.normal.dot(e)+this.constant}distanceToSphere(e){return this.distanceToPoint(e.center)-e.radius}projectPoint(e,t){return t.copy(e).addScaledVector(this.normal,-this.distanceToPoint(e))}intersectLine(e,t){let n=e.delta(ic),s=this.normal.dot(n);if(s===0)return this.distanceToPoint(e.start)===0?t.copy(e.start):null;let r=-(e.start.dot(this.normal)+this.constant)/s;return r<0||r>1?null:t.copy(e.start).addScaledVector(n,r)}intersectsLine(e){let t=this.distanceToPoint(e.start),n=this.distanceToPoint(e.end);return t<0&&n>0||n<0&&t>0}intersectsBox(e){return e.intersectsPlane(this)}intersectsSphere(e){return e.intersectsPlane(this)}coplanarPoint(e){return e.copy(this.normal).multiplyScalar(-this.constant)}applyMatrix4(e,t){let n=t||wm.getNormalMatrix(e),s=this.coplanarPoint(ic).applyMatrix4(e),r=this.normal.applyMatrix3(n).normalize();return this.constant=-s.dot(r),this}translate(e){return this.constant-=e.dot(this.normal),this}equals(e){return e.normal.equals(this.normal)&&e.constant===this.constant}clone(){return new this.constructor().copy(this)}},pi=new ds,Zr=new A,Ks=class{constructor(e=new Fn,t=new Fn,n=new Fn,s=new Fn,r=new Fn,o=new Fn){this.planes=[e,t,n,s,r,o]}set(e,t,n,s,r,o){let a=this.planes;return a[0].copy(e),a[1].copy(t),a[2].copy(n),a[3].copy(s),a[4].copy(r),a[5].copy(o),this}copy(e){let t=this.planes;for(let n=0;n<6;n++)t[n].copy(e.planes[n]);return this}setFromProjectionMatrix(e,t=Hn){let n=this.planes,s=e.elements,r=s[0],o=s[1],a=s[2],c=s[3],l=s[4],h=s[5],u=s[6],d=s[7],f=s[8],g=s[9],y=s[10],m=s[11],p=s[12],b=s[13],x=s[14],M=s[15];if(n[0].setComponents(c-r,d-l,m-f,M-p).normalize(),n[1].setComponents(c+r,d+l,m+f,M+p).normalize(),n[2].setComponents(c+o,d+h,m+g,M+b).normalize(),n[3].setComponents(c-o,d-h,m-g,M-b).normalize(),n[4].setComponents(c-a,d-u,m-y,M-x).normalize(),t===Hn)n[5].setComponents(c+a,d+u,m+y,M+x).normalize();else if(t===vo)n[5].setComponents(a,u,y,x).normalize();else throw new Error("THREE.Frustum.setFromProjectionMatrix(): Invalid coordinate system: "+t);return this}intersectsObject(e){if(e.boundingSphere!==void 0)e.boundingSphere===null&&e.computeBoundingSphere(),pi.copy(e.boundingSphere).applyMatrix4(e.matrixWorld);else{let t=e.geometry;t.boundingSphere===null&&t.computeBoundingSphere(),pi.copy(t.boundingSphere).applyMatrix4(e.matrixWorld)}return this.intersectsSphere(pi)}intersectsSprite(e){return pi.center.set(0,0,0),pi.radius=.7071067811865476,pi.applyMatrix4(e.matrixWorld),this.intersectsSphere(pi)}intersectsSphere(e){let t=this.planes,n=e.center,s=-e.radius;for(let r=0;r<6;r++)if(t[r].distanceToPoint(n)<s)return!1;return!0}intersectsBox(e){let t=this.planes;for(let n=0;n<6;n++){let s=t[n];if(Zr.x=s.normal.x>0?e.max.x:e.min.x,Zr.y=s.normal.y>0?e.max.y:e.min.y,Zr.z=s.normal.z>0?e.max.z:e.min.z,s.distanceToPoint(Zr)<0)return!1}return!0}containsPoint(e){let t=this.planes;for(let n=0;n<6;n++)if(t[n].distanceToPoint(e)<0)return!1;return!0}clone(){return new this.constructor().copy(this)}};function Jd(){let i=null,e=!1,t=null,n=null;function s(r,o){t(r,o),n=i.requestAnimationFrame(s)}return{start:function(){e!==!0&&t!==null&&(n=i.requestAnimationFrame(s),e=!0)},stop:function(){i.cancelAnimationFrame(n),e=!1},setAnimationLoop:function(r){t=r},setContext:function(r){i=r}}}function Cm(i){let e=new WeakMap;function t(a,c){let l=a.array,h=a.usage,u=l.byteLength,d=i.createBuffer();i.bindBuffer(c,d),i.bufferData(c,l,h),a.onUploadCallback();let f;if(l instanceof Float32Array)f=i.FLOAT;else if(l instanceof Uint16Array)a.isFloat16BufferAttribute?f=i.HALF_FLOAT:f=i.UNSIGNED_SHORT;else if(l instanceof Int16Array)f=i.SHORT;else if(l instanceof Uint32Array)f=i.UNSIGNED_INT;else if(l instanceof Int32Array)f=i.INT;else if(l instanceof Int8Array)f=i.BYTE;else if(l instanceof Uint8Array)f=i.UNSIGNED_BYTE;else if(l instanceof Uint8ClampedArray)f=i.UNSIGNED_BYTE;else throw new Error("THREE.WebGLAttributes: Unsupported buffer data format: "+l);return{buffer:d,type:f,bytesPerElement:l.BYTES_PER_ELEMENT,version:a.version,size:u}}function n(a,c,l){let h=c.array,u=c.updateRanges;if(i.bindBuffer(l,a),u.length===0)i.bufferSubData(l,0,h);else{u.sort((f,g)=>f.start-g.start);let d=0;for(let f=1;f<u.length;f++){let g=u[d],y=u[f];y.start<=g.start+g.count+1?g.count=Math.max(g.count,y.start+y.count-g.start):(++d,u[d]=y)}u.length=d+1;for(let f=0,g=u.length;f<g;f++){let y=u[f];i.bufferSubData(l,y.start*h.BYTES_PER_ELEMENT,h,y.start,y.count)}c.clearUpdateRanges()}c.onUploadCallback()}function s(a){return a.isInterleavedBufferAttribute&&(a=a.data),e.get(a)}function r(a){a.isInterleavedBufferAttribute&&(a=a.data);let c=e.get(a);c&&(i.deleteBuffer(c.buffer),e.delete(a))}function o(a,c){if(a.isInterleavedBufferAttribute&&(a=a.data),a.isGLBufferAttribute){let h=e.get(a);(!h||h.version<a.version)&&e.set(a,{buffer:a.buffer,type:a.type,bytesPerElement:a.elementSize,version:a.version});return}let l=e.get(a);if(l===void 0)e.set(a,t(a,c));else if(l.version<a.version){if(l.size!==a.array.byteLength)throw new Error("THREE.WebGLAttributes: The size of the buffer attribute's array buffer does not match the original size. Resizing buffer attributes is not supported.");n(l.buffer,a,c),l.version=a.version}}return{get:s,remove:r,update:o}}var un=class i extends Dt{constructor(e=1,t=1,n=1,s=1){super(),this.type="PlaneGeometry",this.parameters={width:e,height:t,widthSegments:n,heightSegments:s};let r=e/2,o=t/2,a=Math.floor(n),c=Math.floor(s),l=a+1,h=c+1,u=e/a,d=t/c,f=[],g=[],y=[],m=[];for(let p=0;p<h;p++){let b=p*d-o;for(let x=0;x<l;x++){let M=x*u-r;g.push(M,-b,0),y.push(0,0,1),m.push(x/a),m.push(1-p/c)}}for(let p=0;p<c;p++)for(let b=0;b<a;b++){let x=b+l*p,M=b+l*(p+1),D=b+1+l*(p+1),w=b+1+l*p;f.push(x,M,w),f.push(M,D,w)}this.setIndex(f),this.setAttribute("position",new lt(g,3)),this.setAttribute("normal",new lt(y,3)),this.setAttribute("uv",new lt(m,2))}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}static fromJSON(e){return new i(e.width,e.height,e.widthSegments,e.heightSegments)}},Am=`#ifdef USE_ALPHAHASH
	if ( diffuseColor.a < getAlphaHashThreshold( vPosition ) ) discard;
#endif`,Rm=`#ifdef USE_ALPHAHASH
	const float ALPHA_HASH_SCALE = 0.05;
	float hash2D( vec2 value ) {
		return fract( 1.0e4 * sin( 17.0 * value.x + 0.1 * value.y ) * ( 0.1 + abs( sin( 13.0 * value.y + value.x ) ) ) );
	}
	float hash3D( vec3 value ) {
		return hash2D( vec2( hash2D( value.xy ), value.z ) );
	}
	float getAlphaHashThreshold( vec3 position ) {
		float maxDeriv = max(
			length( dFdx( position.xyz ) ),
			length( dFdy( position.xyz ) )
		);
		float pixScale = 1.0 / ( ALPHA_HASH_SCALE * maxDeriv );
		vec2 pixScales = vec2(
			exp2( floor( log2( pixScale ) ) ),
			exp2( ceil( log2( pixScale ) ) )
		);
		vec2 alpha = vec2(
			hash3D( floor( pixScales.x * position.xyz ) ),
			hash3D( floor( pixScales.y * position.xyz ) )
		);
		float lerpFactor = fract( log2( pixScale ) );
		float x = ( 1.0 - lerpFactor ) * alpha.x + lerpFactor * alpha.y;
		float a = min( lerpFactor, 1.0 - lerpFactor );
		vec3 cases = vec3(
			x * x / ( 2.0 * a * ( 1.0 - a ) ),
			( x - 0.5 * a ) / ( 1.0 - a ),
			1.0 - ( ( 1.0 - x ) * ( 1.0 - x ) / ( 2.0 * a * ( 1.0 - a ) ) )
		);
		float threshold = ( x < ( 1.0 - a ) )
			? ( ( x < a ) ? cases.x : cases.y )
			: cases.z;
		return clamp( threshold , 1.0e-6, 1.0 );
	}
#endif`,Pm=`#ifdef USE_ALPHAMAP
	diffuseColor.a *= texture2D( alphaMap, vAlphaMapUv ).g;
#endif`,Im=`#ifdef USE_ALPHAMAP
	uniform sampler2D alphaMap;
#endif`,Lm=`#ifdef USE_ALPHATEST
	#ifdef ALPHA_TO_COVERAGE
	diffuseColor.a = smoothstep( alphaTest, alphaTest + fwidth( diffuseColor.a ), diffuseColor.a );
	if ( diffuseColor.a == 0.0 ) discard;
	#else
	if ( diffuseColor.a < alphaTest ) discard;
	#endif
#endif`,Dm=`#ifdef USE_ALPHATEST
	uniform float alphaTest;
#endif`,Um=`#ifdef USE_AOMAP
	float ambientOcclusion = ( texture2D( aoMap, vAoMapUv ).r - 1.0 ) * aoMapIntensity + 1.0;
	reflectedLight.indirectDiffuse *= ambientOcclusion;
	#if defined( USE_CLEARCOAT ) 
		clearcoatSpecularIndirect *= ambientOcclusion;
	#endif
	#if defined( USE_SHEEN ) 
		sheenSpecularIndirect *= ambientOcclusion;
	#endif
	#if defined( USE_ENVMAP ) && defined( STANDARD )
		float dotNV = saturate( dot( geometryNormal, geometryViewDir ) );
		reflectedLight.indirectSpecular *= computeSpecularOcclusion( dotNV, ambientOcclusion, material.roughness );
	#endif
#endif`,Nm=`#ifdef USE_AOMAP
	uniform sampler2D aoMap;
	uniform float aoMapIntensity;
#endif`,km=`#ifdef USE_BATCHING
	#if ! defined( GL_ANGLE_multi_draw )
	#define gl_DrawID _gl_DrawID
	uniform int _gl_DrawID;
	#endif
	uniform highp sampler2D batchingTexture;
	uniform highp usampler2D batchingIdTexture;
	mat4 getBatchingMatrix( const in float i ) {
		int size = textureSize( batchingTexture, 0 ).x;
		int j = int( i ) * 4;
		int x = j % size;
		int y = j / size;
		vec4 v1 = texelFetch( batchingTexture, ivec2( x, y ), 0 );
		vec4 v2 = texelFetch( batchingTexture, ivec2( x + 1, y ), 0 );
		vec4 v3 = texelFetch( batchingTexture, ivec2( x + 2, y ), 0 );
		vec4 v4 = texelFetch( batchingTexture, ivec2( x + 3, y ), 0 );
		return mat4( v1, v2, v3, v4 );
	}
	float getIndirectIndex( const in int i ) {
		int size = textureSize( batchingIdTexture, 0 ).x;
		int x = i % size;
		int y = i / size;
		return float( texelFetch( batchingIdTexture, ivec2( x, y ), 0 ).r );
	}
#endif
#ifdef USE_BATCHING_COLOR
	uniform sampler2D batchingColorTexture;
	vec3 getBatchingColor( const in float i ) {
		int size = textureSize( batchingColorTexture, 0 ).x;
		int j = int( i );
		int x = j % size;
		int y = j / size;
		return texelFetch( batchingColorTexture, ivec2( x, y ), 0 ).rgb;
	}
#endif`,Om=`#ifdef USE_BATCHING
	mat4 batchingMatrix = getBatchingMatrix( getIndirectIndex( gl_DrawID ) );
#endif`,Fm=`vec3 transformed = vec3( position );
#ifdef USE_ALPHAHASH
	vPosition = vec3( position );
#endif`,Bm=`vec3 objectNormal = vec3( normal );
#ifdef USE_TANGENT
	vec3 objectTangent = vec3( tangent.xyz );
#endif`,zm=`float G_BlinnPhong_Implicit( ) {
	return 0.25;
}
float D_BlinnPhong( const in float shininess, const in float dotNH ) {
	return RECIPROCAL_PI * ( shininess * 0.5 + 1.0 ) * pow( dotNH, shininess );
}
vec3 BRDF_BlinnPhong( const in vec3 lightDir, const in vec3 viewDir, const in vec3 normal, const in vec3 specularColor, const in float shininess ) {
	vec3 halfDir = normalize( lightDir + viewDir );
	float dotNH = saturate( dot( normal, halfDir ) );
	float dotVH = saturate( dot( viewDir, halfDir ) );
	vec3 F = F_Schlick( specularColor, 1.0, dotVH );
	float G = G_BlinnPhong_Implicit( );
	float D = D_BlinnPhong( shininess, dotNH );
	return F * ( G * D );
} // validated`,Hm=`#ifdef USE_IRIDESCENCE
	const mat3 XYZ_TO_REC709 = mat3(
		 3.2404542, -0.9692660,  0.0556434,
		-1.5371385,  1.8760108, -0.2040259,
		-0.4985314,  0.0415560,  1.0572252
	);
	vec3 Fresnel0ToIor( vec3 fresnel0 ) {
		vec3 sqrtF0 = sqrt( fresnel0 );
		return ( vec3( 1.0 ) + sqrtF0 ) / ( vec3( 1.0 ) - sqrtF0 );
	}
	vec3 IorToFresnel0( vec3 transmittedIor, float incidentIor ) {
		return pow2( ( transmittedIor - vec3( incidentIor ) ) / ( transmittedIor + vec3( incidentIor ) ) );
	}
	float IorToFresnel0( float transmittedIor, float incidentIor ) {
		return pow2( ( transmittedIor - incidentIor ) / ( transmittedIor + incidentIor ));
	}
	vec3 evalSensitivity( float OPD, vec3 shift ) {
		float phase = 2.0 * PI * OPD * 1.0e-9;
		vec3 val = vec3( 5.4856e-13, 4.4201e-13, 5.2481e-13 );
		vec3 pos = vec3( 1.6810e+06, 1.7953e+06, 2.2084e+06 );
		vec3 var = vec3( 4.3278e+09, 9.3046e+09, 6.6121e+09 );
		vec3 xyz = val * sqrt( 2.0 * PI * var ) * cos( pos * phase + shift ) * exp( - pow2( phase ) * var );
		xyz.x += 9.7470e-14 * sqrt( 2.0 * PI * 4.5282e+09 ) * cos( 2.2399e+06 * phase + shift[ 0 ] ) * exp( - 4.5282e+09 * pow2( phase ) );
		xyz /= 1.0685e-7;
		vec3 rgb = XYZ_TO_REC709 * xyz;
		return rgb;
	}
	vec3 evalIridescence( float outsideIOR, float eta2, float cosTheta1, float thinFilmThickness, vec3 baseF0 ) {
		vec3 I;
		float iridescenceIOR = mix( outsideIOR, eta2, smoothstep( 0.0, 0.03, thinFilmThickness ) );
		float sinTheta2Sq = pow2( outsideIOR / iridescenceIOR ) * ( 1.0 - pow2( cosTheta1 ) );
		float cosTheta2Sq = 1.0 - sinTheta2Sq;
		if ( cosTheta2Sq < 0.0 ) {
			return vec3( 1.0 );
		}
		float cosTheta2 = sqrt( cosTheta2Sq );
		float R0 = IorToFresnel0( iridescenceIOR, outsideIOR );
		float R12 = F_Schlick( R0, 1.0, cosTheta1 );
		float T121 = 1.0 - R12;
		float phi12 = 0.0;
		if ( iridescenceIOR < outsideIOR ) phi12 = PI;
		float phi21 = PI - phi12;
		vec3 baseIOR = Fresnel0ToIor( clamp( baseF0, 0.0, 0.9999 ) );		vec3 R1 = IorToFresnel0( baseIOR, iridescenceIOR );
		vec3 R23 = F_Schlick( R1, 1.0, cosTheta2 );
		vec3 phi23 = vec3( 0.0 );
		if ( baseIOR[ 0 ] < iridescenceIOR ) phi23[ 0 ] = PI;
		if ( baseIOR[ 1 ] < iridescenceIOR ) phi23[ 1 ] = PI;
		if ( baseIOR[ 2 ] < iridescenceIOR ) phi23[ 2 ] = PI;
		float OPD = 2.0 * iridescenceIOR * thinFilmThickness * cosTheta2;
		vec3 phi = vec3( phi21 ) + phi23;
		vec3 R123 = clamp( R12 * R23, 1e-5, 0.9999 );
		vec3 r123 = sqrt( R123 );
		vec3 Rs = pow2( T121 ) * R23 / ( vec3( 1.0 ) - R123 );
		vec3 C0 = R12 + Rs;
		I = C0;
		vec3 Cm = Rs - T121;
		for ( int m = 1; m <= 2; ++ m ) {
			Cm *= r123;
			vec3 Sm = 2.0 * evalSensitivity( float( m ) * OPD, float( m ) * phi );
			I += Cm * Sm;
		}
		return max( I, vec3( 0.0 ) );
	}
#endif`,Vm=`#ifdef USE_BUMPMAP
	uniform sampler2D bumpMap;
	uniform float bumpScale;
	vec2 dHdxy_fwd() {
		vec2 dSTdx = dFdx( vBumpMapUv );
		vec2 dSTdy = dFdy( vBumpMapUv );
		float Hll = bumpScale * texture2D( bumpMap, vBumpMapUv ).x;
		float dBx = bumpScale * texture2D( bumpMap, vBumpMapUv + dSTdx ).x - Hll;
		float dBy = bumpScale * texture2D( bumpMap, vBumpMapUv + dSTdy ).x - Hll;
		return vec2( dBx, dBy );
	}
	vec3 perturbNormalArb( vec3 surf_pos, vec3 surf_norm, vec2 dHdxy, float faceDirection ) {
		vec3 vSigmaX = normalize( dFdx( surf_pos.xyz ) );
		vec3 vSigmaY = normalize( dFdy( surf_pos.xyz ) );
		vec3 vN = surf_norm;
		vec3 R1 = cross( vSigmaY, vN );
		vec3 R2 = cross( vN, vSigmaX );
		float fDet = dot( vSigmaX, R1 ) * faceDirection;
		vec3 vGrad = sign( fDet ) * ( dHdxy.x * R1 + dHdxy.y * R2 );
		return normalize( abs( fDet ) * surf_norm - vGrad );
	}
#endif`,Gm=`#if NUM_CLIPPING_PLANES > 0
	vec4 plane;
	#ifdef ALPHA_TO_COVERAGE
		float distanceToPlane, distanceGradient;
		float clipOpacity = 1.0;
		#pragma unroll_loop_start
		for ( int i = 0; i < UNION_CLIPPING_PLANES; i ++ ) {
			plane = clippingPlanes[ i ];
			distanceToPlane = - dot( vClipPosition, plane.xyz ) + plane.w;
			distanceGradient = fwidth( distanceToPlane ) / 2.0;
			clipOpacity *= smoothstep( - distanceGradient, distanceGradient, distanceToPlane );
			if ( clipOpacity == 0.0 ) discard;
		}
		#pragma unroll_loop_end
		#if UNION_CLIPPING_PLANES < NUM_CLIPPING_PLANES
			float unionClipOpacity = 1.0;
			#pragma unroll_loop_start
			for ( int i = UNION_CLIPPING_PLANES; i < NUM_CLIPPING_PLANES; i ++ ) {
				plane = clippingPlanes[ i ];
				distanceToPlane = - dot( vClipPosition, plane.xyz ) + plane.w;
				distanceGradient = fwidth( distanceToPlane ) / 2.0;
				unionClipOpacity *= 1.0 - smoothstep( - distanceGradient, distanceGradient, distanceToPlane );
			}
			#pragma unroll_loop_end
			clipOpacity *= 1.0 - unionClipOpacity;
		#endif
		diffuseColor.a *= clipOpacity;
		if ( diffuseColor.a == 0.0 ) discard;
	#else
		#pragma unroll_loop_start
		for ( int i = 0; i < UNION_CLIPPING_PLANES; i ++ ) {
			plane = clippingPlanes[ i ];
			if ( dot( vClipPosition, plane.xyz ) > plane.w ) discard;
		}
		#pragma unroll_loop_end
		#if UNION_CLIPPING_PLANES < NUM_CLIPPING_PLANES
			bool clipped = true;
			#pragma unroll_loop_start
			for ( int i = UNION_CLIPPING_PLANES; i < NUM_CLIPPING_PLANES; i ++ ) {
				plane = clippingPlanes[ i ];
				clipped = ( dot( vClipPosition, plane.xyz ) > plane.w ) && clipped;
			}
			#pragma unroll_loop_end
			if ( clipped ) discard;
		#endif
	#endif
#endif`,Wm=`#if NUM_CLIPPING_PLANES > 0
	varying vec3 vClipPosition;
	uniform vec4 clippingPlanes[ NUM_CLIPPING_PLANES ];
#endif`,Xm=`#if NUM_CLIPPING_PLANES > 0
	varying vec3 vClipPosition;
#endif`,qm=`#if NUM_CLIPPING_PLANES > 0
	vClipPosition = - mvPosition.xyz;
#endif`,Ym=`#if defined( USE_COLOR_ALPHA )
	diffuseColor *= vColor;
#elif defined( USE_COLOR )
	diffuseColor.rgb *= vColor;
#endif`,$m=`#if defined( USE_COLOR_ALPHA )
	varying vec4 vColor;
#elif defined( USE_COLOR )
	varying vec3 vColor;
#endif`,Jm=`#if defined( USE_COLOR_ALPHA )
	varying vec4 vColor;
#elif defined( USE_COLOR ) || defined( USE_INSTANCING_COLOR ) || defined( USE_BATCHING_COLOR )
	varying vec3 vColor;
#endif`,Zm=`#if defined( USE_COLOR_ALPHA )
	vColor = vec4( 1.0 );
#elif defined( USE_COLOR ) || defined( USE_INSTANCING_COLOR ) || defined( USE_BATCHING_COLOR )
	vColor = vec3( 1.0 );
#endif
#ifdef USE_COLOR
	vColor *= color;
#endif
#ifdef USE_INSTANCING_COLOR
	vColor.xyz *= instanceColor.xyz;
#endif
#ifdef USE_BATCHING_COLOR
	vec3 batchingColor = getBatchingColor( getIndirectIndex( gl_DrawID ) );
	vColor.xyz *= batchingColor.xyz;
#endif`,jm=`#define PI 3.141592653589793
#define PI2 6.283185307179586
#define PI_HALF 1.5707963267948966
#define RECIPROCAL_PI 0.3183098861837907
#define RECIPROCAL_PI2 0.15915494309189535
#define EPSILON 1e-6
#ifndef saturate
#define saturate( a ) clamp( a, 0.0, 1.0 )
#endif
#define whiteComplement( a ) ( 1.0 - saturate( a ) )
float pow2( const in float x ) { return x*x; }
vec3 pow2( const in vec3 x ) { return x*x; }
float pow3( const in float x ) { return x*x*x; }
float pow4( const in float x ) { float x2 = x*x; return x2*x2; }
float max3( const in vec3 v ) { return max( max( v.x, v.y ), v.z ); }
float average( const in vec3 v ) { return dot( v, vec3( 0.3333333 ) ); }
highp float rand( const in vec2 uv ) {
	const highp float a = 12.9898, b = 78.233, c = 43758.5453;
	highp float dt = dot( uv.xy, vec2( a,b ) ), sn = mod( dt, PI );
	return fract( sin( sn ) * c );
}
#ifdef HIGH_PRECISION
	float precisionSafeLength( vec3 v ) { return length( v ); }
#else
	float precisionSafeLength( vec3 v ) {
		float maxComponent = max3( abs( v ) );
		return length( v / maxComponent ) * maxComponent;
	}
#endif
struct IncidentLight {
	vec3 color;
	vec3 direction;
	bool visible;
};
struct ReflectedLight {
	vec3 directDiffuse;
	vec3 directSpecular;
	vec3 indirectDiffuse;
	vec3 indirectSpecular;
};
#ifdef USE_ALPHAHASH
	varying vec3 vPosition;
#endif
vec3 transformDirection( in vec3 dir, in mat4 matrix ) {
	return normalize( ( matrix * vec4( dir, 0.0 ) ).xyz );
}
vec3 inverseTransformDirection( in vec3 dir, in mat4 matrix ) {
	return normalize( ( vec4( dir, 0.0 ) * matrix ).xyz );
}
mat3 transposeMat3( const in mat3 m ) {
	mat3 tmp;
	tmp[ 0 ] = vec3( m[ 0 ].x, m[ 1 ].x, m[ 2 ].x );
	tmp[ 1 ] = vec3( m[ 0 ].y, m[ 1 ].y, m[ 2 ].y );
	tmp[ 2 ] = vec3( m[ 0 ].z, m[ 1 ].z, m[ 2 ].z );
	return tmp;
}
bool isPerspectiveMatrix( mat4 m ) {
	return m[ 2 ][ 3 ] == - 1.0;
}
vec2 equirectUv( in vec3 dir ) {
	float u = atan( dir.z, dir.x ) * RECIPROCAL_PI2 + 0.5;
	float v = asin( clamp( dir.y, - 1.0, 1.0 ) ) * RECIPROCAL_PI + 0.5;
	return vec2( u, v );
}
vec3 BRDF_Lambert( const in vec3 diffuseColor ) {
	return RECIPROCAL_PI * diffuseColor;
}
vec3 F_Schlick( const in vec3 f0, const in float f90, const in float dotVH ) {
	float fresnel = exp2( ( - 5.55473 * dotVH - 6.98316 ) * dotVH );
	return f0 * ( 1.0 - fresnel ) + ( f90 * fresnel );
}
float F_Schlick( const in float f0, const in float f90, const in float dotVH ) {
	float fresnel = exp2( ( - 5.55473 * dotVH - 6.98316 ) * dotVH );
	return f0 * ( 1.0 - fresnel ) + ( f90 * fresnel );
} // validated`,Km=`#ifdef ENVMAP_TYPE_CUBE_UV
	#define cubeUV_minMipLevel 4.0
	#define cubeUV_minTileSize 16.0
	float getFace( vec3 direction ) {
		vec3 absDirection = abs( direction );
		float face = - 1.0;
		if ( absDirection.x > absDirection.z ) {
			if ( absDirection.x > absDirection.y )
				face = direction.x > 0.0 ? 0.0 : 3.0;
			else
				face = direction.y > 0.0 ? 1.0 : 4.0;
		} else {
			if ( absDirection.z > absDirection.y )
				face = direction.z > 0.0 ? 2.0 : 5.0;
			else
				face = direction.y > 0.0 ? 1.0 : 4.0;
		}
		return face;
	}
	vec2 getUV( vec3 direction, float face ) {
		vec2 uv;
		if ( face == 0.0 ) {
			uv = vec2( direction.z, direction.y ) / abs( direction.x );
		} else if ( face == 1.0 ) {
			uv = vec2( - direction.x, - direction.z ) / abs( direction.y );
		} else if ( face == 2.0 ) {
			uv = vec2( - direction.x, direction.y ) / abs( direction.z );
		} else if ( face == 3.0 ) {
			uv = vec2( - direction.z, direction.y ) / abs( direction.x );
		} else if ( face == 4.0 ) {
			uv = vec2( - direction.x, direction.z ) / abs( direction.y );
		} else {
			uv = vec2( direction.x, direction.y ) / abs( direction.z );
		}
		return 0.5 * ( uv + 1.0 );
	}
	vec3 bilinearCubeUV( sampler2D envMap, vec3 direction, float mipInt ) {
		float face = getFace( direction );
		float filterInt = max( cubeUV_minMipLevel - mipInt, 0.0 );
		mipInt = max( mipInt, cubeUV_minMipLevel );
		float faceSize = exp2( mipInt );
		highp vec2 uv = getUV( direction, face ) * ( faceSize - 2.0 ) + 1.0;
		if ( face > 2.0 ) {
			uv.y += faceSize;
			face -= 3.0;
		}
		uv.x += face * faceSize;
		uv.x += filterInt * 3.0 * cubeUV_minTileSize;
		uv.y += 4.0 * ( exp2( CUBEUV_MAX_MIP ) - faceSize );
		uv.x *= CUBEUV_TEXEL_WIDTH;
		uv.y *= CUBEUV_TEXEL_HEIGHT;
		#ifdef texture2DGradEXT
			return texture2DGradEXT( envMap, uv, vec2( 0.0 ), vec2( 0.0 ) ).rgb;
		#else
			return texture2D( envMap, uv ).rgb;
		#endif
	}
	#define cubeUV_r0 1.0
	#define cubeUV_m0 - 2.0
	#define cubeUV_r1 0.8
	#define cubeUV_m1 - 1.0
	#define cubeUV_r4 0.4
	#define cubeUV_m4 2.0
	#define cubeUV_r5 0.305
	#define cubeUV_m5 3.0
	#define cubeUV_r6 0.21
	#define cubeUV_m6 4.0
	float roughnessToMip( float roughness ) {
		float mip = 0.0;
		if ( roughness >= cubeUV_r1 ) {
			mip = ( cubeUV_r0 - roughness ) * ( cubeUV_m1 - cubeUV_m0 ) / ( cubeUV_r0 - cubeUV_r1 ) + cubeUV_m0;
		} else if ( roughness >= cubeUV_r4 ) {
			mip = ( cubeUV_r1 - roughness ) * ( cubeUV_m4 - cubeUV_m1 ) / ( cubeUV_r1 - cubeUV_r4 ) + cubeUV_m1;
		} else if ( roughness >= cubeUV_r5 ) {
			mip = ( cubeUV_r4 - roughness ) * ( cubeUV_m5 - cubeUV_m4 ) / ( cubeUV_r4 - cubeUV_r5 ) + cubeUV_m4;
		} else if ( roughness >= cubeUV_r6 ) {
			mip = ( cubeUV_r5 - roughness ) * ( cubeUV_m6 - cubeUV_m5 ) / ( cubeUV_r5 - cubeUV_r6 ) + cubeUV_m5;
		} else {
			mip = - 2.0 * log2( 1.16 * roughness );		}
		return mip;
	}
	vec4 textureCubeUV( sampler2D envMap, vec3 sampleDir, float roughness ) {
		float mip = clamp( roughnessToMip( roughness ), cubeUV_m0, CUBEUV_MAX_MIP );
		float mipF = fract( mip );
		float mipInt = floor( mip );
		vec3 color0 = bilinearCubeUV( envMap, sampleDir, mipInt );
		if ( mipF == 0.0 ) {
			return vec4( color0, 1.0 );
		} else {
			vec3 color1 = bilinearCubeUV( envMap, sampleDir, mipInt + 1.0 );
			return vec4( mix( color0, color1, mipF ), 1.0 );
		}
	}
#endif`,Qm=`vec3 transformedNormal = objectNormal;
#ifdef USE_TANGENT
	vec3 transformedTangent = objectTangent;
#endif
#ifdef USE_BATCHING
	mat3 bm = mat3( batchingMatrix );
	transformedNormal /= vec3( dot( bm[ 0 ], bm[ 0 ] ), dot( bm[ 1 ], bm[ 1 ] ), dot( bm[ 2 ], bm[ 2 ] ) );
	transformedNormal = bm * transformedNormal;
	#ifdef USE_TANGENT
		transformedTangent = bm * transformedTangent;
	#endif
#endif
#ifdef USE_INSTANCING
	mat3 im = mat3( instanceMatrix );
	transformedNormal /= vec3( dot( im[ 0 ], im[ 0 ] ), dot( im[ 1 ], im[ 1 ] ), dot( im[ 2 ], im[ 2 ] ) );
	transformedNormal = im * transformedNormal;
	#ifdef USE_TANGENT
		transformedTangent = im * transformedTangent;
	#endif
#endif
transformedNormal = normalMatrix * transformedNormal;
#ifdef FLIP_SIDED
	transformedNormal = - transformedNormal;
#endif
#ifdef USE_TANGENT
	transformedTangent = ( modelViewMatrix * vec4( transformedTangent, 0.0 ) ).xyz;
	#ifdef FLIP_SIDED
		transformedTangent = - transformedTangent;
	#endif
#endif`,e0=`#ifdef USE_DISPLACEMENTMAP
	uniform sampler2D displacementMap;
	uniform float displacementScale;
	uniform float displacementBias;
#endif`,t0=`#ifdef USE_DISPLACEMENTMAP
	transformed += normalize( objectNormal ) * ( texture2D( displacementMap, vDisplacementMapUv ).x * displacementScale + displacementBias );
#endif`,n0=`#ifdef USE_EMISSIVEMAP
	vec4 emissiveColor = texture2D( emissiveMap, vEmissiveMapUv );
	totalEmissiveRadiance *= emissiveColor.rgb;
#endif`,i0=`#ifdef USE_EMISSIVEMAP
	uniform sampler2D emissiveMap;
#endif`,s0="gl_FragColor = linearToOutputTexel( gl_FragColor );",r0=`
const mat3 LINEAR_SRGB_TO_LINEAR_DISPLAY_P3 = mat3(
	vec3( 0.8224621, 0.177538, 0.0 ),
	vec3( 0.0331941, 0.9668058, 0.0 ),
	vec3( 0.0170827, 0.0723974, 0.9105199 )
);
const mat3 LINEAR_DISPLAY_P3_TO_LINEAR_SRGB = mat3(
	vec3( 1.2249401, - 0.2249404, 0.0 ),
	vec3( - 0.0420569, 1.0420571, 0.0 ),
	vec3( - 0.0196376, - 0.0786361, 1.0982735 )
);
vec4 LinearSRGBToLinearDisplayP3( in vec4 value ) {
	return vec4( value.rgb * LINEAR_SRGB_TO_LINEAR_DISPLAY_P3, value.a );
}
vec4 LinearDisplayP3ToLinearSRGB( in vec4 value ) {
	return vec4( value.rgb * LINEAR_DISPLAY_P3_TO_LINEAR_SRGB, value.a );
}
vec4 LinearTransferOETF( in vec4 value ) {
	return value;
}
vec4 sRGBTransferOETF( in vec4 value ) {
	return vec4( mix( pow( value.rgb, vec3( 0.41666 ) ) * 1.055 - vec3( 0.055 ), value.rgb * 12.92, vec3( lessThanEqual( value.rgb, vec3( 0.0031308 ) ) ) ), value.a );
}`,o0=`#ifdef USE_ENVMAP
	#ifdef ENV_WORLDPOS
		vec3 cameraToFrag;
		if ( isOrthographic ) {
			cameraToFrag = normalize( vec3( - viewMatrix[ 0 ][ 2 ], - viewMatrix[ 1 ][ 2 ], - viewMatrix[ 2 ][ 2 ] ) );
		} else {
			cameraToFrag = normalize( vWorldPosition - cameraPosition );
		}
		vec3 worldNormal = inverseTransformDirection( normal, viewMatrix );
		#ifdef ENVMAP_MODE_REFLECTION
			vec3 reflectVec = reflect( cameraToFrag, worldNormal );
		#else
			vec3 reflectVec = refract( cameraToFrag, worldNormal, refractionRatio );
		#endif
	#else
		vec3 reflectVec = vReflect;
	#endif
	#ifdef ENVMAP_TYPE_CUBE
		vec4 envColor = textureCube( envMap, envMapRotation * vec3( flipEnvMap * reflectVec.x, reflectVec.yz ) );
	#else
		vec4 envColor = vec4( 0.0 );
	#endif
	#ifdef ENVMAP_BLENDING_MULTIPLY
		outgoingLight = mix( outgoingLight, outgoingLight * envColor.xyz, specularStrength * reflectivity );
	#elif defined( ENVMAP_BLENDING_MIX )
		outgoingLight = mix( outgoingLight, envColor.xyz, specularStrength * reflectivity );
	#elif defined( ENVMAP_BLENDING_ADD )
		outgoingLight += envColor.xyz * specularStrength * reflectivity;
	#endif
#endif`,a0=`#ifdef USE_ENVMAP
	uniform float envMapIntensity;
	uniform float flipEnvMap;
	uniform mat3 envMapRotation;
	#ifdef ENVMAP_TYPE_CUBE
		uniform samplerCube envMap;
	#else
		uniform sampler2D envMap;
	#endif
	
#endif`,c0=`#ifdef USE_ENVMAP
	uniform float reflectivity;
	#if defined( USE_BUMPMAP ) || defined( USE_NORMALMAP ) || defined( PHONG ) || defined( LAMBERT )
		#define ENV_WORLDPOS
	#endif
	#ifdef ENV_WORLDPOS
		varying vec3 vWorldPosition;
		uniform float refractionRatio;
	#else
		varying vec3 vReflect;
	#endif
#endif`,l0=`#ifdef USE_ENVMAP
	#if defined( USE_BUMPMAP ) || defined( USE_NORMALMAP ) || defined( PHONG ) || defined( LAMBERT )
		#define ENV_WORLDPOS
	#endif
	#ifdef ENV_WORLDPOS
		
		varying vec3 vWorldPosition;
	#else
		varying vec3 vReflect;
		uniform float refractionRatio;
	#endif
#endif`,h0=`#ifdef USE_ENVMAP
	#ifdef ENV_WORLDPOS
		vWorldPosition = worldPosition.xyz;
	#else
		vec3 cameraToVertex;
		if ( isOrthographic ) {
			cameraToVertex = normalize( vec3( - viewMatrix[ 0 ][ 2 ], - viewMatrix[ 1 ][ 2 ], - viewMatrix[ 2 ][ 2 ] ) );
		} else {
			cameraToVertex = normalize( worldPosition.xyz - cameraPosition );
		}
		vec3 worldNormal = inverseTransformDirection( transformedNormal, viewMatrix );
		#ifdef ENVMAP_MODE_REFLECTION
			vReflect = reflect( cameraToVertex, worldNormal );
		#else
			vReflect = refract( cameraToVertex, worldNormal, refractionRatio );
		#endif
	#endif
#endif`,u0=`#ifdef USE_FOG
	vFogDepth = - mvPosition.z;
#endif`,d0=`#ifdef USE_FOG
	varying float vFogDepth;
#endif`,f0=`#ifdef USE_FOG
	#ifdef FOG_EXP2
		float fogFactor = 1.0 - exp( - fogDensity * fogDensity * vFogDepth * vFogDepth );
	#else
		float fogFactor = smoothstep( fogNear, fogFar, vFogDepth );
	#endif
	gl_FragColor.rgb = mix( gl_FragColor.rgb, fogColor, fogFactor );
#endif`,p0=`#ifdef USE_FOG
	uniform vec3 fogColor;
	varying float vFogDepth;
	#ifdef FOG_EXP2
		uniform float fogDensity;
	#else
		uniform float fogNear;
		uniform float fogFar;
	#endif
#endif`,m0=`#ifdef USE_GRADIENTMAP
	uniform sampler2D gradientMap;
#endif
vec3 getGradientIrradiance( vec3 normal, vec3 lightDirection ) {
	float dotNL = dot( normal, lightDirection );
	vec2 coord = vec2( dotNL * 0.5 + 0.5, 0.0 );
	#ifdef USE_GRADIENTMAP
		return vec3( texture2D( gradientMap, coord ).r );
	#else
		vec2 fw = fwidth( coord ) * 0.5;
		return mix( vec3( 0.7 ), vec3( 1.0 ), smoothstep( 0.7 - fw.x, 0.7 + fw.x, coord.x ) );
	#endif
}`,g0=`#ifdef USE_LIGHTMAP
	uniform sampler2D lightMap;
	uniform float lightMapIntensity;
#endif`,_0=`LambertMaterial material;
material.diffuseColor = diffuseColor.rgb;
material.specularStrength = specularStrength;`,y0=`varying vec3 vViewPosition;
struct LambertMaterial {
	vec3 diffuseColor;
	float specularStrength;
};
void RE_Direct_Lambert( const in IncidentLight directLight, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in LambertMaterial material, inout ReflectedLight reflectedLight ) {
	float dotNL = saturate( dot( geometryNormal, directLight.direction ) );
	vec3 irradiance = dotNL * directLight.color;
	reflectedLight.directDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
}
void RE_IndirectDiffuse_Lambert( const in vec3 irradiance, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in LambertMaterial material, inout ReflectedLight reflectedLight ) {
	reflectedLight.indirectDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
}
#define RE_Direct				RE_Direct_Lambert
#define RE_IndirectDiffuse		RE_IndirectDiffuse_Lambert`,x0=`uniform bool receiveShadow;
uniform vec3 ambientLightColor;
#if defined( USE_LIGHT_PROBES )
	uniform vec3 lightProbe[ 9 ];
#endif
vec3 shGetIrradianceAt( in vec3 normal, in vec3 shCoefficients[ 9 ] ) {
	float x = normal.x, y = normal.y, z = normal.z;
	vec3 result = shCoefficients[ 0 ] * 0.886227;
	result += shCoefficients[ 1 ] * 2.0 * 0.511664 * y;
	result += shCoefficients[ 2 ] * 2.0 * 0.511664 * z;
	result += shCoefficients[ 3 ] * 2.0 * 0.511664 * x;
	result += shCoefficients[ 4 ] * 2.0 * 0.429043 * x * y;
	result += shCoefficients[ 5 ] * 2.0 * 0.429043 * y * z;
	result += shCoefficients[ 6 ] * ( 0.743125 * z * z - 0.247708 );
	result += shCoefficients[ 7 ] * 2.0 * 0.429043 * x * z;
	result += shCoefficients[ 8 ] * 0.429043 * ( x * x - y * y );
	return result;
}
vec3 getLightProbeIrradiance( const in vec3 lightProbe[ 9 ], const in vec3 normal ) {
	vec3 worldNormal = inverseTransformDirection( normal, viewMatrix );
	vec3 irradiance = shGetIrradianceAt( worldNormal, lightProbe );
	return irradiance;
}
vec3 getAmbientLightIrradiance( const in vec3 ambientLightColor ) {
	vec3 irradiance = ambientLightColor;
	return irradiance;
}
float getDistanceAttenuation( const in float lightDistance, const in float cutoffDistance, const in float decayExponent ) {
	float distanceFalloff = 1.0 / max( pow( lightDistance, decayExponent ), 0.01 );
	if ( cutoffDistance > 0.0 ) {
		distanceFalloff *= pow2( saturate( 1.0 - pow4( lightDistance / cutoffDistance ) ) );
	}
	return distanceFalloff;
}
float getSpotAttenuation( const in float coneCosine, const in float penumbraCosine, const in float angleCosine ) {
	return smoothstep( coneCosine, penumbraCosine, angleCosine );
}
#if NUM_DIR_LIGHTS > 0
	struct DirectionalLight {
		vec3 direction;
		vec3 color;
	};
	uniform DirectionalLight directionalLights[ NUM_DIR_LIGHTS ];
	void getDirectionalLightInfo( const in DirectionalLight directionalLight, out IncidentLight light ) {
		light.color = directionalLight.color;
		light.direction = directionalLight.direction;
		light.visible = true;
	}
#endif
#if NUM_POINT_LIGHTS > 0
	struct PointLight {
		vec3 position;
		vec3 color;
		float distance;
		float decay;
	};
	uniform PointLight pointLights[ NUM_POINT_LIGHTS ];
	void getPointLightInfo( const in PointLight pointLight, const in vec3 geometryPosition, out IncidentLight light ) {
		vec3 lVector = pointLight.position - geometryPosition;
		light.direction = normalize( lVector );
		float lightDistance = length( lVector );
		light.color = pointLight.color;
		light.color *= getDistanceAttenuation( lightDistance, pointLight.distance, pointLight.decay );
		light.visible = ( light.color != vec3( 0.0 ) );
	}
#endif
#if NUM_SPOT_LIGHTS > 0
	struct SpotLight {
		vec3 position;
		vec3 direction;
		vec3 color;
		float distance;
		float decay;
		float coneCos;
		float penumbraCos;
	};
	uniform SpotLight spotLights[ NUM_SPOT_LIGHTS ];
	void getSpotLightInfo( const in SpotLight spotLight, const in vec3 geometryPosition, out IncidentLight light ) {
		vec3 lVector = spotLight.position - geometryPosition;
		light.direction = normalize( lVector );
		float angleCos = dot( light.direction, spotLight.direction );
		float spotAttenuation = getSpotAttenuation( spotLight.coneCos, spotLight.penumbraCos, angleCos );
		if ( spotAttenuation > 0.0 ) {
			float lightDistance = length( lVector );
			light.color = spotLight.color * spotAttenuation;
			light.color *= getDistanceAttenuation( lightDistance, spotLight.distance, spotLight.decay );
			light.visible = ( light.color != vec3( 0.0 ) );
		} else {
			light.color = vec3( 0.0 );
			light.visible = false;
		}
	}
#endif
#if NUM_RECT_AREA_LIGHTS > 0
	struct RectAreaLight {
		vec3 color;
		vec3 position;
		vec3 halfWidth;
		vec3 halfHeight;
	};
	uniform sampler2D ltc_1;	uniform sampler2D ltc_2;
	uniform RectAreaLight rectAreaLights[ NUM_RECT_AREA_LIGHTS ];
#endif
#if NUM_HEMI_LIGHTS > 0
	struct HemisphereLight {
		vec3 direction;
		vec3 skyColor;
		vec3 groundColor;
	};
	uniform HemisphereLight hemisphereLights[ NUM_HEMI_LIGHTS ];
	vec3 getHemisphereLightIrradiance( const in HemisphereLight hemiLight, const in vec3 normal ) {
		float dotNL = dot( normal, hemiLight.direction );
		float hemiDiffuseWeight = 0.5 * dotNL + 0.5;
		vec3 irradiance = mix( hemiLight.groundColor, hemiLight.skyColor, hemiDiffuseWeight );
		return irradiance;
	}
#endif`,v0=`#ifdef USE_ENVMAP
	vec3 getIBLIrradiance( const in vec3 normal ) {
		#ifdef ENVMAP_TYPE_CUBE_UV
			vec3 worldNormal = inverseTransformDirection( normal, viewMatrix );
			vec4 envMapColor = textureCubeUV( envMap, envMapRotation * worldNormal, 1.0 );
			return PI * envMapColor.rgb * envMapIntensity;
		#else
			return vec3( 0.0 );
		#endif
	}
	vec3 getIBLRadiance( const in vec3 viewDir, const in vec3 normal, const in float roughness ) {
		#ifdef ENVMAP_TYPE_CUBE_UV
			vec3 reflectVec = reflect( - viewDir, normal );
			reflectVec = normalize( mix( reflectVec, normal, roughness * roughness) );
			reflectVec = inverseTransformDirection( reflectVec, viewMatrix );
			vec4 envMapColor = textureCubeUV( envMap, envMapRotation * reflectVec, roughness );
			return envMapColor.rgb * envMapIntensity;
		#else
			return vec3( 0.0 );
		#endif
	}
	#ifdef USE_ANISOTROPY
		vec3 getIBLAnisotropyRadiance( const in vec3 viewDir, const in vec3 normal, const in float roughness, const in vec3 bitangent, const in float anisotropy ) {
			#ifdef ENVMAP_TYPE_CUBE_UV
				vec3 bentNormal = cross( bitangent, viewDir );
				bentNormal = normalize( cross( bentNormal, bitangent ) );
				bentNormal = normalize( mix( bentNormal, normal, pow2( pow2( 1.0 - anisotropy * ( 1.0 - roughness ) ) ) ) );
				return getIBLRadiance( viewDir, bentNormal, roughness );
			#else
				return vec3( 0.0 );
			#endif
		}
	#endif
#endif`,M0=`ToonMaterial material;
material.diffuseColor = diffuseColor.rgb;`,b0=`varying vec3 vViewPosition;
struct ToonMaterial {
	vec3 diffuseColor;
};
void RE_Direct_Toon( const in IncidentLight directLight, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in ToonMaterial material, inout ReflectedLight reflectedLight ) {
	vec3 irradiance = getGradientIrradiance( geometryNormal, directLight.direction ) * directLight.color;
	reflectedLight.directDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
}
void RE_IndirectDiffuse_Toon( const in vec3 irradiance, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in ToonMaterial material, inout ReflectedLight reflectedLight ) {
	reflectedLight.indirectDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
}
#define RE_Direct				RE_Direct_Toon
#define RE_IndirectDiffuse		RE_IndirectDiffuse_Toon`,S0=`BlinnPhongMaterial material;
material.diffuseColor = diffuseColor.rgb;
material.specularColor = specular;
material.specularShininess = shininess;
material.specularStrength = specularStrength;`,E0=`varying vec3 vViewPosition;
struct BlinnPhongMaterial {
	vec3 diffuseColor;
	vec3 specularColor;
	float specularShininess;
	float specularStrength;
};
void RE_Direct_BlinnPhong( const in IncidentLight directLight, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in BlinnPhongMaterial material, inout ReflectedLight reflectedLight ) {
	float dotNL = saturate( dot( geometryNormal, directLight.direction ) );
	vec3 irradiance = dotNL * directLight.color;
	reflectedLight.directDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
	reflectedLight.directSpecular += irradiance * BRDF_BlinnPhong( directLight.direction, geometryViewDir, geometryNormal, material.specularColor, material.specularShininess ) * material.specularStrength;
}
void RE_IndirectDiffuse_BlinnPhong( const in vec3 irradiance, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in BlinnPhongMaterial material, inout ReflectedLight reflectedLight ) {
	reflectedLight.indirectDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
}
#define RE_Direct				RE_Direct_BlinnPhong
#define RE_IndirectDiffuse		RE_IndirectDiffuse_BlinnPhong`,T0=`PhysicalMaterial material;
material.diffuseColor = diffuseColor.rgb * ( 1.0 - metalnessFactor );
vec3 dxy = max( abs( dFdx( nonPerturbedNormal ) ), abs( dFdy( nonPerturbedNormal ) ) );
float geometryRoughness = max( max( dxy.x, dxy.y ), dxy.z );
material.roughness = max( roughnessFactor, 0.0525 );material.roughness += geometryRoughness;
material.roughness = min( material.roughness, 1.0 );
#ifdef IOR
	material.ior = ior;
	#ifdef USE_SPECULAR
		float specularIntensityFactor = specularIntensity;
		vec3 specularColorFactor = specularColor;
		#ifdef USE_SPECULAR_COLORMAP
			specularColorFactor *= texture2D( specularColorMap, vSpecularColorMapUv ).rgb;
		#endif
		#ifdef USE_SPECULAR_INTENSITYMAP
			specularIntensityFactor *= texture2D( specularIntensityMap, vSpecularIntensityMapUv ).a;
		#endif
		material.specularF90 = mix( specularIntensityFactor, 1.0, metalnessFactor );
	#else
		float specularIntensityFactor = 1.0;
		vec3 specularColorFactor = vec3( 1.0 );
		material.specularF90 = 1.0;
	#endif
	material.specularColor = mix( min( pow2( ( material.ior - 1.0 ) / ( material.ior + 1.0 ) ) * specularColorFactor, vec3( 1.0 ) ) * specularIntensityFactor, diffuseColor.rgb, metalnessFactor );
#else
	material.specularColor = mix( vec3( 0.04 ), diffuseColor.rgb, metalnessFactor );
	material.specularF90 = 1.0;
#endif
#ifdef USE_CLEARCOAT
	material.clearcoat = clearcoat;
	material.clearcoatRoughness = clearcoatRoughness;
	material.clearcoatF0 = vec3( 0.04 );
	material.clearcoatF90 = 1.0;
	#ifdef USE_CLEARCOATMAP
		material.clearcoat *= texture2D( clearcoatMap, vClearcoatMapUv ).x;
	#endif
	#ifdef USE_CLEARCOAT_ROUGHNESSMAP
		material.clearcoatRoughness *= texture2D( clearcoatRoughnessMap, vClearcoatRoughnessMapUv ).y;
	#endif
	material.clearcoat = saturate( material.clearcoat );	material.clearcoatRoughness = max( material.clearcoatRoughness, 0.0525 );
	material.clearcoatRoughness += geometryRoughness;
	material.clearcoatRoughness = min( material.clearcoatRoughness, 1.0 );
#endif
#ifdef USE_DISPERSION
	material.dispersion = dispersion;
#endif
#ifdef USE_IRIDESCENCE
	material.iridescence = iridescence;
	material.iridescenceIOR = iridescenceIOR;
	#ifdef USE_IRIDESCENCEMAP
		material.iridescence *= texture2D( iridescenceMap, vIridescenceMapUv ).r;
	#endif
	#ifdef USE_IRIDESCENCE_THICKNESSMAP
		material.iridescenceThickness = (iridescenceThicknessMaximum - iridescenceThicknessMinimum) * texture2D( iridescenceThicknessMap, vIridescenceThicknessMapUv ).g + iridescenceThicknessMinimum;
	#else
		material.iridescenceThickness = iridescenceThicknessMaximum;
	#endif
#endif
#ifdef USE_SHEEN
	material.sheenColor = sheenColor;
	#ifdef USE_SHEEN_COLORMAP
		material.sheenColor *= texture2D( sheenColorMap, vSheenColorMapUv ).rgb;
	#endif
	material.sheenRoughness = clamp( sheenRoughness, 0.07, 1.0 );
	#ifdef USE_SHEEN_ROUGHNESSMAP
		material.sheenRoughness *= texture2D( sheenRoughnessMap, vSheenRoughnessMapUv ).a;
	#endif
#endif
#ifdef USE_ANISOTROPY
	#ifdef USE_ANISOTROPYMAP
		mat2 anisotropyMat = mat2( anisotropyVector.x, anisotropyVector.y, - anisotropyVector.y, anisotropyVector.x );
		vec3 anisotropyPolar = texture2D( anisotropyMap, vAnisotropyMapUv ).rgb;
		vec2 anisotropyV = anisotropyMat * normalize( 2.0 * anisotropyPolar.rg - vec2( 1.0 ) ) * anisotropyPolar.b;
	#else
		vec2 anisotropyV = anisotropyVector;
	#endif
	material.anisotropy = length( anisotropyV );
	if( material.anisotropy == 0.0 ) {
		anisotropyV = vec2( 1.0, 0.0 );
	} else {
		anisotropyV /= material.anisotropy;
		material.anisotropy = saturate( material.anisotropy );
	}
	material.alphaT = mix( pow2( material.roughness ), 1.0, pow2( material.anisotropy ) );
	material.anisotropyT = tbn[ 0 ] * anisotropyV.x + tbn[ 1 ] * anisotropyV.y;
	material.anisotropyB = tbn[ 1 ] * anisotropyV.x - tbn[ 0 ] * anisotropyV.y;
#endif`,w0=`struct PhysicalMaterial {
	vec3 diffuseColor;
	float roughness;
	vec3 specularColor;
	float specularF90;
	float dispersion;
	#ifdef USE_CLEARCOAT
		float clearcoat;
		float clearcoatRoughness;
		vec3 clearcoatF0;
		float clearcoatF90;
	#endif
	#ifdef USE_IRIDESCENCE
		float iridescence;
		float iridescenceIOR;
		float iridescenceThickness;
		vec3 iridescenceFresnel;
		vec3 iridescenceF0;
	#endif
	#ifdef USE_SHEEN
		vec3 sheenColor;
		float sheenRoughness;
	#endif
	#ifdef IOR
		float ior;
	#endif
	#ifdef USE_TRANSMISSION
		float transmission;
		float transmissionAlpha;
		float thickness;
		float attenuationDistance;
		vec3 attenuationColor;
	#endif
	#ifdef USE_ANISOTROPY
		float anisotropy;
		float alphaT;
		vec3 anisotropyT;
		vec3 anisotropyB;
	#endif
};
vec3 clearcoatSpecularDirect = vec3( 0.0 );
vec3 clearcoatSpecularIndirect = vec3( 0.0 );
vec3 sheenSpecularDirect = vec3( 0.0 );
vec3 sheenSpecularIndirect = vec3(0.0 );
vec3 Schlick_to_F0( const in vec3 f, const in float f90, const in float dotVH ) {
    float x = clamp( 1.0 - dotVH, 0.0, 1.0 );
    float x2 = x * x;
    float x5 = clamp( x * x2 * x2, 0.0, 0.9999 );
    return ( f - vec3( f90 ) * x5 ) / ( 1.0 - x5 );
}
float V_GGX_SmithCorrelated( const in float alpha, const in float dotNL, const in float dotNV ) {
	float a2 = pow2( alpha );
	float gv = dotNL * sqrt( a2 + ( 1.0 - a2 ) * pow2( dotNV ) );
	float gl = dotNV * sqrt( a2 + ( 1.0 - a2 ) * pow2( dotNL ) );
	return 0.5 / max( gv + gl, EPSILON );
}
float D_GGX( const in float alpha, const in float dotNH ) {
	float a2 = pow2( alpha );
	float denom = pow2( dotNH ) * ( a2 - 1.0 ) + 1.0;
	return RECIPROCAL_PI * a2 / pow2( denom );
}
#ifdef USE_ANISOTROPY
	float V_GGX_SmithCorrelated_Anisotropic( const in float alphaT, const in float alphaB, const in float dotTV, const in float dotBV, const in float dotTL, const in float dotBL, const in float dotNV, const in float dotNL ) {
		float gv = dotNL * length( vec3( alphaT * dotTV, alphaB * dotBV, dotNV ) );
		float gl = dotNV * length( vec3( alphaT * dotTL, alphaB * dotBL, dotNL ) );
		float v = 0.5 / ( gv + gl );
		return saturate(v);
	}
	float D_GGX_Anisotropic( const in float alphaT, const in float alphaB, const in float dotNH, const in float dotTH, const in float dotBH ) {
		float a2 = alphaT * alphaB;
		highp vec3 v = vec3( alphaB * dotTH, alphaT * dotBH, a2 * dotNH );
		highp float v2 = dot( v, v );
		float w2 = a2 / v2;
		return RECIPROCAL_PI * a2 * pow2 ( w2 );
	}
#endif
#ifdef USE_CLEARCOAT
	vec3 BRDF_GGX_Clearcoat( const in vec3 lightDir, const in vec3 viewDir, const in vec3 normal, const in PhysicalMaterial material) {
		vec3 f0 = material.clearcoatF0;
		float f90 = material.clearcoatF90;
		float roughness = material.clearcoatRoughness;
		float alpha = pow2( roughness );
		vec3 halfDir = normalize( lightDir + viewDir );
		float dotNL = saturate( dot( normal, lightDir ) );
		float dotNV = saturate( dot( normal, viewDir ) );
		float dotNH = saturate( dot( normal, halfDir ) );
		float dotVH = saturate( dot( viewDir, halfDir ) );
		vec3 F = F_Schlick( f0, f90, dotVH );
		float V = V_GGX_SmithCorrelated( alpha, dotNL, dotNV );
		float D = D_GGX( alpha, dotNH );
		return F * ( V * D );
	}
#endif
vec3 BRDF_GGX( const in vec3 lightDir, const in vec3 viewDir, const in vec3 normal, const in PhysicalMaterial material ) {
	vec3 f0 = material.specularColor;
	float f90 = material.specularF90;
	float roughness = material.roughness;
	float alpha = pow2( roughness );
	vec3 halfDir = normalize( lightDir + viewDir );
	float dotNL = saturate( dot( normal, lightDir ) );
	float dotNV = saturate( dot( normal, viewDir ) );
	float dotNH = saturate( dot( normal, halfDir ) );
	float dotVH = saturate( dot( viewDir, halfDir ) );
	vec3 F = F_Schlick( f0, f90, dotVH );
	#ifdef USE_IRIDESCENCE
		F = mix( F, material.iridescenceFresnel, material.iridescence );
	#endif
	#ifdef USE_ANISOTROPY
		float dotTL = dot( material.anisotropyT, lightDir );
		float dotTV = dot( material.anisotropyT, viewDir );
		float dotTH = dot( material.anisotropyT, halfDir );
		float dotBL = dot( material.anisotropyB, lightDir );
		float dotBV = dot( material.anisotropyB, viewDir );
		float dotBH = dot( material.anisotropyB, halfDir );
		float V = V_GGX_SmithCorrelated_Anisotropic( material.alphaT, alpha, dotTV, dotBV, dotTL, dotBL, dotNV, dotNL );
		float D = D_GGX_Anisotropic( material.alphaT, alpha, dotNH, dotTH, dotBH );
	#else
		float V = V_GGX_SmithCorrelated( alpha, dotNL, dotNV );
		float D = D_GGX( alpha, dotNH );
	#endif
	return F * ( V * D );
}
vec2 LTC_Uv( const in vec3 N, const in vec3 V, const in float roughness ) {
	const float LUT_SIZE = 64.0;
	const float LUT_SCALE = ( LUT_SIZE - 1.0 ) / LUT_SIZE;
	const float LUT_BIAS = 0.5 / LUT_SIZE;
	float dotNV = saturate( dot( N, V ) );
	vec2 uv = vec2( roughness, sqrt( 1.0 - dotNV ) );
	uv = uv * LUT_SCALE + LUT_BIAS;
	return uv;
}
float LTC_ClippedSphereFormFactor( const in vec3 f ) {
	float l = length( f );
	return max( ( l * l + f.z ) / ( l + 1.0 ), 0.0 );
}
vec3 LTC_EdgeVectorFormFactor( const in vec3 v1, const in vec3 v2 ) {
	float x = dot( v1, v2 );
	float y = abs( x );
	float a = 0.8543985 + ( 0.4965155 + 0.0145206 * y ) * y;
	float b = 3.4175940 + ( 4.1616724 + y ) * y;
	float v = a / b;
	float theta_sintheta = ( x > 0.0 ) ? v : 0.5 * inversesqrt( max( 1.0 - x * x, 1e-7 ) ) - v;
	return cross( v1, v2 ) * theta_sintheta;
}
vec3 LTC_Evaluate( const in vec3 N, const in vec3 V, const in vec3 P, const in mat3 mInv, const in vec3 rectCoords[ 4 ] ) {
	vec3 v1 = rectCoords[ 1 ] - rectCoords[ 0 ];
	vec3 v2 = rectCoords[ 3 ] - rectCoords[ 0 ];
	vec3 lightNormal = cross( v1, v2 );
	if( dot( lightNormal, P - rectCoords[ 0 ] ) < 0.0 ) return vec3( 0.0 );
	vec3 T1, T2;
	T1 = normalize( V - N * dot( V, N ) );
	T2 = - cross( N, T1 );
	mat3 mat = mInv * transposeMat3( mat3( T1, T2, N ) );
	vec3 coords[ 4 ];
	coords[ 0 ] = mat * ( rectCoords[ 0 ] - P );
	coords[ 1 ] = mat * ( rectCoords[ 1 ] - P );
	coords[ 2 ] = mat * ( rectCoords[ 2 ] - P );
	coords[ 3 ] = mat * ( rectCoords[ 3 ] - P );
	coords[ 0 ] = normalize( coords[ 0 ] );
	coords[ 1 ] = normalize( coords[ 1 ] );
	coords[ 2 ] = normalize( coords[ 2 ] );
	coords[ 3 ] = normalize( coords[ 3 ] );
	vec3 vectorFormFactor = vec3( 0.0 );
	vectorFormFactor += LTC_EdgeVectorFormFactor( coords[ 0 ], coords[ 1 ] );
	vectorFormFactor += LTC_EdgeVectorFormFactor( coords[ 1 ], coords[ 2 ] );
	vectorFormFactor += LTC_EdgeVectorFormFactor( coords[ 2 ], coords[ 3 ] );
	vectorFormFactor += LTC_EdgeVectorFormFactor( coords[ 3 ], coords[ 0 ] );
	float result = LTC_ClippedSphereFormFactor( vectorFormFactor );
	return vec3( result );
}
#if defined( USE_SHEEN )
float D_Charlie( float roughness, float dotNH ) {
	float alpha = pow2( roughness );
	float invAlpha = 1.0 / alpha;
	float cos2h = dotNH * dotNH;
	float sin2h = max( 1.0 - cos2h, 0.0078125 );
	return ( 2.0 + invAlpha ) * pow( sin2h, invAlpha * 0.5 ) / ( 2.0 * PI );
}
float V_Neubelt( float dotNV, float dotNL ) {
	return saturate( 1.0 / ( 4.0 * ( dotNL + dotNV - dotNL * dotNV ) ) );
}
vec3 BRDF_Sheen( const in vec3 lightDir, const in vec3 viewDir, const in vec3 normal, vec3 sheenColor, const in float sheenRoughness ) {
	vec3 halfDir = normalize( lightDir + viewDir );
	float dotNL = saturate( dot( normal, lightDir ) );
	float dotNV = saturate( dot( normal, viewDir ) );
	float dotNH = saturate( dot( normal, halfDir ) );
	float D = D_Charlie( sheenRoughness, dotNH );
	float V = V_Neubelt( dotNV, dotNL );
	return sheenColor * ( D * V );
}
#endif
float IBLSheenBRDF( const in vec3 normal, const in vec3 viewDir, const in float roughness ) {
	float dotNV = saturate( dot( normal, viewDir ) );
	float r2 = roughness * roughness;
	float a = roughness < 0.25 ? -339.2 * r2 + 161.4 * roughness - 25.9 : -8.48 * r2 + 14.3 * roughness - 9.95;
	float b = roughness < 0.25 ? 44.0 * r2 - 23.7 * roughness + 3.26 : 1.97 * r2 - 3.27 * roughness + 0.72;
	float DG = exp( a * dotNV + b ) + ( roughness < 0.25 ? 0.0 : 0.1 * ( roughness - 0.25 ) );
	return saturate( DG * RECIPROCAL_PI );
}
vec2 DFGApprox( const in vec3 normal, const in vec3 viewDir, const in float roughness ) {
	float dotNV = saturate( dot( normal, viewDir ) );
	const vec4 c0 = vec4( - 1, - 0.0275, - 0.572, 0.022 );
	const vec4 c1 = vec4( 1, 0.0425, 1.04, - 0.04 );
	vec4 r = roughness * c0 + c1;
	float a004 = min( r.x * r.x, exp2( - 9.28 * dotNV ) ) * r.x + r.y;
	vec2 fab = vec2( - 1.04, 1.04 ) * a004 + r.zw;
	return fab;
}
vec3 EnvironmentBRDF( const in vec3 normal, const in vec3 viewDir, const in vec3 specularColor, const in float specularF90, const in float roughness ) {
	vec2 fab = DFGApprox( normal, viewDir, roughness );
	return specularColor * fab.x + specularF90 * fab.y;
}
#ifdef USE_IRIDESCENCE
void computeMultiscatteringIridescence( const in vec3 normal, const in vec3 viewDir, const in vec3 specularColor, const in float specularF90, const in float iridescence, const in vec3 iridescenceF0, const in float roughness, inout vec3 singleScatter, inout vec3 multiScatter ) {
#else
void computeMultiscattering( const in vec3 normal, const in vec3 viewDir, const in vec3 specularColor, const in float specularF90, const in float roughness, inout vec3 singleScatter, inout vec3 multiScatter ) {
#endif
	vec2 fab = DFGApprox( normal, viewDir, roughness );
	#ifdef USE_IRIDESCENCE
		vec3 Fr = mix( specularColor, iridescenceF0, iridescence );
	#else
		vec3 Fr = specularColor;
	#endif
	vec3 FssEss = Fr * fab.x + specularF90 * fab.y;
	float Ess = fab.x + fab.y;
	float Ems = 1.0 - Ess;
	vec3 Favg = Fr + ( 1.0 - Fr ) * 0.047619;	vec3 Fms = FssEss * Favg / ( 1.0 - Ems * Favg );
	singleScatter += FssEss;
	multiScatter += Fms * Ems;
}
#if NUM_RECT_AREA_LIGHTS > 0
	void RE_Direct_RectArea_Physical( const in RectAreaLight rectAreaLight, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in PhysicalMaterial material, inout ReflectedLight reflectedLight ) {
		vec3 normal = geometryNormal;
		vec3 viewDir = geometryViewDir;
		vec3 position = geometryPosition;
		vec3 lightPos = rectAreaLight.position;
		vec3 halfWidth = rectAreaLight.halfWidth;
		vec3 halfHeight = rectAreaLight.halfHeight;
		vec3 lightColor = rectAreaLight.color;
		float roughness = material.roughness;
		vec3 rectCoords[ 4 ];
		rectCoords[ 0 ] = lightPos + halfWidth - halfHeight;		rectCoords[ 1 ] = lightPos - halfWidth - halfHeight;
		rectCoords[ 2 ] = lightPos - halfWidth + halfHeight;
		rectCoords[ 3 ] = lightPos + halfWidth + halfHeight;
		vec2 uv = LTC_Uv( normal, viewDir, roughness );
		vec4 t1 = texture2D( ltc_1, uv );
		vec4 t2 = texture2D( ltc_2, uv );
		mat3 mInv = mat3(
			vec3( t1.x, 0, t1.y ),
			vec3(    0, 1,    0 ),
			vec3( t1.z, 0, t1.w )
		);
		vec3 fresnel = ( material.specularColor * t2.x + ( vec3( 1.0 ) - material.specularColor ) * t2.y );
		reflectedLight.directSpecular += lightColor * fresnel * LTC_Evaluate( normal, viewDir, position, mInv, rectCoords );
		reflectedLight.directDiffuse += lightColor * material.diffuseColor * LTC_Evaluate( normal, viewDir, position, mat3( 1.0 ), rectCoords );
	}
#endif
void RE_Direct_Physical( const in IncidentLight directLight, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in PhysicalMaterial material, inout ReflectedLight reflectedLight ) {
	float dotNL = saturate( dot( geometryNormal, directLight.direction ) );
	vec3 irradiance = dotNL * directLight.color;
	#ifdef USE_CLEARCOAT
		float dotNLcc = saturate( dot( geometryClearcoatNormal, directLight.direction ) );
		vec3 ccIrradiance = dotNLcc * directLight.color;
		clearcoatSpecularDirect += ccIrradiance * BRDF_GGX_Clearcoat( directLight.direction, geometryViewDir, geometryClearcoatNormal, material );
	#endif
	#ifdef USE_SHEEN
		sheenSpecularDirect += irradiance * BRDF_Sheen( directLight.direction, geometryViewDir, geometryNormal, material.sheenColor, material.sheenRoughness );
	#endif
	reflectedLight.directSpecular += irradiance * BRDF_GGX( directLight.direction, geometryViewDir, geometryNormal, material );
	reflectedLight.directDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
}
void RE_IndirectDiffuse_Physical( const in vec3 irradiance, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in PhysicalMaterial material, inout ReflectedLight reflectedLight ) {
	reflectedLight.indirectDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
}
void RE_IndirectSpecular_Physical( const in vec3 radiance, const in vec3 irradiance, const in vec3 clearcoatRadiance, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in PhysicalMaterial material, inout ReflectedLight reflectedLight) {
	#ifdef USE_CLEARCOAT
		clearcoatSpecularIndirect += clearcoatRadiance * EnvironmentBRDF( geometryClearcoatNormal, geometryViewDir, material.clearcoatF0, material.clearcoatF90, material.clearcoatRoughness );
	#endif
	#ifdef USE_SHEEN
		sheenSpecularIndirect += irradiance * material.sheenColor * IBLSheenBRDF( geometryNormal, geometryViewDir, material.sheenRoughness );
	#endif
	vec3 singleScattering = vec3( 0.0 );
	vec3 multiScattering = vec3( 0.0 );
	vec3 cosineWeightedIrradiance = irradiance * RECIPROCAL_PI;
	#ifdef USE_IRIDESCENCE
		computeMultiscatteringIridescence( geometryNormal, geometryViewDir, material.specularColor, material.specularF90, material.iridescence, material.iridescenceFresnel, material.roughness, singleScattering, multiScattering );
	#else
		computeMultiscattering( geometryNormal, geometryViewDir, material.specularColor, material.specularF90, material.roughness, singleScattering, multiScattering );
	#endif
	vec3 totalScattering = singleScattering + multiScattering;
	vec3 diffuse = material.diffuseColor * ( 1.0 - max( max( totalScattering.r, totalScattering.g ), totalScattering.b ) );
	reflectedLight.indirectSpecular += radiance * singleScattering;
	reflectedLight.indirectSpecular += multiScattering * cosineWeightedIrradiance;
	reflectedLight.indirectDiffuse += diffuse * cosineWeightedIrradiance;
}
#define RE_Direct				RE_Direct_Physical
#define RE_Direct_RectArea		RE_Direct_RectArea_Physical
#define RE_IndirectDiffuse		RE_IndirectDiffuse_Physical
#define RE_IndirectSpecular		RE_IndirectSpecular_Physical
float computeSpecularOcclusion( const in float dotNV, const in float ambientOcclusion, const in float roughness ) {
	return saturate( pow( dotNV + ambientOcclusion, exp2( - 16.0 * roughness - 1.0 ) ) - 1.0 + ambientOcclusion );
}`,C0=`
vec3 geometryPosition = - vViewPosition;
vec3 geometryNormal = normal;
vec3 geometryViewDir = ( isOrthographic ) ? vec3( 0, 0, 1 ) : normalize( vViewPosition );
vec3 geometryClearcoatNormal = vec3( 0.0 );
#ifdef USE_CLEARCOAT
	geometryClearcoatNormal = clearcoatNormal;
#endif
#ifdef USE_IRIDESCENCE
	float dotNVi = saturate( dot( normal, geometryViewDir ) );
	if ( material.iridescenceThickness == 0.0 ) {
		material.iridescence = 0.0;
	} else {
		material.iridescence = saturate( material.iridescence );
	}
	if ( material.iridescence > 0.0 ) {
		material.iridescenceFresnel = evalIridescence( 1.0, material.iridescenceIOR, dotNVi, material.iridescenceThickness, material.specularColor );
		material.iridescenceF0 = Schlick_to_F0( material.iridescenceFresnel, 1.0, dotNVi );
	}
#endif
IncidentLight directLight;
#if ( NUM_POINT_LIGHTS > 0 ) && defined( RE_Direct )
	PointLight pointLight;
	#if defined( USE_SHADOWMAP ) && NUM_POINT_LIGHT_SHADOWS > 0
	PointLightShadow pointLightShadow;
	#endif
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_POINT_LIGHTS; i ++ ) {
		pointLight = pointLights[ i ];
		getPointLightInfo( pointLight, geometryPosition, directLight );
		#if defined( USE_SHADOWMAP ) && ( UNROLLED_LOOP_INDEX < NUM_POINT_LIGHT_SHADOWS )
		pointLightShadow = pointLightShadows[ i ];
		directLight.color *= ( directLight.visible && receiveShadow ) ? getPointShadow( pointShadowMap[ i ], pointLightShadow.shadowMapSize, pointLightShadow.shadowIntensity, pointLightShadow.shadowBias, pointLightShadow.shadowRadius, vPointShadowCoord[ i ], pointLightShadow.shadowCameraNear, pointLightShadow.shadowCameraFar ) : 1.0;
		#endif
		RE_Direct( directLight, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
	}
	#pragma unroll_loop_end
#endif
#if ( NUM_SPOT_LIGHTS > 0 ) && defined( RE_Direct )
	SpotLight spotLight;
	vec4 spotColor;
	vec3 spotLightCoord;
	bool inSpotLightMap;
	#if defined( USE_SHADOWMAP ) && NUM_SPOT_LIGHT_SHADOWS > 0
	SpotLightShadow spotLightShadow;
	#endif
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_SPOT_LIGHTS; i ++ ) {
		spotLight = spotLights[ i ];
		getSpotLightInfo( spotLight, geometryPosition, directLight );
		#if ( UNROLLED_LOOP_INDEX < NUM_SPOT_LIGHT_SHADOWS_WITH_MAPS )
		#define SPOT_LIGHT_MAP_INDEX UNROLLED_LOOP_INDEX
		#elif ( UNROLLED_LOOP_INDEX < NUM_SPOT_LIGHT_SHADOWS )
		#define SPOT_LIGHT_MAP_INDEX NUM_SPOT_LIGHT_MAPS
		#else
		#define SPOT_LIGHT_MAP_INDEX ( UNROLLED_LOOP_INDEX - NUM_SPOT_LIGHT_SHADOWS + NUM_SPOT_LIGHT_SHADOWS_WITH_MAPS )
		#endif
		#if ( SPOT_LIGHT_MAP_INDEX < NUM_SPOT_LIGHT_MAPS )
			spotLightCoord = vSpotLightCoord[ i ].xyz / vSpotLightCoord[ i ].w;
			inSpotLightMap = all( lessThan( abs( spotLightCoord * 2. - 1. ), vec3( 1.0 ) ) );
			spotColor = texture2D( spotLightMap[ SPOT_LIGHT_MAP_INDEX ], spotLightCoord.xy );
			directLight.color = inSpotLightMap ? directLight.color * spotColor.rgb : directLight.color;
		#endif
		#undef SPOT_LIGHT_MAP_INDEX
		#if defined( USE_SHADOWMAP ) && ( UNROLLED_LOOP_INDEX < NUM_SPOT_LIGHT_SHADOWS )
		spotLightShadow = spotLightShadows[ i ];
		directLight.color *= ( directLight.visible && receiveShadow ) ? getShadow( spotShadowMap[ i ], spotLightShadow.shadowMapSize, spotLightShadow.shadowIntensity, spotLightShadow.shadowBias, spotLightShadow.shadowRadius, vSpotLightCoord[ i ] ) : 1.0;
		#endif
		RE_Direct( directLight, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
	}
	#pragma unroll_loop_end
#endif
#if ( NUM_DIR_LIGHTS > 0 ) && defined( RE_Direct )
	DirectionalLight directionalLight;
	#if defined( USE_SHADOWMAP ) && NUM_DIR_LIGHT_SHADOWS > 0
	DirectionalLightShadow directionalLightShadow;
	#endif
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_DIR_LIGHTS; i ++ ) {
		directionalLight = directionalLights[ i ];
		getDirectionalLightInfo( directionalLight, directLight );
		#if defined( USE_SHADOWMAP ) && ( UNROLLED_LOOP_INDEX < NUM_DIR_LIGHT_SHADOWS )
		directionalLightShadow = directionalLightShadows[ i ];
		directLight.color *= ( directLight.visible && receiveShadow ) ? getShadow( directionalShadowMap[ i ], directionalLightShadow.shadowMapSize, directionalLightShadow.shadowIntensity, directionalLightShadow.shadowBias, directionalLightShadow.shadowRadius, vDirectionalShadowCoord[ i ] ) : 1.0;
		#endif
		RE_Direct( directLight, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
	}
	#pragma unroll_loop_end
#endif
#if ( NUM_RECT_AREA_LIGHTS > 0 ) && defined( RE_Direct_RectArea )
	RectAreaLight rectAreaLight;
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_RECT_AREA_LIGHTS; i ++ ) {
		rectAreaLight = rectAreaLights[ i ];
		RE_Direct_RectArea( rectAreaLight, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
	}
	#pragma unroll_loop_end
#endif
#if defined( RE_IndirectDiffuse )
	vec3 iblIrradiance = vec3( 0.0 );
	vec3 irradiance = getAmbientLightIrradiance( ambientLightColor );
	#if defined( USE_LIGHT_PROBES )
		irradiance += getLightProbeIrradiance( lightProbe, geometryNormal );
	#endif
	#if ( NUM_HEMI_LIGHTS > 0 )
		#pragma unroll_loop_start
		for ( int i = 0; i < NUM_HEMI_LIGHTS; i ++ ) {
			irradiance += getHemisphereLightIrradiance( hemisphereLights[ i ], geometryNormal );
		}
		#pragma unroll_loop_end
	#endif
#endif
#if defined( RE_IndirectSpecular )
	vec3 radiance = vec3( 0.0 );
	vec3 clearcoatRadiance = vec3( 0.0 );
#endif`,A0=`#if defined( RE_IndirectDiffuse )
	#ifdef USE_LIGHTMAP
		vec4 lightMapTexel = texture2D( lightMap, vLightMapUv );
		vec3 lightMapIrradiance = lightMapTexel.rgb * lightMapIntensity;
		irradiance += lightMapIrradiance;
	#endif
	#if defined( USE_ENVMAP ) && defined( STANDARD ) && defined( ENVMAP_TYPE_CUBE_UV )
		iblIrradiance += getIBLIrradiance( geometryNormal );
	#endif
#endif
#if defined( USE_ENVMAP ) && defined( RE_IndirectSpecular )
	#ifdef USE_ANISOTROPY
		radiance += getIBLAnisotropyRadiance( geometryViewDir, geometryNormal, material.roughness, material.anisotropyB, material.anisotropy );
	#else
		radiance += getIBLRadiance( geometryViewDir, geometryNormal, material.roughness );
	#endif
	#ifdef USE_CLEARCOAT
		clearcoatRadiance += getIBLRadiance( geometryViewDir, geometryClearcoatNormal, material.clearcoatRoughness );
	#endif
#endif`,R0=`#if defined( RE_IndirectDiffuse )
	RE_IndirectDiffuse( irradiance, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
#endif
#if defined( RE_IndirectSpecular )
	RE_IndirectSpecular( radiance, iblIrradiance, clearcoatRadiance, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
#endif`,P0=`#if defined( USE_LOGDEPTHBUF )
	gl_FragDepth = vIsPerspective == 0.0 ? gl_FragCoord.z : log2( vFragDepth ) * logDepthBufFC * 0.5;
#endif`,I0=`#if defined( USE_LOGDEPTHBUF )
	uniform float logDepthBufFC;
	varying float vFragDepth;
	varying float vIsPerspective;
#endif`,L0=`#ifdef USE_LOGDEPTHBUF
	varying float vFragDepth;
	varying float vIsPerspective;
#endif`,D0=`#ifdef USE_LOGDEPTHBUF
	vFragDepth = 1.0 + gl_Position.w;
	vIsPerspective = float( isPerspectiveMatrix( projectionMatrix ) );
#endif`,U0=`#ifdef USE_MAP
	vec4 sampledDiffuseColor = texture2D( map, vMapUv );
	#ifdef DECODE_VIDEO_TEXTURE
		sampledDiffuseColor = vec4( mix( pow( sampledDiffuseColor.rgb * 0.9478672986 + vec3( 0.0521327014 ), vec3( 2.4 ) ), sampledDiffuseColor.rgb * 0.0773993808, vec3( lessThanEqual( sampledDiffuseColor.rgb, vec3( 0.04045 ) ) ) ), sampledDiffuseColor.w );
	
	#endif
	diffuseColor *= sampledDiffuseColor;
#endif`,N0=`#ifdef USE_MAP
	uniform sampler2D map;
#endif`,k0=`#if defined( USE_MAP ) || defined( USE_ALPHAMAP )
	#if defined( USE_POINTS_UV )
		vec2 uv = vUv;
	#else
		vec2 uv = ( uvTransform * vec3( gl_PointCoord.x, 1.0 - gl_PointCoord.y, 1 ) ).xy;
	#endif
#endif
#ifdef USE_MAP
	diffuseColor *= texture2D( map, uv );
#endif
#ifdef USE_ALPHAMAP
	diffuseColor.a *= texture2D( alphaMap, uv ).g;
#endif`,O0=`#if defined( USE_POINTS_UV )
	varying vec2 vUv;
#else
	#if defined( USE_MAP ) || defined( USE_ALPHAMAP )
		uniform mat3 uvTransform;
	#endif
#endif
#ifdef USE_MAP
	uniform sampler2D map;
#endif
#ifdef USE_ALPHAMAP
	uniform sampler2D alphaMap;
#endif`,F0=`float metalnessFactor = metalness;
#ifdef USE_METALNESSMAP
	vec4 texelMetalness = texture2D( metalnessMap, vMetalnessMapUv );
	metalnessFactor *= texelMetalness.b;
#endif`,B0=`#ifdef USE_METALNESSMAP
	uniform sampler2D metalnessMap;
#endif`,z0=`#ifdef USE_INSTANCING_MORPH
	float morphTargetInfluences[ MORPHTARGETS_COUNT ];
	float morphTargetBaseInfluence = texelFetch( morphTexture, ivec2( 0, gl_InstanceID ), 0 ).r;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		morphTargetInfluences[i] =  texelFetch( morphTexture, ivec2( i + 1, gl_InstanceID ), 0 ).r;
	}
#endif`,H0=`#if defined( USE_MORPHCOLORS )
	vColor *= morphTargetBaseInfluence;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		#if defined( USE_COLOR_ALPHA )
			if ( morphTargetInfluences[ i ] != 0.0 ) vColor += getMorph( gl_VertexID, i, 2 ) * morphTargetInfluences[ i ];
		#elif defined( USE_COLOR )
			if ( morphTargetInfluences[ i ] != 0.0 ) vColor += getMorph( gl_VertexID, i, 2 ).rgb * morphTargetInfluences[ i ];
		#endif
	}
#endif`,V0=`#ifdef USE_MORPHNORMALS
	objectNormal *= morphTargetBaseInfluence;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		if ( morphTargetInfluences[ i ] != 0.0 ) objectNormal += getMorph( gl_VertexID, i, 1 ).xyz * morphTargetInfluences[ i ];
	}
#endif`,G0=`#ifdef USE_MORPHTARGETS
	#ifndef USE_INSTANCING_MORPH
		uniform float morphTargetBaseInfluence;
		uniform float morphTargetInfluences[ MORPHTARGETS_COUNT ];
	#endif
	uniform sampler2DArray morphTargetsTexture;
	uniform ivec2 morphTargetsTextureSize;
	vec4 getMorph( const in int vertexIndex, const in int morphTargetIndex, const in int offset ) {
		int texelIndex = vertexIndex * MORPHTARGETS_TEXTURE_STRIDE + offset;
		int y = texelIndex / morphTargetsTextureSize.x;
		int x = texelIndex - y * morphTargetsTextureSize.x;
		ivec3 morphUV = ivec3( x, y, morphTargetIndex );
		return texelFetch( morphTargetsTexture, morphUV, 0 );
	}
#endif`,W0=`#ifdef USE_MORPHTARGETS
	transformed *= morphTargetBaseInfluence;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		if ( morphTargetInfluences[ i ] != 0.0 ) transformed += getMorph( gl_VertexID, i, 0 ).xyz * morphTargetInfluences[ i ];
	}
#endif`,X0=`float faceDirection = gl_FrontFacing ? 1.0 : - 1.0;
#ifdef FLAT_SHADED
	vec3 fdx = dFdx( vViewPosition );
	vec3 fdy = dFdy( vViewPosition );
	vec3 normal = normalize( cross( fdx, fdy ) );
#else
	vec3 normal = normalize( vNormal );
	#ifdef DOUBLE_SIDED
		normal *= faceDirection;
	#endif
#endif
#if defined( USE_NORMALMAP_TANGENTSPACE ) || defined( USE_CLEARCOAT_NORMALMAP ) || defined( USE_ANISOTROPY )
	#ifdef USE_TANGENT
		mat3 tbn = mat3( normalize( vTangent ), normalize( vBitangent ), normal );
	#else
		mat3 tbn = getTangentFrame( - vViewPosition, normal,
		#if defined( USE_NORMALMAP )
			vNormalMapUv
		#elif defined( USE_CLEARCOAT_NORMALMAP )
			vClearcoatNormalMapUv
		#else
			vUv
		#endif
		);
	#endif
	#if defined( DOUBLE_SIDED ) && ! defined( FLAT_SHADED )
		tbn[0] *= faceDirection;
		tbn[1] *= faceDirection;
	#endif
#endif
#ifdef USE_CLEARCOAT_NORMALMAP
	#ifdef USE_TANGENT
		mat3 tbn2 = mat3( normalize( vTangent ), normalize( vBitangent ), normal );
	#else
		mat3 tbn2 = getTangentFrame( - vViewPosition, normal, vClearcoatNormalMapUv );
	#endif
	#if defined( DOUBLE_SIDED ) && ! defined( FLAT_SHADED )
		tbn2[0] *= faceDirection;
		tbn2[1] *= faceDirection;
	#endif
#endif
vec3 nonPerturbedNormal = normal;`,q0=`#ifdef USE_NORMALMAP_OBJECTSPACE
	normal = texture2D( normalMap, vNormalMapUv ).xyz * 2.0 - 1.0;
	#ifdef FLIP_SIDED
		normal = - normal;
	#endif
	#ifdef DOUBLE_SIDED
		normal = normal * faceDirection;
	#endif
	normal = normalize( normalMatrix * normal );
#elif defined( USE_NORMALMAP_TANGENTSPACE )
	vec3 mapN = texture2D( normalMap, vNormalMapUv ).xyz * 2.0 - 1.0;
	mapN.xy *= normalScale;
	normal = normalize( tbn * mapN );
#elif defined( USE_BUMPMAP )
	normal = perturbNormalArb( - vViewPosition, normal, dHdxy_fwd(), faceDirection );
#endif`,Y0=`#ifndef FLAT_SHADED
	varying vec3 vNormal;
	#ifdef USE_TANGENT
		varying vec3 vTangent;
		varying vec3 vBitangent;
	#endif
#endif`,$0=`#ifndef FLAT_SHADED
	varying vec3 vNormal;
	#ifdef USE_TANGENT
		varying vec3 vTangent;
		varying vec3 vBitangent;
	#endif
#endif`,J0=`#ifndef FLAT_SHADED
	vNormal = normalize( transformedNormal );
	#ifdef USE_TANGENT
		vTangent = normalize( transformedTangent );
		vBitangent = normalize( cross( vNormal, vTangent ) * tangent.w );
	#endif
#endif`,Z0=`#ifdef USE_NORMALMAP
	uniform sampler2D normalMap;
	uniform vec2 normalScale;
#endif
#ifdef USE_NORMALMAP_OBJECTSPACE
	uniform mat3 normalMatrix;
#endif
#if ! defined ( USE_TANGENT ) && ( defined ( USE_NORMALMAP_TANGENTSPACE ) || defined ( USE_CLEARCOAT_NORMALMAP ) || defined( USE_ANISOTROPY ) )
	mat3 getTangentFrame( vec3 eye_pos, vec3 surf_norm, vec2 uv ) {
		vec3 q0 = dFdx( eye_pos.xyz );
		vec3 q1 = dFdy( eye_pos.xyz );
		vec2 st0 = dFdx( uv.st );
		vec2 st1 = dFdy( uv.st );
		vec3 N = surf_norm;
		vec3 q1perp = cross( q1, N );
		vec3 q0perp = cross( N, q0 );
		vec3 T = q1perp * st0.x + q0perp * st1.x;
		vec3 B = q1perp * st0.y + q0perp * st1.y;
		float det = max( dot( T, T ), dot( B, B ) );
		float scale = ( det == 0.0 ) ? 0.0 : inversesqrt( det );
		return mat3( T * scale, B * scale, N );
	}
#endif`,j0=`#ifdef USE_CLEARCOAT
	vec3 clearcoatNormal = nonPerturbedNormal;
#endif`,K0=`#ifdef USE_CLEARCOAT_NORMALMAP
	vec3 clearcoatMapN = texture2D( clearcoatNormalMap, vClearcoatNormalMapUv ).xyz * 2.0 - 1.0;
	clearcoatMapN.xy *= clearcoatNormalScale;
	clearcoatNormal = normalize( tbn2 * clearcoatMapN );
#endif`,Q0=`#ifdef USE_CLEARCOATMAP
	uniform sampler2D clearcoatMap;
#endif
#ifdef USE_CLEARCOAT_NORMALMAP
	uniform sampler2D clearcoatNormalMap;
	uniform vec2 clearcoatNormalScale;
#endif
#ifdef USE_CLEARCOAT_ROUGHNESSMAP
	uniform sampler2D clearcoatRoughnessMap;
#endif`,eg=`#ifdef USE_IRIDESCENCEMAP
	uniform sampler2D iridescenceMap;
#endif
#ifdef USE_IRIDESCENCE_THICKNESSMAP
	uniform sampler2D iridescenceThicknessMap;
#endif`,tg=`#ifdef OPAQUE
diffuseColor.a = 1.0;
#endif
#ifdef USE_TRANSMISSION
diffuseColor.a *= material.transmissionAlpha;
#endif
gl_FragColor = vec4( outgoingLight, diffuseColor.a );`,ng=`vec3 packNormalToRGB( const in vec3 normal ) {
	return normalize( normal ) * 0.5 + 0.5;
}
vec3 unpackRGBToNormal( const in vec3 rgb ) {
	return 2.0 * rgb.xyz - 1.0;
}
const float PackUpscale = 256. / 255.;const float UnpackDownscale = 255. / 256.;const float ShiftRight8 = 1. / 256.;
const float Inv255 = 1. / 255.;
const vec4 PackFactors = vec4( 1.0, 256.0, 256.0 * 256.0, 256.0 * 256.0 * 256.0 );
const vec2 UnpackFactors2 = vec2( UnpackDownscale, 1.0 / PackFactors.g );
const vec3 UnpackFactors3 = vec3( UnpackDownscale / PackFactors.rg, 1.0 / PackFactors.b );
const vec4 UnpackFactors4 = vec4( UnpackDownscale / PackFactors.rgb, 1.0 / PackFactors.a );
vec4 packDepthToRGBA( const in float v ) {
	if( v <= 0.0 )
		return vec4( 0., 0., 0., 0. );
	if( v >= 1.0 )
		return vec4( 1., 1., 1., 1. );
	float vuf;
	float af = modf( v * PackFactors.a, vuf );
	float bf = modf( vuf * ShiftRight8, vuf );
	float gf = modf( vuf * ShiftRight8, vuf );
	return vec4( vuf * Inv255, gf * PackUpscale, bf * PackUpscale, af );
}
vec3 packDepthToRGB( const in float v ) {
	if( v <= 0.0 )
		return vec3( 0., 0., 0. );
	if( v >= 1.0 )
		return vec3( 1., 1., 1. );
	float vuf;
	float bf = modf( v * PackFactors.b, vuf );
	float gf = modf( vuf * ShiftRight8, vuf );
	return vec3( vuf * Inv255, gf * PackUpscale, bf );
}
vec2 packDepthToRG( const in float v ) {
	if( v <= 0.0 )
		return vec2( 0., 0. );
	if( v >= 1.0 )
		return vec2( 1., 1. );
	float vuf;
	float gf = modf( v * 256., vuf );
	return vec2( vuf * Inv255, gf );
}
float unpackRGBAToDepth( const in vec4 v ) {
	return dot( v, UnpackFactors4 );
}
float unpackRGBToDepth( const in vec3 v ) {
	return dot( v, UnpackFactors3 );
}
float unpackRGToDepth( const in vec2 v ) {
	return v.r * UnpackFactors2.r + v.g * UnpackFactors2.g;
}
vec4 pack2HalfToRGBA( const in vec2 v ) {
	vec4 r = vec4( v.x, fract( v.x * 255.0 ), v.y, fract( v.y * 255.0 ) );
	return vec4( r.x - r.y / 255.0, r.y, r.z - r.w / 255.0, r.w );
}
vec2 unpackRGBATo2Half( const in vec4 v ) {
	return vec2( v.x + ( v.y / 255.0 ), v.z + ( v.w / 255.0 ) );
}
float viewZToOrthographicDepth( const in float viewZ, const in float near, const in float far ) {
	return ( viewZ + near ) / ( near - far );
}
float orthographicDepthToViewZ( const in float depth, const in float near, const in float far ) {
	return depth * ( near - far ) - near;
}
float viewZToPerspectiveDepth( const in float viewZ, const in float near, const in float far ) {
	return ( ( near + viewZ ) * far ) / ( ( far - near ) * viewZ );
}
float perspectiveDepthToViewZ( const in float depth, const in float near, const in float far ) {
	return ( near * far ) / ( ( far - near ) * depth - far );
}`,ig=`#ifdef PREMULTIPLIED_ALPHA
	gl_FragColor.rgb *= gl_FragColor.a;
#endif`,sg=`vec4 mvPosition = vec4( transformed, 1.0 );
#ifdef USE_BATCHING
	mvPosition = batchingMatrix * mvPosition;
#endif
#ifdef USE_INSTANCING
	mvPosition = instanceMatrix * mvPosition;
#endif
mvPosition = modelViewMatrix * mvPosition;
gl_Position = projectionMatrix * mvPosition;`,rg=`#ifdef DITHERING
	gl_FragColor.rgb = dithering( gl_FragColor.rgb );
#endif`,og=`#ifdef DITHERING
	vec3 dithering( vec3 color ) {
		float grid_position = rand( gl_FragCoord.xy );
		vec3 dither_shift_RGB = vec3( 0.25 / 255.0, -0.25 / 255.0, 0.25 / 255.0 );
		dither_shift_RGB = mix( 2.0 * dither_shift_RGB, -2.0 * dither_shift_RGB, grid_position );
		return color + dither_shift_RGB;
	}
#endif`,ag=`float roughnessFactor = roughness;
#ifdef USE_ROUGHNESSMAP
	vec4 texelRoughness = texture2D( roughnessMap, vRoughnessMapUv );
	roughnessFactor *= texelRoughness.g;
#endif`,cg=`#ifdef USE_ROUGHNESSMAP
	uniform sampler2D roughnessMap;
#endif`,lg=`#if NUM_SPOT_LIGHT_COORDS > 0
	varying vec4 vSpotLightCoord[ NUM_SPOT_LIGHT_COORDS ];
#endif
#if NUM_SPOT_LIGHT_MAPS > 0
	uniform sampler2D spotLightMap[ NUM_SPOT_LIGHT_MAPS ];
#endif
#ifdef USE_SHADOWMAP
	#if NUM_DIR_LIGHT_SHADOWS > 0
		uniform sampler2D directionalShadowMap[ NUM_DIR_LIGHT_SHADOWS ];
		varying vec4 vDirectionalShadowCoord[ NUM_DIR_LIGHT_SHADOWS ];
		struct DirectionalLightShadow {
			float shadowIntensity;
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
		};
		uniform DirectionalLightShadow directionalLightShadows[ NUM_DIR_LIGHT_SHADOWS ];
	#endif
	#if NUM_SPOT_LIGHT_SHADOWS > 0
		uniform sampler2D spotShadowMap[ NUM_SPOT_LIGHT_SHADOWS ];
		struct SpotLightShadow {
			float shadowIntensity;
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
		};
		uniform SpotLightShadow spotLightShadows[ NUM_SPOT_LIGHT_SHADOWS ];
	#endif
	#if NUM_POINT_LIGHT_SHADOWS > 0
		uniform sampler2D pointShadowMap[ NUM_POINT_LIGHT_SHADOWS ];
		varying vec4 vPointShadowCoord[ NUM_POINT_LIGHT_SHADOWS ];
		struct PointLightShadow {
			float shadowIntensity;
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
			float shadowCameraNear;
			float shadowCameraFar;
		};
		uniform PointLightShadow pointLightShadows[ NUM_POINT_LIGHT_SHADOWS ];
	#endif
	float texture2DCompare( sampler2D depths, vec2 uv, float compare ) {
		return step( compare, unpackRGBAToDepth( texture2D( depths, uv ) ) );
	}
	vec2 texture2DDistribution( sampler2D shadow, vec2 uv ) {
		return unpackRGBATo2Half( texture2D( shadow, uv ) );
	}
	float VSMShadow (sampler2D shadow, vec2 uv, float compare ){
		float occlusion = 1.0;
		vec2 distribution = texture2DDistribution( shadow, uv );
		float hard_shadow = step( compare , distribution.x );
		if (hard_shadow != 1.0 ) {
			float distance = compare - distribution.x ;
			float variance = max( 0.00000, distribution.y * distribution.y );
			float softness_probability = variance / (variance + distance * distance );			softness_probability = clamp( ( softness_probability - 0.3 ) / ( 0.95 - 0.3 ), 0.0, 1.0 );			occlusion = clamp( max( hard_shadow, softness_probability ), 0.0, 1.0 );
		}
		return occlusion;
	}
	float getShadow( sampler2D shadowMap, vec2 shadowMapSize, float shadowIntensity, float shadowBias, float shadowRadius, vec4 shadowCoord ) {
		float shadow = 1.0;
		shadowCoord.xyz /= shadowCoord.w;
		shadowCoord.z += shadowBias;
		bool inFrustum = shadowCoord.x >= 0.0 && shadowCoord.x <= 1.0 && shadowCoord.y >= 0.0 && shadowCoord.y <= 1.0;
		bool frustumTest = inFrustum && shadowCoord.z <= 1.0;
		if ( frustumTest ) {
		#if defined( SHADOWMAP_TYPE_PCF )
			vec2 texelSize = vec2( 1.0 ) / shadowMapSize;
			float dx0 = - texelSize.x * shadowRadius;
			float dy0 = - texelSize.y * shadowRadius;
			float dx1 = + texelSize.x * shadowRadius;
			float dy1 = + texelSize.y * shadowRadius;
			float dx2 = dx0 / 2.0;
			float dy2 = dy0 / 2.0;
			float dx3 = dx1 / 2.0;
			float dy3 = dy1 / 2.0;
			shadow = (
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx0, dy0 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( 0.0, dy0 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx1, dy0 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx2, dy2 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( 0.0, dy2 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx3, dy2 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx0, 0.0 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx2, 0.0 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy, shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx3, 0.0 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx1, 0.0 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx2, dy3 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( 0.0, dy3 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx3, dy3 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx0, dy1 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( 0.0, dy1 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx1, dy1 ), shadowCoord.z )
			) * ( 1.0 / 17.0 );
		#elif defined( SHADOWMAP_TYPE_PCF_SOFT )
			vec2 texelSize = vec2( 1.0 ) / shadowMapSize;
			float dx = texelSize.x;
			float dy = texelSize.y;
			vec2 uv = shadowCoord.xy;
			vec2 f = fract( uv * shadowMapSize + 0.5 );
			uv -= f * texelSize;
			shadow = (
				texture2DCompare( shadowMap, uv, shadowCoord.z ) +
				texture2DCompare( shadowMap, uv + vec2( dx, 0.0 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, uv + vec2( 0.0, dy ), shadowCoord.z ) +
				texture2DCompare( shadowMap, uv + texelSize, shadowCoord.z ) +
				mix( texture2DCompare( shadowMap, uv + vec2( -dx, 0.0 ), shadowCoord.z ),
					 texture2DCompare( shadowMap, uv + vec2( 2.0 * dx, 0.0 ), shadowCoord.z ),
					 f.x ) +
				mix( texture2DCompare( shadowMap, uv + vec2( -dx, dy ), shadowCoord.z ),
					 texture2DCompare( shadowMap, uv + vec2( 2.0 * dx, dy ), shadowCoord.z ),
					 f.x ) +
				mix( texture2DCompare( shadowMap, uv + vec2( 0.0, -dy ), shadowCoord.z ),
					 texture2DCompare( shadowMap, uv + vec2( 0.0, 2.0 * dy ), shadowCoord.z ),
					 f.y ) +
				mix( texture2DCompare( shadowMap, uv + vec2( dx, -dy ), shadowCoord.z ),
					 texture2DCompare( shadowMap, uv + vec2( dx, 2.0 * dy ), shadowCoord.z ),
					 f.y ) +
				mix( mix( texture2DCompare( shadowMap, uv + vec2( -dx, -dy ), shadowCoord.z ),
						  texture2DCompare( shadowMap, uv + vec2( 2.0 * dx, -dy ), shadowCoord.z ),
						  f.x ),
					 mix( texture2DCompare( shadowMap, uv + vec2( -dx, 2.0 * dy ), shadowCoord.z ),
						  texture2DCompare( shadowMap, uv + vec2( 2.0 * dx, 2.0 * dy ), shadowCoord.z ),
						  f.x ),
					 f.y )
			) * ( 1.0 / 9.0 );
		#elif defined( SHADOWMAP_TYPE_VSM )
			shadow = VSMShadow( shadowMap, shadowCoord.xy, shadowCoord.z );
		#else
			shadow = texture2DCompare( shadowMap, shadowCoord.xy, shadowCoord.z );
		#endif
		}
		return mix( 1.0, shadow, shadowIntensity );
	}
	vec2 cubeToUV( vec3 v, float texelSizeY ) {
		vec3 absV = abs( v );
		float scaleToCube = 1.0 / max( absV.x, max( absV.y, absV.z ) );
		absV *= scaleToCube;
		v *= scaleToCube * ( 1.0 - 2.0 * texelSizeY );
		vec2 planar = v.xy;
		float almostATexel = 1.5 * texelSizeY;
		float almostOne = 1.0 - almostATexel;
		if ( absV.z >= almostOne ) {
			if ( v.z > 0.0 )
				planar.x = 4.0 - v.x;
		} else if ( absV.x >= almostOne ) {
			float signX = sign( v.x );
			planar.x = v.z * signX + 2.0 * signX;
		} else if ( absV.y >= almostOne ) {
			float signY = sign( v.y );
			planar.x = v.x + 2.0 * signY + 2.0;
			planar.y = v.z * signY - 2.0;
		}
		return vec2( 0.125, 0.25 ) * planar + vec2( 0.375, 0.75 );
	}
	float getPointShadow( sampler2D shadowMap, vec2 shadowMapSize, float shadowIntensity, float shadowBias, float shadowRadius, vec4 shadowCoord, float shadowCameraNear, float shadowCameraFar ) {
		float shadow = 1.0;
		vec3 lightToPosition = shadowCoord.xyz;
		
		float lightToPositionLength = length( lightToPosition );
		if ( lightToPositionLength - shadowCameraFar <= 0.0 && lightToPositionLength - shadowCameraNear >= 0.0 ) {
			float dp = ( lightToPositionLength - shadowCameraNear ) / ( shadowCameraFar - shadowCameraNear );			dp += shadowBias;
			vec3 bd3D = normalize( lightToPosition );
			vec2 texelSize = vec2( 1.0 ) / ( shadowMapSize * vec2( 4.0, 2.0 ) );
			#if defined( SHADOWMAP_TYPE_PCF ) || defined( SHADOWMAP_TYPE_PCF_SOFT ) || defined( SHADOWMAP_TYPE_VSM )
				vec2 offset = vec2( - 1, 1 ) * shadowRadius * texelSize.y;
				shadow = (
					texture2DCompare( shadowMap, cubeToUV( bd3D + offset.xyy, texelSize.y ), dp ) +
					texture2DCompare( shadowMap, cubeToUV( bd3D + offset.yyy, texelSize.y ), dp ) +
					texture2DCompare( shadowMap, cubeToUV( bd3D + offset.xyx, texelSize.y ), dp ) +
					texture2DCompare( shadowMap, cubeToUV( bd3D + offset.yyx, texelSize.y ), dp ) +
					texture2DCompare( shadowMap, cubeToUV( bd3D, texelSize.y ), dp ) +
					texture2DCompare( shadowMap, cubeToUV( bd3D + offset.xxy, texelSize.y ), dp ) +
					texture2DCompare( shadowMap, cubeToUV( bd3D + offset.yxy, texelSize.y ), dp ) +
					texture2DCompare( shadowMap, cubeToUV( bd3D + offset.xxx, texelSize.y ), dp ) +
					texture2DCompare( shadowMap, cubeToUV( bd3D + offset.yxx, texelSize.y ), dp )
				) * ( 1.0 / 9.0 );
			#else
				shadow = texture2DCompare( shadowMap, cubeToUV( bd3D, texelSize.y ), dp );
			#endif
		}
		return mix( 1.0, shadow, shadowIntensity );
	}
#endif`,hg=`#if NUM_SPOT_LIGHT_COORDS > 0
	uniform mat4 spotLightMatrix[ NUM_SPOT_LIGHT_COORDS ];
	varying vec4 vSpotLightCoord[ NUM_SPOT_LIGHT_COORDS ];
#endif
#ifdef USE_SHADOWMAP
	#if NUM_DIR_LIGHT_SHADOWS > 0
		uniform mat4 directionalShadowMatrix[ NUM_DIR_LIGHT_SHADOWS ];
		varying vec4 vDirectionalShadowCoord[ NUM_DIR_LIGHT_SHADOWS ];
		struct DirectionalLightShadow {
			float shadowIntensity;
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
		};
		uniform DirectionalLightShadow directionalLightShadows[ NUM_DIR_LIGHT_SHADOWS ];
	#endif
	#if NUM_SPOT_LIGHT_SHADOWS > 0
		struct SpotLightShadow {
			float shadowIntensity;
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
		};
		uniform SpotLightShadow spotLightShadows[ NUM_SPOT_LIGHT_SHADOWS ];
	#endif
	#if NUM_POINT_LIGHT_SHADOWS > 0
		uniform mat4 pointShadowMatrix[ NUM_POINT_LIGHT_SHADOWS ];
		varying vec4 vPointShadowCoord[ NUM_POINT_LIGHT_SHADOWS ];
		struct PointLightShadow {
			float shadowIntensity;
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
			float shadowCameraNear;
			float shadowCameraFar;
		};
		uniform PointLightShadow pointLightShadows[ NUM_POINT_LIGHT_SHADOWS ];
	#endif
#endif`,ug=`#if ( defined( USE_SHADOWMAP ) && ( NUM_DIR_LIGHT_SHADOWS > 0 || NUM_POINT_LIGHT_SHADOWS > 0 ) ) || ( NUM_SPOT_LIGHT_COORDS > 0 )
	vec3 shadowWorldNormal = inverseTransformDirection( transformedNormal, viewMatrix );
	vec4 shadowWorldPosition;
#endif
#if defined( USE_SHADOWMAP )
	#if NUM_DIR_LIGHT_SHADOWS > 0
		#pragma unroll_loop_start
		for ( int i = 0; i < NUM_DIR_LIGHT_SHADOWS; i ++ ) {
			shadowWorldPosition = worldPosition + vec4( shadowWorldNormal * directionalLightShadows[ i ].shadowNormalBias, 0 );
			vDirectionalShadowCoord[ i ] = directionalShadowMatrix[ i ] * shadowWorldPosition;
		}
		#pragma unroll_loop_end
	#endif
	#if NUM_POINT_LIGHT_SHADOWS > 0
		#pragma unroll_loop_start
		for ( int i = 0; i < NUM_POINT_LIGHT_SHADOWS; i ++ ) {
			shadowWorldPosition = worldPosition + vec4( shadowWorldNormal * pointLightShadows[ i ].shadowNormalBias, 0 );
			vPointShadowCoord[ i ] = pointShadowMatrix[ i ] * shadowWorldPosition;
		}
		#pragma unroll_loop_end
	#endif
#endif
#if NUM_SPOT_LIGHT_COORDS > 0
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_SPOT_LIGHT_COORDS; i ++ ) {
		shadowWorldPosition = worldPosition;
		#if ( defined( USE_SHADOWMAP ) && UNROLLED_LOOP_INDEX < NUM_SPOT_LIGHT_SHADOWS )
			shadowWorldPosition.xyz += shadowWorldNormal * spotLightShadows[ i ].shadowNormalBias;
		#endif
		vSpotLightCoord[ i ] = spotLightMatrix[ i ] * shadowWorldPosition;
	}
	#pragma unroll_loop_end
#endif`,dg=`float getShadowMask() {
	float shadow = 1.0;
	#ifdef USE_SHADOWMAP
	#if NUM_DIR_LIGHT_SHADOWS > 0
	DirectionalLightShadow directionalLight;
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_DIR_LIGHT_SHADOWS; i ++ ) {
		directionalLight = directionalLightShadows[ i ];
		shadow *= receiveShadow ? getShadow( directionalShadowMap[ i ], directionalLight.shadowMapSize, directionalLight.shadowIntensity, directionalLight.shadowBias, directionalLight.shadowRadius, vDirectionalShadowCoord[ i ] ) : 1.0;
	}
	#pragma unroll_loop_end
	#endif
	#if NUM_SPOT_LIGHT_SHADOWS > 0
	SpotLightShadow spotLight;
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_SPOT_LIGHT_SHADOWS; i ++ ) {
		spotLight = spotLightShadows[ i ];
		shadow *= receiveShadow ? getShadow( spotShadowMap[ i ], spotLight.shadowMapSize, spotLight.shadowIntensity, spotLight.shadowBias, spotLight.shadowRadius, vSpotLightCoord[ i ] ) : 1.0;
	}
	#pragma unroll_loop_end
	#endif
	#if NUM_POINT_LIGHT_SHADOWS > 0
	PointLightShadow pointLight;
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_POINT_LIGHT_SHADOWS; i ++ ) {
		pointLight = pointLightShadows[ i ];
		shadow *= receiveShadow ? getPointShadow( pointShadowMap[ i ], pointLight.shadowMapSize, pointLight.shadowIntensity, pointLight.shadowBias, pointLight.shadowRadius, vPointShadowCoord[ i ], pointLight.shadowCameraNear, pointLight.shadowCameraFar ) : 1.0;
	}
	#pragma unroll_loop_end
	#endif
	#endif
	return shadow;
}`,fg=`#ifdef USE_SKINNING
	mat4 boneMatX = getBoneMatrix( skinIndex.x );
	mat4 boneMatY = getBoneMatrix( skinIndex.y );
	mat4 boneMatZ = getBoneMatrix( skinIndex.z );
	mat4 boneMatW = getBoneMatrix( skinIndex.w );
#endif`,pg=`#ifdef USE_SKINNING
	uniform mat4 bindMatrix;
	uniform mat4 bindMatrixInverse;
	uniform highp sampler2D boneTexture;
	mat4 getBoneMatrix( const in float i ) {
		int size = textureSize( boneTexture, 0 ).x;
		int j = int( i ) * 4;
		int x = j % size;
		int y = j / size;
		vec4 v1 = texelFetch( boneTexture, ivec2( x, y ), 0 );
		vec4 v2 = texelFetch( boneTexture, ivec2( x + 1, y ), 0 );
		vec4 v3 = texelFetch( boneTexture, ivec2( x + 2, y ), 0 );
		vec4 v4 = texelFetch( boneTexture, ivec2( x + 3, y ), 0 );
		return mat4( v1, v2, v3, v4 );
	}
#endif`,mg=`#ifdef USE_SKINNING
	vec4 skinVertex = bindMatrix * vec4( transformed, 1.0 );
	vec4 skinned = vec4( 0.0 );
	skinned += boneMatX * skinVertex * skinWeight.x;
	skinned += boneMatY * skinVertex * skinWeight.y;
	skinned += boneMatZ * skinVertex * skinWeight.z;
	skinned += boneMatW * skinVertex * skinWeight.w;
	transformed = ( bindMatrixInverse * skinned ).xyz;
#endif`,gg=`#ifdef USE_SKINNING
	mat4 skinMatrix = mat4( 0.0 );
	skinMatrix += skinWeight.x * boneMatX;
	skinMatrix += skinWeight.y * boneMatY;
	skinMatrix += skinWeight.z * boneMatZ;
	skinMatrix += skinWeight.w * boneMatW;
	skinMatrix = bindMatrixInverse * skinMatrix * bindMatrix;
	objectNormal = vec4( skinMatrix * vec4( objectNormal, 0.0 ) ).xyz;
	#ifdef USE_TANGENT
		objectTangent = vec4( skinMatrix * vec4( objectTangent, 0.0 ) ).xyz;
	#endif
#endif`,_g=`float specularStrength;
#ifdef USE_SPECULARMAP
	vec4 texelSpecular = texture2D( specularMap, vSpecularMapUv );
	specularStrength = texelSpecular.r;
#else
	specularStrength = 1.0;
#endif`,yg=`#ifdef USE_SPECULARMAP
	uniform sampler2D specularMap;
#endif`,xg=`#if defined( TONE_MAPPING )
	gl_FragColor.rgb = toneMapping( gl_FragColor.rgb );
#endif`,vg=`#ifndef saturate
#define saturate( a ) clamp( a, 0.0, 1.0 )
#endif
uniform float toneMappingExposure;
vec3 LinearToneMapping( vec3 color ) {
	return saturate( toneMappingExposure * color );
}
vec3 ReinhardToneMapping( vec3 color ) {
	color *= toneMappingExposure;
	return saturate( color / ( vec3( 1.0 ) + color ) );
}
vec3 CineonToneMapping( vec3 color ) {
	color *= toneMappingExposure;
	color = max( vec3( 0.0 ), color - 0.004 );
	return pow( ( color * ( 6.2 * color + 0.5 ) ) / ( color * ( 6.2 * color + 1.7 ) + 0.06 ), vec3( 2.2 ) );
}
vec3 RRTAndODTFit( vec3 v ) {
	vec3 a = v * ( v + 0.0245786 ) - 0.000090537;
	vec3 b = v * ( 0.983729 * v + 0.4329510 ) + 0.238081;
	return a / b;
}
vec3 ACESFilmicToneMapping( vec3 color ) {
	const mat3 ACESInputMat = mat3(
		vec3( 0.59719, 0.07600, 0.02840 ),		vec3( 0.35458, 0.90834, 0.13383 ),
		vec3( 0.04823, 0.01566, 0.83777 )
	);
	const mat3 ACESOutputMat = mat3(
		vec3(  1.60475, -0.10208, -0.00327 ),		vec3( -0.53108,  1.10813, -0.07276 ),
		vec3( -0.07367, -0.00605,  1.07602 )
	);
	color *= toneMappingExposure / 0.6;
	color = ACESInputMat * color;
	color = RRTAndODTFit( color );
	color = ACESOutputMat * color;
	return saturate( color );
}
const mat3 LINEAR_REC2020_TO_LINEAR_SRGB = mat3(
	vec3( 1.6605, - 0.1246, - 0.0182 ),
	vec3( - 0.5876, 1.1329, - 0.1006 ),
	vec3( - 0.0728, - 0.0083, 1.1187 )
);
const mat3 LINEAR_SRGB_TO_LINEAR_REC2020 = mat3(
	vec3( 0.6274, 0.0691, 0.0164 ),
	vec3( 0.3293, 0.9195, 0.0880 ),
	vec3( 0.0433, 0.0113, 0.8956 )
);
vec3 agxDefaultContrastApprox( vec3 x ) {
	vec3 x2 = x * x;
	vec3 x4 = x2 * x2;
	return + 15.5 * x4 * x2
		- 40.14 * x4 * x
		+ 31.96 * x4
		- 6.868 * x2 * x
		+ 0.4298 * x2
		+ 0.1191 * x
		- 0.00232;
}
vec3 AgXToneMapping( vec3 color ) {
	const mat3 AgXInsetMatrix = mat3(
		vec3( 0.856627153315983, 0.137318972929847, 0.11189821299995 ),
		vec3( 0.0951212405381588, 0.761241990602591, 0.0767994186031903 ),
		vec3( 0.0482516061458583, 0.101439036467562, 0.811302368396859 )
	);
	const mat3 AgXOutsetMatrix = mat3(
		vec3( 1.1271005818144368, - 0.1413297634984383, - 0.14132976349843826 ),
		vec3( - 0.11060664309660323, 1.157823702216272, - 0.11060664309660294 ),
		vec3( - 0.016493938717834573, - 0.016493938717834257, 1.2519364065950405 )
	);
	const float AgxMinEv = - 12.47393;	const float AgxMaxEv = 4.026069;
	color *= toneMappingExposure;
	color = LINEAR_SRGB_TO_LINEAR_REC2020 * color;
	color = AgXInsetMatrix * color;
	color = max( color, 1e-10 );	color = log2( color );
	color = ( color - AgxMinEv ) / ( AgxMaxEv - AgxMinEv );
	color = clamp( color, 0.0, 1.0 );
	color = agxDefaultContrastApprox( color );
	color = AgXOutsetMatrix * color;
	color = pow( max( vec3( 0.0 ), color ), vec3( 2.2 ) );
	color = LINEAR_REC2020_TO_LINEAR_SRGB * color;
	color = clamp( color, 0.0, 1.0 );
	return color;
}
vec3 NeutralToneMapping( vec3 color ) {
	const float StartCompression = 0.8 - 0.04;
	const float Desaturation = 0.15;
	color *= toneMappingExposure;
	float x = min( color.r, min( color.g, color.b ) );
	float offset = x < 0.08 ? x - 6.25 * x * x : 0.04;
	color -= offset;
	float peak = max( color.r, max( color.g, color.b ) );
	if ( peak < StartCompression ) return color;
	float d = 1. - StartCompression;
	float newPeak = 1. - d * d / ( peak + d - StartCompression );
	color *= newPeak / peak;
	float g = 1. - 1. / ( Desaturation * ( peak - newPeak ) + 1. );
	return mix( color, vec3( newPeak ), g );
}
vec3 CustomToneMapping( vec3 color ) { return color; }`,Mg=`#ifdef USE_TRANSMISSION
	material.transmission = transmission;
	material.transmissionAlpha = 1.0;
	material.thickness = thickness;
	material.attenuationDistance = attenuationDistance;
	material.attenuationColor = attenuationColor;
	#ifdef USE_TRANSMISSIONMAP
		material.transmission *= texture2D( transmissionMap, vTransmissionMapUv ).r;
	#endif
	#ifdef USE_THICKNESSMAP
		material.thickness *= texture2D( thicknessMap, vThicknessMapUv ).g;
	#endif
	vec3 pos = vWorldPosition;
	vec3 v = normalize( cameraPosition - pos );
	vec3 n = inverseTransformDirection( normal, viewMatrix );
	vec4 transmitted = getIBLVolumeRefraction(
		n, v, material.roughness, material.diffuseColor, material.specularColor, material.specularF90,
		pos, modelMatrix, viewMatrix, projectionMatrix, material.dispersion, material.ior, material.thickness,
		material.attenuationColor, material.attenuationDistance );
	material.transmissionAlpha = mix( material.transmissionAlpha, transmitted.a, material.transmission );
	totalDiffuse = mix( totalDiffuse, transmitted.rgb, material.transmission );
#endif`,bg=`#ifdef USE_TRANSMISSION
	uniform float transmission;
	uniform float thickness;
	uniform float attenuationDistance;
	uniform vec3 attenuationColor;
	#ifdef USE_TRANSMISSIONMAP
		uniform sampler2D transmissionMap;
	#endif
	#ifdef USE_THICKNESSMAP
		uniform sampler2D thicknessMap;
	#endif
	uniform vec2 transmissionSamplerSize;
	uniform sampler2D transmissionSamplerMap;
	uniform mat4 modelMatrix;
	uniform mat4 projectionMatrix;
	varying vec3 vWorldPosition;
	float w0( float a ) {
		return ( 1.0 / 6.0 ) * ( a * ( a * ( - a + 3.0 ) - 3.0 ) + 1.0 );
	}
	float w1( float a ) {
		return ( 1.0 / 6.0 ) * ( a *  a * ( 3.0 * a - 6.0 ) + 4.0 );
	}
	float w2( float a ){
		return ( 1.0 / 6.0 ) * ( a * ( a * ( - 3.0 * a + 3.0 ) + 3.0 ) + 1.0 );
	}
	float w3( float a ) {
		return ( 1.0 / 6.0 ) * ( a * a * a );
	}
	float g0( float a ) {
		return w0( a ) + w1( a );
	}
	float g1( float a ) {
		return w2( a ) + w3( a );
	}
	float h0( float a ) {
		return - 1.0 + w1( a ) / ( w0( a ) + w1( a ) );
	}
	float h1( float a ) {
		return 1.0 + w3( a ) / ( w2( a ) + w3( a ) );
	}
	vec4 bicubic( sampler2D tex, vec2 uv, vec4 texelSize, float lod ) {
		uv = uv * texelSize.zw + 0.5;
		vec2 iuv = floor( uv );
		vec2 fuv = fract( uv );
		float g0x = g0( fuv.x );
		float g1x = g1( fuv.x );
		float h0x = h0( fuv.x );
		float h1x = h1( fuv.x );
		float h0y = h0( fuv.y );
		float h1y = h1( fuv.y );
		vec2 p0 = ( vec2( iuv.x + h0x, iuv.y + h0y ) - 0.5 ) * texelSize.xy;
		vec2 p1 = ( vec2( iuv.x + h1x, iuv.y + h0y ) - 0.5 ) * texelSize.xy;
		vec2 p2 = ( vec2( iuv.x + h0x, iuv.y + h1y ) - 0.5 ) * texelSize.xy;
		vec2 p3 = ( vec2( iuv.x + h1x, iuv.y + h1y ) - 0.5 ) * texelSize.xy;
		return g0( fuv.y ) * ( g0x * textureLod( tex, p0, lod ) + g1x * textureLod( tex, p1, lod ) ) +
			g1( fuv.y ) * ( g0x * textureLod( tex, p2, lod ) + g1x * textureLod( tex, p3, lod ) );
	}
	vec4 textureBicubic( sampler2D sampler, vec2 uv, float lod ) {
		vec2 fLodSize = vec2( textureSize( sampler, int( lod ) ) );
		vec2 cLodSize = vec2( textureSize( sampler, int( lod + 1.0 ) ) );
		vec2 fLodSizeInv = 1.0 / fLodSize;
		vec2 cLodSizeInv = 1.0 / cLodSize;
		vec4 fSample = bicubic( sampler, uv, vec4( fLodSizeInv, fLodSize ), floor( lod ) );
		vec4 cSample = bicubic( sampler, uv, vec4( cLodSizeInv, cLodSize ), ceil( lod ) );
		return mix( fSample, cSample, fract( lod ) );
	}
	vec3 getVolumeTransmissionRay( const in vec3 n, const in vec3 v, const in float thickness, const in float ior, const in mat4 modelMatrix ) {
		vec3 refractionVector = refract( - v, normalize( n ), 1.0 / ior );
		vec3 modelScale;
		modelScale.x = length( vec3( modelMatrix[ 0 ].xyz ) );
		modelScale.y = length( vec3( modelMatrix[ 1 ].xyz ) );
		modelScale.z = length( vec3( modelMatrix[ 2 ].xyz ) );
		return normalize( refractionVector ) * thickness * modelScale;
	}
	float applyIorToRoughness( const in float roughness, const in float ior ) {
		return roughness * clamp( ior * 2.0 - 2.0, 0.0, 1.0 );
	}
	vec4 getTransmissionSample( const in vec2 fragCoord, const in float roughness, const in float ior ) {
		float lod = log2( transmissionSamplerSize.x ) * applyIorToRoughness( roughness, ior );
		return textureBicubic( transmissionSamplerMap, fragCoord.xy, lod );
	}
	vec3 volumeAttenuation( const in float transmissionDistance, const in vec3 attenuationColor, const in float attenuationDistance ) {
		if ( isinf( attenuationDistance ) ) {
			return vec3( 1.0 );
		} else {
			vec3 attenuationCoefficient = -log( attenuationColor ) / attenuationDistance;
			vec3 transmittance = exp( - attenuationCoefficient * transmissionDistance );			return transmittance;
		}
	}
	vec4 getIBLVolumeRefraction( const in vec3 n, const in vec3 v, const in float roughness, const in vec3 diffuseColor,
		const in vec3 specularColor, const in float specularF90, const in vec3 position, const in mat4 modelMatrix,
		const in mat4 viewMatrix, const in mat4 projMatrix, const in float dispersion, const in float ior, const in float thickness,
		const in vec3 attenuationColor, const in float attenuationDistance ) {
		vec4 transmittedLight;
		vec3 transmittance;
		#ifdef USE_DISPERSION
			float halfSpread = ( ior - 1.0 ) * 0.025 * dispersion;
			vec3 iors = vec3( ior - halfSpread, ior, ior + halfSpread );
			for ( int i = 0; i < 3; i ++ ) {
				vec3 transmissionRay = getVolumeTransmissionRay( n, v, thickness, iors[ i ], modelMatrix );
				vec3 refractedRayExit = position + transmissionRay;
		
				vec4 ndcPos = projMatrix * viewMatrix * vec4( refractedRayExit, 1.0 );
				vec2 refractionCoords = ndcPos.xy / ndcPos.w;
				refractionCoords += 1.0;
				refractionCoords /= 2.0;
		
				vec4 transmissionSample = getTransmissionSample( refractionCoords, roughness, iors[ i ] );
				transmittedLight[ i ] = transmissionSample[ i ];
				transmittedLight.a += transmissionSample.a;
				transmittance[ i ] = diffuseColor[ i ] * volumeAttenuation( length( transmissionRay ), attenuationColor, attenuationDistance )[ i ];
			}
			transmittedLight.a /= 3.0;
		
		#else
		
			vec3 transmissionRay = getVolumeTransmissionRay( n, v, thickness, ior, modelMatrix );
			vec3 refractedRayExit = position + transmissionRay;
			vec4 ndcPos = projMatrix * viewMatrix * vec4( refractedRayExit, 1.0 );
			vec2 refractionCoords = ndcPos.xy / ndcPos.w;
			refractionCoords += 1.0;
			refractionCoords /= 2.0;
			transmittedLight = getTransmissionSample( refractionCoords, roughness, ior );
			transmittance = diffuseColor * volumeAttenuation( length( transmissionRay ), attenuationColor, attenuationDistance );
		
		#endif
		vec3 attenuatedColor = transmittance * transmittedLight.rgb;
		vec3 F = EnvironmentBRDF( n, v, specularColor, specularF90, roughness );
		float transmittanceFactor = ( transmittance.r + transmittance.g + transmittance.b ) / 3.0;
		return vec4( ( 1.0 - F ) * attenuatedColor, 1.0 - ( 1.0 - transmittedLight.a ) * transmittanceFactor );
	}
#endif`,Sg=`#if defined( USE_UV ) || defined( USE_ANISOTROPY )
	varying vec2 vUv;
#endif
#ifdef USE_MAP
	varying vec2 vMapUv;
#endif
#ifdef USE_ALPHAMAP
	varying vec2 vAlphaMapUv;
#endif
#ifdef USE_LIGHTMAP
	varying vec2 vLightMapUv;
#endif
#ifdef USE_AOMAP
	varying vec2 vAoMapUv;
#endif
#ifdef USE_BUMPMAP
	varying vec2 vBumpMapUv;
#endif
#ifdef USE_NORMALMAP
	varying vec2 vNormalMapUv;
#endif
#ifdef USE_EMISSIVEMAP
	varying vec2 vEmissiveMapUv;
#endif
#ifdef USE_METALNESSMAP
	varying vec2 vMetalnessMapUv;
#endif
#ifdef USE_ROUGHNESSMAP
	varying vec2 vRoughnessMapUv;
#endif
#ifdef USE_ANISOTROPYMAP
	varying vec2 vAnisotropyMapUv;
#endif
#ifdef USE_CLEARCOATMAP
	varying vec2 vClearcoatMapUv;
#endif
#ifdef USE_CLEARCOAT_NORMALMAP
	varying vec2 vClearcoatNormalMapUv;
#endif
#ifdef USE_CLEARCOAT_ROUGHNESSMAP
	varying vec2 vClearcoatRoughnessMapUv;
#endif
#ifdef USE_IRIDESCENCEMAP
	varying vec2 vIridescenceMapUv;
#endif
#ifdef USE_IRIDESCENCE_THICKNESSMAP
	varying vec2 vIridescenceThicknessMapUv;
#endif
#ifdef USE_SHEEN_COLORMAP
	varying vec2 vSheenColorMapUv;
#endif
#ifdef USE_SHEEN_ROUGHNESSMAP
	varying vec2 vSheenRoughnessMapUv;
#endif
#ifdef USE_SPECULARMAP
	varying vec2 vSpecularMapUv;
#endif
#ifdef USE_SPECULAR_COLORMAP
	varying vec2 vSpecularColorMapUv;
#endif
#ifdef USE_SPECULAR_INTENSITYMAP
	varying vec2 vSpecularIntensityMapUv;
#endif
#ifdef USE_TRANSMISSIONMAP
	uniform mat3 transmissionMapTransform;
	varying vec2 vTransmissionMapUv;
#endif
#ifdef USE_THICKNESSMAP
	uniform mat3 thicknessMapTransform;
	varying vec2 vThicknessMapUv;
#endif`,Eg=`#if defined( USE_UV ) || defined( USE_ANISOTROPY )
	varying vec2 vUv;
#endif
#ifdef USE_MAP
	uniform mat3 mapTransform;
	varying vec2 vMapUv;
#endif
#ifdef USE_ALPHAMAP
	uniform mat3 alphaMapTransform;
	varying vec2 vAlphaMapUv;
#endif
#ifdef USE_LIGHTMAP
	uniform mat3 lightMapTransform;
	varying vec2 vLightMapUv;
#endif
#ifdef USE_AOMAP
	uniform mat3 aoMapTransform;
	varying vec2 vAoMapUv;
#endif
#ifdef USE_BUMPMAP
	uniform mat3 bumpMapTransform;
	varying vec2 vBumpMapUv;
#endif
#ifdef USE_NORMALMAP
	uniform mat3 normalMapTransform;
	varying vec2 vNormalMapUv;
#endif
#ifdef USE_DISPLACEMENTMAP
	uniform mat3 displacementMapTransform;
	varying vec2 vDisplacementMapUv;
#endif
#ifdef USE_EMISSIVEMAP
	uniform mat3 emissiveMapTransform;
	varying vec2 vEmissiveMapUv;
#endif
#ifdef USE_METALNESSMAP
	uniform mat3 metalnessMapTransform;
	varying vec2 vMetalnessMapUv;
#endif
#ifdef USE_ROUGHNESSMAP
	uniform mat3 roughnessMapTransform;
	varying vec2 vRoughnessMapUv;
#endif
#ifdef USE_ANISOTROPYMAP
	uniform mat3 anisotropyMapTransform;
	varying vec2 vAnisotropyMapUv;
#endif
#ifdef USE_CLEARCOATMAP
	uniform mat3 clearcoatMapTransform;
	varying vec2 vClearcoatMapUv;
#endif
#ifdef USE_CLEARCOAT_NORMALMAP
	uniform mat3 clearcoatNormalMapTransform;
	varying vec2 vClearcoatNormalMapUv;
#endif
#ifdef USE_CLEARCOAT_ROUGHNESSMAP
	uniform mat3 clearcoatRoughnessMapTransform;
	varying vec2 vClearcoatRoughnessMapUv;
#endif
#ifdef USE_SHEEN_COLORMAP
	uniform mat3 sheenColorMapTransform;
	varying vec2 vSheenColorMapUv;
#endif
#ifdef USE_SHEEN_ROUGHNESSMAP
	uniform mat3 sheenRoughnessMapTransform;
	varying vec2 vSheenRoughnessMapUv;
#endif
#ifdef USE_IRIDESCENCEMAP
	uniform mat3 iridescenceMapTransform;
	varying vec2 vIridescenceMapUv;
#endif
#ifdef USE_IRIDESCENCE_THICKNESSMAP
	uniform mat3 iridescenceThicknessMapTransform;
	varying vec2 vIridescenceThicknessMapUv;
#endif
#ifdef USE_SPECULARMAP
	uniform mat3 specularMapTransform;
	varying vec2 vSpecularMapUv;
#endif
#ifdef USE_SPECULAR_COLORMAP
	uniform mat3 specularColorMapTransform;
	varying vec2 vSpecularColorMapUv;
#endif
#ifdef USE_SPECULAR_INTENSITYMAP
	uniform mat3 specularIntensityMapTransform;
	varying vec2 vSpecularIntensityMapUv;
#endif
#ifdef USE_TRANSMISSIONMAP
	uniform mat3 transmissionMapTransform;
	varying vec2 vTransmissionMapUv;
#endif
#ifdef USE_THICKNESSMAP
	uniform mat3 thicknessMapTransform;
	varying vec2 vThicknessMapUv;
#endif`,Tg=`#if defined( USE_UV ) || defined( USE_ANISOTROPY )
	vUv = vec3( uv, 1 ).xy;
#endif
#ifdef USE_MAP
	vMapUv = ( mapTransform * vec3( MAP_UV, 1 ) ).xy;
#endif
#ifdef USE_ALPHAMAP
	vAlphaMapUv = ( alphaMapTransform * vec3( ALPHAMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_LIGHTMAP
	vLightMapUv = ( lightMapTransform * vec3( LIGHTMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_AOMAP
	vAoMapUv = ( aoMapTransform * vec3( AOMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_BUMPMAP
	vBumpMapUv = ( bumpMapTransform * vec3( BUMPMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_NORMALMAP
	vNormalMapUv = ( normalMapTransform * vec3( NORMALMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_DISPLACEMENTMAP
	vDisplacementMapUv = ( displacementMapTransform * vec3( DISPLACEMENTMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_EMISSIVEMAP
	vEmissiveMapUv = ( emissiveMapTransform * vec3( EMISSIVEMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_METALNESSMAP
	vMetalnessMapUv = ( metalnessMapTransform * vec3( METALNESSMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_ROUGHNESSMAP
	vRoughnessMapUv = ( roughnessMapTransform * vec3( ROUGHNESSMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_ANISOTROPYMAP
	vAnisotropyMapUv = ( anisotropyMapTransform * vec3( ANISOTROPYMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_CLEARCOATMAP
	vClearcoatMapUv = ( clearcoatMapTransform * vec3( CLEARCOATMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_CLEARCOAT_NORMALMAP
	vClearcoatNormalMapUv = ( clearcoatNormalMapTransform * vec3( CLEARCOAT_NORMALMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_CLEARCOAT_ROUGHNESSMAP
	vClearcoatRoughnessMapUv = ( clearcoatRoughnessMapTransform * vec3( CLEARCOAT_ROUGHNESSMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_IRIDESCENCEMAP
	vIridescenceMapUv = ( iridescenceMapTransform * vec3( IRIDESCENCEMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_IRIDESCENCE_THICKNESSMAP
	vIridescenceThicknessMapUv = ( iridescenceThicknessMapTransform * vec3( IRIDESCENCE_THICKNESSMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_SHEEN_COLORMAP
	vSheenColorMapUv = ( sheenColorMapTransform * vec3( SHEEN_COLORMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_SHEEN_ROUGHNESSMAP
	vSheenRoughnessMapUv = ( sheenRoughnessMapTransform * vec3( SHEEN_ROUGHNESSMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_SPECULARMAP
	vSpecularMapUv = ( specularMapTransform * vec3( SPECULARMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_SPECULAR_COLORMAP
	vSpecularColorMapUv = ( specularColorMapTransform * vec3( SPECULAR_COLORMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_SPECULAR_INTENSITYMAP
	vSpecularIntensityMapUv = ( specularIntensityMapTransform * vec3( SPECULAR_INTENSITYMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_TRANSMISSIONMAP
	vTransmissionMapUv = ( transmissionMapTransform * vec3( TRANSMISSIONMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_THICKNESSMAP
	vThicknessMapUv = ( thicknessMapTransform * vec3( THICKNESSMAP_UV, 1 ) ).xy;
#endif`,wg=`#if defined( USE_ENVMAP ) || defined( DISTANCE ) || defined ( USE_SHADOWMAP ) || defined ( USE_TRANSMISSION ) || NUM_SPOT_LIGHT_COORDS > 0
	vec4 worldPosition = vec4( transformed, 1.0 );
	#ifdef USE_BATCHING
		worldPosition = batchingMatrix * worldPosition;
	#endif
	#ifdef USE_INSTANCING
		worldPosition = instanceMatrix * worldPosition;
	#endif
	worldPosition = modelMatrix * worldPosition;
#endif`,Cg=`varying vec2 vUv;
uniform mat3 uvTransform;
void main() {
	vUv = ( uvTransform * vec3( uv, 1 ) ).xy;
	gl_Position = vec4( position.xy, 1.0, 1.0 );
}`,Ag=`uniform sampler2D t2D;
uniform float backgroundIntensity;
varying vec2 vUv;
void main() {
	vec4 texColor = texture2D( t2D, vUv );
	#ifdef DECODE_VIDEO_TEXTURE
		texColor = vec4( mix( pow( texColor.rgb * 0.9478672986 + vec3( 0.0521327014 ), vec3( 2.4 ) ), texColor.rgb * 0.0773993808, vec3( lessThanEqual( texColor.rgb, vec3( 0.04045 ) ) ) ), texColor.w );
	#endif
	texColor.rgb *= backgroundIntensity;
	gl_FragColor = texColor;
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
}`,Rg=`varying vec3 vWorldDirection;
#include <common>
void main() {
	vWorldDirection = transformDirection( position, modelMatrix );
	#include <begin_vertex>
	#include <project_vertex>
	gl_Position.z = gl_Position.w;
}`,Pg=`#ifdef ENVMAP_TYPE_CUBE
	uniform samplerCube envMap;
#elif defined( ENVMAP_TYPE_CUBE_UV )
	uniform sampler2D envMap;
#endif
uniform float flipEnvMap;
uniform float backgroundBlurriness;
uniform float backgroundIntensity;
uniform mat3 backgroundRotation;
varying vec3 vWorldDirection;
#include <cube_uv_reflection_fragment>
void main() {
	#ifdef ENVMAP_TYPE_CUBE
		vec4 texColor = textureCube( envMap, backgroundRotation * vec3( flipEnvMap * vWorldDirection.x, vWorldDirection.yz ) );
	#elif defined( ENVMAP_TYPE_CUBE_UV )
		vec4 texColor = textureCubeUV( envMap, backgroundRotation * vWorldDirection, backgroundBlurriness );
	#else
		vec4 texColor = vec4( 0.0, 0.0, 0.0, 1.0 );
	#endif
	texColor.rgb *= backgroundIntensity;
	gl_FragColor = texColor;
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
}`,Ig=`varying vec3 vWorldDirection;
#include <common>
void main() {
	vWorldDirection = transformDirection( position, modelMatrix );
	#include <begin_vertex>
	#include <project_vertex>
	gl_Position.z = gl_Position.w;
}`,Lg=`uniform samplerCube tCube;
uniform float tFlip;
uniform float opacity;
varying vec3 vWorldDirection;
void main() {
	vec4 texColor = textureCube( tCube, vec3( tFlip * vWorldDirection.x, vWorldDirection.yz ) );
	gl_FragColor = texColor;
	gl_FragColor.a *= opacity;
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
}`,Dg=`#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
varying vec2 vHighPrecisionZW;
void main() {
	#include <uv_vertex>
	#include <batching_vertex>
	#include <skinbase_vertex>
	#include <morphinstance_vertex>
	#ifdef USE_DISPLACEMENTMAP
		#include <beginnormal_vertex>
		#include <morphnormal_vertex>
		#include <skinnormal_vertex>
	#endif
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	vHighPrecisionZW = gl_Position.zw;
}`,Ug=`#if DEPTH_PACKING == 3200
	uniform float opacity;
#endif
#include <common>
#include <packing>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
varying vec2 vHighPrecisionZW;
void main() {
	vec4 diffuseColor = vec4( 1.0 );
	#include <clipping_planes_fragment>
	#if DEPTH_PACKING == 3200
		diffuseColor.a = opacity;
	#endif
	#include <map_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <logdepthbuf_fragment>
	float fragCoordZ = 0.5 * vHighPrecisionZW[0] / vHighPrecisionZW[1] + 0.5;
	#if DEPTH_PACKING == 3200
		gl_FragColor = vec4( vec3( 1.0 - fragCoordZ ), opacity );
	#elif DEPTH_PACKING == 3201
		gl_FragColor = packDepthToRGBA( fragCoordZ );
	#elif DEPTH_PACKING == 3202
		gl_FragColor = vec4( packDepthToRGB( fragCoordZ ), 1.0 );
	#elif DEPTH_PACKING == 3203
		gl_FragColor = vec4( packDepthToRG( fragCoordZ ), 0.0, 1.0 );
	#endif
}`,Ng=`#define DISTANCE
varying vec3 vWorldPosition;
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <batching_vertex>
	#include <skinbase_vertex>
	#include <morphinstance_vertex>
	#ifdef USE_DISPLACEMENTMAP
		#include <beginnormal_vertex>
		#include <morphnormal_vertex>
		#include <skinnormal_vertex>
	#endif
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <worldpos_vertex>
	#include <clipping_planes_vertex>
	vWorldPosition = worldPosition.xyz;
}`,kg=`#define DISTANCE
uniform vec3 referencePosition;
uniform float nearDistance;
uniform float farDistance;
varying vec3 vWorldPosition;
#include <common>
#include <packing>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <clipping_planes_pars_fragment>
void main () {
	vec4 diffuseColor = vec4( 1.0 );
	#include <clipping_planes_fragment>
	#include <map_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	float dist = length( vWorldPosition - referencePosition );
	dist = ( dist - nearDistance ) / ( farDistance - nearDistance );
	dist = saturate( dist );
	gl_FragColor = packDepthToRGBA( dist );
}`,Og=`varying vec3 vWorldDirection;
#include <common>
void main() {
	vWorldDirection = transformDirection( position, modelMatrix );
	#include <begin_vertex>
	#include <project_vertex>
}`,Fg=`uniform sampler2D tEquirect;
varying vec3 vWorldDirection;
#include <common>
void main() {
	vec3 direction = normalize( vWorldDirection );
	vec2 sampleUV = equirectUv( direction );
	gl_FragColor = texture2D( tEquirect, sampleUV );
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
}`,Bg=`uniform float scale;
attribute float lineDistance;
varying float vLineDistance;
#include <common>
#include <uv_pars_vertex>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <morphtarget_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	vLineDistance = scale * lineDistance;
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	#include <fog_vertex>
}`,zg=`uniform vec3 diffuse;
uniform float opacity;
uniform float dashSize;
uniform float totalSize;
varying float vLineDistance;
#include <common>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <fog_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	if ( mod( vLineDistance, totalSize ) > dashSize ) {
		discard;
	}
	vec3 outgoingLight = vec3( 0.0 );
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	outgoingLight = diffuseColor.rgb;
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
}`,Hg=`#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <envmap_pars_vertex>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <batching_vertex>
	#if defined ( USE_ENVMAP ) || defined ( USE_SKINNING )
		#include <beginnormal_vertex>
		#include <morphnormal_vertex>
		#include <skinbase_vertex>
		#include <skinnormal_vertex>
		#include <defaultnormal_vertex>
	#endif
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	#include <worldpos_vertex>
	#include <envmap_vertex>
	#include <fog_vertex>
}`,Vg=`uniform vec3 diffuse;
uniform float opacity;
#ifndef FLAT_SHADED
	varying vec3 vNormal;
#endif
#include <common>
#include <dithering_pars_fragment>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <aomap_pars_fragment>
#include <lightmap_pars_fragment>
#include <envmap_common_pars_fragment>
#include <envmap_pars_fragment>
#include <fog_pars_fragment>
#include <specularmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <specularmap_fragment>
	ReflectedLight reflectedLight = ReflectedLight( vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ) );
	#ifdef USE_LIGHTMAP
		vec4 lightMapTexel = texture2D( lightMap, vLightMapUv );
		reflectedLight.indirectDiffuse += lightMapTexel.rgb * lightMapIntensity * RECIPROCAL_PI;
	#else
		reflectedLight.indirectDiffuse += vec3( 1.0 );
	#endif
	#include <aomap_fragment>
	reflectedLight.indirectDiffuse *= diffuseColor.rgb;
	vec3 outgoingLight = reflectedLight.indirectDiffuse;
	#include <envmap_fragment>
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
	#include <dithering_fragment>
}`,Gg=`#define LAMBERT
varying vec3 vViewPosition;
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <envmap_pars_vertex>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <normal_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <shadowmap_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <normal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	vViewPosition = - mvPosition.xyz;
	#include <worldpos_vertex>
	#include <envmap_vertex>
	#include <shadowmap_vertex>
	#include <fog_vertex>
}`,Wg=`#define LAMBERT
uniform vec3 diffuse;
uniform vec3 emissive;
uniform float opacity;
#include <common>
#include <packing>
#include <dithering_pars_fragment>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <aomap_pars_fragment>
#include <lightmap_pars_fragment>
#include <emissivemap_pars_fragment>
#include <envmap_common_pars_fragment>
#include <envmap_pars_fragment>
#include <fog_pars_fragment>
#include <bsdfs>
#include <lights_pars_begin>
#include <normal_pars_fragment>
#include <lights_lambert_pars_fragment>
#include <shadowmap_pars_fragment>
#include <bumpmap_pars_fragment>
#include <normalmap_pars_fragment>
#include <specularmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	ReflectedLight reflectedLight = ReflectedLight( vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ) );
	vec3 totalEmissiveRadiance = emissive;
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <specularmap_fragment>
	#include <normal_fragment_begin>
	#include <normal_fragment_maps>
	#include <emissivemap_fragment>
	#include <lights_lambert_fragment>
	#include <lights_fragment_begin>
	#include <lights_fragment_maps>
	#include <lights_fragment_end>
	#include <aomap_fragment>
	vec3 outgoingLight = reflectedLight.directDiffuse + reflectedLight.indirectDiffuse + totalEmissiveRadiance;
	#include <envmap_fragment>
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
	#include <dithering_fragment>
}`,Xg=`#define MATCAP
varying vec3 vViewPosition;
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <color_pars_vertex>
#include <displacementmap_pars_vertex>
#include <fog_pars_vertex>
#include <normal_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <normal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	#include <fog_vertex>
	vViewPosition = - mvPosition.xyz;
}`,qg=`#define MATCAP
uniform vec3 diffuse;
uniform float opacity;
uniform sampler2D matcap;
varying vec3 vViewPosition;
#include <common>
#include <dithering_pars_fragment>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <fog_pars_fragment>
#include <normal_pars_fragment>
#include <bumpmap_pars_fragment>
#include <normalmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <normal_fragment_begin>
	#include <normal_fragment_maps>
	vec3 viewDir = normalize( vViewPosition );
	vec3 x = normalize( vec3( viewDir.z, 0.0, - viewDir.x ) );
	vec3 y = cross( viewDir, x );
	vec2 uv = vec2( dot( x, normal ), dot( y, normal ) ) * 0.495 + 0.5;
	#ifdef USE_MATCAP
		vec4 matcapColor = texture2D( matcap, uv );
	#else
		vec4 matcapColor = vec4( vec3( mix( 0.2, 0.8, uv.y ) ), 1.0 );
	#endif
	vec3 outgoingLight = diffuseColor.rgb * matcapColor.rgb;
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
	#include <dithering_fragment>
}`,Yg=`#define NORMAL
#if defined( FLAT_SHADED ) || defined( USE_BUMPMAP ) || defined( USE_NORMALMAP_TANGENTSPACE )
	varying vec3 vViewPosition;
#endif
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <normal_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphinstance_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <normal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
#if defined( FLAT_SHADED ) || defined( USE_BUMPMAP ) || defined( USE_NORMALMAP_TANGENTSPACE )
	vViewPosition = - mvPosition.xyz;
#endif
}`,$g=`#define NORMAL
uniform float opacity;
#if defined( FLAT_SHADED ) || defined( USE_BUMPMAP ) || defined( USE_NORMALMAP_TANGENTSPACE )
	varying vec3 vViewPosition;
#endif
#include <packing>
#include <uv_pars_fragment>
#include <normal_pars_fragment>
#include <bumpmap_pars_fragment>
#include <normalmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( 0.0, 0.0, 0.0, opacity );
	#include <clipping_planes_fragment>
	#include <logdepthbuf_fragment>
	#include <normal_fragment_begin>
	#include <normal_fragment_maps>
	gl_FragColor = vec4( packNormalToRGB( normal ), diffuseColor.a );
	#ifdef OPAQUE
		gl_FragColor.a = 1.0;
	#endif
}`,Jg=`#define PHONG
varying vec3 vViewPosition;
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <envmap_pars_vertex>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <normal_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <shadowmap_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphcolor_vertex>
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphinstance_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <normal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	vViewPosition = - mvPosition.xyz;
	#include <worldpos_vertex>
	#include <envmap_vertex>
	#include <shadowmap_vertex>
	#include <fog_vertex>
}`,Zg=`#define PHONG
uniform vec3 diffuse;
uniform vec3 emissive;
uniform vec3 specular;
uniform float shininess;
uniform float opacity;
#include <common>
#include <packing>
#include <dithering_pars_fragment>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <aomap_pars_fragment>
#include <lightmap_pars_fragment>
#include <emissivemap_pars_fragment>
#include <envmap_common_pars_fragment>
#include <envmap_pars_fragment>
#include <fog_pars_fragment>
#include <bsdfs>
#include <lights_pars_begin>
#include <normal_pars_fragment>
#include <lights_phong_pars_fragment>
#include <shadowmap_pars_fragment>
#include <bumpmap_pars_fragment>
#include <normalmap_pars_fragment>
#include <specularmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	ReflectedLight reflectedLight = ReflectedLight( vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ) );
	vec3 totalEmissiveRadiance = emissive;
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <specularmap_fragment>
	#include <normal_fragment_begin>
	#include <normal_fragment_maps>
	#include <emissivemap_fragment>
	#include <lights_phong_fragment>
	#include <lights_fragment_begin>
	#include <lights_fragment_maps>
	#include <lights_fragment_end>
	#include <aomap_fragment>
	vec3 outgoingLight = reflectedLight.directDiffuse + reflectedLight.indirectDiffuse + reflectedLight.directSpecular + reflectedLight.indirectSpecular + totalEmissiveRadiance;
	#include <envmap_fragment>
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
	#include <dithering_fragment>
}`,jg=`#define STANDARD
varying vec3 vViewPosition;
#ifdef USE_TRANSMISSION
	varying vec3 vWorldPosition;
#endif
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <normal_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <shadowmap_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <normal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	vViewPosition = - mvPosition.xyz;
	#include <worldpos_vertex>
	#include <shadowmap_vertex>
	#include <fog_vertex>
#ifdef USE_TRANSMISSION
	vWorldPosition = worldPosition.xyz;
#endif
}`,Kg=`#define STANDARD
#ifdef PHYSICAL
	#define IOR
	#define USE_SPECULAR
#endif
uniform vec3 diffuse;
uniform vec3 emissive;
uniform float roughness;
uniform float metalness;
uniform float opacity;
#ifdef IOR
	uniform float ior;
#endif
#ifdef USE_SPECULAR
	uniform float specularIntensity;
	uniform vec3 specularColor;
	#ifdef USE_SPECULAR_COLORMAP
		uniform sampler2D specularColorMap;
	#endif
	#ifdef USE_SPECULAR_INTENSITYMAP
		uniform sampler2D specularIntensityMap;
	#endif
#endif
#ifdef USE_CLEARCOAT
	uniform float clearcoat;
	uniform float clearcoatRoughness;
#endif
#ifdef USE_DISPERSION
	uniform float dispersion;
#endif
#ifdef USE_IRIDESCENCE
	uniform float iridescence;
	uniform float iridescenceIOR;
	uniform float iridescenceThicknessMinimum;
	uniform float iridescenceThicknessMaximum;
#endif
#ifdef USE_SHEEN
	uniform vec3 sheenColor;
	uniform float sheenRoughness;
	#ifdef USE_SHEEN_COLORMAP
		uniform sampler2D sheenColorMap;
	#endif
	#ifdef USE_SHEEN_ROUGHNESSMAP
		uniform sampler2D sheenRoughnessMap;
	#endif
#endif
#ifdef USE_ANISOTROPY
	uniform vec2 anisotropyVector;
	#ifdef USE_ANISOTROPYMAP
		uniform sampler2D anisotropyMap;
	#endif
#endif
varying vec3 vViewPosition;
#include <common>
#include <packing>
#include <dithering_pars_fragment>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <aomap_pars_fragment>
#include <lightmap_pars_fragment>
#include <emissivemap_pars_fragment>
#include <iridescence_fragment>
#include <cube_uv_reflection_fragment>
#include <envmap_common_pars_fragment>
#include <envmap_physical_pars_fragment>
#include <fog_pars_fragment>
#include <lights_pars_begin>
#include <normal_pars_fragment>
#include <lights_physical_pars_fragment>
#include <transmission_pars_fragment>
#include <shadowmap_pars_fragment>
#include <bumpmap_pars_fragment>
#include <normalmap_pars_fragment>
#include <clearcoat_pars_fragment>
#include <iridescence_pars_fragment>
#include <roughnessmap_pars_fragment>
#include <metalnessmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	ReflectedLight reflectedLight = ReflectedLight( vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ) );
	vec3 totalEmissiveRadiance = emissive;
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <roughnessmap_fragment>
	#include <metalnessmap_fragment>
	#include <normal_fragment_begin>
	#include <normal_fragment_maps>
	#include <clearcoat_normal_fragment_begin>
	#include <clearcoat_normal_fragment_maps>
	#include <emissivemap_fragment>
	#include <lights_physical_fragment>
	#include <lights_fragment_begin>
	#include <lights_fragment_maps>
	#include <lights_fragment_end>
	#include <aomap_fragment>
	vec3 totalDiffuse = reflectedLight.directDiffuse + reflectedLight.indirectDiffuse;
	vec3 totalSpecular = reflectedLight.directSpecular + reflectedLight.indirectSpecular;
	#include <transmission_fragment>
	vec3 outgoingLight = totalDiffuse + totalSpecular + totalEmissiveRadiance;
	#ifdef USE_SHEEN
		float sheenEnergyComp = 1.0 - 0.157 * max3( material.sheenColor );
		outgoingLight = outgoingLight * sheenEnergyComp + sheenSpecularDirect + sheenSpecularIndirect;
	#endif
	#ifdef USE_CLEARCOAT
		float dotNVcc = saturate( dot( geometryClearcoatNormal, geometryViewDir ) );
		vec3 Fcc = F_Schlick( material.clearcoatF0, material.clearcoatF90, dotNVcc );
		outgoingLight = outgoingLight * ( 1.0 - material.clearcoat * Fcc ) + ( clearcoatSpecularDirect + clearcoatSpecularIndirect ) * material.clearcoat;
	#endif
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
	#include <dithering_fragment>
}`,Qg=`#define TOON
varying vec3 vViewPosition;
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <normal_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <shadowmap_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <normal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	vViewPosition = - mvPosition.xyz;
	#include <worldpos_vertex>
	#include <shadowmap_vertex>
	#include <fog_vertex>
}`,e_=`#define TOON
uniform vec3 diffuse;
uniform vec3 emissive;
uniform float opacity;
#include <common>
#include <packing>
#include <dithering_pars_fragment>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <aomap_pars_fragment>
#include <lightmap_pars_fragment>
#include <emissivemap_pars_fragment>
#include <gradientmap_pars_fragment>
#include <fog_pars_fragment>
#include <bsdfs>
#include <lights_pars_begin>
#include <normal_pars_fragment>
#include <lights_toon_pars_fragment>
#include <shadowmap_pars_fragment>
#include <bumpmap_pars_fragment>
#include <normalmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	ReflectedLight reflectedLight = ReflectedLight( vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ) );
	vec3 totalEmissiveRadiance = emissive;
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <normal_fragment_begin>
	#include <normal_fragment_maps>
	#include <emissivemap_fragment>
	#include <lights_toon_fragment>
	#include <lights_fragment_begin>
	#include <lights_fragment_maps>
	#include <lights_fragment_end>
	#include <aomap_fragment>
	vec3 outgoingLight = reflectedLight.directDiffuse + reflectedLight.indirectDiffuse + totalEmissiveRadiance;
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
	#include <dithering_fragment>
}`,t_=`uniform float size;
uniform float scale;
#include <common>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <morphtarget_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
#ifdef USE_POINTS_UV
	varying vec2 vUv;
	uniform mat3 uvTransform;
#endif
void main() {
	#ifdef USE_POINTS_UV
		vUv = ( uvTransform * vec3( uv, 1 ) ).xy;
	#endif
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <project_vertex>
	gl_PointSize = size;
	#ifdef USE_SIZEATTENUATION
		bool isPerspective = isPerspectiveMatrix( projectionMatrix );
		if ( isPerspective ) gl_PointSize *= ( scale / - mvPosition.z );
	#endif
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	#include <worldpos_vertex>
	#include <fog_vertex>
}`,n_=`uniform vec3 diffuse;
uniform float opacity;
#include <common>
#include <color_pars_fragment>
#include <map_particle_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <fog_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	vec3 outgoingLight = vec3( 0.0 );
	#include <logdepthbuf_fragment>
	#include <map_particle_fragment>
	#include <color_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	outgoingLight = diffuseColor.rgb;
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
}`,i_=`#include <common>
#include <batching_pars_vertex>
#include <fog_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <shadowmap_pars_vertex>
void main() {
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphinstance_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <worldpos_vertex>
	#include <shadowmap_vertex>
	#include <fog_vertex>
}`,s_=`uniform vec3 color;
uniform float opacity;
#include <common>
#include <packing>
#include <fog_pars_fragment>
#include <bsdfs>
#include <lights_pars_begin>
#include <logdepthbuf_pars_fragment>
#include <shadowmap_pars_fragment>
#include <shadowmask_pars_fragment>
void main() {
	#include <logdepthbuf_fragment>
	gl_FragColor = vec4( color, opacity * ( 1.0 - getShadowMask() ) );
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
}`,r_=`uniform float rotation;
uniform vec2 center;
#include <common>
#include <uv_pars_vertex>
#include <fog_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	vec4 mvPosition = modelViewMatrix[ 3 ];
	vec2 scale = vec2( length( modelMatrix[ 0 ].xyz ), length( modelMatrix[ 1 ].xyz ) );
	#ifndef USE_SIZEATTENUATION
		bool isPerspective = isPerspectiveMatrix( projectionMatrix );
		if ( isPerspective ) scale *= - mvPosition.z;
	#endif
	vec2 alignedPosition = ( position.xy - ( center - vec2( 0.5 ) ) ) * scale;
	vec2 rotatedPosition;
	rotatedPosition.x = cos( rotation ) * alignedPosition.x - sin( rotation ) * alignedPosition.y;
	rotatedPosition.y = sin( rotation ) * alignedPosition.x + cos( rotation ) * alignedPosition.y;
	mvPosition.xy += rotatedPosition;
	gl_Position = projectionMatrix * mvPosition;
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	#include <fog_vertex>
}`,o_=`uniform vec3 diffuse;
uniform float opacity;
#include <common>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <fog_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	vec3 outgoingLight = vec3( 0.0 );
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	outgoingLight = diffuseColor.rgb;
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
}`,Ze={alphahash_fragment:Am,alphahash_pars_fragment:Rm,alphamap_fragment:Pm,alphamap_pars_fragment:Im,alphatest_fragment:Lm,alphatest_pars_fragment:Dm,aomap_fragment:Um,aomap_pars_fragment:Nm,batching_pars_vertex:km,batching_vertex:Om,begin_vertex:Fm,beginnormal_vertex:Bm,bsdfs:zm,iridescence_fragment:Hm,bumpmap_pars_fragment:Vm,clipping_planes_fragment:Gm,clipping_planes_pars_fragment:Wm,clipping_planes_pars_vertex:Xm,clipping_planes_vertex:qm,color_fragment:Ym,color_pars_fragment:$m,color_pars_vertex:Jm,color_vertex:Zm,common:jm,cube_uv_reflection_fragment:Km,defaultnormal_vertex:Qm,displacementmap_pars_vertex:e0,displacementmap_vertex:t0,emissivemap_fragment:n0,emissivemap_pars_fragment:i0,colorspace_fragment:s0,colorspace_pars_fragment:r0,envmap_fragment:o0,envmap_common_pars_fragment:a0,envmap_pars_fragment:c0,envmap_pars_vertex:l0,envmap_physical_pars_fragment:v0,envmap_vertex:h0,fog_vertex:u0,fog_pars_vertex:d0,fog_fragment:f0,fog_pars_fragment:p0,gradientmap_pars_fragment:m0,lightmap_pars_fragment:g0,lights_lambert_fragment:_0,lights_lambert_pars_fragment:y0,lights_pars_begin:x0,lights_toon_fragment:M0,lights_toon_pars_fragment:b0,lights_phong_fragment:S0,lights_phong_pars_fragment:E0,lights_physical_fragment:T0,lights_physical_pars_fragment:w0,lights_fragment_begin:C0,lights_fragment_maps:A0,lights_fragment_end:R0,logdepthbuf_fragment:P0,logdepthbuf_pars_fragment:I0,logdepthbuf_pars_vertex:L0,logdepthbuf_vertex:D0,map_fragment:U0,map_pars_fragment:N0,map_particle_fragment:k0,map_particle_pars_fragment:O0,metalnessmap_fragment:F0,metalnessmap_pars_fragment:B0,morphinstance_vertex:z0,morphcolor_vertex:H0,morphnormal_vertex:V0,morphtarget_pars_vertex:G0,morphtarget_vertex:W0,normal_fragment_begin:X0,normal_fragment_maps:q0,normal_pars_fragment:Y0,normal_pars_vertex:$0,normal_vertex:J0,normalmap_pars_fragment:Z0,clearcoat_normal_fragment_begin:j0,clearcoat_normal_fragment_maps:K0,clearcoat_pars_fragment:Q0,iridescence_pars_fragment:eg,opaque_fragment:tg,packing:ng,premultiplied_alpha_fragment:ig,project_vertex:sg,dithering_fragment:rg,dithering_pars_fragment:og,roughnessmap_fragment:ag,roughnessmap_pars_fragment:cg,shadowmap_pars_fragment:lg,shadowmap_pars_vertex:hg,shadowmap_vertex:ug,shadowmask_pars_fragment:dg,skinbase_vertex:fg,skinning_pars_vertex:pg,skinning_vertex:mg,skinnormal_vertex:gg,specularmap_fragment:_g,specularmap_pars_fragment:yg,tonemapping_fragment:xg,tonemapping_pars_fragment:vg,transmission_fragment:Mg,transmission_pars_fragment:bg,uv_pars_fragment:Sg,uv_pars_vertex:Eg,uv_vertex:Tg,worldpos_vertex:wg,background_vert:Cg,background_frag:Ag,backgroundCube_vert:Rg,backgroundCube_frag:Pg,cube_vert:Ig,cube_frag:Lg,depth_vert:Dg,depth_frag:Ug,distanceRGBA_vert:Ng,distanceRGBA_frag:kg,equirect_vert:Og,equirect_frag:Fg,linedashed_vert:Bg,linedashed_frag:zg,meshbasic_vert:Hg,meshbasic_frag:Vg,meshlambert_vert:Gg,meshlambert_frag:Wg,meshmatcap_vert:Xg,meshmatcap_frag:qg,meshnormal_vert:Yg,meshnormal_frag:$g,meshphong_vert:Jg,meshphong_frag:Zg,meshphysical_vert:jg,meshphysical_frag:Kg,meshtoon_vert:Qg,meshtoon_frag:e_,points_vert:t_,points_frag:n_,shadow_vert:i_,shadow_frag:s_,sprite_vert:r_,sprite_frag:o_},ye={common:{diffuse:{value:new Qe(16777215)},opacity:{value:1},map:{value:null},mapTransform:{value:new je},alphaMap:{value:null},alphaMapTransform:{value:new je},alphaTest:{value:0}},specularmap:{specularMap:{value:null},specularMapTransform:{value:new je}},envmap:{envMap:{value:null},envMapRotation:{value:new je},flipEnvMap:{value:-1},reflectivity:{value:1},ior:{value:1.5},refractionRatio:{value:.98}},aomap:{aoMap:{value:null},aoMapIntensity:{value:1},aoMapTransform:{value:new je}},lightmap:{lightMap:{value:null},lightMapIntensity:{value:1},lightMapTransform:{value:new je}},bumpmap:{bumpMap:{value:null},bumpMapTransform:{value:new je},bumpScale:{value:1}},normalmap:{normalMap:{value:null},normalMapTransform:{value:new je},normalScale:{value:new le(1,1)}},displacementmap:{displacementMap:{value:null},displacementMapTransform:{value:new je},displacementScale:{value:1},displacementBias:{value:0}},emissivemap:{emissiveMap:{value:null},emissiveMapTransform:{value:new je}},metalnessmap:{metalnessMap:{value:null},metalnessMapTransform:{value:new je}},roughnessmap:{roughnessMap:{value:null},roughnessMapTransform:{value:new je}},gradientmap:{gradientMap:{value:null}},fog:{fogDensity:{value:25e-5},fogNear:{value:1},fogFar:{value:2e3},fogColor:{value:new Qe(16777215)}},lights:{ambientLightColor:{value:[]},lightProbe:{value:[]},directionalLights:{value:[],properties:{direction:{},color:{}}},directionalLightShadows:{value:[],properties:{shadowIntensity:1,shadowBias:{},shadowNormalBias:{},shadowRadius:{},shadowMapSize:{}}},directionalShadowMap:{value:[]},directionalShadowMatrix:{value:[]},spotLights:{value:[],properties:{color:{},position:{},direction:{},distance:{},coneCos:{},penumbraCos:{},decay:{}}},spotLightShadows:{value:[],properties:{shadowIntensity:1,shadowBias:{},shadowNormalBias:{},shadowRadius:{},shadowMapSize:{}}},spotLightMap:{value:[]},spotShadowMap:{value:[]},spotLightMatrix:{value:[]},pointLights:{value:[],properties:{color:{},position:{},decay:{},distance:{}}},pointLightShadows:{value:[],properties:{shadowIntensity:1,shadowBias:{},shadowNormalBias:{},shadowRadius:{},shadowMapSize:{},shadowCameraNear:{},shadowCameraFar:{}}},pointShadowMap:{value:[]},pointShadowMatrix:{value:[]},hemisphereLights:{value:[],properties:{direction:{},skyColor:{},groundColor:{}}},rectAreaLights:{value:[],properties:{color:{},position:{},width:{},height:{}}},ltc_1:{value:null},ltc_2:{value:null}},points:{diffuse:{value:new Qe(16777215)},opacity:{value:1},size:{value:1},scale:{value:1},map:{value:null},alphaMap:{value:null},alphaMapTransform:{value:new je},alphaTest:{value:0},uvTransform:{value:new je}},sprite:{diffuse:{value:new Qe(16777215)},opacity:{value:1},center:{value:new le(.5,.5)},rotation:{value:0},map:{value:null},mapTransform:{value:new je},alphaMap:{value:null},alphaMapTransform:{value:new je},alphaTest:{value:0}}},En={basic:{uniforms:Wt([ye.common,ye.specularmap,ye.envmap,ye.aomap,ye.lightmap,ye.fog]),vertexShader:Ze.meshbasic_vert,fragmentShader:Ze.meshbasic_frag},lambert:{uniforms:Wt([ye.common,ye.specularmap,ye.envmap,ye.aomap,ye.lightmap,ye.emissivemap,ye.bumpmap,ye.normalmap,ye.displacementmap,ye.fog,ye.lights,{emissive:{value:new Qe(0)}}]),vertexShader:Ze.meshlambert_vert,fragmentShader:Ze.meshlambert_frag},phong:{uniforms:Wt([ye.common,ye.specularmap,ye.envmap,ye.aomap,ye.lightmap,ye.emissivemap,ye.bumpmap,ye.normalmap,ye.displacementmap,ye.fog,ye.lights,{emissive:{value:new Qe(0)},specular:{value:new Qe(1118481)},shininess:{value:30}}]),vertexShader:Ze.meshphong_vert,fragmentShader:Ze.meshphong_frag},standard:{uniforms:Wt([ye.common,ye.envmap,ye.aomap,ye.lightmap,ye.emissivemap,ye.bumpmap,ye.normalmap,ye.displacementmap,ye.roughnessmap,ye.metalnessmap,ye.fog,ye.lights,{emissive:{value:new Qe(0)},roughness:{value:1},metalness:{value:0},envMapIntensity:{value:1}}]),vertexShader:Ze.meshphysical_vert,fragmentShader:Ze.meshphysical_frag},toon:{uniforms:Wt([ye.common,ye.aomap,ye.lightmap,ye.emissivemap,ye.bumpmap,ye.normalmap,ye.displacementmap,ye.gradientmap,ye.fog,ye.lights,{emissive:{value:new Qe(0)}}]),vertexShader:Ze.meshtoon_vert,fragmentShader:Ze.meshtoon_frag},matcap:{uniforms:Wt([ye.common,ye.bumpmap,ye.normalmap,ye.displacementmap,ye.fog,{matcap:{value:null}}]),vertexShader:Ze.meshmatcap_vert,fragmentShader:Ze.meshmatcap_frag},points:{uniforms:Wt([ye.points,ye.fog]),vertexShader:Ze.points_vert,fragmentShader:Ze.points_frag},dashed:{uniforms:Wt([ye.common,ye.fog,{scale:{value:1},dashSize:{value:1},totalSize:{value:2}}]),vertexShader:Ze.linedashed_vert,fragmentShader:Ze.linedashed_frag},depth:{uniforms:Wt([ye.common,ye.displacementmap]),vertexShader:Ze.depth_vert,fragmentShader:Ze.depth_frag},normal:{uniforms:Wt([ye.common,ye.bumpmap,ye.normalmap,ye.displacementmap,{opacity:{value:1}}]),vertexShader:Ze.meshnormal_vert,fragmentShader:Ze.meshnormal_frag},sprite:{uniforms:Wt([ye.sprite,ye.fog]),vertexShader:Ze.sprite_vert,fragmentShader:Ze.sprite_frag},background:{uniforms:{uvTransform:{value:new je},t2D:{value:null},backgroundIntensity:{value:1}},vertexShader:Ze.background_vert,fragmentShader:Ze.background_frag},backgroundCube:{uniforms:{envMap:{value:null},flipEnvMap:{value:-1},backgroundBlurriness:{value:0},backgroundIntensity:{value:1},backgroundRotation:{value:new je}},vertexShader:Ze.backgroundCube_vert,fragmentShader:Ze.backgroundCube_frag},cube:{uniforms:{tCube:{value:null},tFlip:{value:-1},opacity:{value:1}},vertexShader:Ze.cube_vert,fragmentShader:Ze.cube_frag},equirect:{uniforms:{tEquirect:{value:null}},vertexShader:Ze.equirect_vert,fragmentShader:Ze.equirect_frag},distanceRGBA:{uniforms:Wt([ye.common,ye.displacementmap,{referencePosition:{value:new A},nearDistance:{value:1},farDistance:{value:1e3}}]),vertexShader:Ze.distanceRGBA_vert,fragmentShader:Ze.distanceRGBA_frag},shadow:{uniforms:Wt([ye.lights,ye.fog,{color:{value:new Qe(0)},opacity:{value:1}}]),vertexShader:Ze.shadow_vert,fragmentShader:Ze.shadow_frag}};En.physical={uniforms:Wt([En.standard.uniforms,{clearcoat:{value:0},clearcoatMap:{value:null},clearcoatMapTransform:{value:new je},clearcoatNormalMap:{value:null},clearcoatNormalMapTransform:{value:new je},clearcoatNormalScale:{value:new le(1,1)},clearcoatRoughness:{value:0},clearcoatRoughnessMap:{value:null},clearcoatRoughnessMapTransform:{value:new je},dispersion:{value:0},iridescence:{value:0},iridescenceMap:{value:null},iridescenceMapTransform:{value:new je},iridescenceIOR:{value:1.3},iridescenceThicknessMinimum:{value:100},iridescenceThicknessMaximum:{value:400},iridescenceThicknessMap:{value:null},iridescenceThicknessMapTransform:{value:new je},sheen:{value:0},sheenColor:{value:new Qe(0)},sheenColorMap:{value:null},sheenColorMapTransform:{value:new je},sheenRoughness:{value:1},sheenRoughnessMap:{value:null},sheenRoughnessMapTransform:{value:new je},transmission:{value:0},transmissionMap:{value:null},transmissionMapTransform:{value:new je},transmissionSamplerSize:{value:new le},transmissionSamplerMap:{value:null},thickness:{value:0},thicknessMap:{value:null},thicknessMapTransform:{value:new je},attenuationDistance:{value:0},attenuationColor:{value:new Qe(0)},specularColor:{value:new Qe(1,1,1)},specularColorMap:{value:null},specularColorMapTransform:{value:new je},specularIntensity:{value:1},specularIntensityMap:{value:null},specularIntensityMapTransform:{value:new je},anisotropyVector:{value:new le},anisotropyMap:{value:null},anisotropyMapTransform:{value:new je}}]),vertexShader:Ze.meshphysical_vert,fragmentShader:Ze.meshphysical_frag};var jr={r:0,b:0,g:0},mi=new Cn,a_=new _t;function c_(i,e,t,n,s,r,o){let a=new Qe(0),c=r===!0?0:1,l,h,u=null,d=0,f=null;function g(b){let x=b.isScene===!0?b.background:null;return x&&x.isTexture&&(x=(b.backgroundBlurriness>0?t:e).get(x)),x}function y(b){let x=!1,M=g(b);M===null?p(a,c):M&&M.isColor&&(p(M,1),x=!0);let D=i.xr.getEnvironmentBlendMode();D==="additive"?n.buffers.color.setClear(0,0,0,1,o):D==="alpha-blend"&&n.buffers.color.setClear(0,0,0,0,o),(i.autoClear||x)&&(n.buffers.depth.setTest(!0),n.buffers.depth.setMask(!0),n.buffers.color.setMask(!0),i.clear(i.autoClearColor,i.autoClearDepth,i.autoClearStencil))}function m(b,x){let M=g(x);M&&(M.isCubeTexture||M.mapping===Zo)?(h===void 0&&(h=new tt(new pe(1,1,1),new hn({name:"BackgroundCubeMaterial",uniforms:fs(En.backgroundCube.uniforms),vertexShader:En.backgroundCube.vertexShader,fragmentShader:En.backgroundCube.fragmentShader,side:Ht,depthTest:!1,depthWrite:!1,fog:!1})),h.geometry.deleteAttribute("normal"),h.geometry.deleteAttribute("uv"),h.onBeforeRender=function(D,w,R){this.matrixWorld.copyPosition(R.matrixWorld)},Object.defineProperty(h.material,"envMap",{get:function(){return this.uniforms.envMap.value}}),s.update(h)),mi.copy(x.backgroundRotation),mi.x*=-1,mi.y*=-1,mi.z*=-1,M.isCubeTexture&&M.isRenderTargetTexture===!1&&(mi.y*=-1,mi.z*=-1),h.material.uniforms.envMap.value=M,h.material.uniforms.flipEnvMap.value=M.isCubeTexture&&M.isRenderTargetTexture===!1?-1:1,h.material.uniforms.backgroundBlurriness.value=x.backgroundBlurriness,h.material.uniforms.backgroundIntensity.value=x.backgroundIntensity,h.material.uniforms.backgroundRotation.value.setFromMatrix4(a_.makeRotationFromEuler(mi)),h.material.toneMapped=ct.getTransfer(M.colorSpace)!==gt,(u!==M||d!==M.version||f!==i.toneMapping)&&(h.material.needsUpdate=!0,u=M,d=M.version,f=i.toneMapping),h.layers.enableAll(),b.unshift(h,h.geometry,h.material,0,0,null)):M&&M.isTexture&&(l===void 0&&(l=new tt(new un(2,2),new hn({name:"BackgroundMaterial",uniforms:fs(En.background.uniforms),vertexShader:En.background.vertexShader,fragmentShader:En.background.fragmentShader,side:wn,depthTest:!1,depthWrite:!1,fog:!1})),l.geometry.deleteAttribute("normal"),Object.defineProperty(l.material,"map",{get:function(){return this.uniforms.t2D.value}}),s.update(l)),l.material.uniforms.t2D.value=M,l.material.uniforms.backgroundIntensity.value=x.backgroundIntensity,l.material.toneMapped=ct.getTransfer(M.colorSpace)!==gt,M.matrixAutoUpdate===!0&&M.updateMatrix(),l.material.uniforms.uvTransform.value.copy(M.matrix),(u!==M||d!==M.version||f!==i.toneMapping)&&(l.material.needsUpdate=!0,u=M,d=M.version,f=i.toneMapping),l.layers.enableAll(),b.unshift(l,l.geometry,l.material,0,0,null))}function p(b,x){b.getRGB(jr,$d(i)),n.buffers.color.setClear(jr.r,jr.g,jr.b,x,o)}return{getClearColor:function(){return a},setClearColor:function(b,x=1){a.set(b),c=x,p(a,c)},getClearAlpha:function(){return c},setClearAlpha:function(b){c=b,p(a,c)},render:y,addToRenderList:m}}function l_(i,e){let t=i.getParameter(i.MAX_VERTEX_ATTRIBS),n={},s=d(null),r=s,o=!1;function a(_,S,z,I,k){let K=!1,G=u(I,z,S);r!==G&&(r=G,l(r.object)),K=f(_,I,z,k),K&&g(_,I,z,k),k!==null&&e.update(k,i.ELEMENT_ARRAY_BUFFER),(K||o)&&(o=!1,M(_,S,z,I),k!==null&&i.bindBuffer(i.ELEMENT_ARRAY_BUFFER,e.get(k).buffer))}function c(){return i.createVertexArray()}function l(_){return i.bindVertexArray(_)}function h(_){return i.deleteVertexArray(_)}function u(_,S,z){let I=z.wireframe===!0,k=n[_.id];k===void 0&&(k={},n[_.id]=k);let K=k[S.id];K===void 0&&(K={},k[S.id]=K);let G=K[I];return G===void 0&&(G=d(c()),K[I]=G),G}function d(_){let S=[],z=[],I=[];for(let k=0;k<t;k++)S[k]=0,z[k]=0,I[k]=0;return{geometry:null,program:null,wireframe:!1,newAttributes:S,enabledAttributes:z,attributeDivisors:I,object:_,attributes:{},index:null}}function f(_,S,z,I){let k=r.attributes,K=S.attributes,G=0,ce=z.getAttributes();for(let X in ce)if(ce[X].location>=0){let Me=k[X],Se=K[X];if(Se===void 0&&(X==="instanceMatrix"&&_.instanceMatrix&&(Se=_.instanceMatrix),X==="instanceColor"&&_.instanceColor&&(Se=_.instanceColor)),Me===void 0||Me.attribute!==Se||Se&&Me.data!==Se.data)return!0;G++}return r.attributesNum!==G||r.index!==I}function g(_,S,z,I){let k={},K=S.attributes,G=0,ce=z.getAttributes();for(let X in ce)if(ce[X].location>=0){let Me=K[X];Me===void 0&&(X==="instanceMatrix"&&_.instanceMatrix&&(Me=_.instanceMatrix),X==="instanceColor"&&_.instanceColor&&(Me=_.instanceColor));let Se={};Se.attribute=Me,Me&&Me.data&&(Se.data=Me.data),k[X]=Se,G++}r.attributes=k,r.attributesNum=G,r.index=I}function y(){let _=r.newAttributes;for(let S=0,z=_.length;S<z;S++)_[S]=0}function m(_){p(_,0)}function p(_,S){let z=r.newAttributes,I=r.enabledAttributes,k=r.attributeDivisors;z[_]=1,I[_]===0&&(i.enableVertexAttribArray(_),I[_]=1),k[_]!==S&&(i.vertexAttribDivisor(_,S),k[_]=S)}function b(){let _=r.newAttributes,S=r.enabledAttributes;for(let z=0,I=S.length;z<I;z++)S[z]!==_[z]&&(i.disableVertexAttribArray(z),S[z]=0)}function x(_,S,z,I,k,K,G){G===!0?i.vertexAttribIPointer(_,S,z,k,K):i.vertexAttribPointer(_,S,z,I,k,K)}function M(_,S,z,I){y();let k=I.attributes,K=z.getAttributes(),G=S.defaultAttributeValues;for(let ce in K){let X=K[ce];if(X.location>=0){let ve=k[ce];if(ve===void 0&&(ce==="instanceMatrix"&&_.instanceMatrix&&(ve=_.instanceMatrix),ce==="instanceColor"&&_.instanceColor&&(ve=_.instanceColor)),ve!==void 0){let Me=ve.normalized,Se=ve.itemSize,Ke=e.get(ve);if(Ke===void 0)continue;let nt=Ke.buffer,J=Ke.type,oe=Ke.bytesPerElement,Re=J===i.INT||J===i.UNSIGNED_INT||ve.gpuType===ql;if(ve.isInterleavedBufferAttribute){let me=ve.data,te=me.stride,xe=ve.offset;if(me.isInstancedInterleavedBuffer){for(let Ve=0;Ve<X.locationSize;Ve++)p(X.location+Ve,me.meshPerAttribute);_.isInstancedMesh!==!0&&I._maxInstanceCount===void 0&&(I._maxInstanceCount=me.meshPerAttribute*me.count)}else for(let Ve=0;Ve<X.locationSize;Ve++)m(X.location+Ve);i.bindBuffer(i.ARRAY_BUFFER,nt);for(let Ve=0;Ve<X.locationSize;Ve++)x(X.location+Ve,Se/X.locationSize,J,Me,te*oe,(xe+Se/X.locationSize*Ve)*oe,Re)}else{if(ve.isInstancedBufferAttribute){for(let me=0;me<X.locationSize;me++)p(X.location+me,ve.meshPerAttribute);_.isInstancedMesh!==!0&&I._maxInstanceCount===void 0&&(I._maxInstanceCount=ve.meshPerAttribute*ve.count)}else for(let me=0;me<X.locationSize;me++)m(X.location+me);i.bindBuffer(i.ARRAY_BUFFER,nt);for(let me=0;me<X.locationSize;me++)x(X.location+me,Se/X.locationSize,J,Me,Se*oe,Se/X.locationSize*me*oe,Re)}}else if(G!==void 0){let Me=G[ce];if(Me!==void 0)switch(Me.length){case 2:i.vertexAttrib2fv(X.location,Me);break;case 3:i.vertexAttrib3fv(X.location,Me);break;case 4:i.vertexAttrib4fv(X.location,Me);break;default:i.vertexAttrib1fv(X.location,Me)}}}}b()}function D(){P();for(let _ in n){let S=n[_];for(let z in S){let I=S[z];for(let k in I)h(I[k].object),delete I[k];delete S[z]}delete n[_]}}function w(_){if(n[_.id]===void 0)return;let S=n[_.id];for(let z in S){let I=S[z];for(let k in I)h(I[k].object),delete I[k];delete S[z]}delete n[_.id]}function R(_){for(let S in n){let z=n[S];if(z[_.id]===void 0)continue;let I=z[_.id];for(let k in I)h(I[k].object),delete I[k];delete z[_.id]}}function P(){H(),o=!0,r!==s&&(r=s,l(r.object))}function H(){s.geometry=null,s.program=null,s.wireframe=!1}return{setup:a,reset:P,resetDefaultState:H,dispose:D,releaseStatesOfGeometry:w,releaseStatesOfProgram:R,initAttributes:y,enableAttribute:m,disableUnusedAttributes:b}}function h_(i,e,t){let n;function s(l){n=l}function r(l,h){i.drawArrays(n,l,h),t.update(h,n,1)}function o(l,h,u){u!==0&&(i.drawArraysInstanced(n,l,h,u),t.update(h,n,u))}function a(l,h,u){if(u===0)return;e.get("WEBGL_multi_draw").multiDrawArraysWEBGL(n,l,0,h,0,u);let f=0;for(let g=0;g<u;g++)f+=h[g];t.update(f,n,1)}function c(l,h,u,d){if(u===0)return;let f=e.get("WEBGL_multi_draw");if(f===null)for(let g=0;g<l.length;g++)o(l[g],h[g],d[g]);else{f.multiDrawArraysInstancedWEBGL(n,l,0,h,0,d,0,u);let g=0;for(let y=0;y<u;y++)g+=h[y];for(let y=0;y<d.length;y++)t.update(g,n,d[y])}}this.setMode=s,this.render=r,this.renderInstances=o,this.renderMultiDraw=a,this.renderMultiDrawInstances=c}function u_(i,e,t,n){let s;function r(){if(s!==void 0)return s;if(e.has("EXT_texture_filter_anisotropic")===!0){let R=e.get("EXT_texture_filter_anisotropic");s=i.getParameter(R.MAX_TEXTURE_MAX_ANISOTROPY_EXT)}else s=0;return s}function o(R){return!(R!==vn&&n.convert(R)!==i.getParameter(i.IMPLEMENTATION_COLOR_READ_FORMAT))}function a(R){let P=R===hr&&(e.has("EXT_color_buffer_half_float")||e.has("EXT_color_buffer_float"));return!(R!==Vn&&n.convert(R)!==i.getParameter(i.IMPLEMENTATION_COLOR_READ_TYPE)&&R!==zn&&!P)}function c(R){if(R==="highp"){if(i.getShaderPrecisionFormat(i.VERTEX_SHADER,i.HIGH_FLOAT).precision>0&&i.getShaderPrecisionFormat(i.FRAGMENT_SHADER,i.HIGH_FLOAT).precision>0)return"highp";R="mediump"}return R==="mediump"&&i.getShaderPrecisionFormat(i.VERTEX_SHADER,i.MEDIUM_FLOAT).precision>0&&i.getShaderPrecisionFormat(i.FRAGMENT_SHADER,i.MEDIUM_FLOAT).precision>0?"mediump":"lowp"}let l=t.precision!==void 0?t.precision:"highp",h=c(l);h!==l&&(console.warn("THREE.WebGLRenderer:",l,"not supported, using",h,"instead."),l=h);let u=t.logarithmicDepthBuffer===!0,d=t.reverseDepthBuffer===!0&&e.has("EXT_clip_control");if(d===!0){let R=e.get("EXT_clip_control");R.clipControlEXT(R.LOWER_LEFT_EXT,R.ZERO_TO_ONE_EXT)}let f=i.getParameter(i.MAX_TEXTURE_IMAGE_UNITS),g=i.getParameter(i.MAX_VERTEX_TEXTURE_IMAGE_UNITS),y=i.getParameter(i.MAX_TEXTURE_SIZE),m=i.getParameter(i.MAX_CUBE_MAP_TEXTURE_SIZE),p=i.getParameter(i.MAX_VERTEX_ATTRIBS),b=i.getParameter(i.MAX_VERTEX_UNIFORM_VECTORS),x=i.getParameter(i.MAX_VARYING_VECTORS),M=i.getParameter(i.MAX_FRAGMENT_UNIFORM_VECTORS),D=g>0,w=i.getParameter(i.MAX_SAMPLES);return{isWebGL2:!0,getMaxAnisotropy:r,getMaxPrecision:c,textureFormatReadable:o,textureTypeReadable:a,precision:l,logarithmicDepthBuffer:u,reverseDepthBuffer:d,maxTextures:f,maxVertexTextures:g,maxTextureSize:y,maxCubemapSize:m,maxAttributes:p,maxVertexUniforms:b,maxVaryings:x,maxFragmentUniforms:M,vertexTextures:D,maxSamples:w}}function d_(i){let e=this,t=null,n=0,s=!1,r=!1,o=new Fn,a=new je,c={value:null,needsUpdate:!1};this.uniform=c,this.numPlanes=0,this.numIntersection=0,this.init=function(u,d){let f=u.length!==0||d||n!==0||s;return s=d,n=u.length,f},this.beginShadows=function(){r=!0,h(null)},this.endShadows=function(){r=!1},this.setGlobalState=function(u,d){t=h(u,d,0)},this.setState=function(u,d,f){let g=u.clippingPlanes,y=u.clipIntersection,m=u.clipShadows,p=i.get(u);if(!s||g===null||g.length===0||r&&!m)r?h(null):l();else{let b=r?0:n,x=b*4,M=p.clippingState||null;c.value=M,M=h(g,d,x,f);for(let D=0;D!==x;++D)M[D]=t[D];p.clippingState=M,this.numIntersection=y?this.numPlanes:0,this.numPlanes+=b}};function l(){c.value!==t&&(c.value=t,c.needsUpdate=n>0),e.numPlanes=n,e.numIntersection=0}function h(u,d,f,g){let y=u!==null?u.length:0,m=null;if(y!==0){if(m=c.value,g!==!0||m===null){let p=f+y*4,b=d.matrixWorldInverse;a.getNormalMatrix(b),(m===null||m.length<p)&&(m=new Float32Array(p));for(let x=0,M=f;x!==y;++x,M+=4)o.copy(u[x]).applyMatrix4(b,a),o.normal.toArray(m,M),m[M+3]=o.constant}c.value=m,c.needsUpdate=!0}return e.numPlanes=y,e.numIntersection=0,m}}function f_(i){let e=new WeakMap;function t(o,a){return a===wc?o.mapping=cs:a===Cc&&(o.mapping=ls),o}function n(o){if(o&&o.isTexture){let a=o.mapping;if(a===wc||a===Cc)if(e.has(o)){let c=e.get(o).texture;return t(c,o.mapping)}else{let c=o.image;if(c&&c.height>0){let l=new al(c.height);return l.fromEquirectangularTexture(i,o),e.set(o,l),o.addEventListener("dispose",s),t(l.texture,o.mapping)}else return null}}return o}function s(o){let a=o.target;a.removeEventListener("dispose",s);let c=e.get(a);c!==void 0&&(e.delete(a),c.dispose())}function r(){e=new WeakMap}return{get:n,dispose:r}}var Po=class extends Ao{constructor(e=-1,t=1,n=1,s=-1,r=.1,o=2e3){super(),this.isOrthographicCamera=!0,this.type="OrthographicCamera",this.zoom=1,this.view=null,this.left=e,this.right=t,this.top=n,this.bottom=s,this.near=r,this.far=o,this.updateProjectionMatrix()}copy(e,t){return super.copy(e,t),this.left=e.left,this.right=e.right,this.top=e.top,this.bottom=e.bottom,this.near=e.near,this.far=e.far,this.zoom=e.zoom,this.view=e.view===null?null:Object.assign({},e.view),this}setViewOffset(e,t,n,s,r,o){this.view===null&&(this.view={enabled:!0,fullWidth:1,fullHeight:1,offsetX:0,offsetY:0,width:1,height:1}),this.view.enabled=!0,this.view.fullWidth=e,this.view.fullHeight=t,this.view.offsetX=n,this.view.offsetY=s,this.view.width=r,this.view.height=o,this.updateProjectionMatrix()}clearViewOffset(){this.view!==null&&(this.view.enabled=!1),this.updateProjectionMatrix()}updateProjectionMatrix(){let e=(this.right-this.left)/(2*this.zoom),t=(this.top-this.bottom)/(2*this.zoom),n=(this.right+this.left)/2,s=(this.top+this.bottom)/2,r=n-e,o=n+e,a=s+t,c=s-t;if(this.view!==null&&this.view.enabled){let l=(this.right-this.left)/this.view.fullWidth/this.zoom,h=(this.top-this.bottom)/this.view.fullHeight/this.zoom;r+=l*this.view.offsetX,o=r+l*this.view.width,a-=h*this.view.offsetY,c=a-h*this.view.height}this.projectionMatrix.makeOrthographic(r,o,a,c,this.near,this.far,this.coordinateSystem),this.projectionMatrixInverse.copy(this.projectionMatrix).invert()}toJSON(e){let t=super.toJSON(e);return t.object.zoom=this.zoom,t.object.left=this.left,t.object.right=this.right,t.object.top=this.top,t.object.bottom=this.bottom,t.object.near=this.near,t.object.far=this.far,this.view!==null&&(t.object.view=Object.assign({},this.view)),t}},ts=4,Zu=[.125,.215,.35,.446,.526,.582],xi=20,sc=new Po,ju=new Qe,rc=null,oc=0,ac=0,cc=!1,_i=(1+Math.sqrt(5))/2,Zi=1/_i,Ku=[new A(-_i,Zi,0),new A(_i,Zi,0),new A(-Zi,0,_i),new A(Zi,0,_i),new A(0,_i,-Zi),new A(0,_i,Zi),new A(-1,1,-1),new A(1,1,-1),new A(-1,1,1),new A(1,1,1)],Io=class{constructor(e){this._renderer=e,this._pingPongRenderTarget=null,this._lodMax=0,this._cubeSize=0,this._lodPlanes=[],this._sizeLods=[],this._sigmas=[],this._blurMaterial=null,this._cubemapMaterial=null,this._equirectMaterial=null,this._compileMaterial(this._blurMaterial)}fromScene(e,t=0,n=.1,s=100){rc=this._renderer.getRenderTarget(),oc=this._renderer.getActiveCubeFace(),ac=this._renderer.getActiveMipmapLevel(),cc=this._renderer.xr.enabled,this._renderer.xr.enabled=!1,this._setSize(256);let r=this._allocateTargets();return r.depthBuffer=!0,this._sceneToCubeUV(e,n,s,r),t>0&&this._blur(r,0,0,t),this._applyPMREM(r),this._cleanup(r),r}fromEquirectangular(e,t=null){return this._fromTexture(e,t)}fromCubemap(e,t=null){return this._fromTexture(e,t)}compileCubemapShader(){this._cubemapMaterial===null&&(this._cubemapMaterial=td(),this._compileMaterial(this._cubemapMaterial))}compileEquirectangularShader(){this._equirectMaterial===null&&(this._equirectMaterial=ed(),this._compileMaterial(this._equirectMaterial))}dispose(){this._dispose(),this._cubemapMaterial!==null&&this._cubemapMaterial.dispose(),this._equirectMaterial!==null&&this._equirectMaterial.dispose()}_setSize(e){this._lodMax=Math.floor(Math.log2(e)),this._cubeSize=Math.pow(2,this._lodMax)}_dispose(){this._blurMaterial!==null&&this._blurMaterial.dispose(),this._pingPongRenderTarget!==null&&this._pingPongRenderTarget.dispose();for(let e=0;e<this._lodPlanes.length;e++)this._lodPlanes[e].dispose()}_cleanup(e){this._renderer.setRenderTarget(rc,oc,ac),this._renderer.xr.enabled=cc,e.scissorTest=!1,Kr(e,0,0,e.width,e.height)}_fromTexture(e,t){e.mapping===cs||e.mapping===ls?this._setSize(e.image.length===0?16:e.image[0].width||e.image[0].image.width):this._setSize(e.image.width/4),rc=this._renderer.getRenderTarget(),oc=this._renderer.getActiveCubeFace(),ac=this._renderer.getActiveMipmapLevel(),cc=this._renderer.xr.enabled,this._renderer.xr.enabled=!1;let n=t||this._allocateTargets();return this._textureToCubeUV(e,n),this._applyPMREM(n),this._cleanup(n),n}_allocateTargets(){let e=3*Math.max(this._cubeSize,112),t=4*this._cubeSize,n={magFilter:yn,minFilter:yn,generateMipmaps:!1,type:hr,format:vn,colorSpace:oi,depthBuffer:!1},s=Qu(e,t,n);if(this._pingPongRenderTarget===null||this._pingPongRenderTarget.width!==e||this._pingPongRenderTarget.height!==t){this._pingPongRenderTarget!==null&&this._dispose(),this._pingPongRenderTarget=Qu(e,t,n);let{_lodMax:r}=this;({sizeLods:this._sizeLods,lodPlanes:this._lodPlanes,sigmas:this._sigmas}=p_(r)),this._blurMaterial=m_(r,e,t)}return s}_compileMaterial(e){let t=new tt(this._lodPlanes[0],e);this._renderer.compile(t,sc)}_sceneToCubeUV(e,t,n,s){let a=new Ot(90,1,t,n),c=[1,-1,1,1,1,1],l=[1,1,1,-1,-1,-1],h=this._renderer,u=h.autoClear,d=h.toneMapping;h.getClearColor(ju),h.toneMapping=ii,h.autoClear=!1;let f=new Xn({name:"PMREM.Background",side:Ht,depthWrite:!1,depthTest:!1}),g=new tt(new pe,f),y=!1,m=e.background;m?m.isColor&&(f.color.copy(m),e.background=null,y=!0):(f.color.copy(ju),y=!0);for(let p=0;p<6;p++){let b=p%3;b===0?(a.up.set(0,c[p],0),a.lookAt(l[p],0,0)):b===1?(a.up.set(0,0,c[p]),a.lookAt(0,l[p],0)):(a.up.set(0,c[p],0),a.lookAt(0,0,l[p]));let x=this._cubeSize;Kr(s,b*x,p>2?x:0,x,x),h.setRenderTarget(s),y&&h.render(g,a),h.render(e,a)}g.geometry.dispose(),g.material.dispose(),h.toneMapping=d,h.autoClear=u,e.background=m}_textureToCubeUV(e,t){let n=this._renderer,s=e.mapping===cs||e.mapping===ls;s?(this._cubemapMaterial===null&&(this._cubemapMaterial=td()),this._cubemapMaterial.uniforms.flipEnvMap.value=e.isRenderTargetTexture===!1?-1:1):this._equirectMaterial===null&&(this._equirectMaterial=ed());let r=s?this._cubemapMaterial:this._equirectMaterial,o=new tt(this._lodPlanes[0],r),a=r.uniforms;a.envMap.value=e;let c=this._cubeSize;Kr(t,0,0,3*c,2*c),n.setRenderTarget(t),n.render(o,sc)}_applyPMREM(e){let t=this._renderer,n=t.autoClear;t.autoClear=!1;let s=this._lodPlanes.length;for(let r=1;r<s;r++){let o=Math.sqrt(this._sigmas[r]*this._sigmas[r]-this._sigmas[r-1]*this._sigmas[r-1]),a=Ku[(s-r-1)%Ku.length];this._blur(e,r-1,r,o,a)}t.autoClear=n}_blur(e,t,n,s,r){let o=this._pingPongRenderTarget;this._halfBlur(e,o,t,n,s,"latitudinal",r),this._halfBlur(o,e,n,n,s,"longitudinal",r)}_halfBlur(e,t,n,s,r,o,a){let c=this._renderer,l=this._blurMaterial;o!=="latitudinal"&&o!=="longitudinal"&&console.error("blur direction must be either latitudinal or longitudinal!");let h=3,u=new tt(this._lodPlanes[s],l),d=l.uniforms,f=this._sizeLods[n]-1,g=isFinite(r)?Math.PI/(2*f):2*Math.PI/(2*xi-1),y=r/g,m=isFinite(r)?1+Math.floor(h*y):xi;m>xi&&console.warn(`sigmaRadians, ${r}, is too large and will clip, as it requested ${m} samples when the maximum is set to ${xi}`);let p=[],b=0;for(let R=0;R<xi;++R){let P=R/y,H=Math.exp(-P*P/2);p.push(H),R===0?b+=H:R<m&&(b+=2*H)}for(let R=0;R<p.length;R++)p[R]=p[R]/b;d.envMap.value=e.texture,d.samples.value=m,d.weights.value=p,d.latitudinal.value=o==="latitudinal",a&&(d.poleAxis.value=a);let{_lodMax:x}=this;d.dTheta.value=g,d.mipInt.value=x-n;let M=this._sizeLods[s],D=3*M*(s>x-ts?s-x+ts:0),w=4*(this._cubeSize-M);Kr(t,D,w,3*M,2*M),c.setRenderTarget(t),c.render(u,sc)}};function p_(i){let e=[],t=[],n=[],s=i,r=i-ts+1+Zu.length;for(let o=0;o<r;o++){let a=Math.pow(2,s);t.push(a);let c=1/a;o>i-ts?c=Zu[o-i+ts-1]:o===0&&(c=0),n.push(c);let l=1/(a-2),h=-l,u=1+l,d=[h,h,u,h,u,u,h,h,u,u,h,u],f=6,g=6,y=3,m=2,p=1,b=new Float32Array(y*g*f),x=new Float32Array(m*g*f),M=new Float32Array(p*g*f);for(let w=0;w<f;w++){let R=w%3*2/3-1,P=w>2?0:-1,H=[R,P,0,R+2/3,P,0,R+2/3,P+1,0,R,P,0,R+2/3,P+1,0,R,P+1,0];b.set(H,y*g*w),x.set(d,m*g*w);let _=[w,w,w,w,w,w];M.set(_,p*g*w)}let D=new Dt;D.setAttribute("position",new tn(b,y)),D.setAttribute("uv",new tn(x,m)),D.setAttribute("faceIndex",new tn(M,p)),e.push(D),s>ts&&s--}return{lodPlanes:e,sizeLods:t,sigmas:n}}function Qu(i,e,t){let n=new Gn(i,e,t);return n.texture.mapping=Zo,n.texture.name="PMREM.cubeUv",n.scissorTest=!0,n}function Kr(i,e,t,n,s){i.viewport.set(e,t,n,s),i.scissor.set(e,t,n,s)}function m_(i,e,t){let n=new Float32Array(xi),s=new A(0,1,0);return new hn({name:"SphericalGaussianBlur",defines:{n:xi,CUBEUV_TEXEL_WIDTH:1/e,CUBEUV_TEXEL_HEIGHT:1/t,CUBEUV_MAX_MIP:`${i}.0`},uniforms:{envMap:{value:null},samples:{value:1},weights:{value:n},latitudinal:{value:!1},dTheta:{value:0},mipInt:{value:0},poleAxis:{value:s}},vertexShader:nh(),fragmentShader:`

			precision mediump float;
			precision mediump int;

			varying vec3 vOutputDirection;

			uniform sampler2D envMap;
			uniform int samples;
			uniform float weights[ n ];
			uniform bool latitudinal;
			uniform float dTheta;
			uniform float mipInt;
			uniform vec3 poleAxis;

			#define ENVMAP_TYPE_CUBE_UV
			#include <cube_uv_reflection_fragment>

			vec3 getSample( float theta, vec3 axis ) {

				float cosTheta = cos( theta );
				// Rodrigues' axis-angle rotation
				vec3 sampleDirection = vOutputDirection * cosTheta
					+ cross( axis, vOutputDirection ) * sin( theta )
					+ axis * dot( axis, vOutputDirection ) * ( 1.0 - cosTheta );

				return bilinearCubeUV( envMap, sampleDirection, mipInt );

			}

			void main() {

				vec3 axis = latitudinal ? poleAxis : cross( poleAxis, vOutputDirection );

				if ( all( equal( axis, vec3( 0.0 ) ) ) ) {

					axis = vec3( vOutputDirection.z, 0.0, - vOutputDirection.x );

				}

				axis = normalize( axis );

				gl_FragColor = vec4( 0.0, 0.0, 0.0, 1.0 );
				gl_FragColor.rgb += weights[ 0 ] * getSample( 0.0, axis );

				for ( int i = 1; i < n; i++ ) {

					if ( i >= samples ) {

						break;

					}

					float theta = dTheta * float( i );
					gl_FragColor.rgb += weights[ i ] * getSample( -1.0 * theta, axis );
					gl_FragColor.rgb += weights[ i ] * getSample( theta, axis );

				}

			}
		`,blending:ni,depthTest:!1,depthWrite:!1})}function ed(){return new hn({name:"EquirectangularToCubeUV",uniforms:{envMap:{value:null}},vertexShader:nh(),fragmentShader:`

			precision mediump float;
			precision mediump int;

			varying vec3 vOutputDirection;

			uniform sampler2D envMap;

			#include <common>

			void main() {

				vec3 outputDirection = normalize( vOutputDirection );
				vec2 uv = equirectUv( outputDirection );

				gl_FragColor = vec4( texture2D ( envMap, uv ).rgb, 1.0 );

			}
		`,blending:ni,depthTest:!1,depthWrite:!1})}function td(){return new hn({name:"CubemapToCubeUV",uniforms:{envMap:{value:null},flipEnvMap:{value:-1}},vertexShader:nh(),fragmentShader:`

			precision mediump float;
			precision mediump int;

			uniform float flipEnvMap;

			varying vec3 vOutputDirection;

			uniform samplerCube envMap;

			void main() {

				gl_FragColor = textureCube( envMap, vec3( flipEnvMap * vOutputDirection.x, vOutputDirection.yz ) );

			}
		`,blending:ni,depthTest:!1,depthWrite:!1})}function nh(){return`

		precision mediump float;
		precision mediump int;

		attribute float faceIndex;

		varying vec3 vOutputDirection;

		// RH coordinate system; PMREM face-indexing convention
		vec3 getDirection( vec2 uv, float face ) {

			uv = 2.0 * uv - 1.0;

			vec3 direction = vec3( uv, 1.0 );

			if ( face == 0.0 ) {

				direction = direction.zyx; // ( 1, v, u ) pos x

			} else if ( face == 1.0 ) {

				direction = direction.xzy;
				direction.xz *= -1.0; // ( -u, 1, -v ) pos y

			} else if ( face == 2.0 ) {

				direction.x *= -1.0; // ( -u, v, 1 ) pos z

			} else if ( face == 3.0 ) {

				direction = direction.zyx;
				direction.xz *= -1.0; // ( -1, v, -u ) neg x

			} else if ( face == 4.0 ) {

				direction = direction.xzy;
				direction.xy *= -1.0; // ( -u, -1, v ) neg y

			} else if ( face == 5.0 ) {

				direction.z *= -1.0; // ( u, v, -1 ) neg z

			}

			return direction;

		}

		void main() {

			vOutputDirection = getDirection( uv, faceIndex );
			gl_Position = vec4( position, 1.0 );

		}
	`}function g_(i){let e=new WeakMap,t=null;function n(a){if(a&&a.isTexture){let c=a.mapping,l=c===wc||c===Cc,h=c===cs||c===ls;if(l||h){let u=e.get(a),d=u!==void 0?u.texture.pmremVersion:0;if(a.isRenderTargetTexture&&a.pmremVersion!==d)return t===null&&(t=new Io(i)),u=l?t.fromEquirectangular(a,u):t.fromCubemap(a,u),u.texture.pmremVersion=a.pmremVersion,e.set(a,u),u.texture;if(u!==void 0)return u.texture;{let f=a.image;return l&&f&&f.height>0||h&&f&&s(f)?(t===null&&(t=new Io(i)),u=l?t.fromEquirectangular(a):t.fromCubemap(a),u.texture.pmremVersion=a.pmremVersion,e.set(a,u),a.addEventListener("dispose",r),u.texture):null}}}return a}function s(a){let c=0,l=6;for(let h=0;h<l;h++)a[h]!==void 0&&c++;return c===l}function r(a){let c=a.target;c.removeEventListener("dispose",r);let l=e.get(c);l!==void 0&&(e.delete(c),l.dispose())}function o(){e=new WeakMap,t!==null&&(t.dispose(),t=null)}return{get:n,dispose:o}}function __(i){let e={};function t(n){if(e[n]!==void 0)return e[n];let s;switch(n){case"WEBGL_depth_texture":s=i.getExtension("WEBGL_depth_texture")||i.getExtension("MOZ_WEBGL_depth_texture")||i.getExtension("WEBKIT_WEBGL_depth_texture");break;case"EXT_texture_filter_anisotropic":s=i.getExtension("EXT_texture_filter_anisotropic")||i.getExtension("MOZ_EXT_texture_filter_anisotropic")||i.getExtension("WEBKIT_EXT_texture_filter_anisotropic");break;case"WEBGL_compressed_texture_s3tc":s=i.getExtension("WEBGL_compressed_texture_s3tc")||i.getExtension("MOZ_WEBGL_compressed_texture_s3tc")||i.getExtension("WEBKIT_WEBGL_compressed_texture_s3tc");break;case"WEBGL_compressed_texture_pvrtc":s=i.getExtension("WEBGL_compressed_texture_pvrtc")||i.getExtension("WEBKIT_WEBGL_compressed_texture_pvrtc");break;default:s=i.getExtension(n)}return e[n]=s,s}return{has:function(n){return t(n)!==null},init:function(){t("EXT_color_buffer_float"),t("WEBGL_clip_cull_distance"),t("OES_texture_float_linear"),t("EXT_color_buffer_half_float"),t("WEBGL_multisampled_render_to_texture"),t("WEBGL_render_shared_exponent")},get:function(n){let s=t(n);return s===null&&mo("THREE.WebGLRenderer: "+n+" extension not supported."),s}}}function y_(i,e,t,n){let s={},r=new WeakMap;function o(u){let d=u.target;d.index!==null&&e.remove(d.index);for(let g in d.attributes)e.remove(d.attributes[g]);for(let g in d.morphAttributes){let y=d.morphAttributes[g];for(let m=0,p=y.length;m<p;m++)e.remove(y[m])}d.removeEventListener("dispose",o),delete s[d.id];let f=r.get(d);f&&(e.remove(f),r.delete(d)),n.releaseStatesOfGeometry(d),d.isInstancedBufferGeometry===!0&&delete d._maxInstanceCount,t.memory.geometries--}function a(u,d){return s[d.id]===!0||(d.addEventListener("dispose",o),s[d.id]=!0,t.memory.geometries++),d}function c(u){let d=u.attributes;for(let g in d)e.update(d[g],i.ARRAY_BUFFER);let f=u.morphAttributes;for(let g in f){let y=f[g];for(let m=0,p=y.length;m<p;m++)e.update(y[m],i.ARRAY_BUFFER)}}function l(u){let d=[],f=u.index,g=u.attributes.position,y=0;if(f!==null){let b=f.array;y=f.version;for(let x=0,M=b.length;x<M;x+=3){let D=b[x+0],w=b[x+1],R=b[x+2];d.push(D,w,w,R,R,D)}}else if(g!==void 0){let b=g.array;y=g.version;for(let x=0,M=b.length/3-1;x<M;x+=3){let D=x+0,w=x+1,R=x+2;d.push(D,w,w,R,R,D)}}else return;let m=new(qd(d)?Co:wo)(d,1);m.version=y;let p=r.get(u);p&&e.remove(p),r.set(u,m)}function h(u){let d=r.get(u);if(d){let f=u.index;f!==null&&d.version<f.version&&l(u)}else l(u);return r.get(u)}return{get:a,update:c,getWireframeAttribute:h}}function x_(i,e,t){let n;function s(d){n=d}let r,o;function a(d){r=d.type,o=d.bytesPerElement}function c(d,f){i.drawElements(n,f,r,d*o),t.update(f,n,1)}function l(d,f,g){g!==0&&(i.drawElementsInstanced(n,f,r,d*o,g),t.update(f,n,g))}function h(d,f,g){if(g===0)return;e.get("WEBGL_multi_draw").multiDrawElementsWEBGL(n,f,0,r,d,0,g);let m=0;for(let p=0;p<g;p++)m+=f[p];t.update(m,n,1)}function u(d,f,g,y){if(g===0)return;let m=e.get("WEBGL_multi_draw");if(m===null)for(let p=0;p<d.length;p++)l(d[p]/o,f[p],y[p]);else{m.multiDrawElementsInstancedWEBGL(n,f,0,r,d,0,y,0,g);let p=0;for(let b=0;b<g;b++)p+=f[b];for(let b=0;b<y.length;b++)t.update(p,n,y[b])}}this.setMode=s,this.setIndex=a,this.render=c,this.renderInstances=l,this.renderMultiDraw=h,this.renderMultiDrawInstances=u}function v_(i){let e={geometries:0,textures:0},t={frame:0,calls:0,triangles:0,points:0,lines:0};function n(r,o,a){switch(t.calls++,o){case i.TRIANGLES:t.triangles+=a*(r/3);break;case i.LINES:t.lines+=a*(r/2);break;case i.LINE_STRIP:t.lines+=a*(r-1);break;case i.LINE_LOOP:t.lines+=a*r;break;case i.POINTS:t.points+=a*r;break;default:console.error("THREE.WebGLInfo: Unknown draw mode:",o);break}}function s(){t.calls=0,t.triangles=0,t.points=0,t.lines=0}return{memory:e,render:t,programs:null,autoReset:!0,reset:s,update:n}}function M_(i,e,t){let n=new WeakMap,s=new ft;function r(o,a,c){let l=o.morphTargetInfluences,h=a.morphAttributes.position||a.morphAttributes.normal||a.morphAttributes.color,u=h!==void 0?h.length:0,d=n.get(a);if(d===void 0||d.count!==u){let H=function(){R.dispose(),n.delete(a),a.removeEventListener("dispose",H)};d!==void 0&&d.texture.dispose();let f=a.morphAttributes.position!==void 0,g=a.morphAttributes.normal!==void 0,y=a.morphAttributes.color!==void 0,m=a.morphAttributes.position||[],p=a.morphAttributes.normal||[],b=a.morphAttributes.color||[],x=0;f===!0&&(x=1),g===!0&&(x=2),y===!0&&(x=3);let M=a.attributes.position.count*x,D=1;M>e.maxTextureSize&&(D=Math.ceil(M/e.maxTextureSize),M=e.maxTextureSize);let w=new Float32Array(M*D*4*u),R=new So(w,M,D,u);R.type=zn,R.needsUpdate=!0;let P=x*4;for(let _=0;_<u;_++){let S=m[_],z=p[_],I=b[_],k=M*D*4*_;for(let K=0;K<S.count;K++){let G=K*P;f===!0&&(s.fromBufferAttribute(S,K),w[k+G+0]=s.x,w[k+G+1]=s.y,w[k+G+2]=s.z,w[k+G+3]=0),g===!0&&(s.fromBufferAttribute(z,K),w[k+G+4]=s.x,w[k+G+5]=s.y,w[k+G+6]=s.z,w[k+G+7]=0),y===!0&&(s.fromBufferAttribute(I,K),w[k+G+8]=s.x,w[k+G+9]=s.y,w[k+G+10]=s.z,w[k+G+11]=I.itemSize===4?s.w:1)}}d={count:u,texture:R,size:new le(M,D)},n.set(a,d),a.addEventListener("dispose",H)}if(o.isInstancedMesh===!0&&o.morphTexture!==null)c.getUniforms().setValue(i,"morphTexture",o.morphTexture,t);else{let f=0;for(let y=0;y<l.length;y++)f+=l[y];let g=a.morphTargetsRelative?1:1-f;c.getUniforms().setValue(i,"morphTargetBaseInfluence",g),c.getUniforms().setValue(i,"morphTargetInfluences",l)}c.getUniforms().setValue(i,"morphTargetsTexture",d.texture,t),c.getUniforms().setValue(i,"morphTargetsTextureSize",d.size)}return{update:r}}function b_(i,e,t,n){let s=new WeakMap;function r(c){let l=n.render.frame,h=c.geometry,u=e.get(c,h);if(s.get(u)!==l&&(e.update(u),s.set(u,l)),c.isInstancedMesh&&(c.hasEventListener("dispose",a)===!1&&c.addEventListener("dispose",a),s.get(c)!==l&&(t.update(c.instanceMatrix,i.ARRAY_BUFFER),c.instanceColor!==null&&t.update(c.instanceColor,i.ARRAY_BUFFER),s.set(c,l))),c.isSkinnedMesh){let d=c.skeleton;s.get(d)!==l&&(d.update(),s.set(d,l))}return u}function o(){s=new WeakMap}function a(c){let l=c.target;l.removeEventListener("dispose",a),t.remove(l.instanceMatrix),l.instanceColor!==null&&t.remove(l.instanceColor)}return{update:r,dispose:o}}var Lo=class extends nn{constructor(e,t,n,s,r,o,a,c,l,h=ss){if(h!==ss&&h!==us)throw new Error("DepthTexture format must be either THREE.DepthFormat or THREE.DepthStencilFormat");n===void 0&&h===ss&&(n=bi),n===void 0&&h===us&&(n=hs),super(null,s,r,o,a,c,h,n,l),this.isDepthTexture=!0,this.image={width:e,height:t},this.magFilter=a!==void 0?a:ln,this.minFilter=c!==void 0?c:ln,this.flipY=!1,this.generateMipmaps=!1,this.compareFunction=null}copy(e){return super.copy(e),this.compareFunction=e.compareFunction,this}toJSON(e){let t=super.toJSON(e);return this.compareFunction!==null&&(t.compareFunction=this.compareFunction),t}},Zd=new nn,nd=new Lo(1,1),jd=new So,Kd=new rl,Qd=new Ro,id=[],sd=[],rd=new Float32Array(16),od=new Float32Array(9),ad=new Float32Array(4);function ys(i,e,t){let n=i[0];if(n<=0||n>0)return i;let s=e*t,r=id[s];if(r===void 0&&(r=new Float32Array(s),id[s]=r),e!==0){n.toArray(r,0);for(let o=1,a=0;o!==e;++o)a+=t,i[o].toArray(r,a)}return r}function At(i,e){if(i.length!==e.length)return!1;for(let t=0,n=i.length;t<n;t++)if(i[t]!==e[t])return!1;return!0}function Rt(i,e){for(let t=0,n=e.length;t<n;t++)i[t]=e[t]}function Ko(i,e){let t=sd[e];t===void 0&&(t=new Int32Array(e),sd[e]=t);for(let n=0;n!==e;++n)t[n]=i.allocateTextureUnit();return t}function S_(i,e){let t=this.cache;t[0]!==e&&(i.uniform1f(this.addr,e),t[0]=e)}function E_(i,e){let t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y)&&(i.uniform2f(this.addr,e.x,e.y),t[0]=e.x,t[1]=e.y);else{if(At(t,e))return;i.uniform2fv(this.addr,e),Rt(t,e)}}function T_(i,e){let t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y||t[2]!==e.z)&&(i.uniform3f(this.addr,e.x,e.y,e.z),t[0]=e.x,t[1]=e.y,t[2]=e.z);else if(e.r!==void 0)(t[0]!==e.r||t[1]!==e.g||t[2]!==e.b)&&(i.uniform3f(this.addr,e.r,e.g,e.b),t[0]=e.r,t[1]=e.g,t[2]=e.b);else{if(At(t,e))return;i.uniform3fv(this.addr,e),Rt(t,e)}}function w_(i,e){let t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y||t[2]!==e.z||t[3]!==e.w)&&(i.uniform4f(this.addr,e.x,e.y,e.z,e.w),t[0]=e.x,t[1]=e.y,t[2]=e.z,t[3]=e.w);else{if(At(t,e))return;i.uniform4fv(this.addr,e),Rt(t,e)}}function C_(i,e){let t=this.cache,n=e.elements;if(n===void 0){if(At(t,e))return;i.uniformMatrix2fv(this.addr,!1,e),Rt(t,e)}else{if(At(t,n))return;ad.set(n),i.uniformMatrix2fv(this.addr,!1,ad),Rt(t,n)}}function A_(i,e){let t=this.cache,n=e.elements;if(n===void 0){if(At(t,e))return;i.uniformMatrix3fv(this.addr,!1,e),Rt(t,e)}else{if(At(t,n))return;od.set(n),i.uniformMatrix3fv(this.addr,!1,od),Rt(t,n)}}function R_(i,e){let t=this.cache,n=e.elements;if(n===void 0){if(At(t,e))return;i.uniformMatrix4fv(this.addr,!1,e),Rt(t,e)}else{if(At(t,n))return;rd.set(n),i.uniformMatrix4fv(this.addr,!1,rd),Rt(t,n)}}function P_(i,e){let t=this.cache;t[0]!==e&&(i.uniform1i(this.addr,e),t[0]=e)}function I_(i,e){let t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y)&&(i.uniform2i(this.addr,e.x,e.y),t[0]=e.x,t[1]=e.y);else{if(At(t,e))return;i.uniform2iv(this.addr,e),Rt(t,e)}}function L_(i,e){let t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y||t[2]!==e.z)&&(i.uniform3i(this.addr,e.x,e.y,e.z),t[0]=e.x,t[1]=e.y,t[2]=e.z);else{if(At(t,e))return;i.uniform3iv(this.addr,e),Rt(t,e)}}function D_(i,e){let t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y||t[2]!==e.z||t[3]!==e.w)&&(i.uniform4i(this.addr,e.x,e.y,e.z,e.w),t[0]=e.x,t[1]=e.y,t[2]=e.z,t[3]=e.w);else{if(At(t,e))return;i.uniform4iv(this.addr,e),Rt(t,e)}}function U_(i,e){let t=this.cache;t[0]!==e&&(i.uniform1ui(this.addr,e),t[0]=e)}function N_(i,e){let t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y)&&(i.uniform2ui(this.addr,e.x,e.y),t[0]=e.x,t[1]=e.y);else{if(At(t,e))return;i.uniform2uiv(this.addr,e),Rt(t,e)}}function k_(i,e){let t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y||t[2]!==e.z)&&(i.uniform3ui(this.addr,e.x,e.y,e.z),t[0]=e.x,t[1]=e.y,t[2]=e.z);else{if(At(t,e))return;i.uniform3uiv(this.addr,e),Rt(t,e)}}function O_(i,e){let t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y||t[2]!==e.z||t[3]!==e.w)&&(i.uniform4ui(this.addr,e.x,e.y,e.z,e.w),t[0]=e.x,t[1]=e.y,t[2]=e.z,t[3]=e.w);else{if(At(t,e))return;i.uniform4uiv(this.addr,e),Rt(t,e)}}function F_(i,e,t){let n=this.cache,s=t.allocateTextureUnit();n[0]!==s&&(i.uniform1i(this.addr,s),n[0]=s);let r;this.type===i.SAMPLER_2D_SHADOW?(nd.compareFunction=Xd,r=nd):r=Zd,t.setTexture2D(e||r,s)}function B_(i,e,t){let n=this.cache,s=t.allocateTextureUnit();n[0]!==s&&(i.uniform1i(this.addr,s),n[0]=s),t.setTexture3D(e||Kd,s)}function z_(i,e,t){let n=this.cache,s=t.allocateTextureUnit();n[0]!==s&&(i.uniform1i(this.addr,s),n[0]=s),t.setTextureCube(e||Qd,s)}function H_(i,e,t){let n=this.cache,s=t.allocateTextureUnit();n[0]!==s&&(i.uniform1i(this.addr,s),n[0]=s),t.setTexture2DArray(e||jd,s)}function V_(i){switch(i){case 5126:return S_;case 35664:return E_;case 35665:return T_;case 35666:return w_;case 35674:return C_;case 35675:return A_;case 35676:return R_;case 5124:case 35670:return P_;case 35667:case 35671:return I_;case 35668:case 35672:return L_;case 35669:case 35673:return D_;case 5125:return U_;case 36294:return N_;case 36295:return k_;case 36296:return O_;case 35678:case 36198:case 36298:case 36306:case 35682:return F_;case 35679:case 36299:case 36307:return B_;case 35680:case 36300:case 36308:case 36293:return z_;case 36289:case 36303:case 36311:case 36292:return H_}}function G_(i,e){i.uniform1fv(this.addr,e)}function W_(i,e){let t=ys(e,this.size,2);i.uniform2fv(this.addr,t)}function X_(i,e){let t=ys(e,this.size,3);i.uniform3fv(this.addr,t)}function q_(i,e){let t=ys(e,this.size,4);i.uniform4fv(this.addr,t)}function Y_(i,e){let t=ys(e,this.size,4);i.uniformMatrix2fv(this.addr,!1,t)}function $_(i,e){let t=ys(e,this.size,9);i.uniformMatrix3fv(this.addr,!1,t)}function J_(i,e){let t=ys(e,this.size,16);i.uniformMatrix4fv(this.addr,!1,t)}function Z_(i,e){i.uniform1iv(this.addr,e)}function j_(i,e){i.uniform2iv(this.addr,e)}function K_(i,e){i.uniform3iv(this.addr,e)}function Q_(i,e){i.uniform4iv(this.addr,e)}function ey(i,e){i.uniform1uiv(this.addr,e)}function ty(i,e){i.uniform2uiv(this.addr,e)}function ny(i,e){i.uniform3uiv(this.addr,e)}function iy(i,e){i.uniform4uiv(this.addr,e)}function sy(i,e,t){let n=this.cache,s=e.length,r=Ko(t,s);At(n,r)||(i.uniform1iv(this.addr,r),Rt(n,r));for(let o=0;o!==s;++o)t.setTexture2D(e[o]||Zd,r[o])}function ry(i,e,t){let n=this.cache,s=e.length,r=Ko(t,s);At(n,r)||(i.uniform1iv(this.addr,r),Rt(n,r));for(let o=0;o!==s;++o)t.setTexture3D(e[o]||Kd,r[o])}function oy(i,e,t){let n=this.cache,s=e.length,r=Ko(t,s);At(n,r)||(i.uniform1iv(this.addr,r),Rt(n,r));for(let o=0;o!==s;++o)t.setTextureCube(e[o]||Qd,r[o])}function ay(i,e,t){let n=this.cache,s=e.length,r=Ko(t,s);At(n,r)||(i.uniform1iv(this.addr,r),Rt(n,r));for(let o=0;o!==s;++o)t.setTexture2DArray(e[o]||jd,r[o])}function cy(i){switch(i){case 5126:return G_;case 35664:return W_;case 35665:return X_;case 35666:return q_;case 35674:return Y_;case 35675:return $_;case 35676:return J_;case 5124:case 35670:return Z_;case 35667:case 35671:return j_;case 35668:case 35672:return K_;case 35669:case 35673:return Q_;case 5125:return ey;case 36294:return ty;case 36295:return ny;case 36296:return iy;case 35678:case 36198:case 36298:case 36306:case 35682:return sy;case 35679:case 36299:case 36307:return ry;case 35680:case 36300:case 36308:case 36293:return oy;case 36289:case 36303:case 36311:case 36292:return ay}}var cl=class{constructor(e,t,n){this.id=e,this.addr=n,this.cache=[],this.type=t.type,this.setValue=V_(t.type)}},ll=class{constructor(e,t,n){this.id=e,this.addr=n,this.cache=[],this.type=t.type,this.size=t.size,this.setValue=cy(t.type)}},hl=class{constructor(e){this.id=e,this.seq=[],this.map={}}setValue(e,t,n){let s=this.seq;for(let r=0,o=s.length;r!==o;++r){let a=s[r];a.setValue(e,t[a.id],n)}}},lc=/(\w+)(\])?(\[|\.)?/g;function cd(i,e){i.seq.push(e),i.map[e.id]=e}function ly(i,e,t){let n=i.name,s=n.length;for(lc.lastIndex=0;;){let r=lc.exec(n),o=lc.lastIndex,a=r[1],c=r[2]==="]",l=r[3];if(c&&(a=a|0),l===void 0||l==="["&&o+2===s){cd(t,l===void 0?new cl(a,i,e):new ll(a,i,e));break}else{let u=t.map[a];u===void 0&&(u=new hl(a),cd(t,u)),t=u}}}var os=class{constructor(e,t){this.seq=[],this.map={};let n=e.getProgramParameter(t,e.ACTIVE_UNIFORMS);for(let s=0;s<n;++s){let r=e.getActiveUniform(t,s),o=e.getUniformLocation(t,r.name);ly(r,o,this)}}setValue(e,t,n,s){let r=this.map[t];r!==void 0&&r.setValue(e,n,s)}setOptional(e,t,n){let s=t[n];s!==void 0&&this.setValue(e,n,s)}static upload(e,t,n,s){for(let r=0,o=t.length;r!==o;++r){let a=t[r],c=n[a.id];c.needsUpdate!==!1&&a.setValue(e,c.value,s)}}static seqWithValue(e,t){let n=[];for(let s=0,r=e.length;s!==r;++s){let o=e[s];o.id in t&&n.push(o)}return n}};function ld(i,e,t){let n=i.createShader(e);return i.shaderSource(n,t),i.compileShader(n),n}var hy=37297,uy=0;function dy(i,e){let t=i.split(`
`),n=[],s=Math.max(e-6,0),r=Math.min(e+6,t.length);for(let o=s;o<r;o++){let a=o+1;n.push(`${a===e?">":" "} ${a}: ${t[o]}`)}return n.join(`
`)}function fy(i){let e=ct.getPrimaries(ct.workingColorSpace),t=ct.getPrimaries(i),n;switch(e===t?n="":e===xo&&t===yo?n="LinearDisplayP3ToLinearSRGB":e===yo&&t===xo&&(n="LinearSRGBToLinearDisplayP3"),i){case oi:case jo:return[n,"LinearTransferOETF"];case Xt:case Kl:return[n,"sRGBTransferOETF"];default:return console.warn("THREE.WebGLProgram: Unsupported color space:",i),[n,"LinearTransferOETF"]}}function hd(i,e,t){let n=i.getShaderParameter(e,i.COMPILE_STATUS),s=i.getShaderInfoLog(e).trim();if(n&&s==="")return"";let r=/ERROR: 0:(\d+)/.exec(s);if(r){let o=parseInt(r[1]);return t.toUpperCase()+`

`+s+`

`+dy(i.getShaderSource(e),o)}else return s}function py(i,e){let t=fy(e);return`vec4 ${i}( vec4 value ) { return ${t[0]}( ${t[1]}( value ) ); }`}function my(i,e){let t;switch(e){case wp:t="Linear";break;case Cp:t="Reinhard";break;case Ap:t="Cineon";break;case Xl:t="ACESFilmic";break;case Pp:t="AgX";break;case Ip:t="Neutral";break;case Rp:t="Custom";break;default:console.warn("THREE.WebGLProgram: Unsupported toneMapping:",e),t="Linear"}return"vec3 "+i+"( vec3 color ) { return "+t+"ToneMapping( color ); }"}var Qr=new A;function gy(){ct.getLuminanceCoefficients(Qr);let i=Qr.x.toFixed(4),e=Qr.y.toFixed(4),t=Qr.z.toFixed(4);return["float luminance( const in vec3 rgb ) {",`	const vec3 weights = vec3( ${i}, ${e}, ${t} );`,"	return dot( weights, rgb );","}"].join(`
`)}function _y(i){return[i.extensionClipCullDistance?"#extension GL_ANGLE_clip_cull_distance : require":"",i.extensionMultiDraw?"#extension GL_ANGLE_multi_draw : require":""].filter(Vs).join(`
`)}function yy(i){let e=[];for(let t in i){let n=i[t];n!==!1&&e.push("#define "+t+" "+n)}return e.join(`
`)}function xy(i,e){let t={},n=i.getProgramParameter(e,i.ACTIVE_ATTRIBUTES);for(let s=0;s<n;s++){let r=i.getActiveAttrib(e,s),o=r.name,a=1;r.type===i.FLOAT_MAT2&&(a=2),r.type===i.FLOAT_MAT3&&(a=3),r.type===i.FLOAT_MAT4&&(a=4),t[o]={type:r.type,location:i.getAttribLocation(e,o),locationSize:a}}return t}function Vs(i){return i!==""}function ud(i,e){let t=e.numSpotLightShadows+e.numSpotLightMaps-e.numSpotLightShadowsWithMaps;return i.replace(/NUM_DIR_LIGHTS/g,e.numDirLights).replace(/NUM_SPOT_LIGHTS/g,e.numSpotLights).replace(/NUM_SPOT_LIGHT_MAPS/g,e.numSpotLightMaps).replace(/NUM_SPOT_LIGHT_COORDS/g,t).replace(/NUM_RECT_AREA_LIGHTS/g,e.numRectAreaLights).replace(/NUM_POINT_LIGHTS/g,e.numPointLights).replace(/NUM_HEMI_LIGHTS/g,e.numHemiLights).replace(/NUM_DIR_LIGHT_SHADOWS/g,e.numDirLightShadows).replace(/NUM_SPOT_LIGHT_SHADOWS_WITH_MAPS/g,e.numSpotLightShadowsWithMaps).replace(/NUM_SPOT_LIGHT_SHADOWS/g,e.numSpotLightShadows).replace(/NUM_POINT_LIGHT_SHADOWS/g,e.numPointLightShadows)}function dd(i,e){return i.replace(/NUM_CLIPPING_PLANES/g,e.numClippingPlanes).replace(/UNION_CLIPPING_PLANES/g,e.numClippingPlanes-e.numClipIntersection)}var vy=/^[ \t]*#include +<([\w\d./]+)>/gm;function ul(i){return i.replace(vy,by)}var My=new Map;function by(i,e){let t=Ze[e];if(t===void 0){let n=My.get(e);if(n!==void 0)t=Ze[n],console.warn('THREE.WebGLRenderer: Shader chunk "%s" has been deprecated. Use "%s" instead.',e,n);else throw new Error("Can not resolve #include <"+e+">")}return ul(t)}var Sy=/#pragma unroll_loop_start\s+for\s*\(\s*int\s+i\s*=\s*(\d+)\s*;\s*i\s*<\s*(\d+)\s*;\s*i\s*\+\+\s*\)\s*{([\s\S]+?)}\s+#pragma unroll_loop_end/g;function fd(i){return i.replace(Sy,Ey)}function Ey(i,e,t,n){let s="";for(let r=parseInt(e);r<parseInt(t);r++)s+=n.replace(/\[\s*i\s*\]/g,"[ "+r+" ]").replace(/UNROLLED_LOOP_INDEX/g,r);return s}function pd(i){let e=`precision ${i.precision} float;
	precision ${i.precision} int;
	precision ${i.precision} sampler2D;
	precision ${i.precision} samplerCube;
	precision ${i.precision} sampler3D;
	precision ${i.precision} sampler2DArray;
	precision ${i.precision} sampler2DShadow;
	precision ${i.precision} samplerCubeShadow;
	precision ${i.precision} sampler2DArrayShadow;
	precision ${i.precision} isampler2D;
	precision ${i.precision} isampler3D;
	precision ${i.precision} isamplerCube;
	precision ${i.precision} isampler2DArray;
	precision ${i.precision} usampler2D;
	precision ${i.precision} usampler3D;
	precision ${i.precision} usamplerCube;
	precision ${i.precision} usampler2DArray;
	`;return i.precision==="highp"?e+=`
#define HIGH_PRECISION`:i.precision==="mediump"?e+=`
#define MEDIUM_PRECISION`:i.precision==="lowp"&&(e+=`
#define LOW_PRECISION`),e}function Ty(i){let e="SHADOWMAP_TYPE_BASIC";return i.shadowMapType===Id?e="SHADOWMAP_TYPE_PCF":i.shadowMapType===Wl?e="SHADOWMAP_TYPE_PCF_SOFT":i.shadowMapType===On&&(e="SHADOWMAP_TYPE_VSM"),e}function wy(i){let e="ENVMAP_TYPE_CUBE";if(i.envMap)switch(i.envMapMode){case cs:case ls:e="ENVMAP_TYPE_CUBE";break;case Zo:e="ENVMAP_TYPE_CUBE_UV";break}return e}function Cy(i){let e="ENVMAP_MODE_REFLECTION";if(i.envMap)switch(i.envMapMode){case ls:e="ENVMAP_MODE_REFRACTION";break}return e}function Ay(i){let e="ENVMAP_BLENDING_NONE";if(i.envMap)switch(i.combine){case Ld:e="ENVMAP_BLENDING_MULTIPLY";break;case Ep:e="ENVMAP_BLENDING_MIX";break;case Tp:e="ENVMAP_BLENDING_ADD";break}return e}function Ry(i){let e=i.envMapCubeUVHeight;if(e===null)return null;let t=Math.log2(e)-2,n=1/e;return{texelWidth:1/(3*Math.max(Math.pow(2,t),7*16)),texelHeight:n,maxMip:t}}function Py(i,e,t,n){let s=i.getContext(),r=t.defines,o=t.vertexShader,a=t.fragmentShader,c=Ty(t),l=wy(t),h=Cy(t),u=Ay(t),d=Ry(t),f=_y(t),g=yy(r),y=s.createProgram(),m,p,b=t.glslVersion?"#version "+t.glslVersion+`
`:"";t.isRawShaderMaterial?(m=["#define SHADER_TYPE "+t.shaderType,"#define SHADER_NAME "+t.shaderName,g].filter(Vs).join(`
`),m.length>0&&(m+=`
`),p=["#define SHADER_TYPE "+t.shaderType,"#define SHADER_NAME "+t.shaderName,g].filter(Vs).join(`
`),p.length>0&&(p+=`
`)):(m=[pd(t),"#define SHADER_TYPE "+t.shaderType,"#define SHADER_NAME "+t.shaderName,g,t.extensionClipCullDistance?"#define USE_CLIP_DISTANCE":"",t.batching?"#define USE_BATCHING":"",t.batchingColor?"#define USE_BATCHING_COLOR":"",t.instancing?"#define USE_INSTANCING":"",t.instancingColor?"#define USE_INSTANCING_COLOR":"",t.instancingMorph?"#define USE_INSTANCING_MORPH":"",t.useFog&&t.fog?"#define USE_FOG":"",t.useFog&&t.fogExp2?"#define FOG_EXP2":"",t.map?"#define USE_MAP":"",t.envMap?"#define USE_ENVMAP":"",t.envMap?"#define "+h:"",t.lightMap?"#define USE_LIGHTMAP":"",t.aoMap?"#define USE_AOMAP":"",t.bumpMap?"#define USE_BUMPMAP":"",t.normalMap?"#define USE_NORMALMAP":"",t.normalMapObjectSpace?"#define USE_NORMALMAP_OBJECTSPACE":"",t.normalMapTangentSpace?"#define USE_NORMALMAP_TANGENTSPACE":"",t.displacementMap?"#define USE_DISPLACEMENTMAP":"",t.emissiveMap?"#define USE_EMISSIVEMAP":"",t.anisotropy?"#define USE_ANISOTROPY":"",t.anisotropyMap?"#define USE_ANISOTROPYMAP":"",t.clearcoatMap?"#define USE_CLEARCOATMAP":"",t.clearcoatRoughnessMap?"#define USE_CLEARCOAT_ROUGHNESSMAP":"",t.clearcoatNormalMap?"#define USE_CLEARCOAT_NORMALMAP":"",t.iridescenceMap?"#define USE_IRIDESCENCEMAP":"",t.iridescenceThicknessMap?"#define USE_IRIDESCENCE_THICKNESSMAP":"",t.specularMap?"#define USE_SPECULARMAP":"",t.specularColorMap?"#define USE_SPECULAR_COLORMAP":"",t.specularIntensityMap?"#define USE_SPECULAR_INTENSITYMAP":"",t.roughnessMap?"#define USE_ROUGHNESSMAP":"",t.metalnessMap?"#define USE_METALNESSMAP":"",t.alphaMap?"#define USE_ALPHAMAP":"",t.alphaHash?"#define USE_ALPHAHASH":"",t.transmission?"#define USE_TRANSMISSION":"",t.transmissionMap?"#define USE_TRANSMISSIONMAP":"",t.thicknessMap?"#define USE_THICKNESSMAP":"",t.sheenColorMap?"#define USE_SHEEN_COLORMAP":"",t.sheenRoughnessMap?"#define USE_SHEEN_ROUGHNESSMAP":"",t.mapUv?"#define MAP_UV "+t.mapUv:"",t.alphaMapUv?"#define ALPHAMAP_UV "+t.alphaMapUv:"",t.lightMapUv?"#define LIGHTMAP_UV "+t.lightMapUv:"",t.aoMapUv?"#define AOMAP_UV "+t.aoMapUv:"",t.emissiveMapUv?"#define EMISSIVEMAP_UV "+t.emissiveMapUv:"",t.bumpMapUv?"#define BUMPMAP_UV "+t.bumpMapUv:"",t.normalMapUv?"#define NORMALMAP_UV "+t.normalMapUv:"",t.displacementMapUv?"#define DISPLACEMENTMAP_UV "+t.displacementMapUv:"",t.metalnessMapUv?"#define METALNESSMAP_UV "+t.metalnessMapUv:"",t.roughnessMapUv?"#define ROUGHNESSMAP_UV "+t.roughnessMapUv:"",t.anisotropyMapUv?"#define ANISOTROPYMAP_UV "+t.anisotropyMapUv:"",t.clearcoatMapUv?"#define CLEARCOATMAP_UV "+t.clearcoatMapUv:"",t.clearcoatNormalMapUv?"#define CLEARCOAT_NORMALMAP_UV "+t.clearcoatNormalMapUv:"",t.clearcoatRoughnessMapUv?"#define CLEARCOAT_ROUGHNESSMAP_UV "+t.clearcoatRoughnessMapUv:"",t.iridescenceMapUv?"#define IRIDESCENCEMAP_UV "+t.iridescenceMapUv:"",t.iridescenceThicknessMapUv?"#define IRIDESCENCE_THICKNESSMAP_UV "+t.iridescenceThicknessMapUv:"",t.sheenColorMapUv?"#define SHEEN_COLORMAP_UV "+t.sheenColorMapUv:"",t.sheenRoughnessMapUv?"#define SHEEN_ROUGHNESSMAP_UV "+t.sheenRoughnessMapUv:"",t.specularMapUv?"#define SPECULARMAP_UV "+t.specularMapUv:"",t.specularColorMapUv?"#define SPECULAR_COLORMAP_UV "+t.specularColorMapUv:"",t.specularIntensityMapUv?"#define SPECULAR_INTENSITYMAP_UV "+t.specularIntensityMapUv:"",t.transmissionMapUv?"#define TRANSMISSIONMAP_UV "+t.transmissionMapUv:"",t.thicknessMapUv?"#define THICKNESSMAP_UV "+t.thicknessMapUv:"",t.vertexTangents&&t.flatShading===!1?"#define USE_TANGENT":"",t.vertexColors?"#define USE_COLOR":"",t.vertexAlphas?"#define USE_COLOR_ALPHA":"",t.vertexUv1s?"#define USE_UV1":"",t.vertexUv2s?"#define USE_UV2":"",t.vertexUv3s?"#define USE_UV3":"",t.pointsUvs?"#define USE_POINTS_UV":"",t.flatShading?"#define FLAT_SHADED":"",t.skinning?"#define USE_SKINNING":"",t.morphTargets?"#define USE_MORPHTARGETS":"",t.morphNormals&&t.flatShading===!1?"#define USE_MORPHNORMALS":"",t.morphColors?"#define USE_MORPHCOLORS":"",t.morphTargetsCount>0?"#define MORPHTARGETS_TEXTURE_STRIDE "+t.morphTextureStride:"",t.morphTargetsCount>0?"#define MORPHTARGETS_COUNT "+t.morphTargetsCount:"",t.doubleSided?"#define DOUBLE_SIDED":"",t.flipSided?"#define FLIP_SIDED":"",t.shadowMapEnabled?"#define USE_SHADOWMAP":"",t.shadowMapEnabled?"#define "+c:"",t.sizeAttenuation?"#define USE_SIZEATTENUATION":"",t.numLightProbes>0?"#define USE_LIGHT_PROBES":"",t.logarithmicDepthBuffer?"#define USE_LOGDEPTHBUF":"",t.reverseDepthBuffer?"#define USE_REVERSEDEPTHBUF":"","uniform mat4 modelMatrix;","uniform mat4 modelViewMatrix;","uniform mat4 projectionMatrix;","uniform mat4 viewMatrix;","uniform mat3 normalMatrix;","uniform vec3 cameraPosition;","uniform bool isOrthographic;","#ifdef USE_INSTANCING","	attribute mat4 instanceMatrix;","#endif","#ifdef USE_INSTANCING_COLOR","	attribute vec3 instanceColor;","#endif","#ifdef USE_INSTANCING_MORPH","	uniform sampler2D morphTexture;","#endif","attribute vec3 position;","attribute vec3 normal;","attribute vec2 uv;","#ifdef USE_UV1","	attribute vec2 uv1;","#endif","#ifdef USE_UV2","	attribute vec2 uv2;","#endif","#ifdef USE_UV3","	attribute vec2 uv3;","#endif","#ifdef USE_TANGENT","	attribute vec4 tangent;","#endif","#if defined( USE_COLOR_ALPHA )","	attribute vec4 color;","#elif defined( USE_COLOR )","	attribute vec3 color;","#endif","#ifdef USE_SKINNING","	attribute vec4 skinIndex;","	attribute vec4 skinWeight;","#endif",`
`].filter(Vs).join(`
`),p=[pd(t),"#define SHADER_TYPE "+t.shaderType,"#define SHADER_NAME "+t.shaderName,g,t.useFog&&t.fog?"#define USE_FOG":"",t.useFog&&t.fogExp2?"#define FOG_EXP2":"",t.alphaToCoverage?"#define ALPHA_TO_COVERAGE":"",t.map?"#define USE_MAP":"",t.matcap?"#define USE_MATCAP":"",t.envMap?"#define USE_ENVMAP":"",t.envMap?"#define "+l:"",t.envMap?"#define "+h:"",t.envMap?"#define "+u:"",d?"#define CUBEUV_TEXEL_WIDTH "+d.texelWidth:"",d?"#define CUBEUV_TEXEL_HEIGHT "+d.texelHeight:"",d?"#define CUBEUV_MAX_MIP "+d.maxMip+".0":"",t.lightMap?"#define USE_LIGHTMAP":"",t.aoMap?"#define USE_AOMAP":"",t.bumpMap?"#define USE_BUMPMAP":"",t.normalMap?"#define USE_NORMALMAP":"",t.normalMapObjectSpace?"#define USE_NORMALMAP_OBJECTSPACE":"",t.normalMapTangentSpace?"#define USE_NORMALMAP_TANGENTSPACE":"",t.emissiveMap?"#define USE_EMISSIVEMAP":"",t.anisotropy?"#define USE_ANISOTROPY":"",t.anisotropyMap?"#define USE_ANISOTROPYMAP":"",t.clearcoat?"#define USE_CLEARCOAT":"",t.clearcoatMap?"#define USE_CLEARCOATMAP":"",t.clearcoatRoughnessMap?"#define USE_CLEARCOAT_ROUGHNESSMAP":"",t.clearcoatNormalMap?"#define USE_CLEARCOAT_NORMALMAP":"",t.dispersion?"#define USE_DISPERSION":"",t.iridescence?"#define USE_IRIDESCENCE":"",t.iridescenceMap?"#define USE_IRIDESCENCEMAP":"",t.iridescenceThicknessMap?"#define USE_IRIDESCENCE_THICKNESSMAP":"",t.specularMap?"#define USE_SPECULARMAP":"",t.specularColorMap?"#define USE_SPECULAR_COLORMAP":"",t.specularIntensityMap?"#define USE_SPECULAR_INTENSITYMAP":"",t.roughnessMap?"#define USE_ROUGHNESSMAP":"",t.metalnessMap?"#define USE_METALNESSMAP":"",t.alphaMap?"#define USE_ALPHAMAP":"",t.alphaTest?"#define USE_ALPHATEST":"",t.alphaHash?"#define USE_ALPHAHASH":"",t.sheen?"#define USE_SHEEN":"",t.sheenColorMap?"#define USE_SHEEN_COLORMAP":"",t.sheenRoughnessMap?"#define USE_SHEEN_ROUGHNESSMAP":"",t.transmission?"#define USE_TRANSMISSION":"",t.transmissionMap?"#define USE_TRANSMISSIONMAP":"",t.thicknessMap?"#define USE_THICKNESSMAP":"",t.vertexTangents&&t.flatShading===!1?"#define USE_TANGENT":"",t.vertexColors||t.instancingColor||t.batchingColor?"#define USE_COLOR":"",t.vertexAlphas?"#define USE_COLOR_ALPHA":"",t.vertexUv1s?"#define USE_UV1":"",t.vertexUv2s?"#define USE_UV2":"",t.vertexUv3s?"#define USE_UV3":"",t.pointsUvs?"#define USE_POINTS_UV":"",t.gradientMap?"#define USE_GRADIENTMAP":"",t.flatShading?"#define FLAT_SHADED":"",t.doubleSided?"#define DOUBLE_SIDED":"",t.flipSided?"#define FLIP_SIDED":"",t.shadowMapEnabled?"#define USE_SHADOWMAP":"",t.shadowMapEnabled?"#define "+c:"",t.premultipliedAlpha?"#define PREMULTIPLIED_ALPHA":"",t.numLightProbes>0?"#define USE_LIGHT_PROBES":"",t.decodeVideoTexture?"#define DECODE_VIDEO_TEXTURE":"",t.logarithmicDepthBuffer?"#define USE_LOGDEPTHBUF":"",t.reverseDepthBuffer?"#define USE_REVERSEDEPTHBUF":"","uniform mat4 viewMatrix;","uniform vec3 cameraPosition;","uniform bool isOrthographic;",t.toneMapping!==ii?"#define TONE_MAPPING":"",t.toneMapping!==ii?Ze.tonemapping_pars_fragment:"",t.toneMapping!==ii?my("toneMapping",t.toneMapping):"",t.dithering?"#define DITHERING":"",t.opaque?"#define OPAQUE":"",Ze.colorspace_pars_fragment,py("linearToOutputTexel",t.outputColorSpace),gy(),t.useDepthPacking?"#define DEPTH_PACKING "+t.depthPacking:"",`
`].filter(Vs).join(`
`)),o=ul(o),o=ud(o,t),o=dd(o,t),a=ul(a),a=ud(a,t),a=dd(a,t),o=fd(o),a=fd(a),t.isRawShaderMaterial!==!0&&(b=`#version 300 es
`,m=[f,"#define attribute in","#define varying out","#define texture2D texture"].join(`
`)+`
`+m,p=["#define varying in",t.glslVersion===Iu?"":"layout(location = 0) out highp vec4 pc_fragColor;",t.glslVersion===Iu?"":"#define gl_FragColor pc_fragColor","#define gl_FragDepthEXT gl_FragDepth","#define texture2D texture","#define textureCube texture","#define texture2DProj textureProj","#define texture2DLodEXT textureLod","#define texture2DProjLodEXT textureProjLod","#define textureCubeLodEXT textureLod","#define texture2DGradEXT textureGrad","#define texture2DProjGradEXT textureProjGrad","#define textureCubeGradEXT textureGrad"].join(`
`)+`
`+p);let x=b+m+o,M=b+p+a,D=ld(s,s.VERTEX_SHADER,x),w=ld(s,s.FRAGMENT_SHADER,M);s.attachShader(y,D),s.attachShader(y,w),t.index0AttributeName!==void 0?s.bindAttribLocation(y,0,t.index0AttributeName):t.morphTargets===!0&&s.bindAttribLocation(y,0,"position"),s.linkProgram(y);function R(S){if(i.debug.checkShaderErrors){let z=s.getProgramInfoLog(y).trim(),I=s.getShaderInfoLog(D).trim(),k=s.getShaderInfoLog(w).trim(),K=!0,G=!0;if(s.getProgramParameter(y,s.LINK_STATUS)===!1)if(K=!1,typeof i.debug.onShaderError=="function")i.debug.onShaderError(s,y,D,w);else{let ce=hd(s,D,"vertex"),X=hd(s,w,"fragment");console.error("THREE.WebGLProgram: Shader Error "+s.getError()+" - VALIDATE_STATUS "+s.getProgramParameter(y,s.VALIDATE_STATUS)+`

Material Name: `+S.name+`
Material Type: `+S.type+`

Program Info Log: `+z+`
`+ce+`
`+X)}else z!==""?console.warn("THREE.WebGLProgram: Program Info Log:",z):(I===""||k==="")&&(G=!1);G&&(S.diagnostics={runnable:K,programLog:z,vertexShader:{log:I,prefix:m},fragmentShader:{log:k,prefix:p}})}s.deleteShader(D),s.deleteShader(w),P=new os(s,y),H=xy(s,y)}let P;this.getUniforms=function(){return P===void 0&&R(this),P};let H;this.getAttributes=function(){return H===void 0&&R(this),H};let _=t.rendererExtensionParallelShaderCompile===!1;return this.isReady=function(){return _===!1&&(_=s.getProgramParameter(y,hy)),_},this.destroy=function(){n.releaseStatesOfProgram(this),s.deleteProgram(y),this.program=void 0},this.type=t.shaderType,this.name=t.shaderName,this.id=uy++,this.cacheKey=e,this.usedTimes=1,this.program=y,this.vertexShader=D,this.fragmentShader=w,this}var Iy=0,dl=class{constructor(){this.shaderCache=new Map,this.materialCache=new Map}update(e){let t=e.vertexShader,n=e.fragmentShader,s=this._getShaderStage(t),r=this._getShaderStage(n),o=this._getShaderCacheForMaterial(e);return o.has(s)===!1&&(o.add(s),s.usedTimes++),o.has(r)===!1&&(o.add(r),r.usedTimes++),this}remove(e){let t=this.materialCache.get(e);for(let n of t)n.usedTimes--,n.usedTimes===0&&this.shaderCache.delete(n.code);return this.materialCache.delete(e),this}getVertexShaderID(e){return this._getShaderStage(e.vertexShader).id}getFragmentShaderID(e){return this._getShaderStage(e.fragmentShader).id}dispose(){this.shaderCache.clear(),this.materialCache.clear()}_getShaderCacheForMaterial(e){let t=this.materialCache,n=t.get(e);return n===void 0&&(n=new Set,t.set(e,n)),n}_getShaderStage(e){let t=this.shaderCache,n=t.get(e);return n===void 0&&(n=new fl(e),t.set(e,n)),n}},fl=class{constructor(e){this.id=Iy++,this.code=e,this.usedTimes=0}};function Ly(i,e,t,n,s,r,o){let a=new To,c=new dl,l=new Set,h=[],u=s.logarithmicDepthBuffer,d=s.reverseDepthBuffer,f=s.vertexTextures,g=s.precision,y={MeshDepthMaterial:"depth",MeshDistanceMaterial:"distanceRGBA",MeshNormalMaterial:"normal",MeshBasicMaterial:"basic",MeshLambertMaterial:"lambert",MeshPhongMaterial:"phong",MeshToonMaterial:"toon",MeshStandardMaterial:"physical",MeshPhysicalMaterial:"physical",MeshMatcapMaterial:"matcap",LineBasicMaterial:"basic",LineDashedMaterial:"dashed",PointsMaterial:"points",ShadowMaterial:"shadow",SpriteMaterial:"sprite"};function m(_){return l.add(_),_===0?"uv":`uv${_}`}function p(_,S,z,I,k){let K=I.fog,G=k.geometry,ce=_.isMeshStandardMaterial?I.environment:null,X=(_.isMeshStandardMaterial?t:e).get(_.envMap||ce),ve=X&&X.mapping===Zo?X.image.height:null,Me=y[_.type];_.precision!==null&&(g=s.getMaxPrecision(_.precision),g!==_.precision&&console.warn("THREE.WebGLProgram.getParameters:",_.precision,"not supported, using",g,"instead."));let Se=G.morphAttributes.position||G.morphAttributes.normal||G.morphAttributes.color,Ke=Se!==void 0?Se.length:0,nt=0;G.morphAttributes.position!==void 0&&(nt=1),G.morphAttributes.normal!==void 0&&(nt=2),G.morphAttributes.color!==void 0&&(nt=3);let J,oe,Re,me;if(Me){let Jt=En[Me];J=Jt.vertexShader,oe=Jt.fragmentShader}else J=_.vertexShader,oe=_.fragmentShader,c.update(_),Re=c.getVertexShaderID(_),me=c.getFragmentShaderID(_);let te=i.getRenderTarget(),xe=k.isInstancedMesh===!0,Ve=k.isBatchedMesh===!0,ze=!!_.map,ee=!!_.matcap,C=!!X,fe=!!_.aoMap,de=!!_.lightMap,ae=!!_.bumpMap,ge=!!_.normalMap,ke=!!_.displacementMap,be=!!_.emissiveMap,T=!!_.metalnessMap,v=!!_.roughnessMap,B=_.anisotropy>0,$=_.clearcoat>0,ne=_.dispersion>0,Z=_.iridescence>0,Le=_.sheen>0,_e=_.transmission>0,L=B&&!!_.anisotropyMap,q=$&&!!_.clearcoatMap,F=$&&!!_.clearcoatNormalMap,ie=$&&!!_.clearcoatRoughnessMap,Pe=Z&&!!_.iridescenceMap,Be=Z&&!!_.iridescenceThicknessMap,we=Le&&!!_.sheenColorMap,qe=Le&&!!_.sheenRoughnessMap,Ge=!!_.specularMap,st=!!_.specularColorMap,U=!!_.specularIntensityMap,Ce=_e&&!!_.transmissionMap,Y=_e&&!!_.thicknessMap,se=!!_.gradientMap,Ee=!!_.alphaMap,Ae=_.alphaTest>0,it=!!_.alphaHash,Tt=!!_.extensions,$t=ii;_.toneMapped&&(te===null||te.isXRRenderTarget===!0)&&($t=i.toneMapping);let rt={shaderID:Me,shaderType:_.type,shaderName:_.name,vertexShader:J,fragmentShader:oe,defines:_.defines,customVertexShaderID:Re,customFragmentShaderID:me,isRawShaderMaterial:_.isRawShaderMaterial===!0,glslVersion:_.glslVersion,precision:g,batching:Ve,batchingColor:Ve&&k._colorsTexture!==null,instancing:xe,instancingColor:xe&&k.instanceColor!==null,instancingMorph:xe&&k.morphTexture!==null,supportsVertexTextures:f,outputColorSpace:te===null?i.outputColorSpace:te.isXRRenderTarget===!0?te.texture.colorSpace:oi,alphaToCoverage:!!_.alphaToCoverage,map:ze,matcap:ee,envMap:C,envMapMode:C&&X.mapping,envMapCubeUVHeight:ve,aoMap:fe,lightMap:de,bumpMap:ae,normalMap:ge,displacementMap:f&&ke,emissiveMap:be,normalMapObjectSpace:ge&&_.normalMapType===Np,normalMapTangentSpace:ge&&_.normalMapType===Wd,metalnessMap:T,roughnessMap:v,anisotropy:B,anisotropyMap:L,clearcoat:$,clearcoatMap:q,clearcoatNormalMap:F,clearcoatRoughnessMap:ie,dispersion:ne,iridescence:Z,iridescenceMap:Pe,iridescenceThicknessMap:Be,sheen:Le,sheenColorMap:we,sheenRoughnessMap:qe,specularMap:Ge,specularColorMap:st,specularIntensityMap:U,transmission:_e,transmissionMap:Ce,thicknessMap:Y,gradientMap:se,opaque:_.transparent===!1&&_.blending===is&&_.alphaToCoverage===!1,alphaMap:Ee,alphaTest:Ae,alphaHash:it,combine:_.combine,mapUv:ze&&m(_.map.channel),aoMapUv:fe&&m(_.aoMap.channel),lightMapUv:de&&m(_.lightMap.channel),bumpMapUv:ae&&m(_.bumpMap.channel),normalMapUv:ge&&m(_.normalMap.channel),displacementMapUv:ke&&m(_.displacementMap.channel),emissiveMapUv:be&&m(_.emissiveMap.channel),metalnessMapUv:T&&m(_.metalnessMap.channel),roughnessMapUv:v&&m(_.roughnessMap.channel),anisotropyMapUv:L&&m(_.anisotropyMap.channel),clearcoatMapUv:q&&m(_.clearcoatMap.channel),clearcoatNormalMapUv:F&&m(_.clearcoatNormalMap.channel),clearcoatRoughnessMapUv:ie&&m(_.clearcoatRoughnessMap.channel),iridescenceMapUv:Pe&&m(_.iridescenceMap.channel),iridescenceThicknessMapUv:Be&&m(_.iridescenceThicknessMap.channel),sheenColorMapUv:we&&m(_.sheenColorMap.channel),sheenRoughnessMapUv:qe&&m(_.sheenRoughnessMap.channel),specularMapUv:Ge&&m(_.specularMap.channel),specularColorMapUv:st&&m(_.specularColorMap.channel),specularIntensityMapUv:U&&m(_.specularIntensityMap.channel),transmissionMapUv:Ce&&m(_.transmissionMap.channel),thicknessMapUv:Y&&m(_.thicknessMap.channel),alphaMapUv:Ee&&m(_.alphaMap.channel),vertexTangents:!!G.attributes.tangent&&(ge||B),vertexColors:_.vertexColors,vertexAlphas:_.vertexColors===!0&&!!G.attributes.color&&G.attributes.color.itemSize===4,pointsUvs:k.isPoints===!0&&!!G.attributes.uv&&(ze||Ee),fog:!!K,useFog:_.fog===!0,fogExp2:!!K&&K.isFogExp2,flatShading:_.flatShading===!0,sizeAttenuation:_.sizeAttenuation===!0,logarithmicDepthBuffer:u,reverseDepthBuffer:d,skinning:k.isSkinnedMesh===!0,morphTargets:G.morphAttributes.position!==void 0,morphNormals:G.morphAttributes.normal!==void 0,morphColors:G.morphAttributes.color!==void 0,morphTargetsCount:Ke,morphTextureStride:nt,numDirLights:S.directional.length,numPointLights:S.point.length,numSpotLights:S.spot.length,numSpotLightMaps:S.spotLightMap.length,numRectAreaLights:S.rectArea.length,numHemiLights:S.hemi.length,numDirLightShadows:S.directionalShadowMap.length,numPointLightShadows:S.pointShadowMap.length,numSpotLightShadows:S.spotShadowMap.length,numSpotLightShadowsWithMaps:S.numSpotLightShadowsWithMaps,numLightProbes:S.numLightProbes,numClippingPlanes:o.numPlanes,numClipIntersection:o.numIntersection,dithering:_.dithering,shadowMapEnabled:i.shadowMap.enabled&&z.length>0,shadowMapType:i.shadowMap.type,toneMapping:$t,decodeVideoTexture:ze&&_.map.isVideoTexture===!0&&ct.getTransfer(_.map.colorSpace)===gt,premultipliedAlpha:_.premultipliedAlpha,doubleSided:_.side===Bn,flipSided:_.side===Ht,useDepthPacking:_.depthPacking>=0,depthPacking:_.depthPacking||0,index0AttributeName:_.index0AttributeName,extensionClipCullDistance:Tt&&_.extensions.clipCullDistance===!0&&n.has("WEBGL_clip_cull_distance"),extensionMultiDraw:(Tt&&_.extensions.multiDraw===!0||Ve)&&n.has("WEBGL_multi_draw"),rendererExtensionParallelShaderCompile:n.has("KHR_parallel_shader_compile"),customProgramCacheKey:_.customProgramCacheKey()};return rt.vertexUv1s=l.has(1),rt.vertexUv2s=l.has(2),rt.vertexUv3s=l.has(3),l.clear(),rt}function b(_){let S=[];if(_.shaderID?S.push(_.shaderID):(S.push(_.customVertexShaderID),S.push(_.customFragmentShaderID)),_.defines!==void 0)for(let z in _.defines)S.push(z),S.push(_.defines[z]);return _.isRawShaderMaterial===!1&&(x(S,_),M(S,_),S.push(i.outputColorSpace)),S.push(_.customProgramCacheKey),S.join()}function x(_,S){_.push(S.precision),_.push(S.outputColorSpace),_.push(S.envMapMode),_.push(S.envMapCubeUVHeight),_.push(S.mapUv),_.push(S.alphaMapUv),_.push(S.lightMapUv),_.push(S.aoMapUv),_.push(S.bumpMapUv),_.push(S.normalMapUv),_.push(S.displacementMapUv),_.push(S.emissiveMapUv),_.push(S.metalnessMapUv),_.push(S.roughnessMapUv),_.push(S.anisotropyMapUv),_.push(S.clearcoatMapUv),_.push(S.clearcoatNormalMapUv),_.push(S.clearcoatRoughnessMapUv),_.push(S.iridescenceMapUv),_.push(S.iridescenceThicknessMapUv),_.push(S.sheenColorMapUv),_.push(S.sheenRoughnessMapUv),_.push(S.specularMapUv),_.push(S.specularColorMapUv),_.push(S.specularIntensityMapUv),_.push(S.transmissionMapUv),_.push(S.thicknessMapUv),_.push(S.combine),_.push(S.fogExp2),_.push(S.sizeAttenuation),_.push(S.morphTargetsCount),_.push(S.morphAttributeCount),_.push(S.numDirLights),_.push(S.numPointLights),_.push(S.numSpotLights),_.push(S.numSpotLightMaps),_.push(S.numHemiLights),_.push(S.numRectAreaLights),_.push(S.numDirLightShadows),_.push(S.numPointLightShadows),_.push(S.numSpotLightShadows),_.push(S.numSpotLightShadowsWithMaps),_.push(S.numLightProbes),_.push(S.shadowMapType),_.push(S.toneMapping),_.push(S.numClippingPlanes),_.push(S.numClipIntersection),_.push(S.depthPacking)}function M(_,S){a.disableAll(),S.supportsVertexTextures&&a.enable(0),S.instancing&&a.enable(1),S.instancingColor&&a.enable(2),S.instancingMorph&&a.enable(3),S.matcap&&a.enable(4),S.envMap&&a.enable(5),S.normalMapObjectSpace&&a.enable(6),S.normalMapTangentSpace&&a.enable(7),S.clearcoat&&a.enable(8),S.iridescence&&a.enable(9),S.alphaTest&&a.enable(10),S.vertexColors&&a.enable(11),S.vertexAlphas&&a.enable(12),S.vertexUv1s&&a.enable(13),S.vertexUv2s&&a.enable(14),S.vertexUv3s&&a.enable(15),S.vertexTangents&&a.enable(16),S.anisotropy&&a.enable(17),S.alphaHash&&a.enable(18),S.batching&&a.enable(19),S.dispersion&&a.enable(20),S.batchingColor&&a.enable(21),_.push(a.mask),a.disableAll(),S.fog&&a.enable(0),S.useFog&&a.enable(1),S.flatShading&&a.enable(2),S.logarithmicDepthBuffer&&a.enable(3),S.reverseDepthBuffer&&a.enable(4),S.skinning&&a.enable(5),S.morphTargets&&a.enable(6),S.morphNormals&&a.enable(7),S.morphColors&&a.enable(8),S.premultipliedAlpha&&a.enable(9),S.shadowMapEnabled&&a.enable(10),S.doubleSided&&a.enable(11),S.flipSided&&a.enable(12),S.useDepthPacking&&a.enable(13),S.dithering&&a.enable(14),S.transmission&&a.enable(15),S.sheen&&a.enable(16),S.opaque&&a.enable(17),S.pointsUvs&&a.enable(18),S.decodeVideoTexture&&a.enable(19),S.alphaToCoverage&&a.enable(20),_.push(a.mask)}function D(_){let S=y[_.type],z;if(S){let I=En[S];z=th.clone(I.uniforms)}else z=_.uniforms;return z}function w(_,S){let z;for(let I=0,k=h.length;I<k;I++){let K=h[I];if(K.cacheKey===S){z=K,++z.usedTimes;break}}return z===void 0&&(z=new Py(i,S,_,r),h.push(z)),z}function R(_){if(--_.usedTimes===0){let S=h.indexOf(_);h[S]=h[h.length-1],h.pop(),_.destroy()}}function P(_){c.remove(_)}function H(){c.dispose()}return{getParameters:p,getProgramCacheKey:b,getUniforms:D,acquireProgram:w,releaseProgram:R,releaseShaderCache:P,programs:h,dispose:H}}function Dy(){let i=new WeakMap;function e(o){return i.has(o)}function t(o){let a=i.get(o);return a===void 0&&(a={},i.set(o,a)),a}function n(o){i.delete(o)}function s(o,a,c){i.get(o)[a]=c}function r(){i=new WeakMap}return{has:e,get:t,remove:n,update:s,dispose:r}}function Uy(i,e){return i.groupOrder!==e.groupOrder?i.groupOrder-e.groupOrder:i.renderOrder!==e.renderOrder?i.renderOrder-e.renderOrder:i.material.id!==e.material.id?i.material.id-e.material.id:i.z!==e.z?i.z-e.z:i.id-e.id}function md(i,e){return i.groupOrder!==e.groupOrder?i.groupOrder-e.groupOrder:i.renderOrder!==e.renderOrder?i.renderOrder-e.renderOrder:i.z!==e.z?e.z-i.z:i.id-e.id}function gd(){let i=[],e=0,t=[],n=[],s=[];function r(){e=0,t.length=0,n.length=0,s.length=0}function o(u,d,f,g,y,m){let p=i[e];return p===void 0?(p={id:u.id,object:u,geometry:d,material:f,groupOrder:g,renderOrder:u.renderOrder,z:y,group:m},i[e]=p):(p.id=u.id,p.object=u,p.geometry=d,p.material=f,p.groupOrder=g,p.renderOrder=u.renderOrder,p.z=y,p.group=m),e++,p}function a(u,d,f,g,y,m){let p=o(u,d,f,g,y,m);f.transmission>0?n.push(p):f.transparent===!0?s.push(p):t.push(p)}function c(u,d,f,g,y,m){let p=o(u,d,f,g,y,m);f.transmission>0?n.unshift(p):f.transparent===!0?s.unshift(p):t.unshift(p)}function l(u,d){t.length>1&&t.sort(u||Uy),n.length>1&&n.sort(d||md),s.length>1&&s.sort(d||md)}function h(){for(let u=e,d=i.length;u<d;u++){let f=i[u];if(f.id===null)break;f.id=null,f.object=null,f.geometry=null,f.material=null,f.group=null}}return{opaque:t,transmissive:n,transparent:s,init:r,push:a,unshift:c,finish:h,sort:l}}function Ny(){let i=new WeakMap;function e(n,s){let r=i.get(n),o;return r===void 0?(o=new gd,i.set(n,[o])):s>=r.length?(o=new gd,r.push(o)):o=r[s],o}function t(){i=new WeakMap}return{get:e,dispose:t}}function ky(){let i={};return{get:function(e){if(i[e.id]!==void 0)return i[e.id];let t;switch(e.type){case"DirectionalLight":t={direction:new A,color:new Qe};break;case"SpotLight":t={position:new A,direction:new A,color:new Qe,distance:0,coneCos:0,penumbraCos:0,decay:0};break;case"PointLight":t={position:new A,color:new Qe,distance:0,decay:0};break;case"HemisphereLight":t={direction:new A,skyColor:new Qe,groundColor:new Qe};break;case"RectAreaLight":t={color:new Qe,position:new A,halfWidth:new A,halfHeight:new A};break}return i[e.id]=t,t}}}function Oy(){let i={};return{get:function(e){if(i[e.id]!==void 0)return i[e.id];let t;switch(e.type){case"DirectionalLight":t={shadowIntensity:1,shadowBias:0,shadowNormalBias:0,shadowRadius:1,shadowMapSize:new le};break;case"SpotLight":t={shadowIntensity:1,shadowBias:0,shadowNormalBias:0,shadowRadius:1,shadowMapSize:new le};break;case"PointLight":t={shadowIntensity:1,shadowBias:0,shadowNormalBias:0,shadowRadius:1,shadowMapSize:new le,shadowCameraNear:1,shadowCameraFar:1e3};break}return i[e.id]=t,t}}}var Fy=0;function By(i,e){return(e.castShadow?2:0)-(i.castShadow?2:0)+(e.map?1:0)-(i.map?1:0)}function zy(i){let e=new ky,t=Oy(),n={version:0,hash:{directionalLength:-1,pointLength:-1,spotLength:-1,rectAreaLength:-1,hemiLength:-1,numDirectionalShadows:-1,numPointShadows:-1,numSpotShadows:-1,numSpotMaps:-1,numLightProbes:-1},ambient:[0,0,0],probe:[],directional:[],directionalShadow:[],directionalShadowMap:[],directionalShadowMatrix:[],spot:[],spotLightMap:[],spotShadow:[],spotShadowMap:[],spotLightMatrix:[],rectArea:[],rectAreaLTC1:null,rectAreaLTC2:null,point:[],pointShadow:[],pointShadowMap:[],pointShadowMatrix:[],hemi:[],numSpotLightShadowsWithMaps:0,numLightProbes:0};for(let l=0;l<9;l++)n.probe.push(new A);let s=new A,r=new _t,o=new _t;function a(l){let h=0,u=0,d=0;for(let H=0;H<9;H++)n.probe[H].set(0,0,0);let f=0,g=0,y=0,m=0,p=0,b=0,x=0,M=0,D=0,w=0,R=0;l.sort(By);for(let H=0,_=l.length;H<_;H++){let S=l[H],z=S.color,I=S.intensity,k=S.distance,K=S.shadow&&S.shadow.map?S.shadow.map.texture:null;if(S.isAmbientLight)h+=z.r*I,u+=z.g*I,d+=z.b*I;else if(S.isLightProbe){for(let G=0;G<9;G++)n.probe[G].addScaledVector(S.sh.coefficients[G],I);R++}else if(S.isDirectionalLight){let G=e.get(S);if(G.color.copy(S.color).multiplyScalar(S.intensity),S.castShadow){let ce=S.shadow,X=t.get(S);X.shadowIntensity=ce.intensity,X.shadowBias=ce.bias,X.shadowNormalBias=ce.normalBias,X.shadowRadius=ce.radius,X.shadowMapSize=ce.mapSize,n.directionalShadow[f]=X,n.directionalShadowMap[f]=K,n.directionalShadowMatrix[f]=S.shadow.matrix,b++}n.directional[f]=G,f++}else if(S.isSpotLight){let G=e.get(S);G.position.setFromMatrixPosition(S.matrixWorld),G.color.copy(z).multiplyScalar(I),G.distance=k,G.coneCos=Math.cos(S.angle),G.penumbraCos=Math.cos(S.angle*(1-S.penumbra)),G.decay=S.decay,n.spot[y]=G;let ce=S.shadow;if(S.map&&(n.spotLightMap[D]=S.map,D++,ce.updateMatrices(S),S.castShadow&&w++),n.spotLightMatrix[y]=ce.matrix,S.castShadow){let X=t.get(S);X.shadowIntensity=ce.intensity,X.shadowBias=ce.bias,X.shadowNormalBias=ce.normalBias,X.shadowRadius=ce.radius,X.shadowMapSize=ce.mapSize,n.spotShadow[y]=X,n.spotShadowMap[y]=K,M++}y++}else if(S.isRectAreaLight){let G=e.get(S);G.color.copy(z).multiplyScalar(I),G.halfWidth.set(S.width*.5,0,0),G.halfHeight.set(0,S.height*.5,0),n.rectArea[m]=G,m++}else if(S.isPointLight){let G=e.get(S);if(G.color.copy(S.color).multiplyScalar(S.intensity),G.distance=S.distance,G.decay=S.decay,S.castShadow){let ce=S.shadow,X=t.get(S);X.shadowIntensity=ce.intensity,X.shadowBias=ce.bias,X.shadowNormalBias=ce.normalBias,X.shadowRadius=ce.radius,X.shadowMapSize=ce.mapSize,X.shadowCameraNear=ce.camera.near,X.shadowCameraFar=ce.camera.far,n.pointShadow[g]=X,n.pointShadowMap[g]=K,n.pointShadowMatrix[g]=S.shadow.matrix,x++}n.point[g]=G,g++}else if(S.isHemisphereLight){let G=e.get(S);G.skyColor.copy(S.color).multiplyScalar(I),G.groundColor.copy(S.groundColor).multiplyScalar(I),n.hemi[p]=G,p++}}m>0&&(i.has("OES_texture_float_linear")===!0?(n.rectAreaLTC1=ye.LTC_FLOAT_1,n.rectAreaLTC2=ye.LTC_FLOAT_2):(n.rectAreaLTC1=ye.LTC_HALF_1,n.rectAreaLTC2=ye.LTC_HALF_2)),n.ambient[0]=h,n.ambient[1]=u,n.ambient[2]=d;let P=n.hash;(P.directionalLength!==f||P.pointLength!==g||P.spotLength!==y||P.rectAreaLength!==m||P.hemiLength!==p||P.numDirectionalShadows!==b||P.numPointShadows!==x||P.numSpotShadows!==M||P.numSpotMaps!==D||P.numLightProbes!==R)&&(n.directional.length=f,n.spot.length=y,n.rectArea.length=m,n.point.length=g,n.hemi.length=p,n.directionalShadow.length=b,n.directionalShadowMap.length=b,n.pointShadow.length=x,n.pointShadowMap.length=x,n.spotShadow.length=M,n.spotShadowMap.length=M,n.directionalShadowMatrix.length=b,n.pointShadowMatrix.length=x,n.spotLightMatrix.length=M+D-w,n.spotLightMap.length=D,n.numSpotLightShadowsWithMaps=w,n.numLightProbes=R,P.directionalLength=f,P.pointLength=g,P.spotLength=y,P.rectAreaLength=m,P.hemiLength=p,P.numDirectionalShadows=b,P.numPointShadows=x,P.numSpotShadows=M,P.numSpotMaps=D,P.numLightProbes=R,n.version=Fy++)}function c(l,h){let u=0,d=0,f=0,g=0,y=0,m=h.matrixWorldInverse;for(let p=0,b=l.length;p<b;p++){let x=l[p];if(x.isDirectionalLight){let M=n.directional[u];M.direction.setFromMatrixPosition(x.matrixWorld),s.setFromMatrixPosition(x.target.matrixWorld),M.direction.sub(s),M.direction.transformDirection(m),u++}else if(x.isSpotLight){let M=n.spot[f];M.position.setFromMatrixPosition(x.matrixWorld),M.position.applyMatrix4(m),M.direction.setFromMatrixPosition(x.matrixWorld),s.setFromMatrixPosition(x.target.matrixWorld),M.direction.sub(s),M.direction.transformDirection(m),f++}else if(x.isRectAreaLight){let M=n.rectArea[g];M.position.setFromMatrixPosition(x.matrixWorld),M.position.applyMatrix4(m),o.identity(),r.copy(x.matrixWorld),r.premultiply(m),o.extractRotation(r),M.halfWidth.set(x.width*.5,0,0),M.halfHeight.set(0,x.height*.5,0),M.halfWidth.applyMatrix4(o),M.halfHeight.applyMatrix4(o),g++}else if(x.isPointLight){let M=n.point[d];M.position.setFromMatrixPosition(x.matrixWorld),M.position.applyMatrix4(m),d++}else if(x.isHemisphereLight){let M=n.hemi[y];M.direction.setFromMatrixPosition(x.matrixWorld),M.direction.transformDirection(m),y++}}}return{setup:a,setupView:c,state:n}}function _d(i){let e=new zy(i),t=[],n=[];function s(h){l.camera=h,t.length=0,n.length=0}function r(h){t.push(h)}function o(h){n.push(h)}function a(){e.setup(t)}function c(h){e.setupView(t,h)}let l={lightsArray:t,shadowsArray:n,camera:null,lights:e,transmissionRenderTarget:{}};return{init:s,state:l,setupLights:a,setupLightsView:c,pushLight:r,pushShadow:o}}function Hy(i){let e=new WeakMap;function t(s,r=0){let o=e.get(s),a;return o===void 0?(a=new _d(i),e.set(s,[a])):r>=o.length?(a=new _d(i),o.push(a)):a=o[r],a}function n(){e=new WeakMap}return{get:t,dispose:n}}var pl=class extends Wn{constructor(e){super(),this.isMeshDepthMaterial=!0,this.type="MeshDepthMaterial",this.depthPacking=Dp,this.map=null,this.alphaMap=null,this.displacementMap=null,this.displacementScale=1,this.displacementBias=0,this.wireframe=!1,this.wireframeLinewidth=1,this.setValues(e)}copy(e){return super.copy(e),this.depthPacking=e.depthPacking,this.map=e.map,this.alphaMap=e.alphaMap,this.displacementMap=e.displacementMap,this.displacementScale=e.displacementScale,this.displacementBias=e.displacementBias,this.wireframe=e.wireframe,this.wireframeLinewidth=e.wireframeLinewidth,this}},ml=class extends Wn{constructor(e){super(),this.isMeshDistanceMaterial=!0,this.type="MeshDistanceMaterial",this.map=null,this.alphaMap=null,this.displacementMap=null,this.displacementScale=1,this.displacementBias=0,this.setValues(e)}copy(e){return super.copy(e),this.map=e.map,this.alphaMap=e.alphaMap,this.displacementMap=e.displacementMap,this.displacementScale=e.displacementScale,this.displacementBias=e.displacementBias,this}},Vy=`void main() {
	gl_Position = vec4( position, 1.0 );
}`,Gy=`uniform sampler2D shadow_pass;
uniform vec2 resolution;
uniform float radius;
#include <packing>
void main() {
	const float samples = float( VSM_SAMPLES );
	float mean = 0.0;
	float squared_mean = 0.0;
	float uvStride = samples <= 1.0 ? 0.0 : 2.0 / ( samples - 1.0 );
	float uvStart = samples <= 1.0 ? 0.0 : - 1.0;
	for ( float i = 0.0; i < samples; i ++ ) {
		float uvOffset = uvStart + i * uvStride;
		#ifdef HORIZONTAL_PASS
			vec2 distribution = unpackRGBATo2Half( texture2D( shadow_pass, ( gl_FragCoord.xy + vec2( uvOffset, 0.0 ) * radius ) / resolution ) );
			mean += distribution.x;
			squared_mean += distribution.y * distribution.y + distribution.x * distribution.x;
		#else
			float depth = unpackRGBAToDepth( texture2D( shadow_pass, ( gl_FragCoord.xy + vec2( 0.0, uvOffset ) * radius ) / resolution ) );
			mean += depth;
			squared_mean += depth * depth;
		#endif
	}
	mean = mean / samples;
	squared_mean = squared_mean / samples;
	float std_dev = sqrt( squared_mean - mean * mean );
	gl_FragColor = pack2HalfToRGBA( vec2( mean, std_dev ) );
}`;function Wy(i,e,t){let n=new Ks,s=new le,r=new le,o=new ft,a=new pl({depthPacking:Up}),c=new ml,l={},h=t.maxTextureSize,u={[wn]:Ht,[Ht]:wn,[Bn]:Bn},d=new hn({defines:{VSM_SAMPLES:8},uniforms:{shadow_pass:{value:null},resolution:{value:new le},radius:{value:4}},vertexShader:Vy,fragmentShader:Gy}),f=d.clone();f.defines.HORIZONTAL_PASS=1;let g=new Dt;g.setAttribute("position",new tn(new Float32Array([-1,-1,.5,3,-1,.5,-1,3,.5]),3));let y=new tt(g,d),m=this;this.enabled=!1,this.autoUpdate=!0,this.needsUpdate=!1,this.type=Id;let p=this.type;this.render=function(w,R,P){if(m.enabled===!1||m.autoUpdate===!1&&m.needsUpdate===!1||w.length===0)return;let H=i.getRenderTarget(),_=i.getActiveCubeFace(),S=i.getActiveMipmapLevel(),z=i.state;z.setBlending(ni),z.buffers.color.setClear(1,1,1,1),z.buffers.depth.setTest(!0),z.setScissorTest(!1);let I=p!==On&&this.type===On,k=p===On&&this.type!==On;for(let K=0,G=w.length;K<G;K++){let ce=w[K],X=ce.shadow;if(X===void 0){console.warn("THREE.WebGLShadowMap:",ce,"has no shadow.");continue}if(X.autoUpdate===!1&&X.needsUpdate===!1)continue;s.copy(X.mapSize);let ve=X.getFrameExtents();if(s.multiply(ve),r.copy(X.mapSize),(s.x>h||s.y>h)&&(s.x>h&&(r.x=Math.floor(h/ve.x),s.x=r.x*ve.x,X.mapSize.x=r.x),s.y>h&&(r.y=Math.floor(h/ve.y),s.y=r.y*ve.y,X.mapSize.y=r.y)),X.map===null||I===!0||k===!0){let Se=this.type!==On?{minFilter:ln,magFilter:ln}:{};X.map!==null&&X.map.dispose(),X.map=new Gn(s.x,s.y,Se),X.map.texture.name=ce.name+".shadowMap",X.camera.updateProjectionMatrix()}i.setRenderTarget(X.map),i.clear();let Me=X.getViewportCount();for(let Se=0;Se<Me;Se++){let Ke=X.getViewport(Se);o.set(r.x*Ke.x,r.y*Ke.y,r.x*Ke.z,r.y*Ke.w),z.viewport(o),X.updateMatrices(ce,Se),n=X.getFrustum(),M(R,P,X.camera,ce,this.type)}X.isPointLightShadow!==!0&&this.type===On&&b(X,P),X.needsUpdate=!1}p=this.type,m.needsUpdate=!1,i.setRenderTarget(H,_,S)};function b(w,R){let P=e.update(y);d.defines.VSM_SAMPLES!==w.blurSamples&&(d.defines.VSM_SAMPLES=w.blurSamples,f.defines.VSM_SAMPLES=w.blurSamples,d.needsUpdate=!0,f.needsUpdate=!0),w.mapPass===null&&(w.mapPass=new Gn(s.x,s.y)),d.uniforms.shadow_pass.value=w.map.texture,d.uniforms.resolution.value=w.mapSize,d.uniforms.radius.value=w.radius,i.setRenderTarget(w.mapPass),i.clear(),i.renderBufferDirect(R,null,P,d,y,null),f.uniforms.shadow_pass.value=w.mapPass.texture,f.uniforms.resolution.value=w.mapSize,f.uniforms.radius.value=w.radius,i.setRenderTarget(w.map),i.clear(),i.renderBufferDirect(R,null,P,f,y,null)}function x(w,R,P,H){let _=null,S=P.isPointLight===!0?w.customDistanceMaterial:w.customDepthMaterial;if(S!==void 0)_=S;else if(_=P.isPointLight===!0?c:a,i.localClippingEnabled&&R.clipShadows===!0&&Array.isArray(R.clippingPlanes)&&R.clippingPlanes.length!==0||R.displacementMap&&R.displacementScale!==0||R.alphaMap&&R.alphaTest>0||R.map&&R.alphaTest>0){let z=_.uuid,I=R.uuid,k=l[z];k===void 0&&(k={},l[z]=k);let K=k[I];K===void 0&&(K=_.clone(),k[I]=K,R.addEventListener("dispose",D)),_=K}if(_.visible=R.visible,_.wireframe=R.wireframe,H===On?_.side=R.shadowSide!==null?R.shadowSide:R.side:_.side=R.shadowSide!==null?R.shadowSide:u[R.side],_.alphaMap=R.alphaMap,_.alphaTest=R.alphaTest,_.map=R.map,_.clipShadows=R.clipShadows,_.clippingPlanes=R.clippingPlanes,_.clipIntersection=R.clipIntersection,_.displacementMap=R.displacementMap,_.displacementScale=R.displacementScale,_.displacementBias=R.displacementBias,_.wireframeLinewidth=R.wireframeLinewidth,_.linewidth=R.linewidth,P.isPointLight===!0&&_.isMeshDistanceMaterial===!0){let z=i.properties.get(_);z.light=P}return _}function M(w,R,P,H,_){if(w.visible===!1)return;if(w.layers.test(R.layers)&&(w.isMesh||w.isLine||w.isPoints)&&(w.castShadow||w.receiveShadow&&_===On)&&(!w.frustumCulled||n.intersectsObject(w))){w.modelViewMatrix.multiplyMatrices(P.matrixWorldInverse,w.matrixWorld);let I=e.update(w),k=w.material;if(Array.isArray(k)){let K=I.groups;for(let G=0,ce=K.length;G<ce;G++){let X=K[G],ve=k[X.materialIndex];if(ve&&ve.visible){let Me=x(w,ve,H,_);w.onBeforeShadow(i,w,R,P,I,Me,X),i.renderBufferDirect(P,null,I,Me,w,X),w.onAfterShadow(i,w,R,P,I,Me,X)}}}else if(k.visible){let K=x(w,k,H,_);w.onBeforeShadow(i,w,R,P,I,K,null),i.renderBufferDirect(P,null,I,K,w,null),w.onAfterShadow(i,w,R,P,I,K,null)}}let z=w.children;for(let I=0,k=z.length;I<k;I++)M(z[I],R,P,H,_)}function D(w){w.target.removeEventListener("dispose",D);for(let P in l){let H=l[P],_=w.target.uuid;_ in H&&(H[_].dispose(),delete H[_])}}}var Xy={[xc]:vc,[Mc]:Ec,[bc]:Tc,[as]:Sc,[vc]:xc,[Ec]:Mc,[Tc]:bc,[Sc]:as};function qy(i){function e(){let U=!1,Ce=new ft,Y=null,se=new ft(0,0,0,0);return{setMask:function(Ee){Y!==Ee&&!U&&(i.colorMask(Ee,Ee,Ee,Ee),Y=Ee)},setLocked:function(Ee){U=Ee},setClear:function(Ee,Ae,it,Tt,$t){$t===!0&&(Ee*=Tt,Ae*=Tt,it*=Tt),Ce.set(Ee,Ae,it,Tt),se.equals(Ce)===!1&&(i.clearColor(Ee,Ae,it,Tt),se.copy(Ce))},reset:function(){U=!1,Y=null,se.set(-1,0,0,0)}}}function t(){let U=!1,Ce=!1,Y=null,se=null,Ee=null;return{setReversed:function(Ae){Ce=Ae},setTest:function(Ae){Ae?Re(i.DEPTH_TEST):me(i.DEPTH_TEST)},setMask:function(Ae){Y!==Ae&&!U&&(i.depthMask(Ae),Y=Ae)},setFunc:function(Ae){if(Ce&&(Ae=Xy[Ae]),se!==Ae){switch(Ae){case xc:i.depthFunc(i.NEVER);break;case vc:i.depthFunc(i.ALWAYS);break;case Mc:i.depthFunc(i.LESS);break;case as:i.depthFunc(i.LEQUAL);break;case bc:i.depthFunc(i.EQUAL);break;case Sc:i.depthFunc(i.GEQUAL);break;case Ec:i.depthFunc(i.GREATER);break;case Tc:i.depthFunc(i.NOTEQUAL);break;default:i.depthFunc(i.LEQUAL)}se=Ae}},setLocked:function(Ae){U=Ae},setClear:function(Ae){Ee!==Ae&&(i.clearDepth(Ae),Ee=Ae)},reset:function(){U=!1,Y=null,se=null,Ee=null}}}function n(){let U=!1,Ce=null,Y=null,se=null,Ee=null,Ae=null,it=null,Tt=null,$t=null;return{setTest:function(rt){U||(rt?Re(i.STENCIL_TEST):me(i.STENCIL_TEST))},setMask:function(rt){Ce!==rt&&!U&&(i.stencilMask(rt),Ce=rt)},setFunc:function(rt,Jt,In){(Y!==rt||se!==Jt||Ee!==In)&&(i.stencilFunc(rt,Jt,In),Y=rt,se=Jt,Ee=In)},setOp:function(rt,Jt,In){(Ae!==rt||it!==Jt||Tt!==In)&&(i.stencilOp(rt,Jt,In),Ae=rt,it=Jt,Tt=In)},setLocked:function(rt){U=rt},setClear:function(rt){$t!==rt&&(i.clearStencil(rt),$t=rt)},reset:function(){U=!1,Ce=null,Y=null,se=null,Ee=null,Ae=null,it=null,Tt=null,$t=null}}}let s=new e,r=new t,o=new n,a=new WeakMap,c=new WeakMap,l={},h={},u=new WeakMap,d=[],f=null,g=!1,y=null,m=null,p=null,b=null,x=null,M=null,D=null,w=new Qe(0,0,0),R=0,P=!1,H=null,_=null,S=null,z=null,I=null,k=i.getParameter(i.MAX_COMBINED_TEXTURE_IMAGE_UNITS),K=!1,G=0,ce=i.getParameter(i.VERSION);ce.indexOf("WebGL")!==-1?(G=parseFloat(/^WebGL (\d)/.exec(ce)[1]),K=G>=1):ce.indexOf("OpenGL ES")!==-1&&(G=parseFloat(/^OpenGL ES (\d)/.exec(ce)[1]),K=G>=2);let X=null,ve={},Me=i.getParameter(i.SCISSOR_BOX),Se=i.getParameter(i.VIEWPORT),Ke=new ft().fromArray(Me),nt=new ft().fromArray(Se);function J(U,Ce,Y,se){let Ee=new Uint8Array(4),Ae=i.createTexture();i.bindTexture(U,Ae),i.texParameteri(U,i.TEXTURE_MIN_FILTER,i.NEAREST),i.texParameteri(U,i.TEXTURE_MAG_FILTER,i.NEAREST);for(let it=0;it<Y;it++)U===i.TEXTURE_3D||U===i.TEXTURE_2D_ARRAY?i.texImage3D(Ce,0,i.RGBA,1,1,se,0,i.RGBA,i.UNSIGNED_BYTE,Ee):i.texImage2D(Ce+it,0,i.RGBA,1,1,0,i.RGBA,i.UNSIGNED_BYTE,Ee);return Ae}let oe={};oe[i.TEXTURE_2D]=J(i.TEXTURE_2D,i.TEXTURE_2D,1),oe[i.TEXTURE_CUBE_MAP]=J(i.TEXTURE_CUBE_MAP,i.TEXTURE_CUBE_MAP_POSITIVE_X,6),oe[i.TEXTURE_2D_ARRAY]=J(i.TEXTURE_2D_ARRAY,i.TEXTURE_2D_ARRAY,1,1),oe[i.TEXTURE_3D]=J(i.TEXTURE_3D,i.TEXTURE_3D,1,1),s.setClear(0,0,0,1),r.setClear(1),o.setClear(0),Re(i.DEPTH_TEST),r.setFunc(as),de(!1),ae(Su),Re(i.CULL_FACE),C(ni);function Re(U){l[U]!==!0&&(i.enable(U),l[U]=!0)}function me(U){l[U]!==!1&&(i.disable(U),l[U]=!1)}function te(U,Ce){return h[U]!==Ce?(i.bindFramebuffer(U,Ce),h[U]=Ce,U===i.DRAW_FRAMEBUFFER&&(h[i.FRAMEBUFFER]=Ce),U===i.FRAMEBUFFER&&(h[i.DRAW_FRAMEBUFFER]=Ce),!0):!1}function xe(U,Ce){let Y=d,se=!1;if(U){Y=u.get(Ce),Y===void 0&&(Y=[],u.set(Ce,Y));let Ee=U.textures;if(Y.length!==Ee.length||Y[0]!==i.COLOR_ATTACHMENT0){for(let Ae=0,it=Ee.length;Ae<it;Ae++)Y[Ae]=i.COLOR_ATTACHMENT0+Ae;Y.length=Ee.length,se=!0}}else Y[0]!==i.BACK&&(Y[0]=i.BACK,se=!0);se&&i.drawBuffers(Y)}function Ve(U){return f!==U?(i.useProgram(U),f=U,!0):!1}let ze={[yi]:i.FUNC_ADD,[ap]:i.FUNC_SUBTRACT,[cp]:i.FUNC_REVERSE_SUBTRACT};ze[lp]=i.MIN,ze[hp]=i.MAX;let ee={[up]:i.ZERO,[dp]:i.ONE,[fp]:i.SRC_COLOR,[_c]:i.SRC_ALPHA,[xp]:i.SRC_ALPHA_SATURATE,[_p]:i.DST_COLOR,[mp]:i.DST_ALPHA,[pp]:i.ONE_MINUS_SRC_COLOR,[yc]:i.ONE_MINUS_SRC_ALPHA,[yp]:i.ONE_MINUS_DST_COLOR,[gp]:i.ONE_MINUS_DST_ALPHA,[vp]:i.CONSTANT_COLOR,[Mp]:i.ONE_MINUS_CONSTANT_COLOR,[bp]:i.CONSTANT_ALPHA,[Sp]:i.ONE_MINUS_CONSTANT_ALPHA};function C(U,Ce,Y,se,Ee,Ae,it,Tt,$t,rt){if(U===ni){g===!0&&(me(i.BLEND),g=!1);return}if(g===!1&&(Re(i.BLEND),g=!0),U!==op){if(U!==y||rt!==P){if((m!==yi||x!==yi)&&(i.blendEquation(i.FUNC_ADD),m=yi,x=yi),rt)switch(U){case is:i.blendFuncSeparate(i.ONE,i.ONE_MINUS_SRC_ALPHA,i.ONE,i.ONE_MINUS_SRC_ALPHA);break;case Eu:i.blendFunc(i.ONE,i.ONE);break;case Tu:i.blendFuncSeparate(i.ZERO,i.ONE_MINUS_SRC_COLOR,i.ZERO,i.ONE);break;case wu:i.blendFuncSeparate(i.ZERO,i.SRC_COLOR,i.ZERO,i.SRC_ALPHA);break;default:console.error("THREE.WebGLState: Invalid blending: ",U);break}else switch(U){case is:i.blendFuncSeparate(i.SRC_ALPHA,i.ONE_MINUS_SRC_ALPHA,i.ONE,i.ONE_MINUS_SRC_ALPHA);break;case Eu:i.blendFunc(i.SRC_ALPHA,i.ONE);break;case Tu:i.blendFuncSeparate(i.ZERO,i.ONE_MINUS_SRC_COLOR,i.ZERO,i.ONE);break;case wu:i.blendFunc(i.ZERO,i.SRC_COLOR);break;default:console.error("THREE.WebGLState: Invalid blending: ",U);break}p=null,b=null,M=null,D=null,w.set(0,0,0),R=0,y=U,P=rt}return}Ee=Ee||Ce,Ae=Ae||Y,it=it||se,(Ce!==m||Ee!==x)&&(i.blendEquationSeparate(ze[Ce],ze[Ee]),m=Ce,x=Ee),(Y!==p||se!==b||Ae!==M||it!==D)&&(i.blendFuncSeparate(ee[Y],ee[se],ee[Ae],ee[it]),p=Y,b=se,M=Ae,D=it),(Tt.equals(w)===!1||$t!==R)&&(i.blendColor(Tt.r,Tt.g,Tt.b,$t),w.copy(Tt),R=$t),y=U,P=!1}function fe(U,Ce){U.side===Bn?me(i.CULL_FACE):Re(i.CULL_FACE);let Y=U.side===Ht;Ce&&(Y=!Y),de(Y),U.blending===is&&U.transparent===!1?C(ni):C(U.blending,U.blendEquation,U.blendSrc,U.blendDst,U.blendEquationAlpha,U.blendSrcAlpha,U.blendDstAlpha,U.blendColor,U.blendAlpha,U.premultipliedAlpha),r.setFunc(U.depthFunc),r.setTest(U.depthTest),r.setMask(U.depthWrite),s.setMask(U.colorWrite);let se=U.stencilWrite;o.setTest(se),se&&(o.setMask(U.stencilWriteMask),o.setFunc(U.stencilFunc,U.stencilRef,U.stencilFuncMask),o.setOp(U.stencilFail,U.stencilZFail,U.stencilZPass)),ke(U.polygonOffset,U.polygonOffsetFactor,U.polygonOffsetUnits),U.alphaToCoverage===!0?Re(i.SAMPLE_ALPHA_TO_COVERAGE):me(i.SAMPLE_ALPHA_TO_COVERAGE)}function de(U){H!==U&&(U?i.frontFace(i.CW):i.frontFace(i.CCW),H=U)}function ae(U){U!==sp?(Re(i.CULL_FACE),U!==_&&(U===Su?i.cullFace(i.BACK):U===rp?i.cullFace(i.FRONT):i.cullFace(i.FRONT_AND_BACK))):me(i.CULL_FACE),_=U}function ge(U){U!==S&&(K&&i.lineWidth(U),S=U)}function ke(U,Ce,Y){U?(Re(i.POLYGON_OFFSET_FILL),(z!==Ce||I!==Y)&&(i.polygonOffset(Ce,Y),z=Ce,I=Y)):me(i.POLYGON_OFFSET_FILL)}function be(U){U?Re(i.SCISSOR_TEST):me(i.SCISSOR_TEST)}function T(U){U===void 0&&(U=i.TEXTURE0+k-1),X!==U&&(i.activeTexture(U),X=U)}function v(U,Ce,Y){Y===void 0&&(X===null?Y=i.TEXTURE0+k-1:Y=X);let se=ve[Y];se===void 0&&(se={type:void 0,texture:void 0},ve[Y]=se),(se.type!==U||se.texture!==Ce)&&(X!==Y&&(i.activeTexture(Y),X=Y),i.bindTexture(U,Ce||oe[U]),se.type=U,se.texture=Ce)}function B(){let U=ve[X];U!==void 0&&U.type!==void 0&&(i.bindTexture(U.type,null),U.type=void 0,U.texture=void 0)}function $(){try{i.compressedTexImage2D.apply(i,arguments)}catch(U){console.error("THREE.WebGLState:",U)}}function ne(){try{i.compressedTexImage3D.apply(i,arguments)}catch(U){console.error("THREE.WebGLState:",U)}}function Z(){try{i.texSubImage2D.apply(i,arguments)}catch(U){console.error("THREE.WebGLState:",U)}}function Le(){try{i.texSubImage3D.apply(i,arguments)}catch(U){console.error("THREE.WebGLState:",U)}}function _e(){try{i.compressedTexSubImage2D.apply(i,arguments)}catch(U){console.error("THREE.WebGLState:",U)}}function L(){try{i.compressedTexSubImage3D.apply(i,arguments)}catch(U){console.error("THREE.WebGLState:",U)}}function q(){try{i.texStorage2D.apply(i,arguments)}catch(U){console.error("THREE.WebGLState:",U)}}function F(){try{i.texStorage3D.apply(i,arguments)}catch(U){console.error("THREE.WebGLState:",U)}}function ie(){try{i.texImage2D.apply(i,arguments)}catch(U){console.error("THREE.WebGLState:",U)}}function Pe(){try{i.texImage3D.apply(i,arguments)}catch(U){console.error("THREE.WebGLState:",U)}}function Be(U){Ke.equals(U)===!1&&(i.scissor(U.x,U.y,U.z,U.w),Ke.copy(U))}function we(U){nt.equals(U)===!1&&(i.viewport(U.x,U.y,U.z,U.w),nt.copy(U))}function qe(U,Ce){let Y=c.get(Ce);Y===void 0&&(Y=new WeakMap,c.set(Ce,Y));let se=Y.get(U);se===void 0&&(se=i.getUniformBlockIndex(Ce,U.name),Y.set(U,se))}function Ge(U,Ce){let se=c.get(Ce).get(U);a.get(Ce)!==se&&(i.uniformBlockBinding(Ce,se,U.__bindingPointIndex),a.set(Ce,se))}function st(){i.disable(i.BLEND),i.disable(i.CULL_FACE),i.disable(i.DEPTH_TEST),i.disable(i.POLYGON_OFFSET_FILL),i.disable(i.SCISSOR_TEST),i.disable(i.STENCIL_TEST),i.disable(i.SAMPLE_ALPHA_TO_COVERAGE),i.blendEquation(i.FUNC_ADD),i.blendFunc(i.ONE,i.ZERO),i.blendFuncSeparate(i.ONE,i.ZERO,i.ONE,i.ZERO),i.blendColor(0,0,0,0),i.colorMask(!0,!0,!0,!0),i.clearColor(0,0,0,0),i.depthMask(!0),i.depthFunc(i.LESS),i.clearDepth(1),i.stencilMask(4294967295),i.stencilFunc(i.ALWAYS,0,4294967295),i.stencilOp(i.KEEP,i.KEEP,i.KEEP),i.clearStencil(0),i.cullFace(i.BACK),i.frontFace(i.CCW),i.polygonOffset(0,0),i.activeTexture(i.TEXTURE0),i.bindFramebuffer(i.FRAMEBUFFER,null),i.bindFramebuffer(i.DRAW_FRAMEBUFFER,null),i.bindFramebuffer(i.READ_FRAMEBUFFER,null),i.useProgram(null),i.lineWidth(1),i.scissor(0,0,i.canvas.width,i.canvas.height),i.viewport(0,0,i.canvas.width,i.canvas.height),l={},X=null,ve={},h={},u=new WeakMap,d=[],f=null,g=!1,y=null,m=null,p=null,b=null,x=null,M=null,D=null,w=new Qe(0,0,0),R=0,P=!1,H=null,_=null,S=null,z=null,I=null,Ke.set(0,0,i.canvas.width,i.canvas.height),nt.set(0,0,i.canvas.width,i.canvas.height),s.reset(),r.reset(),o.reset()}return{buffers:{color:s,depth:r,stencil:o},enable:Re,disable:me,bindFramebuffer:te,drawBuffers:xe,useProgram:Ve,setBlending:C,setMaterial:fe,setFlipSided:de,setCullFace:ae,setLineWidth:ge,setPolygonOffset:ke,setScissorTest:be,activeTexture:T,bindTexture:v,unbindTexture:B,compressedTexImage2D:$,compressedTexImage3D:ne,texImage2D:ie,texImage3D:Pe,updateUBOMapping:qe,uniformBlockBinding:Ge,texStorage2D:q,texStorage3D:F,texSubImage2D:Z,texSubImage3D:Le,compressedTexSubImage2D:_e,compressedTexSubImage3D:L,scissor:Be,viewport:we,reset:st}}function yd(i,e,t,n){let s=Yy(n);switch(t){case Od:return i*e;case Bd:return i*e;case zd:return i*e*2;case Hd:return i*e/s.components*s.byteLength;case Jl:return i*e/s.components*s.byteLength;case Vd:return i*e*2/s.components*s.byteLength;case Zl:return i*e*2/s.components*s.byteLength;case Fd:return i*e*3/s.components*s.byteLength;case vn:return i*e*4/s.components*s.byteLength;case jl:return i*e*4/s.components*s.byteLength;case lo:case ho:return Math.floor((i+3)/4)*Math.floor((e+3)/4)*8;case uo:case fo:return Math.floor((i+3)/4)*Math.floor((e+3)/4)*16;case Pc:case Lc:return Math.max(i,16)*Math.max(e,8)/4;case Rc:case Ic:return Math.max(i,8)*Math.max(e,8)/2;case Dc:case Uc:return Math.floor((i+3)/4)*Math.floor((e+3)/4)*8;case Nc:return Math.floor((i+3)/4)*Math.floor((e+3)/4)*16;case kc:return Math.floor((i+3)/4)*Math.floor((e+3)/4)*16;case Oc:return Math.floor((i+4)/5)*Math.floor((e+3)/4)*16;case Fc:return Math.floor((i+4)/5)*Math.floor((e+4)/5)*16;case Bc:return Math.floor((i+5)/6)*Math.floor((e+4)/5)*16;case zc:return Math.floor((i+5)/6)*Math.floor((e+5)/6)*16;case Hc:return Math.floor((i+7)/8)*Math.floor((e+4)/5)*16;case Vc:return Math.floor((i+7)/8)*Math.floor((e+5)/6)*16;case Gc:return Math.floor((i+7)/8)*Math.floor((e+7)/8)*16;case Wc:return Math.floor((i+9)/10)*Math.floor((e+4)/5)*16;case Xc:return Math.floor((i+9)/10)*Math.floor((e+5)/6)*16;case qc:return Math.floor((i+9)/10)*Math.floor((e+7)/8)*16;case Yc:return Math.floor((i+9)/10)*Math.floor((e+9)/10)*16;case $c:return Math.floor((i+11)/12)*Math.floor((e+9)/10)*16;case Jc:return Math.floor((i+11)/12)*Math.floor((e+11)/12)*16;case po:case Zc:case jc:return Math.ceil(i/4)*Math.ceil(e/4)*16;case Gd:case Kc:return Math.ceil(i/4)*Math.ceil(e/4)*8;case Qc:case el:return Math.ceil(i/4)*Math.ceil(e/4)*16}throw new Error(`Unable to determine texture byte length for ${t} format.`)}function Yy(i){switch(i){case Vn:case Ud:return{byteLength:1,components:1};case Zs:case Nd:case hr:return{byteLength:2,components:1};case Yl:case $l:return{byteLength:2,components:4};case bi:case ql:case zn:return{byteLength:4,components:1};case kd:return{byteLength:4,components:3}}throw new Error(`Unknown texture type ${i}.`)}function $y(i,e,t,n,s,r,o){let a=e.has("WEBGL_multisampled_render_to_texture")?e.get("WEBGL_multisampled_render_to_texture"):null,c=typeof navigator=="undefined"?!1:/OculusBrowser/g.test(navigator.userAgent),l=new le,h=new WeakMap,u,d=new WeakMap,f=!1;try{f=typeof OffscreenCanvas!="undefined"&&new OffscreenCanvas(1,1).getContext("2d")!==null}catch{}function g(T,v){return f?new OffscreenCanvas(T,v):Mo("canvas")}function y(T,v,B){let $=1,ne=be(T);if((ne.width>B||ne.height>B)&&($=B/Math.max(ne.width,ne.height)),$<1)if(typeof HTMLImageElement!="undefined"&&T instanceof HTMLImageElement||typeof HTMLCanvasElement!="undefined"&&T instanceof HTMLCanvasElement||typeof ImageBitmap!="undefined"&&T instanceof ImageBitmap||typeof VideoFrame!="undefined"&&T instanceof VideoFrame){let Z=Math.floor($*ne.width),Le=Math.floor($*ne.height);u===void 0&&(u=g(Z,Le));let _e=v?g(Z,Le):u;return _e.width=Z,_e.height=Le,_e.getContext("2d").drawImage(T,0,0,Z,Le),console.warn("THREE.WebGLRenderer: Texture has been resized from ("+ne.width+"x"+ne.height+") to ("+Z+"x"+Le+")."),_e}else return"data"in T&&console.warn("THREE.WebGLRenderer: Image in DataTexture is too big ("+ne.width+"x"+ne.height+")."),T;return T}function m(T){return T.generateMipmaps&&T.minFilter!==ln&&T.minFilter!==yn}function p(T){i.generateMipmap(T)}function b(T,v,B,$,ne=!1){if(T!==null){if(i[T]!==void 0)return i[T];console.warn("THREE.WebGLRenderer: Attempt to use non-existing WebGL internal format '"+T+"'")}let Z=v;if(v===i.RED&&(B===i.FLOAT&&(Z=i.R32F),B===i.HALF_FLOAT&&(Z=i.R16F),B===i.UNSIGNED_BYTE&&(Z=i.R8)),v===i.RED_INTEGER&&(B===i.UNSIGNED_BYTE&&(Z=i.R8UI),B===i.UNSIGNED_SHORT&&(Z=i.R16UI),B===i.UNSIGNED_INT&&(Z=i.R32UI),B===i.BYTE&&(Z=i.R8I),B===i.SHORT&&(Z=i.R16I),B===i.INT&&(Z=i.R32I)),v===i.RG&&(B===i.FLOAT&&(Z=i.RG32F),B===i.HALF_FLOAT&&(Z=i.RG16F),B===i.UNSIGNED_BYTE&&(Z=i.RG8)),v===i.RG_INTEGER&&(B===i.UNSIGNED_BYTE&&(Z=i.RG8UI),B===i.UNSIGNED_SHORT&&(Z=i.RG16UI),B===i.UNSIGNED_INT&&(Z=i.RG32UI),B===i.BYTE&&(Z=i.RG8I),B===i.SHORT&&(Z=i.RG16I),B===i.INT&&(Z=i.RG32I)),v===i.RGB_INTEGER&&(B===i.UNSIGNED_BYTE&&(Z=i.RGB8UI),B===i.UNSIGNED_SHORT&&(Z=i.RGB16UI),B===i.UNSIGNED_INT&&(Z=i.RGB32UI),B===i.BYTE&&(Z=i.RGB8I),B===i.SHORT&&(Z=i.RGB16I),B===i.INT&&(Z=i.RGB32I)),v===i.RGBA_INTEGER&&(B===i.UNSIGNED_BYTE&&(Z=i.RGBA8UI),B===i.UNSIGNED_SHORT&&(Z=i.RGBA16UI),B===i.UNSIGNED_INT&&(Z=i.RGBA32UI),B===i.BYTE&&(Z=i.RGBA8I),B===i.SHORT&&(Z=i.RGBA16I),B===i.INT&&(Z=i.RGBA32I)),v===i.RGB&&B===i.UNSIGNED_INT_5_9_9_9_REV&&(Z=i.RGB9_E5),v===i.RGBA){let Le=ne?_o:ct.getTransfer($);B===i.FLOAT&&(Z=i.RGBA32F),B===i.HALF_FLOAT&&(Z=i.RGBA16F),B===i.UNSIGNED_BYTE&&(Z=Le===gt?i.SRGB8_ALPHA8:i.RGBA8),B===i.UNSIGNED_SHORT_4_4_4_4&&(Z=i.RGBA4),B===i.UNSIGNED_SHORT_5_5_5_1&&(Z=i.RGB5_A1)}return(Z===i.R16F||Z===i.R32F||Z===i.RG16F||Z===i.RG32F||Z===i.RGBA16F||Z===i.RGBA32F)&&e.get("EXT_color_buffer_float"),Z}function x(T,v){let B;return T?v===null||v===bi||v===hs?B=i.DEPTH24_STENCIL8:v===zn?B=i.DEPTH32F_STENCIL8:v===Zs&&(B=i.DEPTH24_STENCIL8,console.warn("DepthTexture: 16 bit depth attachment is not supported with stencil. Using 24-bit attachment.")):v===null||v===bi||v===hs?B=i.DEPTH_COMPONENT24:v===zn?B=i.DEPTH_COMPONENT32F:v===Zs&&(B=i.DEPTH_COMPONENT16),B}function M(T,v){return m(T)===!0||T.isFramebufferTexture&&T.minFilter!==ln&&T.minFilter!==yn?Math.log2(Math.max(v.width,v.height))+1:T.mipmaps!==void 0&&T.mipmaps.length>0?T.mipmaps.length:T.isCompressedTexture&&Array.isArray(T.image)?v.mipmaps.length:1}function D(T){let v=T.target;v.removeEventListener("dispose",D),R(v),v.isVideoTexture&&h.delete(v)}function w(T){let v=T.target;v.removeEventListener("dispose",w),H(v)}function R(T){let v=n.get(T);if(v.__webglInit===void 0)return;let B=T.source,$=d.get(B);if($){let ne=$[v.__cacheKey];ne.usedTimes--,ne.usedTimes===0&&P(T),Object.keys($).length===0&&d.delete(B)}n.remove(T)}function P(T){let v=n.get(T);i.deleteTexture(v.__webglTexture);let B=T.source,$=d.get(B);delete $[v.__cacheKey],o.memory.textures--}function H(T){let v=n.get(T);if(T.depthTexture&&T.depthTexture.dispose(),T.isWebGLCubeRenderTarget)for(let $=0;$<6;$++){if(Array.isArray(v.__webglFramebuffer[$]))for(let ne=0;ne<v.__webglFramebuffer[$].length;ne++)i.deleteFramebuffer(v.__webglFramebuffer[$][ne]);else i.deleteFramebuffer(v.__webglFramebuffer[$]);v.__webglDepthbuffer&&i.deleteRenderbuffer(v.__webglDepthbuffer[$])}else{if(Array.isArray(v.__webglFramebuffer))for(let $=0;$<v.__webglFramebuffer.length;$++)i.deleteFramebuffer(v.__webglFramebuffer[$]);else i.deleteFramebuffer(v.__webglFramebuffer);if(v.__webglDepthbuffer&&i.deleteRenderbuffer(v.__webglDepthbuffer),v.__webglMultisampledFramebuffer&&i.deleteFramebuffer(v.__webglMultisampledFramebuffer),v.__webglColorRenderbuffer)for(let $=0;$<v.__webglColorRenderbuffer.length;$++)v.__webglColorRenderbuffer[$]&&i.deleteRenderbuffer(v.__webglColorRenderbuffer[$]);v.__webglDepthRenderbuffer&&i.deleteRenderbuffer(v.__webglDepthRenderbuffer)}let B=T.textures;for(let $=0,ne=B.length;$<ne;$++){let Z=n.get(B[$]);Z.__webglTexture&&(i.deleteTexture(Z.__webglTexture),o.memory.textures--),n.remove(B[$])}n.remove(T)}let _=0;function S(){_=0}function z(){let T=_;return T>=s.maxTextures&&console.warn("THREE.WebGLTextures: Trying to use "+T+" texture units while this GPU supports only "+s.maxTextures),_+=1,T}function I(T){let v=[];return v.push(T.wrapS),v.push(T.wrapT),v.push(T.wrapR||0),v.push(T.magFilter),v.push(T.minFilter),v.push(T.anisotropy),v.push(T.internalFormat),v.push(T.format),v.push(T.type),v.push(T.generateMipmaps),v.push(T.premultiplyAlpha),v.push(T.flipY),v.push(T.unpackAlignment),v.push(T.colorSpace),v.join()}function k(T,v){let B=n.get(T);if(T.isVideoTexture&&ge(T),T.isRenderTargetTexture===!1&&T.version>0&&B.__version!==T.version){let $=T.image;if($===null)console.warn("THREE.WebGLRenderer: Texture marked for update but no image data found.");else if($.complete===!1)console.warn("THREE.WebGLRenderer: Texture marked for update but image is incomplete");else{nt(B,T,v);return}}t.bindTexture(i.TEXTURE_2D,B.__webglTexture,i.TEXTURE0+v)}function K(T,v){let B=n.get(T);if(T.version>0&&B.__version!==T.version){nt(B,T,v);return}t.bindTexture(i.TEXTURE_2D_ARRAY,B.__webglTexture,i.TEXTURE0+v)}function G(T,v){let B=n.get(T);if(T.version>0&&B.__version!==T.version){nt(B,T,v);return}t.bindTexture(i.TEXTURE_3D,B.__webglTexture,i.TEXTURE0+v)}function ce(T,v){let B=n.get(T);if(T.version>0&&B.__version!==T.version){J(B,T,v);return}t.bindTexture(i.TEXTURE_CUBE_MAP,B.__webglTexture,i.TEXTURE0+v)}let X={[Js]:i.REPEAT,[vi]:i.CLAMP_TO_EDGE,[Ac]:i.MIRRORED_REPEAT},ve={[ln]:i.NEAREST,[Lp]:i.NEAREST_MIPMAP_NEAREST,[Dr]:i.NEAREST_MIPMAP_LINEAR,[yn]:i.LINEAR,[Na]:i.LINEAR_MIPMAP_NEAREST,[Mi]:i.LINEAR_MIPMAP_LINEAR},Me={[kp]:i.NEVER,[Vp]:i.ALWAYS,[Op]:i.LESS,[Xd]:i.LEQUAL,[Fp]:i.EQUAL,[Hp]:i.GEQUAL,[Bp]:i.GREATER,[zp]:i.NOTEQUAL};function Se(T,v){if(v.type===zn&&e.has("OES_texture_float_linear")===!1&&(v.magFilter===yn||v.magFilter===Na||v.magFilter===Dr||v.magFilter===Mi||v.minFilter===yn||v.minFilter===Na||v.minFilter===Dr||v.minFilter===Mi)&&console.warn("THREE.WebGLRenderer: Unable to use linear filtering with floating point textures. OES_texture_float_linear not supported on this device."),i.texParameteri(T,i.TEXTURE_WRAP_S,X[v.wrapS]),i.texParameteri(T,i.TEXTURE_WRAP_T,X[v.wrapT]),(T===i.TEXTURE_3D||T===i.TEXTURE_2D_ARRAY)&&i.texParameteri(T,i.TEXTURE_WRAP_R,X[v.wrapR]),i.texParameteri(T,i.TEXTURE_MAG_FILTER,ve[v.magFilter]),i.texParameteri(T,i.TEXTURE_MIN_FILTER,ve[v.minFilter]),v.compareFunction&&(i.texParameteri(T,i.TEXTURE_COMPARE_MODE,i.COMPARE_REF_TO_TEXTURE),i.texParameteri(T,i.TEXTURE_COMPARE_FUNC,Me[v.compareFunction])),e.has("EXT_texture_filter_anisotropic")===!0){if(v.magFilter===ln||v.minFilter!==Dr&&v.minFilter!==Mi||v.type===zn&&e.has("OES_texture_float_linear")===!1)return;if(v.anisotropy>1||n.get(v).__currentAnisotropy){let B=e.get("EXT_texture_filter_anisotropic");i.texParameterf(T,B.TEXTURE_MAX_ANISOTROPY_EXT,Math.min(v.anisotropy,s.getMaxAnisotropy())),n.get(v).__currentAnisotropy=v.anisotropy}}}function Ke(T,v){let B=!1;T.__webglInit===void 0&&(T.__webglInit=!0,v.addEventListener("dispose",D));let $=v.source,ne=d.get($);ne===void 0&&(ne={},d.set($,ne));let Z=I(v);if(Z!==T.__cacheKey){ne[Z]===void 0&&(ne[Z]={texture:i.createTexture(),usedTimes:0},o.memory.textures++,B=!0),ne[Z].usedTimes++;let Le=ne[T.__cacheKey];Le!==void 0&&(ne[T.__cacheKey].usedTimes--,Le.usedTimes===0&&P(v)),T.__cacheKey=Z,T.__webglTexture=ne[Z].texture}return B}function nt(T,v,B){let $=i.TEXTURE_2D;(v.isDataArrayTexture||v.isCompressedArrayTexture)&&($=i.TEXTURE_2D_ARRAY),v.isData3DTexture&&($=i.TEXTURE_3D);let ne=Ke(T,v),Z=v.source;t.bindTexture($,T.__webglTexture,i.TEXTURE0+B);let Le=n.get(Z);if(Z.version!==Le.__version||ne===!0){t.activeTexture(i.TEXTURE0+B);let _e=ct.getPrimaries(ct.workingColorSpace),L=v.colorSpace===ei?null:ct.getPrimaries(v.colorSpace),q=v.colorSpace===ei||_e===L?i.NONE:i.BROWSER_DEFAULT_WEBGL;i.pixelStorei(i.UNPACK_FLIP_Y_WEBGL,v.flipY),i.pixelStorei(i.UNPACK_PREMULTIPLY_ALPHA_WEBGL,v.premultiplyAlpha),i.pixelStorei(i.UNPACK_ALIGNMENT,v.unpackAlignment),i.pixelStorei(i.UNPACK_COLORSPACE_CONVERSION_WEBGL,q);let F=y(v.image,!1,s.maxTextureSize);F=ke(v,F);let ie=r.convert(v.format,v.colorSpace),Pe=r.convert(v.type),Be=b(v.internalFormat,ie,Pe,v.colorSpace,v.isVideoTexture);Se($,v);let we,qe=v.mipmaps,Ge=v.isVideoTexture!==!0,st=Le.__version===void 0||ne===!0,U=Z.dataReady,Ce=M(v,F);if(v.isDepthTexture)Be=x(v.format===us,v.type),st&&(Ge?t.texStorage2D(i.TEXTURE_2D,1,Be,F.width,F.height):t.texImage2D(i.TEXTURE_2D,0,Be,F.width,F.height,0,ie,Pe,null));else if(v.isDataTexture)if(qe.length>0){Ge&&st&&t.texStorage2D(i.TEXTURE_2D,Ce,Be,qe[0].width,qe[0].height);for(let Y=0,se=qe.length;Y<se;Y++)we=qe[Y],Ge?U&&t.texSubImage2D(i.TEXTURE_2D,Y,0,0,we.width,we.height,ie,Pe,we.data):t.texImage2D(i.TEXTURE_2D,Y,Be,we.width,we.height,0,ie,Pe,we.data);v.generateMipmaps=!1}else Ge?(st&&t.texStorage2D(i.TEXTURE_2D,Ce,Be,F.width,F.height),U&&t.texSubImage2D(i.TEXTURE_2D,0,0,0,F.width,F.height,ie,Pe,F.data)):t.texImage2D(i.TEXTURE_2D,0,Be,F.width,F.height,0,ie,Pe,F.data);else if(v.isCompressedTexture)if(v.isCompressedArrayTexture){Ge&&st&&t.texStorage3D(i.TEXTURE_2D_ARRAY,Ce,Be,qe[0].width,qe[0].height,F.depth);for(let Y=0,se=qe.length;Y<se;Y++)if(we=qe[Y],v.format!==vn)if(ie!==null)if(Ge){if(U)if(v.layerUpdates.size>0){let Ee=yd(we.width,we.height,v.format,v.type);for(let Ae of v.layerUpdates){let it=we.data.subarray(Ae*Ee/we.data.BYTES_PER_ELEMENT,(Ae+1)*Ee/we.data.BYTES_PER_ELEMENT);t.compressedTexSubImage3D(i.TEXTURE_2D_ARRAY,Y,0,0,Ae,we.width,we.height,1,ie,it,0,0)}v.clearLayerUpdates()}else t.compressedTexSubImage3D(i.TEXTURE_2D_ARRAY,Y,0,0,0,we.width,we.height,F.depth,ie,we.data,0,0)}else t.compressedTexImage3D(i.TEXTURE_2D_ARRAY,Y,Be,we.width,we.height,F.depth,0,we.data,0,0);else console.warn("THREE.WebGLRenderer: Attempt to load unsupported compressed texture format in .uploadTexture()");else Ge?U&&t.texSubImage3D(i.TEXTURE_2D_ARRAY,Y,0,0,0,we.width,we.height,F.depth,ie,Pe,we.data):t.texImage3D(i.TEXTURE_2D_ARRAY,Y,Be,we.width,we.height,F.depth,0,ie,Pe,we.data)}else{Ge&&st&&t.texStorage2D(i.TEXTURE_2D,Ce,Be,qe[0].width,qe[0].height);for(let Y=0,se=qe.length;Y<se;Y++)we=qe[Y],v.format!==vn?ie!==null?Ge?U&&t.compressedTexSubImage2D(i.TEXTURE_2D,Y,0,0,we.width,we.height,ie,we.data):t.compressedTexImage2D(i.TEXTURE_2D,Y,Be,we.width,we.height,0,we.data):console.warn("THREE.WebGLRenderer: Attempt to load unsupported compressed texture format in .uploadTexture()"):Ge?U&&t.texSubImage2D(i.TEXTURE_2D,Y,0,0,we.width,we.height,ie,Pe,we.data):t.texImage2D(i.TEXTURE_2D,Y,Be,we.width,we.height,0,ie,Pe,we.data)}else if(v.isDataArrayTexture)if(Ge){if(st&&t.texStorage3D(i.TEXTURE_2D_ARRAY,Ce,Be,F.width,F.height,F.depth),U)if(v.layerUpdates.size>0){let Y=yd(F.width,F.height,v.format,v.type);for(let se of v.layerUpdates){let Ee=F.data.subarray(se*Y/F.data.BYTES_PER_ELEMENT,(se+1)*Y/F.data.BYTES_PER_ELEMENT);t.texSubImage3D(i.TEXTURE_2D_ARRAY,0,0,0,se,F.width,F.height,1,ie,Pe,Ee)}v.clearLayerUpdates()}else t.texSubImage3D(i.TEXTURE_2D_ARRAY,0,0,0,0,F.width,F.height,F.depth,ie,Pe,F.data)}else t.texImage3D(i.TEXTURE_2D_ARRAY,0,Be,F.width,F.height,F.depth,0,ie,Pe,F.data);else if(v.isData3DTexture)Ge?(st&&t.texStorage3D(i.TEXTURE_3D,Ce,Be,F.width,F.height,F.depth),U&&t.texSubImage3D(i.TEXTURE_3D,0,0,0,0,F.width,F.height,F.depth,ie,Pe,F.data)):t.texImage3D(i.TEXTURE_3D,0,Be,F.width,F.height,F.depth,0,ie,Pe,F.data);else if(v.isFramebufferTexture){if(st)if(Ge)t.texStorage2D(i.TEXTURE_2D,Ce,Be,F.width,F.height);else{let Y=F.width,se=F.height;for(let Ee=0;Ee<Ce;Ee++)t.texImage2D(i.TEXTURE_2D,Ee,Be,Y,se,0,ie,Pe,null),Y>>=1,se>>=1}}else if(qe.length>0){if(Ge&&st){let Y=be(qe[0]);t.texStorage2D(i.TEXTURE_2D,Ce,Be,Y.width,Y.height)}for(let Y=0,se=qe.length;Y<se;Y++)we=qe[Y],Ge?U&&t.texSubImage2D(i.TEXTURE_2D,Y,0,0,ie,Pe,we):t.texImage2D(i.TEXTURE_2D,Y,Be,ie,Pe,we);v.generateMipmaps=!1}else if(Ge){if(st){let Y=be(F);t.texStorage2D(i.TEXTURE_2D,Ce,Be,Y.width,Y.height)}U&&t.texSubImage2D(i.TEXTURE_2D,0,0,0,ie,Pe,F)}else t.texImage2D(i.TEXTURE_2D,0,Be,ie,Pe,F);m(v)&&p($),Le.__version=Z.version,v.onUpdate&&v.onUpdate(v)}T.__version=v.version}function J(T,v,B){if(v.image.length!==6)return;let $=Ke(T,v),ne=v.source;t.bindTexture(i.TEXTURE_CUBE_MAP,T.__webglTexture,i.TEXTURE0+B);let Z=n.get(ne);if(ne.version!==Z.__version||$===!0){t.activeTexture(i.TEXTURE0+B);let Le=ct.getPrimaries(ct.workingColorSpace),_e=v.colorSpace===ei?null:ct.getPrimaries(v.colorSpace),L=v.colorSpace===ei||Le===_e?i.NONE:i.BROWSER_DEFAULT_WEBGL;i.pixelStorei(i.UNPACK_FLIP_Y_WEBGL,v.flipY),i.pixelStorei(i.UNPACK_PREMULTIPLY_ALPHA_WEBGL,v.premultiplyAlpha),i.pixelStorei(i.UNPACK_ALIGNMENT,v.unpackAlignment),i.pixelStorei(i.UNPACK_COLORSPACE_CONVERSION_WEBGL,L);let q=v.isCompressedTexture||v.image[0].isCompressedTexture,F=v.image[0]&&v.image[0].isDataTexture,ie=[];for(let se=0;se<6;se++)!q&&!F?ie[se]=y(v.image[se],!0,s.maxCubemapSize):ie[se]=F?v.image[se].image:v.image[se],ie[se]=ke(v,ie[se]);let Pe=ie[0],Be=r.convert(v.format,v.colorSpace),we=r.convert(v.type),qe=b(v.internalFormat,Be,we,v.colorSpace),Ge=v.isVideoTexture!==!0,st=Z.__version===void 0||$===!0,U=ne.dataReady,Ce=M(v,Pe);Se(i.TEXTURE_CUBE_MAP,v);let Y;if(q){Ge&&st&&t.texStorage2D(i.TEXTURE_CUBE_MAP,Ce,qe,Pe.width,Pe.height);for(let se=0;se<6;se++){Y=ie[se].mipmaps;for(let Ee=0;Ee<Y.length;Ee++){let Ae=Y[Ee];v.format!==vn?Be!==null?Ge?U&&t.compressedTexSubImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+se,Ee,0,0,Ae.width,Ae.height,Be,Ae.data):t.compressedTexImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+se,Ee,qe,Ae.width,Ae.height,0,Ae.data):console.warn("THREE.WebGLRenderer: Attempt to load unsupported compressed texture format in .setTextureCube()"):Ge?U&&t.texSubImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+se,Ee,0,0,Ae.width,Ae.height,Be,we,Ae.data):t.texImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+se,Ee,qe,Ae.width,Ae.height,0,Be,we,Ae.data)}}}else{if(Y=v.mipmaps,Ge&&st){Y.length>0&&Ce++;let se=be(ie[0]);t.texStorage2D(i.TEXTURE_CUBE_MAP,Ce,qe,se.width,se.height)}for(let se=0;se<6;se++)if(F){Ge?U&&t.texSubImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+se,0,0,0,ie[se].width,ie[se].height,Be,we,ie[se].data):t.texImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+se,0,qe,ie[se].width,ie[se].height,0,Be,we,ie[se].data);for(let Ee=0;Ee<Y.length;Ee++){let it=Y[Ee].image[se].image;Ge?U&&t.texSubImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+se,Ee+1,0,0,it.width,it.height,Be,we,it.data):t.texImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+se,Ee+1,qe,it.width,it.height,0,Be,we,it.data)}}else{Ge?U&&t.texSubImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+se,0,0,0,Be,we,ie[se]):t.texImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+se,0,qe,Be,we,ie[se]);for(let Ee=0;Ee<Y.length;Ee++){let Ae=Y[Ee];Ge?U&&t.texSubImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+se,Ee+1,0,0,Be,we,Ae.image[se]):t.texImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+se,Ee+1,qe,Be,we,Ae.image[se])}}}m(v)&&p(i.TEXTURE_CUBE_MAP),Z.__version=ne.version,v.onUpdate&&v.onUpdate(v)}T.__version=v.version}function oe(T,v,B,$,ne,Z){let Le=r.convert(B.format,B.colorSpace),_e=r.convert(B.type),L=b(B.internalFormat,Le,_e,B.colorSpace);if(!n.get(v).__hasExternalTextures){let F=Math.max(1,v.width>>Z),ie=Math.max(1,v.height>>Z);ne===i.TEXTURE_3D||ne===i.TEXTURE_2D_ARRAY?t.texImage3D(ne,Z,L,F,ie,v.depth,0,Le,_e,null):t.texImage2D(ne,Z,L,F,ie,0,Le,_e,null)}t.bindFramebuffer(i.FRAMEBUFFER,T),ae(v)?a.framebufferTexture2DMultisampleEXT(i.FRAMEBUFFER,$,ne,n.get(B).__webglTexture,0,de(v)):(ne===i.TEXTURE_2D||ne>=i.TEXTURE_CUBE_MAP_POSITIVE_X&&ne<=i.TEXTURE_CUBE_MAP_NEGATIVE_Z)&&i.framebufferTexture2D(i.FRAMEBUFFER,$,ne,n.get(B).__webglTexture,Z),t.bindFramebuffer(i.FRAMEBUFFER,null)}function Re(T,v,B){if(i.bindRenderbuffer(i.RENDERBUFFER,T),v.depthBuffer){let $=v.depthTexture,ne=$&&$.isDepthTexture?$.type:null,Z=x(v.stencilBuffer,ne),Le=v.stencilBuffer?i.DEPTH_STENCIL_ATTACHMENT:i.DEPTH_ATTACHMENT,_e=de(v);ae(v)?a.renderbufferStorageMultisampleEXT(i.RENDERBUFFER,_e,Z,v.width,v.height):B?i.renderbufferStorageMultisample(i.RENDERBUFFER,_e,Z,v.width,v.height):i.renderbufferStorage(i.RENDERBUFFER,Z,v.width,v.height),i.framebufferRenderbuffer(i.FRAMEBUFFER,Le,i.RENDERBUFFER,T)}else{let $=v.textures;for(let ne=0;ne<$.length;ne++){let Z=$[ne],Le=r.convert(Z.format,Z.colorSpace),_e=r.convert(Z.type),L=b(Z.internalFormat,Le,_e,Z.colorSpace),q=de(v);B&&ae(v)===!1?i.renderbufferStorageMultisample(i.RENDERBUFFER,q,L,v.width,v.height):ae(v)?a.renderbufferStorageMultisampleEXT(i.RENDERBUFFER,q,L,v.width,v.height):i.renderbufferStorage(i.RENDERBUFFER,L,v.width,v.height)}}i.bindRenderbuffer(i.RENDERBUFFER,null)}function me(T,v){if(v&&v.isWebGLCubeRenderTarget)throw new Error("Depth Texture with cube render targets is not supported");if(t.bindFramebuffer(i.FRAMEBUFFER,T),!(v.depthTexture&&v.depthTexture.isDepthTexture))throw new Error("renderTarget.depthTexture must be an instance of THREE.DepthTexture");(!n.get(v.depthTexture).__webglTexture||v.depthTexture.image.width!==v.width||v.depthTexture.image.height!==v.height)&&(v.depthTexture.image.width=v.width,v.depthTexture.image.height=v.height,v.depthTexture.needsUpdate=!0),k(v.depthTexture,0);let $=n.get(v.depthTexture).__webglTexture,ne=de(v);if(v.depthTexture.format===ss)ae(v)?a.framebufferTexture2DMultisampleEXT(i.FRAMEBUFFER,i.DEPTH_ATTACHMENT,i.TEXTURE_2D,$,0,ne):i.framebufferTexture2D(i.FRAMEBUFFER,i.DEPTH_ATTACHMENT,i.TEXTURE_2D,$,0);else if(v.depthTexture.format===us)ae(v)?a.framebufferTexture2DMultisampleEXT(i.FRAMEBUFFER,i.DEPTH_STENCIL_ATTACHMENT,i.TEXTURE_2D,$,0,ne):i.framebufferTexture2D(i.FRAMEBUFFER,i.DEPTH_STENCIL_ATTACHMENT,i.TEXTURE_2D,$,0);else throw new Error("Unknown depthTexture format")}function te(T){let v=n.get(T),B=T.isWebGLCubeRenderTarget===!0;if(v.__boundDepthTexture!==T.depthTexture){let $=T.depthTexture;if(v.__depthDisposeCallback&&v.__depthDisposeCallback(),$){let ne=()=>{delete v.__boundDepthTexture,delete v.__depthDisposeCallback,$.removeEventListener("dispose",ne)};$.addEventListener("dispose",ne),v.__depthDisposeCallback=ne}v.__boundDepthTexture=$}if(T.depthTexture&&!v.__autoAllocateDepthBuffer){if(B)throw new Error("target.depthTexture not supported in Cube render targets");me(v.__webglFramebuffer,T)}else if(B){v.__webglDepthbuffer=[];for(let $=0;$<6;$++)if(t.bindFramebuffer(i.FRAMEBUFFER,v.__webglFramebuffer[$]),v.__webglDepthbuffer[$]===void 0)v.__webglDepthbuffer[$]=i.createRenderbuffer(),Re(v.__webglDepthbuffer[$],T,!1);else{let ne=T.stencilBuffer?i.DEPTH_STENCIL_ATTACHMENT:i.DEPTH_ATTACHMENT,Z=v.__webglDepthbuffer[$];i.bindRenderbuffer(i.RENDERBUFFER,Z),i.framebufferRenderbuffer(i.FRAMEBUFFER,ne,i.RENDERBUFFER,Z)}}else if(t.bindFramebuffer(i.FRAMEBUFFER,v.__webglFramebuffer),v.__webglDepthbuffer===void 0)v.__webglDepthbuffer=i.createRenderbuffer(),Re(v.__webglDepthbuffer,T,!1);else{let $=T.stencilBuffer?i.DEPTH_STENCIL_ATTACHMENT:i.DEPTH_ATTACHMENT,ne=v.__webglDepthbuffer;i.bindRenderbuffer(i.RENDERBUFFER,ne),i.framebufferRenderbuffer(i.FRAMEBUFFER,$,i.RENDERBUFFER,ne)}t.bindFramebuffer(i.FRAMEBUFFER,null)}function xe(T,v,B){let $=n.get(T);v!==void 0&&oe($.__webglFramebuffer,T,T.texture,i.COLOR_ATTACHMENT0,i.TEXTURE_2D,0),B!==void 0&&te(T)}function Ve(T){let v=T.texture,B=n.get(T),$=n.get(v);T.addEventListener("dispose",w);let ne=T.textures,Z=T.isWebGLCubeRenderTarget===!0,Le=ne.length>1;if(Le||($.__webglTexture===void 0&&($.__webglTexture=i.createTexture()),$.__version=v.version,o.memory.textures++),Z){B.__webglFramebuffer=[];for(let _e=0;_e<6;_e++)if(v.mipmaps&&v.mipmaps.length>0){B.__webglFramebuffer[_e]=[];for(let L=0;L<v.mipmaps.length;L++)B.__webglFramebuffer[_e][L]=i.createFramebuffer()}else B.__webglFramebuffer[_e]=i.createFramebuffer()}else{if(v.mipmaps&&v.mipmaps.length>0){B.__webglFramebuffer=[];for(let _e=0;_e<v.mipmaps.length;_e++)B.__webglFramebuffer[_e]=i.createFramebuffer()}else B.__webglFramebuffer=i.createFramebuffer();if(Le)for(let _e=0,L=ne.length;_e<L;_e++){let q=n.get(ne[_e]);q.__webglTexture===void 0&&(q.__webglTexture=i.createTexture(),o.memory.textures++)}if(T.samples>0&&ae(T)===!1){B.__webglMultisampledFramebuffer=i.createFramebuffer(),B.__webglColorRenderbuffer=[],t.bindFramebuffer(i.FRAMEBUFFER,B.__webglMultisampledFramebuffer);for(let _e=0;_e<ne.length;_e++){let L=ne[_e];B.__webglColorRenderbuffer[_e]=i.createRenderbuffer(),i.bindRenderbuffer(i.RENDERBUFFER,B.__webglColorRenderbuffer[_e]);let q=r.convert(L.format,L.colorSpace),F=r.convert(L.type),ie=b(L.internalFormat,q,F,L.colorSpace,T.isXRRenderTarget===!0),Pe=de(T);i.renderbufferStorageMultisample(i.RENDERBUFFER,Pe,ie,T.width,T.height),i.framebufferRenderbuffer(i.FRAMEBUFFER,i.COLOR_ATTACHMENT0+_e,i.RENDERBUFFER,B.__webglColorRenderbuffer[_e])}i.bindRenderbuffer(i.RENDERBUFFER,null),T.depthBuffer&&(B.__webglDepthRenderbuffer=i.createRenderbuffer(),Re(B.__webglDepthRenderbuffer,T,!0)),t.bindFramebuffer(i.FRAMEBUFFER,null)}}if(Z){t.bindTexture(i.TEXTURE_CUBE_MAP,$.__webglTexture),Se(i.TEXTURE_CUBE_MAP,v);for(let _e=0;_e<6;_e++)if(v.mipmaps&&v.mipmaps.length>0)for(let L=0;L<v.mipmaps.length;L++)oe(B.__webglFramebuffer[_e][L],T,v,i.COLOR_ATTACHMENT0,i.TEXTURE_CUBE_MAP_POSITIVE_X+_e,L);else oe(B.__webglFramebuffer[_e],T,v,i.COLOR_ATTACHMENT0,i.TEXTURE_CUBE_MAP_POSITIVE_X+_e,0);m(v)&&p(i.TEXTURE_CUBE_MAP),t.unbindTexture()}else if(Le){for(let _e=0,L=ne.length;_e<L;_e++){let q=ne[_e],F=n.get(q);t.bindTexture(i.TEXTURE_2D,F.__webglTexture),Se(i.TEXTURE_2D,q),oe(B.__webglFramebuffer,T,q,i.COLOR_ATTACHMENT0+_e,i.TEXTURE_2D,0),m(q)&&p(i.TEXTURE_2D)}t.unbindTexture()}else{let _e=i.TEXTURE_2D;if((T.isWebGL3DRenderTarget||T.isWebGLArrayRenderTarget)&&(_e=T.isWebGL3DRenderTarget?i.TEXTURE_3D:i.TEXTURE_2D_ARRAY),t.bindTexture(_e,$.__webglTexture),Se(_e,v),v.mipmaps&&v.mipmaps.length>0)for(let L=0;L<v.mipmaps.length;L++)oe(B.__webglFramebuffer[L],T,v,i.COLOR_ATTACHMENT0,_e,L);else oe(B.__webglFramebuffer,T,v,i.COLOR_ATTACHMENT0,_e,0);m(v)&&p(_e),t.unbindTexture()}T.depthBuffer&&te(T)}function ze(T){let v=T.textures;for(let B=0,$=v.length;B<$;B++){let ne=v[B];if(m(ne)){let Z=T.isWebGLCubeRenderTarget?i.TEXTURE_CUBE_MAP:i.TEXTURE_2D,Le=n.get(ne).__webglTexture;t.bindTexture(Z,Le),p(Z),t.unbindTexture()}}}let ee=[],C=[];function fe(T){if(T.samples>0){if(ae(T)===!1){let v=T.textures,B=T.width,$=T.height,ne=i.COLOR_BUFFER_BIT,Z=T.stencilBuffer?i.DEPTH_STENCIL_ATTACHMENT:i.DEPTH_ATTACHMENT,Le=n.get(T),_e=v.length>1;if(_e)for(let L=0;L<v.length;L++)t.bindFramebuffer(i.FRAMEBUFFER,Le.__webglMultisampledFramebuffer),i.framebufferRenderbuffer(i.FRAMEBUFFER,i.COLOR_ATTACHMENT0+L,i.RENDERBUFFER,null),t.bindFramebuffer(i.FRAMEBUFFER,Le.__webglFramebuffer),i.framebufferTexture2D(i.DRAW_FRAMEBUFFER,i.COLOR_ATTACHMENT0+L,i.TEXTURE_2D,null,0);t.bindFramebuffer(i.READ_FRAMEBUFFER,Le.__webglMultisampledFramebuffer),t.bindFramebuffer(i.DRAW_FRAMEBUFFER,Le.__webglFramebuffer);for(let L=0;L<v.length;L++){if(T.resolveDepthBuffer&&(T.depthBuffer&&(ne|=i.DEPTH_BUFFER_BIT),T.stencilBuffer&&T.resolveStencilBuffer&&(ne|=i.STENCIL_BUFFER_BIT)),_e){i.framebufferRenderbuffer(i.READ_FRAMEBUFFER,i.COLOR_ATTACHMENT0,i.RENDERBUFFER,Le.__webglColorRenderbuffer[L]);let q=n.get(v[L]).__webglTexture;i.framebufferTexture2D(i.DRAW_FRAMEBUFFER,i.COLOR_ATTACHMENT0,i.TEXTURE_2D,q,0)}i.blitFramebuffer(0,0,B,$,0,0,B,$,ne,i.NEAREST),c===!0&&(ee.length=0,C.length=0,ee.push(i.COLOR_ATTACHMENT0+L),T.depthBuffer&&T.resolveDepthBuffer===!1&&(ee.push(Z),C.push(Z),i.invalidateFramebuffer(i.DRAW_FRAMEBUFFER,C)),i.invalidateFramebuffer(i.READ_FRAMEBUFFER,ee))}if(t.bindFramebuffer(i.READ_FRAMEBUFFER,null),t.bindFramebuffer(i.DRAW_FRAMEBUFFER,null),_e)for(let L=0;L<v.length;L++){t.bindFramebuffer(i.FRAMEBUFFER,Le.__webglMultisampledFramebuffer),i.framebufferRenderbuffer(i.FRAMEBUFFER,i.COLOR_ATTACHMENT0+L,i.RENDERBUFFER,Le.__webglColorRenderbuffer[L]);let q=n.get(v[L]).__webglTexture;t.bindFramebuffer(i.FRAMEBUFFER,Le.__webglFramebuffer),i.framebufferTexture2D(i.DRAW_FRAMEBUFFER,i.COLOR_ATTACHMENT0+L,i.TEXTURE_2D,q,0)}t.bindFramebuffer(i.DRAW_FRAMEBUFFER,Le.__webglMultisampledFramebuffer)}else if(T.depthBuffer&&T.resolveDepthBuffer===!1&&c){let v=T.stencilBuffer?i.DEPTH_STENCIL_ATTACHMENT:i.DEPTH_ATTACHMENT;i.invalidateFramebuffer(i.DRAW_FRAMEBUFFER,[v])}}}function de(T){return Math.min(s.maxSamples,T.samples)}function ae(T){let v=n.get(T);return T.samples>0&&e.has("WEBGL_multisampled_render_to_texture")===!0&&v.__useRenderToTexture!==!1}function ge(T){let v=o.render.frame;h.get(T)!==v&&(h.set(T,v),T.update())}function ke(T,v){let B=T.colorSpace,$=T.format,ne=T.type;return T.isCompressedTexture===!0||T.isVideoTexture===!0||B!==oi&&B!==ei&&(ct.getTransfer(B)===gt?($!==vn||ne!==Vn)&&console.warn("THREE.WebGLTextures: sRGB encoded textures have to use RGBAFormat and UnsignedByteType."):console.error("THREE.WebGLTextures: Unsupported texture color space:",B)),v}function be(T){return typeof HTMLImageElement!="undefined"&&T instanceof HTMLImageElement?(l.width=T.naturalWidth||T.width,l.height=T.naturalHeight||T.height):typeof VideoFrame!="undefined"&&T instanceof VideoFrame?(l.width=T.displayWidth,l.height=T.displayHeight):(l.width=T.width,l.height=T.height),l}this.allocateTextureUnit=z,this.resetTextureUnits=S,this.setTexture2D=k,this.setTexture2DArray=K,this.setTexture3D=G,this.setTextureCube=ce,this.rebindTextures=xe,this.setupRenderTarget=Ve,this.updateRenderTargetMipmap=ze,this.updateMultisampleRenderTarget=fe,this.setupDepthRenderbuffer=te,this.setupFrameBufferTexture=oe,this.useMultisampledRTT=ae}function Jy(i,e){function t(n,s=ei){let r,o=ct.getTransfer(s);if(n===Vn)return i.UNSIGNED_BYTE;if(n===Yl)return i.UNSIGNED_SHORT_4_4_4_4;if(n===$l)return i.UNSIGNED_SHORT_5_5_5_1;if(n===kd)return i.UNSIGNED_INT_5_9_9_9_REV;if(n===Ud)return i.BYTE;if(n===Nd)return i.SHORT;if(n===Zs)return i.UNSIGNED_SHORT;if(n===ql)return i.INT;if(n===bi)return i.UNSIGNED_INT;if(n===zn)return i.FLOAT;if(n===hr)return i.HALF_FLOAT;if(n===Od)return i.ALPHA;if(n===Fd)return i.RGB;if(n===vn)return i.RGBA;if(n===Bd)return i.LUMINANCE;if(n===zd)return i.LUMINANCE_ALPHA;if(n===ss)return i.DEPTH_COMPONENT;if(n===us)return i.DEPTH_STENCIL;if(n===Hd)return i.RED;if(n===Jl)return i.RED_INTEGER;if(n===Vd)return i.RG;if(n===Zl)return i.RG_INTEGER;if(n===jl)return i.RGBA_INTEGER;if(n===lo||n===ho||n===uo||n===fo)if(o===gt)if(r=e.get("WEBGL_compressed_texture_s3tc_srgb"),r!==null){if(n===lo)return r.COMPRESSED_SRGB_S3TC_DXT1_EXT;if(n===ho)return r.COMPRESSED_SRGB_ALPHA_S3TC_DXT1_EXT;if(n===uo)return r.COMPRESSED_SRGB_ALPHA_S3TC_DXT3_EXT;if(n===fo)return r.COMPRESSED_SRGB_ALPHA_S3TC_DXT5_EXT}else return null;else if(r=e.get("WEBGL_compressed_texture_s3tc"),r!==null){if(n===lo)return r.COMPRESSED_RGB_S3TC_DXT1_EXT;if(n===ho)return r.COMPRESSED_RGBA_S3TC_DXT1_EXT;if(n===uo)return r.COMPRESSED_RGBA_S3TC_DXT3_EXT;if(n===fo)return r.COMPRESSED_RGBA_S3TC_DXT5_EXT}else return null;if(n===Rc||n===Pc||n===Ic||n===Lc)if(r=e.get("WEBGL_compressed_texture_pvrtc"),r!==null){if(n===Rc)return r.COMPRESSED_RGB_PVRTC_4BPPV1_IMG;if(n===Pc)return r.COMPRESSED_RGB_PVRTC_2BPPV1_IMG;if(n===Ic)return r.COMPRESSED_RGBA_PVRTC_4BPPV1_IMG;if(n===Lc)return r.COMPRESSED_RGBA_PVRTC_2BPPV1_IMG}else return null;if(n===Dc||n===Uc||n===Nc)if(r=e.get("WEBGL_compressed_texture_etc"),r!==null){if(n===Dc||n===Uc)return o===gt?r.COMPRESSED_SRGB8_ETC2:r.COMPRESSED_RGB8_ETC2;if(n===Nc)return o===gt?r.COMPRESSED_SRGB8_ALPHA8_ETC2_EAC:r.COMPRESSED_RGBA8_ETC2_EAC}else return null;if(n===kc||n===Oc||n===Fc||n===Bc||n===zc||n===Hc||n===Vc||n===Gc||n===Wc||n===Xc||n===qc||n===Yc||n===$c||n===Jc)if(r=e.get("WEBGL_compressed_texture_astc"),r!==null){if(n===kc)return o===gt?r.COMPRESSED_SRGB8_ALPHA8_ASTC_4x4_KHR:r.COMPRESSED_RGBA_ASTC_4x4_KHR;if(n===Oc)return o===gt?r.COMPRESSED_SRGB8_ALPHA8_ASTC_5x4_KHR:r.COMPRESSED_RGBA_ASTC_5x4_KHR;if(n===Fc)return o===gt?r.COMPRESSED_SRGB8_ALPHA8_ASTC_5x5_KHR:r.COMPRESSED_RGBA_ASTC_5x5_KHR;if(n===Bc)return o===gt?r.COMPRESSED_SRGB8_ALPHA8_ASTC_6x5_KHR:r.COMPRESSED_RGBA_ASTC_6x5_KHR;if(n===zc)return o===gt?r.COMPRESSED_SRGB8_ALPHA8_ASTC_6x6_KHR:r.COMPRESSED_RGBA_ASTC_6x6_KHR;if(n===Hc)return o===gt?r.COMPRESSED_SRGB8_ALPHA8_ASTC_8x5_KHR:r.COMPRESSED_RGBA_ASTC_8x5_KHR;if(n===Vc)return o===gt?r.COMPRESSED_SRGB8_ALPHA8_ASTC_8x6_KHR:r.COMPRESSED_RGBA_ASTC_8x6_KHR;if(n===Gc)return o===gt?r.COMPRESSED_SRGB8_ALPHA8_ASTC_8x8_KHR:r.COMPRESSED_RGBA_ASTC_8x8_KHR;if(n===Wc)return o===gt?r.COMPRESSED_SRGB8_ALPHA8_ASTC_10x5_KHR:r.COMPRESSED_RGBA_ASTC_10x5_KHR;if(n===Xc)return o===gt?r.COMPRESSED_SRGB8_ALPHA8_ASTC_10x6_KHR:r.COMPRESSED_RGBA_ASTC_10x6_KHR;if(n===qc)return o===gt?r.COMPRESSED_SRGB8_ALPHA8_ASTC_10x8_KHR:r.COMPRESSED_RGBA_ASTC_10x8_KHR;if(n===Yc)return o===gt?r.COMPRESSED_SRGB8_ALPHA8_ASTC_10x10_KHR:r.COMPRESSED_RGBA_ASTC_10x10_KHR;if(n===$c)return o===gt?r.COMPRESSED_SRGB8_ALPHA8_ASTC_12x10_KHR:r.COMPRESSED_RGBA_ASTC_12x10_KHR;if(n===Jc)return o===gt?r.COMPRESSED_SRGB8_ALPHA8_ASTC_12x12_KHR:r.COMPRESSED_RGBA_ASTC_12x12_KHR}else return null;if(n===po||n===Zc||n===jc)if(r=e.get("EXT_texture_compression_bptc"),r!==null){if(n===po)return o===gt?r.COMPRESSED_SRGB_ALPHA_BPTC_UNORM_EXT:r.COMPRESSED_RGBA_BPTC_UNORM_EXT;if(n===Zc)return r.COMPRESSED_RGB_BPTC_SIGNED_FLOAT_EXT;if(n===jc)return r.COMPRESSED_RGB_BPTC_UNSIGNED_FLOAT_EXT}else return null;if(n===Gd||n===Kc||n===Qc||n===el)if(r=e.get("EXT_texture_compression_rgtc"),r!==null){if(n===po)return r.COMPRESSED_RED_RGTC1_EXT;if(n===Kc)return r.COMPRESSED_SIGNED_RED_RGTC1_EXT;if(n===Qc)return r.COMPRESSED_RED_GREEN_RGTC2_EXT;if(n===el)return r.COMPRESSED_SIGNED_RED_GREEN_RGTC2_EXT}else return null;return n===hs?i.UNSIGNED_INT_24_8:i[n]!==void 0?i[n]:null}return{convert:t}}var gl=class extends Ot{constructor(e=[]){super(),this.isArrayCamera=!0,this.cameras=e}},$e=class extends Ft{constructor(){super(),this.isGroup=!0,this.type="Group"}},Zy={type:"move"},Xs=class{constructor(){this._targetRay=null,this._grip=null,this._hand=null}getHandSpace(){return this._hand===null&&(this._hand=new $e,this._hand.matrixAutoUpdate=!1,this._hand.visible=!1,this._hand.joints={},this._hand.inputState={pinching:!1}),this._hand}getTargetRaySpace(){return this._targetRay===null&&(this._targetRay=new $e,this._targetRay.matrixAutoUpdate=!1,this._targetRay.visible=!1,this._targetRay.hasLinearVelocity=!1,this._targetRay.linearVelocity=new A,this._targetRay.hasAngularVelocity=!1,this._targetRay.angularVelocity=new A),this._targetRay}getGripSpace(){return this._grip===null&&(this._grip=new $e,this._grip.matrixAutoUpdate=!1,this._grip.visible=!1,this._grip.hasLinearVelocity=!1,this._grip.linearVelocity=new A,this._grip.hasAngularVelocity=!1,this._grip.angularVelocity=new A),this._grip}dispatchEvent(e){return this._targetRay!==null&&this._targetRay.dispatchEvent(e),this._grip!==null&&this._grip.dispatchEvent(e),this._hand!==null&&this._hand.dispatchEvent(e),this}connect(e){if(e&&e.hand){let t=this._hand;if(t)for(let n of e.hand.values())this._getHandJoint(t,n)}return this.dispatchEvent({type:"connected",data:e}),this}disconnect(e){return this.dispatchEvent({type:"disconnected",data:e}),this._targetRay!==null&&(this._targetRay.visible=!1),this._grip!==null&&(this._grip.visible=!1),this._hand!==null&&(this._hand.visible=!1),this}update(e,t,n){let s=null,r=null,o=null,a=this._targetRay,c=this._grip,l=this._hand;if(e&&t.session.visibilityState!=="visible-blurred"){if(l&&e.hand){o=!0;for(let y of e.hand.values()){let m=t.getJointPose(y,n),p=this._getHandJoint(l,y);m!==null&&(p.matrix.fromArray(m.transform.matrix),p.matrix.decompose(p.position,p.rotation,p.scale),p.matrixWorldNeedsUpdate=!0,p.jointRadius=m.radius),p.visible=m!==null}let h=l.joints["index-finger-tip"],u=l.joints["thumb-tip"],d=h.position.distanceTo(u.position),f=.02,g=.005;l.inputState.pinching&&d>f+g?(l.inputState.pinching=!1,this.dispatchEvent({type:"pinchend",handedness:e.handedness,target:this})):!l.inputState.pinching&&d<=f-g&&(l.inputState.pinching=!0,this.dispatchEvent({type:"pinchstart",handedness:e.handedness,target:this}))}else c!==null&&e.gripSpace&&(r=t.getPose(e.gripSpace,n),r!==null&&(c.matrix.fromArray(r.transform.matrix),c.matrix.decompose(c.position,c.rotation,c.scale),c.matrixWorldNeedsUpdate=!0,r.linearVelocity?(c.hasLinearVelocity=!0,c.linearVelocity.copy(r.linearVelocity)):c.hasLinearVelocity=!1,r.angularVelocity?(c.hasAngularVelocity=!0,c.angularVelocity.copy(r.angularVelocity)):c.hasAngularVelocity=!1));a!==null&&(s=t.getPose(e.targetRaySpace,n),s===null&&r!==null&&(s=r),s!==null&&(a.matrix.fromArray(s.transform.matrix),a.matrix.decompose(a.position,a.rotation,a.scale),a.matrixWorldNeedsUpdate=!0,s.linearVelocity?(a.hasLinearVelocity=!0,a.linearVelocity.copy(s.linearVelocity)):a.hasLinearVelocity=!1,s.angularVelocity?(a.hasAngularVelocity=!0,a.angularVelocity.copy(s.angularVelocity)):a.hasAngularVelocity=!1,this.dispatchEvent(Zy)))}return a!==null&&(a.visible=s!==null),c!==null&&(c.visible=r!==null),l!==null&&(l.visible=o!==null),this}_getHandJoint(e,t){if(e.joints[t.jointName]===void 0){let n=new $e;n.matrixAutoUpdate=!1,n.visible=!1,e.joints[t.jointName]=n,e.add(n)}return e.joints[t.jointName]}},jy=`
void main() {

	gl_Position = vec4( position, 1.0 );

}`,Ky=`
uniform sampler2DArray depthColor;
uniform float depthWidth;
uniform float depthHeight;

void main() {

	vec2 coord = vec2( gl_FragCoord.x / depthWidth, gl_FragCoord.y / depthHeight );

	if ( coord.x >= 1.0 ) {

		gl_FragDepth = texture( depthColor, vec3( coord.x - 1.0, coord.y, 1 ) ).r;

	} else {

		gl_FragDepth = texture( depthColor, vec3( coord.x, coord.y, 0 ) ).r;

	}

}`,_l=class{constructor(){this.texture=null,this.mesh=null,this.depthNear=0,this.depthFar=0}init(e,t,n){if(this.texture===null){let s=new nn,r=e.properties.get(s);r.__webglTexture=t.texture,(t.depthNear!=n.depthNear||t.depthFar!=n.depthFar)&&(this.depthNear=t.depthNear,this.depthFar=t.depthFar),this.texture=s}}getMesh(e){if(this.texture!==null&&this.mesh===null){let t=e.cameras[0].viewport,n=new hn({vertexShader:jy,fragmentShader:Ky,uniforms:{depthColor:{value:this.texture},depthWidth:{value:t.z},depthHeight:{value:t.w}}});this.mesh=new tt(new un(20,20),n)}return this.mesh}reset(){this.texture=null,this.mesh=null}getDepthTexture(){return this.texture}},yl=class extends si{constructor(e,t){super();let n=this,s=null,r=1,o=null,a="local-floor",c=1,l=null,h=null,u=null,d=null,f=null,g=null,y=new _l,m=t.getContextAttributes(),p=null,b=null,x=[],M=[],D=new le,w=null,R=new Ot;R.layers.enable(1),R.viewport=new ft;let P=new Ot;P.layers.enable(2),P.viewport=new ft;let H=[R,P],_=new gl;_.layers.enable(1),_.layers.enable(2);let S=null,z=null;this.cameraAutoUpdate=!0,this.enabled=!1,this.isPresenting=!1,this.getController=function(J){let oe=x[J];return oe===void 0&&(oe=new Xs,x[J]=oe),oe.getTargetRaySpace()},this.getControllerGrip=function(J){let oe=x[J];return oe===void 0&&(oe=new Xs,x[J]=oe),oe.getGripSpace()},this.getHand=function(J){let oe=x[J];return oe===void 0&&(oe=new Xs,x[J]=oe),oe.getHandSpace()};function I(J){let oe=M.indexOf(J.inputSource);if(oe===-1)return;let Re=x[oe];Re!==void 0&&(Re.update(J.inputSource,J.frame,l||o),Re.dispatchEvent({type:J.type,data:J.inputSource}))}function k(){s.removeEventListener("select",I),s.removeEventListener("selectstart",I),s.removeEventListener("selectend",I),s.removeEventListener("squeeze",I),s.removeEventListener("squeezestart",I),s.removeEventListener("squeezeend",I),s.removeEventListener("end",k),s.removeEventListener("inputsourceschange",K);for(let J=0;J<x.length;J++){let oe=M[J];oe!==null&&(M[J]=null,x[J].disconnect(oe))}S=null,z=null,y.reset(),e.setRenderTarget(p),f=null,d=null,u=null,s=null,b=null,nt.stop(),n.isPresenting=!1,e.setPixelRatio(w),e.setSize(D.width,D.height,!1),n.dispatchEvent({type:"sessionend"})}this.setFramebufferScaleFactor=function(J){r=J,n.isPresenting===!0&&console.warn("THREE.WebXRManager: Cannot change framebuffer scale while presenting.")},this.setReferenceSpaceType=function(J){a=J,n.isPresenting===!0&&console.warn("THREE.WebXRManager: Cannot change reference space type while presenting.")},this.getReferenceSpace=function(){return l||o},this.setReferenceSpace=function(J){l=J},this.getBaseLayer=function(){return d!==null?d:f},this.getBinding=function(){return u},this.getFrame=function(){return g},this.getSession=function(){return s},this.setSession=async function(J){if(s=J,s!==null){if(p=e.getRenderTarget(),s.addEventListener("select",I),s.addEventListener("selectstart",I),s.addEventListener("selectend",I),s.addEventListener("squeeze",I),s.addEventListener("squeezestart",I),s.addEventListener("squeezeend",I),s.addEventListener("end",k),s.addEventListener("inputsourceschange",K),m.xrCompatible!==!0&&await t.makeXRCompatible(),w=e.getPixelRatio(),e.getSize(D),s.renderState.layers===void 0){let oe={antialias:m.antialias,alpha:!0,depth:m.depth,stencil:m.stencil,framebufferScaleFactor:r};f=new XRWebGLLayer(s,t,oe),s.updateRenderState({baseLayer:f}),e.setPixelRatio(1),e.setSize(f.framebufferWidth,f.framebufferHeight,!1),b=new Gn(f.framebufferWidth,f.framebufferHeight,{format:vn,type:Vn,colorSpace:e.outputColorSpace,stencilBuffer:m.stencil})}else{let oe=null,Re=null,me=null;m.depth&&(me=m.stencil?t.DEPTH24_STENCIL8:t.DEPTH_COMPONENT24,oe=m.stencil?us:ss,Re=m.stencil?hs:bi);let te={colorFormat:t.RGBA8,depthFormat:me,scaleFactor:r};u=new XRWebGLBinding(s,t),d=u.createProjectionLayer(te),s.updateRenderState({layers:[d]}),e.setPixelRatio(1),e.setSize(d.textureWidth,d.textureHeight,!1),b=new Gn(d.textureWidth,d.textureHeight,{format:vn,type:Vn,depthTexture:new Lo(d.textureWidth,d.textureHeight,Re,void 0,void 0,void 0,void 0,void 0,void 0,oe),stencilBuffer:m.stencil,colorSpace:e.outputColorSpace,samples:m.antialias?4:0,resolveDepthBuffer:d.ignoreDepthValues===!1})}b.isXRRenderTarget=!0,this.setFoveation(c),l=null,o=await s.requestReferenceSpace(a),nt.setContext(s),nt.start(),n.isPresenting=!0,n.dispatchEvent({type:"sessionstart"})}},this.getEnvironmentBlendMode=function(){if(s!==null)return s.environmentBlendMode},this.getDepthTexture=function(){return y.getDepthTexture()};function K(J){for(let oe=0;oe<J.removed.length;oe++){let Re=J.removed[oe],me=M.indexOf(Re);me>=0&&(M[me]=null,x[me].disconnect(Re))}for(let oe=0;oe<J.added.length;oe++){let Re=J.added[oe],me=M.indexOf(Re);if(me===-1){for(let xe=0;xe<x.length;xe++)if(xe>=M.length){M.push(Re),me=xe;break}else if(M[xe]===null){M[xe]=Re,me=xe;break}if(me===-1)break}let te=x[me];te&&te.connect(Re)}}let G=new A,ce=new A;function X(J,oe,Re){G.setFromMatrixPosition(oe.matrixWorld),ce.setFromMatrixPosition(Re.matrixWorld);let me=G.distanceTo(ce),te=oe.projectionMatrix.elements,xe=Re.projectionMatrix.elements,Ve=te[14]/(te[10]-1),ze=te[14]/(te[10]+1),ee=(te[9]+1)/te[5],C=(te[9]-1)/te[5],fe=(te[8]-1)/te[0],de=(xe[8]+1)/xe[0],ae=Ve*fe,ge=Ve*de,ke=me/(-fe+de),be=ke*-fe;if(oe.matrixWorld.decompose(J.position,J.quaternion,J.scale),J.translateX(be),J.translateZ(ke),J.matrixWorld.compose(J.position,J.quaternion,J.scale),J.matrixWorldInverse.copy(J.matrixWorld).invert(),te[10]===-1)J.projectionMatrix.copy(oe.projectionMatrix),J.projectionMatrixInverse.copy(oe.projectionMatrixInverse);else{let T=Ve+ke,v=ze+ke,B=ae-be,$=ge+(me-be),ne=ee*ze/v*T,Z=C*ze/v*T;J.projectionMatrix.makePerspective(B,$,ne,Z,T,v),J.projectionMatrixInverse.copy(J.projectionMatrix).invert()}}function ve(J,oe){oe===null?J.matrixWorld.copy(J.matrix):J.matrixWorld.multiplyMatrices(oe.matrixWorld,J.matrix),J.matrixWorldInverse.copy(J.matrixWorld).invert()}this.updateCamera=function(J){if(s===null)return;let oe=J.near,Re=J.far;y.texture!==null&&(y.depthNear>0&&(oe=y.depthNear),y.depthFar>0&&(Re=y.depthFar)),_.near=P.near=R.near=oe,_.far=P.far=R.far=Re,(S!==_.near||z!==_.far)&&(s.updateRenderState({depthNear:_.near,depthFar:_.far}),S=_.near,z=_.far);let me=J.parent,te=_.cameras;ve(_,me);for(let xe=0;xe<te.length;xe++)ve(te[xe],me);te.length===2?X(_,R,P):_.projectionMatrix.copy(R.projectionMatrix),Me(J,_,me)};function Me(J,oe,Re){Re===null?J.matrix.copy(oe.matrixWorld):(J.matrix.copy(Re.matrixWorld),J.matrix.invert(),J.matrix.multiply(oe.matrixWorld)),J.matrix.decompose(J.position,J.quaternion,J.scale),J.updateMatrixWorld(!0),J.projectionMatrix.copy(oe.projectionMatrix),J.projectionMatrixInverse.copy(oe.projectionMatrixInverse),J.isPerspectiveCamera&&(J.fov=js*2*Math.atan(1/J.projectionMatrix.elements[5]),J.zoom=1)}this.getCamera=function(){return _},this.getFoveation=function(){if(!(d===null&&f===null))return c},this.setFoveation=function(J){c=J,d!==null&&(d.fixedFoveation=J),f!==null&&f.fixedFoveation!==void 0&&(f.fixedFoveation=J)},this.hasDepthSensing=function(){return y.texture!==null},this.getDepthSensingMesh=function(){return y.getMesh(_)};let Se=null;function Ke(J,oe){if(h=oe.getViewerPose(l||o),g=oe,h!==null){let Re=h.views;f!==null&&(e.setRenderTargetFramebuffer(b,f.framebuffer),e.setRenderTarget(b));let me=!1;Re.length!==_.cameras.length&&(_.cameras.length=0,me=!0);for(let xe=0;xe<Re.length;xe++){let Ve=Re[xe],ze=null;if(f!==null)ze=f.getViewport(Ve);else{let C=u.getViewSubImage(d,Ve);ze=C.viewport,xe===0&&(e.setRenderTargetTextures(b,C.colorTexture,d.ignoreDepthValues?void 0:C.depthStencilTexture),e.setRenderTarget(b))}let ee=H[xe];ee===void 0&&(ee=new Ot,ee.layers.enable(xe),ee.viewport=new ft,H[xe]=ee),ee.matrix.fromArray(Ve.transform.matrix),ee.matrix.decompose(ee.position,ee.quaternion,ee.scale),ee.projectionMatrix.fromArray(Ve.projectionMatrix),ee.projectionMatrixInverse.copy(ee.projectionMatrix).invert(),ee.viewport.set(ze.x,ze.y,ze.width,ze.height),xe===0&&(_.matrix.copy(ee.matrix),_.matrix.decompose(_.position,_.quaternion,_.scale)),me===!0&&_.cameras.push(ee)}let te=s.enabledFeatures;if(te&&te.includes("depth-sensing")){let xe=u.getDepthInformation(Re[0]);xe&&xe.isValid&&xe.texture&&y.init(e,xe,s.renderState)}}for(let Re=0;Re<x.length;Re++){let me=M[Re],te=x[Re];me!==null&&te!==void 0&&te.update(me,oe,l||o)}Se&&Se(J,oe),oe.detectedPlanes&&n.dispatchEvent({type:"planesdetected",data:oe}),g=null}let nt=new Jd;nt.setAnimationLoop(Ke),this.setAnimationLoop=function(J){Se=J},this.dispose=function(){}}},gi=new Cn,Qy=new _t;function ex(i,e){function t(m,p){m.matrixAutoUpdate===!0&&m.updateMatrix(),p.value.copy(m.matrix)}function n(m,p){p.color.getRGB(m.fogColor.value,$d(i)),p.isFog?(m.fogNear.value=p.near,m.fogFar.value=p.far):p.isFogExp2&&(m.fogDensity.value=p.density)}function s(m,p,b,x,M){p.isMeshBasicMaterial||p.isMeshLambertMaterial?r(m,p):p.isMeshToonMaterial?(r(m,p),u(m,p)):p.isMeshPhongMaterial?(r(m,p),h(m,p)):p.isMeshStandardMaterial?(r(m,p),d(m,p),p.isMeshPhysicalMaterial&&f(m,p,M)):p.isMeshMatcapMaterial?(r(m,p),g(m,p)):p.isMeshDepthMaterial?r(m,p):p.isMeshDistanceMaterial?(r(m,p),y(m,p)):p.isMeshNormalMaterial?r(m,p):p.isLineBasicMaterial?(o(m,p),p.isLineDashedMaterial&&a(m,p)):p.isPointsMaterial?c(m,p,b,x):p.isSpriteMaterial?l(m,p):p.isShadowMaterial?(m.color.value.copy(p.color),m.opacity.value=p.opacity):p.isShaderMaterial&&(p.uniformsNeedUpdate=!1)}function r(m,p){m.opacity.value=p.opacity,p.color&&m.diffuse.value.copy(p.color),p.emissive&&m.emissive.value.copy(p.emissive).multiplyScalar(p.emissiveIntensity),p.map&&(m.map.value=p.map,t(p.map,m.mapTransform)),p.alphaMap&&(m.alphaMap.value=p.alphaMap,t(p.alphaMap,m.alphaMapTransform)),p.bumpMap&&(m.bumpMap.value=p.bumpMap,t(p.bumpMap,m.bumpMapTransform),m.bumpScale.value=p.bumpScale,p.side===Ht&&(m.bumpScale.value*=-1)),p.normalMap&&(m.normalMap.value=p.normalMap,t(p.normalMap,m.normalMapTransform),m.normalScale.value.copy(p.normalScale),p.side===Ht&&m.normalScale.value.negate()),p.displacementMap&&(m.displacementMap.value=p.displacementMap,t(p.displacementMap,m.displacementMapTransform),m.displacementScale.value=p.displacementScale,m.displacementBias.value=p.displacementBias),p.emissiveMap&&(m.emissiveMap.value=p.emissiveMap,t(p.emissiveMap,m.emissiveMapTransform)),p.specularMap&&(m.specularMap.value=p.specularMap,t(p.specularMap,m.specularMapTransform)),p.alphaTest>0&&(m.alphaTest.value=p.alphaTest);let b=e.get(p),x=b.envMap,M=b.envMapRotation;x&&(m.envMap.value=x,gi.copy(M),gi.x*=-1,gi.y*=-1,gi.z*=-1,x.isCubeTexture&&x.isRenderTargetTexture===!1&&(gi.y*=-1,gi.z*=-1),m.envMapRotation.value.setFromMatrix4(Qy.makeRotationFromEuler(gi)),m.flipEnvMap.value=x.isCubeTexture&&x.isRenderTargetTexture===!1?-1:1,m.reflectivity.value=p.reflectivity,m.ior.value=p.ior,m.refractionRatio.value=p.refractionRatio),p.lightMap&&(m.lightMap.value=p.lightMap,m.lightMapIntensity.value=p.lightMapIntensity,t(p.lightMap,m.lightMapTransform)),p.aoMap&&(m.aoMap.value=p.aoMap,m.aoMapIntensity.value=p.aoMapIntensity,t(p.aoMap,m.aoMapTransform))}function o(m,p){m.diffuse.value.copy(p.color),m.opacity.value=p.opacity,p.map&&(m.map.value=p.map,t(p.map,m.mapTransform))}function a(m,p){m.dashSize.value=p.dashSize,m.totalSize.value=p.dashSize+p.gapSize,m.scale.value=p.scale}function c(m,p,b,x){m.diffuse.value.copy(p.color),m.opacity.value=p.opacity,m.size.value=p.size*b,m.scale.value=x*.5,p.map&&(m.map.value=p.map,t(p.map,m.uvTransform)),p.alphaMap&&(m.alphaMap.value=p.alphaMap,t(p.alphaMap,m.alphaMapTransform)),p.alphaTest>0&&(m.alphaTest.value=p.alphaTest)}function l(m,p){m.diffuse.value.copy(p.color),m.opacity.value=p.opacity,m.rotation.value=p.rotation,p.map&&(m.map.value=p.map,t(p.map,m.mapTransform)),p.alphaMap&&(m.alphaMap.value=p.alphaMap,t(p.alphaMap,m.alphaMapTransform)),p.alphaTest>0&&(m.alphaTest.value=p.alphaTest)}function h(m,p){m.specular.value.copy(p.specular),m.shininess.value=Math.max(p.shininess,1e-4)}function u(m,p){p.gradientMap&&(m.gradientMap.value=p.gradientMap)}function d(m,p){m.metalness.value=p.metalness,p.metalnessMap&&(m.metalnessMap.value=p.metalnessMap,t(p.metalnessMap,m.metalnessMapTransform)),m.roughness.value=p.roughness,p.roughnessMap&&(m.roughnessMap.value=p.roughnessMap,t(p.roughnessMap,m.roughnessMapTransform)),p.envMap&&(m.envMapIntensity.value=p.envMapIntensity)}function f(m,p,b){m.ior.value=p.ior,p.sheen>0&&(m.sheenColor.value.copy(p.sheenColor).multiplyScalar(p.sheen),m.sheenRoughness.value=p.sheenRoughness,p.sheenColorMap&&(m.sheenColorMap.value=p.sheenColorMap,t(p.sheenColorMap,m.sheenColorMapTransform)),p.sheenRoughnessMap&&(m.sheenRoughnessMap.value=p.sheenRoughnessMap,t(p.sheenRoughnessMap,m.sheenRoughnessMapTransform))),p.clearcoat>0&&(m.clearcoat.value=p.clearcoat,m.clearcoatRoughness.value=p.clearcoatRoughness,p.clearcoatMap&&(m.clearcoatMap.value=p.clearcoatMap,t(p.clearcoatMap,m.clearcoatMapTransform)),p.clearcoatRoughnessMap&&(m.clearcoatRoughnessMap.value=p.clearcoatRoughnessMap,t(p.clearcoatRoughnessMap,m.clearcoatRoughnessMapTransform)),p.clearcoatNormalMap&&(m.clearcoatNormalMap.value=p.clearcoatNormalMap,t(p.clearcoatNormalMap,m.clearcoatNormalMapTransform),m.clearcoatNormalScale.value.copy(p.clearcoatNormalScale),p.side===Ht&&m.clearcoatNormalScale.value.negate())),p.dispersion>0&&(m.dispersion.value=p.dispersion),p.iridescence>0&&(m.iridescence.value=p.iridescence,m.iridescenceIOR.value=p.iridescenceIOR,m.iridescenceThicknessMinimum.value=p.iridescenceThicknessRange[0],m.iridescenceThicknessMaximum.value=p.iridescenceThicknessRange[1],p.iridescenceMap&&(m.iridescenceMap.value=p.iridescenceMap,t(p.iridescenceMap,m.iridescenceMapTransform)),p.iridescenceThicknessMap&&(m.iridescenceThicknessMap.value=p.iridescenceThicknessMap,t(p.iridescenceThicknessMap,m.iridescenceThicknessMapTransform))),p.transmission>0&&(m.transmission.value=p.transmission,m.transmissionSamplerMap.value=b.texture,m.transmissionSamplerSize.value.set(b.width,b.height),p.transmissionMap&&(m.transmissionMap.value=p.transmissionMap,t(p.transmissionMap,m.transmissionMapTransform)),m.thickness.value=p.thickness,p.thicknessMap&&(m.thicknessMap.value=p.thicknessMap,t(p.thicknessMap,m.thicknessMapTransform)),m.attenuationDistance.value=p.attenuationDistance,m.attenuationColor.value.copy(p.attenuationColor)),p.anisotropy>0&&(m.anisotropyVector.value.set(p.anisotropy*Math.cos(p.anisotropyRotation),p.anisotropy*Math.sin(p.anisotropyRotation)),p.anisotropyMap&&(m.anisotropyMap.value=p.anisotropyMap,t(p.anisotropyMap,m.anisotropyMapTransform))),m.specularIntensity.value=p.specularIntensity,m.specularColor.value.copy(p.specularColor),p.specularColorMap&&(m.specularColorMap.value=p.specularColorMap,t(p.specularColorMap,m.specularColorMapTransform)),p.specularIntensityMap&&(m.specularIntensityMap.value=p.specularIntensityMap,t(p.specularIntensityMap,m.specularIntensityMapTransform))}function g(m,p){p.matcap&&(m.matcap.value=p.matcap)}function y(m,p){let b=e.get(p).light;m.referencePosition.value.setFromMatrixPosition(b.matrixWorld),m.nearDistance.value=b.shadow.camera.near,m.farDistance.value=b.shadow.camera.far}return{refreshFogUniforms:n,refreshMaterialUniforms:s}}function tx(i,e,t,n){let s={},r={},o=[],a=i.getParameter(i.MAX_UNIFORM_BUFFER_BINDINGS);function c(b,x){let M=x.program;n.uniformBlockBinding(b,M)}function l(b,x){let M=s[b.id];M===void 0&&(g(b),M=h(b),s[b.id]=M,b.addEventListener("dispose",m));let D=x.program;n.updateUBOMapping(b,D);let w=e.render.frame;r[b.id]!==w&&(d(b),r[b.id]=w)}function h(b){let x=u();b.__bindingPointIndex=x;let M=i.createBuffer(),D=b.__size,w=b.usage;return i.bindBuffer(i.UNIFORM_BUFFER,M),i.bufferData(i.UNIFORM_BUFFER,D,w),i.bindBuffer(i.UNIFORM_BUFFER,null),i.bindBufferBase(i.UNIFORM_BUFFER,x,M),M}function u(){for(let b=0;b<a;b++)if(o.indexOf(b)===-1)return o.push(b),b;return console.error("THREE.WebGLRenderer: Maximum number of simultaneously usable uniforms groups reached."),0}function d(b){let x=s[b.id],M=b.uniforms,D=b.__cache;i.bindBuffer(i.UNIFORM_BUFFER,x);for(let w=0,R=M.length;w<R;w++){let P=Array.isArray(M[w])?M[w]:[M[w]];for(let H=0,_=P.length;H<_;H++){let S=P[H];if(f(S,w,H,D)===!0){let z=S.__offset,I=Array.isArray(S.value)?S.value:[S.value],k=0;for(let K=0;K<I.length;K++){let G=I[K],ce=y(G);typeof G=="number"||typeof G=="boolean"?(S.__data[0]=G,i.bufferSubData(i.UNIFORM_BUFFER,z+k,S.__data)):G.isMatrix3?(S.__data[0]=G.elements[0],S.__data[1]=G.elements[1],S.__data[2]=G.elements[2],S.__data[3]=0,S.__data[4]=G.elements[3],S.__data[5]=G.elements[4],S.__data[6]=G.elements[5],S.__data[7]=0,S.__data[8]=G.elements[6],S.__data[9]=G.elements[7],S.__data[10]=G.elements[8],S.__data[11]=0):(G.toArray(S.__data,k),k+=ce.storage/Float32Array.BYTES_PER_ELEMENT)}i.bufferSubData(i.UNIFORM_BUFFER,z,S.__data)}}}i.bindBuffer(i.UNIFORM_BUFFER,null)}function f(b,x,M,D){let w=b.value,R=x+"_"+M;if(D[R]===void 0)return typeof w=="number"||typeof w=="boolean"?D[R]=w:D[R]=w.clone(),!0;{let P=D[R];if(typeof w=="number"||typeof w=="boolean"){if(P!==w)return D[R]=w,!0}else if(P.equals(w)===!1)return P.copy(w),!0}return!1}function g(b){let x=b.uniforms,M=0,D=16;for(let R=0,P=x.length;R<P;R++){let H=Array.isArray(x[R])?x[R]:[x[R]];for(let _=0,S=H.length;_<S;_++){let z=H[_],I=Array.isArray(z.value)?z.value:[z.value];for(let k=0,K=I.length;k<K;k++){let G=I[k],ce=y(G),X=M%D,ve=X%ce.boundary,Me=X+ve;M+=ve,Me!==0&&D-Me<ce.storage&&(M+=D-Me),z.__data=new Float32Array(ce.storage/Float32Array.BYTES_PER_ELEMENT),z.__offset=M,M+=ce.storage}}}let w=M%D;return w>0&&(M+=D-w),b.__size=M,b.__cache={},this}function y(b){let x={boundary:0,storage:0};return typeof b=="number"||typeof b=="boolean"?(x.boundary=4,x.storage=4):b.isVector2?(x.boundary=8,x.storage=8):b.isVector3||b.isColor?(x.boundary=16,x.storage=12):b.isVector4?(x.boundary=16,x.storage=16):b.isMatrix3?(x.boundary=48,x.storage=48):b.isMatrix4?(x.boundary=64,x.storage=64):b.isTexture?console.warn("THREE.WebGLRenderer: Texture samplers can not be part of an uniforms group."):console.warn("THREE.WebGLRenderer: Unsupported uniform value type.",b),x}function m(b){let x=b.target;x.removeEventListener("dispose",m);let M=o.indexOf(x.__bindingPointIndex);o.splice(M,1),i.deleteBuffer(s[x.id]),delete s[x.id],delete r[x.id]}function p(){for(let b in s)i.deleteBuffer(s[b]);o=[],s={},r={}}return{bind:c,update:l,dispose:p}}var Qs=class{constructor(e={}){let{canvas:t=rm(),context:n=null,depth:s=!0,stencil:r=!1,alpha:o=!1,antialias:a=!1,premultipliedAlpha:c=!0,preserveDrawingBuffer:l=!1,powerPreference:h="default",failIfMajorPerformanceCaveat:u=!1}=e;this.isWebGLRenderer=!0;let d;if(n!==null){if(typeof WebGLRenderingContext!="undefined"&&n instanceof WebGLRenderingContext)throw new Error("THREE.WebGLRenderer: WebGL 1 is not supported since r163.");d=n.getContextAttributes().alpha}else d=o;let f=new Uint32Array(4),g=new Int32Array(4),y=null,m=null,p=[],b=[];this.domElement=t,this.debug={checkShaderErrors:!0,onShaderError:null},this.autoClear=!0,this.autoClearColor=!0,this.autoClearDepth=!0,this.autoClearStencil=!0,this.sortObjects=!0,this.clippingPlanes=[],this.localClippingEnabled=!1,this._outputColorSpace=Xt,this.toneMapping=ii,this.toneMappingExposure=1;let x=this,M=!1,D=0,w=0,R=null,P=-1,H=null,_=new ft,S=new ft,z=null,I=new Qe(0),k=0,K=t.width,G=t.height,ce=1,X=null,ve=null,Me=new ft(0,0,K,G),Se=new ft(0,0,K,G),Ke=!1,nt=new Ks,J=!1,oe=!1,Re=new _t,me=new _t,te=new A,xe=new ft,Ve={background:null,fog:null,environment:null,overrideMaterial:null,isScene:!0},ze=!1;function ee(){return R===null?ce:1}let C=n;function fe(E,N){return t.getContext(E,N)}try{let E={alpha:!0,depth:s,stencil:r,antialias:a,premultipliedAlpha:c,preserveDrawingBuffer:l,powerPreference:h,failIfMajorPerformanceCaveat:u};if("setAttribute"in t&&t.setAttribute("data-engine",`three.js r${Gl}`),t.addEventListener("webglcontextlost",se,!1),t.addEventListener("webglcontextrestored",Ee,!1),t.addEventListener("webglcontextcreationerror",Ae,!1),C===null){let N="webgl2";if(C=fe(N,E),C===null)throw fe(N)?new Error("Error creating WebGL context with your selected attributes."):new Error("Error creating WebGL context.")}}catch(E){throw console.error("THREE.WebGLRenderer: "+E.message),E}let de,ae,ge,ke,be,T,v,B,$,ne,Z,Le,_e,L,q,F,ie,Pe,Be,we,qe,Ge,st,U;function Ce(){de=new __(C),de.init(),Ge=new Jy(C,de),ae=new u_(C,de,e,Ge),ge=new qy(C),ae.reverseDepthBuffer&&ge.buffers.depth.setReversed(!0),ke=new v_(C),be=new Dy,T=new $y(C,de,ge,be,ae,Ge,ke),v=new f_(x),B=new g_(x),$=new Cm(C),st=new l_(C,$),ne=new y_(C,$,ke,st),Z=new b_(C,ne,$,ke),Be=new M_(C,ae,T),F=new d_(be),Le=new Ly(x,v,B,de,ae,st,F),_e=new ex(x,be),L=new Ny,q=new Hy(de),Pe=new c_(x,v,B,ge,Z,d,c),ie=new Wy(x,Z,ae),U=new tx(C,ke,ae,ge),we=new h_(C,de,ke),qe=new x_(C,de,ke),ke.programs=Le.programs,x.capabilities=ae,x.extensions=de,x.properties=be,x.renderLists=L,x.shadowMap=ie,x.state=ge,x.info=ke}Ce();let Y=new yl(x,C);this.xr=Y,this.getContext=function(){return C},this.getContextAttributes=function(){return C.getContextAttributes()},this.forceContextLoss=function(){let E=de.get("WEBGL_lose_context");E&&E.loseContext()},this.forceContextRestore=function(){let E=de.get("WEBGL_lose_context");E&&E.restoreContext()},this.getPixelRatio=function(){return ce},this.setPixelRatio=function(E){E!==void 0&&(ce=E,this.setSize(K,G,!1))},this.getSize=function(E){return E.set(K,G)},this.setSize=function(E,N,V=!0){if(Y.isPresenting){console.warn("THREE.WebGLRenderer: Can't change size while VR device is presenting.");return}K=E,G=N,t.width=Math.floor(E*ce),t.height=Math.floor(N*ce),V===!0&&(t.style.width=E+"px",t.style.height=N+"px"),this.setViewport(0,0,E,N)},this.getDrawingBufferSize=function(E){return E.set(K*ce,G*ce).floor()},this.setDrawingBufferSize=function(E,N,V){K=E,G=N,ce=V,t.width=Math.floor(E*V),t.height=Math.floor(N*V),this.setViewport(0,0,E,N)},this.getCurrentViewport=function(E){return E.copy(_)},this.getViewport=function(E){return E.copy(Me)},this.setViewport=function(E,N,V,W){E.isVector4?Me.set(E.x,E.y,E.z,E.w):Me.set(E,N,V,W),ge.viewport(_.copy(Me).multiplyScalar(ce).round())},this.getScissor=function(E){return E.copy(Se)},this.setScissor=function(E,N,V,W){E.isVector4?Se.set(E.x,E.y,E.z,E.w):Se.set(E,N,V,W),ge.scissor(S.copy(Se).multiplyScalar(ce).round())},this.getScissorTest=function(){return Ke},this.setScissorTest=function(E){ge.setScissorTest(Ke=E)},this.setOpaqueSort=function(E){X=E},this.setTransparentSort=function(E){ve=E},this.getClearColor=function(E){return E.copy(Pe.getClearColor())},this.setClearColor=function(){Pe.setClearColor.apply(Pe,arguments)},this.getClearAlpha=function(){return Pe.getClearAlpha()},this.setClearAlpha=function(){Pe.setClearAlpha.apply(Pe,arguments)},this.clear=function(E=!0,N=!0,V=!0){let W=0;if(E){let O=!1;if(R!==null){let ue=R.texture.format;O=ue===jl||ue===Zl||ue===Jl}if(O){let ue=R.texture.type,Te=ue===Vn||ue===bi||ue===Zs||ue===hs||ue===Yl||ue===$l,Ue=Pe.getClearColor(),Ne=Pe.getClearAlpha(),We=Ue.r,Ye=Ue.g,Oe=Ue.b;Te?(f[0]=We,f[1]=Ye,f[2]=Oe,f[3]=Ne,C.clearBufferuiv(C.COLOR,0,f)):(g[0]=We,g[1]=Ye,g[2]=Oe,g[3]=Ne,C.clearBufferiv(C.COLOR,0,g))}else W|=C.COLOR_BUFFER_BIT}N&&(W|=C.DEPTH_BUFFER_BIT,C.clearDepth(this.capabilities.reverseDepthBuffer?0:1)),V&&(W|=C.STENCIL_BUFFER_BIT,this.state.buffers.stencil.setMask(4294967295)),C.clear(W)},this.clearColor=function(){this.clear(!0,!1,!1)},this.clearDepth=function(){this.clear(!1,!0,!1)},this.clearStencil=function(){this.clear(!1,!1,!0)},this.dispose=function(){t.removeEventListener("webglcontextlost",se,!1),t.removeEventListener("webglcontextrestored",Ee,!1),t.removeEventListener("webglcontextcreationerror",Ae,!1),L.dispose(),q.dispose(),be.dispose(),v.dispose(),B.dispose(),Z.dispose(),st.dispose(),U.dispose(),Le.dispose(),Y.dispose(),Y.removeEventListener("sessionstart",fu),Y.removeEventListener("sessionend",pu),hi.stop()};function se(E){E.preventDefault(),console.log("THREE.WebGLRenderer: Context Lost."),M=!0}function Ee(){console.log("THREE.WebGLRenderer: Context Restored."),M=!1;let E=ke.autoReset,N=ie.enabled,V=ie.autoUpdate,W=ie.needsUpdate,O=ie.type;Ce(),ke.autoReset=E,ie.enabled=N,ie.autoUpdate=V,ie.needsUpdate=W,ie.type=O}function Ae(E){console.error("THREE.WebGLRenderer: A WebGL context could not be created. Reason: ",E.statusMessage)}function it(E){let N=E.target;N.removeEventListener("dispose",it),Tt(N)}function Tt(E){$t(E),be.remove(E)}function $t(E){let N=be.get(E).programs;N!==void 0&&(N.forEach(function(V){Le.releaseProgram(V)}),E.isShaderMaterial&&Le.releaseShaderCache(E))}this.renderBufferDirect=function(E,N,V,W,O,ue){N===null&&(N=Ve);let Te=O.isMesh&&O.matrixWorld.determinant()<0,Ue=Xf(E,N,V,W,O);ge.setMaterial(W,Te);let Ne=V.index,We=1;if(W.wireframe===!0){if(Ne=ne.getWireframeAttribute(V),Ne===void 0)return;We=2}let Ye=V.drawRange,Oe=V.attributes.position,ht=Ye.start*We,mt=(Ye.start+Ye.count)*We;ue!==null&&(ht=Math.max(ht,ue.start*We),mt=Math.min(mt,(ue.start+ue.count)*We)),Ne!==null?(ht=Math.max(ht,0),mt=Math.min(mt,Ne.count)):Oe!=null&&(ht=Math.max(ht,0),mt=Math.min(mt,Oe.count));let vt=mt-ht;if(vt<0||vt===1/0)return;st.setup(O,W,Ue,V,Ne);let jt,ot=we;if(Ne!==null&&(jt=$.get(Ne),ot=qe,ot.setIndex(jt)),O.isMesh)W.wireframe===!0?(ge.setLineWidth(W.wireframeLinewidth*ee()),ot.setMode(C.LINES)):ot.setMode(C.TRIANGLES);else if(O.isLine){let Fe=W.linewidth;Fe===void 0&&(Fe=1),ge.setLineWidth(Fe*ee()),O.isLineSegments?ot.setMode(C.LINES):O.isLineLoop?ot.setMode(C.LINE_LOOP):ot.setMode(C.LINE_STRIP)}else O.isPoints?ot.setMode(C.POINTS):O.isSprite&&ot.setMode(C.TRIANGLES);if(O.isBatchedMesh)if(O._multiDrawInstances!==null)ot.renderMultiDrawInstances(O._multiDrawStarts,O._multiDrawCounts,O._multiDrawCount,O._multiDrawInstances);else if(de.get("WEBGL_multi_draw"))ot.renderMultiDraw(O._multiDrawStarts,O._multiDrawCounts,O._multiDrawCount);else{let Fe=O._multiDrawStarts,kt=O._multiDrawCounts,at=O._multiDrawCount,pn=Ne?$.get(Ne).bytesPerElement:1,ki=be.get(W).currentProgram.getUniforms();for(let Kt=0;Kt<at;Kt++)ki.setValue(C,"_gl_DrawID",Kt),ot.render(Fe[Kt]/pn,kt[Kt])}else if(O.isInstancedMesh)ot.renderInstances(ht,vt,O.count);else if(V.isInstancedBufferGeometry){let Fe=V._maxInstanceCount!==void 0?V._maxInstanceCount:1/0,kt=Math.min(V.instanceCount,Fe);ot.renderInstances(ht,vt,kt)}else ot.render(ht,vt)};function rt(E,N,V){E.transparent===!0&&E.side===Bn&&E.forceSinglePass===!1?(E.side=Ht,E.needsUpdate=!0,Pr(E,N,V),E.side=wn,E.needsUpdate=!0,Pr(E,N,V),E.side=Bn):Pr(E,N,V)}this.compile=function(E,N,V=null){V===null&&(V=E),m=q.get(V),m.init(N),b.push(m),V.traverseVisible(function(O){O.isLight&&O.layers.test(N.layers)&&(m.pushLight(O),O.castShadow&&m.pushShadow(O))}),E!==V&&E.traverseVisible(function(O){O.isLight&&O.layers.test(N.layers)&&(m.pushLight(O),O.castShadow&&m.pushShadow(O))}),m.setupLights();let W=new Set;return E.traverse(function(O){if(!(O.isMesh||O.isPoints||O.isLine||O.isSprite))return;let ue=O.material;if(ue)if(Array.isArray(ue))for(let Te=0;Te<ue.length;Te++){let Ue=ue[Te];rt(Ue,V,O),W.add(Ue)}else rt(ue,V,O),W.add(ue)}),b.pop(),m=null,W},this.compileAsync=function(E,N,V=null){let W=this.compile(E,N,V);return new Promise(O=>{function ue(){if(W.forEach(function(Te){be.get(Te).currentProgram.isReady()&&W.delete(Te)}),W.size===0){O(E);return}setTimeout(ue,10)}de.get("KHR_parallel_shader_compile")!==null?ue():setTimeout(ue,10)})};let Jt=null;function In(E){Jt&&Jt(E)}function fu(){hi.stop()}function pu(){hi.start()}let hi=new Jd;hi.setAnimationLoop(In),typeof self!="undefined"&&hi.setContext(self),this.setAnimationLoop=function(E){Jt=E,Y.setAnimationLoop(E),E===null?hi.stop():hi.start()},Y.addEventListener("sessionstart",fu),Y.addEventListener("sessionend",pu),this.render=function(E,N){if(N!==void 0&&N.isCamera!==!0){console.error("THREE.WebGLRenderer.render: camera is not an instance of THREE.Camera.");return}if(M===!0)return;if(E.matrixWorldAutoUpdate===!0&&E.updateMatrixWorld(),N.parent===null&&N.matrixWorldAutoUpdate===!0&&N.updateMatrixWorld(),Y.enabled===!0&&Y.isPresenting===!0&&(Y.cameraAutoUpdate===!0&&Y.updateCamera(N),N=Y.getCamera()),E.isScene===!0&&E.onBeforeRender(x,E,N,R),m=q.get(E,b.length),m.init(N),b.push(m),me.multiplyMatrices(N.projectionMatrix,N.matrixWorldInverse),nt.setFromProjectionMatrix(me),oe=this.localClippingEnabled,J=F.init(this.clippingPlanes,oe),y=L.get(E,p.length),y.init(),p.push(y),Y.enabled===!0&&Y.isPresenting===!0){let ue=x.xr.getDepthSensingMesh();ue!==null&&Ia(ue,N,-1/0,x.sortObjects)}Ia(E,N,0,x.sortObjects),y.finish(),x.sortObjects===!0&&y.sort(X,ve),ze=Y.enabled===!1||Y.isPresenting===!1||Y.hasDepthSensing()===!1,ze&&Pe.addToRenderList(y,E),this.info.render.frame++,J===!0&&F.beginShadows();let V=m.state.shadowsArray;ie.render(V,E,N),J===!0&&F.endShadows(),this.info.autoReset===!0&&this.info.reset();let W=y.opaque,O=y.transmissive;if(m.setupLights(),N.isArrayCamera){let ue=N.cameras;if(O.length>0)for(let Te=0,Ue=ue.length;Te<Ue;Te++){let Ne=ue[Te];gu(W,O,E,Ne)}ze&&Pe.render(E);for(let Te=0,Ue=ue.length;Te<Ue;Te++){let Ne=ue[Te];mu(y,E,Ne,Ne.viewport)}}else O.length>0&&gu(W,O,E,N),ze&&Pe.render(E),mu(y,E,N);R!==null&&(T.updateMultisampleRenderTarget(R),T.updateRenderTargetMipmap(R)),E.isScene===!0&&E.onAfterRender(x,E,N),st.resetDefaultState(),P=-1,H=null,b.pop(),b.length>0?(m=b[b.length-1],J===!0&&F.setGlobalState(x.clippingPlanes,m.state.camera)):m=null,p.pop(),p.length>0?y=p[p.length-1]:y=null};function Ia(E,N,V,W){if(E.visible===!1)return;if(E.layers.test(N.layers)){if(E.isGroup)V=E.renderOrder;else if(E.isLOD)E.autoUpdate===!0&&E.update(N);else if(E.isLight)m.pushLight(E),E.castShadow&&m.pushShadow(E);else if(E.isSprite){if(!E.frustumCulled||nt.intersectsSprite(E)){W&&xe.setFromMatrixPosition(E.matrixWorld).applyMatrix4(me);let Te=Z.update(E),Ue=E.material;Ue.visible&&y.push(E,Te,Ue,V,xe.z,null)}}else if((E.isMesh||E.isLine||E.isPoints)&&(!E.frustumCulled||nt.intersectsObject(E))){let Te=Z.update(E),Ue=E.material;if(W&&(E.boundingSphere!==void 0?(E.boundingSphere===null&&E.computeBoundingSphere(),xe.copy(E.boundingSphere.center)):(Te.boundingSphere===null&&Te.computeBoundingSphere(),xe.copy(Te.boundingSphere.center)),xe.applyMatrix4(E.matrixWorld).applyMatrix4(me)),Array.isArray(Ue)){let Ne=Te.groups;for(let We=0,Ye=Ne.length;We<Ye;We++){let Oe=Ne[We],ht=Ue[Oe.materialIndex];ht&&ht.visible&&y.push(E,Te,ht,V,xe.z,Oe)}}else Ue.visible&&y.push(E,Te,Ue,V,xe.z,null)}}let ue=E.children;for(let Te=0,Ue=ue.length;Te<Ue;Te++)Ia(ue[Te],N,V,W)}function mu(E,N,V,W){let O=E.opaque,ue=E.transmissive,Te=E.transparent;m.setupLightsView(V),J===!0&&F.setGlobalState(x.clippingPlanes,V),W&&ge.viewport(_.copy(W)),O.length>0&&Rr(O,N,V),ue.length>0&&Rr(ue,N,V),Te.length>0&&Rr(Te,N,V),ge.buffers.depth.setTest(!0),ge.buffers.depth.setMask(!0),ge.buffers.color.setMask(!0),ge.setPolygonOffset(!1)}function gu(E,N,V,W){if((V.isScene===!0?V.overrideMaterial:null)!==null)return;m.state.transmissionRenderTarget[W.id]===void 0&&(m.state.transmissionRenderTarget[W.id]=new Gn(1,1,{generateMipmaps:!0,type:de.has("EXT_color_buffer_half_float")||de.has("EXT_color_buffer_float")?hr:Vn,minFilter:Mi,samples:4,stencilBuffer:r,resolveDepthBuffer:!1,resolveStencilBuffer:!1,colorSpace:ct.workingColorSpace}));let ue=m.state.transmissionRenderTarget[W.id],Te=W.viewport||_;ue.setSize(Te.z,Te.w);let Ue=x.getRenderTarget();x.setRenderTarget(ue),x.getClearColor(I),k=x.getClearAlpha(),k<1&&x.setClearColor(16777215,.5),x.clear(),ze&&Pe.render(V);let Ne=x.toneMapping;x.toneMapping=ii;let We=W.viewport;if(W.viewport!==void 0&&(W.viewport=void 0),m.setupLightsView(W),J===!0&&F.setGlobalState(x.clippingPlanes,W),Rr(E,V,W),T.updateMultisampleRenderTarget(ue),T.updateRenderTargetMipmap(ue),de.has("WEBGL_multisampled_render_to_texture")===!1){let Ye=!1;for(let Oe=0,ht=N.length;Oe<ht;Oe++){let mt=N[Oe],vt=mt.object,jt=mt.geometry,ot=mt.material,Fe=mt.group;if(ot.side===Bn&&vt.layers.test(W.layers)){let kt=ot.side;ot.side=Ht,ot.needsUpdate=!0,_u(vt,V,W,jt,ot,Fe),ot.side=kt,ot.needsUpdate=!0,Ye=!0}}Ye===!0&&(T.updateMultisampleRenderTarget(ue),T.updateRenderTargetMipmap(ue))}x.setRenderTarget(Ue),x.setClearColor(I,k),We!==void 0&&(W.viewport=We),x.toneMapping=Ne}function Rr(E,N,V){let W=N.isScene===!0?N.overrideMaterial:null;for(let O=0,ue=E.length;O<ue;O++){let Te=E[O],Ue=Te.object,Ne=Te.geometry,We=W===null?Te.material:W,Ye=Te.group;Ue.layers.test(V.layers)&&_u(Ue,N,V,Ne,We,Ye)}}function _u(E,N,V,W,O,ue){E.onBeforeRender(x,N,V,W,O,ue),E.modelViewMatrix.multiplyMatrices(V.matrixWorldInverse,E.matrixWorld),E.normalMatrix.getNormalMatrix(E.modelViewMatrix),O.onBeforeRender(x,N,V,W,E,ue),O.transparent===!0&&O.side===Bn&&O.forceSinglePass===!1?(O.side=Ht,O.needsUpdate=!0,x.renderBufferDirect(V,N,W,O,E,ue),O.side=wn,O.needsUpdate=!0,x.renderBufferDirect(V,N,W,O,E,ue),O.side=Bn):x.renderBufferDirect(V,N,W,O,E,ue),E.onAfterRender(x,N,V,W,O,ue)}function Pr(E,N,V){N.isScene!==!0&&(N=Ve);let W=be.get(E),O=m.state.lights,ue=m.state.shadowsArray,Te=O.state.version,Ue=Le.getParameters(E,O.state,ue,N,V),Ne=Le.getProgramCacheKey(Ue),We=W.programs;W.environment=E.isMeshStandardMaterial?N.environment:null,W.fog=N.fog,W.envMap=(E.isMeshStandardMaterial?B:v).get(E.envMap||W.environment),W.envMapRotation=W.environment!==null&&E.envMap===null?N.environmentRotation:E.envMapRotation,We===void 0&&(E.addEventListener("dispose",it),We=new Map,W.programs=We);let Ye=We.get(Ne);if(Ye!==void 0){if(W.currentProgram===Ye&&W.lightsStateVersion===Te)return xu(E,Ue),Ye}else Ue.uniforms=Le.getUniforms(E),E.onBeforeCompile(Ue,x),Ye=Le.acquireProgram(Ue,Ne),We.set(Ne,Ye),W.uniforms=Ue.uniforms;let Oe=W.uniforms;return(!E.isShaderMaterial&&!E.isRawShaderMaterial||E.clipping===!0)&&(Oe.clippingPlanes=F.uniform),xu(E,Ue),W.needsLights=Yf(E),W.lightsStateVersion=Te,W.needsLights&&(Oe.ambientLightColor.value=O.state.ambient,Oe.lightProbe.value=O.state.probe,Oe.directionalLights.value=O.state.directional,Oe.directionalLightShadows.value=O.state.directionalShadow,Oe.spotLights.value=O.state.spot,Oe.spotLightShadows.value=O.state.spotShadow,Oe.rectAreaLights.value=O.state.rectArea,Oe.ltc_1.value=O.state.rectAreaLTC1,Oe.ltc_2.value=O.state.rectAreaLTC2,Oe.pointLights.value=O.state.point,Oe.pointLightShadows.value=O.state.pointShadow,Oe.hemisphereLights.value=O.state.hemi,Oe.directionalShadowMap.value=O.state.directionalShadowMap,Oe.directionalShadowMatrix.value=O.state.directionalShadowMatrix,Oe.spotShadowMap.value=O.state.spotShadowMap,Oe.spotLightMatrix.value=O.state.spotLightMatrix,Oe.spotLightMap.value=O.state.spotLightMap,Oe.pointShadowMap.value=O.state.pointShadowMap,Oe.pointShadowMatrix.value=O.state.pointShadowMatrix),W.currentProgram=Ye,W.uniformsList=null,Ye}function yu(E){if(E.uniformsList===null){let N=E.currentProgram.getUniforms();E.uniformsList=os.seqWithValue(N.seq,E.uniforms)}return E.uniformsList}function xu(E,N){let V=be.get(E);V.outputColorSpace=N.outputColorSpace,V.batching=N.batching,V.batchingColor=N.batchingColor,V.instancing=N.instancing,V.instancingColor=N.instancingColor,V.instancingMorph=N.instancingMorph,V.skinning=N.skinning,V.morphTargets=N.morphTargets,V.morphNormals=N.morphNormals,V.morphColors=N.morphColors,V.morphTargetsCount=N.morphTargetsCount,V.numClippingPlanes=N.numClippingPlanes,V.numIntersection=N.numClipIntersection,V.vertexAlphas=N.vertexAlphas,V.vertexTangents=N.vertexTangents,V.toneMapping=N.toneMapping}function Xf(E,N,V,W,O){N.isScene!==!0&&(N=Ve),T.resetTextureUnits();let ue=N.fog,Te=W.isMeshStandardMaterial?N.environment:null,Ue=R===null?x.outputColorSpace:R.isXRRenderTarget===!0?R.texture.colorSpace:oi,Ne=(W.isMeshStandardMaterial?B:v).get(W.envMap||Te),We=W.vertexColors===!0&&!!V.attributes.color&&V.attributes.color.itemSize===4,Ye=!!V.attributes.tangent&&(!!W.normalMap||W.anisotropy>0),Oe=!!V.morphAttributes.position,ht=!!V.morphAttributes.normal,mt=!!V.morphAttributes.color,vt=ii;W.toneMapped&&(R===null||R.isXRRenderTarget===!0)&&(vt=x.toneMapping);let jt=V.morphAttributes.position||V.morphAttributes.normal||V.morphAttributes.color,ot=jt!==void 0?jt.length:0,Fe=be.get(W),kt=m.state.lights;if(J===!0&&(oe===!0||E!==H)){let an=E===H&&W.id===P;F.setState(W,E,an)}let at=!1;W.version===Fe.__version?(Fe.needsLights&&Fe.lightsStateVersion!==kt.state.version||Fe.outputColorSpace!==Ue||O.isBatchedMesh&&Fe.batching===!1||!O.isBatchedMesh&&Fe.batching===!0||O.isBatchedMesh&&Fe.batchingColor===!0&&O.colorTexture===null||O.isBatchedMesh&&Fe.batchingColor===!1&&O.colorTexture!==null||O.isInstancedMesh&&Fe.instancing===!1||!O.isInstancedMesh&&Fe.instancing===!0||O.isSkinnedMesh&&Fe.skinning===!1||!O.isSkinnedMesh&&Fe.skinning===!0||O.isInstancedMesh&&Fe.instancingColor===!0&&O.instanceColor===null||O.isInstancedMesh&&Fe.instancingColor===!1&&O.instanceColor!==null||O.isInstancedMesh&&Fe.instancingMorph===!0&&O.morphTexture===null||O.isInstancedMesh&&Fe.instancingMorph===!1&&O.morphTexture!==null||Fe.envMap!==Ne||W.fog===!0&&Fe.fog!==ue||Fe.numClippingPlanes!==void 0&&(Fe.numClippingPlanes!==F.numPlanes||Fe.numIntersection!==F.numIntersection)||Fe.vertexAlphas!==We||Fe.vertexTangents!==Ye||Fe.morphTargets!==Oe||Fe.morphNormals!==ht||Fe.morphColors!==mt||Fe.toneMapping!==vt||Fe.morphTargetsCount!==ot)&&(at=!0):(at=!0,Fe.__version=W.version);let pn=Fe.currentProgram;at===!0&&(pn=Pr(W,N,O));let ki=!1,Kt=!1,La=!1,bt=pn.getUniforms(),Yn=Fe.uniforms;if(ge.useProgram(pn.program)&&(ki=!0,Kt=!0,La=!0),W.id!==P&&(P=W.id,Kt=!0),ki||H!==E){ae.reverseDepthBuffer?(Re.copy(E.projectionMatrix),am(Re),cm(Re),bt.setValue(C,"projectionMatrix",Re)):bt.setValue(C,"projectionMatrix",E.projectionMatrix),bt.setValue(C,"viewMatrix",E.matrixWorldInverse);let an=bt.map.cameraPosition;an!==void 0&&an.setValue(C,te.setFromMatrixPosition(E.matrixWorld)),ae.logarithmicDepthBuffer&&bt.setValue(C,"logDepthBufFC",2/(Math.log(E.far+1)/Math.LN2)),(W.isMeshPhongMaterial||W.isMeshToonMaterial||W.isMeshLambertMaterial||W.isMeshBasicMaterial||W.isMeshStandardMaterial||W.isShaderMaterial)&&bt.setValue(C,"isOrthographic",E.isOrthographicCamera===!0),H!==E&&(H=E,Kt=!0,La=!0)}if(O.isSkinnedMesh){bt.setOptional(C,O,"bindMatrix"),bt.setOptional(C,O,"bindMatrixInverse");let an=O.skeleton;an&&(an.boneTexture===null&&an.computeBoneTexture(),bt.setValue(C,"boneTexture",an.boneTexture,T))}O.isBatchedMesh&&(bt.setOptional(C,O,"batchingTexture"),bt.setValue(C,"batchingTexture",O._matricesTexture,T),bt.setOptional(C,O,"batchingIdTexture"),bt.setValue(C,"batchingIdTexture",O._indirectTexture,T),bt.setOptional(C,O,"batchingColorTexture"),O._colorsTexture!==null&&bt.setValue(C,"batchingColorTexture",O._colorsTexture,T));let Da=V.morphAttributes;if((Da.position!==void 0||Da.normal!==void 0||Da.color!==void 0)&&Be.update(O,V,pn),(Kt||Fe.receiveShadow!==O.receiveShadow)&&(Fe.receiveShadow=O.receiveShadow,bt.setValue(C,"receiveShadow",O.receiveShadow)),W.isMeshGouraudMaterial&&W.envMap!==null&&(Yn.envMap.value=Ne,Yn.flipEnvMap.value=Ne.isCubeTexture&&Ne.isRenderTargetTexture===!1?-1:1),W.isMeshStandardMaterial&&W.envMap===null&&N.environment!==null&&(Yn.envMapIntensity.value=N.environmentIntensity),Kt&&(bt.setValue(C,"toneMappingExposure",x.toneMappingExposure),Fe.needsLights&&qf(Yn,La),ue&&W.fog===!0&&_e.refreshFogUniforms(Yn,ue),_e.refreshMaterialUniforms(Yn,W,ce,G,m.state.transmissionRenderTarget[E.id]),os.upload(C,yu(Fe),Yn,T)),W.isShaderMaterial&&W.uniformsNeedUpdate===!0&&(os.upload(C,yu(Fe),Yn,T),W.uniformsNeedUpdate=!1),W.isSpriteMaterial&&bt.setValue(C,"center",O.center),bt.setValue(C,"modelViewMatrix",O.modelViewMatrix),bt.setValue(C,"normalMatrix",O.normalMatrix),bt.setValue(C,"modelMatrix",O.matrixWorld),W.isShaderMaterial||W.isRawShaderMaterial){let an=W.uniformsGroups;for(let Ua=0,$f=an.length;Ua<$f;Ua++){let vu=an[Ua];U.update(vu,pn),U.bind(vu,pn)}}return pn}function qf(E,N){E.ambientLightColor.needsUpdate=N,E.lightProbe.needsUpdate=N,E.directionalLights.needsUpdate=N,E.directionalLightShadows.needsUpdate=N,E.pointLights.needsUpdate=N,E.pointLightShadows.needsUpdate=N,E.spotLights.needsUpdate=N,E.spotLightShadows.needsUpdate=N,E.rectAreaLights.needsUpdate=N,E.hemisphereLights.needsUpdate=N}function Yf(E){return E.isMeshLambertMaterial||E.isMeshToonMaterial||E.isMeshPhongMaterial||E.isMeshStandardMaterial||E.isShadowMaterial||E.isShaderMaterial&&E.lights===!0}this.getActiveCubeFace=function(){return D},this.getActiveMipmapLevel=function(){return w},this.getRenderTarget=function(){return R},this.setRenderTargetTextures=function(E,N,V){be.get(E.texture).__webglTexture=N,be.get(E.depthTexture).__webglTexture=V;let W=be.get(E);W.__hasExternalTextures=!0,W.__autoAllocateDepthBuffer=V===void 0,W.__autoAllocateDepthBuffer||de.has("WEBGL_multisampled_render_to_texture")===!0&&(console.warn("THREE.WebGLRenderer: Render-to-texture extension was disabled because an external texture was provided"),W.__useRenderToTexture=!1)},this.setRenderTargetFramebuffer=function(E,N){let V=be.get(E);V.__webglFramebuffer=N,V.__useDefaultFramebuffer=N===void 0},this.setRenderTarget=function(E,N=0,V=0){R=E,D=N,w=V;let W=!0,O=null,ue=!1,Te=!1;if(E){let Ne=be.get(E);if(Ne.__useDefaultFramebuffer!==void 0)ge.bindFramebuffer(C.FRAMEBUFFER,null),W=!1;else if(Ne.__webglFramebuffer===void 0)T.setupRenderTarget(E);else if(Ne.__hasExternalTextures)T.rebindTextures(E,be.get(E.texture).__webglTexture,be.get(E.depthTexture).__webglTexture);else if(E.depthBuffer){let Oe=E.depthTexture;if(Ne.__boundDepthTexture!==Oe){if(Oe!==null&&be.has(Oe)&&(E.width!==Oe.image.width||E.height!==Oe.image.height))throw new Error("WebGLRenderTarget: Attached DepthTexture is initialized to the incorrect size.");T.setupDepthRenderbuffer(E)}}let We=E.texture;(We.isData3DTexture||We.isDataArrayTexture||We.isCompressedArrayTexture)&&(Te=!0);let Ye=be.get(E).__webglFramebuffer;E.isWebGLCubeRenderTarget?(Array.isArray(Ye[N])?O=Ye[N][V]:O=Ye[N],ue=!0):E.samples>0&&T.useMultisampledRTT(E)===!1?O=be.get(E).__webglMultisampledFramebuffer:Array.isArray(Ye)?O=Ye[V]:O=Ye,_.copy(E.viewport),S.copy(E.scissor),z=E.scissorTest}else _.copy(Me).multiplyScalar(ce).floor(),S.copy(Se).multiplyScalar(ce).floor(),z=Ke;if(ge.bindFramebuffer(C.FRAMEBUFFER,O)&&W&&ge.drawBuffers(E,O),ge.viewport(_),ge.scissor(S),ge.setScissorTest(z),ue){let Ne=be.get(E.texture);C.framebufferTexture2D(C.FRAMEBUFFER,C.COLOR_ATTACHMENT0,C.TEXTURE_CUBE_MAP_POSITIVE_X+N,Ne.__webglTexture,V)}else if(Te){let Ne=be.get(E.texture),We=N||0;C.framebufferTextureLayer(C.FRAMEBUFFER,C.COLOR_ATTACHMENT0,Ne.__webglTexture,V||0,We)}P=-1},this.readRenderTargetPixels=function(E,N,V,W,O,ue,Te){if(!(E&&E.isWebGLRenderTarget)){console.error("THREE.WebGLRenderer.readRenderTargetPixels: renderTarget is not THREE.WebGLRenderTarget.");return}let Ue=be.get(E).__webglFramebuffer;if(E.isWebGLCubeRenderTarget&&Te!==void 0&&(Ue=Ue[Te]),Ue){ge.bindFramebuffer(C.FRAMEBUFFER,Ue);try{let Ne=E.texture,We=Ne.format,Ye=Ne.type;if(!ae.textureFormatReadable(We)){console.error("THREE.WebGLRenderer.readRenderTargetPixels: renderTarget is not in RGBA or implementation defined format.");return}if(!ae.textureTypeReadable(Ye)){console.error("THREE.WebGLRenderer.readRenderTargetPixels: renderTarget is not in UnsignedByteType or implementation defined type.");return}N>=0&&N<=E.width-W&&V>=0&&V<=E.height-O&&C.readPixels(N,V,W,O,Ge.convert(We),Ge.convert(Ye),ue)}finally{let Ne=R!==null?be.get(R).__webglFramebuffer:null;ge.bindFramebuffer(C.FRAMEBUFFER,Ne)}}},this.readRenderTargetPixelsAsync=async function(E,N,V,W,O,ue,Te){if(!(E&&E.isWebGLRenderTarget))throw new Error("THREE.WebGLRenderer.readRenderTargetPixels: renderTarget is not THREE.WebGLRenderTarget.");let Ue=be.get(E).__webglFramebuffer;if(E.isWebGLCubeRenderTarget&&Te!==void 0&&(Ue=Ue[Te]),Ue){let Ne=E.texture,We=Ne.format,Ye=Ne.type;if(!ae.textureFormatReadable(We))throw new Error("THREE.WebGLRenderer.readRenderTargetPixelsAsync: renderTarget is not in RGBA or implementation defined format.");if(!ae.textureTypeReadable(Ye))throw new Error("THREE.WebGLRenderer.readRenderTargetPixelsAsync: renderTarget is not in UnsignedByteType or implementation defined type.");if(N>=0&&N<=E.width-W&&V>=0&&V<=E.height-O){ge.bindFramebuffer(C.FRAMEBUFFER,Ue);let Oe=C.createBuffer();C.bindBuffer(C.PIXEL_PACK_BUFFER,Oe),C.bufferData(C.PIXEL_PACK_BUFFER,ue.byteLength,C.STREAM_READ),C.readPixels(N,V,W,O,Ge.convert(We),Ge.convert(Ye),0);let ht=R!==null?be.get(R).__webglFramebuffer:null;ge.bindFramebuffer(C.FRAMEBUFFER,ht);let mt=C.fenceSync(C.SYNC_GPU_COMMANDS_COMPLETE,0);return C.flush(),await om(C,mt,4),C.bindBuffer(C.PIXEL_PACK_BUFFER,Oe),C.getBufferSubData(C.PIXEL_PACK_BUFFER,0,ue),C.deleteBuffer(Oe),C.deleteSync(mt),ue}else throw new Error("THREE.WebGLRenderer.readRenderTargetPixelsAsync: requested read bounds are out of range.")}},this.copyFramebufferToTexture=function(E,N=null,V=0){E.isTexture!==!0&&(mo("WebGLRenderer: copyFramebufferToTexture function signature has changed."),N=arguments[0]||null,E=arguments[1]);let W=Math.pow(2,-V),O=Math.floor(E.image.width*W),ue=Math.floor(E.image.height*W),Te=N!==null?N.x:0,Ue=N!==null?N.y:0;T.setTexture2D(E,0),C.copyTexSubImage2D(C.TEXTURE_2D,V,0,0,Te,Ue,O,ue),ge.unbindTexture()},this.copyTextureToTexture=function(E,N,V=null,W=null,O=0){E.isTexture!==!0&&(mo("WebGLRenderer: copyTextureToTexture function signature has changed."),W=arguments[0]||null,E=arguments[1],N=arguments[2],O=arguments[3]||0,V=null);let ue,Te,Ue,Ne,We,Ye;V!==null?(ue=V.max.x-V.min.x,Te=V.max.y-V.min.y,Ue=V.min.x,Ne=V.min.y):(ue=E.image.width,Te=E.image.height,Ue=0,Ne=0),W!==null?(We=W.x,Ye=W.y):(We=0,Ye=0);let Oe=Ge.convert(N.format),ht=Ge.convert(N.type);T.setTexture2D(N,0),C.pixelStorei(C.UNPACK_FLIP_Y_WEBGL,N.flipY),C.pixelStorei(C.UNPACK_PREMULTIPLY_ALPHA_WEBGL,N.premultiplyAlpha),C.pixelStorei(C.UNPACK_ALIGNMENT,N.unpackAlignment);let mt=C.getParameter(C.UNPACK_ROW_LENGTH),vt=C.getParameter(C.UNPACK_IMAGE_HEIGHT),jt=C.getParameter(C.UNPACK_SKIP_PIXELS),ot=C.getParameter(C.UNPACK_SKIP_ROWS),Fe=C.getParameter(C.UNPACK_SKIP_IMAGES),kt=E.isCompressedTexture?E.mipmaps[O]:E.image;C.pixelStorei(C.UNPACK_ROW_LENGTH,kt.width),C.pixelStorei(C.UNPACK_IMAGE_HEIGHT,kt.height),C.pixelStorei(C.UNPACK_SKIP_PIXELS,Ue),C.pixelStorei(C.UNPACK_SKIP_ROWS,Ne),E.isDataTexture?C.texSubImage2D(C.TEXTURE_2D,O,We,Ye,ue,Te,Oe,ht,kt.data):E.isCompressedTexture?C.compressedTexSubImage2D(C.TEXTURE_2D,O,We,Ye,kt.width,kt.height,Oe,kt.data):C.texSubImage2D(C.TEXTURE_2D,O,We,Ye,ue,Te,Oe,ht,kt),C.pixelStorei(C.UNPACK_ROW_LENGTH,mt),C.pixelStorei(C.UNPACK_IMAGE_HEIGHT,vt),C.pixelStorei(C.UNPACK_SKIP_PIXELS,jt),C.pixelStorei(C.UNPACK_SKIP_ROWS,ot),C.pixelStorei(C.UNPACK_SKIP_IMAGES,Fe),O===0&&N.generateMipmaps&&C.generateMipmap(C.TEXTURE_2D),ge.unbindTexture()},this.copyTextureToTexture3D=function(E,N,V=null,W=null,O=0){E.isTexture!==!0&&(mo("WebGLRenderer: copyTextureToTexture3D function signature has changed."),V=arguments[0]||null,W=arguments[1]||null,E=arguments[2],N=arguments[3],O=arguments[4]||0);let ue,Te,Ue,Ne,We,Ye,Oe,ht,mt,vt=E.isCompressedTexture?E.mipmaps[O]:E.image;V!==null?(ue=V.max.x-V.min.x,Te=V.max.y-V.min.y,Ue=V.max.z-V.min.z,Ne=V.min.x,We=V.min.y,Ye=V.min.z):(ue=vt.width,Te=vt.height,Ue=vt.depth,Ne=0,We=0,Ye=0),W!==null?(Oe=W.x,ht=W.y,mt=W.z):(Oe=0,ht=0,mt=0);let jt=Ge.convert(N.format),ot=Ge.convert(N.type),Fe;if(N.isData3DTexture)T.setTexture3D(N,0),Fe=C.TEXTURE_3D;else if(N.isDataArrayTexture||N.isCompressedArrayTexture)T.setTexture2DArray(N,0),Fe=C.TEXTURE_2D_ARRAY;else{console.warn("THREE.WebGLRenderer.copyTextureToTexture3D: only supports THREE.DataTexture3D and THREE.DataTexture2DArray.");return}C.pixelStorei(C.UNPACK_FLIP_Y_WEBGL,N.flipY),C.pixelStorei(C.UNPACK_PREMULTIPLY_ALPHA_WEBGL,N.premultiplyAlpha),C.pixelStorei(C.UNPACK_ALIGNMENT,N.unpackAlignment);let kt=C.getParameter(C.UNPACK_ROW_LENGTH),at=C.getParameter(C.UNPACK_IMAGE_HEIGHT),pn=C.getParameter(C.UNPACK_SKIP_PIXELS),ki=C.getParameter(C.UNPACK_SKIP_ROWS),Kt=C.getParameter(C.UNPACK_SKIP_IMAGES);C.pixelStorei(C.UNPACK_ROW_LENGTH,vt.width),C.pixelStorei(C.UNPACK_IMAGE_HEIGHT,vt.height),C.pixelStorei(C.UNPACK_SKIP_PIXELS,Ne),C.pixelStorei(C.UNPACK_SKIP_ROWS,We),C.pixelStorei(C.UNPACK_SKIP_IMAGES,Ye),E.isDataTexture||E.isData3DTexture?C.texSubImage3D(Fe,O,Oe,ht,mt,ue,Te,Ue,jt,ot,vt.data):N.isCompressedArrayTexture?C.compressedTexSubImage3D(Fe,O,Oe,ht,mt,ue,Te,Ue,jt,vt.data):C.texSubImage3D(Fe,O,Oe,ht,mt,ue,Te,Ue,jt,ot,vt),C.pixelStorei(C.UNPACK_ROW_LENGTH,kt),C.pixelStorei(C.UNPACK_IMAGE_HEIGHT,at),C.pixelStorei(C.UNPACK_SKIP_PIXELS,pn),C.pixelStorei(C.UNPACK_SKIP_ROWS,ki),C.pixelStorei(C.UNPACK_SKIP_IMAGES,Kt),O===0&&N.generateMipmaps&&C.generateMipmap(Fe),ge.unbindTexture()},this.initRenderTarget=function(E){be.get(E).__webglFramebuffer===void 0&&T.setupRenderTarget(E)},this.initTexture=function(E){E.isCubeTexture?T.setTextureCube(E,0):E.isData3DTexture?T.setTexture3D(E,0):E.isDataArrayTexture||E.isCompressedArrayTexture?T.setTexture2DArray(E,0):T.setTexture2D(E,0),ge.unbindTexture()},this.resetState=function(){D=0,w=0,R=null,ge.reset(),st.reset()},typeof __THREE_DEVTOOLS__!="undefined"&&__THREE_DEVTOOLS__.dispatchEvent(new CustomEvent("observe",{detail:this}))}get coordinateSystem(){return Hn}get outputColorSpace(){return this._outputColorSpace}set outputColorSpace(e){this._outputColorSpace=e;let t=this.getContext();t.drawingBufferColorSpace=e===Kl?"display-p3":"srgb",t.unpackColorSpace=ct.workingColorSpace===jo?"display-p3":"srgb"}};var Do=class i{constructor(e,t=1,n=1e3){this.isFog=!0,this.name="",this.color=new Qe(e),this.near=t,this.far=n}clone(){return new i(this.color,this.near,this.far)}toJSON(){return{type:"Fog",name:this.name,color:this.color.getHex(),near:this.near,far:this.far}}},er=class extends Ft{constructor(){super(),this.isScene=!0,this.type="Scene",this.background=null,this.environment=null,this.fog=null,this.backgroundBlurriness=0,this.backgroundIntensity=1,this.backgroundRotation=new Cn,this.environmentIntensity=1,this.environmentRotation=new Cn,this.overrideMaterial=null,typeof __THREE_DEVTOOLS__!="undefined"&&__THREE_DEVTOOLS__.dispatchEvent(new CustomEvent("observe",{detail:this}))}copy(e,t){return super.copy(e,t),e.background!==null&&(this.background=e.background.clone()),e.environment!==null&&(this.environment=e.environment.clone()),e.fog!==null&&(this.fog=e.fog.clone()),this.backgroundBlurriness=e.backgroundBlurriness,this.backgroundIntensity=e.backgroundIntensity,this.backgroundRotation.copy(e.backgroundRotation),this.environmentIntensity=e.environmentIntensity,this.environmentRotation.copy(e.environmentRotation),e.overrideMaterial!==null&&(this.overrideMaterial=e.overrideMaterial.clone()),this.matrixAutoUpdate=e.matrixAutoUpdate,this}toJSON(e){let t=super.toJSON(e);return this.fog!==null&&(t.object.fog=this.fog.toJSON()),this.backgroundBlurriness>0&&(t.object.backgroundBlurriness=this.backgroundBlurriness),this.backgroundIntensity!==1&&(t.object.backgroundIntensity=this.backgroundIntensity),t.object.backgroundRotation=this.backgroundRotation.toArray(),this.environmentIntensity!==1&&(t.object.environmentIntensity=this.environmentIntensity),t.object.environmentRotation=this.environmentRotation.toArray(),t}},xl=class{constructor(e,t){this.isInterleavedBuffer=!0,this.array=e,this.stride=t,this.count=e!==void 0?e.length/t:0,this.usage=nl,this.updateRanges=[],this.version=0,this.uuid=Tn()}onUploadCallback(){}set needsUpdate(e){e===!0&&this.version++}setUsage(e){return this.usage=e,this}addUpdateRange(e,t){this.updateRanges.push({start:e,count:t})}clearUpdateRanges(){this.updateRanges.length=0}copy(e){return this.array=new e.array.constructor(e.array),this.count=e.count,this.stride=e.stride,this.usage=e.usage,this}copyAt(e,t,n){e*=this.stride,n*=t.stride;for(let s=0,r=this.stride;s<r;s++)this.array[e+s]=t.array[n+s];return this}set(e,t=0){return this.array.set(e,t),this}clone(e){e.arrayBuffers===void 0&&(e.arrayBuffers={}),this.array.buffer._uuid===void 0&&(this.array.buffer._uuid=Tn()),e.arrayBuffers[this.array.buffer._uuid]===void 0&&(e.arrayBuffers[this.array.buffer._uuid]=this.array.slice(0).buffer);let t=new this.array.constructor(e.arrayBuffers[this.array.buffer._uuid]),n=new this.constructor(t,this.stride);return n.setUsage(this.usage),n}onUpload(e){return this.onUploadCallback=e,this}toJSON(e){return e.arrayBuffers===void 0&&(e.arrayBuffers={}),this.array.buffer._uuid===void 0&&(this.array.buffer._uuid=Tn()),e.arrayBuffers[this.array.buffer._uuid]===void 0&&(e.arrayBuffers[this.array.buffer._uuid]=Array.from(new Uint32Array(this.array.buffer))),{uuid:this.uuid,buffer:this.array.buffer._uuid,type:this.array.constructor.name,stride:this.stride}}},Gt=new A,Uo=class i{constructor(e,t,n,s=!1){this.isInterleavedBufferAttribute=!0,this.name="",this.data=e,this.itemSize=t,this.offset=n,this.normalized=s}get count(){return this.data.count}get array(){return this.data.array}set needsUpdate(e){this.data.needsUpdate=e}applyMatrix4(e){for(let t=0,n=this.data.count;t<n;t++)Gt.fromBufferAttribute(this,t),Gt.applyMatrix4(e),this.setXYZ(t,Gt.x,Gt.y,Gt.z);return this}applyNormalMatrix(e){for(let t=0,n=this.count;t<n;t++)Gt.fromBufferAttribute(this,t),Gt.applyNormalMatrix(e),this.setXYZ(t,Gt.x,Gt.y,Gt.z);return this}transformDirection(e){for(let t=0,n=this.count;t<n;t++)Gt.fromBufferAttribute(this,t),Gt.transformDirection(e),this.setXYZ(t,Gt.x,Gt.y,Gt.z);return this}getComponent(e,t){let n=this.array[e*this.data.stride+this.offset+t];return this.normalized&&(n=xn(n,this.array)),n}setComponent(e,t,n){return this.normalized&&(n=ut(n,this.array)),this.data.array[e*this.data.stride+this.offset+t]=n,this}setX(e,t){return this.normalized&&(t=ut(t,this.array)),this.data.array[e*this.data.stride+this.offset]=t,this}setY(e,t){return this.normalized&&(t=ut(t,this.array)),this.data.array[e*this.data.stride+this.offset+1]=t,this}setZ(e,t){return this.normalized&&(t=ut(t,this.array)),this.data.array[e*this.data.stride+this.offset+2]=t,this}setW(e,t){return this.normalized&&(t=ut(t,this.array)),this.data.array[e*this.data.stride+this.offset+3]=t,this}getX(e){let t=this.data.array[e*this.data.stride+this.offset];return this.normalized&&(t=xn(t,this.array)),t}getY(e){let t=this.data.array[e*this.data.stride+this.offset+1];return this.normalized&&(t=xn(t,this.array)),t}getZ(e){let t=this.data.array[e*this.data.stride+this.offset+2];return this.normalized&&(t=xn(t,this.array)),t}getW(e){let t=this.data.array[e*this.data.stride+this.offset+3];return this.normalized&&(t=xn(t,this.array)),t}setXY(e,t,n){return e=e*this.data.stride+this.offset,this.normalized&&(t=ut(t,this.array),n=ut(n,this.array)),this.data.array[e+0]=t,this.data.array[e+1]=n,this}setXYZ(e,t,n,s){return e=e*this.data.stride+this.offset,this.normalized&&(t=ut(t,this.array),n=ut(n,this.array),s=ut(s,this.array)),this.data.array[e+0]=t,this.data.array[e+1]=n,this.data.array[e+2]=s,this}setXYZW(e,t,n,s,r){return e=e*this.data.stride+this.offset,this.normalized&&(t=ut(t,this.array),n=ut(n,this.array),s=ut(s,this.array),r=ut(r,this.array)),this.data.array[e+0]=t,this.data.array[e+1]=n,this.data.array[e+2]=s,this.data.array[e+3]=r,this}clone(e){if(e===void 0){console.log("THREE.InterleavedBufferAttribute.clone(): Cloning an interleaved buffer attribute will de-interleave buffer data.");let t=[];for(let n=0;n<this.count;n++){let s=n*this.data.stride+this.offset;for(let r=0;r<this.itemSize;r++)t.push(this.data.array[s+r])}return new tn(new this.array.constructor(t),this.itemSize,this.normalized)}else return e.interleavedBuffers===void 0&&(e.interleavedBuffers={}),e.interleavedBuffers[this.data.uuid]===void 0&&(e.interleavedBuffers[this.data.uuid]=this.data.clone(e)),new i(e.interleavedBuffers[this.data.uuid],this.itemSize,this.offset,this.normalized)}toJSON(e){if(e===void 0){console.log("THREE.InterleavedBufferAttribute.toJSON(): Serializing an interleaved buffer attribute will de-interleave buffer data.");let t=[];for(let n=0;n<this.count;n++){let s=n*this.data.stride+this.offset;for(let r=0;r<this.itemSize;r++)t.push(this.data.array[s+r])}return{itemSize:this.itemSize,type:this.array.constructor.name,array:t,normalized:this.normalized}}else return e.interleavedBuffers===void 0&&(e.interleavedBuffers={}),e.interleavedBuffers[this.data.uuid]===void 0&&(e.interleavedBuffers[this.data.uuid]=this.data.toJSON(e)),{isInterleavedBufferAttribute:!0,itemSize:this.itemSize,data:this.data.uuid,offset:this.offset,normalized:this.normalized}}},tr=class extends Wn{constructor(e){super(),this.isSpriteMaterial=!0,this.type="SpriteMaterial",this.color=new Qe(16777215),this.map=null,this.alphaMap=null,this.rotation=0,this.sizeAttenuation=!0,this.transparent=!0,this.fog=!0,this.setValues(e)}copy(e){return super.copy(e),this.color.copy(e.color),this.map=e.map,this.alphaMap=e.alphaMap,this.rotation=e.rotation,this.sizeAttenuation=e.sizeAttenuation,this.fog=e.fog,this}},ji,Os=new A,Ki=new A,Qi=new A,es=new le,Fs=new le,ef=new _t,eo=new A,Bs=new A,to=new A,xd=new le,hc=new le,vd=new le,No=class extends Ft{constructor(e=new tr){if(super(),this.isSprite=!0,this.type="Sprite",ji===void 0){ji=new Dt;let t=new Float32Array([-.5,-.5,0,0,0,.5,-.5,0,1,0,.5,.5,0,1,1,-.5,.5,0,0,1]),n=new xl(t,5);ji.setIndex([0,1,2,0,2,3]),ji.setAttribute("position",new Uo(n,3,0,!1)),ji.setAttribute("uv",new Uo(n,2,3,!1))}this.geometry=ji,this.material=e,this.center=new le(.5,.5)}raycast(e,t){e.camera===null&&console.error('THREE.Sprite: "Raycaster.camera" needs to be set in order to raycast against sprites.'),Ki.setFromMatrixScale(this.matrixWorld),ef.copy(e.camera.matrixWorld),this.modelViewMatrix.multiplyMatrices(e.camera.matrixWorldInverse,this.matrixWorld),Qi.setFromMatrixPosition(this.modelViewMatrix),e.camera.isPerspectiveCamera&&this.material.sizeAttenuation===!1&&Ki.multiplyScalar(-Qi.z);let n=this.material.rotation,s,r;n!==0&&(r=Math.cos(n),s=Math.sin(n));let o=this.center;no(eo.set(-.5,-.5,0),Qi,o,Ki,s,r),no(Bs.set(.5,-.5,0),Qi,o,Ki,s,r),no(to.set(.5,.5,0),Qi,o,Ki,s,r),xd.set(0,0),hc.set(1,0),vd.set(1,1);let a=e.ray.intersectTriangle(eo,Bs,to,!1,Os);if(a===null&&(no(Bs.set(-.5,.5,0),Qi,o,Ki,s,r),hc.set(0,1),a=e.ray.intersectTriangle(eo,to,Bs,!1,Os),a===null))return;let c=e.ray.origin.distanceTo(Os);c<e.near||c>e.far||t.push({distance:c,point:Os.clone(),uv:ti.getInterpolation(Os,eo,Bs,to,xd,hc,vd,new le),face:null,object:this})}copy(e,t){return super.copy(e,t),e.center!==void 0&&this.center.copy(e.center),this.material=e.material,this}};function no(i,e,t,n,s,r){es.subVectors(i,t).addScalar(.5).multiply(n),s!==void 0?(Fs.x=r*es.x-s*es.y,Fs.y=s*es.x+r*es.y):Fs.copy(es),i.copy(e),i.x+=Fs.x,i.y+=Fs.y,i.applyMatrix4(ef)}var nr=class extends Wn{constructor(e){super(),this.isLineBasicMaterial=!0,this.type="LineBasicMaterial",this.color=new Qe(16777215),this.map=null,this.linewidth=1,this.linecap="round",this.linejoin="round",this.fog=!0,this.setValues(e)}copy(e){return super.copy(e),this.color.copy(e.color),this.map=e.map,this.linewidth=e.linewidth,this.linecap=e.linecap,this.linejoin=e.linejoin,this.fog=e.fog,this}},ko=new A,Oo=new A,Md=new _t,zs=new Eo,io=new ds,uc=new A,bd=new A,Fo=class extends Ft{constructor(e=new Dt,t=new nr){super(),this.isLine=!0,this.type="Line",this.geometry=e,this.material=t,this.updateMorphTargets()}copy(e,t){return super.copy(e,t),this.material=Array.isArray(e.material)?e.material.slice():e.material,this.geometry=e.geometry,this}computeLineDistances(){let e=this.geometry;if(e.index===null){let t=e.attributes.position,n=[0];for(let s=1,r=t.count;s<r;s++)ko.fromBufferAttribute(t,s-1),Oo.fromBufferAttribute(t,s),n[s]=n[s-1],n[s]+=ko.distanceTo(Oo);e.setAttribute("lineDistance",new lt(n,1))}else console.warn("THREE.Line.computeLineDistances(): Computation only possible with non-indexed BufferGeometry.");return this}raycast(e,t){let n=this.geometry,s=this.matrixWorld,r=e.params.Line.threshold,o=n.drawRange;if(n.boundingSphere===null&&n.computeBoundingSphere(),io.copy(n.boundingSphere),io.applyMatrix4(s),io.radius+=r,e.ray.intersectsSphere(io)===!1)return;Md.copy(s).invert(),zs.copy(e.ray).applyMatrix4(Md);let a=r/((this.scale.x+this.scale.y+this.scale.z)/3),c=a*a,l=this.isLineSegments?2:1,h=n.index,d=n.attributes.position;if(h!==null){let f=Math.max(0,o.start),g=Math.min(h.count,o.start+o.count);for(let y=f,m=g-1;y<m;y+=l){let p=h.getX(y),b=h.getX(y+1),x=so(this,e,zs,c,p,b);x&&t.push(x)}if(this.isLineLoop){let y=h.getX(g-1),m=h.getX(f),p=so(this,e,zs,c,y,m);p&&t.push(p)}}else{let f=Math.max(0,o.start),g=Math.min(d.count,o.start+o.count);for(let y=f,m=g-1;y<m;y+=l){let p=so(this,e,zs,c,y,y+1);p&&t.push(p)}if(this.isLineLoop){let y=so(this,e,zs,c,g-1,f);y&&t.push(y)}}}updateMorphTargets(){let t=this.geometry.morphAttributes,n=Object.keys(t);if(n.length>0){let s=t[n[0]];if(s!==void 0){this.morphTargetInfluences=[],this.morphTargetDictionary={};for(let r=0,o=s.length;r<o;r++){let a=s[r].name||String(r);this.morphTargetInfluences.push(0),this.morphTargetDictionary[a]=r}}}}};function so(i,e,t,n,s,r){let o=i.geometry.attributes.position;if(ko.fromBufferAttribute(o,s),Oo.fromBufferAttribute(o,r),t.distanceSqToSegment(ko,Oo,uc,bd)>n)return;uc.applyMatrix4(i.matrixWorld);let c=e.ray.origin.distanceTo(uc);if(!(c<e.near||c>e.far))return{distance:c,point:bd.clone().applyMatrix4(i.matrixWorld),index:s,face:null,faceIndex:null,barycoord:null,object:i}}var Si=class extends nn{constructor(e,t,n,s,r,o,a,c,l){super(e,t,n,s,r,o,a,c,l),this.isCanvasTexture=!0,this.needsUpdate=!0}},dn=class{constructor(){this.type="Curve",this.arcLengthDivisions=200}getPoint(){return console.warn("THREE.Curve: .getPoint() not implemented."),null}getPointAt(e,t){let n=this.getUtoTmapping(e);return this.getPoint(n,t)}getPoints(e=5){let t=[];for(let n=0;n<=e;n++)t.push(this.getPoint(n/e));return t}getSpacedPoints(e=5){let t=[];for(let n=0;n<=e;n++)t.push(this.getPointAt(n/e));return t}getLength(){let e=this.getLengths();return e[e.length-1]}getLengths(e=this.arcLengthDivisions){if(this.cacheArcLengths&&this.cacheArcLengths.length===e+1&&!this.needsUpdate)return this.cacheArcLengths;this.needsUpdate=!1;let t=[],n,s=this.getPoint(0),r=0;t.push(0);for(let o=1;o<=e;o++)n=this.getPoint(o/e),r+=n.distanceTo(s),t.push(r),s=n;return this.cacheArcLengths=t,t}updateArcLengths(){this.needsUpdate=!0,this.getLengths()}getUtoTmapping(e,t){let n=this.getLengths(),s=0,r=n.length,o;t?o=t:o=e*n[r-1];let a=0,c=r-1,l;for(;a<=c;)if(s=Math.floor(a+(c-a)/2),l=n[s]-o,l<0)a=s+1;else if(l>0)c=s-1;else{c=s;break}if(s=c,n[s]===o)return s/(r-1);let h=n[s],d=n[s+1]-h,f=(o-h)/d;return(s+f)/(r-1)}getTangent(e,t){let s=e-1e-4,r=e+1e-4;s<0&&(s=0),r>1&&(r=1);let o=this.getPoint(s),a=this.getPoint(r),c=t||(o.isVector2?new le:new A);return c.copy(a).sub(o).normalize(),c}getTangentAt(e,t){let n=this.getUtoTmapping(e);return this.getTangent(n,t)}computeFrenetFrames(e,t){let n=new A,s=[],r=[],o=[],a=new A,c=new _t;for(let f=0;f<=e;f++){let g=f/e;s[f]=this.getTangentAt(g,new A)}r[0]=new A,o[0]=new A;let l=Number.MAX_VALUE,h=Math.abs(s[0].x),u=Math.abs(s[0].y),d=Math.abs(s[0].z);h<=l&&(l=h,n.set(1,0,0)),u<=l&&(l=u,n.set(0,1,0)),d<=l&&n.set(0,0,1),a.crossVectors(s[0],n).normalize(),r[0].crossVectors(s[0],a),o[0].crossVectors(s[0],r[0]);for(let f=1;f<=e;f++){if(r[f]=r[f-1].clone(),o[f]=o[f-1].clone(),a.crossVectors(s[f-1],s[f]),a.length()>Number.EPSILON){a.normalize();let g=Math.acos(Lt(s[f-1].dot(s[f]),-1,1));r[f].applyMatrix4(c.makeRotationAxis(a,g))}o[f].crossVectors(s[f],r[f])}if(t===!0){let f=Math.acos(Lt(r[0].dot(r[e]),-1,1));f/=e,s[0].dot(a.crossVectors(r[0],r[e]))>0&&(f=-f);for(let g=1;g<=e;g++)r[g].applyMatrix4(c.makeRotationAxis(s[g],f*g)),o[g].crossVectors(s[g],r[g])}return{tangents:s,normals:r,binormals:o}}clone(){return new this.constructor().copy(this)}copy(e){return this.arcLengthDivisions=e.arcLengthDivisions,this}toJSON(){let e={metadata:{version:4.6,type:"Curve",generator:"Curve.toJSON"}};return e.arcLengthDivisions=this.arcLengthDivisions,e.type=this.type,e}fromJSON(e){return this.arcLengthDivisions=e.arcLengthDivisions,this}},ir=class extends dn{constructor(e=0,t=0,n=1,s=1,r=0,o=Math.PI*2,a=!1,c=0){super(),this.isEllipseCurve=!0,this.type="EllipseCurve",this.aX=e,this.aY=t,this.xRadius=n,this.yRadius=s,this.aStartAngle=r,this.aEndAngle=o,this.aClockwise=a,this.aRotation=c}getPoint(e,t=new le){let n=t,s=Math.PI*2,r=this.aEndAngle-this.aStartAngle,o=Math.abs(r)<Number.EPSILON;for(;r<0;)r+=s;for(;r>s;)r-=s;r<Number.EPSILON&&(o?r=0:r=s),this.aClockwise===!0&&!o&&(r===s?r=-s:r=r-s);let a=this.aStartAngle+e*r,c=this.aX+this.xRadius*Math.cos(a),l=this.aY+this.yRadius*Math.sin(a);if(this.aRotation!==0){let h=Math.cos(this.aRotation),u=Math.sin(this.aRotation),d=c-this.aX,f=l-this.aY;c=d*h-f*u+this.aX,l=d*u+f*h+this.aY}return n.set(c,l)}copy(e){return super.copy(e),this.aX=e.aX,this.aY=e.aY,this.xRadius=e.xRadius,this.yRadius=e.yRadius,this.aStartAngle=e.aStartAngle,this.aEndAngle=e.aEndAngle,this.aClockwise=e.aClockwise,this.aRotation=e.aRotation,this}toJSON(){let e=super.toJSON();return e.aX=this.aX,e.aY=this.aY,e.xRadius=this.xRadius,e.yRadius=this.yRadius,e.aStartAngle=this.aStartAngle,e.aEndAngle=this.aEndAngle,e.aClockwise=this.aClockwise,e.aRotation=this.aRotation,e}fromJSON(e){return super.fromJSON(e),this.aX=e.aX,this.aY=e.aY,this.xRadius=e.xRadius,this.yRadius=e.yRadius,this.aStartAngle=e.aStartAngle,this.aEndAngle=e.aEndAngle,this.aClockwise=e.aClockwise,this.aRotation=e.aRotation,this}},vl=class extends ir{constructor(e,t,n,s,r,o){super(e,t,n,n,s,r,o),this.isArcCurve=!0,this.type="ArcCurve"}};function ih(){let i=0,e=0,t=0,n=0;function s(r,o,a,c){i=r,e=a,t=-3*r+3*o-2*a-c,n=2*r-2*o+a+c}return{initCatmullRom:function(r,o,a,c,l){s(o,a,l*(a-r),l*(c-o))},initNonuniformCatmullRom:function(r,o,a,c,l,h,u){let d=(o-r)/l-(a-r)/(l+h)+(a-o)/h,f=(a-o)/h-(c-o)/(h+u)+(c-a)/u;d*=h,f*=h,s(o,a,d,f)},calc:function(r){let o=r*r,a=o*r;return i+e*r+t*o+n*a}}}var ro=new A,dc=new ih,fc=new ih,pc=new ih,Ml=class extends dn{constructor(e=[],t=!1,n="centripetal",s=.5){super(),this.isCatmullRomCurve3=!0,this.type="CatmullRomCurve3",this.points=e,this.closed=t,this.curveType=n,this.tension=s}getPoint(e,t=new A){let n=t,s=this.points,r=s.length,o=(r-(this.closed?0:1))*e,a=Math.floor(o),c=o-a;this.closed?a+=a>0?0:(Math.floor(Math.abs(a)/r)+1)*r:c===0&&a===r-1&&(a=r-2,c=1);let l,h;this.closed||a>0?l=s[(a-1)%r]:(ro.subVectors(s[0],s[1]).add(s[0]),l=ro);let u=s[a%r],d=s[(a+1)%r];if(this.closed||a+2<r?h=s[(a+2)%r]:(ro.subVectors(s[r-1],s[r-2]).add(s[r-1]),h=ro),this.curveType==="centripetal"||this.curveType==="chordal"){let f=this.curveType==="chordal"?.5:.25,g=Math.pow(l.distanceToSquared(u),f),y=Math.pow(u.distanceToSquared(d),f),m=Math.pow(d.distanceToSquared(h),f);y<1e-4&&(y=1),g<1e-4&&(g=y),m<1e-4&&(m=y),dc.initNonuniformCatmullRom(l.x,u.x,d.x,h.x,g,y,m),fc.initNonuniformCatmullRom(l.y,u.y,d.y,h.y,g,y,m),pc.initNonuniformCatmullRom(l.z,u.z,d.z,h.z,g,y,m)}else this.curveType==="catmullrom"&&(dc.initCatmullRom(l.x,u.x,d.x,h.x,this.tension),fc.initCatmullRom(l.y,u.y,d.y,h.y,this.tension),pc.initCatmullRom(l.z,u.z,d.z,h.z,this.tension));return n.set(dc.calc(c),fc.calc(c),pc.calc(c)),n}copy(e){super.copy(e),this.points=[];for(let t=0,n=e.points.length;t<n;t++){let s=e.points[t];this.points.push(s.clone())}return this.closed=e.closed,this.curveType=e.curveType,this.tension=e.tension,this}toJSON(){let e=super.toJSON();e.points=[];for(let t=0,n=this.points.length;t<n;t++){let s=this.points[t];e.points.push(s.toArray())}return e.closed=this.closed,e.curveType=this.curveType,e.tension=this.tension,e}fromJSON(e){super.fromJSON(e),this.points=[];for(let t=0,n=e.points.length;t<n;t++){let s=e.points[t];this.points.push(new A().fromArray(s))}return this.closed=e.closed,this.curveType=e.curveType,this.tension=e.tension,this}};function Sd(i,e,t,n,s){let r=(n-e)*.5,o=(s-t)*.5,a=i*i,c=i*a;return(2*t-2*n+r+o)*c+(-3*t+3*n-2*r-o)*a+r*i+t}function nx(i,e){let t=1-i;return t*t*e}function ix(i,e){return 2*(1-i)*i*e}function sx(i,e){return i*i*e}function qs(i,e,t,n){return nx(i,e)+ix(i,t)+sx(i,n)}function rx(i,e){let t=1-i;return t*t*t*e}function ox(i,e){let t=1-i;return 3*t*t*i*e}function ax(i,e){return 3*(1-i)*i*i*e}function cx(i,e){return i*i*i*e}function Ys(i,e,t,n,s){return rx(i,e)+ox(i,t)+ax(i,n)+cx(i,s)}var Bo=class extends dn{constructor(e=new le,t=new le,n=new le,s=new le){super(),this.isCubicBezierCurve=!0,this.type="CubicBezierCurve",this.v0=e,this.v1=t,this.v2=n,this.v3=s}getPoint(e,t=new le){let n=t,s=this.v0,r=this.v1,o=this.v2,a=this.v3;return n.set(Ys(e,s.x,r.x,o.x,a.x),Ys(e,s.y,r.y,o.y,a.y)),n}copy(e){return super.copy(e),this.v0.copy(e.v0),this.v1.copy(e.v1),this.v2.copy(e.v2),this.v3.copy(e.v3),this}toJSON(){let e=super.toJSON();return e.v0=this.v0.toArray(),e.v1=this.v1.toArray(),e.v2=this.v2.toArray(),e.v3=this.v3.toArray(),e}fromJSON(e){return super.fromJSON(e),this.v0.fromArray(e.v0),this.v1.fromArray(e.v1),this.v2.fromArray(e.v2),this.v3.fromArray(e.v3),this}},bl=class extends dn{constructor(e=new A,t=new A,n=new A,s=new A){super(),this.isCubicBezierCurve3=!0,this.type="CubicBezierCurve3",this.v0=e,this.v1=t,this.v2=n,this.v3=s}getPoint(e,t=new A){let n=t,s=this.v0,r=this.v1,o=this.v2,a=this.v3;return n.set(Ys(e,s.x,r.x,o.x,a.x),Ys(e,s.y,r.y,o.y,a.y),Ys(e,s.z,r.z,o.z,a.z)),n}copy(e){return super.copy(e),this.v0.copy(e.v0),this.v1.copy(e.v1),this.v2.copy(e.v2),this.v3.copy(e.v3),this}toJSON(){let e=super.toJSON();return e.v0=this.v0.toArray(),e.v1=this.v1.toArray(),e.v2=this.v2.toArray(),e.v3=this.v3.toArray(),e}fromJSON(e){return super.fromJSON(e),this.v0.fromArray(e.v0),this.v1.fromArray(e.v1),this.v2.fromArray(e.v2),this.v3.fromArray(e.v3),this}},zo=class extends dn{constructor(e=new le,t=new le){super(),this.isLineCurve=!0,this.type="LineCurve",this.v1=e,this.v2=t}getPoint(e,t=new le){let n=t;return e===1?n.copy(this.v2):(n.copy(this.v2).sub(this.v1),n.multiplyScalar(e).add(this.v1)),n}getPointAt(e,t){return this.getPoint(e,t)}getTangent(e,t=new le){return t.subVectors(this.v2,this.v1).normalize()}getTangentAt(e,t){return this.getTangent(e,t)}copy(e){return super.copy(e),this.v1.copy(e.v1),this.v2.copy(e.v2),this}toJSON(){let e=super.toJSON();return e.v1=this.v1.toArray(),e.v2=this.v2.toArray(),e}fromJSON(e){return super.fromJSON(e),this.v1.fromArray(e.v1),this.v2.fromArray(e.v2),this}},Sl=class extends dn{constructor(e=new A,t=new A){super(),this.isLineCurve3=!0,this.type="LineCurve3",this.v1=e,this.v2=t}getPoint(e,t=new A){let n=t;return e===1?n.copy(this.v2):(n.copy(this.v2).sub(this.v1),n.multiplyScalar(e).add(this.v1)),n}getPointAt(e,t){return this.getPoint(e,t)}getTangent(e,t=new A){return t.subVectors(this.v2,this.v1).normalize()}getTangentAt(e,t){return this.getTangent(e,t)}copy(e){return super.copy(e),this.v1.copy(e.v1),this.v2.copy(e.v2),this}toJSON(){let e=super.toJSON();return e.v1=this.v1.toArray(),e.v2=this.v2.toArray(),e}fromJSON(e){return super.fromJSON(e),this.v1.fromArray(e.v1),this.v2.fromArray(e.v2),this}},Ho=class extends dn{constructor(e=new le,t=new le,n=new le){super(),this.isQuadraticBezierCurve=!0,this.type="QuadraticBezierCurve",this.v0=e,this.v1=t,this.v2=n}getPoint(e,t=new le){let n=t,s=this.v0,r=this.v1,o=this.v2;return n.set(qs(e,s.x,r.x,o.x),qs(e,s.y,r.y,o.y)),n}copy(e){return super.copy(e),this.v0.copy(e.v0),this.v1.copy(e.v1),this.v2.copy(e.v2),this}toJSON(){let e=super.toJSON();return e.v0=this.v0.toArray(),e.v1=this.v1.toArray(),e.v2=this.v2.toArray(),e}fromJSON(e){return super.fromJSON(e),this.v0.fromArray(e.v0),this.v1.fromArray(e.v1),this.v2.fromArray(e.v2),this}},El=class extends dn{constructor(e=new A,t=new A,n=new A){super(),this.isQuadraticBezierCurve3=!0,this.type="QuadraticBezierCurve3",this.v0=e,this.v1=t,this.v2=n}getPoint(e,t=new A){let n=t,s=this.v0,r=this.v1,o=this.v2;return n.set(qs(e,s.x,r.x,o.x),qs(e,s.y,r.y,o.y),qs(e,s.z,r.z,o.z)),n}copy(e){return super.copy(e),this.v0.copy(e.v0),this.v1.copy(e.v1),this.v2.copy(e.v2),this}toJSON(){let e=super.toJSON();return e.v0=this.v0.toArray(),e.v1=this.v1.toArray(),e.v2=this.v2.toArray(),e}fromJSON(e){return super.fromJSON(e),this.v0.fromArray(e.v0),this.v1.fromArray(e.v1),this.v2.fromArray(e.v2),this}},Vo=class extends dn{constructor(e=[]){super(),this.isSplineCurve=!0,this.type="SplineCurve",this.points=e}getPoint(e,t=new le){let n=t,s=this.points,r=(s.length-1)*e,o=Math.floor(r),a=r-o,c=s[o===0?o:o-1],l=s[o],h=s[o>s.length-2?s.length-1:o+1],u=s[o>s.length-3?s.length-1:o+2];return n.set(Sd(a,c.x,l.x,h.x,u.x),Sd(a,c.y,l.y,h.y,u.y)),n}copy(e){super.copy(e),this.points=[];for(let t=0,n=e.points.length;t<n;t++){let s=e.points[t];this.points.push(s.clone())}return this}toJSON(){let e=super.toJSON();e.points=[];for(let t=0,n=this.points.length;t<n;t++){let s=this.points[t];e.points.push(s.toArray())}return e}fromJSON(e){super.fromJSON(e),this.points=[];for(let t=0,n=e.points.length;t<n;t++){let s=e.points[t];this.points.push(new le().fromArray(s))}return this}},Tl=Object.freeze({__proto__:null,ArcCurve:vl,CatmullRomCurve3:Ml,CubicBezierCurve:Bo,CubicBezierCurve3:bl,EllipseCurve:ir,LineCurve:zo,LineCurve3:Sl,QuadraticBezierCurve:Ho,QuadraticBezierCurve3:El,SplineCurve:Vo}),wl=class extends dn{constructor(){super(),this.type="CurvePath",this.curves=[],this.autoClose=!1}add(e){this.curves.push(e)}closePath(){let e=this.curves[0].getPoint(0),t=this.curves[this.curves.length-1].getPoint(1);if(!e.equals(t)){let n=e.isVector2===!0?"LineCurve":"LineCurve3";this.curves.push(new Tl[n](t,e))}return this}getPoint(e,t){let n=e*this.getLength(),s=this.getCurveLengths(),r=0;for(;r<s.length;){if(s[r]>=n){let o=s[r]-n,a=this.curves[r],c=a.getLength(),l=c===0?0:1-o/c;return a.getPointAt(l,t)}r++}return null}getLength(){let e=this.getCurveLengths();return e[e.length-1]}updateArcLengths(){this.needsUpdate=!0,this.cacheLengths=null,this.getCurveLengths()}getCurveLengths(){if(this.cacheLengths&&this.cacheLengths.length===this.curves.length)return this.cacheLengths;let e=[],t=0;for(let n=0,s=this.curves.length;n<s;n++)t+=this.curves[n].getLength(),e.push(t);return this.cacheLengths=e,e}getSpacedPoints(e=40){let t=[];for(let n=0;n<=e;n++)t.push(this.getPoint(n/e));return this.autoClose&&t.push(t[0]),t}getPoints(e=12){let t=[],n;for(let s=0,r=this.curves;s<r.length;s++){let o=r[s],a=o.isEllipseCurve?e*2:o.isLineCurve||o.isLineCurve3?1:o.isSplineCurve?e*o.points.length:e,c=o.getPoints(a);for(let l=0;l<c.length;l++){let h=c[l];n&&n.equals(h)||(t.push(h),n=h)}}return this.autoClose&&t.length>1&&!t[t.length-1].equals(t[0])&&t.push(t[0]),t}copy(e){super.copy(e),this.curves=[];for(let t=0,n=e.curves.length;t<n;t++){let s=e.curves[t];this.curves.push(s.clone())}return this.autoClose=e.autoClose,this}toJSON(){let e=super.toJSON();e.autoClose=this.autoClose,e.curves=[];for(let t=0,n=this.curves.length;t<n;t++){let s=this.curves[t];e.curves.push(s.toJSON())}return e}fromJSON(e){super.fromJSON(e),this.autoClose=e.autoClose,this.curves=[];for(let t=0,n=e.curves.length;t<n;t++){let s=e.curves[t];this.curves.push(new Tl[s.type]().fromJSON(s))}return this}},sr=class extends wl{constructor(e){super(),this.type="Path",this.currentPoint=new le,e&&this.setFromPoints(e)}setFromPoints(e){this.moveTo(e[0].x,e[0].y);for(let t=1,n=e.length;t<n;t++)this.lineTo(e[t].x,e[t].y);return this}moveTo(e,t){return this.currentPoint.set(e,t),this}lineTo(e,t){let n=new zo(this.currentPoint.clone(),new le(e,t));return this.curves.push(n),this.currentPoint.set(e,t),this}quadraticCurveTo(e,t,n,s){let r=new Ho(this.currentPoint.clone(),new le(e,t),new le(n,s));return this.curves.push(r),this.currentPoint.set(n,s),this}bezierCurveTo(e,t,n,s,r,o){let a=new Bo(this.currentPoint.clone(),new le(e,t),new le(n,s),new le(r,o));return this.curves.push(a),this.currentPoint.set(r,o),this}splineThru(e){let t=[this.currentPoint.clone()].concat(e),n=new Vo(t);return this.curves.push(n),this.currentPoint.copy(e[e.length-1]),this}arc(e,t,n,s,r,o){let a=this.currentPoint.x,c=this.currentPoint.y;return this.absarc(e+a,t+c,n,s,r,o),this}absarc(e,t,n,s,r,o){return this.absellipse(e,t,n,n,s,r,o),this}ellipse(e,t,n,s,r,o,a,c){let l=this.currentPoint.x,h=this.currentPoint.y;return this.absellipse(e+l,t+h,n,s,r,o,a,c),this}absellipse(e,t,n,s,r,o,a,c){let l=new ir(e,t,n,s,r,o,a,c);if(this.curves.length>0){let u=l.getPoint(0);u.equals(this.currentPoint)||this.lineTo(u.x,u.y)}this.curves.push(l);let h=l.getPoint(1);return this.currentPoint.copy(h),this}copy(e){return super.copy(e),this.currentPoint.copy(e.currentPoint),this}toJSON(){let e=super.toJSON();return e.currentPoint=this.currentPoint.toArray(),e}fromJSON(e){return super.fromJSON(e),this.currentPoint.fromArray(e.currentPoint),this}},Cl=class i extends Dt{constructor(e=[new le(0,-.5),new le(.5,0),new le(0,.5)],t=12,n=0,s=Math.PI*2){super(),this.type="LatheGeometry",this.parameters={points:e,segments:t,phiStart:n,phiLength:s},t=Math.floor(t),s=Lt(s,0,Math.PI*2);let r=[],o=[],a=[],c=[],l=[],h=1/t,u=new A,d=new le,f=new A,g=new A,y=new A,m=0,p=0;for(let b=0;b<=e.length-1;b++)switch(b){case 0:m=e[b+1].x-e[b].x,p=e[b+1].y-e[b].y,f.x=p*1,f.y=-m,f.z=p*0,y.copy(f),f.normalize(),c.push(f.x,f.y,f.z);break;case e.length-1:c.push(y.x,y.y,y.z);break;default:m=e[b+1].x-e[b].x,p=e[b+1].y-e[b].y,f.x=p*1,f.y=-m,f.z=p*0,g.copy(f),f.x+=y.x,f.y+=y.y,f.z+=y.z,f.normalize(),c.push(f.x,f.y,f.z),y.copy(g)}for(let b=0;b<=t;b++){let x=n+b*h*s,M=Math.sin(x),D=Math.cos(x);for(let w=0;w<=e.length-1;w++){u.x=e[w].x*M,u.y=e[w].y,u.z=e[w].x*D,o.push(u.x,u.y,u.z),d.x=b/t,d.y=w/(e.length-1),a.push(d.x,d.y);let R=c[3*w+0]*M,P=c[3*w+1],H=c[3*w+0]*D;l.push(R,P,H)}}for(let b=0;b<t;b++)for(let x=0;x<e.length-1;x++){let M=x+b*e.length,D=M,w=M+e.length,R=M+e.length+1,P=M+1;r.push(D,w,P),r.push(R,P,w)}this.setIndex(r),this.setAttribute("position",new lt(o,3)),this.setAttribute("uv",new lt(a,2)),this.setAttribute("normal",new lt(l,3))}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}static fromJSON(e){return new i(e.points,e.segments,e.phiStart,e.phiLength)}},ps=class i extends Cl{constructor(e=1,t=1,n=4,s=8){let r=new sr;r.absarc(0,-t/2,e,Math.PI*1.5,0),r.absarc(0,t/2,e,0,Math.PI*.5),super(r.getPoints(n),s),this.type="CapsuleGeometry",this.parameters={radius:e,length:t,capSegments:n,radialSegments:s}}static fromJSON(e){return new i(e.radius,e.length,e.capSegments,e.radialSegments)}},Go=class i extends Dt{constructor(e=1,t=32,n=0,s=Math.PI*2){super(),this.type="CircleGeometry",this.parameters={radius:e,segments:t,thetaStart:n,thetaLength:s},t=Math.max(3,t);let r=[],o=[],a=[],c=[],l=new A,h=new le;o.push(0,0,0),a.push(0,0,1),c.push(.5,.5);for(let u=0,d=3;u<=t;u++,d+=3){let f=n+u/t*s;l.x=e*Math.cos(f),l.y=e*Math.sin(f),o.push(l.x,l.y,l.z),a.push(0,0,1),h.x=(o[d]/e+1)/2,h.y=(o[d+1]/e+1)/2,c.push(h.x,h.y)}for(let u=1;u<=t;u++)r.push(u,u+1,0);this.setIndex(r),this.setAttribute("position",new lt(o,3)),this.setAttribute("normal",new lt(a,3)),this.setAttribute("uv",new lt(c,2))}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}static fromJSON(e){return new i(e.radius,e.segments,e.thetaStart,e.thetaLength)}},et=class i extends Dt{constructor(e=1,t=1,n=1,s=32,r=1,o=!1,a=0,c=Math.PI*2){super(),this.type="CylinderGeometry",this.parameters={radiusTop:e,radiusBottom:t,height:n,radialSegments:s,heightSegments:r,openEnded:o,thetaStart:a,thetaLength:c};let l=this;s=Math.floor(s),r=Math.floor(r);let h=[],u=[],d=[],f=[],g=0,y=[],m=n/2,p=0;b(),o===!1&&(e>0&&x(!0),t>0&&x(!1)),this.setIndex(h),this.setAttribute("position",new lt(u,3)),this.setAttribute("normal",new lt(d,3)),this.setAttribute("uv",new lt(f,2));function b(){let M=new A,D=new A,w=0,R=(t-e)/n;for(let P=0;P<=r;P++){let H=[],_=P/r,S=_*(t-e)+e;for(let z=0;z<=s;z++){let I=z/s,k=I*c+a,K=Math.sin(k),G=Math.cos(k);D.x=S*K,D.y=-_*n+m,D.z=S*G,u.push(D.x,D.y,D.z),M.set(K,R,G).normalize(),d.push(M.x,M.y,M.z),f.push(I,1-_),H.push(g++)}y.push(H)}for(let P=0;P<s;P++)for(let H=0;H<r;H++){let _=y[H][P],S=y[H+1][P],z=y[H+1][P+1],I=y[H][P+1];e>0&&(h.push(_,S,I),w+=3),t>0&&(h.push(S,z,I),w+=3)}l.addGroup(p,w,0),p+=w}function x(M){let D=g,w=new le,R=new A,P=0,H=M===!0?e:t,_=M===!0?1:-1;for(let z=1;z<=s;z++)u.push(0,m*_,0),d.push(0,_,0),f.push(.5,.5),g++;let S=g;for(let z=0;z<=s;z++){let k=z/s*c+a,K=Math.cos(k),G=Math.sin(k);R.x=H*G,R.y=m*_,R.z=H*K,u.push(R.x,R.y,R.z),d.push(0,_,0),w.x=K*.5+.5,w.y=G*.5*_+.5,f.push(w.x,w.y),g++}for(let z=0;z<s;z++){let I=D+z,k=S+z;M===!0?h.push(k,k+1,I):h.push(k+1,k,I),P+=3}l.addGroup(p,P,M===!0?1:2),p+=P}}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}static fromJSON(e){return new i(e.radiusTop,e.radiusBottom,e.height,e.radialSegments,e.heightSegments,e.openEnded,e.thetaStart,e.thetaLength)}},Wo=class i extends et{constructor(e=1,t=1,n=32,s=1,r=!1,o=0,a=Math.PI*2){super(0,e,t,n,s,r,o,a),this.type="ConeGeometry",this.parameters={radius:e,height:t,radialSegments:n,heightSegments:s,openEnded:r,thetaStart:o,thetaLength:a}}static fromJSON(e){return new i(e.radius,e.height,e.radialSegments,e.heightSegments,e.openEnded,e.thetaStart,e.thetaLength)}},Al=class i extends Dt{constructor(e=[],t=[],n=1,s=0){super(),this.type="PolyhedronGeometry",this.parameters={vertices:e,indices:t,radius:n,detail:s};let r=[],o=[];a(s),l(n),h(),this.setAttribute("position",new lt(r,3)),this.setAttribute("normal",new lt(r.slice(),3)),this.setAttribute("uv",new lt(o,2)),s===0?this.computeVertexNormals():this.normalizeNormals();function a(b){let x=new A,M=new A,D=new A;for(let w=0;w<t.length;w+=3)f(t[w+0],x),f(t[w+1],M),f(t[w+2],D),c(x,M,D,b)}function c(b,x,M,D){let w=D+1,R=[];for(let P=0;P<=w;P++){R[P]=[];let H=b.clone().lerp(M,P/w),_=x.clone().lerp(M,P/w),S=w-P;for(let z=0;z<=S;z++)z===0&&P===w?R[P][z]=H:R[P][z]=H.clone().lerp(_,z/S)}for(let P=0;P<w;P++)for(let H=0;H<2*(w-P)-1;H++){let _=Math.floor(H/2);H%2===0?(d(R[P][_+1]),d(R[P+1][_]),d(R[P][_])):(d(R[P][_+1]),d(R[P+1][_+1]),d(R[P+1][_]))}}function l(b){let x=new A;for(let M=0;M<r.length;M+=3)x.x=r[M+0],x.y=r[M+1],x.z=r[M+2],x.normalize().multiplyScalar(b),r[M+0]=x.x,r[M+1]=x.y,r[M+2]=x.z}function h(){let b=new A;for(let x=0;x<r.length;x+=3){b.x=r[x+0],b.y=r[x+1],b.z=r[x+2];let M=m(b)/2/Math.PI+.5,D=p(b)/Math.PI+.5;o.push(M,1-D)}g(),u()}function u(){for(let b=0;b<o.length;b+=6){let x=o[b+0],M=o[b+2],D=o[b+4],w=Math.max(x,M,D),R=Math.min(x,M,D);w>.9&&R<.1&&(x<.2&&(o[b+0]+=1),M<.2&&(o[b+2]+=1),D<.2&&(o[b+4]+=1))}}function d(b){r.push(b.x,b.y,b.z)}function f(b,x){let M=b*3;x.x=e[M+0],x.y=e[M+1],x.z=e[M+2]}function g(){let b=new A,x=new A,M=new A,D=new A,w=new le,R=new le,P=new le;for(let H=0,_=0;H<r.length;H+=9,_+=6){b.set(r[H+0],r[H+1],r[H+2]),x.set(r[H+3],r[H+4],r[H+5]),M.set(r[H+6],r[H+7],r[H+8]),w.set(o[_+0],o[_+1]),R.set(o[_+2],o[_+3]),P.set(o[_+4],o[_+5]),D.copy(b).add(x).add(M).divideScalar(3);let S=m(D);y(w,_+0,b,S),y(R,_+2,x,S),y(P,_+4,M,S)}}function y(b,x,M,D){D<0&&b.x===1&&(o[x]=b.x-1),M.x===0&&M.z===0&&(o[x]=D/2/Math.PI+.5)}function m(b){return Math.atan2(b.z,-b.x)}function p(b){return Math.atan2(-b.y,Math.sqrt(b.x*b.x+b.z*b.z))}}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}static fromJSON(e){return new i(e.vertices,e.indices,e.radius,e.details)}};var rr=class extends sr{constructor(e){super(e),this.uuid=Tn(),this.type="Shape",this.holes=[]}getPointsHoles(e){let t=[];for(let n=0,s=this.holes.length;n<s;n++)t[n]=this.holes[n].getPoints(e);return t}extractPoints(e){return{shape:this.getPoints(e),holes:this.getPointsHoles(e)}}copy(e){super.copy(e),this.holes=[];for(let t=0,n=e.holes.length;t<n;t++){let s=e.holes[t];this.holes.push(s.clone())}return this}toJSON(){let e=super.toJSON();e.uuid=this.uuid,e.holes=[];for(let t=0,n=this.holes.length;t<n;t++){let s=this.holes[t];e.holes.push(s.toJSON())}return e}fromJSON(e){super.fromJSON(e),this.uuid=e.uuid,this.holes=[];for(let t=0,n=e.holes.length;t<n;t++){let s=e.holes[t];this.holes.push(new sr().fromJSON(s))}return this}},lx={triangulate:function(i,e,t=2){let n=e&&e.length,s=n?e[0]*t:i.length,r=tf(i,0,s,t,!0),o=[];if(!r||r.next===r.prev)return o;let a,c,l,h,u,d,f;if(n&&(r=px(i,e,r,t)),i.length>80*t){a=l=i[0],c=h=i[1];for(let g=t;g<s;g+=t)u=i[g],d=i[g+1],u<a&&(a=u),d<c&&(c=d),u>l&&(l=u),d>h&&(h=d);f=Math.max(l-a,h-c),f=f!==0?32767/f:0}return or(r,o,t,a,c,f,0),o}};function tf(i,e,t,n,s){let r,o;if(s===Tx(i,e,t,n)>0)for(r=e;r<t;r+=n)o=Ed(r,i[r],i[r+1],o);else for(r=t-n;r>=e;r-=n)o=Ed(r,i[r],i[r+1],o);return o&&Qo(o,o.next)&&(cr(o),o=o.next),o}function Ei(i,e){if(!i)return i;e||(e=i);let t=i,n;do if(n=!1,!t.steiner&&(Qo(t,t.next)||xt(t.prev,t,t.next)===0)){if(cr(t),t=e=t.prev,t===t.next)break;n=!0}else t=t.next;while(n||t!==e);return e}function or(i,e,t,n,s,r,o){if(!i)return;!o&&r&&xx(i,n,s,r);let a=i,c,l;for(;i.prev!==i.next;){if(c=i.prev,l=i.next,r?ux(i,n,s,r):hx(i)){e.push(c.i/t|0),e.push(i.i/t|0),e.push(l.i/t|0),cr(i),i=l.next,a=l.next;continue}if(i=l,i===a){o?o===1?(i=dx(Ei(i),e,t),or(i,e,t,n,s,r,2)):o===2&&fx(i,e,t,n,s,r):or(Ei(i),e,t,n,s,r,1);break}}}function hx(i){let e=i.prev,t=i,n=i.next;if(xt(e,t,n)>=0)return!1;let s=e.x,r=t.x,o=n.x,a=e.y,c=t.y,l=n.y,h=s<r?s<o?s:o:r<o?r:o,u=a<c?a<l?a:l:c<l?c:l,d=s>r?s>o?s:o:r>o?r:o,f=a>c?a>l?a:l:c>l?c:l,g=n.next;for(;g!==e;){if(g.x>=h&&g.x<=d&&g.y>=u&&g.y<=f&&ns(s,a,r,c,o,l,g.x,g.y)&&xt(g.prev,g,g.next)>=0)return!1;g=g.next}return!0}function ux(i,e,t,n){let s=i.prev,r=i,o=i.next;if(xt(s,r,o)>=0)return!1;let a=s.x,c=r.x,l=o.x,h=s.y,u=r.y,d=o.y,f=a<c?a<l?a:l:c<l?c:l,g=h<u?h<d?h:d:u<d?u:d,y=a>c?a>l?a:l:c>l?c:l,m=h>u?h>d?h:d:u>d?u:d,p=Rl(f,g,e,t,n),b=Rl(y,m,e,t,n),x=i.prevZ,M=i.nextZ;for(;x&&x.z>=p&&M&&M.z<=b;){if(x.x>=f&&x.x<=y&&x.y>=g&&x.y<=m&&x!==s&&x!==o&&ns(a,h,c,u,l,d,x.x,x.y)&&xt(x.prev,x,x.next)>=0||(x=x.prevZ,M.x>=f&&M.x<=y&&M.y>=g&&M.y<=m&&M!==s&&M!==o&&ns(a,h,c,u,l,d,M.x,M.y)&&xt(M.prev,M,M.next)>=0))return!1;M=M.nextZ}for(;x&&x.z>=p;){if(x.x>=f&&x.x<=y&&x.y>=g&&x.y<=m&&x!==s&&x!==o&&ns(a,h,c,u,l,d,x.x,x.y)&&xt(x.prev,x,x.next)>=0)return!1;x=x.prevZ}for(;M&&M.z<=b;){if(M.x>=f&&M.x<=y&&M.y>=g&&M.y<=m&&M!==s&&M!==o&&ns(a,h,c,u,l,d,M.x,M.y)&&xt(M.prev,M,M.next)>=0)return!1;M=M.nextZ}return!0}function dx(i,e,t){let n=i;do{let s=n.prev,r=n.next.next;!Qo(s,r)&&nf(s,n,n.next,r)&&ar(s,r)&&ar(r,s)&&(e.push(s.i/t|0),e.push(n.i/t|0),e.push(r.i/t|0),cr(n),cr(n.next),n=i=r),n=n.next}while(n!==i);return Ei(n)}function fx(i,e,t,n,s,r){let o=i;do{let a=o.next.next;for(;a!==o.prev;){if(o.i!==a.i&&bx(o,a)){let c=sf(o,a);o=Ei(o,o.next),c=Ei(c,c.next),or(o,e,t,n,s,r,0),or(c,e,t,n,s,r,0);return}a=a.next}o=o.next}while(o!==i)}function px(i,e,t,n){let s=[],r,o,a,c,l;for(r=0,o=e.length;r<o;r++)a=e[r]*n,c=r<o-1?e[r+1]*n:i.length,l=tf(i,a,c,n,!1),l===l.next&&(l.steiner=!0),s.push(Mx(l));for(s.sort(mx),r=0;r<s.length;r++)t=gx(s[r],t);return t}function mx(i,e){return i.x-e.x}function gx(i,e){let t=_x(i,e);if(!t)return e;let n=sf(t,i);return Ei(n,n.next),Ei(t,t.next)}function _x(i,e){let t=e,n=-1/0,s,r=i.x,o=i.y;do{if(o<=t.y&&o>=t.next.y&&t.next.y!==t.y){let d=t.x+(o-t.y)*(t.next.x-t.x)/(t.next.y-t.y);if(d<=r&&d>n&&(n=d,s=t.x<t.next.x?t:t.next,d===r))return s}t=t.next}while(t!==e);if(!s)return null;let a=s,c=s.x,l=s.y,h=1/0,u;t=s;do r>=t.x&&t.x>=c&&r!==t.x&&ns(o<l?r:n,o,c,l,o<l?n:r,o,t.x,t.y)&&(u=Math.abs(o-t.y)/(r-t.x),ar(t,i)&&(u<h||u===h&&(t.x>s.x||t.x===s.x&&yx(s,t)))&&(s=t,h=u)),t=t.next;while(t!==a);return s}function yx(i,e){return xt(i.prev,i,e.prev)<0&&xt(e.next,i,i.next)<0}function xx(i,e,t,n){let s=i;do s.z===0&&(s.z=Rl(s.x,s.y,e,t,n)),s.prevZ=s.prev,s.nextZ=s.next,s=s.next;while(s!==i);s.prevZ.nextZ=null,s.prevZ=null,vx(s)}function vx(i){let e,t,n,s,r,o,a,c,l=1;do{for(t=i,i=null,r=null,o=0;t;){for(o++,n=t,a=0,e=0;e<l&&(a++,n=n.nextZ,!!n);e++);for(c=l;a>0||c>0&&n;)a!==0&&(c===0||!n||t.z<=n.z)?(s=t,t=t.nextZ,a--):(s=n,n=n.nextZ,c--),r?r.nextZ=s:i=s,s.prevZ=r,r=s;t=n}r.nextZ=null,l*=2}while(o>1);return i}function Rl(i,e,t,n,s){return i=(i-t)*s|0,e=(e-n)*s|0,i=(i|i<<8)&16711935,i=(i|i<<4)&252645135,i=(i|i<<2)&858993459,i=(i|i<<1)&1431655765,e=(e|e<<8)&16711935,e=(e|e<<4)&252645135,e=(e|e<<2)&858993459,e=(e|e<<1)&1431655765,i|e<<1}function Mx(i){let e=i,t=i;do(e.x<t.x||e.x===t.x&&e.y<t.y)&&(t=e),e=e.next;while(e!==i);return t}function ns(i,e,t,n,s,r,o,a){return(s-o)*(e-a)>=(i-o)*(r-a)&&(i-o)*(n-a)>=(t-o)*(e-a)&&(t-o)*(r-a)>=(s-o)*(n-a)}function bx(i,e){return i.next.i!==e.i&&i.prev.i!==e.i&&!Sx(i,e)&&(ar(i,e)&&ar(e,i)&&Ex(i,e)&&(xt(i.prev,i,e.prev)||xt(i,e.prev,e))||Qo(i,e)&&xt(i.prev,i,i.next)>0&&xt(e.prev,e,e.next)>0)}function xt(i,e,t){return(e.y-i.y)*(t.x-e.x)-(e.x-i.x)*(t.y-e.y)}function Qo(i,e){return i.x===e.x&&i.y===e.y}function nf(i,e,t,n){let s=ao(xt(i,e,t)),r=ao(xt(i,e,n)),o=ao(xt(t,n,i)),a=ao(xt(t,n,e));return!!(s!==r&&o!==a||s===0&&oo(i,t,e)||r===0&&oo(i,n,e)||o===0&&oo(t,i,n)||a===0&&oo(t,e,n))}function oo(i,e,t){return e.x<=Math.max(i.x,t.x)&&e.x>=Math.min(i.x,t.x)&&e.y<=Math.max(i.y,t.y)&&e.y>=Math.min(i.y,t.y)}function ao(i){return i>0?1:i<0?-1:0}function Sx(i,e){let t=i;do{if(t.i!==i.i&&t.next.i!==i.i&&t.i!==e.i&&t.next.i!==e.i&&nf(t,t.next,i,e))return!0;t=t.next}while(t!==i);return!1}function ar(i,e){return xt(i.prev,i,i.next)<0?xt(i,e,i.next)>=0&&xt(i,i.prev,e)>=0:xt(i,e,i.prev)<0||xt(i,i.next,e)<0}function Ex(i,e){let t=i,n=!1,s=(i.x+e.x)/2,r=(i.y+e.y)/2;do t.y>r!=t.next.y>r&&t.next.y!==t.y&&s<(t.next.x-t.x)*(r-t.y)/(t.next.y-t.y)+t.x&&(n=!n),t=t.next;while(t!==i);return n}function sf(i,e){let t=new Pl(i.i,i.x,i.y),n=new Pl(e.i,e.x,e.y),s=i.next,r=e.prev;return i.next=e,e.prev=i,t.next=s,s.prev=t,n.next=t,t.prev=n,r.next=n,n.prev=r,n}function Ed(i,e,t,n){let s=new Pl(i,e,t);return n?(s.next=n.next,s.prev=n,n.next.prev=s,n.next=s):(s.prev=s,s.next=s),s}function cr(i){i.next.prev=i.prev,i.prev.next=i.next,i.prevZ&&(i.prevZ.nextZ=i.nextZ),i.nextZ&&(i.nextZ.prevZ=i.prevZ)}function Pl(i,e,t){this.i=i,this.x=e,this.y=t,this.prev=null,this.next=null,this.z=0,this.prevZ=null,this.nextZ=null,this.steiner=!1}function Tx(i,e,t,n){let s=0;for(let r=e,o=t-n;r<t;r+=n)s+=(i[o]-i[r])*(i[r+1]+i[o+1]),o=r;return s}var $s=class i{static area(e){let t=e.length,n=0;for(let s=t-1,r=0;r<t;s=r++)n+=e[s].x*e[r].y-e[r].x*e[s].y;return n*.5}static isClockWise(e){return i.area(e)<0}static triangulateShape(e,t){let n=[],s=[],r=[];Td(e),wd(n,e);let o=e.length;t.forEach(Td);for(let c=0;c<t.length;c++)s.push(o),o+=t[c].length,wd(n,t[c]);let a=lx.triangulate(n,s);for(let c=0;c<a.length;c+=3)r.push(a.slice(c,c+3));return r}};function Td(i){let e=i.length;e>2&&i[e-1].equals(i[0])&&i.pop()}function wd(i,e){for(let t=0;t<e.length;t++)i.push(e[t].x),i.push(e[t].y)}var Xo=class i extends Dt{constructor(e=new rr([new le(.5,.5),new le(-.5,.5),new le(-.5,-.5),new le(.5,-.5)]),t={}){super(),this.type="ExtrudeGeometry",this.parameters={shapes:e,options:t},e=Array.isArray(e)?e:[e];let n=this,s=[],r=[];for(let a=0,c=e.length;a<c;a++){let l=e[a];o(l)}this.setAttribute("position",new lt(s,3)),this.setAttribute("uv",new lt(r,2)),this.computeVertexNormals();function o(a){let c=[],l=t.curveSegments!==void 0?t.curveSegments:12,h=t.steps!==void 0?t.steps:1,u=t.depth!==void 0?t.depth:1,d=t.bevelEnabled!==void 0?t.bevelEnabled:!0,f=t.bevelThickness!==void 0?t.bevelThickness:.2,g=t.bevelSize!==void 0?t.bevelSize:f-.1,y=t.bevelOffset!==void 0?t.bevelOffset:0,m=t.bevelSegments!==void 0?t.bevelSegments:3,p=t.extrudePath,b=t.UVGenerator!==void 0?t.UVGenerator:wx,x,M=!1,D,w,R,P;p&&(x=p.getSpacedPoints(h),M=!0,d=!1,D=p.computeFrenetFrames(h,!1),w=new A,R=new A,P=new A),d||(m=0,f=0,g=0,y=0);let H=a.extractPoints(l),_=H.shape,S=H.holes;if(!$s.isClockWise(_)){_=_.reverse();for(let ee=0,C=S.length;ee<C;ee++){let fe=S[ee];$s.isClockWise(fe)&&(S[ee]=fe.reverse())}}let I=$s.triangulateShape(_,S),k=_;for(let ee=0,C=S.length;ee<C;ee++){let fe=S[ee];_=_.concat(fe)}function K(ee,C,fe){return C||console.error("THREE.ExtrudeGeometry: vec does not exist"),ee.clone().addScaledVector(C,fe)}let G=_.length,ce=I.length;function X(ee,C,fe){let de,ae,ge,ke=ee.x-C.x,be=ee.y-C.y,T=fe.x-ee.x,v=fe.y-ee.y,B=ke*ke+be*be,$=ke*v-be*T;if(Math.abs($)>Number.EPSILON){let ne=Math.sqrt(B),Z=Math.sqrt(T*T+v*v),Le=C.x-be/ne,_e=C.y+ke/ne,L=fe.x-v/Z,q=fe.y+T/Z,F=((L-Le)*v-(q-_e)*T)/(ke*v-be*T);de=Le+ke*F-ee.x,ae=_e+be*F-ee.y;let ie=de*de+ae*ae;if(ie<=2)return new le(de,ae);ge=Math.sqrt(ie/2)}else{let ne=!1;ke>Number.EPSILON?T>Number.EPSILON&&(ne=!0):ke<-Number.EPSILON?T<-Number.EPSILON&&(ne=!0):Math.sign(be)===Math.sign(v)&&(ne=!0),ne?(de=-be,ae=ke,ge=Math.sqrt(B)):(de=ke,ae=be,ge=Math.sqrt(B/2))}return new le(de/ge,ae/ge)}let ve=[];for(let ee=0,C=k.length,fe=C-1,de=ee+1;ee<C;ee++,fe++,de++)fe===C&&(fe=0),de===C&&(de=0),ve[ee]=X(k[ee],k[fe],k[de]);let Me=[],Se,Ke=ve.concat();for(let ee=0,C=S.length;ee<C;ee++){let fe=S[ee];Se=[];for(let de=0,ae=fe.length,ge=ae-1,ke=de+1;de<ae;de++,ge++,ke++)ge===ae&&(ge=0),ke===ae&&(ke=0),Se[de]=X(fe[de],fe[ge],fe[ke]);Me.push(Se),Ke=Ke.concat(Se)}for(let ee=0;ee<m;ee++){let C=ee/m,fe=f*Math.cos(C*Math.PI/2),de=g*Math.sin(C*Math.PI/2)+y;for(let ae=0,ge=k.length;ae<ge;ae++){let ke=K(k[ae],ve[ae],de);me(ke.x,ke.y,-fe)}for(let ae=0,ge=S.length;ae<ge;ae++){let ke=S[ae];Se=Me[ae];for(let be=0,T=ke.length;be<T;be++){let v=K(ke[be],Se[be],de);me(v.x,v.y,-fe)}}}let nt=g+y;for(let ee=0;ee<G;ee++){let C=d?K(_[ee],Ke[ee],nt):_[ee];M?(R.copy(D.normals[0]).multiplyScalar(C.x),w.copy(D.binormals[0]).multiplyScalar(C.y),P.copy(x[0]).add(R).add(w),me(P.x,P.y,P.z)):me(C.x,C.y,0)}for(let ee=1;ee<=h;ee++)for(let C=0;C<G;C++){let fe=d?K(_[C],Ke[C],nt):_[C];M?(R.copy(D.normals[ee]).multiplyScalar(fe.x),w.copy(D.binormals[ee]).multiplyScalar(fe.y),P.copy(x[ee]).add(R).add(w),me(P.x,P.y,P.z)):me(fe.x,fe.y,u/h*ee)}for(let ee=m-1;ee>=0;ee--){let C=ee/m,fe=f*Math.cos(C*Math.PI/2),de=g*Math.sin(C*Math.PI/2)+y;for(let ae=0,ge=k.length;ae<ge;ae++){let ke=K(k[ae],ve[ae],de);me(ke.x,ke.y,u+fe)}for(let ae=0,ge=S.length;ae<ge;ae++){let ke=S[ae];Se=Me[ae];for(let be=0,T=ke.length;be<T;be++){let v=K(ke[be],Se[be],de);M?me(v.x,v.y+x[h-1].y,x[h-1].x+fe):me(v.x,v.y,u+fe)}}}J(),oe();function J(){let ee=s.length/3;if(d){let C=0,fe=G*C;for(let de=0;de<ce;de++){let ae=I[de];te(ae[2]+fe,ae[1]+fe,ae[0]+fe)}C=h+m*2,fe=G*C;for(let de=0;de<ce;de++){let ae=I[de];te(ae[0]+fe,ae[1]+fe,ae[2]+fe)}}else{for(let C=0;C<ce;C++){let fe=I[C];te(fe[2],fe[1],fe[0])}for(let C=0;C<ce;C++){let fe=I[C];te(fe[0]+G*h,fe[1]+G*h,fe[2]+G*h)}}n.addGroup(ee,s.length/3-ee,0)}function oe(){let ee=s.length/3,C=0;Re(k,C),C+=k.length;for(let fe=0,de=S.length;fe<de;fe++){let ae=S[fe];Re(ae,C),C+=ae.length}n.addGroup(ee,s.length/3-ee,1)}function Re(ee,C){let fe=ee.length;for(;--fe>=0;){let de=fe,ae=fe-1;ae<0&&(ae=ee.length-1);for(let ge=0,ke=h+m*2;ge<ke;ge++){let be=G*ge,T=G*(ge+1),v=C+de+be,B=C+ae+be,$=C+ae+T,ne=C+de+T;xe(v,B,$,ne)}}}function me(ee,C,fe){c.push(ee),c.push(C),c.push(fe)}function te(ee,C,fe){Ve(ee),Ve(C),Ve(fe);let de=s.length/3,ae=b.generateTopUV(n,s,de-3,de-2,de-1);ze(ae[0]),ze(ae[1]),ze(ae[2])}function xe(ee,C,fe,de){Ve(ee),Ve(C),Ve(de),Ve(C),Ve(fe),Ve(de);let ae=s.length/3,ge=b.generateSideWallUV(n,s,ae-6,ae-3,ae-2,ae-1);ze(ge[0]),ze(ge[1]),ze(ge[3]),ze(ge[1]),ze(ge[2]),ze(ge[3])}function Ve(ee){s.push(c[ee*3+0]),s.push(c[ee*3+1]),s.push(c[ee*3+2])}function ze(ee){r.push(ee.x),r.push(ee.y)}}}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}toJSON(){let e=super.toJSON(),t=this.parameters.shapes,n=this.parameters.options;return Cx(t,n,e)}static fromJSON(e,t){let n=[];for(let r=0,o=e.shapes.length;r<o;r++){let a=t[e.shapes[r]];n.push(a)}let s=e.options.extrudePath;return s!==void 0&&(e.options.extrudePath=new Tl[s.type]().fromJSON(s)),new i(n,e.options)}},wx={generateTopUV:function(i,e,t,n,s){let r=e[t*3],o=e[t*3+1],a=e[n*3],c=e[n*3+1],l=e[s*3],h=e[s*3+1];return[new le(r,o),new le(a,c),new le(l,h)]},generateSideWallUV:function(i,e,t,n,s,r){let o=e[t*3],a=e[t*3+1],c=e[t*3+2],l=e[n*3],h=e[n*3+1],u=e[n*3+2],d=e[s*3],f=e[s*3+1],g=e[s*3+2],y=e[r*3],m=e[r*3+1],p=e[r*3+2];return Math.abs(a-h)<Math.abs(o-l)?[new le(o,1-c),new le(l,1-u),new le(d,1-g),new le(y,1-p)]:[new le(a,1-c),new le(h,1-u),new le(f,1-g),new le(m,1-p)]}};function Cx(i,e,t){if(t.shapes=[],Array.isArray(i))for(let n=0,s=i.length;n<s;n++){let r=i[n];t.shapes.push(r.uuid)}else t.shapes.push(i.uuid);return t.options=Object.assign({},e),e.extrudePath!==void 0&&(t.options.extrudePath=e.extrudePath.toJSON()),t}var Ti=class i extends Al{constructor(e=1,t=0){let n=(1+Math.sqrt(5))/2,s=[-1,n,0,1,n,0,-1,-n,0,1,-n,0,0,-1,n,0,1,n,0,-1,-n,0,1,-n,n,0,-1,n,0,1,-n,0,-1,-n,0,1],r=[0,11,5,0,5,1,0,1,7,0,7,10,0,10,11,1,5,9,5,11,4,11,10,2,10,7,6,7,1,8,3,9,4,3,4,2,3,2,6,3,6,8,3,8,9,4,9,5,2,4,11,6,2,10,8,6,7,9,8,1];super(s,r,e,t),this.type="IcosahedronGeometry",this.parameters={radius:e,detail:t}}static fromJSON(e){return new i(e.radius,e.detail)}};var Ut=class i extends Dt{constructor(e=1,t=32,n=16,s=0,r=Math.PI*2,o=0,a=Math.PI){super(),this.type="SphereGeometry",this.parameters={radius:e,widthSegments:t,heightSegments:n,phiStart:s,phiLength:r,thetaStart:o,thetaLength:a},t=Math.max(3,Math.floor(t)),n=Math.max(2,Math.floor(n));let c=Math.min(o+a,Math.PI),l=0,h=[],u=new A,d=new A,f=[],g=[],y=[],m=[];for(let p=0;p<=n;p++){let b=[],x=p/n,M=0;p===0&&o===0?M=.5/t:p===n&&c===Math.PI&&(M=-.5/t);for(let D=0;D<=t;D++){let w=D/t;u.x=-e*Math.cos(s+w*r)*Math.sin(o+x*a),u.y=e*Math.cos(o+x*a),u.z=e*Math.sin(s+w*r)*Math.sin(o+x*a),g.push(u.x,u.y,u.z),d.copy(u).normalize(),y.push(d.x,d.y,d.z),m.push(w+M,1-x),b.push(l++)}h.push(b)}for(let p=0;p<n;p++)for(let b=0;b<t;b++){let x=h[p][b+1],M=h[p][b],D=h[p+1][b],w=h[p+1][b+1];(p!==0||o>0)&&f.push(x,M,w),(p!==n-1||c<Math.PI)&&f.push(M,D,w)}this.setIndex(f),this.setAttribute("position",new lt(g,3)),this.setAttribute("normal",new lt(y,3)),this.setAttribute("uv",new lt(m,2))}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}static fromJSON(e){return new i(e.radius,e.widthSegments,e.heightSegments,e.phiStart,e.phiLength,e.thetaStart,e.thetaLength)}};var sn=class i extends Dt{constructor(e=1,t=.4,n=12,s=48,r=Math.PI*2){super(),this.type="TorusGeometry",this.parameters={radius:e,tube:t,radialSegments:n,tubularSegments:s,arc:r},n=Math.floor(n),s=Math.floor(s);let o=[],a=[],c=[],l=[],h=new A,u=new A,d=new A;for(let f=0;f<=n;f++)for(let g=0;g<=s;g++){let y=g/s*r,m=f/n*Math.PI*2;u.x=(e+t*Math.cos(m))*Math.cos(y),u.y=(e+t*Math.cos(m))*Math.sin(y),u.z=t*Math.sin(m),a.push(u.x,u.y,u.z),h.x=e*Math.cos(y),h.y=e*Math.sin(y),d.subVectors(u,h).normalize(),c.push(d.x,d.y,d.z),l.push(g/s),l.push(f/n)}for(let f=1;f<=n;f++)for(let g=1;g<=s;g++){let y=(s+1)*f+g-1,m=(s+1)*(f-1)+g-1,p=(s+1)*(f-1)+g,b=(s+1)*f+g;o.push(y,m,b),o.push(m,p,b)}this.setIndex(o),this.setAttribute("position",new lt(a,3)),this.setAttribute("normal",new lt(c,3)),this.setAttribute("uv",new lt(l,2))}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}static fromJSON(e){return new i(e.radius,e.tube,e.radialSegments,e.tubularSegments,e.arc)}};var wi=class extends Wn{constructor(e){super(),this.isMeshStandardMaterial=!0,this.defines={STANDARD:""},this.type="MeshStandardMaterial",this.color=new Qe(16777215),this.roughness=1,this.metalness=0,this.map=null,this.lightMap=null,this.lightMapIntensity=1,this.aoMap=null,this.aoMapIntensity=1,this.emissive=new Qe(0),this.emissiveIntensity=1,this.emissiveMap=null,this.bumpMap=null,this.bumpScale=1,this.normalMap=null,this.normalMapType=Wd,this.normalScale=new le(1,1),this.displacementMap=null,this.displacementScale=1,this.displacementBias=0,this.roughnessMap=null,this.metalnessMap=null,this.alphaMap=null,this.envMap=null,this.envMapRotation=new Cn,this.envMapIntensity=1,this.wireframe=!1,this.wireframeLinewidth=1,this.wireframeLinecap="round",this.wireframeLinejoin="round",this.flatShading=!1,this.fog=!0,this.setValues(e)}copy(e){return super.copy(e),this.defines={STANDARD:""},this.color.copy(e.color),this.roughness=e.roughness,this.metalness=e.metalness,this.map=e.map,this.lightMap=e.lightMap,this.lightMapIntensity=e.lightMapIntensity,this.aoMap=e.aoMap,this.aoMapIntensity=e.aoMapIntensity,this.emissive.copy(e.emissive),this.emissiveMap=e.emissiveMap,this.emissiveIntensity=e.emissiveIntensity,this.bumpMap=e.bumpMap,this.bumpScale=e.bumpScale,this.normalMap=e.normalMap,this.normalMapType=e.normalMapType,this.normalScale.copy(e.normalScale),this.displacementMap=e.displacementMap,this.displacementScale=e.displacementScale,this.displacementBias=e.displacementBias,this.roughnessMap=e.roughnessMap,this.metalnessMap=e.metalnessMap,this.alphaMap=e.alphaMap,this.envMap=e.envMap,this.envMapRotation.copy(e.envMapRotation),this.envMapIntensity=e.envMapIntensity,this.wireframe=e.wireframe,this.wireframeLinewidth=e.wireframeLinewidth,this.wireframeLinecap=e.wireframeLinecap,this.wireframeLinejoin=e.wireframeLinejoin,this.flatShading=e.flatShading,this.fog=e.fog,this}};function co(i,e,t){return!i||!t&&i.constructor===e?i:typeof e.BYTES_PER_ELEMENT=="number"?new e(i):Array.prototype.slice.call(i)}function Ax(i){return ArrayBuffer.isView(i)&&!(i instanceof DataView)}var ms=class{constructor(e,t,n,s){this.parameterPositions=e,this._cachedIndex=0,this.resultBuffer=s!==void 0?s:new t.constructor(n),this.sampleValues=t,this.valueSize=n,this.settings=null,this.DefaultSettings_={}}evaluate(e){let t=this.parameterPositions,n=this._cachedIndex,s=t[n],r=t[n-1];n:{e:{let o;t:{i:if(!(e<s)){for(let a=n+2;;){if(s===void 0){if(e<r)break i;return n=t.length,this._cachedIndex=n,this.copySampleValue_(n-1)}if(n===a)break;if(r=s,s=t[++n],e<s)break e}o=t.length;break t}if(!(e>=r)){let a=t[1];e<a&&(n=2,r=a);for(let c=n-2;;){if(r===void 0)return this._cachedIndex=0,this.copySampleValue_(0);if(n===c)break;if(s=r,r=t[--n-1],e>=r)break e}o=n,n=0;break t}break n}for(;n<o;){let a=n+o>>>1;e<t[a]?o=a:n=a+1}if(s=t[n],r=t[n-1],r===void 0)return this._cachedIndex=0,this.copySampleValue_(0);if(s===void 0)return n=t.length,this._cachedIndex=n,this.copySampleValue_(n-1)}this._cachedIndex=n,this.intervalChanged_(n,r,s)}return this.interpolate_(n,r,e,s)}getSettings_(){return this.settings||this.DefaultSettings_}copySampleValue_(e){let t=this.resultBuffer,n=this.sampleValues,s=this.valueSize,r=e*s;for(let o=0;o!==s;++o)t[o]=n[r+o];return t}interpolate_(){throw new Error("call to abstract method")}intervalChanged_(){}},Il=class extends ms{constructor(e,t,n,s){super(e,t,n,s),this._weightPrev=-0,this._offsetPrev=-0,this._weightNext=-0,this._offsetNext=-0,this.DefaultSettings_={endingStart:Cu,endingEnd:Cu}}intervalChanged_(e,t,n){let s=this.parameterPositions,r=e-2,o=e+1,a=s[r],c=s[o];if(a===void 0)switch(this.getSettings_().endingStart){case Au:r=e,a=2*t-n;break;case Ru:r=s.length-2,a=t+s[r]-s[r+1];break;default:r=e,a=n}if(c===void 0)switch(this.getSettings_().endingEnd){case Au:o=e,c=2*n-t;break;case Ru:o=1,c=n+s[1]-s[0];break;default:o=e-1,c=t}let l=(n-t)*.5,h=this.valueSize;this._weightPrev=l/(t-a),this._weightNext=l/(c-n),this._offsetPrev=r*h,this._offsetNext=o*h}interpolate_(e,t,n,s){let r=this.resultBuffer,o=this.sampleValues,a=this.valueSize,c=e*a,l=c-a,h=this._offsetPrev,u=this._offsetNext,d=this._weightPrev,f=this._weightNext,g=(n-t)/(s-t),y=g*g,m=y*g,p=-d*m+2*d*y-d*g,b=(1+d)*m+(-1.5-2*d)*y+(-.5+d)*g+1,x=(-1-f)*m+(1.5+f)*y+.5*g,M=f*m-f*y;for(let D=0;D!==a;++D)r[D]=p*o[h+D]+b*o[l+D]+x*o[c+D]+M*o[u+D];return r}},Ll=class extends ms{constructor(e,t,n,s){super(e,t,n,s)}interpolate_(e,t,n,s){let r=this.resultBuffer,o=this.sampleValues,a=this.valueSize,c=e*a,l=c-a,h=(n-t)/(s-t),u=1-h;for(let d=0;d!==a;++d)r[d]=o[l+d]*u+o[c+d]*h;return r}},Dl=class extends ms{constructor(e,t,n,s){super(e,t,n,s)}interpolate_(e){return this.copySampleValue_(e-1)}},bn=class{constructor(e,t,n,s){if(e===void 0)throw new Error("THREE.KeyframeTrack: track name is undefined");if(t===void 0||t.length===0)throw new Error("THREE.KeyframeTrack: no keyframes in track named "+e);this.name=e,this.times=co(t,this.TimeBufferType),this.values=co(n,this.ValueBufferType),this.setInterpolation(s||this.DefaultInterpolation)}static toJSON(e){let t=e.constructor,n;if(t.toJSON!==this.toJSON)n=t.toJSON(e);else{n={name:e.name,times:co(e.times,Array),values:co(e.values,Array)};let s=e.getInterpolation();s!==e.DefaultInterpolation&&(n.interpolation=s)}return n.type=e.ValueTypeName,n}InterpolantFactoryMethodDiscrete(e){return new Dl(this.times,this.values,this.getValueSize(),e)}InterpolantFactoryMethodLinear(e){return new Ll(this.times,this.values,this.getValueSize(),e)}InterpolantFactoryMethodSmooth(e){return new Il(this.times,this.values,this.getValueSize(),e)}setInterpolation(e){let t;switch(e){case go:t=this.InterpolantFactoryMethodDiscrete;break;case tl:t=this.InterpolantFactoryMethodLinear;break;case ka:t=this.InterpolantFactoryMethodSmooth;break}if(t===void 0){let n="unsupported interpolation for "+this.ValueTypeName+" keyframe track named "+this.name;if(this.createInterpolant===void 0)if(e!==this.DefaultInterpolation)this.setInterpolation(this.DefaultInterpolation);else throw new Error(n);return console.warn("THREE.KeyframeTrack:",n),this}return this.createInterpolant=t,this}getInterpolation(){switch(this.createInterpolant){case this.InterpolantFactoryMethodDiscrete:return go;case this.InterpolantFactoryMethodLinear:return tl;case this.InterpolantFactoryMethodSmooth:return ka}}getValueSize(){return this.values.length/this.times.length}shift(e){if(e!==0){let t=this.times;for(let n=0,s=t.length;n!==s;++n)t[n]+=e}return this}scale(e){if(e!==1){let t=this.times;for(let n=0,s=t.length;n!==s;++n)t[n]*=e}return this}trim(e,t){let n=this.times,s=n.length,r=0,o=s-1;for(;r!==s&&n[r]<e;)++r;for(;o!==-1&&n[o]>t;)--o;if(++o,r!==0||o!==s){r>=o&&(o=Math.max(o,1),r=o-1);let a=this.getValueSize();this.times=n.slice(r,o),this.values=this.values.slice(r*a,o*a)}return this}validate(){let e=!0,t=this.getValueSize();t-Math.floor(t)!==0&&(console.error("THREE.KeyframeTrack: Invalid value size in track.",this),e=!1);let n=this.times,s=this.values,r=n.length;r===0&&(console.error("THREE.KeyframeTrack: Track is empty.",this),e=!1);let o=null;for(let a=0;a!==r;a++){let c=n[a];if(typeof c=="number"&&isNaN(c)){console.error("THREE.KeyframeTrack: Time is not a valid number.",this,a,c),e=!1;break}if(o!==null&&o>c){console.error("THREE.KeyframeTrack: Out of order keys.",this,a,c,o),e=!1;break}o=c}if(s!==void 0&&Ax(s))for(let a=0,c=s.length;a!==c;++a){let l=s[a];if(isNaN(l)){console.error("THREE.KeyframeTrack: Value is not a valid number.",this,a,l),e=!1;break}}return e}optimize(){let e=this.times.slice(),t=this.values.slice(),n=this.getValueSize(),s=this.getInterpolation()===ka,r=e.length-1,o=1;for(let a=1;a<r;++a){let c=!1,l=e[a],h=e[a+1];if(l!==h&&(a!==1||l!==e[0]))if(s)c=!0;else{let u=a*n,d=u-n,f=u+n;for(let g=0;g!==n;++g){let y=t[u+g];if(y!==t[d+g]||y!==t[f+g]){c=!0;break}}}if(c){if(a!==o){e[o]=e[a];let u=a*n,d=o*n;for(let f=0;f!==n;++f)t[d+f]=t[u+f]}++o}}if(r>0){e[o]=e[r];for(let a=r*n,c=o*n,l=0;l!==n;++l)t[c+l]=t[a+l];++o}return o!==e.length?(this.times=e.slice(0,o),this.values=t.slice(0,o*n)):(this.times=e,this.values=t),this}clone(){let e=this.times.slice(),t=this.values.slice(),n=this.constructor,s=new n(this.name,e,t);return s.createInterpolant=this.createInterpolant,s}};bn.prototype.TimeBufferType=Float32Array;bn.prototype.ValueBufferType=Float32Array;bn.prototype.DefaultInterpolation=tl;var Ci=class extends bn{constructor(e,t,n){super(e,t,n)}};Ci.prototype.ValueTypeName="bool";Ci.prototype.ValueBufferType=Array;Ci.prototype.DefaultInterpolation=go;Ci.prototype.InterpolantFactoryMethodLinear=void 0;Ci.prototype.InterpolantFactoryMethodSmooth=void 0;var Ul=class extends bn{};Ul.prototype.ValueTypeName="color";var Nl=class extends bn{};Nl.prototype.ValueTypeName="number";var kl=class extends ms{constructor(e,t,n,s){super(e,t,n,s)}interpolate_(e,t,n,s){let r=this.resultBuffer,o=this.sampleValues,a=this.valueSize,c=(n-t)/(s-t),l=e*a;for(let h=l+a;l!==h;l+=4)ri.slerpFlat(r,0,o,l-a,o,l,c);return r}},qo=class extends bn{InterpolantFactoryMethodLinear(e){return new kl(this.times,this.values,this.getValueSize(),e)}};qo.prototype.ValueTypeName="quaternion";qo.prototype.InterpolantFactoryMethodSmooth=void 0;var Ai=class extends bn{constructor(e,t,n){super(e,t,n)}};Ai.prototype.ValueTypeName="string";Ai.prototype.ValueBufferType=Array;Ai.prototype.DefaultInterpolation=go;Ai.prototype.InterpolantFactoryMethodLinear=void 0;Ai.prototype.InterpolantFactoryMethodSmooth=void 0;var Ol=class extends bn{};Ol.prototype.ValueTypeName="vector";var Fl=class{constructor(e,t,n){let s=this,r=!1,o=0,a=0,c,l=[];this.onStart=void 0,this.onLoad=e,this.onProgress=t,this.onError=n,this.itemStart=function(h){a++,r===!1&&s.onStart!==void 0&&s.onStart(h,o,a),r=!0},this.itemEnd=function(h){o++,s.onProgress!==void 0&&s.onProgress(h,o,a),o===a&&(r=!1,s.onLoad!==void 0&&s.onLoad())},this.itemError=function(h){s.onError!==void 0&&s.onError(h)},this.resolveURL=function(h){return c?c(h):h},this.setURLModifier=function(h){return c=h,this},this.addHandler=function(h,u){return l.push(h,u),this},this.removeHandler=function(h){let u=l.indexOf(h);return u!==-1&&l.splice(u,2),this},this.getHandler=function(h){for(let u=0,d=l.length;u<d;u+=2){let f=l[u],g=l[u+1];if(f.global&&(f.lastIndex=0),f.test(h))return g}return null}}},Rx=new Fl,Bl=class{constructor(e){this.manager=e!==void 0?e:Rx,this.crossOrigin="anonymous",this.withCredentials=!1,this.path="",this.resourcePath="",this.requestHeader={}}load(){}loadAsync(e,t){let n=this;return new Promise(function(s,r){n.load(e,s,t,r)})}parse(){}setCrossOrigin(e){return this.crossOrigin=e,this}setWithCredentials(e){return this.withCredentials=e,this}setPath(e){return this.path=e,this}setResourcePath(e){return this.resourcePath=e,this}setRequestHeader(e){return this.requestHeader=e,this}};Bl.DEFAULT_MATERIAL_NAME="__DEFAULT";var gs=class extends Ft{constructor(e,t=1){super(),this.isLight=!0,this.type="Light",this.color=new Qe(e),this.intensity=t}dispose(){}copy(e,t){return super.copy(e,t),this.color.copy(e.color),this.intensity=e.intensity,this}toJSON(e){let t=super.toJSON(e);return t.object.color=this.color.getHex(),t.object.intensity=this.intensity,this.groundColor!==void 0&&(t.object.groundColor=this.groundColor.getHex()),this.distance!==void 0&&(t.object.distance=this.distance),this.angle!==void 0&&(t.object.angle=this.angle),this.decay!==void 0&&(t.object.decay=this.decay),this.penumbra!==void 0&&(t.object.penumbra=this.penumbra),this.shadow!==void 0&&(t.object.shadow=this.shadow.toJSON()),this.target!==void 0&&(t.object.target=this.target.uuid),t}},lr=class extends gs{constructor(e,t,n){super(e,n),this.isHemisphereLight=!0,this.type="HemisphereLight",this.position.copy(Ft.DEFAULT_UP),this.updateMatrix(),this.groundColor=new Qe(t)}copy(e,t){return super.copy(e,t),this.groundColor.copy(e.groundColor),this}},mc=new _t,Cd=new A,Ad=new A,Yo=class{constructor(e){this.camera=e,this.intensity=1,this.bias=0,this.normalBias=0,this.radius=1,this.blurSamples=8,this.mapSize=new le(512,512),this.map=null,this.mapPass=null,this.matrix=new _t,this.autoUpdate=!0,this.needsUpdate=!1,this._frustum=new Ks,this._frameExtents=new le(1,1),this._viewportCount=1,this._viewports=[new ft(0,0,1,1)]}getViewportCount(){return this._viewportCount}getFrustum(){return this._frustum}updateMatrices(e){let t=this.camera,n=this.matrix;Cd.setFromMatrixPosition(e.matrixWorld),t.position.copy(Cd),Ad.setFromMatrixPosition(e.target.matrixWorld),t.lookAt(Ad),t.updateMatrixWorld(),mc.multiplyMatrices(t.projectionMatrix,t.matrixWorldInverse),this._frustum.setFromProjectionMatrix(mc),n.set(.5,0,0,.5,0,.5,0,.5,0,0,.5,.5,0,0,0,1),n.multiply(mc)}getViewport(e){return this._viewports[e]}getFrameExtents(){return this._frameExtents}dispose(){this.map&&this.map.dispose(),this.mapPass&&this.mapPass.dispose()}copy(e){return this.camera=e.camera.clone(),this.intensity=e.intensity,this.bias=e.bias,this.radius=e.radius,this.mapSize.copy(e.mapSize),this}clone(){return new this.constructor().copy(this)}toJSON(){let e={};return this.intensity!==1&&(e.intensity=this.intensity),this.bias!==0&&(e.bias=this.bias),this.normalBias!==0&&(e.normalBias=this.normalBias),this.radius!==1&&(e.radius=this.radius),(this.mapSize.x!==512||this.mapSize.y!==512)&&(e.mapSize=this.mapSize.toArray()),e.camera=this.camera.toJSON(!1).object,delete e.camera.matrix,e}};var Rd=new _t,Hs=new A,gc=new A,zl=class extends Yo{constructor(){super(new Ot(90,1,.5,500)),this.isPointLightShadow=!0,this._frameExtents=new le(4,2),this._viewportCount=6,this._viewports=[new ft(2,1,1,1),new ft(0,1,1,1),new ft(3,1,1,1),new ft(1,1,1,1),new ft(3,0,1,1),new ft(1,0,1,1)],this._cubeDirections=[new A(1,0,0),new A(-1,0,0),new A(0,0,1),new A(0,0,-1),new A(0,1,0),new A(0,-1,0)],this._cubeUps=[new A(0,1,0),new A(0,1,0),new A(0,1,0),new A(0,1,0),new A(0,0,1),new A(0,0,-1)]}updateMatrices(e,t=0){let n=this.camera,s=this.matrix,r=e.distance||n.far;r!==n.far&&(n.far=r,n.updateProjectionMatrix()),Hs.setFromMatrixPosition(e.matrixWorld),n.position.copy(Hs),gc.copy(n.position),gc.add(this._cubeDirections[t]),n.up.copy(this._cubeUps[t]),n.lookAt(gc),n.updateMatrixWorld(),s.makeTranslation(-Hs.x,-Hs.y,-Hs.z),Rd.multiplyMatrices(n.projectionMatrix,n.matrixWorldInverse),this._frustum.setFromProjectionMatrix(Rd)}},rn=class extends gs{constructor(e,t,n=0,s=2){super(e,t),this.isPointLight=!0,this.type="PointLight",this.distance=n,this.decay=s,this.shadow=new zl}get power(){return this.intensity*4*Math.PI}set power(e){this.intensity=e/(4*Math.PI)}dispose(){this.shadow.dispose()}copy(e,t){return super.copy(e,t),this.distance=e.distance,this.decay=e.decay,this.shadow=e.shadow.clone(),this}},Hl=class extends Yo{constructor(){super(new Po(-5,5,5,-5,.5,500)),this.isDirectionalLightShadow=!0}},_s=class extends gs{constructor(e,t){super(e,t),this.isDirectionalLight=!0,this.type="DirectionalLight",this.position.copy(Ft.DEFAULT_UP),this.updateMatrix(),this.target=new Ft,this.shadow=new Hl}dispose(){this.shadow.dispose()}copy(e){return super.copy(e),this.target=e.target.clone(),this.shadow=e.shadow.clone(),this}},$o=class extends gs{constructor(e,t){super(e,t),this.isAmbientLight=!0,this.type="AmbientLight"}};var Jo=class{constructor(e=!0){this.autoStart=e,this.startTime=0,this.oldTime=0,this.elapsedTime=0,this.running=!1}start(){this.startTime=Pd(),this.oldTime=this.startTime,this.elapsedTime=0,this.running=!0}stop(){this.getElapsedTime(),this.running=!1,this.autoStart=!1}getElapsedTime(){return this.getDelta(),this.elapsedTime}getDelta(){let e=0;if(this.autoStart&&!this.running)return this.start(),0;if(this.running){let t=Pd();e=(t-this.oldTime)/1e3,this.oldTime=t,this.elapsedTime+=e}return e}};function Pd(){return performance.now()}var sh="\\[\\]\\.:\\/",Px=new RegExp("["+sh+"]","g"),rh="[^"+sh+"]",Ix="[^"+sh.replace("\\.","")+"]",Lx=/((?:WC+[\/:])*)/.source.replace("WC",rh),Dx=/(WCOD+)?/.source.replace("WCOD",Ix),Ux=/(?:\.(WC+)(?:\[(.+)\])?)?/.source.replace("WC",rh),Nx=/\.(WC+)(?:\[(.+)\])?/.source.replace("WC",rh),kx=new RegExp("^"+Lx+Dx+Ux+Nx+"$"),Ox=["material","materials","bones","map"],Vl=class{constructor(e,t,n){let s=n||yt.parseTrackName(t);this._targetGroup=e,this._bindings=e.subscribe_(t,s)}getValue(e,t){this.bind();let n=this._targetGroup.nCachedObjects_,s=this._bindings[n];s!==void 0&&s.getValue(e,t)}setValue(e,t){let n=this._bindings;for(let s=this._targetGroup.nCachedObjects_,r=n.length;s!==r;++s)n[s].setValue(e,t)}bind(){let e=this._bindings;for(let t=this._targetGroup.nCachedObjects_,n=e.length;t!==n;++t)e[t].bind()}unbind(){let e=this._bindings;for(let t=this._targetGroup.nCachedObjects_,n=e.length;t!==n;++t)e[t].unbind()}},yt=class i{constructor(e,t,n){this.path=t,this.parsedPath=n||i.parseTrackName(t),this.node=i.findNode(e,this.parsedPath.nodeName),this.rootNode=e,this.getValue=this._getValue_unbound,this.setValue=this._setValue_unbound}static create(e,t,n){return e&&e.isAnimationObjectGroup?new i.Composite(e,t,n):new i(e,t,n)}static sanitizeNodeName(e){return e.replace(/\s/g,"_").replace(Px,"")}static parseTrackName(e){let t=kx.exec(e);if(t===null)throw new Error("PropertyBinding: Cannot parse trackName: "+e);let n={nodeName:t[2],objectName:t[3],objectIndex:t[4],propertyName:t[5],propertyIndex:t[6]},s=n.nodeName&&n.nodeName.lastIndexOf(".");if(s!==void 0&&s!==-1){let r=n.nodeName.substring(s+1);Ox.indexOf(r)!==-1&&(n.nodeName=n.nodeName.substring(0,s),n.objectName=r)}if(n.propertyName===null||n.propertyName.length===0)throw new Error("PropertyBinding: can not parse propertyName from trackName: "+e);return n}static findNode(e,t){if(t===void 0||t===""||t==="."||t===-1||t===e.name||t===e.uuid)return e;if(e.skeleton){let n=e.skeleton.getBoneByName(t);if(n!==void 0)return n}if(e.children){let n=function(r){for(let o=0;o<r.length;o++){let a=r[o];if(a.name===t||a.uuid===t)return a;let c=n(a.children);if(c)return c}return null},s=n(e.children);if(s)return s}return null}_getValue_unavailable(){}_setValue_unavailable(){}_getValue_direct(e,t){e[t]=this.targetObject[this.propertyName]}_getValue_array(e,t){let n=this.resolvedProperty;for(let s=0,r=n.length;s!==r;++s)e[t++]=n[s]}_getValue_arrayElement(e,t){e[t]=this.resolvedProperty[this.propertyIndex]}_getValue_toArray(e,t){this.resolvedProperty.toArray(e,t)}_setValue_direct(e,t){this.targetObject[this.propertyName]=e[t]}_setValue_direct_setNeedsUpdate(e,t){this.targetObject[this.propertyName]=e[t],this.targetObject.needsUpdate=!0}_setValue_direct_setMatrixWorldNeedsUpdate(e,t){this.targetObject[this.propertyName]=e[t],this.targetObject.matrixWorldNeedsUpdate=!0}_setValue_array(e,t){let n=this.resolvedProperty;for(let s=0,r=n.length;s!==r;++s)n[s]=e[t++]}_setValue_array_setNeedsUpdate(e,t){let n=this.resolvedProperty;for(let s=0,r=n.length;s!==r;++s)n[s]=e[t++];this.targetObject.needsUpdate=!0}_setValue_array_setMatrixWorldNeedsUpdate(e,t){let n=this.resolvedProperty;for(let s=0,r=n.length;s!==r;++s)n[s]=e[t++];this.targetObject.matrixWorldNeedsUpdate=!0}_setValue_arrayElement(e,t){this.resolvedProperty[this.propertyIndex]=e[t]}_setValue_arrayElement_setNeedsUpdate(e,t){this.resolvedProperty[this.propertyIndex]=e[t],this.targetObject.needsUpdate=!0}_setValue_arrayElement_setMatrixWorldNeedsUpdate(e,t){this.resolvedProperty[this.propertyIndex]=e[t],this.targetObject.matrixWorldNeedsUpdate=!0}_setValue_fromArray(e,t){this.resolvedProperty.fromArray(e,t)}_setValue_fromArray_setNeedsUpdate(e,t){this.resolvedProperty.fromArray(e,t),this.targetObject.needsUpdate=!0}_setValue_fromArray_setMatrixWorldNeedsUpdate(e,t){this.resolvedProperty.fromArray(e,t),this.targetObject.matrixWorldNeedsUpdate=!0}_getValue_unbound(e,t){this.bind(),this.getValue(e,t)}_setValue_unbound(e,t){this.bind(),this.setValue(e,t)}bind(){let e=this.node,t=this.parsedPath,n=t.objectName,s=t.propertyName,r=t.propertyIndex;if(e||(e=i.findNode(this.rootNode,t.nodeName),this.node=e),this.getValue=this._getValue_unavailable,this.setValue=this._setValue_unavailable,!e){console.warn("THREE.PropertyBinding: No target node found for track: "+this.path+".");return}if(n){let l=t.objectIndex;switch(n){case"materials":if(!e.material){console.error("THREE.PropertyBinding: Can not bind to material as node does not have a material.",this);return}if(!e.material.materials){console.error("THREE.PropertyBinding: Can not bind to material.materials as node.material does not have a materials array.",this);return}e=e.material.materials;break;case"bones":if(!e.skeleton){console.error("THREE.PropertyBinding: Can not bind to bones as node does not have a skeleton.",this);return}e=e.skeleton.bones;for(let h=0;h<e.length;h++)if(e[h].name===l){l=h;break}break;case"map":if("map"in e){e=e.map;break}if(!e.material){console.error("THREE.PropertyBinding: Can not bind to material as node does not have a material.",this);return}if(!e.material.map){console.error("THREE.PropertyBinding: Can not bind to material.map as node.material does not have a map.",this);return}e=e.material.map;break;default:if(e[n]===void 0){console.error("THREE.PropertyBinding: Can not bind to objectName of node undefined.",this);return}e=e[n]}if(l!==void 0){if(e[l]===void 0){console.error("THREE.PropertyBinding: Trying to bind to objectIndex of objectName, but is undefined.",this,e);return}e=e[l]}}let o=e[s];if(o===void 0){let l=t.nodeName;console.error("THREE.PropertyBinding: Trying to update property for track: "+l+"."+s+" but it wasn't found.",e);return}let a=this.Versioning.None;this.targetObject=e,e.needsUpdate!==void 0?a=this.Versioning.NeedsUpdate:e.matrixWorldNeedsUpdate!==void 0&&(a=this.Versioning.MatrixWorldNeedsUpdate);let c=this.BindingType.Direct;if(r!==void 0){if(s==="morphTargetInfluences"){if(!e.geometry){console.error("THREE.PropertyBinding: Can not bind to morphTargetInfluences because node does not have a geometry.",this);return}if(!e.geometry.morphAttributes){console.error("THREE.PropertyBinding: Can not bind to morphTargetInfluences because node does not have a geometry.morphAttributes.",this);return}e.morphTargetDictionary[r]!==void 0&&(r=e.morphTargetDictionary[r])}c=this.BindingType.ArrayElement,this.resolvedProperty=o,this.propertyIndex=r}else o.fromArray!==void 0&&o.toArray!==void 0?(c=this.BindingType.HasFromToArray,this.resolvedProperty=o):Array.isArray(o)?(c=this.BindingType.EntireArray,this.resolvedProperty=o):this.propertyName=s;this.getValue=this.GetterByBindingType[c],this.setValue=this.SetterByBindingTypeAndVersioning[c][a]}unbind(){this.node=null,this.getValue=this._getValue_unbound,this.setValue=this._setValue_unbound}};yt.Composite=Vl;yt.prototype.BindingType={Direct:0,EntireArray:1,ArrayElement:2,HasFromToArray:3};yt.prototype.Versioning={None:0,NeedsUpdate:1,MatrixWorldNeedsUpdate:2};yt.prototype.GetterByBindingType=[yt.prototype._getValue_direct,yt.prototype._getValue_array,yt.prototype._getValue_arrayElement,yt.prototype._getValue_toArray];yt.prototype.SetterByBindingTypeAndVersioning=[[yt.prototype._setValue_direct,yt.prototype._setValue_direct_setNeedsUpdate,yt.prototype._setValue_direct_setMatrixWorldNeedsUpdate],[yt.prototype._setValue_array,yt.prototype._setValue_array_setNeedsUpdate,yt.prototype._setValue_array_setMatrixWorldNeedsUpdate],[yt.prototype._setValue_arrayElement,yt.prototype._setValue_arrayElement_setNeedsUpdate,yt.prototype._setValue_arrayElement_setMatrixWorldNeedsUpdate],[yt.prototype._setValue_fromArray,yt.prototype._setValue_fromArray_setNeedsUpdate,yt.prototype._setValue_fromArray_setMatrixWorldNeedsUpdate]];var lv=new Float32Array(1);typeof __THREE_DEVTOOLS__!="undefined"&&__THREE_DEVTOOLS__.dispatchEvent(new CustomEvent("register",{detail:{revision:Gl}}));typeof window!="undefined"&&(window.__THREE__?console.warn("WARNING: Multiple instances of Three.js being imported."):window.__THREE__=Gl);var ur=class i extends tt{constructor(){let e=i.SkyShader,t=new hn({name:e.name,uniforms:th.clone(e.uniforms),vertexShader:e.vertexShader,fragmentShader:e.fragmentShader,side:Ht,depthWrite:!1});super(new pe(1,1,1),t),this.isSky=!0}};ur.SkyShader={name:"SkyShader",uniforms:{turbidity:{value:2},rayleigh:{value:1},mieCoefficient:{value:.005},mieDirectionalG:{value:.8},sunPosition:{value:new A},up:{value:new A(0,1,0)}},vertexShader:`
		uniform vec3 sunPosition;
		uniform float rayleigh;
		uniform float turbidity;
		uniform float mieCoefficient;
		uniform vec3 up;

		varying vec3 vWorldPosition;
		varying vec3 vSunDirection;
		varying float vSunfade;
		varying vec3 vBetaR;
		varying vec3 vBetaM;
		varying float vSunE;

		// constants for atmospheric scattering
		const float e = 2.71828182845904523536028747135266249775724709369995957;
		const float pi = 3.141592653589793238462643383279502884197169;

		// wavelength of used primaries, according to preetham
		const vec3 lambda = vec3( 680E-9, 550E-9, 450E-9 );
		// this pre-calcuation replaces older TotalRayleigh(vec3 lambda) function:
		// (8.0 * pow(pi, 3.0) * pow(pow(n, 2.0) - 1.0, 2.0) * (6.0 + 3.0 * pn)) / (3.0 * N * pow(lambda, vec3(4.0)) * (6.0 - 7.0 * pn))
		const vec3 totalRayleigh = vec3( 5.804542996261093E-6, 1.3562911419845635E-5, 3.0265902468824876E-5 );

		// mie stuff
		// K coefficient for the primaries
		const float v = 4.0;
		const vec3 K = vec3( 0.686, 0.678, 0.666 );
		// MieConst = pi * pow( ( 2.0 * pi ) / lambda, vec3( v - 2.0 ) ) * K
		const vec3 MieConst = vec3( 1.8399918514433978E14, 2.7798023919660528E14, 4.0790479543861094E14 );

		// earth shadow hack
		// cutoffAngle = pi / 1.95;
		const float cutoffAngle = 1.6110731556870734;
		const float steepness = 1.5;
		const float EE = 1000.0;

		float sunIntensity( float zenithAngleCos ) {
			zenithAngleCos = clamp( zenithAngleCos, -1.0, 1.0 );
			return EE * max( 0.0, 1.0 - pow( e, -( ( cutoffAngle - acos( zenithAngleCos ) ) / steepness ) ) );
		}

		vec3 totalMie( float T ) {
			float c = ( 0.2 * T ) * 10E-18;
			return 0.434 * c * MieConst;
		}

		void main() {

			vec4 worldPosition = modelMatrix * vec4( position, 1.0 );
			vWorldPosition = worldPosition.xyz;

			gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );
			gl_Position.z = gl_Position.w; // set z to camera.far

			vSunDirection = normalize( sunPosition );

			vSunE = sunIntensity( dot( vSunDirection, up ) );

			vSunfade = 1.0 - clamp( 1.0 - exp( ( sunPosition.y / 450000.0 ) ), 0.0, 1.0 );

			float rayleighCoefficient = rayleigh - ( 1.0 * ( 1.0 - vSunfade ) );

			// extinction (absorbtion + out scattering)
			// rayleigh coefficients
			vBetaR = totalRayleigh * rayleighCoefficient;

			// mie coefficients
			vBetaM = totalMie( turbidity ) * mieCoefficient;

		}`,fragmentShader:`
		varying vec3 vWorldPosition;
		varying vec3 vSunDirection;
		varying float vSunfade;
		varying vec3 vBetaR;
		varying vec3 vBetaM;
		varying float vSunE;

		uniform float mieDirectionalG;
		uniform vec3 up;

		// constants for atmospheric scattering
		const float pi = 3.141592653589793238462643383279502884197169;

		const float n = 1.0003; // refractive index of air
		const float N = 2.545E25; // number of molecules per unit volume for air at 288.15K and 1013mb (sea level -45 celsius)

		// optical length at zenith for molecules
		const float rayleighZenithLength = 8.4E3;
		const float mieZenithLength = 1.25E3;
		// 66 arc seconds -> degrees, and the cosine of that
		const float sunAngularDiameterCos = 0.999956676946448443553574619906976478926848692873900859324;

		// 3.0 / ( 16.0 * pi )
		const float THREE_OVER_SIXTEENPI = 0.05968310365946075;
		// 1.0 / ( 4.0 * pi )
		const float ONE_OVER_FOURPI = 0.07957747154594767;

		float rayleighPhase( float cosTheta ) {
			return THREE_OVER_SIXTEENPI * ( 1.0 + pow( cosTheta, 2.0 ) );
		}

		float hgPhase( float cosTheta, float g ) {
			float g2 = pow( g, 2.0 );
			float inverse = 1.0 / pow( 1.0 - 2.0 * g * cosTheta + g2, 1.5 );
			return ONE_OVER_FOURPI * ( ( 1.0 - g2 ) * inverse );
		}

		void main() {

			vec3 direction = normalize( vWorldPosition - cameraPosition );

			// optical length
			// cutoff angle at 90 to avoid singularity in next formula.
			float zenithAngle = acos( max( 0.0, dot( up, direction ) ) );
			float inverse = 1.0 / ( cos( zenithAngle ) + 0.15 * pow( 93.885 - ( ( zenithAngle * 180.0 ) / pi ), -1.253 ) );
			float sR = rayleighZenithLength * inverse;
			float sM = mieZenithLength * inverse;

			// combined extinction factor
			vec3 Fex = exp( -( vBetaR * sR + vBetaM * sM ) );

			// in scattering
			float cosTheta = dot( direction, vSunDirection );

			float rPhase = rayleighPhase( cosTheta * 0.5 + 0.5 );
			vec3 betaRTheta = vBetaR * rPhase;

			float mPhase = hgPhase( cosTheta, mieDirectionalG );
			vec3 betaMTheta = vBetaM * mPhase;

			vec3 Lin = pow( vSunE * ( ( betaRTheta + betaMTheta ) / ( vBetaR + vBetaM ) ) * ( 1.0 - Fex ), vec3( 1.5 ) );
			Lin *= mix( vec3( 1.0 ), pow( vSunE * ( ( betaRTheta + betaMTheta ) / ( vBetaR + vBetaM ) ) * Fex, vec3( 1.0 / 2.0 ) ), clamp( pow( 1.0 - dot( up, vSunDirection ), 5.0 ), 0.0, 1.0 ) );

			// nightsky
			float theta = acos( direction.y ); // elevation --> y-axis, [-pi/2, pi/2]
			float phi = atan( direction.z, direction.x ); // azimuth --> x-axis [-pi/2, pi/2]
			vec2 uv = vec2( phi, theta ) / vec2( 2.0 * pi, pi ) + vec2( 0.5, 0.0 );
			vec3 L0 = vec3( 0.1 ) * Fex;

			// composition + solar disc
			float sundisk = smoothstep( sunAngularDiameterCos, sunAngularDiameterCos + 0.00002, cosTheta );
			L0 += ( vSunE * 19000.0 * Fex ) * sundisk;

			vec3 texColor = ( Lin + L0 ) * 0.04 + vec3( 0.0, 0.0003, 0.00075 );

			vec3 retColor = pow( texColor, vec3( 1.0 / ( 1.2 + ( 1.2 * vSunfade ) ) ) );

			gl_FragColor = vec4( retColor, 1.0 );

			#include <tonemapping_fragment>
			#include <colorspace_fragment>

		}`};function Fx(i){return function(){i|=0,i=i+1831565813|0;let e=Math.imul(i^i>>>15,1|i);return e=e+Math.imul(e^e>>>7,61|e)^e,((e^e>>>14)>>>0)/4294967296}}var dv=Fx(1234567);var Pt=(i,e,t)=>Math.min(t,Math.max(e,i)),dt=(i,e,t)=>i+(e-i)*t;var Ct=(i,e)=>Math.hypot(i.x-e.x,i.z-e.z),vs=(i,e)=>{let t=(e-i)%(Math.PI*2);return t>Math.PI&&(t-=Math.PI*2),t<-Math.PI&&(t+=Math.PI*2),t};var oh=new Map;function ta(i,e,t){let n=document.createElement("canvas");n.width=i,n.height=e;let s=n.getContext("2d");return t(s,i,e),n}function Sn(i,e,t,n,s=1,r=1){let o=i+s+"x"+r;if(oh.has(o))return oh.get(o);let a=ta(e,t,n),c=new Si(a);return c.wrapS=c.wrapT=Js,c.repeat.set(s,r),c.colorSpace=Xt,c.anisotropy=4,oh.set(o,c),c}function ai(i,e,t,n=20,s=2600){for(let r=0;r<s;r++){let o=Math.random()*e,a=Math.random()*t,c=Math.floor(Math.random()*255);i.fillStyle=`rgba(${c},${c},${c},${Math.random()*n/255})`,i.fillRect(o,a,1+Math.random()*2,1+Math.random()*2)}}function na(i,e,t,n,s=26,r=40,o=.12){for(let a=0;a<s;a++){let c=Math.random()*e,l=Math.random()*t,h=8+Math.random()*r,u=i.createRadialGradient(c,l,0,c,l,h);u.addColorStop(0,n),u.addColorStop(1,"rgba(0,0,0,0)"),i.globalAlpha=o,i.fillStyle=u,i.beginPath(),i.arc(c,l,h,0,7),i.fill(),i.globalAlpha=1}}function De(i,e,t,n=.06,s=2){n=Math.min(n,i/2-.001,e/2-.001);let r=new rr,o=-i/2,a=-e/2;r.moveTo(o+n,a),r.lineTo(o+i-n,a),r.quadraticCurveTo(o+i,a,o+i,a+n),r.lineTo(o+i,a+e-n),r.quadraticCurveTo(o+i,a+e,o+i-n,a+e),r.lineTo(o+n,a+e),r.quadraticCurveTo(o,a+e,o,a+e-n),r.lineTo(o,a+n),r.quadraticCurveTo(o,a,o+n,a);let c=new Xo(r,{depth:t,bevelEnabled:!0,bevelSegments:s,steps:1,bevelSize:Math.min(n*.5,.02),bevelThickness:Math.min(n*.5,.02),curveSegments:3});return c.translate(0,0,-t/2),c.computeVertexNormals(),c}function Q(i,e,t=0,n=0,s=0){let r=new tt(i,e);return r.position.set(t,n,s),r.castShadow=!0,r.receiveShadow=!0,r}function j(i,e={}){var t,n,s,r,o;return new wi({color:i,roughness:(t=e.roughness)!=null?t:.75,metalness:(n=e.metalness)!=null?n:.05,map:e.map||null,emissive:e.emissive||0,emissiveIntensity:(s=e.emissiveIntensity)!=null?s:1,transparent:e.transparent||!1,opacity:(r=e.opacity)!=null?r:1,side:e.side||wn,flatShading:e.flat||!1,depthWrite:(o=e.depthWrite)!=null?o:!0})}var ea=class{constructor(){this.list=[]}add(e,t,n,s,r="",o=null){let a={minX:e,maxX:t,minZ:n,maxZ:s,tag:r,ref:o,enabled:!0};return this.list.push(a),a}addFromMesh(e,t=""){let n=new Mn().setFromObject(e);return this.add(n.min.x,n.max.x,n.min.z,n.max.z,t,e)}resolve(e,t){for(let n of this.list){if(!n.enabled)continue;let s=Pt(e.x,n.minX,n.maxX),r=Pt(e.z,n.minZ,n.maxZ),o=e.x-s,a=e.z-r,c=o*o+a*a;if(c<t*t)if(c>1e-6){let l=Math.sqrt(c);e.x=s+o/l*t,e.z=r+a/l*t}else{let l=e.x-n.minX,h=n.maxX-e.x,u=e.z-n.minZ,d=n.maxZ-e.z,f=Math.min(l,h,u,d);f===l?e.x=n.minX-t:f===h?e.x=n.maxX+t:f===u?e.z=n.minZ-t:e.z=n.maxZ+t}}return e}blocked(e,t,n,s){let r=n-e,o=s-t;for(let a of this.list)if(!(!a.enabled||a.tag==="noLOS")&&Bx(e,t,r,o,a))return!0;return!1}};function Bx(i,e,t,n,s){let r=0,o=1;if(Math.abs(t)<1e-8){if(i<s.minX||i>s.maxX)return!1}else{let a=(s.minX-i)/t,c=(s.maxX-i)/t;if(a>c){let l=a;a=c,c=l}if(r=Math.max(r,a),o=Math.min(o,c),r>o)return!1}if(Math.abs(n)<1e-8){if(e<s.minZ||e>s.maxZ)return!1}else{let a=(s.minZ-e)/n,c=(s.maxZ-e)/n;if(a>c){let l=a;a=c,c=l}if(r=Math.max(r,a),o=Math.min(o,c),r>o)return!1}return!0}function rf(i,e={}){let t=e.w||256,n=e.h||64,s=ta(t,n,c=>{c.clearRect(0,0,t,n),c.font=`700 ${e.size||34}px system-ui, sans-serif`,c.textAlign="center",c.textBaseline="middle",c.fillStyle="rgba(8,8,10,.82)";let l=14,h=c.measureText(i).width;zx(c,t/2-h/2-l,6,h+l*2,n-12,10),c.fill(),c.fillStyle=e.color||"#ffe9a8",c.fillText(i,t/2,n/2+1)}),r=new Si(s);r.colorSpace=Xt;let o=new tr({map:r,transparent:!0,depthWrite:!1}),a=new No(o);return a.scale.set((e.scale||1)*(t/100),(e.scale||1)*(n/100),1),a}function zx(i,e,t,n,s,r){i.beginPath(),i.moveTo(e+r,t),i.arcTo(e+n,t,e+n,t+s,r),i.arcTo(e+n,t+s,e,t+s,r),i.arcTo(e,t+s,e,t,r),i.arcTo(e,t,e+n,t,r),i.closePath()}var of={},af={},lf=(i,e)=>of[i]||(of[i]=e()),He=(i,e={})=>{var n,s,r;let t=i+"|"+((n=e.roughness)!=null?n:.75)+"|"+((s=e.metalness)!=null?s:.05)+"|"+((r=e.emissive)!=null?r:0);return af[t]||(af[t]=j(i,e))},ci=(i,e)=>lf("cap"+i+e,()=>new ps(i,e,4,10));function he(i,e,t,n=0,s=0,r=0){let o=new tt(i,e);return o.position.set(n,s,r),o.castShadow=!0,o.receiveShadow=!0,t.add(o),o}var Ms=(i,e=12)=>lf("sph"+i+e,()=>new Ut(i,e,Math.max(6,e-4))),qt={fists:{name:"\u041A\u0443\u043B\u0430\u043A\u0438",icon:"\u{1F44A}",dmg:26,rate:.42,melee:!0,ammo:null,desc:"\u0420\u0443\u043A\u0438 \u2014 \u0431\u0435\u0441\u043F\u043B\u0430\u0442\u043D\u043E \u0438 \u0441\u0435\u0440\u0434\u0438\u0442\u043E."},knife:{name:"\u041D\u043E\u0436",icon:"\u{1F52A}",dmg:55,rate:.5,melee:!0,ammo:null,price:140,desc:"\u0422\u0438\u0445\u0438\u0439, \u0434\u0435\u0448\u0451\u0432\u044B\u0439, \u0443\u0431\u0435\u0434\u0438\u0442\u0435\u043B\u044C\u043D\u044B\u0439. \u0411\u043B\u0438\u0436\u043D\u0438\u0439 \u0431\u043E\u0439."},baton:{name:"\u0414\u0443\u0431\u0438\u043D\u043A\u0430",icon:"\u{1F3D2}",dmg:34,rate:.55,melee:!0,ammo:null,price:90,desc:"\u0420\u0435\u0437\u0438\u043D\u043E\u0432\u0430\u044F. \u041D\u0435 \u0443\u0431\u0438\u0432\u0430\u0435\u0442, \u043D\u043E \u043E\u0431\u044A\u044F\u0441\u043D\u044F\u0435\u0442."},pistol:{name:"\u041F\u0438\u0441\u0442\u043E\u043B\u0435\u0442 \xAB\u0413\u0440\u043E\u0437\u0430\xBB",icon:"\u{1F52B}",dmg:42,rate:.22,ammo:"9\u043C\u043C",mag:12,price:420,ammoPrice:14,spread:.012,range:60,desc:"\u041D\u0430\u0434\u0451\u0436\u043D\u044B\u0439 9\u043C\u043C. 12 \u043F\u0430\u0442\u0440\u043E\u043D\u043E\u0432 \u0432 \u043C\u0430\u0433\u0430\u0437\u0438\u043D\u0435."},shotgun:{name:"\u0414\u0440\u043E\u0431\u043E\u0432\u0438\u043A \xAB\u041A\u0430\u0431\u0430\u043D\xBB",icon:"\u{1F4A5}",dmg:96,rate:.85,ammo:"12\u043A",mag:6,price:980,ammoPrice:26,spread:.055,range:28,desc:"\u0414\u0432\u0430 \u0441\u0442\u0432\u043E\u043B\u0430 \u043F\u0440\u0430\u0432\u0434\u044B. \u0411\u043B\u0438\u0437\u043A\u043E \u2014 \u0431\u043E\u043B\u044C\u043D\u043E."},rifle:{name:"\u0410\u0432\u0442\u043E\u043C\u0430\u0442 \xAB\u0412\u0438\u0445\u0440\u044C\xBB",icon:"\u{1F3AF}",dmg:58,rate:.11,ammo:"7.62",mag:30,price:2100,ammoPrice:30,spread:.022,range:110,desc:"\u041F\u043E\u043B\u043D\u044B\u0439 \u0430\u0432\u0442\u043E\u043C\u0430\u0442. \u041F\u043E\u043B\u0438\u0446\u0438\u044F \u043D\u0435 \u043E\u0434\u043E\u0431\u0440\u0438\u0442."}},ia={"9\u043C\u043C":14,"12\u043A":26,"7.62":30};function Pi(i){let e=new $e,t=He(2237482,{roughness:.45,metalness:.75}),n=He(9278364,{roughness:.3,metalness:.9}),s=He(7028514,{roughness:.85}),r=He(1316122,{roughness:.7});if(i==="pistol")he(De(.045,.055,.19,.012),t,e,0,.02,.06),he(De(.038,.115,.055,.012),r,e,0,-.05,-.02).rotation.x=.22,he(new et(.011,.011,.06,8),n,e,0,.035,.15).rotation.x=Math.PI/2,he(De(.028,.03,.05,.008),t,e,0,-.035,.08).rotation.x=-.5,he(new pe(.01,.022,.01),n,e,0,.052,-.02);else if(i==="shotgun")he(De(.05,.06,.34,.014),t,e,0,.02,.16),he(new et(.016,.016,.62,10),n,e,0,.045,.3).rotation.x=Math.PI/2,he(new et(.013,.013,.5,10),n,e,0,0,.26).rotation.x=Math.PI/2,he(De(.05,.09,.13,.02),s,e,0,-.02,-.12).rotation.x=.14,he(De(.045,.05,.16,.02),s,e,0,-.01,.11),he(De(.04,.1,.05,.01),r,e,0,-.05,-.02).rotation.x=.2;else if(i==="rifle")he(De(.055,.07,.4,.014),t,e,0,.02,.13),he(new et(.015,.015,.52,10),n,e,0,.04,.42).rotation.x=Math.PI/2,he(De(.05,.06,.2,.015),s,e,0,-.01,.28),he(De(.045,.09,.12,.02),s,e,0,-.01,-.1).rotation.x=.16,he(De(.032,.15,.075,.012),r,e,0,-.09,.06).rotation.x=-.25,he(De(.03,.075,.04,.01),r,e,0,-.06,-.03).rotation.x=.25,he(new pe(.014,.05,.02),n,e,0,.075,.02);else if(i==="knife"){he(De(.022,.1,.03,.008),r,e,0,-.02,-.01);let o=he(new pe(.008,.03,.19),n,e,0,.035,.09);o.rotation.x=0,he(new pe(.05,.014,.02),n,e,0,.02,-.005)}else if(i==="baton")he(new et(.017,.02,.42,10),r,e,0,.12,.02).rotation.x=-.15,he(new et(.021,.021,.09,10),He(3357252),e,0,-.06,-.01).rotation.x=-.15;else if(i==="bag"){let o=He(3095084,{roughness:.9});he(De(.3,.34,.16,.05),o,e,0,-.06,.02),he(De(.26,.12,.2,.04),o,e,0,.12,.02),he(new sn(.09,.012,6,12,Math.PI),He(7035450),e,0,.2,.02),he(new pe(.03,.02,.02),He(14202442,{metalness:.8,roughness:.3}),e,0,.1,.11)}return e}var cf={gentleman:{skin:15119500,jacket:2830138,pants:2369327,shirt:15855590,accent:9048608,hat:"fedora",hatColor:1842982,tall:1.03,build:1},gopnik:{skin:14462598,jacket:10230308,pants:1777188,shirt:10230308,accent:15921906,hat:"flat",hatColor:1316378,tall:.99,build:1.06},elderly:{skin:14268833,jacket:5917244,pants:3946544,shirt:13617076,accent:9143672,hat:"newsboy",hatColor:4866616,tall:.96,build:.96,hunch:.22},normal:{skin:13279353,jacket:3108751,pants:2568252,shirt:14209990,accent:16777215,hat:null,tall:1,build:1},thug:{skin:12159587,jacket:2830137,pants:2237740,shirt:3488325,accent:9182236,hat:"beanie",hatColor:1447966,tall:1,build:1.08},cashier:{skin:14991520,jacket:2767703,pants:2304566,shirt:16052970,accent:11542560,hat:null,tall:.98,build:.95},guard:{skin:13805954,jacket:1911622,pants:1449779,shirt:2902650,accent:14202442,hat:"cap",hatColor:1450554,tall:1.02,build:1.05},cop:{skin:14068612,jacket:2240589,pants:1712952,shirt:3363466,accent:14730346,hat:"police",hatColor:1779520,tall:1.02,build:1.03},seller:{skin:13081202,jacket:4864552,pants:3354666,shirt:10462882,accent:7035450,hat:"none",hatColor:2762272,tall:1,build:1,beard:!0}},Ri=class{constructor(e="normal",t={}){let n={hatColor:2762272,...cf[e]||cf.normal,...t.skinOverride};this.kind=e,this.S=n,this.root=new $e,this.body=new $e,this.root.add(this.body),this.phase=Math.random()*6,this.state="idle",this.hurtT=0,this.punchT=0,this.lying=!1,this.lieT=0,this.lookTarget=null,this.isDead=!1;let s=He(n.skin,{roughness:.72}),r=He(n.jacket,{roughness:.82}),o=He(n.pants,{roughness:.85}),a=He(n.shirt,{roughness:.7}),c=He(n.accent,{roughness:.6}),l=He(1381914,{roughness:.55}),h=He(n.hatColor,{roughness:.85}),u=n.build||1;if(this.hips=new $e,this.hips.position.y=.92*n.tall,this.body.add(this.hips),he(ci(.115*u,.08),o,this.hips,0,-.02,0).scale.set(1.15,1,.9),this.torso=new $e,this.torso.position.y=.155,this.torso.rotation.x=n.hunch||0,this.hips.add(this.torso),he(ci(.16*u,.24),r,this.torso,0,.16,0).scale.set(1.18,1,.82),e==="gentleman"){let P=he(new pe(.12,.25,.02),a,this.torso,0,.2,.118);P.rotation.x=-.04;let H=he(new pe(.033,.22,.02),c,this.torso,0,.185,.133);H.rotation.x=-.03,he(new pe(.06,.045,.028),c,this.torso,0,.31,.13);let _=he(new pe(.07,.3,.03),He(2237999),this.torso,-.07,.19,.105);_.rotation.z=.16,_.rotation.x=-.05;let S=he(new pe(.07,.3,.03),He(2237999),this.torso,.07,.19,.105);S.rotation.z=-.16,S.rotation.x=-.05}else if(e==="gopnik"){for(let H=0;H<3;H++){let _=he(new pe(.012,.22,.012),c,this.torso,-.06+H*.03,.2,.13);_.rotation.x=-.05}he(new sn(.085,.008,5,14,Math.PI*1.2),He(14202442,{metalness:.9,roughness:.25}),this.torso,0,.3,.1).rotation.set(1.2,0,.2),he(new pe(.014,.3,.014),He(15263976,{metalness:.5}),this.torso,0,.18,.128)}else if(e==="guard"||e==="cop"){let P=he(new pe(.05,.045,.012),He(14730346,{metalness:.9,roughness:.25}),this.torso,-.09,.24,.12);P.rotation.z=.1,he(new pe(.2,.03,.02),He(790294),this.torso,0,.03,.12),he(new pe(.05,.09,.02),He(14202442,{metalness:.8}),this.torso,.09,.02,.12),e==="cop"&&he(new pe(.045,.055,.012),c,this.torso,0,.33,.125)}else if(e==="cashier"){he(new pe(.13,.26,.02),a,this.torso,0,.14,.117);for(let P=0;P<3;P++)he(new et(.008,.008,.012,6),He(2236962),this.torso,-.03+P*.03,.16-P*.075,.132).rotation.x=Math.PI/2}else if(e==="thug"){he(new Ut(.175,12,10,0,Math.PI*2,0,Math.PI*.55),He(3948877),this.torso,0,.34,-.075).scale.set(1.18,1.2,1.1);let H=he(new pe(.014,.26,.012),He(4211792),this.torso,0,.16,.127)}else if(e==="elderly"){for(let P=0;P<3;P++)he(new et(.012,.012,.014,6),He(3024928),this.torso,.03,.24-P*.09,.128).rotation.x=Math.PI/2;he(new pe(.2,.03,.26),a,this.torso,0,.34,-.02)}else he(new pe(.12,.18,.02),a,this.torso,0,.22,.12);let g=he(ci(.045,.05),s,this.torso,0,.35,0);this.head=new $e,this.head.position.y=.42,this.torso.add(this.head),he(Ms(.135,16),s,this.head,0,.06,0).scale.set(.95,1.05,.98),he(Ms(.1,12),s,this.head,0,-.01,.02).scale.set(.92,.85,.95);let p=he(new Wo(.028,.075,6),s,this.head,0,.045,.128);p.rotation.x=Math.PI*.52;let b=He(16118506,{roughness:.4}),x=He(1316380,{roughness:.25});[-.052,.052].forEach(P=>{he(Ms(.026,10),b,this.head,P,.075,.108).scale.set(1,.85,.6),he(Ms(.012,8),x,this.head,P,.075,.128)}),[-.052,.052].forEach(P=>{let H=he(new pe(.048,.012,.018),h,this.head,P,.105,.118);H.rotation.z=P>0?-.12:.12});let M=he(new pe(.062,.012,.014),He(8010292,{roughness:.6}),this.head,0,-.02,.118);if([-.128,.128].forEach(P=>{he(Ms(.03,8),s,this.head,P,.055,0).scale.set(.5,1,.8)}),he(new Ut(.14,14,10,0,Math.PI*2,0,Math.PI*.44),e==="elderly"?He(13618372):h,this.head,0,.082,-.004).scale.set(1,.95,1.02),n.hat==="fedora"){let P=he(new et(.26,.28,.022,20),He(n.hatColor),this.head,0,.14,.008);P.scale.set(1,1,1.05),P.rotation.x=.04;let H=he(new et(.15,.165,.15,18),He(n.hatColor),this.head,0,.22,0),_=he(new et(.168,.17,.035,18),He(7016992),this.head,0,.16,0)}else if(n.hat==="flat"){he(new et(.145,.152,.05,16),He(n.hatColor),this.head,0,.15,0).scale.set(1.04,1,1.02);let H=he(new pe(.2,.014,.1),He(n.hatColor),this.head,0,.137,.1);H.rotation.x=-.1}else if(n.hat==="beanie")he(new Ut(.15,14,10,0,Math.PI*2,0,Math.PI*.6),He(n.hatColor),this.head,0,.085,0).scale.set(1.04,1.15,1.04),he(new sn(.14,.022,6,14),He(2764086),this.head,0,.12,0).rotation.x=Math.PI/2;else if(n.hat==="cap"||n.hat==="police"){let P=he(new et(.15,.165,.09,16),He(n.hatColor),this.head,0,.175,0),H=he(new Go(.16,16,0,Math.PI),He(857119),this.head,0,.135,.075);H.rotation.x=-Math.PI/2+.25,n.hat==="police"?he(new pe(.06,.06,.016),He(14730346,{metalness:.9,roughness:.2}),this.head,0,.19,.15):he(new pe(.16,.02,.02),He(790294),this.head,0,.14,.16)}else n.hat==="newsboy"&&he(new Ut(.148,12,8,0,Math.PI*2,0,Math.PI*.5),He(n.hatColor),this.head,0,.1,0).scale.set(1.05,1,1.05);if(e==="gentleman"){he(new pe(.09,.022,.02),He(1709076),this.head,0,.006,.122);let P=he(new pe(.115,.045,.014),He(658192,{metalness:.6,roughness:.2}),this.head,0,.075,.125);P.rotation.x=-.04}if(e==="elderly"){he(new sn(.032,.005,5,10),He(2763306),this.head,-.052,.075,.122),he(new sn(.032,.005,5,10),He(2763306),this.head,.052,.075,.122),he(new pe(.028,.006,.01),He(2763306),this.head,0,.075,.125),this.cane=new $e;let P=he(new et(.012,.014,.95,8),He(4861984,{roughness:.7}),this.cane,0,-.47,0);he(new sn(.035,.013,6,10,Math.PI),He(4861984),this.cane,0,0,0),this.cane.position.set(.02,.02,.06)}n.beard&&he(new Ut(.1,10,8,0,Math.PI*2,0,Math.PI*.62),He(4864554),this.head,0,-.045,.03).scale.set(1.02,1.05,.95);let w=P=>{let H=new $e;H.position.set(P*.235*u,.31,0),this.torso.add(H);let _=he(ci(.062*u,.2),r,H,0,-.13,0);if(e==="gopnik")for(let k=0;k<3;k++)he(new pe(.01,.16,.012),c,H,P*(.03+k*.025),-.13,.055);let S=new $e;S.position.y=-.27,H.add(S),he(ci(.055*u,.18),e==="gentleman"||e==="guard"||e==="cop"||e==="cashier"?r:s,S,0,-.12,0),e==="elderly"&&he(ci(.06,.12),r,S,0,-.09,0);let z=new $e;return z.position.y=-.25,S.add(z),he(Ms(.058,10),s,z,0,0,0).scale.set(1,1.1,.72),{shoulder:H,elbow:S,hand:z}};if(this.armL=w(-1),this.armR=w(1),e==="gentleman"){let P=he(new sn(.03,.007,5,10),He(14202442,{metalness:.95,roughness:.2}),this.armL.elbow,0,-.2,0);P.rotation.x=Math.PI/2}this.cane&&this.armL.hand.add(this.cane);let R=P=>{let H=new $e;H.position.set(P*.105*u,-.02,0),this.hips.add(H),he(ci(.075*u,.22),o,H,0,-.14,0);let _=new $e;_.position.y=-.3,H.add(_),he(ci(.066*u,.22),o,_,0,-.13,0);let S=new $e;S.position.y=-.29,_.add(S);let z=he(De(.11,.075,.24,.03),l,S,0,.02,.045);return{hip:H,knee:_,foot:S}};this.legL=R(-1),this.legR=R(1),this.root.traverse(P=>{P.isMesh&&(P.castShadow=!0,P.receiveShadow=!0)}),this.weaponHolder=new $e,this.weaponHolder.position.set(0,-.02,.02),this.armR.hand.add(this.weaponHolder),this.weaponModel=null,this.weaponId="fists",this.setWeapon("fists"),this.baseY=0}setWeapon(e){if(this.weaponId=e||"fists",this.weaponModel&&(this.weaponHolder.remove(this.weaponModel),this.weaponModel=null),this.weaponHolder&&this.weaponId!=="fists"){let t=Pi(this.weaponId);t.rotation.set(-.15,0,0),this.weaponHolder.add(t),this.weaponModel=t}}setState(e){this.state!==e&&(this.state=e)}hurt(){this.hurtT=.35}punch(){this.punchT=.42}shoot(){this.recoilT=.18}lieDown(e=0){this.lying=!0,this.lieT=e}wakeUp(){this.lying=!1,this.wakeAnim=1}update(e,t=0,n={}){var b,x,M,D;let s=this.S;this.hurtT>0&&(this.hurtT-=e),this.punchT>0&&(this.punchT-=e),this.recoilT>0&&(this.recoilT-=e),this.phase+=e*(1.6+t*1.7);let r=this.phase,o=Pt(t/3.2,0,1.35),a=Math.PI/2;if(this.lying){this.lieT+=e;let w=Pt(this.lieT/.8,0,1);this.body.rotation.x=dt(this.body.rotation.x,a,.12),this.body.position.y=dt(this.body.position.y,.05,.12),this.legL.hip.rotation.x=dt(this.legL.hip.rotation.x,.05,.1),this.legR.hip.rotation.x=dt(this.legR.hip.rotation.x,.12,.1),this.legL.knee.rotation.x=dt(this.legL.knee.rotation.x,.1,.1),this.legR.knee.rotation.x=dt(this.legR.knee.rotation.x,.05,.1),this.armL.shoulder.rotation.set(dt(this.armL.shoulder.rotation.x,.4,.1),0,.35),this.armR.shoulder.rotation.set(dt(this.armR.shoulder.rotation.x,.25,.1),0,-.3),this.armL.elbow.rotation.x=dt(this.armL.elbow.rotation.x,-.5,.1),this.armR.elbow.rotation.x=dt(this.armR.elbow.rotation.x,-.3,.1),this.head.rotation.x=dt(this.head.rotation.x,-.15,.1);return}if(this.body.rotation.x=dt(this.body.rotation.x,0,.14),this.body.position.y=dt(this.body.position.y,0,.14),this.isDead){this.body.rotation.x=dt(this.body.rotation.x,-Math.PI/2.1,.09),this.body.position.y=dt(this.body.position.y,.16,.09),this.armL.shoulder.rotation.z=dt(this.armL.shoulder.rotation.z,1.1,.1),this.armR.shoulder.rotation.z=dt(this.armR.shoulder.rotation.z,-1.2,.1);return}let c=.62*o,l=Math.sin(r),h=Math.sin(r+Math.PI);this.legL.hip.rotation.x=l*c,this.legR.hip.rotation.x=h*c,this.legL.knee.rotation.x=Math.max(0,-Math.cos(r))*.85*o,this.legR.knee.rotation.x=Math.max(0,-Math.cos(r+Math.PI))*.85*o,this.legL.foot.rotation.x=-l*.18*o,this.legR.foot.rotation.x=-h*.18*o,this.hips.position.y=.92*s.tall+Math.abs(Math.sin(r))*.035*o-(s.hunch||0)*.02,this.hips.rotation.z=Math.sin(r)*.035*o,this.torso.rotation.y=-Math.sin(r)*.09*o;let u=this.aiming&&!((b=qt[this.weaponId])!=null&&b.melee)&&this.weaponId!=="fists";this.aimBlend=dt(this.aimBlend||0,u?1:0,Math.min(1,e*9));let d=-l*.55*o,f=-h*.55*o,g=-.06,y=.06,m=-.25-.25*o,p=-.25-.25*o;if(this.punchT>0){let w=1-this.punchT/.42,R=Math.sin(Pt(w,0,1)*Math.PI);d=dt(d,-1.9,R),m=dt(m,-.25,R)}if(this.aimBlend>.01){let w=this.aimBlend;d=dt(d,-1.5,w),m=dt(m,-.32,w),g=dt(g,.12,w),f=dt(f,-1.28,w),p=dt(p,-.95,w),y=dt(y,-.34,w)}if(this.weaponId==="bag"&&(d=.1),this.recoilT>0){let w=this.recoilT/.18;d-=w*.42,m+=w*.3}this.armR.shoulder.rotation.x=d,this.armL.shoulder.rotation.x=f,this.armR.shoulder.rotation.z=g,this.armL.shoulder.rotation.z=y,this.armR.elbow.rotation.x=m,this.armL.elbow.rotation.x=p,o<.05?(this.torso.rotation.x=(s.hunch||0)+Math.sin(r*.7)*.012,this.armR.shoulder.rotation.x+=Math.sin(r*.7)*.02,this.head.rotation.z=Math.sin(r*.35)*.03):(this.torso.rotation.x=(s.hunch||0)+Math.sin(r*2)*.02,this.head.rotation.z=0),this.hurtT>0&&(this.torso.rotation.x+=Math.sin(this.hurtT*30)*.1,this.head.rotation.x=-.2),this.lookTarget?(this.head.rotation.y=Pt((x=this.lookTarget.localYaw)!=null?x:0,-.9,.9),this.head.rotation.x=Pt((M=this.lookTarget.localPitch)!=null?M:0,-.5,.4)):(this.head.rotation.y=dt(this.head.rotation.y,0,.08),this.head.rotation.x=dt(this.head.rotation.x,0,.08)),this.aiming=(D=n.aiming)!=null?D:this.aiming}};function dr(i=9055019,e="sedan"){let t=new $e,n=j(i,{roughness:.35,metalness:.55}),s=j(1713971,{roughness:.12,metalness:.4}),r=j(2237482,{roughness:.6,metalness:.4}),o=j(16773312,{emissive:16769162,emissiveIntensity:.7,roughness:.3}),a=Q(De(1.85,.62,4.2,.22),n,0,.62,0);t.add(a);let c=Q(De(1.62,.55,2.1,.2),n,0,1.13,-.1);t.add(c);let l=Q(De(1.52,.42,2,.16),s,0,1.17,-.1);t.add(l),t.add(Q(De(1.7,.16,1.1,.08),n,0,.9,1.5)),t.add(Q(De(1.7,.14,.9,.08),n,0,.9,-1.55)),t.add(Q(De(1.78,.2,.18,.06),r,0,.55,2.1)),t.add(Q(De(1.78,.2,.18,.06),r,0,.55,-2.1)),[-.62,.62].forEach(f=>{t.add(Q(De(.36,.16,.08,.04),o,f,.72,2.14)),t.add(Q(De(.32,.14,.08,.04),j(9181722,{emissive:5570560,roughness:.4}),f,.72,-2.14))});let h=new et(.36,.36,.24,14),u=new et(.2,.2,.26,10),d=[];return[[-.92,1.35],[.92,1.35],[-.92,-1.35],[.92,-1.35]].forEach(([f,g])=>{let y=new $e;y.position.set(f,.36,g),y.rotation.z=Math.PI/2,t.add(y);let m=new tt(h,r);m.castShadow=!0,y.add(m);let p=new tt(u,j(10133672,{metalness:.9,roughness:.3}));y.add(p),d.push(m,p)}),t.userData.wheels=d,t.userData.spin=f=>{for(let g of d)g.rotation.y+=f},[-1,1].forEach(f=>t.add(Q(De(.18,.09,.1,.03),n,f*.92,1.16,.75))),t}function hf(){let i=dr(1711655),e=j(15330543,{roughness:.42,metalness:.2}),t=j(1316380,{roughness:.5,metalness:.3});[-1,1].forEach(l=>{i.add(Q(De(.05,.46,1.95,.02),e,l*.935,.72,.05)),i.add(Q(De(.06,.17,.9,.02),j(2778056,{roughness:.5,metalness:.2}),l*.94,.95,.55))}),i.add(Q(De(1.7,.34,.12,.05),t,0,.6,2.18));let n=new $e;n.position.set(0,1.42,-.1),i.add(n),n.add(Q(new pe(1.42,.08,.34),t,0,.02,0));let s=j(9179152,{emissive:16716820,emissiveIntensity:.35,roughness:.3}),r=j(1055372,{emissive:1719551,emissiveIntensity:.35,roughness:.3}),o=Q(new pe(.56,.18,.3),s,-.36,.13,0),a=Q(new pe(.56,.18,.3),r,.36,.13,0);n.add(o),n.add(a);let c=new rn(16719904,0,16,2);return c.position.set(0,1.75,0),i.add(c),i.userData.lights={red:o,blue:a,light:c},i.userData.isPolice=!0,i}function uf(i=6){let e=new $e,t=j(4863268,{roughness:.95}),n=j(3037738,{roughness:.9,flat:!0}),s=Q(new et(.16,.26,i*.55,8),t,0,i*.28,0);e.add(s);for(let r=0;r<3;r++){let o=1-r*.22,a=Q(new Ti(1.5*o,1),n,(Math.random()-.5)*.7,i*.55+r*i*.13,(Math.random()-.5)*.7);a.scale.set(1,.85,1),e.add(a)}return e}function df(){let i=new $e,e=j(2830134,{roughness:.5,metalness:.6});i.add(Q(new et(.08,.11,5.6,8),e,0,2.8,0));let t=Q(new et(.055,.055,1.2,6),e,.55,5.55,0);t.rotation.z=Math.PI/2,i.add(t);let n=Q(new pe(.5,.14,.3),j(1711394,{emissive:16766073,emissiveIntensity:.55,roughness:.5}),1.1,5.5,0);return i.add(n),i}function ff(){let i=new $e,e=j(7031340,{roughness:.9}),t=j(2435118,{roughness:.6,metalness:.6});for(let n=0;n<3;n++)i.add(Q(new pe(1.9,.06,.16),e,0,.45,-.18+n*.19));for(let n=0;n<2;n++)i.add(Q(new pe(1.9,.16,.06),e,0,.68+n*.2,-.32));return[-.8,.8].forEach(n=>{i.add(Q(new pe(.08,.45,.5),t,n,.22,0)),i.add(Q(new pe(.07,.5,.07),t,n,.72,-.32))}),i}function pf(){let i=new $e,e=j(2375726,{roughness:.8,metalness:.3});i.add(Q(De(1.2,1,.9,.06),e,0,.55,0));let t=Q(De(1.24,.1,.95,.04),j(1715232),0,1.06,0);return t.rotation.x=-.08,i.add(t),[[-.45,.35],[.45,.35],[-.45,-.35],[.45,-.35]].forEach(([n,s])=>i.add(Q(new et(.07,.07,.1,6),j(1316378),n,.07,s))),i}function mf(i=.6){let e=new $e,t=j(9069623,{roughness:.9,map:Sn("wood",128,128,(s,r,o)=>{s.fillStyle="#8a6437",s.fillRect(0,0,r,o);for(let a=0;a<40;a++)s.strokeStyle=`rgba(60,40,20,${Math.random()*.35})`,s.beginPath(),s.moveTo(0,Math.random()*o),s.bezierCurveTo(r*.3,Math.random()*o,r*.6,Math.random()*o,r,Math.random()*o),s.stroke()})});e.add(Q(De(i,i,i,.03),t,0,i/2,0));let n=j(5914402,{roughness:.9});return e.add(Q(new pe(i*1.01,.05,.05),n,0,i*.5,0)),e.add(Q(new pe(.05,i*1.01,.05),n,-i*.5,i*.5,0)),e.add(Q(new pe(.05,i*1.01,.05),n,i*.5,i*.5,0)),e}function gf(i=1e3){let e=new $e,t=Sn("moneyT",128,64,(o,a,c)=>{o.fillStyle="#5f7c4e",o.fillRect(0,0,a,c),o.fillStyle="#7d9c66";for(let l=0;l<14;l++)o.fillRect(Math.random()*a,Math.random()*c,4+Math.random()*22,2+Math.random()*5);o.fillStyle="rgba(230,225,200,.85)",o.beginPath(),o.arc(a/2,c/2,11,0,7),o.fill(),o.fillStyle="#3d5233",o.font="bold 16px serif",o.textAlign="center",o.fillText("$",a/2,c/2+6)}),n=j(16777215,{map:t,roughness:.85}),s=Q(new pe(.24,.09,.13),n,0,.05,0);e.add(s);let r=Q(new pe(.05,.095,.135),j(14274478,{roughness:.7}),0,.05,0);return e.add(r),e.userData.value=i,e}var Hx={ped:"normal",old:"elderly",thug:"thug",guard:"guard",cashier:"cashier",cop:"cop",seller:"seller",boss:"normal"},sa={ped:["\u0427\u0451 \u0441\u043C\u043E\u0442\u0440\u0438\u0448\u044C?","\u0414\u043E\u0431\u0440\u044B\u0439 \u0432\u0435\u0447\u0435\u0440.","\u041D\u0435 \u0437\u0430\u0434\u0435\u0440\u0436\u0438\u0432\u0430\u0439\u0441\u044F \u0442\u0443\u0442.","\u0421\u043B\u044B\u0445\u0430\u043B, \u0431\u0430\u043D\u043A \u043E\u043F\u044F\u0442\u044C \u0433\u0440\u0430\u0431\u0430\u043D\u0443\u043B\u0438?","\u0413\u043E\u0440\u043E\u0434 \u043A\u0430\u0442\u0438\u0442\u0441\u044F \u0432\u043D\u0438\u0437\u2026","\u0421\u0438\u0433\u0430\u0440\u0435\u0442\u043A\u0438 \u043D\u0435 \u0431\u0443\u0434\u0435\u0442?"],old:["\u041C\u043E\u043B\u043E\u0434\u0451\u0436\u044C \u0441\u043E\u0432\u0441\u0435\u043C \u0440\u0430\u0441\u043F\u0443\u0441\u0442\u0438\u043B\u0430\u0441\u044C.","\u041E\u0445, \u0441\u043F\u0438\u043D\u0430 \u043C\u043E\u044F\u2026","\u0420\u0430\u043D\u044C\u0448\u0435 \u0442\u0443\u0442 \u0431\u044B\u043B\u043E \u0442\u0438\u0445\u043E.","\u041D\u0435 \u0431\u0435\u0433\u0430\u0439, \u0443\u043F\u0430\u0434\u0451\u0448\u044C."],thug:["\u042D\u0439, \u0431\u0440\u0430\u0442, \u0435\u0441\u0442\u044C \u0447\u0451?","\u041D\u0435 \u043D\u0430 \u0440\u0430\u0439\u043E\u043D\u0435 \u0433\u0443\u043B\u044F\u0435\u0448\u044C.","\u0421\u0442\u0432\u043E\u043B \u0443\u0431\u0435\u0440\u0438, \u0443\u043C\u043D\u0438\u043A.","\u0421\u043C\u043E\u0442\u0440\u0438 \u043C\u043D\u0435 \u0432 \u0433\u043B\u0430\u0437\u0430."],guard:["\u041E\u0440\u0443\u0436\u0438\u0435 \u0443\u0431\u0435\u0440\u0438\u0442\u0435.","\u0421\u043F\u043E\u043A\u043E\u0439\u043D\u043E, \u0433\u0440\u0430\u0436\u0434\u0430\u043D\u0438\u043D.","\u042F \u0441\u043B\u0435\u0436\u0443 \u0437\u0430 \u0442\u043E\u0431\u043E\u0439."],cop:["\u0421\u0442\u043E\u044F\u0442\u044C! \u041F\u043E\u043B\u0438\u0446\u0438\u044F!","\u0420\u0443\u043A\u0438 \u0437\u0430 \u0433\u043E\u043B\u043E\u0432\u0443!","\u041D\u0435 \u0434\u0432\u0438\u0433\u0430\u0439\u0441\u044F!"],seller:["\u0411\u0435\u0440\u0438, \u043F\u043E\u043A\u0430 \u0435\u0441\u0442\u044C.","\u041F\u0430\u0442\u0440\u043E\u043D\u044B \u0434\u0435\u0448\u0435\u0432\u043B\u0435 \u043D\u0435 \u0431\u0443\u0434\u0443\u0442.","\u0421\u0442\u0432\u043E\u043B \u043D\u0435 \u0434\u043B\u044F \u043A\u0440\u0430\u0441\u043E\u0442\u044B, \u0434\u0430?"]},fn=class{constructor(e,t={}){var n,s,r;this.game=e,this.role=t.role||"ped",this.kind=t.kind||Hx[this.role]||"normal",this.char=new Ri(this.kind),this.pos=(t.pos||new A).clone(),this.yaw=(n=t.yaw)!=null?n:0,this.char.root.position.copy(this.pos),this.char.root.rotation.y=this.yaw,this.hp=(s=t.hp)!=null?s:this.role==="guard"?140:this.role==="cop"?160:100,this.maxHp=this.hp,this.speed=(r=t.speed)!=null?r:this.role==="cop"?3.9:this.role==="guard"?2.6:1.35,this.path=t.path||null,this.pathIdx=0,this.waitT=Math.random()*2,this.state="patrol",this.attackCd=0,this.dead=!1,this.hostile=!1,this.sayT=0,this.sayCd=6+Math.random()*12,this.lookT=0,this.vision=this.role==="cop"?26:this.role==="guard"?16:9,this.fov=this.role==="guard"?1.9:1.5,this.carry=null,this.jobOffer=!1,this.offerT=0,this.startPos=this.pos.clone(),this.leaving=!1,this.role==="guard"&&this.char.setWeapon("baton"),this.role==="cop"&&this.char.setWeapon("pistol"),(this.role==="seller"||this.role==="cashier")&&this.char.setWeapon("fists"),e.scene.add(this.char.root)}get alive(){return!this.dead}say(e,t=3){var s;this._bubble&&((s=this._bubble.parent)==null||s.remove(this._bubble),this._bubble.material.map.dispose(),this._bubble.material.dispose());let n=rf(e,{color:"#ffe9a8",size:30,w:320});n.position.set(0,2.15,0),this.char.root.add(n),this._bubble=n,this.sayT=t}damage(e,t=!0){this.dead||(this.hp-=e,this.char.hurt(),this.hostile=!0,this.hp<=0?this.die(t):this.role==="guard"&&this.say("\u0410\u0445 \u0442\u044B!",2))}die(e=!0){this.dead||(this.dead=!0,this.char.isDead=!0,this.char.setState("dead"),this.game.onNpcKilled(this,e))}faceTo(e,t){let n=Math.atan2(e-this.pos.x,t-this.pos.z);this.yaw=n,this.char.root.rotation.y=n}moveToward(e,t,n,s){let r=e-this.pos.x,o=t-this.pos.z,a=Math.hypot(r,o);if(a<.001)return 0;let c=Math.min(a,n*s);this.pos.x+=r/a*c,this.pos.z+=o/a*c,this.game.colliders.resolve(this.pos,.32);let l=Math.atan2(r,o);return this.yaw+=vs(this.yaw,l)*Math.min(1,s*9),this.char.root.rotation.y=this.yaw,this.char.root.position.set(this.pos.x,this.pos.y,this.pos.z),n}update(e){var o,a;if(this.dead){this.char.update(e,0);return}this.attackCd=Math.max(0,this.attackCd-e),this.sayT>0&&(this.sayT-=e,this.sayT<=0&&this._bubble&&((o=this._bubble.parent)==null||o.remove(this._bubble),(a=this._bubble.material.map)==null||a.dispose(),this._bubble.material.dispose(),this._bubble=null));let t=0,s=this.game.player.pos,r=Ct(this.pos,s);switch(this.role){case"cashier":t=this.updateCashier(e,r,s);break;case"seller":t=this.updateSeller(e,r,s);break;case"guard":t=this.updateGuard(e,r,s);break;case"cop":t=this.updateCop(e,r,s);break;case"boss":t=this.updateBoss(e,r,s);break;default:t=this.updatePed(e,r,s);break}if(!this.dead&&r<9&&this.role!=="cop"){let c=vs(this.char.root.rotation.y,Math.atan2(s.x-this.pos.x,s.z-this.pos.z));this.char.lookTarget={localYaw:Pt(c,-.8,.8),localPitch:.1}}else this.char.lookTarget=null;this.char.aiming=this.role==="cop"?!!this.aimingWanted&&!(this.reloadT>0):this.role==="guard"?!!this.hostile:!1,this.char.update(e,t,{aiming:this.char.aiming})}updatePed(e,t,n){var r;let s=this.game;if(this.jobOffer){if(this.offerT-=e,Ct(this.pos,n)>2.2){let a=this.moveToward(n.x,n.z,1.7,e);return this.char.setState("walk"),this.offerT<0&&(this.jobOffer=!1),a}return this.faceTo(n.x,n.z),this.char.setState("idle"),this.offerT<0&&(this.jobOffer=!1),0}if(this.hostile&&this.role==="thug")return Ct(this.pos,n)<1.8?(this.char.setState("idle"),this.attackCd<=0&&(this.attackCd=1.3,this.char.punch(),s.hitPlayer(6+Math.random()*4,this)),0):(this.char.setState("walk"),this.moveToward(n.x,n.z,2.6,e));if(s.playerArmed()&&t<7&&Math.random()<.02&&(this.state="flee",this.fleeT=3.5),this.state==="flee"){this.fleeT-=e,this.fleeT<=0&&(this.state="patrol");let o=this.pos.x-n.x,a=this.pos.z-n.z,c=Math.hypot(o,a)||1;this.char.setState("walk");let l=this.moveToward(this.pos.x+o/c*3,this.pos.z+a/c*3,3.4,e);return Math.random()<.01&&this.say("\u041F\u043E\u043C\u043E\u0433\u0438\u0442\u0435!",2),l}if(this.path&&this.path.length){if(this.waitT>0)return this.waitT-=e,this.char.setState("idle"),0;let o=this.path[this.pathIdx%this.path.length];if(Math.hypot(o[0]-this.pos.x,o[1]-this.pos.z)<.9)this.pathIdx=(this.pathIdx+1)%this.path.length,Math.random()<.35&&(this.waitT=1+Math.random()*3);else{this.char.setState("walk");let c=this.moveToward(o[0],o[1],this.speed,e);return this.sayCd-=e,this.sayCd<=0&&(this.sayCd=14+Math.random()*20,t<12&&Math.random()<.5&&this.say(((r=sa[this.role])==null?void 0:r[Math.floor(Math.random()*sa[this.role].length)])||sa.ped[0])),c}}return this.char.setState("idle"),0}updateCashier(e,t,n){let s=this.game,r=s.visionCheck(this.pos,this.yaw,n,2.4,20),o=s.playerArmed();return r&&o&&!s.alarmOn&&(this._panic||(this._panic=1.8,this.say("\u041E\u0440\u0443\u0436\u0438\u0435! \u041F\u043E\u043C\u043E\u0433\u0438\u0442\u0435!",2.4))),r&&s.grabbing&&(this._panic||(this._panic=1.2,this.say("\u041E\u043D \u0437\u0430\u0431\u0438\u0440\u0430\u0435\u0442 \u0434\u0435\u043D\u044C\u0433\u0438!",2))),this._panic?(this._panic-=e,this.char.setState("idle"),this.char.lookTarget={localYaw:0,localPitch:0},this.char.armR.shoulder.rotation.x=-2.3,this.char.armL.shoulder.rotation.x=-2.1,this._panic<=0&&(this._panic=null,s.triggerAlarm("cashier")),0):(r&&this.faceTo(n.x,n.z),this.char.setState("idle"),0)}updateSeller(e,t,n){return t<3.2&&(this.faceTo(n.x,n.z),this.sayCd-=e,this.sayCd<=0&&(this.sayCd=20,this.say(sa.seller[Math.floor(Math.random()*3)]))),this.char.setState("idle"),0}updateBoss(e,t,n){return this.char.setState("idle"),t<3.2&&this.faceTo(n.x,n.z),0}updateGuard(e,t,n){let s=this.game,r=s.visionCheck(this.pos,this.yaw,n,this.fov,this.vision),o=s.playerArmed();if(r&&o&&!s.alarmOn&&(this.hostile=!0,this._warned||(this._warned=1,this.say("\u041E\u0440\u0443\u0436\u0438\u0435 \u0432 \u0431\u0430\u043D\u043A\u0435!",2.5))),r&&s.grabbing&&(this.hostile=!0),this.hostile){let a=Ct(this.pos,n);if(a<1.9)return this.char.setState("idle"),this.faceTo(n.x,n.z),this.attackCd<=0&&(this.attackCd=1.35,this.char.punch(),s.hitPlayer(7+Math.random()*3.5,this),s.ui.hitFlash()),0;if(this.char.setState("walk"),a<26)return this.moveToward(n.x,n.z,this.speed,e)}if(this.path&&this.path.length){let a=this.path[this.pathIdx%this.path.length];if(Math.hypot(a[0]-this.pos.x,a[1]-this.pos.z)<1)this.pathIdx=(this.pathIdx+1)%this.path.length,Math.random()<.3&&(this.waitT=1+Math.random()*2);else if(this.waitT>0)this.waitT-=e,this.char.setState("idle"),this.yaw+=e*.7,this.char.root.rotation.y=this.yaw;else return this.char.setState("walk"),this.moveToward(a[0],a[1],this.speed,e)}return this.char.setState("idle"),0}updateCop(e,t,n){var u,d,f,g;let s=this.game;if(this.exiting>0){this.exiting-=e;let y=Pt(1-this.exiting/(this.exitDur||.55),0,1);return this.exitFrom&&this.exitTo&&(this.pos.x=this.exitFrom.x+(this.exitTo.x-this.exitFrom.x)*y,this.pos.z=this.exitFrom.z+(this.exitTo.z-this.exitFrom.z)*y,this.pos.y=Math.sin(y*Math.PI)*.13),this.faceTo((d=(u=this.exitTo)==null?void 0:u.x)!=null?d:this.pos.x,(g=(f=this.exitTo)==null?void 0:f.z)!=null?g:this.pos.z+1),this.char.setState("walk"),this.char.root.position.copy(this.pos),this.exiting<=0&&(this.pos.y=0,this.exiting=0,this.saidHi||(this.saidHi=!0,this.say("\u041F\u043E\u043B\u0438\u0446\u0438\u044F! \u0421\u0442\u043E\u044F\u0442\u044C!",2.2))),2.1}if(this.car&&!this.inCar&&s.player.stars===0&&(s.remoteStars||0)===0){let y=this.car.exitTo||this.car.pos;return Ct(this.pos,y)>1.25?(this.char.setState("walk"),this.moveToward(y.x,y.z,2.9,e)):(this.inCar=!0,this.inactive=!0,this.char.root.visible=!1,0)}let r=s.nearestWantedPlayer(this.pos);if(!r)return this.leaving=!0,this.char.setState("walk"),this.moveToward(this.pos.x+(this.startPos.x-this.pos.x)*.02,this.pos.z+(this.startPos.z-this.pos.z)*.02,2.6,e);let o=r.pos,a=Ct(this.pos,o),c=s.visionCheck(this.pos,this.yaw,o,2.6,40);c&&s.markSeen(r,this),this.reloadT=Math.max(0,(this.reloadT||0)-e);let h=(r.isRemote?s.remoteStars||0:s.player.stars)>=3&&a<30&&c;if(this.aimingWanted=h,h&&this.reloadT<=0){this.aimingWanted=!0;let y=0;return a>12?(this.char.setState("walk"),y=this.moveToward(o.x,o.z,3.1,e)):a<4.6?(this.char.setState("walk"),y=this.moveToward(this.pos.x*2-o.x,this.pos.z*2-o.z,1.7,e)):(this.char.setState("idle"),this.faceTo(o.x,o.z)),this.saidHi||(this.saidHi=!0,this.say("\u0421\u0442\u043E\u044F\u0442\u044C! \u041F\u043E\u043B\u0438\u0446\u0438\u044F!",2.2)),this.attackCd<=0&&a<26&&(this.attackCd=1.1+Math.random()*.5,this.char.shoot(),s.copShootAt(this,o,r),this.shots=(this.shots||0)+1,this.shots>=7&&(this.shots=0,this.reloadT=1.8,s.sound.reload(),this.say("\u041F\u0435\u0440\u0435\u0437\u0430\u0440\u044F\u0436\u0430\u044E\u0441\u044C\u2026",1.6))),y}return h?(this.char.setState("walk"),this.faceTo(o.x,o.z),this.moveToward(this.pos.x*2-o.x,this.pos.z*2-o.z,1.4,e)):a<2?(this.char.setState("idle"),this.faceTo(o.x,o.z),this.saidHi||(this.saidHi=!0,this.say("\u0420\u0443\u043A\u0438 \u0437\u0430 \u0433\u043E\u043B\u043E\u0432\u0443!",2)),this.attackCd<=0&&(this.attackCd=1.2,this.char.punch(),s.sound.punch(),s.hitPlayer(8+Math.random()*4,this,r),s.ui.hitFlash()),0):(this.char.setState("walk"),this.char.speed=3.6,this.moveToward(o.x,o.z,3.7,e))}};var bs=2.6,on=96,_f=[9186091,2837099,3817290,7039802,9075243,2372623,11051674,4926042],fr=class{constructor(e,t={}){var n,s,r,o,a;this.traffic=e,this.game=e.game,this.kind=t.kind||"civil",this.dir=t.dir>=0?1:-1,this.z=(n=t.z)!=null?n:this.dir>0?bs:-bs,this.x=(s=t.x)!=null?s:this.dir>0?-on-Math.random()*14:on+Math.random()*14,this.maxSpeed=(r=t.maxSpeed)!=null?r:this.kind==="police"?13:8.5+Math.random()*3.5,this.speed=this.maxSpeed*.8,this.state="drive",this.stopX=(o=t.stopX)!=null?o:0,this.siren=!1,this.sirenT=Math.random()*2,this.cops=[],this.copsToSpawn=0,this.copsSpawned=0,this.unloadT=0,this.readyT=0,this.hitCd=0,this.dead=!1,this.color=(a=t.color)!=null?a:_f[Math.floor(Math.random()*_f.length)],this.group=this.kind==="police"?hf():dr(this.color),this.game.scene.add(this.group),this.sync(0)}get pos(){return this.group.position}get lights(){return this.group.userData.lights}sync(e){this.group.position.set(this.x,0,this.z),this.group.rotation.y=this.dir>0?Math.PI/2:-Math.PI/2,e&&this.group.userData.spin&&this.group.userData.spin(this.speed*e/.36)}updateSiren(e){let t=this.lights;if(!t)return;this.sirenT+=e;let n=Math.floor(this.sirenT/.19)%2,s=this.siren;t.red.material.emissiveIntensity=s&&n===0?3.4:.28,t.blue.material.emissiveIntensity=s&&n===1?3.4:.28,t.light.color.setHex(n?2773759:16720418),t.light.intensity=s?11:0}aheadBlocked(){let e=this.game,t=this.z,n=this.dir,s=(r,o,a=0)=>{if(Math.abs(o-t)>1.8)return!1;let c=(r-this.x)*n;return c>.2&&c<3+this.speed*.34+a};if(s(e.player.pos.x,e.player.pos.z)||e.remote&&s(e.remote.pos.x,e.remote.pos.z))return!0;for(let r of this.traffic.cars)if(!(r===this||r.z!==t||r.dir!==n)&&s(r.x,t,3.5))return!0;for(let r of e.npcs)if(!(r.dead||r.inactive)&&s(r.pos.x,r.pos.z))return!0;return!1}update(e){if(this.dead)return;let t=this.game;if(this.kind==="police"&&this.updateSiren(e),this.hitCd=Math.max(0,this.hitCd-e),this.state==="parked"){this.speed=Math.max(0,this.speed-10*e),this.unload(e),this.cops.length&&this.cops.every(n=>n.inCar)&&(this.readyT+=e,this.readyT>1.2&&(this.state="leave",this.siren=!1,this.readyT=0)),this.sync(e);return}if(this.state==="respond"){let n=(this.stopX-this.x)*this.dir;if(n<=.4)this.state="parked",this.speed=0,this.unloadT=.9,this.siren=!1,this.readyT=0,t.ui.log("\u{1F694} \u041D\u0430\u0440\u044F\u0434 \u043D\u0430 \u043C\u0435\u0441\u0442\u0435");else{let s=Math.sqrt(14*Math.max(.3,n-.6));this.speed=Math.min(this.maxSpeed,Math.max(3.4,s))}}else this.state==="leave"?this.speed=Math.min(this.maxSpeed+3,this.speed+8*e):this.aheadBlocked()?this.speed=Math.max(0,this.speed-20*e):this.speed=Math.min(this.maxSpeed,this.speed+7*e);if(this.x+=this.dir*this.speed*e,this.sync(e),this.speed>4.5&&this.hitCd<=0){let n=Math.abs(t.player.pos.x-this.x),s=Math.abs(t.player.pos.z-this.z);n<2.3&&s<1.35&&(this.hitCd=2.5,this.speed*=.5,t.hitPlayer(11,null),t.sound.hit(),t.ui.toast("\u0422\u0435\u0431\u044F \u0441\u0431\u0438\u043B\u0438!","bad"))}if(this.state==="leave"&&Math.abs(this.x)>on+4){this.dispose();return}(this.kind==="civil"||this.kind==="police"&&this.state==="drive")&&(this.dir>0&&this.x>on?(this.x=-on-1,this.sync(0)):this.dir<0&&this.x<-on&&(this.x=on+1,this.sync(0)))}unload(e){if(this.copsToSpawn<=0)return;let t=this.game;if(this.unloadT-=e,this.unloadT>0)return;this.unloadT=.85;let n=this.z>0?1:-1,s=(this.copsToSpawn>1?this.copsSpawned===0?-1:1:0)*1.05,r=new A(this.x+s,.15,this.z),o=new A(this.x+s,0,this.z+n*2.3),a=new fn(t,{role:"cop",pos:r.clone(),yaw:n>0?0:Math.PI});a.car=this,a.exitFrom=r,a.exitTo=o,a.exitDur=.55,a.exiting=.55,a.pos.copy(r),a.char.root.position.copy(r),t.npcs.push(a),this.cops.push(a),this.copsSpawned++,this.copsToSpawn--}dispose(){this.dead=!0,this.game.scene.remove(this.group);for(let e of this.cops){this.game.scene.remove(e.char.root);let t=this.game.npcs.indexOf(e);t>=0&&this.game.npcs.splice(t,1)}this.cops.length=0}},ra=class{constructor(e){this.game=e,this.cars=[],this.backupCd=4,this.patrolCd=0,this.t=0}start(){[[-72,1],[-14,1],[40,-1],[82,-1]].forEach(([e,t])=>{this.cars.push(new fr(this,{kind:"civil",dir:t,x:e}))}),this.patrol(1),this.patrol(-1)}patrol(e){let t=e>0?-on-20-Math.random()*30:on+20+Math.random()*30,n=new fr(this,{kind:"police",dir:e,x:t,maxSpeed:12,z:e>0?bs:-bs});return this.cars.push(n),n}get wanted(){let e=this.game;return e.player.stars>0||(e.remoteStars||0)>0}get responses(){return this.cars.filter(e=>e.state==="respond"||e.state==="parked")}dispatch(e=2,t=!1){var h,u;let n=this.game,s=n.player.pos;if(this.responses.length>=2)return null;let r=s.z>0?bs:-bs,o=r>0?1:-1,a=o>0?-on-4-Math.random()*10:on+4+Math.random()*10,c=Pt(s.x-o*3.6,-on+8,on-8),l=new fr(this,{kind:"police",dir:o,z:r,x:a,stopX:c,maxSpeed:18});if(l.state="respond",l.siren=!0,l.speed=16,l.copsToSpawn=e,this.cars.push(l),!t){let d=Math.max(2,Math.round(Math.abs(c-a)/15));n.ui.log(`\u{1F694} \u0412\u044B\u0435\u0445\u0430\u043B \u043D\u0430\u0440\u044F\u0434 \u2014 \u0431\u0443\u0434\u0435\u0442 \u0447\u0435\u0440\u0435\u0437 ~${d} \u0441`)}return this.backupCd=22,this._sirenOn=!0,(u=(h=n.sound)==null?void 0:h.siren)==null||u.call(h,!0),l}update(e){var s,r;let t=this.game;this.t+=e;let n=this.cars.filter(o=>o.kind==="police"&&o.state==="drive");if(n.length<2&&(this.patrolCd-=e,this.patrolCd<=0&&(this.patrolCd=9,this.patrol(n.length===0?1:-1))),this.wanted&&this.responses.length<2){for(let o of this.cars)if(!(o.kind!=="police"||o.state!=="drive")&&Math.abs(o.x-t.player.pos.x)<13&&Math.abs(o.z-t.player.pos.z)<10){o.state="respond",o.siren=!0,o.maxSpeed=11,o.stopX=o.x+o.dir*3.6,o.copsToSpawn=2,o.copsSpawned=0,t.ui.log("\u{1F694} \u041F\u0430\u0442\u0440\u0443\u043B\u044C \u0437\u0430\u043C\u0435\u0442\u0438\u043B \u0442\u0435\u0431\u044F \u0438 \u0442\u043E\u0440\u043C\u043E\u0437\u0438\u0442");break}}if(this.wanted){this.backupCd-=e;let o=t.npcs.filter(a=>a.role==="cop"&&!a.inactive&&!a.dead).length;this.backupCd<=0&&this.responses.length<2&&o<5&&this.dispatch(2)}else{let o=!1;for(let a of this.cars)a.state==="respond"&&(a.state="leave",a.siren=!1,a.copsToSpawn=0),(a.state==="parked"||a.state==="leave")&&(o=!0);!o&&this._sirenOn&&(this._sirenOn=!1,(r=(s=t.sound)==null?void 0:s.siren)==null||r.call(s,!1))}for(let o of this.cars)o.update(e);this.cars.some(o=>o.dead)&&(this.cars=this.cars.filter(o=>!o.dead))}nearestResponse(e){let t=null,n=1e9;for(let s of this.responses){let r=Ct(s.pos,e);r<n&&(n=r,t=s)}return t}dispose(){for(let e of this.cars)e.dispose();this.cars.length=0}};var Vx=()=>Sn("asphalt",256,256,(i,e,t)=>{i.fillStyle="#31333a",i.fillRect(0,0,e,t),ai(i,e,t,46,5e3),na(i,e,t,"rgba(18,18,22,1)",18,60,.5)},14,14),Gx=()=>Sn("sidewalk",256,256,(i,e,t)=>{i.fillStyle="#8b8b87",i.fillRect(0,0,e,t),ai(i,e,t,40,2600),i.strokeStyle="rgba(60,60,60,.55)",i.lineWidth=2;for(let n=0;n<=4;n++)i.beginPath(),i.moveTo(n*e/4,0),i.lineTo(n*e/4,t),i.stroke(),i.beginPath(),i.moveTo(0,n*t/4),i.lineTo(e,n*t/4),i.stroke();na(i,e,t,"rgba(50,50,50,1)",22,30,.25)},10,10),Wx=()=>Sn("brick",256,256,(i,e,t)=>{i.fillStyle="#6b3f34",i.fillRect(0,0,e,t);let n=16,s=40;for(let r=0;r<t;r+=n)for(let o=-s;o<e+s;o+=s){let a=r/n%2?s/2:0,c=90+Math.random()*46;i.fillStyle=`rgb(${c+22},${c-18},${c-32})`,i.fillRect(o+a+1.5,r+1.5,s-3,n-3)}ai(i,e,t,40,2200)},4,4),Xx=(i="plaster",e="#9a927f")=>Sn(i,256,256,(t,n,s)=>{t.fillStyle=e,t.fillRect(0,0,n,s),ai(t,n,s,26,2400),na(t,n,s,"rgba(60,55,45,1)",16,70,.2),t.strokeStyle="rgba(70,66,56,.25)",t.lineWidth=1;for(let r=0;r<8;r++)t.beginPath(),t.moveTo(Math.random()*n,0),t.lineTo(Math.random()*n,s),t.stroke()},3,3),ah=(i,e,t=.5)=>Sn(i,512,512,(n,s,r)=>{n.fillStyle=e,n.fillRect(0,0,s,r),ai(n,s,r,30,3e3);let o=5,a=5,c=62,l=78,h=(s-o*c)/(o+1),u=(r-a*l)/(a+1);for(let d=0;d<a;d++)for(let f=0;f<o;f++){let g=h+f*(c+h),y=u+d*(l+u),m=Math.random()<t;n.fillStyle=m?`rgba(255,214,140,${.75+Math.random()*.25})`:`rgba(24,30,38,${.85})`,n.fillRect(g,y,c,l),n.strokeStyle="rgba(30,30,30,.8)",n.lineWidth=4,n.strokeRect(g,y,c,l),n.beginPath(),n.moveTo(g+c/2,y),n.lineTo(g+c/2,y+l),n.stroke(),m||(n.fillStyle="rgba(120,150,180,.10)",n.beginPath(),n.moveTo(g,y+l),n.lineTo(g+c*.7,y),n.lineTo(g+c,y),n.lineTo(g+c*.3,y+l),n.fill())}},1,1),qx=()=>Sn("woodFloor",256,256,(i,e,t)=>{i.fillStyle="#6d4a2e",i.fillRect(0,0,e,t);for(let n=0;n<t;n+=32){i.fillStyle=`rgba(${60+Math.random()*40},${40+Math.random()*26},${20+Math.random()*18},1)`,i.fillRect(0,n,e,30),i.strokeStyle="rgba(30,20,10,.5)",i.lineWidth=2;for(let s=0;s<5;s++)i.beginPath(),i.moveTo(0,n+4+s*6),i.bezierCurveTo(e*.3,n+s*6,e*.6,n+12,e,n+3+s*6),i.stroke()}ai(i,e,t,34,1800)},6,6),yf=()=>Sn("tile",256,256,(i,e,t)=>{i.fillStyle="#3c4046",i.fillRect(0,0,e,t);for(let n=0;n<t;n+=64)for(let s=0;s<e;s+=64)i.fillStyle=(s+n)%128?"#4a4f57":"#42474e",i.fillRect(s+2,n+2,60,60);ai(i,e,t,30,1500)},6,6);function St(i,e,t,n,s,r,o,a,c,l="wall",h=!0){let u=new tt(new pe(r,o,a),c);return u.position.set(t,n+o/2,s),u.castShadow=!0,u.receiveShadow=!0,i.add(u),h&&e.add(t-r/2,t+r/2,s-a/2,s+a/2,l,u),u}function qn(i,e,t,n,s,r,o=.02){let a=new tt(new un(n,s),r);return a.rotation.x=-Math.PI/2,a.position.set(e,o,t),a.receiveShadow=!0,i.add(a),a}var xf=(i,e,t="#101418",n="#ffd45e",s="#c9c2a8")=>{let r=ta(512,160,(a,c,l)=>{a.fillStyle=t,a.fillRect(0,0,c,l);let h=a.createLinearGradient(0,0,0,l);h.addColorStop(0,"rgba(255,255,255,.10)"),h.addColorStop(1,"rgba(0,0,0,.35)"),a.fillStyle=h,a.fillRect(0,0,c,l),a.strokeStyle=n,a.lineWidth=5,a.strokeRect(9,9,c-18,l-18),a.textAlign="center",a.textBaseline="middle",a.fillStyle=n,a.font='900 62px Impact,"Arial Black",sans-serif',a.fillText(i,c/2,e?l*.4:l*.52),e&&(a.fillStyle=s,a.font="600 30px system-ui,sans-serif",a.fillText(e,c/2,l*.75))}),o=new Si(r);return o.colorSpace=Xt,o};function vf(i,e){let t=new $e;i.add(t);let n={},s=new tt(new un(400,400),j(2898470,{roughness:1}));s.rotation.x=-Math.PI/2,s.receiveShadow=!0,s.position.y=-.02,t.add(s);let r=qn(t,0,0,200,12,j(16777215,{map:Vx(),roughness:.95}),.01),o=j(16777215,{map:Gx(),roughness:.95});qn(t,0,-7.4,200,4.4,o,.12),qn(t,0,7.5,200,5,o,.12);let a=j(10132116,{roughness:.9});[-5,5].forEach(L=>{let q=St(t,e,0,0,L,200,.22,.35,a,"noLOS",!1);q.castShadow=!1});let c=j(14275240,{roughness:.8});for(let L=-92;L<96;L+=8)qn(t,L,0,3.4,.22,c,.03).castShadow=!1;for(let L=0;L<7;L++)qn(t,2.6,-4.4+L*1.45,5.5,.6,c,.035);let l={x1:-16,x2:-2,z1:10,z2:22,h:3.3},h=new $e;t.add(h);let u=j(16777215,{map:Xx("plasterHouse","#8d7c62"),roughness:.92}),d=j(16777215,{map:qx(),roughness:.85});qn(h,(l.x1+l.x2)/2,(l.z1+l.z2)/2,l.x2-l.x1,l.z2-l.z1,d,.13);let f=.3;St(h,e,(l.x1+-9.6)/2,0,l.z1+f/2,-9.6-l.x1,l.h,f,u),St(h,e,(-7.4+l.x2)/2,0,l.z1+f/2,l.x2+7.4,l.h,f,u),St(h,e,-8.5,2.4,l.z1+f/2,2.2,l.h-2.4,f,u,"wall",!1),St(h,e,(l.x1+l.x2)/2,0,l.z2-f/2,l.x2-l.x1,l.h,f,u),St(h,e,l.x1+f/2,0,(l.z1+l.z2)/2,f,l.h,l.z2-l.z1,u),St(h,e,l.x2-f/2,0,(l.z1+l.z2)/2,f,l.h,l.z2-l.z1,u);let g=new tt(new pe(l.x2-l.x1,.2,l.z2-l.z1),j(7037781,{roughness:.95}));g.position.set((l.x1+l.x2)/2,l.h+.1,(l.z1+l.z2)/2),g.castShadow=!0,g.receiveShadow=!0,h.add(g);let y=Q(De(l.x2-l.x1+.8,.35,l.z2-l.z1+.8,.1),j(4011048,{roughness:.95}),(l.x1+l.x2)/2,l.h+.35,(l.z1+l.z2)/2);h.add(y);let m=new $e;m.position.set(-7.4,0,l.z1+f/2),h.add(m);let p=Q(De(2.2,2.35,.12,.03),j(5913122,{roughness:.8}),-1.1,1.18,0);m.add(p),p.add(Q(new Ut(.06,8,6),j(14202442,{metalness:.9,roughness:.25}),-1.95,0,.1));let b=e.add(-9.6,-7.4,l.z1+.02,l.z1+.28,"door");h.add(Q(new pe(3,.14,1.1),j(10130047,{roughness:.9}),-8.5,.07,l.z1-.55)),h.add(Q(De(.3,.24,.22,.04),j(2764083,{roughness:.6,metalness:.4}),-8.5,2.72,l.z1-.02)),h.add(Q(new Ut(.1,10,8),j(16773824,{emissive:16770720,emissiveIntensity:1.6}),-8.5,2.62,l.z1-.16));let x=new rn(16767392,9,9,2);x.position.set(-8.5,2.5,l.z1-.6),h.add(x),n.houseDoor={pivot:m,open:!1,angle:0,collider:b,pos:new A(-8.5,0,l.z1+.4)};let M=j(2766160,{roughness:.92}),D=j(13222573,{roughness:.95}),w=j(4862496,{roughness:.9});n.bedSpots=[],[-14,-11.5].forEach((L,q)=>{let F=new $e;F.position.set(L,0,12.05),h.add(F),F.add(Q(De(1.5,.35,2.3,.06),w,0,.22,0)),F.add(Q(De(1.35,.24,2.1,.09),M,0,.48,0)),F.add(Q(De(1.3,.1,1.5,.06),D,0,.58,.28)),F.add(Q(De(.8,.16,.42,.1),j(15262414),0,.62,-.78)),F.add(Q(De(1.5,.75,.12,.05),w,0,.55,-1.16)),e.add(L-.75,L+.75,10.9,13.2,"furniture"),n.bedSpots.push({pos:new A(L,.56,13),yaw:Math.PI,idx:q,wakePos:new A(L+(q===0?-.5:.5),0,14.1)})});let R=j(4016722,{roughness:.55,metalness:.5});n.lockers=[],[15.6,17.9].forEach((L,q)=>{let F=new $e;F.position.set(-15.1,0,L),h.add(F),F.add(Q(De(.75,2,.85,.04),R,0,1,0));let ie=Q(De(.05,1.85,.78,.02),j(4938339,{roughness:.5,metalness:.6}),.39,1,0);F.add(ie),F.add(Q(new pe(.06,.22,.05),j(14202442,{metalness:.9,roughness:.2}),.43,1.05,.3));for(let Pe=0;Pe<3;Pe++)F.add(Q(new pe(.02,.02,.55),j(2765882),.42,1.7,0));e.add(-15.6,-14.7,L-.5,L+.5,"furniture"),n.lockers.push({id:q===0?"lockerA":"lockerB",pos:new A(-14.4,0,L),lockers3d:F,label:q===0?"\u0428\u043A\u0430\u0444 1":"\u0428\u043A\u0430\u0444 2"})});let P=new $e;P.position.set(-6.4,0,18.4),h.add(P),P.add(Q(De(1.9,.1,1.1,.04),w,0,.78,0)),[[-.8,-.4],[.8,-.4],[-.8,.4],[.8,.4]].forEach(([L,q])=>P.add(Q(new et(.05,.05,.78,6),w,L,.39,q))),e.add(-7.4,-5.4,17.8,19,"furniture");let H=qn(h,-9.5,17.5,5,3.4,j(7024431,{roughness:1}),.08);H.castShadow=!1;let _=Q(De(1.5,.9,.09,.03),j(1119258,{roughness:.4}),-6.4,1.6,21.6);h.add(_),_.add(Q(new un(1.4,.8),j(2241348,{emissive:2771558,emissiveIntensity:.6}),0,0,.06)),h.add(Q(De(4.2,.95,.75,.05),j(7301724,{roughness:.8}),-13,.5,21.4)),h.add(Q(De(4.3,.09,.85,.03),j(2896440,{roughness:.5}),-13,1,21.4)),e.add(-15.1,-10.9,21,21.8,"furniture");let S=new rn(16767392,22,14,2);S.position.set(-9,2.7,16),h.add(S);let z=new rn(16763274,10,9,2);z.position.set(-13.5,2.4,12.5),h.add(z),h.add(Q(new et(.01,.01,.5,4),j(2236962),-9,3.05,16)),h.add(Q(new Ut(.12,10,8),j(16773824,{emissive:16768922,emissiveIntensity:1.4}),-9,2.78,16));let I={x1:-2,x2:26,z1:-34,z2:-9,h:7.2},k=new $e;t.add(k);let K=j(16777215,{map:ah("bankFacade","#7d7466",.45),roughness:.85}),G=j(14209728,{roughness:.9}),ce=j(16777215,{map:yf(),roughness:.55});qn(k,(I.x1+I.x2)/2,(I.z1+I.z2)/2,I.x2-I.x1,I.z2-I.z1,ce,.05);let X=.4;St(k,e,(I.x1+9)/2,0,I.z2-X/2,9-I.x1,I.h,X,K),St(k,e,(14+I.x2)/2,0,I.z2-X/2,I.x2-14,I.h,X,K),St(k,e,11.5,4.2,I.z2-X/2,5,I.h-4.2,X,K,"wall",!1),St(k,e,(I.x1+I.x2)/2,0,I.z1+X/2,I.x2-I.x1,I.h,X,K),St(k,e,I.x1+X/2,0,(I.z1+I.z2)/2,X,I.h,I.z2-I.z1,K),St(k,e,I.x2-X/2,0,(I.z1+I.z2)/2,X,I.h,I.z2-I.z1,K);let ve=Q(De(I.x2-I.x1+1,.5,I.z2-I.z1+1,.1),j(3816e3,{roughness:.9}),(I.x1+I.x2)/2,I.h+.25,(I.z1+I.z2)/2);k.add(ve);let Me=new tt(new pe(I.x2-I.x1,.2,I.z2-I.z1),j(9274999,{roughness:.9}));Me.position.set((I.x1+I.x2)/2,I.h,(I.z1+I.z2)/2),k.add(Me);for(let L=0;L<4;L++){let q=2+L*6.6;k.add(Q(new et(.35,.4,I.h-.4,12),j(13617076,{roughness:.8}),q,(I.h-.4)/2+.2,I.z2+.7)),e.add(q-.42,q+.42,I.z2+.3,I.z2+1.1,"wall")}for(let L=0;L<3;L++)k.add(Q(new pe(10,.18,.55),j(11577491,{roughness:.9}),11.5,.09+L*.02,I.z2+1.4+L*.5));let Se=new un(11,3.4),Ke=new tt(Se,new Xn({map:xf("\u0411\u0410\u041D\u041A \xABDENI\xBB","\u041C\u0415\u0416\u0414\u0423\u041D\u0410\u0420\u041E\u0414\u041D\u042B\u0419 \u0411\u0410\u041D\u041A \xB7 24 \u0427\u0410\u0421\u0410"),transparent:!1}));Ke.position.set(11.5,I.h-2.1,I.z2+.26),k.add(Ke),n.bankDoors=[],[9.6,11.9].forEach(L=>{let q=new $e;q.position.set(L,0,I.z2-.3),k.add(q);let F=Q(De(2,3,.08,.03),j(10473696,{transparent:!0,opacity:.28,roughness:.1,metalness:.2}),1,1.5,0);q.add(F),q.add(Q(new pe(2,.08,.12),j(12170146,{metalness:.7,roughness:.3}),1,.05,0));let ie=e.add(L,L+2,I.z2-.4,I.z2-.2,"door");n.bankDoors.push({pivot:q,collider:ie,baseX:L,open:!1})});let nt=j(5915184,{roughness:.75}),J=j(10473696,{transparent:!0,opacity:.22,roughness:.08,metalness:.3});for(let L=0;L<3;L++){let q=4.6+L*6;St(k,e,q,0,-22.6,4.4,1.15,1.1,nt,"furniture"),k.add(Q(new pe(4.4,1.1,.05),J,q,1.75,-23.1)),k.add(Q(new pe(4.6,.1,.12),j(13214247,{metalness:.85,roughness:.3}),q,2.32,-23.1)),k.add(Q(new pe(.55,.38,.05),j(1119516,{roughness:.4}),q-.9,1.45,-22.5)),k.add(Q(new pe(.5,.3,.03),j(2771558,{emissive:3894671,emissiveIntensity:.8}),q-.9,1.45,-22.46)),k.add(Q(new pe(.6,.08,.3),j(2237996),q+1.2,1.22,-22.4))}n.bankMoney=[],[4.6,8.6,10.6,12.6,16.6].forEach((L,q)=>{let F=gf(1e3);F.scale.setScalar(1.6),F.position.set(L+(q%2?.2:-.2),1.17,-22.2),k.add(F),n.bankMoney.push({mesh:F,pos:new A(L,1.2,-22.2),taken:!1,id:q})});let oe=new $e;oe.position.set(24,0,-20),k.add(oe),oe.add(Q(new et(1.9,1.9,.5,24),j(7170659,{metalness:.85,roughness:.35}),0,1.9,0)),oe.add(Q(new sn(.55,.09,6,16),j(13214247,{metalness:.9,roughness:.25}),0,1.9,.28));for(let L=0;L<5;L++){let q=L/5*Math.PI*2,F=Q(new et(.07,.07,.22,6),j(12170146,{metalness:.9,roughness:.2}),Math.cos(q)*1.45,1.9+Math.sin(q)*1.45,.26);F.rotation.x=Math.PI/2,oe.add(F)}e.add(22.2,25.9,-21.9,-18.1,"furniture"),k.add(Q(De(1,4,5,.05),j(4869974,{roughness:.6,metalness:.4}),25.6,2,-20));for(let L=0;L<18;L++){let F=1.4+Math.floor(L/6)*.62,ie=-14+L%6*.9;k.add(Q(new pe(.12,.5,.8),j(5922920,{metalness:.7,roughness:.4}),25.2,F,ie))}let Re=j(3037738,{roughness:.95,flat:!0});[[1.5,-12.5],[23.5,-11],[1.5,-28]].forEach(([L,q])=>{let F=Q(new et(.42,.32,.7,10),j(8018500,{roughness:.9}),L,.35,q);k.add(F),k.add(Q(new Ti(.85,1),Re,L,1.35,q)),k.add(Q(new Ti(.55,1),Re,L+.3,1.9,q+.2))});for(let L=0;L<4;L++){let q=6+L*2.2;k.add(Q(De(1.7,.16,.6,.05),j(3488322,{roughness:.7}),q,.5,-15.5)),k.add(Q(De(1.7,.7,.14,.05),j(3488322,{roughness:.7}),q,.85,-15.8)),[[-.7],[.7]].forEach(([F])=>k.add(Q(new pe(.1,.5,.5),j(2237996),q+F,.25,-15.5)))}[[8,4.4,-14],[16,4.4,-24]].forEach(([L,q,F])=>{let ie=new rn(16773328,16,16,2);ie.position.set(L,q,F),k.add(ie),k.add(Q(new et(.5,.6,.12,12),j(16774360,{emissive:16773312,emissiveIntensity:1.2}),L,q+.25,F))});let me=new tt(new Ut(.28,14,10),j(5574929,{emissive:3342336,emissiveIntensity:.6}));me.position.set(11.5,4,-9.4),k.add(me),n.alarmLamp=me;let te={x1:-32,x2:-18,z1:-26,z2:-9,h:4.4},xe=new $e;t.add(xe);let Ve=j(16777215,{map:ah("shopFacade","#5c5148",.6),roughness:.9});qn(xe,(te.x1+te.x2)/2,(te.z1+te.z2)/2,te.x2-te.x1,te.z2-te.z1,j(16777215,{map:yf(),roughness:.7}),.05);let ze=.35;St(xe,e,(te.x1-25.6)/2,0,te.z2-ze/2,-25.6-te.x1,te.h,ze,Ve),St(xe,e,(-22.4+te.x2)/2,0,te.z2-ze/2,te.x2+22.4,te.h,ze,Ve),St(xe,e,-24,2.9,te.z2-ze/2,3.2,te.h-2.9,ze,Ve,"wall",!1),St(xe,e,(te.x1+te.x2)/2,0,te.z1+ze/2,te.x2-te.x1,te.h,ze,Ve),St(xe,e,te.x1+ze/2,0,(te.z1+te.z2)/2,ze,te.h,te.z2-te.z1,Ve),St(xe,e,te.x2-ze/2,0,(te.z1+te.z2)/2,ze,te.h,te.z2-te.z1,Ve),xe.add(Q(De(te.x2-te.x1+.6,.4,te.z2-te.z1+.6,.1),j(3093048,{roughness:.9}),(te.x1+te.x2)/2,te.h+.2,(te.z1+te.z2)/2)),xe.add(Q(new pe(te.x2-te.x1,.16,te.z2-te.z1),j(5525578),(te.x1+te.x2)/2,te.h,(te.z1+te.z2)/2));let ee=new tt(new un(9.5,2.6),new Xn({map:xf("\u041E\u0420\u0423\u0416\u0418\u0415","\u0412\u0421\u0401 \u0414\u041B\u042F \u0421\u0415\u0420\u042C\u0401\u0417\u041D\u042B\u0425 \u041B\u042E\u0414\u0415\u0419","#1a0e0c","#ff8f3f","#e8c9a0")}));ee.position.set(-24,te.h-1,te.z2+.22),xe.add(ee);let C=j(16738858,{emissive:16734746,emissiveIntensity:2.2,roughness:.4}),fe=new tt(new pe(9.6,.12,.06),C);fe.position.set(-24,te.h-2.4,te.z2+.24),xe.add(fe);let de=new rn(16747082,10,10,2);de.position.set(-24,3,-9.6),xe.add(de);let ae=j(4863268,{roughness:.9});for(let L=0;L<2;L++)xe.add(Q(new pe(6.5,.14,.5),ae,-27.5+L*.05,1.5+L*1,-25.2));["rifle","shotgun","rifle","shotgun"].forEach((L,q)=>{let F=Pi(L);F.position.set(-29+q*1.9,1.75,-25.1),F.rotation.set(0,Math.PI/2,.1),F.scale.set(1.6,1.6,1.6),xe.add(F)}),["pistol","pistol","pistol"].forEach((L,q)=>{let F=Pi(L);F.position.set(-30+q*1.3,2.6,-25.1),F.rotation.set(0,Math.PI/2,0),F.scale.set(1.7,1.7,1.7),xe.add(F)}),St(xe,e,-24.5,0,-21,8.4,1.1,1,j(3812382,{roughness:.8}),"furniture"),xe.add(Q(new pe(8.6,.09,1.15),j(9071162,{roughness:.6,metalness:.2}),-24.5,1.14,-21));let be=j(4151852,{roughness:.85});for(let L=0;L<8;L++)xe.add(Q(new pe(.3,.16,.22),be,-27.8+L*.62,1.28,-20.8));for(let L=0;L<3;L++)xe.add(Q(new pe(2.6,.12,.5),ae,-29,2.9+L*.02,-18+L*1.6));for(let L=0;L<9;L++)xe.add(Q(new pe(.3,.2,.26),be,-30+L%3*.9,1+Math.floor(L/3)*.5,-19.6));xe.add(Q(De(1.1,1.3,.9,.04),j(3095108,{metalness:.6,roughness:.4}),-30.5,.65,-23.5)),xe.add(Q(new sn(.16,.04,6,12),j(12174025,{metalness:.9,roughness:.2}),-30.5,.95,-23));let T=new rn(16773328,16,16,2);T.position.set(-24,3.6,-17),xe.add(T),xe.add(Q(new et(.45,.55,.1,10),j(16774360,{emissive:16773312,emissiveIntensity:1.1}),-24,4.1,-18)),n.shopPoint=new A(-24.5,0,-19.2),n.sellerPos=new A(-24.5,0,-22.2),n.sellerYaw=0;let v=(L,q,F,ie,Pe,Be,we,qe)=>{let Ge=new $e;t.add(Ge);let st=j(16777215,{map:ah(Be,we,qe),roughness:.88}),U=new tt(new pe(q-L,Pe,ie-F),st);return U.position.set((L+q)/2,Pe/2,(F+ie)/2),U.castShadow=!0,U.receiveShadow=!0,Ge.add(U),e.add(L,q,F,ie,"building"),Ge.add(Q(new pe(q-L+.5,.35,ie-F+.5),j(3093048,{roughness:.9}),(L+q)/2,Pe+.15,(F+ie)/2)),Ge};v(30,58,-32,-9,11,"facadeA","#7a7060",.5),v(-64,-36,-30,-9,9.5,"facadeB","#6a6a72",.45),v(4,30,10,26,12,"facadeC","#786a58",.4),v(-36,-22,11,26,7.5,"facadeD","#6d6455",.5),v(-64,-40,12,28,8,"facadeE","#5f5a52",.45),v(46,62,-32,-10,8,"facadeF","#6b6055",.4);for(let L=0;L<4;L++){let q=34+L*6.2;t.add(Q(De(5.4,.16,2,.05),j(L%2?9185826:2906730,{roughness:.9}),q,3,-8.2)),t.add(Q(new pe(5.4,.1,.1),j(2763306,{metalness:.7}),q,3.05,-9.2)),t.add(Q(new un(5,2.4),j(2109504,{emissive:2837091,emissiveIntensity:.5,roughness:.3}),q,1.7,-8.98))}let B=new $e;B.position.set(40,0,15),t.add(B),B.add(Q(new pe(16,6,.4),j(16777215,{map:Wx(),roughness:.95}),0,3,-3.6)),e.add(32,48,10.6,11.4,"building");let $=new $e;$.position.set(2.5,0,1.5),$.rotation.y=-.45,B.add($);let ne=j(3099235,{roughness:.4,metalness:.5});$.add(Q(De(2.3,2,2.4,.2),ne,0,1.55,2.9)),$.add(Q(De(2.2,.9,1.6,.16),j(1779507,{roughness:.15,metalness:.4}),0,2.3,3.1)),$.add(Q(De(2.4,2.4,5.4,.12),j(9080726,{roughness:.7,metalness:.3}),0,1.9,-1.2)),$.add(Q(De(2.3,2.2,.08,.05),j(7172472,{roughness:.8}),0,1.85,-3.9)),[[-1.15,2.9],[1.15,2.9],[-1.15,-2.2],[1.15,-2.2],[-1.15,-.6],[1.15,-.6]].forEach(([L,q])=>{let F=new tt(new et(.5,.5,.3,12),j(1513500,{roughness:.8}));F.rotation.z=Math.PI/2,F.position.set(L,.5,q),F.castShadow=!0,$.add(F)}),e.add(38.2,43.6,12.6,20.4,"building"),n.boxSpawns=[],[[-3.4,2.2],[-4.4,4.6],[-2.2,5.6],[-5.2,1]].forEach(([L,q],F)=>{let ie=mf(.62);ie.position.set(40+L,0,15+q),ie.rotation.y=Math.random()*3,t.add(ie),n.boxSpawns.push({mesh:ie,pos:ie.position.clone(),id:F}),e.add(ie.position.x-.35,ie.position.x+.35,ie.position.z-.35,ie.position.z+.35,"furniture")}),n.truckPoint=new A(42.5,0,16),n.dockBossPoint=new A(36.5,0,13),[[-52,-8.8,0],[-36,-8.8,0],[-14,-8.8,0],[2,-8.8,0],[20,-8.8,0],[36,-8.8,0],[52,-8.8,0],[-52,8.8,Math.PI],[-36,8.8,Math.PI],[-16,8.8,Math.PI],[4,8.8,Math.PI],[20,8.8,Math.PI],[38,8.8,Math.PI],[54,8.8,Math.PI]].forEach(([L,q,F])=>{let ie=df();ie.position.set(L,0,q),ie.rotation.y=F,t.add(ie),e.add(L-.2,L+.2,q-.2,q+.2,"noLOS")}),[[-48,10],[-52,16],[-44,21],[-58,24],[20,8.9],[-40,-8.6],[52,-8.6],[56,10]].forEach(([L,q])=>{let F=uf(6+Math.random()*3);F.position.set(L,0,q),F.rotation.y=Math.random()*6,t.add(F),e.add(L-.35,L+.35,q-.35,q+.35,"noLOS")}),[[-46,12,.4],[-50,18,1.5],[8,8.8,0],[-20,8.8,0]].forEach(([L,q,F])=>{let ie=ff();ie.position.set(L,0,q),ie.rotation.y=F,t.add(ie),e.add(L-1,L+1,q-.4,q+.4,"noLOS")}),[[-42,9.4],[30,8.8],[-14,-8.7],[46,8.8]].forEach(([L,q])=>{let F=pf();F.position.set(L,0,q),F.rotation.y=Math.random(),t.add(F),e.add(L-.7,L+.7,q-.5,q+.5,"furniture")}),[[-3,8.6],[22,-8.6],[-30,-8.6]].forEach(([L,q])=>{t.add(Q(new et(.14,.16,.8,8),j(11811370,{roughness:.6}),L,.4,q)),t.add(Q(new Ut(.16,8,6),j(11811370,{roughness:.6}),L,.82,q))}),[[3.5,-8.6],[1.2,8.6]].forEach(([L,q])=>{let F=Q(new et(.1,.12,5,8),j(2764083,{metalness:.6,roughness:.5}),L,2.5,q);t.add(F);let ie=Q(De(.45,1.15,.3,.06),j(1711394),L,4.7,q);t.add(ie),[.36,0,-.36].forEach((Pe,Be)=>{t.add(Q(new Ut(.11,8,6),j(16724770,{emissive:Be===0?16720384:2228224,emissiveIntensity:Be===0?1.6:.2}),L,5.1+Pe,q+.16))}),e.add(L-.16,L+.16,q-.16,q+.16,"noLOS")});let Le=[9186091,2837099,3817290,7039802,9075243,2372623,11051674];return[[-34,-3.95,Math.PI/2],[-16,-3.95,Math.PI/2],[22,-3.95,Math.PI/2],[33,-3.95,Math.PI/2],[-50,-3.95,Math.PI/2],[-30,3.95,-Math.PI/2],[-20,3.95,-Math.PI/2],[24,3.95,-Math.PI/2],[36,3.95,-Math.PI/2],[-46,3.95,-Math.PI/2]].forEach(([L,q,F],ie)=>{let Pe=dr(Le[ie%Le.length]);Pe.position.set(L,0,q),Pe.rotation.y=F+(Math.random()-.5)*.02,t.add(Pe),e.add(L-2.15,L+2.15,q-.98,q+.98,"noLOS")}),t.add(Q(De(4.5,.15,2.2,.05),j(2899536,{roughness:.6}),16,2.8,8.4)),[[14.2,9.2],[17.8,9.2],[14.2,7.6],[17.8,7.6]].forEach(([L,q])=>t.add(Q(new et(.06,.06,2.8,6),j(2764083,{metalness:.6}),L,1.4,q))),t.add(Q(new un(4.3,2),j(2771563,{transparent:!0,opacity:.25,roughness:.1}),16,1.6,9.15)),n.npcPaths=[[[-52,-7.2],[-20,-7.2],[2,-7.2],[30,-7.2],[54,-7.2]],[[54,7.2],[24,7.2],[-4,7.2],[-34,7.2],[-56,7.2]],[[-30,-7.6],[-24,-8],[-18,-7.6]],[[6,7.6],[26,7.6]]],n.policeSpawns=[new A(-62,0,-2.5),new A(62,0,2.5),new A(-62,0,2.5)],n.cashierPos=new A(8.6,0,-24.2),n.guardPaths=[[new A(3.5,0,-13),new A(20,0,-13),new A(20,0,-20),new A(4,0,-20)],[new A(22,0,-26),new A(22,0,-14),new A(9,0,-17),new A(9,0,-27)]],n.bankInterior={x1:I.x1,x2:I.x2,z1:I.z1,z2:I.z2},n.update=(L,q,F,ie)=>{let Pe=n.houseDoor,Be=Pe.open?-Math.PI/2.1:0;Pe.angle+=(Be-Pe.angle)*Math.min(1,L*9),Pe.pivot.rotation.y=Pe.angle,Pe.collider.enabled=!Pe.open;let we=q&&Math.hypot(q.x-11.5,q.z- -9)<4.5;if(n.bankDoors.forEach(qe=>{var st,U;let Ge=we?1.85:0;qe.anim=((st=qe.anim)!=null?st:0)+(Ge-((U=qe.anim)!=null?U:0))*Math.min(1,L*6),qe.pivot.rotation.y=-qe.anim,qe.collider.enabled=!we}),n.alarmOn){let qe=(Math.sin(performance.now()*.008)+1)/2;n.alarmLamp.material.emissive.setRGB(qe,.05,.05),n.alarmLamp.material.emissiveIntensity=.5+qe*3}else n.alarmLamp.material.emissive.setRGB(.2,0,0),n.alarmLamp.material.emissiveIntensity=.4},n.resetBankMoney=()=>{n.bankMoney.forEach(L=>{L.taken=!1,L.mesh.visible=!0})},n}var Ss=6,li=15;function oa(){return[null,null,null,null,null,null]}function aa(){return{"9\u043C\u043C":0,"12\u043A":0,"7.62":0}}function Mf(i){let e=qt[i];return{t:e.melee?"melee":"weapon",id:i,mag:e.mag||0,ammoType:e.ammo||null}}function lh(i,e={}){switch(i){case"money":return{t:"money",qty:e.qty||1};case"bag":return{t:"bag",cash:e.cash||0};case"armor":return{t:"armor",qty:e.qty||100};default:return{t:i,...e}}}function Es(i){var e;return i?i.t==="money"?`\u041F\u0430\u0447\u043A\u0430 \u0434\u0435\u043D\u0435\u0433${i.qty>1?" \xD7"+i.qty:""}`:i.t==="bag"?"\u0421\u0443\u043C\u043A\u0430":i.t==="armor"?"\u0411\u0440\u043E\u043D\u0435\u0436\u0438\u043B\u0435\u0442":i.t==="weapon"||i.t==="melee"?((e=qt[i.id])==null?void 0:e.name)||i.id:"\u041F\u0440\u0435\u0434\u043C\u0435\u0442":"\u041A\u0443\u043B\u0430\u043A\u0438"}function Ii(i){var e;return i?i.t==="money"?"\u{1F4B5}":i.t==="bag"?"\u{1F392}":i.t==="armor"?"\u{1F9BA}":i.t==="weapon"||i.t==="melee"?((e=qt[i.id])==null?void 0:e.icon)||"\u{1F52B}":"\u{1F4E6}":"\u{1F44A}"}function bf(i){var e;return i?i.t==="money"?"\u0423\u043A\u0440\u0430\u0434\u0435\u043D\u043D\u044B\u0435 \u043F\u0430\u0447\u043A\u0438. \u0412 \u0438\u043D\u0432\u0435\u043D\u0442\u0430\u0440\u0435 \u043C\u043E\u0436\u043D\u043E \u043F\u0435\u0440\u0435\u0432\u0435\u0441\u0442\u0438 \u0432 \u0431\u0430\u043B\u0430\u043D\u0441 \u2014 \u0441\u0443\u043C\u043C\u0430 \u0441\u043B\u0443\u0447\u0430\u0439\u043D\u0430\u044F.":i.t==="bag"?"\u0421\u0443\u043C\u043A\u0430 \u0434\u043B\u044F \u043A\u0440\u0443\u043F\u043D\u044B\u0445 \u0434\u0435\u043B. \u0412\u043C\u0435\u0449\u0430\u0435\u0442 \u043C\u043D\u043E\u0433\u043E \u0434\u0435\u043D\u0435\u0433. \u041E\u0442\u043A\u0440\u044B\u0432\u0430\u0439 \u0438 \u0432\u044B\u0432\u043E\u0434\u0438 \u0441\u043A\u043E\u043B\u044C\u043A\u043E \u043D\u0443\u0436\u043D\u043E.":i.t==="armor"?"\u0411\u0440\u043E\u043D\u0435\u0436\u0438\u043B\u0435\u0442: \u043F\u043E\u0433\u043B\u043E\u0449\u0430\u0435\u0442 \u0447\u0430\u0441\u0442\u044C \u0443\u0440\u043E\u043D\u0430.":(i.t==="weapon"||i.t==="melee")&&((e=qt[i.id])==null?void 0:e.desc)||"":"\u0411\u0435\u0437 \u043E\u0440\u0443\u0436\u0438\u044F. \u041A\u0443\u043B\u0430\u043A\u0438 \u0432\u0441\u0435\u0433\u0434\u0430 \u0441 \u0442\u043E\u0431\u043E\u0439."}function pr(i,e){if(e.t==="money")for(let t=1;t<i.length;t++){let n=i[t];if(n&&n.t==="money")return n.qty+=e.qty,!0}if(e.t==="bag"){for(let t=1;t<i.length;t++)if(i[t]&&i[t].t==="bag")return!1}for(let t=1;t<i.length;t++)if(!i[t])return i[t]=e,!0;return!1}function Sf(){let i=Math.random();return i>.9?2600+Math.floor(Math.random()*1800):i>.55?1200+Math.floor(Math.random()*1200):450+Math.floor(Math.random()*700)}function Ef(){return 9e3+Math.floor(Math.random()*21e3)}var hh="deni_islam_save_v1";function ch(){return{v:1,money:500,hotbar:oa(),ammo:aa(),lockers:{lockerA:new Array(li).fill(null),lockerB:new Array(li).fill(null)},hp:100,pos:null,stars:0,bag:null,stats:{jobs:0,kills:0,robberies:0}}}function Yx(){try{if(window.AndroidStore&&typeof window.AndroidStore.load=="function"){let i=window.AndroidStore.load();if(i)return i}}catch{}try{return localStorage.getItem(hh)}catch{return null}}function $x(i){try{window.AndroidStore&&typeof window.AndroidStore.save=="function"&&window.AndroidStore.save(i)}catch{}try{localStorage.setItem(hh,i)}catch{}}function Tf(){var i,e;try{(e=(i=window.AndroidStore)==null?void 0:i.clear)==null||e.call(i)}catch{}try{localStorage.removeItem(hh)}catch{}}function uh(){var i,e;try{let t=Yx();if(!t)return ch();let n=JSON.parse(t),s=ch();return{...s,...n,ammo:{...s.ammo,...n.ammo||{}},lockers:{lockerA:(((i=n.lockers)==null?void 0:i.lockerA)||s.lockers.lockerA).slice(0,li),lockerB:(((e=n.lockers)==null?void 0:e.lockerB)||s.lockers.lockerB).slice(0,li)},stats:{...s.stats,...n.stats||{}}}}catch(t){return console.warn("save load failed",t),ch()}}function wf(i){try{$x(JSON.stringify(i))}catch{}}var ca=class{constructor(){this.ctx=null,this.ok=!1,this.sirenNodes=null,this.muted=!1}init(){var t,n;if(this.ctx){(n=(t=this.ctx).resume)==null||n.call(t);return}let e=window.AudioContext||window.webkitAudioContext;if(e)try{this.ctx=new e,this.master=this.ctx.createGain(),this.master.gain.value=.55,this.master.connect(this.ctx.destination);let s=Math.floor(this.ctx.sampleRate*1.2),r=this.ctx.createBuffer(1,s,this.ctx.sampleRate),o=r.getChannelData(0);for(let a=0;a<s;a++)o[a]=Math.random()*2-1;this.noiseBuf=r,this.ok=!0}catch{this.ok=!1}}resume(){var e,t;(t=(e=this.ctx)==null?void 0:e.resume)==null||t.call(e)}_noise(e=.15,t=1200,n=1,s=.5,r="lowpass"){if(!this.ok)return;let o=this.ctx,a=o.currentTime,c=o.createBufferSource();c.buffer=this.noiseBuf;let l=o.createBiquadFilter();l.type=r,l.frequency.value=t,l.Q.value=n;let h=o.createGain();h.gain.setValueAtTime(s,a),h.gain.exponentialRampToValueAtTime(.001,a+e),c.connect(l),l.connect(h),h.connect(this.master),c.start(a),c.stop(a+e+.02)}_tone(e,t=.12,n="sine",s=.25,r=null){if(!this.ok)return;let o=this.ctx,a=o.currentTime,c=o.createOscillator();c.type=n,c.frequency.setValueAtTime(e,a),r&&c.frequency.exponentialRampToValueAtTime(r,a+t);let l=o.createGain();l.gain.setValueAtTime(s,a),l.gain.exponentialRampToValueAtTime(.001,a+t),c.connect(l),l.connect(this.master),c.start(a),c.stop(a+t+.02)}shot(e="pistol"){this.ok&&(e==="shotgun"?(this._noise(.24,900,.8,.85),this._tone(90,.18,"square",.3,40)):e==="rifle"?(this._noise(.11,1800,1.2,.6),this._tone(140,.09,"square",.22,60)):(this._noise(.13,1500,1,.55),this._tone(150,.1,"square",.22,70)))}punch(){this._noise(.1,420,1.4,.35)}hit(){this._noise(.09,260,1.6,.4),this._tone(70,.08,"sine",.18)}cash(){this._tone(1250,.07,"square",.12),setTimeout(()=>this._tone(1680,.09,"square",.1),65)}ui(){this._tone(600,.05,"triangle",.12)}error(){this._tone(180,.16,"sawtooth",.16,120)}door(){this._noise(.22,320,.9,.25)}reload(){this._noise(.07,900,1.5,.25),setTimeout(()=>this._noise(.09,700,1.2,.3),160)}pickup(){this._tone(880,.07,"triangle",.16,1320)}siren(e){if(this.ok){if(e&&!this.sirenNodes){let t=this.ctx,n=t.createOscillator();n.type="sine",n.frequency.value=620;let s=t.createOscillator();s.type="sine",s.frequency.value=.42;let r=t.createGain();r.gain.value=190,s.connect(r),r.connect(n.frequency);let o=t.createGain();o.gain.value=.1,n.connect(o),o.connect(this.master),n.start(),s.start(),this.sirenNodes={o1:n,lfo:s,g:o}}else if(!e&&this.sirenNodes){let{o1:t,lfo:n,g:s}=this.sirenNodes;try{s.gain.value=0,t.stop(),n.stop()}catch{}this.sirenNodes=null}}}};var Je=(i,e="",t="")=>{let n=document.createElement(i);return e&&(n.className=e),t&&(n.innerHTML=t),n},Xe=i=>document.getElementById(i),Ts=()=>window.matchMedia("(pointer: coarse)").matches||"ontouchstart"in window,la=class{constructor(){this.onAction=()=>{},this.input={moveX:0,moveY:0,lookX:0,lookY:0,fire:!1,aim:!1,run:!1,jump:!1,act:!1,reload:!1,inv:!1},this._actEdge=!1,this._reloadEdge=!1,this._jumpEdge=!1,this._invEdge=!1,this.keys=new Set,this.modalOpen=!1,this.startTime=performance.now()}setLoading(e,t){let n=Xe("bootFill");n&&(n.style.width=Math.min(100,e)+"%"),t&&(Xe("bootTxt").textContent=t)}showMenu(){Xe("boot").classList.add("hidden"),Xe("menu").classList.remove("hidden"),Xe("hud").classList.add("hidden"),this.hideModal(),Xe("pause").classList.add("hidden")}hideMenu(){Xe("menu").classList.add("hidden")}showHUD(){Xe("hud").classList.remove("hidden"),Xe("hintPC").style.display=Ts()?"none":"block",Xe("touchLeft").style.display=Ts()?"block":"none",Xe("touchRight").style.display=Ts()?"block":"none",this.bindTouch()}hideHUD(){Xe("hud").classList.add("hidden")}setPlayer(e,t){Xe("pName").textContent=e,Xe("avaIcon").textContent=t}setStats({hp:e,stamina:t,money:n,stars:s}){if(e!==void 0&&(Xe("hpFill").style.width=Math.max(0,e)+"%",Xe("hpTxt").textContent=Math.max(0,Math.round(e))),t!==void 0&&(Xe("stFill").style.width=Math.max(0,t)+"%",Xe("stTxt").textContent=Math.round(t)),n!==void 0&&(Xe("money").textContent="$"+Math.floor(n).toLocaleString("ru-RU")),s!==void 0){let r="";for(let o=0;o<5;o++)r+=o<s?"<b>\u2605</b>":"\u2605";Xe("stars").innerHTML=r}}setNet(e,t=!0){let n=Xe("netStatus");n.innerHTML=`<i class="dot" style="background:${t?"#5ad25a":"#c9a23a"};box-shadow:0 0 8px ${t?"#5ad25a":"#c9a23a"}"></i> ${e}`}setCops(e){let t=Xe("copLine");if(t){if(!e){t.classList.add("hidden");return}t.classList.remove("hidden"),t.textContent=e}}setVoice(e,t=!1){let n=Xe("voiceStatus");n.textContent=(t?"\u{1F399} ":"\u{1F507} ")+e,n.style.color=t?"#9adf9a":"#8f8877"}setJob(e){let t=Xe("jobLine");e?(t.classList.remove("hidden"),t.innerHTML=e):t.classList.add("hidden")}setPrompt(e){let t=Xe("prompt");if(!e){t.classList.add("hidden");return}t.classList.remove("hidden"),t.innerHTML=e}setProgress(e,t){let n=Xe("progress");if(e===null){n.classList.add("hidden");return}n.classList.remove("hidden"),Xe("progressFill").style.width=Math.max(0,Math.min(100,e*100))+"%",t&&(Xe("progressTxt").textContent=t)}setCrosshair(e){Xe("crosshair").style.display=e?"block":"none"}hitFlash(){let e=Xe("hitflash");e.style.opacity=".85",clearTimeout(this._hf),this._hf=setTimeout(()=>e.style.opacity="0",90)}log(e){let t=Xe("log"),n=Je("div","",e);for(t.appendChild(n);t.children.length>5;)t.removeChild(t.firstChild);setTimeout(()=>{n.style.opacity="0",n.style.transition="opacity .5s"},3800),setTimeout(()=>n.remove(),4400)}toast(e,t=""){let n=Je("div","toast "+t,e);Xe("toasts").appendChild(n),setTimeout(()=>{n.style.opacity="0",n.style.transition="opacity .35s"},2300),setTimeout(()=>n.remove(),2750)}renderHotbar(e,t,n){let s=Xe("hotbar");s.innerHTML="";for(let r=0;r<Ss;r++){let o=Je("div","slot"+(t===r?" sel":"")+(r>0&&!e[r]?" empty":"")),a=r===0?null:e[r];o.innerHTML=`<span class="num">${r+1}</span><span class="ico">${r===0?"\u{1F44A}":Ii(a)}</span>`,a&&a.t==="money"&&a.qty>1&&(o.innerHTML+=`<span class="qty">\xD7${a.qty}</span>`),a&&a.t==="weapon"&&(o.innerHTML+=`<span class="ammo">${a.mag}</span>`),a&&a.t==="bag"&&(o.innerHTML+='<span class="ammo">\u{1F4B0}</span>'),o.addEventListener("click",()=>n(r)),s.appendChild(o)}}showModal({title:e,sub:t,body:n,foot:s}){this.modalOpen=!0,Xe("modalTitle").textContent=e||"",Xe("modalSub").innerHTML=t||"";let r=Xe("modalBody");r.innerHTML="",typeof n=="string"?r.innerHTML=n:n&&r.appendChild(n);let o=Xe("modalFoot");o.innerHTML="",s&&(Array.isArray(s)?s:[s]).forEach(a=>o.appendChild(a)),Xe("modal").classList.remove("hidden"),Xe("hud").style.pointerEvents="auto"}hideModal(){this.modalOpen=!1,Xe("modal").classList.add("hidden"),Xe("hud").style.pointerEvents="none"}showPause(){Xe("pause").classList.remove("hidden"),Xe("pause").querySelectorAll("[data-pause]").forEach(e=>{e.onclick=()=>this.onAction("pause:"+e.dataset.pause)})}hidePause(){Xe("pause").classList.add("hidden")}bindTouch(){if(this._touchBound)return;this._touchBound=!0;let e=Xe("stick"),t=Xe("knob"),n=null,s=0,r=0,o=(p,b)=>{t.style.transform=`translate(${p}px,${b}px)`},a=(p,b)=>{let x=e.clientWidth/2,M=p-s,D=b-r,w=Math.hypot(M,D),R=x*.72;w>R&&(M=M/w*R,D=D/w*R),o(M,D),this.input.moveX=M/R,this.input.moveY=D/R},c=p=>{var M;let b=p.changedTouches?p.changedTouches[0]:p;n=(M=b.identifier)!=null?M:"m";let x=e.getBoundingClientRect();s=x.left+x.width/2,r=x.top+x.height/2,a(b.clientX,b.clientY),p.preventDefault()},l=p=>{if(n===null)return;let x=(p.changedTouches?Array.from(p.changedTouches):[p]).find(M=>{var D;return((D=M.identifier)!=null?D:"m")===n});x&&(a(x.clientX,x.clientY),p.preventDefault())},h=p=>{!(p.changedTouches?Array.from(p.changedTouches):[p]).find(M=>{var D;return((D=M.identifier)!=null?D:"m")===n})&&p.changedTouches||(n=null,this.input.moveX=0,this.input.moveY=0,o(0,0))};e.addEventListener("touchstart",c,{passive:!1}),e.addEventListener("touchmove",l,{passive:!1}),e.addEventListener("touchend",h),e.addEventListener("touchcancel",h),e.addEventListener("mousedown",c),window.addEventListener("mousemove",p=>{n==="m"&&l(p)}),window.addEventListener("mouseup",p=>{n==="m"&&h(p)});let u=(p,b,x)=>{let M=Xe(p);if(!M)return;let D=R=>{R.preventDefault(),R.stopPropagation(),M.classList.add("active"),b&&b()},w=R=>{R&&R.stopPropagation(),M.classList.remove("active"),x&&x()};M.addEventListener("touchstart",D,{passive:!1}),M.addEventListener("touchend",w),M.addEventListener("touchcancel",w),M.addEventListener("mousedown",D),M.addEventListener("mouseup",w),M.addEventListener("mouseleave",w)};u("btnFire",()=>this.input.fire=!0,()=>this.input.fire=!1),u("btnRun",()=>this.input.run=!0,()=>this.input.run=!1),u("btnAct",()=>{this._actEdge=!0,this.input.act=!0},()=>this.input.act=!1),u("btnReload",()=>{this._reloadEdge=!0},()=>{}),u("btnJump",()=>{this._jumpEdge=!0},()=>{}),u("btnInv",()=>{this._invEdge=!0},()=>{});let d=document.getElementById("c"),f=null,g=0,y=0;d.addEventListener("touchstart",p=>{if(!this.modalOpen){for(let b of p.changedTouches)if(!(b.clientX<window.innerWidth*.42)){f=b.identifier,g=b.clientX,y=b.clientY;break}}},{passive:!0}),d.addEventListener("touchmove",p=>{if(f!==null)for(let b of p.changedTouches)b.identifier===f&&(this.input.lookX+=(b.clientX-g)*.0055,this.input.lookY+=(b.clientY-y)*.0045,g=b.clientX,y=b.clientY)},{passive:!0});let m=p=>{for(let b of p.changedTouches)b.identifier===f&&(f=null)};d.addEventListener("touchend",m),d.addEventListener("touchcancel",m)}bindDesktop(e,t){let n={KeyW:"w",KeyA:"a",KeyS:"s",KeyD:"d",KeyE:"act",KeyR:"reload",ShiftLeft:"run",ShiftRight:"run",KeyQ:"inv",Tab:"inv",Space:"jump"};window.addEventListener("keydown",s=>{if(this.modalOpen)return;if(s.repeat){s.code==="Tab"&&s.preventDefault();return}let r=n[s.code];if(s.code==="Tab"&&s.preventDefault(),s.code.startsWith("Digit")){let o=parseInt(s.code.slice(5),10);o>=1&&o<=6&&this.onAction("slot:"+(o-1));return}if(s.code==="Escape"){this.onAction("pause:toggle");return}r&&(r==="act"&&(this._actEdge=!0),r==="reload"&&(this._reloadEdge=!0),r==="jump"&&(this._jumpEdge=!0),r==="inv"&&(this._invEdge=!0),this.keys.add(r),r==="run"&&(this.input.run=!0))}),window.addEventListener("keyup",s=>{let r=n[s.code];r&&(this.keys.delete(r),r==="run"&&(this.input.run=!1))}),e.addEventListener("mousedown",s=>{var r;if(!this.modalOpen){if(document.pointerLockElement!==e){(r=e.requestPointerLock)==null||r.call(e);return}s.button===0&&(this.input.fire=!0),s.button===2&&(this.input.aim=!0)}}),window.addEventListener("mouseup",s=>{s.button===0&&(this.input.fire=!1),s.button===2&&(this.input.aim=!1)}),e.addEventListener("contextmenu",s=>s.preventDefault()),document.addEventListener("mousemove",s=>{document.pointerLockElement===e&&(this.input.lookX+=s.movementX*.0022,this.input.lookY+=s.movementY*.002)}),document.addEventListener("pointerlockchange",()=>{t==null||t(document.pointerLockElement===e)}),window.addEventListener("wheel",s=>{this.modalOpen||this.onAction("slotwheel:"+Math.sign(s.deltaY))},{passive:!0})}keyboardMove(){let e=this.keys,t=0,n=0;e.has("w")&&(n-=1),e.has("s")&&(n+=1),e.has("a")&&(t-=1),e.has("d")&&(t+=1);let s=Math.hypot(t,n)||1;return{x:t/s,y:n/s,active:!!(t||n)}}consumeAct(){let e=this._actEdge;return this._actEdge=!1,e}consumeReload(){let e=this._reloadEdge;return this._reloadEdge=!1,e}consumeJump(){let e=this._jumpEdge;return this._jumpEdge=!1,e}consumeInv(){let e=this._invEdge;return this._invEdge=!1,e}consumeLook(){let e={x:this.input.lookX,y:this.input.lookY};return this.input.lookX=0,this.input.lookY=0,e}controlsHTML(){return`
      <table class="ctrl-table">
        <tr><td>\u041F\u041A \xB7 \u0434\u0432\u0438\u0436\u0435\u043D\u0438\u0435</td><td>W A S D</td></tr>
        <tr><td>\u041F\u041A \xB7 \u043E\u0431\u0437\u043E\u0440</td><td>\u041C\u044B\u0448\u044C (\u043A\u043B\u0438\u043A \u043F\u043E \u044D\u043A\u0440\u0430\u043D\u0443 \u2014 \u0437\u0430\u0445\u0432\u0430\u0442)</td></tr>
        <tr><td>\u041F\u041A \xB7 \u0432\u044B\u0441\u0442\u0440\u0435\u043B / \u0443\u0434\u0430\u0440</td><td>\u041B\u041A\u041C</td></tr>
        <tr><td>\u041F\u041A \xB7 \u043F\u0440\u0438\u0446\u0435\u043B</td><td>\u041F\u041A\u041C</td></tr>
        <tr><td>\u041F\u041A \xB7 \u0434\u0435\u0439\u0441\u0442\u0432\u0438\u0435</td><td>E (\u0434\u0432\u0435\u0440\u044C, \u0448\u043A\u0430\u0444, \u0432\u0437\u044F\u0442\u044C \u0434\u0435\u043D\u044C\u0433\u0438, \u043A\u0443\u043F\u0438\u0442\u044C, \u044F\u0449\u0438\u043A)</td></tr>
        <tr><td>\u041F\u041A \xB7 \u043F\u0435\u0440\u0435\u0437\u0430\u0440\u044F\u0434\u043A\u0430</td><td>R</td></tr>
        <tr><td>\u041F\u041A \xB7 \u0431\u0435\u0433</td><td>Shift (\u0442\u0440\u0430\u0442\u0438\u0442 \u0441\u0442\u0430\u043C\u0438\u043D\u0443)</td></tr>
        <tr><td>\u041F\u041A \xB7 \u0438\u043D\u0432\u0435\u043D\u0442\u0430\u0440\u044C</td><td>Tab / Q</td></tr>
        <tr><td>\u041F\u041A \xB7 \u0441\u043B\u043E\u0442\u044B</td><td>1 \u2026 6 \u0438\u043B\u0438 \u043A\u043E\u043B\u0435\u0441\u043E \u043C\u044B\u0448\u0438</td></tr>
        <tr><td>\u041F\u041A \xB7 \u043F\u0430\u0443\u0437\u0430</td><td>Esc</td></tr>
        <tr><td>\u0422\u0435\u043B\u0435\u0444\u043E\u043D \xB7 \u0434\u0432\u0438\u0436\u0435\u043D\u0438\u0435</td><td>\u0414\u0436\u043E\u0439\u0441\u0442\u0438\u043A \u0441\u043B\u0435\u0432\u0430</td></tr>
        <tr><td>\u0422\u0435\u043B\u0435\u0444\u043E\u043D \xB7 \u043E\u0431\u0437\u043E\u0440</td><td>\u0421\u0432\u0430\u0439\u043F \u043F\u043E \u043F\u0440\u0430\u0432\u043E\u0439 \u0447\u0430\u0441\u0442\u0438 \u044D\u043A\u0440\u0430\u043D\u0430</td></tr>
        <tr><td>\u0422\u0435\u043B\u0435\u0444\u043E\u043D \xB7 \u043A\u043D\u043E\u043F\u043A\u0438</td><td>\u041E\u0413\u041E\u041D\u042C \xB7 \u041F\u0415\u0420\u0415\u0417\u0410\u0420\u042F\u0414 \xB7 \u0411\u0415\u0413 \xB7 \u0414\u0415\u0419\u0421\u0422\u0412\u0418\u0415</td></tr>
        <tr><td>\u0422\u0435\u043B\u0435\u0444\u043E\u043D \xB7 \u0441\u043B\u043E\u0442\u044B</td><td>\u041D\u0430\u0436\u043C\u0438 \u044F\u0447\u0435\u0439\u043A\u0443 \u0441\u043D\u0438\u0437\u0443</td></tr>
      </table>
      <div class="note">\u0421\u0442\u0430\u043C\u0438\u043D\u0430 \u0442\u0440\u0430\u0442\u0438\u0442\u0441\u044F \u043D\u0430 \u0431\u0435\u0433 \u0438 \u0443\u0434\u0430\u0440. \u041F\u0435\u0440\u0435\u0437\u0430\u0440\u044F\u0434\u043A\u0430: \u043A\u043D\u043E\u043F\u043A\u0430/\u043A\u043B\u0430\u0432\u0438\u0448\u0430, \u0435\u0441\u043B\u0438 \u043F\u0430\u0442\u0440\u043E\u043D\u043E\u0432 \u043D\u0435\u0442 \u2014 \u0438\u0433\u0440\u0430 \u043D\u0430\u043F\u043E\u043C\u043D\u0438\u0442 \u043A\u0443\u043F\u0438\u0442\u044C \u0438\u0445 \u0432 \u043C\u0430\u0433\u0430\u0437\u0438\u043D\u0435 \u043E\u0440\u0443\u0436\u0438\u044F.</div>`}aboutHTML(){return`
      <div class="note" style="font-size:12.5px;color:#d8d0bd;line-height:1.65">
      <b style="color:#ffd88a">DENI ISLAM</b> \u2014 \u0441\u0443\u0440\u043E\u0432\u044B\u0439 \u0433\u043E\u0440\u043E\u0434, \u0434\u0432\u0430 \u0433\u0435\u0440\u043E\u044F \u0438 \u043E\u0434\u0438\u043D \u0431\u0430\u043D\u043A.<br><br>
      \u0422\u044B \u2014 <b>\u0414\u0436\u0435\u043D\u0442\u0435\u043B\u044C\u043C\u0435\u043D</b>: \u043A\u043E\u0441\u0442\u044E\u043C, \u0448\u043B\u044F\u043F\u0430, \u0441\u0442\u0430\u043B\u044C\u043D\u044B\u0435 \u043D\u0435\u0440\u0432\u044B. \u041D\u0430\u043F\u0430\u0440\u043D\u0438\u043A \u2014 <b>\u0413\u043E\u043F\u043D\u0438\u043A</b>: \u0441\u043F\u043E\u0440\u0442\u0438\u0432\u043A\u0438, \u043A\u0435\u043F\u043A\u0430, \u0441\u0438\u0433\u0430\u0440\u0435\u0442\u0430,
      \u0438 \u043E\u043D \u0432\u0441\u0435\u0433\u0434\u0430 \u0433\u043E\u0442\u043E\u0432 \u043D\u0430 \xAB\u0434\u0435\u043B\u043E\xBB. \u0412\u044B \u043F\u0440\u043E\u0441\u044B\u043F\u0430\u0435\u0442\u0435\u0441\u044C \u0432 \u043E\u0434\u043D\u043E\u0439 \u043A\u043E\u043C\u043D\u0430\u0442\u0435, \u043D\u0430 \u0434\u0432\u0443\u0445 \u043A\u0440\u043E\u0432\u0430\u0442\u044F\u0445.<br><br>
      \u2022 <b>\u0423\u043B\u0438\u0446\u0430</b> \u2014 \u043F\u043E\u0434\u0440\u0430\u0431\u043E\u0442\u043A\u0438: \u043F\u043E\u0434\u043E\u0439\u0434\u0438 \u043A \u0433\u0440\u0443\u0437\u043E\u0432\u0438\u043A\u0443 \u043D\u0430 \u0441\u043A\u043B\u0430\u0434\u0435, \u0442\u0430\u0449\u0438 \u044F\u0449\u0438\u043A\u0438, \u043F\u043E\u043B\u0443\u0447\u0430\u0439 \u0434\u0435\u043D\u044C\u0433\u0438. \u0420\u0430\u0437\u043D\u044B\u0435 \u043F\u0440\u043E\u0445\u043E\u0436\u0438\u0435 \u0438\u043D\u043E\u0433\u0434\u0430 \u0441\u0430\u043C\u0438 \u043F\u043E\u0434\u0445\u043E\u0434\u044F\u0442 \u0441 \u0440\u0430\u0431\u043E\u0442\u043E\u0439.<br>
      \u2022 <b>\u041C\u0430\u0433\u0430\u0437\u0438\u043D \u043E\u0440\u0443\u0436\u0438\u044F</b> \u2014 \u043F\u0438\u0441\u0442\u043E\u043B\u0435\u0442, \u0434\u0440\u043E\u0431\u043E\u0432\u0438\u043A, \u0430\u0432\u0442\u043E\u043C\u0430\u0442, \u043D\u043E\u0436, \u0434\u0443\u0431\u0438\u043D\u043A\u0430, \u043F\u0430\u0442\u0440\u043E\u043D\u044B \u0438 \u0441\u0443\u043C\u043A\u0430. \u041F\u0430\u0442\u0440\u043E\u043D\u044B \u0434\u0435\u0448\u0451\u0432\u044B\u0435 \u2014 \u043D\u0435 \u044D\u043A\u043E\u043D\u043E\u043C\u044C.<br>
      \u2022 <b>\u0411\u0430\u043D\u043A</b> \u2014 \u0442\u0430\u043C \u043C\u043D\u043E\u0433\u043E \u0434\u0435\u043D\u0435\u0433. \u041A\u0430\u0441\u0441\u0438\u0440\u0448\u0430 \u0438 \u043E\u0445\u0440\u0430\u043D\u0430 \u0441\u043C\u043E\u0442\u0440\u044F\u0442 \u0432 \u043E\u0431\u0430: \u043F\u043E\u043A\u0430\u0436\u0435\u0448\u044C \u0441\u0442\u0432\u043E\u043B \u2014 \u043F\u0430\u043D\u0438\u043A\u0430 \u0438 \u0442\u0440\u0435\u0432\u043E\u0433\u0430, \u043F\u0440\u0438\u0435\u0434\u0435\u0442 \u043F\u043E\u043B\u0438\u0446\u0438\u044F.<br>
      \u2022 <b>\u0417\u0432\u0451\u0437\u0434\u044B \u0440\u043E\u0437\u044B\u0441\u043A\u0430</b> \u2014 \u043E\u0442 1 \u0434\u043E 5. \u0423\u0439\u0434\u0438 \u0441 \u043C\u0435\u0441\u0442\u0430 \u043F\u0440\u0435\u0441\u0442\u0443\u043F\u043B\u0435\u043D\u0438\u044F \u0438 \u0441\u043F\u0440\u044F\u0447\u044C\u0441\u044F (\u0434\u043E\u043C + \u0437\u0430\u043A\u0440\u044B\u0442\u0430\u044F \u0434\u0432\u0435\u0440\u044C) \u2014 \u0442\u0435\u0431\u044F \u043F\u043E\u0441\u0442\u0435\u043F\u0435\u043D\u043D\u043E \u0437\u0430\u0431\u044B\u0432\u0430\u044E\u0442.<br>
      \u2022 <b>\u0421\u043C\u0435\u0440\u0442\u044C</b> \u2014 \u0438\u043D\u0432\u0435\u043D\u0442\u0430\u0440\u044C \u043F\u0440\u043E\u043F\u0430\u0434\u0430\u0435\u0442. \u0414\u0435\u043D\u044C\u0433\u0438 \u0438 \u0446\u0435\u043D\u043D\u044B\u0435 \u0432\u0435\u0449\u0438 \u0445\u0440\u0430\u043D\u0438 \u0432 \u0448\u043A\u0430\u0444\u0430\u0445 \u0434\u043E\u043C\u0430.<br>
      \u2022 <b>\u041E\u043D\u043B\u0430\u0439\u043D</b> \u2014 \u043E\u0434\u043D\u0430 \u043A\u043E\u043C\u043D\u0430\u0442\u0430 \u043D\u0430 \u0434\u0432\u043E\u0438\u0445, \u0433\u043E\u043B\u043E\u0441\u043E\u0432\u043E\u0439 \u0447\u0430\u0442 \u0432\u043A\u043B\u044E\u0447\u0430\u0435\u0442\u0441\u044F \u043F\u0440\u0438 \u0432\u0445\u043E\u0434\u0435 \u0432 \u0438\u0433\u0440\u0443. \u0414\u0440\u0443\u0433 \u043D\u0435 \u043F\u043E\u043B\u0443\u0447\u0430\u0435\u0442 \u0443\u0440\u043E\u043D\u0430 \u043E\u0442 \u0442\u0435\u0431\u044F.
      </div>`}};var ws=(i=0,e=0,t=0)=>new A(i,e,t),ha=()=>window.matchMedia("(pointer: coarse)").matches||innerWidth<820,ua=class{constructor(e,t,n){bu(this,"loop",()=>{requestAnimationFrame(this.loop);let e=Math.min(.06,this.clock.getDelta());if(this.time+=e,this.state==="menu"){this.updateMenuCam(e),this.renderer.render(this.scene,this.camera);return}if(this.state==="play"||this.state==="dead"){this.uiPaused=this.ui.modalOpen||this.pauseOpen,this.uiPaused||this.update(e),this.ui.consumeLook(),this.renderer.render(this.scene,this.camera),this.pv&&this.ui.modalOpen&&this.renderPreview(e);return}this.renderer.render(this.scene,this.camera)});this.canvas=e,this.ui=t,this.net=n,this.state="boot",this.clock=new Jo,this.time=0,this.colliders=null,this.npcs=[],this.sound=new ca,this.server="solo",this.stats={jobs:0,kills:0,robberies:0},this.lockers=null,this.uiPaused=!1,this.playerSeen=!1,this.remoteSeen=!1,this.unseen=0,this.grabbing=!1,this.grabProgress=0,this.moneyRespawnT=0,this.job=null,this.carrying=null,this.offersT=20,this.copSpawnT=0,this.remoteStars=0,this.tracers=[],this.flashes=[],this.lastNet=0,this.fpsAcc=0,this.fireCd=0,this.reloading=null,this.recoil=0,this.bob=0,this.viewModel=null,this.viewWeaponId=null,this.intro=null,this.currentPrompt=null,this.hudTick=0}async init(){this.renderer=this._createRenderer(),this.scene=new er,this.scene.fog=new Do(9273970,80,300),this.camera=new Ot(72,innerWidth/innerHeight,.05,700),this.camera.rotation.order="YXZ",this.scene.add(this.camera);let e=new ur;e.scale.setScalar(1200),this.scene.add(e);let t=e.material.uniforms;t.turbidity.value=7.5,t.rayleigh.value=1.7,t.mieCoefficient.value=.0065,t.mieDirectionalG.value=.86;let n=new A().setFromSphericalCoords(1,eh.degToRad(74),eh.degToRad(212));t.sunPosition.value.copy(n),this.sky=e,this.sun=new _s(16765856,2.5),this.sun.castShadow=!0,this.sun.shadow.mapSize.set(ha()?1024:2048,ha()?1024:2048);let s=this.sun.shadow.camera;return s.near=1,s.far=220,s.left=-55,s.right=55,s.top=55,s.bottom=-55,this.sun.shadow.bias=-9e-4,this.sun.shadow.normalBias=.02,this.scene.add(this.sun),this.scene.add(this.sun.target),this.muzzleLight=new rn(16760944,0,10,2),this.scene.add(this.muzzleLight),this.scene.add(new lr(11060479,5982772,.65)),this.scene.add(new $o(16777215,.14)),this.colliders=new ea,this.world=vf(this.scene,this.colliders),this._spawnNpcs(),this._spawnAmbientNpcPool(),this.player={pos:ws(-14,0,13),yaw:Math.PI,pitch:0,vy:0,hp:100,maxHp:100,armor:0,stamina:100,maxStamina:100,money:500,stars:0,hotbar:oa(),ammo:aa(),selected:0,alive:!0,skin:"gentleman",name:"\u0414\u0416\u0415\u041D\u0422\u0415\u041B\u042C\u041C\u0415\u041D",sprintT:0},this.traffic=new ra(this),this.traffic.start(),addEventListener("resize",()=>this._resize()),this._resize(),this.menuCam={t:0},this.loop(),this.state="menu",this}_createRenderer(){let e=this.canvas,t=new Qs({canvas:e,antialias:!ha(),powerPreference:"high-performance",stencil:!1});return t.setPixelRatio(Math.min(window.devicePixelRatio||1,ha()?1.4:2)),t.setSize(innerWidth,innerHeight,!1),t.shadowMap.enabled=!0,t.shadowMap.type=Wl,t.toneMapping=Xl,t.toneMappingExposure=1.06,t}_resize(){var n;let e=innerWidth,t=innerHeight;this.camera.aspect=e/t,this.camera.updateProjectionMatrix(),(n=this.renderer)==null||n.setSize(e,t,!1),this.ui.setCrosshair(!0)}_spawnNpcs(){let e=this.world,t=["normal","elderly","thug","normal","elderly","normal","thug","normal","elderly","normal"];e.npcPaths.forEach((n,s)=>{for(let r=0;r<1;r++){let o=n[Math.floor(Math.random()*n.length)],a=t[(s*2+r)%t.length],c=new fn(this,{role:a==="elderly"?"old":a==="thug"?"thug":"ped",kind:a,pos:ws(o[0]+(Math.random()-.5)*3,0,o[1]+(Math.random()-.5)*1.5),path:n});c.pathIdx=Math.floor(Math.random()*n.length),this.npcs.push(c)}}),this.cashier=new fn(this,{role:"cashier",pos:this.world.cashierPos,yaw:0}),this.npcs.push(this.cashier),this.world.guardPaths.forEach(n=>{let s=new fn(this,{role:"guard",pos:n[0].clone(),path:n.map(r=>[r.x,r.z])});s.speed=1.5,this.npcs.push(s)}),this.seller=new fn(this,{role:"seller",pos:this.world.sellerPos,yaw:0}),this.npcs.push(this.seller),this.boss=new fn(this,{role:"boss",kind:"normal",pos:this.world.dockBossPoint,yaw:-1}),this.npcs.push(this.boss)}_spawnAmbientNpcPool(){this.ambientPool=[];for(let e=0;e<4;e++){let t=["normal","elderly","thug","normal"][e],n=new fn(this,{role:t==="elderly"?"old":t==="thug"?"thug":"ped",kind:t,pos:ws(-40+e*20,0,e%2?7.2:-7.2),path:this.world.npcPaths[e%this.world.npcPaths.length]});n.char.root.visible=!1,n.char.root.position.set(0,-50,0),n.pos.set(0,-50,0),n.inactive=!0,this.ambientPool.push(n)}}startMatch(e){var o,a;this.profile=e;let t=uh(),n=this.player;n.skin=e.skin,n.name=e.name,n.money=(o=t.money)!=null?o:500,n.hotbar=(a=t.hotbar)!=null&&a.length?t.hotbar:oa(),n.ammo=t.ammo||aa(),n.hp=Pt(t.hp||100,25,100),n.stars=0,n.selected=0,n.alive=!0,this.lockers=t.lockers||{lockerA:new Array(li).fill(null),lockerB:new Array(li).fill(null)},this.stats=t.stats||this.stats;let s=e.isHost?0:1;this.bedIdx=s;let r=this.world.bedSpots[s];n.pos.copy(r.pos),n.yaw=r.yaw+Math.PI,n.pitch=0,this.spawnPoint=r.wakePos.clone(),this.localChar&&this.scene.remove(this.localChar.root),this.localChar=new Ri(e.skin),this.localChar.root.position.copy(r.pos),this.localChar.root.position.y=.6,this.localChar.root.rotation.y=r.yaw,this.localChar.lieDown(),this.scene.add(this.localChar.root),this.ui.setPlayer(e.name,e.skin==="gopnik"?"\u{1F9E2}":"\u{1F3A9}"),this.ui.setStats({hp:n.hp,stamina:100,money:n.money,stars:0}),this.ui.renderHotbar(n.hotbar,n.selected,c=>this.selectSlot(c)),this.ui.showHUD(),this.ui.setNet(e.isHost?"\u041E\u041D\u041B\u0410\u0419\u041D \xB7 \u0436\u0434\u0451\u043C \u0438\u0433\u0440\u043E\u043A\u0430 2":"\u041E\u041D\u041B\u0410\u0419\u041D \xB7 \u043F\u043E\u0434\u043A\u043B\u044E\u0447\u0435\u043D\u043E",!0),this.intro={t:0,dur:4.6,active:!0},this.camIntro={pos:ws(-8.2,2.3,20.2),look:ws(-12.6,1,12.8)},this.state="play",this.clock.getDelta(),this.sound.init(),this.sound.resume(),this.viewRoot=new $e,this.camera.add(this.viewRoot),this._updateViewModel(),this.net.on("msg",c=>this.onNet(c)),this.net.on("open",()=>this.onPeerOpen()),this.net.on("close",()=>{this.ui.setNet("\u0421\u041E\u041B\u041E \xB7 \u0438\u0433\u0440\u043E\u043A 2 \u043E\u0442\u043A\u043B\u044E\u0447\u0438\u043B\u0441\u044F",!1),this.remote&&(this.scene.remove(this.remote.char.root),this.remote=null)}),this.net.on("mic",c=>this.ui.setVoice(c.ok?"\u0433\u043E\u043B\u043E\u0441 \u0432\u043A\u043B\u044E\u0447\u0451\u043D":"\u043C\u0438\u043A\u0440\u043E\u0444\u043E\u043D \u043D\u0435 \u0440\u0430\u0437\u0440\u0435\u0448\u0451\u043D",c.ok)),this.net.on("status",c=>this.ui.setNet(c.text,c.kind==="ok")),setInterval(()=>{this.state==="play"&&this.saveGame()},12e3),addEventListener("beforeunload",()=>this.saveGame()),document.addEventListener("visibilitychange",()=>{document.hidden&&this.saveGame()}),this.ui.toast("\u0422\u044B \u043F\u0440\u043E\u0441\u043D\u0443\u043B\u0441\u044F \u0432 \u0441\u0432\u043E\u0435\u0439 \u043A\u043E\u043C\u043D\u0430\u0442\u0435","good"),setTimeout(()=>this.ui.toast("\u0413\u043E\u043B\u043E\u0441\u043E\u0432\u043E\u0439 \u0447\u0430\u0442 \u0430\u043A\u0442\u0438\u0432\u0435\u043D \u2014 \u0434\u0440\u0443\u0433 \u0441\u043B\u044B\u0448\u0438\u0442 \u0442\u0435\u0431\u044F",""),3e3)}updateMenuCam(e){var s;this.menuCam.t+=e;let t=this.menuCam.t*.06,n=62;this.camera.position.set(Math.cos(t)*n+4,26+Math.sin(t*.7)*5,Math.sin(t)*n-4),this.camera.lookAt(4,3,-2),(s=this.traffic)==null||s.update(e),this.sun.position.copy(this.camera.position).add(ws(-30,60,30)),this.sun.target.position.set(4,0,0)}update(e){var n,s;let t=this.player;this.playerSeen=!1,this.remoteSeen=!1,(n=this.intro)!=null&&n.active?this.updateIntro(e):this.updatePlayer(e),this.updateWorld(e),(s=this.traffic)==null||s.update(e),this.updateNpcs(e),this.updateRemote(e),this.updateCombat(e),this.updateInteraction(e),this.updateWanted(e),this.updateJobs(e),this.updateOffers(e),this.updateTracers(e),this.netTick(e),this.syncCamera(e),this.hudTick+=e,this.hudTick>.12&&(this.hudTick=0,this.ui.setStats({hp:t.hp,stamina:t.stamina,money:t.money,stars:t.stars}),this.ui.setCops(this.copHudText())),this.moneyRespawnT>0&&(this.moneyRespawnT-=e,this.moneyRespawnT<=0&&(this.world.resetBankMoney(),this.ui.log("\u0412 \u0431\u0430\u043D\u043A\u0435 \u0441\u043D\u043E\u0432\u0430 \u043F\u043E\u044F\u0432\u0438\u043B\u0438\u0441\u044C \u0434\u0435\u043D\u044C\u0433\u0438")))}copHudText(){var t;let e=(t=this.traffic)==null?void 0:t.nearestResponse(this.player.pos);if(!e)return null;if(e.state==="respond"){let n=Math.abs(e.stopX-e.x);return`\u{1F694} \u041D\u0410\u0420\u042F\u0414 \u0412 \u041F\u0423\u0422\u0418 \xB7 ~${Math.max(1,Math.ceil(n/Math.max(4,e.speed)))} \u0441`}return e.state==="parked"?"\u{1F694} \u041F\u041E\u041B\u0418\u0426\u0418\u042F \u041D\u0410 \u041C\u0415\u0421\u0422\u0415":null}updateIntro(e){var o;let t=this.intro;t.t+=e;let n=Pt(t.t/t.dur,0,1),s=this.camIntro.look,r=this.camIntro.pos.clone();if(r.x+=Math.sin(t.t*.5)*.25,r.y+=Math.sin(t.t*.7)*.08,this.camera.position.copy(r),this.camera.lookAt(s.x,s.y+Math.sin(t.t)*.05,s.z),this.localChar.update(e,0),this.remote&&this.remote.char.update(e,0),t.t>t.dur-1.6&&!t.woke&&(t.woke=!0,this.localChar.wakeUp(),(o=this.remote)==null||o.char.wakeUp(),this.ui.log("\u041F\u043E\u0434\u044A\u0451\u043C, \u0434\u0435\u043B\u0430 \u0436\u0434\u0443\u0442.")),t.t>=t.dur){t.active=!1,this.intro=null;let a=this.player;a.pos.copy(this.spawnPoint),a.yaw=Math.PI*.75,this.localChar.root.visible=!1,this.ui.setJob(null),this.ui.setVoice(this.net.voiceOn?"\u0433\u043E\u043B\u043E\u0441 \u0432\u043A\u043B\u044E\u0447\u0451\u043D":"\u043C\u0438\u043A\u0440\u043E\u0444\u043E\u043D \u0432\u044B\u043A\u043B\u044E\u0447\u0435\u043D",this.net.voiceOn)}}updateWorld(e){this.world.update(e,this.player.pos),this.player.hp<this.player.maxHp&&this.state==="play"&&(this.player.hp=Math.min(this.player.maxHp,this.player.hp+e*.55))}updatePlayer(e){var x;let t=this.player;if(t===null)return;if(!t.alive){(x=this.localChar)==null||x.update(e,0);return}let n=this.ui.consumeLook();t.yaw-=n.x,t.pitch=Pt(t.pitch-n.y,-1.35,1.25);let s=0,r=0,o=!1;if(Ts())s=this.ui.input.moveX,r=this.ui.input.moveY,o=Math.hypot(s,r)>.12;else{let M=this.ui.keyboardMove();s=M.x,r=M.y,o=M.active}let a=this.ui.input.run&&t.stamina>2&&o,c=a?6.3:3.4;a?(t.stamina=Math.max(0,t.stamina-e*21),t.sprintT=0):(t.sprintT+=e,t.sprintT>.7&&(t.stamina=Math.min(t.maxStamina,t.stamina+e*16)));let l=Math.sin(t.yaw),h=Math.cos(t.yaw),u=-r,d=s,f=-l*u+h*d,g=-h*u+-l*d,y=Math.hypot(f,g);y>1&&(f/=y,g/=y);let m=Math.hypot(f,g)*c;t.pos.x+=f*c*e,t.pos.z+=g*c*e,this.colliders.resolve(t.pos,.36),this.ui.consumeJump()&&t.pos.y<=.01&&(t.vy=4.4),t.vy-=12*e,t.pos.y=Math.max(0,t.pos.y+t.vy*e),t.pos.y<=0&&(t.vy=0),this.bob+=e*(o?m*1.9:2);let p=o?a?.055:.03:.006,b=this.localChar;b&&(b.root.position.set(t.pos.x,t.pos.y,t.pos.z),b.root.rotation.y=t.yaw+Math.PI,b.root.visible=!1,b.aiming=this.playerArmed()||!1,b.update(e,o?m:0)),this.recoil=Math.max(0,this.recoil-e*3.6),this.camBob=p}syncCamera(e){var r;let t=this.player;if((r=this.intro)!=null&&r.active)return;let n=1.63,s=Math.sin(this.bob)*(this.camBob||.01);if(this.camera.position.set(t.pos.x,t.pos.y+n+s,t.pos.z),this.camera.rotation.set(t.pitch+this.recoil*.055,t.yaw,Math.sin(this.bob*.5)*.006),this.viewRoot){if(this.viewRoot.position.set(.26,-.24+Math.sin(this.bob)*(this.camBob||.01)*.6,-.5),this.viewRoot.rotation.set(-.02,.05,0),this.reloading){let o=1-this.reloading.t/1.3;this.viewRoot.rotation.z=Math.sin(o*Math.PI)*.9,this.viewRoot.position.y-=Math.sin(o*Math.PI)*.12}if(this.grabbing){let o=this.time*6.5;this.viewRoot.position.y+=Math.sin(o)*.055-.05,this.viewRoot.position.z-=.06,this.viewRoot.rotation.x+=Math.sin(o)*.28-.15,this.viewRoot.rotation.z+=Math.sin(o*.5)*.12}}this.sun.position.set(t.pos.x-40,70,t.pos.z+45),this.sun.target.position.set(t.pos.x,0,t.pos.z)}updateNpcs(e){let t=this.player.pos;for(let n of this.npcs){if(n.inactive)continue;if(Ct(n.pos,t)>95){n.char.update(e,0);continue}n.update(e),n.jobOffer&&!this.job&&Ct(n.pos,t)<2.6&&(this.pendingOffer=n)}for(let n=this.npcs.length-1;n>=0;n--){let s=this.npcs[n];if(!(s.role!=="cop"||s.inactive)){if(this.player.stars!==0||(this.remoteStars||0)!==0){s.calmT=0;continue}s.car||(s.calmT=(s.calmT||0)+e,s.calmT>6&&(s.leaving=!0,s.pos.x+=(s.startPos.x-s.pos.x)*e*.9,s.pos.z+=(s.startPos.z-s.pos.z)*e*.9,s.char.root.position.set(s.pos.x,0,s.pos.z),Ct(s.pos,s.startPos)<3&&(this.scene.remove(s.char.root),this.npcs.splice(n,1))))}}}updateRemote(e){let t=this.remote;t&&(t.pos.lerp(t.target,Math.min(1,e*12)),t.char.root.position.copy(t.pos),t.char.root.rotation.y+=vs(t.char.root.rotation.y,t.yaw)*Math.min(1,e*10),t.char.aiming=!!t.aim,t.weapon!==t.char.weaponId&&t.char.setWeapon(t.weapon),t.char.update(e,t.speed||0,{aiming:t.aim}),t.stars=t.stars||0,this.remoteStars=t.stars)}currentItem(){let e=this.player;return e.selected===0?null:e.hotbar[e.selected]}currentWeaponId(){let e=this.currentItem();return e?e.t==="weapon"||e.t==="melee"?e.id:e.t==="bag"?"bag":"fists":"fists"}playerArmed(){let e=this.currentItem();return!!(e&&e.t==="weapon")}updateCombat(e){let t=this.player;if(this.fireCd=Math.max(0,this.fireCd-e),!!t.alive){if(this.reloading)if(this.reloading.t-=e,this.reloading.t<=0){let n=this.reloading.item,s=qt[n.id],r=s.mag-n.mag,o=t.ammo[s.ammo]||0,a=Math.min(r,o);n.mag+=a,t.ammo[s.ammo]=o-a,this.reloading=null,this.sound.reload(),this.ui.renderHotbar(t.hotbar,t.selected,c=>this.selectSlot(c)),this.ui.setProgress(null)}else this.ui.setProgress(1-this.reloading.t/1.3,"\u041F\u0435\u0440\u0435\u0437\u0430\u0440\u044F\u0434\u043A\u0430\u2026");this.ui.consumeReload()&&this.startReload(),this.ui.input.fire&&this.fireCd<=0&&this.tryFire()}}startReload(){let e=this.player,t=this.currentItem();if(!t||t.t!=="weapon"||this.reloading)return;let n=qt[t.id];if(t.mag>=n.mag){this.ui.toast("\u041C\u0430\u0433\u0430\u0437\u0438\u043D \u043F\u043E\u043B\u043E\u043D","");return}if((e.ammo[n.ammo]||0)<=0){this.ui.toast("\u041F\u0430\u0442\u0440\u043E\u043D\u043E\u0432 \u043D\u0435\u0442 \u2014 \u043A\u0443\u043F\u0438 \u043F\u0430\u0442\u0440\u043E\u043D\u044B \u0432 \u043C\u0430\u0433\u0430\u0437\u0438\u043D\u0435 \u043E\u0440\u0443\u0436\u0438\u044F","bad"),this.sound.error();return}this.reloading={t:1.3,item:t},this.sound.reload()}tryFire(){let e=this.player,t=this.currentItem();if(!e.alive)return;if(!t)return this.meleeAttack("fists");if(t.t==="melee")return this.meleeAttack(t.id);if(t.t!=="weapon"){(t.t==="money"||t.t==="bag")&&this.ui.toast("\u042D\u0442\u043E \u043D\u0435 \u043E\u0440\u0443\u0436\u0438\u0435","");return}let n=qt[t.id];if(t.mag<=0){this.fireCd=.35,this.ui.toast("\u041C\u0430\u0433\u0430\u0437\u0438\u043D \u043F\u0443\u0441\u0442! \u041F\u0435\u0440\u0435\u0437\u0430\u0440\u044F\u0434\u0438\u0441\u044C (\u0438\u043B\u0438 \u043A\u0443\u043F\u0438 \u043F\u0430\u0442\u0440\u043E\u043D\u044B)","bad"),this.sound.error(),(e.ammo[n.ammo]||0)>0&&this.startReload();return}t.mag--,this.fireCd=n.rate,this.recoil=Math.min(1.6,this.recoil+(t.id==="rifle"?.22:t.id==="shotgun"?.55:.35)),this.sound.shot(t.id==="rifle"?"rifle":t.id),this.muzzleFlash();let s=this.camera.getWorldDirection(new A);s.x+=(Math.random()-.5)*n.spread*2,s.y+=(Math.random()-.5)*n.spread*2,s.z+=(Math.random()-.5)*n.spread*2,s.normalize();let r=this.hitscan(n.dmg,n.range,s,!1);this.net.send({t:"e",k:"shot",v:t.id,p:[e.pos.x,e.pos.z]}),this.ui.renderHotbar(e.hotbar,e.selected,o=>this.selectSlot(o)),(r||Math.random()<.6)&&this.panicNearby(14),!this.alarmOn&&this.inBank(e.pos)&&this.npcs.some(a=>!a.dead&&(a.role==="guard"||a.role==="cashier")&&Ct(a.pos,e.pos)<16&&this.visionCheck(a.pos,a.yaw,e.pos,2.2,16))&&setTimeout(()=>this.triggerAlarm("shot"),700)}meleeAttack(e){var r;let t=this.player,n=qt[e]||qt.fists;if(t.stamina<6){this.ui.toast("\u041D\u0435\u0442 \u0441\u0438\u043B \u2014 \u043E\u0442\u0434\u044B\u0448\u0438\u0441\u044C","bad");return}t.stamina-=7,this.fireCd=n.rate,(r=this.localChar)==null||r.punch(),this.sound.punch();let s=this.camera.getWorldDirection(new A);this.hitscan(n.dmg,2.1,s,!0)}hitscan(e,t,n,s){let r=this.camera.position.clone(),o=null,a=t,c=null,l=new A;for(let h of this.npcs){if(h.dead||h.inactive)continue;l.set(h.pos.x,1.15,h.pos.z);let u=l.clone().sub(r),d=u.dot(n);if(d<.2||d>t)continue;if(u.clone().sub(n.clone().multiplyScalar(d)).length()<(s?.85:.6)&&d<a){if(this.colliders.blocked(r.x,r.z,l.x,l.z))continue;o=h,a=d,c=r.clone().add(n.clone().multiplyScalar(d))}}if(this.remote&&!o){l.set(this.remote.pos.x,1.15,this.remote.pos.z);let h=l.clone().sub(r),u=h.dot(n),d=h.clone().sub(n.clone().multiplyScalar(u)).length();u>.2&&u<t&&d<.7&&(c=r.clone().add(n.clone().multiplyScalar(u)),this.ui.log("\u042D\u0442\u043E \u0442\u0432\u043E\u0439 \u043D\u0430\u043F\u0430\u0440\u043D\u0438\u043A \u2014 \u043F\u043E \u0441\u0432\u043E\u0438\u043C \u043D\u0435 \u0441\u0442\u0440\u0435\u043B\u044F\u0435\u043C"),this.sound.hit())}if(o)return o.damage(e,!0),this.sound.hit(),c=c||r.clone().add(n.clone().multiplyScalar(a)),this.spawnSpark(c,12591136),this.ui.hitFlash(),o.dead?(this.addStars(o.role==="cop"?2:1),this.stats.kills++):(o.role==="guard"||o.role==="cop")&&this.addStars(1),o;if(!s){let h=r.clone().add(n.clone().multiplyScalar(Math.min(t,45)));this.spawnSpark(h,16765066),this.tracer(r.clone().add(new A(.2,-.12,0)).add(n.clone().multiplyScalar(.5)),h)}return null}muzzleFlash(){let e=this.muzzleLight;e&&(e.position.copy(this.camera.position).add(this.camera.getWorldDirection(new A).multiplyScalar(.8)),e.intensity=24,this.flashes.some(t=>t.persistent)||this.flashes.push({l:e,t:.06,persistent:!0}))}spawnSpark(e,t,n=.07){let s=new tt(new Ut(n,6,5),new Xn({color:t}));s.position.copy(e),this.scene.add(s),this.flashes.push({l:s,t:.12,mesh:!0})}tracer(e,t){let n=new Dt().setFromPoints([e,t]),s=new nr({color:16770720,transparent:!0,opacity:.85}),r=new Fo(n,s);this.scene.add(r),this.tracers.push({line:r,t:.07})}updateTracers(e){for(let t=this.tracers.length-1;t>=0;t--){let n=this.tracers[t];n.t-=e,n.line.material.opacity=Math.max(0,n.t/.07)*.85,n.t<=0&&(this.scene.remove(n.line),n.line.geometry.dispose(),n.line.material.dispose(),this.tracers.splice(t,1))}for(let t=this.flashes.length-1;t>=0;t--){let n=this.flashes[t];if(n.t-=e,n.mesh?n.l.scale.setScalar(Math.max(.01,n.t/.12)):n.l.intensity=Math.max(0,n.l.intensity*.72),n.t<=0){if(n.persistent){n.l.intensity=0,this.flashes.splice(t,1);continue}this.scene.remove(n.l),n.mesh&&(n.l.geometry.dispose(),n.l.material.dispose()),this.flashes.splice(t,1)}}}updateInteraction(e){var a;let t=this.player;if((a=this.intro)!=null&&a.active||!t.alive){this.ui.setPrompt(null);return}let n=[],s=(c,l,h,u,d)=>{let f=Ct(t.pos,l);f<h&&n.push({id:c,d:f,label:u,fn:d})},r=this.world;if(s("door",r.houseDoor.pos,2.6,r.houseDoor.open?"\u0417\u0430\u043A\u0440\u044B\u0442\u044C \u0434\u0432\u0435\u0440\u044C":"\u041E\u0442\u043A\u0440\u044B\u0442\u044C \u0434\u0432\u0435\u0440\u044C",()=>this.toggleHouseDoor()),r.lockers.forEach(c=>s("locker"+c.id,c.pos,2.4,`\u041E\u0442\u043A\u0440\u044B\u0442\u044C ${c.label}`,()=>this.openLocker(c.id))),r.bedSpots.forEach((c,l)=>s("bed"+l,c.wakePos,2.2,"\u041B\u0435\u0447\u044C \u0441\u043F\u0430\u0442\u044C (\u0432\u043E\u0441\u0441\u0442\u0430\u043D\u043E\u0432\u0438\u0442\u044C \u0441\u0438\u043B\u044B)",()=>this.sleepInBed())),s("shop",r.shopPoint,3.4,"\u041A\u0430\u0442\u0430\u043B\u043E\u0433 \u043E\u0440\u0443\u0436\u0438\u044F",()=>this.openShop()),s("seller",new A(r.sellerPos.x,0,r.sellerPos.z+1.4),2.6,"\u041F\u043E\u0433\u043E\u0432\u043E\u0440\u0438\u0442\u044C \u0441 \u043F\u0440\u043E\u0434\u0430\u0432\u0446\u043E\u043C",()=>this.talkSeller()),s("boss",r.dockBossPoint,3.2,this.job?"\u0420\u0430\u0431\u043E\u0442\u0430: \u0432\u0437\u044F\u0442\u044C \u044F\u0449\u0438\u043A":"\u0423\u0441\u0442\u0440\u043E\u0438\u0442\u044C\u0441\u044F \u043D\u0430 \u043F\u043E\u0434\u0440\u0430\u0431\u043E\u0442\u043A\u0443",()=>this.startJob()),this.carrying)s("truck",r.truckPoint,4,"\u041F\u043E\u0433\u0440\u0443\u0437\u0438\u0442\u044C \u044F\u0449\u0438\u043A \u0432 \u0433\u0440\u0443\u0437\u043E\u0432\u0438\u043A",()=>this.deliverBox());else if(this.job)for(let c of r.boxSpawns)c.taken||s("box"+c.id,c.pos,2.2,"\u0412\u0437\u044F\u0442\u044C \u044F\u0449\u0438\u043A",()=>this.takeBox(c));this.pendingOffer&&Ct(this.pendingOffer.pos,t.pos)<3&&s("offernpc",this.pendingOffer.pos,3.2,`\u0421\u043E\u0433\u043B\u0430\u0441\u0438\u0442\u044C\u0441\u044F: \u043F\u043E\u0434\u0440\u0430\u0431\u043E\u0442\u043A\u0430 ($${this.offerPay||0})`,()=>this.acceptOffer(this.pendingOffer)),s("cashier",this.world.cashierPos,3.4,"\u041F\u043E\u0433\u043E\u0432\u043E\u0440\u0438\u0442\u044C \u0441 \u043A\u0430\u0441\u0441\u0438\u0440\u043E\u043C",()=>this.talkCashier()),n.sort((c,l)=>c.d-l.d);let o=n[0];if(o?(this.currentPrompt=o,this.ui.setPrompt(`<b>${Ts()?"\u0414\u0415\u0419\u0421\u0422\u0412\u0418\u0415":"E"}</b> ${o.label}`)):(this.currentPrompt=null,this.ui.setPrompt(null)),this.ui.consumeInv()){this.openInventory();return}this.ui.consumeAct()&&o&&(this.sound.ui(),o.fn()),this.updateMoneyGrab(e)}updateMoneyGrab(e){var l;let t=this.player,n=this.world.bankMoney.filter(h=>!h.taken),s=null,r=99;for(let h of n){let u=Ct(t.pos,h.pos);u<2.6&&u<r&&(s=h,r=u)}let o=this.ui.input.act||this.ui.keys.has("act");if(!s){this.grabbing=!1,this.grabProgress=0,this.ui.setProgress(null);return}let a=((l=this.currentItem())==null?void 0:l.t)==="bag",c=a?30:15;o&&t.alive?(this.grabbing=!0,this.currentPrompt={id:"money"},this.grabProgress+=e/c,this.ui.setPrompt(`<b>\u0414\u0415\u0420\u0416\u0418</b> ${a?"\u0421\u043A\u043B\u0430\u0434\u044B\u0432\u0430\u0435\u0448\u044C \u0434\u0435\u043D\u044C\u0433\u0438 \u0432 \u0441\u0443\u043C\u043A\u0443":"\u0425\u0432\u0430\u0442\u0430\u0435\u0448\u044C \u043F\u0430\u0447\u043A\u0438 \u0440\u0443\u043A\u0430\u043C\u0438"} \xB7 ${Math.round(this.grabProgress*100)}%`),this.ui.setProgress(this.grabProgress,a?"\u0421\u0443\u043C\u043A\u0430: \u043D\u0430\u043F\u043E\u043B\u043D\u0435\u043D\u0438\u0435 30 \u0441\u0435\u043A":"\u0413\u043E\u043B\u044B\u0435 \u0440\u0443\u043A\u0438: 5 \u043F\u0430\u0447\u0435\u043A \u0437\u0430 15 \u0441\u0435\u043A"),this.grabProgress>=1&&(this.grabProgress=0,this.completeRobbery(a))):(this.grabbing=!1,this.grabProgress=Math.max(0,this.grabProgress-e*.5),this.ui.setProgress(null))}completeRobbery(e){let t=this.player;this.world.bankMoney.forEach(r=>{r.taken=!0,r.mesh.visible=!1}),this.moneyRespawnT=210,this.stats.robberies++,this.net.send({t:"e",k:"money"}),this.sound.cash();let s=this.currentItem();if(e&&s&&s.t==="bag"){let r=Ef();s.cash=(s.cash||0)+r,this.ui.toast(`\u0412 \u0441\u0443\u043C\u043A\u0435 \u0442\u0435\u043F\u0435\u0440\u044C $${s.cash.toLocaleString("ru-RU")}`,"good"),this.ui.log("\u0421\u0443\u043C\u043A\u0430 \u043D\u0430\u0431\u0438\u0442\u0430. \u041E\u0442\u043A\u0440\u043E\u0439 \u0435\u0451 \u0432 \u0438\u043D\u0432\u0435\u043D\u0442\u0430\u0440\u0435 \u0438 \u0432\u044B\u0432\u0435\u0434\u0438 \u0434\u0435\u043D\u044C\u0433\u0438.")}else{let r=lh("money",{qty:5});pr(t.hotbar,r)?(this.ui.toast("5 \u043F\u0430\u0447\u0435\u043A \u0434\u0435\u043D\u0435\u0433 \u0443 \u0442\u0435\u0431\u044F \u0432 \u0438\u043D\u0432\u0435\u043D\u0442\u0430\u0440\u0435","good"),this.ui.log("\u041E\u0442\u043A\u0440\u043E\u0439 \u0438\u043D\u0432\u0435\u043D\u0442\u0430\u0440\u044C \u2192 \xAB\u041F\u0435\u0440\u0435\u0432\u0435\u0441\u0442\u0438 \u0432 \u0431\u0430\u043B\u0430\u043D\u0441\xBB")):this.ui.toast("\u041D\u0435\u0442 \u043C\u0435\u0441\u0442\u0430 \u0432 \u0440\u0443\u043A\u0430\u0445! \u041F\u0430\u0447\u043A\u0438 \u0432\u044B\u043F\u0430\u043B\u0438","bad")}this.ui.renderHotbar(t.hotbar,t.selected,r=>this.selectSlot(r)),this.addStars(2),this.triggerAlarm("robbery"),this.ui.setProgress(null)}toggleHouseDoor(){let e=this.world.houseDoor;e.open=!e.open,this.sound.door(),this.net.send({t:"e",k:"door",v:e.open}),e.open?this.ui.log("\u0414\u0432\u0435\u0440\u044C \u043E\u0442\u043A\u0440\u044B\u0442\u0430"):this.ui.log("\u0414\u0432\u0435\u0440\u044C \u0437\u0430\u043A\u0440\u044B\u0442\u0430 \u2014 \u043C\u043E\u0436\u043D\u043E \u0441\u043F\u0440\u044F\u0442\u0430\u0442\u044C\u0441\u044F")}sleepInBed(){let e=this.player;e.hp=Math.min(e.maxHp,e.hp+55),e.stamina=e.maxStamina,this.saveGame(),this.ui.toast("\u041F\u043E\u0441\u043F\u0430\u043B \xB7 \u0437\u0434\u043E\u0440\u043E\u0432\u044C\u0435 \u0432\u043E\u0441\u0441\u0442\u0430\u043D\u043E\u0432\u043B\u0435\u043D\u043E \xB7 \u0438\u0433\u0440\u0430 \u0441\u043E\u0445\u0440\u0430\u043D\u0435\u043D\u0430","good")}talkSeller(){this.ui.toast("\xAB\u0411\u0435\u0440\u0438 \u0441\u0442\u0432\u043E\u043B, \u043F\u0430\u0442\u0440\u043E\u043D\u044B \u0434\u0435\u0448\u0435\u0432\u043B\u0435 \u043D\u0435 \u0431\u0443\u0434\u0443\u0442\xBB","")}talkCashier(){if(this.playerArmed()){this.ui.toast("\u041A\u0430\u0441\u0441\u0438\u0440\u0448\u0430 \u0432 \u0443\u0436\u0430\u0441\u0435!","bad"),this.triggerAlarm("cashier");return}this.ui.toast("\xAB\u0418\u0437\u0432\u0438\u043D\u0438\u0442\u0435, \u0431\u0430\u043D\u043A \u0437\u0430\u043A\u0440\u044B\u0442 \u043D\u0430 \u0443\u0447\u0451\u0442\xBB","")}inBank(e){let t=this.world.bankInterior;return e.x>t.x1&&e.x<t.x2&&e.z>t.z1&&e.z<t.z2}addStars(e){let t=this.player;t.stars=Pt(t.stars+e,0,5),this.ui.setStats({stars:t.stars}),this.net.send({t:"e",k:"stars",v:t.stars})}triggerAlarm(e){this.alarmOn||(this.alarmOn=!0,this.world.alarmOn=!0,this.sound.siren(!0),this.ui.toast("\u26A0 \u0422\u0420\u0415\u0412\u041E\u0413\u0410! \u041F\u043E\u043B\u0438\u0446\u0438\u044F \u0432\u044B\u0435\u0445\u0430\u043B\u0430","bad"),this.ui.log("\u0421\u043C\u0430\u0442\u044B\u0432\u0430\u0439\u0441\u044F \u0441 \u043C\u0435\u0441\u0442\u0430 \u043F\u0440\u0435\u0441\u0442\u0443\u043F\u043B\u0435\u043D\u0438\u044F"),this.player.stars=Math.max(this.player.stars,2),this.ui.setStats({stars:this.player.stars}),this.net.send({t:"e",k:"alarm"}),this.spawnPolice(2))}calmDown(){this.alarmOn=!1,this.world.alarmOn=!1,this.sound.siren(!1)}spawnPolice(e){if(this.traffic){this.traffic.dispatch(Math.min(2,Math.max(1,e)));return}for(let t=0;t<e&&!(this.npcs.filter(r=>r.role==="cop").length>=4);t++){let n=this.world.policeSpawns[t%this.world.policeSpawns.length].clone(),s=new fn(this,{role:"cop",pos:n,yaw:0});s.path=null,this.npcs.push(s)}}markSeen(e,t){e===this.player?this.playerSeen=!0:this.remoteSeen=!0}nearestWantedPlayer(e){let t=this.player;return t.stars>0&&t.alive?{pos:t.pos,stars:t.stars,isRemote:!1}:this.remote&&(this.remoteStars||0)>0?{pos:this.remote.pos,stars:this.remoteStars,isRemote:!0}:null}updateWanted(e){let t=this.player;if(t.stars<=0){this.alarmOn&&this.calmDown(),this.unseen=0;return}this.playerSeen?this.unseen=0:this.unseen+=e;let r=t.pos.x>-16&&t.pos.x<-2&&t.pos.z>10&&t.pos.z<22&&!this.world.houseDoor.open?7:14;this.unseen>r&&(this.unseen=0,t.stars=Math.max(0,t.stars-1),this.ui.setStats({stars:t.stars}),this.ui.log(t.stars>0?`\u0420\u043E\u0437\u044B\u0441\u043A \u0441\u043D\u0438\u0436\u0435\u043D (${t.stars}\u2605)`:"\u0422\u0435\u0431\u044F \u043F\u043E\u0442\u0435\u0440\u044F\u043B\u0438 \u0438\u0437 \u0432\u0438\u0434\u0443. \u0427\u0438\u0441\u0442."),this.net.send({t:"e",k:"stars",v:t.stars}),t.stars===0&&this.calmDown())}copShootAt(e,t,n){this.sound.shot("pistol");let s=new A(e.pos.x+Math.sin(e.yaw)*.6,1.44,e.pos.z+Math.cos(e.yaw)*.6),r=new A(t.x+(Math.random()-.5)*.6,1.2,t.z+(Math.random()-.5)*.6);this.spawnSpark(s,16769184,.13),this.tracer(s,r),Math.random()<.72?n.isRemote?(this.net.send({t:"e",k:"rhurt",v:11}),this.spawnSpark(r,12591136)):this.hitPlayer(10+Math.random()*5,e):this.spawnSpark(r,16765066)}hitPlayer(e,t,n=null){let s=this.player;if(n&&n.isRemote){this.net.send({t:"e",k:"rhurt",v:e});return}if(s.alive){if(s.armor>0){let r=Math.min(s.armor,e*.6);s.armor-=r,e-=r}s.hp-=e,this.ui.hitFlash(),this.sound.hit(),s.hp<=0&&this.die()}}die(){let e=this.player;if(!e.alive)return;e.alive=!1,e.hp=0,this.state="dead",this.sound.error(),this.ui.hitFlash();for(let s=0;s<e.hotbar.length;s++)e.hotbar[s]=null;e.selected=0,e.stars=0,this.calmDown(),this.ui.renderHotbar(e.hotbar,e.selected,s=>this.selectSlot(s)),this.net.send({t:"e",k:"die"}),this.localChar.isDead=!0,this.localChar.root.visible=!1,this.ui.setProgress(null),this.ui.setPrompt(null);let t=Je("div","dead",`
      <div style="font-size:42px">\u2620\uFE0F</div>
      <h2>\u0422\u042B \u041F\u041E\u0413\u0418\u0411</h2>
      <div style="font-size:12px;color:#b9b1a0;line-height:1.5">\u0418\u043D\u0432\u0435\u043D\u0442\u0430\u0440\u044C \u043F\u043E\u0442\u0435\u0440\u044F\u043D. \u0414\u0435\u043D\u044C\u0433\u0438 \u0438 \u0446\u0435\u043D\u043D\u043E\u0441\u0442\u0438 \u043B\u0443\u0447\u0448\u0435 \u0445\u0440\u0430\u043D\u0438\u0442\u044C \u0432 \u0448\u043A\u0430\u0444\u0443 \u0434\u043E\u043C\u0430.<br>\u041E\u0447\u043D\u0451\u0448\u044C\u0441\u044F \u043D\u0430 \u0441\u0432\u043E\u0435\u0439 \u043A\u0440\u043E\u0432\u0430\u0442\u0438 \u0447\u0435\u0440\u0435\u0437 \u043D\u0435\u0441\u043A\u043E\u043B\u044C\u043A\u043E \u0441\u0435\u043A\u0443\u043D\u0434.</div>`),n=Je("button","btn wide","\u041E\u0427\u041D\u0423\u0422\u042C\u0421\u042F \u0421\u0415\u0419\u0427\u0410\u0421");n.onclick=()=>{this.ui.hideModal(),this.respawn()},this.ui.showModal({title:"\u0421\u041C\u0415\u0420\u0422\u042C",sub:"\u0413\u043E\u0440\u043E\u0434 \u0441\u0443\u0440\u043E\u0432\u044B\u0439. \u0412 \u0441\u043B\u0435\u0434\u0443\u044E\u0449\u0438\u0439 \u0440\u0430\u0437 \u043F\u0440\u044F\u0447\u044C\u0441\u044F \u043B\u0443\u0447\u0448\u0435.",body:t,foot:n}),setTimeout(()=>{this.state==="dead"&&(this.ui.hideModal(),this.respawn())},6e3)}respawn(){let e=this.player;e.alive=!0,e.hp=100,e.stamina=100,e.stars=0,e.pos.copy(this.spawnPoint),e.yaw=Math.PI*.7,e.pitch=0,this.localChar.isDead=!1,this.localChar.root.visible=!1,this.ui.setStats({hp:100,stamina:100,stars:0,money:e.money}),this.ui.renderHotbar(e.hotbar,e.selected,t=>this.selectSlot(t)),this.state="play",this.saveGame()}startJob(){let t=this.world.boxSpawns.filter(n=>!n.taken);if(!t.length){this.ui.toast("\u042F\u0449\u0438\u043A\u043E\u0432 \u043D\u0435\u0442 \u2014 \u043F\u0440\u0438\u0445\u043E\u0434\u0438 \u043F\u043E\u0437\u0436\u0435","");return}if(this.job){this.ui.toast("\u0421\u043D\u0430\u0447\u0430\u043B\u0430 \u043E\u0442\u043D\u0435\u0441\u0438 \u044F\u0449\u0438\u043A \u0432 \u0433\u0440\u0443\u0437\u043E\u0432\u0438\u043A","");return}this.job={pay:Math.floor(180+Math.random()*260),left:t.length,total:t.length},this.ui.toast(`\u0420\u0430\u0431\u043E\u0442\u0430: ${this.job.left} \u044F\u0449\u0438\u043A\u043E\u0432 \xB7 $${this.job.pay} \u0437\u0430 \u044F\u0449\u0438\u043A`,"good"),this.ui.setJob(`\u{1F4E6} \u041F\u041E\u0414\u0420\u0410\u0411\u041E\u0422\u041A\u0410 \xB7 \u044F\u0449\u0438\u043A\u043E\u0432: ${this.job.left} \xB7 $${this.job.pay} \u0437\u0430 \u044F\u0449\u0438\u043A`)}takeBox(e){if(!this.job||e.taken)return;e.taken=!0,e.mesh.visible=!1,this.carrying=e,this.ui.setJob(`\u{1F4E6} \u041D\u0435\u0441\u0438 \u044F\u0449\u0438\u043A \u0432 \u0433\u0440\u0443\u0437\u043E\u0432\u0438\u043A \xB7 $${this.job.pay}`),this.ui.toast("\u0412\u0437\u044F\u043B \u044F\u0449\u0438\u043A \u2014 \u0442\u0430\u0449\u0438 \u0432 \u0433\u0440\u0443\u0437\u043E\u0432\u0438\u043A",""),this.sound.pickup();let t=new tt(new pe(.5,.5,.5),new wi({color:9069623,roughness:.9}));t.position.set(.1,-.42,-.62),t.rotation.set(.2,.3,.1),this.viewRoot.add(t),this.carryMesh=t}deliverBox(){if(!this.carrying||!this.job)return;let e=this.carrying;e.taken=!0,e.mesh.visible=!1,e.mesh.position.copy(this.world.truckPoint),this.clearCarry(),this.job.left--;let t=this.job.pay;if(this.player.money+=t,this.stats.jobs++,this.sound.cash(),this.ui.setStats({money:this.player.money}),this.ui.toast(`+$${t} \u0437\u0430 \u044F\u0449\u0438\u043A`,"good"),this.net.send({t:"e",k:"cash"}),this.job.left<=0){let n=Math.floor(t*1.2);this.player.money+=n,this.ui.toast(`\u0420\u0430\u0431\u043E\u0442\u0430 \u0441\u0434\u0435\u043B\u0430\u043D\u0430! \u0411\u043E\u043D\u0443\u0441 +$${n}`,"good"),this.ui.log("\u041F\u043E\u0434\u0440\u0430\u0431\u043E\u0442\u043A\u0430 \u0437\u0430\u043A\u0440\u044B\u0442\u0430. \u0417\u0430\u0433\u043B\u044F\u043D\u0438 \u0432 \u043C\u0430\u0433\u0430\u0437\u0438\u043D \u043E\u0440\u0443\u0436\u0438\u044F."),this.job=null,this.ui.setJob(null),this.ui.setStats({money:this.player.money}),this.world.boxSpawns.forEach(s=>{s.taken=!1,s.mesh.visible=!0})}else this.ui.setJob(`\u{1F4E6} \u041F\u041E\u0414\u0420\u0410\u0411\u041E\u0422\u041A\u0410 \xB7 \u043E\u0441\u0442\u0430\u043B\u043E\u0441\u044C: ${this.job.left} \xB7 $${this.job.pay}`);this.saveGame()}clearCarry(){this.carryMesh&&(this.viewRoot.remove(this.carryMesh),this.carryMesh.geometry.dispose(),this.carryMesh.material.dispose(),this.carryMesh=null),this.carrying=null}updateJobs(e){this.pendingOffer&&Ct(this.pendingOffer.pos,this.player.pos)>14&&(this.pendingOffer=null)}updateOffers(e){var o;if((o=this.intro)!=null&&o.active||(this.offersT-=e,this.offersT>0)||(this.offersT=55+Math.random()*55,this.job||this.pendingOffer))return;let t=this.ambientPool.filter(a=>!a.jobOffer&&!a.used);t.length||this.ambientPool.forEach(a=>{a.jobOffer||(a.used=!1)});let n=t[Math.floor(Math.random()*t.length)]||this.ambientPool[0];if(!n)return;n.used=!0;let s=this.player.pos,r=Math.random()*Math.PI*2;n.pos.set(s.x+Math.cos(r)*26,0,s.z+Math.sin(r)*26),this.colliders.resolve(n.pos,.4),Math.abs(n.pos.x)>90&&(n.pos.x*=.5),n.char.root.position.set(n.pos.x,0,n.pos.z),n.char.root.visible=!0,n.inactive=!1,n.jobOffer=!0,n.offerT=45,n.hostile=!1,this.offerPay=220+Math.floor(Math.random()*280),this.npcs.includes(n)||this.npcs.push(n),this.pendingOffer=null,n.say("\u042D\u0439! \u0420\u0430\u0431\u043E\u0442\u0451\u043D\u043A\u0430 \u0435\u0441\u0442\u044C\u2026",5),this.ui.toast("\u041F\u0440\u043E\u0445\u043E\u0436\u0438\u0439 \u0445\u043E\u0447\u0435\u0442 \u043F\u0440\u0435\u0434\u043B\u043E\u0436\u0438\u0442\u044C \u043F\u043E\u0434\u0440\u0430\u0431\u043E\u0442\u043A\u0443",""),this.ambientPool.includes(n)||this.ambientPool.push(n)}acceptOffer(e){e.jobOffer=!1,e.say("\u0422\u0430\u0449\u0438 \u044F\u0449\u0438\u043A\u0438 \u043A \u0433\u0440\u0443\u0437\u043E\u0432\u0438\u043A\u0443, \u0431\u0440\u0430\u0442.",4),this.pendingOffer=null,this.startJob()}visionCheck(e,t,n,s,r){if(Ct(e,n)>r)return!1;let a=Math.atan2(n.x-e.x,n.z-e.z);return!(Math.abs(vs(t,a))>s/2||this.colliders.blocked(e.x,e.z,n.x,n.z))}panicNearby(e){let t=0;for(let n of this.npcs)n.dead||n.role==="cop"||Ct(n.pos,this.player.pos)<e&&t<2&&(n.state="flee",n.fleeT=4,Math.random()<.6&&(n.say("\u0422\u0438\u043A\u0430\u0439! \u0421\u0442\u0432\u043E\u043B!",2),t++))}onNpcKilled(e,t){this.ui.log(e.role==="cop"?"\u0422\u044B \u0443\u0431\u0438\u043B \u043A\u043E\u043F\u0430. \u042D\u0442\u043E 2 \u0437\u0432\u0435\u0437\u0434\u044B.":"\u0422\u0440\u0443\u043F. +1 \u0437\u0432\u0435\u0437\u0434\u0430.")}netTick(e){if(this.lastNet+=e,this.lastNet<.07)return;this.lastNet=0;let t=this.player,n=this.camBob>.012;this.net.send({t:"s",p:[Math.round(t.pos.x*100)/100,Math.round(t.pos.y*100)/100,Math.round(t.pos.z*100)/100],y:Math.round(t.yaw*100)/100,v:n?3:0,w:this.currentWeaponId(),a:this.playerArmed()?1:0,st:t.stars,hp:Math.round(t.hp)})}onPeerOpen(){this.net.send({t:"hello",name:this.profile.name,skin:this.profile.skin,st:this.player.stars}),this.ui.setNet("\u041E\u041D\u041B\u0410\u0419\u041D \xB7 2/2 \u0438\u0433\u0440\u043E\u043A\u0430",!0)}onNet(e){var t,n,s,r;if(!(!e||!e.t))if(e.t==="hello")this._createRemote(e.skin||"gopnik",e.name||"\u0418\u0413\u0420\u041E\u041A 2"),this.net.send({t:"hello",name:this.profile.name,skin:this.profile.skin,st:this.player.stars}),(n=(t=this.net).enableVoice)==null||n.call(t),(r=(s=this.net)._tryCall)==null||r.call(s);else if(e.t==="s"){this.remote||this._createRemote("gopnik","\u0418\u0413\u0420\u041E\u041A 2");let o=this.remote;o.target.set(e.p[0],e.p[1],e.p[2]),o.yaw=e.y,o.speed=e.v,o.aim=!!e.a,o.stars=e.st||0,o.hp=e.hp,o.weapon!==e.w&&(o.weapon=e.w)}else e.t==="e"&&this.onNetEvent(e)}_createRemote(e,t){var r;this.remote&&this.scene.remove(this.remote.char.root);let n=this.world.bedSpots[this.bedIdx===0?1:0],s=new Ri(e);s.root.position.copy(n.pos),s.root.position.y=.6,s.root.rotation.y=n.yaw,(r=this.intro)!=null&&r.active&&s.lieDown(),this.scene.add(s.root),this.remote={char:s,name:t,skin:e,pos:n.pos.clone(),target:n.wakePos.clone(),yaw:n.yaw,speed:0,weapon:"fists",aim:!1,stars:0,hp:100},this.ui.toast(`${t} \u0432 \u043A\u043E\u043C\u043D\u0430\u0442\u0435`,"good"),this.ui.setNet("\u041E\u041D\u041B\u0410\u0419\u041D \xB7 2/2 \u0438\u0433\u0440\u043E\u043A\u0430",!0)}onNetEvent(e){switch(e.k){case"shot":{if(this.sound.shot(e.v==="shotgun"?"shotgun":e.v==="rifle"?"rifle":"pistol"),this.remote){let t=new A(this.remote.pos.x,1.4,this.remote.pos.z),n=new A(Math.sin(this.remote.yaw+Math.PI),0,Math.cos(this.remote.yaw+Math.PI));this.tracer(t,t.clone().add(n.multiplyScalar(18)))}break}case"door":this.world.houseDoor.open=!!e.v,this.sound.door();break;case"alarm":this.alarmOn=!0,this.world.alarmOn=!0,this.sound.siren(!0),this.spawnPolice(2),this.ui.toast("\u041D\u0430\u043F\u0430\u0440\u043D\u0438\u043A \u043F\u043E\u0434\u043D\u044F\u043B \u0442\u0440\u0435\u0432\u043E\u0433\u0443!","bad");break;case"stars":this.remoteStars=e.v;break;case"money":this.world.bankMoney.forEach(t=>{t.taken=!0,t.mesh.visible=!1}),this.moneyRespawnT=210;break;case"rhurt":this.player.alive&&this.hitPlayer(e.v,null);break;case"die":this.remote&&(this.remote.char.isDead=!0,this.ui.log("\u041D\u0430\u043F\u0430\u0440\u043D\u0438\u043A \u043F\u043E\u0433\u0438\u0431"));break;case"cash":this.sound.cash();break;case"respawn":this.remote&&(this.remote.char.isDead=!1);break}}selectSlot(e){let t=this.player;e<0||e>=Ss||(t.selected=e,this.ui.renderHotbar(t.hotbar,t.selected,n=>this.selectSlot(n)),this._updateViewModel(),e>0&&t.hotbar[e]&&t.hotbar[e].t==="weapon"&&this.playerArmed()&&(this.inBank(t.pos)&&this.ui.log("\u041D\u0435 \u043F\u043E\u043A\u0430\u0437\u044B\u0432\u0430\u0439 \u0441\u0442\u0432\u043E\u043B \u0432 \u0431\u0430\u043D\u043A\u0435!"),this.panicNearby(9)))}_updateViewModel(){if(!this.viewRoot)return;let e=this.currentWeaponId();if(e!==this.viewWeaponId){for(this.viewWeaponId=e;this.viewRoot.children.length;){let t=this.viewRoot.children[0];if(t===this.carryMesh){this.viewRoot.remove(t);continue}this.viewRoot.remove(t)}if(e==="fists"){let t=new tt(new ps(.055,.1,3,7),new wi({color:15119500,roughness:.7}));t.position.set(.02,-.05,.05),t.rotation.x=1.2,this.viewRoot.add(t)}else{let t=Pi(e);t.scale.setScalar(1.15),t.rotation.set(0,Math.PI*.5,0),t.position.set(.06,-.02,.16),this.viewRoot.add(t)}this.carryMesh&&this.viewRoot.add(this.carryMesh)}}openShop(e="weapons"){this.ui.showModal({title:"\u041E\u0420\u0423\u0416\u0415\u0419\u041D\u042B\u0419 \u041C\u0410\u0413\u0410\u0417\u0418\u041D",sub:"\xAB\u0412\u0441\u0451 \u0434\u043B\u044F \u0441\u0435\u0440\u044C\u0451\u0437\u043D\u044B\u0445 \u043B\u044E\u0434\u0435\u0439\xBB \xB7 \u043F\u0440\u043E\u0434\u0430\u0432\u0435\u0446 \u0441\u043C\u043E\u0442\u0440\u0438\u0442 \u043D\u0430 \u0442\u0435\u0431\u044F \u043A\u0430\u043A \u043D\u0430 \u0441\u0442\u0430\u0440\u043E\u0433\u043E \u043A\u043B\u0438\u0435\u043D\u0442\u0430",body:this.buildShop(e),foot:[this._closeBtn("\u0417\u0410\u041A\u0420\u042B\u0422\u042C")]})}buildShop(e){let t=Je("div"),n=Je("div","tabs"),s=(u,d)=>{let f=Je("div","tab"+(e===u?" on":""),d);f.onclick=()=>{this.openShop(u)},n.appendChild(f)};s("weapons","\u041E\u0420\u0423\u0416\u0418\u0415"),s("ammo","\u041F\u0410\u0422\u0420\u041E\u041D\u042B"),s("gear","\u0421\u041D\u0410\u0420\u042F\u0416\u0415\u041D\u0418\u0415"),t.appendChild(n);let r=Je("div","preview3d"),o=this._previewCanvas();r.appendChild(o),t.appendChild(r);let a=this,c=u=>{a._previewShow(u)},l=Je("div","shopgrid"),h=this.player;if(e==="weapons")["pistol","shotgun","rifle","knife","baton"].forEach(u=>{let d=qt[u],f=Je("div","itemcard");f.innerHTML=`<div class="nm">${d.icon} ${d.name}</div><div class="ds">${d.desc}</div>
          <div class="buyrow"><div class="pr">$${d.price}</div><button class="buysmall">\u041A\u0423\u041F\u0418\u0422\u042C</button></div>`,f.onmouseenter=()=>c(u),f.onclick=()=>c(u),f.querySelector("button").onclick=g=>{g.stopPropagation(),this.buyWeapon(u)},l.appendChild(f)});else if(e==="ammo")Object.keys(ia).forEach(u=>{let d=ia[u],f=h.ammo[u]||0,g=Je("div","itemcard");g.innerHTML=`<div class="nm">\u{1F4E6} \u041F\u0430\u0442\u0440\u043E\u043D\u044B ${u} \xD730</div>
          <div class="ds">\u0417\u0430\u043F\u0430\u0441: <b style="color:#ffd88a">${f}</b> \u0448\u0442. \u0414\u0435\u0448\u0451\u0432\u044B\u0435 \u2014 \u043D\u0435 \u0436\u0430\u043B\u0435\u0439.</div>
          <div class="buyrow"><div class="pr">$${d*3}</div><button class="buysmall">\u041A\u0423\u041F\u0418\u0422\u042C 30</button></div>`,g.querySelector("button").onclick=()=>this.buyAmmo(u),l.appendChild(g)});else{let u=Je("div","itemcard");u.innerHTML=`<div class="nm">\u{1F392} \u0421\u0443\u043C\u043A\u0430 \u0434\u043B\u044F \u0434\u0435\u043D\u0435\u0433</div>
        <div class="ds">\u0412\u043C\u0435\u0449\u0430\u0435\u0442 \u043A\u0443\u0447\u0443 \u043D\u0430\u043B\u0438\u0447\u043A\u0438. \u041D\u0430\u0434\u0435\u0432\u0430\u0435\u0448\u044C \u0432 \u0440\u0443\u043A\u0438 \u2014 \u0432 \u0431\u0430\u043D\u043A\u0435 \u0441\u043E\u0431\u0438\u0440\u0430\u0435\u0448\u044C 30 \u0441\u0435\u043A \u0432\u043C\u0435\u0441\u0442\u043E 15, \u0437\u0430\u0442\u043E \u0441\u0443\u043C\u043C\u0430 \u0432 \u0440\u0430\u0437\u044B \u0431\u043E\u043B\u044C\u0448\u0435.</div>
        <div class="buyrow"><div class="pr">$450</div><button class="buysmall">\u041A\u0423\u041F\u0418\u0422\u042C</button></div>`,u.onmouseenter=()=>c("bag"),u.querySelector("button").onclick=()=>this.buyBag(),l.appendChild(u);let d=Je("div","itemcard");d.innerHTML=`<div class="nm">\u{1F9BA} \u0411\u0440\u043E\u043D\u0435\u0436\u0438\u043B\u0435\u0442</div><div class="ds">\u0413\u0430\u0441\u0438\u0442 60% \u0443\u0440\u043E\u043D\u0430, \u043F\u043E\u043A\u0430 \u043D\u0435 \u0440\u0430\u0437\u043E\u0431\u044C\u044E\u0442. \u041F\u043E\u043B\u0438\u0446\u0438\u044F \u043E\u0446\u0435\u043D\u0438\u0442.</div>
        <div class="buyrow"><div class="pr">$600</div><button class="buysmall">\u041A\u0423\u041F\u0418\u0422\u042C</button></div>`,d.querySelector("button").onclick=()=>this.buyArmor(),l.appendChild(d)}return t.appendChild(l),t.appendChild(Je("div","hintrow",`\u0422\u0432\u043E\u0439 \u0431\u0430\u043B\u0430\u043D\u0441: <b style="color:#8ee08a">$${this.player.money.toLocaleString("ru-RU")}</b> \xB7 \u041A\u0443\u043F\u043B\u0435\u043D\u043D\u043E\u0435 \u043F\u0430\u0434\u0430\u0435\u0442 \u0432 \u0438\u043D\u0432\u0435\u043D\u0442\u0430\u0440\u044C (\u043D\u0438\u0437 \u044D\u043A\u0440\u0430\u043D\u0430)`)),c(e==="gear"?"bag":"pistol"),t}buyWeapon(e){let t=qt[e],n=this.player;if(n.money<t.price){this.ui.toast("\u041D\u0435 \u0445\u0432\u0430\u0442\u0430\u0435\u0442 \u0434\u0435\u043D\u0435\u0433","bad"),this.sound.error();return}let s=Mf(e);if(!pr(n.hotbar,s)){this.ui.toast("\u0418\u043D\u0432\u0435\u043D\u0442\u0430\u0440\u044C \u043F\u043E\u043B\u043E\u043D \u2014 \u043E\u0441\u0432\u043E\u0431\u043E\u0434\u0438 \u044F\u0447\u0435\u0439\u043A\u0443","bad");return}n.money-=t.price,this.sound.cash(),this.ui.toast(`\u041A\u0443\u043F\u043B\u0435\u043D\u043E: ${t.name}`,"good"),this.ui.setStats({money:n.money}),this.ui.renderHotbar(n.hotbar,n.selected,r=>this.selectSlot(r)),this.openShop("weapons"),this.saveGame()}buyAmmo(e){let t=this.player,n=ia[e]*3;if(t.money<n){this.ui.toast("\u041D\u0435 \u0445\u0432\u0430\u0442\u0430\u0435\u0442 \u0434\u0435\u043D\u0435\u0433","bad"),this.sound.error();return}t.money-=n,t.ammo[e]=(t.ammo[e]||0)+30,this.sound.cash(),this.ui.toast(`+30 \u043F\u0430\u0442\u0440\u043E\u043D\u043E\u0432 ${e} (\u0432\u0441\u0435\u0433\u043E ${t.ammo[e]})`,"good"),this.ui.setStats({money:t.money}),this.openShop("ammo"),this.saveGame()}buyBag(){let e=this.player;if(e.money<450){this.ui.toast("\u041D\u0435 \u0445\u0432\u0430\u0442\u0430\u0435\u0442 \u0434\u0435\u043D\u0435\u0433","bad"),this.sound.error();return}if(!pr(e.hotbar,lh("bag"))){this.ui.toast("\u0418\u043D\u0432\u0435\u043D\u0442\u0430\u0440\u044C \u043F\u043E\u043B\u043E\u043D","bad");return}e.money-=450,this.sound.cash(),this.ui.toast("\u0421\u0443\u043C\u043A\u0430 \u043A\u0443\u043F\u043B\u0435\u043D\u0430 \xB7 \u0432\u044B\u0431\u0435\u0440\u0438 \u0435\u0451 \u0432 \u0441\u043B\u043E\u0442\u0430\u0445","good"),this.ui.setStats({money:e.money}),this.ui.renderHotbar(e.hotbar,e.selected,t=>this.selectSlot(t)),this.openShop("gear"),this.saveGame()}buyArmor(){let e=this.player;if(e.money<600){this.ui.toast("\u041D\u0435 \u0445\u0432\u0430\u0442\u0430\u0435\u0442 \u0434\u0435\u043D\u0435\u0433","bad");return}e.money-=600,e.armor=100,this.sound.cash(),this.ui.toast("\u0411\u0440\u043E\u043D\u0435\u0436\u0438\u043B\u0435\u0442 \u043D\u0430\u0434\u0435\u0442","good"),this.ui.setStats({money:e.money}),this.openShop("gear"),this.saveGame()}_previewCanvas(){return this._previewInit().canvas}_previewInit(){if(this.pv)return this.pv;let e=document.createElement("canvas");e.width=560,e.height=240;let t=new Qs({canvas:e,antialias:!0,alpha:!0});t.setPixelRatio(1),t.setSize(560,240,!1);let n=new er,s=new Ot(36,560/240,.05,30);s.position.set(.85,.5,.95),s.lookAt(0,.03,0),n.add(new lr(16777215,4210768,2.6));let r=new _s(16769720,2.6);r.position.set(2,3,2),n.add(r);let o=new _s(8956671,1.2);return o.position.set(-2,1,-2),n.add(o),this.pv={r:t,sc:n,cam:s,model:null,canvas:e},this.pv}_previewShow(e){let t=this._previewInit();t.model&&t.sc.remove(t.model);let n=Pi(e),r=new Mn().setFromObject(n).getSize(new A).length();n.scale.setScalar(1.6/Math.max(.4,r)),n.position.set(0,.05,0),t.sc.add(n),t.model=n,t.spin=0}renderPreview(e){let t=this.pv;!t||!t.canvas.isConnected||(t.spin+=e*.6,t.model&&(t.model.rotation.y=t.spin*.5+.6),t.r.setSize(t.canvas.clientWidth||560,t.canvas.clientHeight||240,!1),t.r.render(t.sc,t.cam))}openLocker(e){let t=this.lockers[e],n=(c,l)=>{let h=Je("div","tab"+(e===l?" on":""),c);return h.onclick=()=>this.openLocker(l),h},s=Je("div"),r=Je("div","tabs");r.appendChild(n("\u0428\u0410\u0424 1","lockerA")),r.appendChild(n("\u0428\u0410\u0424 2","lockerB")),s.appendChild(r),s.appendChild(Je("div","hintrow","\u041D\u0430\u0436\u043C\u0438 \u043D\u0430 \u0432\u0435\u0449\u044C \u0432 \u0448\u043A\u0430\u0444\u0443 \u2014 \u0437\u0430\u0431\u0440\u0430\u0442\u044C. \u041D\u0430\u0436\u043C\u0438 \u043D\u0430 \u0432\u0435\u0449\u044C \u0432 \u0438\u043D\u0432\u0435\u043D\u0442\u0430\u0440\u0435 \u2014 \u043F\u043E\u043B\u043E\u0436\u0438\u0442\u044C. \u0412\u0441\u0451 \u0441\u043E\u0445\u0440\u0430\u043D\u044F\u0435\u0442\u0441\u044F."));let o=Je("div","grid15");for(let c=0;c<li;c++){let l=t[c],h=Je("div","gslot",l?Ii(l):"");l&&(l.t==="money"&&(h.innerHTML+=`<span class="qty">\xD7${l.qty}</span>`),l.t==="weapon"&&(h.innerHTML+=`<span class="qty">${l.mag}</span>`),h.title=Es(l),h.onclick=()=>{pr(this.player.hotbar,l)?(t[c]=null,this.ui.toast(`\u0412\u0437\u044F\u043B: ${Es(l)}`,"good"),this.ui.renderHotbar(this.player.hotbar,this.player.selected,u=>this.selectSlot(u)),this.openLocker(e),this.saveGame()):this.ui.toast("\u0420\u0443\u043A\u0438 \u0437\u0430\u043D\u044F\u0442\u044B \u2014 \u043E\u0441\u0432\u043E\u0431\u043E\u0434\u0438 \u044F\u0447\u0435\u0439\u043A\u0443","bad")}),o.appendChild(h)}s.appendChild(Je("div","hintrow","\u042F\u0447\u0435\u0439\u043A\u0438 \u0448\u043A\u0430\u0444\u0430:")),s.appendChild(o),s.appendChild(Je("div","hintrow","<b>\u0422\u0432\u043E\u0439 \u0438\u043D\u0432\u0435\u043D\u0442\u0430\u0440\u044C:</b>"));let a=Je("div","grid15");for(let c=0;c<Ss;c++){let l=c===0?null:this.player.hotbar[c],h=Je("div","gslot",l?Ii(l):c===0?"\u{1F44A}":"");l&&(h.title=Es(l),h.onclick=()=>{let u=t.findIndex(d=>!d);if(u<0){this.ui.toast("\u0428\u043A\u0430\u0444 \u043F\u043E\u043B\u043E\u043D","bad");return}t[u]=l,this.player.hotbar[c]=null,this.ui.toast(`\u041F\u043E\u043B\u043E\u0436\u0438\u043B: ${Es(l)}`,"good"),this.ui.renderHotbar(this.player.hotbar,this.player.selected,d=>this.selectSlot(d)),this.openLocker(e),this.saveGame()}),a.appendChild(h)}s.appendChild(a),this.ui.showModal({title:"\u0428\u041A\u0410\u0424",sub:"\u0417\u0434\u0435\u0441\u044C \u0432\u0435\u0449\u0438 \u043F\u0435\u0440\u0435\u0436\u0438\u0432\u0443\u0442 \u0442\u0432\u043E\u044E \u0441\u043C\u0435\u0440\u0442\u044C. 15 \u044F\u0447\u0435\u0435\u043A.",body:s,foot:[this._closeBtn("\u0417\u0410\u041A\u0420\u042B\u0422\u042C")]})}openInventory(){let e=this.player,t=Je("div"),n=Je("div","grid15");for(let o=0;o<Ss;o++){let a=o===0?null:e.hotbar[o],c=Je("div","gslot"+(e.selected===o?" sel":""),o===0?"\u{1F44A}":a?Ii(a):"");c.onclick=()=>{e.selected=o,this.selectSlot(o),this.openInventory()},a&&(a.t==="money"&&(c.innerHTML+=`<span class="qty">\xD7${a.qty}</span>`),a.t==="weapon"&&(c.innerHTML+=`<span class="qty">${a.mag}</span>`)),n.appendChild(c)}t.appendChild(Je("div","hintrow","\u0421\u043B\u043E\u0442\u044B \u0432 \u0440\u0443\u043A\u0430\u0445 (\u043D\u0438\u0437 \u044D\u043A\u0440\u0430\u043D\u0430). \u041A\u0443\u043B\u0430\u043A \u0432\u0441\u0435\u0433\u0434\u0430 \u043F\u0435\u0440\u0432\u044B\u0439.")),t.appendChild(n);let s=e.selected===0?null:e.hotbar[e.selected],r=Je("div","itemcard");if(r.style.marginTop="10px",r.innerHTML=`<div class="nm">${Ii(s)} ${Es(s)}</div>
      <div class="ds">${bf(s)}</div>`,s&&s.t==="money"){let o=Je("button","buysmall","\u041F\u0415\u0420\u0415\u0412\u0415\u0421\u0422\u0418 \u0412 \u0411\u0410\u041B\u0410\u041D\u0421");o.onclick=()=>this.convertMoney(s),r.appendChild(o)}if(s&&s.t==="bag"){let o=Je("button","buysmall",`\u041E\u0422\u041A\u0420\u042B\u0422\u042C \u0421\u0423\u041C\u041A\u0423 ($${s.cash||0})`);o.onclick=()=>this.openBag(s),r.appendChild(o)}if(s&&s.t==="weapon"){let o=qt[s.id];r.appendChild(Je("div","hintrow",`\u0412 \u043C\u0430\u0433\u0430\u0437\u0438\u043D\u0435: ${s.mag}/${o.mag} \xB7 \u0437\u0430\u043F\u0430\u0441: ${e.ammo[o.ammo]||0} \u043F\u0430\u0442\u0440\u043E\u043D\u043E\u0432 ${o.ammo}`))}t.appendChild(r),t.appendChild(Je("div","hintrow",`\u0411\u0430\u043B\u0430\u043D\u0441: <b style="color:#8ee08a">$${e.money.toLocaleString("ru-RU")}</b>`)),this.ui.showModal({title:"\u0418\u041D\u0412\u0415\u041D\u0422\u0410\u0420\u042C",sub:"\u041F\u0435\u0440\u0435\u0437\u0430\u0440\u044F\u0434\u043A\u0430, \u0434\u0435\u043D\u044C\u0433\u0438 \u0438 \u0432\u0441\u0451, \u0447\u0442\u043E \u043D\u0430\u0436\u0438\u043B",body:t,foot:[this._closeBtn("\u0417\u0410\u041A\u0420\u042B\u0422\u042C")]})}convertMoney(e){let t=this.player,n=0;for(let r=0;r<e.qty;r++)n+=Sf();t.money+=n,e.qty=0;let s=t.hotbar.indexOf(e);s>0&&(t.hotbar[s]=null),t.selected=0,this.sound.cash(),this.ui.toast(`\u041F\u0435\u0440\u0435\u0432\u0435\u0434\u0435\u043D\u043E +$${n.toLocaleString("ru-RU")}`,"good"),this.ui.setStats({money:t.money}),this.ui.renderHotbar(t.hotbar,t.selected,r=>this.selectSlot(r)),this._updateViewModel(),this.saveGame(),this.ui.hideModal()}openBag(e){let t=this.player,n=Je("div");n.appendChild(Je("div","moneybig",`$${(e.cash||0).toLocaleString("ru-RU")}`)),n.appendChild(Je("div","hintrow","\u0421\u043A\u043E\u043B\u044C\u043A\u043E \u0432\u044B\u0432\u0435\u0441\u0442\u0438 \u043D\u0430 \u0431\u0430\u043B\u0430\u043D\u0441? \u041E\u0441\u0442\u0430\u043B\u044C\u043D\u043E\u0435 \u043E\u0441\u0442\u0430\u043D\u0435\u0442\u0441\u044F \u0432 \u0441\u0443\u043C\u043A\u0435."));let s=document.createElement("input");s.type="range",s.min=0,s.max=Math.max(0,e.cash||0),s.value=Math.floor((e.cash||0)/2);let r=Je("div","kv",`<span>\u041A \u0432\u044B\u0432\u043E\u0434\u0443</span><b>$${Number(s.value).toLocaleString("ru-RU")}</b>`);s.oninput=()=>{r.innerHTML=`<span>\u041A \u0432\u044B\u0432\u043E\u0434\u0443</span><b>$${Number(s.value).toLocaleString("ru-RU")}</b>`},n.appendChild(s),n.appendChild(r);let o=Je("button","btn","\u0412\u0421\u0415");o.onclick=()=>{s.value=e.cash||0,s.oninput()};let a=Je("button","btn","\u041F\u0415\u0420\u0415\u0412\u0415\u0421\u0422\u0418");a.onclick=()=>{let l=Pt(Number(s.value)||0,0,e.cash||0);e.cash=(e.cash||0)-l,t.money+=l,this.sound.cash(),this.ui.toast(`\u0412\u044B\u0432\u0435\u0434\u0435\u043D\u043E +$${l.toLocaleString("ru-RU")}`,"good"),this.ui.setStats({money:t.money}),this.saveGame(),this.openBag(e)};let c=Je("div","btn-row");c.appendChild(o),c.appendChild(a),n.appendChild(c),this.ui.showModal({title:"\u0421\u0423\u041C\u041A\u0410",sub:"\u041D\u0430\u043B\u0438\u0447\u043A\u0430 \u0438\u0437 \u0431\u0430\u043D\u043A\u0430",body:n,foot:[this._closeBtn("\u0417\u0410\u041A\u0420\u042B\u0422\u042C")]})}_closeBtn(e){let t=Je("button","btn",e);return t.onclick=()=>{this.ui.hideModal(),this.sound.ui()},t}openPause(){var e;this.pauseOpen=!0,this.ui.showPause(),(e=document.exitPointerLock)==null||e.call(document)}saveGame(){if(!this.player||this.state==="menu"||this.state==="boot")return;let e=this.player,t=uh();t.money=Math.round(e.money),t.hotbar=JSON.parse(JSON.stringify(e.hotbar)),t.ammo={...e.ammo},t.lockers=JSON.parse(JSON.stringify(this.lockers||{})),t.hp=Math.round(e.hp),t.pos=[Math.round(e.pos.x*10)/10,Math.round(e.pos.z*10)/10],t.stars=e.stars,t.stats=this.stats,wf(t)}exitToMenu(){this.saveGame(),this.sound.siren(!1),this.state="menu",this.ui.hideModal(),this.ui.hidePause(),this.pauseOpen=!1,this.ui.showMenu();try{this.net.hangup()}catch{}location.reload()}};var dh=class{constructor(){this.encoder=new TextEncoder,this._pieces=[],this._parts=[]}append_buffer(e){this.flush(),this._parts.push(e)}append(e){this._pieces.push(e)}flush(){if(this._pieces.length>0){let e=new Uint8Array(this._pieces);this._parts.push(e),this._pieces=[]}}toArrayBuffer(){let e=[];for(let t of this._parts)e.push(t);return Zx(e).buffer}};function Zx(i){let e=0;for(let s of i)e+=s.byteLength;let t=new Uint8Array(e),n=0;for(let s of i){let r=new Uint8Array(s.buffer,s.byteOffset,s.byteLength);t.set(r,n),n+=s.byteLength}return t}function mh(i){return new fh(i).unpack()}function gh(i){let e=new ph,t=e.pack(i);return t instanceof Promise?t.then(()=>e.getBuffer()):e.getBuffer()}var fh=class{constructor(e){this.index=0,this.dataBuffer=e,this.dataView=new Uint8Array(this.dataBuffer),this.length=this.dataBuffer.byteLength}unpack(){let e=this.unpack_uint8();if(e<128)return e;if((e^224)<32)return(e^224)-32;let t;if((t=e^160)<=15)return this.unpack_raw(t);if((t=e^176)<=15)return this.unpack_string(t);if((t=e^144)<=15)return this.unpack_array(t);if((t=e^128)<=15)return this.unpack_map(t);switch(e){case 192:return null;case 193:return;case 194:return!1;case 195:return!0;case 202:return this.unpack_float();case 203:return this.unpack_double();case 204:return this.unpack_uint8();case 205:return this.unpack_uint16();case 206:return this.unpack_uint32();case 207:return this.unpack_uint64();case 208:return this.unpack_int8();case 209:return this.unpack_int16();case 210:return this.unpack_int32();case 211:return this.unpack_int64();case 212:return;case 213:return;case 214:return;case 215:return;case 216:return t=this.unpack_uint16(),this.unpack_string(t);case 217:return t=this.unpack_uint32(),this.unpack_string(t);case 218:return t=this.unpack_uint16(),this.unpack_raw(t);case 219:return t=this.unpack_uint32(),this.unpack_raw(t);case 220:return t=this.unpack_uint16(),this.unpack_array(t);case 221:return t=this.unpack_uint32(),this.unpack_array(t);case 222:return t=this.unpack_uint16(),this.unpack_map(t);case 223:return t=this.unpack_uint32(),this.unpack_map(t)}}unpack_uint8(){let e=this.dataView[this.index]&255;return this.index++,e}unpack_uint16(){let e=this.read(2),t=(e[0]&255)*256+(e[1]&255);return this.index+=2,t}unpack_uint32(){let e=this.read(4),t=((e[0]*256+e[1])*256+e[2])*256+e[3];return this.index+=4,t}unpack_uint64(){let e=this.read(8),t=((((((e[0]*256+e[1])*256+e[2])*256+e[3])*256+e[4])*256+e[5])*256+e[6])*256+e[7];return this.index+=8,t}unpack_int8(){let e=this.unpack_uint8();return e<128?e:e-256}unpack_int16(){let e=this.unpack_uint16();return e<32768?e:e-65536}unpack_int32(){let e=this.unpack_uint32();return e<2**31?e:e-2**32}unpack_int64(){let e=this.unpack_uint64();return e<2**63?e:e-2**64}unpack_raw(e){if(this.length<this.index+e)throw new Error(`BinaryPackFailure: index is out of range ${this.index} ${e} ${this.length}`);let t=this.dataBuffer.slice(this.index,this.index+e);return this.index+=e,t}unpack_string(e){let t=this.read(e),n=0,s="",r,o;for(;n<e;)r=t[n],r<160?(o=r,n++):(r^192)<32?(o=(r&31)<<6|t[n+1]&63,n+=2):(r^224)<16?(o=(r&15)<<12|(t[n+1]&63)<<6|t[n+2]&63,n+=3):(o=(r&7)<<18|(t[n+1]&63)<<12|(t[n+2]&63)<<6|t[n+3]&63,n+=4),s+=String.fromCodePoint(o);return this.index+=e,s}unpack_array(e){let t=new Array(e);for(let n=0;n<e;n++)t[n]=this.unpack();return t}unpack_map(e){let t={};for(let n=0;n<e;n++){let s=this.unpack();t[s]=this.unpack()}return t}unpack_float(){let e=this.unpack_uint32(),t=e>>31,n=(e>>23&255)-127,s=e&8388607|8388608;return(t===0?1:-1)*s*2**(n-23)}unpack_double(){let e=this.unpack_uint32(),t=this.unpack_uint32(),n=e>>31,s=(e>>20&2047)-1023,o=(e&1048575|1048576)*2**(s-20)+t*2**(s-52);return(n===0?1:-1)*o}read(e){let t=this.index;if(t+e<=this.length)return this.dataView.subarray(t,t+e);throw new Error("BinaryPackFailure: read index out of range")}},ph=class{getBuffer(){return this._bufferBuilder.toArrayBuffer()}pack(e){if(typeof e=="string")this.pack_string(e);else if(typeof e=="number")Math.floor(e)===e?this.pack_integer(e):this.pack_double(e);else if(typeof e=="boolean")e===!0?this._bufferBuilder.append(195):e===!1&&this._bufferBuilder.append(194);else if(e===void 0)this._bufferBuilder.append(192);else if(typeof e=="object")if(e===null)this._bufferBuilder.append(192);else{let t=e.constructor;if(e instanceof Array){let n=this.pack_array(e);if(n instanceof Promise)return n.then(()=>this._bufferBuilder.flush())}else if(e instanceof ArrayBuffer)this.pack_bin(new Uint8Array(e));else if("BYTES_PER_ELEMENT"in e){let n=e;this.pack_bin(new Uint8Array(n.buffer,n.byteOffset,n.byteLength))}else if(e instanceof Date)this.pack_string(e.toString());else{if(e instanceof Blob)return e.arrayBuffer().then(n=>{this.pack_bin(new Uint8Array(n)),this._bufferBuilder.flush()});if(t==Object||t.toString().startsWith("class")){let n=this.pack_object(e);if(n instanceof Promise)return n.then(()=>this._bufferBuilder.flush())}else throw new Error(`Type "${t.toString()}" not yet supported`)}}else throw new Error(`Type "${typeof e}" not yet supported`);this._bufferBuilder.flush()}pack_bin(e){let t=e.length;if(t<=15)this.pack_uint8(160+t);else if(t<=65535)this._bufferBuilder.append(218),this.pack_uint16(t);else if(t<=4294967295)this._bufferBuilder.append(219),this.pack_uint32(t);else throw new Error("Invalid length");this._bufferBuilder.append_buffer(e)}pack_string(e){let t=this._textEncoder.encode(e),n=t.length;if(n<=15)this.pack_uint8(176+n);else if(n<=65535)this._bufferBuilder.append(216),this.pack_uint16(n);else if(n<=4294967295)this._bufferBuilder.append(217),this.pack_uint32(n);else throw new Error("Invalid length");this._bufferBuilder.append_buffer(t)}pack_array(e){let t=e.length;if(t<=15)this.pack_uint8(144+t);else if(t<=65535)this._bufferBuilder.append(220),this.pack_uint16(t);else if(t<=4294967295)this._bufferBuilder.append(221),this.pack_uint32(t);else throw new Error("Invalid length");let n=s=>{if(s<t){let r=this.pack(e[s]);return r instanceof Promise?r.then(()=>n(s+1)):n(s+1)}};return n(0)}pack_integer(e){if(e>=-32&&e<=127)this._bufferBuilder.append(e&255);else if(e>=0&&e<=255)this._bufferBuilder.append(204),this.pack_uint8(e);else if(e>=-128&&e<=127)this._bufferBuilder.append(208),this.pack_int8(e);else if(e>=0&&e<=65535)this._bufferBuilder.append(205),this.pack_uint16(e);else if(e>=-32768&&e<=32767)this._bufferBuilder.append(209),this.pack_int16(e);else if(e>=0&&e<=4294967295)this._bufferBuilder.append(206),this.pack_uint32(e);else if(e>=-2147483648&&e<=2147483647)this._bufferBuilder.append(210),this.pack_int32(e);else if(e>=-9223372036854776e3&&e<=9223372036854776e3)this._bufferBuilder.append(211),this.pack_int64(e);else if(e>=0&&e<=18446744073709552e3)this._bufferBuilder.append(207),this.pack_uint64(e);else throw new Error("Invalid integer")}pack_double(e){let t=0;e<0&&(t=1,e=-e);let n=Math.floor(Math.log(e)/Math.LN2),s=e/2**n-1,r=Math.floor(s*2**52),o=2**32,a=t<<31|n+1023<<20|r/o&1048575,c=r%o;this._bufferBuilder.append(203),this.pack_int32(a),this.pack_int32(c)}pack_object(e){let t=Object.keys(e),n=t.length;if(n<=15)this.pack_uint8(128+n);else if(n<=65535)this._bufferBuilder.append(222),this.pack_uint16(n);else if(n<=4294967295)this._bufferBuilder.append(223),this.pack_uint32(n);else throw new Error("Invalid length");let s=r=>{if(r<t.length){let o=t[r];if(e.hasOwnProperty(o)){this.pack(o);let a=this.pack(e[o]);if(a instanceof Promise)return a.then(()=>s(r+1))}return s(r+1)}};return s(0)}pack_uint8(e){this._bufferBuilder.append(e)}pack_uint16(e){this._bufferBuilder.append(e>>8),this._bufferBuilder.append(e&255)}pack_uint32(e){let t=e&4294967295;this._bufferBuilder.append((t&4278190080)>>>24),this._bufferBuilder.append((t&16711680)>>>16),this._bufferBuilder.append((t&65280)>>>8),this._bufferBuilder.append(t&255)}pack_uint64(e){let t=e/4294967296,n=e%2**32;this._bufferBuilder.append((t&4278190080)>>>24),this._bufferBuilder.append((t&16711680)>>>16),this._bufferBuilder.append((t&65280)>>>8),this._bufferBuilder.append(t&255),this._bufferBuilder.append((n&4278190080)>>>24),this._bufferBuilder.append((n&16711680)>>>16),this._bufferBuilder.append((n&65280)>>>8),this._bufferBuilder.append(n&255)}pack_int8(e){this._bufferBuilder.append(e&255)}pack_int16(e){this._bufferBuilder.append((e&65280)>>8),this._bufferBuilder.append(e&255)}pack_int32(e){this._bufferBuilder.append(e>>>24&255),this._bufferBuilder.append((e&16711680)>>>16),this._bufferBuilder.append((e&65280)>>>8),this._bufferBuilder.append(e&255)}pack_int64(e){let t=Math.floor(e/4294967296),n=e%2**32;this._bufferBuilder.append((t&4278190080)>>>24),this._bufferBuilder.append((t&16711680)>>>16),this._bufferBuilder.append((t&65280)>>>8),this._bufferBuilder.append(t&255),this._bufferBuilder.append((n&4278190080)>>>24),this._bufferBuilder.append((n&16711680)>>>16),this._bufferBuilder.append((n&65280)>>>8),this._bufferBuilder.append(n&255)}constructor(){this._bufferBuilder=new dh,this._textEncoder=new TextEncoder}};var Af=!0,Rf=!0;function Cs(i,e,t){let n=i.match(e);return n&&n.length>=t&&parseFloat(n[t],10)}function An(i,e,t){if(!i.RTCPeerConnection)return;if(!Object.getOwnPropertyDescriptor(EventTarget.prototype,"addEventListener").writable){mr("Unable to polyfill events");return}let s=i.RTCPeerConnection.prototype,r=s.addEventListener;s.addEventListener=function(a,c){if(a!==e)return r.apply(this,arguments);let l=h=>{let u=t(h);u&&(c.handleEvent?c.handleEvent(u):c(u))};return this._eventMap=this._eventMap||{},this._eventMap[e]||(this._eventMap[e]=new Map),this._eventMap[e].set(c,l),r.apply(this,[a,l])};let o=s.removeEventListener;s.removeEventListener=function(a,c){if(a!==e||!this._eventMap||!this._eventMap[e])return o.apply(this,arguments);if(!this._eventMap[e].has(c))return o.apply(this,arguments);let l=this._eventMap[e].get(c);return this._eventMap[e].delete(c),this._eventMap[e].size===0&&delete this._eventMap[e],Object.keys(this._eventMap).length===0&&delete this._eventMap,o.apply(this,[a,l])},Object.defineProperty(s,"on"+e,{get(){return this["_on"+e]},set(a){this["_on"+e]&&(this.removeEventListener(e,this["_on"+e]),delete this["_on"+e]),a&&this.addEventListener(e,this["_on"+e]=a)},enumerable:!0,configurable:!0})}function Pf(i){return typeof i!="boolean"?new Error("Argument type: "+typeof i+". Please use a boolean."):(Af=i,i?"adapter.js logging disabled":"adapter.js logging enabled")}function If(i){return typeof i!="boolean"?new Error("Argument type: "+typeof i+". Please use a boolean."):(Rf=!i,"adapter.js deprecation warnings "+(i?"disabled":"enabled"))}function mr(){if(typeof window=="object"){if(Af)return;typeof console!="undefined"&&typeof console.log=="function"&&console.log.apply(console,arguments)}}function As(i,e){Rf&&console.warn(i+" is deprecated, please use "+e+" instead.")}function Lf(i){let e={browser:null,version:null};if(typeof i=="undefined"||!i.navigator||!i.navigator.userAgent)return e.browser="Not a browser.",e;let{navigator:t}=i;if(t.userAgentData&&t.userAgentData.brands){let n=t.userAgentData.brands.find(s=>s.brand==="Chromium");if(n){let s=parseInt(n.version,10);if(s>=90)return{browser:"chrome",version:s}}}if(t.mozGetUserMedia)e.browser="firefox",e.version=parseInt(Cs(t.userAgent,/Firefox\/(\d+)\./,1));else if(t.webkitGetUserMedia||i.isSecureContext===!1&&i.webkitRTCPeerConnection)e.browser="chrome",e.version=parseInt(Cs(t.userAgent,/Chrom(e|ium)\/(\d+)\./,2))||null;else if(i.RTCPeerConnection&&t.userAgent.match(/AppleWebKit\/(\d+)\./))e.browser="safari",e.version=parseInt(Cs(t.userAgent,/AppleWebKit\/(\d+)\./,1)),e.supportsUnifiedPlan=i.RTCRtpTransceiver&&"currentDirection"in i.RTCRtpTransceiver.prototype,e._safariVersion=Cs(t.userAgent,/Version\/(\d+(\.?\d+))/,1);else return e.browser="Not a supported browser.",e;return e}function Cf(i){return Object.prototype.toString.call(i)==="[object Object]"}function yh(i){return Cf(i)?Object.keys(i).reduce(function(e,t){let n=Cf(i[t]),s=n?yh(i[t]):i[t],r=n&&!Object.keys(s).length;return s===void 0||r?e:Object.assign(e,{[t]:s})},{}):i}function _h(i,e,t){!e||t.has(e.id)||(t.set(e.id,e),Object.keys(e).forEach(n=>{n.endsWith("Id")?_h(i,i.get(e[n]),t):n.endsWith("Ids")&&e[n].forEach(s=>{_h(i,i.get(s),t)})}))}function xh(i,e,t){let n=t?"outbound-rtp":"inbound-rtp",s=new Map;if(e===null)return s;let r=[];return i.forEach(o=>{o.type==="track"&&o.trackIdentifier===e.id&&r.push(o)}),r.forEach(o=>{i.forEach(a=>{a.type===n&&a.trackId===o.id&&_h(i,a,s)})}),s}var pa={};Lr(pa,{fixNegotiationNeeded:()=>Th,shimAddTrackRemoveTrack:()=>Eh,shimAddTrackRemoveTrackWithNative:()=>Uf,shimGetSendersWithDtmf:()=>bh,shimGetUserMedia:()=>da,shimMediaStream:()=>vh,shimOnTrack:()=>Mh,shimPeerConnection:()=>fa,shimSenderReceiverGetStats:()=>Sh});var Df=mr;function da(i,e){if(e.version>=64)return;let t=i&&i.navigator;if(!t.mediaDevices)return;let n=function(a){if(typeof a!="object"||a.mandatory||a.optional)return a;let c={};return Object.keys(a).forEach(l=>{if(l==="require"||l==="advanced"||l==="mediaSource")return;let h=typeof a[l]=="object"?a[l]:{ideal:a[l]};h.exact!==void 0&&typeof h.exact=="number"&&(h.min=h.max=h.exact);let u=function(d,f){return d?d+f.charAt(0).toUpperCase()+f.slice(1):f==="deviceId"?"sourceId":f};if(h.ideal!==void 0){c.optional=c.optional||[];let d={};typeof h.ideal=="number"?(d[u("min",l)]=h.ideal,c.optional.push(d),d={},d[u("max",l)]=h.ideal,c.optional.push(d)):(d[u("",l)]=h.ideal,c.optional.push(d))}h.exact!==void 0&&typeof h.exact!="number"?(c.mandatory=c.mandatory||{},c.mandatory[u("",l)]=h.exact):["min","max"].forEach(d=>{h[d]!==void 0&&(c.mandatory=c.mandatory||{},c.mandatory[u(d,l)]=h[d])})}),a.advanced&&(c.optional=(c.optional||[]).concat(a.advanced)),c},s=function(a,c){if(e.version>=61)return c(a);if(a=JSON.parse(JSON.stringify(a)),a&&typeof a.audio=="object"){let l=function(h,u,d){u in h&&!(d in h)&&(h[d]=h[u],delete h[u])};a=JSON.parse(JSON.stringify(a)),l(a.audio,"autoGainControl","googAutoGainControl"),l(a.audio,"noiseSuppression","googNoiseSuppression"),a.audio=n(a.audio)}if(a&&typeof a.video=="object"){let l=a.video.facingMode;l=l&&(typeof l=="object"?l:{ideal:l});let h=e.version<66;if(l&&(l.exact==="user"||l.exact==="environment"||l.ideal==="user"||l.ideal==="environment")&&!(t.mediaDevices.getSupportedConstraints&&t.mediaDevices.getSupportedConstraints().facingMode&&!h)){delete a.video.facingMode;let u;if(l.exact==="environment"||l.ideal==="environment"?u=["back","rear"]:(l.exact==="user"||l.ideal==="user")&&(u=["front"]),u)return t.mediaDevices.enumerateDevices().then(d=>{d=d.filter(g=>g.kind==="videoinput");let f=d.find(g=>u.some(y=>g.label.toLowerCase().includes(y)));return!f&&d.length&&u.includes("back")&&(f=d[d.length-1]),f&&(a.video.deviceId=l.exact?{exact:f.deviceId}:{ideal:f.deviceId}),a.video=n(a.video),Df("chrome: "+JSON.stringify(a)),c(a)})}a.video=n(a.video)}return Df("chrome: "+JSON.stringify(a)),c(a)},r=function(a){return e.version>=64?a:{name:{PermissionDeniedError:"NotAllowedError",PermissionDismissedError:"NotAllowedError",InvalidStateError:"NotAllowedError",DevicesNotFoundError:"NotFoundError",ConstraintNotSatisfiedError:"OverconstrainedError",TrackStartError:"NotReadableError",MediaDeviceFailedDueToShutdown:"NotAllowedError",MediaDeviceKillSwitchOn:"NotAllowedError",TabCaptureError:"AbortError",ScreenCaptureError:"AbortError",DeviceCaptureError:"AbortError"}[a.name]||a.name,message:a.message,constraint:a.constraint||a.constraintName,toString(){return this.name+(this.message&&": ")+this.message}}},o=function(a,c,l){s(a,h=>{t.webkitGetUserMedia(h,c,u=>{l&&l(r(u))})})};if(t.getUserMedia=o.bind(t),t.mediaDevices.getUserMedia){let a=t.mediaDevices.getUserMedia.bind(t.mediaDevices);t.mediaDevices.getUserMedia=function(c){return s(c,l=>a(l).then(h=>{if(l.audio&&!h.getAudioTracks().length||l.video&&!h.getVideoTracks().length)throw h.getTracks().forEach(u=>{u.stop()}),new DOMException("","NotFoundError");return h},h=>Promise.reject(r(h))))}}}function vh(i){i.MediaStream=i.MediaStream||i.webkitMediaStream}function Mh(i,e){if(!(e.version>102))if(typeof i=="object"&&i.RTCPeerConnection&&!("ontrack"in i.RTCPeerConnection.prototype)){Object.defineProperty(i.RTCPeerConnection.prototype,"ontrack",{get(){return this._ontrack},set(n){this._ontrack&&this.removeEventListener("track",this._ontrack),this.addEventListener("track",this._ontrack=n)},enumerable:!0,configurable:!0});let t=i.RTCPeerConnection.prototype.setRemoteDescription;i.RTCPeerConnection.prototype.setRemoteDescription=function(){return this._ontrackpoly||(this._ontrackpoly=s=>{s.stream.addEventListener("addtrack",r=>{let o;i.RTCPeerConnection.prototype.getReceivers?o=this.getReceivers().find(c=>c.track&&c.track.id===r.track.id):o={track:r.track};let a=new Event("track");a.track=r.track,a.receiver=o,a.transceiver={receiver:o},a.streams=[s.stream],this.dispatchEvent(a)}),s.stream.getTracks().forEach(r=>{let o;i.RTCPeerConnection.prototype.getReceivers?o=this.getReceivers().find(c=>c.track&&c.track.id===r.id):o={track:r};let a=new Event("track");a.track=r,a.receiver=o,a.transceiver={receiver:o},a.streams=[s.stream],this.dispatchEvent(a)})},this.addEventListener("addstream",this._ontrackpoly)),t.apply(this,arguments)}}else An(i,"track",t=>(t.transceiver||Object.defineProperty(t,"transceiver",{value:{receiver:t.receiver}}),t))}function bh(i){if(typeof i=="object"&&i.RTCPeerConnection&&!("getSenders"in i.RTCPeerConnection.prototype)&&"createDTMFSender"in i.RTCPeerConnection.prototype){let e=function(s,r){return{track:r,get dtmf(){return this._dtmf===void 0&&(r.kind==="audio"?this._dtmf=s.createDTMFSender(r):this._dtmf=null),this._dtmf},_pc:s}};if(!i.RTCPeerConnection.prototype.getSenders){i.RTCPeerConnection.prototype.getSenders=function(){return this._senders=this._senders||[],this._senders.slice()};let s=i.RTCPeerConnection.prototype.addTrack;i.RTCPeerConnection.prototype.addTrack=function(a,c){let l=s.apply(this,arguments);return l||(l=e(this,a),this._senders.push(l)),l};let r=i.RTCPeerConnection.prototype.removeTrack;i.RTCPeerConnection.prototype.removeTrack=function(a){r.apply(this,arguments);let c=this._senders.indexOf(a);c!==-1&&this._senders.splice(c,1)}}let t=i.RTCPeerConnection.prototype.addStream;i.RTCPeerConnection.prototype.addStream=function(r){this._senders=this._senders||[],t.apply(this,[r]),r.getTracks().forEach(o=>{this._senders.push(e(this,o))})};let n=i.RTCPeerConnection.prototype.removeStream;i.RTCPeerConnection.prototype.removeStream=function(r){this._senders=this._senders||[],n.apply(this,[r]),r.getTracks().forEach(o=>{let a=this._senders.find(c=>c.track===o);a&&this._senders.splice(this._senders.indexOf(a),1)})}}else if(typeof i=="object"&&i.RTCPeerConnection&&"getSenders"in i.RTCPeerConnection.prototype&&"createDTMFSender"in i.RTCPeerConnection.prototype&&i.RTCRtpSender&&!("dtmf"in i.RTCRtpSender.prototype)){let e=i.RTCPeerConnection.prototype.getSenders;i.RTCPeerConnection.prototype.getSenders=function(){let n=e.apply(this,[]);return n.forEach(s=>s._pc=this),n},Object.defineProperty(i.RTCRtpSender.prototype,"dtmf",{get(){return this._dtmf===void 0&&(this.track.kind==="audio"?this._dtmf=this._pc.createDTMFSender(this.track):this._dtmf=null),this._dtmf}})}}function Sh(i,e){if(e.version>=67||!(typeof i=="object"&&i.RTCPeerConnection&&i.RTCRtpSender&&i.RTCRtpReceiver))return;if(!("getStats"in i.RTCRtpSender.prototype)){let n=i.RTCPeerConnection.prototype.getSenders;n&&(i.RTCPeerConnection.prototype.getSenders=function(){let o=n.apply(this,[]);return o.forEach(a=>a._pc=this),o});let s=i.RTCPeerConnection.prototype.addTrack;s&&(i.RTCPeerConnection.prototype.addTrack=function(){let o=s.apply(this,arguments);return o._pc=this,o}),i.RTCRtpSender.prototype.getStats=function(){let o=this;return this._pc.getStats().then(a=>xh(a,o.track,!0))}}if(!("getStats"in i.RTCRtpReceiver.prototype)){let n=i.RTCPeerConnection.prototype.getReceivers;n&&(i.RTCPeerConnection.prototype.getReceivers=function(){let r=n.apply(this,[]);return r.forEach(o=>o._pc=this),r}),An(i,"track",s=>(s.receiver._pc=s.srcElement,s)),i.RTCRtpReceiver.prototype.getStats=function(){let r=this;return this._pc.getStats().then(o=>xh(o,r.track,!1))}}if(!("getStats"in i.RTCRtpSender.prototype&&"getStats"in i.RTCRtpReceiver.prototype))return;let t=i.RTCPeerConnection.prototype.getStats;i.RTCPeerConnection.prototype.getStats=function(){if(arguments.length>0&&arguments[0]instanceof i.MediaStreamTrack){let s=arguments[0],r,o,a;return this.getSenders().forEach(c=>{c.track===s&&(r?a=!0:r=c)}),this.getReceivers().forEach(c=>(c.track===s&&(o?a=!0:o=c),c.track===s)),a||r&&o?Promise.reject(new DOMException("There are more than one sender or receiver for the track.","InvalidAccessError")):r?r.getStats():o?o.getStats():Promise.reject(new DOMException("There is no sender or receiver for the track.","InvalidAccessError"))}return t.apply(this,arguments)}}function Uf(i){i.RTCPeerConnection.prototype.getLocalStreams=function(){return this._shimmedLocalStreams=this._shimmedLocalStreams||{},Object.keys(this._shimmedLocalStreams).map(o=>this._shimmedLocalStreams[o][0])};let e=i.RTCPeerConnection.prototype.addTrack;i.RTCPeerConnection.prototype.addTrack=function(o,a){if(!a)return e.apply(this,arguments);this._shimmedLocalStreams=this._shimmedLocalStreams||{};let c=e.apply(this,arguments);return this._shimmedLocalStreams[a.id]?this._shimmedLocalStreams[a.id].indexOf(c)===-1&&this._shimmedLocalStreams[a.id].push(c):this._shimmedLocalStreams[a.id]=[a,c],c};let t=i.RTCPeerConnection.prototype.addStream;i.RTCPeerConnection.prototype.addStream=function(o){this._shimmedLocalStreams=this._shimmedLocalStreams||{},o.getTracks().forEach(l=>{if(this.getSenders().find(u=>u.track===l))throw new DOMException("Track already exists.","InvalidAccessError")});let a=this.getSenders();t.apply(this,arguments);let c=this.getSenders().filter(l=>a.indexOf(l)===-1);this._shimmedLocalStreams[o.id]=[o].concat(c)};let n=i.RTCPeerConnection.prototype.removeStream;i.RTCPeerConnection.prototype.removeStream=function(o){return this._shimmedLocalStreams=this._shimmedLocalStreams||{},delete this._shimmedLocalStreams[o.id],n.apply(this,arguments)};let s=i.RTCPeerConnection.prototype.removeTrack;i.RTCPeerConnection.prototype.removeTrack=function(o){return this._shimmedLocalStreams=this._shimmedLocalStreams||{},o&&Object.keys(this._shimmedLocalStreams).forEach(a=>{let c=this._shimmedLocalStreams[a].indexOf(o);c!==-1&&this._shimmedLocalStreams[a].splice(c,1),this._shimmedLocalStreams[a].length===1&&delete this._shimmedLocalStreams[a]}),s.apply(this,arguments)}}function Eh(i,e){if(!i.RTCPeerConnection)return;if(i.RTCPeerConnection.prototype.addTrack&&e.version>=65)return Uf(i);let t=i.RTCPeerConnection.prototype.getLocalStreams;i.RTCPeerConnection.prototype.getLocalStreams=function(){let h=t.apply(this);return this._reverseStreams=this._reverseStreams||{},h.map(u=>this._reverseStreams[u.id])};let n=i.RTCPeerConnection.prototype.addStream;i.RTCPeerConnection.prototype.addStream=function(h){if(this._streams=this._streams||{},this._reverseStreams=this._reverseStreams||{},h.getTracks().forEach(u=>{if(this.getSenders().find(f=>f.track===u))throw new DOMException("Track already exists.","InvalidAccessError")}),!this._reverseStreams[h.id]){let u=new i.MediaStream(h.getTracks());this._streams[h.id]=u,this._reverseStreams[u.id]=h,h=u}n.apply(this,[h])};let s=i.RTCPeerConnection.prototype.removeStream;i.RTCPeerConnection.prototype.removeStream=function(h){this._streams=this._streams||{},this._reverseStreams=this._reverseStreams||{},s.apply(this,[this._streams[h.id]||h]),delete this._reverseStreams[this._streams[h.id]?this._streams[h.id].id:h.id],delete this._streams[h.id]},i.RTCPeerConnection.prototype.addTrack=function(h,u){if(this.signalingState==="closed")throw new DOMException("The RTCPeerConnection's signalingState is 'closed'.","InvalidStateError");let d=[].slice.call(arguments,1);if(d.length!==1||!d[0].getTracks().find(y=>y===h))throw new DOMException("The adapter.js addTrack polyfill only supports a single  stream which is associated with the specified track.","NotSupportedError");if(this.getSenders().find(y=>y.track===h))throw new DOMException("Track already exists.","InvalidAccessError");this._streams=this._streams||{},this._reverseStreams=this._reverseStreams||{};let g=this._streams[u.id];if(g)g.addTrack(h),Promise.resolve().then(()=>{this.dispatchEvent(new Event("negotiationneeded"))});else{let y=new i.MediaStream([h]);this._streams[u.id]=y,this._reverseStreams[y.id]=u,this.addStream(y)}return this.getSenders().find(y=>y.track===h)};function r(l,h){let u=h.sdp;return Object.keys(l._reverseStreams||[]).forEach(d=>{let f=l._reverseStreams[d],g=l._streams[f.id];u=u.replace(new RegExp(g.id,"g"),f.id)}),new RTCSessionDescription({type:h.type,sdp:u})}function o(l,h){let u=h.sdp;return Object.keys(l._reverseStreams||[]).forEach(d=>{let f=l._reverseStreams[d],g=l._streams[f.id];u=u.replace(new RegExp(f.id,"g"),g.id)}),new RTCSessionDescription({type:h.type,sdp:u})}["createOffer","createAnswer"].forEach(function(l){let h=i.RTCPeerConnection.prototype[l],u={[l](){let d=arguments;return arguments.length&&typeof arguments[0]=="function"?h.apply(this,[g=>{let y=r(this,g);d[0].apply(null,[y])},g=>{d[1]&&d[1].apply(null,g)},arguments[2]]):h.apply(this,arguments).then(g=>r(this,g))}};i.RTCPeerConnection.prototype[l]=u[l]});let a=i.RTCPeerConnection.prototype.setLocalDescription;i.RTCPeerConnection.prototype.setLocalDescription=function(){return!arguments.length||!arguments[0].type?a.apply(this,arguments):(arguments[0]=o(this,arguments[0]),a.apply(this,arguments))};let c=Object.getOwnPropertyDescriptor(i.RTCPeerConnection.prototype,"localDescription");Object.defineProperty(i.RTCPeerConnection.prototype,"localDescription",{get(){let l=c.get.apply(this);return l.type===""?l:r(this,l)}}),i.RTCPeerConnection.prototype.removeTrack=function(h){if(this.signalingState==="closed")throw new DOMException("The RTCPeerConnection's signalingState is 'closed'.","InvalidStateError");if(!h._pc)throw new DOMException("Argument 1 of RTCPeerConnection.removeTrack does not implement interface RTCRtpSender.","TypeError");if(!(h._pc===this))throw new DOMException("Sender was not created by this connection.","InvalidAccessError");this._streams=this._streams||{};let d;Object.keys(this._streams).forEach(f=>{this._streams[f].getTracks().find(y=>h.track===y)&&(d=this._streams[f])}),d&&(d.getTracks().length===1?this.removeStream(this._reverseStreams[d.id]):d.removeTrack(h.track),this.dispatchEvent(new Event("negotiationneeded")))}}function fa(i,e){!i.RTCPeerConnection&&i.webkitRTCPeerConnection&&(i.RTCPeerConnection=i.webkitRTCPeerConnection),i.RTCPeerConnection&&e.version<53&&["setLocalDescription","setRemoteDescription","addIceCandidate"].forEach(function(t){let n=i.RTCPeerConnection.prototype[t],s={[t](){return arguments[0]=new(t==="addIceCandidate"?i.RTCIceCandidate:i.RTCSessionDescription)(arguments[0]),n.apply(this,arguments)}};i.RTCPeerConnection.prototype[t]=s[t]})}function Th(i,e){e.version>102||An(i,"negotiationneeded",t=>{let n=t.target;if(!((e.version<72||n.getConfiguration&&n.getConfiguration().sdpSemantics==="plan-b")&&n.signalingState!=="stable"))return t})}var _a={};Lr(_a,{shimAddTransceiver:()=>Lh,shimCreateAnswer:()=>Nh,shimCreateOffer:()=>Uh,shimGetDisplayMedia:()=>Nf,shimGetParameters:()=>Dh,shimGetStats:()=>Ch,shimGetUserMedia:()=>ma,shimOnTrack:()=>wh,shimPeerConnection:()=>ga,shimRTCDataChannel:()=>Ih,shimReceiverGetStats:()=>Rh,shimRemoveStream:()=>Ph,shimSenderGetStats:()=>Ah});function ma(i,e){let t=i&&i.navigator;if(!t.mediaDevices)return;let n=i&&i.MediaStreamTrack;if(t.getUserMedia=function(s,r,o){As("navigator.getUserMedia","navigator.mediaDevices.getUserMedia"),t.mediaDevices.getUserMedia(s).then(r,o)},!(e.version>55&&"autoGainControl"in t.mediaDevices.getSupportedConstraints())){let s=function(o,a,c){a in o&&!(c in o)&&(o[c]=o[a],delete o[a])},r=t.mediaDevices.getUserMedia.bind(t.mediaDevices);if(t.mediaDevices.getUserMedia=function(o){return typeof o=="object"&&typeof o.audio=="object"&&(o=JSON.parse(JSON.stringify(o)),s(o.audio,"autoGainControl","mozAutoGainControl"),s(o.audio,"noiseSuppression","mozNoiseSuppression")),r(o)},n&&n.prototype.getSettings){let o=n.prototype.getSettings;n.prototype.getSettings=function(){let a=o.apply(this,arguments);return s(a,"mozAutoGainControl","autoGainControl"),s(a,"mozNoiseSuppression","noiseSuppression"),a}}if(n&&n.prototype.applyConstraints){let o=n.prototype.applyConstraints;n.prototype.applyConstraints=function(a){return this.kind==="audio"&&typeof a=="object"&&(a=JSON.parse(JSON.stringify(a)),s(a,"autoGainControl","mozAutoGainControl"),s(a,"noiseSuppression","mozNoiseSuppression")),o.apply(this,[a])}}}}function Nf(i,e){i.navigator.mediaDevices&&(i.navigator.mediaDevices&&"getDisplayMedia"in i.navigator.mediaDevices||(i.navigator.mediaDevices.getDisplayMedia=function(n){if(!(n&&n.video)){let s=new DOMException("getDisplayMedia without video constraints is undefined");return s.name="NotFoundError",s.code=8,Promise.reject(s)}return n.video===!0?n.video={mediaSource:e}:n.video.mediaSource=e,i.navigator.mediaDevices.getUserMedia(n)}))}function wh(i){typeof i=="object"&&i.RTCTrackEvent&&"receiver"in i.RTCTrackEvent.prototype&&!("transceiver"in i.RTCTrackEvent.prototype)&&Object.defineProperty(i.RTCTrackEvent.prototype,"transceiver",{get(){return{receiver:this.receiver}}})}function ga(i,e){typeof i!="object"||!(i.RTCPeerConnection||i.mozRTCPeerConnection)||(!i.RTCPeerConnection&&i.mozRTCPeerConnection&&(i.RTCPeerConnection=i.mozRTCPeerConnection),e.version<53&&["setLocalDescription","setRemoteDescription","addIceCandidate"].forEach(function(t){let n=i.RTCPeerConnection.prototype[t],s={[t](){return arguments[0]=new(t==="addIceCandidate"?i.RTCIceCandidate:i.RTCSessionDescription)(arguments[0]),n.apply(this,arguments)}};i.RTCPeerConnection.prototype[t]=s[t]}))}function Ch(i,e){if(typeof i!="object"||!(i.RTCPeerConnection||i.mozRTCPeerConnection)||e.version>=151)return;let t={inboundrtp:"inbound-rtp",outboundrtp:"outbound-rtp",candidatepair:"candidate-pair",localcandidate:"local-candidate",remotecandidate:"remote-candidate"},n=i.RTCPeerConnection.prototype.getStats;i.RTCPeerConnection.prototype.getStats=function(){let[r,o,a]=arguments;return this.signalingState==="closed"?Promise.resolve(new Map):n.apply(this,[r||null]).then(c=>{if(e.version<53&&!o)try{c.forEach(l=>{l.type=t[l.type]||l.type})}catch(l){if(l.name!=="TypeError")throw l;c.forEach((h,u)=>{c.set(u,Object.assign({},h,{type:t[h.type]||h.type}))})}return c}).then(o,a)}}function Ah(i){if(!(typeof i=="object"&&i.RTCPeerConnection&&i.RTCRtpSender)||i.RTCRtpSender&&"getStats"in i.RTCRtpSender.prototype)return;let e=i.RTCPeerConnection.prototype.getSenders;e&&(i.RTCPeerConnection.prototype.getSenders=function(){let s=e.apply(this,[]);return s.forEach(r=>r._pc=this),s});let t=i.RTCPeerConnection.prototype.addTrack;t&&(i.RTCPeerConnection.prototype.addTrack=function(){let s=t.apply(this,arguments);return s._pc=this,s}),i.RTCRtpSender.prototype.getStats=function(){return this.track?this._pc.getStats(this.track):Promise.resolve(new Map)}}function Rh(i){if(!(typeof i=="object"&&i.RTCPeerConnection&&i.RTCRtpSender)||i.RTCRtpSender&&"getStats"in i.RTCRtpReceiver.prototype)return;let e=i.RTCPeerConnection.prototype.getReceivers;e&&(i.RTCPeerConnection.prototype.getReceivers=function(){let n=e.apply(this,[]);return n.forEach(s=>s._pc=this),n}),An(i,"track",t=>(t.receiver._pc=t.srcElement,t)),i.RTCRtpReceiver.prototype.getStats=function(){return this._pc.getStats(this.track)}}function Ph(i){!i.RTCPeerConnection||"removeStream"in i.RTCPeerConnection.prototype||(i.RTCPeerConnection.prototype.removeStream=function(t){As("removeStream","removeTrack"),this.getSenders().forEach(n=>{n.track&&t.getTracks().includes(n.track)&&this.removeTrack(n)})})}function Ih(i){i.DataChannel&&!i.RTCDataChannel&&(i.RTCDataChannel=i.DataChannel)}function Lh(i,e){if(!(typeof i=="object"&&i.RTCPeerConnection)||e.version>=110)return;let t=i.RTCPeerConnection.prototype.addTransceiver;t&&(i.RTCPeerConnection.prototype.addTransceiver=function(){this.setParametersPromises=[];let s=arguments[1]&&arguments[1].sendEncodings;s===void 0&&(s=[]),s=[...s];let r=s.length>0;r&&s.forEach(a=>{if("rid"in a&&!/^[a-z0-9]{0,16}$/i.test(a.rid))throw new TypeError("Invalid RID value provided.");if("scaleResolutionDownBy"in a&&!(parseFloat(a.scaleResolutionDownBy)>=1))throw new RangeError("scale_resolution_down_by must be >= 1.0");if("maxFramerate"in a&&!(parseFloat(a.maxFramerate)>=0))throw new RangeError("max_framerate must be >= 0.0")});let o=t.apply(this,arguments);if(r){let{sender:a}=o,c=a.getParameters();(!("encodings"in c)||c.encodings.length===1&&Object.keys(c.encodings[0]).length===0)&&(c.encodings=s,a.sendEncodings=s,this.setParametersPromises.push(a.setParameters(c).then(()=>{delete a.sendEncodings}).catch(()=>{delete a.sendEncodings})))}return o})}function Dh(i,e){if(!(typeof i=="object"&&i.RTCRtpSender)||e.version>=110)return;let t=i.RTCRtpSender.prototype.getParameters;t&&(i.RTCRtpSender.prototype.getParameters=function(){let s=t.apply(this,arguments);return"encodings"in s||(s.encodings=[].concat(this.sendEncodings||[{}])),s})}function Uh(i,e){if(!(typeof i=="object"&&i.RTCPeerConnection)||e.version>=110)return;let t=i.RTCPeerConnection.prototype.createOffer;i.RTCPeerConnection.prototype.createOffer=function(){return this.setParametersPromises&&this.setParametersPromises.length?Promise.all(this.setParametersPromises).then(()=>t.apply(this,arguments)).finally(()=>{this.setParametersPromises=[]}):t.apply(this,arguments)}}function Nh(i,e){if(!(typeof i=="object"&&i.RTCPeerConnection)||e.version>=110)return;let t=i.RTCPeerConnection.prototype.createAnswer;i.RTCPeerConnection.prototype.createAnswer=function(){return this.setParametersPromises&&this.setParametersPromises.length?Promise.all(this.setParametersPromises).then(()=>t.apply(this,arguments)).finally(()=>{this.setParametersPromises=[]}):t.apply(this,arguments)}}var ya={};Lr(ya,{shimAudioContext:()=>Gh,shimCallbacksAPI:()=>Fh,shimConstraints:()=>kf,shimCreateOfferLegacy:()=>Vh,shimGetUserMedia:()=>Bh,shimLocalStreamsAPI:()=>kh,shimRTCIceServerUrls:()=>zh,shimRemoteStreamsAPI:()=>Oh,shimTrackEventTransceiver:()=>Hh});function kh(i){if(!(typeof i!="object"||!i.RTCPeerConnection)){if("getLocalStreams"in i.RTCPeerConnection.prototype||(i.RTCPeerConnection.prototype.getLocalStreams=function(){return this._localStreams||(this._localStreams=[]),this._localStreams}),!("addStream"in i.RTCPeerConnection.prototype)){let e=i.RTCPeerConnection.prototype.addTrack;i.RTCPeerConnection.prototype.addStream=function(n){this._localStreams||(this._localStreams=[]),this._localStreams.includes(n)||this._localStreams.push(n),n.getAudioTracks().forEach(s=>e.call(this,s,n)),n.getVideoTracks().forEach(s=>e.call(this,s,n))},i.RTCPeerConnection.prototype.addTrack=function(n,...s){return s&&s.forEach(r=>{this._localStreams?this._localStreams.includes(r)||this._localStreams.push(r):this._localStreams=[r]}),e.apply(this,arguments)}}"removeStream"in i.RTCPeerConnection.prototype||(i.RTCPeerConnection.prototype.removeStream=function(t){this._localStreams||(this._localStreams=[]);let n=this._localStreams.indexOf(t);if(n===-1)return;this._localStreams.splice(n,1);let s=t.getTracks();this.getSenders().forEach(r=>{s.includes(r.track)&&this.removeTrack(r)})})}}function Oh(i){if(!(typeof i!="object"||!i.RTCPeerConnection)&&("getRemoteStreams"in i.RTCPeerConnection.prototype||(i.RTCPeerConnection.prototype.getRemoteStreams=function(){return this._remoteStreams?this._remoteStreams:[]}),!("onaddstream"in i.RTCPeerConnection.prototype))){Object.defineProperty(i.RTCPeerConnection.prototype,"onaddstream",{get(){return this._onaddstream},set(t){this._onaddstream&&(this.removeEventListener("addstream",this._onaddstream),this.removeEventListener("track",this._onaddstreampoly)),this.addEventListener("addstream",this._onaddstream=t),this.addEventListener("track",this._onaddstreampoly=n=>{n.streams.forEach(s=>{if(this._remoteStreams||(this._remoteStreams=[]),this._remoteStreams.includes(s))return;this._remoteStreams.push(s);let r=new Event("addstream");r.stream=s,this.dispatchEvent(r)})})}});let e=i.RTCPeerConnection.prototype.setRemoteDescription;i.RTCPeerConnection.prototype.setRemoteDescription=function(){let n=this;return this._onaddstreampoly||this.addEventListener("track",this._onaddstreampoly=function(s){s.streams.forEach(r=>{if(n._remoteStreams||(n._remoteStreams=[]),n._remoteStreams.indexOf(r)>=0)return;n._remoteStreams.push(r);let o=new Event("addstream");o.stream=r,n.dispatchEvent(o)})}),e.apply(n,arguments)}}}function Fh(i){if(typeof i!="object"||!i.RTCPeerConnection)return;let e=i.RTCPeerConnection.prototype,t=e.createOffer,n=e.createAnswer,s=e.setLocalDescription,r=e.setRemoteDescription,o=e.addIceCandidate;e.createOffer=function(l,h){let u=arguments.length>=2?arguments[2]:arguments[0],d=t.apply(this,[u]);return h?(d.then(l,h),Promise.resolve()):d},e.createAnswer=function(l,h){let u=arguments.length>=2?arguments[2]:arguments[0],d=n.apply(this,[u]);return h?(d.then(l,h),Promise.resolve()):d};let a=function(c,l,h){let u=s.apply(this,[c]);return h?(u.then(l,h),Promise.resolve()):u};e.setLocalDescription=a,a=function(c,l,h){let u=r.apply(this,[c]);return h?(u.then(l,h),Promise.resolve()):u},e.setRemoteDescription=a,a=function(c,l,h){let u=o.apply(this,[c]);return h?(u.then(l,h),Promise.resolve()):u},e.addIceCandidate=a}function Bh(i){let e=i&&i.navigator;if(e.mediaDevices&&e.mediaDevices.getUserMedia){let t=e.mediaDevices,n=t.getUserMedia.bind(t);e.mediaDevices.getUserMedia=s=>n(kf(s))}!e.getUserMedia&&e.mediaDevices&&e.mediaDevices.getUserMedia&&(e.getUserMedia=function(n,s,r){e.mediaDevices.getUserMedia(n).then(s,r)}.bind(e))}function kf(i){return i&&i.video!==void 0?Object.assign({},i,{video:yh(i.video)}):i}function zh(i){if(!i.RTCPeerConnection)return;let e=i.RTCPeerConnection;i.RTCPeerConnection=function(n,s){if(n&&n.iceServers){let r=[];for(let o=0;o<n.iceServers.length;o++){let a=n.iceServers[o];a.urls===void 0&&a.url?(As("RTCIceServer.url","RTCIceServer.urls"),a=JSON.parse(JSON.stringify(a)),a.urls=a.url,delete a.url,r.push(a)):r.push(n.iceServers[o])}n.iceServers=r}return new e(n,s)},i.RTCPeerConnection.prototype=e.prototype,"generateCertificate"in e&&Object.defineProperty(i.RTCPeerConnection,"generateCertificate",{get(){return e.generateCertificate}})}function Hh(i){typeof i=="object"&&i.RTCTrackEvent&&"receiver"in i.RTCTrackEvent.prototype&&!("transceiver"in i.RTCTrackEvent.prototype)&&Object.defineProperty(i.RTCTrackEvent.prototype,"transceiver",{get(){return{receiver:this.receiver}}})}function Vh(i){let e=i.RTCPeerConnection.prototype.createOffer;i.RTCPeerConnection.prototype.createOffer=function(n){if(n){typeof n.offerToReceiveAudio!="undefined"&&(n.offerToReceiveAudio=!!n.offerToReceiveAudio);let s=this.getTransceivers().find(o=>o.receiver.track.kind==="audio");n.offerToReceiveAudio===!1&&s?s.direction==="sendrecv"?s.setDirection?s.setDirection("sendonly"):s.direction="sendonly":s.direction==="recvonly"&&(s.setDirection?s.setDirection("inactive"):s.direction="inactive"):n.offerToReceiveAudio===!0&&!s&&this.addTransceiver("audio",{direction:"recvonly"}),typeof n.offerToReceiveVideo!="undefined"&&(n.offerToReceiveVideo=!!n.offerToReceiveVideo);let r=this.getTransceivers().find(o=>o.receiver.track.kind==="video");n.offerToReceiveVideo===!1&&r?r.direction==="sendrecv"?r.setDirection?r.setDirection("sendonly"):r.direction="sendonly":r.direction==="recvonly"&&(r.setDirection?r.setDirection("inactive"):r.direction="inactive"):n.offerToReceiveVideo===!0&&!r&&this.addTransceiver("video",{direction:"recvonly"})}return e.apply(this,arguments)}}function Gh(i){typeof i!="object"||i.AudioContext||(i.AudioContext=i.webkitAudioContext)}var qh={};Lr(qh,{removeExtmapAllowMixed:()=>Ma,shimAddIceCandidateNullOrEmpty:()=>xr,shimConnectionState:()=>va,shimMaxMessageSize:()=>_r,shimParameterlessSetLocalDescription:()=>vr,shimRTCIceCandidate:()=>gr,shimRTCIceCandidateRelayProtocol:()=>xa,shimSendThrowTypeError:()=>yr});var Rs=Mu(Xh());function gr(i){if(!i.RTCIceCandidate||i.RTCIceCandidate&&"foundation"in i.RTCIceCandidate.prototype)return;let e=i.RTCIceCandidate;i.RTCIceCandidate=function(n){if(typeof n=="object"&&n.candidate&&n.candidate.indexOf("a=")===0&&(n=JSON.parse(JSON.stringify(n)),n.candidate=n.candidate.substring(2)),n.candidate&&n.candidate.length){let s=new e(n),r=Rs.default.parseCandidate(n.candidate);for(let o in r)o in s||Object.defineProperty(s,o,{value:r[o]});return s.toJSON=function(){return{candidate:s.candidate,sdpMid:s.sdpMid,sdpMLineIndex:s.sdpMLineIndex,usernameFragment:s.usernameFragment}},s}return new e(n)},i.RTCIceCandidate.prototype=e.prototype,An(i,"icecandidate",t=>(t.candidate&&Object.defineProperty(t,"candidate",{value:new i.RTCIceCandidate(t.candidate),writable:"false"}),t))}function xa(i){!i.RTCIceCandidate||i.RTCIceCandidate&&"relayProtocol"in i.RTCIceCandidate.prototype||An(i,"icecandidate",e=>{if(e.candidate){let t=Rs.default.parseCandidate(e.candidate.candidate);t.type==="relay"&&(e.candidate.relayProtocol={0:"tls",1:"tcp",2:"udp"}[t.priority>>24])}return e})}function _r(i,e){if(!i.RTCPeerConnection||e.browser==="chrome"&&e.version>102||e.browser==="firefox"&&e.version>=113)return;"sctp"in i.RTCPeerConnection.prototype||Object.defineProperty(i.RTCPeerConnection.prototype,"sctp",{get(){return typeof this._sctp=="undefined"?null:this._sctp}});let t=function(a){if(!a||!a.sdp)return!1;let c=Rs.default.splitSections(a.sdp);return c.shift(),c.some(l=>{let h=Rs.default.parseMLine(l);return h&&h.kind==="application"&&h.protocol.indexOf("SCTP")!==-1})},n=function(a){let c=a.sdp.match(/mozilla...THIS_IS_SDPARTA-(\d+)/);if(c===null||c.length<2)return-1;let l=parseInt(c[1],10);return l!==l?-1:l},s=function(a){let c=65536;return e.browser==="firefox"&&(e.version<57?a===-1?c=16384:c=2147483637:e.version<60?c=e.version===57?65535:65536:c=2147483637),c},r=function(a,c){let l=65536;e.browser==="firefox"&&e.version===57&&(l=65535);let h=Rs.default.matchPrefix(a.sdp,"a=max-message-size:");return h.length>0?l=parseInt(h[0].substring(19),10):e.browser==="firefox"&&c!==-1&&(l=2147483637),l},o=i.RTCPeerConnection.prototype.setRemoteDescription;i.RTCPeerConnection.prototype.setRemoteDescription=function(){if(this._sctp=null,e.browser==="chrome"&&e.version>=76){let{sdpSemantics:c}=this.getConfiguration();c==="plan-b"&&Object.defineProperty(this,"sctp",{get(){return typeof this._sctp=="undefined"?null:this._sctp},enumerable:!0,configurable:!0})}if(t(arguments[0])){let c=n(arguments[0]),l=s(c),h=r(arguments[0],c),u;l===0&&h===0?u=Number.POSITIVE_INFINITY:l===0||h===0?u=Math.max(l,h):u=Math.min(l,h);let d={};Object.defineProperty(d,"maxMessageSize",{get(){return u}}),this._sctp=d}return o.apply(this,arguments)}}function yr(i,e){if(!(i.RTCPeerConnection&&"createDataChannel"in i.RTCPeerConnection.prototype)||e.browser==="chrome"&&e.version>=149||e.browser==="firefox"&&e.version>60)return;function t(s,r){let o=s.send;s.send=function(){let c=arguments[0],l=c.length||c.size||c.byteLength;if(s.readyState==="open"&&r.sctp&&l>r.sctp.maxMessageSize)throw new TypeError("Message too large (can send a maximum of "+r.sctp.maxMessageSize+" bytes)");return o.apply(s,arguments)}}let n=i.RTCPeerConnection.prototype.createDataChannel;i.RTCPeerConnection.prototype.createDataChannel=function(){let r=n.apply(this,arguments);return t(r,this),r},An(i,"datachannel",s=>(t(s.channel,s.target),s))}function va(i){if(!i.RTCPeerConnection||"connectionState"in i.RTCPeerConnection.prototype)return;let e=i.RTCPeerConnection.prototype;Object.defineProperty(e,"connectionState",{get(){return{completed:"connected",checking:"connecting"}[this.iceConnectionState]||this.iceConnectionState},enumerable:!0,configurable:!0}),Object.defineProperty(e,"onconnectionstatechange",{get(){return this._onconnectionstatechange||null},set(t){this._onconnectionstatechange&&(this.removeEventListener("connectionstatechange",this._onconnectionstatechange),delete this._onconnectionstatechange),t&&this.addEventListener("connectionstatechange",this._onconnectionstatechange=t)},enumerable:!0,configurable:!0}),["setLocalDescription","setRemoteDescription"].forEach(t=>{let n=e[t];e[t]=function(){return this._connectionstatechangepoly||(this._connectionstatechangepoly=s=>{let r=s.target;if(r._lastConnectionState!==r.connectionState){r._lastConnectionState=r.connectionState;let o=new Event("connectionstatechange",s);r.dispatchEvent(o)}return s},this.addEventListener("iceconnectionstatechange",this._connectionstatechangepoly)),n.apply(this,arguments)}})}function Ma(i,e){if(!i.RTCPeerConnection||e.browser==="chrome"&&e.version>=71||e.browser==="safari"&&e._safariVersion>=13.1)return;let t=i.RTCPeerConnection.prototype.setRemoteDescription;i.RTCPeerConnection.prototype.setRemoteDescription=function(s){if(s&&s.sdp&&s.sdp.indexOf(`
a=extmap-allow-mixed`)!==-1){let r=s.sdp.split(`
`).filter(o=>o.trim()!=="a=extmap-allow-mixed").join(`
`);i.RTCSessionDescription&&s instanceof i.RTCSessionDescription?arguments[0]=new i.RTCSessionDescription({type:s.type,sdp:r}):s.sdp=r}return t.apply(this,arguments)}}function xr(i,e){if(!(i.RTCPeerConnection&&i.RTCPeerConnection.prototype))return;let t=i.RTCPeerConnection.prototype.addIceCandidate;!t||t.length===0||(i.RTCPeerConnection.prototype.addIceCandidate=function(){return arguments[0]?(e.browser==="chrome"&&e.version<78||e.browser==="firefox"&&e.version<68||e.browser==="safari")&&arguments[0]&&arguments[0].candidate===""?Promise.resolve():t.apply(this,arguments):(arguments[1]&&arguments[1].apply(null),Promise.resolve())})}function vr(i,e){if(!(i.RTCPeerConnection&&i.RTCPeerConnection.prototype))return;let t=i.RTCPeerConnection.prototype.setLocalDescription;!t||t.length===0||(i.RTCPeerConnection.prototype.setLocalDescription=function(){let s=arguments[0]||{};if(typeof s!="object"||s.type&&s.sdp)return t.apply(this,arguments);if(s={type:s.type,sdp:s.sdp},!s.type)switch(this.signalingState){case"stable":case"have-local-offer":case"have-remote-pranswer":s.type="offer";break;default:s.type="answer";break}return s.sdp||s.type!=="offer"&&s.type!=="answer"?t.apply(this,[s]):(s.type==="offer"?this.createOffer:this.createAnswer).apply(this).then(o=>t.apply(this,[o]))})}var jx=Mu(Xh());function Of({window:i}={},e={shimChrome:!0,shimFirefox:!0,shimSafari:!0}){let t=mr,n=Lf(i),s={browserDetails:n,commonShim:qh,extractVersion:Cs,disableLog:Pf,disableWarnings:If,sdp:jx};switch(n.browser){case"chrome":if(!pa||!fa||!e.shimChrome)return t("Chrome shim is not included in this adapter release."),s;if(n.version===null)return t("Chrome shim can not determine version, not shimming."),s;t("adapter.js shimming chrome."),s.browserShim=pa,xr(i,n),vr(i,n),da(i,n),vh(i,n),fa(i,n),Mh(i,n),Eh(i,n),bh(i,n),Sh(i,n),Th(i,n),gr(i,n),xa(i,n),va(i,n),_r(i,n),yr(i,n),Ma(i,n);break;case"firefox":if(!_a||!ga||!e.shimFirefox)return t("Firefox shim is not included in this adapter release."),s;t("adapter.js shimming firefox."),s.browserShim=_a,xr(i,n),vr(i,n),ma(i,n),ga(i,n),Ch(i,n),wh(i,n),Ph(i,n),Ah(i,n),Rh(i,n),Ih(i,n),Lh(i,n),Dh(i,n),Uh(i,n),Nh(i,n),gr(i,n),va(i,n),_r(i,n),yr(i,n);break;case"safari":if(!ya||!e.shimSafari)return t("Safari shim is not included in this adapter release."),s;t("adapter.js shimming safari."),s.browserShim=ya,xr(i,n),vr(i,n),zh(i,n),Vh(i,n),Fh(i,n),kh(i,n),Oh(i,n),Hh(i,n),Bh(i,n),Gh(i,n),gr(i,n),xa(i,n),_r(i,n),yr(i,n),Ma(i,n);break;default:t("Unsupported browser!");break}return s}var Kx=Of({window:typeof window=="undefined"?void 0:window}),Yh=Kx;function Ui(i,e,t,n){Object.defineProperty(i,e,{get:t,set:n,enumerable:!0,configurable:!0})}var Sa=class{constructor(){this.chunkedMTU=16300,this._dataCount=1,this.chunk=e=>{let t=[],n=e.byteLength,s=Math.ceil(n/this.chunkedMTU),r=0,o=0;for(;o<n;){let a=Math.min(n,o+this.chunkedMTU),c=e.slice(o,a),l={__peerData:this._dataCount,n:r,data:c,total:s};t.push(l),o=a,r++}return this._dataCount++,t}}};function Qx(i){let e=0;for(let s of i)e+=s.byteLength;let t=new Uint8Array(e),n=0;for(let s of i)t.set(s,n),n+=s.byteLength;return t}var $h=Yh.default||Yh,Mr=new class{isWebRTCSupported(){return typeof RTCPeerConnection!="undefined"}isBrowserSupported(){let i=this.getBrowser(),e=this.getVersion();return this.supportedBrowsers.includes(i)?i==="chrome"?e>=this.minChromeVersion:i==="firefox"?e>=this.minFirefoxVersion:i==="safari"?!this.isIOS&&e>=this.minSafariVersion:!1:!1}getBrowser(){return $h.browserDetails.browser}getVersion(){return $h.browserDetails.version||0}isUnifiedPlanSupported(){let i=this.getBrowser(),e=$h.browserDetails.version||0;if(i==="chrome"&&e<this.minChromeVersion)return!1;if(i==="firefox"&&e>=this.minFirefoxVersion)return!0;if(!window.RTCRtpTransceiver||!("currentDirection"in RTCRtpTransceiver.prototype))return!1;let t,n=!1;try{t=new RTCPeerConnection,t.addTransceiver("audio"),n=!0}catch{}finally{t&&t.close()}return n}toString(){return`Supports:
    browser:${this.getBrowser()}
    version:${this.getVersion()}
    isIOS:${this.isIOS}
    isWebRTCSupported:${this.isWebRTCSupported()}
    isBrowserSupported:${this.isBrowserSupported()}
    isUnifiedPlanSupported:${this.isUnifiedPlanSupported()}`}constructor(){this.isIOS=typeof navigator!="undefined"?["iPad","iPhone","iPod"].includes(navigator.platform):!1,this.supportedBrowsers=["firefox","chrome","safari"],this.minFirefoxVersion=59,this.minChromeVersion=72,this.minSafariVersion=605}},ev=i=>!i||/^[A-Za-z0-9]+(?:[ _-][A-Za-z0-9]+)*$/.test(i),zf=()=>Math.random().toString(36).slice(2),Ff={iceServers:[{urls:"stun:stun.l.google.com:19302"},{urls:["turn:eu-0.turn.peerjs.com:3478","turn:us-0.turn.peerjs.com:3478"],username:"peerjs",credential:"peerjsp"}],sdpSemantics:"unified-plan"},Jh=class extends Sa{noop(){}blobToArrayBuffer(e,t){let n=new FileReader;return n.onload=function(s){s.target&&t(s.target.result)},n.readAsArrayBuffer(e),n}binaryStringToArrayBuffer(e){let t=new Uint8Array(e.length);for(let n=0;n<e.length;n++)t[n]=e.charCodeAt(n)&255;return t.buffer}isSecure(){return location.protocol==="https:"}constructor(...e){super(...e),this.CLOUD_HOST="0.peerjs.com",this.CLOUD_PORT=443,this.chunkedBrowsers={Chrome:1,chrome:1},this.defaultConfig=Ff,this.browser=Mr.getBrowser(),this.browserVersion=Mr.getVersion(),this.pack=gh,this.unpack=mh,this.supports=function(){let t={browser:Mr.isBrowserSupported(),webRTC:Mr.isWebRTCSupported(),audioVideo:!1,data:!1,binaryBlob:!1,reliable:!1};if(!t.webRTC)return t;let n;try{n=new RTCPeerConnection(Ff),t.audioVideo=!0;let s;try{s=n.createDataChannel("_PEERJSTEST",{ordered:!0}),t.data=!0,t.reliable=!!s.ordered;try{s.binaryType="blob",t.binaryBlob=!Mr.isIOS}catch{}}catch{}finally{s&&s.close()}}catch{}finally{n&&n.close()}return t}(),this.validateId=ev,this.randomToken=zf}},Zt=new Jh,tv="PeerJS: ",Bf;(function(i){i[i.Disabled=0]="Disabled",i[i.Errors=1]="Errors",i[i.Warnings=2]="Warnings",i[i.All=3]="All"})(Bf||(Bf={}));var Zh=class{get logLevel(){return this._logLevel}set logLevel(e){this._logLevel=e}log(...e){this._logLevel>=3&&this._print(3,...e)}warn(...e){this._logLevel>=2&&this._print(2,...e)}error(...e){this._logLevel>=1&&this._print(1,...e)}setLogFunction(e){this._print=e}_print(e,...t){let n=[tv,...t];for(let s in n)n[s]instanceof Error&&(n[s]="("+n[s].name+") "+n[s].message);e>=3?console.log(...n):e>=2?console.warn("WARNING",...n):e>=1&&console.error("ERROR",...n)}constructor(){this._logLevel=0}},Ie=new Zh,au={},nv=Object.prototype.hasOwnProperty,Yt="~";function Tr(){}Object.create&&(Tr.prototype=Object.create(null),new Tr().__proto__||(Yt=!1));function iv(i,e,t){this.fn=i,this.context=e,this.once=t||!1}function Hf(i,e,t,n,s){if(typeof t!="function")throw new TypeError("The listener must be a function");var r=new iv(t,n||i,s),o=Yt?Yt+e:e;return i._events[o]?i._events[o].fn?i._events[o]=[i._events[o],r]:i._events[o].push(r):(i._events[o]=r,i._eventsCount++),i}function ba(i,e){--i._eventsCount===0?i._events=new Tr:delete i._events[e]}function Vt(){this._events=new Tr,this._eventsCount=0}Vt.prototype.eventNames=function(){var e=[],t,n;if(this._eventsCount===0)return e;for(n in t=this._events)nv.call(t,n)&&e.push(Yt?n.slice(1):n);return Object.getOwnPropertySymbols?e.concat(Object.getOwnPropertySymbols(t)):e};Vt.prototype.listeners=function(e){var t=Yt?Yt+e:e,n=this._events[t];if(!n)return[];if(n.fn)return[n.fn];for(var s=0,r=n.length,o=new Array(r);s<r;s++)o[s]=n[s].fn;return o};Vt.prototype.listenerCount=function(e){var t=Yt?Yt+e:e,n=this._events[t];return n?n.fn?1:n.length:0};Vt.prototype.emit=function(e,t,n,s,r,o){var a=Yt?Yt+e:e;if(!this._events[a])return!1;var c=this._events[a],l=arguments.length,h,u;if(c.fn){switch(c.once&&this.removeListener(e,c.fn,void 0,!0),l){case 1:return c.fn.call(c.context),!0;case 2:return c.fn.call(c.context,t),!0;case 3:return c.fn.call(c.context,t,n),!0;case 4:return c.fn.call(c.context,t,n,s),!0;case 5:return c.fn.call(c.context,t,n,s,r),!0;case 6:return c.fn.call(c.context,t,n,s,r,o),!0}for(u=1,h=new Array(l-1);u<l;u++)h[u-1]=arguments[u];c.fn.apply(c.context,h)}else{var d=c.length,f;for(u=0;u<d;u++)switch(c[u].once&&this.removeListener(e,c[u].fn,void 0,!0),l){case 1:c[u].fn.call(c[u].context);break;case 2:c[u].fn.call(c[u].context,t);break;case 3:c[u].fn.call(c[u].context,t,n);break;case 4:c[u].fn.call(c[u].context,t,n,s);break;default:if(!h)for(f=1,h=new Array(l-1);f<l;f++)h[f-1]=arguments[f];c[u].fn.apply(c[u].context,h)}}return!0};Vt.prototype.on=function(e,t,n){return Hf(this,e,t,n,!1)};Vt.prototype.once=function(e,t,n){return Hf(this,e,t,n,!0)};Vt.prototype.removeListener=function(e,t,n,s){var r=Yt?Yt+e:e;if(!this._events[r])return this;if(!t)return ba(this,r),this;var o=this._events[r];if(o.fn)o.fn===t&&(!s||o.once)&&(!n||o.context===n)&&ba(this,r);else{for(var a=0,c=[],l=o.length;a<l;a++)(o[a].fn!==t||s&&!o[a].once||n&&o[a].context!==n)&&c.push(o[a]);c.length?this._events[r]=c.length===1?c[0]:c:ba(this,r)}return this};Vt.prototype.removeAllListeners=function(e){var t;return e?(t=Yt?Yt+e:e,this._events[t]&&ba(this,t)):(this._events=new Tr,this._eventsCount=0),this};Vt.prototype.off=Vt.prototype.removeListener;Vt.prototype.addListener=Vt.prototype.on;Vt.prefixed=Yt;Vt.EventEmitter=Vt;au=Vt;var Ni={};Ui(Ni,"ConnectionType",()=>Pn);Ui(Ni,"PeerErrorType",()=>Mt);Ui(Ni,"BaseConnectionErrorType",()=>wr);Ui(Ni,"DataConnectionErrorType",()=>Cr);Ui(Ni,"SerializationType",()=>Ps);Ui(Ni,"SocketEventType",()=>Rn);Ui(Ni,"ServerMessageType",()=>Nt);var Pn;(function(i){i.Data="data",i.Media="media"})(Pn||(Pn={}));var Mt;(function(i){i.BrowserIncompatible="browser-incompatible",i.Disconnected="disconnected",i.InvalidID="invalid-id",i.InvalidKey="invalid-key",i.Network="network",i.PeerUnavailable="peer-unavailable",i.SslUnavailable="ssl-unavailable",i.ServerError="server-error",i.SocketError="socket-error",i.SocketClosed="socket-closed",i.UnavailableID="unavailable-id",i.WebRTC="webrtc"})(Mt||(Mt={}));var wr;(function(i){i.NegotiationFailed="negotiation-failed",i.ConnectionClosed="connection-closed"})(wr||(wr={}));var Cr;(function(i){i.NotOpenYet="not-open-yet",i.MessageToBig="message-too-big"})(Cr||(Cr={}));var Ps;(function(i){i.Binary="binary",i.BinaryUTF8="binary-utf8",i.JSON="json",i.None="raw"})(Ps||(Ps={}));var Rn;(function(i){i.Message="message",i.Disconnected="disconnected",i.Error="error",i.Close="close"})(Rn||(Rn={}));var Nt;(function(i){i.Heartbeat="HEARTBEAT",i.Candidate="CANDIDATE",i.Offer="OFFER",i.Answer="ANSWER",i.Open="OPEN",i.Error="ERROR",i.IdTaken="ID-TAKEN",i.InvalidKey="INVALID-KEY",i.Leave="LEAVE",i.Expire="EXPIRE"})(Nt||(Nt={}));var cu={};cu=JSON.parse('{"name":"peerjs","version":"1.5.4","keywords":["peerjs","webrtc","p2p","rtc"],"description":"PeerJS client","homepage":"https://peerjs.com","bugs":{"url":"https://github.com/peers/peerjs/issues"},"repository":{"type":"git","url":"https://github.com/peers/peerjs"},"license":"MIT","contributors":["Michelle Bu <michelle@michellebu.com>","afrokick <devbyru@gmail.com>","ericz <really.ez@gmail.com>","Jairo <kidandcat@gmail.com>","Jonas Gloning <34194370+jonasgloning@users.noreply.github.com>","Jairo Caro-Accino Viciana <jairo@galax.be>","Carlos Caballero <carlos.caballero.gonzalez@gmail.com>","hc <hheennrryy@gmail.com>","Muhammad Asif <capripio@gmail.com>","PrashoonB <prashoonbhattacharjee@gmail.com>","Harsh Bardhan Mishra <47351025+HarshCasper@users.noreply.github.com>","akotynski <aleksanderkotbury@gmail.com>","lmb <i@lmb.io>","Jairooo <jairocaro@msn.com>","Moritz St\xFCckler <moritz.stueckler@gmail.com>","Simon <crydotsnakegithub@gmail.com>","Denis Lukov <denismassters@gmail.com>","Philipp Hancke <fippo@andyet.net>","Hans Oksendahl <hansoksendahl@gmail.com>","Jess <jessachandler@gmail.com>","khankuan <khankuan@gmail.com>","DUODVK <kurmanov.work@gmail.com>","XiZhao <kwang1imsa@gmail.com>","Matthias Lohr <matthias@lohr.me>","=frank tree <=frnktrb@googlemail.com>","Andre Eckardt <aeckardt@outlook.com>","Chris Cowan <agentme49@gmail.com>","Alex Chuev <alex@chuev.com>","alxnull <alxnull@e.mail.de>","Yemel Jardi <angel.jardi@gmail.com>","Ben Parnell <benjaminparnell.94@gmail.com>","Benny Lichtner <bennlich@gmail.com>","fresheneesz <bitetrudpublic@gmail.com>","bob.barstead@exaptive.com <bob.barstead@exaptive.com>","chandika <chandika@gmail.com>","emersion <contact@emersion.fr>","Christopher Van <cvan@users.noreply.github.com>","eddieherm <edhermoso@gmail.com>","Eduardo Pinho <enet4mikeenet@gmail.com>","Evandro Zanatta <ezanatta@tray.net.br>","Gardner Bickford <gardner@users.noreply.github.com>","Gian Luca <gianluca.cecchi@cynny.com>","PatrickJS <github@gdi2290.com>","jonnyf <github@jonathanfoss.co.uk>","Hizkia Felix <hizkifw@gmail.com>","Hristo Oskov <hristo.oskov@gmail.com>","Isaac Madwed <i.madwed@gmail.com>","Ilya Konanykhin <ilya.konanykhin@gmail.com>","jasonbarry <jasbarry@me.com>","Jonathan Burke <jonathan.burke.1311@googlemail.com>","Josh Hamit <josh.hamit@gmail.com>","Jordan Austin <jrax86@gmail.com>","Joel Wetzell <jwetzell@yahoo.com>","xizhao <kevin.wang@cloudera.com>","Alberto Torres <kungfoobar@gmail.com>","Jonathan Mayol <mayoljonathan@gmail.com>","Jefferson Felix <me@jsfelix.dev>","Rolf Erik Lekang <me@rolflekang.com>","Kevin Mai-Husan Chia <mhchia@users.noreply.github.com>","Pepijn de Vos <pepijndevos@gmail.com>","JooYoung <qkdlql@naver.com>","Tobias Speicher <rootcommander@gmail.com>","Steve Blaurock <sblaurock@gmail.com>","Kyrylo Shegeda <shegeda@ualberta.ca>","Diwank Singh Tomer <singh@diwank.name>","So\u0308ren Balko <Soeren.Balko@gmail.com>","Arpit Solanki <solankiarpit1997@gmail.com>","Yuki Ito <yuki@gnnk.net>","Artur Zayats <zag2art@gmail.com>"],"funding":{"type":"opencollective","url":"https://opencollective.com/peer"},"collective":{"type":"opencollective","url":"https://opencollective.com/peer"},"files":["dist/*"],"sideEffects":["lib/global.ts","lib/supports.ts"],"main":"dist/bundler.cjs","module":"dist/bundler.mjs","browser-minified":"dist/peerjs.min.js","browser-unminified":"dist/peerjs.js","browser-minified-msgpack":"dist/serializer.msgpack.mjs","types":"dist/types.d.ts","engines":{"node":">= 14"},"targets":{"types":{"source":"lib/exports.ts"},"main":{"source":"lib/exports.ts","sourceMap":{"inlineSources":true}},"module":{"source":"lib/exports.ts","includeNodeModules":["eventemitter3"],"sourceMap":{"inlineSources":true}},"browser-minified":{"context":"browser","outputFormat":"global","optimize":true,"engines":{"browsers":"chrome >= 83, edge >= 83, firefox >= 80, safari >= 15"},"source":"lib/global.ts"},"browser-unminified":{"context":"browser","outputFormat":"global","optimize":false,"engines":{"browsers":"chrome >= 83, edge >= 83, firefox >= 80, safari >= 15"},"source":"lib/global.ts"},"browser-minified-msgpack":{"context":"browser","outputFormat":"esmodule","isLibrary":true,"optimize":true,"engines":{"browsers":"chrome >= 83, edge >= 83, firefox >= 102, safari >= 15"},"source":"lib/dataconnection/StreamConnection/MsgPack.ts"}},"scripts":{"contributors":"git-authors-cli --print=false && prettier --write package.json && git add package.json package-lock.json && git commit -m \\"chore(contributors): update and sort contributors list\\"","check":"tsc --noEmit && tsc -p e2e/tsconfig.json --noEmit","watch":"parcel watch","build":"rm -rf dist && parcel build","prepublishOnly":"npm run build","test":"jest","test:watch":"jest --watch","coverage":"jest --coverage --collectCoverageFrom=\\"./lib/**\\"","format":"prettier --write .","format:check":"prettier --check .","semantic-release":"semantic-release","e2e":"wdio run e2e/wdio.local.conf.ts","e2e:bstack":"wdio run e2e/wdio.bstack.conf.ts"},"devDependencies":{"@parcel/config-default":"^2.9.3","@parcel/packager-ts":"^2.9.3","@parcel/transformer-typescript-tsc":"^2.9.3","@parcel/transformer-typescript-types":"^2.9.3","@semantic-release/changelog":"^6.0.1","@semantic-release/git":"^10.0.1","@swc/core":"^1.3.27","@swc/jest":"^0.2.24","@types/jasmine":"^4.3.4","@wdio/browserstack-service":"^8.11.2","@wdio/cli":"^8.11.2","@wdio/globals":"^8.11.2","@wdio/jasmine-framework":"^8.11.2","@wdio/local-runner":"^8.11.2","@wdio/spec-reporter":"^8.11.2","@wdio/types":"^8.10.4","http-server":"^14.1.1","jest":"^29.3.1","jest-environment-jsdom":"^29.3.1","mock-socket":"^9.0.0","parcel":"^2.9.3","prettier":"^3.0.0","semantic-release":"^21.0.0","ts-node":"^10.9.1","typescript":"^5.0.0","wdio-geckodriver-service":"^5.0.1"},"dependencies":{"@msgpack/msgpack":"^2.8.0","eventemitter3":"^4.0.7","peerjs-js-binarypack":"^2.1.0","webrtc-adapter":"^9.0.0"},"alias":{"process":false,"buffer":false}}');var jh=class extends au.EventEmitter{constructor(e,t,n,s,r,o=5e3){super(),this.pingInterval=o,this._disconnected=!0,this._messagesQueue=[];let a=e?"wss://":"ws://";this._baseUrl=a+t+":"+n+s+"peerjs?key="+r}start(e,t){this._id=e;let n=`${this._baseUrl}&id=${e}&token=${t}`;this._socket||!this._disconnected||(this._socket=new WebSocket(n+"&version="+cu.version),this._disconnected=!1,this._socket.onmessage=s=>{let r;try{r=JSON.parse(s.data),Ie.log("Server message received:",r)}catch{Ie.log("Invalid server message",s.data);return}this.emit(Rn.Message,r)},this._socket.onclose=s=>{this._disconnected||(Ie.log("Socket closed.",s),this._cleanup(),this._disconnected=!0,this.emit(Rn.Disconnected))},this._socket.onopen=()=>{this._disconnected||(this._sendQueuedMessages(),Ie.log("Socket open"),this._scheduleHeartbeat())})}_scheduleHeartbeat(){this._wsPingTimer=setTimeout(()=>{this._sendHeartbeat()},this.pingInterval)}_sendHeartbeat(){if(!this._wsOpen()){Ie.log("Cannot send heartbeat, because socket closed");return}let e=JSON.stringify({type:Nt.Heartbeat});this._socket.send(e),this._scheduleHeartbeat()}_wsOpen(){return!!this._socket&&this._socket.readyState===1}_sendQueuedMessages(){let e=[...this._messagesQueue];this._messagesQueue=[];for(let t of e)this.send(t)}send(e){if(this._disconnected)return;if(!this._id){this._messagesQueue.push(e);return}if(!e.type){this.emit(Rn.Error,"Invalid message");return}if(!this._wsOpen())return;let t=JSON.stringify(e);this._socket.send(t)}close(){this._disconnected||(this._cleanup(),this._disconnected=!0)}_cleanup(){this._socket&&(this._socket.onopen=this._socket.onmessage=this._socket.onclose=null,this._socket.close(),this._socket=void 0),clearTimeout(this._wsPingTimer)}},Ea=class{constructor(e){this.connection=e}startConnection(e){let t=this._startPeerConnection();if(this.connection.peerConnection=t,this.connection.type===Pn.Media&&e._stream&&this._addTracksToConnection(e._stream,t),e.originator){let n=this.connection,s={ordered:!!e.reliable},r=t.createDataChannel(n.label,s);n._initializeDataChannel(r),this._makeOffer()}else this.handleSDP("OFFER",e.sdp)}_startPeerConnection(){Ie.log("Creating RTCPeerConnection.");let e=new RTCPeerConnection(this.connection.provider.options.config);return this._setupListeners(e),e}_setupListeners(e){let t=this.connection.peer,n=this.connection.connectionId,s=this.connection.type,r=this.connection.provider;Ie.log("Listening for ICE candidates."),e.onicecandidate=o=>{!o.candidate||!o.candidate.candidate||(Ie.log(`Received ICE candidates for ${t}:`,o.candidate),r.socket.send({type:Nt.Candidate,payload:{candidate:o.candidate,type:s,connectionId:n},dst:t}))},e.oniceconnectionstatechange=()=>{switch(e.iceConnectionState){case"failed":Ie.log("iceConnectionState is failed, closing connections to "+t),this.connection.emitError(wr.NegotiationFailed,"Negotiation of connection to "+t+" failed."),this.connection.close();break;case"closed":Ie.log("iceConnectionState is closed, closing connections to "+t),this.connection.emitError(wr.ConnectionClosed,"Connection to "+t+" closed."),this.connection.close();break;case"disconnected":Ie.log("iceConnectionState changed to disconnected on the connection with "+t);break;case"completed":e.onicecandidate=()=>{};break}this.connection.emit("iceStateChanged",e.iceConnectionState)},Ie.log("Listening for data channel"),e.ondatachannel=o=>{Ie.log("Received data channel");let a=o.channel;r.getConnection(t,n)._initializeDataChannel(a)},Ie.log("Listening for remote stream"),e.ontrack=o=>{Ie.log("Received remote stream");let a=o.streams[0],c=r.getConnection(t,n);if(c.type===Pn.Media){let l=c;this._addStreamToMediaConnection(a,l)}}}cleanup(){Ie.log("Cleaning up PeerConnection to "+this.connection.peer);let e=this.connection.peerConnection;if(!e)return;this.connection.peerConnection=null,e.onicecandidate=e.oniceconnectionstatechange=e.ondatachannel=e.ontrack=()=>{};let t=e.signalingState!=="closed",n=!1,s=this.connection.dataChannel;s&&(n=!!s.readyState&&s.readyState!=="closed"),(t||n)&&e.close()}async _makeOffer(){let e=this.connection.peerConnection,t=this.connection.provider;try{let n=await e.createOffer(this.connection.options.constraints);Ie.log("Created offer."),this.connection.options.sdpTransform&&typeof this.connection.options.sdpTransform=="function"&&(n.sdp=this.connection.options.sdpTransform(n.sdp)||n.sdp);try{await e.setLocalDescription(n),Ie.log("Set localDescription:",n,`for:${this.connection.peer}`);let s={sdp:n,type:this.connection.type,connectionId:this.connection.connectionId,metadata:this.connection.metadata};if(this.connection.type===Pn.Data){let r=this.connection;s={...s,label:r.label,reliable:r.reliable,serialization:r.serialization}}t.socket.send({type:Nt.Offer,payload:s,dst:this.connection.peer})}catch(s){s!="OperationError: Failed to set local offer sdp: Called in wrong state: kHaveRemoteOffer"&&(t.emitError(Mt.WebRTC,s),Ie.log("Failed to setLocalDescription, ",s))}}catch(n){t.emitError(Mt.WebRTC,n),Ie.log("Failed to createOffer, ",n)}}async _makeAnswer(){let e=this.connection.peerConnection,t=this.connection.provider;try{let n=await e.createAnswer();Ie.log("Created answer."),this.connection.options.sdpTransform&&typeof this.connection.options.sdpTransform=="function"&&(n.sdp=this.connection.options.sdpTransform(n.sdp)||n.sdp);try{await e.setLocalDescription(n),Ie.log("Set localDescription:",n,`for:${this.connection.peer}`),t.socket.send({type:Nt.Answer,payload:{sdp:n,type:this.connection.type,connectionId:this.connection.connectionId},dst:this.connection.peer})}catch(s){t.emitError(Mt.WebRTC,s),Ie.log("Failed to setLocalDescription, ",s)}}catch(n){t.emitError(Mt.WebRTC,n),Ie.log("Failed to create answer, ",n)}}async handleSDP(e,t){t=new RTCSessionDescription(t);let n=this.connection.peerConnection,s=this.connection.provider;Ie.log("Setting remote description",t);let r=this;try{await n.setRemoteDescription(t),Ie.log(`Set remoteDescription:${e} for:${this.connection.peer}`),e==="OFFER"&&await r._makeAnswer()}catch(o){s.emitError(Mt.WebRTC,o),Ie.log("Failed to setRemoteDescription, ",o)}}async handleCandidate(e){Ie.log("handleCandidate:",e);try{await this.connection.peerConnection.addIceCandidate(e),Ie.log(`Added ICE candidate for:${this.connection.peer}`)}catch(t){this.connection.provider.emitError(Mt.WebRTC,t),Ie.log("Failed to handleCandidate, ",t)}}_addTracksToConnection(e,t){if(Ie.log(`add tracks from stream ${e.id} to peer connection`),!t.addTrack)return Ie.error("Your browser does't support RTCPeerConnection#addTrack. Ignored.");e.getTracks().forEach(n=>{t.addTrack(n,e)})}_addStreamToMediaConnection(e,t){Ie.log(`add stream ${e.id} to media connection ${t.connectionId}`),t.addStream(e)}},Ta=class extends au.EventEmitter{emitError(e,t){Ie.error("Error:",t),this.emit("error",new Kh(`${e}`,t))}},Kh=class extends Error{constructor(e,t){typeof t=="string"?super(t):(super(),Object.assign(this,t)),this.type=e}},wa=class extends Ta{get open(){return this._open}constructor(e,t,n){super(),this.peer=e,this.provider=t,this.options=n,this._open=!1,this.metadata=n.metadata}},iu,Sr=class Sr extends wa{get type(){return Pn.Media}get localStream(){return this._localStream}get remoteStream(){return this._remoteStream}constructor(e,t,n){super(e,t,n),this._localStream=this.options._stream,this.connectionId=this.options.connectionId||Sr.ID_PREFIX+Zt.randomToken(),this._negotiator=new Ea(this),this._localStream&&this._negotiator.startConnection({_stream:this._localStream,originator:!0})}_initializeDataChannel(e){this.dataChannel=e,this.dataChannel.onopen=()=>{Ie.log(`DC#${this.connectionId} dc connection success`),this.emit("willCloseOnRemote")},this.dataChannel.onclose=()=>{Ie.log(`DC#${this.connectionId} dc closed for:`,this.peer),this.close()}}addStream(e){Ie.log("Receiving stream",e),this._remoteStream=e,super.emit("stream",e)}handleMessage(e){let t=e.type,n=e.payload;switch(e.type){case Nt.Answer:this._negotiator.handleSDP(t,n.sdp),this._open=!0;break;case Nt.Candidate:this._negotiator.handleCandidate(n.candidate);break;default:Ie.warn(`Unrecognized message type:${t} from peer:${this.peer}`);break}}answer(e,t={}){if(this._localStream){Ie.warn("Local stream already exists on this MediaConnection. Are you answering a call twice?");return}this._localStream=e,t&&t.sdpTransform&&(this.options.sdpTransform=t.sdpTransform),this._negotiator.startConnection({...this.options._payload,_stream:e});let n=this.provider._getMessages(this.connectionId);for(let s of n)this.handleMessage(s);this._open=!0}close(){this._negotiator&&(this._negotiator.cleanup(),this._negotiator=null),this._localStream=null,this._remoteStream=null,this.provider&&(this.provider._removeConnection(this),this.provider=null),this.options&&this.options._stream&&(this.options._stream=null),this.open&&(this._open=!1,super.emit("close"))}};iu=new WeakMap,Is(Sr,iu,Sr.ID_PREFIX="mc_");var Ca=Sr,Qh=class{constructor(e){this._options=e}_buildRequest(e){let t=this._options.secure?"https":"http",{host:n,port:s,path:r,key:o}=this._options,a=new URL(`${t}://${n}:${s}${r}${o}/${e}`);return a.searchParams.set("ts",`${Date.now()}${Math.random()}`),a.searchParams.set("version",cu.version),fetch(a.href,{referrerPolicy:this._options.referrerPolicy})}async retrieveId(){try{let e=await this._buildRequest("id");if(e.status!==200)throw new Error(`Error. Status:${e.status}`);return e.text()}catch(e){Ie.error("Error retrieving ID",e);let t="";throw this._options.path==="/"&&this._options.host!==Zt.CLOUD_HOST&&(t=" If you passed in a `path` to your self-hosted PeerServer, you'll also need to pass in that same path when creating a new Peer."),new Error("Could not get an ID from the server."+t)}}async listAllPeers(){try{let e=await this._buildRequest("peers");if(e.status!==200){if(e.status===401){let t="";throw this._options.host===Zt.CLOUD_HOST?t="It looks like you're using the cloud server. You can email team@peerjs.com to enable peer listing for your API key.":t="You need to enable `allow_discovery` on your self-hosted PeerServer to use this feature.",new Error("It doesn't look like you have permission to list peers IDs. "+t)}throw new Error(`Error. Status:${e.status}`)}return e.json()}catch(e){throw Ie.error("Error retrieving list peers",e),new Error("Could not get list peers from the server."+e)}}},su,ru,Di=class Di extends wa{get type(){return Pn.Data}constructor(e,t,n){super(e,t,n),this.connectionId=this.options.connectionId||Di.ID_PREFIX+zf(),this.label=this.options.label||this.connectionId,this.reliable=!!this.options.reliable,this._negotiator=new Ea(this),this._negotiator.startConnection(this.options._payload||{originator:!0,reliable:this.reliable})}_initializeDataChannel(e){this.dataChannel=e,this.dataChannel.onopen=()=>{Ie.log(`DC#${this.connectionId} dc connection success`),this._open=!0,this.emit("open")},this.dataChannel.onmessage=t=>{Ie.log(`DC#${this.connectionId} dc onmessage:`,t.data)},this.dataChannel.onclose=()=>{Ie.log(`DC#${this.connectionId} dc closed for:`,this.peer),this.close()}}close(e){if(e!=null&&e.flush){this.send({__peerData:{type:"close"}});return}this._negotiator&&(this._negotiator.cleanup(),this._negotiator=null),this.provider&&(this.provider._removeConnection(this),this.provider=null),this.dataChannel&&(this.dataChannel.onopen=null,this.dataChannel.onmessage=null,this.dataChannel.onclose=null,this.dataChannel=null),this.open&&(this._open=!1,super.emit("close"))}send(e,t=!1){if(!this.open){this.emitError(Cr.NotOpenYet,"Connection is not open. You should listen for the `open` event before sending messages.");return}return this._send(e,t)}async handleMessage(e){let t=e.payload;switch(e.type){case Nt.Answer:await this._negotiator.handleSDP(e.type,t.sdp);break;case Nt.Candidate:await this._negotiator.handleCandidate(t.candidate);break;default:Ie.warn("Unrecognized message type:",e.type,"from peer:",this.peer);break}}};su=new WeakMap,ru=new WeakMap,Is(Di,su,Di.ID_PREFIX="dc_"),Is(Di,ru,Di.MAX_BUFFERED_AMOUNT=8388608);var Aa=Di,Ar=class extends Aa{get bufferSize(){return this._bufferSize}_initializeDataChannel(e){super._initializeDataChannel(e),this.dataChannel.binaryType="arraybuffer",this.dataChannel.addEventListener("message",t=>this._handleDataMessage(t))}_bufferedSend(e){(this._buffering||!this._trySend(e))&&(this._buffer.push(e),this._bufferSize=this._buffer.length)}_trySend(e){if(!this.open)return!1;if(this.dataChannel.bufferedAmount>Aa.MAX_BUFFERED_AMOUNT)return this._buffering=!0,setTimeout(()=>{this._buffering=!1,this._tryBuffer()},50),!1;try{this.dataChannel.send(e)}catch(t){return Ie.error(`DC#:${this.connectionId} Error when sending:`,t),this._buffering=!0,this.close(),!1}return!0}_tryBuffer(){if(!this.open||this._buffer.length===0)return;let e=this._buffer[0];this._trySend(e)&&(this._buffer.shift(),this._bufferSize=this._buffer.length,this._tryBuffer())}close(e){if(e!=null&&e.flush){this.send({__peerData:{type:"close"}});return}this._buffer=[],this._bufferSize=0,super.close()}constructor(...e){super(...e),this._buffer=[],this._bufferSize=0,this._buffering=!1}},br=class extends Ar{close(e){super.close(e),this._chunkedData={}}constructor(e,t,n){super(e,t,n),this.chunker=new Sa,this.serialization=Ps.Binary,this._chunkedData={}}_handleDataMessage({data:e}){let t=mh(e),n=t.__peerData;if(n){if(n.type==="close"){this.close();return}this._handleChunk(t);return}this.emit("data",t)}_handleChunk(e){let t=e.__peerData,n=this._chunkedData[t]||{data:[],count:0,total:e.total};if(n.data[e.n]=new Uint8Array(e.data),n.count++,this._chunkedData[t]=n,n.total===n.count){delete this._chunkedData[t];let s=Qx(n.data);this._handleDataMessage({data:s})}}_send(e,t){let n=gh(e);if(n instanceof Promise)return this._send_blob(n);if(!t&&n.byteLength>this.chunker.chunkedMTU){this._sendChunks(n);return}this._bufferedSend(n)}async _send_blob(e){let t=await e;if(t.byteLength>this.chunker.chunkedMTU){this._sendChunks(t);return}this._bufferedSend(t)}_sendChunks(e){let t=this.chunker.chunk(e);Ie.log(`DC#${this.connectionId} Try to send ${t.length} chunks...`);for(let n of t)this.send(n,!0)}},eu=class extends Ar{_handleDataMessage({data:e}){super.emit("data",e)}_send(e,t){this._bufferedSend(e)}constructor(...e){super(...e),this.serialization=Ps.None}},tu=class extends Ar{_handleDataMessage({data:e}){let t=this.parse(this.decoder.decode(e)),n=t.__peerData;if(n&&n.type==="close"){this.close();return}this.emit("data",t)}_send(e,t){let n=this.encoder.encode(this.stringify(e));if(n.byteLength>=Zt.chunkedMTU){this.emitError(Cr.MessageToBig,"Message too big for JSON channel");return}this._bufferedSend(n)}constructor(...e){super(...e),this.serialization=Ps.JSON,this.encoder=new TextEncoder,this.decoder=new TextDecoder,this.stringify=JSON.stringify,this.parse=JSON.parse}};var ou,Er=class Er extends Ta{get id(){return this._id}get options(){return this._options}get open(){return this._open}get socket(){return this._socket}get connections(){let e=Object.create(null);for(let[t,n]of this._connections)e[t]=n;return e}get destroyed(){return this._destroyed}get disconnected(){return this._disconnected}constructor(e,t){super(),this._serializers={raw:eu,json:tu,binary:br,"binary-utf8":br,default:br},this._id=null,this._lastServerId=null,this._destroyed=!1,this._disconnected=!1,this._open=!1,this._connections=new Map,this._lostMessages=new Map;let n;if(e&&e.constructor==Object?t=e:e&&(n=e.toString()),t={debug:0,host:Zt.CLOUD_HOST,port:Zt.CLOUD_PORT,path:"/",key:Er.DEFAULT_KEY,token:Zt.randomToken(),config:Zt.defaultConfig,referrerPolicy:"strict-origin-when-cross-origin",serializers:{},...t},this._options=t,this._serializers={...this._serializers,...this.options.serializers},this._options.host==="/"&&(this._options.host=window.location.hostname),this._options.path&&(this._options.path[0]!=="/"&&(this._options.path="/"+this._options.path),this._options.path[this._options.path.length-1]!=="/"&&(this._options.path+="/")),this._options.secure===void 0&&this._options.host!==Zt.CLOUD_HOST?this._options.secure=Zt.isSecure():this._options.host==Zt.CLOUD_HOST&&(this._options.secure=!0),this._options.logFunction&&Ie.setLogFunction(this._options.logFunction),Ie.logLevel=this._options.debug||0,this._api=new Qh(t),this._socket=this._createServerConnection(),!Zt.supports.audioVideo&&!Zt.supports.data){this._delayedAbort(Mt.BrowserIncompatible,"The current browser does not support WebRTC");return}if(n&&!Zt.validateId(n)){this._delayedAbort(Mt.InvalidID,`ID "${n}" is invalid`);return}n?this._initialize(n):this._api.retrieveId().then(s=>this._initialize(s)).catch(s=>this._abort(Mt.ServerError,s))}_createServerConnection(){let e=new jh(this._options.secure,this._options.host,this._options.port,this._options.path,this._options.key,this._options.pingInterval);return e.on(Rn.Message,t=>{this._handleMessage(t)}),e.on(Rn.Error,t=>{this._abort(Mt.SocketError,t)}),e.on(Rn.Disconnected,()=>{this.disconnected||(this.emitError(Mt.Network,"Lost connection to server."),this.disconnect())}),e.on(Rn.Close,()=>{this.disconnected||this._abort(Mt.SocketClosed,"Underlying socket is already closed.")}),e}_initialize(e){this._id=e,this.socket.start(e,this._options.token)}_handleMessage(e){let t=e.type,n=e.payload,s=e.src;switch(t){case Nt.Open:this._lastServerId=this.id,this._open=!0,this.emit("open",this.id);break;case Nt.Error:this._abort(Mt.ServerError,n.msg);break;case Nt.IdTaken:this._abort(Mt.UnavailableID,`ID "${this.id}" is taken`);break;case Nt.InvalidKey:this._abort(Mt.InvalidKey,`API KEY "${this._options.key}" is invalid`);break;case Nt.Leave:Ie.log(`Received leave message from ${s}`),this._cleanupPeer(s),this._connections.delete(s);break;case Nt.Expire:this.emitError(Mt.PeerUnavailable,`Could not connect to peer ${s}`);break;case Nt.Offer:{let r=n.connectionId,o=this.getConnection(s,r);if(o&&(o.close(),Ie.warn(`Offer received for existing Connection ID:${r}`)),n.type===Pn.Media){let c=new Ca(s,this,{connectionId:r,_payload:n,metadata:n.metadata});o=c,this._addConnection(s,o),this.emit("call",c)}else if(n.type===Pn.Data){let c=new this._serializers[n.serialization](s,this,{connectionId:r,_payload:n,metadata:n.metadata,label:n.label,serialization:n.serialization,reliable:n.reliable});o=c,this._addConnection(s,o),this.emit("connection",c)}else{Ie.warn(`Received malformed connection type:${n.type}`);return}let a=this._getMessages(r);for(let c of a)o.handleMessage(c);break}default:{if(!n){Ie.warn(`You received a malformed message from ${s} of type ${t}`);return}let r=n.connectionId,o=this.getConnection(s,r);o&&o.peerConnection?o.handleMessage(e):r?this._storeMessage(r,e):Ie.warn("You received an unrecognized message:",e);break}}}_storeMessage(e,t){this._lostMessages.has(e)||this._lostMessages.set(e,[]),this._lostMessages.get(e).push(t)}_getMessages(e){let t=this._lostMessages.get(e);return t?(this._lostMessages.delete(e),t):[]}connect(e,t={}){if(t={serialization:"default",...t},this.disconnected){Ie.warn("You cannot connect to a new Peer because you called .disconnect() on this Peer and ended your connection with the server. You can create a new Peer to reconnect, or call reconnect on this peer if you believe its ID to still be available."),this.emitError(Mt.Disconnected,"Cannot connect to new Peer after disconnecting from server.");return}let n=new this._serializers[t.serialization](e,this,t);return this._addConnection(e,n),n}call(e,t,n={}){if(this.disconnected){Ie.warn("You cannot connect to a new Peer because you called .disconnect() on this Peer and ended your connection with the server. You can create a new Peer to reconnect."),this.emitError(Mt.Disconnected,"Cannot connect to new Peer after disconnecting from server.");return}if(!t){Ie.error("To call a peer, you must provide a stream from your browser's `getUserMedia`.");return}let s=new Ca(e,this,{...n,_stream:t});return this._addConnection(e,s),s}_addConnection(e,t){Ie.log(`add connection ${t.type}:${t.connectionId} to peerId:${e}`),this._connections.has(e)||this._connections.set(e,[]),this._connections.get(e).push(t)}_removeConnection(e){let t=this._connections.get(e.peer);if(t){let n=t.indexOf(e);n!==-1&&t.splice(n,1)}this._lostMessages.delete(e.connectionId)}getConnection(e,t){let n=this._connections.get(e);if(!n)return null;for(let s of n)if(s.connectionId===t)return s;return null}_delayedAbort(e,t){setTimeout(()=>{this._abort(e,t)},0)}_abort(e,t){Ie.error("Aborting!"),this.emitError(e,t),this._lastServerId?this.disconnect():this.destroy()}destroy(){this.destroyed||(Ie.log(`Destroy peer with ID:${this.id}`),this.disconnect(),this._cleanup(),this._destroyed=!0,this.emit("close"))}_cleanup(){for(let e of this._connections.keys())this._cleanupPeer(e),this._connections.delete(e);this.socket.removeAllListeners()}_cleanupPeer(e){let t=this._connections.get(e);if(t)for(let n of t)n.close()}disconnect(){if(this.disconnected)return;let e=this.id;Ie.log(`Disconnect peer with ID:${e}`),this._disconnected=!0,this._open=!1,this.socket.close(),this._lastServerId=e,this._id=null,this.emit("disconnected",e)}reconnect(){if(this.disconnected&&!this.destroyed)Ie.log(`Attempting reconnection to server with ID ${this._lastServerId}`),this._disconnected=!1,this._initialize(this._lastServerId);else{if(this.destroyed)throw new Error("This peer cannot reconnect to the server. It has already been destroyed.");if(!this.disconnected&&!this.open)Ie.error("In a hurry? We're still trying to make the initial connection!");else throw new Error(`Peer ${this.id} cannot reconnect because it is not disconnected from the server!`)}}listAllPeers(e=t=>{}){this._api.listAllPeers().then(t=>e(t)).catch(t=>this._abort(Mt.ServerError,t))}};ou=new WeakMap,Is(Er,ou,Er.DEFAULT_KEY="peerjs");var nu=Er;var lu=nu;var Vf="deniislam-city-room-1",Gf={debug:0,config:{iceServers:[{urls:"stun:stun.l.google.com:19302"},{urls:"stun:global.stun.twilio.com:3478"},{urls:"turn:openrelay.metered.ca:80",username:"openrelayproject",credential:"openrelayproject"},{urls:"turn:openrelay.metered.ca:443",username:"openrelayproject",credential:"openrelayproject"}]}},Ra=class{constructor(){this.peer=null,this.conn=null,this.role="solo",this.connected=!1,this.handlers=new Map,this.micStream=null,this.voiceOn=!1,this.remoteAudio=null,this.call=null,this.lastSent=0,this.pending=[]}on(e,t){return this.handlers.has(e)||this.handlers.set(e,[]),this.handlers.get(e).push(t),this}emit(e,t){(this.handlers.get(e)||[]).forEach(n=>{try{n(t)}catch(s){console.warn(s)}})}status(e,t="info"){this.emit("status",{text:e,kind:t})}async connect(){this.status("\u041F\u043E\u0434\u043A\u043B\u044E\u0447\u0435\u043D\u0438\u0435 \u043A \u0441\u0435\u0440\u0432\u0435\u0440\u0443\u2026");let t=await new Promise(s=>{let r=!1,o=new lu(Vf,Gf),a=setTimeout(()=>{if(!r){r=!0;try{o.destroy()}catch{}s(null)}},9e3);o.on("open",()=>{r||(r=!0,clearTimeout(a),s(o))}),o.on("error",c=>{if(!r){r=!0,clearTimeout(a);try{o.destroy()}catch{}s({error:(c==null?void 0:c.type)||"error"})}})});if(t&&!t.error)return this.peer=t,this.role="host",this.status("\u041E\u043D\u043B\u0430\u0439\u043D \xB7 \u0432\u044B \u0425\u041E\u0417\u042F\u0418\u041D \u043A\u043E\u043C\u043D\u0430\u0442\u044B \xB7 \u0436\u0434\u0451\u043C 2-\u0433\u043E \u0438\u0433\u0440\u043E\u043A\u0430","ok"),t.on("connection",s=>this._attach(s)),t.on("error",s=>this._onError(s)),this.emit("role",this.role),this.role;if(this.status("\u041A\u043E\u043C\u043D\u0430\u0442\u0430 \u0437\u0430\u043D\u044F\u0442\u0430 \xB7 \u0437\u0430\u0445\u043E\u0434\u0438\u043C \u043A\u0430\u043A \u0438\u0433\u0440\u043E\u043A 2\u2026"),t=await new Promise(s=>{let r=!1,o=new lu(void 0,Gf),a=setTimeout(()=>{if(!r){r=!0;try{o.destroy()}catch{}s(null)}},1e4);o.on("open",()=>{r||(r=!0,clearTimeout(a),s(o))}),o.on("error",c=>{r||(r=!0,clearTimeout(a),s(null))})}),!t)return this.role="solo",this.status("\u0421\u0435\u0440\u0432\u0435\u0440 \u043D\u0435\u0434\u043E\u0441\u0442\u0443\u043F\u0435\u043D \xB7 \u043E\u0434\u0438\u043D\u043E\u0447\u043D\u044B\u0439 \u0440\u0435\u0436\u0438\u043C","warn"),this.emit("role","solo"),"solo";this.peer=t,this.role="client",t.on("error",s=>this._onError(s)),this.emit("role","client"),this.status("\u041F\u043E\u0434\u043A\u043B\u044E\u0447\u0435\u043D\u0438\u0435 \u043A \u043A\u043E\u043C\u043D\u0430\u0442\u0435\u2026");let n=t.connect(Vf,{reliable:!0,serialization:"json"});return this._attach(n),this.role}_attach(e){this.conn=e,e.on("open",()=>{this.connected=!0,this.status("\u0412 \u0441\u0435\u0442\u0438 \xB7 2 \u0438\u0433\u0440\u043E\u043A\u0430 \xB7 \u0433\u043E\u043B\u043E\u0441\u043E\u0432\u043E\u0439 \u0447\u0430\u0442 \u0430\u043A\u0442\u0438\u0432\u0435\u043D","ok"),this.emit("open"),this.pending.forEach(t=>this.send(t)),this.pending=[]}),e.on("data",t=>this.emit("msg",t)),e.on("close",()=>{this.connected=!1,this.status("\u0418\u0433\u0440\u043E\u043A 2 \u043E\u0442\u043A\u043B\u044E\u0447\u0438\u043B\u0441\u044F \xB7 \u0432\u044B \u0432 \u043E\u0434\u0438\u043D\u043E\u0447\u043A\u0443","warn"),this.emit("close")}),e.on("error",t=>console.warn("conn error",t))}_onError(e){let t=(e==null?void 0:e.type)||"error";t==="peer-unavailable"?(this.status("\u0418\u0433\u0440\u043E\u043A 2 \u043D\u0435 \u043D\u0430\u0439\u0434\u0435\u043D \xB7 \u043E\u0434\u0438\u043D\u043E\u0447\u043D\u044B\u0439 \u0440\u0435\u0436\u0438\u043C","warn"),this.emit("close")):(t==="network"||t==="server-error"||t==="socket-error")&&this.status("\u041D\u0435\u0442 \u0441\u0432\u044F\u0437\u0438 \u0441 \u0441\u0435\u0440\u0432\u0435\u0440\u043E\u043C \xB7 \u043E\u0434\u0438\u043D\u043E\u0447\u043D\u044B\u0439 \u0440\u0435\u0436\u0438\u043C","warn")}get remoteId(){var e;return((e=this.conn)==null?void 0:e.peer)||null}send(e){if(this.conn&&this.conn.open)try{this.conn.send(e)}catch{}else(e==null?void 0:e.t)!=="s"&&(this.pending.push(e),this.pending.length>40&&this.pending.shift())}async enableVoice(){var e;try{if(!((e=navigator.mediaDevices)!=null&&e.getUserMedia))throw new Error("no getUserMedia");return this.micStream=await navigator.mediaDevices.getUserMedia({audio:{echoCancellation:!0,noiseSuppression:!0,autoGainControl:!0},video:!1}),this.voiceOn=!0,this.emit("mic",{ok:!0}),this._tryCall(),!0}catch(t){return this.voiceOn=!1,this.emit("mic",{ok:!1,error:(t==null?void 0:t.message)||"denied"}),!1}}_tryCall(){if(!this.peer||!this.voiceOn||!this.conn)return;let e=this.remoteId;if(e){try{if(this.call&&this.call.open)return;let t=this.peer.call(e,this.micStream);t.on("stream",n=>this._playRemote(n)),t.on("error",()=>{}),t.on("close",()=>{}),this.call=t}catch{}this._incomingHooked||(this._incomingHooked=!0,this.peer.on("call",t=>{try{t.answer(this.micStream||void 0),t.on("stream",n=>this._playRemote(n))}catch{}}))}}_playRemote(e){var t,n;this.remoteAudio||(this.remoteAudio=document.createElement("audio"),this.remoteAudio.autoplay=!0,this.remoteAudio.playsInline=!0,this.remoteAudio.style.display="none",document.body.appendChild(this.remoteAudio)),this.remoteAudio.srcObject=e,(n=(t=this.remoteAudio).play)==null||n.call(t).catch(()=>{}),this.emit("voice-stream")}hangup(){var e,t,n,s;try{(e=this.call)==null||e.close()}catch{}try{(t=this.micStream)==null||t.getTracks().forEach(r=>r.stop())}catch{}try{(n=this.conn)==null||n.close()}catch{}try{(s=this.peer)==null||s.destroy()}catch{}}};var du=document.getElementById("c"),pt=new la,hu=new Ra,Et=new ua(du,pt,hu),Pa=i=>new Promise(e=>setTimeout(e,i));function sv(){try{let i=document.createElement("canvas");return i.getContext("webgl2")||i.getContext("webgl")?null:"WebGL \u043D\u0435 \u043F\u043E\u0434\u0434\u0435\u0440\u0436\u0438\u0432\u0430\u0435\u0442\u0441\u044F"}catch(i){return String(i)}}async function rv(){try{if(sv()){document.getElementById("bootTxt").innerHTML="\u041D\u0435 \u0443\u0434\u0430\u043B\u043E\u0441\u044C \u0437\u0430\u043F\u0443\u0441\u0442\u0438\u0442\u044C 3D.<br>\u041E\u0431\u043D\u043E\u0432\u0438 \xABAndroid System WebView\xBB (\u0438\u043B\u0438 Chrome) \u0432 Play \u041C\u0430\u0440\u043A\u0435\u0442\u0435 \u0438 \u043E\u0442\u043A\u0440\u043E\u0439 \u0438\u0433\u0440\u0443 \u0441\u043D\u043E\u0432\u0430.";return}pt.setLoading(8,"\u0418\u043D\u0438\u0446\u0438\u0430\u043B\u0438\u0437\u0430\u0446\u0438\u044F \u0434\u0432\u0438\u0436\u043A\u0430\u2026"),await Pa(60),await Et.init(),pt.setLoading(55,"\u0421\u0442\u0440\u043E\u0438\u043C \u0433\u043E\u0440\u043E\u0434: \u0431\u0430\u043D\u043A, \u043C\u0430\u0433\u0430\u0437\u0438\u043D, \u0443\u043B\u0438\u0446\u044B\u2026"),await Pa(120),pt.setLoading(82,"\u0420\u0430\u0441\u0441\u0442\u0430\u0432\u043B\u044F\u0435\u043C \u0436\u0438\u0442\u0435\u043B\u0435\u0439\u2026"),await Pa(160),pt.setLoading(100,"\u0413\u043E\u0442\u043E\u0432\u043E"),await Pa(260),pt.showMenu(),ov()}catch(i){console.error(i);let e=document.getElementById("bootTxt");e&&(e.innerHTML="\u041E\u0448\u0438\u0431\u043A\u0430 \u0437\u0430\u043F\u0443\u0441\u043A\u0430: "+((i==null?void 0:i.message)||i)+"<br>\u041F\u043E\u043F\u0440\u043E\u0431\u0443\u0439 \u043E\u0431\u043D\u043E\u0432\u0438\u0442\u044C Android System WebView.")}}function ov(){document.querySelectorAll("#menu [data-act]").forEach(i=>{i.onclick=()=>{let e=i.dataset.act;Et.sound.init(),Et.sound.resume(),e==="play"?av():e==="controls"?pt.showModal({title:"\u0423\u041F\u0420\u0410\u0412\u041B\u0415\u041D\u0418\u0415",sub:"\u041F\u041A \u0438 \u0442\u0435\u043B\u0435\u0444\u043E\u043D",body:pt.controlsHTML(),foot:uu("\u041F\u041E\u041D\u042F\u0422\u041D\u041E")}):e==="about"?pt.showModal({title:"\u041E\u0411 \u0418\u0413\u0420\u0415",sub:"DENI ISLAM \xB7 \u043A\u0440\u0438\u043C\u0438\u043D\u0430\u043B\u044C\u043D\u0430\u044F \u043F\u0435\u0441\u043E\u0447\u043D\u0438\u0446\u0430 \u043D\u0430 \u0434\u0432\u043E\u0438\u0445",body:pt.aboutHTML(),foot:uu("\u0417\u0410\u041A\u0420\u042B\u0422\u042C")}):e==="reset"&&confirm("\u0421\u0431\u0440\u043E\u0441\u0438\u0442\u044C \u0441\u043E\u0445\u0440\u0430\u043D\u0435\u043D\u0438\u0435? \u0414\u0435\u043D\u044C\u0433\u0438, \u0432\u0435\u0449\u0438 \u0432 \u0448\u043A\u0430\u0444\u0430\u0445 \u0438 \u043F\u0440\u043E\u0433\u0440\u0435\u0441\u0441 \u043F\u0440\u043E\u043F\u0430\u0434\u0443\u0442.")&&(Tf(),pt.toast("\u0421\u043E\u0445\u0440\u0430\u043D\u0435\u043D\u0438\u0435 \u0441\u0431\u0440\u043E\u0448\u0435\u043D\u043E",""))}})}function uu(i){let e=document.createElement("button");return e.className="btn",e.textContent=i,e.onclick=()=>pt.hideModal(),e}var Wf=!1;async function av(){if(Wf)return;Wf=!0;let i=document.querySelector('#menu [data-act="play"]');i&&(i.disabled=!0,i.classList.add("loading")),pt.toast("\u0417\u0430\u043F\u0440\u043E\u0441 \u0434\u043E\u0441\u0442\u0443\u043F\u0430 \u043A \u043C\u0438\u043A\u0440\u043E\u0444\u043E\u043D\u0443\u2026",""),await hu.enableVoice(),pt.toast("\u041F\u043E\u0434\u043A\u043B\u044E\u0447\u0435\u043D\u0438\u0435 \u043A \u0441\u0435\u0440\u0432\u0435\u0440\u0443 DENI-ISLAM #1\u2026","");let t=await hu.connect()!=="client";pt.hideMenu(),Et.startMatch({isHost:t,skin:t?"gentleman":"gopnik",name:t?"\u0414\u0416\u0415\u041D\u0422\u0415\u041B\u042C\u041C\u0415\u041D":"\u0413\u041E\u041F\u041D\u0418\u041A"}),pt.toast(t?"\u0422\u044B \u2014 \u0414\u0436\u0435\u043D\u0442\u0435\u043B\u044C\u043C\u0435\u043D. \u0416\u0434\u0451\u043C \u0432\u0442\u043E\u0440\u043E\u0433\u043E \u0438\u0433\u0440\u043E\u043A\u0430.":"\u0422\u044B \u2014 \u0413\u043E\u043F\u043D\u0438\u043A. \u041D\u0430\u043F\u0430\u0440\u043D\u0438\u043A \u0443\u0436\u0435 \u0442\u0443\u0442.","good")}pt.onAction=i=>{if(i==="pause:toggle"){if(Et.state!=="play"&&Et.state!=="dead")return;Et.pauseOpen?(Et.pauseOpen=!1,pt.hidePause()):Et.openPause();return}if(i.startsWith("slot:")){Et.selectSlot(parseInt(i.slice(5),10));return}if(i.startsWith("slotwheel:")){let e=parseInt(i.slice(10),10),t=Et.player.selected;for(let n=0;n<6&&(t=(t+e+6)%6,!(t===0||Et.player.hotbar[t]));n++);Et.selectSlot(t);return}if(i.startsWith("pause:")){let e=i.slice(6);e==="resume"&&(Et.pauseOpen=!1,pt.hidePause()),e==="controls"&&pt.showModal({title:"\u0423\u041F\u0420\u0410\u0412\u041B\u0415\u041D\u0418\u0415",sub:"\u041F\u041A \u0438 \u0442\u0435\u043B\u0435\u0444\u043E\u043D",body:pt.controlsHTML(),foot:uu("\u041F\u041E\u041D\u042F\u0422\u041D\u041E")}),e==="save"&&(Et.saveGame(),pt.toast("\u0421\u043E\u0445\u0440\u0430\u043D\u0435\u043D\u043E","good")),e==="exit"&&Et.exitToMenu()}};document.getElementById("btnPause").onclick=()=>{Et.openPause()};document.getElementById("modalClose").onclick=()=>{pt.hideModal()};document.getElementById("btnInv").onclick=()=>{Et.openInventory()};document.getElementById("modal").addEventListener("click",i=>{i.target.id==="modal"&&pt.hideModal()});pt.bindDesktop(du,()=>{});du.addEventListener("click",()=>{Et.sound.init(),Et.sound.resume()});window.addEventListener("keydown",i=>{i.code==="KeyE"&&pt.modalOpen||i.code==="Escape"&&pt.modalOpen&&pt.hideModal()});addEventListener("contextmenu",i=>i.preventDefault());addEventListener("beforeunload",()=>{try{Et.saveGame()}catch{}});rv();})();
