interface PlanInterface {
	_id: string,
	name: string
	description: string
	price: number
	discount: number
	active: boolean
	features: string[]
	productLimit: number
	billLimit: number
}

export default PlanInterface
