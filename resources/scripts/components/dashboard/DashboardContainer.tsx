import React, { useEffect, useState } from 'react';
import { Server } from '@/api/server/getServer';
import getServers from '@/api/getServers';
import ServerRow from '@/components/dashboard/ServerRow';
import Spinner from '@/components/elements/Spinner';
import PageContentBlock from '@/components/elements/PageContentBlock';
import useFlash from '@/plugins/useFlash';
import { useStoreState } from 'easy-peasy';
import { usePersistedState } from '@/plugins/usePersistedState';
import Switch from '@/components/elements/Switch';
import tw from 'twin.macro';
import useSWR from 'swr';
import { PaginatedResult } from '@/api/http';
import Pagination from '@/components/elements/Pagination';
import { useLocation } from 'react-router-dom';
import FlashMessageRender from '@/components/FlashMessageRender';

export default () => {
    const { search } = useLocation();
    const defaultPage = Number(new URLSearchParams(search).get('page') || '1');

    const [ page, setPage ] = useState((!isNaN(defaultPage) && defaultPage > 0) ? defaultPage : 1);
    const { clearFlashes, clearAndAddHttpError } = useFlash();
    const uuid = useStoreState(state => state.user.data!.uuid);
    const rootAdmin = useStoreState(state => state.user.data!.rootAdmin);
    const [ showOnlyAdmin, setShowOnlyAdmin ] = usePersistedState(`${uuid}:show_all_servers`, false);

    const { data: servers, error } = useSWR<PaginatedResult<Server>>(
        [ '/api/client/servers', (showOnlyAdmin && rootAdmin), page ],
        () => getServers({ page, type: (showOnlyAdmin && rootAdmin) ? 'admin' : undefined }),
    );

    useEffect(() => {
        if (!servers) return;
        if (servers.pagination.currentPage > 1 && !servers.items.length) {
            setPage(1);
        }
    }, [ servers?.pagination.currentPage ]);

    useEffect(() => {
        // Don't use react-router to handle changing this part of the URL, otherwise it
        // triggers a needless re-render. We just want to track this in the URL incase the
        // user refreshes the page.
        window.history.replaceState(null, document.title, `/${page <= 1 ? '' : `?page=${page}`}`);
    }, [ page ]);

    useEffect(() => {
        if (error) clearAndAddHttpError({ key: 'dashboard', error });
        if (!error) clearFlashes('dashboard');
    }, [ error ]);

    return (
        <PageContentBlock title={'Dashboard'} showFlashKey={'dashboard'}>
            <div css={tw`w-full`}>
                <FlashMessageRender byKey={'account:store:deployed'} css={tw`mb-4`} />
            </div>
            {rootAdmin &&
            <div css={tw`mb-2 flex justify-end items-center`}>
                <Switch
                    name={'show_all_servers'}
                    defaultChecked={showOnlyAdmin}
                    onChange={() => setShowOnlyAdmin(s => !s)}
                />
            </div>
            }
            <div className={'row'}>
                {!servers ?
                    <Spinner centered size={'large'}/>
                    :
                    <Pagination data={servers} onPageSelect={setPage}>
                        {({ items }) => (
                            items.length > 0 &&
                                items.map((server) => (
                                    <ServerRow
                                        key={server.uuid}
                                        server={server}
                                    />
                                )
                                )
                        )}
                    </Pagination>
                }
            </div>
        </PageContentBlock>
    );
};
