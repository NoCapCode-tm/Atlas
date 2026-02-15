 import styles from "../CSS/InfoTooltip.module.css"
 
 export function InfoTooltip({ text }) {
  return (
    <span className={styles.tooltipWrap}>
      <span className={styles.infoIcon}>i</span>
      <span className={styles.tooltipText}>{text}</span>
    </span>
  );
}