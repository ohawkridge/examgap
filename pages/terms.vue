<template>
  <v-main>
    <v-container class="static-page-container">
      <v-row class="d-flex justify-center">
        <v-col cols="12" md="10">
          <p class="text-h4">Terms of Service</p>
          <p class="text-subtitle-1">Last updated: January 8, 2021</p>
          <p>
            Please read these Terms of Service ("Terms", "Terms and Conditions")
            carefully before using Examgap (the "Service").
          </p>
          <p>
            Your access to and use of the Service is conditioned on your
            acceptance of and compliance with these Terms. These Terms apply to
            all visitors, users and others who access or use the Service.
            <strong>The Service is provided on an as-is basis.</strong>
          </p>
          <p>
            By accessing or using the Service you agree to be bound by these
            Terms. If you disagree with any part of the terms then you may not
            access the Service. Terms of service for Examgap based on the T&C
            example from TermsFeed.
          </p>
          <p class="text-h6">Accounts</p>
          <p>
            When you create an account or an account is created for you with
            Examgap, you must provide information that is accurate, complete,
            and current at all times. Failure to do so constitutes a breach of
            the Terms, which may result in immediate termination of your account
            on our Service.
          </p>
          <p>
            You are responsible for safeguarding the password that you use to
            access the Service and for any activities or actions under your
            password. You agree not to disclose your password to any third
            party. You must notify me immediately upon becoming aware of any
            breach of security or unauthorised use of your account.
          </p>
          <p class="text-h6">Termination</p>
          <p>
            Examgap may terminate or suspend access to the Service immediately,
            without prior notice or liability, for any reason whatsoever,
            including without limitation if you breach the Terms. Examgap may
            terminate or suspend your account immediately, without prior notice
            or liability, for any reason whatsoever, including without
            limitation if you breach the Terms.
          </p>
          <p>
            All provisions of the Terms which by their nature should survive
            termination shall survive termination, including, without
            limitation, ownership provisions, warranty disclaimers, indemnity
            and limitations of liability.
          </p>
          <p>
            Upon termination, your right to use the Service will immediately
            cease. If you wish to terminate your account, you may simply
            discontinue using the Service. In compliance with the General Data
            Protection Regulation, you may also request your account and all
            related personal data deleted by emailing support@examgap.com.
          </p>
          <p class="text-h6">Governing Law</p>
          <p>
            These Terms shall be governed and construed in accordance with the
            laws of United Kingdom, without regard to its conflict of law
            provisions.
          </p>
          <p>
            Our failure to enforce any right or provision of these Terms will
            not be considered a waiver of those rights. If any provision of
            these Terms is held to be invalid or unenforceable by a court, the
            remaining provisions of these Terms will remain in effect. These
            Terms constitute the entire agreement between us regarding our
            Service, and supersede and replace any prior agreements we might
            have between us regarding the Service.
          </p>
          <p class="text-h6">Changes</p>
          <p>
            Examgap reserves the right, at its sole discretion, to modify or
            replace these Terms at any time. If a revision is material we will
            try to provide at least 30 days notice prior to any new terms taking
            effect. What constitutes a material change will be determined at our
            sole discretion. By continuing to access or use the Service after
            those revisions become effective—you agree to be bound by the
            revised terms. If you do not agree to the new terms, please stop
            using the Service.
          </p>
          <p class="text-h6">Third Party Services</p>
          <p>
            Examgap will always seek to minimise or eliminate the need for third
            party services, for example, for analytics. Our service has no
            desire or need to track users. However, it may use third party
            services to monitor your usage of the service in order to improve
            its quality and performance. By using the service you agree to the
            collection of this data. This data will not be shared. Furthermore,
            it will promptly be deleted once the relevant improvements have been
            made. Currently, the only third party service is use on Examgap is
            Hotrar. You can read more about Hotjar and your privacy in our
            <nuxt-link to="/privacy">privacy policy</nuxt-link>.
          </p>
          <p class="text-h6">Contact</p>
          <p>
            If you have any questions about these Terms, please email
            <a href="mailto:support@examgap.com">support@examgap.com</a>.
          </p>
          <p class="text-h6">Changes to this policy</p>
          <ul>
            <li>8 Jan 2021—Add reference to Hotjar.</li>
            <li>25 Aug 2020—Style updates; Third party services.</li>
            <li>17 Feb 2020—Corrected grammar.</li>
            <li>3 Mar 2019—Style changes.</li>
            <li>
              8 Feb 2019—Removed section on links to other sites. Removed
              duplicated statements. Formatting changes.
            </li>
          </ul>
        </v-col>
      </v-row>
    </v-container>
  </v-main>
</template>

<script>
export default {
  layout: "EgIndex",
  head() {
    return {
      title: "Terms of Service",
    };
  },
};
</script>
