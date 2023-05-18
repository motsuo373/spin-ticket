import { Header } from "@/component/Header";
import { Roulette } from "@/component/Roulette";
import {
  Box,
  Button,
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
  const { amount, link } = fetchData;

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
            <Text fontSize="xl">
              本日は参加いただきありがとうございます！
              <br />
            </Text>
            <Roulette isSpinning={isSpinning} setIsSpinEnd={setIsSpinEnd} />
            <Button
              bgColor={"yellow.400"}
              textColor={"white"}
              fontSize={"40px"}
              boxSize={"150px"}
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
                  <Box>
                    <Text fontSize="md">
                      Amazonギフト券{amount}円分を
                      <br />
                      プレゼントいたします！
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
