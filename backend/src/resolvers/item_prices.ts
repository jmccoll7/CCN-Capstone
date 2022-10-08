import { ItemPrices, ItemPricesArgs } from "../entities/ItemPrices";
import { Arg, Args, Mutation, Query, Resolver } from "type-graphql";

// Define queries and updates for item_prices table
@Resolver()
export class ItemPricesResolver {
  // Return all item_prices rows
  @Query(() => [ItemPrices])
  get_item_prices(): Promise<ItemPrices[]> {
    return ItemPrices.find();
  }

  // Return all item_prices rows for a specific item_code
  @Query(() => [ItemPrices])
  get_prices_by_item(
    @Arg("item_code") item_code: number
  ): Promise<ItemPrices[]> {
    return ItemPrices.findBy({ item_code });
  }

  // Add new item_prices row
  @Mutation(() => ItemPrices)
  async post_item_price(
    @Args()
    { item_code, project, quantity, unit_bid_price, contractor }: ItemPricesArgs
  ): Promise<ItemPrices> {
    const post = ItemPrices.create({
      item_code,
      project,
      quantity,
      unit_bid_price,
      contractor,
    }).save();

    return post;
  }
}
