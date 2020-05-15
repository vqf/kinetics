var isFigAPILoaded = true;

var fdata = {};

class scale{
  constructor(minX, minY, maxX, maxY, xunit, yunit){
    this.minX = minX;
    this.minY = minY;
    this.maxX = maxX;
    this.maxY = maxY;
    this.xunit = xunit;
    this.yunit = yunit;
  }
  xmin(){
    return this.minX;
  }
  xmax(){
    return this.maxX;
  }
  ymin(){
    return this.minY;
  }
  ymax(){
    return this.maxY;
  }
  width(){
    var result = this.maxX - this.minX;
    return result;
  }
  height(){
    var result = this.maxY - this.minY;
    return result;
  }
  minDim(){
    var result = this.width();
    if (this.height() < result){
      result = this.height();
    }
    return result;
  }
  maxDim(){
    var result = this.width();
    if (this.height() > result){
      result = this.height();
    }
    return result;
  }
  xUnit(){
    return this.xunit;
  }
  yUnit(){
    return this.yunit;
  }
  showScale(){
    console.log(this.minX);
    console.log(this.minY);
    console.log(this.maxX);
    console.log(this.maxY);
  }
  setMinX(v){
    this.minX = v;
  }
  setMaxX(v){
    this.maxX = v;
  }
  setMinY(v){
    this.minY = v;
  }
  setMaxY(v){
    this.maxY = v;
  }
}

class svgCode{
  line(x1, y1, x2, y2, id, clss, clip){
    var newLine = document.createElementNS('http://www.w3.org/2000/svg','line');
    newLine.setAttribute('id', id);
    newLine.setAttribute('x1', x1);
    newLine.setAttribute('y1', y1);
    newLine.setAttribute('x2', x2);
    newLine.setAttribute('y2', y2);
    newLine.setAttribute("class", clss);
    if (typeof(clip) != 'undefined'){
      newLine.setAttribute("clip-path", "url(#" + clip + ")");
    }
    var ttl = document.createElementNS('http://www.w3.org/2000/svg','title');
    ttl.innerHTML = id;
    newLine.appendChild(ttl);
    return newLine;
  }
  text(txt, id, cls, tx, ty){
    var newTxt = document.createElementNS('http://www.w3.org/2000/svg','text');
    newTxt.setAttribute('id', id);
    newTxt.setAttribute('class', cls);
    newTxt.setAttribute('x', tx);
    newTxt.setAttribute('y', ty);
    newTxt.innerHTML = txt;
    return newTxt;
  }
  setRectClip(x, y, w, h, id){
    var newClip = document.createElementNS('http://www.w3.org/2000/svg','clipPath');
    newClip.setAttribute('id', id);
    var r = document.createElementNS('http://www.w3.org/2000/svg','rect');
    r.setAttribute('x', x);
    r.setAttribute('y', y);
    r.setAttribute('width', Math.abs(w));
    r.setAttribute('height', Math.abs(h));
    newClip.appendChild(r);
    return newClip;
  }
  setPathClip(pth, id){
    var newp = document.createElementNS('http://www.w3.org/2000/svg','clipPath');
    if (typeof(id) !== 'undefined'){
      if ($("#" + id).length > 0){
        newp = document.getElementById(id);
      }
      else{
        newp.setAttribute('id', id);
      }
    }
    else{
      console.log("Clip paths must have id");
      return;
    }
    var r = document.createElementNS('http://www.w3.org/2000/svg','path');
    r.setAttribute('d', pth);
    newp.appendChild(r);
    return newp;
  }
  rect(x, y, w, h, id, cls){
    var newr = document.createElementNS('http://www.w3.org/2000/svg','rect');
    newr.setAttribute('x', x);
    newr.setAttribute('y', y);
    newr.setAttribute('width', w);
    newr.setAttribute('height', h);
    newr.setAttribute('id', id);
    if (typeof(cls) != 'undefined'){
      newr.setAttribute('class', cls);
    }
    return newr;
  }
  circle(x, y, r, id, cls){
    var newc = document.createElementNS('http://www.w3.org/2000/svg','circle');
    newc.setAttribute('cx', x);
    newc.setAttribute('cy', y);
    newc.setAttribute('id', id);
    newc.setAttribute('r', r);
    newc.setAttribute('class', cls);
    return newc;
  }
  path(pts, cls, clip, closePath, id){
    var cp = _def(closePath, false);
    document.getElementById(id);
    var newp = document.createElementNS('http://www.w3.org/2000/svg','path');
    var pt0 = pts.shift();
    var path = "M" + pt0.join(" ");
    for (var i = 0; i < pts.length; i++){
      path += " L" + pts[i].join(" ");
    }
    if (cp === true){
      path += 'Z';
    }
    if ($("#" + id).length > 0){
      newp = document.getElementById(id);
    }
    newp.setAttribute('d', path);
    if (isSomething(cls)){
      newp.setAttribute('class', cls);
    }
    if (typeof(id) !== 'undefined'){
      newp.setAttribute('id', id);
    }
    if (typeof(clip) != 'undefined'){
      newp.setAttribute('clip-path', 'url(#' + clip + ')');
    }
    return newp;
  }
  customPath(pts, id, cls, clip){
    var clss = _def(cls, 'curve');
    document.getElementById(id);
    var newp = document.createElementNS('http://www.w3.org/2000/svg','path');
    var path = pts;
    if ($("#" + id).length > 0){
      newp = document.getElementById(id);
    }
    newp.setAttribute('d', path);
    newp.setAttribute('class', clss);
    if (typeof(id) !== 'undefined'){
      newp.setAttribute('id', id);
    }
    if (typeof(clip) != 'undefined'){
      newp.setAttribute('clip-path', 'url(#' + clip + ')');
    }
    return newp;
  }
  sprite(id, cls, clip){
    if (!isSomething(id)){
      console.log("Sprites must have Id");
      return 0;
    }
    var newp = document.createElementNS('http://www.w3.org/2000/svg','use');
    newp.setAttributeNS('http://www.w3.org/1999/xlink', 'xlink:href', "#" + id);
    if (isSomething(cls)){
      newp.setAttribute('class', cls);
    }
    if (isSomething(clip)){
      newp.setAttributeNS('http://www.w3.org/2000/svg', 'clip-path', clip);
    }
    return newp;
  }
  linearGradient(id, stops, extra){
    if (!isSomething(id)){
      console.log("Gradient must have id");
      return;
    }
    var newp = document.createElementNS('http://www.w3.org/2000/svg','linearGradient');
    newp.setAttribute('id', id);
    for (var key in extra) {
        if (extra.hasOwnProperty(key)) {
            newp.setAttribute(key, extra[key]);
        }
    }
    for (var i = 0; i < stops.length; i++){
      var st = document.createElementNS('http://www.w3.org/2000/svg','stop');
      st.setAttribute('offset', stops[i][0]);
      st.setAttribute('stop-color', stops[i][1]);
      if (typeof(stops[i][2]) !== "undefined"){
        st.setAttribute('stop-opacity', stops[i][2]);
      }
      newp.appendChild(st);
    }
    return newp;
  }
}

