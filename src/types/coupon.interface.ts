interface CouponInterface {
	code: string
	claimed: boolean
	shop: string
	discount: number
	billUsedIn: string
	expireAt: Date
}

export default CouponInterface
