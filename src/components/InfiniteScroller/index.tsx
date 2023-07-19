import React, { useCallback, useEffect } from 'react'

import Loading from '@/components/Loading'
import { debounce } from 'lodash'

import styles from './InfiniteScroller.module.scss'

type Props = {
    className?: string
    children: React.ReactNode
    fetchData: () => void
    loading: boolean,
    hasNext: boolean;
}

/**
 * Handle infinite scrolling and fetching of data
 * when the user scrolls to the bottom
 */
const InfiniteScroller = ({
    className = '',
    children = null,
    fetchData = () => {},
    loading = false,
    hasNext,
}: Props) => {
    const _fetchData = useCallback(() => {
        if (loading || !hasNext) return
        fetchData()
    }, [
        fetchData,
        loading,
        hasNext,
    ])

    const fetchAction = debounce(_fetchData, 200)

    // - fetching for more data if the bottom is reached and there is more data to fetch
    const handleScroll = useCallback(() => {
        const { scrollTop, scrollHeight, clientHeight } =
            document.documentElement
        if (scrollTop + clientHeight >= scrollHeight) {
            fetchAction()
        }
    }, [fetchAction])

    useEffect(() => {
        window.addEventListener('scroll', handleScroll)
        return () => window.removeEventListener('scroll', handleScroll)
    }, [handleScroll])

    return (
        <div className={className}>
            {children}
            {loading && <Loading className={styles.loading} />}
        </div>
    )
}

export default React.memo(InfiniteScroller)
