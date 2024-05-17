import { Button, VStack } from "@chakra-ui/react";
import Image from "next/image";
import ReactHowler from "react-howler";
import { Howl, Howler } from "howler";

const sound = new Howl({
  src: ["/wav/fao.wav"],
});

const DummyBanner = () => {
  sound.play();
  return (
    <>
      <VStack gap={"8"} margin={"2"} marginTop={"16"}>
        <Image
          src="/jinnguuji_bakunyu.jpg"
          alt="ad-dummy"
          width={1100}
          height={1400}
        />
        <Button
          onClick={() => {
            window.location.href = "/jinguuji";
          }}
          marginTop={"8"}
          bg="yellow.400"
          textColor="white"
          fontSize="30px"
          w="200px"
          h="60px"
        >
          もどる
        </Button>
      </VStack>
    </>
  );
};

export default DummyBanner;
