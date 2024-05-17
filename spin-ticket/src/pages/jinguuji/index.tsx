import { Header } from "@/component/Header";
import { BellIcon } from "@chakra-ui/icons";
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
import axios from "axios";
import { FC, useEffect, useState, useRef } from "react";
import { Howl, Howler } from "howler";
import { useRouter } from "next/router";

// Define a custom type for fetchData
type FetchDataType = {
  amount: number;
  link: string;
  targetNum: number;
  isUsed: boolean;
};

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

export const fortuneTicket: FC = () => {
  const firstModal = useDisclosure();
  const finishModal = useDisclosure();
  // Use the defined type for fetchData state
  const [fetchData, setFetchData] = useState<FetchDataType>({
    amount: 0,
    link: "",
    targetNum: 0,
    isUsed: false,
  });
  const [isSpinning, setIsSpinning] = useState(false);
  const [isSpinEnd, setIsSpinEnd] = useState(false);
  const router = useRouter();
  const backgroundMusicRef = useRef<Howl | null>(null);
  const zannenSound = new Howl({
    src: ["/wav/zannen.wav"],
  });
  const omedetoSound = new Howl({
    src: ["/wav/omedeto.wav"],
  });
  const ooatariSound = new Howl({
    src: ["/wav/ooatari.wav"],
  });

  const { amount, link, targetNum, isUsed } = fetchData;
  const { order } = router.query;

  const playSE = (amount: number) => {
    if (amount === 0) {
      zannenSound.play();
    } else if (amount === 1000) {
      omedetoSound.play();
    } else {
      ooatariSound.play();
    }
  };

  useEffect(() => {
    if (!isUsed) {
      firstModal.onOpen();
    } else {
      playSE(amount);
    }
  }, [isUsed]);

  useEffect(() => {
    if (order) {
      getUser(order);
    }
  }, [order]);

  useEffect(() => {
    if (isSpinEnd && backgroundMusicRef.current) {
      if (typeof order === "string") {
        updateDocumentField(order, "isUsed", true);
        updateDocumentField(order, "updateAt", new Date());
      } else {
        console.error("Invalid order value:", order);
      }
      backgroundMusicRef.current.pause();
      playSE(amount);
    }
  }, [isSpinEnd]);

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

  const handleMusicPlay = () => {
    if (!backgroundMusicRef.current) {
      backgroundMusicRef.current = new Howl({
        src: ["/wav/mokugyo.wav"],
        loop: true, // ループを有効にする
        volume: 0.5, // 音量を半分にする
      });
    }
    backgroundMusicRef.current.play();
  };

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
        h="100vh"
        minH="567px"
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
            <Image src="/ad-dummy.png" alt="ad-dummy" marginTop={"20"} />
          </Link>
        </VStack>
      </Box>
      <Modal
        isOpen={!isUsed && firstModal.isOpen}
        onClose={firstModal.onClose}
        size={"xl"}
      >
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>ナイスラッキーカード！</ModalHeader>
          <ModalBody>
            <img src="jinnguuji_money.png" alt="Jinnguuji" />
            <Text fontSize="md" marginTop={"4"}>
              このサイトは<b>音声</b>が流れます。
              <br />
              音をONにして進んでください。
            </Text>
          </ModalBody>
          <ModalFooter>
            <Button
              onClick={() => {
                firstModal.onClose();
                handleMusicPlay();
              }}
              colorScheme="yellow"
              textColor={"white"}
            >
              音をONにした！
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
      <Modal
        isOpen={isSpinEnd || isUsed}
        onClose={finishModal.onClose}
        size={"xl"}
      >
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>
            {amount === 0 ? "オーマイガー！" : "おめでとうございます！"}
          </ModalHeader>
          <ModalBody>
            {amount === 0 ? (
              <>
                <img src="fire.png" alt="Jinnguuji" />
                <Text fontSize="md" marginTop={"4"}>
                  ショットプレゼント！！！
                </Text>
              </>
            ) : (
              <>
                <img src="jinnguuji_drink.jpg" alt="Jinnguuji" />
                <Text fontSize="md" marginTop={"4"}>
                  Amazonギフト券<b>{amount}円分</b>をプレゼント！
                  <br />
                  <br />
                  なるべく早くAmazonギフト券を受け取ってください！
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
              </>
            )}
          </ModalBody>
        </ModalContent>
      </Modal>
    </>
  );
};

export default fortuneTicket;
