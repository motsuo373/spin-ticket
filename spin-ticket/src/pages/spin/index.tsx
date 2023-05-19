import { Header } from "@/component/Header";
import { Roulette } from "@/component/Roulette";
import {
  Box,
  Button,
  Card,
  CardBody,
  Container,
  Flex,
  Modal,
  ModalBody,
  ModalContent,
  ModalHeader,
  ModalOverlay,
  Text,
  useDisclosure,
} from "@chakra-ui/react";
import { FC, useEffect, useState } from "react";
import { useRouter } from "next/router";
import axios from "axios";

export const Spin: FC = () => {
  const [isSpinning, setIsSpinning] = useState(false);
  const [isSpinEnd, setIsSpinEnd] = useState(false);
  const router = useRouter();

  const [fetchData, setFetchData] = useState<any>({});
  const { amount, link, targetNum } = fetchData;

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
      setFetchData(response.data);
    } catch (error) {
      console.error(error);
    }
  };
  const { isOpen, onOpen, onClose } = useDisclosure();

  return (
    <>
      <Header />
      {Object.keys(fetchData).length > 0 && (
        <Container
          maxW="container.xl"
          height={"calc(100vh - 82px)"}
          bgColor={"green.600"}
        >
          <Flex direction="column" alignItems="center" justifyContent="center">
            <Card bg="green.100" my={6}>
              <CardBody>
                <Text fontSize="md">
                  Amazonギフト券を当てよう！
                  <br />
                  ルーレットの停止した数字が当たりの金額になります。
                  <br />
                  Spinを押してね！
                </Text>
              </CardBody>
            </Card>

            <Roulette
              isSpinning={isSpinning}
              setIsSpinEnd={setIsSpinEnd}
              targetNum={targetNum}
            />
            <Button
              bgColor={"yellow.400"}
              textColor={"white"}
              fontSize={"30px"}
              width={"240px"}
              height={"100px"}
              margin={"auto"}
              mt={"8"}
              disabled={isSpinning}
              onClick={() => {
                setIsSpinning(true);
              }}
            >
              Spin!
            </Button>

            <Modal
              isOpen={isSpinEnd}
              onClose={onClose}
              size={"sm"}
              motionPreset="slideInBottom"
              isCentered
            >
              <ModalOverlay />
              <ModalContent>
                <ModalHeader>おめでとうございます！</ModalHeader>
                <ModalBody>
                  <Box
                    display={"flex"}
                    flexDirection={"column"}
                    alignItems={"center"}
                    justifyContent={"center"}
                  >
                    <Text fontSize="md">
                      Amazonギフト券<b>{amount}円分</b>をプレゼント！
                      <br />
                      参加いただきありがとうございました！
                      <br />
                      <br />
                      ※ボタンを押すとAmazonギフト券のページに移動します。
                    </Text>
                    <Button
                      colorScheme="yellow"
                      variant="outline"
                      my={"4"}
                      as="a"
                      href={link}
                    >
                      ギフト券をもらう
                    </Button>
                  </Box>
                </ModalBody>
              </ModalContent>
            </Modal>
          </Flex>
        </Container>
      )}
    </>
  );
};

export default Spin;
