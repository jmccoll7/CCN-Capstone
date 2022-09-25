import { Entity, PrimaryKey, Property } from "@mikro-orm/core";


@Entity()
export class ItemPrices {

  @PrimaryKey({ type: "int" })
  itemCode!: number;

  @Property({ type: "text" })
  project!: string;

  @Property({ type: "decimal" })
  quantity!: number;

  @Property({ type: "decimal" })
  unitBidPrice!: number;

  @Property({ type: "text" })
  contractor!: string;

  @Property({ type: "date" })
  createdAt? = new Date();

  @Property({ type: "date", onUpdate: () => new Date() })
  updatedAt? = new Date();

}