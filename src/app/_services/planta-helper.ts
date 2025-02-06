import { fabric } from 'fabric';
import { consoleLog } from '../globals';

export class PlantaHelper{
  public planta: fabric.Canvas;
  public tooltip: fabric.Group;

  public stateColors = {
    primary: "#5867dd",
    primaryTransparent: 'rgba(109, 122, 225,0.5)',
    primaryMoreTransparent: 'rgba(109, 122, 225,0.25)',
    primaryLight: '#8792e8',
    secondary: "#D1D3E0",
    info: "#3699FF",
    infoTransparent: "#3699ff85",
    danger: "#f35b6d",
    dangerLight: "#f7e7eb",
    dangerLightB: "#ffc4cb",
    warning: "#fba602",
    warningLight: "#f0eedf",
    warningLightB: "#faf4af",
    success: "#2dc6c1",
    successLight: "#e1f3f4",
    successLightB: "#c7f0f2",
    gray: '#B5B5C3',
    white: "#fff",
    whiteLight: "rgba(255,255,255,0.8",
    shadow: 'rgba(0,0,0,0.1)',
    shadowSecond: 'rgba(0,0,0,0.2)',
    shadowThird: 'rgba(0,0,0,3)',
    textDark75: '#3F4254',
    semVinculo: "rgba(200, 200, 200,0.8)",
    
    dangerHeavy: "#F64E60",
    dangerTransparent: "#ffc4cb99",
    warningHeavy: "#FFA800",
    warningTransparent: "#faf4af99",
    successTransparent: "#c7f0f299",
    successHeavy: "#1BC5BD",
    dangerHeavyB: "#FFB8BF",
    warningHeavyB: "#FAD996",
    successHeavyB: "#A4EBE2",
    infoHeavy: "#00009C"
    
  }
  public font = {
    size: 12,
    family: 'Poppins'
  };

  constructor(planta){
    this.planta = planta;
  }

  construirTooltip(target){
    if (target == undefined && target.nome == undefined){return;}
    consoleLog("constrir tootlip")
    let itens=[];
    consoleLog(target.nome);
    var text = new fabric.IText(target.nome, {
      originX: "center",
      originY: "middle",
      textAlign: "center",
      fontFamily: this.font.family,//"Segoe UI",
      fontWeight: 500,
      shadow: new fabric.Shadow({color: this.stateColors.white, blur: 2}),
      fontSize: 16,
      fill: this.stateColors.textDark75,
      tipo: 'pavimento',
    });

    consoleLog(text);

    var card = new fabric.Rect({
      originX: 'center',
      originY: 'center',
      width: text.width + 40,
      height: 30,
      rx: 10,
      ry: 10,
      fill: this.stateColors.white,//'#6d7ae1',//,'#5867dd',//'#6d7ae1'
      // stroke: this.stateColors.primary,
      // strokeWidth: 2,
      // strokeUniform: true,
      shadow: new fabric.Shadow({color: this.stateColors.shadowSecond, blur: 5, offsetX: 0, offsetY: 0}),
    });

    var ribbon = new fabric.Triangle(
      { top: -(card.height/2)-10, left: -20, width: 40, height: 10, fill: this.stateColors.white,
        shadow: new fabric.Shadow({color: this.stateColors.shadowSecond, blur: 5, offsetX: 0, offsetY: 0})}
    )

    itens.push(ribbon);
    itens.push(card);
    itens.push(text);
    consoleLog(target);
    consoleLog(this.planta.viewportTransform[0])

    var fatorMultiplicacao = this.planta.viewportTransform[0];
    //1.1

    // target.left*fatorMultiplicacao

    var left = (target.left + target.width/2)-(card.width/fatorMultiplicacao/2)

    // left

    this.destruirTooltip();
    this.tooltip = new fabric.Group(itens, {
      id: '',
      tipo: 'tooltip',
      nome: target.nome,
      top: (target.top + target.height),
      left: (left),
      hoverCursor: 'pointer',
      moveCursor: 'grabbing',
      scaleX: 1/fatorMultiplicacao,
      scaleY: 1/fatorMultiplicacao,
    })
    consoleLog('tooltip criado')
    consoleLog(this.tooltip);
    this.planta.add(this.tooltip);
    this.planta.renderAll();
  }

  destruirTooltip(){
    this.planta.remove(this.tooltip);
    this.tooltip = undefined;
    this.planta.renderAll();
  }

  reiniciarTooltip(){
    consoleLog("reiniciar tooltip");
    consoleLog(this.tooltip.nome)
    var backupTooltip = {...this.tooltip};
    consoleLog(this.tooltip.nome)

    
    // var backupTooltip = this.deepCopy(this.tooltip);
    // this.tooltip = undefined;
    consoleLog(this.tooltip)
    consoleLog(backupTooltip);
    this.construirTooltip(backupTooltip);
    // this.destruirTooltip();
  }

