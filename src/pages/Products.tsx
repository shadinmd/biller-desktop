"use client"

import { Separator } from "../components/shadcn/Separator"
import NewProduct from "../components/NewProduct"
import { useStaff } from "../context/staffContext"
import api, { handleAxiosError } from "../lib/api"
import { Icon } from "@iconify/react/dist/iconify.js"
import { Link } from "react-router-dom"
import { useEffect, useState } from "react"
import { ScaleLoader } from "react-spinners"
import { toast } from "sonner"
import ProductInterface from "../types/product.interface"

const Products = () => {

	const { staff } = useStaff()
	const [products, setProducts] = useState<ProductInterface[]>([])
	const [loading, setLoading] = useState(true)
	const [search, setSearch] = useState("")

	useEffect(() => {
		const fetchProducts = setTimeout(() => {
			if (staff.shop)
				api.get(`/product/shop/${staff.shop}?name=${search}`)
					.then(({ data }) => {
						if (data.success) {
							setProducts(data.products)
						} else {
							toast.error(data.message)
						}
					})
					.catch(error => {
						handleAxiosError(error)
					}).finally(() => {
						setLoading(false)
					})
		}, 500)

		return () => {
			clearTimeout(fetchProducts)
		}
	}, [staff.shop, search])

	const addProduct = (product: ProductInterface) => {
		setProducts(prev => [...prev, product])
	}

	if (loading) {
		return (
			<div className="flex items-center justify-center bg-white rounded-lg drop-shadow-lg w-full h-full">
				<ScaleLoader />
			</div>
		)
	}

	return (
		<div className="flex flex-col gap-5 items-start p-5 justify-center bg-white rounded-lg drop-shadow-lg w-full h-full">
			<div className="flex items-center justify-between w-full">
				<div className="flex items-cenetr gap-5">
					<p className="text-3xl font-bold">Products</p>
					<input
						value={search}
						onChange={e => setSearch(e.target.value)}
						placeholder="Name.."
						type="text"
						className="outline-none px-3 py-1 rounded-lg border-2"
					/>
				</div>
				{
					staff.manager && <NewProduct newProduct={addProduct} shopId={staff.shop}>
						<Icon icon={"mdi:plus"} className="text-green-500 text-3xl" />
					</NewProduct>
				}
			</div>
			<div className="flex flex-col items-center w-full h-full">
				<div className="w-full">
					<div className="flex text-custom-light-gray items-center w-full">
						<p className="w-full">name</p>
						<p className="w-full">price</p>
						<p className="w-full">stock</p>
						<p className="w-full">listed</p>
					</div>
					<Separator orientation="horizontal" className="w-full bg-custom-light-gray" />
				</div>
				{
					products.map((e, i) => (
						<Link
							key={i}
							to={`/products/${e._id}`}
							className="w-full"
						>
							<div className="flex items-center h-10 w-full">
								<p className="w-full">{e.name}</p>
								<p className="w-full">{e.price}</p>
								<p className="w-full">{e.stock}</p>
								<p className="w-full">{e.listed ? "listed" : "hidden"}</p>
							</div>
							<Separator orientation="horizontal" className="w-full bg-custom-light-gray" />
						</Link>
					))
				}
			</div>
		</div>
	)
}

export default Products

