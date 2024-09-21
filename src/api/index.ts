import axios, {
  AxiosInstance,
  AxiosRequestConfig,
  AxiosResponse,
  AxiosError,
  InternalAxiosRequestConfig,
} from 'axios';

const instance: AxiosInstance = axios.create({
  timeout: 1000 * 60,
  withCredentials: true,
  validateStatus: (status) => status >= 200 && status < 400,
  baseURL: '', // 接口地址
});

// 添加请求拦截器
instance.interceptors.request.use(
  (config: InternalAxiosRequestConfig<unknown>) => {
    // 在发送请求之前做些什么，例如添加全局的 token 验证
    return config;
  },
  (error: AxiosError) => {
    // 对请求错误做些什么
    return Promise.reject(error);
  }
);

// 添加响应拦截器
instance.interceptors.response.use(
  (response: AxiosResponse) => {
    // 对响应数据做点什么，例如处理全局的错误码
    return response;
  },
  (error: AxiosError) => {
    // 对响应错误做点什么
    return Promise.reject(error);
  }
);

// 封装请求方法
const request = <T = unknown>(config: AxiosRequestConfig): Promise<T> => {
  return new Promise((resolve, reject) => {
    instance(config)
      .then((response) => {
        resolve(response.data);
      })
      .catch((error: AxiosError) => {
        reject(error);
      });
  });
};

// 为每个 HTTP 方法创建对应的函数
const api = {
  get: <T = unknown>(url: string, config?: AxiosRequestConfig): Promise<T> =>
    request<T>({ method: 'GET', url, ...config }),
  post: <T = unknown>(url: string, data?: unknown, config?: AxiosRequestConfig): Promise<T> =>
    request<T>({ method: 'POST', url, data, ...config }),
  // 可以继续添加其他 HTTP 方法的封装
};

export default api;
