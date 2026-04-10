import { createServer } from "node:http";
import { createSchema, createYoga } from "graphql-yoga";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET || "dev_secret_change_me";

// In-memory store
const users = new Map(); // username -> { username, passwordHash }

const typeDefs = /* GraphQL */ `
  type User {
    username: String!
  }

  type AuthPayload {
    token: String!
    username: String!
  }

  type Mutation {
    register(username: String!, password: String!): AuthPayload!
    login(username: String!, password: String!): AuthPayload!
  }

  type Query {
    me: User
  }
`;

const resolvers = {
  Query: {
    me: (_, __, context) => {
      const user = getUser(context);
      if (!user) return null;
      return { username: user.username };
    },
  },
  Mutation: {
    register: async (_, { username, password }) => {
      if (users.has(username)) {
        throw new Error("Username already taken");
      }
      if (username.length < 2) {
        throw new Error("Username must be at least 2 characters");
      }
      if (password.length < 6) {
        throw new Error("Password must be at least 6 characters");
      }
      const passwordHash = await bcrypt.hash(password, 10);
      users.set(username, { username, passwordHash });
      const token = jwt.sign({ username }, JWT_SECRET, { expiresIn: "7d" });
      return { token, username };
    },
    login: async (_, { username, password }) => {
      const user = users.get(username);
      if (!user) throw new Error("Invalid username or password");
      const valid = await bcrypt.compare(password, user.passwordHash);
      if (!valid) throw new Error("Invalid username or password");
      const token = jwt.sign({ username }, JWT_SECRET, { expiresIn: "7d" });
      return { token, username };
    },
  },
};

function getUser(context) {
  const auth = context.request.headers.get("authorization") || "";
  const token = auth.replace("Bearer ", "");
  if (!token) return null;
  try {
    return jwt.verify(token, JWT_SECRET);
  } catch {
    return null;
  }
}

const yoga = createYoga({
  schema: createSchema({ typeDefs, resolvers }),
  context: ({ request }) => ({ request }),
  cors: {
    origin: "*",
    methods: ["GET", "POST", "OPTIONS"],
  },
  maskedErrors: {
    maskError(err) {
      // Pass through known user-facing errors without logging
      return err;
    },
    isDev: false,
  },
  logging: {
    debug: () => {},
    info: () => {},
    warn: () => {},
    error: () => {},
  },
});

const server = createServer(yoga);
const PORT = process.env.PORT || 4000;
server.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}/graphql`);
});
