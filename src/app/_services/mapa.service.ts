import { Injectable } from "@angular/core";
import { WebService } from "./web.service";
import * as fabric from 'fabric';
import { Helpers } from "../helpers";
import { ModalService } from "../theme/pages/default/modal/modal.service";
import { consoleLog } from "../globals";
import { ActivatedRoute } from '@angular/router';

declare function montarTreeLocalizacoes(data: any);

@Injectable()
export class MapaService {

  public stateColors = {
    primary: "#5867dd",
    primaryTransparent: 'rgba(109, 122, 225,0.5)',
    primaryMoreTransparent: 'rgba(109, 122, 225,0.25)',
    primaryLight: '#8792e8',
    secondary: "#D1D3E0",
    info: "#3699FF",
    infoTransparent: "#3699ff85",
    infoHeavy: "#00009C",
    danger: "#f35b6d",
    dangerLight: "#f7e7eb",
    dangerLightB: "#ffc4cb",
    dangerHeavy: "#F64E60",
    dangerHeavyB: "#FFB8BF",
    dangerTransparent: "#ffc4cb99",
    warning: "#fba602",
    warningLight: "#f0eedf",
    warningLightB: "#faf4af",
    warningHeavy: "#FFA800",
    warningHeavyB: "#FAD996",
    warningTransparent: "#faf4af99",
    success: "#2dc6c1",
    successLight: "#e1f3f4",
    successLightB: "#c7f0f2",
    successTransparent: "#c7f0f299",
    successHeavyB: "#A4EBE2",
    successHeavy: "#1BC5BD",
    gray: '#B5B5C3',
    white: "#fff",
    whiteLight: "rgba(255,255,255,0.8",
    shadow: 'rgba(0,0,0,0.1)',
    shadowSecond: 'rgba(0,0,0,0.2)',
    shadowThird: 'rgba(0,0,0,3)',
    textDark75: '#3F4254',
    semVinculo: "rgba(200, 200, 200,0.8)"
  }
  public font = {
    size: 12,
    family: 'Poppins'
  };

  constructor(public webService: WebService,
    private route: ActivatedRoute,
    public modalService: ModalService){
  }

  //#region inicializar planta e canvas

  carregarLocalizacoes(localizacoes){
    var categoria = this.route.snapshot.queryParams['categoria'] || '';
    console.log(categoria);
    this.webService.get(`localizacoes/carregar_localizacoes_mapa.json`, {categoria: categoria})
      .subscribe((dados:any) => {
        localizacoes = dados.localizacoes;
        montarTreeLocalizacoes(localizacoes);
      }
    )
  }

  iniciarPlantaCanvas(planta){
    if (planta){
      planta.clear();
    }else {
      planta = new fabric.Canvas('planta',
      {
        fireMiddleClick: true, fireRightClick: true,
        stopContextMenu: true, selection: false,
        width: "auto", height: "400",
        backgroundColor: '#ebedf0'//'#f5f7fa'//'#F3F6F9' '#f2f3f8' 'f7f7fa'
      });//fcfcfc
    }
    return planta;
  }

  abrirPlanta(planta, data){    
    this.fromJson(planta, data);
    this.createGrid(planta);
  }

  ajustarPlantaCanvas(planta, menu){
    // if (this.tela =='planta') {this.manterFonte();}
    // this.positionHud();
    // this.zoom(planta);
    this.pan(planta, menu);
    // this.editPolygon();
    planta.setWidth($('#divwidth').width());
    // this.createAlignment();
    // this.hoverMovimentation();
    // this.hoverEffect();
  }


  manterFonte(planta){
    planta.on('object:scaling', options => {
      if (options.target.tipo == 'sala'){
        if (options.target.item(1) != undefined){
          var texto = options.target.item(1),
          sala = options.target,
          newX = 1 / sala.scaleX,
          newY = 1 / sala.scaleY;
          
          texto.set({scaleX: newX, scaleY: newY, fontSize: 12});
        }
      }
      if (options.target.tipo == 'mesa' || options.target.tipo == 'estacionamento' || options.target.tipo == 'fretado'){
        if (options.target.item(2) != undefined){
          var texto = options.target.item(2),
          sala = options.target,
          newX = 1 / sala.scaleX,
          newY = 1 / sala.scaleY;
          
          texto.set({scaleX: newX, scaleY: newY, fontSize: 12});
        }
      }
    });
  }

