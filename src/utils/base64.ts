export const encodeBase64 = (data: string): string => {
  return Buffer.from(data).toString('base64').replace(/=/g, '');
};

export const decodeBase64 = (encodedData: string): string => {
  const pad = encodedData.length % 4;
  const paddedData = pad ? encodedData + '='.repeat(4 - pad) : encodedData;

  return Buffer.from(paddedData, 'base64').toString('utf-8');
};

export const spaceInBase64 = 'IA';
