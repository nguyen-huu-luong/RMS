const categoriesData = [
    "Pizza",
    "Drink",
];

const descriptions = {
    Pizza: "Pizza là món ăn làm nên thương hiệu nhà hàng, được chế biến bởi những đầu bếp đến từ nước Ý.",
    Drink: "Các loại nước uống luôn được đảm bảo có nguồn gốc tự nhiên và nguyên liệu nhập trong ngày.",
};

export const mockCategories = categoriesData.map((name: string) => ({
    name: name,
    description: (descriptions as Record<string, string>)[name],
    createdAt: new Date(),
    updatedAt: new Date(),
}));