  zoom(planta) {
    consoleLog("carreguei oz oom")
    planta.on('mouse:wheel', opt => {

      consoleLog("tô aqui")
      var delta = opt.e.deltaY;
      var zoom = planta.getZoom();
    // consoleLog(delta);
      zoom -= .001 * delta
      // zoom *= 0.999 ** delta;
      if (zoom > 2) zoom = 2;
      if (zoom < 0.5) zoom = 0.5;
      planta.zoomToPoint({ x: opt.e.offsetX, y: opt.e.offsetY }, zoom);
      opt.e.preventDefault();
      opt.e.stopPropagation();
      var vpt = planta.viewportTransform;
      if (zoom < 400 / 1000) {
        vpt[4] = 200 - 1000 * zoom / 2;
        vpt[5] = 200 - 1000 * zoom / 2;
      } else {
        if (vpt[4] >= 0) {
          vpt[4] = 0;
        } else if (vpt[4] < planta.getWidth() - 1000 * zoom) {
          vpt[4] = planta.getWidth() - 1000 * zoom;
        }
        if (vpt[5] >= 0) {
          vpt[5] = 0;
        } else if (vpt[5] < planta.getHeight() - 1000 * zoom) {
          vpt[5] = planta.getHeight() - 1000 * zoom;
        }
      }
    })
  }

  pan(planta, menu) {
    planta.on('mouse:down', (opt) => {
      var evt = opt.e;
      // if (evt.alt_key==true)
      // if (planta.getActiveObjects().length == 0) {
      // if (opt.button === 2 || opt.button === 3 || (opt.button === 1 && menu === 'mapa')) {
      if (opt.button === 1 && menu === 'mapa') {
        planta.selection = false;
      }
      
      if (opt.button === 2 || opt.button === 3) {
        planta.isDragging = true;
        planta.selection = false;
        planta.lastPosX = evt.clientX;
        planta.lastPosY = evt.clientY;

        // var plantaElement = document.getElementById('planta');
        // plantaElement.classList.add('ui-draggable-handle');
        // planta.cursor = 'grab'

        // var mybody = document.find('body');
        // mybody.addClass('waiting');   // set cursor to hourglass
        // setTimeout(function() {
        //     doSlowStuff();
        //     $scope.$apply();
        //     mybody.removeClass('waiting');  // set cursor to normal
        // }, 0);
      }
    });
    planta.on('mouse:move', opt => {
      if (planta.isDragging) {
        var e = opt.e;
        var vpt = planta.viewportTransform;
        vpt[4] += e.clientX - planta.lastPosX;
        vpt[5] += e.clientY - planta.lastPosY;
        planta.requestRenderAll();
        planta.lastPosX = e.clientX;
        planta.lastPosY = e.clientY;
      }
    });
    planta.on('mouse:up', opt => {
      // on mouse up we want to recalculate new interaction
      // for all objects, so we call setViewportTransform
      consoleLog("tô aqui no mouse up")
      consoleLog(planta.viewportTransform);
      planta.setViewportTransform(planta.viewportTransform);
      planta.isDragging = false;
      planta.selection = true;
    });
  }

  fromJson(planta,json){
    // consoleLog(json)
    // consoleLog(json.objects)
    // consoleLog(json.objects[0])
    // // json.objects.forEach(obj => {
    //   // planta.add(obj);
    // // });    
    // let temp = new fabric.rect(json.objects[0])
    // // planta.add(json.objects[0]);
    // planta.add(temp)
    // planta.renderAll();
    // planta.add(json.objects);
    // planta.renderAll();
    planta.loadFromJSON(json, ()=>{
      planta.renderAll();
    })
  }

