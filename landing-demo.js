// PT Board landing — interactive wizard demo (vanilla JS, no dependencies)
(function(){
  function $(id){return document.getElementById(id);}
  function tr(key,fb){var t=window.TR&&TR[document.documentElement.lang]&&TR[document.documentElement.lang][key];return t==null?fb:t;}
  function scoreColor(n){return n>=70?'#10b981':n>=40?'#f59e0b':'#ef4444';}
  function colorClass(c){return c==='#10b981'?'green':c==='#f59e0b'?'yellow':'red';}

  function bmiCat(bmi){
    if(!bmi)return{lbl:'—',color:'#64748b'};
    if(bmi<18.5)return{lbl:tr('demo.bmiUnder','Sottopeso'),color:'#f59e0b'};
    if(bmi<25)return{lbl:tr('demo.bmiNormal','Normopeso'),color:'#10b981'};
    if(bmi<30)return{lbl:tr('demo.bmiOver','Sovrappeso'),color:'#f59e0b'};
    return{lbl:tr('demo.bmiObese','Obesit\u00e0'),color:'#ef4444'};
  }
  // Deurenberg 1991: %BF = (1.20*BMI) + (0.23*age) - (10.8*sex) - 5.4 ; sex M=1 F=0
  function fmDeurenberg(bmi,age,sex){
    if(!bmi||!age)return null;
    var fm=(1.20*bmi)+(0.23*age)-(10.8*(sex==='M'?1:0))-5.4;
    return Math.max(0,Math.min(60,+fm.toFixed(1)));
  }
  function fmCat(fm,sex){
    if(fm==null)return{lbl:'—',color:'#64748b'};
    var hi=sex==='M'?25:32;
    var mid=sex==='M'?20:28;
    if(fm<mid)return{lbl:tr('demo.fmGood','Buona'),color:'#10b981'};
    if(fm<hi)return{lbl:tr('demo.fmAcc','Accettabile'),color:'#f59e0b'};
    return{lbl:tr('demo.fmHigh','Elevata'),color:'#ef4444'};
  }
  // Base 30y norms: M 580m, F 550m. -10m every 5y over 30, floor 300m.
  function mwtNorm(age,sex){
    var base=sex==='M'?580:550;
    var over=Math.max(0,(age||30)-30);
    return Math.max(300,base-Math.floor(over/5)*10);
  }
  function scoreMwt(dist,age,sex){
    if(!dist)return 0;
    var n=mwtNorm(age,sex);
    if(dist>=n)return 80;
    if(dist>=n*0.8)return 50;
    return 25;
  }
  function scoreSts(rip){
    if(!rip)return 0;
    if(rip>=15)return 80;
    if(rip>=10)return 50;
    return 25;
  }
  function scoreFm(fm,sex){
    if(fm==null)return 0;
    var hi=sex==='M'?25:32;
    if(fm<hi*0.8)return 85;
    if(fm<hi)return 60;
    return 40;
  }
  function totalScore(s1,s2,s3){
    return Math.round(s1*0.4 + s2*0.3 + s3*0.2 + 10);
  }
  function profileFromScore(s){
    if(s>=75)return{code:'C',name:tr('demo.profGood','Buona Forma'),color:'#10b981'};
    if(s>=45)return{code:'B',name:tr('demo.profMid','Forma Media'),color:'#f59e0b'};
    return{code:'A',name:tr('demo.profLow','Forma Bassa'),color:'#ef4444'};
  }
  function programFromProfile(profCode,age){
    var s,c,f;
    if(profCode==='A'){s=3;c=75;f=40;}
    else if(profCode==='B'){s=4;c=120;f=60;}
    else{s=5;c=150;f=90;}
    if(age&&age>65){c=Math.round(c*0.85);f=Math.round(f*0.8);}
    return{sedute:s,minCardio:c,minForza:f};
  }
  function nutrizione(peso,altezza,age,sex,profCode){
    if(!peso||!altezza||!age)return null;
    // Mifflin-St Jeor BMR + activity factor based on profile
    var m=sex==='M';
    var bmr=m?(10*peso+6.25*altezza-5*age+5):(10*peso+6.25*altezza-5*age-161);
    var pal=profCode==='C'?1.55:profCode==='B'?1.45:1.35;
    return{kcal:Math.round(bmr*pal),proteine:Math.round(peso*1.6)};
  }

  // Cached DOM refs (populated in init)
  var el={};

  function setStep(n){
    [1,2,3].forEach(function(k){el['step'+k].style.display=(k===n)?'block':'none';});
    [1,2,3].forEach(function(k){
      var d=el['dot'+k];
      d.classList.remove('active','done');
      if(k<n)d.classList.add('done');
      else if(k===n)d.classList.add('active');
    });
    [1,2].forEach(function(k){
      if(k<n)el['line'+k].classList.add('done');
      else el['line'+k].classList.remove('done');
    });
    if(n===3)renderResult();
  }

  function updateStep1(){
    var peso=parseFloat(el.peso.value);
    var alt=parseFloat(el.altezza.value);
    var age=parseInt(el.eta.value,10);
    var sex=el.sesso.value;
    if(peso>0&&alt>0){
      var bmi=+(peso/Math.pow(alt/100,2)).toFixed(1);
      var cat=bmiCat(bmi);
      el.bmiBox.style.display='flex';
      el.bmiVal.textContent=bmi;
      el.bmiVal.style.color=cat.color;
      el.bmiLbl.textContent=cat.lbl;
      el.bmiBox.className='demo-info-box '+colorClass(cat.color);
      if(age>0){
        var fm=fmDeurenberg(bmi,age,sex);
        var fcat=fmCat(fm,sex);
        el.fmBox.style.display='flex';
        el.fmVal.textContent=fm+'%';
        el.fmVal.style.color=fcat.color;
        el.fmLbl.textContent=fcat.lbl;
        el.fmBox.className='demo-info-box '+colorClass(fcat.color);
      }else{
        el.fmBox.style.display='none';
      }
    }else{
      el.bmiBox.style.display='none';
      el.fmBox.style.display='none';
    }
  }

  function updateStep2(){
    var dist=parseFloat(el.mwt.value);
    var age=parseInt(el.eta.value,10)||30;
    var sex=el.sesso.value||'F';
    var s=scoreMwt(dist,age,sex);
    el.mwtBar.style.width=s+'%';
    el.mwtBar.style.background=scoreColor(s);
    el.mwtScoreLbl.textContent=s+' / 100';
  }

  function setBar(barEl,lblEl,score){
    var col=scoreColor(score);
    barEl.style.width='0%';
    barEl.style.background=col;
    lblEl.textContent=score+'/100';
    setTimeout(function(){barEl.style.width=score+'%';},120);
  }

  function renderResult(){
    var peso=parseFloat(el.peso.value)||0;
    var alt=parseFloat(el.altezza.value)||0;
    var age=parseInt(el.eta.value,10)||30;
    var sex=el.sesso.value||'F';
    var nome=(el.nome.value||'Sara').trim();
    var cognome=(el.cognome.value||'Rossi').trim();
    var dist=parseFloat(el.mwt.value)||0;
    var sts=parseFloat(el.sts.value)||0;
    var bmi=peso&&alt?+(peso/Math.pow(alt/100,2)).toFixed(1):0;
    var fm=fmDeurenberg(bmi,age,sex);
    var s1=scoreMwt(dist,age,sex);
    var s2=scoreSts(sts);
    var s3=scoreFm(fm,sex);
    var total=totalScore(s1,s2,s3);
    var prof=profileFromScore(total);
    var prog=programFromProfile(prof.code,age);
    var nut=nutrizione(peso,alt,age,sex,prof.code);

    el.profBox.className='demo-profile-box '+prof.code;
    el.profName.textContent=prof.name;

    el.profScore.textContent='0';
    var start=performance.now(),dur=900;
    function animScore(t){
      var p=Math.min(1,(t-start)/dur);
      el.profScore.textContent=Math.round(total*(p<1?(1-Math.pow(1-p,3)):1));
      if(p<1)requestAnimationFrame(animScore);
    }
    requestAnimationFrame(animScore);

    el.profBar.style.width='0%';
    el.profBar.style.background=prof.color;
    setTimeout(function(){el.profBar.style.width=total+'%';},80);

    setBar(el.bar1,el.bar1Lbl,s1);
    setBar(el.bar2,el.bar2Lbl,s2);
    setBar(el.bar3,el.bar3Lbl,s3);

    el.progVal.textContent=prog.sedute+' '+tr('demo.miniSed','sedute/sett')+' \u00b7 '+prog.minCardio+"' "+tr('demo.miniCardio','cardio')+' \u00b7 '+prog.minForza+"' "+tr('demo.miniForza','forza');
    el.nutriVal.textContent=nut?('~'+nut.kcal+' kcal \u00b7 '+nut.proteine+'g '+tr('demo.miniProt','proteine')):tr('demo.miniNoData','Inserisci peso, altezza, et\u00e0');
    el.pwName.textContent=nome+' '+cognome;
  }

  function canAdvance1(){
    return parseFloat(el.peso.value)>0&&parseFloat(el.altezza.value)>0&&parseInt(el.eta.value,10)>0;
  }
  function canAdvance2(){
    return parseFloat(el.mwt.value)>0;
  }
  function refreshButtons(){
    el.next1.disabled=!canAdvance1();
    el.next2.disabled=!canAdvance2();
  }

  function bindInputs(elements,handler){
    elements.forEach(function(elm){if(elm)elm.addEventListener('input',handler);});
  }

  function init(){
    if(!$('demoStep1'))return;
    el={
      step1:$('demoStep1'),step2:$('demoStep2'),step3:$('demoStep3'),
      dot1:$('demoDot1'),dot2:$('demoDot2'),dot3:$('demoDot3'),
      line1:$('demoLine1'),line2:$('demoLine2'),
      nome:$('demoNome'),cognome:$('demoCognome'),sesso:$('demoSesso'),
      eta:$('demoEta'),peso:$('demoPeso'),altezza:$('demoAltezza'),
      bmiBox:$('demoBmiBox'),bmiVal:$('demoBmiVal'),bmiLbl:$('demoBmiLbl'),
      fmBox:$('demoFmBox'),fmVal:$('demoFmVal'),fmLbl:$('demoFmLbl'),
      mwt:$('demoMwt'),rpe:$('demoRpe'),sts:$('demoSts'),symp:$('demoSymp'),
      mwtBar:$('demoMwtBar'),mwtScoreLbl:$('demoMwtScoreLbl'),
      profBox:$('demoProfBox'),profName:$('demoProfName'),profScore:$('demoProfScore'),profBar:$('demoProfBar'),
      bar1:$('demoBar1'),bar1Lbl:$('demoBar1Lbl'),
      bar2:$('demoBar2'),bar2Lbl:$('demoBar2Lbl'),
      bar3:$('demoBar3'),bar3Lbl:$('demoBar3Lbl'),
      progVal:$('demoProgVal'),nutriVal:$('demoNutriVal'),pwName:$('demoPwName'),
      next1:$('demoNext1'),next2:$('demoNext2'),
      back2:$('demoBack2'),back3:$('demoBack3'),restart:$('demoRestart')
    };
    var step1Inputs=[el.nome,el.cognome,el.sesso,el.eta,el.peso,el.altezza];
    var step2Inputs=[el.mwt,el.rpe,el.sts,el.symp];
    bindInputs(step1Inputs,function(){updateStep1();refreshButtons();});
    bindInputs(step2Inputs,function(){updateStep2();refreshButtons();});
    el.sesso.addEventListener('change',function(){updateStep1();refreshButtons();});
    el.symp.addEventListener('change',function(){updateStep2();refreshButtons();});
    el.next1.addEventListener('click',function(){if(canAdvance1())setStep(2);});
    el.next2.addEventListener('click',function(){if(canAdvance2())setStep(3);});
    el.back2.addEventListener('click',function(){setStep(1);});
    el.back3.addEventListener('click',function(){setStep(2);});
    el.restart.addEventListener('click',function(){
      [el.nome,el.cognome,el.eta,el.peso,el.altezza,el.mwt,el.rpe,el.sts].forEach(function(elm){if(elm)elm.value='';});
      el.sesso.value='F';
      el.symp.value='NO';
      updateStep1();
      updateStep2();
      refreshButtons();
      setStep(1);
    });
    refreshButtons();
  }
  if(document.readyState==='loading'){
    document.addEventListener('DOMContentLoaded',init);
  }else{
    init();
  }
})();
