import React from 'react';
import styles from './ErrorMessage.module.css';

const ErrorMessage: React.FC = () => (
  <p className={styles.text}>There was an error, please try again...</p>
);

export default ErrorMessage;