  createGrid(planta) {
    var groupGrid;
    var grid = 20;
    var gridMoving = grid / 2;
    var size = 800;
    var lines = [];
    for (var i = 0; i < (size / grid) + 1; i++) {
      var dashArray;
      var lineColor;
      if (i % 2 == 0){
        dashArray = [4,4]
        lineColor = '#ceced9';
      }else{
        dashArray = [2,2]
        lineColor = '#dfdfeb';
      }
      lines.push(new fabric.Line([i * grid, 0, i * grid, size], { stroke: lineColor, strokeDashArray: dashArray, selectable: false, hasControls: false, hasBorders: false, hoverCursor: 'default' }));
      lines.push(new fabric.Line([0, i * grid, size, i * grid], { stroke: lineColor, strokeDashArray: dashArray, selectable: false, hasControls: false, hasBorders: false, hoverCursor: 'default' }))
    }
    // lines.push(new fabric.Line([0, 14 * grid, size, 14 * grid], { stroke: 'red', selectable: false,  hasControls: false, hasBorders: false, hoverCursor: 'default'  }))
    groupGrid = new fabric.Group(lines, {
       id: 'groupGrid', inside: true, selectable: false, hasControls: false,
       hasBorders: false, hoverCursor: 'default', opacity: 1, excludeFromExport: true
      })
    // planta.add(...lines);
    planta.add(groupGrid);
    planta.sendToBack(groupGrid);
    planta.renderAll();
    // consoleLog(planta);

    // planta.on('object:moving', this.snapGrid);
    // planta.on('object:scaling', options => {
    //   if (groupGrid['inside']  == true) {
    //     consoleLog(groupGrid);
    //     consoleLog("tô aqui no sacling do grid")
    //     var target = options.target,
    //       w = target.width * target.scaleX,
    //       h = target.height * target.scaleY,
    //       snap = { // Closest snapping points
    //         top: Math.round(target.top / gridMoving) * gridMoving,
    //         left: Math.round(target.left / gridMoving) * gridMoving,
    //         bottom: Math.round((target.top + h) / gridMoving) * gridMoving,
    //         right: Math.round((target.left + w) / gridMoving) * gridMoving
    //       },
    //       threshold = gridMoving,
    //       dist = { // Distance from snapping points
    //         top: Math.abs(snap.top - target.top),
    //         left: Math.abs(snap.left - target.left),
    //         bottom: Math.abs(snap.bottom - target.top - h),
    //         right: Math.abs(snap.right - target.left - w)
    //       },
    //       attrs = {
    //         scaleX: target.scaleX,
    //         scaleY: target.scaleY,
    //         top: target.top,
    //         left: target.left
    //       };
    //     switch (target.__corner) {
    //       case 'tl':
    //         if (dist.left < dist.top && dist.left < threshold) {
    //           attrs.scaleX = (w - (snap.left - target.left)) / target.width;
    //           attrs.scaleY = (attrs.scaleX / target.scaleX) * target.scaleY;
    //           attrs.top = target.top + (h - target.height * attrs.scaleY);
    //           attrs.left = snap.left;
    //         } else if (dist.top < threshold) {
    //           attrs.scaleY = (h - (snap.top - target.top)) / target.height;
    //           attrs.scaleX = (attrs.scaleY / target.scaleY) * target.scaleX;
    //           attrs.left = attrs.left + (w - target.width * attrs.scaleX);
    //           attrs.top = snap.top;
    //         }
    //         break;
    //       case 'mt':
    //         if (dist.top < threshold) {
    //           attrs.scaleY = (h - (snap.top - target.top)) / target.height;
    //           attrs.top = snap.top;
    //         }
    //         break;
    //       case 'tr':
    //         if (dist.right < dist.top && dist.right < threshold) {
    //           attrs.scaleX = (snap.right - target.left) / target.width;
    //           attrs.scaleY = (attrs.scaleX / target.scaleX) * target.scaleY;
    //           attrs.top = target.top + (h - target.height * attrs.scaleY);
    //         } else if (dist.top < threshold) {
    //           attrs.scaleY = (h - (snap.top - target.top)) / target.height;
    //           attrs.scaleX = (attrs.scaleY / target.scaleY) * target.scaleX;
    //           attrs.top = snap.top;
    //         }
    //         break;
    //       case 'ml':
    //         if (dist.left < threshold) {
    //           attrs.scaleX = (w - (snap.left - target.left)) / target.width;
    //           attrs.left = snap.left;
    //         }
    //         break;
    //       case 'mr':
    //         if (dist.right < threshold) attrs.scaleX = (snap.right - target.left) / target.width;
    //         break;
    //       case 'bl':
    //         if (dist.left < dist.bottom && dist.left < threshold) {
    //           attrs.scaleX = (w - (snap.left - target.left)) / target.width;
    //           attrs.scaleY = (attrs.scaleX / target.scaleX) * target.scaleY;
    //           attrs.left = snap.left;
    //         } else if (dist.bottom < threshold) {
    //           attrs.scaleY = (snap.bottom - target.top) / target.height;
    //           attrs.scaleX = (attrs.scaleY / target.scaleY) * target.scaleX;
    //           attrs.left = attrs.left + (w - target.width * attrs.scaleX);
    //         }
    //         break;
    //       case 'mb':
    //         if (dist.bottom < threshold) attrs.scaleY = (snap.bottom - target.top) / target.height;
    //         break;
    //       case 'br':
    //         if (dist.right < dist.bottom && dist.right < threshold) {
    //           attrs.scaleX = (snap.right - target.left) / target.width;
    //           attrs.scaleY = (attrs.scaleX / target.scaleX) * target.scaleY;
    //         } else if (dist.bottom < threshold) {
    //           attrs.scaleY = (snap.bottom - target.top) / target.height;
    //           attrs.scaleX = (attrs.scaleY / target.scaleY) * target.scaleX;
    //         }
    //         break;
    //     }
    //     target.set(attrs);
    //   }
    // });
    
    planta.on('object:rotating', options => {
      var texto;
      if (options.target.tipo == 'sala'){
        if (options.target.item(1) != undefined){
          texto = options.target.item(1);
        }
      }
      if (options.target.tipo == 'mesa' || options.target.tipo == 'estacionamento' || options.target.tipo == 'fretado'){
        if (options.target.item(2) != undefined){
          texto = options.target.item(2);
        }
      }
      if (groupGrid['inside']) {
      // consoleLog(options);
        options.target.snapAngle = 45;
        // texto.snapAngle = 45;
      }
      else {
        options.target.snapAngle = 0;
        // texto.snapAngle = 45;
      }
      texto.rotate(-1*options.target.angle)
    })
    return groupGrid;
  }

