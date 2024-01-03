import React from 'react'
import styled from 'styled-components'
import { NavigationTabs } from '../../components/NavigationTabs'

import styles from './app-body.module.scss'

/**
 * The styled container element that wraps the content of most pages and the tabs.
 */
export default function AppBody({ children }: { children: React.ReactNode }) {
  return (
    <div className={styles['body-wrapper']}>
      <NavigationTabs />
      <>{children}</>
    </div>
  )
}
