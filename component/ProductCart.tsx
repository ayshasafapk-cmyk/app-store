


interface ProductCartProps {

    id: number;
    image_url: string;
    title: string;
    price: number;
}

export function ProductCart({ id, image_url, title, price }: ProductCartProps) {

    return (
        <div
            key={id}
            className="group rounded-2xl bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 overflow-hidden hover:shadow-xl dark:hover:shadow-black/40 transition-all duration-200"
        >
            <div className="overflow-hidden bg-gray-100 dark:bg-gray-800">
                <img
                    src={image_url}
                    alt={title}
                    className="w-full h-52 object-cover group-hover:scale-105 transition-transform duration-300"
                />
            </div>
            <div className="p-4">
                <h2 className="font-semibold text-gray-900 dark:text-white truncate">
                    {title}
                </h2>
                <p className="text-emerald-600 dark:text-emerald-400 font-bold mt-1">
                    ${Number(price).toFixed(2)}
                </p>
            </div>
        </div>



    )
}