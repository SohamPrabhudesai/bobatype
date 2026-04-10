const BACKEND_URL = "http://localhost:4000/graphql";

async function gql(query, variables = {}) {
  const token = localStorage.getItem("token");
  const res = await fetch(BACKEND_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
    body: JSON.stringify({ query, variables }),
  });
  const { data, errors } = await res.json();
  if (errors?.length) throw new Error(errors[0].message);
  return data;
}

export async function register(username, password) {
  const data = await gql(
    `mutation Register($username: String!, $password: String!) {
      register(username: $username, password: $password) { token username }
    }`,
    { username, password }
  );
  localStorage.setItem("token", data.register.token);
  localStorage.setItem("username", data.register.username);
  return data.register;
}

export async function login(username, password) {
  const data = await gql(
    `mutation Login($username: String!, $password: String!) {
      login(username: $username, password: $password) { token username }
    }`,
    { username, password }
  );
  localStorage.setItem("token", data.login.token);
  localStorage.setItem("username", data.login.username);
  return data.login;
}

export function logout() {
  localStorage.removeItem("token");
  localStorage.removeItem("username");
}

export function getUsername() {
  return localStorage.getItem("username");
}

export function isLoggedIn() {
  return !!localStorage.getItem("token");
}
