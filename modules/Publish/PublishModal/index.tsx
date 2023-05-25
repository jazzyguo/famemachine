import React, { useEffect, useMemo } from "react";

import Modal from "@/components/Modal";
import NoConnections from "./NoConnections";
import Card from "@/components/Card";

import usePublishStore from "@/stores/publish";
import { useConnections } from "@/contexts/ConnectionsContext";

import { PUBLISH_CONNECTIONS } from "@/lib/consts/publish";

import TwitterLogo from "@/assets/svg/TwitterLogo";

import styles from "./PublishModal.module.scss";

const PublishModal = () => {
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
        return () => closePublishModal()
    }, [])

    console.log({ isOpen, selectedClip, canPublish, connections, current })

    return (
        <Modal isOpen={isOpen} closeModal={closePublishModal}>
            {!canPublish
                ? <NoConnections />
                : (
                    <div className={styles.publish}>
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
            }
        </Modal>
    );
};

export default PublishModal;
