import * as React from 'react';
import ContentBox from '@/components/elements/ContentBox';
import UpdatePasswordForm from '@/components/dashboard/forms/UpdatePasswordForm';
import UpdateEmailAddressForm from '@/components/dashboard/forms/UpdateEmailAddressForm';
import ConfigureTwoFactorForm from '@/components/dashboard/forms/ConfigureTwoFactorForm';
import PageContentBlock from '@/components/elements/PageContentBlock';
import tw from 'twin.macro';
import { breakpoint } from '@/theme';
import styled from 'styled-components/macro';
import MessageBox from '@/components/MessageBox';
import { useLocation } from 'react-router-dom';
import UpdateUsernameForm from './forms/UpdateUsernameForm';

const Container = styled.div`
    ${tw`flex flex-wrap`};

    & > div {
        ${tw`w-full`};

        ${breakpoint('md')`
            width: calc(50% - 1rem);
        `}

        ${breakpoint('xl')`
            ${tw`w-auto flex-1`};
        `}
    }
`;

export default () => {
    const { state } = useLocation<{ twoFactorRedirect?: boolean } | undefined>();

    return (
        <PageContentBlock title={'Account Overview'}>
            {state?.twoFactorRedirect &&
            <MessageBox title={'2-Factor Required'} type={'error'}>
                Your account must have two-factor authentication enabled in order to continue.
            </MessageBox>
            }
            <Container css={[ tw`mb-10`, state?.twoFactorRedirect ? tw`mt-4` : tw`mt-10` ]}>
                <ContentBox title={'Update Password'} showFlashes={'account:password'}>
                    <UpdatePasswordForm/>
                </ContentBox>
                <ContentBox
                    css={tw`mt-8 md:mt-0 md:ml-8`}
                    title={'Update Email Address'}
                    showFlashes={'account:email'}
                >
                    <UpdateEmailAddressForm/>
                </ContentBox>
                <ContentBox css={tw`lg:ml-8 mt-8 lg:mt-0`} title={'Configure Two Factor'}>
                    <ConfigureTwoFactorForm/>
                </ContentBox>
            </Container>
            <Container css={[ tw`mb-10`, state?.twoFactorRedirect ? tw`mt-4` : tw`mt-10` ]}>
                <ContentBox
                    css={tw`mt-8 md:mt-0 md:ml-8`}
                    title={'Update Email Address'}
                    showFlashes={'account:email'}
                >
                    <UpdateUsernameForm/>
                </ContentBox>
            </Container>
        </PageContentBlock>
    );
};
