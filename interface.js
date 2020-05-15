var register = {};
function _def(){
  var result = '';
  for (var i = 0; i < arguments.length; i++){
    var r = arguments[i];
    if (typeof(r) !== 'undefined' && r !== null && r !== ""){
      return r;
    }
  }
  return result;
}
function _q(v){
  return '\'' + v + '\'';
}
function _uid(){
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

class codeSVG{
  constructor(tag, attributes){
    this.svg = document.createElementNS('http://www.w3.org/2000/svg', tag);
    this.xlmns = 'http://www.w3.org/2000/svg';
    for (var k in attributes){
      if (attributes.hasOwnProperty(k)){
        this.svg.setAttribute(k, attributes[k]);
      }
    }
  }
  add(inner){
    this.svg.appendChild(inner.get_code());
  }
  addNode(inner){
    this.svg.appendChild(inner);
  }
  get_code(){
    return this.svg;
  }
}

class block{
  constructor(x, y, w, h){
    this.xc = x; this.yc = y;
    this.wc = w; this.hc = h;
  }
  shift(dx, dy){
    this.xc += dx; this.yc += dy;
  }
  x(){
    return this.xc;
  }
  y(){
    return this.yc;
  }
  width(){
    return this.wc;
  }
  height(){
    return this.hc;
  }
  add(b2){
    this.xc += b2.x() + b2.width();
    this.yc += b2.y() + b2.height();
  }
}


class widgetInterface{
  constructor(svgObj, opts, callback){
    this.id = _uid();
    register[this.id] = this; // Register for access from the id
    this.svgObj = svgObj;
    this.scripts = []; // For cleanup
    this.styles = []; // For cleanup
    this.inner = {
      'outr': this.id + '_outr',
      'innr': []
    };
    if (typeof(callback) === 'undefined' || callback === ""){
      callback = 'null';
    }
    this.callback = callback;
    this.states = [];
    this.code = new svgCode();
    for (let i = 0; i < opts.length; i++){
      this.states.push(_def(opts[i], 'st' + i));
      this.inner['innr'].push(this._switch_id(i));
    }
    this.state = 0;
    this._getInitialParams();
    this._additionalFunctions();
  }
  _getInitialParams(){
    this.nstates = this.states.length;
    this.k = this._k();
    this.margin = 1 / (this.nstates * this.k + this.nstates + 1);
    this.iw = this.k * this.margin;

  }
  _additionalFunctions(){
    return;
  }
  _k(){
    return 9;
  }
  _clickFunct(){
    var result = '';
    result += [`
      var els = document.getElementsByClassName("`, this.id,
      `");
      for (var el of els){
        el.addEventListener('click', function(e){
          var t = e.target.id;
          var tels = document.getElementsByClassName("`, this.id, `");

          for (var tel of tels){
            if (tel.id === t){
              tel.classList.remove("`, this._inclass('inactive'), `");
              tel.classList.add("`, this._inclass('active'), `");
            }
            else{
              tel.classList.remove("`, this._inclass('active'), `");
              tel.classList.add("`, this._inclass('inactive'), `");
            }
          }
          if (`, this.callback, ` !== null){
            `, this.callback, `(e.target.dataset.associatedvalue);
          }
        });
      }
      els[0].classList.remove("`, this._inclass('inactive'), `");
      els[0].classList.add("`, this._inclass('active'), `");
    `].join("");
    return result;
  }
  _defStyle(scale){
    var result = '';
    result += [`
    .`, this.id, `{
      stroke: #000;
    }
    .`, this.id, `_outr{
      stroke: none;
      fill: #ffffff;
    }
    .`, this.id, `_active{
      stroke: #000;
      stroke-width: `, scale * 0.1, `;
      fill: #ffaaaa;
      transition: fill 0.5s;
    }
    .`, this.id, `_inactive{
      stroke: #000;
      stroke-width: `, scale * 0.1, `;
      fill: #aaaaaa;
      transition: fill 0.5s;
    }
    `].join("");
    return result;
  }
  _removeScript(){
    var sid =  this._inclass('def_script');
    if (s !== null){
      s.parentNode.removeChild(s);
    }
  }
  _addScript(txt){
    var sid =  this._inclass('def_script');
    var s = document.getElementById(sid);
    if (s === null){
      s = document.createElement("script");
      s.type = "text/javascript";
      s.id = sid;
    }
    var scrpt = document.createTextNode(txt);
    s.appendChild(scrpt);
    this.scripts.push(s);
    document.body.appendChild(s);
  }
  _addStyle(txt){
    var sid =  this._inclass('def_css');
    var s = document.getElementById(sid);
    if (s === null){
      s = document.createElement("style");
      s.type = "text/css";
      s.id = sid;
    }
    var scrpt = document.createTextNode(txt);
    s.appendChild(scrpt);
    this.styles.push(s);
    document.head.appendChild(s);
  }
  _removeById(id){
    var el = document.getElementById(id);
    if (el !== null){
      el.parentNode.removeChild(el);
    }
  }
  clean(){
    this._removeById(this.id);
    var scid = this._inclass('def_script');
    this._removeById(scid);
    var scss = this._inclass('def_css');
    this._removeById(scss);
  }
  _switch_id(n){
    return(this.id + "_innr_" + n);
  }
  _inclass(t){
    return this.id + "_" + t;
  }
  _outRect(r){
    var xd = r.x(); var yd = r.y();
    var wd = r.width(); var hd = r.height();
    var result = new codeSVG('rect', {
      'id': this.inner['outr'],
      'class': this.id + '_outr',
      'x': xd,
      'y': yd,
      'width': wd,
      'height': hd
    });
    return result;
  }
  _innerRect(i, r){
    var xd = r.x(); var yd = r.y();
    var wd = r.width(); var hd = r.height();
    var result = new codeSVG('rect', {
      'id': this._switch_id(i),
      'class': this.id + " " + this._inclass("inactive"),
      'data-associatedvalue': this.states[i],
      'x': xd,
      'y': yd,
      'width': wd,
      'height': hd
    });
    return result;
  }
  _getMargins(xd, yd, wd, hd){
    var mg = wd * this.margin;
    var ym = hd / (2 + this.k);
    var result = new block(xd, yd, mg, ym);
    return result;
  }
  _getInnerBlock(wd, hd){
    var w = wd * this.iw;
    var mg = wd * this.margin;
    var ym = hd / (2 + this.k);
    var h = ym * this.k;
    var result = new block(0, 0, w, h);
    return result;
  }
  _nextBlock(inner, margin){
    inner.shift(margin.width(), 0);
    inner.shift(inner.width(), 0);
  }
  inject(x, y, width, height){
    var tmp = document.getElementById(this.id);
    if (tmp !== null){
      return;
    }
    var xd = _def(x, 0); var yd = _def(y, 0);
    var wd = _def(width, 50); var hd = _def(height, 10);
    var sc = Math.min(wd, hd);
    this._addStyle(this._defStyle(sc));
    var result = new codeSVG('g', {
      'id': this.id
    });
    var crect = new block(xd, yd, wd, hd);
    var outRect = this._outRect(crect);
    result.add(outRect);
    var marginRect = this._getMargins(xd, yd, wd, hd);
    var iRect = this._getInnerBlock(wd, hd);
    iRect.add(marginRect);
    for (var i = 0; i < this.nstates; i++){
      var inel = this._innerRect(i, iRect);
      this._nextBlock(iRect, marginRect);
      result.add(inel);
    }
    this.svgObj.appendChild(result.get_code());
    this._addScript(this._clickFunct());
  }
}


class jswitch extends widgetInterface {

}

class contSwitch extends widgetInterface{
  setValue(v){
    if (this.states[1] < v){
      this.states[1] = 2 * v;
    }
    var l = v * (this.w) / (this.states[1] - this.states[0]);
    var uid = this.id + "_meter";
    var x = document.getElementById(uid);
    if (x != null){
      x.setAttribute('width', l);
    }
    else{
      var result = new codeSVG('rect', {
        'id': uid,
        'class': this.id + " " + this._inclass("active"),
        'x': this.x,
        'y': this.y,
        'width': l,
        'height': this.h,
        'pointer-events': 'none'
      });
      this.svgObj.appendChild(result.get_code());
    }
  }
  _clickFunct(){
    var result = '';
    var fid = this.svgObj.id;
    result += [`
      {
      var els = document.getElementsByClassName("`, this.id,
      `");
      var thiswidget`, this.id, ` = register["`, this.id, `"];
      var parent`, this.id, ` = document.getElementById("`, fid, `");
      var pt`, this.id, ` = parent`, this.id, `.createSVGPoint();
      for (var el of els){
        el.addEventListener('click', function(e){
          var t = e.target.id;
          if (`, this.callback, ` !== null){
            pt`, this.id, `.x = e.clientX;
            pt`, this.id, `.y = e.clientY;
            var loc =  pt`, this.id, `.matrixTransform(parent`, this.id, `.getScreenCTM().inverse());
            var v = `, this.states[0], ` + ((loc.x - `, this.x, `)*(`, this.states[1], `-`, this.states[0], `) / (`, this.w, `));
            thiswidget`, this.id, `.setValue(v);
            `, this.callback, `(v, e);
          }
        });
      }
    }
    `].join("");
    return result;
  }
  _defStyle(scale){
    var result = '';
    result += [`
    .`, this.id, `{
      stroke: #000;
    }
    .`, this.id, `_outr{
      stroke: none;
      fill: #ffffff;
    }
    .`, this.id, `_inactive{
      stroke: none;
      fill: #222233;
      transition: fill 0.5s;
    }
    .`, this.id, `_active{
      stroke: none;
      fill: #ff2222;
      transition: fill 0.5s;
    }
    `].join("");
    return result;
  }
  _innerRect(r){
    var i = 0;
    if (this.states.length > 2){
      i = 2;
      this.value = this.states[i];
    }
    var xd = r.x(); var yd = r.y();
    var wd = r.width(); var hd = r.height();
    var result = new codeSVG('rect', {
      'id': this._switch_id(i),
      'class': this.id + " " + this._inclass("inactive"),
      'data-associatedvalue': this.states[i],
      'x': xd,
      'y': yd,
      'width': wd,
      'height': hd
    });
    return result;
  }
  _getInnerBlock(wd, hd){
    var w = wd;
    var mg = wd * this.margin;
    var ym = hd / (2 + this.k);
    var h = ym * this.k;
    var result = new block(0, 0, w, h);
    return result;
  }
  getValue(){
    return this.value;
  }
  inject(x, y, width, height){
    this.x = x; this.y = y; this.w = width; this.h = height;
    var tmp = document.getElementById(this.id);
    if (tmp !== null){
      return;
    }
    var xd = _def(x, 0); var yd = _def(y, 0);
    var wd = _def(width, 50); var hd = _def(height, 10);
    var sc = Math.min(wd, hd);
    this._addStyle(this._defStyle(sc));
    var result = new codeSVG('g', {
      'id': this.id
    });
    var crect = new block(xd, yd, wd, hd);
    var outRect = this._outRect(crect);
    result.add(outRect);
    var iRect = new block(xd, yd, wd, hd);
    var inel = this._innerRect(iRect);
    result.add(inel);
    this.svgObj.appendChild(result.get_code());
    this._addScript(this._clickFunct());
  }
}
if (typeof(isAbsorbanceLoaded) !== 'undefined'){
  class spectrum extends widgetInterface {
    _additionalFunctions(){
      if (typeof(isChromaticsIncluded) === 'undefined'){
        alert("spectrum needs cromatics.js to work");
      }
      if (typeof(isAbsorbanceLoaded) === 'undefined'){
        alert("spectrum needs absorbance.js to work");
      }
      if (this.nstates === 0){
        for (var l = 380; l < 700; l += 5){
          this.states.push(l);
        }
        this._getInitialParams();
      }
    }
    _k(){
      return 20;
    }
    _defStyle(scale){
      var result = '';
      result += [`
      .`, this.id, `{
        fill: #dddddd;
        stroke: none;
        pointer-events: fill;
      }
      .`, this.id, `:hover{
        fill: #dddddd;
        stroke-width: `, scale ,`;
      }
      .`, this.id, `_outr{
        stroke: #000;
        fill: #aaaaaa;
      }
      .`, this.id, `_active{
        stroke-width: `, scale ,`;
        transition: fill 0.5s;
      }
      .`, this.id, `_inactive{
        stroke: none;
        transition: fill 0.5s;
      }
      `].join("");
      return result;
    }
    _innerRect(i, r){
      var xd = r.x(); var yd = r.y();
      var wd = r.width(); var hd = r.height();
      var y = getY(this.states[i]);
      var xyz = lambda_to_xyz(this.states[i]);
      var rgb = xyz_to_rgb(CIEsystem, xyz);
      rgb = gamma_correct_rgb(CIEsystem, rgb);
      var color = rainbow(rgb, y);
      var result = new codeSVG('rect', {
        'id': this._switch_id(i),
        'class': this.id + " " + this._inclass("inactive"),
        'data-associatedvalue': this.states[i],
        'x': xd,
        'y': yd,
        'style': 'fill: ' + color + '; stroke: ' + color,
        'width': wd,
        'height': hd
      });
      return result;
    }
  }
}

class inputBox{
  constructor(svgObj, targetId, txt, pattern, callback){
    this.svgObj = svgObj;
    this.scripts = [];
    this.id = _uid();
    register[this.id] = this; // Register for access from the id
    this.callback = callback;
    this.target = targetId;
    this.pattern = pattern;
    this.code = this._inputBox(txt);
  }
  _inputBox(txt){
    var fobj = document.createElementNS('http://www.w3.org/2000/svg', 'foreignObject');
    var nput = document.createElement('input');
    fobj.setAttribute('width', 20);
    fobj.setAttribute('height', 10);
    fobj.setAttribute('type', 'text');
    fobj.setAttribute('id', this.id);
    nput.style['font-size'] = '3px';
    nput.setAttribute('id', 'npt_' + this.id);
    nput.style.width = '10px';
    nput.style.height = '10px';
    nput.style.padding = '0px';
    nput.style.size = '1';
    fobj.style['font-size'] = '2px';
    var bton = document.createElement('button');
    var btxt = document.createTextNode(txt);
    bton.setAttribute('id', 'btn_' + this.id);
    bton.style.width = '10px';
    bton.style.padding = '0px';
    bton.appendChild(btxt);
    fobj.appendChild(nput);
    fobj.appendChild(bton);
    return fobj;
  }
  draw(x, y){
    this.code.setAttribute('x', x);
    this.code.setAttribute('y', y);
    this.svgObj.appendChild(this.code);
    this._addScript(this._controlInputBehavior() + this._clickFunct());
    this._setFocusOnInput();
  }
  _setFocusOnInput(){
    var j = document.getElementById('npt_' + this.id);
    j.focus();
  }
  _controlInputBehavior(){
    var result = '';
    result += [`
      {
        let o = document.getElementById("npt_`, this.id, `");
        o.addEventListener('keydown', function(e){
          let r = true;
          if (e.key == "Enter"){
            click`, this.id, `();
          }
          else if (e.key == "Escape"){
            let self = register["`, this.id, `"];
            self.erase();
          }
          else if (!e.key.match(/`, this.pattern, `/)){
            r = false;
            e.preventDefault();
            e.stopPropagation();
          }
          return r;
        }, true);
      }
      `].join("");
      return result;
    }
    _clickFunct(){
      var result = '';
      result += [`
        function click`, this.id, `(e){
          let v`, this.id, ` = document.getElementById("npt_`, this.id, `");
          let x`, this.id, ` = v`, this.id, `.value;
          `, this.callback, `("`, this.target, `", x`, this.id, `);
          let self = register["`, this.id, `"];
          self.erase();
        }
        {
          let o`, this.id, ` = document.getElementById("btn_`, this.id, `");
          o`, this.id, `.addEventListener('click', click`, this.id, `);
        }
        `].join("");
        return result;
    }
    _addScript(txt){
      var sid =  this._inclass('def_script');
      var s = document.getElementById(sid);
      if (s === null){
        s = document.createElement("script");
        s.type = "text/javascript";
        s.id = sid;
      }
      var scrpt = document.createTextNode(txt);
      s.appendChild(scrpt);
      this.scripts.push(s);
      document.body.appendChild(s);
    }
    _inclass(t){
      return this.id + "_" + t;
    }
    _removeScript(){
      var sid =  this._inclass('def_script');
      var s = document.getElementById(sid);
      if (s !== null){
        s.parentNode.removeChild(s);
      }
    }
    erase(){
      this._removeScript();
      var t = document.getElementById(this.id);
      t.parentNode.removeChild(t);
    }
}


class labelBox{
  constructor(svgObj, txt, cls){
    let c = _def(cls, null);
    this.svgObj = svgObj;
    this.id = _uid();
    this.width = 0;
    this.height = 0;
    this.fsize = 4;
    this.class = c;
    register[this.id] = this; // Register for access from the id
    this.code = this._inputBox(txt);
  }
  _inputBox(txt){
    var foreign = document.createElementNS('http://www.w3.org/2000/svg', 'text');
    let fobj = document.createTextNode(txt);
    foreign.setAttribute('id', this.id);
    if (this.class != null){
      foreign.setAttribute('class', this.class);
    }
    else{
      foreign.style['font-size'] = this.fsize;
    }
    foreign.style['fill'] = '#ffff00';
    foreign.style.padding = '0px';
    foreign.appendChild(fobj);
    return foreign;
  }
  draw(x, y){
    this.code.setAttribute('x', x);
    this.code.setAttribute('y', y);
    let tmp = document.getElementById(this.id);
    if (tmp == null){
      this.svgObj.appendChild(this.code);
      tmp = document.getElementById(this.id);
      var b = tmp.getBBox();
      tmp.setAttribute('y', y - b.height);
    }
  }
  display(txt){
    let fobj = document.getElementById(this.id);
    if (fobj != null){
      fobj.innerHTML = txt;
    }
  }
}
