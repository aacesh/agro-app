export enum ENV {
  DEVELOPMENT = "development",
  STAGING = "staging",
  PRODUCTION = "production"
}

export function hasEnvVar() {
  switch (process.env.NODE_ENV) {
    case 'development':
    case 'staging':
    case 'production':
      return true
    default:
      return false
  }
}

export function getEnvFile() {
  if (process.env.NODE_ENV == 'development') {
    return '.env.dev'
  } else if (process.env.NODE_ENV == 'staging') {
    return '.env.stag'
  } else if (process.env.NODE_ENV == 'production') {
    return '.env.prod'
  } else {
    throw new Error(`NODE_ENV(${process.env.NODE_ENV}) is not defined`)
  }
}

export function getCurrentEnv() {
  return process.env.NODE_ENV
}