  zoom() {
    this.planta.on('mouse:wheel', opt => {

      // this.reiniciarTooltip();

      var delta = opt.e.deltaY;
      var zoom = this.planta.getZoom();
    // consoleLog(delta);
      zoom -= .001 * delta
      // zoom *= 0.999 ** delta;
      if (zoom > 2) zoom = 2;
      if (zoom < 0.5) zoom = 0.5;
      this.planta.zoomToPoint({ x: opt.e.offsetX, y: opt.e.offsetY }, zoom);
      opt.e.preventDefault();
      opt.e.stopPropagation();
      var vpt = this.planta.viewportTransform;
      if (zoom < 400 / 1000) {
        vpt[4] = 200 - 1000 * zoom / 2;
        vpt[5] = 200 - 1000 * zoom / 2;
      } else {
        if (vpt[4] >= 0) {
          vpt[4] = 0;
        } else if (vpt[4] < this.planta.getWidth() - 1000 * zoom) {
          vpt[4] = this.planta.getWidth() - 1000 * zoom;
        }
        if (vpt[5] >= 0) {
          vpt[5] = 0;
        } else if (vpt[5] < this.planta.getHeight() - 1000 * zoom) {
          vpt[5] = this.planta.getHeight() - 1000 * zoom;
        }
      }
    })
  }

  deepCopy(obj) {
    var copy;

    // Handle the 3 simple types, and null or undefined
    if (null == obj || "object" != typeof obj) return obj;

    // Handle Date
    if (obj instanceof Date) {
        copy = new Date();
        copy.setTime(obj.getTime());
        return copy;
    }

    // Handle Array
    if (obj instanceof Array) {
        copy = [];
        for (var i = 0, len = obj.length; i < len; i++) {
            copy[i] = this.deepCopy(obj[i]);
        }
        return copy;
    }

    // Handle Object
    if (obj instanceof Object) {
        copy = {};
        for (var attr in obj) {
            if (obj.hasOwnProperty(attr)) copy[attr] = this.deepCopy(obj[attr]);
        }
        return copy;
    }

    throw new Error("Unable to copy obj! Its type isn't supported.");
  }

