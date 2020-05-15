var isKineticsLoaded = true;

var fdata = [];

var boundElements = {};

let DEBUG = false;

if (typeof JSON.clone !== "function") {
    JSON.clone = function(obj) {
        return JSON.parse(JSON.stringify(obj));
    };
}

let mysymbols = {
  '.': 'dot',
  ',': 'com',
  '*': 'ast'
};

class formula{
  constructor(form){
    this.uid = this._uid();
    this.showFormula = true;
    this.noise = 0;
    this._buildObject(form);
    this.config = {};
  }
  getConfig(key){
    let r = this.config[key];
    return _def(r, null);
  }
  setConfig(key, val){
    this.config[key] = val;
  }
  _buildObject(form){
    this.species = {};
    this.display = [];
    var f = form.replace(/\s+/g, '');
    this.original = f;
    var elms = f.split(/([\+\=\-\;])/);
    var nr = 0;
    this.k = [];
    this.kindex = {};
    this.terms = [];
    this.terms[0] = [];
    this.time = 0;
    this.stabledt = 0;
    for (var i = 0; i < elms.length; i++){
      if (elms[i] == '='){
        elms[i] = '&rlhar;';
        let rreact = {'id': 'k' + nr + '_p','pos': i, 'conc': 1e-1, 'order': 0};
        let nreact = {'id': 'k' + nr + '_m','pos': i, 'conc': 1e-1, 'order': 0};
        this.k.push({
          'r': rreact,
          'l': nreact
        });
        this.kindex['k' + nr + '_p'] = rreact;
        this.kindex['k' + nr + '_m'] = nreact;
        nr++;
        this.terms[nr] = [];
      }
      else if (elms[i] == '-'){
        elms[i] = '&rarr;';
        let rreact = {'id': 'k' + nr + '_p','pos': i, 'conc': 1e-1, 'order': 0};
        this.k.push({'r': rreact});
        this.kindex['k' + nr + '_p'] = rreact;
        nr++;
        this.terms[nr] = [];
      }
      else if (elms[i] == ';'){
        elms[i] = ' ';
        this.k.push({'r': {'id': 'k' + nr + '_p','pos': i, 'conc': 0}});
        this.kindex['k' + nr]
        nr++;
        this.terms[nr] = [];
      }
      else if (elms[i] != '+'){
        let conc = 0;
        let el = this._declutterId(elms[i]);
        elms[i] = el;
        let n = elms[i].match(/^\d+/);
        let esteq = 1;
        if (n !== null){
          esteq = n[0];
          let m = elms[i].match(/^\d+(.+)/);
          el = m[1];
        }
        let showme = true;
        if (el === 'H2O'){
          conc = 55e6;
          showme = false;
        }
        this.species[el] = {
          'id': el,
          'conc': conc,
          'vp': [],
          'vm': [],
          'delta': 0,
          'show': showme,
          'speed': 0
        };
        for (let jj = 0; jj < esteq; jj++){
          this.terms[nr].push(el);
        }
      }
    }
    this.nr = nr;
    this._setVelExpr();
    this.frml = elms;
    this.backup();
  }
  hide(sp){
    this.species[sp].show = false;
    this.backup();
  }
  _clearVelExpr(){
    let sp = Object.keys(this.species);
    let ns = sp.length;
    for (let i = 0; i < ns; i++){
      this.species[sp[i]].vp = [];
      this.species[sp[i]].vm = [];
    }
  }
  _setVelExpr(){
    let nr = this.nr;
    for (var i = 0; i < nr + 1; i++){
      var rterm = [];
      var lterm = [];
      var rnegterm = [];
      var lnegterm = [];
      if (i < nr && 'r' in this.k[i] && this.k[i].r.conc > 0){
        rterm.push(this.k[i].r);
        for (var sp in this.terms[i]){
          rterm.push(this.species[this.terms[i][sp]]);
          if ("r" in this.k[i]){
            this.k[i].r.order += 1;
          }
        }
        for (var sp in this.terms[i+1]){
          var el = this.terms[i+1][sp];
          this.species[el].vp.push(rterm);
          if ("l" in this.k[i]){
            this.k[i].l.order += 1;
          }
        }
        rnegterm.push(this.k[i].r);
        for (var sp in this.terms[i]){
          rnegterm.push(this.species[this.terms[i][sp]]);
        }
        for (var sp in this.terms[i]){
          var el = this.terms[i][sp];
          this.species[el].vm.push(rnegterm);
        }
      }
      if (i > 0 && 'l' in this.k[i-1]){
        lterm.push(this.k[i-1].l);
        for (var sp in this.terms[i]){
          lterm.push(this.species[this.terms[i][sp]]);
        }
        for (var sp in this.terms[i-1]){
          var el = this.terms[i-1][sp];
          this.species[el].vp.push(lterm);
        }
        lnegterm.push(this.k[i-1].l);
        for (var sp in this.terms[i]){
          lnegterm.push(this.species[this.terms[i][sp]]);
        }
        for (var sp in this.terms[i]){
          var el = this.terms[i][sp];
          this.species[el].vm.push(lnegterm);
        }
      }
    }
    // Set kinetic units
    let ks = Object.keys(this.kindex);
    for (let j in ks){
      let tel = this.kindex[ks[j]];
      let units = 's<span class="super">-1</span>';
      if (tel.order > 1){
        let o = tel.order - 1;
        units = '&micro;M<span class="super">-' + o.toString() + '</span>' + units;
      }
      tel.units = units;
    }
  }
  strFormula(){
    return this.original;
  }
  getOrder(kid){
    return this.kindex[kid].order;
  }
  getKUnits(kid){
    return this.kindex[kid].units;
  }
  backup(){
    this.spore = {};
    this.spore.original = this.original;
    this.spore.k = JSON.clone(this.k);
    this.spore.species = {};
    var cs = Object.keys(this.species);
    for (var i in cs){
      this.spore.species[cs[i]] = {
        'conc': this.species[cs[i]].conc,
        'show': _def(this.species[cs[i]].show, true)
      };
    }
  }
  hideFormula(){
    this.showFormula = false;
  }
  toString(){
    return JSON.stringify(this.spore);
  }
  fromString(txt){
    var t = JSON.parse(txt);
    this._buildObject(t.original);
    this.k = t.k;
    var cs = Object.keys(t.species);
    for (var i = 0; i < cs.length; i++){
      var ts = t.species[cs[i]];
      this.species[cs[i]].conc = t.species[cs[i]].conc;
      this.species[cs[i]].show = _def(t.species[cs[i]].show, true);
    }
    var ks = Object.keys(this.k);
    this.kindex = {};
    for (let i = 0; i < ks.length; i++){
      let k = this.k[i];
      let r = Object.keys(k);
      for (let j = 0; j < r.length; j++){
        let dir = r[j];
        let kid = k[dir].id;
        this.kindex[kid] = k[dir];
      }
    }
    this._clearVelExpr();
    this._setVelExpr();
    this.backup();
  }
  reset(){
    let form = JSON.stringify(this.spore);
    this.fromString(form);
  }
  _maxDelta(){
    var cs = Object.keys(this.species);
    var maxConc = this.species[cs[0]].conc;
    for (var i = 0; i < cs.length; i++){
      var ts = this.species[cs[i]];
      if (ts.conc > 0 && (maxConc == 0 || ts.conc > maxConc)){
        maxConc = ts.conc;
      }
    }
    return maxConc * 1e-2;
  }
  _uid(){
    var l = 10;
    var result = '';
    var letters = [
      'a', 'b', 'c', 'd',
      'e', 'f', 'g', 'h',
      'i', 'j', 'k', 'l',
      'm', 'n', 'o', 'p',
    ];
    for (var i = 0; i < l; i++){
      var tl = 0;
      for (var j = 0; j < 4; j++){
        tl = tl << 1;
        var r = Math.random();
        if (r > 0.5){
          tl++;
        }
      }
      result += letters[tl];
    }
    return result;
  }
  molecules(){
    var result = [];
    for (var i in this.species){
      var sp = this.species[i];
      if (sp['show'] === true){
        let c = this.getConcentration(i);
        result.push([sp.id, c]);
      }
    }
    return result;
  }
  setCSSColors(){
    let colors = ['#00ff00', '#ff0000', '#0000ff',
                  '#999900', '#00ffff', '#ff00ff',
                  '#22aaff'];
    let defcolor = '#999999';
    var clrs = [];
    for (let i in this.species){
      var sp = this.species[i];
      let tc = defcolor;
      if (colors.length > 0){
        tc = colors.shift();
      }
      clrs.push(['h_' + sp.id, tc]);
    }
    return clrs;
  }
  getConcentration(id){
    var sp = this.species[id];
    return sp.conc + this.noise;
  }
  kkin(){
    return this.k;
  }
  setConcentration(molecule, conc){
    this.species[molecule].conc = conc;
    this.backup();
  }
  setK(kid, value){
    this.kindex[kid].conc = value;
    this.backup();
  }
  simulate(dt, noise){
    var md = this._maxDelta();
    this.noise = _def(noise, 0);
    if (this.stabledt > 0 && this.stabledt < dt){
      dt = this.stabledt * 1.5;
      this.stabledt = dt;
    }
    for (var i in this.species){
      var t = this.species[i];
      t.delta = 0;
      var str = 'd[' + t.id + '] = ';
      if (t.vp.length > 0){
        var tp = 0;
        str += '+';
        for (var j in t.vp){
          var term = t.vp[j];
          var ttp = 1;
          for (var k in term){
            var sk = term[k];
            str += '['+sk.id+']';
            ttp *= sk.conc;
          }
          tp += ttp;
          str += '+';
        }
        t.delta += tp;
      }
      if (t.vm.length > 0){
        var tn = 0;
        str += '-';
        for (var j in t.vm){
          var term = t.vm[j];
          var ttn = 1;
          for (var k in term){
            var sk = term[k];
            str += '['+sk.id+']';
            ttn *= sk.conc;
          }
          tn += ttn;
          str += '-';
        }
        t.delta -= tn;
      }
      if ((t.delta * dt) > md || (t.delta < 0 && (-(t.delta * dt) > (t.conc / 2)))){
        if ((t.delta * dt) > md){
          dt = 0.05 * md /  Math.abs(t.delta);
        }
        else{
          dt = 0.05 * t.conc / Math.abs(t.delta);
        }
        this.stabledt = dt;
      }
      //console.log(str);
      //console.log(t.delta);
    }
    for (var i in this.species){
      var t = this.species[i];
      t.conc += t.delta * dt;
      t.speed = t.delta;
    }
    this.time += dt;
    return this.time;
  }
  _embellish(b){
    let result = '';
    let els = b.split(/(\d+)/);
    while (els.length > 0 && els[0] === ""){
      els.shift();
    }
    if (/\d/.test(els[0])){
      let n0 = els.shift();
      els[0] = n0 + els[0];
    }
    let dy = 0;
    while (els.length > 0){
      let normal = els.shift();
      let sub    = '';
      if (els.length > 0){
        sub = els.shift();
      }
      result += '<tspan dy="' + dy + '">' + normal + '</tspan>';
      if (sub !== ''){
        result += '<tspan class="sub" dy="1">' + sub + '</tspan>';
        dy = -1;
      }
    }
    result = result.replace(/_dot_/g, '<tspan class="super" dy="-2">+</tspan>');
    result = result.replace(/_com_/g, '<tspan class="super" dy="-2">-</tspan>');
    result = result.replace(/_ast_/g, '<tspan class="super" dy="-2">*</tspan>');
    return result;
  }
  _declutterId(id){
    let dc = id.replace(/[\W]/g, function(all){
      if (all in mysymbols){
        return '_' + mysymbols[all] + '_';
      }
      else{
        return '__';
      }
    });
    return dc;
  }
  _setFontSize(fig, delta){
    var form = this.frml;
    let d = fig._tw(delta);
    document.documentElement.style.setProperty('--eqfontsize', 10 * delta);
    let root = document.querySelector(':root');
    let y = window.getComputedStyle(root);
    let fs = y.getPropertyValue('--eqfontsize');
    let corr = 1;
    let maxw = d;
    for (var i = 0; i < form.length; i++){
      var uid = this.uid + 'f' + i;
      let fo = document.getElementById(uid);
      let b = fo.getBBox();
      let tw = b.width;
      if (tw > maxw){
        maxw = tw;
      }
    }
    if (maxw > d){
      fs *= d / maxw;
      document.documentElement.style.setProperty('--eqfontsize', fs);
    }
  }
  drawFormula(figId, y){
    if (!this.showFormula){
      return;
    }
    var f = fdata[figId];
    var form = this.frml;
    var delta = 1 / (form.length + 1);
    var px = delta;
    for (var i = 0; i < form.length; i++){
      var uid = this.uid + 'f' + i;
      let fncy = this._embellish(form[i]);
      f.placeText(fncy, uid, 'formula', px, y);
      f.centerText(uid);
      px += delta;
    }
    this._setFontSize(f, delta);
    for (var i = 0; i < this.k.length; i++){
      var j = i + 1;
      var eli = this.k[i];
      var elis = Object.keys(eli);
      for (var r in elis){
        var tel = eli[elis[r]];
        if (tel.conc > 0){
          var ttl = tel.conc + " " + tel.units;
          var ttlid = 'ttl_' + tel.id;
          var tuid = this.uid + 'f' + tel.pos;
          var arr = document.getElementById(tuid);
          var bc = arr.getBBox();
          var bbx = f.transformBBox(bc);
          //f.drawRectangle(bbx.x, bbx.y, bbx.width, bbx.height, 'tmp', 'contour');
          var cx = bbx.x + bbx.width / 2;
          var cy = bbx.y - 2 * bbx.height;
          var txt = '<title id="' + ttlid + '">'+ttl+'</title>k<tspan class="subindex">-' + j + '</tspan>';
          if (elis[r] === 'r'){
            cy = bbx.y;
            if (cy > f.height()){
              cy = f.height();
            }
            var txt = '<title id="' + ttlid + '">'+ttl+'</title>k<tspan class="subindex">' + j + '</tspan>';
          }
          f.placeText(txt, tel.id, 'kkin', cx, cy);
          f.centerText(tel.id);
        }
      }
    }
  }
  execute(f, opts){
    f(this, opts);
  }
}
//var frm = new formula('E + S = ES = EP = E+P, E + I = EI');
var frm = new formula('E+S=ES=E+P');

