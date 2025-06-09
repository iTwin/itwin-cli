/*---------------------------------------------------------------------------------------------
* Copyright (c) Bentley Systems, Incorporated. All rights reserved.
* See LICENSE.md in the project root for license terms and full copyright notice.
*--------------------------------------------------------------------------------------------*/

export interface RequestOption {
  apiPath: string;
  apiVersionHeader?: string;
  body?: unknown;
  headers?: Record<string, string>;
  method: 'DELETE' | 'GET' | 'PATCH' | 'POST' | 'PUT';
  query?: Query[];
}

export interface Query {
  key: string,
  value?: number | string
}

export class ITwinPlatformApiClient {
  private readonly _apiVersionHeader: string | undefined;
  private readonly _authToken: string;
  private readonly _iTwinPlatformApiBasePath: string;

  constructor(url: string, token: string, apiVersionHeader?: string | undefined)
  {
      this._iTwinPlatformApiBasePath = url;
      this._authToken = token;
      this._apiVersionHeader = apiVersionHeader;
  }
  
  public async sendRequest<T>(options: RequestOption): Promise<T> {
    const result = await this.request<T>(options);
    if(!result)
    {
      throw new Error("Request returned undefined object");
    }

    return result;
  }

  public async sendRequestNoResponse(options: RequestOption): Promise<void> {
    await this.request(options);
  }

  private getHeadersList(headers: Record<string, string> | undefined, apiVersionHeader: string | undefined) {
    const headersList: Record<string, string> = {
      // eslint-disable-next-line @typescript-eslint/naming-convention
      Authorization: this._authToken,
      'Content-Type': 'application/json',
      ...headers
    };

    if (apiVersionHeader) {
      headersList.Accept = apiVersionHeader;
    }
    else if (this._apiVersionHeader) {
      headersList.Accept = this._apiVersionHeader;
    }

    return headersList;
  }

  private getQueryString(query?: Query[]) : string {
    if(!query || query.length === 0) {
      return '';
    }

    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    const queryString = query.filter(entry => Boolean(entry.value)).map(entry => `${encodeURIComponent(entry.key)}=${encodeURIComponent(entry.value!)}`).join('&');
    if(queryString.length === 0)
    {
      return '';
    }

    return `?${queryString}`;

  }


  private async request<T>(options: RequestOption): Promise<T | undefined> {
    const { apiPath, apiVersionHeader, body, headers, method, query } = options;

    const queryString = this.getQueryString(query);
    const headersList: Record<string, string> = this.getHeadersList(headers, apiVersionHeader);

    const fetchOptions : RequestInit = {
      body: body ? JSON.stringify(body) : undefined,
      headers: headersList,
      method
    };

    const response = await fetch(`${this._iTwinPlatformApiBasePath}/${apiPath}${queryString}`, fetchOptions);
    
    if(!response.ok)
    {
      const errorResponseData = await response.json();
      try
      {
        const typedError = errorResponseData as ErrorResponse;
        const stringifiedError = JSON.stringify(typedError.error, Object.getOwnPropertyNames(typedError.error));
        throw new Error(`HTTP error! status: ${response.status}. Response data: ${stringifiedError}`);
      } catch {
        throw new Error(`HTTP error! ${JSON.stringify(errorResponseData)}`);
      }
    }

    if(response.headers.get('content-type') === null) {
      return;
    }

    const responseData = await response.json();
    return responseData as T;
  }
}

interface ErrorResponse {
  error: Error
}

interface Error {
  code: string,
  details: ErrorDetails[]
  message: string,
}

interface ErrorDetails {
  code: string
  message: string,
  target: string
}