  //#endregion

  //#region habilitar e desabilitar objetos

  habilitarPavimento(planta){
    planta.getObjects().forEach( (o) => {
      if(o.tipo == 'pavimento') {
        o.selectable = true;
        o.hasControls = true;
        o.hoverCursor = 'pointer';
      }
    })
    planta.renderAll();
  }

  desabilitarPavimento(planta){
    planta.getObjects().forEach( (o) => {
      if(o.tipo == 'pavimento') {
        o.selectable = false;
        o.hasControls = false;
        o.hoverCursor = 'default';
      }
    })
    planta.renderAll();
  }

  habilitarMesas(planta){
    planta.getObjects().forEach( (o) => {
      if(o.tipo == 'mesa' || o.tipo == 'estacionamento' || o.tipo == 'fretado') {
        o._objects[0].set("fill",this.stateColors.primary);
        o._objects[1].set("fill",this.stateColors.primary);
        o.selectable = true;
        o.hasControls = true;
        o.hoverCursor = 'pointer';
      }
    })
    planta.renderAll();
  }

  desabilitarMesas(planta){
    planta.getObjects().forEach( (o) => {
      if(o.tipo == 'mesa' || o.tipo == 'estacionamento' || o.tipo == 'fretado') {
        o._objects[0].set("fill",this.stateColors.secondary);
        o._objects[1].set("fill",this.stateColors.secondary);
        o.selectable = false;
        o.hasControls = false;
        o.hoverCursor = 'default';
      }
    })
    planta.renderAll();
  }

