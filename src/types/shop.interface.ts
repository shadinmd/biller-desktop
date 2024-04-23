import VendorInterface from "./vendor.interface"

interface ShopInterface {
	_id: string,
	name: string
	shop_id: string
	shop_secret: string
	vendor: string
	location: string
	active: boolean
	image: string,
	createdAt: Date
}


export interface FullShopInterface {
	_id: string,
	name: string
	shop_id: string
	shop_secret: string
	vendor: VendorInterface
	location: string
	active: boolean
	image: string,
	createdAt: Date
}


export default ShopInterface