function concText(x){
  var result = 'C: ' + Number(x).toFixed(2) + '&micro;M';
  return result;
}

function click_switch(x, e){
  var species = e.target.dataset['associatedvalue'];
  frm.setConcentration(species, x);
  var cid = 'conc_' + species;
  var tid = document.getElementById(cid);
  tid.innerHTML = concText(x);
}

function toggleVisibility(lne){
  if (lne.classList.contains('showMe')){
    lne.classList.remove('showMe');
    lne.classList.add('hideMe');
  }
  else{
    lne.classList.remove('hideMe');
    lne.classList.add('showMe');
  }
}

function renderFrm(t, opts){
  var f1 = opts.shift();
  var sps = t.molecules();
  var kkin = t.kkin();
  if (t.display.length > 0){
    for (var i in t.display){
      var d = t.display[i];
      var sp = d.getValue();
      var c = t.species[sp].conc;
      d.setValue(c);
      var cid = 'conc_' + sp;
      var speed = t.species[sp].speed;
      var ts = concText(c) + ", V: " + speed.toExponential(2) +
      " &micro;M / s";
      var sc = document.getElementById(cid);
      sc.innerHTML = ts;
      if (t.species[sp].id === 'H'){
      }
    }
  }
  else{
    var where = opts.shift();
    var n = sps.length;
    var y = where.y();
    var dy = where.height() / n;
    var dx = dy/2;
    //f1.addRectangle(where.x(), where.y(), where.width(), where.height());
    var nxt = where.x() + 1.1 * dx + where.width();
    for (var sp in sps){ // Conc
      var each = sps[sp];
      let fancy = t._embellish(each[0]);
      boundElements[each[0]] = [];
      f1.placeText(fancy, 'species_' + each[0], 'molecule lh_' + each[0], where.x(), y - dy / 2);
      f1.centerText('species_' + each[0]);
      var spi = document.getElementById('species_' + each[0]);
      spi.setAttribute('data-associatedvalue', each[0]);
      spi.addEventListener('click', showForClipboard);
      var es = new contSwitch(f1.svgObj(), [0, 100, each[0]], 'click_switch');
      boundElements[each[0]].push(es);
      es.inject(f1._tx(where.x()+ dx), f1._ty(y), f1._tw(where.width()), f1._th(dy / 2));
      var l = concText(each[1]);
      f1.placeText(l, 'conc_' + each[0], 'data', nxt, y - dy/2);
      f1.centerVText('conc_' + each[0]);
      es.setValue(each[1]);
      t.display.push(es);
      y -= dy;
      var ttext = document.getElementById('conc_' + each[0]);
      ttext.setAttribute('data-associatedvalue', each[0]);
      ttext.addEventListener('click', inputConc);
    }
    for (var kt in kkin){ //k
      var ks = Object.keys(kkin[kt]);
      for (let kst = 0; kst < ks.length; kst++){
        var k = kkin[kt][ks[kst]];
        var rndrk = document.getElementById(k.id);
        if (rndrk !== null){
          rndrk.addEventListener('click', inputK);
        }
      }
    }
  }
}