class point{
  constructor(x, y){
    this.x = x;
    this.y = y;
  }
  x(){
    return this.x;
  }
  y(){
    return this.y;
  }
}

class stats{
  constructor(){
    this._init();
  }
  _def(v, d){
    var result = v;
    if (typeof(v) == 'undefined'){
      result = d;
    }
    return result;
  }
  _init(tag){
    let tg = this._def(tag, 'def');
    if (!('points' in this)){
      this.points = {};
    }
    if (!(tg in this.points)){
      this.points[tg] = {};
    }
    this.points[tg] = {};
    this.points[tg]['sumx'] = 0;
    this.points[tg]['sumsqx'] = 0;
    this.points[tg]['sumy'] = 0;
    this.points[tg]['sumxy'] = 0;
    this.points[tg]['n'] = 0;
    this.points[tg]['p'] = [];
    this.points[tg]['last'] = [0, 0];
  }
  addValues(ps){
    if(typeof(ps) == 'number'){
      this.values.push(ps);
      this.sumx += ps;
      this.sumsqx += ps * ps;
      this.n = this.n + 1;
    }
    else if (typeof(ps) == 'object'){
      for (var i = 0; i < ps.length; i++){
        this.addValues(ps[i]);
      }
    }
    this.sorted = false;
  }
  addPoint(p, tag){
    let tg = this._def(tag, 'def');
    if (! (tg in this.points)){
      this._init(tg);
    }
    this.points[tg]['sumx'] += p[0];
    this.points[tg]['sumsqx'] += p[0] * p[0];
    this.points[tg]['sumy'] += p[1];
    this.points[tg]['sumxy'] += p[0] * p[1];
    this.points[tg]['n']++;
    this.points[tg]['p'].push(p);
    this.points[tg]['last'] = p;
  }
  getPoints(tag){
    let tg = this._def(tag, 'def');
    return this.points[tag]['p'];
  }
  getNPoints(tag){
    let tg = this._def(tag, 'def');
    if (tg in this.points){
      return this.points[tg]['n'];
    }
    else{
      return 0;
    }
  }
  getLastPoint(tag){
    let tg = this._def(tag, 'def');
    if (!(tg in this.points)){
      this._init(tg);
    }
    return this.points[tg]['last'];
  }
  linreg(tag){
    let tg = this._def(tg, 'def');
    var b = (this.points[tg]['sumxy'] - (this.points[tg]['sumx'] * this.points[tg]['sumy'])/this.points[tg]['n'])
    /
    (this.points[tag]['sumsqx'] - (this.points[tg]['sumx'] * this.points[tg]['sumx']) / this.points[tg]['n']);
    var a = this.points[tg]['sumy'] / this.points[tg]['n'] - b * this.points[tg]['sumx'] / this.points[tg]['n'];
    var meany = this.points[tg]['sumy'] / this.points[tg]['n'];
    var ssreg = 0;
    var sstot = 0;
    for (var i = 0; i < this.points[tg]['p'].length; i++){
      var xi = this.points[tg]['p'][i][0];
      var yi = this.points[tg]['p'][i][1];
      var fy = a + b * xi;
      var rg = (fy - meany);
      var tt = (yi - meany);
      ssreg += rg * rg;
      sstot += tt * tt;
    }
    var rsq = ssreg / sstot;
    return [a, b, rsq];
  }
  median(){
    if (this.sorted === false){
      this.sortedPoints = this.values.slice(0);
      this.sortedPoints.sort(function(a, b){return a-b});
      this.sorted = true;
    }
    var total = this.sortedPoints.length;
    if (total < 1) return 0;
    var i = total >>> 1;
    var result = this.sortedPoints[i];
    if ((total & 1) === 0){ //even
      result += this.sortedPoints[i - 1]; // 0-based!
      result /= 2;
    }
    return result;
  }
  variance(){
    var result = 0;
    if (this.n > 0){
      result = (this.sumsqx/this.n) - (this.sumx * this.sumx) / (this.n * this.n);
    }
    return result;
  }
  stdev(){
    return Math.sqrt(this.variance());
  }
  xmin(tag){
    let tg = _def(tag, 'def');
    let r = this.points[tg]['p'][0][0];
    for (let i = 0; i < this.points[tg]['p'].length; i++){
      if (this.points[tg]['p'][i][0] < r) r = this.points[tg]['p'][i][0];
    }
    return r;
  }
  xmax(tag){
    let tg = _def(tag, 'def');
    let r = this.points[tg]['p'][0][0];
    for (let i = 0; i < this.points[tg]['p'].length; i++){
      if (this.points[tg]['p'][i][0] > r) r = this.points[tg]['p'][i][0];
    }
    return r;
  }
  ymin(tag){
    let tg = _def(tag, 'def');
    let r = this.points[tg]['p'][0][1];
    for (let i = 0; i < this.points[tg]['p'].length; i++){
      if (this.points[tg]['p'][i][1] < r) r = this.points[tg]['p'][i][1];
    }
    return r;
  }
  ymax(tag){
    let tg = _def(tag, 'def');
    let r = this.points[tg]['p'][0][1];
    for (let i = 0; i < this.points[tg]['p'].length; i++){
      if (this.points[tg]['p'][i][1] > r) r = this.points[tg]['p'][i][1];
    }
    return r;
  }
  clear(){
    this.values = [];
    this.sortedPoints = [];
    this.points = {};
    this.sorted = false;
    this.sumx = 0;
    this.sumsqx = 0;
    this.n = 0;
  }
  showPoints(){
    console.log(this.points['p']);
  }
}

