import { FullShopInterface } from "./shop.interface"

interface StaffInterface {
	_id: string
	username: string
	password: string
	shop: string
	manager: boolean
	blocked: boolean
	createdAt: Date
}

export interface FullStaffInterface {
	_id: string
	username: string
	password: string
	shop: FullShopInterface
	manager: boolean
	blocked: boolean
	createdAt: Date
}

export default StaffInterface
