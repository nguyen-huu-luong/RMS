'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    const categoriesData = [
      "Pizza",
      "Drink",
      "Fruits",
      "Hotdog",
      "Snacks",
      "Burger",
      "Veggies",
    ];

    const descriptions = {
      "Pizza": "Pizza là món ăn làm nên thương hiệu nhà hàng, được chế biến bởi những đầu bếp đến từ nước Ý.",
      "Drink": "Các loại nước uống luôn được đảm bảo có nguồn gốc tự nhiên và nguyên liệu nhập trong ngày.",
      "Fruits": "Các loại trái cây được chế biến dựa trên tiêu chí giữ lại hương vị tự nhiên nhất của nguyên liệu.",
      "Hotdog": "Nhà cung cấp rất nhiều loại bánh Hotdog với hương vị phù hợp cho mọi độ tuổi.",
      "Snacks": "Các món snack luôn nằm trong top tìm kiếm của nhà hàng.",
      "Burger": "Với công thức nước sốt độc quyền, nhà hàng luôn nằm trong top cửa hàng có món bánh burger bán chạy nhất.",
      "Veggies": "Nhà hàng cung cấp rất đa dạng các món ăn từ rau củ."
    }

    const categories = categoriesData.map((name) => ({
      name: name,
      description: descriptions[name], // You can customize the description
      createdAt: new Date(),
      updatedAt: new Date(),
    }));

    await queryInterface.bulkInsert('Categories', categories, {});
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('Categories', null, {});
  },
};