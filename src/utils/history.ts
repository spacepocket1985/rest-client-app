export interface IHistoryRequest {
  method: string;
  url: string;
  requestDate: string;
}

export const addHistoryData = (data: Record<string, string>) => {
  const key = 'history-requests';
  const currentData = localStorage.getItem(key) || '';
  const requestDate = Date.now();
  const newData =
    currentData.length ? [...JSON.parse(currentData), { ...data, requestDate }] : [{ ...data, requestDate }];

  localStorage.setItem(key, JSON.stringify(newData));
};
