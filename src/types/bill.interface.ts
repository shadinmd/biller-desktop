interface BillInterface {
	_id: string
	staff: string
	shop: string
	products: string[]
	total: number
	discount: number
	totalAtfterDiscount: number
	createdAt: Date
}

export default BillInterface
