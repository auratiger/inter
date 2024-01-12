import Document, { Head, Html, Main, NextScript } from "next/document";

import cx from "classnames";

import { inter, sfPro } from "../styles/fonts";

const AppConfig = {
  site_name: "Starter",
  title: "Nextjs Starter",
  description: "Starter code for your Nextjs Boilerplate with Tailwind CSS",
  locale: "en",
};

// Need to create a custom _document because i18n support is not compatible with `next export`.
class MyDocument extends Document {
  // eslint-disable-next-line class-methods-use-this
  render() {
    return (
      <Html lang={AppConfig.locale}>
        <Head />
        <body className={cx(sfPro.variable, inter.variable)}>
          <Main />
          <NextScript />
        </body>
      </Html>
    );
  }
}

export default MyDocument;
