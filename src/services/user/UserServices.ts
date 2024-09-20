import { client } from "root/src/db/db";

class UserServices {
    public async getUser(id: number) {

    }

    public async checkUser(id:number){
        const user = client().user.findFirst({
            where: {
                id
            }
        });

        return user;

    }
}

export default new UserServices();