class figureData{
  constructor(figId, scale, margin){
    this._init(figId, scale, margin);
    this.data = {};
    this.vdata = {};
    this.points = new stats;
    this.nTicksX = 0;
    this.nTicksY = 0;
    this.tickSize = 0;
    this.xLegend = [];
    this.yLegend = [];
    this.counter = {}; // Misc, drawFrameEvery;
    this.tmp = {}; // Misc, drawFrameEvery;
    this.transform = this._notransform;
    this.svgEventListeners = [];
    this.elEventListeners = [];
    this.dragging = {'flag': false, 'element': null};
    this.showghost = true;  //Show input point in output fig?
    this.ghostCallbacks = []; // What to do after you show a ghost
    this.pointCallbacks = []; // What to do after you add a point
  }
  xmin(){
    return this.scale.xmin();
  }
  xmax(){
    return this.scale.xmax();
  }
  ymin(){
    return this.scale.ymin();
  }
  ymax(){
    return this.scale.ymax();
  }
  pointScale(tag){
    let minx = this.points.xmin(tag);
    let maxx = this.points.xmax(tag);
    let miny = this.points.ymin(tag);
    let maxy = this.points.ymax(tag);
    let r = new scale(minx, miny, maxx, maxy,
                      this.cScale.xUnit(), this.cScale.yUnit());
    return r;
  }
  _tags(){
    var r = Object.keys(this.points.points);
    return r;
  }
  _init(figId, scale, margin){
    this.scale = scale;
    this.figId = figId;
    this.margin = margin;
    var tmp = this._def(margin, 5);
    this.code = new svgCode();
    this.cScale = this.canvasScale();
    this.cRatio = this.cScale.width() / this.cScale.height();
    //this.margin = this.cScale.minDim() / tmp;
    this.marginX = this.cScale.width() / tmp;
    this.marginY = this.cScale.height() / tmp;
    this.fontSize = this.cScale.minDim() / 20;
    this.svg = document.getElementById(figId);
    this.pt = this.svg.createSVGPoint();
  }
  _notransform(p){
    return p;
  }
  setTransform(f){
    if (typeof(f) !== 'function'){
      console.log("Transform must be a function");
      return;
    }
    this.transform = f;
  }
  setPointCallbacks(){
    for (var i = 0; i < arguments.length; i++){
      var f = arguments[i];
      if (typeof(f) !== 'function'){
        console.log("pointCallback must be a function");
        return;
      }
      this.pointCallbacks.push(f);
    }
  }
  _runPointCallbacks(p){
    var myself = this;
    for (var i = 0; i < this.pointCallbacks.length; i++){
      var f = this.pointCallbacks[i];
      f(myself, p);
    }
  }
  _runGhostCallbacks(p){
    var myself = this;
    for (var i = 0; i < this.ghostCallbacks.length; i++){
      var f = this.ghostCallbacks[i];
      f(myself, p);
    }
  }
  showInfo(txt, n){
    var nfo = this._def(n, 1);
    var fid = this.Id();
    var id = "#" + fid + "_info" + nfo;
    $(id).html(txt);
  }
  clearInfo(n){
    var nfo = this._def(n, 1);
    var fid = this.Id();
    var id = "#" + fid + "_info" + nfo;
    while ($(id).length > 0){
      $(id).html('');
      nfo++;
      id = "#" + fid + "_info" + nfo;
    }
  }
  resetView(){
    var fid = "#" + this.figId;
    var coords = [this.cScale.xmin(), this.cScale.ymin(),
                  this.cScale.width(), this.cScale.height()].join(" ");
    $(fid).removeAttr('viewBox');
    $(fid)[0].setAttribute('viewBox', coords);
  }
  _autoScale(){
    var pts = [];
    var xmin = 0; var xmax = 0; var ymin = 0; var ymax = 0;
    var fst = true;
    for (var i = 0; i < tgs.length; i++){
      let tag = tgs[i];
      pts[tag] = this.getPoints(tag);
      if (fst){
        fst = false;
        xmin = pts[tag][0]; xmax = pts[tag][0];
        ymin = pts[tag][1]; ymax = pts[tag][1];
      }
      else{
        if (xmin > pts[tag][0]){
          xmin = pts[tag][0];
        }
        if (xmax < pts[tag][0]){
          xmax = pts[tag][0];
        }
        if (ymin > pts[tag][1]){
          ymin = pts[tag][1];
        }
        if (ymax < pts[tag][1]){
          ymax = pts[tag][1];
        }
      }
    }
    let result = new scale(xmin, ymin, xmax, ymax, this.xUnit(), this.yUnit());
    return result;
  }
  redrawPoints(){
    var tgs = this._tags();
    var pts = [];
    for (var i = 0; i < tgs.length; i++){
      let tag = tgs[i];
      pts[tag] = this.getPoints(tag);
      for (var j = 0; j < pts[tag].length; j++){
        this.addToPath(pts[tag][j][0], pts[tag][j][1], 'l_' + tag, 'h_' + tag);
      }
    }
  }
  _restoreEventListeners(){
    var evts = Object.keys(this.svgEventListeners);
    for (var i = 0; i < evts.length; i++){
      var k = evts[i];
      this.svg.addEventListener(k, this.svgEventListeners[k], false);
    }
  }
  reScale(sc){
    this.clearFig();
    this._restoreEventListeners();
    this.scale = sc;
    this.drawAxes(this.nTicksX, this.nTicksY);
    this.addLegends(this.xLegend, this.yLegend);
    this.redrawPoints();
  }
  autoZoom(){
    var tgs = this._tags();
    var newsc = this._autoScale();
    this.clearFig();
  }
  zoomView(coords, keepRatio){
    var kr = this._def(keepRatio, true);
    var fid = "#" + this.figId;
    var x1 = Math.min(coords[2], coords[0]);
    var x2 = Math.max(coords[2], coords[0]);
    var y1 = Math.min(coords[3], coords[1]);
    var y2 = Math.max(coords[3], coords[1]);
    var w = x2 - x1;
    var h = y2 - y1;
    if (kr){
      var r = this.cRatio;
      var rp = w / h;
      if (rp < r){
        w = h * r;
      }
      else if (rp > r){
        h = w / r;
      }
    }
    //var info3 = '#' + fid + '_info3';
    //$(info3).html('<p>width: ' + w + '</p>' + '<p>height: ' + h + '</p>');
    var coords = coords.join(" ");
    $(fid).removeAttr('viewBox');
    var mc = [x1, y1, w, h].join(" ");
    $(fid)[0].setAttribute('viewBox', mc);
  }
  xUnit(){
    return this.scale.xUnit();
  }
  yUnit(){
    return this.scale.yUnit();
  }
  Id(){
    return this.figId;
  }
  addData(key, val){
    this.data[key] = val;
  }
  noGhost(){
    this.showghost = false;
  }
  setGhostCallbacks(){
    for (var i = 0; i < arguments.length; i++){
      var f = arguments[i];
      if (typeof(f) !== 'function'){
        console.log("ghostCallback must be a function");
        return;
      }
      this.ghostCallbacks.push(f);
    }
  }
  showGhost(op, id, cls){
    if (this.showghost){
      var p = this.transform(op);
      if (p){
        var clss = this._def(cls, 'highlight');
        var npoints = this.getNPoints();
        var tid = this._def(id, this.Id());
        tid = tid + npoints;
        for (var i = 0; i < p.length; i += 2){
          this.highlightPoint(p[i], p[i + 1], 'tid' + i, clss);
        }
        this._runGhostCallbacks(p);
      }
    }
  }
  addPoint(op, id, cls, tag){
    var p = this.transform(op);
    var clss = this._def(cls, 'highlight');
    var npoints = this.getNPoints();
    var tid = this._def(id, this.Id());
    tid = tid + npoints;
    for (var i = 0; i < p.length; i += 2){
      this.highlightPoint(p[i], p[i + 1], tid + i, clss);
    }
    this.points.addPoint(p, tag);
    this._runPointCallbacks(p, tag);
    var ta = '#ta' + this.Id();
    var prev = $(ta).val();
    if (typeof(prev) !== 'undefined') $(ta).val(prev + p[0].toFixed(2) + "    " + p[1].toFixed(2) + "\r\n" );
  }
  addDisp(op, tag){
    //var lp = this.getLastPoint(tag);
    //var n = this.getNPoints(tag);
    //var tid = "l_" + tag + '_' + n;
    this.addToPath(op[0], op[1], 'l_' + tag, 'h_' + tag);
    this.addPoint(op, "p_" + tag, 'h_' + tag, tag);
  }
  getData(key, def){
    var r = this.data[key]
    if(typeof(r) === 'undefined'){
      this.addData(key, def);
    }
    return this.data[key];
  }
  pushData(key, val){
    if (! (key in this.vdata)){
      this.vdata[key] = [];
    }
    this.vdata[key].push(val);
  }
  getVData(key){
    if (! (key in this.vdata)){
      return [];
    }
    return this.vdata[key];
  }
  resetVData(key){
    this.vdata[key] = [];
  }
  getPoints(tag){
    let tg = this._def(tag, 'def');
    return this.points.getPoints(tg);
  }
  getNPoints(tag){
    let tg = this._def(tag, 'def');
    return this.points.getNPoints(tg);
  }
  getLastPoint(tag){
    var lp = this.points.getLastPoint(tag);
    return lp;
  }
  getOutputs(){
    var result = [];
    var outputs = this.getData('outputs');
    if (typeof(outputs) !== 'undefined'){
      for (var i = 0; i < outputs.length; i++){
        var fid = outputs[i];
        if (fid in fdata){
          result.push(fdata[fid]);
        }
      }
    }
    return result;
  }
  propagate(f){
    var o = this.getOutputs();
    for (var i = 0; i < o.length; i++){
      f.call(o[i]);
    }
  }
  clearPoints(){
    this.points.clear();
    this.propagate(this.clearPoints);
  }
  linreg(tag){
    return this.points.linreg(tag);
  }
  removeData(key){
    this.vdata[key] = [];
  }
  svgObj(){
    return this.svg;
  }
  _transformAbsPoint(x, y){
    var svg = this.svg;
    var pt = this.pt;
    pt.x = x;
    pt.y = y;
    var loc = pt.matrixTransform(svg.getScreenCTM().inverse());
    var cx = this._rx(loc.x);
    var cy = this._ry(loc.y);
    return [cx, cy, loc.x, loc.y];
  }
  _actOnMouse(evt, myself){
    var x = 0; var y = 0;
    if (typeof(evt.touches) !== 'undefined' && evt.touches.length > 0){ // Tablet
      x = evt.touches[0].clientX; y = evt.touches[0].clientY;
    }
    else{
      x = evt.clientX; y = evt.clientY;
    }
    var result = myself._transformAbsPoint(x, y);
    result.push(evt);
    return result;
  }
  _doNothing(c){
    //$("#info").html('<p>' + c[0] + '</p>' + '<p>' + c[1] + '</p>');
    return 0;
  }
  setRightClick(callback, extra){
    var f = function(self, c, evt, extra){
      if (evt.buttons === 2){
        callback(self, c, evt, extra)
      }
    }
    var g = function(self, c, evt, extra){
      callback(self, c, evt, extra);
    }
    this.listenToMouse('mousemove', f, extra);
    this.listenToMouse('mousedown', f, extra);
    this.listenToMouse('touchmove', g, extra);
    this.listenToMouse('touchstart', g, extra);
  }
  listenToMouse(event, callback, extra){ // Callback will be provided (this, [x, y, x', y'], evt, extra)  - primed coordinates are absolute
    var myself = this;
    var e = myself._def(event, 'mousemove');
    callback = myself._def(callback, myself._doNothing);
    var f = this._actOnMouse;
    var onthefly = function(evt){evt.stopPropagation(); var c = f(evt, myself); callback(myself, c, evt, extra); evt.preventDefault()};
    this.svg.addEventListener(e, onthefly, false);
    this.svgEventListeners[e] = onthefly;
    //this.svg.addEventListener('contextmenu', function(e){e.preventDefault(); return false;}); // Hack for Firefox
  }
  elListenToMouse(id, event, callback, extra){
    var myself = this;
    var e = myself._def(event, 'mousemove');
    callback = myself._def(callback, myself._doNothing);
    var f = this._actOnMouse;
    let toapply = document.getElementById(id);
    var onthefly = function(evt){evt.stopPropagation(); var c = f(evt, myself); callback(myself, c, evt, toapply, extra); evt.preventDefault()};
    toapply.addEventListener(e, onthefly, false);
    if (!(id in this.elEventListeners)){
      this.elEventListeners[id] = [];
    }
    this.elEventListeners[id][e] = onthefly;
  }
  abs2rel(p){
    var result = [0, 0];
    result[0] = this._rx(p[0]);
    result[1] = this._ry(p[1]);
    return result;
  }
  _identity(x){
    return x;
  }
  _rx(x){
    var result = this.scale.width() * (x - this.marginX) / (this.cScale.width() - 2 * this.marginX) + this.scale.xmin();
    return result;
  }
  _ry(y){
    var result = this.scale.height() * (this.cScale.height() - y - this.marginY) / (this.cScale.height() - 2 * this.marginY) + this.scale.ymin();
    return result;
  }
  _tx(x){
    var result = this.marginX + (x - this.scale.xmin()) * (this.cScale.width() - 2 * this.marginX) / this.scale.width();
    return result;
  }
  _ty(y){
    var result = this.cScale.height() - this.marginY - (y - this.scale.ymin()) * (this.cScale.height() - 2 * this.marginY) / this.scale.height();
    return result;
  }
  _tw(w){
    var result = w * (this.cScale.width() - 2 * this.marginX) / this.scale.width();
    return result;
  }
  _th(h){
    var result = h * (this.cScale.height() - 2 * this.marginY) / this.scale.height();
    return result;
  }
  _def(v, d){
    var result = v;
    if (typeof(v) == 'undefined'){
      result = d;
    }
    return result;
  }
  _q(t){
    var result = '"' + t + '"';
    return result;
  }
  _iY(y){
    var result = this.cScale.height() - y;
    return result;
  }
  setFontSize(fsize){
    this.fontSize = fsize;
  }
  isInside(x, y){
    var result = true;
    if (x < this.scale.xmin()) return false;
    if (x > this.scale.xmax()) return false;
    if (y < this.scale.ymin()) return false;
    if (y > this.scale.ymax()) return false;
    return result;
  }
  canvasScale(){
    var f = "#" + this.figId;
    var bx = $(f).prop("viewBox").baseVal;
    var result = new scale(bx.x, bx.y, bx.width, bx.height);
    return result;
  }
  width(){
    return this.scale.width();
  }
  height(){
    return this.scale.height();
  }
  transformBBox(obj){
    var result = {};
    result.x = this._rx(obj.x);
    result.y = this._ry(obj.y);
    result.width = obj.width * this.scale.width() / (this.cScale.width() - 2* this.marginX);
    result.height = obj.height * this.scale.height() / (this.cScale.height() - 2* this.marginY);
    return result;
  }
  centerText(id){
    var f = "#" + id;
    var b = $(f)[0].getBBox();
    var w2 = -b.width / 2;
    var h2 = -b.height / 2;
    $(f)[0].setAttribute('x', b.x + w2);
    $(f)[0].setAttribute('y', b.y - h2);
  }
  centerVText(id){
    var f = "#" + id;
    var b = $(f)[0].getBBox();
    var h2 = -b.height / 2;
    $(f)[0].setAttribute('y', b.y - h2);
  }
  placeText(text, id, cls, cx, cy, deltax, deltay){
    var x = this._def(cx, 0);
    var y = this._def(cy, 0);
    var dx = this._def(deltax, 0);
    var dy = this._def(deltay, 0);
    var tx = this._tx(x) - dx;
    var ty = this._ty(y) - dy;
    var lcode = this.code.text(text, id, cls, tx, ty);
    var f = "#" + this.figId;
    $(f).append(lcode);
  }
  placeHtml(htmlObj, cx, cy, deltax, deltay){
    var x = this._def(cx, 0);
    var y = this._def(cy, 0);
    var dx = this._def(deltax, 0);
    var dy = this._def(deltay, 0);
    var tx = this._tx(x) - dx;
    var ty = this._ty(y) - dy;
    htmlObj.setAttribute('x', tx);
    htmlObj.setAttribute('y', ty);
    var f = "#" + this.figId;
    $(f).append(htmlObj);
  }
  setBackground(clr){
    var f = this.Id();
    //console.log(f);
    $("#" + f).css('background-color', clr);
  }
  drawLine(x1, y1, x2, y2, id, clss, clip){
    var f = "#" + this.figId;
    var lid = "#" + id;
    if ($(lid).length > 0){
      this.changeLine(x1, y1, x2, y2, id, clss, clip);
    }
    else{
      var lcode = this.code.line(this._tx(x1), this._ty(y1), this._tx(x2), this._ty(y2), id, clss, clip);
      $(f).append(lcode);
    }
  }
  addLine(x1, y1, x2, y2, id, clss, clip){
    var f = "#" + this.figId;
    var lcode = this.code.line(this._tx(x1).toFixed(3), this._ty(y1).toFixed(3), this._tx(x2).toFixed(3), this._ty(y2).toFixed(3), '', clss, clip);
    $(f).append(lcode);
  }
  addToPath(x2, y2, id, clss, clip){
    var drawEvery = 10;
    var p = document.getElementById(id);
    if (p == null){
      this.addPath([[this._tx(x2.toFixed(3)), this._ty(y2.toFixed(3))]], id, false, clss);
      this.counter[id] = 0;
      this.tmp[id] = '';
    }
    if (this.counter[id] >= drawEvery){
      var g = p.getAttribute('d');
      this.tmp[id] += ' L ' + this._tx(x2.toFixed(3)) + ' ' + this._ty(y2.toFixed(3));
      g += this.tmp[id];
      p.setAttribute('d', g);
      this.counter[id] = 1;
      this.tmp[id] = '';
    }
    else{
      this.tmp[id] += ' L ' + this._tx(x2.toFixed(3)) + ' ' + this._ty(y2.toFixed(3));
      this.counter[id]++;
    }
  }
  line(x1, y1, x2, y2, id, clss, clip){
    var f = "#" + this.figId;
    var lid = "#" + id;
    if ($(lid).length > 0){
      this.changeLine(x1, y1, x2, y2, id, clss, clip);
    }
    else{
      var lcode = this.code.line(x1, y1, x2, y2, id, clss, clip);
      $(f).append(lcode);
    }
  }
  customPath(t, id, cls, clip){
    if (!isSomething(id)){
      console.log("Custom path must have unique id");
      return 0;
    }
    var f = "#" + this.figId;
    var lcode = this.code.customPath(t, id, cls, clip);;
    $(f).append(lcode);
  }
  addSprite(id, cls, clip){
    var f = "#" + this.figId;
    var lcode = this.code.sprite(id, cls, clip);;
    $(f).append(lcode);
  }
  addLinearGradient(id, stops, extra){
    var f = "#" + this.figId;
    var existing = f + " #" + id;
    if ($(existing).length > 0){
      $(existing).remove();
    }
    var lcode = this.code.linearGradient(id, stops, extra);
    this.addDef(lcode);
  }
  changeLine(x1, y1, x2, y2, id, cls, clip){
    var clss = this._def(cls, 'line');
    var lid = "#" + id;
    $(lid).attr('x1', this._tx(x1));
    $(lid).attr('y1', this._ty(y1));
    $(lid).attr('x2', this._tx(x2));
    $(lid).attr('y2', this._ty(y2));
    if (typeof(clip) != 'undefined'){
      $(lid).attr('clip-path', 'url(#' + clip + ')');
    }
  }
  addRectangle(x1, y1, w, h, id, cls){
    var f = "#" + this.figId;
    var lid = "#" + id;
    if ($(lid).length > 0){
      $(lid)[0].setAttribute('x', this._tx(x1));
      $(lid)[0].setAttribute('y', this._ty(y1));
      $(lid)[0].setAttribute('width', this._tx(w + x1) - this._tx(x1));
      $(lid)[0].setAttribute('height', this._ty(y1) - (this._ty(h + y1)));
    }
    else{
      var lcode = this.code.rect(this._tx(x1), this._ty(y1), this._tx(w + x1) - this._tx(x1), this._ty(y1) - (this._ty(h + y1) ), id, cls);
      $(f).append(lcode);
    }
  }
  drawRectangle(x1, y1, w, h, id, cls){ // From mouse
    var f = "#" + this.figId;
    var lid = "#" + id;
    if ($(lid).length > 0){
      $(lid)[0].setAttribute('x', x1);
      $(lid)[0].setAttribute('y', y1);
      $(lid)[0].setAttribute('width', w);
      $(lid)[0].setAttribute('height', h);
    }
    else{
      var lcode = this.code.rect(this._tx(x1), this._ty(y1), w, h, id, cls);
      $(f).append(lcode);
    }
  }
  drawRect(x1, y1, x2, y2, id, cls){
    var clss = this._def(cls, 'line');
    var rx1 = 0; var ry1 = 0;
    var rx2 = 0; var ry2 = 0;
    var dx = x2 - x1;
    var mx0 = this.scale.xmin();
    var my0 = this.scale.ymin();
    var mx1 = this.scale.xmax();
    var my1 = this.scale.ymax();
    if (dx === 0){
      rx1 = mx0;
      rx2 = mx0;
      ry1 = my0;
      ry2 = my1;
    }
    else{
      var dy = y2 - y1;
      var tdr = this.scale.maxDim();
      rx1 = x1 - tdr;
      ry1 = y1 - tdr * dy / dx;
      rx2 = x1 + tdr;
      ry2 = y1 + tdr * dy / dx;
    }
    if ($("#" + id).length){
      this.changeLine(rx1, ry1, rx2, ry2, id, clss, 'visRect');
    }
    else{
      this.drawLine(rx1, ry1, rx2, ry2, id, clss, 'visRect');
    }
  }

