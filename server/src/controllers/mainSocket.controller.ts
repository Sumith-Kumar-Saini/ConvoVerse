import { log } from "console";
import { Socket } from "socket.io";
import { AppError } from "../utils/AppError";

interface AiMsg {
  chatId: string;
  content: string;
}

export default function (socket: Socket) {
  socket.on("ai-msg", (data?: AiMsg) => {
    if (!data)
      return socket.emit(
        "error",
        new AppError("Wrong format given, expected", 400)
      );
    const { chatId, content } = data;
  });

  socket.on("disconnect", () => {
    // some further operations
    log("user disconnected", socket.id);
  });
}
