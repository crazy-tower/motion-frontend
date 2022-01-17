import {
  Button,
  Drawer,
  DrawerBody,
  DrawerCloseButton,
  DrawerContent,
  DrawerFooter,
  DrawerHeader,
  DrawerOverlay,
  Input,
  useDisclosure,
} from '@chakra-ui/react';
import { faComment } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import type { NextPage } from 'next';
import { useEffect, useRef, useState } from 'react';
import { chatInit, chatMessage } from '../../../utils/webRTC';
import Text from './Text';

type Props = {
  roomID: string;
};

const ChatButton: NextPage<Props> = ({ roomID }) => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const btnRef = useRef<HTMLButtonElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const [messages, setMessages] = useState<string[]>([]);

  useEffect(() => {
    chatInit(setMessages);
  }, []);

  return (
    <>
      <button ref={btnRef} onClick={onOpen}>
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            width: '50px',
            height: '50px',
            borderRadius: '10px',
            background: 'rgba(0, 0, 0, 0.56)',
            color: 'white',
          }}
        >
          <FontAwesomeIcon icon={faComment} size="lg" />
        </div>
        <Text>Chat</Text>
      </button>
      <Drawer
        isOpen={isOpen}
        placement="right"
        onClose={onClose}
        finalFocusRef={btnRef}
        size="xs"
      >
        <DrawerOverlay />
        <DrawerContent>
          <DrawerCloseButton />
          <DrawerHeader>Chat</DrawerHeader>

          <DrawerBody>
            {messages.map((message, i) => (
              <p key={i}>{message}</p>
            ))}
          </DrawerBody>

          <DrawerFooter>
            <Input
              ref={inputRef}
              variant="flushed"
              placeholder="Send a chat message."
              marginRight={2}
            />
            {/* <Textarea
            placeholder="Send a chat message."
            variant="flushed"
            marginRight={2}
          /> */}
            <Button
              colorScheme="blue"
              onClick={() => {
                if (inputRef.current) {
                  chatMessage(roomID, inputRef.current.value);
                  inputRef.current.value = '';
                }
              }}
            >
              Send
            </Button>
          </DrawerFooter>
        </DrawerContent>
      </Drawer>
    </>
  );
};

export default ChatButton;
