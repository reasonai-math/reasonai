/* Independent assessment pool. New items, not used in the practice game. Teacher validates written reasoning. */
(function(root){
const gcd=(a,b)=>b?gcd(b,a%b):a;
const frac=(n,d)=>`${n}/${d}`;
const value=s=>{const m=String(s).trim().match(/^(\d+)\s*\/\s*(\d+)$/);return m&&+m[2]?+m[1]/+m[2]:NaN;};
const items=[];
function add(group,prompt,answer,expected,level='Transfer',key=''){items.push({id:`RA-${group}-${String(items.filter(x=>x.group===group).length+1).padStart(2,'0')}`,group,prompt,answer,expected,level,key});}
// 30 distinct unlike-numerator / unlike-denominator comparisons. Avoid original and practice examples.
let n=0;
for(let a=2;a<=8&&n<30;a++)for(let b=a+2;b<=13&&n<30;b++)for(let c=2;c<=8&&n<30;c++){
 const d=b+1+(c%4);if(c>=d||a===c||a*d===c*b||gcd(a,b)>1||gcd(c,d)>1)continue;
 const x=frac(a,b),y=frac(c,d);if(['3/4','5/8','3/5','3/8','2/3','4/7','5/9','5/6','7/9','2/5'].includes(x)||['3/4','5/8','3/5','3/8','2/3','4/7','5/9','5/6','7/9','2/5'].includes(y))continue;
 const win=a*d>c*b?x:y;
 add(0,`Which is greater: ${x} or ${y}? Explain using equivalent fractions, a benchmark, or a number line.`,win,`${a*d} ${a*d>c*b?'>':'<'} ${c*b} when both fractions use denominator ${b*d}.`,'Transfer',`${x}|${y}`);n++;
}
// 30 same-numerator comparisons, different from practice 1/5 vs 1/8, 3/5 vs 3/8 etc.
n=0;for(let a=2;a<=9&&n<30;a++)for(let b=a+2;b<=15&&n<30;b++){
 const d=b+2+(a%3);if(['3/5|3/8','2/4|2/7','4/9|4/6'].includes(`${a}/${b}|${a}/${d}`))continue;
 add(1,`Compare ${a}/${b} and ${a}/${d} using equal-sized wholes. Why does the smaller denominator give a larger fraction here?`,frac(a,b),`The numerators are both ${a}. With equal wholes, ${b} parts are larger than ${d} parts. This is not a universal denominator-only rule.`,'Conceptual');n++;
}
// 30 same-denominator comparisons with different prompts and yes/no judgments.
n=0;for(let d=7;d<=19&&n<30;d++)for(let a=2;a<d-2&&n<30;a++){
 const b=a+2;const truth=a>b?'Yes':'No';
 add(2,`A pupil says ${a}/${d} is greater than ${b}/${d} because ${a} is larger. Do you agree? Explain using equal parts of one whole.`,truth,`No. ${b}/${d} > ${a}/${d} because the parts are the same size and ${b} > ${a}.`,'Error analysis');n++;
}
// 30 unlike-denominator addition critiques with varied numerator sizes.
n=0;for(let b=3;b<=12&&n<30;b++)for(let d=b+1;d<=17&&n<30;d++){
 if(gcd(b,d)!==1)continue;const a=1+(b%2),c=1+(d%3);if(a>=b||c>=d)continue;
 const wrong=frac(a+c,b+d),sumN=a*d+c*b,sumD=b*d,g=gcd(sumN,sumD),right=frac(sumN/g,sumD/g);
 add(3,`A pupil writes ${a}/${b} + ${c}/${d} = ${wrong}. Is this correct? Explain the error and calculate the correct sum.`, 'No',`No. Convert to a common denominator: ${a*d}/${sumD} + ${c*b}/${sumD} = ${sumN}/${sumD} = ${right}. Denominators cannot simply be added.`,'Error analysis');n++;
}
// 30 higher-order transfer items requiring comparison and justification.
n=0;for(let b=5;b<=18&&n<30;b++)for(let a=2;a<b-1&&n<30;a++){
 const d=b+3,c=a+1;if(c>=d||a*d===c*b||gcd(a,b)>1)continue;
 const x=frac(a,b),y=frac(c,d),win=a*d>c*b?x:y;
 add(4,`Two pupils disagree about ${x} and ${y}. One compares denominators only; the other uses cross-products. Which fraction is larger? Give a counterargument to the denominator-only rule.`,win,`${a}×${d}=${a*d} and ${c}×${b}=${c*b}; hence ${win} is larger. Denominator-only comparisons are unreliable when numerators differ.`,'HOTS transfer');n++;
}
function isCorrect(item,answer){const s=String(answer).toLowerCase().trim().replace(/[.!]$/,'');if(item.answer==='Yes'||item.answer==='No')return item.answer.toLowerCase()===s||item.answer==='No'&&/^(incorrect|disagree|not correct)$/.test(s);return s.replace(/\s/g,'')===item.answer||Math.abs(value(s)-value(item.answer))<1e-10;}
function choose(group,attempts){const used=new Set((attempts||[]).map(a=>a.bankId).filter(Boolean));const available=items.filter(i=>i.group===group&&!used.has(i.id));return available[0]||null;}
root.ReassessmentBank={items,choose,isCorrect};
})(window);