  createGrid() {
    var groupGrid;
    var grid = 20;
    var gridMoving = grid / 2;
    var size = 6000;
    var lines = [];
    for (var i = (size / -2 / grid); i < (size / 2 / grid) + 1; i++) {
      var dashArray;
      var lineColor;
      if (i % 2 == 0){
        dashArray = [4,4]
        lineColor = '#ceced9';
      }else{
        dashArray = [2,2]
        lineColor = '#dfdfeb';
      }
      lines.push(new fabric.Line([i * grid, size/-2, i * grid, size/2], { stroke: lineColor, strokeDashArray: dashArray, selectable: false, hasControls: false, hasBorders: false, hoverCursor: 'default' }));
      lines.push(new fabric.Line([size/-2, i * grid, size/2, i * grid], { stroke: lineColor, strokeDashArray: dashArray, selectable: false, hasControls: false, hasBorders: false, hoverCursor: 'default' }))
    }

    // for (var i = 0; i < (size / grid) + 1; i--) {
    //   var dashArray;
    //   var lineColor;
    //   if (i % 2 == 0){
    //     dashArray = [4,4]
    //     lineColor = '#ceced9';
    //   }else{
    //     dashArray = [2,2]
    //     lineColor = '#dfdfeb';
    //   }
    //   lines.push(new fabric.Line([i * grid, 0, i * grid, size], { stroke: lineColor, strokeDashArray: dashArray, selectable: false, hasControls: false, hasBorders: false, hoverCursor: 'default' }));
    //   lines.push(new fabric.Line([0, i * grid, size, i * grid], { stroke: lineColor, strokeDashArray: dashArray, selectable: false, hasControls: false, hasBorders: false, hoverCursor: 'default' }))
    // }


    // lines.push(new fabric.Line([0, 14 * grid, size, 14 * grid], { stroke: 'red', selectable: false,  hasControls: false, hasBorders: false, hoverCursor: 'default'  }))
    groupGrid = new fabric.Group(lines, {
       id: 'groupGrid', inside: true, selectable: false, hasControls: false,
       hasBorders: false, hoverCursor: 'default', opacity: 1, excludeFromExport: true
      //  posi
      })
    // planta.add(...lines);
    this.planta.add(groupGrid);
    this.planta.sendToBack(groupGrid);
    this.planta.renderAll();
    // consoleLog(planta);

    // this.planta.on('object:moving', this.snapGrid);
    // this.planta.on('object:scaling', options => {
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
    
    this.planta.on('object:rotating', options => {
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

  desenharMapaComReservas(espacosReservas){
    //dentro dele. percorrer todos os objetos das plantas
    this.planta.getObjects().forEach( (obj) => {
      let espacoReserva
      switch (obj.tipo) {
        case 'imagemPlanta':
        case 'pavimento':
          obj.selectable = false;
          obj.hasControls = false;
          obj.hoverCursor = 'default';
          break;

        case 'sala':
          espacoReserva = espacosReservas.find(x=>x.id == obj.id)
          this.desenharSalas(espacoReserva, obj)
          console.log("desenho sala")
          console.log(obj);
          break;
        case 'mesa':
        case 'estacionamento':
        case 'fretado':
          espacoReserva = espacosReservas.find(x=>x.id == obj.id)
          this.desenharMesas(espacoReserva, obj)
          consoleLog("desenho mesa")
          consoleLog(obj);
          break;
      
        default:
          break;
      }

    })
    this.planta.renderAll();
  }

  desenharMesas(espacoReserva, objeto){
    objeto.selectable = false;
    objeto.hasControls = false;
    objeto.hoverCursor = 'pointer';
    var situacao = espacoReserva == undefined ? '' : espacoReserva.situacao;

    switch (situacao) {
      case 'livre':
        objeto.set({situacao: espacoReserva.situacao,
          backupColor: this.stateColors.successHeavy,
          backupLine: this.stateColors.successHeavy})
        objeto._objects[0].set("fill",this.stateColors.successHeavy);
        objeto._objects[1].set("fill",this.stateColors.successHeavy);
        break;

      case 'ocupado':
        objeto.set({situacao: espacoReserva.situacao,
          backupColor: this.stateColors.dangerHeavy,
          backupLine: this.stateColors.dangerHeavy})
        objeto._objects[0].set("fill",this.stateColors.dangerHeavy);
        objeto._objects[1].set("fill",this.stateColors.dangerHeavy);
        break;
    
      case 'espera':
        objeto.set({situacao: espacoReserva.situacao,
          backupColor: this.stateColors.warningHeavy,
          backupLine: this.stateColors.warningHeavy})
        objeto._objects[0].set("fill",this.stateColors.warningHeavy);
        objeto._objects[1].set("fill",this.stateColors.warningHeavy);
        break;

      // case 'finalizando':
      //   objeto.set({situacao: espacoReserva.situacao,
      //     backupColor: this.stateColors.infoHeavy,
      //     backupLine: this.stateColors.infoHeavy})
      //   objeto._objects[0].set("fill",this.stateColors.infoHeavy);
      //   objeto._objects[1].set("fill",this.stateColors.infoHeavy);
      //   break;

      default:
        objeto._objects[0].set("fill",this.stateColors.secondary);
        objeto._objects[1].set("fill",this.stateColors.secondary);
        objeto.selectable = false;
        objeto.hasControls = false;
        objeto.hoverCursor = 'default';
        break;
    }
  }

  desenharSalas(espacoReserva, objeto){
    objeto.selectable = false;
    objeto.hasControls = false;
    objeto.hoverCursor = 'pointer';
    var situacao = espacoReserva == undefined ? '' : espacoReserva.situacao;

    objeto._objects[0].set("strokeWidth",1);
    switch (situacao) {
      case 'livre':
        objeto.set({situacao: espacoReserva.situacao,
          backupColor: this.stateColors.successHeavyB,
          backupLine: this.stateColors.successHeavy})
        objeto._objects[0].set("fill",this.stateColors.successHeavyB);
        objeto._objects[0].set("stroke",this.stateColors.successHeavy);
        break;

      case 'ocupado':
        objeto.set({situacao: espacoReserva.situacao,
          backupColor: this.stateColors.dangerHeavyB,
          backupLine: this.stateColors.dangerHeavy})
        objeto._objects[0].set("fill",this.stateColors.dangerHeavyB);
        objeto._objects[0].set("stroke",this.stateColors.dangerHeavy);
        break;
    
      case 'espera':
        objeto.set({situacao: espacoReserva.situacao,
          backupColor: this.stateColors.warningHeavyB,
          backupLine: this.stateColors.warningHeavy})
        objeto._objects[0].set("fill",this.stateColors.warningHeavyB);
        objeto._objects[0].set("stroke",this.stateColors.warningHeavy);
        break;

      // case 'finalizando':
      //   objeto.set({situacao: espacoReserva.situacao,
      //     backupColor: this.stateColors.infoHeavy,
      //     backupLine: this.stateColors.infoHeavy})
      //   objeto._objects[0].set("fill",this.stateColors.infoHeavy);
      //   objeto._objects[1].set("fill",this.stateColors.infoHeavy);
      //   break;

      default:
        objeto._objects[0].set("fill",this.stateColors.secondary);
        objeto._objects[0].set("stroke",this.stateColors.secondary);
        objeto.selectable = false;
        objeto.hasControls = false;
        objeto.hoverCursor = 'default';
        break;
    }
  }
}
