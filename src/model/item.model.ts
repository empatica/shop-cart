/// <reference path="./index.d.ts" />

module ShopCart {
  export class Item {
    upc: number
    quantity: number
    product: Product
    productvariant: ProductVariant

    constructor(upc: number, product: Product, productVariant: ProductVariant) {
      this.upc = upc;
      this.product = product;
      this.productvariant = productVariant;
    }
  }

  export class CartItem {
    item: Item
    quantity: number

    constructor(item: Item, quantity: number = 0) {
      this.item = item
      this.quantity = quantity
    }

    /* 
    getTemplate(config: ShopCart.Config): string

    Returns the HTML template for the cart item element, filled with the item information.
    */
    getTemplate(config: ShopCart.Config = null): string {
      var t = ''
      var product = ShopCart.variantProductMap[this.item.upc];
      var image = ShopCart.productVariantsImageMap[this.item.upc];
      var imageBasePath = config && config.image && config.image.basePath ? config.image.basePath : './images/'
      t += '<table><tr>';
      t += '<td class="product-image">';
      if (image && image.url) {
        t += '<img src="' + imageBasePath + image.url + '">';
      }
      t += '</td>'
      t += '<td class="product-details"><div class="product-name">' + product.name + '</div>';
      if (this.item.productvariant.name) {
        t += '<div class="item-name">Color: ' + this.item.productvariant.name + '</div>';
      }
      if (this.item.productvariant.size) {
        t += '<div class="item-size">Size: ' + this.item.productvariant.size + '</div>';
      }
      t += '<div class="input-group">';
      t += '<button class="minus ' + ShopCartConst.CLASS_CART_ACTION + '" data-upc="' + this.item.upc + '" data-sku="' + this.item.productvariant.sku + '" data-product="' + product.name + '" data-price="' + product.price + '" data-label="' + this.item.productvariant.name + '" data-action="remove"></button>';
      t += '<input class="' + ShopCartConst.CLASS_ITEM_QUANTITY + ' form-control hidden-xs"  min="0" type="text" value="' + this.quantity + '" data-upc="' + this.item.upc + '"></input>';
      t += '<input class="' + ShopCartConst.CLASS_ITEM_QUANTITY + ' form-control visible-xs" disabled="disabled"  min="0" type="text" value="' + this.quantity + '" data-upc="' + this.item.upc + '"></input>';
      t += '<button class="plus ' + ShopCartConst.CLASS_CART_ACTION + '" data-upc="' + this.item.upc + '" data-sku="' + this.item.productvariant.sku + '" data-product="' + product.name + '" data-price="' + product.price + '" data-label="' + this.item.productvariant.name + '" data-action="add"></button>';
      t += '</div></td>'
      t += '<td class="product-price">';
      t += '<div class="item-price">' + product.price.toFixed(2) + '</div>';
      t += '</td>';
      t += '</tr></table>';
      return t;
    }
  }
}