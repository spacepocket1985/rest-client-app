export interface IHistoryRequest {
  method: string;
  url: string;
  link: string;
}

export const addHistoryData = (data: IHistoryRequest) => {
  const key = 'history-requests';
  const currentData = localStorage.getItem(key) || '';

  const newData = currentData.length ? [...JSON.parse(currentData), { ...data }] : [{ ...data }];

  localStorage.setItem(key, JSON.stringify(newData));
};
