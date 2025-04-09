export const encodeBase64 = (data: string): string => {
  return Buffer.from(data).toString('base64');
};

export const decodeBase64 = (encodedData: string): string => {
  return Buffer.from(encodedData, 'base64').toString('utf-8');
};
