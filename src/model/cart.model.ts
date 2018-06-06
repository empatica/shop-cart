/// <reference path="./index.d.ts" />
namespace ShopCart {
  /*
  CART_INVALID_BEFORE

  This value will be used to invalidate an old cart that is no longer supported.
  */
  export const CART_INVALID_BEFORE = 1515076732673;

  export class Cart {
    id: string;
    createdAt: number;
    total: number;
    quantity: number;
    items: Array<CartItem>;
    currency: Currency;
    constructor(currency: Currency, cart: ShopCart.Cart = null) {
      if (!cart) {
        this.id = this.getId();
        this.createdAt = new Date().getTime();
        this.currency = currency;
        this.items = [];
        this.total = 0;
        this.quantity = 0;
      } else {
        this.init(cart);
      }
    }

    /*
    setItem(i: ShopCart.Item): number {

    Adds the item to the cart. If the item is already in the cart, the quantity is incremented. 
    Returns the number of items in the cart for the given item's UPC. 
    */
    setItem(i: ShopCart.Item): number {
      var exists = false;
      var q = 0;
      this.items.map(function(ic) {
        if (ic.item.upc == i.upc) {
          ic.quantity++;
          exists = true;
          q = ic.quantity;
        }
        return ic;
      });
      if (!exists) {
        this.items.push(new ShopCart.CartItem(i, 1));
        q = 1;
      }
      return q;
    }

    /*
    removeItem(i: ShopCart.Item): number

    Removes the item from the cart. If the item is already in the cart, the quantity is decremented, otherwise no action is taken.
    Returns the number of items in the cart for the given UPC.
    */
    removeItem(i: ShopCart.Item): number {
      var q = 0;
      this.items.map(function(ic) {
        if (ic.item.upc == i.upc) {
          if (ic.quantity > 0) {
            ic.quantity--;
          }
          q = ic.quantity;
        }
        return ic;
      });
      return q;
    }

    private init(cart: ShopCart.Cart) {
      this.id = cart.id;
      this.createdAt = cart.createdAt;
      this.currency = cart.currency;
      this.total = cart.total;
      this.quantity = cart.quantity;
      this.initItems(cart.items);
    }

    private initItems(items: Array<ShopCart.CartItem>) {
      this.items = [];
      for (var i = 0; i < items.length; i++) {
        this.items.push(
          new ShopCart.CartItem(items[i].item, items[i].quantity)
        );
      }
    }

    private getId(): string {
      function s4() {
        return Math.floor((1 + Math.random()) * 0x10000)
          .toString(16)
          .substring(1);
      }
      var id =
        s4() +
        s4() +
        "-" +
        s4() +
        "-" +
        s4() +
        "-" +
        s4() +
        "-" +
        s4() +
        s4() +
        s4() +
        "-" +
        Date.now();
      return id;
    }
  }

  var cartProps = [
    "id",
    "createdAt",
    "total",
    ,
    "quantity",
    "items",
    "currency"
  ];
  export function isValidCart(cart: any): boolean {
    if (
      !cart ||
      !cart.createdAt ||
      cart.createdAt < ShopCart.CART_INVALID_BEFORE
    ) {
      return false;
    }
    var v = true;
    for (var i = 0; i < cartProps.length; i++) {
      v = v && (!cartProps[i] || cart[cartProps[i]] !== undefined);
    }
    return v;
  }
}