function inputK(e){
  var f1 = fdata['fig1'];
  let tid = e.target.id;
  let uts = frm.getKUnits(tid);
  let units = uts.replace('&micro;', '\u{000b5}');
  units = units.replace(/<.*?>/g, '');
  var fobj = new inputBox(f1.svgObj(), tid, units, '[\\d\\.,eE-]', 'changeK');
  var x = 60;
  var y = 50;
  if (typeof(e.target.x.baseVal) === 'object' && e.target.x.baseVal.length > 0
     && 'unitType' in e.target.x.baseVal[0] && 'value' in e.target.x.baseVal[0]){
    x = e.target.x.baseVal[0].unitType * e.target.x.baseVal[0].value;
    y = e.target.y.baseVal[0].unitType * e.target.y.baseVal[0].value;
  }
  fobj.draw(x, y);
}

function changeK(whereid, val){
  if (val > 0){
    var c = Number(val);
    var t = document.getElementById(whereid);
    frm.setK(whereid, c);
    let ttlid = 'ttl_' + whereid;
    var ttl = document.getElementById(ttlid);
    ttl.innerHTML = c + ' &micro;M/s';
  }
  else{
    alert('Only values larger than 0 are allowed');
  }
}


function inputConc(e){
  //alert('clicked ' + e.target.id + " " + e.target.dataset.associatedvalue);
  var f1 = fdata['fig1'];
  var fobj = new inputBox(f1.svgObj(), e.target.id, '\u{000b5}M', '[\\d\\.,e-]', 'changeConcentration');
  var x = 60;
  var y = 50;
  if (typeof(e.target.x.baseVal) === 'object' && e.target.x.baseVal.length > 0
     && 'unitType' in e.target.x.baseVal[0] && 'value' in e.target.x.baseVal[0]){
    x = e.target.x.baseVal[0].unitType * e.target.x.baseVal[0].value;
    y = e.target.y.baseVal[0].unitType * e.target.y.baseVal[0].value;
  }
  fobj.draw(x, y);
}

