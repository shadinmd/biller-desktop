interface VendorInterface {
	_id?: string,
	username: string
	password: string
	email: string
	activePlan: string
	planExpiry: Date
	active: boolean
	blocked: boolean
	deleted: boolean
}

export default VendorInterface
