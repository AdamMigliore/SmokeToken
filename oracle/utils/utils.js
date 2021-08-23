function isDevelopment() {
  const { ENVIRONMENT } = process.env;

  return ENVIRONMENT.trim().toUpperCase() === "DEVELOPMENT";
}

exports.isDevelopment = isDevelopment;