  habilitarSalas(planta){
    planta.getObjects().forEach( (o) => {
      if(o.tipo == 'sala') {
        o._objects[0].set("fill",this.stateColors.info);
        o._objects[0].set("stroke",this.stateColors.primary);
        o.selectable = true;
        o.hasControls = true;
        o.hoverCursor = 'pointer';
      }
    })
    planta.renderAll();
  }

  desabilitarSalas(planta){
    planta.getObjects().forEach( (o) => {
      if(o.tipo == 'sala') {
        o._objects[0].set("fill",this.stateColors.secondary);
        o._objects[0].set("stroke",this.stateColors.secondary);
        o.selectable = false;
        o.hasControls = false;
        o.hoverCursor = 'default';
      }
    })
    planta.renderAll();
  }

  //#endregion

  //#region criar objetos

  adicionarPavimentoInicial(planta){

    let rects:any[] = []

    var rect1 = new fabric.Rect({
      top: 75,
      left: 75,
      width: 250,
      height: 150,
      fill: 'rgba(255,255,255,1)',
      // stroke: '#bbb',//'#6d7ae1'
      strokeWidth: 2,
    });

    var rect2 = new fabric.Rect({
      top: 75,
      left: 325,
      width: 200,
      height: 275,
      fill: 'rgba(255,255,255,1)',
      // stroke: '#bbb',//'#6d7ae1'
      strokeWidth: 2,
    });

    rects.push(rect1);
    rects.push(rect2);


    let groupPavimento = new fabric.Group(rects, {
      id: 'groupPavimento', tipo: 'pavimento'
     })
    //  , inside: true
    //  selectable: false, hasControls: false, hoverCursor: 'default'
    planta.add(groupPavimento)
    planta.renderAll();


    // var circle = new fabric.Circle({
    //   radius: 30, fill: '#6d7ae1', top: 50, left: 50
    // });

    // this.points = [
    //   {x: 0, y: 0},
    //   {x: 25, y: 0},
    //   {x: 50, y: 0},
    //   {x: 50, y: 25},
    //   {x: 50, y: 50},
    //   {x: 25, y: 50},
    //   {x: 0, y: 50},
    // ];

    // this.polygon = new fabric.Polygon(this.points, {
    //   left: 0,
    //   top: 0,
    //   fill: 'rgba(255,0,0,0.1)',
    //   strokeWidth: 1,
    //   stroke: 'lightgrey',
    //   scaleX: 1,
    //   scaleY: 1,
    //   objectCaching: false,
    //   transparentCorners: false,
    //   cornerColor: 'blue'
    // });
    // planta.add(this.polygon);
// 
    // this.editPolygon();
    // let group = new fabric.Group();
    // group.addWithUpdate(rect1);
    // // group.addWithUpdate(rect2)
    // planta.add(rect1);
    // planta.add(rect2);

    
    // planta.add
    // planta.add(group);
    
    // var polygon = new fabric.Polygon(points, {
    //   left: 100,
    //   top: 100,
    //   fill: '#D81B60',
    //   strokeWidth: 4,
    //   stroke: 'green',
    //   scaleX: 4,
    //   scaleY: 4,
    //   objectCaching: false,
    //   transparentCorners: false,
    //   cornerColor: 'blue',
    // });
    // var ovo = new fabric.Rect();

    // var stringO = "{ \"type\":\"rect\",\"version\":\"4.4.0\",\"originX\":\"left\",\"originY\":\"top\",\"left\":100,\"top\":100,\"width\":49.5,\"height\":50.5,\"fill\":\"red\",\"stroke\":null,\"strokeWidth\":1,\"strokeDashArray\":null,\"strokeLineCap\":\"butt\",\"strokeDashOffset\":0,\"strokeLineJoin\":\"miter\",\"strokeUniform\":false,\"strokeMiterLimit\":4,\"scaleX\":1,\"scaleY\":1,\"angle\":0,\"flipX\":false,\"flipY\":false,\"opacity\":1,\"shadow\":null,\"visible\":true,\"backgroundColor\":\"\",\"fillRule\":\"nonzero\",\"paintFirst\":\"fill\",\"globalCompositeOperation\":\"source-over\",\"skewX\":0,\"skewY\":0,\"rx\":0,\"ry\":0}";

    // ovo.toObject = () => {
    //   return JSON.parse(stringO)
    // }
    // planta.add(this.rect);
    // planta.add(circle);
    // planta.add(ovo);
  }

