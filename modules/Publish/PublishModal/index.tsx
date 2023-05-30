import React, { useEffect, useMemo, useState } from "react";
import { useRouter } from 'next/router';

import Modal from "@/components/Modal";
import NoConnections from "./NoConnections";
import Card from "@/components/Card";
import TwitterPublish from "./Twitter";

import usePublishStore from "@/stores/publish";
import { useConnections } from "@/contexts/ConnectionsContext";

import { PUBLISH_CONNECTIONS } from "@/lib/consts/publish";

import TwitterLogo from "@/assets/svg/TwitterLogo";

import styles from "./PublishModal.module.scss";

const PUBLISH_COMPONENTS = {
    'twitter': TwitterPublish
}

const PublishModal = () => {
    const [showHistory, setShowHistory] = useState<boolean>(false)

    const router = useRouter();
    const connections = useConnections()

    const { twitter } = connections

    const isOpen = usePublishStore(state => state.isOpen)
    const selectedClip = usePublishStore(state => state.selectedClip)
    const closePublishModal = usePublishStore(state => state.closePublishModal)
    const current = usePublishStore(state => state.current)
    const setCurrent = usePublishStore(state => state.setCurrent)
    const loading = usePublishStore(state => state.loading)

    const canPublish = useMemo(() =>
        Object.keys(connections)
            .some(connection =>
                connections[connection] && PUBLISH_CONNECTIONS.includes(connection)
            ), [connections]
    )

    useEffect(() => {
        router.events.on('routeChangeComplete', closePublishModal);
        return () => {
            router.events.off('routeChangeComplete', closePublishModal);
        };
    }, []);

    const PublishComponent = current && PUBLISH_COMPONENTS[current]

    const { url, published } = selectedClip || {}

    const BackButton = () => (
        <div onClick={() => setCurrent(null)} className={styles.back}>
            Back to Socials
        </div>
    )

    return (
        <Modal isOpen={loading || isOpen} closeModal={closePublishModal}>
            {PublishComponent
                ?
                <>
                    {!loading &&
                        <BackButton />
                    }
                    <div className={styles.main}>
                        <PublishComponent />
                    </div>
                </>
                : (!canPublish
                    ? <NoConnections />
                    : showHistory
                        ? (
                            <div className={styles.publishHistory}>
                                <BackButton />
                            </div>
                        ) : (
                            <>
                                <div className={styles.publishHistory_button}>
                                    Publish History
                                </div>
                                <div className={styles.main}>
                                    <video src={url} controls />
                                    <p className={styles.main_desc}>
                                        Choose one of the following socials to publish to:
                                    </p>
                                    <div className={styles.list}>
                                        <Card
                                            className={styles.list_item}
                                            onClick={() => setCurrent('twitter')}
                                        >
                                            <div>
                                                <TwitterLogo /> Twitter
                                            </div>
                                            <span>@{twitter.screen_name}</span>
                                        </Card>
                                    </div>
                                </div>
                            </>
                        )
                )
            }
        </Modal >
    );
};

export default PublishModal;
