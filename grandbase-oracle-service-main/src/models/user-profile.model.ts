import { Model, Table, Column, DataType } from "sequelize-typescript";

@Table({
  tableName: "users",
})
export default class UserProfile extends Model {
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
  desc?: string;

  @Column({
    type: DataType.STRING(255),
    field: "nonce"
  })
  nonce?: string;

  @Column({
    type: DataType.STRING(255),
    field: "wallet"
  })
  wallet?: string;

  @Column({
    type: DataType.BOOLEAN,
    field: "blocked"
  })
  blocked?: boolean;
}