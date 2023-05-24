import React, { useEffect, useMemo } from "react";

import Modal from "@/components/Modal";

import usePublishStore from "@/stores/publish";
import { useConnections } from "@/contexts/ConnectionsContext";

import { PUBLISH_CONNECTIONS } from "@/lib/consts/publish";
import { firstLetterToUppercase } from "@/lib/utils/strings";

import styles from "./PublishModal.module.scss";

const PublishModal = () => {
    const connections = useConnections()

    const isOpen = usePublishStore(state => state.isOpen)
    const selectedClip = usePublishStore(state => state.selectedClip)
    const closePublishModal = usePublishStore(state => state.closePublishModal)

    const canPublish = useMemo(() =>
        Object.keys(connections)
            .some(connection =>
                connections[connection] && PUBLISH_CONNECTIONS.includes(connection)
            ), [connections]
    )

    console.log({ isOpen, selectedClip, canPublish, connections })

    return (
        <Modal isOpen={isOpen} closeModal={closePublishModal}>
            {!canPublish
                ? (
                    <div className={styles.noConnections}>
                        Please connect one of the following socials to publish a clip:
                        {PUBLISH_CONNECTIONS.map((connection: string, idx) =>
                            <>
                                <span>{firstLetterToUppercase(connection)}</span>
                                {idx + 1 < PUBLISH_CONNECTIONS.length ? ', ' : ''}
                            </>
                        )}
                    </div>
                )
                : (<div>hi</div>)
            }
        </Modal>
    );
};

export default PublishModal;
