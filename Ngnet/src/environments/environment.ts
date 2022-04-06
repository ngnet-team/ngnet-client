export const environment = {
  production: false,
  app: {
    name: "Ngnet",
    domain: "http://localhost:4200/"
  },
  servers: {
    auth: "http://localhost:7000/",
    care: "http://localhost:5000/",
    social: "http://localhost:3000/",
  },
  lang: {
    title: 'language',
    default: "en",
    en: "en",
    bg: "bg"
  },
  pagination: {
    countsPerPage: 5,
  }
};