import React, { useEffect, useMemo, useState } from "react";
import { useRouter } from 'next/router';

import Modal from "@/components/Modal";
import NoConnections from "./components/NoConnections";
import Card from "@/components/Card";
import TwitterPublish from "./Twitter";
import PublishHistory from "./components/PublishHistory"

import usePublishStore from "@/stores/publish";
import { useConnections } from "@/contexts/ConnectionsContext";

import { PUBLISH_CONNECTIONS } from "@/lib/consts/publish";

import TwitterLogo from "@/assets/svg/TwitterLogo";
import YouTubeLogo from "@/assets/svg/YouTubeLogo";

import styles from "./PublishModal.module.scss";
import { Button } from "@mui/material";

const PUBLISH_COMPONENTS = {
    'twitter': TwitterPublish,
    'youtube': () => null,
    'history': PublishHistory,
}

const PublishModal = () => {
    const router = useRouter();
    const connections = useConnections()

    const { twitter, youtube } = connections

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
    }, [router.events, closePublishModal]);

    const goToConnectionsPage = () => {
        router.push('/connections')
    }

    const PublishComponent = current && PUBLISH_COMPONENTS[current]

    const { url } = selectedClip || {}

    const BackButton = () => (
        <div onClick={
            () => {
                setCurrent(null)
            }
        } className={styles.back}>
            Back to Socials
        </div>
    )
    const twitterConnected = !!twitter.screen_name
    const youtubeConnected = false

    return (
        <Modal isOpen={loading || isOpen} closeModal={closePublishModal}>
            {!canPublish
                ? <NoConnections />
                : (
                    <div className={styles.main}>
                        {!current
                            ? (
                                <div
                                    className={styles.publishHistory_button}
                                    onClick={() => setCurrent('history')}
                                >
                                    Publish History
                                </div>
                            )
                            : <BackButton />
                        }
                        <video src={url} controls className={styles.video} />
                        {PublishComponent
                            ? <PublishComponent />
                            : (
                                <>
                                    <p className={styles.main_desc}>
                                        Choose one of the following socials to publish to:
                                    </p>
                                    {canPublish &&
                                        <Button
                                            variant="contained"
                                            onClick={() => null}
                                            sx={{
                                                width: '200px',
                                                margin: '1rem auto 0',
                                            }}
                                        >
                                            Publish To All
                                        </Button>
                                    }
                                    <div className={styles.list}>
                                        <Card
                                            className={styles.list_item}
                                            onClick={twitterConnected
                                                ? () => setCurrent('twitter')
                                                : goToConnectionsPage
                                            }
                                        >
                                            <div>
                                                <TwitterLogo /> Twitter
                                            </div>
                                            {twitterConnected
                                                ? <span>@{twitter.screen_name}</span>
                                                : <span>Connect your twitter account</span>
                                            }
                                        </Card>
                                        <Card
                                            className={styles.list_item}
                                            onClick={youtubeConnected
                                                ? () => setCurrent('youtube')
                                                : goToConnectionsPage
                                            }

                                        >
                                            <div>
                                                <YouTubeLogo /> YouTube
                                            </div>
                                            {youtubeConnected
                                                ? <span></span>
                                                : <span>Connect your YouTube account</span>
                                            }
                                        </Card>
                                    </div>
                                </>
                            )
                        }
                    </div>
                )
            }
        </Modal >
    );
};

export default PublishModal;
