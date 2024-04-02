interface ProductInterface {
	_id: string
	name: string
	image: string
	brand: string
	listed: boolean
	shop: string
	price: number
	stock: number
	sold: number
	barcode:string 
	profit: number
	createdAt: Date
}

export default ProductInterface