  highlightPoint(x, y, id, clss){
    var cls = this._def(clss, 'highlight');
    var cid = "#" + id;
    if ($(cid).length){
      $(cid).attr('cx', this._tx(x));
      $(cid).attr('cy', this._ty(y));
    }
    else{
      var ccode = this.code.circle(this._tx(x), this._ty(y), 1.5, id, cls);
      var f = "#" + this.figId;
      $(f).append(ccode);
    }
  }

  addDef(ccode){
    var f = "#" + this.figId;
    if (! $(f + '> defs').length){
      var defs = document.createElementNS('http://www.w3.org/2000/svg','defs');
      $(f).append(defs);
    }
    $(f + '> defs').append(ccode);
  }

  drawAxes(nTicksX, nTicksY, tickSize){
    this.nTicksX = nTicksX;
    this.nTicksY = nTicksY;
    this.tickSize = tickSize;
    var tx = this._def(nTicksX, 10);
    var tty = Math.floor(tx * this.cScale.height() / this.cScale.width());
    var ty = this._def(nTicksY, tty);
    var tckSize = this._def(tickSize, 3);
    var f = "#" + this.figId;
    // Set clippath
    var ccode = this.code.setRectClip(this.marginX, this.marginY,
                                      this.cScale.width() - 2 * this.marginX,
                                      this.cScale.height() - 2 * this.marginY,
                                      'visRect');
    this.addDef(ccode);
    //x
    var lcode = this.code.line(this._tx(this.scale.xmin()),
                               this._ty(this.scale.ymin()),
                               this._tx(this.scale.xmax()),
                               this._ty(this.scale.ymin()),
                               this.figId + "x", "axis");
    $(f).append(lcode);
    var txd = (this.scale.width()) / tx;
    var c = 0;
    for (var i = 0; i <= tx; i++){
      var cx = this.scale.xmin() + c;
      var tid = cx + "_x";
      var tcode = this.code.line(this._tx(cx),
                                 this._ty(this.scale.ymin()) - tckSize / 2,
                                 this._tx(cx),
                                 this._ty(this.scale.ymin()) + tckSize / 2,
                                 tid, "axis");
      $(f).append(tcode);
      c += txd;
    }
    //y
    var lycode = this.code.line(this._tx(this.scale.xmin()),
                               this._ty(this.scale.ymin()),
                               this._tx(this.scale.xmin()),
                               this._ty(this.scale.ymax()),
                               this.figId + "y", "axis");
    $(f).append(lycode);
    var tyd = (this.scale.height()) / ty;
    var c = 0;
    for (var i = 0; i <= ty; i++){
      var cy = this.scale.ymin() + c;
      var tid = cy + "_y";
      var tcode = this.code.line(this._tx(this.scale.xmin()) - tckSize / 2,
                                 this._ty(cy),
                                 this._tx(this.scale.xmin()) + tckSize / 2,
                                 this._ty(cy),
                                 tid, "axis");
      $(f).append(tcode);
      c += tyd;
    }
  }
  addLegends(xLegend, yLegend){
    this.xLegend = xLegend;
    this.yLegend = yLegend;
    var bottom = - this.scale.height() / 10;
    var center = this.scale.xmin() + this.scale.width() / 20;
    var right = this._rx(this.cScale.width() - (8 * this.marginX) / 10); //(this.scale.width() + this.scale.xmin()) + 2 * this.cScale.width() / this.scale.width();
    if (this.scale.xmin() != 0) this.placeText(this.scale.xmin(), this.figId + "idx1", "clabel", this.scale.xmin(), bottom);
    this.placeText(this.scale.xmax().toFixed(2), this.figId + "idx2", "clabel", this.scale.xmax(), bottom);
    this.placeText(this.scale.ymax().toFixed(2), this.figId + "idy2", "clabel", this.scale.xmin(), this.scale.ymax(), 5, -1);
    this.placeText(" 0 ", this.figId + "idx0", "clabel", 0, bottom);
    var b = 0;
    for (var i = 0; i < xLegend.length; i++){
      this.placeText(xLegend[i], this.figId + "idx2_" + i, "legendLabel", right, b);
      b += bottom;
    }
    var cy = this.scale.ymax() - bottom;
    for (var i = 0; i < yLegend.length; i++){
      this.placeText(yLegend[i], this.figId + "idy2_" + i, "legendLabel", center, cy);
      cy += bottom;
    }
  }

