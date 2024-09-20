
export interface AddFavoriteKomikRequest {
  id?: string;
  judul?: string;
  urlGambar?: string;
  terakhirDiperbarui?: string;
}

export interface ChapterRequest {
  title: string;
}

export interface DeleteFavoriteKomikRequest {
  id: number;
}

export interface ListKomikEntityResponse {
  listData: KomikEntityResponse[];
}

export interface KomikEntityResponse {
  idDb?: number;
  id?: string;
  judul?: string;
  urlGambar?: string;
  terakhirDiperbarui?: string;
  chapterTerakhir?: string;
}


export interface DetailData {
  judul: string;
  sinopsis: string;
  status: string;
  pengarang: string;
  ilustrator: string;
  tema: string;
  jenisKomik: string;
  jumlahPembaca: string;
}

export interface Chapter {
  title: string;
  url: string;
  releaseDate: string;
}

export interface ListChapter {
  listImage: DetailChapter[];
  prevChapter: string;
  nextChapter: string;
  chapterName: string;
}

export interface DetailChapter {
  no: number;
  image: string;
}
