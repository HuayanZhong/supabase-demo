import { Params } from "nestjs-pino";

export const pinoConfig: Params = {
  pinoHttp: {
    transport: {
      target: "pino-pretty",
      options: {
        colorize: true,
        levelFirst: true,
        customColors: "trace:gray,debug:cyan,info:green,warn:yellow,error:red,fatal:magenta",
        translateTime: "SYS:HH:MM:ss",
        ignore: "pid,hostname",
      },
    },
    // 精简请求日志，仅保留 method、url、statusCode、响应时间
    serializers: {
      req: (req) => ({
        method: req.method,
        url: req.url,
      }),
      res: (res) => ({
        statusCode: res.statusCode,
      }),
      err: (err) => ({
        type: err.type,
        message: err.message,
      }),
    },
  },
};