  addFunction(f, param, id, cls){
    var clss = _def(cls, 'curve');
    var d = this.scale.width() / 100;
    var pts = new Array();
    this.lastFunction = new Array();
    for (var x = this.scale.xmin(); x < this.scale.xmax(); x += d){
      var tx = this._tx(x);
      var y = f(x, param);
      var ty = this._ty(y);
      pts.push([tx, ty]);
    }
    this.addPath(pts, id, false, cls);
    this.lastFunction = f;
    this.lastFunctionParams = param;
  }

  addPath(pts, id, back, cls){
    var clss = this._def(cls, '');
    var bck = _def(back, false);
    var g = "#" + this.figId;
    var tcode = this.code.path(pts, clss, 'visRect', false, id);
    if (bck === true){
      $(g).prepend(tcode);
    }
    else{
      $(g).append(tcode);
    }
  }

  addCurve(pts, id, clss, closePath, back){
    var cp = _def(id, closePath);
    var mid = _def(id, 'visRect');
    var bck = _def(back, false);
    var result = [];
    var cls = _def(clss, 'isoline');
    var g = "#" + this.figId;
    for (var i = 0; i < pts.length; i++){
      var tx = this._tx(pts[i][0]);
      var ty = this._ty(pts[i][1]);
      result.push([tx, ty]);
    }
    var tcode = this.code.path(result, cls, 'visRect', cp, mid);
    var fig = document.getElementById(this.figId);
    if (bck === true){
      var fnode = fig.getElementsByTagName('line');
      fig.insertBefore(tcode, fnode.item(0));
    }
    else{
      fig.appendChild(tcode);
    }
  }

