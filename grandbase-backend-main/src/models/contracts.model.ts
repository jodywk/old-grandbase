import { Model, Table, Column, DataType } from "sequelize-typescript";

@Table({
  tableName: "contracts",
})
export default class Contract extends Model {
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
}