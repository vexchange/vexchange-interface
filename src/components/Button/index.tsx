import React from 'react'
import styled, { css } from 'styled-components'
import { darken, lighten } from 'polished'
import { Button, ButtonGroup } from '@chakra-ui/react'
import { useDarkMode } from 'usehooks-ts'
import { RowBetween } from '../Row'
import { ChevronDown } from 'react-feather'

const Base = styled(Button)<{ padding?: string; width?: string; borderRadius?: string }>``

export const ButtonPrimary = styled(Base)``

export const ButtonLight = styled(Base)``

export const ButtonGray = styled(Base)``

export const ButtonSecondary = styled(Base)``

export const ButtonPink = styled(Base)``

export const ButtonOutlined = styled(Base)``

export const ButtonEmpty = styled(Base)``

export const ButtonWhite = styled(Base)``

const ButtonConfirmedStyle = styled(Base)``

const ButtonErrorStyle = styled(Base)``

export function ButtonConfirmed({ confirmed, ...rest }: { confirmed?: boolean }) {
  if (confirmed) {
    return <ButtonConfirmedStyle {...rest} />
  } else {
    return <ButtonPrimary {...rest} />
  }
}

export function ButtonError({ error, ...rest }: { error?: boolean }) {
  const { isDarkMode } = useDarkMode()

  if (error) {
    return <ButtonErrorStyle {...rest} />
  } else {
    return <ButtonPrimary {...rest} />
  }
}

export function ButtonDropwdown({ disabled = false, children, ...rest }: { disabled?: boolean }) {
  return (
    <ButtonPrimary {...rest} disabled={disabled}>
      <RowBetween>
        <div style={{ display: 'flex', alignItems: 'center' }}>{children}</div>
        <ChevronDown size={24} />
      </RowBetween>
    </ButtonPrimary>
  )
}

export function ButtonDropwdownLight({ disabled = false, children, ...rest }: { disabled?: boolean }) {
  const { isDarkMode } = useDarkMode()

  return (
    <ButtonOutlined {...rest} disabled={disabled}>
      <RowBetween>
        <div style={{ display: 'flex', alignItems: 'center' }}>{children}</div>
        <ChevronDown size={24} />
      </RowBetween>
    </ButtonOutlined>
  )
}

export function ButtonRadio({ active, ...rest }: { active?: boolean }) {
  if (!active) {
    return <ButtonWhite {...rest} />
  } else {
    return <ButtonPrimary {...rest} />
  }
}