  getLastFunctParams(){
    return this.lastFunctionParams;
  }
  getLastFunction(){
    return this.lastFunction;
  }

  imDragging(el, cb){
    var myself = this;
    this.dragging.flag = true;
    this.dragging.element = el;
    var sendme = function(e){myself._keepOnDragging(e, myself, cb); e.preventDefault()};
    this.svg.addEventListener('mousemove', sendme, true);
    this.dragging.function = sendme;
  }

  imnotDragging(){
    this.dragging.flag = false;
    this.svg.removeEventListener('mousemove', this.dragging.function, true);
  }
  amiDragging(){
    return this.dragging.flag;
  }

  _keepOnDragging(e, myself, cb){
    var c = myself._actOnMouse(e, myself);
    this.doDrag(myself, c, e, this.dragging.element, cb);
  }
  startDrag(myself, c, evt, toapply, extra){
    myself.highlightPoint(c[0], c[1], toapply.id, toapply.classList[0]);
    extra(myself, c, evt, toapply);
    myself.imDragging(toapply, extra);
  }

  doDrag(myself, c, evt, toapply, extra){
    if (myself.amiDragging()){
      myself.highlightPoint(c[0], c[1], toapply.id, toapply.classList[0]);
      extra(myself, c, evt, toapply);
    }
  }
  endDrag(myself, c, evt, toapply, extra){
    extra(myself, c, evt, toapply);
    myself.imnotDragging();
  }

