import pino from "pino";

const logger = pino({
  transport: {
    target: "pino-pretty",
    options: { colorize: true },
  },
});

logger.info("hello world");

const child = logger.child({ a: "property" });
child.info("hello child!");
