import { Box } from "@chakra-ui/react";
import { NavBar } from "../components/NavBar";
import { createUrqlClient } from "../utils/createUrqlClient";
import { withUrqlClient } from "next-urql";
import { useGetItemPricesQuery } from "../generated/graphql";

const Index = () => {
  const [{ data }] = useGetItemPricesQuery();
  return (
    <>
      <NavBar />
      <Box fontSize={30} mt={10} textAlign={"center"}>
        TXDOT Analysis Tool
      </Box>
      <br />
      <Box textAlign={"center"}>Placeholder Text</Box>
      {!data ? (
        <div>loading...</div>
      ) : (
        data.get_item_prices.map((p) => (
          <Box
            textAlign={"center"}
            key={(p.item_code, p.project, p.contractor)}
          >
            {p.item_code} --- {p.project} --- {p.contractor} --- Bid Price:{" "}
            {p.unit_bid_price}
          </Box>
        ))
      )}
    </>
  );
};
export default withUrqlClient(createUrqlClient)(Index);
