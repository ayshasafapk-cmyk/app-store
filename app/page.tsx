import { createClient } from "@/utils/supabase/server";
import { Plus } from "lucide-react";
import { cookies } from "next/headers";
import Link from "next/link";
import { ProductCart } from "@/component/ProductCart";

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
            <ProductCart
              id={product.id}
              image_url={imgData.publicUrl}
              title={product.title}
              price={product.price}
            />

          );
        })}
      </div>
    </main >
  );
}
