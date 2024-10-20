import { useCategories } from "@/queries/categories";

export function CategoriesPage() {
  const categories = useCategories();

  if (categories.isLoading) return <div>Loading...</div>;

  return (
    <div>
      {categories.data?.map((category) => (
        <div key={category.id}>{category.name}</div>
      ))}
    </div>
  );
}
