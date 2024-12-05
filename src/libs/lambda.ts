import { TokenValidation } from "@functions/_shared/security/TokenValidation"
import middy from "@middy/core"
import middyJsonBodyParser from "@middy/http-json-body-parser"

export const middyfy = (handler) => {
  return middy(handler).use(TokenValidation()).use(middyJsonBodyParser())
}