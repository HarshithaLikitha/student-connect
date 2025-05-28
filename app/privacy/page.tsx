import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export default function PrivacyPolicyPage() {
  return (
    <div className="container py-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-6">Privacy Policy</h1>
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>1. Introduction</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p>
              At Student Connect, we respect your privacy and are committed to protecting your personal data. This
              Privacy Policy explains how we collect, use, disclose, and safeguard your information when you use our
              website, services, and applications (collectively, the "Service").
            </p>
            <p>
              Please read this Privacy Policy carefully. If you do not agree with the terms of this Privacy Policy,
              please do not access the Service.
            </p>
          </CardContent>
        </Card>

        <Card className="mb-8">
          <CardHeader>
            <CardTitle>2. Information We Collect</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p>We collect several types of information from and about users of our Service, including:</p>
            <ul className="list-disc pl-6 space-y-2">
              <li>
                <strong>Personal Data:</strong> First name, last name, email address, educational institution, field of
                study, and profile information you provide.
              </li>
              <li>
                <strong>Profile Data:</strong> Your profile picture, bio, skills, interests, and links to external
                profiles (such as GitHub and LinkedIn).
              </li>
              <li>
                <strong>Usage Data:</strong> Information about how you use our Service, including communities you join,
                events you attend, projects you participate in, and messages you send.
              </li>
              <li>
                <strong>Technical Data:</strong> IP address, browser type and version, time zone setting, browser
                plug-in types and versions, operating system and platform, and other technology on the devices you use
                to access the Service.
              </li>
            </ul>
          </CardContent>
        </Card>

        <Card className="mb-8">
          <CardHeader>
            <CardTitle>3. How We Collect Your Data</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p>We use different methods to collect data from and about you, including:</p>
            <ul className="list-disc pl-6 space-y-2">
              <li>
                <strong>Direct Interactions:</strong> You may provide us with your Personal Data by filling in forms,
                creating an account, or by corresponding with us by email or otherwise.
              </li>
              <li>
                <strong>Automated Technologies:</strong> As you interact with our Service, we may automatically collect
                Technical Data about your equipment, browsing actions, and patterns.
              </li>
              <li>
                <strong>Third Parties:</strong> We may receive Personal Data about you from various third parties, such
                as analytics providers, social networks (if you choose to link your accounts), and educational
                institutions.
              </li>
            </ul>
          </CardContent>
        </Card>

        <Card className="mb-8">
          <CardHeader>
            <CardTitle>4. How We Use Your Data</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p>
              We will only use your Personal Data when the law allows us to. Most commonly, we will use your Personal
              Data in the following circumstances:
            </p>
            <ul className="list-disc pl-6 space-y-2">
              <li>To provide and maintain our Service.</li>
              <li>To notify you about changes to our Service.</li>
              <li>To allow you to participate in interactive features of our Service.</li>
              <li>To provide customer support.</li>
              <li>To gather analysis or valuable information so that we can improve our Service.</li>
              <li>To monitor the usage of our Service.</li>
              <li>To detect, prevent and address technical issues.</li>
              <li>
                To provide you with news, special offers and general information about other goods, services and events
                which we offer.
              </li>
            </ul>
          </CardContent>
        </Card>

        <Card className="mb-8">
          <CardHeader>
            <CardTitle>5. Disclosure of Your Data</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p>We may share your Personal Data with the following parties:</p>
            <ul className="list-disc pl-6 space-y-2">
              <li>
                <strong>Service Providers:</strong> We may share your data with third-party vendors, service providers,
                contractors or agents who perform services for us or on our behalf.
              </li>
              <li>
                <strong>Educational Institutions:</strong> We may share information with your educational institution if
                you are using the Service through an institutional partnership.
              </li>
              <li>
                <strong>Other Users:</strong> When you share personal information or otherwise interact in the public
                areas with other users, such information may be viewed by all users and may be publicly distributed.
              </li>
              <li>
                <strong>Business Transfers:</strong> If we are involved in a merger, acquisition, or sale of all or a
                portion of our assets, your data may be transferred as part of that transaction.
              </li>
              <li>
                <strong>Legal Requirements:</strong> We may disclose your information where we are legally required to
                do so.
              </li>
            </ul>
          </CardContent>
        </Card>

        <Card className="mb-8">
          <CardHeader>
            <CardTitle>6. Data Security</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p>
              We have implemented appropriate security measures to prevent your Personal Data from being accidentally
              lost, used, or accessed in an unauthorized way, altered, or disclosed. In addition, we limit access to
              your Personal Data to those employees, agents, contractors, and other third parties who have a business
              need to know.
            </p>
            <p>
              However, please note that no method of transmission over the Internet or method of electronic storage is
              100% secure. While we strive to use commercially acceptable means to protect your Personal Data, we cannot
              guarantee its absolute security.
            </p>
          </CardContent>
        </Card>

        <Card className="mb-8">
          <CardHeader>
            <CardTitle>7. Your Data Protection Rights</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p>Depending on your location, you may have the following data protection rights:</p>
            <ul className="list-disc pl-6 space-y-2">
              <li>The right to access, update or delete the information we have on you.</li>
              <li>
                The right of rectification - the right to have your information corrected if it is inaccurate or
                incomplete.
              </li>
              <li>The right to object to our processing of your Personal Data.</li>
              <li>
                The right of restriction - the right to request that we restrict the processing of your personal
                information.
              </li>
              <li>
                The right to data portability - the right to be provided with a copy of the information we have on you
                in a structured, machine-readable and commonly used format.
              </li>
              <li>
                The right to withdraw consent - the right to withdraw your consent at any time where we relied on your
                consent to process your personal information.
              </li>
            </ul>
          </CardContent>
        </Card>

        <Card className="mb-8">
          <CardHeader>
            <CardTitle>8. Children's Privacy</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p>
              Our Service is not intended for children under the age of 13. We do not knowingly collect personally
              identifiable information from children under 13. If you are a parent or guardian and you are aware that
              your child has provided us with Personal Data, please contact us. If we become aware that we have
              collected Personal Data from children without verification of parental consent, we take steps to remove
              that information from our servers.
            </p>
          </CardContent>
        </Card>

        <Card className="mb-8">
          <CardHeader>
            <CardTitle>9. Changes to This Privacy Policy</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p>
              We may update our Privacy Policy from time to time. We will notify you of any changes by posting the new
              Privacy Policy on this page and updating the "Last updated" date.
            </p>
            <p>
              You are advised to review this Privacy Policy periodically for any changes. Changes to this Privacy Policy
              are effective when they are posted on this page.
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>10. Contact Us</CardTitle>
          </CardHeader>
          <CardContent>
            <p>If you have any questions about this Privacy Policy, please contact us at privacy@studentconnect.com.</p>
            <p className="text-sm text-muted-foreground mt-4">Last updated: October 15, 2023</p>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
