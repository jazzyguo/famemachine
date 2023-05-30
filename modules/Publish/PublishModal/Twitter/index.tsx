import React, { useState, FormEvent } from 'react'
import Link from 'next/link';

import usePublishStore from "@/stores/publish";
import { useAuth } from '@/contexts/AuthContext';
import useClipsStore from '@/stores/clips';

import Loading from '@/components/Loading';

import styles from './TwitterPublish.module.scss'

const TwitterPublish = () => {
    const [error, setError] = useState<string>('')
    const { user } = useAuth()

    const clip = usePublishStore(state => state.selectedClip)
    const publishClipToTwitter = usePublishStore(state => state.publishClipToTwitter)
    const getSavedClips = useClipsStore(state => state.getSavedClips)
    const publishedUrl = usePublishStore(state => state.publishedUrl)
    const loading = usePublishStore(state => state.loading)

    const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault()

        if (clip) {
            try {
                const formData = new FormData(event.target);

                formData.append("user_id", user.uid)
                formData.append("clip_url", clip.url)

                await publishClipToTwitter(formData)

                getSavedClips(user.uid)
            } catch (e: any) {
                setError(e.message)
            }
        }
    }

    return publishedUrl
        ? <div className={styles.published}>
            {`Published to `}
            <Link href={publishedUrl} target="_blank">{publishedUrl}</Link>
        </div>
        : (
            <form className={styles.container} onSubmit={handleSubmit}>
                <video src={clip?.url} controls />
                <textarea rows={15} name="text" disabled={loading} />
                {loading
                    ? <Loading className={styles.loading} />
                    : <button type="submit">Tweet</button>
                }
                {error && <span className={styles.error}>{error}</span>}
            </form>
        )
}

export default TwitterPublish
