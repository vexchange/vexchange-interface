import React, { useCallback } from 'react'
import styled, { css } from 'styled-components'
import { darken } from 'polished'
import { useTranslation } from 'react-i18next'
import { NavLink, Link as HistoryLink, useNavigate, useLocation } from 'react-router-dom'
import * as isExternal from 'is-url-external'

import { useDarkModeManager } from '../../state/user/hooks'
import { CursorPointer } from '../../theme'
import { ArrowLeft } from 'react-feather'
import { RowBetween } from '../Row'
import QuestionHelper from '../QuestionHelper'

import { useBodyKeyDown } from '../../hooks'

const tabOrder = [
  {
    path: '/swap',
    textKey: 'swap',
    regex: /\/swap/
  },
  {
    path: '/send',
    textKey: 'send',
    regex: /\/send/
  },
  {
    path: '/pool',
    textKey: 'pool',
    regex: /\/pool/
  },
  {
    path: 'https://farm.vexchange.io/',
    textKey: 'farm'
  }
]

const Tabs = styled.div<{ isDark?: boolean }>`
  ${({ theme }) => theme.flexRowNoWrap}
  align-items: center;
  border-radius: 8px 8px 0 0;
`

const activeClassName = 'ACTIVE'

const StyledNavLink = styled(({ ...props }) => <NavLink {...props} />)<{ isdark?: boolean }>`
  ${({ theme }) => theme.flexRowNoWrap}
  align-items: center;
  justify-content: center;
  height: 3rem;
  flex: 1 0 auto;
  outline: none;
  cursor: pointer;
  text-decoration: none;
  color: ${({ theme }) => theme.text3};
  font-size: 20px;
  box-sizing: border-box;
  padding: 1rem;

  &.${activeClassName} {
    box-sizing: border-box;
    font-weight: 500;
    color: ${({ theme }) => theme.text1};
  }

  :hover,
  :focus {
    color: ${({ theme }) => darken(0.1, theme.text1)};
  }
`

const StyledLink = styled.a<{ isdark?: boolean }>`
  ${({ theme }) => theme.flexRowNoWrap}
  align-items: center;
  justify-content: center;
  height: 3rem;
  flex: 1 0 auto;
  outline: none;
  cursor: pointer;
  text-decoration: none;
  color: ${({ theme }) => theme.text3};
  font-size: 20px;
  box-sizing: border-box;
  padding: 1rem;

  :hover,
  :focus {
    color: ${({ theme }) => darken(0.1, theme.text1)};
  }
`

const ActiveText = styled.div`
  font-weight: 500;
  font-size: 20px;
`

const ArrowLink = styled(ArrowLeft)``

export const NavigationTabs = () => {
  const { t } = useTranslation()
  const navigate = useNavigate()
  const location = useLocation()
  const { pathname } = location

  const [isDark] = useDarkModeManager()

  const go = useCallback(
    direction => {
      const tabIndex = tabOrder.findIndex(({ regex }) => pathname.match(regex))
      navigate(tabOrder[(tabIndex + tabOrder.length + direction) % tabOrder.length].path)
    },
    [pathname, navigate]
  )
  const navigateRight = useCallback(() => {
    go(1)
  }, [go])
  const navigateLeft = useCallback(() => {
    go(-1)
  }, [go])

  useBodyKeyDown('ArrowRight', navigateRight)
  useBodyKeyDown('ArrowLeft', navigateLeft)

  const adding = pathname.match('/add')
  const removing = pathname.match('/remove')
  const finding = pathname.match('/find')
  const creating = pathname.match('/create')

  return (
    <>
      {adding || removing ? (
        <Tabs>
          <RowBetween style={{ padding: '1rem' }}>
            <CursorPointer onClick={() => navigate('/pool')}>
              <ArrowLink />
            </CursorPointer>
            <ActiveText>{adding ? 'Add' : 'Remove'} Liquidity</ActiveText>
            <QuestionHelper
              text={
                adding
                  ? 'When you add liquidity, you are given pool tokens that represent your position in this pool. These tokens automatically earn fees proportional to your pool share and can be redeemed at any time.'
                  : 'Your liquidity is represented by a pool token (ERC20). Removing will convert your position back into tokens at the current rate and proportional to the amount of each token in the pool. Any fees you accrued are included in the token amounts you receive.'
              }
            />
          </RowBetween>
        </Tabs>
      ) : finding ? (
        <Tabs>
          <RowBetween style={{ padding: '1rem' }}>
            <HistoryLink to="/pool">
              <ArrowLink />
            </HistoryLink>
            <ActiveText>Import Pool</ActiveText>
            <QuestionHelper text={"Use this tool to find pairs that don't automatically appear in the interface."} />
          </RowBetween>
        </Tabs>
      ) : creating ? (
        <Tabs>
          <RowBetween style={{ padding: '1rem' }}>
            <HistoryLink to="/pool">
              <ArrowLink />
            </HistoryLink>
            <ActiveText>Create Pool</ActiveText>
            <QuestionHelper text={'Use this interface to create a new pool.'} />
          </RowBetween>
        </Tabs>
      ) : (
        <Tabs>
          {tabOrder.map(({ path, textKey, regex }) => (
            <React.Fragment key={path}>
              {isExternal(path) ? (
                <StyledLink id={`${textKey}-nav-link`} href={path} target="_blank">
                  Farm
                </StyledLink>
              ) : (
                <StyledNavLink
                  // isdark={isDark ? 1 : 0}
                  id={`${textKey}-nav-link`}
                  to={path}
                  // isActive={(_, { pathname }) => !!pathname.match(regex)}
                >
                  {t(textKey)}
                </StyledNavLink>
              )}
            </React.Fragment>
          ))}
        </Tabs>
      )}
    </>
  )
}
