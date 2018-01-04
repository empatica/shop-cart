/// <reference path="./index.d.ts" />

module ShopCart {
  export class ProductImage {
    key: string
    url: string
    cart: string
    ldpi: string
    mdpi: string
    hdpi: string
    xhdpi: string
    icon: string

    constructor(key: string, ext: string = '.jpg') {
      this.key = key
      this.url = key + '-xhdpi' + ext;
      this.cart = ShopCartConst.PREFIX_CART_IMAGE + key + '.png';
      this.ldpi = key + '-ldpi' + ext;
      this.mdpi = key + '-mdpi' + ext;
      this.hdpi = key + '-hdpi' + ext;
      this.xhdpi = key + '-xhdpi' + ext;
      this.icon = key + '-icon' + ext;
    }
  }

  export class ProductVariant {
    name: string
    upc: number
    sku: string
    size: string
    image: ProductImage
    constructor(name: string, upc: number, sku: string, size: string = null, imageKey: string = null) {
      this.name = name
      this.upc = upc
      this.sku = sku
      this.size = size
      this.image = imageKey ? new ProductImage(imageKey) : null
    }
  }

  export class Product {
    id: string
    name: string
    description: string
    price: number
    image: ProductImage
    variants: Array<ProductVariant>
    constructor(id: string, name: string, price: number, description: string = null, imageKey: string = null, variants: Array<ProductVariant> = null) {
      this.id = id
      this.name = name
      this.price = price
      this.description = description ? description : ""
      this.image = imageKey ? new ProductImage(imageKey) : null
      this.variants = variants ? variants : []
    }
  }
}