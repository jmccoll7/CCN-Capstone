import { ItemPrices, ItemPricesArgs } from "../entities/ItemPrices";
import { MyContext } from "../types";
import { Arg, Args, Ctx, Mutation, Query, Resolver } from "type-graphql";

// Define queries and updates for item_prices table
@Resolver()
export class ItemPricesResolver {

  // Return all item_prices rows
  @Query(() => [ItemPrices])
  get_item_prices(@Ctx() {em}: MyContext): Promise<ItemPrices[]> {
    return em.find(ItemPrices, {});
  }

  // Return all item_prices rows for a specific item_code
  @Query(() => [ItemPrices])
  get_prices_by_item(
    @Arg("item_code") item_code: number,
    @Ctx() {em}: MyContext): Promise<ItemPrices[]> {
      return em.find(ItemPrices, { item_code });
    }

  // Add new item_prices row
  @Mutation(() => ItemPrices)
  async post_item_price(
    @Args() {item_code, project, quantity, unit_bid_price, contractor
    }:ItemPricesArgs,
    @Ctx() { em }: MyContext): Promise<ItemPrices> {
      const post = em.create(ItemPrices, {
        item_code, project, quantity, unit_bid_price, contractor
      });
      await em.persistAndFlush(post);
      return post
    }
}