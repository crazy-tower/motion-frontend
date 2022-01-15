import { io, Socket } from 'socket.io-client';

// Type

// https://socket.io/docs/v4/typescript/
type ServerToClientEvents = {
  'someone is laughing': () => void;
};

type ClientToServerEvents = {
  'someone is laughing': (roomID: string) => void;
};

const socket: Socket<ServerToClientEvents, ClientToServerEvents> = io(
  process.env.NEXT_PUBLIC_SIGNALING_SERVER
).connect();

const setupFaceMotionSocket = async () => {
  socket.on('someone is laughing', () => {
    console.log('who laughing!!');
    alert('someone is laughing');
  });
};

export { setupFaceMotionSocket };
