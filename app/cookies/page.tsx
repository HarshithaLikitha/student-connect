import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export default function CookiePolicyPage() {
  return (
    <div className="container py-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-6">Cookie Policy</h1>
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>1. Introduction</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p>
              This Cookie Policy explains how Student Connect ("we", "us", or "our") uses cookies and similar
              technologies to recognize you when you visit our website and use our services (collectively, the
              "Service"). It explains what these technologies are and why we use them, as well as your rights to control
              our use of them.
            </p>
            <p>
              Please read this Cookie Policy carefully. If you do not agree with our policies and practices, please do
              not use our Service.
            </p>
          </CardContent>
        </Card>

        <Card className="mb-8">
          <CardHeader>
            <CardTitle>2. What Are Cookies?</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p>
              Cookies are small data files that are placed on your computer or mobile device when you visit a website.
              Cookies are widely used by website owners in order to make their websites work, or to work more
              efficiently, as well as to provide reporting information.
            </p>
            <p>
              Cookies set by the website owner (in this case, Student Connect) are called "first-party cookies". Cookies
              set by parties other than the website owner are called "third-party cookies". Third-party cookies enable
              third-party features or functionality to be provided on or through the website (e.g., advertising,
              interactive content, and analytics).
            </p>
          </CardContent>
        </Card>

        <Card className="mb-8">
          <CardHeader>
            <CardTitle>3. Why Do We Use Cookies?</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p>
              We use first-party and third-party cookies for several reasons. Some cookies are required for technical
              reasons in order for our Service to operate, and we refer to these as "essential" or "strictly necessary"
              cookies. Other cookies also enable us to track and target the interests of our users to enhance the
              experience on our Service. Third parties serve cookies through our Service for advertising, analytics, and
              other purposes.
            </p>
            <p>
              The specific types of first and third-party cookies served through our Service and the purposes they
              perform are described below:
            </p>
            <ul className="list-disc pl-6 space-y-2">
              <li>
                <strong>Essential Cookies:</strong> These cookies are strictly necessary to provide you with services
                available through our Service and to use some of its features, such as access to secure areas. Without
                these cookies, services you have asked for cannot be provided.
              </li>
              <li>
                <strong>Performance and Functionality Cookies:</strong> These cookies are used to enhance the
                performance and functionality of our Service but are non-essential to their use. However, without these
                cookies, certain functionality may become unavailable.
              </li>
              <li>
                <strong>Analytics and Customization Cookies:</strong> These cookies collect information that is used
                either in aggregate form to help us understand how our Service is being used or how effective our
                marketing campaigns are, or to help us customize our Service for you.
              </li>
              <li>
                <strong>Advertising Cookies:</strong> These cookies are used to make advertising messages more relevant
                to you. They perform functions like preventing the same ad from continuously reappearing, ensuring that
                ads are properly displayed for advertisers, and in some cases selecting advertisements that are based on
                your interests.
              </li>
              <li>
                <strong>Social Media Cookies:</strong> These cookies are used to enable you to share pages and content
                that you find interesting on our Service through third-party social networking and other websites. These
                cookies may also be used for advertising purposes.
              </li>
            </ul>
          </CardContent>
        </Card>

        <Card className="mb-8">
          <CardHeader>
            <CardTitle>4. How Can You Control Cookies?</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p>
              You have the right to decide whether to accept or reject cookies. You can exercise your cookie preferences
              by clicking on the appropriate opt-out links provided in the cookie banner that appears when you first
              visit our website.
            </p>
            <p>
              You can also set or amend your web browser controls to accept or refuse cookies. If you choose to reject
              cookies, you may still use our Service though your access to some functionality and areas of our Service
              may be restricted. As the means by which you can refuse cookies through your web browser controls vary
              from browser to browser, you should visit your browser's help menu for more information.
            </p>
            <p>
              In addition, most advertising networks offer you a way to opt out of targeted advertising. If you would
              like to find out more information, please visit{" "}
              <a href="http://www.aboutads.info/choices/" className="text-primary hover:underline">
                http://www.aboutads.info/choices/
              </a>{" "}
              or{" "}
              <a href="http://www.youronlinechoices.com" className="text-primary hover:underline">
                http://www.youronlinechoices.com
              </a>
              .
            </p>
          </CardContent>
        </Card>

        <Card className="mb-8">
          <CardHeader>
            <CardTitle>5. The Cookies We Use</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p>The table below provides more information about the cookies we use and why:</p>
            <div className="overflow-x-auto">
              <table className="w-full border-collapse">
                <thead>
                  <tr className="bg-muted">
                    <th className="border p-2 text-left">Name</th>
                    <th className="border p-2 text-left">Provider</th>
                    <th className="border p-2 text-left">Purpose</th>
                    <th className="border p-2 text-left">Expiry</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td className="border p-2">_session</td>
                    <td className="border p-2">studentconnect.com</td>
                    <td className="border p-2">Used to maintain your session state across page requests</td>
                    <td className="border p-2">Session</td>
                  </tr>
                  <tr>
                    <td className="border p-2">_csrf</td>
                    <td className="border p-2">studentconnect.com</td>
                    <td className="border p-2">Used to prevent cross-site request forgery attacks</td>
                    <td className="border p-2">Session</td>
                  </tr>
                  <tr>
                    <td className="border p-2">_ga</td>
                    <td className="border p-2">Google Analytics</td>
                    <td className="border p-2">Used to distinguish users for analytics purposes</td>
                    <td className="border p-2">2 years</td>
                  </tr>
                  <tr>
                    <td className="border p-2">_gid</td>
                    <td className="border p-2">Google Analytics</td>
                    <td className="border p-2">Used to distinguish users for analytics purposes</td>
                    <td className="border p-2">24 hours</td>
                  </tr>
                  <tr>
                    <td className="border p-2">_fbp</td>
                    <td className="border p-2">Facebook</td>
                    <td className="border p-2">Used by Facebook to deliver advertisements</td>
                    <td className="border p-2">3 months</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>

        <Card className="mb-8">
          <CardHeader>
            <CardTitle>6. Changes to This Cookie Policy</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p>
              We may update this Cookie Policy from time to time in order to reflect, for example, changes to the
              cookies we use or for other operational, legal, or regulatory reasons. Please therefore revisit this
              Cookie Policy regularly to stay informed about our use of cookies and related technologies.
            </p>
            <p>The date at the bottom of this Cookie Policy indicates when it was last updated.</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>7. Contact Us</CardTitle>
          </CardHeader>
          <CardContent>
            <p>
              If you have any questions about our use of cookies or other technologies, please contact us at
              privacy@studentconnect.com.
            </p>
            <p className="text-sm text-muted-foreground mt-4">Last updated: October 15, 2023</p>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
