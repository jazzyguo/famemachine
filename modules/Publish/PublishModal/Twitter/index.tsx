import React, { useState, FormEvent } from 'react'

import usePublishStore from "@/stores/publish";
import { useAuth } from '@/contexts/AuthContext';

import Loading from '@/components/Loading';

import styles from './TwitterPublish.module.scss'

const TwitterPublish = () => {
    const [error, setError] = useState<string>('')
    const { user } = useAuth()

    const clip = usePublishStore(state => state.selectedClip)
    const publishClipToTwitter = usePublishStore(state => state.publishClipToTwitter)
    const loading = usePublishStore(state => state.loading)

    const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault()

        if (clip) {
            try {
                const formData = new FormData(event.target);

                formData.append("user_id", user.uid)
                formData.append("clip_url", clip.url)

                await publishClipToTwitter(formData)
            } catch (e: any) {
                setError(e.message)
            }
        }
    }
    
    return (
        <form className={styles.container} onSubmit={handleSubmit}>
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
