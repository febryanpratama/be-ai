
enum Method {
  POST = "POST",
  GET = "GET",
  PUT = "PUT",
  PATCH = "PATCH",
  DELETE = "DELETE",
  HEAD = "HEAD",
}


const BASE_URL_TRIPAY = process.env.TRIPAY_URL;
const API_KEY_TRIPAY = process.env.API_KEY;


const header = async (): Promise<HeadersInit | undefined> => {

  return {
    Authorization: `Bearer ${API_KEY_TRIPAY}`,
    "Content-Type": "application/json",
  };
};


const fetchData = async(
  path: string,
  body: Record<string, any>,
  method: Method,
): Promise<any> => {
  const headers = await header();

  const fetchOptions: RequestInit = {
    method: method,
    headers: headers,
  };

  if (method !== Method.GET && method !== Method.HEAD) {
    fetchOptions.body = JSON.stringify(body);
  }

  return fetch(BASE_URL_TRIPAY+path, fetchOptions)
    .then(async (res) => {
      console.debug("response status", res.status);
      const [respJson] = await Promise.all([res.json()]);

      if (res.status === 200 || res.status === 201) {
        console.debug("response body", respJson);

        return {
          message: respJson.message ?? "Success",
          statusCode: res.status,
          data: respJson,
        };
      } else if (res.status === 400) {
        throw Error(respJson.message);
      } else {
        throw Error(respJson.message);

      }
    })
    .catch((error: any) => {
      console.debug("error", error.message);

      return {
        message: error.message,
        statusCode: error.status,
        data: null,
      };
    });
}

export const postFetchData = async (
  path: string,
  body: Record<string, any>,
): Promise<any> => {
  const resp = await fetchData(path, body, Method.POST);

  return {
    data: resp.data,
    message: resp.message,
    statusCode: resp.statusCode,
  };
};

export const getFetchData = async (
  path: string,
  body: Record<string, any>,
): Promise<any> => {
  const resp = await fetchData(path, body, Method.GET);

  // console.log("Response Config", resp.data)
  return {
    data: resp.data,
    message: resp.message,
    statusCode: resp.statusCode,
  };
};

export const putFetchData = async (
  path: string,
  body: Record<string, any>,
): Promise<any> => {
  const resp = await fetchData(path, body, Method.PUT);

  return {
    data: resp.data,
    message: resp.message,
    statusCode: resp.statusCode,
  };
};

export const patchFetchData = async (
  path: string,
  body: Record<string, any>,
): Promise<any> => {
  const resp = await fetchData(path, body, Method.PATCH);

  return {
    data: resp.data,
    message: resp.message,
    statusCode: resp.statusCode,
  };
};

export const deleteFetchData = async (
  path: string,
  body: Record<string, any>,
): Promise<any> => {
  const resp = await fetchData(path, body, Method.DELETE);

  return {
    data: resp.data,
    message: resp.message,
    statusCode: resp.statusCode,
  };
};