function changeConcentration(whereid, val){
  if (val > 0){
    var c = Number(val);
    var t = document.getElementById(whereid);
    t.innerHTML = concText(val);
    var whereFrm = t.dataset.associatedvalue;
    frm.setConcentration(whereFrm, c);
    boundElements[whereFrm][0].setValue(c);
  }
  else{
    var c = 0;
    var t = document.getElementById(whereid);
    t.innerHTML = concText(val);
    var whereFrm = t.dataset.associatedvalue;
    frm.setConcentration(whereFrm, c);
    boundElements[whereFrm][0].setValue(c);
  }
}

function reset(){
  var f = fdata['fig1'];
  var f2 = fdata['fig2'];
  frm.reset();
  f.clearFig();
  f2.clearFig();
  setFig1();
  setFig2();
}



function reactCycle(t){
  var dt = 2e-2;
  let defstd = 0.002;
  let std = _def(frm.getConfig('std'), defstd);
  var f = fdata['fig1'];
  var f2 = fdata['fig2'];
  var cont = f.getData('anim');
  let noise = addNoise(0, std);
  var time = frm.simulate(dt, noise);
  var xmax = f2.xmax();
  var all = frm.molecules();
  let maxConc = all[0][1];
  if (time > xmax){
    for (let k = 0; k < all.length; k++){
      if (all[k][1] > maxConc){
        maxConc = all[k][1];
      }
    }
    let newscale = new scale(f2.xmin(), f2.ymin(), 2 * f2.xmax(), maxConc);
    f2.reScale(newscale);
  }
  for (var i = 0 ; i < all.length; i++){
    let m = all[i];
    f2.addDisp([time, m[1]], m[0]);
  }
  var timer = document.getElementById('timer');
  if (time < 1){
    timer.innerHTML = " " + time.toExponential(3) + 's';
  }
  else{
    timer.innerHTML = " " + time.toFixed(3) + 's';
  }
  frm.execute(renderFrm, [f]);
  if (cont === true){
    window.requestAnimationFrame(reactCycle);
  }
}
function anim(){
  var f1 = fdata['fig1'];
  var c = f1.getData('anim');
  if (c === true){
    f1.addData('anim', false);
  }
  else{
    f1.addData('anim', true);
    window.requestAnimationFrame(reactCycle);
  }
}

