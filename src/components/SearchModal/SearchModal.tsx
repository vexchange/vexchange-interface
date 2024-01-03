import React, { useState, useRef, useMemo, useEffect, useContext } from 'react'
import styled, { ThemeContext } from 'styled-components'
import { JSBI, Token, WVET } from 'vexchange-sdk/dist'
import { isMobile } from 'react-device-detect'
import { useNavigate, Link } from 'react-router-dom'
import { ArrowLeft } from 'react-feather'
import { Text, Modal, ModalOverlay, ModalContent, Flex, Input, Button, HStack, Box, Center } from '@chakra-ui/react'

import { DUMMY_VET } from '../../constants'
import { useAllTokenBalancesTreatingWETHasETH } from '../../state/wallet/hooks'
import { Link as StyledLink } from '../../theme/components'

import Card from '../Card'
import Circle from '../../assets/images/circle.svg'
import { TokenLogo } from '../TokenLogo'
import DoubleTokenLogo from '../DoubleLogo'
import { AutoColumn } from '../Column'
import { CursorPointer } from '../../theme'
import { CloseIcon } from '../../theme/components'
import { Spinner, TYPE } from '../../theme'
import { RowFixed, AutoRow } from '../Row'

import { useDarkModeManager } from '../../state/user/hooks'
import { isAddress, escapeRegExp, overrideWVET } from '../../utils'
import { useWeb3React } from '../../hooks'
import {
  useAllDummyPairs,
  useFetchTokenByAddress,
  useAddUserToken,
  useRemoveUserAddedToken,
  useUserAddedTokens
} from '../../state/user/hooks'
import { useTranslation } from 'react-i18next'
import { useToken, useAllTokens } from '../../hooks/Tokens'

const FadedSpan = styled(RowFixed)`
  color: ${({ theme }) => theme.primary1};
  font-size: 14px;
`

const SpinnerWrapper = styled(Spinner)`
  margin: 0 0.25rem 0 0.25rem;
  color: ${({ theme }) => theme.text4};
  opacity: 0.6;
`

const FilterWrapper = styled(RowFixed)`
  padding: 8px;
  border-radius: 8px;
  user-select: none;
  border: none;
  color: #ffffff;

  position: relative;
  z-index: 0;

  & > * {
    user-select: none;
  }
  :hover {
    cursor: pointer;
  }
`

const PaddedColumn = styled(AutoColumn)``

// filters on results
const FILTERS = {
  VOLUME: 'VOLUME',
  LIQUIDITY: 'LIQUIDITY',
  BALANCES: 'BALANCES'
}

interface SearchModalProps {
  isOpen?: boolean
  onClose?: () => void
  onDismiss?: () => void
  filterType?: 'tokens'
  hiddenToken?: string
  showSendWithSwap?: boolean
  onTokenSelect?: (address: string) => void
  urlAddedTokens?: Token[]
  otherSelectedTokenAddress?: string
  otherSelectedText?: string
  showCommonBases?: boolean
}

