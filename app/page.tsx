import { createClient } from "@/utils/supabase/server";
import { Plus } from "lucide-react";
import { cookies } from "next/headers";
import Link from "next/link";

export default async function ProductsPage() {
  const cookieStore = await cookies();
  const supabase = createClient(cookieStore);

  const { data: products, error } = await supabase
    .from("products")
    .select("id, title, price, image_path")
    .order("created_at", { ascending: false });

  if (error) {
    return (
      <main className="min-h-screen bg-white dark:bg-gray-950 p-8">
        <p className="text-red-500">
          Failed to load products: {error.message}
        </p>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-gray-50 dark:bg-gray-950 p-8">
      <div className="flex justify-between">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-8">
          Products


        </h1>

        <Link className="bg-white text-black p-3 rounded-md flex gap-4" href="/admin">
          <Plus />
          Add new Products</Link>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {products?.map((product) => {
          const { data: imgData } = supabase.storage
            .from("product-images")
            .getPublicUrl(product.image_path);

          return (
            <div
              key={product.id}
              className="group rounded-2xl bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 overflow-hidden hover:shadow-xl dark:hover:shadow-black/40 transition-all duration-200"
            >
              <div className="overflow-hidden bg-gray-100 dark:bg-gray-800">
                <img
                  src={imgData.publicUrl}
                  alt={product.title}
                  className="w-full h-52 object-cover group-hover:scale-105 transition-transform duration-300"
                />
              </div>
              <div className="p-4">
                <h2 className="font-semibold text-gray-900 dark:text-white truncate">
                  {product.title}
                </h2>
                <p className="text-emerald-600 dark:text-emerald-400 font-bold mt-1">
                  ${Number(product.price).toFixed(2)}
                </p>
              </div>
            </div>
          );
        })}
      </div>
    </main >
  );
}
