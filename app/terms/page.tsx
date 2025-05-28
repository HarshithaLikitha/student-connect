import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export default function TermsOfServicePage() {
  return (
    <div className="container py-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-6">Terms of Service</h1>
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>1. Introduction</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p>
              Welcome to Student Connect. These Terms of Service govern your use of our website, services, and
              applications (collectively, the "Service"). By accessing or using the Service, you agree to be bound by
              these Terms.
            </p>
            <p>
              Please read these Terms carefully before using the Service. If you do not agree to all the terms and
              conditions of this agreement, you may not access or use the Service.
            </p>
          </CardContent>
        </Card>

        <Card className="mb-8">
          <CardHeader>
            <CardTitle>2. Eligibility</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p>
              To use the Service, you must be at least 13 years old and be a current student, educator, or alumni of an
              educational institution. By using the Service, you represent and warrant that you meet these eligibility
              requirements.
            </p>
            <p>
              If you are using the Service on behalf of an educational institution or organization, you represent and
              warrant that you have the authority to bind that institution or organization to these Terms.
            </p>
          </CardContent>
        </Card>

        <Card className="mb-8">
          <CardHeader>
            <CardTitle>3. User Accounts</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p>
              When you create an account with us, you must provide accurate, complete, and up-to-date information. You
              are responsible for safeguarding the password that you use to access the Service and for any activities or
              actions under your password.
            </p>
            <p>
              You agree not to disclose your password to any third party. You must notify us immediately upon becoming
              aware of any breach of security or unauthorized use of your account.
            </p>
          </CardContent>
        </Card>

        <Card className="mb-8">
          <CardHeader>
            <CardTitle>4. User Content</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p>
              Our Service allows you to post, link, store, share and otherwise make available certain information, text,
              graphics, videos, or other material ("Content"). You are responsible for the Content that you post on or
              through the Service, including its legality, reliability, and appropriateness.
            </p>
            <p>
              By posting Content on or through the Service, you represent and warrant that: (i) the Content is yours
              (you own it) or you have the right to use it and grant us the rights and license as provided in these
              Terms, and (ii) the posting of your Content on or through the Service does not violate the privacy rights,
              publicity rights, copyrights, contract rights or any other rights of any person.
            </p>
          </CardContent>
        </Card>

        <Card className="mb-8">
          <CardHeader>
            <CardTitle>5. Prohibited Uses</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p>
              You may use the Service only for lawful purposes and in accordance with these Terms. You agree not to use
              the Service:
            </p>
            <ul className="list-disc pl-6 space-y-2">
              <li>
                In any way that violates any applicable federal, state, local, or international law or regulation.
              </li>
              <li>For the purpose of exploiting, harming, or attempting to exploit or harm minors in any way.</li>
              <li>
                To transmit, or procure the sending of, any advertising or promotional material, including any "junk
                mail," "chain letter," "spam," or any other similar solicitation.
              </li>
              <li>To impersonate or attempt to impersonate another user, person, or entity.</li>
              <li>
                To engage in any other conduct that restricts or inhibits anyone's use or enjoyment of the Service, or
                which may harm Student Connect or users of the Service.
              </li>
            </ul>
          </CardContent>
        </Card>

        <Card className="mb-8">
          <CardHeader>
            <CardTitle>6. Intellectual Property</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p>
              The Service and its original content (excluding Content provided by users), features, and functionality
              are and will remain the exclusive property of Student Connect and its licensors. The Service is protected
              by copyright, trademark, and other laws of both the United States and foreign countries.
            </p>
            <p>
              Our trademarks and trade dress may not be used in connection with any product or service without the prior
              written consent of Student Connect.
            </p>
          </CardContent>
        </Card>

        <Card className="mb-8">
          <CardHeader>
            <CardTitle>7. Termination</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p>
              We may terminate or suspend your account immediately, without prior notice or liability, for any reason
              whatsoever, including without limitation if you breach the Terms.
            </p>
            <p>
              Upon termination, your right to use the Service will immediately cease. If you wish to terminate your
              account, you may simply discontinue using the Service or delete your account through the settings page.
            </p>
          </CardContent>
        </Card>

        <Card className="mb-8">
          <CardHeader>
            <CardTitle>8. Limitation of Liability</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p>
              In no event shall Student Connect, nor its directors, employees, partners, agents, suppliers, or
              affiliates, be liable for any indirect, incidental, special, consequential or punitive damages, including
              without limitation, loss of profits, data, use, goodwill, or other intangible losses, resulting from your
              access to or use of or inability to access or use the Service.
            </p>
          </CardContent>
        </Card>

        <Card className="mb-8">
          <CardHeader>
            <CardTitle>9. Changes to Terms</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p>
              We reserve the right, at our sole discretion, to modify or replace these Terms at any time. If a revision
              is material we will try to provide at least 30 days' notice prior to any new terms taking effect. What
              constitutes a material change will be determined at our sole discretion.
            </p>
            <p>
              By continuing to access or use our Service after those revisions become effective, you agree to be bound
              by the revised terms. If you do not agree to the new terms, please stop using the Service.
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>10. Contact Us</CardTitle>
          </CardHeader>
          <CardContent>
            <p>If you have any questions about these Terms, please contact us at legal@studentconnect.com.</p>
            <p className="text-sm text-muted-foreground mt-4">Last updated: October 15, 2023</p>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
