namespace ShopCartConst {
  export const STORAGE_CART = "cart";
  export const STORAGE_UTM = "utm";

  // Body
  export const CLASS_BODY_CART_READY = "cart-ready";
  export const CLASS_BODY_CART_OPEN = "cart-open";

  // Cart
  export const CLASS_CART_ACTION = "cart-action";
  export const CLASS_CART_EMPTY = "empty";
  export const CLASS_CART_OPEN = "open";
  export const SELECTOR_CART = "#store-cart";
  export const SELECTOR_CART_ACTION = ".cart-action";
  export const SELECTOR_CART_ITEM_LIST = "#cart-item-list";
  export const SELECTOR_CART_TOTAL_PRICE = ".cart-total-price";
  export const SELECTOR_CART_TOTAL_COUNT = ".cart-total-count";

  // Cart item element
  export const ACTION_ADD = "add";
  export const ACTION_REMOVE = "remove";
  export const DATA_ACTION = "action";
  export const DATA_UPC = "upc";
  export const CLASS_ITEM_QUANTITY = "quantity";
  export const CLASS_ITEM = "cart-item";
  export const SELECTOR_ITEM_QUANTITY = ".quantity";

  // Element
  export const CLASS_ELEMENT_ACTIVE = "active";
  export const SELECTOR_ELEMENT_CART_AREA = ".cart-area";
  export const SELECTOR_ELEMENT_CART_NOTIFICATION = ".cart-notification";

  // Prefixes
  export const PREFIX_CART_IMAGE = "cart_";
  export const PREFIX_DATA = "data-";
  export const PREFIX_ITEM = "item-";

  // Events
  export const ADD_EVT = "shop-cart-add";
  export const REMOVE_EVT = "shop-cart-remove";
  export const OPEN_EVT = "shop-cart-open";
  export const CLOSE_EVT = "shop-cart-close";
  export const INIT_EVT = "shop-cart-init";
  export const READY_EVT = "shop-cart-ready";
}
