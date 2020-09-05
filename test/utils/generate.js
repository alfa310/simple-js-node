import faker from "faker";

export function buildBook(overrides) {
  return {
    _id: faker.random.alphaNumeric(12),
    title: faker.name.title(),
    content: faker.lorem.lines(2),
    createdAt: faker.date.recent().toUTCString(),
    updatedAt: faker.date.recent().toUTCString(),
    ...overrides,
  };
}

export function buildInputBook(overrides) {
  return {
    title: faker.name.title(),
    content: faker.lorem.lines(2),
    ...overrides,
  };
}

export function buildLogger(overrides) {
  return {
    info: jest.fn().mockName("logger.info"),
    error: jest.fn().mockName("logger.error"),
    ...overrides,
  };
}

export function buildBookPort(overrides) {
  return {
    create: jest.fn().mockName("bookPort.create"),
    getAll: jest.fn().mockName("bookPort.getAll"),
    ...overrides,
  };
}

export function buildPorts(overrides) {
  return {
    bookPort: buildBookPort(),
    ...overrides,
  };
}

export function buildContext(overrides) {
  return {
    ports: buildPorts(),
    logger: buildLogger(),
    ...overrides,
  };
}
