interface ResponseFormat {
  message: string;
  result?: any;
}

const response = ({ message }: ResponseFormat, result?: any): ResponseFormat => {
  return {
    message: message,
    result: result
  };
};

export default response;
