interface ResponseFormat {
  success: boolean;
  message: string;
  result?: any;
}

const response = ({ success, message }: ResponseFormat, result?: any): ResponseFormat => {
  return {
    success: success,
    message: message,
    result: result
  };
};

export default response;
