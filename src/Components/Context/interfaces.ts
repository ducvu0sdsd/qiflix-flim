
export interface WatchingInterface {
    movie_id: string
    indexOfEpisode: number
    currentTime: number
    process: number
}

export interface Genre {
    _id: string
    name: string
}

export interface Episode {
    numberOfEpisodes: number
    episodes: EpisodeInterface[]
}

export interface EpisodeInterface {
    indexOfEpisode: number,
    name: string,
    url: string
}

export enum Gender {
    MALE = "male",
    FEMALE = "female",
    OTHER = "other"
}

export enum StepVerify {
    STEP_1 = "Step 1",
    STEP_2 = "Step 2",
    STEP_3 = "Step 3",
    SUCCESS = "Success"
}

export interface UserInterface {
    _id: string
    name: string
    gender: Gender
    avatar: string
    pin?: string
    watching?: WatchingInterface[]
    liked?: string[]
    account_id: string
}

export interface AccountInterface {
    email: string
    password: string
    fullname: string
    phone: string
    address: string
    verify: StepVerify
    admin: boolean
    _id: string
}


export interface MovieInterface {
    title: string
    description: string
    country: string
    genres: string[]
    actors: string[]
    url: string
    thumbnail: string
    trailerUrl: string
    directors: string[]
    belong: string[]
    yearRelease: number
    _id: string
    listEpisode?: Episode
    thumbnailVertical: string
}

export interface MovieWatchingByUserIdInterface {
    movie: MovieInterface
    indexOfEpisode: number
    currentTime: number
    process: number
}

export interface CommentInterface {
    _id: string
    movie_id: string
    content: string
    updatedAt: Date
    user: {
        _id: string
        name: string
        avatar: string
    }
}

export interface SubtitleItemInterface {
    id: number,
    firstTime: number,
    lastTime: number,
    content: string
}

export interface SubtitleInterface {
    country: string
    movie_id: string
    subtitles: SubtitleItemInterface[]
    episode?: number
}