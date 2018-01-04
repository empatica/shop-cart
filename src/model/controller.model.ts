/// <reference path="./index.d.ts" />
function getElemData(t: any, d: string) {
  if (t.dataset) {
    return t.dataset[d];
  }
  return t.getAttribute(ShopCartConst.PREFIX_DATA + d);
}

module ShopCart {
  export var variantProductMap = [];
  export var productVariantsImageMap = [];
  export var variantMap = [];
  export class CartController {
    config: ShopCart.Config
    cart: ShopCart.Cart
    storage: any
    events: any
    utm: Array<ShopCart.Utm>

    // Public function

    /*
    getItem(upc: number): ShopCart.Item

    Returns the item with the given UPC. 
    If the UPC is not listed in the `config.products` array, `null` value is returned.
    */
    getItem(upc: number): ShopCart.Item {
      var p = ShopCart.variantProductMap[upc];
      var v = ShopCart.variantMap[upc];
      if (!upc || !p || !v) {
        return null
      }
      return new ShopCart.Item(upc, p, v);
    }

    /*
    setItem(upc: number): number 

    Adds the item with the given UPC to the cart. If the item is already in the cart, the quantity is incremented. 
    Returns the number of items in the cart for the given UPC. 
    If the UPC is not listed in the `config.products` array, `null` value is returned.
    */
    setItem(upc: number): number {
      var i = this.getItem(upc);
      if (!i) {
        return null;
      }
      var q = this.cart.setItem(i);
      this.openCart();
      this.setTotal();
      return q;
    }

    /*
    removeItem(upc: number): number

    Removes the item with the given UPC to the cart. If the item is already in the cart, the quantity is decremented. 
    Returns the number of items in the cart for the given UPC.
    If the UPC is not listed in the `config.products` array, `null` value is returned.
    */
    removeItem(upc: number): number {
      var i = this.getItem(upc);
      if (!i) {
        return null;
      }
      var q = this.cart.removeItem(i);
      this.setTotal();
      return q;
    }

    /*
    getCheckoutUrl(): string

    Returns the checkout url for the current cart, to which redirect the user for check out the cart and complete the order.
    */
    getCheckoutUrl(): string {
      var storeUrl = this.config.store.url;
      if (storeUrl[storeUrl.length - 1] != '/') {
        storeUrl += '/';
      }
      var url = storeUrl + 'cart/';
      if (this.cart.quantity <= 0) {
        return null;
      }
      for (var i = 0; i < this.cart.items.length; i++) {
        if (this.cart.items[i].quantity <= 0) {
          continue;
        }
        url += (this.cart.items[i].item.upc + ':' + this.cart.items[i].quantity + ',');
      }
      if (this.utm && this.utm.length > 0) {
        url += '?';
        this.utm.forEach(function (u: ShopCart.Utm) {
          url += (u.key + '=' + u.value + '&');
        })
      }
      return url;
    }

    /*
    getCheckoutUrl(): void

    Refreshes total and quantity and set the class to open the cart.
    */
    openCart() {
      this.updateCartQuantities();
      this.elementLoop(this.config.selector.cart.main, function (e: Element, self: ShopCart.CartController) {
        if (e.className.indexOf(self.config.selectorClass.cart.open) >= 0) {
          return;
        }
        e.className += (' ' + self.config.selectorClass.cart.open);
        var h = '';
        for (var i = 0; i < self.cart.items.length; i++) {
          if (self.cart.items[i].quantity > 0) {
            var n = self.createCartItem(self.cart.items[i])
          }
        }
      })
      if (document.body.className.indexOf(this.config.selectorClass.body.cartOpen) < 0) {
        document.body.className += (' ' + this.config.selectorClass.body.cartOpen);
      }
    }

    //Private functions

    /*
    elementLoop(query: string, callback: Function): void

    Selects all the elements for the given query and executes the callback function.
    Callback function should accept the current element and the current cart controller as argument
    */
    private elementLoop(query: string, callback: Function) {
      var l = document.querySelectorAll(query);
      for (var i = 0; i < l.length; i++) {
        callback(l[i], this);
      }
    }

