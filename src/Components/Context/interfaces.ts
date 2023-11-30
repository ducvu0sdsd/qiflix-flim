
export interface WatchingInterface {
    movie_id: string
    indexOfEpisode: number
    currentTime: number
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
