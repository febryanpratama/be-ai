import axios from "axios";
import cheerio from "cheerio";
import * as dotenv from "dotenv";
import {
  AnimeData,
  DetailAnime,
  DetailEpisodeAnime,
  DetailsDescription,
  Episode,
  VideoUrl
} from "root/src/entity/AnimeEntity";

dotenv.config();
const BASE_SERVER_ANIME = process.env.BASE_SERVER_ANIME || "";

class IntegrationAnimeSamehada {

  public async getAnime(url: string): Promise<AnimeData[]> {
    try {

      const response = await axios.get(url);
      const $ = cheerio.load(response.data);
      const data: AnimeData[] = [];

      $(".bsx").each((i, el) => {
        const judul = $(el).find(".tt h2").text().trim();
        const urlAnime = $(el).find("a").attr("href");
        const urlGambar = $(el).find(".limit img").attr("src");

        if (judul && urlAnime && urlGambar) {
          const id = urlAnime.replace(`${BASE_SERVER_ANIME}/`, "").replace("/", "");
          data.push({
            title: judul,
            urlImage: urlGambar,
            id
          });
        }
      });

      return data;
    } catch (error) {
      console.error(error);
      throw new Error("Error fetching data from server");
    }
  }

  public async getDetailEpisode(url: string): Promise<DetailEpisodeAnime> {
    try {

      const response = await axios.get(url);
      const $ = cheerio.load(response.data);
      const episodes: Episode[] = [];
      const videoData: VideoUrl = {} as VideoUrl;

      $(".episodelist ul li").each((i, el) => {
        const judul = $(el).find(".playinfo h4").text().trim();
        const urlEpisode = $(el).find("a").attr("href");
        const urlGambar = $(el).find(".thumbnel img").attr("src");
        const tanggalRilis = $(el).find(".playinfo span").text().trim();

        if (judul && urlEpisode && urlGambar && tanggalRilis) {
          const id = urlEpisode.replace(`${BASE_SERVER_ANIME}/`, "").replace("/", "");
          episodes.push({
            title: judul,
            id,
            releaseDate: tanggalRilis,
          });
        }
      });

      const iframeSrc = $("#videocontainer iframe").attr("src") || $("#embed_holder iframe").attr("src");
      if (iframeSrc) {
        videoData.urlVideo = iframeSrc;
      }

      const title = $(".title-section h1").text().trim();

      return {
        episodes,
        videoData,
        title: title,
      };

    } catch (error) {
      console.error(error);
      throw new Error("Error fetching data from server");
    }
  }

  public async search(url: string): Promise<AnimeData[]> {
    try {

      const response = await axios.get(url);
      const $ = cheerio.load(response.data);
      const data: AnimeData[] = [];

      $(".bsx").each((i, el) => {
        const judul = $(el).find(".tt h2").text().trim();
        const urlAnime = $(el).find("a").attr("href");
        const urlGambar = $(el).find(".limit img").attr("src");

        if (judul && urlAnime && urlGambar) {
          const id = urlAnime.replace(`${BASE_SERVER_ANIME}/`, "");
          data.push({
            title: judul,
            urlImage: urlGambar,
            id
          });
        }
      });

      return data;
    } catch (error) {
      console.error(error);
      throw new Error("Error fetching data from server");
    }
  }

  public async getDetailAnime(url: string): Promise<DetailAnime> {
    try {

      const response = await axios.get(url);
      const $ = cheerio.load(response.data);
      const data: DetailAnime = {} as DetailAnime;

      let desc: string = ""

      $(".entry-content p").each((index, element) => {
        desc += $(element).text() + " ";
      });

      const result: DetailsDescription = {
        title: $("h1.entry-title").text().trim(),
        desc,
        genres: $(".genxed a").map((i, el) => $(el).text().trim()).get() as string[],
        release: $(".spe span").eq(2).text().split(":")[1].trim(),
        type: $(".spe span").eq(5).text().split(":")[1].trim(),
        director: $(".spe span a").eq(2).text().trim(),
        season: $(".spe span a").eq(1).text().trim(),
        studio: $(".spe span a").first().text().trim(),
        rating: $(".rating strong").text().trim(),
        status: $(".spe span").first().text().split(":")[1].trim(),
      };

      const episodes: Episode[] = [];

      $(".eplister ul li").each((index, element) => {
        const link = $(element).find("a").attr("href");
        const id = link?.replace(`${BASE_SERVER_ANIME}/`, "").replace("/", "") ?? "";

        episodes.push({
          title: $(element).find(".epl-title").text().trim(),
          id: id,
          releaseDate: $(element).find(".epl-date").text().trim()
        });
      });

      data.details = result;
      data.episodes = episodes;
      data.videoData = {
        urlVideo: null
      }

      return data;
    } catch (error) {
      console.error(error);
      throw new Error("Error fetching data from server");
    }
  }

  public async genre(url: string): Promise<AnimeData[]> {
    try {

      const response = await axios.get(url);
      const $ = cheerio.load(response.data);
      const data: AnimeData[] = [];

      $(".bsx").each((i, el) => {
        const judul = $(el).find(".tt h2").text().trim();
        const urlAnime = $(el).find("a").attr("href");
        const urlGambar = $(el).find(".limit img").attr("src");

        if (judul && urlAnime && urlGambar) {
          const id = urlAnime.replace(`${BASE_SERVER_ANIME}/`, "");
          data.push({
            title: judul,
            urlImage: urlGambar,
            id
          });
        }
      });

      return data;
    } catch (error) {
      console.error(error);
      throw new Error("Error fetching data from server");
    }
  }
}

export default new IntegrationAnimeSamehada();