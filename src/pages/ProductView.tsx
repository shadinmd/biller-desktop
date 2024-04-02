"use client"

import EditProduct from "../components/EditProduct"
import { Separator } from "../components/shadcn/Separator"
import YesNoModal from "../components/YesNoModal"
import api, { handleAxiosError } from "../lib/api"
import moment from "moment"
import { useNavigate, useParams } from "react-router-dom"
import { useCallback, useEffect, useState } from "react"
import { toast } from "sonner"
import ProductInterface from "../types/product.interface"
import { Icon } from "@iconify/react/dist/iconify.js"
import { ScaleLoader } from "react-spinners"
import { useStaff } from "../context/staffContext"

const ProductView = () => {

	const params = useParams()
	const [product, setProduct] = useState<ProductInterface>({
		_id: "",
		name: "",
		image: "",
		brand: "",
		listed: false,
		shop: "",
		price: 0,
		stock: 0,
		sold: 0,
		barcode: "",
		profit: 0,
		createdAt: new Date(),
	})

	const [loading, setLoading] = useState(true)
	const { staff } = useStaff()
	const navigate = useNavigate()

	useEffect(() => {
		api.get(`/product/${params.id}`)
			.then(({ data }) => {
				if (data.success) {
					setProduct(data.product)
				} else {
					toast.error(data.message)
				}
			})
			.catch(error => {
				handleAxiosError(error)
			})
			.finally(() => {
				setLoading(false)
			})
	}, [params])

	const deleteProduct = useCallback(async () => {
		try {
			const { data } = await api.delete(`/product/${product?._id}`)
			if (data.success) {
				navigate(-1)
				toast.success(data.message)
			} else {
				toast.error(data.message)
			}
		} catch (error) {
			handleAxiosError(error)
		}
	}, [product?._id])

	const toggleListing = useCallback(async () => {
		try {
			const { data } = await api.put(`/product/list/${product._id}`, { listed: !product.listed })

			if (data.success) {
				let temp = { ...product }
				temp.listed = product.listed ? false : true
				toast.success(data.message)
				setProduct(temp)
			} else {
				toast.error(data.message)
			}
		} catch (error) {
			handleAxiosError(error)
		}
	}, [product])

	if (loading) {
		return (
			<div className="flex items-center justify-center bg-white rounded-lg drop-shadow-lg w-full h-full">
				<ScaleLoader />
			</div>
		)
	}

	return (
		<div className="flex gap-5 flex-col w-full h-full">

			<div className="flex items-center gap-5 w-full h-56 ">

				<div className="flex items-center bg-white drop-shadow-lg rounded-lg w-full h-full">
					<div className="flex flex-col w-full h-full p-5">
						<p className="font-bold text-xl">{product?.name}</p>
					</div>
					<div className="flex flex-col gap-2 items-end w-full h-full p-5">
						<div className={`${product?.listed ? "bg-green-500" : "bg-red-500"} text-sm text-white rounded-lg px-4 py-1`}>
							{
								product.listed ?
									"Listed" :
									"Un-Listed"
							}
						</div>
						<p
							className="flex gap-1 items-center cursor-pointer text-sm text-custom-light-gray"
							onClick={async () => {
								navigator.clipboard.writeText(product?.barcode || "");
								toast.success("barcode copied")
							}}
						>
							<span>code: </span>
							{product?.barcode}
						</p>
					</div>
				</div>

				<div className="grid gap-5 grid-cols-2 grid-rows-2 h-full w-full">

					<div className="flex items-center justify-between p-4 bg-white rounded-lg drop-shadow-lg">
						<div>
							<p className="text-custom-light-gray">sold</p>
							<p className="font-bold">{product.sold}</p>
						</div>
						<div className="flex items-center justify-center bg-primary rounded-xl w-[40px] h-[40px]">
							<Icon icon={"material-symbols:contract"} className="text-white text-2xl" />
						</div>
					</div>

					<div className="flex items-center justify-between p-4 bg-white rounded-lg drop-shadow-lg">
						<div>
							<p className="text-custom-light-gray">profit</p>
							<p className="font-bold">{product.sold * product.profit}</p>
						</div>
						<div className="flex items-center justify-center bg-primary rounded-xl w-[40px] h-[40px]">
							<Icon icon={"material-symbols:contract"} className="text-white text-2xl" />
						</div>
					</div>


					<div className="flex items-center justify-between p-4 bg-white rounded-lg drop-shadow-lg">
						<div>
							<p className="text-custom-light-gray">stock</p>
							<p className="font-bold">{product.stock}</p>
						</div>
						<div className="flex items-center justify-center bg-primary rounded-xl w-[40px] h-[40px]">
							<Icon icon={"material-symbols:contract"} className="text-white text-2xl" />
						</div>
					</div>

					<div className="flex items-center justify-between p-4 bg-white rounded-lg drop-shadow-lg">
						<div>
							<p className="text-custom-light-gray">rate</p>
							<p className="font-bold">0</p>
						</div>
						<div className="flex items-center justify-center bg-primary rounded-xl w-[40px] h-[40px]">
							<Icon icon={"material-symbols:contract"} className="text-white text-2xl" />
						</div>
					</div>

				</div>
			</div>

			<div className="flex items-center gap-5 h-full w-full">

				<div className="flex flex-col w-80 p-5 bg-white drop-shadow-lg rounded-lg h-full">
					<div className="flex flex-col gap-2 h-full w-full">
						<div className="flex items-center justify-between">
							<p>Name:</p>
							<p>{product.name}</p>
						</div>
						<Separator className="bg-custom-light-gray w-full" orientation="horizontal" />

						<div className="flex items-center justify-between">
							<p>Price:</p>
							<p>{product.price}</p>
						</div>
						<Separator className="bg-custom-light-gray w-full" orientation="horizontal" />

						<div className="flex items-center justify-between">
							<p>stock:</p>
							<p>{product.stock}</p>
						</div>
						<Separator className="bg-custom-light-gray w-full" orientation="horizontal" />

						<div className="flex items-center justify-between">
							<p>profit:</p>
							<p>{product.profit}</p>
						</div>
						<Separator className="bg-custom-light-gray w-full" orientation="horizontal" />

						<div className="flex items-center justify-between">
							<p>created at:</p>
							<p>{moment(product?.createdAt).format("DD/MM/YYYY")}</p>
						</div>
						<Separator className="bg-custom-light-gray w-full" orientation="horizontal" />

					</div>
					{
						staff.manager && <div className="flex gap-2 items-center ">
							<button onClick={e => { e.preventDefault(); toggleListing() }} className="bg-primary text-white px-6 py-2 font-bold rounded-lg">
								{product.listed ? "Unlist" : "List"}
							</button>
							<EditProduct product={product} setProduct={setProduct}>
								<div className="bg-primary text-white px-6 py-2 font-bold rounded-lg">
									Edit
								</div>
							</EditProduct>
							<YesNoModal
								title="delete this product"
								description="are you sure you want to delete this product"
								onYes={deleteProduct}
								onNo={() => { }}
							>
								<div className="bg-red-500 text-white px-6 py-2 font-bold rounded-lg">
									Delete
								</div>
							</YesNoModal>
						</div>
					}

				</div>

				<div className="bg-white drop-shadow-lg rounded-lg w-full h-full">

				</div>

			</div>
		</div>
	)
}

export default ProductView


