import React from 'react'
import Link from 'next/link'

import usePublishStore from "@/stores/publish";

import { firstLetterToUppercase } from '@/lib/utils/strings'

import styles from './PublishHistory.module.scss'

const PublishHistory = () => {
    const selectedClip = usePublishStore(state => state.selectedClip)
    const { published } = selectedClip || {}

    return (
        <div className={styles.container}>
            <h2>Published Urls</h2>
            {published
                ? Object.keys(published).map(social => {
                    const socialPublishInfo = published[social]
                    return (
                        <div className={styles.socialList} key={social}>
                            <h3>{firstLetterToUppercase(social)}</h3>
                            {socialPublishInfo.map(({ url, published_at }) =>
                                <div className={styles.socialList_item}>
                                    <span>{published_at}</span>
                                    <Link
                                        target="_blank"
                                        href={url}
                                        key={url}
                                    >
                                        {url}
                                    </Link>
                                </div>
                            )}
                        </div>
                    )
                })
                : (
                    <div className={styles.empty}>
                        No publications to any socials have been made.
                    </div>
                )
            }
        </div>
    )
}

export default PublishHistory
