import * as dotenv from "dotenv";

dotenv.config();
const BASE_SERVER = process.env.BASE_SERVER || "";
const BASE_SERVER_ANIME = process.env.BASE_SERVER_ANIME || "";

export class StaticData {
  public static linkServerPopularPerPage: string = BASE_SERVER;
  public static linkServerNewPerPage: string = `${BASE_SERVER}/komik-terbaru/page/`;
  public static linkServerManhwaPerPage: string = `${BASE_SERVER}/manhwa/page/`;
  public static linkServerManhuaPerPage: string = `${BASE_SERVER}/manhua/page/`;
  public static linkServerMangaPerPage: string = `${BASE_SERVER}/manga/page/1`;
  public static linkServerSearchPerPage: string = `${BASE_SERVER}/?s=`;
  public static linkServerDetail: string = `${BASE_SERVER}/komik/`;
  public static linkServerChapter: string = `${BASE_SERVER}/`;

  //anime samehada
  public static linkServerNewAnimePage: string = BASE_SERVER_ANIME;
}
