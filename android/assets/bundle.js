(()=>{var Gf=Object.create;var Ar=Object.defineProperty;var Wf=Object.getOwnPropertyDescriptor;var Xf=Object.getOwnPropertyNames;var qf=Object.getPrototypeOf,Yf=Object.prototype.hasOwnProperty;var $f=i=>{throw TypeError(i)};var Jf=(i,e,t)=>e in i?Ar(i,e,{enumerable:!0,configurable:!0,writable:!0,value:t}):i[e]=t;var Zf=(i,e)=>()=>(e||i((e={exports:{}}).exports,e),e.exports),Cr=(i,e)=>{for(var t in e)Ar(i,t,{get:e[t],enumerable:!0})},jf=(i,e,t,n)=>{if(e&&typeof e=="object"||typeof e=="function")for(let s of Xf(e))!Yf.call(i,s)&&s!==t&&Ar(i,s,{get:()=>e[s],enumerable:!(n=Wf(e,s))||n.enumerable});return i};var gu=(i,e,t)=>(t=i!=null?Gf(qf(i)):{},jf(e||!i||!i.__esModule?Ar(t,"default",{value:i,enumerable:!0}):t,i));var _u=(i,e,t)=>Jf(i,typeof e!="symbol"?e+"":e,t);var Cs=(i,e,t)=>e.has(i)?$f("Cannot add the same private member more than once"):e instanceof WeakSet?e.add(i):e.set(i,t);var zh=Zf((Vv,Bh)=>{"use strict";var oe={};oe.generateIdentifier=function(){return Math.random().toString(36).substring(2,12)};oe.localCName=oe.generateIdentifier();oe.splitLines=function(i){return i.trim().split(`
`).map(e=>e.trim())};oe.splitSections=function(i){return i.split(`
m=`).map((t,n)=>(n>0?"m="+t:t).trim()+`\r
`)};oe.getDescription=function(i){let e=oe.splitSections(i);return e&&e[0]};oe.getMediaSections=function(i){let e=oe.splitSections(i);return e.shift(),e};oe.matchPrefix=function(i,e){return oe.splitLines(i).filter(t=>t.indexOf(e)===0)};oe.parseCandidate=function(i){let e;i.indexOf("a=candidate:")===0?e=i.substring(12).split(" "):e=i.substring(10).split(" ");let t={foundation:e[0],component:{1:"rtp",2:"rtcp"}[e[1]]||e[1],protocol:e[2].toLowerCase(),priority:parseInt(e[3],10),ip:e[4],address:e[4],port:parseInt(e[5],10),type:e[7]};for(let n=8;n<e.length;n+=2)switch(e[n]){case"raddr":t.relatedAddress=e[n+1];break;case"rport":t.relatedPort=parseInt(e[n+1],10);break;case"tcptype":t.tcpType=e[n+1];break;case"ufrag":t.ufrag=e[n+1],t.usernameFragment=e[n+1];break;default:t[e[n]]===void 0&&(t[e[n]]=e[n+1]);break}return t};oe.writeCandidate=function(i){let e=[];e.push(i.foundation);let t=i.component;t==="rtp"?e.push(1):t==="rtcp"?e.push(2):e.push(t),e.push(i.protocol.toUpperCase()),e.push(i.priority),e.push(i.address||i.ip),e.push(i.port);let n=i.type;return e.push("typ"),e.push(n),n!=="host"&&i.relatedAddress&&i.relatedPort!==void 0&&(e.push("raddr"),e.push(i.relatedAddress),e.push("rport"),e.push(i.relatedPort)),i.tcpType&&i.protocol.toLowerCase()==="tcp"&&(e.push("tcptype"),e.push(i.tcpType)),(i.usernameFragment||i.ufrag)&&(e.push("ufrag"),e.push(i.usernameFragment||i.ufrag)),"candidate:"+e.join(" ")};oe.parseIceOptions=function(i){return i.substring(14).split(" ")};oe.parseRtpMap=function(i){let e=i.substring(9).split(" "),t={payloadType:parseInt(e.shift(),10)};return e=e[0].split("/"),t.name=e[0],t.clockRate=parseInt(e[1],10),t.channels=e.length===3?parseInt(e[2],10):1,t.numChannels=t.channels,t};oe.writeRtpMap=function(i){let e=i.payloadType;i.preferredPayloadType!==void 0&&(e=i.preferredPayloadType);let t=i.channels||i.numChannels||1;return"a=rtpmap:"+e+" "+i.name+"/"+i.clockRate+(t!==1?"/"+t:"")+`\r
`};oe.parseExtmap=function(i){let e=i.substring(9).split(" ");return{id:parseInt(e[0],10),direction:e[0].indexOf("/")>0?e[0].split("/")[1]:"sendrecv",uri:e[1],attributes:e.slice(2).join(" ")}};oe.writeExtmap=function(i){return"a=extmap:"+(i.id||i.preferredId)+(i.direction&&i.direction!=="sendrecv"?"/"+i.direction:"")+" "+i.uri+(i.attributes?" "+i.attributes:"")+`\r
`};oe.parseFmtp=function(i){let e={},t,n=i.substring(i.indexOf(" ")+1).split(";");for(let s=0;s<n.length;s++)t=n[s].trim().split("="),e[t[0].trim()]=t[1];return e};oe.writeFmtp=function(i){let e="",t=i.payloadType;if(i.preferredPayloadType!==void 0&&(t=i.preferredPayloadType),i.parameters&&Object.keys(i.parameters).length){let n=[];Object.keys(i.parameters).forEach(s=>{i.parameters[s]!==void 0?n.push(s+"="+i.parameters[s]):n.push(s)}),e+="a=fmtp:"+t+" "+n.join(";")+`\r
`}return e};oe.parseRtcpFb=function(i){let e=i.substring(i.indexOf(" ")+1).split(" ");return{type:e.shift(),parameter:e.join(" ")}};oe.writeRtcpFb=function(i){let e="",t=i.payloadType;return i.preferredPayloadType!==void 0&&(t=i.preferredPayloadType),i.rtcpFeedback&&i.rtcpFeedback.length&&i.rtcpFeedback.forEach(n=>{e+="a=rtcp-fb:"+t+" "+n.type+(n.parameter&&n.parameter.length?" "+n.parameter:"")+`\r
`}),e};oe.parseSsrcMedia=function(i){let e=i.indexOf(" "),t={ssrc:parseInt(i.substring(7,e),10)},n=i.indexOf(":",e);return n>-1?(t.attribute=i.substring(e+1,n),t.value=i.substring(n+1)):t.attribute=i.substring(e+1),t};oe.parseSsrcGroup=function(i){let e=i.substring(13).split(" ");return{semantics:e.shift(),ssrcs:e.map(t=>parseInt(t,10))}};oe.getMid=function(i){let e=oe.matchPrefix(i,"a=mid:")[0];if(e)return e.substring(6)};oe.parseFingerprint=function(i){let e=i.substring(14).split(" ");return{algorithm:e[0].toLowerCase(),value:e[1].toUpperCase()}};oe.getDtlsParameters=function(i,e){return{role:"auto",fingerprints:oe.matchPrefix(i+e,"a=fingerprint:").map(oe.parseFingerprint)}};oe.writeDtlsParameters=function(i,e){let t="a=setup:"+e+`\r
`;return i.fingerprints.forEach(n=>{t+="a=fingerprint:"+n.algorithm+" "+n.value+`\r
`}),t};oe.parseCryptoLine=function(i){let e=i.substring(9).split(" ");return{tag:parseInt(e[0],10),cryptoSuite:e[1],keyParams:e[2],sessionParams:e.slice(3)}};oe.writeCryptoLine=function(i){return"a=crypto:"+i.tag+" "+i.cryptoSuite+" "+(typeof i.keyParams=="object"?oe.writeCryptoKeyParams(i.keyParams):i.keyParams)+(i.sessionParams?" "+i.sessionParams.join(" "):"")+`\r
`};oe.parseCryptoKeyParams=function(i){if(i.indexOf("inline:")!==0)return null;let e=i.substring(7).split("|");return{keyMethod:"inline",keySalt:e[0],lifeTime:e[1],mkiValue:e[2]?e[2].split(":")[0]:void 0,mkiLength:e[2]?e[2].split(":")[1]:void 0}};oe.writeCryptoKeyParams=function(i){return i.keyMethod+":"+i.keySalt+(i.lifeTime?"|"+i.lifeTime:"")+(i.mkiValue&&i.mkiLength?"|"+i.mkiValue+":"+i.mkiLength:"")};oe.getCryptoParameters=function(i,e){return oe.matchPrefix(i+e,"a=crypto:").map(oe.parseCryptoLine)};oe.getIceParameters=function(i,e){let t=oe.matchPrefix(i+e,"a=ice-ufrag:")[0],n=oe.matchPrefix(i+e,"a=ice-pwd:")[0];return t&&n?{usernameFragment:t.substring(12),password:n.substring(10)}:null};oe.writeIceParameters=function(i){let e="a=ice-ufrag:"+i.usernameFragment+`\r
a=ice-pwd:`+i.password+`\r
`;return i.iceLite&&(e+=`a=ice-lite\r
`),e};oe.parseRtpParameters=function(i){let e={codecs:[],headerExtensions:[],fecMechanisms:[],rtcp:[]},n=oe.splitLines(i)[0].split(" ");e.profile=n[2];for(let r=3;r<n.length;r++){let o=n[r],a=oe.matchPrefix(i,"a=rtpmap:"+o+" ")[0];if(a){let c=oe.parseRtpMap(a),l=oe.matchPrefix(i,"a=fmtp:"+o+" ");switch(c.parameters=l.length?oe.parseFmtp(l[0]):{},c.rtcpFeedback=oe.matchPrefix(i,"a=rtcp-fb:"+o+" ").map(oe.parseRtcpFb),e.codecs.push(c),c.name.toUpperCase()){case"RED":case"ULPFEC":e.fecMechanisms.push(c.name.toUpperCase());break;default:break}}}oe.matchPrefix(i,"a=extmap:").forEach(r=>{e.headerExtensions.push(oe.parseExtmap(r))});let s=oe.matchPrefix(i,"a=rtcp-fb:* ").map(oe.parseRtcpFb);return e.codecs.forEach(r=>{s.forEach(o=>{r.rtcpFeedback.find(c=>c.type===o.type&&c.parameter===o.parameter)||r.rtcpFeedback.push(o)})}),e};oe.writeRtpDescription=function(i,e){let t="";t+="m="+i+" ",t+=e.codecs.length>0?"9":"0",t+=" "+(e.profile||"UDP/TLS/RTP/SAVPF")+" ",t+=e.codecs.map(s=>s.preferredPayloadType!==void 0?s.preferredPayloadType:s.payloadType).join(" ")+`\r
`,t+=`c=IN IP4 0.0.0.0\r
`,t+=`a=rtcp:9 IN IP4 0.0.0.0\r
`,e.codecs.forEach(s=>{t+=oe.writeRtpMap(s),t+=oe.writeFmtp(s),t+=oe.writeRtcpFb(s)});let n=0;return e.codecs.forEach(s=>{s.maxptime>n&&(n=s.maxptime)}),n>0&&(t+="a=maxptime:"+n+`\r
`),e.headerExtensions&&e.headerExtensions.forEach(s=>{t+=oe.writeExtmap(s)}),t};oe.parseRtpEncodingParameters=function(i){let e=[],t=oe.parseRtpParameters(i),n=t.fecMechanisms.indexOf("RED")!==-1,s=t.fecMechanisms.indexOf("ULPFEC")!==-1,r=oe.matchPrefix(i,"a=ssrc:").map(h=>oe.parseSsrcMedia(h)).filter(h=>h.attribute==="cname"),o=r.length>0&&r[0].ssrc,a,c=oe.matchPrefix(i,"a=ssrc-group:FID").map(h=>h.substring(17).split(" ").map(d=>parseInt(d,10)));c.length>0&&c[0].length>1&&c[0][0]===o&&(a=c[0][1]),t.codecs.forEach(h=>{if(h.name.toUpperCase()==="RTX"&&h.parameters.apt){let u={ssrc:o,codecPayloadType:parseInt(h.parameters.apt,10)};o&&a&&(u.rtx={ssrc:a}),e.push(u),n&&(u=JSON.parse(JSON.stringify(u)),u.fec={ssrc:o,mechanism:s?"red+ulpfec":"red"},e.push(u))}}),e.length===0&&o&&e.push({ssrc:o});let l=oe.matchPrefix(i,"b=");return l.length&&(l[0].indexOf("b=TIAS:")===0?l=parseInt(l[0].substring(7),10):l[0].indexOf("b=AS:")===0?l=parseInt(l[0].substring(5),10)*1e3*.95-50*40*8:l=void 0,e.forEach(h=>{h.maxBitrate=l})),e};oe.parseRtcpParameters=function(i){let e={},t=oe.matchPrefix(i,"a=ssrc:").map(r=>oe.parseSsrcMedia(r)).filter(r=>r.attribute==="cname")[0];t&&(e.cname=t.value,e.ssrc=t.ssrc);let n=oe.matchPrefix(i,"a=rtcp-rsize");e.reducedSize=n.length>0,e.compound=n.length===0;let s=oe.matchPrefix(i,"a=rtcp-mux");return e.mux=s.length>0,e};oe.writeRtcpParameters=function(i){let e="";return i.reducedSize&&(e+=`a=rtcp-rsize\r
`),i.mux&&(e+=`a=rtcp-mux\r
`),i.ssrc!==void 0&&i.cname&&(e+="a=ssrc:"+i.ssrc+" cname:"+i.cname+`\r
`),e};oe.parseMsid=function(i){let e,t=oe.matchPrefix(i,"a=msid:");if(t.length===1)return e=t[0].substring(7).split(" "),{stream:e[0],track:e[1]};let n=oe.matchPrefix(i,"a=ssrc:").map(s=>oe.parseSsrcMedia(s)).filter(s=>s.attribute==="msid");if(n.length>0)return e=n[0].value.split(" "),{stream:e[0],track:e[1]}};oe.parseSctpDescription=function(i){let e=oe.parseMLine(i),t=oe.matchPrefix(i,"a=max-message-size:"),n;t.length>0&&(n=parseInt(t[0].substring(19),10)),isNaN(n)&&(n=65536);let s=oe.matchPrefix(i,"a=sctp-port:");if(s.length>0)return{port:parseInt(s[0].substring(12),10),protocol:e.fmt,maxMessageSize:n};let r=oe.matchPrefix(i,"a=sctpmap:");if(r.length>0){let o=r[0].substring(10).split(" ");return{port:parseInt(o[0],10),protocol:o[1],maxMessageSize:n}}};oe.writeSctpDescription=function(i,e){let t=[];return i.protocol!=="DTLS/SCTP"?t=["m="+i.kind+" 9 "+i.protocol+" "+e.protocol+`\r
`,`c=IN IP4 0.0.0.0\r
`,"a=sctp-port:"+e.port+`\r
`]:t=["m="+i.kind+" 9 "+i.protocol+" "+e.port+`\r
`,`c=IN IP4 0.0.0.0\r
`,"a=sctpmap:"+e.port+" "+e.protocol+` 65535\r
`],e.maxMessageSize!==void 0&&t.push("a=max-message-size:"+e.maxMessageSize+`\r
`),t.join("")};oe.generateSessionId=function(){return Math.random().toString().substr(2,22)};oe.writeSessionBoilerplate=function(i,e,t){let n,s=e!==void 0?e:2;return i?n=i:n=oe.generateSessionId(),`v=0\r
o=`+(t||"thisisadapterortc")+" "+n+" "+s+` IN IP4 127.0.0.1\r
s=-\r
t=0 0\r
`};oe.getDirection=function(i,e){let t=oe.splitLines(i);for(let n=0;n<t.length;n++)switch(t[n]){case"a=sendrecv":case"a=sendonly":case"a=recvonly":case"a=inactive":return t[n].substring(2);default:}return e?oe.getDirection(e):"sendrecv"};oe.getKind=function(i){return oe.splitLines(i)[0].split(" ")[0].substring(2)};oe.isRejected=function(i){return i.split(" ",2)[1]==="0"};oe.parseMLine=function(i){let t=oe.splitLines(i)[0].substring(2).split(" ");return{kind:t[0],port:parseInt(t[1],10),protocol:t[2],fmt:t.slice(3).join(" ")}};oe.parseOLine=function(i){let t=oe.matchPrefix(i,"o=")[0].substring(2).split(" ");return{username:t[0],sessionId:t[1],sessionVersion:parseInt(t[2],10),netType:t[3],addressType:t[4],address:t[5]}};oe.isValidSDP=function(i){if(typeof i!="string"||i.length===0)return!1;let e=oe.splitLines(i);for(let t=0;t<e.length;t++)if(e[t].length<2||e[t].charAt(1)!=="=")return!1;return!0};typeof Bh=="object"&&(Bh.exports=oe)});var Fl="169";var Kf=0,yu=1,Qf=2;var wd=1,Bl=2,kn=3,Sn=0,Ht=1,Fn=2,ti=0,ns=1,xu=2,vu=3,bu=4,ep=5,_i=100,tp=101,np=102,ip=103,sp=104,rp=200,op=201,ap=202,cp=203,dc=204,fc=205,lp=206,hp=207,up=208,dp=209,fp=210,pp=211,mp=212,gp=213,_p=214,pc=0,mc=1,gc=2,os=3,_c=4,yc=5,xc=6,vc=7,Ad=0,yp=1,xp=2,ni=0,vp=1,bp=2,Mp=3,zl=4,Sp=5,Ep=6,Tp=7;var Cd=300,as=301,cs=302,bc=303,Mc=304,qo=306,qs=1e3,xi=1001,Sc=1002,an=1003,wp=1004;var Rr=1005;var mn=1006,Pa=1007;var vi=1008;var Hn=1009,Rd=1010,Pd=1011,Ys=1012,Hl=1013,bi=1014,Bn=1015,ar=1016,Vl=1017,Gl=1018,ls=1020,Id=35902,Ld=1021,Dd=1022,_n=1023,Ud=1024,Nd=1025,is=1026,hs=1027,kd=1028,Wl=1029,Od=1030,Xl=1031;var ql=1033,ro=33776,oo=33777,ao=33778,co=33779,Ec=35840,Tc=35841,wc=35842,Ac=35843,Cc=36196,Rc=37492,Pc=37496,Ic=37808,Lc=37809,Dc=37810,Uc=37811,Nc=37812,kc=37813,Oc=37814,Fc=37815,Bc=37816,zc=37817,Hc=37818,Vc=37819,Gc=37820,Wc=37821,lo=36492,Xc=36494,qc=36495,Fd=36283,Yc=36284,$c=36285,Jc=36286;var uo=2300,Zc=2301,Ia=2302,Mu=2400,Su=2401,Eu=2402;var Ap=3200,Cp=3201;var Bd=0,Rp=1,Qn="",Xt="srgb",ri="srgb-linear",Yl="display-p3",Yo="display-p3-linear",fo="linear",gt="srgb",po="rec709",mo="p3";var ki=7680;var Tu=519,Pp=512,Ip=513,Lp=514,zd=515,Dp=516,Up=517,Np=518,kp=519,jc=35044;var wu="300 es",zn=2e3,go=2001,ii=class{addEventListener(e,t){this._listeners===void 0&&(this._listeners={});let n=this._listeners;n[e]===void 0&&(n[e]=[]),n[e].indexOf(t)===-1&&n[e].push(t)}hasEventListener(e,t){if(this._listeners===void 0)return!1;let n=this._listeners;return n[e]!==void 0&&n[e].indexOf(t)!==-1}removeEventListener(e,t){if(this._listeners===void 0)return;let s=this._listeners[e];if(s!==void 0){let r=s.indexOf(t);r!==-1&&s.splice(r,1)}}dispatchEvent(e){if(this._listeners===void 0)return;let n=this._listeners[e.type];if(n!==void 0){e.target=this;let s=n.slice(0);for(let r=0,o=s.length;r<o;r++)s[r].call(this,e);e.target=null}}},Bt=["00","01","02","03","04","05","06","07","08","09","0a","0b","0c","0d","0e","0f","10","11","12","13","14","15","16","17","18","19","1a","1b","1c","1d","1e","1f","20","21","22","23","24","25","26","27","28","29","2a","2b","2c","2d","2e","2f","30","31","32","33","34","35","36","37","38","39","3a","3b","3c","3d","3e","3f","40","41","42","43","44","45","46","47","48","49","4a","4b","4c","4d","4e","4f","50","51","52","53","54","55","56","57","58","59","5a","5b","5c","5d","5e","5f","60","61","62","63","64","65","66","67","68","69","6a","6b","6c","6d","6e","6f","70","71","72","73","74","75","76","77","78","79","7a","7b","7c","7d","7e","7f","80","81","82","83","84","85","86","87","88","89","8a","8b","8c","8d","8e","8f","90","91","92","93","94","95","96","97","98","99","9a","9b","9c","9d","9e","9f","a0","a1","a2","a3","a4","a5","a6","a7","a8","a9","aa","ab","ac","ad","ae","af","b0","b1","b2","b3","b4","b5","b6","b7","b8","b9","ba","bb","bc","bd","be","bf","c0","c1","c2","c3","c4","c5","c6","c7","c8","c9","ca","cb","cc","cd","ce","cf","d0","d1","d2","d3","d4","d5","d6","d7","d8","d9","da","db","dc","dd","de","df","e0","e1","e2","e3","e4","e5","e6","e7","e8","e9","ea","eb","ec","ed","ee","ef","f0","f1","f2","f3","f4","f5","f6","f7","f8","f9","fa","fb","fc","fd","fe","ff"],Au=1234567,zs=Math.PI/180,$s=180/Math.PI;function Mn(){let i=Math.random()*4294967295|0,e=Math.random()*4294967295|0,t=Math.random()*4294967295|0,n=Math.random()*4294967295|0;return(Bt[i&255]+Bt[i>>8&255]+Bt[i>>16&255]+Bt[i>>24&255]+"-"+Bt[e&255]+Bt[e>>8&255]+"-"+Bt[e>>16&15|64]+Bt[e>>24&255]+"-"+Bt[t&63|128]+Bt[t>>8&255]+"-"+Bt[t>>16&255]+Bt[t>>24&255]+Bt[n&255]+Bt[n>>8&255]+Bt[n>>16&255]+Bt[n>>24&255]).toLowerCase()}function Pt(i,e,t){return Math.max(e,Math.min(t,i))}function $l(i,e){return(i%e+e)%e}function Op(i,e,t,n,s){return n+(i-e)*(s-n)/(t-e)}function Fp(i,e,t){return i!==e?(t-i)/(e-i):0}function Hs(i,e,t){return(1-t)*i+t*e}function Bp(i,e,t,n){return Hs(i,e,1-Math.exp(-t*n))}function zp(i,e=1){return e-Math.abs($l(i,e*2)-e)}function Hp(i,e,t){return i<=e?0:i>=t?1:(i=(i-e)/(t-e),i*i*(3-2*i))}function Vp(i,e,t){return i<=e?0:i>=t?1:(i=(i-e)/(t-e),i*i*i*(i*(i*6-15)+10))}function Gp(i,e){return i+Math.floor(Math.random()*(e-i+1))}function Wp(i,e){return i+Math.random()*(e-i)}function Xp(i){return i*(.5-Math.random())}function qp(i){i!==void 0&&(Au=i);let e=Au+=1831565813;return e=Math.imul(e^e>>>15,e|1),e^=e+Math.imul(e^e>>>7,e|61),((e^e>>>14)>>>0)/4294967296}function Yp(i){return i*zs}function $p(i){return i*$s}function Jp(i){return(i&i-1)===0&&i!==0}function Zp(i){return Math.pow(2,Math.ceil(Math.log(i)/Math.LN2))}function jp(i){return Math.pow(2,Math.floor(Math.log(i)/Math.LN2))}function Kp(i,e,t,n,s){let r=Math.cos,o=Math.sin,a=r(t/2),c=o(t/2),l=r((e+n)/2),h=o((e+n)/2),u=r((e-n)/2),d=o((e-n)/2),f=r((n-e)/2),g=o((n-e)/2);switch(s){case"XYX":i.set(a*h,c*u,c*d,a*l);break;case"YZY":i.set(c*d,a*h,c*u,a*l);break;case"ZXZ":i.set(c*u,c*d,a*h,a*l);break;case"XZX":i.set(a*h,c*g,c*f,a*l);break;case"YXY":i.set(c*f,a*h,c*g,a*l);break;case"ZYZ":i.set(c*g,c*f,a*h,a*l);break;default:console.warn("THREE.MathUtils: .setQuaternionFromProperEuler() encountered an unknown order: "+s)}}function gn(i,e){switch(e.constructor){case Float32Array:return i;case Uint32Array:return i/4294967295;case Uint16Array:return i/65535;case Uint8Array:return i/255;case Int32Array:return Math.max(i/2147483647,-1);case Int16Array:return Math.max(i/32767,-1);case Int8Array:return Math.max(i/127,-1);default:throw new Error("Invalid component type.")}}function ut(i,e){switch(e.constructor){case Float32Array:return i;case Uint32Array:return Math.round(i*4294967295);case Uint16Array:return Math.round(i*65535);case Uint8Array:return Math.round(i*255);case Int32Array:return Math.round(i*2147483647);case Int16Array:return Math.round(i*32767);case Int8Array:return Math.round(i*127);default:throw new Error("Invalid component type.")}}var Jl={DEG2RAD:zs,RAD2DEG:$s,generateUUID:Mn,clamp:Pt,euclideanModulo:$l,mapLinear:Op,inverseLerp:Fp,lerp:Hs,damp:Bp,pingpong:zp,smoothstep:Hp,smootherstep:Vp,randInt:Gp,randFloat:Wp,randFloatSpread:Xp,seededRandom:qp,degToRad:Yp,radToDeg:$p,isPowerOfTwo:Jp,ceilPowerOfTwo:Zp,floorPowerOfTwo:jp,setQuaternionFromProperEuler:Kp,normalize:ut,denormalize:gn},le=class i{constructor(e=0,t=0){i.prototype.isVector2=!0,this.x=e,this.y=t}get width(){return this.x}set width(e){this.x=e}get height(){return this.y}set height(e){this.y=e}set(e,t){return this.x=e,this.y=t,this}setScalar(e){return this.x=e,this.y=e,this}setX(e){return this.x=e,this}setY(e){return this.y=e,this}setComponent(e,t){switch(e){case 0:this.x=t;break;case 1:this.y=t;break;default:throw new Error("index is out of range: "+e)}return this}getComponent(e){switch(e){case 0:return this.x;case 1:return this.y;default:throw new Error("index is out of range: "+e)}}clone(){return new this.constructor(this.x,this.y)}copy(e){return this.x=e.x,this.y=e.y,this}add(e){return this.x+=e.x,this.y+=e.y,this}addScalar(e){return this.x+=e,this.y+=e,this}addVectors(e,t){return this.x=e.x+t.x,this.y=e.y+t.y,this}addScaledVector(e,t){return this.x+=e.x*t,this.y+=e.y*t,this}sub(e){return this.x-=e.x,this.y-=e.y,this}subScalar(e){return this.x-=e,this.y-=e,this}subVectors(e,t){return this.x=e.x-t.x,this.y=e.y-t.y,this}multiply(e){return this.x*=e.x,this.y*=e.y,this}multiplyScalar(e){return this.x*=e,this.y*=e,this}divide(e){return this.x/=e.x,this.y/=e.y,this}divideScalar(e){return this.multiplyScalar(1/e)}applyMatrix3(e){let t=this.x,n=this.y,s=e.elements;return this.x=s[0]*t+s[3]*n+s[6],this.y=s[1]*t+s[4]*n+s[7],this}min(e){return this.x=Math.min(this.x,e.x),this.y=Math.min(this.y,e.y),this}max(e){return this.x=Math.max(this.x,e.x),this.y=Math.max(this.y,e.y),this}clamp(e,t){return this.x=Math.max(e.x,Math.min(t.x,this.x)),this.y=Math.max(e.y,Math.min(t.y,this.y)),this}clampScalar(e,t){return this.x=Math.max(e,Math.min(t,this.x)),this.y=Math.max(e,Math.min(t,this.y)),this}clampLength(e,t){let n=this.length();return this.divideScalar(n||1).multiplyScalar(Math.max(e,Math.min(t,n)))}floor(){return this.x=Math.floor(this.x),this.y=Math.floor(this.y),this}ceil(){return this.x=Math.ceil(this.x),this.y=Math.ceil(this.y),this}round(){return this.x=Math.round(this.x),this.y=Math.round(this.y),this}roundToZero(){return this.x=Math.trunc(this.x),this.y=Math.trunc(this.y),this}negate(){return this.x=-this.x,this.y=-this.y,this}dot(e){return this.x*e.x+this.y*e.y}cross(e){return this.x*e.y-this.y*e.x}lengthSq(){return this.x*this.x+this.y*this.y}length(){return Math.sqrt(this.x*this.x+this.y*this.y)}manhattanLength(){return Math.abs(this.x)+Math.abs(this.y)}normalize(){return this.divideScalar(this.length()||1)}angle(){return Math.atan2(-this.y,-this.x)+Math.PI}angleTo(e){let t=Math.sqrt(this.lengthSq()*e.lengthSq());if(t===0)return Math.PI/2;let n=this.dot(e)/t;return Math.acos(Pt(n,-1,1))}distanceTo(e){return Math.sqrt(this.distanceToSquared(e))}distanceToSquared(e){let t=this.x-e.x,n=this.y-e.y;return t*t+n*n}manhattanDistanceTo(e){return Math.abs(this.x-e.x)+Math.abs(this.y-e.y)}setLength(e){return this.normalize().multiplyScalar(e)}lerp(e,t){return this.x+=(e.x-this.x)*t,this.y+=(e.y-this.y)*t,this}lerpVectors(e,t,n){return this.x=e.x+(t.x-e.x)*n,this.y=e.y+(t.y-e.y)*n,this}equals(e){return e.x===this.x&&e.y===this.y}fromArray(e,t=0){return this.x=e[t],this.y=e[t+1],this}toArray(e=[],t=0){return e[t]=this.x,e[t+1]=this.y,e}fromBufferAttribute(e,t){return this.x=e.getX(t),this.y=e.getY(t),this}rotateAround(e,t){let n=Math.cos(t),s=Math.sin(t),r=this.x-e.x,o=this.y-e.y;return this.x=r*n-o*s+e.x,this.y=r*s+o*n+e.y,this}random(){return this.x=Math.random(),this.y=Math.random(),this}*[Symbol.iterator](){yield this.x,yield this.y}},je=class i{constructor(e,t,n,s,r,o,a,c,l){i.prototype.isMatrix3=!0,this.elements=[1,0,0,0,1,0,0,0,1],e!==void 0&&this.set(e,t,n,s,r,o,a,c,l)}set(e,t,n,s,r,o,a,c,l){let h=this.elements;return h[0]=e,h[1]=s,h[2]=a,h[3]=t,h[4]=r,h[5]=c,h[6]=n,h[7]=o,h[8]=l,this}identity(){return this.set(1,0,0,0,1,0,0,0,1),this}copy(e){let t=this.elements,n=e.elements;return t[0]=n[0],t[1]=n[1],t[2]=n[2],t[3]=n[3],t[4]=n[4],t[5]=n[5],t[6]=n[6],t[7]=n[7],t[8]=n[8],this}extractBasis(e,t,n){return e.setFromMatrix3Column(this,0),t.setFromMatrix3Column(this,1),n.setFromMatrix3Column(this,2),this}setFromMatrix4(e){let t=e.elements;return this.set(t[0],t[4],t[8],t[1],t[5],t[9],t[2],t[6],t[10]),this}multiply(e){return this.multiplyMatrices(this,e)}premultiply(e){return this.multiplyMatrices(e,this)}multiplyMatrices(e,t){let n=e.elements,s=t.elements,r=this.elements,o=n[0],a=n[3],c=n[6],l=n[1],h=n[4],u=n[7],d=n[2],f=n[5],g=n[8],y=s[0],m=s[3],p=s[6],M=s[1],x=s[4],b=s[7],D=s[2],A=s[5],C=s[8];return r[0]=o*y+a*M+c*D,r[3]=o*m+a*x+c*A,r[6]=o*p+a*b+c*C,r[1]=l*y+h*M+u*D,r[4]=l*m+h*x+u*A,r[7]=l*p+h*b+u*C,r[2]=d*y+f*M+g*D,r[5]=d*m+f*x+g*A,r[8]=d*p+f*b+g*C,this}multiplyScalar(e){let t=this.elements;return t[0]*=e,t[3]*=e,t[6]*=e,t[1]*=e,t[4]*=e,t[7]*=e,t[2]*=e,t[5]*=e,t[8]*=e,this}determinant(){let e=this.elements,t=e[0],n=e[1],s=e[2],r=e[3],o=e[4],a=e[5],c=e[6],l=e[7],h=e[8];return t*o*h-t*a*l-n*r*h+n*a*c+s*r*l-s*o*c}invert(){let e=this.elements,t=e[0],n=e[1],s=e[2],r=e[3],o=e[4],a=e[5],c=e[6],l=e[7],h=e[8],u=h*o-a*l,d=a*c-h*r,f=l*r-o*c,g=t*u+n*d+s*f;if(g===0)return this.set(0,0,0,0,0,0,0,0,0);let y=1/g;return e[0]=u*y,e[1]=(s*l-h*n)*y,e[2]=(a*n-s*o)*y,e[3]=d*y,e[4]=(h*t-s*c)*y,e[5]=(s*r-a*t)*y,e[6]=f*y,e[7]=(n*c-l*t)*y,e[8]=(o*t-n*r)*y,this}transpose(){let e,t=this.elements;return e=t[1],t[1]=t[3],t[3]=e,e=t[2],t[2]=t[6],t[6]=e,e=t[5],t[5]=t[7],t[7]=e,this}getNormalMatrix(e){return this.setFromMatrix4(e).invert().transpose()}transposeIntoArray(e){let t=this.elements;return e[0]=t[0],e[1]=t[3],e[2]=t[6],e[3]=t[1],e[4]=t[4],e[5]=t[7],e[6]=t[2],e[7]=t[5],e[8]=t[8],this}setUvTransform(e,t,n,s,r,o,a){let c=Math.cos(r),l=Math.sin(r);return this.set(n*c,n*l,-n*(c*o+l*a)+o+e,-s*l,s*c,-s*(-l*o+c*a)+a+t,0,0,1),this}scale(e,t){return this.premultiply(La.makeScale(e,t)),this}rotate(e){return this.premultiply(La.makeRotation(-e)),this}translate(e,t){return this.premultiply(La.makeTranslation(e,t)),this}makeTranslation(e,t){return e.isVector2?this.set(1,0,e.x,0,1,e.y,0,0,1):this.set(1,0,e,0,1,t,0,0,1),this}makeRotation(e){let t=Math.cos(e),n=Math.sin(e);return this.set(t,-n,0,n,t,0,0,0,1),this}makeScale(e,t){return this.set(e,0,0,0,t,0,0,0,1),this}equals(e){let t=this.elements,n=e.elements;for(let s=0;s<9;s++)if(t[s]!==n[s])return!1;return!0}fromArray(e,t=0){for(let n=0;n<9;n++)this.elements[n]=e[n+t];return this}toArray(e=[],t=0){let n=this.elements;return e[t]=n[0],e[t+1]=n[1],e[t+2]=n[2],e[t+3]=n[3],e[t+4]=n[4],e[t+5]=n[5],e[t+6]=n[6],e[t+7]=n[7],e[t+8]=n[8],e}clone(){return new this.constructor().fromArray(this.elements)}},La=new je;function Hd(i){for(let e=i.length-1;e>=0;--e)if(i[e]>=65535)return!0;return!1}function _o(i){return document.createElementNS("http://www.w3.org/1999/xhtml",i)}function Qp(){let i=_o("canvas");return i.style.display="block",i}var Cu={};function ho(i){i in Cu||(Cu[i]=!0,console.warn(i))}function em(i,e,t){return new Promise(function(n,s){function r(){switch(i.clientWaitSync(e,i.SYNC_FLUSH_COMMANDS_BIT,0)){case i.WAIT_FAILED:s();break;case i.TIMEOUT_EXPIRED:setTimeout(r,t);break;default:n()}}setTimeout(r,t)})}function tm(i){let e=i.elements;e[2]=.5*e[2]+.5*e[3],e[6]=.5*e[6]+.5*e[7],e[10]=.5*e[10]+.5*e[11],e[14]=.5*e[14]+.5*e[15]}function nm(i){let e=i.elements;e[11]===-1?(e[10]=-e[10]-1,e[14]=-e[14]):(e[10]=-e[10],e[14]=-e[14]+1)}var Ru=new je().set(.8224621,.177538,0,.0331941,.9668058,0,.0170827,.0723974,.9105199),Pu=new je().set(1.2249401,-.2249404,0,-.0420569,1.0420571,0,-.0196376,-.0786361,1.0982735),Rs={[ri]:{transfer:fo,primaries:po,luminanceCoefficients:[.2126,.7152,.0722],toReference:i=>i,fromReference:i=>i},[Xt]:{transfer:gt,primaries:po,luminanceCoefficients:[.2126,.7152,.0722],toReference:i=>i.convertSRGBToLinear(),fromReference:i=>i.convertLinearToSRGB()},[Yo]:{transfer:fo,primaries:mo,luminanceCoefficients:[.2289,.6917,.0793],toReference:i=>i.applyMatrix3(Pu),fromReference:i=>i.applyMatrix3(Ru)},[Yl]:{transfer:gt,primaries:mo,luminanceCoefficients:[.2289,.6917,.0793],toReference:i=>i.convertSRGBToLinear().applyMatrix3(Pu),fromReference:i=>i.applyMatrix3(Ru).convertLinearToSRGB()}},im=new Set([ri,Yo]),ct={enabled:!0,_workingColorSpace:ri,get workingColorSpace(){return this._workingColorSpace},set workingColorSpace(i){if(!im.has(i))throw new Error(`Unsupported working color space, "${i}".`);this._workingColorSpace=i},convert:function(i,e,t){if(this.enabled===!1||e===t||!e||!t)return i;let n=Rs[e].toReference,s=Rs[t].fromReference;return s(n(i))},fromWorkingColorSpace:function(i,e){return this.convert(i,this._workingColorSpace,e)},toWorkingColorSpace:function(i,e){return this.convert(i,e,this._workingColorSpace)},getPrimaries:function(i){return Rs[i].primaries},getTransfer:function(i){return i===Qn?fo:Rs[i].transfer},getLuminanceCoefficients:function(i,e=this._workingColorSpace){return i.fromArray(Rs[e].luminanceCoefficients)}};function ss(i){return i<.04045?i*.0773993808:Math.pow(i*.9478672986+.0521327014,2.4)}function Da(i){return i<.0031308?i*12.92:1.055*Math.pow(i,.41666)-.055}var Oi,Kc=class{static getDataURL(e){if(/^data:/i.test(e.src)||typeof HTMLCanvasElement=="undefined")return e.src;let t;if(e instanceof HTMLCanvasElement)t=e;else{Oi===void 0&&(Oi=_o("canvas")),Oi.width=e.width,Oi.height=e.height;let n=Oi.getContext("2d");e instanceof ImageData?n.putImageData(e,0,0):n.drawImage(e,0,0,e.width,e.height),t=Oi}return t.width>2048||t.height>2048?(console.warn("THREE.ImageUtils.getDataURL: Image converted to jpg for performance reasons",e),t.toDataURL("image/jpeg",.6)):t.toDataURL("image/png")}static sRGBToLinear(e){if(typeof HTMLImageElement!="undefined"&&e instanceof HTMLImageElement||typeof HTMLCanvasElement!="undefined"&&e instanceof HTMLCanvasElement||typeof ImageBitmap!="undefined"&&e instanceof ImageBitmap){let t=_o("canvas");t.width=e.width,t.height=e.height;let n=t.getContext("2d");n.drawImage(e,0,0,e.width,e.height);let s=n.getImageData(0,0,e.width,e.height),r=s.data;for(let o=0;o<r.length;o++)r[o]=ss(r[o]/255)*255;return n.putImageData(s,0,0),t}else if(e.data){let t=e.data.slice(0);for(let n=0;n<t.length;n++)t instanceof Uint8Array||t instanceof Uint8ClampedArray?t[n]=Math.floor(ss(t[n]/255)*255):t[n]=ss(t[n]);return{data:t,width:e.width,height:e.height}}else return console.warn("THREE.ImageUtils.sRGBToLinear(): Unsupported image type. No color space conversion applied."),e}},sm=0,yo=class{constructor(e=null){this.isSource=!0,Object.defineProperty(this,"id",{value:sm++}),this.uuid=Mn(),this.data=e,this.dataReady=!0,this.version=0}set needsUpdate(e){e===!0&&this.version++}toJSON(e){let t=e===void 0||typeof e=="string";if(!t&&e.images[this.uuid]!==void 0)return e.images[this.uuid];let n={uuid:this.uuid,url:""},s=this.data;if(s!==null){let r;if(Array.isArray(s)){r=[];for(let o=0,a=s.length;o<a;o++)s[o].isDataTexture?r.push(Ua(s[o].image)):r.push(Ua(s[o]))}else r=Ua(s);n.url=r}return t||(e.images[this.uuid]=n),n}};function Ua(i){return typeof HTMLImageElement!="undefined"&&i instanceof HTMLImageElement||typeof HTMLCanvasElement!="undefined"&&i instanceof HTMLCanvasElement||typeof ImageBitmap!="undefined"&&i instanceof ImageBitmap?Kc.getDataURL(i):i.data?{data:Array.from(i.data),width:i.width,height:i.height,type:i.data.constructor.name}:(console.warn("THREE.Texture: Unable to serialize Texture."),{})}var rm=0,nn=class i extends ii{constructor(e=i.DEFAULT_IMAGE,t=i.DEFAULT_MAPPING,n=xi,s=xi,r=mn,o=vi,a=_n,c=Hn,l=i.DEFAULT_ANISOTROPY,h=Qn){super(),this.isTexture=!0,Object.defineProperty(this,"id",{value:rm++}),this.uuid=Mn(),this.name="",this.source=new yo(e),this.mipmaps=[],this.mapping=t,this.channel=0,this.wrapS=n,this.wrapT=s,this.magFilter=r,this.minFilter=o,this.anisotropy=l,this.format=a,this.internalFormat=null,this.type=c,this.offset=new le(0,0),this.repeat=new le(1,1),this.center=new le(0,0),this.rotation=0,this.matrixAutoUpdate=!0,this.matrix=new je,this.generateMipmaps=!0,this.premultiplyAlpha=!1,this.flipY=!0,this.unpackAlignment=4,this.colorSpace=h,this.userData={},this.version=0,this.onUpdate=null,this.isRenderTargetTexture=!1,this.pmremVersion=0}get image(){return this.source.data}set image(e=null){this.source.data=e}updateMatrix(){this.matrix.setUvTransform(this.offset.x,this.offset.y,this.repeat.x,this.repeat.y,this.rotation,this.center.x,this.center.y)}clone(){return new this.constructor().copy(this)}copy(e){return this.name=e.name,this.source=e.source,this.mipmaps=e.mipmaps.slice(0),this.mapping=e.mapping,this.channel=e.channel,this.wrapS=e.wrapS,this.wrapT=e.wrapT,this.magFilter=e.magFilter,this.minFilter=e.minFilter,this.anisotropy=e.anisotropy,this.format=e.format,this.internalFormat=e.internalFormat,this.type=e.type,this.offset.copy(e.offset),this.repeat.copy(e.repeat),this.center.copy(e.center),this.rotation=e.rotation,this.matrixAutoUpdate=e.matrixAutoUpdate,this.matrix.copy(e.matrix),this.generateMipmaps=e.generateMipmaps,this.premultiplyAlpha=e.premultiplyAlpha,this.flipY=e.flipY,this.unpackAlignment=e.unpackAlignment,this.colorSpace=e.colorSpace,this.userData=JSON.parse(JSON.stringify(e.userData)),this.needsUpdate=!0,this}toJSON(e){let t=e===void 0||typeof e=="string";if(!t&&e.textures[this.uuid]!==void 0)return e.textures[this.uuid];let n={metadata:{version:4.6,type:"Texture",generator:"Texture.toJSON"},uuid:this.uuid,name:this.name,image:this.source.toJSON(e).uuid,mapping:this.mapping,channel:this.channel,repeat:[this.repeat.x,this.repeat.y],offset:[this.offset.x,this.offset.y],center:[this.center.x,this.center.y],rotation:this.rotation,wrap:[this.wrapS,this.wrapT],format:this.format,internalFormat:this.internalFormat,type:this.type,colorSpace:this.colorSpace,minFilter:this.minFilter,magFilter:this.magFilter,anisotropy:this.anisotropy,flipY:this.flipY,generateMipmaps:this.generateMipmaps,premultiplyAlpha:this.premultiplyAlpha,unpackAlignment:this.unpackAlignment};return Object.keys(this.userData).length>0&&(n.userData=this.userData),t||(e.textures[this.uuid]=n),n}dispose(){this.dispatchEvent({type:"dispose"})}transformUv(e){if(this.mapping!==Cd)return e;if(e.applyMatrix3(this.matrix),e.x<0||e.x>1)switch(this.wrapS){case qs:e.x=e.x-Math.floor(e.x);break;case xi:e.x=e.x<0?0:1;break;case Sc:Math.abs(Math.floor(e.x)%2)===1?e.x=Math.ceil(e.x)-e.x:e.x=e.x-Math.floor(e.x);break}if(e.y<0||e.y>1)switch(this.wrapT){case qs:e.y=e.y-Math.floor(e.y);break;case xi:e.y=e.y<0?0:1;break;case Sc:Math.abs(Math.floor(e.y)%2)===1?e.y=Math.ceil(e.y)-e.y:e.y=e.y-Math.floor(e.y);break}return this.flipY&&(e.y=1-e.y),e}set needsUpdate(e){e===!0&&(this.version++,this.source.needsUpdate=!0)}set needsPMREMUpdate(e){e===!0&&this.pmremVersion++}};nn.DEFAULT_IMAGE=null;nn.DEFAULT_MAPPING=Cd;nn.DEFAULT_ANISOTROPY=1;var ft=class i{constructor(e=0,t=0,n=0,s=1){i.prototype.isVector4=!0,this.x=e,this.y=t,this.z=n,this.w=s}get width(){return this.z}set width(e){this.z=e}get height(){return this.w}set height(e){this.w=e}set(e,t,n,s){return this.x=e,this.y=t,this.z=n,this.w=s,this}setScalar(e){return this.x=e,this.y=e,this.z=e,this.w=e,this}setX(e){return this.x=e,this}setY(e){return this.y=e,this}setZ(e){return this.z=e,this}setW(e){return this.w=e,this}setComponent(e,t){switch(e){case 0:this.x=t;break;case 1:this.y=t;break;case 2:this.z=t;break;case 3:this.w=t;break;default:throw new Error("index is out of range: "+e)}return this}getComponent(e){switch(e){case 0:return this.x;case 1:return this.y;case 2:return this.z;case 3:return this.w;default:throw new Error("index is out of range: "+e)}}clone(){return new this.constructor(this.x,this.y,this.z,this.w)}copy(e){return this.x=e.x,this.y=e.y,this.z=e.z,this.w=e.w!==void 0?e.w:1,this}add(e){return this.x+=e.x,this.y+=e.y,this.z+=e.z,this.w+=e.w,this}addScalar(e){return this.x+=e,this.y+=e,this.z+=e,this.w+=e,this}addVectors(e,t){return this.x=e.x+t.x,this.y=e.y+t.y,this.z=e.z+t.z,this.w=e.w+t.w,this}addScaledVector(e,t){return this.x+=e.x*t,this.y+=e.y*t,this.z+=e.z*t,this.w+=e.w*t,this}sub(e){return this.x-=e.x,this.y-=e.y,this.z-=e.z,this.w-=e.w,this}subScalar(e){return this.x-=e,this.y-=e,this.z-=e,this.w-=e,this}subVectors(e,t){return this.x=e.x-t.x,this.y=e.y-t.y,this.z=e.z-t.z,this.w=e.w-t.w,this}multiply(e){return this.x*=e.x,this.y*=e.y,this.z*=e.z,this.w*=e.w,this}multiplyScalar(e){return this.x*=e,this.y*=e,this.z*=e,this.w*=e,this}applyMatrix4(e){let t=this.x,n=this.y,s=this.z,r=this.w,o=e.elements;return this.x=o[0]*t+o[4]*n+o[8]*s+o[12]*r,this.y=o[1]*t+o[5]*n+o[9]*s+o[13]*r,this.z=o[2]*t+o[6]*n+o[10]*s+o[14]*r,this.w=o[3]*t+o[7]*n+o[11]*s+o[15]*r,this}divideScalar(e){return this.multiplyScalar(1/e)}setAxisAngleFromQuaternion(e){this.w=2*Math.acos(e.w);let t=Math.sqrt(1-e.w*e.w);return t<1e-4?(this.x=1,this.y=0,this.z=0):(this.x=e.x/t,this.y=e.y/t,this.z=e.z/t),this}setAxisAngleFromRotationMatrix(e){let t,n,s,r,c=e.elements,l=c[0],h=c[4],u=c[8],d=c[1],f=c[5],g=c[9],y=c[2],m=c[6],p=c[10];if(Math.abs(h-d)<.01&&Math.abs(u-y)<.01&&Math.abs(g-m)<.01){if(Math.abs(h+d)<.1&&Math.abs(u+y)<.1&&Math.abs(g+m)<.1&&Math.abs(l+f+p-3)<.1)return this.set(1,0,0,0),this;t=Math.PI;let x=(l+1)/2,b=(f+1)/2,D=(p+1)/2,A=(h+d)/4,C=(u+y)/4,P=(g+m)/4;return x>b&&x>D?x<.01?(n=0,s=.707106781,r=.707106781):(n=Math.sqrt(x),s=A/n,r=C/n):b>D?b<.01?(n=.707106781,s=0,r=.707106781):(s=Math.sqrt(b),n=A/s,r=P/s):D<.01?(n=.707106781,s=.707106781,r=0):(r=Math.sqrt(D),n=C/r,s=P/r),this.set(n,s,r,t),this}let M=Math.sqrt((m-g)*(m-g)+(u-y)*(u-y)+(d-h)*(d-h));return Math.abs(M)<.001&&(M=1),this.x=(m-g)/M,this.y=(u-y)/M,this.z=(d-h)/M,this.w=Math.acos((l+f+p-1)/2),this}setFromMatrixPosition(e){let t=e.elements;return this.x=t[12],this.y=t[13],this.z=t[14],this.w=t[15],this}min(e){return this.x=Math.min(this.x,e.x),this.y=Math.min(this.y,e.y),this.z=Math.min(this.z,e.z),this.w=Math.min(this.w,e.w),this}max(e){return this.x=Math.max(this.x,e.x),this.y=Math.max(this.y,e.y),this.z=Math.max(this.z,e.z),this.w=Math.max(this.w,e.w),this}clamp(e,t){return this.x=Math.max(e.x,Math.min(t.x,this.x)),this.y=Math.max(e.y,Math.min(t.y,this.y)),this.z=Math.max(e.z,Math.min(t.z,this.z)),this.w=Math.max(e.w,Math.min(t.w,this.w)),this}clampScalar(e,t){return this.x=Math.max(e,Math.min(t,this.x)),this.y=Math.max(e,Math.min(t,this.y)),this.z=Math.max(e,Math.min(t,this.z)),this.w=Math.max(e,Math.min(t,this.w)),this}clampLength(e,t){let n=this.length();return this.divideScalar(n||1).multiplyScalar(Math.max(e,Math.min(t,n)))}floor(){return this.x=Math.floor(this.x),this.y=Math.floor(this.y),this.z=Math.floor(this.z),this.w=Math.floor(this.w),this}ceil(){return this.x=Math.ceil(this.x),this.y=Math.ceil(this.y),this.z=Math.ceil(this.z),this.w=Math.ceil(this.w),this}round(){return this.x=Math.round(this.x),this.y=Math.round(this.y),this.z=Math.round(this.z),this.w=Math.round(this.w),this}roundToZero(){return this.x=Math.trunc(this.x),this.y=Math.trunc(this.y),this.z=Math.trunc(this.z),this.w=Math.trunc(this.w),this}negate(){return this.x=-this.x,this.y=-this.y,this.z=-this.z,this.w=-this.w,this}dot(e){return this.x*e.x+this.y*e.y+this.z*e.z+this.w*e.w}lengthSq(){return this.x*this.x+this.y*this.y+this.z*this.z+this.w*this.w}length(){return Math.sqrt(this.x*this.x+this.y*this.y+this.z*this.z+this.w*this.w)}manhattanLength(){return Math.abs(this.x)+Math.abs(this.y)+Math.abs(this.z)+Math.abs(this.w)}normalize(){return this.divideScalar(this.length()||1)}setLength(e){return this.normalize().multiplyScalar(e)}lerp(e,t){return this.x+=(e.x-this.x)*t,this.y+=(e.y-this.y)*t,this.z+=(e.z-this.z)*t,this.w+=(e.w-this.w)*t,this}lerpVectors(e,t,n){return this.x=e.x+(t.x-e.x)*n,this.y=e.y+(t.y-e.y)*n,this.z=e.z+(t.z-e.z)*n,this.w=e.w+(t.w-e.w)*n,this}equals(e){return e.x===this.x&&e.y===this.y&&e.z===this.z&&e.w===this.w}fromArray(e,t=0){return this.x=e[t],this.y=e[t+1],this.z=e[t+2],this.w=e[t+3],this}toArray(e=[],t=0){return e[t]=this.x,e[t+1]=this.y,e[t+2]=this.z,e[t+3]=this.w,e}fromBufferAttribute(e,t){return this.x=e.getX(t),this.y=e.getY(t),this.z=e.getZ(t),this.w=e.getW(t),this}random(){return this.x=Math.random(),this.y=Math.random(),this.z=Math.random(),this.w=Math.random(),this}*[Symbol.iterator](){yield this.x,yield this.y,yield this.z,yield this.w}},Qc=class extends ii{constructor(e=1,t=1,n={}){super(),this.isRenderTarget=!0,this.width=e,this.height=t,this.depth=1,this.scissor=new ft(0,0,e,t),this.scissorTest=!1,this.viewport=new ft(0,0,e,t);let s={width:e,height:t,depth:1};n=Object.assign({generateMipmaps:!1,internalFormat:null,minFilter:mn,depthBuffer:!0,stencilBuffer:!1,resolveDepthBuffer:!0,resolveStencilBuffer:!0,depthTexture:null,samples:0,count:1},n);let r=new nn(s,n.mapping,n.wrapS,n.wrapT,n.magFilter,n.minFilter,n.format,n.type,n.anisotropy,n.colorSpace);r.flipY=!1,r.generateMipmaps=n.generateMipmaps,r.internalFormat=n.internalFormat,this.textures=[];let o=n.count;for(let a=0;a<o;a++)this.textures[a]=r.clone(),this.textures[a].isRenderTargetTexture=!0;this.depthBuffer=n.depthBuffer,this.stencilBuffer=n.stencilBuffer,this.resolveDepthBuffer=n.resolveDepthBuffer,this.resolveStencilBuffer=n.resolveStencilBuffer,this.depthTexture=n.depthTexture,this.samples=n.samples}get texture(){return this.textures[0]}set texture(e){this.textures[0]=e}setSize(e,t,n=1){if(this.width!==e||this.height!==t||this.depth!==n){this.width=e,this.height=t,this.depth=n;for(let s=0,r=this.textures.length;s<r;s++)this.textures[s].image.width=e,this.textures[s].image.height=t,this.textures[s].image.depth=n;this.dispose()}this.viewport.set(0,0,e,t),this.scissor.set(0,0,e,t)}clone(){return new this.constructor().copy(this)}copy(e){this.width=e.width,this.height=e.height,this.depth=e.depth,this.scissor.copy(e.scissor),this.scissorTest=e.scissorTest,this.viewport.copy(e.viewport),this.textures.length=0;for(let n=0,s=e.textures.length;n<s;n++)this.textures[n]=e.textures[n].clone(),this.textures[n].isRenderTargetTexture=!0;let t=Object.assign({},e.texture.image);return this.texture.source=new yo(t),this.depthBuffer=e.depthBuffer,this.stencilBuffer=e.stencilBuffer,this.resolveDepthBuffer=e.resolveDepthBuffer,this.resolveStencilBuffer=e.resolveStencilBuffer,e.depthTexture!==null&&(this.depthTexture=e.depthTexture.clone()),this.samples=e.samples,this}dispose(){this.dispatchEvent({type:"dispose"})}},Vn=class extends Qc{constructor(e=1,t=1,n={}){super(e,t,n),this.isWebGLRenderTarget=!0}},xo=class extends nn{constructor(e=null,t=1,n=1,s=1){super(null),this.isDataArrayTexture=!0,this.image={data:e,width:t,height:n,depth:s},this.magFilter=an,this.minFilter=an,this.wrapR=xi,this.generateMipmaps=!1,this.flipY=!1,this.unpackAlignment=1,this.layerUpdates=new Set}addLayerUpdate(e){this.layerUpdates.add(e)}clearLayerUpdates(){this.layerUpdates.clear()}};var el=class extends nn{constructor(e=null,t=1,n=1,s=1){super(null),this.isData3DTexture=!0,this.image={data:e,width:t,height:n,depth:s},this.magFilter=an,this.minFilter=an,this.wrapR=xi,this.generateMipmaps=!1,this.flipY=!1,this.unpackAlignment=1}};var si=class{constructor(e=0,t=0,n=0,s=1){this.isQuaternion=!0,this._x=e,this._y=t,this._z=n,this._w=s}static slerpFlat(e,t,n,s,r,o,a){let c=n[s+0],l=n[s+1],h=n[s+2],u=n[s+3],d=r[o+0],f=r[o+1],g=r[o+2],y=r[o+3];if(a===0){e[t+0]=c,e[t+1]=l,e[t+2]=h,e[t+3]=u;return}if(a===1){e[t+0]=d,e[t+1]=f,e[t+2]=g,e[t+3]=y;return}if(u!==y||c!==d||l!==f||h!==g){let m=1-a,p=c*d+l*f+h*g+u*y,M=p>=0?1:-1,x=1-p*p;if(x>Number.EPSILON){let D=Math.sqrt(x),A=Math.atan2(D,p*M);m=Math.sin(m*A)/D,a=Math.sin(a*A)/D}let b=a*M;if(c=c*m+d*b,l=l*m+f*b,h=h*m+g*b,u=u*m+y*b,m===1-a){let D=1/Math.sqrt(c*c+l*l+h*h+u*u);c*=D,l*=D,h*=D,u*=D}}e[t]=c,e[t+1]=l,e[t+2]=h,e[t+3]=u}static multiplyQuaternionsFlat(e,t,n,s,r,o){let a=n[s],c=n[s+1],l=n[s+2],h=n[s+3],u=r[o],d=r[o+1],f=r[o+2],g=r[o+3];return e[t]=a*g+h*u+c*f-l*d,e[t+1]=c*g+h*d+l*u-a*f,e[t+2]=l*g+h*f+a*d-c*u,e[t+3]=h*g-a*u-c*d-l*f,e}get x(){return this._x}set x(e){this._x=e,this._onChangeCallback()}get y(){return this._y}set y(e){this._y=e,this._onChangeCallback()}get z(){return this._z}set z(e){this._z=e,this._onChangeCallback()}get w(){return this._w}set w(e){this._w=e,this._onChangeCallback()}set(e,t,n,s){return this._x=e,this._y=t,this._z=n,this._w=s,this._onChangeCallback(),this}clone(){return new this.constructor(this._x,this._y,this._z,this._w)}copy(e){return this._x=e.x,this._y=e.y,this._z=e.z,this._w=e.w,this._onChangeCallback(),this}setFromEuler(e,t=!0){let n=e._x,s=e._y,r=e._z,o=e._order,a=Math.cos,c=Math.sin,l=a(n/2),h=a(s/2),u=a(r/2),d=c(n/2),f=c(s/2),g=c(r/2);switch(o){case"XYZ":this._x=d*h*u+l*f*g,this._y=l*f*u-d*h*g,this._z=l*h*g+d*f*u,this._w=l*h*u-d*f*g;break;case"YXZ":this._x=d*h*u+l*f*g,this._y=l*f*u-d*h*g,this._z=l*h*g-d*f*u,this._w=l*h*u+d*f*g;break;case"ZXY":this._x=d*h*u-l*f*g,this._y=l*f*u+d*h*g,this._z=l*h*g+d*f*u,this._w=l*h*u-d*f*g;break;case"ZYX":this._x=d*h*u-l*f*g,this._y=l*f*u+d*h*g,this._z=l*h*g-d*f*u,this._w=l*h*u+d*f*g;break;case"YZX":this._x=d*h*u+l*f*g,this._y=l*f*u+d*h*g,this._z=l*h*g-d*f*u,this._w=l*h*u-d*f*g;break;case"XZY":this._x=d*h*u-l*f*g,this._y=l*f*u-d*h*g,this._z=l*h*g+d*f*u,this._w=l*h*u+d*f*g;break;default:console.warn("THREE.Quaternion: .setFromEuler() encountered an unknown order: "+o)}return t===!0&&this._onChangeCallback(),this}setFromAxisAngle(e,t){let n=t/2,s=Math.sin(n);return this._x=e.x*s,this._y=e.y*s,this._z=e.z*s,this._w=Math.cos(n),this._onChangeCallback(),this}setFromRotationMatrix(e){let t=e.elements,n=t[0],s=t[4],r=t[8],o=t[1],a=t[5],c=t[9],l=t[2],h=t[6],u=t[10],d=n+a+u;if(d>0){let f=.5/Math.sqrt(d+1);this._w=.25/f,this._x=(h-c)*f,this._y=(r-l)*f,this._z=(o-s)*f}else if(n>a&&n>u){let f=2*Math.sqrt(1+n-a-u);this._w=(h-c)/f,this._x=.25*f,this._y=(s+o)/f,this._z=(r+l)/f}else if(a>u){let f=2*Math.sqrt(1+a-n-u);this._w=(r-l)/f,this._x=(s+o)/f,this._y=.25*f,this._z=(c+h)/f}else{let f=2*Math.sqrt(1+u-n-a);this._w=(o-s)/f,this._x=(r+l)/f,this._y=(c+h)/f,this._z=.25*f}return this._onChangeCallback(),this}setFromUnitVectors(e,t){let n=e.dot(t)+1;return n<Number.EPSILON?(n=0,Math.abs(e.x)>Math.abs(e.z)?(this._x=-e.y,this._y=e.x,this._z=0,this._w=n):(this._x=0,this._y=-e.z,this._z=e.y,this._w=n)):(this._x=e.y*t.z-e.z*t.y,this._y=e.z*t.x-e.x*t.z,this._z=e.x*t.y-e.y*t.x,this._w=n),this.normalize()}angleTo(e){return 2*Math.acos(Math.abs(Pt(this.dot(e),-1,1)))}rotateTowards(e,t){let n=this.angleTo(e);if(n===0)return this;let s=Math.min(1,t/n);return this.slerp(e,s),this}identity(){return this.set(0,0,0,1)}invert(){return this.conjugate()}conjugate(){return this._x*=-1,this._y*=-1,this._z*=-1,this._onChangeCallback(),this}dot(e){return this._x*e._x+this._y*e._y+this._z*e._z+this._w*e._w}lengthSq(){return this._x*this._x+this._y*this._y+this._z*this._z+this._w*this._w}length(){return Math.sqrt(this._x*this._x+this._y*this._y+this._z*this._z+this._w*this._w)}normalize(){let e=this.length();return e===0?(this._x=0,this._y=0,this._z=0,this._w=1):(e=1/e,this._x=this._x*e,this._y=this._y*e,this._z=this._z*e,this._w=this._w*e),this._onChangeCallback(),this}multiply(e){return this.multiplyQuaternions(this,e)}premultiply(e){return this.multiplyQuaternions(e,this)}multiplyQuaternions(e,t){let n=e._x,s=e._y,r=e._z,o=e._w,a=t._x,c=t._y,l=t._z,h=t._w;return this._x=n*h+o*a+s*l-r*c,this._y=s*h+o*c+r*a-n*l,this._z=r*h+o*l+n*c-s*a,this._w=o*h-n*a-s*c-r*l,this._onChangeCallback(),this}slerp(e,t){if(t===0)return this;if(t===1)return this.copy(e);let n=this._x,s=this._y,r=this._z,o=this._w,a=o*e._w+n*e._x+s*e._y+r*e._z;if(a<0?(this._w=-e._w,this._x=-e._x,this._y=-e._y,this._z=-e._z,a=-a):this.copy(e),a>=1)return this._w=o,this._x=n,this._y=s,this._z=r,this;let c=1-a*a;if(c<=Number.EPSILON){let f=1-t;return this._w=f*o+t*this._w,this._x=f*n+t*this._x,this._y=f*s+t*this._y,this._z=f*r+t*this._z,this.normalize(),this}let l=Math.sqrt(c),h=Math.atan2(l,a),u=Math.sin((1-t)*h)/l,d=Math.sin(t*h)/l;return this._w=o*u+this._w*d,this._x=n*u+this._x*d,this._y=s*u+this._y*d,this._z=r*u+this._z*d,this._onChangeCallback(),this}slerpQuaternions(e,t,n){return this.copy(e).slerp(t,n)}random(){let e=2*Math.PI*Math.random(),t=2*Math.PI*Math.random(),n=Math.random(),s=Math.sqrt(1-n),r=Math.sqrt(n);return this.set(s*Math.sin(e),s*Math.cos(e),r*Math.sin(t),r*Math.cos(t))}equals(e){return e._x===this._x&&e._y===this._y&&e._z===this._z&&e._w===this._w}fromArray(e,t=0){return this._x=e[t],this._y=e[t+1],this._z=e[t+2],this._w=e[t+3],this._onChangeCallback(),this}toArray(e=[],t=0){return e[t]=this._x,e[t+1]=this._y,e[t+2]=this._z,e[t+3]=this._w,e}fromBufferAttribute(e,t){return this._x=e.getX(t),this._y=e.getY(t),this._z=e.getZ(t),this._w=e.getW(t),this._onChangeCallback(),this}toJSON(){return this.toArray()}_onChange(e){return this._onChangeCallback=e,this}_onChangeCallback(){}*[Symbol.iterator](){yield this._x,yield this._y,yield this._z,yield this._w}},R=class i{constructor(e=0,t=0,n=0){i.prototype.isVector3=!0,this.x=e,this.y=t,this.z=n}set(e,t,n){return n===void 0&&(n=this.z),this.x=e,this.y=t,this.z=n,this}setScalar(e){return this.x=e,this.y=e,this.z=e,this}setX(e){return this.x=e,this}setY(e){return this.y=e,this}setZ(e){return this.z=e,this}setComponent(e,t){switch(e){case 0:this.x=t;break;case 1:this.y=t;break;case 2:this.z=t;break;default:throw new Error("index is out of range: "+e)}return this}getComponent(e){switch(e){case 0:return this.x;case 1:return this.y;case 2:return this.z;default:throw new Error("index is out of range: "+e)}}clone(){return new this.constructor(this.x,this.y,this.z)}copy(e){return this.x=e.x,this.y=e.y,this.z=e.z,this}add(e){return this.x+=e.x,this.y+=e.y,this.z+=e.z,this}addScalar(e){return this.x+=e,this.y+=e,this.z+=e,this}addVectors(e,t){return this.x=e.x+t.x,this.y=e.y+t.y,this.z=e.z+t.z,this}addScaledVector(e,t){return this.x+=e.x*t,this.y+=e.y*t,this.z+=e.z*t,this}sub(e){return this.x-=e.x,this.y-=e.y,this.z-=e.z,this}subScalar(e){return this.x-=e,this.y-=e,this.z-=e,this}subVectors(e,t){return this.x=e.x-t.x,this.y=e.y-t.y,this.z=e.z-t.z,this}multiply(e){return this.x*=e.x,this.y*=e.y,this.z*=e.z,this}multiplyScalar(e){return this.x*=e,this.y*=e,this.z*=e,this}multiplyVectors(e,t){return this.x=e.x*t.x,this.y=e.y*t.y,this.z=e.z*t.z,this}applyEuler(e){return this.applyQuaternion(Iu.setFromEuler(e))}applyAxisAngle(e,t){return this.applyQuaternion(Iu.setFromAxisAngle(e,t))}applyMatrix3(e){let t=this.x,n=this.y,s=this.z,r=e.elements;return this.x=r[0]*t+r[3]*n+r[6]*s,this.y=r[1]*t+r[4]*n+r[7]*s,this.z=r[2]*t+r[5]*n+r[8]*s,this}applyNormalMatrix(e){return this.applyMatrix3(e).normalize()}applyMatrix4(e){let t=this.x,n=this.y,s=this.z,r=e.elements,o=1/(r[3]*t+r[7]*n+r[11]*s+r[15]);return this.x=(r[0]*t+r[4]*n+r[8]*s+r[12])*o,this.y=(r[1]*t+r[5]*n+r[9]*s+r[13])*o,this.z=(r[2]*t+r[6]*n+r[10]*s+r[14])*o,this}applyQuaternion(e){let t=this.x,n=this.y,s=this.z,r=e.x,o=e.y,a=e.z,c=e.w,l=2*(o*s-a*n),h=2*(a*t-r*s),u=2*(r*n-o*t);return this.x=t+c*l+o*u-a*h,this.y=n+c*h+a*l-r*u,this.z=s+c*u+r*h-o*l,this}project(e){return this.applyMatrix4(e.matrixWorldInverse).applyMatrix4(e.projectionMatrix)}unproject(e){return this.applyMatrix4(e.projectionMatrixInverse).applyMatrix4(e.matrixWorld)}transformDirection(e){let t=this.x,n=this.y,s=this.z,r=e.elements;return this.x=r[0]*t+r[4]*n+r[8]*s,this.y=r[1]*t+r[5]*n+r[9]*s,this.z=r[2]*t+r[6]*n+r[10]*s,this.normalize()}divide(e){return this.x/=e.x,this.y/=e.y,this.z/=e.z,this}divideScalar(e){return this.multiplyScalar(1/e)}min(e){return this.x=Math.min(this.x,e.x),this.y=Math.min(this.y,e.y),this.z=Math.min(this.z,e.z),this}max(e){return this.x=Math.max(this.x,e.x),this.y=Math.max(this.y,e.y),this.z=Math.max(this.z,e.z),this}clamp(e,t){return this.x=Math.max(e.x,Math.min(t.x,this.x)),this.y=Math.max(e.y,Math.min(t.y,this.y)),this.z=Math.max(e.z,Math.min(t.z,this.z)),this}clampScalar(e,t){return this.x=Math.max(e,Math.min(t,this.x)),this.y=Math.max(e,Math.min(t,this.y)),this.z=Math.max(e,Math.min(t,this.z)),this}clampLength(e,t){let n=this.length();return this.divideScalar(n||1).multiplyScalar(Math.max(e,Math.min(t,n)))}floor(){return this.x=Math.floor(this.x),this.y=Math.floor(this.y),this.z=Math.floor(this.z),this}ceil(){return this.x=Math.ceil(this.x),this.y=Math.ceil(this.y),this.z=Math.ceil(this.z),this}round(){return this.x=Math.round(this.x),this.y=Math.round(this.y),this.z=Math.round(this.z),this}roundToZero(){return this.x=Math.trunc(this.x),this.y=Math.trunc(this.y),this.z=Math.trunc(this.z),this}negate(){return this.x=-this.x,this.y=-this.y,this.z=-this.z,this}dot(e){return this.x*e.x+this.y*e.y+this.z*e.z}lengthSq(){return this.x*this.x+this.y*this.y+this.z*this.z}length(){return Math.sqrt(this.x*this.x+this.y*this.y+this.z*this.z)}manhattanLength(){return Math.abs(this.x)+Math.abs(this.y)+Math.abs(this.z)}normalize(){return this.divideScalar(this.length()||1)}setLength(e){return this.normalize().multiplyScalar(e)}lerp(e,t){return this.x+=(e.x-this.x)*t,this.y+=(e.y-this.y)*t,this.z+=(e.z-this.z)*t,this}lerpVectors(e,t,n){return this.x=e.x+(t.x-e.x)*n,this.y=e.y+(t.y-e.y)*n,this.z=e.z+(t.z-e.z)*n,this}cross(e){return this.crossVectors(this,e)}crossVectors(e,t){let n=e.x,s=e.y,r=e.z,o=t.x,a=t.y,c=t.z;return this.x=s*c-r*a,this.y=r*o-n*c,this.z=n*a-s*o,this}projectOnVector(e){let t=e.lengthSq();if(t===0)return this.set(0,0,0);let n=e.dot(this)/t;return this.copy(e).multiplyScalar(n)}projectOnPlane(e){return Na.copy(this).projectOnVector(e),this.sub(Na)}reflect(e){return this.sub(Na.copy(e).multiplyScalar(2*this.dot(e)))}angleTo(e){let t=Math.sqrt(this.lengthSq()*e.lengthSq());if(t===0)return Math.PI/2;let n=this.dot(e)/t;return Math.acos(Pt(n,-1,1))}distanceTo(e){return Math.sqrt(this.distanceToSquared(e))}distanceToSquared(e){let t=this.x-e.x,n=this.y-e.y,s=this.z-e.z;return t*t+n*n+s*s}manhattanDistanceTo(e){return Math.abs(this.x-e.x)+Math.abs(this.y-e.y)+Math.abs(this.z-e.z)}setFromSpherical(e){return this.setFromSphericalCoords(e.radius,e.phi,e.theta)}setFromSphericalCoords(e,t,n){let s=Math.sin(t)*e;return this.x=s*Math.sin(n),this.y=Math.cos(t)*e,this.z=s*Math.cos(n),this}setFromCylindrical(e){return this.setFromCylindricalCoords(e.radius,e.theta,e.y)}setFromCylindricalCoords(e,t,n){return this.x=e*Math.sin(t),this.y=n,this.z=e*Math.cos(t),this}setFromMatrixPosition(e){let t=e.elements;return this.x=t[12],this.y=t[13],this.z=t[14],this}setFromMatrixScale(e){let t=this.setFromMatrixColumn(e,0).length(),n=this.setFromMatrixColumn(e,1).length(),s=this.setFromMatrixColumn(e,2).length();return this.x=t,this.y=n,this.z=s,this}setFromMatrixColumn(e,t){return this.fromArray(e.elements,t*4)}setFromMatrix3Column(e,t){return this.fromArray(e.elements,t*3)}setFromEuler(e){return this.x=e._x,this.y=e._y,this.z=e._z,this}setFromColor(e){return this.x=e.r,this.y=e.g,this.z=e.b,this}equals(e){return e.x===this.x&&e.y===this.y&&e.z===this.z}fromArray(e,t=0){return this.x=e[t],this.y=e[t+1],this.z=e[t+2],this}toArray(e=[],t=0){return e[t]=this.x,e[t+1]=this.y,e[t+2]=this.z,e}fromBufferAttribute(e,t){return this.x=e.getX(t),this.y=e.getY(t),this.z=e.getZ(t),this}random(){return this.x=Math.random(),this.y=Math.random(),this.z=Math.random(),this}randomDirection(){let e=Math.random()*Math.PI*2,t=Math.random()*2-1,n=Math.sqrt(1-t*t);return this.x=n*Math.cos(e),this.y=t,this.z=n*Math.sin(e),this}*[Symbol.iterator](){yield this.x,yield this.y,yield this.z}},Na=new R,Iu=new si,yn=class{constructor(e=new R(1/0,1/0,1/0),t=new R(-1/0,-1/0,-1/0)){this.isBox3=!0,this.min=e,this.max=t}set(e,t){return this.min.copy(e),this.max.copy(t),this}setFromArray(e){this.makeEmpty();for(let t=0,n=e.length;t<n;t+=3)this.expandByPoint(dn.fromArray(e,t));return this}setFromBufferAttribute(e){this.makeEmpty();for(let t=0,n=e.count;t<n;t++)this.expandByPoint(dn.fromBufferAttribute(e,t));return this}setFromPoints(e){this.makeEmpty();for(let t=0,n=e.length;t<n;t++)this.expandByPoint(e[t]);return this}setFromCenterAndSize(e,t){let n=dn.copy(t).multiplyScalar(.5);return this.min.copy(e).sub(n),this.max.copy(e).add(n),this}setFromObject(e,t=!1){return this.makeEmpty(),this.expandByObject(e,t)}clone(){return new this.constructor().copy(this)}copy(e){return this.min.copy(e.min),this.max.copy(e.max),this}makeEmpty(){return this.min.x=this.min.y=this.min.z=1/0,this.max.x=this.max.y=this.max.z=-1/0,this}isEmpty(){return this.max.x<this.min.x||this.max.y<this.min.y||this.max.z<this.min.z}getCenter(e){return this.isEmpty()?e.set(0,0,0):e.addVectors(this.min,this.max).multiplyScalar(.5)}getSize(e){return this.isEmpty()?e.set(0,0,0):e.subVectors(this.max,this.min)}expandByPoint(e){return this.min.min(e),this.max.max(e),this}expandByVector(e){return this.min.sub(e),this.max.add(e),this}expandByScalar(e){return this.min.addScalar(-e),this.max.addScalar(e),this}expandByObject(e,t=!1){e.updateWorldMatrix(!1,!1);let n=e.geometry;if(n!==void 0){let r=n.getAttribute("position");if(t===!0&&r!==void 0&&e.isInstancedMesh!==!0)for(let o=0,a=r.count;o<a;o++)e.isMesh===!0?e.getVertexPosition(o,dn):dn.fromBufferAttribute(r,o),dn.applyMatrix4(e.matrixWorld),this.expandByPoint(dn);else e.boundingBox!==void 0?(e.boundingBox===null&&e.computeBoundingBox(),Pr.copy(e.boundingBox)):(n.boundingBox===null&&n.computeBoundingBox(),Pr.copy(n.boundingBox)),Pr.applyMatrix4(e.matrixWorld),this.union(Pr)}let s=e.children;for(let r=0,o=s.length;r<o;r++)this.expandByObject(s[r],t);return this}containsPoint(e){return e.x>=this.min.x&&e.x<=this.max.x&&e.y>=this.min.y&&e.y<=this.max.y&&e.z>=this.min.z&&e.z<=this.max.z}containsBox(e){return this.min.x<=e.min.x&&e.max.x<=this.max.x&&this.min.y<=e.min.y&&e.max.y<=this.max.y&&this.min.z<=e.min.z&&e.max.z<=this.max.z}getParameter(e,t){return t.set((e.x-this.min.x)/(this.max.x-this.min.x),(e.y-this.min.y)/(this.max.y-this.min.y),(e.z-this.min.z)/(this.max.z-this.min.z))}intersectsBox(e){return e.max.x>=this.min.x&&e.min.x<=this.max.x&&e.max.y>=this.min.y&&e.min.y<=this.max.y&&e.max.z>=this.min.z&&e.min.z<=this.max.z}intersectsSphere(e){return this.clampPoint(e.center,dn),dn.distanceToSquared(e.center)<=e.radius*e.radius}intersectsPlane(e){let t,n;return e.normal.x>0?(t=e.normal.x*this.min.x,n=e.normal.x*this.max.x):(t=e.normal.x*this.max.x,n=e.normal.x*this.min.x),e.normal.y>0?(t+=e.normal.y*this.min.y,n+=e.normal.y*this.max.y):(t+=e.normal.y*this.max.y,n+=e.normal.y*this.min.y),e.normal.z>0?(t+=e.normal.z*this.min.z,n+=e.normal.z*this.max.z):(t+=e.normal.z*this.max.z,n+=e.normal.z*this.min.z),t<=-e.constant&&n>=-e.constant}intersectsTriangle(e){if(this.isEmpty())return!1;this.getCenter(Ps),Ir.subVectors(this.max,Ps),Fi.subVectors(e.a,Ps),Bi.subVectors(e.b,Ps),zi.subVectors(e.c,Ps),Yn.subVectors(Bi,Fi),$n.subVectors(zi,Bi),hi.subVectors(Fi,zi);let t=[0,-Yn.z,Yn.y,0,-$n.z,$n.y,0,-hi.z,hi.y,Yn.z,0,-Yn.x,$n.z,0,-$n.x,hi.z,0,-hi.x,-Yn.y,Yn.x,0,-$n.y,$n.x,0,-hi.y,hi.x,0];return!ka(t,Fi,Bi,zi,Ir)||(t=[1,0,0,0,1,0,0,0,1],!ka(t,Fi,Bi,zi,Ir))?!1:(Lr.crossVectors(Yn,$n),t=[Lr.x,Lr.y,Lr.z],ka(t,Fi,Bi,zi,Ir))}clampPoint(e,t){return t.copy(e).clamp(this.min,this.max)}distanceToPoint(e){return this.clampPoint(e,dn).distanceTo(e)}getBoundingSphere(e){return this.isEmpty()?e.makeEmpty():(this.getCenter(e.center),e.radius=this.getSize(dn).length()*.5),e}intersect(e){return this.min.max(e.min),this.max.min(e.max),this.isEmpty()&&this.makeEmpty(),this}union(e){return this.min.min(e.min),this.max.max(e.max),this}applyMatrix4(e){return this.isEmpty()?this:(In[0].set(this.min.x,this.min.y,this.min.z).applyMatrix4(e),In[1].set(this.min.x,this.min.y,this.max.z).applyMatrix4(e),In[2].set(this.min.x,this.max.y,this.min.z).applyMatrix4(e),In[3].set(this.min.x,this.max.y,this.max.z).applyMatrix4(e),In[4].set(this.max.x,this.min.y,this.min.z).applyMatrix4(e),In[5].set(this.max.x,this.min.y,this.max.z).applyMatrix4(e),In[6].set(this.max.x,this.max.y,this.min.z).applyMatrix4(e),In[7].set(this.max.x,this.max.y,this.max.z).applyMatrix4(e),this.setFromPoints(In),this)}translate(e){return this.min.add(e),this.max.add(e),this}equals(e){return e.min.equals(this.min)&&e.max.equals(this.max)}},In=[new R,new R,new R,new R,new R,new R,new R,new R],dn=new R,Pr=new yn,Fi=new R,Bi=new R,zi=new R,Yn=new R,$n=new R,hi=new R,Ps=new R,Ir=new R,Lr=new R,ui=new R;function ka(i,e,t,n,s){for(let r=0,o=i.length-3;r<=o;r+=3){ui.fromArray(i,r);let a=s.x*Math.abs(ui.x)+s.y*Math.abs(ui.y)+s.z*Math.abs(ui.z),c=e.dot(ui),l=t.dot(ui),h=n.dot(ui);if(Math.max(-Math.max(c,l,h),Math.min(c,l,h))>a)return!1}return!0}var om=new yn,Is=new R,Oa=new R,us=class{constructor(e=new R,t=-1){this.isSphere=!0,this.center=e,this.radius=t}set(e,t){return this.center.copy(e),this.radius=t,this}setFromPoints(e,t){let n=this.center;t!==void 0?n.copy(t):om.setFromPoints(e).getCenter(n);let s=0;for(let r=0,o=e.length;r<o;r++)s=Math.max(s,n.distanceToSquared(e[r]));return this.radius=Math.sqrt(s),this}copy(e){return this.center.copy(e.center),this.radius=e.radius,this}isEmpty(){return this.radius<0}makeEmpty(){return this.center.set(0,0,0),this.radius=-1,this}containsPoint(e){return e.distanceToSquared(this.center)<=this.radius*this.radius}distanceToPoint(e){return e.distanceTo(this.center)-this.radius}intersectsSphere(e){let t=this.radius+e.radius;return e.center.distanceToSquared(this.center)<=t*t}intersectsBox(e){return e.intersectsSphere(this)}intersectsPlane(e){return Math.abs(e.distanceToPoint(this.center))<=this.radius}clampPoint(e,t){let n=this.center.distanceToSquared(e);return t.copy(e),n>this.radius*this.radius&&(t.sub(this.center).normalize(),t.multiplyScalar(this.radius).add(this.center)),t}getBoundingBox(e){return this.isEmpty()?(e.makeEmpty(),e):(e.set(this.center,this.center),e.expandByScalar(this.radius),e)}applyMatrix4(e){return this.center.applyMatrix4(e),this.radius=this.radius*e.getMaxScaleOnAxis(),this}translate(e){return this.center.add(e),this}expandByPoint(e){if(this.isEmpty())return this.center.copy(e),this.radius=0,this;Is.subVectors(e,this.center);let t=Is.lengthSq();if(t>this.radius*this.radius){let n=Math.sqrt(t),s=(n-this.radius)*.5;this.center.addScaledVector(Is,s/n),this.radius+=s}return this}union(e){return e.isEmpty()?this:this.isEmpty()?(this.copy(e),this):(this.center.equals(e.center)===!0?this.radius=Math.max(this.radius,e.radius):(Oa.subVectors(e.center,this.center).setLength(e.radius),this.expandByPoint(Is.copy(e.center).add(Oa)),this.expandByPoint(Is.copy(e.center).sub(Oa))),this)}equals(e){return e.center.equals(this.center)&&e.radius===this.radius}clone(){return new this.constructor().copy(this)}},Ln=new R,Fa=new R,Dr=new R,Jn=new R,Ba=new R,Ur=new R,za=new R,vo=class{constructor(e=new R,t=new R(0,0,-1)){this.origin=e,this.direction=t}set(e,t){return this.origin.copy(e),this.direction.copy(t),this}copy(e){return this.origin.copy(e.origin),this.direction.copy(e.direction),this}at(e,t){return t.copy(this.origin).addScaledVector(this.direction,e)}lookAt(e){return this.direction.copy(e).sub(this.origin).normalize(),this}recast(e){return this.origin.copy(this.at(e,Ln)),this}closestPointToPoint(e,t){t.subVectors(e,this.origin);let n=t.dot(this.direction);return n<0?t.copy(this.origin):t.copy(this.origin).addScaledVector(this.direction,n)}distanceToPoint(e){return Math.sqrt(this.distanceSqToPoint(e))}distanceSqToPoint(e){let t=Ln.subVectors(e,this.origin).dot(this.direction);return t<0?this.origin.distanceToSquared(e):(Ln.copy(this.origin).addScaledVector(this.direction,t),Ln.distanceToSquared(e))}distanceSqToSegment(e,t,n,s){Fa.copy(e).add(t).multiplyScalar(.5),Dr.copy(t).sub(e).normalize(),Jn.copy(this.origin).sub(Fa);let r=e.distanceTo(t)*.5,o=-this.direction.dot(Dr),a=Jn.dot(this.direction),c=-Jn.dot(Dr),l=Jn.lengthSq(),h=Math.abs(1-o*o),u,d,f,g;if(h>0)if(u=o*c-a,d=o*a-c,g=r*h,u>=0)if(d>=-g)if(d<=g){let y=1/h;u*=y,d*=y,f=u*(u+o*d+2*a)+d*(o*u+d+2*c)+l}else d=r,u=Math.max(0,-(o*d+a)),f=-u*u+d*(d+2*c)+l;else d=-r,u=Math.max(0,-(o*d+a)),f=-u*u+d*(d+2*c)+l;else d<=-g?(u=Math.max(0,-(-o*r+a)),d=u>0?-r:Math.min(Math.max(-r,-c),r),f=-u*u+d*(d+2*c)+l):d<=g?(u=0,d=Math.min(Math.max(-r,-c),r),f=d*(d+2*c)+l):(u=Math.max(0,-(o*r+a)),d=u>0?r:Math.min(Math.max(-r,-c),r),f=-u*u+d*(d+2*c)+l);else d=o>0?-r:r,u=Math.max(0,-(o*d+a)),f=-u*u+d*(d+2*c)+l;return n&&n.copy(this.origin).addScaledVector(this.direction,u),s&&s.copy(Fa).addScaledVector(Dr,d),f}intersectSphere(e,t){Ln.subVectors(e.center,this.origin);let n=Ln.dot(this.direction),s=Ln.dot(Ln)-n*n,r=e.radius*e.radius;if(s>r)return null;let o=Math.sqrt(r-s),a=n-o,c=n+o;return c<0?null:a<0?this.at(c,t):this.at(a,t)}intersectsSphere(e){return this.distanceSqToPoint(e.center)<=e.radius*e.radius}distanceToPlane(e){let t=e.normal.dot(this.direction);if(t===0)return e.distanceToPoint(this.origin)===0?0:null;let n=-(this.origin.dot(e.normal)+e.constant)/t;return n>=0?n:null}intersectPlane(e,t){let n=this.distanceToPlane(e);return n===null?null:this.at(n,t)}intersectsPlane(e){let t=e.distanceToPoint(this.origin);return t===0||e.normal.dot(this.direction)*t<0}intersectBox(e,t){let n,s,r,o,a,c,l=1/this.direction.x,h=1/this.direction.y,u=1/this.direction.z,d=this.origin;return l>=0?(n=(e.min.x-d.x)*l,s=(e.max.x-d.x)*l):(n=(e.max.x-d.x)*l,s=(e.min.x-d.x)*l),h>=0?(r=(e.min.y-d.y)*h,o=(e.max.y-d.y)*h):(r=(e.max.y-d.y)*h,o=(e.min.y-d.y)*h),n>o||r>s||((r>n||isNaN(n))&&(n=r),(o<s||isNaN(s))&&(s=o),u>=0?(a=(e.min.z-d.z)*u,c=(e.max.z-d.z)*u):(a=(e.max.z-d.z)*u,c=(e.min.z-d.z)*u),n>c||a>s)||((a>n||n!==n)&&(n=a),(c<s||s!==s)&&(s=c),s<0)?null:this.at(n>=0?n:s,t)}intersectsBox(e){return this.intersectBox(e,Ln)!==null}intersectTriangle(e,t,n,s,r){Ba.subVectors(t,e),Ur.subVectors(n,e),za.crossVectors(Ba,Ur);let o=this.direction.dot(za),a;if(o>0){if(s)return null;a=1}else if(o<0)a=-1,o=-o;else return null;Jn.subVectors(this.origin,e);let c=a*this.direction.dot(Ur.crossVectors(Jn,Ur));if(c<0)return null;let l=a*this.direction.dot(Ba.cross(Jn));if(l<0||c+l>o)return null;let h=-a*Jn.dot(za);return h<0?null:this.at(h/o,r)}applyMatrix4(e){return this.origin.applyMatrix4(e),this.direction.transformDirection(e),this}equals(e){return e.origin.equals(this.origin)&&e.direction.equals(this.direction)}clone(){return new this.constructor().copy(this)}},_t=class i{constructor(e,t,n,s,r,o,a,c,l,h,u,d,f,g,y,m){i.prototype.isMatrix4=!0,this.elements=[1,0,0,0,0,1,0,0,0,0,1,0,0,0,0,1],e!==void 0&&this.set(e,t,n,s,r,o,a,c,l,h,u,d,f,g,y,m)}set(e,t,n,s,r,o,a,c,l,h,u,d,f,g,y,m){let p=this.elements;return p[0]=e,p[4]=t,p[8]=n,p[12]=s,p[1]=r,p[5]=o,p[9]=a,p[13]=c,p[2]=l,p[6]=h,p[10]=u,p[14]=d,p[3]=f,p[7]=g,p[11]=y,p[15]=m,this}identity(){return this.set(1,0,0,0,0,1,0,0,0,0,1,0,0,0,0,1),this}clone(){return new i().fromArray(this.elements)}copy(e){let t=this.elements,n=e.elements;return t[0]=n[0],t[1]=n[1],t[2]=n[2],t[3]=n[3],t[4]=n[4],t[5]=n[5],t[6]=n[6],t[7]=n[7],t[8]=n[8],t[9]=n[9],t[10]=n[10],t[11]=n[11],t[12]=n[12],t[13]=n[13],t[14]=n[14],t[15]=n[15],this}copyPosition(e){let t=this.elements,n=e.elements;return t[12]=n[12],t[13]=n[13],t[14]=n[14],this}setFromMatrix3(e){let t=e.elements;return this.set(t[0],t[3],t[6],0,t[1],t[4],t[7],0,t[2],t[5],t[8],0,0,0,0,1),this}extractBasis(e,t,n){return e.setFromMatrixColumn(this,0),t.setFromMatrixColumn(this,1),n.setFromMatrixColumn(this,2),this}makeBasis(e,t,n){return this.set(e.x,t.x,n.x,0,e.y,t.y,n.y,0,e.z,t.z,n.z,0,0,0,0,1),this}extractRotation(e){let t=this.elements,n=e.elements,s=1/Hi.setFromMatrixColumn(e,0).length(),r=1/Hi.setFromMatrixColumn(e,1).length(),o=1/Hi.setFromMatrixColumn(e,2).length();return t[0]=n[0]*s,t[1]=n[1]*s,t[2]=n[2]*s,t[3]=0,t[4]=n[4]*r,t[5]=n[5]*r,t[6]=n[6]*r,t[7]=0,t[8]=n[8]*o,t[9]=n[9]*o,t[10]=n[10]*o,t[11]=0,t[12]=0,t[13]=0,t[14]=0,t[15]=1,this}makeRotationFromEuler(e){let t=this.elements,n=e.x,s=e.y,r=e.z,o=Math.cos(n),a=Math.sin(n),c=Math.cos(s),l=Math.sin(s),h=Math.cos(r),u=Math.sin(r);if(e.order==="XYZ"){let d=o*h,f=o*u,g=a*h,y=a*u;t[0]=c*h,t[4]=-c*u,t[8]=l,t[1]=f+g*l,t[5]=d-y*l,t[9]=-a*c,t[2]=y-d*l,t[6]=g+f*l,t[10]=o*c}else if(e.order==="YXZ"){let d=c*h,f=c*u,g=l*h,y=l*u;t[0]=d+y*a,t[4]=g*a-f,t[8]=o*l,t[1]=o*u,t[5]=o*h,t[9]=-a,t[2]=f*a-g,t[6]=y+d*a,t[10]=o*c}else if(e.order==="ZXY"){let d=c*h,f=c*u,g=l*h,y=l*u;t[0]=d-y*a,t[4]=-o*u,t[8]=g+f*a,t[1]=f+g*a,t[5]=o*h,t[9]=y-d*a,t[2]=-o*l,t[6]=a,t[10]=o*c}else if(e.order==="ZYX"){let d=o*h,f=o*u,g=a*h,y=a*u;t[0]=c*h,t[4]=g*l-f,t[8]=d*l+y,t[1]=c*u,t[5]=y*l+d,t[9]=f*l-g,t[2]=-l,t[6]=a*c,t[10]=o*c}else if(e.order==="YZX"){let d=o*c,f=o*l,g=a*c,y=a*l;t[0]=c*h,t[4]=y-d*u,t[8]=g*u+f,t[1]=u,t[5]=o*h,t[9]=-a*h,t[2]=-l*h,t[6]=f*u+g,t[10]=d-y*u}else if(e.order==="XZY"){let d=o*c,f=o*l,g=a*c,y=a*l;t[0]=c*h,t[4]=-u,t[8]=l*h,t[1]=d*u+y,t[5]=o*h,t[9]=f*u-g,t[2]=g*u-f,t[6]=a*h,t[10]=y*u+d}return t[3]=0,t[7]=0,t[11]=0,t[12]=0,t[13]=0,t[14]=0,t[15]=1,this}makeRotationFromQuaternion(e){return this.compose(am,e,cm)}lookAt(e,t,n){let s=this.elements;return Qt.subVectors(e,t),Qt.lengthSq()===0&&(Qt.z=1),Qt.normalize(),Zn.crossVectors(n,Qt),Zn.lengthSq()===0&&(Math.abs(n.z)===1?Qt.x+=1e-4:Qt.z+=1e-4,Qt.normalize(),Zn.crossVectors(n,Qt)),Zn.normalize(),Nr.crossVectors(Qt,Zn),s[0]=Zn.x,s[4]=Nr.x,s[8]=Qt.x,s[1]=Zn.y,s[5]=Nr.y,s[9]=Qt.y,s[2]=Zn.z,s[6]=Nr.z,s[10]=Qt.z,this}multiply(e){return this.multiplyMatrices(this,e)}premultiply(e){return this.multiplyMatrices(e,this)}multiplyMatrices(e,t){let n=e.elements,s=t.elements,r=this.elements,o=n[0],a=n[4],c=n[8],l=n[12],h=n[1],u=n[5],d=n[9],f=n[13],g=n[2],y=n[6],m=n[10],p=n[14],M=n[3],x=n[7],b=n[11],D=n[15],A=s[0],C=s[4],P=s[8],z=s[12],_=s[1],S=s[5],L=s[9],N=s[13],H=s[2],ne=s[6],V=s[10],se=s[14],q=s[3],ve=s[7],be=s[11],Me=s[15];return r[0]=o*A+a*_+c*H+l*q,r[4]=o*C+a*S+c*ne+l*ve,r[8]=o*P+a*L+c*V+l*be,r[12]=o*z+a*N+c*se+l*Me,r[1]=h*A+u*_+d*H+f*q,r[5]=h*C+u*S+d*ne+f*ve,r[9]=h*P+u*L+d*V+f*be,r[13]=h*z+u*N+d*se+f*Me,r[2]=g*A+y*_+m*H+p*q,r[6]=g*C+y*S+m*ne+p*ve,r[10]=g*P+y*L+m*V+p*be,r[14]=g*z+y*N+m*se+p*Me,r[3]=M*A+x*_+b*H+D*q,r[7]=M*C+x*S+b*ne+D*ve,r[11]=M*P+x*L+b*V+D*be,r[15]=M*z+x*N+b*se+D*Me,this}multiplyScalar(e){let t=this.elements;return t[0]*=e,t[4]*=e,t[8]*=e,t[12]*=e,t[1]*=e,t[5]*=e,t[9]*=e,t[13]*=e,t[2]*=e,t[6]*=e,t[10]*=e,t[14]*=e,t[3]*=e,t[7]*=e,t[11]*=e,t[15]*=e,this}determinant(){let e=this.elements,t=e[0],n=e[4],s=e[8],r=e[12],o=e[1],a=e[5],c=e[9],l=e[13],h=e[2],u=e[6],d=e[10],f=e[14],g=e[3],y=e[7],m=e[11],p=e[15];return g*(+r*c*u-s*l*u-r*a*d+n*l*d+s*a*f-n*c*f)+y*(+t*c*f-t*l*d+r*o*d-s*o*f+s*l*h-r*c*h)+m*(+t*l*u-t*a*f-r*o*u+n*o*f+r*a*h-n*l*h)+p*(-s*a*h-t*c*u+t*a*d+s*o*u-n*o*d+n*c*h)}transpose(){let e=this.elements,t;return t=e[1],e[1]=e[4],e[4]=t,t=e[2],e[2]=e[8],e[8]=t,t=e[6],e[6]=e[9],e[9]=t,t=e[3],e[3]=e[12],e[12]=t,t=e[7],e[7]=e[13],e[13]=t,t=e[11],e[11]=e[14],e[14]=t,this}setPosition(e,t,n){let s=this.elements;return e.isVector3?(s[12]=e.x,s[13]=e.y,s[14]=e.z):(s[12]=e,s[13]=t,s[14]=n),this}invert(){let e=this.elements,t=e[0],n=e[1],s=e[2],r=e[3],o=e[4],a=e[5],c=e[6],l=e[7],h=e[8],u=e[9],d=e[10],f=e[11],g=e[12],y=e[13],m=e[14],p=e[15],M=u*m*l-y*d*l+y*c*f-a*m*f-u*c*p+a*d*p,x=g*d*l-h*m*l-g*c*f+o*m*f+h*c*p-o*d*p,b=h*y*l-g*u*l+g*a*f-o*y*f-h*a*p+o*u*p,D=g*u*c-h*y*c-g*a*d+o*y*d+h*a*m-o*u*m,A=t*M+n*x+s*b+r*D;if(A===0)return this.set(0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0);let C=1/A;return e[0]=M*C,e[1]=(y*d*r-u*m*r-y*s*f+n*m*f+u*s*p-n*d*p)*C,e[2]=(a*m*r-y*c*r+y*s*l-n*m*l-a*s*p+n*c*p)*C,e[3]=(u*c*r-a*d*r-u*s*l+n*d*l+a*s*f-n*c*f)*C,e[4]=x*C,e[5]=(h*m*r-g*d*r+g*s*f-t*m*f-h*s*p+t*d*p)*C,e[6]=(g*c*r-o*m*r-g*s*l+t*m*l+o*s*p-t*c*p)*C,e[7]=(o*d*r-h*c*r+h*s*l-t*d*l-o*s*f+t*c*f)*C,e[8]=b*C,e[9]=(g*u*r-h*y*r-g*n*f+t*y*f+h*n*p-t*u*p)*C,e[10]=(o*y*r-g*a*r+g*n*l-t*y*l-o*n*p+t*a*p)*C,e[11]=(h*a*r-o*u*r-h*n*l+t*u*l+o*n*f-t*a*f)*C,e[12]=D*C,e[13]=(h*y*s-g*u*s+g*n*d-t*y*d-h*n*m+t*u*m)*C,e[14]=(g*a*s-o*y*s-g*n*c+t*y*c+o*n*m-t*a*m)*C,e[15]=(o*u*s-h*a*s+h*n*c-t*u*c-o*n*d+t*a*d)*C,this}scale(e){let t=this.elements,n=e.x,s=e.y,r=e.z;return t[0]*=n,t[4]*=s,t[8]*=r,t[1]*=n,t[5]*=s,t[9]*=r,t[2]*=n,t[6]*=s,t[10]*=r,t[3]*=n,t[7]*=s,t[11]*=r,this}getMaxScaleOnAxis(){let e=this.elements,t=e[0]*e[0]+e[1]*e[1]+e[2]*e[2],n=e[4]*e[4]+e[5]*e[5]+e[6]*e[6],s=e[8]*e[8]+e[9]*e[9]+e[10]*e[10];return Math.sqrt(Math.max(t,n,s))}makeTranslation(e,t,n){return e.isVector3?this.set(1,0,0,e.x,0,1,0,e.y,0,0,1,e.z,0,0,0,1):this.set(1,0,0,e,0,1,0,t,0,0,1,n,0,0,0,1),this}makeRotationX(e){let t=Math.cos(e),n=Math.sin(e);return this.set(1,0,0,0,0,t,-n,0,0,n,t,0,0,0,0,1),this}makeRotationY(e){let t=Math.cos(e),n=Math.sin(e);return this.set(t,0,n,0,0,1,0,0,-n,0,t,0,0,0,0,1),this}makeRotationZ(e){let t=Math.cos(e),n=Math.sin(e);return this.set(t,-n,0,0,n,t,0,0,0,0,1,0,0,0,0,1),this}makeRotationAxis(e,t){let n=Math.cos(t),s=Math.sin(t),r=1-n,o=e.x,a=e.y,c=e.z,l=r*o,h=r*a;return this.set(l*o+n,l*a-s*c,l*c+s*a,0,l*a+s*c,h*a+n,h*c-s*o,0,l*c-s*a,h*c+s*o,r*c*c+n,0,0,0,0,1),this}makeScale(e,t,n){return this.set(e,0,0,0,0,t,0,0,0,0,n,0,0,0,0,1),this}makeShear(e,t,n,s,r,o){return this.set(1,n,r,0,e,1,o,0,t,s,1,0,0,0,0,1),this}compose(e,t,n){let s=this.elements,r=t._x,o=t._y,a=t._z,c=t._w,l=r+r,h=o+o,u=a+a,d=r*l,f=r*h,g=r*u,y=o*h,m=o*u,p=a*u,M=c*l,x=c*h,b=c*u,D=n.x,A=n.y,C=n.z;return s[0]=(1-(y+p))*D,s[1]=(f+b)*D,s[2]=(g-x)*D,s[3]=0,s[4]=(f-b)*A,s[5]=(1-(d+p))*A,s[6]=(m+M)*A,s[7]=0,s[8]=(g+x)*C,s[9]=(m-M)*C,s[10]=(1-(d+y))*C,s[11]=0,s[12]=e.x,s[13]=e.y,s[14]=e.z,s[15]=1,this}decompose(e,t,n){let s=this.elements,r=Hi.set(s[0],s[1],s[2]).length(),o=Hi.set(s[4],s[5],s[6]).length(),a=Hi.set(s[8],s[9],s[10]).length();this.determinant()<0&&(r=-r),e.x=s[12],e.y=s[13],e.z=s[14],fn.copy(this);let l=1/r,h=1/o,u=1/a;return fn.elements[0]*=l,fn.elements[1]*=l,fn.elements[2]*=l,fn.elements[4]*=h,fn.elements[5]*=h,fn.elements[6]*=h,fn.elements[8]*=u,fn.elements[9]*=u,fn.elements[10]*=u,t.setFromRotationMatrix(fn),n.x=r,n.y=o,n.z=a,this}makePerspective(e,t,n,s,r,o,a=zn){let c=this.elements,l=2*r/(t-e),h=2*r/(n-s),u=(t+e)/(t-e),d=(n+s)/(n-s),f,g;if(a===zn)f=-(o+r)/(o-r),g=-2*o*r/(o-r);else if(a===go)f=-o/(o-r),g=-o*r/(o-r);else throw new Error("THREE.Matrix4.makePerspective(): Invalid coordinate system: "+a);return c[0]=l,c[4]=0,c[8]=u,c[12]=0,c[1]=0,c[5]=h,c[9]=d,c[13]=0,c[2]=0,c[6]=0,c[10]=f,c[14]=g,c[3]=0,c[7]=0,c[11]=-1,c[15]=0,this}makeOrthographic(e,t,n,s,r,o,a=zn){let c=this.elements,l=1/(t-e),h=1/(n-s),u=1/(o-r),d=(t+e)*l,f=(n+s)*h,g,y;if(a===zn)g=(o+r)*u,y=-2*u;else if(a===go)g=r*u,y=-1*u;else throw new Error("THREE.Matrix4.makeOrthographic(): Invalid coordinate system: "+a);return c[0]=2*l,c[4]=0,c[8]=0,c[12]=-d,c[1]=0,c[5]=2*h,c[9]=0,c[13]=-f,c[2]=0,c[6]=0,c[10]=y,c[14]=-g,c[3]=0,c[7]=0,c[11]=0,c[15]=1,this}equals(e){let t=this.elements,n=e.elements;for(let s=0;s<16;s++)if(t[s]!==n[s])return!1;return!0}fromArray(e,t=0){for(let n=0;n<16;n++)this.elements[n]=e[n+t];return this}toArray(e=[],t=0){let n=this.elements;return e[t]=n[0],e[t+1]=n[1],e[t+2]=n[2],e[t+3]=n[3],e[t+4]=n[4],e[t+5]=n[5],e[t+6]=n[6],e[t+7]=n[7],e[t+8]=n[8],e[t+9]=n[9],e[t+10]=n[10],e[t+11]=n[11],e[t+12]=n[12],e[t+13]=n[13],e[t+14]=n[14],e[t+15]=n[15],e}},Hi=new R,fn=new _t,am=new R(0,0,0),cm=new R(1,1,1),Zn=new R,Nr=new R,Qt=new R,Lu=new _t,Du=new si,En=class i{constructor(e=0,t=0,n=0,s=i.DEFAULT_ORDER){this.isEuler=!0,this._x=e,this._y=t,this._z=n,this._order=s}get x(){return this._x}set x(e){this._x=e,this._onChangeCallback()}get y(){return this._y}set y(e){this._y=e,this._onChangeCallback()}get z(){return this._z}set z(e){this._z=e,this._onChangeCallback()}get order(){return this._order}set order(e){this._order=e,this._onChangeCallback()}set(e,t,n,s=this._order){return this._x=e,this._y=t,this._z=n,this._order=s,this._onChangeCallback(),this}clone(){return new this.constructor(this._x,this._y,this._z,this._order)}copy(e){return this._x=e._x,this._y=e._y,this._z=e._z,this._order=e._order,this._onChangeCallback(),this}setFromRotationMatrix(e,t=this._order,n=!0){let s=e.elements,r=s[0],o=s[4],a=s[8],c=s[1],l=s[5],h=s[9],u=s[2],d=s[6],f=s[10];switch(t){case"XYZ":this._y=Math.asin(Pt(a,-1,1)),Math.abs(a)<.9999999?(this._x=Math.atan2(-h,f),this._z=Math.atan2(-o,r)):(this._x=Math.atan2(d,l),this._z=0);break;case"YXZ":this._x=Math.asin(-Pt(h,-1,1)),Math.abs(h)<.9999999?(this._y=Math.atan2(a,f),this._z=Math.atan2(c,l)):(this._y=Math.atan2(-u,r),this._z=0);break;case"ZXY":this._x=Math.asin(Pt(d,-1,1)),Math.abs(d)<.9999999?(this._y=Math.atan2(-u,f),this._z=Math.atan2(-o,l)):(this._y=0,this._z=Math.atan2(c,r));break;case"ZYX":this._y=Math.asin(-Pt(u,-1,1)),Math.abs(u)<.9999999?(this._x=Math.atan2(d,f),this._z=Math.atan2(c,r)):(this._x=0,this._z=Math.atan2(-o,l));break;case"YZX":this._z=Math.asin(Pt(c,-1,1)),Math.abs(c)<.9999999?(this._x=Math.atan2(-h,l),this._y=Math.atan2(-u,r)):(this._x=0,this._y=Math.atan2(a,f));break;case"XZY":this._z=Math.asin(-Pt(o,-1,1)),Math.abs(o)<.9999999?(this._x=Math.atan2(d,l),this._y=Math.atan2(a,r)):(this._x=Math.atan2(-h,f),this._y=0);break;default:console.warn("THREE.Euler: .setFromRotationMatrix() encountered an unknown order: "+t)}return this._order=t,n===!0&&this._onChangeCallback(),this}setFromQuaternion(e,t,n){return Lu.makeRotationFromQuaternion(e),this.setFromRotationMatrix(Lu,t,n)}setFromVector3(e,t=this._order){return this.set(e.x,e.y,e.z,t)}reorder(e){return Du.setFromEuler(this),this.setFromQuaternion(Du,e)}equals(e){return e._x===this._x&&e._y===this._y&&e._z===this._z&&e._order===this._order}fromArray(e){return this._x=e[0],this._y=e[1],this._z=e[2],e[3]!==void 0&&(this._order=e[3]),this._onChangeCallback(),this}toArray(e=[],t=0){return e[t]=this._x,e[t+1]=this._y,e[t+2]=this._z,e[t+3]=this._order,e}_onChange(e){return this._onChangeCallback=e,this}_onChangeCallback(){}*[Symbol.iterator](){yield this._x,yield this._y,yield this._z,yield this._order}};En.DEFAULT_ORDER="XYZ";var bo=class{constructor(){this.mask=1}set(e){this.mask=(1<<e|0)>>>0}enable(e){this.mask|=1<<e|0}enableAll(){this.mask=-1}toggle(e){this.mask^=1<<e|0}disable(e){this.mask&=~(1<<e|0)}disableAll(){this.mask=0}test(e){return(this.mask&e.mask)!==0}isEnabled(e){return(this.mask&(1<<e|0))!==0}},lm=0,Uu=new R,Vi=new si,Dn=new _t,kr=new R,Ls=new R,hm=new R,um=new si,Nu=new R(1,0,0),ku=new R(0,1,0),Ou=new R(0,0,1),Fu={type:"added"},dm={type:"removed"},Gi={type:"childadded",child:null},Ha={type:"childremoved",child:null},Nt=class i extends ii{constructor(){super(),this.isObject3D=!0,Object.defineProperty(this,"id",{value:lm++}),this.uuid=Mn(),this.name="",this.type="Object3D",this.parent=null,this.children=[],this.up=i.DEFAULT_UP.clone();let e=new R,t=new En,n=new si,s=new R(1,1,1);function r(){n.setFromEuler(t,!1)}function o(){t.setFromQuaternion(n,void 0,!1)}t._onChange(r),n._onChange(o),Object.defineProperties(this,{position:{configurable:!0,enumerable:!0,value:e},rotation:{configurable:!0,enumerable:!0,value:t},quaternion:{configurable:!0,enumerable:!0,value:n},scale:{configurable:!0,enumerable:!0,value:s},modelViewMatrix:{value:new _t},normalMatrix:{value:new je}}),this.matrix=new _t,this.matrixWorld=new _t,this.matrixAutoUpdate=i.DEFAULT_MATRIX_AUTO_UPDATE,this.matrixWorldAutoUpdate=i.DEFAULT_MATRIX_WORLD_AUTO_UPDATE,this.matrixWorldNeedsUpdate=!1,this.layers=new bo,this.visible=!0,this.castShadow=!1,this.receiveShadow=!1,this.frustumCulled=!0,this.renderOrder=0,this.animations=[],this.userData={}}onBeforeShadow(){}onAfterShadow(){}onBeforeRender(){}onAfterRender(){}applyMatrix4(e){this.matrixAutoUpdate&&this.updateMatrix(),this.matrix.premultiply(e),this.matrix.decompose(this.position,this.quaternion,this.scale)}applyQuaternion(e){return this.quaternion.premultiply(e),this}setRotationFromAxisAngle(e,t){this.quaternion.setFromAxisAngle(e,t)}setRotationFromEuler(e){this.quaternion.setFromEuler(e,!0)}setRotationFromMatrix(e){this.quaternion.setFromRotationMatrix(e)}setRotationFromQuaternion(e){this.quaternion.copy(e)}rotateOnAxis(e,t){return Vi.setFromAxisAngle(e,t),this.quaternion.multiply(Vi),this}rotateOnWorldAxis(e,t){return Vi.setFromAxisAngle(e,t),this.quaternion.premultiply(Vi),this}rotateX(e){return this.rotateOnAxis(Nu,e)}rotateY(e){return this.rotateOnAxis(ku,e)}rotateZ(e){return this.rotateOnAxis(Ou,e)}translateOnAxis(e,t){return Uu.copy(e).applyQuaternion(this.quaternion),this.position.add(Uu.multiplyScalar(t)),this}translateX(e){return this.translateOnAxis(Nu,e)}translateY(e){return this.translateOnAxis(ku,e)}translateZ(e){return this.translateOnAxis(Ou,e)}localToWorld(e){return this.updateWorldMatrix(!0,!1),e.applyMatrix4(this.matrixWorld)}worldToLocal(e){return this.updateWorldMatrix(!0,!1),e.applyMatrix4(Dn.copy(this.matrixWorld).invert())}lookAt(e,t,n){e.isVector3?kr.copy(e):kr.set(e,t,n);let s=this.parent;this.updateWorldMatrix(!0,!1),Ls.setFromMatrixPosition(this.matrixWorld),this.isCamera||this.isLight?Dn.lookAt(Ls,kr,this.up):Dn.lookAt(kr,Ls,this.up),this.quaternion.setFromRotationMatrix(Dn),s&&(Dn.extractRotation(s.matrixWorld),Vi.setFromRotationMatrix(Dn),this.quaternion.premultiply(Vi.invert()))}add(e){if(arguments.length>1){for(let t=0;t<arguments.length;t++)this.add(arguments[t]);return this}return e===this?(console.error("THREE.Object3D.add: object can't be added as a child of itself.",e),this):(e&&e.isObject3D?(e.removeFromParent(),e.parent=this,this.children.push(e),e.dispatchEvent(Fu),Gi.child=e,this.dispatchEvent(Gi),Gi.child=null):console.error("THREE.Object3D.add: object not an instance of THREE.Object3D.",e),this)}remove(e){if(arguments.length>1){for(let n=0;n<arguments.length;n++)this.remove(arguments[n]);return this}let t=this.children.indexOf(e);return t!==-1&&(e.parent=null,this.children.splice(t,1),e.dispatchEvent(dm),Ha.child=e,this.dispatchEvent(Ha),Ha.child=null),this}removeFromParent(){let e=this.parent;return e!==null&&e.remove(this),this}clear(){return this.remove(...this.children)}attach(e){return this.updateWorldMatrix(!0,!1),Dn.copy(this.matrixWorld).invert(),e.parent!==null&&(e.parent.updateWorldMatrix(!0,!1),Dn.multiply(e.parent.matrixWorld)),e.applyMatrix4(Dn),e.removeFromParent(),e.parent=this,this.children.push(e),e.updateWorldMatrix(!1,!0),e.dispatchEvent(Fu),Gi.child=e,this.dispatchEvent(Gi),Gi.child=null,this}getObjectById(e){return this.getObjectByProperty("id",e)}getObjectByName(e){return this.getObjectByProperty("name",e)}getObjectByProperty(e,t){if(this[e]===t)return this;for(let n=0,s=this.children.length;n<s;n++){let o=this.children[n].getObjectByProperty(e,t);if(o!==void 0)return o}}getObjectsByProperty(e,t,n=[]){this[e]===t&&n.push(this);let s=this.children;for(let r=0,o=s.length;r<o;r++)s[r].getObjectsByProperty(e,t,n);return n}getWorldPosition(e){return this.updateWorldMatrix(!0,!1),e.setFromMatrixPosition(this.matrixWorld)}getWorldQuaternion(e){return this.updateWorldMatrix(!0,!1),this.matrixWorld.decompose(Ls,e,hm),e}getWorldScale(e){return this.updateWorldMatrix(!0,!1),this.matrixWorld.decompose(Ls,um,e),e}getWorldDirection(e){this.updateWorldMatrix(!0,!1);let t=this.matrixWorld.elements;return e.set(t[8],t[9],t[10]).normalize()}raycast(){}traverse(e){e(this);let t=this.children;for(let n=0,s=t.length;n<s;n++)t[n].traverse(e)}traverseVisible(e){if(this.visible===!1)return;e(this);let t=this.children;for(let n=0,s=t.length;n<s;n++)t[n].traverseVisible(e)}traverseAncestors(e){let t=this.parent;t!==null&&(e(t),t.traverseAncestors(e))}updateMatrix(){this.matrix.compose(this.position,this.quaternion,this.scale),this.matrixWorldNeedsUpdate=!0}updateMatrixWorld(e){this.matrixAutoUpdate&&this.updateMatrix(),(this.matrixWorldNeedsUpdate||e)&&(this.matrixWorldAutoUpdate===!0&&(this.parent===null?this.matrixWorld.copy(this.matrix):this.matrixWorld.multiplyMatrices(this.parent.matrixWorld,this.matrix)),this.matrixWorldNeedsUpdate=!1,e=!0);let t=this.children;for(let n=0,s=t.length;n<s;n++)t[n].updateMatrixWorld(e)}updateWorldMatrix(e,t){let n=this.parent;if(e===!0&&n!==null&&n.updateWorldMatrix(!0,!1),this.matrixAutoUpdate&&this.updateMatrix(),this.matrixWorldAutoUpdate===!0&&(this.parent===null?this.matrixWorld.copy(this.matrix):this.matrixWorld.multiplyMatrices(this.parent.matrixWorld,this.matrix)),t===!0){let s=this.children;for(let r=0,o=s.length;r<o;r++)s[r].updateWorldMatrix(!1,!0)}}toJSON(e){let t=e===void 0||typeof e=="string",n={};t&&(e={geometries:{},materials:{},textures:{},images:{},shapes:{},skeletons:{},animations:{},nodes:{}},n.metadata={version:4.6,type:"Object",generator:"Object3D.toJSON"});let s={};s.uuid=this.uuid,s.type=this.type,this.name!==""&&(s.name=this.name),this.castShadow===!0&&(s.castShadow=!0),this.receiveShadow===!0&&(s.receiveShadow=!0),this.visible===!1&&(s.visible=!1),this.frustumCulled===!1&&(s.frustumCulled=!1),this.renderOrder!==0&&(s.renderOrder=this.renderOrder),Object.keys(this.userData).length>0&&(s.userData=this.userData),s.layers=this.layers.mask,s.matrix=this.matrix.toArray(),s.up=this.up.toArray(),this.matrixAutoUpdate===!1&&(s.matrixAutoUpdate=!1),this.isInstancedMesh&&(s.type="InstancedMesh",s.count=this.count,s.instanceMatrix=this.instanceMatrix.toJSON(),this.instanceColor!==null&&(s.instanceColor=this.instanceColor.toJSON())),this.isBatchedMesh&&(s.type="BatchedMesh",s.perObjectFrustumCulled=this.perObjectFrustumCulled,s.sortObjects=this.sortObjects,s.drawRanges=this._drawRanges,s.reservedRanges=this._reservedRanges,s.visibility=this._visibility,s.active=this._active,s.bounds=this._bounds.map(a=>({boxInitialized:a.boxInitialized,boxMin:a.box.min.toArray(),boxMax:a.box.max.toArray(),sphereInitialized:a.sphereInitialized,sphereRadius:a.sphere.radius,sphereCenter:a.sphere.center.toArray()})),s.maxInstanceCount=this._maxInstanceCount,s.maxVertexCount=this._maxVertexCount,s.maxIndexCount=this._maxIndexCount,s.geometryInitialized=this._geometryInitialized,s.geometryCount=this._geometryCount,s.matricesTexture=this._matricesTexture.toJSON(e),this._colorsTexture!==null&&(s.colorsTexture=this._colorsTexture.toJSON(e)),this.boundingSphere!==null&&(s.boundingSphere={center:s.boundingSphere.center.toArray(),radius:s.boundingSphere.radius}),this.boundingBox!==null&&(s.boundingBox={min:s.boundingBox.min.toArray(),max:s.boundingBox.max.toArray()}));function r(a,c){return a[c.uuid]===void 0&&(a[c.uuid]=c.toJSON(e)),c.uuid}if(this.isScene)this.background&&(this.background.isColor?s.background=this.background.toJSON():this.background.isTexture&&(s.background=this.background.toJSON(e).uuid)),this.environment&&this.environment.isTexture&&this.environment.isRenderTargetTexture!==!0&&(s.environment=this.environment.toJSON(e).uuid);else if(this.isMesh||this.isLine||this.isPoints){s.geometry=r(e.geometries,this.geometry);let a=this.geometry.parameters;if(a!==void 0&&a.shapes!==void 0){let c=a.shapes;if(Array.isArray(c))for(let l=0,h=c.length;l<h;l++){let u=c[l];r(e.shapes,u)}else r(e.shapes,c)}}if(this.isSkinnedMesh&&(s.bindMode=this.bindMode,s.bindMatrix=this.bindMatrix.toArray(),this.skeleton!==void 0&&(r(e.skeletons,this.skeleton),s.skeleton=this.skeleton.uuid)),this.material!==void 0)if(Array.isArray(this.material)){let a=[];for(let c=0,l=this.material.length;c<l;c++)a.push(r(e.materials,this.material[c]));s.material=a}else s.material=r(e.materials,this.material);if(this.children.length>0){s.children=[];for(let a=0;a<this.children.length;a++)s.children.push(this.children[a].toJSON(e).object)}if(this.animations.length>0){s.animations=[];for(let a=0;a<this.animations.length;a++){let c=this.animations[a];s.animations.push(r(e.animations,c))}}if(t){let a=o(e.geometries),c=o(e.materials),l=o(e.textures),h=o(e.images),u=o(e.shapes),d=o(e.skeletons),f=o(e.animations),g=o(e.nodes);a.length>0&&(n.geometries=a),c.length>0&&(n.materials=c),l.length>0&&(n.textures=l),h.length>0&&(n.images=h),u.length>0&&(n.shapes=u),d.length>0&&(n.skeletons=d),f.length>0&&(n.animations=f),g.length>0&&(n.nodes=g)}return n.object=s,n;function o(a){let c=[];for(let l in a){let h=a[l];delete h.metadata,c.push(h)}return c}}clone(e){return new this.constructor().copy(this,e)}copy(e,t=!0){if(this.name=e.name,this.up.copy(e.up),this.position.copy(e.position),this.rotation.order=e.rotation.order,this.quaternion.copy(e.quaternion),this.scale.copy(e.scale),this.matrix.copy(e.matrix),this.matrixWorld.copy(e.matrixWorld),this.matrixAutoUpdate=e.matrixAutoUpdate,this.matrixWorldAutoUpdate=e.matrixWorldAutoUpdate,this.matrixWorldNeedsUpdate=e.matrixWorldNeedsUpdate,this.layers.mask=e.layers.mask,this.visible=e.visible,this.castShadow=e.castShadow,this.receiveShadow=e.receiveShadow,this.frustumCulled=e.frustumCulled,this.renderOrder=e.renderOrder,this.animations=e.animations.slice(),this.userData=JSON.parse(JSON.stringify(e.userData)),t===!0)for(let n=0;n<e.children.length;n++){let s=e.children[n];this.add(s.clone())}return this}};Nt.DEFAULT_UP=new R(0,1,0);Nt.DEFAULT_MATRIX_AUTO_UPDATE=!0;Nt.DEFAULT_MATRIX_WORLD_AUTO_UPDATE=!0;var pn=new R,Un=new R,Va=new R,Nn=new R,Wi=new R,Xi=new R,Bu=new R,Ga=new R,Wa=new R,Xa=new R,qa=new ft,Ya=new ft,$a=new ft,ei=class i{constructor(e=new R,t=new R,n=new R){this.a=e,this.b=t,this.c=n}static getNormal(e,t,n,s){s.subVectors(n,t),pn.subVectors(e,t),s.cross(pn);let r=s.lengthSq();return r>0?s.multiplyScalar(1/Math.sqrt(r)):s.set(0,0,0)}static getBarycoord(e,t,n,s,r){pn.subVectors(s,t),Un.subVectors(n,t),Va.subVectors(e,t);let o=pn.dot(pn),a=pn.dot(Un),c=pn.dot(Va),l=Un.dot(Un),h=Un.dot(Va),u=o*l-a*a;if(u===0)return r.set(0,0,0),null;let d=1/u,f=(l*c-a*h)*d,g=(o*h-a*c)*d;return r.set(1-f-g,g,f)}static containsPoint(e,t,n,s){return this.getBarycoord(e,t,n,s,Nn)===null?!1:Nn.x>=0&&Nn.y>=0&&Nn.x+Nn.y<=1}static getInterpolation(e,t,n,s,r,o,a,c){return this.getBarycoord(e,t,n,s,Nn)===null?(c.x=0,c.y=0,"z"in c&&(c.z=0),"w"in c&&(c.w=0),null):(c.setScalar(0),c.addScaledVector(r,Nn.x),c.addScaledVector(o,Nn.y),c.addScaledVector(a,Nn.z),c)}static getInterpolatedAttribute(e,t,n,s,r,o){return qa.setScalar(0),Ya.setScalar(0),$a.setScalar(0),qa.fromBufferAttribute(e,t),Ya.fromBufferAttribute(e,n),$a.fromBufferAttribute(e,s),o.setScalar(0),o.addScaledVector(qa,r.x),o.addScaledVector(Ya,r.y),o.addScaledVector($a,r.z),o}static isFrontFacing(e,t,n,s){return pn.subVectors(n,t),Un.subVectors(e,t),pn.cross(Un).dot(s)<0}set(e,t,n){return this.a.copy(e),this.b.copy(t),this.c.copy(n),this}setFromPointsAndIndices(e,t,n,s){return this.a.copy(e[t]),this.b.copy(e[n]),this.c.copy(e[s]),this}setFromAttributeAndIndices(e,t,n,s){return this.a.fromBufferAttribute(e,t),this.b.fromBufferAttribute(e,n),this.c.fromBufferAttribute(e,s),this}clone(){return new this.constructor().copy(this)}copy(e){return this.a.copy(e.a),this.b.copy(e.b),this.c.copy(e.c),this}getArea(){return pn.subVectors(this.c,this.b),Un.subVectors(this.a,this.b),pn.cross(Un).length()*.5}getMidpoint(e){return e.addVectors(this.a,this.b).add(this.c).multiplyScalar(1/3)}getNormal(e){return i.getNormal(this.a,this.b,this.c,e)}getPlane(e){return e.setFromCoplanarPoints(this.a,this.b,this.c)}getBarycoord(e,t){return i.getBarycoord(e,this.a,this.b,this.c,t)}getInterpolation(e,t,n,s,r){return i.getInterpolation(e,this.a,this.b,this.c,t,n,s,r)}containsPoint(e){return i.containsPoint(e,this.a,this.b,this.c)}isFrontFacing(e){return i.isFrontFacing(this.a,this.b,this.c,e)}intersectsBox(e){return e.intersectsTriangle(this)}closestPointToPoint(e,t){let n=this.a,s=this.b,r=this.c,o,a;Wi.subVectors(s,n),Xi.subVectors(r,n),Ga.subVectors(e,n);let c=Wi.dot(Ga),l=Xi.dot(Ga);if(c<=0&&l<=0)return t.copy(n);Wa.subVectors(e,s);let h=Wi.dot(Wa),u=Xi.dot(Wa);if(h>=0&&u<=h)return t.copy(s);let d=c*u-h*l;if(d<=0&&c>=0&&h<=0)return o=c/(c-h),t.copy(n).addScaledVector(Wi,o);Xa.subVectors(e,r);let f=Wi.dot(Xa),g=Xi.dot(Xa);if(g>=0&&f<=g)return t.copy(r);let y=f*l-c*g;if(y<=0&&l>=0&&g<=0)return a=l/(l-g),t.copy(n).addScaledVector(Xi,a);let m=h*g-f*u;if(m<=0&&u-h>=0&&f-g>=0)return Bu.subVectors(r,s),a=(u-h)/(u-h+(f-g)),t.copy(s).addScaledVector(Bu,a);let p=1/(m+y+d);return o=y*p,a=d*p,t.copy(n).addScaledVector(Wi,o).addScaledVector(Xi,a)}equals(e){return e.a.equals(this.a)&&e.b.equals(this.b)&&e.c.equals(this.c)}},Vd={aliceblue:15792383,antiquewhite:16444375,aqua:65535,aquamarine:8388564,azure:15794175,beige:16119260,bisque:16770244,black:0,blanchedalmond:16772045,blue:255,blueviolet:9055202,brown:10824234,burlywood:14596231,cadetblue:6266528,chartreuse:8388352,chocolate:13789470,coral:16744272,cornflowerblue:6591981,cornsilk:16775388,crimson:14423100,cyan:65535,darkblue:139,darkcyan:35723,darkgoldenrod:12092939,darkgray:11119017,darkgreen:25600,darkgrey:11119017,darkkhaki:12433259,darkmagenta:9109643,darkolivegreen:5597999,darkorange:16747520,darkorchid:10040012,darkred:9109504,darksalmon:15308410,darkseagreen:9419919,darkslateblue:4734347,darkslategray:3100495,darkslategrey:3100495,darkturquoise:52945,darkviolet:9699539,deeppink:16716947,deepskyblue:49151,dimgray:6908265,dimgrey:6908265,dodgerblue:2003199,firebrick:11674146,floralwhite:16775920,forestgreen:2263842,fuchsia:16711935,gainsboro:14474460,ghostwhite:16316671,gold:16766720,goldenrod:14329120,gray:8421504,green:32768,greenyellow:11403055,grey:8421504,honeydew:15794160,hotpink:16738740,indianred:13458524,indigo:4915330,ivory:16777200,khaki:15787660,lavender:15132410,lavenderblush:16773365,lawngreen:8190976,lemonchiffon:16775885,lightblue:11393254,lightcoral:15761536,lightcyan:14745599,lightgoldenrodyellow:16448210,lightgray:13882323,lightgreen:9498256,lightgrey:13882323,lightpink:16758465,lightsalmon:16752762,lightseagreen:2142890,lightskyblue:8900346,lightslategray:7833753,lightslategrey:7833753,lightsteelblue:11584734,lightyellow:16777184,lime:65280,limegreen:3329330,linen:16445670,magenta:16711935,maroon:8388608,mediumaquamarine:6737322,mediumblue:205,mediumorchid:12211667,mediumpurple:9662683,mediumseagreen:3978097,mediumslateblue:8087790,mediumspringgreen:64154,mediumturquoise:4772300,mediumvioletred:13047173,midnightblue:1644912,mintcream:16121850,mistyrose:16770273,moccasin:16770229,navajowhite:16768685,navy:128,oldlace:16643558,olive:8421376,olivedrab:7048739,orange:16753920,orangered:16729344,orchid:14315734,palegoldenrod:15657130,palegreen:10025880,paleturquoise:11529966,palevioletred:14381203,papayawhip:16773077,peachpuff:16767673,peru:13468991,pink:16761035,plum:14524637,powderblue:11591910,purple:8388736,rebeccapurple:6697881,red:16711680,rosybrown:12357519,royalblue:4286945,saddlebrown:9127187,salmon:16416882,sandybrown:16032864,seagreen:3050327,seashell:16774638,sienna:10506797,silver:12632256,skyblue:8900331,slateblue:6970061,slategray:7372944,slategrey:7372944,snow:16775930,springgreen:65407,steelblue:4620980,tan:13808780,teal:32896,thistle:14204888,tomato:16737095,turquoise:4251856,violet:15631086,wheat:16113331,white:16777215,whitesmoke:16119285,yellow:16776960,yellowgreen:10145074},jn={h:0,s:0,l:0},Or={h:0,s:0,l:0};function Ja(i,e,t){return t<0&&(t+=1),t>1&&(t-=1),t<1/6?i+(e-i)*6*t:t<1/2?e:t<2/3?i+(e-i)*6*(2/3-t):i}var Qe=class{constructor(e,t,n){return this.isColor=!0,this.r=1,this.g=1,this.b=1,this.set(e,t,n)}set(e,t,n){if(t===void 0&&n===void 0){let s=e;s&&s.isColor?this.copy(s):typeof s=="number"?this.setHex(s):typeof s=="string"&&this.setStyle(s)}else this.setRGB(e,t,n);return this}setScalar(e){return this.r=e,this.g=e,this.b=e,this}setHex(e,t=Xt){return e=Math.floor(e),this.r=(e>>16&255)/255,this.g=(e>>8&255)/255,this.b=(e&255)/255,ct.toWorkingColorSpace(this,t),this}setRGB(e,t,n,s=ct.workingColorSpace){return this.r=e,this.g=t,this.b=n,ct.toWorkingColorSpace(this,s),this}setHSL(e,t,n,s=ct.workingColorSpace){if(e=$l(e,1),t=Pt(t,0,1),n=Pt(n,0,1),t===0)this.r=this.g=this.b=n;else{let r=n<=.5?n*(1+t):n+t-n*t,o=2*n-r;this.r=Ja(o,r,e+1/3),this.g=Ja(o,r,e),this.b=Ja(o,r,e-1/3)}return ct.toWorkingColorSpace(this,s),this}setStyle(e,t=Xt){function n(r){r!==void 0&&parseFloat(r)<1&&console.warn("THREE.Color: Alpha component of "+e+" will be ignored.")}let s;if(s=/^(\w+)\(([^\)]*)\)/.exec(e)){let r,o=s[1],a=s[2];switch(o){case"rgb":case"rgba":if(r=/^\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)\s*(?:,\s*(\d*\.?\d+)\s*)?$/.exec(a))return n(r[4]),this.setRGB(Math.min(255,parseInt(r[1],10))/255,Math.min(255,parseInt(r[2],10))/255,Math.min(255,parseInt(r[3],10))/255,t);if(r=/^\s*(\d+)\%\s*,\s*(\d+)\%\s*,\s*(\d+)\%\s*(?:,\s*(\d*\.?\d+)\s*)?$/.exec(a))return n(r[4]),this.setRGB(Math.min(100,parseInt(r[1],10))/100,Math.min(100,parseInt(r[2],10))/100,Math.min(100,parseInt(r[3],10))/100,t);break;case"hsl":case"hsla":if(r=/^\s*(\d*\.?\d+)\s*,\s*(\d*\.?\d+)\%\s*,\s*(\d*\.?\d+)\%\s*(?:,\s*(\d*\.?\d+)\s*)?$/.exec(a))return n(r[4]),this.setHSL(parseFloat(r[1])/360,parseFloat(r[2])/100,parseFloat(r[3])/100,t);break;default:console.warn("THREE.Color: Unknown color model "+e)}}else if(s=/^\#([A-Fa-f\d]+)$/.exec(e)){let r=s[1],o=r.length;if(o===3)return this.setRGB(parseInt(r.charAt(0),16)/15,parseInt(r.charAt(1),16)/15,parseInt(r.charAt(2),16)/15,t);if(o===6)return this.setHex(parseInt(r,16),t);console.warn("THREE.Color: Invalid hex color "+e)}else if(e&&e.length>0)return this.setColorName(e,t);return this}setColorName(e,t=Xt){let n=Vd[e.toLowerCase()];return n!==void 0?this.setHex(n,t):console.warn("THREE.Color: Unknown color "+e),this}clone(){return new this.constructor(this.r,this.g,this.b)}copy(e){return this.r=e.r,this.g=e.g,this.b=e.b,this}copySRGBToLinear(e){return this.r=ss(e.r),this.g=ss(e.g),this.b=ss(e.b),this}copyLinearToSRGB(e){return this.r=Da(e.r),this.g=Da(e.g),this.b=Da(e.b),this}convertSRGBToLinear(){return this.copySRGBToLinear(this),this}convertLinearToSRGB(){return this.copyLinearToSRGB(this),this}getHex(e=Xt){return ct.fromWorkingColorSpace(zt.copy(this),e),Math.round(Pt(zt.r*255,0,255))*65536+Math.round(Pt(zt.g*255,0,255))*256+Math.round(Pt(zt.b*255,0,255))}getHexString(e=Xt){return("000000"+this.getHex(e).toString(16)).slice(-6)}getHSL(e,t=ct.workingColorSpace){ct.fromWorkingColorSpace(zt.copy(this),t);let n=zt.r,s=zt.g,r=zt.b,o=Math.max(n,s,r),a=Math.min(n,s,r),c,l,h=(a+o)/2;if(a===o)c=0,l=0;else{let u=o-a;switch(l=h<=.5?u/(o+a):u/(2-o-a),o){case n:c=(s-r)/u+(s<r?6:0);break;case s:c=(r-n)/u+2;break;case r:c=(n-s)/u+4;break}c/=6}return e.h=c,e.s=l,e.l=h,e}getRGB(e,t=ct.workingColorSpace){return ct.fromWorkingColorSpace(zt.copy(this),t),e.r=zt.r,e.g=zt.g,e.b=zt.b,e}getStyle(e=Xt){ct.fromWorkingColorSpace(zt.copy(this),e);let t=zt.r,n=zt.g,s=zt.b;return e!==Xt?`color(${e} ${t.toFixed(3)} ${n.toFixed(3)} ${s.toFixed(3)})`:`rgb(${Math.round(t*255)},${Math.round(n*255)},${Math.round(s*255)})`}offsetHSL(e,t,n){return this.getHSL(jn),this.setHSL(jn.h+e,jn.s+t,jn.l+n)}add(e){return this.r+=e.r,this.g+=e.g,this.b+=e.b,this}addColors(e,t){return this.r=e.r+t.r,this.g=e.g+t.g,this.b=e.b+t.b,this}addScalar(e){return this.r+=e,this.g+=e,this.b+=e,this}sub(e){return this.r=Math.max(0,this.r-e.r),this.g=Math.max(0,this.g-e.g),this.b=Math.max(0,this.b-e.b),this}multiply(e){return this.r*=e.r,this.g*=e.g,this.b*=e.b,this}multiplyScalar(e){return this.r*=e,this.g*=e,this.b*=e,this}lerp(e,t){return this.r+=(e.r-this.r)*t,this.g+=(e.g-this.g)*t,this.b+=(e.b-this.b)*t,this}lerpColors(e,t,n){return this.r=e.r+(t.r-e.r)*n,this.g=e.g+(t.g-e.g)*n,this.b=e.b+(t.b-e.b)*n,this}lerpHSL(e,t){this.getHSL(jn),e.getHSL(Or);let n=Hs(jn.h,Or.h,t),s=Hs(jn.s,Or.s,t),r=Hs(jn.l,Or.l,t);return this.setHSL(n,s,r),this}setFromVector3(e){return this.r=e.x,this.g=e.y,this.b=e.z,this}applyMatrix3(e){let t=this.r,n=this.g,s=this.b,r=e.elements;return this.r=r[0]*t+r[3]*n+r[6]*s,this.g=r[1]*t+r[4]*n+r[7]*s,this.b=r[2]*t+r[5]*n+r[8]*s,this}equals(e){return e.r===this.r&&e.g===this.g&&e.b===this.b}fromArray(e,t=0){return this.r=e[t],this.g=e[t+1],this.b=e[t+2],this}toArray(e=[],t=0){return e[t]=this.r,e[t+1]=this.g,e[t+2]=this.b,e}fromBufferAttribute(e,t){return this.r=e.getX(t),this.g=e.getY(t),this.b=e.getZ(t),this}toJSON(){return this.getHex()}*[Symbol.iterator](){yield this.r,yield this.g,yield this.b}},zt=new Qe;Qe.NAMES=Vd;var fm=0,Gn=class extends ii{constructor(){super(),this.isMaterial=!0,Object.defineProperty(this,"id",{value:fm++}),this.uuid=Mn(),this.name="",this.type="Material",this.blending=ns,this.side=Sn,this.vertexColors=!1,this.opacity=1,this.transparent=!1,this.alphaHash=!1,this.blendSrc=dc,this.blendDst=fc,this.blendEquation=_i,this.blendSrcAlpha=null,this.blendDstAlpha=null,this.blendEquationAlpha=null,this.blendColor=new Qe(0,0,0),this.blendAlpha=0,this.depthFunc=os,this.depthTest=!0,this.depthWrite=!0,this.stencilWriteMask=255,this.stencilFunc=Tu,this.stencilRef=0,this.stencilFuncMask=255,this.stencilFail=ki,this.stencilZFail=ki,this.stencilZPass=ki,this.stencilWrite=!1,this.clippingPlanes=null,this.clipIntersection=!1,this.clipShadows=!1,this.shadowSide=null,this.colorWrite=!0,this.precision=null,this.polygonOffset=!1,this.polygonOffsetFactor=0,this.polygonOffsetUnits=0,this.dithering=!1,this.alphaToCoverage=!1,this.premultipliedAlpha=!1,this.forceSinglePass=!1,this.visible=!0,this.toneMapped=!0,this.userData={},this.version=0,this._alphaTest=0}get alphaTest(){return this._alphaTest}set alphaTest(e){this._alphaTest>0!=e>0&&this.version++,this._alphaTest=e}onBeforeRender(){}onBeforeCompile(){}customProgramCacheKey(){return this.onBeforeCompile.toString()}setValues(e){if(e!==void 0)for(let t in e){let n=e[t];if(n===void 0){console.warn(`THREE.Material: parameter '${t}' has value of undefined.`);continue}let s=this[t];if(s===void 0){console.warn(`THREE.Material: '${t}' is not a property of THREE.${this.type}.`);continue}s&&s.isColor?s.set(n):s&&s.isVector3&&n&&n.isVector3?s.copy(n):this[t]=n}}toJSON(e){let t=e===void 0||typeof e=="string";t&&(e={textures:{},images:{}});let n={metadata:{version:4.6,type:"Material",generator:"Material.toJSON"}};n.uuid=this.uuid,n.type=this.type,this.name!==""&&(n.name=this.name),this.color&&this.color.isColor&&(n.color=this.color.getHex()),this.roughness!==void 0&&(n.roughness=this.roughness),this.metalness!==void 0&&(n.metalness=this.metalness),this.sheen!==void 0&&(n.sheen=this.sheen),this.sheenColor&&this.sheenColor.isColor&&(n.sheenColor=this.sheenColor.getHex()),this.sheenRoughness!==void 0&&(n.sheenRoughness=this.sheenRoughness),this.emissive&&this.emissive.isColor&&(n.emissive=this.emissive.getHex()),this.emissiveIntensity!==void 0&&this.emissiveIntensity!==1&&(n.emissiveIntensity=this.emissiveIntensity),this.specular&&this.specular.isColor&&(n.specular=this.specular.getHex()),this.specularIntensity!==void 0&&(n.specularIntensity=this.specularIntensity),this.specularColor&&this.specularColor.isColor&&(n.specularColor=this.specularColor.getHex()),this.shininess!==void 0&&(n.shininess=this.shininess),this.clearcoat!==void 0&&(n.clearcoat=this.clearcoat),this.clearcoatRoughness!==void 0&&(n.clearcoatRoughness=this.clearcoatRoughness),this.clearcoatMap&&this.clearcoatMap.isTexture&&(n.clearcoatMap=this.clearcoatMap.toJSON(e).uuid),this.clearcoatRoughnessMap&&this.clearcoatRoughnessMap.isTexture&&(n.clearcoatRoughnessMap=this.clearcoatRoughnessMap.toJSON(e).uuid),this.clearcoatNormalMap&&this.clearcoatNormalMap.isTexture&&(n.clearcoatNormalMap=this.clearcoatNormalMap.toJSON(e).uuid,n.clearcoatNormalScale=this.clearcoatNormalScale.toArray()),this.dispersion!==void 0&&(n.dispersion=this.dispersion),this.iridescence!==void 0&&(n.iridescence=this.iridescence),this.iridescenceIOR!==void 0&&(n.iridescenceIOR=this.iridescenceIOR),this.iridescenceThicknessRange!==void 0&&(n.iridescenceThicknessRange=this.iridescenceThicknessRange),this.iridescenceMap&&this.iridescenceMap.isTexture&&(n.iridescenceMap=this.iridescenceMap.toJSON(e).uuid),this.iridescenceThicknessMap&&this.iridescenceThicknessMap.isTexture&&(n.iridescenceThicknessMap=this.iridescenceThicknessMap.toJSON(e).uuid),this.anisotropy!==void 0&&(n.anisotropy=this.anisotropy),this.anisotropyRotation!==void 0&&(n.anisotropyRotation=this.anisotropyRotation),this.anisotropyMap&&this.anisotropyMap.isTexture&&(n.anisotropyMap=this.anisotropyMap.toJSON(e).uuid),this.map&&this.map.isTexture&&(n.map=this.map.toJSON(e).uuid),this.matcap&&this.matcap.isTexture&&(n.matcap=this.matcap.toJSON(e).uuid),this.alphaMap&&this.alphaMap.isTexture&&(n.alphaMap=this.alphaMap.toJSON(e).uuid),this.lightMap&&this.lightMap.isTexture&&(n.lightMap=this.lightMap.toJSON(e).uuid,n.lightMapIntensity=this.lightMapIntensity),this.aoMap&&this.aoMap.isTexture&&(n.aoMap=this.aoMap.toJSON(e).uuid,n.aoMapIntensity=this.aoMapIntensity),this.bumpMap&&this.bumpMap.isTexture&&(n.bumpMap=this.bumpMap.toJSON(e).uuid,n.bumpScale=this.bumpScale),this.normalMap&&this.normalMap.isTexture&&(n.normalMap=this.normalMap.toJSON(e).uuid,n.normalMapType=this.normalMapType,n.normalScale=this.normalScale.toArray()),this.displacementMap&&this.displacementMap.isTexture&&(n.displacementMap=this.displacementMap.toJSON(e).uuid,n.displacementScale=this.displacementScale,n.displacementBias=this.displacementBias),this.roughnessMap&&this.roughnessMap.isTexture&&(n.roughnessMap=this.roughnessMap.toJSON(e).uuid),this.metalnessMap&&this.metalnessMap.isTexture&&(n.metalnessMap=this.metalnessMap.toJSON(e).uuid),this.emissiveMap&&this.emissiveMap.isTexture&&(n.emissiveMap=this.emissiveMap.toJSON(e).uuid),this.specularMap&&this.specularMap.isTexture&&(n.specularMap=this.specularMap.toJSON(e).uuid),this.specularIntensityMap&&this.specularIntensityMap.isTexture&&(n.specularIntensityMap=this.specularIntensityMap.toJSON(e).uuid),this.specularColorMap&&this.specularColorMap.isTexture&&(n.specularColorMap=this.specularColorMap.toJSON(e).uuid),this.envMap&&this.envMap.isTexture&&(n.envMap=this.envMap.toJSON(e).uuid,this.combine!==void 0&&(n.combine=this.combine)),this.envMapRotation!==void 0&&(n.envMapRotation=this.envMapRotation.toArray()),this.envMapIntensity!==void 0&&(n.envMapIntensity=this.envMapIntensity),this.reflectivity!==void 0&&(n.reflectivity=this.reflectivity),this.refractionRatio!==void 0&&(n.refractionRatio=this.refractionRatio),this.gradientMap&&this.gradientMap.isTexture&&(n.gradientMap=this.gradientMap.toJSON(e).uuid),this.transmission!==void 0&&(n.transmission=this.transmission),this.transmissionMap&&this.transmissionMap.isTexture&&(n.transmissionMap=this.transmissionMap.toJSON(e).uuid),this.thickness!==void 0&&(n.thickness=this.thickness),this.thicknessMap&&this.thicknessMap.isTexture&&(n.thicknessMap=this.thicknessMap.toJSON(e).uuid),this.attenuationDistance!==void 0&&this.attenuationDistance!==1/0&&(n.attenuationDistance=this.attenuationDistance),this.attenuationColor!==void 0&&(n.attenuationColor=this.attenuationColor.getHex()),this.size!==void 0&&(n.size=this.size),this.shadowSide!==null&&(n.shadowSide=this.shadowSide),this.sizeAttenuation!==void 0&&(n.sizeAttenuation=this.sizeAttenuation),this.blending!==ns&&(n.blending=this.blending),this.side!==Sn&&(n.side=this.side),this.vertexColors===!0&&(n.vertexColors=!0),this.opacity<1&&(n.opacity=this.opacity),this.transparent===!0&&(n.transparent=!0),this.blendSrc!==dc&&(n.blendSrc=this.blendSrc),this.blendDst!==fc&&(n.blendDst=this.blendDst),this.blendEquation!==_i&&(n.blendEquation=this.blendEquation),this.blendSrcAlpha!==null&&(n.blendSrcAlpha=this.blendSrcAlpha),this.blendDstAlpha!==null&&(n.blendDstAlpha=this.blendDstAlpha),this.blendEquationAlpha!==null&&(n.blendEquationAlpha=this.blendEquationAlpha),this.blendColor&&this.blendColor.isColor&&(n.blendColor=this.blendColor.getHex()),this.blendAlpha!==0&&(n.blendAlpha=this.blendAlpha),this.depthFunc!==os&&(n.depthFunc=this.depthFunc),this.depthTest===!1&&(n.depthTest=this.depthTest),this.depthWrite===!1&&(n.depthWrite=this.depthWrite),this.colorWrite===!1&&(n.colorWrite=this.colorWrite),this.stencilWriteMask!==255&&(n.stencilWriteMask=this.stencilWriteMask),this.stencilFunc!==Tu&&(n.stencilFunc=this.stencilFunc),this.stencilRef!==0&&(n.stencilRef=this.stencilRef),this.stencilFuncMask!==255&&(n.stencilFuncMask=this.stencilFuncMask),this.stencilFail!==ki&&(n.stencilFail=this.stencilFail),this.stencilZFail!==ki&&(n.stencilZFail=this.stencilZFail),this.stencilZPass!==ki&&(n.stencilZPass=this.stencilZPass),this.stencilWrite===!0&&(n.stencilWrite=this.stencilWrite),this.rotation!==void 0&&this.rotation!==0&&(n.rotation=this.rotation),this.polygonOffset===!0&&(n.polygonOffset=!0),this.polygonOffsetFactor!==0&&(n.polygonOffsetFactor=this.polygonOffsetFactor),this.polygonOffsetUnits!==0&&(n.polygonOffsetUnits=this.polygonOffsetUnits),this.linewidth!==void 0&&this.linewidth!==1&&(n.linewidth=this.linewidth),this.dashSize!==void 0&&(n.dashSize=this.dashSize),this.gapSize!==void 0&&(n.gapSize=this.gapSize),this.scale!==void 0&&(n.scale=this.scale),this.dithering===!0&&(n.dithering=!0),this.alphaTest>0&&(n.alphaTest=this.alphaTest),this.alphaHash===!0&&(n.alphaHash=!0),this.alphaToCoverage===!0&&(n.alphaToCoverage=!0),this.premultipliedAlpha===!0&&(n.premultipliedAlpha=!0),this.forceSinglePass===!0&&(n.forceSinglePass=!0),this.wireframe===!0&&(n.wireframe=!0),this.wireframeLinewidth>1&&(n.wireframeLinewidth=this.wireframeLinewidth),this.wireframeLinecap!=="round"&&(n.wireframeLinecap=this.wireframeLinecap),this.wireframeLinejoin!=="round"&&(n.wireframeLinejoin=this.wireframeLinejoin),this.flatShading===!0&&(n.flatShading=!0),this.visible===!1&&(n.visible=!1),this.toneMapped===!1&&(n.toneMapped=!1),this.fog===!1&&(n.fog=!1),Object.keys(this.userData).length>0&&(n.userData=this.userData);function s(r){let o=[];for(let a in r){let c=r[a];delete c.metadata,o.push(c)}return o}if(t){let r=s(e.textures),o=s(e.images);r.length>0&&(n.textures=r),o.length>0&&(n.images=o)}return n}clone(){return new this.constructor().copy(this)}copy(e){this.name=e.name,this.blending=e.blending,this.side=e.side,this.vertexColors=e.vertexColors,this.opacity=e.opacity,this.transparent=e.transparent,this.blendSrc=e.blendSrc,this.blendDst=e.blendDst,this.blendEquation=e.blendEquation,this.blendSrcAlpha=e.blendSrcAlpha,this.blendDstAlpha=e.blendDstAlpha,this.blendEquationAlpha=e.blendEquationAlpha,this.blendColor.copy(e.blendColor),this.blendAlpha=e.blendAlpha,this.depthFunc=e.depthFunc,this.depthTest=e.depthTest,this.depthWrite=e.depthWrite,this.stencilWriteMask=e.stencilWriteMask,this.stencilFunc=e.stencilFunc,this.stencilRef=e.stencilRef,this.stencilFuncMask=e.stencilFuncMask,this.stencilFail=e.stencilFail,this.stencilZFail=e.stencilZFail,this.stencilZPass=e.stencilZPass,this.stencilWrite=e.stencilWrite;let t=e.clippingPlanes,n=null;if(t!==null){let s=t.length;n=new Array(s);for(let r=0;r!==s;++r)n[r]=t[r].clone()}return this.clippingPlanes=n,this.clipIntersection=e.clipIntersection,this.clipShadows=e.clipShadows,this.shadowSide=e.shadowSide,this.colorWrite=e.colorWrite,this.precision=e.precision,this.polygonOffset=e.polygonOffset,this.polygonOffsetFactor=e.polygonOffsetFactor,this.polygonOffsetUnits=e.polygonOffsetUnits,this.dithering=e.dithering,this.alphaTest=e.alphaTest,this.alphaHash=e.alphaHash,this.alphaToCoverage=e.alphaToCoverage,this.premultipliedAlpha=e.premultipliedAlpha,this.forceSinglePass=e.forceSinglePass,this.visible=e.visible,this.toneMapped=e.toneMapped,this.userData=JSON.parse(JSON.stringify(e.userData)),this}dispose(){this.dispatchEvent({type:"dispose"})}set needsUpdate(e){e===!0&&this.version++}onBuild(){console.warn("Material: onBuild() has been removed.")}},Wn=class extends Gn{constructor(e){super(),this.isMeshBasicMaterial=!0,this.type="MeshBasicMaterial",this.color=new Qe(16777215),this.map=null,this.lightMap=null,this.lightMapIntensity=1,this.aoMap=null,this.aoMapIntensity=1,this.specularMap=null,this.alphaMap=null,this.envMap=null,this.envMapRotation=new En,this.combine=Ad,this.reflectivity=1,this.refractionRatio=.98,this.wireframe=!1,this.wireframeLinewidth=1,this.wireframeLinecap="round",this.wireframeLinejoin="round",this.fog=!0,this.setValues(e)}copy(e){return super.copy(e),this.color.copy(e.color),this.map=e.map,this.lightMap=e.lightMap,this.lightMapIntensity=e.lightMapIntensity,this.aoMap=e.aoMap,this.aoMapIntensity=e.aoMapIntensity,this.specularMap=e.specularMap,this.alphaMap=e.alphaMap,this.envMap=e.envMap,this.envMapRotation.copy(e.envMapRotation),this.combine=e.combine,this.reflectivity=e.reflectivity,this.refractionRatio=e.refractionRatio,this.wireframe=e.wireframe,this.wireframeLinewidth=e.wireframeLinewidth,this.wireframeLinecap=e.wireframeLinecap,this.wireframeLinejoin=e.wireframeLinejoin,this.fog=e.fog,this}};var wt=new R,Fr=new le,tn=class{constructor(e,t,n=!1){if(Array.isArray(e))throw new TypeError("THREE.BufferAttribute: array should be a Typed Array.");this.isBufferAttribute=!0,this.name="",this.array=e,this.itemSize=t,this.count=e!==void 0?e.length/t:0,this.normalized=n,this.usage=jc,this.updateRanges=[],this.gpuType=Bn,this.version=0}onUploadCallback(){}set needsUpdate(e){e===!0&&this.version++}setUsage(e){return this.usage=e,this}addUpdateRange(e,t){this.updateRanges.push({start:e,count:t})}clearUpdateRanges(){this.updateRanges.length=0}copy(e){return this.name=e.name,this.array=new e.array.constructor(e.array),this.itemSize=e.itemSize,this.count=e.count,this.normalized=e.normalized,this.usage=e.usage,this.gpuType=e.gpuType,this}copyAt(e,t,n){e*=this.itemSize,n*=t.itemSize;for(let s=0,r=this.itemSize;s<r;s++)this.array[e+s]=t.array[n+s];return this}copyArray(e){return this.array.set(e),this}applyMatrix3(e){if(this.itemSize===2)for(let t=0,n=this.count;t<n;t++)Fr.fromBufferAttribute(this,t),Fr.applyMatrix3(e),this.setXY(t,Fr.x,Fr.y);else if(this.itemSize===3)for(let t=0,n=this.count;t<n;t++)wt.fromBufferAttribute(this,t),wt.applyMatrix3(e),this.setXYZ(t,wt.x,wt.y,wt.z);return this}applyMatrix4(e){for(let t=0,n=this.count;t<n;t++)wt.fromBufferAttribute(this,t),wt.applyMatrix4(e),this.setXYZ(t,wt.x,wt.y,wt.z);return this}applyNormalMatrix(e){for(let t=0,n=this.count;t<n;t++)wt.fromBufferAttribute(this,t),wt.applyNormalMatrix(e),this.setXYZ(t,wt.x,wt.y,wt.z);return this}transformDirection(e){for(let t=0,n=this.count;t<n;t++)wt.fromBufferAttribute(this,t),wt.transformDirection(e),this.setXYZ(t,wt.x,wt.y,wt.z);return this}set(e,t=0){return this.array.set(e,t),this}getComponent(e,t){let n=this.array[e*this.itemSize+t];return this.normalized&&(n=gn(n,this.array)),n}setComponent(e,t,n){return this.normalized&&(n=ut(n,this.array)),this.array[e*this.itemSize+t]=n,this}getX(e){let t=this.array[e*this.itemSize];return this.normalized&&(t=gn(t,this.array)),t}setX(e,t){return this.normalized&&(t=ut(t,this.array)),this.array[e*this.itemSize]=t,this}getY(e){let t=this.array[e*this.itemSize+1];return this.normalized&&(t=gn(t,this.array)),t}setY(e,t){return this.normalized&&(t=ut(t,this.array)),this.array[e*this.itemSize+1]=t,this}getZ(e){let t=this.array[e*this.itemSize+2];return this.normalized&&(t=gn(t,this.array)),t}setZ(e,t){return this.normalized&&(t=ut(t,this.array)),this.array[e*this.itemSize+2]=t,this}getW(e){let t=this.array[e*this.itemSize+3];return this.normalized&&(t=gn(t,this.array)),t}setW(e,t){return this.normalized&&(t=ut(t,this.array)),this.array[e*this.itemSize+3]=t,this}setXY(e,t,n){return e*=this.itemSize,this.normalized&&(t=ut(t,this.array),n=ut(n,this.array)),this.array[e+0]=t,this.array[e+1]=n,this}setXYZ(e,t,n,s){return e*=this.itemSize,this.normalized&&(t=ut(t,this.array),n=ut(n,this.array),s=ut(s,this.array)),this.array[e+0]=t,this.array[e+1]=n,this.array[e+2]=s,this}setXYZW(e,t,n,s,r){return e*=this.itemSize,this.normalized&&(t=ut(t,this.array),n=ut(n,this.array),s=ut(s,this.array),r=ut(r,this.array)),this.array[e+0]=t,this.array[e+1]=n,this.array[e+2]=s,this.array[e+3]=r,this}onUpload(e){return this.onUploadCallback=e,this}clone(){return new this.constructor(this.array,this.itemSize).copy(this)}toJSON(){let e={itemSize:this.itemSize,type:this.array.constructor.name,array:Array.from(this.array),normalized:this.normalized};return this.name!==""&&(e.name=this.name),this.usage!==jc&&(e.usage=this.usage),e}};var Mo=class extends tn{constructor(e,t,n){super(new Uint16Array(e),t,n)}};var So=class extends tn{constructor(e,t,n){super(new Uint32Array(e),t,n)}};var lt=class extends tn{constructor(e,t,n){super(new Float32Array(e),t,n)}},pm=0,on=new _t,Za=new Nt,qi=new R,en=new yn,Ds=new yn,Rt=new R,It=class i extends ii{constructor(){super(),this.isBufferGeometry=!0,Object.defineProperty(this,"id",{value:pm++}),this.uuid=Mn(),this.name="",this.type="BufferGeometry",this.index=null,this.attributes={},this.morphAttributes={},this.morphTargetsRelative=!1,this.groups=[],this.boundingBox=null,this.boundingSphere=null,this.drawRange={start:0,count:1/0},this.userData={}}getIndex(){return this.index}setIndex(e){return Array.isArray(e)?this.index=new(Hd(e)?So:Mo)(e,1):this.index=e,this}getAttribute(e){return this.attributes[e]}setAttribute(e,t){return this.attributes[e]=t,this}deleteAttribute(e){return delete this.attributes[e],this}hasAttribute(e){return this.attributes[e]!==void 0}addGroup(e,t,n=0){this.groups.push({start:e,count:t,materialIndex:n})}clearGroups(){this.groups=[]}setDrawRange(e,t){this.drawRange.start=e,this.drawRange.count=t}applyMatrix4(e){let t=this.attributes.position;t!==void 0&&(t.applyMatrix4(e),t.needsUpdate=!0);let n=this.attributes.normal;if(n!==void 0){let r=new je().getNormalMatrix(e);n.applyNormalMatrix(r),n.needsUpdate=!0}let s=this.attributes.tangent;return s!==void 0&&(s.transformDirection(e),s.needsUpdate=!0),this.boundingBox!==null&&this.computeBoundingBox(),this.boundingSphere!==null&&this.computeBoundingSphere(),this}applyQuaternion(e){return on.makeRotationFromQuaternion(e),this.applyMatrix4(on),this}rotateX(e){return on.makeRotationX(e),this.applyMatrix4(on),this}rotateY(e){return on.makeRotationY(e),this.applyMatrix4(on),this}rotateZ(e){return on.makeRotationZ(e),this.applyMatrix4(on),this}translate(e,t,n){return on.makeTranslation(e,t,n),this.applyMatrix4(on),this}scale(e,t,n){return on.makeScale(e,t,n),this.applyMatrix4(on),this}lookAt(e){return Za.lookAt(e),Za.updateMatrix(),this.applyMatrix4(Za.matrix),this}center(){return this.computeBoundingBox(),this.boundingBox.getCenter(qi).negate(),this.translate(qi.x,qi.y,qi.z),this}setFromPoints(e){let t=[];for(let n=0,s=e.length;n<s;n++){let r=e[n];t.push(r.x,r.y,r.z||0)}return this.setAttribute("position",new lt(t,3)),this}computeBoundingBox(){this.boundingBox===null&&(this.boundingBox=new yn);let e=this.attributes.position,t=this.morphAttributes.position;if(e&&e.isGLBufferAttribute){console.error("THREE.BufferGeometry.computeBoundingBox(): GLBufferAttribute requires a manual bounding box.",this),this.boundingBox.set(new R(-1/0,-1/0,-1/0),new R(1/0,1/0,1/0));return}if(e!==void 0){if(this.boundingBox.setFromBufferAttribute(e),t)for(let n=0,s=t.length;n<s;n++){let r=t[n];en.setFromBufferAttribute(r),this.morphTargetsRelative?(Rt.addVectors(this.boundingBox.min,en.min),this.boundingBox.expandByPoint(Rt),Rt.addVectors(this.boundingBox.max,en.max),this.boundingBox.expandByPoint(Rt)):(this.boundingBox.expandByPoint(en.min),this.boundingBox.expandByPoint(en.max))}}else this.boundingBox.makeEmpty();(isNaN(this.boundingBox.min.x)||isNaN(this.boundingBox.min.y)||isNaN(this.boundingBox.min.z))&&console.error('THREE.BufferGeometry.computeBoundingBox(): Computed min/max have NaN values. The "position" attribute is likely to have NaN values.',this)}computeBoundingSphere(){this.boundingSphere===null&&(this.boundingSphere=new us);let e=this.attributes.position,t=this.morphAttributes.position;if(e&&e.isGLBufferAttribute){console.error("THREE.BufferGeometry.computeBoundingSphere(): GLBufferAttribute requires a manual bounding sphere.",this),this.boundingSphere.set(new R,1/0);return}if(e){let n=this.boundingSphere.center;if(en.setFromBufferAttribute(e),t)for(let r=0,o=t.length;r<o;r++){let a=t[r];Ds.setFromBufferAttribute(a),this.morphTargetsRelative?(Rt.addVectors(en.min,Ds.min),en.expandByPoint(Rt),Rt.addVectors(en.max,Ds.max),en.expandByPoint(Rt)):(en.expandByPoint(Ds.min),en.expandByPoint(Ds.max))}en.getCenter(n);let s=0;for(let r=0,o=e.count;r<o;r++)Rt.fromBufferAttribute(e,r),s=Math.max(s,n.distanceToSquared(Rt));if(t)for(let r=0,o=t.length;r<o;r++){let a=t[r],c=this.morphTargetsRelative;for(let l=0,h=a.count;l<h;l++)Rt.fromBufferAttribute(a,l),c&&(qi.fromBufferAttribute(e,l),Rt.add(qi)),s=Math.max(s,n.distanceToSquared(Rt))}this.boundingSphere.radius=Math.sqrt(s),isNaN(this.boundingSphere.radius)&&console.error('THREE.BufferGeometry.computeBoundingSphere(): Computed radius is NaN. The "position" attribute is likely to have NaN values.',this)}}computeTangents(){let e=this.index,t=this.attributes;if(e===null||t.position===void 0||t.normal===void 0||t.uv===void 0){console.error("THREE.BufferGeometry: .computeTangents() failed. Missing required attributes (index, position, normal or uv)");return}let n=t.position,s=t.normal,r=t.uv;this.hasAttribute("tangent")===!1&&this.setAttribute("tangent",new tn(new Float32Array(4*n.count),4));let o=this.getAttribute("tangent"),a=[],c=[];for(let P=0;P<n.count;P++)a[P]=new R,c[P]=new R;let l=new R,h=new R,u=new R,d=new le,f=new le,g=new le,y=new R,m=new R;function p(P,z,_){l.fromBufferAttribute(n,P),h.fromBufferAttribute(n,z),u.fromBufferAttribute(n,_),d.fromBufferAttribute(r,P),f.fromBufferAttribute(r,z),g.fromBufferAttribute(r,_),h.sub(l),u.sub(l),f.sub(d),g.sub(d);let S=1/(f.x*g.y-g.x*f.y);isFinite(S)&&(y.copy(h).multiplyScalar(g.y).addScaledVector(u,-f.y).multiplyScalar(S),m.copy(u).multiplyScalar(f.x).addScaledVector(h,-g.x).multiplyScalar(S),a[P].add(y),a[z].add(y),a[_].add(y),c[P].add(m),c[z].add(m),c[_].add(m))}let M=this.groups;M.length===0&&(M=[{start:0,count:e.count}]);for(let P=0,z=M.length;P<z;++P){let _=M[P],S=_.start,L=_.count;for(let N=S,H=S+L;N<H;N+=3)p(e.getX(N+0),e.getX(N+1),e.getX(N+2))}let x=new R,b=new R,D=new R,A=new R;function C(P){D.fromBufferAttribute(s,P),A.copy(D);let z=a[P];x.copy(z),x.sub(D.multiplyScalar(D.dot(z))).normalize(),b.crossVectors(A,z);let S=b.dot(c[P])<0?-1:1;o.setXYZW(P,x.x,x.y,x.z,S)}for(let P=0,z=M.length;P<z;++P){let _=M[P],S=_.start,L=_.count;for(let N=S,H=S+L;N<H;N+=3)C(e.getX(N+0)),C(e.getX(N+1)),C(e.getX(N+2))}}computeVertexNormals(){let e=this.index,t=this.getAttribute("position");if(t!==void 0){let n=this.getAttribute("normal");if(n===void 0)n=new tn(new Float32Array(t.count*3),3),this.setAttribute("normal",n);else for(let d=0,f=n.count;d<f;d++)n.setXYZ(d,0,0,0);let s=new R,r=new R,o=new R,a=new R,c=new R,l=new R,h=new R,u=new R;if(e)for(let d=0,f=e.count;d<f;d+=3){let g=e.getX(d+0),y=e.getX(d+1),m=e.getX(d+2);s.fromBufferAttribute(t,g),r.fromBufferAttribute(t,y),o.fromBufferAttribute(t,m),h.subVectors(o,r),u.subVectors(s,r),h.cross(u),a.fromBufferAttribute(n,g),c.fromBufferAttribute(n,y),l.fromBufferAttribute(n,m),a.add(h),c.add(h),l.add(h),n.setXYZ(g,a.x,a.y,a.z),n.setXYZ(y,c.x,c.y,c.z),n.setXYZ(m,l.x,l.y,l.z)}else for(let d=0,f=t.count;d<f;d+=3)s.fromBufferAttribute(t,d+0),r.fromBufferAttribute(t,d+1),o.fromBufferAttribute(t,d+2),h.subVectors(o,r),u.subVectors(s,r),h.cross(u),n.setXYZ(d+0,h.x,h.y,h.z),n.setXYZ(d+1,h.x,h.y,h.z),n.setXYZ(d+2,h.x,h.y,h.z);this.normalizeNormals(),n.needsUpdate=!0}}normalizeNormals(){let e=this.attributes.normal;for(let t=0,n=e.count;t<n;t++)Rt.fromBufferAttribute(e,t),Rt.normalize(),e.setXYZ(t,Rt.x,Rt.y,Rt.z)}toNonIndexed(){function e(a,c){let l=a.array,h=a.itemSize,u=a.normalized,d=new l.constructor(c.length*h),f=0,g=0;for(let y=0,m=c.length;y<m;y++){a.isInterleavedBufferAttribute?f=c[y]*a.data.stride+a.offset:f=c[y]*h;for(let p=0;p<h;p++)d[g++]=l[f++]}return new tn(d,h,u)}if(this.index===null)return console.warn("THREE.BufferGeometry.toNonIndexed(): BufferGeometry is already non-indexed."),this;let t=new i,n=this.index.array,s=this.attributes;for(let a in s){let c=s[a],l=e(c,n);t.setAttribute(a,l)}let r=this.morphAttributes;for(let a in r){let c=[],l=r[a];for(let h=0,u=l.length;h<u;h++){let d=l[h],f=e(d,n);c.push(f)}t.morphAttributes[a]=c}t.morphTargetsRelative=this.morphTargetsRelative;let o=this.groups;for(let a=0,c=o.length;a<c;a++){let l=o[a];t.addGroup(l.start,l.count,l.materialIndex)}return t}toJSON(){let e={metadata:{version:4.6,type:"BufferGeometry",generator:"BufferGeometry.toJSON"}};if(e.uuid=this.uuid,e.type=this.type,this.name!==""&&(e.name=this.name),Object.keys(this.userData).length>0&&(e.userData=this.userData),this.parameters!==void 0){let c=this.parameters;for(let l in c)c[l]!==void 0&&(e[l]=c[l]);return e}e.data={attributes:{}};let t=this.index;t!==null&&(e.data.index={type:t.array.constructor.name,array:Array.prototype.slice.call(t.array)});let n=this.attributes;for(let c in n){let l=n[c];e.data.attributes[c]=l.toJSON(e.data)}let s={},r=!1;for(let c in this.morphAttributes){let l=this.morphAttributes[c],h=[];for(let u=0,d=l.length;u<d;u++){let f=l[u];h.push(f.toJSON(e.data))}h.length>0&&(s[c]=h,r=!0)}r&&(e.data.morphAttributes=s,e.data.morphTargetsRelative=this.morphTargetsRelative);let o=this.groups;o.length>0&&(e.data.groups=JSON.parse(JSON.stringify(o)));let a=this.boundingSphere;return a!==null&&(e.data.boundingSphere={center:a.center.toArray(),radius:a.radius}),e}clone(){return new this.constructor().copy(this)}copy(e){this.index=null,this.attributes={},this.morphAttributes={},this.groups=[],this.boundingBox=null,this.boundingSphere=null;let t={};this.name=e.name;let n=e.index;n!==null&&this.setIndex(n.clone(t));let s=e.attributes;for(let l in s){let h=s[l];this.setAttribute(l,h.clone(t))}let r=e.morphAttributes;for(let l in r){let h=[],u=r[l];for(let d=0,f=u.length;d<f;d++)h.push(u[d].clone(t));this.morphAttributes[l]=h}this.morphTargetsRelative=e.morphTargetsRelative;let o=e.groups;for(let l=0,h=o.length;l<h;l++){let u=o[l];this.addGroup(u.start,u.count,u.materialIndex)}let a=e.boundingBox;a!==null&&(this.boundingBox=a.clone());let c=e.boundingSphere;return c!==null&&(this.boundingSphere=c.clone()),this.drawRange.start=e.drawRange.start,this.drawRange.count=e.drawRange.count,this.userData=e.userData,this}dispose(){this.dispatchEvent({type:"dispose"})}},zu=new _t,di=new vo,Br=new us,Hu=new R,zr=new R,Hr=new R,Vr=new R,ja=new R,Gr=new R,Vu=new R,Wr=new R,tt=class extends Nt{constructor(e=new It,t=new Wn){super(),this.isMesh=!0,this.type="Mesh",this.geometry=e,this.material=t,this.updateMorphTargets()}copy(e,t){return super.copy(e,t),e.morphTargetInfluences!==void 0&&(this.morphTargetInfluences=e.morphTargetInfluences.slice()),e.morphTargetDictionary!==void 0&&(this.morphTargetDictionary=Object.assign({},e.morphTargetDictionary)),this.material=Array.isArray(e.material)?e.material.slice():e.material,this.geometry=e.geometry,this}updateMorphTargets(){let t=this.geometry.morphAttributes,n=Object.keys(t);if(n.length>0){let s=t[n[0]];if(s!==void 0){this.morphTargetInfluences=[],this.morphTargetDictionary={};for(let r=0,o=s.length;r<o;r++){let a=s[r].name||String(r);this.morphTargetInfluences.push(0),this.morphTargetDictionary[a]=r}}}}getVertexPosition(e,t){let n=this.geometry,s=n.attributes.position,r=n.morphAttributes.position,o=n.morphTargetsRelative;t.fromBufferAttribute(s,e);let a=this.morphTargetInfluences;if(r&&a){Gr.set(0,0,0);for(let c=0,l=r.length;c<l;c++){let h=a[c],u=r[c];h!==0&&(ja.fromBufferAttribute(u,e),o?Gr.addScaledVector(ja,h):Gr.addScaledVector(ja.sub(t),h))}t.add(Gr)}return t}raycast(e,t){let n=this.geometry,s=this.material,r=this.matrixWorld;s!==void 0&&(n.boundingSphere===null&&n.computeBoundingSphere(),Br.copy(n.boundingSphere),Br.applyMatrix4(r),di.copy(e.ray).recast(e.near),!(Br.containsPoint(di.origin)===!1&&(di.intersectSphere(Br,Hu)===null||di.origin.distanceToSquared(Hu)>(e.far-e.near)**2))&&(zu.copy(r).invert(),di.copy(e.ray).applyMatrix4(zu),!(n.boundingBox!==null&&di.intersectsBox(n.boundingBox)===!1)&&this._computeIntersections(e,t,di)))}_computeIntersections(e,t,n){let s,r=this.geometry,o=this.material,a=r.index,c=r.attributes.position,l=r.attributes.uv,h=r.attributes.uv1,u=r.attributes.normal,d=r.groups,f=r.drawRange;if(a!==null)if(Array.isArray(o))for(let g=0,y=d.length;g<y;g++){let m=d[g],p=o[m.materialIndex],M=Math.max(m.start,f.start),x=Math.min(a.count,Math.min(m.start+m.count,f.start+f.count));for(let b=M,D=x;b<D;b+=3){let A=a.getX(b),C=a.getX(b+1),P=a.getX(b+2);s=Xr(this,p,e,n,l,h,u,A,C,P),s&&(s.faceIndex=Math.floor(b/3),s.face.materialIndex=m.materialIndex,t.push(s))}}else{let g=Math.max(0,f.start),y=Math.min(a.count,f.start+f.count);for(let m=g,p=y;m<p;m+=3){let M=a.getX(m),x=a.getX(m+1),b=a.getX(m+2);s=Xr(this,o,e,n,l,h,u,M,x,b),s&&(s.faceIndex=Math.floor(m/3),t.push(s))}}else if(c!==void 0)if(Array.isArray(o))for(let g=0,y=d.length;g<y;g++){let m=d[g],p=o[m.materialIndex],M=Math.max(m.start,f.start),x=Math.min(c.count,Math.min(m.start+m.count,f.start+f.count));for(let b=M,D=x;b<D;b+=3){let A=b,C=b+1,P=b+2;s=Xr(this,p,e,n,l,h,u,A,C,P),s&&(s.faceIndex=Math.floor(b/3),s.face.materialIndex=m.materialIndex,t.push(s))}}else{let g=Math.max(0,f.start),y=Math.min(c.count,f.start+f.count);for(let m=g,p=y;m<p;m+=3){let M=m,x=m+1,b=m+2;s=Xr(this,o,e,n,l,h,u,M,x,b),s&&(s.faceIndex=Math.floor(m/3),t.push(s))}}}};function mm(i,e,t,n,s,r,o,a){let c;if(e.side===Ht?c=n.intersectTriangle(o,r,s,!0,a):c=n.intersectTriangle(s,r,o,e.side===Sn,a),c===null)return null;Wr.copy(a),Wr.applyMatrix4(i.matrixWorld);let l=t.ray.origin.distanceTo(Wr);return l<t.near||l>t.far?null:{distance:l,point:Wr.clone(),object:i}}function Xr(i,e,t,n,s,r,o,a,c,l){i.getVertexPosition(a,zr),i.getVertexPosition(c,Hr),i.getVertexPosition(l,Vr);let h=mm(i,e,t,n,zr,Hr,Vr,Vu);if(h){let u=new R;ei.getBarycoord(Vu,zr,Hr,Vr,u),s&&(h.uv=ei.getInterpolatedAttribute(s,a,c,l,u,new le)),r&&(h.uv1=ei.getInterpolatedAttribute(r,a,c,l,u,new le)),o&&(h.normal=ei.getInterpolatedAttribute(o,a,c,l,u,new R),h.normal.dot(n.direction)>0&&h.normal.multiplyScalar(-1));let d={a,b:c,c:l,normal:new R,materialIndex:0};ei.getNormal(zr,Hr,Vr,d.normal),h.face=d,h.barycoord=u}return h}var ye=class i extends It{constructor(e=1,t=1,n=1,s=1,r=1,o=1){super(),this.type="BoxGeometry",this.parameters={width:e,height:t,depth:n,widthSegments:s,heightSegments:r,depthSegments:o};let a=this;s=Math.floor(s),r=Math.floor(r),o=Math.floor(o);let c=[],l=[],h=[],u=[],d=0,f=0;g("z","y","x",-1,-1,n,t,e,o,r,0),g("z","y","x",1,-1,n,t,-e,o,r,1),g("x","z","y",1,1,e,n,t,s,o,2),g("x","z","y",1,-1,e,n,-t,s,o,3),g("x","y","z",1,-1,e,t,n,s,r,4),g("x","y","z",-1,-1,e,t,-n,s,r,5),this.setIndex(c),this.setAttribute("position",new lt(l,3)),this.setAttribute("normal",new lt(h,3)),this.setAttribute("uv",new lt(u,2));function g(y,m,p,M,x,b,D,A,C,P,z){let _=b/C,S=D/P,L=b/2,N=D/2,H=A/2,ne=C+1,V=P+1,se=0,q=0,ve=new R;for(let be=0;be<V;be++){let Me=be*S-N;for(let Ke=0;Ke<ne;Ke++){let nt=Ke*_-L;ve[y]=nt*M,ve[m]=Me*x,ve[p]=H,l.push(ve.x,ve.y,ve.z),ve[y]=0,ve[m]=0,ve[p]=A>0?1:-1,h.push(ve.x,ve.y,ve.z),u.push(Ke/C),u.push(1-be/P),se+=1}}for(let be=0;be<P;be++)for(let Me=0;Me<C;Me++){let Ke=d+Me+ne*be,nt=d+Me+ne*(be+1),J=d+(Me+1)+ne*(be+1),ae=d+(Me+1)+ne*be;c.push(Ke,nt,ae),c.push(nt,J,ae),q+=6}a.addGroup(f,q,z),f+=q,d+=se}}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}static fromJSON(e){return new i(e.width,e.height,e.depth,e.widthSegments,e.heightSegments,e.depthSegments)}};function ds(i){let e={};for(let t in i){e[t]={};for(let n in i[t]){let s=i[t][n];s&&(s.isColor||s.isMatrix3||s.isMatrix4||s.isVector2||s.isVector3||s.isVector4||s.isTexture||s.isQuaternion)?s.isRenderTargetTexture?(console.warn("UniformsUtils: Textures of render targets cannot be cloned via cloneUniforms() or mergeUniforms()."),e[t][n]=null):e[t][n]=s.clone():Array.isArray(s)?e[t][n]=s.slice():e[t][n]=s}}return e}function Wt(i){let e={};for(let t=0;t<i.length;t++){let n=ds(i[t]);for(let s in n)e[s]=n[s]}return e}function gm(i){let e=[];for(let t=0;t<i.length;t++)e.push(i[t].clone());return e}function Gd(i){let e=i.getRenderTarget();return e===null?i.outputColorSpace:e.isXRRenderTarget===!0?e.texture.colorSpace:ct.workingColorSpace}var Zl={clone:ds,merge:Wt},_m=`void main() {
	gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );
}`,ym=`void main() {
	gl_FragColor = vec4( 1.0, 0.0, 0.0, 1.0 );
}`,cn=class extends Gn{constructor(e){super(),this.isShaderMaterial=!0,this.type="ShaderMaterial",this.defines={},this.uniforms={},this.uniformsGroups=[],this.vertexShader=_m,this.fragmentShader=ym,this.linewidth=1,this.wireframe=!1,this.wireframeLinewidth=1,this.fog=!1,this.lights=!1,this.clipping=!1,this.forceSinglePass=!0,this.extensions={clipCullDistance:!1,multiDraw:!1},this.defaultAttributeValues={color:[1,1,1],uv:[0,0],uv1:[0,0]},this.index0AttributeName=void 0,this.uniformsNeedUpdate=!1,this.glslVersion=null,e!==void 0&&this.setValues(e)}copy(e){return super.copy(e),this.fragmentShader=e.fragmentShader,this.vertexShader=e.vertexShader,this.uniforms=ds(e.uniforms),this.uniformsGroups=gm(e.uniformsGroups),this.defines=Object.assign({},e.defines),this.wireframe=e.wireframe,this.wireframeLinewidth=e.wireframeLinewidth,this.fog=e.fog,this.lights=e.lights,this.clipping=e.clipping,this.extensions=Object.assign({},e.extensions),this.glslVersion=e.glslVersion,this}toJSON(e){let t=super.toJSON(e);t.glslVersion=this.glslVersion,t.uniforms={};for(let s in this.uniforms){let o=this.uniforms[s].value;o&&o.isTexture?t.uniforms[s]={type:"t",value:o.toJSON(e).uuid}:o&&o.isColor?t.uniforms[s]={type:"c",value:o.getHex()}:o&&o.isVector2?t.uniforms[s]={type:"v2",value:o.toArray()}:o&&o.isVector3?t.uniforms[s]={type:"v3",value:o.toArray()}:o&&o.isVector4?t.uniforms[s]={type:"v4",value:o.toArray()}:o&&o.isMatrix3?t.uniforms[s]={type:"m3",value:o.toArray()}:o&&o.isMatrix4?t.uniforms[s]={type:"m4",value:o.toArray()}:t.uniforms[s]={value:o}}Object.keys(this.defines).length>0&&(t.defines=this.defines),t.vertexShader=this.vertexShader,t.fragmentShader=this.fragmentShader,t.lights=this.lights,t.clipping=this.clipping;let n={};for(let s in this.extensions)this.extensions[s]===!0&&(n[s]=!0);return Object.keys(n).length>0&&(t.extensions=n),t}},Eo=class extends Nt{constructor(){super(),this.isCamera=!0,this.type="Camera",this.matrixWorldInverse=new _t,this.projectionMatrix=new _t,this.projectionMatrixInverse=new _t,this.coordinateSystem=zn}copy(e,t){return super.copy(e,t),this.matrixWorldInverse.copy(e.matrixWorldInverse),this.projectionMatrix.copy(e.projectionMatrix),this.projectionMatrixInverse.copy(e.projectionMatrixInverse),this.coordinateSystem=e.coordinateSystem,this}getWorldDirection(e){return super.getWorldDirection(e).negate()}updateMatrixWorld(e){super.updateMatrixWorld(e),this.matrixWorldInverse.copy(this.matrixWorld).invert()}updateWorldMatrix(e,t){super.updateWorldMatrix(e,t),this.matrixWorldInverse.copy(this.matrixWorld).invert()}clone(){return new this.constructor().copy(this)}},Kn=new R,Gu=new le,Wu=new le,Ut=class extends Eo{constructor(e=50,t=1,n=.1,s=2e3){super(),this.isPerspectiveCamera=!0,this.type="PerspectiveCamera",this.fov=e,this.zoom=1,this.near=n,this.far=s,this.focus=10,this.aspect=t,this.view=null,this.filmGauge=35,this.filmOffset=0,this.updateProjectionMatrix()}copy(e,t){return super.copy(e,t),this.fov=e.fov,this.zoom=e.zoom,this.near=e.near,this.far=e.far,this.focus=e.focus,this.aspect=e.aspect,this.view=e.view===null?null:Object.assign({},e.view),this.filmGauge=e.filmGauge,this.filmOffset=e.filmOffset,this}setFocalLength(e){let t=.5*this.getFilmHeight()/e;this.fov=$s*2*Math.atan(t),this.updateProjectionMatrix()}getFocalLength(){let e=Math.tan(zs*.5*this.fov);return .5*this.getFilmHeight()/e}getEffectiveFOV(){return $s*2*Math.atan(Math.tan(zs*.5*this.fov)/this.zoom)}getFilmWidth(){return this.filmGauge*Math.min(this.aspect,1)}getFilmHeight(){return this.filmGauge/Math.max(this.aspect,1)}getViewBounds(e,t,n){Kn.set(-1,-1,.5).applyMatrix4(this.projectionMatrixInverse),t.set(Kn.x,Kn.y).multiplyScalar(-e/Kn.z),Kn.set(1,1,.5).applyMatrix4(this.projectionMatrixInverse),n.set(Kn.x,Kn.y).multiplyScalar(-e/Kn.z)}getViewSize(e,t){return this.getViewBounds(e,Gu,Wu),t.subVectors(Wu,Gu)}setViewOffset(e,t,n,s,r,o){this.aspect=e/t,this.view===null&&(this.view={enabled:!0,fullWidth:1,fullHeight:1,offsetX:0,offsetY:0,width:1,height:1}),this.view.enabled=!0,this.view.fullWidth=e,this.view.fullHeight=t,this.view.offsetX=n,this.view.offsetY=s,this.view.width=r,this.view.height=o,this.updateProjectionMatrix()}clearViewOffset(){this.view!==null&&(this.view.enabled=!1),this.updateProjectionMatrix()}updateProjectionMatrix(){let e=this.near,t=e*Math.tan(zs*.5*this.fov)/this.zoom,n=2*t,s=this.aspect*n,r=-.5*s,o=this.view;if(this.view!==null&&this.view.enabled){let c=o.fullWidth,l=o.fullHeight;r+=o.offsetX*s/c,t-=o.offsetY*n/l,s*=o.width/c,n*=o.height/l}let a=this.filmOffset;a!==0&&(r+=e*a/this.getFilmWidth()),this.projectionMatrix.makePerspective(r,r+s,t,t-n,e,this.far,this.coordinateSystem),this.projectionMatrixInverse.copy(this.projectionMatrix).invert()}toJSON(e){let t=super.toJSON(e);return t.object.fov=this.fov,t.object.zoom=this.zoom,t.object.near=this.near,t.object.far=this.far,t.object.focus=this.focus,t.object.aspect=this.aspect,this.view!==null&&(t.object.view=Object.assign({},this.view)),t.object.filmGauge=this.filmGauge,t.object.filmOffset=this.filmOffset,t}},Yi=-90,$i=1,tl=class extends Nt{constructor(e,t,n){super(),this.type="CubeCamera",this.renderTarget=n,this.coordinateSystem=null,this.activeMipmapLevel=0;let s=new Ut(Yi,$i,e,t);s.layers=this.layers,this.add(s);let r=new Ut(Yi,$i,e,t);r.layers=this.layers,this.add(r);let o=new Ut(Yi,$i,e,t);o.layers=this.layers,this.add(o);let a=new Ut(Yi,$i,e,t);a.layers=this.layers,this.add(a);let c=new Ut(Yi,$i,e,t);c.layers=this.layers,this.add(c);let l=new Ut(Yi,$i,e,t);l.layers=this.layers,this.add(l)}updateCoordinateSystem(){let e=this.coordinateSystem,t=this.children.concat(),[n,s,r,o,a,c]=t;for(let l of t)this.remove(l);if(e===zn)n.up.set(0,1,0),n.lookAt(1,0,0),s.up.set(0,1,0),s.lookAt(-1,0,0),r.up.set(0,0,-1),r.lookAt(0,1,0),o.up.set(0,0,1),o.lookAt(0,-1,0),a.up.set(0,1,0),a.lookAt(0,0,1),c.up.set(0,1,0),c.lookAt(0,0,-1);else if(e===go)n.up.set(0,-1,0),n.lookAt(-1,0,0),s.up.set(0,-1,0),s.lookAt(1,0,0),r.up.set(0,0,1),r.lookAt(0,1,0),o.up.set(0,0,-1),o.lookAt(0,-1,0),a.up.set(0,-1,0),a.lookAt(0,0,1),c.up.set(0,-1,0),c.lookAt(0,0,-1);else throw new Error("THREE.CubeCamera.updateCoordinateSystem(): Invalid coordinate system: "+e);for(let l of t)this.add(l),l.updateMatrixWorld()}update(e,t){this.parent===null&&this.updateMatrixWorld();let{renderTarget:n,activeMipmapLevel:s}=this;this.coordinateSystem!==e.coordinateSystem&&(this.coordinateSystem=e.coordinateSystem,this.updateCoordinateSystem());let[r,o,a,c,l,h]=this.children,u=e.getRenderTarget(),d=e.getActiveCubeFace(),f=e.getActiveMipmapLevel(),g=e.xr.enabled;e.xr.enabled=!1;let y=n.texture.generateMipmaps;n.texture.generateMipmaps=!1,e.setRenderTarget(n,0,s),e.render(t,r),e.setRenderTarget(n,1,s),e.render(t,o),e.setRenderTarget(n,2,s),e.render(t,a),e.setRenderTarget(n,3,s),e.render(t,c),e.setRenderTarget(n,4,s),e.render(t,l),n.texture.generateMipmaps=y,e.setRenderTarget(n,5,s),e.render(t,h),e.setRenderTarget(u,d,f),e.xr.enabled=g,n.texture.needsPMREMUpdate=!0}},To=class extends nn{constructor(e,t,n,s,r,o,a,c,l,h){e=e!==void 0?e:[],t=t!==void 0?t:as,super(e,t,n,s,r,o,a,c,l,h),this.isCubeTexture=!0,this.flipY=!1}get images(){return this.image}set images(e){this.image=e}},nl=class extends Vn{constructor(e=1,t={}){super(e,e,t),this.isWebGLCubeRenderTarget=!0;let n={width:e,height:e,depth:1},s=[n,n,n,n,n,n];this.texture=new To(s,t.mapping,t.wrapS,t.wrapT,t.magFilter,t.minFilter,t.format,t.type,t.anisotropy,t.colorSpace),this.texture.isRenderTargetTexture=!0,this.texture.generateMipmaps=t.generateMipmaps!==void 0?t.generateMipmaps:!1,this.texture.minFilter=t.minFilter!==void 0?t.minFilter:mn}fromEquirectangularTexture(e,t){this.texture.type=t.type,this.texture.colorSpace=t.colorSpace,this.texture.generateMipmaps=t.generateMipmaps,this.texture.minFilter=t.minFilter,this.texture.magFilter=t.magFilter;let n={uniforms:{tEquirect:{value:null}},vertexShader:`

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
			`},s=new ye(5,5,5),r=new cn({name:"CubemapFromEquirect",uniforms:ds(n.uniforms),vertexShader:n.vertexShader,fragmentShader:n.fragmentShader,side:Ht,blending:ti});r.uniforms.tEquirect.value=t;let o=new tt(s,r),a=t.minFilter;return t.minFilter===vi&&(t.minFilter=mn),new tl(1,10,this).update(e,o),t.minFilter=a,o.geometry.dispose(),o.material.dispose(),this}clear(e,t,n,s){let r=e.getRenderTarget();for(let o=0;o<6;o++)e.setRenderTarget(this,o),e.clear(t,n,s);e.setRenderTarget(r)}},Ka=new R,xm=new R,vm=new je,On=class{constructor(e=new R(1,0,0),t=0){this.isPlane=!0,this.normal=e,this.constant=t}set(e,t){return this.normal.copy(e),this.constant=t,this}setComponents(e,t,n,s){return this.normal.set(e,t,n),this.constant=s,this}setFromNormalAndCoplanarPoint(e,t){return this.normal.copy(e),this.constant=-t.dot(this.normal),this}setFromCoplanarPoints(e,t,n){let s=Ka.subVectors(n,t).cross(xm.subVectors(e,t)).normalize();return this.setFromNormalAndCoplanarPoint(s,e),this}copy(e){return this.normal.copy(e.normal),this.constant=e.constant,this}normalize(){let e=1/this.normal.length();return this.normal.multiplyScalar(e),this.constant*=e,this}negate(){return this.constant*=-1,this.normal.negate(),this}distanceToPoint(e){return this.normal.dot(e)+this.constant}distanceToSphere(e){return this.distanceToPoint(e.center)-e.radius}projectPoint(e,t){return t.copy(e).addScaledVector(this.normal,-this.distanceToPoint(e))}intersectLine(e,t){let n=e.delta(Ka),s=this.normal.dot(n);if(s===0)return this.distanceToPoint(e.start)===0?t.copy(e.start):null;let r=-(e.start.dot(this.normal)+this.constant)/s;return r<0||r>1?null:t.copy(e.start).addScaledVector(n,r)}intersectsLine(e){let t=this.distanceToPoint(e.start),n=this.distanceToPoint(e.end);return t<0&&n>0||n<0&&t>0}intersectsBox(e){return e.intersectsPlane(this)}intersectsSphere(e){return e.intersectsPlane(this)}coplanarPoint(e){return e.copy(this.normal).multiplyScalar(-this.constant)}applyMatrix4(e,t){let n=t||vm.getNormalMatrix(e),s=this.coplanarPoint(Ka).applyMatrix4(e),r=this.normal.applyMatrix3(n).normalize();return this.constant=-s.dot(r),this}translate(e){return this.constant-=e.dot(this.normal),this}equals(e){return e.normal.equals(this.normal)&&e.constant===this.constant}clone(){return new this.constructor().copy(this)}},fi=new us,qr=new R,Js=class{constructor(e=new On,t=new On,n=new On,s=new On,r=new On,o=new On){this.planes=[e,t,n,s,r,o]}set(e,t,n,s,r,o){let a=this.planes;return a[0].copy(e),a[1].copy(t),a[2].copy(n),a[3].copy(s),a[4].copy(r),a[5].copy(o),this}copy(e){let t=this.planes;for(let n=0;n<6;n++)t[n].copy(e.planes[n]);return this}setFromProjectionMatrix(e,t=zn){let n=this.planes,s=e.elements,r=s[0],o=s[1],a=s[2],c=s[3],l=s[4],h=s[5],u=s[6],d=s[7],f=s[8],g=s[9],y=s[10],m=s[11],p=s[12],M=s[13],x=s[14],b=s[15];if(n[0].setComponents(c-r,d-l,m-f,b-p).normalize(),n[1].setComponents(c+r,d+l,m+f,b+p).normalize(),n[2].setComponents(c+o,d+h,m+g,b+M).normalize(),n[3].setComponents(c-o,d-h,m-g,b-M).normalize(),n[4].setComponents(c-a,d-u,m-y,b-x).normalize(),t===zn)n[5].setComponents(c+a,d+u,m+y,b+x).normalize();else if(t===go)n[5].setComponents(a,u,y,x).normalize();else throw new Error("THREE.Frustum.setFromProjectionMatrix(): Invalid coordinate system: "+t);return this}intersectsObject(e){if(e.boundingSphere!==void 0)e.boundingSphere===null&&e.computeBoundingSphere(),fi.copy(e.boundingSphere).applyMatrix4(e.matrixWorld);else{let t=e.geometry;t.boundingSphere===null&&t.computeBoundingSphere(),fi.copy(t.boundingSphere).applyMatrix4(e.matrixWorld)}return this.intersectsSphere(fi)}intersectsSprite(e){return fi.center.set(0,0,0),fi.radius=.7071067811865476,fi.applyMatrix4(e.matrixWorld),this.intersectsSphere(fi)}intersectsSphere(e){let t=this.planes,n=e.center,s=-e.radius;for(let r=0;r<6;r++)if(t[r].distanceToPoint(n)<s)return!1;return!0}intersectsBox(e){let t=this.planes;for(let n=0;n<6;n++){let s=t[n];if(qr.x=s.normal.x>0?e.max.x:e.min.x,qr.y=s.normal.y>0?e.max.y:e.min.y,qr.z=s.normal.z>0?e.max.z:e.min.z,s.distanceToPoint(qr)<0)return!1}return!0}containsPoint(e){let t=this.planes;for(let n=0;n<6;n++)if(t[n].distanceToPoint(e)<0)return!1;return!0}clone(){return new this.constructor().copy(this)}};function Wd(){let i=null,e=!1,t=null,n=null;function s(r,o){t(r,o),n=i.requestAnimationFrame(s)}return{start:function(){e!==!0&&t!==null&&(n=i.requestAnimationFrame(s),e=!0)},stop:function(){i.cancelAnimationFrame(n),e=!1},setAnimationLoop:function(r){t=r},setContext:function(r){i=r}}}function bm(i){let e=new WeakMap;function t(a,c){let l=a.array,h=a.usage,u=l.byteLength,d=i.createBuffer();i.bindBuffer(c,d),i.bufferData(c,l,h),a.onUploadCallback();let f;if(l instanceof Float32Array)f=i.FLOAT;else if(l instanceof Uint16Array)a.isFloat16BufferAttribute?f=i.HALF_FLOAT:f=i.UNSIGNED_SHORT;else if(l instanceof Int16Array)f=i.SHORT;else if(l instanceof Uint32Array)f=i.UNSIGNED_INT;else if(l instanceof Int32Array)f=i.INT;else if(l instanceof Int8Array)f=i.BYTE;else if(l instanceof Uint8Array)f=i.UNSIGNED_BYTE;else if(l instanceof Uint8ClampedArray)f=i.UNSIGNED_BYTE;else throw new Error("THREE.WebGLAttributes: Unsupported buffer data format: "+l);return{buffer:d,type:f,bytesPerElement:l.BYTES_PER_ELEMENT,version:a.version,size:u}}function n(a,c,l){let h=c.array,u=c.updateRanges;if(i.bindBuffer(l,a),u.length===0)i.bufferSubData(l,0,h);else{u.sort((f,g)=>f.start-g.start);let d=0;for(let f=1;f<u.length;f++){let g=u[d],y=u[f];y.start<=g.start+g.count+1?g.count=Math.max(g.count,y.start+y.count-g.start):(++d,u[d]=y)}u.length=d+1;for(let f=0,g=u.length;f<g;f++){let y=u[f];i.bufferSubData(l,y.start*h.BYTES_PER_ELEMENT,h,y.start,y.count)}c.clearUpdateRanges()}c.onUploadCallback()}function s(a){return a.isInterleavedBufferAttribute&&(a=a.data),e.get(a)}function r(a){a.isInterleavedBufferAttribute&&(a=a.data);let c=e.get(a);c&&(i.deleteBuffer(c.buffer),e.delete(a))}function o(a,c){if(a.isInterleavedBufferAttribute&&(a=a.data),a.isGLBufferAttribute){let h=e.get(a);(!h||h.version<a.version)&&e.set(a,{buffer:a.buffer,type:a.type,bytesPerElement:a.elementSize,version:a.version});return}let l=e.get(a);if(l===void 0)e.set(a,t(a,c));else if(l.version<a.version){if(l.size!==a.array.byteLength)throw new Error("THREE.WebGLAttributes: The size of the buffer attribute's array buffer does not match the original size. Resizing buffer attributes is not supported.");n(l.buffer,a,c),l.version=a.version}}return{get:s,remove:r,update:o}}var ln=class i extends It{constructor(e=1,t=1,n=1,s=1){super(),this.type="PlaneGeometry",this.parameters={width:e,height:t,widthSegments:n,heightSegments:s};let r=e/2,o=t/2,a=Math.floor(n),c=Math.floor(s),l=a+1,h=c+1,u=e/a,d=t/c,f=[],g=[],y=[],m=[];for(let p=0;p<h;p++){let M=p*d-o;for(let x=0;x<l;x++){let b=x*u-r;g.push(b,-M,0),y.push(0,0,1),m.push(x/a),m.push(1-p/c)}}for(let p=0;p<c;p++)for(let M=0;M<a;M++){let x=M+l*p,b=M+l*(p+1),D=M+1+l*(p+1),A=M+1+l*p;f.push(x,b,A),f.push(b,D,A)}this.setIndex(f),this.setAttribute("position",new lt(g,3)),this.setAttribute("normal",new lt(y,3)),this.setAttribute("uv",new lt(m,2))}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}static fromJSON(e){return new i(e.width,e.height,e.widthSegments,e.heightSegments)}},Mm=`#ifdef USE_ALPHAHASH
	if ( diffuseColor.a < getAlphaHashThreshold( vPosition ) ) discard;
#endif`,Sm=`#ifdef USE_ALPHAHASH
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
#endif`,Em=`#ifdef USE_ALPHAMAP
	diffuseColor.a *= texture2D( alphaMap, vAlphaMapUv ).g;
#endif`,Tm=`#ifdef USE_ALPHAMAP
	uniform sampler2D alphaMap;
#endif`,wm=`#ifdef USE_ALPHATEST
	#ifdef ALPHA_TO_COVERAGE
	diffuseColor.a = smoothstep( alphaTest, alphaTest + fwidth( diffuseColor.a ), diffuseColor.a );
	if ( diffuseColor.a == 0.0 ) discard;
	#else
	if ( diffuseColor.a < alphaTest ) discard;
	#endif
#endif`,Am=`#ifdef USE_ALPHATEST
	uniform float alphaTest;
#endif`,Cm=`#ifdef USE_AOMAP
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
#endif`,Rm=`#ifdef USE_AOMAP
	uniform sampler2D aoMap;
	uniform float aoMapIntensity;
#endif`,Pm=`#ifdef USE_BATCHING
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
#endif`,Im=`#ifdef USE_BATCHING
	mat4 batchingMatrix = getBatchingMatrix( getIndirectIndex( gl_DrawID ) );
#endif`,Lm=`vec3 transformed = vec3( position );
#ifdef USE_ALPHAHASH
	vPosition = vec3( position );
#endif`,Dm=`vec3 objectNormal = vec3( normal );
#ifdef USE_TANGENT
	vec3 objectTangent = vec3( tangent.xyz );
#endif`,Um=`float G_BlinnPhong_Implicit( ) {
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
} // validated`,Nm=`#ifdef USE_IRIDESCENCE
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
#endif`,km=`#ifdef USE_BUMPMAP
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
#endif`,Om=`#if NUM_CLIPPING_PLANES > 0
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
#endif`,Fm=`#if NUM_CLIPPING_PLANES > 0
	varying vec3 vClipPosition;
	uniform vec4 clippingPlanes[ NUM_CLIPPING_PLANES ];
#endif`,Bm=`#if NUM_CLIPPING_PLANES > 0
	varying vec3 vClipPosition;
#endif`,zm=`#if NUM_CLIPPING_PLANES > 0
	vClipPosition = - mvPosition.xyz;
#endif`,Hm=`#if defined( USE_COLOR_ALPHA )
	diffuseColor *= vColor;
#elif defined( USE_COLOR )
	diffuseColor.rgb *= vColor;
#endif`,Vm=`#if defined( USE_COLOR_ALPHA )
	varying vec4 vColor;
#elif defined( USE_COLOR )
	varying vec3 vColor;
#endif`,Gm=`#if defined( USE_COLOR_ALPHA )
	varying vec4 vColor;
#elif defined( USE_COLOR ) || defined( USE_INSTANCING_COLOR ) || defined( USE_BATCHING_COLOR )
	varying vec3 vColor;
#endif`,Wm=`#if defined( USE_COLOR_ALPHA )
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
#endif`,Xm=`#define PI 3.141592653589793
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
} // validated`,qm=`#ifdef ENVMAP_TYPE_CUBE_UV
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
#endif`,Ym=`vec3 transformedNormal = objectNormal;
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
#endif`,$m=`#ifdef USE_DISPLACEMENTMAP
	uniform sampler2D displacementMap;
	uniform float displacementScale;
	uniform float displacementBias;
#endif`,Jm=`#ifdef USE_DISPLACEMENTMAP
	transformed += normalize( objectNormal ) * ( texture2D( displacementMap, vDisplacementMapUv ).x * displacementScale + displacementBias );
#endif`,Zm=`#ifdef USE_EMISSIVEMAP
	vec4 emissiveColor = texture2D( emissiveMap, vEmissiveMapUv );
	totalEmissiveRadiance *= emissiveColor.rgb;
#endif`,jm=`#ifdef USE_EMISSIVEMAP
	uniform sampler2D emissiveMap;
#endif`,Km="gl_FragColor = linearToOutputTexel( gl_FragColor );",Qm=`
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
}`,e0=`#ifdef USE_ENVMAP
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
#endif`,t0=`#ifdef USE_ENVMAP
	uniform float envMapIntensity;
	uniform float flipEnvMap;
	uniform mat3 envMapRotation;
	#ifdef ENVMAP_TYPE_CUBE
		uniform samplerCube envMap;
	#else
		uniform sampler2D envMap;
	#endif
	
#endif`,n0=`#ifdef USE_ENVMAP
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
#endif`,i0=`#ifdef USE_ENVMAP
	#if defined( USE_BUMPMAP ) || defined( USE_NORMALMAP ) || defined( PHONG ) || defined( LAMBERT )
		#define ENV_WORLDPOS
	#endif
	#ifdef ENV_WORLDPOS
		
		varying vec3 vWorldPosition;
	#else
		varying vec3 vReflect;
		uniform float refractionRatio;
	#endif
#endif`,s0=`#ifdef USE_ENVMAP
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
#endif`,r0=`#ifdef USE_FOG
	vFogDepth = - mvPosition.z;
#endif`,o0=`#ifdef USE_FOG
	varying float vFogDepth;
#endif`,a0=`#ifdef USE_FOG
	#ifdef FOG_EXP2
		float fogFactor = 1.0 - exp( - fogDensity * fogDensity * vFogDepth * vFogDepth );
	#else
		float fogFactor = smoothstep( fogNear, fogFar, vFogDepth );
	#endif
	gl_FragColor.rgb = mix( gl_FragColor.rgb, fogColor, fogFactor );
#endif`,c0=`#ifdef USE_FOG
	uniform vec3 fogColor;
	varying float vFogDepth;
	#ifdef FOG_EXP2
		uniform float fogDensity;
	#else
		uniform float fogNear;
		uniform float fogFar;
	#endif
#endif`,l0=`#ifdef USE_GRADIENTMAP
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
}`,h0=`#ifdef USE_LIGHTMAP
	uniform sampler2D lightMap;
	uniform float lightMapIntensity;
#endif`,u0=`LambertMaterial material;
material.diffuseColor = diffuseColor.rgb;
material.specularStrength = specularStrength;`,d0=`varying vec3 vViewPosition;
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
#define RE_IndirectDiffuse		RE_IndirectDiffuse_Lambert`,f0=`uniform bool receiveShadow;
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
#endif`,p0=`#ifdef USE_ENVMAP
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
#endif`,m0=`ToonMaterial material;
material.diffuseColor = diffuseColor.rgb;`,g0=`varying vec3 vViewPosition;
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
#define RE_IndirectDiffuse		RE_IndirectDiffuse_Toon`,_0=`BlinnPhongMaterial material;
material.diffuseColor = diffuseColor.rgb;
material.specularColor = specular;
material.specularShininess = shininess;
material.specularStrength = specularStrength;`,y0=`varying vec3 vViewPosition;
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
#define RE_IndirectDiffuse		RE_IndirectDiffuse_BlinnPhong`,x0=`PhysicalMaterial material;
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
#endif`,v0=`struct PhysicalMaterial {
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
}`,b0=`
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
#endif`,M0=`#if defined( RE_IndirectDiffuse )
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
#endif`,S0=`#if defined( RE_IndirectDiffuse )
	RE_IndirectDiffuse( irradiance, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
#endif
#if defined( RE_IndirectSpecular )
	RE_IndirectSpecular( radiance, iblIrradiance, clearcoatRadiance, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
#endif`,E0=`#if defined( USE_LOGDEPTHBUF )
	gl_FragDepth = vIsPerspective == 0.0 ? gl_FragCoord.z : log2( vFragDepth ) * logDepthBufFC * 0.5;
#endif`,T0=`#if defined( USE_LOGDEPTHBUF )
	uniform float logDepthBufFC;
	varying float vFragDepth;
	varying float vIsPerspective;
#endif`,w0=`#ifdef USE_LOGDEPTHBUF
	varying float vFragDepth;
	varying float vIsPerspective;
#endif`,A0=`#ifdef USE_LOGDEPTHBUF
	vFragDepth = 1.0 + gl_Position.w;
	vIsPerspective = float( isPerspectiveMatrix( projectionMatrix ) );
#endif`,C0=`#ifdef USE_MAP
	vec4 sampledDiffuseColor = texture2D( map, vMapUv );
	#ifdef DECODE_VIDEO_TEXTURE
		sampledDiffuseColor = vec4( mix( pow( sampledDiffuseColor.rgb * 0.9478672986 + vec3( 0.0521327014 ), vec3( 2.4 ) ), sampledDiffuseColor.rgb * 0.0773993808, vec3( lessThanEqual( sampledDiffuseColor.rgb, vec3( 0.04045 ) ) ) ), sampledDiffuseColor.w );
	
	#endif
	diffuseColor *= sampledDiffuseColor;
#endif`,R0=`#ifdef USE_MAP
	uniform sampler2D map;
#endif`,P0=`#if defined( USE_MAP ) || defined( USE_ALPHAMAP )
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
#endif`,I0=`#if defined( USE_POINTS_UV )
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
#endif`,L0=`float metalnessFactor = metalness;
#ifdef USE_METALNESSMAP
	vec4 texelMetalness = texture2D( metalnessMap, vMetalnessMapUv );
	metalnessFactor *= texelMetalness.b;
#endif`,D0=`#ifdef USE_METALNESSMAP
	uniform sampler2D metalnessMap;
#endif`,U0=`#ifdef USE_INSTANCING_MORPH
	float morphTargetInfluences[ MORPHTARGETS_COUNT ];
	float morphTargetBaseInfluence = texelFetch( morphTexture, ivec2( 0, gl_InstanceID ), 0 ).r;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		morphTargetInfluences[i] =  texelFetch( morphTexture, ivec2( i + 1, gl_InstanceID ), 0 ).r;
	}
#endif`,N0=`#if defined( USE_MORPHCOLORS )
	vColor *= morphTargetBaseInfluence;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		#if defined( USE_COLOR_ALPHA )
			if ( morphTargetInfluences[ i ] != 0.0 ) vColor += getMorph( gl_VertexID, i, 2 ) * morphTargetInfluences[ i ];
		#elif defined( USE_COLOR )
			if ( morphTargetInfluences[ i ] != 0.0 ) vColor += getMorph( gl_VertexID, i, 2 ).rgb * morphTargetInfluences[ i ];
		#endif
	}
#endif`,k0=`#ifdef USE_MORPHNORMALS
	objectNormal *= morphTargetBaseInfluence;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		if ( morphTargetInfluences[ i ] != 0.0 ) objectNormal += getMorph( gl_VertexID, i, 1 ).xyz * morphTargetInfluences[ i ];
	}
#endif`,O0=`#ifdef USE_MORPHTARGETS
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
#endif`,F0=`#ifdef USE_MORPHTARGETS
	transformed *= morphTargetBaseInfluence;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		if ( morphTargetInfluences[ i ] != 0.0 ) transformed += getMorph( gl_VertexID, i, 0 ).xyz * morphTargetInfluences[ i ];
	}
#endif`,B0=`float faceDirection = gl_FrontFacing ? 1.0 : - 1.0;
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
vec3 nonPerturbedNormal = normal;`,z0=`#ifdef USE_NORMALMAP_OBJECTSPACE
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
#endif`,H0=`#ifndef FLAT_SHADED
	varying vec3 vNormal;
	#ifdef USE_TANGENT
		varying vec3 vTangent;
		varying vec3 vBitangent;
	#endif
#endif`,V0=`#ifndef FLAT_SHADED
	varying vec3 vNormal;
	#ifdef USE_TANGENT
		varying vec3 vTangent;
		varying vec3 vBitangent;
	#endif
#endif`,G0=`#ifndef FLAT_SHADED
	vNormal = normalize( transformedNormal );
	#ifdef USE_TANGENT
		vTangent = normalize( transformedTangent );
		vBitangent = normalize( cross( vNormal, vTangent ) * tangent.w );
	#endif
#endif`,W0=`#ifdef USE_NORMALMAP
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
#endif`,X0=`#ifdef USE_CLEARCOAT
	vec3 clearcoatNormal = nonPerturbedNormal;
#endif`,q0=`#ifdef USE_CLEARCOAT_NORMALMAP
	vec3 clearcoatMapN = texture2D( clearcoatNormalMap, vClearcoatNormalMapUv ).xyz * 2.0 - 1.0;
	clearcoatMapN.xy *= clearcoatNormalScale;
	clearcoatNormal = normalize( tbn2 * clearcoatMapN );
#endif`,Y0=`#ifdef USE_CLEARCOATMAP
	uniform sampler2D clearcoatMap;
#endif
#ifdef USE_CLEARCOAT_NORMALMAP
	uniform sampler2D clearcoatNormalMap;
	uniform vec2 clearcoatNormalScale;
#endif
#ifdef USE_CLEARCOAT_ROUGHNESSMAP
	uniform sampler2D clearcoatRoughnessMap;
#endif`,$0=`#ifdef USE_IRIDESCENCEMAP
	uniform sampler2D iridescenceMap;
#endif
#ifdef USE_IRIDESCENCE_THICKNESSMAP
	uniform sampler2D iridescenceThicknessMap;
#endif`,J0=`#ifdef OPAQUE
diffuseColor.a = 1.0;
#endif
#ifdef USE_TRANSMISSION
diffuseColor.a *= material.transmissionAlpha;
#endif
gl_FragColor = vec4( outgoingLight, diffuseColor.a );`,Z0=`vec3 packNormalToRGB( const in vec3 normal ) {
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
}`,j0=`#ifdef PREMULTIPLIED_ALPHA
	gl_FragColor.rgb *= gl_FragColor.a;
#endif`,K0=`vec4 mvPosition = vec4( transformed, 1.0 );
#ifdef USE_BATCHING
	mvPosition = batchingMatrix * mvPosition;
#endif
#ifdef USE_INSTANCING
	mvPosition = instanceMatrix * mvPosition;
#endif
mvPosition = modelViewMatrix * mvPosition;
gl_Position = projectionMatrix * mvPosition;`,Q0=`#ifdef DITHERING
	gl_FragColor.rgb = dithering( gl_FragColor.rgb );
#endif`,eg=`#ifdef DITHERING
	vec3 dithering( vec3 color ) {
		float grid_position = rand( gl_FragCoord.xy );
		vec3 dither_shift_RGB = vec3( 0.25 / 255.0, -0.25 / 255.0, 0.25 / 255.0 );
		dither_shift_RGB = mix( 2.0 * dither_shift_RGB, -2.0 * dither_shift_RGB, grid_position );
		return color + dither_shift_RGB;
	}
#endif`,tg=`float roughnessFactor = roughness;
#ifdef USE_ROUGHNESSMAP
	vec4 texelRoughness = texture2D( roughnessMap, vRoughnessMapUv );
	roughnessFactor *= texelRoughness.g;
#endif`,ng=`#ifdef USE_ROUGHNESSMAP
	uniform sampler2D roughnessMap;
#endif`,ig=`#if NUM_SPOT_LIGHT_COORDS > 0
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
#endif`,sg=`#if NUM_SPOT_LIGHT_COORDS > 0
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
#endif`,rg=`#if ( defined( USE_SHADOWMAP ) && ( NUM_DIR_LIGHT_SHADOWS > 0 || NUM_POINT_LIGHT_SHADOWS > 0 ) ) || ( NUM_SPOT_LIGHT_COORDS > 0 )
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
#endif`,og=`float getShadowMask() {
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
}`,ag=`#ifdef USE_SKINNING
	mat4 boneMatX = getBoneMatrix( skinIndex.x );
	mat4 boneMatY = getBoneMatrix( skinIndex.y );
	mat4 boneMatZ = getBoneMatrix( skinIndex.z );
	mat4 boneMatW = getBoneMatrix( skinIndex.w );
#endif`,cg=`#ifdef USE_SKINNING
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
#endif`,lg=`#ifdef USE_SKINNING
	vec4 skinVertex = bindMatrix * vec4( transformed, 1.0 );
	vec4 skinned = vec4( 0.0 );
	skinned += boneMatX * skinVertex * skinWeight.x;
	skinned += boneMatY * skinVertex * skinWeight.y;
	skinned += boneMatZ * skinVertex * skinWeight.z;
	skinned += boneMatW * skinVertex * skinWeight.w;
	transformed = ( bindMatrixInverse * skinned ).xyz;
#endif`,hg=`#ifdef USE_SKINNING
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
#endif`,ug=`float specularStrength;
#ifdef USE_SPECULARMAP
	vec4 texelSpecular = texture2D( specularMap, vSpecularMapUv );
	specularStrength = texelSpecular.r;
#else
	specularStrength = 1.0;
#endif`,dg=`#ifdef USE_SPECULARMAP
	uniform sampler2D specularMap;
#endif`,fg=`#if defined( TONE_MAPPING )
	gl_FragColor.rgb = toneMapping( gl_FragColor.rgb );
#endif`,pg=`#ifndef saturate
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
vec3 CustomToneMapping( vec3 color ) { return color; }`,mg=`#ifdef USE_TRANSMISSION
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
#endif`,gg=`#ifdef USE_TRANSMISSION
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
#endif`,_g=`#if defined( USE_UV ) || defined( USE_ANISOTROPY )
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
#endif`,yg=`#if defined( USE_UV ) || defined( USE_ANISOTROPY )
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
#endif`,xg=`#if defined( USE_UV ) || defined( USE_ANISOTROPY )
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
#endif`,vg=`#if defined( USE_ENVMAP ) || defined( DISTANCE ) || defined ( USE_SHADOWMAP ) || defined ( USE_TRANSMISSION ) || NUM_SPOT_LIGHT_COORDS > 0
	vec4 worldPosition = vec4( transformed, 1.0 );
	#ifdef USE_BATCHING
		worldPosition = batchingMatrix * worldPosition;
	#endif
	#ifdef USE_INSTANCING
		worldPosition = instanceMatrix * worldPosition;
	#endif
	worldPosition = modelMatrix * worldPosition;
#endif`,bg=`varying vec2 vUv;
uniform mat3 uvTransform;
void main() {
	vUv = ( uvTransform * vec3( uv, 1 ) ).xy;
	gl_Position = vec4( position.xy, 1.0, 1.0 );
}`,Mg=`uniform sampler2D t2D;
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
}`,Sg=`varying vec3 vWorldDirection;
#include <common>
void main() {
	vWorldDirection = transformDirection( position, modelMatrix );
	#include <begin_vertex>
	#include <project_vertex>
	gl_Position.z = gl_Position.w;
}`,Eg=`#ifdef ENVMAP_TYPE_CUBE
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
}`,Tg=`varying vec3 vWorldDirection;
#include <common>
void main() {
	vWorldDirection = transformDirection( position, modelMatrix );
	#include <begin_vertex>
	#include <project_vertex>
	gl_Position.z = gl_Position.w;
}`,wg=`uniform samplerCube tCube;
uniform float tFlip;
uniform float opacity;
varying vec3 vWorldDirection;
void main() {
	vec4 texColor = textureCube( tCube, vec3( tFlip * vWorldDirection.x, vWorldDirection.yz ) );
	gl_FragColor = texColor;
	gl_FragColor.a *= opacity;
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
}`,Ag=`#include <common>
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
}`,Cg=`#if DEPTH_PACKING == 3200
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
}`,Rg=`#define DISTANCE
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
}`,Pg=`#define DISTANCE
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
}`,Ig=`varying vec3 vWorldDirection;
#include <common>
void main() {
	vWorldDirection = transformDirection( position, modelMatrix );
	#include <begin_vertex>
	#include <project_vertex>
}`,Lg=`uniform sampler2D tEquirect;
varying vec3 vWorldDirection;
#include <common>
void main() {
	vec3 direction = normalize( vWorldDirection );
	vec2 sampleUV = equirectUv( direction );
	gl_FragColor = texture2D( tEquirect, sampleUV );
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
}`,Dg=`uniform float scale;
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
}`,Ug=`uniform vec3 diffuse;
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
}`,Ng=`#include <common>
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
}`,kg=`uniform vec3 diffuse;
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
}`,Og=`#define LAMBERT
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
}`,Fg=`#define LAMBERT
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
}`,Bg=`#define MATCAP
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
}`,zg=`#define MATCAP
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
}`,Hg=`#define NORMAL
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
}`,Vg=`#define NORMAL
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
}`,Gg=`#define PHONG
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
}`,Wg=`#define PHONG
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
}`,Xg=`#define STANDARD
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
}`,qg=`#define STANDARD
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
}`,Yg=`#define TOON
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
}`,$g=`#define TOON
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
}`,Jg=`uniform float size;
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
}`,Zg=`uniform vec3 diffuse;
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
}`,jg=`#include <common>
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
}`,Kg=`uniform vec3 color;
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
}`,Qg=`uniform float rotation;
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
}`,e_=`uniform vec3 diffuse;
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
}`,Ze={alphahash_fragment:Mm,alphahash_pars_fragment:Sm,alphamap_fragment:Em,alphamap_pars_fragment:Tm,alphatest_fragment:wm,alphatest_pars_fragment:Am,aomap_fragment:Cm,aomap_pars_fragment:Rm,batching_pars_vertex:Pm,batching_vertex:Im,begin_vertex:Lm,beginnormal_vertex:Dm,bsdfs:Um,iridescence_fragment:Nm,bumpmap_pars_fragment:km,clipping_planes_fragment:Om,clipping_planes_pars_fragment:Fm,clipping_planes_pars_vertex:Bm,clipping_planes_vertex:zm,color_fragment:Hm,color_pars_fragment:Vm,color_pars_vertex:Gm,color_vertex:Wm,common:Xm,cube_uv_reflection_fragment:qm,defaultnormal_vertex:Ym,displacementmap_pars_vertex:$m,displacementmap_vertex:Jm,emissivemap_fragment:Zm,emissivemap_pars_fragment:jm,colorspace_fragment:Km,colorspace_pars_fragment:Qm,envmap_fragment:e0,envmap_common_pars_fragment:t0,envmap_pars_fragment:n0,envmap_pars_vertex:i0,envmap_physical_pars_fragment:p0,envmap_vertex:s0,fog_vertex:r0,fog_pars_vertex:o0,fog_fragment:a0,fog_pars_fragment:c0,gradientmap_pars_fragment:l0,lightmap_pars_fragment:h0,lights_lambert_fragment:u0,lights_lambert_pars_fragment:d0,lights_pars_begin:f0,lights_toon_fragment:m0,lights_toon_pars_fragment:g0,lights_phong_fragment:_0,lights_phong_pars_fragment:y0,lights_physical_fragment:x0,lights_physical_pars_fragment:v0,lights_fragment_begin:b0,lights_fragment_maps:M0,lights_fragment_end:S0,logdepthbuf_fragment:E0,logdepthbuf_pars_fragment:T0,logdepthbuf_pars_vertex:w0,logdepthbuf_vertex:A0,map_fragment:C0,map_pars_fragment:R0,map_particle_fragment:P0,map_particle_pars_fragment:I0,metalnessmap_fragment:L0,metalnessmap_pars_fragment:D0,morphinstance_vertex:U0,morphcolor_vertex:N0,morphnormal_vertex:k0,morphtarget_pars_vertex:O0,morphtarget_vertex:F0,normal_fragment_begin:B0,normal_fragment_maps:z0,normal_pars_fragment:H0,normal_pars_vertex:V0,normal_vertex:G0,normalmap_pars_fragment:W0,clearcoat_normal_fragment_begin:X0,clearcoat_normal_fragment_maps:q0,clearcoat_pars_fragment:Y0,iridescence_pars_fragment:$0,opaque_fragment:J0,packing:Z0,premultiplied_alpha_fragment:j0,project_vertex:K0,dithering_fragment:Q0,dithering_pars_fragment:eg,roughnessmap_fragment:tg,roughnessmap_pars_fragment:ng,shadowmap_pars_fragment:ig,shadowmap_pars_vertex:sg,shadowmap_vertex:rg,shadowmask_pars_fragment:og,skinbase_vertex:ag,skinning_pars_vertex:cg,skinning_vertex:lg,skinnormal_vertex:hg,specularmap_fragment:ug,specularmap_pars_fragment:dg,tonemapping_fragment:fg,tonemapping_pars_fragment:pg,transmission_fragment:mg,transmission_pars_fragment:gg,uv_pars_fragment:_g,uv_pars_vertex:yg,uv_vertex:xg,worldpos_vertex:vg,background_vert:bg,background_frag:Mg,backgroundCube_vert:Sg,backgroundCube_frag:Eg,cube_vert:Tg,cube_frag:wg,depth_vert:Ag,depth_frag:Cg,distanceRGBA_vert:Rg,distanceRGBA_frag:Pg,equirect_vert:Ig,equirect_frag:Lg,linedashed_vert:Dg,linedashed_frag:Ug,meshbasic_vert:Ng,meshbasic_frag:kg,meshlambert_vert:Og,meshlambert_frag:Fg,meshmatcap_vert:Bg,meshmatcap_frag:zg,meshnormal_vert:Hg,meshnormal_frag:Vg,meshphong_vert:Gg,meshphong_frag:Wg,meshphysical_vert:Xg,meshphysical_frag:qg,meshtoon_vert:Yg,meshtoon_frag:$g,points_vert:Jg,points_frag:Zg,shadow_vert:jg,shadow_frag:Kg,sprite_vert:Qg,sprite_frag:e_},_e={common:{diffuse:{value:new Qe(16777215)},opacity:{value:1},map:{value:null},mapTransform:{value:new je},alphaMap:{value:null},alphaMapTransform:{value:new je},alphaTest:{value:0}},specularmap:{specularMap:{value:null},specularMapTransform:{value:new je}},envmap:{envMap:{value:null},envMapRotation:{value:new je},flipEnvMap:{value:-1},reflectivity:{value:1},ior:{value:1.5},refractionRatio:{value:.98}},aomap:{aoMap:{value:null},aoMapIntensity:{value:1},aoMapTransform:{value:new je}},lightmap:{lightMap:{value:null},lightMapIntensity:{value:1},lightMapTransform:{value:new je}},bumpmap:{bumpMap:{value:null},bumpMapTransform:{value:new je},bumpScale:{value:1}},normalmap:{normalMap:{value:null},normalMapTransform:{value:new je},normalScale:{value:new le(1,1)}},displacementmap:{displacementMap:{value:null},displacementMapTransform:{value:new je},displacementScale:{value:1},displacementBias:{value:0}},emissivemap:{emissiveMap:{value:null},emissiveMapTransform:{value:new je}},metalnessmap:{metalnessMap:{value:null},metalnessMapTransform:{value:new je}},roughnessmap:{roughnessMap:{value:null},roughnessMapTransform:{value:new je}},gradientmap:{gradientMap:{value:null}},fog:{fogDensity:{value:25e-5},fogNear:{value:1},fogFar:{value:2e3},fogColor:{value:new Qe(16777215)}},lights:{ambientLightColor:{value:[]},lightProbe:{value:[]},directionalLights:{value:[],properties:{direction:{},color:{}}},directionalLightShadows:{value:[],properties:{shadowIntensity:1,shadowBias:{},shadowNormalBias:{},shadowRadius:{},shadowMapSize:{}}},directionalShadowMap:{value:[]},directionalShadowMatrix:{value:[]},spotLights:{value:[],properties:{color:{},position:{},direction:{},distance:{},coneCos:{},penumbraCos:{},decay:{}}},spotLightShadows:{value:[],properties:{shadowIntensity:1,shadowBias:{},shadowNormalBias:{},shadowRadius:{},shadowMapSize:{}}},spotLightMap:{value:[]},spotShadowMap:{value:[]},spotLightMatrix:{value:[]},pointLights:{value:[],properties:{color:{},position:{},decay:{},distance:{}}},pointLightShadows:{value:[],properties:{shadowIntensity:1,shadowBias:{},shadowNormalBias:{},shadowRadius:{},shadowMapSize:{},shadowCameraNear:{},shadowCameraFar:{}}},pointShadowMap:{value:[]},pointShadowMatrix:{value:[]},hemisphereLights:{value:[],properties:{direction:{},skyColor:{},groundColor:{}}},rectAreaLights:{value:[],properties:{color:{},position:{},width:{},height:{}}},ltc_1:{value:null},ltc_2:{value:null}},points:{diffuse:{value:new Qe(16777215)},opacity:{value:1},size:{value:1},scale:{value:1},map:{value:null},alphaMap:{value:null},alphaMapTransform:{value:new je},alphaTest:{value:0},uvTransform:{value:new je}},sprite:{diffuse:{value:new Qe(16777215)},opacity:{value:1},center:{value:new le(.5,.5)},rotation:{value:0},map:{value:null},mapTransform:{value:new je},alphaMap:{value:null},alphaMapTransform:{value:new je},alphaTest:{value:0}}},bn={basic:{uniforms:Wt([_e.common,_e.specularmap,_e.envmap,_e.aomap,_e.lightmap,_e.fog]),vertexShader:Ze.meshbasic_vert,fragmentShader:Ze.meshbasic_frag},lambert:{uniforms:Wt([_e.common,_e.specularmap,_e.envmap,_e.aomap,_e.lightmap,_e.emissivemap,_e.bumpmap,_e.normalmap,_e.displacementmap,_e.fog,_e.lights,{emissive:{value:new Qe(0)}}]),vertexShader:Ze.meshlambert_vert,fragmentShader:Ze.meshlambert_frag},phong:{uniforms:Wt([_e.common,_e.specularmap,_e.envmap,_e.aomap,_e.lightmap,_e.emissivemap,_e.bumpmap,_e.normalmap,_e.displacementmap,_e.fog,_e.lights,{emissive:{value:new Qe(0)},specular:{value:new Qe(1118481)},shininess:{value:30}}]),vertexShader:Ze.meshphong_vert,fragmentShader:Ze.meshphong_frag},standard:{uniforms:Wt([_e.common,_e.envmap,_e.aomap,_e.lightmap,_e.emissivemap,_e.bumpmap,_e.normalmap,_e.displacementmap,_e.roughnessmap,_e.metalnessmap,_e.fog,_e.lights,{emissive:{value:new Qe(0)},roughness:{value:1},metalness:{value:0},envMapIntensity:{value:1}}]),vertexShader:Ze.meshphysical_vert,fragmentShader:Ze.meshphysical_frag},toon:{uniforms:Wt([_e.common,_e.aomap,_e.lightmap,_e.emissivemap,_e.bumpmap,_e.normalmap,_e.displacementmap,_e.gradientmap,_e.fog,_e.lights,{emissive:{value:new Qe(0)}}]),vertexShader:Ze.meshtoon_vert,fragmentShader:Ze.meshtoon_frag},matcap:{uniforms:Wt([_e.common,_e.bumpmap,_e.normalmap,_e.displacementmap,_e.fog,{matcap:{value:null}}]),vertexShader:Ze.meshmatcap_vert,fragmentShader:Ze.meshmatcap_frag},points:{uniforms:Wt([_e.points,_e.fog]),vertexShader:Ze.points_vert,fragmentShader:Ze.points_frag},dashed:{uniforms:Wt([_e.common,_e.fog,{scale:{value:1},dashSize:{value:1},totalSize:{value:2}}]),vertexShader:Ze.linedashed_vert,fragmentShader:Ze.linedashed_frag},depth:{uniforms:Wt([_e.common,_e.displacementmap]),vertexShader:Ze.depth_vert,fragmentShader:Ze.depth_frag},normal:{uniforms:Wt([_e.common,_e.bumpmap,_e.normalmap,_e.displacementmap,{opacity:{value:1}}]),vertexShader:Ze.meshnormal_vert,fragmentShader:Ze.meshnormal_frag},sprite:{uniforms:Wt([_e.sprite,_e.fog]),vertexShader:Ze.sprite_vert,fragmentShader:Ze.sprite_frag},background:{uniforms:{uvTransform:{value:new je},t2D:{value:null},backgroundIntensity:{value:1}},vertexShader:Ze.background_vert,fragmentShader:Ze.background_frag},backgroundCube:{uniforms:{envMap:{value:null},flipEnvMap:{value:-1},backgroundBlurriness:{value:0},backgroundIntensity:{value:1},backgroundRotation:{value:new je}},vertexShader:Ze.backgroundCube_vert,fragmentShader:Ze.backgroundCube_frag},cube:{uniforms:{tCube:{value:null},tFlip:{value:-1},opacity:{value:1}},vertexShader:Ze.cube_vert,fragmentShader:Ze.cube_frag},equirect:{uniforms:{tEquirect:{value:null}},vertexShader:Ze.equirect_vert,fragmentShader:Ze.equirect_frag},distanceRGBA:{uniforms:Wt([_e.common,_e.displacementmap,{referencePosition:{value:new R},nearDistance:{value:1},farDistance:{value:1e3}}]),vertexShader:Ze.distanceRGBA_vert,fragmentShader:Ze.distanceRGBA_frag},shadow:{uniforms:Wt([_e.lights,_e.fog,{color:{value:new Qe(0)},opacity:{value:1}}]),vertexShader:Ze.shadow_vert,fragmentShader:Ze.shadow_frag}};bn.physical={uniforms:Wt([bn.standard.uniforms,{clearcoat:{value:0},clearcoatMap:{value:null},clearcoatMapTransform:{value:new je},clearcoatNormalMap:{value:null},clearcoatNormalMapTransform:{value:new je},clearcoatNormalScale:{value:new le(1,1)},clearcoatRoughness:{value:0},clearcoatRoughnessMap:{value:null},clearcoatRoughnessMapTransform:{value:new je},dispersion:{value:0},iridescence:{value:0},iridescenceMap:{value:null},iridescenceMapTransform:{value:new je},iridescenceIOR:{value:1.3},iridescenceThicknessMinimum:{value:100},iridescenceThicknessMaximum:{value:400},iridescenceThicknessMap:{value:null},iridescenceThicknessMapTransform:{value:new je},sheen:{value:0},sheenColor:{value:new Qe(0)},sheenColorMap:{value:null},sheenColorMapTransform:{value:new je},sheenRoughness:{value:1},sheenRoughnessMap:{value:null},sheenRoughnessMapTransform:{value:new je},transmission:{value:0},transmissionMap:{value:null},transmissionMapTransform:{value:new je},transmissionSamplerSize:{value:new le},transmissionSamplerMap:{value:null},thickness:{value:0},thicknessMap:{value:null},thicknessMapTransform:{value:new je},attenuationDistance:{value:0},attenuationColor:{value:new Qe(0)},specularColor:{value:new Qe(1,1,1)},specularColorMap:{value:null},specularColorMapTransform:{value:new je},specularIntensity:{value:1},specularIntensityMap:{value:null},specularIntensityMapTransform:{value:new je},anisotropyVector:{value:new le},anisotropyMap:{value:null},anisotropyMapTransform:{value:new je}}]),vertexShader:Ze.meshphysical_vert,fragmentShader:Ze.meshphysical_frag};var Yr={r:0,b:0,g:0},pi=new En,t_=new _t;function n_(i,e,t,n,s,r,o){let a=new Qe(0),c=r===!0?0:1,l,h,u=null,d=0,f=null;function g(M){let x=M.isScene===!0?M.background:null;return x&&x.isTexture&&(x=(M.backgroundBlurriness>0?t:e).get(x)),x}function y(M){let x=!1,b=g(M);b===null?p(a,c):b&&b.isColor&&(p(b,1),x=!0);let D=i.xr.getEnvironmentBlendMode();D==="additive"?n.buffers.color.setClear(0,0,0,1,o):D==="alpha-blend"&&n.buffers.color.setClear(0,0,0,0,o),(i.autoClear||x)&&(n.buffers.depth.setTest(!0),n.buffers.depth.setMask(!0),n.buffers.color.setMask(!0),i.clear(i.autoClearColor,i.autoClearDepth,i.autoClearStencil))}function m(M,x){let b=g(x);b&&(b.isCubeTexture||b.mapping===qo)?(h===void 0&&(h=new tt(new ye(1,1,1),new cn({name:"BackgroundCubeMaterial",uniforms:ds(bn.backgroundCube.uniforms),vertexShader:bn.backgroundCube.vertexShader,fragmentShader:bn.backgroundCube.fragmentShader,side:Ht,depthTest:!1,depthWrite:!1,fog:!1})),h.geometry.deleteAttribute("normal"),h.geometry.deleteAttribute("uv"),h.onBeforeRender=function(D,A,C){this.matrixWorld.copyPosition(C.matrixWorld)},Object.defineProperty(h.material,"envMap",{get:function(){return this.uniforms.envMap.value}}),s.update(h)),pi.copy(x.backgroundRotation),pi.x*=-1,pi.y*=-1,pi.z*=-1,b.isCubeTexture&&b.isRenderTargetTexture===!1&&(pi.y*=-1,pi.z*=-1),h.material.uniforms.envMap.value=b,h.material.uniforms.flipEnvMap.value=b.isCubeTexture&&b.isRenderTargetTexture===!1?-1:1,h.material.uniforms.backgroundBlurriness.value=x.backgroundBlurriness,h.material.uniforms.backgroundIntensity.value=x.backgroundIntensity,h.material.uniforms.backgroundRotation.value.setFromMatrix4(t_.makeRotationFromEuler(pi)),h.material.toneMapped=ct.getTransfer(b.colorSpace)!==gt,(u!==b||d!==b.version||f!==i.toneMapping)&&(h.material.needsUpdate=!0,u=b,d=b.version,f=i.toneMapping),h.layers.enableAll(),M.unshift(h,h.geometry,h.material,0,0,null)):b&&b.isTexture&&(l===void 0&&(l=new tt(new ln(2,2),new cn({name:"BackgroundMaterial",uniforms:ds(bn.background.uniforms),vertexShader:bn.background.vertexShader,fragmentShader:bn.background.fragmentShader,side:Sn,depthTest:!1,depthWrite:!1,fog:!1})),l.geometry.deleteAttribute("normal"),Object.defineProperty(l.material,"map",{get:function(){return this.uniforms.t2D.value}}),s.update(l)),l.material.uniforms.t2D.value=b,l.material.uniforms.backgroundIntensity.value=x.backgroundIntensity,l.material.toneMapped=ct.getTransfer(b.colorSpace)!==gt,b.matrixAutoUpdate===!0&&b.updateMatrix(),l.material.uniforms.uvTransform.value.copy(b.matrix),(u!==b||d!==b.version||f!==i.toneMapping)&&(l.material.needsUpdate=!0,u=b,d=b.version,f=i.toneMapping),l.layers.enableAll(),M.unshift(l,l.geometry,l.material,0,0,null))}function p(M,x){M.getRGB(Yr,Gd(i)),n.buffers.color.setClear(Yr.r,Yr.g,Yr.b,x,o)}return{getClearColor:function(){return a},setClearColor:function(M,x=1){a.set(M),c=x,p(a,c)},getClearAlpha:function(){return c},setClearAlpha:function(M){c=M,p(a,c)},render:y,addToRenderList:m}}function i_(i,e){let t=i.getParameter(i.MAX_VERTEX_ATTRIBS),n={},s=d(null),r=s,o=!1;function a(_,S,L,N,H){let ne=!1,V=u(N,L,S);r!==V&&(r=V,l(r.object)),ne=f(_,N,L,H),ne&&g(_,N,L,H),H!==null&&e.update(H,i.ELEMENT_ARRAY_BUFFER),(ne||o)&&(o=!1,b(_,S,L,N),H!==null&&i.bindBuffer(i.ELEMENT_ARRAY_BUFFER,e.get(H).buffer))}function c(){return i.createVertexArray()}function l(_){return i.bindVertexArray(_)}function h(_){return i.deleteVertexArray(_)}function u(_,S,L){let N=L.wireframe===!0,H=n[_.id];H===void 0&&(H={},n[_.id]=H);let ne=H[S.id];ne===void 0&&(ne={},H[S.id]=ne);let V=ne[N];return V===void 0&&(V=d(c()),ne[N]=V),V}function d(_){let S=[],L=[],N=[];for(let H=0;H<t;H++)S[H]=0,L[H]=0,N[H]=0;return{geometry:null,program:null,wireframe:!1,newAttributes:S,enabledAttributes:L,attributeDivisors:N,object:_,attributes:{},index:null}}function f(_,S,L,N){let H=r.attributes,ne=S.attributes,V=0,se=L.getAttributes();for(let q in se)if(se[q].location>=0){let be=H[q],Me=ne[q];if(Me===void 0&&(q==="instanceMatrix"&&_.instanceMatrix&&(Me=_.instanceMatrix),q==="instanceColor"&&_.instanceColor&&(Me=_.instanceColor)),be===void 0||be.attribute!==Me||Me&&be.data!==Me.data)return!0;V++}return r.attributesNum!==V||r.index!==N}function g(_,S,L,N){let H={},ne=S.attributes,V=0,se=L.getAttributes();for(let q in se)if(se[q].location>=0){let be=ne[q];be===void 0&&(q==="instanceMatrix"&&_.instanceMatrix&&(be=_.instanceMatrix),q==="instanceColor"&&_.instanceColor&&(be=_.instanceColor));let Me={};Me.attribute=be,be&&be.data&&(Me.data=be.data),H[q]=Me,V++}r.attributes=H,r.attributesNum=V,r.index=N}function y(){let _=r.newAttributes;for(let S=0,L=_.length;S<L;S++)_[S]=0}function m(_){p(_,0)}function p(_,S){let L=r.newAttributes,N=r.enabledAttributes,H=r.attributeDivisors;L[_]=1,N[_]===0&&(i.enableVertexAttribArray(_),N[_]=1),H[_]!==S&&(i.vertexAttribDivisor(_,S),H[_]=S)}function M(){let _=r.newAttributes,S=r.enabledAttributes;for(let L=0,N=S.length;L<N;L++)S[L]!==_[L]&&(i.disableVertexAttribArray(L),S[L]=0)}function x(_,S,L,N,H,ne,V){V===!0?i.vertexAttribIPointer(_,S,L,H,ne):i.vertexAttribPointer(_,S,L,N,H,ne)}function b(_,S,L,N){y();let H=N.attributes,ne=L.getAttributes(),V=S.defaultAttributeValues;for(let se in ne){let q=ne[se];if(q.location>=0){let ve=H[se];if(ve===void 0&&(se==="instanceMatrix"&&_.instanceMatrix&&(ve=_.instanceMatrix),se==="instanceColor"&&_.instanceColor&&(ve=_.instanceColor)),ve!==void 0){let be=ve.normalized,Me=ve.itemSize,Ke=e.get(ve);if(Ke===void 0)continue;let nt=Ke.buffer,J=Ke.type,ae=Ke.bytesPerElement,we=J===i.INT||J===i.UNSIGNED_INT||ve.gpuType===Hl;if(ve.isInterleavedBufferAttribute){let X=ve.data,xe=X.stride,Oe=ve.offset;if(X.isInstancedInterleavedBuffer){for(let Ne=0;Ne<q.locationSize;Ne++)p(q.location+Ne,X.meshPerAttribute);_.isInstancedMesh!==!0&&N._maxInstanceCount===void 0&&(N._maxInstanceCount=X.meshPerAttribute*X.count)}else for(let Ne=0;Ne<q.locationSize;Ne++)m(q.location+Ne);i.bindBuffer(i.ARRAY_BUFFER,nt);for(let Ne=0;Ne<q.locationSize;Ne++)x(q.location+Ne,Me/q.locationSize,J,be,xe*ae,(Oe+Me/q.locationSize*Ne)*ae,we)}else{if(ve.isInstancedBufferAttribute){for(let X=0;X<q.locationSize;X++)p(q.location+X,ve.meshPerAttribute);_.isInstancedMesh!==!0&&N._maxInstanceCount===void 0&&(N._maxInstanceCount=ve.meshPerAttribute*ve.count)}else for(let X=0;X<q.locationSize;X++)m(q.location+X);i.bindBuffer(i.ARRAY_BUFFER,nt);for(let X=0;X<q.locationSize;X++)x(q.location+X,Me/q.locationSize,J,be,Me*ae,Me/q.locationSize*X*ae,we)}}else if(V!==void 0){let be=V[se];if(be!==void 0)switch(be.length){case 2:i.vertexAttrib2fv(q.location,be);break;case 3:i.vertexAttrib3fv(q.location,be);break;case 4:i.vertexAttrib4fv(q.location,be);break;default:i.vertexAttrib1fv(q.location,be)}}}}M()}function D(){P();for(let _ in n){let S=n[_];for(let L in S){let N=S[L];for(let H in N)h(N[H].object),delete N[H];delete S[L]}delete n[_]}}function A(_){if(n[_.id]===void 0)return;let S=n[_.id];for(let L in S){let N=S[L];for(let H in N)h(N[H].object),delete N[H];delete S[L]}delete n[_.id]}function C(_){for(let S in n){let L=n[S];if(L[_.id]===void 0)continue;let N=L[_.id];for(let H in N)h(N[H].object),delete N[H];delete L[_.id]}}function P(){z(),o=!0,r!==s&&(r=s,l(r.object))}function z(){s.geometry=null,s.program=null,s.wireframe=!1}return{setup:a,reset:P,resetDefaultState:z,dispose:D,releaseStatesOfGeometry:A,releaseStatesOfProgram:C,initAttributes:y,enableAttribute:m,disableUnusedAttributes:M}}function s_(i,e,t){let n;function s(l){n=l}function r(l,h){i.drawArrays(n,l,h),t.update(h,n,1)}function o(l,h,u){u!==0&&(i.drawArraysInstanced(n,l,h,u),t.update(h,n,u))}function a(l,h,u){if(u===0)return;e.get("WEBGL_multi_draw").multiDrawArraysWEBGL(n,l,0,h,0,u);let f=0;for(let g=0;g<u;g++)f+=h[g];t.update(f,n,1)}function c(l,h,u,d){if(u===0)return;let f=e.get("WEBGL_multi_draw");if(f===null)for(let g=0;g<l.length;g++)o(l[g],h[g],d[g]);else{f.multiDrawArraysInstancedWEBGL(n,l,0,h,0,d,0,u);let g=0;for(let y=0;y<u;y++)g+=h[y];for(let y=0;y<d.length;y++)t.update(g,n,d[y])}}this.setMode=s,this.render=r,this.renderInstances=o,this.renderMultiDraw=a,this.renderMultiDrawInstances=c}function r_(i,e,t,n){let s;function r(){if(s!==void 0)return s;if(e.has("EXT_texture_filter_anisotropic")===!0){let C=e.get("EXT_texture_filter_anisotropic");s=i.getParameter(C.MAX_TEXTURE_MAX_ANISOTROPY_EXT)}else s=0;return s}function o(C){return!(C!==_n&&n.convert(C)!==i.getParameter(i.IMPLEMENTATION_COLOR_READ_FORMAT))}function a(C){let P=C===ar&&(e.has("EXT_color_buffer_half_float")||e.has("EXT_color_buffer_float"));return!(C!==Hn&&n.convert(C)!==i.getParameter(i.IMPLEMENTATION_COLOR_READ_TYPE)&&C!==Bn&&!P)}function c(C){if(C==="highp"){if(i.getShaderPrecisionFormat(i.VERTEX_SHADER,i.HIGH_FLOAT).precision>0&&i.getShaderPrecisionFormat(i.FRAGMENT_SHADER,i.HIGH_FLOAT).precision>0)return"highp";C="mediump"}return C==="mediump"&&i.getShaderPrecisionFormat(i.VERTEX_SHADER,i.MEDIUM_FLOAT).precision>0&&i.getShaderPrecisionFormat(i.FRAGMENT_SHADER,i.MEDIUM_FLOAT).precision>0?"mediump":"lowp"}let l=t.precision!==void 0?t.precision:"highp",h=c(l);h!==l&&(console.warn("THREE.WebGLRenderer:",l,"not supported, using",h,"instead."),l=h);let u=t.logarithmicDepthBuffer===!0,d=t.reverseDepthBuffer===!0&&e.has("EXT_clip_control");if(d===!0){let C=e.get("EXT_clip_control");C.clipControlEXT(C.LOWER_LEFT_EXT,C.ZERO_TO_ONE_EXT)}let f=i.getParameter(i.MAX_TEXTURE_IMAGE_UNITS),g=i.getParameter(i.MAX_VERTEX_TEXTURE_IMAGE_UNITS),y=i.getParameter(i.MAX_TEXTURE_SIZE),m=i.getParameter(i.MAX_CUBE_MAP_TEXTURE_SIZE),p=i.getParameter(i.MAX_VERTEX_ATTRIBS),M=i.getParameter(i.MAX_VERTEX_UNIFORM_VECTORS),x=i.getParameter(i.MAX_VARYING_VECTORS),b=i.getParameter(i.MAX_FRAGMENT_UNIFORM_VECTORS),D=g>0,A=i.getParameter(i.MAX_SAMPLES);return{isWebGL2:!0,getMaxAnisotropy:r,getMaxPrecision:c,textureFormatReadable:o,textureTypeReadable:a,precision:l,logarithmicDepthBuffer:u,reverseDepthBuffer:d,maxTextures:f,maxVertexTextures:g,maxTextureSize:y,maxCubemapSize:m,maxAttributes:p,maxVertexUniforms:M,maxVaryings:x,maxFragmentUniforms:b,vertexTextures:D,maxSamples:A}}function o_(i){let e=this,t=null,n=0,s=!1,r=!1,o=new On,a=new je,c={value:null,needsUpdate:!1};this.uniform=c,this.numPlanes=0,this.numIntersection=0,this.init=function(u,d){let f=u.length!==0||d||n!==0||s;return s=d,n=u.length,f},this.beginShadows=function(){r=!0,h(null)},this.endShadows=function(){r=!1},this.setGlobalState=function(u,d){t=h(u,d,0)},this.setState=function(u,d,f){let g=u.clippingPlanes,y=u.clipIntersection,m=u.clipShadows,p=i.get(u);if(!s||g===null||g.length===0||r&&!m)r?h(null):l();else{let M=r?0:n,x=M*4,b=p.clippingState||null;c.value=b,b=h(g,d,x,f);for(let D=0;D!==x;++D)b[D]=t[D];p.clippingState=b,this.numIntersection=y?this.numPlanes:0,this.numPlanes+=M}};function l(){c.value!==t&&(c.value=t,c.needsUpdate=n>0),e.numPlanes=n,e.numIntersection=0}function h(u,d,f,g){let y=u!==null?u.length:0,m=null;if(y!==0){if(m=c.value,g!==!0||m===null){let p=f+y*4,M=d.matrixWorldInverse;a.getNormalMatrix(M),(m===null||m.length<p)&&(m=new Float32Array(p));for(let x=0,b=f;x!==y;++x,b+=4)o.copy(u[x]).applyMatrix4(M,a),o.normal.toArray(m,b),m[b+3]=o.constant}c.value=m,c.needsUpdate=!0}return e.numPlanes=y,e.numIntersection=0,m}}function a_(i){let e=new WeakMap;function t(o,a){return a===bc?o.mapping=as:a===Mc&&(o.mapping=cs),o}function n(o){if(o&&o.isTexture){let a=o.mapping;if(a===bc||a===Mc)if(e.has(o)){let c=e.get(o).texture;return t(c,o.mapping)}else{let c=o.image;if(c&&c.height>0){let l=new nl(c.height);return l.fromEquirectangularTexture(i,o),e.set(o,l),o.addEventListener("dispose",s),t(l.texture,o.mapping)}else return null}}return o}function s(o){let a=o.target;a.removeEventListener("dispose",s);let c=e.get(a);c!==void 0&&(e.delete(a),c.dispose())}function r(){e=new WeakMap}return{get:n,dispose:r}}var wo=class extends Eo{constructor(e=-1,t=1,n=1,s=-1,r=.1,o=2e3){super(),this.isOrthographicCamera=!0,this.type="OrthographicCamera",this.zoom=1,this.view=null,this.left=e,this.right=t,this.top=n,this.bottom=s,this.near=r,this.far=o,this.updateProjectionMatrix()}copy(e,t){return super.copy(e,t),this.left=e.left,this.right=e.right,this.top=e.top,this.bottom=e.bottom,this.near=e.near,this.far=e.far,this.zoom=e.zoom,this.view=e.view===null?null:Object.assign({},e.view),this}setViewOffset(e,t,n,s,r,o){this.view===null&&(this.view={enabled:!0,fullWidth:1,fullHeight:1,offsetX:0,offsetY:0,width:1,height:1}),this.view.enabled=!0,this.view.fullWidth=e,this.view.fullHeight=t,this.view.offsetX=n,this.view.offsetY=s,this.view.width=r,this.view.height=o,this.updateProjectionMatrix()}clearViewOffset(){this.view!==null&&(this.view.enabled=!1),this.updateProjectionMatrix()}updateProjectionMatrix(){let e=(this.right-this.left)/(2*this.zoom),t=(this.top-this.bottom)/(2*this.zoom),n=(this.right+this.left)/2,s=(this.top+this.bottom)/2,r=n-e,o=n+e,a=s+t,c=s-t;if(this.view!==null&&this.view.enabled){let l=(this.right-this.left)/this.view.fullWidth/this.zoom,h=(this.top-this.bottom)/this.view.fullHeight/this.zoom;r+=l*this.view.offsetX,o=r+l*this.view.width,a-=h*this.view.offsetY,c=a-h*this.view.height}this.projectionMatrix.makeOrthographic(r,o,a,c,this.near,this.far,this.coordinateSystem),this.projectionMatrixInverse.copy(this.projectionMatrix).invert()}toJSON(e){let t=super.toJSON(e);return t.object.zoom=this.zoom,t.object.left=this.left,t.object.right=this.right,t.object.top=this.top,t.object.bottom=this.bottom,t.object.near=this.near,t.object.far=this.far,this.view!==null&&(t.object.view=Object.assign({},this.view)),t}},es=4,Xu=[.125,.215,.35,.446,.526,.582],yi=20,Qa=new wo,qu=new Qe,ec=null,tc=0,nc=0,ic=!1,gi=(1+Math.sqrt(5))/2,Ji=1/gi,Yu=[new R(-gi,Ji,0),new R(gi,Ji,0),new R(-Ji,0,gi),new R(Ji,0,gi),new R(0,gi,-Ji),new R(0,gi,Ji),new R(-1,1,-1),new R(1,1,-1),new R(-1,1,1),new R(1,1,1)],Ao=class{constructor(e){this._renderer=e,this._pingPongRenderTarget=null,this._lodMax=0,this._cubeSize=0,this._lodPlanes=[],this._sizeLods=[],this._sigmas=[],this._blurMaterial=null,this._cubemapMaterial=null,this._equirectMaterial=null,this._compileMaterial(this._blurMaterial)}fromScene(e,t=0,n=.1,s=100){ec=this._renderer.getRenderTarget(),tc=this._renderer.getActiveCubeFace(),nc=this._renderer.getActiveMipmapLevel(),ic=this._renderer.xr.enabled,this._renderer.xr.enabled=!1,this._setSize(256);let r=this._allocateTargets();return r.depthBuffer=!0,this._sceneToCubeUV(e,n,s,r),t>0&&this._blur(r,0,0,t),this._applyPMREM(r),this._cleanup(r),r}fromEquirectangular(e,t=null){return this._fromTexture(e,t)}fromCubemap(e,t=null){return this._fromTexture(e,t)}compileCubemapShader(){this._cubemapMaterial===null&&(this._cubemapMaterial=Zu(),this._compileMaterial(this._cubemapMaterial))}compileEquirectangularShader(){this._equirectMaterial===null&&(this._equirectMaterial=Ju(),this._compileMaterial(this._equirectMaterial))}dispose(){this._dispose(),this._cubemapMaterial!==null&&this._cubemapMaterial.dispose(),this._equirectMaterial!==null&&this._equirectMaterial.dispose()}_setSize(e){this._lodMax=Math.floor(Math.log2(e)),this._cubeSize=Math.pow(2,this._lodMax)}_dispose(){this._blurMaterial!==null&&this._blurMaterial.dispose(),this._pingPongRenderTarget!==null&&this._pingPongRenderTarget.dispose();for(let e=0;e<this._lodPlanes.length;e++)this._lodPlanes[e].dispose()}_cleanup(e){this._renderer.setRenderTarget(ec,tc,nc),this._renderer.xr.enabled=ic,e.scissorTest=!1,$r(e,0,0,e.width,e.height)}_fromTexture(e,t){e.mapping===as||e.mapping===cs?this._setSize(e.image.length===0?16:e.image[0].width||e.image[0].image.width):this._setSize(e.image.width/4),ec=this._renderer.getRenderTarget(),tc=this._renderer.getActiveCubeFace(),nc=this._renderer.getActiveMipmapLevel(),ic=this._renderer.xr.enabled,this._renderer.xr.enabled=!1;let n=t||this._allocateTargets();return this._textureToCubeUV(e,n),this._applyPMREM(n),this._cleanup(n),n}_allocateTargets(){let e=3*Math.max(this._cubeSize,112),t=4*this._cubeSize,n={magFilter:mn,minFilter:mn,generateMipmaps:!1,type:ar,format:_n,colorSpace:ri,depthBuffer:!1},s=$u(e,t,n);if(this._pingPongRenderTarget===null||this._pingPongRenderTarget.width!==e||this._pingPongRenderTarget.height!==t){this._pingPongRenderTarget!==null&&this._dispose(),this._pingPongRenderTarget=$u(e,t,n);let{_lodMax:r}=this;({sizeLods:this._sizeLods,lodPlanes:this._lodPlanes,sigmas:this._sigmas}=c_(r)),this._blurMaterial=l_(r,e,t)}return s}_compileMaterial(e){let t=new tt(this._lodPlanes[0],e);this._renderer.compile(t,Qa)}_sceneToCubeUV(e,t,n,s){let a=new Ut(90,1,t,n),c=[1,-1,1,1,1,1],l=[1,1,1,-1,-1,-1],h=this._renderer,u=h.autoClear,d=h.toneMapping;h.getClearColor(qu),h.toneMapping=ni,h.autoClear=!1;let f=new Wn({name:"PMREM.Background",side:Ht,depthWrite:!1,depthTest:!1}),g=new tt(new ye,f),y=!1,m=e.background;m?m.isColor&&(f.color.copy(m),e.background=null,y=!0):(f.color.copy(qu),y=!0);for(let p=0;p<6;p++){let M=p%3;M===0?(a.up.set(0,c[p],0),a.lookAt(l[p],0,0)):M===1?(a.up.set(0,0,c[p]),a.lookAt(0,l[p],0)):(a.up.set(0,c[p],0),a.lookAt(0,0,l[p]));let x=this._cubeSize;$r(s,M*x,p>2?x:0,x,x),h.setRenderTarget(s),y&&h.render(g,a),h.render(e,a)}g.geometry.dispose(),g.material.dispose(),h.toneMapping=d,h.autoClear=u,e.background=m}_textureToCubeUV(e,t){let n=this._renderer,s=e.mapping===as||e.mapping===cs;s?(this._cubemapMaterial===null&&(this._cubemapMaterial=Zu()),this._cubemapMaterial.uniforms.flipEnvMap.value=e.isRenderTargetTexture===!1?-1:1):this._equirectMaterial===null&&(this._equirectMaterial=Ju());let r=s?this._cubemapMaterial:this._equirectMaterial,o=new tt(this._lodPlanes[0],r),a=r.uniforms;a.envMap.value=e;let c=this._cubeSize;$r(t,0,0,3*c,2*c),n.setRenderTarget(t),n.render(o,Qa)}_applyPMREM(e){let t=this._renderer,n=t.autoClear;t.autoClear=!1;let s=this._lodPlanes.length;for(let r=1;r<s;r++){let o=Math.sqrt(this._sigmas[r]*this._sigmas[r]-this._sigmas[r-1]*this._sigmas[r-1]),a=Yu[(s-r-1)%Yu.length];this._blur(e,r-1,r,o,a)}t.autoClear=n}_blur(e,t,n,s,r){let o=this._pingPongRenderTarget;this._halfBlur(e,o,t,n,s,"latitudinal",r),this._halfBlur(o,e,n,n,s,"longitudinal",r)}_halfBlur(e,t,n,s,r,o,a){let c=this._renderer,l=this._blurMaterial;o!=="latitudinal"&&o!=="longitudinal"&&console.error("blur direction must be either latitudinal or longitudinal!");let h=3,u=new tt(this._lodPlanes[s],l),d=l.uniforms,f=this._sizeLods[n]-1,g=isFinite(r)?Math.PI/(2*f):2*Math.PI/(2*yi-1),y=r/g,m=isFinite(r)?1+Math.floor(h*y):yi;m>yi&&console.warn(`sigmaRadians, ${r}, is too large and will clip, as it requested ${m} samples when the maximum is set to ${yi}`);let p=[],M=0;for(let C=0;C<yi;++C){let P=C/y,z=Math.exp(-P*P/2);p.push(z),C===0?M+=z:C<m&&(M+=2*z)}for(let C=0;C<p.length;C++)p[C]=p[C]/M;d.envMap.value=e.texture,d.samples.value=m,d.weights.value=p,d.latitudinal.value=o==="latitudinal",a&&(d.poleAxis.value=a);let{_lodMax:x}=this;d.dTheta.value=g,d.mipInt.value=x-n;let b=this._sizeLods[s],D=3*b*(s>x-es?s-x+es:0),A=4*(this._cubeSize-b);$r(t,D,A,3*b,2*b),c.setRenderTarget(t),c.render(u,Qa)}};function c_(i){let e=[],t=[],n=[],s=i,r=i-es+1+Xu.length;for(let o=0;o<r;o++){let a=Math.pow(2,s);t.push(a);let c=1/a;o>i-es?c=Xu[o-i+es-1]:o===0&&(c=0),n.push(c);let l=1/(a-2),h=-l,u=1+l,d=[h,h,u,h,u,u,h,h,u,u,h,u],f=6,g=6,y=3,m=2,p=1,M=new Float32Array(y*g*f),x=new Float32Array(m*g*f),b=new Float32Array(p*g*f);for(let A=0;A<f;A++){let C=A%3*2/3-1,P=A>2?0:-1,z=[C,P,0,C+2/3,P,0,C+2/3,P+1,0,C,P,0,C+2/3,P+1,0,C,P+1,0];M.set(z,y*g*A),x.set(d,m*g*A);let _=[A,A,A,A,A,A];b.set(_,p*g*A)}let D=new It;D.setAttribute("position",new tn(M,y)),D.setAttribute("uv",new tn(x,m)),D.setAttribute("faceIndex",new tn(b,p)),e.push(D),s>es&&s--}return{lodPlanes:e,sizeLods:t,sigmas:n}}function $u(i,e,t){let n=new Vn(i,e,t);return n.texture.mapping=qo,n.texture.name="PMREM.cubeUv",n.scissorTest=!0,n}function $r(i,e,t,n,s){i.viewport.set(e,t,n,s),i.scissor.set(e,t,n,s)}function l_(i,e,t){let n=new Float32Array(yi),s=new R(0,1,0);return new cn({name:"SphericalGaussianBlur",defines:{n:yi,CUBEUV_TEXEL_WIDTH:1/e,CUBEUV_TEXEL_HEIGHT:1/t,CUBEUV_MAX_MIP:`${i}.0`},uniforms:{envMap:{value:null},samples:{value:1},weights:{value:n},latitudinal:{value:!1},dTheta:{value:0},mipInt:{value:0},poleAxis:{value:s}},vertexShader:jl(),fragmentShader:`

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
		`,blending:ti,depthTest:!1,depthWrite:!1})}function Ju(){return new cn({name:"EquirectangularToCubeUV",uniforms:{envMap:{value:null}},vertexShader:jl(),fragmentShader:`

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
		`,blending:ti,depthTest:!1,depthWrite:!1})}function Zu(){return new cn({name:"CubemapToCubeUV",uniforms:{envMap:{value:null},flipEnvMap:{value:-1}},vertexShader:jl(),fragmentShader:`

			precision mediump float;
			precision mediump int;

			uniform float flipEnvMap;

			varying vec3 vOutputDirection;

			uniform samplerCube envMap;

			void main() {

				gl_FragColor = textureCube( envMap, vec3( flipEnvMap * vOutputDirection.x, vOutputDirection.yz ) );

			}
		`,blending:ti,depthTest:!1,depthWrite:!1})}function jl(){return`

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
	`}function h_(i){let e=new WeakMap,t=null;function n(a){if(a&&a.isTexture){let c=a.mapping,l=c===bc||c===Mc,h=c===as||c===cs;if(l||h){let u=e.get(a),d=u!==void 0?u.texture.pmremVersion:0;if(a.isRenderTargetTexture&&a.pmremVersion!==d)return t===null&&(t=new Ao(i)),u=l?t.fromEquirectangular(a,u):t.fromCubemap(a,u),u.texture.pmremVersion=a.pmremVersion,e.set(a,u),u.texture;if(u!==void 0)return u.texture;{let f=a.image;return l&&f&&f.height>0||h&&f&&s(f)?(t===null&&(t=new Ao(i)),u=l?t.fromEquirectangular(a):t.fromCubemap(a),u.texture.pmremVersion=a.pmremVersion,e.set(a,u),a.addEventListener("dispose",r),u.texture):null}}}return a}function s(a){let c=0,l=6;for(let h=0;h<l;h++)a[h]!==void 0&&c++;return c===l}function r(a){let c=a.target;c.removeEventListener("dispose",r);let l=e.get(c);l!==void 0&&(e.delete(c),l.dispose())}function o(){e=new WeakMap,t!==null&&(t.dispose(),t=null)}return{get:n,dispose:o}}function u_(i){let e={};function t(n){if(e[n]!==void 0)return e[n];let s;switch(n){case"WEBGL_depth_texture":s=i.getExtension("WEBGL_depth_texture")||i.getExtension("MOZ_WEBGL_depth_texture")||i.getExtension("WEBKIT_WEBGL_depth_texture");break;case"EXT_texture_filter_anisotropic":s=i.getExtension("EXT_texture_filter_anisotropic")||i.getExtension("MOZ_EXT_texture_filter_anisotropic")||i.getExtension("WEBKIT_EXT_texture_filter_anisotropic");break;case"WEBGL_compressed_texture_s3tc":s=i.getExtension("WEBGL_compressed_texture_s3tc")||i.getExtension("MOZ_WEBGL_compressed_texture_s3tc")||i.getExtension("WEBKIT_WEBGL_compressed_texture_s3tc");break;case"WEBGL_compressed_texture_pvrtc":s=i.getExtension("WEBGL_compressed_texture_pvrtc")||i.getExtension("WEBKIT_WEBGL_compressed_texture_pvrtc");break;default:s=i.getExtension(n)}return e[n]=s,s}return{has:function(n){return t(n)!==null},init:function(){t("EXT_color_buffer_float"),t("WEBGL_clip_cull_distance"),t("OES_texture_float_linear"),t("EXT_color_buffer_half_float"),t("WEBGL_multisampled_render_to_texture"),t("WEBGL_render_shared_exponent")},get:function(n){let s=t(n);return s===null&&ho("THREE.WebGLRenderer: "+n+" extension not supported."),s}}}function d_(i,e,t,n){let s={},r=new WeakMap;function o(u){let d=u.target;d.index!==null&&e.remove(d.index);for(let g in d.attributes)e.remove(d.attributes[g]);for(let g in d.morphAttributes){let y=d.morphAttributes[g];for(let m=0,p=y.length;m<p;m++)e.remove(y[m])}d.removeEventListener("dispose",o),delete s[d.id];let f=r.get(d);f&&(e.remove(f),r.delete(d)),n.releaseStatesOfGeometry(d),d.isInstancedBufferGeometry===!0&&delete d._maxInstanceCount,t.memory.geometries--}function a(u,d){return s[d.id]===!0||(d.addEventListener("dispose",o),s[d.id]=!0,t.memory.geometries++),d}function c(u){let d=u.attributes;for(let g in d)e.update(d[g],i.ARRAY_BUFFER);let f=u.morphAttributes;for(let g in f){let y=f[g];for(let m=0,p=y.length;m<p;m++)e.update(y[m],i.ARRAY_BUFFER)}}function l(u){let d=[],f=u.index,g=u.attributes.position,y=0;if(f!==null){let M=f.array;y=f.version;for(let x=0,b=M.length;x<b;x+=3){let D=M[x+0],A=M[x+1],C=M[x+2];d.push(D,A,A,C,C,D)}}else if(g!==void 0){let M=g.array;y=g.version;for(let x=0,b=M.length/3-1;x<b;x+=3){let D=x+0,A=x+1,C=x+2;d.push(D,A,A,C,C,D)}}else return;let m=new(Hd(d)?So:Mo)(d,1);m.version=y;let p=r.get(u);p&&e.remove(p),r.set(u,m)}function h(u){let d=r.get(u);if(d){let f=u.index;f!==null&&d.version<f.version&&l(u)}else l(u);return r.get(u)}return{get:a,update:c,getWireframeAttribute:h}}function f_(i,e,t){let n;function s(d){n=d}let r,o;function a(d){r=d.type,o=d.bytesPerElement}function c(d,f){i.drawElements(n,f,r,d*o),t.update(f,n,1)}function l(d,f,g){g!==0&&(i.drawElementsInstanced(n,f,r,d*o,g),t.update(f,n,g))}function h(d,f,g){if(g===0)return;e.get("WEBGL_multi_draw").multiDrawElementsWEBGL(n,f,0,r,d,0,g);let m=0;for(let p=0;p<g;p++)m+=f[p];t.update(m,n,1)}function u(d,f,g,y){if(g===0)return;let m=e.get("WEBGL_multi_draw");if(m===null)for(let p=0;p<d.length;p++)l(d[p]/o,f[p],y[p]);else{m.multiDrawElementsInstancedWEBGL(n,f,0,r,d,0,y,0,g);let p=0;for(let M=0;M<g;M++)p+=f[M];for(let M=0;M<y.length;M++)t.update(p,n,y[M])}}this.setMode=s,this.setIndex=a,this.render=c,this.renderInstances=l,this.renderMultiDraw=h,this.renderMultiDrawInstances=u}function p_(i){let e={geometries:0,textures:0},t={frame:0,calls:0,triangles:0,points:0,lines:0};function n(r,o,a){switch(t.calls++,o){case i.TRIANGLES:t.triangles+=a*(r/3);break;case i.LINES:t.lines+=a*(r/2);break;case i.LINE_STRIP:t.lines+=a*(r-1);break;case i.LINE_LOOP:t.lines+=a*r;break;case i.POINTS:t.points+=a*r;break;default:console.error("THREE.WebGLInfo: Unknown draw mode:",o);break}}function s(){t.calls=0,t.triangles=0,t.points=0,t.lines=0}return{memory:e,render:t,programs:null,autoReset:!0,reset:s,update:n}}function m_(i,e,t){let n=new WeakMap,s=new ft;function r(o,a,c){let l=o.morphTargetInfluences,h=a.morphAttributes.position||a.morphAttributes.normal||a.morphAttributes.color,u=h!==void 0?h.length:0,d=n.get(a);if(d===void 0||d.count!==u){let z=function(){C.dispose(),n.delete(a),a.removeEventListener("dispose",z)};d!==void 0&&d.texture.dispose();let f=a.morphAttributes.position!==void 0,g=a.morphAttributes.normal!==void 0,y=a.morphAttributes.color!==void 0,m=a.morphAttributes.position||[],p=a.morphAttributes.normal||[],M=a.morphAttributes.color||[],x=0;f===!0&&(x=1),g===!0&&(x=2),y===!0&&(x=3);let b=a.attributes.position.count*x,D=1;b>e.maxTextureSize&&(D=Math.ceil(b/e.maxTextureSize),b=e.maxTextureSize);let A=new Float32Array(b*D*4*u),C=new xo(A,b,D,u);C.type=Bn,C.needsUpdate=!0;let P=x*4;for(let _=0;_<u;_++){let S=m[_],L=p[_],N=M[_],H=b*D*4*_;for(let ne=0;ne<S.count;ne++){let V=ne*P;f===!0&&(s.fromBufferAttribute(S,ne),A[H+V+0]=s.x,A[H+V+1]=s.y,A[H+V+2]=s.z,A[H+V+3]=0),g===!0&&(s.fromBufferAttribute(L,ne),A[H+V+4]=s.x,A[H+V+5]=s.y,A[H+V+6]=s.z,A[H+V+7]=0),y===!0&&(s.fromBufferAttribute(N,ne),A[H+V+8]=s.x,A[H+V+9]=s.y,A[H+V+10]=s.z,A[H+V+11]=N.itemSize===4?s.w:1)}}d={count:u,texture:C,size:new le(b,D)},n.set(a,d),a.addEventListener("dispose",z)}if(o.isInstancedMesh===!0&&o.morphTexture!==null)c.getUniforms().setValue(i,"morphTexture",o.morphTexture,t);else{let f=0;for(let y=0;y<l.length;y++)f+=l[y];let g=a.morphTargetsRelative?1:1-f;c.getUniforms().setValue(i,"morphTargetBaseInfluence",g),c.getUniforms().setValue(i,"morphTargetInfluences",l)}c.getUniforms().setValue(i,"morphTargetsTexture",d.texture,t),c.getUniforms().setValue(i,"morphTargetsTextureSize",d.size)}return{update:r}}function g_(i,e,t,n){let s=new WeakMap;function r(c){let l=n.render.frame,h=c.geometry,u=e.get(c,h);if(s.get(u)!==l&&(e.update(u),s.set(u,l)),c.isInstancedMesh&&(c.hasEventListener("dispose",a)===!1&&c.addEventListener("dispose",a),s.get(c)!==l&&(t.update(c.instanceMatrix,i.ARRAY_BUFFER),c.instanceColor!==null&&t.update(c.instanceColor,i.ARRAY_BUFFER),s.set(c,l))),c.isSkinnedMesh){let d=c.skeleton;s.get(d)!==l&&(d.update(),s.set(d,l))}return u}function o(){s=new WeakMap}function a(c){let l=c.target;l.removeEventListener("dispose",a),t.remove(l.instanceMatrix),l.instanceColor!==null&&t.remove(l.instanceColor)}return{update:r,dispose:o}}var Co=class extends nn{constructor(e,t,n,s,r,o,a,c,l,h=is){if(h!==is&&h!==hs)throw new Error("DepthTexture format must be either THREE.DepthFormat or THREE.DepthStencilFormat");n===void 0&&h===is&&(n=bi),n===void 0&&h===hs&&(n=ls),super(null,s,r,o,a,c,h,n,l),this.isDepthTexture=!0,this.image={width:e,height:t},this.magFilter=a!==void 0?a:an,this.minFilter=c!==void 0?c:an,this.flipY=!1,this.generateMipmaps=!1,this.compareFunction=null}copy(e){return super.copy(e),this.compareFunction=e.compareFunction,this}toJSON(e){let t=super.toJSON(e);return this.compareFunction!==null&&(t.compareFunction=this.compareFunction),t}},Xd=new nn,ju=new Co(1,1),qd=new xo,Yd=new el,$d=new To,Ku=[],Qu=[],ed=new Float32Array(16),td=new Float32Array(9),nd=new Float32Array(4);function _s(i,e,t){let n=i[0];if(n<=0||n>0)return i;let s=e*t,r=Ku[s];if(r===void 0&&(r=new Float32Array(s),Ku[s]=r),e!==0){n.toArray(r,0);for(let o=1,a=0;o!==e;++o)a+=t,i[o].toArray(r,a)}return r}function At(i,e){if(i.length!==e.length)return!1;for(let t=0,n=i.length;t<n;t++)if(i[t]!==e[t])return!1;return!0}function Ct(i,e){for(let t=0,n=e.length;t<n;t++)i[t]=e[t]}function $o(i,e){let t=Qu[e];t===void 0&&(t=new Int32Array(e),Qu[e]=t);for(let n=0;n!==e;++n)t[n]=i.allocateTextureUnit();return t}function __(i,e){let t=this.cache;t[0]!==e&&(i.uniform1f(this.addr,e),t[0]=e)}function y_(i,e){let t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y)&&(i.uniform2f(this.addr,e.x,e.y),t[0]=e.x,t[1]=e.y);else{if(At(t,e))return;i.uniform2fv(this.addr,e),Ct(t,e)}}function x_(i,e){let t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y||t[2]!==e.z)&&(i.uniform3f(this.addr,e.x,e.y,e.z),t[0]=e.x,t[1]=e.y,t[2]=e.z);else if(e.r!==void 0)(t[0]!==e.r||t[1]!==e.g||t[2]!==e.b)&&(i.uniform3f(this.addr,e.r,e.g,e.b),t[0]=e.r,t[1]=e.g,t[2]=e.b);else{if(At(t,e))return;i.uniform3fv(this.addr,e),Ct(t,e)}}function v_(i,e){let t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y||t[2]!==e.z||t[3]!==e.w)&&(i.uniform4f(this.addr,e.x,e.y,e.z,e.w),t[0]=e.x,t[1]=e.y,t[2]=e.z,t[3]=e.w);else{if(At(t,e))return;i.uniform4fv(this.addr,e),Ct(t,e)}}function b_(i,e){let t=this.cache,n=e.elements;if(n===void 0){if(At(t,e))return;i.uniformMatrix2fv(this.addr,!1,e),Ct(t,e)}else{if(At(t,n))return;nd.set(n),i.uniformMatrix2fv(this.addr,!1,nd),Ct(t,n)}}function M_(i,e){let t=this.cache,n=e.elements;if(n===void 0){if(At(t,e))return;i.uniformMatrix3fv(this.addr,!1,e),Ct(t,e)}else{if(At(t,n))return;td.set(n),i.uniformMatrix3fv(this.addr,!1,td),Ct(t,n)}}function S_(i,e){let t=this.cache,n=e.elements;if(n===void 0){if(At(t,e))return;i.uniformMatrix4fv(this.addr,!1,e),Ct(t,e)}else{if(At(t,n))return;ed.set(n),i.uniformMatrix4fv(this.addr,!1,ed),Ct(t,n)}}function E_(i,e){let t=this.cache;t[0]!==e&&(i.uniform1i(this.addr,e),t[0]=e)}function T_(i,e){let t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y)&&(i.uniform2i(this.addr,e.x,e.y),t[0]=e.x,t[1]=e.y);else{if(At(t,e))return;i.uniform2iv(this.addr,e),Ct(t,e)}}function w_(i,e){let t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y||t[2]!==e.z)&&(i.uniform3i(this.addr,e.x,e.y,e.z),t[0]=e.x,t[1]=e.y,t[2]=e.z);else{if(At(t,e))return;i.uniform3iv(this.addr,e),Ct(t,e)}}function A_(i,e){let t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y||t[2]!==e.z||t[3]!==e.w)&&(i.uniform4i(this.addr,e.x,e.y,e.z,e.w),t[0]=e.x,t[1]=e.y,t[2]=e.z,t[3]=e.w);else{if(At(t,e))return;i.uniform4iv(this.addr,e),Ct(t,e)}}function C_(i,e){let t=this.cache;t[0]!==e&&(i.uniform1ui(this.addr,e),t[0]=e)}function R_(i,e){let t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y)&&(i.uniform2ui(this.addr,e.x,e.y),t[0]=e.x,t[1]=e.y);else{if(At(t,e))return;i.uniform2uiv(this.addr,e),Ct(t,e)}}function P_(i,e){let t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y||t[2]!==e.z)&&(i.uniform3ui(this.addr,e.x,e.y,e.z),t[0]=e.x,t[1]=e.y,t[2]=e.z);else{if(At(t,e))return;i.uniform3uiv(this.addr,e),Ct(t,e)}}function I_(i,e){let t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y||t[2]!==e.z||t[3]!==e.w)&&(i.uniform4ui(this.addr,e.x,e.y,e.z,e.w),t[0]=e.x,t[1]=e.y,t[2]=e.z,t[3]=e.w);else{if(At(t,e))return;i.uniform4uiv(this.addr,e),Ct(t,e)}}function L_(i,e,t){let n=this.cache,s=t.allocateTextureUnit();n[0]!==s&&(i.uniform1i(this.addr,s),n[0]=s);let r;this.type===i.SAMPLER_2D_SHADOW?(ju.compareFunction=zd,r=ju):r=Xd,t.setTexture2D(e||r,s)}function D_(i,e,t){let n=this.cache,s=t.allocateTextureUnit();n[0]!==s&&(i.uniform1i(this.addr,s),n[0]=s),t.setTexture3D(e||Yd,s)}function U_(i,e,t){let n=this.cache,s=t.allocateTextureUnit();n[0]!==s&&(i.uniform1i(this.addr,s),n[0]=s),t.setTextureCube(e||$d,s)}function N_(i,e,t){let n=this.cache,s=t.allocateTextureUnit();n[0]!==s&&(i.uniform1i(this.addr,s),n[0]=s),t.setTexture2DArray(e||qd,s)}function k_(i){switch(i){case 5126:return __;case 35664:return y_;case 35665:return x_;case 35666:return v_;case 35674:return b_;case 35675:return M_;case 35676:return S_;case 5124:case 35670:return E_;case 35667:case 35671:return T_;case 35668:case 35672:return w_;case 35669:case 35673:return A_;case 5125:return C_;case 36294:return R_;case 36295:return P_;case 36296:return I_;case 35678:case 36198:case 36298:case 36306:case 35682:return L_;case 35679:case 36299:case 36307:return D_;case 35680:case 36300:case 36308:case 36293:return U_;case 36289:case 36303:case 36311:case 36292:return N_}}function O_(i,e){i.uniform1fv(this.addr,e)}function F_(i,e){let t=_s(e,this.size,2);i.uniform2fv(this.addr,t)}function B_(i,e){let t=_s(e,this.size,3);i.uniform3fv(this.addr,t)}function z_(i,e){let t=_s(e,this.size,4);i.uniform4fv(this.addr,t)}function H_(i,e){let t=_s(e,this.size,4);i.uniformMatrix2fv(this.addr,!1,t)}function V_(i,e){let t=_s(e,this.size,9);i.uniformMatrix3fv(this.addr,!1,t)}function G_(i,e){let t=_s(e,this.size,16);i.uniformMatrix4fv(this.addr,!1,t)}function W_(i,e){i.uniform1iv(this.addr,e)}function X_(i,e){i.uniform2iv(this.addr,e)}function q_(i,e){i.uniform3iv(this.addr,e)}function Y_(i,e){i.uniform4iv(this.addr,e)}function $_(i,e){i.uniform1uiv(this.addr,e)}function J_(i,e){i.uniform2uiv(this.addr,e)}function Z_(i,e){i.uniform3uiv(this.addr,e)}function j_(i,e){i.uniform4uiv(this.addr,e)}function K_(i,e,t){let n=this.cache,s=e.length,r=$o(t,s);At(n,r)||(i.uniform1iv(this.addr,r),Ct(n,r));for(let o=0;o!==s;++o)t.setTexture2D(e[o]||Xd,r[o])}function Q_(i,e,t){let n=this.cache,s=e.length,r=$o(t,s);At(n,r)||(i.uniform1iv(this.addr,r),Ct(n,r));for(let o=0;o!==s;++o)t.setTexture3D(e[o]||Yd,r[o])}function ey(i,e,t){let n=this.cache,s=e.length,r=$o(t,s);At(n,r)||(i.uniform1iv(this.addr,r),Ct(n,r));for(let o=0;o!==s;++o)t.setTextureCube(e[o]||$d,r[o])}function ty(i,e,t){let n=this.cache,s=e.length,r=$o(t,s);At(n,r)||(i.uniform1iv(this.addr,r),Ct(n,r));for(let o=0;o!==s;++o)t.setTexture2DArray(e[o]||qd,r[o])}function ny(i){switch(i){case 5126:return O_;case 35664:return F_;case 35665:return B_;case 35666:return z_;case 35674:return H_;case 35675:return V_;case 35676:return G_;case 5124:case 35670:return W_;case 35667:case 35671:return X_;case 35668:case 35672:return q_;case 35669:case 35673:return Y_;case 5125:return $_;case 36294:return J_;case 36295:return Z_;case 36296:return j_;case 35678:case 36198:case 36298:case 36306:case 35682:return K_;case 35679:case 36299:case 36307:return Q_;case 35680:case 36300:case 36308:case 36293:return ey;case 36289:case 36303:case 36311:case 36292:return ty}}var il=class{constructor(e,t,n){this.id=e,this.addr=n,this.cache=[],this.type=t.type,this.setValue=k_(t.type)}},sl=class{constructor(e,t,n){this.id=e,this.addr=n,this.cache=[],this.type=t.type,this.size=t.size,this.setValue=ny(t.type)}},rl=class{constructor(e){this.id=e,this.seq=[],this.map={}}setValue(e,t,n){let s=this.seq;for(let r=0,o=s.length;r!==o;++r){let a=s[r];a.setValue(e,t[a.id],n)}}},sc=/(\w+)(\])?(\[|\.)?/g;function id(i,e){i.seq.push(e),i.map[e.id]=e}function iy(i,e,t){let n=i.name,s=n.length;for(sc.lastIndex=0;;){let r=sc.exec(n),o=sc.lastIndex,a=r[1],c=r[2]==="]",l=r[3];if(c&&(a=a|0),l===void 0||l==="["&&o+2===s){id(t,l===void 0?new il(a,i,e):new sl(a,i,e));break}else{let u=t.map[a];u===void 0&&(u=new rl(a),id(t,u)),t=u}}}var rs=class{constructor(e,t){this.seq=[],this.map={};let n=e.getProgramParameter(t,e.ACTIVE_UNIFORMS);for(let s=0;s<n;++s){let r=e.getActiveUniform(t,s),o=e.getUniformLocation(t,r.name);iy(r,o,this)}}setValue(e,t,n,s){let r=this.map[t];r!==void 0&&r.setValue(e,n,s)}setOptional(e,t,n){let s=t[n];s!==void 0&&this.setValue(e,n,s)}static upload(e,t,n,s){for(let r=0,o=t.length;r!==o;++r){let a=t[r],c=n[a.id];c.needsUpdate!==!1&&a.setValue(e,c.value,s)}}static seqWithValue(e,t){let n=[];for(let s=0,r=e.length;s!==r;++s){let o=e[s];o.id in t&&n.push(o)}return n}};function sd(i,e,t){let n=i.createShader(e);return i.shaderSource(n,t),i.compileShader(n),n}var sy=37297,ry=0;function oy(i,e){let t=i.split(`
`),n=[],s=Math.max(e-6,0),r=Math.min(e+6,t.length);for(let o=s;o<r;o++){let a=o+1;n.push(`${a===e?">":" "} ${a}: ${t[o]}`)}return n.join(`
`)}function ay(i){let e=ct.getPrimaries(ct.workingColorSpace),t=ct.getPrimaries(i),n;switch(e===t?n="":e===mo&&t===po?n="LinearDisplayP3ToLinearSRGB":e===po&&t===mo&&(n="LinearSRGBToLinearDisplayP3"),i){case ri:case Yo:return[n,"LinearTransferOETF"];case Xt:case Yl:return[n,"sRGBTransferOETF"];default:return console.warn("THREE.WebGLProgram: Unsupported color space:",i),[n,"LinearTransferOETF"]}}function rd(i,e,t){let n=i.getShaderParameter(e,i.COMPILE_STATUS),s=i.getShaderInfoLog(e).trim();if(n&&s==="")return"";let r=/ERROR: 0:(\d+)/.exec(s);if(r){let o=parseInt(r[1]);return t.toUpperCase()+`

`+s+`

`+oy(i.getShaderSource(e),o)}else return s}function cy(i,e){let t=ay(e);return`vec4 ${i}( vec4 value ) { return ${t[0]}( ${t[1]}( value ) ); }`}function ly(i,e){let t;switch(e){case vp:t="Linear";break;case bp:t="Reinhard";break;case Mp:t="Cineon";break;case zl:t="ACESFilmic";break;case Ep:t="AgX";break;case Tp:t="Neutral";break;case Sp:t="Custom";break;default:console.warn("THREE.WebGLProgram: Unsupported toneMapping:",e),t="Linear"}return"vec3 "+i+"( vec3 color ) { return "+t+"ToneMapping( color ); }"}var Jr=new R;function hy(){ct.getLuminanceCoefficients(Jr);let i=Jr.x.toFixed(4),e=Jr.y.toFixed(4),t=Jr.z.toFixed(4);return["float luminance( const in vec3 rgb ) {",`	const vec3 weights = vec3( ${i}, ${e}, ${t} );`,"	return dot( weights, rgb );","}"].join(`
`)}function uy(i){return[i.extensionClipCullDistance?"#extension GL_ANGLE_clip_cull_distance : require":"",i.extensionMultiDraw?"#extension GL_ANGLE_multi_draw : require":""].filter(Bs).join(`
`)}function dy(i){let e=[];for(let t in i){let n=i[t];n!==!1&&e.push("#define "+t+" "+n)}return e.join(`
`)}function fy(i,e){let t={},n=i.getProgramParameter(e,i.ACTIVE_ATTRIBUTES);for(let s=0;s<n;s++){let r=i.getActiveAttrib(e,s),o=r.name,a=1;r.type===i.FLOAT_MAT2&&(a=2),r.type===i.FLOAT_MAT3&&(a=3),r.type===i.FLOAT_MAT4&&(a=4),t[o]={type:r.type,location:i.getAttribLocation(e,o),locationSize:a}}return t}function Bs(i){return i!==""}function od(i,e){let t=e.numSpotLightShadows+e.numSpotLightMaps-e.numSpotLightShadowsWithMaps;return i.replace(/NUM_DIR_LIGHTS/g,e.numDirLights).replace(/NUM_SPOT_LIGHTS/g,e.numSpotLights).replace(/NUM_SPOT_LIGHT_MAPS/g,e.numSpotLightMaps).replace(/NUM_SPOT_LIGHT_COORDS/g,t).replace(/NUM_RECT_AREA_LIGHTS/g,e.numRectAreaLights).replace(/NUM_POINT_LIGHTS/g,e.numPointLights).replace(/NUM_HEMI_LIGHTS/g,e.numHemiLights).replace(/NUM_DIR_LIGHT_SHADOWS/g,e.numDirLightShadows).replace(/NUM_SPOT_LIGHT_SHADOWS_WITH_MAPS/g,e.numSpotLightShadowsWithMaps).replace(/NUM_SPOT_LIGHT_SHADOWS/g,e.numSpotLightShadows).replace(/NUM_POINT_LIGHT_SHADOWS/g,e.numPointLightShadows)}function ad(i,e){return i.replace(/NUM_CLIPPING_PLANES/g,e.numClippingPlanes).replace(/UNION_CLIPPING_PLANES/g,e.numClippingPlanes-e.numClipIntersection)}var py=/^[ \t]*#include +<([\w\d./]+)>/gm;function ol(i){return i.replace(py,gy)}var my=new Map;function gy(i,e){let t=Ze[e];if(t===void 0){let n=my.get(e);if(n!==void 0)t=Ze[n],console.warn('THREE.WebGLRenderer: Shader chunk "%s" has been deprecated. Use "%s" instead.',e,n);else throw new Error("Can not resolve #include <"+e+">")}return ol(t)}var _y=/#pragma unroll_loop_start\s+for\s*\(\s*int\s+i\s*=\s*(\d+)\s*;\s*i\s*<\s*(\d+)\s*;\s*i\s*\+\+\s*\)\s*{([\s\S]+?)}\s+#pragma unroll_loop_end/g;function cd(i){return i.replace(_y,yy)}function yy(i,e,t,n){let s="";for(let r=parseInt(e);r<parseInt(t);r++)s+=n.replace(/\[\s*i\s*\]/g,"[ "+r+" ]").replace(/UNROLLED_LOOP_INDEX/g,r);return s}function ld(i){let e=`precision ${i.precision} float;
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
#define LOW_PRECISION`),e}function xy(i){let e="SHADOWMAP_TYPE_BASIC";return i.shadowMapType===wd?e="SHADOWMAP_TYPE_PCF":i.shadowMapType===Bl?e="SHADOWMAP_TYPE_PCF_SOFT":i.shadowMapType===kn&&(e="SHADOWMAP_TYPE_VSM"),e}function vy(i){let e="ENVMAP_TYPE_CUBE";if(i.envMap)switch(i.envMapMode){case as:case cs:e="ENVMAP_TYPE_CUBE";break;case qo:e="ENVMAP_TYPE_CUBE_UV";break}return e}function by(i){let e="ENVMAP_MODE_REFLECTION";if(i.envMap)switch(i.envMapMode){case cs:e="ENVMAP_MODE_REFRACTION";break}return e}function My(i){let e="ENVMAP_BLENDING_NONE";if(i.envMap)switch(i.combine){case Ad:e="ENVMAP_BLENDING_MULTIPLY";break;case yp:e="ENVMAP_BLENDING_MIX";break;case xp:e="ENVMAP_BLENDING_ADD";break}return e}function Sy(i){let e=i.envMapCubeUVHeight;if(e===null)return null;let t=Math.log2(e)-2,n=1/e;return{texelWidth:1/(3*Math.max(Math.pow(2,t),7*16)),texelHeight:n,maxMip:t}}function Ey(i,e,t,n){let s=i.getContext(),r=t.defines,o=t.vertexShader,a=t.fragmentShader,c=xy(t),l=vy(t),h=by(t),u=My(t),d=Sy(t),f=uy(t),g=dy(r),y=s.createProgram(),m,p,M=t.glslVersion?"#version "+t.glslVersion+`
`:"";t.isRawShaderMaterial?(m=["#define SHADER_TYPE "+t.shaderType,"#define SHADER_NAME "+t.shaderName,g].filter(Bs).join(`
`),m.length>0&&(m+=`
`),p=["#define SHADER_TYPE "+t.shaderType,"#define SHADER_NAME "+t.shaderName,g].filter(Bs).join(`
`),p.length>0&&(p+=`
`)):(m=[ld(t),"#define SHADER_TYPE "+t.shaderType,"#define SHADER_NAME "+t.shaderName,g,t.extensionClipCullDistance?"#define USE_CLIP_DISTANCE":"",t.batching?"#define USE_BATCHING":"",t.batchingColor?"#define USE_BATCHING_COLOR":"",t.instancing?"#define USE_INSTANCING":"",t.instancingColor?"#define USE_INSTANCING_COLOR":"",t.instancingMorph?"#define USE_INSTANCING_MORPH":"",t.useFog&&t.fog?"#define USE_FOG":"",t.useFog&&t.fogExp2?"#define FOG_EXP2":"",t.map?"#define USE_MAP":"",t.envMap?"#define USE_ENVMAP":"",t.envMap?"#define "+h:"",t.lightMap?"#define USE_LIGHTMAP":"",t.aoMap?"#define USE_AOMAP":"",t.bumpMap?"#define USE_BUMPMAP":"",t.normalMap?"#define USE_NORMALMAP":"",t.normalMapObjectSpace?"#define USE_NORMALMAP_OBJECTSPACE":"",t.normalMapTangentSpace?"#define USE_NORMALMAP_TANGENTSPACE":"",t.displacementMap?"#define USE_DISPLACEMENTMAP":"",t.emissiveMap?"#define USE_EMISSIVEMAP":"",t.anisotropy?"#define USE_ANISOTROPY":"",t.anisotropyMap?"#define USE_ANISOTROPYMAP":"",t.clearcoatMap?"#define USE_CLEARCOATMAP":"",t.clearcoatRoughnessMap?"#define USE_CLEARCOAT_ROUGHNESSMAP":"",t.clearcoatNormalMap?"#define USE_CLEARCOAT_NORMALMAP":"",t.iridescenceMap?"#define USE_IRIDESCENCEMAP":"",t.iridescenceThicknessMap?"#define USE_IRIDESCENCE_THICKNESSMAP":"",t.specularMap?"#define USE_SPECULARMAP":"",t.specularColorMap?"#define USE_SPECULAR_COLORMAP":"",t.specularIntensityMap?"#define USE_SPECULAR_INTENSITYMAP":"",t.roughnessMap?"#define USE_ROUGHNESSMAP":"",t.metalnessMap?"#define USE_METALNESSMAP":"",t.alphaMap?"#define USE_ALPHAMAP":"",t.alphaHash?"#define USE_ALPHAHASH":"",t.transmission?"#define USE_TRANSMISSION":"",t.transmissionMap?"#define USE_TRANSMISSIONMAP":"",t.thicknessMap?"#define USE_THICKNESSMAP":"",t.sheenColorMap?"#define USE_SHEEN_COLORMAP":"",t.sheenRoughnessMap?"#define USE_SHEEN_ROUGHNESSMAP":"",t.mapUv?"#define MAP_UV "+t.mapUv:"",t.alphaMapUv?"#define ALPHAMAP_UV "+t.alphaMapUv:"",t.lightMapUv?"#define LIGHTMAP_UV "+t.lightMapUv:"",t.aoMapUv?"#define AOMAP_UV "+t.aoMapUv:"",t.emissiveMapUv?"#define EMISSIVEMAP_UV "+t.emissiveMapUv:"",t.bumpMapUv?"#define BUMPMAP_UV "+t.bumpMapUv:"",t.normalMapUv?"#define NORMALMAP_UV "+t.normalMapUv:"",t.displacementMapUv?"#define DISPLACEMENTMAP_UV "+t.displacementMapUv:"",t.metalnessMapUv?"#define METALNESSMAP_UV "+t.metalnessMapUv:"",t.roughnessMapUv?"#define ROUGHNESSMAP_UV "+t.roughnessMapUv:"",t.anisotropyMapUv?"#define ANISOTROPYMAP_UV "+t.anisotropyMapUv:"",t.clearcoatMapUv?"#define CLEARCOATMAP_UV "+t.clearcoatMapUv:"",t.clearcoatNormalMapUv?"#define CLEARCOAT_NORMALMAP_UV "+t.clearcoatNormalMapUv:"",t.clearcoatRoughnessMapUv?"#define CLEARCOAT_ROUGHNESSMAP_UV "+t.clearcoatRoughnessMapUv:"",t.iridescenceMapUv?"#define IRIDESCENCEMAP_UV "+t.iridescenceMapUv:"",t.iridescenceThicknessMapUv?"#define IRIDESCENCE_THICKNESSMAP_UV "+t.iridescenceThicknessMapUv:"",t.sheenColorMapUv?"#define SHEEN_COLORMAP_UV "+t.sheenColorMapUv:"",t.sheenRoughnessMapUv?"#define SHEEN_ROUGHNESSMAP_UV "+t.sheenRoughnessMapUv:"",t.specularMapUv?"#define SPECULARMAP_UV "+t.specularMapUv:"",t.specularColorMapUv?"#define SPECULAR_COLORMAP_UV "+t.specularColorMapUv:"",t.specularIntensityMapUv?"#define SPECULAR_INTENSITYMAP_UV "+t.specularIntensityMapUv:"",t.transmissionMapUv?"#define TRANSMISSIONMAP_UV "+t.transmissionMapUv:"",t.thicknessMapUv?"#define THICKNESSMAP_UV "+t.thicknessMapUv:"",t.vertexTangents&&t.flatShading===!1?"#define USE_TANGENT":"",t.vertexColors?"#define USE_COLOR":"",t.vertexAlphas?"#define USE_COLOR_ALPHA":"",t.vertexUv1s?"#define USE_UV1":"",t.vertexUv2s?"#define USE_UV2":"",t.vertexUv3s?"#define USE_UV3":"",t.pointsUvs?"#define USE_POINTS_UV":"",t.flatShading?"#define FLAT_SHADED":"",t.skinning?"#define USE_SKINNING":"",t.morphTargets?"#define USE_MORPHTARGETS":"",t.morphNormals&&t.flatShading===!1?"#define USE_MORPHNORMALS":"",t.morphColors?"#define USE_MORPHCOLORS":"",t.morphTargetsCount>0?"#define MORPHTARGETS_TEXTURE_STRIDE "+t.morphTextureStride:"",t.morphTargetsCount>0?"#define MORPHTARGETS_COUNT "+t.morphTargetsCount:"",t.doubleSided?"#define DOUBLE_SIDED":"",t.flipSided?"#define FLIP_SIDED":"",t.shadowMapEnabled?"#define USE_SHADOWMAP":"",t.shadowMapEnabled?"#define "+c:"",t.sizeAttenuation?"#define USE_SIZEATTENUATION":"",t.numLightProbes>0?"#define USE_LIGHT_PROBES":"",t.logarithmicDepthBuffer?"#define USE_LOGDEPTHBUF":"",t.reverseDepthBuffer?"#define USE_REVERSEDEPTHBUF":"","uniform mat4 modelMatrix;","uniform mat4 modelViewMatrix;","uniform mat4 projectionMatrix;","uniform mat4 viewMatrix;","uniform mat3 normalMatrix;","uniform vec3 cameraPosition;","uniform bool isOrthographic;","#ifdef USE_INSTANCING","	attribute mat4 instanceMatrix;","#endif","#ifdef USE_INSTANCING_COLOR","	attribute vec3 instanceColor;","#endif","#ifdef USE_INSTANCING_MORPH","	uniform sampler2D morphTexture;","#endif","attribute vec3 position;","attribute vec3 normal;","attribute vec2 uv;","#ifdef USE_UV1","	attribute vec2 uv1;","#endif","#ifdef USE_UV2","	attribute vec2 uv2;","#endif","#ifdef USE_UV3","	attribute vec2 uv3;","#endif","#ifdef USE_TANGENT","	attribute vec4 tangent;","#endif","#if defined( USE_COLOR_ALPHA )","	attribute vec4 color;","#elif defined( USE_COLOR )","	attribute vec3 color;","#endif","#ifdef USE_SKINNING","	attribute vec4 skinIndex;","	attribute vec4 skinWeight;","#endif",`
`].filter(Bs).join(`
`),p=[ld(t),"#define SHADER_TYPE "+t.shaderType,"#define SHADER_NAME "+t.shaderName,g,t.useFog&&t.fog?"#define USE_FOG":"",t.useFog&&t.fogExp2?"#define FOG_EXP2":"",t.alphaToCoverage?"#define ALPHA_TO_COVERAGE":"",t.map?"#define USE_MAP":"",t.matcap?"#define USE_MATCAP":"",t.envMap?"#define USE_ENVMAP":"",t.envMap?"#define "+l:"",t.envMap?"#define "+h:"",t.envMap?"#define "+u:"",d?"#define CUBEUV_TEXEL_WIDTH "+d.texelWidth:"",d?"#define CUBEUV_TEXEL_HEIGHT "+d.texelHeight:"",d?"#define CUBEUV_MAX_MIP "+d.maxMip+".0":"",t.lightMap?"#define USE_LIGHTMAP":"",t.aoMap?"#define USE_AOMAP":"",t.bumpMap?"#define USE_BUMPMAP":"",t.normalMap?"#define USE_NORMALMAP":"",t.normalMapObjectSpace?"#define USE_NORMALMAP_OBJECTSPACE":"",t.normalMapTangentSpace?"#define USE_NORMALMAP_TANGENTSPACE":"",t.emissiveMap?"#define USE_EMISSIVEMAP":"",t.anisotropy?"#define USE_ANISOTROPY":"",t.anisotropyMap?"#define USE_ANISOTROPYMAP":"",t.clearcoat?"#define USE_CLEARCOAT":"",t.clearcoatMap?"#define USE_CLEARCOATMAP":"",t.clearcoatRoughnessMap?"#define USE_CLEARCOAT_ROUGHNESSMAP":"",t.clearcoatNormalMap?"#define USE_CLEARCOAT_NORMALMAP":"",t.dispersion?"#define USE_DISPERSION":"",t.iridescence?"#define USE_IRIDESCENCE":"",t.iridescenceMap?"#define USE_IRIDESCENCEMAP":"",t.iridescenceThicknessMap?"#define USE_IRIDESCENCE_THICKNESSMAP":"",t.specularMap?"#define USE_SPECULARMAP":"",t.specularColorMap?"#define USE_SPECULAR_COLORMAP":"",t.specularIntensityMap?"#define USE_SPECULAR_INTENSITYMAP":"",t.roughnessMap?"#define USE_ROUGHNESSMAP":"",t.metalnessMap?"#define USE_METALNESSMAP":"",t.alphaMap?"#define USE_ALPHAMAP":"",t.alphaTest?"#define USE_ALPHATEST":"",t.alphaHash?"#define USE_ALPHAHASH":"",t.sheen?"#define USE_SHEEN":"",t.sheenColorMap?"#define USE_SHEEN_COLORMAP":"",t.sheenRoughnessMap?"#define USE_SHEEN_ROUGHNESSMAP":"",t.transmission?"#define USE_TRANSMISSION":"",t.transmissionMap?"#define USE_TRANSMISSIONMAP":"",t.thicknessMap?"#define USE_THICKNESSMAP":"",t.vertexTangents&&t.flatShading===!1?"#define USE_TANGENT":"",t.vertexColors||t.instancingColor||t.batchingColor?"#define USE_COLOR":"",t.vertexAlphas?"#define USE_COLOR_ALPHA":"",t.vertexUv1s?"#define USE_UV1":"",t.vertexUv2s?"#define USE_UV2":"",t.vertexUv3s?"#define USE_UV3":"",t.pointsUvs?"#define USE_POINTS_UV":"",t.gradientMap?"#define USE_GRADIENTMAP":"",t.flatShading?"#define FLAT_SHADED":"",t.doubleSided?"#define DOUBLE_SIDED":"",t.flipSided?"#define FLIP_SIDED":"",t.shadowMapEnabled?"#define USE_SHADOWMAP":"",t.shadowMapEnabled?"#define "+c:"",t.premultipliedAlpha?"#define PREMULTIPLIED_ALPHA":"",t.numLightProbes>0?"#define USE_LIGHT_PROBES":"",t.decodeVideoTexture?"#define DECODE_VIDEO_TEXTURE":"",t.logarithmicDepthBuffer?"#define USE_LOGDEPTHBUF":"",t.reverseDepthBuffer?"#define USE_REVERSEDEPTHBUF":"","uniform mat4 viewMatrix;","uniform vec3 cameraPosition;","uniform bool isOrthographic;",t.toneMapping!==ni?"#define TONE_MAPPING":"",t.toneMapping!==ni?Ze.tonemapping_pars_fragment:"",t.toneMapping!==ni?ly("toneMapping",t.toneMapping):"",t.dithering?"#define DITHERING":"",t.opaque?"#define OPAQUE":"",Ze.colorspace_pars_fragment,cy("linearToOutputTexel",t.outputColorSpace),hy(),t.useDepthPacking?"#define DEPTH_PACKING "+t.depthPacking:"",`
`].filter(Bs).join(`
`)),o=ol(o),o=od(o,t),o=ad(o,t),a=ol(a),a=od(a,t),a=ad(a,t),o=cd(o),a=cd(a),t.isRawShaderMaterial!==!0&&(M=`#version 300 es
`,m=[f,"#define attribute in","#define varying out","#define texture2D texture"].join(`
`)+`
`+m,p=["#define varying in",t.glslVersion===wu?"":"layout(location = 0) out highp vec4 pc_fragColor;",t.glslVersion===wu?"":"#define gl_FragColor pc_fragColor","#define gl_FragDepthEXT gl_FragDepth","#define texture2D texture","#define textureCube texture","#define texture2DProj textureProj","#define texture2DLodEXT textureLod","#define texture2DProjLodEXT textureProjLod","#define textureCubeLodEXT textureLod","#define texture2DGradEXT textureGrad","#define texture2DProjGradEXT textureProjGrad","#define textureCubeGradEXT textureGrad"].join(`
`)+`
`+p);let x=M+m+o,b=M+p+a,D=sd(s,s.VERTEX_SHADER,x),A=sd(s,s.FRAGMENT_SHADER,b);s.attachShader(y,D),s.attachShader(y,A),t.index0AttributeName!==void 0?s.bindAttribLocation(y,0,t.index0AttributeName):t.morphTargets===!0&&s.bindAttribLocation(y,0,"position"),s.linkProgram(y);function C(S){if(i.debug.checkShaderErrors){let L=s.getProgramInfoLog(y).trim(),N=s.getShaderInfoLog(D).trim(),H=s.getShaderInfoLog(A).trim(),ne=!0,V=!0;if(s.getProgramParameter(y,s.LINK_STATUS)===!1)if(ne=!1,typeof i.debug.onShaderError=="function")i.debug.onShaderError(s,y,D,A);else{let se=rd(s,D,"vertex"),q=rd(s,A,"fragment");console.error("THREE.WebGLProgram: Shader Error "+s.getError()+" - VALIDATE_STATUS "+s.getProgramParameter(y,s.VALIDATE_STATUS)+`

Material Name: `+S.name+`
Material Type: `+S.type+`

Program Info Log: `+L+`
`+se+`
`+q)}else L!==""?console.warn("THREE.WebGLProgram: Program Info Log:",L):(N===""||H==="")&&(V=!1);V&&(S.diagnostics={runnable:ne,programLog:L,vertexShader:{log:N,prefix:m},fragmentShader:{log:H,prefix:p}})}s.deleteShader(D),s.deleteShader(A),P=new rs(s,y),z=fy(s,y)}let P;this.getUniforms=function(){return P===void 0&&C(this),P};let z;this.getAttributes=function(){return z===void 0&&C(this),z};let _=t.rendererExtensionParallelShaderCompile===!1;return this.isReady=function(){return _===!1&&(_=s.getProgramParameter(y,sy)),_},this.destroy=function(){n.releaseStatesOfProgram(this),s.deleteProgram(y),this.program=void 0},this.type=t.shaderType,this.name=t.shaderName,this.id=ry++,this.cacheKey=e,this.usedTimes=1,this.program=y,this.vertexShader=D,this.fragmentShader=A,this}var Ty=0,al=class{constructor(){this.shaderCache=new Map,this.materialCache=new Map}update(e){let t=e.vertexShader,n=e.fragmentShader,s=this._getShaderStage(t),r=this._getShaderStage(n),o=this._getShaderCacheForMaterial(e);return o.has(s)===!1&&(o.add(s),s.usedTimes++),o.has(r)===!1&&(o.add(r),r.usedTimes++),this}remove(e){let t=this.materialCache.get(e);for(let n of t)n.usedTimes--,n.usedTimes===0&&this.shaderCache.delete(n.code);return this.materialCache.delete(e),this}getVertexShaderID(e){return this._getShaderStage(e.vertexShader).id}getFragmentShaderID(e){return this._getShaderStage(e.fragmentShader).id}dispose(){this.shaderCache.clear(),this.materialCache.clear()}_getShaderCacheForMaterial(e){let t=this.materialCache,n=t.get(e);return n===void 0&&(n=new Set,t.set(e,n)),n}_getShaderStage(e){let t=this.shaderCache,n=t.get(e);return n===void 0&&(n=new cl(e),t.set(e,n)),n}},cl=class{constructor(e){this.id=Ty++,this.code=e,this.usedTimes=0}};function wy(i,e,t,n,s,r,o){let a=new bo,c=new al,l=new Set,h=[],u=s.logarithmicDepthBuffer,d=s.reverseDepthBuffer,f=s.vertexTextures,g=s.precision,y={MeshDepthMaterial:"depth",MeshDistanceMaterial:"distanceRGBA",MeshNormalMaterial:"normal",MeshBasicMaterial:"basic",MeshLambertMaterial:"lambert",MeshPhongMaterial:"phong",MeshToonMaterial:"toon",MeshStandardMaterial:"physical",MeshPhysicalMaterial:"physical",MeshMatcapMaterial:"matcap",LineBasicMaterial:"basic",LineDashedMaterial:"dashed",PointsMaterial:"points",ShadowMaterial:"shadow",SpriteMaterial:"sprite"};function m(_){return l.add(_),_===0?"uv":`uv${_}`}function p(_,S,L,N,H){let ne=N.fog,V=H.geometry,se=_.isMeshStandardMaterial?N.environment:null,q=(_.isMeshStandardMaterial?t:e).get(_.envMap||se),ve=q&&q.mapping===qo?q.image.height:null,be=y[_.type];_.precision!==null&&(g=s.getMaxPrecision(_.precision),g!==_.precision&&console.warn("THREE.WebGLProgram.getParameters:",_.precision,"not supported, using",g,"instead."));let Me=V.morphAttributes.position||V.morphAttributes.normal||V.morphAttributes.color,Ke=Me!==void 0?Me.length:0,nt=0;V.morphAttributes.position!==void 0&&(nt=1),V.morphAttributes.normal!==void 0&&(nt=2),V.morphAttributes.color!==void 0&&(nt=3);let J,ae,we,X;if(be){let Jt=bn[be];J=Jt.vertexShader,ae=Jt.fragmentShader}else J=_.vertexShader,ae=_.fragmentShader,c.update(_),we=c.getVertexShaderID(_),X=c.getFragmentShaderID(_);let xe=i.getRenderTarget(),Oe=H.isInstancedMesh===!0,Ne=H.isBatchedMesh===!0,$e=!!_.map,ee=!!_.matcap,w=!!q,pe=!!_.aoMap,fe=!!_.lightMap,ce=!!_.bumpMap,me=!!_.normalMap,De=!!_.displacementMap,Se=!!_.emissiveMap,T=!!_.metalnessMap,v=!!_.roughnessMap,F=_.anisotropy>0,j=_.clearcoat>0,Q=_.dispersion>0,Z=_.iridescence>0,Ie=_.sheen>0,I=_.transmission>0,B=F&&!!_.anisotropyMap,K=j&&!!_.clearcoatMap,$=j&&!!_.clearcoatNormalMap,he=j&&!!_.clearcoatRoughnessMap,Be=Z&&!!_.iridescenceMap,He=Z&&!!_.iridescenceThicknessMap,ge=Ie&&!!_.sheenColorMap,Je=Ie&&!!_.sheenRoughnessMap,Ve=!!_.specularMap,it=!!_.specularColorMap,U=!!_.specularIntensityMap,Ae=I&&!!_.transmissionMap,Y=I&&!!_.thicknessMap,ie=!!_.gradientMap,Ee=!!_.alphaMap,Ce=_.alphaTest>0,st=!!_.alphaHash,Tt=!!_.extensions,$t=ni;_.toneMapped&&(xe===null||xe.isXRRenderTarget===!0)&&($t=i.toneMapping);let rt={shaderID:be,shaderType:_.type,shaderName:_.name,vertexShader:J,fragmentShader:ae,defines:_.defines,customVertexShaderID:we,customFragmentShaderID:X,isRawShaderMaterial:_.isRawShaderMaterial===!0,glslVersion:_.glslVersion,precision:g,batching:Ne,batchingColor:Ne&&H._colorsTexture!==null,instancing:Oe,instancingColor:Oe&&H.instanceColor!==null,instancingMorph:Oe&&H.morphTexture!==null,supportsVertexTextures:f,outputColorSpace:xe===null?i.outputColorSpace:xe.isXRRenderTarget===!0?xe.texture.colorSpace:ri,alphaToCoverage:!!_.alphaToCoverage,map:$e,matcap:ee,envMap:w,envMapMode:w&&q.mapping,envMapCubeUVHeight:ve,aoMap:pe,lightMap:fe,bumpMap:ce,normalMap:me,displacementMap:f&&De,emissiveMap:Se,normalMapObjectSpace:me&&_.normalMapType===Rp,normalMapTangentSpace:me&&_.normalMapType===Bd,metalnessMap:T,roughnessMap:v,anisotropy:F,anisotropyMap:B,clearcoat:j,clearcoatMap:K,clearcoatNormalMap:$,clearcoatRoughnessMap:he,dispersion:Q,iridescence:Z,iridescenceMap:Be,iridescenceThicknessMap:He,sheen:Ie,sheenColorMap:ge,sheenRoughnessMap:Je,specularMap:Ve,specularColorMap:it,specularIntensityMap:U,transmission:I,transmissionMap:Ae,thicknessMap:Y,gradientMap:ie,opaque:_.transparent===!1&&_.blending===ns&&_.alphaToCoverage===!1,alphaMap:Ee,alphaTest:Ce,alphaHash:st,combine:_.combine,mapUv:$e&&m(_.map.channel),aoMapUv:pe&&m(_.aoMap.channel),lightMapUv:fe&&m(_.lightMap.channel),bumpMapUv:ce&&m(_.bumpMap.channel),normalMapUv:me&&m(_.normalMap.channel),displacementMapUv:De&&m(_.displacementMap.channel),emissiveMapUv:Se&&m(_.emissiveMap.channel),metalnessMapUv:T&&m(_.metalnessMap.channel),roughnessMapUv:v&&m(_.roughnessMap.channel),anisotropyMapUv:B&&m(_.anisotropyMap.channel),clearcoatMapUv:K&&m(_.clearcoatMap.channel),clearcoatNormalMapUv:$&&m(_.clearcoatNormalMap.channel),clearcoatRoughnessMapUv:he&&m(_.clearcoatRoughnessMap.channel),iridescenceMapUv:Be&&m(_.iridescenceMap.channel),iridescenceThicknessMapUv:He&&m(_.iridescenceThicknessMap.channel),sheenColorMapUv:ge&&m(_.sheenColorMap.channel),sheenRoughnessMapUv:Je&&m(_.sheenRoughnessMap.channel),specularMapUv:Ve&&m(_.specularMap.channel),specularColorMapUv:it&&m(_.specularColorMap.channel),specularIntensityMapUv:U&&m(_.specularIntensityMap.channel),transmissionMapUv:Ae&&m(_.transmissionMap.channel),thicknessMapUv:Y&&m(_.thicknessMap.channel),alphaMapUv:Ee&&m(_.alphaMap.channel),vertexTangents:!!V.attributes.tangent&&(me||F),vertexColors:_.vertexColors,vertexAlphas:_.vertexColors===!0&&!!V.attributes.color&&V.attributes.color.itemSize===4,pointsUvs:H.isPoints===!0&&!!V.attributes.uv&&($e||Ee),fog:!!ne,useFog:_.fog===!0,fogExp2:!!ne&&ne.isFogExp2,flatShading:_.flatShading===!0,sizeAttenuation:_.sizeAttenuation===!0,logarithmicDepthBuffer:u,reverseDepthBuffer:d,skinning:H.isSkinnedMesh===!0,morphTargets:V.morphAttributes.position!==void 0,morphNormals:V.morphAttributes.normal!==void 0,morphColors:V.morphAttributes.color!==void 0,morphTargetsCount:Ke,morphTextureStride:nt,numDirLights:S.directional.length,numPointLights:S.point.length,numSpotLights:S.spot.length,numSpotLightMaps:S.spotLightMap.length,numRectAreaLights:S.rectArea.length,numHemiLights:S.hemi.length,numDirLightShadows:S.directionalShadowMap.length,numPointLightShadows:S.pointShadowMap.length,numSpotLightShadows:S.spotShadowMap.length,numSpotLightShadowsWithMaps:S.numSpotLightShadowsWithMaps,numLightProbes:S.numLightProbes,numClippingPlanes:o.numPlanes,numClipIntersection:o.numIntersection,dithering:_.dithering,shadowMapEnabled:i.shadowMap.enabled&&L.length>0,shadowMapType:i.shadowMap.type,toneMapping:$t,decodeVideoTexture:$e&&_.map.isVideoTexture===!0&&ct.getTransfer(_.map.colorSpace)===gt,premultipliedAlpha:_.premultipliedAlpha,doubleSided:_.side===Fn,flipSided:_.side===Ht,useDepthPacking:_.depthPacking>=0,depthPacking:_.depthPacking||0,index0AttributeName:_.index0AttributeName,extensionClipCullDistance:Tt&&_.extensions.clipCullDistance===!0&&n.has("WEBGL_clip_cull_distance"),extensionMultiDraw:(Tt&&_.extensions.multiDraw===!0||Ne)&&n.has("WEBGL_multi_draw"),rendererExtensionParallelShaderCompile:n.has("KHR_parallel_shader_compile"),customProgramCacheKey:_.customProgramCacheKey()};return rt.vertexUv1s=l.has(1),rt.vertexUv2s=l.has(2),rt.vertexUv3s=l.has(3),l.clear(),rt}function M(_){let S=[];if(_.shaderID?S.push(_.shaderID):(S.push(_.customVertexShaderID),S.push(_.customFragmentShaderID)),_.defines!==void 0)for(let L in _.defines)S.push(L),S.push(_.defines[L]);return _.isRawShaderMaterial===!1&&(x(S,_),b(S,_),S.push(i.outputColorSpace)),S.push(_.customProgramCacheKey),S.join()}function x(_,S){_.push(S.precision),_.push(S.outputColorSpace),_.push(S.envMapMode),_.push(S.envMapCubeUVHeight),_.push(S.mapUv),_.push(S.alphaMapUv),_.push(S.lightMapUv),_.push(S.aoMapUv),_.push(S.bumpMapUv),_.push(S.normalMapUv),_.push(S.displacementMapUv),_.push(S.emissiveMapUv),_.push(S.metalnessMapUv),_.push(S.roughnessMapUv),_.push(S.anisotropyMapUv),_.push(S.clearcoatMapUv),_.push(S.clearcoatNormalMapUv),_.push(S.clearcoatRoughnessMapUv),_.push(S.iridescenceMapUv),_.push(S.iridescenceThicknessMapUv),_.push(S.sheenColorMapUv),_.push(S.sheenRoughnessMapUv),_.push(S.specularMapUv),_.push(S.specularColorMapUv),_.push(S.specularIntensityMapUv),_.push(S.transmissionMapUv),_.push(S.thicknessMapUv),_.push(S.combine),_.push(S.fogExp2),_.push(S.sizeAttenuation),_.push(S.morphTargetsCount),_.push(S.morphAttributeCount),_.push(S.numDirLights),_.push(S.numPointLights),_.push(S.numSpotLights),_.push(S.numSpotLightMaps),_.push(S.numHemiLights),_.push(S.numRectAreaLights),_.push(S.numDirLightShadows),_.push(S.numPointLightShadows),_.push(S.numSpotLightShadows),_.push(S.numSpotLightShadowsWithMaps),_.push(S.numLightProbes),_.push(S.shadowMapType),_.push(S.toneMapping),_.push(S.numClippingPlanes),_.push(S.numClipIntersection),_.push(S.depthPacking)}function b(_,S){a.disableAll(),S.supportsVertexTextures&&a.enable(0),S.instancing&&a.enable(1),S.instancingColor&&a.enable(2),S.instancingMorph&&a.enable(3),S.matcap&&a.enable(4),S.envMap&&a.enable(5),S.normalMapObjectSpace&&a.enable(6),S.normalMapTangentSpace&&a.enable(7),S.clearcoat&&a.enable(8),S.iridescence&&a.enable(9),S.alphaTest&&a.enable(10),S.vertexColors&&a.enable(11),S.vertexAlphas&&a.enable(12),S.vertexUv1s&&a.enable(13),S.vertexUv2s&&a.enable(14),S.vertexUv3s&&a.enable(15),S.vertexTangents&&a.enable(16),S.anisotropy&&a.enable(17),S.alphaHash&&a.enable(18),S.batching&&a.enable(19),S.dispersion&&a.enable(20),S.batchingColor&&a.enable(21),_.push(a.mask),a.disableAll(),S.fog&&a.enable(0),S.useFog&&a.enable(1),S.flatShading&&a.enable(2),S.logarithmicDepthBuffer&&a.enable(3),S.reverseDepthBuffer&&a.enable(4),S.skinning&&a.enable(5),S.morphTargets&&a.enable(6),S.morphNormals&&a.enable(7),S.morphColors&&a.enable(8),S.premultipliedAlpha&&a.enable(9),S.shadowMapEnabled&&a.enable(10),S.doubleSided&&a.enable(11),S.flipSided&&a.enable(12),S.useDepthPacking&&a.enable(13),S.dithering&&a.enable(14),S.transmission&&a.enable(15),S.sheen&&a.enable(16),S.opaque&&a.enable(17),S.pointsUvs&&a.enable(18),S.decodeVideoTexture&&a.enable(19),S.alphaToCoverage&&a.enable(20),_.push(a.mask)}function D(_){let S=y[_.type],L;if(S){let N=bn[S];L=Zl.clone(N.uniforms)}else L=_.uniforms;return L}function A(_,S){let L;for(let N=0,H=h.length;N<H;N++){let ne=h[N];if(ne.cacheKey===S){L=ne,++L.usedTimes;break}}return L===void 0&&(L=new Ey(i,S,_,r),h.push(L)),L}function C(_){if(--_.usedTimes===0){let S=h.indexOf(_);h[S]=h[h.length-1],h.pop(),_.destroy()}}function P(_){c.remove(_)}function z(){c.dispose()}return{getParameters:p,getProgramCacheKey:M,getUniforms:D,acquireProgram:A,releaseProgram:C,releaseShaderCache:P,programs:h,dispose:z}}function Ay(){let i=new WeakMap;function e(o){return i.has(o)}function t(o){let a=i.get(o);return a===void 0&&(a={},i.set(o,a)),a}function n(o){i.delete(o)}function s(o,a,c){i.get(o)[a]=c}function r(){i=new WeakMap}return{has:e,get:t,remove:n,update:s,dispose:r}}function Cy(i,e){return i.groupOrder!==e.groupOrder?i.groupOrder-e.groupOrder:i.renderOrder!==e.renderOrder?i.renderOrder-e.renderOrder:i.material.id!==e.material.id?i.material.id-e.material.id:i.z!==e.z?i.z-e.z:i.id-e.id}function hd(i,e){return i.groupOrder!==e.groupOrder?i.groupOrder-e.groupOrder:i.renderOrder!==e.renderOrder?i.renderOrder-e.renderOrder:i.z!==e.z?e.z-i.z:i.id-e.id}function ud(){let i=[],e=0,t=[],n=[],s=[];function r(){e=0,t.length=0,n.length=0,s.length=0}function o(u,d,f,g,y,m){let p=i[e];return p===void 0?(p={id:u.id,object:u,geometry:d,material:f,groupOrder:g,renderOrder:u.renderOrder,z:y,group:m},i[e]=p):(p.id=u.id,p.object=u,p.geometry=d,p.material=f,p.groupOrder=g,p.renderOrder=u.renderOrder,p.z=y,p.group=m),e++,p}function a(u,d,f,g,y,m){let p=o(u,d,f,g,y,m);f.transmission>0?n.push(p):f.transparent===!0?s.push(p):t.push(p)}function c(u,d,f,g,y,m){let p=o(u,d,f,g,y,m);f.transmission>0?n.unshift(p):f.transparent===!0?s.unshift(p):t.unshift(p)}function l(u,d){t.length>1&&t.sort(u||Cy),n.length>1&&n.sort(d||hd),s.length>1&&s.sort(d||hd)}function h(){for(let u=e,d=i.length;u<d;u++){let f=i[u];if(f.id===null)break;f.id=null,f.object=null,f.geometry=null,f.material=null,f.group=null}}return{opaque:t,transmissive:n,transparent:s,init:r,push:a,unshift:c,finish:h,sort:l}}function Ry(){let i=new WeakMap;function e(n,s){let r=i.get(n),o;return r===void 0?(o=new ud,i.set(n,[o])):s>=r.length?(o=new ud,r.push(o)):o=r[s],o}function t(){i=new WeakMap}return{get:e,dispose:t}}function Py(){let i={};return{get:function(e){if(i[e.id]!==void 0)return i[e.id];let t;switch(e.type){case"DirectionalLight":t={direction:new R,color:new Qe};break;case"SpotLight":t={position:new R,direction:new R,color:new Qe,distance:0,coneCos:0,penumbraCos:0,decay:0};break;case"PointLight":t={position:new R,color:new Qe,distance:0,decay:0};break;case"HemisphereLight":t={direction:new R,skyColor:new Qe,groundColor:new Qe};break;case"RectAreaLight":t={color:new Qe,position:new R,halfWidth:new R,halfHeight:new R};break}return i[e.id]=t,t}}}function Iy(){let i={};return{get:function(e){if(i[e.id]!==void 0)return i[e.id];let t;switch(e.type){case"DirectionalLight":t={shadowIntensity:1,shadowBias:0,shadowNormalBias:0,shadowRadius:1,shadowMapSize:new le};break;case"SpotLight":t={shadowIntensity:1,shadowBias:0,shadowNormalBias:0,shadowRadius:1,shadowMapSize:new le};break;case"PointLight":t={shadowIntensity:1,shadowBias:0,shadowNormalBias:0,shadowRadius:1,shadowMapSize:new le,shadowCameraNear:1,shadowCameraFar:1e3};break}return i[e.id]=t,t}}}var Ly=0;function Dy(i,e){return(e.castShadow?2:0)-(i.castShadow?2:0)+(e.map?1:0)-(i.map?1:0)}function Uy(i){let e=new Py,t=Iy(),n={version:0,hash:{directionalLength:-1,pointLength:-1,spotLength:-1,rectAreaLength:-1,hemiLength:-1,numDirectionalShadows:-1,numPointShadows:-1,numSpotShadows:-1,numSpotMaps:-1,numLightProbes:-1},ambient:[0,0,0],probe:[],directional:[],directionalShadow:[],directionalShadowMap:[],directionalShadowMatrix:[],spot:[],spotLightMap:[],spotShadow:[],spotShadowMap:[],spotLightMatrix:[],rectArea:[],rectAreaLTC1:null,rectAreaLTC2:null,point:[],pointShadow:[],pointShadowMap:[],pointShadowMatrix:[],hemi:[],numSpotLightShadowsWithMaps:0,numLightProbes:0};for(let l=0;l<9;l++)n.probe.push(new R);let s=new R,r=new _t,o=new _t;function a(l){let h=0,u=0,d=0;for(let z=0;z<9;z++)n.probe[z].set(0,0,0);let f=0,g=0,y=0,m=0,p=0,M=0,x=0,b=0,D=0,A=0,C=0;l.sort(Dy);for(let z=0,_=l.length;z<_;z++){let S=l[z],L=S.color,N=S.intensity,H=S.distance,ne=S.shadow&&S.shadow.map?S.shadow.map.texture:null;if(S.isAmbientLight)h+=L.r*N,u+=L.g*N,d+=L.b*N;else if(S.isLightProbe){for(let V=0;V<9;V++)n.probe[V].addScaledVector(S.sh.coefficients[V],N);C++}else if(S.isDirectionalLight){let V=e.get(S);if(V.color.copy(S.color).multiplyScalar(S.intensity),S.castShadow){let se=S.shadow,q=t.get(S);q.shadowIntensity=se.intensity,q.shadowBias=se.bias,q.shadowNormalBias=se.normalBias,q.shadowRadius=se.radius,q.shadowMapSize=se.mapSize,n.directionalShadow[f]=q,n.directionalShadowMap[f]=ne,n.directionalShadowMatrix[f]=S.shadow.matrix,M++}n.directional[f]=V,f++}else if(S.isSpotLight){let V=e.get(S);V.position.setFromMatrixPosition(S.matrixWorld),V.color.copy(L).multiplyScalar(N),V.distance=H,V.coneCos=Math.cos(S.angle),V.penumbraCos=Math.cos(S.angle*(1-S.penumbra)),V.decay=S.decay,n.spot[y]=V;let se=S.shadow;if(S.map&&(n.spotLightMap[D]=S.map,D++,se.updateMatrices(S),S.castShadow&&A++),n.spotLightMatrix[y]=se.matrix,S.castShadow){let q=t.get(S);q.shadowIntensity=se.intensity,q.shadowBias=se.bias,q.shadowNormalBias=se.normalBias,q.shadowRadius=se.radius,q.shadowMapSize=se.mapSize,n.spotShadow[y]=q,n.spotShadowMap[y]=ne,b++}y++}else if(S.isRectAreaLight){let V=e.get(S);V.color.copy(L).multiplyScalar(N),V.halfWidth.set(S.width*.5,0,0),V.halfHeight.set(0,S.height*.5,0),n.rectArea[m]=V,m++}else if(S.isPointLight){let V=e.get(S);if(V.color.copy(S.color).multiplyScalar(S.intensity),V.distance=S.distance,V.decay=S.decay,S.castShadow){let se=S.shadow,q=t.get(S);q.shadowIntensity=se.intensity,q.shadowBias=se.bias,q.shadowNormalBias=se.normalBias,q.shadowRadius=se.radius,q.shadowMapSize=se.mapSize,q.shadowCameraNear=se.camera.near,q.shadowCameraFar=se.camera.far,n.pointShadow[g]=q,n.pointShadowMap[g]=ne,n.pointShadowMatrix[g]=S.shadow.matrix,x++}n.point[g]=V,g++}else if(S.isHemisphereLight){let V=e.get(S);V.skyColor.copy(S.color).multiplyScalar(N),V.groundColor.copy(S.groundColor).multiplyScalar(N),n.hemi[p]=V,p++}}m>0&&(i.has("OES_texture_float_linear")===!0?(n.rectAreaLTC1=_e.LTC_FLOAT_1,n.rectAreaLTC2=_e.LTC_FLOAT_2):(n.rectAreaLTC1=_e.LTC_HALF_1,n.rectAreaLTC2=_e.LTC_HALF_2)),n.ambient[0]=h,n.ambient[1]=u,n.ambient[2]=d;let P=n.hash;(P.directionalLength!==f||P.pointLength!==g||P.spotLength!==y||P.rectAreaLength!==m||P.hemiLength!==p||P.numDirectionalShadows!==M||P.numPointShadows!==x||P.numSpotShadows!==b||P.numSpotMaps!==D||P.numLightProbes!==C)&&(n.directional.length=f,n.spot.length=y,n.rectArea.length=m,n.point.length=g,n.hemi.length=p,n.directionalShadow.length=M,n.directionalShadowMap.length=M,n.pointShadow.length=x,n.pointShadowMap.length=x,n.spotShadow.length=b,n.spotShadowMap.length=b,n.directionalShadowMatrix.length=M,n.pointShadowMatrix.length=x,n.spotLightMatrix.length=b+D-A,n.spotLightMap.length=D,n.numSpotLightShadowsWithMaps=A,n.numLightProbes=C,P.directionalLength=f,P.pointLength=g,P.spotLength=y,P.rectAreaLength=m,P.hemiLength=p,P.numDirectionalShadows=M,P.numPointShadows=x,P.numSpotShadows=b,P.numSpotMaps=D,P.numLightProbes=C,n.version=Ly++)}function c(l,h){let u=0,d=0,f=0,g=0,y=0,m=h.matrixWorldInverse;for(let p=0,M=l.length;p<M;p++){let x=l[p];if(x.isDirectionalLight){let b=n.directional[u];b.direction.setFromMatrixPosition(x.matrixWorld),s.setFromMatrixPosition(x.target.matrixWorld),b.direction.sub(s),b.direction.transformDirection(m),u++}else if(x.isSpotLight){let b=n.spot[f];b.position.setFromMatrixPosition(x.matrixWorld),b.position.applyMatrix4(m),b.direction.setFromMatrixPosition(x.matrixWorld),s.setFromMatrixPosition(x.target.matrixWorld),b.direction.sub(s),b.direction.transformDirection(m),f++}else if(x.isRectAreaLight){let b=n.rectArea[g];b.position.setFromMatrixPosition(x.matrixWorld),b.position.applyMatrix4(m),o.identity(),r.copy(x.matrixWorld),r.premultiply(m),o.extractRotation(r),b.halfWidth.set(x.width*.5,0,0),b.halfHeight.set(0,x.height*.5,0),b.halfWidth.applyMatrix4(o),b.halfHeight.applyMatrix4(o),g++}else if(x.isPointLight){let b=n.point[d];b.position.setFromMatrixPosition(x.matrixWorld),b.position.applyMatrix4(m),d++}else if(x.isHemisphereLight){let b=n.hemi[y];b.direction.setFromMatrixPosition(x.matrixWorld),b.direction.transformDirection(m),y++}}}return{setup:a,setupView:c,state:n}}function dd(i){let e=new Uy(i),t=[],n=[];function s(h){l.camera=h,t.length=0,n.length=0}function r(h){t.push(h)}function o(h){n.push(h)}function a(){e.setup(t)}function c(h){e.setupView(t,h)}let l={lightsArray:t,shadowsArray:n,camera:null,lights:e,transmissionRenderTarget:{}};return{init:s,state:l,setupLights:a,setupLightsView:c,pushLight:r,pushShadow:o}}function Ny(i){let e=new WeakMap;function t(s,r=0){let o=e.get(s),a;return o===void 0?(a=new dd(i),e.set(s,[a])):r>=o.length?(a=new dd(i),o.push(a)):a=o[r],a}function n(){e=new WeakMap}return{get:t,dispose:n}}var ll=class extends Gn{constructor(e){super(),this.isMeshDepthMaterial=!0,this.type="MeshDepthMaterial",this.depthPacking=Ap,this.map=null,this.alphaMap=null,this.displacementMap=null,this.displacementScale=1,this.displacementBias=0,this.wireframe=!1,this.wireframeLinewidth=1,this.setValues(e)}copy(e){return super.copy(e),this.depthPacking=e.depthPacking,this.map=e.map,this.alphaMap=e.alphaMap,this.displacementMap=e.displacementMap,this.displacementScale=e.displacementScale,this.displacementBias=e.displacementBias,this.wireframe=e.wireframe,this.wireframeLinewidth=e.wireframeLinewidth,this}},hl=class extends Gn{constructor(e){super(),this.isMeshDistanceMaterial=!0,this.type="MeshDistanceMaterial",this.map=null,this.alphaMap=null,this.displacementMap=null,this.displacementScale=1,this.displacementBias=0,this.setValues(e)}copy(e){return super.copy(e),this.map=e.map,this.alphaMap=e.alphaMap,this.displacementMap=e.displacementMap,this.displacementScale=e.displacementScale,this.displacementBias=e.displacementBias,this}},ky=`void main() {
	gl_Position = vec4( position, 1.0 );
}`,Oy=`uniform sampler2D shadow_pass;
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
}`;function Fy(i,e,t){let n=new Js,s=new le,r=new le,o=new ft,a=new ll({depthPacking:Cp}),c=new hl,l={},h=t.maxTextureSize,u={[Sn]:Ht,[Ht]:Sn,[Fn]:Fn},d=new cn({defines:{VSM_SAMPLES:8},uniforms:{shadow_pass:{value:null},resolution:{value:new le},radius:{value:4}},vertexShader:ky,fragmentShader:Oy}),f=d.clone();f.defines.HORIZONTAL_PASS=1;let g=new It;g.setAttribute("position",new tn(new Float32Array([-1,-1,.5,3,-1,.5,-1,3,.5]),3));let y=new tt(g,d),m=this;this.enabled=!1,this.autoUpdate=!0,this.needsUpdate=!1,this.type=wd;let p=this.type;this.render=function(A,C,P){if(m.enabled===!1||m.autoUpdate===!1&&m.needsUpdate===!1||A.length===0)return;let z=i.getRenderTarget(),_=i.getActiveCubeFace(),S=i.getActiveMipmapLevel(),L=i.state;L.setBlending(ti),L.buffers.color.setClear(1,1,1,1),L.buffers.depth.setTest(!0),L.setScissorTest(!1);let N=p!==kn&&this.type===kn,H=p===kn&&this.type!==kn;for(let ne=0,V=A.length;ne<V;ne++){let se=A[ne],q=se.shadow;if(q===void 0){console.warn("THREE.WebGLShadowMap:",se,"has no shadow.");continue}if(q.autoUpdate===!1&&q.needsUpdate===!1)continue;s.copy(q.mapSize);let ve=q.getFrameExtents();if(s.multiply(ve),r.copy(q.mapSize),(s.x>h||s.y>h)&&(s.x>h&&(r.x=Math.floor(h/ve.x),s.x=r.x*ve.x,q.mapSize.x=r.x),s.y>h&&(r.y=Math.floor(h/ve.y),s.y=r.y*ve.y,q.mapSize.y=r.y)),q.map===null||N===!0||H===!0){let Me=this.type!==kn?{minFilter:an,magFilter:an}:{};q.map!==null&&q.map.dispose(),q.map=new Vn(s.x,s.y,Me),q.map.texture.name=se.name+".shadowMap",q.camera.updateProjectionMatrix()}i.setRenderTarget(q.map),i.clear();let be=q.getViewportCount();for(let Me=0;Me<be;Me++){let Ke=q.getViewport(Me);o.set(r.x*Ke.x,r.y*Ke.y,r.x*Ke.z,r.y*Ke.w),L.viewport(o),q.updateMatrices(se,Me),n=q.getFrustum(),b(C,P,q.camera,se,this.type)}q.isPointLightShadow!==!0&&this.type===kn&&M(q,P),q.needsUpdate=!1}p=this.type,m.needsUpdate=!1,i.setRenderTarget(z,_,S)};function M(A,C){let P=e.update(y);d.defines.VSM_SAMPLES!==A.blurSamples&&(d.defines.VSM_SAMPLES=A.blurSamples,f.defines.VSM_SAMPLES=A.blurSamples,d.needsUpdate=!0,f.needsUpdate=!0),A.mapPass===null&&(A.mapPass=new Vn(s.x,s.y)),d.uniforms.shadow_pass.value=A.map.texture,d.uniforms.resolution.value=A.mapSize,d.uniforms.radius.value=A.radius,i.setRenderTarget(A.mapPass),i.clear(),i.renderBufferDirect(C,null,P,d,y,null),f.uniforms.shadow_pass.value=A.mapPass.texture,f.uniforms.resolution.value=A.mapSize,f.uniforms.radius.value=A.radius,i.setRenderTarget(A.map),i.clear(),i.renderBufferDirect(C,null,P,f,y,null)}function x(A,C,P,z){let _=null,S=P.isPointLight===!0?A.customDistanceMaterial:A.customDepthMaterial;if(S!==void 0)_=S;else if(_=P.isPointLight===!0?c:a,i.localClippingEnabled&&C.clipShadows===!0&&Array.isArray(C.clippingPlanes)&&C.clippingPlanes.length!==0||C.displacementMap&&C.displacementScale!==0||C.alphaMap&&C.alphaTest>0||C.map&&C.alphaTest>0){let L=_.uuid,N=C.uuid,H=l[L];H===void 0&&(H={},l[L]=H);let ne=H[N];ne===void 0&&(ne=_.clone(),H[N]=ne,C.addEventListener("dispose",D)),_=ne}if(_.visible=C.visible,_.wireframe=C.wireframe,z===kn?_.side=C.shadowSide!==null?C.shadowSide:C.side:_.side=C.shadowSide!==null?C.shadowSide:u[C.side],_.alphaMap=C.alphaMap,_.alphaTest=C.alphaTest,_.map=C.map,_.clipShadows=C.clipShadows,_.clippingPlanes=C.clippingPlanes,_.clipIntersection=C.clipIntersection,_.displacementMap=C.displacementMap,_.displacementScale=C.displacementScale,_.displacementBias=C.displacementBias,_.wireframeLinewidth=C.wireframeLinewidth,_.linewidth=C.linewidth,P.isPointLight===!0&&_.isMeshDistanceMaterial===!0){let L=i.properties.get(_);L.light=P}return _}function b(A,C,P,z,_){if(A.visible===!1)return;if(A.layers.test(C.layers)&&(A.isMesh||A.isLine||A.isPoints)&&(A.castShadow||A.receiveShadow&&_===kn)&&(!A.frustumCulled||n.intersectsObject(A))){A.modelViewMatrix.multiplyMatrices(P.matrixWorldInverse,A.matrixWorld);let N=e.update(A),H=A.material;if(Array.isArray(H)){let ne=N.groups;for(let V=0,se=ne.length;V<se;V++){let q=ne[V],ve=H[q.materialIndex];if(ve&&ve.visible){let be=x(A,ve,z,_);A.onBeforeShadow(i,A,C,P,N,be,q),i.renderBufferDirect(P,null,N,be,A,q),A.onAfterShadow(i,A,C,P,N,be,q)}}}else if(H.visible){let ne=x(A,H,z,_);A.onBeforeShadow(i,A,C,P,N,ne,null),i.renderBufferDirect(P,null,N,ne,A,null),A.onAfterShadow(i,A,C,P,N,ne,null)}}let L=A.children;for(let N=0,H=L.length;N<H;N++)b(L[N],C,P,z,_)}function D(A){A.target.removeEventListener("dispose",D);for(let P in l){let z=l[P],_=A.target.uuid;_ in z&&(z[_].dispose(),delete z[_])}}}var By={[pc]:mc,[gc]:xc,[_c]:vc,[os]:yc,[mc]:pc,[xc]:gc,[vc]:_c,[yc]:os};function zy(i){function e(){let U=!1,Ae=new ft,Y=null,ie=new ft(0,0,0,0);return{setMask:function(Ee){Y!==Ee&&!U&&(i.colorMask(Ee,Ee,Ee,Ee),Y=Ee)},setLocked:function(Ee){U=Ee},setClear:function(Ee,Ce,st,Tt,$t){$t===!0&&(Ee*=Tt,Ce*=Tt,st*=Tt),Ae.set(Ee,Ce,st,Tt),ie.equals(Ae)===!1&&(i.clearColor(Ee,Ce,st,Tt),ie.copy(Ae))},reset:function(){U=!1,Y=null,ie.set(-1,0,0,0)}}}function t(){let U=!1,Ae=!1,Y=null,ie=null,Ee=null;return{setReversed:function(Ce){Ae=Ce},setTest:function(Ce){Ce?we(i.DEPTH_TEST):X(i.DEPTH_TEST)},setMask:function(Ce){Y!==Ce&&!U&&(i.depthMask(Ce),Y=Ce)},setFunc:function(Ce){if(Ae&&(Ce=By[Ce]),ie!==Ce){switch(Ce){case pc:i.depthFunc(i.NEVER);break;case mc:i.depthFunc(i.ALWAYS);break;case gc:i.depthFunc(i.LESS);break;case os:i.depthFunc(i.LEQUAL);break;case _c:i.depthFunc(i.EQUAL);break;case yc:i.depthFunc(i.GEQUAL);break;case xc:i.depthFunc(i.GREATER);break;case vc:i.depthFunc(i.NOTEQUAL);break;default:i.depthFunc(i.LEQUAL)}ie=Ce}},setLocked:function(Ce){U=Ce},setClear:function(Ce){Ee!==Ce&&(i.clearDepth(Ce),Ee=Ce)},reset:function(){U=!1,Y=null,ie=null,Ee=null}}}function n(){let U=!1,Ae=null,Y=null,ie=null,Ee=null,Ce=null,st=null,Tt=null,$t=null;return{setTest:function(rt){U||(rt?we(i.STENCIL_TEST):X(i.STENCIL_TEST))},setMask:function(rt){Ae!==rt&&!U&&(i.stencilMask(rt),Ae=rt)},setFunc:function(rt,Jt,Pn){(Y!==rt||ie!==Jt||Ee!==Pn)&&(i.stencilFunc(rt,Jt,Pn),Y=rt,ie=Jt,Ee=Pn)},setOp:function(rt,Jt,Pn){(Ce!==rt||st!==Jt||Tt!==Pn)&&(i.stencilOp(rt,Jt,Pn),Ce=rt,st=Jt,Tt=Pn)},setLocked:function(rt){U=rt},setClear:function(rt){$t!==rt&&(i.clearStencil(rt),$t=rt)},reset:function(){U=!1,Ae=null,Y=null,ie=null,Ee=null,Ce=null,st=null,Tt=null,$t=null}}}let s=new e,r=new t,o=new n,a=new WeakMap,c=new WeakMap,l={},h={},u=new WeakMap,d=[],f=null,g=!1,y=null,m=null,p=null,M=null,x=null,b=null,D=null,A=new Qe(0,0,0),C=0,P=!1,z=null,_=null,S=null,L=null,N=null,H=i.getParameter(i.MAX_COMBINED_TEXTURE_IMAGE_UNITS),ne=!1,V=0,se=i.getParameter(i.VERSION);se.indexOf("WebGL")!==-1?(V=parseFloat(/^WebGL (\d)/.exec(se)[1]),ne=V>=1):se.indexOf("OpenGL ES")!==-1&&(V=parseFloat(/^OpenGL ES (\d)/.exec(se)[1]),ne=V>=2);let q=null,ve={},be=i.getParameter(i.SCISSOR_BOX),Me=i.getParameter(i.VIEWPORT),Ke=new ft().fromArray(be),nt=new ft().fromArray(Me);function J(U,Ae,Y,ie){let Ee=new Uint8Array(4),Ce=i.createTexture();i.bindTexture(U,Ce),i.texParameteri(U,i.TEXTURE_MIN_FILTER,i.NEAREST),i.texParameteri(U,i.TEXTURE_MAG_FILTER,i.NEAREST);for(let st=0;st<Y;st++)U===i.TEXTURE_3D||U===i.TEXTURE_2D_ARRAY?i.texImage3D(Ae,0,i.RGBA,1,1,ie,0,i.RGBA,i.UNSIGNED_BYTE,Ee):i.texImage2D(Ae+st,0,i.RGBA,1,1,0,i.RGBA,i.UNSIGNED_BYTE,Ee);return Ce}let ae={};ae[i.TEXTURE_2D]=J(i.TEXTURE_2D,i.TEXTURE_2D,1),ae[i.TEXTURE_CUBE_MAP]=J(i.TEXTURE_CUBE_MAP,i.TEXTURE_CUBE_MAP_POSITIVE_X,6),ae[i.TEXTURE_2D_ARRAY]=J(i.TEXTURE_2D_ARRAY,i.TEXTURE_2D_ARRAY,1,1),ae[i.TEXTURE_3D]=J(i.TEXTURE_3D,i.TEXTURE_3D,1,1),s.setClear(0,0,0,1),r.setClear(1),o.setClear(0),we(i.DEPTH_TEST),r.setFunc(os),fe(!1),ce(yu),we(i.CULL_FACE),w(ti);function we(U){l[U]!==!0&&(i.enable(U),l[U]=!0)}function X(U){l[U]!==!1&&(i.disable(U),l[U]=!1)}function xe(U,Ae){return h[U]!==Ae?(i.bindFramebuffer(U,Ae),h[U]=Ae,U===i.DRAW_FRAMEBUFFER&&(h[i.FRAMEBUFFER]=Ae),U===i.FRAMEBUFFER&&(h[i.DRAW_FRAMEBUFFER]=Ae),!0):!1}function Oe(U,Ae){let Y=d,ie=!1;if(U){Y=u.get(Ae),Y===void 0&&(Y=[],u.set(Ae,Y));let Ee=U.textures;if(Y.length!==Ee.length||Y[0]!==i.COLOR_ATTACHMENT0){for(let Ce=0,st=Ee.length;Ce<st;Ce++)Y[Ce]=i.COLOR_ATTACHMENT0+Ce;Y.length=Ee.length,ie=!0}}else Y[0]!==i.BACK&&(Y[0]=i.BACK,ie=!0);ie&&i.drawBuffers(Y)}function Ne(U){return f!==U?(i.useProgram(U),f=U,!0):!1}let $e={[_i]:i.FUNC_ADD,[tp]:i.FUNC_SUBTRACT,[np]:i.FUNC_REVERSE_SUBTRACT};$e[ip]=i.MIN,$e[sp]=i.MAX;let ee={[rp]:i.ZERO,[op]:i.ONE,[ap]:i.SRC_COLOR,[dc]:i.SRC_ALPHA,[fp]:i.SRC_ALPHA_SATURATE,[up]:i.DST_COLOR,[lp]:i.DST_ALPHA,[cp]:i.ONE_MINUS_SRC_COLOR,[fc]:i.ONE_MINUS_SRC_ALPHA,[dp]:i.ONE_MINUS_DST_COLOR,[hp]:i.ONE_MINUS_DST_ALPHA,[pp]:i.CONSTANT_COLOR,[mp]:i.ONE_MINUS_CONSTANT_COLOR,[gp]:i.CONSTANT_ALPHA,[_p]:i.ONE_MINUS_CONSTANT_ALPHA};function w(U,Ae,Y,ie,Ee,Ce,st,Tt,$t,rt){if(U===ti){g===!0&&(X(i.BLEND),g=!1);return}if(g===!1&&(we(i.BLEND),g=!0),U!==ep){if(U!==y||rt!==P){if((m!==_i||x!==_i)&&(i.blendEquation(i.FUNC_ADD),m=_i,x=_i),rt)switch(U){case ns:i.blendFuncSeparate(i.ONE,i.ONE_MINUS_SRC_ALPHA,i.ONE,i.ONE_MINUS_SRC_ALPHA);break;case xu:i.blendFunc(i.ONE,i.ONE);break;case vu:i.blendFuncSeparate(i.ZERO,i.ONE_MINUS_SRC_COLOR,i.ZERO,i.ONE);break;case bu:i.blendFuncSeparate(i.ZERO,i.SRC_COLOR,i.ZERO,i.SRC_ALPHA);break;default:console.error("THREE.WebGLState: Invalid blending: ",U);break}else switch(U){case ns:i.blendFuncSeparate(i.SRC_ALPHA,i.ONE_MINUS_SRC_ALPHA,i.ONE,i.ONE_MINUS_SRC_ALPHA);break;case xu:i.blendFunc(i.SRC_ALPHA,i.ONE);break;case vu:i.blendFuncSeparate(i.ZERO,i.ONE_MINUS_SRC_COLOR,i.ZERO,i.ONE);break;case bu:i.blendFunc(i.ZERO,i.SRC_COLOR);break;default:console.error("THREE.WebGLState: Invalid blending: ",U);break}p=null,M=null,b=null,D=null,A.set(0,0,0),C=0,y=U,P=rt}return}Ee=Ee||Ae,Ce=Ce||Y,st=st||ie,(Ae!==m||Ee!==x)&&(i.blendEquationSeparate($e[Ae],$e[Ee]),m=Ae,x=Ee),(Y!==p||ie!==M||Ce!==b||st!==D)&&(i.blendFuncSeparate(ee[Y],ee[ie],ee[Ce],ee[st]),p=Y,M=ie,b=Ce,D=st),(Tt.equals(A)===!1||$t!==C)&&(i.blendColor(Tt.r,Tt.g,Tt.b,$t),A.copy(Tt),C=$t),y=U,P=!1}function pe(U,Ae){U.side===Fn?X(i.CULL_FACE):we(i.CULL_FACE);let Y=U.side===Ht;Ae&&(Y=!Y),fe(Y),U.blending===ns&&U.transparent===!1?w(ti):w(U.blending,U.blendEquation,U.blendSrc,U.blendDst,U.blendEquationAlpha,U.blendSrcAlpha,U.blendDstAlpha,U.blendColor,U.blendAlpha,U.premultipliedAlpha),r.setFunc(U.depthFunc),r.setTest(U.depthTest),r.setMask(U.depthWrite),s.setMask(U.colorWrite);let ie=U.stencilWrite;o.setTest(ie),ie&&(o.setMask(U.stencilWriteMask),o.setFunc(U.stencilFunc,U.stencilRef,U.stencilFuncMask),o.setOp(U.stencilFail,U.stencilZFail,U.stencilZPass)),De(U.polygonOffset,U.polygonOffsetFactor,U.polygonOffsetUnits),U.alphaToCoverage===!0?we(i.SAMPLE_ALPHA_TO_COVERAGE):X(i.SAMPLE_ALPHA_TO_COVERAGE)}function fe(U){z!==U&&(U?i.frontFace(i.CW):i.frontFace(i.CCW),z=U)}function ce(U){U!==Kf?(we(i.CULL_FACE),U!==_&&(U===yu?i.cullFace(i.BACK):U===Qf?i.cullFace(i.FRONT):i.cullFace(i.FRONT_AND_BACK))):X(i.CULL_FACE),_=U}function me(U){U!==S&&(ne&&i.lineWidth(U),S=U)}function De(U,Ae,Y){U?(we(i.POLYGON_OFFSET_FILL),(L!==Ae||N!==Y)&&(i.polygonOffset(Ae,Y),L=Ae,N=Y)):X(i.POLYGON_OFFSET_FILL)}function Se(U){U?we(i.SCISSOR_TEST):X(i.SCISSOR_TEST)}function T(U){U===void 0&&(U=i.TEXTURE0+H-1),q!==U&&(i.activeTexture(U),q=U)}function v(U,Ae,Y){Y===void 0&&(q===null?Y=i.TEXTURE0+H-1:Y=q);let ie=ve[Y];ie===void 0&&(ie={type:void 0,texture:void 0},ve[Y]=ie),(ie.type!==U||ie.texture!==Ae)&&(q!==Y&&(i.activeTexture(Y),q=Y),i.bindTexture(U,Ae||ae[U]),ie.type=U,ie.texture=Ae)}function F(){let U=ve[q];U!==void 0&&U.type!==void 0&&(i.bindTexture(U.type,null),U.type=void 0,U.texture=void 0)}function j(){try{i.compressedTexImage2D.apply(i,arguments)}catch(U){console.error("THREE.WebGLState:",U)}}function Q(){try{i.compressedTexImage3D.apply(i,arguments)}catch(U){console.error("THREE.WebGLState:",U)}}function Z(){try{i.texSubImage2D.apply(i,arguments)}catch(U){console.error("THREE.WebGLState:",U)}}function Ie(){try{i.texSubImage3D.apply(i,arguments)}catch(U){console.error("THREE.WebGLState:",U)}}function I(){try{i.compressedTexSubImage2D.apply(i,arguments)}catch(U){console.error("THREE.WebGLState:",U)}}function B(){try{i.compressedTexSubImage3D.apply(i,arguments)}catch(U){console.error("THREE.WebGLState:",U)}}function K(){try{i.texStorage2D.apply(i,arguments)}catch(U){console.error("THREE.WebGLState:",U)}}function $(){try{i.texStorage3D.apply(i,arguments)}catch(U){console.error("THREE.WebGLState:",U)}}function he(){try{i.texImage2D.apply(i,arguments)}catch(U){console.error("THREE.WebGLState:",U)}}function Be(){try{i.texImage3D.apply(i,arguments)}catch(U){console.error("THREE.WebGLState:",U)}}function He(U){Ke.equals(U)===!1&&(i.scissor(U.x,U.y,U.z,U.w),Ke.copy(U))}function ge(U){nt.equals(U)===!1&&(i.viewport(U.x,U.y,U.z,U.w),nt.copy(U))}function Je(U,Ae){let Y=c.get(Ae);Y===void 0&&(Y=new WeakMap,c.set(Ae,Y));let ie=Y.get(U);ie===void 0&&(ie=i.getUniformBlockIndex(Ae,U.name),Y.set(U,ie))}function Ve(U,Ae){let ie=c.get(Ae).get(U);a.get(Ae)!==ie&&(i.uniformBlockBinding(Ae,ie,U.__bindingPointIndex),a.set(Ae,ie))}function it(){i.disable(i.BLEND),i.disable(i.CULL_FACE),i.disable(i.DEPTH_TEST),i.disable(i.POLYGON_OFFSET_FILL),i.disable(i.SCISSOR_TEST),i.disable(i.STENCIL_TEST),i.disable(i.SAMPLE_ALPHA_TO_COVERAGE),i.blendEquation(i.FUNC_ADD),i.blendFunc(i.ONE,i.ZERO),i.blendFuncSeparate(i.ONE,i.ZERO,i.ONE,i.ZERO),i.blendColor(0,0,0,0),i.colorMask(!0,!0,!0,!0),i.clearColor(0,0,0,0),i.depthMask(!0),i.depthFunc(i.LESS),i.clearDepth(1),i.stencilMask(4294967295),i.stencilFunc(i.ALWAYS,0,4294967295),i.stencilOp(i.KEEP,i.KEEP,i.KEEP),i.clearStencil(0),i.cullFace(i.BACK),i.frontFace(i.CCW),i.polygonOffset(0,0),i.activeTexture(i.TEXTURE0),i.bindFramebuffer(i.FRAMEBUFFER,null),i.bindFramebuffer(i.DRAW_FRAMEBUFFER,null),i.bindFramebuffer(i.READ_FRAMEBUFFER,null),i.useProgram(null),i.lineWidth(1),i.scissor(0,0,i.canvas.width,i.canvas.height),i.viewport(0,0,i.canvas.width,i.canvas.height),l={},q=null,ve={},h={},u=new WeakMap,d=[],f=null,g=!1,y=null,m=null,p=null,M=null,x=null,b=null,D=null,A=new Qe(0,0,0),C=0,P=!1,z=null,_=null,S=null,L=null,N=null,Ke.set(0,0,i.canvas.width,i.canvas.height),nt.set(0,0,i.canvas.width,i.canvas.height),s.reset(),r.reset(),o.reset()}return{buffers:{color:s,depth:r,stencil:o},enable:we,disable:X,bindFramebuffer:xe,drawBuffers:Oe,useProgram:Ne,setBlending:w,setMaterial:pe,setFlipSided:fe,setCullFace:ce,setLineWidth:me,setPolygonOffset:De,setScissorTest:Se,activeTexture:T,bindTexture:v,unbindTexture:F,compressedTexImage2D:j,compressedTexImage3D:Q,texImage2D:he,texImage3D:Be,updateUBOMapping:Je,uniformBlockBinding:Ve,texStorage2D:K,texStorage3D:$,texSubImage2D:Z,texSubImage3D:Ie,compressedTexSubImage2D:I,compressedTexSubImage3D:B,scissor:He,viewport:ge,reset:it}}function fd(i,e,t,n){let s=Hy(n);switch(t){case Ld:return i*e;case Ud:return i*e;case Nd:return i*e*2;case kd:return i*e/s.components*s.byteLength;case Wl:return i*e/s.components*s.byteLength;case Od:return i*e*2/s.components*s.byteLength;case Xl:return i*e*2/s.components*s.byteLength;case Dd:return i*e*3/s.components*s.byteLength;case _n:return i*e*4/s.components*s.byteLength;case ql:return i*e*4/s.components*s.byteLength;case ro:case oo:return Math.floor((i+3)/4)*Math.floor((e+3)/4)*8;case ao:case co:return Math.floor((i+3)/4)*Math.floor((e+3)/4)*16;case Tc:case Ac:return Math.max(i,16)*Math.max(e,8)/4;case Ec:case wc:return Math.max(i,8)*Math.max(e,8)/2;case Cc:case Rc:return Math.floor((i+3)/4)*Math.floor((e+3)/4)*8;case Pc:return Math.floor((i+3)/4)*Math.floor((e+3)/4)*16;case Ic:return Math.floor((i+3)/4)*Math.floor((e+3)/4)*16;case Lc:return Math.floor((i+4)/5)*Math.floor((e+3)/4)*16;case Dc:return Math.floor((i+4)/5)*Math.floor((e+4)/5)*16;case Uc:return Math.floor((i+5)/6)*Math.floor((e+4)/5)*16;case Nc:return Math.floor((i+5)/6)*Math.floor((e+5)/6)*16;case kc:return Math.floor((i+7)/8)*Math.floor((e+4)/5)*16;case Oc:return Math.floor((i+7)/8)*Math.floor((e+5)/6)*16;case Fc:return Math.floor((i+7)/8)*Math.floor((e+7)/8)*16;case Bc:return Math.floor((i+9)/10)*Math.floor((e+4)/5)*16;case zc:return Math.floor((i+9)/10)*Math.floor((e+5)/6)*16;case Hc:return Math.floor((i+9)/10)*Math.floor((e+7)/8)*16;case Vc:return Math.floor((i+9)/10)*Math.floor((e+9)/10)*16;case Gc:return Math.floor((i+11)/12)*Math.floor((e+9)/10)*16;case Wc:return Math.floor((i+11)/12)*Math.floor((e+11)/12)*16;case lo:case Xc:case qc:return Math.ceil(i/4)*Math.ceil(e/4)*16;case Fd:case Yc:return Math.ceil(i/4)*Math.ceil(e/4)*8;case $c:case Jc:return Math.ceil(i/4)*Math.ceil(e/4)*16}throw new Error(`Unable to determine texture byte length for ${t} format.`)}function Hy(i){switch(i){case Hn:case Rd:return{byteLength:1,components:1};case Ys:case Pd:case ar:return{byteLength:2,components:1};case Vl:case Gl:return{byteLength:2,components:4};case bi:case Hl:case Bn:return{byteLength:4,components:1};case Id:return{byteLength:4,components:3}}throw new Error(`Unknown texture type ${i}.`)}function Vy(i,e,t,n,s,r,o){let a=e.has("WEBGL_multisampled_render_to_texture")?e.get("WEBGL_multisampled_render_to_texture"):null,c=typeof navigator=="undefined"?!1:/OculusBrowser/g.test(navigator.userAgent),l=new le,h=new WeakMap,u,d=new WeakMap,f=!1;try{f=typeof OffscreenCanvas!="undefined"&&new OffscreenCanvas(1,1).getContext("2d")!==null}catch{}function g(T,v){return f?new OffscreenCanvas(T,v):_o("canvas")}function y(T,v,F){let j=1,Q=Se(T);if((Q.width>F||Q.height>F)&&(j=F/Math.max(Q.width,Q.height)),j<1)if(typeof HTMLImageElement!="undefined"&&T instanceof HTMLImageElement||typeof HTMLCanvasElement!="undefined"&&T instanceof HTMLCanvasElement||typeof ImageBitmap!="undefined"&&T instanceof ImageBitmap||typeof VideoFrame!="undefined"&&T instanceof VideoFrame){let Z=Math.floor(j*Q.width),Ie=Math.floor(j*Q.height);u===void 0&&(u=g(Z,Ie));let I=v?g(Z,Ie):u;return I.width=Z,I.height=Ie,I.getContext("2d").drawImage(T,0,0,Z,Ie),console.warn("THREE.WebGLRenderer: Texture has been resized from ("+Q.width+"x"+Q.height+") to ("+Z+"x"+Ie+")."),I}else return"data"in T&&console.warn("THREE.WebGLRenderer: Image in DataTexture is too big ("+Q.width+"x"+Q.height+")."),T;return T}function m(T){return T.generateMipmaps&&T.minFilter!==an&&T.minFilter!==mn}function p(T){i.generateMipmap(T)}function M(T,v,F,j,Q=!1){if(T!==null){if(i[T]!==void 0)return i[T];console.warn("THREE.WebGLRenderer: Attempt to use non-existing WebGL internal format '"+T+"'")}let Z=v;if(v===i.RED&&(F===i.FLOAT&&(Z=i.R32F),F===i.HALF_FLOAT&&(Z=i.R16F),F===i.UNSIGNED_BYTE&&(Z=i.R8)),v===i.RED_INTEGER&&(F===i.UNSIGNED_BYTE&&(Z=i.R8UI),F===i.UNSIGNED_SHORT&&(Z=i.R16UI),F===i.UNSIGNED_INT&&(Z=i.R32UI),F===i.BYTE&&(Z=i.R8I),F===i.SHORT&&(Z=i.R16I),F===i.INT&&(Z=i.R32I)),v===i.RG&&(F===i.FLOAT&&(Z=i.RG32F),F===i.HALF_FLOAT&&(Z=i.RG16F),F===i.UNSIGNED_BYTE&&(Z=i.RG8)),v===i.RG_INTEGER&&(F===i.UNSIGNED_BYTE&&(Z=i.RG8UI),F===i.UNSIGNED_SHORT&&(Z=i.RG16UI),F===i.UNSIGNED_INT&&(Z=i.RG32UI),F===i.BYTE&&(Z=i.RG8I),F===i.SHORT&&(Z=i.RG16I),F===i.INT&&(Z=i.RG32I)),v===i.RGB_INTEGER&&(F===i.UNSIGNED_BYTE&&(Z=i.RGB8UI),F===i.UNSIGNED_SHORT&&(Z=i.RGB16UI),F===i.UNSIGNED_INT&&(Z=i.RGB32UI),F===i.BYTE&&(Z=i.RGB8I),F===i.SHORT&&(Z=i.RGB16I),F===i.INT&&(Z=i.RGB32I)),v===i.RGBA_INTEGER&&(F===i.UNSIGNED_BYTE&&(Z=i.RGBA8UI),F===i.UNSIGNED_SHORT&&(Z=i.RGBA16UI),F===i.UNSIGNED_INT&&(Z=i.RGBA32UI),F===i.BYTE&&(Z=i.RGBA8I),F===i.SHORT&&(Z=i.RGBA16I),F===i.INT&&(Z=i.RGBA32I)),v===i.RGB&&F===i.UNSIGNED_INT_5_9_9_9_REV&&(Z=i.RGB9_E5),v===i.RGBA){let Ie=Q?fo:ct.getTransfer(j);F===i.FLOAT&&(Z=i.RGBA32F),F===i.HALF_FLOAT&&(Z=i.RGBA16F),F===i.UNSIGNED_BYTE&&(Z=Ie===gt?i.SRGB8_ALPHA8:i.RGBA8),F===i.UNSIGNED_SHORT_4_4_4_4&&(Z=i.RGBA4),F===i.UNSIGNED_SHORT_5_5_5_1&&(Z=i.RGB5_A1)}return(Z===i.R16F||Z===i.R32F||Z===i.RG16F||Z===i.RG32F||Z===i.RGBA16F||Z===i.RGBA32F)&&e.get("EXT_color_buffer_float"),Z}function x(T,v){let F;return T?v===null||v===bi||v===ls?F=i.DEPTH24_STENCIL8:v===Bn?F=i.DEPTH32F_STENCIL8:v===Ys&&(F=i.DEPTH24_STENCIL8,console.warn("DepthTexture: 16 bit depth attachment is not supported with stencil. Using 24-bit attachment.")):v===null||v===bi||v===ls?F=i.DEPTH_COMPONENT24:v===Bn?F=i.DEPTH_COMPONENT32F:v===Ys&&(F=i.DEPTH_COMPONENT16),F}function b(T,v){return m(T)===!0||T.isFramebufferTexture&&T.minFilter!==an&&T.minFilter!==mn?Math.log2(Math.max(v.width,v.height))+1:T.mipmaps!==void 0&&T.mipmaps.length>0?T.mipmaps.length:T.isCompressedTexture&&Array.isArray(T.image)?v.mipmaps.length:1}function D(T){let v=T.target;v.removeEventListener("dispose",D),C(v),v.isVideoTexture&&h.delete(v)}function A(T){let v=T.target;v.removeEventListener("dispose",A),z(v)}function C(T){let v=n.get(T);if(v.__webglInit===void 0)return;let F=T.source,j=d.get(F);if(j){let Q=j[v.__cacheKey];Q.usedTimes--,Q.usedTimes===0&&P(T),Object.keys(j).length===0&&d.delete(F)}n.remove(T)}function P(T){let v=n.get(T);i.deleteTexture(v.__webglTexture);let F=T.source,j=d.get(F);delete j[v.__cacheKey],o.memory.textures--}function z(T){let v=n.get(T);if(T.depthTexture&&T.depthTexture.dispose(),T.isWebGLCubeRenderTarget)for(let j=0;j<6;j++){if(Array.isArray(v.__webglFramebuffer[j]))for(let Q=0;Q<v.__webglFramebuffer[j].length;Q++)i.deleteFramebuffer(v.__webglFramebuffer[j][Q]);else i.deleteFramebuffer(v.__webglFramebuffer[j]);v.__webglDepthbuffer&&i.deleteRenderbuffer(v.__webglDepthbuffer[j])}else{if(Array.isArray(v.__webglFramebuffer))for(let j=0;j<v.__webglFramebuffer.length;j++)i.deleteFramebuffer(v.__webglFramebuffer[j]);else i.deleteFramebuffer(v.__webglFramebuffer);if(v.__webglDepthbuffer&&i.deleteRenderbuffer(v.__webglDepthbuffer),v.__webglMultisampledFramebuffer&&i.deleteFramebuffer(v.__webglMultisampledFramebuffer),v.__webglColorRenderbuffer)for(let j=0;j<v.__webglColorRenderbuffer.length;j++)v.__webglColorRenderbuffer[j]&&i.deleteRenderbuffer(v.__webglColorRenderbuffer[j]);v.__webglDepthRenderbuffer&&i.deleteRenderbuffer(v.__webglDepthRenderbuffer)}let F=T.textures;for(let j=0,Q=F.length;j<Q;j++){let Z=n.get(F[j]);Z.__webglTexture&&(i.deleteTexture(Z.__webglTexture),o.memory.textures--),n.remove(F[j])}n.remove(T)}let _=0;function S(){_=0}function L(){let T=_;return T>=s.maxTextures&&console.warn("THREE.WebGLTextures: Trying to use "+T+" texture units while this GPU supports only "+s.maxTextures),_+=1,T}function N(T){let v=[];return v.push(T.wrapS),v.push(T.wrapT),v.push(T.wrapR||0),v.push(T.magFilter),v.push(T.minFilter),v.push(T.anisotropy),v.push(T.internalFormat),v.push(T.format),v.push(T.type),v.push(T.generateMipmaps),v.push(T.premultiplyAlpha),v.push(T.flipY),v.push(T.unpackAlignment),v.push(T.colorSpace),v.join()}function H(T,v){let F=n.get(T);if(T.isVideoTexture&&me(T),T.isRenderTargetTexture===!1&&T.version>0&&F.__version!==T.version){let j=T.image;if(j===null)console.warn("THREE.WebGLRenderer: Texture marked for update but no image data found.");else if(j.complete===!1)console.warn("THREE.WebGLRenderer: Texture marked for update but image is incomplete");else{nt(F,T,v);return}}t.bindTexture(i.TEXTURE_2D,F.__webglTexture,i.TEXTURE0+v)}function ne(T,v){let F=n.get(T);if(T.version>0&&F.__version!==T.version){nt(F,T,v);return}t.bindTexture(i.TEXTURE_2D_ARRAY,F.__webglTexture,i.TEXTURE0+v)}function V(T,v){let F=n.get(T);if(T.version>0&&F.__version!==T.version){nt(F,T,v);return}t.bindTexture(i.TEXTURE_3D,F.__webglTexture,i.TEXTURE0+v)}function se(T,v){let F=n.get(T);if(T.version>0&&F.__version!==T.version){J(F,T,v);return}t.bindTexture(i.TEXTURE_CUBE_MAP,F.__webglTexture,i.TEXTURE0+v)}let q={[qs]:i.REPEAT,[xi]:i.CLAMP_TO_EDGE,[Sc]:i.MIRRORED_REPEAT},ve={[an]:i.NEAREST,[wp]:i.NEAREST_MIPMAP_NEAREST,[Rr]:i.NEAREST_MIPMAP_LINEAR,[mn]:i.LINEAR,[Pa]:i.LINEAR_MIPMAP_NEAREST,[vi]:i.LINEAR_MIPMAP_LINEAR},be={[Pp]:i.NEVER,[kp]:i.ALWAYS,[Ip]:i.LESS,[zd]:i.LEQUAL,[Lp]:i.EQUAL,[Np]:i.GEQUAL,[Dp]:i.GREATER,[Up]:i.NOTEQUAL};function Me(T,v){if(v.type===Bn&&e.has("OES_texture_float_linear")===!1&&(v.magFilter===mn||v.magFilter===Pa||v.magFilter===Rr||v.magFilter===vi||v.minFilter===mn||v.minFilter===Pa||v.minFilter===Rr||v.minFilter===vi)&&console.warn("THREE.WebGLRenderer: Unable to use linear filtering with floating point textures. OES_texture_float_linear not supported on this device."),i.texParameteri(T,i.TEXTURE_WRAP_S,q[v.wrapS]),i.texParameteri(T,i.TEXTURE_WRAP_T,q[v.wrapT]),(T===i.TEXTURE_3D||T===i.TEXTURE_2D_ARRAY)&&i.texParameteri(T,i.TEXTURE_WRAP_R,q[v.wrapR]),i.texParameteri(T,i.TEXTURE_MAG_FILTER,ve[v.magFilter]),i.texParameteri(T,i.TEXTURE_MIN_FILTER,ve[v.minFilter]),v.compareFunction&&(i.texParameteri(T,i.TEXTURE_COMPARE_MODE,i.COMPARE_REF_TO_TEXTURE),i.texParameteri(T,i.TEXTURE_COMPARE_FUNC,be[v.compareFunction])),e.has("EXT_texture_filter_anisotropic")===!0){if(v.magFilter===an||v.minFilter!==Rr&&v.minFilter!==vi||v.type===Bn&&e.has("OES_texture_float_linear")===!1)return;if(v.anisotropy>1||n.get(v).__currentAnisotropy){let F=e.get("EXT_texture_filter_anisotropic");i.texParameterf(T,F.TEXTURE_MAX_ANISOTROPY_EXT,Math.min(v.anisotropy,s.getMaxAnisotropy())),n.get(v).__currentAnisotropy=v.anisotropy}}}function Ke(T,v){let F=!1;T.__webglInit===void 0&&(T.__webglInit=!0,v.addEventListener("dispose",D));let j=v.source,Q=d.get(j);Q===void 0&&(Q={},d.set(j,Q));let Z=N(v);if(Z!==T.__cacheKey){Q[Z]===void 0&&(Q[Z]={texture:i.createTexture(),usedTimes:0},o.memory.textures++,F=!0),Q[Z].usedTimes++;let Ie=Q[T.__cacheKey];Ie!==void 0&&(Q[T.__cacheKey].usedTimes--,Ie.usedTimes===0&&P(v)),T.__cacheKey=Z,T.__webglTexture=Q[Z].texture}return F}function nt(T,v,F){let j=i.TEXTURE_2D;(v.isDataArrayTexture||v.isCompressedArrayTexture)&&(j=i.TEXTURE_2D_ARRAY),v.isData3DTexture&&(j=i.TEXTURE_3D);let Q=Ke(T,v),Z=v.source;t.bindTexture(j,T.__webglTexture,i.TEXTURE0+F);let Ie=n.get(Z);if(Z.version!==Ie.__version||Q===!0){t.activeTexture(i.TEXTURE0+F);let I=ct.getPrimaries(ct.workingColorSpace),B=v.colorSpace===Qn?null:ct.getPrimaries(v.colorSpace),K=v.colorSpace===Qn||I===B?i.NONE:i.BROWSER_DEFAULT_WEBGL;i.pixelStorei(i.UNPACK_FLIP_Y_WEBGL,v.flipY),i.pixelStorei(i.UNPACK_PREMULTIPLY_ALPHA_WEBGL,v.premultiplyAlpha),i.pixelStorei(i.UNPACK_ALIGNMENT,v.unpackAlignment),i.pixelStorei(i.UNPACK_COLORSPACE_CONVERSION_WEBGL,K);let $=y(v.image,!1,s.maxTextureSize);$=De(v,$);let he=r.convert(v.format,v.colorSpace),Be=r.convert(v.type),He=M(v.internalFormat,he,Be,v.colorSpace,v.isVideoTexture);Me(j,v);let ge,Je=v.mipmaps,Ve=v.isVideoTexture!==!0,it=Ie.__version===void 0||Q===!0,U=Z.dataReady,Ae=b(v,$);if(v.isDepthTexture)He=x(v.format===hs,v.type),it&&(Ve?t.texStorage2D(i.TEXTURE_2D,1,He,$.width,$.height):t.texImage2D(i.TEXTURE_2D,0,He,$.width,$.height,0,he,Be,null));else if(v.isDataTexture)if(Je.length>0){Ve&&it&&t.texStorage2D(i.TEXTURE_2D,Ae,He,Je[0].width,Je[0].height);for(let Y=0,ie=Je.length;Y<ie;Y++)ge=Je[Y],Ve?U&&t.texSubImage2D(i.TEXTURE_2D,Y,0,0,ge.width,ge.height,he,Be,ge.data):t.texImage2D(i.TEXTURE_2D,Y,He,ge.width,ge.height,0,he,Be,ge.data);v.generateMipmaps=!1}else Ve?(it&&t.texStorage2D(i.TEXTURE_2D,Ae,He,$.width,$.height),U&&t.texSubImage2D(i.TEXTURE_2D,0,0,0,$.width,$.height,he,Be,$.data)):t.texImage2D(i.TEXTURE_2D,0,He,$.width,$.height,0,he,Be,$.data);else if(v.isCompressedTexture)if(v.isCompressedArrayTexture){Ve&&it&&t.texStorage3D(i.TEXTURE_2D_ARRAY,Ae,He,Je[0].width,Je[0].height,$.depth);for(let Y=0,ie=Je.length;Y<ie;Y++)if(ge=Je[Y],v.format!==_n)if(he!==null)if(Ve){if(U)if(v.layerUpdates.size>0){let Ee=fd(ge.width,ge.height,v.format,v.type);for(let Ce of v.layerUpdates){let st=ge.data.subarray(Ce*Ee/ge.data.BYTES_PER_ELEMENT,(Ce+1)*Ee/ge.data.BYTES_PER_ELEMENT);t.compressedTexSubImage3D(i.TEXTURE_2D_ARRAY,Y,0,0,Ce,ge.width,ge.height,1,he,st,0,0)}v.clearLayerUpdates()}else t.compressedTexSubImage3D(i.TEXTURE_2D_ARRAY,Y,0,0,0,ge.width,ge.height,$.depth,he,ge.data,0,0)}else t.compressedTexImage3D(i.TEXTURE_2D_ARRAY,Y,He,ge.width,ge.height,$.depth,0,ge.data,0,0);else console.warn("THREE.WebGLRenderer: Attempt to load unsupported compressed texture format in .uploadTexture()");else Ve?U&&t.texSubImage3D(i.TEXTURE_2D_ARRAY,Y,0,0,0,ge.width,ge.height,$.depth,he,Be,ge.data):t.texImage3D(i.TEXTURE_2D_ARRAY,Y,He,ge.width,ge.height,$.depth,0,he,Be,ge.data)}else{Ve&&it&&t.texStorage2D(i.TEXTURE_2D,Ae,He,Je[0].width,Je[0].height);for(let Y=0,ie=Je.length;Y<ie;Y++)ge=Je[Y],v.format!==_n?he!==null?Ve?U&&t.compressedTexSubImage2D(i.TEXTURE_2D,Y,0,0,ge.width,ge.height,he,ge.data):t.compressedTexImage2D(i.TEXTURE_2D,Y,He,ge.width,ge.height,0,ge.data):console.warn("THREE.WebGLRenderer: Attempt to load unsupported compressed texture format in .uploadTexture()"):Ve?U&&t.texSubImage2D(i.TEXTURE_2D,Y,0,0,ge.width,ge.height,he,Be,ge.data):t.texImage2D(i.TEXTURE_2D,Y,He,ge.width,ge.height,0,he,Be,ge.data)}else if(v.isDataArrayTexture)if(Ve){if(it&&t.texStorage3D(i.TEXTURE_2D_ARRAY,Ae,He,$.width,$.height,$.depth),U)if(v.layerUpdates.size>0){let Y=fd($.width,$.height,v.format,v.type);for(let ie of v.layerUpdates){let Ee=$.data.subarray(ie*Y/$.data.BYTES_PER_ELEMENT,(ie+1)*Y/$.data.BYTES_PER_ELEMENT);t.texSubImage3D(i.TEXTURE_2D_ARRAY,0,0,0,ie,$.width,$.height,1,he,Be,Ee)}v.clearLayerUpdates()}else t.texSubImage3D(i.TEXTURE_2D_ARRAY,0,0,0,0,$.width,$.height,$.depth,he,Be,$.data)}else t.texImage3D(i.TEXTURE_2D_ARRAY,0,He,$.width,$.height,$.depth,0,he,Be,$.data);else if(v.isData3DTexture)Ve?(it&&t.texStorage3D(i.TEXTURE_3D,Ae,He,$.width,$.height,$.depth),U&&t.texSubImage3D(i.TEXTURE_3D,0,0,0,0,$.width,$.height,$.depth,he,Be,$.data)):t.texImage3D(i.TEXTURE_3D,0,He,$.width,$.height,$.depth,0,he,Be,$.data);else if(v.isFramebufferTexture){if(it)if(Ve)t.texStorage2D(i.TEXTURE_2D,Ae,He,$.width,$.height);else{let Y=$.width,ie=$.height;for(let Ee=0;Ee<Ae;Ee++)t.texImage2D(i.TEXTURE_2D,Ee,He,Y,ie,0,he,Be,null),Y>>=1,ie>>=1}}else if(Je.length>0){if(Ve&&it){let Y=Se(Je[0]);t.texStorage2D(i.TEXTURE_2D,Ae,He,Y.width,Y.height)}for(let Y=0,ie=Je.length;Y<ie;Y++)ge=Je[Y],Ve?U&&t.texSubImage2D(i.TEXTURE_2D,Y,0,0,he,Be,ge):t.texImage2D(i.TEXTURE_2D,Y,He,he,Be,ge);v.generateMipmaps=!1}else if(Ve){if(it){let Y=Se($);t.texStorage2D(i.TEXTURE_2D,Ae,He,Y.width,Y.height)}U&&t.texSubImage2D(i.TEXTURE_2D,0,0,0,he,Be,$)}else t.texImage2D(i.TEXTURE_2D,0,He,he,Be,$);m(v)&&p(j),Ie.__version=Z.version,v.onUpdate&&v.onUpdate(v)}T.__version=v.version}function J(T,v,F){if(v.image.length!==6)return;let j=Ke(T,v),Q=v.source;t.bindTexture(i.TEXTURE_CUBE_MAP,T.__webglTexture,i.TEXTURE0+F);let Z=n.get(Q);if(Q.version!==Z.__version||j===!0){t.activeTexture(i.TEXTURE0+F);let Ie=ct.getPrimaries(ct.workingColorSpace),I=v.colorSpace===Qn?null:ct.getPrimaries(v.colorSpace),B=v.colorSpace===Qn||Ie===I?i.NONE:i.BROWSER_DEFAULT_WEBGL;i.pixelStorei(i.UNPACK_FLIP_Y_WEBGL,v.flipY),i.pixelStorei(i.UNPACK_PREMULTIPLY_ALPHA_WEBGL,v.premultiplyAlpha),i.pixelStorei(i.UNPACK_ALIGNMENT,v.unpackAlignment),i.pixelStorei(i.UNPACK_COLORSPACE_CONVERSION_WEBGL,B);let K=v.isCompressedTexture||v.image[0].isCompressedTexture,$=v.image[0]&&v.image[0].isDataTexture,he=[];for(let ie=0;ie<6;ie++)!K&&!$?he[ie]=y(v.image[ie],!0,s.maxCubemapSize):he[ie]=$?v.image[ie].image:v.image[ie],he[ie]=De(v,he[ie]);let Be=he[0],He=r.convert(v.format,v.colorSpace),ge=r.convert(v.type),Je=M(v.internalFormat,He,ge,v.colorSpace),Ve=v.isVideoTexture!==!0,it=Z.__version===void 0||j===!0,U=Q.dataReady,Ae=b(v,Be);Me(i.TEXTURE_CUBE_MAP,v);let Y;if(K){Ve&&it&&t.texStorage2D(i.TEXTURE_CUBE_MAP,Ae,Je,Be.width,Be.height);for(let ie=0;ie<6;ie++){Y=he[ie].mipmaps;for(let Ee=0;Ee<Y.length;Ee++){let Ce=Y[Ee];v.format!==_n?He!==null?Ve?U&&t.compressedTexSubImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+ie,Ee,0,0,Ce.width,Ce.height,He,Ce.data):t.compressedTexImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+ie,Ee,Je,Ce.width,Ce.height,0,Ce.data):console.warn("THREE.WebGLRenderer: Attempt to load unsupported compressed texture format in .setTextureCube()"):Ve?U&&t.texSubImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+ie,Ee,0,0,Ce.width,Ce.height,He,ge,Ce.data):t.texImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+ie,Ee,Je,Ce.width,Ce.height,0,He,ge,Ce.data)}}}else{if(Y=v.mipmaps,Ve&&it){Y.length>0&&Ae++;let ie=Se(he[0]);t.texStorage2D(i.TEXTURE_CUBE_MAP,Ae,Je,ie.width,ie.height)}for(let ie=0;ie<6;ie++)if($){Ve?U&&t.texSubImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+ie,0,0,0,he[ie].width,he[ie].height,He,ge,he[ie].data):t.texImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+ie,0,Je,he[ie].width,he[ie].height,0,He,ge,he[ie].data);for(let Ee=0;Ee<Y.length;Ee++){let st=Y[Ee].image[ie].image;Ve?U&&t.texSubImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+ie,Ee+1,0,0,st.width,st.height,He,ge,st.data):t.texImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+ie,Ee+1,Je,st.width,st.height,0,He,ge,st.data)}}else{Ve?U&&t.texSubImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+ie,0,0,0,He,ge,he[ie]):t.texImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+ie,0,Je,He,ge,he[ie]);for(let Ee=0;Ee<Y.length;Ee++){let Ce=Y[Ee];Ve?U&&t.texSubImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+ie,Ee+1,0,0,He,ge,Ce.image[ie]):t.texImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+ie,Ee+1,Je,He,ge,Ce.image[ie])}}}m(v)&&p(i.TEXTURE_CUBE_MAP),Z.__version=Q.version,v.onUpdate&&v.onUpdate(v)}T.__version=v.version}function ae(T,v,F,j,Q,Z){let Ie=r.convert(F.format,F.colorSpace),I=r.convert(F.type),B=M(F.internalFormat,Ie,I,F.colorSpace);if(!n.get(v).__hasExternalTextures){let $=Math.max(1,v.width>>Z),he=Math.max(1,v.height>>Z);Q===i.TEXTURE_3D||Q===i.TEXTURE_2D_ARRAY?t.texImage3D(Q,Z,B,$,he,v.depth,0,Ie,I,null):t.texImage2D(Q,Z,B,$,he,0,Ie,I,null)}t.bindFramebuffer(i.FRAMEBUFFER,T),ce(v)?a.framebufferTexture2DMultisampleEXT(i.FRAMEBUFFER,j,Q,n.get(F).__webglTexture,0,fe(v)):(Q===i.TEXTURE_2D||Q>=i.TEXTURE_CUBE_MAP_POSITIVE_X&&Q<=i.TEXTURE_CUBE_MAP_NEGATIVE_Z)&&i.framebufferTexture2D(i.FRAMEBUFFER,j,Q,n.get(F).__webglTexture,Z),t.bindFramebuffer(i.FRAMEBUFFER,null)}function we(T,v,F){if(i.bindRenderbuffer(i.RENDERBUFFER,T),v.depthBuffer){let j=v.depthTexture,Q=j&&j.isDepthTexture?j.type:null,Z=x(v.stencilBuffer,Q),Ie=v.stencilBuffer?i.DEPTH_STENCIL_ATTACHMENT:i.DEPTH_ATTACHMENT,I=fe(v);ce(v)?a.renderbufferStorageMultisampleEXT(i.RENDERBUFFER,I,Z,v.width,v.height):F?i.renderbufferStorageMultisample(i.RENDERBUFFER,I,Z,v.width,v.height):i.renderbufferStorage(i.RENDERBUFFER,Z,v.width,v.height),i.framebufferRenderbuffer(i.FRAMEBUFFER,Ie,i.RENDERBUFFER,T)}else{let j=v.textures;for(let Q=0;Q<j.length;Q++){let Z=j[Q],Ie=r.convert(Z.format,Z.colorSpace),I=r.convert(Z.type),B=M(Z.internalFormat,Ie,I,Z.colorSpace),K=fe(v);F&&ce(v)===!1?i.renderbufferStorageMultisample(i.RENDERBUFFER,K,B,v.width,v.height):ce(v)?a.renderbufferStorageMultisampleEXT(i.RENDERBUFFER,K,B,v.width,v.height):i.renderbufferStorage(i.RENDERBUFFER,B,v.width,v.height)}}i.bindRenderbuffer(i.RENDERBUFFER,null)}function X(T,v){if(v&&v.isWebGLCubeRenderTarget)throw new Error("Depth Texture with cube render targets is not supported");if(t.bindFramebuffer(i.FRAMEBUFFER,T),!(v.depthTexture&&v.depthTexture.isDepthTexture))throw new Error("renderTarget.depthTexture must be an instance of THREE.DepthTexture");(!n.get(v.depthTexture).__webglTexture||v.depthTexture.image.width!==v.width||v.depthTexture.image.height!==v.height)&&(v.depthTexture.image.width=v.width,v.depthTexture.image.height=v.height,v.depthTexture.needsUpdate=!0),H(v.depthTexture,0);let j=n.get(v.depthTexture).__webglTexture,Q=fe(v);if(v.depthTexture.format===is)ce(v)?a.framebufferTexture2DMultisampleEXT(i.FRAMEBUFFER,i.DEPTH_ATTACHMENT,i.TEXTURE_2D,j,0,Q):i.framebufferTexture2D(i.FRAMEBUFFER,i.DEPTH_ATTACHMENT,i.TEXTURE_2D,j,0);else if(v.depthTexture.format===hs)ce(v)?a.framebufferTexture2DMultisampleEXT(i.FRAMEBUFFER,i.DEPTH_STENCIL_ATTACHMENT,i.TEXTURE_2D,j,0,Q):i.framebufferTexture2D(i.FRAMEBUFFER,i.DEPTH_STENCIL_ATTACHMENT,i.TEXTURE_2D,j,0);else throw new Error("Unknown depthTexture format")}function xe(T){let v=n.get(T),F=T.isWebGLCubeRenderTarget===!0;if(v.__boundDepthTexture!==T.depthTexture){let j=T.depthTexture;if(v.__depthDisposeCallback&&v.__depthDisposeCallback(),j){let Q=()=>{delete v.__boundDepthTexture,delete v.__depthDisposeCallback,j.removeEventListener("dispose",Q)};j.addEventListener("dispose",Q),v.__depthDisposeCallback=Q}v.__boundDepthTexture=j}if(T.depthTexture&&!v.__autoAllocateDepthBuffer){if(F)throw new Error("target.depthTexture not supported in Cube render targets");X(v.__webglFramebuffer,T)}else if(F){v.__webglDepthbuffer=[];for(let j=0;j<6;j++)if(t.bindFramebuffer(i.FRAMEBUFFER,v.__webglFramebuffer[j]),v.__webglDepthbuffer[j]===void 0)v.__webglDepthbuffer[j]=i.createRenderbuffer(),we(v.__webglDepthbuffer[j],T,!1);else{let Q=T.stencilBuffer?i.DEPTH_STENCIL_ATTACHMENT:i.DEPTH_ATTACHMENT,Z=v.__webglDepthbuffer[j];i.bindRenderbuffer(i.RENDERBUFFER,Z),i.framebufferRenderbuffer(i.FRAMEBUFFER,Q,i.RENDERBUFFER,Z)}}else if(t.bindFramebuffer(i.FRAMEBUFFER,v.__webglFramebuffer),v.__webglDepthbuffer===void 0)v.__webglDepthbuffer=i.createRenderbuffer(),we(v.__webglDepthbuffer,T,!1);else{let j=T.stencilBuffer?i.DEPTH_STENCIL_ATTACHMENT:i.DEPTH_ATTACHMENT,Q=v.__webglDepthbuffer;i.bindRenderbuffer(i.RENDERBUFFER,Q),i.framebufferRenderbuffer(i.FRAMEBUFFER,j,i.RENDERBUFFER,Q)}t.bindFramebuffer(i.FRAMEBUFFER,null)}function Oe(T,v,F){let j=n.get(T);v!==void 0&&ae(j.__webglFramebuffer,T,T.texture,i.COLOR_ATTACHMENT0,i.TEXTURE_2D,0),F!==void 0&&xe(T)}function Ne(T){let v=T.texture,F=n.get(T),j=n.get(v);T.addEventListener("dispose",A);let Q=T.textures,Z=T.isWebGLCubeRenderTarget===!0,Ie=Q.length>1;if(Ie||(j.__webglTexture===void 0&&(j.__webglTexture=i.createTexture()),j.__version=v.version,o.memory.textures++),Z){F.__webglFramebuffer=[];for(let I=0;I<6;I++)if(v.mipmaps&&v.mipmaps.length>0){F.__webglFramebuffer[I]=[];for(let B=0;B<v.mipmaps.length;B++)F.__webglFramebuffer[I][B]=i.createFramebuffer()}else F.__webglFramebuffer[I]=i.createFramebuffer()}else{if(v.mipmaps&&v.mipmaps.length>0){F.__webglFramebuffer=[];for(let I=0;I<v.mipmaps.length;I++)F.__webglFramebuffer[I]=i.createFramebuffer()}else F.__webglFramebuffer=i.createFramebuffer();if(Ie)for(let I=0,B=Q.length;I<B;I++){let K=n.get(Q[I]);K.__webglTexture===void 0&&(K.__webglTexture=i.createTexture(),o.memory.textures++)}if(T.samples>0&&ce(T)===!1){F.__webglMultisampledFramebuffer=i.createFramebuffer(),F.__webglColorRenderbuffer=[],t.bindFramebuffer(i.FRAMEBUFFER,F.__webglMultisampledFramebuffer);for(let I=0;I<Q.length;I++){let B=Q[I];F.__webglColorRenderbuffer[I]=i.createRenderbuffer(),i.bindRenderbuffer(i.RENDERBUFFER,F.__webglColorRenderbuffer[I]);let K=r.convert(B.format,B.colorSpace),$=r.convert(B.type),he=M(B.internalFormat,K,$,B.colorSpace,T.isXRRenderTarget===!0),Be=fe(T);i.renderbufferStorageMultisample(i.RENDERBUFFER,Be,he,T.width,T.height),i.framebufferRenderbuffer(i.FRAMEBUFFER,i.COLOR_ATTACHMENT0+I,i.RENDERBUFFER,F.__webglColorRenderbuffer[I])}i.bindRenderbuffer(i.RENDERBUFFER,null),T.depthBuffer&&(F.__webglDepthRenderbuffer=i.createRenderbuffer(),we(F.__webglDepthRenderbuffer,T,!0)),t.bindFramebuffer(i.FRAMEBUFFER,null)}}if(Z){t.bindTexture(i.TEXTURE_CUBE_MAP,j.__webglTexture),Me(i.TEXTURE_CUBE_MAP,v);for(let I=0;I<6;I++)if(v.mipmaps&&v.mipmaps.length>0)for(let B=0;B<v.mipmaps.length;B++)ae(F.__webglFramebuffer[I][B],T,v,i.COLOR_ATTACHMENT0,i.TEXTURE_CUBE_MAP_POSITIVE_X+I,B);else ae(F.__webglFramebuffer[I],T,v,i.COLOR_ATTACHMENT0,i.TEXTURE_CUBE_MAP_POSITIVE_X+I,0);m(v)&&p(i.TEXTURE_CUBE_MAP),t.unbindTexture()}else if(Ie){for(let I=0,B=Q.length;I<B;I++){let K=Q[I],$=n.get(K);t.bindTexture(i.TEXTURE_2D,$.__webglTexture),Me(i.TEXTURE_2D,K),ae(F.__webglFramebuffer,T,K,i.COLOR_ATTACHMENT0+I,i.TEXTURE_2D,0),m(K)&&p(i.TEXTURE_2D)}t.unbindTexture()}else{let I=i.TEXTURE_2D;if((T.isWebGL3DRenderTarget||T.isWebGLArrayRenderTarget)&&(I=T.isWebGL3DRenderTarget?i.TEXTURE_3D:i.TEXTURE_2D_ARRAY),t.bindTexture(I,j.__webglTexture),Me(I,v),v.mipmaps&&v.mipmaps.length>0)for(let B=0;B<v.mipmaps.length;B++)ae(F.__webglFramebuffer[B],T,v,i.COLOR_ATTACHMENT0,I,B);else ae(F.__webglFramebuffer,T,v,i.COLOR_ATTACHMENT0,I,0);m(v)&&p(I),t.unbindTexture()}T.depthBuffer&&xe(T)}function $e(T){let v=T.textures;for(let F=0,j=v.length;F<j;F++){let Q=v[F];if(m(Q)){let Z=T.isWebGLCubeRenderTarget?i.TEXTURE_CUBE_MAP:i.TEXTURE_2D,Ie=n.get(Q).__webglTexture;t.bindTexture(Z,Ie),p(Z),t.unbindTexture()}}}let ee=[],w=[];function pe(T){if(T.samples>0){if(ce(T)===!1){let v=T.textures,F=T.width,j=T.height,Q=i.COLOR_BUFFER_BIT,Z=T.stencilBuffer?i.DEPTH_STENCIL_ATTACHMENT:i.DEPTH_ATTACHMENT,Ie=n.get(T),I=v.length>1;if(I)for(let B=0;B<v.length;B++)t.bindFramebuffer(i.FRAMEBUFFER,Ie.__webglMultisampledFramebuffer),i.framebufferRenderbuffer(i.FRAMEBUFFER,i.COLOR_ATTACHMENT0+B,i.RENDERBUFFER,null),t.bindFramebuffer(i.FRAMEBUFFER,Ie.__webglFramebuffer),i.framebufferTexture2D(i.DRAW_FRAMEBUFFER,i.COLOR_ATTACHMENT0+B,i.TEXTURE_2D,null,0);t.bindFramebuffer(i.READ_FRAMEBUFFER,Ie.__webglMultisampledFramebuffer),t.bindFramebuffer(i.DRAW_FRAMEBUFFER,Ie.__webglFramebuffer);for(let B=0;B<v.length;B++){if(T.resolveDepthBuffer&&(T.depthBuffer&&(Q|=i.DEPTH_BUFFER_BIT),T.stencilBuffer&&T.resolveStencilBuffer&&(Q|=i.STENCIL_BUFFER_BIT)),I){i.framebufferRenderbuffer(i.READ_FRAMEBUFFER,i.COLOR_ATTACHMENT0,i.RENDERBUFFER,Ie.__webglColorRenderbuffer[B]);let K=n.get(v[B]).__webglTexture;i.framebufferTexture2D(i.DRAW_FRAMEBUFFER,i.COLOR_ATTACHMENT0,i.TEXTURE_2D,K,0)}i.blitFramebuffer(0,0,F,j,0,0,F,j,Q,i.NEAREST),c===!0&&(ee.length=0,w.length=0,ee.push(i.COLOR_ATTACHMENT0+B),T.depthBuffer&&T.resolveDepthBuffer===!1&&(ee.push(Z),w.push(Z),i.invalidateFramebuffer(i.DRAW_FRAMEBUFFER,w)),i.invalidateFramebuffer(i.READ_FRAMEBUFFER,ee))}if(t.bindFramebuffer(i.READ_FRAMEBUFFER,null),t.bindFramebuffer(i.DRAW_FRAMEBUFFER,null),I)for(let B=0;B<v.length;B++){t.bindFramebuffer(i.FRAMEBUFFER,Ie.__webglMultisampledFramebuffer),i.framebufferRenderbuffer(i.FRAMEBUFFER,i.COLOR_ATTACHMENT0+B,i.RENDERBUFFER,Ie.__webglColorRenderbuffer[B]);let K=n.get(v[B]).__webglTexture;t.bindFramebuffer(i.FRAMEBUFFER,Ie.__webglFramebuffer),i.framebufferTexture2D(i.DRAW_FRAMEBUFFER,i.COLOR_ATTACHMENT0+B,i.TEXTURE_2D,K,0)}t.bindFramebuffer(i.DRAW_FRAMEBUFFER,Ie.__webglMultisampledFramebuffer)}else if(T.depthBuffer&&T.resolveDepthBuffer===!1&&c){let v=T.stencilBuffer?i.DEPTH_STENCIL_ATTACHMENT:i.DEPTH_ATTACHMENT;i.invalidateFramebuffer(i.DRAW_FRAMEBUFFER,[v])}}}function fe(T){return Math.min(s.maxSamples,T.samples)}function ce(T){let v=n.get(T);return T.samples>0&&e.has("WEBGL_multisampled_render_to_texture")===!0&&v.__useRenderToTexture!==!1}function me(T){let v=o.render.frame;h.get(T)!==v&&(h.set(T,v),T.update())}function De(T,v){let F=T.colorSpace,j=T.format,Q=T.type;return T.isCompressedTexture===!0||T.isVideoTexture===!0||F!==ri&&F!==Qn&&(ct.getTransfer(F)===gt?(j!==_n||Q!==Hn)&&console.warn("THREE.WebGLTextures: sRGB encoded textures have to use RGBAFormat and UnsignedByteType."):console.error("THREE.WebGLTextures: Unsupported texture color space:",F)),v}function Se(T){return typeof HTMLImageElement!="undefined"&&T instanceof HTMLImageElement?(l.width=T.naturalWidth||T.width,l.height=T.naturalHeight||T.height):typeof VideoFrame!="undefined"&&T instanceof VideoFrame?(l.width=T.displayWidth,l.height=T.displayHeight):(l.width=T.width,l.height=T.height),l}this.allocateTextureUnit=L,this.resetTextureUnits=S,this.setTexture2D=H,this.setTexture2DArray=ne,this.setTexture3D=V,this.setTextureCube=se,this.rebindTextures=Oe,this.setupRenderTarget=Ne,this.updateRenderTargetMipmap=$e,this.updateMultisampleRenderTarget=pe,this.setupDepthRenderbuffer=xe,this.setupFrameBufferTexture=ae,this.useMultisampledRTT=ce}function Gy(i,e){function t(n,s=Qn){let r,o=ct.getTransfer(s);if(n===Hn)return i.UNSIGNED_BYTE;if(n===Vl)return i.UNSIGNED_SHORT_4_4_4_4;if(n===Gl)return i.UNSIGNED_SHORT_5_5_5_1;if(n===Id)return i.UNSIGNED_INT_5_9_9_9_REV;if(n===Rd)return i.BYTE;if(n===Pd)return i.SHORT;if(n===Ys)return i.UNSIGNED_SHORT;if(n===Hl)return i.INT;if(n===bi)return i.UNSIGNED_INT;if(n===Bn)return i.FLOAT;if(n===ar)return i.HALF_FLOAT;if(n===Ld)return i.ALPHA;if(n===Dd)return i.RGB;if(n===_n)return i.RGBA;if(n===Ud)return i.LUMINANCE;if(n===Nd)return i.LUMINANCE_ALPHA;if(n===is)return i.DEPTH_COMPONENT;if(n===hs)return i.DEPTH_STENCIL;if(n===kd)return i.RED;if(n===Wl)return i.RED_INTEGER;if(n===Od)return i.RG;if(n===Xl)return i.RG_INTEGER;if(n===ql)return i.RGBA_INTEGER;if(n===ro||n===oo||n===ao||n===co)if(o===gt)if(r=e.get("WEBGL_compressed_texture_s3tc_srgb"),r!==null){if(n===ro)return r.COMPRESSED_SRGB_S3TC_DXT1_EXT;if(n===oo)return r.COMPRESSED_SRGB_ALPHA_S3TC_DXT1_EXT;if(n===ao)return r.COMPRESSED_SRGB_ALPHA_S3TC_DXT3_EXT;if(n===co)return r.COMPRESSED_SRGB_ALPHA_S3TC_DXT5_EXT}else return null;else if(r=e.get("WEBGL_compressed_texture_s3tc"),r!==null){if(n===ro)return r.COMPRESSED_RGB_S3TC_DXT1_EXT;if(n===oo)return r.COMPRESSED_RGBA_S3TC_DXT1_EXT;if(n===ao)return r.COMPRESSED_RGBA_S3TC_DXT3_EXT;if(n===co)return r.COMPRESSED_RGBA_S3TC_DXT5_EXT}else return null;if(n===Ec||n===Tc||n===wc||n===Ac)if(r=e.get("WEBGL_compressed_texture_pvrtc"),r!==null){if(n===Ec)return r.COMPRESSED_RGB_PVRTC_4BPPV1_IMG;if(n===Tc)return r.COMPRESSED_RGB_PVRTC_2BPPV1_IMG;if(n===wc)return r.COMPRESSED_RGBA_PVRTC_4BPPV1_IMG;if(n===Ac)return r.COMPRESSED_RGBA_PVRTC_2BPPV1_IMG}else return null;if(n===Cc||n===Rc||n===Pc)if(r=e.get("WEBGL_compressed_texture_etc"),r!==null){if(n===Cc||n===Rc)return o===gt?r.COMPRESSED_SRGB8_ETC2:r.COMPRESSED_RGB8_ETC2;if(n===Pc)return o===gt?r.COMPRESSED_SRGB8_ALPHA8_ETC2_EAC:r.COMPRESSED_RGBA8_ETC2_EAC}else return null;if(n===Ic||n===Lc||n===Dc||n===Uc||n===Nc||n===kc||n===Oc||n===Fc||n===Bc||n===zc||n===Hc||n===Vc||n===Gc||n===Wc)if(r=e.get("WEBGL_compressed_texture_astc"),r!==null){if(n===Ic)return o===gt?r.COMPRESSED_SRGB8_ALPHA8_ASTC_4x4_KHR:r.COMPRESSED_RGBA_ASTC_4x4_KHR;if(n===Lc)return o===gt?r.COMPRESSED_SRGB8_ALPHA8_ASTC_5x4_KHR:r.COMPRESSED_RGBA_ASTC_5x4_KHR;if(n===Dc)return o===gt?r.COMPRESSED_SRGB8_ALPHA8_ASTC_5x5_KHR:r.COMPRESSED_RGBA_ASTC_5x5_KHR;if(n===Uc)return o===gt?r.COMPRESSED_SRGB8_ALPHA8_ASTC_6x5_KHR:r.COMPRESSED_RGBA_ASTC_6x5_KHR;if(n===Nc)return o===gt?r.COMPRESSED_SRGB8_ALPHA8_ASTC_6x6_KHR:r.COMPRESSED_RGBA_ASTC_6x6_KHR;if(n===kc)return o===gt?r.COMPRESSED_SRGB8_ALPHA8_ASTC_8x5_KHR:r.COMPRESSED_RGBA_ASTC_8x5_KHR;if(n===Oc)return o===gt?r.COMPRESSED_SRGB8_ALPHA8_ASTC_8x6_KHR:r.COMPRESSED_RGBA_ASTC_8x6_KHR;if(n===Fc)return o===gt?r.COMPRESSED_SRGB8_ALPHA8_ASTC_8x8_KHR:r.COMPRESSED_RGBA_ASTC_8x8_KHR;if(n===Bc)return o===gt?r.COMPRESSED_SRGB8_ALPHA8_ASTC_10x5_KHR:r.COMPRESSED_RGBA_ASTC_10x5_KHR;if(n===zc)return o===gt?r.COMPRESSED_SRGB8_ALPHA8_ASTC_10x6_KHR:r.COMPRESSED_RGBA_ASTC_10x6_KHR;if(n===Hc)return o===gt?r.COMPRESSED_SRGB8_ALPHA8_ASTC_10x8_KHR:r.COMPRESSED_RGBA_ASTC_10x8_KHR;if(n===Vc)return o===gt?r.COMPRESSED_SRGB8_ALPHA8_ASTC_10x10_KHR:r.COMPRESSED_RGBA_ASTC_10x10_KHR;if(n===Gc)return o===gt?r.COMPRESSED_SRGB8_ALPHA8_ASTC_12x10_KHR:r.COMPRESSED_RGBA_ASTC_12x10_KHR;if(n===Wc)return o===gt?r.COMPRESSED_SRGB8_ALPHA8_ASTC_12x12_KHR:r.COMPRESSED_RGBA_ASTC_12x12_KHR}else return null;if(n===lo||n===Xc||n===qc)if(r=e.get("EXT_texture_compression_bptc"),r!==null){if(n===lo)return o===gt?r.COMPRESSED_SRGB_ALPHA_BPTC_UNORM_EXT:r.COMPRESSED_RGBA_BPTC_UNORM_EXT;if(n===Xc)return r.COMPRESSED_RGB_BPTC_SIGNED_FLOAT_EXT;if(n===qc)return r.COMPRESSED_RGB_BPTC_UNSIGNED_FLOAT_EXT}else return null;if(n===Fd||n===Yc||n===$c||n===Jc)if(r=e.get("EXT_texture_compression_rgtc"),r!==null){if(n===lo)return r.COMPRESSED_RED_RGTC1_EXT;if(n===Yc)return r.COMPRESSED_SIGNED_RED_RGTC1_EXT;if(n===$c)return r.COMPRESSED_RED_GREEN_RGTC2_EXT;if(n===Jc)return r.COMPRESSED_SIGNED_RED_GREEN_RGTC2_EXT}else return null;return n===ls?i.UNSIGNED_INT_24_8:i[n]!==void 0?i[n]:null}return{convert:t}}var ul=class extends Ut{constructor(e=[]){super(),this.isArrayCamera=!0,this.cameras=e}},qe=class extends Nt{constructor(){super(),this.isGroup=!0,this.type="Group"}},Wy={type:"move"},Vs=class{constructor(){this._targetRay=null,this._grip=null,this._hand=null}getHandSpace(){return this._hand===null&&(this._hand=new qe,this._hand.matrixAutoUpdate=!1,this._hand.visible=!1,this._hand.joints={},this._hand.inputState={pinching:!1}),this._hand}getTargetRaySpace(){return this._targetRay===null&&(this._targetRay=new qe,this._targetRay.matrixAutoUpdate=!1,this._targetRay.visible=!1,this._targetRay.hasLinearVelocity=!1,this._targetRay.linearVelocity=new R,this._targetRay.hasAngularVelocity=!1,this._targetRay.angularVelocity=new R),this._targetRay}getGripSpace(){return this._grip===null&&(this._grip=new qe,this._grip.matrixAutoUpdate=!1,this._grip.visible=!1,this._grip.hasLinearVelocity=!1,this._grip.linearVelocity=new R,this._grip.hasAngularVelocity=!1,this._grip.angularVelocity=new R),this._grip}dispatchEvent(e){return this._targetRay!==null&&this._targetRay.dispatchEvent(e),this._grip!==null&&this._grip.dispatchEvent(e),this._hand!==null&&this._hand.dispatchEvent(e),this}connect(e){if(e&&e.hand){let t=this._hand;if(t)for(let n of e.hand.values())this._getHandJoint(t,n)}return this.dispatchEvent({type:"connected",data:e}),this}disconnect(e){return this.dispatchEvent({type:"disconnected",data:e}),this._targetRay!==null&&(this._targetRay.visible=!1),this._grip!==null&&(this._grip.visible=!1),this._hand!==null&&(this._hand.visible=!1),this}update(e,t,n){let s=null,r=null,o=null,a=this._targetRay,c=this._grip,l=this._hand;if(e&&t.session.visibilityState!=="visible-blurred"){if(l&&e.hand){o=!0;for(let y of e.hand.values()){let m=t.getJointPose(y,n),p=this._getHandJoint(l,y);m!==null&&(p.matrix.fromArray(m.transform.matrix),p.matrix.decompose(p.position,p.rotation,p.scale),p.matrixWorldNeedsUpdate=!0,p.jointRadius=m.radius),p.visible=m!==null}let h=l.joints["index-finger-tip"],u=l.joints["thumb-tip"],d=h.position.distanceTo(u.position),f=.02,g=.005;l.inputState.pinching&&d>f+g?(l.inputState.pinching=!1,this.dispatchEvent({type:"pinchend",handedness:e.handedness,target:this})):!l.inputState.pinching&&d<=f-g&&(l.inputState.pinching=!0,this.dispatchEvent({type:"pinchstart",handedness:e.handedness,target:this}))}else c!==null&&e.gripSpace&&(r=t.getPose(e.gripSpace,n),r!==null&&(c.matrix.fromArray(r.transform.matrix),c.matrix.decompose(c.position,c.rotation,c.scale),c.matrixWorldNeedsUpdate=!0,r.linearVelocity?(c.hasLinearVelocity=!0,c.linearVelocity.copy(r.linearVelocity)):c.hasLinearVelocity=!1,r.angularVelocity?(c.hasAngularVelocity=!0,c.angularVelocity.copy(r.angularVelocity)):c.hasAngularVelocity=!1));a!==null&&(s=t.getPose(e.targetRaySpace,n),s===null&&r!==null&&(s=r),s!==null&&(a.matrix.fromArray(s.transform.matrix),a.matrix.decompose(a.position,a.rotation,a.scale),a.matrixWorldNeedsUpdate=!0,s.linearVelocity?(a.hasLinearVelocity=!0,a.linearVelocity.copy(s.linearVelocity)):a.hasLinearVelocity=!1,s.angularVelocity?(a.hasAngularVelocity=!0,a.angularVelocity.copy(s.angularVelocity)):a.hasAngularVelocity=!1,this.dispatchEvent(Wy)))}return a!==null&&(a.visible=s!==null),c!==null&&(c.visible=r!==null),l!==null&&(l.visible=o!==null),this}_getHandJoint(e,t){if(e.joints[t.jointName]===void 0){let n=new qe;n.matrixAutoUpdate=!1,n.visible=!1,e.joints[t.jointName]=n,e.add(n)}return e.joints[t.jointName]}},Xy=`
void main() {

	gl_Position = vec4( position, 1.0 );

}`,qy=`
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

}`,dl=class{constructor(){this.texture=null,this.mesh=null,this.depthNear=0,this.depthFar=0}init(e,t,n){if(this.texture===null){let s=new nn,r=e.properties.get(s);r.__webglTexture=t.texture,(t.depthNear!=n.depthNear||t.depthFar!=n.depthFar)&&(this.depthNear=t.depthNear,this.depthFar=t.depthFar),this.texture=s}}getMesh(e){if(this.texture!==null&&this.mesh===null){let t=e.cameras[0].viewport,n=new cn({vertexShader:Xy,fragmentShader:qy,uniforms:{depthColor:{value:this.texture},depthWidth:{value:t.z},depthHeight:{value:t.w}}});this.mesh=new tt(new ln(20,20),n)}return this.mesh}reset(){this.texture=null,this.mesh=null}getDepthTexture(){return this.texture}},fl=class extends ii{constructor(e,t){super();let n=this,s=null,r=1,o=null,a="local-floor",c=1,l=null,h=null,u=null,d=null,f=null,g=null,y=new dl,m=t.getContextAttributes(),p=null,M=null,x=[],b=[],D=new le,A=null,C=new Ut;C.layers.enable(1),C.viewport=new ft;let P=new Ut;P.layers.enable(2),P.viewport=new ft;let z=[C,P],_=new ul;_.layers.enable(1),_.layers.enable(2);let S=null,L=null;this.cameraAutoUpdate=!0,this.enabled=!1,this.isPresenting=!1,this.getController=function(J){let ae=x[J];return ae===void 0&&(ae=new Vs,x[J]=ae),ae.getTargetRaySpace()},this.getControllerGrip=function(J){let ae=x[J];return ae===void 0&&(ae=new Vs,x[J]=ae),ae.getGripSpace()},this.getHand=function(J){let ae=x[J];return ae===void 0&&(ae=new Vs,x[J]=ae),ae.getHandSpace()};function N(J){let ae=b.indexOf(J.inputSource);if(ae===-1)return;let we=x[ae];we!==void 0&&(we.update(J.inputSource,J.frame,l||o),we.dispatchEvent({type:J.type,data:J.inputSource}))}function H(){s.removeEventListener("select",N),s.removeEventListener("selectstart",N),s.removeEventListener("selectend",N),s.removeEventListener("squeeze",N),s.removeEventListener("squeezestart",N),s.removeEventListener("squeezeend",N),s.removeEventListener("end",H),s.removeEventListener("inputsourceschange",ne);for(let J=0;J<x.length;J++){let ae=b[J];ae!==null&&(b[J]=null,x[J].disconnect(ae))}S=null,L=null,y.reset(),e.setRenderTarget(p),f=null,d=null,u=null,s=null,M=null,nt.stop(),n.isPresenting=!1,e.setPixelRatio(A),e.setSize(D.width,D.height,!1),n.dispatchEvent({type:"sessionend"})}this.setFramebufferScaleFactor=function(J){r=J,n.isPresenting===!0&&console.warn("THREE.WebXRManager: Cannot change framebuffer scale while presenting.")},this.setReferenceSpaceType=function(J){a=J,n.isPresenting===!0&&console.warn("THREE.WebXRManager: Cannot change reference space type while presenting.")},this.getReferenceSpace=function(){return l||o},this.setReferenceSpace=function(J){l=J},this.getBaseLayer=function(){return d!==null?d:f},this.getBinding=function(){return u},this.getFrame=function(){return g},this.getSession=function(){return s},this.setSession=async function(J){if(s=J,s!==null){if(p=e.getRenderTarget(),s.addEventListener("select",N),s.addEventListener("selectstart",N),s.addEventListener("selectend",N),s.addEventListener("squeeze",N),s.addEventListener("squeezestart",N),s.addEventListener("squeezeend",N),s.addEventListener("end",H),s.addEventListener("inputsourceschange",ne),m.xrCompatible!==!0&&await t.makeXRCompatible(),A=e.getPixelRatio(),e.getSize(D),s.renderState.layers===void 0){let ae={antialias:m.antialias,alpha:!0,depth:m.depth,stencil:m.stencil,framebufferScaleFactor:r};f=new XRWebGLLayer(s,t,ae),s.updateRenderState({baseLayer:f}),e.setPixelRatio(1),e.setSize(f.framebufferWidth,f.framebufferHeight,!1),M=new Vn(f.framebufferWidth,f.framebufferHeight,{format:_n,type:Hn,colorSpace:e.outputColorSpace,stencilBuffer:m.stencil})}else{let ae=null,we=null,X=null;m.depth&&(X=m.stencil?t.DEPTH24_STENCIL8:t.DEPTH_COMPONENT24,ae=m.stencil?hs:is,we=m.stencil?ls:bi);let xe={colorFormat:t.RGBA8,depthFormat:X,scaleFactor:r};u=new XRWebGLBinding(s,t),d=u.createProjectionLayer(xe),s.updateRenderState({layers:[d]}),e.setPixelRatio(1),e.setSize(d.textureWidth,d.textureHeight,!1),M=new Vn(d.textureWidth,d.textureHeight,{format:_n,type:Hn,depthTexture:new Co(d.textureWidth,d.textureHeight,we,void 0,void 0,void 0,void 0,void 0,void 0,ae),stencilBuffer:m.stencil,colorSpace:e.outputColorSpace,samples:m.antialias?4:0,resolveDepthBuffer:d.ignoreDepthValues===!1})}M.isXRRenderTarget=!0,this.setFoveation(c),l=null,o=await s.requestReferenceSpace(a),nt.setContext(s),nt.start(),n.isPresenting=!0,n.dispatchEvent({type:"sessionstart"})}},this.getEnvironmentBlendMode=function(){if(s!==null)return s.environmentBlendMode},this.getDepthTexture=function(){return y.getDepthTexture()};function ne(J){for(let ae=0;ae<J.removed.length;ae++){let we=J.removed[ae],X=b.indexOf(we);X>=0&&(b[X]=null,x[X].disconnect(we))}for(let ae=0;ae<J.added.length;ae++){let we=J.added[ae],X=b.indexOf(we);if(X===-1){for(let Oe=0;Oe<x.length;Oe++)if(Oe>=b.length){b.push(we),X=Oe;break}else if(b[Oe]===null){b[Oe]=we,X=Oe;break}if(X===-1)break}let xe=x[X];xe&&xe.connect(we)}}let V=new R,se=new R;function q(J,ae,we){V.setFromMatrixPosition(ae.matrixWorld),se.setFromMatrixPosition(we.matrixWorld);let X=V.distanceTo(se),xe=ae.projectionMatrix.elements,Oe=we.projectionMatrix.elements,Ne=xe[14]/(xe[10]-1),$e=xe[14]/(xe[10]+1),ee=(xe[9]+1)/xe[5],w=(xe[9]-1)/xe[5],pe=(xe[8]-1)/xe[0],fe=(Oe[8]+1)/Oe[0],ce=Ne*pe,me=Ne*fe,De=X/(-pe+fe),Se=De*-pe;if(ae.matrixWorld.decompose(J.position,J.quaternion,J.scale),J.translateX(Se),J.translateZ(De),J.matrixWorld.compose(J.position,J.quaternion,J.scale),J.matrixWorldInverse.copy(J.matrixWorld).invert(),xe[10]===-1)J.projectionMatrix.copy(ae.projectionMatrix),J.projectionMatrixInverse.copy(ae.projectionMatrixInverse);else{let T=Ne+De,v=$e+De,F=ce-Se,j=me+(X-Se),Q=ee*$e/v*T,Z=w*$e/v*T;J.projectionMatrix.makePerspective(F,j,Q,Z,T,v),J.projectionMatrixInverse.copy(J.projectionMatrix).invert()}}function ve(J,ae){ae===null?J.matrixWorld.copy(J.matrix):J.matrixWorld.multiplyMatrices(ae.matrixWorld,J.matrix),J.matrixWorldInverse.copy(J.matrixWorld).invert()}this.updateCamera=function(J){if(s===null)return;let ae=J.near,we=J.far;y.texture!==null&&(y.depthNear>0&&(ae=y.depthNear),y.depthFar>0&&(we=y.depthFar)),_.near=P.near=C.near=ae,_.far=P.far=C.far=we,(S!==_.near||L!==_.far)&&(s.updateRenderState({depthNear:_.near,depthFar:_.far}),S=_.near,L=_.far);let X=J.parent,xe=_.cameras;ve(_,X);for(let Oe=0;Oe<xe.length;Oe++)ve(xe[Oe],X);xe.length===2?q(_,C,P):_.projectionMatrix.copy(C.projectionMatrix),be(J,_,X)};function be(J,ae,we){we===null?J.matrix.copy(ae.matrixWorld):(J.matrix.copy(we.matrixWorld),J.matrix.invert(),J.matrix.multiply(ae.matrixWorld)),J.matrix.decompose(J.position,J.quaternion,J.scale),J.updateMatrixWorld(!0),J.projectionMatrix.copy(ae.projectionMatrix),J.projectionMatrixInverse.copy(ae.projectionMatrixInverse),J.isPerspectiveCamera&&(J.fov=$s*2*Math.atan(1/J.projectionMatrix.elements[5]),J.zoom=1)}this.getCamera=function(){return _},this.getFoveation=function(){if(!(d===null&&f===null))return c},this.setFoveation=function(J){c=J,d!==null&&(d.fixedFoveation=J),f!==null&&f.fixedFoveation!==void 0&&(f.fixedFoveation=J)},this.hasDepthSensing=function(){return y.texture!==null},this.getDepthSensingMesh=function(){return y.getMesh(_)};let Me=null;function Ke(J,ae){if(h=ae.getViewerPose(l||o),g=ae,h!==null){let we=h.views;f!==null&&(e.setRenderTargetFramebuffer(M,f.framebuffer),e.setRenderTarget(M));let X=!1;we.length!==_.cameras.length&&(_.cameras.length=0,X=!0);for(let Oe=0;Oe<we.length;Oe++){let Ne=we[Oe],$e=null;if(f!==null)$e=f.getViewport(Ne);else{let w=u.getViewSubImage(d,Ne);$e=w.viewport,Oe===0&&(e.setRenderTargetTextures(M,w.colorTexture,d.ignoreDepthValues?void 0:w.depthStencilTexture),e.setRenderTarget(M))}let ee=z[Oe];ee===void 0&&(ee=new Ut,ee.layers.enable(Oe),ee.viewport=new ft,z[Oe]=ee),ee.matrix.fromArray(Ne.transform.matrix),ee.matrix.decompose(ee.position,ee.quaternion,ee.scale),ee.projectionMatrix.fromArray(Ne.projectionMatrix),ee.projectionMatrixInverse.copy(ee.projectionMatrix).invert(),ee.viewport.set($e.x,$e.y,$e.width,$e.height),Oe===0&&(_.matrix.copy(ee.matrix),_.matrix.decompose(_.position,_.quaternion,_.scale)),X===!0&&_.cameras.push(ee)}let xe=s.enabledFeatures;if(xe&&xe.includes("depth-sensing")){let Oe=u.getDepthInformation(we[0]);Oe&&Oe.isValid&&Oe.texture&&y.init(e,Oe,s.renderState)}}for(let we=0;we<x.length;we++){let X=b[we],xe=x[we];X!==null&&xe!==void 0&&xe.update(X,ae,l||o)}Me&&Me(J,ae),ae.detectedPlanes&&n.dispatchEvent({type:"planesdetected",data:ae}),g=null}let nt=new Wd;nt.setAnimationLoop(Ke),this.setAnimationLoop=function(J){Me=J},this.dispose=function(){}}},mi=new En,Yy=new _t;function $y(i,e){function t(m,p){m.matrixAutoUpdate===!0&&m.updateMatrix(),p.value.copy(m.matrix)}function n(m,p){p.color.getRGB(m.fogColor.value,Gd(i)),p.isFog?(m.fogNear.value=p.near,m.fogFar.value=p.far):p.isFogExp2&&(m.fogDensity.value=p.density)}function s(m,p,M,x,b){p.isMeshBasicMaterial||p.isMeshLambertMaterial?r(m,p):p.isMeshToonMaterial?(r(m,p),u(m,p)):p.isMeshPhongMaterial?(r(m,p),h(m,p)):p.isMeshStandardMaterial?(r(m,p),d(m,p),p.isMeshPhysicalMaterial&&f(m,p,b)):p.isMeshMatcapMaterial?(r(m,p),g(m,p)):p.isMeshDepthMaterial?r(m,p):p.isMeshDistanceMaterial?(r(m,p),y(m,p)):p.isMeshNormalMaterial?r(m,p):p.isLineBasicMaterial?(o(m,p),p.isLineDashedMaterial&&a(m,p)):p.isPointsMaterial?c(m,p,M,x):p.isSpriteMaterial?l(m,p):p.isShadowMaterial?(m.color.value.copy(p.color),m.opacity.value=p.opacity):p.isShaderMaterial&&(p.uniformsNeedUpdate=!1)}function r(m,p){m.opacity.value=p.opacity,p.color&&m.diffuse.value.copy(p.color),p.emissive&&m.emissive.value.copy(p.emissive).multiplyScalar(p.emissiveIntensity),p.map&&(m.map.value=p.map,t(p.map,m.mapTransform)),p.alphaMap&&(m.alphaMap.value=p.alphaMap,t(p.alphaMap,m.alphaMapTransform)),p.bumpMap&&(m.bumpMap.value=p.bumpMap,t(p.bumpMap,m.bumpMapTransform),m.bumpScale.value=p.bumpScale,p.side===Ht&&(m.bumpScale.value*=-1)),p.normalMap&&(m.normalMap.value=p.normalMap,t(p.normalMap,m.normalMapTransform),m.normalScale.value.copy(p.normalScale),p.side===Ht&&m.normalScale.value.negate()),p.displacementMap&&(m.displacementMap.value=p.displacementMap,t(p.displacementMap,m.displacementMapTransform),m.displacementScale.value=p.displacementScale,m.displacementBias.value=p.displacementBias),p.emissiveMap&&(m.emissiveMap.value=p.emissiveMap,t(p.emissiveMap,m.emissiveMapTransform)),p.specularMap&&(m.specularMap.value=p.specularMap,t(p.specularMap,m.specularMapTransform)),p.alphaTest>0&&(m.alphaTest.value=p.alphaTest);let M=e.get(p),x=M.envMap,b=M.envMapRotation;x&&(m.envMap.value=x,mi.copy(b),mi.x*=-1,mi.y*=-1,mi.z*=-1,x.isCubeTexture&&x.isRenderTargetTexture===!1&&(mi.y*=-1,mi.z*=-1),m.envMapRotation.value.setFromMatrix4(Yy.makeRotationFromEuler(mi)),m.flipEnvMap.value=x.isCubeTexture&&x.isRenderTargetTexture===!1?-1:1,m.reflectivity.value=p.reflectivity,m.ior.value=p.ior,m.refractionRatio.value=p.refractionRatio),p.lightMap&&(m.lightMap.value=p.lightMap,m.lightMapIntensity.value=p.lightMapIntensity,t(p.lightMap,m.lightMapTransform)),p.aoMap&&(m.aoMap.value=p.aoMap,m.aoMapIntensity.value=p.aoMapIntensity,t(p.aoMap,m.aoMapTransform))}function o(m,p){m.diffuse.value.copy(p.color),m.opacity.value=p.opacity,p.map&&(m.map.value=p.map,t(p.map,m.mapTransform))}function a(m,p){m.dashSize.value=p.dashSize,m.totalSize.value=p.dashSize+p.gapSize,m.scale.value=p.scale}function c(m,p,M,x){m.diffuse.value.copy(p.color),m.opacity.value=p.opacity,m.size.value=p.size*M,m.scale.value=x*.5,p.map&&(m.map.value=p.map,t(p.map,m.uvTransform)),p.alphaMap&&(m.alphaMap.value=p.alphaMap,t(p.alphaMap,m.alphaMapTransform)),p.alphaTest>0&&(m.alphaTest.value=p.alphaTest)}function l(m,p){m.diffuse.value.copy(p.color),m.opacity.value=p.opacity,m.rotation.value=p.rotation,p.map&&(m.map.value=p.map,t(p.map,m.mapTransform)),p.alphaMap&&(m.alphaMap.value=p.alphaMap,t(p.alphaMap,m.alphaMapTransform)),p.alphaTest>0&&(m.alphaTest.value=p.alphaTest)}function h(m,p){m.specular.value.copy(p.specular),m.shininess.value=Math.max(p.shininess,1e-4)}function u(m,p){p.gradientMap&&(m.gradientMap.value=p.gradientMap)}function d(m,p){m.metalness.value=p.metalness,p.metalnessMap&&(m.metalnessMap.value=p.metalnessMap,t(p.metalnessMap,m.metalnessMapTransform)),m.roughness.value=p.roughness,p.roughnessMap&&(m.roughnessMap.value=p.roughnessMap,t(p.roughnessMap,m.roughnessMapTransform)),p.envMap&&(m.envMapIntensity.value=p.envMapIntensity)}function f(m,p,M){m.ior.value=p.ior,p.sheen>0&&(m.sheenColor.value.copy(p.sheenColor).multiplyScalar(p.sheen),m.sheenRoughness.value=p.sheenRoughness,p.sheenColorMap&&(m.sheenColorMap.value=p.sheenColorMap,t(p.sheenColorMap,m.sheenColorMapTransform)),p.sheenRoughnessMap&&(m.sheenRoughnessMap.value=p.sheenRoughnessMap,t(p.sheenRoughnessMap,m.sheenRoughnessMapTransform))),p.clearcoat>0&&(m.clearcoat.value=p.clearcoat,m.clearcoatRoughness.value=p.clearcoatRoughness,p.clearcoatMap&&(m.clearcoatMap.value=p.clearcoatMap,t(p.clearcoatMap,m.clearcoatMapTransform)),p.clearcoatRoughnessMap&&(m.clearcoatRoughnessMap.value=p.clearcoatRoughnessMap,t(p.clearcoatRoughnessMap,m.clearcoatRoughnessMapTransform)),p.clearcoatNormalMap&&(m.clearcoatNormalMap.value=p.clearcoatNormalMap,t(p.clearcoatNormalMap,m.clearcoatNormalMapTransform),m.clearcoatNormalScale.value.copy(p.clearcoatNormalScale),p.side===Ht&&m.clearcoatNormalScale.value.negate())),p.dispersion>0&&(m.dispersion.value=p.dispersion),p.iridescence>0&&(m.iridescence.value=p.iridescence,m.iridescenceIOR.value=p.iridescenceIOR,m.iridescenceThicknessMinimum.value=p.iridescenceThicknessRange[0],m.iridescenceThicknessMaximum.value=p.iridescenceThicknessRange[1],p.iridescenceMap&&(m.iridescenceMap.value=p.iridescenceMap,t(p.iridescenceMap,m.iridescenceMapTransform)),p.iridescenceThicknessMap&&(m.iridescenceThicknessMap.value=p.iridescenceThicknessMap,t(p.iridescenceThicknessMap,m.iridescenceThicknessMapTransform))),p.transmission>0&&(m.transmission.value=p.transmission,m.transmissionSamplerMap.value=M.texture,m.transmissionSamplerSize.value.set(M.width,M.height),p.transmissionMap&&(m.transmissionMap.value=p.transmissionMap,t(p.transmissionMap,m.transmissionMapTransform)),m.thickness.value=p.thickness,p.thicknessMap&&(m.thicknessMap.value=p.thicknessMap,t(p.thicknessMap,m.thicknessMapTransform)),m.attenuationDistance.value=p.attenuationDistance,m.attenuationColor.value.copy(p.attenuationColor)),p.anisotropy>0&&(m.anisotropyVector.value.set(p.anisotropy*Math.cos(p.anisotropyRotation),p.anisotropy*Math.sin(p.anisotropyRotation)),p.anisotropyMap&&(m.anisotropyMap.value=p.anisotropyMap,t(p.anisotropyMap,m.anisotropyMapTransform))),m.specularIntensity.value=p.specularIntensity,m.specularColor.value.copy(p.specularColor),p.specularColorMap&&(m.specularColorMap.value=p.specularColorMap,t(p.specularColorMap,m.specularColorMapTransform)),p.specularIntensityMap&&(m.specularIntensityMap.value=p.specularIntensityMap,t(p.specularIntensityMap,m.specularIntensityMapTransform))}function g(m,p){p.matcap&&(m.matcap.value=p.matcap)}function y(m,p){let M=e.get(p).light;m.referencePosition.value.setFromMatrixPosition(M.matrixWorld),m.nearDistance.value=M.shadow.camera.near,m.farDistance.value=M.shadow.camera.far}return{refreshFogUniforms:n,refreshMaterialUniforms:s}}function Jy(i,e,t,n){let s={},r={},o=[],a=i.getParameter(i.MAX_UNIFORM_BUFFER_BINDINGS);function c(M,x){let b=x.program;n.uniformBlockBinding(M,b)}function l(M,x){let b=s[M.id];b===void 0&&(g(M),b=h(M),s[M.id]=b,M.addEventListener("dispose",m));let D=x.program;n.updateUBOMapping(M,D);let A=e.render.frame;r[M.id]!==A&&(d(M),r[M.id]=A)}function h(M){let x=u();M.__bindingPointIndex=x;let b=i.createBuffer(),D=M.__size,A=M.usage;return i.bindBuffer(i.UNIFORM_BUFFER,b),i.bufferData(i.UNIFORM_BUFFER,D,A),i.bindBuffer(i.UNIFORM_BUFFER,null),i.bindBufferBase(i.UNIFORM_BUFFER,x,b),b}function u(){for(let M=0;M<a;M++)if(o.indexOf(M)===-1)return o.push(M),M;return console.error("THREE.WebGLRenderer: Maximum number of simultaneously usable uniforms groups reached."),0}function d(M){let x=s[M.id],b=M.uniforms,D=M.__cache;i.bindBuffer(i.UNIFORM_BUFFER,x);for(let A=0,C=b.length;A<C;A++){let P=Array.isArray(b[A])?b[A]:[b[A]];for(let z=0,_=P.length;z<_;z++){let S=P[z];if(f(S,A,z,D)===!0){let L=S.__offset,N=Array.isArray(S.value)?S.value:[S.value],H=0;for(let ne=0;ne<N.length;ne++){let V=N[ne],se=y(V);typeof V=="number"||typeof V=="boolean"?(S.__data[0]=V,i.bufferSubData(i.UNIFORM_BUFFER,L+H,S.__data)):V.isMatrix3?(S.__data[0]=V.elements[0],S.__data[1]=V.elements[1],S.__data[2]=V.elements[2],S.__data[3]=0,S.__data[4]=V.elements[3],S.__data[5]=V.elements[4],S.__data[6]=V.elements[5],S.__data[7]=0,S.__data[8]=V.elements[6],S.__data[9]=V.elements[7],S.__data[10]=V.elements[8],S.__data[11]=0):(V.toArray(S.__data,H),H+=se.storage/Float32Array.BYTES_PER_ELEMENT)}i.bufferSubData(i.UNIFORM_BUFFER,L,S.__data)}}}i.bindBuffer(i.UNIFORM_BUFFER,null)}function f(M,x,b,D){let A=M.value,C=x+"_"+b;if(D[C]===void 0)return typeof A=="number"||typeof A=="boolean"?D[C]=A:D[C]=A.clone(),!0;{let P=D[C];if(typeof A=="number"||typeof A=="boolean"){if(P!==A)return D[C]=A,!0}else if(P.equals(A)===!1)return P.copy(A),!0}return!1}function g(M){let x=M.uniforms,b=0,D=16;for(let C=0,P=x.length;C<P;C++){let z=Array.isArray(x[C])?x[C]:[x[C]];for(let _=0,S=z.length;_<S;_++){let L=z[_],N=Array.isArray(L.value)?L.value:[L.value];for(let H=0,ne=N.length;H<ne;H++){let V=N[H],se=y(V),q=b%D,ve=q%se.boundary,be=q+ve;b+=ve,be!==0&&D-be<se.storage&&(b+=D-be),L.__data=new Float32Array(se.storage/Float32Array.BYTES_PER_ELEMENT),L.__offset=b,b+=se.storage}}}let A=b%D;return A>0&&(b+=D-A),M.__size=b,M.__cache={},this}function y(M){let x={boundary:0,storage:0};return typeof M=="number"||typeof M=="boolean"?(x.boundary=4,x.storage=4):M.isVector2?(x.boundary=8,x.storage=8):M.isVector3||M.isColor?(x.boundary=16,x.storage=12):M.isVector4?(x.boundary=16,x.storage=16):M.isMatrix3?(x.boundary=48,x.storage=48):M.isMatrix4?(x.boundary=64,x.storage=64):M.isTexture?console.warn("THREE.WebGLRenderer: Texture samplers can not be part of an uniforms group."):console.warn("THREE.WebGLRenderer: Unsupported uniform value type.",M),x}function m(M){let x=M.target;x.removeEventListener("dispose",m);let b=o.indexOf(x.__bindingPointIndex);o.splice(b,1),i.deleteBuffer(s[x.id]),delete s[x.id],delete r[x.id]}function p(){for(let M in s)i.deleteBuffer(s[M]);o=[],s={},r={}}return{bind:c,update:l,dispose:p}}var Zs=class{constructor(e={}){let{canvas:t=Qp(),context:n=null,depth:s=!0,stencil:r=!1,alpha:o=!1,antialias:a=!1,premultipliedAlpha:c=!0,preserveDrawingBuffer:l=!1,powerPreference:h="default",failIfMajorPerformanceCaveat:u=!1}=e;this.isWebGLRenderer=!0;let d;if(n!==null){if(typeof WebGLRenderingContext!="undefined"&&n instanceof WebGLRenderingContext)throw new Error("THREE.WebGLRenderer: WebGL 1 is not supported since r163.");d=n.getContextAttributes().alpha}else d=o;let f=new Uint32Array(4),g=new Int32Array(4),y=null,m=null,p=[],M=[];this.domElement=t,this.debug={checkShaderErrors:!0,onShaderError:null},this.autoClear=!0,this.autoClearColor=!0,this.autoClearDepth=!0,this.autoClearStencil=!0,this.sortObjects=!0,this.clippingPlanes=[],this.localClippingEnabled=!1,this._outputColorSpace=Xt,this.toneMapping=ni,this.toneMappingExposure=1;let x=this,b=!1,D=0,A=0,C=null,P=-1,z=null,_=new ft,S=new ft,L=null,N=new Qe(0),H=0,ne=t.width,V=t.height,se=1,q=null,ve=null,be=new ft(0,0,ne,V),Me=new ft(0,0,ne,V),Ke=!1,nt=new Js,J=!1,ae=!1,we=new _t,X=new _t,xe=new R,Oe=new ft,Ne={background:null,fog:null,environment:null,overrideMaterial:null,isScene:!0},$e=!1;function ee(){return C===null?se:1}let w=n;function pe(E,k){return t.getContext(E,k)}try{let E={alpha:!0,depth:s,stencil:r,antialias:a,premultipliedAlpha:c,preserveDrawingBuffer:l,powerPreference:h,failIfMajorPerformanceCaveat:u};if("setAttribute"in t&&t.setAttribute("data-engine",`three.js r${Fl}`),t.addEventListener("webglcontextlost",ie,!1),t.addEventListener("webglcontextrestored",Ee,!1),t.addEventListener("webglcontextcreationerror",Ce,!1),w===null){let k="webgl2";if(w=pe(k,E),w===null)throw pe(k)?new Error("Error creating WebGL context with your selected attributes."):new Error("Error creating WebGL context.")}}catch(E){throw console.error("THREE.WebGLRenderer: "+E.message),E}let fe,ce,me,De,Se,T,v,F,j,Q,Z,Ie,I,B,K,$,he,Be,He,ge,Je,Ve,it,U;function Ae(){fe=new u_(w),fe.init(),Ve=new Gy(w,fe),ce=new r_(w,fe,e,Ve),me=new zy(w),ce.reverseDepthBuffer&&me.buffers.depth.setReversed(!0),De=new p_(w),Se=new Ay,T=new Vy(w,fe,me,Se,ce,Ve,De),v=new a_(x),F=new h_(x),j=new bm(w),it=new i_(w,j),Q=new d_(w,j,De,it),Z=new g_(w,Q,j,De),He=new m_(w,ce,T),$=new o_(Se),Ie=new wy(x,v,F,fe,ce,it,$),I=new $y(x,Se),B=new Ry,K=new Ny(fe),Be=new n_(x,v,F,me,Z,d,c),he=new Fy(x,Z,ce),U=new Jy(w,De,ce,me),ge=new s_(w,fe,De),Je=new f_(w,fe,De),De.programs=Ie.programs,x.capabilities=ce,x.extensions=fe,x.properties=Se,x.renderLists=B,x.shadowMap=he,x.state=me,x.info=De}Ae();let Y=new fl(x,w);this.xr=Y,this.getContext=function(){return w},this.getContextAttributes=function(){return w.getContextAttributes()},this.forceContextLoss=function(){let E=fe.get("WEBGL_lose_context");E&&E.loseContext()},this.forceContextRestore=function(){let E=fe.get("WEBGL_lose_context");E&&E.restoreContext()},this.getPixelRatio=function(){return se},this.setPixelRatio=function(E){E!==void 0&&(se=E,this.setSize(ne,V,!1))},this.getSize=function(E){return E.set(ne,V)},this.setSize=function(E,k,G=!0){if(Y.isPresenting){console.warn("THREE.WebGLRenderer: Can't change size while VR device is presenting.");return}ne=E,V=k,t.width=Math.floor(E*se),t.height=Math.floor(k*se),G===!0&&(t.style.width=E+"px",t.style.height=k+"px"),this.setViewport(0,0,E,k)},this.getDrawingBufferSize=function(E){return E.set(ne*se,V*se).floor()},this.setDrawingBufferSize=function(E,k,G){ne=E,V=k,se=G,t.width=Math.floor(E*G),t.height=Math.floor(k*G),this.setViewport(0,0,E,k)},this.getCurrentViewport=function(E){return E.copy(_)},this.getViewport=function(E){return E.copy(be)},this.setViewport=function(E,k,G,W){E.isVector4?be.set(E.x,E.y,E.z,E.w):be.set(E,k,G,W),me.viewport(_.copy(be).multiplyScalar(se).round())},this.getScissor=function(E){return E.copy(Me)},this.setScissor=function(E,k,G,W){E.isVector4?Me.set(E.x,E.y,E.z,E.w):Me.set(E,k,G,W),me.scissor(S.copy(Me).multiplyScalar(se).round())},this.getScissorTest=function(){return Ke},this.setScissorTest=function(E){me.setScissorTest(Ke=E)},this.setOpaqueSort=function(E){q=E},this.setTransparentSort=function(E){ve=E},this.getClearColor=function(E){return E.copy(Be.getClearColor())},this.setClearColor=function(){Be.setClearColor.apply(Be,arguments)},this.getClearAlpha=function(){return Be.getClearAlpha()},this.setClearAlpha=function(){Be.setClearAlpha.apply(Be,arguments)},this.clear=function(E=!0,k=!0,G=!0){let W=0;if(E){let O=!1;if(C!==null){let de=C.texture.format;O=de===ql||de===Xl||de===Wl}if(O){let de=C.texture.type,Te=de===Hn||de===bi||de===Ys||de===ls||de===Vl||de===Gl,Pe=Be.getClearColor(),Le=Be.getClearAlpha(),Ge=Pe.r,We=Pe.g,ke=Pe.b;Te?(f[0]=Ge,f[1]=We,f[2]=ke,f[3]=Le,w.clearBufferuiv(w.COLOR,0,f)):(g[0]=Ge,g[1]=We,g[2]=ke,g[3]=Le,w.clearBufferiv(w.COLOR,0,g))}else W|=w.COLOR_BUFFER_BIT}k&&(W|=w.DEPTH_BUFFER_BIT,w.clearDepth(this.capabilities.reverseDepthBuffer?0:1)),G&&(W|=w.STENCIL_BUFFER_BIT,this.state.buffers.stencil.setMask(4294967295)),w.clear(W)},this.clearColor=function(){this.clear(!0,!1,!1)},this.clearDepth=function(){this.clear(!1,!0,!1)},this.clearStencil=function(){this.clear(!1,!1,!0)},this.dispose=function(){t.removeEventListener("webglcontextlost",ie,!1),t.removeEventListener("webglcontextrestored",Ee,!1),t.removeEventListener("webglcontextcreationerror",Ce,!1),B.dispose(),K.dispose(),Se.dispose(),v.dispose(),F.dispose(),Z.dispose(),it.dispose(),U.dispose(),Ie.dispose(),Y.dispose(),Y.removeEventListener("sessionstart",cu),Y.removeEventListener("sessionend",lu),li.stop()};function ie(E){E.preventDefault(),console.log("THREE.WebGLRenderer: Context Lost."),b=!0}function Ee(){console.log("THREE.WebGLRenderer: Context Restored."),b=!1;let E=De.autoReset,k=he.enabled,G=he.autoUpdate,W=he.needsUpdate,O=he.type;Ae(),De.autoReset=E,he.enabled=k,he.autoUpdate=G,he.needsUpdate=W,he.type=O}function Ce(E){console.error("THREE.WebGLRenderer: A WebGL context could not be created. Reason: ",E.statusMessage)}function st(E){let k=E.target;k.removeEventListener("dispose",st),Tt(k)}function Tt(E){$t(E),Se.remove(E)}function $t(E){let k=Se.get(E).programs;k!==void 0&&(k.forEach(function(G){Ie.releaseProgram(G)}),E.isShaderMaterial&&Ie.releaseShaderCache(E))}this.renderBufferDirect=function(E,k,G,W,O,de){k===null&&(k=Ne);let Te=O.isMesh&&O.matrixWorld.determinant()<0,Pe=Bf(E,k,G,W,O);me.setMaterial(W,Te);let Le=G.index,Ge=1;if(W.wireframe===!0){if(Le=Q.getWireframeAttribute(G),Le===void 0)return;Ge=2}let We=G.drawRange,ke=G.attributes.position,ht=We.start*Ge,mt=(We.start+We.count)*Ge;de!==null&&(ht=Math.max(ht,de.start*Ge),mt=Math.min(mt,(de.start+de.count)*Ge)),Le!==null?(ht=Math.max(ht,0),mt=Math.min(mt,Le.count)):ke!=null&&(ht=Math.max(ht,0),mt=Math.min(mt,ke.count));let vt=mt-ht;if(vt<0||vt===1/0)return;it.setup(O,W,Pe,G,Le);let jt,ot=ge;if(Le!==null&&(jt=j.get(Le),ot=Je,ot.setIndex(jt)),O.isMesh)W.wireframe===!0?(me.setLineWidth(W.wireframeLinewidth*ee()),ot.setMode(w.LINES)):ot.setMode(w.TRIANGLES);else if(O.isLine){let Fe=W.linewidth;Fe===void 0&&(Fe=1),me.setLineWidth(Fe*ee()),O.isLineSegments?ot.setMode(w.LINES):O.isLineLoop?ot.setMode(w.LINE_LOOP):ot.setMode(w.LINE_STRIP)}else O.isPoints?ot.setMode(w.POINTS):O.isSprite&&ot.setMode(w.TRIANGLES);if(O.isBatchedMesh)if(O._multiDrawInstances!==null)ot.renderMultiDrawInstances(O._multiDrawStarts,O._multiDrawCounts,O._multiDrawCount,O._multiDrawInstances);else if(fe.get("WEBGL_multi_draw"))ot.renderMultiDraw(O._multiDrawStarts,O._multiDrawCounts,O._multiDrawCount);else{let Fe=O._multiDrawStarts,Dt=O._multiDrawCounts,at=O._multiDrawCount,un=Le?j.get(Le).bytesPerElement:1,Ni=Se.get(W).currentProgram.getUniforms();for(let Kt=0;Kt<at;Kt++)Ni.setValue(w,"_gl_DrawID",Kt),ot.render(Fe[Kt]/un,Dt[Kt])}else if(O.isInstancedMesh)ot.renderInstances(ht,vt,O.count);else if(G.isInstancedBufferGeometry){let Fe=G._maxInstanceCount!==void 0?G._maxInstanceCount:1/0,Dt=Math.min(G.instanceCount,Fe);ot.renderInstances(ht,vt,Dt)}else ot.render(ht,vt)};function rt(E,k,G){E.transparent===!0&&E.side===Fn&&E.forceSinglePass===!1?(E.side=Ht,E.needsUpdate=!0,wr(E,k,G),E.side=Sn,E.needsUpdate=!0,wr(E,k,G),E.side=Fn):wr(E,k,G)}this.compile=function(E,k,G=null){G===null&&(G=E),m=K.get(G),m.init(k),M.push(m),G.traverseVisible(function(O){O.isLight&&O.layers.test(k.layers)&&(m.pushLight(O),O.castShadow&&m.pushShadow(O))}),E!==G&&E.traverseVisible(function(O){O.isLight&&O.layers.test(k.layers)&&(m.pushLight(O),O.castShadow&&m.pushShadow(O))}),m.setupLights();let W=new Set;return E.traverse(function(O){if(!(O.isMesh||O.isPoints||O.isLine||O.isSprite))return;let de=O.material;if(de)if(Array.isArray(de))for(let Te=0;Te<de.length;Te++){let Pe=de[Te];rt(Pe,G,O),W.add(Pe)}else rt(de,G,O),W.add(de)}),M.pop(),m=null,W},this.compileAsync=function(E,k,G=null){let W=this.compile(E,k,G);return new Promise(O=>{function de(){if(W.forEach(function(Te){Se.get(Te).currentProgram.isReady()&&W.delete(Te)}),W.size===0){O(E);return}setTimeout(de,10)}fe.get("KHR_parallel_shader_compile")!==null?de():setTimeout(de,10)})};let Jt=null;function Pn(E){Jt&&Jt(E)}function cu(){li.stop()}function lu(){li.start()}let li=new Wd;li.setAnimationLoop(Pn),typeof self!="undefined"&&li.setContext(self),this.setAnimationLoop=function(E){Jt=E,Y.setAnimationLoop(E),E===null?li.stop():li.start()},Y.addEventListener("sessionstart",cu),Y.addEventListener("sessionend",lu),this.render=function(E,k){if(k!==void 0&&k.isCamera!==!0){console.error("THREE.WebGLRenderer.render: camera is not an instance of THREE.Camera.");return}if(b===!0)return;if(E.matrixWorldAutoUpdate===!0&&E.updateMatrixWorld(),k.parent===null&&k.matrixWorldAutoUpdate===!0&&k.updateMatrixWorld(),Y.enabled===!0&&Y.isPresenting===!0&&(Y.cameraAutoUpdate===!0&&Y.updateCamera(k),k=Y.getCamera()),E.isScene===!0&&E.onBeforeRender(x,E,k,C),m=K.get(E,M.length),m.init(k),M.push(m),X.multiplyMatrices(k.projectionMatrix,k.matrixWorldInverse),nt.setFromProjectionMatrix(X),ae=this.localClippingEnabled,J=$.init(this.clippingPlanes,ae),y=B.get(E,p.length),y.init(),p.push(y),Y.enabled===!0&&Y.isPresenting===!0){let de=x.xr.getDepthSensingMesh();de!==null&&wa(de,k,-1/0,x.sortObjects)}wa(E,k,0,x.sortObjects),y.finish(),x.sortObjects===!0&&y.sort(q,ve),$e=Y.enabled===!1||Y.isPresenting===!1||Y.hasDepthSensing()===!1,$e&&Be.addToRenderList(y,E),this.info.render.frame++,J===!0&&$.beginShadows();let G=m.state.shadowsArray;he.render(G,E,k),J===!0&&$.endShadows(),this.info.autoReset===!0&&this.info.reset();let W=y.opaque,O=y.transmissive;if(m.setupLights(),k.isArrayCamera){let de=k.cameras;if(O.length>0)for(let Te=0,Pe=de.length;Te<Pe;Te++){let Le=de[Te];uu(W,O,E,Le)}$e&&Be.render(E);for(let Te=0,Pe=de.length;Te<Pe;Te++){let Le=de[Te];hu(y,E,Le,Le.viewport)}}else O.length>0&&uu(W,O,E,k),$e&&Be.render(E),hu(y,E,k);C!==null&&(T.updateMultisampleRenderTarget(C),T.updateRenderTargetMipmap(C)),E.isScene===!0&&E.onAfterRender(x,E,k),it.resetDefaultState(),P=-1,z=null,M.pop(),M.length>0?(m=M[M.length-1],J===!0&&$.setGlobalState(x.clippingPlanes,m.state.camera)):m=null,p.pop(),p.length>0?y=p[p.length-1]:y=null};function wa(E,k,G,W){if(E.visible===!1)return;if(E.layers.test(k.layers)){if(E.isGroup)G=E.renderOrder;else if(E.isLOD)E.autoUpdate===!0&&E.update(k);else if(E.isLight)m.pushLight(E),E.castShadow&&m.pushShadow(E);else if(E.isSprite){if(!E.frustumCulled||nt.intersectsSprite(E)){W&&Oe.setFromMatrixPosition(E.matrixWorld).applyMatrix4(X);let Te=Z.update(E),Pe=E.material;Pe.visible&&y.push(E,Te,Pe,G,Oe.z,null)}}else if((E.isMesh||E.isLine||E.isPoints)&&(!E.frustumCulled||nt.intersectsObject(E))){let Te=Z.update(E),Pe=E.material;if(W&&(E.boundingSphere!==void 0?(E.boundingSphere===null&&E.computeBoundingSphere(),Oe.copy(E.boundingSphere.center)):(Te.boundingSphere===null&&Te.computeBoundingSphere(),Oe.copy(Te.boundingSphere.center)),Oe.applyMatrix4(E.matrixWorld).applyMatrix4(X)),Array.isArray(Pe)){let Le=Te.groups;for(let Ge=0,We=Le.length;Ge<We;Ge++){let ke=Le[Ge],ht=Pe[ke.materialIndex];ht&&ht.visible&&y.push(E,Te,ht,G,Oe.z,ke)}}else Pe.visible&&y.push(E,Te,Pe,G,Oe.z,null)}}let de=E.children;for(let Te=0,Pe=de.length;Te<Pe;Te++)wa(de[Te],k,G,W)}function hu(E,k,G,W){let O=E.opaque,de=E.transmissive,Te=E.transparent;m.setupLightsView(G),J===!0&&$.setGlobalState(x.clippingPlanes,G),W&&me.viewport(_.copy(W)),O.length>0&&Tr(O,k,G),de.length>0&&Tr(de,k,G),Te.length>0&&Tr(Te,k,G),me.buffers.depth.setTest(!0),me.buffers.depth.setMask(!0),me.buffers.color.setMask(!0),me.setPolygonOffset(!1)}function uu(E,k,G,W){if((G.isScene===!0?G.overrideMaterial:null)!==null)return;m.state.transmissionRenderTarget[W.id]===void 0&&(m.state.transmissionRenderTarget[W.id]=new Vn(1,1,{generateMipmaps:!0,type:fe.has("EXT_color_buffer_half_float")||fe.has("EXT_color_buffer_float")?ar:Hn,minFilter:vi,samples:4,stencilBuffer:r,resolveDepthBuffer:!1,resolveStencilBuffer:!1,colorSpace:ct.workingColorSpace}));let de=m.state.transmissionRenderTarget[W.id],Te=W.viewport||_;de.setSize(Te.z,Te.w);let Pe=x.getRenderTarget();x.setRenderTarget(de),x.getClearColor(N),H=x.getClearAlpha(),H<1&&x.setClearColor(16777215,.5),x.clear(),$e&&Be.render(G);let Le=x.toneMapping;x.toneMapping=ni;let Ge=W.viewport;if(W.viewport!==void 0&&(W.viewport=void 0),m.setupLightsView(W),J===!0&&$.setGlobalState(x.clippingPlanes,W),Tr(E,G,W),T.updateMultisampleRenderTarget(de),T.updateRenderTargetMipmap(de),fe.has("WEBGL_multisampled_render_to_texture")===!1){let We=!1;for(let ke=0,ht=k.length;ke<ht;ke++){let mt=k[ke],vt=mt.object,jt=mt.geometry,ot=mt.material,Fe=mt.group;if(ot.side===Fn&&vt.layers.test(W.layers)){let Dt=ot.side;ot.side=Ht,ot.needsUpdate=!0,du(vt,G,W,jt,ot,Fe),ot.side=Dt,ot.needsUpdate=!0,We=!0}}We===!0&&(T.updateMultisampleRenderTarget(de),T.updateRenderTargetMipmap(de))}x.setRenderTarget(Pe),x.setClearColor(N,H),Ge!==void 0&&(W.viewport=Ge),x.toneMapping=Le}function Tr(E,k,G){let W=k.isScene===!0?k.overrideMaterial:null;for(let O=0,de=E.length;O<de;O++){let Te=E[O],Pe=Te.object,Le=Te.geometry,Ge=W===null?Te.material:W,We=Te.group;Pe.layers.test(G.layers)&&du(Pe,k,G,Le,Ge,We)}}function du(E,k,G,W,O,de){E.onBeforeRender(x,k,G,W,O,de),E.modelViewMatrix.multiplyMatrices(G.matrixWorldInverse,E.matrixWorld),E.normalMatrix.getNormalMatrix(E.modelViewMatrix),O.onBeforeRender(x,k,G,W,E,de),O.transparent===!0&&O.side===Fn&&O.forceSinglePass===!1?(O.side=Ht,O.needsUpdate=!0,x.renderBufferDirect(G,k,W,O,E,de),O.side=Sn,O.needsUpdate=!0,x.renderBufferDirect(G,k,W,O,E,de),O.side=Fn):x.renderBufferDirect(G,k,W,O,E,de),E.onAfterRender(x,k,G,W,O,de)}function wr(E,k,G){k.isScene!==!0&&(k=Ne);let W=Se.get(E),O=m.state.lights,de=m.state.shadowsArray,Te=O.state.version,Pe=Ie.getParameters(E,O.state,de,k,G),Le=Ie.getProgramCacheKey(Pe),Ge=W.programs;W.environment=E.isMeshStandardMaterial?k.environment:null,W.fog=k.fog,W.envMap=(E.isMeshStandardMaterial?F:v).get(E.envMap||W.environment),W.envMapRotation=W.environment!==null&&E.envMap===null?k.environmentRotation:E.envMapRotation,Ge===void 0&&(E.addEventListener("dispose",st),Ge=new Map,W.programs=Ge);let We=Ge.get(Le);if(We!==void 0){if(W.currentProgram===We&&W.lightsStateVersion===Te)return pu(E,Pe),We}else Pe.uniforms=Ie.getUniforms(E),E.onBeforeCompile(Pe,x),We=Ie.acquireProgram(Pe,Le),Ge.set(Le,We),W.uniforms=Pe.uniforms;let ke=W.uniforms;return(!E.isShaderMaterial&&!E.isRawShaderMaterial||E.clipping===!0)&&(ke.clippingPlanes=$.uniform),pu(E,Pe),W.needsLights=Hf(E),W.lightsStateVersion=Te,W.needsLights&&(ke.ambientLightColor.value=O.state.ambient,ke.lightProbe.value=O.state.probe,ke.directionalLights.value=O.state.directional,ke.directionalLightShadows.value=O.state.directionalShadow,ke.spotLights.value=O.state.spot,ke.spotLightShadows.value=O.state.spotShadow,ke.rectAreaLights.value=O.state.rectArea,ke.ltc_1.value=O.state.rectAreaLTC1,ke.ltc_2.value=O.state.rectAreaLTC2,ke.pointLights.value=O.state.point,ke.pointLightShadows.value=O.state.pointShadow,ke.hemisphereLights.value=O.state.hemi,ke.directionalShadowMap.value=O.state.directionalShadowMap,ke.directionalShadowMatrix.value=O.state.directionalShadowMatrix,ke.spotShadowMap.value=O.state.spotShadowMap,ke.spotLightMatrix.value=O.state.spotLightMatrix,ke.spotLightMap.value=O.state.spotLightMap,ke.pointShadowMap.value=O.state.pointShadowMap,ke.pointShadowMatrix.value=O.state.pointShadowMatrix),W.currentProgram=We,W.uniformsList=null,We}function fu(E){if(E.uniformsList===null){let k=E.currentProgram.getUniforms();E.uniformsList=rs.seqWithValue(k.seq,E.uniforms)}return E.uniformsList}function pu(E,k){let G=Se.get(E);G.outputColorSpace=k.outputColorSpace,G.batching=k.batching,G.batchingColor=k.batchingColor,G.instancing=k.instancing,G.instancingColor=k.instancingColor,G.instancingMorph=k.instancingMorph,G.skinning=k.skinning,G.morphTargets=k.morphTargets,G.morphNormals=k.morphNormals,G.morphColors=k.morphColors,G.morphTargetsCount=k.morphTargetsCount,G.numClippingPlanes=k.numClippingPlanes,G.numIntersection=k.numClipIntersection,G.vertexAlphas=k.vertexAlphas,G.vertexTangents=k.vertexTangents,G.toneMapping=k.toneMapping}function Bf(E,k,G,W,O){k.isScene!==!0&&(k=Ne),T.resetTextureUnits();let de=k.fog,Te=W.isMeshStandardMaterial?k.environment:null,Pe=C===null?x.outputColorSpace:C.isXRRenderTarget===!0?C.texture.colorSpace:ri,Le=(W.isMeshStandardMaterial?F:v).get(W.envMap||Te),Ge=W.vertexColors===!0&&!!G.attributes.color&&G.attributes.color.itemSize===4,We=!!G.attributes.tangent&&(!!W.normalMap||W.anisotropy>0),ke=!!G.morphAttributes.position,ht=!!G.morphAttributes.normal,mt=!!G.morphAttributes.color,vt=ni;W.toneMapped&&(C===null||C.isXRRenderTarget===!0)&&(vt=x.toneMapping);let jt=G.morphAttributes.position||G.morphAttributes.normal||G.morphAttributes.color,ot=jt!==void 0?jt.length:0,Fe=Se.get(W),Dt=m.state.lights;if(J===!0&&(ae===!0||E!==z)){let rn=E===z&&W.id===P;$.setState(W,E,rn)}let at=!1;W.version===Fe.__version?(Fe.needsLights&&Fe.lightsStateVersion!==Dt.state.version||Fe.outputColorSpace!==Pe||O.isBatchedMesh&&Fe.batching===!1||!O.isBatchedMesh&&Fe.batching===!0||O.isBatchedMesh&&Fe.batchingColor===!0&&O.colorTexture===null||O.isBatchedMesh&&Fe.batchingColor===!1&&O.colorTexture!==null||O.isInstancedMesh&&Fe.instancing===!1||!O.isInstancedMesh&&Fe.instancing===!0||O.isSkinnedMesh&&Fe.skinning===!1||!O.isSkinnedMesh&&Fe.skinning===!0||O.isInstancedMesh&&Fe.instancingColor===!0&&O.instanceColor===null||O.isInstancedMesh&&Fe.instancingColor===!1&&O.instanceColor!==null||O.isInstancedMesh&&Fe.instancingMorph===!0&&O.morphTexture===null||O.isInstancedMesh&&Fe.instancingMorph===!1&&O.morphTexture!==null||Fe.envMap!==Le||W.fog===!0&&Fe.fog!==de||Fe.numClippingPlanes!==void 0&&(Fe.numClippingPlanes!==$.numPlanes||Fe.numIntersection!==$.numIntersection)||Fe.vertexAlphas!==Ge||Fe.vertexTangents!==We||Fe.morphTargets!==ke||Fe.morphNormals!==ht||Fe.morphColors!==mt||Fe.toneMapping!==vt||Fe.morphTargetsCount!==ot)&&(at=!0):(at=!0,Fe.__version=W.version);let un=Fe.currentProgram;at===!0&&(un=wr(W,k,O));let Ni=!1,Kt=!1,Aa=!1,Mt=un.getUniforms(),qn=Fe.uniforms;if(me.useProgram(un.program)&&(Ni=!0,Kt=!0,Aa=!0),W.id!==P&&(P=W.id,Kt=!0),Ni||z!==E){ce.reverseDepthBuffer?(we.copy(E.projectionMatrix),tm(we),nm(we),Mt.setValue(w,"projectionMatrix",we)):Mt.setValue(w,"projectionMatrix",E.projectionMatrix),Mt.setValue(w,"viewMatrix",E.matrixWorldInverse);let rn=Mt.map.cameraPosition;rn!==void 0&&rn.setValue(w,xe.setFromMatrixPosition(E.matrixWorld)),ce.logarithmicDepthBuffer&&Mt.setValue(w,"logDepthBufFC",2/(Math.log(E.far+1)/Math.LN2)),(W.isMeshPhongMaterial||W.isMeshToonMaterial||W.isMeshLambertMaterial||W.isMeshBasicMaterial||W.isMeshStandardMaterial||W.isShaderMaterial)&&Mt.setValue(w,"isOrthographic",E.isOrthographicCamera===!0),z!==E&&(z=E,Kt=!0,Aa=!0)}if(O.isSkinnedMesh){Mt.setOptional(w,O,"bindMatrix"),Mt.setOptional(w,O,"bindMatrixInverse");let rn=O.skeleton;rn&&(rn.boneTexture===null&&rn.computeBoneTexture(),Mt.setValue(w,"boneTexture",rn.boneTexture,T))}O.isBatchedMesh&&(Mt.setOptional(w,O,"batchingTexture"),Mt.setValue(w,"batchingTexture",O._matricesTexture,T),Mt.setOptional(w,O,"batchingIdTexture"),Mt.setValue(w,"batchingIdTexture",O._indirectTexture,T),Mt.setOptional(w,O,"batchingColorTexture"),O._colorsTexture!==null&&Mt.setValue(w,"batchingColorTexture",O._colorsTexture,T));let Ca=G.morphAttributes;if((Ca.position!==void 0||Ca.normal!==void 0||Ca.color!==void 0)&&He.update(O,G,un),(Kt||Fe.receiveShadow!==O.receiveShadow)&&(Fe.receiveShadow=O.receiveShadow,Mt.setValue(w,"receiveShadow",O.receiveShadow)),W.isMeshGouraudMaterial&&W.envMap!==null&&(qn.envMap.value=Le,qn.flipEnvMap.value=Le.isCubeTexture&&Le.isRenderTargetTexture===!1?-1:1),W.isMeshStandardMaterial&&W.envMap===null&&k.environment!==null&&(qn.envMapIntensity.value=k.environmentIntensity),Kt&&(Mt.setValue(w,"toneMappingExposure",x.toneMappingExposure),Fe.needsLights&&zf(qn,Aa),de&&W.fog===!0&&I.refreshFogUniforms(qn,de),I.refreshMaterialUniforms(qn,W,se,V,m.state.transmissionRenderTarget[E.id]),rs.upload(w,fu(Fe),qn,T)),W.isShaderMaterial&&W.uniformsNeedUpdate===!0&&(rs.upload(w,fu(Fe),qn,T),W.uniformsNeedUpdate=!1),W.isSpriteMaterial&&Mt.setValue(w,"center",O.center),Mt.setValue(w,"modelViewMatrix",O.modelViewMatrix),Mt.setValue(w,"normalMatrix",O.normalMatrix),Mt.setValue(w,"modelMatrix",O.matrixWorld),W.isShaderMaterial||W.isRawShaderMaterial){let rn=W.uniformsGroups;for(let Ra=0,Vf=rn.length;Ra<Vf;Ra++){let mu=rn[Ra];U.update(mu,un),U.bind(mu,un)}}return un}function zf(E,k){E.ambientLightColor.needsUpdate=k,E.lightProbe.needsUpdate=k,E.directionalLights.needsUpdate=k,E.directionalLightShadows.needsUpdate=k,E.pointLights.needsUpdate=k,E.pointLightShadows.needsUpdate=k,E.spotLights.needsUpdate=k,E.spotLightShadows.needsUpdate=k,E.rectAreaLights.needsUpdate=k,E.hemisphereLights.needsUpdate=k}function Hf(E){return E.isMeshLambertMaterial||E.isMeshToonMaterial||E.isMeshPhongMaterial||E.isMeshStandardMaterial||E.isShadowMaterial||E.isShaderMaterial&&E.lights===!0}this.getActiveCubeFace=function(){return D},this.getActiveMipmapLevel=function(){return A},this.getRenderTarget=function(){return C},this.setRenderTargetTextures=function(E,k,G){Se.get(E.texture).__webglTexture=k,Se.get(E.depthTexture).__webglTexture=G;let W=Se.get(E);W.__hasExternalTextures=!0,W.__autoAllocateDepthBuffer=G===void 0,W.__autoAllocateDepthBuffer||fe.has("WEBGL_multisampled_render_to_texture")===!0&&(console.warn("THREE.WebGLRenderer: Render-to-texture extension was disabled because an external texture was provided"),W.__useRenderToTexture=!1)},this.setRenderTargetFramebuffer=function(E,k){let G=Se.get(E);G.__webglFramebuffer=k,G.__useDefaultFramebuffer=k===void 0},this.setRenderTarget=function(E,k=0,G=0){C=E,D=k,A=G;let W=!0,O=null,de=!1,Te=!1;if(E){let Le=Se.get(E);if(Le.__useDefaultFramebuffer!==void 0)me.bindFramebuffer(w.FRAMEBUFFER,null),W=!1;else if(Le.__webglFramebuffer===void 0)T.setupRenderTarget(E);else if(Le.__hasExternalTextures)T.rebindTextures(E,Se.get(E.texture).__webglTexture,Se.get(E.depthTexture).__webglTexture);else if(E.depthBuffer){let ke=E.depthTexture;if(Le.__boundDepthTexture!==ke){if(ke!==null&&Se.has(ke)&&(E.width!==ke.image.width||E.height!==ke.image.height))throw new Error("WebGLRenderTarget: Attached DepthTexture is initialized to the incorrect size.");T.setupDepthRenderbuffer(E)}}let Ge=E.texture;(Ge.isData3DTexture||Ge.isDataArrayTexture||Ge.isCompressedArrayTexture)&&(Te=!0);let We=Se.get(E).__webglFramebuffer;E.isWebGLCubeRenderTarget?(Array.isArray(We[k])?O=We[k][G]:O=We[k],de=!0):E.samples>0&&T.useMultisampledRTT(E)===!1?O=Se.get(E).__webglMultisampledFramebuffer:Array.isArray(We)?O=We[G]:O=We,_.copy(E.viewport),S.copy(E.scissor),L=E.scissorTest}else _.copy(be).multiplyScalar(se).floor(),S.copy(Me).multiplyScalar(se).floor(),L=Ke;if(me.bindFramebuffer(w.FRAMEBUFFER,O)&&W&&me.drawBuffers(E,O),me.viewport(_),me.scissor(S),me.setScissorTest(L),de){let Le=Se.get(E.texture);w.framebufferTexture2D(w.FRAMEBUFFER,w.COLOR_ATTACHMENT0,w.TEXTURE_CUBE_MAP_POSITIVE_X+k,Le.__webglTexture,G)}else if(Te){let Le=Se.get(E.texture),Ge=k||0;w.framebufferTextureLayer(w.FRAMEBUFFER,w.COLOR_ATTACHMENT0,Le.__webglTexture,G||0,Ge)}P=-1},this.readRenderTargetPixels=function(E,k,G,W,O,de,Te){if(!(E&&E.isWebGLRenderTarget)){console.error("THREE.WebGLRenderer.readRenderTargetPixels: renderTarget is not THREE.WebGLRenderTarget.");return}let Pe=Se.get(E).__webglFramebuffer;if(E.isWebGLCubeRenderTarget&&Te!==void 0&&(Pe=Pe[Te]),Pe){me.bindFramebuffer(w.FRAMEBUFFER,Pe);try{let Le=E.texture,Ge=Le.format,We=Le.type;if(!ce.textureFormatReadable(Ge)){console.error("THREE.WebGLRenderer.readRenderTargetPixels: renderTarget is not in RGBA or implementation defined format.");return}if(!ce.textureTypeReadable(We)){console.error("THREE.WebGLRenderer.readRenderTargetPixels: renderTarget is not in UnsignedByteType or implementation defined type.");return}k>=0&&k<=E.width-W&&G>=0&&G<=E.height-O&&w.readPixels(k,G,W,O,Ve.convert(Ge),Ve.convert(We),de)}finally{let Le=C!==null?Se.get(C).__webglFramebuffer:null;me.bindFramebuffer(w.FRAMEBUFFER,Le)}}},this.readRenderTargetPixelsAsync=async function(E,k,G,W,O,de,Te){if(!(E&&E.isWebGLRenderTarget))throw new Error("THREE.WebGLRenderer.readRenderTargetPixels: renderTarget is not THREE.WebGLRenderTarget.");let Pe=Se.get(E).__webglFramebuffer;if(E.isWebGLCubeRenderTarget&&Te!==void 0&&(Pe=Pe[Te]),Pe){let Le=E.texture,Ge=Le.format,We=Le.type;if(!ce.textureFormatReadable(Ge))throw new Error("THREE.WebGLRenderer.readRenderTargetPixelsAsync: renderTarget is not in RGBA or implementation defined format.");if(!ce.textureTypeReadable(We))throw new Error("THREE.WebGLRenderer.readRenderTargetPixelsAsync: renderTarget is not in UnsignedByteType or implementation defined type.");if(k>=0&&k<=E.width-W&&G>=0&&G<=E.height-O){me.bindFramebuffer(w.FRAMEBUFFER,Pe);let ke=w.createBuffer();w.bindBuffer(w.PIXEL_PACK_BUFFER,ke),w.bufferData(w.PIXEL_PACK_BUFFER,de.byteLength,w.STREAM_READ),w.readPixels(k,G,W,O,Ve.convert(Ge),Ve.convert(We),0);let ht=C!==null?Se.get(C).__webglFramebuffer:null;me.bindFramebuffer(w.FRAMEBUFFER,ht);let mt=w.fenceSync(w.SYNC_GPU_COMMANDS_COMPLETE,0);return w.flush(),await em(w,mt,4),w.bindBuffer(w.PIXEL_PACK_BUFFER,ke),w.getBufferSubData(w.PIXEL_PACK_BUFFER,0,de),w.deleteBuffer(ke),w.deleteSync(mt),de}else throw new Error("THREE.WebGLRenderer.readRenderTargetPixelsAsync: requested read bounds are out of range.")}},this.copyFramebufferToTexture=function(E,k=null,G=0){E.isTexture!==!0&&(ho("WebGLRenderer: copyFramebufferToTexture function signature has changed."),k=arguments[0]||null,E=arguments[1]);let W=Math.pow(2,-G),O=Math.floor(E.image.width*W),de=Math.floor(E.image.height*W),Te=k!==null?k.x:0,Pe=k!==null?k.y:0;T.setTexture2D(E,0),w.copyTexSubImage2D(w.TEXTURE_2D,G,0,0,Te,Pe,O,de),me.unbindTexture()},this.copyTextureToTexture=function(E,k,G=null,W=null,O=0){E.isTexture!==!0&&(ho("WebGLRenderer: copyTextureToTexture function signature has changed."),W=arguments[0]||null,E=arguments[1],k=arguments[2],O=arguments[3]||0,G=null);let de,Te,Pe,Le,Ge,We;G!==null?(de=G.max.x-G.min.x,Te=G.max.y-G.min.y,Pe=G.min.x,Le=G.min.y):(de=E.image.width,Te=E.image.height,Pe=0,Le=0),W!==null?(Ge=W.x,We=W.y):(Ge=0,We=0);let ke=Ve.convert(k.format),ht=Ve.convert(k.type);T.setTexture2D(k,0),w.pixelStorei(w.UNPACK_FLIP_Y_WEBGL,k.flipY),w.pixelStorei(w.UNPACK_PREMULTIPLY_ALPHA_WEBGL,k.premultiplyAlpha),w.pixelStorei(w.UNPACK_ALIGNMENT,k.unpackAlignment);let mt=w.getParameter(w.UNPACK_ROW_LENGTH),vt=w.getParameter(w.UNPACK_IMAGE_HEIGHT),jt=w.getParameter(w.UNPACK_SKIP_PIXELS),ot=w.getParameter(w.UNPACK_SKIP_ROWS),Fe=w.getParameter(w.UNPACK_SKIP_IMAGES),Dt=E.isCompressedTexture?E.mipmaps[O]:E.image;w.pixelStorei(w.UNPACK_ROW_LENGTH,Dt.width),w.pixelStorei(w.UNPACK_IMAGE_HEIGHT,Dt.height),w.pixelStorei(w.UNPACK_SKIP_PIXELS,Pe),w.pixelStorei(w.UNPACK_SKIP_ROWS,Le),E.isDataTexture?w.texSubImage2D(w.TEXTURE_2D,O,Ge,We,de,Te,ke,ht,Dt.data):E.isCompressedTexture?w.compressedTexSubImage2D(w.TEXTURE_2D,O,Ge,We,Dt.width,Dt.height,ke,Dt.data):w.texSubImage2D(w.TEXTURE_2D,O,Ge,We,de,Te,ke,ht,Dt),w.pixelStorei(w.UNPACK_ROW_LENGTH,mt),w.pixelStorei(w.UNPACK_IMAGE_HEIGHT,vt),w.pixelStorei(w.UNPACK_SKIP_PIXELS,jt),w.pixelStorei(w.UNPACK_SKIP_ROWS,ot),w.pixelStorei(w.UNPACK_SKIP_IMAGES,Fe),O===0&&k.generateMipmaps&&w.generateMipmap(w.TEXTURE_2D),me.unbindTexture()},this.copyTextureToTexture3D=function(E,k,G=null,W=null,O=0){E.isTexture!==!0&&(ho("WebGLRenderer: copyTextureToTexture3D function signature has changed."),G=arguments[0]||null,W=arguments[1]||null,E=arguments[2],k=arguments[3],O=arguments[4]||0);let de,Te,Pe,Le,Ge,We,ke,ht,mt,vt=E.isCompressedTexture?E.mipmaps[O]:E.image;G!==null?(de=G.max.x-G.min.x,Te=G.max.y-G.min.y,Pe=G.max.z-G.min.z,Le=G.min.x,Ge=G.min.y,We=G.min.z):(de=vt.width,Te=vt.height,Pe=vt.depth,Le=0,Ge=0,We=0),W!==null?(ke=W.x,ht=W.y,mt=W.z):(ke=0,ht=0,mt=0);let jt=Ve.convert(k.format),ot=Ve.convert(k.type),Fe;if(k.isData3DTexture)T.setTexture3D(k,0),Fe=w.TEXTURE_3D;else if(k.isDataArrayTexture||k.isCompressedArrayTexture)T.setTexture2DArray(k,0),Fe=w.TEXTURE_2D_ARRAY;else{console.warn("THREE.WebGLRenderer.copyTextureToTexture3D: only supports THREE.DataTexture3D and THREE.DataTexture2DArray.");return}w.pixelStorei(w.UNPACK_FLIP_Y_WEBGL,k.flipY),w.pixelStorei(w.UNPACK_PREMULTIPLY_ALPHA_WEBGL,k.premultiplyAlpha),w.pixelStorei(w.UNPACK_ALIGNMENT,k.unpackAlignment);let Dt=w.getParameter(w.UNPACK_ROW_LENGTH),at=w.getParameter(w.UNPACK_IMAGE_HEIGHT),un=w.getParameter(w.UNPACK_SKIP_PIXELS),Ni=w.getParameter(w.UNPACK_SKIP_ROWS),Kt=w.getParameter(w.UNPACK_SKIP_IMAGES);w.pixelStorei(w.UNPACK_ROW_LENGTH,vt.width),w.pixelStorei(w.UNPACK_IMAGE_HEIGHT,vt.height),w.pixelStorei(w.UNPACK_SKIP_PIXELS,Le),w.pixelStorei(w.UNPACK_SKIP_ROWS,Ge),w.pixelStorei(w.UNPACK_SKIP_IMAGES,We),E.isDataTexture||E.isData3DTexture?w.texSubImage3D(Fe,O,ke,ht,mt,de,Te,Pe,jt,ot,vt.data):k.isCompressedArrayTexture?w.compressedTexSubImage3D(Fe,O,ke,ht,mt,de,Te,Pe,jt,vt.data):w.texSubImage3D(Fe,O,ke,ht,mt,de,Te,Pe,jt,ot,vt),w.pixelStorei(w.UNPACK_ROW_LENGTH,Dt),w.pixelStorei(w.UNPACK_IMAGE_HEIGHT,at),w.pixelStorei(w.UNPACK_SKIP_PIXELS,un),w.pixelStorei(w.UNPACK_SKIP_ROWS,Ni),w.pixelStorei(w.UNPACK_SKIP_IMAGES,Kt),O===0&&k.generateMipmaps&&w.generateMipmap(Fe),me.unbindTexture()},this.initRenderTarget=function(E){Se.get(E).__webglFramebuffer===void 0&&T.setupRenderTarget(E)},this.initTexture=function(E){E.isCubeTexture?T.setTextureCube(E,0):E.isData3DTexture?T.setTexture3D(E,0):E.isDataArrayTexture||E.isCompressedArrayTexture?T.setTexture2DArray(E,0):T.setTexture2D(E,0),me.unbindTexture()},this.resetState=function(){D=0,A=0,C=null,me.reset(),it.reset()},typeof __THREE_DEVTOOLS__!="undefined"&&__THREE_DEVTOOLS__.dispatchEvent(new CustomEvent("observe",{detail:this}))}get coordinateSystem(){return zn}get outputColorSpace(){return this._outputColorSpace}set outputColorSpace(e){this._outputColorSpace=e;let t=this.getContext();t.drawingBufferColorSpace=e===Yl?"display-p3":"srgb",t.unpackColorSpace=ct.workingColorSpace===Yo?"display-p3":"srgb"}};var Ro=class i{constructor(e,t=1,n=1e3){this.isFog=!0,this.name="",this.color=new Qe(e),this.near=t,this.far=n}clone(){return new i(this.color,this.near,this.far)}toJSON(){return{type:"Fog",name:this.name,color:this.color.getHex(),near:this.near,far:this.far}}},js=class extends Nt{constructor(){super(),this.isScene=!0,this.type="Scene",this.background=null,this.environment=null,this.fog=null,this.backgroundBlurriness=0,this.backgroundIntensity=1,this.backgroundRotation=new En,this.environmentIntensity=1,this.environmentRotation=new En,this.overrideMaterial=null,typeof __THREE_DEVTOOLS__!="undefined"&&__THREE_DEVTOOLS__.dispatchEvent(new CustomEvent("observe",{detail:this}))}copy(e,t){return super.copy(e,t),e.background!==null&&(this.background=e.background.clone()),e.environment!==null&&(this.environment=e.environment.clone()),e.fog!==null&&(this.fog=e.fog.clone()),this.backgroundBlurriness=e.backgroundBlurriness,this.backgroundIntensity=e.backgroundIntensity,this.backgroundRotation.copy(e.backgroundRotation),this.environmentIntensity=e.environmentIntensity,this.environmentRotation.copy(e.environmentRotation),e.overrideMaterial!==null&&(this.overrideMaterial=e.overrideMaterial.clone()),this.matrixAutoUpdate=e.matrixAutoUpdate,this}toJSON(e){let t=super.toJSON(e);return this.fog!==null&&(t.object.fog=this.fog.toJSON()),this.backgroundBlurriness>0&&(t.object.backgroundBlurriness=this.backgroundBlurriness),this.backgroundIntensity!==1&&(t.object.backgroundIntensity=this.backgroundIntensity),t.object.backgroundRotation=this.backgroundRotation.toArray(),this.environmentIntensity!==1&&(t.object.environmentIntensity=this.environmentIntensity),t.object.environmentRotation=this.environmentRotation.toArray(),t}},pl=class{constructor(e,t){this.isInterleavedBuffer=!0,this.array=e,this.stride=t,this.count=e!==void 0?e.length/t:0,this.usage=jc,this.updateRanges=[],this.version=0,this.uuid=Mn()}onUploadCallback(){}set needsUpdate(e){e===!0&&this.version++}setUsage(e){return this.usage=e,this}addUpdateRange(e,t){this.updateRanges.push({start:e,count:t})}clearUpdateRanges(){this.updateRanges.length=0}copy(e){return this.array=new e.array.constructor(e.array),this.count=e.count,this.stride=e.stride,this.usage=e.usage,this}copyAt(e,t,n){e*=this.stride,n*=t.stride;for(let s=0,r=this.stride;s<r;s++)this.array[e+s]=t.array[n+s];return this}set(e,t=0){return this.array.set(e,t),this}clone(e){e.arrayBuffers===void 0&&(e.arrayBuffers={}),this.array.buffer._uuid===void 0&&(this.array.buffer._uuid=Mn()),e.arrayBuffers[this.array.buffer._uuid]===void 0&&(e.arrayBuffers[this.array.buffer._uuid]=this.array.slice(0).buffer);let t=new this.array.constructor(e.arrayBuffers[this.array.buffer._uuid]),n=new this.constructor(t,this.stride);return n.setUsage(this.usage),n}onUpload(e){return this.onUploadCallback=e,this}toJSON(e){return e.arrayBuffers===void 0&&(e.arrayBuffers={}),this.array.buffer._uuid===void 0&&(this.array.buffer._uuid=Mn()),e.arrayBuffers[this.array.buffer._uuid]===void 0&&(e.arrayBuffers[this.array.buffer._uuid]=Array.from(new Uint32Array(this.array.buffer))),{uuid:this.uuid,buffer:this.array.buffer._uuid,type:this.array.constructor.name,stride:this.stride}}},Gt=new R,Po=class i{constructor(e,t,n,s=!1){this.isInterleavedBufferAttribute=!0,this.name="",this.data=e,this.itemSize=t,this.offset=n,this.normalized=s}get count(){return this.data.count}get array(){return this.data.array}set needsUpdate(e){this.data.needsUpdate=e}applyMatrix4(e){for(let t=0,n=this.data.count;t<n;t++)Gt.fromBufferAttribute(this,t),Gt.applyMatrix4(e),this.setXYZ(t,Gt.x,Gt.y,Gt.z);return this}applyNormalMatrix(e){for(let t=0,n=this.count;t<n;t++)Gt.fromBufferAttribute(this,t),Gt.applyNormalMatrix(e),this.setXYZ(t,Gt.x,Gt.y,Gt.z);return this}transformDirection(e){for(let t=0,n=this.count;t<n;t++)Gt.fromBufferAttribute(this,t),Gt.transformDirection(e),this.setXYZ(t,Gt.x,Gt.y,Gt.z);return this}getComponent(e,t){let n=this.array[e*this.data.stride+this.offset+t];return this.normalized&&(n=gn(n,this.array)),n}setComponent(e,t,n){return this.normalized&&(n=ut(n,this.array)),this.data.array[e*this.data.stride+this.offset+t]=n,this}setX(e,t){return this.normalized&&(t=ut(t,this.array)),this.data.array[e*this.data.stride+this.offset]=t,this}setY(e,t){return this.normalized&&(t=ut(t,this.array)),this.data.array[e*this.data.stride+this.offset+1]=t,this}setZ(e,t){return this.normalized&&(t=ut(t,this.array)),this.data.array[e*this.data.stride+this.offset+2]=t,this}setW(e,t){return this.normalized&&(t=ut(t,this.array)),this.data.array[e*this.data.stride+this.offset+3]=t,this}getX(e){let t=this.data.array[e*this.data.stride+this.offset];return this.normalized&&(t=gn(t,this.array)),t}getY(e){let t=this.data.array[e*this.data.stride+this.offset+1];return this.normalized&&(t=gn(t,this.array)),t}getZ(e){let t=this.data.array[e*this.data.stride+this.offset+2];return this.normalized&&(t=gn(t,this.array)),t}getW(e){let t=this.data.array[e*this.data.stride+this.offset+3];return this.normalized&&(t=gn(t,this.array)),t}setXY(e,t,n){return e=e*this.data.stride+this.offset,this.normalized&&(t=ut(t,this.array),n=ut(n,this.array)),this.data.array[e+0]=t,this.data.array[e+1]=n,this}setXYZ(e,t,n,s){return e=e*this.data.stride+this.offset,this.normalized&&(t=ut(t,this.array),n=ut(n,this.array),s=ut(s,this.array)),this.data.array[e+0]=t,this.data.array[e+1]=n,this.data.array[e+2]=s,this}setXYZW(e,t,n,s,r){return e=e*this.data.stride+this.offset,this.normalized&&(t=ut(t,this.array),n=ut(n,this.array),s=ut(s,this.array),r=ut(r,this.array)),this.data.array[e+0]=t,this.data.array[e+1]=n,this.data.array[e+2]=s,this.data.array[e+3]=r,this}clone(e){if(e===void 0){console.log("THREE.InterleavedBufferAttribute.clone(): Cloning an interleaved buffer attribute will de-interleave buffer data.");let t=[];for(let n=0;n<this.count;n++){let s=n*this.data.stride+this.offset;for(let r=0;r<this.itemSize;r++)t.push(this.data.array[s+r])}return new tn(new this.array.constructor(t),this.itemSize,this.normalized)}else return e.interleavedBuffers===void 0&&(e.interleavedBuffers={}),e.interleavedBuffers[this.data.uuid]===void 0&&(e.interleavedBuffers[this.data.uuid]=this.data.clone(e)),new i(e.interleavedBuffers[this.data.uuid],this.itemSize,this.offset,this.normalized)}toJSON(e){if(e===void 0){console.log("THREE.InterleavedBufferAttribute.toJSON(): Serializing an interleaved buffer attribute will de-interleave buffer data.");let t=[];for(let n=0;n<this.count;n++){let s=n*this.data.stride+this.offset;for(let r=0;r<this.itemSize;r++)t.push(this.data.array[s+r])}return{itemSize:this.itemSize,type:this.array.constructor.name,array:t,normalized:this.normalized}}else return e.interleavedBuffers===void 0&&(e.interleavedBuffers={}),e.interleavedBuffers[this.data.uuid]===void 0&&(e.interleavedBuffers[this.data.uuid]=this.data.toJSON(e)),{isInterleavedBufferAttribute:!0,itemSize:this.itemSize,data:this.data.uuid,offset:this.offset,normalized:this.normalized}}},Ks=class extends Gn{constructor(e){super(),this.isSpriteMaterial=!0,this.type="SpriteMaterial",this.color=new Qe(16777215),this.map=null,this.alphaMap=null,this.rotation=0,this.sizeAttenuation=!0,this.transparent=!0,this.fog=!0,this.setValues(e)}copy(e){return super.copy(e),this.color.copy(e.color),this.map=e.map,this.alphaMap=e.alphaMap,this.rotation=e.rotation,this.sizeAttenuation=e.sizeAttenuation,this.fog=e.fog,this}},Zi,Us=new R,ji=new R,Ki=new R,Qi=new le,Ns=new le,Jd=new _t,Zr=new R,ks=new R,jr=new R,pd=new le,rc=new le,md=new le,Io=class extends Nt{constructor(e=new Ks){if(super(),this.isSprite=!0,this.type="Sprite",Zi===void 0){Zi=new It;let t=new Float32Array([-.5,-.5,0,0,0,.5,-.5,0,1,0,.5,.5,0,1,1,-.5,.5,0,0,1]),n=new pl(t,5);Zi.setIndex([0,1,2,0,2,3]),Zi.setAttribute("position",new Po(n,3,0,!1)),Zi.setAttribute("uv",new Po(n,2,3,!1))}this.geometry=Zi,this.material=e,this.center=new le(.5,.5)}raycast(e,t){e.camera===null&&console.error('THREE.Sprite: "Raycaster.camera" needs to be set in order to raycast against sprites.'),ji.setFromMatrixScale(this.matrixWorld),Jd.copy(e.camera.matrixWorld),this.modelViewMatrix.multiplyMatrices(e.camera.matrixWorldInverse,this.matrixWorld),Ki.setFromMatrixPosition(this.modelViewMatrix),e.camera.isPerspectiveCamera&&this.material.sizeAttenuation===!1&&ji.multiplyScalar(-Ki.z);let n=this.material.rotation,s,r;n!==0&&(r=Math.cos(n),s=Math.sin(n));let o=this.center;Kr(Zr.set(-.5,-.5,0),Ki,o,ji,s,r),Kr(ks.set(.5,-.5,0),Ki,o,ji,s,r),Kr(jr.set(.5,.5,0),Ki,o,ji,s,r),pd.set(0,0),rc.set(1,0),md.set(1,1);let a=e.ray.intersectTriangle(Zr,ks,jr,!1,Us);if(a===null&&(Kr(ks.set(-.5,.5,0),Ki,o,ji,s,r),rc.set(0,1),a=e.ray.intersectTriangle(Zr,jr,ks,!1,Us),a===null))return;let c=e.ray.origin.distanceTo(Us);c<e.near||c>e.far||t.push({distance:c,point:Us.clone(),uv:ei.getInterpolation(Us,Zr,ks,jr,pd,rc,md,new le),face:null,object:this})}copy(e,t){return super.copy(e,t),e.center!==void 0&&this.center.copy(e.center),this.material=e.material,this}};function Kr(i,e,t,n,s,r){Qi.subVectors(i,t).addScalar(.5).multiply(n),s!==void 0?(Ns.x=r*Qi.x-s*Qi.y,Ns.y=s*Qi.x+r*Qi.y):Ns.copy(Qi),i.copy(e),i.x+=Ns.x,i.y+=Ns.y,i.applyMatrix4(Jd)}var Qs=class extends Gn{constructor(e){super(),this.isLineBasicMaterial=!0,this.type="LineBasicMaterial",this.color=new Qe(16777215),this.map=null,this.linewidth=1,this.linecap="round",this.linejoin="round",this.fog=!0,this.setValues(e)}copy(e){return super.copy(e),this.color.copy(e.color),this.map=e.map,this.linewidth=e.linewidth,this.linecap=e.linecap,this.linejoin=e.linejoin,this.fog=e.fog,this}},Lo=new R,Do=new R,gd=new _t,Os=new vo,Qr=new us,oc=new R,_d=new R,Uo=class extends Nt{constructor(e=new It,t=new Qs){super(),this.isLine=!0,this.type="Line",this.geometry=e,this.material=t,this.updateMorphTargets()}copy(e,t){return super.copy(e,t),this.material=Array.isArray(e.material)?e.material.slice():e.material,this.geometry=e.geometry,this}computeLineDistances(){let e=this.geometry;if(e.index===null){let t=e.attributes.position,n=[0];for(let s=1,r=t.count;s<r;s++)Lo.fromBufferAttribute(t,s-1),Do.fromBufferAttribute(t,s),n[s]=n[s-1],n[s]+=Lo.distanceTo(Do);e.setAttribute("lineDistance",new lt(n,1))}else console.warn("THREE.Line.computeLineDistances(): Computation only possible with non-indexed BufferGeometry.");return this}raycast(e,t){let n=this.geometry,s=this.matrixWorld,r=e.params.Line.threshold,o=n.drawRange;if(n.boundingSphere===null&&n.computeBoundingSphere(),Qr.copy(n.boundingSphere),Qr.applyMatrix4(s),Qr.radius+=r,e.ray.intersectsSphere(Qr)===!1)return;gd.copy(s).invert(),Os.copy(e.ray).applyMatrix4(gd);let a=r/((this.scale.x+this.scale.y+this.scale.z)/3),c=a*a,l=this.isLineSegments?2:1,h=n.index,d=n.attributes.position;if(h!==null){let f=Math.max(0,o.start),g=Math.min(h.count,o.start+o.count);for(let y=f,m=g-1;y<m;y+=l){let p=h.getX(y),M=h.getX(y+1),x=eo(this,e,Os,c,p,M);x&&t.push(x)}if(this.isLineLoop){let y=h.getX(g-1),m=h.getX(f),p=eo(this,e,Os,c,y,m);p&&t.push(p)}}else{let f=Math.max(0,o.start),g=Math.min(d.count,o.start+o.count);for(let y=f,m=g-1;y<m;y+=l){let p=eo(this,e,Os,c,y,y+1);p&&t.push(p)}if(this.isLineLoop){let y=eo(this,e,Os,c,g-1,f);y&&t.push(y)}}}updateMorphTargets(){let t=this.geometry.morphAttributes,n=Object.keys(t);if(n.length>0){let s=t[n[0]];if(s!==void 0){this.morphTargetInfluences=[],this.morphTargetDictionary={};for(let r=0,o=s.length;r<o;r++){let a=s[r].name||String(r);this.morphTargetInfluences.push(0),this.morphTargetDictionary[a]=r}}}}};function eo(i,e,t,n,s,r){let o=i.geometry.attributes.position;if(Lo.fromBufferAttribute(o,s),Do.fromBufferAttribute(o,r),t.distanceSqToSegment(Lo,Do,oc,_d)>n)return;oc.applyMatrix4(i.matrixWorld);let c=e.ray.origin.distanceTo(oc);if(!(c<e.near||c>e.far))return{distance:c,point:_d.clone().applyMatrix4(i.matrixWorld),index:s,face:null,faceIndex:null,barycoord:null,object:i}}var Mi=class extends nn{constructor(e,t,n,s,r,o,a,c,l){super(e,t,n,s,r,o,a,c,l),this.isCanvasTexture=!0,this.needsUpdate=!0}},hn=class{constructor(){this.type="Curve",this.arcLengthDivisions=200}getPoint(){return console.warn("THREE.Curve: .getPoint() not implemented."),null}getPointAt(e,t){let n=this.getUtoTmapping(e);return this.getPoint(n,t)}getPoints(e=5){let t=[];for(let n=0;n<=e;n++)t.push(this.getPoint(n/e));return t}getSpacedPoints(e=5){let t=[];for(let n=0;n<=e;n++)t.push(this.getPointAt(n/e));return t}getLength(){let e=this.getLengths();return e[e.length-1]}getLengths(e=this.arcLengthDivisions){if(this.cacheArcLengths&&this.cacheArcLengths.length===e+1&&!this.needsUpdate)return this.cacheArcLengths;this.needsUpdate=!1;let t=[],n,s=this.getPoint(0),r=0;t.push(0);for(let o=1;o<=e;o++)n=this.getPoint(o/e),r+=n.distanceTo(s),t.push(r),s=n;return this.cacheArcLengths=t,t}updateArcLengths(){this.needsUpdate=!0,this.getLengths()}getUtoTmapping(e,t){let n=this.getLengths(),s=0,r=n.length,o;t?o=t:o=e*n[r-1];let a=0,c=r-1,l;for(;a<=c;)if(s=Math.floor(a+(c-a)/2),l=n[s]-o,l<0)a=s+1;else if(l>0)c=s-1;else{c=s;break}if(s=c,n[s]===o)return s/(r-1);let h=n[s],d=n[s+1]-h,f=(o-h)/d;return(s+f)/(r-1)}getTangent(e,t){let s=e-1e-4,r=e+1e-4;s<0&&(s=0),r>1&&(r=1);let o=this.getPoint(s),a=this.getPoint(r),c=t||(o.isVector2?new le:new R);return c.copy(a).sub(o).normalize(),c}getTangentAt(e,t){let n=this.getUtoTmapping(e);return this.getTangent(n,t)}computeFrenetFrames(e,t){let n=new R,s=[],r=[],o=[],a=new R,c=new _t;for(let f=0;f<=e;f++){let g=f/e;s[f]=this.getTangentAt(g,new R)}r[0]=new R,o[0]=new R;let l=Number.MAX_VALUE,h=Math.abs(s[0].x),u=Math.abs(s[0].y),d=Math.abs(s[0].z);h<=l&&(l=h,n.set(1,0,0)),u<=l&&(l=u,n.set(0,1,0)),d<=l&&n.set(0,0,1),a.crossVectors(s[0],n).normalize(),r[0].crossVectors(s[0],a),o[0].crossVectors(s[0],r[0]);for(let f=1;f<=e;f++){if(r[f]=r[f-1].clone(),o[f]=o[f-1].clone(),a.crossVectors(s[f-1],s[f]),a.length()>Number.EPSILON){a.normalize();let g=Math.acos(Pt(s[f-1].dot(s[f]),-1,1));r[f].applyMatrix4(c.makeRotationAxis(a,g))}o[f].crossVectors(s[f],r[f])}if(t===!0){let f=Math.acos(Pt(r[0].dot(r[e]),-1,1));f/=e,s[0].dot(a.crossVectors(r[0],r[e]))>0&&(f=-f);for(let g=1;g<=e;g++)r[g].applyMatrix4(c.makeRotationAxis(s[g],f*g)),o[g].crossVectors(s[g],r[g])}return{tangents:s,normals:r,binormals:o}}clone(){return new this.constructor().copy(this)}copy(e){return this.arcLengthDivisions=e.arcLengthDivisions,this}toJSON(){let e={metadata:{version:4.6,type:"Curve",generator:"Curve.toJSON"}};return e.arcLengthDivisions=this.arcLengthDivisions,e.type=this.type,e}fromJSON(e){return this.arcLengthDivisions=e.arcLengthDivisions,this}},er=class extends hn{constructor(e=0,t=0,n=1,s=1,r=0,o=Math.PI*2,a=!1,c=0){super(),this.isEllipseCurve=!0,this.type="EllipseCurve",this.aX=e,this.aY=t,this.xRadius=n,this.yRadius=s,this.aStartAngle=r,this.aEndAngle=o,this.aClockwise=a,this.aRotation=c}getPoint(e,t=new le){let n=t,s=Math.PI*2,r=this.aEndAngle-this.aStartAngle,o=Math.abs(r)<Number.EPSILON;for(;r<0;)r+=s;for(;r>s;)r-=s;r<Number.EPSILON&&(o?r=0:r=s),this.aClockwise===!0&&!o&&(r===s?r=-s:r=r-s);let a=this.aStartAngle+e*r,c=this.aX+this.xRadius*Math.cos(a),l=this.aY+this.yRadius*Math.sin(a);if(this.aRotation!==0){let h=Math.cos(this.aRotation),u=Math.sin(this.aRotation),d=c-this.aX,f=l-this.aY;c=d*h-f*u+this.aX,l=d*u+f*h+this.aY}return n.set(c,l)}copy(e){return super.copy(e),this.aX=e.aX,this.aY=e.aY,this.xRadius=e.xRadius,this.yRadius=e.yRadius,this.aStartAngle=e.aStartAngle,this.aEndAngle=e.aEndAngle,this.aClockwise=e.aClockwise,this.aRotation=e.aRotation,this}toJSON(){let e=super.toJSON();return e.aX=this.aX,e.aY=this.aY,e.xRadius=this.xRadius,e.yRadius=this.yRadius,e.aStartAngle=this.aStartAngle,e.aEndAngle=this.aEndAngle,e.aClockwise=this.aClockwise,e.aRotation=this.aRotation,e}fromJSON(e){return super.fromJSON(e),this.aX=e.aX,this.aY=e.aY,this.xRadius=e.xRadius,this.yRadius=e.yRadius,this.aStartAngle=e.aStartAngle,this.aEndAngle=e.aEndAngle,this.aClockwise=e.aClockwise,this.aRotation=e.aRotation,this}},ml=class extends er{constructor(e,t,n,s,r,o){super(e,t,n,n,s,r,o),this.isArcCurve=!0,this.type="ArcCurve"}};function Kl(){let i=0,e=0,t=0,n=0;function s(r,o,a,c){i=r,e=a,t=-3*r+3*o-2*a-c,n=2*r-2*o+a+c}return{initCatmullRom:function(r,o,a,c,l){s(o,a,l*(a-r),l*(c-o))},initNonuniformCatmullRom:function(r,o,a,c,l,h,u){let d=(o-r)/l-(a-r)/(l+h)+(a-o)/h,f=(a-o)/h-(c-o)/(h+u)+(c-a)/u;d*=h,f*=h,s(o,a,d,f)},calc:function(r){let o=r*r,a=o*r;return i+e*r+t*o+n*a}}}var to=new R,ac=new Kl,cc=new Kl,lc=new Kl,gl=class extends hn{constructor(e=[],t=!1,n="centripetal",s=.5){super(),this.isCatmullRomCurve3=!0,this.type="CatmullRomCurve3",this.points=e,this.closed=t,this.curveType=n,this.tension=s}getPoint(e,t=new R){let n=t,s=this.points,r=s.length,o=(r-(this.closed?0:1))*e,a=Math.floor(o),c=o-a;this.closed?a+=a>0?0:(Math.floor(Math.abs(a)/r)+1)*r:c===0&&a===r-1&&(a=r-2,c=1);let l,h;this.closed||a>0?l=s[(a-1)%r]:(to.subVectors(s[0],s[1]).add(s[0]),l=to);let u=s[a%r],d=s[(a+1)%r];if(this.closed||a+2<r?h=s[(a+2)%r]:(to.subVectors(s[r-1],s[r-2]).add(s[r-1]),h=to),this.curveType==="centripetal"||this.curveType==="chordal"){let f=this.curveType==="chordal"?.5:.25,g=Math.pow(l.distanceToSquared(u),f),y=Math.pow(u.distanceToSquared(d),f),m=Math.pow(d.distanceToSquared(h),f);y<1e-4&&(y=1),g<1e-4&&(g=y),m<1e-4&&(m=y),ac.initNonuniformCatmullRom(l.x,u.x,d.x,h.x,g,y,m),cc.initNonuniformCatmullRom(l.y,u.y,d.y,h.y,g,y,m),lc.initNonuniformCatmullRom(l.z,u.z,d.z,h.z,g,y,m)}else this.curveType==="catmullrom"&&(ac.initCatmullRom(l.x,u.x,d.x,h.x,this.tension),cc.initCatmullRom(l.y,u.y,d.y,h.y,this.tension),lc.initCatmullRom(l.z,u.z,d.z,h.z,this.tension));return n.set(ac.calc(c),cc.calc(c),lc.calc(c)),n}copy(e){super.copy(e),this.points=[];for(let t=0,n=e.points.length;t<n;t++){let s=e.points[t];this.points.push(s.clone())}return this.closed=e.closed,this.curveType=e.curveType,this.tension=e.tension,this}toJSON(){let e=super.toJSON();e.points=[];for(let t=0,n=this.points.length;t<n;t++){let s=this.points[t];e.points.push(s.toArray())}return e.closed=this.closed,e.curveType=this.curveType,e.tension=this.tension,e}fromJSON(e){super.fromJSON(e),this.points=[];for(let t=0,n=e.points.length;t<n;t++){let s=e.points[t];this.points.push(new R().fromArray(s))}return this.closed=e.closed,this.curveType=e.curveType,this.tension=e.tension,this}};function yd(i,e,t,n,s){let r=(n-e)*.5,o=(s-t)*.5,a=i*i,c=i*a;return(2*t-2*n+r+o)*c+(-3*t+3*n-2*r-o)*a+r*i+t}function Zy(i,e){let t=1-i;return t*t*e}function jy(i,e){return 2*(1-i)*i*e}function Ky(i,e){return i*i*e}function Gs(i,e,t,n){return Zy(i,e)+jy(i,t)+Ky(i,n)}function Qy(i,e){let t=1-i;return t*t*t*e}function ex(i,e){let t=1-i;return 3*t*t*i*e}function tx(i,e){return 3*(1-i)*i*i*e}function nx(i,e){return i*i*i*e}function Ws(i,e,t,n,s){return Qy(i,e)+ex(i,t)+tx(i,n)+nx(i,s)}var No=class extends hn{constructor(e=new le,t=new le,n=new le,s=new le){super(),this.isCubicBezierCurve=!0,this.type="CubicBezierCurve",this.v0=e,this.v1=t,this.v2=n,this.v3=s}getPoint(e,t=new le){let n=t,s=this.v0,r=this.v1,o=this.v2,a=this.v3;return n.set(Ws(e,s.x,r.x,o.x,a.x),Ws(e,s.y,r.y,o.y,a.y)),n}copy(e){return super.copy(e),this.v0.copy(e.v0),this.v1.copy(e.v1),this.v2.copy(e.v2),this.v3.copy(e.v3),this}toJSON(){let e=super.toJSON();return e.v0=this.v0.toArray(),e.v1=this.v1.toArray(),e.v2=this.v2.toArray(),e.v3=this.v3.toArray(),e}fromJSON(e){return super.fromJSON(e),this.v0.fromArray(e.v0),this.v1.fromArray(e.v1),this.v2.fromArray(e.v2),this.v3.fromArray(e.v3),this}},_l=class extends hn{constructor(e=new R,t=new R,n=new R,s=new R){super(),this.isCubicBezierCurve3=!0,this.type="CubicBezierCurve3",this.v0=e,this.v1=t,this.v2=n,this.v3=s}getPoint(e,t=new R){let n=t,s=this.v0,r=this.v1,o=this.v2,a=this.v3;return n.set(Ws(e,s.x,r.x,o.x,a.x),Ws(e,s.y,r.y,o.y,a.y),Ws(e,s.z,r.z,o.z,a.z)),n}copy(e){return super.copy(e),this.v0.copy(e.v0),this.v1.copy(e.v1),this.v2.copy(e.v2),this.v3.copy(e.v3),this}toJSON(){let e=super.toJSON();return e.v0=this.v0.toArray(),e.v1=this.v1.toArray(),e.v2=this.v2.toArray(),e.v3=this.v3.toArray(),e}fromJSON(e){return super.fromJSON(e),this.v0.fromArray(e.v0),this.v1.fromArray(e.v1),this.v2.fromArray(e.v2),this.v3.fromArray(e.v3),this}},ko=class extends hn{constructor(e=new le,t=new le){super(),this.isLineCurve=!0,this.type="LineCurve",this.v1=e,this.v2=t}getPoint(e,t=new le){let n=t;return e===1?n.copy(this.v2):(n.copy(this.v2).sub(this.v1),n.multiplyScalar(e).add(this.v1)),n}getPointAt(e,t){return this.getPoint(e,t)}getTangent(e,t=new le){return t.subVectors(this.v2,this.v1).normalize()}getTangentAt(e,t){return this.getTangent(e,t)}copy(e){return super.copy(e),this.v1.copy(e.v1),this.v2.copy(e.v2),this}toJSON(){let e=super.toJSON();return e.v1=this.v1.toArray(),e.v2=this.v2.toArray(),e}fromJSON(e){return super.fromJSON(e),this.v1.fromArray(e.v1),this.v2.fromArray(e.v2),this}},yl=class extends hn{constructor(e=new R,t=new R){super(),this.isLineCurve3=!0,this.type="LineCurve3",this.v1=e,this.v2=t}getPoint(e,t=new R){let n=t;return e===1?n.copy(this.v2):(n.copy(this.v2).sub(this.v1),n.multiplyScalar(e).add(this.v1)),n}getPointAt(e,t){return this.getPoint(e,t)}getTangent(e,t=new R){return t.subVectors(this.v2,this.v1).normalize()}getTangentAt(e,t){return this.getTangent(e,t)}copy(e){return super.copy(e),this.v1.copy(e.v1),this.v2.copy(e.v2),this}toJSON(){let e=super.toJSON();return e.v1=this.v1.toArray(),e.v2=this.v2.toArray(),e}fromJSON(e){return super.fromJSON(e),this.v1.fromArray(e.v1),this.v2.fromArray(e.v2),this}},Oo=class extends hn{constructor(e=new le,t=new le,n=new le){super(),this.isQuadraticBezierCurve=!0,this.type="QuadraticBezierCurve",this.v0=e,this.v1=t,this.v2=n}getPoint(e,t=new le){let n=t,s=this.v0,r=this.v1,o=this.v2;return n.set(Gs(e,s.x,r.x,o.x),Gs(e,s.y,r.y,o.y)),n}copy(e){return super.copy(e),this.v0.copy(e.v0),this.v1.copy(e.v1),this.v2.copy(e.v2),this}toJSON(){let e=super.toJSON();return e.v0=this.v0.toArray(),e.v1=this.v1.toArray(),e.v2=this.v2.toArray(),e}fromJSON(e){return super.fromJSON(e),this.v0.fromArray(e.v0),this.v1.fromArray(e.v1),this.v2.fromArray(e.v2),this}},xl=class extends hn{constructor(e=new R,t=new R,n=new R){super(),this.isQuadraticBezierCurve3=!0,this.type="QuadraticBezierCurve3",this.v0=e,this.v1=t,this.v2=n}getPoint(e,t=new R){let n=t,s=this.v0,r=this.v1,o=this.v2;return n.set(Gs(e,s.x,r.x,o.x),Gs(e,s.y,r.y,o.y),Gs(e,s.z,r.z,o.z)),n}copy(e){return super.copy(e),this.v0.copy(e.v0),this.v1.copy(e.v1),this.v2.copy(e.v2),this}toJSON(){let e=super.toJSON();return e.v0=this.v0.toArray(),e.v1=this.v1.toArray(),e.v2=this.v2.toArray(),e}fromJSON(e){return super.fromJSON(e),this.v0.fromArray(e.v0),this.v1.fromArray(e.v1),this.v2.fromArray(e.v2),this}},Fo=class extends hn{constructor(e=[]){super(),this.isSplineCurve=!0,this.type="SplineCurve",this.points=e}getPoint(e,t=new le){let n=t,s=this.points,r=(s.length-1)*e,o=Math.floor(r),a=r-o,c=s[o===0?o:o-1],l=s[o],h=s[o>s.length-2?s.length-1:o+1],u=s[o>s.length-3?s.length-1:o+2];return n.set(yd(a,c.x,l.x,h.x,u.x),yd(a,c.y,l.y,h.y,u.y)),n}copy(e){super.copy(e),this.points=[];for(let t=0,n=e.points.length;t<n;t++){let s=e.points[t];this.points.push(s.clone())}return this}toJSON(){let e=super.toJSON();e.points=[];for(let t=0,n=this.points.length;t<n;t++){let s=this.points[t];e.points.push(s.toArray())}return e}fromJSON(e){super.fromJSON(e),this.points=[];for(let t=0,n=e.points.length;t<n;t++){let s=e.points[t];this.points.push(new le().fromArray(s))}return this}},vl=Object.freeze({__proto__:null,ArcCurve:ml,CatmullRomCurve3:gl,CubicBezierCurve:No,CubicBezierCurve3:_l,EllipseCurve:er,LineCurve:ko,LineCurve3:yl,QuadraticBezierCurve:Oo,QuadraticBezierCurve3:xl,SplineCurve:Fo}),bl=class extends hn{constructor(){super(),this.type="CurvePath",this.curves=[],this.autoClose=!1}add(e){this.curves.push(e)}closePath(){let e=this.curves[0].getPoint(0),t=this.curves[this.curves.length-1].getPoint(1);if(!e.equals(t)){let n=e.isVector2===!0?"LineCurve":"LineCurve3";this.curves.push(new vl[n](t,e))}return this}getPoint(e,t){let n=e*this.getLength(),s=this.getCurveLengths(),r=0;for(;r<s.length;){if(s[r]>=n){let o=s[r]-n,a=this.curves[r],c=a.getLength(),l=c===0?0:1-o/c;return a.getPointAt(l,t)}r++}return null}getLength(){let e=this.getCurveLengths();return e[e.length-1]}updateArcLengths(){this.needsUpdate=!0,this.cacheLengths=null,this.getCurveLengths()}getCurveLengths(){if(this.cacheLengths&&this.cacheLengths.length===this.curves.length)return this.cacheLengths;let e=[],t=0;for(let n=0,s=this.curves.length;n<s;n++)t+=this.curves[n].getLength(),e.push(t);return this.cacheLengths=e,e}getSpacedPoints(e=40){let t=[];for(let n=0;n<=e;n++)t.push(this.getPoint(n/e));return this.autoClose&&t.push(t[0]),t}getPoints(e=12){let t=[],n;for(let s=0,r=this.curves;s<r.length;s++){let o=r[s],a=o.isEllipseCurve?e*2:o.isLineCurve||o.isLineCurve3?1:o.isSplineCurve?e*o.points.length:e,c=o.getPoints(a);for(let l=0;l<c.length;l++){let h=c[l];n&&n.equals(h)||(t.push(h),n=h)}}return this.autoClose&&t.length>1&&!t[t.length-1].equals(t[0])&&t.push(t[0]),t}copy(e){super.copy(e),this.curves=[];for(let t=0,n=e.curves.length;t<n;t++){let s=e.curves[t];this.curves.push(s.clone())}return this.autoClose=e.autoClose,this}toJSON(){let e=super.toJSON();e.autoClose=this.autoClose,e.curves=[];for(let t=0,n=this.curves.length;t<n;t++){let s=this.curves[t];e.curves.push(s.toJSON())}return e}fromJSON(e){super.fromJSON(e),this.autoClose=e.autoClose,this.curves=[];for(let t=0,n=e.curves.length;t<n;t++){let s=e.curves[t];this.curves.push(new vl[s.type]().fromJSON(s))}return this}},tr=class extends bl{constructor(e){super(),this.type="Path",this.currentPoint=new le,e&&this.setFromPoints(e)}setFromPoints(e){this.moveTo(e[0].x,e[0].y);for(let t=1,n=e.length;t<n;t++)this.lineTo(e[t].x,e[t].y);return this}moveTo(e,t){return this.currentPoint.set(e,t),this}lineTo(e,t){let n=new ko(this.currentPoint.clone(),new le(e,t));return this.curves.push(n),this.currentPoint.set(e,t),this}quadraticCurveTo(e,t,n,s){let r=new Oo(this.currentPoint.clone(),new le(e,t),new le(n,s));return this.curves.push(r),this.currentPoint.set(n,s),this}bezierCurveTo(e,t,n,s,r,o){let a=new No(this.currentPoint.clone(),new le(e,t),new le(n,s),new le(r,o));return this.curves.push(a),this.currentPoint.set(r,o),this}splineThru(e){let t=[this.currentPoint.clone()].concat(e),n=new Fo(t);return this.curves.push(n),this.currentPoint.copy(e[e.length-1]),this}arc(e,t,n,s,r,o){let a=this.currentPoint.x,c=this.currentPoint.y;return this.absarc(e+a,t+c,n,s,r,o),this}absarc(e,t,n,s,r,o){return this.absellipse(e,t,n,n,s,r,o),this}ellipse(e,t,n,s,r,o,a,c){let l=this.currentPoint.x,h=this.currentPoint.y;return this.absellipse(e+l,t+h,n,s,r,o,a,c),this}absellipse(e,t,n,s,r,o,a,c){let l=new er(e,t,n,s,r,o,a,c);if(this.curves.length>0){let u=l.getPoint(0);u.equals(this.currentPoint)||this.lineTo(u.x,u.y)}this.curves.push(l);let h=l.getPoint(1);return this.currentPoint.copy(h),this}copy(e){return super.copy(e),this.currentPoint.copy(e.currentPoint),this}toJSON(){let e=super.toJSON();return e.currentPoint=this.currentPoint.toArray(),e}fromJSON(e){return super.fromJSON(e),this.currentPoint.fromArray(e.currentPoint),this}},Ml=class i extends It{constructor(e=[new le(0,-.5),new le(.5,0),new le(0,.5)],t=12,n=0,s=Math.PI*2){super(),this.type="LatheGeometry",this.parameters={points:e,segments:t,phiStart:n,phiLength:s},t=Math.floor(t),s=Pt(s,0,Math.PI*2);let r=[],o=[],a=[],c=[],l=[],h=1/t,u=new R,d=new le,f=new R,g=new R,y=new R,m=0,p=0;for(let M=0;M<=e.length-1;M++)switch(M){case 0:m=e[M+1].x-e[M].x,p=e[M+1].y-e[M].y,f.x=p*1,f.y=-m,f.z=p*0,y.copy(f),f.normalize(),c.push(f.x,f.y,f.z);break;case e.length-1:c.push(y.x,y.y,y.z);break;default:m=e[M+1].x-e[M].x,p=e[M+1].y-e[M].y,f.x=p*1,f.y=-m,f.z=p*0,g.copy(f),f.x+=y.x,f.y+=y.y,f.z+=y.z,f.normalize(),c.push(f.x,f.y,f.z),y.copy(g)}for(let M=0;M<=t;M++){let x=n+M*h*s,b=Math.sin(x),D=Math.cos(x);for(let A=0;A<=e.length-1;A++){u.x=e[A].x*b,u.y=e[A].y,u.z=e[A].x*D,o.push(u.x,u.y,u.z),d.x=M/t,d.y=A/(e.length-1),a.push(d.x,d.y);let C=c[3*A+0]*b,P=c[3*A+1],z=c[3*A+0]*D;l.push(C,P,z)}}for(let M=0;M<t;M++)for(let x=0;x<e.length-1;x++){let b=x+M*e.length,D=b,A=b+e.length,C=b+e.length+1,P=b+1;r.push(D,A,P),r.push(C,P,A)}this.setIndex(r),this.setAttribute("position",new lt(o,3)),this.setAttribute("uv",new lt(a,2)),this.setAttribute("normal",new lt(l,3))}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}static fromJSON(e){return new i(e.points,e.segments,e.phiStart,e.phiLength)}},fs=class i extends Ml{constructor(e=1,t=1,n=4,s=8){let r=new tr;r.absarc(0,-t/2,e,Math.PI*1.5,0),r.absarc(0,t/2,e,0,Math.PI*.5),super(r.getPoints(n),s),this.type="CapsuleGeometry",this.parameters={radius:e,length:t,capSegments:n,radialSegments:s}}static fromJSON(e){return new i(e.radius,e.length,e.capSegments,e.radialSegments)}},Bo=class i extends It{constructor(e=1,t=32,n=0,s=Math.PI*2){super(),this.type="CircleGeometry",this.parameters={radius:e,segments:t,thetaStart:n,thetaLength:s},t=Math.max(3,t);let r=[],o=[],a=[],c=[],l=new R,h=new le;o.push(0,0,0),a.push(0,0,1),c.push(.5,.5);for(let u=0,d=3;u<=t;u++,d+=3){let f=n+u/t*s;l.x=e*Math.cos(f),l.y=e*Math.sin(f),o.push(l.x,l.y,l.z),a.push(0,0,1),h.x=(o[d]/e+1)/2,h.y=(o[d+1]/e+1)/2,c.push(h.x,h.y)}for(let u=1;u<=t;u++)r.push(u,u+1,0);this.setIndex(r),this.setAttribute("position",new lt(o,3)),this.setAttribute("normal",new lt(a,3)),this.setAttribute("uv",new lt(c,2))}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}static fromJSON(e){return new i(e.radius,e.segments,e.thetaStart,e.thetaLength)}},et=class i extends It{constructor(e=1,t=1,n=1,s=32,r=1,o=!1,a=0,c=Math.PI*2){super(),this.type="CylinderGeometry",this.parameters={radiusTop:e,radiusBottom:t,height:n,radialSegments:s,heightSegments:r,openEnded:o,thetaStart:a,thetaLength:c};let l=this;s=Math.floor(s),r=Math.floor(r);let h=[],u=[],d=[],f=[],g=0,y=[],m=n/2,p=0;M(),o===!1&&(e>0&&x(!0),t>0&&x(!1)),this.setIndex(h),this.setAttribute("position",new lt(u,3)),this.setAttribute("normal",new lt(d,3)),this.setAttribute("uv",new lt(f,2));function M(){let b=new R,D=new R,A=0,C=(t-e)/n;for(let P=0;P<=r;P++){let z=[],_=P/r,S=_*(t-e)+e;for(let L=0;L<=s;L++){let N=L/s,H=N*c+a,ne=Math.sin(H),V=Math.cos(H);D.x=S*ne,D.y=-_*n+m,D.z=S*V,u.push(D.x,D.y,D.z),b.set(ne,C,V).normalize(),d.push(b.x,b.y,b.z),f.push(N,1-_),z.push(g++)}y.push(z)}for(let P=0;P<s;P++)for(let z=0;z<r;z++){let _=y[z][P],S=y[z+1][P],L=y[z+1][P+1],N=y[z][P+1];e>0&&(h.push(_,S,N),A+=3),t>0&&(h.push(S,L,N),A+=3)}l.addGroup(p,A,0),p+=A}function x(b){let D=g,A=new le,C=new R,P=0,z=b===!0?e:t,_=b===!0?1:-1;for(let L=1;L<=s;L++)u.push(0,m*_,0),d.push(0,_,0),f.push(.5,.5),g++;let S=g;for(let L=0;L<=s;L++){let H=L/s*c+a,ne=Math.cos(H),V=Math.sin(H);C.x=z*V,C.y=m*_,C.z=z*ne,u.push(C.x,C.y,C.z),d.push(0,_,0),A.x=ne*.5+.5,A.y=V*.5*_+.5,f.push(A.x,A.y),g++}for(let L=0;L<s;L++){let N=D+L,H=S+L;b===!0?h.push(H,H+1,N):h.push(H+1,H,N),P+=3}l.addGroup(p,P,b===!0?1:2),p+=P}}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}static fromJSON(e){return new i(e.radiusTop,e.radiusBottom,e.height,e.radialSegments,e.heightSegments,e.openEnded,e.thetaStart,e.thetaLength)}},zo=class i extends et{constructor(e=1,t=1,n=32,s=1,r=!1,o=0,a=Math.PI*2){super(0,e,t,n,s,r,o,a),this.type="ConeGeometry",this.parameters={radius:e,height:t,radialSegments:n,heightSegments:s,openEnded:r,thetaStart:o,thetaLength:a}}static fromJSON(e){return new i(e.radius,e.height,e.radialSegments,e.heightSegments,e.openEnded,e.thetaStart,e.thetaLength)}},Sl=class i extends It{constructor(e=[],t=[],n=1,s=0){super(),this.type="PolyhedronGeometry",this.parameters={vertices:e,indices:t,radius:n,detail:s};let r=[],o=[];a(s),l(n),h(),this.setAttribute("position",new lt(r,3)),this.setAttribute("normal",new lt(r.slice(),3)),this.setAttribute("uv",new lt(o,2)),s===0?this.computeVertexNormals():this.normalizeNormals();function a(M){let x=new R,b=new R,D=new R;for(let A=0;A<t.length;A+=3)f(t[A+0],x),f(t[A+1],b),f(t[A+2],D),c(x,b,D,M)}function c(M,x,b,D){let A=D+1,C=[];for(let P=0;P<=A;P++){C[P]=[];let z=M.clone().lerp(b,P/A),_=x.clone().lerp(b,P/A),S=A-P;for(let L=0;L<=S;L++)L===0&&P===A?C[P][L]=z:C[P][L]=z.clone().lerp(_,L/S)}for(let P=0;P<A;P++)for(let z=0;z<2*(A-P)-1;z++){let _=Math.floor(z/2);z%2===0?(d(C[P][_+1]),d(C[P+1][_]),d(C[P][_])):(d(C[P][_+1]),d(C[P+1][_+1]),d(C[P+1][_]))}}function l(M){let x=new R;for(let b=0;b<r.length;b+=3)x.x=r[b+0],x.y=r[b+1],x.z=r[b+2],x.normalize().multiplyScalar(M),r[b+0]=x.x,r[b+1]=x.y,r[b+2]=x.z}function h(){let M=new R;for(let x=0;x<r.length;x+=3){M.x=r[x+0],M.y=r[x+1],M.z=r[x+2];let b=m(M)/2/Math.PI+.5,D=p(M)/Math.PI+.5;o.push(b,1-D)}g(),u()}function u(){for(let M=0;M<o.length;M+=6){let x=o[M+0],b=o[M+2],D=o[M+4],A=Math.max(x,b,D),C=Math.min(x,b,D);A>.9&&C<.1&&(x<.2&&(o[M+0]+=1),b<.2&&(o[M+2]+=1),D<.2&&(o[M+4]+=1))}}function d(M){r.push(M.x,M.y,M.z)}function f(M,x){let b=M*3;x.x=e[b+0],x.y=e[b+1],x.z=e[b+2]}function g(){let M=new R,x=new R,b=new R,D=new R,A=new le,C=new le,P=new le;for(let z=0,_=0;z<r.length;z+=9,_+=6){M.set(r[z+0],r[z+1],r[z+2]),x.set(r[z+3],r[z+4],r[z+5]),b.set(r[z+6],r[z+7],r[z+8]),A.set(o[_+0],o[_+1]),C.set(o[_+2],o[_+3]),P.set(o[_+4],o[_+5]),D.copy(M).add(x).add(b).divideScalar(3);let S=m(D);y(A,_+0,M,S),y(C,_+2,x,S),y(P,_+4,b,S)}}function y(M,x,b,D){D<0&&M.x===1&&(o[x]=M.x-1),b.x===0&&b.z===0&&(o[x]=D/2/Math.PI+.5)}function m(M){return Math.atan2(M.z,-M.x)}function p(M){return Math.atan2(-M.y,Math.sqrt(M.x*M.x+M.z*M.z))}}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}static fromJSON(e){return new i(e.vertices,e.indices,e.radius,e.details)}};var nr=class extends tr{constructor(e){super(e),this.uuid=Mn(),this.type="Shape",this.holes=[]}getPointsHoles(e){let t=[];for(let n=0,s=this.holes.length;n<s;n++)t[n]=this.holes[n].getPoints(e);return t}extractPoints(e){return{shape:this.getPoints(e),holes:this.getPointsHoles(e)}}copy(e){super.copy(e),this.holes=[];for(let t=0,n=e.holes.length;t<n;t++){let s=e.holes[t];this.holes.push(s.clone())}return this}toJSON(){let e=super.toJSON();e.uuid=this.uuid,e.holes=[];for(let t=0,n=this.holes.length;t<n;t++){let s=this.holes[t];e.holes.push(s.toJSON())}return e}fromJSON(e){super.fromJSON(e),this.uuid=e.uuid,this.holes=[];for(let t=0,n=e.holes.length;t<n;t++){let s=e.holes[t];this.holes.push(new tr().fromJSON(s))}return this}},ix={triangulate:function(i,e,t=2){let n=e&&e.length,s=n?e[0]*t:i.length,r=Zd(i,0,s,t,!0),o=[];if(!r||r.next===r.prev)return o;let a,c,l,h,u,d,f;if(n&&(r=cx(i,e,r,t)),i.length>80*t){a=l=i[0],c=h=i[1];for(let g=t;g<s;g+=t)u=i[g],d=i[g+1],u<a&&(a=u),d<c&&(c=d),u>l&&(l=u),d>h&&(h=d);f=Math.max(l-a,h-c),f=f!==0?32767/f:0}return ir(r,o,t,a,c,f,0),o}};function Zd(i,e,t,n,s){let r,o;if(s===xx(i,e,t,n)>0)for(r=e;r<t;r+=n)o=xd(r,i[r],i[r+1],o);else for(r=t-n;r>=e;r-=n)o=xd(r,i[r],i[r+1],o);return o&&Jo(o,o.next)&&(rr(o),o=o.next),o}function Si(i,e){if(!i)return i;e||(e=i);let t=i,n;do if(n=!1,!t.steiner&&(Jo(t,t.next)||xt(t.prev,t,t.next)===0)){if(rr(t),t=e=t.prev,t===t.next)break;n=!0}else t=t.next;while(n||t!==e);return e}function ir(i,e,t,n,s,r,o){if(!i)return;!o&&r&&fx(i,n,s,r);let a=i,c,l;for(;i.prev!==i.next;){if(c=i.prev,l=i.next,r?rx(i,n,s,r):sx(i)){e.push(c.i/t|0),e.push(i.i/t|0),e.push(l.i/t|0),rr(i),i=l.next,a=l.next;continue}if(i=l,i===a){o?o===1?(i=ox(Si(i),e,t),ir(i,e,t,n,s,r,2)):o===2&&ax(i,e,t,n,s,r):ir(Si(i),e,t,n,s,r,1);break}}}function sx(i){let e=i.prev,t=i,n=i.next;if(xt(e,t,n)>=0)return!1;let s=e.x,r=t.x,o=n.x,a=e.y,c=t.y,l=n.y,h=s<r?s<o?s:o:r<o?r:o,u=a<c?a<l?a:l:c<l?c:l,d=s>r?s>o?s:o:r>o?r:o,f=a>c?a>l?a:l:c>l?c:l,g=n.next;for(;g!==e;){if(g.x>=h&&g.x<=d&&g.y>=u&&g.y<=f&&ts(s,a,r,c,o,l,g.x,g.y)&&xt(g.prev,g,g.next)>=0)return!1;g=g.next}return!0}function rx(i,e,t,n){let s=i.prev,r=i,o=i.next;if(xt(s,r,o)>=0)return!1;let a=s.x,c=r.x,l=o.x,h=s.y,u=r.y,d=o.y,f=a<c?a<l?a:l:c<l?c:l,g=h<u?h<d?h:d:u<d?u:d,y=a>c?a>l?a:l:c>l?c:l,m=h>u?h>d?h:d:u>d?u:d,p=El(f,g,e,t,n),M=El(y,m,e,t,n),x=i.prevZ,b=i.nextZ;for(;x&&x.z>=p&&b&&b.z<=M;){if(x.x>=f&&x.x<=y&&x.y>=g&&x.y<=m&&x!==s&&x!==o&&ts(a,h,c,u,l,d,x.x,x.y)&&xt(x.prev,x,x.next)>=0||(x=x.prevZ,b.x>=f&&b.x<=y&&b.y>=g&&b.y<=m&&b!==s&&b!==o&&ts(a,h,c,u,l,d,b.x,b.y)&&xt(b.prev,b,b.next)>=0))return!1;b=b.nextZ}for(;x&&x.z>=p;){if(x.x>=f&&x.x<=y&&x.y>=g&&x.y<=m&&x!==s&&x!==o&&ts(a,h,c,u,l,d,x.x,x.y)&&xt(x.prev,x,x.next)>=0)return!1;x=x.prevZ}for(;b&&b.z<=M;){if(b.x>=f&&b.x<=y&&b.y>=g&&b.y<=m&&b!==s&&b!==o&&ts(a,h,c,u,l,d,b.x,b.y)&&xt(b.prev,b,b.next)>=0)return!1;b=b.nextZ}return!0}function ox(i,e,t){let n=i;do{let s=n.prev,r=n.next.next;!Jo(s,r)&&jd(s,n,n.next,r)&&sr(s,r)&&sr(r,s)&&(e.push(s.i/t|0),e.push(n.i/t|0),e.push(r.i/t|0),rr(n),rr(n.next),n=i=r),n=n.next}while(n!==i);return Si(n)}function ax(i,e,t,n,s,r){let o=i;do{let a=o.next.next;for(;a!==o.prev;){if(o.i!==a.i&&gx(o,a)){let c=Kd(o,a);o=Si(o,o.next),c=Si(c,c.next),ir(o,e,t,n,s,r,0),ir(c,e,t,n,s,r,0);return}a=a.next}o=o.next}while(o!==i)}function cx(i,e,t,n){let s=[],r,o,a,c,l;for(r=0,o=e.length;r<o;r++)a=e[r]*n,c=r<o-1?e[r+1]*n:i.length,l=Zd(i,a,c,n,!1),l===l.next&&(l.steiner=!0),s.push(mx(l));for(s.sort(lx),r=0;r<s.length;r++)t=hx(s[r],t);return t}function lx(i,e){return i.x-e.x}function hx(i,e){let t=ux(i,e);if(!t)return e;let n=Kd(t,i);return Si(n,n.next),Si(t,t.next)}function ux(i,e){let t=e,n=-1/0,s,r=i.x,o=i.y;do{if(o<=t.y&&o>=t.next.y&&t.next.y!==t.y){let d=t.x+(o-t.y)*(t.next.x-t.x)/(t.next.y-t.y);if(d<=r&&d>n&&(n=d,s=t.x<t.next.x?t:t.next,d===r))return s}t=t.next}while(t!==e);if(!s)return null;let a=s,c=s.x,l=s.y,h=1/0,u;t=s;do r>=t.x&&t.x>=c&&r!==t.x&&ts(o<l?r:n,o,c,l,o<l?n:r,o,t.x,t.y)&&(u=Math.abs(o-t.y)/(r-t.x),sr(t,i)&&(u<h||u===h&&(t.x>s.x||t.x===s.x&&dx(s,t)))&&(s=t,h=u)),t=t.next;while(t!==a);return s}function dx(i,e){return xt(i.prev,i,e.prev)<0&&xt(e.next,i,i.next)<0}function fx(i,e,t,n){let s=i;do s.z===0&&(s.z=El(s.x,s.y,e,t,n)),s.prevZ=s.prev,s.nextZ=s.next,s=s.next;while(s!==i);s.prevZ.nextZ=null,s.prevZ=null,px(s)}function px(i){let e,t,n,s,r,o,a,c,l=1;do{for(t=i,i=null,r=null,o=0;t;){for(o++,n=t,a=0,e=0;e<l&&(a++,n=n.nextZ,!!n);e++);for(c=l;a>0||c>0&&n;)a!==0&&(c===0||!n||t.z<=n.z)?(s=t,t=t.nextZ,a--):(s=n,n=n.nextZ,c--),r?r.nextZ=s:i=s,s.prevZ=r,r=s;t=n}r.nextZ=null,l*=2}while(o>1);return i}function El(i,e,t,n,s){return i=(i-t)*s|0,e=(e-n)*s|0,i=(i|i<<8)&16711935,i=(i|i<<4)&252645135,i=(i|i<<2)&858993459,i=(i|i<<1)&1431655765,e=(e|e<<8)&16711935,e=(e|e<<4)&252645135,e=(e|e<<2)&858993459,e=(e|e<<1)&1431655765,i|e<<1}function mx(i){let e=i,t=i;do(e.x<t.x||e.x===t.x&&e.y<t.y)&&(t=e),e=e.next;while(e!==i);return t}function ts(i,e,t,n,s,r,o,a){return(s-o)*(e-a)>=(i-o)*(r-a)&&(i-o)*(n-a)>=(t-o)*(e-a)&&(t-o)*(r-a)>=(s-o)*(n-a)}function gx(i,e){return i.next.i!==e.i&&i.prev.i!==e.i&&!_x(i,e)&&(sr(i,e)&&sr(e,i)&&yx(i,e)&&(xt(i.prev,i,e.prev)||xt(i,e.prev,e))||Jo(i,e)&&xt(i.prev,i,i.next)>0&&xt(e.prev,e,e.next)>0)}function xt(i,e,t){return(e.y-i.y)*(t.x-e.x)-(e.x-i.x)*(t.y-e.y)}function Jo(i,e){return i.x===e.x&&i.y===e.y}function jd(i,e,t,n){let s=io(xt(i,e,t)),r=io(xt(i,e,n)),o=io(xt(t,n,i)),a=io(xt(t,n,e));return!!(s!==r&&o!==a||s===0&&no(i,t,e)||r===0&&no(i,n,e)||o===0&&no(t,i,n)||a===0&&no(t,e,n))}function no(i,e,t){return e.x<=Math.max(i.x,t.x)&&e.x>=Math.min(i.x,t.x)&&e.y<=Math.max(i.y,t.y)&&e.y>=Math.min(i.y,t.y)}function io(i){return i>0?1:i<0?-1:0}function _x(i,e){let t=i;do{if(t.i!==i.i&&t.next.i!==i.i&&t.i!==e.i&&t.next.i!==e.i&&jd(t,t.next,i,e))return!0;t=t.next}while(t!==i);return!1}function sr(i,e){return xt(i.prev,i,i.next)<0?xt(i,e,i.next)>=0&&xt(i,i.prev,e)>=0:xt(i,e,i.prev)<0||xt(i,i.next,e)<0}function yx(i,e){let t=i,n=!1,s=(i.x+e.x)/2,r=(i.y+e.y)/2;do t.y>r!=t.next.y>r&&t.next.y!==t.y&&s<(t.next.x-t.x)*(r-t.y)/(t.next.y-t.y)+t.x&&(n=!n),t=t.next;while(t!==i);return n}function Kd(i,e){let t=new Tl(i.i,i.x,i.y),n=new Tl(e.i,e.x,e.y),s=i.next,r=e.prev;return i.next=e,e.prev=i,t.next=s,s.prev=t,n.next=t,t.prev=n,r.next=n,n.prev=r,n}function xd(i,e,t,n){let s=new Tl(i,e,t);return n?(s.next=n.next,s.prev=n,n.next.prev=s,n.next=s):(s.prev=s,s.next=s),s}function rr(i){i.next.prev=i.prev,i.prev.next=i.next,i.prevZ&&(i.prevZ.nextZ=i.nextZ),i.nextZ&&(i.nextZ.prevZ=i.prevZ)}function Tl(i,e,t){this.i=i,this.x=e,this.y=t,this.prev=null,this.next=null,this.z=0,this.prevZ=null,this.nextZ=null,this.steiner=!1}function xx(i,e,t,n){let s=0;for(let r=e,o=t-n;r<t;r+=n)s+=(i[o]-i[r])*(i[r+1]+i[o+1]),o=r;return s}var Xs=class i{static area(e){let t=e.length,n=0;for(let s=t-1,r=0;r<t;s=r++)n+=e[s].x*e[r].y-e[r].x*e[s].y;return n*.5}static isClockWise(e){return i.area(e)<0}static triangulateShape(e,t){let n=[],s=[],r=[];vd(e),bd(n,e);let o=e.length;t.forEach(vd);for(let c=0;c<t.length;c++)s.push(o),o+=t[c].length,bd(n,t[c]);let a=ix.triangulate(n,s);for(let c=0;c<a.length;c+=3)r.push(a.slice(c,c+3));return r}};function vd(i){let e=i.length;e>2&&i[e-1].equals(i[0])&&i.pop()}function bd(i,e){for(let t=0;t<e.length;t++)i.push(e[t].x),i.push(e[t].y)}var Ho=class i extends It{constructor(e=new nr([new le(.5,.5),new le(-.5,.5),new le(-.5,-.5),new le(.5,-.5)]),t={}){super(),this.type="ExtrudeGeometry",this.parameters={shapes:e,options:t},e=Array.isArray(e)?e:[e];let n=this,s=[],r=[];for(let a=0,c=e.length;a<c;a++){let l=e[a];o(l)}this.setAttribute("position",new lt(s,3)),this.setAttribute("uv",new lt(r,2)),this.computeVertexNormals();function o(a){let c=[],l=t.curveSegments!==void 0?t.curveSegments:12,h=t.steps!==void 0?t.steps:1,u=t.depth!==void 0?t.depth:1,d=t.bevelEnabled!==void 0?t.bevelEnabled:!0,f=t.bevelThickness!==void 0?t.bevelThickness:.2,g=t.bevelSize!==void 0?t.bevelSize:f-.1,y=t.bevelOffset!==void 0?t.bevelOffset:0,m=t.bevelSegments!==void 0?t.bevelSegments:3,p=t.extrudePath,M=t.UVGenerator!==void 0?t.UVGenerator:vx,x,b=!1,D,A,C,P;p&&(x=p.getSpacedPoints(h),b=!0,d=!1,D=p.computeFrenetFrames(h,!1),A=new R,C=new R,P=new R),d||(m=0,f=0,g=0,y=0);let z=a.extractPoints(l),_=z.shape,S=z.holes;if(!Xs.isClockWise(_)){_=_.reverse();for(let ee=0,w=S.length;ee<w;ee++){let pe=S[ee];Xs.isClockWise(pe)&&(S[ee]=pe.reverse())}}let N=Xs.triangulateShape(_,S),H=_;for(let ee=0,w=S.length;ee<w;ee++){let pe=S[ee];_=_.concat(pe)}function ne(ee,w,pe){return w||console.error("THREE.ExtrudeGeometry: vec does not exist"),ee.clone().addScaledVector(w,pe)}let V=_.length,se=N.length;function q(ee,w,pe){let fe,ce,me,De=ee.x-w.x,Se=ee.y-w.y,T=pe.x-ee.x,v=pe.y-ee.y,F=De*De+Se*Se,j=De*v-Se*T;if(Math.abs(j)>Number.EPSILON){let Q=Math.sqrt(F),Z=Math.sqrt(T*T+v*v),Ie=w.x-Se/Q,I=w.y+De/Q,B=pe.x-v/Z,K=pe.y+T/Z,$=((B-Ie)*v-(K-I)*T)/(De*v-Se*T);fe=Ie+De*$-ee.x,ce=I+Se*$-ee.y;let he=fe*fe+ce*ce;if(he<=2)return new le(fe,ce);me=Math.sqrt(he/2)}else{let Q=!1;De>Number.EPSILON?T>Number.EPSILON&&(Q=!0):De<-Number.EPSILON?T<-Number.EPSILON&&(Q=!0):Math.sign(Se)===Math.sign(v)&&(Q=!0),Q?(fe=-Se,ce=De,me=Math.sqrt(F)):(fe=De,ce=Se,me=Math.sqrt(F/2))}return new le(fe/me,ce/me)}let ve=[];for(let ee=0,w=H.length,pe=w-1,fe=ee+1;ee<w;ee++,pe++,fe++)pe===w&&(pe=0),fe===w&&(fe=0),ve[ee]=q(H[ee],H[pe],H[fe]);let be=[],Me,Ke=ve.concat();for(let ee=0,w=S.length;ee<w;ee++){let pe=S[ee];Me=[];for(let fe=0,ce=pe.length,me=ce-1,De=fe+1;fe<ce;fe++,me++,De++)me===ce&&(me=0),De===ce&&(De=0),Me[fe]=q(pe[fe],pe[me],pe[De]);be.push(Me),Ke=Ke.concat(Me)}for(let ee=0;ee<m;ee++){let w=ee/m,pe=f*Math.cos(w*Math.PI/2),fe=g*Math.sin(w*Math.PI/2)+y;for(let ce=0,me=H.length;ce<me;ce++){let De=ne(H[ce],ve[ce],fe);X(De.x,De.y,-pe)}for(let ce=0,me=S.length;ce<me;ce++){let De=S[ce];Me=be[ce];for(let Se=0,T=De.length;Se<T;Se++){let v=ne(De[Se],Me[Se],fe);X(v.x,v.y,-pe)}}}let nt=g+y;for(let ee=0;ee<V;ee++){let w=d?ne(_[ee],Ke[ee],nt):_[ee];b?(C.copy(D.normals[0]).multiplyScalar(w.x),A.copy(D.binormals[0]).multiplyScalar(w.y),P.copy(x[0]).add(C).add(A),X(P.x,P.y,P.z)):X(w.x,w.y,0)}for(let ee=1;ee<=h;ee++)for(let w=0;w<V;w++){let pe=d?ne(_[w],Ke[w],nt):_[w];b?(C.copy(D.normals[ee]).multiplyScalar(pe.x),A.copy(D.binormals[ee]).multiplyScalar(pe.y),P.copy(x[ee]).add(C).add(A),X(P.x,P.y,P.z)):X(pe.x,pe.y,u/h*ee)}for(let ee=m-1;ee>=0;ee--){let w=ee/m,pe=f*Math.cos(w*Math.PI/2),fe=g*Math.sin(w*Math.PI/2)+y;for(let ce=0,me=H.length;ce<me;ce++){let De=ne(H[ce],ve[ce],fe);X(De.x,De.y,u+pe)}for(let ce=0,me=S.length;ce<me;ce++){let De=S[ce];Me=be[ce];for(let Se=0,T=De.length;Se<T;Se++){let v=ne(De[Se],Me[Se],fe);b?X(v.x,v.y+x[h-1].y,x[h-1].x+pe):X(v.x,v.y,u+pe)}}}J(),ae();function J(){let ee=s.length/3;if(d){let w=0,pe=V*w;for(let fe=0;fe<se;fe++){let ce=N[fe];xe(ce[2]+pe,ce[1]+pe,ce[0]+pe)}w=h+m*2,pe=V*w;for(let fe=0;fe<se;fe++){let ce=N[fe];xe(ce[0]+pe,ce[1]+pe,ce[2]+pe)}}else{for(let w=0;w<se;w++){let pe=N[w];xe(pe[2],pe[1],pe[0])}for(let w=0;w<se;w++){let pe=N[w];xe(pe[0]+V*h,pe[1]+V*h,pe[2]+V*h)}}n.addGroup(ee,s.length/3-ee,0)}function ae(){let ee=s.length/3,w=0;we(H,w),w+=H.length;for(let pe=0,fe=S.length;pe<fe;pe++){let ce=S[pe];we(ce,w),w+=ce.length}n.addGroup(ee,s.length/3-ee,1)}function we(ee,w){let pe=ee.length;for(;--pe>=0;){let fe=pe,ce=pe-1;ce<0&&(ce=ee.length-1);for(let me=0,De=h+m*2;me<De;me++){let Se=V*me,T=V*(me+1),v=w+fe+Se,F=w+ce+Se,j=w+ce+T,Q=w+fe+T;Oe(v,F,j,Q)}}}function X(ee,w,pe){c.push(ee),c.push(w),c.push(pe)}function xe(ee,w,pe){Ne(ee),Ne(w),Ne(pe);let fe=s.length/3,ce=M.generateTopUV(n,s,fe-3,fe-2,fe-1);$e(ce[0]),$e(ce[1]),$e(ce[2])}function Oe(ee,w,pe,fe){Ne(ee),Ne(w),Ne(fe),Ne(w),Ne(pe),Ne(fe);let ce=s.length/3,me=M.generateSideWallUV(n,s,ce-6,ce-3,ce-2,ce-1);$e(me[0]),$e(me[1]),$e(me[3]),$e(me[1]),$e(me[2]),$e(me[3])}function Ne(ee){s.push(c[ee*3+0]),s.push(c[ee*3+1]),s.push(c[ee*3+2])}function $e(ee){r.push(ee.x),r.push(ee.y)}}}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}toJSON(){let e=super.toJSON(),t=this.parameters.shapes,n=this.parameters.options;return bx(t,n,e)}static fromJSON(e,t){let n=[];for(let r=0,o=e.shapes.length;r<o;r++){let a=t[e.shapes[r]];n.push(a)}let s=e.options.extrudePath;return s!==void 0&&(e.options.extrudePath=new vl[s.type]().fromJSON(s)),new i(n,e.options)}},vx={generateTopUV:function(i,e,t,n,s){let r=e[t*3],o=e[t*3+1],a=e[n*3],c=e[n*3+1],l=e[s*3],h=e[s*3+1];return[new le(r,o),new le(a,c),new le(l,h)]},generateSideWallUV:function(i,e,t,n,s,r){let o=e[t*3],a=e[t*3+1],c=e[t*3+2],l=e[n*3],h=e[n*3+1],u=e[n*3+2],d=e[s*3],f=e[s*3+1],g=e[s*3+2],y=e[r*3],m=e[r*3+1],p=e[r*3+2];return Math.abs(a-h)<Math.abs(o-l)?[new le(o,1-c),new le(l,1-u),new le(d,1-g),new le(y,1-p)]:[new le(a,1-c),new le(h,1-u),new le(f,1-g),new le(m,1-p)]}};function bx(i,e,t){if(t.shapes=[],Array.isArray(i))for(let n=0,s=i.length;n<s;n++){let r=i[n];t.shapes.push(r.uuid)}else t.shapes.push(i.uuid);return t.options=Object.assign({},e),e.extrudePath!==void 0&&(t.options.extrudePath=e.extrudePath.toJSON()),t}var Ei=class i extends Sl{constructor(e=1,t=0){let n=(1+Math.sqrt(5))/2,s=[-1,n,0,1,n,0,-1,-n,0,1,-n,0,0,-1,n,0,1,n,0,-1,-n,0,1,-n,n,0,-1,n,0,1,-n,0,-1,-n,0,1],r=[0,11,5,0,5,1,0,1,7,0,7,10,0,10,11,1,5,9,5,11,4,11,10,2,10,7,6,7,1,8,3,9,4,3,4,2,3,2,6,3,6,8,3,8,9,4,9,5,2,4,11,6,2,10,8,6,7,9,8,1];super(s,r,e,t),this.type="IcosahedronGeometry",this.parameters={radius:e,detail:t}}static fromJSON(e){return new i(e.radius,e.detail)}};var kt=class i extends It{constructor(e=1,t=32,n=16,s=0,r=Math.PI*2,o=0,a=Math.PI){super(),this.type="SphereGeometry",this.parameters={radius:e,widthSegments:t,heightSegments:n,phiStart:s,phiLength:r,thetaStart:o,thetaLength:a},t=Math.max(3,Math.floor(t)),n=Math.max(2,Math.floor(n));let c=Math.min(o+a,Math.PI),l=0,h=[],u=new R,d=new R,f=[],g=[],y=[],m=[];for(let p=0;p<=n;p++){let M=[],x=p/n,b=0;p===0&&o===0?b=.5/t:p===n&&c===Math.PI&&(b=-.5/t);for(let D=0;D<=t;D++){let A=D/t;u.x=-e*Math.cos(s+A*r)*Math.sin(o+x*a),u.y=e*Math.cos(o+x*a),u.z=e*Math.sin(s+A*r)*Math.sin(o+x*a),g.push(u.x,u.y,u.z),d.copy(u).normalize(),y.push(d.x,d.y,d.z),m.push(A+b,1-x),M.push(l++)}h.push(M)}for(let p=0;p<n;p++)for(let M=0;M<t;M++){let x=h[p][M+1],b=h[p][M],D=h[p+1][M],A=h[p+1][M+1];(p!==0||o>0)&&f.push(x,b,A),(p!==n-1||c<Math.PI)&&f.push(b,D,A)}this.setIndex(f),this.setAttribute("position",new lt(g,3)),this.setAttribute("normal",new lt(y,3)),this.setAttribute("uv",new lt(m,2))}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}static fromJSON(e){return new i(e.radius,e.widthSegments,e.heightSegments,e.phiStart,e.phiLength,e.thetaStart,e.thetaLength)}};var sn=class i extends It{constructor(e=1,t=.4,n=12,s=48,r=Math.PI*2){super(),this.type="TorusGeometry",this.parameters={radius:e,tube:t,radialSegments:n,tubularSegments:s,arc:r},n=Math.floor(n),s=Math.floor(s);let o=[],a=[],c=[],l=[],h=new R,u=new R,d=new R;for(let f=0;f<=n;f++)for(let g=0;g<=s;g++){let y=g/s*r,m=f/n*Math.PI*2;u.x=(e+t*Math.cos(m))*Math.cos(y),u.y=(e+t*Math.cos(m))*Math.sin(y),u.z=t*Math.sin(m),a.push(u.x,u.y,u.z),h.x=e*Math.cos(y),h.y=e*Math.sin(y),d.subVectors(u,h).normalize(),c.push(d.x,d.y,d.z),l.push(g/s),l.push(f/n)}for(let f=1;f<=n;f++)for(let g=1;g<=s;g++){let y=(s+1)*f+g-1,m=(s+1)*(f-1)+g-1,p=(s+1)*(f-1)+g,M=(s+1)*f+g;o.push(y,m,M),o.push(m,p,M)}this.setIndex(o),this.setAttribute("position",new lt(a,3)),this.setAttribute("normal",new lt(c,3)),this.setAttribute("uv",new lt(l,2))}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}static fromJSON(e){return new i(e.radius,e.tube,e.radialSegments,e.tubularSegments,e.arc)}};var Ti=class extends Gn{constructor(e){super(),this.isMeshStandardMaterial=!0,this.defines={STANDARD:""},this.type="MeshStandardMaterial",this.color=new Qe(16777215),this.roughness=1,this.metalness=0,this.map=null,this.lightMap=null,this.lightMapIntensity=1,this.aoMap=null,this.aoMapIntensity=1,this.emissive=new Qe(0),this.emissiveIntensity=1,this.emissiveMap=null,this.bumpMap=null,this.bumpScale=1,this.normalMap=null,this.normalMapType=Bd,this.normalScale=new le(1,1),this.displacementMap=null,this.displacementScale=1,this.displacementBias=0,this.roughnessMap=null,this.metalnessMap=null,this.alphaMap=null,this.envMap=null,this.envMapRotation=new En,this.envMapIntensity=1,this.wireframe=!1,this.wireframeLinewidth=1,this.wireframeLinecap="round",this.wireframeLinejoin="round",this.flatShading=!1,this.fog=!0,this.setValues(e)}copy(e){return super.copy(e),this.defines={STANDARD:""},this.color.copy(e.color),this.roughness=e.roughness,this.metalness=e.metalness,this.map=e.map,this.lightMap=e.lightMap,this.lightMapIntensity=e.lightMapIntensity,this.aoMap=e.aoMap,this.aoMapIntensity=e.aoMapIntensity,this.emissive.copy(e.emissive),this.emissiveMap=e.emissiveMap,this.emissiveIntensity=e.emissiveIntensity,this.bumpMap=e.bumpMap,this.bumpScale=e.bumpScale,this.normalMap=e.normalMap,this.normalMapType=e.normalMapType,this.normalScale.copy(e.normalScale),this.displacementMap=e.displacementMap,this.displacementScale=e.displacementScale,this.displacementBias=e.displacementBias,this.roughnessMap=e.roughnessMap,this.metalnessMap=e.metalnessMap,this.alphaMap=e.alphaMap,this.envMap=e.envMap,this.envMapRotation.copy(e.envMapRotation),this.envMapIntensity=e.envMapIntensity,this.wireframe=e.wireframe,this.wireframeLinewidth=e.wireframeLinewidth,this.wireframeLinecap=e.wireframeLinecap,this.wireframeLinejoin=e.wireframeLinejoin,this.flatShading=e.flatShading,this.fog=e.fog,this}};function so(i,e,t){return!i||!t&&i.constructor===e?i:typeof e.BYTES_PER_ELEMENT=="number"?new e(i):Array.prototype.slice.call(i)}function Mx(i){return ArrayBuffer.isView(i)&&!(i instanceof DataView)}var ps=class{constructor(e,t,n,s){this.parameterPositions=e,this._cachedIndex=0,this.resultBuffer=s!==void 0?s:new t.constructor(n),this.sampleValues=t,this.valueSize=n,this.settings=null,this.DefaultSettings_={}}evaluate(e){let t=this.parameterPositions,n=this._cachedIndex,s=t[n],r=t[n-1];n:{e:{let o;t:{i:if(!(e<s)){for(let a=n+2;;){if(s===void 0){if(e<r)break i;return n=t.length,this._cachedIndex=n,this.copySampleValue_(n-1)}if(n===a)break;if(r=s,s=t[++n],e<s)break e}o=t.length;break t}if(!(e>=r)){let a=t[1];e<a&&(n=2,r=a);for(let c=n-2;;){if(r===void 0)return this._cachedIndex=0,this.copySampleValue_(0);if(n===c)break;if(s=r,r=t[--n-1],e>=r)break e}o=n,n=0;break t}break n}for(;n<o;){let a=n+o>>>1;e<t[a]?o=a:n=a+1}if(s=t[n],r=t[n-1],r===void 0)return this._cachedIndex=0,this.copySampleValue_(0);if(s===void 0)return n=t.length,this._cachedIndex=n,this.copySampleValue_(n-1)}this._cachedIndex=n,this.intervalChanged_(n,r,s)}return this.interpolate_(n,r,e,s)}getSettings_(){return this.settings||this.DefaultSettings_}copySampleValue_(e){let t=this.resultBuffer,n=this.sampleValues,s=this.valueSize,r=e*s;for(let o=0;o!==s;++o)t[o]=n[r+o];return t}interpolate_(){throw new Error("call to abstract method")}intervalChanged_(){}},wl=class extends ps{constructor(e,t,n,s){super(e,t,n,s),this._weightPrev=-0,this._offsetPrev=-0,this._weightNext=-0,this._offsetNext=-0,this.DefaultSettings_={endingStart:Mu,endingEnd:Mu}}intervalChanged_(e,t,n){let s=this.parameterPositions,r=e-2,o=e+1,a=s[r],c=s[o];if(a===void 0)switch(this.getSettings_().endingStart){case Su:r=e,a=2*t-n;break;case Eu:r=s.length-2,a=t+s[r]-s[r+1];break;default:r=e,a=n}if(c===void 0)switch(this.getSettings_().endingEnd){case Su:o=e,c=2*n-t;break;case Eu:o=1,c=n+s[1]-s[0];break;default:o=e-1,c=t}let l=(n-t)*.5,h=this.valueSize;this._weightPrev=l/(t-a),this._weightNext=l/(c-n),this._offsetPrev=r*h,this._offsetNext=o*h}interpolate_(e,t,n,s){let r=this.resultBuffer,o=this.sampleValues,a=this.valueSize,c=e*a,l=c-a,h=this._offsetPrev,u=this._offsetNext,d=this._weightPrev,f=this._weightNext,g=(n-t)/(s-t),y=g*g,m=y*g,p=-d*m+2*d*y-d*g,M=(1+d)*m+(-1.5-2*d)*y+(-.5+d)*g+1,x=(-1-f)*m+(1.5+f)*y+.5*g,b=f*m-f*y;for(let D=0;D!==a;++D)r[D]=p*o[h+D]+M*o[l+D]+x*o[c+D]+b*o[u+D];return r}},Al=class extends ps{constructor(e,t,n,s){super(e,t,n,s)}interpolate_(e,t,n,s){let r=this.resultBuffer,o=this.sampleValues,a=this.valueSize,c=e*a,l=c-a,h=(n-t)/(s-t),u=1-h;for(let d=0;d!==a;++d)r[d]=o[l+d]*u+o[c+d]*h;return r}},Cl=class extends ps{constructor(e,t,n,s){super(e,t,n,s)}interpolate_(e){return this.copySampleValue_(e-1)}},xn=class{constructor(e,t,n,s){if(e===void 0)throw new Error("THREE.KeyframeTrack: track name is undefined");if(t===void 0||t.length===0)throw new Error("THREE.KeyframeTrack: no keyframes in track named "+e);this.name=e,this.times=so(t,this.TimeBufferType),this.values=so(n,this.ValueBufferType),this.setInterpolation(s||this.DefaultInterpolation)}static toJSON(e){let t=e.constructor,n;if(t.toJSON!==this.toJSON)n=t.toJSON(e);else{n={name:e.name,times:so(e.times,Array),values:so(e.values,Array)};let s=e.getInterpolation();s!==e.DefaultInterpolation&&(n.interpolation=s)}return n.type=e.ValueTypeName,n}InterpolantFactoryMethodDiscrete(e){return new Cl(this.times,this.values,this.getValueSize(),e)}InterpolantFactoryMethodLinear(e){return new Al(this.times,this.values,this.getValueSize(),e)}InterpolantFactoryMethodSmooth(e){return new wl(this.times,this.values,this.getValueSize(),e)}setInterpolation(e){let t;switch(e){case uo:t=this.InterpolantFactoryMethodDiscrete;break;case Zc:t=this.InterpolantFactoryMethodLinear;break;case Ia:t=this.InterpolantFactoryMethodSmooth;break}if(t===void 0){let n="unsupported interpolation for "+this.ValueTypeName+" keyframe track named "+this.name;if(this.createInterpolant===void 0)if(e!==this.DefaultInterpolation)this.setInterpolation(this.DefaultInterpolation);else throw new Error(n);return console.warn("THREE.KeyframeTrack:",n),this}return this.createInterpolant=t,this}getInterpolation(){switch(this.createInterpolant){case this.InterpolantFactoryMethodDiscrete:return uo;case this.InterpolantFactoryMethodLinear:return Zc;case this.InterpolantFactoryMethodSmooth:return Ia}}getValueSize(){return this.values.length/this.times.length}shift(e){if(e!==0){let t=this.times;for(let n=0,s=t.length;n!==s;++n)t[n]+=e}return this}scale(e){if(e!==1){let t=this.times;for(let n=0,s=t.length;n!==s;++n)t[n]*=e}return this}trim(e,t){let n=this.times,s=n.length,r=0,o=s-1;for(;r!==s&&n[r]<e;)++r;for(;o!==-1&&n[o]>t;)--o;if(++o,r!==0||o!==s){r>=o&&(o=Math.max(o,1),r=o-1);let a=this.getValueSize();this.times=n.slice(r,o),this.values=this.values.slice(r*a,o*a)}return this}validate(){let e=!0,t=this.getValueSize();t-Math.floor(t)!==0&&(console.error("THREE.KeyframeTrack: Invalid value size in track.",this),e=!1);let n=this.times,s=this.values,r=n.length;r===0&&(console.error("THREE.KeyframeTrack: Track is empty.",this),e=!1);let o=null;for(let a=0;a!==r;a++){let c=n[a];if(typeof c=="number"&&isNaN(c)){console.error("THREE.KeyframeTrack: Time is not a valid number.",this,a,c),e=!1;break}if(o!==null&&o>c){console.error("THREE.KeyframeTrack: Out of order keys.",this,a,c,o),e=!1;break}o=c}if(s!==void 0&&Mx(s))for(let a=0,c=s.length;a!==c;++a){let l=s[a];if(isNaN(l)){console.error("THREE.KeyframeTrack: Value is not a valid number.",this,a,l),e=!1;break}}return e}optimize(){let e=this.times.slice(),t=this.values.slice(),n=this.getValueSize(),s=this.getInterpolation()===Ia,r=e.length-1,o=1;for(let a=1;a<r;++a){let c=!1,l=e[a],h=e[a+1];if(l!==h&&(a!==1||l!==e[0]))if(s)c=!0;else{let u=a*n,d=u-n,f=u+n;for(let g=0;g!==n;++g){let y=t[u+g];if(y!==t[d+g]||y!==t[f+g]){c=!0;break}}}if(c){if(a!==o){e[o]=e[a];let u=a*n,d=o*n;for(let f=0;f!==n;++f)t[d+f]=t[u+f]}++o}}if(r>0){e[o]=e[r];for(let a=r*n,c=o*n,l=0;l!==n;++l)t[c+l]=t[a+l];++o}return o!==e.length?(this.times=e.slice(0,o),this.values=t.slice(0,o*n)):(this.times=e,this.values=t),this}clone(){let e=this.times.slice(),t=this.values.slice(),n=this.constructor,s=new n(this.name,e,t);return s.createInterpolant=this.createInterpolant,s}};xn.prototype.TimeBufferType=Float32Array;xn.prototype.ValueBufferType=Float32Array;xn.prototype.DefaultInterpolation=Zc;var wi=class extends xn{constructor(e,t,n){super(e,t,n)}};wi.prototype.ValueTypeName="bool";wi.prototype.ValueBufferType=Array;wi.prototype.DefaultInterpolation=uo;wi.prototype.InterpolantFactoryMethodLinear=void 0;wi.prototype.InterpolantFactoryMethodSmooth=void 0;var Rl=class extends xn{};Rl.prototype.ValueTypeName="color";var Pl=class extends xn{};Pl.prototype.ValueTypeName="number";var Il=class extends ps{constructor(e,t,n,s){super(e,t,n,s)}interpolate_(e,t,n,s){let r=this.resultBuffer,o=this.sampleValues,a=this.valueSize,c=(n-t)/(s-t),l=e*a;for(let h=l+a;l!==h;l+=4)si.slerpFlat(r,0,o,l-a,o,l,c);return r}},Vo=class extends xn{InterpolantFactoryMethodLinear(e){return new Il(this.times,this.values,this.getValueSize(),e)}};Vo.prototype.ValueTypeName="quaternion";Vo.prototype.InterpolantFactoryMethodSmooth=void 0;var Ai=class extends xn{constructor(e,t,n){super(e,t,n)}};Ai.prototype.ValueTypeName="string";Ai.prototype.ValueBufferType=Array;Ai.prototype.DefaultInterpolation=uo;Ai.prototype.InterpolantFactoryMethodLinear=void 0;Ai.prototype.InterpolantFactoryMethodSmooth=void 0;var Ll=class extends xn{};Ll.prototype.ValueTypeName="vector";var Dl=class{constructor(e,t,n){let s=this,r=!1,o=0,a=0,c,l=[];this.onStart=void 0,this.onLoad=e,this.onProgress=t,this.onError=n,this.itemStart=function(h){a++,r===!1&&s.onStart!==void 0&&s.onStart(h,o,a),r=!0},this.itemEnd=function(h){o++,s.onProgress!==void 0&&s.onProgress(h,o,a),o===a&&(r=!1,s.onLoad!==void 0&&s.onLoad())},this.itemError=function(h){s.onError!==void 0&&s.onError(h)},this.resolveURL=function(h){return c?c(h):h},this.setURLModifier=function(h){return c=h,this},this.addHandler=function(h,u){return l.push(h,u),this},this.removeHandler=function(h){let u=l.indexOf(h);return u!==-1&&l.splice(u,2),this},this.getHandler=function(h){for(let u=0,d=l.length;u<d;u+=2){let f=l[u],g=l[u+1];if(f.global&&(f.lastIndex=0),f.test(h))return g}return null}}},Sx=new Dl,Ul=class{constructor(e){this.manager=e!==void 0?e:Sx,this.crossOrigin="anonymous",this.withCredentials=!1,this.path="",this.resourcePath="",this.requestHeader={}}load(){}loadAsync(e,t){let n=this;return new Promise(function(s,r){n.load(e,s,t,r)})}parse(){}setCrossOrigin(e){return this.crossOrigin=e,this}setWithCredentials(e){return this.withCredentials=e,this}setPath(e){return this.path=e,this}setResourcePath(e){return this.resourcePath=e,this}setRequestHeader(e){return this.requestHeader=e,this}};Ul.DEFAULT_MATERIAL_NAME="__DEFAULT";var ms=class extends Nt{constructor(e,t=1){super(),this.isLight=!0,this.type="Light",this.color=new Qe(e),this.intensity=t}dispose(){}copy(e,t){return super.copy(e,t),this.color.copy(e.color),this.intensity=e.intensity,this}toJSON(e){let t=super.toJSON(e);return t.object.color=this.color.getHex(),t.object.intensity=this.intensity,this.groundColor!==void 0&&(t.object.groundColor=this.groundColor.getHex()),this.distance!==void 0&&(t.object.distance=this.distance),this.angle!==void 0&&(t.object.angle=this.angle),this.decay!==void 0&&(t.object.decay=this.decay),this.penumbra!==void 0&&(t.object.penumbra=this.penumbra),this.shadow!==void 0&&(t.object.shadow=this.shadow.toJSON()),this.target!==void 0&&(t.object.target=this.target.uuid),t}},or=class extends ms{constructor(e,t,n){super(e,n),this.isHemisphereLight=!0,this.type="HemisphereLight",this.position.copy(Nt.DEFAULT_UP),this.updateMatrix(),this.groundColor=new Qe(t)}copy(e,t){return super.copy(e,t),this.groundColor.copy(e.groundColor),this}},hc=new _t,Md=new R,Sd=new R,Go=class{constructor(e){this.camera=e,this.intensity=1,this.bias=0,this.normalBias=0,this.radius=1,this.blurSamples=8,this.mapSize=new le(512,512),this.map=null,this.mapPass=null,this.matrix=new _t,this.autoUpdate=!0,this.needsUpdate=!1,this._frustum=new Js,this._frameExtents=new le(1,1),this._viewportCount=1,this._viewports=[new ft(0,0,1,1)]}getViewportCount(){return this._viewportCount}getFrustum(){return this._frustum}updateMatrices(e){let t=this.camera,n=this.matrix;Md.setFromMatrixPosition(e.matrixWorld),t.position.copy(Md),Sd.setFromMatrixPosition(e.target.matrixWorld),t.lookAt(Sd),t.updateMatrixWorld(),hc.multiplyMatrices(t.projectionMatrix,t.matrixWorldInverse),this._frustum.setFromProjectionMatrix(hc),n.set(.5,0,0,.5,0,.5,0,.5,0,0,.5,.5,0,0,0,1),n.multiply(hc)}getViewport(e){return this._viewports[e]}getFrameExtents(){return this._frameExtents}dispose(){this.map&&this.map.dispose(),this.mapPass&&this.mapPass.dispose()}copy(e){return this.camera=e.camera.clone(),this.intensity=e.intensity,this.bias=e.bias,this.radius=e.radius,this.mapSize.copy(e.mapSize),this}clone(){return new this.constructor().copy(this)}toJSON(){let e={};return this.intensity!==1&&(e.intensity=this.intensity),this.bias!==0&&(e.bias=this.bias),this.normalBias!==0&&(e.normalBias=this.normalBias),this.radius!==1&&(e.radius=this.radius),(this.mapSize.x!==512||this.mapSize.y!==512)&&(e.mapSize=this.mapSize.toArray()),e.camera=this.camera.toJSON(!1).object,delete e.camera.matrix,e}};var Ed=new _t,Fs=new R,uc=new R,Nl=class extends Go{constructor(){super(new Ut(90,1,.5,500)),this.isPointLightShadow=!0,this._frameExtents=new le(4,2),this._viewportCount=6,this._viewports=[new ft(2,1,1,1),new ft(0,1,1,1),new ft(3,1,1,1),new ft(1,1,1,1),new ft(3,0,1,1),new ft(1,0,1,1)],this._cubeDirections=[new R(1,0,0),new R(-1,0,0),new R(0,0,1),new R(0,0,-1),new R(0,1,0),new R(0,-1,0)],this._cubeUps=[new R(0,1,0),new R(0,1,0),new R(0,1,0),new R(0,1,0),new R(0,0,1),new R(0,0,-1)]}updateMatrices(e,t=0){let n=this.camera,s=this.matrix,r=e.distance||n.far;r!==n.far&&(n.far=r,n.updateProjectionMatrix()),Fs.setFromMatrixPosition(e.matrixWorld),n.position.copy(Fs),uc.copy(n.position),uc.add(this._cubeDirections[t]),n.up.copy(this._cubeUps[t]),n.lookAt(uc),n.updateMatrixWorld(),s.makeTranslation(-Fs.x,-Fs.y,-Fs.z),Ed.multiplyMatrices(n.projectionMatrix,n.matrixWorldInverse),this._frustum.setFromProjectionMatrix(Ed)}},Tn=class extends ms{constructor(e,t,n=0,s=2){super(e,t),this.isPointLight=!0,this.type="PointLight",this.distance=n,this.decay=s,this.shadow=new Nl}get power(){return this.intensity*4*Math.PI}set power(e){this.intensity=e/(4*Math.PI)}dispose(){this.shadow.dispose()}copy(e,t){return super.copy(e,t),this.distance=e.distance,this.decay=e.decay,this.shadow=e.shadow.clone(),this}},kl=class extends Go{constructor(){super(new wo(-5,5,5,-5,.5,500)),this.isDirectionalLightShadow=!0}},gs=class extends ms{constructor(e,t){super(e,t),this.isDirectionalLight=!0,this.type="DirectionalLight",this.position.copy(Nt.DEFAULT_UP),this.updateMatrix(),this.target=new Nt,this.shadow=new kl}dispose(){this.shadow.dispose()}copy(e){return super.copy(e),this.target=e.target.clone(),this.shadow=e.shadow.clone(),this}},Wo=class extends ms{constructor(e,t){super(e,t),this.isAmbientLight=!0,this.type="AmbientLight"}};var Xo=class{constructor(e=!0){this.autoStart=e,this.startTime=0,this.oldTime=0,this.elapsedTime=0,this.running=!1}start(){this.startTime=Td(),this.oldTime=this.startTime,this.elapsedTime=0,this.running=!0}stop(){this.getElapsedTime(),this.running=!1,this.autoStart=!1}getElapsedTime(){return this.getDelta(),this.elapsedTime}getDelta(){let e=0;if(this.autoStart&&!this.running)return this.start(),0;if(this.running){let t=Td();e=(t-this.oldTime)/1e3,this.oldTime=t,this.elapsedTime+=e}return e}};function Td(){return performance.now()}var Ql="\\[\\]\\.:\\/",Ex=new RegExp("["+Ql+"]","g"),eh="[^"+Ql+"]",Tx="[^"+Ql.replace("\\.","")+"]",wx=/((?:WC+[\/:])*)/.source.replace("WC",eh),Ax=/(WCOD+)?/.source.replace("WCOD",Tx),Cx=/(?:\.(WC+)(?:\[(.+)\])?)?/.source.replace("WC",eh),Rx=/\.(WC+)(?:\[(.+)\])?/.source.replace("WC",eh),Px=new RegExp("^"+wx+Ax+Cx+Rx+"$"),Ix=["material","materials","bones","map"],Ol=class{constructor(e,t,n){let s=n||yt.parseTrackName(t);this._targetGroup=e,this._bindings=e.subscribe_(t,s)}getValue(e,t){this.bind();let n=this._targetGroup.nCachedObjects_,s=this._bindings[n];s!==void 0&&s.getValue(e,t)}setValue(e,t){let n=this._bindings;for(let s=this._targetGroup.nCachedObjects_,r=n.length;s!==r;++s)n[s].setValue(e,t)}bind(){let e=this._bindings;for(let t=this._targetGroup.nCachedObjects_,n=e.length;t!==n;++t)e[t].bind()}unbind(){let e=this._bindings;for(let t=this._targetGroup.nCachedObjects_,n=e.length;t!==n;++t)e[t].unbind()}},yt=class i{constructor(e,t,n){this.path=t,this.parsedPath=n||i.parseTrackName(t),this.node=i.findNode(e,this.parsedPath.nodeName),this.rootNode=e,this.getValue=this._getValue_unbound,this.setValue=this._setValue_unbound}static create(e,t,n){return e&&e.isAnimationObjectGroup?new i.Composite(e,t,n):new i(e,t,n)}static sanitizeNodeName(e){return e.replace(/\s/g,"_").replace(Ex,"")}static parseTrackName(e){let t=Px.exec(e);if(t===null)throw new Error("PropertyBinding: Cannot parse trackName: "+e);let n={nodeName:t[2],objectName:t[3],objectIndex:t[4],propertyName:t[5],propertyIndex:t[6]},s=n.nodeName&&n.nodeName.lastIndexOf(".");if(s!==void 0&&s!==-1){let r=n.nodeName.substring(s+1);Ix.indexOf(r)!==-1&&(n.nodeName=n.nodeName.substring(0,s),n.objectName=r)}if(n.propertyName===null||n.propertyName.length===0)throw new Error("PropertyBinding: can not parse propertyName from trackName: "+e);return n}static findNode(e,t){if(t===void 0||t===""||t==="."||t===-1||t===e.name||t===e.uuid)return e;if(e.skeleton){let n=e.skeleton.getBoneByName(t);if(n!==void 0)return n}if(e.children){let n=function(r){for(let o=0;o<r.length;o++){let a=r[o];if(a.name===t||a.uuid===t)return a;let c=n(a.children);if(c)return c}return null},s=n(e.children);if(s)return s}return null}_getValue_unavailable(){}_setValue_unavailable(){}_getValue_direct(e,t){e[t]=this.targetObject[this.propertyName]}_getValue_array(e,t){let n=this.resolvedProperty;for(let s=0,r=n.length;s!==r;++s)e[t++]=n[s]}_getValue_arrayElement(e,t){e[t]=this.resolvedProperty[this.propertyIndex]}_getValue_toArray(e,t){this.resolvedProperty.toArray(e,t)}_setValue_direct(e,t){this.targetObject[this.propertyName]=e[t]}_setValue_direct_setNeedsUpdate(e,t){this.targetObject[this.propertyName]=e[t],this.targetObject.needsUpdate=!0}_setValue_direct_setMatrixWorldNeedsUpdate(e,t){this.targetObject[this.propertyName]=e[t],this.targetObject.matrixWorldNeedsUpdate=!0}_setValue_array(e,t){let n=this.resolvedProperty;for(let s=0,r=n.length;s!==r;++s)n[s]=e[t++]}_setValue_array_setNeedsUpdate(e,t){let n=this.resolvedProperty;for(let s=0,r=n.length;s!==r;++s)n[s]=e[t++];this.targetObject.needsUpdate=!0}_setValue_array_setMatrixWorldNeedsUpdate(e,t){let n=this.resolvedProperty;for(let s=0,r=n.length;s!==r;++s)n[s]=e[t++];this.targetObject.matrixWorldNeedsUpdate=!0}_setValue_arrayElement(e,t){this.resolvedProperty[this.propertyIndex]=e[t]}_setValue_arrayElement_setNeedsUpdate(e,t){this.resolvedProperty[this.propertyIndex]=e[t],this.targetObject.needsUpdate=!0}_setValue_arrayElement_setMatrixWorldNeedsUpdate(e,t){this.resolvedProperty[this.propertyIndex]=e[t],this.targetObject.matrixWorldNeedsUpdate=!0}_setValue_fromArray(e,t){this.resolvedProperty.fromArray(e,t)}_setValue_fromArray_setNeedsUpdate(e,t){this.resolvedProperty.fromArray(e,t),this.targetObject.needsUpdate=!0}_setValue_fromArray_setMatrixWorldNeedsUpdate(e,t){this.resolvedProperty.fromArray(e,t),this.targetObject.matrixWorldNeedsUpdate=!0}_getValue_unbound(e,t){this.bind(),this.getValue(e,t)}_setValue_unbound(e,t){this.bind(),this.setValue(e,t)}bind(){let e=this.node,t=this.parsedPath,n=t.objectName,s=t.propertyName,r=t.propertyIndex;if(e||(e=i.findNode(this.rootNode,t.nodeName),this.node=e),this.getValue=this._getValue_unavailable,this.setValue=this._setValue_unavailable,!e){console.warn("THREE.PropertyBinding: No target node found for track: "+this.path+".");return}if(n){let l=t.objectIndex;switch(n){case"materials":if(!e.material){console.error("THREE.PropertyBinding: Can not bind to material as node does not have a material.",this);return}if(!e.material.materials){console.error("THREE.PropertyBinding: Can not bind to material.materials as node.material does not have a materials array.",this);return}e=e.material.materials;break;case"bones":if(!e.skeleton){console.error("THREE.PropertyBinding: Can not bind to bones as node does not have a skeleton.",this);return}e=e.skeleton.bones;for(let h=0;h<e.length;h++)if(e[h].name===l){l=h;break}break;case"map":if("map"in e){e=e.map;break}if(!e.material){console.error("THREE.PropertyBinding: Can not bind to material as node does not have a material.",this);return}if(!e.material.map){console.error("THREE.PropertyBinding: Can not bind to material.map as node.material does not have a map.",this);return}e=e.material.map;break;default:if(e[n]===void 0){console.error("THREE.PropertyBinding: Can not bind to objectName of node undefined.",this);return}e=e[n]}if(l!==void 0){if(e[l]===void 0){console.error("THREE.PropertyBinding: Trying to bind to objectIndex of objectName, but is undefined.",this,e);return}e=e[l]}}let o=e[s];if(o===void 0){let l=t.nodeName;console.error("THREE.PropertyBinding: Trying to update property for track: "+l+"."+s+" but it wasn't found.",e);return}let a=this.Versioning.None;this.targetObject=e,e.needsUpdate!==void 0?a=this.Versioning.NeedsUpdate:e.matrixWorldNeedsUpdate!==void 0&&(a=this.Versioning.MatrixWorldNeedsUpdate);let c=this.BindingType.Direct;if(r!==void 0){if(s==="morphTargetInfluences"){if(!e.geometry){console.error("THREE.PropertyBinding: Can not bind to morphTargetInfluences because node does not have a geometry.",this);return}if(!e.geometry.morphAttributes){console.error("THREE.PropertyBinding: Can not bind to morphTargetInfluences because node does not have a geometry.morphAttributes.",this);return}e.morphTargetDictionary[r]!==void 0&&(r=e.morphTargetDictionary[r])}c=this.BindingType.ArrayElement,this.resolvedProperty=o,this.propertyIndex=r}else o.fromArray!==void 0&&o.toArray!==void 0?(c=this.BindingType.HasFromToArray,this.resolvedProperty=o):Array.isArray(o)?(c=this.BindingType.EntireArray,this.resolvedProperty=o):this.propertyName=s;this.getValue=this.GetterByBindingType[c],this.setValue=this.SetterByBindingTypeAndVersioning[c][a]}unbind(){this.node=null,this.getValue=this._getValue_unbound,this.setValue=this._setValue_unbound}};yt.Composite=Ol;yt.prototype.BindingType={Direct:0,EntireArray:1,ArrayElement:2,HasFromToArray:3};yt.prototype.Versioning={None:0,NeedsUpdate:1,MatrixWorldNeedsUpdate:2};yt.prototype.GetterByBindingType=[yt.prototype._getValue_direct,yt.prototype._getValue_array,yt.prototype._getValue_arrayElement,yt.prototype._getValue_toArray];yt.prototype.SetterByBindingTypeAndVersioning=[[yt.prototype._setValue_direct,yt.prototype._setValue_direct_setNeedsUpdate,yt.prototype._setValue_direct_setMatrixWorldNeedsUpdate],[yt.prototype._setValue_array,yt.prototype._setValue_array_setNeedsUpdate,yt.prototype._setValue_array_setMatrixWorldNeedsUpdate],[yt.prototype._setValue_arrayElement,yt.prototype._setValue_arrayElement_setNeedsUpdate,yt.prototype._setValue_arrayElement_setMatrixWorldNeedsUpdate],[yt.prototype._setValue_fromArray,yt.prototype._setValue_fromArray_setNeedsUpdate,yt.prototype._setValue_fromArray_setMatrixWorldNeedsUpdate]];var iv=new Float32Array(1);typeof __THREE_DEVTOOLS__!="undefined"&&__THREE_DEVTOOLS__.dispatchEvent(new CustomEvent("register",{detail:{revision:Fl}}));typeof window!="undefined"&&(window.__THREE__?console.warn("WARNING: Multiple instances of Three.js being imported."):window.__THREE__=Fl);var lr=class i extends tt{constructor(){let e=i.SkyShader,t=new cn({name:e.name,uniforms:Zl.clone(e.uniforms),vertexShader:e.vertexShader,fragmentShader:e.fragmentShader,side:Ht,depthWrite:!1});super(new ye(1,1,1),t),this.isSky=!0}};lr.SkyShader={name:"SkyShader",uniforms:{turbidity:{value:2},rayleigh:{value:1},mieCoefficient:{value:.005},mieDirectionalG:{value:.8},sunPosition:{value:new R},up:{value:new R(0,1,0)}},vertexShader:`
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

		}`};function Lx(i){return function(){i|=0,i=i+1831565813|0;let e=Math.imul(i^i>>>15,1|i);return e=e+Math.imul(e^e>>>7,61|e)^e,((e^e>>>14)>>>0)/4294967296}}var ov=Lx(1234567);var Ot=(i,e,t)=>Math.min(t,Math.max(e,i)),dt=(i,e,t)=>i+(e-i)*t;var Ft=(i,e)=>Math.hypot(i.x-e.x,i.z-e.z),ys=(i,e)=>{let t=(e-i)%(Math.PI*2);return t>Math.PI&&(t-=Math.PI*2),t<-Math.PI&&(t+=Math.PI*2),t};var th=new Map;function jo(i,e,t){let n=document.createElement("canvas");n.width=i,n.height=e;let s=n.getContext("2d");return t(s,i,e),n}function vn(i,e,t,n,s=1,r=1){let o=i+s+"x"+r;if(th.has(o))return th.get(o);let a=jo(e,t,n),c=new Mi(a);return c.wrapS=c.wrapT=qs,c.repeat.set(s,r),c.colorSpace=Xt,c.anisotropy=4,th.set(o,c),c}function oi(i,e,t,n=20,s=2600){for(let r=0;r<s;r++){let o=Math.random()*e,a=Math.random()*t,c=Math.floor(Math.random()*255);i.fillStyle=`rgba(${c},${c},${c},${Math.random()*n/255})`,i.fillRect(o,a,1+Math.random()*2,1+Math.random()*2)}}function Ko(i,e,t,n,s=26,r=40,o=.12){for(let a=0;a<s;a++){let c=Math.random()*e,l=Math.random()*t,h=8+Math.random()*r,u=i.createRadialGradient(c,l,0,c,l,h);u.addColorStop(0,n),u.addColorStop(1,"rgba(0,0,0,0)"),i.globalAlpha=o,i.fillStyle=u,i.beginPath(),i.arc(c,l,h,0,7),i.fill(),i.globalAlpha=1}}function Ue(i,e,t,n=.06,s=2){n=Math.min(n,i/2-.001,e/2-.001);let r=new nr,o=-i/2,a=-e/2;r.moveTo(o+n,a),r.lineTo(o+i-n,a),r.quadraticCurveTo(o+i,a,o+i,a+n),r.lineTo(o+i,a+e-n),r.quadraticCurveTo(o+i,a+e,o+i-n,a+e),r.lineTo(o+n,a+e),r.quadraticCurveTo(o,a+e,o,a+e-n),r.lineTo(o,a+n),r.quadraticCurveTo(o,a,o+n,a);let c=new Ho(r,{depth:t,bevelEnabled:!0,bevelSegments:s,steps:1,bevelSize:Math.min(n*.5,.02),bevelThickness:Math.min(n*.5,.02),curveSegments:3});return c.translate(0,0,-t/2),c.computeVertexNormals(),c}function re(i,e,t=0,n=0,s=0){let r=new tt(i,e);return r.position.set(t,n,s),r.castShadow=!0,r.receiveShadow=!0,r}function te(i,e={}){var t,n,s,r,o;return new Ti({color:i,roughness:(t=e.roughness)!=null?t:.75,metalness:(n=e.metalness)!=null?n:.05,map:e.map||null,emissive:e.emissive||0,emissiveIntensity:(s=e.emissiveIntensity)!=null?s:1,transparent:e.transparent||!1,opacity:(r=e.opacity)!=null?r:1,side:e.side||Sn,flatShading:e.flat||!1,depthWrite:(o=e.depthWrite)!=null?o:!0})}var Zo=class{constructor(){this.list=[]}add(e,t,n,s,r="",o=null){let a={minX:e,maxX:t,minZ:n,maxZ:s,tag:r,ref:o,enabled:!0};return this.list.push(a),a}addFromMesh(e,t=""){let n=new yn().setFromObject(e);return this.add(n.min.x,n.max.x,n.min.z,n.max.z,t,e)}resolve(e,t){for(let n of this.list){if(!n.enabled)continue;let s=Ot(e.x,n.minX,n.maxX),r=Ot(e.z,n.minZ,n.maxZ),o=e.x-s,a=e.z-r,c=o*o+a*a;if(c<t*t)if(c>1e-6){let l=Math.sqrt(c);e.x=s+o/l*t,e.z=r+a/l*t}else{let l=e.x-n.minX,h=n.maxX-e.x,u=e.z-n.minZ,d=n.maxZ-e.z,f=Math.min(l,h,u,d);f===l?e.x=n.minX-t:f===h?e.x=n.maxX+t:f===u?e.z=n.minZ-t:e.z=n.maxZ+t}}return e}blocked(e,t,n,s){let r=n-e,o=s-t;for(let a of this.list)if(!(!a.enabled||a.tag==="noLOS")&&Dx(e,t,r,o,a))return!0;return!1}};function Dx(i,e,t,n,s){let r=0,o=1;if(Math.abs(t)<1e-8){if(i<s.minX||i>s.maxX)return!1}else{let a=(s.minX-i)/t,c=(s.maxX-i)/t;if(a>c){let l=a;a=c,c=l}if(r=Math.max(r,a),o=Math.min(o,c),r>o)return!1}if(Math.abs(n)<1e-8){if(e<s.minZ||e>s.maxZ)return!1}else{let a=(s.minZ-e)/n,c=(s.maxZ-e)/n;if(a>c){let l=a;a=c,c=l}if(r=Math.max(r,a),o=Math.min(o,c),r>o)return!1}return!0}function Qd(i,e={}){let t=e.w||256,n=e.h||64,s=jo(t,n,c=>{c.clearRect(0,0,t,n),c.font=`700 ${e.size||34}px system-ui, sans-serif`,c.textAlign="center",c.textBaseline="middle",c.fillStyle="rgba(8,8,10,.82)";let l=14,h=c.measureText(i).width;Ux(c,t/2-h/2-l,6,h+l*2,n-12,10),c.fill(),c.fillStyle=e.color||"#ffe9a8",c.fillText(i,t/2,n/2+1)}),r=new Mi(s);r.colorSpace=Xt;let o=new Ks({map:r,transparent:!0,depthWrite:!1}),a=new Io(o);return a.scale.set((e.scale||1)*(t/100),(e.scale||1)*(n/100),1),a}function Ux(i,e,t,n,s,r){i.beginPath(),i.moveTo(e+r,t),i.arcTo(e+n,t,e+n,t+s,r),i.arcTo(e+n,t+s,e,t+s,r),i.arcTo(e,t+s,e,t,r),i.arcTo(e,t,e+n,t,r),i.closePath()}var ef={},tf={},sf=(i,e)=>ef[i]||(ef[i]=e()),ze=(i,e={})=>{var n,s,r;let t=i+"|"+((n=e.roughness)!=null?n:.75)+"|"+((s=e.metalness)!=null?s:.05)+"|"+((r=e.emissive)!=null?r:0);return tf[t]||(tf[t]=te(i,e))},ai=(i,e)=>sf("cap"+i+e,()=>new fs(i,e,4,10));function ue(i,e,t,n=0,s=0,r=0){let o=new tt(i,e);return o.position.set(n,s,r),o.castShadow=!0,o.receiveShadow=!0,t.add(o),o}var xs=(i,e=12)=>sf("sph"+i+e,()=>new kt(i,e,Math.max(6,e-4))),qt={fists:{name:"\u041A\u0443\u043B\u0430\u043A\u0438",icon:"\u{1F44A}",dmg:26,rate:.42,melee:!0,ammo:null,desc:"\u0420\u0443\u043A\u0438 \u2014 \u0431\u0435\u0441\u043F\u043B\u0430\u0442\u043D\u043E \u0438 \u0441\u0435\u0440\u0434\u0438\u0442\u043E."},knife:{name:"\u041D\u043E\u0436",icon:"\u{1F52A}",dmg:55,rate:.5,melee:!0,ammo:null,price:140,desc:"\u0422\u0438\u0445\u0438\u0439, \u0434\u0435\u0448\u0451\u0432\u044B\u0439, \u0443\u0431\u0435\u0434\u0438\u0442\u0435\u043B\u044C\u043D\u044B\u0439. \u0411\u043B\u0438\u0436\u043D\u0438\u0439 \u0431\u043E\u0439."},baton:{name:"\u0414\u0443\u0431\u0438\u043D\u043A\u0430",icon:"\u{1F3D2}",dmg:34,rate:.55,melee:!0,ammo:null,price:90,desc:"\u0420\u0435\u0437\u0438\u043D\u043E\u0432\u0430\u044F. \u041D\u0435 \u0443\u0431\u0438\u0432\u0430\u0435\u0442, \u043D\u043E \u043E\u0431\u044A\u044F\u0441\u043D\u044F\u0435\u0442."},pistol:{name:"\u041F\u0438\u0441\u0442\u043E\u043B\u0435\u0442 \xAB\u0413\u0440\u043E\u0437\u0430\xBB",icon:"\u{1F52B}",dmg:42,rate:.22,ammo:"9\u043C\u043C",mag:12,price:420,ammoPrice:14,spread:.012,range:60,desc:"\u041D\u0430\u0434\u0451\u0436\u043D\u044B\u0439 9\u043C\u043C. 12 \u043F\u0430\u0442\u0440\u043E\u043D\u043E\u0432 \u0432 \u043C\u0430\u0433\u0430\u0437\u0438\u043D\u0435."},shotgun:{name:"\u0414\u0440\u043E\u0431\u043E\u0432\u0438\u043A \xAB\u041A\u0430\u0431\u0430\u043D\xBB",icon:"\u{1F4A5}",dmg:96,rate:.85,ammo:"12\u043A",mag:6,price:980,ammoPrice:26,spread:.055,range:28,desc:"\u0414\u0432\u0430 \u0441\u0442\u0432\u043E\u043B\u0430 \u043F\u0440\u0430\u0432\u0434\u044B. \u0411\u043B\u0438\u0437\u043A\u043E \u2014 \u0431\u043E\u043B\u044C\u043D\u043E."},rifle:{name:"\u0410\u0432\u0442\u043E\u043C\u0430\u0442 \xAB\u0412\u0438\u0445\u0440\u044C\xBB",icon:"\u{1F3AF}",dmg:58,rate:.11,ammo:"7.62",mag:30,price:2100,ammoPrice:30,spread:.022,range:110,desc:"\u041F\u043E\u043B\u043D\u044B\u0439 \u0430\u0432\u0442\u043E\u043C\u0430\u0442. \u041F\u043E\u043B\u0438\u0446\u0438\u044F \u043D\u0435 \u043E\u0434\u043E\u0431\u0440\u0438\u0442."}},Qo={"9\u043C\u043C":14,"12\u043A":26,"7.62":30};function Ri(i){let e=new qe,t=ze(2237482,{roughness:.45,metalness:.75}),n=ze(9278364,{roughness:.3,metalness:.9}),s=ze(7028514,{roughness:.85}),r=ze(1316122,{roughness:.7});if(i==="pistol")ue(Ue(.045,.055,.19,.012),t,e,0,.02,.06),ue(Ue(.038,.115,.055,.012),r,e,0,-.05,-.02).rotation.x=.22,ue(new et(.011,.011,.06,8),n,e,0,.035,.15).rotation.x=Math.PI/2,ue(Ue(.028,.03,.05,.008),t,e,0,-.035,.08).rotation.x=-.5,ue(new ye(.01,.022,.01),n,e,0,.052,-.02);else if(i==="shotgun")ue(Ue(.05,.06,.34,.014),t,e,0,.02,.16),ue(new et(.016,.016,.62,10),n,e,0,.045,.3).rotation.x=Math.PI/2,ue(new et(.013,.013,.5,10),n,e,0,0,.26).rotation.x=Math.PI/2,ue(Ue(.05,.09,.13,.02),s,e,0,-.02,-.12).rotation.x=.14,ue(Ue(.045,.05,.16,.02),s,e,0,-.01,.11),ue(Ue(.04,.1,.05,.01),r,e,0,-.05,-.02).rotation.x=.2;else if(i==="rifle")ue(Ue(.055,.07,.4,.014),t,e,0,.02,.13),ue(new et(.015,.015,.52,10),n,e,0,.04,.42).rotation.x=Math.PI/2,ue(Ue(.05,.06,.2,.015),s,e,0,-.01,.28),ue(Ue(.045,.09,.12,.02),s,e,0,-.01,-.1).rotation.x=.16,ue(Ue(.032,.15,.075,.012),r,e,0,-.09,.06).rotation.x=-.25,ue(Ue(.03,.075,.04,.01),r,e,0,-.06,-.03).rotation.x=.25,ue(new ye(.014,.05,.02),n,e,0,.075,.02);else if(i==="knife"){ue(Ue(.022,.1,.03,.008),r,e,0,-.02,-.01);let o=ue(new ye(.008,.03,.19),n,e,0,.035,.09);o.rotation.x=0,ue(new ye(.05,.014,.02),n,e,0,.02,-.005)}else if(i==="baton")ue(new et(.017,.02,.42,10),r,e,0,.12,.02).rotation.x=-.15,ue(new et(.021,.021,.09,10),ze(3357252),e,0,-.06,-.01).rotation.x=-.15;else if(i==="bag"){let o=ze(3095084,{roughness:.9});ue(Ue(.3,.34,.16,.05),o,e,0,-.06,.02),ue(Ue(.26,.12,.2,.04),o,e,0,.12,.02),ue(new sn(.09,.012,6,12,Math.PI),ze(7035450),e,0,.2,.02),ue(new ye(.03,.02,.02),ze(14202442,{metalness:.8,roughness:.3}),e,0,.1,.11)}return e}var nf={gentleman:{skin:15119500,jacket:2830138,pants:2369327,shirt:15855590,accent:9048608,hat:"fedora",hatColor:1842982,tall:1.03,build:1},gopnik:{skin:14462598,jacket:10230308,pants:1777188,shirt:10230308,accent:15921906,hat:"flat",hatColor:1316378,tall:.99,build:1.06},elderly:{skin:14268833,jacket:5917244,pants:3946544,shirt:13617076,accent:9143672,hat:"newsboy",hatColor:4866616,tall:.96,build:.96,hunch:.22},normal:{skin:13279353,jacket:3108751,pants:2568252,shirt:14209990,accent:16777215,hat:null,tall:1,build:1},thug:{skin:12159587,jacket:2830137,pants:2237740,shirt:3488325,accent:9182236,hat:"beanie",hatColor:1447966,tall:1,build:1.08},cashier:{skin:14991520,jacket:2767703,pants:2304566,shirt:16052970,accent:11542560,hat:null,tall:.98,build:.95},guard:{skin:13805954,jacket:1911622,pants:1449779,shirt:2902650,accent:14202442,hat:"cap",hatColor:1450554,tall:1.02,build:1.05},cop:{skin:14068612,jacket:2240589,pants:1712952,shirt:3363466,accent:14730346,hat:"police",hatColor:1779520,tall:1.02,build:1.03},seller:{skin:13081202,jacket:4864552,pants:3354666,shirt:10462882,accent:7035450,hat:"none",hatColor:2762272,tall:1,build:1,beard:!0}},Ci=class{constructor(e="normal",t={}){let n={hatColor:2762272,...nf[e]||nf.normal,...t.skinOverride};this.kind=e,this.S=n,this.root=new qe,this.body=new qe,this.root.add(this.body),this.phase=Math.random()*6,this.state="idle",this.hurtT=0,this.punchT=0,this.lying=!1,this.lieT=0,this.lookTarget=null,this.isDead=!1;let s=ze(n.skin,{roughness:.72}),r=ze(n.jacket,{roughness:.82}),o=ze(n.pants,{roughness:.85}),a=ze(n.shirt,{roughness:.7}),c=ze(n.accent,{roughness:.6}),l=ze(1381914,{roughness:.55}),h=ze(n.hatColor,{roughness:.85}),u=n.build||1;if(this.hips=new qe,this.hips.position.y=.92*n.tall,this.body.add(this.hips),ue(ai(.115*u,.08),o,this.hips,0,-.02,0).scale.set(1.15,1,.9),this.torso=new qe,this.torso.position.y=.155,this.torso.rotation.x=n.hunch||0,this.hips.add(this.torso),ue(ai(.16*u,.24),r,this.torso,0,.16,0).scale.set(1.18,1,.82),e==="gentleman"){let P=ue(new ye(.12,.25,.02),a,this.torso,0,.2,.118);P.rotation.x=-.04;let z=ue(new ye(.033,.22,.02),c,this.torso,0,.185,.133);z.rotation.x=-.03,ue(new ye(.06,.045,.028),c,this.torso,0,.31,.13);let _=ue(new ye(.07,.3,.03),ze(2237999),this.torso,-.07,.19,.105);_.rotation.z=.16,_.rotation.x=-.05;let S=ue(new ye(.07,.3,.03),ze(2237999),this.torso,.07,.19,.105);S.rotation.z=-.16,S.rotation.x=-.05}else if(e==="gopnik"){for(let z=0;z<3;z++){let _=ue(new ye(.012,.22,.012),c,this.torso,-.06+z*.03,.2,.13);_.rotation.x=-.05}ue(new sn(.085,.008,5,14,Math.PI*1.2),ze(14202442,{metalness:.9,roughness:.25}),this.torso,0,.3,.1).rotation.set(1.2,0,.2),ue(new ye(.014,.3,.014),ze(15263976,{metalness:.5}),this.torso,0,.18,.128)}else if(e==="guard"||e==="cop"){let P=ue(new ye(.05,.045,.012),ze(14730346,{metalness:.9,roughness:.25}),this.torso,-.09,.24,.12);P.rotation.z=.1,ue(new ye(.2,.03,.02),ze(790294),this.torso,0,.03,.12),ue(new ye(.05,.09,.02),ze(14202442,{metalness:.8}),this.torso,.09,.02,.12),e==="cop"&&ue(new ye(.045,.055,.012),c,this.torso,0,.33,.125)}else if(e==="cashier"){ue(new ye(.13,.26,.02),a,this.torso,0,.14,.117);for(let P=0;P<3;P++)ue(new et(.008,.008,.012,6),ze(2236962),this.torso,-.03+P*.03,.16-P*.075,.132).rotation.x=Math.PI/2}else if(e==="thug"){ue(new kt(.175,12,10,0,Math.PI*2,0,Math.PI*.55),ze(3948877),this.torso,0,.34,-.075).scale.set(1.18,1.2,1.1);let z=ue(new ye(.014,.26,.012),ze(4211792),this.torso,0,.16,.127)}else if(e==="elderly"){for(let P=0;P<3;P++)ue(new et(.012,.012,.014,6),ze(3024928),this.torso,.03,.24-P*.09,.128).rotation.x=Math.PI/2;ue(new ye(.2,.03,.26),a,this.torso,0,.34,-.02)}else ue(new ye(.12,.18,.02),a,this.torso,0,.22,.12);let g=ue(ai(.045,.05),s,this.torso,0,.35,0);this.head=new qe,this.head.position.y=.42,this.torso.add(this.head),ue(xs(.135,16),s,this.head,0,.06,0).scale.set(.95,1.05,.98),ue(xs(.1,12),s,this.head,0,-.01,.02).scale.set(.92,.85,.95);let p=ue(new zo(.028,.075,6),s,this.head,0,.045,.128);p.rotation.x=Math.PI*.52;let M=ze(16118506,{roughness:.4}),x=ze(1316380,{roughness:.25});[-.052,.052].forEach(P=>{ue(xs(.026,10),M,this.head,P,.075,.108).scale.set(1,.85,.6),ue(xs(.012,8),x,this.head,P,.075,.128)}),[-.052,.052].forEach(P=>{let z=ue(new ye(.048,.012,.018),h,this.head,P,.105,.118);z.rotation.z=P>0?-.12:.12});let b=ue(new ye(.062,.012,.014),ze(8010292,{roughness:.6}),this.head,0,-.02,.118);if([-.128,.128].forEach(P=>{ue(xs(.03,8),s,this.head,P,.055,0).scale.set(.5,1,.8)}),ue(new kt(.14,14,10,0,Math.PI*2,0,Math.PI*.44),e==="elderly"?ze(13618372):h,this.head,0,.082,-.004).scale.set(1,.95,1.02),n.hat==="fedora"){let P=ue(new et(.26,.28,.022,20),ze(n.hatColor),this.head,0,.14,.008);P.scale.set(1,1,1.05),P.rotation.x=.04;let z=ue(new et(.15,.165,.15,18),ze(n.hatColor),this.head,0,.22,0),_=ue(new et(.168,.17,.035,18),ze(7016992),this.head,0,.16,0)}else if(n.hat==="flat"){ue(new et(.145,.152,.05,16),ze(n.hatColor),this.head,0,.15,0).scale.set(1.04,1,1.02);let z=ue(new ye(.2,.014,.1),ze(n.hatColor),this.head,0,.137,.1);z.rotation.x=-.1}else if(n.hat==="beanie")ue(new kt(.15,14,10,0,Math.PI*2,0,Math.PI*.6),ze(n.hatColor),this.head,0,.085,0).scale.set(1.04,1.15,1.04),ue(new sn(.14,.022,6,14),ze(2764086),this.head,0,.12,0).rotation.x=Math.PI/2;else if(n.hat==="cap"||n.hat==="police"){let P=ue(new et(.15,.165,.09,16),ze(n.hatColor),this.head,0,.175,0),z=ue(new Bo(.16,16,0,Math.PI),ze(857119),this.head,0,.135,.075);z.rotation.x=-Math.PI/2+.25,n.hat==="police"?ue(new ye(.06,.06,.016),ze(14730346,{metalness:.9,roughness:.2}),this.head,0,.19,.15):ue(new ye(.16,.02,.02),ze(790294),this.head,0,.14,.16)}else n.hat==="newsboy"&&ue(new kt(.148,12,8,0,Math.PI*2,0,Math.PI*.5),ze(n.hatColor),this.head,0,.1,0).scale.set(1.05,1,1.05);if(e==="gentleman"){ue(new ye(.09,.022,.02),ze(1709076),this.head,0,.006,.122);let P=ue(new ye(.115,.045,.014),ze(658192,{metalness:.6,roughness:.2}),this.head,0,.075,.125);P.rotation.x=-.04}if(e==="elderly"){ue(new sn(.032,.005,5,10),ze(2763306),this.head,-.052,.075,.122),ue(new sn(.032,.005,5,10),ze(2763306),this.head,.052,.075,.122),ue(new ye(.028,.006,.01),ze(2763306),this.head,0,.075,.125),this.cane=new qe;let P=ue(new et(.012,.014,.95,8),ze(4861984,{roughness:.7}),this.cane,0,-.47,0);ue(new sn(.035,.013,6,10,Math.PI),ze(4861984),this.cane,0,0,0),this.cane.position.set(.02,.02,.06)}n.beard&&ue(new kt(.1,10,8,0,Math.PI*2,0,Math.PI*.62),ze(4864554),this.head,0,-.045,.03).scale.set(1.02,1.05,.95);let A=P=>{let z=new qe;z.position.set(P*.235*u,.31,0),this.torso.add(z);let _=ue(ai(.062*u,.2),r,z,0,-.13,0);if(e==="gopnik")for(let H=0;H<3;H++)ue(new ye(.01,.16,.012),c,z,P*(.03+H*.025),-.13,.055);let S=new qe;S.position.y=-.27,z.add(S),ue(ai(.055*u,.18),e==="gentleman"||e==="guard"||e==="cop"||e==="cashier"?r:s,S,0,-.12,0),e==="elderly"&&ue(ai(.06,.12),r,S,0,-.09,0);let L=new qe;return L.position.y=-.25,S.add(L),ue(xs(.058,10),s,L,0,0,0).scale.set(1,1.1,.72),{shoulder:z,elbow:S,hand:L}};if(this.armL=A(-1),this.armR=A(1),e==="gentleman"){let P=ue(new sn(.03,.007,5,10),ze(14202442,{metalness:.95,roughness:.2}),this.armL.elbow,0,-.2,0);P.rotation.x=Math.PI/2}this.cane&&this.armL.hand.add(this.cane);let C=P=>{let z=new qe;z.position.set(P*.105*u,-.02,0),this.hips.add(z),ue(ai(.075*u,.22),o,z,0,-.14,0);let _=new qe;_.position.y=-.3,z.add(_),ue(ai(.066*u,.22),o,_,0,-.13,0);let S=new qe;S.position.y=-.29,_.add(S);let L=ue(Ue(.11,.075,.24,.03),l,S,0,.02,.045);return{hip:z,knee:_,foot:S}};this.legL=C(-1),this.legR=C(1),this.root.traverse(P=>{P.isMesh&&(P.castShadow=!0,P.receiveShadow=!0)}),this.weaponHolder=new qe,this.weaponHolder.position.set(0,-.02,.02),this.armR.hand.add(this.weaponHolder),this.weaponModel=null,this.weaponId="fists",this.setWeapon("fists"),this.baseY=0}setWeapon(e){if(this.weaponId=e||"fists",this.weaponModel&&(this.weaponHolder.remove(this.weaponModel),this.weaponModel=null),this.weaponHolder&&this.weaponId!=="fists"){let t=Ri(this.weaponId);t.rotation.set(-.15,0,0),this.weaponHolder.add(t),this.weaponModel=t}}setState(e){this.state!==e&&(this.state=e)}hurt(){this.hurtT=.35}punch(){this.punchT=.42}lieDown(e=0){this.lying=!0,this.lieT=e}wakeUp(){this.lying=!1,this.wakeAnim=1}update(e,t=0,n={}){var M,x,b,D;let s=this.S;this.hurtT>0&&(this.hurtT-=e),this.punchT>0&&(this.punchT-=e),this.phase+=e*(1.6+t*1.7);let r=this.phase,o=Ot(t/3.2,0,1.35),a=Math.PI/2;if(this.lying){this.lieT+=e;let A=Ot(this.lieT/.8,0,1);this.body.rotation.x=dt(this.body.rotation.x,a,.12),this.body.position.y=dt(this.body.position.y,.05,.12),this.legL.hip.rotation.x=dt(this.legL.hip.rotation.x,.05,.1),this.legR.hip.rotation.x=dt(this.legR.hip.rotation.x,.12,.1),this.legL.knee.rotation.x=dt(this.legL.knee.rotation.x,.1,.1),this.legR.knee.rotation.x=dt(this.legR.knee.rotation.x,.05,.1),this.armL.shoulder.rotation.set(dt(this.armL.shoulder.rotation.x,.4,.1),0,.35),this.armR.shoulder.rotation.set(dt(this.armR.shoulder.rotation.x,.25,.1),0,-.3),this.armL.elbow.rotation.x=dt(this.armL.elbow.rotation.x,-.5,.1),this.armR.elbow.rotation.x=dt(this.armR.elbow.rotation.x,-.3,.1),this.head.rotation.x=dt(this.head.rotation.x,-.15,.1);return}if(this.body.rotation.x=dt(this.body.rotation.x,0,.14),this.body.position.y=dt(this.body.position.y,0,.14),this.isDead){this.body.rotation.x=dt(this.body.rotation.x,-Math.PI/2.1,.09),this.body.position.y=dt(this.body.position.y,.16,.09),this.armL.shoulder.rotation.z=dt(this.armL.shoulder.rotation.z,1.1,.1),this.armR.shoulder.rotation.z=dt(this.armR.shoulder.rotation.z,-1.2,.1);return}let c=.62*o,l=Math.sin(r),h=Math.sin(r+Math.PI);this.legL.hip.rotation.x=l*c,this.legR.hip.rotation.x=h*c,this.legL.knee.rotation.x=Math.max(0,-Math.cos(r))*.85*o,this.legR.knee.rotation.x=Math.max(0,-Math.cos(r+Math.PI))*.85*o,this.legL.foot.rotation.x=-l*.18*o,this.legR.foot.rotation.x=-h*.18*o,this.hips.position.y=.92*s.tall+Math.abs(Math.sin(r))*.035*o-(s.hunch||0)*.02,this.hips.rotation.z=Math.sin(r)*.035*o,this.torso.rotation.y=-Math.sin(r)*.09*o;let u=this.aiming&&!((M=qt[this.weaponId])!=null&&M.melee)&&this.weaponId!=="fists";this.aimBlend=dt(this.aimBlend||0,u?1:0,Math.min(1,e*9));let d=-l*.55*o,f=-h*.55*o,g=-.06,y=.06,m=-.25-.25*o,p=-.25-.25*o;if(this.punchT>0){let A=1-this.punchT/.42,C=Math.sin(Ot(A,0,1)*Math.PI);d=dt(d,-1.9,C),m=dt(m,-.25,C)}if(this.aimBlend>.01){let A=this.aimBlend;d=dt(d,-1.5,A),m=dt(m,-.32,A),g=dt(g,.12,A),f=dt(f,-1.28,A),p=dt(p,-.95,A),y=dt(y,-.34,A)}this.weaponId==="bag"&&(d=.1),this.armR.shoulder.rotation.x=d,this.armL.shoulder.rotation.x=f,this.armR.shoulder.rotation.z=g,this.armL.shoulder.rotation.z=y,this.armR.elbow.rotation.x=m,this.armL.elbow.rotation.x=p,o<.05?(this.torso.rotation.x=(s.hunch||0)+Math.sin(r*.7)*.012,this.armR.shoulder.rotation.x+=Math.sin(r*.7)*.02,this.head.rotation.z=Math.sin(r*.35)*.03):(this.torso.rotation.x=(s.hunch||0)+Math.sin(r*2)*.02,this.head.rotation.z=0),this.hurtT>0&&(this.torso.rotation.x+=Math.sin(this.hurtT*30)*.1,this.head.rotation.x=-.2),this.lookTarget?(this.head.rotation.y=Ot((x=this.lookTarget.localYaw)!=null?x:0,-.9,.9),this.head.rotation.x=Ot((b=this.lookTarget.localPitch)!=null?b:0,-.5,.4)):(this.head.rotation.y=dt(this.head.rotation.y,0,.08),this.head.rotation.x=dt(this.head.rotation.x,0,.08)),this.aiming=(D=n.aiming)!=null?D:this.aiming}};function rf(i=9055019,e="sedan"){let t=new qe,n=te(i,{roughness:.35,metalness:.55}),s=te(1713971,{roughness:.12,metalness:.4}),r=te(2237482,{roughness:.6,metalness:.4}),o=te(16773312,{emissive:16769162,emissiveIntensity:.7,roughness:.3}),a=re(Ue(1.85,.62,4.2,.22),n,0,.62,0);t.add(a);let c=re(Ue(1.62,.55,2.1,.2),n,0,1.13,-.1);t.add(c);let l=re(Ue(1.52,.42,2,.16),s,0,1.17,-.1);t.add(l),t.add(re(Ue(1.7,.16,1.1,.08),n,0,.9,1.5)),t.add(re(Ue(1.7,.14,.9,.08),n,0,.9,-1.55)),t.add(re(Ue(1.78,.2,.18,.06),r,0,.55,2.1)),t.add(re(Ue(1.78,.2,.18,.06),r,0,.55,-2.1)),[-.62,.62].forEach(d=>{t.add(re(Ue(.36,.16,.08,.04),o,d,.72,2.14)),t.add(re(Ue(.32,.14,.08,.04),te(9181722,{emissive:5570560,roughness:.4}),d,.72,-2.14))});let h=new et(.36,.36,.24,14),u=new et(.2,.2,.26,10);return[[-.92,1.35],[.92,1.35],[-.92,-1.35],[.92,-1.35]].forEach(([d,f])=>{let g=new tt(h,r);g.rotation.z=Math.PI/2,g.position.set(d,.36,f),g.castShadow=!0,t.add(g);let y=new tt(u,te(10133672,{metalness:.9,roughness:.3}));y.rotation.z=Math.PI/2,y.position.set(d*1.02,.36,f),t.add(y)}),[-1,1].forEach(d=>t.add(re(Ue(.18,.09,.1,.03),n,d*.92,1.16,.75))),t}function of(i=6){let e=new qe,t=te(4863268,{roughness:.95}),n=te(3037738,{roughness:.9,flat:!0}),s=re(new et(.16,.26,i*.55,8),t,0,i*.28,0);e.add(s);for(let r=0;r<3;r++){let o=1-r*.22,a=re(new Ei(1.5*o,1),n,(Math.random()-.5)*.7,i*.55+r*i*.13,(Math.random()-.5)*.7);a.scale.set(1,.85,1),e.add(a)}return e}function af(){let i=new qe,e=te(2830134,{roughness:.5,metalness:.6});i.add(re(new et(.08,.11,5.6,8),e,0,2.8,0));let t=re(new et(.055,.055,1.2,6),e,.55,5.55,0);t.rotation.z=Math.PI/2,i.add(t);let n=re(new ye(.5,.14,.3),te(1711394,{emissive:16766073,emissiveIntensity:.55,roughness:.5}),1.1,5.5,0);return i.add(n),i}function cf(){let i=new qe,e=te(7031340,{roughness:.9}),t=te(2435118,{roughness:.6,metalness:.6});for(let n=0;n<3;n++)i.add(re(new ye(1.9,.06,.16),e,0,.45,-.18+n*.19));for(let n=0;n<2;n++)i.add(re(new ye(1.9,.16,.06),e,0,.68+n*.2,-.32));return[-.8,.8].forEach(n=>{i.add(re(new ye(.08,.45,.5),t,n,.22,0)),i.add(re(new ye(.07,.5,.07),t,n,.72,-.32))}),i}function lf(){let i=new qe,e=te(2375726,{roughness:.8,metalness:.3});i.add(re(Ue(1.2,1,.9,.06),e,0,.55,0));let t=re(Ue(1.24,.1,.95,.04),te(1715232),0,1.06,0);return t.rotation.x=-.08,i.add(t),[[-.45,.35],[.45,.35],[-.45,-.35],[.45,-.35]].forEach(([n,s])=>i.add(re(new et(.07,.07,.1,6),te(1316378),n,.07,s))),i}function hf(i=.6){let e=new qe,t=te(9069623,{roughness:.9,map:vn("wood",128,128,(s,r,o)=>{s.fillStyle="#8a6437",s.fillRect(0,0,r,o);for(let a=0;a<40;a++)s.strokeStyle=`rgba(60,40,20,${Math.random()*.35})`,s.beginPath(),s.moveTo(0,Math.random()*o),s.bezierCurveTo(r*.3,Math.random()*o,r*.6,Math.random()*o,r,Math.random()*o),s.stroke()})});e.add(re(Ue(i,i,i,.03),t,0,i/2,0));let n=te(5914402,{roughness:.9});return e.add(re(new ye(i*1.01,.05,.05),n,0,i*.5,0)),e.add(re(new ye(.05,i*1.01,.05),n,-i*.5,i*.5,0)),e.add(re(new ye(.05,i*1.01,.05),n,i*.5,i*.5,0)),e}function uf(i=1e3){let e=new qe,t=vn("moneyT",128,64,(o,a,c)=>{o.fillStyle="#5f7c4e",o.fillRect(0,0,a,c),o.fillStyle="#7d9c66";for(let l=0;l<14;l++)o.fillRect(Math.random()*a,Math.random()*c,4+Math.random()*22,2+Math.random()*5);o.fillStyle="rgba(230,225,200,.85)",o.beginPath(),o.arc(a/2,c/2,11,0,7),o.fill(),o.fillStyle="#3d5233",o.font="bold 16px serif",o.textAlign="center",o.fillText("$",a/2,c/2+6)}),n=te(16777215,{map:t,roughness:.85}),s=re(new ye(.24,.09,.13),n,0,.05,0);e.add(s);let r=re(new ye(.05,.095,.135),te(14274478,{roughness:.7}),0,.05,0);return e.add(r),e.userData.value=i,e}var Nx=()=>vn("asphalt",256,256,(i,e,t)=>{i.fillStyle="#31333a",i.fillRect(0,0,e,t),oi(i,e,t,46,5e3),Ko(i,e,t,"rgba(18,18,22,1)",18,60,.5)},14,14),kx=()=>vn("sidewalk",256,256,(i,e,t)=>{i.fillStyle="#8b8b87",i.fillRect(0,0,e,t),oi(i,e,t,40,2600),i.strokeStyle="rgba(60,60,60,.55)",i.lineWidth=2;for(let n=0;n<=4;n++)i.beginPath(),i.moveTo(n*e/4,0),i.lineTo(n*e/4,t),i.stroke(),i.beginPath(),i.moveTo(0,n*t/4),i.lineTo(e,n*t/4),i.stroke();Ko(i,e,t,"rgba(50,50,50,1)",22,30,.25)},10,10),Ox=()=>vn("brick",256,256,(i,e,t)=>{i.fillStyle="#6b3f34",i.fillRect(0,0,e,t);let n=16,s=40;for(let r=0;r<t;r+=n)for(let o=-s;o<e+s;o+=s){let a=r/n%2?s/2:0,c=90+Math.random()*46;i.fillStyle=`rgb(${c+22},${c-18},${c-32})`,i.fillRect(o+a+1.5,r+1.5,s-3,n-3)}oi(i,e,t,40,2200)},4,4),Fx=(i="plaster",e="#9a927f")=>vn(i,256,256,(t,n,s)=>{t.fillStyle=e,t.fillRect(0,0,n,s),oi(t,n,s,26,2400),Ko(t,n,s,"rgba(60,55,45,1)",16,70,.2),t.strokeStyle="rgba(70,66,56,.25)",t.lineWidth=1;for(let r=0;r<8;r++)t.beginPath(),t.moveTo(Math.random()*n,0),t.lineTo(Math.random()*n,s),t.stroke()},3,3),nh=(i,e,t=.5)=>vn(i,512,512,(n,s,r)=>{n.fillStyle=e,n.fillRect(0,0,s,r),oi(n,s,r,30,3e3);let o=5,a=5,c=62,l=78,h=(s-o*c)/(o+1),u=(r-a*l)/(a+1);for(let d=0;d<a;d++)for(let f=0;f<o;f++){let g=h+f*(c+h),y=u+d*(l+u),m=Math.random()<t;n.fillStyle=m?`rgba(255,214,140,${.75+Math.random()*.25})`:`rgba(24,30,38,${.85})`,n.fillRect(g,y,c,l),n.strokeStyle="rgba(30,30,30,.8)",n.lineWidth=4,n.strokeRect(g,y,c,l),n.beginPath(),n.moveTo(g+c/2,y),n.lineTo(g+c/2,y+l),n.stroke(),m||(n.fillStyle="rgba(120,150,180,.10)",n.beginPath(),n.moveTo(g,y+l),n.lineTo(g+c*.7,y),n.lineTo(g+c,y),n.lineTo(g+c*.3,y+l),n.fill())}},1,1),Bx=()=>vn("woodFloor",256,256,(i,e,t)=>{i.fillStyle="#6d4a2e",i.fillRect(0,0,e,t);for(let n=0;n<t;n+=32){i.fillStyle=`rgba(${60+Math.random()*40},${40+Math.random()*26},${20+Math.random()*18},1)`,i.fillRect(0,n,e,30),i.strokeStyle="rgba(30,20,10,.5)",i.lineWidth=2;for(let s=0;s<5;s++)i.beginPath(),i.moveTo(0,n+4+s*6),i.bezierCurveTo(e*.3,n+s*6,e*.6,n+12,e,n+3+s*6),i.stroke()}oi(i,e,t,34,1800)},6,6),df=()=>vn("tile",256,256,(i,e,t)=>{i.fillStyle="#3c4046",i.fillRect(0,0,e,t);for(let n=0;n<t;n+=64)for(let s=0;s<e;s+=64)i.fillStyle=(s+n)%128?"#4a4f57":"#42474e",i.fillRect(s+2,n+2,60,60);oi(i,e,t,30,1500)},6,6);function St(i,e,t,n,s,r,o,a,c,l="wall",h=!0){let u=new tt(new ye(r,o,a),c);return u.position.set(t,n+o/2,s),u.castShadow=!0,u.receiveShadow=!0,i.add(u),h&&e.add(t-r/2,t+r/2,s-a/2,s+a/2,l,u),u}function Xn(i,e,t,n,s,r,o=.02){let a=new tt(new ln(n,s),r);return a.rotation.x=-Math.PI/2,a.position.set(e,o,t),a.receiveShadow=!0,i.add(a),a}var ff=(i,e,t="#101418",n="#ffd45e",s="#c9c2a8")=>{let r=jo(512,160,(a,c,l)=>{a.fillStyle=t,a.fillRect(0,0,c,l);let h=a.createLinearGradient(0,0,0,l);h.addColorStop(0,"rgba(255,255,255,.10)"),h.addColorStop(1,"rgba(0,0,0,.35)"),a.fillStyle=h,a.fillRect(0,0,c,l),a.strokeStyle=n,a.lineWidth=5,a.strokeRect(9,9,c-18,l-18),a.textAlign="center",a.textBaseline="middle",a.fillStyle=n,a.font='900 62px Impact,"Arial Black",sans-serif',a.fillText(i,c/2,e?l*.4:l*.52),e&&(a.fillStyle=s,a.font="600 30px system-ui,sans-serif",a.fillText(e,c/2,l*.75))}),o=new Mi(r);return o.colorSpace=Xt,o};function pf(i,e){let t=new qe;i.add(t);let n={},s=new tt(new ln(400,400),te(2898470,{roughness:1}));s.rotation.x=-Math.PI/2,s.receiveShadow=!0,s.position.y=-.02,t.add(s);let r=Xn(t,0,0,200,12,te(16777215,{map:Nx(),roughness:.95}),.01),o=te(16777215,{map:kx(),roughness:.95});Xn(t,0,-8.2,200,6.4,o,.12),Xn(t,0,8.2,200,6.4,o,.12);let a=te(10132116,{roughness:.9});[-5,5].forEach(I=>{let B=St(t,e,0,0,I,200,.22,.35,a,"noLOS",!1);B.castShadow=!1});let c=te(14275240,{roughness:.8});for(let I=-92;I<96;I+=8)Xn(t,I,0,3.4,.22,c,.03).castShadow=!1;for(let I=0;I<7;I++)Xn(t,2.6,-4.4+I*1.45,5.5,.6,c,.035);let l={x1:-16,x2:-2,z1:10,z2:22,h:3.3},h=new qe;t.add(h);let u=te(16777215,{map:Fx("plasterHouse","#8d7c62"),roughness:.92}),d=te(16777215,{map:Bx(),roughness:.85});Xn(h,(l.x1+l.x2)/2,(l.z1+l.z2)/2,l.x2-l.x1,l.z2-l.z1,d,.06);let f=.3;St(h,e,(l.x1+-9.4)/2,0,l.z1+f/2,-9.4-l.x1,l.h,f,u),St(h,e,(-7.6+l.x2)/2,0,l.z1+f/2,l.x2+7.6,l.h,f,u),St(h,e,-8.5,2.4,l.z1+f/2,1.8,l.h-2.4,f,u),St(h,e,(l.x1+l.x2)/2,0,l.z2-f/2,l.x2-l.x1,l.h,f,u),St(h,e,l.x1+f/2,0,(l.z1+l.z2)/2,f,l.h,l.z2-l.z1,u),St(h,e,l.x2-f/2,0,(l.z1+l.z2)/2,f,l.h,l.z2-l.z1,u);let g=new tt(new ye(l.x2-l.x1,.2,l.z2-l.z1),te(7037781,{roughness:.95}));g.position.set((l.x1+l.x2)/2,l.h+.1,(l.z1+l.z2)/2),g.castShadow=!0,g.receiveShadow=!0,h.add(g);let y=re(Ue(l.x2-l.x1+.8,.35,l.z2-l.z1+.8,.1),te(4011048,{roughness:.95}),(l.x1+l.x2)/2,l.h+.35,(l.z1+l.z2)/2);h.add(y);let m=new qe;m.position.set(-7.6,0,l.z1+f/2),h.add(m);let p=re(Ue(1.8,2.35,.12,.03),te(5913122,{roughness:.8}),-.9,1.18,0);m.add(p),p.add(re(new kt(.06,8,6),te(14202442,{metalness:.9,roughness:.25}),.62,0,.1));let M=e.add(-8.6,-7.5,l.z1+.02,l.z1+.3,"door");n.houseDoor={pivot:m,open:!1,angle:0,collider:M,pos:new R(-8.5,0,l.z1+.4)};let x=te(2766160,{roughness:.92}),b=te(13222573,{roughness:.95}),D=te(4862496,{roughness:.9});n.bedSpots=[],[-14,-11.5].forEach((I,B)=>{let K=new qe;K.position.set(I,0,12.05),h.add(K),K.add(re(Ue(1.5,.35,2.3,.06),D,0,.22,0)),K.add(re(Ue(1.35,.24,2.1,.09),x,0,.48,0)),K.add(re(Ue(1.3,.1,1.5,.06),b,0,.58,.28)),K.add(re(Ue(.8,.16,.42,.1),te(15262414),0,.62,-.78)),K.add(re(Ue(1.5,.75,.12,.05),D,0,.55,-1.16)),e.add(I-.75,I+.75,10.9,13.2,"furniture"),n.bedSpots.push({pos:new R(I,.56,13),yaw:Math.PI,idx:B,wakePos:new R(I+(B===0?-.5:.5),0,14.1)})});let A=te(4016722,{roughness:.55,metalness:.5});n.lockers=[],[15.6,17.9].forEach((I,B)=>{let K=new qe;K.position.set(-15.1,0,I),h.add(K),K.add(re(Ue(.75,2,.85,.04),A,0,1,0));let $=re(Ue(.05,1.85,.78,.02),te(4938339,{roughness:.5,metalness:.6}),.39,1,0);K.add($),K.add(re(new ye(.06,.22,.05),te(14202442,{metalness:.9,roughness:.2}),.43,1.05,.3));for(let he=0;he<3;he++)K.add(re(new ye(.02,.02,.55),te(2765882),.42,1.7,0));e.add(-15.6,-14.7,I-.5,I+.5,"furniture"),n.lockers.push({id:B===0?"lockerA":"lockerB",pos:new R(-14.4,0,I),lockers3d:K,label:B===0?"\u0428\u043A\u0430\u0444 1":"\u0428\u043A\u0430\u0444 2"})});let C=new qe;C.position.set(-6.4,0,18.4),h.add(C),C.add(re(Ue(1.9,.1,1.1,.04),D,0,.78,0)),[[-.8,-.4],[.8,-.4],[-.8,.4],[.8,.4]].forEach(([I,B])=>C.add(re(new et(.05,.05,.78,6),D,I,.39,B))),e.add(-7.4,-5.4,17.8,19,"furniture");let P=Xn(h,-9.5,17.5,5,3.4,te(7024431,{roughness:1}),.08);P.castShadow=!1;let z=re(Ue(1.5,.9,.09,.03),te(1119258,{roughness:.4}),-6.4,1.6,21.6);h.add(z),z.add(re(new ln(1.4,.8),te(2241348,{emissive:2771558,emissiveIntensity:.6}),0,0,.06)),h.add(re(Ue(4.2,.95,.75,.05),te(7301724,{roughness:.8}),-13,.5,21.4)),h.add(re(Ue(4.3,.09,.85,.03),te(2896440,{roughness:.5}),-13,1,21.4)),e.add(-15.1,-10.9,21,21.8,"furniture");let _=new Tn(16767392,22,14,2);_.position.set(-9,2.7,16),h.add(_);let S=new Tn(16763274,10,9,2);S.position.set(-13.5,2.4,12.5),h.add(S),h.add(re(new et(.01,.01,.5,4),te(2236962),-9,3.05,16)),h.add(re(new kt(.12,10,8),te(16773824,{emissive:16768922,emissiveIntensity:1.4}),-9,2.78,16));let L={x1:-2,x2:26,z1:-34,z2:-9,h:7.2},N=new qe;t.add(N);let H=te(16777215,{map:nh("bankFacade","#7d7466",.45),roughness:.85}),ne=te(14209728,{roughness:.9}),V=te(16777215,{map:df(),roughness:.55});Xn(N,(L.x1+L.x2)/2,(L.z1+L.z2)/2,L.x2-L.x1,L.z2-L.z1,V,.05);let se=.4;St(N,e,(L.x1+9)/2,0,L.z2-se/2,9-L.x1,L.h,se,H),St(N,e,(14+L.x2)/2,0,L.z2-se/2,L.x2-14,L.h,se,H),St(N,e,11.5,4.2,L.z2-se/2,5,L.h-4.2,se,H),St(N,e,(L.x1+L.x2)/2,0,L.z1+se/2,L.x2-L.x1,L.h,se,H),St(N,e,L.x1+se/2,0,(L.z1+L.z2)/2,se,L.h,L.z2-L.z1,H),St(N,e,L.x2-se/2,0,(L.z1+L.z2)/2,se,L.h,L.z2-L.z1,H);let q=re(Ue(L.x2-L.x1+1,.5,L.z2-L.z1+1,.1),te(3816e3,{roughness:.9}),(L.x1+L.x2)/2,L.h+.25,(L.z1+L.z2)/2);N.add(q);let ve=new tt(new ye(L.x2-L.x1,.2,L.z2-L.z1),te(9274999,{roughness:.9}));ve.position.set((L.x1+L.x2)/2,L.h,(L.z1+L.z2)/2),N.add(ve);for(let I=0;I<4;I++){let B=2+I*6.6;N.add(re(new et(.35,.4,L.h-.4,12),te(13617076,{roughness:.8}),B,(L.h-.4)/2+.2,L.z2+.7)),e.add(B-.42,B+.42,L.z2+.3,L.z2+1.1,"wall")}for(let I=0;I<3;I++)N.add(re(new ye(10,.18,.55),te(11577491,{roughness:.9}),11.5,.09+I*.02,L.z2+1.4+I*.5));let be=new ln(11,3.4),Me=new tt(be,new Wn({map:ff("\u0411\u0410\u041D\u041A \xABDENI\xBB","\u041C\u0415\u0416\u0414\u0423\u041D\u0410\u0420\u041E\u0414\u041D\u042B\u0419 \u0411\u0410\u041D\u041A \xB7 24 \u0427\u0410\u0421\u0410"),transparent:!1}));Me.position.set(11.5,L.h-2.1,L.z2+.26),N.add(Me),n.bankDoors=[],[9.6,11.9].forEach(I=>{let B=new qe;B.position.set(I,0,L.z2-.3),N.add(B);let K=re(Ue(2,3,.08,.03),te(10473696,{transparent:!0,opacity:.28,roughness:.1,metalness:.2}),1,1.5,0);B.add(K),B.add(re(new ye(2,.08,.12),te(12170146,{metalness:.7,roughness:.3}),1,.05,0));let $=e.add(I,I+2,L.z2-.4,L.z2-.2,"door");n.bankDoors.push({pivot:B,collider:$,baseX:I,open:!1})});let Ke=te(5915184,{roughness:.75}),nt=te(10473696,{transparent:!0,opacity:.22,roughness:.08,metalness:.3});for(let I=0;I<3;I++){let B=4.6+I*6;St(N,e,B,0,-22.6,4.4,1.15,1.1,Ke,"furniture"),N.add(re(new ye(4.4,1.1,.05),nt,B,1.75,-23.1)),N.add(re(new ye(4.6,.1,.12),te(13214247,{metalness:.85,roughness:.3}),B,2.32,-23.1)),N.add(re(new ye(.55,.38,.05),te(1119516,{roughness:.4}),B-.9,1.45,-22.5)),N.add(re(new ye(.5,.3,.03),te(2771558,{emissive:3894671,emissiveIntensity:.8}),B-.9,1.45,-22.46)),N.add(re(new ye(.6,.08,.3),te(2237996),B+1.2,1.22,-22.4))}n.bankMoney=[],[4.6,8.6,10.6,12.6,16.6].forEach((I,B)=>{let K=uf(1e3);K.scale.setScalar(1.6),K.position.set(I+(B%2?.2:-.2),1.17,-22.2),N.add(K),n.bankMoney.push({mesh:K,pos:new R(I,1.2,-22.2),taken:!1,id:B})});let J=new qe;J.position.set(24,0,-20),N.add(J),J.add(re(new et(1.9,1.9,.5,24),te(7170659,{metalness:.85,roughness:.35}),0,1.9,0)),J.add(re(new sn(.55,.09,6,16),te(13214247,{metalness:.9,roughness:.25}),0,1.9,.28));for(let I=0;I<5;I++){let B=I/5*Math.PI*2,K=re(new et(.07,.07,.22,6),te(12170146,{metalness:.9,roughness:.2}),Math.cos(B)*1.45,1.9+Math.sin(B)*1.45,.26);K.rotation.x=Math.PI/2,J.add(K)}e.add(22.2,25.9,-21.9,-18.1,"furniture"),N.add(re(Ue(1,4,5,.05),te(4869974,{roughness:.6,metalness:.4}),25.6,2,-20));for(let I=0;I<18;I++){let K=1.4+Math.floor(I/6)*.62,$=-14+I%6*.9;N.add(re(new ye(.12,.5,.8),te(5922920,{metalness:.7,roughness:.4}),25.2,K,$))}let ae=te(3037738,{roughness:.95,flat:!0});[[1.5,-12.5],[23.5,-11],[1.5,-28]].forEach(([I,B])=>{let K=re(new et(.42,.32,.7,10),te(8018500,{roughness:.9}),I,.35,B);N.add(K),N.add(re(new Ei(.85,1),ae,I,1.35,B)),N.add(re(new Ei(.55,1),ae,I+.3,1.9,B+.2))});for(let I=0;I<4;I++){let B=6+I*2.2;N.add(re(Ue(1.7,.16,.6,.05),te(3488322,{roughness:.7}),B,.5,-15.5)),N.add(re(Ue(1.7,.7,.14,.05),te(3488322,{roughness:.7}),B,.85,-15.8)),[[-.7],[.7]].forEach(([K])=>N.add(re(new ye(.1,.5,.5),te(2237996),B+K,.25,-15.5)))}[[8,4.4,-14],[16,4.4,-24]].forEach(([I,B,K])=>{let $=new Tn(16773328,16,16,2);$.position.set(I,B,K),N.add($),N.add(re(new et(.5,.6,.12,12),te(16774360,{emissive:16773312,emissiveIntensity:1.2}),I,B+.25,K))});let we=new tt(new kt(.28,14,10),te(5574929,{emissive:3342336,emissiveIntensity:.6}));we.position.set(11.5,4,-9.4),N.add(we),n.alarmLamp=we;let X={x1:-32,x2:-18,z1:-26,z2:-9,h:4.4},xe=new qe;t.add(xe);let Oe=te(16777215,{map:nh("shopFacade","#5c5148",.6),roughness:.9});Xn(xe,(X.x1+X.x2)/2,(X.z1+X.z2)/2,X.x2-X.x1,X.z2-X.z1,te(16777215,{map:df(),roughness:.7}),.05);let Ne=.35;St(xe,e,(X.x1-25.6)/2,0,X.z2-Ne/2,-25.6-X.x1,X.h,Ne,Oe),St(xe,e,(-22.4+X.x2)/2,0,X.z2-Ne/2,X.x2+22.4,X.h,Ne,Oe),St(xe,e,-24,2.9,X.z2-Ne/2,3.2,X.h-2.9,Ne,Oe),St(xe,e,(X.x1+X.x2)/2,0,X.z1+Ne/2,X.x2-X.x1,X.h,Ne,Oe),St(xe,e,X.x1+Ne/2,0,(X.z1+X.z2)/2,Ne,X.h,X.z2-X.z1,Oe),St(xe,e,X.x2-Ne/2,0,(X.z1+X.z2)/2,Ne,X.h,X.z2-X.z1,Oe),xe.add(re(Ue(X.x2-X.x1+.6,.4,X.z2-X.z1+.6,.1),te(3093048,{roughness:.9}),(X.x1+X.x2)/2,X.h+.2,(X.z1+X.z2)/2)),xe.add(re(new ye(X.x2-X.x1,.16,X.z2-X.z1),te(5525578),(X.x1+X.x2)/2,X.h,(X.z1+X.z2)/2));let $e=new tt(new ln(9.5,2.6),new Wn({map:ff("\u041E\u0420\u0423\u0416\u0418\u0415","\u0412\u0421\u0401 \u0414\u041B\u042F \u0421\u0415\u0420\u042C\u0401\u0417\u041D\u042B\u0425 \u041B\u042E\u0414\u0415\u0419","#1a0e0c","#ff8f3f","#e8c9a0")}));$e.position.set(-24,X.h-1,X.z2+.22),xe.add($e);let ee=te(16738858,{emissive:16734746,emissiveIntensity:2.2,roughness:.4}),w=new tt(new ye(9.6,.12,.06),ee);w.position.set(-24,X.h-2.4,X.z2+.24),xe.add(w);let pe=new Tn(16747082,10,10,2);pe.position.set(-24,3,-9.6),xe.add(pe);let fe=te(4863268,{roughness:.9});for(let I=0;I<2;I++)xe.add(re(new ye(6.5,.14,.5),fe,-27.5+I*.05,1.5+I*1,-25.2));["rifle","shotgun","rifle","shotgun"].forEach((I,B)=>{let K=Ri(I);K.position.set(-29+B*1.9,1.75,-25.1),K.rotation.set(0,Math.PI/2,.1),K.scale.set(1.6,1.6,1.6),xe.add(K)}),["pistol","pistol","pistol"].forEach((I,B)=>{let K=Ri(I);K.position.set(-30+B*1.3,2.6,-25.1),K.rotation.set(0,Math.PI/2,0),K.scale.set(1.7,1.7,1.7),xe.add(K)}),St(xe,e,-24.5,0,-21,8.4,1.1,1,te(3812382,{roughness:.8}),"furniture"),xe.add(re(new ye(8.6,.09,1.15),te(9071162,{roughness:.6,metalness:.2}),-24.5,1.14,-21));let De=te(4151852,{roughness:.85});for(let I=0;I<8;I++)xe.add(re(new ye(.3,.16,.22),De,-27.8+I*.62,1.28,-20.8));for(let I=0;I<3;I++)xe.add(re(new ye(2.6,.12,.5),fe,-29,2.9+I*.02,-18+I*1.6));for(let I=0;I<9;I++)xe.add(re(new ye(.3,.2,.26),De,-30+I%3*.9,1+Math.floor(I/3)*.5,-19.6));xe.add(re(Ue(1.1,1.3,.9,.04),te(3095108,{metalness:.6,roughness:.4}),-30.5,.65,-23.5)),xe.add(re(new sn(.16,.04,6,12),te(12174025,{metalness:.9,roughness:.2}),-30.5,.95,-23));let Se=new Tn(16773328,16,16,2);Se.position.set(-24,3.6,-17),xe.add(Se),xe.add(re(new et(.45,.55,.1,10),te(16774360,{emissive:16773312,emissiveIntensity:1.1}),-24,4.1,-18)),n.shopPoint=new R(-24.5,0,-19.2),n.sellerPos=new R(-24.5,0,-22.2),n.sellerYaw=0;let T=(I,B,K,$,he,Be,He,ge)=>{let Je=new qe;t.add(Je);let Ve=te(16777215,{map:nh(Be,He,ge),roughness:.88}),it=new tt(new ye(B-I,he,$-K),Ve);return it.position.set((I+B)/2,he/2,(K+$)/2),it.castShadow=!0,it.receiveShadow=!0,Je.add(it),e.add(I,B,K,$,"building"),Je.add(re(new ye(B-I+.5,.35,$-K+.5),te(3093048,{roughness:.9}),(I+B)/2,he+.15,(K+$)/2)),Je};T(30,58,-32,-9,11,"facadeA","#7a7060",.5),T(-64,-36,-30,-9,9.5,"facadeB","#6a6a72",.45),T(4,30,10,26,12,"facadeC","#786a58",.4),T(-36,-22,11,26,7.5,"facadeD","#6d6455",.5),T(-64,-40,12,28,8,"facadeE","#5f5a52",.45),T(46,62,-32,-10,8,"facadeF","#6b6055",.4);for(let I=0;I<4;I++){let B=34+I*6.2;t.add(re(Ue(5.4,.16,2,.05),te(I%2?9185826:2906730,{roughness:.9}),B,3,-8.2)),t.add(re(new ye(5.4,.1,.1),te(2763306,{metalness:.7}),B,3.05,-9.2)),t.add(re(new ln(5,2.4),te(2109504,{emissive:2837091,emissiveIntensity:.5,roughness:.3}),B,1.7,-8.98))}let v=new qe;v.position.set(40,0,15),t.add(v),v.add(re(new ye(16,6,.4),te(16777215,{map:Ox(),roughness:.95}),0,3,-3.6)),e.add(32,48,10.6,11.4,"building");let F=new qe;F.position.set(2.5,0,1.5),F.rotation.y=-.45,v.add(F);let j=te(3099235,{roughness:.4,metalness:.5});F.add(re(Ue(2.3,2,2.4,.2),j,0,1.55,2.9)),F.add(re(Ue(2.2,.9,1.6,.16),te(1779507,{roughness:.15,metalness:.4}),0,2.3,3.1)),F.add(re(Ue(2.4,2.4,5.4,.12),te(9080726,{roughness:.7,metalness:.3}),0,1.9,-1.2)),F.add(re(Ue(2.3,2.2,.08,.05),te(7172472,{roughness:.8}),0,1.85,-3.9)),[[-1.15,2.9],[1.15,2.9],[-1.15,-2.2],[1.15,-2.2],[-1.15,-.6],[1.15,-.6]].forEach(([I,B])=>{let K=new tt(new et(.5,.5,.3,12),te(1513500,{roughness:.8}));K.rotation.z=Math.PI/2,K.position.set(I,.5,B),K.castShadow=!0,F.add(K)}),e.add(38.2,43.6,12.6,20.4,"building"),n.boxSpawns=[],[[-3.4,2.2],[-4.4,4.6],[-2.2,5.6],[-5.2,1]].forEach(([I,B],K)=>{let $=hf(.62);$.position.set(40+I,0,15+B),$.rotation.y=Math.random()*3,t.add($),n.boxSpawns.push({mesh:$,pos:$.position.clone(),id:K}),e.add($.position.x-.35,$.position.x+.35,$.position.z-.35,$.position.z+.35,"furniture")}),n.truckPoint=new R(42.5,0,16),n.dockBossPoint=new R(36.5,0,13);let Q=[];for(let I=-56;I<=56;I+=16)Q.push([I,-8.8,0],[I+8,8.8,Math.PI]);Q.forEach(([I,B,K])=>{let $=af();$.position.set(I,0,B),$.rotation.y=K,t.add($),e.add(I-.2,I+.2,B-.2,B+.2,"noLOS")}),[[-48,10],[-52,16],[-44,21],[-58,24],[20,8.9],[-40,-8.6],[52,-8.6],[56,10]].forEach(([I,B])=>{let K=of(6+Math.random()*3);K.position.set(I,0,B),K.rotation.y=Math.random()*6,t.add(K),e.add(I-.35,I+.35,B-.35,B+.35,"noLOS")}),[[-46,12,.4],[-50,18,1.5],[8,8.8,0],[-20,8.8,0]].forEach(([I,B,K])=>{let $=cf();$.position.set(I,0,B),$.rotation.y=K,t.add($),e.add(I-1,I+1,B-.4,B+.4,"noLOS")}),[[-42,9.4],[30,8.8],[-14,-8.7],[46,8.8]].forEach(([I,B])=>{let K=lf();K.position.set(I,0,B),K.rotation.y=Math.random(),t.add(K),e.add(I-.7,I+.7,B-.5,B+.5,"furniture")}),[[-3,8.6],[22,-8.6],[-30,-8.6]].forEach(([I,B])=>{t.add(re(new et(.14,.16,.8,8),te(11811370,{roughness:.6}),I,.4,B)),t.add(re(new kt(.16,8,6),te(11811370,{roughness:.6}),I,.82,B))}),[[3.5,-8.6],[1.2,8.6]].forEach(([I,B])=>{let K=re(new et(.1,.12,5,8),te(2764083,{metalness:.6,roughness:.5}),I,2.5,B);t.add(K);let $=re(Ue(.45,1.15,.3,.06),te(1711394),I,4.7,B);t.add($),[.36,0,-.36].forEach((he,Be)=>{t.add(re(new kt(.11,8,6),te(16724770,{emissive:Be===0?16720384:2228224,emissiveIntensity:Be===0?1.6:.2}),I,5.1+he,B+.16))}),e.add(I-.16,I+.16,B-.16,B+.16,"noLOS")});let Z=[9186091,2837099,3817290,7039802,9075243,2372623];return[[-30,-6.6,0],[-16,-6.6,0],[3.5,-6.6,0],[24,-6.6,0],[-46,-6.6,0],[30,6.6,Math.PI],[-8,6.6,Math.PI],[-24,6.6,Math.PI],[52,6.6,Math.PI],[-52,6.6,Math.PI]].forEach(([I,B,K],$)=>{let he=rf(Z[$%Z.length]);he.position.set(I,0,B),he.rotation.y=K,t.add(he),e.add(I-1,I+1,B-2.2,B+2.2,"furniture")}),t.add(re(Ue(4.5,.15,2.2,.05),te(2899536,{roughness:.6}),16,2.8,8.4)),[[14.2,9.2],[17.8,9.2],[14.2,7.6],[17.8,7.6]].forEach(([I,B])=>t.add(re(new et(.06,.06,2.8,6),te(2764083,{metalness:.6}),I,1.4,B))),t.add(re(new ln(4.3,2),te(2771563,{transparent:!0,opacity:.25,roughness:.1}),16,1.6,9.15)),n.npcPaths=[[[-52,-7.2],[-20,-7.2],[2,-7.2],[30,-7.2],[54,-7.2]],[[54,7.2],[24,7.2],[-4,7.2],[-34,7.2],[-56,7.2]],[[-30,-7.6],[-24,-8],[-18,-7.6]],[[6,7.6],[26,7.6]]],n.policeSpawns=[new R(-62,0,-2.5),new R(62,0,2.5),new R(-62,0,2.5)],n.cashierPos=new R(8.6,0,-24.2),n.guardPaths=[[new R(3.5,0,-13),new R(20,0,-13),new R(20,0,-20),new R(4,0,-20)],[new R(22,0,-26),new R(22,0,-14),new R(9,0,-17),new R(9,0,-27)]],n.bankInterior={x1:L.x1,x2:L.x2,z1:L.z1,z2:L.z2},n.update=(I,B,K,$)=>{let he=n.houseDoor,Be=he.open?-Math.PI/2.1:0;he.angle+=(Be-he.angle)*Math.min(1,I*9),he.pivot.rotation.y=he.angle,he.collider.enabled=!he.open;let He=B&&Math.hypot(B.x-11.5,B.z- -9)<4.5;if(n.bankDoors.forEach(ge=>{var Ve,it;let Je=He?1.85:0;ge.anim=((Ve=ge.anim)!=null?Ve:0)+(Je-((it=ge.anim)!=null?it:0))*Math.min(1,I*6),ge.pivot.rotation.y=-ge.anim,ge.collider.enabled=!He}),n.alarmOn){let ge=(Math.sin(performance.now()*.008)+1)/2;n.alarmLamp.material.emissive.setRGB(ge,.05,.05),n.alarmLamp.material.emissiveIntensity=.5+ge*3}else n.alarmLamp.material.emissive.setRGB(.2,0,0),n.alarmLamp.material.emissiveIntensity=.4},n.resetBankMoney=()=>{n.bankMoney.forEach(I=>{I.taken=!1,I.mesh.visible=!0})},n}var zx={ped:"normal",old:"elderly",thug:"thug",guard:"guard",cashier:"cashier",cop:"cop",seller:"seller",boss:"normal"},ea={ped:["\u0427\u0451 \u0441\u043C\u043E\u0442\u0440\u0438\u0448\u044C?","\u0414\u043E\u0431\u0440\u044B\u0439 \u0432\u0435\u0447\u0435\u0440.","\u041D\u0435 \u0437\u0430\u0434\u0435\u0440\u0436\u0438\u0432\u0430\u0439\u0441\u044F \u0442\u0443\u0442.","\u0421\u043B\u044B\u0445\u0430\u043B, \u0431\u0430\u043D\u043A \u043E\u043F\u044F\u0442\u044C \u0433\u0440\u0430\u0431\u0430\u043D\u0443\u043B\u0438?","\u0413\u043E\u0440\u043E\u0434 \u043A\u0430\u0442\u0438\u0442\u0441\u044F \u0432\u043D\u0438\u0437\u2026","\u0421\u0438\u0433\u0430\u0440\u0435\u0442\u043A\u0438 \u043D\u0435 \u0431\u0443\u0434\u0435\u0442?"],old:["\u041C\u043E\u043B\u043E\u0434\u0451\u0436\u044C \u0441\u043E\u0432\u0441\u0435\u043C \u0440\u0430\u0441\u043F\u0443\u0441\u0442\u0438\u043B\u0430\u0441\u044C.","\u041E\u0445, \u0441\u043F\u0438\u043D\u0430 \u043C\u043E\u044F\u2026","\u0420\u0430\u043D\u044C\u0448\u0435 \u0442\u0443\u0442 \u0431\u044B\u043B\u043E \u0442\u0438\u0445\u043E.","\u041D\u0435 \u0431\u0435\u0433\u0430\u0439, \u0443\u043F\u0430\u0434\u0451\u0448\u044C."],thug:["\u042D\u0439, \u0431\u0440\u0430\u0442, \u0435\u0441\u0442\u044C \u0447\u0451?","\u041D\u0435 \u043D\u0430 \u0440\u0430\u0439\u043E\u043D\u0435 \u0433\u0443\u043B\u044F\u0435\u0448\u044C.","\u0421\u0442\u0432\u043E\u043B \u0443\u0431\u0435\u0440\u0438, \u0443\u043C\u043D\u0438\u043A.","\u0421\u043C\u043E\u0442\u0440\u0438 \u043C\u043D\u0435 \u0432 \u0433\u043B\u0430\u0437\u0430."],guard:["\u041E\u0440\u0443\u0436\u0438\u0435 \u0443\u0431\u0435\u0440\u0438\u0442\u0435.","\u0421\u043F\u043E\u043A\u043E\u0439\u043D\u043E, \u0433\u0440\u0430\u0436\u0434\u0430\u043D\u0438\u043D.","\u042F \u0441\u043B\u0435\u0436\u0443 \u0437\u0430 \u0442\u043E\u0431\u043E\u0439."],cop:["\u0421\u0442\u043E\u044F\u0442\u044C! \u041F\u043E\u043B\u0438\u0446\u0438\u044F!","\u0420\u0443\u043A\u0438 \u0437\u0430 \u0433\u043E\u043B\u043E\u0432\u0443!","\u041D\u0435 \u0434\u0432\u0438\u0433\u0430\u0439\u0441\u044F!"],seller:["\u0411\u0435\u0440\u0438, \u043F\u043E\u043A\u0430 \u0435\u0441\u0442\u044C.","\u041F\u0430\u0442\u0440\u043E\u043D\u044B \u0434\u0435\u0448\u0435\u0432\u043B\u0435 \u043D\u0435 \u0431\u0443\u0434\u0443\u0442.","\u0421\u0442\u0432\u043E\u043B \u043D\u0435 \u0434\u043B\u044F \u043A\u0440\u0430\u0441\u043E\u0442\u044B, \u0434\u0430?"]},wn=class{constructor(e,t={}){var n,s,r;this.game=e,this.role=t.role||"ped",this.kind=t.kind||zx[this.role]||"normal",this.char=new Ci(this.kind),this.pos=(t.pos||new R).clone(),this.yaw=(n=t.yaw)!=null?n:0,this.char.root.position.copy(this.pos),this.char.root.rotation.y=this.yaw,this.hp=(s=t.hp)!=null?s:this.role==="guard"?140:this.role==="cop"?160:100,this.maxHp=this.hp,this.speed=(r=t.speed)!=null?r:this.role==="cop"?3.9:this.role==="guard"?2.6:1.35,this.path=t.path||null,this.pathIdx=0,this.waitT=Math.random()*2,this.state="patrol",this.attackCd=0,this.dead=!1,this.hostile=!1,this.sayT=0,this.sayCd=6+Math.random()*12,this.lookT=0,this.vision=this.role==="cop"?26:this.role==="guard"?16:9,this.fov=this.role==="guard"?1.9:1.5,this.carry=null,this.jobOffer=!1,this.offerT=0,this.startPos=this.pos.clone(),this.leaving=!1,this.role==="guard"&&this.char.setWeapon("baton"),this.role==="cop"&&this.char.setWeapon("pistol"),(this.role==="seller"||this.role==="cashier")&&this.char.setWeapon("fists"),e.scene.add(this.char.root)}get alive(){return!this.dead}say(e,t=3){var s;this._bubble&&((s=this._bubble.parent)==null||s.remove(this._bubble),this._bubble.material.map.dispose(),this._bubble.material.dispose());let n=Qd(e,{color:"#ffe9a8",size:30,w:320});n.position.set(0,2.15,0),this.char.root.add(n),this._bubble=n,this.sayT=t}damage(e,t=!0){this.dead||(this.hp-=e,this.char.hurt(),this.hostile=!0,this.hp<=0?this.die(t):this.role==="guard"&&this.say("\u0410\u0445 \u0442\u044B!",2))}die(e=!0){this.dead||(this.dead=!0,this.char.isDead=!0,this.char.setState("dead"),this.game.onNpcKilled(this,e))}faceTo(e,t){let n=Math.atan2(e-this.pos.x,t-this.pos.z);this.yaw=n,this.char.root.rotation.y=n}moveToward(e,t,n,s){let r=e-this.pos.x,o=t-this.pos.z,a=Math.hypot(r,o);if(a<.001)return 0;let c=Math.min(a,n*s);this.pos.x+=r/a*c,this.pos.z+=o/a*c,this.game.colliders.resolve(this.pos,.32);let l=Math.atan2(r,o);return this.yaw+=ys(this.yaw,l)*Math.min(1,s*9),this.char.root.rotation.y=this.yaw,this.char.root.position.set(this.pos.x,this.pos.y,this.pos.z),n}update(e){var o,a;if(this.dead){this.char.update(e,0);return}this.attackCd=Math.max(0,this.attackCd-e),this.sayT>0&&(this.sayT-=e,this.sayT<=0&&this._bubble&&((o=this._bubble.parent)==null||o.remove(this._bubble),(a=this._bubble.material.map)==null||a.dispose(),this._bubble.material.dispose(),this._bubble=null));let t=0,s=this.game.player.pos,r=Ft(this.pos,s);switch(this.role){case"cashier":t=this.updateCashier(e,r,s);break;case"seller":t=this.updateSeller(e,r,s);break;case"guard":t=this.updateGuard(e,r,s);break;case"cop":t=this.updateCop(e,r,s);break;case"boss":t=this.updateBoss(e,r,s);break;default:t=this.updatePed(e,r,s);break}if(!this.dead&&r<9&&this.role!=="cop"){let c=ys(this.char.root.rotation.y,Math.atan2(s.x-this.pos.x,s.z-this.pos.z));this.char.lookTarget={localYaw:Ot(c,-.8,.8),localPitch:.1}}else this.char.lookTarget=null;this.char.aiming=this.role==="guard"||this.role==="cop"?this.state==="attack"||this.state==="chase":!1,this.char.update(e,t,{aiming:this.char.aiming})}updatePed(e,t,n){var r;let s=this.game;if(this.jobOffer){if(this.offerT-=e,Ft(this.pos,n)>2.2){let a=this.moveToward(n.x,n.z,1.7,e);return this.char.setState("walk"),this.offerT<0&&(this.jobOffer=!1),a}return this.faceTo(n.x,n.z),this.char.setState("idle"),this.offerT<0&&(this.jobOffer=!1),0}if(this.hostile&&this.role==="thug")return Ft(this.pos,n)<1.8?(this.char.setState("idle"),this.attackCd<=0&&(this.attackCd=1.3,this.char.punch(),s.hitPlayer(6+Math.random()*4,this)),0):(this.char.setState("walk"),this.moveToward(n.x,n.z,2.6,e));if(s.playerArmed()&&t<7&&Math.random()<.02&&(this.state="flee",this.fleeT=3.5),this.state==="flee"){this.fleeT-=e,this.fleeT<=0&&(this.state="patrol");let o=this.pos.x-n.x,a=this.pos.z-n.z,c=Math.hypot(o,a)||1;this.char.setState("walk");let l=this.moveToward(this.pos.x+o/c*3,this.pos.z+a/c*3,3.4,e);return Math.random()<.01&&this.say("\u041F\u043E\u043C\u043E\u0433\u0438\u0442\u0435!",2),l}if(this.path&&this.path.length){if(this.waitT>0)return this.waitT-=e,this.char.setState("idle"),0;let o=this.path[this.pathIdx%this.path.length];if(Math.hypot(o[0]-this.pos.x,o[1]-this.pos.z)<.9)this.pathIdx=(this.pathIdx+1)%this.path.length,Math.random()<.35&&(this.waitT=1+Math.random()*3);else{this.char.setState("walk");let c=this.moveToward(o[0],o[1],this.speed,e);return this.sayCd-=e,this.sayCd<=0&&(this.sayCd=14+Math.random()*20,t<12&&Math.random()<.5&&this.say(((r=ea[this.role])==null?void 0:r[Math.floor(Math.random()*ea[this.role].length)])||ea.ped[0])),c}}return this.char.setState("idle"),0}updateCashier(e,t,n){let s=this.game,r=s.visionCheck(this.pos,this.yaw,n,2.4,20),o=s.playerArmed();return r&&o&&!s.alarmOn&&(this._panic||(this._panic=1.8,this.say("\u041E\u0440\u0443\u0436\u0438\u0435! \u041F\u043E\u043C\u043E\u0433\u0438\u0442\u0435!",2.4))),r&&s.grabbing&&(this._panic||(this._panic=1.2,this.say("\u041E\u043D \u0437\u0430\u0431\u0438\u0440\u0430\u0435\u0442 \u0434\u0435\u043D\u044C\u0433\u0438!",2))),this._panic?(this._panic-=e,this.char.setState("idle"),this.char.lookTarget={localYaw:0,localPitch:0},this.char.armR.shoulder.rotation.x=-2.3,this.char.armL.shoulder.rotation.x=-2.1,this._panic<=0&&(this._panic=null,s.triggerAlarm("cashier")),0):(r&&this.faceTo(n.x,n.z),this.char.setState("idle"),0)}updateSeller(e,t,n){return t<3.2&&(this.faceTo(n.x,n.z),this.sayCd-=e,this.sayCd<=0&&(this.sayCd=20,this.say(ea.seller[Math.floor(Math.random()*3)]))),this.char.setState("idle"),0}updateBoss(e,t,n){return this.char.setState("idle"),t<3.2&&this.faceTo(n.x,n.z),0}updateGuard(e,t,n){let s=this.game,r=s.visionCheck(this.pos,this.yaw,n,this.fov,this.vision),o=s.playerArmed();if(r&&o&&!s.alarmOn&&(this.hostile=!0,this._warned||(this._warned=1,this.say("\u041E\u0440\u0443\u0436\u0438\u0435 \u0432 \u0431\u0430\u043D\u043A\u0435!",2.5))),r&&s.grabbing&&(this.hostile=!0),this.hostile){let a=Ft(this.pos,n);if(a<1.9)return this.char.setState("idle"),this.faceTo(n.x,n.z),this.attackCd<=0&&(this.attackCd=1.35,this.char.punch(),s.hitPlayer(7+Math.random()*3.5,this),s.ui.hitFlash()),0;if(this.char.setState("walk"),a<26)return this.moveToward(n.x,n.z,this.speed,e)}if(this.path&&this.path.length){let a=this.path[this.pathIdx%this.path.length];if(Math.hypot(a[0]-this.pos.x,a[1]-this.pos.z)<1)this.pathIdx=(this.pathIdx+1)%this.path.length,Math.random()<.3&&(this.waitT=1+Math.random()*2);else if(this.waitT>0)this.waitT-=e,this.char.setState("idle"),this.yaw+=e*.7,this.char.root.rotation.y=this.yaw;else return this.char.setState("walk"),this.moveToward(a[0],a[1],this.speed,e)}return this.char.setState("idle"),0}updateCop(e,t,n){let s=this.game,r=s.nearestWantedPlayer(this.pos);if(!r)return this.leaving=!0,this.char.setState("walk"),this.moveToward(this.pos.x+(this.startPos.x-this.pos.x)*.02,this.pos.z+(this.startPos.z-this.pos.z)*.02,2.6,e);let o=r.pos,a=Ft(this.pos,o),c=s.visionCheck(this.pos,this.yaw,o,2.6,40);return c&&s.markSeen(r,this),(r===s.player?s.player.stars:s.remoteStars||0)>=3&&a>4&&a<24&&c?(this.char.setState("idle"),this.faceTo(o.x,o.z),this.attackCd<=0&&(this.attackCd=1.5,this.char.punch(),s.copShootAt(this,o,r)),0):a<2?(this.char.setState("idle"),this.faceTo(o.x,o.z),this.attackCd<=0&&(this.attackCd=1.2,this.char.punch(),s.hitPlayer(8+Math.random()*4,this,r),s.ui.hitFlash()),0):(this.char.setState("walk"),this.char.speed=3.6,this.moveToward(o.x,o.z,3.7,e))}};var vs=6,ci=15;function ta(){return[null,null,null,null,null,null]}function na(){return{"9\u043C\u043C":0,"12\u043A":0,"7.62":0}}function mf(i){let e=qt[i];return{t:e.melee?"melee":"weapon",id:i,mag:e.mag||0,ammoType:e.ammo||null}}function sh(i,e={}){switch(i){case"money":return{t:"money",qty:e.qty||1};case"bag":return{t:"bag",cash:e.cash||0};case"armor":return{t:"armor",qty:e.qty||100};default:return{t:i,...e}}}function bs(i){var e;return i?i.t==="money"?`\u041F\u0430\u0447\u043A\u0430 \u0434\u0435\u043D\u0435\u0433${i.qty>1?" \xD7"+i.qty:""}`:i.t==="bag"?"\u0421\u0443\u043C\u043A\u0430":i.t==="armor"?"\u0411\u0440\u043E\u043D\u0435\u0436\u0438\u043B\u0435\u0442":i.t==="weapon"||i.t==="melee"?((e=qt[i.id])==null?void 0:e.name)||i.id:"\u041F\u0440\u0435\u0434\u043C\u0435\u0442":"\u041A\u0443\u043B\u0430\u043A\u0438"}function Pi(i){var e;return i?i.t==="money"?"\u{1F4B5}":i.t==="bag"?"\u{1F392}":i.t==="armor"?"\u{1F9BA}":i.t==="weapon"||i.t==="melee"?((e=qt[i.id])==null?void 0:e.icon)||"\u{1F52B}":"\u{1F4E6}":"\u{1F44A}"}function gf(i){var e;return i?i.t==="money"?"\u0423\u043A\u0440\u0430\u0434\u0435\u043D\u043D\u044B\u0435 \u043F\u0430\u0447\u043A\u0438. \u0412 \u0438\u043D\u0432\u0435\u043D\u0442\u0430\u0440\u0435 \u043C\u043E\u0436\u043D\u043E \u043F\u0435\u0440\u0435\u0432\u0435\u0441\u0442\u0438 \u0432 \u0431\u0430\u043B\u0430\u043D\u0441 \u2014 \u0441\u0443\u043C\u043C\u0430 \u0441\u043B\u0443\u0447\u0430\u0439\u043D\u0430\u044F.":i.t==="bag"?"\u0421\u0443\u043C\u043A\u0430 \u0434\u043B\u044F \u043A\u0440\u0443\u043F\u043D\u044B\u0445 \u0434\u0435\u043B. \u0412\u043C\u0435\u0449\u0430\u0435\u0442 \u043C\u043D\u043E\u0433\u043E \u0434\u0435\u043D\u0435\u0433. \u041E\u0442\u043A\u0440\u044B\u0432\u0430\u0439 \u0438 \u0432\u044B\u0432\u043E\u0434\u0438 \u0441\u043A\u043E\u043B\u044C\u043A\u043E \u043D\u0443\u0436\u043D\u043E.":i.t==="armor"?"\u0411\u0440\u043E\u043D\u0435\u0436\u0438\u043B\u0435\u0442: \u043F\u043E\u0433\u043B\u043E\u0449\u0430\u0435\u0442 \u0447\u0430\u0441\u0442\u044C \u0443\u0440\u043E\u043D\u0430.":(i.t==="weapon"||i.t==="melee")&&((e=qt[i.id])==null?void 0:e.desc)||"":"\u0411\u0435\u0437 \u043E\u0440\u0443\u0436\u0438\u044F. \u041A\u0443\u043B\u0430\u043A\u0438 \u0432\u0441\u0435\u0433\u0434\u0430 \u0441 \u0442\u043E\u0431\u043E\u0439."}function hr(i,e){if(e.t==="money")for(let t=1;t<i.length;t++){let n=i[t];if(n&&n.t==="money")return n.qty+=e.qty,!0}if(e.t==="bag"){for(let t=1;t<i.length;t++)if(i[t]&&i[t].t==="bag")return!1}for(let t=1;t<i.length;t++)if(!i[t])return i[t]=e,!0;return!1}function _f(){let i=Math.random();return i>.9?2600+Math.floor(Math.random()*1800):i>.55?1200+Math.floor(Math.random()*1200):450+Math.floor(Math.random()*700)}function yf(){return 9e3+Math.floor(Math.random()*21e3)}var rh="deni_islam_save_v1";function ih(){return{v:1,money:500,hotbar:ta(),ammo:na(),lockers:{lockerA:new Array(ci).fill(null),lockerB:new Array(ci).fill(null)},hp:100,pos:null,stars:0,bag:null,stats:{jobs:0,kills:0,robberies:0}}}function Hx(){try{if(window.AndroidStore&&typeof window.AndroidStore.load=="function"){let i=window.AndroidStore.load();if(i)return i}}catch{}try{return localStorage.getItem(rh)}catch{return null}}function Vx(i){try{window.AndroidStore&&typeof window.AndroidStore.save=="function"&&window.AndroidStore.save(i)}catch{}try{localStorage.setItem(rh,i)}catch{}}function xf(){var i,e;try{(e=(i=window.AndroidStore)==null?void 0:i.clear)==null||e.call(i)}catch{}try{localStorage.removeItem(rh)}catch{}}function oh(){var i,e;try{let t=Hx();if(!t)return ih();let n=JSON.parse(t),s=ih();return{...s,...n,ammo:{...s.ammo,...n.ammo||{}},lockers:{lockerA:(((i=n.lockers)==null?void 0:i.lockerA)||s.lockers.lockerA).slice(0,ci),lockerB:(((e=n.lockers)==null?void 0:e.lockerB)||s.lockers.lockerB).slice(0,ci)},stats:{...s.stats,...n.stats||{}}}}catch(t){return console.warn("save load failed",t),ih()}}function vf(i){try{Vx(JSON.stringify(i))}catch{}}var ia=class{constructor(){this.ctx=null,this.ok=!1,this.sirenNodes=null,this.muted=!1}init(){var t,n;if(this.ctx){(n=(t=this.ctx).resume)==null||n.call(t);return}let e=window.AudioContext||window.webkitAudioContext;if(e)try{this.ctx=new e,this.master=this.ctx.createGain(),this.master.gain.value=.55,this.master.connect(this.ctx.destination);let s=Math.floor(this.ctx.sampleRate*1.2),r=this.ctx.createBuffer(1,s,this.ctx.sampleRate),o=r.getChannelData(0);for(let a=0;a<s;a++)o[a]=Math.random()*2-1;this.noiseBuf=r,this.ok=!0}catch{this.ok=!1}}resume(){var e,t;(t=(e=this.ctx)==null?void 0:e.resume)==null||t.call(e)}_noise(e=.15,t=1200,n=1,s=.5,r="lowpass"){if(!this.ok)return;let o=this.ctx,a=o.currentTime,c=o.createBufferSource();c.buffer=this.noiseBuf;let l=o.createBiquadFilter();l.type=r,l.frequency.value=t,l.Q.value=n;let h=o.createGain();h.gain.setValueAtTime(s,a),h.gain.exponentialRampToValueAtTime(.001,a+e),c.connect(l),l.connect(h),h.connect(this.master),c.start(a),c.stop(a+e+.02)}_tone(e,t=.12,n="sine",s=.25,r=null){if(!this.ok)return;let o=this.ctx,a=o.currentTime,c=o.createOscillator();c.type=n,c.frequency.setValueAtTime(e,a),r&&c.frequency.exponentialRampToValueAtTime(r,a+t);let l=o.createGain();l.gain.setValueAtTime(s,a),l.gain.exponentialRampToValueAtTime(.001,a+t),c.connect(l),l.connect(this.master),c.start(a),c.stop(a+t+.02)}shot(e="pistol"){this.ok&&(e==="shotgun"?(this._noise(.24,900,.8,.85),this._tone(90,.18,"square",.3,40)):e==="rifle"?(this._noise(.11,1800,1.2,.6),this._tone(140,.09,"square",.22,60)):(this._noise(.13,1500,1,.55),this._tone(150,.1,"square",.22,70)))}punch(){this._noise(.1,420,1.4,.35)}hit(){this._noise(.09,260,1.6,.4),this._tone(70,.08,"sine",.18)}cash(){this._tone(1250,.07,"square",.12),setTimeout(()=>this._tone(1680,.09,"square",.1),65)}ui(){this._tone(600,.05,"triangle",.12)}error(){this._tone(180,.16,"sawtooth",.16,120)}door(){this._noise(.22,320,.9,.25)}reload(){this._noise(.07,900,1.5,.25),setTimeout(()=>this._noise(.09,700,1.2,.3),160)}pickup(){this._tone(880,.07,"triangle",.16,1320)}siren(e){if(this.ok){if(e&&!this.sirenNodes){let t=this.ctx,n=t.createOscillator();n.type="sine",n.frequency.value=620;let s=t.createOscillator();s.type="sine",s.frequency.value=.42;let r=t.createGain();r.gain.value=190,s.connect(r),r.connect(n.frequency);let o=t.createGain();o.gain.value=.1,n.connect(o),o.connect(this.master),n.start(),s.start(),this.sirenNodes={o1:n,lfo:s,g:o}}else if(!e&&this.sirenNodes){let{o1:t,lfo:n,g:s}=this.sirenNodes;try{s.gain.value=0,t.stop(),n.stop()}catch{}this.sirenNodes=null}}}};var Ye=(i,e="",t="")=>{let n=document.createElement(i);return e&&(n.className=e),t&&(n.innerHTML=t),n},Xe=i=>document.getElementById(i),Ms=()=>window.matchMedia("(pointer: coarse)").matches||"ontouchstart"in window,sa=class{constructor(){this.onAction=()=>{},this.input={moveX:0,moveY:0,lookX:0,lookY:0,fire:!1,aim:!1,run:!1,jump:!1,act:!1,reload:!1,inv:!1},this._actEdge=!1,this._reloadEdge=!1,this._jumpEdge=!1,this._invEdge=!1,this.keys=new Set,this.modalOpen=!1,this.startTime=performance.now()}setLoading(e,t){let n=Xe("bootFill");n&&(n.style.width=Math.min(100,e)+"%"),t&&(Xe("bootTxt").textContent=t)}showMenu(){Xe("boot").classList.add("hidden"),Xe("menu").classList.remove("hidden"),Xe("hud").classList.add("hidden"),this.hideModal(),Xe("pause").classList.add("hidden")}hideMenu(){Xe("menu").classList.add("hidden")}showHUD(){Xe("hud").classList.remove("hidden"),Xe("hintPC").style.display=Ms()?"none":"block",Xe("touchLeft").style.display=Ms()?"block":"none",Xe("touchRight").style.display=Ms()?"block":"none",this.bindTouch()}hideHUD(){Xe("hud").classList.add("hidden")}setPlayer(e,t){Xe("pName").textContent=e,Xe("avaIcon").textContent=t}setStats({hp:e,stamina:t,money:n,stars:s}){if(e!==void 0&&(Xe("hpFill").style.width=Math.max(0,e)+"%",Xe("hpTxt").textContent=Math.max(0,Math.round(e))),t!==void 0&&(Xe("stFill").style.width=Math.max(0,t)+"%",Xe("stTxt").textContent=Math.round(t)),n!==void 0&&(Xe("money").textContent="$"+Math.floor(n).toLocaleString("ru-RU")),s!==void 0){let r="";for(let o=0;o<5;o++)r+=o<s?"<b>\u2605</b>":"\u2605";Xe("stars").innerHTML=r}}setNet(e,t=!0){let n=Xe("netStatus");n.innerHTML=`<i class="dot" style="background:${t?"#5ad25a":"#c9a23a"};box-shadow:0 0 8px ${t?"#5ad25a":"#c9a23a"}"></i> ${e}`}setVoice(e,t=!1){let n=Xe("voiceStatus");n.textContent=(t?"\u{1F399} ":"\u{1F507} ")+e,n.style.color=t?"#9adf9a":"#8f8877"}setJob(e){let t=Xe("jobLine");e?(t.classList.remove("hidden"),t.innerHTML=e):t.classList.add("hidden")}setPrompt(e){let t=Xe("prompt");if(!e){t.classList.add("hidden");return}t.classList.remove("hidden"),t.innerHTML=e}setProgress(e,t){let n=Xe("progress");if(e===null){n.classList.add("hidden");return}n.classList.remove("hidden"),Xe("progressFill").style.width=Math.max(0,Math.min(100,e*100))+"%",t&&(Xe("progressTxt").textContent=t)}setCrosshair(e){Xe("crosshair").style.display=e?"block":"none"}hitFlash(){let e=Xe("hitflash");e.style.opacity=".85",clearTimeout(this._hf),this._hf=setTimeout(()=>e.style.opacity="0",90)}log(e){let t=Xe("log"),n=Ye("div","",e);for(t.appendChild(n);t.children.length>5;)t.removeChild(t.firstChild);setTimeout(()=>{n.style.opacity="0",n.style.transition="opacity .5s"},3800),setTimeout(()=>n.remove(),4400)}toast(e,t=""){let n=Ye("div","toast "+t,e);Xe("toasts").appendChild(n),setTimeout(()=>{n.style.opacity="0",n.style.transition="opacity .35s"},2300),setTimeout(()=>n.remove(),2750)}renderHotbar(e,t,n){let s=Xe("hotbar");s.innerHTML="";for(let r=0;r<vs;r++){let o=Ye("div","slot"+(t===r?" sel":"")+(r>0&&!e[r]?" empty":"")),a=r===0?null:e[r];o.innerHTML=`<span class="num">${r+1}</span><span class="ico">${r===0?"\u{1F44A}":Pi(a)}</span>`,a&&a.t==="money"&&a.qty>1&&(o.innerHTML+=`<span class="qty">\xD7${a.qty}</span>`),a&&a.t==="weapon"&&(o.innerHTML+=`<span class="ammo">${a.mag}</span>`),a&&a.t==="bag"&&(o.innerHTML+='<span class="ammo">\u{1F4B0}</span>'),o.addEventListener("click",()=>n(r)),s.appendChild(o)}}showModal({title:e,sub:t,body:n,foot:s}){this.modalOpen=!0,Xe("modalTitle").textContent=e||"",Xe("modalSub").innerHTML=t||"";let r=Xe("modalBody");r.innerHTML="",typeof n=="string"?r.innerHTML=n:n&&r.appendChild(n);let o=Xe("modalFoot");o.innerHTML="",s&&(Array.isArray(s)?s:[s]).forEach(a=>o.appendChild(a)),Xe("modal").classList.remove("hidden"),Xe("hud").style.pointerEvents="auto"}hideModal(){this.modalOpen=!1,Xe("modal").classList.add("hidden"),Xe("hud").style.pointerEvents="none"}showPause(){Xe("pause").classList.remove("hidden"),Xe("pause").querySelectorAll("[data-pause]").forEach(e=>{e.onclick=()=>this.onAction("pause:"+e.dataset.pause)})}hidePause(){Xe("pause").classList.add("hidden")}bindTouch(){if(this._touchBound)return;this._touchBound=!0;let e=Xe("stick"),t=Xe("knob"),n=null,s=0,r=0,o=(p,M)=>{t.style.transform=`translate(${p}px,${M}px)`},a=(p,M)=>{let x=e.clientWidth/2,b=p-s,D=M-r,A=Math.hypot(b,D),C=x*.72;A>C&&(b=b/A*C,D=D/A*C),o(b,D),this.input.moveX=b/C,this.input.moveY=D/C},c=p=>{var b;let M=p.changedTouches?p.changedTouches[0]:p;n=(b=M.identifier)!=null?b:"m";let x=e.getBoundingClientRect();s=x.left+x.width/2,r=x.top+x.height/2,a(M.clientX,M.clientY),p.preventDefault()},l=p=>{if(n===null)return;let x=(p.changedTouches?Array.from(p.changedTouches):[p]).find(b=>{var D;return((D=b.identifier)!=null?D:"m")===n});x&&(a(x.clientX,x.clientY),p.preventDefault())},h=p=>{!(p.changedTouches?Array.from(p.changedTouches):[p]).find(b=>{var D;return((D=b.identifier)!=null?D:"m")===n})&&p.changedTouches||(n=null,this.input.moveX=0,this.input.moveY=0,o(0,0))};e.addEventListener("touchstart",c,{passive:!1}),e.addEventListener("touchmove",l,{passive:!1}),e.addEventListener("touchend",h),e.addEventListener("touchcancel",h),e.addEventListener("mousedown",c),window.addEventListener("mousemove",p=>{n==="m"&&l(p)}),window.addEventListener("mouseup",p=>{n==="m"&&h(p)});let u=(p,M,x)=>{let b=Xe(p);if(!b)return;let D=C=>{C.preventDefault(),C.stopPropagation(),b.classList.add("active"),M&&M()},A=C=>{C&&C.stopPropagation(),b.classList.remove("active"),x&&x()};b.addEventListener("touchstart",D,{passive:!1}),b.addEventListener("touchend",A),b.addEventListener("touchcancel",A),b.addEventListener("mousedown",D),b.addEventListener("mouseup",A),b.addEventListener("mouseleave",A)};u("btnFire",()=>this.input.fire=!0,()=>this.input.fire=!1),u("btnRun",()=>this.input.run=!0,()=>this.input.run=!1),u("btnAct",()=>{this._actEdge=!0,this.input.act=!0},()=>this.input.act=!1),u("btnReload",()=>{this._reloadEdge=!0},()=>{}),u("btnJump",()=>{this._jumpEdge=!0},()=>{}),u("btnInv",()=>{this._invEdge=!0},()=>{});let d=document.getElementById("c"),f=null,g=0,y=0;d.addEventListener("touchstart",p=>{if(!this.modalOpen){for(let M of p.changedTouches)if(!(M.clientX<window.innerWidth*.42)){f=M.identifier,g=M.clientX,y=M.clientY;break}}},{passive:!0}),d.addEventListener("touchmove",p=>{if(f!==null)for(let M of p.changedTouches)M.identifier===f&&(this.input.lookX+=(M.clientX-g)*.0055,this.input.lookY+=(M.clientY-y)*.0045,g=M.clientX,y=M.clientY)},{passive:!0});let m=p=>{for(let M of p.changedTouches)M.identifier===f&&(f=null)};d.addEventListener("touchend",m),d.addEventListener("touchcancel",m)}bindDesktop(e,t){let n={KeyW:"w",KeyA:"a",KeyS:"s",KeyD:"d",KeyE:"act",KeyR:"reload",ShiftLeft:"run",ShiftRight:"run",KeyQ:"inv",Tab:"inv",Space:"jump"};window.addEventListener("keydown",s=>{if(this.modalOpen)return;if(s.repeat){s.code==="Tab"&&s.preventDefault();return}let r=n[s.code];if(s.code==="Tab"&&s.preventDefault(),s.code.startsWith("Digit")){let o=parseInt(s.code.slice(5),10);o>=1&&o<=6&&this.onAction("slot:"+(o-1));return}if(s.code==="Escape"){this.onAction("pause:toggle");return}r&&(r==="act"&&(this._actEdge=!0),r==="reload"&&(this._reloadEdge=!0),r==="jump"&&(this._jumpEdge=!0),r==="inv"&&(this._invEdge=!0),this.keys.add(r),r==="run"&&(this.input.run=!0))}),window.addEventListener("keyup",s=>{let r=n[s.code];r&&(this.keys.delete(r),r==="run"&&(this.input.run=!1))}),e.addEventListener("mousedown",s=>{var r;if(!this.modalOpen){if(document.pointerLockElement!==e){(r=e.requestPointerLock)==null||r.call(e);return}s.button===0&&(this.input.fire=!0),s.button===2&&(this.input.aim=!0)}}),window.addEventListener("mouseup",s=>{s.button===0&&(this.input.fire=!1),s.button===2&&(this.input.aim=!1)}),e.addEventListener("contextmenu",s=>s.preventDefault()),document.addEventListener("mousemove",s=>{document.pointerLockElement===e&&(this.input.lookX+=s.movementX*.0022,this.input.lookY+=s.movementY*.002)}),document.addEventListener("pointerlockchange",()=>{t==null||t(document.pointerLockElement===e)}),window.addEventListener("wheel",s=>{this.modalOpen||this.onAction("slotwheel:"+Math.sign(s.deltaY))},{passive:!0})}keyboardMove(){let e=this.keys,t=0,n=0;e.has("w")&&(n-=1),e.has("s")&&(n+=1),e.has("a")&&(t-=1),e.has("d")&&(t+=1);let s=Math.hypot(t,n)||1;return{x:t/s,y:n/s,active:!!(t||n)}}consumeAct(){let e=this._actEdge;return this._actEdge=!1,e}consumeReload(){let e=this._reloadEdge;return this._reloadEdge=!1,e}consumeJump(){let e=this._jumpEdge;return this._jumpEdge=!1,e}consumeInv(){let e=this._invEdge;return this._invEdge=!1,e}consumeLook(){let e={x:this.input.lookX,y:this.input.lookY};return this.input.lookX=0,this.input.lookY=0,e}controlsHTML(){return`
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
      </div>`}};var Ss=(i=0,e=0,t=0)=>new R(i,e,t),ra=()=>window.matchMedia("(pointer: coarse)").matches||innerWidth<820,oa=class{constructor(e,t,n){_u(this,"loop",()=>{requestAnimationFrame(this.loop);let e=Math.min(.06,this.clock.getDelta());if(this.time+=e,this.state==="menu"){this.updateMenuCam(e),this.renderer.render(this.scene,this.camera);return}if(this.state==="play"||this.state==="dead"){this.uiPaused=this.ui.modalOpen||this.pauseOpen,this.uiPaused||this.update(e),this.ui.consumeLook(),this.renderer.render(this.scene,this.camera),this.pv&&this.ui.modalOpen&&this.renderPreview(e);return}this.renderer.render(this.scene,this.camera)});this.canvas=e,this.ui=t,this.net=n,this.state="boot",this.clock=new Xo,this.time=0,this.colliders=null,this.npcs=[],this.sound=new ia,this.server="solo",this.stats={jobs:0,kills:0,robberies:0},this.lockers=null,this.uiPaused=!1,this.playerSeen=!1,this.remoteSeen=!1,this.unseen=0,this.grabbing=!1,this.grabProgress=0,this.moneyRespawnT=0,this.job=null,this.carrying=null,this.offersT=20,this.copSpawnT=0,this.remoteStars=0,this.tracers=[],this.flashes=[],this.lastNet=0,this.fpsAcc=0,this.fireCd=0,this.reloading=null,this.recoil=0,this.bob=0,this.viewModel=null,this.viewWeaponId=null,this.intro=null,this.currentPrompt=null,this.hudTick=0}async init(){this.renderer=this._createRenderer(),this.scene=new js,this.scene.fog=new Ro(9273970,80,300),this.camera=new Ut(72,innerWidth/innerHeight,.05,700),this.camera.rotation.order="YXZ",this.scene.add(this.camera);let e=new lr;e.scale.setScalar(1200),this.scene.add(e);let t=e.material.uniforms;t.turbidity.value=7.5,t.rayleigh.value=1.7,t.mieCoefficient.value=.0065,t.mieDirectionalG.value=.86;let n=new R().setFromSphericalCoords(1,Jl.degToRad(74),Jl.degToRad(212));t.sunPosition.value.copy(n),this.sky=e,this.sun=new gs(16765856,2.5),this.sun.castShadow=!0,this.sun.shadow.mapSize.set(ra()?1024:2048,ra()?1024:2048);let s=this.sun.shadow.camera;return s.near=1,s.far=220,s.left=-55,s.right=55,s.top=55,s.bottom=-55,this.sun.shadow.bias=-9e-4,this.sun.shadow.normalBias=.02,this.scene.add(this.sun),this.scene.add(this.sun.target),this.muzzleLight=new Tn(16760944,0,10,2),this.scene.add(this.muzzleLight),this.scene.add(new or(11060479,5982772,.65)),this.scene.add(new Wo(16777215,.14)),this.colliders=new Zo,this.world=pf(this.scene,this.colliders),this._spawnNpcs(),this._spawnAmbientNpcPool(),this.player={pos:Ss(-14,0,13),yaw:Math.PI,pitch:0,vy:0,hp:100,maxHp:100,armor:0,stamina:100,maxStamina:100,money:500,stars:0,hotbar:ta(),ammo:na(),selected:0,alive:!0,skin:"gentleman",name:"\u0414\u0416\u0415\u041D\u0422\u0415\u041B\u042C\u041C\u0415\u041D",sprintT:0},addEventListener("resize",()=>this._resize()),this._resize(),this.menuCam={t:0},this.loop(),this.state="menu",this}_createRenderer(){let e=this.canvas,t=new Zs({canvas:e,antialias:!ra(),powerPreference:"high-performance",stencil:!1});return t.setPixelRatio(Math.min(window.devicePixelRatio||1,ra()?1.4:2)),t.setSize(innerWidth,innerHeight,!1),t.shadowMap.enabled=!0,t.shadowMap.type=Bl,t.toneMapping=zl,t.toneMappingExposure=1.06,t}_resize(){var n;let e=innerWidth,t=innerHeight;this.camera.aspect=e/t,this.camera.updateProjectionMatrix(),(n=this.renderer)==null||n.setSize(e,t,!1),this.ui.setCrosshair(!0)}_spawnNpcs(){let e=this.world,t=["normal","elderly","thug","normal","elderly","normal","thug","normal","elderly","normal"];e.npcPaths.forEach((n,s)=>{for(let r=0;r<1;r++){let o=n[Math.floor(Math.random()*n.length)],a=t[(s*2+r)%t.length],c=new wn(this,{role:a==="elderly"?"old":a==="thug"?"thug":"ped",kind:a,pos:Ss(o[0]+(Math.random()-.5)*3,0,o[1]+(Math.random()-.5)*1.5),path:n});c.pathIdx=Math.floor(Math.random()*n.length),this.npcs.push(c)}}),this.cashier=new wn(this,{role:"cashier",pos:this.world.cashierPos,yaw:0}),this.npcs.push(this.cashier),this.world.guardPaths.forEach(n=>{let s=new wn(this,{role:"guard",pos:n[0].clone(),path:n.map(r=>[r.x,r.z])});s.speed=1.5,this.npcs.push(s)}),this.seller=new wn(this,{role:"seller",pos:this.world.sellerPos,yaw:0}),this.npcs.push(this.seller),this.boss=new wn(this,{role:"boss",kind:"normal",pos:this.world.dockBossPoint,yaw:-1}),this.npcs.push(this.boss)}_spawnAmbientNpcPool(){this.ambientPool=[];for(let e=0;e<4;e++){let t=["normal","elderly","thug","normal"][e],n=new wn(this,{role:t==="elderly"?"old":t==="thug"?"thug":"ped",kind:t,pos:Ss(-40+e*20,0,e%2?7.2:-7.2),path:this.world.npcPaths[e%this.world.npcPaths.length]});n.char.root.visible=!1,n.char.root.position.set(0,-50,0),n.pos.set(0,-50,0),n.inactive=!0,this.ambientPool.push(n)}}startMatch(e){var o,a;this.profile=e;let t=oh(),n=this.player;n.skin=e.skin,n.name=e.name,n.money=(o=t.money)!=null?o:500,n.hotbar=(a=t.hotbar)!=null&&a.length?t.hotbar:ta(),n.ammo=t.ammo||na(),n.hp=Ot(t.hp||100,25,100),n.stars=0,n.selected=0,n.alive=!0,this.lockers=t.lockers||{lockerA:new Array(ci).fill(null),lockerB:new Array(ci).fill(null)},this.stats=t.stats||this.stats;let s=e.isHost?0:1;this.bedIdx=s;let r=this.world.bedSpots[s];n.pos.copy(r.pos),n.yaw=r.yaw+Math.PI,n.pitch=0,this.spawnPoint=r.wakePos.clone(),this.localChar&&this.scene.remove(this.localChar.root),this.localChar=new Ci(e.skin),this.localChar.root.position.copy(r.pos),this.localChar.root.position.y=.6,this.localChar.root.rotation.y=r.yaw,this.localChar.lieDown(),this.scene.add(this.localChar.root),this.ui.setPlayer(e.name,e.skin==="gopnik"?"\u{1F9E2}":"\u{1F3A9}"),this.ui.setStats({hp:n.hp,stamina:100,money:n.money,stars:0}),this.ui.renderHotbar(n.hotbar,n.selected,c=>this.selectSlot(c)),this.ui.showHUD(),this.ui.setNet(e.isHost?"\u041E\u041D\u041B\u0410\u0419\u041D \xB7 \u0436\u0434\u0451\u043C \u0438\u0433\u0440\u043E\u043A\u0430 2":"\u041E\u041D\u041B\u0410\u0419\u041D \xB7 \u043F\u043E\u0434\u043A\u043B\u044E\u0447\u0435\u043D\u043E",!0),this.intro={t:0,dur:4.6,active:!0},this.camIntro={pos:Ss(-8.2,2.3,20.2),look:Ss(-12.6,1,12.8)},this.state="play",this.clock.getDelta(),this.sound.init(),this.sound.resume(),this.viewRoot=new qe,this.camera.add(this.viewRoot),this._updateViewModel(),this.net.on("msg",c=>this.onNet(c)),this.net.on("open",()=>this.onPeerOpen()),this.net.on("close",()=>{this.ui.setNet("\u0421\u041E\u041B\u041E \xB7 \u0438\u0433\u0440\u043E\u043A 2 \u043E\u0442\u043A\u043B\u044E\u0447\u0438\u043B\u0441\u044F",!1),this.remote&&(this.scene.remove(this.remote.char.root),this.remote=null)}),this.net.on("mic",c=>this.ui.setVoice(c.ok?"\u0433\u043E\u043B\u043E\u0441 \u0432\u043A\u043B\u044E\u0447\u0451\u043D":"\u043C\u0438\u043A\u0440\u043E\u0444\u043E\u043D \u043D\u0435 \u0440\u0430\u0437\u0440\u0435\u0448\u0451\u043D",c.ok)),this.net.on("status",c=>this.ui.setNet(c.text,c.kind==="ok")),setInterval(()=>{this.state==="play"&&this.saveGame()},12e3),addEventListener("beforeunload",()=>this.saveGame()),document.addEventListener("visibilitychange",()=>{document.hidden&&this.saveGame()}),this.ui.toast("\u0422\u044B \u043F\u0440\u043E\u0441\u043D\u0443\u043B\u0441\u044F \u0432 \u0441\u0432\u043E\u0435\u0439 \u043A\u043E\u043C\u043D\u0430\u0442\u0435","good"),setTimeout(()=>this.ui.toast("\u0413\u043E\u043B\u043E\u0441\u043E\u0432\u043E\u0439 \u0447\u0430\u0442 \u0430\u043A\u0442\u0438\u0432\u0435\u043D \u2014 \u0434\u0440\u0443\u0433 \u0441\u043B\u044B\u0448\u0438\u0442 \u0442\u0435\u0431\u044F",""),3e3)}updateMenuCam(e){this.menuCam.t+=e;let t=this.menuCam.t*.06,n=62;this.camera.position.set(Math.cos(t)*n+4,26+Math.sin(t*.7)*5,Math.sin(t)*n-4),this.camera.lookAt(4,3,-2),this.sun.position.copy(this.camera.position).add(Ss(-30,60,30)),this.sun.target.position.set(4,0,0)}update(e){var n;let t=this.player;this.playerSeen=!1,this.remoteSeen=!1,(n=this.intro)!=null&&n.active?this.updateIntro(e):this.updatePlayer(e),this.updateWorld(e),this.updateNpcs(e),this.updateRemote(e),this.updateCombat(e),this.updateInteraction(e),this.updateWanted(e),this.updateJobs(e),this.updateOffers(e),this.updateTracers(e),this.netTick(e),this.syncCamera(e),this.hudTick+=e,this.hudTick>.12&&(this.hudTick=0,this.ui.setStats({hp:t.hp,stamina:t.stamina,money:t.money,stars:t.stars})),this.moneyRespawnT>0&&(this.moneyRespawnT-=e,this.moneyRespawnT<=0&&(this.world.resetBankMoney(),this.ui.log("\u0412 \u0431\u0430\u043D\u043A\u0435 \u0441\u043D\u043E\u0432\u0430 \u043F\u043E\u044F\u0432\u0438\u043B\u0438\u0441\u044C \u0434\u0435\u043D\u044C\u0433\u0438")))}updateIntro(e){var o;let t=this.intro;t.t+=e;let n=Ot(t.t/t.dur,0,1),s=this.camIntro.look,r=this.camIntro.pos.clone();if(r.x+=Math.sin(t.t*.5)*.25,r.y+=Math.sin(t.t*.7)*.08,this.camera.position.copy(r),this.camera.lookAt(s.x,s.y+Math.sin(t.t)*.05,s.z),this.localChar.update(e,0),this.remote&&this.remote.char.update(e,0),t.t>t.dur-1.6&&!t.woke&&(t.woke=!0,this.localChar.wakeUp(),(o=this.remote)==null||o.char.wakeUp(),this.ui.log("\u041F\u043E\u0434\u044A\u0451\u043C, \u0434\u0435\u043B\u0430 \u0436\u0434\u0443\u0442.")),t.t>=t.dur){t.active=!1,this.intro=null;let a=this.player;a.pos.copy(this.spawnPoint),a.yaw=Math.PI*.75,this.localChar.root.visible=!1,this.ui.setJob(null),this.ui.setVoice(this.net.voiceOn?"\u0433\u043E\u043B\u043E\u0441 \u0432\u043A\u043B\u044E\u0447\u0451\u043D":"\u043C\u0438\u043A\u0440\u043E\u0444\u043E\u043D \u0432\u044B\u043A\u043B\u044E\u0447\u0435\u043D",this.net.voiceOn)}}updateWorld(e){this.world.update(e,this.player.pos),this.player.hp<this.player.maxHp&&this.state==="play"&&(this.player.hp=Math.min(this.player.maxHp,this.player.hp+e*.55))}updatePlayer(e){var x;let t=this.player;if(t===null)return;if(!t.alive){(x=this.localChar)==null||x.update(e,0);return}let n=this.ui.consumeLook();t.yaw-=n.x,t.pitch=Ot(t.pitch-n.y,-1.35,1.25);let s=0,r=0,o=!1;if(Ms())s=this.ui.input.moveX,r=this.ui.input.moveY,o=Math.hypot(s,r)>.12;else{let b=this.ui.keyboardMove();s=b.x,r=b.y,o=b.active}let a=this.ui.input.run&&t.stamina>2&&o,c=a?6.3:3.4;a?(t.stamina=Math.max(0,t.stamina-e*21),t.sprintT=0):(t.sprintT+=e,t.sprintT>.7&&(t.stamina=Math.min(t.maxStamina,t.stamina+e*16)));let l=Math.sin(t.yaw),h=Math.cos(t.yaw),u=-r,d=s,f=-l*u+h*d,g=-h*u+-l*d,y=Math.hypot(f,g);y>1&&(f/=y,g/=y);let m=Math.hypot(f,g)*c;t.pos.x+=f*c*e,t.pos.z+=g*c*e,this.colliders.resolve(t.pos,.36),this.ui.consumeJump()&&t.pos.y<=.01&&(t.vy=4.4),t.vy-=12*e,t.pos.y=Math.max(0,t.pos.y+t.vy*e),t.pos.y<=0&&(t.vy=0),this.bob+=e*(o?m*1.9:2);let p=o?a?.055:.03:.006,M=this.localChar;M&&(M.root.position.set(t.pos.x,t.pos.y,t.pos.z),M.root.rotation.y=t.yaw+Math.PI,M.root.visible=!1,M.aiming=this.playerArmed()||!1,M.update(e,o?m:0)),this.recoil=Math.max(0,this.recoil-e*3.6),this.camBob=p}syncCamera(e){var r;let t=this.player;if((r=this.intro)!=null&&r.active)return;let n=1.63,s=Math.sin(this.bob)*(this.camBob||.01);if(this.camera.position.set(t.pos.x,t.pos.y+n+s,t.pos.z),this.camera.rotation.set(t.pitch+this.recoil*.055,t.yaw,Math.sin(this.bob*.5)*.006),this.viewRoot){if(this.viewRoot.position.set(.26,-.24+Math.sin(this.bob)*(this.camBob||.01)*.6,-.5),this.viewRoot.rotation.set(-.02,.05,0),this.reloading){let o=1-this.reloading.t/1.3;this.viewRoot.rotation.z=Math.sin(o*Math.PI)*.9,this.viewRoot.position.y-=Math.sin(o*Math.PI)*.12}if(this.grabbing){let o=this.time*6.5;this.viewRoot.position.y+=Math.sin(o)*.055-.05,this.viewRoot.position.z-=.06,this.viewRoot.rotation.x+=Math.sin(o)*.28-.15,this.viewRoot.rotation.z+=Math.sin(o*.5)*.12}}this.sun.position.set(t.pos.x-40,70,t.pos.z+45),this.sun.target.position.set(t.pos.x,0,t.pos.z)}updateNpcs(e){let t=this.player.pos;for(let n of this.npcs){if(n.inactive)continue;if(Ft(n.pos,t)>95){n.char.update(e,0);continue}n.update(e),n.jobOffer&&!this.job&&Ft(n.pos,t)<2.6&&(this.pendingOffer=n)}for(let n=this.npcs.length-1;n>=0;n--){let s=this.npcs[n];s.role==="cop"&&this.player.stars===0&&(this.remoteStars||0)===0&&(s.calmT=(s.calmT||0)+e,s.calmT>6&&(s.leaving=!0,s.pos.x+=(s.startPos.x-s.pos.x)*e*.9,s.pos.z+=(s.startPos.z-s.pos.z)*e*.9,s.char.root.position.set(s.pos.x,0,s.pos.z),Ft(s.pos,s.startPos)<3&&(this.scene.remove(s.char.root),this.npcs.splice(n,1))))}}updateRemote(e){let t=this.remote;t&&(t.pos.lerp(t.target,Math.min(1,e*12)),t.char.root.position.copy(t.pos),t.char.root.rotation.y+=ys(t.char.root.rotation.y,t.yaw)*Math.min(1,e*10),t.char.aiming=!!t.aim,t.weapon!==t.char.weaponId&&t.char.setWeapon(t.weapon),t.char.update(e,t.speed||0,{aiming:t.aim}),t.stars=t.stars||0,this.remoteStars=t.stars)}currentItem(){let e=this.player;return e.selected===0?null:e.hotbar[e.selected]}currentWeaponId(){let e=this.currentItem();return e?e.t==="weapon"||e.t==="melee"?e.id:e.t==="bag"?"bag":"fists":"fists"}playerArmed(){let e=this.currentItem();return!!(e&&e.t==="weapon")}updateCombat(e){let t=this.player;if(this.fireCd=Math.max(0,this.fireCd-e),!!t.alive){if(this.reloading)if(this.reloading.t-=e,this.reloading.t<=0){let n=this.reloading.item,s=qt[n.id],r=s.mag-n.mag,o=t.ammo[s.ammo]||0,a=Math.min(r,o);n.mag+=a,t.ammo[s.ammo]=o-a,this.reloading=null,this.sound.reload(),this.ui.renderHotbar(t.hotbar,t.selected,c=>this.selectSlot(c)),this.ui.setProgress(null)}else this.ui.setProgress(1-this.reloading.t/1.3,"\u041F\u0435\u0440\u0435\u0437\u0430\u0440\u044F\u0434\u043A\u0430\u2026");this.ui.consumeReload()&&this.startReload(),this.ui.input.fire&&this.fireCd<=0&&this.tryFire()}}startReload(){let e=this.player,t=this.currentItem();if(!t||t.t!=="weapon"||this.reloading)return;let n=qt[t.id];if(t.mag>=n.mag){this.ui.toast("\u041C\u0430\u0433\u0430\u0437\u0438\u043D \u043F\u043E\u043B\u043E\u043D","");return}if((e.ammo[n.ammo]||0)<=0){this.ui.toast("\u041F\u0430\u0442\u0440\u043E\u043D\u043E\u0432 \u043D\u0435\u0442 \u2014 \u043A\u0443\u043F\u0438 \u043F\u0430\u0442\u0440\u043E\u043D\u044B \u0432 \u043C\u0430\u0433\u0430\u0437\u0438\u043D\u0435 \u043E\u0440\u0443\u0436\u0438\u044F","bad"),this.sound.error();return}this.reloading={t:1.3,item:t},this.sound.reload()}tryFire(){let e=this.player,t=this.currentItem();if(!e.alive)return;if(!t)return this.meleeAttack("fists");if(t.t==="melee")return this.meleeAttack(t.id);if(t.t!=="weapon"){(t.t==="money"||t.t==="bag")&&this.ui.toast("\u042D\u0442\u043E \u043D\u0435 \u043E\u0440\u0443\u0436\u0438\u0435","");return}let n=qt[t.id];if(t.mag<=0){this.fireCd=.35,this.ui.toast("\u041C\u0430\u0433\u0430\u0437\u0438\u043D \u043F\u0443\u0441\u0442! \u041F\u0435\u0440\u0435\u0437\u0430\u0440\u044F\u0434\u0438\u0441\u044C (\u0438\u043B\u0438 \u043A\u0443\u043F\u0438 \u043F\u0430\u0442\u0440\u043E\u043D\u044B)","bad"),this.sound.error(),(e.ammo[n.ammo]||0)>0&&this.startReload();return}t.mag--,this.fireCd=n.rate,this.recoil=Math.min(1.6,this.recoil+(t.id==="rifle"?.22:t.id==="shotgun"?.55:.35)),this.sound.shot(t.id==="rifle"?"rifle":t.id),this.muzzleFlash();let s=this.camera.getWorldDirection(new R);s.x+=(Math.random()-.5)*n.spread*2,s.y+=(Math.random()-.5)*n.spread*2,s.z+=(Math.random()-.5)*n.spread*2,s.normalize();let r=this.hitscan(n.dmg,n.range,s,!1);this.net.send({t:"e",k:"shot",v:t.id,p:[e.pos.x,e.pos.z]}),this.ui.renderHotbar(e.hotbar,e.selected,o=>this.selectSlot(o)),(r||Math.random()<.6)&&this.panicNearby(14),!this.alarmOn&&this.inBank(e.pos)&&this.npcs.some(a=>!a.dead&&(a.role==="guard"||a.role==="cashier")&&Ft(a.pos,e.pos)<16&&this.visionCheck(a.pos,a.yaw,e.pos,2.2,16))&&setTimeout(()=>this.triggerAlarm("shot"),700)}meleeAttack(e){var r;let t=this.player,n=qt[e]||qt.fists;if(t.stamina<6){this.ui.toast("\u041D\u0435\u0442 \u0441\u0438\u043B \u2014 \u043E\u0442\u0434\u044B\u0448\u0438\u0441\u044C","bad");return}t.stamina-=7,this.fireCd=n.rate,(r=this.localChar)==null||r.punch(),this.sound.punch();let s=this.camera.getWorldDirection(new R);this.hitscan(n.dmg,2.1,s,!0)}hitscan(e,t,n,s){let r=this.camera.position.clone(),o=null,a=t,c=null,l=new R;for(let h of this.npcs){if(h.dead||h.inactive)continue;l.set(h.pos.x,1.15,h.pos.z);let u=l.clone().sub(r),d=u.dot(n);if(d<.2||d>t)continue;if(u.clone().sub(n.clone().multiplyScalar(d)).length()<(s?.85:.6)&&d<a){if(this.colliders.blocked(r.x,r.z,l.x,l.z))continue;o=h,a=d,c=r.clone().add(n.clone().multiplyScalar(d))}}if(this.remote&&!o){l.set(this.remote.pos.x,1.15,this.remote.pos.z);let h=l.clone().sub(r),u=h.dot(n),d=h.clone().sub(n.clone().multiplyScalar(u)).length();u>.2&&u<t&&d<.7&&(c=r.clone().add(n.clone().multiplyScalar(u)),this.ui.log("\u042D\u0442\u043E \u0442\u0432\u043E\u0439 \u043D\u0430\u043F\u0430\u0440\u043D\u0438\u043A \u2014 \u043F\u043E \u0441\u0432\u043E\u0438\u043C \u043D\u0435 \u0441\u0442\u0440\u0435\u043B\u044F\u0435\u043C"),this.sound.hit())}if(o)return o.damage(e,!0),this.sound.hit(),c=c||r.clone().add(n.clone().multiplyScalar(a)),this.spawnSpark(c,12591136),this.ui.hitFlash(),o.dead?(this.addStars(o.role==="cop"?2:1),this.stats.kills++):(o.role==="guard"||o.role==="cop")&&this.addStars(1),o;if(!s){let h=r.clone().add(n.clone().multiplyScalar(Math.min(t,45)));this.spawnSpark(h,16765066),this.tracer(r.clone().add(new R(.2,-.12,0)).add(n.clone().multiplyScalar(.5)),h)}return null}muzzleFlash(){let e=this.muzzleLight;e&&(e.position.copy(this.camera.position).add(this.camera.getWorldDirection(new R).multiplyScalar(.8)),e.intensity=24,this.flashes.some(t=>t.persistent)||this.flashes.push({l:e,t:.06,persistent:!0}))}spawnSpark(e,t){let n=new tt(new kt(.07,6,5),new Wn({color:t}));n.position.copy(e),this.scene.add(n),this.flashes.push({l:n,t:.12,mesh:!0})}tracer(e,t){let n=new It().setFromPoints([e,t]),s=new Qs({color:16770720,transparent:!0,opacity:.85}),r=new Uo(n,s);this.scene.add(r),this.tracers.push({line:r,t:.07})}updateTracers(e){for(let t=this.tracers.length-1;t>=0;t--){let n=this.tracers[t];n.t-=e,n.line.material.opacity=Math.max(0,n.t/.07)*.85,n.t<=0&&(this.scene.remove(n.line),n.line.geometry.dispose(),n.line.material.dispose(),this.tracers.splice(t,1))}for(let t=this.flashes.length-1;t>=0;t--){let n=this.flashes[t];if(n.t-=e,n.mesh?n.l.scale.setScalar(Math.max(.01,n.t/.12)):n.l.intensity=Math.max(0,n.l.intensity*.72),n.t<=0){if(n.persistent){n.l.intensity=0,this.flashes.splice(t,1);continue}this.scene.remove(n.l),n.mesh&&(n.l.geometry.dispose(),n.l.material.dispose()),this.flashes.splice(t,1)}}}updateInteraction(e){var a;let t=this.player;if((a=this.intro)!=null&&a.active||!t.alive){this.ui.setPrompt(null);return}let n=[],s=(c,l,h,u,d)=>{let f=Ft(t.pos,l);f<h&&n.push({id:c,d:f,label:u,fn:d})},r=this.world;if(s("door",r.houseDoor.pos,2.6,r.houseDoor.open?"\u0417\u0430\u043A\u0440\u044B\u0442\u044C \u0434\u0432\u0435\u0440\u044C":"\u041E\u0442\u043A\u0440\u044B\u0442\u044C \u0434\u0432\u0435\u0440\u044C",()=>this.toggleHouseDoor()),r.lockers.forEach(c=>s("locker"+c.id,c.pos,2.4,`\u041E\u0442\u043A\u0440\u044B\u0442\u044C ${c.label}`,()=>this.openLocker(c.id))),r.bedSpots.forEach((c,l)=>s("bed"+l,c.wakePos,2.2,"\u041B\u0435\u0447\u044C \u0441\u043F\u0430\u0442\u044C (\u0432\u043E\u0441\u0441\u0442\u0430\u043D\u043E\u0432\u0438\u0442\u044C \u0441\u0438\u043B\u044B)",()=>this.sleepInBed())),s("shop",r.shopPoint,3.4,"\u041A\u0430\u0442\u0430\u043B\u043E\u0433 \u043E\u0440\u0443\u0436\u0438\u044F",()=>this.openShop()),s("seller",new R(r.sellerPos.x,0,r.sellerPos.z+1.4),2.6,"\u041F\u043E\u0433\u043E\u0432\u043E\u0440\u0438\u0442\u044C \u0441 \u043F\u0440\u043E\u0434\u0430\u0432\u0446\u043E\u043C",()=>this.talkSeller()),s("boss",r.dockBossPoint,3.2,this.job?"\u0420\u0430\u0431\u043E\u0442\u0430: \u0432\u0437\u044F\u0442\u044C \u044F\u0449\u0438\u043A":"\u0423\u0441\u0442\u0440\u043E\u0438\u0442\u044C\u0441\u044F \u043D\u0430 \u043F\u043E\u0434\u0440\u0430\u0431\u043E\u0442\u043A\u0443",()=>this.startJob()),this.carrying)s("truck",r.truckPoint,4,"\u041F\u043E\u0433\u0440\u0443\u0437\u0438\u0442\u044C \u044F\u0449\u0438\u043A \u0432 \u0433\u0440\u0443\u0437\u043E\u0432\u0438\u043A",()=>this.deliverBox());else if(this.job)for(let c of r.boxSpawns)c.taken||s("box"+c.id,c.pos,2.2,"\u0412\u0437\u044F\u0442\u044C \u044F\u0449\u0438\u043A",()=>this.takeBox(c));this.pendingOffer&&Ft(this.pendingOffer.pos,t.pos)<3&&s("offernpc",this.pendingOffer.pos,3.2,`\u0421\u043E\u0433\u043B\u0430\u0441\u0438\u0442\u044C\u0441\u044F: \u043F\u043E\u0434\u0440\u0430\u0431\u043E\u0442\u043A\u0430 ($${this.offerPay||0})`,()=>this.acceptOffer(this.pendingOffer)),s("cashier",this.world.cashierPos,3.4,"\u041F\u043E\u0433\u043E\u0432\u043E\u0440\u0438\u0442\u044C \u0441 \u043A\u0430\u0441\u0441\u0438\u0440\u043E\u043C",()=>this.talkCashier()),n.sort((c,l)=>c.d-l.d);let o=n[0];if(o?(this.currentPrompt=o,this.ui.setPrompt(`<b>${Ms()?"\u0414\u0415\u0419\u0421\u0422\u0412\u0418\u0415":"E"}</b> ${o.label}`)):(this.currentPrompt=null,this.ui.setPrompt(null)),this.ui.consumeInv()){this.openInventory();return}this.ui.consumeAct()&&o&&(this.sound.ui(),o.fn()),this.updateMoneyGrab(e)}updateMoneyGrab(e){var l;let t=this.player,n=this.world.bankMoney.filter(h=>!h.taken),s=null,r=99;for(let h of n){let u=Ft(t.pos,h.pos);u<2.6&&u<r&&(s=h,r=u)}let o=this.ui.input.act||this.ui.keys.has("act");if(!s){this.grabbing=!1,this.grabProgress=0,this.ui.setProgress(null);return}let a=((l=this.currentItem())==null?void 0:l.t)==="bag",c=a?30:15;o&&t.alive?(this.grabbing=!0,this.currentPrompt={id:"money"},this.grabProgress+=e/c,this.ui.setPrompt(`<b>\u0414\u0415\u0420\u0416\u0418</b> ${a?"\u0421\u043A\u043B\u0430\u0434\u044B\u0432\u0430\u0435\u0448\u044C \u0434\u0435\u043D\u044C\u0433\u0438 \u0432 \u0441\u0443\u043C\u043A\u0443":"\u0425\u0432\u0430\u0442\u0430\u0435\u0448\u044C \u043F\u0430\u0447\u043A\u0438 \u0440\u0443\u043A\u0430\u043C\u0438"} \xB7 ${Math.round(this.grabProgress*100)}%`),this.ui.setProgress(this.grabProgress,a?"\u0421\u0443\u043C\u043A\u0430: \u043D\u0430\u043F\u043E\u043B\u043D\u0435\u043D\u0438\u0435 30 \u0441\u0435\u043A":"\u0413\u043E\u043B\u044B\u0435 \u0440\u0443\u043A\u0438: 5 \u043F\u0430\u0447\u0435\u043A \u0437\u0430 15 \u0441\u0435\u043A"),this.grabProgress>=1&&(this.grabProgress=0,this.completeRobbery(a))):(this.grabbing=!1,this.grabProgress=Math.max(0,this.grabProgress-e*.5),this.ui.setProgress(null))}completeRobbery(e){let t=this.player;this.world.bankMoney.forEach(r=>{r.taken=!0,r.mesh.visible=!1}),this.moneyRespawnT=210,this.stats.robberies++,this.net.send({t:"e",k:"money"}),this.sound.cash();let s=this.currentItem();if(e&&s&&s.t==="bag"){let r=yf();s.cash=(s.cash||0)+r,this.ui.toast(`\u0412 \u0441\u0443\u043C\u043A\u0435 \u0442\u0435\u043F\u0435\u0440\u044C $${s.cash.toLocaleString("ru-RU")}`,"good"),this.ui.log("\u0421\u0443\u043C\u043A\u0430 \u043D\u0430\u0431\u0438\u0442\u0430. \u041E\u0442\u043A\u0440\u043E\u0439 \u0435\u0451 \u0432 \u0438\u043D\u0432\u0435\u043D\u0442\u0430\u0440\u0435 \u0438 \u0432\u044B\u0432\u0435\u0434\u0438 \u0434\u0435\u043D\u044C\u0433\u0438.")}else{let r=sh("money",{qty:5});hr(t.hotbar,r)?(this.ui.toast("5 \u043F\u0430\u0447\u0435\u043A \u0434\u0435\u043D\u0435\u0433 \u0443 \u0442\u0435\u0431\u044F \u0432 \u0438\u043D\u0432\u0435\u043D\u0442\u0430\u0440\u0435","good"),this.ui.log("\u041E\u0442\u043A\u0440\u043E\u0439 \u0438\u043D\u0432\u0435\u043D\u0442\u0430\u0440\u044C \u2192 \xAB\u041F\u0435\u0440\u0435\u0432\u0435\u0441\u0442\u0438 \u0432 \u0431\u0430\u043B\u0430\u043D\u0441\xBB")):this.ui.toast("\u041D\u0435\u0442 \u043C\u0435\u0441\u0442\u0430 \u0432 \u0440\u0443\u043A\u0430\u0445! \u041F\u0430\u0447\u043A\u0438 \u0432\u044B\u043F\u0430\u043B\u0438","bad")}this.ui.renderHotbar(t.hotbar,t.selected,r=>this.selectSlot(r)),this.addStars(2),this.triggerAlarm("robbery"),this.ui.setProgress(null)}toggleHouseDoor(){let e=this.world.houseDoor;e.open=!e.open,this.sound.door(),this.net.send({t:"e",k:"door",v:e.open}),e.open?this.ui.log("\u0414\u0432\u0435\u0440\u044C \u043E\u0442\u043A\u0440\u044B\u0442\u0430"):this.ui.log("\u0414\u0432\u0435\u0440\u044C \u0437\u0430\u043A\u0440\u044B\u0442\u0430 \u2014 \u043C\u043E\u0436\u043D\u043E \u0441\u043F\u0440\u044F\u0442\u0430\u0442\u044C\u0441\u044F")}sleepInBed(){let e=this.player;e.hp=Math.min(e.maxHp,e.hp+55),e.stamina=e.maxStamina,this.saveGame(),this.ui.toast("\u041F\u043E\u0441\u043F\u0430\u043B \xB7 \u0437\u0434\u043E\u0440\u043E\u0432\u044C\u0435 \u0432\u043E\u0441\u0441\u0442\u0430\u043D\u043E\u0432\u043B\u0435\u043D\u043E \xB7 \u0438\u0433\u0440\u0430 \u0441\u043E\u0445\u0440\u0430\u043D\u0435\u043D\u0430","good")}talkSeller(){this.ui.toast("\xAB\u0411\u0435\u0440\u0438 \u0441\u0442\u0432\u043E\u043B, \u043F\u0430\u0442\u0440\u043E\u043D\u044B \u0434\u0435\u0448\u0435\u0432\u043B\u0435 \u043D\u0435 \u0431\u0443\u0434\u0443\u0442\xBB","")}talkCashier(){if(this.playerArmed()){this.ui.toast("\u041A\u0430\u0441\u0441\u0438\u0440\u0448\u0430 \u0432 \u0443\u0436\u0430\u0441\u0435!","bad"),this.triggerAlarm("cashier");return}this.ui.toast("\xAB\u0418\u0437\u0432\u0438\u043D\u0438\u0442\u0435, \u0431\u0430\u043D\u043A \u0437\u0430\u043A\u0440\u044B\u0442 \u043D\u0430 \u0443\u0447\u0451\u0442\xBB","")}inBank(e){let t=this.world.bankInterior;return e.x>t.x1&&e.x<t.x2&&e.z>t.z1&&e.z<t.z2}addStars(e){let t=this.player;t.stars=Ot(t.stars+e,0,5),this.ui.setStats({stars:t.stars}),this.net.send({t:"e",k:"stars",v:t.stars}),t.stars>0&&!this.alarmOn&&this.spawnPolice(1)}triggerAlarm(e){this.alarmOn||(this.alarmOn=!0,this.world.alarmOn=!0,this.sound.siren(!0),this.ui.toast("\u26A0 \u0422\u0420\u0415\u0412\u041E\u0413\u0410! \u041F\u043E\u043B\u0438\u0446\u0438\u044F \u0432\u044B\u0435\u0445\u0430\u043B\u0430","bad"),this.ui.log("\u0421\u043C\u0430\u0442\u044B\u0432\u0430\u0439\u0441\u044F \u0441 \u043C\u0435\u0441\u0442\u0430 \u043F\u0440\u0435\u0441\u0442\u0443\u043F\u043B\u0435\u043D\u0438\u044F"),this.player.stars=Math.max(this.player.stars,2),this.ui.setStats({stars:this.player.stars}),this.net.send({t:"e",k:"alarm"}),this.spawnPolice(2))}calmDown(){this.alarmOn=!1,this.world.alarmOn=!1,this.sound.siren(!1)}spawnPolice(e){for(let t=0;t<e&&!(this.npcs.filter(c=>c.role==="cop").length>=4);t++){let s=this.player.pos.x,r=this.world.policeSpawns[t%this.world.policeSpawns.length],o=r.clone();o.x=Ot(s+(s>0?-34:34)+(t-.5)*6,-74,74),o.z=r.z;let a=new wn(this,{role:"cop",pos:o,yaw:0});a.path=null,this.npcs.push(a),this.ui.log("\u041F\u043E\u043B\u0438\u0446\u0438\u044F \u043F\u0440\u0438\u0431\u044B\u043B\u0430")}}markSeen(e,t){e===this.player?this.playerSeen=!0:this.remoteSeen=!0}nearestWantedPlayer(e){let t=this.player;return t.stars>0&&t.alive?{pos:t.pos,stars:t.stars,isRemote:!1}:this.remote&&(this.remoteStars||0)>0?{pos:this.remote.pos,stars:this.remoteStars,isRemote:!0}:null}updateWanted(e){let t=this.player;if(t.stars<=0){this.alarmOn&&this.calmDown(),this.unseen=0;return}this.playerSeen?this.unseen=0:this.unseen+=e;let r=t.pos.x>-16&&t.pos.x<-2&&t.pos.z>10&&t.pos.z<22&&!this.world.houseDoor.open?7:14;this.unseen>r&&(this.unseen=0,t.stars=Math.max(0,t.stars-1),this.ui.setStats({stars:t.stars}),this.ui.log(t.stars>0?`\u0420\u043E\u0437\u044B\u0441\u043A \u0441\u043D\u0438\u0436\u0435\u043D (${t.stars}\u2605)`:"\u0422\u0435\u0431\u044F \u043F\u043E\u0442\u0435\u0440\u044F\u043B\u0438 \u0438\u0437 \u0432\u0438\u0434\u0443. \u0427\u0438\u0441\u0442."),this.net.send({t:"e",k:"stars",v:t.stars}),t.stars===0&&this.calmDown())}copShootAt(e,t,n){this.sound.shot("pistol");let s=new R(e.pos.x,1.4,e.pos.z),r=new R(t.x+(Math.random()-.5)*.6,1.2,t.z+(Math.random()-.5)*.6);this.tracer(s,r),Math.random()<.72?n.isRemote?(this.net.send({t:"e",k:"rhurt",v:11}),this.spawnSpark(r,12591136)):this.hitPlayer(10+Math.random()*5,e):this.spawnSpark(r,16765066)}hitPlayer(e,t,n=null){let s=this.player;if(n&&n.isRemote){this.net.send({t:"e",k:"rhurt",v:e});return}if(s.alive){if(s.armor>0){let r=Math.min(s.armor,e*.6);s.armor-=r,e-=r}s.hp-=e,this.ui.hitFlash(),this.sound.hit(),s.hp<=0&&this.die()}}die(){let e=this.player;if(!e.alive)return;e.alive=!1,e.hp=0,this.state="dead",this.sound.error(),this.ui.hitFlash();for(let s=0;s<e.hotbar.length;s++)e.hotbar[s]=null;e.selected=0,e.stars=0,this.calmDown(),this.ui.renderHotbar(e.hotbar,e.selected,s=>this.selectSlot(s)),this.net.send({t:"e",k:"die"}),this.localChar.isDead=!0,this.localChar.root.visible=!1,this.ui.setProgress(null),this.ui.setPrompt(null);let t=Ye("div","dead",`
      <div style="font-size:42px">\u2620\uFE0F</div>
      <h2>\u0422\u042B \u041F\u041E\u0413\u0418\u0411</h2>
      <div style="font-size:12px;color:#b9b1a0;line-height:1.5">\u0418\u043D\u0432\u0435\u043D\u0442\u0430\u0440\u044C \u043F\u043E\u0442\u0435\u0440\u044F\u043D. \u0414\u0435\u043D\u044C\u0433\u0438 \u0438 \u0446\u0435\u043D\u043D\u043E\u0441\u0442\u0438 \u043B\u0443\u0447\u0448\u0435 \u0445\u0440\u0430\u043D\u0438\u0442\u044C \u0432 \u0448\u043A\u0430\u0444\u0443 \u0434\u043E\u043C\u0430.<br>\u041E\u0447\u043D\u0451\u0448\u044C\u0441\u044F \u043D\u0430 \u0441\u0432\u043E\u0435\u0439 \u043A\u0440\u043E\u0432\u0430\u0442\u0438 \u0447\u0435\u0440\u0435\u0437 \u043D\u0435\u0441\u043A\u043E\u043B\u044C\u043A\u043E \u0441\u0435\u043A\u0443\u043D\u0434.</div>`),n=Ye("button","btn wide","\u041E\u0427\u041D\u0423\u0422\u042C\u0421\u042F \u0421\u0415\u0419\u0427\u0410\u0421");n.onclick=()=>{this.ui.hideModal(),this.respawn()},this.ui.showModal({title:"\u0421\u041C\u0415\u0420\u0422\u042C",sub:"\u0413\u043E\u0440\u043E\u0434 \u0441\u0443\u0440\u043E\u0432\u044B\u0439. \u0412 \u0441\u043B\u0435\u0434\u0443\u044E\u0449\u0438\u0439 \u0440\u0430\u0437 \u043F\u0440\u044F\u0447\u044C\u0441\u044F \u043B\u0443\u0447\u0448\u0435.",body:t,foot:n}),setTimeout(()=>{this.state==="dead"&&(this.ui.hideModal(),this.respawn())},6e3)}respawn(){let e=this.player;e.alive=!0,e.hp=100,e.stamina=100,e.stars=0,e.pos.copy(this.spawnPoint),e.yaw=Math.PI*.7,e.pitch=0,this.localChar.isDead=!1,this.localChar.root.visible=!1,this.ui.setStats({hp:100,stamina:100,stars:0,money:e.money}),this.ui.renderHotbar(e.hotbar,e.selected,t=>this.selectSlot(t)),this.state="play",this.saveGame()}startJob(){let t=this.world.boxSpawns.filter(n=>!n.taken);if(!t.length){this.ui.toast("\u042F\u0449\u0438\u043A\u043E\u0432 \u043D\u0435\u0442 \u2014 \u043F\u0440\u0438\u0445\u043E\u0434\u0438 \u043F\u043E\u0437\u0436\u0435","");return}if(this.job){this.ui.toast("\u0421\u043D\u0430\u0447\u0430\u043B\u0430 \u043E\u0442\u043D\u0435\u0441\u0438 \u044F\u0449\u0438\u043A \u0432 \u0433\u0440\u0443\u0437\u043E\u0432\u0438\u043A","");return}this.job={pay:Math.floor(180+Math.random()*260),left:t.length,total:t.length},this.ui.toast(`\u0420\u0430\u0431\u043E\u0442\u0430: ${this.job.left} \u044F\u0449\u0438\u043A\u043E\u0432 \xB7 $${this.job.pay} \u0437\u0430 \u044F\u0449\u0438\u043A`,"good"),this.ui.setJob(`\u{1F4E6} \u041F\u041E\u0414\u0420\u0410\u0411\u041E\u0422\u041A\u0410 \xB7 \u044F\u0449\u0438\u043A\u043E\u0432: ${this.job.left} \xB7 $${this.job.pay} \u0437\u0430 \u044F\u0449\u0438\u043A`)}takeBox(e){if(!this.job||e.taken)return;e.taken=!0,e.mesh.visible=!1,this.carrying=e,this.ui.setJob(`\u{1F4E6} \u041D\u0435\u0441\u0438 \u044F\u0449\u0438\u043A \u0432 \u0433\u0440\u0443\u0437\u043E\u0432\u0438\u043A \xB7 $${this.job.pay}`),this.ui.toast("\u0412\u0437\u044F\u043B \u044F\u0449\u0438\u043A \u2014 \u0442\u0430\u0449\u0438 \u0432 \u0433\u0440\u0443\u0437\u043E\u0432\u0438\u043A",""),this.sound.pickup();let t=new tt(new ye(.5,.5,.5),new Ti({color:9069623,roughness:.9}));t.position.set(.1,-.42,-.62),t.rotation.set(.2,.3,.1),this.viewRoot.add(t),this.carryMesh=t}deliverBox(){if(!this.carrying||!this.job)return;let e=this.carrying;e.taken=!0,e.mesh.visible=!1,e.mesh.position.copy(this.world.truckPoint),this.clearCarry(),this.job.left--;let t=this.job.pay;if(this.player.money+=t,this.stats.jobs++,this.sound.cash(),this.ui.setStats({money:this.player.money}),this.ui.toast(`+$${t} \u0437\u0430 \u044F\u0449\u0438\u043A`,"good"),this.net.send({t:"e",k:"cash"}),this.job.left<=0){let n=Math.floor(t*1.2);this.player.money+=n,this.ui.toast(`\u0420\u0430\u0431\u043E\u0442\u0430 \u0441\u0434\u0435\u043B\u0430\u043D\u0430! \u0411\u043E\u043D\u0443\u0441 +$${n}`,"good"),this.ui.log("\u041F\u043E\u0434\u0440\u0430\u0431\u043E\u0442\u043A\u0430 \u0437\u0430\u043A\u0440\u044B\u0442\u0430. \u0417\u0430\u0433\u043B\u044F\u043D\u0438 \u0432 \u043C\u0430\u0433\u0430\u0437\u0438\u043D \u043E\u0440\u0443\u0436\u0438\u044F."),this.job=null,this.ui.setJob(null),this.ui.setStats({money:this.player.money}),this.world.boxSpawns.forEach(s=>{s.taken=!1,s.mesh.visible=!0})}else this.ui.setJob(`\u{1F4E6} \u041F\u041E\u0414\u0420\u0410\u0411\u041E\u0422\u041A\u0410 \xB7 \u043E\u0441\u0442\u0430\u043B\u043E\u0441\u044C: ${this.job.left} \xB7 $${this.job.pay}`);this.saveGame()}clearCarry(){this.carryMesh&&(this.viewRoot.remove(this.carryMesh),this.carryMesh.geometry.dispose(),this.carryMesh.material.dispose(),this.carryMesh=null),this.carrying=null}updateJobs(e){this.pendingOffer&&Ft(this.pendingOffer.pos,this.player.pos)>14&&(this.pendingOffer=null)}updateOffers(e){var o;if((o=this.intro)!=null&&o.active||(this.offersT-=e,this.offersT>0)||(this.offersT=55+Math.random()*55,this.job||this.pendingOffer))return;let t=this.ambientPool.filter(a=>!a.jobOffer&&!a.used);t.length||this.ambientPool.forEach(a=>{a.jobOffer||(a.used=!1)});let n=t[Math.floor(Math.random()*t.length)]||this.ambientPool[0];if(!n)return;n.used=!0;let s=this.player.pos,r=Math.random()*Math.PI*2;n.pos.set(s.x+Math.cos(r)*26,0,s.z+Math.sin(r)*26),this.colliders.resolve(n.pos,.4),Math.abs(n.pos.x)>90&&(n.pos.x*=.5),n.char.root.position.set(n.pos.x,0,n.pos.z),n.char.root.visible=!0,n.inactive=!1,n.jobOffer=!0,n.offerT=45,n.hostile=!1,this.offerPay=220+Math.floor(Math.random()*280),this.npcs.includes(n)||this.npcs.push(n),this.pendingOffer=null,n.say("\u042D\u0439! \u0420\u0430\u0431\u043E\u0442\u0451\u043D\u043A\u0430 \u0435\u0441\u0442\u044C\u2026",5),this.ui.toast("\u041F\u0440\u043E\u0445\u043E\u0436\u0438\u0439 \u0445\u043E\u0447\u0435\u0442 \u043F\u0440\u0435\u0434\u043B\u043E\u0436\u0438\u0442\u044C \u043F\u043E\u0434\u0440\u0430\u0431\u043E\u0442\u043A\u0443",""),this.ambientPool.includes(n)||this.ambientPool.push(n)}acceptOffer(e){e.jobOffer=!1,e.say("\u0422\u0430\u0449\u0438 \u044F\u0449\u0438\u043A\u0438 \u043A \u0433\u0440\u0443\u0437\u043E\u0432\u0438\u043A\u0443, \u0431\u0440\u0430\u0442.",4),this.pendingOffer=null,this.startJob()}visionCheck(e,t,n,s,r){if(Ft(e,n)>r)return!1;let a=Math.atan2(n.x-e.x,n.z-e.z);return!(Math.abs(ys(t,a))>s/2||this.colliders.blocked(e.x,e.z,n.x,n.z))}panicNearby(e){let t=0;for(let n of this.npcs)n.dead||n.role==="cop"||Ft(n.pos,this.player.pos)<e&&t<2&&(n.state="flee",n.fleeT=4,Math.random()<.6&&(n.say("\u0422\u0438\u043A\u0430\u0439! \u0421\u0442\u0432\u043E\u043B!",2),t++))}onNpcKilled(e,t){this.ui.log(e.role==="cop"?"\u0422\u044B \u0443\u0431\u0438\u043B \u043A\u043E\u043F\u0430. \u042D\u0442\u043E 2 \u0437\u0432\u0435\u0437\u0434\u044B.":"\u0422\u0440\u0443\u043F. +1 \u0437\u0432\u0435\u0437\u0434\u0430.")}netTick(e){if(this.lastNet+=e,this.lastNet<.07)return;this.lastNet=0;let t=this.player,n=this.camBob>.012;this.net.send({t:"s",p:[Math.round(t.pos.x*100)/100,Math.round(t.pos.y*100)/100,Math.round(t.pos.z*100)/100],y:Math.round(t.yaw*100)/100,v:n?3:0,w:this.currentWeaponId(),a:this.playerArmed()?1:0,st:t.stars,hp:Math.round(t.hp)})}onPeerOpen(){this.net.send({t:"hello",name:this.profile.name,skin:this.profile.skin,st:this.player.stars}),this.ui.setNet("\u041E\u041D\u041B\u0410\u0419\u041D \xB7 2/2 \u0438\u0433\u0440\u043E\u043A\u0430",!0)}onNet(e){var t,n,s,r;if(!(!e||!e.t))if(e.t==="hello")this._createRemote(e.skin||"gopnik",e.name||"\u0418\u0413\u0420\u041E\u041A 2"),this.net.send({t:"hello",name:this.profile.name,skin:this.profile.skin,st:this.player.stars}),(n=(t=this.net).enableVoice)==null||n.call(t),(r=(s=this.net)._tryCall)==null||r.call(s);else if(e.t==="s"){this.remote||this._createRemote("gopnik","\u0418\u0413\u0420\u041E\u041A 2");let o=this.remote;o.target.set(e.p[0],e.p[1],e.p[2]),o.yaw=e.y,o.speed=e.v,o.aim=!!e.a,o.stars=e.st||0,o.hp=e.hp,o.weapon!==e.w&&(o.weapon=e.w)}else e.t==="e"&&this.onNetEvent(e)}_createRemote(e,t){var r;this.remote&&this.scene.remove(this.remote.char.root);let n=this.world.bedSpots[this.bedIdx===0?1:0],s=new Ci(e);s.root.position.copy(n.pos),s.root.position.y=.6,s.root.rotation.y=n.yaw,(r=this.intro)!=null&&r.active&&s.lieDown(),this.scene.add(s.root),this.remote={char:s,name:t,skin:e,pos:n.pos.clone(),target:n.wakePos.clone(),yaw:n.yaw,speed:0,weapon:"fists",aim:!1,stars:0,hp:100},this.ui.toast(`${t} \u0432 \u043A\u043E\u043C\u043D\u0430\u0442\u0435`,"good"),this.ui.setNet("\u041E\u041D\u041B\u0410\u0419\u041D \xB7 2/2 \u0438\u0433\u0440\u043E\u043A\u0430",!0)}onNetEvent(e){switch(e.k){case"shot":{if(this.sound.shot(e.v==="shotgun"?"shotgun":e.v==="rifle"?"rifle":"pistol"),this.remote){let t=new R(this.remote.pos.x,1.4,this.remote.pos.z),n=new R(Math.sin(this.remote.yaw+Math.PI),0,Math.cos(this.remote.yaw+Math.PI));this.tracer(t,t.clone().add(n.multiplyScalar(18)))}break}case"door":this.world.houseDoor.open=!!e.v,this.sound.door();break;case"alarm":this.alarmOn=!0,this.world.alarmOn=!0,this.sound.siren(!0),this.spawnPolice(2),this.ui.toast("\u041D\u0430\u043F\u0430\u0440\u043D\u0438\u043A \u043F\u043E\u0434\u043D\u044F\u043B \u0442\u0440\u0435\u0432\u043E\u0433\u0443!","bad");break;case"stars":this.remoteStars=e.v;break;case"money":this.world.bankMoney.forEach(t=>{t.taken=!0,t.mesh.visible=!1}),this.moneyRespawnT=210;break;case"rhurt":this.player.alive&&this.hitPlayer(e.v,null);break;case"die":this.remote&&(this.remote.char.isDead=!0,this.ui.log("\u041D\u0430\u043F\u0430\u0440\u043D\u0438\u043A \u043F\u043E\u0433\u0438\u0431"));break;case"cash":this.sound.cash();break;case"respawn":this.remote&&(this.remote.char.isDead=!1);break}}selectSlot(e){let t=this.player;e<0||e>=vs||(t.selected=e,this.ui.renderHotbar(t.hotbar,t.selected,n=>this.selectSlot(n)),this._updateViewModel(),e>0&&t.hotbar[e]&&t.hotbar[e].t==="weapon"&&this.playerArmed()&&(this.inBank(t.pos)&&this.ui.log("\u041D\u0435 \u043F\u043E\u043A\u0430\u0437\u044B\u0432\u0430\u0439 \u0441\u0442\u0432\u043E\u043B \u0432 \u0431\u0430\u043D\u043A\u0435!"),this.panicNearby(9)))}_updateViewModel(){if(!this.viewRoot)return;let e=this.currentWeaponId();if(e!==this.viewWeaponId){for(this.viewWeaponId=e;this.viewRoot.children.length;){let t=this.viewRoot.children[0];if(t===this.carryMesh){this.viewRoot.remove(t);continue}this.viewRoot.remove(t)}if(e==="fists"){let t=new tt(new fs(.055,.1,3,7),new Ti({color:15119500,roughness:.7}));t.position.set(.02,-.05,.05),t.rotation.x=1.2,this.viewRoot.add(t)}else{let t=Ri(e);t.scale.setScalar(1.15),t.rotation.set(0,Math.PI*.5,0),t.position.set(.06,-.02,.16),this.viewRoot.add(t)}this.carryMesh&&this.viewRoot.add(this.carryMesh)}}openShop(e="weapons"){this.ui.showModal({title:"\u041E\u0420\u0423\u0416\u0415\u0419\u041D\u042B\u0419 \u041C\u0410\u0413\u0410\u0417\u0418\u041D",sub:"\xAB\u0412\u0441\u0451 \u0434\u043B\u044F \u0441\u0435\u0440\u044C\u0451\u0437\u043D\u044B\u0445 \u043B\u044E\u0434\u0435\u0439\xBB \xB7 \u043F\u0440\u043E\u0434\u0430\u0432\u0435\u0446 \u0441\u043C\u043E\u0442\u0440\u0438\u0442 \u043D\u0430 \u0442\u0435\u0431\u044F \u043A\u0430\u043A \u043D\u0430 \u0441\u0442\u0430\u0440\u043E\u0433\u043E \u043A\u043B\u0438\u0435\u043D\u0442\u0430",body:this.buildShop(e),foot:[this._closeBtn("\u0417\u0410\u041A\u0420\u042B\u0422\u042C")]})}buildShop(e){let t=Ye("div"),n=Ye("div","tabs"),s=(u,d)=>{let f=Ye("div","tab"+(e===u?" on":""),d);f.onclick=()=>{this.openShop(u)},n.appendChild(f)};s("weapons","\u041E\u0420\u0423\u0416\u0418\u0415"),s("ammo","\u041F\u0410\u0422\u0420\u041E\u041D\u042B"),s("gear","\u0421\u041D\u0410\u0420\u042F\u0416\u0415\u041D\u0418\u0415"),t.appendChild(n);let r=Ye("div","preview3d"),o=this._previewCanvas();r.appendChild(o),t.appendChild(r);let a=this,c=u=>{a._previewShow(u)},l=Ye("div","shopgrid"),h=this.player;if(e==="weapons")["pistol","shotgun","rifle","knife","baton"].forEach(u=>{let d=qt[u],f=Ye("div","itemcard");f.innerHTML=`<div class="nm">${d.icon} ${d.name}</div><div class="ds">${d.desc}</div>
          <div class="buyrow"><div class="pr">$${d.price}</div><button class="buysmall">\u041A\u0423\u041F\u0418\u0422\u042C</button></div>`,f.onmouseenter=()=>c(u),f.onclick=()=>c(u),f.querySelector("button").onclick=g=>{g.stopPropagation(),this.buyWeapon(u)},l.appendChild(f)});else if(e==="ammo")Object.keys(Qo).forEach(u=>{let d=Qo[u],f=h.ammo[u]||0,g=Ye("div","itemcard");g.innerHTML=`<div class="nm">\u{1F4E6} \u041F\u0430\u0442\u0440\u043E\u043D\u044B ${u} \xD730</div>
          <div class="ds">\u0417\u0430\u043F\u0430\u0441: <b style="color:#ffd88a">${f}</b> \u0448\u0442. \u0414\u0435\u0448\u0451\u0432\u044B\u0435 \u2014 \u043D\u0435 \u0436\u0430\u043B\u0435\u0439.</div>
          <div class="buyrow"><div class="pr">$${d*3}</div><button class="buysmall">\u041A\u0423\u041F\u0418\u0422\u042C 30</button></div>`,g.querySelector("button").onclick=()=>this.buyAmmo(u),l.appendChild(g)});else{let u=Ye("div","itemcard");u.innerHTML=`<div class="nm">\u{1F392} \u0421\u0443\u043C\u043A\u0430 \u0434\u043B\u044F \u0434\u0435\u043D\u0435\u0433</div>
        <div class="ds">\u0412\u043C\u0435\u0449\u0430\u0435\u0442 \u043A\u0443\u0447\u0443 \u043D\u0430\u043B\u0438\u0447\u043A\u0438. \u041D\u0430\u0434\u0435\u0432\u0430\u0435\u0448\u044C \u0432 \u0440\u0443\u043A\u0438 \u2014 \u0432 \u0431\u0430\u043D\u043A\u0435 \u0441\u043E\u0431\u0438\u0440\u0430\u0435\u0448\u044C 30 \u0441\u0435\u043A \u0432\u043C\u0435\u0441\u0442\u043E 15, \u0437\u0430\u0442\u043E \u0441\u0443\u043C\u043C\u0430 \u0432 \u0440\u0430\u0437\u044B \u0431\u043E\u043B\u044C\u0448\u0435.</div>
        <div class="buyrow"><div class="pr">$450</div><button class="buysmall">\u041A\u0423\u041F\u0418\u0422\u042C</button></div>`,u.onmouseenter=()=>c("bag"),u.querySelector("button").onclick=()=>this.buyBag(),l.appendChild(u);let d=Ye("div","itemcard");d.innerHTML=`<div class="nm">\u{1F9BA} \u0411\u0440\u043E\u043D\u0435\u0436\u0438\u043B\u0435\u0442</div><div class="ds">\u0413\u0430\u0441\u0438\u0442 60% \u0443\u0440\u043E\u043D\u0430, \u043F\u043E\u043A\u0430 \u043D\u0435 \u0440\u0430\u0437\u043E\u0431\u044C\u044E\u0442. \u041F\u043E\u043B\u0438\u0446\u0438\u044F \u043E\u0446\u0435\u043D\u0438\u0442.</div>
        <div class="buyrow"><div class="pr">$600</div><button class="buysmall">\u041A\u0423\u041F\u0418\u0422\u042C</button></div>`,d.querySelector("button").onclick=()=>this.buyArmor(),l.appendChild(d)}return t.appendChild(l),t.appendChild(Ye("div","hintrow",`\u0422\u0432\u043E\u0439 \u0431\u0430\u043B\u0430\u043D\u0441: <b style="color:#8ee08a">$${this.player.money.toLocaleString("ru-RU")}</b> \xB7 \u041A\u0443\u043F\u043B\u0435\u043D\u043D\u043E\u0435 \u043F\u0430\u0434\u0430\u0435\u0442 \u0432 \u0438\u043D\u0432\u0435\u043D\u0442\u0430\u0440\u044C (\u043D\u0438\u0437 \u044D\u043A\u0440\u0430\u043D\u0430)`)),c(e==="gear"?"bag":"pistol"),t}buyWeapon(e){let t=qt[e],n=this.player;if(n.money<t.price){this.ui.toast("\u041D\u0435 \u0445\u0432\u0430\u0442\u0430\u0435\u0442 \u0434\u0435\u043D\u0435\u0433","bad"),this.sound.error();return}let s=mf(e);if(!hr(n.hotbar,s)){this.ui.toast("\u0418\u043D\u0432\u0435\u043D\u0442\u0430\u0440\u044C \u043F\u043E\u043B\u043E\u043D \u2014 \u043E\u0441\u0432\u043E\u0431\u043E\u0434\u0438 \u044F\u0447\u0435\u0439\u043A\u0443","bad");return}n.money-=t.price,this.sound.cash(),this.ui.toast(`\u041A\u0443\u043F\u043B\u0435\u043D\u043E: ${t.name}`,"good"),this.ui.setStats({money:n.money}),this.ui.renderHotbar(n.hotbar,n.selected,r=>this.selectSlot(r)),this.openShop("weapons"),this.saveGame()}buyAmmo(e){let t=this.player,n=Qo[e]*3;if(t.money<n){this.ui.toast("\u041D\u0435 \u0445\u0432\u0430\u0442\u0430\u0435\u0442 \u0434\u0435\u043D\u0435\u0433","bad"),this.sound.error();return}t.money-=n,t.ammo[e]=(t.ammo[e]||0)+30,this.sound.cash(),this.ui.toast(`+30 \u043F\u0430\u0442\u0440\u043E\u043D\u043E\u0432 ${e} (\u0432\u0441\u0435\u0433\u043E ${t.ammo[e]})`,"good"),this.ui.setStats({money:t.money}),this.openShop("ammo"),this.saveGame()}buyBag(){let e=this.player;if(e.money<450){this.ui.toast("\u041D\u0435 \u0445\u0432\u0430\u0442\u0430\u0435\u0442 \u0434\u0435\u043D\u0435\u0433","bad"),this.sound.error();return}if(!hr(e.hotbar,sh("bag"))){this.ui.toast("\u0418\u043D\u0432\u0435\u043D\u0442\u0430\u0440\u044C \u043F\u043E\u043B\u043E\u043D","bad");return}e.money-=450,this.sound.cash(),this.ui.toast("\u0421\u0443\u043C\u043A\u0430 \u043A\u0443\u043F\u043B\u0435\u043D\u0430 \xB7 \u0432\u044B\u0431\u0435\u0440\u0438 \u0435\u0451 \u0432 \u0441\u043B\u043E\u0442\u0430\u0445","good"),this.ui.setStats({money:e.money}),this.ui.renderHotbar(e.hotbar,e.selected,t=>this.selectSlot(t)),this.openShop("gear"),this.saveGame()}buyArmor(){let e=this.player;if(e.money<600){this.ui.toast("\u041D\u0435 \u0445\u0432\u0430\u0442\u0430\u0435\u0442 \u0434\u0435\u043D\u0435\u0433","bad");return}e.money-=600,e.armor=100,this.sound.cash(),this.ui.toast("\u0411\u0440\u043E\u043D\u0435\u0436\u0438\u043B\u0435\u0442 \u043D\u0430\u0434\u0435\u0442","good"),this.ui.setStats({money:e.money}),this.openShop("gear"),this.saveGame()}_previewCanvas(){return this._previewInit().canvas}_previewInit(){if(this.pv)return this.pv;let e=document.createElement("canvas");e.width=560,e.height=240;let t=new Zs({canvas:e,antialias:!0,alpha:!0});t.setPixelRatio(1),t.setSize(560,240,!1);let n=new js,s=new Ut(36,560/240,.05,30);s.position.set(.85,.5,.95),s.lookAt(0,.03,0),n.add(new or(16777215,4210768,2.6));let r=new gs(16769720,2.6);r.position.set(2,3,2),n.add(r);let o=new gs(8956671,1.2);return o.position.set(-2,1,-2),n.add(o),this.pv={r:t,sc:n,cam:s,model:null,canvas:e},this.pv}_previewShow(e){let t=this._previewInit();t.model&&t.sc.remove(t.model);let n=Ri(e),r=new yn().setFromObject(n).getSize(new R).length();n.scale.setScalar(1.6/Math.max(.4,r)),n.position.set(0,.05,0),t.sc.add(n),t.model=n,t.spin=0}renderPreview(e){let t=this.pv;!t||!t.canvas.isConnected||(t.spin+=e*.6,t.model&&(t.model.rotation.y=t.spin*.5+.6),t.r.setSize(t.canvas.clientWidth||560,t.canvas.clientHeight||240,!1),t.r.render(t.sc,t.cam))}openLocker(e){let t=this.lockers[e],n=(c,l)=>{let h=Ye("div","tab"+(e===l?" on":""),c);return h.onclick=()=>this.openLocker(l),h},s=Ye("div"),r=Ye("div","tabs");r.appendChild(n("\u0428\u0410\u0424 1","lockerA")),r.appendChild(n("\u0428\u0410\u0424 2","lockerB")),s.appendChild(r),s.appendChild(Ye("div","hintrow","\u041D\u0430\u0436\u043C\u0438 \u043D\u0430 \u0432\u0435\u0449\u044C \u0432 \u0448\u043A\u0430\u0444\u0443 \u2014 \u0437\u0430\u0431\u0440\u0430\u0442\u044C. \u041D\u0430\u0436\u043C\u0438 \u043D\u0430 \u0432\u0435\u0449\u044C \u0432 \u0438\u043D\u0432\u0435\u043D\u0442\u0430\u0440\u0435 \u2014 \u043F\u043E\u043B\u043E\u0436\u0438\u0442\u044C. \u0412\u0441\u0451 \u0441\u043E\u0445\u0440\u0430\u043D\u044F\u0435\u0442\u0441\u044F."));let o=Ye("div","grid15");for(let c=0;c<ci;c++){let l=t[c],h=Ye("div","gslot",l?Pi(l):"");l&&(l.t==="money"&&(h.innerHTML+=`<span class="qty">\xD7${l.qty}</span>`),l.t==="weapon"&&(h.innerHTML+=`<span class="qty">${l.mag}</span>`),h.title=bs(l),h.onclick=()=>{hr(this.player.hotbar,l)?(t[c]=null,this.ui.toast(`\u0412\u0437\u044F\u043B: ${bs(l)}`,"good"),this.ui.renderHotbar(this.player.hotbar,this.player.selected,u=>this.selectSlot(u)),this.openLocker(e),this.saveGame()):this.ui.toast("\u0420\u0443\u043A\u0438 \u0437\u0430\u043D\u044F\u0442\u044B \u2014 \u043E\u0441\u0432\u043E\u0431\u043E\u0434\u0438 \u044F\u0447\u0435\u0439\u043A\u0443","bad")}),o.appendChild(h)}s.appendChild(Ye("div","hintrow","\u042F\u0447\u0435\u0439\u043A\u0438 \u0448\u043A\u0430\u0444\u0430:")),s.appendChild(o),s.appendChild(Ye("div","hintrow","<b>\u0422\u0432\u043E\u0439 \u0438\u043D\u0432\u0435\u043D\u0442\u0430\u0440\u044C:</b>"));let a=Ye("div","grid15");for(let c=0;c<vs;c++){let l=c===0?null:this.player.hotbar[c],h=Ye("div","gslot",l?Pi(l):c===0?"\u{1F44A}":"");l&&(h.title=bs(l),h.onclick=()=>{let u=t.findIndex(d=>!d);if(u<0){this.ui.toast("\u0428\u043A\u0430\u0444 \u043F\u043E\u043B\u043E\u043D","bad");return}t[u]=l,this.player.hotbar[c]=null,this.ui.toast(`\u041F\u043E\u043B\u043E\u0436\u0438\u043B: ${bs(l)}`,"good"),this.ui.renderHotbar(this.player.hotbar,this.player.selected,d=>this.selectSlot(d)),this.openLocker(e),this.saveGame()}),a.appendChild(h)}s.appendChild(a),this.ui.showModal({title:"\u0428\u041A\u0410\u0424",sub:"\u0417\u0434\u0435\u0441\u044C \u0432\u0435\u0449\u0438 \u043F\u0435\u0440\u0435\u0436\u0438\u0432\u0443\u0442 \u0442\u0432\u043E\u044E \u0441\u043C\u0435\u0440\u0442\u044C. 15 \u044F\u0447\u0435\u0435\u043A.",body:s,foot:[this._closeBtn("\u0417\u0410\u041A\u0420\u042B\u0422\u042C")]})}openInventory(){let e=this.player,t=Ye("div"),n=Ye("div","grid15");for(let o=0;o<vs;o++){let a=o===0?null:e.hotbar[o],c=Ye("div","gslot"+(e.selected===o?" sel":""),o===0?"\u{1F44A}":a?Pi(a):"");c.onclick=()=>{e.selected=o,this.selectSlot(o),this.openInventory()},a&&(a.t==="money"&&(c.innerHTML+=`<span class="qty">\xD7${a.qty}</span>`),a.t==="weapon"&&(c.innerHTML+=`<span class="qty">${a.mag}</span>`)),n.appendChild(c)}t.appendChild(Ye("div","hintrow","\u0421\u043B\u043E\u0442\u044B \u0432 \u0440\u0443\u043A\u0430\u0445 (\u043D\u0438\u0437 \u044D\u043A\u0440\u0430\u043D\u0430). \u041A\u0443\u043B\u0430\u043A \u0432\u0441\u0435\u0433\u0434\u0430 \u043F\u0435\u0440\u0432\u044B\u0439.")),t.appendChild(n);let s=e.selected===0?null:e.hotbar[e.selected],r=Ye("div","itemcard");if(r.style.marginTop="10px",r.innerHTML=`<div class="nm">${Pi(s)} ${bs(s)}</div>
      <div class="ds">${gf(s)}</div>`,s&&s.t==="money"){let o=Ye("button","buysmall","\u041F\u0415\u0420\u0415\u0412\u0415\u0421\u0422\u0418 \u0412 \u0411\u0410\u041B\u0410\u041D\u0421");o.onclick=()=>this.convertMoney(s),r.appendChild(o)}if(s&&s.t==="bag"){let o=Ye("button","buysmall",`\u041E\u0422\u041A\u0420\u042B\u0422\u042C \u0421\u0423\u041C\u041A\u0423 ($${s.cash||0})`);o.onclick=()=>this.openBag(s),r.appendChild(o)}if(s&&s.t==="weapon"){let o=qt[s.id];r.appendChild(Ye("div","hintrow",`\u0412 \u043C\u0430\u0433\u0430\u0437\u0438\u043D\u0435: ${s.mag}/${o.mag} \xB7 \u0437\u0430\u043F\u0430\u0441: ${e.ammo[o.ammo]||0} \u043F\u0430\u0442\u0440\u043E\u043D\u043E\u0432 ${o.ammo}`))}t.appendChild(r),t.appendChild(Ye("div","hintrow",`\u0411\u0430\u043B\u0430\u043D\u0441: <b style="color:#8ee08a">$${e.money.toLocaleString("ru-RU")}</b>`)),this.ui.showModal({title:"\u0418\u041D\u0412\u0415\u041D\u0422\u0410\u0420\u042C",sub:"\u041F\u0435\u0440\u0435\u0437\u0430\u0440\u044F\u0434\u043A\u0430, \u0434\u0435\u043D\u044C\u0433\u0438 \u0438 \u0432\u0441\u0451, \u0447\u0442\u043E \u043D\u0430\u0436\u0438\u043B",body:t,foot:[this._closeBtn("\u0417\u0410\u041A\u0420\u042B\u0422\u042C")]})}convertMoney(e){let t=this.player,n=0;for(let r=0;r<e.qty;r++)n+=_f();t.money+=n,e.qty=0;let s=t.hotbar.indexOf(e);s>0&&(t.hotbar[s]=null),t.selected=0,this.sound.cash(),this.ui.toast(`\u041F\u0435\u0440\u0435\u0432\u0435\u0434\u0435\u043D\u043E +$${n.toLocaleString("ru-RU")}`,"good"),this.ui.setStats({money:t.money}),this.ui.renderHotbar(t.hotbar,t.selected,r=>this.selectSlot(r)),this._updateViewModel(),this.saveGame(),this.ui.hideModal()}openBag(e){let t=this.player,n=Ye("div");n.appendChild(Ye("div","moneybig",`$${(e.cash||0).toLocaleString("ru-RU")}`)),n.appendChild(Ye("div","hintrow","\u0421\u043A\u043E\u043B\u044C\u043A\u043E \u0432\u044B\u0432\u0435\u0441\u0442\u0438 \u043D\u0430 \u0431\u0430\u043B\u0430\u043D\u0441? \u041E\u0441\u0442\u0430\u043B\u044C\u043D\u043E\u0435 \u043E\u0441\u0442\u0430\u043D\u0435\u0442\u0441\u044F \u0432 \u0441\u0443\u043C\u043A\u0435."));let s=document.createElement("input");s.type="range",s.min=0,s.max=Math.max(0,e.cash||0),s.value=Math.floor((e.cash||0)/2);let r=Ye("div","kv",`<span>\u041A \u0432\u044B\u0432\u043E\u0434\u0443</span><b>$${Number(s.value).toLocaleString("ru-RU")}</b>`);s.oninput=()=>{r.innerHTML=`<span>\u041A \u0432\u044B\u0432\u043E\u0434\u0443</span><b>$${Number(s.value).toLocaleString("ru-RU")}</b>`},n.appendChild(s),n.appendChild(r);let o=Ye("button","btn","\u0412\u0421\u0415");o.onclick=()=>{s.value=e.cash||0,s.oninput()};let a=Ye("button","btn","\u041F\u0415\u0420\u0415\u0412\u0415\u0421\u0422\u0418");a.onclick=()=>{let l=Ot(Number(s.value)||0,0,e.cash||0);e.cash=(e.cash||0)-l,t.money+=l,this.sound.cash(),this.ui.toast(`\u0412\u044B\u0432\u0435\u0434\u0435\u043D\u043E +$${l.toLocaleString("ru-RU")}`,"good"),this.ui.setStats({money:t.money}),this.saveGame(),this.openBag(e)};let c=Ye("div","btn-row");c.appendChild(o),c.appendChild(a),n.appendChild(c),this.ui.showModal({title:"\u0421\u0423\u041C\u041A\u0410",sub:"\u041D\u0430\u043B\u0438\u0447\u043A\u0430 \u0438\u0437 \u0431\u0430\u043D\u043A\u0430",body:n,foot:[this._closeBtn("\u0417\u0410\u041A\u0420\u042B\u0422\u042C")]})}_closeBtn(e){let t=Ye("button","btn",e);return t.onclick=()=>{this.ui.hideModal(),this.sound.ui()},t}openPause(){var e;this.pauseOpen=!0,this.ui.showPause(),(e=document.exitPointerLock)==null||e.call(document)}saveGame(){if(!this.player||this.state==="menu"||this.state==="boot")return;let e=this.player,t=oh();t.money=Math.round(e.money),t.hotbar=JSON.parse(JSON.stringify(e.hotbar)),t.ammo={...e.ammo},t.lockers=JSON.parse(JSON.stringify(this.lockers||{})),t.hp=Math.round(e.hp),t.pos=[Math.round(e.pos.x*10)/10,Math.round(e.pos.z*10)/10],t.stars=e.stars,t.stats=this.stats,vf(t)}exitToMenu(){this.saveGame(),this.sound.siren(!1),this.state="menu",this.ui.hideModal(),this.ui.hidePause(),this.pauseOpen=!1,this.ui.showMenu();try{this.net.hangup()}catch{}location.reload()}};var ah=class{constructor(){this.encoder=new TextEncoder,this._pieces=[],this._parts=[]}append_buffer(e){this.flush(),this._parts.push(e)}append(e){this._pieces.push(e)}flush(){if(this._pieces.length>0){let e=new Uint8Array(this._pieces);this._parts.push(e),this._pieces=[]}}toArrayBuffer(){let e=[];for(let t of this._parts)e.push(t);return Wx(e).buffer}};function Wx(i){let e=0;for(let s of i)e+=s.byteLength;let t=new Uint8Array(e),n=0;for(let s of i){let r=new Uint8Array(s.buffer,s.byteOffset,s.byteLength);t.set(r,n),n+=s.byteLength}return t}function hh(i){return new ch(i).unpack()}function uh(i){let e=new lh,t=e.pack(i);return t instanceof Promise?t.then(()=>e.getBuffer()):e.getBuffer()}var ch=class{constructor(e){this.index=0,this.dataBuffer=e,this.dataView=new Uint8Array(this.dataBuffer),this.length=this.dataBuffer.byteLength}unpack(){let e=this.unpack_uint8();if(e<128)return e;if((e^224)<32)return(e^224)-32;let t;if((t=e^160)<=15)return this.unpack_raw(t);if((t=e^176)<=15)return this.unpack_string(t);if((t=e^144)<=15)return this.unpack_array(t);if((t=e^128)<=15)return this.unpack_map(t);switch(e){case 192:return null;case 193:return;case 194:return!1;case 195:return!0;case 202:return this.unpack_float();case 203:return this.unpack_double();case 204:return this.unpack_uint8();case 205:return this.unpack_uint16();case 206:return this.unpack_uint32();case 207:return this.unpack_uint64();case 208:return this.unpack_int8();case 209:return this.unpack_int16();case 210:return this.unpack_int32();case 211:return this.unpack_int64();case 212:return;case 213:return;case 214:return;case 215:return;case 216:return t=this.unpack_uint16(),this.unpack_string(t);case 217:return t=this.unpack_uint32(),this.unpack_string(t);case 218:return t=this.unpack_uint16(),this.unpack_raw(t);case 219:return t=this.unpack_uint32(),this.unpack_raw(t);case 220:return t=this.unpack_uint16(),this.unpack_array(t);case 221:return t=this.unpack_uint32(),this.unpack_array(t);case 222:return t=this.unpack_uint16(),this.unpack_map(t);case 223:return t=this.unpack_uint32(),this.unpack_map(t)}}unpack_uint8(){let e=this.dataView[this.index]&255;return this.index++,e}unpack_uint16(){let e=this.read(2),t=(e[0]&255)*256+(e[1]&255);return this.index+=2,t}unpack_uint32(){let e=this.read(4),t=((e[0]*256+e[1])*256+e[2])*256+e[3];return this.index+=4,t}unpack_uint64(){let e=this.read(8),t=((((((e[0]*256+e[1])*256+e[2])*256+e[3])*256+e[4])*256+e[5])*256+e[6])*256+e[7];return this.index+=8,t}unpack_int8(){let e=this.unpack_uint8();return e<128?e:e-256}unpack_int16(){let e=this.unpack_uint16();return e<32768?e:e-65536}unpack_int32(){let e=this.unpack_uint32();return e<2**31?e:e-2**32}unpack_int64(){let e=this.unpack_uint64();return e<2**63?e:e-2**64}unpack_raw(e){if(this.length<this.index+e)throw new Error(`BinaryPackFailure: index is out of range ${this.index} ${e} ${this.length}`);let t=this.dataBuffer.slice(this.index,this.index+e);return this.index+=e,t}unpack_string(e){let t=this.read(e),n=0,s="",r,o;for(;n<e;)r=t[n],r<160?(o=r,n++):(r^192)<32?(o=(r&31)<<6|t[n+1]&63,n+=2):(r^224)<16?(o=(r&15)<<12|(t[n+1]&63)<<6|t[n+2]&63,n+=3):(o=(r&7)<<18|(t[n+1]&63)<<12|(t[n+2]&63)<<6|t[n+3]&63,n+=4),s+=String.fromCodePoint(o);return this.index+=e,s}unpack_array(e){let t=new Array(e);for(let n=0;n<e;n++)t[n]=this.unpack();return t}unpack_map(e){let t={};for(let n=0;n<e;n++){let s=this.unpack();t[s]=this.unpack()}return t}unpack_float(){let e=this.unpack_uint32(),t=e>>31,n=(e>>23&255)-127,s=e&8388607|8388608;return(t===0?1:-1)*s*2**(n-23)}unpack_double(){let e=this.unpack_uint32(),t=this.unpack_uint32(),n=e>>31,s=(e>>20&2047)-1023,o=(e&1048575|1048576)*2**(s-20)+t*2**(s-52);return(n===0?1:-1)*o}read(e){let t=this.index;if(t+e<=this.length)return this.dataView.subarray(t,t+e);throw new Error("BinaryPackFailure: read index out of range")}},lh=class{getBuffer(){return this._bufferBuilder.toArrayBuffer()}pack(e){if(typeof e=="string")this.pack_string(e);else if(typeof e=="number")Math.floor(e)===e?this.pack_integer(e):this.pack_double(e);else if(typeof e=="boolean")e===!0?this._bufferBuilder.append(195):e===!1&&this._bufferBuilder.append(194);else if(e===void 0)this._bufferBuilder.append(192);else if(typeof e=="object")if(e===null)this._bufferBuilder.append(192);else{let t=e.constructor;if(e instanceof Array){let n=this.pack_array(e);if(n instanceof Promise)return n.then(()=>this._bufferBuilder.flush())}else if(e instanceof ArrayBuffer)this.pack_bin(new Uint8Array(e));else if("BYTES_PER_ELEMENT"in e){let n=e;this.pack_bin(new Uint8Array(n.buffer,n.byteOffset,n.byteLength))}else if(e instanceof Date)this.pack_string(e.toString());else{if(e instanceof Blob)return e.arrayBuffer().then(n=>{this.pack_bin(new Uint8Array(n)),this._bufferBuilder.flush()});if(t==Object||t.toString().startsWith("class")){let n=this.pack_object(e);if(n instanceof Promise)return n.then(()=>this._bufferBuilder.flush())}else throw new Error(`Type "${t.toString()}" not yet supported`)}}else throw new Error(`Type "${typeof e}" not yet supported`);this._bufferBuilder.flush()}pack_bin(e){let t=e.length;if(t<=15)this.pack_uint8(160+t);else if(t<=65535)this._bufferBuilder.append(218),this.pack_uint16(t);else if(t<=4294967295)this._bufferBuilder.append(219),this.pack_uint32(t);else throw new Error("Invalid length");this._bufferBuilder.append_buffer(e)}pack_string(e){let t=this._textEncoder.encode(e),n=t.length;if(n<=15)this.pack_uint8(176+n);else if(n<=65535)this._bufferBuilder.append(216),this.pack_uint16(n);else if(n<=4294967295)this._bufferBuilder.append(217),this.pack_uint32(n);else throw new Error("Invalid length");this._bufferBuilder.append_buffer(t)}pack_array(e){let t=e.length;if(t<=15)this.pack_uint8(144+t);else if(t<=65535)this._bufferBuilder.append(220),this.pack_uint16(t);else if(t<=4294967295)this._bufferBuilder.append(221),this.pack_uint32(t);else throw new Error("Invalid length");let n=s=>{if(s<t){let r=this.pack(e[s]);return r instanceof Promise?r.then(()=>n(s+1)):n(s+1)}};return n(0)}pack_integer(e){if(e>=-32&&e<=127)this._bufferBuilder.append(e&255);else if(e>=0&&e<=255)this._bufferBuilder.append(204),this.pack_uint8(e);else if(e>=-128&&e<=127)this._bufferBuilder.append(208),this.pack_int8(e);else if(e>=0&&e<=65535)this._bufferBuilder.append(205),this.pack_uint16(e);else if(e>=-32768&&e<=32767)this._bufferBuilder.append(209),this.pack_int16(e);else if(e>=0&&e<=4294967295)this._bufferBuilder.append(206),this.pack_uint32(e);else if(e>=-2147483648&&e<=2147483647)this._bufferBuilder.append(210),this.pack_int32(e);else if(e>=-9223372036854776e3&&e<=9223372036854776e3)this._bufferBuilder.append(211),this.pack_int64(e);else if(e>=0&&e<=18446744073709552e3)this._bufferBuilder.append(207),this.pack_uint64(e);else throw new Error("Invalid integer")}pack_double(e){let t=0;e<0&&(t=1,e=-e);let n=Math.floor(Math.log(e)/Math.LN2),s=e/2**n-1,r=Math.floor(s*2**52),o=2**32,a=t<<31|n+1023<<20|r/o&1048575,c=r%o;this._bufferBuilder.append(203),this.pack_int32(a),this.pack_int32(c)}pack_object(e){let t=Object.keys(e),n=t.length;if(n<=15)this.pack_uint8(128+n);else if(n<=65535)this._bufferBuilder.append(222),this.pack_uint16(n);else if(n<=4294967295)this._bufferBuilder.append(223),this.pack_uint32(n);else throw new Error("Invalid length");let s=r=>{if(r<t.length){let o=t[r];if(e.hasOwnProperty(o)){this.pack(o);let a=this.pack(e[o]);if(a instanceof Promise)return a.then(()=>s(r+1))}return s(r+1)}};return s(0)}pack_uint8(e){this._bufferBuilder.append(e)}pack_uint16(e){this._bufferBuilder.append(e>>8),this._bufferBuilder.append(e&255)}pack_uint32(e){let t=e&4294967295;this._bufferBuilder.append((t&4278190080)>>>24),this._bufferBuilder.append((t&16711680)>>>16),this._bufferBuilder.append((t&65280)>>>8),this._bufferBuilder.append(t&255)}pack_uint64(e){let t=e/4294967296,n=e%2**32;this._bufferBuilder.append((t&4278190080)>>>24),this._bufferBuilder.append((t&16711680)>>>16),this._bufferBuilder.append((t&65280)>>>8),this._bufferBuilder.append(t&255),this._bufferBuilder.append((n&4278190080)>>>24),this._bufferBuilder.append((n&16711680)>>>16),this._bufferBuilder.append((n&65280)>>>8),this._bufferBuilder.append(n&255)}pack_int8(e){this._bufferBuilder.append(e&255)}pack_int16(e){this._bufferBuilder.append((e&65280)>>8),this._bufferBuilder.append(e&255)}pack_int32(e){this._bufferBuilder.append(e>>>24&255),this._bufferBuilder.append((e&16711680)>>>16),this._bufferBuilder.append((e&65280)>>>8),this._bufferBuilder.append(e&255)}pack_int64(e){let t=Math.floor(e/4294967296),n=e%2**32;this._bufferBuilder.append((t&4278190080)>>>24),this._bufferBuilder.append((t&16711680)>>>16),this._bufferBuilder.append((t&65280)>>>8),this._bufferBuilder.append(t&255),this._bufferBuilder.append((n&4278190080)>>>24),this._bufferBuilder.append((n&16711680)>>>16),this._bufferBuilder.append((n&65280)>>>8),this._bufferBuilder.append(n&255)}constructor(){this._bufferBuilder=new ah,this._textEncoder=new TextEncoder}};var Mf=!0,Sf=!0;function Es(i,e,t){let n=i.match(e);return n&&n.length>=t&&parseFloat(n[t],10)}function An(i,e,t){if(!i.RTCPeerConnection)return;if(!Object.getOwnPropertyDescriptor(EventTarget.prototype,"addEventListener").writable){ur("Unable to polyfill events");return}let s=i.RTCPeerConnection.prototype,r=s.addEventListener;s.addEventListener=function(a,c){if(a!==e)return r.apply(this,arguments);let l=h=>{let u=t(h);u&&(c.handleEvent?c.handleEvent(u):c(u))};return this._eventMap=this._eventMap||{},this._eventMap[e]||(this._eventMap[e]=new Map),this._eventMap[e].set(c,l),r.apply(this,[a,l])};let o=s.removeEventListener;s.removeEventListener=function(a,c){if(a!==e||!this._eventMap||!this._eventMap[e])return o.apply(this,arguments);if(!this._eventMap[e].has(c))return o.apply(this,arguments);let l=this._eventMap[e].get(c);return this._eventMap[e].delete(c),this._eventMap[e].size===0&&delete this._eventMap[e],Object.keys(this._eventMap).length===0&&delete this._eventMap,o.apply(this,[a,l])},Object.defineProperty(s,"on"+e,{get(){return this["_on"+e]},set(a){this["_on"+e]&&(this.removeEventListener(e,this["_on"+e]),delete this["_on"+e]),a&&this.addEventListener(e,this["_on"+e]=a)},enumerable:!0,configurable:!0})}function Ef(i){return typeof i!="boolean"?new Error("Argument type: "+typeof i+". Please use a boolean."):(Mf=i,i?"adapter.js logging disabled":"adapter.js logging enabled")}function Tf(i){return typeof i!="boolean"?new Error("Argument type: "+typeof i+". Please use a boolean."):(Sf=!i,"adapter.js deprecation warnings "+(i?"disabled":"enabled"))}function ur(){if(typeof window=="object"){if(Mf)return;typeof console!="undefined"&&typeof console.log=="function"&&console.log.apply(console,arguments)}}function Ts(i,e){Sf&&console.warn(i+" is deprecated, please use "+e+" instead.")}function wf(i){let e={browser:null,version:null};if(typeof i=="undefined"||!i.navigator||!i.navigator.userAgent)return e.browser="Not a browser.",e;let{navigator:t}=i;if(t.userAgentData&&t.userAgentData.brands){let n=t.userAgentData.brands.find(s=>s.brand==="Chromium");if(n){let s=parseInt(n.version,10);if(s>=90)return{browser:"chrome",version:s}}}if(t.mozGetUserMedia)e.browser="firefox",e.version=parseInt(Es(t.userAgent,/Firefox\/(\d+)\./,1));else if(t.webkitGetUserMedia||i.isSecureContext===!1&&i.webkitRTCPeerConnection)e.browser="chrome",e.version=parseInt(Es(t.userAgent,/Chrom(e|ium)\/(\d+)\./,2))||null;else if(i.RTCPeerConnection&&t.userAgent.match(/AppleWebKit\/(\d+)\./))e.browser="safari",e.version=parseInt(Es(t.userAgent,/AppleWebKit\/(\d+)\./,1)),e.supportsUnifiedPlan=i.RTCRtpTransceiver&&"currentDirection"in i.RTCRtpTransceiver.prototype,e._safariVersion=Es(t.userAgent,/Version\/(\d+(\.?\d+))/,1);else return e.browser="Not a supported browser.",e;return e}function bf(i){return Object.prototype.toString.call(i)==="[object Object]"}function fh(i){return bf(i)?Object.keys(i).reduce(function(e,t){let n=bf(i[t]),s=n?fh(i[t]):i[t],r=n&&!Object.keys(s).length;return s===void 0||r?e:Object.assign(e,{[t]:s})},{}):i}function dh(i,e,t){!e||t.has(e.id)||(t.set(e.id,e),Object.keys(e).forEach(n=>{n.endsWith("Id")?dh(i,i.get(e[n]),t):n.endsWith("Ids")&&e[n].forEach(s=>{dh(i,i.get(s),t)})}))}function ph(i,e,t){let n=t?"outbound-rtp":"inbound-rtp",s=new Map;if(e===null)return s;let r=[];return i.forEach(o=>{o.type==="track"&&o.trackIdentifier===e.id&&r.push(o)}),r.forEach(o=>{i.forEach(a=>{a.type===n&&a.trackId===o.id&&dh(i,a,s)})}),s}var la={};Cr(la,{fixNegotiationNeeded:()=>vh,shimAddTrackRemoveTrack:()=>xh,shimAddTrackRemoveTrackWithNative:()=>Cf,shimGetSendersWithDtmf:()=>_h,shimGetUserMedia:()=>aa,shimMediaStream:()=>mh,shimOnTrack:()=>gh,shimPeerConnection:()=>ca,shimSenderReceiverGetStats:()=>yh});var Af=ur;function aa(i,e){if(e.version>=64)return;let t=i&&i.navigator;if(!t.mediaDevices)return;let n=function(a){if(typeof a!="object"||a.mandatory||a.optional)return a;let c={};return Object.keys(a).forEach(l=>{if(l==="require"||l==="advanced"||l==="mediaSource")return;let h=typeof a[l]=="object"?a[l]:{ideal:a[l]};h.exact!==void 0&&typeof h.exact=="number"&&(h.min=h.max=h.exact);let u=function(d,f){return d?d+f.charAt(0).toUpperCase()+f.slice(1):f==="deviceId"?"sourceId":f};if(h.ideal!==void 0){c.optional=c.optional||[];let d={};typeof h.ideal=="number"?(d[u("min",l)]=h.ideal,c.optional.push(d),d={},d[u("max",l)]=h.ideal,c.optional.push(d)):(d[u("",l)]=h.ideal,c.optional.push(d))}h.exact!==void 0&&typeof h.exact!="number"?(c.mandatory=c.mandatory||{},c.mandatory[u("",l)]=h.exact):["min","max"].forEach(d=>{h[d]!==void 0&&(c.mandatory=c.mandatory||{},c.mandatory[u(d,l)]=h[d])})}),a.advanced&&(c.optional=(c.optional||[]).concat(a.advanced)),c},s=function(a,c){if(e.version>=61)return c(a);if(a=JSON.parse(JSON.stringify(a)),a&&typeof a.audio=="object"){let l=function(h,u,d){u in h&&!(d in h)&&(h[d]=h[u],delete h[u])};a=JSON.parse(JSON.stringify(a)),l(a.audio,"autoGainControl","googAutoGainControl"),l(a.audio,"noiseSuppression","googNoiseSuppression"),a.audio=n(a.audio)}if(a&&typeof a.video=="object"){let l=a.video.facingMode;l=l&&(typeof l=="object"?l:{ideal:l});let h=e.version<66;if(l&&(l.exact==="user"||l.exact==="environment"||l.ideal==="user"||l.ideal==="environment")&&!(t.mediaDevices.getSupportedConstraints&&t.mediaDevices.getSupportedConstraints().facingMode&&!h)){delete a.video.facingMode;let u;if(l.exact==="environment"||l.ideal==="environment"?u=["back","rear"]:(l.exact==="user"||l.ideal==="user")&&(u=["front"]),u)return t.mediaDevices.enumerateDevices().then(d=>{d=d.filter(g=>g.kind==="videoinput");let f=d.find(g=>u.some(y=>g.label.toLowerCase().includes(y)));return!f&&d.length&&u.includes("back")&&(f=d[d.length-1]),f&&(a.video.deviceId=l.exact?{exact:f.deviceId}:{ideal:f.deviceId}),a.video=n(a.video),Af("chrome: "+JSON.stringify(a)),c(a)})}a.video=n(a.video)}return Af("chrome: "+JSON.stringify(a)),c(a)},r=function(a){return e.version>=64?a:{name:{PermissionDeniedError:"NotAllowedError",PermissionDismissedError:"NotAllowedError",InvalidStateError:"NotAllowedError",DevicesNotFoundError:"NotFoundError",ConstraintNotSatisfiedError:"OverconstrainedError",TrackStartError:"NotReadableError",MediaDeviceFailedDueToShutdown:"NotAllowedError",MediaDeviceKillSwitchOn:"NotAllowedError",TabCaptureError:"AbortError",ScreenCaptureError:"AbortError",DeviceCaptureError:"AbortError"}[a.name]||a.name,message:a.message,constraint:a.constraint||a.constraintName,toString(){return this.name+(this.message&&": ")+this.message}}},o=function(a,c,l){s(a,h=>{t.webkitGetUserMedia(h,c,u=>{l&&l(r(u))})})};if(t.getUserMedia=o.bind(t),t.mediaDevices.getUserMedia){let a=t.mediaDevices.getUserMedia.bind(t.mediaDevices);t.mediaDevices.getUserMedia=function(c){return s(c,l=>a(l).then(h=>{if(l.audio&&!h.getAudioTracks().length||l.video&&!h.getVideoTracks().length)throw h.getTracks().forEach(u=>{u.stop()}),new DOMException("","NotFoundError");return h},h=>Promise.reject(r(h))))}}}function mh(i){i.MediaStream=i.MediaStream||i.webkitMediaStream}function gh(i,e){if(!(e.version>102))if(typeof i=="object"&&i.RTCPeerConnection&&!("ontrack"in i.RTCPeerConnection.prototype)){Object.defineProperty(i.RTCPeerConnection.prototype,"ontrack",{get(){return this._ontrack},set(n){this._ontrack&&this.removeEventListener("track",this._ontrack),this.addEventListener("track",this._ontrack=n)},enumerable:!0,configurable:!0});let t=i.RTCPeerConnection.prototype.setRemoteDescription;i.RTCPeerConnection.prototype.setRemoteDescription=function(){return this._ontrackpoly||(this._ontrackpoly=s=>{s.stream.addEventListener("addtrack",r=>{let o;i.RTCPeerConnection.prototype.getReceivers?o=this.getReceivers().find(c=>c.track&&c.track.id===r.track.id):o={track:r.track};let a=new Event("track");a.track=r.track,a.receiver=o,a.transceiver={receiver:o},a.streams=[s.stream],this.dispatchEvent(a)}),s.stream.getTracks().forEach(r=>{let o;i.RTCPeerConnection.prototype.getReceivers?o=this.getReceivers().find(c=>c.track&&c.track.id===r.id):o={track:r};let a=new Event("track");a.track=r,a.receiver=o,a.transceiver={receiver:o},a.streams=[s.stream],this.dispatchEvent(a)})},this.addEventListener("addstream",this._ontrackpoly)),t.apply(this,arguments)}}else An(i,"track",t=>(t.transceiver||Object.defineProperty(t,"transceiver",{value:{receiver:t.receiver}}),t))}function _h(i){if(typeof i=="object"&&i.RTCPeerConnection&&!("getSenders"in i.RTCPeerConnection.prototype)&&"createDTMFSender"in i.RTCPeerConnection.prototype){let e=function(s,r){return{track:r,get dtmf(){return this._dtmf===void 0&&(r.kind==="audio"?this._dtmf=s.createDTMFSender(r):this._dtmf=null),this._dtmf},_pc:s}};if(!i.RTCPeerConnection.prototype.getSenders){i.RTCPeerConnection.prototype.getSenders=function(){return this._senders=this._senders||[],this._senders.slice()};let s=i.RTCPeerConnection.prototype.addTrack;i.RTCPeerConnection.prototype.addTrack=function(a,c){let l=s.apply(this,arguments);return l||(l=e(this,a),this._senders.push(l)),l};let r=i.RTCPeerConnection.prototype.removeTrack;i.RTCPeerConnection.prototype.removeTrack=function(a){r.apply(this,arguments);let c=this._senders.indexOf(a);c!==-1&&this._senders.splice(c,1)}}let t=i.RTCPeerConnection.prototype.addStream;i.RTCPeerConnection.prototype.addStream=function(r){this._senders=this._senders||[],t.apply(this,[r]),r.getTracks().forEach(o=>{this._senders.push(e(this,o))})};let n=i.RTCPeerConnection.prototype.removeStream;i.RTCPeerConnection.prototype.removeStream=function(r){this._senders=this._senders||[],n.apply(this,[r]),r.getTracks().forEach(o=>{let a=this._senders.find(c=>c.track===o);a&&this._senders.splice(this._senders.indexOf(a),1)})}}else if(typeof i=="object"&&i.RTCPeerConnection&&"getSenders"in i.RTCPeerConnection.prototype&&"createDTMFSender"in i.RTCPeerConnection.prototype&&i.RTCRtpSender&&!("dtmf"in i.RTCRtpSender.prototype)){let e=i.RTCPeerConnection.prototype.getSenders;i.RTCPeerConnection.prototype.getSenders=function(){let n=e.apply(this,[]);return n.forEach(s=>s._pc=this),n},Object.defineProperty(i.RTCRtpSender.prototype,"dtmf",{get(){return this._dtmf===void 0&&(this.track.kind==="audio"?this._dtmf=this._pc.createDTMFSender(this.track):this._dtmf=null),this._dtmf}})}}function yh(i,e){if(e.version>=67||!(typeof i=="object"&&i.RTCPeerConnection&&i.RTCRtpSender&&i.RTCRtpReceiver))return;if(!("getStats"in i.RTCRtpSender.prototype)){let n=i.RTCPeerConnection.prototype.getSenders;n&&(i.RTCPeerConnection.prototype.getSenders=function(){let o=n.apply(this,[]);return o.forEach(a=>a._pc=this),o});let s=i.RTCPeerConnection.prototype.addTrack;s&&(i.RTCPeerConnection.prototype.addTrack=function(){let o=s.apply(this,arguments);return o._pc=this,o}),i.RTCRtpSender.prototype.getStats=function(){let o=this;return this._pc.getStats().then(a=>ph(a,o.track,!0))}}if(!("getStats"in i.RTCRtpReceiver.prototype)){let n=i.RTCPeerConnection.prototype.getReceivers;n&&(i.RTCPeerConnection.prototype.getReceivers=function(){let r=n.apply(this,[]);return r.forEach(o=>o._pc=this),r}),An(i,"track",s=>(s.receiver._pc=s.srcElement,s)),i.RTCRtpReceiver.prototype.getStats=function(){let r=this;return this._pc.getStats().then(o=>ph(o,r.track,!1))}}if(!("getStats"in i.RTCRtpSender.prototype&&"getStats"in i.RTCRtpReceiver.prototype))return;let t=i.RTCPeerConnection.prototype.getStats;i.RTCPeerConnection.prototype.getStats=function(){if(arguments.length>0&&arguments[0]instanceof i.MediaStreamTrack){let s=arguments[0],r,o,a;return this.getSenders().forEach(c=>{c.track===s&&(r?a=!0:r=c)}),this.getReceivers().forEach(c=>(c.track===s&&(o?a=!0:o=c),c.track===s)),a||r&&o?Promise.reject(new DOMException("There are more than one sender or receiver for the track.","InvalidAccessError")):r?r.getStats():o?o.getStats():Promise.reject(new DOMException("There is no sender or receiver for the track.","InvalidAccessError"))}return t.apply(this,arguments)}}function Cf(i){i.RTCPeerConnection.prototype.getLocalStreams=function(){return this._shimmedLocalStreams=this._shimmedLocalStreams||{},Object.keys(this._shimmedLocalStreams).map(o=>this._shimmedLocalStreams[o][0])};let e=i.RTCPeerConnection.prototype.addTrack;i.RTCPeerConnection.prototype.addTrack=function(o,a){if(!a)return e.apply(this,arguments);this._shimmedLocalStreams=this._shimmedLocalStreams||{};let c=e.apply(this,arguments);return this._shimmedLocalStreams[a.id]?this._shimmedLocalStreams[a.id].indexOf(c)===-1&&this._shimmedLocalStreams[a.id].push(c):this._shimmedLocalStreams[a.id]=[a,c],c};let t=i.RTCPeerConnection.prototype.addStream;i.RTCPeerConnection.prototype.addStream=function(o){this._shimmedLocalStreams=this._shimmedLocalStreams||{},o.getTracks().forEach(l=>{if(this.getSenders().find(u=>u.track===l))throw new DOMException("Track already exists.","InvalidAccessError")});let a=this.getSenders();t.apply(this,arguments);let c=this.getSenders().filter(l=>a.indexOf(l)===-1);this._shimmedLocalStreams[o.id]=[o].concat(c)};let n=i.RTCPeerConnection.prototype.removeStream;i.RTCPeerConnection.prototype.removeStream=function(o){return this._shimmedLocalStreams=this._shimmedLocalStreams||{},delete this._shimmedLocalStreams[o.id],n.apply(this,arguments)};let s=i.RTCPeerConnection.prototype.removeTrack;i.RTCPeerConnection.prototype.removeTrack=function(o){return this._shimmedLocalStreams=this._shimmedLocalStreams||{},o&&Object.keys(this._shimmedLocalStreams).forEach(a=>{let c=this._shimmedLocalStreams[a].indexOf(o);c!==-1&&this._shimmedLocalStreams[a].splice(c,1),this._shimmedLocalStreams[a].length===1&&delete this._shimmedLocalStreams[a]}),s.apply(this,arguments)}}function xh(i,e){if(!i.RTCPeerConnection)return;if(i.RTCPeerConnection.prototype.addTrack&&e.version>=65)return Cf(i);let t=i.RTCPeerConnection.prototype.getLocalStreams;i.RTCPeerConnection.prototype.getLocalStreams=function(){let h=t.apply(this);return this._reverseStreams=this._reverseStreams||{},h.map(u=>this._reverseStreams[u.id])};let n=i.RTCPeerConnection.prototype.addStream;i.RTCPeerConnection.prototype.addStream=function(h){if(this._streams=this._streams||{},this._reverseStreams=this._reverseStreams||{},h.getTracks().forEach(u=>{if(this.getSenders().find(f=>f.track===u))throw new DOMException("Track already exists.","InvalidAccessError")}),!this._reverseStreams[h.id]){let u=new i.MediaStream(h.getTracks());this._streams[h.id]=u,this._reverseStreams[u.id]=h,h=u}n.apply(this,[h])};let s=i.RTCPeerConnection.prototype.removeStream;i.RTCPeerConnection.prototype.removeStream=function(h){this._streams=this._streams||{},this._reverseStreams=this._reverseStreams||{},s.apply(this,[this._streams[h.id]||h]),delete this._reverseStreams[this._streams[h.id]?this._streams[h.id].id:h.id],delete this._streams[h.id]},i.RTCPeerConnection.prototype.addTrack=function(h,u){if(this.signalingState==="closed")throw new DOMException("The RTCPeerConnection's signalingState is 'closed'.","InvalidStateError");let d=[].slice.call(arguments,1);if(d.length!==1||!d[0].getTracks().find(y=>y===h))throw new DOMException("The adapter.js addTrack polyfill only supports a single  stream which is associated with the specified track.","NotSupportedError");if(this.getSenders().find(y=>y.track===h))throw new DOMException("Track already exists.","InvalidAccessError");this._streams=this._streams||{},this._reverseStreams=this._reverseStreams||{};let g=this._streams[u.id];if(g)g.addTrack(h),Promise.resolve().then(()=>{this.dispatchEvent(new Event("negotiationneeded"))});else{let y=new i.MediaStream([h]);this._streams[u.id]=y,this._reverseStreams[y.id]=u,this.addStream(y)}return this.getSenders().find(y=>y.track===h)};function r(l,h){let u=h.sdp;return Object.keys(l._reverseStreams||[]).forEach(d=>{let f=l._reverseStreams[d],g=l._streams[f.id];u=u.replace(new RegExp(g.id,"g"),f.id)}),new RTCSessionDescription({type:h.type,sdp:u})}function o(l,h){let u=h.sdp;return Object.keys(l._reverseStreams||[]).forEach(d=>{let f=l._reverseStreams[d],g=l._streams[f.id];u=u.replace(new RegExp(f.id,"g"),g.id)}),new RTCSessionDescription({type:h.type,sdp:u})}["createOffer","createAnswer"].forEach(function(l){let h=i.RTCPeerConnection.prototype[l],u={[l](){let d=arguments;return arguments.length&&typeof arguments[0]=="function"?h.apply(this,[g=>{let y=r(this,g);d[0].apply(null,[y])},g=>{d[1]&&d[1].apply(null,g)},arguments[2]]):h.apply(this,arguments).then(g=>r(this,g))}};i.RTCPeerConnection.prototype[l]=u[l]});let a=i.RTCPeerConnection.prototype.setLocalDescription;i.RTCPeerConnection.prototype.setLocalDescription=function(){return!arguments.length||!arguments[0].type?a.apply(this,arguments):(arguments[0]=o(this,arguments[0]),a.apply(this,arguments))};let c=Object.getOwnPropertyDescriptor(i.RTCPeerConnection.prototype,"localDescription");Object.defineProperty(i.RTCPeerConnection.prototype,"localDescription",{get(){let l=c.get.apply(this);return l.type===""?l:r(this,l)}}),i.RTCPeerConnection.prototype.removeTrack=function(h){if(this.signalingState==="closed")throw new DOMException("The RTCPeerConnection's signalingState is 'closed'.","InvalidStateError");if(!h._pc)throw new DOMException("Argument 1 of RTCPeerConnection.removeTrack does not implement interface RTCRtpSender.","TypeError");if(!(h._pc===this))throw new DOMException("Sender was not created by this connection.","InvalidAccessError");this._streams=this._streams||{};let d;Object.keys(this._streams).forEach(f=>{this._streams[f].getTracks().find(y=>h.track===y)&&(d=this._streams[f])}),d&&(d.getTracks().length===1?this.removeStream(this._reverseStreams[d.id]):d.removeTrack(h.track),this.dispatchEvent(new Event("negotiationneeded")))}}function ca(i,e){!i.RTCPeerConnection&&i.webkitRTCPeerConnection&&(i.RTCPeerConnection=i.webkitRTCPeerConnection),i.RTCPeerConnection&&e.version<53&&["setLocalDescription","setRemoteDescription","addIceCandidate"].forEach(function(t){let n=i.RTCPeerConnection.prototype[t],s={[t](){return arguments[0]=new(t==="addIceCandidate"?i.RTCIceCandidate:i.RTCSessionDescription)(arguments[0]),n.apply(this,arguments)}};i.RTCPeerConnection.prototype[t]=s[t]})}function vh(i,e){e.version>102||An(i,"negotiationneeded",t=>{let n=t.target;if(!((e.version<72||n.getConfiguration&&n.getConfiguration().sdpSemantics==="plan-b")&&n.signalingState!=="stable"))return t})}var da={};Cr(da,{shimAddTransceiver:()=>Ah,shimCreateAnswer:()=>Ph,shimCreateOffer:()=>Rh,shimGetDisplayMedia:()=>Rf,shimGetParameters:()=>Ch,shimGetStats:()=>Mh,shimGetUserMedia:()=>ha,shimOnTrack:()=>bh,shimPeerConnection:()=>ua,shimRTCDataChannel:()=>wh,shimReceiverGetStats:()=>Eh,shimRemoveStream:()=>Th,shimSenderGetStats:()=>Sh});function ha(i,e){let t=i&&i.navigator;if(!t.mediaDevices)return;let n=i&&i.MediaStreamTrack;if(t.getUserMedia=function(s,r,o){Ts("navigator.getUserMedia","navigator.mediaDevices.getUserMedia"),t.mediaDevices.getUserMedia(s).then(r,o)},!(e.version>55&&"autoGainControl"in t.mediaDevices.getSupportedConstraints())){let s=function(o,a,c){a in o&&!(c in o)&&(o[c]=o[a],delete o[a])},r=t.mediaDevices.getUserMedia.bind(t.mediaDevices);if(t.mediaDevices.getUserMedia=function(o){return typeof o=="object"&&typeof o.audio=="object"&&(o=JSON.parse(JSON.stringify(o)),s(o.audio,"autoGainControl","mozAutoGainControl"),s(o.audio,"noiseSuppression","mozNoiseSuppression")),r(o)},n&&n.prototype.getSettings){let o=n.prototype.getSettings;n.prototype.getSettings=function(){let a=o.apply(this,arguments);return s(a,"mozAutoGainControl","autoGainControl"),s(a,"mozNoiseSuppression","noiseSuppression"),a}}if(n&&n.prototype.applyConstraints){let o=n.prototype.applyConstraints;n.prototype.applyConstraints=function(a){return this.kind==="audio"&&typeof a=="object"&&(a=JSON.parse(JSON.stringify(a)),s(a,"autoGainControl","mozAutoGainControl"),s(a,"noiseSuppression","mozNoiseSuppression")),o.apply(this,[a])}}}}function Rf(i,e){i.navigator.mediaDevices&&(i.navigator.mediaDevices&&"getDisplayMedia"in i.navigator.mediaDevices||(i.navigator.mediaDevices.getDisplayMedia=function(n){if(!(n&&n.video)){let s=new DOMException("getDisplayMedia without video constraints is undefined");return s.name="NotFoundError",s.code=8,Promise.reject(s)}return n.video===!0?n.video={mediaSource:e}:n.video.mediaSource=e,i.navigator.mediaDevices.getUserMedia(n)}))}function bh(i){typeof i=="object"&&i.RTCTrackEvent&&"receiver"in i.RTCTrackEvent.prototype&&!("transceiver"in i.RTCTrackEvent.prototype)&&Object.defineProperty(i.RTCTrackEvent.prototype,"transceiver",{get(){return{receiver:this.receiver}}})}function ua(i,e){typeof i!="object"||!(i.RTCPeerConnection||i.mozRTCPeerConnection)||(!i.RTCPeerConnection&&i.mozRTCPeerConnection&&(i.RTCPeerConnection=i.mozRTCPeerConnection),e.version<53&&["setLocalDescription","setRemoteDescription","addIceCandidate"].forEach(function(t){let n=i.RTCPeerConnection.prototype[t],s={[t](){return arguments[0]=new(t==="addIceCandidate"?i.RTCIceCandidate:i.RTCSessionDescription)(arguments[0]),n.apply(this,arguments)}};i.RTCPeerConnection.prototype[t]=s[t]}))}function Mh(i,e){if(typeof i!="object"||!(i.RTCPeerConnection||i.mozRTCPeerConnection)||e.version>=151)return;let t={inboundrtp:"inbound-rtp",outboundrtp:"outbound-rtp",candidatepair:"candidate-pair",localcandidate:"local-candidate",remotecandidate:"remote-candidate"},n=i.RTCPeerConnection.prototype.getStats;i.RTCPeerConnection.prototype.getStats=function(){let[r,o,a]=arguments;return this.signalingState==="closed"?Promise.resolve(new Map):n.apply(this,[r||null]).then(c=>{if(e.version<53&&!o)try{c.forEach(l=>{l.type=t[l.type]||l.type})}catch(l){if(l.name!=="TypeError")throw l;c.forEach((h,u)=>{c.set(u,Object.assign({},h,{type:t[h.type]||h.type}))})}return c}).then(o,a)}}function Sh(i){if(!(typeof i=="object"&&i.RTCPeerConnection&&i.RTCRtpSender)||i.RTCRtpSender&&"getStats"in i.RTCRtpSender.prototype)return;let e=i.RTCPeerConnection.prototype.getSenders;e&&(i.RTCPeerConnection.prototype.getSenders=function(){let s=e.apply(this,[]);return s.forEach(r=>r._pc=this),s});let t=i.RTCPeerConnection.prototype.addTrack;t&&(i.RTCPeerConnection.prototype.addTrack=function(){let s=t.apply(this,arguments);return s._pc=this,s}),i.RTCRtpSender.prototype.getStats=function(){return this.track?this._pc.getStats(this.track):Promise.resolve(new Map)}}function Eh(i){if(!(typeof i=="object"&&i.RTCPeerConnection&&i.RTCRtpSender)||i.RTCRtpSender&&"getStats"in i.RTCRtpReceiver.prototype)return;let e=i.RTCPeerConnection.prototype.getReceivers;e&&(i.RTCPeerConnection.prototype.getReceivers=function(){let n=e.apply(this,[]);return n.forEach(s=>s._pc=this),n}),An(i,"track",t=>(t.receiver._pc=t.srcElement,t)),i.RTCRtpReceiver.prototype.getStats=function(){return this._pc.getStats(this.track)}}function Th(i){!i.RTCPeerConnection||"removeStream"in i.RTCPeerConnection.prototype||(i.RTCPeerConnection.prototype.removeStream=function(t){Ts("removeStream","removeTrack"),this.getSenders().forEach(n=>{n.track&&t.getTracks().includes(n.track)&&this.removeTrack(n)})})}function wh(i){i.DataChannel&&!i.RTCDataChannel&&(i.RTCDataChannel=i.DataChannel)}function Ah(i,e){if(!(typeof i=="object"&&i.RTCPeerConnection)||e.version>=110)return;let t=i.RTCPeerConnection.prototype.addTransceiver;t&&(i.RTCPeerConnection.prototype.addTransceiver=function(){this.setParametersPromises=[];let s=arguments[1]&&arguments[1].sendEncodings;s===void 0&&(s=[]),s=[...s];let r=s.length>0;r&&s.forEach(a=>{if("rid"in a&&!/^[a-z0-9]{0,16}$/i.test(a.rid))throw new TypeError("Invalid RID value provided.");if("scaleResolutionDownBy"in a&&!(parseFloat(a.scaleResolutionDownBy)>=1))throw new RangeError("scale_resolution_down_by must be >= 1.0");if("maxFramerate"in a&&!(parseFloat(a.maxFramerate)>=0))throw new RangeError("max_framerate must be >= 0.0")});let o=t.apply(this,arguments);if(r){let{sender:a}=o,c=a.getParameters();(!("encodings"in c)||c.encodings.length===1&&Object.keys(c.encodings[0]).length===0)&&(c.encodings=s,a.sendEncodings=s,this.setParametersPromises.push(a.setParameters(c).then(()=>{delete a.sendEncodings}).catch(()=>{delete a.sendEncodings})))}return o})}function Ch(i,e){if(!(typeof i=="object"&&i.RTCRtpSender)||e.version>=110)return;let t=i.RTCRtpSender.prototype.getParameters;t&&(i.RTCRtpSender.prototype.getParameters=function(){let s=t.apply(this,arguments);return"encodings"in s||(s.encodings=[].concat(this.sendEncodings||[{}])),s})}function Rh(i,e){if(!(typeof i=="object"&&i.RTCPeerConnection)||e.version>=110)return;let t=i.RTCPeerConnection.prototype.createOffer;i.RTCPeerConnection.prototype.createOffer=function(){return this.setParametersPromises&&this.setParametersPromises.length?Promise.all(this.setParametersPromises).then(()=>t.apply(this,arguments)).finally(()=>{this.setParametersPromises=[]}):t.apply(this,arguments)}}function Ph(i,e){if(!(typeof i=="object"&&i.RTCPeerConnection)||e.version>=110)return;let t=i.RTCPeerConnection.prototype.createAnswer;i.RTCPeerConnection.prototype.createAnswer=function(){return this.setParametersPromises&&this.setParametersPromises.length?Promise.all(this.setParametersPromises).then(()=>t.apply(this,arguments)).finally(()=>{this.setParametersPromises=[]}):t.apply(this,arguments)}}var fa={};Cr(fa,{shimAudioContext:()=>Fh,shimCallbacksAPI:()=>Dh,shimConstraints:()=>Pf,shimCreateOfferLegacy:()=>Oh,shimGetUserMedia:()=>Uh,shimLocalStreamsAPI:()=>Ih,shimRTCIceServerUrls:()=>Nh,shimRemoteStreamsAPI:()=>Lh,shimTrackEventTransceiver:()=>kh});function Ih(i){if(!(typeof i!="object"||!i.RTCPeerConnection)){if("getLocalStreams"in i.RTCPeerConnection.prototype||(i.RTCPeerConnection.prototype.getLocalStreams=function(){return this._localStreams||(this._localStreams=[]),this._localStreams}),!("addStream"in i.RTCPeerConnection.prototype)){let e=i.RTCPeerConnection.prototype.addTrack;i.RTCPeerConnection.prototype.addStream=function(n){this._localStreams||(this._localStreams=[]),this._localStreams.includes(n)||this._localStreams.push(n),n.getAudioTracks().forEach(s=>e.call(this,s,n)),n.getVideoTracks().forEach(s=>e.call(this,s,n))},i.RTCPeerConnection.prototype.addTrack=function(n,...s){return s&&s.forEach(r=>{this._localStreams?this._localStreams.includes(r)||this._localStreams.push(r):this._localStreams=[r]}),e.apply(this,arguments)}}"removeStream"in i.RTCPeerConnection.prototype||(i.RTCPeerConnection.prototype.removeStream=function(t){this._localStreams||(this._localStreams=[]);let n=this._localStreams.indexOf(t);if(n===-1)return;this._localStreams.splice(n,1);let s=t.getTracks();this.getSenders().forEach(r=>{s.includes(r.track)&&this.removeTrack(r)})})}}function Lh(i){if(!(typeof i!="object"||!i.RTCPeerConnection)&&("getRemoteStreams"in i.RTCPeerConnection.prototype||(i.RTCPeerConnection.prototype.getRemoteStreams=function(){return this._remoteStreams?this._remoteStreams:[]}),!("onaddstream"in i.RTCPeerConnection.prototype))){Object.defineProperty(i.RTCPeerConnection.prototype,"onaddstream",{get(){return this._onaddstream},set(t){this._onaddstream&&(this.removeEventListener("addstream",this._onaddstream),this.removeEventListener("track",this._onaddstreampoly)),this.addEventListener("addstream",this._onaddstream=t),this.addEventListener("track",this._onaddstreampoly=n=>{n.streams.forEach(s=>{if(this._remoteStreams||(this._remoteStreams=[]),this._remoteStreams.includes(s))return;this._remoteStreams.push(s);let r=new Event("addstream");r.stream=s,this.dispatchEvent(r)})})}});let e=i.RTCPeerConnection.prototype.setRemoteDescription;i.RTCPeerConnection.prototype.setRemoteDescription=function(){let n=this;return this._onaddstreampoly||this.addEventListener("track",this._onaddstreampoly=function(s){s.streams.forEach(r=>{if(n._remoteStreams||(n._remoteStreams=[]),n._remoteStreams.indexOf(r)>=0)return;n._remoteStreams.push(r);let o=new Event("addstream");o.stream=r,n.dispatchEvent(o)})}),e.apply(n,arguments)}}}function Dh(i){if(typeof i!="object"||!i.RTCPeerConnection)return;let e=i.RTCPeerConnection.prototype,t=e.createOffer,n=e.createAnswer,s=e.setLocalDescription,r=e.setRemoteDescription,o=e.addIceCandidate;e.createOffer=function(l,h){let u=arguments.length>=2?arguments[2]:arguments[0],d=t.apply(this,[u]);return h?(d.then(l,h),Promise.resolve()):d},e.createAnswer=function(l,h){let u=arguments.length>=2?arguments[2]:arguments[0],d=n.apply(this,[u]);return h?(d.then(l,h),Promise.resolve()):d};let a=function(c,l,h){let u=s.apply(this,[c]);return h?(u.then(l,h),Promise.resolve()):u};e.setLocalDescription=a,a=function(c,l,h){let u=r.apply(this,[c]);return h?(u.then(l,h),Promise.resolve()):u},e.setRemoteDescription=a,a=function(c,l,h){let u=o.apply(this,[c]);return h?(u.then(l,h),Promise.resolve()):u},e.addIceCandidate=a}function Uh(i){let e=i&&i.navigator;if(e.mediaDevices&&e.mediaDevices.getUserMedia){let t=e.mediaDevices,n=t.getUserMedia.bind(t);e.mediaDevices.getUserMedia=s=>n(Pf(s))}!e.getUserMedia&&e.mediaDevices&&e.mediaDevices.getUserMedia&&(e.getUserMedia=function(n,s,r){e.mediaDevices.getUserMedia(n).then(s,r)}.bind(e))}function Pf(i){return i&&i.video!==void 0?Object.assign({},i,{video:fh(i.video)}):i}function Nh(i){if(!i.RTCPeerConnection)return;let e=i.RTCPeerConnection;i.RTCPeerConnection=function(n,s){if(n&&n.iceServers){let r=[];for(let o=0;o<n.iceServers.length;o++){let a=n.iceServers[o];a.urls===void 0&&a.url?(Ts("RTCIceServer.url","RTCIceServer.urls"),a=JSON.parse(JSON.stringify(a)),a.urls=a.url,delete a.url,r.push(a)):r.push(n.iceServers[o])}n.iceServers=r}return new e(n,s)},i.RTCPeerConnection.prototype=e.prototype,"generateCertificate"in e&&Object.defineProperty(i.RTCPeerConnection,"generateCertificate",{get(){return e.generateCertificate}})}function kh(i){typeof i=="object"&&i.RTCTrackEvent&&"receiver"in i.RTCTrackEvent.prototype&&!("transceiver"in i.RTCTrackEvent.prototype)&&Object.defineProperty(i.RTCTrackEvent.prototype,"transceiver",{get(){return{receiver:this.receiver}}})}function Oh(i){let e=i.RTCPeerConnection.prototype.createOffer;i.RTCPeerConnection.prototype.createOffer=function(n){if(n){typeof n.offerToReceiveAudio!="undefined"&&(n.offerToReceiveAudio=!!n.offerToReceiveAudio);let s=this.getTransceivers().find(o=>o.receiver.track.kind==="audio");n.offerToReceiveAudio===!1&&s?s.direction==="sendrecv"?s.setDirection?s.setDirection("sendonly"):s.direction="sendonly":s.direction==="recvonly"&&(s.setDirection?s.setDirection("inactive"):s.direction="inactive"):n.offerToReceiveAudio===!0&&!s&&this.addTransceiver("audio",{direction:"recvonly"}),typeof n.offerToReceiveVideo!="undefined"&&(n.offerToReceiveVideo=!!n.offerToReceiveVideo);let r=this.getTransceivers().find(o=>o.receiver.track.kind==="video");n.offerToReceiveVideo===!1&&r?r.direction==="sendrecv"?r.setDirection?r.setDirection("sendonly"):r.direction="sendonly":r.direction==="recvonly"&&(r.setDirection?r.setDirection("inactive"):r.direction="inactive"):n.offerToReceiveVideo===!0&&!r&&this.addTransceiver("video",{direction:"recvonly"})}return e.apply(this,arguments)}}function Fh(i){typeof i!="object"||i.AudioContext||(i.AudioContext=i.webkitAudioContext)}var Hh={};Cr(Hh,{removeExtmapAllowMixed:()=>ga,shimAddIceCandidateNullOrEmpty:()=>mr,shimConnectionState:()=>ma,shimMaxMessageSize:()=>fr,shimParameterlessSetLocalDescription:()=>gr,shimRTCIceCandidate:()=>dr,shimRTCIceCandidateRelayProtocol:()=>pa,shimSendThrowTypeError:()=>pr});var ws=gu(zh());function dr(i){if(!i.RTCIceCandidate||i.RTCIceCandidate&&"foundation"in i.RTCIceCandidate.prototype)return;let e=i.RTCIceCandidate;i.RTCIceCandidate=function(n){if(typeof n=="object"&&n.candidate&&n.candidate.indexOf("a=")===0&&(n=JSON.parse(JSON.stringify(n)),n.candidate=n.candidate.substring(2)),n.candidate&&n.candidate.length){let s=new e(n),r=ws.default.parseCandidate(n.candidate);for(let o in r)o in s||Object.defineProperty(s,o,{value:r[o]});return s.toJSON=function(){return{candidate:s.candidate,sdpMid:s.sdpMid,sdpMLineIndex:s.sdpMLineIndex,usernameFragment:s.usernameFragment}},s}return new e(n)},i.RTCIceCandidate.prototype=e.prototype,An(i,"icecandidate",t=>(t.candidate&&Object.defineProperty(t,"candidate",{value:new i.RTCIceCandidate(t.candidate),writable:"false"}),t))}function pa(i){!i.RTCIceCandidate||i.RTCIceCandidate&&"relayProtocol"in i.RTCIceCandidate.prototype||An(i,"icecandidate",e=>{if(e.candidate){let t=ws.default.parseCandidate(e.candidate.candidate);t.type==="relay"&&(e.candidate.relayProtocol={0:"tls",1:"tcp",2:"udp"}[t.priority>>24])}return e})}function fr(i,e){if(!i.RTCPeerConnection||e.browser==="chrome"&&e.version>102||e.browser==="firefox"&&e.version>=113)return;"sctp"in i.RTCPeerConnection.prototype||Object.defineProperty(i.RTCPeerConnection.prototype,"sctp",{get(){return typeof this._sctp=="undefined"?null:this._sctp}});let t=function(a){if(!a||!a.sdp)return!1;let c=ws.default.splitSections(a.sdp);return c.shift(),c.some(l=>{let h=ws.default.parseMLine(l);return h&&h.kind==="application"&&h.protocol.indexOf("SCTP")!==-1})},n=function(a){let c=a.sdp.match(/mozilla...THIS_IS_SDPARTA-(\d+)/);if(c===null||c.length<2)return-1;let l=parseInt(c[1],10);return l!==l?-1:l},s=function(a){let c=65536;return e.browser==="firefox"&&(e.version<57?a===-1?c=16384:c=2147483637:e.version<60?c=e.version===57?65535:65536:c=2147483637),c},r=function(a,c){let l=65536;e.browser==="firefox"&&e.version===57&&(l=65535);let h=ws.default.matchPrefix(a.sdp,"a=max-message-size:");return h.length>0?l=parseInt(h[0].substring(19),10):e.browser==="firefox"&&c!==-1&&(l=2147483637),l},o=i.RTCPeerConnection.prototype.setRemoteDescription;i.RTCPeerConnection.prototype.setRemoteDescription=function(){if(this._sctp=null,e.browser==="chrome"&&e.version>=76){let{sdpSemantics:c}=this.getConfiguration();c==="plan-b"&&Object.defineProperty(this,"sctp",{get(){return typeof this._sctp=="undefined"?null:this._sctp},enumerable:!0,configurable:!0})}if(t(arguments[0])){let c=n(arguments[0]),l=s(c),h=r(arguments[0],c),u;l===0&&h===0?u=Number.POSITIVE_INFINITY:l===0||h===0?u=Math.max(l,h):u=Math.min(l,h);let d={};Object.defineProperty(d,"maxMessageSize",{get(){return u}}),this._sctp=d}return o.apply(this,arguments)}}function pr(i,e){if(!(i.RTCPeerConnection&&"createDataChannel"in i.RTCPeerConnection.prototype)||e.browser==="chrome"&&e.version>=149||e.browser==="firefox"&&e.version>60)return;function t(s,r){let o=s.send;s.send=function(){let c=arguments[0],l=c.length||c.size||c.byteLength;if(s.readyState==="open"&&r.sctp&&l>r.sctp.maxMessageSize)throw new TypeError("Message too large (can send a maximum of "+r.sctp.maxMessageSize+" bytes)");return o.apply(s,arguments)}}let n=i.RTCPeerConnection.prototype.createDataChannel;i.RTCPeerConnection.prototype.createDataChannel=function(){let r=n.apply(this,arguments);return t(r,this),r},An(i,"datachannel",s=>(t(s.channel,s.target),s))}function ma(i){if(!i.RTCPeerConnection||"connectionState"in i.RTCPeerConnection.prototype)return;let e=i.RTCPeerConnection.prototype;Object.defineProperty(e,"connectionState",{get(){return{completed:"connected",checking:"connecting"}[this.iceConnectionState]||this.iceConnectionState},enumerable:!0,configurable:!0}),Object.defineProperty(e,"onconnectionstatechange",{get(){return this._onconnectionstatechange||null},set(t){this._onconnectionstatechange&&(this.removeEventListener("connectionstatechange",this._onconnectionstatechange),delete this._onconnectionstatechange),t&&this.addEventListener("connectionstatechange",this._onconnectionstatechange=t)},enumerable:!0,configurable:!0}),["setLocalDescription","setRemoteDescription"].forEach(t=>{let n=e[t];e[t]=function(){return this._connectionstatechangepoly||(this._connectionstatechangepoly=s=>{let r=s.target;if(r._lastConnectionState!==r.connectionState){r._lastConnectionState=r.connectionState;let o=new Event("connectionstatechange",s);r.dispatchEvent(o)}return s},this.addEventListener("iceconnectionstatechange",this._connectionstatechangepoly)),n.apply(this,arguments)}})}function ga(i,e){if(!i.RTCPeerConnection||e.browser==="chrome"&&e.version>=71||e.browser==="safari"&&e._safariVersion>=13.1)return;let t=i.RTCPeerConnection.prototype.setRemoteDescription;i.RTCPeerConnection.prototype.setRemoteDescription=function(s){if(s&&s.sdp&&s.sdp.indexOf(`
a=extmap-allow-mixed`)!==-1){let r=s.sdp.split(`
`).filter(o=>o.trim()!=="a=extmap-allow-mixed").join(`
`);i.RTCSessionDescription&&s instanceof i.RTCSessionDescription?arguments[0]=new i.RTCSessionDescription({type:s.type,sdp:r}):s.sdp=r}return t.apply(this,arguments)}}function mr(i,e){if(!(i.RTCPeerConnection&&i.RTCPeerConnection.prototype))return;let t=i.RTCPeerConnection.prototype.addIceCandidate;!t||t.length===0||(i.RTCPeerConnection.prototype.addIceCandidate=function(){return arguments[0]?(e.browser==="chrome"&&e.version<78||e.browser==="firefox"&&e.version<68||e.browser==="safari")&&arguments[0]&&arguments[0].candidate===""?Promise.resolve():t.apply(this,arguments):(arguments[1]&&arguments[1].apply(null),Promise.resolve())})}function gr(i,e){if(!(i.RTCPeerConnection&&i.RTCPeerConnection.prototype))return;let t=i.RTCPeerConnection.prototype.setLocalDescription;!t||t.length===0||(i.RTCPeerConnection.prototype.setLocalDescription=function(){let s=arguments[0]||{};if(typeof s!="object"||s.type&&s.sdp)return t.apply(this,arguments);if(s={type:s.type,sdp:s.sdp},!s.type)switch(this.signalingState){case"stable":case"have-local-offer":case"have-remote-pranswer":s.type="offer";break;default:s.type="answer";break}return s.sdp||s.type!=="offer"&&s.type!=="answer"?t.apply(this,[s]):(s.type==="offer"?this.createOffer:this.createAnswer).apply(this).then(o=>t.apply(this,[o]))})}var Xx=gu(zh());function If({window:i}={},e={shimChrome:!0,shimFirefox:!0,shimSafari:!0}){let t=ur,n=wf(i),s={browserDetails:n,commonShim:Hh,extractVersion:Es,disableLog:Ef,disableWarnings:Tf,sdp:Xx};switch(n.browser){case"chrome":if(!la||!ca||!e.shimChrome)return t("Chrome shim is not included in this adapter release."),s;if(n.version===null)return t("Chrome shim can not determine version, not shimming."),s;t("adapter.js shimming chrome."),s.browserShim=la,mr(i,n),gr(i,n),aa(i,n),mh(i,n),ca(i,n),gh(i,n),xh(i,n),_h(i,n),yh(i,n),vh(i,n),dr(i,n),pa(i,n),ma(i,n),fr(i,n),pr(i,n),ga(i,n);break;case"firefox":if(!da||!ua||!e.shimFirefox)return t("Firefox shim is not included in this adapter release."),s;t("adapter.js shimming firefox."),s.browserShim=da,mr(i,n),gr(i,n),ha(i,n),ua(i,n),Mh(i,n),bh(i,n),Th(i,n),Sh(i,n),Eh(i,n),wh(i,n),Ah(i,n),Ch(i,n),Rh(i,n),Ph(i,n),dr(i,n),ma(i,n),fr(i,n),pr(i,n);break;case"safari":if(!fa||!e.shimSafari)return t("Safari shim is not included in this adapter release."),s;t("adapter.js shimming safari."),s.browserShim=fa,mr(i,n),gr(i,n),Nh(i,n),Oh(i,n),Dh(i,n),Ih(i,n),Lh(i,n),kh(i,n),Uh(i,n),Fh(i,n),dr(i,n),pa(i,n),fr(i,n),pr(i,n),ga(i,n);break;default:t("Unsupported browser!");break}return s}var qx=If({window:typeof window=="undefined"?void 0:window}),Vh=qx;function Di(i,e,t,n){Object.defineProperty(i,e,{get:t,set:n,enumerable:!0,configurable:!0})}var ya=class{constructor(){this.chunkedMTU=16300,this._dataCount=1,this.chunk=e=>{let t=[],n=e.byteLength,s=Math.ceil(n/this.chunkedMTU),r=0,o=0;for(;o<n;){let a=Math.min(n,o+this.chunkedMTU),c=e.slice(o,a),l={__peerData:this._dataCount,n:r,data:c,total:s};t.push(l),o=a,r++}return this._dataCount++,t}}};function Yx(i){let e=0;for(let s of i)e+=s.byteLength;let t=new Uint8Array(e),n=0;for(let s of i)t.set(s,n),n+=s.byteLength;return t}var Gh=Vh.default||Vh,_r=new class{isWebRTCSupported(){return typeof RTCPeerConnection!="undefined"}isBrowserSupported(){let i=this.getBrowser(),e=this.getVersion();return this.supportedBrowsers.includes(i)?i==="chrome"?e>=this.minChromeVersion:i==="firefox"?e>=this.minFirefoxVersion:i==="safari"?!this.isIOS&&e>=this.minSafariVersion:!1:!1}getBrowser(){return Gh.browserDetails.browser}getVersion(){return Gh.browserDetails.version||0}isUnifiedPlanSupported(){let i=this.getBrowser(),e=Gh.browserDetails.version||0;if(i==="chrome"&&e<this.minChromeVersion)return!1;if(i==="firefox"&&e>=this.minFirefoxVersion)return!0;if(!window.RTCRtpTransceiver||!("currentDirection"in RTCRtpTransceiver.prototype))return!1;let t,n=!1;try{t=new RTCPeerConnection,t.addTransceiver("audio"),n=!0}catch{}finally{t&&t.close()}return n}toString(){return`Supports:
    browser:${this.getBrowser()}
    version:${this.getVersion()}
    isIOS:${this.isIOS}
    isWebRTCSupported:${this.isWebRTCSupported()}
    isBrowserSupported:${this.isBrowserSupported()}
    isUnifiedPlanSupported:${this.isUnifiedPlanSupported()}`}constructor(){this.isIOS=typeof navigator!="undefined"?["iPad","iPhone","iPod"].includes(navigator.platform):!1,this.supportedBrowsers=["firefox","chrome","safari"],this.minFirefoxVersion=59,this.minChromeVersion=72,this.minSafariVersion=605}},$x=i=>!i||/^[A-Za-z0-9]+(?:[ _-][A-Za-z0-9]+)*$/.test(i),Uf=()=>Math.random().toString(36).slice(2),Lf={iceServers:[{urls:"stun:stun.l.google.com:19302"},{urls:["turn:eu-0.turn.peerjs.com:3478","turn:us-0.turn.peerjs.com:3478"],username:"peerjs",credential:"peerjsp"}],sdpSemantics:"unified-plan"},Wh=class extends ya{noop(){}blobToArrayBuffer(e,t){let n=new FileReader;return n.onload=function(s){s.target&&t(s.target.result)},n.readAsArrayBuffer(e),n}binaryStringToArrayBuffer(e){let t=new Uint8Array(e.length);for(let n=0;n<e.length;n++)t[n]=e.charCodeAt(n)&255;return t.buffer}isSecure(){return location.protocol==="https:"}constructor(...e){super(...e),this.CLOUD_HOST="0.peerjs.com",this.CLOUD_PORT=443,this.chunkedBrowsers={Chrome:1,chrome:1},this.defaultConfig=Lf,this.browser=_r.getBrowser(),this.browserVersion=_r.getVersion(),this.pack=uh,this.unpack=hh,this.supports=function(){let t={browser:_r.isBrowserSupported(),webRTC:_r.isWebRTCSupported(),audioVideo:!1,data:!1,binaryBlob:!1,reliable:!1};if(!t.webRTC)return t;let n;try{n=new RTCPeerConnection(Lf),t.audioVideo=!0;let s;try{s=n.createDataChannel("_PEERJSTEST",{ordered:!0}),t.data=!0,t.reliable=!!s.ordered;try{s.binaryType="blob",t.binaryBlob=!_r.isIOS}catch{}}catch{}finally{s&&s.close()}}catch{}finally{n&&n.close()}return t}(),this.validateId=$x,this.randomToken=Uf}},Zt=new Wh,Jx="PeerJS: ",Df;(function(i){i[i.Disabled=0]="Disabled",i[i.Errors=1]="Errors",i[i.Warnings=2]="Warnings",i[i.All=3]="All"})(Df||(Df={}));var Xh=class{get logLevel(){return this._logLevel}set logLevel(e){this._logLevel=e}log(...e){this._logLevel>=3&&this._print(3,...e)}warn(...e){this._logLevel>=2&&this._print(2,...e)}error(...e){this._logLevel>=1&&this._print(1,...e)}setLogFunction(e){this._print=e}_print(e,...t){let n=[Jx,...t];for(let s in n)n[s]instanceof Error&&(n[s]="("+n[s].name+") "+n[s].message);e>=3?console.log(...n):e>=2?console.warn("WARNING",...n):e>=1&&console.error("ERROR",...n)}constructor(){this._logLevel=0}},Re=new Xh,nu={},Zx=Object.prototype.hasOwnProperty,Yt="~";function br(){}Object.create&&(br.prototype=Object.create(null),new br().__proto__||(Yt=!1));function jx(i,e,t){this.fn=i,this.context=e,this.once=t||!1}function Nf(i,e,t,n,s){if(typeof t!="function")throw new TypeError("The listener must be a function");var r=new jx(t,n||i,s),o=Yt?Yt+e:e;return i._events[o]?i._events[o].fn?i._events[o]=[i._events[o],r]:i._events[o].push(r):(i._events[o]=r,i._eventsCount++),i}function _a(i,e){--i._eventsCount===0?i._events=new br:delete i._events[e]}function Vt(){this._events=new br,this._eventsCount=0}Vt.prototype.eventNames=function(){var e=[],t,n;if(this._eventsCount===0)return e;for(n in t=this._events)Zx.call(t,n)&&e.push(Yt?n.slice(1):n);return Object.getOwnPropertySymbols?e.concat(Object.getOwnPropertySymbols(t)):e};Vt.prototype.listeners=function(e){var t=Yt?Yt+e:e,n=this._events[t];if(!n)return[];if(n.fn)return[n.fn];for(var s=0,r=n.length,o=new Array(r);s<r;s++)o[s]=n[s].fn;return o};Vt.prototype.listenerCount=function(e){var t=Yt?Yt+e:e,n=this._events[t];return n?n.fn?1:n.length:0};Vt.prototype.emit=function(e,t,n,s,r,o){var a=Yt?Yt+e:e;if(!this._events[a])return!1;var c=this._events[a],l=arguments.length,h,u;if(c.fn){switch(c.once&&this.removeListener(e,c.fn,void 0,!0),l){case 1:return c.fn.call(c.context),!0;case 2:return c.fn.call(c.context,t),!0;case 3:return c.fn.call(c.context,t,n),!0;case 4:return c.fn.call(c.context,t,n,s),!0;case 5:return c.fn.call(c.context,t,n,s,r),!0;case 6:return c.fn.call(c.context,t,n,s,r,o),!0}for(u=1,h=new Array(l-1);u<l;u++)h[u-1]=arguments[u];c.fn.apply(c.context,h)}else{var d=c.length,f;for(u=0;u<d;u++)switch(c[u].once&&this.removeListener(e,c[u].fn,void 0,!0),l){case 1:c[u].fn.call(c[u].context);break;case 2:c[u].fn.call(c[u].context,t);break;case 3:c[u].fn.call(c[u].context,t,n);break;case 4:c[u].fn.call(c[u].context,t,n,s);break;default:if(!h)for(f=1,h=new Array(l-1);f<l;f++)h[f-1]=arguments[f];c[u].fn.apply(c[u].context,h)}}return!0};Vt.prototype.on=function(e,t,n){return Nf(this,e,t,n,!1)};Vt.prototype.once=function(e,t,n){return Nf(this,e,t,n,!0)};Vt.prototype.removeListener=function(e,t,n,s){var r=Yt?Yt+e:e;if(!this._events[r])return this;if(!t)return _a(this,r),this;var o=this._events[r];if(o.fn)o.fn===t&&(!s||o.once)&&(!n||o.context===n)&&_a(this,r);else{for(var a=0,c=[],l=o.length;a<l;a++)(o[a].fn!==t||s&&!o[a].once||n&&o[a].context!==n)&&c.push(o[a]);c.length?this._events[r]=c.length===1?c[0]:c:_a(this,r)}return this};Vt.prototype.removeAllListeners=function(e){var t;return e?(t=Yt?Yt+e:e,this._events[t]&&_a(this,t)):(this._events=new br,this._eventsCount=0),this};Vt.prototype.off=Vt.prototype.removeListener;Vt.prototype.addListener=Vt.prototype.on;Vt.prefixed=Yt;Vt.EventEmitter=Vt;nu=Vt;var Ui={};Di(Ui,"ConnectionType",()=>Rn);Di(Ui,"PeerErrorType",()=>bt);Di(Ui,"BaseConnectionErrorType",()=>Mr);Di(Ui,"DataConnectionErrorType",()=>Sr);Di(Ui,"SerializationType",()=>As);Di(Ui,"SocketEventType",()=>Cn);Di(Ui,"ServerMessageType",()=>Lt);var Rn;(function(i){i.Data="data",i.Media="media"})(Rn||(Rn={}));var bt;(function(i){i.BrowserIncompatible="browser-incompatible",i.Disconnected="disconnected",i.InvalidID="invalid-id",i.InvalidKey="invalid-key",i.Network="network",i.PeerUnavailable="peer-unavailable",i.SslUnavailable="ssl-unavailable",i.ServerError="server-error",i.SocketError="socket-error",i.SocketClosed="socket-closed",i.UnavailableID="unavailable-id",i.WebRTC="webrtc"})(bt||(bt={}));var Mr;(function(i){i.NegotiationFailed="negotiation-failed",i.ConnectionClosed="connection-closed"})(Mr||(Mr={}));var Sr;(function(i){i.NotOpenYet="not-open-yet",i.MessageToBig="message-too-big"})(Sr||(Sr={}));var As;(function(i){i.Binary="binary",i.BinaryUTF8="binary-utf8",i.JSON="json",i.None="raw"})(As||(As={}));var Cn;(function(i){i.Message="message",i.Disconnected="disconnected",i.Error="error",i.Close="close"})(Cn||(Cn={}));var Lt;(function(i){i.Heartbeat="HEARTBEAT",i.Candidate="CANDIDATE",i.Offer="OFFER",i.Answer="ANSWER",i.Open="OPEN",i.Error="ERROR",i.IdTaken="ID-TAKEN",i.InvalidKey="INVALID-KEY",i.Leave="LEAVE",i.Expire="EXPIRE"})(Lt||(Lt={}));var iu={};iu=JSON.parse('{"name":"peerjs","version":"1.5.4","keywords":["peerjs","webrtc","p2p","rtc"],"description":"PeerJS client","homepage":"https://peerjs.com","bugs":{"url":"https://github.com/peers/peerjs/issues"},"repository":{"type":"git","url":"https://github.com/peers/peerjs"},"license":"MIT","contributors":["Michelle Bu <michelle@michellebu.com>","afrokick <devbyru@gmail.com>","ericz <really.ez@gmail.com>","Jairo <kidandcat@gmail.com>","Jonas Gloning <34194370+jonasgloning@users.noreply.github.com>","Jairo Caro-Accino Viciana <jairo@galax.be>","Carlos Caballero <carlos.caballero.gonzalez@gmail.com>","hc <hheennrryy@gmail.com>","Muhammad Asif <capripio@gmail.com>","PrashoonB <prashoonbhattacharjee@gmail.com>","Harsh Bardhan Mishra <47351025+HarshCasper@users.noreply.github.com>","akotynski <aleksanderkotbury@gmail.com>","lmb <i@lmb.io>","Jairooo <jairocaro@msn.com>","Moritz St\xFCckler <moritz.stueckler@gmail.com>","Simon <crydotsnakegithub@gmail.com>","Denis Lukov <denismassters@gmail.com>","Philipp Hancke <fippo@andyet.net>","Hans Oksendahl <hansoksendahl@gmail.com>","Jess <jessachandler@gmail.com>","khankuan <khankuan@gmail.com>","DUODVK <kurmanov.work@gmail.com>","XiZhao <kwang1imsa@gmail.com>","Matthias Lohr <matthias@lohr.me>","=frank tree <=frnktrb@googlemail.com>","Andre Eckardt <aeckardt@outlook.com>","Chris Cowan <agentme49@gmail.com>","Alex Chuev <alex@chuev.com>","alxnull <alxnull@e.mail.de>","Yemel Jardi <angel.jardi@gmail.com>","Ben Parnell <benjaminparnell.94@gmail.com>","Benny Lichtner <bennlich@gmail.com>","fresheneesz <bitetrudpublic@gmail.com>","bob.barstead@exaptive.com <bob.barstead@exaptive.com>","chandika <chandika@gmail.com>","emersion <contact@emersion.fr>","Christopher Van <cvan@users.noreply.github.com>","eddieherm <edhermoso@gmail.com>","Eduardo Pinho <enet4mikeenet@gmail.com>","Evandro Zanatta <ezanatta@tray.net.br>","Gardner Bickford <gardner@users.noreply.github.com>","Gian Luca <gianluca.cecchi@cynny.com>","PatrickJS <github@gdi2290.com>","jonnyf <github@jonathanfoss.co.uk>","Hizkia Felix <hizkifw@gmail.com>","Hristo Oskov <hristo.oskov@gmail.com>","Isaac Madwed <i.madwed@gmail.com>","Ilya Konanykhin <ilya.konanykhin@gmail.com>","jasonbarry <jasbarry@me.com>","Jonathan Burke <jonathan.burke.1311@googlemail.com>","Josh Hamit <josh.hamit@gmail.com>","Jordan Austin <jrax86@gmail.com>","Joel Wetzell <jwetzell@yahoo.com>","xizhao <kevin.wang@cloudera.com>","Alberto Torres <kungfoobar@gmail.com>","Jonathan Mayol <mayoljonathan@gmail.com>","Jefferson Felix <me@jsfelix.dev>","Rolf Erik Lekang <me@rolflekang.com>","Kevin Mai-Husan Chia <mhchia@users.noreply.github.com>","Pepijn de Vos <pepijndevos@gmail.com>","JooYoung <qkdlql@naver.com>","Tobias Speicher <rootcommander@gmail.com>","Steve Blaurock <sblaurock@gmail.com>","Kyrylo Shegeda <shegeda@ualberta.ca>","Diwank Singh Tomer <singh@diwank.name>","So\u0308ren Balko <Soeren.Balko@gmail.com>","Arpit Solanki <solankiarpit1997@gmail.com>","Yuki Ito <yuki@gnnk.net>","Artur Zayats <zag2art@gmail.com>"],"funding":{"type":"opencollective","url":"https://opencollective.com/peer"},"collective":{"type":"opencollective","url":"https://opencollective.com/peer"},"files":["dist/*"],"sideEffects":["lib/global.ts","lib/supports.ts"],"main":"dist/bundler.cjs","module":"dist/bundler.mjs","browser-minified":"dist/peerjs.min.js","browser-unminified":"dist/peerjs.js","browser-minified-msgpack":"dist/serializer.msgpack.mjs","types":"dist/types.d.ts","engines":{"node":">= 14"},"targets":{"types":{"source":"lib/exports.ts"},"main":{"source":"lib/exports.ts","sourceMap":{"inlineSources":true}},"module":{"source":"lib/exports.ts","includeNodeModules":["eventemitter3"],"sourceMap":{"inlineSources":true}},"browser-minified":{"context":"browser","outputFormat":"global","optimize":true,"engines":{"browsers":"chrome >= 83, edge >= 83, firefox >= 80, safari >= 15"},"source":"lib/global.ts"},"browser-unminified":{"context":"browser","outputFormat":"global","optimize":false,"engines":{"browsers":"chrome >= 83, edge >= 83, firefox >= 80, safari >= 15"},"source":"lib/global.ts"},"browser-minified-msgpack":{"context":"browser","outputFormat":"esmodule","isLibrary":true,"optimize":true,"engines":{"browsers":"chrome >= 83, edge >= 83, firefox >= 102, safari >= 15"},"source":"lib/dataconnection/StreamConnection/MsgPack.ts"}},"scripts":{"contributors":"git-authors-cli --print=false && prettier --write package.json && git add package.json package-lock.json && git commit -m \\"chore(contributors): update and sort contributors list\\"","check":"tsc --noEmit && tsc -p e2e/tsconfig.json --noEmit","watch":"parcel watch","build":"rm -rf dist && parcel build","prepublishOnly":"npm run build","test":"jest","test:watch":"jest --watch","coverage":"jest --coverage --collectCoverageFrom=\\"./lib/**\\"","format":"prettier --write .","format:check":"prettier --check .","semantic-release":"semantic-release","e2e":"wdio run e2e/wdio.local.conf.ts","e2e:bstack":"wdio run e2e/wdio.bstack.conf.ts"},"devDependencies":{"@parcel/config-default":"^2.9.3","@parcel/packager-ts":"^2.9.3","@parcel/transformer-typescript-tsc":"^2.9.3","@parcel/transformer-typescript-types":"^2.9.3","@semantic-release/changelog":"^6.0.1","@semantic-release/git":"^10.0.1","@swc/core":"^1.3.27","@swc/jest":"^0.2.24","@types/jasmine":"^4.3.4","@wdio/browserstack-service":"^8.11.2","@wdio/cli":"^8.11.2","@wdio/globals":"^8.11.2","@wdio/jasmine-framework":"^8.11.2","@wdio/local-runner":"^8.11.2","@wdio/spec-reporter":"^8.11.2","@wdio/types":"^8.10.4","http-server":"^14.1.1","jest":"^29.3.1","jest-environment-jsdom":"^29.3.1","mock-socket":"^9.0.0","parcel":"^2.9.3","prettier":"^3.0.0","semantic-release":"^21.0.0","ts-node":"^10.9.1","typescript":"^5.0.0","wdio-geckodriver-service":"^5.0.1"},"dependencies":{"@msgpack/msgpack":"^2.8.0","eventemitter3":"^4.0.7","peerjs-js-binarypack":"^2.1.0","webrtc-adapter":"^9.0.0"},"alias":{"process":false,"buffer":false}}');var qh=class extends nu.EventEmitter{constructor(e,t,n,s,r,o=5e3){super(),this.pingInterval=o,this._disconnected=!0,this._messagesQueue=[];let a=e?"wss://":"ws://";this._baseUrl=a+t+":"+n+s+"peerjs?key="+r}start(e,t){this._id=e;let n=`${this._baseUrl}&id=${e}&token=${t}`;this._socket||!this._disconnected||(this._socket=new WebSocket(n+"&version="+iu.version),this._disconnected=!1,this._socket.onmessage=s=>{let r;try{r=JSON.parse(s.data),Re.log("Server message received:",r)}catch{Re.log("Invalid server message",s.data);return}this.emit(Cn.Message,r)},this._socket.onclose=s=>{this._disconnected||(Re.log("Socket closed.",s),this._cleanup(),this._disconnected=!0,this.emit(Cn.Disconnected))},this._socket.onopen=()=>{this._disconnected||(this._sendQueuedMessages(),Re.log("Socket open"),this._scheduleHeartbeat())})}_scheduleHeartbeat(){this._wsPingTimer=setTimeout(()=>{this._sendHeartbeat()},this.pingInterval)}_sendHeartbeat(){if(!this._wsOpen()){Re.log("Cannot send heartbeat, because socket closed");return}let e=JSON.stringify({type:Lt.Heartbeat});this._socket.send(e),this._scheduleHeartbeat()}_wsOpen(){return!!this._socket&&this._socket.readyState===1}_sendQueuedMessages(){let e=[...this._messagesQueue];this._messagesQueue=[];for(let t of e)this.send(t)}send(e){if(this._disconnected)return;if(!this._id){this._messagesQueue.push(e);return}if(!e.type){this.emit(Cn.Error,"Invalid message");return}if(!this._wsOpen())return;let t=JSON.stringify(e);this._socket.send(t)}close(){this._disconnected||(this._cleanup(),this._disconnected=!0)}_cleanup(){this._socket&&(this._socket.onopen=this._socket.onmessage=this._socket.onclose=null,this._socket.close(),this._socket=void 0),clearTimeout(this._wsPingTimer)}},xa=class{constructor(e){this.connection=e}startConnection(e){let t=this._startPeerConnection();if(this.connection.peerConnection=t,this.connection.type===Rn.Media&&e._stream&&this._addTracksToConnection(e._stream,t),e.originator){let n=this.connection,s={ordered:!!e.reliable},r=t.createDataChannel(n.label,s);n._initializeDataChannel(r),this._makeOffer()}else this.handleSDP("OFFER",e.sdp)}_startPeerConnection(){Re.log("Creating RTCPeerConnection.");let e=new RTCPeerConnection(this.connection.provider.options.config);return this._setupListeners(e),e}_setupListeners(e){let t=this.connection.peer,n=this.connection.connectionId,s=this.connection.type,r=this.connection.provider;Re.log("Listening for ICE candidates."),e.onicecandidate=o=>{!o.candidate||!o.candidate.candidate||(Re.log(`Received ICE candidates for ${t}:`,o.candidate),r.socket.send({type:Lt.Candidate,payload:{candidate:o.candidate,type:s,connectionId:n},dst:t}))},e.oniceconnectionstatechange=()=>{switch(e.iceConnectionState){case"failed":Re.log("iceConnectionState is failed, closing connections to "+t),this.connection.emitError(Mr.NegotiationFailed,"Negotiation of connection to "+t+" failed."),this.connection.close();break;case"closed":Re.log("iceConnectionState is closed, closing connections to "+t),this.connection.emitError(Mr.ConnectionClosed,"Connection to "+t+" closed."),this.connection.close();break;case"disconnected":Re.log("iceConnectionState changed to disconnected on the connection with "+t);break;case"completed":e.onicecandidate=()=>{};break}this.connection.emit("iceStateChanged",e.iceConnectionState)},Re.log("Listening for data channel"),e.ondatachannel=o=>{Re.log("Received data channel");let a=o.channel;r.getConnection(t,n)._initializeDataChannel(a)},Re.log("Listening for remote stream"),e.ontrack=o=>{Re.log("Received remote stream");let a=o.streams[0],c=r.getConnection(t,n);if(c.type===Rn.Media){let l=c;this._addStreamToMediaConnection(a,l)}}}cleanup(){Re.log("Cleaning up PeerConnection to "+this.connection.peer);let e=this.connection.peerConnection;if(!e)return;this.connection.peerConnection=null,e.onicecandidate=e.oniceconnectionstatechange=e.ondatachannel=e.ontrack=()=>{};let t=e.signalingState!=="closed",n=!1,s=this.connection.dataChannel;s&&(n=!!s.readyState&&s.readyState!=="closed"),(t||n)&&e.close()}async _makeOffer(){let e=this.connection.peerConnection,t=this.connection.provider;try{let n=await e.createOffer(this.connection.options.constraints);Re.log("Created offer."),this.connection.options.sdpTransform&&typeof this.connection.options.sdpTransform=="function"&&(n.sdp=this.connection.options.sdpTransform(n.sdp)||n.sdp);try{await e.setLocalDescription(n),Re.log("Set localDescription:",n,`for:${this.connection.peer}`);let s={sdp:n,type:this.connection.type,connectionId:this.connection.connectionId,metadata:this.connection.metadata};if(this.connection.type===Rn.Data){let r=this.connection;s={...s,label:r.label,reliable:r.reliable,serialization:r.serialization}}t.socket.send({type:Lt.Offer,payload:s,dst:this.connection.peer})}catch(s){s!="OperationError: Failed to set local offer sdp: Called in wrong state: kHaveRemoteOffer"&&(t.emitError(bt.WebRTC,s),Re.log("Failed to setLocalDescription, ",s))}}catch(n){t.emitError(bt.WebRTC,n),Re.log("Failed to createOffer, ",n)}}async _makeAnswer(){let e=this.connection.peerConnection,t=this.connection.provider;try{let n=await e.createAnswer();Re.log("Created answer."),this.connection.options.sdpTransform&&typeof this.connection.options.sdpTransform=="function"&&(n.sdp=this.connection.options.sdpTransform(n.sdp)||n.sdp);try{await e.setLocalDescription(n),Re.log("Set localDescription:",n,`for:${this.connection.peer}`),t.socket.send({type:Lt.Answer,payload:{sdp:n,type:this.connection.type,connectionId:this.connection.connectionId},dst:this.connection.peer})}catch(s){t.emitError(bt.WebRTC,s),Re.log("Failed to setLocalDescription, ",s)}}catch(n){t.emitError(bt.WebRTC,n),Re.log("Failed to create answer, ",n)}}async handleSDP(e,t){t=new RTCSessionDescription(t);let n=this.connection.peerConnection,s=this.connection.provider;Re.log("Setting remote description",t);let r=this;try{await n.setRemoteDescription(t),Re.log(`Set remoteDescription:${e} for:${this.connection.peer}`),e==="OFFER"&&await r._makeAnswer()}catch(o){s.emitError(bt.WebRTC,o),Re.log("Failed to setRemoteDescription, ",o)}}async handleCandidate(e){Re.log("handleCandidate:",e);try{await this.connection.peerConnection.addIceCandidate(e),Re.log(`Added ICE candidate for:${this.connection.peer}`)}catch(t){this.connection.provider.emitError(bt.WebRTC,t),Re.log("Failed to handleCandidate, ",t)}}_addTracksToConnection(e,t){if(Re.log(`add tracks from stream ${e.id} to peer connection`),!t.addTrack)return Re.error("Your browser does't support RTCPeerConnection#addTrack. Ignored.");e.getTracks().forEach(n=>{t.addTrack(n,e)})}_addStreamToMediaConnection(e,t){Re.log(`add stream ${e.id} to media connection ${t.connectionId}`),t.addStream(e)}},va=class extends nu.EventEmitter{emitError(e,t){Re.error("Error:",t),this.emit("error",new Yh(`${e}`,t))}},Yh=class extends Error{constructor(e,t){typeof t=="string"?super(t):(super(),Object.assign(this,t)),this.type=e}},ba=class extends va{get open(){return this._open}constructor(e,t,n){super(),this.peer=e,this.provider=t,this.options=n,this._open=!1,this.metadata=n.metadata}},Kh,xr=class xr extends ba{get type(){return Rn.Media}get localStream(){return this._localStream}get remoteStream(){return this._remoteStream}constructor(e,t,n){super(e,t,n),this._localStream=this.options._stream,this.connectionId=this.options.connectionId||xr.ID_PREFIX+Zt.randomToken(),this._negotiator=new xa(this),this._localStream&&this._negotiator.startConnection({_stream:this._localStream,originator:!0})}_initializeDataChannel(e){this.dataChannel=e,this.dataChannel.onopen=()=>{Re.log(`DC#${this.connectionId} dc connection success`),this.emit("willCloseOnRemote")},this.dataChannel.onclose=()=>{Re.log(`DC#${this.connectionId} dc closed for:`,this.peer),this.close()}}addStream(e){Re.log("Receiving stream",e),this._remoteStream=e,super.emit("stream",e)}handleMessage(e){let t=e.type,n=e.payload;switch(e.type){case Lt.Answer:this._negotiator.handleSDP(t,n.sdp),this._open=!0;break;case Lt.Candidate:this._negotiator.handleCandidate(n.candidate);break;default:Re.warn(`Unrecognized message type:${t} from peer:${this.peer}`);break}}answer(e,t={}){if(this._localStream){Re.warn("Local stream already exists on this MediaConnection. Are you answering a call twice?");return}this._localStream=e,t&&t.sdpTransform&&(this.options.sdpTransform=t.sdpTransform),this._negotiator.startConnection({...this.options._payload,_stream:e});let n=this.provider._getMessages(this.connectionId);for(let s of n)this.handleMessage(s);this._open=!0}close(){this._negotiator&&(this._negotiator.cleanup(),this._negotiator=null),this._localStream=null,this._remoteStream=null,this.provider&&(this.provider._removeConnection(this),this.provider=null),this.options&&this.options._stream&&(this.options._stream=null),this.open&&(this._open=!1,super.emit("close"))}};Kh=new WeakMap,Cs(xr,Kh,xr.ID_PREFIX="mc_");var Ma=xr,$h=class{constructor(e){this._options=e}_buildRequest(e){let t=this._options.secure?"https":"http",{host:n,port:s,path:r,key:o}=this._options,a=new URL(`${t}://${n}:${s}${r}${o}/${e}`);return a.searchParams.set("ts",`${Date.now()}${Math.random()}`),a.searchParams.set("version",iu.version),fetch(a.href,{referrerPolicy:this._options.referrerPolicy})}async retrieveId(){try{let e=await this._buildRequest("id");if(e.status!==200)throw new Error(`Error. Status:${e.status}`);return e.text()}catch(e){Re.error("Error retrieving ID",e);let t="";throw this._options.path==="/"&&this._options.host!==Zt.CLOUD_HOST&&(t=" If you passed in a `path` to your self-hosted PeerServer, you'll also need to pass in that same path when creating a new Peer."),new Error("Could not get an ID from the server."+t)}}async listAllPeers(){try{let e=await this._buildRequest("peers");if(e.status!==200){if(e.status===401){let t="";throw this._options.host===Zt.CLOUD_HOST?t="It looks like you're using the cloud server. You can email team@peerjs.com to enable peer listing for your API key.":t="You need to enable `allow_discovery` on your self-hosted PeerServer to use this feature.",new Error("It doesn't look like you have permission to list peers IDs. "+t)}throw new Error(`Error. Status:${e.status}`)}return e.json()}catch(e){throw Re.error("Error retrieving list peers",e),new Error("Could not get list peers from the server."+e)}}},Qh,eu,Li=class Li extends ba{get type(){return Rn.Data}constructor(e,t,n){super(e,t,n),this.connectionId=this.options.connectionId||Li.ID_PREFIX+Uf(),this.label=this.options.label||this.connectionId,this.reliable=!!this.options.reliable,this._negotiator=new xa(this),this._negotiator.startConnection(this.options._payload||{originator:!0,reliable:this.reliable})}_initializeDataChannel(e){this.dataChannel=e,this.dataChannel.onopen=()=>{Re.log(`DC#${this.connectionId} dc connection success`),this._open=!0,this.emit("open")},this.dataChannel.onmessage=t=>{Re.log(`DC#${this.connectionId} dc onmessage:`,t.data)},this.dataChannel.onclose=()=>{Re.log(`DC#${this.connectionId} dc closed for:`,this.peer),this.close()}}close(e){if(e!=null&&e.flush){this.send({__peerData:{type:"close"}});return}this._negotiator&&(this._negotiator.cleanup(),this._negotiator=null),this.provider&&(this.provider._removeConnection(this),this.provider=null),this.dataChannel&&(this.dataChannel.onopen=null,this.dataChannel.onmessage=null,this.dataChannel.onclose=null,this.dataChannel=null),this.open&&(this._open=!1,super.emit("close"))}send(e,t=!1){if(!this.open){this.emitError(Sr.NotOpenYet,"Connection is not open. You should listen for the `open` event before sending messages.");return}return this._send(e,t)}async handleMessage(e){let t=e.payload;switch(e.type){case Lt.Answer:await this._negotiator.handleSDP(e.type,t.sdp);break;case Lt.Candidate:await this._negotiator.handleCandidate(t.candidate);break;default:Re.warn("Unrecognized message type:",e.type,"from peer:",this.peer);break}}};Qh=new WeakMap,eu=new WeakMap,Cs(Li,Qh,Li.ID_PREFIX="dc_"),Cs(Li,eu,Li.MAX_BUFFERED_AMOUNT=8388608);var Sa=Li,Er=class extends Sa{get bufferSize(){return this._bufferSize}_initializeDataChannel(e){super._initializeDataChannel(e),this.dataChannel.binaryType="arraybuffer",this.dataChannel.addEventListener("message",t=>this._handleDataMessage(t))}_bufferedSend(e){(this._buffering||!this._trySend(e))&&(this._buffer.push(e),this._bufferSize=this._buffer.length)}_trySend(e){if(!this.open)return!1;if(this.dataChannel.bufferedAmount>Sa.MAX_BUFFERED_AMOUNT)return this._buffering=!0,setTimeout(()=>{this._buffering=!1,this._tryBuffer()},50),!1;try{this.dataChannel.send(e)}catch(t){return Re.error(`DC#:${this.connectionId} Error when sending:`,t),this._buffering=!0,this.close(),!1}return!0}_tryBuffer(){if(!this.open||this._buffer.length===0)return;let e=this._buffer[0];this._trySend(e)&&(this._buffer.shift(),this._bufferSize=this._buffer.length,this._tryBuffer())}close(e){if(e!=null&&e.flush){this.send({__peerData:{type:"close"}});return}this._buffer=[],this._bufferSize=0,super.close()}constructor(...e){super(...e),this._buffer=[],this._bufferSize=0,this._buffering=!1}},yr=class extends Er{close(e){super.close(e),this._chunkedData={}}constructor(e,t,n){super(e,t,n),this.chunker=new ya,this.serialization=As.Binary,this._chunkedData={}}_handleDataMessage({data:e}){let t=hh(e),n=t.__peerData;if(n){if(n.type==="close"){this.close();return}this._handleChunk(t);return}this.emit("data",t)}_handleChunk(e){let t=e.__peerData,n=this._chunkedData[t]||{data:[],count:0,total:e.total};if(n.data[e.n]=new Uint8Array(e.data),n.count++,this._chunkedData[t]=n,n.total===n.count){delete this._chunkedData[t];let s=Yx(n.data);this._handleDataMessage({data:s})}}_send(e,t){let n=uh(e);if(n instanceof Promise)return this._send_blob(n);if(!t&&n.byteLength>this.chunker.chunkedMTU){this._sendChunks(n);return}this._bufferedSend(n)}async _send_blob(e){let t=await e;if(t.byteLength>this.chunker.chunkedMTU){this._sendChunks(t);return}this._bufferedSend(t)}_sendChunks(e){let t=this.chunker.chunk(e);Re.log(`DC#${this.connectionId} Try to send ${t.length} chunks...`);for(let n of t)this.send(n,!0)}},Jh=class extends Er{_handleDataMessage({data:e}){super.emit("data",e)}_send(e,t){this._bufferedSend(e)}constructor(...e){super(...e),this.serialization=As.None}},Zh=class extends Er{_handleDataMessage({data:e}){let t=this.parse(this.decoder.decode(e)),n=t.__peerData;if(n&&n.type==="close"){this.close();return}this.emit("data",t)}_send(e,t){let n=this.encoder.encode(this.stringify(e));if(n.byteLength>=Zt.chunkedMTU){this.emitError(Sr.MessageToBig,"Message too big for JSON channel");return}this._bufferedSend(n)}constructor(...e){super(...e),this.serialization=As.JSON,this.encoder=new TextEncoder,this.decoder=new TextDecoder,this.stringify=JSON.stringify,this.parse=JSON.parse}};var tu,vr=class vr extends va{get id(){return this._id}get options(){return this._options}get open(){return this._open}get socket(){return this._socket}get connections(){let e=Object.create(null);for(let[t,n]of this._connections)e[t]=n;return e}get destroyed(){return this._destroyed}get disconnected(){return this._disconnected}constructor(e,t){super(),this._serializers={raw:Jh,json:Zh,binary:yr,"binary-utf8":yr,default:yr},this._id=null,this._lastServerId=null,this._destroyed=!1,this._disconnected=!1,this._open=!1,this._connections=new Map,this._lostMessages=new Map;let n;if(e&&e.constructor==Object?t=e:e&&(n=e.toString()),t={debug:0,host:Zt.CLOUD_HOST,port:Zt.CLOUD_PORT,path:"/",key:vr.DEFAULT_KEY,token:Zt.randomToken(),config:Zt.defaultConfig,referrerPolicy:"strict-origin-when-cross-origin",serializers:{},...t},this._options=t,this._serializers={...this._serializers,...this.options.serializers},this._options.host==="/"&&(this._options.host=window.location.hostname),this._options.path&&(this._options.path[0]!=="/"&&(this._options.path="/"+this._options.path),this._options.path[this._options.path.length-1]!=="/"&&(this._options.path+="/")),this._options.secure===void 0&&this._options.host!==Zt.CLOUD_HOST?this._options.secure=Zt.isSecure():this._options.host==Zt.CLOUD_HOST&&(this._options.secure=!0),this._options.logFunction&&Re.setLogFunction(this._options.logFunction),Re.logLevel=this._options.debug||0,this._api=new $h(t),this._socket=this._createServerConnection(),!Zt.supports.audioVideo&&!Zt.supports.data){this._delayedAbort(bt.BrowserIncompatible,"The current browser does not support WebRTC");return}if(n&&!Zt.validateId(n)){this._delayedAbort(bt.InvalidID,`ID "${n}" is invalid`);return}n?this._initialize(n):this._api.retrieveId().then(s=>this._initialize(s)).catch(s=>this._abort(bt.ServerError,s))}_createServerConnection(){let e=new qh(this._options.secure,this._options.host,this._options.port,this._options.path,this._options.key,this._options.pingInterval);return e.on(Cn.Message,t=>{this._handleMessage(t)}),e.on(Cn.Error,t=>{this._abort(bt.SocketError,t)}),e.on(Cn.Disconnected,()=>{this.disconnected||(this.emitError(bt.Network,"Lost connection to server."),this.disconnect())}),e.on(Cn.Close,()=>{this.disconnected||this._abort(bt.SocketClosed,"Underlying socket is already closed.")}),e}_initialize(e){this._id=e,this.socket.start(e,this._options.token)}_handleMessage(e){let t=e.type,n=e.payload,s=e.src;switch(t){case Lt.Open:this._lastServerId=this.id,this._open=!0,this.emit("open",this.id);break;case Lt.Error:this._abort(bt.ServerError,n.msg);break;case Lt.IdTaken:this._abort(bt.UnavailableID,`ID "${this.id}" is taken`);break;case Lt.InvalidKey:this._abort(bt.InvalidKey,`API KEY "${this._options.key}" is invalid`);break;case Lt.Leave:Re.log(`Received leave message from ${s}`),this._cleanupPeer(s),this._connections.delete(s);break;case Lt.Expire:this.emitError(bt.PeerUnavailable,`Could not connect to peer ${s}`);break;case Lt.Offer:{let r=n.connectionId,o=this.getConnection(s,r);if(o&&(o.close(),Re.warn(`Offer received for existing Connection ID:${r}`)),n.type===Rn.Media){let c=new Ma(s,this,{connectionId:r,_payload:n,metadata:n.metadata});o=c,this._addConnection(s,o),this.emit("call",c)}else if(n.type===Rn.Data){let c=new this._serializers[n.serialization](s,this,{connectionId:r,_payload:n,metadata:n.metadata,label:n.label,serialization:n.serialization,reliable:n.reliable});o=c,this._addConnection(s,o),this.emit("connection",c)}else{Re.warn(`Received malformed connection type:${n.type}`);return}let a=this._getMessages(r);for(let c of a)o.handleMessage(c);break}default:{if(!n){Re.warn(`You received a malformed message from ${s} of type ${t}`);return}let r=n.connectionId,o=this.getConnection(s,r);o&&o.peerConnection?o.handleMessage(e):r?this._storeMessage(r,e):Re.warn("You received an unrecognized message:",e);break}}}_storeMessage(e,t){this._lostMessages.has(e)||this._lostMessages.set(e,[]),this._lostMessages.get(e).push(t)}_getMessages(e){let t=this._lostMessages.get(e);return t?(this._lostMessages.delete(e),t):[]}connect(e,t={}){if(t={serialization:"default",...t},this.disconnected){Re.warn("You cannot connect to a new Peer because you called .disconnect() on this Peer and ended your connection with the server. You can create a new Peer to reconnect, or call reconnect on this peer if you believe its ID to still be available."),this.emitError(bt.Disconnected,"Cannot connect to new Peer after disconnecting from server.");return}let n=new this._serializers[t.serialization](e,this,t);return this._addConnection(e,n),n}call(e,t,n={}){if(this.disconnected){Re.warn("You cannot connect to a new Peer because you called .disconnect() on this Peer and ended your connection with the server. You can create a new Peer to reconnect."),this.emitError(bt.Disconnected,"Cannot connect to new Peer after disconnecting from server.");return}if(!t){Re.error("To call a peer, you must provide a stream from your browser's `getUserMedia`.");return}let s=new Ma(e,this,{...n,_stream:t});return this._addConnection(e,s),s}_addConnection(e,t){Re.log(`add connection ${t.type}:${t.connectionId} to peerId:${e}`),this._connections.has(e)||this._connections.set(e,[]),this._connections.get(e).push(t)}_removeConnection(e){let t=this._connections.get(e.peer);if(t){let n=t.indexOf(e);n!==-1&&t.splice(n,1)}this._lostMessages.delete(e.connectionId)}getConnection(e,t){let n=this._connections.get(e);if(!n)return null;for(let s of n)if(s.connectionId===t)return s;return null}_delayedAbort(e,t){setTimeout(()=>{this._abort(e,t)},0)}_abort(e,t){Re.error("Aborting!"),this.emitError(e,t),this._lastServerId?this.disconnect():this.destroy()}destroy(){this.destroyed||(Re.log(`Destroy peer with ID:${this.id}`),this.disconnect(),this._cleanup(),this._destroyed=!0,this.emit("close"))}_cleanup(){for(let e of this._connections.keys())this._cleanupPeer(e),this._connections.delete(e);this.socket.removeAllListeners()}_cleanupPeer(e){let t=this._connections.get(e);if(t)for(let n of t)n.close()}disconnect(){if(this.disconnected)return;let e=this.id;Re.log(`Disconnect peer with ID:${e}`),this._disconnected=!0,this._open=!1,this.socket.close(),this._lastServerId=e,this._id=null,this.emit("disconnected",e)}reconnect(){if(this.disconnected&&!this.destroyed)Re.log(`Attempting reconnection to server with ID ${this._lastServerId}`),this._disconnected=!1,this._initialize(this._lastServerId);else{if(this.destroyed)throw new Error("This peer cannot reconnect to the server. It has already been destroyed.");if(!this.disconnected&&!this.open)Re.error("In a hurry? We're still trying to make the initial connection!");else throw new Error(`Peer ${this.id} cannot reconnect because it is not disconnected from the server!`)}}listAllPeers(e=t=>{}){this._api.listAllPeers().then(t=>e(t)).catch(t=>this._abort(bt.ServerError,t))}};tu=new WeakMap,Cs(vr,tu,vr.DEFAULT_KEY="peerjs");var jh=vr;var su=jh;var kf="deniislam-city-room-1",Of={debug:0,config:{iceServers:[{urls:"stun:stun.l.google.com:19302"},{urls:"stun:global.stun.twilio.com:3478"},{urls:"turn:openrelay.metered.ca:80",username:"openrelayproject",credential:"openrelayproject"},{urls:"turn:openrelay.metered.ca:443",username:"openrelayproject",credential:"openrelayproject"}]}},Ea=class{constructor(){this.peer=null,this.conn=null,this.role="solo",this.connected=!1,this.handlers=new Map,this.micStream=null,this.voiceOn=!1,this.remoteAudio=null,this.call=null,this.lastSent=0,this.pending=[]}on(e,t){return this.handlers.has(e)||this.handlers.set(e,[]),this.handlers.get(e).push(t),this}emit(e,t){(this.handlers.get(e)||[]).forEach(n=>{try{n(t)}catch(s){console.warn(s)}})}status(e,t="info"){this.emit("status",{text:e,kind:t})}async connect(){this.status("\u041F\u043E\u0434\u043A\u043B\u044E\u0447\u0435\u043D\u0438\u0435 \u043A \u0441\u0435\u0440\u0432\u0435\u0440\u0443\u2026");let t=await new Promise(s=>{let r=!1,o=new su(kf,Of),a=setTimeout(()=>{if(!r){r=!0;try{o.destroy()}catch{}s(null)}},9e3);o.on("open",()=>{r||(r=!0,clearTimeout(a),s(o))}),o.on("error",c=>{if(!r){r=!0,clearTimeout(a);try{o.destroy()}catch{}s({error:(c==null?void 0:c.type)||"error"})}})});if(t&&!t.error)return this.peer=t,this.role="host",this.status("\u041E\u043D\u043B\u0430\u0439\u043D \xB7 \u0432\u044B \u0425\u041E\u0417\u042F\u0418\u041D \u043A\u043E\u043C\u043D\u0430\u0442\u044B \xB7 \u0436\u0434\u0451\u043C 2-\u0433\u043E \u0438\u0433\u0440\u043E\u043A\u0430","ok"),t.on("connection",s=>this._attach(s)),t.on("error",s=>this._onError(s)),this.emit("role",this.role),this.role;if(this.status("\u041A\u043E\u043C\u043D\u0430\u0442\u0430 \u0437\u0430\u043D\u044F\u0442\u0430 \xB7 \u0437\u0430\u0445\u043E\u0434\u0438\u043C \u043A\u0430\u043A \u0438\u0433\u0440\u043E\u043A 2\u2026"),t=await new Promise(s=>{let r=!1,o=new su(void 0,Of),a=setTimeout(()=>{if(!r){r=!0;try{o.destroy()}catch{}s(null)}},1e4);o.on("open",()=>{r||(r=!0,clearTimeout(a),s(o))}),o.on("error",c=>{r||(r=!0,clearTimeout(a),s(null))})}),!t)return this.role="solo",this.status("\u0421\u0435\u0440\u0432\u0435\u0440 \u043D\u0435\u0434\u043E\u0441\u0442\u0443\u043F\u0435\u043D \xB7 \u043E\u0434\u0438\u043D\u043E\u0447\u043D\u044B\u0439 \u0440\u0435\u0436\u0438\u043C","warn"),this.emit("role","solo"),"solo";this.peer=t,this.role="client",t.on("error",s=>this._onError(s)),this.emit("role","client"),this.status("\u041F\u043E\u0434\u043A\u043B\u044E\u0447\u0435\u043D\u0438\u0435 \u043A \u043A\u043E\u043C\u043D\u0430\u0442\u0435\u2026");let n=t.connect(kf,{reliable:!0,serialization:"json"});return this._attach(n),this.role}_attach(e){this.conn=e,e.on("open",()=>{this.connected=!0,this.status("\u0412 \u0441\u0435\u0442\u0438 \xB7 2 \u0438\u0433\u0440\u043E\u043A\u0430 \xB7 \u0433\u043E\u043B\u043E\u0441\u043E\u0432\u043E\u0439 \u0447\u0430\u0442 \u0430\u043A\u0442\u0438\u0432\u0435\u043D","ok"),this.emit("open"),this.pending.forEach(t=>this.send(t)),this.pending=[]}),e.on("data",t=>this.emit("msg",t)),e.on("close",()=>{this.connected=!1,this.status("\u0418\u0433\u0440\u043E\u043A 2 \u043E\u0442\u043A\u043B\u044E\u0447\u0438\u043B\u0441\u044F \xB7 \u0432\u044B \u0432 \u043E\u0434\u0438\u043D\u043E\u0447\u043A\u0443","warn"),this.emit("close")}),e.on("error",t=>console.warn("conn error",t))}_onError(e){let t=(e==null?void 0:e.type)||"error";t==="peer-unavailable"?(this.status("\u0418\u0433\u0440\u043E\u043A 2 \u043D\u0435 \u043D\u0430\u0439\u0434\u0435\u043D \xB7 \u043E\u0434\u0438\u043D\u043E\u0447\u043D\u044B\u0439 \u0440\u0435\u0436\u0438\u043C","warn"),this.emit("close")):(t==="network"||t==="server-error"||t==="socket-error")&&this.status("\u041D\u0435\u0442 \u0441\u0432\u044F\u0437\u0438 \u0441 \u0441\u0435\u0440\u0432\u0435\u0440\u043E\u043C \xB7 \u043E\u0434\u0438\u043D\u043E\u0447\u043D\u044B\u0439 \u0440\u0435\u0436\u0438\u043C","warn")}get remoteId(){var e;return((e=this.conn)==null?void 0:e.peer)||null}send(e){if(this.conn&&this.conn.open)try{this.conn.send(e)}catch{}else(e==null?void 0:e.t)!=="s"&&(this.pending.push(e),this.pending.length>40&&this.pending.shift())}async enableVoice(){var e;try{if(!((e=navigator.mediaDevices)!=null&&e.getUserMedia))throw new Error("no getUserMedia");return this.micStream=await navigator.mediaDevices.getUserMedia({audio:{echoCancellation:!0,noiseSuppression:!0,autoGainControl:!0},video:!1}),this.voiceOn=!0,this.emit("mic",{ok:!0}),this._tryCall(),!0}catch(t){return this.voiceOn=!1,this.emit("mic",{ok:!1,error:(t==null?void 0:t.message)||"denied"}),!1}}_tryCall(){if(!this.peer||!this.voiceOn||!this.conn)return;let e=this.remoteId;if(e){try{if(this.call&&this.call.open)return;let t=this.peer.call(e,this.micStream);t.on("stream",n=>this._playRemote(n)),t.on("error",()=>{}),t.on("close",()=>{}),this.call=t}catch{}this._incomingHooked||(this._incomingHooked=!0,this.peer.on("call",t=>{try{t.answer(this.micStream||void 0),t.on("stream",n=>this._playRemote(n))}catch{}}))}}_playRemote(e){var t,n;this.remoteAudio||(this.remoteAudio=document.createElement("audio"),this.remoteAudio.autoplay=!0,this.remoteAudio.playsInline=!0,this.remoteAudio.style.display="none",document.body.appendChild(this.remoteAudio)),this.remoteAudio.srcObject=e,(n=(t=this.remoteAudio).play)==null||n.call(t).catch(()=>{}),this.emit("voice-stream")}hangup(){var e,t,n,s;try{(e=this.call)==null||e.close()}catch{}try{(t=this.micStream)==null||t.getTracks().forEach(r=>r.stop())}catch{}try{(n=this.conn)==null||n.close()}catch{}try{(s=this.peer)==null||s.destroy()}catch{}}};var au=document.getElementById("c"),pt=new sa,ru=new Ea,Et=new oa(au,pt,ru),Ta=i=>new Promise(e=>setTimeout(e,i));function Kx(){try{let i=document.createElement("canvas");return i.getContext("webgl2")||i.getContext("webgl")?null:"WebGL \u043D\u0435 \u043F\u043E\u0434\u0434\u0435\u0440\u0436\u0438\u0432\u0430\u0435\u0442\u0441\u044F"}catch(i){return String(i)}}async function Qx(){try{if(Kx()){document.getElementById("bootTxt").innerHTML="\u041D\u0435 \u0443\u0434\u0430\u043B\u043E\u0441\u044C \u0437\u0430\u043F\u0443\u0441\u0442\u0438\u0442\u044C 3D.<br>\u041E\u0431\u043D\u043E\u0432\u0438 \xABAndroid System WebView\xBB (\u0438\u043B\u0438 Chrome) \u0432 Play \u041C\u0430\u0440\u043A\u0435\u0442\u0435 \u0438 \u043E\u0442\u043A\u0440\u043E\u0439 \u0438\u0433\u0440\u0443 \u0441\u043D\u043E\u0432\u0430.";return}pt.setLoading(8,"\u0418\u043D\u0438\u0446\u0438\u0430\u043B\u0438\u0437\u0430\u0446\u0438\u044F \u0434\u0432\u0438\u0436\u043A\u0430\u2026"),await Ta(60),await Et.init(),pt.setLoading(55,"\u0421\u0442\u0440\u043E\u0438\u043C \u0433\u043E\u0440\u043E\u0434: \u0431\u0430\u043D\u043A, \u043C\u0430\u0433\u0430\u0437\u0438\u043D, \u0443\u043B\u0438\u0446\u044B\u2026"),await Ta(120),pt.setLoading(82,"\u0420\u0430\u0441\u0441\u0442\u0430\u0432\u043B\u044F\u0435\u043C \u0436\u0438\u0442\u0435\u043B\u0435\u0439\u2026"),await Ta(160),pt.setLoading(100,"\u0413\u043E\u0442\u043E\u0432\u043E"),await Ta(260),pt.showMenu(),ev()}catch(i){console.error(i);let e=document.getElementById("bootTxt");e&&(e.innerHTML="\u041E\u0448\u0438\u0431\u043A\u0430 \u0437\u0430\u043F\u0443\u0441\u043A\u0430: "+((i==null?void 0:i.message)||i)+"<br>\u041F\u043E\u043F\u0440\u043E\u0431\u0443\u0439 \u043E\u0431\u043D\u043E\u0432\u0438\u0442\u044C Android System WebView.")}}function ev(){document.querySelectorAll("#menu [data-act]").forEach(i=>{i.onclick=()=>{let e=i.dataset.act;Et.sound.init(),Et.sound.resume(),e==="play"?tv():e==="controls"?pt.showModal({title:"\u0423\u041F\u0420\u0410\u0412\u041B\u0415\u041D\u0418\u0415",sub:"\u041F\u041A \u0438 \u0442\u0435\u043B\u0435\u0444\u043E\u043D",body:pt.controlsHTML(),foot:ou("\u041F\u041E\u041D\u042F\u0422\u041D\u041E")}):e==="about"?pt.showModal({title:"\u041E\u0411 \u0418\u0413\u0420\u0415",sub:"DENI ISLAM \xB7 \u043A\u0440\u0438\u043C\u0438\u043D\u0430\u043B\u044C\u043D\u0430\u044F \u043F\u0435\u0441\u043E\u0447\u043D\u0438\u0446\u0430 \u043D\u0430 \u0434\u0432\u043E\u0438\u0445",body:pt.aboutHTML(),foot:ou("\u0417\u0410\u041A\u0420\u042B\u0422\u042C")}):e==="reset"&&confirm("\u0421\u0431\u0440\u043E\u0441\u0438\u0442\u044C \u0441\u043E\u0445\u0440\u0430\u043D\u0435\u043D\u0438\u0435? \u0414\u0435\u043D\u044C\u0433\u0438, \u0432\u0435\u0449\u0438 \u0432 \u0448\u043A\u0430\u0444\u0430\u0445 \u0438 \u043F\u0440\u043E\u0433\u0440\u0435\u0441\u0441 \u043F\u0440\u043E\u043F\u0430\u0434\u0443\u0442.")&&(xf(),pt.toast("\u0421\u043E\u0445\u0440\u0430\u043D\u0435\u043D\u0438\u0435 \u0441\u0431\u0440\u043E\u0448\u0435\u043D\u043E",""))}})}function ou(i){let e=document.createElement("button");return e.className="btn",e.textContent=i,e.onclick=()=>pt.hideModal(),e}var Ff=!1;async function tv(){if(Ff)return;Ff=!0;let i=document.querySelector('#menu [data-act="play"]');i&&(i.disabled=!0,i.classList.add("loading")),pt.toast("\u0417\u0430\u043F\u0440\u043E\u0441 \u0434\u043E\u0441\u0442\u0443\u043F\u0430 \u043A \u043C\u0438\u043A\u0440\u043E\u0444\u043E\u043D\u0443\u2026",""),await ru.enableVoice(),pt.toast("\u041F\u043E\u0434\u043A\u043B\u044E\u0447\u0435\u043D\u0438\u0435 \u043A \u0441\u0435\u0440\u0432\u0435\u0440\u0443 DENI-ISLAM #1\u2026","");let t=await ru.connect()!=="client";pt.hideMenu(),Et.startMatch({isHost:t,skin:t?"gentleman":"gopnik",name:t?"\u0414\u0416\u0415\u041D\u0422\u0415\u041B\u042C\u041C\u0415\u041D":"\u0413\u041E\u041F\u041D\u0418\u041A"}),pt.toast(t?"\u0422\u044B \u2014 \u0414\u0436\u0435\u043D\u0442\u0435\u043B\u044C\u043C\u0435\u043D. \u0416\u0434\u0451\u043C \u0432\u0442\u043E\u0440\u043E\u0433\u043E \u0438\u0433\u0440\u043E\u043A\u0430.":"\u0422\u044B \u2014 \u0413\u043E\u043F\u043D\u0438\u043A. \u041D\u0430\u043F\u0430\u0440\u043D\u0438\u043A \u0443\u0436\u0435 \u0442\u0443\u0442.","good")}pt.onAction=i=>{if(i==="pause:toggle"){if(Et.state!=="play"&&Et.state!=="dead")return;Et.pauseOpen?(Et.pauseOpen=!1,pt.hidePause()):Et.openPause();return}if(i.startsWith("slot:")){Et.selectSlot(parseInt(i.slice(5),10));return}if(i.startsWith("slotwheel:")){let e=parseInt(i.slice(10),10),t=Et.player.selected;for(let n=0;n<6&&(t=(t+e+6)%6,!(t===0||Et.player.hotbar[t]));n++);Et.selectSlot(t);return}if(i.startsWith("pause:")){let e=i.slice(6);e==="resume"&&(Et.pauseOpen=!1,pt.hidePause()),e==="controls"&&pt.showModal({title:"\u0423\u041F\u0420\u0410\u0412\u041B\u0415\u041D\u0418\u0415",sub:"\u041F\u041A \u0438 \u0442\u0435\u043B\u0435\u0444\u043E\u043D",body:pt.controlsHTML(),foot:ou("\u041F\u041E\u041D\u042F\u0422\u041D\u041E")}),e==="save"&&(Et.saveGame(),pt.toast("\u0421\u043E\u0445\u0440\u0430\u043D\u0435\u043D\u043E","good")),e==="exit"&&Et.exitToMenu()}};document.getElementById("btnPause").onclick=()=>{Et.openPause()};document.getElementById("modalClose").onclick=()=>{pt.hideModal()};document.getElementById("btnInv").onclick=()=>{Et.openInventory()};document.getElementById("modal").addEventListener("click",i=>{i.target.id==="modal"&&pt.hideModal()});pt.bindDesktop(au,()=>{});au.addEventListener("click",()=>{Et.sound.init(),Et.sound.resume()});window.addEventListener("keydown",i=>{i.code==="KeyE"&&pt.modalOpen||i.code==="Escape"&&pt.modalOpen&&pt.hideModal()});addEventListener("contextmenu",i=>i.preventDefault());addEventListener("beforeunload",()=>{try{Et.saveGame()}catch{}});Qx();})();
