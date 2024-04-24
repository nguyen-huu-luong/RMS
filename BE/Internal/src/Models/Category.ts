import { DataTypes, Model } from "sequelize";
import Loader from "../Loaders";
import Product from "./Product";
class Category extends Model {
    public static associate() {
      Category.hasMany(Product, {
        foreignKey: {
          name: "categoryId",
          allowNull: false,
        },
        sourceKey: "id",
      });
    }
    getProducts: any
}
Category.init(
  {
      name: DataTypes.STRING,
      description: DataTypes.STRING,
      thumnails: DataTypes.STRING,
  },
  {
      sequelize: Loader.sequelize,
      modelName: 'Category',
  }
);
export default Category;