  _startZoom(myself, c, evt, extra){
    if ((!myself.dragging.flag) && evt.buttons === 1){
      myself.removeData('zoom');
      myself.pushData('zoom', c);
    }
  }

  _updateZoom(myself, c, evt, extra){
    if ((!myself.dragging.flag) && evt.buttons === 1){
      var c1 = myself.getVData('zoom');
      if (evt.which === 1){
        var xp = c1[0][2];
        var yp = c1[0][3];
        var x1 = Math.min(c[2], xp);
        var x2 = Math.max(c[2], xp);
        var y1 = Math.min(c[3], yp);
        var y2 = Math.max(c[3], yp);
        var w = x2 - x1;
        var h = y2 - y1;
        myself.drawRectangle(x1, y1, w, h, 'zoomRect');
      }
    }
  }

  redraw(){
    $("#" + this.Id()).hide().show(0);
  }
  clearFig(){
    var evts = Object.keys(this.svgEventListeners);
    for (var i = 0; i < evts.length; i++){
      var k = evts[i];
      this.svg.removeEventListener(k, this.svgEventListeners[k], false);
    }
    this.svg.innerHTML = "";
  }

  _endZoom(myself, c, evt, extra){
    if ((!myself.dragging.flag) && evt.which === 1){
      var c1 = myself.getVData('zoom');
      if (typeof(c1) != 'undefined'){
        var x1 = c[2];
        var x2 = c1[0][2];
        var y1 = c[3];
        var y2 = c1[0][3];
        if (x2 !== x1 && y2 !== y1){
          myself.zoomView([x1, y1, x2, y2]);
        }
        else{
          myself.resetView();
        }
      }
      myself.removeData('zoom');
      $("#zoomRect").remove();
    }
    myself.redraw();
  }

  addZooming(){
    this.listenToMouse('mousedown', this._startZoom);
    this.listenToMouse('mousemove', this._updateZoom);
    this.listenToMouse('mouseup', this._endZoom);
  }
  addDragging(id, cb){
    var callback = this._def(cb, this._doNothing);
    this.elListenToMouse(id, 'mousedown', this.startDrag, callback);
    this.elListenToMouse(id, 'mousemove', this.doDrag, callback);
    this.elListenToMouse(id, 'mouseup', this.endDrag, callback);
  }
}