function stepdt(){
  var f = fdata['fig1'];
  f.addData('anim', false);
  reactCycle();
}

function getNewFormula(){
  let nput = document.getElementById('formInput');
  var f1 = fdata['fig1'];
  var f2 = fdata['fig2'];
  f1.clearFig(); f2.clearFig();
  frm = new formula(nput.value);
  setFig1();
  setFig2();
}

function setFig1(){
  var tscale = new scale(0, 0, 1, 1, 'A', '&lambda;');
  let nput = document.getElementById('formInput');
  nput.addEventListener('keydown', function(e){if (e.key == 'Enter'){getNewFormula()}});
  var osvg = document.getElementById('fig1');
  var f = new figureData('fig1', tscale, 10);
  fdata['fig1'] = f;
  f.addData('anim', false);
  frm.drawFormula('fig1', 0.8);
  var w = new block(0, 0.5, 0.5, 0.5);
  frm.execute(renderFrm, [f, w]);
}


function refreshLine(f, c, evt, el){
  var p1 = document.getElementById('measure1');
  var p2 = document.getElementById('measure2');
  var cp1 = [p1.getAttribute('cx'), p1.getAttribute('cy')];
  var cp2 = [p2.getAttribute('cx'), p2.getAttribute('cy')];
  var tcp1 = f.abs2rel(cp1);
  var tcp2 = f.abs2rel(cp2);
  f.drawLine(tcp1[0], tcp1[1], tcp2[0], tcp2[1], 'measureRect', 'line');
}


