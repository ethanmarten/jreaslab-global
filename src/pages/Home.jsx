import Hero from "../components/sections/Hero";
import Intro from "../components/sections/Intro";
import Services from "../components/sections/Services";
import Work from "../components/sections/Work";
import Process from "../components/sections/Process";
import CallToAction from "../components/sections/CallToAction";
import ContactForm from "../components/sections/ContactForm";
import { useLocale } from "../hooks/useLocale";
import { Link } from "react-router-dom";
import { Arrow } from "../components/ui/Elements";
export default function Home() {
  const { t, path } = useLocale();
  return (
    <>
      <Hero />
      <Intro />
      <Work />
      <Services />
      <Process />
      <section className="home-about section container">
        <span className="eyebrow">
          <i />
          {t("about.eyebrow")}
        </span>
        <h2 className="multiline">{t("about.title")}</h2>
        <div>
          <p>{t("about.description")}</p>
          <Link className="text-link" to={path("/about")}>
            {t("common.read")}
            <Arrow />
          </Link>
        </div>
      </section>
      <section className="home-contact section">
        <div className="container contact-layout">
          <div className="contact-copy">
            <span className="eyebrow">
              <i />
              {t("contact.eyebrow")}
            </span>
            <h2>{t("contact.title")}</h2>
            <p>{t("contact.description")}</p>
            <a href="mailto:info@jreaslab.com" className="contact-email">
              info@jreaslab.com
              <Arrow />
            </a>
            <a className="text-link" href="https://wa.me/970597747340">
              {t("common.whatsapp")}
              <Arrow />
            </a>
          </div>
          <ContactForm />
        </div>
      </section>
      <CallToAction />
    </>
  );
}
