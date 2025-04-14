// types/postman-code-generators.d.ts
declare module 'postman-code-generators' {
  interface ConvertOptions {
    indentCount?: number;
    indentType?: 'Space' | 'Tab';
    trimRequestBody?: boolean;
    followRedirect?: boolean;
    requestTimeout?: number;
    multiLine?: boolean;
  }

  export function convert(
    language: string,
    variant: string,
    request: unknown,
    options: ConvertOptions,
    callback: (error: Error | null, snippet: string) => void,
  ): void;
}

// Дополнительные типы для postman-collection
declare module 'postman-collection' {
  interface RequestBodyDefinition {
    mode: 'raw' | 'formdata' | 'urlencoded' | 'file' | 'graphql';
    raw?: string;
    options?: {
      raw?: {
        language?: string;
      };
    };
  }

  // Правильное объявление класса Request
  interface Request {
    url: string;
    method: string;
    header?: Array<{ key: string; value: string }>;
    body?: RequestBodyDefinition;
  }

  // Объявляем конструктор отдельно
  const Request: {
    new (options: {
      url: string;
      method: string;
      header?: Array<{ key: string; value: string }>;
      body?: RequestBodyDefinition;
    }): Request;
  };
}