function addMeasurer(){
  var f = fdata['fig2'];
  let mdata = f.getVData('measurer');
  if (typeof(mdata) !== 'undefined' && mdata.length > 1){
    f.drawRect(mdata[0][0], mdata[0][1], mdata[1][0], mdata[1][1], 'measureRect', 'line');
    f.highlightPoint(mdata[0][0], mdata[0][1], 'measure1', 'gHighlight');
    f.highlightPoint(mdata[1][0], mdata[1][1], 'measure2', 'gHighlight');
  }
  else{
    let p1 = [0, 0]; let p2 = [10, 10];
    f.drawRect(p1[0], p1[1], p2[0], p2[1], 'measureRect', 'line');
    f.pushData([p1, p2]);
    f.highlightPoint(p1[0], p1[1], 'measure1', 'gHighlight');
    f.highlightPoint(p2[0], p2[1], 'measure2', 'gHighlight');
    f.addDragging('measure1', refreshLine);
    f.addDragging('measure2', refreshLine);
  }


}


function setFig2(){
  var tscale = new scale(0, 0, 10, 100, 's', '&micro;M');
  var f = new figureData('fig2', tscale);
  fdata['fig2'] = f;
  f.drawAxes(10);
  f.addLegends(['t', p(f.xUnit())], ['Conc. ' + p(f.yUnit())]);
  f.addZooming();
  var toCss = frm.setCSSColors();
  let cssCode = '';
  for (let sp = 0; sp < toCss.length; sp++){
    cssCode += '.' + toCss[sp][0] + '{fill: none; stroke-width: 0.5; stroke-linecap="round"; stroke: ' + toCss[sp][1] + ';}' + "\n";
    cssCode += '.l' + toCss[sp][0] + '{fill: ' + toCss[sp][1] + '; stroke: none;}' + "\n";
  }
  var c = document.getElementById('speciesStyle');
  if (c == null){
    c = document.createElement('style');
    c.setAttribute('id', 'speciesStyle');
    document.head.appendChild(c);
  }
  c.innerHTML = cssCode;
  //addMeasurer();

}

