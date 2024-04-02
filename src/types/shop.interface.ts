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

export default ShopInterface
