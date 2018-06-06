namespace ShopCart {
  export class Dispatcher {
    private addEvtRepo: any;
    private removeEvtRepo: any;
    private openEvt: any;
    private closeEvt: any;
    private initEvt: any;
    private readyEvt: any;

    constructor() {
      this.polyfill();
      this.addEvtRepo = {};
      this.removeEvtRepo = {};
      this.openEvt = this.createEvt(ShopCartConst.OPEN_EVT);
      this.closeEvt = this.createEvt(ShopCartConst.CLOSE_EVT);
      this.initEvt = this.createEvt(ShopCartConst.INIT_EVT);
      this.readyEvt = this.createEvt(ShopCartConst.READY_EVT);
    }

    public add(upc: number): boolean {
      if (!this.addEvtRepo[upc]) {
        this.addEvtRepo[upc] = this.createEvt(
          ShopCartConst.ADD_EVT,
          upc.toString()
        );
      }
      return window.dispatchEvent(this.addEvtRepo[upc]);
    }
    public remove(upc: number): boolean {
      if (!this.removeEvtRepo[upc]) {
        this.removeEvtRepo[upc] = this.createEvt(
          ShopCartConst.REMOVE_EVT,
          upc.toString()
        );
      }
      return window.dispatchEvent(this.removeEvtRepo[upc]);
    }
    public open(): boolean {
      if (!this.openEvt) {
        return;
      }
      return window.dispatchEvent(this.openEvt);
    }
    public close(): boolean {
      if (!this.closeEvt) {
        return;
      }
      return window.dispatchEvent(this.closeEvt);
    }
    public init(): boolean {
      if (!this.initEvt) {
        return;
      }
      return window.dispatchEvent(this.initEvt);
    }
    public ready(): boolean {
      if (!this.readyEvt) {
        return;
      }
      return window.dispatchEvent(this.readyEvt);
    }

    private createEvt(evt: string, detail: string = null): CustomEvent {
      return new (<any>window).CustomEvent(evt, { detail: detail });
    }
    private polyfill() {
      if (typeof (<any>window).CustomEvent === "function") return false;
      function CustomEvent(event, params) {
        params = params || {
          bubbles: false,
          cancelable: false,
          detail: undefined
        };
        var evt = document.createEvent("CustomEvent");
        evt.initCustomEvent(
          event,
          params.bubbles,
          params.cancelable,
          params.detail
        );
        return evt;
      }

      CustomEvent.prototype = (<any>window).Event.prototype;

      (<any>window).CustomEvent = CustomEvent;
    }
  }
}
