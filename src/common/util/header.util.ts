export class HeaderUtil {
    static getToken(authorization: string) {
        return /Bearer\s(.+)/.exec(authorization)[1];
    }
}
