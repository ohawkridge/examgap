<template>
  <v-main>
    <v-container class="static-page-container">
      <v-row class="d-flex justify-center">
        <v-col cols="12" md="10">
          <p class="text-h4">Privacy Policy</p>
          <p class="text-subtitle-1">Last updated: January 8, 2021</p>
          <p>
            This policy applies to all information collected or submitted on the
            Examgap website (the Service). This page is used to inform users of
            the Service regarding our policies with the collection, use, and
            disclosure of personal information if anyone decided to use our
            Service.
          </p>
          <p>
            This Service is intended for use as is. If you choose to use the
            Service, then you agree to the collection and use of information in
            relation to this policy. The personal information that we collect is
            used for providing and improving the Service. We will not use or
            share your information with anyone except as described in this
            privacy policy.
          </p>
          <p class="mb-8">
            The terms used in this privacy policy have the same meanings as in
            the Terms and Conditions, which are accessible
            <nuxt-link to="/terms">here</nuxt-link> unless otherwise defined in
            this privacy policy.
          </p>
          <p class="text-h6">Information Collection and Use</p>
          <p>
            For a better experience, while using the Service, we may require you
            to provide certain personally identifiable information, including
            but not limited to username, first name, last name, email address,
            and school or college. The information that we request is retained
            on Examgap's servers and only used for the purposes of providing the
            Service.
            <span class="font-weight-bold"
              >Examgap does not share personal information with outside parties
              for the purposes of marketing.</span
            >
            Examgap may use third party analytics services for the purposes of
            improving the Service (more below).
          </p>
          <p class="mb-8">
            Examgap uses Hotjar in order to better understand users’ needs and
            to optimize this service and experience. Hotjar is a technology
            service that helps us better understand our users’ experience (e.g.,
            how much time they spend on which pages, which links they choose to
            click, what users do and don’t like, etc.) and this enables us to
            build and maintain our service with user feedback. Hotjar uses
            cookies and other technologies to collect data on our users’
            behavior and their devices. This includes a device's IP address
            (processed during your session and stored in a de-identified form),
            device screen size, device type (unique device identifiers), browser
            information, geographic location (country only), and the preferred
            language used to display our website. Hotjar stores this information
            on our behalf in a pseudonymised user profile. Hotjar is
            contractually forbidden to sell any of the data collected on our
            behalf. For further details, please see the ‘<a
              href="https://help.hotjar.com/hc/en-us/categories/115001323967-About-Hotjar"
              target="_blank"
              >about Hotjar</a
            >’<font-awesome-icon
              icon="fa-light fa-arrow-up-right-from-square fa-sm"
            />
            section of Hotjar’s support site.
          </p>
          <p class="text-h6">Log Data</p>
          <p class="mb-8">
            We want to inform you that whenever you use my Service, in a case of
            an error in the Service we collect data and information (possibly
            including through third party products) called Log Data. This Log
            Data may include information such as your device Internet Protocol
            (“IP”) address, device name, operating system version, the
            configuration of your device when utilising the Service, the time
            and date of your use of the Service, and other statistics.
          </p>
          <p class="text-h6">Cookies</p>
          <p class="mb-8">
            Cookies are files with small amounts of data that are commonly used
            on modern websites. Examgap does not use cookies. However, third
            party analytics and monitoring tools may do so. Examgap does use
            local storage. Cookies are sent to your browser from a server and
            are stored on your device's internal memory.
            <span class="font-weight-bold"
              >This Service does not explicitly set first party cookies</span
            >
            in order for the Service to function. However, the Service may use
            third party code and libraries that use cookies to collect
            information and to improve the Service.
          </p>
          <p class="text-h6">Security</p>
          <p class="mb-8">
            We value your trust in providing us your personal information, thus
            we strive to use commercially acceptable means of protecting it. But
            remember that no method of transmission over the internet, or method
            of electronic storage is 100% secure and reliable, and we cannot
            guarantee its absolute security. We implement a variety of security
            measures to help keep your information secure. For instance,
            communication with the website requires HTTPS by default. Passwords
            are hashed, not stored, using industry-standard methods.
          </p>
          <p class="text-h6">Children’s privacy</p>
          <p class="mb-8">
            This Service is aimed at secondary school teachers and their pupils.
            It does not generally address anyone under the age of 13, however
            some younger secondary pupils may fall into this category. The
            personal information collected is limited only to that which is
            essential to deliver the Service, namely username, possibly school
            or college, and responses to exam questions. There is no requirement
            for the username to be the individual's real name. If you are a
            parent or guardian and you are aware that your child has provided us
            with personal information, please contact
            <a href="mailto:support@examgap.com">support@examgap.com</a>.
          </p>
          <p class="text-h6">Changes</p>
          <p class="mb-8">
            We may update this policy from time to time. Thus, you are advised
            to review this page periodically for any changes. We will notify you
            of any changes by posting the new Privacy policy on this page.
            Changes are detailed at the bottom of the page. These changes are
            effective immediately after they are posted on this page.
          </p>
          <p class="text-h6">Contact</p>
          <p class="mb-8">
            If you have any questions or suggestions about this policy do not
            hesitate to
            <a href="mailto:support@examgap.com">contact us</a>.
          </p>
          <p class="text-h6">Changes to this policy</p>
          <ul>
            <li>7 Oct. 2021—Examgap does not use first party cookies.</li>
            <li>8 Jan. 2021—Added Hotjar paragraph.</li>
            <li>25 Aug. 2020—Formatting updates.</li>
            <li>22 Dec. 2019—Style updates.</li>
            <li>3 Mar. 2019—Style changes. Removed some unneeded phrases.</li>
            <li>
              8 Feb. 2019— Removed unneeded sections (Service Providers, Links
              to Other Sites). Editing for grammar. Additional security
              information. GDPR information moved to
              <nuxt-link to="/gdpr">dedicated page</nuxt-link>.
            </li>
          </ul>
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
      title: 'Privacy Policy',
    }
  },
}
</script>
