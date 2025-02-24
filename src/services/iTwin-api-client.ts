/* eslint-disable unicorn/filename-case */

/*---------------------------------------------------------------------------------------------
* Copyright (c) Bentley Systems, Incorporated. All rights reserved.
* See LICENSE.md in the project root for license terms and full copyright notice.
*--------------------------------------------------------------------------------------------*/

export interface RequestOptions<T> extends RequestOption {
  body?: T;
}

export interface RequestOption {
  apiPath: string;
  apiVersionHeader?: string;
  headers?: Record<string, string>;
  method: 'DELETE' | 'GET' | 'PATCH' | 'POST' | 'PUT';
  query?: Query[];
}

export interface Query {
  key: string,
  value?: number | string
}

export class ITwinPlatformApiClient {
  private readonly apiVersionHeader: string | undefined;
  private readonly authToken: string;
  private readonly iTwinPlatformApiBasePath: string;

  constructor(url: string, token: string, apiVersionHeader?: string | undefined)
  {
      this.iTwinPlatformApiBasePath = url;
      this.authToken = token;
      this.apiVersionHeader = apiVersionHeader;
  }

  getQueryString(query?: Query[]) : string {
    if(!query || query.length === 0) {
      return '';
    }

    const queryString = query.filter(entry => Boolean(entry.value)).map(entry => `${encodeURIComponent(entry.key)}=${encodeURIComponent(entry.value!)}`).join('&');
    if(queryString.length === 0)
    {
      return '';
    }

    return `?${queryString}`;
  }

  async sendRequest<T>(options: RequestOption): Promise<T> {
    const result = await this.send<T, undefined>({...options}, true);
    if(!result)
    {
      throw new Error("Request returned undefined object");
    }

    return result;
  }

  async sendRequestNoResponse(options: RequestOption) : Promise<void> {
    await this.send(options, false);
  }

  async sendRequestWithBody<T, T1>(options: RequestOptions<T1>): Promise<T> {
    const result = await this.send<T, T1>(options, true);
    if(!result)
    {
      throw new Error("Request returned undefined object");
    }

    return result;
  }

  async sendRequestWithBodyNoResponse<T>(options: RequestOptions<T>) : Promise<void> {
    await this.send(options, false);
  }

  private async  send<T,T1>(options : RequestOptions<T1>, returnContent: boolean) : Promise<T | undefined> {
    const { apiPath, apiVersionHeader, body, headers, method, query } = options;

    const queryString = this.getQueryString(query);

    const headersList : Record<string, string> = {
      'Authorization': this.authToken,
      'Content-Type': 'application/json',
      ...headers
    };

    if(apiVersionHeader)
    {
      headersList.Accept = apiVersionHeader;
    }
    else if(this.apiVersionHeader)
    {
      headersList.Accept = this.apiVersionHeader;
    }

    const fetchOptions = {
      body: body ? JSON.stringify(body) : undefined,
      headers: headersList,
      method,
    };

    const response = await fetch(`${this.iTwinPlatformApiBasePath}/${apiPath}${queryString}`, fetchOptions);
    
    if(!response.ok)
    {
      const responseData = await response.json();
      try
      {
        const typedError = responseData as ErrorResponse;
        const stringifiedError = JSON.stringify(typedError.error, Object.getOwnPropertyNames(typedError.error));
        throw new Error(`HTTP error! status: ${response.status}. Response data: ${stringifiedError}`);
      } catch {
        throw new Error(`HTTP error! ${JSON.stringify(responseData)}`);
      }
    }

    if(!returnContent)
    {
      return undefined;
    }
    
    const responseData = await response.json();
    return responseData as T;
  }
}

type ErrorResponse = {
  error: Error
}

type Error = {
  code: string,
  details: ErrorDetails[]
  message: string,
}

type ErrorDetails = {
  code: string
  message: string,
  target: string
}