import React, { useRef, useEffect, useCallback, memo } from 'react'

import CloseIcon from '@mui/icons-material/Close';

import styles from './Modal.module.scss'

type Props = {
    children?: React.ReactNode
    isOpen: boolean
    closeModal: () => void
}

/**
 * Modal component that will be used to display a popup
 * Closes on outside click or escape key or clicking the close button
 */
const Modal = ({
    children = null,
    isOpen = false,
    closeModal = () => { },
}: Props) => {
    const contentRef = useRef<HTMLDivElement>(null)

    const handleEscape = useCallback(
        (e: KeyboardEvent) => {
            if (e.key === 'Escape') {
                closeModal()
            }
        },
        [closeModal]
    )

    const onCloseButtonClick = () => {
        closeModal()
    }

    // attach listeners for outside click and keyboard escape press
    useEffect(() => {
        document.addEventListener('keydown', handleEscape)

        return () => {
            document.removeEventListener('keydown', handleEscape)
        }
    }, [handleEscape])

    if (!isOpen) {
        return null
    }

    return (
        <div className={styles.modalContainer}>
            <div className={styles.modalContainer_content} ref={contentRef}>
                <CloseIcon
                    className={styles.close}
                    onClick={onCloseButtonClick}
                />
                {children}
            </div>
        </div>
    )
}

export default memo(Modal)
