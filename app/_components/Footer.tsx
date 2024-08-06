import Link from "next/link";
import {
  SlSocialGithub,
  SlSocialInstagram,
  SlSocialTwitter,
} from "react-icons/sl";

import styles from "./Footer.module.css";

export default function Footer() {
  return (
    <footer className={styles.footer}>
      <div className={styles.snsIcons}>
        <Link href="https://github.com/dakken205">
          <SlSocialGithub />
        </Link>
        <Link href="https://www.instagram.com/uoh_dakken">
          <SlSocialInstagram />
        </Link>
        <Link href="https://x.com/dakken205">
          <SlSocialTwitter />
        </Link>
      </div>
      <p className={styles.copyright}>
        © {new Date().getFullYear()}{" "}
        <a href="https://uoh-dakken.com">データ分析研究会</a> All rights
        reserved.
      </p>
    </footer>
  );
}