function addNoise(x, nsd, prop){
  var nR = 50;
  var result = x;
  var p = _def(nsd, 0);
  var pp = _def(prop, 0);
  var toadd = 0;
  for (var i = 0; i < nR; i++){
    toadd += (Math.random() - 0.5) * p;
  }
  var toaddp = 0;
  for (var i = 0; i < nR; i++){
    toaddp += (Math.random() - 0.5) * pp;
  }
  x *= (1 + toaddp);
  result = x + toadd;
  return result;
}


function sendPoint(f1, c, evt, extra, action){
  if (typeof(c) === 'undefined') return;
  var x = c[0];
  var y = c[1];
  var outputs = _def(f1.getData('outputs'), []);
  for (var i = 0; i < outputs.length; i++){
    if (!(outputs[i] in fdata)) continue;
    var f = fdata[outputs[i]];
    if (action === 'add')  f.addPoint([x,y], undefined, 'gHighlight');
    if (action === 'show') f.showGhost([x,y], undefined, 'highlight');
  }
}

function propagate(obj, method){
  var o = obj.getOutputs();
  for (var i = 0; i < o.length; i++){
    method(o[i]);
  }
}


function showNoisyMMPoint(f1, c, evt, extra){
  if (c[0] < 0 || c[1] < 0) return;
  var nid = _def(f1.getData('noiseId'), '');
  var pid = _def(f1.getData('propId'), '');
  var nsd = 0; var proportional = 0;
  if ($("#" + nid).length && $("#" + pid).length){
    nsd = $("#" + nid).val() / 2;
    proportional = $("#" + pid).val() / 2;
  }
  var x = c[0];
  cx = x; //addNoise(x, nsd / 5, proportional);
  if (x > (f1.scale.xmin()) && x < (f1.scale.xmax())){
    var y = mm(cx, [Km, Vm]);
    y = addNoise(y, nsd, proportional);
    f1.highlightPoint(cx, y, "yo");
    f1.drawLine(cx, 0, cx, y, "xlocf3", 'coordline');
    f1.drawLine(0, y, cx, y, "ylocf3", 'coordline');
    sendPoint(f1, [x, y], evt, extra, 'show');
  }
}

function addNoisyMMPoint(f1, c, evt, extra){
  if (c[0] < 0 || c[1] < 0) return;
  var nid = _def(f1.getData('noiseId'), '');
  var pid = _def(f1.getData('propId'), '');
  var nsd = 0; var proportional = 0;
  if ($("#" + nid).length && $("#" + pid).length){
    nsd = $("#" + nid).val() / 2;
    proportional = $("#" + pid).val() / 2;
  }
  var x = c[0];
  if (x > (f1.scale.xmin()) && x < (f1.scale.xmax())){
    var y = mm(x, [Km, Vm]);
    y = addNoise(y, nsd, proportional);
    var np = f1.getNPoints();
    f1.addPoint([x, y], f1.Id() + "_p" + np, 'gHighlight');
    sendPoint(f1, [x, y], evt, extra, 'add');
  }
}


function cleanFig(f1, c, evt, extra){
  var figId = f1.Id();
  var outputs = _def(f1.getData('outputs'), []);
  var tid1 = "#" + f1.Id();
  $(tid1 + " > .highlight").remove();
  $(tid1 + " > .coordline").remove();
  for (var i = 0; i < outputs.length; i++){
    var tid2 = "#" + outputs[i];
    $(tid2 + " > .tmpline").remove();
    $(tid2 + " > .highlight").remove();
  }
}

// Read user data

function readUserData(fid){
  var f1 = fdata[fid];
  var lines = getTAlines(fid);
  for (var i = 0; i < lines.length; i++){
    var vs = lines[i].split(/\s+/);
    var id = 'pm' + fid + '_' + i;
    if (vs[0] > 0 && vs[1] > 0){
      f1.addPoint([Number(vs[0]) + 0, Number(vs[1])], id, 'gHighlight');
      sendPoint(f1, [Number(vs[0]) + 0, Number(vs[1])], undefined, undefined, 'add');
    }
  }
  var inp = '#input_' + fid;
  $(inp).toggleClass('hideMe');
  $(inp).toggleClass('showMe');
}

function addUserData(fid){
  var f1 = fdata[fid];
  var ta = '#input_' + fid;
  $(ta).toggleClass('hideMe');
  $(ta).toggleClass('showMe');
}


function getTAlines(fid){
  var f1 = fdata[fid];
  f1.clearPoints();
  var ta = '#ta' + fid;
  var txt = $(ta).val();
  var lines = txt.split(/\r?\n/);
  $(ta).val("");
  return lines;
}

function clearTAlines(fid){
  var f1 = fdata[fid];
  f1.clearPoints();
  var ta = '#ta' + fid;
  $(ta).val("");
}

function p(x){
  return '(' + x + ')';
}

function _resetFig(f){
  resetFig(f.Id());
}

function resetFig(fid){
  var f2 = fdata[fid];
  var start = "#" + fid + "> ";
  clearTAlines(fid);
  f2.clearPoints();
  f2.resetVData('rects');
  f2.addData('nRects', 0);
  f2.clearInfo();
  $(start + ".gHighlight").remove();
  $(start + ".isoline").remove();
  $(start + ".isolines").remove();
  $(start + ".eline").remove();
  $(start + ".ctrline").remove();
  $(start + ".coordline").remove();
  $(start + ".curve").remove();
  $(start + ".f2r").remove();
  $(start + ".coordlineg").remove();
  $(start + ".coordliner").remove();
  $(start + ".gHighlight").remove();
  $(start + ".hg").remove();
  var statkm = f2.getData('kms');
  var statvm = f2.getData('vms');
  if (isSomething(statkm)){
    statkm.clear();
    statvm.clear();
  }
  propagate(f2, _resetFig);
}

function _reDraw(fid){
  var f1 = fdata[fid];
  var p = f1.points;
  resetFig(f1.Id());
  for (var tag in Object.keys(p)){

  }
}


function isSomething(s){
  var result = true;
  if (typeof(s) === 'undefined'){
    result = false;
  }
  else if (s === null){
    result = false;
  }
  else if (s === ''){
    result = false;
  }
  else if (s === 0){
    result = false;
  }
  return result;
}
