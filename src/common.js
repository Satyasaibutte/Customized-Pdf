import { message } from "antd";

export default function alertMessage(messageToShow, type, duration = 2) {
  switch (type) {
    case "warning": {
      message.warning(messageToShow, duration);
      return;
    }
    case "error": {
      message.error(messageToShow, duration);
      return;
    }
    case "info": {
      message.info(messageToShow, duration);
      return;
    }
    default: {
      message.success(messageToShow, duration);
    }
  }
}