    /*
    registerCartItemEvents(n: Element): void

    Registers the events associated to each item that has been added to the cart, in order to perform actions such as increment, decrement and update item quantity.
    */
    private registerCartItemEvents(n: Element, ) {
      var l = n.querySelectorAll(ShopCartConst.SELECTOR_CART_ACTION)
      for (var i = 0; i < l.length; i++) {
        this.registerCartActionEvent(l[i])
        this.events[getElemData(l[i], ShopCartConst.DATA_UPC) + '-' + getElemData(l[i], ShopCartConst.DATA_ACTION)] = true;
      }

      l = n.querySelectorAll('input' + ShopCartConst.SELECTOR_ITEM_QUANTITY)
      for (var i = 0; i < l.length; i++) {
        this.registerCartUpdateEvent(l[i])
      }
    }

    /*
    registerCartUpdateEvent(el: Element): void

    Registers the update quantity events associated to each item that has been added to the cart.
    */
    private registerCartUpdateEvent(el: Element) {
      var self = this
      el.addEventListener('input', function (e) {
        var v = (<any>e.target).value;
        if (v) {
          var q = parseInt(v);
          if (isNaN(q)) {
            return;
          }
          self.setItemQuantity(getElemData(e.target, ShopCartConst.DATA_UPC), q);
        }
      });
    }

    /*
    registerCartActionEvent(el: Element): void

    Registers the action events associated to each item that has been added to the cart, such as increment and decrement quantity.
    */
    private registerCartActionEvent(el: Element) {
      var self = this;
      if (!this.events) {
        this.events = {}
      }
      if (this.events[getElemData(el, ShopCartConst.DATA_UPC)]) {
        return;
      }
      this.events[getElemData(el, ShopCartConst.DATA_UPC) + '-' + getElemData(el, ShopCartConst.DATA_ACTION)] = true;
      el.addEventListener('click', function (e) {
        var upc = getElemData(e.target, ShopCartConst.DATA_UPC);
        switch (getElemData(e.target, ShopCartConst.DATA_ACTION)) {
          case ShopCartConst.ACTION_ADD:
            var q = self.setItem(upc);
            self.updateCartQuantities()
            break;
          case ShopCartConst.ACTION_REMOVE:
            var q = self.removeItem(upc);
            self.updateCartQuantities()
            break
        }
      })
    }

    /*
    setItemQuantity(upc: number, quantity: number): number

    Updates the cart item quantity for the cart item with the given upc.
    If the item has not been added to the cart, the item will be created.
    Updates the total and opens the cart.
    Returns the number of items for the given upc that are currently in the cart.
    */
    private setItemQuantity(upc: number, quantity: number): number {
      var i = this.getItem(upc);
      if (!i) {
        return null
      }
      var exists = false;
      var q = 0;
      this.cart.items.map(function (ic) {
        if (ic.item.upc == upc) {
          ic.quantity = quantity;
          exists = true;
          q = ic.quantity;
        }
        return ic;
      })
      if (!exists) {
        this.cart.items.push(new ShopCart.CartItem(i, quantity));
        q = 1;
      }
      this.openCart();
      this.setTotal();
      return q;
    }

    /*
    createCartItem(i: CartItem): void

    Creates a new HTML element for the given cart item and registers the related events.
    If the element already exists, updates the quantity.
    */
    private createCartItem(i: CartItem) {
      if (i.quantity > 0 && !document.getElementById(ShopCartConst.PREFIX_ITEM + i.item.upc)) {
        var n = document.createElement('div');
        n.className = ShopCartConst.CLASS_ITEM;
        n.id = ShopCartConst.PREFIX_ITEM + i.item.upc;
        n.innerHTML = i.getTemplate(this.config);
        document.querySelector(ShopCartConst.SELECTOR_CART_ITEM_LIST).appendChild(n);
        this.registerCartItemEvents(n)
      } else {
        this.updateItemQuantity(i);
      }
    }

