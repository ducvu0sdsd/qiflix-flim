
export interface episode {
    name: string,
    url: string,
    num: number
}

export interface DataType {
    title: string,
    description: string,
    country: string,
    categories: string[],
    actors: string[],
    url: string,
    thumbnail: string,
    trailerURL: string,
    videosURL: episode[]
}

export const datas: DataType[] = [
    {
        title: `Thư Ký Kim Sao Thế? - What's Wrong With Secretary Kim?`,
        description: `Phim Sao Thế Thư Ký Kim ? - Thư Ký Kim Sao Thế? xoay quanh câu chuyện tình lãng mạn của Lee Young Joon, một tài phiệt đời hai hoàn hảo nhưng quá yêu bản thân, và người trợ lí của anh ta, Kim Mi So, người được gọi là "huyền thoại của giới thư ký". Trong phim, Park Min Young thủ vai Kim Mi So trong khi Park Seo Joon lần nữa hóa thân thành chàng trai giàu có giống như thời She Was Pretty. Kim Mi So là một nữ thư kí đã làm việc cho Lee Young Joon được 9 năm. Cô không những tài năng mà còn xinh đẹp, sở hữu nụ cười tỏa sáng, nhưng lại chưa từng yêu ai bao giờ. Việc Kim Min So nộp đơn thôi việc cho Lee Young Joon cùng nụ cười trên môi khiến anh trở nên đau đầu.`,
        country: 'Korea',
        categories: ['Funny', 'Romantic'],
        actors: ['Park Seo Joon', 'Park Min Young'],
        url: 'what-wrong-with-secretary-kim',
        thumbnail: 'https://static.vieon.vn/vieplay-image/carousel_web_v4/2020/08/25/9n58gaa6_1920x1080-carousel-saothethukykim.jpg',
        trailerURL: 'https://drive.google.com/uc?export=download&id=1jQcLBPqjSMkvEoN6AvVog0ruZhSzKuOY',
        videosURL: [
            { num: 1, name: 'Episode 1', url: 'x8pc9z1' },
            { num: 2, name: 'Episode 2', url: 'x8pc9z2' },
            { num: 3, name: 'Episode 3', url: 'x8pc9yw' },
            { num: 4, name: 'Episode 4', url: 'x8pc9z3' },
            { num: 5, name: 'Episode 5', url: 'x8pc9yv' },
            { num: 6, name: 'Episode 6', url: 'x8pc9yx' },
            { num: 7, name: 'Episode 7', url: 'x8pc9z0' },
            { num: 8, name: 'Episode 8', url: 'x8pc9yy' },
            { num: 9, name: 'Episode 9', url: 'x8pc9yz' },
            { num: 10, name: 'Episode 10', url: 'x8pc9z4' },
            { num: 11, name: 'Episode 11', url: 'x8pck24' },
            { num: 12, name: 'Episode 12', url: 'x8pck26' },
            { num: 13, name: 'Episode 13', url: 'x8pck21' },
            { num: 14, name: 'Episode 14', url: 'x8pck25' },
            { num: 15, name: 'Episode 15', url: 'x8pck23' },
            { num: 16, name: 'Episode 16', url: 'x8pck22' },
        ]
    }
]