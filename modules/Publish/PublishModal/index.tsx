import React, { useEffect, useMemo } from "react";
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
    const router = useRouter();
    const connections = useConnections()

    const { twitter } = connections

    const isOpen = usePublishStore(state => state.isOpen)
    const selectedClip = usePublishStore(state => state.selectedClip)
    const closePublishModal = usePublishStore(state => state.closePublishModal)
    const current = usePublishStore(state => state.current)
    const setCurrent = usePublishStore(state => state.setCurrent)

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

    console.log({ selectedClip })

    const PublishComponent = current && PUBLISH_COMPONENTS[current]

    return (
        <Modal isOpen={isOpen} closeModal={closePublishModal}>
            {PublishComponent
                ?
                <>
                    <div onClick={() => setCurrent(null)} className={styles.back}>
                        Back to socials
                    </div>
                    <div className={styles.publish}>
                        <PublishComponent />
                    </div>
                </>
                : (!canPublish
                    ? <NoConnections />
                    : (
                        <div className={styles.publish}>
                            <video src={selectedClip?.url} controls />
                            <p className={styles.publish_desc}>
                                Choose one of the following socials to publish to:
                            </p>
                            <div className={styles.publish_list}>
                                <Card
                                    className={styles.publish_list_item}
                                    onClick={() => setCurrent('twitter')}
                                >
                                    <div>
                                        <TwitterLogo /> Twitter
                                    </div>
                                    <span>@{twitter.screen_name}</span>
                                </Card>
                            </div>
                        </div>
                    )
                )
            }
        </Modal>
    );
};

export default PublishModal;
