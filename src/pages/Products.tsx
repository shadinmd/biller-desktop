import NewProduct from "../components/NewProduct"
import { Icon } from "@iconify/react"
import { toast } from "sonner"
import api, { handleAxiosError } from "../lib/api"
import { useEffect, useState } from "react"
import ProductInterface from "../types/product.interface"
import { ScaleLoader } from "react-spinners"
import { useStaff } from "../context/staffContext"
import Select from "../components/Select"
import { Link } from "react-router-dom"

const Products = () => {

	const [products, setProducts] = useState<ProductInterface[]>([])
	const [loading, setLoading] = useState(true)
	const [search, setSearch] = useState("")
	const [sort, setSort] = useState("sort")
	const [filter, setFilter] = useState("filter")
	const { staff } = useStaff()

	useEffect(() => {
		const timeout = setTimeout(() => {
			if (staff.shop)
				api.get(`/product/shop/${staff.shop._id}?name=${search}&sort=${sort}&filter=${filter}`)
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
			clearTimeout(timeout)
		}
	}, [staff.shop, search, sort, filter])

	const newProduct = (product: ProductInterface) => {
		setProducts(products => [...products, product])
	}

	if (loading) {
		return (
			<div className="flex items-center justify-center bg-white rounded-lg w-full h-full">
				<ScaleLoader />
			</div>
		)
	}

	return (
		<div className='flex flex-col gap-1 py-3 px-5 w-full h-full'>
			<div className='flex justify-between'>
				<div className="flex items-center gap-1">
					<p className='flex items-center justify-center text-xl font-bold bg-white drop-shadow-lg rounded-lg p-2'>Products</p>
					<input
						value={search}
						onChange={e => setSearch(e.target.value)}
						placeholder="Search.."
						type="text"
						className="rounded-lg py-2 px-3 drop-shadow-lg outline-none font-semibold"
					/>
					<Select
						selected={sort}
						onSelect={setSort}
						items={["sort", "price high to low", "price low to high"]}
					/>
					<Select
						selected={filter}
						onSelect={setFilter}
						items={["filter", "listed", "unlisted"]}
					/>
				</div>
				<NewProduct className="bg-white rounded-lg drop-shadow-lg" shopId={staff.shop._id || ""} newProduct={newProduct} api={api}>
					<Icon icon={"mdi:plus"} className='text-4xl text-green-500' />
				</NewProduct>
			</div>
			<div className="flex flex-col gap-1">
				{products.map((e, i) => (
					<Link
						to={`/products/${e?._id}`}
						key={i}
						className="flex items-center w-full rounded-lg bg-white drop-shadow-lg p-2 font-semibold"
					>
						<div className="pr-2">
							<div className={`flex items-center justify-center size-10 rounded-lg`}>
								{
									e.image ?
										<img src={e.image} className="h-full w-full" alt="" /> :
										<Icon icon={"mdi:image"} className="text-gray-500 text-4xl" />
								}
							</div>
						</div>
						<p className="w-full">{e.name}</p>
						<p className="w-full">pirce: {e.price}</p>
						<p className="w-full">stock: {e.stock}</p>
					</Link>
				))}
			</div>
		</div >

	)
}

export default Products



