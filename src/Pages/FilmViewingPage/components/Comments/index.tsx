
import { ThemeContext } from '../../../../Components/Context'
import { CommentInterface } from '../../../../Components/Context/interfaces'
import { TypeHTTP, apiUser } from '../../../../Utils/api'
import './comments.scss'
import React, { useContext, useEffect, useState } from 'react'
import $ from 'jquery'

export interface CommentsProps {
    movie_id: string,
    user_id: string,
    user_avatar: string
}

const Comments = ({ movie_id, user_id, user_avatar }: CommentsProps) => {

    const { datas, handles } = useContext(ThemeContext) || {};
    const [comments, setComment] = useState<CommentInterface[]>([])
    const [load, setLoad] = useState<boolean>(false)

    const formatTimeAgo = (period: number) => {
        const seconds = Math.floor(period / 1000);
        const minutes = Math.floor(seconds / 60);
        const hours = Math.floor(minutes / 60);
        const days = Math.floor(hours / 24);
        const months = Math.floor(days / 30);

        if (months > 0) {
            return `${months} month ago`;
        } else if (days > 0) {
            return `${days} day ago`;
        } else if (hours > 0) {
            return `${hours} hour ago`;
        } else if (minutes > 0) {
            return `${minutes} minute ago`;
        } else {
            return `${seconds} second ago`;
        }
    };

    const handleFormatDate = (d: Date) => {
        let now = new Date()
        let period = now.getTime() - d.getTime()
        return formatTimeAgo(period);
    }

    useEffect(() => {
        apiUser({ path: `/comments/${movie_id}`, type: TypeHTTP.GET })
            .then(res => {
                setComment(res)
            })
    }, [load])


    const handleInsert = (e: any) => {
        if (e.key === "Enter") {
            const body = {
                movie_id,
                content: e.target.value,
                user_id
            }
            apiUser({ path: '/comments', type: TypeHTTP.POST, body })
                .then(res => {
                    setLoad(!load)
                    const input = $('.txt_content')
                    input.val('')
                })
        }
    }

    return (
        <section id='comments'>
            <h5>Comments</h5>
            <div className='content col-lg-12'>
                <div className='comment-item col-lg-12'>
                    <div className='image'>
                        <img width={'100%'} src={user_avatar} />
                    </div>
                    <input onKeyUp={handleInsert} type='text' className='col-lg-8 txt_content' placeholder='Enter Comment...' />
                </div>
                {comments.map((item, index) => {
                    return (
                        <div key={index} className='comment-item col-lg-12'>
                            <div className='image'>
                                <img width={'100%'} src={item.user.avatar} />
                            </div>
                            <div className='info col-lg-8'>
                                <div className='col-lg-10'>
                                    <div className="col-lg-12 name">
                                        {item.user.name}
                                    </div>
                                    <div className="col-lg-12 message">
                                        {item.content}
                                    </div>
                                </div>
                                <div className="col-lg-2 datetime">
                                    {handleFormatDate(new Date(item.updatedAt))}
                                </div>
                            </div>
                        </div>
                    )
                })}
            </div>
        </section>
    )
}

export default Comments