export const SearchModal = ({
  isOpen,
  onClose,
  onTokenSelect,
  urlAddedTokens,
  filterType,
  hiddenToken,
  showSendWithSwap,
  otherSelectedTokenAddress,
  otherSelectedText,
  showCommonBases = false
}: SearchModalProps) => {
  const { t } = useTranslation()
  const navigate = useNavigate()
  const { account, chainId } = useWeb3React()
  const theme = useContext(ThemeContext)
  const [isDark] = useDarkModeManager()

  const allTokens = useAllTokens()
  const allPairs = useAllDummyPairs()
  const allBalances = useAllTokenBalancesTreatingWETHasETH()

  const [searchQuery, setSearchQuery] = useState('')
  const [invertSearchOrder, setInvertSearchOrder] = useState(false)

  const userAddedTokens = useUserAddedTokens()
  const fetchTokenByAddress = useFetchTokenByAddress()
  const addToken = useAddUserToken()
  const removeTokenByAddress = useRemoveUserAddedToken()

  // if the current input is an address, and we don't have the token in context, try to fetch it
  const token = useToken(searchQuery)
  const [temporaryToken, setTemporaryToken] = useState<Token | null>()

  // filters for ordering
  const [activeFilter, setActiveFilter] = useState(FILTERS.BALANCES)

  // toggle specific token import view
  const [showTokenImport, setShowTokenImport] = useState(false)

  // used to help scanning on results, put token found from input on left
  const [identifiedToken, setIdentifiedToken] = useState<Token>()

  useEffect(() => {
    const address = isAddress(searchQuery)
    if (address && !token) {
      let stale = false
      fetchTokenByAddress(address).then(token => {
        if (!stale) {
          setTemporaryToken(token)
        }
      })
      return () => {
        stale = true
        setTemporaryToken(null)
      }
    }
  }, [searchQuery, token, fetchTokenByAddress])

  const tokenList = useMemo(() => {
    return Object.keys(allTokens)
      .sort((tokenAddressA, tokenAddressB): number => {
        // -1 = a is first
        // 1 = b is first

        // sort ETH first
        const a = allTokens[tokenAddressA]
        const b = allTokens[tokenAddressB]
        if (a.equals(DUMMY_VET[chainId])) return -1
        if (b.equals(DUMMY_VET[chainId])) return 1

        // sort by balances
        const balanceA = allBalances[account]?.[tokenAddressA]
        const balanceB = allBalances[account]?.[tokenAddressB]
        if (balanceA?.greaterThan('0') && !balanceB?.greaterThan('0')) return !invertSearchOrder ? -1 : 1
        if (!balanceA?.greaterThan('0') && balanceB?.greaterThan('0')) return !invertSearchOrder ? 1 : -1
        if (balanceA?.greaterThan('0') && balanceB?.greaterThan('0')) {
          return balanceA.greaterThan(balanceB) ? (!invertSearchOrder ? -1 : 1) : !invertSearchOrder ? 1 : -1
        }

        // sort by symbol
        return a.symbol.toLowerCase() < b.symbol.toLowerCase() ? -1 : 1
      })
      .map(tokenAddress => {
        const token = allTokens[tokenAddress]
        return {
          name: token.name,
          symbol: token.symbol,
          address: isAddress(tokenAddress) as string,
          balance: allBalances?.[account]?.[tokenAddress]
        }
      })
  }, [allTokens, chainId, allBalances, account, invertSearchOrder])

  const filteredTokenList = useMemo(() => {
    return tokenList.filter(tokenEntry => {
      const urlAdded = urlAddedTokens?.some(token => token.address === tokenEntry.address)
      const customAdded = userAddedTokens?.some(token => token.address === tokenEntry.address) && !urlAdded

      // if token import page dont show preset list, else show all
      const include = !showTokenImport || (showTokenImport && customAdded && searchQuery !== '')

      const inputIsAddress = searchQuery.slice(0, 2) === '0x'
      const regexMatches = Object.keys(tokenEntry).map(tokenEntryKey => {
        if (tokenEntryKey === 'address') {
          return (
            include &&
            inputIsAddress &&
            typeof tokenEntry[tokenEntryKey] === 'string' &&
            !!tokenEntry[tokenEntryKey].match(new RegExp(escapeRegExp(searchQuery), 'i'))
          )
        }
        return (
          include &&
          typeof tokenEntry[tokenEntryKey] === 'string' &&
          !!tokenEntry[tokenEntryKey].match(new RegExp(escapeRegExp(searchQuery), 'i'))
        )
      })
      return regexMatches.some(m => m)
    })
  }, [tokenList, urlAddedTokens, userAddedTokens, showTokenImport, searchQuery])

  function _onTokenSelect(address) {
    setSearchQuery('')
    onTokenSelect(address)
    onClose()
  }

  // manage focus on modal show
  const inputRef = useRef()
  function onInput(event) {
    const input = event.target.value
    const checksummedInput = isAddress(input)
    setSearchQuery(checksummedInput || input)
  }

  function clearInputAndDismiss() {
    setSearchQuery('')
    onClose()
  }

  // make an effort to identify the specific token a user is searching for
  useEffect(() => {
    const searchQueryIsAddress = !!isAddress(searchQuery)

    // try to find an exact match by address
    if (searchQueryIsAddress) {
      const identifiedTokenByAddress = Object.values(allTokens).filter(token => {
        if (searchQueryIsAddress && token.address === isAddress(searchQuery)) {
          return true
        }
        return false
      })
      if (identifiedTokenByAddress.length > 0) setIdentifiedToken(identifiedTokenByAddress[0])
    }
    // try to find an exact match by symbol
    else {
      const identifiedTokenBySymbol = Object.values(allTokens).filter(token => {
        if (token.symbol.slice(0, searchQuery.length).toLowerCase() === searchQuery.toLowerCase()) return true
        return false
      })
      if (identifiedTokenBySymbol.length > 0) setIdentifiedToken(identifiedTokenBySymbol[0])
    }

    return () => {
      setIdentifiedToken(undefined)
    }
  }, [allTokens, searchQuery])

  const sortedPairList = useMemo(() => {
    return allPairs.sort((a, b): number => {
      // sort by balance
      const balanceA = allBalances[account]?.[a.liquidityToken.address]
      const balanceB = allBalances[account]?.[b.liquidityToken.address]
      if (balanceA?.greaterThan('0') && !balanceB?.greaterThan('0')) return !invertSearchOrder ? -1 : 1
      if (!balanceA?.greaterThan('0') && balanceB?.greaterThan('0')) return !invertSearchOrder ? 1 : -1
      if (balanceA?.greaterThan('0') && balanceB?.greaterThan('0')) {
        return balanceA.greaterThan(balanceB) ? (!invertSearchOrder ? -1 : 1) : !invertSearchOrder ? 1 : -1
      }
      return 0
    })
  }, [allPairs, allBalances, account, invertSearchOrder])

  const filteredPairList = useMemo(() => {
    const searchQueryIsAddress = !!isAddress(searchQuery)
    return sortedPairList.filter(pair => {
      // if there's no search query, hide non-ETH pairs
      if (searchQuery === '') return pair.token0.equals(WVET[chainId]) || pair.token1.equals(WVET[chainId])

      const token0 = pair.token0
      const token1 = pair.token1

      if (searchQueryIsAddress) {
        if (token0.address === isAddress(searchQuery)) return true
        if (token1.address === isAddress(searchQuery)) return true
      } else {
        const identifier0 = `${token0.symbol}/${token1.symbol}`
        const identifier1 = `${token1.symbol}/${token0.symbol}`
        if (identifier0.slice(0, searchQuery.length).toLowerCase() === searchQuery.toLowerCase()) return true
        if (identifier1.slice(0, searchQuery.length).toLowerCase() === searchQuery.toLowerCase()) return true
      }
      return false
    })
  }, [searchQuery, sortedPairList, chainId])

  function renderPairsList() {
    if (filteredPairList?.length === 0) {
      return (
        <PaddedColumn>
          <Text>No Pools Found</Text>
        </PaddedColumn>
      )
    }

    return (
      filteredPairList &&
      filteredPairList.map((pair, i) => {
        // reset ordering to help scan search results
        const token0 = identifiedToken ? (identifiedToken.equals(pair.token0) ? pair.token0 : pair.token1) : pair.token0
        const token1 = identifiedToken ? (identifiedToken.equals(pair.token0) ? pair.token1 : pair.token0) : pair.token1
        const pairAddress = pair.liquidityToken.address
        const balance = allBalances?.[account]?.[pairAddress]?.toSignificant(6)
        const zeroBalance =
          allBalances?.[account]?.[pairAddress]?.raw &&
          JSBI.equal(allBalances?.[account]?.[pairAddress].raw, JSBI.BigInt(0))
        return (
          <Box
            key={i}
            // isDark={isDark}
            onClick={() => {
              navigate('/add/' + token0.address + '-' + token1.address)
              onClose()
            }}
          >
            <div>
              <DoubleTokenLogo a0={token0?.address || ''} a1={token1?.address || ''} size={24} />
              <Text>
                {overrideWVET(token0?.symbol)}/{overrideWVET(token1?.symbol)}
              </Text>
            </div>

            <Button
              variant="primary"
              onClick={() => {
                navigate('/add/' + token0.address + '-' + token1.address)
                onClose()
              }}
            >
              {balance ? (zeroBalance ? 'Join' : 'Add Liquidity') : 'Join'}
            </Button>
          </Box>
        )
      })
    )
  }

  function renderTokenList() {
    if (filteredTokenList.length === 0) {
      if (isAddress(searchQuery)) {
        if (temporaryToken === undefined) {
          return <Center>Searching for Token...</Center>
        } else if (temporaryToken === null) {
          return <Center>Address is not a valid VIP-180 token.</Center>
        } else {
          // a user found a token by search that isn't yet added to localstorage
          return (
            <Box
              key={temporaryToken.address}
              className={`temporary-token-${temporaryToken}`}
              onClick={() => {
                addToken(temporaryToken)
                _onTokenSelect(temporaryToken.address)
              }}
            >
              <RowFixed>
                <TokenLogo address={temporaryToken.address} size={'24px'} style={{ marginRight: '14px' }} />
                <Flex direction="column">
                  <Text>{temporaryToken.symbol}</Text>
                  <FadedSpan>(Found by search)</FadedSpan>
                </Flex>
              </RowFixed>
            </Box>
          )
        }
      } else {
        return <Center height="100%">{t('noToken')}</Center>
      }
    } else {
      return filteredTokenList.map(({ address, symbol, balance }) => {
        const urlAdded = urlAddedTokens?.some(token => token.address === address)
        const customAdded = userAddedTokens?.some(token => token.address === address) && !urlAdded

        const zeroBalance = balance && JSBI.equal(JSBI.BigInt(0), balance.raw)

        // if token import page dont show preset list, else show all
        return (
          <Flex
            p="4"
            justify="space-between"
            cursor="pointer"
            key={address}
            className={`token-item-${address}`}
            onClick={() => (hiddenToken && hiddenToken === address ? null : _onTokenSelect(address))}
            disabled={hiddenToken && hiddenToken === address}
            selected={otherSelectedTokenAddress === address}
          >
            <Flex>
              <Box mr="2">
                <TokenLogo address={address} size="36px" />
              </Box>
              <Flex direction="column" justify="flex-start">
                <Text>
                  {symbol}
                  {otherSelectedTokenAddress === address && <Text> ({otherSelectedText})</Text>}
                </Text>
                <FadedSpan>
                  <TYPE.main fontWeight={500}>
                    {urlAdded && 'Added by URL'}
                    {customAdded && 'Added by user'}
                  </TYPE.main>
                  {customAdded && (
                    <div
                      onClick={event => {
                        event.stopPropagation()
                        if (searchQuery === address) {
                          setSearchQuery('')
                        }
                        removeTokenByAddress(chainId, address)
                      }}
                    >
                      <Link style={{ marginLeft: '4px', fontWeight: 400 }}>(Remove)</Link>
                    </div>
                  )}
                </FadedSpan>
              </Flex>
            </Flex>
            <Flex>
              {balance ? (
                <Text>
                  {zeroBalance && showSendWithSwap ? (
                    <Button>
                      <Text align="center">Send With Swap</Text>
                    </Button>
                  ) : balance ? (
                    balance.toSignificant(6)
                  ) : (
                    '-'
                  )}
                </Text>
              ) : account ? (
                <SpinnerWrapper src={Circle} alt="loader" />
              ) : (
                '-'
              )}
            </Flex>
          </Flex>
        )
      })
    }
  }

  const Filter = ({ title, filter, filterType }: { title: string; filter: string; filterType: string }) => {
    return (
      <FilterWrapper
        onClick={() => {
          setActiveFilter(filter)
          setInvertSearchOrder(invertSearchOrder => !invertSearchOrder)
        }}
        selected={filter === activeFilter}
      >
        <Text>{title}</Text>
        {filter === activeFilter && filterType === 'tokens' && <Text>{!invertSearchOrder ? '↓' : '↑'}</Text>}
      </FilterWrapper>
    )
  }

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <ModalOverlay />
      <ModalContent borderRadius="4px" p={4} border="1px solid black">
        <Flex direction="column" justify="flex-start" width="100%">
          {showTokenImport ? (
            <div>
              <div>
                <div>
                  <CursorPointer>
                    <ArrowLeft
                      onClick={() => {
                        setShowTokenImport(false)
                      }}
                    />
                  </CursorPointer>
                  <Text>Import A Token</Text>
                </div>
                <CloseIcon onClick={onClose} />
              </div>
              <Text>To import a custom token, paste token address in the search bar.</Text>
              <Input
                // isDark={isDark}
                type={'text'}
                placeholder={'0x000000...'}
                value={searchQuery}
                ref={inputRef}
                onChange={onInput}
              />
              {renderTokenList()}
            </div>
          ) : (
            <Box>
              <HStack justify="space-between" mb="4">
                <Text>{filterType === 'tokens' ? 'Select A Token' : 'Select A Pool'}</Text>
                <CloseIcon onClick={onClose} size="16px" />
              </HStack>
              <Input
                // isDark={isDark}
                mb="4"
                type={'text'}
                id="token-search-input"
                placeholder={t('tokenSearchPlaceholder')}
                value={searchQuery}
                ref={inputRef}
                onChange={onInput}
              />
              <Flex>
                <Filter
                  title={filterType === 'tokens' ? 'Your Balances' : ' '}
                  filter={FILTERS.BALANCES}
                  filterType={filterType}
                />
              </Flex>
            </Box>
          )}
          {!showTokenImport && (
            <div
              style={{
                width: '100%',
                height: '1px',
                backgroundColor: isDark ? 'rgba(255, 255, 255, 0.16)' : 'rgba(99, 113, 142, 0.16)'
              }}
            />
          )}
          {!showTokenImport && (
            <Box overflowY="auto" height="50vh" border="1px solid black" borderRadius="4px">
              {filterType === 'tokens' ? renderTokenList() : renderPairsList()}
            </Box>
          )}
          {!showTokenImport && (
            <div
              style={{
                width: '100%',
                height: '1px',
                backgroundColor: isDark ? 'rgba(255, 255, 255, 0.16)' : 'rgba(99, 113, 142, 0.16)'
              }}
            />
          )}
          {!showTokenImport && (
            <Box mt="4">
              <div>
                {filterType !== 'tokens' && (
                  <Text>
                    {!isMobile && "Don't see a pool? "}
                    <Link to="/find">{!isMobile ? 'Import it.' : 'Import pool.'}</Link>
                  </Text>
                )}
                {filterType === 'tokens' && (
                  <Text>
                    {!isMobile && "Don't see a token? "}

                    <StyledLink
                      onClick={() => {
                        setShowTokenImport(true)
                      }}
                    >
                      {!isMobile ? 'Import it.' : 'Import custom token.'}
                    </StyledLink>
                  </Text>
                )}
              </div>
            </Box>
          )}
        </Flex>
      </ModalContent>
    </Modal>
  )
}