  adicionarMesa(planta){
    var rect1 = new fabric.Rect({
      // top: 80,
      // left: 80,
      originX: 'center',
      originY: 'center',
      width: 80,
      height: 30,
      rx: 4,
      ry: 4,
      fill: this.stateColors.info,//'#6d7ae1',//,'#5867dd',//'#6d7ae1'
      // stroke: '#5867dd',
      // strokeWidth: 2,
      // strokeUniform: true,
      hoverCursor: 'pointer'
    });
    var circle = new fabric.Circle({
      radius: 20,
      top: -10,
      left: -20,
      fill: this.stateColors.info,//'#6d7ae1',//,'#5867dd',//'#6d7ae1'
      // stroke: '#5867dd',
      // strokeWidth: 2,
      // strokeUniform: true,
      hoverCursor: 'pointer'
    });
    var mesa = []
    mesa.push(rect1);
    var texto = this.criarTextoEspaco('')
    // texto.set({top:0, left: 0});
    mesa.push(circle);
    mesa.push(texto);

    planta.add(new fabric.Group(mesa, {
      id: '',
      tipo: 'mesa',
      top: 80,
      left: 40,
      // width: 80,
      // height: 40,
     }));
    //  inside: true, selectable: false, hasControls: false,
    //   hasBorders: false, hoverCursor: 'default', opacity: 1, excludeFromExport: true
  }

  adicionarSala(planta){
    let sala=[];
    var rect = new fabric.Rect({
        originX: 'center',
        originY: 'center',
        width: 160,
        height: 160,
        fill: this.stateColors.infoTransparent,//'#6d7ae1',//,'#5867dd',//'#6d7ae1'
        stroke: this.stateColors.info,
        strokeWidth: 2,
        strokeUniform: true,
        hoverCursor: 'pointer'
      });

    var texto = this.criarTextoEspaco('')
  
    sala.push(rect);
    sala.push(texto);
    
    planta.add(new fabric.Group(sala, {
      id: '',
      tipo: 'sala',
      top:80,
      left: 40
    }));

    planta.renderAll();
  }

  criarTextoEspaco(texto){
    return new fabric.IText(texto, {
      originX: "center",
      originY: "middle",
      textAlign: "center",
      fontFamily: this.font.family,//"Segoe UI",
      fontWeight: 600,
      shadow: new fabric.Shadow({color: this.stateColors.white, blur: 4}),
      fontSize: this.font.size,
      fill: this.stateColors.textDark75
    });
  }

  ////#endregion

  //#region movimentação e janela

  animateHoverMovimentation(e, dir, planta) {
    if (e.target) {
    // consoleLog(e.target);
      // fabric.util.animate({
      //   startValue: e.target.get('angle'),
      //   endValue: e.target.get('angle') + (dir ? 10 : -10),
      //   duration: 100,
      //   onChange: value => {
      //     e.target.angle = value;
      //     planta.renderAll();
      //   },
      //   onComplete: () => {
      //     e.target.setCoords();
      //   }
      // });
      // fabric.util.animate({
      //   startValue: e.target.get('coords')
      //   endValue: e.target.get('angle') + (dir ? 10 : -10),
      //   duration: 100,
      //   onChange: value => {
      //     e.target.angle = value;
      //     planta.renderAll();
      //   },
      //   onComplete: () => {
      //     e.target.setCoords();
      //   }
      // });
      fabric.util.animate({
        startValue: e.target.get('scaleX'),
        endValue: e.target.get('scaleX') + (dir ? 0.2 : -0.2),
        duration: 100,
        onChange: value => {
          e.target.scale(value);
          planta.renderAll();
        },
        onComplete: () => {
          e.target.setCoords();
        }
      });
    }
  }

