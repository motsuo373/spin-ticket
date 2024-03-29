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
import Head from "next/head";
import Layout from "@/component/Layout";

// Define a custom type for fetchData
type FetchDataType = {
  amount: number;
  link: string;
  targetNum: number;
  isUsed: boolean;
};

export const Spin: FC = () => {
  const [isSpinning, setIsSpinning] = useState(false);
  const [isSpinEnd, setIsSpinEnd] = useState(false);
  const router = useRouter();

  // Use the defined type for fetchData state
  const [fetchData, setFetchData] = useState<FetchDataType>({
    amount: 0,
    link: "",
    targetNum: 0,
    isUsed: false,
  });
  const { amount, link, targetNum, isUsed } = fetchData;

  const { order } = router.query;

  useEffect(() => {
    if (order) {
      getUser(order);
    }
  }, [order]);

  useEffect(() => {
    if (isSpinEnd) {
      if (typeof order === "string") {
        updateDocumentField(order, "isUsed", true);
        updateDocumentField(order, "updateAt", new Date());
      } else {
        console.error("Invalid order value:", order);
      }
    }
  }, [isSpinEnd]);

  async function updateDocumentField<T>(
    documentId: string,
    field: string,
    value: T
  ) {
    try {
      const response = await fetch(`/api/user?documentId=${documentId}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ field, value }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      return;
    } catch (error) {
      console.error("Error updating document field:", error);
    }
  }

  const getUser = async (documentId: string | string[]) => {
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
    <Layout>
      <Head>
        {/* 以下の<style>タグを追加 */}
        <style>{`
          body {
            background-color: rgba(47,133,90, 1);
            margin: 0;
            box-sizing: border-box;
          }
        `}</style>
      </Head>
      <Header />
      {Object.keys(fetchData).length > 0 && (
        <Container maxW="container.xl" height={"100vh"} bgColor={"green.600"}>
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
              width={"200px"}
              height={"60px"}
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
              isOpen={isSpinEnd || isUsed}
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
                      本日は参加いただきありがとうございました！
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
    </Layout>
  );
};

export default Spin;
