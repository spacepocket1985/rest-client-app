export function interpolateVariables(str: string, vars: { key: string; value: string }[]): string {
  return str.replace(/{{(.*?)}}/g, (_, key) => {
    const found = vars.find((v) => v.key === key.trim());

    return found ? found.value : `{{${key}}}`;
  });
}
