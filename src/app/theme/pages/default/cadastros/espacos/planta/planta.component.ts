import { AfterViewInit, Component, ElementRef, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { Helpers } from '../../../../../../helpers';
import { fabric } from 'fabric';
import { Subject } from 'rxjs';
import { textSpanContainsPosition, textSpanIntersection, transform } from 'typescript';
import { ModalService } from '../../../modal/modal.service';
import { WebService } from '../../../../../../_services/web.service';
import { NgbModal, NgbModalOptions } from '@ng-bootstrap/ng-bootstrap';
import { VinculoEspacoFormComponent } from './vinculo-espaco-form/vinculo-espaco-form.component';
import { ThrowStmt } from '@angular/compiler';
import { EspacoComponent } from '../espaco/espaco.component';
import { MapaService } from '../../../../../../_services/mapa.service';
import { consoleLog, globals } from '../../../../../../globals';
import { PlantaHelper } from '../../../../../../_services/planta-helper';
import { FileHolder } from 'angular2-image-upload';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { WorkspaceService } from '../../../../../../_services/workspace.service';

declare function montarTreeLocalizacoes(data: any);

@Component({
  selector: ".m-grid__item.m-grid__item--fluid.m-wrapper",
  styleUrls: ["./planta.component.scss"],
  templateUrl: "./planta.component.html",
  encapsulation: ViewEncapsulation.None,
})
export class PlantaComponent implements OnInit, AfterViewInit {

  public localizacoes:any[];

  public planta: fabric.Canvas;
  public _clipboard;

  public tabStateManager = {
    activeState: 1
  }

  telaInicial: boolean = true;
  esconderCriarPlanta: boolean = true;
  esconderPlanta: boolean = true;
  currentLocalizacaoId;
  currentObjectSelected;

  habilitarBotaoVinculoSala: boolean = false;
  habilitarBotaoVinculoMesa: boolean = false;
  habilitarBotaoVinculoEstacionamento: boolean = false;
  habilitarBotaoVinculoFretado: boolean = false;


  performOperation: Subject<any> = new Subject<any>();
  selections: any[] = [];
  rect: any;
  canvasJson;
  showHeader: boolean = true;

  groupGrid;
  groupPavimento;
  groupSalas;
  groupMesas;

  CENTER_LINE_COLOR = "blue";
  CENTER_LINE_WIDTH = .5;
  CENTER_LINE_DASH = false;
  ALIGNING_LINE_COLOR = "red";
  ALIGNING_LINE_WIDTH = .5;
  ALIGNING_LINE_DASH = true;
  COLORS = ["red", "blue", "#57648C", "#934A5F", "#C2B4D6", "#E5E5E5", "#A3C6C4"];

  pos = { x: 0, y: 0 }

  polygon: any;
  isImageDrawn: boolean = false;
  isPolygonDrawn: boolean = false;
  points = [];
  newPt: any;

  debugGlobal = globals.debug;

  imagemPlanta:any;
  carouselPlanta:any[] = [];

  plantaHelper:PlantaHelper;

  grayscaleAvg:boolean = false;
  grayscaleLum:boolean = false;
  grayscaleLev:boolean = false;


  // @ViewChild('tooltip', {static: false}) public tooltip: ElementRef;
  @ViewChild('plantaChild', {static: false}) public plantaChild: ElementRef;
  
  constructor(public webService:WebService,
    public modalService:ModalService,
    public modalNgb:NgbModal,
    public mapaService: MapaService,
    protected http: HttpClient,
    public workspaceService: WorkspaceService) {
    this.definirConfigsGeraisFabric()
  }

  ngOnInit() {
    this.iniciarLocalizacoesTree();
  }
  
  ngAfterViewInit() {
    // this.iniciarPlanta();
    consoleLog("tô no after view init")
    var img = document.getElementsByClassName("img-ul-upload");
    consoleLog(img)
  }

  changeTab(index) {
    if (this.esconderPlanta == false){
      this.tabStateManager.activeState = index;
    }
    this.planta.discardActiveObject();
    switch (index) {
      case 1:
        //aba localização
        this.desabilitarImagemPlanta();
        this.desabilitarPavimento();
        this.desabilitarSalas();
        this.desabilitarMesas();
        this.desabilitarEstacionamentos();
        this.desabilitarFretados();
        break;

      case 2:
        //aba Imagem
        this.habilitarImagemPlanta();
        this.desabilitarSalas();
        this.desabilitarMesas();
        this.desabilitarPavimento();
        this.desabilitarEstacionamentos();
        this.desabilitarFretados();
        break;

      case 3:
        //aba pavimento
        this.desabilitarImagemPlanta();
        this.habilitarPavimento();
        this.desabilitarSalas();
        this.desabilitarMesas();
        this.desabilitarEstacionamentos();
        this.desabilitarFretados();
        break;
  
    
      case 4:
        //aba salas
        this.desabilitarImagemPlanta();
        this.desabilitarPavimento();
        this.habilitarSalas();
        this.desabilitarMesas();
        this.desabilitarEstacionamentos();
        this.desabilitarFretados();
        break;

      case 5:
        //aba mesa
        this.desabilitarImagemPlanta();
        this.desabilitarPavimento();
        this.habilitarMesas();
        this.desabilitarSalas();
        this.desabilitarEstacionamentos();
        this.desabilitarFretados();
        break;
      
      case 6:
        //aba estacionamento
        this.desabilitarImagemPlanta();
        this.desabilitarPavimento();
        this.desabilitarSalas();
        this.desabilitarMesas();
        this.habilitarEstacionamentos();
        this.desabilitarFretados();
        break;

      case 7:
        //aba fretado
        this.desabilitarImagemPlanta();
        this.desabilitarPavimento();
        this.habilitarMesas();
        this.desabilitarSalas();
        this.desabilitarEstacionamentos();
        this.habilitarFretados();
        break;
      
      default:
        break;
    }
  }

  //#region ajuste grid e alinhamento

  gridToggle() {
  consoleLog(this.groupGrid)
  consoleLog(this.groupGrid['inside']);
    if (this.groupGrid['inside'] == true) {
      this.groupGrid['inside'] = false;
      // this.planta.remove(this.groupGrid);
      this.groupGrid['opacity'] = 0;
      // this.planta.off('object:moving', this.snapGrid);
      // this.planta.on('object:moving', (options)=> {
      // consoleLog(options);
      // consoleLog("o2i")
      //   options.target.set({
      //     left: options.target.left,
      //     top: options.target.top
      //   });
      // });
      this.planta.renderAll();
    } else {
      this.groupGrid['inside'] = true;
      this.groupGrid['opacity'] = 1;
      // this.planta.on('object:moving', this.snapGrid);
      // this.planta.on('object:moving', options=> {
      // consoleLog(options.target);
      // consoleLog("o3i")
      //   options.target.set({
      //     left: Math.round(options.target.left / 10) * 10,
      //     top: Math.round(options.target.top / 10) * 10
      //   });
      // });
      this.planta.renderAll();
      // this.planta.add(this.groupGrid);
    }
  }

  initCenteringGuidelines() {
    var canvasWidth = this.planta.getWidth(),
      canvasHeight = this.planta.getHeight(),
      canvasWidthCenter = canvasWidth / 2,
      canvasHeightCenter = canvasHeight / 2,
      canvasWidthCenterMap = {},
      canvasHeightCenterMap = {},
      centerLineMargin = 4,
      centerLineColor = this.CENTER_LINE_COLOR,
      centerLineWidth = this.CENTER_LINE_WIDTH,
      ctx = this.planta.getSelectionContext(),
      viewportTransform;

    for (
      var i = canvasWidthCenter - centerLineMargin,
      len = canvasWidthCenter + centerLineMargin;
      i <= len;
      i++
    ) {
      canvasWidthCenterMap[Math.round(i)] = true;
    }

    for (
      var i = canvasHeightCenter - centerLineMargin,
      len = canvasHeightCenter + centerLineMargin;
      i <= len;
      i++
    ) {
      canvasHeightCenterMap[Math.round(i)] = true;
    }


    function showVerticalCenterLine() {
      showCenterLine(
        canvasWidthCenter + 0.5,
        0,
        canvasWidthCenter + 0.5,
        canvasHeight
      );
    }



    function showHorizontalCenterLine() {
      showCenterLine(
        0,
        canvasHeightCenter + 0.5,
        canvasWidth,
        canvasHeightCenter + 0.5
      );
    }

    function showCenterLine(x1, y1, x2, y2) {
      ctx.save();
      ctx.strokeStyle = centerLineColor;
      this.CENTER_LINE_DASH && ctx.setLineDash([5]);
      ctx.lineWidth = centerLineWidth;
      ctx.beginPath();
      ctx.moveTo(x1 * viewportTransform[0], y1 * viewportTransform[3]);
      ctx.lineTo(x2 * viewportTransform[0], y2 * viewportTransform[3]);
      ctx.stroke();
      ctx.restore();
    }

    var afterRenderActions = [],
      isInVerticalCenter,
      isInHorizontalCenter;

    this.planta.on("mouse:down", () => {
      viewportTransform = this.planta.viewportTransform;
    });

    this.planta.on("object:moving", e => {
      var object = e.target,
        objectCenter = object.getCenterPoint(),
        transform = this.planta._currentTransform;

      if (!transform) return;

      (isInVerticalCenter = Math.round(objectCenter.x) in canvasWidthCenterMap),
        (isInHorizontalCenter =
          Math.round(objectCenter.y) in canvasHeightCenterMap);

      if (isInHorizontalCenter || isInVerticalCenter) {
        object.setPositionByOrigin(
          new fabric.Point(
            isInVerticalCenter ? canvasWidthCenter : objectCenter.x,
            isInHorizontalCenter ? canvasHeightCenter : objectCenter.y
          ),
          "center",
          "center"
        );
      }
    });

    this.planta.on("before:render", () => {
      this.planta.clearContext(this.planta.contextTop);
    });

    this.planta.on("after:render", () => {
      if (isInVerticalCenter) {
        showVerticalCenterLine();
      }
      if (isInHorizontalCenter) {
        showHorizontalCenterLine();
      }
    });

    this.planta.on("mouse:up", () => {
      // clear these values, to stop drawing guidelines once mouse is up
      isInVerticalCenter = isInHorizontalCenter = null;
      this.planta.renderAll();
    });
  }

  initAligningGuidelines() {
    var ctx = this.planta.getSelectionContext(),
      aligningLineOffset = 5,
      aligningLineMargin = 4,
      aligningLineWidth = this.ALIGNING_LINE_WIDTH,
      aligningLineColor = this.ALIGNING_LINE_COLOR,
      viewportTransform,
      zoom = 1;

    function drawVerticalLine(coords) {
      drawLine(
        coords.x + 0.5,
        coords.y1 > coords.y2 ? coords.y2 : coords.y1,
        coords.x + 0.5,
        coords.y2 > coords.y1 ? coords.y2 : coords.y1
      );
    }

    function drawHorizontalLine(coords) {
      drawLine(
        coords.x1 > coords.x2 ? coords.x2 : coords.x1,
        coords.y + 0.5,
        coords.x2 > coords.x1 ? coords.x2 : coords.x1,
        coords.y + 0.5
      );
    }

    function drawLine(x1, y1, x2, y2) {
      ctx.save();
      ctx.lineWidth = aligningLineWidth;
      this.ALIGNING_LINE_DASH && ctx.setLineDash([5]);
      ctx.strokeStyle = aligningLineColor;
      ctx.beginPath();
      ctx.moveTo(
        (x1 + viewportTransform[4]) * zoom,
        (y1 + viewportTransform[5]) * zoom
      );
      ctx.lineTo(
        (x2 + viewportTransform[4]) * zoom,
        (y2 + viewportTransform[5]) * zoom
      );
      ctx.stroke();
      ctx.restore();
    }

    function isInRange(value1, value2) {
      value1 = Math.round(value1);
      value2 = Math.round(value2);
      for (
        var i = value1 - aligningLineMargin, len = value1 + aligningLineMargin;
        i <= len;
        i++
      ) {
        if (i === value2) {
          return true;
        }
      }
      return false;
    }

    var verticalLines = [],
      horizontalLines = [];

    this.planta.on("mouse:down", () => {
      viewportTransform = this.planta.viewportTransform;
      zoom = this.planta.getZoom();
    });

    this.planta.on("object:moving", e => {
      var activeObject = e.target,
        canvasObjects = this.planta.getObjects(),
        activeObjectCenter = activeObject.getCenterPoint(),
        activeObjectLeft = activeObjectCenter.x,
        activeObjectTop = activeObjectCenter.y,
        activeObjectBoundingRect = activeObject.getBoundingRect(),
        activeObjectHeight =
          activeObjectBoundingRect.height / viewportTransform[3],
        activeObjectWidth = activeObjectBoundingRect.width / viewportTransform[0],
        horizontalInTheRange = false,
        verticalInTheRange = false,
        transform = this.planta._currentTransform;

      if (!transform) return;

      // It should be trivial to DRY this up by encapsulating (repeating) creation of x1, x2, y1, and y2 into functions,
      // but we're not doing it here for perf. reasons -- as this a function that's invoked on every mouse move

      for (var i = canvasObjects.length; i--;) {
        if (canvasObjects[i] === activeObject) continue;

        var objectCenter = canvasObjects[i].getCenterPoint(),
          objectLeft = objectCenter.x,
          objectTop = objectCenter.y,
          objectBoundingRect = canvasObjects[i].getBoundingRect(),
          objectHeight = objectBoundingRect.height / viewportTransform[3],
          objectWidth = objectBoundingRect.width / viewportTransform[0];

        // snap by the horizontal center line
        if (isInRange(objectLeft, activeObjectLeft)) {
          verticalInTheRange = true;
          verticalLines.push({
            x: objectLeft,
            y1:
              objectTop < activeObjectTop
                ? objectTop - objectHeight / 2 - aligningLineOffset
                : objectTop + objectHeight / 2 + aligningLineOffset,
            y2:
              activeObjectTop > objectTop
                ? activeObjectTop + activeObjectHeight / 2 + aligningLineOffset
                : activeObjectTop - activeObjectHeight / 2 - aligningLineOffset
          });
          activeObject.setPositionByOrigin(
            new fabric.Point(objectLeft, activeObjectTop),
            "center",
            "center"
          );
        }

        // snap by the left edge
        if (
          isInRange(
            objectLeft - objectWidth / 2,
            activeObjectLeft - activeObjectWidth / 2
          )
        ) {
          verticalInTheRange = true;
          verticalLines.push({
            x: objectLeft - objectWidth / 2,
            y1:
              objectTop < activeObjectTop
                ? objectTop - objectHeight / 2 - aligningLineOffset
                : objectTop + objectHeight / 2 + aligningLineOffset,
            y2:
              activeObjectTop > objectTop
                ? activeObjectTop + activeObjectHeight / 2 + aligningLineOffset
                : activeObjectTop - activeObjectHeight / 2 - aligningLineOffset
          });
          activeObject.setPositionByOrigin(
            new fabric.Point(
              objectLeft - objectWidth / 2 + activeObjectWidth / 2,
              activeObjectTop
            ),
            "center",
            "center"
          );
        }

        // snap by the right edge
        if (
          isInRange(
            objectLeft + objectWidth / 2,
            activeObjectLeft + activeObjectWidth / 2
          )
        ) {
          verticalInTheRange = true;
          verticalLines.push({
            x: objectLeft + objectWidth / 2,
            y1:
              objectTop < activeObjectTop
                ? objectTop - objectHeight / 2 - aligningLineOffset
                : objectTop + objectHeight / 2 + aligningLineOffset,
            y2:
              activeObjectTop > objectTop
                ? activeObjectTop + activeObjectHeight / 2 + aligningLineOffset
                : activeObjectTop - activeObjectHeight / 2 - aligningLineOffset
          });
          activeObject.setPositionByOrigin(
            new fabric.Point(
              objectLeft + objectWidth / 2 - activeObjectWidth / 2,
              activeObjectTop
            ),
            "center",
            "center"
          );
        }

        // snap by the vertical center line
        if (isInRange(objectTop, activeObjectTop)) {
          horizontalInTheRange = true;
          horizontalLines.push({
            y: objectTop,
            x1:
              objectLeft < activeObjectLeft
                ? objectLeft - objectWidth / 2 - aligningLineOffset
                : objectLeft + objectWidth / 2 + aligningLineOffset,
            x2:
              activeObjectLeft > objectLeft
                ? activeObjectLeft + activeObjectWidth / 2 + aligningLineOffset
                : activeObjectLeft - activeObjectWidth / 2 - aligningLineOffset
          });
          activeObject.setPositionByOrigin(
            new fabric.Point(activeObjectLeft, objectTop),
            "center",
            "center"
          );
        }

        // snap by the top edge
        if (
          isInRange(
            objectTop - objectHeight / 2,
            activeObjectTop - activeObjectHeight / 2
          )
        ) {
          horizontalInTheRange = true;
          horizontalLines.push({
            y: objectTop - objectHeight / 2,
            x1:
              objectLeft < activeObjectLeft
                ? objectLeft - objectWidth / 2 - aligningLineOffset
                : objectLeft + objectWidth / 2 + aligningLineOffset,
            x2:
              activeObjectLeft > objectLeft
                ? activeObjectLeft + activeObjectWidth / 2 + aligningLineOffset
                : activeObjectLeft - activeObjectWidth / 2 - aligningLineOffset
          });
          activeObject.setPositionByOrigin(
            new fabric.Point(
              activeObjectLeft,
              objectTop - objectHeight / 2 + activeObjectHeight / 2
            ),
            "center",
            "center"
          );
        }

        // snap by the bottom edge
        if (
          isInRange(
            objectTop + objectHeight / 2,
            activeObjectTop + activeObjectHeight / 2
          )
        ) {
          horizontalInTheRange = true;
          horizontalLines.push({
            y: objectTop + objectHeight / 2,
            x1:
              objectLeft < activeObjectLeft
                ? objectLeft - objectWidth / 2 - aligningLineOffset
                : objectLeft + objectWidth / 2 + aligningLineOffset,
            x2:
              activeObjectLeft > objectLeft
                ? activeObjectLeft + activeObjectWidth / 2 + aligningLineOffset
                : activeObjectLeft - activeObjectWidth / 2 - aligningLineOffset
          });
          activeObject.setPositionByOrigin(
            new fabric.Point(
              activeObjectLeft,
              objectTop + objectHeight / 2 - activeObjectHeight / 2
            ),
            "center",
            "center"
          );
        }
      }

      if (!horizontalInTheRange) {
        horizontalLines.length = 0;
      }

      if (!verticalInTheRange) {
        verticalLines.length = 0;
      }
    });

    this.planta.on("before:render", () => {
      if (this.planta) this.planta.clearContext(this.planta.contextTop);
    });

    this.planta.on("after:render", () => {
      for (var i = verticalLines.length; i--;) {
        drawVerticalLine(verticalLines[i]);
      }
      for (var i = horizontalLines.length; i--;) {
        drawHorizontalLine(horizontalLines[i]);
      }

      verticalLines.length = horizontalLines.length = 0;
    });

    this.planta.on("mouse:up", () => {
      verticalLines.length = horizontalLines.length = 0;
      this.planta.renderAll();
    });
  }

  createAlignment() {
    /**
     * Should objects be aligned by a bounding box?
     * [Bug] Scaled objects sometimes can not be aligned by edges
     *
     */

    // ------------------------------------ //

    function getRandomInt(max) {
      return Math.floor(Math.random() * Math.floor(max));
    }

    // this.planta = new fabric.Canvas("planta");

    this.initCenteringGuidelines();
    this.initAligningGuidelines();

    let rects = [];

    for (let i = 0; i < 10; i++) {
      rects.push(new fabric.Rect({
        left: getRandomInt(550),
        top: getRandomInt(550),
        fill: this.COLORS[getRandomInt(this.COLORS.length)],
        width: 50,
        height: 50,
        objectCaching: false,
        strokeWidth: 0
      }))
    }

    this.planta.add(...rects);


  }
  
  //#endregion

  //#region barra de tarefas

  save() {
    if (this.esconderPlanta == true){return};
    Helpers.setLoading(true);
    let body = {planta: this.toJson()}
    this.webService.put(`localizacoes/${this.currentLocalizacaoId}`, body)
      .subscribe((response)=>{
          this.modalService.tratarSucesso(response)
          Helpers.setLoading(false);
        },
      (error) => {
        Helpers.setLoading(false);
        this.modalService.tratarError(error);
      }
      )
  }

  reset(){
    // this.planta.clear();
    // this.planta = undefined;
  }

  cut() {
    this.copy();
    this.delete();
  }

  duplicate() {
    this.copy();
    this.paste();
  }

  copy() {
    // clone what are you copying since you
    // may want copy and paste on different moment.
    // and you do not want the changes happened
    // later to reflect on the copy.
    this.planta.getActiveObject().clone(cloned => {
      this._clipboard = cloned;
    }, ['id', 'tipo']);
  }

  paste() {
    // clone again, so you can do multiple copies.
  // consoleLog("olha o clonee")
  // consoleLog(this._clipboard);
    this._clipboard.clone(clonedObj => {
      this.planta.discardActiveObject();
      clonedObj.set({
        left: clonedObj.left + 10,
        top: clonedObj.top + 10,
        evented: true,
      });
      if (clonedObj.type === 'activeSelection') {
        // active selection needs a reference to the canvas.
        clonedObj.canvas = this.planta;
        clonedObj.forEachObject(obj => {
          this.planta.add(obj);
        });
        // this should solve the unselectability
        clonedObj.setCoords();
      } else {
        this.planta.add(clonedObj);
      }
      this._clipboard.top += 10;
      this._clipboard.left += 10;
      this.planta.setActiveObject(clonedObj);
      this.planta.requestRenderAll();
    }, ['id', 'tipo']);
  }

  delete() {
    // if (!this.selections.length) {
    // return;
    // }
    // this.planta.delete();
    // this.performOperation.next('DELETE');
    // this.planta.dispose(
    // this.rect.dispose();
  // consoleLog(this.planta.selections);
  // consoleLog(this.planta)
  // consoleLog(this.planta.getActiveObjects());
    // this.planta.remove(this.planta.getActiveObject());
    // this.planta.getActiveObject().remove();
    var activeObject = this.planta.getActiveObjects();
    this.planta.discardActiveObject();
    this.planta.remove(...activeObject);

    this.habilitarBotaoVinculoMesa = false;
    this.habilitarBotaoVinculoSala = false;
    this.habilitarBotaoVinculoEstacionamento = false;
    this.habilitarBotaoVinculoFretado = false;
    //     var selected = this.planta.getActiveObjects(),
    //     selGroup = new fabric.ActiveSelection(selected, {
    //         canvas: this.planta
    //     });
    // if (selGroup) {
    //     if (confirm('Deleted selected image(s)?')) {
    //         selGroup.forEachObject(function (obj) {
    //           this.planta.remove(obj);
    //         });     }
    //       } else {
    //           return false;
    //       }
    //       // Use discardActiveObject to remove the selection border
    //       this.planta.discardActiveObject().renderAll();



    // var activeObject = this.planta.getActiveObject();
    // if (activeObject.type == "activeSelection"){
    //   var selGroup = new fabric.ActiveSelection(activeObject, {
    //       canvas: this.planta
    //   });
    //   activeObject.forEachObject(function (obj) {
    //     // this.planta.remove(obj);
    //     selGroup.remove(obj);
    //     // consoleLog(obj);
    //   })
    // }else{
    //   this.planta.remove(activeObject);
    // }

    // consoleLog(activeObject)
    // var activeGroup = this.planta.getActiveGroup();
    // consoleLog(activeGroup)
    // if (activeObject) {
    //   // if (confirm("Sure you want to delete that?")) {
    //   // }
    // } else if (activeGroup) {
    //   // if (confirm("Sure you want to delete that?")) {
    //     var objectsInGroup = activeGroup.getObjects();
    //     this.planta.discardActiveGroup();
    //     objectsInGroup.forEach(function (object) {
    //       this.planta.remove(object);
    //     });
    //   // }
    // }

  }

  turnLeft() {
    this.rotateObject(-45);
  }

  turnRight() {
    this.rotateObject(+45);
  }

  rotateObject(giro) {
    // consoleLog(this.planta.getActiveGroup());
    // consoleLog(this.planta.getActiveObject());
    var activeObject = this.planta.getActiveObject()
  // consoleLog(activeObject)
    activeObject.rotate(activeObject.angle + giro)

    if (activeObject.tipo == 'sala'){
      //   // consoleLog("tamo aqui")
      //   // consoleLog(options.target);
      if (activeObject.item(1) != undefined){
        var texto = activeObject.item(1),
          sala = activeObject,
          newAngle = 45;
          // texto.set({angle: newAngle, snapAngle: newAngle, fill: "#00f"});
          // texto.setCoords();
          // sala.setCoords();
          texto.rotate(texto.angle - giro)
          // this.planta.renderAll();
      }
    }
    // consoleLog(this.planta.getActiveObjects());
    // this.planta.getActiveObjects()
    //   .forEach(obj=>{
    //     obj.rotate(obj.angle + giro);
    //   })
    this.planta.renderAll();
  }

  undo() {
    this.planta.undo();
  }

  redo() {
    this.planta.redo();
  }

  group() {
    // var objetosSelecionados:any[]= [...this.planta.getActiveObjects()];
    // var objetoSelecao = this.planta.getActiveObject();
    // if(objetoSelecao != undefined && objetoSelecao.type!="group"){
    //   var newGroup = new fabric.Group();
    if (!this.planta.getActiveObject()) {
      return;
    }
    if (this.planta.getActiveObject().type !== 'activeSelection') {
      return;
    }
    this.planta.getActiveObject().toGroup();
    this.planta.requestRenderAll();

    // if (this.planta.getActiveObject().type=="activeSelection"){
    //   this.planta.getActiveObject().toGroup();

    //   this.planta.requestRenderAll();
    // }
    // objetosSelecionados.forEach( obj => {
    //   newGroup.addWithUpdate(obj);
    //   this.planta.remove(obj);
    // });

    // newGroup.left = objetoSelecao.left;
    // newGroup.top = objetoSelecao.top;
    // this.planta.add(newGroup);
    // this.planta.discardActiveObject();
    // this.planta.renderAll();
    // this.planta.setActiveObject(newGroup);
    // this.pl
    // }
  }

  unGroup() {

    if (!this.planta.getActiveObject()) {
      return;
    }
    if (this.planta.getActiveObject().type !== 'group') {
      return;
    }
    this.planta.getActiveObject().toActiveSelection();
    this.planta.requestRenderAll();
    // var activeObject = this.planta.getActiveObject();
    // if(activeObject != undefined && activeObject.type=="group"){
    //     var items = activeObject._objects;
    //     activeObject._restoreObjectsState();
    //     this.planta.remove(activeObject);
    //     for(var i = 0; i < items.length; i++) {
    //       this.planta.add(items[i]);
    //       this.planta.item(this.planta.size()-1).hasControls = true;
    //     }

    //     this.planta.renderAll();
    // }
  }

  selectAll() {
    this.planta.discardActiveObject();
    var objects = this.planta.getObjects();
    //desconsiderando o primeiro item q é o grid;
    objects.shift();
    var sel = new fabric.ActiveSelection(objects, {
      canvas: this.planta,
    });
    this.planta.setActiveObject(sel);
    this.planta.requestRenderAll();
  }

  discardSelect() {
    this.planta.discardActiveObject();
    this.planta.requestRenderAll();
    this.positionHud()
  }


  //#endregion

  //#region movimentação e janela

  animateHoverMovimentation(e, dir) {
    if (e.target) {
    // consoleLog(e.target);
      // fabric.util.animate({
      //   startValue: e.target.get('angle'),
      //   endValue: e.target.get('angle') + (dir ? 10 : -10),
      //   duration: 100,
      //   onChange: value => {
      //     e.target.angle = value;
      //     this.planta.renderAll();
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
      //     this.planta.renderAll();
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
          this.planta.renderAll();
        },
        onComplete: () => {
          e.target.setCoords();
        }
      });
    }
  }

  hoverMovimentation() {
    this.planta.hoverCursor = 'pointer';
    this.planta.on('mouse:down', e => { this.animateHoverMovimentation(e, 1); });
    this.planta.on('mouse:up', e => { this.animateHoverMovimentation(e, 0); });
    // this.__canvases.push(canvas);
  }

  hoverEffect() {
    this.planta.on('mouse:over', e => {
      consoleLog("hover")
      consoleLog(e)
      this.planta.hoverCursor = 'pointer';
      let tipo = e.target != undefined && e.target.tipo != undefined && e.target.id > 0 ? e.target.tipo : '';
      if (tipo == 'mesa'){
        consoleLog("tô aqui na emsa pra constrir o tooltip")
        this.plantaHelper.construirTooltip(e.target)
        this.planta.renderAll();
      }
    });

    this.planta.on('mouse:out', e => {
      // e.target.set('fill', e.target.bkp_colour);
      let tipo = e.target != undefined && e.target.tipo != undefined && e.target.id > 0 ? e.target.tipo : '';
      if (tipo == 'mesa'){
        this.plantaHelper.destruirTooltip();
        this.planta.renderAll();  
      }
    });
  }

  toJson() {
    this.planta.renderAll();
    this.canvasJson = this.planta.toJSON(['id', 'tipo', 'nome']);
  // consoleLog(this.canvasJson);

  // consoleLog(this.planta.toSVG())
    // this.canvasJson.objects.shift();
    // navigator.clipboard.writeText(JSON.stringify(this.canvasJson.objects))
    navigator.clipboard.writeText(JSON.stringify(this.canvasJson))
    // return {objects: this.canvasJson.objects};
    return this.canvasJson;
  }

  fromJson(json){
    // consoleLog(json)
    // consoleLog(json.objects)
    // consoleLog(json.objects[0])
    // // json.objects.forEach(obj => {
    //   // this.planta.add(obj);
    // // });    
    // let temp = new fabric.rect(json.objects[0])
    // // this.planta.add(json.objects[0]);
    // this.planta.add(temp)
    // this.planta.renderAll();
    // this.planta.add(json.objects);
    // this.planta.renderAll();
    this.planta.loadFromJSON(json, ()=>{
      this.planta.renderAll();
    })
  }

  zoomIn() {
    var zoom = this.planta.getZoom();
    if (zoom < 2) {
      this.planta.setZoom(zoom + .1)
    }
  }

  zoomOut() {
    var zoom = this.planta.getZoom();
    if (zoom > .6) {
      this.planta.setZoom(zoom - .1)
    }
  }

  pan() {
    this.planta.on('mouse:down', (opt) => {
      var evt = opt.e;
      // if (evt.alt_key==true)
      // if (this.planta.getActiveObjects().length == 0) {
      if (opt.button === 2) {
        this.planta.isDragging = true;
        this.planta.selection = false;
        this.planta.lastPosX = evt.clientX;
        this.planta.lastPosY = evt.clientY;

        // var plantaElement = document.getElementById('planta');
        // plantaElement.classList.add('ui-draggable-handle');
        // this.planta.cursor = 'grab'

        // var mybody = document.find('body');
        // mybody.addClass('waiting');   // set cursor to hourglass
        // setTimeout(function() {
        //     doSlowStuff();
        //     $scope.$apply();
        //     mybody.removeClass('waiting');  // set cursor to normal
        // }, 0);
      }
    });
    this.planta.on('mouse:move', opt => {
      if (this.planta.isDragging) {
        var e = opt.e;
        var vpt = this.planta.viewportTransform;
        vpt[4] += e.clientX - this.planta.lastPosX;
        vpt[5] += e.clientY - this.planta.lastPosY;
        this.planta.requestRenderAll();
        this.planta.lastPosX = e.clientX;
        this.planta.lastPosY = e.clientY;
      }
    });
    this.planta.on('mouse:up', opt => {
      // on mouse up we want to recalculate new interaction
      // for all objects, so we call setViewportTransform
      this.planta.setViewportTransform(this.planta.viewportTransform);
      this.planta.isDragging = false;
      this.planta.selection = true;
      this.planta.renderAll();
    });
  }

  moveViewPort(deltax, deltay) {
    this.pos.x += deltax * 40;
    this.pos.y += deltay * 40;
    this.planta.absolutePan({
      x: this.pos.x,
      y: this.pos.y
    });
  }

  reCenter() {
    this.pos.x = 0;
    this.pos.y = 0;
    this.planta.setZoom(1);
    this.planta.absolutePan({
      x: 0,
      y: 0
    });
  }

  aSideToggle() {
    Helpers.setLoading(true);
    var minimizeButton = document.getElementById('m_aside_left_minimize_toggle');
    if (minimizeButton.classList.contains('m-brand__toggler--active')) {
      this.showHeader = true;
      minimizeButton.click();
      setTimeout(() => {
        this.planta.setWidth($('#divwidth').width());
        // this.positionHud();
        Helpers.setLoading(false);
      }, 300);
    } else {
      this.showHeader = false;
      minimizeButton.click()
      setTimeout(() => {
        this.planta.setWidth($('#divwidth').width());
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

  //#region poligon
  
  editPolygonClick(){
    this.planta.on('mouse:up', options => {
      if (options.button === 1) {
        // this.getClickCoords(options.e);
      }
    });

    this.planta.on('mouse:down', event => {
      if (event.button === 3) {
        if (this.points.length < 4) {
          this.isPolygonDrawn = false;
        } else {
          // this.makePolygon();
          this.isPolygonDrawn = true;
        }
      }
    });
  }

  makePolygon(){

  }

  //POLYGON EDIT
  editPolygon() {
    function polygonPositionHandler(dim, finalMatrix, fabricObject) {
      let x =
          fabricObject.points[this.pointIndex].x - fabricObject.pathOffset.x,
        y = fabricObject.points[this.pointIndex].y - fabricObject.pathOffset.y;
      return fabric.util.transformPoint(
        new fabric.Point(x, y),
        fabric.util.multiplyTransformMatrices(
          fabricObject.canvas.viewportTransform,
          fabricObject.calcTransformMatrix()
        )
      );
    }
    function anchorWrapper(anchorIndex, fn) {
      return function(eventData, transform, x, y) {
        var fabricObject = transform.target,
          absolutePoint = fabric.util.transformPoint(
            new fabric.Point(
              fabricObject.points[anchorIndex].x - fabricObject.pathOffset.x,
              fabricObject.points[anchorIndex].y - fabricObject.pathOffset.y
            ),
            fabricObject.calcTransformMatrix()
          ),
          actionPerformed = fn(eventData, transform, x, y),
          newDim = fabricObject._setPositionDimensions({}),
          polygonBaseSize = fabricObject._getNonTransformedDimensions(),
          newX =
            (fabricObject.points[anchorIndex].x - fabricObject.pathOffset.x) /
            polygonBaseSize.x,
          newY =
            (fabricObject.points[anchorIndex].y - fabricObject.pathOffset.y) /
            polygonBaseSize.y;
        fabricObject.setPositionByOrigin(absolutePoint, newX + 0.5, newY + 0.5);
        return actionPerformed;
      };
    }
    function actionHandler(eventData, transform, x, y) {
      var polygon = transform.target,
        currentControl = polygon.controls[polygon.__corner],
        mouseLocalPosition = polygon.toLocalPoint(
          new fabric.Point(x, y),
          'center',
          'center'
        ),
        polygonBaseSize = polygon._getNonTransformedDimensions(),
        size = polygon._getTransformedDimensions(0, 0),
        finalPointPosition = {
          x:
            (mouseLocalPosition.x * polygonBaseSize.x) / size.x +
            polygon.pathOffset.x,
          y:
            (mouseLocalPosition.y * polygonBaseSize.y) / size.y +
            polygon.pathOffset.y
        };
      polygon.points[currentControl.pointIndex] = finalPointPosition;
      return true;
    }
  // consoleLog("tô na meiuca");
  // consoleLog(this.planta.getObjects());
    let poly = this.planta.getObjects()[1];
    this.planta.setActiveObject(poly);
    poly.edit = !poly.edit;
    if (poly.edit) {
      let lastControl = poly.points.length - 1;
      poly.cornerStyle = 'circle';
      poly.cornerColor = 'rgba(0,0,255,0.5)';
      poly.controls = poly.points.reduce(function(acc, point, index) {
        acc['p' + index] = new fabric['Control']({
          pointIndex: index,
          positionHandler: polygonPositionHandler,
          actionHandler: anchorWrapper(
            index > 0 ? index - 1 : lastControl,
            actionHandler
          ),
          actionName: 'modifyPolygon'
        });
        return acc;
      }, {});
    }
  }

  //#endregion

  //#region api

  iniciarLocalizacoesTree(){
    this.mapaService.carregarLocalizacoes(this.localizacoes);

    $('#kt_tree_localizacoes').on("select_node.jstree",
      (e, data) => {
        this.currentLocalizacaoId = data.node.original.id;
      // consoleLog(e)
      // consoleLog(data);

        if (data.node.original.children_flag == false){
          this.telaInicial = false;
          if (data.node.original.planta_flag == true){
            this.esconderPlanta = false;
            this.esconderCriarPlanta = true;
            this.abrirPlanta(data.node.original.planta);
            // this.carouselPlanta = undefined;
            // this.carouselPlanta = [];
            this.carouselPlanta = data.node.original.carousel_planta;
          }else{
            this.esconderCriarPlanta = false;
            this.esconderPlanta = true;
          }
        }else{
          this.telaInicial = true;
          this.esconderPlanta = true;
          this.esconderCriarPlanta = true;
        }
      }
    );
  }

  iniciarPlantaCanvas(){
    if (this.planta){
      this.planta.clear();
    }else {

      this.planta = new fabric.Canvas('planta',
      {
        fireMiddleClick: true, fireRightClick: true,
        stopContextMenu: true, selection: false,
        width: "auto", height: "400",
        backgroundColor: '#ebedf0'//'#f5f7fa'//'#F3F6F9' '#f2f3f8' 'f7f7fa'
      });//fcfcfc
    }
    // this.planta.rotationCursor = "not-"
    this.groupGrid = this.mapaService.createGrid(this.planta);
    // this.planta.on('object:moving', this.snapGrid);
    this.manterFonte();
  }

  snapGrid = options => {
    options.target.set({
      left: Math.round(options.target.left / 10) * 10,
      top: Math.round(options.target.top / 10) * 10
    });
  }

  ajustarPlantaCanvas(){
    // this.positionHud();
    // this.zoom();
    this.pan();
    // this.editPolygon();
    this.planta.setWidth($('#divwidth').width());
    this.mapearVinculos();
    // this.createAlignment();
    // this.hoverMovimentation();
    this.hoverEffect();
  }

  mapearVinculos(){
    this.planta.on('mouse:up', e=>{
      this.currentObjectSelected = e.target;
      let tipo = (e.target === null || e.target.tipo === null || e.target.tipo === undefined) ? "" : e.target.tipo;
      if(tipo == "mesa"){
      // consoleLog(e);
        this.habilitarBotaoVinculoMesa = true;
      }else{
        this.habilitarBotaoVinculoMesa = false;
      }

      if(tipo == "sala"){
      // consoleLog(e);
        this.habilitarBotaoVinculoSala = true;
      }else{
        this.habilitarBotaoVinculoSala = false;
      }

      if(tipo == "estacionamento"){
      // consoleLog(e);
        this.habilitarBotaoVinculoEstacionamento = true;
      }else{
        this.habilitarBotaoVinculoEstacionamento = false;
      }

      if(tipo == "fretado"){
      // consoleLog(e);
        this.habilitarBotaoVinculoFretado = true;
      }else{
        this.habilitarBotaoVinculoFretado = false;
      }
    })

    // this.planta.on('selection:created', options=>{
    // // consoleLog(options);
    // })
  }

  adicionarPavimento(){
    let rects:any[] = []

    var rect1 = new fabric.Rect({
      top: 60,
      left: 60,
      width: 400,
      height: 200,
      rx: 3,
      ry: 3,
      fill: 'rgba(255,255,255,1)',
      // stroke: '#bbb',//'#6d7ae1'
      strokeWidth: 2,
      shadow: new fabric.Shadow({color: this.mapaService.stateColors.shadow, blur: 4, offsetX: 3, offsetY: 3}),
    });

    // var rect2 = new fabric.Rect({
    //   top: 75,
    //   left: 325,
    //   width: 200,
    //   height: 275,
    //   fill: 'rgba(255,255,255,1)',
    //   // stroke: '#bbb',//'#6d7ae1'
    //   strokeWidth: 2,
    // });

    rects.push(rect1);
    // rects.push(rect2);


    this.groupPavimento = new fabric.Group(rects, {
      id: 'groupPavimento', tipo: 'pavimento',
      hoverCursor: 'pointer',
      moveCursor: 'grabbing'
     })
    //  , inside: true
    //  selectable: false, hasControls: false, hoverCursor: 'default'
    this.planta.add(this.groupPavimento)
    this.planta.setActiveObject(this.groupPavimento);
    this.planta.renderAll();   

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
    // this.planta.add(this.polygon);
// 
    // this.editPolygon();
    // let group = new fabric.Group();
    // group.addWithUpdate(rect1);
    // // group.addWithUpdate(rect2)
    // this.planta.add(rect1);
    // this.planta.add(rect2);

    
    // this.planta.add
    // this.planta.add(group);
    
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
    // this.planta.add(this.rect);
    // this.planta.add(circle);
    // this.planta.add(ovo);
  }

  adicionarImagemPlanta(url){
    fabric.util.loadImage(url, (myImg) => {
      var fab_image = new fabric.Image(myImg);
      this.imagemPlanta = fab_image.set({ left: 0, top: 0, tipo:"imagemPlanta"});
      this.planta.add(this.imagemPlanta); 
      this.planta.setActiveObject(this.imagemPlanta);
    }, null, {crossOrigin: 'anonymous'});
  }

  aplicarGrayscaleAvg(event){
    consoleLog(event.target.checked)
    this.applyFilter(0, event.target.checked && new fabric.Image.filters.Grayscale());
    this.applyFilterValue(0, 'mode', 'average');
    this.grayscaleLum = false;
    this.grayscaleLev = false;
  }

  aplicarGrayscaleLum(event){
    consoleLog(event.target.checked)
    this.applyFilter(0, event.target.checked && new fabric.Image.filters.Grayscale());
    this.applyFilterValue(0, 'mode', 'luminosity');
    this.grayscaleAvg = false;
    this.grayscaleLev = false;
  }

  aplicarGrayscaleLev(event){
    consoleLog(event.target.checked)
    this.applyFilter(0, event.target.checked && new fabric.Image.filters.Grayscale());
    this.applyFilterValue(0, 'mode', 'lightness');
    this.grayscaleAvg = false;
    this.grayscaleLum = false;
  }

  aplicarBrilho(value){
    consoleLog(parseFloat(value)/100);
    this.applyFilter(5, new fabric.Image.filters.Brightness({brightness: (parseFloat(value)/100)}));
  }

  aplicarOfuscar(value){
    this.applyFilter(11, new fabric.Image.filters.Blur({blur: (parseFloat(value)/100)}));
  }

  aplicarContraste(value){
    consoleLog(parseFloat(value)/100);
    this.applyFilter(6, new fabric.Image.filters.Contrast({contrast: parseFloat(value)/100}));
  }
  
  applyFilter(index, filter) {
    this.imagemPlanta.filters[index] = filter;
    this.imagemPlanta.applyFilters();
    this.planta.renderAll();
  }

  applyFilterValue(index, prop, value) {
    if (this.imagemPlanta.filters[index]) {
      this.imagemPlanta.filters[index][prop] = value;
      this.imagemPlanta.applyFilters();
      this.planta.renderAll();
    }
  }

  adicionarDivisoria(){
    let rects:any[] = []

    var rect1 = new fabric.Rect({
      top: 90,
      left: 90,
      width: 100,
      height: 2,
      rx: 1,
      ry: 1,
      fill: '#818495'
    });

    rects.push(rect1);

    this.groupPavimento = new fabric.Group(rects, {
      id: 'groupPavimento', tipo: 'pavimento',
      hoverCursor: 'pointer',
      moveCursor: 'grabbing'
     })

    this.groupPavimento.setControlsVisibility({
      mt: false, 
      mb: false, 
      ml: true, 
      mr: true, 
      bl: false,
      br: false, 
      tl: false, 
      tr: false,
      mtr: true, 
    });
    this.planta.add(this.groupPavimento)
    this.planta.setActiveObject(this.groupPavimento);
  }

  adicionarLegenda(){
    let texts:any[] = []

    var text = new fabric.IText("Texto de exemplo", {
      top: 60,
      left: 60,
      originX: "center",
      originY: "middle",
      textAlign: "center",
      fontFamily: this.mapaService.font.family,//"Segoe UI",
      fontWeight: 500,
      shadow: new fabric.Shadow({color: this.mapaService.stateColors.white, blur: 2}),
      fontSize: this.mapaService.font.size,
      fill: this.mapaService.stateColors.textDark75,
      tipo: 'pavimento',
    });

    texts.push(text);

    // this.groupPavimento = new fabric.Group(texts, {
    //   id: 'groupPavimento', tipo: 'pavimento',
    //   hoverCursor: 'pointer',
    //   moveCursor: 'grabbing'
    //  })
    // this.planta.add(this.groupPavimento)
    // this.planta.setActiveObject(this.groupPavimento);
    this.planta.add(text);
    this.planta.setActiveObject(text);
  }

  adicionarIcone(){
    fabric.loadSVGFromURL('./assets/app/media/svg/icons/Devices/Router1.svg', (objects, options) => {
      var svgIcon = fabric.util.groupSVGElements(objects, options);
      
      if (svgIcon && svgIcon._objects) {
        for (var i = 0; i < svgIcon._objects.length; i++) {
          consoleLog(svgIcon._objects[i]);
          if (svgIcon._objects[i].fill == "#000000"){
            svgIcon._objects[i].set({
              fill: this.plantaHelper.stateColors.primary
            });
          }
        }
      }
      svgIcon.set({left: 200, top: 160});

      consoleLog(svgIcon);
      this.planta.add(svgIcon);
      this.planta.setActiveObject(svgIcon);
    });
  }

  adicionarMesaBola(tipoVinculo){

    var circle = new fabric.Circle({
      radius: 20,
      top: -10,
      left: -20,
      fill: this.mapaService.stateColors.primary,//'#6d7ae1',//,'#5867dd',//'#6d7ae1'
      // stroke: '#5867dd',
      // strokeWidth: 2,
      // strokeUniform: true,
      shadow: new fabric.Shadow({color: this.mapaService.stateColors.shadowSecond, blur: 4, offsetX: 0, offsetY: 0}),
    });
    var itens = []
    var texto = this.criarTextoEspaco('')
    // texto.set({top:0, left: 0});
    itens.push(circle);
    itens.push(texto);

    var mesa = new fabric.Group(itens, {
      id: '',
      tipo: tipoVinculo,
      nome: '',
      top: 80,
      left: 40,
      // width: 80,
      // height: 40,
      hoverCursor: 'pointer',
      moveCursor: 'grabbing'
    })

    mesa.setControlsVisibility({
      mt: false, 
      mb: false, 
      ml: false, 
      mr: false, 
      bl: true,
      br: true, 
      tl: true, 
      tr: true,
      mtr: false, 
    });

    this.planta.add(mesa);
    this.planta.setActiveObject(mesa);

    if(tipoVinculo == "mesa"){
      this.habilitarBotaoVinculoMesa = true;
      this.habilitarBotaoVinculoEstacionamento = false;
      this.habilitarBotaoVinculoFretado = false;
    }else if(tipoVinculo == "estacionamento"){
      this.habilitarBotaoVinculoMesa = false;
      this.habilitarBotaoVinculoEstacionamento = true;
      this.habilitarBotaoVinculoFretado = false;
    }else if(tipoVinculo == "fretado"){
      this.habilitarBotaoVinculoMesa = false;
      this.habilitarBotaoVinculoEstacionamento = false;
      this.habilitarBotaoVinculoFretado = true;
    }

    this.currentObjectSelected = mesa;
    //  inside: true, selectable: false, hasControls: false,
    //   hasBorders: false, hoverCursor: 'default', opacity: 1, excludeFromExport: true
  }

  adicionarMesaEstacao(){
    var rect1 = new fabric.Rect({
      // top: 80,
      // left: 80,
      originX: 'center',
      originY: 'center',
      width: 80,
      height: 30,
      rx: 3,
      ry: 3,
      fill: this.mapaService.stateColors.primary,//'#6d7ae1',//,'#5867dd',//'#6d7ae1'
      // stroke: '#5867dd',
      // strokeWidth: 2,
      // strokeUniform: true,
      shadow: new fabric.Shadow({color: this.mapaService.stateColors.shadowSecond, blur: 4, offsetX: 0, offsetY: 0}),
    });
    var circle = new fabric.Circle({
      radius: 20,
      top: -10,
      left: -20,
      fill: this.mapaService.stateColors.primary,//'#6d7ae1',//,'#5867dd',//'#6d7ae1'
      // stroke: '#5867dd',
      // strokeWidth: 2,
      // strokeUniform: true,
      shadow: new fabric.Shadow({color: this.mapaService.stateColors.shadowSecond, blur: 4, offsetX: 0, offsetY: 0}),
    });
    var itens = []
    var texto = this.criarTextoEspaco('')
    // texto.set({top:0, left: 0});
    itens.push(circle);
    itens.push(rect1);
    itens.push(texto);

    var mesa = new fabric.Group(itens, {
      id: '',
      tipo: 'mesa',
      nome: '',
      top: 80,
      left: 40,
      // width: 80,
      // height: 40,
      hoverCursor: 'pointer',
      moveCursor: 'grabbing'
    })

    this.planta.add(mesa);
    this.planta.setActiveObject(mesa);
    this.habilitarBotaoVinculoMesa = true;
    this.currentObjectSelected = mesa;
    //  inside: true, selectable: false, hasControls: false,
    //   hasBorders: false, hoverCursor: 'default', opacity: 1, excludeFromExport: true
  }

  adicionarSala(){
    let itens=[];
    var rect = new fabric.Rect({
        originX: 'center',
        originY: 'center',
        width: 160,
        height: 160,
        rx: 3,
        ry: 3,
        fill: this.mapaService.stateColors.primaryTransparent,//'#6d7ae1',//,'#5867dd',//'#6d7ae1'
        stroke: this.mapaService.stateColors.primary,
        strokeWidth: 2,
        strokeUniform: true,
        shadow: new fabric.Shadow({color: this.mapaService.stateColors.shadow, blur: 3, offsetX: 2, offsetY: 2}),
      });
      

    var texto = this.criarTextoEspaco('')
  
    // tooltip.style.top = "-50px";
    // tooltip.style.left = "10px";
    itens.push(rect);
    itens.push(texto);

    var sala = new fabric.Group(itens, {
      id: '',
      tipo: 'sala',
      nome: '',
      top:80,
      left: 40,
      hoverCursor: 'pointer',
      moveCursor: 'grabbing'
    })
    this.planta.add(sala);
    // this.planta.centerObject(sala);

    this.planta.setActiveObject(sala);
    this.habilitarBotaoVinculoSala = true;
    this.currentObjectSelected = sala;


    // consoleLog(this.plantaChild.nativeElement.top);
    // consoleLog(this.plantaChild.nativeElement.offsetTop);
    // consoleLog(this.planta._offset);
    // consoleLog(this.planta._offset.top);
    // consoleLog(this.planta.top);
    // consoleLog("posicao do objeto:");
    // // sala.calc
    // // this.planta.calcOffset
    // consoleLog(sala)
    // consoleLog(sala.top)
    // consoleLog(sala.left)
    // consoleLog(sala.clientY)
    // consoleLog(sala.offsetTop)
    // consoleLog(sala._offset);
    // this.planta.calcOffset();

    // this.tooltip.nativeElement.style.top = ((sala.top*this.planta.scaleY) - this.pos.y + this.plantaChild.nativeElement.offsetTop) + "px";
    // this.tooltip.nativeElement.style.left = ((sala.left*this.planta.scaleX) - this.pos.x + this.plantaChild.nativeElement.offsetLeft) + "px";
    // this.planta.renderAll();
  }

  criarTextoEspaco(texto){
    return new fabric.IText(texto, {
      originX: "center",
      originY: "middle",
      textAlign: "center",
      fontFamily: this.mapaService.font.family,//"Segoe UI",
      fontWeight: 500,
      shadow: new fabric.Shadow({color: this.mapaService.stateColors.white, blur: 4}),
      fontSize: this.mapaService.font.size,
      fill: this.mapaService.stateColors.textDark75
    });
  }
  manterFonte(){
    this.planta.on('object:scaling', options => {
      if (options.target.tipo == 'sala'){
        if (options.target.item(1) != undefined){
          var texto = options.target.item(1),
          sala = options.target,
          newY = 1 / ((this.calcularSeno(sala.angle) * sala.scaleX) + (this.calcularCosseno(sala.angle) * sala.scaleY));
          newX = 1 / ((this.calcularCosseno(sala.angle) * sala.scaleX) - (this.calcularSeno(sala.angle) * sala.scaleY)),
          
          texto.set({scaleX: newX, scaleY: newY, fontSize: 12});
        }
      }
      if (options.target.tipo == 'mesa'){
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

  criarPlanta(){
    this.esconderPlanta = false;
    this.esconderCriarPlanta = true;
    this.iniciarPlantaCanvas();
    this.ajustarPlantaCanvas();
    // this.adicionarPavimento();
    this.changeTab(2);
  }

  abrirPlanta(plantaData){
    this.iniciarPlantaCanvas();
    this.mapaService.ajustarPlantaCanvas(this.planta, 'planta');
    this.mapearVinculos();
    this.mapaService.fromJson(this.planta, plantaData);
    this.groupGrid = this.mapaService.createGrid(this.planta)
    this.hoverEffect();
    this.desabilitarImagemPlanta();
    this.desabilitarPavimento();
    this.desabilitarSalas();
    this.desabilitarMesas();
    this.desabilitarEstacionamentos();
    this.desabilitarFretados();
    this.plantaHelper = new PlantaHelper(this.planta);
    this.plantaHelper.zoom()
    this.planta.filterBackend = fabric.initFilterBackend();
    // this.planta.filterBackend = new fabric.WebglFilterBackend();
    // this.planta.filterBackend = new fabric.Canvas2dFilterBackend()
  }
  
  vincularSala(){
    let ngbModalOptions: NgbModalOptions;
    ngbModalOptions={
      backdrop: 'static',
      keyboard: true,
    }
    const modalRef = this.modalNgb.open(VinculoEspacoFormComponent, ngbModalOptions);
    modalRef.componentInstance.localizacao_id = this.currentLocalizacaoId;
    modalRef.componentInstance.categoria = 0;
    modalRef.componentInstance.listEspacos();
    let espaco_id = this.currentObjectSelected.id;
    if (espaco_id != undefined && espaco_id != ""){
        modalRef.componentInstance.formulario.get('id').setValue(espaco_id);
    }
    modalRef.result.then((espaco) => {
    // consoleLog(espaco);
      if (espaco != undefined && espaco.id > 0){
        this.currentObjectSelected.set({id: espaco.id});
        this.currentObjectSelected.item(0).set(
          {fill: this.mapaService.stateColors.primaryMoreTransparent,
          stroke: this.mapaService.stateColors.primary})
        this.currentObjectSelected.item(1).set({text: espaco.nome});
        this.currentObjectSelected.set({nome: espaco.nome});
        this.planta.renderAll();
      }
    })
  }

  vincularMesa(){
    let ngbModalOptions: NgbModalOptions;
    ngbModalOptions={
      backdrop: 'static',
      keyboard: true,
    }
    const modalRef = this.modalNgb.open(VinculoEspacoFormComponent, ngbModalOptions);
    modalRef.componentInstance.localizacao_id = this.currentLocalizacaoId;
    modalRef.componentInstance.categoria = 1;
    modalRef.componentInstance.listEspacos();
    let espaco_id = this.currentObjectSelected.id;
    if (espaco_id != undefined && espaco_id != ""){
        modalRef.componentInstance.formulario.get('id').setValue(espaco_id);
    }
    modalRef.result.then((espaco) => {
    // consoleLog(espaco);
      if (espaco != undefined && espaco.id > 0){
        this.currentObjectSelected.set({id: espaco.id});
        this.currentObjectSelected.item(0).set({fill: this.mapaService.stateColors.primaryLight})
        this.currentObjectSelected.item(1).set({fill: this.mapaService.stateColors.primaryLight})
        // this.currentObjectSelected.item(2).set({text: espaco.nome});
        this.currentObjectSelected.set({nome: espaco.nome});
        consoleLog(this.currentObjectSelected);
        this.planta.renderAll();
      }
    })
  }

  vincularEstacionamento(){
    let ngbModalOptions: NgbModalOptions;
    ngbModalOptions={
      backdrop: 'static',
      keyboard: true,
    }
    const modalRef = this.modalNgb.open(VinculoEspacoFormComponent, ngbModalOptions);
    modalRef.componentInstance.localizacao_id = this.currentLocalizacaoId;
    modalRef.componentInstance.categoria = 2;
    modalRef.componentInstance.listEspacos();
    let espaco_id = this.currentObjectSelected.id;
    if (espaco_id != undefined && espaco_id != ""){
        modalRef.componentInstance.formulario.get('id').setValue(espaco_id);
    }
    modalRef.result.then((espaco) => {
    // consoleLog(espaco);
      if (espaco != undefined && espaco.id > 0){
        this.currentObjectSelected.set({id: espaco.id});
        this.currentObjectSelected.item(0).set({fill: this.mapaService.stateColors.primaryLight})
        this.currentObjectSelected.item(1).set({fill: this.mapaService.stateColors.primaryLight})
        // this.currentObjectSelected.item(2).set({text: espaco.nome});
        this.currentObjectSelected.set({nome: espaco.nome});
        consoleLog(this.currentObjectSelected);
        this.planta.renderAll();
      }
    })
  }

  vincularFretado(){
    let ngbModalOptions: NgbModalOptions;
    ngbModalOptions={
      backdrop: 'static',
      keyboard: true,
    }
    const modalRef = this.modalNgb.open(VinculoEspacoFormComponent, ngbModalOptions);
    modalRef.componentInstance.localizacao_id = this.currentLocalizacaoId;
    modalRef.componentInstance.categoria = 3;
    modalRef.componentInstance.listEspacos();
    let espaco_id = this.currentObjectSelected.id;
    if (espaco_id != undefined && espaco_id != ""){
        modalRef.componentInstance.formulario.get('id').setValue(espaco_id);
    }
    modalRef.result.then((espaco) => {
    // consoleLog(espaco);
      if (espaco != undefined && espaco.id > 0){
        this.currentObjectSelected.set({id: espaco.id});
        this.currentObjectSelected.item(0).set({fill: this.mapaService.stateColors.primaryLight})
        this.currentObjectSelected.item(1).set({fill: this.mapaService.stateColors.primaryLight})
        // this.currentObjectSelected.item(2).set({text: espaco.nome});
        this.currentObjectSelected.set({nome: espaco.nome});
        consoleLog(this.currentObjectSelected);
        this.planta.renderAll();
      }
    })
  }

  //#endregion

  //#region habilitar e desabilitar objetos

  definirConfigsGeraisFabric(){
    fabric.Object.prototype.set({
      borderColor: this.mapaService.stateColors.primaryMoreTransparent,
      cornerColor: this.mapaService.stateColors.primaryLight,
      cornerStyle: 'circle',
      cornerSize: 9,
      padding: 4,
      objectCaching: true
      // centeredRotation: true,
      // transparentCorners: false,
    });

    // fabric.Object.prototype.controls.mtr = new fabric.Control({
    //   // x: 0,
    //   // y: -0.5,
    //   offsetY: -80,
    //   cursorStyle: 'grab',
    //   actionHandler: fabric.controlsUtils.rotationWithSnapping,
    //   actionName: 'rotate',
    //   // render: renderIcon,
    //   // cornerSize: 28,
    //   // withConnection: true
    // });
  }

  habilitarImagemPlanta(){
    this.planta.getObjects().forEach( (o) => {
      if(o.tipo == 'imagemPlanta') {
        o.selectable = true;
        o.hasControls = true;
        o.hoverCursor = 'pointer';
        this.imagemPlanta = o;
      }
    })
    this.planta.renderAll();
  }

  desabilitarImagemPlanta(){
    this.planta.getObjects().forEach( (o) => {
      if(o.tipo == 'imagemPlanta') {
        o.selectable = false;
        o.hasControls = false;
        o.hoverCursor = 'default';
      }
    })
    this.planta.renderAll();
  }

  habilitarPavimento(){
    this.planta.getObjects().forEach( (o) => {
      if(o.tipo == 'pavimento') {
        o.selectable = true;
        o.hasControls = true;
        o.hoverCursor = 'pointer';
      }
    })
    this.planta.renderAll();
  }

  desabilitarPavimento(){
    this.planta.getObjects().forEach( (o) => {
      if(o.tipo == 'pavimento') {
        o.selectable = false;
        o.hasControls = false;
        o.hoverCursor = 'default';
      }
    })
    this.planta.renderAll();
  }

  habilitarMesas(){
    this.planta.getObjects().forEach( (o) => {
      if(o.tipo == 'mesa') {
        if(o.id > 0){
          o._objects[0].set("fill",this.mapaService.stateColors.primaryLight);
          o._objects[1].set("fill",this.mapaService.stateColors.primaryLight);
        }else{
          o._objects[0].set("fill",this.mapaService.stateColors.primary);
          o._objects[1].set("fill",this.mapaService.stateColors.primary);
        }
        o.selectable = true;
        o.hasControls = true;
        o.hoverCursor = 'pointer';
      }
    })
    this.planta.renderAll();
  }

  desabilitarMesas(){
    this.planta.getObjects().forEach( (o) => {
      if(o.tipo == 'mesa') {
        o._objects[0].set("fill",this.mapaService.stateColors.secondary);
        o._objects[1].set("fill",this.mapaService.stateColors.secondary);
        o.selectable = false;
        o.hasControls = false;
        o.hoverCursor = 'default';
      }
    })
    this.planta.renderAll();
  }

  habilitarSalas(){
    this.planta.getObjects().forEach( (o) => {
      if(o.tipo == 'sala') {
        if(o.id > 0){
          o._objects[0].set("fill",this.mapaService.stateColors.primaryMoreTransparent);
        }else{
          o._objects[0].set("fill",this.mapaService.stateColors.primaryTransparent);
        }
        o._objects[0].set("stroke",this.mapaService.stateColors.primary);
        o.selectable = true;
        o.hasControls = true;
        o.hoverCursor = 'pointer';
      }
    })
    this.planta.renderAll();
  }

  desabilitarSalas(){
    this.planta.getObjects().forEach( (o) => {
      if(o.tipo == 'sala') {
        o._objects[0].set("fill",this.mapaService.stateColors.secondary);
        o._objects[0].set("stroke",this.mapaService.stateColors.secondary);
        o.selectable = false;
        o.hasControls = false;
        o.hoverCursor = 'default';
      }
    })
    this.planta.renderAll();
  }

  habilitarEstacionamentos(){
    this.planta.getObjects().forEach( (o) => {
      if(o.tipo == 'estacionamento') {
        if(o.id > 0){
          o._objects[0].set("fill",this.mapaService.stateColors.primaryLight);
          o._objects[1].set("fill",this.mapaService.stateColors.primaryLight);
        }else{
          o._objects[0].set("fill",this.mapaService.stateColors.primary);
          o._objects[1].set("fill",this.mapaService.stateColors.primary);
        }
        o.selectable = true;
        o.hasControls = true;
        o.hoverCursor = 'pointer';
      }
    })
    this.planta.renderAll();
  }

  desabilitarEstacionamentos(){
    this.planta.getObjects().forEach( (o) => {
      if(o.tipo == 'estacionamento') {
        o._objects[0].set("fill",this.mapaService.stateColors.secondary);
        o._objects[1].set("fill",this.mapaService.stateColors.secondary);
        o.selectable = false;
        o.hasControls = false;
        o.hoverCursor = 'default';
      }
    })
    this.planta.renderAll();
  }

  habilitarFretados(){
    this.planta.getObjects().forEach( (o) => {
      if(o.tipo == 'fretado') {
        if(o.id > 0){
          o._objects[0].set("fill",this.mapaService.stateColors.primaryLight);
          o._objects[1].set("fill",this.mapaService.stateColors.primaryLight);
        }else{
          o._objects[0].set("fill",this.mapaService.stateColors.primary);
          o._objects[1].set("fill",this.mapaService.stateColors.primary);
        }
        o.selectable = true;
        o.hasControls = true;
        o.hoverCursor = 'pointer';
      }
    })
    this.planta.renderAll();
  }

  desabilitarFretados(){
    this.planta.getObjects().forEach( (o) => {
      if(o.tipo == 'fretado') {
        o._objects[0].set("fill",this.mapaService.stateColors.secondary);
        o._objects[1].set("fill",this.mapaService.stateColors.secondary);
        o.selectable = false;
        o.hasControls = false;
        o.hoverCursor = 'default';
      }
    })
    this.planta.renderAll();
  }

  //#endregion


  calcularSeno(angle){
    return Math.round(Math.sin(fabric.util.degreesToRadians(angle))*1000000000)/1000000000;
  }

  calcularCosseno(angle){
    return Math.round(Math.cos(fabric.util.degreesToRadians(angle))*1000000000)/1000000000;
  }

  atualizarFileList(uploadList, remove?){
    Helpers.setLoading(true);
    consoleLog(uploadList);
    let formData: FormData = new FormData();

    var flagRemove = remove == undefined && remove != true;
    if (flagRemove == true){

      let fileList: FileHolder[] = uploadList.files;
      fileList.forEach(e => {
        var fh: FileHolder = e;
        if (fh.file.name != "undefined"){
          formData.append('[carousel_planta][]', fh.file, fh.file.name);
        }else{
          // event.src.replace(/^.*[\\\/]/, '');
          formData.append('[planta_persistir][]', fh.src.split("/")[7]);
        }
      });
    }else{
      // event.src.replace(/^.*[\\\/]/, '');
      // formData.append('[planta_persistir][]', uploadList.src.replace(/^.*[\\\/]/, ''));
    }

    // pra nao encostar: nao envia nada
    // pra deletar envia o parametro, mas com o array vazio
    // pra enviar um novo, mas sem deletar, é preciso enviar o filename no planta_persistir. porém o back ainda nao tá tratando 

    //   this.deletarEdicaoCarousel('publicidade', this.filesDeletePublicidade);
    //   this.deletarEdicaoCarousel('fundo', this.filesDeleteFundo);
    //   this.uploadCarousel('publicidade', this.filesListPublicidade);
    //   this.uploadCarousel('fundo', this.filesListFundo);
    consoleLog(formData.getAll('[carousel_planta][]'));
    consoleLog(formData)


    // this.putForm(header, formData);

    this.webService.putFormData(`/localizacoes/${this.currentLocalizacaoId}`, formData)
    .subscribe(
      response =>{
        if (flagRemove == true){
          this.adicionarImagemPlanta(response.body.carousel_planta[0].url)
        }
        Helpers.setLoading(false);
      },
      (error) => {
        Helpers.setLoading(false);
        this.modalService.tratarError(error);
      }
    )
  }


}
