import { Model, Table, Column, DataType } from "sequelize-typescript";

@Table({
  tableName: "collaterals",
})
export default class Collateral extends Model {
  @Column({
    type: DataType.INTEGER,
    primaryKey: true,
    autoIncrement: true,
    field: "id"
  })
  id?: number;

  @Column({
    type: DataType.STRING(255),
    field: "name"
  })
  name?: string;

  @Column({
    type: DataType.STRING(255),
    field: "address"
  })
  address?: string;

  @Column({
    type: DataType.INTEGER,
    field: "decimals"
  })
  decimals?: number;
}