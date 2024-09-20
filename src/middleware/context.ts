import {errors} from "config/errors";
import {Request} from "express";
import {decode, Jwt as JWT, verify} from "jsonwebtoken";
import {ScopeRole} from "root/src/enum/ScopeRoleEnum";
import {client} from "root/src/db/db";
import {Session} from "@prisma/client";
import {ApiError} from "utils/apiError";

interface Payload extends Pick<JWT, "payload"> {
  id: string;
  subject: string;
  scopes: ScopeRole[];
}

interface Jwt extends JWT {
  payload: Payload;
}

export interface Context {
  user: {
    id: string;
    payload: Payload;
    token: string;
  };
}

const userScopeValidation = async (
  token: string,
  scopes: string[],
  payload: Payload,
) => {

  // if (!scopes.includes(ScopeRole.USER)) {
  //   return false;
  // }
  //
  // // If we are asking for admin scopes, then make sure payload has admin scopes
  //
  // if (scopes.includes(ScopeRole.ADMIN) && !payload.scopes.includes(ScopeRole.ADMIN)) {
  //   return false;
  // }

  const session: Session | null = await client().session.findUnique({where: {token}});

  if (!session) {
    return false;
  }

  return true;

};

export async function expressAuthentication(
  {headers}: Request,
  securityName: string,
  scopes: string[],
) {
  if (securityName === "bearerAuth") {
    if (!headers.authorization) {
      throw new ApiError(errors.UNAUTHENTICATED);
    }

    const tokenString = headers.authorization?.split(" ")[1];
    try {
      verify(tokenString, process.env.JWT_PUBLIC_KEY || "", {
        algorithms: ["HS256"],
      });
    } catch {
      throw new ApiError(errors.UNAUTHENTICATED);
    }

    const token = decode(tokenString, {
      complete: true,
    }) as Jwt | null;

    if (!token) {
      throw new ApiError(errors.UNAUTHENTICATED);
    }

    // const validations = await Promise.all([
    //   userScopeValidation(headers.authorization, scopes, token.payload),
    // ]);
    //
    // if (!validations.includes(true)) {
    //   throw new ApiError(errors.UNAUTHENTICATED);
    // }

    return {
      id: token.payload.id,
      payload: token.payload,
      token: headers.authorization,
    };
  }

  return {};
}