    /*
    updateCartQuantities(): void

    Loops through the cart items and creates the relevant HTML elements for the cart
    */
    private updateCartQuantities() {
      for (var i = 0; i < this.cart.items.length; i++) {
        this.createCartItem(this.cart.items[i]);
        this.updateItemQuantity(this.cart.items[i]);
      }
    }

    /*
    updateItemQuantity(i: CartItem): void

    For each HTML element associated to the given cart item, update the displayed quantity.
    */
    private updateItemQuantity(i: ShopCart.CartItem) {
      var n = document.querySelectorAll('#' + ShopCartConst.PREFIX_ITEM + i.item.upc),
        q = document.querySelectorAll('#' + ShopCartConst.PREFIX_ITEM + i.item.upc + ' ' + ShopCartConst.SELECTOR_ITEM_QUANTITY);
      if (q && q.length > 0) {
        if (i.quantity <= 0) {
          document.querySelector(ShopCartConst.SELECTOR_CART_ITEM_LIST).removeChild(n[0]);
          return;
        }
        for (var j = 0; j < q.length; j++) {
          (<any>q[j]).value = i.quantity.toString();
        }
      }
    }

    /*
    setTotal(): number

    Updates cart total and cart items.
    Returns the cart total.
    */
    private setTotal(): number {
      var t = 0, q = 0;
      for (var i = 0; i < this.cart.items.length; i++) {
        t += (this.cart.items[i].item.product.price * this.cart.items[i].quantity);
        q += (this.cart.items[i].quantity > 0 ? this.cart.items[i].quantity : 0);
      }
      this.cart.total = t;
      this.cart.quantity = q;
      this.updateCartTotal();
      this.updateCart();
      return t;
    }

    /*
    setUtm(): void

    Set utm values in browser storage for use in the checkout flow.
    */
    private setUtm() {
      this.utm = this.getUrlUtm();
      if (this.utm && this.utm.length > 0) {
        this.storage.set(ShopCartConst.STORAGE_UTM, this.utm);
      } else {
        this.utm = this.getUtm();
      }
    }

    /*
    getUtm(): Array<Utm>

    Retrieves and returns utm values from browser storage for use in the checkout flow.
    */
    private getUtm(): Array<ShopCart.Utm> {
      return this.storage.get(ShopCartConst.STORAGE_UTM);
    }

    /*
    getUrlUtm(): Array<Utm>

    Retrieves and returns utm values from url.
    */
    private getUrlUtm(): Array<ShopCart.Utm> {
      var utm = [];
      var utmPrefix = 'utm_';
      var url = window.location.href.trim();
      if (url.indexOf('?') < 0 || url.indexOf(utmPrefix) < 0) {
        return utm;
      }
      var q = url.split('?')[1];
      var regex = new RegExp("^" + utmPrefix + "?[a-zA-Z0-9]*");
      q.split('&').forEach(function (p) {
        if (regex.test(p)) {
          var i = p.split('=');
          utm.push(new ShopCart.Utm(i[0], i[1]));
        }
      })
      return utm;
    }

    /*
    updateCart(): void

    Perform cart HTML updates.
    */
    private updateCart() {
      this.storage.set(ShopCartConst.STORAGE_CART, this.cart);
      this.updateCartNotification();
      this.updateCartCheckoutButton();
      this.updateCartActive();
      return;
    }

    /*
    updateCartTotal(): void

    Updates cart total in the page.
    */
    private updateCartTotal() {
      var t = document.querySelectorAll(this.config.selector.cart.total);
      for (var i = 0; i < t.length; i++) {
        t[i].innerHTML = this.cart.total.toFixed(2) + ' ' + this.cart.currency.label;
      }
      var t = document.querySelectorAll(this.config.selector.cart.count);
      for (var i = 0; i < t.length; i++) {
        t[i].innerHTML = this.cart.quantity.toString();
      }
    }

