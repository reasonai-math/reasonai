/* Transparent English-language demonstration rules, not a validated assessment.
 * Unrecognised explanations remain subject to teacher review. */
(function(root){
const questions = [
{id:0,title:'Comparing Fractions',prompt:'Which is greater: 3/4 or 5/8? Explain how you know.',answer:'3/4',decimal:0.75,follow:1,sample:'3/4 is greater because a smaller denominator always means a larger fraction.'},
{id:1,title:'Same Numerator',prompt:'Which is greater: 3/5 or 3/8? Explain how you know.',answer:'3/5',decimal:0.6,follow:4,sample:'3/5 is greater. Both have the same numerator, and fifths are larger pieces than eighths of the same whole.'},
{id:2,title:'Same Denominator',prompt:'A student says: “5/8 is greater than 3/8 because 5 is greater than 3.” Do you agree? Explain your reasoning.',answer:'Yes',follow:0,sample:'Yes. They have the same denominator, so the pieces are the same size. Five eighths is more than three eighths.'},
{id:3,title:'Addition Misconception',prompt:"A student calculates: 1/3 + 1/4 = 2/7. Is the student correct? Explain the student's mistake and show the correct method.",answer:'No',follow:4,sample:'No. Adding the denominators is incorrect. Use a common denominator: 1/3 = 4/12 and 1/4 = 3/12, so 4/12 + 3/12 = 7/12.'},
{id:4,title:'Transfer / Challenge',prompt:'Which is greater: 4/7 or 5/9? Explain your reasoning without using a calculator.',answer:'4/7',decimal:4/7,follow:0,sample:'4/7 is greater. 4/7 = 36/63 and 5/9 = 35/63, and 36 is greater than 35.'}
];
function normal(s){return String(s??'').toLowerCase().replace(/[’]/g,"'").replace(/×/g,'*').replace(/÷/g,'/').replace(/\s+/g,' ').trim();}
function correct(q,answer){
const a=normal(answer).replace(/[.!。]$/,'');
if(q.id===2)return /^(yes|agree|i agree|yes,? i agree|correct|the student is correct|5\s*\/\s*8(?: is greater(?: than 3\s*\/\s*8)?)?|5\s*\/\s*8\s*>\s*3\s*\/\s*8)$/.test(a);
if(q.id===3)return /^(no|disagree|i disagree|incorrect|not correct|the student is (?:incorrect|not correct)|no,? (?:the student is )?(?:incorrect|not correct))$/.test(a)||fractionValue(a)===7/12||/^no[,;:]?\s*(?:the correct answer is\s*)?7\s*\/\s*12$/.test(a);
const pair=q.id===0?['3/4','5/8']:q.id===1?['3/5','3/8']:['4/7','5/9'];
const compact=a.replace(/\s/g,'');
return fractionValue(a)===q.decimal||compact===pair[0]+'>'+pair[1]||compact===pair[1]+'<'+pair[0]||compact===pair[0]+'isgreater'||compact===pair[0]+'isgreaterthan'+pair[1];
}
function fractionValue(a){const m=a.match(/^(\d+)\s*\/\s*(\d+)$/);return m?(+m[2]?+m[1]/+m[2]:NaN):/^\d*\.\d+$/.test(a)?Number(a):NaN;}

const VERSION='fractions-rules-6-talent';
const close=(a,b)=>Number.isFinite(a)&&Number.isFinite(b)&&Math.abs(a-b)<1e-9;
// Arithmetic only: no eval, and no matching suffixes inside a larger expression.
function numberValue(expression){
const tokens=expression.match(/\d+(?:\.\d+)?|[()+*\/\-]/g)||[];
if(tokens.join('')!==expression.replace(/\s/g,''))return NaN;
let i=0;
function atom(){if(tokens[i]==='('){i++;const v=sum();if(tokens[i++]!==')')return NaN;return v;}const t=tokens[i++];return /^\d/.test(t||'')?Number(t):NaN;}
function product(){let v=atom();while(tokens[i]==='*'||tokens[i]==='/'){const op=tokens[i++],n=atom();v=op==='*'?v*n:v/n;}return v;}
function sum(){let v=product();while(tokens[i]==='+'||tokens[i]==='-'){const op=tokens[i++],n=product();v=op==='+'?v+n:v-n;}return v;}
const result=sum();return i===tokens.length?result:NaN;
}
function mathematicalText(reason){
return normal(reason).replace(/(\d)\s*x\s*(?=\d)/g,'$1*')
.replace(/three quarters/g,'3/4').replace(/six eighths/g,'6/8').replace(/five eighths/g,'5/8').replace(/three eighths/g,'3/8')
.replace(/\b(?:is |are )?(?:greater|bigger|larger|more|higher) than\b/g,'>')
.replace(/\b(?:is |are )?(?:less|lesser|smaller|lower) than\b/g,'<')
.replace(/\b(?:equals|equal to|is equal to)\b/g,'=')
.replace(/(\d)\s+is\s+(?=\d)/g,'$1 = ');
}
function relations(text){
const atom='(?:\\d+(?:\\.\\d+)?|\\(\\s*[\\d.\\s+*/-]+\\))';
const expr=atom+'(?:\\s*[+*/-]\\s*'+atom+')*';
// Lookahead allows both links of a chained equality to be checked.
const re=new RegExp('(?<![\\w./*+\\-(])('+expr+')\\s*(=|>|<)\\s*('+expr+')(?![\\w/*+\\-])','g');
const found=[];let m;
while((m=re.exec(text))){const left=numberValue(m[1]),right=numberValue(m[3]);found.push({text:m[0],leftText:m[1],rightText:m[3],op:m[2],left,right,valid:m[2]==='='?close(left,right):m[2]==='>'?left>right:left<right});re.lastIndex=m.index+m[0].lastIndexOf(m[3]);}
return found;
}
function analyse(q,answer,reason){
const ok=correct(q,answer),r=normal(reason),math=mathematicalText(reason);
const follow=questions[q.follow].prompt;
function result(quality,pattern,intervention,misconception='No specific misconception identified',confidence='Medium'){
return {ok,quality,algorithmicProfile:quality==='Supported reasoning'?(pattern.includes('decimal')?'Computational Efficiency':pattern.includes('benchmark')?'Pattern Recognition':pattern.includes('equivalent')||pattern.includes('denominator')?'Abstraction':'Computational Efficiency'):null,reasoningDepth:quality==='Supported reasoning'?3:null,reviewReason:quality==='Needs teacher review'?pattern:null,misconception,confidence,intervention,evidence:reason,follow,analysisVersion:VERSION};
}
const review=(why,help,confidence='Medium')=>result('Needs teacher review',why,help,undefined,confidence);
const signal=(why,help)=>result('Misconception signal',why,help,'Possible misconception: '+why);
const rejected=/\b(?:incorrect|wrong|mistake|cannot|can't|should not|shouldn't|do not|don't|not valid|does not work)\b/.test(r);
const equalNumerators=/same numerator|equal numerators|same (?:top|upper) number|both.*(?:numerators?\D*3|three)/.test(r);
const equalDenominators=/same denominator|equal denominators|same.siz|equal.siz|both.*eighths|both.*(?:numbers? (?:are|is) 8|\/8)/.test(r);
const smaller=/smaller denominator|denominator.*smaller|fifths.*(?:larger|bigger).*eighths/.test(r);
const adding=/add(?:ing)? (?:the )?(?:numerators and (?:the )?)?denominators/.test(r);
const conditional=/(?:when|if).*?(?:(?:same|equal).*?numerator|numerator.*?(?:same|equal))/.test(r);
// Evidence-specific signal: the pupil chooses 3/8 because eight is larger.
// The comparison concerns denominators, not a valid same-denominator numerator rule.
if(q.id===1&&!ok&&!rejected&&/(?:8|eight)\s+(?:is\s+)?(?:greater|bigger|larger|more)\s+than\s+(?:3|5|three|five)|(?:larger|bigger|greater)\s+denominator|denominator\s+(?:8|eight)\s+(?:is\s+)?(?:larger|bigger|greater)/.test(r))
 return result('Misconception signal','Treats the larger denominator as the larger fraction','Compare 3/5 and 3/8 using the same-sized whole. Explore why fifths are larger than eighths.','Possible misconception: larger denominator means larger fraction','High (explicit reasoning pattern)');

// Prioritise the meaning of the pupil's addition explanation. The question
// quotes 2/7 as an error: the pupil may be CRITIQUING it, not endorsing it.
if(q.id===3){
 const direct=/(?:3\s*(?:plus|\+)\s*4\s*(?:equals|is|=)\s*7|add(?:ed|ing)?\s+(?:the\s+)?denominators|denominators?\s+(?:are\s+)?add(?:ed)?|1\s*\/\s*3\s*\+\s*1\s*\/\s*4\s*=\s*2\s*\/\s*7)/.test(r);
 const critique=/\b(?:wrong|incorrect|mistake|not correct|cannot|can't|should not|shouldn't|do not|don't|not add|never add)\b/.test(r);
 const correctMethod=/(?:7\s*\/\s*12|4\s*\/\s*12|3\s*\/\s*12|common denominator|same denominator)/.test(r);
 if(direct&&!critique&&!correctMethod)return result('Misconception signal','Adding denominators directly','Use Fraction Bridge Builder: create equal-sized twelfths, then add 4/12 + 3/12. Ask the pupil to explain why 2/7 is incorrect.','Possible misconception: adding denominators directly','High (explicit reasoning pattern)');
 if(direct&&critique&&correctMethod){ // Continue: a valid critique needs checking for accurate working.
 }
}

if(!rejected&&smaller&&!conditional&&(q.id!==1||/always|every/.test(r)))return signal('Overgeneralising a denominator rule','Compare 3/5 with 3/8, then 2/3 with 3/4 using equal-sized wholes. Explain why the smaller-denominator rule needs equal numerators.');
if(q.id===3&&adding&&!rejected)return signal('Adding numerators and denominators','Model thirds and quarters of the same whole. Rename them as 4/12 and 3/12 before adding the numerators.');
// Whole-number claims must be standalone, never suffixes of 3/5 > 3/8.
const wholeClaim=/(?<![\d/])5\s+(?:is\s+)?(?:greater|bigger|larger|more)\s+than\s+3(?![\d/])/.test(r);
const componentClaim=/(?:bigger|larger) (?:numbers|numerator|denominator)|(?:larger|bigger) denominator/.test(r);
if(!rejected&&((wholeClaim&&q.id!==2)||(componentClaim&&!equalDenominators&&!(q.id===1&&equalNumerators&&smaller))))return signal('Comparing fraction components without accounting for the denominators','Represent both fractions using the same whole and equal-sized parts. Compare their values, rather than the sizes of their numerators or denominators alone.');
// Ungrouped products around a slash have more than one plausible intended
// fraction layout. Ask for grouping rather than inventing a calculation error.
if(/\d+\s*\*\s*\d+\s*\/\s*\d+\s*\*\s*\d+/.test(math))return review('The grouping of multiplication and division is unclear','Rewrite each fraction using parentheses around its numerator and denominator. Check that both are multiplied by the same factor; then recompute the products.');
const all=relations(math);
if(q.id===3&&!rejected&&all.some(e=>e.op==='='&&e.leftText.includes('+')&&close(e.left,7/12)&&close(e.right,2/7)))return signal('Adding unlike fraction parts as though denominators could be added','Use equal-sized fraction strips. Rename 1/3 and 1/4 in twelfths and explain why the sum is 7/12 rather than 2/7.');
// A rejected 2/7 example is evidence of critique, not the student's endorsed arithmetic.
const checked=all.filter(e=>!(q.id===3&&rejected&&close(e.left,7/12)&&close(e.right,2/7)&&e.op==='='));
const bad=checked.find(e=>!e.valid && !(q.id===3 && /(?:^|\s)4\s*=\s*7/.test(e.text) && /3\s*(?:plus|\+)\s*4/.test(r)));
if(bad)return review('Calculation or comparison needs checking: '+bad.text,'Recompute '+bad.text+' step by step. Check fraction-to-decimal conversions by division and multiplication using parentheses; then compare the final answer with the corrected working.');
// Also inspect explicit working entered in the answer field, without altering it.
const answerError=relations(mathematicalText(answer)).find(e=>!e.valid);
if(answerError)return review('The final-answer working contains an incorrect relationship: '+answerError.text,'Check '+answerError.text+' using a common denominator. Explain each conversion before giving the final answer.');
if(q.id===4&&/calculator/.test(r)&&!/without.*calculator|no calculator|did not use.*calculator|didn't use.*calculator/.test(r))return review('The explanation does not establish a method without a calculator','Show equal-denominator fractions or cross-products by hand and explain which fraction each number represents.');
const fractionMatches=[...math.matchAll(/(?<![\d.])\d+\s*\/\s*\d+(?!\d)/g)].map(m=>({text:m[0],value:numberValue(m[0]),den:Number(m[0].split('/')[1])}));
const eq=checked.filter(e=>e.op==='='&&e.valid);
const comparison=checked.filter(e=>e.op!=='='&&e.valid);
const compares=/greater|bigger|larger|more|less|smaller|higher|better|[<>]/.test(r);
const pair=q.id===0?[3/4,5/8]:q.id===1?[3/5,3/8]:q.id===2?[5/8,3/8]:[4/7,5/9];
const decimal=(v)=>[...math.matchAll(/(?<![\d.])\d*\.\d+(?!\d)/g)].some(m=>close(Number(m[0]),v));
const linkedDecimals=pair.every(v=>eq.some(e=>close(e.left,v)&&close(e.right,v)&&e.leftText.includes('/')&&e.rightText.includes('.')));
const comparedDecimals=comparison.some(e=>close(Math.max(e.left,e.right),pair[0])&&close(Math.min(e.left,e.right),pair[1])&&e.leftText.includes('.')&&e.rightText.includes('.'));
const decimalStrategy=q.id!==3&&pair.every(decimal)&&compares&&(linkedDecimals||comparedDecimals);
const equivalents=q.id!==3&&fractionMatches.some(a=>fractionMatches.some(b=>a.den===b.den&&close(a.value,pair[0])&&close(b.value,pair[1])));
const linkedEquivalent=q.id!==3&&eq.some(e=>close(e.left,pair[0])&&close(e.right,pair[0])&&e.leftText.includes('/')&&e.rightText.includes('/'));
const equivalentStrategy=equivalents&&compares&&(linkedEquivalent||comparison.length>0||/compar|comput|equivalent|rename/.test(r));
const products=q.id===0?[24,20]:q.id===4?[36,35]:[];
const crossStrategy=products.length>0&&products.every(v=>eq.some(e=>e.leftText.includes('*')&&close(e.right,v)))&&compares;
const numeratorStrategy=q.id===1&&equalNumerators&&smaller;
const denominatorStrategy=q.id===2&&equalDenominators&&/(?:5|five).*(?:greater|bigger|larger|more|better|>).*(?:3|three)|compare.*numerator|larger numerator/.test(r);
const additionStrategy=q.id===3&&eq.some(e=>e.leftText.includes('+')&&close(e.left,7/12)&&close(e.right,7/12))&&/common denominator|same denominator|cannot|can't|wrong|incorrect|mistake|different.*(?:parts|units)/.test(r);
// A valid shared benchmark is another mathematical relationship, independent
// of vocabulary: larger > benchmark and smaller < benchmark.
const directed=comparison.map(e=>e.op==='>'?[e.left,e.right]:[e.right,e.left]);
const benchmarkStrategy=q.id!==3&&directed.some(a=>close(a[0],pair[0])&&directed.some(b=>close(b[1],pair[1])&&close(a[1],b[0])));
const supported=decimalStrategy||equivalentStrategy||crossStrategy||numeratorStrategy||denominatorStrategy||additionStrategy||benchmarkStrategy;
if(supported&&!ok)return review('The final answer contradicts the valid mathematical working','Identify which fraction each value or cross-product belongs to. Use the comparison in your working to correct or explain the final answer.');
if(supported)return result('Supported reasoning',additionStrategy?'Valid common-denominator addition':benchmarkStrategy?'Valid comparison using a shared benchmark':decimalStrategy?'Valid decimal comparison':crossStrategy?'Valid cross-product comparison':equivalentStrategy?'Valid equivalent-fraction comparison':'Valid relationship between fraction parts','Explain why this method works, then apply it to '+questions[q.follow].prompt,'No misconception flagged by these rules');
// Specific scaffolds distinguish partial evidence from no interpretable method.
if(q.id===3&&/common denominator|same denominator/.test(r))return review('The common-denominator principle is correct, but the corrected calculation is missing','Show how 1/3 and 1/4 are renamed with denominator 12, add them, and explain why 2/7 is incorrect.');
if(q.id===3&&/0\.333|0\.25|decimal/.test(r))return review('The decimal argument does not show a complete corrected addition method','Mark recurring or rounded decimals as approximate. Show the sum, compare it with 2/7, and give the exact fraction using a common denominator.');
if(q.id===1&&/same number|smaller number|5 is smaller than 8/.test(r))return review('It is unclear whether the explanation identifies equal numerators and the role of the denominators','Point to the numerator and denominator in each fraction. Explain why three fifths exceeds three eighths when the wholes are equal.');
if(q.id===2&&/mother number|same numbe/.test(r))return review('The term used for a fraction part is unclear','Point to the number you mean in each fraction. Explain how equal denominators make the pieces equal-sized and why five pieces exceed three.');
if(q.id===2&&wholeClaim)return review('The numerator comparison omits why it applies to these fractions','Explain why the two denominators being 8 allows you to compare 5 with 3. Would this work with different denominators?');
if(q.id!==3&&pair.some(decimal))return review('Only one fraction value is established; the comparison is incomplete','Convert both fractions to decimals or equal-denominator fractions. Show which value is larger and explain how this supports your answer.');
if(q.id===4&&/multiply|cross/.test(r))return review('The multiplication strategy is named but the products and comparison are missing','Calculate 4 × 9 and 5 × 7, label which fraction each product represents, and use them to justify the comparison.');
const scaffolds=[
['No interpretable comparison of 3/4 and 5/8 is provided','Draw both fractions on equal-sized wholes or rename them in eighths. Explain what the representation shows.'],
['No justification for comparing 3/5 and 3/8 is provided','Draw three fifths and three eighths of equal-sized wholes. Explain the size of each part.'],
['No explanation of the comparison between 5/8 and 3/8 is provided','Draw five eighths and three eighths. Explain what stays the same and what changes.'],
['The explanation does not identify the addition mistake or show a corrected method','Use fraction strips for 1/3 and 1/4. Find equal-sized parts, add them, and explain why adding denominators fails.'],
['No interpretable justification for comparing 4/7 and 5/9 is provided','Without a calculator, rename both fractions in sixty-thirds or show cross-products. Explain which is larger.']
];
return review(...scaffolds[q.id],'Low');
}
// Reanalysis replaces only the original-response result, never identity, work,
// teacher decisions or reassessments. Prior results remain immutable audit entries.
function reanalyseRecord(record,at=new Date().toISOString()){
if(record.result&&record.result.analysisVersion===VERSION)return record;
const copy=value=>JSON.parse(JSON.stringify(value));
return {...record,originalResult:record.originalResult?copy(record.originalResult):copy(record.result),
analysisHistory:[...(record.analysisHistory||[]),{result:copy(record.result),review:copy(record.review??null),replacedAt:at}],
result:analyse(questions[record.q],record.answer,record.reason)};
}
root.ReasonEngine={questions,analyse,correct,reanalyseRecord,relations,mathematicalText,version:VERSION};
})(typeof window!=='undefined'?window:globalThis);
