import { Model, DataTypes } from 'sequelize';
import sequelize from '../config/database';
import { getImageUrl } from '../utils/imageUrl';

interface ProductAttributes {
  id?: string;
  name: string;
  description: string;
  image: string;
  price: number;
  createdAt?: Date;
  updatedAt?: Date;
}

class Product extends Model<ProductAttributes> implements ProductAttributes {
  public id!: string;
  public name!: string;
  public description!: string;
  public image!: string;
  public price!: number;
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;

  get imageUrl(): string {
    return getImageUrl(this.image);
  }

  toJSON() {
    const values = { ...this.get() };
    return {
      ...values,
      image: this.imageUrl,
    };
  }
}

Product.init(
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    image: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    price: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
    },
  },
  {
    sequelize,
    modelName: 'Product',
  }
);

export default Product;