  hoverMovimentation(planta) {
    planta.hoverCursor = 'pointer';
    planta.on('mouse:down', e => { this.animateHoverMovimentation(e, 1, planta); });
    planta.on('mouse:up', e => { this.animateHoverMovimentation(e, 0, planta); });
    // this.__canvases.push(canvas);
  }

  hoverEffect(planta) {
    planta.on('mouse:over', e => {
      planta.hoverCursor = 'pointer';
      // consoleLog(e.target)
      // e.target.bkp_colour = e.target.fill;
      // e.target.set('fill', 'yellow');
      planta.renderAll();
    });

    planta.on('mouse:out', function (e) {
      // e.target.set('fill', e.target.bkp_colour);
      planta.renderAll();
    });
  }

  toJson(planta) {
    planta.renderAll();
    let canvasJson = planta.toJSON(['id', 'tipo', 'nome']);
  // consoleLog(canvasJson);

  // consoleLog(planta.toSVG())
    // this.canvasJson.objects.shift();
    // navigator.clipboard.writeText(JSON.stringify(this.canvasJson.objects))
    navigator.clipboard.writeText(JSON.stringify(canvasJson))
    // return {objects: this.canvasJson.objects};
    return canvasJson;
  }

  zoomIn(planta) {
    var zoom = planta.getZoom();
    if (zoom < 2) {
      planta.setZoom(zoom + .1)
    }
  }

  zoomOut(planta) {
    var zoom = planta.getZoom();
    if (zoom > .6) {
      planta.setZoom(zoom - .1)
    }
  }

  moveViewPort(deltax, deltay, planta) {
    let pos:any = {};
    pos.x += deltax * 40;
    pos.y += deltay * 40;
    planta.absolutePan({
      x: pos.x,
      y: pos.y
    });
    return pos;
  }

  reCenter(planta) {
    planta.setZoom(1);
    planta.absolutePan({
      x: 0,
      y: 0
    });
  }

  aSideToggle(planta) {
    Helpers.setLoading(true);
    var minimizeButton = document.getElementById('m_aside_left_minimize_toggle');
    if (minimizeButton.classList.contains('m-brand__toggler--active')) {
      // this.showHeader = true;
      minimizeButton.click();
      setTimeout(() => {
        planta.setWidth($('#divwidth').width());
        // this.positionHud();
        Helpers.setLoading(false);
      }, 300);
    } else {
      // this.showHeader = false;
      minimizeButton.click()
      setTimeout(() => {
        planta.setWidth($('#divwidth').width());
        // this.positionHud();
        Helpers.setLoading(false);
      }, 300);
    }
  }

  positionHud() {
    // $('#aSideToggle').on('click',()=>{
    //   moveToElementPosition('#elementToMove','#target');
    var plantaAbsolutePosition = this.cumulativeOffset(document.getElementById('planta'));
  // consoleLog(plantaAbsolutePosition);
    // });
    // var pos = $('#planta').position();
    var plantaHeight = $('#planta').outerHeight();
    var plantaWidth = $('#planta').outerWidth();

    // $('#aSideToggle').css("left", width - 20 + "px");
    // $('#aSideToggle').css("top", `calc(${pos.top} + 40px)`);
    $('#aSideToggle').css("top", plantaAbsolutePosition.top);
    $('#aSideToggle').css("left", plantaAbsolutePosition.left + plantaWidth - 35);

    // plantaAbsolutePosition
    // $('#aSideToggle').css("height", height);
    // $('#aSideToggle').css("width", width);
    //   ()=>{
    // });
    //   moveToElementPosition()
    //   $('#aSideToggle').moveToElementPosition()
    // $('#aSideToggle').css('transform','translate(100px, 100px)' )
  }

  cumulativeOffset(element) {
    var top = 0, left = 0;
    do {
      top += element.offsetTop || 0;
      left += element.offsetLeft || 0;
      element = element.offsetParent;
    } while (element);

    return {
      top: top,
      left: left
    };
  };

  //#endregion

}