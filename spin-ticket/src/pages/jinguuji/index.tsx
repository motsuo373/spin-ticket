import { Header } from "@/component/Header";
import Layout from "@/component/Layout";
import { Roulette } from "@/component/Roulette";
import Seo from "@/component/Seo";
import {
  Box,
  Button,
  Flex,
  Text,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  useDisclosure,
  VStack,
  Image,
} from "@chakra-ui/react";
import Link from "next/link";
import { FC, useEffect, useState } from "react";

// Define a custom type for fetchData
type FetchDataType = {
  amount: number;
  link: string;
  targetNum: number;
  isUsed: boolean;
};

export const fortuneTicket: FC = () => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  // Use the defined type for fetchData state
  const [fetchData, setFetchData] = useState<FetchDataType>({
    amount: 0,
    link: "",
    targetNum: 0,
    isUsed: false,
  });
  const { amount, link, targetNum, isUsed } = fetchData;

  useEffect(() => {
    onOpen();
  }, []);
  const [isSpinning, setIsSpinning] = useState(false);
  const [isSpinEnd, setIsSpinEnd] = useState(false);

  return (
    <>
      <Seo
        pagePath="/jinguuji"
        pageTitle={"神宮寺生誕祭"}
        pageDescription={
          "KINGS 神宮寺生誕祭~お寺参り編withもつお~ ラッキカード用サイトです。"
        }
        pageImg={"../../../public/target.png"}
        pageImgWidth={1280}
        pageImgHeight={960}
      />
      <Header />
      <Box
        w="100vw"
        h="88vh"
        bgImage="url('/background.webp')"
        bgPosition="center"
        bgRepeat="no-repeat"
        bgSize="cover"
        display="flex"
        alignItems="center"
        justifyContent="center"
      >
        <VStack>
          <Roulette
            isSpinning={isSpinning}
            setIsSpinEnd={setIsSpinEnd}
            targetNum={targetNum}
          />
          <Button
            onClick={() => {
              setIsSpinning(true);
            }}
            disabled={isSpinEnd}
            bg="yellow.400"
            textColor="white"
            fontSize="30px"
            w="200px"
            h="60px"
          >
            Spin!
          </Button>

          <Link href="/jinguuji/banner">
            <Image
              src="/ad-dummy.png"
              alt="ad-dummy"
              position="absolute"
              bottom="0"
              left="0"
              w="100%"
              // maxH="20vh" // 画像の高さを調整
              maxW="500px"
              objectFit="cover"
            />
          </Link>
        </VStack>
      </Box>
      <Modal isOpen={isOpen} onClose={onClose} size={"xl"}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>ナイスラッキーカード！</ModalHeader>
          <ModalBody>
            <img src="jinnguuji_money.png" alt="Jinnguuji" />
            <p>このサイトは音声が流れます。</p>
            <p>音をONにして進んでください。</p>
          </ModalBody>
          <ModalFooter>
            <Button onClick={onClose} colorScheme="teal">
              OK
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
};

export default fortuneTicket;