    /*
    updateCartCheckoutButton(): void

    Updates cart quantity status in the page.
    */
    private updateCartCheckoutButton() {
      this.elementLoop(this.config.selector.cart.main, function (e: Element, self: ShopCart.CartController) {
        if (self.cart.quantity > 0) {
          e.className = e.className.replace(self.config.selectorClass.cart.empty, '').trim();
          self.setCartProductClass();
        } else {
          if (e.className.indexOf(self.config.selectorClass.cart.empty) < 0) {
            e.className += (' ' + self.config.selectorClass.cart.empty);
          }
        }
      });
    }

    /*
    setCartProductClass(): void

    Updates cart product-related classes in the page.
    */
    private setCartProductClass() {
      this.elementLoop(this.config.selector.cart.main, function (e: Element, self: ShopCart.CartController) {
        for (var j = 0; j < self.config.products.length; j++) {
          var id = self.config.products[j].id;
          e.className = e.className.replace(id, '').trim();
        }
        for (var j = 0; j < self.cart.items.length; j++) {
          if (self.cart.items[j].quantity > 0) {
            var p = ShopCart.variantProductMap[self.cart.items[j].item.upc];
            if (e.className.indexOf(p.id) < 0) {
              e.className += (' ' + p.id)
            }
          }
        }
      });
    }

    /*
    updateCartActive(): void

    Updates cart status in the page.
    */
    private updateCartActive() {
      this.elementLoop(this.config.selector.element.main, function (e: Element, self: ShopCart.CartController) {
        if (self.cart.quantity > 0) {
          if (e.className.indexOf(self.config.selectorClass.element.active) < 0) {
            e.className += (' ' + self.config.selectorClass.element.active);
          }
        } else {
          e.className = e.className.replace(self.config.selectorClass.element.active, '').trim();
        }
      })
    }

    /*
    updateCartNotification(): void

    Updates cart notification status and quantity in the page.
    */
    private updateCartNotification() {
      this.elementLoop(this.config.selector.element.notification, function (e: Element, self: ShopCart.CartController) {
        if (self.cart.quantity > 0) {
          e.innerHTML = self.cart.quantity.toString()
          if (e.className.indexOf(self.config.selectorClass.element.active) < 0) {
            e.className += (' ' + self.config.selectorClass.element.active);
          }
        } else {
          e.className = e.className.replace(self.config.selectorClass.element.active, '').trim();
        }
      });
    }

    /*
    ready(): void

    Set the body to be cart-ready when ShopCart is ready to work.
    */
    private ready() {
      return document.body.className += (' ' + this.config.selectorClass.body.cartReady);
    }

    private setConfig(config: any) {
      if (!config.store || !config.store.url) {
        throw Error("Store url is missing")
      }
      this.config = new ShopCart.Config(config);
      for (var i = 0; i < config.products.length; i++) {
        var p = config.products[i];
        for (var j = 0; j < p.variants.length; j++) {
          ShopCart.variantProductMap[p.variants[j].upc] = new ShopCart.Product(p.id, p.name, p.price, p.description, p.image.url);
          ShopCart.productVariantsImageMap[p.variants[j].upc] = new ShopCart.ProductImage(p.variants[j].image.url);
          ShopCart.variantMap[p.variants[j].upc] = new ProductVariant(p.variants[j].name, p.variants[j].upc, p.variants[j].sku, p.variants[j].size, p.variants[j].image.url);
        }
      }
    }

    constructor(config: any, storage: any = null, cart: Cart = null) {
      if (!config) {
        throw Error("Store configuration is missing");
      }
      if (!storage) {
        if (!(<any>window).store) {
          throw Error("Storage is missing");
        }
        storage = (<any>window).store
      }
      if (!cart) {
        cart = (<any>window).store.get(ShopCartConst.STORAGE_CART);
      }
      this.setConfig(config);
      this.storage = storage;
      this.setUtm();
      cart = ShopCart.isValidCart(cart) ? new ShopCart.Cart(cart.currency, cart) : new ShopCart.Cart(this.config.currency);
      this.cart = cart;
      this.setTotal();
      this.ready();
    }
  }
}