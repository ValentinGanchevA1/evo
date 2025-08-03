import { io, Socket } from "socket.io-client";

export class SocketService {
  private static instance: SocketService;
  private static socket: Socket | null = null; // Make socket static

  private constructor() {
  } // Prevent instantiation outside

  public static getInstance(): SocketService {
    if (!SocketService.instance) {
      SocketService.instance = new SocketService();
    }
    return SocketService.instance;
  }

  public initialize(url: string): void {
    if (SocketService.socket) {
      console.warn("Socket is already initialized.");
      return;
    }
    SocketService.socket = io(url, {
      autoConnect: true,
      transports: ["websocket"]
    });

    SocketService.socket.on("connect", () => {
      console.log("Socket connected:", SocketService.socket?.id);
    });

    SocketService.socket.on("disconnect", () => {
      console.log("Socket disconnected");
    });
  }

  public static emit(event: string, data?: any): void {
    if (!SocketService.socket) {
      console.error("Socket not initialized.");
      return;
    }
    SocketService.socket.emit(event, data);
  }

  public disconnect(): void {
    if (SocketService.socket) {
      SocketService.socket.disconnect();
      SocketService.socket = null;
    }
  }

  public getSocket(): Socket | null {
    return SocketService.socket;
  }
}
