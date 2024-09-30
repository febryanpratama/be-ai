import {LoginRequest, LoginResponse, LoginV2Request, PasswordV2Request, RegisterRequest} from "root/src/entity/AuthEntity";
import {client} from "root/src/db/db";
import {errors} from "config/errors";
import {generateToken} from "utils/GenerateToken";
import HastUtils from "utils/HastUtils";
import {ApiError} from "utils/apiError";
import { token } from "morgan";

class AuthServices {
  public login = async (body: LoginRequest): Promise<LoginResponse> => {
    const user = await client().user.findFirst({
      where: {
        username: body.username
      }
    });

    const password = await HastUtils.comparePassword(body.password, user?.password ?? "");

    if (!password) {
      throw new ApiError(errors.USER_NOT_FOUND);
    }

    if (!user) {
      throw new ApiError(errors.USER_NOT_FOUND);
    }

    const token = generateToken(user);

    try {
      await client().session.create({
        data: {
          token: token.token,
          userId: user.id,
        }
      });
    } catch (e) {
      throw new ApiError(errors.TOKEN_REQUIRED);
    }

    // return token.token;
    return {
      token: token.token,
      user: {
        active: user.active,
        name: user.name ?? "",
        address: user.address ?? "",
        email: user.email ?? "",
        avatar: user.avatar ?? "",
        phone: user.phone ?? "",
        username: user.username ?? "",
      }
    }
  }
  public register = async (body: RegisterRequest): Promise<LoginResponse> => {
    try {
      const password = await HastUtils.hashPassword(body.password)
      const idUser = await client().user.create({
        data: {
          username: body.username,
          email: body.email,
          password: password,
          role: "user"
        }
      });

      const user = await client().user.findUnique({
        where: {
          id: idUser.id
        }
      });

      if (!user) {
        throw new ApiError(errors.USER_NOT_FOUND);
      }

      const token = generateToken(user);

      try {
        await client().session.create({
          data: {
            token: token.token,
            userId: idUser.id,
          }
        });
      } catch (e) {
        throw new ApiError(errors.TOKEN_REQUIRED);
      }

      return {
        token: token.token,
        user: {
          active: user.active,
          name: user.name ?? "",
          address: user.address ?? "",
          email: user.email ?? "",
          avatar: user.avatar ?? "",
          phone: user.phone ?? "",
          username: user.username ?? "",
        }
      }

    } catch (e) {
      throw new ApiError(errors.INTERNAL_SERVER_ERROR);
    }
  }

  public checkValue = async (key: string, value: string): Promise<any> => {
    const user = await client().user.findFirst({
      where: {
        [key]: value
      }
    });

    if (user) {
      return {
        status: true
      }
    }

    return {
      status: false
    };
  }


  // V2
  public loginV2 = async (body: LoginV2Request): Promise<any> => {
    const user = await client().user.findFirst({
      where: {
        email: body.email
      }
    });

    if (!user) {
      const registerV2 = await this.registerV2(body);

      const createOtp = await client().otp.create({
        data: {
          userId: registerV2.user.id,
          code: 1111,
        }
      });

      return {
        token: "",
        user: {
          active: registerV2.user.active,
          name: registerV2.user.name ?? "",
          address: registerV2.user.address ?? "",
          email: registerV2.user.email ?? "",
          avatar: registerV2.user.avatar ?? "",
          phone: registerV2.user.phone ?? "",
          username: registerV2.user.username ?? "",
          is_password: false,
        }
      }

    }

    if(user.password === null){
        const createToken = await client().otp.create({
          data: {
            userId: user.id,
            code: 1111,
          }
        });

        return {
          token: "",
          user: {
            active: user.active,
            name: user.name ?? "",
            address: user.address ?? "",
            email: user.email ?? "",
            avatar: user.avatar ?? "",
            phone: user.phone ?? "",
            username: user.username ?? "",
            is_password: false  
        }
      }

    }else{
      return {
        token: "",
        user: {
          active: user.active,
          name: user.name ?? "",
          address: user.address ?? "",
          email: user.email ?? "",
          avatar: user.avatar ?? "",
          phone: user.phone ?? "",
          username: user.username ?? "",
          is_password: true
        }
      }
    }

  }

  public registerV2 = async (body: any): Promise<any> => {
    try {
      const idUser = await client().user.create({
        data: {
          email: body.email,
          password: null,
          role: "user"
        }
      });

      const user = await client().user.findUnique({
        where: {
          id: idUser.id
        }
      });

      if (!user) {
        throw new ApiError(errors.USER_NOT_FOUND);
      }

      const token = generateToken(user);

      try {
        await client().session.create({
          data: {
            token: token.token,
            userId: idUser.id,
          }
        });
      } catch (e) {
        throw new ApiError(errors.TOKEN_REQUIRED);
      }

      return {
        token: token.token,
        user: {
          id: user.id,
          active: user.active,
          name: user.name ?? "",
          address: user.address ?? "",
          email: user.email ?? "",
          avatar: user.avatar ?? "",
          phone: user.phone ?? "",
          username: user.username ?? "",
        }
      }

    } catch (e) {
      throw new ApiError(errors.INTERNAL_SERVER_ERROR);
    }
  }

  public passwordV2 = async (body: PasswordV2Request): Promise<any> => {
    const user = await client().user.findFirst({
      where: {
        email: body.email
      }
    });

    // User not found
    if (!user) {
      throw new ApiError(errors.USER_NOT_FOUND);
    }

    // user not set password
    const checkProfile = await client().profileUser.findFirst({
      where: {
        userId: user.id
      }
    });

    if(checkProfile){
      const checkConversation = await client().conversation.findFirst({
        where: {
          userId: user.id
        }
      })

      if(checkConversation){
        const deleteDetail = await client().detailConversation.deleteMany({
          where: {
            conversationId: checkConversation.id
          }
        })

        const deleteConversation = await client().conversation.delete({
          where: {
            id: checkConversation.id
          }
        })
      }
    }


    if(!user.password){
      const checkOtp = await client().otp.findFirst({
        where: {
          userId: user.id,
          code: Number(body.otp)
        }
      });

      if (!checkOtp) {
        throw new ApiError(errors.OTP_NOT_VALID);
      }

      const token = generateToken(user);

      try {
        await client().session.create({
          data: {
            token: token.token,
            userId: user.id,
          }
        });
      } catch (e) {
        throw new ApiError(errors.TOKEN_REQUIRED);
      }

      return {
        token: token.token,
        user: {
          active: user.active,
          name: user.name ?? "",
          address: user.address ?? "",
          email: user.email ?? "",
          avatar: user.avatar ?? "",
          phone: user.phone ?? "",
          username: user.username ?? "",
          is_profile: checkProfile ? true : false
        }
      }

    }

    if(user.password){
      const password = await HastUtils.comparePassword(body.password ?? "", user?.password ?? "");

      if (!password) {
        throw new ApiError(errors.USER_NOT_FOUND);
      }

      const token = generateToken(user);

      try {
        await client().session.create({
          data: {
            token: token.token,
            userId: user.id,
          }
        });
      } catch (e) {
        throw new ApiError(errors.TOKEN_REQUIRED);
      }

      return {
        token: token.token,
        user: {
          active: user.active,
          name: user.name ?? "",
          address: user.address ?? "",
          email: user.email ?? "",
          avatar: user.avatar ?? "",
          phone: user.phone ?? "",
          username: user.username ?? "",
          is_profile: checkProfile ? true : false
        }
      }
    }

   
  }
}

export default new AuthServices();
