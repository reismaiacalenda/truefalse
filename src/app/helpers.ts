import $ from "jquery";
import { User } from "./auth/_models";

/* Insert safe window reference */
const _window = typeof window !== 'undefined' ? window : null;

export class Helpers {
  static loadStyles(tag: any, src: string | string[]) {
    if (Array.isArray(src)) {
      $.each(src, function(k, s) {
        $(tag).append($('<link/>').attr('href', s).attr('rel', 'stylesheet').attr('type', 'text/css'));
      });
    } else {
      $(tag).append($('<link/>').attr('href', src).attr('rel', 'stylesheet').attr('type', 'text/css'));
    }
  }

  static unwrapTag(element: HTMLElement) {
    $(element).removeAttr('appunwraptag').unwrap();
  }

  /**
   * Set title markup
   * @param title
   */
  static setTitle(title: any) {
    $('.m-subheader__title').text(title);
  }

  /**
   * Breadcrumbs markup
   * @param breadcrumbs
   */
  static setBreadcrumbs(breadcrumbs: any) {
    if (breadcrumbs) $('.m-subheader__title').addClass('m-subheader__title--separator');

    let ul = $('.m-subheader__breadcrumbs');

    if ($(ul).length === 0) {
      ul = $('<ul/>').addClass('m-subheader__breadcrumbs m-nav m-nav--inline')
        .append($('<li/>').addClass('m-nav__item')
          .append($('<a/>').addClass('m-nav__link m-nav__link--icon')
            .append($('<i/>').addClass('m-nav__link-icon la la-home'))));
    }

    $(ul).find('li:not(:first-child)').remove();
    $.each(breadcrumbs, function(k, v) {
      let li = $('<li/>').addClass('m-nav__item')
        .append($('<a/>').addClass('m-nav__link m-nav__link--icon').attr('routerLink', v.href).attr('title', v.title)
          .append($('<span/>').addClass('m-nav__link-text').text(v.text)));
      $(ul).append($('<li/>').addClass('m-nav__separator').text('-')).append(li);
    });
    $('.m-subheader .m-stack__item:first-child').append(ul);
  }

  static setLoading(enable: boolean) {
    let body = $('body');
    if (enable) {
      // $(body).addClass('m-page--loading-non-block')
    } else {
      // $(body).removeClass('m-page--loading-non-block')
    }
  }

  static bodyClass(strClass: any) {
    $('body').attr('class', strClass);
  }

  static enumeraRole(role: any){
    switch(role){
      case "Visitante": return 0;
      case "Membro": return 1;
      case "Atendente": return 2;
      case "Operador": return 3;
      case "Admin": return 4;
      case "Master": return 5;
      default: return -1; // Default return value
    }
  }

  static mobile = _window ? /Android|iPhone/i.test(_window.navigator.userAgent) : false;
  static isMobile(){
    return this.mobile;
  }

  static iOSversion() {
   
  }

  static OS: string;
  static getOS(){
    var ver;
    if (_window && /iP(hone|od|ad)/.test(_window.navigator.platform)) {
      // supports iOS 2.0 and later: <http://bit.ly/TJjs1V>
      var v = (_window.navigator.appVersion).match(/OS (\d+)_(\d+)_?(\d+)?/);
      if (v) {
        ver = [parseInt(v[1], 10), parseInt(v[2], 10), parseInt(v[3] || "0", 10)];
      }
      if (ver && ver[0] >= 11) {
        this.OS = "iOS11+";
      }else{
        this.OS = "iOS10-";
      }
    }else if(_window && /Android/i.test(_window.navigator.userAgent)){
      var ua: string = (_window.navigator.userAgent).toLowerCase(); 
      var match = ua.match(/android\s([0-9\.]*)/);
      ver = match ? parseInt(match[1], 10) || 0 : 0;
      if (ver >= 6) {
        this.OS="Android6+";
      }else if(ver >= 9){
        this.OS="Android9+";
      }else {
        this.OS="Android5-";
      }
    }
    else{
      this.OS="Android9+"
    } 
  
    return this.OS;
  }

}