function showForClipboard(e){
  let minTime = _def(frm.getConfig('minTime'), 1);
  let minInterval = _def(frm.getConfig('minInterval'), 2);
  var t = document.getElementById(e.currentTarget.id);
  var el = t.dataset['associatedvalue'];
  let result = "Time (s)\t[" + el  + "] (uM)\n";
  let f2 = fdata['fig2'];
  let pts = f2.getPoints(el);
  let nxt = minTime;
  for (let i = 0; i < pts.length; i++){
    if (pts[i][0] >= nxt){
      result += pts[i][0].toExponential(2) + '\t' + pts[i][1].toExponential(2) + '\n';
      nxt += minInterval;
    }
  }
  if (typeof(ClipboardItem) === 'undefined' || typeof(navigator.clipboard) === 'undefined'){
    fallBackCopy(result);
  }
  else{
    var data = [new ClipboardItem({ "text/plain": new Blob([result], { type: "text/plain" }) })];
    navigator.clipboard.write(data).then(function() {
      alert("Copied to clipboard");
    }, function(){
      fallBackCopy(result);
    });
  }
}

function fallBackCopy(result){
  let ta = document.getElementById('copyText');
  ta.innerHTML = result;
  toggleVisibility(ta);
  ta.select();
  ta.setSelectionRange(0, 99999);
  let msg = document.execCommand("copy");
  let alrt = msg ? 'Copied' : 'Error, not copied'
  alert(alrt + ' to fallback clipboard');
  toggleVisibility(ta);
}
