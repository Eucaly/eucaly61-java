﻿debugger;
var rpsOpt={};
rpsOpt.blogRoot='';
var rpsDisp={};
rpsDisp.Rank='(%PostRankPure%%)';
rpsDisp.Loading='相關文章載入中 ...';
rpsDisp.ListHead='列出 %PostNum% 篇相關文章，以下是第 %PostNumFrom% 至 %PostNumTo% 篇';
rpsDisp.ListBegin='<ul>';
rpsDisp.ListLine='<li><font size=-1> %PostRank% </font> %PostTitle% <font size=-1>%PostDate%</font> <br/><font size=-2 color="#008000">%PostTagList%</font></li>';
rpsDisp.ListEnd='</ul>';
rpsDisp.ListBegin='<table border=0>';
rpsDisp.ListLine='<tr valign="middle"><td><font size=-1> %PostRank% </font></td> <td> %PostTitle% <font size=-1>%PostDate%</font><br/><font size=-1>%PostSummary%</font><br/><font size=-2 color="#008000">%PostTagList%</font></td></tr>';
rpsDisp.ListEnd='</table>';
rpsOpt.urlSearchLabel='/search/label/';
rpsOpt.feedSearchLabel='/feeds/posts/summary/-/';
rpsOpt.LocateLabels=['.post-footer','.post-labels','a'];
rpsOpt.LocateBoard=['append','.post-footer'];
rpsOpt.Lines=10;
rpsOpt.SummaryChar=100;
rpsOpt.minColor=[0,32,64];
rpsOpt.maxColor=[254,0,0];
rpsOpt.colorMode=1;
rpsOpt.HalfScale=8;
rpsOpt.WeightScale=-1;
rpsOpt.HalfScale=8;
rpsOpt.WeightScale=0.5;
var rpsFunc={};
(function(){
var N=window.rpsFunc;
var O=window.rpsOpt;
var P=window.rpsDisp;
var R;
var S;
var T;
var U='';
var V=[];
var W=0;
var X;
var Y;
var Z=[];
var ba=[];
var bb=[];
var bc=[];
var bd=0;
var be=[];
var bf=[];
var bg=[];
var bh=[];
var bi=[];
var bj=[];
var bk=Array();
N.page=function(a){
rpsFeeds_Next=rpsFeeds_Lines*(a-1);
bl()};
var bl=function(){
var k=0;
var l=10;
var m='';
var n='';
var o='';
var u=0,r=0;
var w;
var x;
var y;
var z='';
var A;
var B,s1,i,j,L;
var C=360;
var D=function(a,b,c){
var Q=[0];
var d=b.length;
var e=c.length;
var f=Math.min(d,e);
for(var i=0;
i<f;
i++){
Q[i]=b[i]*(1-a)+c[i]*a}
if(d>f){
for(var i=f;
i<d;
i++){
Q[i]=b[i]}
}
if(e>f){
for(var i=f;
i<e;
i++){
Q[i]=c[i]}
}
return(Q)};
function rgb2H(a){
var r=a[0],g=a[1],b=a[2],max=Math.max(r,g,b),min=Math.min(r,g,b),h,d;
if(max==min){
h=d=0}
else{
var d=max-min;
switch(max){
case r:h=(g-b)/d+(g<b?6:0);
break;
case g:h=(b-r)/d+2;
break;
case b:h=(r-g)/d+4;
break}
h*=(C/6)}
return[h,d,max]}
function H2rgb(a){
var h=a[0],s=a[1],v=a[2]rgb=[];
if(s==0){
rgb=[v,v,v]}
else{
function hue2rgb(p,q,t){
while(t<0)t+=1;
while(t>1)t-=1;
if(t<1/6)return p+(q-p)*6*t;
if(t<1/2)return q;
if(t<2/3)return p+(q-p)*(2/3-t)*6;
return p};
var b=h/C;
for(var i=0;
i<3;
i++){
rgb[i]=Math.round(Math.max(Math.min(hue2rgb(v-s,v,b+(1-i)/3),255),0))}
}
return rgb}
var E=function(a){
var b=a,a0;
do{
a0=b;
b=b.replace(/%PostTitle%/gi,'<a href="'+ba[r]+'">'+Z[r]+'</a>');
b=b.replace(/%PostTagList%/gi,o);
b=b.replace(/%PostDate%/gi,bb[r]);
b=b.replace(/%PostSummary%/gi,bj[r]);
b=b.replace(/%PostRankPure%/gi,u+'');
if(U.indexOf(ba[r])>=0)b=b.replace(/%PostRank%/gi,'本篇')else b=b.replace(/%PostRank%/gi,n);
b=b.replace(/%PostNum%/gi,bd+'');
b=b.replace(/%PostNumFrom%/gi,(k+1)+'');
b=b.replace(/%PostNumTo%/gi,l+'')}
while(a0!=b);
return b}
if(!(Z.length>0))return;
if(!(rpsFeeds_Lines>0)){
rpsFeeds_Lines=10}
rpsFeeds_This=Math.min(Math.max(0,rpsFeeds_Next),bd-1);
w=Math.ceil(bd/rpsFeeds_Lines);
x=Math.floor(rpsFeeds_This/rpsFeeds_Lines)+1;
k=(x-1)*rpsFeeds_Lines;
l=Math.min(k+rpsFeeds_Lines,bd);
y='';
for(var B in V){
if(y!=''){
y+=', '}
y+=B+' ('+V[B]+')'}
y='<br/>'+'<font size=-2 color="#008000"> 相關標籤 : '+y+'</font>';
m=E(P.ListHead);
R.find('#headmsg').get(0).innerHTML=m+y;
R.find('#progress').get(0).innerHTML='';
var F=O.minColor;
var G=O.maxColor;
var H=rgb2H(F);
var I=rgb2H(G);
var J;
if(O.colorMode==2){
if(H[0]<I[0])H[0]+=C;
else I[0]+=C}
bp(k,l);
for(j=k;
j<l;
j++){
r=bc[j];
u=Math.round(100*bi[r]/W)if(O.colorMode<0.5){
J=D(u/100,F,G)}
else{
var K=D(u/100,H,I);
J=H2rgb(K)}
if(Math.min(J[0],J[1],J[2])>=0)A='<span style="color: rgb('+Math.floor(J[0])+','+Math.floor(J[1])+','+Math.floor(J[2])+');
">';
else A='<span>';
o='';
for(var L in bg[r]){
if(o!=''){
o+=', '}
B=bg[r][L];
if(!V[B]){
o+='<b>'+B+'</b>'}
else{
o+=B}
}
n=E(A+P.Rank+'</span>');
z+=E(P.ListLine)}
R.find('#mainList').get(0).innerHTML=P.ListBegin+z+P.ListEnd;
var M='',temp,temp_p=[];
temp_p['上一頁']=[x-1,' / '];
temp_p['下一頁']=[x+1,' / '];
for(i=1;
i<=w;
i++){
temp_p['&lt;
'+i+'&gt;
']=[i,' ']}
for(s1 in temp_p){
temp=s1;
L=temp_p[s1][0];
if((L>0)&&(L<=w)){
if(L!=x){
temp='<a href="javascript:rpsFunc.page('+L+');
">'+temp+'</a>'}
else{
temp='<b>'+temp+'</b>'}
}
M+=temp+temp_p[s1][1]}
R.find('#navi').get(0).innerHTML=M};
var bm=function(n){
return 1/(1+Math.pow(n,O.WeightScale))};
var bn=function(a,b,j,c){
if(bf[a][b]==undefined){
bf[a][b]=j;
bi[j]+=c}
}
var bo=function(){
if(S==0){
R.find('#mainList').get(0).innerHTML='沒有標籤';
return}
var a=Math.floor(90*T/S);
R.find('#progress').get(0).innerText='( '+a+'% )';
if(T==S){
for(var j in bg){
for(var k in bg[j]){
var b=bg[j][k];
var c=ba[j];
if(V[b]!=undefined){
var d=V[b];
var e=bm(d);
bn(b,c,j,e)}
}
}
R.find('#headmsg').get(0).innerText='';
R.find('#progress').get(0).innerText='';
rpsFeeds_Lines=O.Lines;
rpsFeeds_This=0;
rpsFeeds_Next=0;
bl()}
};
N.readFeed=function(a){
var b=function(l,r){
for(j in l){
if(l[j].rel==r){
return l[j].href}
}
return''}
var c=/</g;
var d=/>/g;
var i,j,k,s2;
var e="";
var f=b(a.feed.link,'alternate');
var g="";
T+=1;
s2=f.split(O.urlSearchLabel)[1];
if(s2){
s2=s2.split('?')[0];
g=decodeURIComponent(s2)}
else{
alert('feedLink = '+f)}
var h=a.feed.openSearch$totalResults.$t*1;
var m=bm(h);
W+=m;
if(!V[g]){
V[g]=h;
bf[g]=Array()}
else{
alert('feedLink = '+f+'tagName = '+g);
return}
for(i=0;
i<a.feed.entry.length;
i++){
var n=a.feed.entry[i];
e=b(n.link,'alternate');
if(e!=""){
if(be[e]){
j=be[e];
bn(g,e,j,m)}
else{
j=X;
be[e]=j;
Z[j]=(n.title.$t.replace(c,'&lt;
')).replace(d,'&gt;
');
bb[j]=n.published.$t.substr(0,10);
ba[j]=e;
bi[j]=0;
bn(g,e,j,m);
if("summary"in n){
var o=n.summary.$t}
else var o="";
o=o.replace(/<\S[^>]*>/g,"");
if(o.length>O.SummaryChar)o=o.substring(0,O.SummaryChar)+'...';
bj[j]=(o.replace(c,'&lt;
')).replace(d,'&gt;
');
var p=new Array();
for(k in n.category){
p[k]=n.category[k].term}
bg[j]=p;
bc[bd]=j;
bd++;
X++}
}
}
bo()};
var bp=function(a,b){
var i,j,ll=X-1;
var c,temp;
if(Y<b){
j=Y;
while(j<=b){
c=ll;
for(i=ll-1;
i>j;
i--){
if(bi[bc[i]]>bi[bc[i-1]]){
temp=bc[i];
bc[i]=bc[i-1];
bc[i-1]=temp;
c=i-1}
}
j=Math.max(c,j+1)}
Y=c}
};
var bq=function(){
var a;
var i,l,s1,s2,p1;
var b;
if(!(R.length()>0))return;
if(O.LocateLabels[O.LocateLabels.length-1]!='a'){
O.LocateLabels[O.LocateLabels.length]='a'}

debugger;
var c=k_Query(O.LocateLabels);
if(c.length()==0){
c=k_Query('.post-footer .post-labels a')}
S=c.length();
T=0;
s2=O.blogRoot;
do{
s1=s2;
s2=s2.replace(/\/$/,'')}
while(s1!=s2);
O.blogRoot=s2;
for(i=0;
i<S;
i++){
ss=c.get(i).href.split(O.urlSearchLabel);
s1=ss[0];
s2=ss[1];
if(s2){
if(O.blogRoot==''){
O.blogRoot=s1}
s2=s2.split('?')[0];
s1=c.get(i).innerHTML;
b=O.blogRoot+O.feedSearchLabel+s2+'?max-results=20&alt=json-in-script&callback=rpsFunc.readFeed';
var d=document.getElementsByTagName('head')[0];
a=document.createElement('script');
a.src=b;
a.type='text/javascript';
d.appendChild(a)}
}
};
var br=function(){
U=document.URL.split('?')[0];
ba[0]=U;
X=1;
Y=-1;
if(O.WeightScale<0){
if(O.HalfScale>=2)O.WeightScale=Math.log(2)/Math.log(O.HalfScale);
else O.WeightScale=0}
};
var bs=function(){
var a=k_Query(document.body);
var b=1;
var c=2;
var d=3;
var e=4;
var f={'append':b,'prepend':c,'before':d,'after':e};
var g=0;
var h;
var j=1;
var k=0;
var l=f[O.LocateBoard[0].toLowerCase()];
if(l){
g=1}
else{
g=0}
for(var i=g;
i<O.LocateBoard.length;
i++){
if(a.length()>0){
h=O.LocateBoard[i]switch(typeof(h)){
case'string':a=a.find(h);
break;
case'number':if(k==0){
k=h}
k=Math.min(k,h);
j=Math.max(j,h);
break;
default:}
}
}
h=a.length();
if((h==0)||(h<k)||(h>j)){
return}
var m=document.createElement('div');
m.id="rpsBoard";
var n=a.get(0);
switch(l){
case c:n.insertBefore(m,n.firstChild);
break;
case e:n.parentNode.insertBefore(m,n.nextSibling)break;
case d:n.parentNode.insertBefore(m,n)break;
default:n.appendChild(m)}
R=k_Query('#rpsBoard');
if(R.length()>0){
var o=R.get(0);
o.innerHTML+=('<div><p><span id="headmsg">'+P.Loading+'</span>'+'<span id="progress"> ( 0% ) </span></p></div>'+'<p id="navi"></p>'+'<div id="mainList">'+P.Loading+'</div>')}
else{
return}
o.innerHTML+=('<br />')};
N.ToggleMsg=function(a){
var b='inline',i;
for(i=0;
i<a.length();
i++){
if(a.get(i).style.display=='inline'){
b='none';
break}
}
for(i=0;
i<a.length();
i++){
a.get(i).style.display=b}
};
N.main01=function(){
br();
bs();
bq();
bo()}
}
)();
(function(){
var m=this,undefined,k_Query=m.k_Query=function(a){
var b=new k_Query.fn.init(a);
return b};
k_Query.fn=k_Query.prototype={init:function(a){
a=a||document;
if(a.nodeType){
this.DOMs=a;
return this}
if((a==undefined)||(a==null)){
this.DOMs=document;
return this}
else{
this.DOMs=k_Query(document).find(a).DOMs;
return this}
},
length:function(){
if((this.DOMs==undefined)||(this.DOMs==null)||(typeof this.DOMs=='String'))return 0;
var a=this.DOMs.length;
if(isNaN(a))return 1;
else return a},
get:function(a){
if(isNaN(a))return this.DOMs;
var b=this.DOMs.length;
if(isNaN(b))return this.DOMs;
else return this.DOMs[a]},
find:function(a){
var b=k_Query();
b.DOMs=[];
var c;
if(this==undefined)return b;
if(this.length()==0)return b;
if((typeof a)=="string"){
c=a.split(" ")}
else c=a;
var d=c.length;
if(isNaN(d))return b;
var e=this.DOMs;
d=e.length;
if(isNaN(d))e=[e];
for(j in c){
var f=[];
a=c[j];
var g=a.replace(/^[#.]/,'');
for(k in e){
var h=e[k];
switch(a.charAt(0)){
case'#':var l=h.getElementsByTagName('*');
for(var i=0;
i<l.length;
i++){
if(l[i].id==g)f=f.concat(l[i])}
break;
case'.':var l=h.getElementsByTagName('*');
for(var i=0;
i<l.length;
i++){
if((' '+l[i].className+' ').search(' '+g+' ')>=0){
f=f.concat(l[i])}
}
break;
default:if(f.length==0){
f=h.getElementsByTagName(a)}
else{
debugger;
f=f.concat(h.getElementsByTagName(a))}
}
}
e=f}
if(f.length>0){
b.DOMs=f}
return b}
}
}
)();
k_Query.fn.init.prototype=k_Query.fn;
debugger;
var rps_alreadyrunflag=0;
if(document.addEventListener)document.addEventListener("DOMContentLoaded",function(){
rps_alreadyrunflag=1;
rpsFunc.main01()},
false);
else if(document.all&&!window.opera){
document.onreadystatechange=function(){
if(document.readyState=="complete"){
rps_alreadyrunflag=1;
rpsFunc.main01()}
}
}
else if(/Safari/i.test(navigator.userAgent)){
var _timer=setInterval(function(){
if(/loaded|complete/.test(document.readyState)){
clearInterval(_timer);
rps_alreadyrunflag=1;
rpsFunc.main01()}
},
10)}
window.onload=function(){
setTimeout("if (!rps_alreadyrunflag) rpsFunc.main01();
",0)};
