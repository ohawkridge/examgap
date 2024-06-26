<template>
  <v-main>
    <v-container>
      <v-row class="d-flex justify-center">
        <v-col cols="12" md="10">
          <p class="text-h4">GDPR Compliance</p>
          <p class="text-subtitle-1">Last updated: Oct. 7, 2021</p>
          <p class="mb-8">
            Examgap (the Service) complies with the General Data Protection
            Regulation (GDPR). Examgap will process your personal data lawfully
            and fairly and not disclose it to third parties without your
            consent. Your personal information is collected only to the extent
            required to provide the Service.
          </p>
          <p class="text-h6">Data Collection</p>
          <p class="mb-8">
            Examgap collects some personal information. The collection of
            personal information is limited only to that which is essential for
            providing the Service. The
            <nuxt-link to="/privacy">privacy policy</nuxt-link> sets out more
            detail about how this information is stored and processed.
          </p>
          <p class="mb-8">
            Personal identification information for teachers: username, first
            name, last name, email address and school. Personal identification
            information for students: username (there is no requirement for this
            to be student's real name). Non-personal information is collected
            only to the extent required to run the Service (e.g. student's
            responses to questions, marks etc.).
          </p>
          <p class="text-h6">Cookie Policy</p>
          <p class="mb-8">
            <span class="font-weight-bold">Examgap does not use cookies.</span>
            However, third party cookies may be required for diagnostic and/or
            performance monitoring tools. For more information read our
            <nuxt-link to="/privacy">privacy policy</nuxt-link>. To learn more
            about cookies, you can visit
            <a href="https://www.allaboutcookies.org" target="_blank"
              >allaboutcookies.org</a
            ><font-awesome-icon
              icon="fa-light fa-arrow-up-right-from-square"
              class="fa-sm ml-1"
            />.
          </p>
          <p class="text-h6">SSL (TLS) encryption</p>
          <p class="mb-8">
            Examgap uses HTTPS connections by default. Communication with
            Examgap's network is secured with high-strength encryption and the
            modern TLS protocol, which has replaced the now deprecated SSL
            standard.
          </p>
          <p class="text-h6">Connected Services</p>
          <p class="mb-8">
            Examgap does not connect to your email or social media accounts.
            Examgap uses a content distribution network (CDN) called Netlify. It
            is possible for this service to reveal some information about users
            such as their approximate geographic location. Netlify is
            <a href="https://www.netlify.com/gdpr-ccpa">GDPR compliant</a>.
          </p>
          <p class="text-h6">GDPR Requests</p>
          <p class="mb-8">
            If you have any questions about Examgap’s privacy policy, the data
            we hold on you, or you would like to exercise one of your data
            protection rights, please do not hesitate to contact us. To make a
            GDPR request email
            <a href="mailto:support@examgap.com">support@examgap.com</a>.
          </p>
        </v-col>
      </v-row>
    </v-container>
  </v-main>
</template>

<script>
export default {
  layout: 'static',
  head() {
    return {
      title: 'GDPR Compliance',
    }
  },
}
</script>
