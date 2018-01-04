/// <reference path="index.d.ts" />
module ShopCart {
  export class Config {
    store: ShopCart.ConfigStore
    image: ShopCart.ConfigImage
    currency: ShopCart.Currency
    currencies: Array<ShopCart.Currency>
    products: Array<ShopCart.Product>
    selector: ShopCart.ConfigSelector
    selectorClass: ShopCart.ConfigSelectorClass

    constructor(config: any) {
      if (!config) {
        throw new Error("Config is missing")
      }
      this.store = new ShopCart.ConfigStore(config.store)
      this.image = new ShopCart.ConfigImage(config.image)
      this.currencies = (<Array<ShopCart.Currency>>config.currencies)
      this.currency = this.getDefaultCurrency()
      this.products = (<Array<ShopCart.Product>>config.products)
      this.selector = new ShopCart.ConfigSelector(config.selector)
      this.selectorClass = new ShopCart.ConfigSelectorClass(config.selectorClass)
    }

    private getDefaultCurrency() {
      var defCurr = <ShopCart.Currency>{
        name: "United States Dollar",
        label: "USD",
        code: "USD",
        symbol: "$",
        default: true
      };
      if (!this.currencies || this.currencies.length == 0) {
        return defCurr;
      }
      var list = this.currencies.filter(function (c: ShopCart.Currency) { return c.default })
      if (!list || list.length == 0) {
        return this.currencies[0];
      }
      return list[0];
    }
  }

  export class ConfigStore {
    name: string
    url: string

    constructor(config: any) {
      if (!config) {
        throw new Error("Store config is missing")
      }
      this.name = config.name
      this.url = config.url
    }
  }

  export class ConfigImage {
    basePath: string
    lazyload: boolean

    constructor(config: any = null) {
      this.basePath = config && config.basePath ? config.basePath : './images/'
      this.lazyload = Boolean(config.lazyload)
    }
  }

  export class ConfigSelector {
    body: string
    cart: ShopCart.ConfigSelectorCart
    element: ShopCart.ConfigSelectorElement

    constructor(config: any = null) {
      if (!config) {
        config = {
          cart: null,
          body: 'body',
          element: null
        }
      }
      this.cart = new ShopCart.ConfigSelectorCart(config.cart)
      this.body = config.body
      this.element = new ShopCart.ConfigSelectorElement(config.element)
    }
  }

  export class ConfigSelectorClass {
    cart: ShopCart.ConfigSelectorClassCart
    body: ShopCart.ConfigSelectorClassBody
    element: ShopCart.ConfigSelectorClassElement

    constructor(config: any = null) {
      if (!config) {
        config = {
          cart: null,
          body: null,
          element: null
        }
      }
      this.cart = new ShopCart.ConfigSelectorClassCart(config.cart)
      this.body = new ShopCart.ConfigSelectorClassBody(config.body)
      this.element = new ShopCart.ConfigSelectorClassElement(config.element)
    }
  }

  export class ConfigSelectorCart {
    main: string
    total: string
    count: string

    constructor(config: any = null) {
      this.main = config && config.main ? config.main : ShopCartConst.SELECTOR_CART
      this.total = config && config.total ? config.total : ShopCartConst.SELECTOR_CART_TOTAL_PRICE
      this.count = config && config.count ? config.count : ShopCartConst.SELECTOR_CART_TOTAL_COUNT
    }
  }
  export class ConfigSelectorClassCart {
    open: string
    empty: string

    constructor(config: any = null) {
      this.open = config && config.open ? config.open : ShopCartConst.CLASS_CART_OPEN
      this.empty = config && config.empty ? config.empty : ShopCartConst.CLASS_CART_EMPTY
    }
  }

  export class ConfigSelectorClassBody {
    cartReady: string
    cartOpen: string

    constructor(config: any = null) {
      this.cartReady = config && config.cartReady ? config.cartReady : ShopCartConst.CLASS_BODY_CART_READY
      this.cartOpen = config && config.cartOpen ? config.cartOpen : ShopCartConst.CLASS_BODY_CART_OPEN
    }
  }

  export class ConfigSelectorElement {
    main: string
    notification: string

    constructor(config: any = null) {
      this.main = config && config.main ? config.main : ShopCartConst.SELECTOR_ELEMENT_CART_AREA
      this.notification = config && config.notification ? config.notification : ShopCartConst.SELECTOR_ELEMENT_CART_NOTIFICATION
    }
  }
  export class ConfigSelectorClassElement {
    active: string

    constructor(config: any = null) {
      this.active = config && config.active ? config.active : ShopCartConst.CLASS_ELEMENT_ACTIVE
    }
  }
}