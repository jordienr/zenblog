import Footer from "@/components/Footer";
import Navigation from "@/components/marketing/Navigation";

export default function ContactPage() {
  return (
    <div>
      <Navigation />
      <div className="prose mx-auto min-h-screen max-w-4xl">
        <h1>Contact</h1>
        <p>
          If you have any questions, feedback, or issues, please feel free to
          contact us by email.
        </p>
        <p className="font-mono">
          Email: <a href="mailto:support@zenblog.com">support@zenblog.com</a>
        </p>
        <p className="font-mono">
          Twitter: <a href="https://twitter.com/zenbloghq">@zenbloghq</a>
        </p>
        <p>
          Please make sure to include all relevant information so we can get
          back to you.
        </p>
      </div>
      <Footer />
    </div>
  );
}
