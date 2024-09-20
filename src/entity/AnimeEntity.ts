
export interface AnimeEntity {
  listAnime: AnimeData[];
}

export interface AnimeData {
  title: string;
  urlImage: string;
  id: string;
}

export interface AnimeSearchRequest {
  search: string;
}

export interface AnimeGenreRequest {
  page: number;
  genre: string[];
}

export interface DetailEpisodeAnime {
  episodes:  Episode[];
  title:     string;
  videoData: VideoUrl;
}

export interface DetailAnime {
  episodes:  Episode[];
  videoData: VideoUrl;
  details:   DetailsDescription;
}

export interface Episode {
  title:        string;
  id:           string;
  releaseDate: string;
}

export interface VideoUrl {
  urlVideo?: string|null;
}

export interface DetailsDescription {
  title:     string;
  rating:    string;
  status:    string;
  studio:    string;
  release:   string;
  season:    string;
  type:      string;
  director:  string;
  genres:    string[];
  desc: string;
}

