import { Model, Table, Column, DataType } from "sequelize-typescript";

@Table({
  tableName: "masterlps",
})
export default class MasterLP extends Model {
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
    field: "desc"
  })
  address?: string;

  @Column({
    type: DataType.INTEGER,
    field: "decimals"
  })
  decimals?: number;
}