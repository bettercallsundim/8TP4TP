import Nav from "./components/Nav";
import OauthProvider from "./components/OauthProvider";
import ReduxProvider from "./components/ReduxProvider";
import ThemeProvider from "./components/ThemeProvider";
import "./globals.css";
import "./index.css";

export const metadata = {
  title: "foodOgraphy",
  description: "foodOgraphy",
};

export default function RootLayout({ children }) {
  return (
    <ReduxProvider>
      <OauthProvider>
        <html className="roothtml" lang="en">
          <body className="poppins">
            <ThemeProvider>
              <Nav />
              {children}
            </ThemeProvider>
          </body>
        </html>
      </OauthProvider>
    </ReduxProvider>
  );
}
