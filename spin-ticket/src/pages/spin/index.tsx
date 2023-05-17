import { Header } from "@/component/Header";
import { Roulette } from "@/component/Roulette";
import { Button, Container } from "@chakra-ui/react";
import { FC, useEffect, useState } from "react";
import { useRouter } from "next/router";
import axios from "axios";

export const Spin: FC = () => {
  const [isFetchData, setIsFetchData] = useState(false);
  const [isSpinning, setIsSpinning] = useState(false);
  const [isSpinEnd, setIsSpinEnd] = useState(false);
  const router = useRouter();

  const { order } = router.query;

  useEffect(() => {
    if (order) {
      getUser(order);
    }
  }, [order]);

  const getUser = async (documentId: any) => {
    try {
      const response = await axios.get("/api/user", {
        params: {
          documentId,
        },
      });
      setIsFetchData(true);
      console.log(response.data);
    } catch (error) {
      setIsFetchData(false);
      console.error(error);
    }
  };

  return (
    <>
      <Header />
      {isFetchData && (
        <Container
          maxW="container.lg"
          maxH="calc(100vh)"
          bgColor={"yellow.100"}
        >
          <Roulette isSpinning={isSpinning} />
          <Button
            color={"blue.300"}
            margin={"auto"}
            onClick={() => {
              setIsSpinning(true);
            }}
          >
            回す。
          </Button>
        </Container>
      )}
    </>
  );
};

export default Spin;
