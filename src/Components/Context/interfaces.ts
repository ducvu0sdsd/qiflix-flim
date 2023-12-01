
export interface WatchingInterface {
    movie_id: string
    indexOfEpisode: number
    currentTime: number
}

export interface Genre {
    _id: string
    name: string
}

export interface Episode {
    numberOfEpisodes: number
    episodes: EpisodeInterface[]
}

interface EpisodeInterface {
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
    yearRelease: number
    _id: string
    listEpisode?: Episode
}
