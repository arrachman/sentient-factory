import type { ReactNode } from "react";
import clsx from "clsx";
import Link from "@docusaurus/Link";
import useDocusaurusContext from "@docusaurus/useDocusaurusContext";
import Layout from "@theme/Layout";
import Heading from "@theme/Heading";

import { PRODUCT_DOCS } from "../../config/products";
import styles from "./index.module.css";

function HomepageHeader(): ReactNode {
  const { siteConfig } = useDocusaurusContext();
  return (
    <header className={clsx("hero hero--primary", styles.heroBanner)}>
      <div className="container">
        <Heading as="h1" className="hero__title">
          {siteConfig.title}
        </Heading>
        <p className="hero__subtitle">{siteConfig.tagline}</p>
      </div>
    </header>
  );
}

function ProductPortal(): ReactNode {
  return (
    <section className="container">
      <div className={styles.productGrid}>
        {PRODUCT_DOCS.map((product) => (
          <Link
            key={product.id}
            className={styles.productCard}
            to={product.routeBasePath}
          >
            <Heading as="h2">{product.label}</Heading>
            <p className={styles.productTagline}>{product.tagline}</p>
            <span className="button button--primary button--block">
              Buka Dokumentasi
            </span>
          </Link>
        ))}
      </div>
    </section>
  );
}

export default function Home(): ReactNode {
  const { siteConfig } = useDocusaurusContext();
  return (
    <Layout
      title={siteConfig.title}
      description="Portal dokumentasi produk Senti — HR, ERP, dan MDP."
    >
      <HomepageHeader />
      <main>
        <ProductPortal />
      </main>
    </Layout>
  );
}
