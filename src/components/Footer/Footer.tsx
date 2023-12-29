import React from 'react'
import { Send } from 'react-feather'
import { Button } from '@chakra-ui/react'

import styles from './footer.module.scss'

export const Footer = () => {
  return (
    <div className={styles.footer}>
      <form action="https://discord.gg/bzvUNqTENp" target="_blank">
        <Button variant="primary" leftIcon={<Send size={16} />}>
          Feedback
        </Button>
      </form>
    </div>
  )
}
